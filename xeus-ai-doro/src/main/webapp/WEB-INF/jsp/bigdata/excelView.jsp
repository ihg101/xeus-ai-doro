<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.bigdata.service.BigDataAnalyzeResultVo"%>
<%@ page import="geomex.xeus.bigdata.service.BigDataAnalyzeVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%
	ArrayList<BigDataAnalyzeResultVo> list = (ArrayList<BigDataAnalyzeResultVo> ) request.getAttribute("result");
	BigDataAnalyzeVo analyze = (BigDataAnalyzeVo) request.getAttribute("analyze");
	HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");

	int min = Integer.parseInt(map.get("min"));
	int max = Integer.parseInt(map.get("max"));
	int range = Integer.parseInt(map.get("range"));
	int slice = Integer.parseInt(map.get("slice"));

	String[] color = map.get("color").split(",");

	String fileName = "빅데이터 분석결과_" + DateUtil.getStrDay() + ".xls";
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
			<th>분석 명칭</th>
			<td><%= analyze.getAnalyNm() %></td>
			<th>분석 시작일</th>
			<td><%= DateUtil.formatDate(analyze.getAnalyDat()) %></td>
			<th>분석 완료일</th>
			<td><%= DateUtil.formatDate(analyze.getFinishDat()) %></td>
		</tr>
	</table>
	<table>
		<tr>
			<th>색상</th>
			<th>최종값</th>
			<th>주소</th>
			<th>경도</th>
			<th>위도</th>
			<!-- <th>CCTV 수(100m 내)</th> -->
		</tr>
<%
int length = list.size();
for(int i=0; i<length; i++){
	String resultColor = "";
	int resultVal = Integer.parseInt(list.get(i).getResultVal());

	int start = min;
	int end = start + range;
	for(int l=0; l<slice; l++){
		if(resultVal >= start && resultVal <= end){
			resultColor = "background : " + color[l];
			break;
		}
		start = end;
		end = end + range;
	}
%>
		<tr>
			<td style="<%= resultColor %>"></td>
			<td><%= list.get(i).getResultVal() %></td>
			<td><%= list.get(i).getJibnAddr() %></td>
			<td><%= list.get(i).getLon() %></td>
			<td><%= list.get(i).getLat() %></td>
			<%-- <td><%= list.get(i).getCnt() %></td> --%>
		</tr>
<%
}
%>
	</table>

</body>
</html>