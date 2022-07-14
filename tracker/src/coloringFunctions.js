const color = {
	iceExtentFn(feature) {
		if (feature.properties.z_value==0.15) {
			return {color: '#fc8d62'} ;
		}
		else if (feature.properties.z_value==0.8) {
			return {color: '#f5f5f5'} ;
		}
		else {
			console.debug(feature.properties.z_value + " is not a known contour level to color")
			return {} ;
		}
	},
	greenMarkerFn(feature, latlng) { //shiptrack
		const markerOptions = {
			radius: 4,
			fillColor: "#66c2a5",
			color: "#000",
			weight: 0,
			opacity: 1,
			fillOpacity: 1
		};
		return L.circleMarker(latlng, markerOptions) ;
	}
	
}

export default color ;
