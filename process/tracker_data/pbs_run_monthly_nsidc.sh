#PBS -P gv90
#PBS -l storage=gdata/gv90
#PBS -M nilas@aad.gov.au
#PBS -m ae
#PBS -q normal
#PBS -W umask=0022
#PBS -l ncpus=1
#PBS -l mem=4gb
#PBS -l walltime=24:00:00
#PBS -o /g/data/gv90/P6_data/dl_logs
#PBS -e /g/data/gv90/P6_data/dl_logs

DATA_DIR=/g/data/gv90/P6_data/
WORK_DIR=/g/data/gv90/sc0554/

umask 0003

source $WORK_DIR/miniconda3/etc/profile.d/conda.sh

conda activate $WORK_DIR/miniconda3/envs/sea-ice-tracker

echo "Starting creation of monthly sea ice plots"

python3 $WORK_DIR/miz/process/tracker_data/sea_ice_conc.py $(cat $WORK_DIR/miz/process/tracker_data/monthly_files.text)
