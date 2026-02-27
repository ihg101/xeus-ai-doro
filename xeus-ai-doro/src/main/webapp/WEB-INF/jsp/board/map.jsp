<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.map.service.MapVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>XEUS-Board</title>
<link rel="shortcut icon" href="<%= context %>/res/img/geomex.ico">

<link rel="stylesheet" type="text/css" href="<%= context %>/common/ui-1.12.1/themes/ui-darkness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/ol-v4.0.1/ol.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/jquery.gridster.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/ui-1.12.1/jquery-ui.MonthPicker.min.css">

<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.board.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.layout.css">

<script type="text/javascript" src="<%= context %>/common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/bootstrap.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.gridster.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.form.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.MonthPicker.ko.js"></script>
<!-- ol-debug는 ie에서 안나옴 -->
<script type="text/javascript" src="<%= context %>/common/ol-v4.0.1/ol-debug.js"></script>
<script type="text/javascript" src="<%= context %>/common/proj4js-2.4.3/proj4.js"></script>
<script type="text/javascript" src="<%= context %>/common/common.js"></script>
<script type="text/javascript" src="<%= context %>/common/Date.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.paging.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.measure.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.overview.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.feature_drag.js"></script>
<script type="text/javascript" src="<%= context %>/common/jsmpeg.min20171213.js"></script> <!-- by khkim -->

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.board.chart.js"></script>
<script type="text/javascript" src="<%= context %>/common/highcharts.js"></script>
<script type="text/javascript" src="<%= context %>/common/highcharts-more.js"></script>
<script type="text/javascript" src="<%= context %>/common/solid-gauge.js"></script>
<script type="text/javascript" src="<%= context %>/common/exporting.js"></script>

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.proj4.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.map.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.tms.daum.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.button.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusConfig.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusGlobal.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayerList.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayerTheme.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayer.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusCCTV.js"></script>
<script type="text/javascript" src="<%=context%>/res/geomex.xeus.board.cctv.js"></script>


<script type="text/javascript" src="<%= context %>/common/spatial.js"></script>

<script type="text/javascript" src="<%= context %>/res/boardMission/cctvMission.js"></script>
<script type="text/javascript" src="<%= context %>/res/boardMission/cctvTheme.js"></script>
<script type="text/javascript" src="<%= context %>/res/boardMission/heatMission.js"></script>
<script type="text/javascript" src="<%= context %>/res/boardMission/heatTheme.js"></script>
<script type="text/javascript" src="<%= context %>/res/boardMission/nmsMission.js"></script>
<script type="text/javascript" src="<%= context %>/res/boardMission/nmsTheme.js"></script>

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.board.api.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.board.js"></script>

</head>
<body>
	<div id="allWrap">
		<!-- 	전체 div -->
		<div id="top">
			<!-- 		상단 메뉴들 div -->
			<div id="top_left">
				<div id="returnBtn"></div>
				<img id="ci" src="../res/img/board/ci_white.png" style="height: 40px;">
				<!-- 					 padding-top: 6px; -->
			</div>
			<!-- 			ci div -->
			<div id="top_center">
				<div id="weatherInfoBox" style="height: 40px;">
					<span id="weatherIcon"></span>
					<span id="weatherTemperature"></span>
					<span id="weatherInfo">
						<span id="weatherPopLabel"></span>
						<span id="weatherPop"></span>
						<span id="weatherVecWsd"></span>
						<span id="weatherReh">
					</span><!--  | <span id="weatherO3Label">오존 : </span><span id="weatherO3"></span> -->
					<!-- | <span id="weatherPm10Label">미세먼지 : </span><span id="weatherPm10"></span> -->
					<!-- | <span id="weatherPm25Label">초미세먼지 : </span><span id="weatherPm25"></span> -->
					</span>
				</div>
			</div>
			<!-- 			날씨 div, 오존, 미세먼지 추가 예정 -> 공공데이터포털 or skt? -->
			<div id="top_right">
				<div id="DateBox" style="height: 40px;">
					<span id="date"></span> <span id="time"></span>
				</div>
			</div>
			<!-- 			시계 div -->
		</div>

		<div id="left">
			<!-- 		메인 div -->
			<div id="left_top" class="block">
				<ul id="ticker">
					<!-- <li><span>2017/03/06</span><a href="#">The first thing ...</a></li>
					<li><span>2017/03/06</span><a href="#">The second thing ...</a></li>
					<li><span>2017/03/06</span><a href="#">The third thing ...</a></li> -->
				</ul>
			</div>
			<!-- 			전광판 효과 div -->
			<div id="left_left">
<!-- 				<input type="image" src="../res/img/board/menu1.png"/> -->
				<button class="menuBtn" id="btnCCTV" value="off" style="background-image: url(../res/img/board/menu1.png)"></button>
				<button class="menuBtn" id="btnNMS" value="off" style="background-image: url(../res/img/board/menu2.png)"></button>
				<button class="menuBtn" id="btnHeat" value="off" style="background-image: url(../res/img/board/menu3.png)"></button>
			</div>
			<!-- 			레이어 목록? 버튼들 -->
			<div id="xeus-map-content">
				<div id="popup" class="ol-popup">
					<a href="#" id="popup-closer" class="ol-popup-closer"></a>
					<div id="popup-content"></div>
				</div>
				<!-- 2017.09.07 김경호 map id 변경 -->
				<div id="virtual-map-boundary"></div>
				<!-- 2017.09.07 김경호 div 추가-->
<!-- 				<div id="layerWrap"></div> -->
			</div>
			<!-- 			지도와 범례창(오버레이) -->
		</div>

		<div id="right">
			<!-- 		우측 정보창? -->
			<div id="rightChartTop">
				<button id="changeChart1" class="changeChartButton"></button>
				<div class="chart" id="chart1"></div>
			</div>
			<!-- 			통계치 차트 -->
			<!-- <div id="rightChartLeft">
				<button id="changeChart2" class="changeChartButton"></button>
				<div class="chart" id="chart2"></div>
			</div> -->
			<!-- 			왼쪽 데이터 차트 -->
			<!-- <div id="rightChartRight">
				<button id="changeChart3" class="changeChartButton"></button>
				<div class="chart" id="chart3"></div>
			</div> -->
			<!-- 			오른쪽 데이터 차트 -->
			<div id="rightEventList">
				<div id="EventTop">
					<p id="tableTitle">리스트</p>
				</div>

				<table class="table_header">
					<tr>
						<th class="table_other">시간</th>
						<th class="table_other">분류</th>
						<th class="table_other">등급</th>
						<th class="table_message">대상 명칭</th>
					</tr>
				</table>
				<div id="table_center" style="overflow-y: auto; height: 125px">
					<table class="table_data">
						<%-- <%
							for (int i = 1; i <= 10; i++) {
						%>
						<tr>
							<td class="table_other"><%=i%>:<%=i%>:<%=i%></td>
							<td class="table_other"><%=i%>소방</td>
							<td class="table_other"><%=i%>위험</td>
							<td class="table_message"><%=i%> 4567896789</td>
						</tr>
						<%
							}
						%> --%>
					</table>
				</div>
			</div>
			<!-- 			이벤트 리스트 테이블 div -->
			<div id="rightEtc"></div>
			<!-- 			그외 사용할 div -->
		</div>
	</div>
</body>
</html>