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
<jsp:include page="../tviusMngResource.jsp">
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

/*
 * 탭 이동
 */
$(document).ready(function(){
	$('#mainTabs').tabs('option', 'active',4);
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
						<li><a href="#eventTab" onclick="TOP_MENU_MOVE(this, event, './event.do');">이벤트 모니터링</a></li>
						<li><a href="#tviusTab" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</a></li>
						<li><a href="#tviusMngTab" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</a></li>
						<li><a href="#nmsTab" onclick="TOP_MENU_MOVE(this, event, './nms.do');">장비관리</a></li>
						<li><a href="#boardTab" onclick="TOP_MENU_MOVE(this, event, './board.do');">대시보드</a></li>
						<li><a href="#bigdataTab" onclick="TOP_MENU_MOVE(this, event, './bigdata.do');">빅데이터 분석</a></li>
						<li><a href="#statTab" onclick="TOP_MENU_MOVE(this, event, './stat.do');">통계 조회</a></li>
						<li><a href="#systemMngTab" onclick="TOP_MENU_MOVE(this, event, './history.do');">이력 조회</a></li>
						<li><a href="#systemMngTab" onclick="TOP_MENU_MOVE(this, event, './systemMng.do');">시스템 관리</a></li>
					</ul>
				</div>
				<div class="menu_wrap">
					<div class="user_info">
						<span class="user_nm"><%=userId%> 님의 접속을 환영합니다.</span>
						<button id="logoutBtn" class="btn_Dstyle">로그아웃</button>
					</div>

					<div id="eventTab" class="tab_style">

					</div>

					<div id="tviusTab" class="tab_style">

					</div>

					<div id="tviusMngTab" class="tab_style">
						<button class="startMenu" id="btn-tvius-rqst-view" url="/tvius/getMngTviusRqstView.do">영상정보신청현황</button>
					    <button class="startMenu" id="btn-tvius-ext-view" url="/tvius/getMngTviusRenewView.do">연장신청현황</button>
					    <button class="startMenu" id="btn-tvius-evi-view" url="/tvius/getMngTviusRenewView.do">증거신청현황</button>
					    <button class="startMenu" id="btn-tvius-exp-view" url="/tvius/getMngTviusExpView.do">재생만료현황</button>
					    <button class="startMenu" id="btn-tvius-img-mng-view" url="/tvius/getMngTviusImageView.do">이미지반출현황</button>
					    <button class="startMenu" id="btn-tvius-mng-reg-view" url="/tvius/getMngTviusRqstMngView.do">관리대장</button>
					    <button class="startMenu" id="btn-tvius-stat-view" url="/tvius/getStatView.do">통계</button>
					<!--     <button id="btn-tvius-urg-reg" class="menu-button" for="btn-tvus-mng" icon="ico20">긴급반출</button> -->
					    <button class="startMenu" id="btn-tvius-hash-chk" url="/tvius/getMngTviusHashChkView.do">해시코드조회</button>
					    <button class="startMenu" id="btn-tvius-heat-view" url="/tvius/getMngTviusHeatView.do">히트맵</button>
					</div>
					<div id="nmsTab">

					</div>
					<div id="boardTab">

					</div>

					<div id="bigdataTab">

					</div>

					<div id="statTab">

					</div>

					<div id="systemMngTab" class="tab_style">

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