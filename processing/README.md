This folder is for downloading and preliminary processing of data:

download_once.sh is for an initial download of all datasets on a new server / working environment, and a record of the downloads made.

pbs_download_daily.sh is the script to be used with the PBS scheduler to automate the downloads and processing of datasets which are updated regularly.

tracker_data has scripts called by pbs_download_daily.sh for updating the tracker_data folder with new cogs/jsons