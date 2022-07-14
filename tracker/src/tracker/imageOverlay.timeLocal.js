import TimeLocal from './timeLocal.js' ;

/* class ImageOverlay.TimeLocal
aka L.ImageOverlay.TimeLocal
@ inherits ImageOverlay

Uses to load a single image from local storage based on the specified time

Options are unchanged from L.ImageOverlay

*/

L.ImageOverlay.TimeLocal=L.ImageOverlay.extend({
		
	includes: TimeLocal ,
		
	initialize(time, fileBasePath, fileExtension, bounds, options ) { // (String (dd-mm-yyyy) , String, String, LatLngBounds, Object)
			
		this.setupTimeLocal(
			fileBasePath, fileExtension, options
		) ;
				
		// run the initialize function from the super class
		L.ImageOverlay.prototype.initialize.call(
			this, this.localUrl(time), bounds, options
		) ;
	},
	
	onAdd(map) {
		
		//grab the current date from the map
		this.updateTime(map) ;
				
		this.startEventListener(map) ;
		
		L.ImageOverlay.prototype.onAdd.call(this,map) ;
		
	} ,
	
	onRemove(map) {
		if (this.options.freq=='yearly') { map.off('yearChanged', this.updateTime, this) ; }
		else if (this.options.freq=='monthly') { map.off('monthChanged', this.updateTime, this) ; }
		else { map.off('dayChanged', this.updateTime, this) ; } ;
		
		L.ImageOverlay.prototype.onRemove.call(this,map) ;
	},
	
	updateTime(eventValue) {
		//change and redraw for the new time
		this.setUrl(this.localUrl(eventValue.date)) ;
	},
	
})

L.imageOverlay.timeLocal = function (time, fileBasePath, fileExtension, bounds, options) {
	return new L.ImageOverlay.TimeLocal(time, fileBasePath, fileExtension, bounds, options) ;
}

/* class ImageOverlay.TimeLocal.Bremen
@ inherits ImageOverlay.TimeLocal

Uses to load a single image from local storage based on the specified time

Constructs file names consistent with unchanged Bremen files (if desired).

Options are unchanged from L.ImageOverlay

*/

L.ImageOverlay.TimeLocal.Bremen=L.ImageOverlay.TimeLocal.extend({
	
	localUrl: function() {
		const d = new Date(this._time);
		const dateStr = String(
			d.getFullYear()
				+("0"+(d.getMonth()+1)).slice(-2)
				+("0" + d.getDate()).slice(-2)
			);
    	return this._basePath+dateStr+this._fileExtension ;
	}
})

L.imageOverlay.timeLocal.bremen = function (time, fileBasePath, fileExtension, bounds, options) {
	return new L.ImageOverlay.TimeLocal.Bremen(time, fileBasePath, fileExtension, bounds, options) ;
}