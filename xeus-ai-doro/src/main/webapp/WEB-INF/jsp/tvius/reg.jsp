<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ page import="geomex.xeus.user.util.RSAKey"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />
<%
    RSAKey rsa = (RSAKey)session.getAttribute("RSA");
    UserVo vo = (UserVo)request.getAttribute("userVo");
    String userId = null;
    if(vo != null) userId = vo.getUserId();

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
    ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");

    String smsChk = StrUtil.chkNull((String)request.getAttribute("smsChk"));

    String browser = "";
    String userAgent = request.getHeader("User-Agent");

    if(userAgent.indexOf("Trident") > 0 || userAgent.indexOf("MSIE") > 0){
    	browser = "IE";
    }else if(userAgent.indexOf("Opera") > 0){
    	browser = "Opera";
    }else if(userAgent.indexOf("Firefox") > 0){
    	browser = "Firefox";
    }else if(userAgent.indexOf("Safari") > 0){
    	if(userAgent.indexOf("Chrome") > 0){
    	 	browser = "Chrome";
    	}else{
    		browser = "Safari";
    	}
    }

    String authConnIp = request.getHeader("x-forwarded-for");
    if ( authConnIp == null ) authConnIp = request.getRemoteAddr();

%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<link rel="shortcut icon" href="../res/img/geomex.ico">
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/ui-darkness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="../common/ol-v4.0.1/ol.css">
<link rel="stylesheet" type="text/css" href="../common/jquery.gridster.css">
<link rel="stylesheet" type="text/css" href="../res/css/xeus.reg.css">
<% if("IE".equals(browser)){ %>
<link rel="stylesheet" type="text/css" href="../res/css/xeus.layout.IE.css">
<% }else{ %>
<link rel="stylesheet" type="text/css" href="../res/css/xeus.layout.css">
<% } %>
<title>XEUS-User Infomation Reg</title>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="../common/jquery.gridster.js"></script>
<script type="text/javascript" src="../common/ol-v4.0.1/ol-debug.js"></script>
<script type="text/javascript" src="../common/proj4js-2.4.3/proj4.js"></script>
<%-- <script type="text/javascript" src="../res/geomex.xeus.proj4.js"></script> --%>
<script type="text/javascript" src="../common/jquery.spin.min.js"></script>
<script type="text/javascript" src="../common/jquery.paging.js"></script>
<script type="text/javascript" src="../common/jquery.timepicker.js"></script>
<script type="text/javascript" src="../common/jquery.bpopup.js"></script>
<script type="text/javascript" src="../common/jquery.form.js"></script>
<script type="text/javascript" src="../common/jquery.download.js"></script>
<script type="text/javascript" src="../common/tooltipsy.min.js"></script>
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
<%-- <script type="text/javascript" src="../res/geomex.xeus.user.js"></script> --%>
<script type="text/javascript" src="../res/geomex.xeus.user.reg.js"></script>
<script type="text/javascript" src="../res/xeusUser.js"></script>
<script>
<% if(userId != null){ %>
var isLogin = true;
<% }else{ %>
var isLogin = false;
<% } %>

var smsChk = '<%=smsChk%>';

// window.sysAlert = window.alert;
// window.sysConfirm = window.confirm;
// window.alert = xeusCustom.customAlert;
// window.confirm = xeusCustom.customConfirm;

</script>
</head>
<body>

	<%-- <div id="header">
        <img src="../img/user/logo.png" id="ci">
        <div id="back"></div>
    </div> --%>

	<div id="wrap">
		<div id="content">
            <form id="sendForm" method="POST" enctype="multipart/form-data">
				<table cellspacing="0">
					<tr>
						<th>
							<span>계정신청</span>
							<button id="titleClose" type="button"></button>
						</th>
					</tr>
					<tr>
						<td>
							<input type="text" id="regUserId" name="userId" class="medium sendData" size="30" placeholder="아이디  ex:홍길동01" />
							<button id="idChk" type="button">중복확인</button>
						</td>
					</tr>
					<tr>
						<td>
							<input type="password" id="regUserPwd" name="userPwd" class="wide sendData" size="30" placeholder="비밀번호 (영문, 숫자, 특수문자 모두 포함)" />
						</td>
					</tr>
			        <tr>
						<td>
							<input type="password" id="regUserPwdRe" name="userPwdRe" class="wide sendData" size="30" placeholder="비밀번호 확인" />
						</td>
					</tr>
					<tr>
						<td>
							<input type="text" id="userNm" name="userNm" class="wide sendData" size="30" placeholder="이름" />
						</td>
					</tr>
					<tr>
						<td>
							<input type="text" id="birthDay" name="birthDay" class="wide sendData" size="30" placeholder="생년월일 6자리 (주민등록번호 앞자리)" />
						</td>
					</tr>
					<tr>
						<td>
	                        <select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
<% for(int i=0; i<orgz.size(); i++){ %>
	                            <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
	                        </select>
						</td>
					</tr>

                    <tr>
                        <td>
                            <input type="text" id="departNm" name="departNm" class="wide sendData" size="50" placeholder="소속 및 부서명" />
                            <!-- <input type="hidden" id="departNm" name="departNm" class="sendData" value="1"/> -->
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="posNm" name="posNm" class="wide sendData" size="30" placeholder="직급 (직책)" />
                            <!-- <input type="hidden" id="posNm" name="posNm" class="sendData" value="1"/> -->
                        </td>
                    </tr>

					<tr>
						<td>
							<input type="text" id="telNum" name="telNum" class="wide sendData" size="30" placeholder="사무실 전화번호 ( - 없이 입력)" oninput="this.value=this.value.replace(/[^0-9]/g,'');" />
						</td>
					</tr>
                    <tr>
                        <td>
                            <input type="text" id="mobileNum" name="mobileNum" class="wide sendData" size="30" placeholder="휴대폰 번호 ( - 없이 입력)" oninput="this.value=this.value.replace(/[^0-9]/g,'');" />
                            <!-- <input type="hidden" id="mobileNum" name="mobileNum" class="sendData" value="1"/> -->
                        </td>
                    </tr>
<% if("Y".equals(smsChk)){ %>
					<tr>
	                    <td>
	                        <input type="text" id="accNo" name="accNo" class="sendData" placeholder="인증번호" style="width: 300px;">
	                        <button type="button" id="accNoBtn" style="float: right; height: 31px; margin-right: 14px; padding: 0 22px; color: white; font-weight: bold; background: #56585e;">인증번호</button>
							<input type="hidden" id="Modulus" name="Modulus" value="<%= RSAKey.toHex(rsa.getModulus()) %>">
			                <input type="hidden" id="Exponent" name="Exponent" value="<%= RSAKey.toHex(rsa.getPublicExponent()) %>">
	                    </td>
	                </tr>
<% } %>
					<tr>
						<td>
							<input type="text" id="email" name="email" class="wide sendData" size="30" placeholder="이메일 주소" />
						</td>
					</tr>
					<tr>
						<td>
                            <input type="text" name="subDir" id="subDir" class="hidden sendData" value="\user\">
							<input type="file" id="file" name="file" class="wide sendData" size="30" placeholder="서약서" />
                            <input type="hidden" id="authAtmtCnt" name="authAtmtCnt" class="sendData" value="0"/>
                            <input type="hidden" id="authConnIp" name="authConnIp" class="sendData" value="127.0.0.1"/>
						</td>
					</tr>
				</table>
            </form>
            <table cellspacing="0">
            	<tr>
					<td class="lastTd" style="text-align: center;">
						<button id="btn_doc_down" style=" height: 31px; margin-right: 14px; padding: 0 22px; color: white; font-weight: bold; background: #56585e;">&nbsp;보안서약서 다운로드</button>
					</td>
				</tr>
				<tr>
					<td class="lastTd">
        				<button id="backBtn" type="button">취소</button><button id="okBtn" type="button">확인</button><!--  onclick="user.valid.reg();" -->
					</td>
				</tr>
			</table>
		</div>
	</div>

</body>
</html>