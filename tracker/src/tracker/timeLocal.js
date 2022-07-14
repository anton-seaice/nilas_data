
var TimeLocal={	

	setupTimeLocal(fileBasePath, fileExtension, options) {	

		this._basePath=String(fileBasePath) ;
		this._fileExtension=String(fileExtension) ;
		//this._time = String(time) ;
		
		L.setOptions(this, options) ;
		
	} ,
		
	localUrl(time) {	
		
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
		// set up events
		if (this.options.freq=='yearly') { map.on('yearChanged', this.updateTime, this) ; }
		else if (this.options.freq=='monthly') { map.on('monthChanged', this.updateTime, this) ; }
		else { map.on('dayChanged', this.updateTime, this) ; } ;
	}
		
}

export default TimeLocal ;