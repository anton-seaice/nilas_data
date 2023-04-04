#!/bin/bash
#PBS -P gv90
#PBS -l storage=gdata/gv90
#PBS -M anton.steketee@aad.gov.au
#PBS -m ae
#PBS -q copyq
#PBS -o /g/data/gv90/P6_data/dl_logs
#PBS -e /g/data/gv90/P6_data/dl_logs
#PBS -W umask=0022

#Note that this bash script using the PBS copy queue. For transferring files from the internet. If we want to run processing subsequently well need a different job in the normal queue.

DATA_DIR=/g/data/gv90/P6_data

# for new files downloaded, give them read/write permissions for the group
umask 0003

#OCCCI Ocean Colour
wget -r -cN -nd --user oc-cci-data --password ELaiWai8ae ftp://ftp.rsg.pml.ac.uk/occci-v6.0/geographic/netcdf/monthly/chlor_a/ -P $DATA_DIR/OCCCIv6.0