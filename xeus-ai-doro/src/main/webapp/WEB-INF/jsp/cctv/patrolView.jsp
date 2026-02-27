<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.equipmgr.service.PatrolVo"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<PatrolVo> list = (ArrayList<PatrolVo>) request.getAttribute("result");
%>
<script type="text/javascript" src="<%= context %>/res/menu/eventView/geomex.xeus.cctv.patrol.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper">
	<table id="listTable">
		<thead>
<!-- 			<tr> -->
<!-- 				<th colspan="2">목록</th> -->
<!-- 			</tr> -->
			<tr>
				<th>경로명</th>
				<th>관리</th>
			</tr>
		</thead>
<%
if(list == null || list.size() == 0){
%>
		<tr>
			<td class="tCenter" colspan="2">등록된 정보가 없습니다.</td>
		</tr>
<%
}else{
	for(int i=0; i<list.size(); i++){
%>
		<tr>
			<td><%= list.get(i).getTitleNm() %></td>
			<td class="tCenter" k="<%= list.get(i).getGid() %>">
				<button class="btn_style2 viewBtn">보기</button>
				<button class="btn_Dstyle removeBtn">삭제</button>
			</td>
		</tr>
<%
	}
}
%>
    </table>
    <h3 class="title">감시 옵션 설정</h3>
	<div class="box_style">
		<div class="info_box">
			<span class="title">경로명</span>
			<input type="text" id="drawNm">
		</div>
		<div class="info_box">
			<span class="title">이동간격 (초)</span>
			<input type="text" id="moveSec">
		</div>
		<div class="info_box">
			<span class="title">검색반경 (M)</span>
			<input type="text" id="moveBuffer">
		</div>
		<div class="info_box">
			<span class="title">표시CCTV (대)</span>
			<input type="text" id="showCnt">
		</div>
		<button class="btn_style2" id="patrolStart">순찰감시 시작</button>
		<button class="btn_Dstyle2 hidden" id="patrolStop">순찰감시 종료</button>
		<button class="btn_Dstyle" id="drawBtn">경로 그리기</button>
		<button class="btn_Dstyle" id="saveBtn">경로 신규추가</button>
	</div>
	<div class="btnDiv">
	</div>
</div>