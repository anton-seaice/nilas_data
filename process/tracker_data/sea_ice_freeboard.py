#!/usr/bin/python3

#From the list of provided h5 files, generate geotifs of sea ice freeboard

#directory paths
_work_dir='/g/data/gv90/sc0554/miz/'
_data_dir='/g/data/gv90/P6_data/'

import h5py
import pandas as pd
import xarray as xr
from pathlib import Path
import sys
import glob
import os
import odc.geo.xr
sys.path.append('/g/data/jk72/sc0554/dea-notebooks/Tools/dea_tools/')
from datacube.utils.cog import write_cog

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

def create_filelist(input_path, file_pattern, string_slice=(9, 17)):
    """
    Create a sorted list of files from a directory with a given extension
    """
    filelist=[]
    print("Finding files")
    for file in Path(input_path).rglob(file_pattern):
        filelist.append(file)
    filelist = sorted(filelist, key=lambda i: int(os.path.splitext(os.path.basename(i)[slice(*string_slice)])[0]))
    print(f"Processing {len(filelist)} files")
    return filelist

print("Creating file list")

filelist= create_filelist(_data_dir+'NSIDC/ICESat2/ATL20', 'ATL20-02*.h5')

# extract dimensions from top layer of h5 file
dims = xr.open_dataset(filelist[0])

# Create time index

time_var = xr.Variable('time', paths_to_datetimeindex(filelist,
                                                      string_slice=(9,15), form='%Y%m'))

# Concat individual monthly data

print('Merging files')

ds = xr.concat([xr.open_dataset(i, group='monthly').squeeze() for i in filelist],
                        dim=time_var)

# Apply dimensions

ds = ds.assign_coords({'grid_x':dims['grid_x'], 'grid_y':dims['grid_y']})

# Assign attributes

ds = ds.assign_attrs(dims.attrs)

ds = ds.odc.assign_crs('EPSG:3031')

# Write to Cog

print('Writing Cogs')

for time in ds.time:
     write_cog(
        ds['mean_fb'].sel(time=time),
        f'{_data_dir}/tracker_data/ATL20_cog/ATL20_monthly_fb_{time.dt.year.values}_{time.dt.month.values}.tiff',
        overwrite=True
    )