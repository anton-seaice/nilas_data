import TimeLocal from './timeLocal.js' ;
import './L.ImageOverlay.Legend.js' ;

/* class ImageOverlay.TimeLocal
aka L.ImageOverlay.TimeLocal
@ inherits ImageOverlay

Uses to load a single image from local storage based on the specified time

useage:

L.imageOverlay.timeLocal=(time, fileBasePath, fileExtension, bounds, options) 

time,fileBasePath and fileExtension are used by 'mixin' TimeLocal

Bounds is unchanged from L.ImageOverlay

The following options are additional to those from L.ImageOverlay:
freq: 'daily'/'monthly'/'yearly' to specify how far apart images are in time
legendUrl: sets the path to an image with the legend for these overlays.

*/

L.ImageOverlay.TimeLocal=L.ImageOverlay.Legend.extend({
		
	includes: TimeLocal ,
		
	initialize(time, fileBasePath, fileExtension, bounds, options ) { 
	// (String (dd-mm-yyyy), String, String, LatLngBounds, Object)
			
		this.setupTimeLocal(
			fileBasePath, fileExtension, options
		) ;
				
		// run the initialize function from the super class
		L.ImageOverlay.prototype.initialize.call(
			this, this.localUrl(time), bounds, options
		) ;
	},
	
	onAdd(map) {
		
		this.startEventListener(map) ;
		
		this.setUrl(this.localUrl(map.date)) ;
		
		L.ImageOverlay.Legend.prototype.onAdd.call(this,map) ;
		
	} ,
	
	onRemove(map) {
		
		this.stopEventListener(map) ;
		
		L.ImageOverlay.Legend.prototype.onRemove.call(this,map) ;
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

*/

L.ImageOverlay.TimeLocal.Bremen=L.ImageOverlay.TimeLocal.extend({
	
	localUrl(time) {
		const d = new Date(time);
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