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
import {timeLayers} from './config/timeLayers.js' ;
import {config,staticLayers} from './config/map.js' ;


function init() {
	
	// Make the map
	config.mapOpts.crs = new L.Proj.CRS(config.proj, config.proj4, config.crsOpts) ;
	let map = L.map('map', config.mapOpts );
		
	// Add date picker (global access through map.date)
	let dateControl=L.control.date().addTo(map) ; 
	
	// Add fullscreen button
	L.control.fullscreen({pseudoFullscreen: true}).addTo(map) ; 
	map.toggleFullscreen() ;
	
	// position display
	L.control.position().addTo(map) ;

	//add a layer selector
	let layerControl = L.control.layers(null,null).addTo(map) ;  //we may need to write a function to style layers by our desires
	//layerControl.expand() ;
		
	// graticule
	L.graticule(staticLayers.gratOpts).addTo(map); 
	
	//coastlines - shown always
	L.tileLayer.wms(staticLayers.coast.url,staticLayers.coast.opts).addTo(map);
	
	//ship track:
	let shipLayer=L.geoJSON.local(staticLayers.shiptrack.url, staticLayers.shiptrack.opts) ;
	layerControl.addOverlay(shipLayer, staticLayers.shiptrack.name ) ;

	// add scale                                                                                                │
	L.control.scale({imperial:false, position:'bottomright'}).addTo(map);

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
			var iBounds = config.latLngBounds ;
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
			mapLayer.name = iKey ;
			mapLayer=null ;
		}
		
	} ;
	
	// debug logging
	map.on('dayChanged', function() {console.debug('ChangedEventFired: '+ map.date)});
	
}

// When the DOM is ready initialise the map
document.addEventListener("DOMContentLoaded", init);
