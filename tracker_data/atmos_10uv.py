# for output files, which year to start at
START_YEAR='2000'
#directory paths
_work_dir='/g/data/gv90/as2285/miz/'
_data_dir='/g/data/rt52/era5/single-levels/reanalysis/'
_output_data_dir='/g/data/gv90/P6_data/'
#useful py libraries
import xarray as xr
import numpy as np
import odc.geo.xr
import matplotlib.pyplot as plt
from glob import iglob 
from multiprocessing import freeze_support

from cartopy.vector_transform import vector_scalar_to_grid 
import cartopy.crs as ccrs

from datacube.utils.cog import write_cog

from dask.distributed import Client, wait

def createDailyUv(i_xr):
    
    import odc.geo.xr
    i_xr.load()
    iTime=i_xr.time
    
    result=vector_scalar_to_grid(
        ccrs.PlateCarree(), #CRS("EPSG:4326") ,
        ccrs.CRS("EPSG:3976") ,
        225,
        i_xr.longitude.values,
        i_xr.latitude.values,
        i_xr.u10.values,
        i_xr.v10.values,
        target_extent=[-4500000,4500000,4500000,-4500000]
    )
    
    result_ds=xr.Dataset(data_vars={'u10':(('y','x'),result[2]),'v10':(('y','x'),result[3])}, coords={'x':result[0][0], 'y':[result[1][i][0] for i in range(0,len(result[1]))]})
    result_ds=result_ds.odc.assign_crs("epsg:3976")
    
    write_cog(
        result_ds.to_array(),
        f'{_output_data_dir}/tracker_data/atmos/uv10_cog/uv10_{iTime.dt.year.values}_{iTime.dt.month.values}_{iTime.dt.day.values}.tiff',
        overwrite=True,
        overview_levels=[2,4,8]
    )
    del result, result_ds, i_xr
    return True

if __name__ == '__main__':

    freeze_support()
    
    client=Client()

    files=list()
    for iFile in iglob(f'{_data_dir}/10[uv]/20[0-5]*/*.nc', recursive=True):
        files.append(iFile)

    uv_ds=xr.open_mfdataset(files)

    uv_ds=uv_ds.where(uv_ds.latitude<-35, drop=True)

    uv_ds=uv_ds.odc.assign_crs("epsg:4326")

    uv_ds=uv_ds.resample(time='1D').mean(['time'])

    uv_180=uv_ds.sel(longitude=-180)

    uv_180['longitude']=180

    uv_ds=xr.concat([uv_ds,uv_180], 'longitude')

    nWorkers=48
    nTimes=len(uv_ds.time)
    for i in range(0,nTimes,nWorkers):
        data=client.scatter([uv_ds.sel(time=time) for time in uv_ds.sel(time=slice(START_YEAR,'2050')).time[i:i+nWorkers+1]])
        futures=client.map(
            createDailyUv, 
            data
        )
        wait(futures)
        print(str(i+nWorkers)+" processed")

    client.close()

