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

if(window.cctvSymIcon == null) {
	var cctvSymIcon = {};
	//정렬조건을 넣지 않으면 순서대로 정렬되서 나오기 때문에 바로 넣으면 됨.
	/*_common.callAjax("/symIcon/getSymIconList.json", {'symGrp' : 'ctv'}, function(json){
		var obj = {};
		$.each(json.result,function(key,value) {
			if(cctvSymIcon[value.gbnCd] === undefined || cctvSymIcon[value.gbnCd] == null){
				obj = {};
			} else {
				obj = cctvSymIcon[value.gbnCd];
			}
			obj[value.iconTyp] = value.fileNm;
			cctvSymIcon[value.gbnCd] = obj;
		});
	}, false);*/

	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'asset_cctv'}, function(json) {
		if(json.result){
			var obj = {};
			for(var i=0; i<json.result.length; i++){
				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
			cctvSymIcon = obj;
		}
	}, false);
}

if(window.nmsSymIcon == null) {
	var nmsSymIcon = {};
	//정렬조건을 넣지 않으면 순서대로 정렬되서 나오기 때문에 바로 넣으면 됨.
	/*_common.callAjax("/symIcon/getSymIconList.json", {'symGrp' : 'nms'}, function(json){
		var obj = {};
		$.each(json.result,function(key,value) {
			if(nmsSymIcon[value.gbnCd] === undefined || nmsSymIcon[value.gbnCd] == null){
				obj = {};
			} else {
				obj = nmsSymIcon[value.gbnCd];
			}
			obj[value.iconTyp] = value.fileNm;
			nmsSymIcon[value.gbnCd] = obj;
		});
	}, false);*/
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'asset_infra'}, function(json){
		if(json.result){
			var obj = {};
			for(var i=0; i<json.result.length; i++){
				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
			nmsSymIcon = obj;
		}
	}, false);
}

if(window.blackboxSymIcon == null) {
	var blackboxSymIcon = {};
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'asset_blackbox'}, function(json){
		if(json.result){
			var obj = {};
			for(var i=0; i<json.result.length; i++){
				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
			blackboxSymIcon = obj;
		}
	}, false);
}

if(window.loraStateSymIcon == null) {
	var loraStateSymIcon = {};
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'asset_lora_state'}, function(json){
		if(json.result){
			var obj = {};
			for(var i=0; i<json.result.length; i++){
				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
			loraStateSymIcon = obj;
		}
	}, false);
}

if(window.eliStatSymIcon == null) {
	var eliStatSymIcon = {};
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'v_eli_stat'}, function(json){
		if(json.result){
			var obj = {};
			for(var i=0; i<json.result.length; i++){
				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
			eliStatSymIcon = obj;
		}
	}, false);
}

if(window.smartCitySym == null) {
	var smartCitySym = {};
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'smart_city'}, function(json) {
		if(json.result){
			var obj = {};
			for(var i=0; i<json.result.length; i++){
				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
			smartCitySym = obj;
		}
	}, false);
}

if(window.rainfallSymIcon == null) {
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'asset_rainfall'}, function(json) {
		if(json.result){
			rainfallSymIcon = json.result[0].symMgrNo;
		}
	}, false);
}

if(window.pumpSymIcon == null) {
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'asset_pump'}, function(json) {
		if(json.result){
			pumpSymIcon = json.result[0].symMgrNo;
		}
	}, false);
}


if(window.govSymIcon == null) {
	var govSymIcon = {};
	_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': 'v_gov_office'}, function(json) {
		if(json.result){
			var obj = {};
			for(var i=0; i<json.result.length; i++){
				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
			govSymIcon = obj;
		}
	}, false);
}

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
					//val : "좋음",
					val : val,
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					/*for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var symCd = feature.get("status_cd");
						var mgrNo = blackboxSymIcon[symCd];

						feature.setProperties({
							"img_path" : "../sym/getSymbol.do?mgrNo=" + mgrNo,
							"target_field" : "addr",
							"popup" : true
						});
					}*/
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
					//val : "좋음",
					val : val,
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					/*for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var symCd = feature.get("status_cd");
						var mgrNo = blackboxSymIcon[symCd];

						feature.setProperties({
							"img_path" : "../sym/getSymbol.do?mgrNo=" + mgrNo,
							"target_field" : "addr",
							"popup" : true
						});
					}*/
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
	/*kais_emd_as : {
		state : 'active',
		name : "읍면동",
		group : "행정동 경계",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.DATA
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_emd_as",
		zIndex : 2,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 38.175730459676004,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(31, 73, 125, 1);'/></svg>",
		style : function(feature, resolution){
			var txt = feature.get('emd_kor_nm');
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
		}
	},*/
	/*kais_li_as : {
		state : 'active',
		name : "리",
		group : "행정동 경계",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.INF
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_li_as",
		zIndex : 3,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 10,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(6, 166, 255, 1);'/></svg>",
		style : function(feature, resolution){
			var txt = feature.get('li_kor_nm');
			if(resolution > 38.175730459676004) txt = '';
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(6, 166, 255, 1)',
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
						color: 'rgba(6, 166, 255, 1)',
						width: 3
					})
				})
			});
		}
	},
	kais_buld_as : {
		state : 'active',
		name : "건물",
		group : "지적 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.INF
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_buld_as",
		zIndex : 5,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 1.2,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(220, 220, 220, 1.0);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(220, 220, 220, 1.0)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 0, 0)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get('buld_nm'),
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
	kais_eqb_as : {
		state : 'active',
		name : "건물군",
		group : "지적 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.INF
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_eqb_as",
		zIndex : 6,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 1.2,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(220, 220, 220, 1.0);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(220, 220, 220, 1.0)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 0, 0)'
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get('buld_nm'),
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
	kais_manage_ls : {
		state : 'active',
		name : "도로구간",
		group : "지적 기반",
		fnGroup : [
           LayerFnGroup.CCTV,
           LayerFnGroup.NMS,
           LayerFnGroup.INF
        ],
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:kais_manage_ls",
		zIndex : 7,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 1.2,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 251, 188, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(252, 251, 188, 1.0)',
					width: 2
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get('rn'),
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
	},*/
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
		//shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='green' stroke-width='2' fill='rgb(0,0,0)' /></svg>",
		style : null,
		getThemeImg : function(symCd){
			var mgrNo = cctvSymIcon[symCd];
			return "../sym/getSymbol.do?mgrNo=" + mgrNo;
			/*var imgNm = cctvSymIcon[symCd]['N'];
			return "../res/sym/cctv/" + imgNm;*/
			//return "../res/sym/cctv/" + imgNm + ".png";
		},
		themeLoad : function(){
			Layers.LayerTheme["asset_cctv"] = {};
			var array = _common.getCodeByGroup("C14");
			for(var i=0; i<array.length; i++){
				if(array[i].cdeNm != "장애"){
					/*var cdeCde = array[i].cdeCde;
					if(cdeCde == '11') cdeCde = 'test13';
					else if(cdeCde == '18') cdeCde = 'test14';*/
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
	asset_infra : {
		state : 'active',
		name : "기반시설",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_infra",
		//LayerTheme : "asset_infra",
		//themeUrl : "/nms/getInfraTheme.json",
		getThemeImg : function(symCd){
			if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
			var mgrNo = nmsSymIcon[Number(symCd)];
			return "../sym/getSymbol.do?mgrNo=" + mgrNo;



			//return "../res/sym/nms/" + symCd
		},
		themeLoad : function(){
			Layers.LayerTheme["asset_infra"] = {};
			var array = _common.getCodeByGroup("C12");
			for(var i=0; i<array.length; i++){
				if(array[i].cdeNm != "장애"){
					/*var cdeCde = array[i].cdeCde;
					if(cdeCde == '11') cdeCde = 'test13';
					else if(cdeCde == '18') cdeCde = 'test14';*/
					Layers.LayerTheme["asset_infra"][array[i].cdeNm] = array[i].cdeCde;
				}
			}
		},
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='green' stroke-width='2' fill='rgb(0,0,0)' /></svg>",
		style : function(feature, resolution){
			/*var symCd = feature.get("sym_cd");
			if(symCd != null && symCd != ""){
				return new ol.style.Style({
					image: new ol.style.Icon({
						crossOrigin: "anonymous",
						src: "../res/sym/nms/" + symCd + ".png"
					})
				});
			}*/

			var symCd = feature.get("fcl_gbn_cd");
			if(symCd != null && symCd != ""){
				if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
				var mgrNo = nmsSymIcon[Number(symCd)];
				//return "../sym/getSymbol.do?mgrNo=" + mgrNo;

				return new ol.style.Style({
					image: new ol.style.Icon({
						crossOrigin: "anonymous",
						//src: "../res/sym/nms/" + symCd + ".png"
						src: "../sym/getSymbol.do?mgrNo=" + mgrNo
					})
				});


				/*var imgNm = nmsSymIcon[symCd]['N'];
				return new ol.style.Style({
					image: new ol.style.Icon({
						crossOrigin: "anonymous",
						//src: "../res/sym/nms/" + symCd + ".png"
						src: "../res/sym/nms/" + imgNm
					})
				});*/
			}else{
				return new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						stroke: new ol.style.Stroke({
							color: 'rgba(0, 128, 0, 1.0)',
							width: 2
						}),
						fill : new ol.style.Fill({
							color: 'rgba(0, 0, 0, 1.0)'
						}),
						text: new ol.style.Text({
							font: '15px Calibri,sans-serif',
							text: feature.get('cable_nm'),
							fill: new ol.style.Fill({
								color: '#000'
							}),
							stroke: new ol.style.Stroke({
								color: '#fff',
								width: 3
							})
						})
					})
				});
			}
		},
		lastParam : null,
		loadFunction : function(_lyr, val){
			if(val){
				var array = val.split(",");
				var changArr = [];
				for(var i=0; i<array.length; i++){
					changArr.push(Layers.LayerTheme["asset_infra"][array[i]]);
				}
				val = changArr.toString();
			}

			this.lastParam = val;
			if(val != "null"){
				GMXMAP.getLayerByName(this["name"]).setVisible(true);
			}else{
				GMXMAP.getLayerByName(this["name"]).setVisible(false);
				if(xeusSymbolInfra) xeusSymbolInfra.clear();
			}

			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_infra",
					//col : "sym_cd",
					col : "fcl_gbn_cd",
					val : val,
					bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					/*var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						feature.setProperties({
							"img_path" : "../res/sym/nms/" + feature.get("sym_cd") + ".png",
							"target_field" : "facility_nm",
							"popup" : true
						});
					}
					_source.addFeatures(_features);*/

					/*var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var imgNm = nmsSymIcon[feature.get("fcl_gbn_cd")]['N'];
						feature.setProperties({
							"img_path" : "../res/sym/nms/" + imgNm,
							"target_field" : "facility_nm",
							"popup" : true
						});
					}*/

					var _features = _geoJSON.readFeatures(json);
					var isVisible = GMXMAP.getLayerByName(this["name"]).getVisible();

					xeusSymbol.removeAllFeature("asset_infra");
					if(xeusSymbolInfra) xeusSymbolInfra.clear();

					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var symCd = feature.get("fcl_gbn_cd");
						var mgrNo = nmsSymIcon[Number(symCd)];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var isError = false;
						if("" + feature.get("isError") == "true") isError = true;
						feature.setProperties({
							"img_path" : "../sym/getSymbol.do?mgrNo=" + mgrNo,
							"target_field" : "facility_nm",
							"popup" : true
						});

						if(isError && parentView == "nmsView" && isVisible){
							xeusSymbol.addError(point, gid, "asset_infra")
						}

						if(SYMBOL_TEXT_CHK[parentView]["infra"] && parentView == "nmsView" && isVisible){
							var facilityNm = '';
							if(feature.get("facility_nm")) facilityNm = feature.get("facility_nm");
							xeusSymbolInfra.addText(feature, gid, facilityNm);
						}
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
	/*asset_cable : {
		state : 'active',
		name : "케이블",
		group : "NMS",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:asset_cable",
		LayerTheme : "asset_cable",
		//themeCol : "cable_nm",
		themeUrl : "/nms/getCableTheme.json",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 72, 72, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];
			if(color == null) color = "#FC4848";
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 2
				})
			});
		},
		loadFunction : function(_lyr, val){
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_cable",
					col : "cable_nm",
					val : val,
					bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					_source.addFeatures(_features);
				},
				error : function(xhr, status, error) { }
			});
		}
	},*/
	asset_rainfall : {
		state : 'active',
		name : "강우량",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_rainfall",
		LayerTheme : "asset_rainfall",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		//shortcut : "<img src='" + _common.context() + "/res/sym/waterPump/water.png' class='sym-icon'>",
		shortcut : "<img src='" + _common.context() + "/sym/getSymbol.do?mgrNo=" + rainfallSymIcon + "' class='sym-icon'>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					//src: "../res/sym/waterPump/water.png"
					src: "../sym/getSymbol.do?mgrNo=" + rainfallSymIcon
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
					tbl : "asset_rainfall",
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {

					var _features = _geoJSON.readFeatures(json);
					var isVisible = GMXMAP.getLayerByName(this["name"]).getVisible();
					xeusSymbol.removeAllFeature("asset_rainfall");
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var isError = false;
						if("" + feature.get("isError") == "true") isError = true;
						if(isError && parentView == "nmsView" && isVisible){
							xeusSymbol.addError(point, gid, "asset_rainfall");
						}

						feature.setProperties({
							//"img_path" : "../res/sym/nms/" + feature.get("sym_cd") + ".png",
							//"img_path" : "../res/sym/waterPump/water.png",
							"img_path" : "../sym/getSymbol.do?mgrNo=" + rainfallSymIcon,
							"target_field" : "raingauge_name",
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
	asset_pump : {
		state : 'active',
		name : "펌프장",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_pump",
		LayerTheme : "asset_pump",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		//shortcut : "<img src='" + _common.context() + "/res/sym/waterPump/waterPump.png' class='sym-icon'>",
		shortcut : "<img src='" + _common.context() + "/sym/getSymbol.do?mgrNo=" + pumpSymIcon + "' class='sym-icon'>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					//src: "../res/sym/waterPump/waterPump.png"
					src: "../sym/getSymbol.do?mgrNo=" + pumpSymIcon
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
					tbl : "asset_pump",
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {

					var _features = _geoJSON.readFeatures(json);
					var isVisible = GMXMAP.getLayerByName(this["name"]).getVisible();
					xeusSymbol.removeAllFeature("asset_pump");
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var isError = false;
						if("" + feature.get("isError") == "true") isError = true;
						if(isError && parentView == "nmsView" && isVisible){
							xeusSymbol.addError(point, gid, "asset_pump");
						}

						feature.setProperties({
							//"img_path" : "../res/sym/nms/" + feature.get("sym_cd") + ".png",
							//"img_path" : "../res/sym/waterPump/waterPump.png",
							"img_path" : "../sym/getSymbol.do?mgrNo=" + pumpSymIcon,
							"target_field" : "pumpjang_name",
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
	asset_pump_sec : {
		state : 'active',
		name : "펌프장하천구간",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:asset_pump_sec",
		LayerTheme : "asset_pump_sec",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 72, 72, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			//var color = GmxColor[GmxColor.random()].hex;
			var color = "red";
			if(color == null) color = "#FC4848";
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 5
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
					tbl : "asset_pump_sec",
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
	asset_infra_cctv : {
		state : 'active',
		name : "CCTV망 산업용스위치",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_infra_cctv",
		LayerTheme : "asset_infra_cctv",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		//shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='green' stroke-width='2' fill='rgb(0,0,0)' /></svg>",
		shortcut : "<img src='../res/sym/nms/c27.png' style='height: 20px !important; vertical-align: bottom; margin: 0 10px;'>",
		style : function(feature, resolution){
			/*return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 128, 0, 1.0)',
						width: 2
					}),
					fill : new ol.style.Fill({
						color: 'rgba(0, 0, 0, 1.0)'
					}),
					text: new ol.style.Text({
						font: '15px Calibri,sans-serif',
						text: feature.get('cable_nm'),
						fill: new ol.style.Fill({
							color: '#bbb'
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 3
						})
					})
				})
			});*/

			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					src: "../res/sym/nms/c27.png"
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
					tbl : "asset_infra",
					facilityClscd : "CCTV",
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {

					var _features = _geoJSON.readFeatures(json);
					var isVisible = GMXMAP.getLayerByName(this["name"]).getVisible();

					xeusSymbol.removeAllFeature("asset_infra_cctv");
					if(xeusSymbolInfraCctv) xeusSymbolInfraCctv.clear();

					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var symCd = feature.get("fcl_gbn_cd");
						var mgrNo = nmsSymIcon[Number(symCd)];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var isError = false;
						if("" + feature.get("isError") == "true") isError = true;
						if(isError && parentView == "nmsView" && isVisible){
							xeusSymbol.addError(point, gid, "asset_infra_cctv");
						}

						feature.setProperties({
							//"img_path" : "../res/sym/waterPump/waterPump.png",
							"img_path" : "../res/sym/nms/c27.png",
							"target_field" : "facility_id",
							"popup" : true
						});

						if(SYMBOL_TEXT_CHK[parentView]["infraCctv"] && parentView == "nmsView" && isVisible){
							var facilityNm = '';
							if(feature.get("facility_nm")) facilityNm = feature.get("facility_nm");
							xeusSymbolInfraCctv.addText(feature, gid, facilityNm);
						}
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
	asset_netwk_cctv : {
		state : 'active',
		name : "CCTV망",
		group : "논리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:asset_netwk_cctv",
		LayerTheme : "asset_netwk_cctv",
		//themeCol : "cable_nm",
		themeUrl : "/netwk/getCctvCableTheme.json",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 72, 72, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			var connStat = feature.get("conn_stat");
			var ringNo = feature.get("ring_no");
			var color = Layers.LayerTheme.asset_netwk_cctv[ringNo]
			if(color == null) color = "#FC4848";
			var param = {
				color: color,
				width: 2
			}
			if(Number(connStat) == 12){
				param["color"] = "#5D5D5D";
				param["lineDash"] = [10, 10];
			}
			return new ol.style.Style({
				stroke: new ol.style.Stroke(param)
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

			var ringNo = null;
			if(_common.utils.validNull(val) != ""){
				ringNo = val.split(",").join("','");
			}

			if(_common.utils.isNullAndEmpty(ringNo)) ringNo = null;

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_netwk",
					col : "net_nm",
					val : "CCTV",
					ringNo : ringNo,//.split(",").join("','")
					bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
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
	asset_infra_wifi : {
		state : 'active',
		name : "WIFI망 산업용스위치",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_infra_wifi",
		LayerTheme : "asset_infra_wifi",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		//shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='green' stroke-width='2' fill='rgb(0,0,0)' /></svg>",
		shortcut : "<img src='../res/sym/nms/c28.png' style='height: 20px !important; vertical-align: bottom; margin: 0 10px;'>",
		style : function(feature, resolution){
			/*return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 128, 0, 1.0)',
						width: 2
					}),
					fill : new ol.style.Fill({
						color: 'rgba(0, 0, 0, 1.0)'
					}),
					text: new ol.style.Text({
						font: '15px Calibri,sans-serif',
						text: feature.get('cable_nm'),
						fill: new ol.style.Fill({
							color: '#CCC'
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 3
						})
					})
				})
			});*/
			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					src: "../res/sym/nms/c28.png"
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
					tbl : "asset_infra",
					facilityClscd : "WIFI",
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {

					var _features = _geoJSON.readFeatures(json);
					var isVisible = GMXMAP.getLayerByName(this["name"]).getVisible();

					xeusSymbol.removeAllFeature("asset_infra_wifi");
					if(xeusSymbolInfraWifi) xeusSymbolInfraWifi.clear();

					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var symCd = feature.get("fcl_gbn_cd");
						var mgrNo = nmsSymIcon[Number(symCd)];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var isError = false;
						if("" + feature.get("isError") == "true") isError = true;
						if(isError && parentView == "nmsView" && isVisible){
							xeusSymbol.addError(point, gid, "asset_infra_wifi");
						}

						feature.setProperties({
							//"img_path" : "../res/sym/waterPump/waterPump.png",
							"img_path" : "../res/sym/nms/c27.png",
							"target_field" : "facility_id",
							"popup" : true
						});

						if(SYMBOL_TEXT_CHK[parentView]["infraWifi"] && parentView == "nmsView" && isVisible){
							var facilityNm = '';
							if(feature.get("facility_nm")) facilityNm = feature.get("facility_nm");
							xeusSymbolInfraWifi.addText(feature, gid, facilityNm);
						}
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
	asset_netwk_wifi : {
		state : 'active',
		name : "WIFI망",
		group : "논리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:asset_netwk_wifi",
		LayerTheme : "asset_netwk_wifi",
		//themeCol : "cable_nm",
		themeUrl : "/netwk/getWifiCableTheme.json",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 72, 72, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			//var netNm = feature.get("net_nm");
			var connStat = feature.get("conn_stat");
			var ringNo = feature.get("ring_no");
			var color = Layers.LayerTheme.asset_netwk_wifi[ringNo]
			if(color == null) color = "#FC4848";
			var param = {
				color: color,
				width: 2
			}
			if(Number(connStat) == 12){
				param["color"] = "#5D5D5D";
				param["lineDash"] = [10, 10];
			}
			return new ol.style.Style({
				stroke: new ol.style.Stroke(param)
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

			var ringNo = null;
			if(_common.utils.validNull(val) != ""){
				ringNo = val.split(",").join("','");
			}

			if(_common.utils.isNullAndEmpty(ringNo)) ringNo = null;

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_netwk",
					col : "net_nm",
					val : "WIFI",
					ringNo : ringNo,//.split(",").join("','")
					bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
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
	asset_infra_lora : {
		state : 'active',
		name : "LORA망 산업용스위치",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_infra_lora",
		LayerTheme : "asset_infra_lora",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		//shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='green' stroke-width='2' fill='rgb(0,0,0)' /></svg>",
		shortcut : "<img src='../res/sym/nms/c29.png' style='height: 20px !important; vertical-align: bottom; margin: 0 10px;'>",
		style : function(feature, resolution){
			/*return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 128, 0, 1.0)',
						width: 2
					}),
					fill : new ol.style.Fill({
						color: 'rgba(0, 0, 0, 1.0)'
					}),
					text: new ol.style.Text({
						font: '15px Calibri,sans-serif',
						text: feature.get('cable_nm'),
						fill: new ol.style.Fill({
							color: '#CCC'
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 3
						})
					})
				})
			});*/

			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					src: "../res/sym/nms/c29.png"
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
					tbl : "asset_infra",
					facilityClscd : "LORA",
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {

					var _features = _geoJSON.readFeatures(json);
					var isVisible = GMXMAP.getLayerByName(this["name"]).getVisible();

					xeusSymbol.removeAllFeature("asset_infra_lora");
					if(xeusSymbolInfraLora) xeusSymbolInfraLora.clear();

					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var symCd = feature.get("fcl_gbn_cd");
						var mgrNo = nmsSymIcon[Number(symCd)];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var isError = false;
						if("" + feature.get("isError") == "true") isError = true;
						if(isError && parentView == "nmsView" && isVisible){
							xeusSymbol.addError(point, gid, "asset_infra_lora");
						}

						feature.setProperties({
							//"img_path" : "../res/sym/waterPump/waterPump.png",
							"img_path" : "../res/sym/nms/c29.png",
							"target_field" : "facility_id",
							"popup" : true
						});

						if(SYMBOL_TEXT_CHK[parentView]["infraLora"] && parentView == "nmsView" && isVisible){
							var facilityNm = '';
							if(feature.get("facility_nm")) facilityNm = feature.get("facility_nm");
							xeusSymbolInfraLora.addText(feature, gid, facilityNm);
						}
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
	asset_netwk_lora : {
		state : 'active',
		name : "LORA망",
		group : "논리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:asset_netwk_lora",
		LayerTheme : "asset_netwk_lora",
		//themeCol : "cable_nm",
		themeUrl : "/netwk/getLoraCableTheme.json",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 72, 72, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			//var netNm = feature.get("net_nm");
			var connStat = feature.get("conn_stat");
			var ringNo = feature.get("ring_no");
			var color = Layers.LayerTheme.asset_netwk_lora[ringNo]
			if(color == null) color = "#FC4848";
			var param = {
				color: color,
				width: 2
			}
			if(Number(connStat) == 12){
				param["color"] = "#5D5D5D";
				param["lineDash"] = [10, 10];
			}
			return new ol.style.Style({
				stroke: new ol.style.Stroke(param)
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

			var ringNo = null;
			if(_common.utils.validNull(val) != ""){
				ringNo = val.split(",").join("','");
			}

			if(_common.utils.isNullAndEmpty(ringNo)) ringNo = null;

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_netwk",
					col : "net_nm",
					val : "LORA",
					ringNo : ringNo,//.split(",").join("','")
					bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
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
	/*asset_nms : {
		state : 'active',
		name : "논리망",
		group : "NMS",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:asset_nms",
		LayerTheme : "asset_nms",
		//themeCol : "cable_nm",
		themeUrl : "/netwk/getNmsCableTheme.json",
		zIndex : 8,
		visible : true,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 72, 72, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];
			var color = feature.get("line_color");
			if(color == null) color = "#FC4848";
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 2
				})
			});
		},
		loadFunction : function(_lyr, val){
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_netwk",
					col : "net_gbn_cd",
					val : "11",
					bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _features = _geoJSON.readFeatures(json);
					_source.addFeatures(_features);
				},
				error : function(xhr, status, error) { }
			});
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]));
		}
	},*/
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
		//shortcut : "<img src='" + _common.context() + "/res/sym/waterPump/waterPump.png' class='sym-icon'>",
		shortcut : "<img src='" + _common.context() + "/res/img/pin.png' class='sym-icon'>",
		style : function(feature, resolution){

			/*return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					//src: "../res/sym/waterPump/waterPump.png"
					src: "../res/img/pin.png"
				})
			});*/

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
					/*for(var i=0; i<_features.length; i++){
						var feature = _features[i];

						feature.setProperties({
							"img_path" : "../res/img/pin.png",
							"target_field" : "user_nm",
							"popup" : true
						});
					}*/
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
	asset_blackbox : {
		state : 'active',
		name : "서초형블랙박스",
		group : "CCTV",
		fnGroup : [
 			/*LayerFnGroup.CCTV,*/
			LayerFnGroup.NMS
        ],
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_blackbox",
		LayerTheme : "asset_blackbox",
		/*themeUrl : "/nms/getBlackBoxTheme.json",
		getThemeImg : function(symCd){
			if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
			var mgrNo = blackboxSymIcon[Number(symCd)];
			return "../sym/getSymbol.do?mgrNo=" + mgrNo;
		},*/
		themeUrl : "/nms/getBlackBoxTheme.json",
		getThemeImg : function(symCd){
			if(symCd){
				if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
				var mgrNo = blackboxSymIcon[symCd];
				return "../sym/getSymbol.do?mgrNo=" + mgrNo;
			}
		},
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		//shortcut : "<img src='" + _common.context() + "/res/sym/waterPump/waterPump.png' class='sym-icon'>",
		shortcut : "<img src='" + _common.context() + "/res/sym/nms/c42.png' style='height: 20px !important; vertical-align: bottom; margin: 0 14px;'>",
		style : function(feature, resolution){

			var symCd = feature.get("status_cd");

			if(symCd != null && symCd != ""){

				var mgrNo = blackboxSymIcon[symCd];

				return new ol.style.Style({
					image: new ol.style.Icon({
						crossOrigin: "anonymous",
						src: "../sym/getSymbol.do?mgrNo=" + mgrNo
					})
				});
			}else{
				var color = "";
				var prop = feature.getProperties();
				if(prop["status_cd"] == "R") color = 'rgba(255, 0, 0, 1.0)';
				if(prop["status_cd"] == "Y") color = 'rgba(255, 255, 0, 1.0)';
				if(prop["status_cd"] == "P") color = 'rgba(128, 0, 128, 1.0)';
				if(prop["status_cd"] == "G") color = 'rgba(0, 128, 0, 1.0)';
				return new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						stroke: new ol.style.Stroke({
							color: color,
							width: 1
						}),
						fill : new ol.style.Fill({
							color: color
						})
					})
				});
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
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			if(val){
				var array = val.split(",");
				var changArr = [];
				for(var i=0; i<array.length; i++){
				    changArr.push(Layers.LayerTheme["asset_blackbox"][array[i]]);
				}
				val = changArr.toString();
			}

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "asset_blackbox",
					col : "status_cd",
					//val : "좋음",
					val : val,
					bbox : Spatial.getExtent(GMXMAP).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					/*
					R:지도 마커 빨강색(수신이상)
	                Y:지도 마커 노랑색(상태이상)
	                P:지도 마커 보라색(문열림)
	                G:지도 마커 초록색(정상)
					 */
					var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var point = feature.getGeometry().getFirstCoordinate();
						var gid = feature.get("_gid");

						var symCd = feature.get("status_cd");
						var mgrNo = blackboxSymIcon[symCd];

						feature.setProperties({
							"img_path" : "../sym/getSymbol.do?mgrNo=" + mgrNo,
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
	asset_fnms : {
		state : 'active',
		name : "물리망",
		group : "물리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:asset_fnms",
		LayerTheme : "asset_fnms",
		//themeCol : "cable_nm",
		themeUrl : "/netwk/getFnmsCableTheme.json",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 72, 72, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			var cableTyp = feature.get("cable_typ");
			var color = feature.get("line_color");
			if(color == null) color = "#FC4848";

			var param = {
				color: color,
				width: 2
			}
			if(Number(cableTyp) == 2){
				param["lineDash"] = [10, 10];
			}
			return new ol.style.Style({
				stroke: new ol.style.Stroke(param)
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

			var themeMgrNo = null;
			if(val == "all"){
				themeMgrNo = val;
			}else {
				if(_common.utils.validNull(val) != ""){
					//themeMgrNo = val.split(",").join("','");
					themeMgrNo = val;
				}
			}

			if(themeMgrNo){
				if(themeMgrNo == "all") themeMgrNo = '';
				GMXMAP.getLayerByName("물리망").setVisible(true);
				$.ajax({
					url : _common.context() + "/CableWFS",
					type : "POST",
					data : {
						tbl : "asset_netwk",
						col : "theme.net_gbn_cd",
						val : "12",
						themeMgrNo : themeMgrNo,
						bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
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
			}else{
				GMXMAP.getLayerByName("물리망").setVisible(false);
			}
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]), "all");
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
		/*themeUrl : "/nms/getLoraStateTheme.json",
		getThemeImg : function(symCd){
			if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
			var mgrNo = loraStateSymIcon[Number(symCd)];
			return "../sym/getSymbol.do?mgrNo=" + mgrNo;
		},*/
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

			/*return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					stroke: new ol.style.Stroke({
						color: color,
						width: 1
					}),
					fill : new ol.style.Fill({
						color: color
					})
				})
			});*/
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
	v_eli_stat : {
		state : 'active',
		name : "긴급재난상황",
		group : "EVT",
		fnGroup : LayerFnGroup.CCTV,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:v_eli_stat",
		LayerTheme : "v_eli_stat",
		themeUrl : "/eventCtrl/getEvtTheme.json",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<img src='" + _common.context() + "/res/sym/lyr/evt.png' class='sym-icon'>",
		style : function(feature, resolution){
			var symCd = feature.get("symCd");
			if(symCd != null && symCd != ""){
				/*return new ol.style.Style({
					image: new ol.style.Icon({
						crossOrigin: "anonymous",
						src: "../res/sym/evt/" + symCd + ".png"
					})
				});*/
				if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
				var mgrNo = eliStatSymIcon[symCd];
				return new ol.style.Style({
					image: new ol.style.Icon({
						crossOrigin: "anonymous",
						src: "../sym/getSymbol.do?mgrNo=" + mgrNo
					})
				});
			}else{
				return new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						stroke: new ol.style.Stroke({
							color: 'rgba(0, 128, 0, 1.0)',
							width: 2
						}),
						fill : new ol.style.Fill({
							color: 'rgba(0, 0, 0, 1.0)'
						}),
						text: new ol.style.Text({
							font: '15px Calibri,sans-serif',
							text: feature.get('cable_nm'),
							fill: new ol.style.Fill({
								color: '#000'
							}),
							stroke: new ol.style.Stroke({
								color: '#fff',
								width: 3
							})
						})
					})
				});
			}
		},
		getThemeImg : function(symCd){
			//return "../res/sym/evt/" + symCd;// + ".png";
			if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
			var mgrNo = eliStatSymIcon[symCd];
			return "../sym/getSymbol.do?mgrNo=" + mgrNo;
		},
		themeLoad : function(){
			Layers.LayerTheme["v_eli_stat"] = {};
			var array = _common.getCodeByGroup("C68");
			for(var i=0; i<array.length; i++){
				Layers.LayerTheme["v_eli_stat"][array[i].cdeNm] = array[i].cdeCde;
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
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			var _param = null;
			if (val != undefined && val != null) _param = {'symList':val};

			_common.callAjax("/eventCtrl/getEliLayerList.json", _param, function(json) {

				var jsonArray = new Array();
				for(var i=0; i<json.result.length; i++){
					var obj = new Object();
					var _pt = Spatial.convertProjection([json.result[i].pointX, json.result[i].pointY], "EPSG:4326", "EPSG:5186");
					obj.pointX = _pt[0];
					obj.pointY = _pt[1];
					obj.lkInfoId = json.result[i].lkInfoId;
					obj.seqNo = json.result[i].seqNo;
					obj.symCd = json.result[i].symCd;

					jsonArray.push(obj);
				}

				var jsonData = JSON.stringify(jsonArray);
				var map = xeusLayout.mapService.getMap();
				var size = map.getSize();
				var extent = map.getView().calculateExtent(size);
				var epsg = map.getView().getProjection().getCode();
				// false로 반환되는 값은 "", null, undefined, 0, NaN 이 있고
				var SYMSIZE = 40;
				if (!epsg) {
					return;
				}
				var codes = [];
				epsg = epsg.split(':')[1];
				$.ajax({
					url :  "/xeus/eventCtrl/eventmap",
					type : "POST",
					data : {
						'epsg' : epsg,
						'map_width' : Math.floor(size[0]),
						'map_height' : Math.floor(size[1]),
						'sym_width' : SYMSIZE,
						'sym_height' : SYMSIZE,
						'bbox' : extent.join(','),
						'codes' : codes.join(','),
						'list' : jsonData
					},
					dataType : "json",
					success : function(json) {
						var features = new ol.format.GeoJSON().readFeatures(json);
						_source.clear(); // jwr CCTV레이어의 모든 피쳐를 지움
						_source.addFeatures(features); // jwr json에서 geometry가 있는 모든것을

						json = null;
					},
					error : function(xhr, status, error) {
						alert("EVENT data request error occurred.. > \r\n" + error);
					}
				});
			},false);
		},
		reload : function(){
			this.loadFunction(GMXMAP.getLayerByName(this["name"]));
		}
	},
	/*v_gov_office : {
		state : 'active',
		name : "관공서",
		group : "지적 기반",
		fnGroup : LayerFnGroup.CCTV,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:v_gov_office",
		LayerTheme : "v_gov_office",
		themeUrl : "/eventCtrl/getGovTheme.json",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : Infinity,
		shortcut : "<img src='" + _common.context() + "/res/sym/lyr/gov.png' class='sym-icon'>",
		style : function(feature, resolution){
			var symCd = feature.get("sym_cd");
			if(symCd != null && symCd != ""){
				var mgrNo = govSymIcon[symCd];
				return new ol.style.Style({
					image: new ol.style.Icon({
						crossOrigin: "anonymous",
						//src: "../res/sym/gov/" + symCd + ".png"
						src: "../sym/getSymbol.do?mgrNo=" + mgrNo
					})
				});
			}else{
				return new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						stroke: new ol.style.Stroke({
							color: 'rgba(0, 128, 0, 1.0)',
							width: 2
						}),
						fill : new ol.style.Fill({
							color: 'rgba(0, 0, 0, 1.0)'
						}),
						text: new ol.style.Text({
							font: '15px Calibri,sans-serif',
							text: feature.get('cable_nm'),
							fill: new ol.style.Fill({
								color: '#000'
							}),
							stroke: new ol.style.Stroke({
								color: '#fff',
								width: 3
							})
						})
					})
				});
			}
		},
		getThemeImg : function(symCd){
			//return "../res/sym/gov/" + symCd;// + ".png";
			if(symCd.indexOf(".png") > 0) symCd = symCd.substring(0, symCd.indexOf(".png"));
			var mgrNo = govSymIcon[symCd];
			return "../sym/getSymbol.do?mgrNo=" + mgrNo;
		},
		themeLoad : function(){
			Layers.LayerTheme["v_gov_office"] = {};
			var array = _common.getCodeByGroup("C70");
			for(var i=0; i<array.length; i++){
				Layers.LayerTheme["v_gov_office"][array[i].cdeNm] = array[i].cdeCde;
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
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "v_gov_office",
					col : "sym_cd",
					val : val,
					bbox : Spatial.getExtent(xeusLayout.mapService.getMap()).toString()
				},
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {
					var _geoJSON = new ol.format.GeoJSON();
					var _features = _geoJSON.readFeatures(json);
					for(var i=0; i<_features.length; i++){
						var feature = _features[i];
						var mgrNo = govSymIcon[feature.get("sym_cd")];
						feature.setProperties({
							//"img_path" : "../res/sym/gov/" + feature.get("sym_cd") + ".png",
							"img_path" : "../sym/getSymbol.do?mgrNo=" + mgrNo,
							"target_field" : "buld_nm",
							"popup" : true
						});
					}
					_source.addFeatures(_features);

					json = null;
				},
				error : function(xhr, status, error) { }
			});
		}
	},*/
	its_link_ls : {
		state : 'active',
		name : "교통소통정보",
		group : "지적 기반",
		fnGroup : LayerFnGroup.CCTV,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:its_link_ls",
		zIndex : 7,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 4.7719663074595005,
		shortcut : "<img src='" + _common.context() + "/res/sym/lyr/its.png' class='sym-icon'>",
		//shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(252, 251, 188, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			var color = "rgba(252, 251, 188, 1.0)";
			var prop = feature.getProperties();
			if(prop.spd_grade == "0") color = 'rgba(148, 149, 149, 1.0)';
			if(prop.spd_grade == "1") color = 'rgba(53, 122, 51, 1.0)';
			if(prop.spd_grade == "2") color = 'rgba(178, 178, 35, 1.0)';
			if(prop.spd_grade == "3") color = 'rgba(158, 18, 19, 1.0)';
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,//'rgba(252, 251, 188, 1.0)',
					width: 2
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get('rn'),
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
		//style: null
	},

	mon_evet_hist : {
		name : "이벤트발생 분포도",
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

	/* 한전 */
	ecl_hpipe_l : {
		state : 'active',
		name : "온수관로",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:ecl_hpipe_l",
		LayerTheme : "ecl_hpipe_l",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 5,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(255, 94, 0, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			//var color = GmxColor[GmxColor.random()].hex;
			var color = "#FF5E00";
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 3
				}),
				text: new ol.style.Text({
					font: '15px Calibri,sans-serif',
					text: feature.get('pdia') + "A",
					fill: new ol.style.Fill({
						color: '#000'
					}),
					stroke: new ol.style.Stroke({
						color: '#fff',
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
					tbl : "ecl_hpipe_l",
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
	ecl_hvline_l : {
		state : 'active',
		name : "고압전력선",
		group : "물리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:ecl_hvline_l",
		LayerTheme : "ecl_hvline_l",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 5,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(29, 219, 22, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			//var color = GmxColor[GmxColor.random()].hex;
			var color = "#1DDB16";
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 3
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
					tbl : "ecl_hvline_l",
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
	ecl_lvline_l : {
		state : 'active',
		name : "저압전력선",
		group : "물리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTILINESTRING,
		typeName : "gmx:ecl_lvline_l",
		LayerTheme : "ecl_lvline_l",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 5,
		shortcut : "<svg height='5' width='30' style='vertical-align:middle;'><line x1='30' y1='0' style='stroke:rgba(0, 84, 255, 1.0);stroke-width:5;' /></svg>",
		style : function(feature, resolution){
			/*var cableNm = feature.get("cable_nm");
			var color = Layers.LayerTheme.asset_cable[cableNm];*/
			//var color = GmxColor[GmxColor.random()].hex;
			var color = "#0054FF";
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 3
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
					tbl : "ecl_lvline_l",
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
	ecl_bank_p : {
		state : 'active',
		name : "변압기전주",
		group : "물리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:ecl_bank_p",
		LayerTheme : "ecl_bank_p",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 1.2,
		shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='blue' stroke-width='2' fill='rgba(0,0,0,0)' /></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 0, 0)'
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
			var _source = _lyr.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "ecl_bank_p",
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
							"img_path" : null,
							"target_field" : "frm_cd",
							"popup" : true
						});
					}
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
	ecl_sw_p : {
		state : 'active',
		name : "스위치전주",
		group : "물리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:ecl_sw_p",
		LayerTheme : "ecl_sw_p",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 1.2,
		shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='red' stroke-width='2' fill='rgba(0,0,0,0)' /></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 0, 0)'
					}),
					stroke: new ol.style.Stroke({
						color: "red",
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
					tbl : "ecl_sw_p",
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
							"img_path" : null,
							"target_field" : "mthd_cd",
							"popup" : true
						});
					}
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
	ecl_pole_p : {
		state : 'active',
		name : "전주",
		group : "물리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:ecl_pole_p",
		LayerTheme : "ecl_pole_p",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 1.2,
		//shortcut : "<img src='" + _common.context() + "/res/img/pin.png' class='sym-icon'>",
		shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='green' stroke-width='2' fill='rgba(0,0,0,0)' /></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 0, 0)'
					}),
					stroke: new ol.style.Stroke({
						color: "green",
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
					tbl : "ecl_pole_p",
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
							"img_path" : null,
							"target_field" : "knd_cd",
							"popup" : true
						});
					}
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
	nk_ecl_ring_as : {
		state : 'active',
		name : "링구분",
		group : "물리",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.MULTIPOLYGON,
		typeName : "gmx:nk_ecl_ring_as",
		LayerTheme : "nk_ecl_ring_as",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 5,
		shortcut : "<svg width='30' height='20' style='vertical-align:bottom;'><rect width='30' height='20' style='fill:rgba(0, 0, 0, 0);stroke-width:4;stroke:rgba(95, 0, 255, 1.0);'/></svg>",
		style : function(feature, resolution){
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(95, 0, 255, 1.0)',
					width: 2
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 0, 0)'
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
					tbl : "nk_ecl_ring_as",
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
	asset_light20190131 : {
		state : 'active',
		name : "보안등",
		group : "시설물",
		fnGroup : LayerFnGroup.NMS,
		url : LayerConst.URL,
		type : LayerConst.POINT,
		typeName : "gmx:asset_light20190131",
		LayerTheme : "asset_light20190131",
		zIndex : 8,
		visible : false,
		selectable : true,
		minResolution : 0,
		maxResolution : 1.2,
		shortcut : "<img src='" + _common.context() + "/res/img/c47.png' class='sym-icon'>",
		style : function(feature, resolution){
			return new ol.style.Style({
				image: new ol.style.Icon({
					crossOrigin: "anonymous",
					//src: "../res/sym/gov/" + symCd + ".png"
					src: "../res/img/c47.png"
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
					tbl : "asset_light20190131",
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
							"img_path" : "../res/img/c47.png",
							"target_field" : "등기구종류",
							"popup" : true
						});
					}
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
	}

}
