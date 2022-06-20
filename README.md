# Marginal Ice Zone Study

This repository contains code relating to the marginal ice zone study.

We intend for these tools and workflows to persist beyond the study such that they can be re-used for other applications.

## Notebooks

The Jupyter notebooks are for the interactive generation and visualisation of climatologies primarily relating to Antarctic sea-ice.

## Processing

This folder contains python and bash scripts for downloading and aggregating data.

## Utils

This folder contains python modules, functions and classes that can be used to calculate and visualise products

# Installation

All python dependencies to use this code in jupyterlab are in ENV.yaml. It's faster to use the mamba package manager, although conda should also work:

>mamba install sea-ice-tracker --file ENV.yml

To update:

>mamba env update --prefix sea-ice-tracker --file ENV.yml --prune