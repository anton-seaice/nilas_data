#!/bin/bash
# ------------------------------------------------------------------
# This file grabs the current / new dataset which are displayed in the sea ice tracker
# ------------------------------------------------------------------


# NSIDC CDR "near real-time"  Data
wget --ftp-user=anonymous -r -cqN ftp://sidads.colorado.edu/DATASETS/NOAA/G10016_V2/south/daily/ -P /g/data/jk72/MIZ/


cd /g/data/jk72/MIZ/Bremen/netcdf
wget -A "5.4.nc" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/netcdf/
chmod 664 *.nc
