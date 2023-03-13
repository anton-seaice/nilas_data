#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q copyq
#PBS -W umask=0022
#PBS -l wd
#PBS -o /g/data/gv90/P6_data/dl_logs
#PBS -e /g/data/gv90/P6_data/dl_logs

WORK_DIR=/g/data/gv90/as2285/miz/processing/tracker_data
DATA_DIR=/g/data/gv90/P6_data
BREMEN_DIR=$DATA_DIR/Bremen
NSIDC_DIR=$DATA_DIR/NSIDC/G10016_V2/daily/

umask 0003

#This file checks all data from 2022 to the current year to see if it has changed or if there are new files since the last download.
YEARS=$(seq 2023 20$(date +%y))

#Bremen 

for y in $YEARS
do for m in jan feb mar apr may jun jul aug sep oct nov dec
do wget -A "5.4.tif" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s6250/$y/$m/Antarctic/ -P $BREMEN_DIR/6km/geotiff 
done
done

#Bremen ARTIST 3.125k
for y in $YEARS;
do for m in jan feb mar apr may jun jul aug sep oct nov dec;
do wget -A "5.4.tif" -r -nc -nd -np -nH -nv -e robots=off seaice.uni-bremen.de/data/amsr2/asi_daygrid_swath/s3125/$y/$m/Antarctic3125/ -P $BREMEN_DIR/3km/geotiff;
done;
done

#No Processing to do on these at this stage.

rsync -r $BREMEN_DIR/6km/geotiff/* $DATA_DIR/tracker_data/sea_ice_conc_6km_cog/

# And the NSIDC data

START_DATE=$(ls -l $NSIDC_DIR | tail -n 1 | grep -oP '\d{8}') #Get the date (from the filename) of the most recent file

# Download NSIDC CDR "near real-time"  Data
wget --ftp-user=anonymous -r -cN -nd ftp://sidads.colorado.edu/DATASETS/NOAA/G10016_V2/south/daily/ -P $NSIDC_DIR

#Find all the files that have dates modified since the start_date (which is a little bit lazy because the modified date is always a few days after the date in the filename)
NEW_FILES=$(find $NSIDC_DIR -type f -newermt $START_DATE)

echo "New Files -------------------"
echo $NEW_FILES

MONTHS=()
for iFile in $NEW_FILES; do
MONTHS+=($(date --date=$(echo $iFile | grep -oP '\d{8}') "+%Y%m"))
done

UNIQUE_MONTHS=$(echo ${MONTHS[@]} | tr ' ' '\n' | sort -u)

MONTHLY_FILES=()
for iMonth in $UNIQUE_MONTHS; do
MONTHLY_FILES+=($(ls -d  $NSIDC_DIR* | grep $iMonth))
done

# FINISH_DATE=$(ll | tail -n 1 | grep -oP '\d{8}')

# Park these files somewhere handy that can be accessed easily
echo ${MONTHLY_FILES[@]} > $WORK_DIR/monthly_files.text

# To process we need to start a different job, to move from copyq to normal, and it can then open the monthly_files.text
qsub $WORK_DIR/pbs_run_monthly_nsidc.sh 

# YEARS=()
# for iFile in $NEW_FILES; do
# DATE_YEAR=($(date --date=$(echo $iFile | grep -oP '\d{8}') "+%Y"))
# DATE_MONTH=($(date --date=$(echo $iFile | grep -oP '\d{8}') "+%m"))
# DATE_DAY=($(date --date=$(echo $iFile | grep -oP '\d{8}') "+%d"))
# if [[ "$DATE_MONTH" -ge 2 ]] && [[ "$DATE_DAY" -gt 15 ]]
# then
#     YEARS+=$DATE_YEAR
# else 
#     YEARS+=$DATE_YEAR-1
# fi

# done

# UNIQUE_YEARS=$(echo ${YEARS[@]} | tr ' ' '\n' | sort -u)