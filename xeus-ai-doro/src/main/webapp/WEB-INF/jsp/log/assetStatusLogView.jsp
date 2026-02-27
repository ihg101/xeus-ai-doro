<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.equipmgr.service.StatusHistVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<StatusHistVo> list = (ArrayList<StatusHistVo>) request.getAttribute("result");
ArrayList<AuthGrpVo> auth = (ArrayList<AuthGrpVo>) request.getAttribute("auth");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");

/* CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
HashMap<String, String> cdeGrp = cde.convertCodeGrpToAllCde("C02"); */
/* Set<String> key = cdeGrp.keySet();
Iterator<String> itr = key.iterator(); */

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");

String assetMgrNo = map.get("assetMgrNo");
if(assetMgrNo == null) assetMgrNo = "";
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
%>
<script type="text/javascript" src="./res/menu/historyView/geomex.xeus.history.log.js"></script>

<script type="text/javascript">

var schObj = new Object();

schObj.assetMgrNo = '<%=assetMgrNo%>';
schObj.startDat = '<%=startDat%>';
schObj.endDat = '<%=endDat%>';
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";

</script>
<div class="contentWrapper">

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->


    <div>
    </div>
    <div id="wrap">
        <div id="menuWrap" class="box_style">
        	<div class="info_box wd100">
        		<div id="selector">
        			<select>
		                <option url="/log/getMonCctvLogView.do">영상조회 로그조회</option>
		                <option url="/log/getMonPrevLogView.do">선영상 조회 로그조회</option>
		                <option url="/log/getAssetStatusLogView.do" selected>이상상태로그기록조회</option>
		                <option url="/log/getStillCutLogView.do">CCTV 스틸컷 로그조회</option>
		            </select>
		            <div class="hidden" id="title" url="/log/getAssetStatusLogView.do" excel = "AssetStatus">이상상태로그기록 조회</div>
        		</div>
        		<input id="assetMgrNo" class="keyup sendData" type="text" value="<%=assetMgrNo%>" placeholder="장비관리번호" style="width: 140px;">
		        <div id="search">		            
		            <label for="startDat">기간</label><input id="startDat" class="keyup sendData" type="date" value="<%=startDat%>"> ~ <input id="endDat" class="keyup sendData" type="date" value="<%=endDat%>">
		            <button id="searchBtn" class="btn_style2">검색</button>
		            <button id="excelBtn"class="btn_Dstyle">내보내기</button>
		            <span id="count">총 <%= request.getAttribute("count") %>개의 건이 검색되었습니다.</span>
		        </div>
        	</div>
        </div>
        <!-- <p class="searchTitle">
            <button class="logTab" active="active" url="/log/getAssetLogView.do" excel="Asset">시설물 관리</button>
            <button class="logTab" url="/log/getMsgLogView.do" excel="Msg">SMS</button>
            <button class="logTab" url="/log/getIf112LogView.do" excel="112">112 긴급영상 지원</button>
            <button class="logTab" url="/log/getIf112JsonLogView.do" excel="112Json">112 긴급출동 메소드 호출 현황</button>
            <button class="logTab" url="/log/getIf119LogView.do" excel="119">119 긴급출동</button>
            <button class="logTab" url="/log/getIfDscLogView.do" excel="Dsc">사회적약자</button>
            <button class="logTab" url="/log/getIfEvtLogView.do" excel="Evt">이벤트로그</button>
            <button class="logTab" url="/log/getAccessView.do" excel="Access">접근이력관리</button>
        </p> -->
        <div id="content" class="table_style customScroll">
        	<colgroup>
					<col width="100">
					<col width="150">
					<col width="100">
        			<col width="100">
					<col width="100">
					<col width="150">
			</colgroup>
           <table id="userList">
                <thead>
                    <tr>
<%
String targetCol="";
for(int i=0; i<column.size(); i++){
    if("xeus.asset_status_hist".equals(column.get(i).getTblId())
    		&& !"state_json".equals(column.get(i).getColId())){
		String col = column.get(i).getColNm();

		if("관리순서번호".equals(col))	targetCol = "mgr_seq";
		else if("장비관리번호".equals(col))	targetCol = "asset_mgr_no";
		else if("상태코드".equals(col))	targetCol = "state_cd";
		else if("CPU점유율".equals(col))	targetCol = "state_cpu";
		else if("메모리사용률".equals(col))	targetCol = "state_mem";
		else if("상태수신일자".equals(col))	targetCol = "recv_dat";

		col = "<span id='" + targetCol + "' class='mngSortBtn' url='/log/getAssetStatusLogView.do' >" + col + "</span>";
%>
                        <th><%= col %></th>
<%
    }
}
%>
                    </tr>
                </thead>
                <tbody>
<%
if(list.size() == 0){
%>
                    <tr>
                        <td colspan="5"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <td><%= list.get(i).getMgrSeq() %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getAssetMgrNo()) %></td>
                        <td><%= list.get(i).getStateCd() %></td>
                        <td><%= list.get(i).getStateCpu() %></td>
                        <td><%= list.get(i).getStateMem() %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getRecvDat()) %></td>
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
