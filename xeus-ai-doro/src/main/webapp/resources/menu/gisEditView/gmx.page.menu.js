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
			$("#contentWrap").dialog("option", "width", 650);
		}

		if(btnId === "btn-vision-mng"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
			$("#contentWrap").dialog("option", "height", $("#map").height());
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

	var createDialog = function(_ID, _URL, _TITLE){
		_common.callAjax(_URL, null, function(view){
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

})();