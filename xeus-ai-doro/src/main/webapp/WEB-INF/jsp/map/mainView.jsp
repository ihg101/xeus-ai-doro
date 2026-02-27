<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.LayerDescVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.map.service.MapVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<MapVo> favList = (ArrayList<MapVo>) request.getAttribute("favList");
ArrayList<LayerDescVo> layer = (ArrayList<LayerDescVo>) request.getAttribute("nmsList");
HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");

String apikey = (String) request.getAttribute("apikey");
String apiurl = (String) request.getAttribute("apiurl");

if(userId == null || "".equals(userId)){
	response.sendRedirect("/xeus/user/login.do");
}
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Expires" content="Mon, 06 Jan 1990 00:00:01 GMT">
<meta http-equiv="Expires" content="-1">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">
<title>스마트시티 통합플랫폼</title>
<link rel="shortcut icon" href="<%= context %>/res/img/geomex.ico">

<link rel="stylesheet" type="text/css" href="<%= context %>/common/ui-1.12.1/themes/ui-darkness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/ol-v4.0.1/ol.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/gridstack/gridstack.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/gridstack/gridstack-extra.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/jquery.gridster.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/ui-1.12.1/jquery-ui.MonthPicker.min.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/bxslider/jquery.bxslider.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/nprogress/nprogress.css">

<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.tvius.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.layout.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.favMap.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.layer.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.ol.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.search.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.paging.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.mapSearch.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.cctv.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/scroll/jquery.customScroll.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.roadview.css">

<script type="text/javascript" src="<%= context %>/common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/bootstrap.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/lodash.js"></script>
<script type="text/javascript" src="<%= context %>/common/gridstack/gridstack.js"></script>
<script type="text/javascript" src="<%= context %>/common/gridstack/gridstack.jQueryUI.js"></script>
<script type="text/javascript" src="<%= context %>/common/gridstack/gridstack.custom.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.gridster.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.form.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.MonthPicker.ko.js"></script>

<script type="text/javascript" src="<%= context %>/common/jquery.inputmask.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/jquery.inputmask.date.extensions.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/jquery.inputmask.extensions.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/jquery.inputmask.numeric.extensions.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/jquery.inputmask.regex.extensions.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/jquery.rowspanizer.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/jquery.bxslider.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/jquery.cycle.all.js"></script><!-- 추가됏음. -->
<script type="text/javascript" src="<%= context %>/common/scroll/jquery.customScroll.concat.min.js"></script>

<script type="text/javascript" src="<%= context %>/common/jquery.timepicker.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.download.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/tea-block.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/base64.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/utf8.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/jsbn.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/rsa.js"></script>
<script type="text/javascript" src="<%= context %>/common/cipher/helper.js"></script>
<script type="text/javascript" src="<%= context %>/common/HashMap.js"></script>
<script type="text/javascript" src="<%= context %>/common/Date.js"></script>

<!--
180411 이은규 bPopup추가
-->
<script type="text/javascript" src="<%= context %>/common/jquery.bpopup.js"></script>

<!-- ol-debug는 ie에서 안나옴 -->
<%-- <script type="text/javascript" src="<%= context %>/common/ol-v4.0.1/ol-debug.js"></script> --%>
<script type="text/javascript" src="<%= context %>/common/v4.2.0-dist/ol.js"></script>
<%-- <script type="text/javascript" src="<%= context %>/common/ol-v4.0.1/ol.js"></script> --%>
<script type="text/javascript" src="<%= context %>/common/ol-v4.0.1/ol-drawhole.js"></script>
<%-- <script type="text/javascript" src="<%= context %>/common/ol-v4.0.1/ext/settextpathstyle.js"></script>
<script type="text/javascript" src="<%= context %>/common/ol-v4.0.1/ext/cspline.js"></script> --%>
<script type="text/javascript" src="<%= context %>/common/proj4js-2.4.3/proj4.js"></script>
<script type="text/javascript" src="<%= context %>/common/common.js"></script>
<script type="text/javascript" src="<%= context %>/common/color.js"></script>
<script type="text/javascript" src="<%= context %>/common/underscore.js"></script>
<script type="text/javascript" src="<%= context %>/common/string.js"></script>
<script type="text/javascript" src="<%= context %>/common/Date.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.paging.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.measure.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.overview.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.feature_drag.js"></script>
<script type="text/javascript" src="<%= context %>/common/xeus.player.2.0.1.js"></script>
<script type="text/javascript" src="<%= context %>/common/jsmpeg.min20171213.js"></script> <!-- by khkim -->
<%-- <script type="text/javascript" src="<%= context %>/common/jsmpeg.gmx.min.20181212.js"></script> --%> <!-- by khkim -->
<script type="text/javascript" src="<%= context %>/common/spin.min.js"></script><!-- 영상반출용 로딩 관련 -->
<%-- <script type="text/javascript" src="<%= context %>/common/tooltipsy.min.js"></script> --%><!-- 영상반출 툴팁용, 현재 미사용 > CCTV 타이틀 메뉴에 사요할 예정. by 이주영 -->
<script type="text/javascript" src="<%= context %>/common/tooltipsy.custom.js"></script><!-- 영상반출 툴팁용, 현재 미사용 > CCTV 타이틀 메뉴에 사요할 예정. by 이주영 -->
<script type="text/javascript" src="<%= context %>/common/nprogress/nprogress.js"></script>

<script type="text/javascript" src="<%= context %>/common/highcharts/highcharts.js"></script>
<script type="text/javascript" src="<%= context %>/common/highcharts/highcharts-more.js"></script>
<script type="text/javascript" src="<%= context %>/common/highcharts/solid-gauge.js"></script>
<script type="text/javascript" src="<%= context %>/common/highcharts/series-label.js"></script>
<script type="text/javascript" src="<%= context %>/common/highcharts/exporting.js"></script>
<script type="text/javascript" src="<%= context %>/common/highcharts/themes/dark-unica.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusConfig.js"></script>

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.proj4.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.map.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.tms.daum.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.tms.A2SM_CRMNLHSPOT_TOT.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.button.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.map.fav.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.board.api.js"></script>

<script type="text/javascript" src="<%= context %>/res/LoRaInfomation.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusGlobal.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusGlobal-CCTV.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusGlobal-NMS.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusGlobal-EVT.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusGlobal-TVIUS.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusGlobal-STAT.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusGlobal-BIGDATA.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusLayerList.js"></script>
<script>
<% if(authGrpList != null && authGrpList.size() > 0){ %>
	<% for(int i=0; i<layer.size(); i++){ %>
		<% if(authGrpList.get(0).getAuthMgrNo().contains(layer.get(i).getLyrId())){ %>
			Layers["<%= layer.get(i).getLyrId() %>"] = <%= layer.get(i).getJson() %>;
		<% } %>
	<% } %>
<% } %>
</script>
<% if("안찬식01".equals(userId) || "geomex".equals(userId)){ %>
<script type="text/javascript" src="<%= context %>/res/crime.js"></script>
<% } %>
<script type="text/javascript" src="<%= context %>/res/xeusLayerTheme.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayer.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayout.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusWebSocket.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSessionWebSocket.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusJsonParser.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusJsonFacilityParser.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusCCTV.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSymbol.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSymbol-CCTV.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSymbol-INFRA.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSymbol-INFRA-CCTV.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSymbol-INFRA-WIFI.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSymbol-INFRA-LORA.js"></script>
<%-- <script type="text/javascript" src="<%= context %>/res/xeusCCTVNet.js"></script> --%>

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.Search.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSearch.js"></script>
<script type="text/javascript" src="<%= context %>/common/spatial.js"></script>

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.mapEvent.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.map.widget.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.map.DaumRoadView.js"></script>

<script type="text/javascript">
function errorCatch(){
	DAUM_ROADVIEW_CHK = false;
}
</script>

<script type="text/javascript" src="<%= apiurl %><%= apikey %>" onerror="errorCatch();"></script>
<!-- <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=cdb3930022a676974bbba6c471e138a8"></script> -->


<!-- <script type="text/javascript" src="//apis.daum.net/maps/maps3.js?apikey=08eda4238467118689dd57e62853f297&libraries=services"></script>
<script type="text/javascript" src="http://apis.daum.net/maps/maps3.js?apikey=74b2a77931b2c5716877d34a8a78add9" charset="utf-8"></script> -->

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.main.js"></script>
<script type="text/javascript">
var ctxPath = '<%= context %>';
var isTray = <%= isTray %>;
</script>
</head>
<body id="parentBody">
	<div id="loadingWrap"></div>

	<div id="tabs" class="tabs_scroll">
		<button class="tab blueBtn hidden" target="eventView"><span class="title">이벤트모니터링</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
		<button class="tab blueBtn hidden" target="tviusView"><span class="title">영상반출신청</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
		<button class="tab blueBtn hidden" target="tviusMngView"><span class="title">영상반출관리</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
		<button class="tab blueBtn hidden" target="nmsView"><span class="title">장비관리</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
		<button class="tab blueBtn hidden" target="bigdataView"><span class="title">빅데이터 분석</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
		<button class="tab blueBtn hidden" target="boardView"><span class="title">대시보드</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
		<button class="tab blueBtn hidden" target="statView"><span class="title">통계조회</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
		<button class="tab blueBtn hidden" target="systemView"><span class="title">시스템관리</span><span class="close"></span><img class="tabRight" src="../res/img/tab/tab_over_right.png"></button>
	</div>
    <!-- 문서 전체를 감싸는 최상위 div -->
    <div id="layout-body">
        <!-- 상단(North) 패널을 감싸는 div -->
        <div id="layout-north">
            <div id="north-menu">
                <!-- 왼쪽슬라이드 접기/보이기 -->
                <%-- <div id="west-slide-group" class="west-menu-group">
                    <button id="west-slide-btn">
                        <img height="40px" width="20px" src="<%= context %>/res/img/right_double_angle.png">
                    </button>
                </div> --%>
                <!-- 시스템 로고 -->
                <div id="logo-group" class="left-menu-group">
                    <button id="system-logo">
                        <img src="<%= context %>/res/img/map_top_ci_seocho_ver2.png">
                    </button>
                </div>

                <!--  메뉴 목록... -->
                <div id="main-menu-group" class="left-menu-group">
<%
	String hidden = "hidden";
	//if(userId == null || "".equals(userId)) hidden = "hidden";
%>
					<%-- <img src="../res/img/menu_top/icon1_normal.png" id="btn-cctv-view" target="eventView" class="menu-button <%= hidden %> mainTooltip" title="이벤트모니터링" isClicked="no"/>
					<img src="../res/img/menu_top/icon2_normal.png" id="btn-tvus-reg" target="tviusView" class="menu-button <%= hidden %> mainTooltip" title="영상반출신청" isClicked="no"/>
					<img src="../res/img/menu_top/icon3_normal.png" id="btn-tvus-mng" target="tviusMngView" class="menu-button <%= hidden %> mainTooltip" title="영상반출관리" isClicked="no"/>
					<img src="../res/img/menu_top/icon4_normal.png" id="btn-nms-mng" target="nmsView" class="menu-button <%= hidden %> mainTooltip" title="장비관리" isClicked="no"/>
					<img src="../res/img/menu_top/icon5_normal.png" id="btn-bigdata-mng" target="bigdataView" class="menu-button <%= hidden %> mainTooltip" title="빅데이터 분석" isClicked="no"/>
					<img src="../res/img/menu_top/icon6_normal.png" id="btn-boad-view" target="boardView" class="menu-button <%= hidden %> mainTooltip" title="대시보드" isClicked="no"/>
					<img src="../res/img/menu_top/icon10_normal.png" id="btn-stat-mng" target="statView" class="menu-button <%= hidden %> mainTooltip" title="통계조회" isClicked="no"/>
					<img src="../res/img/menu_top/icon7_normal.png" id="btn-sys-mng" target="systemView" class="menu-button <%= hidden %> mainTooltip" title="시스템관리" isClicked="no"/> --%>

                    <%-- <button id="btn-cctv-view" class="menu-button <%= hidden %>">이벤트모니터링</button>
                    <button id="btn-tvus-reg" class="menu-button <%= hidden %>">영상반출신청</button>
                    <button id="btn-tvus-mng" class="menu-button <%= hidden %>">영상반출관리</button>
                    <button id="btn-nms-mng" class="menu-button <%= hidden %>">장비관리</button>
                    <button id="btn-bigdata-mng" class="menu-button <%= hidden %>">빅데이터 분석</button>
                    <button id="btn-boad-view" class="menu-button <%= hidden %>">대시보드</button>
                    <button id="btn-sys-mng" class="menu-button <%= hidden %>">시스템관리</button> --%>
<% if(authGrpList != null && authGrpList.size() > 0){ %>
    <%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN001")) %> --%>
                    <%-- <button id="btn-cctv-view" class="menu-button <%= hidden %>">이벤트모니터링</button> --%>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %>
                    <img src="../res/img/menu_top/icon1_normal.png" id="btn-cctv-view" target="eventView" class="menu-button mainTooltip" title="이벤트모니터링" isClicked="no"/>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %>
                    <img src="../res/img/menu_top/icon2_normal.png" id="btn-tvus-reg" target="tviusView" class="menu-button mainTooltip" title="영상반출신청" isClicked="no"/>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN004")) %>
                    <img src="../res/img/menu_top/icon3_normal.png" id="btn-tvus-mng" target="tviusMngView" class="menu-button mainTooltip" title="영상반출관리" isClicked="no"/>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN005")) %>
                    <img src="../res/img/menu_top/icon4_normal.png" id="btn-nms-mng" target="nmsView" class="menu-button mainTooltip" title="장비관리" isClicked="no"/>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN006")) %>
                    <img src="../res/img/menu_top/icon5_normal.png" id="btn-bigdata-mng" target="bigdataView" class="menu-button mainTooltip" title="빅데이터 분석" isClicked="no"/>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN007")) %>
                    <img src="../res/img/menu_top/icon6_normal.png" id="btn-boad-view" target="boardView" class="menu-button mainTooltip" title="대시보드" isClicked="no"/>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN009")) %>
                    <img src="../res/img/menu_top/icon10_normal.png" id="btn-stat-mng" target="statView" class="menu-button mainTooltip" title="통계조회" isClicked="no"/>
    <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN008")) %>
                    <img src="../res/img/menu_top/icon7_normal.png" id="btn-sys-mng" target="systemView" class="menu-button mainTooltip" title="시스템관리" isClicked="no"/>
<% } %>
					<img src="../res/img/menu_top/icon8_normal.png" id="btn-logout" class="" isClicked="no"/>
                </div>

                <%-- <button id="btn-logout" class="<%= hidden %>">로그아웃</button> --%>
                <!-- 오른쪽 슬라이드 접기/보이기 -->
                <%-- <div id="east-slide-group" class="east-menu-group">
                    <button id="east-slide-btn">
                        <img height="40px" width="20px" src="<%= context %>/res/img/left_double_angle.png">
                    </button>
                </div> --%>
            </div>
        </div>
        <!-- 지도와 상단 메뉴를 감싸는 Center div -->
        <div id="layout-center" style="background: url('../res/img/bg.png'); background-size: cover; background-position-y: -54px;">
<% if(userId == null || "".equals(userId)){ %>
        	<!-- <div class="viewWrap" id="loginView"><iframe src="../user/login.do"></iframe></div> -->
<% } %>
        	<div class="viewWrap <%= hidden %>" id="welcomView" style="background: url('../res/img/bg.png'); background-size: cover; background-position-y: -54px;width: 100%;height: 100%;display: block;">
        		<div id="tempWrap" align="center" style="position: absolute; width: 100%; display: none;"><!--   -->
        			<div id="helloTxt" style="color: white;font-weight: bold;font-size: 40px;/* text-shadow: 5px 5px 10px dimgrey; */"><%= userNm %>님 안녕하세요.</div>
        			<div style="color: white;font-weight: bold;font-size: 16px;/* text-shadow: 3px 3px 10px dimgrey; */margin-top: 25px;">우측 상단의 대 메뉴를 눌러 업무를 시작하실 수 있습니다.</div>
        			<style>
				    	#mainWrap{
				    	    width: 665px;
						    height: 350px;
						    background-image: url(/xeus/res/img/main_area.png);
						    background-size: 671px 350px;
				    	}

				    	.downfile{
				    		cursor: pointer;
			    		    /* width: 155px !important; */
    						display: inline-block;
    						font-size : 14px;
				    	}

				    	.downfile:hover{
				    		text-decoration: underline;
				    		color : #4582ac;
				    	}

				    	#noticeTable{
				    		width: 600px;
				    		margin: 20px 0;
				    	}

				    	#noticeTable th{
				    		color: white;
				    		font-weight: bold;
				    		font-size: 14px;
				    	}

				    	#noticeTable td{
				    		color: white;
				    		font-size: 14px;
			    		    height: 40px;
				    	}

				    </style>
        			<div id="mainWrap">
        				<div style="color: white;font-weight: bold;font-size: 16px; margin-top:25px; padding-top: 15px;">
						    <span class="downfile" style="text-align:right;" target="Tray">트레이 다운로드&nbsp;</span>
						    | <span class="downfile" style="text-align:left;" target="Pledge">&nbsp;보안서약서 다운로드</span>
						    | <span class="downfile" style="text-align:left;" target="Apps">&nbsp;APP 링크 SMS 전송</span>
						    <!--  | <span class="downfile" style="text-align:left;" target="Player">&nbsp;전용플레이어 다운로드</span> -->
						    <!-- | <span class="downfile" style="text-align:left;" target="Chrome">&nbsp;크롬 설치파일 다운로드</span> -->
					    </div>
					    <div>
						    <table id="noticeTable" style="width:600px;">
						    	<thead>
						    		<colgroup>
						    			<col width="50">
						    			<col width="180">
						    			<col width="70">
						    			<col width="100">
						    			<!-- <col width="200"> -->
						    		</colgroup>
						    		<tr>
						    			<th>순번</th>
						    			<th>제목</th>
						    			<th>등록자</th>
						    			<th>일시</th>
						    			<!-- <th>첨부파일</th> -->
						    		</tr>
						    	</thead>
						        <tbody id="noticeBody">

						    	</tbody>
						    </table>
						    <!-- <div class="notice_paging_wrap"></div> -->
						</div>
        			</div>
        			<script type="text/javascript">

						    //var offset = 0;
						    var max = 0;

						    function callView(offset){
								if(offset == null) offset = 0;
								var _param = {};
								_param['offset'] = offset;
								_param['limit'] = 5;
								_common.callAjax("/notice/getList.json", _param, function(json){
									if(json){
										max = json.count;
										$('#noticeBody').html('');
										for(var i=0; i<json.result.length; i++){
											if(json.result[i].openType != "외부"){
												var str = '';
												str += '<tr>';
												//str += '	<td class="tCenter">'+json.result[i].mgrSeq+'</td>';
												str += '	<td class="tCenter">'+ (i + 1) +'</td>';
												str += '	<td class="">';
												str += '		<div class="notcTitle" mgrseq="'+json.result[i].mgrSeq+'" title="'+json.result[i].notcTitle+'">';/* padding-top: 6px; */
												str += 				json.result[i].notcTitle+'</div>'
												str += '	</td>';
												str += '	<td class="tCenter">'+json.result[i].workerId+'</td>';
												str += '	<td class="tCenter">'+Date.prototype.formatMD(json.result[i].lastMdfyDat)+'</td>';
												/* str += '	<td class="tCenter">'+json.result[i].atchFileNm+'</td>'; */
												str += '</tr>';
												$('#noticeBody').append(str);
											}
										}

										$('.notcTitle').css({
											"display": "inline-block",
											"text-overflow": "ellipsis",
											"overflow": "hidden",
											"white-space": "nowrap",
											"width": "260px",
											"cursor": "pointer"
										});
										$('.notcTitle').mouseenter(function(){
											$(this).css("text-decoration","underline");
										});

										$('.notcTitle').mouseleave(function(){
											$(this).css("text-decoration","none");
										});

										$('.notcTitle').click(function(){
											var mgrSeq = $(this).attr("mgrseq");
											var _html = '';
											_html += '<div class="bpopup" id="edit_pop_wrap">';
											_html += '	<div id="bpop_wrap">';
											_html += '		<h2 id="bpop_title">공지사항 상세정보</h2>';
											_html += '		<table>';
											_html += '			<tr class="top">';
											_html += '				<th class="top">제목</th>';
											_html += '				<td>';
											_html += '					<input type="text" class="sendData" id="notcTitle" name="notcTitle" readonly="readonly" />';
											_html += '				</td>';
											_html += '			</tr>';
											_html += '			<tr>';
											_html += '				<th class="top">내용</th>';
											_html += '				<td>';
											_html += '					<textarea class="sendData" id="notcConts" name="notcConts" readonly="readonly"></textarea>';
											_html += '				</td>';
											_html += '			</tr>';
											_html += '			<tr>';
											_html += '				<th class="top">첨부파일</th>';
											_html += '				<td id="downTr">';
											/* _html += '					<input type="text" id="fileDown" readOnly />'; */
											_html += '					<span id="fileDown"></span>';
											_html += '				</td>';
											_html += '			</tr>';
											_html += '		</table>';
											_html += '		<table>';
											_html += '			<tr align="center">';
											_html += '				<td class="lastTd" colspan="2" style="border: 0 !important;">';
											_html += '					<button id="closeEditPop" class="bpopClose" tabindex="5">닫기</button>';
											_html += '				</td>';
											_html += '			</tr>';
											_html += '		</table>';
											_html += '	</div>';
											_html += '</div>';

											$("#edit_pop_wrap").remove();
											$('#layout-body').append(_html);
											$("#edit_pop_wrap").bPopup({
												onOpen:function(){
													_common.callAjax("/notice/getItem.json", {'mgrSeq' : mgrSeq}, function(json){
														if(json.result){
															$('#notcTitle').val(json.result.notcTitle);
															$('#notcConts').val(json.result.notcConts);
															$('#fileDown').text(json.result.atchFileNm)
															.attr('k', json.result.atchFileNm)
															.attr('u', mgrSeq)
															.css('cursor', 'pointer')
															.mouseenter(function(){
																$(this).css("text-decoration","underline");
															})
															.mouseleave(function(){
																$(this).css("text-decoration","none");
															});

															/* 파일 다운 */
															$(document).on("click", "#fileDown", function(){
																var k = $(this).attr("k");
																var u = $(this).attr("u");

																if(k != null && k != "" && u != null && u != ""){
																	_common.postForm.submit("/notice/getFile.json", { "atchFileNm" : k , "mgrSeq" : u });
																}
															});
														}
													});
												}
											});
										});

										/* bPopup Close */
										$(document).on("click", ".bpopClose", function(){
											$("#edit_pop_wrap").bPopup().close();
										});

										$(".notice_paging_wrap").empty();
										$(".notice_paging_wrap").paging({
											current	  : 5,
											max  	  : max,
											nowOffset : offset,
											bindEvent : callView
										});
									}
								}, false);
							}

					    	callView();

					    	$('.downfile').click(function(){
								var target = $(this).attr("target");
								if(target == "Apps"){
									_common.callAjax("/user/get"+target+"File.json", {}, function(json){
										if(json.result){
											alert(json.userNm + "님의 휴대전화(" + json.mobileNum + ")로 SMS 전송하였습니다.");
										}
									}, false);
								}else{
							    	_common.postForm.submit("/user/get"+target+"File.json", null);
								}
				    		});


					    </script>
        		</div>
        	</div>
        	<div class="viewWrap" id="eventView"></div>
        	<div class="viewWrap" id="tviusView"></div>
        	<div class="viewWrap" id="tviusMngView"></div>
        	<div class="viewWrap" id="nmsView"></div>
        	<div class="viewWrap" id="bigdataView"></div>
        	<div class="viewWrap" id="boardView"></div>
        	<div class="viewWrap" id="statView"></div>
        	<div class="viewWrap" id="systemView"></div>
        </div>

    </div>

    <div id="editInfoPop">
    </diV>

    <div id="editPwPop">
    </diV>

</body>
</html>