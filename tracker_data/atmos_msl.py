#directory paths
_work_dir='/g/data/gv90/as2285/miz/'
_data_dir='/g/data/rt52/era5/single-levels/reanalysis/'
_output_data_dir='/g/data/gv90/P6_data/'

MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

#useful py libraries
import xarray as xr
import numpy as np
import odc.geo.xr
from dea_tools.spatial import subpixel_contours
from affine import Affine

from topojson import Topology

from glob import iglob 

for iVar in ['msl']:
    
    files=list()
    for iFile in iglob(f'{_data_dir}/{iVar}/*/*.nc', recursive=True):
        files.append(iFile)

    temp_ds=xr.open_mfdataset(files, chunks='auto')
    
    temp_ds=temp_ds.where(temp_ds.latitude<-40, drop=True)
    
    temp_ds=temp_ds.where(temp_ds.time.dt.year>=1995, drop=True)

    temp_da=temp_ds[iVar].resample(time='D').mean('time')/100 #hectoPascals
    
    temp_da=temp_da.odc.assign_crs("epsg:4326")

    for i in temp_da.time.values:
        
        loaded = temp_da.sel(time=i).load()

        lines=subpixel_contours(
            loaded, 
            z_values=np.arange(800,1201,10)
            , min_vertices=15, crs='epsg:4326'
        )

        Topology(lines.explode(index_parts=False)).to_json(
            f'{_output_data_dir}/tracker_data/atmos/msl_lines/msl_'+str(i).split('T')[0]+'.json', 
        )
        
        