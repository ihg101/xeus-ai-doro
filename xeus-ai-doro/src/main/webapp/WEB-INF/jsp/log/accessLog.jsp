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
String searchStr = map.get("usrId");
if(searchStr == null) searchStr = "";
%>
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.access.css">
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.access.js"></script>

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />
    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->

    <div id="wrap">
        <div id="title">접근이력 확인</div>
        <div id="search">
            <input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="접속자ID"><button id="searchBtn">검색</button>
            <span id="count">총 <%= request.getAttribute("count") %>개의 로그 정보가 검색되었습니다.</span>
        </div>
        <div id="content">
           <table id="list">
                <thead>
                    <tr>
<%
for(int i=0; i<column.size(); i++){
    if("xeus.mt_aces_log".equals(column.get(i).getTblId())){
%>
                        <th><%= column.get(i).getColNm() %></th>
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
                        <td><%= StrUtil.chkNull(list.get(i).getMgrSeq()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getUsrId()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getAuthMgrNo()) %></td>
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
