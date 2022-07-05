
/* class ImageOverlay.TimeLocal
aka L.ImageOverlay.TimeLocal
@ inherits ImageOverlay

Uses to load a single image from local storage based on the specified time

Options are unchanged from L.ImageOverlay

*/

L.ImageOverlay.TimeLocal=L.ImageOverlay.extend({
		
	initialize: function (time, fileBasePath, fileExtension, bounds, options ) { // (String (dd-mm-yyyy) , String, String, LatLngBounds, Object)
		this._basePath=String(fileBasePath) ;
		this._fileExtension=String(fileExtension) ;
		this._time = String(time) ;
		
		//construct a url from the arguments
		let url = this._localUrl() ;
		
		// run the initialize function from the super class
		L.ImageOverlay.prototype.initialize.call(
			this, url , bounds, options
		) ;
	},
	
	onAdd: function(map) {
		//grab the current date from the map
		this._time=map.date ;

		// set up events
		map.on('dayChanged', this.updateTime, this) ;
		
		L.ImageOverlay.prototype.onAdd.call(this,map) ;
		
		console.log(this._localUrl()) ;
	} ,
	
	onRemove: function(map) {
		map.off('dayChanged', this.updateTime, this) ;
		
		L.ImageOverlay.prototype.onRemove.call(this,map) ;
	},
	
	updateTime: function(eventValue) {
		//change and redraw for the new time
		this._time = eventValue.date ;
		console.log(this._localUrl()) ;
		this.setUrl(this._localUrl()) ;
	},
		
	_localUrl: function() {
		const d = new Date(this._time);
		const year = String(d.getFullYear());
		const month = String(d.getMonth() +1) ; //zero indexed
		return this._basePath+year+'_'+month+this._fileExtension ;
	}
	
})

L.imageOverlay.timeLocal = function (time, fileBasePath, fileExtension, bounds, options) {
	return new L.ImageOverlay.TimeLocal(time, fileBasePath, fileExtension, bounds, options) ;
}

L.TileLayer.Time = L.TileLayer.extend({
	
	onAdd: function(map) {
		//grab the current date from the map
		this.options.time=map.date; //+'T00:00:00Z' ;

		// set up events
		map.on('dayChanged', this.updateTime, this) ;
		
		console.log(this.options) ;
		
		L.TileLayer.prototype.onAdd.call(this,map) ;
		
		console.log(this.getTileUrl()) ;
	} ,
	
	onRemove: function(map) {
		map.off('dayChanged', this.updateTime, this) ;
		L.TileLayer.prototype.onRemove.call(this,map) ;
	},
	
	updateTime: function(eventValue) {
		this.options.time=eventValue.date+'T00:00:00Z' ;
		this.redraw() ;
	}
	
})

L.tileLayer.time = function (url, options) {
	return new L.TileLayer.Time(url, options) ;
}