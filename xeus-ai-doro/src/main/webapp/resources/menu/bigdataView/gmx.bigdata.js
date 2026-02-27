/**
 * 산업용 스위치의 Context Menu 를 생성합니다.
 */
"use strict";

if(window.GMXBIGDATA == null) var GMXBIGDATA = {

	/**
	 * 스위치 레이어의 Context Menu 를 생성합니다.
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
				return ('' + a.getProperties().facility_nm).localeCompare(b.getProperties().facility_nm);
			});

			for(var i=0; i<featureList.length; i++){
				if(i < 10){
					var prop = featureList[i].getProperties();
					var center = featureList[i].getGeometry().getCoordinates();
					var facilityNm = prop.user_nm;
					if(facilityNm == ""){
						facilityNm = "민원인없음";
					}

					itemList.push({
						text: facilityNm,
						data: { "layer" : layer, "features" : featureList[i] },
						classname: "contextMenuItem-cctv",
						callback: function(_item){

							var prop = _item.data.features.getProperties();
							var mgrSeq = _item.data.features.id_.split(".")[1];



							_common.callAjax("/bigData/getAddView.do", {mgrSeq : mgrSeq, isContextMenu : true}, function(view) {

								$("#bigdataMngWrap").dialog("destroy");
								var $bigdataMngWrap = $("<div>").attr("title", "민원 객체 정보").attr("id", "bigdataMngWrap").addClass("table_style").addClass("customScroll");


								$bigdataMngWrap.html(view).dialog({
									width: 650,
									height: $("#body").height(),
									position: {
										my: "left top",
										at: "left top",
										of: $("#body")
									},
									open: function(){

									},
									close: function(){
										$bigdataMngWrap.dialog("destroy");
									}
								}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
							}, false);

						}
					});
				}else{
					var limit = 10;
					itemList.push({
						text: "<b>총 " + (featureList.length - limit) + "대의 겹침 산업용 스위치 중 " + limit + "대만 표시합니다</b>",
						classname: "cctv_selected_count"
					});

					break;
				}
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
				a = feature;
				if(feature != null) GMXMAP["contextMenuVector"].getSource().removeFeature(feature);
			});
		}
	}
}