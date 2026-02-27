<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.HashSet"%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.util.Arrays"%>
<%@ include file="../common.jsp"%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD51 // 8대중과실 */
    HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
    Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
    Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();


    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String reqstId = "";
    String reqstUserNm = "";
    String crimeTyp = "";
    String reqGbnCd = "";
    String startDat = "";
    String endDat = "";
    String chkParam = "";

    if (param.get("reqstId") != null)   reqstId = param.get("reqstId").trim();
    if (param.get("userNm") != null)    reqstUserNm = param.get("userNm").trim();
    if (param.get("crimeTyp") != null)  crimeTyp = param.get("crimeTyp").trim();
    if (param.get("reqGbnCd") != null)  reqGbnCd = param.get("reqGbnCd").trim();
    if (param.get("startDat") != null)  startDat = param.get("startDat").trim();
    if (param.get("endDat") != null)    endDat = param.get("endDat").trim();
    if (param.get("sch") != null)       chkParam = param.get("sch").trim();

    String offset = param.get("offset");

    int max = (Integer)request.getAttribute("count");
    ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>)request.getAttribute("list");

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css?v=<%= DateUtil.getStrMilSec() %>">
<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.rqst.mng.view.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">
    var userId = '<%=userId%>';
    var chkParam = '<%=chkParam%>';
    var reqstId = '<%=reqstId%>';
    var reqstUserNm = '<%=reqstUserNm%>';
    var crimeTyp = '<%=crimeTyp%>';
    var reqGbnCd = '<%=reqGbnCd%>';
    var startDat = '<%=startDat%>';
    var endDat = '<%=endDat%>';
</script>
<div id="searchBox">

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= max%>" />

    <!-- <div class="searchWrapper searchList"> -->
    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">
<!--         <p class="searchTitle">영상정보관리대장</p> -->

        <div id="menu_bar" class="box_style">

            <div class="sch_bar info_box wd100">
                <div>
                	<label>검색조건</label>
	                <select id="userKwTyp" style="height:24px; width:100px;  vertical-align: middle;">
	                    <option value="nm">신청자명</option>
	                    <option value="id">신청자ID</option>
	                    <!-- <option value="office">소속기관</option> -->
	                </select>
	                <input type="text" id="userKw" size="12" style="width: 100px; vertical-align: middle;">
                </div>
                <div>
                	<label for="reqGbnCd">신청유형</label>
	                <select id="reqGbnCd" name="reqGbnCd" class="sendData" name="reqGbnCd"
	                    style="height:24px; width:82px; vertical-align: middle;">
	                    <option value="">전체</option>
	                    <%
	                        while (chkReqGbnCdItr.hasNext()) {
	                            String str = (String) chkReqGbnCdItr.next();
	                            if("11".equals(str) || "12".equals(str)){
	                    %>
	                    <option value="<%=str%>"><%=chkReqGbnCd.get(str)%></option>
	                    <%
	                            }
	                        }
	                    %>
	                </select>
                </div>
                <div>
                	<label for="crimeTyp">범죄유형</label>
	                <select id="crimeTyp" name="crimeTyp" class="sendData" style="height:24px; width:82px; vertical-align: middle;">
	                    <option value="">전체</option>
	                    <%
	                        while (chkCrimeTypItr.hasNext()) {
	                            String str = (String) chkCrimeTypItr.next();
	                    %>
	                    <option value="<%=str%>"><%=chkCrimeTyp.get(str)%></option>
	                    <%
	                        }
	                    %>
	                </select>
                </div>
                <div>
                	<label>신청기간</label>
	                <input type="date" id="startDat" size="12" style="width: 135px; vertical-align: middle;"><!-- button class="ico_cal"></button-->
	                ~
	                <input type="date" id="endDat" size="12" style="width: 135px; vertical-align: middle;"><!-- button class="ico_cal"></button-->
	                <button id="btn_sch" class="btn_style2">조회</button>
	                <button id="btn_list_all" class="btn_style2" style="display: none;">전체보기</button>
	                	총 <%=max %>건이 조회되었습니다.
                </div>
                <div style="width:auto;"><!--  float: left; -->
                    <!-- <div id="sms_open_btn" class="grayBtn" style="width:50px; float: left; margin-right:10px; display: none;">SMS전송</div> -->
                    <button id="btn_print" class="btn_Dstyle">관리대장 출력</button>
                </div>
            </div>
        </div>


        <div style="height:30px;">
        </div>

        <table style="table-layout: fixed;">
<!--             <colgroup> -->
<!--                 <col width="120"/> -->
<!--                 <col width="80"/> -->
<!--                 <col width="80"/> -->
<!--                 <col width="450"/> -->
<!--                 <col width="80"/> -->
<!--                 <col width="150"/> -->
<!--                 <col width="90"/> -->
<!--                 <col width=""/> -->
<!--                 <col width="80"/> -->
<!--                 <col width="80"/> -->
<!--                 <col width="90"/> -->
<!--             </colgroup> -->

            <tr>
                <th width="120px">번호</th>
                <th width="50px">구분</th>
                <th width="100px">일시</th>
                <th>파일명/형태</th>
                <th width="100px">담당자</th>
                <th width="200px">목적 / 사유</th>
                <th width="120px">이용<br>제공받는 제3자<br>/열람 등 요구자</th>
                <th width="200px">이용제공 근거</th>
                <th width="80px">이용제공 형태</th>
                <th width="100px">기간 및<br>파기 예정일자</th>
                <th width="120px">파기 등 결과 및<br>처리일자</th>
            </tr>

            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="11" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
            <%
            } else {
                for(int i=0; i<list.size(); i++){
            %>
            <tr>
                <td class="tCenter"><%= list.get(i).getRqstMgrSeq() %></td>
                <td class="tCenter"><%= list.get(i).getReqGbnCd() %></td>
                <td class="tCenter"><%= DateUtil.formatDate( list.get(i).getReqstDat(), 8) %></td>
                <td class="tCenter">
            <%
                    if("반출".equals(list.get(i).getReqGbnCd()) || "긴급반출".equals(list.get(i).getReqGbnCd()) || "오프라인반출".equals(list.get(i).getReqGbnCd())){
                        int fileCnt = 0;
                        String fileList = list.get(i).getFileList();
                        if( !fileList.contains("||") ) fileCnt = 1;
                        else fileCnt = fileList.split("\\|\\|").length;

                        String fileListView = "";
                        if( fileCnt == 1) fileListView = fileList + ".MS4";
                        else if ( fileCnt > 1) fileListView = fileList.split("\\|\\|")[0] + ".MS4 등 " + fileCnt +" 개";
            %>
            		<div class="text-overflow" title="<%= fileListView %>">
                    	<%= fileListView %>
                    </div>
            <%
                    } else if("열람".equals(list.get(i).getReqGbnCd()) || "차량번호".equals(list.get(i).getReqGbnCd())){
                        String cctvList = list.get(i).getCctvList();

                        String cctvListView = "";
                        if( !list.get(i).getFileList().contains("||") ) cctvListView = cctvList;
                        else {
                            String[] splitList = cctvList.split("\\|\\|");
                            splitList = new HashSet<String>(Arrays.asList(splitList)).toArray(new String[0]);

                            if (splitList.length == 1) cctvListView = splitList[0];
                            else if (splitList.length > 1 ) cctvListView = splitList[0] + " 등 " + splitList.length + " 개";
                        }

            %>
            		<div class="text-overflow" title="<%= cctvListView %>">
                    	<%= cctvListView %>
                    </div>
            <%
                    }
            %>

                </td>
                <td class="tCenter"><%= list.get(i).getAcptUserInfo().split(" / ")[0] %></td>
                <td class="tCenter">
                	<div class="text-overflow" title="<%= list.get(i).getReqstDetail() %>">
	                	<%= list.get(i).getReqstDetail() %>
                	</div>
               	</td>
                <td class="tCenter"><%= list.get(i).getRqstUserInfo().split(" / ")[0] %></td>
                <td class="tCenter">
                    <%-- <%= list.get(i).getDocNo() %> --%>
                    <div class="text-overflow" title="<%= cde.convertCodeToName("C50", list.get(i).getReqstResn()) %>">
	                    <%= cde.convertCodeToName("C50", list.get(i).getReqstResn()) %>
                    </div>
                </td>
                <td class="tCenter">
                    <%= cde.convertCodeToName("C54",list.get(i).getRecvMthd()) %>
                </td>
                <td class="tCenter">

            <%
                    String playLimitDat = list.get(i).getPlayLimitDat();
                    if( "0".equals(list.get(i).getPlayLimitDat().trim()))
                        playLimitDat = "증거자료";
                    else
                        playLimitDat = DateUtil.formatDate( playLimitDat, 8);
            %>
                    <%= playLimitDat %>

                </td>
                <td class="tCenter">
            <%
                    if( "증거자료".equals(playLimitDat)){
            %>
                    <%= playLimitDat %>
            <%      } else {
            %>
                    <%= list.get(i).getDestAvi() %>
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

    </div>

<!--     <div style="position: absolute; bottom: 0px; height: 30px; width: 100%; display: block;"> -->
<!-- 		<span id="userNm" style="float: right; margin-right: 100px; font-size: 14px; font-weight: bold; color: #666;"> -->
<%-- 			<%= userNm %>님 환영합니다. --%>
<!-- 		</span> -->
<!-- 	</div> -->

</div>