/**
 * Event Monitoring Main Script
 *
 * @auther 이주영
 */
"use strict";

$(document).ready(function(){

	/**
	 *	서버에 해당 session이 없을 시 login페이지로 redirect
	 */
	if(_common.utils.isNullAndEmpty(window.userId) || window.userId === "null") location.href = "./user/login.do";

	var v = _common.utils.Random.getGUID12();
	$.getScript("./res/menu/eventView/gmx.page.menu.js?v=" + v, function(){});

	/**
	 * 세션 웹소켓 생성
	 */
	if(window.sessionSocket == null){
		window.sessionSocket = new SessionWS();
		window.sessionSocket.create("ws://" + location.host + "/xeus/session");
	}

	/**
	 * 이벤트 웹소켓 생성
	 */
	if(window.socket == null){
		window.socket = new XeusWS();
		window.socket.create("ws://" + location.host + "/xeus/event");
	}
	/**
	 *  유저 권한에 포함되는 탭만 표출
	 */
	//setTabByAuth(authMgrNo);



	$(document).on('click', '.layerT', function(){
		$(this).toggleClass('active');
	});
	/*$(document).on('click', '#logoutBtn', function(){
		location.href = "./user/signOut.do"
	});*/

	/**
	 * dialog 객체들을 생성합니다.
	 * 화면에 보이지 않는 상태로 생성됩니다.
	 */
	$(".dialogWrap").dialog({
		autoOpen : false,
		open: function() {
			//$(this).dialog("option", "maxHeight", $("#map").height());
		}
	}).parent().draggable({
		containment: "#map",
		scroll: false
	});

	/**
	 * 범례를 생성합니다.
	 */
	$("#btn-lgd-mng").click(function(){
		if(!$("#legendWrap").dialog("isOpen")){
			$("#legendWrap").dialog({
				width: "400",
				height: $("#map").height(),
				resizable: false,
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function() {
					$(this).dialog("option", "maxHeight", $("#map").height());
				}
			}).dialog("open");
		}
	});

	/**
	 * 브라우저 리사이즈 이벤트 입니다.
	 */
	$(window).resize(function(){
		$("#legendWrap").dialog("option", "height", $("#map").height());
		//$("#featureInfoWrap").dialog("option", "height", $("#map").height());
		//$("#contentWrap").dialog("option", "height", $("#map").height());
	});

});