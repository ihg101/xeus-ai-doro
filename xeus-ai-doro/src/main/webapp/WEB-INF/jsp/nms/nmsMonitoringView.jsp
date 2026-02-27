<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.equipmgr.service.StatusVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<StatusVo> list = (ArrayList<StatusVo>) request.getAttribute("result");

CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.nms.monitor.js"></script>
<script>
(function(){
	//Public.NMS.RainFall.Stop();
	//Public.NMS.WaterPump.Stop();
})();
</script>
<style>
.contentWrapper #listWrap {
	max-height: 350px;
}
</style>
<div class="contentWrapper customScroll" data-mcs-theme="minimal-dark">

<!--     <div class="tabTitle"> -->
<!--         <button class="tab" url="/nms/getNmsMonitoringView.do" active="active">일반 NMS</button> -->
<!--         <button class="tab" url="/nms/getLoRaView.do">LoRa NMS</button> -->
<!--         <button class="tab" url="/nms/getDustView.do">미세먼지 NMS</button> -->
<!--     </div> -->
    <div class="tCenter blankBottom">
        <span>갱신주기</span>
        <select class="middle" id="scdVal">
            <option value="5000">5 seconds</option>
            <option value="10000">10 seconds</option>
            <option value="15000">15 seconds</option>
            <option value="20000">20 seconds</option>
            <option value="30000">30 seconds</option>
        </select>
        <button class="btn_style2" id="intervalBtn">갱신 시작</button>
        <button class="btn_style2 hidden" id="intervalStopBtn">갱신 종료</button>
    </div>

    <div id="listWrap" class="customScroll head_fixed" data-mcs-theme="minimal-dark" style="overflow:auto;">
	    <table id="listTable" class="blankBottom">
	        <thead>
		        <tr>
		            <th>장비구분</th>
		            <th>장비이름</th>
		            <th>상태</th>
		            <th>수신일</th>
		            <th>관리</th>
		        </tr>
	        </thead>
	        <tbody>
	        </tbody>
	    </table>
    </div>

<!-- 	<h3 class="title">상세정보</h3> -->
    <table id="detailTable"></table>

    <!-- <div id="legendWrap"></div> -->

</div>