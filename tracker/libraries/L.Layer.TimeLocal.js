
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
				
		// run the initialize function from the super class
		L.ImageOverlay.prototype.initialize.call(
			this, this._localUrl() , bounds, options
		) ;
	},
	
	onAdd: function(map) {
		//grab the current date from the map
		this.updateTime(map) ;

		// set up events
		map.on('dayChanged', this.updateTime, this) ;
		
		L.ImageOverlay.prototype.onAdd.call(this,map) ;
		
		
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
		this.options.time=map.date +'T00:00:00Z' ;

		console.debug(this.options) ;

		// set up events
		map.on('dayChanged', this.updateTime, this) ;
		
		L.TileLayer.prototype.onAdd.call(this,map) ;
		
		console.log(this.getTileUrl()) ;
	} ,
	
	onRemove: function(map) {
		map.off('dayChanged', this.updateTime, this) ;
		L.TileLayer.prototype.onRemove.call(this,map) ;
	},
	
	updateTime: function(eventValue) {
		this.options.time=eventValue.date+'T00:00:00Z' ;
		console.log(this.getTileUrl()) ;
		this.redraw() ;
	}
	
})

L.tileLayer.time = function (url, options) {
	return new L.TileLayer.Time(url, options) ;
}

L.TileLayer.WMS.Time = L.TileLayer.WMS.extend({
	
	onAdd: function(map) {
		//grab the current date from the map
		this.options.time=map.date +'T00:00:00Z' ;

		console.debug(this.options) ;

		// set up events
		map.on('dayChanged', this.updateTime, this) ;
		
		L.TileLayer.WMS.prototype.onAdd.call(this,map) ;
		
		//console.log(this.getTileUrl()) ;
	} ,
	
	onRemove: function(map) {
		map.off('dayChanged', this.updateTime, this) ;
		L.TileLayer.WMS.prototype.onRemove.call(this,map) ;
	},
	
	updateTime: function(eventValue) {
		this.options.time=eventValue.date+'T00:00:00Z' ;
		//console.log(this.getTileUrl()) ;
		this.redraw() ;
	}
	
})

L.tileLayer.wms.time = function (url, options) {
	return new L.TileLayer.WMS.Time(url, options) ;
}


L.GeoJSON.Time = L.GeoJSON.extend({
	
	options: {
		interactive:false ,
		bubblingMouneEvents:false
	},
	
	initialize(json,options) {
		
		this.sourceData=json ;
		
		L.GeoJSON.prototype.initialize.call(this,json[0],options) ;
		
	} ,
	
	onAdd: function(map) {
		
		this.updateTime(map) ;
		map.on('monthChanged', this.updateTime, this) ;
		L.GeoJSON.prototype.onAdd.call(this,map) ;

	} ,
	
	updateTime: function(dateObj) {
		
		this.clearLayers() ;
		
		d = new Date(dateObj.date);
		year = String(d.getFullYear());
		month = String(d.getMonth() +1) ; //zero indexed
				
		this._time= new Date(year,month,1).toISOString().substr(0,10) ;
		
		console.debug('Ice Edge Date: ' + this._time) ;
		
		iJson = this.sourceData.filter((x)=>x.properties.time==this._time) ;
		
		console.debug(iJson) ;
		
		this.addData(iJson) ;
	
	}
	
})

L.geoJSON.time = function (json,options) {
	return new L.GeoJSON.Time(json,options) ;
}