<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.LayerDescVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.map.service.MapVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title><%= projNm %></title>
<jsp:include page="../statResource.jsp">
	<jsp:param name="c" value="<%= accTime %>" />
	<jsp:param name="v" value="<%= version %>" />

	<jsp:param name="proxy" value="<%= proxy %>" />

	<jsp:param name="userId" value="<%= userId %>" />
	<jsp:param name="userGrpNo" value="<%= authGrpId %>" />
	<jsp:param name="orgMgrNo" value="<%= orgMgrNo %>" />
	<jsp:param name="authMgrNo" value="<%= authMgrNo %>" />
	<jsp:param name="authGrpId" value="<%= authGrpId %>" />
</jsp:include>
<script type="text/javascript">
var ctxPath = "<%= context %>";
var isTray = <%= isTray %>;
var tabName = "statTab";

setTimeout(function(){
	$('#btn-user-stat-view').click();
},1000)
</script>
</head>
<body id="parentBody">
	<div id="rootWrap">
		<div id="header">
			<!-- <a href="ddas://ddas">C/S 형태의 PC 로컬 프로그램 켜기</a> -->
			<div id="mainTabs">
				<div class="top_box">
					<h1 class="ci"><%= projNm %></h1>
					<ul class="tab_wrap">
<% if(authGrpList != null && authGrpList.size() > 0){ %>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN001")) %> <li><button class="event" onclick="TOP_MENU_MOVE(this, event, './event.do');">이벤트 모니터링</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN004")) %> <li><button class="nms" onclick="TOP_MENU_MOVE(this, event, './nms.do');">장비관리</button></li>
	<%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN005")) %> <li><button class="board" onclick="TOP_MENU_MOVE(this, event, './board.do');">대시보드</button></li> --%>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN006")) %> <li><button class="bigdata" onclick="TOP_MENU_MOVE(this, event, './bigdata.do');">빅데이터 분석</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN007")) %> <li><button class="stat active" onclick="TOP_MENU_MOVE(this, event, './stat.do');">통계 조회</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN008")) %> <li><button class="history" onclick="TOP_MENU_MOVE(this, event, './history.do');">이력 조회</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN011")) %> <li><button class="gisEdit" onclick="TOP_MENU_MOVE(this, event, './gisEdit.do');">공간 편집</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN010")) %> <li><button class="layer" onclick="TOP_MENU_MOVE(this, event, './layer.do');">레이어 관리</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN012")) %> <li><button class="layerAuth" onclick="TOP_MENU_MOVE(this, event, './layerAuth.do');">레이어 권한</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN009")) %> <li><button class="systemMng" onclick="TOP_MENU_MOVE(this, event, './systemMng.do');">시스템 관리</button></li>
<% } %>
					</ul>
					<div class="drop_wrap">
						<div class="now_menu"></div>
						<button class="btn_drop">
							<span class="bar"></span>
							<span class="bar"></span>
							<span class="bar"></span>
						</button>
						<ul class="drop_menu">
							<%if(isCCTVDomain){
	 if(authGrpList != null && authGrpList.size() > 0){ %>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
	<% }
}else{
	if(authGrpList != null && authGrpList.size() > 0){ %>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN001")) %> <li><button class="event" onclick="TOP_MENU_MOVE(this, event, './event.do');">이벤트 모니터링</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN004")) %> <li><button class="nms" onclick="TOP_MENU_MOVE(this, event, './nms.do');">장비관리</button></li>
		<%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN005")) %> <li><button class="board" onclick="TOP_MENU_MOVE(this, event, './board.do');">대시보드</button></li> --%>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN006")) %> <li><button class="bigdata" onclick="TOP_MENU_MOVE(this, event, './bigdata.do');">빅데이터 분석</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN007")) %> <li><button class="stat" onclick="TOP_MENU_MOVE(this, event, './stat.do');">통계 조회</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN008")) %> <li><button class="history" onclick="TOP_MENU_MOVE(this, event, './history.do');">이력 조회</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN011")) %> <li><button class="gisEdit" onclick="TOP_MENU_MOVE(this, event, './gisEdit.do');">공간 편집</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN010")) %> <li><button class="layer" onclick="TOP_MENU_MOVE(this, event, './layer.do');">레이어 관리</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN012")) %> <li><button class="layerAuth" onclick="TOP_MENU_MOVE(this, event, './layerAuth.do');">레이어 권한</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN009")) %> <li><button class="systemMng" onclick="TOP_MENU_MOVE(this, event, './systemMng.do');">시스템 관리</button></li>
	<% } %>
<% } %>
						</ul>
					</div>
				</div>
				<div class="menu_wrap">
					<div class="user_info">
						<span class="user_nm"><%=userId%> 님의 접속을 환영합니다.</span>
						<button id="logoutBtn" class="btn_Dstyle">로그아웃</button>
						<div class="btn_setting_wrap open">
							<button class="btn_set_open">
								<i class="fas fa-cog"></i>
							</button>
							<button class="btn_setting">개인설정</button>
							<button class="btn_keyboard_help">키보드 제어 도움말</button>
						</div>
					</div>

					<div id="statTab" class="tab_style">
<!-- 						<button class="startMenu" id="btn-lgd-mng" >범례</button> -->
						 <!-- 영상반출 관리 -->
						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC021")) %>
					    <button class="startMenu" id="btn-user-stat-view" url="/stat/getUsrStatView.do">사용자접속</button>

					    <% if(authGrpList.get(0).getAuthMgrNo().contains("SVC022")) %>
					    <button class="startMenu" id="btn-evt-stat-view" url="/stat/getEvtStatView.do">이벤트모니터링</button>

<%-- 					    <% if(authGrpList.get(0).getAuthMgrNo().contains("SVC023")) %> --%>
<!-- 					    <button class="startMenu" id="btn-equip-stat-view" url="/stat/getEquipStatView.do">장비모니터링</button> -->

					    <% if(authGrpList.get(0).getAuthMgrNo().contains("SVC024")) %>
					    <button class="startMenu" id="btn-cctv-stat-view" url="/stat/getCctvStatView.do">이벤트별영상조회</button>



<%-- 					    <% if(authGrpList.get(0).getAuthMgrNo().contains("SVC021")) %> --%>
<!-- 					    <button class="startMenu" id="btn-eventGraphTable-stat-view" url="/stat/getEventGraphTableView.do">이벤트그래프테이블</button> -->
<!-- 					    <button class="startMenu" id="btn-cctv-heat-view" url="/stat/getCctvHeatView.do">CCTV히트맵</button> -->
<%-- 						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC011")) %> --%>
<!-- 					    <button class="startMenu" id="btn-anna-mng" url="/nms/getAnnaProjectView.do">ANNA</button> -->
					</div>
				</div>
			</div>
		</div>
		<div id="body">
			<div id="map"></div>

			<jsp:include page="../GMT/commonPage/mapInteraction.jsp"></jsp:include>

			<div id="contentWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="assetEditWrap" title="" class="dialogWrap customScroll table_style"></div>

		</div>
	</div>
</body>
</html>