#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/jk72
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q copyq
#PBS -W umask=0022
#PBS -l wd

WORK_DIR=/g/data/jk72/as2285/miz/processing/tracker_data
DATA_DIR=/g/data/jk72/MIZ
BREMEN_DIR=$DATA_DIR/Bremen/6km/geotiff
NSIDC_DIR=$DATA_DIR/NSIDC/G10016_V2/daily/

umask 0003

#This file checks all data from 2022 to the current year to see if it has changed or if there are new files since the last download.
YEARS=$(seq 2022 20$(date +%y))

#Bremen 

for y in $YEARS
do for m in jan feb mar apr may jun jul aug sep oct nov dec
do wget -A "5.4.tif" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/$y/$m/Antarctic/ -P $BREMEN_DIR 
done
done

#No Processing to do on these at this stage.

# And the NSIDC data

START_DATE=$(ls -l $NSIDC_DIR | tail -n 1 | grep -oP '\d{8}') #Get the date (from the filename) of the most recent file

# Download NSIDC CDR "near real-time"  Data
wget --ftp-user=anonymous -r -cN -nd ftp://sidads.colorado.edu/DATASETS/NOAA/G10016_V2/south/daily/ -P $NSIDC_DIR

#Find all the files that have dates modified since the start_date (which is a little bit lazy because the modified date is always a few days after the date in the filename)
FILES=$(find $NSIDC_DIR -type f -newermt $START_DATE)

echo "New Files -------------------"
echo $FILES

MONTHS=()
for iFile in $FILES; do
MONTHS+=($(date --date=$(echo $iFile | grep -oP '\d{8}') "+%Y%m"))
done

UNIQUE_MONTHS=$(echo ${MONTHS[@]} | tr ' ' '\n' | sort -u)

FILES=()
for iMonth in $UNIQUE_MONTHS; do
FILES+=($(ls -d  $NSIDC_DIR* | grep $iMonth))
done

# FINISH_DATE=$(ll | tail -n 1 | grep -oP '\d{8}')

qsub -- $WORK_DIR/pbs_run_daily_nsidc.sh ${FILES[@]}

