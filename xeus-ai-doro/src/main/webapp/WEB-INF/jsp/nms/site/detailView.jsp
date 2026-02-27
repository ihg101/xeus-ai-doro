<%@page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");

HashMap<String, String> pollTyp = cde.convertCodeGrpToAllCde("C09");
Set<String> pollKey = pollTyp.keySet();
Iterator<String> pollItr = pollKey.iterator();

HashMap<String, String> lineTyp = cde.convertCodeGrpToAllCde("C10");
Set<String> lineKey = lineTyp.keySet();
Iterator<String> lineItr = lineKey.iterator();

SiteVo vo = (SiteVo) request.getAttribute("result");
CctvVo cctv = (CctvVo) request.getAttribute("cctv");
%>
<script>
/* 상세정보 저장(수정) 이벤트 입니다. */
$("#editTable").find("#editBtn").click(function(){
	var v = $(this).parent().attr("k");
	var param = _common.utils.collectSendData("#editTable");
	param["mgrNo"] = v;

	confirm("변경된 내용을 저장하시겠습니까?", function(){
		_common.callAjax("/nms/editSite.json", param, function(json) {
			alert("저장되었습니다.");
            _common.callAjax("/nms/getSiteDetailView.do", {"k" : v}, function(view) {
            	$(".searchTitle").find(".tab").eq(0).click();
                //$(".searchWrapper").find("#detailWrapper").html(view);
            }, false);
        }, false);
	});
});

/* 삭제 버튼 이벤트 입니다. */
$("#editTable").find("#delBtn").click(function(){
    var v = $(this).parent().attr("k");
    var $tr = $(this).parent().parent();
    confirm("사이트를 삭제하시겠습니까?", function(){
    	 _common.callAjax("/image/del.json", {"refMgrNo" : v}, function(){
             _common.callAjax("/nms/delSite.json", {"k" : v}, function(json){
                 if(json.result){
                	 $("#searchTable #searchBtn").click();
                	 alert("삭제되었습니다.");
                 }
             }, false);
         }, false);
    });
});

/* 검색결과 탭 버튼 이벤트 입니다. */
$(".bottomTab").find("button.tab").eq(0).click(function(){
	var v = $(this).parent().attr("k");
	_common.callAjax("/nms/getImageTabView.do", {"k" : v}, function(view) {
        $("#bottomWrapper").html(view);
    });
}).click();

/* 취소요청관리 탭 버튼 이벤트 입니다. */
$(".bottomTab").find("button.tab").eq(1).click(function(){
	var v = $(this).parent().attr("k");
    _common.callAjax("/nms/getCctvTabView.do", {"k" : v}, function(view) {
        $("#bottomWrapper").html(view);
    });
});

/* 부속시설관리 탭 버튼 이벤트 입니다. */
$(".bottomTab").find("button.tab").eq(2).click(function(){
	var v = $(this).parent().attr("k");
    _common.callAjax("/nms/getAcsryTabView.do", {"k" : v}, function(view) {
        $("#bottomWrapper").html(view);
    });
});

/* 관리이력 탭 버튼 이벤트 입니다. */
$(".bottomTab").find("button.tab").eq(3).click(function(){
	var v = $(this).parent().attr("k");
    _common.callAjax("/nms/getSiteHistTabView.do", {"k" : v}, function(view) {
        $("#bottomWrapper").html(view);
    });
});

/* DatePicker 생성 이벤트입니다. */
$(".searchWrapper").find(".datePicker").datepicker("destroy").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yymmdd",
    showButtonPanel: true,
    beforeShowDay: $.datepicker.noBefore
});

/* MonthPicker 생성 이벤트입니다. */
$(".searchWrapper").find(".monthPicker").MonthPicker({
	MonthFormat: "yymm",
	Button: false
});
</script>
<p class="searchTitle">상세정보</p>

<div id="tableWrapper">
	<table id="editTable">
	   <tr>
	       <th>사이트명</th>
	       <td colspan="3">
	           <input type="text" class="wide sendData" id="siteNm" name="siteNm" value="<%= StrUtil.chkNull(vo.getSiteNm()) %>">
	       </td>
	       <th>관리기관</th>
	       <td>
	           <select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
<% for(int i=0; i<orgz.size(); i++){
    String selected = "";
    if(orgz.get(i).getOrgMgrNo().equals(vo.getOrgMgrNo())) selected = "selected"; %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>" <%= selected %>><%= orgz.get(i).getOrgNm() %></option>
<% } %>
               </select>
	       </td>
	       <th>폴구분</th>
	       <td>
	           <select id="pollGbnCd" name="pollGbnCd" class="wide sendData">
                    <option value=""></option>
<% while(pollItr.hasNext()){
    String selected = "";
    String str = (String) pollItr.next();
    if(str.equals(vo.getPollGbnCd())) selected = "selected"; %>
                    <option value="<%= str %>" <%= selected %>><%= pollTyp.get(str) %></option>
<% } %>
               </select>
	       </td>
	   </tr>

	   <tr>
	       <th>설치일자</th>
	       <td colspan="3">
	           <input type="text" class="wide pointer datePicker sendData" id="instDat" name="instDat" value="<%= StrUtil.chkNull(vo.getInstDat()) %>" readonly="readonly">
	       </td>
	       <th>설치업체</th>
	       <td colspan="3">
	           <select id="instMgrNo" name="instMgrNo" class="wide sendData">
                    <option value=""></option>
<% for(int i=0; i<orgz.size(); i++){
    String selected = "";
    if(orgz.get(i).getOrgMgrNo().equals(vo.getInstMgrNo())) selected = "selected"; %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>" <%= selected %>><%= orgz.get(i).getOrgNm() %></option>
<% } %>
               </select>
	       </td>
	   </tr>

	   <tr>
	       <th>통신사</th>
	       <td>
	           <select id="comMgrNo" name="comMgrNo" class="wide sendData">
                    <option value=""></option>
<% for(int i=0; i<orgz.size(); i++){
    String selected = "";
    if(orgz.get(i).getOrgMgrNo().equals(vo.getComMgrNo())) selected = "selected"; %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>" <%= selected %>><%= orgz.get(i).getOrgNm() %></option>
<% } %>
               </select>
	       </td>
	       <th>회선번호</th>
	       <td>
	           <input type="text" class="wide sendData" id="comLineNo" name="comLineNo" value="<%= StrUtil.chkNull(vo.getComLineNo()) %>">
	       </td>
	       <th>개통일</th>
	       <td>
	           <input type="text" class="wide pointer monthPicker sendData" id="comOpenDat" name="comOpenDat" maxlength="6"  value="<%= StrUtil.chkNull(vo.getComOpenDat()) %>" readonly="readonly">
	       </td>
	       <th>약정만료일</th>
	       <td>
	           <input type="text" class="wide pointer monthPicker sendData" id="comExprDat" name="comExprDat" maxlength="6" value="<%= StrUtil.chkNull(vo.getComExprDat()) %>" readonly="readonly">
	       </td>
	   </tr>

	   <tr>
	       <th>수전방식</th>
	       <td colspan="3">
               <select id="lineGbnCd" name="lineGbnCd" class="wide sendData">
                    <option value=""></option>
<% while(lineItr.hasNext()){
    String selected = "";
    String str = (String) lineItr.next();
    if(str.equals(vo.getLineGbnCd())) selected = "selected"; %>
                    <option value="<%= str %>" <%= selected %>><%= lineTyp.get(str) %></option>
<% } %>
               </select>
	       </td>
	       <th>한전고객번호</th>
	       <td colspan="3">
	           <input type="text" class="wide sendData" id="kepcoCustNo" name="kepcoCustNo" value="<%= StrUtil.chkNull(vo.getKepcoCustNo()) %>">
	       </td>
	   </tr>

	   <%-- <tr>
	       <th>지번주소</th>
	       <td colspan="3">
	           <input type="text" class="wide" value="<%= cctv != null ? cctv.getAddr() : "" %>">
	       </td>
	       <th>도로명주소</th>
	       <td colspan="3">
	           <input type="text" class="wide" value="">
	       </td>
	   </tr> --%>

	   <tr>
	       <th>위치설명</th>
	       <td colspan="3">
	           <input type="text" class="wide sendData" id="locDesc" name="locDesc" value="<%= StrUtil.chkNull(vo.getLocDesc()) %>">
	       </td>
	       <th>비고</th>
	       <td colspan="3">
	           <input type="text" class="wide sendData" id="rmark" name="rmark" value="<%= StrUtil.chkNull(vo.getRmark()) %>">
	       </td>
	   </tr>

	   <tr>
	       <td class="tCenter" style="border-bottom: none; margin-top: 3px;" colspan="8" k="<%= vo.getMgrNo() %>">
	           <button class="blackBtn" id="editBtn">저장</button>
	           <button class="blackBtn" style="margin-top: 3px;" id="delBtn">삭제</button>
	       </td>
	   </tr>

	</table>

	<%-- <p class="searchTitle bottomTab" k="<%= vo.getMgrNo() %>">
        <button class="tab" active="active">현장이미지</button><button class="tab">카메라</button><button class="tab">부속시설</button><button class="tab">관리이력</button>
    </p>
    <div id="bottomWrapper"></div> --%>
</div>