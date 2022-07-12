#!/bin/bash
#PBS -P jk72
#PBS -l storage=gdata/jk72
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q copyq
#PBS -o /g/data/jk72/MIZ/dl_logs
#PBS -e /g/data/jk72/MIZ/dl_logs
#PBS -W umask=0022
#PBS -l walltime=2:00:00


#Note that this bash script using the PBS copy queue. For transferring files from the internet. If we want to run processing subsequently well need a different job in the normal queue.

DATE=$(date +%y%m%d)
NEW_DATE=$(date +%y%m%d -d "$DATE + 3 day")0000

echo "Restarting job on $NEW_DATE"

qsub -a $NEW_DATE /g/data/jk72/as2285/miz/processing/pbs_download.sh 
sleep 30
qstat

# do the work
source /g/data/jk72/as2285/miz/processing/download_daily.sh

# create monthly aggregated data 

qsub /g/data/jk72/as2285/miz/processing/pbs_run_aggregators.sh

