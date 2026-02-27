<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.sysmgr.service.CodeVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");
ArrayList<CodeVo> list = (ArrayList<CodeVo>) request.getAttribute("result");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String searchStr = map.get("cdeNm");
String gbn = map.get("gbn");
if(searchStr == null) searchStr = "";
%>
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.code.css">
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.code.js"></script>
<script type="text/javascript">
var cdeNm = "<%=searchStr%>";
var offset="<%= offset %>";
var gbn = '<%=gbn%>';

_common.callAjax("/sysMng/getBasicTopMenuView.do", {'gbn': gbn}, function(view) {
	$(".contentWrapper").find("#menuWrap").html('');
	$(".contentWrapper").find("#menuWrap").html(view);
});
</script>

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->

    <div id="wrap">
    	<div id="menuWrap">
        </div>
        <div id="title">코드관리</div>
        <div id="search">
            <input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="코드명"><button id="searchBtn">검색</button>
            <button id="addBtn">신규추가</button>
            <span id="count">총 <%= request.getAttribute("count") %>개의 기관 정보가 검색되었습니다.</span>
        </div>
        <div id="content">
           <table id="list">
                <thead>
                    <tr>
<%
for(int i=0; i<column.size(); i++){
	if("xeus.mt_cmm_cde".equals(column.get(i).getTblId())){
%>
                        <th><%= column.get(i).getColNm() %></th>
<%
	}
}
%>
                        <th>관리</th>
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
                        <td><%= list.get(i).getGrpCde() %></td>
                        <td><%= list.get(i).getGrpNm() %></td>
                        <td><%= list.get(i).getCdeCde() %></td>
                        <td><%= list.get(i).getCdeNm() %></td>
                        <td><button class="mngBtn btn_style2" grp="<%= list.get(i).getGrpCde() %>" k="<%= list.get(i).getCdeCde() %>">변경</button></td>
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

<div class="bpopup" id="edit_pop_wrap">
    <div id="bpop_wrap">
        <h2 id="bpop_title">코드 관리</h2>
        <table>
            <tr>
                <th class="top">코드그룹코드</th>
                <td>
                    <input type="text" class="sendData" id="grpCde" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">코드그룹명</th>
                <td>
                    <input type="text" class="sendData" id="grpNm" />
                </td>
            </tr>
            <tr>
                <th class="top">코드</th>
                <td>
                    <input type="text" class="sendData" id="cdeCde" />
                </td>
            </tr>
            <tr>
                <th class="top">코드명</th>
                <td>
                    <input type="text" class="sendData" id="cdeNm" />
                </td>
            </tr>
        </table>
        <table>
            <tr align="center">
                <td class="lastTd" colspan="2" style="border: 0 !important;">
                    <button id="saveBtn" class="btn_style2" tabindex="4">저장</button>
                    <button id="delBtn" class="btn_Dstyle2" tabindex="4">삭제</button>
                    <button id="closeEditPop" class="btn_Dstyle2" class="bpopClose" tabindex="5">취소</button>
                </td>
            </tr>
        </table>
    </div>
</div>

