import xarray as xr
import numpy as np

class sea_ice_duration:
    """
    
    This class calculates sea ice advance / retreat / duration from a provided daily sea ice concentration dataset.
    
    functions:
    calc_duration: calculates sea ice advance / retreat / duration for each year
    calc_climat: calculates mean and std of sea ice advance / retreat / duration
    
    results:
    .adv_day_ds
    .ret_day_ds - a gridded dataset with the day of retreate as a day, and the index of the day (relative to Feb 15)
    .duration_da - gridded length of sea ice season
    .adv_climat_ds - gridded mean and std of advance day
    .ret_climat_da - gridded mean and std of retreat day
    .dur_climat_ds - gridded mean and std of duration
    

        """
    
    def _year_bins(self):
        # Define groups starting ending in mid-feb each year
        """
        Following [18], after [5] and [26], annual maps of patterns of ice advance and duration were derived by flagging the timings of the advance and retreat of the ice edge within an annual search window that begins and ends during mean summer (mid-February) minimum ice extent (i.e., year day 46 to 410, or 411 in leap years). Within this period, annual day of advance is the time when the ice concentration in a given pixel first exceeds 15% (taken to approximate the ice edge) for at least 5 days, while day of retreat is the time when concentration remains below 15% until the end of the given sea ice year. Ice season duration is then the period between day of advance and retreat. For regions where ice remains (survives the summer melt), day of advance and retreat are set to the lower and upper limits, respectively i.e., year day 46 and 410/11. Isolated days of missing data were interpolated from adjoining days. Larger gaps during December 1987 through mid January 1988 were filled with the 1979–2009 climatology. https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0064756
            """
        # year of the first entry in the dataset
        first_year=self.da.time[0].dt.year.values

        # if that year doesn't include the sea-ice minimum, increment to the next year
        if self.da.time[0].dt.dayofyear>=46:
            first_year+=1

        # year of last entry in the dataset
        current_year=self.da.time[-1].dt.year.values

        # if that year doesn't include the sea-ice minimum, increment to the previous year
        if self.da.time[0].dt.dayofyear<=46:
            current_year-=1

        #We are going to use groupby bins, so we need to define bins starting and ending 46th day of each year

        years=np.arange(first_year,current_year+2,1) #ints for the years
        self.year_bins=np.array([np.datetime64(str(iYear)+'-02-15') for iYear in years]) #use years to make full dates for 15 Feb
        self.year_labels=[iYear for iYear in years[0:-1]] # labels are the start year of the year starting 15 Feb / ending 14 feb

    # Functions to find advance day and retreat day
    """We need a function to find:
        - first time the concentration exceeds 15% for at least 5 days
        - last time concentration drops below 15%

        the input would be an xarray starting and ending at the sea-ice minimum (15-feb)
    """

    def _day_of_advance(self,da):
        # find times when the concentration for 5 days is >=0.15
        has_ice_da=((da>=self.conc_range[0]).rolling(time=5).mean('time')==1)

        # day of advance is the first day when has_ice is true
        advance_day_da=has_ice_da.idxmax(dim='time').where( #idxmax returns first time when true is found
            (has_ice_da.any('time')!=0) #filter out pixels with no-ice
        )

        advance_index_da=has_ice_da.argmax(dim='time').where( #argmax returns first index when true is found
            (has_ice_da.any('time')!=0) #filter out pixels with no-ice
        ).rename('index')

        return xr.merge([advance_day_da,advance_index_da])


    def _day_of_retreat(self,da):
        # find times when the concentration for 5 days is >=0.15, i.e. year has some sea-ice
        has_ice_da=((da>=self.conc_range[0]).rolling(time=5).mean('time')==1)

        # criteria for end of sea ice
        no_ice_da=(da>=self.conc_range[0])

        retreat_day_da=no_ice_da.sel(
            time=(no_ice_da.time[::-1]) #index from the end to the start
        ).idxmax(dim='time').where( #idxmax returns first time when true is found
            (has_ice_da.any('time')!=0) #filter out pixels with no-ice
        )

        length_of_year=365 #days
        if no_ice_da.time[0].dt.is_leap_year:
            length_of_year=366

        retreat_index_da=length_of_year-no_ice_da.sel(
            time=(no_ice_da.time[::-1]) #index from the end to the start
        ).argmax(dim='time').where( #argmax returns first index when true is found
            (has_ice_da.any('time')!=0) #filter out pixels with no-ice
        ).rename('index')

        return xr.merge([retreat_day_da, retreat_index_da])


    def calc_duration(self):
        
        self._year_bins()
        
        self.adv_day_ds=self.da.groupby_bins(
            'time',self.year_bins, labels=self.year_labels
        ).apply(self._day_of_advance).rename(
            {'time_bins':'year'}
        )

        self.ret_day_ds=self.da.groupby_bins(
            'time',self.year_bins[:-1], labels=self.year_labels[:-1] #drop the last year because it is incomplete
        ).apply(self._day_of_retreat).rename({'time_bins':'year'})

        self.duration_da=self.ret_day_ds.index-self.adv_day_ds.index

    def _mean_st_dev(self, da):
        result_ds=xr.Dataset()
        result_ds['ave']=da.sel(year=slice(self.climat_dates[0],self.climat_dates[1])).mean('year')
        result_ds['st_dev']=da.sel(year=slice(self.climat_dates[0],self.climat_dates[1])).std('year')
        return result_ds

    def calc_climat(self):
        
        # calculate mean and std for each annual day of advance and retreat and the annual duration
        self.adv_climat_ds=self._mean_st_dev(self.adv_day_ds.index)
        self.ret_climat_ds=self._mean_st_dev(self.ret_day_ds.index)
        self.dur_climat_ds=self._mean_st_dev(self.duration_da)
        
    
    def __init__(
        self,
        conc_da,
        climat_dates=[1981,2010],
        conc_range=[0.15,1]
    ):
        """
        inputs:
        
        gridded concentration as an xarray dataarray (daily data)
        climat_dates: dates to use for determining climatology, (default 1981 to 2010) 
            (any datetime format accepted by xarray)
        conc_range : range of valid concentrations in the input data set (default 0.15 to 1)
        """
        
        self.da=conc_da.where(
            (conc_da<=conc_range[1]) #less than one to exclude flagged values 
        )
        
        self.climat_dates=climat_dates
       
        self.conc_range=conc_range
    
