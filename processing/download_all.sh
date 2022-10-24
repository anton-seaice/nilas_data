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

#Bremen ARTIST 6.25k
wget -A "5.4.nc" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/netcdf/ -P /g/data/jk72/MIZ/Bremen/netcdf

for y in $(seq 2012 20$(date +%y));
do for m in jan feb mar apr may jun jul aug sep oct nov dec;
do wget -A "5.4.tif" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/$y/$m/Antarctic/ -P /g/data/jk72/MIZ/Bremen/geotiff;
done;
done

#Bremen ARTIST 3.125k

for y in $(seq 2012 20$(date +%y));
do for m in jan feb mar apr may jun jul aug sep oct nov dec;
do wget -A "5.4.tif" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s3125/$y/$m/Antarctic3125/ -P /g/data/jk72/MIZ/Bremen/3125/;
done;
done

#OCCCI Ocean Colour
wget -r -cN -nd --user oc-cci-data --password ELaiWai8ae ftp://ftp.rsg.pml.ac.uk/occci-v5.0/geographic/netcdf/monthly/chlor_a/ -P /g/data/jk72/MIZ/OCCCI

#OSI-SAF sea ice drift

wget -A "*sh*.nc" -r -cN -nd --user anonymous ftp://osisaf.met.no/archive/ice/drift_lr/merged -P /g/data/jk72/MIZ/OSI-SAF/drift_lr/

#Copernicus OSTIA SST
wget -r -cN -nd --user asteketee --password hlJSYzA505XD ftp://my.cmems-du.eu/Core/SST_GLO_SST_L4_REP_OBSERVATIONS_010_011/METOFFICE-GLO-SST-L4-REP-OBS-SST/ -P /g/data/jk72/MIZ/CMEMS/OSTIA

for y in $(seq 2022 20$(date +%y));
do wget -r -cN -nd --user asteketee --password hlJSYzA505XD ftp://nrt.cmems-du.eu/Core/SST_GLO_SST_L4_NRT_OBSERVATIONS_010_001/METOFFICE-GLO-SST-L4-NRT-OBS-SST-V2/2022/ -P /g/data/jk72/MIZ/CMEMS/OSTIA-NRT ;
done
