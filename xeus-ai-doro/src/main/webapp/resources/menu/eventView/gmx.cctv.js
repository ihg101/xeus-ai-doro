/**
 * CCTV 재생과 관련된 객체입니다.
 * 기존 xeusCCTV.js 기능을 대체합니다.
 *
 * @author 이주영
 */
"use strict";


if(window.GMXCCTV == null) var GMXCCTV = {

	/**
	 * XEUS-PLAYER Codec 정보입니다.
	 *
	 * h264 또는 mjpeg 두 가지 중 선택할 수 있습니다.
	 */
	Codec : "h264",

	/**
	 * 미리보기 기준 초 입니다.
	 */
	PreviewTime : 60,

	/**
	 * 선영상재생 기준(분) 입니다.
	 */
	PlayTime : 1,

	/**
	 * 단독모니터링, 그리드모니터링, 투망모니터링에서 현재 재생중인 CCTV 리스트 정보입니다.(mgr_no)
	 */
	PlayingCctvList : [],

	/**
	 * 선영상재생 기준(분) 입니다.
	 */
	init : function(){
		_common.callAjax("/sysMng/getSysParam.json", null, function(json){
			var data = json.result[0];
			if("cctv.previvew.play.time" in data) GMXCCTV.PlayTime = Number(data["cctv.previvew.play.time"]) * 60;
		}, false);
	},

	/**
	 * GATE Web Socket URL을 리턴합니다.
	 *
	 * @returns {String}
	 */
	getXeusGateURL : function(){
		var _GATE_URL_ = location.host;

		var hostname = location.hostname;

		/* 폐쇄 */ if(hostname.contains("101.102.104.")) _GATE_URL_ = "101.102.104.114";
		/* 행정 */ if(hostname === "172.27.143.199") _GATE_URL_ = "172.27.143.199";
		/* 소방 */ if(hostname === "98.22.24.60") _GATE_URL_ = "98.22.24.60";

		/* 개발 */
		if(hostname.contains("10.1.73.")) _GATE_URL_ = "101.102.104.114";
		if(hostname === "127.0.0.1") _GATE_URL_ = "101.102.104.114";
		if(hostname === "localhost") _GATE_URL_ = "101.102.104.114";

		return "ws://" + _GATE_URL_ + "/xeus-gate/stream";
	},

	getXeusGateAPIURL : function(){
		return this.getXeusGateURL().replace("ws:", "http:").replace("/stream", "");
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

			var isPreview = false; _common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVIEW" }, function(json){ isPreview = json.result; }, false);
			var isPreviewRequest = false; _common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVREQ" }, function(json){ isPreviewRequest = json.result; }, false);
			var isPlayWarn = false; _common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVWARN" }, function(json){ isPlayWarn = json.result; }, false);
			var isPlay = false; _common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVQTIME" }, function(json){ isPlay = json.result; }, false);

			itemList.push({
				text: "<b>단독</b> 모니터링 시작",
				data: featureList,
				callback: function(featureList){
					var data = featureList.data;
					if(data.length > 0){
						var prop = data[0].getProperties();
						//var mgrNo = data[0].getId().split(".")[1];
						var mgrNo = prop.mgr_no;
						var cctvNm = prop.cctv_nm;

						if(isPreviewRequest){
							GMXCCTV.createPreviewRequest({ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPreview" : isPreview, "isPlay" : isPlay });
						}else{
							GMXCCTV.createSinglePlayer({ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPreview" : isPreview });
						}
					}
				}
			});
			itemList.push("-");

			itemList.push({
				text: "<b>투망</b> 모니터링 시작",
				data: { "center" : evt.coordinate, "feature" : featureList[0] },
				callback: function(_item){
					var gid = _item.data.feature.getProperties()._gid;
					if(gid == undefined){
						gid = _item.data.feature.id_.split(".")[1];
						if(isNaN(gid)) gid = undefined;
					}
					var lonlat = Spatial.convertProjection(_item.data.center, "EPSG:5186", "EPSG:4326");
					var netData = JSON.stringify({"gid" : gid, "srid" : "4326", "lon" : lonlat[0], "lat" : lonlat[1], "isNet" : true});

					if(isPreviewRequest){
						netData = JSON.parse(netData);
						netData["isPlay"] = isPlay;
						GMXCCTV.createPreviewRequest(netData);
					}else{
						GMXCCTV.startNetMornitoring(netData, isPreviewRequest);
					}
				}
			});
			itemList.push("-");

			itemList.push({
				text: "<b>그리드</b> 모니터링 시작",
				data: featureList,
				callback: function(featureList){
					var data = featureList.data;

					var cctvData = new Array();
					for(var i=0; i<data.length; i++){
						if(i < 30){
							var prop = data[i].getProperties();
							//var mgrNo = data[i].getId().split(".")[1];
							var mgrNo = prop.mgr_no;
							var cctvNm = prop.cctv_nm;

							var item = { "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPreview" : isPreview };

							if(isPreviewRequest){
								item["isPlay"] = isPlay;
								cctvData.push(item);
							}else{
								GMXCCTV.addGridPlayer(item);
							}
						}else{
							GMXMAP.addMapNotification("* 총 " + data.length + "대의 선택된 CCTV 중 30대만 재생합니다.", 3000);
							break;
						}
					}

					if(isPreviewRequest) GMXCCTV.createPreviewRequest(cctvData);
				}
			});

			itemList.push("-");

			for(var i=0; i<featureList.length; i++){
				//if(i < 10){
					var prop = featureList[i].getProperties();
					var center = featureList[i].getGeometry().getCoordinates();
					//var mgrNo = featureList[i].getId().split(".")[1];
					var mgrNo = prop.mgr_no;
					var cctvNm = prop.cctv_nm;
					if(_common.utils.isNullAndEmpty(cctvNm)) cctvNm = "CCTV 명칭 없음";
					prop["mgr_no"] = mgrNo;

					var subItems = [{
						text: "단독 재생",
						data: prop,
						callback: function(_item){
							var mgrNo = _item.data["mgr_no"];
							var cctvNm = _item.data["cctv_nm"];

							_item["isPreview"] = isPreview;

							if(isPreviewRequest){
								GMXCCTV.createPreviewRequest({ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPlay" : isPlay});
							}else{
								GMXCCTV.createSinglePlayer(_item.data);
							}
						}
					},{
						text: "그리드 재생 목록에 추가",
						data: prop,
						callback: function(_item){
							_item["isPreview"] = isPreview;
							var mgrNo = _item.data["mgr_no"];
							var cctvNm = _item.data["cctv_nm"];

							if(isPreviewRequest){
								GMXCCTV.createPreviewRequest({ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPlay" : isPlay, "addGrid" : true});
							}else{
								GMXCCTV.addGridPlayer(_item.data);
							}
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
					}];

					itemList.push({
						text: cctvNm,
						data: featureList[i],
						classname: "contextMenuItem-cctv",
						items: subItems
					});
				/*}else{
					var limit = 10;
					itemList.push({
						text: "<b>총 " + (featureList.length - limit) + "대의 겹침 CCTV 중 " + limit + "대만 표시합니다</b>",
						classname: "cctv_selected_count"
					});

					break;
				}*/
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
									src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABWCAYAAABcvcGNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkZBOTcxNzQ4MDI2MTFFOUI4MjFEMkMxRUE0RUVFQTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkZBOTcxNzM4MDI2MTFFOUI4MjFEMkMxRUE0RUVFQTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RURCNjlCRjlGQ0VFMTFFOEI0OURGQ0IzQTQzQjZGQTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RURCNjlCRkFGQ0VFMTFFOEI0OURGQ0IzQTQzQjZGQTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz51/V5TAAAjzUlEQVR42ux82Y8d15nfd86puntvXJpsaqNkWVu8yKPYsMeaGcQzMYIMMhkkSF6CeQ3yD+Q5/0Je8xAggIMgQGYQxJjAhh9sS/IiawslixRJSRSXJtn7cvsutZwl31aXbVm2JXFFkGo02bdu3apzfudbft9yrknf/Db81mFqiL0F/jM5C1f+5AWYfOVxPO3l/V4LbuLvyZtDfrl9agHGycK3/tsP+fXVf/NPYQ0CPP3yr/n1qV+egRvfeh4Ovv0lGFrHTxhD5NsXvS4EZ+Cv/sN/otd29RvPQ2v/IK28+ja+CxCWeomu3/3Cadh84VnI13fhyb/7MZ/b/sbTfI9X/uYvIa8jZL6EAY5jPiWw1zcB5nr8/MtH56AbPByFDOZefofPvfenX4J+SHD65zLGCy9+GXKTYOXqJr/eeHQZnv67l/nvnReeguf+4/f47+KLj/H/nRubvwFZBnf/MPrLR8SfSUomIKCxNXu8+cG//xvTiwHmUm62Uw2v/evvJHAObB2MK0bQSwa6kMPBY0fhwp98JdmqBt/Ooey2Y1bWzX3Sx56dPuHcXTnuBpC2+ePdf/S8QYm2v/7z543vdCCwNCKmKYCT6dlobXJgTHn0CEx7vbRt8UWIxhYlgPcQ8HP++LE0tQZS9GAmY7Ael2NukGhZTAjWd9oQWjG51IYJSRMuSNssQ7SQ6n4ntKblYZANr+cDCOQMuJf+7V/jdK2t8xyH6hGlgEDmxhgLOU6+W/rUiQY6KGkti+eii238RF5UKSun4PwkuZjwupS6B1PIUerqNuKZOeOzHFBjU91ypmq1wPc9Lk4OtctgYgKM6gqqZE2ZOUi2ZarlAeJeGhOjrfsZ+BjTMASYf/FZqHFJFMz0OyT5ngDZqKpZXVm0AYKZzg+AAMgDShPOtuu96ZuQFkw3dUNI+biC+e1pmhuiUmfRGHDGRSMTCPSvzilv4YhQViMJG65P1jZ5SgntX4KK7DMa04lPYEoDN9HA+TrFhPezmTEtFxmOmFLZbpmD+a4dz7dhPJfDhh/BFC+LCPLOyeMAVW1dWVnEFs5+5wVcHhxWXcfbMQfZJ4CUPvZ69nea69nrHWuKbg/P48Byizdw5giqzkKWp/mUpfbaEI5uD1MHp2iDIdDkfiiVQC+naOyyKK9RMxk0lmu8ZaBf/CfxL3qM3PAQDJqEGl+nyuDLxMAbwx+ySeftExmFRGC3fUrtnXE6trZD94PnXE6XxmmezOZDS6Zc6sM2mheUUFPkztDK+TyzVVkk/8jxFG2Gzwjxs0gr4qBYtmcfwsnWMHrkKFz959/Bhy6ZHbRQ+wsDA62WyccFdHDx5jILxwuTOhsH6fgmAlfrhAwiQiBZMmp8N/whCfMCGk08ojgSOICgRgWVXqPXFalCIEm+HP7vUEpRGSGgJCY2sAiwo8/oBDPDwBLQzoo0o5rj9bz2kGViffCe3RLioxfXU0Cj/IShu9q0trwIByfmzDAWZoyAXzg2sAbv1RlN7Dv/8sW4UqDtXdsCNQVmhtHHQDbp23/G/6994zm+YHh6xUyef8rcNNH4dtt6XDHjo5mvy3QqQ5+KtuvER5tpMC1RLUk/LU02iUjhs/IGIJI2Lw+0VgBOusikts7IdTRhAoYmTCDTPUPjhZ2OUj+XdNz0PF6mpItAi+PIROCY8JmpATEn0Mlso3fCe3pabZROZAXICBJLNf3ieyU+fjTowc7DR8wmfmzXCnK+7Wj90pHhQTx2eSt1VzfTEy+9inwMqR/5AgXTpH/8FzzVc8j9ysdWzLU2LjU6iBxpRwdvdcp0obU7Tstr+2kwosEEAcWK9+WJ8ApFO1NhAVKekXimhLNhwFAHWUSsvQWOyWXBkxHJpfs2oFmVVrR9IslJzrF84gtLEm9UYvB8oAVElaHxOXpGJqqSasP3oGtSYrvI17QylnNkCInnRhqNCzJcHMD6V0/ZLTQNe+g4xwiyxXXq7x7EFY92//3V9NhLr6fe6jrPwvzof/9nOz+YsztQ2qrTgzYCeNzmsHhQpiPXttMSOgi8DKWuTQ8wAg7ao6RqyoPF0ZEP4XEmfa0qStcTgGjOeOIEBoFK90wiOAxEUODNIckjs8CqTUCglPmoIOqzjdpWeqilX4YzMWCmsaP0TFoYK2AbRIPHFsmxAUsr21Yj5iAGWSDHdtIg70jbywtm9+Els4WX7uFAaRUcOtGHD8o49/YH/Nr8l7f+Z2vpYGIeNW3obAxhburTyc296AKI3Bt10gKUYeAMjsqz+uhr1gOHqmPY6xqZIqsZGPXxppFAKxAxqHb2Pt0/4CSzxq5atYVOJVullB083SLIIrC0uyj/g6h848B0Vfm+dNKSBFsFmwAjwBtbG3VVXbq1Ukmkl8aKkjmab9u1x5dhfZCnSahMRZBkeTxo2ZgVhY/zdbIrZy/BiasopnPzAN2u5VWkibIzwk+gnWQJyjNBNtD6e1FHej/g7GIS0SK7RG8IpGY2TlZNkmon9rJC4JEX6mQMT6ROor5Z4zQDL7gsgkkiwaTmlmywmma6Bn+QryN2UT+W2A7yj36GziUrqi62OfL9mQmAgqargMSTx5yTYARehMFBlZ5893p6HLHZXOia4cOL8GEfbDW/CNkf/+IKE7QTNzcdr1ZVGV5yq06DH0CDDpZpCZDUZWIjCczaqxMxImnBiqNh8IJKHHlW+ryHmUdnb02SjcDnVlYf/K3PkmpVai9JKunuHgQIQ+dIRfF8HmBmbAMLpoJCUhflr2gEjKQenyQz4AA8jglpET+L7atP6pMDjkOEiUw6Sh3fg0DH+bqqSid3D9LJSzeh+tozsD0IMdspORGRdnoDOFLXqI54cwIz74iDIKmklSd+Z2hG6kltIBBto4gMMkkiSa5lj20ZYHYWeG2g+5AwMuURGkHg3grZLNtgtm94mhIkvhK7SxNllQxi2wxJiRNA66De1wqQJLIEMr+uyRZHlmQinARGrEV9E92IiT/Z3zgDncQjofFkpoDnaryezBhpJgsaOrJyKs7AtdPc6l54HClStifOAj5Ele3Wle16XGZSOZpgixyMaaQRgUtWKDyCRDY0kBqSN1a752u1gYQEvWcFYLqmcT4zc9HwSaVmpGDyOjFYqZFmkiBckTqInRQqicDUt5wJeJiFfKaxjYkAoIUQZ8JmAb0F2Ut+BvFO9vwkmWTfg0grnUWDiGEsS2gIxAAcjY4XGUNZIOHDhdmdn/M7GLr29qYpG3txl6v4uxBC9lRdkh1zQEkD5mBOHAepAYFUk3RZAcc44ZFBiSFJlHh0I8sXRO35DtbO3iNASL2YRyaNbsh+4STofMMAjKpq3fBg9sTikdkmqns3SS4wSjh52cRMS4RkxTP5IK/J/bMzIxCjfAZ5N2pRFMLPY41sUyNrijyTpNbXpBpxknXiaqdtsrLkz2eTyYSBxH/DJdSVE2A6CyQGBE6JQLSTEhE6x6roQFkQOO+UxxEJNsqgRZoJVKXjYh6igMkOiQh3LiCQFAby/goBw8khn2HvTJMAJe/AEqsSloTzsbNxIolCxKOQ9RiFDjE2RHuC2nqys/iagOLLg9Af9uWyegHfE68eZTUJUHx+gWpOcT9q8Q2M7TeqcZiFiK16lssLG3izazYzC+XEIY3JoRjh8BDJPBepFBbtZIDJiudGtYjCPZSUWyXSlsl4bJ7lrJJ0y5jYIF6WzASpKmV3LZv5RjVFmpNKmyxEE40kJtD0XiCzHTVhYTQOZ4CZ5MhiGQI1RzkR9feUBXZJr89INJhPJgUzMniRTQqPGp9LkutLNg9oNs26yerdZGbpuMzaw3kJKG+2s9ZKyFtHyypDNRBjxrTAicSR7YrietmhBAXPWLV9IKob2OtZIX1JnIFRr5xUammVg5LqLMjfJGmV8k6xEDO5Fi5Mz6pFysTRRZm+mgq2EqTCzrPTaRYCH8AUiMFNSaVRHI1HEIkKpcbhoL0kMOm+Ob5X4+uqkuiqk/uddjugbwndlNItIJ07DGTcxLtcw8hmLkxNy/gMaiehnWPi7FhNDUuiAMoDTaLSvEA8GasOwIldJE+ekqa5xDFFBaqJlcl0BUonKFmnmyWnEqaAs7OJwgbIcVj9IDkQq8Q6zYh0JuQ8isOJSaXMCmCpTqAukN/3ldgBw5LsmABl7IgCqjTiQLTP+FhWaXWxV3cpy3w4+zOsio9nhIrz0fuFdsc8Xk7RuVBqFYHppMCOJyDyqWomTIN0ysodr1gKQtaNhoJiT0V6QTmpUQfjXJSEA0csVqTtcPKauSKePeTNCcgotoUnKnGz2FbDMmvYnPD1yinFzAVJULCUkrqKF7Z6nrlUknM8GuuZs5LGkYMhp4gx9uWluXrVufrjWfYsFtXHgUx7KY0+SrDwaEo5WrYuTAuqBniM/2mgOUsO0SZrhOoE/MVxcU5QglaJdJJVZ5DEswtVMrPkaST7Souh4DbZIfXB4rCiKC8Dk8RmNkB5KxLLEaMnQLJZnB4bz53EjWSsHSqxdMaL7fR4A4qACNDEEVIA0amM5+xrnC861RTDdrdfrHY71VIIvyV9WXDmt4DEO5XbMY13Slg6njnilW0kyI7Vh20cGmgi6JBLFETqSuebZIRLSidmPjyy12c+isA4NvSS6bHKxzVvwGRZ1DFTYHFSlKFBRxFMk/yDWZKBEx4MXk7VHgGBo64I8pDmmnBrAZu8Jl6Fto4DjmQykUjKGjghrB7nXNZWF6fYaLf8rnXFJyZ2W7X/pPNhB2B0zpjyH07Kbp8zLrGDoh1FHXG10IJI3tDYWSKC5JX5JKserqK3qjZRqY0R0IPE06AZcstyINEKvcfOKKgp4Ix44tfJNrkIIw6wUTBNwSVcLIvimqkkisOSeFvsgcbenGMLEvfzXIQGsTGgkJGDgwy5tGVSb105tJldNW7SG0+mnwhkMS1+V/Z8eAZgN8vy/jfqCgmQ6SCrx2gnryUOZz6pHhskM8RZoKg1A5CJMW2ZZZVvcUxSd2ub5DDhfwiwZJVgC2MIei37bDIbtHg+zbI+kp4S3kdK7JPaR/qc8gThiJpio4CAxkh2Mgi3pIWn+1mOYAxz5rJqU8khosBcWJjf2oQ0+p2lhg0ffl8pYvtSyy0+YaC/UpUtfABKpamgg/yDbGRSgj7Ln3Cqy4lh5KjCsIdvsje/maCnwUqukz29OhO6JhjNRZpb10dNIgfNbyTlrVFzTExzY5rVgYQXJmUZhrkgA50kxg5oOrxGQzPpRg8tXt2wH0ixjeBWa5kL7+d2L5XT6e8Ecjn/vYXE8U6K+zfBHF+eVtFlSBQt8ktwE/WWGKMmNyPKLKFekvTOqicOZlaxNRqtNAltaPKUxElDlPSYRjFkDYK7ZRMbfnhrRcQjs10jsKLaXVogzqQ3Eh3F288ydSKtPLok3DAxLUoSLKAXCkh3Kp+TGUNmVV/q9rYPjNtXuvTJQI7/cK18872UVo52W/OPVXWJkxugrexD7kqJbJikG7WDlsE1UhadOYWo9lBsGxpxTYlbSU1K+ouTxFEARgQppDVRc7M0WQWJmYCGgiJ1ObMFHkkU/mkkQpRySMpmYk3mIKnddJoNSurhjdKg2qMJC6h9yKFde7zWbY/XbbZzLMD491YRq/gHgSw+gnBjMZnlU7jWuTM5TKoudDIkCFkthJsD+0xItxH7R+g5I0SCMy9B1zNIeo5tJQLBvo7esxKl0KKQQ+Kog0Izzhkeqj8EicPJWbgkvFOiLq0yUtSuCW7PH8TlpribGYWVRSUzovF2bPivUeKPklhPesQUQl2MLnfz0Vo12f6D5Vjzh6u2SFrc1pqv17bBPnOSJaygVaPs0FhXPxObqKoaVaqChuhB7DxLDSdVkxD1TPWcJQ3D0RIlJtdCDE84SHIi6mfZjnJUhKBTeIqiyebYs4uQrFRSr64hoLAF4Dyp2M4gmZwkvFJKHSrxbKcpEUt89OBytzt5P/iNPnAnzO8HcvDpegome3m+diH6h5cm0047Mz1+YF1FaGUFUE8KeUu2PlENN9Efo5JQK3Vx4oVJMizTGTFes5wnAuFBaEnQkJM5p6Yf7KwaBBzGJXI2mWRmNMEpuc9o1OZFXjRJnkhzgTFGzxHfDJKCY2KOJqJASlf1IO9Mi2Trd7N8bT35rU/VILAzqyH/wWP1Z6FcRhHufKvwbdtqLyFRH/DgaLLcIYH2yGqMJ95YeFi0aqfIK0Y7yxaRGjslfEmMIJsKllCOgiSkkyy2en4rDJuxo7i7OuSNNPbnhfFRShp0/cwEkKI7GZuXgl1TRaS2gSrMMbG3vric5ZMbKd7Ax08/FZDb4/GnBTKioVg75/LjX2y1O8smLkEdezyIFkxVBSX25rIAAUKqFkSyOAHB0Y5GCkGIcWAnIcCzp23e59JE0mqhUCSvnt/GhnBr2cIKmC7eIle0qFzgsmmW7KXyApuHpHJN12ceF5MksY1jxbDQVsOqmnxg89Xtut74tJ1r2WPZZ+qjWt2CtHzDuuPLVUUrgLwSY3HOTFIgz6VMCgUznpiNh5ij1mxmoaA6DtCaNmd8KMcZpWtCatxKYcgealcEkemoxi01PDOIageX1LnYpnMBgdYShBFTQMvhABRMYLMTUK3JWyeUgElZfDg/WP8opbUFn4pP3US1F8Jn6kRrGbv6Tl2cPp7s/EMYRKFXRfV26MWdFOh9yHjAMtooSQrK9ZG0YuxqnBJekFIGVwlnVlDMgbBupSZOsvNULQgkXextNVOkbWxJa0eRJS5T1mBu8dTG6Vuxrcwg6F6GQKdcAtp7jz7FFDu5RWm0Gze9v/aZutEK7z/L9bREe+dj/HAxmhMrMRvb3C3gIOZQGCPToaAZHcqAcyFJIxxSYwEzk7oLNOVTUmYLM/Fq3H/TTBDMrKtCQLFiG0HKsVZJfkRp4iJcuBVnB43Lpe8oyb2ahDFlfTQ/Wtd9vEcO7fb+JoThRvQ3HrLwmYDJPkfranVg7fUPUlq9buyTj+TZBOpyEaaxDz2kCVxUIm4WkjRLsbuNM24UNSS0UTgRC4+Geha06ke2NTZJY2DvTw6IMuyNxZMAQBfKKy81RhO1WuwnmuXMrSYssr9ePD9pRrAEYhfPd6GdD4u6ri522pcqY9Y+c39kX9qCP+uxhVb4yjtZWj5eF1knb/dQuvpcY87tVCmQlQ4MDsU0CXE4QmEKpDYyqtolkRBmi8EJEQctITgh6rQAXFagz3sJ9kKUtIgzquKHupsDt/tpGYjuwVZHpM2TStfzkBGoYfKKs6uXIa1aY+vPDOTeb5YaPstx+Q0IJ05muXuhLtBOZn0k1D3g7DFti9DOUbJn7FhVKgk8ygoFJcoMjILFfoGTmdzQI1JKrSPaDtNEME1/T5w1UgnZ9mIkpKtCyT8XHKjdz2gTWNS+JPytij5UsQt5e/d6SsMLKV48PxqtfZ4e88zn5vMCObwG5sbbKR05bezgqEtLKBkd5GJtJOmR1cqT1CRJDqboZj2NsSnYcG0saiMBzMqz7F01gxOptKExN9OoWVbXaBpP+3mMNhkkrizJc5rwlBIg2gyZgfDLyrcw2umgFPswLfcuDLpXN6py7ah1/vOAkXWMvZ0e9A8u1fXJS9YdPRrSHth8GQfYY/tjUT1MLaCwX7azlkwOAY0W6zmw8Nq1IbVTKaRZTQZr37yPksWgKMolyfBoPxZKedTGJysLkUmuUdqihQnQODjDz6VcjGLKrvQbwvbFtlt/y4fVeZvd+NzN+Kb2twNkPUxw5fXJ9AuPtroHJ1owQLuzyBlKNN7cipy0ITVoBsilQy0qSQi7qLQUHp1mfZgiaeeva6RNM+vcEdM0B1DsbrKZxEbNc7pgtdYt5sVyL2fF4yG645HudFp1UVbjt+q0u5nq67e1q6FKt7XlhIZ945yv3n/Muq//ZZ6PUHWOQTldQMmp0G6W0h0BWtxSWxa4YG81YplxHem24ApjnNk9Lq6p95ZoLzFQkpWXeNocqpVLO1DipC2psA1G+5FkBVkTPHpq0wKX7d40dX0jwOUhhO3bArKcFnCbx6R07sPz1jzyR8E/vNJpj6CqjkBdDXhPGmeHiFdqUylPPLlZ76S0nUgH6awlD8GjVJn0Phqu5UiqUvtwNIPEwFijuU5QaiWOi54QtGNYwvIINSWi0YYHlMZ2e+KLcHA+a13ai/7qEUlyfn4g51x+JzY+Xb2MJP1V7+f/ychvdDvdFg/YxwqNRymTtFabYmfp8lk9ukn8ah8F17IJYQbRCHi+iZmjtl03YaQ0gUrjqVYNpRU68q6IaJWbcsm2A6HE4IEbv/bfzvO1tyGdxwHu3vaGpb1Q3aldZJdeqeqVlU7XfnNc9yBPD+Ng58G29jilzcGcliFS1nSUCT80mk1PRmJqQVw5Ie+fkfYBn9RMHEpOBM0acYUmig3mrg1Emgi3iQIqyShJYoV8NzcHa7ba+VU0l9+rp9c16L89IMflHQPy5hjg+juxNf8cmOE81VtCschy1moNpdNWm6Rss4OBGvQpWnFSgKJksIRwkXuJklHeR2Gnps8YWG1fljZoqyXbIKxIJZ7vaySm5kCAEs2hAxk7s70Pbb55sarWl8Dt3onJZ3Od7h3bBRsgXfionD60mnePPWfjHqroAIHrIBYTlKiS1VtzXpIfjNIwIJIpQmabnkQl6cSbvG59sE2Hmm5JofjdanNBUrtrjbm1w7DpNydpDD28V4a2cXsnpo1fJ7hR+OranZp8ltId2yhK0xuuQ7z0Sjl+/BHT3ZprdwZQ1gMOxbK8nu1WShp3EzDBSrJVRBWEAzGVkfiaIhAC19XS+sfduhrH22ZfTK7xdtBeI9uUEKSmXSPxDkjL8qzAMHbrlQjT87682gGze8eADCHAHTx8MPbyGV9eejK2n/lzgHV0NgvoxZcllON2D8uNWEa3a8gmJWCVSxodUqmBE70gxRoyAdzjrRwy6kJwCo73L2pXm5oMDvOD0ilr2TbGSAW7vevTEN+tqg/3wN+4kxPPDrX43aljZ7/VuvhqVZx81lp3qtcfQzVdwYhngXsNuT3ZS7jWdJUZreBxB6RT3qdBiZFcrSR7m2Z7kPwmO6RbW2KYJpGGuSAbcSi/HGvan9wBi9K4f7BzxmSbaw4+6kA+vKNAWmvhLhwXLoX08Jkq9k750RZGEAOMwVsIYI5gFoijlEG1osXRjWz9kDSXNPJro0tSIxibApfRhifhnhpRSkEsNcQ/QYarVFcZqvJAIpts60rKNs+ldH5LkrZ3dPN7djAa3Q0gqwOAK7+08ZEv9DrdpyPF34BSiQafoh2WytpJQ6q5Vbti0t2UEaL0ErnU9Fjq5qekdXMjXbzal6AduA2Qnm6PYWAX1R7Jd16EcrJ1LnNrG2Vx82GAOz7pLIt37Ssfzp2LxemXazt4COzmILMnoa6XZSesHYqXrq12i+l+paa4ZZpMkLbBHM4Nq74bbR1MLs14Z9L8JRWGLXLWijPfbXxr7cN2e+f1yl9bT3D5bkw2M538bgFJvvbsW2Vx6vms1f96q72PTmUZfLEE0CqpOUnyi9yBG2eOP1mpYxutF9BWFcpZBt04b5tGUSuVR8vtg4l3wSbdd0Ncsk5IvsM8dM24LKabL4Edrvr6o45xk7sCpJXdp3fjIHDWhyacf6MYn/oq/t1qt45AVfZx8l2mnRS+cSqWNtJkauOMtkelNMt2R2dnEsl9lLo7Nzb1GysJYEe2lwMdaowd8Kajbv/GG9X+9Fw9PT8ysHW3JpslH+AuHtRY/dFZH66+GXzrW+35a8jpvghFQE6HdqxJayUr3bJsArlk2mzR0Kw2aE2HIhRnZl7aRimoRe1nN/odDZTdAeSO3dbGzfHoxk+Dv7oW4iVkW6O7BuT2wS7c5eP6NsAHP87bx54aj83RQesEDEcrKFk1qvY2SEFBdj80KbWozf1Wd802BD5qJ2/SXkgGUTsySA49Jy463DHRatVpNL35i0629kZVni+8X4O7+B1A2fz8HNyD49zPp8Wpr+dZ67tjswm2fQxJ8gJGJmQrR5oBstxybKJsomfvnTjm0V6dQ+Va3h0cZ00FvOGeEiOUJqvm8dQ8qvbWtQTTd4pyayfFVZT+8m5OMNst63sB5A4q5+ovdndOf3lu8WClN7cDoTqJoeM82rWaLZ8jp9G06Frt0uC8pEQnDc0B7eHh2LppJ7PSLBVjG+/UF49eV5enE3vDwOZTAFfv9gSzeevgHh1vv1odPPvcCFb+VfAbZjC3gDyvBz5OUVoOuIuCCmROM9myZcRRGyQXriKDKyHjbGPULIykvsqcS8J0QdftXb+5Xf2srjcmC4ML92Jy2fjTN1HdtuOJzv2f70/GT3yh1U0vdDsbMJ6e5pYXfI/cHqfPQrPXMZpmH5TUpKOGlEka6rkNgduqg9rVLv4i3bHl+Mbu6L/ujybvnVh81bVbW/cEyKX5hXsFJE34wtZ4/Nbfj8d/9sz2zkZ/rnsEPfg82sQBUpx9aPZbk60D3WrcdE4Y7XZrenMJ4WClHxJCB6VxwGky2x697SfVxZZ9q+p0LuLS3BPblY2KAu7hMUZud+HstHr255PJye8uLG1BPp1HWzlHyS60kaWoLH/vnKTKjTZDSeuJkS5cJz2OVIalmLyGAVKeHnnqcm1j/C7Axka3cwb2huv9xXsjKFk1ncI9Pt7ddPDUS5PJkS/vbOytLC3tc2YooooLoeZ+MaZEMTUORvZwS2282bMom9d9ytjJUGAxLSdveNj+Odgz417rLK9cdW/ml3UGfbgPx5u/2t07/bWieORfbA+37dygh3SINo+20G+Us55u0KZTSo/xxtjQfIeGknPqp0wdDD1bkLtqPBod/LIu9i55fw62yu17OaFse7R/P4C8gpHNxR+MJ8eebrXXvxzLecTsGGdqwHkFqcn8aFK3KVFwGjJo4zz1YnZ5S0FuRxjX+3M2XRj02xfv9YSy08eX7weQpg7h9Us3N598ZTrqfwHsRm9uMId0CPXT9hCyCcfOQbkZ05y6+YYXLeNyjabH+2x6rfH+9Y3yfx0M96aPnHptudvdvedA5i67H0AmfO6uX5w/8/bO7qOXsnbxpe6xIUwnxxFM9MAtL613uoGdm0Q1xjZOdrkmNAWRqoIZuilb/mQ09qtzg1dSZq8WMdzzCWVFWcJ9OqpWp33uWp49+5Px6JtPbm3udpYW+ujBexiVdDCYmcy+6qtpHjDS3MOpNUAHQx47C9XB+pY/C/GDuHz8Tbx229yHyWTje++1Dx8bMOj/+kdrm8+edvngn3X729AyXZTFFic1bPTCG53THp/EX8YUqWzhcm4QHe1N3ol+81qv+xZe+QGLe0r3Hsj5wQDu8/Hm++39Z39YFi985WB//7Hl4wuceCBKk2btQrrlw6rzQaDJd9dheHFYbP89+I9uZq13kDcW92sS2er2zv0GctrtdV97dzxZebMsTz62f7AF3R61JLf0W6Uq9da665oKX2jY264qN7en359MyjP9zjvZoPfh/ZxEVlUVPADH21WePf+Dg/1Tf9Tp7J9udxfQ2RyR6gt3MITZt7mkmHOA2HXVe2Udz/h6Y/HIyjscr99PIFcWFx8EIG3lw2uvr60/88P94cl/lyN96XfnVCrzQ98NS3WRDFq5h82D6sfjg+n+oPtyu65v3O8JZPytnvf/iK3MXRkcXfzVT/eGf/0X07niyWP9EYZ/R7hDzeiea+KO9M190dfv7e4V7+XZr3d7GFNXxeS+A2ntAwEkHZOjC4tntsvy6Z+N97/65GhhCK12H4qqDbe+5ptKtXW9tTs9A2l9p9t980QVrj4Ig8+m9y4f+WmOy6Y/OPPj/f3TXz3Ynfva8ZM7yCeP81cjUHk7yyKMR9PXfNj9qbHvjVru7IMy8OzoF5+AB+x4/ewHH/2Dv63D80eL6uDRLENeWS1y77fLiysxFH9bFvX148fO5PeghPCpgbzm0oMG5E736dNn/8eV60+e6mX9v+p0JwttO3A+ZLbfqn4xNu7skf7V/kL3gwdp0FnvkZPwAB6vRai//hPbfvaZEyeLp6ZFaIVg13Mb3+oYn/qDn44G/bUHCsjO8vKDCOTomSNLvzg6v/DUZm7nFukrjKaFuYShzXZx4o2ws0tpsuqBAvKPX/z2gwgk1VnedSFcGQ4Pntu2ZhpCtHsQJyf6nbdOwN1phLqtvOArH56FB/V48Ynn4Eff+96fxhi/hi/dN7773f9+ZGXlxvffe/2BG6u5H5mS/xcP+/8huDPH/xVgAJPpAvZexr+yAAAAAElFTkSuQmCC",
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
				if((feature != null) && ("contextMenuVector" in GMXMAP) && (GMXMAP["contextMenuVector"] != null)){
					GMXMAP["contextMenuVector"].getSource().removeFeature(feature);
				}
			});
		}
	},



	/**
	 * PTZ 시작 이벤트를 전송합니다.
	 *
	 * @param $PLAYER - PLAYER Dialog
	 * @param PLAYER_OPTIONS - PLAYER Options
	 */
	addPtzOrPresetStartEvent : function($PLAYER, PLAYER_OPTIONS, TYPE){
		_common.callAjax("/cctv/getCctv.json", { "mgrNo" : PLAYER_OPTIONS.cctvMgrNo }, function(json){
			if(json.result != null){
				var _Json = xeusJsonParser.getTemplate();
				_Json.statEvetTypCd = "CCTVLOCK";
				_Json.statEvetNm = TYPE;
				_Json.statEvetCntn = "사용자(" + PLAYER_OPTIONS.userId + ")가 " + PLAYER_OPTIONS.cctvNm + " "+TYPE+" 제어를 시작하였습니다.";
				_Json["x"] = String(json.result.lng);
				_Json["y"] = String(json.result.lat);
				_Json["tmx"] = String(json.result.point[0]);
				_Json["tmy"] = String(json.result.point[1]);
				_Json.statEvetOutbDtm = new Date().getYMDHMS();
				_Json.procSt = "10";
				_Json.isTest = "N";
				_Json.uSvcOutbId = "";
				_Json.statEvetSvcTyp = "CCTVLOCK";
				_Json.outbPosNm = PLAYER_OPTIONS.cctvNm;
				_Json.outbPos[0].x = String(json.result.lng);
				_Json.outbPos[0].y = String(json.result.lat);
				_Json.etcCntn = { "gid" : json.result.gid, "cctvNm" : PLAYER_OPTIONS.cctvNm, "mgrNo" : PLAYER_OPTIONS.cctvMgrNo };

				_common.callAjax("/ws/addEvent.json", { "json" : JSON.stringify(_Json) }, function(addEvent){
					if(addEvent.result){
						$PLAYER.data("uSvcOutbId", addEvent.uSvcOutbId);
						$PLAYER.data("statEvetOutbDtm", _Json.statEvetOutbDtm);
					}
				});
			}
		}, false);
	},

	/**
	 * PTZ 종료 이벤트를 전송합니다.
	 *
	 * @param $PLAYER - PLAYER Dialog
	 * @param PLAYER_OPTIONS - PLAYER Options
	 */
	addPtzOrPresetStopEvent : function($PLAYER, PLAYER_OPTIONS,TYPE){
		_common.callAjax("/cctv/getCctv.json", { "mgrNo" : PLAYER_OPTIONS.cctvMgrNo }, function(json){
			if(json.result != null){
				if(!_common.utils.isNullAndEmpty($PLAYER.data("uSvcOutbId"))){
					var _Json = xeusJsonParser.getTemplate();
					_Json.statEvetTypCd = "CCTVLOCK";
					_Json.statEvetNm = TYPE;
					_Json.statEvetCntn = "사용자(" + PLAYER_OPTIONS.userId + ")가 " + PLAYER_OPTIONS.cctvNm + " "+TYPE+" 제어를 종료하였습니다.";
					_Json["x"] = String(json.result.lng);
					_Json["y"] = String(json.result.lat);
					_Json["tmx"] = String(json.result.point[0]);
					_Json["tmy"] = String(json.result.point[1]);
					_Json.statEvetOutbDtm = $PLAYER.data("statEvetOutbDtm");
					_Json.statEvetClrDtm = new Date().getYMDHMS();
					_Json.statEvetActnMn = PLAYER_OPTIONS.userId;
					_Json.procSt = "91";
					_Json.isTest = "N";
					_Json.uSvcOutbId = $PLAYER.data("uSvcOutbId");
					_Json.statEvetSvcTyp = "CCTVLOCK";
					_Json.outbPosNm = PLAYER_OPTIONS.cctvNm;
					_Json.outbPos[0].x = String(json.result.lng);
					_Json.outbPos[0].y = String(json.result.lat);
					_Json.etcCntn = { "gid" : json.result.gid, "cctvNm" : PLAYER_OPTIONS.cctvNm, "mgrNo" : PLAYER_OPTIONS.cctvMgrNo };

					_common.callAjax("/ws/addEvent.json", { "json" : JSON.stringify(_Json) }, function(addEvent){
						if(addEvent.result){
							$PLAYER.removeData("uSvcOutbId");
							$PLAYER.removeData("statEvetOutbDtm");
						}
					});
				}
			}
		}, false);
	},




	/**
	 * PTZ 버튼을 생성하여 리턴합니다.
	 *
	 * @param $PLAYER
	 * @returns
	 */
	createPTZ : function($PLAYER){

		var _this = this;
		var $ptzBtn = $("<button id='btnPtz'>").addClass("btn_style").attr("active", "N").text("카메라 제어 시작").click(function(){
			var $this = $(this);
			if($PLAYER.find("#btnPreset").attr("active") === "Y"){
				alert("프리셋 제어를 먼저 종료해주세요.")
				return;
			}


			if($this.attr("active") === "N"){
				//Start
				$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast", function(){
					$this.attr("active", "Y");
					$this.text("카메라 제어 종료");
					$PLAYER.find(".ptzWrap").stop(true, true).toggle("fade");

					_this.addPtzOrPresetStartEvent($PLAYER, $PLAYER.data("player").options,"PTZ");

					$("#"+$PLAYER.attr("id")).parent()[0].focus();

					$PLAYER.dialog("option","closeOnEscape", false);
				});
			}else{
				//End
				$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast", function(){
					$this.attr("active", "N");
					$this.text("카메라 제어 시작");
					$PLAYER.find(".ptzWrap").stop(true, true).toggle("fade");
					_this.addPtzOrPresetStopEvent($PLAYER, $PLAYER.data("player").options,"PTZ");

					$PLAYER.dialog("option","closeOnEscape", true);

				});
			}
		});

		return $ptzBtn;
	},





	/**
	 * preset 버튼을 생성하여 리턴합니다.
	 *
	 * @param $PLAYER
	 * @returnsff
	 */
	createPreset : function($PLAYER){
		var _this = this;
		var $presetBtn = $("<button id='btnPreset'>").addClass("btn_style").attr("active", "N").text("프리셋 제어 시작").click(function(){

			if($PLAYER.find("#btnPtz").attr("active") === "Y"){
				alert("카메라 제어를 먼저 종료해주세요.")
				return;
			}

			var $this = $(this);
			if($this.attr("active") === "N"){
				//Start
				$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast", function(){
					$this.attr("active", "Y");
					$this.text("프리셋 제어 종료");
					$PLAYER.find(".presetWrap").stop(true, true).toggle("fade");

					_this.addPtzOrPresetStartEvent($PLAYER, $PLAYER.data("player").options,"Preset");

					$("#"+$PLAYER.attr("id")).parent()[0].focus();

					$PLAYER.dialog("option","closeOnEscape", false);
				});
			}else{
				//End
				$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast", function(){
					$this.attr("active", "N");
					$this.text("프리셋 제어 시작");
					$PLAYER.find(".presetWrap").stop(true, true).toggle("fade");
					_this.addPtzOrPresetStopEvent($PLAYER, $PLAYER.data("player").options,"Preset");

					$PLAYER.dialog("option","closeOnEscape", true);

				});
			}
		});

		return $presetBtn;
	},

	/**
	 * 영상공유 버튼을 생성하여 리턴합니다.
	 *
	 * @param $PLAYER
	 * @returns
	 */
	createShare : function($PLAYER){
		//TODO single, multiple 데이터 받아서 공유처리
		var $shareBtn = $("<button>").addClass("btn_style").text("실시간 영상 공유").click(function(){
			$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast", function(){

				var playerOptions = $PLAYER.data().player.options;

				var userId = playerOptions.userId;
				var cctvNm = playerOptions.cctvNm;
				var cctvMgrNo = playerOptions.cctvMgrNo;

				if($("#cctvShareWrap").length === 0){

					var $cctvShareWrap = $("<div>").attr("title", "실시간 영상 공유").attr("id", "cctvShareWrap").addClass("customScroll").addClass("table_style");
					var $tr = $("<tr>");
					var $th = $("<th>").width(150);
					var $td = $("<td>");
					var $select = $("<select>");
					var $input = $("<input>").attr("type", "text");

					var $tCctv = $tr.clone().append($th.clone().text("대상 CCTV")).append($td.clone().append($input.clone().attr("type", "hidden").attr("id", "mgrNo").val(cctvMgrNo)).text(cctvNm));
					var $tGroup = $tr.clone().append($th.clone().text("대상 그룹")).append($td.clone().append($select.clone().attr("id", "targetGrp")));
					var $tUser = $tr.clone().append($th.clone().text("대상 유저")).append($td.clone().append($select.clone().attr("id", "targetId")));
					var $tPurp = $tr.clone().append($th.clone().text("공유 사유")).append($td.clone().append($input.clone().attr("id", "shareReason")))
					var $tText = $tr.clone().append($th.clone().attr("colspan", "2").text("공유대상은 그룹 또는 개별 사용자 한가지만 선택할 수 있습니다."));
					var $tBtn = $("<button>").addClass("btn_style").attr("id", "sendCctvShare").text("공유 시작");

					$tGroup.find("#targetGrp").append($("<option>").val("").text("전체 사용자"));
					$tUser.find("#targetId").append($("<option>").val("").text("미선택"));

					_common.callAjax("/auth/getGrpList.json", { "sortCol" : "auth_grp_nm", "sortTyp" : "asc" }, function(json){
						for(var i=0; i<json.result.length; i++){
							$tGroup.find("#targetGrp").append($("<option>").val(json.result[i].authGrpNo).text(json.result[i].authGrpNm));
							$tUser.find("#targetId").append($("<optgroup>").attr("label", json.result[i].authGrpNm));
						}
					}, false);

					_common.callAjax("/user/getList.json", { "sortCol" : "auth_grp_nm, user_nm", "sortTyp" : "asc", "authStatCd":"12"}, function(json){
						for(var i=0; i<json.result.length; i++){
							var authGrpNm = json.result[i].authGrpNm;
							$tUser.find("optgroup").each(function(){
								if($(this).attr("label") == authGrpNm){
									$(this).append($("<option>").val(json.result[i].userId).text(json.result[i].userNm + "(" + json.result[i].userId + ")"));
								}
							});

						}
					}, false);

					$tGroup.find("#targetGrp").change(function(){
						if($(this).val() == ""){
							$tUser.find("#targetId").prop("disabled", false).focus();
						}else{
							$tUser.find("#targetId").prop("disabled", true);
						}
					});

					$tUser.find("#targetId").change(function(){
						if($(this).val() == ""){
							$tGroup.find("#targetGrp").prop("disabled", false).focus();
						}else{
							$tGroup.find("#targetGrp").prop("disabled", true);
						}
					});

					var $table = $("<table>").width("100%").append($tCctv).append($tGroup).append($tUser).append($tPurp).append($tText);

					$tBtn.click(function(){
						_common.callAjax("/cctv/getCctv.json", { "mgrNo" : cctvMgrNo }, function(cctvItem){
							if(!_common.utils.isNullAndEmpty(cctvItem.result)){
								var _Json = xeusJsonParser.getTemplate();
								_Json.statEvetTypCd = "CCTVSHER";
								_Json.statEvetNm = "CCTV 영상 공유";
								_Json.statEvetCntn = $table.find("#shareReason").val();
								_Json["x"] = String(cctvItem.result.lng);
								_Json["y"] = String(cctvItem.result.lat);
								_Json["tmx"] = String(cctvItem.result.point[0]);
								_Json["tmy"] = String(cctvItem.result.point[1]);
								_Json.statEvetOutbDtm = new Date().getYMDHMS();
								_Json.statEvetClrDtm = "";
								_Json.statEvetActnMn = "";
								_Json.statEvetActnCntn = "";
								_Json.procSt = "10";
								_Json.isTest = "N";
								_Json.uSvcOutbId = "";
								_Json.statEvetSvcTyp = "CCTVSHER";
								_Json.outbPos[0].x = String(cctvItem.result.lng);
								_Json.outbPos[0].y = String(cctvItem.result.lat);
								_Json.outbPosNm = cctvItem.result.cctvNm + "(" + userId + " 공유)";

								var isMultiple = false;
								//TODO Mutiple Share 작업
								if(isMultiple){
									_Json.outbPosNm += " 외 " + _length + " 개 (" + userId + " 공유)";
									_Json.etcCntn = JSON.parse(JSON.stringify(cctvItem.result));
								}else{
									_Json.etcCntn = JSON.parse(JSON.stringify(cctvItem.result));
								}

								if(!$tGroup.find("#targetGrp").is(":disabled")) _Json.targetGrp = $tGroup.find("#targetGrp").val();
								if(!$tUser.find("#targetId").is(":disabled"))  _Json.targetId = $tUser.find("#targetId").val();

								if(confirm("공유하시겠습니까?")){
									_common.callAjax("/ws/addEvent.json", { "json" : JSON.stringify(_Json) }, function(json){
										if(json.result) $cctvShareWrap.dialog("destroy");
									});
								}
							}
						});

						return false;
					})

					$cctvShareWrap.append($table).append($tBtn).dialog({
						width: 700,
						height: 340,
						modal: true,
						resizable: false,
						position: {
							my: "center center",
							at: "center center",
							of: $("#parentBody")
						},
						open: function(){
						},
						close: function(){
							$cctvShareWrap.dialog("destroy");
						}
					}).parent().draggable({ containment: "#parentBody", scroll: false });
				}
			});
		});

		return $shareBtn;
	},

	/**
	 * 모바일 영상공유 버튼을 생성하여 리턴합니다.
	 *
	 * @param $PLAYER
	 * @returns
	 */
	createMobileShare : function($PLAYER){
		var $mobileShareBtn = $("<button>").addClass("btn_style").text("모바일 영상 공유").click(function(){
			$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast", function(){
				var playerOptions = $PLAYER.data().player.options;

				var userId = playerOptions.userId;
				var cctvNm = playerOptions.cctvNm;
				var cctvMgrNo = playerOptions.cctvMgrNo;



				if($("#cctvMobileShareWrap").length === 0){

					var $cctvMobileShareWrap = $("<div>").attr("title", "모바일 영상 공유").attr("id", "cctvMobileShareWrap").addClass("customScroll").addClass("table_style");
					var $tr = $("<tr>");
					var $th = $("<th>").width(150);
					var $td = $("<td>");
					var $select = $("<select>");
					var $input = $("<input>").attr("type", "text");

					var $tCctv = $tr.clone().append($th.clone().text("대상 CCTV")).append($td.clone().append($input.clone().attr("type", "hidden").attr("id", "mgrNo").val(cctvMgrNo)).text(cctvNm));
					var $tGroup = $tr.clone().append($th.clone().text("대상 그룹")).append($td.clone().append($select.clone().attr("id", "targetGrp")));
					var $tUser = $tr.clone().append($th.clone().text("대상 유저")).append($td.clone().append($select.clone().attr("id", "targetId")));
					var $tPurp = $tr.clone().append($th.clone().text("공유 사유")).append($td.clone().append($input.clone().attr("id", "shareReason")))
					var $tText = $tr.clone().append($th.clone().attr("colspan", "2").text("공유대상은 그룹 또는 개별 사용자 한가지만 선택할 수 있습니다."));
					var $tBtn = $("<button>").addClass("btn_style").attr("id", "sendCctvShare").text("공유 시작");

					$tGroup.find("#targetGrp").append($("<option>").val("").text("전체 사용자"));
					$tUser.find("#targetId").append($("<option>").val("").text("미선택"));

					_common.callAjax("/auth/getGrpList.json", { "sortCol" : "auth_grp_nm", "sortTyp" : "asc" }, function(json){
						for(var i=0; i<json.result.length; i++){
							$tGroup.find("#targetGrp").append($("<option>").val(json.result[i].authGrpNo).text(json.result[i].authGrpNm));
							$tUser.find("#targetId").append($("<optgroup>").attr("label", json.result[i].authGrpNm));
						}
					}, false);

					_common.callAjax("/user/getList.json", { "sortCol" : "auth_grp_nm, user_nm", "sortTyp" : "asc", "authStatCd":"12"}, function(json){

						for(var i=0; i<json.result.length; i++){
							var authGrpNm = json.result[i].authGrpNm;
							$tUser.find("optgroup").each(function(){
								if($(this).attr("label") == authGrpNm){
									$(this).append($("<option>").val(json.result[i].mobileNum).text(json.result[i].userNm + "(" + json.result[i].userId + ")"));
								}
							});

						}
					}, false);

					$tGroup.find("#targetGrp").change(function(){
						if($(this).val() == ""){
							$tUser.find("#targetId").prop("disabled", false).focus();
						}else{
							$tUser.find("#targetId").prop("disabled", true);
						}
					});

					$tUser.find("#targetId").change(function(){
						if($(this).val() == ""){
							$tGroup.find("#targetGrp").prop("disabled", false).focus();
						}else{
							$tGroup.find("#targetGrp").prop("disabled", true);
						}
					});

					var $table = $("<table>").width("100%").append($tCctv).append($tGroup).append($tUser).append($tPurp).append($tText);



					$tBtn.click(function(){
						//20210331  김훈식  ADD - 영상공유

						var param = {};
						param['cctvManagerNumber'] = cctvMgrNo;

						var targetId = $("#cctvMobileShareWrap").find("#targetId").val();
						var targetGrp = $("#cctvMobileShareWrap").find("#targetGrp").val();
						var shareReason = $("#cctvMobileShareWrap").find("#shareReason").val();

						if((targetId == "" || targetId == undefined || targetId == null) && (targetGrp == "" || targetGrp == undefined || targetGrp == null)){
							alert("대상 그룹 또는 대상 유저를 선택해주세요.");
							return;
						}



						if(targetId != "" && targetId != undefined && targetId != null){
							param["phoneNumber"] = targetId;
						}

						if(targetGrp != "" && targetGrp != undefined && targetGrp != null){
							param["groupNumber"] = targetGrp;
						}

						if(shareReason != "" && shareReason != undefined && shareReason != null){
							param["message"] = shareReason;
						}

						if(confirm("공유하시겠습니까?")){
							_common.callAjax("/GMT_mobileshare/api/open", param, function(json){
								alert("공유가 완료되었습니다.\n\n모바일영상공유 메뉴에서 공유현황을 확인할수 있습니다.");
								$("#cctvMobileShareWrap").dialog("close");
							}, false);
						}
					});

					$cctvMobileShareWrap.append($table).append($tBtn).dialog({
						width: 700,
						height: 340,
						modal: true,
						resizable: false,
						position: {
							my: "center center",
							at: "center center",
							of: $("#parentBody")
						},
						open: function(){
						},
						close: function(){
							$cctvMobileShareWrap.dialog("destroy");
						}
					}).parent().draggable({ containment: "#parentBody", scroll: false });
				}
			});
		});

		return $mobileShareBtn;
	},


	/**
	 * 비상벨 호출 버튼을 생성하여 리턴합니다.
	 *
	 * @param $PLAYER
	 * @returns
	 */
	createConectPhoneToEmerBell : function($PLAYER){
		var $conectPhoneToBellBtn = $("<button>").addClass("btn_style").text("비상벨 전화 연결").click(function(){
			$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast", function(){
				var playerOptions = $PLAYER.data().player.options;


				var param = {};
				param["cctvMgrNo"] = playerOptions.cctvMgrNo;
				param["userId"] = playerOptions.userId;

				if(confirm("해당 CCTV의 비상벨에 전화 연결을 하시겠습니까?")){
					_common.callAjax("/monitor/responseBell.json", param, function(json){
						if(json.result){
							alert("비상벨에 전화연결이 되었습니다.")
						}else{
							alert("비상벨에 전화연결에 실패하였습니다.")
						}
					}, false);
				}
			});
		});

		return $conectPhoneToBellBtn;


	},

	/**
	 * XEUS-PLAYER에 Menu를 생성합니다.
	 *
	 * @param playerId
	 */
	createPlayerMenu : function(playerId){
		var $PLAYER = $("#" + playerId);

		var $ptzBtn = this.createPTZ($PLAYER);
		var $preset = this.createPreset($PLAYER);
		var $shareBtn = this.createShare($PLAYER);
		var $mobileShareBtn = this.createMobileShare($PLAYER);
		var $conectPhoneToEmerBell = this.createConectPhoneToEmerBell($PLAYER);

		//var $menuWrap = $("<div>").addClass("menuWrap").css({ "background-color": "#0078d4", "position": "absolute", "width": "50px", "height": "100%", "top": "0", "left": "0", "z-index": "99", "display" : "none" });
		//var $menuWrap = $("<div>").addClass("menuWrap").css({ "background-color": "#0078d4", "position": "absolute", "width": "100%", "height": "50px", "bottom": "0", "left": "0", "z-index": "99", "display" : "none" }).append($ptzBtn);
		var $menuWrap = $("<div>").addClass("menuWrap").css({ "background-color": "#0078d4", "position": "absolute", "width": "160px", "top": "0", "left": "0", "z-index": "10", "display" : "none" });
		_common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVLOCK" }, function(json){
			if(json.result) {
//				$menuWrap.append($ptzBtn).append($preset);
				$menuWrap.append($ptzBtn);
			}
		});
//		$menuWrap.append($shareBtn).append($mobileShareBtn).append($conectPhoneToEmerBell);
		$menuWrap.append($shareBtn).append($mobileShareBtn);

		$PLAYER.append($menuWrap);

		var $menuBtn = $("<button>").css({ "background": "none", "position": "absolute", "width": "50px", "height": "100%", "top": "0", "left": "0" }).html(
			"<svg viewBox='0 0 100 60' width='20' height='20'><rect width='100' height='10' fill='white'></rect><rect width='100' height='10' fill='white' y='30'></rect><rect width='100' height='10' fill='white' y='60'></rect></svg>"
		);

		$PLAYER.parent().find(".ui-dialog-titlebar").prepend($menuBtn);
		$PLAYER.parent().find(".ui-dialog-title").width("80%").css("margin-left", "30px");

		$menuBtn.click(function(){
			$PLAYER.find(".menuWrap").stop(true, true).slideToggle("fast");
		});



	},

	/**
	 * XEUS-GATE Player를 생성합니다.
	 * data 파라미터는 { mgr_no 또는 mgrNo } 등의 Object 타입이나
	 * "CTV0000001" 과 같은 String 타입 두 가지를 지원합니다.
	 *
	 * @param data - { mgrNo, cctvNm .... }
	 * @returns {___anonymous_GMXCCTV}
	 */
	createSinglePlayer : function(data){
		var _this = this;

		var mgrNo = null;
		var cctvNm = null;
		var isPreview = false;
		var isPlay = false;

		if(typeof data === "string"){
			if(_common.utils.isNullAndEmpty(data)){
				console.error(">> CCTV MGR_NO is required.");
				return;
			}else{
				mgrNo = data;
			}
		}
		if(typeof data === "object"){
			if("mgr_no" in data){
				mgrNo = data.mgr_no;
			}else if("mgrNo" in data){
				mgrNo = data.mgrNo;
			}else{
				console.error(">> CCTV MGR_NO is required.");
				return;
			}

			if("cctvNm" in data) cctvNm = data.cctvNm;
			if("cctv_nm" in data) cctvNm = data.cctv_nm;

			if("isPreview" in data) isPreview = data.isPreview;
			if("isPlay" in data) isPlay = data.isPlay;
		}

		if(_common.utils.isNullAndEmpty(cctvNm)) cctvNm = "CCTV 재생";

		var playerId = "PLAYER-" + mgrNo;

		if($("#" + playerId).length != 0){
			GMXMAP.addMapNotification("해당 CCTV는 이미 재생중입니다.", 1000);
			return;
		}

		var $dialog = $("<div>").addClass("playerWrap customScroll").attr("id", playerId);//.append("<div id='" + playerId + "'>");
		$dialog.dialog({
			title : cctvNm,
			width: 300,
			height: 300,
			closeOnEscape: true,
			/*position: {
				my: "center",
				at: "center",
				of: $("#map")
			},*/
			open: function(){
				$(this).data("player", GMXCCTV.createXeusGatePlayer(playerId, mgrNo, cctvNm, false, false, isPreview, isPlay));

				_this.createPlayerMenu(playerId);

				//$dialog.parent().find(".ui-dialog-title").dblclick(function(){
					/*if($dialog.find("img").length > 0) $dialog.find("img")[0].requestFullscreen();
					if($dialog.find("video").length > 0) $dialog.find("video")[0].requestFullscreen();
					if($dialog.find("canvas").length > 0) $dialog.find("canvas")[0].requestFullscreen();*/

					//$dialog[0].requestFullscreen();
					//$dialog.width("100%").height("100%");
				//});
			},
			close: function(){
				var $PLAYER = $(this);
				if(!_common.utils.isNullAndEmpty($PLAYER.data("uSvcOutbId"))){
					_this.addPtzOrPresetStopEvent($PLAYER, $PLAYER.data("player").options,"PTZ");
				}

				var xeusGatePlayer = $(this).data("player");
				if( xeusGatePlayer != null && xeusGatePlayer instanceof XeusGate.Player ){
					xeusGatePlayer.destroy();
					xeusGatePlayer = null;
				}

				_this.removePlayingIcon(mgrNo);
				GMXMAP.redrawAllVisibleVector();


				$(this).remove();
			}
		}).dialog("open").parent().draggable({
			containment: $("#map"),
			scroll: false
		}).resizable({
			stop: function(){
				/*$(this).height(
					$(this).find(".ui-dialog-titlebar").height() + $(this).find(".playerWrap").height()
				);*/
			}
		});

		return this;
	},

	/**
	 * 그리드가 생성되어 있을 경우 카메라를 추가하고,
	 * 생성되지 않았을 경우 자동 생성합니다.
	 *
	 * @param data
	 */
	addGridPlayer : function(data){
		var _this = this;

		var mgrNo = null;
		var cctvNm = null;
		var isPreview = false;
		var isPlay = false;

		if(typeof data === "string"){
			if(_common.utils.isNullAndEmpty(data)){
				console.error(">> CCTV MGR_NO is required.");
				return;
			}else{
				mgrNo = data;
			}
		}

		if(typeof data === "object"){
			if("mgr_no" in data){
				mgrNo = data.mgr_no;
			}else if("mgrNo" in data){
				mgrNo = data.mgrNo;
			}else{
				console.error(">> CCTV MGR_NO is required.");
				return;
			}

			if("cctvNm" in data) cctvNm = data.cctvNm;
			if("cctv_nm" in data) cctvNm = data.cctv_nm;

			if("isPreview" in data) isPreview = data.isPreview;
			if("isPlay" in data) isPlay = data.isPlay;
		}

		if(_common.utils.isNullAndEmpty(cctvNm)) cctvNm = "CCTV 재생";

		if($("#gridMonitoringWrap").length > 0 && $("#gridMonitoringWrap").find("ul").find("li").length > 0 && $("#gridMonitoringWrap").dialog("isOpen")){
			var $ul = $("#gridMonitoringWrap").find("ul");

			if($ul.length > 0){
				var playerId = "GRID-PLAYER-" + mgrNo;

				if($("#" + playerId).length != 0){
					GMXMAP.addMapNotification("해당 CCTV는 이미 재생중입니다.", 1000);
					return;
				}

				var $li = $ul.find("li:eq(0)").clone().html("");
				var $playerTitle = $("<p>").addClass("cctv_title").addClass("sText").addClass("pointer").attr("title", cctvNm).text(cctvNm).css("overflow","initial").click(function(){
					if(confirm("해당 카메라를 그리드 모니터링에서 제거하시겠습니까?")){
						_this.removeGridPlayer(playerId);
					}
				});
				var $playerWrap = $("<div class='cctv_player'>").attr("id", playerId).css("position", "relative").width("100%").height("calc(100% - 22px)").data("mgrNo", mgrNo).data("cctvNm", cctvNm);

				$li.append($playerTitle);
				$li.append($playerWrap);

				$ul.append($li);

				GMXCCTV.createXeusGatePlayer(playerId, mgrNo, cctvNm, true, false, isPreview, isPlay);
			}
		}else{

			this.createGridPlayer([{ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPreview" : isPreview, "isPlay" : isPlay}]);
		}
	},

	/**
	 * 그리드를 생성하여 전달받은 Array 로 CCTV를 재생합니다.
	 *
	 * @param dataList
	 * @returns {___anonymous_GMXCCTV}
	 */
	createGridPlayer : function(dataList){
		var _this = this;

		var $ul = $("<ul>");
		for(var i=0; i<dataList.length; i++){
			if(i < 30){
				var mgrNo = null;
				var cctvNm = null;
				var isPreview = false;
				var isPlay = false;

				if(typeof dataList[i] === "object"){
					if("mgr_no" in dataList[i]){
						mgrNo = dataList[i].mgr_no;
					}else if("mgrNo" in dataList[i]){
						mgrNo = dataList[i].mgrNo;
					}else{
						console.error(">> CCTV MGR_NO is required.");
						return;
					}

					if("cctvNm" in dataList[i]) cctvNm = dataList[i].cctvNm;
					if("cctv_nm" in dataList[i]) cctvNm = dataList[i].cctvNm;

					if("isPreview" in dataList[i]) isPreview = dataList[i].isPreview;
					if("isPlay" in dataList[i]) isPlay = dataList[i].isPlay;
				}else{
					console.error(">> CCTV Data(Object) is required.");
					return;
				}

				if(_common.utils.isNullAndEmpty(cctvNm)) cctvNm = "CCTV 재생";

				var playerId = "GRID-PLAYER-" + mgrNo;

				if($("#" + playerId).length != 0){
					GMXMAP.addMapNotification("해당 CCTV는 이미 재생중입니다.", 1000);
					continue;
				}

				var $li = $("<li>").addClass("ui-state-default");
				var $playerTitle = $("<span>").addClass("cctv_title").addClass("sText").addClass("pointer").attr("title", cctvNm).text(cctvNm).css("overflow","initial").click(function(){
					if(confirm("해당 카메라를 그리드 모니터링에서 제거하시겠습니까?")){
						_this.removeGridPlayer(playerId);
					}
				});
				var $playerWrap = $("<div class='cctv_player'>").attr("id", playerId).css("position", "relative").width("100%").height("calc(100% - 22px)")
																.data("mgrNo", mgrNo).data("cctvNm", cctvNm).data("isPreview", isPreview).data("isPlay", isPlay);

				$li.append($playerTitle);
				$li.append($playerWrap);

				$ul.append($li);
			}
		}

		$ul.css({
			"list-style-type" : "none",
			"width" : "100%",
			"margin" : 0,
			"padding" : 0
		});
		$ul.find("li").css({
			"float" : "left",
			"width" : "200px",
			"height" : "150px",
			"text-align" : "center",
			"position" : "relative",
			"overflow" : "hidden",
			"text-overflow" : "ellipsis"
		});
		$ul.sortable().sortable("disable");
		$ul.disableSelection();

		/*var removeIntent = false;
		$ul.sortable({
			forcePlaceholderSize: true,
			tolerance: "pointer",
			cursor: "pointer",
			over: function () {
				removeIntent = false;
			},
			out: function () {
				removeIntent = true;
			},
			beforeStop: function (event, ui) {
				if(removeIntent === true) {
					ui.item.hide();
					if (confirm("해당 카메라를 그리드 모니터링에서 제거하시겠습니까?")) {
						ui.item.remove();
					} else {
						ui.item.show();
					}
				}
			}
		});
		$ul.disableSelection();*/

		if($("#gridMonitoringWrap").dialog("isOpen")){
			_this.clearAllGridPlayers();
			$("#gridMonitoringWrap").html($ul);

			$ul.find("li").each(function(i, e){
				var playerId = $(e).find(".cctv_player").attr("id");
				var mgrNo = $(e).find(".cctv_player").data("mgrNo");
				var cctvNm = $(e).find(".cctv_player").data("cctvNm");
				var isPreview = $(e).find(".cctv_player").data("isPreview");
				var isPlay = $(e).find(".cctv_player").data("isPlay");

				GMXCCTV.createXeusGatePlayer(playerId, mgrNo, cctvNm, true, false, isPreview, isPlay);
			});
		}else{
			$("#gridMonitoringWrap").html($ul).dialog({
				title: "그리드 모니터링 (더블 클릭하여 자동 넓이 조절)",
				width: 630,
				height: $("#map").height(),
				position: {
					my: "right top",
					at: "right top",
					of: $("#map")
				},
				open: function(){
					$ul.find("li").each(function(i, e){
						var playerId = $(e).find(".cctv_player").attr("id");
						var mgrNo = $(e).find(".cctv_player").data("mgrNo");
						var cctvNm = $(e).find(".cctv_player").data("cctvNm");
						var isPreview = $(e).find(".cctv_player").data("isPreview");
						var isPlay = $(e).find(".cctv_player").data("isPlay");

						GMXCCTV.createXeusGatePlayer(playerId, mgrNo, cctvNm, true, false, isPreview, isPlay);
					});
				},
				beforeClose: function(){
					return confirm("그리드 모니터링을 종료하시겠습니까?");
				},
				close: function(){
					_this.removePlayingIconAtGrid();
					_this.clearAllGridPlayers();
					$("#gridMonitoringWrap").html("");


					GMXMAP.redrawAllVisibleVector();

				}
			}).dialog("open");

			$("#gridMonitoringWrap").parent().find(".ui-dialog-title").data("grid-width", 3).off().dblclick(function(){
				var gridWidth = $(this).data("grid-width");
				var standardWidth = $("#gridMonitoringWrap").find("li").eq(0).outerWidth() + 30;
				var changeWidth = standardWidth;

				if(gridWidth === 1) changeWidth = (standardWidth * 2 - 30);
				if(gridWidth === 2) changeWidth = (standardWidth * 3 - 60);
				if(gridWidth === 3) changeWidth = (standardWidth * 4 - 90);
				if(gridWidth === 4) changeWidth = standardWidth;

				gridWidth++;
				if(gridWidth === 5) gridWidth = 1;
				$(this).data("grid-width", gridWidth);

				$("#gridMonitoringWrap").dialog("option", "width", changeWidth).dialog("option", "height", $("#map").height()).dialog("widget").position({
					my: "right top",
					at: "right top",
					of: $("#map")
				});
			});
		}

		return this;
	},

	/**
	 * 그리드 패널의 넓이를 조절합니다.
	 *
	 * @param gridWidth
	 */
	setGridDialogWidth : function(gridWidth){
		gridWidth--;
		if(gridWidth < 1) gridWidth = 4;

		var standardWidth = $("#gridMonitoringWrap").find("li").eq(0).outerWidth() + 30;
		var changeWidth = standardWidth;

		if(gridWidth === 1) changeWidth = (standardWidth * 2 - 30);
		if(gridWidth === 2) changeWidth = (standardWidth * 3 - 60);
		if(gridWidth === 3) changeWidth = (standardWidth * 4 - 90);
		if(gridWidth === 4) changeWidth = standardWidth;

		gridWidth++;
		if(gridWidth === 5) gridWidth = 1;
		$(this).data("grid-width", gridWidth);

		$("#gridMonitoringWrap").dialog("option", "width", changeWidth).dialog("option", "height", $("#map").height()).dialog("widget").position({
			my: "right top",
			at: "right top",
			of: $("#map")
		});

		return this;
	},

	/**
	 * 프로그레스바 엘리먼트를 생성합니다.
	 *
	 * @param $PLAYER
	 * @param _CallBack
	 */
	createPreviewProgressBar : function($PLAYER, _CallBack){
		var _this = this;

		var $countdownBar = $("<div class='bar'></div>").css({
			"height": "100%",
			"text-align": "right",
			"line-height": "10px",
			"width": "0",
			"background-color": "#0078D4",
			"box-sizing": "border-box"
		});
		var $countdown = $("<div class='countdownProgress'></div>").css({
			"position": "absolute",
			"width": "100%",
			"height": "5px",
			"bottom": "1px",
			"left": "0%",
			"display": "none"
		}).append($countdownBar);

		$PLAYER.append($countdown);

		var timeout = null;
		var timeleft = _this.PreviewTime;
		progress(timeleft, _this.PreviewTime, $countdown);

		timeout = setTimeout(function(){
			timeleft--;

			if("function" === typeof _CallBack) _CallBack();

			clearTimeout(timeout);
			timeout = null;
		}, 1000 * _this.PreviewTime);
	},

	/**
	 * 프로그레스바 엘리먼트를 생성합니다.
	 * 해당 기능은 GMXCCTV에 preViewTime이 아닌 PlayTime으로 시간설정으로 쓰는 경우에 사용합니다.
	 * @param $PLAYER
	 * @param _CallBack
	 */
	createCustomPreviewProgressBar : function($PLAYER, _CallBack){
		var _this = this;

		var $countdownBar = $("<div class='bar'></div>").css({
			"height": "100%",
			"text-align": "right",
			"line-height": "10px",
			"width": "0",
			"background-color": "#0078D4",
			"box-sizing": "border-box"
		});
		var $countdown = $("<div class='countdownProgress'></div>").css({
			"position": "absolute",
			"width": "100%",
			"height": "5px",
			"bottom": "1px",
			"left": "0%",
			"display": "none"
		}).append($countdownBar);

		$PLAYER.append($countdown);

		var timeout = null;
		var timeleft = _this.PlayTime;
		progress(timeleft, _this.PlayTime, $countdown);
		timeout = setTimeout(function(){
			timeleft--;

			if("function" === typeof _CallBack) _CallBack();

			clearTimeout(timeout);
			timeout = null;
		}, 1000 * _this.PlayTime);
	},

	snapshotSave : function(playerId){
		var player = null;
		if((this.Codec === "h264") || ($("#" + playerId).find("video").length > 0)) player = $("#" + playerId).find("video")[0];
		if((this.Codec === "mjpeg") || ($("#" + playerId).find("img").length > 0)) player = $("#" + playerId).find("img")[0];

		var playerCopyCanvas = document.createElement("canvas");
		playerCopyCanvas.width = 1920;
		playerCopyCanvas.height = 1080;
		playerCopyCanvas.getContext("2d").drawImage(player, 0, 0, 1920, 1080);

		var fileName = Date.prototype.getYMDHMS(true).replaceAll(":", "-") + ".png";
		var playerData = $("#" + playerId).data();
		if("cctvNm" in playerData) fileName = playerData["cctvNm"] + "_" + fileName;
		if("player" in playerData){
			if(("options" in playerData["player"]) && ("cctvNm" in playerData["player"]["options"])){
				fileName = playerData["player"]["options"]["cctvNm"] + "_" + fileName;
			}
		}

		var $a = $("<a id='image-download'></a>").attr({ "download" : fileName, "href" : playerCopyCanvas.toDataURL("image/jpg") }).hide();

		$("body").append($a);
		$a[0].click();
		$a.remove();

		GMXMAP.addMapNotification("스냅샷이 저장되었습니다.");
	},

	/**
	 * XEUS-PLAYER 에 ContextMenu 를 추가합니다.
	 *
	 * @param playerId
	 * @param mgrNo
	 * @param cctvNm
	 * @param isMultiplePlay
	 * @param isNetMonitorPlay
	 * @param isPreview
	 */
	createPlayerContextMenu : function(playerId, mgrNo, cctvNm, isMultiplePlay, isNetMonitorPlay, isPreview){
		var _this = this;
		var _Items = {
			"snapshotSave": { name: "스냅샷 저장" },
			"fullScreen": { name: "전체화면 재생" },
			"singlePlay": { name: "단독 재생으로 변경" },
			"addGridPlay": { name: "그리드 재생으로 변경" },
			"movePosition": { name: "CCTV 위치로 이동" },
			"stopPlay": { name: "재생 종료" },
		};

		if(isMultiplePlay){
			delete _Items["addGridPlay"];
		}
		if(isNetMonitorPlay){
			delete _Items["singlePlay"];
			delete _Items["addGridPlay"];
			delete _Items["stopPlay"];
		}
		if(!isMultiplePlay && !isNetMonitorPlay){
			delete _Items["singlePlay"];
		}

		$.contextMenu({
			selector: "#" + playerId,
			items: _Items,
			zIndex: 99999,
			animation: { duration : 150, show : "fadeIn", hide : "fadeOut" },
			callback: function(key, prop) {
				if(key === "snapshotSave"){
					_this.snapshotSave(playerId);
				}
				if(key === "fullScreen"){
					$("#" + playerId).dblclick();
				}
				if(key === "singlePlay"){
					_this.removeGridPlayer(playerId);
					_this.createSinglePlayer({ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPreview" : isPreview });
				}
				if(key === "addGridPlay"){
					$("#" + playerId).dialog("close");
					_this.addGridPlayer({ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPreview" : isPreview });
				}
				if(key === "movePosition"){
					var feature = ("getFeaturesByKeyValue" in GMXMAP) ? GMXMAP.getFeaturesByKeyValue("asset_cctv", "mgr_no", mgrNo) : null;
					if((feature != null) && (feature instanceof ol.Feature)){
						GMXMAP.addPulse(feature.getGeometry().getCoordinates(), true);
					}else{
						_common.callAjax("/cctv/getCctv.json", { "mgrNo" : mgrNo }, function(_cctvData){
							GMXMAP.addPulse([Number(_cctvData.result.point[0]), Number(_cctvData.result.point[1])], true);
						}, false);
					}
				}
				if(key === "stopPlay"){
					if(isMultiplePlay) _this.removeGridPlayer(playerId);
					if(!isMultiplePlay && !isNetMonitorPlay) $("#" + playerId).dialog("close");

					_this.removePlayingIcon(mgrNo);
					GMXMAP.redrawAllVisibleVector();

				}
			}
		});
	},

	/**
	 * XEUS Player 를 생성합니다.
	 *
	 * @param playerId
	 * @param mgrNo
	 * @param isMultiplePlay
	 * @param isNetMonitor
	 * @param isPreview
	 * @returns {XeusGate.Player}
	 */
	createXeusGatePlayer : function(playerId, mgrNo, cctvNm, isMultiplePlay, isNetMonitorPlay, isPreview, isPlay){
		var _this = this;

		var $menuWrap = $("<div>").addClass("menuWrap").css({ "background-color": "#0078d4", "position": "absolute", "width": "160px", "top": "0", "left": "0", "z-index": "10", "display" : "none" });

		//true인 경우 재생 안됨.
		var hasCCTVWANPlay = false;
		var isCCTVPlayNotAuth = false;
		var hasPlayAuth = false;


		/**
		 * 관리번호에 F가 들어갈 경우만 광역 게이트로 ...! 맞나?
		 */
		if (  cctvNm.substring(0,1) === 'F' ) {
			hasCCTVWANPlay = GMXCCTV.isCCTVPlayerWAN() ;
			if ( hasCCTVWANPlay ) hasPlayAuth = true;
		} else {
			hasCCTVWANPlay = true;
			_common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPLAY" }, function(json){ hasPlayAuth = json.result; }, false);
		}


		var player = new XeusGate.Player({
			url : _this.getXeusGateURL(),
	        playerId : playerId,
	        cctvMgrNo: mgrNo,
	        cctvNm : cctvNm,
        	userId: userId,
			evtType : "",
            timestamp : "",
            speed : "",
            rtspUrl : "",
            codec : _this.Codec,
            debug : true,
            etc : { hasCCTVWANPlay : hasCCTVWANPlay, hasPlayAuth : hasPlayAuth }
	    });

		_this.PlayingCctvList.push(mgrNo);
		GMXMAP.reloadLayerData("asset_cctv");

		var $PLAYER = $("#" + playerId).addClass("XEUS-PLAYER");
		$PLAYER.parent().addClass("XEUS-PLAYER-DIALOG");
		$PLAYER.css({
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-khtml-user-select" : "none",
			"-ms-user-select" : "none",
			"user-select" : "none",
		}).dblclick(function(){
			if(!document.fullscreenElement){
				$(this).attr("w", $(this).width()).attr("h", $(this).height()).width("100%").height("100%");
				$(this).parent()[0].requestFullscreen();
			}else{
				if(document.exitFullscreen){
					document.exitFullscreen();
					$(this).width($(this).attr("w")).height($(this).attr("h"));
				}
			}
		});

		this.createPlayerContextMenu(playerId, mgrNo, cctvNm, isMultiplePlay, isNetMonitorPlay, isPreview);

		//그리드 옵션입니다.
		if(isMultiplePlay){
			this.gridPlayerList.push(player);
			if(isPlay){
				_this.createCustomPreviewProgressBar($PLAYER, function(){
					_this.removeGridPlayer(player.options.playerId);
					_this.removePlayingIcon(player.options.cctvMgrNo);
					GMXMAP.redrawAllVisibleVector();
				});
			}else if(isPreview){
				_this.createPreviewProgressBar($PLAYER, function(){
					_this.removeGridPlayer(player.options.playerId);
					_this.removePlayingIcon(player.options.cctvMgrNo);
					GMXMAP.redrawAllVisibleVector();
				});
			}
		}

		//투망 옵션입니다.
		if(isNetMonitorPlay){
			this.netMonitorPlayerList.push(player);
			if(isPlay){
				_this.createCustomPreviewProgressBar($PLAYER, function(){
					player.destroy();
				});
			}else if(isPreview){
				_this.createPreviewProgressBar($PLAYER, function(){
					player.destroy();
				});
			}
		}

		//단독 옵션입니다.
		if(!isMultiplePlay && !isNetMonitorPlay){
			this.addPTZButtons(playerId, mgrNo);
			this.addPresetButtons(playerId, mgrNo);
			if(isPlay){
				_this.createCustomPreviewProgressBar($PLAYER, function(){
					$PLAYER.dialog("close");
				});
			}else if(isPreview){
				_this.createPreviewProgressBar($PLAYER, function(){
					$PLAYER.dialog("close");
				});
			}
		}

		return player;
	},

	/**
	 * 영상 재생 요청 Dialog를 생성합니다.
	 *
	 * @param _param - CCTV 재생 파라미터 { mgrNo: "CTV0001785", cctvNm: "CCTV카메라", isPreview: false }
	 * 												투망 재생일경우 isNet : true 추가 필요
	 */
	createPreviewRequest : function(_param){
		var _html = '';
		_html += '<div id="previewInfo" class="table_style customScroll" style="display: none;"> ';
		_html += '    <table> ';
		_html += '      <tbody> ';
		_html += '        <tr> ';
		_html += '            <th width="200"><label>신청사유</label></th> ';
		_html += '            <td><input type="text" class="sendData wide" id="reqResn"></td> ';
		_html += '        </tr> ';
		_html += '        <tr> ';
		_html += '            <th><label>비밀번호</label></th> ';
		_html += '            <td><input type="password" class="sendData wide" id="usrPwd"></td> ';
		_html += '        </tr> ';
		_html += '        <tr> ';
		_html += '            <td colspan="2">승인시 영상이 자동 재생되며 브라우저를 종료할 경우 다시 요청해야 합니다.</td> ';
		_html += '        </tr> ';
		_html += '      </tbody> ';
		_html += '    </table> ';
		_html += '    <button id="saveBtn" class="btn_style">재생 요청</button> ';
		_html += '</div> ';

		$("#parentBody").append(_html);

		$("#previewInfo").dialog({
			title: "영상 재생 요청",
			modal: true,
			resizable: false,
			width: 700,
			height: 270,
			position: {
				my: "center center",
				at: "center center",
				of: $("#map")
			},
			open: function(){
			},
			close: function(){
				$("#previewInfo").dialog("destroy");
				$("#previewInfo").remove();
			}
		}).parent().draggable({
			containment: "#map",
			scroll: false
		});

		$("#previewInfo").find("#usrPwd").keyup(function(e){
	        if(e.which == 13){
	        	$("#previewInfo").find("#saveBtn").click();
	        }
	    });

		$("#previewInfo").find("#saveBtn").click(function(){
			var usrPwd = $("#previewInfo").find("#usrPwd").val();
			_common.callAjax("/user/checkPassword.json", { "userPwd" : usrPwd }, function(pwd){
				if(pwd.result){
					var _cctv = _param;
					var isMultiple = false;
					if(_param instanceof Array){
						isMultiple = true;
						_cctv = _param[0];
					}
					var isNet = false;

					var cctvNm = _cctv["cctvNm"];
					var point = null;

					var netCctvData = null;
					if(("isNet" in _param) && _param.isNet === true){
						isNet = true;
						netCctvData = new Array();
						cctvNm = "투망 모니터링 (경도 : " + String(_param.lon) + ", 위도 : " + String(_param.lat);

						_common.callAjax("/cctv/getNetCctvList.json", _param, function(_netData){
							point = [Number(_netData.center.centerX), Number(_netData.center.centerY)];
							netCctvData = _netData.result;
						}, false);
					}else{
						_common.callAjax("/cctv/getCctv.json", { "mgrNo" : _cctv["mgrNo"] }, function(_cctvData){
							point = [Number(_cctvData.result.point[0]), Number(_cctvData.result.point[1])];
						}, false);
					}

					var lonlat = Spatial.convertProjection(point, "EPSG:5186", "EPSG:4326");
					var _Json = xeusJsonParser.getTemplate();

					var param = {
						userId : userId,
						cctvNm : cctvNm,
						reqDat : new Date().getYMDHMS(),
						reqResn : $("#previewInfo").find("#reqResn").val(),
						acciNum : $("#previewInfo").find("#acciNum").val(),
						cctvMgrNo : _cctv["mgrNo"],
						cctv : _param
					}

					_Json.statEvetTypCd = "CCTVPREVREQ";
					_Json.statEvetNm = "영상 재생 요청";
					_Json.statEvetCntn  = "사용자(" + userId + ")가 " + cctvNm + " 영상 재생을 요청하였습니다.";
					if(isMultiple) _Json.statEvetCntn  = "사용자(" + userId + ")가 " + cctvNm + " (외 " + (_param.length - 1) + " 건) 영상 재생을 요청하였습니다.";
					if(isNet) _Json.statEvetCntn  = "사용자(" + userId + ")가 " + cctvNm + " 재생을 요청하였습니다.";
					_Json.statEvetCntn += "<br><br>신청사유 : " + param["reqResn"];
					_Json["x"] = String(lonlat[0]);
					_Json["y"] = String(lonlat[1]);
					_Json["tmx"] = String(point[0]);
					_Json["tmy"] = String(point[1]);
					_Json.statEvetOutbDtm = new Date().getYMDHMS();
					_Json.statEvetClrDtm = "";
					_Json.statEvetActnMn = "";
					_Json.statEvetActnCntn = "";
					_Json.procSt = "10";
					_Json.isTest = "N";
					_Json.uSvcOutbId = "";
					_Json.statEvetSvcTyp = "CCTVPREVREQ";
					_Json.outbPosNm = cctvNm;
					if(isMultiple) _Json.outbPosNm = cctvNm + " (외 : " + (_param.length - 1) + " 건)";
					_Json.outbPos[0].x = String(lonlat[0]);
					_Json.outbPos[0].y = String(lonlat[1]);
					_Json.etcCntn = JSON.stringify(param);

					_common.callAjax("/ws/addEvent.json", { "json" : JSON.stringify(_Json) }, function(_json){
						if(_json.result){
							if(isMultiple){
								for(var i=0; i<_param.length; i++){
									param = {
										userId : userId,
										cctvNm : _param[i].cctvNm,
										reqResn : $("#previewInfo").find("#reqResn").val(),
										acciNum : $("#previewInfo").find("#acciNum").val(),
										cctvMgrNo : _param[i].mgrNo,
										cctv : _param[i]
									}
									_common.callAjax("/cctvPreview/add.json", param, function(){});
								}
							}else if(isNet){
								for(var i=0; i<netCctvData.length; i++){
									param = {
										userId : userId,
										cctvNm : netCctvData[i].cctvNm,
										reqResn : $("#previewInfo").find("#reqResn").val(),
										acciNum : $("#previewInfo").find("#acciNum").val(),
										cctvMgrNo : netCctvData[i].mgrNo,
										cctv : netCctvData[i]
									}
									_common.callAjax("/cctvPreview/add.json", param, function(){});
								}
							}else{
								_common.callAjax("/cctvPreview/add.json", param, function(){});
							}

							$("#previewInfo").dialog("close");
						}
					}, false);
				}
			}, false);

		});
	},

	/**
	 * XEUS-GATE PLAYER 에 제어 아이콘을 생성합니다.
	 */
	addPTZButtons : function(playerId, mgrNo){


		var _this = this;
		var $PLAYER = $("#" + playerId);
		var $zoomIn = $("<span class='ptzBtn' id='ptzZoomIn'></span>").data({"type" : "ZoomIn", "mgrNo" : mgrNo});
		var $zoomOut = $("<span class='ptzBtn' id='ptzZoomOut'></span>").data({"type" : "ZoomOut", "mgrNo" : mgrNo});

		var $ptzTop = $("<span class='ptzBtn' id='ptzTop'></span>").data({"type" : "Up", "mgrNo" : mgrNo});
		var $ptzBottom = $("<span class='ptzBtn' id='ptzBottom'></span>").data({"type" : "Down", "mgrNo" : mgrNo});
		var $ptzLeft = $("<span class='ptzBtn' id='ptzLeft'></span>").data({"type" : "Left", "mgrNo" : mgrNo});
		var $ptzRight = $("<span class='ptzBtn' id='ptzRight'></span>").data({"type" : "Right", "mgrNo" : mgrNo});

		var $ptzTopLeft = $("<span class='ptzBtn' id='ptzTopLeft'></span>").data({"type" : "LeftUp", "mgrNo" : mgrNo});
		var $ptzTopRight = $("<span class='ptzBtn' id='ptzTopRight'></span>").data({"type" : "RightUp", "mgrNo" : mgrNo});
		var $ptzBottomLeft = $("<span class='ptzBtn' id='ptzBottomLeft'></span>").data({"type" : "LeftDown", "mgrNo" : mgrNo});
		var $ptzBottomRight = $("<span class='ptzBtn' id='ptzBottomRight'></span>").data({"type" : "RightDown", "mgrNo" : mgrNo});

		var $ptzWrap = $("<div class='ptzWrap' id='ptzWrap'></div>").css({
			"position": "absolute",
			"width": "100%",
			"height": "100%",
			"top": "0px",
			"left": "0%",
			"z-index": "1",
			"display": "none"
		}).append($zoomIn).append($zoomOut)
		  .append($ptzTop).append($ptzBottom).append($ptzLeft).append($ptzRight)
		  .append($ptzTopLeft).append($ptzTopRight).append($ptzBottomLeft).append($ptzBottomRight);

		$ptzWrap.find(".ptzBtn").mousedown(function(){

			var ptzParams = { "cctvMgrNo" : $(this).data().mgrNo, "action" : "start", "code" : $(this).data().type };
			$.get(_this.getXeusGateAPIURL() + "/setPTZ.json", ptzParams);

		}).mouseup(function(){

			var ptzParams = { "cctvMgrNo" : $(this).data().mgrNo, "action" : "stop", "code" : $(this).data().type };
			$.get(_this.getXeusGateAPIURL() + "/setPTZ.json", ptzParams);
		});

		$PLAYER.append($ptzWrap);
	},


	/**
	 * XEUS-GATE PLAYER 에 프리셋 제어 아이콘을 생성합니다.
	 */
	addPresetButtons : function(playerId, mgrNo){

		var _this = this;
		var $PLAYER = $("#" + playerId);

		var $presetWrap = $("<div class='presetWrap' id='presetWrap'></div>").css({
			"position": "absolute",
			"width": "100%",
			"height": "100%",
			"top": "0px",
			"left": "0%",
			"z-index": "1",
			"display": "none"
		});



		var param = {};
		param['cctvMgrNo'] = mgrNo;

		_common.callAjax("/preset/getPresets.json", param, function(json){
			$PLAYER
			var presetList = json.presets;
			for(var i=0; i<presetList.length; i++){
				var $preset = $("<button class='preset'></button>").data({"presetNo" : presetList[i], "cctvMgrNo" : mgrNo}).text(presetList[i]).click(function(){
					var presetNo = $(this).data().presetNo;
					var cctvMgrNo =  $(this).data().cctvMgrNo;

					var param = {};
					param['presetNo'] = presetNo;
					param['cctvMgrNo'] = cctvMgrNo;

					_common.callAjax("/preset/gotoPreset.json", param, function(json){

						if(json.result != true){
							alert(presetNo+" 프리셋으로 이동에 실패했습니다.");
						}
					},false);

				});
				$presetWrap.append($preset);
			}

			$PLAYER.append($presetWrap);

		},false);

	},

	/**
	 * GRID 재생 모음 객체 입니다.
	 * 현재 재생중인 GRID Player 객체가 저장됩니다.
	 */
	gridPlayerList : new Array(),
	isGridPlaying : function(){
		if(this.gridPlayerList != null && this.gridPlayerList instanceof Array){
			if(this.gridPlayerList.length === 0){
				return false;
			}else {
				return true;
			}
		}else{
			return false;
		}
	},
	getSimpleGridPlayingData : function(){
		var dataList = new Array();
		for(var i=0; i<this.gridPlayerList.length; i++){
			var options = this.gridPlayerList[i].options;
			dataList.push({ "mgrNo" : options.cctvMgrNo, "cctvNm" : options.cctvNm, "idx" : i });
		}

		return dataList;
	},
	removeGridPlayer : function(playerId){
		if(this.isGridPlaying){
			for(var i=0; i<this.gridPlayerList.length; i++){
				if("playerId" in this.gridPlayerList[i].options){
					if(playerId === this.gridPlayerList[i].options.playerId){
						if(this.gridPlayerList[i] != null && this.gridPlayerList[i] instanceof XeusGate.Player){
							this.gridPlayerList[i].destroy();
							this.gridPlayerList[i] = null;
							this.gridPlayerList.splice(i, 1);

							var $GRID_PLAYER_ITEM = $("#" + playerId);
							if( $GRID_PLAYER_ITEM.length > 0 ){
								$GRID_PLAYER_ITEM.parent().remove();
								$GRID_PLAYER_ITEM = null;
							}

							break;
						}
					}
				}
			}
		}
	},
	clearAllGridPlayers : function(){
		if(this.gridPlayerList != null && this.gridPlayerList instanceof Array && this.gridPlayerList.length > 0){
			for(var i=0; i<this.gridPlayerList.length; i++){
				if(this.gridPlayerList[i] != null && this.gridPlayerList[i] instanceof XeusGate.Player){
					this.gridPlayerList[i].destroy();
					this.gridPlayerList[i] = null;
				}
			}

			var isAllNull = true;
			for(var i=0; i<this.gridPlayerList.length; i++){
				if(this.gridPlayerList[i] != null && this.gridPlayerList[i] instanceof XeusGate.Player){
					isAllNull = false;
					console.error("Not removed XEUS-PLAYER.");
				}
			}

			if(isAllNull){
				this.gridPlayerList = null;
				this.gridPlayerList = new Array();
				$("#gridMonitoringWrap").html("");
			}
		}

		return this;
	},

	/**
	 * 투망 재생 모음 객체 입니다.
	 * 현재 재생중인 투망 Player 객체가 저장됩니다.
	 */
	netMonitorPlayerList : new Array(),
	isNetMonitoringPlaying : function(){
		if(this.netMonitorPlayerList != null && this.netMonitorPlayerList instanceof Array){
			if(this.netMonitorPlayerList.length === 0){
				return false;
			}else {
				return true;
			}
		}else{
			return false;
		}
	},
	removeAllMonitorPlayer : function(){
		if(this.netMonitorPlayerList != null && this.netMonitorPlayerList instanceof Array && this.netMonitorPlayerList.length > 0){
			for(var i=0; i<this.netMonitorPlayerList.length; i++){
				if(this.netMonitorPlayerList[i] != null && this.netMonitorPlayerList[i] instanceof XeusGate.Player){
					this.netMonitorPlayerList[i].destroy();
					this.netMonitorPlayerList[i] = null;
				}
			}

			var isAllNull = true;
			for(var i=0; i<this.netMonitorPlayerList.length; i++){
				if(this.netMonitorPlayerList[i] != null && this.netMonitorPlayerList[i] instanceof XeusGate.Player){
					isAllNull = false;
					console.error("Not removed XEUS-PLAYER.");
				}
			}

			if(isAllNull){
				this.netMonitorPlayerList = null;
				this.netMonitorPlayerList = new Array();
			}
		}

		return this;
	},

	stopNetMornitoring : function(){
		this.removeAllMonitorPlayer();

		if(GMXMAP){
			if(GMXMAP["vectorCircleLayer"]) GMXMAP["vectorCircleLayer"].getSource().clear();
			if(GMXMAP["eventVectorLayer"]) GMXMAP["eventVectorLayer"].getSource().clear();
			if(GMXMAP["vectorPointLayer"]) GMXMAP["vectorPointLayer"].getSource().clear();
			if(GMXMAP["vectorLineLayer"]) GMXMAP["vectorLineLayer"].getSource().clear();
		}

		var HD_Player = $("#HD_Player").data("HD_Player");
		if(HD_Player != null && HD_Player instanceof XeusGate.Player){
			HD_Player.destroy();
			HD_Player = null;
			$("#HD_Player").removeData();
		}

		return this;
	},

	startNetMornitoring : function(_json, _isPreview){

		var _this = this;

		_this.removePlayingIconAtNet();
		GMXMAP.redrawAllVisibleVector();

		var isPreview = false;
		var isPlay = false;

		// json형태의 문자열로 호출되면 문자열을 json으로 변환
		if(typeof(_json) == 'string'){
			_json = JSON.parse(_json);
		}

		if(_isPreview) isPreview = true;
		if("isPlay" in _json) isPlay = _json.isPlay;

		var isPass = false;
		if($("#netMonitoringWrap").dialog("isOpen")) _this.stopNetMornitoring();

		if(window.isOuterUser == "Y"){
			_common.callAjax("/user/getItem.json", { "userId" : userId }, function(json){
				if(json.result.outStream == "Y") isPass = true;
			}, false);
		}else{
			isPass = true;
		}

		if(!isPass){
			alert("외부 영상재생 권한이 존재하지 않습니다.\n\n관리자에게 문의해주세요.");
		}

		if(isPass){

			$("#netMonitoringWrap").dialog({
				title: "투망 모니터링",
				width: 660,
				height: $("#map").height(),
				position: {
					my: "right top",
					at: "right top",
					of: $("#map")
				},
				open: function(){

				},
				beforeClose: function(){
					return confirm("투망 모니터링을 종료하시겠습니까?");
				},
				close: function(){
					_this.removePlayingIconAtNet();
					GMXMAP.redrawAllVisibleVector();

					_this.stopNetMornitoring();
				}
			}).dialog("open");

			_common.callAjax("/auth/hasEvtAuth.json", {authData : "CCTVPLAY"}, function(json){
				if(json.result){

					var _param = _json
					if(typeof _json == "string") _param = JSON.parse(decodeURIComponent(_json));
					if(_param['stateCd'] == "장애" || _param['stateCd'] == "12"){
						alert('장애 CCTV는 투망모니터링 기능이 지원되지 않습니다.');
						return;
					}

					_this.stopNetMornitoring().createNetPane(_param['dist']);

					//투망모니터링 대상 CCTV 목록 리턴(vo 리스트 및 중심좌표가 넘어옴)
					var netCenter;
					if("point" in _param) netCenter = _param["point"];
					if("srid" in _param) netCenter = Spatial.convertProjection([Number(_param.lon), Number(_param.lat)], "EPSG:4326", "EPSG:5186");

					_common.callAjax("/cctv/getNetCctvList.json", _param, function(json){

						//리턴값이 있을때만 실행
						if (json.result != null){

							if(GMXMAP["eventVectorLayer"] != null) GMXMAP["eventVectorLayer"].getSource().clear();

							var dist = 500;
							var arrow_features = [];

							for(var i=0; i<json.result.length; i++){
								(function(i){
									var cctvParam = json.result[i];
									if(cctvParam.mgrNo != null){
										cctvParam["point"] = Spatial.convertProjection([Number(cctvParam.lng), Number(cctvParam.lat)], "EPSG:4326", "EPSG:5186");

										//반복문을 통해 CCTV 하나씩 영상을 패널에 추가
										cctvParam["isPlay"] = isPlay;
										_this.showNetMornitorInGridPane(cctvParam, isPreview);
										//지도상에 방향 표시를 위한 피쳐 생성
										arrow_features.push(_this.makeArrowFeature(cctvParam));
										//가장 거리가 먼 cctv와의 거리를 저장
										if(dist < cctvParam['dist']) dist = cctvParam['dist'];
									}
								})(i);
							}

							GMXMAP["vectorPointLayer"] = _this.createPointLayer(arrow_features);
							GMXMAP["vectorPointLayer"].setStyle(function(_feature) {
								var _code = _feature.getProperties().name;
								var features = GMXMAP["vectorPointLayer"].getSource().getFeatures();
								var style = null;
								for(var i=0; i<features.length; i++){
									if(features[i].getProperties().name == _code){
										style = new ol.style.Style({
											image: new ol.style.Icon({
												src: './res/img/cctv/cctv_'+_code+'.png'
											})
										});
									}
								}
								if(style == null){
									style = new ol.style.Style({
										image: new ol.style.Icon({
											src: './res/img/cctv/cctv_center.png'
										})
									});
								}
								return (style) ? style : null;
							});
							GMXMAP.addLayer(GMXMAP["vectorPointLayer"]);

							//가상의 선을 그릴 때 여유있게 그리기 위해 dist를 늘림.
							dist += 10;
							//투망 모니터링 시의 중심좌표를 얻는다.
							var centerX = Number(json.center.centerX);
							var centerY = Number(json.center.centerY);

							GMXMAP["vectorLineLayer"] = _this.createLineLayer(centerX, centerY, dist);
							GMXMAP.addLayer(GMXMAP["vectorLineLayer"]);

							var radius = Number(json.center.dist);

							if(radius > 0){
								GMXMAP["vectorCircleLayer"] = _this.createCircleLayer(centerX, centerY, radius);
								GMXMAP.addLayer(GMXMAP["vectorCircleLayer"]);
							}

							/////////////////////////////////////////////////////////////////

							//화면에 보일 영역은 그려진 가상의 선보다 넓게 보여야 보기 좋음.
							//일정 값을 더 더함.
							dist += 20;

							//중심 좌표로부터 계산된 dist만큼 떨어진 영역을 구한다.
							var extent = [centerX - dist, centerY - dist, centerX + dist, centerY + dist];
							//구한 영역으로 화면을 이동한다.
							GMXMAP.getView().fit( extent, GMXMAP.getSize() );
						}
					}, false);

				}else{
					alert("CCTV 재생 권한이 존재하지 않습니다.");
				}
			}, false);
		}
	},

	showNetMornitorInGridPane : function(_cctv, _isPreview) {
		var _this = this;

		var netSchGbn = _cctv['netSchGbn'];
		var gid = _cctv['gid'];
		var mgrNo = _cctv['mgrNo'];
		var cctvNm = _cctv['cctvNm'];
		var gbnCd = _cctv['gbnCd'];
		var point = _cctv['point'];
		var playerId = "net_" + netSchGbn;
		var isPlay = false;

		if(typeof _cctv === "object"){
			if("isPlay" in _cctv) isPlay = _cctv.isPlay;
		}

		//var src = './sym/getSymbol.do?mgrNo=' + xeusCCTV.cctv.SYM_ICON[gbnCd];
		//var $img = $("<img>").addClass("xeus-dialog-title-icon").attr("src", src);
		var $titleDiv = $("<span>").addClass("cctvTitle").attr("title", cctvNm).text(cctvNm);
		var $playerWrap = $("<div>").addClass("netPlayer").attr("id", playerId).append($titleDiv);
		$("#netGrid").find("#" + netSchGbn).html("").append($playerWrap);

		var _player = _this.createXeusGatePlayer(playerId, mgrNo, cctvNm, false, true, _isPreview, isPlay);

		$("#netGrid").find("#" + netSchGbn).data("gid", gid);
		$("#netGrid").find("#" + netSchGbn).data("mgrNo", mgrNo);
		$("#netGrid").find("#" + netSchGbn).data("gbnCd", gbnCd);
		$("#netGrid").find("#" + netSchGbn).data("point", point);

	},

	createNetPane : function(dist){

		var _param = {};
		if(!_common.utils.isNullAndEmpty(dist)) _param["dist"] = dist;

		_common.callAjax("/cctv/getNetView.do", _param, function(view) {

			$("#netMonitoringWrap").html(view);

		}, false);

		return this;
	},

	makeLineStringFeature : function(start_x, start_y, end_x, end_y){
		return new ol.Feature({
			geometry: new ol.geom.LineString([ [ start_x, start_y ], [ end_x, end_y ] ])
		});
	},

	createLineLayer : function(centerX, centerY, dist){
		var vertical_feature = this.makeLineStringFeature( centerX, centerY - dist, centerX, centerY + dist );
		var horizontal_feature = this.makeLineStringFeature( centerX - dist, centerY, centerX + dist, centerY );
		var first_diagonal_feature = this.makeLineStringFeature( centerX - dist, centerY - dist, centerX + dist, centerY + dist );
		var second_diagonal_feature = this.makeLineStringFeature( centerX - dist, centerY + dist, centerX + dist, centerY - dist );

		var style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'rgba(255, 54, 14, 0.8)',
				width: 3,
				lineDash: [.1, 5]
			})
		});

		var lineSource = new ol.source.Vector({ wrapX: false });

		lineSource.addFeature(vertical_feature);
		lineSource.addFeature(horizontal_feature);
		lineSource.addFeature(first_diagonal_feature);
		lineSource.addFeature(second_diagonal_feature);

		return new ol.layer.Vector({
			name: "net_line",
			zIndex : 999999,
			type: "MULTILINESTRING",
		    source: lineSource,
		    style: style
		});
	},

	makeCircleFeature : function(x, y, radius){
		return new ol.Feature({
			geometry: new ol.geom.Circle([ x, y ], radius)
		});
	},

	createCircleLayer : function(centerX, centerY, radius){
		var circle_feature = GMXCCTV.makeCircleFeature(centerX, centerY, radius);
		var circleSource = new ol.source.Vector({ wrapX: false });

		circleSource.addFeature(circle_feature);

		var style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "rgba(255, 54, 14, 0.8)",
				width: 3,
				lineDash: [.1, 5]
			})
		});

		return new ol.layer.Vector({
			name: "net_circle",
			zIndex : 999999,
		    source: circleSource,
		    style: style
		});
	},

	makeArrowFeature : function(cctvParam){
		return new ol.Feature({
			geometry: new ol.geom.Point(cctvParam['point']),
			name: cctvParam['netSchGbn']
		});
	},

	createPointLayer : function(features){
		var pointSource = new ol.source.Vector({ wrapX: false });

		for(var i=0; i<features.length; i++){
			pointSource.addFeature(features[i]);
		}

		return new ol.layer.Vector({
			name: "net_point",
			zIndex : 999999,
			type: "POINT",
		    source: pointSource
		});
	},
	/**
	 *  mgrNo에 대응하는 CCTV가 play 아이콘이면 일반 아이콘으로 변경
	 * @param mgrNo
	 */
	removePlayingIcon : function(mgrNo){

		for(var i = 0; i < this.PlayingCctvList.length; i++) {
		  if(this.PlayingCctvList[i] === mgrNo)  {
			  this.PlayingCctvList.splice(i, 1);
		    i--;
		  }
		}

	},
	/**
	 *  그리드에 있는 모든 CCTV의 play 아이콘을 일반 아이콘으로 변경
	 */
	removePlayingIconAtGrid : function(){

		if(this.gridPlayerList != null && this.gridPlayerList instanceof Array && this.gridPlayerList.length > 0){
			for(var i=0; i<this.gridPlayerList.length; i++){
				if(this.gridPlayerList[i] != null && this.gridPlayerList[i] instanceof XeusGate.Player){
					this.removePlayingIcon(this.gridPlayerList[i].options.cctvMgrNo);
				}
			}

		}

	},

	/**
	 *  투망 모니터링에 있는 모든 CCTV의 play 아이콘을 일반 아이콘으로 변경
	 */
	removePlayingIconAtNet : function(){

		if(this.netMonitorPlayerList != null && this.netMonitorPlayerList instanceof Array && this.netMonitorPlayerList.length > 0){
			for(var i=0; i<this.netMonitorPlayerList.length; i++){
				if(this.netMonitorPlayerList[i] != null && this.netMonitorPlayerList[i] instanceof XeusGate.Player){
					this.removePlayingIcon(this.netMonitorPlayerList[i].options.cctvMgrNo);
				}
			}
		}

	},

	/**
	 * 광역 CCTV 재생 권한이 있는지 체크.
	 */
	isCCTVPlayerWAN : function() {

		var isAuth = false;

		_common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVWAN" }, function(json){
			if(json.result) {
				isAuth = true;
			}
		}, false);

		return isAuth;

	}
}

//	var ptzParams = { "cctvMgrNo" : $(this).data().mgrNo, "action" : "stop", "code" : $(this).data().type };
//	$.get(_this.getXeusGateAPIURL() + "/setPTZ.json", ptzParams);
//});


/*
 * keycode값을 실제 키값으로 변환한다.(단 1~9까지만 가능)
 */
var getKey = function(keyCode){
	var result = null;
	if(keyCode == 49) result = 1;
	else if(keyCode == 50)result =2;
	else if(keyCode == 51)result =3;
	else if(keyCode == 52)result =4;
	else if(keyCode == 53)result =5;
	else if(keyCode == 54)result =6;
	else if(keyCode == 55)result =7;
	else if(keyCode == 56)result =8;
	else if(keyCode == 57)result =9;

	return result;
}

/*
 * GMXCCTV 선영상재생 객체를 초기화 합니다
 */
GMXCCTV.init();