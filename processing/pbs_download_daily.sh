#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q normal
#PBS -o /g/data/gv90/P6_data/dl_logs
#PBS -e /g/data/gv90/P6_data/dl_logs
#PBS -W umask=0022
#PBS -l walltime=2:00:00


#Note that this bash script using the PBS copy queue. For transferring files from the internet. If we want to run processing subsequently well need a different job in the normal queue.

WORK_DIR=/g/data/gv90/as2285/miz/processing/
DATA_DIR=/g/data/gv90/P6_data

DATE=$(date +%y%m%d)
NEW_DATE=$(date +%y%m%d -d "$DATE + 3 day")0000

echo "Restarting job on $NEW_DATE"

qsub -a $NEW_DATE $WORK_DIR/pbs_download_daily.sh 
sleep 30
qstat

# do the work
qsub $WORK_DIR/tracker_data/pbs_download_sea_ice_for_tracker.sh

qsub $WORK_DIR/tracker_data/pbs_download_sst_for_tracker.sh


