<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.log.service.MsgLogVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<MsgLogVo> list = (ArrayList<MsgLogVo>) request.getAttribute("result");
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


String rcvId = map.get("rcvId");
if(rcvId == null) rcvId = "";
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

%>
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.log.css">
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.system.mng.log.js"></script>
<script type="text/javascript">

var schObj = new Object();

schObj.rcvId = '<%=rcvId%>';
schObj.startDat = '<%=startDat%>';
schObj.endDat = '<%=endDat%>';

</script>
<div>
    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->

    <div id="wrap">
        <p class="searchTitle">
            <button class="logTab" url="/log/getAssetLogView.do" excel="Asset">시설물 관리</button>
            <button class="logTab" active="active" url="/log/getMsgLogView.do" excel="Msg">SMS</button>
            <button class="logTab" url="/log/getIf112LogView.do" excel="112">112 긴급영상 지원</button>
            <button class="logTab" url="/log/getIf112JsonLogView.do" excel="112Json">112 긴급출동 메소드 호출 현황</button>
            <button class="logTab" url="/log/getIf119LogView.do" excel="119">119 긴급출동</button>
            <button class="logTab" url="/log/getIfDscLogView.do" excel="Dsc">사회적약자</button>
            <button class="logTab" url="/log/getIfEvtLogView.do" excel="Evt">이벤트로그</button>
            <button class="logTab" url="/log/getAccessView.do" excel="Access">접근이력관리</button>
        </p>
        <div id="title">SMS 전송 이력 조회</div>
        <div id="search">
            <span>수신자 : </span><input id="rcvId" class="keyup sendData" type="text" value="<%=rcvId%>" placeholder="수신자 ID">
            <span>기간 : </span><input id="startDat" class="keyup sendData datePicker" type="text" value="<%=startDat%>" readonly> ~ <input id="endDat" class="keyup sendData datePicker" type="text" value="<%=endDat%>" readonly>
            <button id="searchBtn" class="paleBtn">검색</button>
            <button id="excelBtn"class="paleBtn">내보내기</button>
            <span id="count">총 <%= request.getAttribute("count") %>개의 건이 검색되었습니다.</span>
        </div>
        <div id="content">
           <table id="userList">
                <thead>
                    <tr>
<%
for(int i=0; i<column.size(); i++){
    if("xeus.mt_msg_log".equals(column.get(i).getTblId())){
        String col = column.get(i).getColNm();
        if(col != null){
            if(col.equals("수신자ID")) col = "수신자";
            else if(col.equals("송신자ID")) col = "송신자";
%>
                        <th><%= col %></th>
<%
        }
    }
}
%>
                        <th>상세</th>
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
                        <td><%= list.get(i).getMgrSeq() %></td>
                        <td><%= list.get(i).getSenderId() %></td>
                        <td><%= list.get(i).getRecvId() %></td>
                        <td><%= list.get(i).getRecvNum() %></td>
                        <td><%= list.get(i).getSendTyp() %></td>
                        <%
                            String sendMsg = list.get(i).getSendMsg();
                            if( sendMsg.length() > 10 ) sendMsg = sendMsg.substring(0, 10) + "...";
                        %>
                        <td><%= sendMsg %></td>
                        <td><%= DateUtil.formatDate(list.get(i).getSendDt()) %></td>
                        <%
                            String sendRslt = "";
                            if( list.get(i).getSendRslt().equals("S0")) sendRslt = "성공";
                            //else if
                            else sendRslt = "실패";
                        %>
                        <td><%= sendRslt %></td>
                        <td><%= list.get(i).getRsltDesc() %></td>
                        <td><button class="mngBtn smsDetailBtn" k="<%= list.get(i).getMgrSeq() %>"></button></td>
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
