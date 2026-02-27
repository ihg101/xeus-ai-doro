/**
 * <pre>
 * 레이어를 생성하는 객체 입니다.
 *
 * 1. loadData 함수를 호출하여 서버측에 레이어 정보를 요청합니다.
 * 2. loadLayer 함수를 통하여 LayerList에 담겨있는 레이어를 생성합니다.
 *
 * 각종 데이터 타입은 다음을 의미합니다.
 *
 * 공간정보
 * TYPE P : 포인트 - (P)oint
 * TYPE L : 라인   - (L)ine
 * TYPE G : 폴리곤 - Poly(G)on
 * TYPE T : 타일맵 - (T)ile
 *
 * 데이터형
 * TYPE S : String
 * TYPE N : Numeric
 * </pre>
 *
 * @auther 이주영
 *
 */
"use strict";
var TEST = null;

if(window.GMXLAYER == null) var GMXLAYER = {

	/**
	 * <pre>
	 * WFS 요청 URL 입니다.
	 * </pre>
	 */
	WFS_URL : "./GMT_proxy/wfs",

	/**
	 * <pre>
	 * 그룹 전체 정보를 보관합니다.
	 * </pre>
	 */
	GroupList : {},

	/**
	 * <pre>
	 * 각 레이어의 모든 관련정보를 보관합니다.
	 * group (그룹정보), layer(레이어 기본 정보), style(스타일 정보), theme(주제 스타일 정보)
	 * </pre>
	 */
	LayerList : {},

	/**
	 * <pre>
	 * 상단의 LayerList 객체에 정보를 담기 위해 서버에 정보를 요청합니다.
	 * 사용자 계정 및 현재 대메뉴를 기준으로 요청합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLAYER}
	 */
	loadData : function(){
		var _this = this;
		//통계 대메뉴는 처음에 지도가 없는 것으로 설계되었기 때문에 eventTab에 따른 레이어 정보를 가져온다
		_common.callAjax("/GMT_layer/getAllLayerInfo.json", {}, function(json){
			_this.GroupList = json.group;
			_this.LayerList = JSON.parse(JSON.stringify(json.layer));

			var geomList = json.geom;
			for(var key in _this.LayerList){
				if(key in geomList) _this.LayerList[key]["geometryType"] = geomList[key]["type"];
				if(key in geomList) _this.LayerList[key]["isView"] = geomList[key]["isView"];
			}

			geomList = null;
			json = null;
		}, false);

		return this;
	},

	/**
	 * <pre>
	 * loadData 함수 호출 이후, 실제 지도객체에 레이어를 추가하는 함수 입니다.
	 * </pre>
	 *
	 * @param _Map
	 * @returns {___anonymous_GMXLAYER}
	 */
	loadLayer : function(_Map){
		var _this = this;
		var list = _Map.getLayers().getArray();
		//GMXMAP에는 있지만 GMXLAYER에 없는 레이어 제거
		for(var i=0; i<list.length; i++){
			if(list[i].get("id") === "user_sketch_geom") continue;
			if(list[i].get("id") === "contextMenuVector") continue;
			if(list[i].get("id") === "contextMenuSpatialVector") continue;

			var containsLayer = null;

			for(var key in _this.LayerList){

				if(list[i].get("id") === key || list[i].get("name") === key){
					if(list[i].getZIndex() == _this.LayerList[key]['layer'].lyrZidx){
						containsLayer = list[i];
						break;
					}
				}
			}
			if(containsLayer == null){
				_Map.removeLayer(list[i]);
				i--;
			}

		}

		for(var key in _this.LayerList){
			var lyrTyp = _this.LayerList[key].layer.lyrTyp;
			var containsLayer = null;

			var list = _Map.getLayers().getArray();
			for(var i=0; i<list.length; i++){
				if(list[i].get("id") === key || list[i].get("name") === key){
					if(list[i].getZIndex() == _this.LayerList[key]['layer'].lyrZidx){
						containsLayer = list[i];
						break;
					}
				}
			}
			//공유레이어 처음 표출될 때  default로 visible false
			if(_this.LayerList[key].group.mgrSeq == 4){
				_this.LayerList[key].layer.visibleYn = false;
			}

			if(localStorage){
				if(key in localStorage){
					_this.LayerList[key].layer.visibleYn = (String(localStorage[key]) === "true" ? true : false);
				}
			}

//			_this.LayerList[key].layer.lyrZidx += 10 * _this.LayerList[key].group.grpZidx;

			if(lyrTyp === "T"){
				if(containsLayer == null){
					_Map.addLayer(_this.createTile(_this.LayerList[key].layer.tblId, _this.LayerList[key].layer));
				}
			}else{
				if(containsLayer != null){
					_Map.removeLayer(containsLayer);
					_Map.addLayer(_this.createVector(_this.LayerList[key]));
				}else{
					_Map.addLayer(_this.createVector(_this.LayerList[key]));
				}
			}
		}

		return this;
	},

	/**
	 * <pre>
	 * 지도 이미지 저장시 CORS 정책을 회피하기 위해 타일 객체를 리로드합니다.
	 * </pre>
	 *
	 * @param _Map
	 */
	setProxyTile : function(_Map){
		var _this = this;

		for(var key in _this.LayerList){
			var lyrTyp = _this.LayerList[key].layer.lyrTyp;
			var containsLayer = null;

			var list = _Map.getLayers().getArray();
			for(var i=0; i<list.length; i++){
				if(list[i].get("id") === key || list[i].get("name") === key){
					containsLayer = list[i];
				}
			}

			if(lyrTyp === "T"){
				if(containsLayer){
					//if(key.contains("bing_")) continue;

					var visible = containsLayer.getVisible();
					_Map.removeLayer(containsLayer);
					_Map.addLayer(_this.createTile(_this.LayerList[key].layer.tblId, _this.LayerList[key].layer));
					_Map.getLayer(key).setVisible(visible);
				}
			}
		}
	},

	/**
	 * <pre>
	 * 배경 지도 관련 레이어를 지도 객체에 추가합니다.
	 * </pre>
	 *
	 * @param tmsType - String
	 * @param visible - true or false
	 * @returns {___anonymous_GMXLAYER}
	 */
	createTile : function(tmsType, layerInfo){
		if("lyrZidx" in layerInfo === false) layerInfo["lyrZidx"] = -1;
		if("grpNm" in layerInfo === false){
			for(var i=0; i<this.GroupList.length; i++){
				if(this.GroupList[i].mgrSeq === layerInfo.grpMgrSeq){
					layerInfo["grpNm"] = this.GroupList[i].grpNm;
				}
			}
		}

		if(_common.utils.isNullAndEmpty(tmsType)) return;

		if(tmsType === "bing_road") return new BingMap().createRoadLayer(layerInfo);
		if(tmsType === "bing_aerial") return new BingMap().createAerialLayer(layerInfo);
		if(tmsType === "bing_aerial_label") return new BingMap().createAerialWithLabelsOnDemandLayer(layerInfo);
		if(tmsType === "bing_dark") return new BingMap().createDarkLayer(layerInfo);

		if(tmsType === "naver_map") return new NaverMap().createMapLayer(layerInfo);
		if(tmsType === "naver_tile") return new NaverMap().createTileLayer(layerInfo);
		if(tmsType === "naver_terrain") return new NaverMap().createTerrainLayer(layerInfo);
		if(tmsType === "naver_cbnd") return new NaverMap().createCbndLayer(layerInfo);

		if(tmsType === "daum_map") return new DaumMap().createMapLayer(layerInfo);
		if(tmsType === "daum_tile") return new DaumMap().createTileLayer(layerInfo);
		if(tmsType === "daum_road") return new DaumMap().createRealTimeRoadLayer(layerInfo);
		if(tmsType === "daum_terrain") return new DaumMap().createTerrainLayer(layerInfo);
		if(tmsType === "daum_hybrid") return new DaumMap().createHybridLayer(layerInfo);
		if(tmsType === "daum_cbnd") return new DaumMap().createCbndLayer(layerInfo);
		if(tmsType === "daum_roadview") return new DaumMap().createRoadViewLayer(layerInfo);

		if(tmsType === "daum_finedust") return new DaumMap().createFineDustLayer(layerInfo);
		if(tmsType === "daum_yellowdust") return new DaumMap().createYellowDustLayer(layerInfo);
		if(tmsType === "daum_no2") return new DaumMap().createNo2Layer(layerInfo);
		if(tmsType === "daum_so2") return new DaumMap().createSo2Layer(layerInfo);
		if(tmsType === "daum_cai") return new DaumMap().createCaiLayer(layerInfo);
		if(tmsType === "daum_pm25") return new DaumMap().createPm25Layer(layerInfo);
		if(tmsType === "daum_o3") return new DaumMap().createO3Layer(layerInfo);
		if(tmsType === "daum_co") return new DaumMap().createCoLayer(layerInfo);

//		if(tmsType === "ngii_emap") return new eMap().createLayer(layerInfo);

		return this;
	},

	/**
	 * <pre>
	 * OpenLayers > Vector 객체를 생성합니다.
	 * OL Source, OL Style 객체는 추가적인 함수 호출을 통하여 생성합니다.
	 * </pre>
	 *
	 * @param _Data
	 * @returns {ol.layer.Vector}
	 */
	createVector : function(_Data){
		var _this = this;
		var _constructData = {
			id : _Data.layer.tblId,
			name : _Data.layer.lyrNm,
			zIndex : _Data.layer.lyrZidx,
			visible : _Data.layer.visibleYn,
			schema : _Data.layer.schemNm,
			geomType : _Data.layer.lyrTyp,

			minResolution : _Data.layer.minResolution,
			maxResolution : _Data.layer.maxResolution,

			source : _this.createSource(_Data),

			style : function(_feature, _resolution){
				if(_Data.layer.thmUseYn){
					return _this.createThemeStyle(_Data, _feature, _resolution);
				}else{
					return _this.createStyle(_Data, _feature, _resolution);
				}
			}
		};

		/* AnimateCluster - Circle 모양의 Animate 를 사용 할 수 있으나, 추가 코딩이 필요하므로 사용 금지합니다. */
		/*if(_Data.layer.lyrTyp === "P"){
			return new ol.layer.AnimatedCluster(_constructData);
		}else{
			return new ol.layer.Vector(_constructData);
		}*/

		if(_Data.layer.lyrTyp === "P" && _Data.layer.heatYn){
			_constructData["opacity"] = 0.9;
			return new ol.layer.Heatmap(_constructData);
		}else{
			return new ol.layer.Vector(_constructData);
		}
	},

	/**
	 * <pre>
	 * OL Source 객체를 생성합니다.
	 * 대상 공간정보의 타입(폴리곤&라인 or 포인트)에 따라 생성객체가 상이합니다.
	 *
	 * 참고) 현재는 strategy : ol.loadingstrategy.? 옵션을 사용하지 않습니다.
	 * 해당 옵션을 사용할 경우 이미 로드된 Vector는 Resolution에 따라 cache 처리되어 리로드하지 않는 특성을 가지고 있습니다.
	 * 만약 지도 이동, 해상도 변경시 무조건 WFS를 로드해야 한다면 해당 옵션을 제거 한 후,
	 * GMXMAP.redrawAllVisibleVector 함수를 호출해야 합니다.
	 * (또는 Custom strategy 를 구현해야 합니다.)
	 * </pre>
	 *
	 * @param _Data - 레이어 기본 정보(layer, style, theme, group)
	 * @returns {ol.source.Vector or ol.source.Cluster}
	 */
	createSource : function(_Data, _Filter){
		var _this = this;
		var _source = new ol.source.Vector({
			//strategy : ol.loadingstrategy.bbox,
			loader : function(extent, resolution, projection) {
				var _thisSource = this;
				var _wfsParam = {
					service : "WFS",
					version : "1.1.0",
					request : "GetFeature",
					typename : "gmx:" + _Data.layer.tblId,
					outputFormat : "json",
					srsname : "EPSG:5186",
					bbox : GMXMAP.getView().calculateExtent().join(",") + ",EPSG:5186"
					//bbox : extent.join(",") + ",EPSG:5186"
				};

				if(_Filter){
					delete _wfsParam["bbox"];
					_wfsParam["filter"] = _Filter;
				}

				if(_Data.layer.tblId in _this.LayerList){
					_Data.layer["_wfsParam"] = JSON.parse(JSON.stringify(_wfsParam));
				}

				_this.loadFeatures(_thisSource, _wfsParam);
			}
		});

		if(_Data.layer.lyrTyp === "P"){
			return new ol.source.Cluster({
				distance: 10,
				source: _source
			});
		}else{
			return _source;
		}
	},

	/**
	 * <pre>
	 * 상태 이상 style 객체를 생성하여 리턴합니다.
	 * </pre>
	 *
	 * @param geomType
	 * @param featureGeomCoord
	 * @returns {ol.style.Style}
	 */
	errorBase64Image : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQUlEQVQ4T4WTP0sDQRBH34CgjYiNghAUFEGws7OztPMb5NLs+ZXmmpyllVbaaaWVVgqCf0ANBEwjaKGFMHJyG8YluWy1DPPezm/ZFdwyyICur43YlwKdWJe4+YJMoDul2sj/5DkC5XQt+RN8QGbQnVHlO88bBa6nnIOODGp4VpXPCXA0u95SXsHmVXl3cMuMngzT/XFpLTLyALagyqAWrJkNIzzWklG1yMgN2JIqfTfBppP4C7l1U0VGrsCWVXlJ8m8lkuskUmTkAmwxBN6K4t/tbyeCy0QQGTmrIoRA3wl2xkQ49xFqRk7AWiHQqwW7Dj6tgVG1yMgR2EoIPLsJ9sw4TkZOa5GRQ2gblKsh8JTcw7gn6XqrfwEH0AbK9RC4nyCJPdWhWfWU4ylaSzZCaPwLd0VBBe/7z5RKmgwervp+AdZqnRyvXbopAAAAAElFTkSuQmCC",
	createErrorStyle : function(){
		var _this = this;

		return new ol.style.Style({
			image: new ol.style.Icon({
				src : _this.errorBase64Image
			}),
			geometry : function(feature){
				var featureGeom = feature.getGeometry();
				var featureGeomType = featureGeom.getType();
				var featureGeomCoord = featureGeom.getCoordinates();

				var errorFeature = null;
				if(featureGeomType.contains("Point")) errorFeature = new ol.geom.Point(featureGeomCoord);
				if("turf" in window){
					if(featureGeomType.contains("Line")){
						if(featureGeomType.contains("Multi")){
							var centroid = turf.centroid(turf.multiLineString(featureGeomCoord)).geometry.coordinates;
							var closestPoint = featureGeom.getClosestPoint(centroid);
							errorFeature = new ol.geom.Point(closestPoint);
						}else{
							var centroid = turf.centroid(turf.lineString(featureGeomCoord)).geometry.coordinates;
							var closestPoint = featureGeom.getClosestPoint(centroid);
							errorFeature = new ol.geom.Point(closestPoint);
						}
					}
					if(featureGeomType.contains("Polygon")){
						if(featureGeomType.contains("Multi")){
							errorFeature = new ol.geom.Point(turf.centroid(turf.multiPolygon(featureGeomCoord)).geometry.coordinates);
						}else{
							errorFeature = new ol.geom.Point(turf.centroid(turf.polygon(featureGeomCoord)).geometry.coordinates);
						}
					}
				}

				return errorFeature;
			}
		});
	},



	/**
	 * <pre>
	 * play 되고있는 CCTV style 객체를 생성하여 리턴합니다.
	 * </pre>
	 *
	 * @param geomType
	 * @param featureGeomCoord
	 * @returns {ol.style.Style}
	 */
	playingCctvBase64Image : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAsZJREFUWIXtlj9IG2EYxp/vKA5SWrrW6HD3vTkICAED0biLgraYcCZ06CTOOqgFV5duTo5dupQOLbZDq3OSGktNScA/2Dh4GpBaSif/3Jd7O5gEQ8yp0U7NM919L+/7/O6O77kPaKml/12imSYi0pm5VwjRAQDMXGTmTKFQ+PFPAaSUMQAvhBChy+qu637XNO3lzs7OmzsFkFI+EEK8BvBECIGenh5EIhH4fD4AwP7+PpLJJLLZLJgZAD6fnp4+29vb+31dEE9zKeVXImLLsnhjY4MbKZ/PczQaZSJiKWWuq6vr0V0AvCMinpmZ+aWUUg3dy1JKOVNTU0dExET06VbmhmE8JSIeGxvji+bFYpFLpZInxOjoKJchEk0DEFHaNE3e2tqqMZifn+doNMrr6+sNIXK5HPv9fjYMI+vloTUqSCl9APpCoRBM06yr5/N5xONxTE9P4/DwsK7e3d2NYDAITdOCuq7TjQEAhAGgv7/f6wGwtLSEgYEBLC4u4uTkpKZW6RVC9N4YQAjxGAA6Ozs9AQDg+PgYCwsLGBoawsrKSnW90lsJrBsBNCPHcXB2dla9F6IaM9yo557HvAPgPGSuUltbG8bHxzExMYH29vbqum3bNbMuk9cbyABAOp32NB8cHMTy8jImJydrzAEglUpVLr94DmkkKWXSNE3e3t6u24YjIyOcyWQ8U9Hv9zMRfWvKvAwwTEQcj8dZKVVNHtu22SsUlVIqFotVItlqGgAAiOgtEfHc3NzRRQgv89nZ2Z/lFPx4K3MACAQC9w3DWCUiTiQSdZ/jojY3N9myLCYiNgwjq+v6w6vmX+t3HAgE7juO8wqApWkawuEwIpFIdZ/bto1UKoW1tTW4rgsAH0ql0vPd3d0/dwJQkZRyGOcHkkvj0XXdTPlA8v66M5s9knUwcx+AjvKMA2ZeLRQK9hWtLbXUUp3+Ak4KJzQ05xeVAAAAAElFTkSuQmCC",
	createPlayingCctvStyle : function(){
		var _this = this;

		return new ol.style.Style({
			image: new ol.style.Icon({
				src : _this.playingCctvBase64Image
			}),
			geometry : function(feature){
				var featureGeom = feature.getGeometry();
				var featureGeomType = featureGeom.getType();
				var featureGeomCoord = featureGeom.getCoordinates();

				return new ol.geom.Point(featureGeomCoord);
			}
		});
	},

	/**
	 * <pre>
	 * 데이터를 로드합니다.
	 * 브라우저가 엔진에 다이렉트로 요청하지 않고 서버를 거치는 과정으로 요청합니다.
	 * </pre>
	 *
	 * @param _source - ol.source.Vector
	 * @param _wfsParam - Object
	 * @param _async - boolean (선택 - 기본 비동기이며 true 일 경우 동기화)
	 */
	loadFeatures : function(_source, _wfsParam, _async){
		var _this = this;
		var _format = new ol.format.GeoJSON();

		if(_async === true) _async = false;

		$.ajax({
			//type : "POST",
			url : GMXLAYER.WFS_URL,
			data : _wfsParam,
			dataType : "json",
			async : _async,
			beforeSend : function() {
				_source.clear();
			},
			success : function(data) {
				var features = _format.readFeatures(data);
				_source.addFeatures(features);
				data = null;
			},
			error : function(xhr, status, error){

			},
			complete : function(){

			}
		});
	},

	/**
	 * <pre>
	 * Cluster 갯수 스타일 입니다.
	 * 캐싱을 위해 미리 생성된 Style 객체가 존재할 경우 해당 객체를 리턴합니다.
	 * </pre>
	 */
	clusterStyleList : {},
	createClusterStyle : function(_clusterLength){
		var _clusterStyle = this.clusterStyleList[_clusterLength];
		if(_clusterStyle == null){
			_clusterStyle = new ol.style.Style({
				text: new ol.style.Text({
					text: String(_clusterLength),
					scale: 1,
					offsetX : 10,
					offsetY : -10,
					overflow: true,
					fill : new ol.style.Fill({ color : "white" }),
					stroke: new ol.style.Stroke({ color : "black", width : 5 })
				}),
			});

			this.clusterStyleList[_clusterLength] = _clusterStyle;
		}

		return _clusterStyle;
	},

	/**
	 * <pre>
	 * OL Style 객체를 생성합니다.
	 * 대상 공간정보의 타입(폴리곤&라인 or 포인트)에 따라 생성되는 객체가 상이합니다.
	 * </pre>
	 *
	 * @param _Data
	 * @param _Feature
	 * @param _Resolution
	 * @returns {ol.style.Style}
	 */

	styleSingleCachePool : {},
	createStyle : function(_Data, _Feature, _Resolution){
		TEST = _Feature;
		var _typ = _Data.layer.lyrTyp;
		var _txt = _Feature.get(_Data.style.textText);
		var _stateCd = _Feature.get("state_cd");
		var _clusterLength = 1;
		var _isError = false;
		if("features" in _Feature.getProperties()){
			if(_Feature.getProperties().features.length > 0){
				_txt = _Feature.getProperties().features[0].get(_Data.style.textText);
				_stateCd = _Feature.getProperties().features[0].get("state_cd");
				_clusterLength = _Feature.getProperties().features.length;
			}
		}

		if(_txt == null) _txt = "";
		if(_stateCd === false || String(_stateCd) === "12" || String(_stateCd) === "false" || String(_stateCd) === "N") _isError = true;


		if(_Data.layer.tblId == "asset_cctv" && location.pathname.contains("event.do")){
			var _isCctvPlaying = this.doFeaturesContainValueList(_Feature, "mgr_no", GMXCCTV.PlayingCctvList);
		}

		var _styleArray = new Array();

		if(!(_Data.layer.tblId in this.styleSingleCachePool)) this.styleSingleCachePool[_Data.layer.tblId] = null;

		var _FinishiedStyle = this.styleSingleCachePool[_Data.layer.tblId];
//		if(_FinishiedStyle == null){
//			var _color = ["#FF0000"];

		var _style = null;
		if (_Data.layer.tblId == "kais_emd_as"){

			var offsetX = 0;
			var offsetY = 0;

			if(_Feature.values_.emd_kor_nm == '반포동'){
				offsetY = 25;
			}

			if(_Feature.values_.emd_kor_nm == '신원동'){
				offsetX = -15;
			}


			_style = {
					stroke: new ol.style.Stroke({
						color : "#ffffff",//m_color,
						width : Number(_Data.style.strokeWidth),
//						lineDash : [Number(_Data.style.strokeLineDash)]
					}),
					fill: new ol.style.Fill({
						color : "rgba(0, 0, 0, 0.6)",
						width : Number(_Data.style.strokeWidth),
//						lineDash : [Number(_Data.style.strokeLineDash)]
					}),
					text: new ol.style.Text({
						font : "bold 13px Nanum",
						text : String(_txt),
						textAlign : _Data.style.textTextAlign,
						textBaseline : _Data.style.textTextBaseline,
						offsetX: offsetX,
						offsetY: offsetY,
						overflow: true,
						fill : new ol.style.Fill({
							color : "#ffffff"
						})
//						stroke: new ol.style.Stroke({
//							color : "#ffffff",
//							width : 2
//						})
					})
				};
		} else {
			_style = {
//				stroke: new ol.style.Stroke({
//					color : "rgba(0, 0, 0, 0)",
//					width : 3,
//					lineDash : [Number(_Data.style.strokeLineDash)]
//				}),
//				stroke: new ol.style.Stroke({
//					color : "#ffffff",//m_color,
//					width : 1,
//				}),
				fill: new ol.style.Fill({
					color : _Data.style.fillColor
				}),
				text: new ol.style.Text({
					font : _Data.style.textFont,
					text : String(_txt),
					textAlign : _Data.style.textTextAlign,
					textBaseline : _Data.style.textTextBaseline,
					offsetX: Number(_Data.style.textOffsetX),
					offsetY: Number(_Data.style.textOffsetY),
					overflow: true,
					fill : new ol.style.Fill({
						color : _Data.style.textFillColor
					}),
					stroke: new ol.style.Stroke({
						color : _Data.style.textStrokeColor,
						width : Number(_Data.style.textStrokeWidth)
					})
				})
			};
		}


		if(_Data.layer.lyrTyp === "P"){
			_style["radius"] = _Data.style.circleRadius;

			var imgBase64 = _Data.style.imgBase64;
			if(!_common.utils.isNullAndEmpty(imgBase64)){
				_FinishiedStyle = new ol.style.Style({
					image: new ol.style.Icon({
						anchor : [0.5, 0.5],
						size : [40, 40],
						scale : 0.8,
						src : imgBase64
					}),
					text: _style.text
				});
			}else{
				_FinishiedStyle = new ol.style.Style({
					image: new ol.style.Circle(_style),
					text: _style.text
				});
			}
		}else{
			_FinishiedStyle = new ol.style.Style(_style);
		}
//		}

		if(Number(_Data.style.strokeWidth) === 0) delete _FinishiedStyle["stroke"];
		if(_FinishiedStyle.getText() != null) _FinishiedStyle.getText().setText(String(_txt));
		if(!_common.utils.isNullAndEmpty(_Data.style.textMinResolution) && !_common.utils.isNullAndEmpty(_Data.style.textMinResolution)){
			var _textMinResolution = Number(_Data.style.textMinResolution);
			var _textMaxResolution = Number(_Data.style.textMaxResolution);
			if((_Resolution < _textMinResolution) || (_Resolution > _textMaxResolution)) _FinishiedStyle.getText().setText("");
		}

		this.styleSingleCachePool[_Data.layer.tblId] = _FinishiedStyle;

		_styleArray.push(_FinishiedStyle);

		if(_isError) _styleArray.push(this.createErrorStyle());
		if(_isCctvPlaying) _styleArray.push(this.createPlayingCctvStyle());

		if(("localStorage" in window) && ("GMXMAP@clusterCountStyle" in localStorage) && (_clusterLength > 1)) _styleArray.push(this.createClusterStyle(_clusterLength));

		return _styleArray;
	},

	/**
	 * <pre>
	 * 주제도로 사용할 OL Style 객체를 생성합니다.
	 * 대상 공간정보의 타입(폴리곤&라인 or 포인트)에 따라 생성되는 객체가 상이합니다.
	 *
	 * 만약, DB에 등록된 주제에 해당하지 않는 객체(Feature)가 존재할 경우,
	 * 대표 Style 기준으로 생성됩니다.
	 * </pre>
	 *
	 * @param _Data
	 * @param _Feature
	 * @param _Resolution
	 * @returns {ol.style.Style}
	 */
	styleThemeCachePool : {},
	createThemeStyle : function(_Data, _Feature, _Resolution){
		var _this = this;
		var _thm = _Data.theme;
		var _typ = _Data.layer.lyrTyp;

		//주제 값이 아닌 라벨 설정에서 이용한 값을 사용하도록 임시 변경.
		var _txt = _Feature.get(_Data.style.textText);
		var _stateCd = _Feature.get("state_cd");
		var _clusterLength = 1;
		var _isError = false;
		if("features" in _Feature.getProperties()){
			if(_Feature.getProperties().features.length > 0){
				_txt = _Feature.getProperties().features[0].get(_Data.style.textText);
				_stateCd = _Feature.getProperties().features[0].get("state_cd");
				_clusterLength = _Feature.getProperties().features.length;
			}
		}
		if(_txt == null) _txt = "";
		if(_stateCd === false || String(_stateCd) === "12" || String(_stateCd) === "false" || String(_stateCd) === "N") _isError = true;

		if(_Data.layer.tblId == "asset_cctv" && location.pathname.contains("event.do")){
			var _isCctvPlaying = this.doFeaturesContainValueList(_Feature, "mgr_no", GMXCCTV.PlayingCctvList);
		}

		var _styleArray = new Array();
		var _featureThemeVal = null;
		var _thmFieldId = null;
		var _thmFieldTyp = null;
		if(_thm != null){
			if(_thm.length > 0){
				_thmFieldId = _thm[0].thmFieldId;
				_thmFieldTyp = _thm[0].thmFieldTyp;
			}
		}

		var _thmIdx = 0;

		var _singlePointFeature = null;
		if(_typ === "P"){
			_singlePointFeature = _Feature;

			var _feature = _Feature.get("features");
			if(!_common.utils.isNullAndEmpty(_feature)) _singlePointFeature = _feature[0];
			_featureThemeVal = _singlePointFeature.get(_thmFieldId);
		}else{
			_singlePointFeature = _Feature;
			_featureThemeVal = _Feature.get(_thmFieldId);
		}

		if(!(_Data.layer.tblId in this.styleThemeCachePool)) this.styleThemeCachePool[_Data.layer.tblId] = {};

		for(var i=0; i<_thm.length; i++){
			var _thmStartVal = _thm[i].thmStartVal;
			var _thmEndVal = _thm[i].thmEndVal;
			var _thisIdxisTheme = false;

			if(_thmFieldTyp === "S"){
				_featureThemeVal = String(_featureThemeVal);
				_thmStartVal = String(_thmStartVal);

				if(_featureThemeVal === _thmStartVal) _thisIdxisTheme = true;
			}else if(_thmFieldTyp === "N"){
				_featureThemeVal = Number(_featureThemeVal);
				_thmStartVal = Number(_thmStartVal);
				_thmEndVal = Number(_thmEndVal);

				if(_featureThemeVal >= _thmStartVal && _featureThemeVal <= _thmEndVal) _thisIdxisTheme = true;
			}

			if(_thisIdxisTheme){
				_thmIdx = i;
				break;
			}
		}

		var _style = null;
		var _FinishiedStyle = this.styleThemeCachePool[_Data.layer.tblId][_thmIdx];
		if(_FinishiedStyle == null){

			_style = {
				stroke: new ol.style.Stroke({
					color : _thm[_thmIdx].strokeColor,
					width : Number(_thm[_thmIdx].strokeWidth),
					lineDash : [Number(_thm[_thmIdx].strokeLineDash)]
				}),
				fill: new ol.style.Fill({
					color : _thm[_thmIdx].fillColor
				}),
				text: new ol.style.Text({
					font : _Data.style.textFont,
					text : String(_txt),
					textAlign : _Data.style.textTextAlign,
					textBaseline : _Data.style.textTextBaseline,
					offsetX: Number(_Data.style.textOffsetX),
					offsetY: Number(_Data.style.textOffsetY),
					overflow: true,
					fill : new ol.style.Fill({
						color : _thm[_thmIdx].textFillColor
					}),
					stroke: new ol.style.Stroke({
						color : _thm[_thmIdx].strokeColor,
						width : Number(_thm[_thmIdx].textStrokeWidth)
					})
				})
			};

			//주제에 해당하지 않을 경우 대표 스타일로 지정
			if(_common.utils.isNull(_style)){
				var _copyData = JSON.parse(JSON.stringify(_Data));
				_copyData.layer.thmUseYn = false;

				return _this.createStyle(_copyData, _Feature, _Resolution);
			}

			//포인트 타입일 경우 Circle 필수 파라미터 추가
			var _styleArray = new Array();
			if(_Data.layer.lyrTyp === "P"){
				if(_thm[_thmIdx]) _style["radius"] = _thm[_thmIdx].circleRadius;

				var imgBase64 = _thm[_thmIdx].imgBase64;
				if(!_common.utils.isNullAndEmpty(imgBase64)){
					_FinishiedStyle = new ol.style.Style({
						image: new ol.style.Icon({
							anchor : [0.5, 0.5],
							size : [40, 40],
							scale : 0.8,
							src : imgBase64
						}),
						text: _style.text
					});
				}else{
					_FinishiedStyle = new ol.style.Style({
						image: new ol.style.Circle(_style),
						text: _style.text
					});
				}
			}else{
				_FinishiedStyle = new ol.style.Style(_style);
			}
		}

		if(Number(_thm[_thmIdx].strokeWidth) === 0) delete _FinishiedStyle["stroke"];
		if(_FinishiedStyle.getText() != null) _FinishiedStyle.getText().setText(String(_txt));
		if(!_common.utils.isNullAndEmpty(_Data.style.textMinResolution) && !_common.utils.isNullAndEmpty(_Data.style.textMinResolution)){
			var _textMinResolution = Number(_Data.style.textMinResolution);
			var _textMaxResolution = Number(_Data.style.textMaxResolution);
			if((_Resolution < _textMinResolution) || (_Resolution > _textMaxResolution)) _FinishiedStyle.getText().setText("");
		}

		this.styleThemeCachePool[_Data.layer.tblId][_thmIdx] = _FinishiedStyle;

		_styleArray.push(_FinishiedStyle);

		if(_isError) _styleArray.push(this.createErrorStyle());
		if(_isCctvPlaying) _styleArray.push(this.createPlayingCctvStyle());

		if(("localStorage" in window) && (localStorage["GMXMAP@clusterCountStyle"] === "true") && (_clusterLength > 1)) _styleArray.push(this.createClusterStyle(_clusterLength));

		return _styleArray;
	},

	/**
	 * 컬럼, 값을 받아 필터 스트링을 생성합니다.
	 *
	 * 현재 사용되지 않습니다.
	 *
	 * @returns {String}
	 * @deprecated
	 */
	makeFilter : function(col, val){
		var filter;
		filter  = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
		filter += 		"<ogc:PropertyIsEqualTo>";
		filter += 			"<ogc:PropertyName>" + col + "</ogc:PropertyName>";
		filter += 			"<ogc:Literal><![CDATA[" + val + "]]></ogc:Literal>";
		filter += 		"</ogc:PropertyIsEqualTo>";
		filter += "</ogc:Filter>";

		return filter;
	},

	/**
	 * <pre>
	 * 컬럼, 값을 이용하여 Like 검색 필터 스트링을 생성합니다.
	 * 조건으로 사용될 값이 문자일 경우만 가능합니다.
	 *
	 * 예) where a like 'A%'
	 * </pre>
	 *
	 * @param col - Column
	 * @param val - Value (EX: val* > val%)
	 * @returns {String}
	 */
	makeLikeFilterItem : function(col, val){
		var filter;
		filter  = '<ogc:PropertyIsLike wildCard="*" singleChar="#" escapeChar="!">';
		filter += 	"<ogc:PropertyName>" + col + "</ogc:PropertyName>";
		filter += 	"<ogc:Literal><![CDATA[" + val + "]]></ogc:Literal>";
		filter += "</ogc:PropertyIsLike>";

		return filter;
	},

	/**
	 * <pre>
	 * 컬럼, 값을 List로 받아 다수의 필터 스트링을 생성합니다.
	 * 조건으로 사용될 값이 문자일 경우만 가능합니다.
	 *
	 * 예) where a = 'A' or b = 'B'
	 * </pre>
	 *
	 * @param paramSet -
	 * @param isNumberOption
	 * @returns {String}
	 */
	makeFilters : function(paramSet, isNumberOption){
		if(isNumberOption) this.makeNumberRangeFilters(paramSet);

		var filter;
		filter  = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
		if(paramSet.length > 1) filter += "<ogc:Or>";

		for(var i=0; i<paramSet.length; i++){
			for(var column in paramSet[i]){
				if("isLike" in paramSet[i]){
					if(paramSet[i]["isLike"] === true){
						filter += this.makeLikeFilterItem(column, paramSet[i][column]);
						break;
					}
				}else{
					filter += 	"<ogc:PropertyIsEqualTo>";
					filter += 		"<ogc:PropertyName>" + column + "</ogc:PropertyName>";
					filter += 		"<ogc:Literal><![CDATA[" + paramSet[i][column] + "]]></ogc:Literal>";
					filter += 	"</ogc:PropertyIsEqualTo>";
				}
			}
		}

		if(paramSet.length > 1 ) filter += "</ogc:Or>";
		filter += "</ogc:Filter>";

		return filter;
	},

	/**
	 * <pre>
	 * 컬럼, 값을 List로 받아 다수의 필터 스트링을 생성합니다.
	 * 조건으로 사용될 값이 문자일 경우만 가능합니다.
	 * 다중 조건을 And 로 결합 합니다.
	 *
	 * 예) where a = 'A' and b = 'B'
	 * </pre>
	 *
	 * @param paramSet -
	 * @param isNumberOption
	 * @returns {String}
	 */
	makeAndFilters : function(paramSet, isNumberOption){
		if(isNumberOption) this.makeNumberRangeFilters(paramSet);

		var filter;
		filter  = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
		if(paramSet.length > 1) filter += "<ogc:And>";

		for(var i=0; i<paramSet.length; i++){
			for(var column in paramSet[i]){
				if("isLike" in paramSet[i]){
					if(paramSet[i]["isLike"] === true){
						filter += this.makeLikeFilterItem(column, paramSet[i][column]);
						break;
					}
				}else{
					filter += 	"<ogc:PropertyIsEqualTo>";
					filter += 		"<ogc:PropertyName>" + column + "</ogc:PropertyName>";
					filter += 		"<ogc:Literal><![CDATA[" + paramSet[i][column] + "]]></ogc:Literal>";
					filter += 	"</ogc:PropertyIsEqualTo>";
				}
			}
		}

		if(paramSet.length > 1 ) filter += "</ogc:And>";
		filter += "</ogc:Filter>";

		return filter;
	},

	/**
	 * <pre>
	 * 컬럼, 값을 List로 받아 다수의 필터 스트링을 생성합니다.
	 * 조건으로 사용될 값이 숫자이면서 범위일 경우만 가능합니다.
	 *
	 * 예) where (device_id >= '100001' and device_id <= '100010')
	 * 		or   (device_id >= '100011' and device_id <= '100020')
	 * 		or   (device_id >= '100021' and device_id <= '130000')
	 * </pre>
	 *
	 * @param paramSet
	 * @returns {String}
	 */
	makeNumberRangeFilters : function(paramSet){
		var filter;
		filter  = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
		if(paramSet.length > 1) filter += "<ogc:Or>";

		for(var i=0; i<paramSet.length; i++){
			filter += "<ogc:And>";
			filter += 	"<ogc:PropertyIsGreaterThanOrEqualTo>";
			filter += 		"<ogc:PropertyName>" + paramSet[i].c + "</ogc:PropertyName>";
			filter += 		"<ogc:Literal><![CDATA[" + paramSet[i].sv + "]]></ogc:Literal>";
			filter += 	"</ogc:PropertyIsGreaterThanOrEqualTo>";

			filter += 	"<ogc:PropertyIsLessThanOrEqualTo>";
			filter += 		"<ogc:PropertyName>" + paramSet[i].c + "</ogc:PropertyName>";
			filter += 		"<ogc:Literal><![CDATA[" + paramSet[i].ev + "]]></ogc:Literal>";
			filter += 	"</ogc:PropertyIsLessThanOrEqualTo>";
			filter += "</ogc:And>";
		}

		if(paramSet.length > 1 ) filter += "</ogc:Or>";
		filter += "</ogc:Filter>";

		return filter;
	},

	/**
	 * <pre>
	 * BBOX 검색 필터 스트링을 생성합니다.
	 * </pre>
	 *
	 * @param param : gc(지오메트리 칼럼), minx, miny, maxx, maxy, d(거리, 미터)
	 * @returns {String}
	 */
	makeBboxFilters : function(param){
		var filter = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
		filter += '<ogc:BBOX>';
		filter += 	'<ogc:PropertyName>' + paramSet[i].gc + '</ogc:PropertyName>';
		filter += 	'<gml:Envelope srsName="EPSG:5186">';
		filter += 		'<gml:lowerCorner>' + param.minx + ',' + param.miny + '</gml:lowerCorner>';
		filter += 		'<gml:upperCorner>' + param.maxx + ',' + param.maxy + '</gml:upperCorner>';
		filter += 	'</gml:Envelope>';
		filter += '</ogc:BBOX>';
		filter += "</ogc:Filter>";

		return filter;
	},

	/**
	 * <pre>
	 * 거리 검색 필터 스트링을 생성합니다.
	 * </pre>
	 *
	 * @param param : gc(지오메트리 칼럼), x(경도), y(위도)
	 * @returns {String}
	 */
	makeDistanceFilters : function(param){
		var filter = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
		filter += 	'<ogc:PropertyName>' + param.gc + '</ogc:PropertyName>';
		filter += 	'<gml:Point srsName="EPSG:5186">';
		filter += 		'<gml:coordinates>' + param.x + ',' + param.y + '</gml:coordinates>';
		filter += 	'</gml:Point>';
		filter += "</ogc:Filter>";

		return filter;
	},

	/**
	 * <pre>
	 * 반경 검색 필터 스트링을 생성합니다.
	 * </pre>
	 *
	 * @param param : gc(지오메트리 칼럼), x(경도), y(위도), d(거리, 미터)
	 * @returns {String}
	 */
	makeDWithinFilters : function(param){
		var filter = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
		filter += '<ogc:DWithin>';
		filter += 	'<ogc:PropertyName>' + param.gc + '</ogc:PropertyName>';
		filter += 	'<gml:Point srsName="EPSG:5186">';
		filter += 		'<gml:coordinates>' + param.x + ',' + param.y + '</gml:coordinates>';
		filter += 	'</gml:Point>';
		filter += 	'<ogc:Distance units="meter">' + param.d + '</ogc:Distance>';
		filter += '</ogc:DWithin>';
		filter += "</ogc:Filter>";

		return filter;
	},




	doFeaturesContainValueList : function(_features, key, valueList){
		var result = false;

		if(valueList.includes(_features.get(key))) result = true

		if("features" in _features.getProperties()){
			if(_features.getProperties().features.length > 0){
				for(var i=0; i < _features.getProperties().features.length; i++){
					if(valueList.includes(_features.getProperties().features[i].get(key))){
						result = true;
						break;
					}
				}
			}
		}

		return result;
	}

}

function getRandomColor(_isAlpha) {
	var r = getRand(0, 255), g = getRand(0, 255), b = getRand(0, 255), a = getRand(
			0, 10) / 10;

	var	rgb = _isAlpha ? 'rgba' : 'rgb';
	rgb += '(' + r + ',' + g + ',' + b;
	rgb += _isAlpha ? ',' + 1 + ')' : ')';

	return rgb;

};

function getRand(min, max) {
    if (min >= max) return false;
    return ~~(Math.random() * (max - min + 1)) + min;
};