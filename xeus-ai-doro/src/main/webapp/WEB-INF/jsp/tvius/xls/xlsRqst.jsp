<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
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



    ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>)request.getAttribute("list");

	String fileName = "영상정보신청현황.xls";
	response.setContentType("application/vnd.ms-excel; charset=UTF-8");
	response.setHeader("Content-Disposition", "attachment; filename=" + new String(java.net.URLEncoder.encode(fileName,"UTF-8").getBytes(), "ISO8859_1"));

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>test</title>
<style type="text/css">
table .title td{
	border:1px solid;
    font-size: 20px !important;
    color: #585858 !important;
    height: 38px !important;
    background-color: #90bad1 !important;
    font-weight: bold !important;
}
table th {
	border:1px solid;
    font-size: 12px;
    color: #585858;
    height: 38px;
    background-color: #9ec293;
}

table thead th {
    color: #CFCDCC;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    background-color: #9ec293;
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
	            <tr class="title" align = "center">
	               <td colspan="16" align="center">영상반출현황</td>
	            </tr>
<!-- 	            <tr align="center"> -->
<!-- 			        <td colspan="7"></td> -->
<!-- 			        <td align="center">조회기간</td> -->
<!-- 			        <td align="center" colspan="2"> -->
<%-- 			        <% --%>
<!-- // 			        if (!"".equals(startDat)){ -->
<%-- 			        %> --%>
<%-- 			             <%= startDat %> --%>
<%-- 			        <% --%>
<!-- // 			        } -->
<%-- 			        %> --%>
<%-- 			             <%= " ~ " + endDat %> --%>
<!-- 			        </td> -->
<!-- 			    </tr> -->
	        </thead>
            <colgroup>
	            <col width="80" />
	            <col width="100" />
	            <col width="300" />
	            <col width="200" />
	            <col width="150" />
	            <col width="220" />
	            <col width="450" />
	            <col width="230" />
	            <col width="140" />
	            <col width="140" />
	            <col width="220" />
	            <col width="220" />
	            <col width="220" />
	            <col width="140" />
	            <col width="140" />
	            <col width="140" />
	             <col width="100" />
            </colgroup>
            <tr>
                <th rowspan="2">번호</th>
                <th rowspan="2">영상반출승인일</th>
                <th colspan="3">신청서 조회내용</th>
                <th rowspan="2">사유</th>
                <th rowspan="2">파일명</th>
                <th colspan="3">이용ㆍ 제공받는 신청자</th>
                <th colspan="2">이용ㆍ제공근거용</th>
                <th rowspan="2">신청유형</th>
                <th rowspan="2">최종공문<br>확인</th>
                <th rowspan="2">활용결과</th>
                <th rowspan="2">신청번호</th>
            </tr>
            <tr>
            	<th>녹화일시</th>
                <th>범죄발생장소<br>(녹화장소)</th>
                <th>카메라번호</th>
                <th>소속</th>
                <th>성명</th>
                <th>연락처</th>
                <th>생산기관<br>등록ㆍ시행번호</th>
                <th>스마트도시과</th>
            </tr>
            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="10" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
            <%
             } else {
                  for(int i=0; i<list.size(); i++){

            %>
            <tr>
                <td><%=i+1%></td>
                <td>
                <%
                if( list.get(i).getAcptDat() != null ){//.trim().equals("")
                	if ( !"".equals(list.get(i).getAcptDat().trim()) ){
                %>
                <%=DateUtil.formatDate(list.get(i).getAcptDat(), 8) %>
                <%
                	}
                }
                %>

                </td>
                <td>
	               <%
	               if( list.get(i).getSecStDat() != null ){//.trim().equals("")
	               		if ( !"".equals(list.get(i).getSecStDat().trim()) ){
	               %>
	               			<%=DateUtil.formatDate(list.get(i).getSecStDat(), 12) %>
	               			~
	               <%
	               		}
	               }
	               %>

	               <%
	               if( list.get(i).getSecEdDat() != null ){//.trim().equals("")
	               		if ( !"".equals(list.get(i).getSecEdDat().trim()) ){
	               %>
	               			<%=DateUtil.formatDate(list.get(i).getSecEdDat(), 12) %>
	               <%
	               		}
	               }
	               %>
                </td>
<%--   				<td><%=list.get(i).getSecStDat() %>  ~ <%=list.get(i).getSecEdDat() %></td> --%>
				<td><%=StrUtil.chkNull(list.get(i).getCrimeAddr()) %></td>
				<td><%=StrUtil.chkNull(list.get(i).getCameraNum()) %></td>
                <td><%=StrUtil.chkNull(list.get(i).getCrimeTypRelCdeNm()) %></td>
                <% if("11".equals(StrUtil.chkNull(list.get(i).getReqGbnCd()))){ %>

	            <% 		if("1".equals(StrUtil.chkNull(list.get(i).getFileCnt())) || "0".equals(StrUtil.chkNull(list.get(i).getFileCnt()))){ %>
	               			<td><%=StrUtil.chkNull(list.get(i).getFileNm())%></td>
	            <%
	               		}else{
	               			String str = StrUtil.chkNull(list.get(i).getFileNm())+" 외 "+Integer.toString((Integer.parseInt(StrUtil.chkNull(list.get(i).getFileCnt()))-1))+"건";
               	%>
	               		<td><%=str%></td>
               	<%
	               		}
               	}else if("12".equals(StrUtil.chkNull(list.get(i).getReqGbnCd()))){
               	%>
	               	<td>열람</td>
	            <%
	            }else if("16".equals(StrUtil.chkNull(list.get(i).getReqGbnCd()))){
	             		if("1".equals(StrUtil.chkNull(list.get(i).getImgCnt())) || "0".equals(StrUtil.chkNull(list.get(i).getImgCnt()))){ %>
	               			<td><%=StrUtil.chkNull(list.get(i).getImgNm())%></td>
	            <%
	               		}else{
	               			String str = StrUtil.chkNull(list.get(i).getImgNm())+" 외 "+Integer.toString((Integer.parseInt(StrUtil.chkNull(list.get(i).getImgCnt()))-1))+"건";
               	%>
	               		<td><%=str%></td>
               	<%
	               		}
               	}
	            else{
            	%>
						<td></td>
            	<%
	            }
	            %>
<%-- 				<td><%=StrUtil.chkNull(list.get(i).getFileNm())%></td> --%>
				<td><%=StrUtil.chkNull(list.get(i).getRqstDeptNm())%></td>
				<td><%=StrUtil.chkNull(list.get(i).getRqstUserNm())%></td>
				<td><%=StrUtil.chkNull(list.get(i).getRqstMobileNum())%></td>
				<td><%=StrUtil.chkNull(list.get(i).getDocNo()).split("/")[0]%></td>
				<% if(list.get(i).getDocNo().split("/").length == 1){ %>
				<td><%=StrUtil.chkNull(list.get(i).getDocNo()).split("/")[0]%></td>
				<%}
				else{ %>
				<td><%=StrUtil.chkNull(list.get(i).getDocNo()).split("/")[1]%></td>
				<%}%>

				<td><%=StrUtil.chkNull(list.get(i).getReqGbnCdRelCdeNm()) %></td>

                <td>
	                <% if( "Y".equals(list.get(i).getDocChngYn())) {%> O <%} %>
	                <% if( "N".equals(list.get(i).getDocChngYn())) {%>X <%} %>
                </td>
				<td><%=StrUtil.chkNull(list.get(i).getUseRsCdRelCdeNm()) %></td>
				<td><%=list.get(i).getMgrSeq() %></td>

<%--                 <td><%=list.get(i).getReqstIdRelCdeNm() %></td> --%>
<%--                 <td><%=list.get(i).getReqGbnCdRelCdeNm() %></td> --%>
<%--                 <td><%=list.get(i).getCctvList()%></td> --%>
<%--                 <td><%=DateUtil.formatDate(list.get(i).getReqstDat(), 8) %></td> --%>

<%--                 <td><%=list.get(i).getProcStatCdRelCdeNm() %></td> --%>
<%--                 <td><%=StrUtil.chkNull(list.get(i).getUseRsCdRelCdeNm()) %></td> --%>
            </tr>
            <%
                  }
             }
            %>
        </table>

</body>
</html>
