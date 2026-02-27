<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsRqstRenewVo"%>
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
ArrayList<CrmsRqstRenewVo> list = (ArrayList<CrmsRqstRenewVo>) request.getAttribute("list");

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

String fileName = "증거자료신청 로그현황.xls";
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
                       <td colspan="12" align="center">증거자료신청 로그현황</td>
                    </tr>
                    <tr align="center">
                        <td colspan="9"></td>
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
					<th>신청번호</th>
	                <th>신청자ID</th>
	                <th>신청자</th>
	                <th>범죄유형</th>
	                <th>CCTV명</th>
	                <th>영상파일</th>
	                <th>잔여재생횟수</th>
	                <th>재생만료일</th>
	                <th>연장신청사유</th>
	                <th>신청일</th>
	                <th>승인여부</th>
	                <th>승인일</th>
                    </tr>
                </thead>
                <tbody>
<%
if(list.size() == 0){
%>
                    <tr>
                        <td colspan="12"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <%-- <td><%= StrUtil.chkNull(list.get(i).getMgrSeq()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getUsrId()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getAuthMgrNo()) %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getUseTime()) %></td>
                        <td><%= list.get(i).getAllowYn() %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getConnIp()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getRmark()) %></td> --%>
                        <td><%= list.get(i).getMgrSeq() %></td>
                        <td><%= list.get(i).getRqstReqstId() %></td>
                        <td><%= list.get(i).getRqstReqstIdRelCdeNm() %></td>
                        <td><%= list.get(i).getRqstCrimeTypRelCdeNm() %></td>
                        <td>
	                        <%
				                String listStr = list.get(i).getCctvNoRelLabel();
				                if ( listStr.length() >= 100) {
				                    listStr = listStr.substring(0, 100)+"...";
				                }
			                %>
							<%= listStr %>
                        </td>
                        <td><%= list.get(i).getWorkFileNm() %></td>
                        <%
			                String aviPlayLimitCnt = list.get(i).getAviPlayLimitCnt();
			                String playLimitCnt = list.get(i).getPlayLimitCnt();
			                String viewPlayLimitCnt ="0";
			                if(playLimitCnt == null) viewPlayLimitCnt = aviPlayLimitCnt.trim();
			                else viewPlayLimitCnt = playLimitCnt.trim();
		                %>
                        <td><%= viewPlayLimitCnt %></td>
                        <td><%= DateUtil.formatDate( list.get(i).getReqstDat(), 8 ) %></td>
                        <td><%= list.get(i).getReqstResn() %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getReqstDat(), 8) %></td>
                        <td>
	                        <% if ( list.get(i).getAcptYn() == null ){ %>
			                    승인대기
		                    <% } else {
		                           if(list.get(i).getAcptYn().equals("Y")){ %>
		                    승인

		                    <% } else if (list.get(i).getAcptYn().equals("N")){ %>
		                    거절
		                    <% 	}
		                    }%>
                        </td>
                        <td>
		                    <%if( list.get(i).getAcptDat() != null ){//.trim().equals("")
			                    if ( !list.get(i).getAcptDat().trim().equals("") ){
			                %>
			                <%= DateUtil.formatDate(list.get(i).getAcptDat(), 8) %>
			                <%
			                    }
			                }
			                %>
                        </td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>

</body>
</html>