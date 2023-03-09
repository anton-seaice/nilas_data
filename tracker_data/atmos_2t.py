#directory paths
_work_dir='/g/data/gv90/as2285/miz/'
_data_dir='/g/data/rt52/era5/single-levels/reanalysis/'
_output_data_dir='/g/data/gv90/P6_data/'

import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
from affine import Affine
from datacube.utils.cog import write_cog
import odc.geo.xr

# import local functions
import sys
sys.path.append(_work_dir)
from utils.climat import climatology

from glob import iglob 

for iVar in [#'mn2t',
    #'mx2t', 
    '2t' 
]:
    files=list()
    for iFile in iglob(f'{_data_dir}/{iVar}/*/*.nc', recursive=True):
        files.append(iFile)

    temp_ds=xr.open_mfdataset(files) #, parallel=True)
    
    temp_ds=temp_ds.where(temp_ds.latitude<-35, drop=True)

    match iVar:
        # (daily processing produced too much data - 90GB per dataset
        # case 'mn2t':
        #     temp_da=temp_ds[iVar].resample(time='D').min('time')-273.15
        # case 'mx2t':
        #     temp_da=temp_ds[iVar].resample(time='D').max('time')-273.15
        case '2t':
            temp_da=temp_ds['t2m'].resample(time='M').mean('time')-273.15

    ## Map GeoBoxes
    temp_da=temp_da.odc.assign_crs("epsg:4326")

    src_geobox=temp_da.odc.geobox

    map_geobox = odc.geo.geobox.GeoBox.from_bbox(
        [-4500000,-4500000,4500000,4500000],
        "epsg:3976",
        resolution=10000
        )
    newNd = np.ndarray([900,900])

    ## Temperature Map Files

    START_YEAR='2022'

    datetimes_xr=temp_da.sel(time=slice(START_YEAR,'2050')).time

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
        
        match iVar:
            case 'mn2t'|'mx2t':
                write_cog(
                    new_xr, 
                    f'{_output_data_dir}tracker_data/atmos/{iVar}_cog/{iVar}_{iTime.dt.year.values}_{iTime.dt.month.values}_{iTime.dt.day.values}.tiff', 
                    overwrite=True
                    )
            case '2t':
                write_cog(
                    new_xr, 
                    f'{_output_data_dir}tracker_data/atmos/{iVar}_cog/{iVar}_{iTime.dt.year.values}_{iTime.dt.month.values}.tiff', 
                    overwrite=True
                    )
            
    if iVar=='2t':
        # climat_temp_ds=climatology(temp_da)
        # climat_temp_ds.to_netcdf(f'{_work_dir}data/{iVar}_climat.nc')
        climat_temp_ds=xr.load_dataset(f'{_work_dir}data/{iVar}_climat.nc')
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
