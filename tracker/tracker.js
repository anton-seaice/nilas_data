function init() {

	// bounds of our layers
	const latLngBounds = L.latLngBounds([[-39.23, -42.24],[-41.45, 135.0]] );	
	
	// The sp ster projection
	const crs = new L.Proj.CRS('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
		resolutions: [8192, 4096, 2048, 1024, 512, 256], //these are the same as the nasa GIBS ones
		origin: [-4194304, 4194304],
		//bounds: L.bounds (
		//  [-4194304, -4194304],
		//  [4194304, 4194304]
		//)
	});
		
	//coastlines
	const coastlines = L.tileLayer.wms('http://geos.polarview.aq/geoserver/wms', {
		layers:'polarview:coastS10',
		format:'image/png',
		transparent:true,
		attribution:'Polarview',
		zIndex:5
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
		//maxZoom: 4
	});
	//map.fitBounds(latLngBounds); //This line gives weird results, for unclear reasons.
	
	
	dateControl=L.control.date({startDateOffset:'-31'}).addTo(map) ; // Add date picker (this also write map.date)
	
	fullscreenControl=L.control.fullscreen({pseudoFullscreen: true}).addTo(map) ; // Add fullscreen button
	map.toggleFullscreen(fullscreenControl.options) ;
	
	
	
	L.graticule({
		pointToLayer:function (geoJsonPoint, latlng) {
			console.log(geoJsonPoint);
			console.log(latlng);
			return L.marker(latlng);
		},
		interval: 10, 
		style: {color: '#333',weight: 0.7}
		}).addTo(map); // Adds graticule (lat/lng lines)
	
	layerControl=L.control.layers(null,null).addTo(map) ; //add a layer selector //we may need to write a 
	
	//function to order layers by our desires
	//layerControl.expand() ;
	
	
	//ship track
	var geojsonMarkerOptions = {
		radius: 3,
		fillColor: "#66c2a5",
		color: "#000",
		weight: 0,
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
	layerControl.addOverlay(shipLayer, 'Tentative Ship Track', {zIndex:5} ) ;
	
	
	//group the two ice extent together and add them
	iceEdgeLayer=L.geoJSON.time(
		iceEdge.features, 
		{style: function () {return {color: '#fc8d62'}; } }
	) ;
	iceSolidLayer=L.geoJSON.time(
		iceSolid.features, 
		{style: function () {return {color: '#f5f5f5'}; } }
	) ;
	
	iceExtentLayer=L.layerGroup([iceEdgeLayer,iceSolidLayer], {interactive:false,bubblingMountEvents:false, attribution: "Ice Extent Derived from <a href='https://nsidc.org/data/g02202'>NSIDC CDR</a>"}) ;
	layerControl.addOverlay(iceExtentLayer, 'Sea Ice Extent (Monthly)', {zIndex:4} ) ;
	
	
	//move to a config file
	timeLayerInfo={
		
		/*for each layer with a time domain, configure using the examples below
		options are passed as options to the initialize function of the class
		set zIndex as follows:
		 zIndex: 1 (default) for baseLayers
		 zIndex: 2 for concentrations
		 zIndex: 3 for filled anomalies
		 zIndex: 4 for contour lines
		 zIndex: 5 for overlays (coastlines, shiptrack etc)
		nb: these are different to z'index in css elements 
		
		layers in the Layer Control are sorted in the order in this list*/
		
		'MODIS Imagery (Daily)':{
			//used in tracker.js:
			type: 'TileLayer' ,
			//used by base class:
			url:"http://map1{s}.vis.earthdata.nasa.gov/wmts-antarctic/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
			options:{
				layer: "MODIS_Aqua_CorrectedReflectance_TrueColor",
				tileMatrixSet: "EPSG3031_250m",
				format: "image%2Fjpeg",
				//time: map.date,
				tileSize: 512,
				subdomains: "abc",
				noWrap: true,
				continuousWorld: true,
				attribution:"<a href='https://earthdata.nasa.gov/gibs'>NASA</a>",
				zIndex:1,
				freq:'monthly'
			}
		},
		'Sea Ice Conc High Res (Daily)':{
			type: 'ImageOverlay' ,
			filePath:'../data/hr_sea_ice_conc/bremen_sea_ice_conc_' ,
			fileExt:'.png',
			bounds: latLngBounds ,
			options:{
				opacity: 0.7, 
				attribution: "<a href='https://seaice.uni-bremen.de/sea-ice-concentration/amsre-amsr2/'>AMSR2</a>",
				zIndex:2,
				freq:'daily'}
		},
		'Sea Ice Conc (Monthly)':{
			//used in tracker.js :
			type: 'ImageOverlay' ,
			showAtOpen:true , //this field is optional,
			//used by L.ImageOverlay.TileLocal extension :
			filePath:'../data/sea_ice_conc/nsidc_sea_ice_conc_' ,
			fileExt:'.png',
			bounds: latLngBounds ,
			//used by L.ImageOverlay base class
			options:{
				opacity: 1, 
				attribution: "<a href='https://nsidc.org/data/g02202'>NSIDC CDR</a>", 
				alt: "Map of Sea Ice Concentration", 
				errorOverlayUrl:'',
				zIndex:2,
				freq:'monthly'} 
		},
		'Sea Ice Conc Anoms (Monthly)':{
			type: 'ImageOverlay' ,
			filePath:'../data/sea_ice_conc_anoms/nsidc_sea_ice_conc_anoms_' ,
			fileExt:'.svg',
			bounds: latLngBounds ,
			options:{
				opacity: 0.7, 
				attribution: "Derived (<a href='https://nsidc.org/data/g02202'>1981-2010 Climatology</a>)",
				alt: "Map of Sea Ice Concentration",
				zIndex:3,
				freq:'monthly'}
		},
		'Chlorophyll Conc (Monthly)':{
			type: 'ImageOverlay' ,
			filePath:'../data/chlor_conc/occci_chlor_conc_' ,
			fileExt:'.png',
			bounds: [[-23.13, -45],[-23.13, 135.0]] ,
			options:{
				opacity: 1, 
				attribution: "<a href='https://www.oceancolour.org/'>Ocean Colour - CCI</a>",
				alt: "Map of Chlorophyll Concentration",
				zIndex:2,
				freq:'monthly',
			}
		},
		'Chlorophyll Conc Anoms (Monthly)':{
			type: 'ImageOverlay' ,
			filePath:'../data/chlor_conc_anoms/occci_chlor_conc_anoms_' ,
			fileExt:'.png',
			bounds: [[-23.13, -45],[-23.13, 135.0]] ,
			options:{
				opacity: 1, 
				attribution: "Derived <a href='https://www.oceancolour.org/'>1998-2020 Climatology</a>)",
				alt: "Map of Chlorophyll Concentration Anomalies",
				zIndex:3,
				freq:'monthly',
			}
		},
	} ;
	
	//Make the time dependent layers
	// - loop through the layers information provided, and create a layer obj for each layer according to its type and add it to the map
	for (iKey in timeLayerInfo) {
		iLayer=timeLayerInfo[iKey] ;
		if (iLayer.type=='ImageOverlay') {
			mapLayer=L.imageOverlay.timeLocal(
				map.date, iLayer.filePath, iLayer.fileExt, iLayer.bounds, iLayer.options 
				) ;
			layerControl.addOverlay(mapLayer, iKey) ;
		} else if (iLayer.type=='ImageOverlay.Bremen') {
			mapLayer=L.imageOverlay.timeLocal.bremen(
				map.date, iLayer.filePath, iLayer.fileExt, iLayer.bounds, iLayer.options 
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
