if(window._common == null) var _common = {};

/**
 * <pre>
 * 유틸리티 객체 입니다.
 * </pre>
 *
 * @author 이주영
 */
_common = {

	/**
	 * <pre>
	 * Application Context 명 입니다.
	 * </pre>
	 */
	context : function(){
		var hostIndex = location.href.indexOf( location.host ) + location.host.length;
		return location.href.substring( hostIndex, location.href.indexOf('/', hostIndex + 1) );
	},
	/**
	 * 공통 코드 객체 입니다.
	 */
	code : null,
	setCode : function(_callback){
		this.callAjax("/code/getCodeList.json", null, function(result){
			_common.code = result.codeVoList;
			if(_callback != null){
				_callback();
			}
		}, false);
	},
	/**
	 * <pre>
	 * 코드를 이용하여 한글명을 검색합니다.
	 *
	 * 필수) _CODE - 코드 (string)
	 * </pre>
	 */
	getCodeByName : function(_GROUP, _CODE){
		if(_common.code == null) _common.setCode();
		if(!_common.utils.validObject(_CODE, "string")){
			console.warn(">> 비교대상 파라미터(_CODE) 누락");
			return false;
		}

		var str = "";
		for(var i=0; i<_common.code.length; i++){
			if(_common.code[i].grpCde.trim() == _GROUP.trim() && _common.code[i].cdeCde.trim() == _CODE.trim()){
				str = _common.code[i].cdeNm;
				break;
			}
		}
		return str;
	},
	/**
	 * <pre>
	 * 그룹코드를 이용하여 그룹을 검색합니다.
	 *
	 * 필수) _CODE - 그룹코드 (string)
	 * </pre>
	 */
	getCodeByGroup : function(_GROUP){
		if(_common.code == null) _common.setCode();
		if(!_common.utils.validObject(_GROUP, "string")){
			console.warn(">> 비교대상 파라미터(_CODE) 누락");
			return false;
		}

		var array = new Array();
		for(var i=0; i<_common.code.length; i++){
			if(_common.code[i].grpCde.trim() == _GROUP.trim()){
				array.push(_common.code[i]);
			}
		}
		return array;
	},
	/**
	 * <pre>
	 * 한글명을 이용하여 코드를 검색합니다.
	 *
	 * 필수) _NAME - 한글명 (string)
	 * </pre>
	 */
	getNameByCode : function(_GROUP, _NAME){
		if(_common.code == null) _common.setCode();
		if(!_common.utils.validObject(_NAME, "string")){
			console.warn(">> 비교대상 파라미터(_NAME) 누락");
			return false;
		}

		var str = "";
		for(var i=0; i<_common.code.length; i++){
			if(_common.code[i].grpCde.trim() == _GROUP.trim() && _common.code[i].cdeNm.trim() == _NAME){
				str = _common.code[i].cdeCde.trim();
			}
		}
		return str;
	},
	/**
	 * <pre>
	 * 세션을 체크합니다.
	 * </pre>
	 */
	sessionCheck : function(){
		var context = this.context();

		$.ajax({
			type    : "POST",
			url     : context + "/user/sessionCheck.json",
			async	: false,
			success : function(json){
				if(!json.result){
					alert("세션이 존재하지 않습니다.\n로그인 페이지로 이동합니다.");
					location.href = "/user/signOut.do";
				}
			}
		});
	},
	/**
	 * <pre>
	 * Ajax Wrapper 입니다. (Method : POST)
	 *
	 * 필수) _URL - 전송 URL (String)
	 * 필수) _PARAMETERS - 전송 파라미터 (object or String)
	 * 필수) _CALLBACK - 콜백함수 (function)
	 * 선택) _async - 동기화 여부 (boolean : 미지정시 true)
	 * 선택) _errorMsg - 전송 실패시 메시지 (String)
	 * </pre>
	 */
	callAjax : function(_URL, _PARAMETERS, _CALLBACK){

		if(_URL != null){

			var context = this.context();

			if(!_URL.startsWith("http")) _URL = context + _URL;

			var _async = arguments[3];
			if(!_common.utils.validObject(arguments[3], "boolean")){
				_async = true;
			}

			var _errorMsg = arguments[4];

			$.ajax({
				type    : "POST",
				url     : _URL,
				data    : _PARAMETERS,
				//dataType: 'json',
				async   : _async,
				success : function(json){
					if(json.exception != null){
						alert("서버에 요청중 문제가 발생했습니다.\n관리자에게 문의하여 주십시오.");
						//alert(json.exception.message);
						return false;
					}

					if(json.error != null){

						if(json.notSession != null) location.href = context;

						if("code" in json){
							if(json.code == "GMX-1001"){
								_common.callAjax("/user/sessionDestroy.json", { "user" : json.userId }, function(res){
									setTimeout(function(){ $("#login_btn").click(); }, 500);
								}, false);
							}
						}else{
							alert(json.error);
						}

						return false;
					}

					_CALLBACK(json);
				},
				error   : function(){
					if(_common.utils.validObject(_errorMsg, "string")){
						alert(_errorMsg);
					}else{
						alert("서버에 요청중 문제가 발생했습니다.\n관리자에게 문의하여 주십시오.");
					}
				},
				complete : function(){
					_URL, _PARAMETERS, _CALLBACK = null;
				}
			});
		}else{
			return false;
		}
	},
	/**
	 * <pre>
	 * 해당 테이블의 한글 컬럼명을 리턴합니다.
	 *
	 * 필수) _Param - 테이블명 또는 Column 정보 (String or object)
	 * </pre>
	 */
	getColumn : function(_Param, _Type){

		var map = new HashMap();

		if(_Param != null){

			var list = _Param;

			if(typeof _Param == "string"){
				this.callAjax("/columnInfo/getColumn.json", { "tbl" : _Param, "dataType" : _Type }, function(json){
					list = json.result;
				}, false);
			}

			for(var i=0; i<list.length; i++){
				map.put(list[i].colId, list[i].colNm);
			}

			return map;
		}else{
			//alert("올바른 요청이 아닙니다.");
			return false;
		}

		map = null;
	},
	/**
	 * <pre>
	 * jQuery ajaxForm Wrapper 입니다. (imgFileUpload Validation)
	 * 이미지 객체를 체크합니다.
	 *
	 * 필수) $_SELECTOR - 폼 객체 (object)
	 * 필수) _CALLBACK - 콜백함수 (function)
	 *
	 * </pre>
	 */
	imgFileValidation : function($_SELECTOR, _CALLBACK){
		var context = this.context();

		$_SELECTOR.attr("action", context + "/imgFileValidation.json").ajaxForm({
			dataType : "json",
			success: function(json){
				_CALLBACK(json);
			},
			error: function(){
				alert("파일 분석에 실패하였습니다.\n시스템 관리자에게 문의해주세요.");
				return false;
			}
		}).submit();
	},
	/**
	 * <pre>
	 * jQuery ajaxForm Wrapper 입니다. (FileUpload Validation)
	 * 알려진 확장자 (압축, 문서 등) 객체를 체크합니다.
	 *
	 * 필수) $_SELECTOR - 폼 객체 (object)
	 * 필수) _CALLBACK - 콜백함수 (function)
	 *
	 * </pre>
	 */
	dataFileValidation : function($_SELECTOR, _CALLBACK){
		var context = this.context();

		$_SELECTOR.attr("action", context + "/dataFileValidation.json").ajaxForm({
			dataType : "json",
			success: function(json){
				_CALLBACK(json);
			},
			error: function(){
				alert("파일 분석에 실패하였습니다.\n시스템 관리자에게 문의해주세요.");
				return false;
			}
		}).submit();
	},
	/**
	 * <pre>
	 * jQuery ajaxForm Wrapper 입니다. (imgFileUpload)
	 *
	 * 필수) _URL	- URL (string)
	 * 필수) $_SELECTOR - 폼 객체 (object)
	 * 필수) _CALLBACK - 콜백함수 (function)
	 *
	 * </pre>
	 */
	formSubmit : function(_URL, $_SELECTOR, _CALLBACK){
		var context = this.context();

		$_SELECTOR.attr("action", context + _URL).ajaxForm({
			dataType : "json",
			success: function(json){
				if(json.error != null){
					if(json.notSession != null){
						location.href = context + "/user/signOut.do";
					}
					alert(json.error);
					return false;
				}
				_CALLBACK(json);
			},
			error: function(){
				alert("파일 업로드를 실패하였습니다.\n시스템 관리자에게 문의해주세요.");
				$('#loading_wrap').hide();
				return false;
			}
		}).submit();
	},
	/**
	 * <pre>
	 * 폼으로 파라미터를 전달합니다.
	 * </pre>
	 */
	postForm : {
		form : null,
		window : null,
		/**
		 * 일반 POST 서브밋 행동을 취합니다.
		 * 다운로드 등의 기능에 사용됩니다.
		 *
		 * 필수) _URL - 전송 URL (String)
		 * 필수) _PARAMETERS - 전송 파라미터 (object or String)
		 * 선택) _HREF - 하이퍼링크 여부 (boolean)
		 */
		submit : function(_URL, _PARAMETERS, _HREF){

			if(_URL != null){
				window.onbeforeunload = null;

				if(!_HREF) _URL = _common.context() + _URL;

				$("#postForm").remove();


				var str = "";
				str += "<form action='" + _URL + "' method='POST' name='postForm' id='postForm' data-ajax='false'>";

				for(var prop in _PARAMETERS){
					str += "<input type='hidden' name='" + prop + "' value='" + _PARAMETERS[prop] + "'>";
				}

				str += "</form>";

				$(str).appendTo("body").submit().remove();

				//window.onbeforeunload =  function(){ return "" };
				setTimeout(function(){
					window.onbeforeunload =  function(){ return "" };
				}, 1000);
			}else{
				alert("올바른 요청이 아닙니다.");
			}

		},
		/**
		 * 새창 POST 서브밋 행동을 취합니다.
		 *
		 * 필수) _URL - 전송 URL (String)
		 * 필수) _PARAMETERS - 전송 파라미터 (object or String)
		 * 선택) _HREF - 하이퍼링크 여부 (boolean)
		 */
		open : function(_URL, _PARAMETERS, _HREF){
			if(_URL != null){
				if(!_HREF) _URL = _common.context() + _URL;

				$("#postForm").remove();

				var str = "";
				str += "<form name='postForm' id='postForm'>";

				for(var prop in _PARAMETERS){
					str += "<input type='hidden' name='" + prop + "' value='" + _PARAMETERS[prop] + "'>";
				}

				str += "</form>";

				$("body").append(str);
				this.window = window.open("", "newWindow");
				this.form = document.getElementById("postForm");
				this.form.action = _URL;
				this.form.target = "newWindow";
				this.form.method = "POST";
				this.form.submit();
			}else{
				alert("올바른 요청이 아닙니다.");
				return false;
			}
		}
	}

};
_common.utils = {
	/**
	 * <pre>
	 * .sendData의 클래스명을 가진 엘리먼트의 값을 취합합니다.
	 * jQuery.fn.serialize() 와 비슷한 기능을 수행합니다.
	 * </pre>
	 *
	 * 선택) _selector - 기준 엘리먼트 텍스트 (string)
	 * @returns sendData - 전송용 객체 (object)
	 */
	collectSendData : function(){
		var sendData = {};

		var target = arguments[0];

		if($(target).length > 0){
			$(target).find(".sendData").each(function(){
				sendData[$(this).attr("id")] = $(this).val();
			});
		}else{
			if(_common.utils.validObject(target, "string")){
				$(target).find(".sendData").each(function(){
					sendData[$(this).attr("id")] = $(this).val();
				});
			}else{
				$(document).find(".sendData").each(function(){
					sendData[$(this).attr("id")] = $(this).val();
				});
			}
		}

		return sendData;
	},

	/**
	 * <pre>
	 * 객체를 검증합니다.
	 * null, "", undefined, typeof 를 검증합니다.
	 * 결과값이 false 일 경우 정상적이지 않은 데이터 입니다.
	 * </pre>
	 *
	 * @param _OBJECT - 검증용 객체 (object)
	 * @param _TYPE - 검증 객체 타입
	 * @returns {Boolean - true : 정상 데이터 / false : 이상 데이터}
	 */
	validObject : function(_OBJECT, _TYPE){
		var bool = false;

		if(_OBJECT !== null && _OBJECT !== "" && _OBJECT !== undefined && typeof _OBJECT === _TYPE){
			bool = true;
		}

		return bool;
	},

	/**
	 * <pre>
	 * Null 문자열을 검증합니다.
	 * </pre>
	 *
	 * @param _STRING - 검증용 객체 (object)
	 * @returns {"" or string}
	 */
	validNull : function(_STRING){
		if(_STRING == null || _STRING == undefined || _STRING == "null"){
			_STRING = "";
		}

		return _STRING;
	},

	/**
	 * <pre>
	 * 올바른 숫자인지 검사합니다.
	 * </pre>
	 *
	 * @param _STRING
	 * @returns {Boolean - true : 정상 데이터 / false : 이상 데이터}
	 */
	validNaN : function(_OBJECT){
		var bool = false;

		if(_OBJECT !== null && _OBJECT !== "" && _OBJECT !== undefined && !isNaN(Number(_OBJECT))){
			bool = true;
		}

		return bool;
	},

	/**
	 * <pre>
	 * 숫자인지 검사합니다.
	 * </pre>
	 *
	 * @param _STRING
	 * @returns {Boolean - true : 정상 데이터 / false : 이상 데이터}
	 */
	isNumber : function(value){
		if(arguments[1]){
			value = Number(value);
		}
		return typeof value === "number" && isFinite(value);
	},

	/**
	 * <pre>
	 * Null인지 검사합니다.
	 * </pre>
	 *
	 * @param _STRING
	 * @returns {Boolean - true : Null 데이터 / false : Not Null 데이터}
	 */
	isNull : function(value){
		return value == null;
	},

	/**
	 * <pre>
	 * 공백인지 검사합니다.
	 * </pre>
	 *
	 * @param _STRING
	 * @returns {Boolean - true : 공백 데이터 / false : 공백이 아닌 데이터}
	 */
	isEmpty : function(value){
		return value == "";
	},

	/**
	 * <pre>
	 * Null,공백인지 검사합니다.
	 * </pre>
	 *
	 * @param _STRING
	 * @returns {Boolean - true : Null 또는 공백 데이터 / false : 정상 데이터}
	 */
	isNullAndEmpty : function(value){
		var bool = true;
		if(value != "" && value != null) bool = false;
		return bool;
	},

	/**
	 * <pre>
	 * Random Utils 입니다.
	 * </pre>
	 *
	 * @deprecated
	 */
	Random : {
		randomNumber : function(){
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		},
		getGUID : function(){
			return this.randomNumber() + this.randomNumber() + '-' + this.randomNumber()+ '-' + this.randomNumber()
			+ '-' + this.randomNumber() + '-' + this.randomNumber() + this.randomNumber() + this.randomNumber();
		},
		getGUID12 : function(){
			return this.randomNumber() + this.randomNumber() + this.randomNumber();
		},
		getRandomExtention : function(){
			return _common.utils.Random.getGUID12()+"_"+_common.utils.Random.getGUID12();
		}
	},

	/**
	 * <pre>
	 * 이미지 확장자가 맞는지 확인합니다.
	 * </pre>
	 *
	 * @param $_SELECTOR
	 * @returns {Boolean}
	 */
	isImageExtension : function($_SELECTOR){
		var index = $("." + $_SELECTOR.attr("class")).index($_SELECTOR) + 1;
		if("" == $_SELECTOR.val()){
			$("#pic" + index).val("");
			$_SELECTOR.val("");
			return false;
		}
		var file = $_SELECTOR.val().replace(/.*(\/|\\)/, '');
		var pathpoint = file.lastIndexOf('.');
		var filepoint = file.substring(pathpoint + 1, file.length);
		var filetype = filepoint.toLowerCase();

		if(filetype == 'gif'|| filetype == 'jpg' || filetype == 'jpeg' || filetype == 'png'){
			$("#pic" + index).val($_SELECTOR.val().replace(/.*(\/|\\)/, ''));
			return true;
		}else{
			alert(filetype + " 확장자는 첨부할 수 없습니다.");
			$("#pic" + index).val("");
			$_SELECTOR.val("");
			return false;
		}
	},

	/**
	 * <pre>
	 * 허용된 확장자가 맞는지 확인합니다.
	 * </pre>
	 *
	 * @param $_SELECTOR
	 * @returns {Boolean}
	 */
	isDataExtension : function($_SELECTOR){
		var ALLOW_ARRAY = [
           "gif", "jpg", "jpeg", "png",
           "txt", "hwp", "docx", "doc", "pdf",
           "ppt", "pptx", "xls", "xlsx",
           "alz", "gz", "rar", "tar", "tgz", "z", "zip"
        ];

		var index = $("." + $_SELECTOR.attr("class")).index($_SELECTOR) + 1;
		if("" == $_SELECTOR.val()){
			$("#fnmOrg").val("");
			$_SELECTOR.val("");
			return false;
		}
		var file = $_SELECTOR.val().replace(/.*(\/|\\)/, '');
		var pathpoint = file.lastIndexOf('.');
		var filepoint = file.substring(pathpoint + 1, file.length);
		var filetype = filepoint.toLowerCase();

		var bool = false;
		for(var i=0; i<ALLOW_ARRAY.length; i++){
			if(filetype == ALLOW_ARRAY[i]){
				bool = true;
			}
		}
		if(bool){
			$("#fnmOrg").val($_SELECTOR.val().replace(/.*(\/|\\)/, ''));
			return true;
		}else{
			alert(filetype + " 확장자는 첨부할 수 없습니다.");
			$("#fnmOrg").val("");
			$_SELECTOR.val("");
			return false;
		}
	},

	/** '0330000000' 번호형식의 '-'를 추가해준다.
	 * @param 문자열
	 * @return '-'추가 문자열
	 */
	strTelAdd : function(str){
		if (str == null || str == "" || str == "null"){
			return "";
		} else {
			var f_num = str.substring(0, 3);
			var s_num = "";
			var t_num = "";
			var num = "";
			if ( str.length == 10 ) {
				s_num = str.substring(3, 6);
				t_num = str.substring(6, 10);
				num = f_num+"-"+s_num+"-"+t_num;

			} else if ( str.length == 11 ){

				s_num = str.substring(3, 7);
				t_num = str.substring(7, 11);
				num = f_num+"-"+s_num+"-"+t_num;
			} else {
				num = str;
			}

			return num;
		}

	},

	/**
	 * ip포멧을 위한 함수.
	 *
	 * @param ip
	 * @returns {String}
	 */
	setIpFormat : function(ip){
	    var result = '';
		var ipSpl = [];
	    if ( ip != null ) {
	    	ipSpl = ip.split(".");
	    	if ( ipSpl.length == 4 ) {
	    		for ( var i = 0; i < ipSpl.length; i++ ) {
	    			result += Number(ipSpl[i]);
	    			if ( i != 3 ) result += '.';
	    		}
	    	}
	    }
	    return result;
	}
};

/**
 * 엘리먼트를 좌우 중앙정렬 합니다.
 * 상하 중앙정렬은 margin: 0 auto; 의 속성이 필요합니다.
 * 선택 파라미터를 포함하지 않을 경우, 브라우저 크기 기준으로 정렬합니다.
 *
 * 선택) $_target - 대상을 기준으로 정렬 (jQuery object)
 */
$.fn.center = function($_target){
	var marginTop = 0;
	if(!_common.utils.validObject($_target, "object")){
		marginTop = (jQuery(window).height() - this.outerHeight()) / 2 + jQuery(window).scrollTop();
	}else{
		marginTop = ($_target.height() - this.outerHeight()) / 2;
	}
	if(marginTop < 0){
		marginTop = 0;
	}
	if(this.is("span")){
		this.css("display", "inline-block");
		$_target.css("text-align", "center");
	}
	this.css("margin", "0 auto");
	this.css("margin-top", marginTop);
	return this;
};

/**
 * 엘리먼트의 높이를 조절합니다.
 * 엘리먼트의 높이, 상단여백, 푸터의 높이 등을 참고합니다.
 */
$.fn.elementReSize = function(){
	var windowHeight = Number($(window).height());
	var elemMarginTop = Number(this.css("margin-top").replace("px", ""));
	var elemHeight = Number(this.height());
	var footerHeight = Number($("#footer").height());
	var addHeight = windowHeight - (elemMarginTop + elemHeight + footerHeight);

	this.height(this.height() + addHeight);
	return this;
};

/**
 * 스핀을 생성합니다.
 *
 * @dependency jQuery.spin 플러그인을 의존합니다.
 */
$.fn.spinStart = function(_callback){
	var opts = {
			lines: 13,
			length: 10,
			width: 2,
			radius: 7,
			corners: 1,
			rotate: 0,
			direction: 1,
			color: '#000000',
			speed: 1,
			trail: 60,
			left: '150px',
			top: '60%',
			shadow: false,
			hwaccel: false,
			className: 'spinner'
	};
	var id = this.selector.replace("#", "").replace(".", "");
	var spinner = new Spinner(opts).spin(document.getElementById(id));
	if(_callback != null){
		_callback();
	}
};

/**
 * 생성되어있는 스핀을 삭제합니다.
 *
 * @dependency jQuery.spin 플러그인을 의존합니다.
 */
$.fn.spinStop = function(_callback){
	this.find('.spinner').remove();
	if(_callback != null){
		_callback();
	}
};

/**
 * jQuery DatePicker 설정입니다.
 */
if($.datepicker != null){
	$.datepicker.regional['ko'] = {
			closeText: '닫기',
			prevText: '이전달',
			nextText: '다음달',
			currentText: '초기화',
			monthNames: ['1월','2월','3월','4월','5월','6월',
			             '7월','8월','9월','10월','11월','12월'],
            monthNamesShort: ['1월','2월','3월','4월','5월','6월',
                               '7월','8월','9월','10월','11월','12월'],
                               dayNames: ['일','월','화','수','목','금','토'],
                               dayNamesShort: ['일','월','화','수','목','금','토'],
                               dayNamesMin: ['일','월','화','수','목','금','토'],
                               buttonImageOnly: false,
                               weekHeader: 'Wk',
                               dateFormat: 'yy-mm-dd',
                               firstDay: 0,
                               isRTL: false,
                               duration: 200,
                               showAnim: 'show',
                               showMonthAfterYear: false
	};
	$.datepicker.setDefaults($.datepicker.regional['ko']);
	$.datepicker._gotoToday = function(id){
		$.datepicker._clearDate(id);
	};
	$.datepicker.noBefore = function(date){
		var boolArray;

		if(date > new Date()){
			boolArray = [false];
		}else{
			boolArray = [true];
		}

		return boolArray;
	};
	$.datepicker.validValue = function($_DATEPICKER){
		if(!_common.utils.validObject($_DATEPICKER.val(), "string")){
			alert("기간을 선택해 주세요.");
			$_DATEPICKER.focus();
			return false;
		}else{
			return true;
		}
	};
}

/**
 * 체크박스에 쉬프트 + 클릭 기능을 추가합니다.
 */
$.fn.shiftClick = function() {
	var lastSelected;
    var checkBoxes = $(this);

    this.each(function() {
    	$(this).click(function(ev) {
    		if (ev.shiftKey) {
    			var last = checkBoxes.index(lastSelected);
    			var first = checkBoxes.index(this);

    			var start = Math.min(first, last);
    			var end = Math.max(first, last);

    			var chk = lastSelected.checked;
    			for (var i = start; i < end; i++) {
    				checkBoxes[i].checked = chk;
    			}
    		} else {
    			lastSelected = this;
    		}
    	})
    });
};

/**
 * 체크박스에 드래그 기능을 추가합니다.
 */
$.fn.dragCheck = function() {
	window.dragCheckState = null;
	window.dragCheckOrigin = null;

	this.mousedown(function() {
		window.dragCheckState = !this.checked;
		window.dragCheckOrigin = this;
	}).mouseup(function() {
		window.dragCheckState = null;
		window.dragCheckOrigin = null;
	}).mouseenter(function(e) {
		if(window.dragCheckState !== null) {
			$(this).add(window.dragCheckOrigin)
				   .prop("checked", window.dragCheckState)
				   .trigger("change", e);
		}
	});

	$(document.body).mouseup(function() {
		window.dragCheckState = null;
		window.dragCheckOrigin = null;
	});
};

$.fn.shiftAndDrag = function(){
	$(this).shiftClick();
	$(this).dragCheck();
}

/**
 * DOM 의 위치 변경을 감지합니다.
 */
$.fn.onPositionChanged = function (trigger, millis) {
	if (millis == null) millis = 0;
	var o = $(this[0]);
	if (o.length < 1) return o;

	var lastPos = null;
	var lastOff = null;
	setInterval(function () {
		if (o == null || o.length < 1) return o;
		if (lastPos == null) lastPos = o.position();
		if (lastOff == null) lastOff = o.offset();
		var newPos = o.position();
		var newOff = o.offset();
		if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
			$(this).trigger('onPositionChanged', { lastPos: lastPos, newPos: newPos });
			if (typeof (trigger) == "function") trigger(lastPos, newPos);
			lastPos = o.position();
		}
		if (lastOff.top != newOff.top || lastOff.left != newOff.left) {
			$(this).trigger('onOffsetChanged', { lastOff: lastOff, newOff: newOff});
			if (typeof (trigger) == "function") trigger(lastOff, newOff);
			lastOff= o.offset();
		}
	}, millis);

	return o;
};

/**
 * 마우스 Press 이벤트 입니다.
 */
$.fn.mousehold = function(timeout, f) {
	if (timeout && typeof timeout == 'function') {
		f = timeout;
		timeout = 100;
	}
	if (f && typeof f == 'function') {
		var timer = 0;
		var fireStep = 0;
		return this.each(function() {
			$(this).mousedown(function() {
				fireStep = 1;
				var ctr = 0;
				var t = this;
				timer = setInterval(function() {
					ctr++;
					f.call(t, ctr);
					fireStep = 2;
				}, timeout);
			})

			clearMousehold = function() {
				clearInterval(timer);
				if (fireStep == 1) f.call(this, 1);
				fireStep = 0;
			}

			$(this).mouseout(clearMousehold);
			$(this).mouseup(clearMousehold);
		})
	}
}

/* 파일 드레그 업로드 이벤트 입니다. */
$.fn.extend({
    filedrop: function (options) {
        var defaults = {
            callback: null
        }
        options = $.extend(defaults, options)
        return this.each(function () {
            var files = [];
            var $this = $(this);

            // 기본 액션을 취소합니다.
            $this.bind('dragover dragleave', function (event) {
                event.stopPropagation();
                event.preventDefault();
            })

            // 드랍 이벤트 입니다.
            $this.bind('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();

                files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files;

                // Convert uploaded file to data URL and pass trought callback
                if (options.callback) {
                    for (i = 0; i < files.length; i++) {
                        reader = new FileReader();
                        reader.onload = function (event) {
                            options.callback(event.target.result);
                        }
                        reader.readAsDataURL(files[0]);
                    }
                }
                return false;
            })
        })
    }
});

function progress(timeleft, timetotal, $element, duration) {
	if(!$element.is(":visible")) $element.show();

	var _duration = 500;
	if(duration > 0) _duration = duration;
	var progressBarWidth = timeleft * $element.width() / timetotal;
	$element.find('div').animate({ width: progressBarWidth }, _duration);//.html(Math.floor(timeleft/60) + ":"+ timeleft%60);
	if(timeleft > 0) {
		setTimeout(function() {
			progress(timeleft - 1, timetotal, $element);
		}, 1000);
	}else{
		$element.find('div').animate({ width: progressBarWidth }, _duration);
	}
};

$.fn.sortOptgroup = function(){
	this.find("optgroup").each(function(){
		if($(this).children().length === 0) $(this).remove();

		var $option = $(this).find("option").sort(function(a, b){
			return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
		});

		$(this).append($option);
	});

	return this;
};

$.fn.sortElements = (function(){
	var sort = [].sort;
	return function(comparator, getSortable) {
		getSortable = getSortable || function(){ return this; };

		var placements = this.map(function(){
			var sortElement = getSortable.call(this),
				parentNode = sortElement.parentNode,
				nextSibling = parentNode.insertBefore(
					document.createTextNode(''),
					sortElement.nextSibling
				);

			return function() {

				if (parentNode === this) {
					throw new Error(
						"엘리먼트 정렬에 실패하였습니다."
					);
				}
				parentNode.insertBefore(this, nextSibling);
				parentNode.removeChild(nextSibling);
			};
		});

		return sort.call(this, comparator).each(function(i){
			placements[i].call(getSortable.call(this));
		});
	};
})();

/**
 * 이미지 파일 압축해서 다운로드
 * @param arFileArray {url : 이미지 url, filename : file 이름} 배열
 * @param sZipFileName zip 파일 이름
 */

function downloadZipFile(arFileArray, sZipFileName){
	var Promise = window.Promise;
	if (!Promise) {
		Promise = JSZip.external.Promise;
	}
	function urlToPromise(url) {
		return new Promise(function(resolve, reject) {
			JSZipUtils.getBinaryContent(url, function (err, data) {
				if(err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}
	if(!JSZip.support.blob) {
		showError("This demo works only with a recent browser !");
	}
	var zip = new JSZip();
	for(var i = 0; i < arFileArray.length; i++)
	{
		var url = arFileArray[i].url;
		var filename = arFileArray[i].filename;
		zip.file(filename, urlToPromise(url), {binary:true});
	}
	zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
	})
	.then(function callback(blob) {
		saveAs(blob, sZipFileName);
	}, function (e) {
		showError(e);
	});
}