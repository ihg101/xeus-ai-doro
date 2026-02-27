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

HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");
String cnclRsltCd = map.get("cnclRsltCd");

ArrayList<HistoryVo> list = (ArrayList<HistoryVo>) request.getAttribute("result");
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

/* 취소요청관리 구분 변경 이벤트 입니다. */
$(".searchResultWrapper").find("#cnclRsltCd").change(function(){
	var val = $(this).val();
    _common.callAjax("/nms/getCancelView.do", {"cnclRsltCd" : val}, function(view) {
        $(".searchResultWrapper").html(view);
    });
});

/* 취소 승인 및 거절 버튼 이벤트 입니다. */
$(".searchResultWrapper").find("#passBtn, #cnclBtn").click(function(){
	var param = {
		"mgrNo" : $(this).parent().attr("k"),
		"faMgrNo" : $(this).parent().attr("sk"),
		"cnclRsltCd" : $(this).attr("v"),
		"cnclAcptDat" : new Date().getYMDHMS(),
		"cnclAcptId" : "<%= userId %>"
	}
    _common.callAjax("/nms/editHistoryAttr.json", param, function(json){
        if(json.result){
            alert("변경되었습니다.");

        	$(".searchTitle").find("button.tab").eq(1).click();
        }
    });
});
</script>

<p class="searchTitle">
    <button class="tab">검색결과</button><button class="tab" active="active">취소요청관리</button><button class="tab hidden">상세정보</button>
</p>

<div id="tableWrapper">
    <div style="margin-bottom:5px;">
        <span>취소요청 구분</span>
        <select id="cnclRsltCd">
            <option value="">전체</option>
            <option value="11" <%= ("11".equals(cnclRsltCd))? "selected" : "" %>>승인</option>
            <option value="12" <%= ("12".equals(cnclRsltCd))? "selected" : "" %>>거절</option>
        </select>
    </div>
	<table>
	    <thead>
	        <tr>
               <!-- <th>요청자</th> -->
               <th>요청일</th>
               <th>요청승인상태</th>
               <th>취소요청사유</th>
               <th>관리</th>
	        </tr>
	    </thead>
	    <tbody>
<%
if(list.size() == 0){
%>
	        <tr class="tCenter">
	            <td colspan="4"><p style="padding: 150px 0px;"><b>결과가 존재하지 않습니다.</b></p></td>
	        </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
    	String state = cde.convertCodeToName("C18", list.get(i).getCnclRsltCd());
    	if("".equals(state)) state = "대기";
%>
	        <tr class="tCenter">
	            <%-- <td><%= StrUtil.chkNull(list.get(i).getWorkerId()) %></td> --%>
	            <td><%= DateUtil.formatDate(list.get(i).getCnclReqDat()) %></td>
	            <td><%= state %></td>
	            <td><%= StrUtil.chkNull(list.get(i).getCnclResn()) %></td>
	            <td k="<%= list.get(i).getFaMgrNo() %>" sk="<%= list.get(i).getFaMgrNo() %>">
	               <button class="greenBtn" id="passBtn" v="11">승인</button>
	               <button class="redBtn" id="cnclBtn" v="12">거절</button>
	            </td>
	        </tr>
<%
    }
}
%>
	    </tbody>
	</table>
</div>