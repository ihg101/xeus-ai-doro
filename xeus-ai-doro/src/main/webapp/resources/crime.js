Layers["bigdata_sys1000025"] = {
	state : 'active',
	name : "서울시우선설치지역",
	group : "배경지도",
	fnGroup : [ LayerFnGroup.DATA ],
	url : LayerConst.URL,
	type : LayerConst.MULTIPOLYGON,
	typeName : "gmx:bigdata_sys1000025",
	LayerTheme : "bigdata_sys1000025",
	zIndex : 0,
	visible : false,
	selectable : true,
	minResolution : 0,
	maxResolution : 38.175730459676004,
	shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(255, 0, 0, 1);'/></svg>",
	style : function(feature, resolution){
		var text = feature.get("grid_id");

		var color = "gray";
		var grade = feature.get("grade");
		if(grade.toUpperCase() == "A") color = chroma("gray").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "B") color = chroma("skyblue").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "C") color = chroma("green").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "D") color = chroma("yellow").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "E") color = chroma("red").alpha(0.2).rgba().toString();

		if(grade.toUpperCase() != "E") text = "";

		var resolution = GMXMAP.getView().getResolution();
		if(resolution > 2.4){
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(' + color + ')',
				}),
			});
		}else{
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(' + color + ')',
				}),
				text: new ol.style.Text({
					font: '13px Calibri,sans-serif',
					text: '' + text,
					fill: new ol.style.Fill({
						color: '#000'
					}),
					stroke: new ol.style.Stroke({
						color: '#fff',
						width: 3
					})
				})
			});
		}
	},
	lastParam : null,
	loadFunction : function(_lyr, val){
		this.lastParam = val;
		var _source = _lyr.getSource();
		var _geoJSON = new ol.format.GeoJSON();

		$.ajax({
			url : _common.context() + "/CustomWFS",
			type : "POST",
			data : {
				tbl : "bigdata_sys1000025",
				/*col : "emd_cd",
				val : val,*/
				bbox : Spatial.getExtent(GMXMAP).toString()
			},
			dataType : "json",
			beforeSend : function() {
				_source.clear();
			},
			success : function(json) {
				var _features = _geoJSON.readFeatures(json);
				_source.addFeatures(_features);

				json = null;
			},
			error : function(xhr, status, error) { }
		});
	},
	reload : function(){
		this.loadFunction(GMXMAP.getLayerByName(this["name"]));
	}
}

Layers["bigdata_sys1000026"] = {
	state : 'active',
	name : "서울시우선설치지역(라벨)",
	group : "배경지도",
	fnGroup : [ LayerFnGroup.DATA ],
	url : LayerConst.URL,
	type : LayerConst.MULTIPOLYGON,
	typeName : "gmx:bigdata_sys1000026",
	LayerTheme : "bigdata_sys1000026",
	zIndex : 0,
	visible : false,
	selectable : true,
	minResolution : 0,
	maxResolution : 38.175730459676004,
	shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(128, 128, 128, 1);'/></svg>",
	style : function(feature, resolution){
		var text = feature.get("grid_id");

		var color = "gray";
		var grade = feature.get("grade");
		if(grade.toUpperCase() == "A") color = chroma("gray").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "B") color = chroma("skyblue").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "C") color = chroma("green").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "D") color = chroma("yellow").alpha(0.4).rgba().toString();
		if(grade.toUpperCase() == "E") color = chroma("red").alpha(0.2).rgba().toString();

		if(grade.toUpperCase() != "E") text = "";

		var resolution = GMXMAP.getView().getResolution();
		if(resolution > 2.4){
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(' + color + ')',
				}),
			});
		}else{
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(' + color + ')',
				}),
				text: new ol.style.Text({
					font: '13px Calibri,sans-serif',
					text: '' + text,
					fill: new ol.style.Fill({
						color: '#000'
					}),
					stroke: new ol.style.Stroke({
						color: '#fff',
						width: 3
					})
				})
			});
		}
	},
	lastParam : null,
	loadFunction : function(_lyr, val){
		this.lastParam = val;
		var _source = _lyr.getSource();
		var _geoJSON = new ol.format.GeoJSON();

		$.ajax({
			url : _common.context() + "/CustomWFS",
			type : "POST",
			data : {
				tbl : "bigdata_sys1000026",
				/*col : "emd_cd",
			val : val,*/
				bbox : Spatial.getExtent(GMXMAP).toString()
			},
			dataType : "json",
			beforeSend : function() {
				_source.clear();
			},
			success : function(json) {
				var _features = _geoJSON.readFeatures(json);
				_source.addFeatures(_features);

				json = null;
			},
			error : function(xhr, status, error) { }
		});
	},
	reload : function(){
		this.loadFunction(GMXMAP.getLayerByName(this["name"]));
	}
}

Layers["asset_crime_2019"] = {
	state : 'active',
	name : "범죄요인",
	group : "배경지도",
	fnGroup : [ LayerFnGroup.DATA ],
	url : LayerConst.URL,
	type : LayerConst.MULTIPOLYGON,
	typeName : "gmx:asset_crime_2019",
	LayerTheme : "asset_crime_2019",
	zIndex : 0,
	visible : false,
	selectable : true,
	minResolution : 0,
	maxResolution : 38.175730459676004,
	shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(255, 0, 0, 1);'/></svg>",
	style : function(feature, resolution){
		var colorArray = chroma.scale(['#FFE400', '#FF0000']).colors(10);
		var grade = Number(feature.get("grade3_cri"));
		var color = chroma(colorArray[grade]).alpha(0.5).rgba().toString();
		if(grade == 0){
			color = chroma(colorArray[grade]).alpha(0).rgba().toString();
			grade = "";
		}
		var text = feature.get("grid_nm");

		var resolution = GMXMAP.getView().getResolution();
		if(resolution > 0.6){
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(' + color + ')',
				})
			});
		}else{
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(' + color + ')',
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: '' + grade,
					fill: new ol.style.Fill({
						color: '#000'
					}),
					stroke: new ol.style.Stroke({
						color: '#fff',
						width: 3
					})
				})
			});
		}
	},
	lastParam : null,
	loadFunction : function(_lyr, val){
		this.lastParam = val;
		var _source = _lyr.getSource();
		var _geoJSON = new ol.format.GeoJSON();

		$.ajax({
			url : _common.context() + "/CustomWFS",
			type : "POST",
			data : {
				tbl : "asset_crime_2019",
				/*col : "emd_cd",
				val : val,*/
				bbox : Spatial.getExtent(GMXMAP).toString()
			},
			dataType : "json",
			beforeSend : function() {
				_source.clear();
			},
			success : function(json) {
				var _features = _geoJSON.readFeatures(json);
				_source.addFeatures(_features);

				json = null;
			},
			error : function(xhr, status, error) { }
		});
	},
	reload : function(){
		this.loadFunction(GMXMAP.getLayerByName(this["name"]));
	}
}