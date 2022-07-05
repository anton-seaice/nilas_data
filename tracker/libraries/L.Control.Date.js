/* class Control.Date
aka L.Control.Date
@ inherits Control

Uses to add a date picker to the map.

The date is accessed through map.date

Changes in the date can be watched through listeners on these keywords:
'dayChanged', 'monthChanged', 'yearChanged'

*/

L.Control.Date=L.Control.extend({
	
	includes: L.Evented.prototype ,
	
	options: {
		position: 'bottomleft',
		startDateOffset: '-5' , //number of days to offset from today
		minDate: '1980-01-01' ,
		maxDateOffset: '0' //number of days to offset from today
	} ,
	
	//initialize: can be inherited unchanged
	
	onAdd: function(map) {
		
		// we are hard-coding setting the date to 5 days ago 
		// date format is dd/mm/yyyy
		let myDate = new Date() ;
		let maxDate = new Date() ;
		
		maxDate.setTime(myDate.getTime()+this.options.maxDateOffset*60*60*24*1000) ;
		maxDateStr=maxDate.toISOString().substr(0, 10) ;
		
		myDate.setTime(myDate.getTime()+this.options.startDateOffset*60*60*24*1000) ;	
		map.date = myDate.toISOString().substr(0, 10) ;

		
		// make a div to put the input in
		this._container=L.DomUtil.create('div', 'date-control') ;
		
		// make an html input type="date"
		this._dateInput=L.DomUtil.create('input','tracker-date',this._container) ;
		this._dateInput.setAttribute('type', 'date');
		this._dateInput.setAttribute('min', this.options.minDate); //make this line smart??
		this._dateInput.setAttribute('max', maxDateStr) ;
		this._dateInput.setAttribute('value', map.date) ;
				
				
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
	
	_dateChange: function(event) {
		console.debug("New Date Input:" + event.target.value) ;
		// firing three events as a placeholder for re-writing using a different date picker
		// this function needs to be run with map scope for these to be accessible outside this object.
		this.date=event.target.value; //central tracking of the date
		this.fire('dayChanged', {date:event.target.value} ) ;
		this.fire('monthChanged', {date:event.target.value}) ;
		this.fire('yearChanged', {date:event.target.value}) ;
	},
	
	onRemove: function(map) {
		this.date=null ;
		L.DomEvent.off(this._dateInput) ;
		L.DomUtil.remove(this._container) ;
	},
		
})

L.control.date = function (options) {
	return new L.Control.Date(options)
}

