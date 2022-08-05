export const color = {
	
	//ice extent
	contour15: '#d95f0e' ,
	contour80: '#1b9e77' ,
	
	iceExtentFn(feature) {	
		//By leaflet design, this function only styles lines/polygons
	
		switch (feature.properties.z_value) {
			case '0.15' :		
				return {color: color.contour15} ;
				break ;
			case '0.8' :
				return {color: color.contour80} ;
				break ;
			default:
				if (feature.properties.z_value) {
					console.debug(feature.properties.z_value + " is not a known contour level to color") ;
				} else {
					console.debug('This feature could not be styled:') ;
					console.debug(feature) ;
				}
				return {} ;
			}
	} ,
	
	iceExtentError(feature, latlng) {
		//this function styles points
		
		var layer=L.marker(latlng) ;
		
		if (feature.properties.error) {
				layer.bindTooltip(
					'No data for Sea Ice Extent (Monthly) for this month', 
					{permanent:true}
					) ;
			}
			
		return layer ;			
	},
	
	//mean ice extent
	meanContour15: '#fe9929' ,
	meanContour80: '#66c2a5' ,
	meanDashArray: '3 4',
	
	meanExtentFn(feature) {	
		switch (feature.properties.z_value) {
			case '0.15' :		
				return {color: color.meanContour15, dashArray:color.meanDashArray} ;
				break ;
			case '0.8' :
				return {color: color.meanContour80, dashArray:color.meanDashArray} ;
				break ;
			default:
				if (feature.properties.z_value) {
					console.debug(feature.properties.z_value + " is not a known contour level to color") ;
				} else {
					console.debug('This feature could not be styled:') ;
					console.debug(feature) ;
				}
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

