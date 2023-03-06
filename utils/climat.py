import xarray as xr

def climatology(da, climat_dates=[1981,2010], group='time.month'):
    """ For a provided da, calculate the mean and std dev, based on the climatology years for this instance

    """

    climat_ds=xr.Dataset()

    
    
    if climat_dates is not None:
        climat_ds['ave']=da.where(
            (da.time.dt.year>=climat_dates[0])
            *(da.time.dt.year<=climat_dates[1]), 
            drop=True
        ).groupby(group).mean()

        climat_ds['st_dev']=da.where(
            (da.time.dt.year>=climat_dates[0])
            *(da.time.dt.year<=climat_dates[1]), 
            drop=True
        ).groupby(group).std()
    else:
        climat_ds['ave']=da.groupby(group).mean()
        climat_ds['st_dev']=da.groupby(group).std()
    
    
    return climat_ds