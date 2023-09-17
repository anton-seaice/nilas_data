#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90
#PBS -M nilas@aad.gov.au
#PBS -m ae
#PBS -q copyq
#PBS -W umask=0022
#PBS -l wd
#PBS -o /g/data/gv90/P6_data/dl_logs
#PBS -e /g/data/gv90/P6_data/dl_logs

WORK_DIR=/g/data/gv90/sc0554/miz/process/tracker_data
DATA_DIR=/g/data/gv90/P6_data
OSTIA_DIR=$DATA_DIR/CMEMS/OSTIA-NRT

umask 0003

#This file checks all data from 2022 to the current year to see if it has changed or if there are new files since the last download.
YEARS=$(seq 2022 20$(date +%y))

#SST

START_DATE=$(ls $OSTIA_DIR | tail -n 1 | grep -oP '\d{8}') #Get the date (from the filename) of the most recent file

#Download Copernicus OSTIA SST (NRT)
for y in $YEARS;
do wget -r -cN -nd --user asteketee --password hlJSYzA505XD ftp://nrt.cmems-du.eu/Core/SST_GLO_SST_L4_NRT_OBSERVATIONS_010_001/METOFFICE-GLO-SST-L4-NRT-OBS-SST-V2/$y/ -P $OSTIA_DIR ;
done

#Find all the files that have dates modified since the start_date (which is a little bit lazy because the modified date is always a few days after the date in the filename)
NEW_FILES=$(find $OSTIA_DIR -type f -newermt $START_DATE)

echo "New Files -------------------"
echo $NEW_FILES

MONTHS=()
for iFile in $NEW_FILES; do
MONTHS+=($(date --date=$(echo $iFile | grep -oP '\d{8}') "+%Y%m"))
done

UNIQUE_MONTHS=$(echo ${MONTHS[@]} | tr ' ' '\n' | sort -u)

MONTHLY_FILES=()
for iMonth in $UNIQUE_MONTHS; do
MONTHLY_FILES+=($(ls -d  $OSTIA_DIR/* | grep /$iMonth))
done

# FINISH_DATE=$(ll | tail -n 1 | grep -oP '\d{8}')

# Park these files somewhere handy that can be accessed easily
echo ${MONTHLY_FILES[@]} > $WORK_DIR/sst_monthly_files.text

# To process we need to start a different job, to move from copyq to normal, and it can then open the monthly_files.text
qsub $WORK_DIR/pbs_run_sst.sh 

