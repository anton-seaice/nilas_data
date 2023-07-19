#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90+gdata/rt52
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q normalbw
#PBS -W umask=0022
#PBS -l ncpus=4
#PBS -l mem=10gb
#PBS -l walltime=48:00:00

WORK_DIR=/g/data/gv90/as2285/

umask 0003

source $WORK_DIR/miniconda3/etc/profile.d/conda.sh

conda activate $WORK_DIR/miniconda3/envs/sea-ice-tracker

python3 $WORK_DIR/miz/process/tracker_data/atmos_msl.py
