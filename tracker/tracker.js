function init() {

	// bounds of our layers
	const latLngBounds = L.latLngBounds([
		[-39.22994121216445, -42.240892341379734],
		[-41.44603897171838, 135.0]
	]);	
	
	// The sp ster projection
	const crs = new L.Proj.CRS('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
		resolutions: [8192, 4096, 2048, 1024, 512, 256], //these are the same as the nasa GIBS ones
		origin: [-4194304, 4194304],
		bounds: L.bounds (
		  [-4194304, -4194304],
		  [4194304, 4194304]
		)
	});
		
	//coastlines
	const coastlines = L.tileLayer.wms('http://geos.polarview.aq/geoserver/wms', {
		layers:'polarview:coastS10',
		format:'image/png',
		transparent:true,
		attribution:'Polarview'
	});
	
	//ship track
	/*shiptrack = fetch('data/miz_stations.geojson', {
		//mode:'no-cors' //this is problematic. Probably the file needs to he accessed through http I think and is probably why this doesnt work
	})
		.then(response => response.json())
		.catch(console.warn('shiptrack not loaded:'))
		.then(json => L.geoJSON ) 
		.catch(console.warn('shiptrack not processed')) ;
	*/
	
	
	
	// Make the map and add the starting data
	var map = L.map('map', {
		continuousWorld: true, // continuousWorld because polar crosses dateline
		layers: [ coastlines ],
		center: [-90, 0],
		zoom: 0,
		crs: crs,
		maxZoom: 4
	});
	//map.fitBounds(latLngBounds); This line gives weird results, for unclear reasons.
	
	dateControl=L.control.date().addTo(map) ; // Add date picker (this also write map.date)
	L.control.fullscreen({pseudoFullscreen: true}).addTo(map) ; // Add fullscreen button
	L.graticule().addTo(map); // Adds graticule (lat/lng lines)
	layerControl=L.control.layers(null,null, {collapsed:false}).addTo(map) ; //add a layer selector
	
	var geojsonMarkerOptions = {
    radius: 3,
    fillColor: "000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};


	shipLayer=L.geoJSON(
		shiptrack,
		{ pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
			}
		}
	) ;
	layerControl.addOverlay(shipLayer, 'Tentative Ship Track' ) ;
	
	timeLayerInfo={
		
		//for each layer with a time domain, configure using the examples below
		//options are passed as options to the initialize function of the class
		
	'Sea Ice Conc (Monthly)':{
		'type': 'ImageOverlay' ,
		'filePath':'../data/sea_ice_conc/nsidc_sea_ice_conc_' ,
		'fileExt':'.png',
		'options':{opacity: 1, attribution: "NSIDC"}, 
		'showAtOpen':true //this field is optional
	},
	'Sea Ice Conc Anoms (Monthly)':{
		'type': 'ImageOverlay' ,
		'filePath':'../data/sea_ice_conc_anoms/nsidc_sea_ice_conc_anoms_' ,
		'fileExt':'.svg',
		'options':{opacity: 0.7,attribution: "NSIDC (1981-2010 Climatology)"}
	},
	'MODIS Imagery (Daily)':{
		'type': 'TileLayer' ,
		'url':"http://map1{s}.vis.earthdata.nasa.gov/wmts-antarctic/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
		'options':{
			layer: "MODIS_Aqua_CorrectedReflectance_TrueColor",
			tileMatrixSet: "EPSG3031_250m",
			format: "image%2Fjpeg",
			time: map.date,
			tileSize: 512,
			subdomains: "abc",
			noWrap: true,
			continuousWorld: true,
			attribution:"<a href='https://earthdata.nasa.gov/gibs'> NASA </a>"
		}
	}
	} ;
	
	//make the time dependent layers
	//initial image layer	
	
	// loop through the layers information provided, and create a layer obj for each layer according to its type
	for (iKey in timeLayerInfo) {
		iLayer=timeLayerInfo[iKey] ;
		if (iLayer.type=='ImageOverlay') {
			mapLayer=L.imageOverlay.timeLocal(
				map.date, iLayer.filePath, iLayer.fileExt, latLngBounds, iLayer.options 
				) ;
			layerControl.addOverlay(mapLayer, iKey) ;
		} else if (iLayer.type=='TileLayer') {
			mapLayer=L.tileLayer.time(iLayer.url, iLayer.options) ;
			layerControl.addOverlay(mapLayer, iKey) ;
		} else {
			console.error(iLayer.type + ' of ' + iKey + ' not recognised') ;
		}
		//turn on this layer if configured too
		if (iLayer.showAtOpen) {
			mapLayer.addTo(map) ;
		} ;
	} ;
	
	// debug logging
	map.on('dayChanged', function() {console.debug('ChangedEventFired: '+ map.date)});
	
	
}

// When the DOM is ready initialise the map
document.addEventListener("DOMContentLoaded", init);
