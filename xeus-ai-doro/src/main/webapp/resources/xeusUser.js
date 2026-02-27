if(!window.user) user = {};
var idChkStat = false;

user.valid = {
	signIn : function(smsChk){
		if($("#userId").val() == ""){
			alert("아이디를 입력하여 주십시오!");
			$("#userId").focus();
			return false;
		}

		if($("#userPwd").val() == ""){
			alert("비밀번호를  입력하여 주십시오!");
			$("#userPwd").focus();
			return false;
		}

		if(smsChk == 'Y'){
			if($("#mobileNum").val() == ""){
				alert("핸드폰번호를  입력하여 주십시오!");
				$("#mobileNum").focus();
				return false;
			}

			if($("#accNo").val() == ""){
				alert("인증번호를  입력하여 주십시오!");
				$("#accNo").focus();
				return false;
			}
		}

		user.login.signIn(smsChk);
	},

	reg : function(){
		if($("#regUserId").val() == ""){
			alert("아이디를 입력하여 주십시오!");
			$("#regUserId").focus();
			return false;
		}

		if($("#regUserId").val().length < 2){
			alert("아이디는 2자리 이상 입력하여 주십시오!");
			$("#regUserId").focus();
			return false;
		}

		if($("#regUserPwd").val().length < 8){
			alert("패스워드는 8자리 이상 입력하여 주십시오!");
			$("#regUserPwd").focus();
			return false;
		}

		if(!$("#regUserPwd").val().match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)){
			alert("비밀번호는 문자, 숫자, 특수문자의 조합으로 9~16자리로 입력해주세요.");
			$("#regUserPwd").focus();
			return false;
		}

		if($("#regUserPwd").val() != $("#regUserPwdRe").val()){
			alert("패스워드가 같지 않습니다.");
			$("#regUserPwd").focus();
			return false;
		}

		if($("#userNm").val() == ""){
			alert("사용자명을 입력하여 주십시오!");
			$("#userNm").focus();
			return false;
		}

		if($("#birthDay").val() == ""){
			alert("생년월일을 입력하여 주십시오!");
			$("#birthDay").focus();
			return false;
		}
		if($("#birthDay").val().length != 6){
			alert("생년월일은 6자리로 입력해주세요!");
			$("#birthDay").focus();
			return false;
		}

		if($("#orgMgrNo").val() == ""){
			alert("소속기관을 선택하여 주십시오!");
			$("#orgMgrNo").focus();
			return false;
		}

		if($("#departNm").val() == ""){
			alert("부서명을 입력하여 주십시오!");
			$("#departNm").focus();
			return false;
		}

		if($("#posNm").val() == ""){
			alert("직급(직책)을 입력하여 주십시오!");
			$("#posNm").focus();
			return false;
		}

		var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;

		if(filter.test($('#email').val()) != true){
			alert("이메일 형식이 아닙니다!");
			$('#email').focus();
			return false;
		}

		if($("#telNum").val() == ""){
			alert("사무실 전화번호를 입력하여 주십시오!");
			$("#telNum").focus();
			return false;
		}

		if($('#sendForm').find("#mobileNum").val() == ""){
			alert("휴대폰 번호를 입력하여 주십시오!");
			$('#sendForm').find("#mobileNum").focus();
			return false;
		}

	    if($('#file').val() === undefined || $('#file').val() == ""){
	    	alert("서약서를 첨부하여 주십시오!");
			$("#file").focus();
			return false;
	    }

	    if(smsChk == 'Y'){
			if($("#sendForm").find("#accNo").val() == ""){
				alert("인증번호를  입력하여 주십시오!");
				$("#sendForm").find("#accNo").focus();
				return false;
			}
		}

		user.reg.add(smsChk);
	},

	find : function(mode, smsChk){
		if(mode == "pw"){
			if($("#userId").val() == ""){
				alert("아이디를 입력하여 주십시오!");
				$("#userId").focus();
				return false;
			}
			if($("#userId").val().length < 2){
				alert("아이디는 2자리 이상 입력하여 주십시오!");
				$("#userId").focus();
				return false;
			}
		}

		if($("#userNm").val() == ""){
			alert("사용자명을 입력하여 주십시오!");
			$("#userNm").focus();
			return false;
		}

		/*if($("#orgMgrNo").val() == ""){
			alert("소속기관을 선택하여 주십시오!");
			$("orgMgrNo").focus();
			return false;
		}*/

		/*var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;

		if(filter.test($('#email').val()) != true){
			alert("이메일 형식이 아닙니다!");
			$('#email').focus();
			return false;
		}*/

		if($("#telNum").val() == ""){
			alert("휴대전화번호를 입력하여 주십시오!");
			$("#telNum").focus();
			return false;
		}

		if($("#birthDay").val() == ""){
			alert("생년월일을 입력하여 주십시오!");
			$("#birthDay").focus();
			return false;
		}
		if($("#birthDay").val().length != 6){
			alert("생년월일은 6자리로 입력해주세요!");
			$("#birthDay").focus();
			return false;
		}

		if(smsChk == 'Y'){
			if($("#sendForm").find("#accNo").val() == ""){
				alert("인증번호를  입력하여 주십시오!");
				$("#sendForm").find("#accNo").focus();
				return false;
			}
		}

		user.find.inquiry(mode, smsChk);
	},

	edit : function(){

		if($("#userPwd").val().length < 8){
			alert("패스워드는 8자리 이상 입력하여 주십시오!");
			$("#userPwd").focus();
			return false;
		}

		if(!$("#userPwd").val().match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)){
			alert("비밀번호는 문자, 숫자, 특수문자의 조합으로 9~16자리로 입력해주세요.");
			$("#userPwd").focus();
			return false;
		}

		if($("#userPwd").val() != $("#userPwdRe").val()){
			alert("패스워드가 같지 않습니다.");
			$("#userPwd").focus();
			return false;
		}

		if($("#userNm").val() == ""){
			alert("사용자명을 입력하여 주십시오!");
			$("#userNm").focus();
			return false;
		}

		if($("#orgMgrNo").val() == ""){
			alert("소속기관을 선택하여 주십시오!");
			$("#orgMgrNo").focus();
			return false;
		}

		var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;

		if(filter.test($('#email').val()) != true){
			alert("이메일 형식이 아닙니다!");
			$('#email').focus();
			return false;
		}

		if($("#telNum").val() == ""){
			alert("휴대전화번호를 입력하여 주십시오!");
			$("#telNum").focus();
			return false;
		}

		if($("#birthDay").val() == ""){
			alert("생년월일을 입력하여 주십시오!");
			$("#birthDay").focus();
			return false;
		}
		if($("#birthDay").val().length != 6){
			alert("생년월일은 6자리로 입력해주세요!");
			$("#birthDay").focus();
			return false;
		}


		user.UE.edit();
	},

	editPassword : function(){

		if($("#newUserPwd").val().length < 8){
			alert("패스워드는 8자리 이상 입력하여 주십시오!");
			$("#newUserPwd").focus();
			return false;
		}

		if(!$("#newUserPwd").val().match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)){
			alert("비밀번호는 문자, 숫자, 특수문자의 조합으로 9~16자리로 입력해주세요.");
			$("#newUserPwd").focus();
			return false;
		}

		if($("#newUserPwd").val() != $("#newUserPwdRe").val()){
			alert("패스워드가 같지 않습니다.");
			$("#newUserPwd").focus();
			return false;
		}

		user.UE.editPassword();
	},

	reset : function(){
		$("input").val("");
	},

	validChk : function(userId, userPwd, mobileNum){
		//TODO 계정정보 유효성 검사
		var userId = $("#userId").val();
		if( userId == ""){
			alert("아이디를 입력하여 주십시오!");
			$("#userId").focus();
			return false;
		}
		var userPwd = $("#userPwd").val();
		if( userPwd == ""){
			alert("비밀번호를  입력하여 주십시오!");
			$("#userPwd").focus();
			return false;
		}


		var mobileNum = $("#mobileNum").val();


		if(mobileNum == ""){
			alert("핸드폰번호를  입력하여 주십시오!");
			$("#mobileNum").focus();
			return false;
		}

		//사용자 정보 조회 일치하는 정보가 없으면 리턴
		//TODO 인증번호 생성 후 사용자에게 SMS 전송
		var TEAKey = _CipherManager.fn.generateTEAKey();

		var _PARAMETER = {
			userId : _CipherManager.fn.encryptTEA(TEAKey, userId),
			userPwd : _CipherManager.fn.encryptTEA(TEAKey, userPwd),
			mobileNum : _CipherManager.fn.encryptTEA(TEAKey, mobileNum),
			key : _CipherManager.fn.encryptRSA($("#Modulus").val(), $("#Exponent").val(), TEAKey)
		};

		/*user.login.createAccNo(_PARAMETER);
		return;*/

		_common.callAjax("/user/validChk.json", _PARAMETER, function(json){
			if(json.result){
				//_PARAMETER['userNm'] = json.userNm;
				/*var _smsParam = {
					userId : userId,
					mobileNum : mobileNum,
					userNm : json.userNm
				};*/

				user.login.createAccNo(_PARAMETER);
			}else{
				if(json.cause == 'id'){
					alert("등록되지 않은 아이디입니다.");
				}
				else if(json.cause == 'pwd'){
					alert("아이디에 따른 비밀번호가 틀렸습니다.");
				}
				else if(json.cause == 'mobileNum'){
					alert("아이디에 따른 핸드폰번호가 틀렸습니다.");
				}
				else{
					alert("일치하는 계정정보가 없습니다.\r\n 입력정보를 확인하여 주십시오.");
				}
			}
		}, false);
	}

};

/*
 로그인
 */
user.login = {
	signIn : function(smsChk){
		var TEAKey = _CipherManager.fn.generateTEAKey();

		var _PARAMETER = {
			userId : _CipherManager.fn.encryptTEA(TEAKey, $("#userId").val()),
			userPwd : _CipherManager.fn.encryptTEA(TEAKey, $("#userPwd").val()),
			smsChk : _CipherManager.fn.encryptTEA(TEAKey, smsChk),
			isOuterUser : _CipherManager.fn.encryptTEA(TEAKey, isOuterUser),
			key : _CipherManager.fn.encryptRSA($("#Modulus").val(), $("#Exponent").val(), TEAKey)
		};

		if(smsChk == "Y"){
			_PARAMETER["accNo"] = _CipherManager.fn.encryptTEA(TEAKey, $("#accNo").val());
		}

		var _URL = "/user/signIn.json";
		var _isMobile = false;
		var _isCCTVDomain= false;
		if(location.pathname.contains("/tvius/mobile/login.do")){
			_URL = "/tvius/mobile/signIn.json";

			if($("#isCenter").length > 0 && $("#isCenter").is(":checked")){
				_URL = "/tvius/mobile/signInTablet.json";
				_URL = this.changeUrlByCctv(_URL);

				_PARAMETER["token"] = _CipherManager.fn.encryptTEA(TEAKey, $("#token").val());
			}

			_isMobile = true;
		}

		if(location.pathname.contains("/tvius/login.do")){
			_URL = "/tvius/signIn.json";

			_isCCTVDomain = true;
		}

		_common.callAjax(_URL, _PARAMETER, function(json){
			if(smsChk == "Y"){
				if(json.smsError){
					alert(json.smsError);
					return false;
				}
			}

			var bigMenu = "event";

			if(json.authList != undefined && json.authList != null && json.authList.length != 0){
				bigMenu = json.authList[0].authData.replace("tab","").replace("Tab","");

				if(("localStorage" in window) && !_common.utils.isNullAndEmpty(localStorage["LAST_TOP_MENU"])){
					for(var i=0; i<json.authList.length; i++){
						if(json.authList[i].authData === (localStorage["LAST_TOP_MENU"] + "Tab")){
							bigMenu = localStorage["LAST_TOP_MENU"];
							break;
						}
					}
				}
			}

			if(_isCCTVDomain) bigMenu = "tvius";

			if(json.RSAError || json.error){
				alert("안전한 로그인을 위해 서버에 암호화 키를 다시 요청합니다.");
				location.href = "./signOut.do";
			}else if(json.result == null){
				alert("계정 또는 비밀번호를 다시한번 확인해 주세요.");
				return false;
			}else{
				if(json.result.useYn == "N"){
					alert("접속권한이 존재하지 않습니다.\n관리자에게 문의하여 주십시오.");
				}else{
					if(_isMobile){
						location.href = _common.context() + "/tvius/mobile/main.do";
					}else{
						location.href = "../"+bigMenu+".do";
					}
				};
			}
		}, false);
	},
	createAccNo : function(_PARAMETER){
		_common.callAjax("/user/createAccNo.json", _PARAMETER, function(json){
			if(json.result){
				alert('인증번호가 전송되었습니다.\r\n최대 5분까지 지연될 수 있습니다.');
				$('#sendForm').find("#accNo").focus();
			}else{
				if(json.msg) alert(json.msg);
			}
		}, false);
	},
	changeUrlByCctv : function(url){
		//내부망일 때
		if(location.host.contains("101.102.104.113")){
			url = "http://101.102.104.113:9090/xeus"+url;
		}
		//로컬일 때
		else if(location.host.contains("127.0.0.1")){

			url = "http://"+location.host+"/xeus"+url;
		}
		//외부망일때
		else{
			url = "http://cctv.seocho.go.kr/xeus"+url;
		}

		return url;
	},
};

/*
 사용자등록신청
 */
user.reg = {
	idChk : function(){
		if($("#regUserId").val() == "" || $("#regUserId").val() == null){
			alert("아이디를 입력하여 주십시오!");
			$("#regUserId").focus();
			return false;
		}

		if($("#regUserId").val().length < 2){
			alert("아이디는 2자리 이상 입력하여 주십시오!");
			$("#regUserId").focus();
			return false;
		}

		var userId = $("#regUserId").val();
		if(userId != undefined && userId != null){
			userId = userId.trim();
		}

		_common.callAjax("/user/duplicateUserId.json", {"userId" : userId}, function(json){
			if(json.result == null){
				alert("사용하셔도 좋습니다.\n나머지 항목을 입력해 주세요.");
				$("#userPwd").focus();
				idChkStat = true;
			}else{
				if(json.result.userId != ""){
					alert("입력하신 계정이 이미 존재합니다.\n다른 계정을 입력하여 주십시오.");
					$("#userId").focus();
					idChkStat = false;
				}
			}
		});
	},

	checkKorea : function(str){
		var regex = /^[ㄱ-ㅎ|가-힣|0-9|]+$/;
		if(regex.test(str)){
			return true;
		}else{
			return false;
		}
	},

	add : function(smsChk){
		if(!idChkStat){
			alert("계정 중복확인은 필수사항 입니다.");
			$("#idChk").focus();
			return false;
		}else{

			/*_common.callAjax("/user/add.json", _common.utils.collectSendData(), function(json){
				if(json.result == true){
					alert("사용자 등록을 완료했습니다.\n로그인 페이지로 이동합니다.");
					location.href = _common.context() + '/';
				}else{
					alert(json.result);
					return false;
				}
			});*/
			var reqUserId=$("#regUserId").val();
			if(reqUserId != undefined && reqUserId != null){
				$("#regUserId").val(reqUserId.trim());
			}

			_common.formSubmit("/user/add.json", $("#sendForm"), function(json){
				if(smsChk == "Y"){
					if(json.smsError){
						alert(json.smsError);
						return false;
					}
				}

				if(json.result == true){
					//alert("사용자 등록을 완료했습니다.");//\n로그인 페이지로 이동합니다.
					if(confirm("사용자 등록을 완료했습니다.\r\n로그인페이지로 이동하시겠습니까?")){
						if(location.href.contains("tvius")){
							location.href = _common.context() + "/tvius/login.do";
						}
						else{
							location.href = _common.context() + "/user/login.do";
						}
					}
				}else{
					alert(json.result);
					return false;
				}
			});
		}
	}
};

/**
 * 사용자계정문의
 */
user.find = {
		inquiry : function(mode, smsChk){
			var _param = _common.utils.collectSendData();
			_param['smsChk'] = smsChk;
			var _url = "/user/findAndEidt.json";
			if(mode == "id"){
				delete _param['userId'];
				_url = "/user/findId.json";
			}
			_common.callAjax(_url, _param, function(json){
				if(mode == "id"){
					if(smsChk == "Y"){
						if(json.smsError){
							alert(json.smsError);
							return false;
						}
					}

					if(json.result == null){
						alert("입력하신 정보와 일치하는 계정이 존재하지 않습니다.\r\n계정 정보 확인 후, 다시 시도하여 주십시오.");
					}else{
						//alert("입력정보와 일치하는 아이디는 "+json.result+" 입니다.");

						if(smsChk == "Y"){
							var _smsParam = {
									"title": "계정 문의",
									"msg": "[스마트시티 통합플랫폼] " + _param["userNm"] + "님의 계정은 [" + json.result + "] 입니다.",
									"rcvNm": _param["userNm"],
									"rcvPhone": _param["mobileNum"],
									"rcvId": json.result
							};
							_common.callAjax("/sysMng/sendSms.json", _smsParam, function(json){
								if(json.result){
									alert("계정 정보가 문자메시지로 발송되었습니다.");
								}
							}, false);
						}else{
							alert(_param["userNm"] + "님의 계정은 [" + json.result + "] 입니다.");
						}
						/*location.href = _common.context() + '/';*/
					}
				} else if(mode == "pw") {
					if(json.result == null){
						if(json.smsError){
							alert(json.smsError);
						}else{
							alert("입력하신 정보와 일치하는 계정이 존재하지 않습니다.\r\n계정정보가 정확할 경우만 임시 비밀번호발급이 가능합니다.\r\n계정정보 확인 후, 다시 시도하여 주십시오.");
						}
					}else{
						//alert("임시 비밀번호가 생성되었습니다.\r\n아래의 번호를 기억하신 뒤 로그인하여 주십시오.\r\n임시 비밀번호 : [ "+json.result+" ]\r\n보안을 위하여 로그인 후 비밀번호를 변경하여 주십시오.");
						if(smsChk == "Y"){
							var _smsParam = {
									"title": "암호 문의",
									"msg": "[스마트시티 통합플랫폼] " + _param["userId"] + " 계정의 암호가 [" + json.result + "] 로 초기화 되었습니다.",
									"rcvNm": _param["userNm"],
									"rcvPhone": _param["mobileNum"],
									"rcvId": _param["userId"]
							};

							_common.callAjax("/sysMng/sendSms.json", _smsParam, function(json){
								if(json.result){
									alert("초기화 암호가 문자메시지로 발송되었습니다.");
								}
							}, false);
						}else{
							alert(_param["userId"] + " 계정의 암호가 [" + json.result + "] 로 초기화 되었습니다.");
						}
						/*location.href = _common.context() + '/';*/
					}
				}
			});
		}
};

/**
 * 사용자정보수정
 */
user.UE = {
	edit : function(){
		/*_common.callAjax("/user/edit.json", _common.utils.collectSendData(), function(json){
			if(json.result == null){
				alert(json.error);
			}else{
				alert("사용자 정보가 변경되었습니다.\n로그인 페이지로 이동합니다.");
				location.href = _common.context() + "/user/signOut.do";
			}
		});*/
		_common.formSubmit("/user/edit.json", $("#sendForm"), function(json){
			if(json.result == null){
				alert(json.error);
			}else{
				alert("사용자 정보가 변경되었습니다.");//\n로그인 페이지로 이동합니다.
				//location.href = _common.context() + "/user/signOut.do";
			}
		});
	},
	editPassword : function(){
		confirm("비밀번호를 변경하시겠습니까?", function(){
			_common.callAjax("/user/editPassword.json", {"nowUserPwd" : $("#nowUserPwd").val(), "newUserPwd" : $("#newUserPwd").val()}, function(json){
				if(json.result == null){
					confirm(json.error);
				}else{
					if(json.result){
						alert("비밀번호를 변경하였습니다.");
						location.reload();
					}
				}
			});
		});
	}
};