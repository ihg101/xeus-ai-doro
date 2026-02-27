var sessionSocket = null;

$(document).ready(function(){

	sessionSocket = new SessionWS();
	sessionSocket.create("ws://" + location.host + "/xeus/session");

	$("#rqstBtn, #rqstViewBtn, #rqstReadViewBtn, #rqstImageViewBtn, #rqstUserImageViewBtn").click(function(){
		//$.mobile.changePage($(this).attr("url"));
		var url = $(this).attr("url");

		if($(this).attr("id") === "rqstImageViewBtn"){

			var reqstId = prompt("신청자 ID를 입력하세요.");

			if(_common.utils.isNullAndEmpty(reqstId)){
				alert("신청자 정보가 존재하지 않습니다.");
				return false;
			}

			_common.callAjax("/tvius/mobile/getUserInfo.json", { "userId" : reqstId }, function(json){
				if(_common.utils.isNullAndEmpty(json.result)){
					alert("신청자 정보가 존재하지 않습니다.");
					return false;
				}else{
					_common.postForm.submit("/tvius/mobile/" + url, { "reqstId" : reqstId });
				}
			}, false);

		}else if($(this).attr("id") === "rqstUserImageViewBtn"){
			reqstId = $(this).attr("reqstId");
			_common.postForm.submit("/tvius/mobile/" + url, { "reqstId" : reqstId });
		}else{
			location.href = url;
		}

	});

	$("#signOut").click(function(){
		if(confirm("로그아웃 하시겠습니까?")){
			location.href = "./signOut.do";
		}
	});

	$("#addHomeScreenBtn").click(function(){

		var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

		var url = "http://" + location.host + "/xeus/tvius/mobile";
		var favicon = "http://" + location.host + "/xeus/res/favicon/geomex.ico";
		var title = "모바일 영상반출";

		if(!isMobile){
			alert("모바일에서만 홈 화면에 바로가기를 추가할 수 있습니다.");
			return false;
		}

		var userAgent = navigator.userAgent.toLowerCase();
		if(userAgent.match(/android/)){
			var naverAppUrl = "intent://addshortcut";
			naverAppUrl += "?url=" + encodeURIComponent(url);
			naverAppUrl += "&icon=" + encodeURIComponent(favicon);
			naverAppUrl += "&title=" + title;
			naverAppUrl += "&serviceCode=Tvius";
			naverAppUrl += "&version=7";

			naverAppUrl += "#Intent;scheme=naversearchapp;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.search;end";
			window.open(naverAppUrl);
		}else{
			alert("아이폰 또는 아이패드 계열은 지원되지 않습니다.");
			return false;
		}
	});

});
