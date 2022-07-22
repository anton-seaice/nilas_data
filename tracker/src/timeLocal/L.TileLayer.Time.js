/* class TileLayer.Time
aka L.TileLayer.Time
@ inherits TileLayer

Uses to load a single image from web based on the specified time

Options are unchanged from L.TileLayer

*/


L.TileLayer.Time = L.TileLayer.extend({
	
	onAdd: function(map) {
		
		//corner-case: if the layer being added is higher freq than the current date picker, map-date may return a partial date, so extend it first.
		const d = new Date(map.date);
		this.options.time = d.toISOString().substr(0,10)  ;

		console.debug(this.options) ;

		// set up events
		map.on('dayChanged', this.updateTime, this) ;
		
		L.TileLayer.prototype.onAdd.call(this,map) ;
		
	} ,
	
	onRemove: function(map) {
		map.off('dayChanged', this.updateTime, this) ;
		L.TileLayer.prototype.onRemove.call(this,map) ;
	},
	
	updateTime: function(eventValue) {
		this.options.time=eventValue.date ;
		this.redraw() ;
	}
	
})

L.tileLayer.time = function (url, options) {
	return new L.TileLayer.Time(url, options) ;
}

L.TileLayer.WMS.Time = L.TileLayer.WMS.extend({
	
	//untested!!
	
	onAdd: function(map) {
		
		//corner-case: if the layer being added is higher freq than the current date picker, map-date may return a partial date, so extend it first.
		const d = new Date(map.date);
		this.wmsParams.time = d.toISOString().substr(0,10)  ;

		console.debug(this.wmsParams) ;
		
		// set up events
		map.on('dayChanged', this.updateTime, this) ;
		
		L.TileLayer.WMS.prototype.onAdd.call(this,map) ;
		
	} ,
	
	onRemove: function(map) {
		map.off('dayChanged', this.updateTime, this) ;
		L.TileLayer.WMS.prototype.onRemove.call(this,map) ;
	},
	
	updateTime: function(eventValue) {
		this.setParams({time:eventValue.date}) ;
		console.debug(this.wmsParams) ;
	}
	
})

L.tileLayer.wms.time = function (url, options) {
	return new L.TileLayer.WMS.Time(url, options) ;
}
