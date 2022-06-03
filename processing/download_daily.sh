#!/bin/bash
# ------------------------------------------------------------------
# This file grabs the current / new dataset which are displayed in the sea ice tracker
# ------------------------------------------------------------------

# for new files downloaded, give them read/write permissions for the group
umask 0003

# NSIDC CDR "near real-time"  Data
wget --ftp-user=anonymous -r -cN -nd ftp://sidads.colorado.edu/DATASETS/NOAA/G10016_V2/south/daily/ -P /g/data/jk72/MIZ/NSIDC/G10016_V2/daily/

# Bremen ARTIST

for y in {2022..2024};
do  wget -A "5.4.nc" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/netcdf/$y/  -P /g/data/jk72/MIZ/Bremen/netcdf; 
done


for y in {2022..2024};
do for m in jan feb mar apr may jun jul aug sep oct nov dec; 
do wget -A "5.4.tif" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/$y/$m/Antarctic/ -P /g/data/jk72/MIZ/Bremen/geotiff; 
done; 
done

#OCCCI Ocean Colour
wget -r -cN -nd --user oc-cci-data --password ELaiWai8ae ftp://ftp.rsg.pml.ac.uk/occci-v5.0/geographic/netcdf/monthly/chlor_a/ -P /g/data/jk72/MIZ/OCCCI

#OSI-SAF sea ice drift
wget -A "*sh*.nc" -r -cN -nd --user anonymous ftp://osisaf.met.no/archive/ice/drift_lr/merged -P /g/data/jk72/MIZ/OSI-SAF/drift_lr/

