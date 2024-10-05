# Process ERA5 temperatures (replicated in rt52 project), to produce monthly mean and monthly anomalies of air temperature for the southern ocean (to use in Nilas).
# Input is hourly ERA5 data as netcdf, out put is geotiff files with monthly mean and monthly anomalies

# for output files, which year to start at
# START_YEAR='2024' 

import os 

#directory paths
_work_dir=f'/g/data/gv90/{os.environ["USER"]}/miz/'
_data_dir='/g/data/rt52/era5/single-levels/reanalysis/'
_data_dir_nrt='/g/data/rt52/era5t/single-levels/reanalysis/'
_output_data_dir='/g/data/gv90/P6_data/'

import xarray as xr
import numpy as np
from datacube.utils.cog import write_cog
import odc.geo.xr
from glob import iglob 

# import local functions
import sys
sys.path.append(_work_dir)
from utils.climat import climatology
iVar='2t'

files=list()
for iFile in iglob(f'{_data_dir_nrt}/{iVar}/*/*.nc', recursive=True):
    files.append(iFile)

nrt_monthly_ds = xr.open_mfdataset(files).resample(time='ME').mean('time')

files=list()
for iFile in iglob(f'{_data_dir}/{iVar}/202[3-9]/*.nc', recursive=True):
    files.append(iFile)

temp_ds=xr.merge([
    xr.open_mfdataset(files).resample(time='ME').mean('time'),
    nrt_monthly_ds
    ],compat='override' #preference 1st dataset
)

temp_ds=temp_ds.where(temp_ds.latitude<-35, drop=True)

temp_da=temp_ds['t2m']-273.15

## Map GeoBoxes
temp_da=temp_da.odc.assign_crs("epsg:4326")

src_geobox=temp_da.odc.geobox
map_geobox = odc.geo.geobox.GeoBox.from_bbox(
    [-4500000,-4500000,4500000,4500000],
    "epsg:3976",
    resolution=10000
    )
newNd = np.ndarray([900,900])

## Map Files
datetimes_xr=temp_da.time

for iTime in datetimes_xr:
    odc.geo.xr.rio_reproject(
        temp_da.sel(time=iTime, drop=True),
        newNd,
        src_geobox,
        map_geobox,
        'bilinear',
    )

    new_xr=odc.geo.xr.wrap_xr(
        newNd,
        map_geobox
    )

    write_cog(
        new_xr, 
            f'{_output_data_dir}tracker_data/atmos/{iVar}_cog/{iVar}_{iTime.dt.year.values}_{iTime.dt.month.values}.tiff', 
                overwrite=True
                )

#Monthly anoms
# climat_temp_ds=climatology(temp_da)
# climat_temp_ds.to_netcdf(f'{_work_dir}data/{iVar}_climat.nc')
climat_temp_ds=xr.load_dataset(f'{_work_dir}/process/tracker_data/data/{iVar}_climat.nc')
temp_anoms_da=temp_da.groupby('time.month')-climat_temp_ds.ave

for iTime in datetimes_xr:
    odc.geo.xr.rio_reproject(
        temp_anoms_da.sel(time=iTime, drop=True),
        newNd,
        src_geobox,
        map_geobox,
        'bilinear',
    )

    new_xr=odc.geo.xr.wrap_xr(
        newNd,
        map_geobox
    )

    write_cog(
        new_xr,
        f'{_output_data_dir}tracker_data/atmos/{iVar}_anoms_cog/{iVar}_{iTime.dt.year.values}_{iTime.dt.month.values}.tiff',
        overwrite=True
    )
