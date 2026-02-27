/**
 * <pre>
 * 영상반출관련 이벤트 입니다.
 * </pre>
 *
 * @auther 이은규(xeusGlobalCCTV 복사)
 */
Public.TVIUS = {


	Init : {
		Clear : function() {
			//페이지 이동 시 setTimeout으로 작동중이던 interval을 모두 종료
			if (intervalListChk !== null)	clearTimeout(intervalListChk);
			if (intervalPrevDown !== null)	clearTimeout(intervalPrevDown);
			if (intervalStat !== null)		clearTimeout(intervalStat);
			if (intervalPrev !== null)		clearTimeout(intervalPrev);
			if (intervalRqst !== null)		clearTimeout(intervalRqst);
			if (intervalService !== null)	clearInterval(intervalService);
		}
	},
	Map : {
		Clear : function() {
			//페이지 이동 시 히트맵 레이어, 차량운행겁색 레이어를 삭제
			if (crmsHeatLayer != null){
				if(GMXMAP) GMXMAP.removeLayer(crmsHeatLayer);
				if(GMXMAP) GMXMAP.removeLayer(crmsHeatLayer);
			}
			if (crmsCarSchLayer != null) crmsCarSchSource.clear();
			if (crmsCarSchLayer != null){
				if(GMXMAP) GMXMAP.removeLayer(crmsCarSchLayer);
				if(GMXMAP) GMXMAP.removeLayer(crmsCarSchLayer);
			}
		}
	},
	Car : {
		Clear : function() {
			//페이지 이동 시 히트맵 레이어, 차량운행겁색 레이어를 삭제
			if ($('#car-sch-image-panel').length > 0) $('#car-sch-image-panel').remove();
		}
	},
	Search : {

		vector : null,
		interaction : null,

		Start : function() {
			if (Public.StopEvent != null && Public.TVIUS.Search.interaction != null) {
				Public.TVIUS.Search.interaction.setActive(true);
				return false;
			}

			this.vector = new ol.layer.Vector({
				source : new ol.source.Vector({
					wrapX : false
				})
			});

			var target = '.contentWrapper';
			var reqGbn = '';
			if($('.aviWrapper').is(':visible')){
				target = '.aviWrapper';
				reqGbn = '반출';//열람도 똑같은 로직이므로 반출로 통일
			}else if($('.carWrapper').is(':visible')){
				target = '.carWrapper';
				reqGbn = '차량번호';
			}

			var drawMode = $(".drawType:checked").val();
			var geometryFunction = null;
			if(drawMode == "Box"){
				drawMode = "Circle";
				geometryFunction = ol.interaction.Draw.createBox();
			}

			this.interaction = new ol.interaction.Draw({
				source : Public.TVIUS.Search.vector.getSource(),
				type : drawMode,
				geometryFunction : geometryFunction
			});
			this.interaction.on("drawstart", function(e){
				var features = Public.TVIUS.Search.vector.getSource().getFeatures();
				for(var i=0; i<features.length; i++){
					Public.TVIUS.Search.vector.getSource().removeFeature(features[i]);
				}
			});
			this.interaction.on("drawend", function(e) {

				var param = {};
				var geometry = e.feature.getGeometry();
				if(geometry.getRadius != null){
					var radius = geometry.getRadius();
					var center = geometry.getCenter();
					param["radius"] = radius;
					param["center"] = "POINT(" + center.join(" ").toString() + ")";
				}else{
					var format = new ol.format.WKT();
					var wkt = format.writeGeometry(e.feature.getGeometry());
					param["wkt"] = wkt;
				}

				if(target != ''){
					//장애 CCTV는 검색되지 않게 하는 파라미터
					//state_cd 12를 제외한 나머지가 검색된다.
					//현재 장애 CCTV여도 과거 영상은 존재할 수도 있으므로 주석처리 해놓음.
					//param['stateCd'] = '12';
					_common.callAjax("/cctv/getCctvList.json", param, function(json){
						Public.TVIUS.Search.excelParam = param;
						if(json.result.length == 0){
							//var $tr = $("<tr><td colspan='3' class='tCenter'>결과가 존재하지 않습니다.</td></tr>");
							//$(".searchWrapper").find("#resultTable").find("tbody").html($tr);
							$(target).find("#resultCnt").text("검색결과 (총 0건)");
							alert('검색결과가 존재하지 않습니다.');
						}else{
							$(target).find("#resultCnt").text("검색결과 (총 " + json.count + "건)");
							$(target).find("#resultTable").find("tbody").html("");
							for(var i=0; i<json.result.length; i++){
								var label = "";
								try{
									if(json.result[i].cctvNm){
										if(json.result[i].cctvNm.contains(";")){
											if(json.result[i].cctvNm.match(/;/g).length >= 2){
												var list = json.result[i].cctvNm.split(";");
												label += list[0] + "\n" + list[2];
											}
										}
									}
								}catch(e){
									label = json.result[i].cctvNm;
								}

								var mgrNo = json.result[i].mgrNo;
								var cctvNm = json.result[i].cctvNm;
								var point = Spatial.convertProjection([json.result[i].lng, json.result[i].lat], "EPSG:4326", "EPSG:5186");
								var type = mgrNo.substring(0, 3);

								if(target == ".aviWrapper"){
									if ( SELECTED_CCTV_COUNT < 10){
										SELECTED_CCTV_COUNT++;
										addCctv(mgrNo, cctvNm, point, reqGbn);

										/**
										 * CCTV 추가 시 모든 CCTV row의 시간 유효성을 검사한다.
										 * tr 고유 식별자를 정하지 않고 모든 CCTV row를 다 돌린다.
										 */
										$('#tbl_cctv_list .cctv_row').each(function() {
											cctvTimeChk($(this).find('[name=cctv_sdate]'));
										});
									} else {
										alert("선택 할 수 있는 CCTV는 최대 10개입니다.");
										break;
									}
									if(resizeDone) resizeDone();
								} else if(target == ".carWrapper"){
									if ( SELECTED_CCTV_COUNT_CAR < 10){
										SELECTED_CCTV_COUNT_CAR++;
										addCctv(mgrNo, cctvNm, point, reqGbn);

										/**
										 * CCTV 추가 시 모든 CCTV row의 시간 유효성을 검사한다.
										 * tr 고유 식별자를 정하지 않고 모든 CCTV row를 다 돌린다.
										 */
										$('#tbl_cctv_list_car .cctv_row').each(function() {
											cctvTimeChk($(this).find('[name=cctv_sdate]'));
										});
									} else {
										alert("선택 할 수 있는 CCTV는 최대 10개입니다.");
										break;
									}
									if(resizeDone) resizeDone();
								}else if(target == ".contentWrapper"){
									var $tr = $("<tr class='tCenter search_result' k='" + json.result[i].mgrNo + "'></tr>");
									$tr.append("<td>"+(i+1)+"</td>");
									$tr.append("<td>" + _common.getCodeByName("C14", json.result[i].gbnCd) + "</td>");
									//$tr.append("<td>" + json.result[i].cctvNm + "</td>");
									$tr.append("<td><div class='tLeft sText' title='"+json.result[i].cctvNm+"'>" + label + "<div></td>");
									$tr.append("<td><button class='locBtn btn_t'>위치</button></td>");

									var prop = {
											gid : json.result[i].gid,
											mgrNo : json.result[i].mgrNo,
											gbnCd : json.result[i].gbnCd,
											angle : json.result[i].viewDir,
											cctvNm : json.result[i].cctvNm,
											channelNo : json.result[i].chnlNo,
											deviceId : json.result[i].deviceId,
											stateCd : json.result[i].stateCd,
											point : Spatial.convertProjection([json.result[i].lng, json.result[i].lat], "EPSG:4326", "EPSG:5186")
										};
									$tr.data(prop);

									$(target).find("#resultTable").find("tbody").append($tr);

									$(target).find(".paging_wrap").hide();
								}
							}

							/* 위치 버튼 이벤트입니다. */
							$(target).find("#resultTable").find(".locBtn").click(function(){
								var v = $(this).parent().parent().attr("k");
								var prop = $(this).parent().parent().data();
								try{
									GMXMAP.addPulse(prop.point, true);
								}catch(error){
									alert('위치정보가 없습니다.');
								}
							});
						}

						Public.StopEvent();
					});
				}

			});

			$(target).find("#drawCncl").show();
			GMXMAP.addLayer(this.vector);
			GMXMAP.addInteraction(this.interaction);

			Public.StopEvent = function() {
				$(target).find("#drawCncl").hide();
				if (this.TVIUS.Search.interaction != null) {
					GMXMAP.removeInteraction(this.TVIUS.Search.interaction);
					this.TVIUS.Search.interaction = null;
				}
				if (this.TVIUS.Search.vector != null) {
					GMXMAP.removeLayer(this.TVIUS.Search.vector);
					this.TVIUS.Search.vector = null;
				}
				this.StopEvent = null;
			}
		}
	},
	Teruten : {
		httpRequest: null,
		BrowserType: null,
		rqstUrl: null,
		strValue: null,
		CheckBrowser: function() {
			/*
			 * if(navigator.userAgent.toLowerCase().match(/windows/i)){ }else
			 */

			if (navigator.userAgent.toLowerCase().match(/android/i)) {
				return 503;
			} else if (navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod/i)) {
				return 504;
			} else if (navigator.userAgent.toLowerCase().match(/mac/i)) {
				return 505;
			}

			if (navigator.userAgent.toLowerCase().indexOf("swing") > -1) {
				return 501;
			} else if (navigator.userAgent.toLowerCase().indexOf("edge") > -1) {
				return 502;
			} else if (navigator.userAgent.toLowerCase().indexOf("trident") > -1) {
				var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);
				switch (trident[1]) {
				case "8.0":
					return 11;
				case "7.0":
					return 11;
				case "6.0":
					return 10;
				case "5.0":
					return 9;
				case "4.0":
					return 8;
				default:
					return 11;
				}
			} else if (navigator.appVersion.toLowerCase().indexOf("msie 6") > -1) {
				return 6;
			} else if (navigator.appVersion.toLowerCase().indexOf("msie 7") > -1) {
				return 7;
			} else if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1
					&& navigator.vendor.toLowerCase().indexOf("google") > -1
					&& navigator.userAgent.toLowerCase().indexOf("opr") <= -1) {
				return "Chrome";
			} else if (navigator.userAgent.toLowerCase().indexOf("mozilla") > -1
					&& navigator.userAgent.toLowerCase().indexOf("firefox") > -1
					&& navigator.userAgent.toLowerCase().indexOf("opr") <= -1) {
				return "Firefox";
			} else if (navigator.userAgent.toLowerCase().indexOf("mozilla") > -1
					&& navigator.userAgent.toLowerCase().indexOf("safari") > -1
					&& navigator.userAgent.toLowerCase().indexOf("opr") <= -1) {
				return "Safari";
			} else if (navigator.userAgent.toLowerCase().indexOf("mozilla") > -1
					&& navigator.userAgent.toLowerCase().indexOf("opr") > -1) {
				return "Opera";
			} else {
				return 100;
			}
		},

		chkVersion: function() {

			this.rqstUrl = "http://127.0.0.1:12331/";
			if (location.protocol == "https:")
				this.rqstUrl = "https://127.0.0.1:12332/";

			return this.makeRequestEx(this.rqstUrl + "Media/Version", "VERSION");

		},
		makeRequestEx: function(url, strValue) {

			var returnv = "";

			try {
				// BrowserType Set
				this.BrowserType = this.CheckBrowser();

				if (this.BrowserType >= 6 && this.BrowserType <= 7) // code for IE8이하
				{
					Public.TVIUS.Teruten.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} else // code for IE9+, Firefox, Chrome, Opera, Safari
				{
					Public.TVIUS.Teruten.httpRequest = new XMLHttpRequest();
				}

				switch (strValue) {
				case "MAC":
					returnv = this.getMac(url);
					break;

				case "HDD":
					returnv = this.getHdd(url);
					break;

				case "VERSION":
					returnv = this.getVersion(url);
					break;

				/*case "DOWNLOAD":
					this.GetDownloadResult(url);
					break;*/

				}

				return returnv;
			} catch (e) {
				return 0;
			}
		},

		chkMacAddress: function() {
			this.rqstUrl = "http://127.0.0.1:12331/";
			if(location.protocol == "https:")
				this.rqstUrl = "https://127.0.0.1:12332/";

			return this.makeRequestEx( this.rqstUrl + "Media/GetMacAddress" , "MAC");
		},

		chkHddSerial: function() {
			this.rqstUrl = "http://127.0.0.1:12331/";
			if(location.protocol == "https:")
				this.rqstUrl = "https://127.0.0.1:12332/";

			return this.makeRequestEx( this.rqstUrl + "Media/GetHddSerial" , "HDD");
		},
		getVersion: function(url) {
			var version_return = 0;
			try {
				Public.TVIUS.Teruten.httpRequest.open('POST', url, false);

				Public.TVIUS.Teruten.httpRequest.onreadystatechange = function() {
					if (Public.TVIUS.Teruten.httpRequest.readyState === 4) {
						if (Public.TVIUS.Teruten.httpRequest.status === 200) {
							if (Public.TVIUS.Teruten.httpRequest.responseText >= TERUTEN_VERSION) {
								// 버전 일치
								version_return = 1;

								// 대기중 바 없애기
								// ShowWaitMsg(false);

								// 페이지 이동
								// document.location = "List.htm";
								// document.location = "../crms_trans_rqst/form.jsp";
							} else {
								// 업데이트 필요함
								version_return = 2;

								// 대기중 바 없애기
								// ShowWaitMsg(false);

								// 설치화면 보여주기
								// setBlock();
							}
						} else {
							// 설치안됨, 설치 페이지로 이동
							version_return = 0;

							// 설치화면 보여주기
							// setBlock();
						}
					}
				};

				Public.TVIUS.Teruten.httpRequest.send();

				return version_return;
			} catch (e) {
				// setBlock();
				return version_return;
			}
		},

		getMac: function(url) {
			var MacAddress = "";

			try {
				Public.TVIUS.Teruten.httpRequest.open('POST', url, false);

				Public.TVIUS.Teruten.httpRequest.onreadystatechange = function() {

					if (Public.TVIUS.Teruten.httpRequest.readyState === 4) {
						if (Public.TVIUS.Teruten.httpRequest.status === 200) {
							MacAddress = Public.TVIUS.Teruten.httpRequest.responseText;
						} else {

						}
					}
				};

				Public.TVIUS.Teruten.httpRequest.send();

				return MacAddress;
			} catch (e) {
				return MacAddress;
			}
		},

		getHdd: function(url) {
			var HddAddress = "";

			try {
				Public.TVIUS.Teruten.httpRequest.open('POST', url, false);

				Public.TVIUS.Teruten.httpRequest.onreadystatechange = function() {

					if (Public.TVIUS.Teruten.httpRequest.readyState === 4) {
						if (Public.TVIUS.Teruten.httpRequest.status === 200) {
							HddAddress = Public.TVIUS.Teruten.httpRequest.responseText;
						} else {

						}
					}
				};

				Public.TVIUS.Teruten.httpRequest.send();

				return HddAddress;
			} catch (e) {
				return HddAddress;
			}
		}
	}
}