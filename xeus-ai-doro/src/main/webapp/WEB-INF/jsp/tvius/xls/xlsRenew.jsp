<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsRqstRenewVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ include file="../../common.jsp"%>
<%

    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String renewTyp = param.get("renewTyp");
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

    ArrayList<CrmsRqstRenewVo> list = (ArrayList<CrmsRqstRenewVo>)request.getAttribute("list");

    String typ = "";
    if ("11".equals(renewTyp)){
    	typ = "연장";
    } else {
    	typ = "증거자료";
    }

    String fileName = typ + "신청현황.xls";

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
                   <td colspan="12" align="center"><%= typ %>신청현황</td>
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
            </thead>
            <colgroup>
                <col width="50" />
                <col width="100" />
                <col width="100" />
                <col width="80" />
                <col width="300" />
                <col width="300" />
                <col width="80" />
                <col width="100" />
                <col width="140" />
                <col width="100" />
                <col width="80" />
                <col width="100" />
            </colgroup>
            <tr>
                <th>신청번호</th>
                <th>신청자ID</th>
                <th>신청자</th>
                <th>범죄유형</th>
                <th>CCTV명</th>
                <th>영상파일</th>
                <th>잔여재생횟수</th>
                <th>재생만료일</th>
                <th><%=typ%>신청사유</th>
                <th>신청일</th>
                <th>승인여부</th>
                <th>승인일</th>
            </tr>
            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="12" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
            <%
             } else {
                  for(int i=0; i<list.size(); i++){


            %>
            <tr>
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
                <td><%= list.get(i).getAviPlayLimitCnt() %></td>
                <td>
                <%
                String aviPlayLimitDat = list.get(i).getAviPlayLimitDat();
                if ( !"0".equals(aviPlayLimitDat) ) aviPlayLimitDat = DateUtil.formatDate(aviPlayLimitDat, 8);
                %>
                <%= aviPlayLimitDat %>
                </td>
                <td><%= list.get(i).getReqstResn() %></td>
                <td><%= DateUtil.formatDate(list.get(i).getReqstDat(), 8) %></td>
                <td >
                    <% if ( list.get(i).getAcptYn() == null ){ %>
                    승인대기
                    <% } else {
                           if("Y".equals(list.get(i).getAcptYn())){
                    %>
                    승인

                    <%
                           } else if ("N".equals(list.get(i).getAcptYn())){
                     %>
                    거절
                    <%
                           }
                       }
                    %>
                </td>

                <td>
                <%
                if( list.get(i).getAcptDat() != null ){//.trim().equals("")
                    if ( !"".equals(list.get(i).getAcptDat().trim()) ){
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
        </table>

</body>
</html>
