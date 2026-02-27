<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.map.service.MapVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<MapVo> favList = (ArrayList<MapVo>) request.getAttribute("favList");
%>

<!-- <script src="/assets/backend/js/html2canvas.min.js"></script> -->

<style>
/* .overlay-side-bar::-webkit-scrollbar {padding-top:2px; width:10px; height:10px;} */
/* .overlay-side-bar::-webkit-scrollbar-track {background:none;} */
/* .overlay-side-bar::-webkit-scrollbar-thumb {background-color:rgb(69, 130, 172); border-radius: 25px;  border: 3px #3e3f48 solid;} */
/* .overlay-side-bar::-webkit-scrollbar-thumb:hover {background: #4582AC;} */



.mCSB_1_scrollbar .mCSB_dragger .mCSB_draggerRail{ opacity : 0; }


</style>
<%-- <script type="text/javascript" src="<%= context %>/common/capture/dom-to-image.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/capture/FileSaver.min.js"></script> --%>
<script type="text/javascript" src="<%= context %>/common/capture/html2canvas.min.js"></script>
<script type="text/javascript">
/* function captureTest(){
	html2canvas($("#xeus-map-content"), {
	    onrendered: function(canvas) {
	        theCanvas = canvas;
	        document.body.appendChild(canvas);

	        canvas.toBlob(function(blob) {
				saveAs(blob, "Dashboard.png");
			});
	    }
	});
} */

/* var node = $('#xeus-map-content');//document.getElementById('my-node');

$('#btn-capture-test').click(function() {
	//node.innerHTML = "I'm an image now."
	domtoimage.toBlob(node)
    .then(function(blob) {
      window.saveAs(blob, 'my-node.png');
    });
}); */


</script>
<!-- 스케일 -->
<div id="scale-wrap" xeus-show="true">1 : <input type="text" id="scale-val" value="1000"></div>
<!-- 검색창 -->
<div id="search-parent" xeus-show="true"></div>
<div style="position: absolute; right: 35px; top: 6px; z-index: 1;">
	<img src="../res/img/mapSync/label.png" style="margin-right: 2px;">
	<img src="../res/img/mapSync/bg.png">
	<img src="../res/img/mapSync/toggle_off.png" style="position: absolute; top: 2px; left: 87px; cursor: pointer;" class="mapSync">
</div>
<!-- 지도 div -->
<div id="xeus-map-content" class="map-target">
    <div id="popup"></div>
</div>
<div id="xeus-overview-eventView"></div>
<div id="fav-wrap" class="fav-target">
   <div id="fav-header">
       <span id="fav-title">관심영역</span>
       <img src="<%= context %>/res/img/popup_close_normal.png" id="popup-closer">
   </div>
   <div id="fav-body">
        <input type="text" id="fav-name" class="keyup" for="#fav-add" placeholder="관심영역 이름"><button id="fav-add">등록</button><br>
        <div id="fav-content">
                        <!-- <div class="favList" x="211594.147" y="371755.67" zoom="9"><span>전체보기</span></div> -->
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
<div id="overlay-west-side-bar" class="overlay-side-bar" >
    <!-- CCTV 모니터링 -->
    <button id="btn-lgd-mng" class="menu-button" for="btn-cctv-view" icon="ico2">범례</button>
    <button id="btn-monitor-view" class="menu-button" for="btn-cctv-view" icon="ico1">모니터링</button>
    <button id="btn-cctv-sch" class="menu-button" for="btn-cctv-view" icon="ico3">CCTV검색</button>
    <button id="btn-event-list-view" class="menu-button" for="btn-cctv-view" icon="ico4">이벤트<br>리스트</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC001")) %>
    <button id="btn-select-mng" class="menu-button" for="btn-cctv-view" icon="ico5">선택감시</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC002")) %>
    <button id="btn-ptr-view" class="menu-button" for="btn-cctv-view" icon="ico6">순찰감시</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC003")) %>
    <button id="btn-fcs-view" class="menu-button" for="btn-cctv-view" icon="ico7">집중감시</button>
    <!-- <button id="btn-prb-car-view" class="menu-button" for="btn-cctv-view">문제차량</button> -->
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC004")) %>
    <button id="btn-dcs-view" class="menu-button" for="btn-cctv-view" icon="ico10">치매어르신</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("EVT012")) %>
    <button id="btn-preview-view" class="menu-button" for="btn-cctv-view" icon="ico8">선영상<br>재생목록</button>
<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC014") || authGrpList.get(0).getAuthMgrNo().contains("SVC015")) %>
    <button id="btn-vision-mng" class="menu-button" for="btn-cctv-view" icon="ico35">지능형<br>CCTV</button>
    <button id="btn-dron-view" class="menu-button" for="btn-cctv-view" icon="ico8">드론<br>모니터링</button>
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
    <!-- <button id="btn-capture-test" class="menu-button">화면저장</button> -->
</div>

<!--  east pane, cctv가 보여질 영역, 지도와 overlay 됨 -->
<div id="center-overlay-east" xeus-show='false' xeus-event=''></div>

<div id="overlay-south-side-bar">
    <span id="coorX"></span>
    <span id="coorY"></span>
<%--     <span id="addr"><%= userNm %>님 환영합니다.</span> --%>
</div>
