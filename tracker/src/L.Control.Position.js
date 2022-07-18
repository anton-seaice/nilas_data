L.Control.Position = L.Control.extend({ 
        
        options: {
          position: 'topleft'
        },

		onAdd() {
			var latlng = L.DomUtil.create('div', 'mouse-position');
			this._latlng = latlng;         
		  
			return latlng;
		} ,

                
        hide(event) {
        	this._latlng.innerHTML = null ;
        },

        updateHTML(lat, lng) {
          var latlng = lat + " " + lng;
          //this._latlng.innerHTML = "Latitude: " + lat + "   Longitiude: " + lng;
          this._latlng.innerHTML = "LatLng: " + latlng;
        }
});
      
L.control.position = function(options) {
	return new L.Control.Position(options) ;
}
