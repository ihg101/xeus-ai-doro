/**
 * <pre>
 * 레이어 목록 객체 입니다.
 * OL Vector, Tile 객체 생성에 필요한 옵션을 지정하며,
 * 기본 프로퍼티 외에 범례 생성에 필요한 옵션이 추가되었습니다.
 *
 * 예) type		  : 공간객체 타입 (String)
 * 	   tile		  : tile 객체 (ol.layer.Tile Wrapper)
 * 	   shortcut   : 범례 숏컷 엘리먼트 (img or svg)
 *     selectable : Vector 선택 가능 여부 (boolean)
 *     group	  : 그룹명
 *     fnGroup	  : 기능 그룹(상단 대메뉴)
 * 2017.11.21      김경호     state : active/inactive 항목 추가
 *                            범례는 state가 active인것만 보여주면 됨.
 * </pre>
 *
 * @author 이주영
 */
if(window.LayerConst == null) var LayerConst = {
	URL : _common.context() + "/wfs",
	TMS : "TMS",
	HEAT : "HEAT",
	POINT : "POINT",
	MULTIPOLYGON : "MULTIPOLYGON",
	MULTILINESTRING : "MULTILINESTRING",
	/**
	 * <pre>
	 * 주제도를 서버에서 받아옵니다.
	 * 서버는 Key : Val 형식으로 리턴해야 합니다.
	 *
	 * 예) { "096_행망" : "#A50021" }
	 * </pre>
	 * @param LayerName - 레이어 명칭(String)
	 */
	ThemeLoad : function(LayerName){
		if(LayerName in Layers){
			if("themeUrl" in Layers[LayerName]){
				//if(!_common.utils.isNullAndEmpty(Layers[LayerName]["themeUrl"])){
					_common.callAjax(Layers[LayerName]["themeUrl"], null, function(json){
						Layers.LayerTheme[LayerName] = json.result;
					}, false);
				//}
			}
		}
	}
};

if(window.LayerFnGroup == null) var LayerFnGroup = {
	CMMN : "공통",
	CCTV : "CCTV",
	NMS  : "NMS",
	INF  : "기반시설",
	BOAD : "통합보드",
	EVT  : "연계서비스",
	DATA : "빅데이터",
	INST : "CCTV민원"
};

//190731 이은규
//모든 레이어를 한번에 불러와서 저장하는 방식으로 변경
var cctvSymIcon = {};
var nmsSymIcon = {};
var blackboxSymIcon = {};
var loraStateSymIcon = {};
var eliStatSymIcon = {};
var smartCitySym = {};
var govSymIcon = {};
var rainfallSymIcon = '';
var pumpSymIcon = '';
//190731 이은규
//신규 아이콘 관리 추가
//접속함체 5개, 산업용스위치 3개, 보안등 1개
var infraBoxCctvSymIcon = '';
var infraBoxCompSymIcon = '';
var infraBoxMainSymIcon = '';
var infraBoxPosiSymIcon = '';
var infraBoxUnderSymIcon = '';
var infraCctvSymIcon = '';
var infraLoraSymIcon = '';
var infraWifiSymIcon = '';
var lightSymIcon = '';
//asset_infra_etc

_common.callAjax("/sym/getLyrSymList.json", null, function(json) {
	if(json.result){
		for(var i=0; i<json.result.length; i++){
			if(json.result[i].lyrNm == "asset_cctv"){
				cctvSymIcon[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra"){
				nmsSymIcon[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_blackbox"){
				blackboxSymIcon[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_lora_state"){
				loraStateSymIcon[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "v_eli_stat"){
				eliStatSymIcon[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "smart_city"){
				smartCitySym[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "v_gov_office"){
				govSymIcon[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_rainfall"){
				rainfallSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_pump"){
				pumpSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_box_cctv"){
				infraBoxCctvSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_box_posi"){
				infraBoxPosiSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_box_main"){
				infraBoxMainSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_box_comp"){
				infraBoxCompSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_box_under"){
				infraBoxUnderSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_cctv"){
				infraCctvSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_lora"){
				infraLoraSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_infra_wifi"){
				infraWifiSymIcon = json.result[i].symMgrNo;
			}else if(json.result[i].lyrNm == "asset_light20190131"){
				lightSymIcon = json.result[i].symMgrNo;
			}
		}
	}
}, false);

if(window.Layers == null) var Layers = {

	daum_tile_map : {
		state : 'active',
		group : "배경지도",
		fnGroup : LayerFnGroup.CMMN,
		type : LayerConst.TMS,  //2017.11.21 by khkim 추가
		tile : new geomex.xeus.tms.DaumMap(),
		shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v0.png' class='sym-icon' style='height: 20px !important;'>"
	},

	daum_map : {
		state : 'active',
		group : "배경지도",
		fnGroup : LayerFnGroup.CMMN,
		type : LayerConst.TMS,  //2017.11.21 by khkim 추가
		tile : new geomex.xeus.tms.DaumMap(),
		shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v1.png' class='sym-icon' style='height: 20px !important;'>"
	},

	daum_hybrid : {
		state : 'active',
		group : "배경지도",
		fnGroup : LayerFnGroup.CMMN,
		type : LayerConst.TMS,  //2017.11.21 by khkim 추가
		tile : new geomex.xeus.tms.DaumMap(),
		shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v4.png' class='sym-icon' style='height: 20px !important;'>"
	},

	/* GIS Server */
	kais_sig_as : {
		state : 'active',
		name : "시군구",
		group : "서초구 경계",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_sig_as",
		zIndex : 0,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(94, 84, 83, 1.0);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(94, 84, 83, 1.0)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 0, 0)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get('sig_kor_nm'),
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

	kais_hjd_as : {
		state : 'active',
		name : "행정동",
		group : "서초구 경계",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_hjd_as",
		themeLoad : function(){
			Layers.LayerTheme["kais_hjd_as"] = {
				"서초1동"  : "1122051",
				"서초2동"  : "1122052",
				"서초3동"  : "1122053",
				"서초4동"  : "1122054",
				"잠원동"   : "1122055",
				"반포본동" : "1122056",
				"반포1동"  : "1122057",
				"반포2동"  : "1122058",
				"반포3동"  : "1122059",
				"반포4동"  : "1122060",
				"방배본동" : "1122061",
				"방배1동"  : "1122062",
				"방배2동"  : "1122063",
				"방배3동"  : "1122064",
				"방배4동"  : "1122065",
				"양재1동"  : "1122066",
				"양재2동"  : "1122067",
				"내곡동"   : "1122068"
			};
		},
		zIndex : 0,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : 38.175730459676004,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(31, 73, 125, 1);'/></svg>",
		style : function(feature, resolution){
			var txt = feature.get('adm_nm');
			if(resolution > 38.175730459676004) txt = '';
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(31, 73, 125, 1)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 0, 0)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: txt,
					fill: new ol.style.Fill({
						color: '#fff'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(31, 73, 125, 1)',
						width: 3
					})
				})
			});
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			if(val){
				var array = val.split(",");
				var changArr = [];
				for(var i=0; i<array.length; i++){
				    changArr.push(Layers.LayerTheme["kais_hjd_as"][array[i]]);
				}
				val = changArr.toString();
			}

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "kais_hjd_as",
					col : "adm_cd",
					val : val,
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
	},
	kais_emd_as : {
		state : 'active',
		name : "법정동",
		group : "서초구 경계",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS,
			LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_emd_as",
		themeLoad : function(){
			Layers.LayerTheme["kais_emd_as"] = {
				"방배동": "11650101",
				"양재동": "11650102",
				"우면동": "11650103",
				"원지동": "11650104",
				"잠원동": "11650106",
				"반포동": "11650107",
				"서초동": "11650108",
				"내곡동": "11650109",
				"염곡동": "11650110",
				"신원동": "11650111"
			};
		},
		zIndex : 0,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 38.175730459676004,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(38, 195, 70, 1);'/></svg>",
		style : function(feature, resolution){
			var txt = feature.get('emd_kor_nm');
			if(resolution > 38.175730459676004) txt = '';
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(38, 195, 70, 1)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 0, 0)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: txt,
					fill: new ol.style.Fill({
						color: '#fff'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(38, 195, 70, 1)',
						width: 3
					})
				})
			});
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			if(val){
				var array = val.split(",");
				var changArr = [];
				for(var i=0; i<array.length; i++){
				    changArr.push(Layers.LayerTheme["kais_emd_as"][array[i]]);
				}
				val = changArr.toString();
			}

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "kais_emd_as",
					col : "emd_cd",
					val : val,
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
	},
	kras_cbnd_as : {
		state : 'active',
		name : "연속지적",
		group : "지적 기반",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS,
			LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kras_cbnd_as",
		zIndex : 0,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 0.3,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(0, 0, 0, 1.0);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 0, 1.0)',
					width: 1
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 0, 0)'
				}),
				text: new ol.style.Text({
					font: '12px Calibri,sans-serif',
					text: feature.get('jibun'),
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

	/*bigdata_usr6000010 : {
		state : 'active',
		name : "어린이보호구역",
		group : "서비스 기반",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS,
			LayerFnGroup.BOAD,
			LayerFnGroup.EVT,
			LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:bigdata_usr6000010",
		LayerTheme : "bigdata_usr6000010",
		zIndex : 0,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 38.175730459676004,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(237, 169, 0, 1);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(237, 169, 0, 1)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(237, 169, 0, 0.1)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get("_gid"),
					fill: new ol.style.Fill({
						color: '#fff'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(31, 73, 125, 1)',
						width: 3
					})
				})
			});
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
					tbl : "bigdata_usr6000010",
					col : "emd_cd",
					val : val,
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
	},*/
	bigdata_usr6000016 : {
		state : 'active',
		name : "어린이보호구역_190613",
		group : "서비스 기반",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS,
			LayerFnGroup.BOAD,
			LayerFnGroup.EVT,
			LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:bigdata_usr6000016",
		LayerTheme : "bigdata_usr6000016",
		zIndex : 0,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 38.175730459676004,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(237, 169, 0, 1);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(237, 169, 0, 1)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(237, 169, 0, 0.1)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get("순번명칭"),
					fill: new ol.style.Fill({
						color: '#fff'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(237, 169, 0, 1)',
						width: 3
					})
				})
			});
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
					tbl : "bigdata_usr6000016",
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
	},
	bigdata_usr6000017 : {
		state : 'active',
		name : "노인보호구역_190613",
		group : "서비스 기반",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS,
			LayerFnGroup.BOAD,
			LayerFnGroup.EVT,
			LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:bigdata_usr6000017",
		LayerTheme : "bigdata_usr6000017",
		zIndex : 0,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 38.175730459676004,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(0, 216, 255, 1);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 216, 255, 1)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 216, 255, 0.1)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get("위치명"),
					fill: new ol.style.Fill({
						color: '#fff'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 216, 255, 1)',
						width: 3
					})
				})
			});
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
					tbl : "bigdata_usr6000017",
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
	},
	bigdata_usr6000012 : {
		state : 'active',
		name : "여성안심귀갓길",
		group : "서비스 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.BOAD,
           LayerFnGroup.EVT,
           LayerFnGroup.DATA
       ],
       url : LayerConst.URL,
       type : LayerConst.MULTIPOLYGON,
       typeName : "gmx:bigdata_usr6000012",
       LayerTheme : "bigdata_usr6000012",
       zIndex : 0,
       visible : false,
       selectable : true,
       minResolution : 0,
       maxResolution : 38.175730459676004,
       shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(255, 0, 127, 1);'/></svg>",
       style : function(feature, resolution){
    	   return new ol.style.Style({
    		   stroke: new ol.style.Stroke({
    			   color: 'rgba(255, 0, 127, 1)',
    			   width: 2
    		   }),
    		   fill: new ol.style.Fill({
    			   color: 'rgba(255, 0, 127, 0.1)'
    		   }),
    		   text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get("_gid"),
					fill: new ol.style.Fill({
						color: '#fff'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(31, 73, 125, 1)',
						width: 3
					})
				})
    	   });
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
    			   tbl : "bigdata_usr6000012",
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
	},

	/* 생활안전지도 */
	A2SM_CrmnlHspot_Tot_Tot : {
		state : 'active',
		group : "서비스 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.BOAD,
           LayerFnGroup.EVT,
           LayerFnGroup.DATA
        ],
		type : LayerConst.TMS,
		//tile : new geomex.xeus.tms.A2SM_CRMNLHSPOT_TOT(),
		shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v3.png' class='sym-icon' style='height: 20px !important;'>"
	},
	A2SM_CrmnlHspot_Tot_Theft : {
		state : 'active',
		group : "서비스 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.BOAD,
           LayerFnGroup.EVT,
           LayerFnGroup.DATA
        ],
        type : LayerConst.TMS,
        //tile : new geomex.xeus.tms.A2SM_CRMNLHSPOT_TOT(),
        shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v3.png' class='sym-icon' style='height: 20px !important;'>"
	},
	A2SM_CrmnlHspot_Tot_Brglr : {
		state : 'active',
		group : "서비스 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.BOAD,
           LayerFnGroup.EVT,
           LayerFnGroup.DATA
        ],
        type : LayerConst.TMS,
        //tile : new geomex.xeus.tms.A2SM_CRMNLHSPOT_TOT(),
        shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v3.png' class='sym-icon' style='height: 20px !important;'>"
	},
	A2SM_CrmnlHspot_Tot_Violn : {
		state : 'active',
		group : "서비스 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.BOAD,
           LayerFnGroup.EVT,
           LayerFnGroup.DATA
        ],
        type : LayerConst.TMS,
        //tile : new geomex.xeus.tms.A2SM_CRMNLHSPOT_TOT(),
        shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v3.png' class='sym-icon' style='height: 20px !important;'>"
	},
	A2SM_CrmnlHspot_Tot_Rape : {
		state : 'active',
		group : "서비스 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.BOAD,
           LayerFnGroup.EVT,
           LayerFnGroup.DATA
        ],
        type : LayerConst.TMS,
        //tile : new geomex.xeus.tms.A2SM_CRMNLHSPOT_TOT(),
        shortcut : "<img src='" + _common.context() + "/res/sym/lyr/v3.png' class='sym-icon' style='height: 20px !important;'>"
	},

	asset_umbrella : {
		state : 'active',
		name : "서리풀원두막",
		group : "공유시설물 정보",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS,
			LayerFnGroup.BOAD,
			LayerFnGroup.EVT,
			LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_umbrella",
		zIndex : 7,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<img src='" + _common.context() + "/res/img/umbrella1.png' class='sym-icon'>",
		themeLoad : function(){
			_common.callAjax("/umbrella/getList.json", {}, function(json){
				var instYear = new Array();
				for(var i=0; i<json.result.length; i++){
					if(!instYear.includes(json.result[i].instYear)){
						instYear.push(json.result[i].instYear);
					}
				}
				instYear.sort();

				Layers.LayerTheme["asset_umbrella"] = {};
				for(var i=0; i<instYear.length; i++){
					Layers.LayerTheme["asset_umbrella"][instYear[i]] = instYear[i];
				}
			});
		},
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					src: "../res/img/umbrella1.png"
				})
			});
		},
		getThemeImg : function(symCd){
			return "../res/img/umbrella1.png";
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}

			if(val){
				var array = val.split(",");
				var changArr = [];
				for(var i=0; i<array.length; i++){
				    changArr.push(Layers.LayerTheme["asset_umbrella"][array[i]]);
				}
				val = changArr.toString();
			}

			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_umbrella",
					col : "inst_year",
					val : val,
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						feature.setProperties({
							"img_path" : "../res/img/umbrella1.png",
							"target_field" : "mgr_seq",
							"popup" : true
						});
					}
					_source.addFeatures(_features);

					json = null;
				},
				error : function(xhr, status, error) { }
			});
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]));
		}
	},

	asset_iot_wind : {
		state : 'active',
		name : "풍속계",
		group : "공유시설물 정보",
		fnGroup : [
	       LayerFnGroup.NMS
	       /*LayerFnGroup.CCTV,
	       LayerFnGroup.NMS,
	       LayerFnGroup.BOAD,
	       LayerFnGroup.EVT,
	       LayerFnGroup.DATA*/
       ],
       url : LayerConst.URL,
       type : LayerConst.POINT,
       typeName : "gmx:asset_iot_wind",
       zIndex : 8,
       visible : false,
       selectable : true,
       minResolution : 0,
       maxResolution : Infinity,
       shortcut : "<img src='" + _common.context() + "/res/sym/wind/s1.png' class='sym-icon'>",
       themeLoad : function(){
    	   _common.callAjax("/wind/getList.json", {}, function(json){
    		   var instYear = new Array();
    		   for(var i=0; i<json.result.length; i++){
    			   if(!instYear.includes(json.result[i].instYear)){
    				   instYear.push(json.result[i].instYear);
    			   }
    		   }
    		   instYear.sort();

    		   Layers.LayerTheme["asset_iot_wind"] = {};
    		   for(var i=0; i<instYear.length; i++){
    			   Layers.LayerTheme["asset_iot_wind"][instYear[i]] = instYear[i];
    		   }
    	   });
       },
       style : function(feature, resolution){
    	   var img = "s1.png";
    	   var windAvg = Number(feature.getProperties()["wind_avg"]);
    	   if(windAvg > -1 && windAvg <= 5) img = "s1.png";
		   if(windAvg > 5 && windAvg <= 9) img = "s2.png";
		   if(windAvg > 9 && windAvg <= 13) img = "s3.png";
		   if(windAvg > 13) img = "s4.png";
    	   return new ol.style.Style({
    		   image: new ol.style.Icon({
    			   crossOrigin: "anonymous",
    			   src: "../res/sym/wind/" + img
    		   })
    	   });
       },
       getThemeImg : function(symCd){
    	   return "../res/sym/wind/s1.png";
       },
       lastParam : null,
       loadFunction : function(_lyr, val){
    	   this.lastParam = val;
    	   if(val != "null"){
    		   GMXMAP.getLayerByName(this["name"]).setVisible(true);
    	   }else{
    		   GMXMAP.getLayerByName(this["name"]).setVisible(false);
    	   }

    	   if(val){
    		   var array = val.split(",");
    		   var changArr = [];
    		   for(var i=0; i<array.length; i++){
    			   changArr.push(Layers.LayerTheme["asset_iot_wind"][array[i]]);
    		   }
    		   val = changArr.toString();
    	   }

    	   var _source = _lyr.getSource();
    	   var _geoJSON = new ol.format.GeoJSON();

    	   $.ajax({
    		   url : _common.context() + "/CustomWFS",
    		   type : "POST",
    		   data : {
    			   tbl : "asset_iot_wind",
    			   col : "inst_year",
    			   val : val,
    			   bbox : Spatial.getExtent(GMXMAP).toString()
    		   },
    		   dataType : "json",
    		   beforeSend : function() {
    			   _source.clear();
    		   },
    		   success : function(json) {
    			   var _features = _geoJSON.readFeatures(json);
    			   for(var i=0; i<_features.length; i++){
    				   var feature = _features[i];

    				   var img = "s1.png";
    		    	   var windAvg = Number(feature.getProperties()["wind_avg"]);
    		    	   if(windAvg > -1 && windAvg <= 5) img = "s1.png";
    		    	   if(windAvg > 5 && windAvg <= 9) img = "s2.png";
    		    	   if(windAvg > 9 && windAvg <= 13) img = "s3.png";
    		    	   if(windAvg > 13) img = "s4.png";

    		    	   feature.setStyle(new ol.style.Style({
    		    		   image: new ol.style.Icon({
    		    			   crossOrigin: "anonymous",
    		    			   src: "../res/sym/wind/" + img
    		    		   })
    		    	   }));

    				   feature.setProperties({
    					   "img_path" : "../res/sym/wind/" + img,
    					   "target_field" : "dev_eui",
    					   "popup" : true
    				   });
    			   }
    			   _source.addFeatures(_features);

    			   json = null;
    		   },
    		   error : function(xhr, status, error) { }
    	   });
       },
       reload : function(){
    	   this.loadFunction(GMXMAP.getLayerByName(this["name"]));
       }
	},

	asset_dust_loc : {
		state : 'active',
		name : "미세먼지 측정기",
		group : "공유시설물 정보",
		fnGroup : [
           LayerFnGroup.NMS
       ],
       url : LayerConst.URL,
       type : LayerConst.POINT,
       typeName : "gmx:asset_dust_loc",
       zIndex : 8,
       visible : false,
       selectable : true,
       minResolution : 0,
       maxResolution : Infinity,
       shortcut : "<img src='" + _common.context() + "/res/sym/wind/PMsensor1.png' class='sym-icon'>",
       themeLoad : function(){
		   Layers.LayerTheme["asset_dust_loc"] = {};
		   Layers.LayerTheme["asset_dust_loc"]["서초구"] = "서초구";
		   Layers.LayerTheme["asset_dust_loc"]["서울시"] = "서울시";
       },
       style : function(feature, resolution){
    	   var img = "PMsensor1.png";
    	   var owner = feature.getProperties()["owner"].trim();
    	   if(owner == "서초구") img = "PMsensor1.png";
    	   if(owner == "서울시") img = "PMsensor2.png";
    	   return new ol.style.Style({
    		   image: new ol.style.Icon({
    			   crossOrigin: "anonymous",
    			   src: "../res/sym/wind/" + img
    		   })
    	   });
       },
       getThemeImg : function(symCd){
		   var img = "PMsensor1.png";
    	   if(symCd.trim() == "서초구") img = "PMsensor1.png";
    	   if(symCd.trim() == "서울시") img = "PMsensor2.png";
    	   return "../res/sym/wind/" + img;
       },
       lastParam : null,
       loadFunction : function(_lyr, val){
    	   this.lastParam = val;
    	   if(val != "null"){
    		   GMXMAP.getLayerByName(this["name"]).setVisible(true);
    	   }else{
    		   GMXMAP.getLayerByName(this["name"]).setVisible(false);
    	   }

    	   if(val){
    		   var array = val.split(",");
    		   var changArr = [];
    		   for(var i=0; i<array.length; i++){
    			   changArr.push(Layers.LayerTheme["asset_dust_loc"][array[i]]);
    		   }
    		   val = changArr.toString();
    	   }

    	   var _source = _lyr.getSource();
    	   var _geoJSON = new ol.format.GeoJSON();

    	   $.ajax({
    		   url : _common.context() + "/CustomWFS",
    		   type : "POST",
    		   data : {
    			   tbl : "asset_dust_loc",
    			   col : "owner",
    			   val : val,
    			   bbox : Spatial.getExtent(GMXMAP).toString()
    		   },
    		   dataType : "json",
    		   beforeSend : function() {
    			   _source.clear();
    		   },
    		   success : function(json) {
    			   var _features = _geoJSON.readFeatures(json);
    			   for(var i=0; i<_features.length; i++){
    				   var feature = _features[i];

    				   var img = "PMsensor1.png";
    				   var owner = feature.getProperties()["owner"].trim();
    		    	   if(owner == "서초구") img = "PMsensor1.png";
    		    	   if(owner == "서울시") img = "PMsensor2.png";

    				   feature.setStyle(new ol.style.Style({
    					   image: new ol.style.Icon({
    						   crossOrigin: "anonymous",
    						   src: "../res/sym/wind/" + img
    					   })
    				   }));

    				   feature.setProperties({
    					   "img_path" : "../res/sym/wind/" + img,
    					   "target_field" : "addr",
    					   "popup" : true
    				   });
    			   }
    			   _source.addFeatures(_features);

    			   json = null;
    		   },
    		   error : function(xhr, status, error) { }
    	   });
       },
       reload : function(){
    	   this.loadFunction(GMXMAP.getLayerByName(this["name"]));
       }
	},

	asset_cctv : {
		state : 'active',
		name : "cctv",
		group : "CCTV",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS
        ],
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_cctv",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<img src='" + _common.context() + "/res/sym/cctv/99.png' class='sym-icon'>",
		style : null,
		getThemeImg : function(symCd){
			var mgrNo = cctvSymIcon[symCd];
			return "../sym/getSymbol.do?mgrNo=" + mgrNo;
		},
		themeLoad : function(){
			Layers.LayerTheme["asset_cctv"] = {};
			var array = _common.getCodeByGroup("C14");
			for(var i=0; i<array.length; i++){
				if(array[i].cdeNm != "장애"){
					Layers.LayerTheme["asset_cctv"][array[i].cdeNm] = array[i].cdeCde;
				}
			}
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName("cctv").setVisible(true);
				xeusCCTV.cctv.setSymbolStyle(val).reload();
			}else{
				GMXMAP.getLayerByName("cctv").setVisible(false);
				if(xeusSymbolCctv) xeusSymbolCctv.clear();
			}
		}
	},
	asset_cctv_view : {
		state : 'active',
		name : "CCTV 목적별",
		group : "CCTV",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS
        ],
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_cctv_view",
		zIndex : 7,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<img src='" + _common.context() + "/res/sym/cctv/99.png' class='sym-icon'>",
		themeLoad : function(){
			Layers.LayerTheme["asset_cctv_view"] = {
				"공원방범1" : "10",
				"블랙박스" : "11",
				"어린이보호" : "12",
				"돔형/비상벨" : "13",
				"산불감시" : "14",
				"그린파킹" : "15",
				"초교(내부)" : "16",
				"고층광각" : "17",
				"경찰방범" : "18",
				"주정차단속" : "19",
				"일반방범" : "20",
				"초교 스쿨존(외부)" : "21",
				"무단투기용" : "22",
				"지하보도관리" : "23",
				"재난재해(빗물펌프장)" : "24",
				"기타" : "99"
			};
		},
		style : function(feature, resolution){
			var color = "";
			var prop = feature.getProperties();
			if(prop.gbn_cd == "10") color = "g_a.png";
			if(prop.gbn_cd == "11") color = "b_b.png";
			if(prop.gbn_cd == "12") color = "y_c.png";
			if(prop.gbn_cd == "13") color = "b_d.png";
			if(prop.gbn_cd == "14") color = "g_f.png";
			if(prop.gbn_cd == "15") color = "g_g.png";
			if(prop.gbn_cd == "16") color = "y_h.png";
			if(prop.gbn_cd == "17") color = "g_f.png";
			if(prop.gbn_cd == "18") color = "b_k.png";
			if(prop.gbn_cd == "19") color = "r_n.png";
			if(prop.gbn_cd == "20") color = "b_p.png";
			if(prop.gbn_cd == "21") color = "y_s.png";
			if(prop.gbn_cd == "22") color = "p_t.png";
			if(prop.gbn_cd == "23") color = "p_u.png";
			if(prop.gbn_cd == "24") color = "p_w.png";
			if(prop.gbn_cd == "99") color = "p_z.png";
			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					src: "../res/sym/cctvViewSym/" + color
				})
			});
		},
		getThemeImg : function(symCd){
			if(symCd){
				var color = "";
				if(symCd == "10") color = "g_a.png";
				if(symCd == "11") color = "b_b.png";
				if(symCd == "12") color = "y_c.png";
				if(symCd == "13") color = "b_d.png";
				if(symCd == "14") color = "g_f.png";
				if(symCd == "15") color = "g_g.png";
				if(symCd == "16") color = "y_h.png";
				if(symCd == "17") color = "g_f.png";
				if(symCd == "18") color = "b_k.png";
				if(symCd == "19") color = "r_n.png";
				if(symCd == "20") color = "b_p.png";
				if(symCd == "21") color = "y_s.png";
				if(symCd == "22") color = "p_t.png";
				if(symCd == "23") color = "p_u.png";
				if(symCd == "24") color = "p_w.png";
				if(symCd == "99") color = "p_z.png";

				return "../res/sym/cctvViewSym/" + color;
			}
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}

			if(val){
				var array = val.split(",");
				var changArr = [];
				for(var i=0; i<array.length; i++){
				    changArr.push(Layers.LayerTheme["asset_cctv_view"][array[i]]);
				}
				val = changArr.toString();
			}

			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_cctv_view",
					col : "gbn_cd",
					val : val,
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];

						var color = "";
						var prop = feature.getProperties();
						if(prop.gbn_cd == "10") color = "g_a.png";
						if(prop.gbn_cd == "11") color = "b_b.png";
						if(prop.gbn_cd == "12") color = "y_c.png";
						if(prop.gbn_cd == "13") color = "b_d.png";
						if(prop.gbn_cd == "14") color = "g_f.png";
						if(prop.gbn_cd == "15") color = "g_g.png";
						if(prop.gbn_cd == "16") color = "y_h.png";
						if(prop.gbn_cd == "17") color = "g_f.png";
						if(prop.gbn_cd == "18") color = "b_k.png";
						if(prop.gbn_cd == "19") color = "r_n.png";
						if(prop.gbn_cd == "20") color = "b_p.png";
						if(prop.gbn_cd == "21") color = "y_s.png";
						if(prop.gbn_cd == "22") color = "p_t.png";
						if(prop.gbn_cd == "23") color = "p_u.png";
						if(prop.gbn_cd == "24") color = "p_w.png";
						if(prop.gbn_cd == "99") color = "p_z.png";

						feature.setProperties({
							"img_path" : "../res/sym/cctvViewSym/" + color,
							"target_field" : "cctv_nm",
							"popup" : false
						});
					}
					_source.addFeatures(_features);

					json = null;
				},
				error : function(xhr, status, error) { }
			});
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]));
		}
	},
	asset_cctv_seoul : {
		state : 'active',
		name : "서울시 샘플데이터(CCTV)",
		group : "CCTV",
		fnGroup : [
			LayerFnGroup.CCTV,
			LayerFnGroup.NMS
        ],
        url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_cctv_seoul",
		themeLoad : function(){
			Layers.LayerTheme["asset_cctv_seoul"] = {
				"강남구" : "강남구",
				"강동구" : "강동구",
				"강북구" : "강북구",
				"강서구" : "강서구",
				"과천시" : "과천시",
				"광진구" : "광진구",
				"노원구" : "노원구",
				"노원구청" : "노원구청",
				"동대문구" : "동대문구",
				"동작구" : "동작구",
				"마포구" : "마포구",
				"서대문구" : "서대문구",
				"서초구" : "서초구",
				"성동구" : "성동구",
				"성동구청" : "성동구청",
				"송파구" : "송파구",
				"양천구" : "양천구",
				"영등포구" : "영등포구",
				"은평구" : "은평구",
				"은평구청" : "은평구청",
				"종로구" : "종로구",
				"중구" : "중구"
			};
		},
		zIndex : 0,
		visible : false,
		selectable : true,
		minResolution : 0,
		//maxResolution : 38.175730459676004,
		maxResolution : Infinity,
		shortcut : "<img src='" + _common.context() + "/res/sym/cctv/99.png' class='sym-icon'>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 255, 0.1)'
					}),
					stroke: new ol.style.Stroke({
						color: "blue",
						width: 3
					})
				})
			});
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			if(val){
				var array = val.split(",");
				var changArr = [];
				for(var i=0; i<array.length; i++){
				    changArr.push(Layers.LayerTheme["asset_cctv_seoul"][array[i]]);
				}
				val = changArr.toString();
			}

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_cctv_seoul",
					col : "ofc_nm",
					val : val,
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];

						var color = "";
						var prop = feature.getProperties();
						if(prop.state == "좋음") color = 'c43.png';
						if(prop.state == "보통") color = 'c44.png';
						if(prop.state == "안좋음") color = 'c45.png';
						if(prop.state == "매우안좋음") color = 'c46.png';

						feature.setProperties({
							"img_path" : "../res/sym/cctv/99.png",
							"target_field" : "mgr_no",
							"popup" : true
						});
					}
					_source.addFeatures(_features);

					json = null;
				},
				error : function(xhr, status, error) { }
			});
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]));
		}
	},
	asset_cctv_install : {
		state : 'active',
		name : "CCTV설치민원",
		group : "민원관리",
		fnGroup : LayerFnGroup.INST,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_cctv_install",
		LayerTheme : "asset_cctv_install",
		zIndex : 100,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<img src='" + _common.context() + "/res/img/pin.png' class='sym-icon'>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 255, 0.1)'
					}),
					stroke: new ol.style.Stroke({
						color: "blue",
						width: 3
					})
				})
			});
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}

			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_cctv_install",
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
				error : function(xhr, status, error) {
					console.log(error);

				}
			});
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]));
		}
	},
	asset_cctv_heat : {
		name : "CCTV 분포도",
		group : "BOAD",
		fnGroup : LayerFnGroup.BOAD,
		url : LayerConst.URL,
		type : LayerConst.HEAT,
		zIndex : 8,
		visible : true,
		selectable : false,
		minResolution : 0,
		maxResolution : Infinity,
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			var bbox = null;

			if(arguments[2]){
				bbox = Spatial.getExtent(arguments[2]).toString();
			}else{
				bbox = Spatial.getExtent(xeusLayout.mapService.getMap()).toString();
			}

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_cctv",
					col : "gbn_cd",
					val : val,
					bbox : bbox
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					_source.addFeatures(_features);
					if(xeusLayout.mapService) xeusLayout.mapService.addLayer(_lyr);

					json = null;
				},
				error : function(xhr, status, error) { }
			});
		}
	},
	v_asset_cctv_heat : {
		name : "영상반출 분포도",
		group : "BOAD",
		//fnGroup : LayerFnGroup.BOAD,
		fnGroup : [
					LayerFnGroup.CCTV,
					LayerFnGroup.BOAD
		        ],
		url : LayerConst.URL,
		type : LayerConst.HEAT,
		zIndex : 8,
		visible : false,
		selectable : false,
		minResolution : 0,
		maxResolution : Infinity,
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			var data = {
					tbl : "v_asset_cctv_heat",
					col : "crime_typ",
					val : val
				}

			if(arguments[2] != null) data.reqGbn = arguments[2];
			if(arguments[3] != null) data.startDat = arguments[3];
			if(arguments[4] != null) data.endDat = arguments[4];

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : data,
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
		}
	},

	mon_evet_hist : {
		name : "이벤트발생 분포도",
		group : "BOAD",
		fnGroup : [
					LayerFnGroup.CCTV,
					LayerFnGroup.BOAD
		        ],
		url : LayerConst.URL,
		type : LayerConst.HEAT,
		zIndex : 8,
		visible : false,
		selectable : false,
		minResolution : 0,
		maxResolution : Infinity,
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}

			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			var data = {
					tbl : "mon_evet_hist",
					col : "evt_nm",
					val : val
				}

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : data,
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {

					var _features = _geoJSON.readFeatures(json);
					_source.addFeatures(_features);
					if(xeusLayout.mapService) xeusLayout.mapService.addLayer(_lyr);

					json = null;
				},
				error : function(xhr, status, error) { }
			});
		}
	},

	asset_lora_state : {
		state : 'active',
		name : "LoRa상태정보",
		group : "논리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_lora_state",
		LayerTheme : "asset_lora_state",
		zIndex : 7,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 4.8,
		shortcut : "<img src='" + _common.context() + "/res/sym/nms/c43.png' style='width: 20px !important; height: 20px !important; vertical-align: bottom; margin: 0 10px;'>",
		//shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 251, 188, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			var color = "";
			var prop = feature.getProperties();
			if(prop.state == "좋음") color = 'c43.png';
			if(prop.state == "보통") color = 'c44.png';
			if(prop.state == "안좋음") color = 'c45.png';
			if(prop.state == "매우안좋음") color = 'c46.png';
			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					src: "../res/sym/nms/" + color
				})
			});
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
			}
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_lora_state",
					col : "state",
					//val : "좋음",
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];

						var color = "";
						var prop = feature.getProperties();
						if(prop.state == "좋음") color = 'c43.png';
						if(prop.state == "보통") color = 'c44.png';
						if(prop.state == "안좋음") color = 'c45.png';
						if(prop.state == "매우안좋음") color = 'c46.png';

						feature.setProperties({
							"img_path" : "../res/sym/nms/" + color,
							"target_field" : "state",
							"popup" : true
						});
					}
					_source.addFeatures(_features);

					json = null;
				},
				error : function(xhr, status, error) { }
			});
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]));
		}
	},

}
