<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.equipmgr.service.HistoryVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> chkGbn = cde.convertCodeGrpToAllCde("C04");
Set<String> chkGbnKey = chkGbn.keySet();
Iterator<String> chkGbnItr = chkGbnKey.iterator();

HashMap<String, String> chkStat = cde.convertCodeGrpToAllCde("C05");
Set<String> chkStatKey = chkStat.keySet();
Iterator<String> chkStatItr = chkStatKey.iterator();

ArrayList<HistoryVo> hist = (ArrayList<HistoryVo>) request.getAttribute("hist");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");
ArrayList<LiVo> li = (ArrayList<LiVo>) request.getAttribute("li");
%>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.nms.check.list.js"></script>
<div class="searchWrapper left">

    <p class="searchTitle">점검이력 검색</p>
    <table id="searchTable" class="searchTable">
        <tr>
            <th height="40px">읍면동</th>
            <td>
                <select id="emdCd" name="emdCd" class="wide sendData">
                    <option value="">전체</option>
<% for(int i=0; i<emd.size(); i++){ %>
                    <option value="<%= emd.get(i).getEmdCd() %>"><%= emd.get(i).getEmdKorNm() %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>관리기관</th>
            <td>
                <select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
                    <option value="">전체</option>
<% for(int i=0; i<orgz.size(); i++){ %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>시설구분</th>
            <td>
                <select id="faType" name="faType" class="wide sendData">
                    <option value="">전체</option>
                    <option value="CTV">CCTV</option>
                    <option value="SIT">사이트</option>
                    <option value="ACS">부속시설</option>
                    <option value="INF">기반시설</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>점검구분</th>
            <td>
                <select id="chkGbnCd" name="chkGbnCd" class="wide sendData">
                    <option value="">전체</option>
<% while(chkGbnItr.hasNext()){
    String str = (String)chkGbnItr.next(); %>
                    <option value="<%= str %>"><%= chkGbn.get(str) %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>정기점검명</th>
            <td>
                <select id="chkNm" name="chkNm" class="wide sendData" style="max-width: 151px;">
                    <option value="">전체</option>
<% for(int i=0; i<hist.size(); i++){ %>
                    <option value="<%= hist.get(i).getChkNm() %>"><%= hist.get(i).getChkNm() %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>진행상태</th>
            <td>
                <select id="chkStatCd" name="chkStatCd" class="wide sendData">
                    <option value="">전체</option>
<% while(chkStatItr.hasNext()){
    String str = (String)chkStatItr.next(); %>
                        <option value="<%= str %>"><%= chkStat.get(str) %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>등록일자</th>
            <td>
                <input type="text" id="sRegDat" name="sRegDat" class="wide datePicker sendData" readOnly>
            </td>
        </tr>
        <!-- <tr>
            <td>
                <input type="text" id="eRegDat" name="eRegDat" class="wide datePicker sendData">
            </td>
        </tr> -->
        <tr>
            <th>처리일자</th>
            <td>
                <input type="text" id="sWorkDat" name="sWorkDat" class="wide datePicker sendData" readOnly>
            </td>
        </tr>
        <!-- <tr>
            <td>
                <input type="text" id="eWorkDat" name="eWorkDat" class="wide datePicker sendData">
            </td>
        </tr> -->
        <tr>
            <th>등록자</th>
            <td>
                <input type="text" id="regUserId" name="regUserId" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>작업자</th>
            <td>
                <input type="text" id="workerId" name="workerId" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>명칭</th>
            <td>
                <input type="text" id="chkNm" name="chkNm" class="wide sendData">
            </td>
        </tr>
        <!-- <tr>
            <td colspan="2" class="tCenter">
                <button class="blackBtn" style="margin: 3px 0px 3px 0px;" id="searchBtn">점검이력 검색</button>
            </td>
        </tr> -->
    </table>

    <div class="btnDiv">
        <button class="blackBtn" id="searchBtn">점검이력 검색</button>
    </div>

</div>

<div class="searchResultWrapper left"></div>