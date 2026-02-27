<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.NoticeVo"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.user.util.RSAKey"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />
<%
    RSAKey rsa = (RSAKey)session.getAttribute("RSA");
    ArrayList<NoticeVo> notice = (ArrayList<NoticeVo>) request.getAttribute("notice");
    ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");

    String adminNotice = (String) request.getAttribute("adminNotice");

    String smsChk = StrUtil.chkNull((String)request.getAttribute("smsChk"));
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="shortcut icon" href="../res/img/geomex.ico">
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/ui-darkness/jquery-ui.css?v=<%= DateUtil.getStrMilSec() %>">
<link rel="stylesheet" type="text/css" href="../res/css/xeus.login.css?v=<%= DateUtil.getStrMilSec() %>">
<link rel="stylesheet" type="text/css" href="../res/css/xeus.layout.css?v=<%= DateUtil.getStrMilSec() %>">
<title>AI 도로안전 모니터링 시스템</title>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.paging.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.timepicker.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.bpopup.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.form.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.download.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/tooltipsy.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
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
<script type="text/javascript" src="../res/xeusConfig.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../res/xeusUser.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../res/geomex.xeus.user.reg.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script>
var smsChk = '<%=smsChk%>';
$(document).ready(function(){

    $("#wrap").center();

    $(window).resize(function(){
        $("#wrap").center();
    });

    if(smsChk == 'Y'){
    	//백그라운드 이미지 사이즈 변경
    	var _width = $('#wrap').find("#memberLogin").width()+'px';
    	var _height = $('#wrap').find("#memberLogin").height() + 90+'px';
		//jquery $().css()가 먹히지 않아 attr로 style 적용
    	$('#wrap').find("#memberLogin").attr('style', "height: 346px; background-size: "+_width+" "+_height+"; background-image: none !important; background: rgba(0, 65, 105, 0.4) !important;");
    }

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
    	var userId = $("#userId").val()
		var userPwd = $("#userPwd").val()
		var mobileNum = $("#mobileNum").val()
    	user.valid.validChk(userId, userPwd, mobileNum);
    });

    $("#notiecList").click(function(){
    	var windowWidth = 800;
    	var windowHeight = 700;
    	var windowLeft = parseInt((screen.availWidth/2) - (windowWidth/2));
    	var windowTop = parseInt((screen.availHeight/2) - (windowHeight/2));
    	var windowSize = "width=" + windowWidth + ",height=" + windowHeight + "left=" + windowLeft + ",top=" + windowTop + "screenX=" + windowLeft + ",screenY=" + windowTop;

    	window.open("/xeus/notice/getOpenNoticeView.do", "공지사항", windowSize);
    });

    /* 계정등록 */
    $(document).on("click", "#signUpBtn", function(){
//     	location.href = "../tvius/reg.do";
    	$('.login_container.log').fadeOut(300, function(){
            $('.login_container.join').fadeIn(300);
        });
    });

    $("#backBtn, #back").on("click", function(){
		$('.login_container.join').fadeOut(300, function(){
	        $('.login_container.log').fadeIn(300);
	    });
	});

    $("#findPasswordBtn").click(function(){
		location.href = "./find.do";
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

window.onload = function(){
<% if(adminNotice != null) { %>
alert("<%= adminNotice %>");
<% } %>
}
</script>
</head>
<body>
	<div id="login_wrap">
		<div class="login_container log">
			<!-- <h1 class="main_title">Web GIS<span>Management Tool</span></h1> -->
			<h1 class="main_title">AI 도로안전<br/>모니터링 시스템</h1>
			<main id="login_box">
				<div class="login">
					<div class="input_box">
						<input type="text" id="userId" tabindex="1" placeholder="아이디" value="">
					</div>
					<div class="input_box">
						<input type="password" id="userPwd" tabindex="2" placeholder="비밀번호" value="">
					</div>
<% if("Y".equals(smsChk)){ %>
                    <div class="input_box">
						<input type="text" id="mobileNum" tabindex="3" placeholder="핸드폰번호(-없이 입력)" value="" oninput="this.value=this.value.replace(/[^0-9]/g,'');">
					</div>
					<div class="input_box">
						<input type="text" id="accNo" tabindex="4" placeholder="인증번호" value="">
						<button id="acc_btn" class="sms_use" title="인증번호 전송">인증번호 전송</button>
					</div>
					<div class="input_box">
						<button id="login_btn" class="btn_login" title="로그인">로그인</button>
					</div>
					<div class="tRight">
						<span id="findPasswordBtn">계정 또는 암호를 잊으셨나요?</span>
					</div>
<% }else{ %>
					<div class="input_box">
						<button id="login_btn" class="btn_login" title="로그인">로그인</button>
					</div>
					<div class="tRight">
						<span id="findPasswordBtn">계정 또는 암호를 잊으셨나요?</span>
					</div>
<% } %>
				    <input type="hidden" id="Modulus" name="Modulus" value="<%= RSAKey.toHex(rsa.getModulus()) %>">
				    <input type="hidden" id="Exponent" name="Exponent" value="<%= RSAKey.toHex(rsa.getPublicExponent()) %>">
				    <div class="btn_box">
				    	<button id="notiecList" class="btn_notice"><i class="fas fa-bell"></i>공지사항</button>
				    	<button id="signUpBtn"><i class="fas fa-sign-in-alt"></i>계정등록</button>
				    </div>
				</div>
			</main>
		</div>
		<div class="login_container join">
			<form id="sendForm" method="POST" enctype="multipart/form-data">
				<h1 class="main_reg_title"><span>계정등록</span></h1>
				<main id="login_box">
					<div class="login">
						<div class="input_box">
							<span class="title">아이디</span>
							<input type="text" id="regUserId" name="userId" class="medium sendData" size="30" placeholder="아이디" />
							<button id="idChk" type="button">중복확인</button>
						</div>
						<div class="input_box wd50">
							<span class="title">비밀번호</span>
							<span class="title">비밀번호 확인</span>
							<input type="password" id="regUserPwd" name="userPwd" class="wide sendData" size="30" placeholder="영문, 숫자, 특수문자 모두 포함" />
							<input type="password" id="regUserPwdRe" name="userPwdRe" class="wide sendData" size="30" placeholder="비밀번호 확인" />
						</div>
						<div class="input_box wd50">
							<span class="title">이름</span>
							<span class="title">생년월일</span>
							<input type="text" id="userNm" name="userNm" class="wide sendData" size="30" placeholder="이름" />
							<input type="text" id="birthDay" name="birthDay" class="wide sendData" size="30" placeholder="주민등록번호 앞자리" />
						</div>

						<div class="input_box">
							<span class="title">회사명</span>
							<select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
						<% for(int i=0; i<orgz.size(); i++){ %>
	                            <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
						<% } %>
		                    </select>
						</div>
						<div class="input_box wd50">
							<span class="title">부서</span>
							<span class="title">직급</span>
							<input type="text" id="departNm" name="departNm" class="wide sendData" size="50" placeholder="소속 및 부서명" />
							<input type="text" id="posNm" name="posNm" class="wide sendData" size="30" placeholder="직급 (직책)" />
						</div>
						<div class="input_box wd50">
							<span class="title">사무실 전화번호</span>
							<span class="title">휴대폰 번호</span>
							<input type="text" id="telNum" name="telNum" class="wide sendData" size="30" placeholder="- 없이 입력" oninput="this.value=this.value.replace(/[^0-9]/g,'');" />
							<input type="text" id="mobileNum" name="mobileNum" class="wide sendData" size="30" placeholder=" - 없이 입력" oninput="this.value=this.value.replace(/[^0-9]/g,'');" />
						</div>
						<div class="input_box">
							<span class="title">이메일</span>
							<input type="text" id="email" name="email" class="wide sendData" size="30" placeholder="이메일 주소" />
						</div>
						<div class="input_box">
							<input type="text" name="subDir" id="subDir" class="hidden sendData" value="\user\">
							<input type="file" id="file" name="file" class="wide sendData" size="30" placeholder="서약서" />
                            <input type="hidden" id="authAtmtCnt" name="authAtmtCnt" class="sendData" value="0"/>
                            <input type="hidden" id="authConnIp" name="authConnIp" class="sendData" value="127.0.0.1"/>
							<button id="btn_doc_down">보안서약서 다운로드</button>
						</div>
<!-- 						<div class="btn_box"> -->
<!-- 					    </div> -->
					    <div class="btn_box">
					    	<button id="backBtn" class="btn_login gray" type="button">취소</button>
					   		<button id="okBtn" class="btn_login" type="button">확인</button>
					    </div>
					</div>
				</main>
			</form>
		</div>
	</div>
</body>
</html>