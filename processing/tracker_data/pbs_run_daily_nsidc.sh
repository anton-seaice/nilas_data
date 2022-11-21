#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/jk72
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q normal
#PBS -W umask=0022
#PBS -l ncpus=2
#PBS -l mem=8gb
#PBS -l walltime=24:00:00

#Arguments are files to process 

umask 0003

source /g/data/jk72/as2285/miniconda3/etc/profile.d/conda.sh

conda activate /g/data/jk72/as2285/miniconda3/envs/sea-ice-tracker

echo "Starting creation of daily sea ice plots"

python3 /g/data/jk72/as2285/miz/processing/tracker_data/daily_hr_sea_ice_conc.py $@