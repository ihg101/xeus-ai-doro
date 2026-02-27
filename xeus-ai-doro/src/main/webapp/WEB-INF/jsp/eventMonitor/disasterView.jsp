<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%-- <%@ page import="geomex.xeus.event.service."%> --%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Set"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp" %>
<%
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* ArrayList<BellVo> bell = (ArrayList<BellVo>)request.getAttribute("bell"); */

%>
<script type="text/javascript" src="<%=context%>/res/geomex.xeus.event.disaster.view.js"></script>
<script type="text/javascript">

var schObj = new Object();

schObj.selectDist = '';
schObj.startDat = '';
schObj.endDat = '';

var _colParam = {};

</script>
<style>
    .searchWrapper #searchResult tr th{
        max-width: 60px;
    }

    .searchWrapper #searchResult tr td{
        padding-left: 7px;
    }

    .searchWrapper #search span {
        margin: 0 5px 0 10px;
        font-size: 13px;
        font-weight: 600;
    }

    /* .searchWrapper #settingTable tr td:hover{
        cursor: pointer;
    } */

    /* .searchWrapper #searchResult #target .transparent {
        border: 0;
        padding: 0;
        vertical-align: middle;
        background: transparent;
    } */
</style>
<div class="searchWrapper">

    <input type="hidden" id="offset" value="0" />
    <input type="hidden" id="max" value="0" />

    <p class="searchTitle">긴급재난상황 현황</p>
    <div id="search">
        <span>재난상황 : </span>
        <select id="selectDist" name="selectDist" class="sendData" style="width: 150px; margin: 12px 0; padding-left: 10px;">
            <option value="">전체</option>
            <option value="EliFoaForestMap">산불발생정보</option>
            <option value="EliHrfRfhr">우량시단위</option>
            <option value="EliKhcAcc">고속도로특별상황관리</option>
            <option value="EliKmaAws10m">기상정보AWS</option>
            <option value="EliKmaDfsShrt">동네예보</option>
            <option value="EliKmaEarthInfm">지진현황</option>
            <option value="EliKmaInform">기상특보</option>
            <option value="EliNemEmre">응급복구장비</option>
            <option value="EliNemFirs">소방서</option>
            <option value="EliRtsaOccurid">시가지도로돌발상황정보</option>
        </select>
        <span>기간 : </span><input id="startDat" class="sendData datePicker" type="text" style="padding-left: 10px; height: 25px !important;" placeholder="수신일자" value="" readonly>
                     ~ <input id="endDat" class="sendData datePicker" type="text" style="padding-left: 10px; height: 25px !important;" placeholder="수신일자" value="" readonly>
        <button id="schBtn" class="blackBtn" style="position: absolute; right: 10px; margin-top: 12px;">조회</button>
        <!-- <button id="test" class="blackBtn" style="position: absolute; right: 30px; margin-top: 12px;">test</button> -->
    </div>
    <table id="searchResult">
        <thead>
        <tr>
            <th>연번</th>
            <th>연계정보 아이디</th>
            <th>수신일자</th>
            <th>위치</th>
            <th>정보</th>
        </tr>
        </thead>
        <tbody id="target" tablenm="">
        </tbody>
    </table>
    <div class="paging_wrap"></div>
</div>