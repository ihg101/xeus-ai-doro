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

		_common.callAjax("/GMT_layer/getLayerInfo.json", { "tabName" : window.tabName }, function(json){
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

			//데이터베이스에 저장된 visibleYn을 할당
			_this.LayerList[key].layer.visibleYnInDatabase = _this.LayerList[key].layer.visibleYn;
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

		/**
		 * 교통안전지도
		 */
		if(tmsType === "A2SM_BIKE") { //자전거길
			var style = "";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_TFCACDHSPOT_NEW") { //교통사고 다발지역 4종
			var style = "";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_RBLNG_4") { //도로시설(스쿨존)
			var style = "A2SM_RBLNG_4";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_RBLNG_1") { //도로시설(인도)
			var style = "A2SM_RBLNG_1";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_RBLNG_3") { //도로시설(횡단보도)
			var style = "A2SM_RBLNG_3";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_BIKE_SPOT") { //자전거길 (사고다발지역/지점)
			var style = "";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		/**
		 * 사고안전지도
		 */
		if(tmsType === "A2SM_BILDDN_NEW") { //노후건물정보
			var style = "A2SM_BILDDN_NEW";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_AED") { //AED(자동심장충격기)
			var style = "A2SM_AED";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_CHARGINGSTATION") { //전기차충전소
			var style = "A2SM_CHARGINGSTATION";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "MOUNTAIN_LINE_GRP") { //산행안전지도
			var style = "";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		/**
		 * 재난안전지도
		 */
		if(tmsType === "A2SM_CLPS") { //붕괴발생이력
			var style = "A2SM_Clps";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_FRFIRESTTUS") { //산불발생이력
			var style = "A2SM_FrfireSttus";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_LNDSLD") { //산사태발생이력
			var style = "A2SM_Lndsld";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_SANSATAI") { //산사태위험도
			var style = "";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_HEATWAVE_ALL") { //열분포도(전체)
			var style = "";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		/**
		 * 치안안전지도
		 */
		if(tmsType === "A2SM_ODBLRCRMNLHSPOT_ODSN") { //노인대상범죄주의구간
			var style = "A2SM_OdblrCrmnlHspot_Odsn";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_CPTED_G") { //범죄예방환경설계(CPTED)
			var style = "";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType.contains("A2SM_CRMNLHSPOT_TOT")) { //범죄주의구간

			var splitList = tmsType.split("//");

			var layer = splitList[0];
			var style = splitList[1];

			return new safeMap().createWmsLayerWithStyle(layerInfo, layer, style);
		}

		if(tmsType === "A2SM_ODBLRCRMNLHSPOT_KID") { //어린이대상범죄주의구간
			var style = "A2SM_OdblrCrmnlHspot_Kid";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_CRMNLHSPOT_F1_BRGLR") { //여성밤길치안안전 - 강도
			var style = "A2SM_OdblrCrmnlHspot_Brglr_20_24";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_CRMNLHSPOT_F1_RAPE") { //여성밤길치안안전 - 성폭력
			var style = "A2SM_OdblrCrmnlHspot_Rape_20_24";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_CRMNLHSPOT_F1_TOT") { //여성밤길치안안전 - 전체
			var style = "A2SM_OdblrCrmnlHspot_Tot_20_24";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_CRMNLHSPOT_F1_THEFT") { //여성밤길치안안전 - 절도
			var style = "A2SM_OdblrCrmnlHspot_Theft_20_24";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType === "A2SM_CRMNLHSPOT_F1_VIOLN") { //여성밤길치안안전 - 폭력
			var style = "A2SM_OdblrCrmnlHspot_Violn_20_24";
			return new safeMap().createWmsLayer(layerInfo, style);
		}

		if(tmsType.contains("A2SM_CRMNLSTATS")) { //치안사고통계

			var splitList = tmsType.split("//");

			var layer = splitList[0];
			var style = splitList[1];

			return new safeMap().createWmsLayerWithStyle(layerInfo, layer, style);
		}

//		if(tmsType === "A2SM_CRMNLHSPOT_TOT") { //범죄주의구간(성폭력)
//
//			var style = "A2SM_CrmnlHspot_Tot_Rape";
//			return new safeMap().createWmsLayer(layerInfo, style);
//		}




		if(tmsType === "ngii_emap") return new eMap().createLayer(layerInfo);

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
		
		var clusterDistance = 200;
		
		var _source;
		
		var isHeatMap = $('#isHeatMap').hasClass('active');
		
		var filterId = ["v_event_pothole", "v_event_crack"];
		
	    if (filterId.includes(_Data.layer.tblId)) {

	    	if (isHeatMap ) {
	    		_source = _this.createSource(_Data);
	    		_Data.layer.heatYn = true;
	    	} else {
	    		
	    		_source = new ol.source.Cluster({
	    			distance: clusterDistance, // 초기값, 나중에 업데이트 가능
	    			source: _this.createSource(_Data)
	    		});
	    		
	    		// 해상도 바뀔 때 클러스터 거리 갱신
	    		GMXMAP.getView().on('change:resolution', function () {
	    			var resolution = GMXMAP.getView().getResolution();
	    			var newDistance =
	    				resolution < 1 ? 10 :
	    					resolution < 3 ? 80 : 200;
	    			
	    			_source.setDistance(newDistance);
	    		});
	    	}
	    } else {
	        _source = _this.createSource(_Data);
	    }
	    
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
				}else if(!_Data.layer.heatYn && filterId.includes(_Data.layer.tblId)){
					return _this.createEventStyle(_Data, _feature, _resolution);
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
//			source	ol.source.Vector 타입의 벡터 소스
//			blur	블러의 정도 (기본값: 15)
//			radius	점의 반경 (기본값: 8)
//			weight	각 feature의 가중치 지정 (숫자, 속성명 문자열, 함수 가능)
//			gradient	색상 그라디언트 배열 (기본값 있음)
//			shadow	히트맵에 그림자를 얼마나 줄지 (기본값: 250)
//			opacity	레이어의 투명도 (0~1 사이)
//			visible	레이어 표시 여부
//			zIndex	레이어 순서 설정
			_constructData["blur"] = 30;
			_constructData["radius"] = 4;
			
			_constructData["weight"] = 'weight'; // 혹은 함수
			_constructData["gradient"] = ['#00f', '#0ff', '#0f0', '#ff0', '#f00'];
			_constructData["shadow"] = 250;
			_constructData["opacity"] = 0.9;
			_constructData["visible"] = true;
			_constructData["zIndex"] = 1;
		  
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
				
				//처음 로드시, 이벤트 모니터링 메뉴는 type 가 LIST 인것만 요청
				if((_Data.layer.tblId ==="v_mon_evet_excavator"  || _Data.layer.tblId ==="v_mon_evet_fall"  || _Data.layer.tblId ==="v_mon_evet_blackice") &&  !_Filter){
					var paramSet = [{type : 'LIST'}];
					_wfsParam["filter"] = GMXLAYER.makeFilters(paramSet);
					delete _wfsParam["bbox"];
					
					//이벤트 리스트 메뉴는 전부 다 요청
				/*	if($("#btn-event-list-view").hasClass("active")){
						delete _wfsParam["filter"];
					} */
				}
				
				_this.loadFeatures(_thisSource, _wfsParam);
			}
		});
		var filterId = ["v_event_pothole", "v_event_crack"];
		
		var isHeatMap = $('#isHeatMap').hasClass('active');
		if ( isHeatMap && filterId.includes(_Data.layer.tblId)  ) return _source;
		
		if(_Data.layer.lyrTyp === "P" && _Data.layer.tblId !== "v_mon_evet_excavator"  && _Data.layer.tblId !== "v_mon_evet_fall"  &&_Data.layer.tblId !== "v_mon_evet_blackice" ){
			var clusterDistance = 200;
			
			if(filterId.includes(_Data.layer.tblId)){
				
				var resolution = GMXMAP.getView().getResolution();
			
				clusterDistance =
				    resolution < 1 ? 50 :
				    resolution < 3 ? 100 :
				    200;
				
				//clusterDistance = 5 / GMXMAP.getView().getResolution();
			}
			
			return new ol.source.Cluster({
				distance: clusterDistance,
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
				var format = new ol.format.GeoJSON();
	            var features = format.readFeatures(data);

	            var validLayerIds = ["v_event_pothole", "v_event_crack"];
	            var layerId = _wfsParam.typename.replace("gmx:", "");

	            var finalFeatures = features;
	            if (validLayerIds.includes(layerId)) {
	                // 중복 제거 처리 (event_id 기준)
	            	var seen = new Set();
	            	var uniqueFeatures = [];

	                for (let i = 0; i < features.length; i++) {
	                	var f = features[i];
	                	var props = f.getProperties();

	                	var key = props.event_id; // event_id만 기준
	                    if (!seen.has(key)) {
	                        seen.add(key);
	                        uniqueFeatures.push(f);
	                    }
	                }

	                finalFeatures = uniqueFeatures;
	            }
	            
	            
	            // v_mon_evet_list 거리 기반 필터 계산을 위해 전체 피처 캐시
	            _this.__vMonAllFeatures = features.slice();
	            _this.__vMonAllowed = null;
	            
	            features = features.filter(item => {
	            	//EOCS point 날짜 범위 안에 있어야 나옴
	                if (item.id_.includes("eocs_excavator")) {
	                    return _this.checkEocsDate(item); 
	                }
	                //굴삭기 dist 값에 따라서 표출 되는게 달라짐.
	                if (item.id_.includes("v_mon_evet_excavator")) {
	                    return _this.checkEventDist(item); 
	                }
					if (item.id_.includes("v_mon_evet_fall")) {
	                    return _this.checkEventDist(item); 
	                }
	                return true; 
	            });
				_source.addFeatures(features);
				data = null;
			},
			error : function(xhr, status, error){

			},
			complete : function(){

			}
		});
	},
	
	checkEocsDate : function (date){
		var _this = this;
		
		var nowDate = Date.prototype.getYMD().replaceAll("-","");
		var startDate = date.values_.exstart_date.replaceAll("-",""); 
		var endDate = date.values_.exend_date.replaceAll("-",""); 
		
		if (startDate <= nowDate && nowDate <= endDate) {
			return true;
		} else{
			return false;
		}
	},
	
	
	//2025.09.04 원우빈 
	/**
	 * 이벤트 evt_json 에 있는 속성값 dist를 가지고 feature들 끼리 비교 후, 표출 유무를 설정함.  
	 * 
	 * */
	checkEventDist : function (data){
		var _this = this;
		try{
			if (!_this.__vMonAllowed) {
				var all = Array.isArray(_this.__vMonAllFeatures) ? _this.__vMonAllFeatures : [];
				// 상태 우선순위(확인 > 발생 > 오탐) 후 발생시각(ASC)으로 대표 이벤트 선택
				var keyToFirst = {}; 
				// 동일 위치 판별을 위한 좌표 그룹핑(5186 기준 1m 그리드) + evt_typ_cd 포함
				var getGroupKey = function(px, py, evtTypCd){
					var typCd = evtTypCd || "";
					if(!_common.utils.isNumber(px) || !_common.utils.isNumber(py)) return typCd + "|" + px + "|" + py;
					try{
						var p = Spatial.convertProjection([px, py], "EPSG:4326", "EPSG:5186");
						var gx = Math.round(p[0] / 1); // 1m 단위 그룹핑
						var gy = Math.round(p[1] / 1);
						return typCd + "|" + gx + "|" + gy;
					}catch(e){
						return typCd + "|" + px + "|" + py;
					}
				};
				var getStatusPriority = function(props){
					var pri = 0; // 기본 낮음
					try{
						var etc = props.evt_json;
						if (typeof etc === "string") etc = JSON.parse(etc);
						var state = null;
						if (etc && ("state" in etc)) state = etc.state; // 0:발생, 1:확인, 2:오탐
						if (state == null && etc && ("procSt" in etc)) state = etc.procSt;
						if (state == null) state = props.evt_proc_cd || props.state_cd || props.proc_st || props.procSt;
						if (state != null) {
							var s = String(state).trim();
							if (s == "1") pri = 3; // 확인
							else if (s == "0") pri = 2; // 발생
							else if (s == "2") pri = 1; // 오탐
						}
					}catch(e){}
					return pri;
				};
				for (var i=0;i<all.length;i++){
					var f = all[i];
					if (!f || !f.getProperties) continue;
					var p = f.getProperties();
					var x = Number(p.outb_posx), y = Number(p.outb_posy);
					var evtTypCd = String(p.evt_typ_cd || "").trim();
					var key = getGroupKey(x, y, evtTypCd);
					var t = String(p.evt_outb_dtm || "");
					var curPri = getStatusPriority(p);
					if (!(key in keyToFirst)) {
						keyToFirst[key] = f;
					} else {
						var prevF = keyToFirst[key];
						var prev = prevF.getProperties();
						var prevPri = getStatusPriority(prev);
						var prevT = String(prev.evt_outb_dtm || "");
						// 상태 우선순위 우선, 같다면 발생시각 ASC
						if (curPri > prevPri || (curPri === prevPri && t < prevT)) {
							keyToFirst[key] = f;
						}
					}
				}

				// excluded_events 계산: 각 keeper 주변 dist 이내의 같은 타입 이벤트를 제외 대상에 추가
				var keeperList = Object.keys(keyToFirst).map(function(k){ return keyToFirst[k]; });
				var excludedIds = new Set();
				for (var k = 0; k < keeperList.length; k++){
					var kf = keeperList[k];
					var kp = kf.getProperties();
					var kx = Number(kp.outb_posx), ky = Number(kp.outb_posy);
					var kId = kp.usvc_outb_id;
					var kTypCd = String(kp.evt_typ_cd || "").trim(); // keeper의 타입코드
					var distVal = 0;
					try{
						var etc = kp.evt_json;
						if (typeof etc === "string") etc = JSON.parse(etc);
						if (etc && etc.dist) distVal = Number(etc.dist) || 0;
					}catch(e){}
					if (!distVal || distVal <= 0) continue;

					for (var s = 0; s < all.length; s++){
						var sf = all[s];
						if (sf === kf) continue;
						var sp = sf.getProperties();
						var sid = sp.usvc_outb_id;
						if (sid === kId) continue;
						// 같은 타입끼리만 비교 (002는 002끼리, 004는 004끼리)
						var sTypCd = String(sp.evt_typ_cd || "").trim();
						if (sTypCd !== kTypCd) continue;
						// 좌표가 다르고, 거리 <= dist 면 제외
						var sx = Number(sp.outb_posx), sy = Number(sp.outb_posy);
						if (sx === kx && sy === ky) continue;
						var p1 = Spatial.convertProjection([kx, ky], "EPSG:4326", "EPSG:5186");
						var p2 = Spatial.convertProjection([sx, sy], "EPSG:4326", "EPSG:5186");
						var dx = p1[0] - p2[0];
						var dy = p1[1] - p2[1];
						var d = Math.sqrt(dx*dx + dy*dy);
						if (d <= distVal) excludedIds.add(sid);
					}
				}

				var allowed = new Set();
				for (var kk in keyToFirst){
					var keepF = keyToFirst[kk];
					var fidProp = keepF.getProperties().usvc_outb_id;
					var fidFeat = (typeof keepF.getId === "function" && keepF.getId()) ? keepF.getId() : null;
					// 제외 대상이 아니면 대표 피처의 고유 ID를 허용
					if (!excludedIds.has(fidProp)){
						if(fidFeat) allowed.add(fidFeat);
						else allowed.add(fidProp);
					}
				}
				_this.__vMonAllowed = allowed;
			}

			// 현재 feature 가 허용 집합에 포함되는지 여부 반환
			var props = data.getProperties();
			var fId = (typeof data.getId === "function" && data.getId()) ? data.getId() : null;
			return _this.__vMonAllowed ? (_this.__vMonAllowed.has(fId) || _this.__vMonAllowed.has(props.usvc_outb_id)) : true;
		} catch(e){
			return true;
		}
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
		if(_FinishiedStyle == null){
			var _style = {
				stroke: new ol.style.Stroke({
					color : _Data.style.strokeColor,
					width : Number(_Data.style.strokeWidth),
					lineDash : [Number(_Data.style.strokeLineDash)]
				}),
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

			if(_Data.layer.lyrTyp === "P"){
				_style["radius"] = _Data.style.circleRadius;

				var imgBase64 = _Data.style.imgBase64;
				if(!_common.utils.isNullAndEmpty(imgBase64)){
					var iconOpts = { anchor: [0.5, 0.5], scale: 1, src: imgBase64 };
					_FinishiedStyle = new ol.style.Style({
						image: new ol.style.Icon(iconOpts),
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
		
		
		if(Number(_Data.style.strokeWidth) === 0) delete _FinishiedStyle["stroke"];
		if(_FinishiedStyle.getText() != null) _FinishiedStyle.getText().setText(String(_txt));
		if(!_common.utils.isNullAndEmpty(_Data.style.textMinResolution) && !_common.utils.isNullAndEmpty(_Data.style.textMinResolution)){
			var _textMinResolution = Number(_Data.style.textMinResolution);
			var _textMaxResolution = Number(_Data.style.textMaxResolution);
			if((_Resolution < _textMinResolution) || (_Resolution > _textMaxResolution)) _FinishiedStyle.getText().setText("");
		}

		this.styleSingleCachePool[_Data.layer.tblId] = _FinishiedStyle;
		
		_styleArray.push(_FinishiedStyle);

		if(_Data.layer.tblId == "eocs_excavator" ) {
		    var distStyle = new ol.style.Style({
		        geometry: function(feature) {
		            var f = feature.get("features") ? feature.get("features")[0] : feature;
		            var sx = f.get('start_lon'), sy = f.get('start_lat');
		            var ex = f.get('end_lon'), ey = f.get('end_lat');
		            if (sx == null || sy == null || ex == null || ey == null) return null;
		            var p1 = Spatial.convertProjection([sx, sy], "EPSG:4326", "EPSG:5186");
		            var p2 = Spatial.convertProjection([ex, ey], "EPSG:4326", "EPSG:5186");
		            var dx = p1[0] - p2[0];
		            var dy = p1[1] - p2[1];
		            var dist = Math.sqrt(dx*dx + dy*dy);
		            if (dist <= 5 || dist >= 500) { dist = 10; }
		            var center = feature.getGeometry().getCoordinates();
		            return new ol.geom.Circle(center, dist);
		        },
		        stroke: new ol.style.Stroke({ color: 'blue', width: 2 }),
		        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)' })
		    });
		    _styleArray.push(distStyle)
		}

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
		
		// v_mon_evet_list: evt_json.dist 반경 파란 원 추가
		if(_Data.layer.tblId === "v_mon_evet_excavator" || _Data.layer.tblId === "v_mon_evet_fall" || _Data.layer.tblId === "v_mon_evet_blackice"){
			var distCircleStyleTheme = new ol.style.Style({
				geometry: function(feature){
					// 축척에 따른 표시/비표시
					var view = (typeof GMXMAP !== 'undefined' && GMXMAP.getView)? GMXMAP.getView() : null;
					var zoom = view && view.getZoom? view.getZoom() : null;
					var minZoom = ("localStorage" in window && localStorage["AIDORO_RADIUS_MIN_ZOOM"]) ? Number(localStorage["AIDORO_RADIUS_MIN_ZOOM"]) : 16;
					var maxZoom = ("localStorage" in window && localStorage["AIDORO_RADIUS_MAX_ZOOM"]) ? Number(localStorage["AIDORO_RADIUS_MAX_ZOOM"]) : 24;
					if(zoom != null && (zoom < minZoom || zoom > maxZoom)) return null;
					var center = feature.getGeometry().getCoordinates();
					var f0 = feature.get("features") ? feature.get("features")[0] : feature;
					var props = f0.getProperties ? f0.getProperties() : {};
					var etc = props.evt_json;

					// 블랙아이스(006), 수막현상(007)인 경우 상태값 상관없이 50m 고정
					var evtTypCd = props.evt_typ_cd;
					if (evtTypCd === "006" || evtTypCd === "007") {
						return new ol.geom.Circle(center, 50);
					}

					// state 체크: 1(확인)일 때만 반경 표출
					try{
						if (typeof etc === "string") etc = JSON.parse(etc);
						var st = null;
						if (etc && ("state" in etc)) st = Number(etc.state);
						if (st !== 1) return null;
					}catch(e){ return null; }
					var dist = 0;
					try{
						if (typeof etc === "string") etc = JSON.parse(etc);
						if (etc && etc.dist) dist = Number(etc.dist) || 0;
					}catch(e){}
					if (!dist || dist <= 0) return null;
					return new ol.geom.Circle(center, dist);
				},
				stroke: new ol.style.Stroke({ color: 'blue', width: 2 }),
				fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)' })
			});
			_styleArray.push(distCircleStyleTheme);
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
					var iconOpts = { anchor: [0.5, 0.5], scale: 1, src: imgBase64 };
					_FinishiedStyle = new ol.style.Style({
						image: new ol.style.Icon(iconOpts),
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
	
	createEventStyle: function (_Data, _Feature, _Resolution) {
	    var _styleArray = [];
	    var _clusterLength = _Feature.get('features') ? _Feature.get('features').length : 1;

	    if (
	        ("localStorage" in window) 
	    ) {
	        var minRadius = 10;
	        var maxRadius = 40;
	        var clusterCapped = Math.min(_clusterLength, 100);
	        var radius = Math.min(minRadius + clusterCapped, maxRadius);

	        var isSelected = _Feature.get('selected') === true;
	        var layerId = _Data.layer.tblId || '';

	        var fillColor = 'rgba(66, 133, 244, 0.7)'; // 기본 파랑
	        
	        if (layerId === 'v_event_crack') {
	            fillColor = 'rgba(102, 204, 153, 0.7)'; // 크랙 기본 그린
	        }
	        if (isSelected) {
	            fillColor = 'rgba(255, 0, 0, 0.5)'; // 선택 시 빨강 (포트홀/크랙 공통)
	        }
	        
	        var strokeColor = fillColor;
	        
	        var textStrokeColor = '#1a3f78'; // 기본 (포트홀용 파랑)
	        if (layerId === 'v_event_crack') {
	            textStrokeColor = '#006644'; // 크랙은 초록 테두리 (#006644 정도가 안정적)
	        }
	        
	        var outerCircleStyle = new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: radius,
	                fill: new ol.style.Fill({ color: fillColor }),
	                stroke: new ol.style.Stroke({
	                    color: strokeColor,
	                    width: 1
	                })
	            })
	        });

	        var innerCircleStyle = new ol.style.Style({
	            text: new ol.style.Text({
	                text: _clusterLength.toString(),
	                font: 'bold 14px sans-serif',
	                fill: new ol.style.Fill({ color: '#fff' }),
	                stroke: new ol.style.Stroke({ color: textStrokeColor, width: 3 }),
	                textAlign: 'center',
	                textBaseline: 'middle'
	            })
	        });

	        _styleArray.push(outerCircleStyle);
	        _styleArray.push(innerCircleStyle);
	    }

	    return _styleArray;
	},
	
	
	/**
	 * <pre>
	 * 2025.09.05 원우빈 추가
	 * 커스텀 필터 입니다.
	 *
	 * 예) where a = 'A' and (b = 'B' or c = 'C'...)
	 * </pre>
	 *
	 * @param param - And 절 key, value 값
	 * @param paramSet -OR 절 key, value 값
	 * @returns {String}
	 */
	customFilters: function(param, paramSet) {
		
	    var key = Object.keys(param)[0];
	    var value = param[key];
	    var filter = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">';
	    
	    if(value != null){
	    	filter += "<ogc:And>";
	    	filter += "<ogc:PropertyIsEqualTo>";
	    	filter += "<ogc:PropertyName>" + key + "</ogc:PropertyName>";
	    	filter += "<ogc:Literal><![CDATA[" + value + "]]></ogc:Literal>";
	    	filter += "</ogc:PropertyIsEqualTo>";
	    }
	    
	    if (paramSet.length > 0) {
	    	if(paramSet.length > 1) filter += "<ogc:Or>";
	        paramSet.forEach(item => {
	            for (var column in item) {
	                filter += "<ogc:PropertyIsEqualTo>";
	                filter += "<ogc:PropertyName>" + column + "</ogc:PropertyName>";
	                filter += "<ogc:Literal><![CDATA[" + item[column] + "]]></ogc:Literal>";
	                filter += "</ogc:PropertyIsEqualTo>";
	            }
	        });
	        if(paramSet.length > 1) filter += "</ogc:Or>";
	    }
	    
	    if(value != null) filter += "</ogc:And>";
	    filter += "</ogc:Filter>";
	    return filter;
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

		if(paramSet.length > 1) filter += "<ogc:Or>";
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

function getDistanceFromLonLat(coord1, coord2) {
  var R = 6371000; // 지구 반지름 (m)
  var lat1 = coord1[1] * Math.PI / 180;
  var lat2 = coord2[1] * Math.PI / 180;
  var deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  var deltaLon = (coord2[0] - coord1[0]) * Math.PI / 180;

  var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리(m)
}
