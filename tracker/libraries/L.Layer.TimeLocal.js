
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
	
	updateTime: function(time) {
		//change and redraw for the new time
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