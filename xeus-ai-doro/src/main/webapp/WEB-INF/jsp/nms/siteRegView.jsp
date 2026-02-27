<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ include file="../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> pollTyp = cde.convertCodeGrpToAllCde("C09");
Set<String> pollKey = pollTyp.keySet();
Iterator<String> pollItr = pollKey.iterator();

HashMap<String, String> lineTyp = cde.convertCodeGrpToAllCde("C10");
Set<String> lineKey = lineTyp.keySet();
Iterator<String> lineItr = lineKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
%>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.nms.site.js"></script>
<div class="overflow searchWrapper" onselectstart="return false">

    <p class="searchTitle">
	    <button class="tab" url="/nms/getSiteManageView.do" size="1100">검색</button><button class="tab" active="active" url="/nms/getSiteRegView.do" size="450">신규등록</button>
	</p>
	<table id="regTable" class="searchTable">
	   <tr>
            <th>사이트명</th>
            <td>
                <input type="text" id="siteNm" name="siteNm" class="wide sendData" value="">
            </td>
	   </tr>
	   <tr>
            <th>관리기관</th>
            <td>
                <select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
                    <option value=""></option>
<% for(int i=0; i<orgz.size(); i++){ %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
	   </tr>
	   <tr>
            <th>폴구분</th>
            <td>
                <select id="pollGbnCd" name="pollGbnCd" class="wide sendData">
                    <option value=""></option>
<% while(pollItr.hasNext()){
    String str = (String) pollItr.next(); %>
                    <option value="<%= str %>"><%= pollTyp.get(str) %></option>
<% } %>
               </select>
            </td>
	   </tr>
	   <tr>
            <th>설치일자</th>
            <td>
                <input type="text" id="instDat" name="instDat" class="wide sendData datePicker" readonly="readonly">
            </td>
	   </tr>
	   <tr>
            <th>설치업체</th>
            <td>
                <select id="instMgrNo" name="instMgrNo" class="wide sendData">
                    <option value=""></option>
<% for(int i=0; i<orgz.size(); i++){ %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
	   </tr>
	   <tr>
            <th>통신사</th>
            <td>
                <select id="comMgrNo" name="comMgrNo" class="wide sendData">
                    <option value=""></option>
<% for(int i=0; i<orgz.size(); i++){ %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
	   </tr>
	   <tr>
            <th>통신사 회선번호</th>
            <td>
                <input type="text" id="comLineNo" name="comLineNo" class="wide sendData">
            </td>
	   </tr>
	   <tr>
            <th>통신 개통일</th>
            <td>
                <input type="text" id="comOpenDat" name="comOpenDat" class="wide sendData monthPicker" readonly="readonly">
            </td>
	   </tr>
	   <tr>
            <th>통신 약정만료일</th>
            <td>
                <input type="text" id="comExprDat" name="comExprDat" class="wide sendData monthPicker" readonly="readonly">
            </td>
	   </tr>
	   <tr>
            <th>수전방식</th>
            <td>
                <select id="lineGbnCd" name="lineGbnCd" class="wide sendData">
                    <option value=""></option>
<% while(lineItr.hasNext()){
    String str = (String) lineItr.next(); %>
                    <option value="<%= str %>"><%= lineTyp.get(str) %></option>
<% } %>
               </select>
            </td>
	   </tr>
	   <tr>
            <th>한전고객번호</th>
            <td>
                <input type="text" id="kepcoCustNo" name="kepcoCustNo" class="wide sendData">
            </td>
	   </tr>
	   <tr>
            <th>비고</th>
            <td>
                <input type="text" id="rmark" name="rmark" class="wide sendData">
            </td>
	   </tr>
	   <tr>
            <th>위치설명</th>
            <td>
                <input type="text" id="locDesc" name="locDesc" class="wide sendData">
            </td>
	   </tr>
	   <tr>
            <td colspan="2" class="tCenter" style="border-bottom: none;">
                <button class="blackBtn" id="cnclBtn">취소</button>
                <button class="blackBtn" style="margin-top: 3px;" id="regBtn">신규등록</button>
            </td>
	   </tr>
	</table>

</div>