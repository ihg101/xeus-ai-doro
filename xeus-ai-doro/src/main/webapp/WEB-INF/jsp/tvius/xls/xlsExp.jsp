<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ include file="../../common.jsp"%>
<%

	HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

	String startDat = "";
	String endDat = "";

	if (param.containsKey("startDat")){
	    if (param.get("startDat") != null) {
	        startDat = DateUtil.formatDate(param.get("startDat").trim(), 8);
	    }
	}

	if (param.containsKey("endDat")){
	    if (param.get("endDat") != null) {
	        endDat = DateUtil.formatDate(param.get("endDat").trim(), 8);
	    }
	} else {

	    SimpleDateFormat dayTime = new SimpleDateFormat("YYYY-MM-dd");
	    endDat = dayTime.format(new Date());
	}

    ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>)request.getAttribute("list");

	String fileName = "재생만료현황.xls";
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
	               <td colspan="8" align="center">재생만료현황</td>
	            </tr>
	            <tr align="center">
                    <td colspan="5"></td>
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
	        </thead>
            <colgroup>
                <col width="130"/>
                <col width="130"/>
                <col width="130"/>
                <col width="100"/>
                <col width="300"/>
                <col width="300"/>
                <col width="120"/>
                <col width="120"/>
            </colgroup>
            <tr>
                <th>신청번호</th>
                <th>신청자ID</th>
                <th>신청자명</th>
                <th>범죄유형</th>
                <th>CCTV명</th>
                <th>파일명</th>
                <th>재생만료일</th>
                <th>파기유무</th>
            </tr>
            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="8" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
            <%
             } else {
                  for(int i=0; i<list.size(); i++){


            %>
            <tr>
                <td><%= list.get(i).getRqstMgrSeq() %></td>
                <td><%= list.get(i).getReqstId() %></td>
                <td><%= list.get(i).getUserNm() %></td>
                <td><%= list.get(i).getCrimeNm() %></td>
                <td>
                <%
                String listStr = StrUtil.chkNull(list.get(i).getCctvLabel());
              	if (listStr.length() >= 100) {
                    listStr = listStr.substring(0, 100)+"...";
                }

                %>
                    <%= listStr %>
                </td>
                <td><%= list.get(i).getVdwkFileNm() %></td>
                <td>
                <%
                String strPlayLimitDat= list.get(i).getPlayLimitDat();
                if ( !"0".equals(strPlayLimitDat.trim()) ) strPlayLimitDat = DateUtil.formatDate(strPlayLimitDat, 8);
                %>
                <%= strPlayLimitDat %>
                </td>
                <td>
                <%
                String destAvi = "";
                if (list.get(i).getDestAvi() != null) destAvi = list.get(i).getDestAvi();
                %>
                <%= destAvi %>
                </td>
            </tr>
            <%
                  }
             }
            %>
        </table>

</body>
</html>
