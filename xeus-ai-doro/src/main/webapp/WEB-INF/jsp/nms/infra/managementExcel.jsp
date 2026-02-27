<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C12");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.nms.infra.managementExcel.js"></script>


<div class="excelWrapper">
	<button id="excelExportBtn" class="btn_style2" style ="width:110px;">엑셀 내보내기</button>
	<button id="excelImportBtn" class="btn_style2" style ="width:110px;">엑셀 불러오기</button> 
	<input type="file" name="file" id="file" class="boxFile" style="display:none;">
    <label for="file" id="selectTxt" style="display:none;"></label>
</div>
