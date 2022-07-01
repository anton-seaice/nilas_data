function init() {

	// bounds of our layers
	const latLngBounds = L.latLngBounds([
		[-39.22994121216445, -42.240892341379734],
		[-41.44603897171838, 135.0]
	]);
	
		
	
	function genTimeLayer(el) {
		// This is the function that runs when the date is changed.
		// el is an "event listener" on the date field
		time = el.target.value ;
		console.log(time) ;
		timeLayer.setTime(time) ;
		
		baseMap.options.time=time ;
		baseMap.redraw() ;
		
		return true ;
	} ;
	

	// Get a reference to the <input type="date">
	var dateEl = document.querySelector('#date');

	// Set the current <input type="date"> and generate the initial layers
	let myDate = new Date() ;
	myDate.setTime(myDate.getTime()-5*60*60*24*1000) ;
	dateEl.value = myDate.toISOString().substr(0, 10) ;
	
	//initial image layer	
	
	var timeLayer = L.imageOverlay.timeLocal(
		dateEl.value,
		'../data/sea_ice_conc_anoms/nsidc_sea_ice_conc_anoms_',
		'.svg',
		latLngBounds, 
		{'opacity': 0.7}
	) ;
		
	
	// initial basemap 
	var baseMap = L.tileLayer("http://map1{s}.vis.earthdata.nasa.gov/wmts-antarctic/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg", {
		layer: "MODIS_Aqua_CorrectedReflectance_TrueColor",
		tileMatrixSet: "EPSG3031_250m",
		format: "image%2Fjpeg",
		time: dateEl.value,
		tileSize: 512,
		subdomains: "abc",
		noWrap: true,
		continuousWorld: true,
		attribution:"<a href='https://earthdata.nasa.gov/gibs'> NASA </a>"
		});
	
	// On date change generate a new layer of the current date and remove the old layer
	dateEl.addEventListener('change', genTimeLayer ) ;

	
	//coastlines
	const coastlines = L.tileLayer.wms('http://geos.polarview.aq/geoserver/wms', {
		layers:'polarview:coastS10',
		format:'image/png',
		transparent:true,
		attribution:'Polarview'
	});
	
	//ship track
	shiptrack = fetch('../data/miz_stations.geojson', {
		mode:'no-cors' //this is problematic. Probably the file needs to he accessed through http I think and is probably why this doesnt work
	})
		.then(response => response.json())
		.catch(console.log('shiptrack not loaded:'))
		.then(json => {return new L.GeoJSON(json) ; } ) ;
		
	
	// The sp ster projection
	const crs = new L.Proj.CRS('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
		resolutions: [8192, 4096, 2048, 1024, 512, 256],
		origin: [-4194304, 4194304],
		bounds: L.bounds (
		  [-4194304, -4194304],
		  [4194304, 4194304]
		)
	});
	
	// Make the map and add the starting data
	var map = L.map('map', {
		continuousWorld: true, // continuousWorld because polar crosses dateline
		worldCopyJump: false,
		layers: [
			coastlines,
			//shiptrack,
			timeLayer
		],
		center: [-90, 0],
		zoom: 0,
		crs: crs,
		maxZoom: 4
	});
	//map.fitBounds(latLngBounds); This line gives weird results, for unclear reasons.
	map.addControl(new L.Control.Fullscreen({pseudoFullscreen: true}));
	
	// Add layer control
	baseLayers= null
	overlays = {
		'MODIS Imagery (Daily)':baseMap ,
		'Sea Ice Conc Anoms (Monthly)':timeLayer ,
	} ;
	var layerControl=L.control.layers(baseLayers,overlays).addTo(map) ;

	
	// Module which adds graticule (lat/lng lines)
	L.graticule().addTo(map);
	
}

// When the DOM is ready initialise the map
document.addEventListener("DOMContentLoaded", init);
