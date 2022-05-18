#!/bin/bash
# ------------------------------------------------------------------
# This file grabs all of the historical / not-changing datasets which are used in the sea ice tracker
# ------------------------------------------------------------------


# NSIDC CDR Historical Data
wget --ftp-user=anonymous -r -cN ftp://sidads.colorado.edu/DATASETS/NOAA/G02202_V4/south/aggregate/ -P /g/data/jk72/MIZ/


# NSIDC Supporting Info (area of pixels)
wget --ftp-user=anonymous -r -cN ftp://sidads.colorado.edu/DATASETS/seaice/polar-stereo/tools/pss25area_v3.dat -P /g/data/jk72/MIZ/
