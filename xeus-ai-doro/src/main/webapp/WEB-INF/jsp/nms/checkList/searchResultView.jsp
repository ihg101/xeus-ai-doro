<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.equipmgr.service.HistoryVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");
HashMap<String, String> orgGbn = cde.convertCodeGrpToAllCde("C01");
Set<String> key = orgGbn.keySet();
Iterator<String> itr = key.iterator();

ArrayList<HistoryVo> list = (ArrayList<HistoryVo>) request.getAttribute("result");
HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");
/* String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp"); */
/* String searchStr = map.get("orgNm");
if(searchStr == null) searchStr = ""; */
%>
<script>
setTimeout(function(){
    var width = $(document).width() - 340;
    var height = $(document).height() - 160;
    $(".searchResultWrapper").width(width);
    $(".searchResultWrapper").find("#tableWrapper").height(height);
}, 100);

/* 검색결과 탭 버튼 이벤트 입니다. */
$(".searchTitle").find("button.tab").eq(0).click(function(){
    $('#searchBtn').click();
});

/* 취소요청관리 탭 버튼 이벤트 입니다. */
$(".searchTitle").find("button.tab").eq(1).click(function(){
    _common.callAjax("/nms/getCancelView.do", {}, function(view) {
        $(".searchResultWrapper").html(view);
    });
});

/* 상세보기 이벤트 입니다. */
$(".searchResultWrapper").find("tr.detailBtn").click(function(){
    var v = $(this).attr("k");
    var sv = $(this).attr("sk");

    _common.callAjax("/nms/getHistoryDetailView.do", {"mgrNo" : v, "faMgrNo" : sv}, function(view) {
        $(".searchResultWrapper").html(view);
    });
});
</script>

<p class="searchTitle">
    <button class="tab" active="active">검색결과</button><button class="tab">취소요청관리</button><button class="tab hidden">상세정보</button>
</p>

<div id="tableWrapper">
	<table cellspacing="0">
	    <thead>
	        <tr>
<%
for(int i=0; i<column.size(); i++){
    if("xeus.asset_hist".equals(column.get(i).getTblId())
    	&& !"mgr_no".equals(column.get(i).getColId())
    	&& !"fa_mgr_no".equals(column.get(i).getColId())
    	&& !"work_desc".equals(column.get(i).getColId())
        && !"cncl_resn".equals(column.get(i).getColId())){
%>
               <th><%= column.get(i).getColNm().replace("코드", "") %></th>
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
	        <tr class="tCenter">
	            <td colspan="19"><b>검색결과가 존재하지 않습니다.</b></td>
	        </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
	        <tr class="tCenter detailBtn" k="<%= list.get(i).getFaMgrNo() %>" sk="<%= list.get(i).getFaMgrNo() %>">
	            <%-- <td><%= list.get(i).getMgrNo() %></td>
	            <td><%= list.get(i).getFaMgrNo() %></td> --%>
	            <td><%= cde.convertCodeToName("C04", list.get(i).getChkGbnCd()) %></td>
	            <td><%= StrUtil.chkNull(list.get(i).getChkNm()) %></td>
	            <td><%= cde.convertCodeToName("C05", list.get(i).getChkStatCd()) %></td>
	            <td><%= DateUtil.formatDate(list.get(i).getRegDat()) %></td>
	            <td><%= StrUtil.chkNull(list.get(i).getRegRsn()) %></td>
	            <td><%= StrUtil.chkNull(list.get(i).getRegUserId()) %></td>
	            <td><%= DateUtil.formatDate(list.get(i).getReptDat()) %></td>
	            <td><%= DateUtil.formatDate(list.get(i).getWorkDat()) %></td>
	            <td><%= StrUtil.chkNull(list.get(i).getWorkerId()) %></td>
	            <td><%= cde.convertCodeToName("C06", list.get(i).getErrTypCd()) %></td>
	            <td><%= cde.convertCodeToName("C07", list.get(i).getChkGbnCd()) %></td>
	            <%-- <td><%= StrUtil.chkNull(list.get(i).getWorkDesc()) %></td> --%>
	            <td><%= DateUtil.formatDate(list.get(i).getCnclReqDat()) %></td>
	            <%-- <td><%= StrUtil.chkNull(list.get(i).getCnclResn()) %></td> --%>
	            <td><%= cde.convertCodeToName("C18", list.get(i).getCnclRsltCd()) %></td>
	            <td><%= StrUtil.chkNull(list.get(i).getCnclAcptId()) %></td>
	            <td><%= DateUtil.formatDate(list.get(i).getCnclAcptDat()) %></td>
	        </tr>
<%
    }
}
%>
	    </tbody>
	</table>
</div>