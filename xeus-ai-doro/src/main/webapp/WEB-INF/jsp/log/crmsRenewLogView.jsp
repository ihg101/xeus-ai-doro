<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsRqstRenewVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<CrmsRqstRenewVo> list = (ArrayList<CrmsRqstRenewVo>)request.getAttribute("result");
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
String renewTyp = map.get("renewTyp");
%>
<script type="text/javascript" src="./res/menu/historyView/geomex.xeus.history.log.js"></script>

<script type="text/javascript">
var schObj = new Object();
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";
var renewTyp = "<%= renewTyp %>";
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
		                <option url="/log/getCrmsRenewLogView.do" selected>연장신청 로그조회</option>
		                <option url="/log/getCrmsRenewEviLogView.do">증거자료신청 로그조회</option>
		                <option url="/log/getCrmsRqstReadingLogView.do">열람신청 로그조회</option>
<!-- 		                <option url="/log/getCrmsRqstCarLogView.do">차량영상반출 로그조회</option> -->
		            </select>
		            <div class="hidden" id="title" url="/log/getCrmsRenewLogView.do" excel = "Renew">연장신청 로그</div>
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
					<col width="60">
					<col width="100">
					<col width="100">
					<col width="120">
					<col width="250">
        			<col width="250">
					<col width="80">
					<col width="100">
					<col width="200">
					<col width="100">
					<col width="80">
					<col width="100">
				</colgroup>
                <thead>
                    <tr>
<%-- <%
for(int i=0; i<column.size(); i++){
    if(column.get(i).getTblId().equals("xeus.crms_rqst_renew")){
%>
                        <th><%= column.get(i).getColNm() %></th>
<%
    }
}
%> --%>
				 	<th><span id='tt.mgr_seq' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >신청번호</span></th>
	                <th><span id='rqst.reqst_id' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >신청자ID</span></th>
	                <th><span id='rqst_reqst_id_rel.user_nm' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >신청자</span></th>
	                <th><span id='rqst_crime_typ_rel.cde_nm' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >범죄유형</span></th>
		            <th><span id='cctv_no_rel.cctv_nm' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >CCTV명</span></th>
	                <th><span id='work.file_nm' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >영상파일</span></th>
	                <th><span id='avi.play_limit_cnt' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >잔여<br>재생횟수</span></th>
	                <th><span id='avi.play_limit_dat' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >재생만료일</span></th>
	                <th><span id='tt.reqst_resn' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >연장신청사유</span></th>
	                <th><span id='tt.reqst_dat' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >신청일</span></th>
	                <th><span id='tt.acpt_yn' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >승인여부</span></th>
	                <th><span id='tt.acpt_dat' class='mngSortBtn' url='/log/getCrmsRenewLogView.do' >승인일</span></th>
                    </tr>
                </thead>
                <tbody>
<%
if(list.size() == 0){
%>
                    <tr>
                        <td colspan="7"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <%-- <td><%= StrUtil.chkNull(list.get(i).getMgrSeq()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getUsrId()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getAuthMgrNo()) %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getUseTime()) %></td>
                        <td><%= list.get(i).getAllowYn() %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getConnIp()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getRmark()) %></td> --%>
                        <td><%= list.get(i).getMgrSeq() %></td>
                        <td><%= list.get(i).getRqstReqstId() %></td>
                        <td><%= list.get(i).getRqstReqstIdRelCdeNm() %></td>
                        <td><%= list.get(i).getRqstCrimeTypRelCdeNm() %></td>
                        <td>
	                        <%-- <%
				                String listStr = list.get(i).getCctvNoRelLabel();
				                if ( listStr.length() >= 100) {
				                    listStr = listStr.substring(0, 100)+"...";
				                }
			                %>
							<%= listStr %> --%>
							<div class="text-overflow" title="<%=StrUtil.chkNull(list.get(i).getCctvNoRelLabel())%>">
								<%=StrUtil.chkNull(list.get(i).getCctvNoRelLabel())%>
							</div>
                        </td>
                        <td><%= list.get(i).getWorkFileNm() %></td>
                        <%
			                String aviPlayLimitCnt = list.get(i).getAviPlayLimitCnt();
			                String playLimitCnt = list.get(i).getPlayLimitCnt();
			                String viewPlayLimitCnt ="0";
			                if(playLimitCnt == null) viewPlayLimitCnt = aviPlayLimitCnt.trim();
			                else viewPlayLimitCnt = playLimitCnt.trim();
		                %>
                        <td><%= viewPlayLimitCnt %></td>
                        <td><%= DateUtil.formatDate( list.get(i).getReqstDat(), 8 ) %></td>
                        <%-- <td><%= list.get(i).getReqstResn() %></td> --%>
                        <td>
                        	<div class="text-overflow" title="<%= list.get(i).getReqstResn() %>">
	                        	<%= list.get(i).getReqstResn() %>
                        	</div>
                        </td>
                        <td><%= DateUtil.formatDate(list.get(i).getReqstDat(), 8) %></td>
                        <td>
	                        <% if ( list.get(i).getAcptYn() == null ){ %>
			                    승인대기
		                    <% } else {
		                           if(list.get(i).getAcptYn().equals("Y")){ %>
		                    승인

		                    <% } else if (list.get(i).getAcptYn().equals("N")){ %>
		                    거절
		                    <% 	}
		                    }%>
                        </td>
                        <td>
		                    <%if( list.get(i).getAcptDat() != null ){//.trim().equals("")
			                    if ( !list.get(i).getAcptDat().trim().equals("") ){
			                %>
			                <%= DateUtil.formatDate(list.get(i).getAcptDat(), 8) %>
			                <%
			                    }
			                }
			                %>
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
