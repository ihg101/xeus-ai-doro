<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_OrganizationVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="gmx.gis.user.service.GMT_UserVo"%>
<%@ page import="gmx.gis.user.util.RSAKey"%>
<%@ page import="gmx.gis.util.code.GMT_StrUtil"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="../common.jsp" %>
<%
    RSAKey rsa = (RSAKey)session.getAttribute("RSA");

//     GMT_CodeConvertor cde = (GMT_CodeConvertor) request.getAttribute("code");
    ArrayList<GMT_OrganizationVo> orgz = (ArrayList<GMT_OrganizationVo>) request.getAttribute("orgz");

    String authConnIp = request.getHeader("x-forwarded-for");
    if ( authConnIp == null ) authConnIp = request.getRemoteAddr();

%>


<link rel="shortcut icon" href="./res/GMT/img/geomex.ico">
<%-- <link rel="stylesheet" type="text/css" href="${ctxPath./res/css/GMT/xeus.reg.css"> --%>

<%-- <link rel="stylesheet" type="text/css" href="${ctxPath./res/css/GMT/xeus.layout.css"> --%>

<script type="text/javascript" src="./res/GMT/gmx.gis.user.reg.js"></script>


<script>
	window.sysAlert = window.alert;
	window.sysConfirm = window.confirm;
	window.alert = xeusCustom.customAlert;
	window.confirm = xeusCustom.customConfirm;
</script>
<style>
	#wrap {position: absolute; top: 9px;}
</style>
<div class="login_container join hide">
	<form id="sendForm" method="POST" enctype="multipart/form-data">
				<h1 class="main_title"><span>계정등록</span></h1>
				<main id="login_box">
					<div class="login">
						<div class="input_box">
							<input type="text" id="regUserId" name="userId" class="medium sendData" size="30" placeholder="아이디 (6자 이상)" />
							<button id="idChk" type="button">중복확인</button>
						</div>
						<div class="input_box wd50">
							<input type="password" id="regUserPwd" name="userPwd" class="wide sendData" size="30" placeholder="비밀번호 (영문, 숫자, 특수문자 모두 포함)" />
							<input type="password" id="regUserPwdRe" name="userPwdRe" class="wide sendData" size="30" placeholder="비밀번호 확인" />
						</div>
						<div class="input_box">
							<input type="text" id="userNm" name="userNm" class="wide sendData" size="30" placeholder="이름" />
						</div>
						<div class="input_box">
							<input type="text" id="birthDay" name="birthDay" class="wide sendData" size="30" placeholder="생년월일 6자리 (주민등록번호 앞자리)" />
						</div>
						<div class="input_box">
							<select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
	<% for(int i=0; i<orgz.size(); i++){ %>
		                            <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
	<% } %>
		                        </select>
						</div>
						<div class="input_box wd50">
							<input type="text" id="departNm" name="departNm" class="wide sendData" size="50" placeholder="소속 및 부서명" />
							<input type="text" id="posNm" name="posNm" class="wide sendData" size="30" placeholder="직급 (직책)" />
						</div>
						<div class="input_box wd50">
							<input type="text" id="telNum" name="telNum" class="wide sendData" size="30" placeholder="사무실 전화번호 ( - 없이 입력)" />
							<input type="text" id="mobileNum" name="mobileNum" class="wide sendData" size="30" placeholder="휴대폰 번호 ( - 없이 입력)" />
						</div>
						<div class="input_box">
							<input type="text" id="email" name="email" class="wide sendData" size="30" placeholder="이메일 주소" />
						</div>
						<div class="input_box">
							<input type="text" name="subDir" id="subDir" class="hidden sendData" value="\user\">
						 	<input type="file" id="file" name="file" class="wide sendData" size="30" placeholder="서약서" />
	                        <input type="hidden" id="authAtmtCnt" name="authAtmtCnt" class="sendData" value="0"/>
	                        <input type="hidden" id="authConnIp" name="authConnIp" class="sendData" value="<%= authConnIp %>"/>
						</div>
						<button id="btn_doc_down" class="btn_style">보안서약서 다운로드</button>
					    <div class="btn_box">
					    	<button id="backBtn" class="btn_login" type="button">취소</button>
					   		<button id="okBtn" class="btn_login" type="button">확인</button><!--  onclick="user.valid.reg();" -->
					    </div>
					</div>
				</main>
	</form>
</div>

