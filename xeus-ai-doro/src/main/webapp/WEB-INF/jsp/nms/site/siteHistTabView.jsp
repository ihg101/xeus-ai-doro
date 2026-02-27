<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteHistVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C08");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<SiteHistVo> list = (ArrayList<SiteHistVo>) request.getAttribute("result");
%>
<script>
/* 명칭 엔터키 이벤트 입니다. */
$("#bottomWrapper").find("#histNote").keyup(function(e){
    if(e.which == 13){
    	$("#bottomWrapper").find("#regBtn").click();
    }
});

/* 등록 버튼 이벤트 입니다. */
$("#bottomWrapper").find("#regBtn").click(function(){
    var param = _common.utils.collectSendData("#bottomWrapper #regTable");

    confirm("관리이력을 추가하시겠습니까?", function(){
        _common.callAjax("/nms/addSiteHist.json", param, function(json){
             if(json.result) $(".bottomTab").find("button.tab").eq(3).click();
         }, false);
    });
});

/* 삭제 버튼 이벤트 입니다. */
$("#bottomWrapper").find(".delBtn").click(function(){
    var v = $(this).attr("k");

    confirm("관리이력을 삭제하시겠습니까?", function(){
    	_common.callAjax("/nms/delSiteHist.json", {"k" : v}, function(json){
            if(json.result) $(".bottomTab").find("button.tab").eq(3).click();
        }, false);
    });
});

/* MonthPicker 생성 이벤트입니다. */
$(".searchWrapper").find(".monthPicker").MonthPicker({
    MonthFormat: "yymm",
    Button: false
});
</script>
<style>
.contentTh {
    width: 730px;
}
.contentTh > span {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 730px;
}
</style>
    <p class="searchTitle">관리이력 등록</p>
    <table id="regTable">
        <tr>
            <td>
                <input type="hidden" id="mgrNo" name="mgrNo" class="sendData" value="<%= map.get("mgrNo") %>">
            </td>
            <th>이력일자</th>
            <td>
                <input type="text" id="histDat" name="histDat" class="pointer sendData monthPicker" readonly="readonly">
            </td>
            <th>이력구분</th>
            <td>
                <select id="histGbnCd" name="histGbnCd" class="wide sendData">
                    <option value=""></option>
<% while(gbnItr.hasNext()){
    String str = (String) gbnItr.next(); %>
                    <option value="<%= str %>"><%= gbn.get(str) %></option>
<% } %>
                </select>
            </td>
            <th>내용</th>
            <td>
                <input type="text" id="histNote" name="histNote" class="sendData">
            </td>
            <td>
                <button class="blueBtn" id="regBtn">등록</button>
            </td>
        </tr>
    </table>

    <p class="searchTitle">사이트 관리이력</p>
    <table>
        <tr>
            <th>이력일자</th>
            <th>이력구분</th>
            <th>등록자</th>
            <th class="contentTh">내용</th>
            <th>삭제</th>
        </tr>
<% if(list.size() == 0){ %>
        <tr>
            <td class="tCenter" colspan="5">
			    <p style="padding: 100px 0px;"><b>등록된 관리이력이 존재하지 않습니다.</b></p>
            </td>
        </tr>
<% } %>
<% for(int i=0; i<list.size(); i++){ %>
        <tr class="tCenter">
            <td><%= DateUtil.formatDate(list.get(i).getHistDat()) %></td>
            <td><%= cde.convertCodeToName("C08", list.get(i).getHistGbnCd()) %></td>
            <td><%= list.get(i).getWriterId() %></td>
            <td class="contentTh"><span><%= list.get(i).getHistNote() %></span></td>
            <td><button class="blueBtn delBtn" k="<%= list.get(i).getMgrSeq() %>">삭제</button></td>
        </tr>
<% } %>
    </table>
