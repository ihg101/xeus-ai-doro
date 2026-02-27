<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
String c = request.getParameter("c");
String v = request.getParameter("v");

boolean proxy = Boolean.parseBoolean(request.getParameter("proxy"));

String userId = request.getParameter("userId");
String userGrpNo = request.getParameter("userGrpNo");
String orgMgrNo = request.getParameter("orgMgrNo");
String authMgrNo = request.getParameter("authMgrNo");
String authGrpId = request.getParameter("authGrpId");
%>
<link rel="stylesheet" type="text/css" href="./common/ui-1.12.1/themes/base/jquery-ui.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./res/css/GMT/all.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ol-v6.4.3/ol.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ol-v6.4.3/ol-contextmenu-v4.1.0.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ol-ext/ol-ext.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/pagination-2.1.5/jquery.pagination.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./res/css/GMT/roadview.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./res/css/GMT/main.css?c=<%= c %>">

<script type="text/javascript" src="./common/ol-v6.4.3/ol.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery-3.2.0.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/bootstrap.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/ui-1.12.1/jquery-ui.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/lodash.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/pagination-2.1.5/jquery.pagination.js?c=<%= c %>"></script>

<%-- <script type="text/javascript" src="./common/ol-v6.4.3/ol-contextmenu-v4.1.0.js?c=<%= c %>"></script> --%>
<script type="text/javascript" src="./common/ol-v6.4.3/ol-contextmenu-v3.3.2-custom.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/ol-ext/ol-ext.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/proj4js-2.4.3/proj4.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.paging.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/underscore.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/chroma.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/HashMap.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/string.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/color.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/Date.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/gmx.gis.map.config.js?c=<%= c %>"></script>

<script type="text/javascript">
	var userId = "<%=userId%>";
	var userGrpNo = "<%=authGrpId%>";
	var orgMgrNo = "<%=orgMgrNo%>";
	var authMgrNo = "<%=authMgrNo%>";
	var authGrpId = "<%=authGrpId%>";
	_SET_ACTIVE_PROXY(<%=proxy%>);
</script>

<script type="text/javascript" src="./common/spatial.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/common.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/tile/gmx.gis.bing.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/tile/gmx.gis.daum.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/tile/gmx.gis.naver.js?c=<%= c %>"></script>

<!-- <script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=9d12d8bda468b1a67b540f481006a0b1"></script> -->

<script type="text/javascript" src="./res/GMT/gmx.gis.custom.prevnext.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.custom.measure.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.layer.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.legend.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.map.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/xeusSessionWebSocket.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.main.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/xeusUtil.js?c=<%= c %>"></script>
