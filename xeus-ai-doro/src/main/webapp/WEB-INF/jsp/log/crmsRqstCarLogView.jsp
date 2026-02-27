<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>)request.getAttribute("result");
HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");

String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");

String reqstId = map.get("reqstId");
if(reqstId == null) reqstId = "";
String startDat = map.get("startDat");
if(startDat == null || "".equals(startDat)) {
	startDat = "";
}
else{
	startDat=startDat.substring(0,4)+"-"+startDat.substring(4,6)+"-"+startDat.substring(6,8);
}
String endDat = map.get("endDat");
if(endDat == null || "".equals(endDat)) {
	endDat = "";
}
else{
	endDat=endDat.substring(0,4)+"-"+endDat.substring(4,6)+"-"+endDat.substring(6,8);
}

String sortCntrl = map.get("sortCntrl");
String reqGbnCd = map.get("reqGbnCd");
%>
<script type="text/javascript" src="./res/menu/historyView/geomex.xeus.history.log.js"></script>

<script type="text/javascript">
var schObj = new Object();
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";
var reqGbnCd = "<%= reqGbnCd %>";
schObj.reqstId = '<%=reqstId%>';
schObj.startDat = '<%=startDat%>';
schObj.endDat = '<%=endDat%>';
</script>
<div class="contentWrapper">

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />
    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->

    <div id="wrap">
        <div id="menuWrap" class="box_style">
        	<div class="info_box wd100">
        		<div id="selector">
        			<select>
		                <option url="/log/getCrmsRqstLogView.do">영상반출신청 로그조회</option>
		                <option url="/log/getCrmsRenewLogView.do">연장신청 로그조회</option>
		                <option url="/log/getCrmsRenewEviLogView.do">증거자료신청 로그조회</option>
		                <option url="/log/getCrmsRqstReadingLogView.do">열람신청 로그조회</option>
		                <option url="/log/getCrmsRqstCarLogView.do" selected>차량영상반출 로그조회</option>
		            </select>
		            <div class="hidden" id="title" url="/log/getCrmsRqstCarLogView.do" excel = "RqstCar">차량영상반출 로그</div>
        		</div>
        		<input id="reqstId" class="keyup sendData" type="text" value="<%=reqstId%>" placeholder="신청자ID" style="width: 140px;">
		        <div id="search">
		            <label for="startDat">기간</label><input id="startDat" class="keyup sendData" type="date" value="<%=startDat%>"> ~ <input id="endDat" class="keyup sendData" type="date" value="<%=endDat%>">
		            <button id="searchBtn" class="btn_style2">검색</button>
		            <button id="excelBtn"class="btn_Dstyle">내보내기</button>
		            <span id="count">총 <%= request.getAttribute("count") %>개의 건이 검색되었습니다.</span>
		        </div>
        	</div>
        </div>
        <!-- <p class="searchTitle">
            <button class="logTab" url="/log/getAssetLogView.do" excel="Asset">시설물 관리</button>
            <button class="logTab" url="/log/getMsgLogView.do" excel="Msg">SMS</button>
            <button class="logTab" url="/log/getIf112LogView.do" excel="112">112 긴급영상 지원</button>
            <button class="logTab" url="/log/getIf112JsonLogView.do" excel="112Json">112 긴급출동 메소드 호출 현황</button>
            <button class="logTab" url="/log/getIf119LogView.do" excel="119">119 긴급출동</button>
            <button class="logTab" url="/log/getIfDscLogView.do" excel="Dsc">사회적약자</button>
            <button class="logTab" url="/log/getIfEvtLogView.do" excel="Evt">이벤트로그</button>
            <button class="logTab" active="active" url="/log/getAccessView.do" excel="Access">접근이력관리</button>
        </p> -->
        <div id="content" class="table_style customScroll">
           <table id="userList">
           		<colgroup>
					<col width="120">
					<col width="100">
					<col width="100">
					<col width="100">
					<col width="100">
        			<col width="">
					<col width="100">
					<col width="100">
					<col width="80">
					<col width="80">
				</colgroup>
                <thead>
                    <tr>
<%-- <%
for(int i=0; i<column.size(); i++){
    if(column.get(i).getTblId().equals("xeus.crms_trans_rqst")
    		&& !"doc_file_path".equals(column.get(i).getColId())
    		&& !"reqst_resn".equals(column.get(i).getColId())
    		&& !"crime_loc".equals(column.get(i).getColId())
    		&& !"rejt_typ".equals(column.get(i).getColId())
    		&& !"rejt_resn".equals(column.get(i).getColId())
    		&& !"recv_mthd".equals(column.get(i).getColId())
    		&& !"use_rs_cd".equals(column.get(i).getColId())
    		&& !"req_gbn_cd".equals(column.get(i).getColId())){
%>
                        <th><%= column.get(i).getColNm() %></th>
<%
    }
}
%> --%>
						<th><span id='rqst.mgr_seq' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >신청번호</span></th>
						<th><span id='rqst.reqst_id' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >신청자ID</span></th>
						<th><span id='reqst_id_rel.user_nm' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >신청자</span></th>
						<th><span id='rqst.reqst_detail' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >신청유형</span></th>
						<th><span id='req_gbn_cd_rel.cde_nm' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >범죄유형</span></th>
						<th><span id='rqst.cctv_list' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >CCTV목록</span></th>
						<th><span id='rqst.reqst_dat' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >신청일</span></th>
						<th><span id='rqst.acpt_dat' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >승인일</span></th>
						<th><span id='proc_stat_cd_rel.cde_nm' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >처리상태</span></th>
						<th><span id='use_rs_cd_rel.cde_nm' class='mngSortBtn' url='/log/getCrmsRqstCarLogView.do' >활용결과</span></th>
                    </tr>
                </thead>
                <tbody>
<%
if(list.size() == 0){
%>
                    <tr>
                        <td colspan="10"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <td><%= StrUtil.chkNull(list.get(i).getMgrSeq()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getReqstId()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getReqstIdRelCdeNm()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getReqstDetail()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getReqGbnCdRelCdeNm()) %></td>
                        <td>
                        	<%-- <%
			                String listStr = list.get(i).getCctvList();
			                if ( list.get(i).getCctvList().length() >= 100) {
			                    listStr = listStr.substring(0, 100)+"...";
			                }
			                %>
		                    <span>
		                        <%=listStr%>
		                    </span> --%>
		                    <div class="text-overflow" title="<%=StrUtil.chkNull(list.get(i).getCctvList())%>">
		                    	<%=StrUtil.chkNull(list.get(i).getCctvList())%>
		                    </div>
                        </td>
                        <td><%= StrUtil.chkNull(DateUtil.formatDate(list.get(i).getReqstDat(), 8)) %></td>
                        <td>
                        <%
			                if( list.get(i).getAcptDat() != null ){
			                	if ( !list.get(i).getAcptDat().trim().equals("") ){ %>
			                		<%=DateUtil.formatDate(list.get(i).getAcptDat(), 8) %>
			                <% }
			                } %>
						</td>
                        <td><%= StrUtil.chkNull(list.get(i).getProcStatCdRelCdeNm()) %></td>
                        <td>
	                        <%if (list.get(i).getUseRsCdRelCdeNm() == null){%>
	  			              미입력
			                <%} else {%>
			                	<%= list.get(i).getUseRsCdRelCdeNm() %>
			                <%}%>
                		</td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>
        </div>
        <div class="paging_wrap"></div>
    </div>
</div>
