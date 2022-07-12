#directory paths
_work_dir='/g/data/jk72/as2285/miz/'
_data_dir='/g/data/jk72/MIZ/'

#some constants
CLIMAT_DATES=[1981,2010]
EAST_ANT_LONS=[71,160] #longitudes for east Antartica (easterly)
YEAR=2021
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


#useful py libraries
import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import matplotlib.ticker as ticker
import odc.geo.xr

import os
import pandas as pd


from os import listdir
file_names = listdir(f'{_data_dir}/Bremen/netcdf')
files = [f'{_data_dir}/Bremen/netcdf/{iFile}' for iFile in file_names]

files.sort()

for iFile in files[300:] :

    print(iFile) 

    datetime=pd.to_datetime(
        os.path.basename(iFile)[slice(16,24)],
        format='%Y%m%d'
    )

    
    plt.figure(figsize=(79,83), dpi=16, frameon=False, facecolor=None) #size and dpi set to be equal to the number of pixels
    ax=plt.subplot(projection=ccrs.SouthPolarStereo())

    #sea ice conc anoms
    to_plot=xr.open_dataset(iFile) ;

    to_plot=to_plot.where(
        (to_plot.z>=15)
        *(to_plot.z<=100)
     )

    plt.pcolormesh(
        to_plot.x,
        to_plot.y,
        to_plot.z,
        vmin=15,
        vmax=100,
        transform=ccrs.SouthPolarStereo(true_scale_latitude=-70),
        cmap='Blues_r',
        shading='gouraud' #this smooths the result?
    )

    ax.axis('off')

    # set the limits consiste

    plt.savefig(f'{_work_dir}data/tracker/hr_sea_ice_conc/bremen_sea_ice_conc_{datetime.year}_{datetime.month}_{datetime.day}.png',bbox_inches='tight', transparent="True")

    plt.close()

    to_plot.close()


