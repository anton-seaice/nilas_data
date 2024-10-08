#!/usr/bin/python3
# Example: time python3 artist_aggregator.py --src /g/data/jk72/MIZ/Bremen/netcdf/ --dest /g/data/jk72/MIZ/processed/
# qsub -I -q normal -P jk72 -l walltime=05:00:00,ncpus=48,mem=128gb,storage=gdata/v10+gdata/jk72,wd

import xarray as xr
import argparse
from pathlib import Path
import glob
import sys
import os
import pandas as pd
import numpy as np
import pdb
from tqdm.auto import tqdm

def paths_to_datetimeindex(paths, string_slice=(0, 10), form='%Y%m'):
    """
    Helper function to generate a Pandas datetimeindex object
    from dates contained in a file path string.
    Parameters
    ----------
    paths : list of strings
        A list of file path strings that will be used to extract times
    string_slice : tuple
        An optional tuple giving the start and stop position that
        contains the time information in the provided paths. These are
        applied to the basename (i.e. file name) in each path, not the
        path itself. Defaults to (0, 10).
    Returns
    -------
    A pandas.DatetimeIndex object containing a 'datetime64[ns]' derived
    from the file paths provided by `paths`.
    """
    date_strings = [os.path.basename(i)[slice(*string_slice)]
                    for i in paths]
    return pd.to_datetime(date_strings, format=form)


parser = argparse.ArgumentParser(description="Arguments",
                                 formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument("--src", help="Source location")
parser.add_argument("--dest", help="Destination location")
args = vars(parser.parse_args())

path = str(args['src'])
file_list = []

# create list of paths
print("Finding files")
for file in Path(path).rglob('*'):
    file_list.append(file)

file_list = sorted(file_list, key=lambda i: int(os.path.splitext(os.path.basename(i)[16:24])[0]))
print(f"Processing {len(file_list)} files")

# Create variable used for time axis
# %m = zero padded decimal for month
# % d = zero padded decimal for day
time_var = xr.Variable('time', paths_to_datetimeindex(file_list,
                                                      string_slice=(16,24), form='%Y%m%d'))

# Load in and concatenate individual data
# decode_coords all reads the polar_stereographic projection as a coordinate
ds = xr.concat([xr.open_dataset(i) for i in tqdm(file_list)],
                        dim=time_var)

### GEOTIFF

# Covert our xarray.DataArray into a xarray.Dataset
# ds = ds.to_dataset('band')
# ds = ds.rename({1: 'conc'})

# NETCDF

ds = ds.drop('polar_stereographic')
# Rename the variable to a more useful name
ds = ds.rename({'z': 'conc'})
ds['conc'].attrs['units'] = '%'
ds['conc'].attrs['standard_name'] = 'sea_ice_concentration'
# create monthly data
print("Monthly resampling")
monthly_resample = ds.resample(time="M").mean(keep_attrs=True)

# Writeout the output
print("Writing data")
ds.to_netcdf(path=args['dest']+'asi2_daily.nc')
monthly_resample.to_netcdf(path=args['dest']+'asi2_monthly.nc')
