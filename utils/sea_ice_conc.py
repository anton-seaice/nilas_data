import xarray as xr
import numpy as np

#_work_dir='/g/data/jk72/as2285/miz/'
#import sys
#sys.path.append(_work_dir)

from utils.climat import climatology

class sea_ice_conc:
    """This class captures the processing you might want to do on a sea ice concentration dataset.
    
    functions:
    calc_extent: calculates sea ice extent and average and std (by month) of sea ice extent
    calc_area: calculates sea ice area and average and std (by month)
    calc_gridded_anoms: calculates anomalies compared to climatology
    
    results:
    .extent_da : extent time-series
    .extent_climat_da : extent climatologies (monthly)
    .area_da : area time-series
    .area_climat_da : area climatologies (monthly)
    .conc_climat_ds : gridded climatologies (monthly)
    .anoms_da : gridded anomalies by time

        """
    
    def _climatology(self,da):
        """ For a provided da, calculate the mean and std dev, based on the climatology years for this instance
        
        """
        
        climat_ds=climatology(da, climat_dates=self.climat_dates)
               
        return climat_ds
    
    def calc_extent(self):

        #calculate sea ice extent
        self.extent_da=(
            self._has_seaice_da*self.grid_areas
        ).sum(self._dims_not_time)

        #fill the times there is no data in with nans again (rather than 0s)
        self.extent_da[self._all_nans_da]=np.nan
        
        self.extent_climat_ds=self._climatology(self.extent_da)

    def calc_area(self):
        
        #calculate sea ice area
        self.area_da=(
            self.da.where(self._has_seaice_da) #select areas when conc is greater than 15%
            *self.grid_areas
        ).sum(self._dims_not_time)

        #fill the times there is no data in with nans again (rather than 0s)
        self.area_da[self._all_nans_da]=np.nan
        
        self.area_climat_ds=self._climatology(self.area_da)

    def calc_gridded_anoms(self):    
        #climatology for each grid cell
        self.conc_climat_ds=self._climatology(self.da) 

        #and gridded anoms
        # there is no requirement for the input data to be monthly, but calculating daily anoms are not going to be very useful, so make this whole result monthly (using resample)
        self.monthly_da=self.da.resample(time='M').mean('time')
        
        self.anoms_da=self.monthly_da.groupby('time.month')-self.conc_climat_ds.ave
        
        self.anoms_da=self.anoms_da.where(
            ((self.monthly_da==0)*(self.anoms_da==0))==0
        ) #mask out cells with no concentration at all
        
    def daily_min_max(self):
        self.extent_da
        
        extent_5day_rolling_da=self.extent_da.rolling(time=5, center=True).mean()

        yearly_min_da=extent_5day_rolling_da.groupby('time.year').apply(xr.DataArray.idxmin).dt.dayofyear
        yearly_max_da=extent_5day_rolling_da.groupby('time.year').apply(xr.DataArray.idxmax).dt.dayofyear

        min_max_ds=xr.Dataset()
        
        min_max_ds.min = self._climatology(yearly_min_da)
        
        min_max_ds.max = self._climatology(yearly_max_da)
        
        return min_max_ds, yearly_min_ds, yearly_max_ds

    def __init__(
        self, 
        conc_da,
        grid_areas,
        climat_dates=[1981,2010],
        conc_range=[0.15,1]
    ):
        """
        inputs:

        gridded concentration as an xarray dataarray, 
        area of the grid cells (can be an xarray, or an nd array of the right dimensions),
        climat_dates: dates to use for determining climatology, (default 1981 to 2010) 
            (any datetime format accepted by xarray)
        conc_range : range of valid concentrations in the input data set (default 0.15 to 1)
        
        
        """
        
        #There is no validation on the inputs here, (the input formats are not strictly defined).
        if type(conc_da)!=xr.core.dataarray.DataArray:
            raise ValueError("First argument is not dataarray")


        self.da=conc_da.where(
            (conc_da<=conc_range[1]) #less than one to exclude flagged values 
        )
        
        self.grid_areas=grid_areas
        self.climat_dates=climat_dates
        
        dims_set=set(self.da.dims)
        dims_set.remove('time')
        self._dims_not_time=list(dims_set)
        
        self._has_seaice_da=(self.da>=conc_range[0]) #sea ice conc more than 15% is included

        self._all_nans_da=(self._has_seaice_da.sum(self._dims_not_time)==0) #times where there is no data
        