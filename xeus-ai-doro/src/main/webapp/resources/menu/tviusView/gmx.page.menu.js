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
	
		if(btnId === "btn-tvius-cctv-sch"){
			$("#contentWrap").dialog("option", "width", 650);
		}
		if(btnId === "btn-tvius-view"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
		}
		if(btnId === "btn-ext-view"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
		}
		if(btnId === "btn-evi-view"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
		}
		if(btnId === "btn-tvius-img-view"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
		}
		if(btnId === "btn-tvius-reg-pag"){
			$("#contentWrap").dialog("option", "width", 800);
		}
		if(btnId === "btn-door-sensor"){
			$("#contentWrap").dialog("option", "width", 550);
		}
		if(btnId === "btn-pest-event"){
			$("#contentWrap").dialog("option", "width", 590);
		}
		if(btnId === "btn-pest-device" || btnId === "btn-gw-mng"){
			$("#contentWrap").dialog("option", "width", 530);
		}
		if(btnId === "btn-pest-stat-view" || btnId === "btn-pest-capture-mng"){
			$("#contentWrap").dialog("option", "width", $("#map").width());
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
	}

	var createDialog = function(_ID, _URL, _TITLE){

		var param = getParamByButton(_ID);
		_common.callAjax(_URL, param, function(view){
			$("#assetEditWrap").dialog("close");
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

					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				}
			}).dialog("open");
		}, false);
	}

	function getParamByButton(id){
		var param={};

		if(id === 'btn-tvius-view'){
			param['limit'] = 10;
			param['offset'] = 0;
			param['reqstId'] = userId;
		}

		if(id === 'btn-ext-view'){
			param['limit'] = 10;
			param['offset'] = 0;
			param['renewTyp'] = 11;
			param['reqstId'] = userId;
		}
		if(id === 'btn-evi-view'){
			param['limit'] = 10;
			param['offset'] = 0;
			param['renewTyp'] = 12;
			param['reqstId'] = userId;
		}
		if(id === 'btn-tvius-img-view'){
			param['limit'] = 10;
			param['offset'] = 0;
			param['reqstId'] = userId;
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
//		if(_common.utils.isNullAndEmpty(_URL)) return false;

		if(_ID == "btn-oldcar-shortcut"){
			var pop_title = "popupOpener";

	        window.open("", pop_title);

	        var frmData = document.frmData;
	        frmData.target = pop_title;
	        frmData.action = SAENOON_OLD_DIESEL_CAR_SSO_URL;

	        var url = "http://172.16.1.142:1004/zds/";

	        if(SAENOON_OLD_DIESEL_CAR_SSO_URL.contains("107.3.117.242")){
	        	url = "http://107.3.117.242:8088/zds/";
	        }

	        // sso 연계시 접속할 페이지 url 파라미터로 넘겨서 암호화 해야함
	        _common.callAjax("/user/encryptUserInfo.json", { "url" : url, "type" : "oldDieselCar" }, function(json){
	        	frmData.key.value = json.result.key;
	        	frmData.u_id.value = json.result.userId;
	        	frmData.u_password.value = epelSsoUserPw;
//	        	frmData.u_password.value = json.result.userPw;
	        	frmData.u_name.value = json.result.userNm;
	        	frmData.u_handphone.value = json.result.mobileNum;
	        	frmData.u_email.value = json.result.email;
	        	frmData.url.value = json.result.url;
	        }, false);

	        frmData.submit();
		} else if(_ID == "btn-tvius-car-sch" || _ID == "btn-tvius-reg-pag" || _ID == "btn-tvius-view"
			|| _ID == "btn-ext-view" || _ID == "btn-evi-view" || _ID == "btn-smy-shortcut" || _ID == "btn-door-sensor" || _ID == "btn-pest-device" || _ID == "btn-gw-mng" || _ID == "btn-pest-event" || _ID == "btn-pest-stat-view" || _ID == "btn-pest-capture-mng"){
			$("#body").removeClass("hidden");
			$("#carBody").addClass("hidden");

			if(_ID == "btn-smy-shortcut"){
				window.open(VIDEO_SMY_URL);
			} else{
				createDialog(_ID, _URL, _TITLE);
			}
		} else{
//			$("#contentWrap").dialog("close");
//			$("#body").addClass("hidden");
//			$("#carBody").removeClass("hidden");

			var targetUrl = "";

			if(_ID == "btn-car-recog"){
				targetUrl = CAR_RECOG_URL;
			}else if(_ID == "btn-car-det"){
				targetUrl = CAR_DET_URL;
			}else if(_ID == "btn-car-data"){
				targetUrl = CAR_DATA_URL;
			}else if(_ID == "btn-car-trouble"){
				targetUrl = CAR_TROUBLE_URL;
			}else if(_ID == "btn-car-realtime"){
				targetUrl = CAR_REALTIME_URL;
			}else if(_ID == "btn-car-doc"){
				targetUrl = CAR_DOC_URL;
			}

			var pop_title = _ID;

		    window.open("", pop_title);

		    var frmData = document.frmData;
		    frmData.target = pop_title;
		    frmData.action = ERP_URL_FRONT + "/api/geomex/login.sso";

		    // sso 연계시 접속할 페이지 url 파라미터로 넘겨서 암호화 해야함
		    _common.callAjax("/user/encryptUserInfo.json", { "url" : targetUrl, "type" : "tms" }, function(json){
		    	frmData.key.value = json.result.key;
		    	frmData.u_id.value = json.result.userId;
		    	frmData.u_password.value = json.result.tmsSsoUserPw;
		    	frmData.u_name.value = json.result.userNm;
		    	frmData.u_handphone.value = json.result.mobileNum;
		    	frmData.u_email.value = json.result.email;
		    	frmData.url.value = json.result.url;
		    }, false);

		    frmData.submit();
		}

		$(".startMenu").removeClass("active");
		$(this).addClass("active");
	});

})();