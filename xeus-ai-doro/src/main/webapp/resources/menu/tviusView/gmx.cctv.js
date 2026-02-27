/**
 *
 */
"use strict";

if(window.GMXCCTV == null) var GMXCCTV = {

		/**
		 * XEUS-PLAYER Codec 정보입니다.
		 */
		Codec : "h264",

		/**
		 * 미리보기 기준 초 입니다.
		 */
		PreviewTime : 30,

		/**
		 * 단독모니터링, 그리드모니터링, 투망모니터링에서 현재 재생중인 CCTV 리스트 정보입니다.(mgr_no)
		 */
		PlayingCctvList : [],

		/**
		 * GATE Web Socket URL을 리턴합니다.
		 *
		 * @returns {String}
		 */
		getXeusGateURL : function(){
			var _GATE_URL_ = location.host;

			var hostname = location.hostname;

			/* 폐쇄 */ if(hostname.contains("172.16.1.")) _GATE_URL_ = "172.16.1.67:8080";
			/* 외부 */ if(hostname === "210.223.214.34") _GATE_URL_ = "210.223.214.34";
			/* 도메인 */ if(hostname === "cctv.jecheon.go.kr") _GATE_URL_ = "210.223.214.34";
			/* DMZ */ if(hostname === "172.20.1.1") _GATE_URL_ = "172.20.1.1:41000";
			/* 행정 */ if(hostname === "107.3.117.242") _GATE_URL_ = "107.3.117.242:41000";
			/* 소방 */ if(hostname === "107.119.230.54") _GATE_URL_ = "107.119.230.54:41000";
			/* 경찰 */ if(hostname === "173.201.18.41") _GATE_URL_ = "173.201.18.41:41000";
			/* 개발 */
			if(hostname.contains("10.1.73.")) _GATE_URL_ = "10.1.73.57:8080";
//			if(hostname === "127.0.0.1") _GATE_URL_ = "10.1.74.23:8080";
			if(hostname === "127.0.0.1") _GATE_URL_ = "172.16.1.67:8080";
			if(hostname === "localhost") _GATE_URL_ = "172.16.1.67:8080";

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

				for(var i=0; i<featureList.length; i++){
//					if(i < 10){
					var prop = featureList[i].getProperties();
					var center = featureList[i].getGeometry().getCoordinates();
					//var mgrNo = featureList[i].getId().split(".")[1];
					var mgrNo = prop.mgr_no;
					var cctvNm = prop.cctv_nm;

					var items = [];

					if(location.pathname.contains("tvius.do") && $(".usrTviusRqst").length > 0 && $(".usrTviusRqst").is(":visible")){
						items.push({
							text: "반출 대상 카메라로 지정",
							data: { "mgrNo" : mgrNo, "cctvNm" : cctvNm, "center" : center },
							callback: function(_item){
								if(!(location.pathname.contains("tvius.do") && $(".usrTviusRqst").length > 0 && $(".usrTviusRqst").is(":visible"))){
									alert("해당 기능은 영상정보 신청 기능에서만 가능합니다.");
									return false;
								}

								//영상정보 신청으로 이동한 카메라 개수
								var cctvRowCnt = $('#tbl_cctv_list > tbody').find('tr').length-1;

								if(cctvRowCnt >= 20){
									alert("반출 카메라는 최대 20개입니다.");
									return;
								}

								var reqGbn='';
								if($('.aviWrapper').is(':visible')){
//										if ( SELECTED_CCTV_COUNT >= 10){
//											alert("선택 할 수 있는 CCTV는 최대 10개입니다.");
//											return;
//										}

									reqGbn = '반출';//열람도 똑같은 로직이므로 반출로 통일
//										SELECTED_CCTV_COUNT++;
									addCctv(_item.data.mgrNo, _item.data.cctvNm, _item.data.center, reqGbn);


									cctvRowCnt = $('#tbl_cctv_list > tbody').find('tr').length-1;
									$('#lbl_cctvList').text("CCTV 선택(총 "+cctvRowCnt+"대)");
									/**
									 * CCTV 추가 시 모든 CCTV row의 시간 유효성을 검사한다.
									 * tr 고유 식별자를 정하지 않고 모든 CCTV row를 다 돌린다.
									 */
									$('#tbl_cctv_list .cctv_row').each(function() {
										cctvTimeChk($(this).find('[name=cctv_sdate]'));
									});

									alert("선택한 카메라가 반출 대상 카메라로 이동했습니다.")
								}
							}
						});
					}
					items.push({
						text: "정보 보기",
						data: { "layer" : layer, "features" : featureList[i] },
						callback: function(_item){
							GMXMAP.createSingleFeatureInfoDialog(_item.data.layer, _item.data.features);
						}
					});
					items.push({
						text: "위치 이동",
						data: center,
						callback: function(_item){
							GMXMAP.addPulse(_item.data, true, 3);
						}
					});

					itemList.push({
						text: cctvNm,
						data: featureList[i],
						classname: "contextMenuItem-cctv",
						items: items
					});
//					}else{
//						var limit = 10;
//						itemList.push({
//							text: "<b>총 " + (featureList.length - limit) + "대의 겹침 CCTV 중 " + limit + "대만 표시합니다</b>",
//							classname: "cctv_selected_count"
//						});
	//
//						break;
//					}
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
										rotation: angle * Math.PI / 180,
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
					try{
						if(feature != null) GMXMAP["contextMenuVector"].getSource().removeFeature(feature);
					}catch(e){

					}

				});
			}
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
			var timestamp = "";

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
				if("timestamp" in data) timestamp = data.timestamp;
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
					$(this).data("player", GMXCCTV.createXeusGatePlayer(playerId, mgrNo, cctvNm, false, false, isPreview, timestamp));

//					_this.createPlayerMenu(playerId);

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
//					if(!_common.utils.isNullAndEmpty($PLAYER.data("uSvcOutbId"))){
//						_this.addPtzOrPresetStopEvent($PLAYER, $PLAYER.data("player").options,"PTZ");
//					}

					var xeusGatePlayer = $(this).data("player");
					if( xeusGatePlayer != null && xeusGatePlayer instanceof XeusGate.Player ){
						xeusGatePlayer.destroy();
						xeusGatePlayer = null;
					}

//					_this.removePlayingIcon(mgrNo);
//					GMXMAP.redrawAllVisibleVector();


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
			var timeleft = Number(_this.PreviewTime);
			progress(timeleft, _this.PreviewTime, $countdown);

			timeout = setTimeout(function(){
				timeleft--;

				if("function" === typeof _CallBack) _CallBack();

				clearTimeout(timeout);
				timeout = null;
			}, 1000 * _this.PreviewTime);
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
		createXeusGatePlayer : function(playerId, mgrNo, cctvNm, isMultiplePlay, isNetMonitorPlay, isPreview, timestamp){
			var _this = this;

			var player = new XeusGate.Player({
				url : _this.getXeusGateURL(),
		        playerId : playerId,
		        cctvMgrNo: mgrNo,
		        cctvNm : cctvNm,
	        	userId: userId,
				evtType : "",
	            timestamp : timestamp,
	            speed : "",
	            rtspUrl : "",
	            codec : _this.Codec,
	            debug : true
		    });

			_this.PlayingCctvList.push(mgrNo);
			GMXMAP.reloadLayerData("asset_cctv");

			var $PLAYER = $("#" + playerId).addClass("XEUS-PLAYER");
			$PLAYER.parent().addClass("XEUS-PLAYER-DIALOG");

			$PLAYER.css({
				"-ms-user-select" : "none",
				"-moz-user-select" : "-moz-none",
				"-khtml-user-select" : "none",
				"-webkit-user-select" : "none",
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

			if(isPreview){
				_this.createPreviewProgressBar($PLAYER, function(){
					$PLAYER.dialog("close");
				});
			}

			return player;
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
}