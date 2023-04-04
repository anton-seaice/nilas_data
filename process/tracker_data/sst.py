#directory paths
_work_dir='/g/data/gv90/as2285/miz/'
_data_dir='/g/data/gv90/P6_data/'

#useful py libraries
import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import odc.geo.xr
from datacube.utils.cog import write_cog
from sys import argv 


# import local functions
#import sys
#sys.path.append(_work_dir)
#from utils.climat import climatology
try:
    
    sst_daily_ds=xr.open_mfdataset(argv[1:])
    sst_daily_da=(sst_daily_ds.analysed_sst-273.15)
    sst_monthly_da=sst_daily_da.resample(time="M").mean('time')

    #climat_sst_ds=climatology(sst_monthly_da)
    #climat_sst_ds.to_netcdf(f'{_work_dir}data/sst_climat.nc')

    climat_sst_ds=xr.open_dataset(f'{_work_dir}/process/tracker_data/data/sst_climat.nc') 

    anoms_da=sst_monthly_da.groupby('time.month')-climat_sst_ds.ave

    src_geobox=odc.geo.geobox.GeoBox.from_bbox(
        [-180,-90,180,90],
        "epsg:4326",
        shape=[3600,7200]
        )

    map_geobox = odc.geo.geobox.GeoBox.from_bbox(
        [-4500000,-4500000,4500000,4500000],
        "epsg:3976",
        resolution=10000
        )

    newNd = np.ndarray([900,900])

    START_YEAR='1980'
    datetimes_xr=sst_monthly_da.sel(time=slice(START_YEAR,'2050')).time

     #monthly anoms
    try:
    
        for iTime in datetimes_xr:
            odc.geo.xr.rio_reproject(
                sst_monthly_da.sel(time=iTime, drop=True).values[-1:0:-1],
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
                f'{_data_dir}tracker_data/sst_cog/sst_{iTime.dt.year.values}_{iTime.dt.month.values}.tiff',
                overwrite=True,
                overview_levels=[2,4]
            )
            
    except Exception as e:
        print("SST Monthly Failed")
        print(e)
    
    #monthly anoms
    try:
    
        for iTime in datetimes_xr:
            odc.geo.xr.rio_reproject(
                anoms_da.sel(time=iTime, drop=True).values[-1:0:-1],
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
                f'{_data_dir}tracker_data/sst_anoms_cog/sst_anoms_{iTime.dt.year.values}_{iTime.dt.month.values}.tiff',
                overwrite=True,
                overview_levels=[2,4]
            )
            
    except Exception as e:
        print("SST Monthly Anoms Failed")
        print(e)
        
        
except Exception as e:
    print("There was an error (probably when opening the files)")
    print(argv)
    print(e)