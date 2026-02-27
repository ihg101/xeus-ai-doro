<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.smartcity.service.EventHistVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");
ArrayList<EventHistVo> list = (ArrayList<EventHistVo>)request.getAttribute("result");
HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");

String usrId = map.get("usrId");
if(usrId == null) usrId = "";
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
String evtTypCd = map.get("evtTypCd");

%>
<script type="text/javascript" src="./res/menu/historyView/geomex.xeus.history.log.js"></script>

<script type="text/javascript">
var schObj = new Object();
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";
var evtTypCd = "<%= evtTypCd %>";
schObj.usrId = '<%=usrId%>';
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
		                <option url="/log/getIfEvtLogView.do">이벤트 로그조회</option>
		                <option url="/log/getMonEvtShareLogView.do" selected>이벤트공유 로그 조회</option>
		            </select>
		            <div class="hidden" id="title" url="/log/getMonEvtShareLogView.do" excel = "EvtShare">이벤트공유 로그</div>
        		</div>
		        <div id="search">
		            <label for="startDat">발생일시</label><input id="startDat" class="keyup sendData" type="date" value="<%=startDat%>"> ~ <input id="endDat" class="keyup sendData" type="date" value="<%=endDat%>">
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
					<col width="100">
					<col width="100">
					<col width="100">
        			<col width="150">
					<col width="150">
					<col width="150">
					<col width="100">
				</colgroup>
                <thead>
                    <tr>
						<th><span id='evt_typ' class='mngSortBtn' url='/log/getMonEvtShareLogView.do'>신이벤트범주</span></th>
						<th><span id='evt_nm' class='mngSortBtn' url='/log/getMonEvtShareLogView.do'>이벤트명</span></th>
						<th><span id='evt_cntn' class='mngSortBtn' url='/log/getMonEvtShareLogView.do'>접수내용</span></th>
						<th><span id='evt_outb_dtm' class='mngSortBtn' url='/log/getMonEvtShareLogView.do'>발생일시</span></th>
						<th><span id='evt_clr_dtm' class='mngSortBtn' url='/log/getMonEvtShareLogView.do'>해제일시</span></th>
						<th><span id='evt_actn_dtm' class='mngSortBtn' url='/log/getMonEvtShareLogView.do'>조치일자</span></th>
						<th><span id='test_yn' class='mngSortBtn' url='/log/getMonEvtShareLogView.do'>모의시험여부</span></th>
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
                        <td><%= list.get(i).getEvtTyp() %></td>
                        <td><%= list.get(i).getEvtNm() %></td>
                        <td><%= list.get(i).getEvtCntn() %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getEvtOutbDtm()) %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getEvtClrDtm()) %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getEvtActnDtm()) %></td>
                        <td><%= list.get(i).getTestYn() %></td>
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
