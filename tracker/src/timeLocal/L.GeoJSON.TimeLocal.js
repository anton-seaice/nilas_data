import TimeLocal from './timeLocal.js' ;
import './L.GeoJSON.Legend.js' ;


/* class GeoJSON.Local
aka L.GeoJSON.Local
@ inherits L.GeoJSON

Uses to load a single image from local storage 

Options are unchanged from L.GeoJSON

*/
L.GeoJSON.Local = L.GeoJSON.Legend.extend({

	_errorJson: { "type": "FeatureCollection",
		"features": [
			{ 
				"type": "Feature",
				"geometry": { "type": "Point",  "coordinates": [0, -90] },
				"properties": { "error": "No Data" }
			}
		]
	} ,
	
	initialize(path, options) {
		
		//fetch the layer and construct the layer, but asynchronous
		this._initPromise = this.fetchJsonPromise(path)
			.catch(error => {return this._errorJson})
			.then(json => {
				L.GeoJSON.Legend.prototype.initialize.call(this,json,options) ;
			  } );		
	} ,
	
	fetchJsonPromise(path) {
		//fetch the file of interest
		let promise = fetch(path).
			then(response => response.json() ) 
			
		
		return promise ;
	},
	
	onAdd(map) {
		// check that the layer has initialized before adding layer.
		this._initPromise
			.then(layer => { L.GeoJSON.Legend.prototype.onAdd.call(this,map) } ) ;
	},
	

}) 


L.geoJSON.local = function (path, options) {
	return new L.GeoJSON.Local(path, options) ;
}
	
/* class GeoJSON.TimeLocal
aka L.GeoJSON.TimeLocal
@ inherits L.GeoJSON.Local

Add time handling to L.GeoJSON.Local

time,fileBasePath and fileExtension are used by 'mixin' TimeLocal

The following options are additional to those from L.GeoJSON:
freq: 'daily'/'monthly'/'yearly' to specify how far apart images are in time
legendUrl: sets the path to an image with the legend for these overlays.

*/
L.GeoJSON.TimeLocal = L.GeoJSON.Local.extend({
	
	includes: TimeLocal, 
			
	initialize(time, fileBasePath, fileExtension, options )  {
		
		this.setupTimeLocal(
			fileBasePath, fileExtension, options
		) ;
		
		L.GeoJSON.Local.prototype.initialize.call(
			this,this.localUrl(time),options
		) ;
		
	} ,
	
	onAdd: function(map) {
		
		this.startEventListener(map) ;
		
		L.GeoJSON.Local.prototype.onAdd.call(this,map) ;
		
		this.updateTime(map) ; 
		
	} ,
	
	updateTime: function(dateObj) {
		
		this.clearLayers() ;
				
		this.fetchJsonPromise(
				this.localUrl(dateObj.date)
			).catch(error => {
				console.debug(`No ${this.name} for this date`) ;
				return this._errorJson ;
				})
			.then(iJson => {
				//console.debug(iJson) ;
				this.addData(iJson) ;
				}) ;
			
	
	}
	
})

L.geoJSON.timeLocal = function (time, fileBasePath, fileExtension, options ) {
	return new L.GeoJSON.TimeLocal(time, fileBasePath, fileExtension, options ) ;
}