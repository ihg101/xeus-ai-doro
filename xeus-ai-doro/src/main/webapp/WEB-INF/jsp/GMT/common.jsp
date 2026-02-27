<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.apache.commons.lang3.StringUtils"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_ColumnVo"%>
<%@ page import="gmx.gis.util.code.GMT_DateUtil"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.util.Set"%>
<%@ page session="true" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />

<%
String context = (String) pageContext.getAttribute("ctxPath");
//String projNm = "Web GIS Management Tool";
String projNm = "스마트시티 통합플랫폼";
String version = "1.0.0";
String accTime = GMT_DateUtil.getStrMilSec();
String ctx = (String) request.getContextPath();
String userId = (String) session.getAttribute("userId");
String userNm = (String) session.getAttribute("userNm");
String authGrpId = (String) session.getAttribute("authGrpId");
String authGrpNm = (String) session.getAttribute("authGrpNm");
String orgMgrNo = (String) session.getAttribute("orgMgrNo");

boolean proxy = false;
if(session.getAttribute("proxy") != null){
	proxy = (boolean) session.getAttribute("proxy");
}
//boolean proxy = (boolean) request.getAttribute("proxy");

ArrayList<AuthGrpVo> authGrpList = (ArrayList<AuthGrpVo>) session.getAttribute("authGrp");
String authMgrNo = null;
if(authGrpList != null && authGrpList.size() > 0){
	authMgrNo = authGrpList.get(0).getAuthMgrNo();
}
%>