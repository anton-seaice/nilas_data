
/* class ImageOverlay.TimeLocal
aka L.ImageOverlay.TimeLocal
@ inherits ImageOverlay

Uses to load a single image from local storage based on the specified time

*/

L.ImageOverlay.TimeLocal=L.ImageOverlay.extend({
	
	
	initialize: function (time, fileBasePath, fileExtension, bounds, options) { // (String (dd-mm-yyyy) , String, String, LatLngBounds, Object)
		this._basePath=String(fileBasePath) ;
		this._fileExtension=String(fileExtension) ;
		this._time = String(time) ;
		
		L.ImageOverlay.prototype.initialize.call(
			this, this._localUrl(), bounds, options
			) ;
		
		
	},
	
	setTime: function(time) {
		this._time = time ;
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