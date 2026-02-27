<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

	/* CD51 // 8대중과실 */
	HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
	Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
	Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();

    /* CD55 // 영상활용결과 */
    HashMap<String, String> chkUseRsCd = cde.convertCodeGrpToAllCde("C55");
    Set<String> chkUseRsCdKey = new TreeSet<String>(chkUseRsCd.keySet());
    Iterator<String> chkUseRsCdItr = chkUseRsCdKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    /* C52 // 영상반출처리상태 */
    HashMap<String, String> procStatCdMap = cde.convertCodeGrpToAllCde("C52");
    Set<String> procStatCdKey = new TreeSet<String>(procStatCdMap.keySet());
    Iterator<String> procStatCdItr = procStatCdKey.iterator();

    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String procStatCd = "";
    String reqstId = "";
    String reqstUserNm = "";
    String crimeTyp = "";
    String reqGbnCd = "";
    String startDat = "";
    String endDat = "";
    String chkParam = "";
    String sortCntrl = "";
    String gbn = "";
    String sortCol = "";
    String sortTyp = "";
    String scrollHeight = "";

    if (param.get("procStatCd") != null) procStatCd = param.get("procStatCd").trim();
    if (param.get("reqstId") != null)   reqstId = param.get("reqstId").trim();
    if (param.get("userNm") != null)    reqstUserNm = param.get("userNm").trim();
    if (param.get("crimeTyp") != null)  crimeTyp = param.get("crimeTyp").trim();
    if (param.get("reqGbnCd") != null)  reqGbnCd = param.get("reqGbnCd").trim();
    if (param.get("startDat") != null)  startDat = param.get("startDat").trim();
    if (param.get("endDat") != null)    endDat = param.get("endDat").trim();
    if (param.get("sch") != null)       chkParam = "sch";
    if (param.get("gbn") != null)		gbn = param.get("gbn");
    if (param.get("sortCol") != null)	sortCol = param.get("sortCol");
    if (param.get("sortTyp") != null)	sortTyp = param.get("sortTyp");
    if (param.get("sortCntrl") != null)	sortCntrl = param.get("sortCntrl");

    if (param.get("scrollHeight") != null)	scrollHeight = param.get("scrollHeight");

    int yearCnt = (Integer)request.getAttribute("yearCount");
    int max = (Integer)request.getAttribute("count");



    String useRsCdNullChk = "";
    String offset = param.get("offset");
    String limit = param.get("limit");
    String year = param.get("year");

    if ( param.size() > 0){
        if (param.containsKey("useRsCd")){
            chkParam = "useRst";
            useRsCdNullChk = "Y";
        }
        if (param.containsKey("procStatCd")){
            if ("SW".equals(param.get("procStatCd"))){
                chkParam = "stat";
            }
        }
        if (param.containsKey("sch")){
            chkParam = "sch";
        }

    }

    ArrayList<CrmsTransRqstVo> stat = (ArrayList<CrmsTransRqstVo>)request.getAttribute("stat");

    String swCnt = "0";
    for(int i=0; i<stat.size(); i++){
        if("SW".equals(stat.get(i).getProcStatCd())) swCnt = stat.get(i).getCnt();
    }

    ArrayList<CrmsTransRqstVo> userst = (ArrayList<CrmsTransRqstVo>)request.getAttribute("userst");

    String useRstCnt = "0";
    for(int i=0; i<userst.size(); i++){
        if("11".equals(userst.get(i).getUseRsCd())) useRstCnt = userst.get(i).getCnt();
    }

    ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>)request.getAttribute("list");

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css?v=<%= DateUtil.getStrMilSec() %>">
<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.rqst.view.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./common/sysMngSort.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">
    var userId = '<%=userId%>';
    var chkParam = '<%=chkParam%>';
    var reqstId = '<%=reqstId%>';
    var requestId = '<%=reqstId%>';
   	var reqstUserNm = '<%=reqstUserNm%>';
   	var crimeTyp = '<%=crimeTyp%>';
  	var reqGbnCd = '<%=reqGbnCd%>';
   	var startDat = '<%=startDat%>';
   	var endDat = '<%=endDat%>';
   	var procStatCd = '<%=procStatCd%>';
   	var gbn="<%= gbn %>";
   	var offset="<%= offset %>";
   	var limit="<%= limit %>";
   	var sortCol = "<%= sortCol %>";
   	var sortTyp = "<%= sortTyp %>";
   	var sortCntrl = "<%= sortCntrl %>";

	var scrollHeight = "<%= scrollHeight %>";

	var SYSTEM_SMI_YN = '<%= param.get("tvius.smi_yn") %>';
</script>



    <!-- _param['reqstId'] = userId;
        _param['useRsCdNullChk'] = 'Y';
        _param['procStatCd'] = 'SK';
        _param['limit'] = '10';
        _param['offset'] = '0'; -->


    <!-- <div class="searchWrapper searchList"> -->
    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">


<%-- 	    <input type="hidden" id="procStatCd" value="<%= procStatCd %>" /> --%>
	    <input type="hidden" id="useRsCdNullChk" value="<%= useRsCdNullChk %>" />
	    <input type="hidden" id="offset" value="<%= offset %>" />
	    <input type="hidden" id="max" value="<%= max%>" />
	    <input type="hidden" id="year" value="<%= year%>" />
<!--         <p class="searchTitle">영상정보신청현황</p> -->

        <div id="menu_bar" class="box_style">

        <div class="sch_bar info_box wd100">
            <div>
<!--             	<label>신청자</label> -->
	            <select id="userKwTyp" style="height:25px; width:90px;  vertical-align: middle;">
	                <option value="nm">신청자명</option>
	                <option value="id">신청자ID</option>
	            </select>
	            <input type="text" id="userKw" size="12" style="width: 80px; vertical-align: middle;">
            </div>
             <div>
            	<label>처리상태</label>
            	<select id="procStatCd" style="height:24px; width:100px;  vertical-align: middle;">
                    <option value="">전체</option>
                <%
                    while (procStatCdItr.hasNext()) {
                        String str = (String) procStatCdItr.next();
                %>
                    <option value="<%=str%>" <%if(procStatCd.equals(str)){%>selected="selected" <% } %>><%=procStatCdMap.get(str)%></option>
                <%
                    }
                %>
                </select>
            </div>
            <div>
            	<label for="reqGbnCd">신청유형</label>
	            <select id="reqGbnCd" name="reqGbnCd" class="sendData" name="reqGbnCd"
	                style="height:24px; width:80px; vertical-align: middle;">
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
	            <select id="crimeTyp" name="crimeTyp" class="sendData"style="height:24px; width:80px; vertical-align: middle;" >
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
	            <input type="date" id="startDat" size="12" style="width: 130px; vertical-align: middle;"><!-- button class="ico_cal"></button-->
	            ~
	            <input type="date" id="endDat" size="12" style="width: 130px; vertical-align: middle;"><!-- button class="ico_cal"></button-->
	            <label>LIMIT</label>
	            <input type="text" id="limit" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">

	            <button id="btn_sch" class="grayBtn btn_style2">조회</button>
<%-- 	             &nbsp; 총 <%= max%>건이 조회되었습니다 --%>
            </div>
            <div class="" style="width:auto;">
				<button id="xls_down_btn" class="btn_Dstyle">엑셀내려받기</button>
				<button id="restore_rqst_btn" class="btn_Dstyle hidden">삭제내역복원</button>
				<button id="del_rqst_btn" class="btn_Dstyle2 hidden">반출내역삭제</button>
				<button id="del_chk_btn" class="btn_style2">반출내역관리</button>
			</div>
<!-- 			<div class="top_right" style="display:inline-block; margin-left: 28px; float: right;">margin-top: 7px; -->
<!--   				<button id="btn_list_all" class="grayBtn btn_Dstyle" style="display: none;">전체보기</button> -->
<%--             	<label>승인대기</label><span id="callListStat" class="cctvLookup" onclick="callListStat()"><%= swCnt %>건 </span> --%>
<%--             	<label>활용결과미등록</label><span id="callListUse" class="cctvLookup" onclick="callListUse()"><%= useRstCnt %>건</span> --%>
<!--            	</div> -->
        </div>
    </div>

        <div style="height:30px;">
        	<div class="top_left" style="margin-left: 10px;">총 <%= max %>건이 조회되었습니다</div>
        </div>

        <table id="rqstTable" style="table-layout: fixed;">
			<colgroup>
            	<col width="100" />
	            <col width="120" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="100" />
	            <col width="" />
	            <col width="100" />
	            <col width="100" />
	            <col width="120" />
	            <col width="120" />
<!-- 	            <col width="60" /> -->
	            <col width="90" />
            <!-- </colgroup>
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
					<th id='selectAll'>전체</th>
					<th><span id='rqst.mgr_seq' class='mngSortBtn' url='<%=url%>'>신청번호</span></th>
					<th><span id='reqst_id_rel.office_nm' class='mngSortBtn' url='<%=url%>'>소속기관</span></th>
					<th><span id='rqst.reqst_id' class='mngSortBtn' url='<%=url%>'>신청자ID</span></th>
	                <th><span id='reqst_id_rel.user_nm' class='mngSortBtn' url='<%=url%>'>신청자</span></th>
	                <th><span id='req_gbn_cd_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>신청유형</span></th>
	                <th><span id='crime_typ_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>범죄유형</span></th>
					<th><span id='rqst.cctv_list' class='mngSortBtn' url='<%=url%>'>CCTV목록</span></th>
					<th><span id='rqst.reqst_dat' class='mngSortBtn' url='<%=url%>'>신청일</span></th>
					<th><span id='rqst.acpt_dat' class='mngSortBtn' url='<%=url%>'>승인일</span></th>
					<th><span id='proc_stat_cd_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>처리상태</span></th>
					<th><span id='use_rs_cd_rel.cde_nm' class='mngSortBtn' url='<%=url%>'>활용결과</span></th>
<%-- 					<th><span id='rqst.doc_no' class='mngSortBtn' url='<%=url%>'>공문번호</span></th> --%>
<%-- 					<th><span id='rqst.doc_chng_yn' class='mngSortBtn' url='<%=url%>'>공문확인</span></th> --%>
<%-- 					<th><span id='renewAcptYn' class='mngSortBtn' url='<%=url%>'>증거</span></th> --%>
					<th>상세보기</th>
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
            	<td style="text-align: center; display: none;">
			<%-- <% if(!"15".equals(list.get(i).getReqGbnCd())){ %> --%>
            		<input type="checkbox" class="delChk" style="width: 15px; height: 15px;" value="<%=list.get(i).getMgrSeq()%>"/>
            <%-- <% } %> --%>
           		</td>
                <td class="tCenter"><%=list.get(i).getMgrSeq() %></td>
                <%if(list.get(i).getRqstOfficeNm() == null){ %>
                	<td class="tCenter">정보없음</td>
                <%} else{ %>
                	<td class="tCenter"><%=list.get(i).getRqstOfficeNm() %></td>
                <%} %>
                <td class="tCenter"><%=list.get(i).getReqstId() %></td>
                <td class="tCenter"><%=list.get(i).getReqstIdRelCdeNm() %></td>
                <td class="tCenter"><%=list.get(i).getReqGbnCdRelCdeNm() %></td>
                <td class="tCenter"><%=list.get(i).getCrimeTypRelCdeNm() %></td>
                <td class="tBlankLeft">
                    <div class="text-overflow" title="<%=list.get(i).getCctvList()%>">
                    	<%
                    	String cctvList = "";
                    	if(!"null".equals(list.get(i).getCctvList()) && list.get(i).getCctvList() != null){
                    		if(list.get(i).getCctvList().length() >40 ){
                    			cctvList=list.get(i).getCctvList().substring(0,40)+"...";
                    		}else{
                    			cctvList=list.get(i).getCctvList();
                    		}

                    	}
                    	%>
                        <%=cctvList%>
                    </div>
                </td>
                <td class="tCenter"><%=DateUtil.formatDate(list.get(i).getReqstDat(), 8) %></td>
                <td class="tCenter">
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

                <td class="tCenter">
                    <ul class="result_bar" style="">
                        <li>
                            <div class="result_type" style="">
                            </div>
                        </li>
                        <li>
                            <div class="result_type">
                            </div>
                        </li>
                        <li>
                            <div class="result_type">
                            </div>
                        </li>
                        <li>
                            <div class="result_type">
                            </div>
                        </li>
                        <li>
                        	<div style="margin-top: 5px;">
                            <%-- <div <% if ( "SD".equals(list.get(i).getProcStatCd()) ) out.print(" class=\"tool rejt_cont\" cont=\""+list.get(i).getRejtResn()+"\"  title=\""+list.get(i).getRejtResn().replaceAll("\n","<br>")+"\" "); %>> --%>
                                <label class="result_text"><%=list.get(i).getProcStatCdRelCdeNm()%></label>
                                <input type="hidden" id="procStatCd" value="<%= year%>" />
                            </div>
                        </li>
                    </ul>
                    <%-- <%=list.get(i).getProcStatCdRelCdeNam() %> --%>
                </td>
                <td class="tCenter">
                <div class="text-overflow" title="<%=list.get(i).getUseRsCdRelCdeNm()%>">
                <%

                if(!"15".equals(list.get(i).getReqGbnCd())){
	                if (list.get(i).getUseRsCdRelCdeNm() == null){
                %>
                미입력
                <%
    	            } else {
    	            String useRsCd = list.get(i).getUseRsCdRelCdeNm();
    	            if(useRsCd.length() > 10 ){
    	            	useRsCd = useRsCd.substring(0,10)+"...";
    	            }
                %>
                <%= useRsCd %>
                <%
        	        }
				}
                %>
                </div>
                </td>
                <%--<%	String docChngYn = "X";
                	String style = "white";
                	if("Y".equals(list.get(i).getDocChngYn()) ) {
                		docChngYn = "O";
                		style = "white";
                	}
                	if("15".equals(list.get(i).getReqGbnCd())){
                		docChngYn = "";
                		style = "black";
                	}
                %>
                <td class="tCenter"><%=list.get(i).getDocNo() %></td>
                <td class="tCenter">
                    <span style="color: <%=style%>"><%=docChngYn%></span>
                </td>
 				<%
 				String rewnewAcptYn = "";

 				if(!"null".equals(list.get(i).getRenewAcptYn()) && list.get(i).getRenewAcptYn() != null){
 					rewnewAcptYn = list.get(i).getRenewAcptYn();
                }
                %>
                <td class="tCenter"><%=rewnewAcptYn%></td> --%>
                <td class="tCenter">
                    <button class="btn_dtv grayBtn btn_style2" mgrseq="<%=list.get(i).getMgrSeq()%>" reqGbnCd="<%=list.get(i).getReqGbnCd()%>" stat="<%=list.get(i).getProcStatCd()%>">상세보기</button>
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


