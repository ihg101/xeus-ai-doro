<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.equipmgr.service.HistoryVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

ArrayList<HistoryVo> hist = (ArrayList<HistoryVo>) request.getAttribute("hist");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");
ArrayList<LiVo> li = (ArrayList<LiVo>) request.getAttribute("li");
%>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.nms.periodic.reg.js"></script>
<div class="searchWrapper" onselectstart="return false">

    <p class="searchTitle">
        <button class="tab" url="/nms/getCallRegView.do">요청점검</button><button class="tab" active="active" url="/nms/getPeriodicRegView.do">정기점검</button>
    </p>
    <table id="searchTable" class="searchTable">
        <tr>
            <th>읍면동</th>
            <td>
                <select id="emdCd" name="emdCd" class="sendData">
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
                <select id="orgMgrNo" name="orgMgrNo" class="sendData">
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
                <select id="objType" name="objType" class="sendData">
                    <option value="ALL">전체</option>
                    <option value="CTV">CCTV</option>
                    <option value="SIT">사이트</option>
                    <option value="ACS">부속시설</option>
                    <option value="INF">기반시설</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>명칭</th>
            <td>
                <input type="text" id="objName" name="objName" class="wide sendData">
            </td>
        </tr>
        <!-- <tr>
            <td colspan="2" class="tCenter">
                <button class="blackBtn" style="margin: 3px 0px 3px 0px;" id="searchBtn">시설 목록 갱신</button>
            </td>
        </tr> -->
    </table>

    <div class="btnDiv">
        <button class="blackBtn" id="searchBtn">시설 목록 갱신</button>
    </div>

    <p class="searchTitle">시설 목록</p>
    <table id="listTable" class="searchTable">
        <tr>
            <th width="85px" rowspan="2">정기점검 명</th>
            <td colspan="3">
                <select id="chkNm">
                    <option value="">선택해주세요.</option>
<% for(int i=0; i<hist.size(); i++){ %>
                    <option value="<%= hist.get(i).getChkNm() %>"><%= hist.get(i).getChkNm() %></option>
<% } %>
                </select>
            </td>
            <td class="hidden"><button class="blackBtn" id="histBtn">보기</button></td>
        </tr>
        <tr>
            <td colspan="2"><input type="text" id="newChkNm" class="wide"></td>
            <td width="40px"><button class="blackBtn" style="margin-left:3px;" id="saveBtn">생성</button></td>
        </tr>
    </table>

    <div style="text-align:right; padding: 10px;">
        <button class="blackBtn" id="delBtn">선택삭제</button>
        <button class="blackBtn" id="editBtn">저장</button>
    </div>

    <table>
        <!-- <tr>
            <td colspan="4" class="tRight noneBack">
                <button class="blackBtn" style="margin: 3px 0px 3px 0px;" id="delBtn">선택삭제</button>
                <button class="blackBtn" style="margin: 3px 0px 3px 1px;" id="editBtn">저장</button>
            </td>
        </tr> -->
        <tr>        
            <th width="25px"><input type="checkbox" id="allToggle"></th>
            <th width="50px">구분</th>
            <th width="200px">명칭</th>
            <th>상태</th>
        </tr>
    </table>
    <div id="resultList">
	    <table></table>
    </div>

</div>