<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.log.service.MonStillCutLogVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");
ArrayList<MonStillCutLogVo> list = (ArrayList<MonStillCutLogVo>)request.getAttribute("result");
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
%>
<script type="text/javascript" src="./res/menu/historyView/geomex.xeus.history.log.js"></script>

<script type="text/javascript">
var schObj = new Object();
schObj.usrId = '<%=usrId%>';
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

    <div id="wrap">
        <div id="menuWrap" class="box_style">
        	<div class="info_box wd100">
        		<div id="selector">
        			<select>
		                <option url="/log/getMonCctvLogView.do">영상조회 로그조회</option>
		                <option url="/log/getMonPrevLogView.do">선영상 조회 로그조회</option>
		                <option url="/log/getAssetStatusLogView.do">이상상태로그기록조회</option>
		                <option url="/log/getStillCutLogView.do" selected>CCTV 스틸컷 로그조회</option>
		            </select>
			        <div class="hidden" id="title" url="/log/getStillCutLogView.do" excel = "StillCut">CCTV 스틸컷 로그</div>
        		</div>
        		<input id="usrId" class="keyup sendData" type="text" value="<%=usrId%>" placeholder="사용자 ID" style="width: 140px;">
		        <div id="search">		            
		            <label for="startDat">기간</label><input id="startDat" class="keyup sendData" type="date" value="<%=startDat%>" > ~ <input id="endDat" class="keyup sendData" type="date" value="<%=endDat%>">
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
				</colgroup>
                <thead>
                    <tr>
<%
String targetCol="";
for(int i=0; i<column.size(); i++){
    if("xeus.mon_stillcut_log".equals(column.get(i).getTblId())){
		String col = column.get(i).getColNm();

		if(col.equals("관리순서번호"))	targetCol = "mgr_seq";
		else if(col.equals("사용자ID"))	targetCol = "user_id";
		else if(col.equals("CCTV관리번호"))	targetCol = "cctv_mgr_no_rel.cctv_nm";
		else if(col.equals("썸네일이미지"))	targetCol = "thumb_img";
		else if(col.equals("저장일시"))	targetCol = "down_dat";

		col = "<span id='" + targetCol + "' class='mngSortBtn' url='/log/getStillCutLogView.do' >" + col + "</span>";
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
                        <td colspan="7"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <td><%= list.get(i).getMgrSeq() %></td>
                        <td><%= list.get(i).getUserId() %></td>
                        <td><%= list.get(i).getCctvMgrNo() %></td>
                        <td><%-- <%= list.get(i).getThumbImg() %> --%></td>
                        <td><%= DateUtil.formatDate(list.get(i).getDownDat()) %></td>
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
