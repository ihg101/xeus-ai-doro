<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.log.service.AccessVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");
ArrayList<AccessVo> list = (ArrayList<AccessVo>)request.getAttribute("result");
HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String limit = map.get("limit");

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
<script type="text/javascript" src="./common/sysMngSort.js"></script>
<script type="text/javascript">
var schObj = new Object();
schObj.usrId = '<%=usrId%>';
schObj.startDat = '<%=startDat%>';
schObj.endDat = '<%=endDat%>';
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";
var limit = "<%= limit %>"
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
        			<select style="width: 130px;">
						<option url="/log/getAccessView.do" selected>사용자 접속 로그조회</option>
						<option url="/log/getAuthSetLogView.do">권한 설정 로그조회</option>
					</select>
					<div class="hidden" id="title" url="/log/getAccessView.do" excel="Access">사용자 접속 로그</div>
        		</div>
        		<input id="usrId" class="keyup sendData" type="text" value="<%=usrId%>" placeholder="사용자 ID" style="width: 140px;">
        		<div id="search">
		            <label for="startDat">기간</label><input id="startDat" class="keyup sendData" type="date" value="<%=startDat%>" > ~ <input id="endDat" class="keyup sendData" type="date" value="<%=endDat%>" >

                    <label>LIMIT</label>
                    <input type="text" id="limit" class="sendData" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">

		            <button id="searchBtn" class="btn_style2">검색</button>
		            <button id="excelBtn"class="btn_Dstyle">내보내기</button>
		            <span id="count">총 <%= request.getAttribute("count") %>개의 건이 검색되었습니다.</span>
		        </div>
        	</div>
        </div>
        <div id="content" class="customScroll head_fixed">
           <table id="userList">
            <colgroup>
                    <col width="100">
                    <col width="100">
                    <col width="100">
                    <col width="150">
                    <col width="150">
                    <col width="50">
                    <col width="100">
                    <col width="100">
                </colgroup>
                <thead>
                    <tr>
<%
String targetCol="";
for(int i=0; i<column.size(); i++){
    if("xeus.mt_aces_log".equals(column.get(i).getTblId())
            && !"auth_mgr_no".equals(column.get(i).getColId())){
        String col = column.get(i).getColNm();

        if("관리순서번호".equals(col))    targetCol = "mgr_seq";
        else if("사용자ID".equals(col))    targetCol = "usr_id";
        else if("사용시간".equals(col)) targetCol = "use_time";
        else if("허용여부".equals(col)) targetCol = "allow_yn";
        else if("접속IP".equals(col)) targetCol = "conn_ip";
        else if("비고".equals(col))   targetCol = "rmark";

        col = "<span id='" + targetCol + "' class='mngSortBtn' url='/log/getAccessView.do' >" + col + "</span>";
        if("use_time".equals(targetCol)){
%>
                    <th>
                        <span id='usr.user_nm' class='mngSortBtn' url='/log/getAccessView.do' >사용자명</span>
                    </th>
                    <th>
                        <span id='usr.depart_nm' class='mngSortBtn' url='/log/getAccessView.do' >부서명</span>
                    </th>
<%      }
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
                        <td colspan="8"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <td><%= StrUtil.chkNull(list.get(i).getMgrSeq()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getUsrId()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getUserNm()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getDepartNm()) %></td>
                        <%-- <td><%= StrUtil.chkNull(list.get(i).getAuthMgrNo()) %></td> --%>
                        <td><%= DateUtil.formatDate(list.get(i).getUseTime()) %></td>
                        <td><%= list.get(i).getAllowYn() %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getConnIp()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getRmark()) %></td>
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