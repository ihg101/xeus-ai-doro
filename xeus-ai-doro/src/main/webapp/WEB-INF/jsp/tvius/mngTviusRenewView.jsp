<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsRqstRenewVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD51 // 8대중과실 */
    HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
    Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
    Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();


    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");


    String renewTyp = param.get("renewTyp");
    String offset = param.get("offset");
    int max = (Integer)request.getAttribute("count");

    String typ  = "연장";
    if ("12".equals(renewTyp)){
        typ  = "증거자료";
    }

    String reqstId = "";
    String reqstUserNm = "";
    String crimeTyp = "";
    String startDat = "";
    String endDat = "";
    String chkParam = "";
    String gbn = "";
    String sortCol = "";
    String sortTyp = "";
    String sortCntrl = "";

    if (param.get("reqstId") != null)   reqstId = param.get("reqstId").trim();
    if (param.get("userNm") != null)    reqstUserNm = param.get("userNm").trim();
    if (param.get("crimeTyp") != null)  crimeTyp = param.get("crimeTyp").trim();
    if (param.get("startDat") != null)  startDat = param.get("startDat").trim();
    if (param.get("endDat") != null)    endDat = param.get("endDat").trim();
    if (param.get("sch") != null)       chkParam = "sch";
    if (param.get("gbn") != null)		gbn = param.get("gbn");
    if (param.get("sortCol") != null)	sortCol = param.get("sortCol");
    if (param.get("sortTyp") != null)	sortTyp = param.get("sortTyp");
    if (param.get("sortCntrl") != null)	sortCntrl = param.get("sortCntrl");

    ArrayList<CrmsRqstRenewVo> list = (ArrayList<CrmsRqstRenewVo>)request.getAttribute("list");

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css">
<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.renew.view.js"></script>
<script type="text/javascript" src="./common/sysMngSort.js"></script>
<script type="text/javascript">
    var userId = '<%=userId%>';
    var reqstId = '<%=reqstId%>';
    var reqstUserNm = '<%=reqstUserNm%>';
    var crimeTyp = '<%=crimeTyp%>';
    var startDat = '<%=startDat%>';
    var endDat = '<%=endDat%>';
    var renewTyp = '<%=renewTyp%>';
    var chkParam = '<%=chkParam%>';
    var gbn="<%= gbn %>";
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
<%--         <p class="searchTitle"><%=typ %>신청현황</p> --%>

        <div id="menu_bar" class="box_style">

        <%-- <div class="top_left">
            자료건수: <%= max %>
        </div> --%>
        <!-- <div class="top_right" style="width:auto;">
            <button id="btn_list_all" class="grayBtn" style="display: none;">전체보기</button>
        </div> -->
        <div class="sch_bar info_box wd100">
            <div>
            	<label>신청자</label>
	            <select id="userKwTyp" style="height:24px; width:100px;  vertical-align: middle;">
	                <option value="nm" <% if(reqstUserNm != null && !"".equals(reqstUserNm)) out.print("selected"); %>>신청자명</option>
	                <option value="id" <% if(reqstId != null && !"".equals(reqstId)) out.print("selected"); %>>신청자ID</option>
	            </select>
	            <% if(reqstUserNm != null && !"".equals(reqstUserNm)){ %>
	            <input type="text" id="userKw" size="12"  style="width: 100px; vertical-align: middle;" value="<%= reqstUserNm %>">
	            <% }else if(reqstId != null && !"".equals(reqstId)){ %>
	            <input type="text" id="userKw" size="12"  style="width: 100px; vertical-align: middle;" value="<%= reqstId %>">
	            <% }else{ %>
	            <input type="text" id="userKw" size="12"  style="width: 100px; vertical-align: middle;" value="">
	            <% } %>
            </div>
            <div>
            	<label for="crimeTyp">범죄유형</label>
	            <select id="crimeTyp" name="crimeTyp" class="sendData" style="height:24px; width:82px; vertical-align: middle;">
	                <option value="">전체</option>
	                <%
	                    while (chkCrimeTypItr.hasNext()) {
	                        String str = (String) chkCrimeTypItr.next();
	                %>
	                <option value="<%=str%>" <% if(str.equals(crimeTyp)) out.print("selected"); %>><%=chkCrimeTyp.get(str)%></option>
	                <%
	                    }
	                %>
	            </select>
            </div>
            <div>
            	<label>신청기간</label>
	            <input type="date" id="startDat" size="12" style="width: 135px; vertical-align: middle;" value="<%= startDat %>"><!-- button class="ico_cal"></button-->
	            ~
	            <input type="date" id="endDat" size="12" style="width: 135px; vertical-align: middle;" value="<%= endDat %>"><!-- button class="ico_cal"></button-->
	            <button id="btn_sch" class="btn_style2">조회</button>
	            <button id="btn_list_all" class="btn_style2" style="display: none;">전체보기</button>
	             	총 <%=list.size() %>건이 조회되었습니다.
            </div>
            <div style="width:auto;"><!--  float: left; -->
                <!-- <div id="sms_open_btn" class="grayBtn" style="width:50px; float: left; margin-right:10px; display: none;">SMS전송</div> -->
                <button id="xls_down_btn" class="btn_Dstyle"><!-- <img id="btn_xls" src="../../intra/img/3_over.png" class="" style="border: 0; vertical-align: middle;"></img> -->엑셀내려받기</button>
            </div>
        </div>
    </div>

        <div style="height:30px;">
        </div>

        <table style="table-layout: fixed;">
<!--             <colgroup> -->
<!--                 <col width="60px"> -->
<!--                 <col width="100px"> -->
<!--                 <col width="100px"> -->
<!--                 <col width="100px"> -->
<!--                 <col width="250px"> -->
<!--     			<col width="250px"> -->
<!--                 <col width="80px"> -->
<!--                 <col width="100px"> -->
<!--                 <col width=""> -->
<!--                 <col width="100px"> -->
<!--                 <col width="60px"> -->
<!--                 <col width="100px"> -->
<!--                 <col width="120px"> -->
<!--             </colgroup> -->
            <%-- <tr>
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
                <th>확인</th>
            </tr> --%>
<%
String url = "/tvius/getMngTviusRenewView.do";
%>
            <tr>
                <th><span id='tt.mgr_seq' class='mngSortBtn' url='<%=url%>'>신청번호</span></th>
				<th><span id='rqst.reqst_id' class='mngSortBtn' url='<%=url%>'>신청자ID</span></th>
                <th><span id='rqst_reqst_id_rel.user_nm' class='mngSortBtn' url='<%=url%>'>신청자</span></th>
                <th><span id='rqst_crime_typ_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>범죄유형</span></th>
				<th><span id='cctv_no_rel.cctv_nm' class='mngSortBtn' url='<%=url%>'>CCTV명</span></th>
				<th><span id='work.file_nm' class='mngSortBtn' url='<%=url%>'>영상파일</span></th>
				<th>잔여재생횟수</th><%-- <span id='avi.play_limit_cnt' class='mngSortBtn' url='<%=url%>'>잔여재생횟수</span> --%>
				<th>재생만료일</th><!-- <span id='' class='mngSortBtn' url='<%=url%>'>재생만료일</span> -->
				<th><span id='tt.reqst_resn' class='mngSortBtn' url='<%=url%>'><%=typ%>신청사유</span></th>
				<th><span id='tt.reqst_dat' class='mngSortBtn' url='<%=url%>'>신청일</span></th>
				<th><span id='tt.acpt_yn' class='mngSortBtn' url='<%=url%>'>승인여부</span></th>
				<th><span id='tt.acpt_dat' class='mngSortBtn' url='<%=url%>'>승인 및 거절일</span></th>
				<th>확인</th>

            </tr>
            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="13" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
            <%
             } else {
                  for(int i=0; i<list.size(); i++){


            %>
            <tr>
                <td class="tCenter"><%= list.get(i).getMgrSeq() %></td>
                <td class="tCenter"><%= list.get(i).getRqstReqstId() %></td>
                <td class="tCenter"><%= list.get(i).getRqstReqstIdRelCdeNm() %></td>
                <td class="tCenter"><%= list.get(i).getRqstCrimeTypRelCdeNm() %></td>
                <td style="padding-left: 5px;">
                 	<%
//  	                String listStr = StrUtil.chkNull(list.get(i).getCctvNoRelLabel());
  					%>
                	<div class="text-overflow" title="<%= list.get(i).getCctvNoRelLabel() %>">
                	<%= list.get(i).getCctvNoRelLabel() %>
                    </div>
                </td>
                <td style="padding-left: 5px;">
                	<div class="text-overflow" title="<%= list.get(i).getWorkFileNm() %>">
                	<%= list.get(i).getWorkFileNm() %>
                	</div>
                </td>
                <%
                String aviPlayLimitCnt = StrUtil.chkNull(list.get(i).getAviPlayLimitCnt());
                String playLimitCnt = StrUtil.chkNull(list.get(i).getPlayLimitCnt());
                String viewPlayLimitCnt ="0";
                if(playLimitCnt == null || "".equals(playLimitCnt)) viewPlayLimitCnt = aviPlayLimitCnt.trim();
                else viewPlayLimitCnt = playLimitCnt.trim();
                %>
                <td class="tCenter"><%= viewPlayLimitCnt %></td>
                <td class="tCenter">
                <%
                String aviPlayLimitDat = StrUtil.chkNull(list.get(i).getAviPlayLimitDat());
                String playLimitDat = StrUtil.chkNull(list.get(i).getPlayLimitDat());
                String viewPlayLimitDat = "0";
                if ( playLimitDat == null){
                    aviPlayLimitDat = aviPlayLimitDat.trim();
                    if ( !"0".equals(aviPlayLimitDat) ) viewPlayLimitDat = DateUtil.formatDate(aviPlayLimitDat, 8);
                } else {
                    playLimitDat = playLimitDat.trim();
                    if ( !"0".equals(playLimitDat) ) viewPlayLimitDat = DateUtil.formatDate(playLimitDat, 8);
                }

                %>
                <%= viewPlayLimitDat %>
                </td>
                <%-- <%
                String reqstResn = list.get(i).getReqstResn();
                String viewTxt = reqstResn;
                if(reqstResn != null && !"".equals(reqstResn)){
                    if(viewTxt.length()>20) viewTxt = viewTxt.subSequence(0, 20) + "...";
                }
                %>
                <td class="tCenter">
                	<div class="text-overflow" title="<%=reqstResn%>">
                 	<%=reqstResn%>
                 	</div>
                </td> --%>
                <td class="tCenter">
                	<div class="text-overflow" title="<%=list.get(i).getReqstResn()%>">
                 		<%=list.get(i).getReqstResn()%>
                 	</div>
                </td>
                <td class="tCenter"><%= DateUtil.formatDate(list.get(i).getReqstDat(), 8) %></td>
                <td class="tCenter">
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

                <td class="tCenter">
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
                <td class="tCenter">
                <%
                if("15".equals(list.get(i).getReqGbnCd())){
                %>
                오프라인반출
                <%
                } else {
                	if ( list.get(i).getAcptYn() == null ) {
                %>
                    <button class="btn_acpt btn_style2" mgrseq="<%=list.get(i).getMgrSeq()%>" rqstmgrseq="<%=list.get(i).getRqstMgrSeq()%>" avimgrseq="<%=list.get(i).getAviMgrSeq()%>" fileseq="<%=list.get(i).getFileSeq()%>" limdat="<%= list.get(i).getAviPlayLimitDat() %>">승인</button>
                    <button class="btn_rejt btn_style2" mgrseq="<%=list.get(i).getMgrSeq()%>">거절</button>
                <%
                	}
                } %>
                </td>
            </tr>
            <%
                  }
             }
            %>
        </table>

        <!-- 승인창370 140 -->


        <div class="paging_wrap"></div>

    </div>

<!--     <div style="position: absolute; bottom: 0px; height: 30px; width: 100%; display: block;"> -->
<!-- 		<span id="userNm" style="float: right; margin-right: 100px; font-size: 14px; font-weight: bold; color: #666;"> -->
<%-- 			<%= userNm %>님 환영합니다. --%>
<!-- 		</span> -->
<!-- 	</div> -->

</div>
