export const color = {
	
	//ice extent
	contour15: '#fc8d62' ,
	contour80: '#1b9e77' ,
	
	iceExtentFn(feature) {	
		if (feature.properties.z_value==0.15) {		
			return {color: color.contour15} ;
		}
		else if (feature.properties.z_value==0.8) {
			return {color: color.contour80} ;
		}
		else {
			console.debug(feature.properties.z_value + " is not a known contour level to color")
			return {} ;
		}
	} ,
	
	//mean ice extent
	meanContour15: '#fc8d62' ,
	meanContour80: '#66c2a5' ,
	
	iceExtentFn(feature) {	
		if (feature.properties.z_value==0.15) {		
			return {color: color.meanContour15} ;
		}
		else if (feature.properties.z_value==0.8) {
			return {color: color.meanContour80} ;
		}
		else {
			console.debug(feature.properties.z_value + " is not a known contour level to color")
			return {} ;
		}
	} ,
	
	//shiptrack
	shipTrackMarker: {
			radius: 4,
			fillColor: "#66c2a5",
			color: "#000",
			weight: 0,
			opacity: 1,
			fillOpacity: 1
		},
		
	greenMarkerFn(feature, latlng) {
		return L.circleMarker(latlng, color.shipTrackMarker) ;
	}
	
}

