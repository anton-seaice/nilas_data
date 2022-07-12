#directory paths
_work_dir='/g/data/jk72/as2285/miz/'
_data_dir='/g/data/jk72/MIZ/'

#some constants
CLIMAT_DATES=[1998,2020]

#useful py libraries
import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import odc.geo.xr

# import local functions
import sys
sys.path.append(_work_dir)
from utils.climat import climatology

from os import listdir
file_names = listdir(f'{_data_dir}OCCCI/')
files = [f'{_data_dir}OCCCI/{iFile}' for iFile in file_names]

big_chlor_da=xr.open_mfdataset(files).chlor_a

chlor_da=big_chlor_da.where(big_chlor_da.lat<-40, drop=True)

climat_chlor_ds=climatology(chlor_da, CLIMAT_DATES)

anoms_da=chlor_da.groupby('time.month')-climat_chlor_ds.ave

anoms_da.load()

START_YEAR='1980'

datetimes_xr=chlor_da.sel(time=slice(START_YEAR,'2050')).time

for iTime in datetimes_xr:
    plt.figure(figsize=(40,40), dpi=20, frameon=False, facecolor=None)
    ax=plt.subplot(projection=ccrs.SouthPolarStereo(true_scale_latitude=-71))

    to_plot=chlor_da.sel(time=iTime)

    plt.pcolormesh(to_plot.lon, to_plot.lat, to_plot,vmin=0, vmax=5,
        transform=ccrs.PlateCarree(),
        shading='gouraud')
    
    ax.axis('off')
    
    plt.savefig(
        f'{_work_dir}data/tracker/chlor_conc/occci_chlor_conc_{iTime.dt.year.values}_{iTime.dt.month.values}.png',
        bbox_inches='tight', 
        transparent="True"
    )

    plt.close()
    
    plt.figure(figsize=(40,40), dpi=20, frameon=False, facecolor=None)
    ax=plt.subplot(projection=ccrs.SouthPolarStereo(true_scale_latitude=-71))

    to_plot=anoms_da.sel(time=iTime)

    #chlor_a conc anoms
    plt.pcolormesh(to_plot.lon, to_plot.lat, to_plot,
        #levels=np.arange(-2,2.1,0.5),extend='both', 
        cmap='coolwarm_r',
        vmin=-2, vmax=2,
       transform=ccrs.PlateCarree(),
        shading='gouraud')
    
    ax.axis('off')
    
    #ax.set_extent([-3950000.0, 3950000.0,-3950000.0, 4350000.0], ccrs.SouthPolarStereo(true_scale_latitude=-70))
    
       
    plt.savefig(
        f'{_work_dir}data/tracker/chlor_conc_anoms/occci_chlor_conc_anoms_{iTime.dt.year.values}_{iTime.dt.month.values}.png',
        bbox_inches='tight', 
        transparent="True"
    )
    
    plt.close()
    
