<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page session="false" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
<link rel="shortcut icon" href="./res/img/geomex.ico">
<link rel="stylesheet" href="./common/ol-v6.4.3/ol.css?c=<%= DateUtil.getStrMilSec() %>">
<script type="text/javascript" src="./common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="./common/string.js"></script>
<script type="text/javascript" src="./common/Date.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./common/ol-v6.4.3/ol.js?c=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./common/proj4js-2.4.3/proj4.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./common/spatial.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.map.config.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./res/GMT/tile/gmx.gis.daum.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">
$(document).ready(function(){
	var daumMap = new DaumMap().createMapLayer({ lyrNm : "daum", visibleYn : true, lyrZidx : 1, grpNm : "배경지도" });

	var cctvTheme = null;
	_common.callAjax("/sym/getLyrSymList.json", {"lyrNm" : "asset_cctv"}, function(json) {
		if(json.result){
			cctvTheme = {};
			for(var i=0; i<json.result.length; i++){
				cctvTheme[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
		}
	}, false);

	/**
	 * CCTV 레이어를 생성합니다.
	 */
	var cctv = new ol.layer.Vector({
		name : "cctv",
		visible : true,
		zIndex : 1,

		source : new ol.source.Cluster({
			distance: 10,
			source: new ol.source.Vector({
				strategy : ol.loadingstrategy.bbox,
				loader : function(extent, resolution, projection) {
					var _source = this;
					var _format = new ol.format.GeoJSON();
					var _wfsParam = {
						service : 'WFS',
						version : '1.1.0',
						request : 'GetFeature',
						typename : "gmx:asset_cctv",
						outputFormat : 'json',
						srsname : "EPSG:5186",
						bbox : extent.join(',') + ',EPSG:5186'
					}
					$.ajax({
						//url : "../../CustomWFS",
						url : "./GMT_proxy/wfs",
						data : _wfsParam,
						dataType : 'json',
						beforeSend : function() {
							_source.clear();
						},
						success : function(data) {
							$("#errMsg").hide();
							var features = _format.readFeatures(data);
							_source.addFeatures(features);
							data = null;
						},
						error : function(xhr, status, error) {
							$("#errMsg").show();
						}
					});
				}
			})
		}),
		style : function(features){
			var url = "./res/sym/cctv/99.png";

			if(cctvTheme){
				var list = features.get("features");
				//if(list.length == 1) url = "../../sym/getSymbol.do?mgrNo=" + cctvTheme[list[0].get("gbn_cd")];
				if(list.length > 10) url = "./sym/getSymbol.do?mgrNo=" + cctvTheme["XX"];
				for(var i=2; i<11; i++){
					if(list.length == i) url = "./sym/getSymbol.do?mgrNo=" + cctvTheme["X" + i];
				}
			}

			return new ol.style.Style({
				image: new ol.style.Icon({
					anchor : [ 0.5, 0.5 ],
					size : [ 40, 40 ],
					scale : 0.7,
					crossOrigin: "anonymous",
					src: url
				})
			})
		}
	});

	/**
	 * 지도 객체를 생성합니다.
	 */
	window.map = new ol.Map({
		controls : ol.control.defaults().extend([ new ol.control.FullScreen() ]),
		renderer: "webgl",
		logo : false,
		target : "map",
		layers : [ daumMap, cctv ],
		interactions: ol.interaction.defaults({
			dragPan: false,
			pinchRotate: false,
			mouseWheelZoom: false,
			altShiftDragRotate: false
		}).extend([
		    new ol.interaction.DragPan({ kinetic: false }),
		    new ol.interaction.MouseWheelZoom({ duration: 0 })
		]),
		view : new ol.View({
			projection : ol.proj.get("EPSG:5186"),
			center  : _GMXMAP_DEF_CENTER_,
			zoom    : _GMXMAP_DEF_ZOOM_,
			minZoom : _GMXMAP_MIN_ZOOM_,
			maxZoom : _GMXMAP_MAX_ZOOM_
		})
	});

	/**
	 * 지도 클릭 이벤트 입니다.
	 */
	map.on("click", function(evt){
		/**
		 * 클릭 지점 팝업 이벤트 입니다.
		 */
		var hit = map.forEachFeatureAtPixel(evt.pixel, function(features, layer){
			var result = new Array();
			var list = features.getProperties().features;
			window.a = list;
			if(list.length > 0){

				list.sort(function(a, b){
					return ('' + a.getProperties().cctv_nm).localeCompare(b.getProperties().cctv_nm);
				});

				for(var i=0; i<list.length; i++){
					var prop = JSON.parse(JSON.stringify(list[i].getProperties()));
					delete prop["geometry"];
					result.push(prop);
				}

				try{
					_Flutter_Cameras.postMessage(JSON.stringify(result));
				}catch(e){

				}
			}
		});
	});

	$(".ol-full-screen-false, .ol-full-screen-true").text("");
});

function web2flutter(msg){
	try{
		web2flutterChange.postMessage(msg);
	}catch(e){}
}

function flutter2web(asdf){
	alert(asdf);
}
</script>
<style type="text/css">
html, body { width: 100%; height: 100%; margin: 0; padding: 0; }
.hidden { display: none; }
#map { position: relative; width: 100%; height: 100%; margin: 0; padding: 0; }
#map #customBtnWrap { position: absolute; bottom: 8px; right: 8px; z-index: 1; background-color: rgba(255,255,255,.4); padding: 3px; color: white; font-weight: bold; border-radius: 5px; }
#map #customBtnWrap #locationBtn { position: relative; width: 100%; background-color: rgba(0,60,136,0.6); border-radius: 5px; border: 2px solid rgba(0,60,136,0.6); color: white; font-weight: bold; outline: none; }
#map #customBtnWrap #searchBtn { position: relative; width: 100%; background-color: rgba(0,60,136,0.6); border-radius: 5px; border: 2px solid rgba(0,60,136,0.6); color: white; font-weight: bold; outline: none; }
</style>
<title>시설물 지도</title>
</head>
<body>
	<div id="map"></div>
	<button id="web2flutter" onclick="web2flutter(1)" style="position: absolute; z-index: 99; top: 20px; left: 20px;">A</button>
	<button id="flutter2web" onclick="flutter2web(asdf)" style="position: absolute; z-index: 99; top: 20px; right: 20px;">B</button>
</body>
</html>