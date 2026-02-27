<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%
	ArrayList<CctvVo> list = (ArrayList<CctvVo>) request.getAttribute("result");
	CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
	ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

	String fileName = "CCTV 검색 목록_" + DateUtil.getStrDay() + ".xls";
	response.setContentType("application/vnd.ms-excel; charset=UTF-8");
    response.setHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes(), "ISO8859_1"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>CCTV 검색 목록 | XEUS-Platform</title>
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
				<th>행정동</th>
				<th>법정동</th>
<%
for(int i=0; i<column.size(); i++){
	if("xeus.asset_cctv".equals(column.get(i).getTblId())
		&& !"vms_mgr_no".equals(column.get(i).getColId())
		&& !"mgr_no".equals(column.get(i).getColId())
		&& !"org_mgr_no".equals(column.get(i).getColId())
		&& !"md_mgr_no".equals(column.get(i).getColId())
		&& !"site_mgr_no".equals(column.get(i).getColId())
		&& !"const_year".equals(column.get(i).getColId())
		&& !"const_nm".equals(column.get(i).getColId())
		&& !"loc_desc".equals(column.get(i).getColId())
		&& !"cctv_desc".equals(column.get(i).getColId())
		&& !"ip_addr".equals(column.get(i).getColId())
		&& !"port_num".equals(column.get(i).getColId())
		&& !"cctv_desc".equals(column.get(i).getColId())
		&& !"rmark".equals(column.get(i).getColId())
		&& !"con_id".equals(column.get(i).getColId())
		&& !"con_pwd".equals(column.get(i).getColId())
		&& !"snmp_str".equals(column.get(i).getColId())
		&& !"angle".equals(column.get(i).getColId())
		&& !"_gid".equals(column.get(i).getColId())
		&& !"gbn_nm".equals(column.get(i).getColId())
			){
%>
				<th><%= column.get(i).getColNm().replace("코드", "") %></th>
<%
	}
}
%>
				<th>경도</th>
				<th>위도</th>
			</tr>
		</thead>

<%
for(int i=0; i<list.size(); i++){
	String hjd = StrUtil.chkNull(list.get(i).getHjd());
	if("".equals(hjd)){
		if(list.get(i).getCctvNm() != null && !"".equals(list.get(i).getCctvNm())){
			if(list.get(i).getCctvNm().contains(";")){
				String[] spt = list.get(i).getCctvNm().split(";");
				if(spt.length >= 3){
					hjd = spt[2].split(" ")[0];
				}
			}
		}
	}
%>
			<tr>
				<td><%= hjd %></td>
				<td><%= StrUtil.chkNull(list.get(i).getBjd()) %></td>
                <td style="width: 600px; text-align: left;"><%= list.get(i).getCctvNm() %></td>
				<td><%= DateUtil.formatDate(list.get(i).getInstDat()) %></td>
				<td><%= list.get(i).getDeviceId() %></td>
				<td><%= list.get(i).getChnlNo() %></td>
				<td><%= cde.convertCodeToName("C14", list.get(i).getGbnCd()) %></td>
				<%-- <td><%= StrUtil.chkNull(list.get(i).getIpAddr()) %></td>
				<td><%= StrUtil.chkNull(list.get(i).getPortNum()) %></td> --%>

				<td><%= "Y".equals(list.get(i).getUseYn()) ? "사용" : "미사용" %></td>
				<td><%= "Y".equals(list.get(i).getLightYn()) ? "가능" : "불가능" %></td>
				<td><%= "Y".equals(list.get(i).getInfrdYn()) ? "가능" : "불가능" %></td>
                <td><%= "Y".equals(list.get(i).getPanYn()) ? "가능" : "불가능" %></td>
				<td><%= "Y".equals(list.get(i).getTiltYn()) ? "가능" : "불가능" %></td>
				<td><%= "Y".equals(list.get(i).getZoomYn()) ? "가능" : "불가능" %></td>
				<td><%= "Y".equals(list.get(i).getTalkYn()) ? "가능" : "불가능" %></td>
                <td><%= "Y".equals(list.get(i).getTourYn()) ? "가능" : "불가능" %></td>
				<%-- <td><%= StrUtil.chkNull(list.get(i).getConId()) %></td>
				<td><%= StrUtil.chkNull(list.get(i).getConPwd()) %></td>
                <td><%= StrUtil.chkNull(list.get(i).getSnmpStr()) %></td>
				<td><%= StrUtil.chkNull(list.get(i).getConstYear()) %></td>
				<td><%= StrUtil.chkNull(list.get(i).getConstNm()) %></td>
				<td><%= StrUtil.chkNull(list.get(i).getLocDesc()) %></td>
				<td><%= StrUtil.chkNull(list.get(i).getRmark()) %></td> --%>

				<td><%= list.get(i).getLng() %></td>
				<td><%= list.get(i).getLat() %></td>
			</tr>
<%
}
%>

	</table>

</body>
</html>