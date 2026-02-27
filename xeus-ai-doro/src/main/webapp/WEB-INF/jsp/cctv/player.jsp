<%@page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.HashMap"%>
<%
HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");
CctvVo vo = (CctvVo) request.getAttribute("cctv");
String mgrNo = map.get("mgrNo");
String isPreview = map.get("isPreview");
%>
<div id="videoWrap" style="width: 100%; height: 100%; overflow: auto;">
	<div style="position: absolute; width: 100%; height: 0; z-index: 9999; color: white; font-size: 25px; font-weight: bold;"><%= vo.getCctvNm() %></div>
	<div id="__video-canvas" style="display: block; height: 100%; margin: 0 auto;"></div>
	<script type="text/javascript">
		var __mgrNo = '<%= mgrNo %>';
		var __canvas = document.getElementById('__video-canvas');
		/* var __player = new JSMpeg.Player(VIDEO_WEBSOCKET_URL, {
			canvas : __canvas,
			autoplay : true,
			loop : false,
			disableGl : true,
			userId : userId,
			cctvMgrNo : __mgrNo,
			//size : '1680x1050'
			size : '1920x1080'
		}); */
		var __player = new XeusGate.Player( {
	        playerId : "__video-canvas",
	        url : VIDEO_WEBSOCKET_URL,
	        //size: _size,
	        cctvMgrNo: __mgrNo,
        	userId: userId
	    });

		$(window).on('beforeunload', function() {
			if(__player != null && __player != 'undefined' ){
				__player.destroy();
			}
		});

		var __preview = null;
		var __timeout = null;
		var __timeleft = 180;
		var __isPreview = "<%= isPreview %>";
		if(__isPreview == "true"){
			var $__countdownBar = $("<div class='bar'></div>").css({
				"height": "100%",
				"text-align": "right",
				//"padding": "0 10px",
				"line-height": "10px",
				"width": "0",
				"background-color": "#4582AC",
				"box-sizing": "border-box"
			});
			var $__countdown = $("<div class='countdownProgress'></div>").css({
				"position": "absolute",
				"width": "100%",
				"height": "2px",
				"bottom": "2px",
				"left": "0%",
				"display": "none"
				//"background-color" : "#0A5F44"
			}).append($__countdownBar);

			$('#videoWrap').append($__countdown);

			progress(__timeleft, 180, $__countdown);
			__preview = setTimeout(function(){
				__timeleft--;
				if($("#fullScreenBtn").is(":visible")){
					$("#fullScreenBtn").click();
				}else{
					if(__player != null && __player != 'undefined' ){
						__player.destroy();
					}
				}
			}, 1000 * 180);
		}
	</script>
	<script>
		_common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVLOCK" }, function(json){
			if(json.result){

				var isR = false;
				var isS = false;
				var cctvNmSplit = "<%= vo.getCctvNm() %>".split(";");
				if(cctvNmSplit.length >= 2) {
					isR = (cctvNmSplit[1].indexOf("R") > -1);
					isS = (cctvNmSplit[1].indexOf("S") > -1);
				}

				var $ptzTop = $("<span class='ptzBtn' id='ptzTop'></span>").data({"type" : "Up", "mgrNo" : __mgrNo});
				var $ptzBottom = $("<span class='ptzBtn' id='ptzBottom'></span>").data({"type" : "Down", "mgrNo" : __mgrNo});
				var $ptzLeft = $("<span class='ptzBtn' id='ptzLeft'></span>").data({"type" : "Left", "mgrNo" : __mgrNo});
				var $ptzRight = $("<span class='ptzBtn' id='ptzRight'></span>").data({"type" : "Right", "mgrNo" : __mgrNo});
				var $ptzTopLeft = $("<span class='ptzBtn' id='ptzTopLeft'></span>").data({"type" : "LeftUp", "mgrNo" : __mgrNo});
				var $ptzTopRight = $("<span class='ptzBtn' id='ptzTopRight'></span>").data({"type" : "RightUp", "mgrNo" : __mgrNo});
				var $ptzBottomLeft = $("<span class='ptzBtn' id='ptzBottomLeft'></span>").data({"type" : "LeftDown", "mgrNo" : __mgrNo});
				var $ptzBottomRight = $("<span class='ptzBtn' id='ptzBottomRight'></span>").data({"type" : "RightDown", "mgrNo" : __mgrNo});
				var $zoomIn = $("<span class='ptzBtn' id='ptzZoomIn'></span>").data({"type" : "ZoomIn", "mgrNo" : __mgrNo});
				var $zoomOut = $("<span class='ptzBtn' id='ptzZoomOut'></span>").data({"type" : "ZoomOut", "mgrNo" : __mgrNo});

				var $ptzWrap = $("<div class='ptzWrap' id='ptzWrap'></div>").css({
					"position": "absolute",
					"width": "400px",
					"height": "400px",
					"top": "calc(50% - 200px)",
					"left": "calc(50% - 200px)"
				}).append($ptzTop).append($ptzBottom).append($ptzLeft).append($ptzRight)
				  .append($ptzTopLeft).append($ptzTopRight).append($ptzBottomLeft).append($ptzBottomRight)
				  .append($zoomIn).append($zoomOut);

				//$("#videoWrap").append($ptzTop).append($ptzBottom).append($ptzLeft).append($ptzRight).append($zoomIn).append($zoomOut);
				if(isR) $("#videoWrap").append($ptzWrap);

				var isDown = false;
				var $target = null;
				$("#videoWrap").find(".ptzBtn").mousedown(function(){
					isDown = true;
					$target = $(this);
					var mgrNo = $(this).data().mgrNo;
					var code = $(this).data().type;

					_common.callAjax("/proxy/xeusGateWay.json", {"path" : "setPTZ", "cctvMgrNo" : mgrNo, "action" : "start", "code" : code}, function(){

					});
				}).mouseup(function(){
					isDown = false;
					$target = null;
					var mgrNo = $(this).data().mgrNo;
					var code = $(this).data().type;

					_common.callAjax("/proxy/xeusGateWay.json", {"path" : "setPTZ", "cctvMgrNo" : mgrNo, "action" : "stop", "code" : code}, function(){

					});
				});

				$ptzWrap.find(".ptzBtn").hover(function(){
					$(this).stop().fadeIn("fast");

					var id = $(this).attr("id");
					if(id == "ptzZoomIn" || id == "ptzZoomOut"){
						$("#videoWrap").find("#ptzZoomIn").stop().fadeIn("fast");
						$("#videoWrap").find("#ptzZoomOut").stop().fadeIn("fast");
					}
				}, function(){
					if(isDown) $target.mouseup();
				});

				$ptzWrap.hover(function(){
					$("#videoWrap").find(".ptzBtn").stop().fadeIn("fast");
				}, function(){
					$("#videoWrap").find(".ptzBtn").stop().fadeOut("fast");
				});

				/* $("#videoWrap").find('#ptzTop').css('left', (($("#videoWrap").width()-10)/2)-20);
				$("#videoWrap").find('#ptzBottom').css('left', (($("#videoWrap").width()-10)/2)-20);
				$("#videoWrap").find('#ptzLeft').css('top', (($("#videoWrap").height()-30)/2)-15);
				$("#videoWrap").find('#ptzRight').css('top', (($("#videoWrap").height()-20)/2)-15);
				$("#videoWrap").find('#ptzZoomIn').css('right', ($("#videoWrap").width()/2)-25);
				$("#videoWrap").find('#ptzZoomIn').css('top', ($("#videoWrap").height()/2)-25);
				$("#videoWrap").find('#ptzZoomOut').css('right', ($("#videoWrap").width()/2)-25);
				$("#videoWrap").find('#ptzZoomOut').css('top', ($("#videoWrap").height()/2)); */
			}
		}, false);
	</script>
</div>
