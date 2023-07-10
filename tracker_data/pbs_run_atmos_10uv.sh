#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90+gdata/rt52
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q normal
#PBS -W umask=0022
#PBS -l ncpus=96
#PBS -l mem=384gb
#PBS -l walltime=48:00:00
#PBS -l jobfs=400gb

DATA_DIR=/g/data/gv90/P6_data/
WORK_DIR=/g/data/gv90/as2285/

umask 0003

source $WORK_DIR/miniconda3/etc/profile.d/conda.sh

conda activate $WORK_DIR/miniconda3/envs/sea-ice-tracker

python3 $WORK_DIR/miz/tracker_data/atmos_10uv.py
