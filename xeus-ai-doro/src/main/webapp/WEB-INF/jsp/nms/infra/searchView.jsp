<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C12");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");
ArrayList<LiVo> li = (ArrayList<LiVo>) request.getAttribute("li");

String nmsCctvExcelYn = (String) request.getAttribute("nmsCctvExcelYn");
%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.nms.infra.search.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">
	<div id="searchTable" class="box_style">
		<div class="info_box">
			<span class="title">시설구분</span>
			<select id="objType" name="objType" class="sendData">
					<option value="CTV">CCTV</option>
<!-- 					<option value="INF">산업용 스위치</option> -->
			</select>
		</div>
		<div class="info_box">
			<span class="title">읍면동</span>
			<select id="emdCd" name="emdCd" class="sendData">
					<option value="">전체</option>
<% for(int i=0; i<emd.size(); i++){ %>
					<option value="<%= emd.get(i).getEmdCd() %>"><%= emd.get(i).getEmdKorNm() %></option>
<% } %>
			</select>
		</div>
		<%-- <div class="info_box">
			<span class="title">관리기관</span>
			<select id="orgMgrNo" name="orgMgrNo" class="sendData">
					<option value="">전체</option>
<% for(int i=0; i<orgz.size(); i++){ %>
					<option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
				</select>
		</div> --%>
		<div class="info_box wd100">
			<span class="title">명칭</span>
			<input type="text" id="objName" name="objName" class="sendData" style="width:100%;">
		</div>
		<button class="btn_style" id="searchBtn">검 색</button>
	</div>

	<div class="tLeft">
		<h4 id="cntTitle" style="display:inline-block; padding: 15px 0px;">검색 결과</h4>
<!-- 		<button id="swcAddBtn" class="btn_Dstyle" style="float: right; margin-right: 5px; margin-top: 12px;">+ 산업용 스위치 신규 등록</button> -->
		<button id="cctvAddBtn" class="btn_Dstyle" style="float: right; margin-right: 5px; margin-top: 12px;">+ CCTV 신규 등록</button>
		<%if("Y".equals(nmsCctvExcelYn)) %>
			<button id="excelManagementBtn" class="btn_style2" style="float: right; margin-right: 5px; margin-top: 12px;">엑셀로 관리하기</button>
	</div>
	<div id="resultList"style="position: relative;">
		<div class="customScroll" style="overflow-y: auto;">
			<table id="resultNmsTable">
				<thead>
					<tr>
						<!-- <th>구분</th> -->
						<th width="100">시설분류</th>
						<th>명칭</th>
						<th width="50">확인</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>

	<div class="detailWrapper"></div>
</div>