<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_OrganizationVo"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_NoticeVo"%>
<%@ page import="gmx.gis.user.service.GMT_UserVo"%>
<%@ page import="gmx.gis.user.util.RSAKey"%>
<%@ include file="../common.jsp" %>
<%
    RSAKey rsa = (RSAKey)session.getAttribute("RSA");
    ArrayList<GMT_NoticeVo> notice = (ArrayList<GMT_NoticeVo>) request.getAttribute("notice");
    ArrayList<GMT_OrganizationVo> orgz = (ArrayList<GMT_OrganizationVo>) request.getAttribute("orgz");

    String authConnIp = request.getHeader("x-forwarded-for");
    if ( authConnIp == null ) authConnIp = request.getRemoteAddr();

    String adminNotice = (String) request.getAttribute("adminNotice");

    String smsChk = StringUtils.defaultString((String)request.getAttribute("smsChk"));
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="shortcut icon" href="../res/img/geomex.ico">
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/ui-darkness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="../res/css/GMT/all.css">

<link rel="shortcut icon" href="../res/img/geomex.ico">

<title><%= projNm %></title>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="../common/jquery.paging.js"></script>
<script type="text/javascript" src="../common/jquery.timepicker.js"></script>
<script type="text/javascript" src="../common/jquery.form.js"></script>
<script type="text/javascript" src="../common/jquery.download.js"></script>
<script type="text/javascript" src="../common/cipher/tea-block.js"></script>
<script type="text/javascript" src="../common/cipher/base64.js"></script>
<script type="text/javascript" src="../common/cipher/utf8.js"></script>
<script type="text/javascript" src="../common/cipher/jsbn.js"></script>
<script type="text/javascript" src="../common/cipher/rsa.js"></script>
<script type="text/javascript" src="../common/cipher/helper.js"></script>
<script type="text/javascript" src="../common/string.js"></script>
<script type="text/javascript" src="../common/HashMap.js"></script>
<script type="text/javascript" src="../common/string.js"></script>
<script type="text/javascript" src="../common/Date.js"></script>
<script type="text/javascript" src="../common/common.js"></script>
<script type="text/javascript" src="../res/GMT/gmx.gis.user.js"></script>
<script type="text/javascript" src="../res/GMT/xeusUser.js"></script>
<script type="text/javascript" src="../res/GMT/gmx.gis.user.login.js"></script>

<script type="text/javascript" src="../res/GMT/gmx.gis.user.reg.js"></script>

<script>
window.onpageshow=function(event){
	if(event.persisted || (window.performance && window.performance.navigation.type ==2)){
		_common.callAjax("/GMT_user/removeSession.json", {}, function(json){

		},false);
	}
}

$(document).ready(function(){

	var bgTime = 0;

	setInterval(bgTime2, 5000);

	function bgTime2(){
		bgTime++;
		if(bgTime>1){
			bgTime = 0;
		}
		bgChange(bgTime);
	}

	function bgChange(time){

		$('body').css({'background-image': 'url(../res/img/bg'+ time +'.jpg)'});
	}


	//백그라운드 이미지 랜덤
//	$('body, html').css({'background-image': 'url(../res/img/bg' + Math.floor(Math.random() * 2) + '.jpg)'});

    $("#wrap").center();

    $(window).resize(function(){
        $("#wrap").center();
    });

    var smsChk = '<%=smsChk%>';
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

    $("#idChk").on('click',function(){
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

    	window.open("/gis-mng/GMT_notice/getOpenNoticeView.do", "공지사항", windowSize);
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
<style>
	html, body, div, span, iframe, h1, h2, h3, h4, h5, h6, p, a, img, ol, ul, li, header, nav, section, footer { margin: 0; padding: 0; border: 0;}
	ol, ul { list-style: none;}
	a, a:hover {color: #333; text-decoration: none;}
	table, thead, tbody, tr, th, td {border-collapse: collapse;}
	button, input[type="button"] {border: none; outline: 0; cursor: pointer; background-color: transparent; transition: 0.2s;}
	body, html {width: 100%; height: 100%;}
	body {background-image: url(../res/img/bg0.jpg);background-position: top center; background-size: cover; transition: 3s;}
	#login_wrap {width: 100%; height: 100%; background: linear-gradient(to left, #222, rgba(34,34,34, 0.7), transparent, transparent ); position: relative;}
	.login_container {position: absolute; top: 50%; right: 150px; transform: translateY(-50%);}
	.login_container.hide {right: 120px;}
	.login_container.join {display: none;}
	.main_title {width: 400px; color: #fff; font-size: 80px;line-height: 1; margin-bottom: 60px;}

	.main_title > span {display: block; font-size: 36px;}
	#login_box {width: 400px; height: auto;}
	#login_box .login .input_box {margin-bottom: 40px; position: relative;}
	#login_box .login .input_box.wd50 {display: flex; justify-content: space-between; flex-flow: wrap;}
	#login_box .login .input_box > input, #login_box .login .input_box > select {border: 0; outline: 0; width: 100%; border-bottom: 1px solid #fff; padding: 20px 0; text-indent: 10px; color: #fff; font-size: 16px; background-color: transparent; transition: border 0.3s;}
	#login_box .login .input_box.wd50 > input {flex: 0 0 49%;}
	#login_box .login .input_box #idChk {position: absolute; top: 30px; right: 0; color: #2c90fa; padding: 5px 10px;}
	#login_box .login .input_box #idChk:hover {background-color: #f1f1f1; color: #333;}
	#login_box .login .input_box > input:focus {border-bottom: 1px solid #0077ff; color: #fff !important;}
	#login_box .login .input_box > input::placeholder {color: #fff;}
	#login_box .login .btn_login {width: 100%; height: 58px; background-color: #0077ff; color: #fff; font-size: 18px;}
	#login_box .login .btn_login:hover {background-color: #0375e8;}
	#login_box .login .btn_login.gray {background-color: #333;}
	#login_box .login .btn_login.gray:hover {background-color: #555; color: #fff;}
	#login_box .login .btn_style {width: 100%; padding: 10px 0; background-color: #666; color: #fff;}
	#login_box .login .btn_box {border: 1px solid #fff; display: flex; flex-flow: nowrap; margin-top: 45px; overflow: hidden;}
	#login_box .login .btn_box > button {flex: 0 0 50%; padding: 15px 0; color: #fff;}
	#login_box .login .btn_box > button:hover {background-color: #f1f1f1; color: #333;}
	#login_box .login .btn_box > button:first-child {border-right: 1px solid #fff;}
	#login_box .login .btn_box > button > i {margin-right: 5px;}
	#login_box .login .input_box span.title {display: block; flex: 0 0 100%; font-size: 14px; color: #fff; margin: 10px 0; font-weight: bold;}
	#login_box .login .input_box.wd50 span.title {flex: 0 0 49%;}

	.login_container.join .main_title {margin-bottom: 30px;}
	.login_container.join #login_box .login .input_box {margin-bottom: 20px;}
	.login_container.join #login_box .login .btn_box {border: none; margin-top: 25px;}
	.login_container.join #login_box .login .btn_box > button:first-child {border-right: 0;}
	.login_container.join #login_box .login .input_box > input, .login_container.join #login_box .login .input_box > select {font-size: 14px; padding: 12px 0; text-indent: 0; color: #999; border-bottom: 1px solid #999;}
	.login_container.join #login_box .login .input_box > input:focus, .login_container.join #login_box .login .input_box > select:focus {border-bottom: 1px solid #0077ff;}
	.login_container.join #login_box .login .input_box > input::placeholder {color: #999;}

	#wrap {position: absolute; top: 9px;}
</style>
</head>
<body>
	<div id="login_wrap">
		<div class="login_container log">
			<!-- <h1 class="main_title">Web GIS<span>Management Tool</span></h1> -->
			<h1 class="main_title">스마트시티<span>통합플랫폼</span></h1>
			<main id="login_box">
				<div class="login">
					<div class="input_box">
						<input type="text" id="userId" tabindex="1" placeholder="아이디" value="">
					</div>
					<div class="input_box">
						<input type="password" id="userPwd" tabindex="2" placeholder="비밀번호" value="">
					</div>
					<button id="login_btn" class="btn_login" title="로그인">로그인</button>
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
				<h1 class="main_title"><span>계정등록</span></h1>
				<main id="login_box">
					<div class="login">
						<div class="input_box">
							<span class="title">아이디</span>
							<input type="text" id="regUserId" name="userId" class="medium sendData" size="30" placeholder="6자 이상" />
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
							<input type="text" id="telNum" name="telNum" class="wide sendData" size="30" placeholder="- 없이 입력" />
							<input type="text" id="mobileNum" name="mobileNum" class="wide sendData" size="30" placeholder=" - 없이 입력" />
						</div>
						<div class="input_box">
							<span class="title">이메일</span>
							<input type="text" id="email" name="email" class="wide sendData" size="30" placeholder="이메일 주소" />
						</div>
						<div class="input_box hidden">
	<!-- 						<input type="text" name="subDir" id="subDir" class="hidden sendData" value="\user\"> -->
	<!-- 					 	<input type="file" id="file" name="file" class="wide sendData" size="30" placeholder="서약서" /> -->
	                        <input type="hidden" id="authAtmtCnt" name="authAtmtCnt" class="sendData" value="0"/>
<%-- 	                        <input type="hidden" id="authConnIp" name="authConnIp" class="sendData" value="<%= authConnIp %>"/> --%>
						</div>
	<!-- 					<button id="btn_doc_down" class="btn_style">보안서약서 다운로드</button> -->
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