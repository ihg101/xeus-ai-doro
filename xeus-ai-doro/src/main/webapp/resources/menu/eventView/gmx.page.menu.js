/**
 * 소메뉴 이벤트 입니다.
 * 대상 버튼 엘리먼트의 URL 속성을 이용하여 페이지를 구성합니다.
 *
 * 만약 버튼에 URL을 노출 할 수 없다면,
 * 버튼 이벤트를 직접 바인딩 해야 합니다.
 *
 * @author 이주영
 */
(function(){

	var setAfterEvent = function(btnId){
		/*$("#contentWrap").dialog("option", "maxHeight", $("#map").height());
		$("#contentWrap").dialog("option", "maxWidth", 600);*/

		if(btnId === "btn-monitor-view"){
			$("#contentWrap").dialog("option", "width", 600);
		}

		if(btnId === "btn-event-list-view"){
			$("#contentWrap").dialog("option", "width", 600);
		}

		if(btnId === "btn-cctv-sch"){
			$("#contentWrap").dialog("option", "width", 650);
		}

		if(btnId === "btn-parking-mng"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
			$("#contentWrap").dialog("option", "height", $("#map").height());
		}

		if(btnId === "btn-vision-mng"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
			$("#contentWrap").dialog("option", "height", $("#map").height());
		}

		if(btnId === "btn-sendSMS-mng"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
			$("#contentWrap").dialog("option", "height", $("#map").height());
		}

		if(btnId === "btn-mobileshare-mng"){
			$("#contentWrap").dialog("option", "width", 800);
		}
	}

	var resizeDialog = function(_ID, _TITLE){
		$("#contentWrap").dialog("close").dialog({
			title : _TITLE,
			width: 500,
			height: $("#map").height(),
			position: {
				my: "left top",
				at: "left top",
				of: $("#map")
			},
			open: function(){
				$(".startMenu").removeClass("active");
				$("#"+_ID).addClass("active");

				setAfterEvent(_ID);

				$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
					resizeDialog(_ID, _TITLE);
				});
			},
			close: function(){
				if(window.Public && window.Public.StopEvent){
					window.Public.StopEvent();
				}
				$(".startMenu").each(function(){
					if($(this).attr("id") == _ID){
						$(this).removeClass("active");
					}
				});
			}
		}).dialog("open");
	}

	/*
	 * 영상관출 관리 > 각 소메뉴 버튼  view 가져올 때  paramter 세팅
	 */
	var getParamByButton = function(id){
		var param={};
		if(id === 'btn-event-list-view'){
			param['limit'] = 10;
			param['offset'] = 0;
			param['evtNm'] = "";
			param['statEvetOutbDtm'] = "";
		}

		if(param.length == 0){
			param = null
		}

		return param;
	}


	var createDialog = function(_ID, _URL, _TITLE){
		var param = getParamByButton(_ID);

		_common.callAjax(_URL, param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog({
				title : _TITLE,
			    width: 500,
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function(){
					setAfterEvent(_ID);

					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID, _TITLE);
					});
				},
				close: function(){
					if(window.Public && window.Public.StopEvent){
						window.Public.StopEvent();
					}
					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				}
			}).dialog("open");
		}, false);
	}

	$(".startMenu").click(function(){

		var _ID = $(this).attr("id");
		var _URL = $(this).attr("url");
		var _TITLE = $(this).text();

		if(_ID === "btn-lgd-mng") return false;
		if(_common.utils.isNullAndEmpty(_URL)) return false;

		createDialog(_ID, _URL, _TITLE);

		$(".startMenu").removeClass("active");
		$(this).addClass("active");
	});

	var $PLAYER = null;
	document.addEventListener("fullscreenchange", function(){
		if($(document.fullscreenElement).hasClass("XEUS-PLAYER-DIALOG")){
			if($(document.fullscreenElement).find(".XEUS-PLAYER").length > 0){
				$PLAYER = $(document.fullscreenElement).find(".XEUS-PLAYER");
			}
		}

		if(!document.fullscreenElement && $PLAYER != null){
			$PLAYER.width($PLAYER.attr("w")).height($PLAYER.attr("h"));
			$PLAYER = null;
		}
	});

})();