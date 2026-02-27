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
String offset = param.get("offset");
int max = (Integer)request.getAttribute("count");
//int max = 10;

String typ  = "연장";
if ("12".equals(renewTyp)){
	typ  = "증거";
}

ArrayList<CrmsRqstRenewVo> list = (ArrayList<CrmsRqstRenewVo>)request.getAttribute("list");

%>
<%-- <link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.tvius.css"> --%>
<script type="text/javascript" src="./res/menu/tviusView/geomex.xeus.tvius.usr.renew.view.js"></script>
<script type="text/javascript">
var renewTyp = '<%= renewTyp %>';
var typ = '<%= typ %>';
</script>

<div id="searchBox">

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= max%>" />

    <!-- <div class="searchWrapper searchList"> -->
    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">
<%--         <p class="searchTitle"><%=typ %>신청현황</p> --%>

        <table style="table-layout: fixed;" class="table_stlye">
             <colgroup>
                    <col width="80" />
                    <col width="100" />
                    <col width="180" />
                    <col width="" />
                    <col width="120" />
                    <col width="100" />
                    <col width="120" />
                    <col width="120" />
                </colgroup>
                <tr>
                    <th>신청번호</th>
                    <th>범죄유형</th>
                    <th>CCTV명</th>
<%--                     <th><%=typ %>신청사유</th> --%>
					<th>신청사유</th>
                    <th>신청일</th>
                    <th>승인여부</th>
                    <th>승인일</th>
                    <th>이력보기</th>
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
                    <td class="tCenter"><%= list.get(i).getMgrSeq() %></td>
                    <td class="tCenter"><%= list.get(i).getRqstCrimeTypRelCdeNm() %></td>
                    <td class="tBlankLeft">
                    	<div class="text-overflow" title="<%= StrUtil.chkNull(list.get(i).getCctvNoRelLabel()) %>">
                    	<%= StrUtil.chkNull(list.get(i).getCctvNoRelLabel()) %>
                    	</div>
                    </td>
                    <%-- <td class="tCenter" style="word-break:break-all">
                    	<%= list.get(i).getReqstResn() %>
                   	</td> --%>
                   	<td>
	                   	<div class="text-overflow" title="<%= StrUtil.chkNull(list.get(i).getReqstResn()) %>">
	                    	<%= StrUtil.chkNull(list.get(i).getReqstResn()) %>
	                   	</div>
                   	</td>
                    <td class="tCenter"><%= DateUtil.formatDate( list.get(i).getReqstDat(), 8 ) %></td>
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
                    <% if( list.get(i).getAcptDat() != null){ %>
	                <%=DateUtil.formatDate(list.get(i).getAcptDat(), 8) %>
	                <% } %>
                    </td>
                    <td class="tCenter">
	                <%
	                if(!"15".equals(list.get(i).getReqGbnCd()) ){
	                	if (list.get(i).getAcptYn() == null || "N".equals(list.get(i).getAcptYn()) ){ %>
	                    <button class="histList disableBtn btn_Dstyle">이력보기</button>
	                <% } else { %>
                        <button class="histList grayBtn btn_style2" mgrseq="<%=list.get(i).getMgrSeq()%>">이력보기</button>

	                <%
	                	}
	                }else{
	                %>
	                	오프라인반출
	                <%
	                }
	                %>
                    </td>
                </tr>
                <%
	                  }
	             }
                %>
        </table>

        <div class="paging_wrap"></div>
        <div id="histList"><!--  class="searchWrapper" style="height:50%;" -->
        </div>
    </div>

<!--     <div style="position: absolute; bottom: 0px; height: 30px; width: 100%; display: block;"> -->
<!-- 		<span id="userNm" style="float: right; margin-right: 100px; font-size: 14px; font-weight: bold; color: #666;"> -->
<%-- 			<%= userNm %>님 환영합니다. --%>
<!-- 		</span> -->
<!-- 	</div> -->

</div>
