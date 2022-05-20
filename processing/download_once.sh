#!/bin/bash
# ------------------------------------------------------------------
# This file grabs all of the historical / not-changing datasets which are used in the sea ice tracker
# ------------------------------------------------------------------

# for new files downloaded, give them read/write permissions for the group
umask 0003


# NSIDC CDR Historical Data
wget --ftp-user=anonymous -r -cN -nd ftp://sidads.colorado.edu/DATASETS/NOAA/G02202_V4/south/aggregate/ -P /g/data/jk72/MIZ/NSIDC/G02202_V4/


# NSIDC Supporting Info (area of pixels)
wget --ftp-user=anonymous -r -cN -nd ftp://sidads.colorado.edu/DATASETS/seaice/polar-stereo/tools/pss25area_v3.dat -P /g/data/jk72/MIZ/NSIDC/

#Bremen ARTIST
wget -A "5.4.nc" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/netcdf/ -P /g/data/jk72/MIZ/Bremen/netcdf

for y in {2012..2022};
do for m in jan feb mar apr may jun jul aug sep oct nov dec;
do wget -A "5.4.tif" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/$y/$m/Antarctic/ -P /g/data/jk72/MIZ/Bremen/geotiff;
done;
done


