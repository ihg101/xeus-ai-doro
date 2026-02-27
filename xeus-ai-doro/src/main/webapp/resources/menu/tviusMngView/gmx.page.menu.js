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
		if(btnId === "btn-tvius-tablet-password-view"){
			$("#contentWrap").dialog("option", "width", 400);
			$("#contentWrap").dialog("option", "height", 530);
			$("#contentWrap").dialog("option", "position", {
				my: "center center",
				at: "center center",
				of: $("#map")
			});
		}

	}

	var resizeDialog = function(_ID, _TITLE){
		$("#contentWrap").dialog("close").dialog({
			title : _TITLE,
			width: $("#map").width(),
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
				$(".startMenu").each(function(){
					if($(this).attr("id") == _ID){
						$(this).removeClass("active");
					}
				});
			}
		}).dialog("open");
	}

	var createDialog = function(_ID, _URL, _TITLE){
		var param = getParamByButton(_ID);
		_common.callAjax(_URL, param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog({
				title : _TITLE,
			    width: $("#map").width(),
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
					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).addClass("active");
						}
					});
				},
				close: function(){
					clearInterval(intervalService);

					if(Public.StopEvent != null){
						Public.StopEvent();
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
	/*
	 * 영상관출 관리 > 각 소메뉴 버튼  view 가져올 때  paramter 세팅
	 */
	function getParamByButton(id){
		var param={};
		if(id === 'btn-tvius-rqst-view'){
			var dat = new Date();
			param['limit'] = 10;
			param['offset'] = 0;
//			param['year'] = dat.getFullYear();
		}
		if(id === 'btn-tvius-ext-view'){
			param['limit'] = 10;
			param['offset'] = 0;
			param['renewTyp'] = 11;
		}
		if(id === 'btn-tvius-evi-view'){
			param['limit'] = 10;
			param['offset'] = 0;
			param['renewTyp'] = 12;
		}
		if(id === 'btn-tvius-exp-view'){
			param['limit'] = 10;
			param['offset'] = 0;
		}
		if(id === 'btn-tvius-img-mng-view'){
			param['limit'] = 10;
			param['offset'] = 0;
		}
		if(id === 'btn-tvius-mng-reg-view'){
			param['limit'] = 10;
			param['offset'] = 0;
		}
		if(id === 'btn-tvius-stat-view'){
			var dat = new Date();
			param['pageTyp'] = 'stat';
			param['page'] = 'listuse';
			param['year'] = dat.getFullYear();
		}


		if(param.length == 0){
			param = null
		}
		return param;
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