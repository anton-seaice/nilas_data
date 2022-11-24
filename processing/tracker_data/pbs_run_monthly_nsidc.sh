#PBS -P gv90
#PBS -l storage=gdata/jk72
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q express
#PBS -W umask=0022
#PBS -l ncpus=4
#PBS -l mem=24gb
#PBS -l walltime=24:00:00
#PBS -o /g/data/jk72/MIZ/archive/dl_logs
#PBS -e /g/data/jk72/MIZ/archive/dl_logs

WORK_DIR=/g/data/jk72/as2285/miz/processing/tracker_data
$WORK_DIR/monthly_files.text

umask 0003

source /g/data/jk72/as2285/miniconda3/etc/profile.d/conda.sh

conda activate /g/data/jk72/as2285/miniconda3/envs/sea-ice-tracker

echo "Starting creation of monthly sea ice plots"

python3 /g/data/jk72/as2285/miz/processing/tracker_data/sea_ice_conc.py $(cat $WORK_DIR/monthly_files.text)