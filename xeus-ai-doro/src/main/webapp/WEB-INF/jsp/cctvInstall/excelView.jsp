<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.bigdata.service.CctvInstallVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%
	ArrayList<CctvInstallVo> list = (ArrayList<CctvInstallVo>) request.getAttribute("result");

	String fileName = "CCTV 민원 검색결과_" + DateUtil.getStrDay() + ".xls";
	response.setContentType("application/vnd.ms-excel; charset=UTF-8");
    response.setHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes(), "ISO8859_1"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>분석결과</title>
<style type="text/css">
table th {
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
		<tr>
			<th>민원연도</th>
			<th>민원월</th>
			<th>민원일</th>
			<th>행정동</th>
			<th>법정동</th>
			<th>산</th>
			<th>지번주소</th>
			<th>경도</th>
			<th>위도</th>
			<th>요청사유1</th>
			<th>요청사유2</th>
			<th>요청내용</th>
			<th>설치여부</th>
			<th>중복여부</th>
			<th>민원인</th>
			<th>연락처</th>
			<th>접수방법</th>
			<th>특이사항</th>
			<th>현장실사</th>
			<th>처리일시</th>
		</tr>
<%
int length = list.size();
for(int i=0; i<length; i++){

	String jibun = "[" + StrUtil.chkNull(list.get(i).getJibun()) + "]";
%>
		<tr>
			<td><%= StrUtil.chkNull(list.get(i).getInstYear()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getInstMon()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getInstDay()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getEmd()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getBjd()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getSan()) %></td>
			<td><%= jibun %></td>
			<td><%= StrUtil.chkNull(list.get(i).getLon()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getLat()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getRegReqOne()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getRegReqTwo()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getRegReq()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getInstYn()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getOvrpYn()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getUserNm()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getUserTell()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getRegHow()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getRmark()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getFieldInsp()) %></td>
			<td><%= StrUtil.chkNull(list.get(i).getResDate()) %></td>
		</tr>
<%
}
%>
	</table>

</body>
</html>