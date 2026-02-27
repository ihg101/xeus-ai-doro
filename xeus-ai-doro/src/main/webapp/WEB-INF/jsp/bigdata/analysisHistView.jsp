<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.bigdata.service.BigDataAnalyHistVo"%>
<%@ page import="geomex.xeus.bigdata.service.BigDataAnalyzeVo"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<BigDataAnalyzeVo> list = (ArrayList<BigDataAnalyzeVo>) request.getAttribute("result");
ArrayList<BigDataAnalyHistVo> hist = (ArrayList<BigDataAnalyHistVo>) request.getAttribute("hist");
%>
<script type="text/javascript" src="./res/menu/bigdataView/geomex.xeus.bigdata.setting.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">
	<div id="listWrap">
<% if(list.size() > 0){ %>
	<% for(int i=0; i<list.size(); i++){ %>
	<%
		String analyPlan = "";
		if("I:00:00".equals(list.get(i).getAnalyPlan())) analyPlan = "즉시분석";
		if("W:01:00".equals(list.get(i).getAnalyPlan())) analyPlan = "매주분석";
		if("M:01:00".equals(list.get(i).getAnalyPlan())) analyPlan = "매월분석";
		if("Q:01:00".equals(list.get(i).getAnalyPlan())) analyPlan = "분기분석";
		if("Y:01:01".equals(list.get(i).getAnalyPlan())) analyPlan = "매년분석";
	%>
		<table plan="<%= analyPlan %>" k="<%= list.get(i).getMgrSeq() %>">
			<thead>
				<tr class="tCenter" k="<%= list.get(i).getMgrSeq() %>">
					<th colspan="3"><%= list.get(i).getAnalyNm() %></th>
					<th>
						<button class="delBtn isParent hidden btn_t" k="<%= list.get(i).getMgrSeq() %>">삭제</button>
						<button class="detailBtn btn_Dstyle" k="<%= list.get(i).getMgrSeq() %>">분석명칭 변경</button>
					</th>
				</tr>
				<tr>
					<th>분석 시작일</th>
					<th>분석 완료일</th>
					<th>처리상태</th>
					<th>관리</th>
				</tr>
			</thead>
			<tbody>
	<%
		for(int l=0; l<hist.size(); l++){
			if(list.get(i).getMgrSeq().equals(hist.get(l).getAnalyMgrSeq())){
				String substate = "접수대기";
				if("12".equals(hist.get(l).getAnalyState())) substate = "분석중";
				if("13".equals(hist.get(l).getAnalyState())) substate = "처리완료";
				if("99".equals(hist.get(l).getAnalyState())) substate = "에러";
	%>
				<tr class="tCenter" k="<%= hist.get(l).getAnalyMgrSeq() %>" tbl="<%= hist.get(l).getResultTblNm() %>">
					<td><%= DateUtil.formatDate(hist.get(l).getAnalyDat()) %></td>
					<td><%= DateUtil.formatDate(hist.get(l).getFinishDat()) %></td>
					<td><%= substate %></td>
					<td>
						<button class="delBtn btn_Dstyle2" k="<%= hist.get(l).getMgrSeq() %>" fk="<%= list.get(i).getMgrSeq() %>" tbl="<%= hist.get(l).getResultTblNm() %>">삭제</button>
						<button class="loadAnalyze btn_style2" k="<%= hist.get(l).getMgrSeq() %>" fk="<%= list.get(i).getMgrSeq() %>" tbl="<%= hist.get(l).getResultTblNm() %>">분석</button>
					</td>
				</tr>
	<%
			}
		}
	%>
			</tbody>
		</table>
	<% } %>
<% }else{ %>
		<table>
			<tbody>
				<tr class="tCenter">
					<td>분석목록이 존재하지 않습니다.</td>
				</tr>
			</tbody>
		</table>
<% } %>
	</div>
</div>