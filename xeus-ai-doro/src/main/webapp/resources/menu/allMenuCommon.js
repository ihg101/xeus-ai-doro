/**
 * 대메뉴 전체에서 공통으로 사용될 기능을 구현합니다.
 * 대메뉴별 main 스크립트를 이용하지 않는,
 * 전체에 해당하는 이벤트만 구현합니다.
 *
 * @author 이주영
 */
window.NEW_TABS = {};
window.TOP_MENU_MOVE = function(_THIS, _EVT, _URL){
	var _MENU_TYPE = _THIS.getAttribute("class");
	var _LAST_MENU = _MENU_TYPE.split(" ")[0];

	//하이퍼링크가 아닐 경우 이벤트를 직접 구현하세요. 예) 대시보드, 외부 링크 등
	if(_MENU_TYPE.contains("active")) return;
	if(_URL == null || _URL === "") return;

	if("localStorage" in window) localStorage["LAST_TOP_MENU"] = _LAST_MENU;
	if(_EVT.ctrlKey){
		//window.open(_URL);
		window.NEW_TABS[_MENU_TYPE] = window.open(_URL);
		_EVT.stopPropagation();
	}else{
		location.href = _URL;
	}
}

/**
 * 테마를 변경합니다.
 */
window._SET_THEME = function(){
	if("localStorage" in window){
		var cssColor = localStorage["SystemTheme"];
		if(!_common.utils.isNullAndEmpty(cssColor)){
			var cssNow = $('head').find('link[href*="main"]').attr('href');

			var c = new Date().getYMDHMS_S();

			if(cssColor == 'dark'){

				if(cssNow.contains('light')){
					cssNow = $('head').find('link[href*="main"]').attr('href').replace('main-light', 'main');
				}else if(cssNow.contains('blue')){
					cssNow = $('head').find('link[href*="main"]').attr('href').replace('main-blue', 'main');
				}else {}

				$('head').find('link[href*="main"]').attr('href', cssNow);
				$("#map").css("background", "black");
				$.getScript("./res/menu/statView/blackThemeChart.js?c=" + c, function(){});

			} else if(cssColor == 'light'){

				if(cssNow.contains('main.css')){
					cssNow = $('head').find('link[href*="main"]').attr('href').replace('main.css', 'main-light.css');
				}else if(cssNow.contains('blue')){
					cssNow = $('head').find('link[href*="main"]').attr('href').replace('main-blue', 'main-light');
				}else {}

				$('head').find('link[href*="main"]').attr('href', cssNow);
				$("#map").css("background", "white");
				$.getScript("./res/menu/statView/lightThemeChart.js?c=" + c, function(){});

			} else if(cssColor == 'blue'){

				if(cssNow.contains('main.css')){
					cssNow = $('head').find('link[href*="main"]').attr('href').replace('main.css', 'main-blue.css');
				}else if(cssNow.contains('light')){
					cssNow = $('head').find('link[href*="main"]').attr('href').replace('main-light', 'main-blue');
				}else {}

				$('head').find('link[href*="main"]').attr('href', cssNow);
				$("#map").css("background", "white");
				$.getScript("./res/menu/statView/blueThemeChart.js?c=" + c, function(){});
			}





		}
	}
}

$(document).ready(function(){

	$("mainTabs").css("display","none");

	var mainTabDisplayTimer = setTimeout(function(){
		$("#mainTabs").css("display","initial");
		clearTimeout(mainTabDisplayTimer);
		mainTabDisplayTimer = null;
	},100);


	var time = 1500;

	var $bigMenu = $("#mainTabs > div.top_box > ul > li").find(".active");

	if($bigMenu.length > 0){
		if($bigMenu.hasClass("stat") || $bigMenu.hasClass("systemMng") || $bigMenu.hasClass("history")){
			time = 100;
		}
	}


	var timer = setTimeout(function(){
		if($(".startMenu").length > 0){
			$(".startMenu")[0].click();
		}

		clearTimeout(timer);
		timer = null;
	},time);

	_SET_THEME();

	/**
	 * 세션이 유효한지 체크합니다.
	 */
	/*if(window.performance){
		var reload = true;
		if(performance.navigation.type == 1){
			alert("reloaded");
		}else{
			alert("not reloaded");
		}

		if(reload){

		}
	}*/

	/**
	 * 메인 탭을 생성합니다.
	 */
	$("#mainTabs").tabs({
		beforeActivate: function (event, ui) {
			var $this = $(this);
			var selectedId = ui.newPanel.attr("id");
		},
		activate: function (event, ui) {
			var $this = $(this);
			var selectedId = ui.newPanel.attr("id");
		}
	});

	/*$("#mainTabs").find(".ci").click(function(){
		if(!document.fullscreenElement){
			$("body")[0].requestFullscreen();
		}else{
			if(document.exitFullscreen){
				document.exitFullscreen();
			}
		}
	});*/

	/**
	 * 로그 아웃 이벤트 입니다.
	 */
	$("#logoutBtn").off("click").click(function(){
		$.get("./user/signOut.json", function(json){
			if(confirm("로그아웃 하시겠습니까?")){
				if(json.result) location.href = "/xeus";
			}
		});
	});

	/**
	 * 키보드 제어 도움말 입니다.
	 */
	$(".btn_keyboard_help").off("click").click(function(){
		if((GMXMAP != null) && ("openKeyboardDocumentDialog" in GMXMAP)) GMXMAP.openKeyboardDocumentDialog();
	});

	/**
	 * 사용자 개인 설정 dialog를 생성합니다.
	 */
	$(".btn_setting").click(function(){
		if($("#userSettingWrap").length === 0){
			var $userSettingWrap = $("<div>").attr("title", "개인 설정").attr("id", "userSettingWrap");
			var $ul = $("<ul>").addClass('tab_wrap');
			var $li = $("<li>");
			var $divBox = $("<div>");

			var $userEdit = $li.clone().append("<a href='#userInfoEdit'>내 정보</a>");
			var $pwdEdit = $li.clone().append("<a href='#pwdEdit'>암호 변경</a>");
			var $theme = $li.clone().append("<a href='#theme'>테마 변경</a>");
			var $setting = $li.clone().append("<a href='#setting'>환경 설정</a>");

			$ul.append($userEdit);
			$ul.append($pwdEdit);
			$ul.append($theme);
			$ul.append($setting);

			var $userEditBox = $divBox.clone().attr('id', 'userInfoEdit');
			var $pwdEditBox = $divBox.clone().attr('id', 'pwdEdit');
			var $themeBox = $divBox.clone().attr('id', 'theme');
			var $settingBox = $divBox.clone().attr('id', 'setting');


			_common.callAjax("/user/alter.do", {}, function(view){
				if($("#editInfoPop").length > 0) $("#editInfoPop").remove();
				$userEditBox.append($("<div>").attr("id", "editInfoPop").addClass("table_style").addClass("customScroll").html(view));
			}, false);

			_common.callAjax("/user/alterPw.do", {}, function(view){
				if($("#editPwdPop").length > 0) $("#editPwdPop").remove();
				$pwdEditBox.append($("<div>").attr("id", "editPwdPop").addClass("table_style").addClass("customScroll").html(view));
			}, false);

			_common.callAjax("/user/alterTheme.do", {}, function(view){
				if($("#themePop").length > 0) $("#themePop").remove();
				$themeBox.append($("<div>").attr("id", "themePop").addClass("table_style").addClass("customScroll").html(view));
			}, false);

			_common.callAjax("/user/alterSetting.do", {}, function(view){
				if($("#settingPop").length > 0) $("#settingPop").remove();
				$settingBox.append($("<div>").attr("id", "settingPop").addClass("table_style").addClass("customScroll").html(view));
			}, false);

			$userSettingWrap.append($ul);
			$userSettingWrap.append($userEditBox);
			$userSettingWrap.append($pwdEditBox);
			$userSettingWrap.append($themeBox);
			$userSettingWrap.append($settingBox);

			$userSettingWrap.tabs();

			$userSettingWrap.dialog({
				autoOpen : false,
				modal: true,
				width: 500,
				height: 'auto',
				position: {
					my: "center center",
					at: "center center",
					of: $("#parentBody")
				},
				open: function(){

				},
				close: function(){
					$userSettingWrap.dialog("destroy");
				}
			}).dialog("open").parent().draggable({ containment: "#parentBody", scroll: false });
		}
	}).css("cursor", "pointer");

	/* 2021-03-16 백유림 추가 */
	/* 1675px 이하 메뉴 클릭시 등장 이벤트입니다. */
	$(function(){
		var nowMenu = $('.tab_wrap > li > button.active').text();
		$('.now_menu').text(nowMenu);
		$('.btn_drop').on('click', function(){
			$(this).toggleClass('drop');
			$(this).hasClass('drop') ? $('.drop_menu').addClass('drop') : $('.drop_menu').removeClass('drop');
		});
		$('html, body').on('click', function(e){
			var dropW = $(e.target).parents().hasClass('drop_wrap');
			if(!dropW){
				$('.btn_drop').removeClass('drop');
				$('.drop_menu').removeClass('drop');
			}
		});
		$(window).on('resize', function(){
			$('.btn_drop').removeClass('drop');
			$('.drop_menu').removeClass('drop');
		});
		
		$('.btn_set_open').on('click', function(){
			$(this).parent().toggleClass('open');
		})
	});
});