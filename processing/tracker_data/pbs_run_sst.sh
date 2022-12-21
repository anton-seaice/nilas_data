#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q normal
#PBS -W umask=0022
#PBS -l ncpus=12
#PBS -l mem=48gb
#PBS -l walltime=24:00:00
#PBS -l jobfs=400gb
#PBS -o /g/data/gv90/P6_data/dl_logs
#PBS -e /g/data/gv90/P6_data/dl_logs


DATA_DIR=/g/data/gv90/P6_data/
WORK_DIR=/g/data/gv90/as2285/

umask 0003

source $WORK_DIR/miniconda3/etc/profile.d/conda.sh

conda activate $WORK_DIR/miniconda3/envs/sea-ice-tracker

echo "Starting creation of map files"

python3 $WORK_DIR/miz/processing/tracker_data/sst.py $(cat $WORK_DIR/miz/processing/tracker_data/sst_monthly_files.text)
