import TimeLocal from './timeLocal.js' ;

/* class ImageOverlay.TimeLocal
aka L.ImageOverlay.TimeLocal
@ inherits ImageOverlay

Uses to load a single image from local storage based on the specified time

Options are unchanged from L.ImageOverlay

*/
L.GeoJSON.Local = L.GeoJSON.extend({
	

	options: {
		//interactive:false ,
		//bubblingMouseEvents:false
	},
	
	initialize(path, options) {
		//start fetching the layer and constructing the layer, but asynchronous
		this._initPromise = this.fetchJsonPromise(path)
			.then(json => {
				L.GeoJSON.prototype.initialize.call(this,json,options) ;
			  } ) ;		
	} ,
	
	fetchJsonPromise(path) {
		let promise = fetch(path).then(response => response.json() ) ;
		return promise ;
	},
	
	onAdd(map) {
		
		// check that the layer has initialized before adding layer.
		this._initPromise
			.then(layer => { L.GeoJSON.prototype.onAdd.call(this,map) } ) ;

	}
	
	/*
	initialize(fileBasePath,fileExtension,options) {
		
		this.setupTimeLocal(fileBasePath,fileExtension,options) ;
		
		console.log(time) ;
		
		let json = this._fetchFile(time) ;
		
		L.GeoJSON.prototype.initialize.call(this,json,options) ;
		
	} ,*/
	

}) 


L.geoJSON.local = function (path, options) {
	return new L.GeoJSON.Local(path, options) ;
}
	

L.GeoJSON.TimeLocal = L.GeoJSON.Local.extend({
	
	includes: TimeLocal, 
			
	initialize(time, fileBasePath, fileExtension, options )  {
		
		this.setupTimeLocal(
			fileBasePath, fileExtension, options
		) ;
		
		L.GeoJSON.Local.prototype.initialize.call(this,this.localUrl(time),options) ;
		
	} ,
	
	onAdd: function(map) {
		
		this.updateTime(map) ;
		
		this.startEventListener(map) ;
		
		L.GeoJSON.prototype.onAdd.call(this,map) ;

	} ,
	
	updateTime: function(dateObj) {
		
		this.clearLayers() ;
		
		let url = this.localUrl(dateObj.date);
		
		this.fetchJsonPromise(url)
			.then(iJson => this.addData(iJson)) ;
		
	
	}
	
})

L.geoJSON.timeLocal = function (time, fileBasePath, fileExtension, options ) {
	return new L.GeoJSON.TimeLocal(time, fileBasePath, fileExtension, options ) ;
}