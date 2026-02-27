/**
 * 스케치 레이어를 관리합니다.
 */
"use strict";

(function(GMXMAP, GMXLAYER){

if(GMXMAP != null && GMXLAYER != null){
	if(GMXMAP instanceof ol.Map){

		var _lastWFSParam = null;
		GMXMAP.getSketchLayerWFSParam = function(){ return _lastWFSParam; }

		GMXMAP["sketchLayer"] = new ol.layer.Vector({
			id : "user_sketch_geom",
			name : "_스케치_레이어_",
			zIndex : 9999,
			visible : false,
			schema : "draw",
			geomType : "sketch",

			source : new ol.source.Vector({
				//strategy : ol.loadingstrategy.bbox,
				loader : function(extent, resolution, projection) {
					var _source = this;
					var _wfsParam = {
						service : "WFS",
						version : "1.1.0",
						request : "GetFeature",
						typename : "gmx:user_sketch_geom",
						outputFormat : "json",
						srsname : "EPSG:5186",
						//bbox : extent.join(",") + ",EPSG:5186"
					};

					var _Filter = true;
					if(_Filter && !_common.utils.isNullAndEmpty(userId)){
						delete _wfsParam["bbox"];
						_wfsParam["filter"] = GMXLAYER.makeFilter("mk_user", userId);
						_lastWFSParam = JSON.parse(JSON.stringify(_wfsParam));
					}

					GMXLAYER.loadFeatures(_source, _wfsParam);
				}
			}),

			style : function(_feature, _resolution){
				var _txt = _feature.get("label_txt");
				if(_txt == null) _txt = "";

				var _style = {
					stroke: new ol.style.Stroke({
						color : "rgb(255, 0, 0)",
						width : Number(3)
					}),
					fill: new ol.style.Fill({
						color : "rgba(255, 0, 0, 0.3)"
					}),
					text: new ol.style.Text({
						font : "15px Nanum, sans-serif",
						text : String(_txt),
						textAlign : "center",
						textBaseline : "bottom",
						offsetX: Number(0),
						offsetY: Number(30),
						fill : new ol.style.Fill({
							color : "rgba(0, 0, 0, 1)"
						}),
						stroke: new ol.style.Stroke({
							color : "rgba(255, 255, 255, 1)",
							width : Number(2)
						})
					})
				};

				if(_feature.getGeometry().getType() === "Point"){
					_style["radius"] = Number(5);

					return new ol.style.Style({
						image: new ol.style.Circle(_style),
						text: _style.text
					});
				}else{
					return new ol.style.Style(_style);
				}
			}
		});
		GMXMAP.addLayer(GMXMAP["sketchLayer"]);

		GMXMAP["sketchLayerReload"] = function(){
			if(GMXMAP["sketchLayer"] instanceof ol.layer.Vector){
				//GMXLAYER.loadFeatures(GMXMAP["sketchLayer"].getSource(), _lastWFSParam);
				GMXMAP.reloadLayerData("user_sketch_geom");
			}
		}

	}
}

})(GMXMAP, GMXLAYER);