import {color} from './color.js' ;

export var config = {

	// bounds of NSIDC / epsg3412
	latLngBounds: L.latLngBounds([[-39.23, -42.24],[-41.45, 135.0]] ),	

	// The sp ster projection
	proj: 'EPSG:3031', 
	proj4: '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', 
	crsOpts:{
		resolutions: [16384, 8192, 4096, 2048, 1024, 512, 256], //these are the same as the nasa GIBS ones
		origin: [-4194304, 4194304],
		bounds: L.bounds (
		  [-5000000, -5000000],
		  [5000000, 5000000]
		)
	},
	
	mapOpts: {
		continuousWorld: true, // continuousWorld because polar crosses dateline
		center: [-90, 0],
		zoom: 1,
		//crs: ,
		maxZoom: 4
	},
	
	dateOpts: {
		startDateOffset:'-31', //offset from today to initialise the date picker
		minDate: '2018-01-01', 
		freq:'monthly' //freq to use when initialising the date picker
	}
		
} ;


export var staticLayers = {
	
	gratOpts: { 
		intervalLat: 10,
        intervalLng: 30,
		onEachFeature: function (feature, layer) {
			if (feature.properties.name.match('E')) {
				var orient = 180 ; 
			} else {var orient = 0};
        	
        	layer.setText(
        		feature.properties.name,
        		{center:true, offset:-3, orientation:orient}
        	);
        }
    } ,
	
	coast: { //type: tileLayer.wms
		url: "http://geos.polarview.aq/geoserver/wms" ,
		opts: {
			layers:"polarview:coastS10",
			format:"image/png",
			transparent:true,
			attribution:"Polarview",
			zIndex:5,
		}
	} ,
	
	shiptrack: { //type: geoJSON.local
		name: 'Proposed Ship Track' ,
		url: 'data/miz_stations.geojson' ,
		opts: {pointToLayer: color.greenMarkerFn, zIndex:5} 
	}
}