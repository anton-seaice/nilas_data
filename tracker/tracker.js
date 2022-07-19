//imports from node-modules
import 'leaflet' ;
import './node_modules/leaflet/dist/leaflet.css'
import 'proj4' ;
import 'proj4leaflet'; 
import 'leaflet.fullscreen' ;
import '/node_modules/leaflet.fullscreen/Control.FullScreen.css' ;

//local imports
import './tracker.css' ;
import './src/L.Graticule.js' ;
import './src/L.Layer.TimeLocal.js' ;
import './src/L.Control.Date.js' ;
import './src/L.Control.Position.js' ;


//config
import {timeLayers} from './layerDefinitions.js' ;
import {color} from './colorDefinitions.js' ;


      
function init() {
	
	// bounds of NSIDC / epsg3412
	const latLngBounds = L.latLngBounds([[-39.23, -42.24],[-41.45, 135.0]] );	
	
	// The sp ster projection
	const crs = new L.Proj.CRS(
		'EPSG:3031', 
		'+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', 
		{
			resolutions: [8192, 4096, 2048, 1024, 512, 256], //these are the same as the nasa GIBS ones
			origin: [-4194304, 4194304],
			bounds: L.bounds (
			  [-5000000, -5000000],
			  [5000000, 5000000]
			)
		}
	);
	 
	// Make the map
	var map = L.map('map', {
		continuousWorld: true, // continuousWorld because polar crosses dateline
		center: [-90, 0],
		zoom: 0,
		crs: crs,
		maxZoom: 4
	});
	
	//coastlines - shown always
	const coastlines = L.tileLayer.wms("http://geos.polarview.aq/geoserver/wms", {
		layers:"polarview:coastS10",
		format:"image/png",
		transparent:true,
		attribution:"Polarview",
		zIndex:5,
	}).addTo(map);
	
	// Add date picker (global access through map.date)
	let dateControl=L.control.date({startDateOffset:'-31', minDate: '2018-01-01', freq:'monthly'}).addTo(map) ; 
	
	// Add fullscreen button
	let fullscreenControl=L.control.fullscreen({pseudoFullscreen: true}).addTo(map) ; 
	map.toggleFullscreen(fullscreenControl.options) ;
	
	// Adds graticule (lat/lng lines)
	L.graticule({interval: 10}).addTo(map); 
	
	//add a layer selector
	let layerControl=L.control.layers(null,null).addTo(map) ;  //we may need to write a function to style layers by our desires
	//layerControl.expand() ;
	
	let position = L.control.position().addTo(map) ;
	
	map.on('mousemove', function (event) {
			let lat = Math.round(event.latlng.lat * 100) / 100;
			let lng = Math.round(event.latlng.lng * 100) / 100;
			this.updateHTML(lat, lng);
		  }, position);
  	map.on('mouseout', position.hide, position) ;



	
	
	//non-time layers:
	let shipLayer=L.geoJSON.local('data/miz_stations.geojson', { pointToLayer: color.greenMarkerFn } ) ;
	layerControl.addOverlay(shipLayer, 'Tentative Ship Track', {zIndex:5}) ;
				
	//Make the time dependent layers
	console.log("Loading Time Layers") ;
	console.debug(timeLayers) ;
	
	
	// - loop through the layers information provided, and create a layer obj for each layer according to its type and add it to the map	
	for (const iKey in timeLayers) {
		const iLayer=timeLayers[iKey] ;
		
		//if bounds are provided use them, otherwise use default for map
		if (iLayer.bounds) {
			var iBounds = iLayer.bounds ;
		} else {
			var iBounds = latLngBounds ;
		}
				
		switch(iLayer.type) {
			case 'ImageOverlay': 
				var mapLayer=L.imageOverlay.timeLocal(
					map.date, iLayer.filePath, iLayer.fileExt, iBounds, iLayer.options 
					) ;
				break ;
			case 'ImageOverlay.Bremen':
				var mapLayer=L.imageOverlay.timeLocal.bremen(
					map.date, iLayer.filePath, iLayer.fileExt, iBounds, iLayer.options 
					) ;
				break ;
			case 'TileLayer' :
				var mapLayer=L.tileLayer.time(iLayer.url, iLayer.options) ;
				break ;
			case 'TileLayer.WMS' :
				var mapLayer=L.tileLayer.wms.time(iLayer.url, iLayer.options) ;
				break ;
			case 'GeoJSON':
				var mapLayer=L.geoJSON.timeLocal(
					map.date, iLayer.filePath, iLayer.fileExt, iLayer.options
				) ;
				break ;
			default :
				console.error(iLayer.type + ' of ' + iKey + ' not recognised') ;
		} ;
		
		if (mapLayer) {
			layerControl.addOverlay(mapLayer, iKey) ;
			if (iLayer.showAtOpen) { mapLayer.addTo(map) ; } ;
			mapLayer=null ;
		}
		
	} ;
	
	// debug logging
	map.on('dayChanged', function() {console.debug('ChangedEventFired: '+ map.date)});
	
}

// When the DOM is ready initialise the map
document.addEventListener("DOMContentLoaded", init);
