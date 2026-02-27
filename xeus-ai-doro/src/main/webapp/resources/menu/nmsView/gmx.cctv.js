/**
 * CCTV 재생과 관련된 객체입니다.
 * 기존 xeusCCTV.js 기능을 대체합니다.
 */
"use strict";

if(window.GMXCCTV == null) var GMXCCTV = {

	getXeusGateURL : function(){
		var url = "ws://" + location.host + "/xeus-gate/stream";

		return url;
	},

	/**
	 * CCTV 레이어의 Context Menu 를 생성합니다.
	 *
	 * @param layer
	 * @param features
	 * @returns {___anonymous390_430}
	 */
	createContextMenu : function(layer, features, evt){
		var itemList = new Array();

		if("features" in features.getProperties()){
			var featureList = features.getProperties().features;
			featureList.sort(function(a, b){
				return ('' + a.getProperties().cctv_nm).localeCompare(b.getProperties().cctv_nm);
			});

			for(var i=0; i<featureList.length; i++){
				var prop = featureList[i].getProperties();
				var center = featureList[i].getGeometry().getCoordinates();
				//var mgrNo = featureList[i].getId().split(".")[1];
				var mgrNo = prop.mgr_no;
				var cctvNm = prop.cctv_nm;
				if(_common.utils.isNullAndEmpty(cctvNm)) cctvNm = "CCTV 명칭 없음";

				itemList.push({
					text: cctvNm,
					data: featureList[i],
					classname: "contextMenuItem-cctv",
					items: [{
						text: "정보 관리",
						data: { "layer" : layer, "features" : featureList[i] },
						callback: function(_item){
							var prop = _item.data.features.getProperties();
							var mgrNo = prop.mgr_no;

							if($("#cctvMngWrap").length !== 0){
								if(confirm("지도에서 선택된 CCTV의 정보를 불러오시겠습니까?\n\n현재 수정중인 내용은 저장되지 않습니다.")){
									$("#cctvMngWrap").dialog("destroy");;
								}else{
									return false;
								}
							}

							_common.callAjax("/cctv/getCctvMngView.do", {mgrNo : mgrNo}, function(view) {
								if($("#cctvMngWrap").length === 0){
									var $cctvMngWrap = $("<div>").attr("title", "CCTV 정보 관리").attr("id", "cctvMngWrap");

									$cctvMngWrap.html($("<div>").addClass("table_style").addClass("customScroll").html(view)).dialog({
										width: 650,
										height: $("#body").height(),
										/*resizable: false,
										draggable: false,*/
										position: {
											my: "left top",
											at: "left top",
											of: $("#body")
										},
										open: function(){

										},
										close: function(){
											$cctvMngWrap.dialog("destroy");
										}
									}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
								}
							}, false);
						}
					},{
						text: "정보 보기",
						data: { "layer" : layer, "features" : featureList[i] },
						callback: function(_item){
							GMXMAP.createSingleFeatureInfoDialog(_item.data.layer, _item.data.features);
						}
					},{
						text: "위치 이동",
						data: center,
						callback: function(_item){
							GMXMAP.addPulse(_item.data, true, 3);
						}
					}]
				});
			}
		}

		return itemList;
	},

	/**
	 * contextItem Mouse Hover 효과를 지정합니다.
	 * Angle 값을 이용하여 촬영 각도 등을 표시합니다.
	 */
	setContextHoverEvent : function(){
		var $contextItems = $(".ol-ctx-menu-container").find("li[class*=contextMenuItem]");
		if($contextItems.length > 0 && GMXMAP["contextMenuVector"] != null && GMXMAP["contextMenuVector"] instanceof ol.layer.Vector){

			var feature = null;
			$contextItems.hover(function(){
				if($(this).data("contextItem").data instanceof ol.Feature){
					feature = $(this).data("contextItem").data.clone();

					var prop = feature.getProperties();
					if("angle" in prop){
					
						var angle = Number(prop.angle);

						if(angle != -1){
							angle = angle * Math.PI / 180;
						}

						if(angle > -1){
							feature.setStyle(new ol.style.Style({
								image: new ol.style.Icon({
									src: "./res/sym/cctv/area3.png",
									rotation: angle,
									anchorXUnits: "fraction",
									anchorYUnits: "pixels",
									anchor: [0.5, 90],
									scale: 0.5
								}),
								zIndex: -1
							}));

							GMXMAP["contextMenuVector"].getSource().addFeature(feature);
						}else{
							feature = null;
						}
					}else{
						feature = null;
					}

				}
			}, function(){
				if(feature != null) GMXMAP["contextMenuVector"].getSource().removeFeature(feature);
			});
		}
	}
}