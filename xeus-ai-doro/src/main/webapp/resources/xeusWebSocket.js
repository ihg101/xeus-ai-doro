/**
 * 
 * ------------------------- WebSocket.readyState -------------------------
 * 
 * WebSocket Wrapper 객체 입니다. 객체 생성 후 create 메소드로 소켓에 연결 할 수 있습니다. 연결이 해제 될 경우,
 * 1초마다 계속 재접속합니다.
 * 
 * CONNECTING 0 연결이 수립되지 않은 상태입니다. OPEN 1 연결이 수립되어 데이터가 오고갈 수 있는 상태입니다. CLOSING
 * 2 연결이 닫히는 중 입니다. CLOSED 3 연결이 종료되었거나, 연결에 실패한 경우입니다.
 * 
 * ------------------------------------------------------------------------
 * 
 * @auther 이주영
 */
var XeusWS = function(_Map) {

	var _ConnURL, _XWS, _JSON, _this = null;
	var _isAlive = false;
	var _isDestroy = false;

	var _self = this;

	this.getURL = function() {
		return this._ConnURL;
	}
	this.getJson = function() {
		return this._JSON;
	}
	this.getWebSocket = function() {
		return this._XWS;
	}
	this.isAlive = function() {
		return this._isAlive;
	}

	/**
	 * 소켓을 연결합니다.
	 */
	this.create = function(url) {
		_this = this;
		this._ConnURL = url;
		this._XWS = new WebSocket(url);
		this._XWS.onmessage = function(e) {
			_this.request(e);
		};
		this._XWS.onopen = function(e) {
			_this.open(e);
		};
		this._XWS.onclose = function(e) {
			_this.close(e);
		};
	}

	/**
	 * 연결이 완료되었을때의 콜백입니다.
	 */
	this.open = function(e) {
		this._isAlive = true;
		this._isDestroy = false;

		var date = new Date();
		console.log(date.formatYMDHMS(date.getYMDHMS()) + " WebSocket("
				+ this._ConnURL + ") Open.");
		$("#wsStat").attr("src", "../res/img/green.png").attr("title",
				"WebSocket Open");
		;

	}

	/**
	 * 서버에게 데이터를 받을 때 발생합니다.
	 */
	this.request = function(e) {

		// TODO 상태이상 소스 변경해야함. (서버, 클라이언트는 하단부 70 라인으로)
		if (e.data == "CCTV-Reload") {
			xeusCCTV.cctv.reload();
		} else {
			var _thisJson = null;
			try {
				this._JSON = JSON.parse(e.data);
				// this._JSON = JSON.parse(e.data.replace(/[\r\n]/g, ''));
				_thisJson = this._JSON;
			} catch (e) {
				var date = new Date();
				console.log(date.formatYMDHMS(date.getYMDHMS())
						+ " Json Parse Error.");
			}

			// 디버그용 로그 - 확인 후 삭제 필요
			console.log("WebSocket 메시지 수신:", _thisJson.statEvetTypCd, "procSt:", _thisJson.procSt, "전체:", _thisJson);
			
			// localStorage 값이 'false'가 아니면 이벤트 허용 (null이거나 'true'이면 허용)
		var localStorageValue = localStorage.getItem(_thisJson.statEvetTypCd);
		if (localStorageValue !== 'false') {

				if ("AdminNotice" in _thisJson) {

					// { "AdminNotice" : { "msg" : "긴급 서버 패치로 인하여 로그아웃 됩니다.",
					// "action" : "signOut" } }
					var msg = _thisJson.AdminNotice.msg;
					var action = _thisJson.AdminNotice.action;

					try {
						sysAlert(msg);
					} catch (e) {
						alert(msg);
					}

					if (action == "reload") {
						$(parent)[0].parentWindow.onbeforeunload = null;
						$(parent)[0].location.reload();
					}

					if (action == "signOut") {
						$(parent)[0].parentWindow.onbeforeunload = null;
						$(parent)[0].location = "../user/signOut.do";
					}

				} else if ("cmd" in _thisJson) {

					if (_thisJson.cmd == "DEV_MON_EVENT") {

						Public.CCTV.Dron.Start();

						var devSerial = Number(_thisJson.dev_serial);
						var dchCh = Number(_thisJson.dch_ch);
						var eventUav = _thisJson.event_uav;
						var eventId = Number(_thisJson.event_id);
						var eventNm = "";
						if (eventId == 51)
							eventNm = "위치";
						if (eventId == 52)
							eventNm = "배터리";
						if (eventId == 60)
							eventNm = "교통";
						if (eventId == 68)
							eventNm = "화재";
						var eventTime = _thisJson.event_time;
						if (_common.utils.isNullAndEmpty(eventTime))
							eventTime = new Date().formatDate(new Date()
									.getYMDHMS_S());
						var eventMsg = _thisJson.event_msg;
						var eventStatus = Number(_thisJson.event_status);
						var eventStatusNm = "발생";
						if (eventStatus == 0)
							eventStatusNm = "해제";

						var $tr = $("<tr class='tCenter'></tr>").data(eventMsg)
								.attr("eventId", eventId).css("cursor",
										"pointer");
						$tr.append("<td>" + eventNm + "</td>").append(
								"<td>" + eventStatusNm + "</td>").append(
								"<td>" + eventUav + "</td>").append(
								"<td>" + eventTime + "</td>");
						$(".contentWrapper").find("#resultTable").find("tbody")
								.prepend($tr);

						$tr.click(function() {
							var evtStat = $(this).attr("eventId");
							var detailEvt = $(this).data();
							Public.CCTV.Dron.parseDetail(evtStat, detailEvt);
						});

						var color = "red";
						if (eventStatus == 0)
							color = "gray";
						var duration = 200;
						for (var i = 0; i < 5; i++) {
							$tr.animate({
								"color" : color
							}, duration);
							$tr.animate({
								"color" : "black"
							}, duration);
						}

						/** ********************************************************* */
						if (devSerial == 109162) {
							if (eventStatus == 1) {
								if (Spatial.dron1Points == null
										&& Spatial.dron1Vector == null) {
									_common
											.callAjax(
													"/cctv/getCctv.json",
													{
														"deviceId" : "109162"
													},
													function(json) {
														xeusCCTV
																.viewVideo(encodeURIComponent(JSON
																		.stringify(json.result)));
													}, false);

									Spatial.dron1Points = new Array();
									Spatial.dron1Vector = new ol.layer.Vector({
										source : new ol.source.Vector(),
										style : new ol.style.Style({
											stroke : new ol.style.Stroke({
												color : "red",
												width : 4
											})
										})
									});
								}
								if (eventId == 51) {
									Spatial.dron1Points.push(Spatial
											.convertProjection([
													Number(eventMsg.lng),
													Number(eventMsg.lat) ],
													"EPSG:4326", "EPSG:5186"));
									Spatial.dron1Vector.getSource().clear();
									if (Spatial.dron1Points.length > 1) {
										Spatial.dron1Vector
												.getSource()
												.addFeature(
														new ol.Feature(
																{
																	geometry : new ol.geom.LineString(
																			Spatial.dron1Points),
																	// name :
																	// eventUav
																	// + "\n(높이
																	// : " +
																	// eventMsg.alt
																	// + " / 헤딩
																	// : " +
																	// eventMsg.head
																	// + ")"
																	name : eventUav
																}));
									}
									xeusCCTV.cctv.reload();
								}
							} else {

							}
						}
						/** ********************************************************* */
						if (devSerial == 109161) {
							if (eventStatus == 1) {
								if (Spatial.dron1Points == null
										&& Spatial.dron1Vector == null) {
									_common
											.callAjax(
													"/cctv/getCctv.json",
													{
														"deviceId" : "109161"
													},
													function(json) {
														xeusCCTV
																.viewVideo(encodeURIComponent(JSON
																		.stringify(json.result)));
													}, false);

									Spatial.dron1Points = new Array();
									Spatial.dron1Vector = new ol.layer.Vector({
										source : new ol.source.Vector(),
										style : new ol.style.Style({
											stroke : new ol.style.Stroke({
												color : "red",
												width : 4
											})
										})
									});
								}
								if (eventId == 51) {
									Spatial.dron1Points.push(Spatial
											.convertProjection([
													Number(eventMsg.lng),
													Number(eventMsg.lat) ],
													"EPSG:4326", "EPSG:5186"));
									Spatial.dron1Vector.getSource().clear();
									if (Spatial.dron1Points.length > 1) {
										Spatial.dron1Vector
												.getSource()
												.addFeature(
														new ol.Feature(
																{
																	geometry : new ol.geom.LineString(
																			Spatial.dron1Points),
																	// name :
																	// eventUav
																	// + "\n(높이
																	// : " +
																	// eventMsg.alt
																	// + " / 헤딩
																	// : " +
																	// eventMsg.head
																	// + ")"
																	name : eventUav
																}));
									}
									xeusCCTV.cctv.reload();
								}
							} else {

							}
						}
						/** ********************************************************* */
						if (devSerial == 109163) {
							if (eventStatus == 1) {
								if (Spatial.dron1Points == null
										&& Spatial.dron1Vector == null) {
									_common
											.callAjax(
													"/cctv/getCctv.json",
													{
														"deviceId" : "109163"
													},
													function(json) {
														xeusCCTV
																.viewVideo(encodeURIComponent(JSON
																		.stringify(json.result)));
													}, false);

									Spatial.dron1Points = new Array();
									Spatial.dron1Vector = new ol.layer.Vector({
										source : new ol.source.Vector(),
										style : new ol.style.Style({
											stroke : new ol.style.Stroke({
												color : "red",
												width : 4
											})
										})
									});
								}
								if (eventId == 51) {
									Spatial.dron1Points.push(Spatial
											.convertProjection([
													Number(eventMsg.lng),
													Number(eventMsg.lat) ],
													"EPSG:4326", "EPSG:5186"));
									Spatial.dron1Vector.getSource().clear();
									if (Spatial.dron1Points.length > 1) {
										Spatial.dron1Vector
												.getSource()
												.addFeature(
														new ol.Feature(
																{
																	geometry : new ol.geom.LineString(
																			Spatial.dron1Points),
																	// name :
																	// eventUav
																	// + "\n(높이
																	// : " +
																	// eventMsg.alt
																	// + " / 헤딩
																	// : " +
																	// eventMsg.head
																	// + ")"
																	name : eventUav
																}));
									}
									xeusCCTV.cctv.reload();
								}
							} else {

							}
						}
						/** ********************************************************* */
					}

				} else {

					var statEvetTypCd = _thisJson.statEvetTypCd;
					if (statEvetTypCd == "CCTVSHER")
						statEvetTypCd = "CCTVPLAY";
					if (statEvetTypCd == "CCTVPREVREQ")
						statEvetTypCd = "CCTVPREVRES";

					var isUserTarget = false;
					if (!_common.utils.isNullAndEmpty(_thisJson.targetId)) {
						if (typeof userId != "undefined") {
							if (_thisJson.targetId == userId) {
								isUserTarget = true;
								if (_thisJson.statMsgTypCd == "99") {
									var senderId = _thisJson.etcCntn.SENDER_ID;
									_common
											.callAjax(
													"/eventHist/setSession.json",
													null,
													function(json) {
														alert(senderId
																+ " 님 로그인되었습니다.");
													});
								} else {
									var date = new Date();
									var uSvcOutbId = _thisJson.uSvcOutbId;

									if (xeusJsonParser.setJson(_thisJson)
											.isStart()) {

										xeusJsonParser.Start(_Map);
										console.log(date.formatYMDHMS(date
												.getYMDHMS())
												+ " WebSocket("
												+ _this._ConnURL
												+ ") Event("
												+ uSvcOutbId + ") Start.");

									} else if (xeusJsonParser.isChange()) {
										WIDGET.getEventListWidget();
										console.log(date.formatYMDHMS(date
												.getYMDHMS())
												+ " WebSocket("
												+ _this._ConnURL
												+ ") Event("
												+ uSvcOutbId + ") Change.");

									} else {

										xeusJsonParser.Stop();
										console.log(date.formatYMDHMS(date
												.getYMDHMS())
												+ " WebSocket("
												+ _this._ConnURL
												+ ") Event("
												+ uSvcOutbId + ") Stop.");
									}
								}
							}
						}

					}

					if (!isUserTarget) {
						// 디버그용 로그 - 확인 후 삭제 필요
						console.log("권한 체크 요청 - statEvetTypCd:", statEvetTypCd);
						_common
								.callAjax(
										"/auth/hasEvtAuth.json",
										{
											"authData" : statEvetTypCd
										},
										function(json) {
											// 디버그용 로그 - 확인 후 삭제 필요
											console.log("권한 체크 결과 - statEvetTypCd:", statEvetTypCd, "hasAuth:", json.result);
											if (json.result) {
												if (_thisJson.statMsgTypCd == "99") {
													var senderId = _thisJson.etcCntn.SENDER_ID;
													_common
															.callAjax(
																	"/eventHist/setSession.json",
																	null,
																	function(
																			json) {
																		alert(senderId
																				+ " 님 로그인되었습니다.");
																	});
												} else {
													var date = new Date();
													var uSvcOutbId = _thisJson.uSvcOutbId;

													if (xeusJsonParser.setJson(
															_thisJson)
															.isStart()) {

														xeusJsonParser
																.Start(_Map);
														console
																.log(date
																		.formatYMDHMS(date
																				.getYMDHMS())
																		+ " WebSocket("
																		+ _this._ConnURL
																		+ ") Event("
																		+ uSvcOutbId
																		+ ") Start.");

													} else if (xeusJsonParser
															.isChange()) {

														WIDGET
																.gEventListWidget();
														console
																.log(date
																		.formatYMDHMS(date
																				.getYMDHMS())
																		+ " WebSocket("
																		+ _this._ConnURL
																		+ ") Event("
																		+ uSvcOutbId
																		+ ") Change.");

													} else {

														xeusJsonParser.Stop();
														console
																.log(date
																		.formatYMDHMS(date
																				.getYMDHMS())
																		+ " WebSocket("
																		+ _this._ConnURL
																		+ ") Event("
																		+ uSvcOutbId
																		+ ") Stop.");
													}
												}
											}
										});
					}

				}
			}

			/*
			 * if(this._JSON.isNotExternal){
			 * 
			 * var _Header = this._JSON.header; var _Body = this._JSON.body;
			 * 
			 * if(_Header.action == "lockOn") xeusSymbol.addLock([_Body.x,
			 * _Body.y], _Body.gid);
			 * 
			 * if(_Header.action == "lockOff")
			 * xeusSymbol.removeFeature(_Body.gid, "isLock");
			 * 
			 * }else{ }
			 */
		}
	}

	/**
	 * 서버에게 데이터를 전송 할 때 호출합니다.
	 */
	this.send = function(param) {
		this._XWS.send(param);
	}

	/**
	 * 접속이 끊겼을때 호출됩니다.
	 */
	this.close = function() {
		var _this = this;
		this._isAlive = false;
		var date = new Date();
		console.log(date.formatYMDHMS(date.getYMDHMS()) + " WebSocket("
				+ this._ConnURL + ") Close.");
		$("#wsStat").attr("src", "../res/img/red.png").attr("title",
				"WebSocket Close");

		if (!this._isDestroy)
			this.reconnect();
	}

	/**
	 * 재시도 메소드 입니다.
	 */
	this.reconnect = function() {
		var _this = this;
		var _URL = this._ConnURL;
		setTimeout(function() {
			var date = new Date();
			console.log(date.formatYMDHMS(date.getYMDHMS())
					+ " WebSocket try Connect.");
			_this.create(_URL);
		}, 1000);
	}

	/**
	 * 소켓을 완전히 닫습니다.
	 */
	this.destroy = function() {
		this._isDestroy = true;
		this._XWS.close();
	}

}