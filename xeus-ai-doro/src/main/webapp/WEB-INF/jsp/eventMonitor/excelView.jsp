<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.smartcity.service.EventHistVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%
	ArrayList<EventHistVo> list = (ArrayList<EventHistVo>) request.getAttribute("result");
	CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
	ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

	String fileName = "이벤트 검색 목록_" + DateUtil.getStrDay() + ".xls";
	response.setContentType("application/vnd.ms-excel; charset=UTF-8");
    response.setHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes(), "ISO8859_1"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>이벤트 검색 목록 | XEUS-Platform</title>
<style type="text/css">
table thead th {
	color: white;
	height: 38px;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
	background-color: #3F4551;
}

table td {
	text-align: center;
    background-color: #F8F9FA;
}
</style>
</head>
<body>

	<table>
		<thead>
			<tr>
<%
for(int i=0; i<column.size(); i++){
	if("xeus.mon_evet_hist".equals(column.get(i).getTblId())
		&& !"evt_typ".equals(column.get(i).getColId())
		&& !"usvc_outb_id".equals(column.get(i).getColId())
		&& !"msg_typ_cd".equals(column.get(i).getColId())
		&& !"evt_svc_nm".equals(column.get(i).getColId())
		&& !"evt_typ_cd".equals(column.get(i).getColId())
		&& !"outb_posx".equals(column.get(i).getColId())
		&& !"outb_posy".equals(column.get(i).getColId())
		&& !"evt_actn_dtm".equals(column.get(i).getColId())
		&& !"evt_actn_cntn".equals(column.get(i).getColId())
		&& !"test_yn".equals(column.get(i).getColId())
		&& !"evt_json".equals(column.get(i).getColId())
		&& !"_gid".equals(column.get(i).getColId())
		&& !"_annox".equals(column.get(i).getColId())
		&& !"_annoy".equals(column.get(i).getColId())
		&& !"_geometry".equals(column.get(i).getColId())
			){
%>
				<th><%= column.get(i).getColNm().replace("코드", "") %></th>
<%
	}
}
%>
			</tr>
		</thead>

<%
for(int i=0; i<list.size(); i++){
%>
			<tr>
				<%-- <td><%= list.get(i).getEvtTyp() %></td> --%>
				<td><%= StrUtil.chkNull(list.get(i).getEvtNm()) %></td>
                <td><%= list.get(i).getEvtCntn() %></td>
                <td><%= list.get(i).getOutbPosNm() %></td>
				<td><%= DateUtil.formatDate(list.get(i).getEvtOutbDtm()) %></td>
				<td><%= DateUtil.formatDate(list.get(i).getEvtClrDtm()) %></td>
				<td><%= cde.convertCodeToName("C23", list.get(i).getEvtProcCd()) %></td>
				<td><%= list.get(i).getEvtActnUsrid() %></td>
			</tr>
<%
}
%>

	</table>

</body>
</html>