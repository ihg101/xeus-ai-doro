<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.net.*,java.io.*,java.util.*" %>
<%@page import="org.json.simple.JSONArray" %>
<%@page import="org.json.simple.JSONObject" %>
<%@page import="org.json.simple.parser.JSONParser" %>
<%


String tabIndex = request.getParameter("tabIndex");

if(tabIndex == null || "".equals(tabIndex)){
	tabIndex = "0";
}



%>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>스마트시티 통합플랫폼</title>
<style type="text/css">
html, body { width: 100%; height:100%; background-color: #111; text-align: center; margin: 0px; padding: 0px; }
#tabs { height: calc(100% - 2px); }
.ui-tabs { padding: 0px !important; }
.ui-tabs .ui-tabs-panel { padding: 0px !important; }
.ui-tabs-tab { width: calc(25% - 2px); }
.ui-tabs .ui-tabs-nav { padding: 0px !important; }
.ui-tabs .ui-tabs-nav li { margin: 0px !important; }
.ui-tabs .ui-tabs-nav .ui-tabs-anchor { width: 100%; padding: 0px !important; padding-top: 10px !important; padding-bottom: 10px !important; }
.playerWrap { width: 100%; min-height: 0px; max-height: none; height: 100%; user-select: none; }

body::-webkit-scrollbar { display: none; }
</style>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js"></script>
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/base/jquery-ui.css">
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js"></script>
<!-- <script type="text/javascript" src="../common/xeus.player.2.0.1.js"></script> -->
<script type="text/javascript" src="../common/xeus.player.2.1.0.js"></script>
<script type="text/javascript">


	var codec = "auto";
	var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기


	if (varUA.match('android') != null) {
    //안드로이드 일때 처리

	} else if (varUA.indexOf("iphone")>-1||varUA.indexOf("ipad")>-1||varUA.indexOf("ipod")>-1) {
    //IOS 일때 처리
		codec = "mjpeg";
	} else {

    //아이폰, 안드로이드 외 처리
	}



	var intervalStreamChk = null;
	var tabIndex = '<%=tabIndex%>';
	var cctvList = null;
	var cctvTab = null;

	var IP = "argos.seocho.go.kr";
// 	var IP = "127.0.0.1";

//	var _GINI_SERVER_ =  "http://withgenie-seocho.iptime.org:8080/v1/stream/all";
 	var _GINI_SERVER_ =  "http://101.102.104.115:50000/v1/stream/all";
	var _URL_ = "../GMT_proxy/sendData";

	if(location.hostname !== IP && !location.hostname.includes("222.107.208.") && !location.hostname.includes("101.102.104.") && !location.hostname.includes("127.0.0.1")){
		_URL_ = "http://"+IP+"/xeus/GMT_proxy/sendData";
	}

	_URL_ += "?url="+_GINI_SERVER_;


	var player = null;

	$( function() {
	    $( "#tabs" ).tabs({
	    	active : tabIndex
	    });
	});

	$(document).ready(function(){

		//모든 스트림 정보를 가져온다
		var getAllStream = function(){
			var result;

			$.get({
				url : _URL_,
				async : false,
				success : function(json){
			    	result = json;
				}
			});

			return result;
		}


		//한개 채널의 영상을 재생한다
		var playVideoOneChannal = function(cctvObj, IP, selector){
			var $selector = $("#"+selector);

			var VIDEO_WEBSOCKET_URL ='ws://' + IP + '/xeus-gate/stream';
			var playerId = "PLAYER-" + cctvObj.index;


			$selector.data("player", createXeusGatePlayer(playerId, cctvObj.cctvManagerNumber, VIDEO_WEBSOCKET_URL));

			//'데이터 수신 대기중' html요소들을 xeus.player.js에서 생성하기 떄문에 하드코딩함
			$selector.find(">div").css("position","relative").css("top","-380px");

		};


		//모든 채널의 영상을 재생한다
		var playVideoAllChannel = function(cctvList, IP){

			for(var i=0; i<cctvList.length; i++){
				if(isPlayAble(cctvList[i])){
					playVideoOneChannal(cctvList[i].cctvManagerNumber, IP, "PLAYER"+(cctvList[i].index));
				}
				else{
					showNoVideoMessage(cctvList[i]);
				}

			}

		};

		// player 생성
		var createXeusGatePlayer = function(playerId, mgrNo, gateUrl){

			player = new XeusGate.Player({
				playerId : playerId,
				cctvNm : mgrNo,
				url : gateUrl,
				//size: _size,
				cctvMgrNo: mgrNo,
				userId: "GenieAPP",
				evtType : '',
				timestamp : '',
				speed : '',
				codec : codec,
				rtspUrl : '',
				debug : true
			});

			$("#" + playerId).css({
				"-ms-user-select" : "none",
				"-moz-user-select" : "-moz-none",
				"-khtml-user-select" : "none",
				"-webkit-user-select" : "none",
				"user-select" : "none",
			});

			return player;
		};


		//해당 채널에 영상이 있는 지 여부
		var isPlayAble = function(cctvObj){
			if(cctvObj.token == null || cctvObj.streamUrl == null){
				return false;
			}else{
				return true;
			}

			return true;
		};

		//영상 없음 메세지 표출
		var showNoVideoMessage = function(cctvObj){
			$("#PLAYER-"+cctvObj.index).css("display","none");
			$("#PLAYER-"+cctvObj.index).after('<div class="noVideo">영상 없음</div>');
		};



// var cctvList = '[{"index":"1","cctvManagerNumber":"CTV0000003","token":44,"streamUrl":"ss"},{"index":"2","cctvManagerNumber":"CTV0000002","token":333,"streamUrl":3333},{"index":"3","cctvManagerNumber":"CTV0000003","token":null,"streamUrl":null},{"index":"4","cctvManagerNumber":"CTV0000004","token":null,"streamUrl":null}]';
		var checkChangeStream = function(){
			cctvList = getAllStream();


			if(JSON.stringify(cctvList[tabIndex]) == JSON.stringify(cctvTab)){
				return false;
			}
			else{
				return true;
			}

		};

		var playStream = function(){
			cctvTab = cctvList[tabIndex];

			if(isPlayAble(cctvList[tabIndex])){
				playVideoOneChannal(cctvList[tabIndex], IP, "PLAYER-"+(cctvList[tabIndex].index));
			}
			else{
				showNoVideoMessage(cctvList[tabIndex]);
			}

			$('.ui-tabs-anchor').click(function(){
				var tabIndex = $("#tabs").tabs("option","active");
				location.href="./mobileVideoPlayer.jsp?tabIndex="+tabIndex;
			});
		};

		//코드시작
		cctvList = getAllStream();
		playStream();



		intervalStreamChk = setInterval(function(){
			if(checkChangeStream()){
				location.href="./mobileVideoPlayer.jsp?tabIndex="+tabIndex;
			}

		}, 5000);

	});

	$(window).on('beforeunload', function() {
		if(player != null && player != 'undefined' ){
			player.destroy();
		}
		if(clearTimeout != null && clearTimeout != 'undefined' ){
			clearInterval(intervalStreamChk);
		}
	});

</script>

</head>
<body>
	<div id="tabs">
	    <ul>
	        <li><a href="#tabs-1">CH1</a></li>
	        <li><a href="#tabs-2">CH2</a></li>
	        <li><a href="#tabs-3">CH3</a></li>
	        <li><a href="#tabs-4">CH4</a></li>
	    </ul>
	    <div id="tabs-1">
	        <div class="playerWrap customScroll" id="PLAYER-1"></div>
	    </div>
	    <div id="tabs-2">
	        <div class="playerWrap customScroll" id="PLAYER-2"></div>
	    </div>
	    <div id="tabs-3">
	        <div class="playerWrap customScroll" id="PLAYER-3"></div>
	    </div>
	    <div id="tabs-4">
	        <div class="playerWrap customScroll" id="PLAYER-4"></div>
	    </div>
	</div>
</body>
</html>