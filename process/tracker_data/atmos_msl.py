# Process ERA5 sea-level pressure (replicated in rt52 project), to daily pressure maps for the southern ocean (to use in Nilas).
# Input is hourly ERA5 data as netcdf, out put is geojson files with daily sea level pressure

# for output files, which year to start at
START_YEAR='2023'

#useful py libraries
import xarray as xr
import numpy as np
import odc.geo.xr
from dea_tools.spatial import subpixel_contours
from affine import Affine
from topojson import Topology
from glob import iglob 

import os 

#directory paths
_work_dir=f'/g/data/gv90/{os.environ["USER"]}/miz/'
_data_dir='/g/data/rt52/era5/single-levels/reanalysis/'
_data_dir_nrt='/g/data/rt52/era5t/single-levels/reanalysis/'
_output_data_dir='/g/data/gv90/P6_data/'

iVar='msl'

files=list()
for iFile in iglob(f'{_data_dir_nrt}/{iVar}/*/*.nc', recursive=True):
    files.append(iFile)

nrt_monthly_ds = xr.open_mfdataset(files).resample(time='ME').mean('time')

files=list()
for iFile in iglob(f'{_data_dir}/{iVar}/202[3-9]/*.nc', recursive=True):
    files.append(iFile)

temp_ds=xr.merge([
    xr.open_mfdataset(files),
    nrt_monthly_ds
    ],compat='override' #preference 1st dataset
)

temp_ds=temp_ds.where(temp_ds.latitude<-40, drop=True)
temp_ds=temp_ds.where(temp_ds.time.dt.year>=int(START_YEAR), drop=True)
temp_da=temp_ds['msl'].resample(time='D').mean('time')/100 #hectoPascals

temp_da=temp_da.odc.assign_crs("epsg:4326")
for i in temp_da.time.values:

    loaded = temp_da.sel(time=i).load()

    lines=subpixel_contours(
        loaded, 
        z_values=np.arange(800,1201,10),
        min_vertices=15, 
        crs='epsg:4326'
    )

    Topology(lines.explode(index_parts=False)).to_json(
        f'{_output_data_dir}/tracker_data/atmos/msl_lines/msl_'+str(i).split('T')[0]+'.json', 
    )

temp_da=temp_ds[iVar].resample(time='M').mean('time')/100 #hectoPascals
# CLIMAT_SLICE=slice('1981','2010')
#climat_da=temp_da.sel(time=CLIMAT_SLICE).groupby('time.month').mean('time')
climat_da=xr.load_dataarray(f'{_work_dir}/process/tracker_data/data/msl_climat.nc')

anoms_da=temp_da.groupby('time.month')-climat_da
anoms_da=anoms_da.odc.assign_crs("epsg:4326")
for i in anoms_da.time:
    loaded = anoms_da.sel(time=i).load()
    lines=subpixel_contours(
        loaded, 
        z_values=np.arange(-250,251,1),
        min_vertices=15, 
        crs='epsg:4326'
    )
    Topology(lines.explode(index_parts=False)).to_json(
        f'{_output_data_dir}tracker_data/atmos/msl_anoms_lines/msl_anom_{i.dt.year.values}_{i.dt.month.values}.json',
    )
        
