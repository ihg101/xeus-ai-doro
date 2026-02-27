<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.map.service.MapVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<MapVo> favList = (ArrayList<MapVo>) request.getAttribute("favList");
%>
<!-- 스케일 -->
<div id="scale-wrap" xeus-show="true">1 : <input type="text" id="scale-val" value="1000"></div>
<!-- 검색창 -->
<div id="search-parent" xeus-show="true"></div>
<div style="position: absolute; right: 35px; top: 6px; z-index: 1;">
	<img src="../res/img/mapSync/label.png" style="margin-right: 2px;">
	<img src="../res/img/mapSync/bg.png">
	<img src="../res/img/mapSync/toggle_off.png" style="position: absolute; top: 2px; left: 2px; cursor: pointer;" class="mapSync">
</div>
<!-- 지도 div -->
<div id="xeus-map-content-nms" class="map-target">
    <div id="popup"></div>
</div>
<div id="xeus-overview-nmsView"></div>
<div id="fav-wrap">
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
    <!-- 장비관리(NMS) -->
    <button id="btn-nms-lgd-mng" class="menu-button" for="btn-nms-mng" icon="ico2">범례</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC005")) %>
    <button id="btn-nmg-monitor-view" class="menu-button" for="btn-nms-mng" icon="ico23">NMS</button>




    <!-- <button id="btn-check-reg-view" class="menu-button" for="btn-nms-mng" icon="menu9">점검등록</button> -->
    <!-- <button id="btn-check-list-view" class="menu-button" for="btn-nms-mng" icon="menu10">점검이력</button> -->
    <!-- <button id="btn-mobile-list-view" class="menu-button" for="btn-nms-mng" icon="menu28">모바일관리</button> -->
    <!-- <button id="btn-site-view" class="menu-button" for="btn-nms-mng" icon="menu11">사이트관리</button> -->
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC006")) %>
    <button id="btn-infra-view" class="menu-button" for="btn-nms-mng" icon="ico24">장비관리</button>
    <!-- <button id="btn-cable-view" class="menu-button" for="btn-nms-mng" icon="menu26">케이블관리</button> -->
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC007")) %>
    <button id="btn-cctv-mng-view" class="menu-button" for="btn-nms-mng" icon="ico18">CCTV목록관리</button>


    <!-- <button id="btn-reg-mng-view" class="menu-button" for="btn-nms-mng" icon="menu9">등록관리</button> -->
    <!-- <button id="btn-check-reg-view" class="menu-button" for="btn-nms-mng" icon="menu9">등록관리</button> -->
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC008")) %>
    <!-- <button id="btn-nms-view" class="menu-button" for="btn-nms-mng" icon="ico25">논리망조회<br>NMS</button> -->
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC009")) %>
    <button id="btn-cable-view" class="menu-button" for="btn-nms-mng" icon="ico26">케이블관리</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC010")) %>
    <button id="btn-parking-mng" class="menu-button" for="btn-nms-mng" icon="ico27">구청주차현황</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC011")) %>
    <button id="btn-smarteye-mng" class="menu-button" for="btn-nms-mng" icon="ico33">지능형분석</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC012")) %>
    <button id="btn-umbrl-mng" class="menu-button" for="btn-nms-mng" icon="ico38">서리풀원두막</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC013")) %>
    <button id="btn-wind-mng" class="menu-button" for="btn-nms-mng" icon="ico39">풍속계</button>
</div>
<!--  west pane, 지도와 overlay 됨, 검색 영역 -->
<!--  2017.11.20 by kim, xeus-event추가: 기능구분용 -->
<div id="center-overlay-west" xeus-show='false' xeus-full-size="false" xeus-event=''>
    <div id="overlay-west-bar" class="overlay-bar">
        <!-- 171212 -->
        <!-- <button id="west_btn_close" class="overlay-bar-button left-float">닫기</button> -->
        <button id="west_btn_close" class="overlay-bar-button left-float"><img src="/xeus/res/img/close_btn.png"/></button>
    </div>
    <div id="overlay-west-contents" >
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
<%--     <span id="addr"><%= userNm %>님 환영합니다.</span> --%>
</div>
