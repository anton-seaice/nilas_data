import {color} from './src/coloringFunctions.js' ;

/*for each layer with a time domain, configure using the examples below options are passed as options to the initialize function of the class set zIndex as follows:
	 zIndex: 1 (default) for baseLayers
	 zIndex: 2 for concentrations
	 zIndex: 3 for filled anomalies
	 zIndex: 4 for contour lines
	 zIndex: 5 for overlays (coastlines, shiptrack etc)
	nb: these are different to z'index in css elements 
	
	layers in the Layer Control are sorted in the order in this list
*/


export const timeLayers = {
	'MODIS Imagery (Daily)':{
		type: "TileLayer" ,
		url:"http://map1{s}.vis.earthdata.nasa.gov/wmts-antarctic/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
		options:{
			layer: "MODIS_Aqua_CorrectedReflectance_TrueColor",
			tileMatrixSet: "EPSG3031_250m",
			format: "image%2Fjpeg",
			tileSize: 512,
			subdomains: "abc",
			noWrap: true,
			continuousWorld: true,
			attribution:"<a href='https://earthdata.nasa.gov/gibs'>NASA</a>",
			zIndex:1,
			freq:'monthly'
		}
	},
	'Sea Ice Conc High Res (Daily)':{
		type: 'ImageOverlay' ,
		filePath:'data/hr_sea_ice_conc/bremen_sea_ice_conc_' ,
		fileExt:'.png',
		options:{
			opacity: 0.7, 
			attribution: "<a href='https://seaice.uni-bremen.de/sea-ice-concentration/amsre-amsr2/'>AMSR2</a>",
			zIndex:2,
			//freq:'daily',
			legendUrl:'data/sea_ice_conc_legend.png'
		}
	},
	'Sea Ice Conc (Monthly)':{
		//used in tracker.js :
		type: 'ImageOverlay' ,
		showAtOpen:true , //this field is optional,
		//used by L.ImageOverlay.TileLocal extension :
		filePath:'data/sea_ice_conc/nsidc_sea_ice_conc_' ,
		fileExt:'.png',
		options:{
			//used by L.ImageOverlay base class
			opacity: 1, 
			attribution: "<a href='https://nsidc.org/data/g02202'>NSIDC CDR</a>", 
			alt: "Map of Sea Ice Concentration", 
			errorOverlayUrl:'',
			zIndex:2,
			//used by L.ImageOverlay.TileLocal extension :
			freq:'monthly',
			//used by L.ImageOverlay.Legend extension :
			legendUrl:'data/sea_ice_conc_legend.png'
		} 
	},
	'Sea Ice Conc Anoms (Monthly)':{
		type: 'ImageOverlay' ,
		filePath:'data/sea_ice_conc_anoms/nsidc_sea_ice_conc_anoms_' ,
		fileExt:'.svg',
		options:{
			opacity: 0.7, 
			attribution: "Derived (<a href='https://nsidc.org/data/g02202'>1981-2010 Climatology</a>)",
			alt: "Map of Sea Ice Concentration",
			zIndex:3,
			freq:'monthly',
			legendUrl:'data/sea_ice_conc_anoms_legend.png'
		}
	},
	'Sea Ice Extent (Monthly)': {
		type:'GeoJSON',
		filePath:'data/sea_ice_extent/ice_extent_',
		fileExt:'.geojson',
		options: {
			zIndex:4 ,
			freq:'monthly', 
			style: color.iceExtentFn,
			attribution: "Ice Extent Derived from <a href='https://nsidc.org/data/g02202'>NSIDC CDR</a>",
			legend: {
				style: 'line',
				colors: [color.contour15, color.contour80] ,
				labels: [
					'15% Concentration (Sea Ice Extent)',
					'80% Concentration'
				]
			}
		}
	},
	'Mean Sea Ice Extent': {
		type:'GeoJSON',
		filePath:'data/sea_ice_extent_mean/ice_extent_mean_',
		fileExt:'.geojson',
		options: {
			zIndex:4 ,
			freq:'monthly mean', 
			style: color.iceExtentFn,
			attribution: "Ice Extent Derived from <a href='https://nsidc.org/data/g02202'>NSIDC CDR</a>",
			legend: {
				style: 'line',
				colors: [color.contour15, color.contour80] ,
				labels: [
					'Mean 15% Concentration',
					'Mean 80% Concentration'
				]
			}
		}
	},				
	'Chlorophyll Conc (Monthly)':{
		type: 'ImageOverlay' ,
		filePath:'data/chlor_conc/occci_chlor_conc_' ,
		fileExt:'.png',
		bounds: [[-23.13, -45],[-23.13, 135.0]] ,
		options:{
			opacity: 1, 
			attribution: "<a href='https://www.oceancolour.org/'>Ocean Colour - CCI</a>",
			alt: "Map of Chlorophyll Concentration",
			zIndex:2,
			freq:'monthly',
			legendUrl:'data/chlor_conc_legend.png'
		}
	},
	'Chlorophyll Conc Anoms (Monthly)':{
		type: 'ImageOverlay' ,
		filePath:'data/chlor_conc_anoms/occci_chlor_conc_anoms_' ,
		fileExt:'.png',
		bounds: [[-23.13, -45],[-23.13, 135.0]] ,
		options:{
			opacity: 1, 
			attribution: "Derived <a href='https://www.oceancolour.org/'>1998-2020 Climatology</a>)",
			alt: "Map of Chlorophyll Concentration Anomalies",
			zIndex:3,
			freq:'monthly',
			legendUrl:'data/chlor_conc_anoms_legend.png'
		}
	}
} ;

