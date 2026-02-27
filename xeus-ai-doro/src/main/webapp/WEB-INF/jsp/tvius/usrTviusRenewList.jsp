<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.map.service.DoroVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%> --%>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsRqstRenewVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%
HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

String renewTyp = param.get("renewTyp");

String typ  = "연장";
if ("12".equals(renewTyp)){
    typ  = "증거자료";
}

ArrayList<CrmsRqstRenewVo> list = (ArrayList<CrmsRqstRenewVo>)request.getAttribute("list");

%>
<%-- <script type="text/javascript" src="<%=context%>/res/geomex.xeus.tvius.reg.list.js"></script> --%>
<%-- <link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.tvius.css"> --%>

<div class="tableWrapper searchList">
    <p class="searchTitle"><%=typ %>신청이력조회</p>

    <table>
         <colgroup>
                <col width="80" />
                <col width="150" />
<!--                 <col width="" /> -->
                <col width="" />
                <col width="150" />
                <col width="120" />
                <col width="150" />
<!--                 <col width="100" /> -->
                <col width="120" />
                <col width="150" />
            </colgroup>
            <tr>
                <th>신청번호</th>
                <th>범죄유형</th>
<!--                 <th>CCTV명</th> -->
                <th>영상파일</th>
                <th>신청일</th>
                <th>잔여재생횟수</th>
                <th>재생만료일</th>
<%--                 <th><%=typ %>신청사유</th> --%>
                <th>승인여부</th>
                <th>승인일</th>
            </tr>
            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="10" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
            <%
             } else if (list.size() > 1){
            %>
            <tr>
                <td colspan="10" align="center" style="height: 100px;">The data is not valid.</td>
            </tr>
            <%

             } else {

                  for(int i=0; i<list.size(); i++){
            %>

            <tr>
                <td class="tCenter"><%= list.get(i).getMgrSeq() %></td>
                <td class="tCenter"><%= list.get(i).getRqstCrimeTypRelCdeNm() %></td>
<%--                 <td class="tBlankLeft"><%= list.get(i).getCctvNoRelLabel() %></td> --%>
                <td class="tBlankLeft"><%= list.get(i).getWorkFileNm() %></td>
                <td class="tCenter"><%= DateUtil.formatDate( list.get(i).getReqstDat(), 8 ) %></td>
                <td class="tCenter"><%= list.get(i).getPlayLimitCnt() %></td>
                <td class="tCenter">
                <%
                if(list.get(i).getPlayLimitDat() == null){ %>
                <%} if("0".equals(list.get(i).getPlayLimitDat().trim())) { %>
                <%= list.get(i).getPlayLimitDat() %>
                <%} else { %>
                <%=DateUtil.formatDate(list.get(i).getPlayLimitDat(), 8) %>
                <% } %>
                </td>

<%--                 <td class="tCenter tool" style="word-break:break-all"><%= list.get(i).getReqstResn() %></td> --%>

                <td class="tCenter">
                <%if (list.get(i).getAcptYn() == null ){ %>
                승인대기
                <%} else { %>
                <%      if ("Y".equals(list.get(i).getAcptYn())){ %>
                승인
                <%      } else if ("N".equals(list.get(i).getAcptYn())){ %>
                거부
                <%
                        }
                }
                %>
                </td>
                <td class="tCenter">
                <% if(list.get(i).getAcptDat() == null){ %>
                <%} else { %>
                <%=DateUtil.formatDate(list.get(i).getAcptDat(), 8) %>
                <% } %>
                </td>
            </tr>

            <%

                  }
             }
            %>

    </table>

</div>
