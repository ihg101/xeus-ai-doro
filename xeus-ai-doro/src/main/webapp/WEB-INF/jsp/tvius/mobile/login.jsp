<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.NoticeVo"%>
<%@ page import="geomex.xeus.user.util.RSAKey"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%
    RSAKey rsa = (RSAKey) session.getAttribute("RSA");
	String smsChk = StrUtil.chkNull((String)request.getAttribute("smsChk"));
// 	smsChk = "N";
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
<title>제천시 스마트시티 통합플랫폼</title>
<script type="text/javascript" src="../../common/cipher/tea-block.js"></script>
<script type="text/javascript" src="../../common/cipher/base64.js"></script>
<script type="text/javascript" src="../../common/cipher/utf8.js"></script>
<script type="text/javascript" src="../../common/cipher/jsbn.js"></script>
<script type="text/javascript" src="../../common/cipher/rsa.js"></script>
<script type="text/javascript" src="../../common/cipher/helper.js"></script>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

	<div data-role="page" data-theme="b">

		<div data-role="header" align="center">
			<img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="200px">
		</div>

		<div role="main" class="ui-content">
			<h3 align="center">모바일 영상반출 신청 시스템</h3>
			<form>
				<table id="loginWrap">
					<tr>
						<td id="idBack">
							<input type="text" id="userId" tabindex="1" placeholder="아이디" value="" data-theme="a">
						</td>
					</tr>
					<tr>
						<td id="pwBack">
							<input type="password" id="userPwd" tabindex="2" placeholder="비밀번호" value="" data-theme="a">
						</td>
					</tr>
<%
if("Y".equals(smsChk)){
%>
					<tr>
						<td>
							<input type="text" id="mobileNum" tabindex="2" placeholder="핸드폰번호(-없이 입력)" value="" data-theme="a">
						</td>
					</tr>
					<tr>
						<td>
							<input type="text" id="accNo" tabindex="2" placeholder="인증번호" value="" data-theme="a">
							<button type="button" id="acc_btn">인증번호</button>
						</td>
					</tr>
<%
}
%>
					<tr>
						<td id="btnBack">
							<button type="button" id="login_btn" title="로그인">로그인</button>
							<input type="hidden" id="Modulus" name="Modulus" value="<%= RSAKey.toHex(rsa.getModulus()) %>">
							<input type="hidden" id="Exponent" name="Exponent" value="<%= RSAKey.toHex(rsa.getPublicExponent()) %>">
						</td>
					</tr>
				</table>
			</form>
		</div>

		<div data-role="footer" align="center">
			<a href="tel:0436415803" class="ui-btn ui-btn-inline ui-icon-phone ui-btn-icon-left">제천시청 대표전화 (043-641-5803)</a>
		</div>

	</div>

<%-- 	<script type="text/javascript" src="../../res/xeusConfig.js?t=<%= DateUtil.getStrMilSec() %>"></script> --%>
	<script type="text/javascript" src="../../res/xeusUser.js?t=<%= DateUtil.getStrMilSec() %>"></script>
	<script>
	var smsChk = '<%=smsChk%>';
	var sysAlert = alert;
	var sysConfirm = confirm;
	$(document).ready(function(){

	    $("#userId").focus();

	    $("#userPwd, #login_btn, #accNo").keyup(function(e){
	        if(e.which == 13){
	       		user.valid.signIn(smsChk);
	        }
	    });

	    $("#login_btn").on("click", function(){
	        user.valid.signIn(smsChk);
	    });

	    $("#acc_btn").on('click',function(){
	    	var userId = $("#userId").val();
			var userPwd = $("#userPwd").val();
			var mobileNum = $("#mobileNum").val();
	    	user.valid.validChk(userId, userPwd, mobileNum);
	    });

	});

	$(document).on("focus", "input", function(){
	    var txt = $(this).attr("placeholder");
	    $(this).attr("hint", txt).attr("placeholder", "");
	});

	$(document).on("focusout", "input", function(){
	    var txt = $(this).attr("hint");
	    $(this).attr("placeholder", txt);
	});
	</script>

</body>
</html>