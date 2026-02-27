function resize(){
	$("#wrap").center();
}

$(document).ready(function (){

	resize();

	$(window).resize(function(){
		resize();
	});

//	$("input, select").focus(function(){
//		$(this).parent().parent().css("background-color", "#efefef");
//	}).focusout(function(){
//		$(this).parent().parent().css("background-color", "#ffffff");
//	});

	$("#regUserId").focus();

	$("#idChk").on("click", function(){
		user.reg.idChk();
	});

	$("#titleClose").on("click", function(){
		confirm("입력란을 모두 비우시겠습니까?", function(){
			$("input.sendData").val("");
		});
	});

	$("#backBtn, #back").on("click", function(){
//		location.href = _common.context() + "/GMT_user/login.do";
		$('.login_container.join').fadeOut(300, function(){
	        $('.login_container.log').fadeIn(300);
	    });
	});

	$('#okBtn').click(function(){
		user.valid.reg();
	});
	
	$('.join .sendData').on('keydown', function(e){
    	if (e.which === 13) {
    		e.preventDefault();
    		user.valid.reg();
    	};
    });
    
  
	$("#accNoBtn").on('click',function(){

		var userNm = $("#userNm").val();
		if( userNm == ""){
			alert("이름을 입력하여 주십시오!");
			$("#userNm").focus();
			return false;
		}
		var mobileNum = $("#mobileNum").val();
		if(mobileNum == ""){
			alert("핸드폰번호를  입력하여 주십시오!");
			$("#mobileNum").focus();
			return false;
		}

		//사용자 정보 조회 일치하는 정보가 없으면 리턴
		var TEAKey = _CipherManager.fn.generateTEAKey();

		var _PARAMETER = {
			userNm : userNm,
			mobileNum : _CipherManager.fn.encryptTEA(TEAKey, mobileNum),
			key : _CipherManager.fn.encryptRSA($("#Modulus").val(), $("#Exponent").val(), TEAKey)

		};
		user.login.createAccNo(_PARAMETER);
    });

	$("#btn_doc_down").click(function(){

		var _URL = _common.context() + "/user/getPledgeFile.json";

		$("#postForm").remove();
		var str = "";
		str += "<form action='" + _URL + "' method='POST' name='postForm' id='postForm'>";
		str += "</form>";
		$(str).appendTo("body").submit().remove();

	});
});
