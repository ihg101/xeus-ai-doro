<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ page import="geomex.xeus.user.util.RSAKey"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%
	RSAKey rsa = (RSAKey) session.getAttribute("RSA");
	UserVo vo = (UserVo) request.getAttribute("userVo");
	String userId = null;
	if(vo != null) userId = vo.getUserId();

	String smsChk = StrUtil.chkNull((String) request.getAttribute("smsChk"));
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<link rel="shortcut icon" href="../res/img/geomex.ico">
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/ui-darkness/jquery-ui.css?v=<%= DateUtil.getStrMilSec() %>">
<!-- <link rel="stylesheet" type="text/css" href="../res/css/xeus.reg.css?v=<%= DateUtil.getStrMilSec() %>">-->
<link rel="stylesheet" type="text/css" href="../res/css/xeus.login.css?v=<%= DateUtil.getStrMilSec() %>">
<link rel="stylesheet" type="text/css" href="../res/css/xeus.layout.css?v=<%= DateUtil.getStrMilSec() %>">
<title>XEUS-User Infomation Find</title>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.form.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.download.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/tea-block.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/base64.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/utf8.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/jsbn.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/rsa.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/helper.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/string.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/HashMap.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/string.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/Date.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/common.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../res/xeusUser.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script>
var smsChk = "<%=smsChk%>";

function resize(){
	$("#wrap").center();
}

$(document).ready(function (){

	resize();

	$(window).resize(function(){
		resize();
	});

/* 	$("input, select").focus(function(){
		$(this).parent().parent().css("background-color", "#efefef");
	}).focusout(function(){
		$(this).parent().parent().css("background-color", "#ffffff");
	}); */

	$("#userNm").focus();

	$("#backBtn, #back").on("click", function(){
		if(confirm("로그인 페이지로 이동하시겠습니까?")) history.back();
	});

	$('#okBtn').click(function(){
		var mode = $(this).attr("mode");
		user.valid.find(mode, smsChk);
	});

	$("#accNo, #mobileNum").keyup(function(e){
		if(e.which == 13){
			$("#okBtn").click();
		}
	});

	$('.tab').click(function(){
		if(!$(this).hasClass("active")){
			$('.tab').removeClass("active");
			$(this).addClass("active");
			if($(this).hasClass("findId")){
				$('.pwOnly').hide();
				$('#okBtn').attr("mode", "id");
			}else{
				$('.pwOnly').show();
				$('#okBtn').attr("mode", "pw");
			}
		}
		$("#accNo").val("");
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
			alert("핸드폰번호를 입력하여 주십시오!");
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

});

</script>
<style>
/* .tab{ margin: 0; padding: 25px 0; color: #a7a7aa; font-weight: bold; background: #56585e; float: left; width: 224px; text-align: center; height: 15px; cursor: pointer; }
.active{ color: white; }
#content{ width: 448px !important; } */
.tab {margin-right: 15px; font-size: 18px; font-weight: normal; cursor: pointer;}
.tab.active {color: #0077ff;}
</style>
</head>
<body>
	<div class="login_container find find_id">
				<h1 class="main_reg_title"><span class="tab findId active">아이디찾기</span><span class="tab findPw">비밀번호 찾기</span></h1>
				<main id="login_box">
					<div class="login">
					 	<div class="input_box pwOnly hidden">
							<span class="title">아이디</span>
							<input type="text" id="userId" name="userId" class="wide sendData" size="30" placeholder="아이디" />
						</div>
						<div class="input_box">
							<span class="title">이름</span>
							<input type="text" id="userNm" name="userNm" class="wide sendData" size="30" placeholder="이름" />
						</div>
						<div class="input_box">
							<span class="title">생년월일</span>
							<input type="text" id="birthDay" name="birthDay" class="wide sendData" size="30" placeholder="생년월일 6자리 (주민등록번호 앞자리)" />
						</div>
						<div class="input_box">
							<span class="title">휴대전화번호(-없이 입력)</span>
							<input type="text" id="mobileNum" name="mobileNum" class="wide sendData" size="30" placeholder="휴대전화번호 ( - 없이 입력)" oninput="this.value=this.value.replace(/[^0-9]/g,'');" />
						</div>
<% if("Y".equals(smsChk)){ %>
						<div class="input_box">
							<span class="title">인증번호</span>
							<input type="text" id="accNo" name="accNo" class="sendData" placeholder="인증번호">
							<button id="accNoBtn" type="button">인증번호</button>
							<input type="hidden" id="Modulus" name="Modulus" value="<%= RSAKey.toHex(rsa.getModulus()) %>">
							<input type="hidden" id="Exponent" name="Exponent" value="<%= RSAKey.toHex(rsa.getPublicExponent()) %>">
						</div>
<% } %>
					    <div class="btn_box">
					    	<button id="backBtn" class="btn_login gray" type="button">취소</button>
					   		<button id="okBtn" mode="id" class="btn_login" type="button">확인</button>
					    </div>
					</div>
				</main>
		</div>
</body>
</html>