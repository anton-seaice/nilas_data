#!/usr/bin/python3

#From the list of provided nc files, generate geotifs of conc, conc_anoms and lines for sea ice extent


#directory paths
_work_dir='/g/data/jk72/as2285/miz/'
_data_dir='/g/data/jk72/MIZ/'

#useful py libraries
import xarray as xr
import odc.geo.xr
from datacube.utils.cog import write_cog
from sys import argv 
from dea_tools.spatial import subpixel_contours
from affine import Affine

try:
    #open the files provided
    daily_da=xr.concat(
        [
            xr.open_dataset(
                iFile,
            ).swap_dims(
                {'tdim':'time', 'x':'xgrid','y':'ygrid'}
            ).rename(
                {'xgrid':'x','ygrid':'y'}
            ) for iFile in argv[1:]
        ], 
        'time'
    ).cdr_seaice_conc

    #assign projection
    del daily_da.attrs['grid_mapping']
    daily_da=daily_da.odc.assign_crs("epsg:3976")

    print(daily_da)

    #resample
    daily_da=daily_da.where(daily_da<=1) #less than one to exclude flagged values 
    monthly_da=daily_da.resample(time='M').mean('time')

    #monthly mean
    climat_ds=xr.open_dataset(f'{_work_dir}/processing/tracker_data/data/nsidc_climat.nc')

    #print for sanity
    print(monthly_da)

    datetimes_xr=monthly_da.time

    #monthly conc to geotiff
    try: 
        for iTime in datetimes_xr:
            
            write_cog(100*monthly_da.sel(time=iTime), #consistent 0-100 scale to give %
                f'{_data_dir}tracker_data/sea_ice_conc_25km_cog/nsidc_sea_ice_conc_{iTime.dt.year.values}_{iTime.dt.month.values}.tiff',
                overwrite=True,
                overview_levels=[2,4,8,16,32]
            )
    except Exception as e:
        print("Sea Ice Conc Geotiff Generation Failed")
        print(e)
        
    #monthly anoms to geotiff
    try:
        anoms_da=monthly_da.groupby('time.month')-climat_ds.ave

        for iTime in datetimes_xr:
            
            write_cog(100*anoms_da.sel(time=iTime), #consistent 0-100 scale to give %
                f'{_data_dir}tracker_data/sea_ice_conc_anoms_25km_cog/nsidc_sea_ice_conc_{iTime.dt.year.values}_{iTime.dt.month.values}.tiff',
                overwrite=True,
                overview_levels=[2,4,8,16,32]
            )
    except Exception as e:
        print("Sea Ice Conc Anoms Geotiff Generation Failed")
        print(e)

    #monthly extent
    try:

        for iTime in datetimes_xr:

            iDa = monthly_da.sel(time=iTime) ;
            
            lines=subpixel_contours(iDa, z_values=[0.15,0.80], min_vertices=15, crs='epsg:3976')

            lines.to_crs('epsg:4326').to_file(
                f'{_data_dir}/tracker_data/sea_ice_extent/ice_extent_{iTime.dt.year.values}_{iTime.dt.month.values}.json', 
                driver='GeoJSON'
            )
    except Exception as e:
        print("Sea Ice Extent JSON Generation Failed")
        print(e)


except Exception as e:
    print("There was an error (probably when opening the files)")
    print(argv)
    print(e)
