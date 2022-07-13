//imports from node-modules
import * as L from 'leaflet' ;
import proj4 from 'proj4' ;
import proj4leaflet from 'proj4leaflet'; 
import fullscreen from 'leaflet.fullscreen' ;

//local imports
import './src/L.Graticule.js' ;
import './src/L.Layer.TimeLocal.jsx' ;
import './src/L.Control.Date.js' ;

//config
import * as timeLayerInfo from './layerDefinitions.js' ;

function init() {
	
	// bounds of NSIDC / epsg3412
	const latLngBounds = L.latLngBounds([[-39.23, -42.24],[-41.45, 135.0]] );	
	
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
		attribution:'Polarview',
		zIndex:5
	});
	 
	// Make the map and add the starting data
	var map = L.map('map', {
		continuousWorld: true, // continuousWorld because polar crosses dateline
		layers: [ coastlines ],
		center: [-90, 0],
		zoom: 0,
		crs: crs,
		maxZoom: 4
	});
	
	// Add date picker (global access through map.date)
	let dateControl=L.control.date({startDateOffset:'-31'}).addTo(map) ; 
	
	// Add fullscreen button
	let fullscreenControl=L.control.fullscreen({pseudoFullscreen: true}).addTo(map) ; 
	map.toggleFullscreen(fullscreenControl.options) ;
	
	// Adds graticule (lat/lng lines)
	L.graticule().addTo(map); 
	
	//add a layer selector
	let layerControl=L.control.layers(null,null).addTo(map) ;  //we may need to write a function to order layers by our desires
	//layerControl.expand() ;
	
	
	//ship track
	const geojsonMarkerOptions = {
		radius: 3,
		fillColor: "#66c2a5",
		color: "#000",
		weight: 0,
		opacity: 1,
		fillOpacity: 1
	};
	function geojsonMarker (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
	};  
            
  fetch('data/miz_stations.geojson')
		.then(response => response.json() )
		.then(json => {
        return L.geoJSON(json, { pointToLayer: geojsonMarker })
      } ) 
    .then(layer => {
        console.debug("Adding geoJSON layer") ;
        layerControl.addOverlay(layer, 'Tentative Ship Track', {zIndex:5} );
        var shipLayer = layer ; 
        }) ;
	
  
	
	//group the two ice extent together and add them
	/*iceEdgeLayer=L.geoJSON.time(
		iceEdge.features, 
		{style: function () {return {color: '#fc8d62'}; } }
	) ;
	iceSolidLayer=L.geoJSON.time(
		iceSolid.features, 
		{style: function () {return {color: '#f5f5f5'}; } }
	) ;
	
	iceExtentLayer=L.layerGroup([iceEdgeLayer,iceSolidLayer], {interactive:false,bubblingMountEvents:false, attribution: "Ice Extent Derived from <a href='https://nsidc.org/data/g02202'>NSIDC CDR</a>"}) ;
	layerControl.addOverlay(iceExtentLayer, 'Sea Ice Extent (Monthly)', {zIndex:4} ) ;*/
	
	

	
	//Make the time dependent layers
	// - loop through the layers information provided, and create a layer obj for each layer according to its type and add it to the map
	for (iKey in timeLayerInfo) {
		iLayer=timeLayerInfo[iKey] ;
		if (iLayer.type=='ImageOverlay') {
			mapLayer=L.imageOverlay.timeLocal(
				map.date, iLayer.filePath, iLayer.fileExt, latLngBounds, iLayer.options 
				) ;
			layerControl.addOverlay(mapLayer, iKey) ;
		} else if (iLayer.type=='ImageOverlay.Bremen') {
			mapLayer=L.imageOverlay.timeLocal.bremen(
				map.date, iLayer.filePath, iLayer.fileExt, latLngBounds, iLayer.options 
				) ;
			layerControl.addOverlay(mapLayer, iKey) ;
		} else if (iLayer.type=='TileLayer') {
			mapLayer=L.tileLayer.time(iLayer.url, iLayer.options) ;
			layerControl.addOverlay(mapLayer, iKey) ;
		} else if (iLayer.type=='TileLayer.WMS') {
			mapLayer=L.tileLayer.wms.time(iLayer.url, iLayer.options) ;
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
