/* class Control.ImgLegend
aka L.Control.ImgLegend
@ inherits L.Control

Used to add a 'control' element to display the an image file as the legend for an image overlay layer. Not intended to be called directly, but used through L.ImageOverlay.Legend by specifying options:

legendUrl: path to the image file to display

the image is style by the css style 'legend-img'

*/

L.Control.ImgLegend=L.Control.extend({
	options: {
		position: 'bottomleft'
	} ,
	
	initialize(url) {
		this._url = url ;
	},
	
	onAdd(map) {		
		this._img = L.DomUtil.create('img', 'legend-img' ) ;
		this._img.src=this._url ;
		return this._img ;
	},
	
	onRemove(map) {
		L.DomUtil.remove(this._img) ;
	}
})

L.control.imgLegend = function(url) {
	return new L.Control.ImgLegend(url) ;
}

/* class ImageOverlay.Legend
aka L.ImageOverlay.Legend
@ inherits L.ImageOverlay

Used to add a 'control' element to display the legend based on a provided url for an image file which contains the legend. Only add the legend if the 'legendUrl' property has been set in options:

legendUrl: path to the image file to display

other functionality is inherited from L.ImageOverlay

*/
L.ImageOverlay.Legend=L.ImageOverlay.extend({
	
	onAdd(map) {
			
		if (this.legend) {
			console.debug("adding legend: " + this.options.legendUrl ) ;
			this.legend.addTo(map) ;
		}
		
		L.ImageOverlay.prototype.onAdd.call(this,map) ;
	},	
	
	onRemove(map) {
		if (this.legend) {
			this.legend.remove(map) ;
		}
		
		L.ImageOverlay.prototype.onRemove.call(this,map) ;
	}
})

L.ImageOverlay.Legend.addInitHook( function() {
	if (this.options.legendUrl) {
		this.legend=L.control.imgLegend(this.options.legendUrl) ;
	} ;
})
