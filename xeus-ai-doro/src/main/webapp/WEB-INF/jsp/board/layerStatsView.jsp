<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.equipmgr.service.CctvVo"%> --%>
<%@ include file="../common.jsp" %>
<%

%>
<%-- <script type="text/javascript" src="<%= context %>/res/geomex.xeus.cctv.search.js"></script> --%>
<div class="searchWrapper">
    <p class="searchTitle">레이어 통계</p>
    <div>
        <div id="searchWrap" style="width: 500px; border: 1px solid black; height: 95%; float: left;">

            <table>
                <tbody>
                    <tr>
                        <th>명칭</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>제작자</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>제작일</th>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div class="btnDiv">
                <button class="blackBtn">검색</button>
            </div>
        </div>
        <div id="resultWrap" style="width: 500px; border: 1px solid black; height: 95%; float: left;">
            <table>
                <tbody>
                    <tr>
                        <th>속성1</th>
                        <th>속성2</th>
                        <th>속성3</th>
                        <th>속성4</th>
                        <th>속성5</th>
                    </tr>
                    <tr>
                        <td colspan="5">검색결과가 존재하지않습니다.</td>
                    </tr>
                </tbody>
            </table>

        </div>
        <div id="resultWrap" style="width: 500px; border: 1px solid black; height: 95%; float: left;">
            <div style="width: 500px; height: 500px; border: 1px solid black; float: left;">그래프1</div>
            <div style="width: 500px; height: 500px; border: 1px solid black; float: left;">그래프2</div>
        </div>
    </div>
</div>