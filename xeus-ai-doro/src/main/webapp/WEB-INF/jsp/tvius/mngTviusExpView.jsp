<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.map.service.DoroVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%> --%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%
    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String offset = param.get("offset");
    int max = (Integer)request.getAttribute("count");

    String reqstId = "";
    String reqstUserNm = "";
    String cctvNm = "";
    String startDat = "";
    String endDat = "";
    String chkParam = "";
    String playLimitDat = "";
    String gbn = "";
    String sortCol = "";
    String sortTyp = "";
    String sortCntrl = "";
    String limit = "";

    if (param.get("reqstId") != null)       reqstId = param.get("reqstId").trim();
    if (param.get("userNm") != null)        reqstUserNm = param.get("userNm").trim();
    if (param.get("cctvNm") != null)        cctvNm = param.get("cctvNm").trim();
    if (param.get("startDat") != null)      startDat = param.get("startDat").trim();
    if (param.get("endDat") != null)        endDat = param.get("endDat").trim();
    if (param.get("sch") != null)           chkParam = "sch";
    if (param.get("playLimitDat") != null)  playLimitDat = param.get("playLimitDat").trim();
    if (param.get("gbn") != null)			gbn = param.get("gbn");
    if (param.get("limit") !=null)          limit = param.get("limit");
    if (param.get("sortCol") != null)		sortCol = param.get("sortCol");
    if (param.get("sortTyp") != null)		sortTyp = param.get("sortTyp");
    if (param.get("sortCntrl") != null)		sortCntrl = param.get("sortCntrl");

    ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>)request.getAttribute("list");

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css">
<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.exp.view.js"></script>
<script type="text/javascript" src="./common/sysMngSort.js"></script>
<script type="text/javascript">
    var userId = '<%=userId%>';
    var reqstId = '<%=reqstId%>';
    var reqstUserNm = '<%=reqstUserNm%>';
    var cctvNm = '<%=cctvNm%>';
    var startDat = '<%=startDat%>';
    var endDat = '<%=endDat%>';
    var chkParam = '<%= chkParam %>';
    var playLimitDat = '<%= playLimitDat %>';
    var gbn="<%= gbn %>";
    var limit="<%= limit %>";
   	var offset="<%= offset %>";
   	var sortCol = "<%= sortCol %>";
   	var sortTyp = "<%= sortTyp %>";
   	var sortCntrl = "<%= sortCntrl %>";
</script>

<div id="searchBox">

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= max%>" />

    <!-- <div class="searchWrapper searchList" style="height:50%;"> -->
    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">
<!--         <p class="searchTitle">재생만료현황</p> -->

        <div id="menu_bar" class="box_style">

        <div class="sch_bar info_box wd100">
            <div>
            	<label>신청자</label>
	            <select id="userKwTyp" style="height:24px; width:100px;  vertical-align: middle;">
	                <option value="nm">신청자명</option>
	                <option value="id">신청자ID</option>
	            </select>
	            <input type="text" id="userKw" size="12" style="width: 100px; vertical-align: middle;">
            </div>
            <div>
            	<label>CCTV명</label>
            	<input type="text" id="cctvNm" size="12" style="width: 100px; vertical-align: middle;">
            </div>
            <div>
            	<label>신청기간</label>
	            <input type="date" id="startDat" size="12" style="width: 135px; vertical-align: middle; " ><!-- button class="ico_cal"></button-->
	            ~
	            <input type="date" id="endDat" size="12" style="width: 135px; vertical-align: middle;"><!-- button class="ico_cal"></button-->

                <label>LIMIT</label>
                <input type="text" id="limit" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">

	            <button id="btn_sch" class="btn_style2">조회</button>
	            <button id="btn_list_all" class="btn_style2" style="display: none;">전체보기</button>
	            <button id="btn_evi" class="btn_Dstyle">증거자료건 보기</button>
	            	 총 <%=max %>건이 조회되었습니다.
            </div>
            <div style="width:auto;">
                <button id="xls_down_btn" class="btn_Dstyle"><!-- <img id="btn_xls" src="../../intra/img/3_over.png" class="" style="border: 0; vertical-align: middle;"></img> -->엑셀내려받기</button>
            </div>
        </div>
    </div>


        <table style="table-layout: fixed;">
<!--             <colgroup> -->
<!--                 <col width="130"/> -->
<!--                 <col width="130"/> -->
<!--                 <col width="130"/> -->
<!--                 <col width="100"/> -->
<!--                 <col width=""/> -->
<!--                 <col width=""/> -->
<!--                 <col width="120"/> -->
<!--                 <col width="120"/> -->
<!--             </colgroup> -->
            <!-- <tr>
                <th>신청번호</th>
                <th>신청자ID</th>
                <th>신청자명</th>
                <th>범죄유형</th>
                <th>CCTV명</th>
                <th>파일명</th>
                <th>재생만료일</th>
                <th>파기유무</th>
            </tr> -->
<%
String url = "/tvius/getMngTviusExpView.do";
%>
            <thead>
            	<tr>
	            	<th><span id='avi.rqst_mgr_seq' class='mngSortBtn' url='<%=url%>'>신청번호</span></th>
	            	<th><span id='rqst.reqst_id' class='mngSortBtn' url='<%=url%>'>신청자ID</span></th>
	            	<th><span id='reqst_id_rel.user_nm' class='mngSortBtn' url='<%=url%>'>신청자명</span></th>
	            	<th><span id='crime_typ_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>범죄유형</span></th>
	            	<th><span id='cctv.cctv_nm' class='mngSortBtn' url='<%=url%>'>CCTV명</span></th>
	            	<th><span id='workfile.file_nm' class='mngSortBtn' url='<%=url%>'>파일명</span></th>
	            	<th>재생만료일</th><!-- <span id='' class='mngSortBtn' url='<%=url%>'>재생만료일</span> -->
	            	<th>파기유무</th><!-- <span id='' class='mngSortBtn' url='<%=url%>'>파기유무</span> -->
	            </tr>
            </thead>
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
                <td class="tCenter"><%= list.get(i).getRqstMgrSeq() %></td>
                <td class="tCenter"><%= list.get(i).getReqstId() %></td>
                <td class="tCenter"><%= list.get(i).getUserNm() %></td>
                <td class="tCenter"><%= list.get(i).getCrimeNm() %></td>
                <td class="tBlankLeft">
               		<div class="text-overflow" title="<%= list.get(i).getCctvLabel()%>">
                		 <%= list.get(i).getCctvLabel()%>
               		</div>
                </td>
                <td class="tCenter">
                	<div class="text-overflow" title="<%= list.get(i).getVdwkFileNm() %>">
                		<%= list.get(i).getVdwkFileNm() %>
               		</div>
               	</td>
                <td class="tCenter">
                <%
                String strPlayLimitDat= list.get(i).getPlayLimitDat();
                if ( !"0".equals(strPlayLimitDat.trim()) ) strPlayLimitDat = DateUtil.formatDate(strPlayLimitDat, 8);
                %>
                <%= strPlayLimitDat %>
                </td>
                <td class="tCenter">
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

        <div class="paging_wrap"></div>
    </div>
</div>
