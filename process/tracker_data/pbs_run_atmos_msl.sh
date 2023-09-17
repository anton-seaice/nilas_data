#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90+gdata/rt52
#PBS -M nilas@aad.gov.au
#PBS -m ae
#PBS -q normal
#PBS -W umask=0022
#PBS -l ncpus=8
#PBS -l mem=20gb
#PBS -l walltime=48:00:00
#PBS -o /g/data/gv90/P6_data/dl_logs
#PBS -e /g/data/gv90/P6_data/dl_logs

WORK_DIR=/g/data/gv90/sc0554/

umask 0003

source $WORK_DIR/miniconda3/etc/profile.d/conda.sh

conda activate $WORK_DIR/miniconda3/envs/sea-ice-tracker

python3 $WORK_DIR/miz/process/tracker_data/atmos_msl.py
