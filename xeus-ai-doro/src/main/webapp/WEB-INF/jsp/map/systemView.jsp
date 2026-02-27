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
<!-- 지도 div -->
<div id="xeus-map-content" class="map-target">
    <div id="popup"></div>
</div>
<div id="xeus-overview-systemView"></div>
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
    <!-- 시스템 관리 -->
    <button id="btn-basic-mng" class="menu-button" for="btn-sys-mng" icon="ico34">기본관리</button>
    <!-- <button id="btn-user-mng" class="menu-button" for="btn-sys-mng" icon="menu16">사용자관리</button> -->
    <!-- <button id="btn-aces-mng" class="menu-button" for="btn-sys-mng" icon="menu18">접근이력<br>관리</button> -->
    <!-- <button id="btn-auth-mng" class="menu-button" for="btn-sys-mng" icon="menu19">권한관리</button> -->
<% if("geomex".equals(userId) || "이주영01".equals(userId)){ %>
    <button id="btn-ip-mng" class="menu-button" for="btn-sys-mng" icon="menu17">접근IP관리</button>
    <!-- <button id="btn-orgz-mng" class="menu-button" for="btn-sys-mng" icon="menu20">소속관리</button> -->
    <button id="btn-admin-mng" class="menu-button" for="btn-sys-mng" icon="ico9">긴급공지</button>
<% } %>
    <!-- <button id="btn-code-mng" class="menu-button" for="btn-sys-mng" icon="menu21">코드관리</button> -->
    <!-- <button id="btn-nots-mng" class="menu-button" for="btn-sys-mng" icon="menu22">공지사항<br>관리</button> -->
    <!-- <button id="btn-icon-mng" class="menu-button" for="btn-sys-mng">아이콘관리</button> -->
    <button id="btn-icon-mng" class="menu-button" for="btn-sys-mng" icon="ico34">아이콘관리</button>
    <button id="btn-equip-mng" class="menu-button" for="btn-sys-mng" icon="ico34">장비관리</button>
    <!-- <button id="btn-vms-mng" class="menu-button" for="btn-sys-mng">VMS<br>관리</button>
    <button id="btn-cctv-model-mng" class="menu-button" for="btn-sys-mng">CCTV<br>모델관리</button> -->
<!--     <button id="btn-evt-mng" class="menu-button" for="btn-sys-mng" icon="ico34">이벤트관리</button> -->
    <button id="btn-preview-doc-view" class="menu-button" for="btn-sys-mng" icon="ico9">선영상 공문관리</button>
    <button id="btn-log-view" class="menu-button" for="btn-sys-mng" icon="ico35">이력 조회</button>
<!--     <button id="btn-log-stat-view" class="menu-button" for="btn-sys-mng" icon="ico36">통계</button> -->
    <!-- <button id="btn-sms-view" class="menu-button" for="btn-sys-mng">SMS 연동<br>테스트</button> -->
    <button id="btn-env-set" class="menu-button" for="btn-sys-mng" icon="ico37">설정</button>
</div>
<!--  west pane, 지도와 overlay 됨, 검색 영역 -->
<!--  2017.11.20 by kim, xeus-event추가: 기능구분용 -->
<div id="center-overlay-west" xeus-show='false' xeus-full-size="false" xeus-event=''>
    <div id="overlay-west-bar" class="overlay-bar">
        <!-- 171212 -->
        <!-- <button id="west_btn_close" class="overlay-bar-button left-float">닫기</button> -->
        <!-- <button id="west_btn_close" class="overlay-bar-button left-float"><img src="/xeus/res/img/close_btn.png"/></button> -->
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
    <span id="addr"></span>
</div>
