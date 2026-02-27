<%@page import="geomex.xeus.eocs.service.EocsVO"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvModelVo"%>
<%@ page import="geomex.xeus.equipmgr.service.VmsVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="java.util.Arrays"%>
<%@ include file="../common.jsp" %>
<%
EocsVO vo = (EocsVO) request.getAttribute("result");
%>
<script type="text/javascript" src="./res/menu/eventView/geomex.xeus.eocs.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<style>
	.custom_eocs_table {
		height:auto !important;
	}
	
	.custom_eocs_table th, .custom_eocs_table td {
		padding:5px 0 !important;
		height:60px;
	}
	.custom_eocs_table .left {
		text-align: left !important;
		padding-left:10px  !important;
	}
	 .custom_eocs_table td {
	 text-align: left !important;
		padding-left:10px  !important;
	 }
</style>
<div>
<% if(vo != null){ %>
	<table class="custom_eocs_table">
		<colgroup>
			<col width="20%"/>
			<col width="30%"/>
			<col width="20%"/>
			<col width="30%"/>
		</colgroup>
		<tr>
			<th>접수 번호</th>
			<td>
			<input type="hidden" id="recNo" name="recNo" class="sendData wide" value="<%= StrUtil.chkNull(vo.getRecNo()) %>">
				<%= StrUtil.chkNull(vo.getRecNo()) %>
			</td>
			<th>접수 일시</th>
			<td>
				<%= StrUtil.chkNull(vo.getRecDate()) %>
			</td>
		</tr>
		<tr>
			<th>공사명</th>
			<td align="left" colspan="3" class="left">
				<%= StrUtil.chkNull(vo.getWorkName()) %>
			</td>
			
		</tr>
		<tr>
			<th>굴착 업체명</th>
			<td>
				<%= StrUtil.chkNull(vo.getContName()) %>
			</td>
			
			<th>작업/공사 종류</th>
			<td>
				<%= StrUtil.chkNull(vo.getJobType()) %> / <%= StrUtil.chkNull(vo.getContType()) %>
			</td>
		</tr>
		
		<tr>
			<th>시작예정일자</th>
			<td>
				<%= StrUtil.chkNull(vo.getExstartDate()) %>
			</td>
			<th>종료예정일자</th>
			<td>
				<%= StrUtil.chkNull(vo.getExendDate()) %>
			</td>
		</tr>
		<tr>
			<th>시작 주소</th>
			<td align="left" colspan="3" class="left">
				<%= StrUtil.chkNull(vo.getStartSido()) %> <%= StrUtil.chkNull(vo.getStartGu()) %> <%= StrUtil.chkNull(vo.getStartDong()) %> <%= StrUtil.chkNull(vo.getStartLotnum()) %>-<%= StrUtil.chkNull(vo.getStartLotsubnum()) %> <%= StrUtil.chkNull(vo.getStartAddr()) %>
			</td>
		</tr>
		<tr>
			<th>시작 위치 경도</th>
			<td>
				<input type="text" id="startLon" name="startLon" class="sendData wide" value="<%= StrUtil.chkNull(vo.getStartLon()) %>">
			</td>
			<th>시작 위치 위도</th>
			<td>
			<input type="text" id="startLat" name="startLat" class="sendData wide" value="<%= StrUtil.chkNull(vo.getStartLat()) %>">
			</td>
		</tr>
		<tr>
			<th>종료 위치 주소</th>
			<td  align="left" colspan="3" class="left">
				<%= StrUtil.chkNull(vo.getEndSido()) %> <%= StrUtil.chkNull(vo.getEndGu()) %> <%= StrUtil.chkNull(vo.getEndDong()) %> <%= StrUtil.chkNull(vo.getEndLotnum()) %>-<%= StrUtil.chkNull(vo.getEndLotsubnum()) %> <%= StrUtil.chkNull(vo.getEndAddr()) %>
			</td>
		</tr>
		<tr>
			<th>종료 위치 경도</th>
			<td>
				<input type="text" id="endLon" name="endLon" class="sendData wide" value="<%= StrUtil.chkNull(vo.getEndLon()) %>">
			</td>
			<th>종료 위치 위도</th>
			<td>
				<input type="text" id="endLat" name="endLat" class="sendData wide" value="<%= StrUtil.chkNull(vo.getEndLat()) %>">
			</td>
		</tr>
		<tr>
			<th>업데이트 일자</th>
			<td  align="left" colspan="3" class="left">
				<%= DateUtil.formatDate(StrUtil.chkNull(vo.getUpdateDate())) %>
			</td>
		</tr>
		
<%-- 		<tr>
			<th>비고</th>
			<td colspan="3">
				<input type="text" id="rmark" name="rmark" class="sendData wide" value="<%= StrUtil.chkNull(vo.getRmark()) %>">
			</td>
		</tr> --%>
	</table>
<% } %>
	<div class="btnDiv" style="text-align: right;" <% if(vo != null){ %> k="<%= vo.getMgrNo() %>" <% } %>>
		<!-- <button class="btn_style2" id="mapClickBtn" style="float: left; width:130px; height: 32px;">지도에서 위치 선택</button> -->
		<button class="btn_style2" id="saveBtn" style="width:60px; height: 32px;">저장</button>
	</div>
</div>
