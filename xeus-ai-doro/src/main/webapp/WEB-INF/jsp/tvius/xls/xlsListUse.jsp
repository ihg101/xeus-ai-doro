<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsStatVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.LinkedHashMap " %>
<%@ page import="java.text.SimpleDateFormat"%>

<%@ page import="org.apache.commons.lang3.StringUtils" %>

<%@ include file="../../common.jsp"%>
<%

	HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

	String year = param.get("year");

	ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>)request.getAttribute("list");


	StringBuilder sb = new StringBuilder();

	String columnName[] = {"구분",  "총계", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"};
	String baseColor[] = {"",  "220,220,220","151,187,205","240,73,73","151,220,151","151,220,187","255,204,151","250,237,125","255,167,167"};

	ArrayList<LinkedHashMap <String, String>> rows = new ArrayList<LinkedHashMap <String, String>>();
	ArrayList<LinkedHashMap <String, Float>> ratRows = new ArrayList<LinkedHashMap <String, Float>>();


	for ( int i = 0; i < list.size(); i++ ) {

	    LinkedHashMap <String, String> row = new LinkedHashMap <String, String>();

	    row.put( columnName[0],  list.get(i).getGbn() );
	    row.put( columnName[1],  String.valueOf(list.get(i).getAll()).trim() );
	    row.put( columnName[2],  String.valueOf(list.get(i).getJan()).trim() );
	    row.put( columnName[3],  String.valueOf(list.get(i).getFeb()).trim() );
	    row.put( columnName[4],  String.valueOf(list.get(i).getMar()).trim() );
	    row.put( columnName[5],  String.valueOf(list.get(i).getApr()).trim() );
	    row.put( columnName[6],  String.valueOf(list.get(i).getMay()).trim() );
	    row.put( columnName[7],  String.valueOf(list.get(i).getJun()).trim() );
	    row.put( columnName[8],  String.valueOf(list.get(i).getJul()).trim() );
	    row.put( columnName[9],  String.valueOf(list.get(i).getAug()).trim() );
	    row.put( columnName[10], String.valueOf(list.get(i).getSep()).trim() );
	    row.put( columnName[11], String.valueOf(list.get(i).getOct()).trim() );
	    row.put( columnName[12], String.valueOf(list.get(i).getNov()).trim() );
	    row.put( columnName[13], String.valueOf(list.get(i).getDec()).trim() );

	    rows.add(row);
	}



	for ( int i = 0; i < rows.size(); i++ ) {
	    LinkedHashMap <String, Float> ratRow = new LinkedHashMap <String, Float>();

	    for ( Map.Entry<String, String> et: rows.get(i).entrySet() ) {
	        if ( !"구분".equals(et.getKey()) ) ratRow.put( et.getKey(), Float.parseFloat("0"+et.getValue()) );
	    }
	    ratRows.add(ratRow);
	}

	LinkedHashMap <String, String> ratRowStr = new LinkedHashMap <String, String>();
	ratRowStr.put("구분", "CCTV활용율");

	for ( Map.Entry<String, Float> et: ratRows.get(0).entrySet() ) {
	    float denom = ratRows.get(0).get(et.getKey());
	    String ratStr = "";
	    if ( denom > 0 ) {
	        float rat = (ratRows.get(3).get(et.getKey()) / ratRows.get(0).get(et.getKey()) * 100F);
	        ratStr = String.format("%,3.2f", rat) + "%";
	    }
	    ratRowStr.put(et.getKey(), ratStr);
	}
	rows.add(ratRowStr);

	String fileName = "CCTV활용현황.xls";
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
	               <td colspan="14" align="center">CCTV활용현황</td>
	            </tr>
	            <tr align="center">
			        <td colspan="12"></td>
			        <td align="center">조회년도</td>
			        <td align="center"><%= year %> 년<td>
			    </tr>
	        </thead>
            <colgroup>
	            <col width="140" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
            </colgroup>
            <tr>
<%
for ( Map.Entry<String, String> et: rows.get(0).entrySet() ) {
    sb.append(et.getKey());
%>
                <th><%=et.getKey()%></th>
<%
}
%>
            </tr>
<%
for ( int i = 0; i < rows.size(); i++ ) {

%>
            <tr>
<%
    for ( Map.Entry<String, String> et: rows.get(i).entrySet() ) {

%>
                <td><%=("0".equals(et.getValue()) ? "-" : et.getValue())%></td>
<%
    }
%>
            </tr>
<%
}
%>
        </table>

</body>
</html>
