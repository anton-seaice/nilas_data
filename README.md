# Marginal Ice Zone Study

This repository contains code relating to the marginal ice zone study.

We intend for these tools and workflows to persist beyond the study such that they can be re-used for other applications.

## Data 
contains a couple of support pieces of data from intermediate processing step

## Sandbox
These Jupyter notebooks are for the interactive generation and visualisation of figures primarily relating to Antarctic sea-ice.

## Tracker_Data

The jupyter notebooks are for the generation of source files (principally geotiff and geojson) used by Nilas (the Sea-Ice Tracker). The notebooks contain code to generate figures in other ways, but these are mostly moved to the bottom of the file. These were run once for the initial generation of data, and can be re-run later.

The following layers are updated irregularly:

- Sea Ice Timing (annual after 15th Feb)
- Chlorophyll (approx every 6 months)
- Freeboard (timing ?)
- Sea Ice Extent (Long Term Monthly Mean) (doesn't change)
- Bathymetry (a few years?)

These layers are updated daily, and there are automated script for daily updates in the `process/tracker_data` folder:

- Sea Ice Concentration
- Sea Ice Extent (Monthly Mean)
- Sea Surface Temperature

## Download

This is a record of the source data downloaded (into `gv90/P6_data`)

## Process

This folder contains python and bash scripts for downloading and aggregating data. This includes `process/tracker_data` which has automated scripts for regular updates of tracker data.

## Utils

This folder contains python modules, functions and classes that can be used to calculate and visualise products

# Installation

All python dependencies to use this code in jupyterlab are in ENV.yaml. It's faster to use the mamba package manager, although conda should also work:

>mamba env create -n sea-ice-tracker --file ENV.yml

To update:

>mamba env update --file ENV.yml --prune