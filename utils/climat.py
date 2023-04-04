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


def normalise(x, climat_dates=[1981,2010], group='time.month'):
    """This function calculates a normalised (by month) xarray for the provided range of years.
    
    Normalise in this case means to calculate anomalies and then make it all relative to the st.dev for that month.
    
    x is a valid xarray variable with a time coordinate
    xClimatology is the xarray of the time range to use for climatology
       
    """

    
    x_climat_ds = climatology(x, climat_dates=[1981,2010], group='time.month')
                              
    
    
    
    return (x-x_climat_ds.ave)/x_climat_ds.st_dev