<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.map.service.MapVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<MapVo> favList = (ArrayList<MapVo>) request.getAttribute("favList");
%>

<style>

.chartWrap table {
	table-layout: fixed;
}
.chartWrap table th {
	height: 30px;
    color: white;
    background: #21222B;
    border: 1px #30303A solid;
}

.chartWrap table td {
	height: 35px;
    color: white;
    background: #3b3b3b;
    border: 1px #30303A solid;
}
</style>

<!-- 스케일 -->
<div id="scale-wrap" xeus-show="true">1 : <input type="text" id="scale-val" value="1000"></div>
<!-- 검색창 -->
<div id="search-parent" xeus-show="true"></div>
<!-- 지도 div -->
<div id="xeus-map-content-stat" class="map-target">
    <div id="popup"></div>
</div>
<div id="xeus-overview-statView"></div>
<div id="fav-wrap" class="fav-target">
   <div id="fav-header">
       <span id="fav-title">관심영역</span>
       <img src="<%= context %>/res/img/popup_close_normal.png" id="popup-closer">
   </div>
   <div id="fav-body">
        <input type="text" id="fav-name" class="keyup" for="#fav-add" placeholder="관심영역 이름"><button id="fav-add">등록</button><br>
        <div id="fav-content">
<% if(favList.size() > 0){ %>
<% for(int i=0; i<favList.size(); i++){
      String k = favList.get(i).getMgrSeq();
      double x = favList.get(i).getX();
      double y = favList.get(i).getY();
      int zoom = favList.get(i).getZoom();
%>
			<div class="fav-list" k="<%= k %>" x="<%= x %>" y="<%= y %>" zoom="<%= zoom %>"><span><%= favList.get(i).getTitle() %></span><button class="fav-del" k="<%= k %>">삭제</button></div>
<% }}else{ %>
				<div align="center" style="margin-top: 60px;">관심영역이 존재하지 않습니다.</div>
<% } %>
        </div>
   </div>
</div>
<div id="virtual-map-boundary"></div>
<!-- 사이드 메뉴바 -->
<div id="overlay-west-side-bar" class="overlay-side-bar">
    <!-- 영상반출 관리 -->
    <button id="btn-user-stat-view" class="menu-button" for="btn-stat-mng" icon="ico30">사용자접속</button>
    <button id="btn-evt-stat-view" class="menu-button" for="btn-stat-mng" icon="ico31">이벤트모니터링</button>
    <button id="btn-equip-stat-view" class="menu-button" for="btn-stat-mng" icon="ico32">장비모니터링</button>
    <button id="btn-cctv-stat-view" class="menu-button" for="btn-stat-mng" icon="ico33">이벤트별영상조회</button>
    <button id="btn-cctv-heat-view" class="menu-button" for="btn-stat-mng" icon="ico22">CCTV히트맵</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC011")) %>
    <button id="btn-anna-mng" class="menu-button" for="btn-stat-mng" icon="ico19">ANNA</button>
</div>
<!--  west pane, 지도와 overlay 됨, 검색 영역 -->
<!--  2017.11.20 by kim, xeus-event추가: 기능구분용 -->
<div id="center-overlay-west" xeus-show='false' xeus-full-size="false" xeus-event=''>
    <div id="overlay-west-bar" class="overlay-bar">
        <!-- 171212 -->
        <!-- <button id="west_btn_close" class="overlay-bar-button left-float">닫기</button> -->
        <button id="west_btn_close" class="overlay-bar-button left-float"><img src="/xeus/res/img/close_btn.png"/></button>
    </div>
    <div id="overlay-west-contents" style="background: #3E3F48;">
    </div>
</div>

<div id="center-overlay-west-tab" xeus-show="true">
    <button id="btn-map-home" class="menu-button">홈</button>
    <button id="btn-map-cler" class="menu-button">정리</button>
    <button id="btn-map-prev" class="menu-button">이전</button>
    <button id="btn-map-next" class="menu-button">다음</button>
    <button id="btn-map-move" class="menu-button">이동</button>
    <button id="btn-map-dist" class="menu-button">거리</button>
    <button id="btn-map-area" class="menu-button">면적</button>
    <button id="btn-map-indx" class="menu-button">인덱스맵</button>
    <button id="btn-map-favr" class="menu-button">관심영역</button>
    <!-- <button id="btn-map-image" class="menu-button">화면저장</button> -->
</div>

<!--  east pane, cctv가 보여질 영역, 지도와 overlay 됨 -->
<div id="center-overlay-east" xeus-show='false' xeus-event=''></div>

<div id="overlay-south-side-bar">
    <span id="coorX"></span>
    <span id="coorY"></span>
    <span id="addr"></span>
</div>
