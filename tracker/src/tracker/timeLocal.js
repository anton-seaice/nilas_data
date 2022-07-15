/*

These are functions to 'mixin' with leaflet classes to add time functions with local files

It relies on a date picker being added to the map (e.g. L.Control.Date) 

fileBasePath is all parts of the url that go before the date in the url
fileExtension is all parts of the url that go after the date in the url

options are shared with the leaflet class, the one used here is:
freq: 'daily'/'monthly'/'yearly' to specify how far apart images are in time

*/

var TimeLocal={	

	setupTimeLocal(fileBasePath, fileExtension, options) {	

		this._basePath=String(fileBasePath) ;
		this._fileExtension=String(fileExtension) ;
		
		L.setOptions(this, options) ;
		
	} ,
		
	localUrl(time) {
		
		/*return a url in the form:
		fileBasePath+dateString+fileExtension
		
		where dateString is :
		'YYYY-MM-DD' or 'YYYY-MM' or 'YYYY'
		
		depending on the value of this.options.freq
		
		(default: daily) 
		*/
		
		const d = new Date(time);
		const year = String(d.getFullYear());
		const month = String(d.getMonth() +1) ; //zero indexed
		const day = String(d.getDate()) ;
		
		if (this.options.freq=='yearly') { 
			return this._basePath+year+this._fileExtension ;
		} 
		else if (this.options.freq=='monthly') {
			return this._basePath+year+'_'+month+this._fileExtension ;
		} 
		else return this._basePath+year+'_'+month+'_'+day+this._fileExtension ;
		
	} ,
	
	startEventListener(map) {
		// start lisiting for date change events from the datePicker.
		if (this.options.freq=='yearly') { map.on('yearChanged', this.updateTime, this) ; }
		else if (this.options.freq=='monthly') { map.on('monthChanged', this.updateTime, this) ; }
		else { map.on('dayChanged', this.updateTime, this) ; } ;
	} ,
	
	stopEventListener(map) {
		if (this.options.freq=='yearly') { map.off('yearChanged', this.updateTime, this) ; }
		else if (this.options.freq=='monthly') { map.off('monthChanged', this.updateTime, this) ; }
		else { map.off('dayChanged', this.updateTime, this) ; } ;
	}
		
}

export default TimeLocal ;