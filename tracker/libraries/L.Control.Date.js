/* class Control.Date
aka L.Control.Date
@ inherits Control

Uses to add a date picker to the map



*/

L.Control.Date=L.Control.extend({
	
	includes: L.Evented.prototype ,
	
	options: {
		position: 'bottomleft'
	} ,
	
	initialize: function (options) {
		L.Control.prototype.initialize.call(this, options) ;
	},
	
		
	onAdd: function(map) {
		
		// Set the current <input type="date"> and generate the initial layers
		let myDate = new Date() ;
		today=myDate.toISOString().substr(0, 10) ;
		myDate.setTime(myDate.getTime()-5*60*60*24*1000) ;	
		fiveDaysAgo = myDate.toISOString().substr(0, 10) ;
		
		
		this._dateInput=L.DomUtil.create(
			'input',
			'tracker-date',
			this._container
		) ;
		this._dateInput.setAttribute('type', 'date');
		this._dateInput.setAttribute('min', '1980-01-01'); //make this line smart??
		this._dateInput.setAttribute('max', today) ;
		this._dateInput.setAttribute('value', fiveDaysAgo) ;
		this._dateInput.setAttribute('id','date') ;
		
		
		L.DomEvent.on(
			this._dateInput,
			'change',
			this._dateChange,
			this,
		) ;
					
		return this._dateInput ;
	},
	
	_dateChange: function() {
		console.log("new date:" + this._dateInput.value) ;
		L.Evented.prototype.fire('dateChanged', {date:this._dateInput.value}) ;
	},
	
	onRemove: function(map) {
		return L.DomUtil.off(this._dateInput) ;
	}
})

L.control.date = function (options) {
	return new L.Control.Date(options)
}

