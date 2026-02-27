<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.smartcity.service.EventHistVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ include file="../../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");
ArrayList<EventHistVo> list = (ArrayList<EventHistVo>) request.getAttribute("list");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");

String startDat = "";
String endDat = "";

if (map.containsKey("startDat")){
    if (map.get("startDat") != null) {
        startDat = DateUtil.formatDate(map.get("startDat").trim(), 8);
    }
}

if (map.containsKey("endDat")){
    if (map.get("endDat") != null) {
        endDat = DateUtil.formatDate(map.get("endDat").trim(), 8);
    }
} else {

    SimpleDateFormat dayTime = new SimpleDateFormat("YYYY-MM-dd");
    endDat = dayTime.format(new Date());
}

String fileName = "이벤트공유 로그현황.xls";
response.setContentType("application/vnd.ms-excel; charset=UTF-8");
response.setHeader("Content-Disposition", "attachment; filename=" + new String(java.net.URLEncoder.encode(fileName,"UTF-8").getBytes(), "ISO8859_1"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>test</title>
<style type="text/css">
table th {
    font-size: 12px;
    color: #585858;
    height: 38px;
    background-color: #D9DADC;
}

table thead th {
    color: #CFCDCC;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    background-color: #3F4551;
}

table td {
    text-align: center;
    background-color: #F8F9FA;
    mso-number-format:"\@";
}
</style>
</head>
<body>

           <table>
                <thead>
                    <tr align = "center">
                       <td colspan="7" align="center">이벤트공유 로그현황</td>
                    </tr>
                    <tr align="center">
                        <td colspan="4"></td>
                        <td align="center">조회기간</td>
                        <td align="center" colspan="2">
                        <%
                        if (!"".equals(startDat)){
                        %>
                             <%= startDat %>
                        <%
                        }
                        %>
                             <%= " ~ " + endDat %>
                        </td>
                    </tr>
                    <tr>
						<th>이벤트범주</th>
						<th>이벤트명</th>
						<th>접수내용</th>
						<th>발생일시</th>
						<th>해제일시</th>
						<th>조치일자</th>
						<th>모의시험여부</th>
                    </tr>
                </thead>
                <tbody>
<%
if(list.size() == 0){
%>
                    <tr>
                        <td colspan="7"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <td><%= list.get(i).getEvtTyp() %></td>
                        <td><%= list.get(i).getEvtNm() %></td>
                        <td><%= list.get(i).getEvtCntn() %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getEvtOutbDtm()) %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getEvtClrDtm()) %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getEvtActnDtm()) %></td>
                        <td><%= list.get(i).getTestYn() %></td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>

</body>
</html>