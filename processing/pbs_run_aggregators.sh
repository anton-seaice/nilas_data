#!/bin/bash
#PBS -P jk72
#PBS -l storage=gdata/jk72
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q normal
#PBS -o /g/data/jk72/MIZ/aggregator_logs
#PBS -e /g/data/jk72/MIZ/aggregator_logs
#PBS -W umask=0022
#PBS -l ncpus=16
#PBS -l mem=48gb
#PBS -l walltime=2:00:00

umask 0003

source /g/data/jk72/as2285/miniconda3/etc/profile.d/conda.sh

conda activate /g/data/jk72/as2285/miniconda3/envs/sea-ice-tracker

echo "Starting artist aggregator"

python3 /g/data/jk72/as2285/miz/processing/artist_aggregator.py --src /g/data/jk72/MIZ/Bremen/netcdf/ --dest /g/data/jk72/MIZ/processed/

