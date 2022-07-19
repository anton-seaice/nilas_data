/* class Control.JSONLegend
aka L.Control.JSONLegend
@ inherits L.Control

Used to add a 'control' element to display the json legend. Not intended to be called directly, but used through L.GeoJSON.Legend by specifying options:

legend: {
	style: line ,
	colors: list of colors for each element required in the legend,
	labels: list of labels for each element in the legend
}

the legend is styled by the css style 'legend-img'

*/

L.Control.JSONLegend=L.Control.extend({
	options: {
		position: 'bottomleft'
	} ,
	
	initialize(props) {
		this.props=props ;
	},
	
	onAdd(map) {
		this._div = L.DomUtil.create('div', 'legend-json') ;
        
		if (this.props.type=='line') {
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < this.props.labels.length; i++) {
				this._div.innerHTML +=
					// use of the html here is quite messy. Maybe rewrite to use the same style function that the main geojson uses??
					`<svg height="15" width="30">
						<line x1="10" y1="10" x2="26" y2="10" style="${this.props.style[i]};"/>
					</svg>`
					//+'<i style="background:' + this.props.colors[i] + '"></i> ' +
					+'<span>' + this.props.labels[i] +'</span>'
					+'<br />';
			} ;
		}

		return this._div;
	},
	
	onRemove(map) {
		L.DomUtil.remove(this._div) ;
	}
})

L.control.jsonLegend = function(props) {
	return new L.Control.JSONLegend(props) ;
}

/* class GeoJSON.Legend
aka L.GeoJSON.Legend
@ inherits L.GeoJSON

Used to add a 'control' element to display the json legend. Only add the legend if the 'legend' property has been set in options:

legend: {
	style: line ,
	colors: list of colors for each element required in the legend,
	labels: list of labels for each element in the legend
}

other functionality is inherited from L.GeoJSON

*/

L.GeoJSON.Legend = L.GeoJSON.extend({
	
	onAdd(map) {
		if (this.legend) {
			console.debug("adding legend: " + this.options.legend ) ;
			this.legend.addTo(map) ;
		}
		
		L.GeoJSON.prototype.onAdd.call(this,map) ;
	} ,
	
	onRemove(map) {
		if (this.legend) {
			this.legend.remove(map) ;
		}
	
		L.GeoJSON.prototype.onRemove.call(this,map) ;
	}
})

L.GeoJSON.Legend.addInitHook( function() {
	if (this.options.legend) {
		this.legend=L.control.jsonLegend(this.options.legend) ;
	} ;
})
