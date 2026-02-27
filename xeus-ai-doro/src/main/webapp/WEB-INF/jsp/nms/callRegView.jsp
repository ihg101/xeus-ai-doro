<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");
ArrayList<LiVo> li = (ArrayList<LiVo>) request.getAttribute("li");
%>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.nms.call.reg.js"></script>
<div class="searchWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">

    <div class="dropBox">이곳에 드롭 해주세요!</div>

    <p class="searchTitle">
        <button class="tab" active="active" url="/nms/getCallRegView.do">요청점검</button><button class="tab" url="/nms/getPeriodicRegView.do">정기점검</button>
    </p>
    <table id="regTable" class="searchTable">
        <tr>
            <th>시설구분</th>
            <td><input type="text" class="wide sendData" id="objType" readonly="readonly"></td>
        </tr>
        <tr>
            <th>명칭</th>
            <td><input type="text" class="wide sendData" id="objName" readonly="readonly"></td>
        </tr>
        <tr>
            <th>장애내용</th>
            <td><input type="text" class="wide sendData" id="chkNm"></td>
        </tr>
        <tr>
            <th colspan="2">지도에서 심볼을 드래그&드롭 하여 추가 하실 수 있습니다.</th>
        </tr>
        <!-- <tr>
            <td colspan="2" class="tCenter"><button class="blackBtn" id="regBtn">요청점검 등록</button></td>
        </tr> -->
    </table>
    <div class="btnDiv">
        <button class="blackBtn" id="regBtn">요청점검 등록</button>
    </div>

    <p class="searchTitle">시설 검색</p>
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
                <button class="blackBtn" id="searchBtn">검색</button>
            </td>
        </tr> -->
    </table>
    <div class="btnDiv">
        <button class="blackBtn_Fill" id="searchBtn">검 색</button>
    </div>

    <p class="searchTitle">검색 결과</p>
    <table>
        <tr>
            <th width="50px">구분</th>
            <th width="250px">명칭</th>
            <th>위치</th>
        </tr>
    </table>
    <div id="resultList" class="customScroll" data-mcs-theme="minimal-dark">
	    <table></table>
    </div>

</div>