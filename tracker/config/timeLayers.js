import {color} from './color.js'

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
			tileSize: 256, //512
			subdomains: "abc",
			noWrap: true,
			continuousWorld: true,
			attribution:"<a href='https://earthdata.nasa.gov/gibs'>NASA</a>",
			zIndex:1,
			freq:'daily',
			//zoomOffset:-1,
			//minNativeZoom: 1 ,
			//bounds: [[-43, -42.25],[-44, 135.0]] These don't work,
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
			freq:'daily',
			alt:'No data for Sea Ice Conc High Res (Daily) on this date',
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
			alt:'No data for Sea Ice Conc (Monthly) on this date',
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
			alt: "Map of Anomalies in Sea Ice Concentration ",
			zIndex:3,
			freq:'monthly',
			alt:'No data for Sea Ice Conc (Monthly) on this month',
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
			style: color.iceExtentFn , //styles normal contour lines
			pointToLayer: color.iceExtentError , //styles error points
			attribution: "Ice Extent Derived from <a href='https://nsidc.org/data/g02202'>NSIDC CDR</a>",
			legend: {
				type: 'line',
				style: [
					`stroke:${color.contour15};stroke-width:3;`,
					`stroke:${color.contour80};stroke-width:3;`
					],
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
			style: color.meanExtentFn,
			attribution: "Derived <a href='https://nsidc.org/data/g02202'>1981-2010 Climatology</a>",
			legend: {
				type: 'line',
				style: [
					`stroke:${color.meanContour15};stroke-width:3;stroke-dashArray:${color.meanDashArray}`,
					`stroke:${color.meanContour80};stroke-width:3;stroke-dashArray:${color.meanDashArray}`
					],
				labels: [
					'Monthly Mean 15% Concentration',
					'Monthly Mean 80% Concentration'
				]
			}
		}
	},
	'Sea Ice Duration Anoms (Annual)':{
		type: 'ImageOverlay' ,
		filePath:'data/duration_anoms/' ,
		fileExt:'.svg',
		options:{
			opacity: 0.5, 
			attribution: "Derived (<a href='https://nsidc.org/data/g02202'>1981-2010 Climatology</a>)",
			zIndex: 3,
			freq:'yearly',
			alt:'No data for Sea Ice Duration for this year',
			legendUrl:'data/sea_ice_dur_anoms_legend.svg'
		}
	},
	'Sea Ice Advance Anoms (Annual)':{
		type: 'ImageOverlay' ,
		filePath:'data/advance_anoms/' ,
		fileExt:'.svg',
		options:{
			opacity: 0.5, 
			attribution: "Derived (<a href='https://nsidc.org/data/g02202'>1981-2010 Climatology</a>)",
			zIndex: 3,
			freq:'yearly',
			alt:'No data for Sea Ice Advance for this year',
			legendUrl:'data/sea_ice_adv_anoms_legend.svg'
		}
	},
	'Sea Ice Retreat Anoms (Annual)':{
		type: 'ImageOverlay' ,
		filePath:'data/retreat_anoms/' ,
		fileExt:'.svg',
		options:{
			opacity: 0.5, 
			attribution: "Derived (<a href='https://nsidc.org/data/g02202'>1981-2010 Climatology</a>)",
			alt: "Map of Sea Ice Retreat Anomalies",
			zIndex: 3,
			freq:'yearly',
			alt:'No data for Sea Ice Retreat for this year',
			legendUrl:'data/sea_ice_ret_anoms_legend.svg'
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
			zIndex:2,
			freq:'monthly',
			alt:'No data for Chlorophyll Conc for this month',
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
			zIndex:3,
			freq:'monthly',
			alt:'No data for Chlorophyll Conc for this month',
			legendUrl:'data/chlor_conc_anoms_legend.png'
		}
	}
} ;

