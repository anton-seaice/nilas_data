#directory paths
_work_dir='/g/data/jk72/as2285/miz/'
_data_dir='/g/data/jk72/MIZ/'

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

for iFile in files:

    datetime=pd.to_datetime(
        os.path.basename(iFile)[slice(16,24)],
        format='%Y%m%d'
    )
    
    plt.figure(figsize=(1264,1327), dpi=1, frameon=False, facecolor=None, tight_layout={'pad':0}) #size and dpi set to be equal to the number of pixels
    ax=plt.subplot() 

    #sea ice conc anoms
    to_plot=xr.open_dataset(iFile)
    to_plot=to_plot.z 
    to_plot=to_plot.where((to_plot>15)*(to_plot<=100)) 
    
    plt.imshow(
        to_plot[-1:0:-1,:],
        vmin=15,
        vmax=100,
        cmap='Blues_r',
    )

    ax.axis('off')
    
    plt.savefig(
        f'{_data_dir}/tracker_files/hr_sea_ice_conc/bremen_sea_ice_conc_{datetime.year}_{datetime.month}_{datetime.day}.png',
    )
    
    plt.close()

    to_plot.close()


