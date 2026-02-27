<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.smartcity.service.EventHistVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%



    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");





    int max = (Integer)request.getAttribute("count");

    String startDat = param.get("startDat");
    String endDat = param.get("endDat");
    String emdCd = param.get("emdCd");
    String evtTypCd = param.get("evtTypCd");
    String evtNm = param.get("evtNm");

    String offset = param.get("offset");
    String limit = param.get("limit");






    ArrayList<EventHistVo> list = (ArrayList<EventHistVo>)request.getAttribute("list");

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css?v=<%= DateUtil.getStrMilSec() %>">
<script type="text/javascript" src="./res/menu/statView/geomex.xeus.detailEventStatTable.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./common/sysMngSort.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">

	var startDat = '<%=startDat%>';
	var endDat = '<%=endDat%>';
	var emdCd = '<%=emdCd%>';
	var evtTypCd = '<%=evtTypCd%>';
	var evtNm = '<%=evtNm%>';

   	var offset="<%= offset %>";
   	var limit="<%= limit %>";

</script>

    <div class="contentWrapper searchList" data-mcs-theme="minimal-dark">


	    <input type="hidden" id="offset" value="<%= offset %>" />
	    <input type="hidden" id="max" value="<%= max%>" />
	    <input type="hidden" id="limit" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">



        <div class="table_top_box">
            <p class="result_text">
            	<span class="date"><%="".equals(evtNm) ? "전체 ": evtNm%> 이벤트</span>
                	가 총 <%= max%>건  조회되었습니다
            </p>
            <div class="btn_box">
                <button class="btn_stat gray" id="detailEventexcelDownBtn">엑셀 다운</button>
            </div>
        </div>

		<div class="table">
	        <table id="detailEventStatTable" style="table-layout: auto;">
	<!--             <colgroup> -->
	<!--             	<col width="40" /> -->
	<!-- 	            <col width="100" /> -->
	<!-- 	            <col width="100" /> -->
	<!-- 	            <col width="100" /> -->
	<!-- 	            <col width="100" /> -->
	<!-- 	            <col width="100" /> -->
	<!-- 	            <col width="" /> -->
	<!-- 	            <col width="100" /> -->
	<!-- 	            <col width="100" /> -->
	<!-- 	            <col width="120" /> -->
	<!-- 	            <col width="110" /> -->
	<!-- 	            <col width="60" /> -->
	<!-- 	            <col width="90" /> -->
	<!--             </colgroup> -->
	            <!-- <tr>
	                <th>신청번호</th>
	                <th>신청자ID</th>
	                <th>신청자</th>
	                <th>신청유형</th>
	                <th>범죄유형</th>
	                <th>CCTV목록</th>
	                <th>신청일</th>
	                <th>승인일</th>
	                <th>처리상태</th>
	                <th>활용결과</th>
	                <th>공문확인</th>
	                <th>상세보기</th>
	            </tr> -->

	<%
	String url = "/tvius/getMngTviusRqstView.do";
	%>
				<thead>
					<tr>
	<!-- 					<th id='selectAll'>전체</th> -->
						<th><span id='rqst.mgr_seq' class='mngSortBtn' url='<%=url%>'>이벤트 종류</span></th>
						<th><span id='rqst.reqst_id' class='mngSortBtn' url='<%=url%>'>이벤트 분류</span></th>
		                <th><span id='reqst_id_rel.user_nm' class='mngSortBtn' url='<%=url%>'>이벤트 상세분류</span></th>
		                <th><span id='req_gbn_cd_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>발생시간</span></th>
		                <th><span id='req_gbn_cd_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>종료시간</span></th>
	<%-- 	                <th><span id='crime_typ_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>주소</span></th> --%>
						<th><span id='rqst.cctv_list' class='mngSortBtn' url='<%=url%>'>법정동</span></th>
					</tr>
				</thead>
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

	                <td class="tCenter evtTypCd"><%=list.get(i).getEvtTypCd() %></td>
	                <td class="tCenter evtNm"><%=list.get(i).getEvtNm() %></td>
	                <td class="tCenter evtCntn"><%=list.get(i).getEvtCntn() %></td>
	                <td class="tCenter evtOutbDtm"><%=DateUtil.formatDate(list.get(i).getEvtOutbDtm()) %></td>
	                <td class="tCenter evtActnDtm"><%=DateUtil.formatDate(list.get(i).getEvtActnDtm()) %></td>
	                <td class="tCenter emdKorNm"><%=list.get(i).getEmdKorNm() %></td>

	            </tr>
	            <%
	                  }
	             }
	            %>
	        </table>

	        <div class="paging_wrap"></div>
		</div>
    </div>

<!--     <div style="position: absolute; bottom: 0px; height: 30px; width: 100%; display: block;"> -->
<!-- 		<span id="userNm" style="float: right; margin-right: 100px; font-size: 14px; font-weight: bold; color: #666;"> -->
<%-- 			<%= userNm %>님 환영합니다. --%>
<!-- 		</span> -->
<!-- 	</div> -->


