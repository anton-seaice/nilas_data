import odc.geo.xr
import xarray as xr
import numpy as np


#https://stackoverflow.com/questions/65634602/plotting-contours-with-ipyleaflet
def _split_contours(segs, kinds=None):
    """takes a list of polygons and vertex kinds and separates disconnected vertices into separate lists.
    The input arrays can be derived from the allsegs and allkinds atributes of the result of a matplotlib
    contour or contourf call. They correspond to the contours of one contour level.
    
    Example:
    cs = plt.contourf(x, y, z)
    allsegs = cs.allsegs
    allkinds = cs.allkinds
    for i, segs in enumerate(allsegs):
        kinds = None if allkinds is None else allkinds[i]
        new_segs = split_contours(segs, kinds)
        # do something with new_segs
        
    More information:
    https://matplotlib.org/3.3.3/_modules/matplotlib/contour.html#ClabelText
    https://matplotlib.org/3.1.0/api/path_api.html#matplotlib.path.Path
    """
    if kinds is None:
        return segs    # nothing to be done
    # search for kind=79 as this marks the end of one polygon segment
    # Notes: 
    # 1. we ignore the different polygon styles of matplotlib Path here and only
    # look for polygon segments.
    # 2. the Path documentation recommends to use iter_segments instead of direct
    # access to vertices and node types. However, since the ipyleaflet Polygon expects
    # a complete polygon and not individual segments, this cannot be used here
    # (it may be helpful to clean polygons before passing them into ipyleaflet's Polygon,
    # but so far I don't see a necessity to do so)
    new_segs = []
    for i, seg in enumerate(segs):
        segkinds = kinds[i]
        boundaries = [0] + list(np.nonzero(segkinds == 79)[0])
        for b in range(len(boundaries)-1):
            new_segs.append(seg[boundaries[b]+(1 if b>0 else 0):boundaries[b+1]])
    return new_segs
   
    
def contourf_polygons(to_plot_da, levels, desired_crs_str="epsg:4326"):

    """ For the provided 2-dimenionsonal data array, and the levels, create vector polygons representing filled contours at the levels specified.

    Use xr.odc.assign_crs() to assign the crs of source xarray.

    The result is a geodataframe containing shapely polygons, with coordinates defined in lat/lon (espg:4326) as used by ipyleaflet.

    """

    from geopandas.geodataframe import GeoDataFrame
    from shapely.geometry import Polygon  
    import pandas as pd
    import matplotlib.pyplot as plt

    
    #by default contourf will plot against dim[1], dim[0]. but we want coord[1] and coord[0] (generally?), so try this
    cs = plt.contourf(
        to_plot_da[to_plot_da.coords.dims[1]], #x or lon
        to_plot_da[to_plot_da.coords.dims[0]], #y or lat
        to_plot_da,
        levels=levels,
    )

    plt.close()

    #function to transform from the source south polar stereo to the lat/lon for ipyleaflet
    desired_crs=odc.geo.crs.CRS(desired_crs_str)
    try:
        source_crs=to_plot_da.odc.crs#odc.geo.crs.CRS("epsg:3976")
        f=source_crs.transformer_to_crs(other=desired_crs)
    except:
        raise AssertionError("expected xr to have crs specified, use xr.odc.assign_crs()")

    #convert the cs format to shapely polygon format

    df = pd.DataFrame() #somewhere to park the output

    #for each level in the filled contours
    for iLevel in range(len(cs.allsegs)): #this is the output coordinates from contourf, as as a list of shapes for each level
        kinds = None if cs.allkinds is None else cs.allkinds[iLevel] #this is the "kind" given to each coordinate

        #based on the kind (start/middle/end) of each coordinate, split shapes into distinct polygons
        segs = _split_contours(cs.allsegs[iLevel], kinds)

        #iterate through the segments, changing projection and creating Polygons
        locations=list()
        for p in segs:
            if len(p)>2: #check this is a an actual polygon
                locations.append(Polygon([f(i[0],i[1]) for i in p]))

        df=df.append(pd.DataFrame({'level': cs.levels[iLevel], 'polygon': locations}))

    gdf=GeoDataFrame(df, geometry='polygon', crs=desired_crs)

    return gdf