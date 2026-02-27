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

		if($("#mobileNum").val() == ""){
			alert("휴대폰 번호를 입력하여 주십시오!");
			$("#mobileNum").focus();
			return false;
		}
//
//	    if($('#file').val() === undefined || $('#file').val() == ""){
//	    	alert("서약서를 첨부하여 주십시오!");
//			$("#file").focus();
//			return false;
//	    }
		user.reg.add();
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

		if($("#orgMgrNo").val() == ""){
			alert("소속기관을 선택하여 주십시오!");
			$("orgMgrNo").focus();
			return false;
		}

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

		if(smsChk == 'Y'){
			if($("#accNo").val() == ""){
				alert("인증번호를  입력하여 주십시오!");
				$("#accNo").focus();
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

		_common.callAjax("/GMT_user/validChk.json", _PARAMETER, function(json){
			if(json.result){
				//_PARAMETER['userNm'] = json.userNm;
				/*var _smsParam = {
					userId : userId,
					mobileNum : mobileNum,
					userNm : json.userNm
				};*/

				user.login.createAccNo(_PARAMETER);
			}else{
				alert("일치하는 계정정보가 없습니다.\r\n 입력정보를 확인하여 주십시오.");
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
			//isOuterUser : _CipherManager.fn.encryptTEA(TEAKey, isOuterUser),
			key : _CipherManager.fn.encryptRSA($("#Modulus").val(), $("#Exponent").val(), TEAKey)
		};
		if(smsChk=='Y'){
			_PARAMETER['accNo'] = _CipherManager.fn.encryptTEA(TEAKey, $("#accNo").val());
			_PARAMETER['accNo'] = _CipherManager.fn.encryptTEA(TEAKey, $("#accNo").val());
		}

		_common.callAjax("/GMT_user/signIn.json", _PARAMETER, function(json){

			if(json.RSAError || json.error){
				alert("안전한 로그인을 위해 서버에 암호화 키를 다시 요청합니다.");
				location.reload();
			}else if(json.result == null){
				alert("계정 또는 비밀번호를 다시한번 확인해 주세요.");
				return false;
			}else{
				if(json.result.useYn == "N"){
					alert("접속권한이 존재하지 않습니다.\n관리자에게 문의하여 주십시오.");
				}else{
					location.href = _common.context() + "/GMT_map.do";

					return;


					var $parent = $(parent.document).contents();
					//location.href = _common.context() + "/map/view.do";
					$parent.find("#loginView").animate({
						top: $(window).height()
					}, 1000, function(){
						$parent.find("#loginView").hide();
					});


//					sessionSocket = new XeusWS();
//					sessionSocket.create("ws://" + location.host + "/gis-mng/session");
				};
			}
		}, false);
	},
	createAccNo : function(_PARAMETER){
		_common.callAjax("/GMT_user/createAccNo.json", _PARAMETER, function(json){
			if(json.result){
				alert('인증번호가 전송되었습니다.\r\n최대 5분까지 지연될 수 있습니다.');
				$("#accNo").focus();
			}else{
				if(json.msg) alert(json.msg);
			}
		}, false);
	}
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

		_common.callAjax("/GMT_user/duplicateUserId.json", {"userId" : $("#regUserId").val()}, function(json){
			if(json.result == null){
				alert("사용하셔도 좋습니다.\n나머지 항목을 입력해 주세요.");
				$("#regUserPwd").focus();
				idChkStat = true;
			}else{
				if(json.result.userId != ""){
					alert("입력하신 계정이 이미 존재합니다.\n다른 계정을 입력하여 주십시오.");
					$("#regUserId").focus();
					idChkStat = false;
				}
			}
		});
	},

	add : function(smsChk){
		if(!idChkStat){
//			alert("계정 중복확인은 필수사항 입니다.");
			$("#idChk").focus();
			return false;
		}else{
			_common.formSubmit("/GMT_user/add.json", $("#sendForm"), function(json){
				if(json.result == true){
					alert("사용자 등록을 완료했습니다.");
					$("#backBtn").click();
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
		var _url = "/GMT_user/findAndEidt.json";
		if(mode == "id"){
			delete _param['userId'];
			_url = "/GMT_user/findId.json";
		}
		_common.callAjax(_url, _param, function(json){
			if(mode == "id"){
				if(smsChk=='Y'){
					if(json.smsError){
						alert(json.smsError);
						return false;
					}
				}

				if(json.result == null){
					alert("입력하신 정보와 일치하는 계정이 존재하지 않습니다.\r\n계정정보 확인 후, 다시 시도하여 주십시오.");
				}else{
					//alert("입력정보와 일치하는 아이디는 "+json.result+" 입니다.");

					var _smsParam = {
						"title": "계정 문의",
						"msg": "[서초 스마트시티 통합플랫폼] " + _param["userNm"] + "님의 계정은 [" + json.result + "] 입니다.",
						"rcvNm": _param["userNm"],
						"rcvPhone": _param["mobileNum"],
						"rcvId": json.result
					};

					_common.callAjax("/GMT_sysMng/sendSms.json", _smsParam, function(json){
						if(json.result){
							alert("계정정보가 문자메시지로 발송되었습니다.");
						}
					}, false);
					/*location.href = _common.context() + '/';*/
				}
			} else if(mode == "pw") {
				if(json.result == null){
					alert("입력하신 정보와 일치하는 계정이 존재하지 않습니다.\r\n계정정보가 정확할 경우만 임시 비밀번호발급이 가능합니다.\r\n계정정보 확인 후, 다시 시도하여 주십시오.");
				}else{
					//alert("임시 비밀번호가 생성되었습니다.\r\n아래의 번호를 기억하신 뒤 로그인하여 주십시오.\r\n임시 비밀번호 : [ "+json.result+" ]\r\n보안을 위하여 로그인 후 비밀번호를 변경하여 주십시오.");

					var _smsParam = {
						"title": "암호 문의",
						"msg": "[서초 스마트시티 통합플랫폼] " + _param["userId"] + " 계정의 암호가 [" + json.result + "] 로 초기화 되었습니다.",
						"rcvNm": _param["userNm"],
						"rcvPhone": _param["mobileNum"],
						"rcvId": _param["userId"]
					};

					_common.callAjax("/GMT_sysMng/sendSms.json", _smsParam, function(json){
						if(json.result){
							alert("초기화 암호가 문자메시지로 발송되었습니다.");
						}
					}, false);
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
		/*_common.callAjax("/GMT_user/edit.json", _common.utils.collectSendData(), function(json){
			if(json.result == null){
				alert(json.error);
			}else{
				alert("사용자 정보가 변경되었습니다.\n로그인 페이지로 이동합니다.");
				location.href = _common.context() + "/GMT_user/signOut.do";
			}
		});*/
		_common.formSubmit("/GMT_user/edit.json", $("#sendForm"), function(json){
			if(json.result == null){
				alert(json.error);
			}else{
				alert("사용자 정보가 변경되었습니다.");//\n로그인 페이지로 이동합니다.
				//location.href = _common.context() + "/GMT_user/signOut.do";
			}
		});
	},
	editPassword : function(){
		if(confirm("비밀번호를 변경하시겠습니까?")){
			_common.callAjax("/GMT_user/editPassword.json", {"nowUserPwd" : $("#nowUserPwd").val(), "newUserPwd" : $("#newUserPwd").val()}, function(json){
				if(json.result == null){
					alert(json.error);
				}else{
					if(json.result){
						alert("비밀번호를 변경하였습니다.");
						location.reload();
					}
				}
			});
		}
	}
};