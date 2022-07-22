/* class Control.Date
aka L.Control.Date
@ inherits Control

Uses to add a date picker to the map.

The date is accessed through map.date

Changes in the date can be watched through listeners on these keywords:
'dayChanged', 'monthChanged', 'yearChanged'

*/

L.Control.Date=L.Control.extend({
	
	includes: L.Evented ,
	
	options: {
		position: 'topright',
		startDateOffset: '-5' , //number of days to offset from today
		minDate: '1980-01-01' ,
		maxDateOffset: '0', //number of days to offset from today
		freq: 'daily' //'monthly', 'yearly'
	} ,
	
	//initialize: can be inherited unchanged
	
	onAdd(map) {
		
		// we are hard-coding setting the date to 5 days ago 
		// date format is dd/mm/yyyy
		let myDate = new Date() ;
		let maxDate = new Date() ;
		
		maxDate.setTime(myDate.getTime()+this.options.maxDateOffset*60*60*24*1000) ;
		this.maxDate=maxDate.toISOString().substr(0, 10) ;
		
		myDate.setTime(myDate.getTime()+this.options.startDateOffset*60*60*24*1000) ;	
		map.date = myDate.toISOString().substr(0, 10) ;
				
		// make a div to put the input in
		this._container=L.DomUtil.create('form', 'date-control leaflet-control') ;
		
		// make the input element
		this._dateInput=L.DomUtil.create('input','tracker-date',this._container) ;
		
		// as a fall back, create a daily date picker. Specifying an option: {freq:'daily'/'monthly'/'yearly'} for each layer is better.
		this._dateInput.setAttribute('value',map.date) ;
		this._setPicker(this.options.freq) ;
		
		// set up an event listener for when an layer is added
		map.on('layeradd', this._layerChange, map) ;
		map.on('layerremove', this._layerChange, map) ;
		
		// el for when dateFreq is changed
		map.on('dateFreqChanged', event => {this._setPicker(event.freq);}, this ) ;
		
		// set up an event listener for when the date changes
		L.DomEvent.on(
			this._dateInput, //the html element that changes
			'change', //the action
			this._dateChange, //the function to call
			map, //the scope that the function runs within
		) ;	
		
		// send this back to L.Control to show it
		return this._container ;
	},
	
	onRemove(map) {
		map.date=null ;
		L.DomEvent.off(this._dateInput) ;
		L.DomUtil.remove(this._container) ;
		
		map.off('layeradd', this._layerChange, map) ;
		map.off('layerremove', this._layerChange, map) ;
		map.off('dateFreqChanged', event => {this._setPicker(event.freq);}, this ) ; //this probably doesn't work
		
	},
	
	_setPicker(freq) {
		if (this._freq!=freq) {
			console.debug("Setting Date Frequency to " +freq) ;
		
			this._freq=freq ;
			
			let date= new Date(this._dateInput.value).toISOString().substr(0, 10) ; // this fill in missing month and day fields with 01
		
			switch(freq) {
				case 'yearly' :
					this._yearlyPicker(date) ;
					break ;
				case 'monthly' :
					this._monthlyPicker(date) ;
					break ;
				case 'daily':
				default :
					this._dailyPicker(date) ;
					break ;
			} ;
		}
	} ,
	
	_dailyPicker(date) {
		this._dateInput.removeAttribute('value') ;
		this._dateInput.type = 'date';
		this._dateInput.value = date ;
		this._dateInput.min = this.options.minDate; //make this line smart??
		this._dateInput.max = this.maxDate ;
	},
	
	_monthlyPicker(date) {
		this._dateInput.removeAttribute('value') ;
		this._dateInput.type = 'month';
		this._dateInput.value = date.substr(0,7) ;
		this._dateInput.min = this.options.minDate.substr(0,7); //make this line smart??
		this._dateInput.max = this.maxDate.substr(0,7) ;
	},
	
	_yearlyPicker(date) {
		this._dateInput.removeAttribute('value') ;	
		this._dateInput.type = 'number';
		this._dateInput.value = date.substr(0,4) ;
		this._dateInput.min = this.options.minDate.substr(0,4); //make this line smart??
		this._dateInput.max = this.maxDate.substr(0,4) ;
	},
	
	_layerChange(event) {
		// if the layer has a freq, then check if the date picker is correct still
		// this function needs to be run with map scope for these to be accessible outside this object.
			
		if (event.layer.options.freq) {
			let freqsList=[];
			this.eachLayer( function(l) {
					freqsList.push(l.options.freq) ;
			} ) ;
			
			if (freqsList.includes('daily')) {
				this.fire('dateFreqChanged', {freq:'daily'}) ;
			} else if (freqsList.includes('monthly')) {
				this.fire('dateFreqChanged', {freq:'monthly'}) ;
			} else if (freqsList.includes('yearly')) {
				this.fire('dateFreqChanged', {freq:'yearly'}) ;
			} else {
				this.fire('dateFreqChanged', {freq:'daily'}) ;
			} ;
		} ;
	} ,
	
	_dateChange(event) {
		console.debug("New Date Input:" + event.target.value) ;
		// this function needs to be run with map scope for these to be accessible outside this object.
		// these are intended to be caught be layer extensions to then change the layer as needed
		this.date=event.target.value ;
		
		switch(this._freq) {
			case 'daily' : 
				this.fire('dayChanged', {date:this.date} ) ;
			case 'monthly' :
				this.fire('monthChanged', {date:this.date}) ;
			case 'yearly' :
				this.fire('yearChanged', {date:this.date}) ;
				break ;
			default:
				this.fire('dayChanged', {date:this.date} ) ;
		} ;
	}
})

L.control.date = function (options) {
	return new L.Control.Date(options) ;
}


