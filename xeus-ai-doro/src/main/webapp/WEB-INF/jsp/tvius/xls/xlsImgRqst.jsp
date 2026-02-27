<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsImageRqstVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ include file="../../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
    /* C52 // 영상반출처리상태 */
    HashMap<String, String> procStatCdMap = cde.convertCodeGrpToAllCde("C52");

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

    ArrayList<CrmsImageRqstVo> list = (ArrayList<CrmsImageRqstVo>)request.getAttribute("list");

    String fileName = "이미지반출신청현황.xls";
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
               <td colspan="8" align="center">이미지반출신청현황</td>
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
            <col width="140" />
            <col width="140" />
            <col width="140" />
            <col width="140" />
            <col width="140" />
            <col width="160" />
            <col width="140" />
            <col width="140" />
            <col width="140" />
        </colgroup>
        <tr>
            <th>신청번호</th>
            <th>신청자</th>
            <th>신청일</th>
            <th>신청내용</th>
            <th>공문번호</th>
            <th>공문파일</th>
            <th>승인일</th>
            <th>처리상태</th>
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
            <td><span><%=list.get(i).getMgrSeq() %></span></td>
            <td><%=list.get(i).getReqstId() %><br><%=list.get(i).getReqstUsrNm() %></td>
            <td><%=DateUtil.formatDate(list.get(i).getReqstDat(),8) %></td>
            <td><%=list.get(i).getReqstDetail()%></td>
            <td><%=list.get(i).getDocNo() %></td>
            <td><%=list.get(i).getDocFileNm() %></td>
            <td>
            <%
            if( list.get(i).getAcptDat() != null ){
            	if ( !"".equals(list.get(i).getAcptDat().trim()) ){
            %>
                <%=DateUtil.formatDate(list.get(i).getAcptDat(), 8) %>
            <%
            	}
            }
            %>
            </td>
            <td><%=procStatCdMap.get(list.get(i).getProcStatCd())%></td>
        </tr>
        <%
              }
         }
        %>
    </table>

</body>