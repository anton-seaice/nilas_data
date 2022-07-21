L.Control.Position = L.Control.extend({ 
        
	options: {
	  position: 'topleft'
	},

	onAdd(map) {
		this._latlng = L.DomUtil.create('div', 'mouse-position');       
		  
		map.on('mousemove', function (event) {
			let lat = Math.round(event.latlng.lat * 100) / 100;
			let lng = Math.round(event.latlng.lng * 100) / 100;
			this.updateHTML(lat, lng);
		  }, this);
		map.on('mouseout', this.hide, this) ;
		  
		return this._latlng;
	} ,

	onRemove(map) {
		L.DomUtil.remove(this._latlng) ;
	},
			
	hide(event) {
		this._latlng.innerHTML = null ;
	},

	updateHTML(lat, lng) {
	  //var latlng = lat + " " + lng;
	  this._latlng.innerHTML = "Lat: " + lat + "   Lng: " + lng;
	  //this._latlng.innerHTML = "LatLng: " + latlng;
	}
});
      
L.control.position = function(options) {
	return new L.Control.Position(options) ;
}
