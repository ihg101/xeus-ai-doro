<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.apache.commons.lang3.StringUtils"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ page session="true" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />
<%
	String siteNm = "AI 도로안전";
	String projNm = siteNm + " 모니터링 시스템";
    String context = (String) pageContext.getAttribute("ctxPath");
	String accTime = DateUtil.getStrMilSec();
	String version = "1.0.0";

	String isTray = "false";

	UserVo userVo = (UserVo) session.getAttribute("userVo");

    String userId = (String) session.getAttribute("userId");
    String userNm = (String) session.getAttribute("userNm");
    String authGrpId = (String) session.getAttribute("authGrpId");
    String authGrpNm = (String) session.getAttribute("authGrpNm");
    String orgMgrNo = (String) session.getAttribute("orgMgrNo");

    String emailStr = (String) session.getAttribute("email");
	String email = "";
	if(emailStr != null && !"".equals(emailStr)){
		String[] splitStr = emailStr.split("@");
		if(splitStr.length > 1){
			email = splitStr[1];
		}
	}

	boolean proxy = true;
	if(session.getAttribute("proxy") != null){
		proxy = (boolean) session.getAttribute("proxy");
	}

    ArrayList<AuthVo> authList = (ArrayList<AuthVo>) session.getAttribute("authList");
    ArrayList<AuthGrpVo> authGrpList = (ArrayList<AuthGrpVo>) session.getAttribute("authGrp");

    String authMgrNo = null;
    if(authGrpList != null && authGrpList.size() > 0){
    	authMgrNo = authGrpList.get(0).getAuthMgrNo();
    }

    String userAuth = "";
    if(authGrpList != null){
	    for(int i=0; i<authGrpList.size(); i++){
	    	if(i == 0){
		    	userAuth += authGrpList.get(i).getAuthData();
	    	}else{
		    	userAuth += "," + authGrpList.get(i).getAuthData();
	    	}
	    }
    }

    boolean isCCTVDomain = false;
	if(session.getAttribute("isCCTVDomain") != null){
		isCCTVDomain = (boolean) session.getAttribute("isCCTVDomain");
	}
%>
<script>
if(localStorage["SystemTheme"] == undefined){
	localStorage["SystemTheme"] = "blue";
	_SET_THEME();
}
</script>