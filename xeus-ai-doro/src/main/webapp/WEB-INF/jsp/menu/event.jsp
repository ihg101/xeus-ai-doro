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
<meta name="color-scheme" content="dark light">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title><%= projNm %></title>
<jsp:include page="../eventResource.jsp">
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
var tabName = "eventTab";

var a = 0;
$(document).ready(function(){
	$("#btn-monitor-view").click(function(){
		sessionStorage.setItem('NOW_MENU', 'btn-monitor-view');
		$("#btn-monitor-view").attr("k",a)
		// 0인 경우에는 다시 그리지 않는다. 다시 그리니까 이상함.
		if(a != 0){
			GMXMAP.reloadLayerData('v_mon_evet_excavator');
			GMXMAP.reloadLayerData('v_mon_evet_fall');
			GMXMAP.reloadLayerData('v_mon_evet_blackice');
		}
		a++;
	});
	
	$("#btn-event-list-view").click(function(){
		sessionStorage.setItem('NOW_MENU', 'btn-event-list-view');
		GMXMAP.reloadLayerData('v_mon_evet_excavator');
		GMXMAP.reloadLayerData('v_mon_evet_fall');
		GMXMAP.reloadLayerData('v_mon_evet_blackice');
	});
});
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
<%if(isCCTVDomain){
	 if(authGrpList != null && authGrpList.size() > 0){ %>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
	<% }
}else{
	if(authGrpList != null && authGrpList.size() > 0){ %>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN001")) %> <li><button class="event active" onclick="TOP_MENU_MOVE(this, event, './event.do');">AI 도로안전 모니터링</button></li>
		<%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li> --%>
	<%-- 	<%if(authGrpList.get(0).getAuthMgrNo().contains("BTN004")) %> <li><button class="nms" onclick="TOP_MENU_MOVE(this, event, './nms.do');">장비관리</button></li> --%>
		<%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN005")) %> <li><button class="board" onclick="TOP_MENU_MOVE(this, event, './board.do');">대시보드</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN006")) %> <li><button class="bigdata" onclick="TOP_MENU_MOVE(this, event, './bigdata.do');">빅데이터 분석</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN007")) %> <li><button class="stat" onclick="TOP_MENU_MOVE(this, event, './stat.do');">통계 조회</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN008")) %> <li><button class="history" onclick="TOP_MENU_MOVE(this, event, './history.do');">이력 조회</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN011")) %> <li><button class="gisEdit" onclick="TOP_MENU_MOVE(this, event, './gisEdit.do');">공간 편집</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN010")) %> <li><button class="layer" onclick="TOP_MENU_MOVE(this, event, './layer.do');">레이어 관리</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN012")) %> <li><button class="layerAuth" onclick="TOP_MENU_MOVE(this, event, './layerAuth.do');">레이어 권한</button></li> --%>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN009")) %> <li><button class="systemMng" onclick="TOP_MENU_MOVE(this, event, './systemMng.do');">시스템 관리</button></li>
	<% } %>
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
		<%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN004")) %> <li><button class="nms" onclick="TOP_MENU_MOVE(this, event, './nms.do');">장비관리</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN005")) %> <li><button class="board" onclick="TOP_MENU_MOVE(this, event, './board.do');">대시보드</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN006")) %> <li><button class="bigdata" onclick="TOP_MENU_MOVE(this, event, './bigdata.do');">빅데이터 분석</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN007")) %> <li><button class="stat" onclick="TOP_MENU_MOVE(this, event, './stat.do');">통계 조회</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN008")) %> <li><button class="history" onclick="TOP_MENU_MOVE(this, event, './history.do');">이력 조회</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN011")) %> <li><button class="gisEdit" onclick="TOP_MENU_MOVE(this, event, './gisEdit.do');">공간 편집</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN010")) %> <li><button class="layer" onclick="TOP_MENU_MOVE(this, event, './layer.do');">레이어 관리</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN012")) %> <li><button class="layerAuth" onclick="TOP_MENU_MOVE(this, event, './layerAuth.do');">레이어 권한</button></li>--%>
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

					<div id="eventTab" class="tab_style">
						<!-- <button class="startMenu" id="btn-lgd-mng">범례</button> -->
						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC001")) %>
						<button class="startMenu" id="btn-monitor-view" url="/monitor/getMonitoringView.do" k="">이벤트 모니터링</button>
						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC002")) %>
						<button class="startMenu" id="btn-event-list-view" url="/eventHist/getEventHistView.do">이벤트 리스트</button>

						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC004")) %>
					<!-- 	<button class="startMenu" id="btn-select-mng" url="/cctv/getSelectView.do">선택감시</button> -->
						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC005")) %>
					<!-- 	<button class="startMenu" id="btn-ptr-view" url="/cctv/getPatrolView.do">순찰감시</button> -->
					</div>
				</div>
			</div>
		</div>
		<div id="body">
			<div id="map"></div>

			<jsp:include page="../GMT/commonPage/mapInteraction.jsp"></jsp:include>

			<div id="popupWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="contentWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="assetEditWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="netMonitoringWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="gridMonitoringWrap" title="" class="dialogWrap hiddenScroll table_style"></div>
			<div id="featureSelectInfoWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="eventDialogWrap" title="" class="dialogWrap customScroll table_style"></div>
			<audio id='alram' class='hidden'><source src='./res/sound/alram.mp3' type='audio/mpeg'></audio>
		</div>
	</div>
</body>
</html>