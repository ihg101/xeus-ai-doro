<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.smartcity.service.EventHistVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>

<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.util.UUID"%>
<%@ include file="../common.jsp"%>
<%
// session.setAttribute("userId", "GMX_DASHBOARD");

String c = UUID.randomUUID().toString().replace("-", "");
String serviceName = "스마트시티 통합플랫폼";
String applicationName = "Web File Viewer";

ArrayList<EventHistVo> evtTypCdList =  (ArrayList<EventHistVo>)request.getAttribute("evtTypCdList");
ArrayList<EmdVo> emdCdList =  (ArrayList<EmdVo>)request.getAttribute("emdCdList");

%>

<!--     <meta charset="UTF-8"> -->
<!--     <meta http-equiv="X-UA-Compatible" content="IE=edge"> -->
<!--     <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
    <title>스마트시티 통합플랫폼</title>
    <link rel="stylesheet" type="text/css" href="./res/css/xeus.eventGraphTable.all.css">
    <link rel="stylesheet" type="text/css" href="./res/css/xeus.eventGraphTable.reset.css">
    <link rel="stylesheet" type="text/css" href="./res/css/xeus.eventGraphTable.style.css">


    <script type="text/javascript" src="./res/menu/statView/geomex.xeus.eventGraphTable.js"></script>

	<script type="text/javascript" src="./res/menu/statView/gmx.gis.map.config.js?c=<%= c %>"></script>
    <script type="text/javascript" src="./res/menu/statView/gmx.gis.layer.js?c=<%= c %>"></script>
    <script type="text/javascript" src="./res/menu/statView/gmx.gis.map.js?c=<%= c %>"></script>
    <script type="text/javascript" src="./res/menu/statView/gmx.gis.legend.js?c=<%= c %>"></script>


    <script type="text/javascript">

    </script>
    <style>
        .ol-zoom {visibility: hidden;}
    </style>

    <div class="stat_wrap">
        <div class="stat_top">
            <div class="btn_box">
                <button id="graphView" class="btn_stat active">그래프 보기</button>
                <button id="tableView" class="btn_stat">테이블 보기</button>
            </div>
            <div class="select_wrap graph_select_wrap">
<!--             	<select name="yearOrMonth" class="yearOrMonth"> -->
<!--                     <option value="month">월</option> -->
<!--                     <option value="year">년</option> -->
<!--                 </select> -->

                <div class="btn_box">
	                 <button class="btn_stat active" id="monthBtn">월</button>
	                 <button class="btn_stat" id="yearBtn">년</button>
                </div>

                <input name="time" class="sendData time" type="month">
                <select name="emdCd" class="sendData emdCd">
                    <option value="">전체 지역</option>
                <%
                for(int i=0; i<emdCdList.size(); i++){
               	%>
                	<option value="<%=emdCdList.get(i).getEmdCd()%>"><%=emdCdList.get(i).getEmdKorNm()%></option>
                <%
                }
                %>
                </select>
                <select name="evtTypCd" class="sendData evtTypCd">
                    <option value="">이벤트 종류</option>
                <%
                for(int i=0; i<evtTypCdList.size(); i++){
               	%>
                	<option value="<%=evtTypCdList.get(i).getEvtTypCd()%>"><%=evtTypCdList.get(i).getEvtTypCd()%></option>
                <%
                }
                %>
                </select>
                <button class="btn_search">검색</button>
            </div>

            <div class="select_wrap table_select_wrap hidden">
                <input name="startDat" class="sendData startDat" type="date">
                <input name="endDat" class="sendData endDat" type="date">
                <select name="emdCd" class="sendData emdCd" >
                    <option value="">전체 지역</option>
                <%
                for(int i=0; i<emdCdList.size(); i++){
               	%>
                	<option value="<%=emdCdList.get(i).getEmdCd()%>"><%=emdCdList.get(i).getEmdKorNm()%></option>
                <%
                }
                %>
                </select>
                <select name="evtTypCd"  class="sendData evtTypCd">
                    <option value="">이벤트 종류</option>
                <%
                for(int i=0; i<evtTypCdList.size(); i++){
               	%>
                	<option value="<%=evtTypCdList.get(i).getEvtTypCd()%>"><%=evtTypCdList.get(i).getEvtTypCd()%></option>
                <%
                }
                %>
                </select>
                <button class="btn_search">검색</button>
            </div>
        </div>
        <div class="stat_contents">
            <div class="stat_graph active">
                <div class="chart_box" style="padding: 0;">
                    <div class="btn_box">
<!--                         <button class="btn_stat gray">전체보기</button> -->
                    </div>
                    <div class="chart" style="height: 100%;">
                        <div id="smallMap" style="width:100%; height:100%;"></div>
                    </div>
                </div>
                <div class="chart_box eventStatByEvtNm">
                    <h2 class="chart_title">119긴급출동지원</h2>
                    <div class="btn_box">
                        <button class="btn_stat active" id="barGraphBtn">막대 그래프</button>
                        <button class="btn_stat" id="pieGraphBtn">원형 그래프</button>
                    </div>
                    <div class="chart" id="eventStatChartByEvtNm"></div>
                </div>
                <div class="chart_box wide eventStatByTime">
                    <h2 class="chart_title">일별 이벤트</h2>
                    <div class="chart" id="eventStatChartByTime"></div>
                </div>
            </div>
            <div class="stat_table">
                <div class="table_box">
                    <div class="table_top_box">
                        <p class="result_text">
                            <span id="period" class="date">2021-06-08 ~2021-06-09</span>
                            전체 이벤트 조회 결과
                        </p>
                        <div class="btn_box">
               				<button class="btn_stat gray" id="eventExcelDownBtn">엑셀 다운</button>
            			</div>
                    </div>
                    <div class="table custom_scroll">
                        <table id="eventStatTableByEvtTypCd">
                            <thead>
                                <tr>
                                    <th>이벤트 종류</th>
                                    <th>발생 건수</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="more open">
                                    <td>112 긴급출동지원</td>
                                    <td>121</td>
                                </tr>
                                <tr class="fold">
                                    <td colspan="2">
                                        <table>
                                            <tr>
                                                <td>C0</td>
                                                <td>7</td>
                                            </tr>
                                            <tr>
                                                <td>C1</td>
                                                <td>7</td>
                                            </tr>
                                            <tr>
                                                <td>C2</td>
                                                <td>7</td>
                                            </tr>
                                            <tr>
                                                <td>C3</td>
                                                <td>7</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr class="more">
                                    <td>119 긴급출동지원</td>
                                    <td>121</td>
                                </tr>
                                <tr class="fold">
                                    <td colspan="2">
                                        <table>
                                            <tr>
                                                <td>C0</td>
                                                <td>7</td>
                                            </tr>
                                            <tr>
                                                <td>C1</td>
                                                <td>7</td>
                                            </tr>
                                            <tr>
                                                <td>C2</td>
                                                <td>7</td>
                                            </tr>
                                            <tr>
                                                <td>C3</td>
                                                <td>7</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>수배차량</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>문제차량</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>사회적약자</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>군부대</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>민간보안</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>재난</td>
                                    <td>7</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>합계</t>
                                    <td class="sum">1231</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="table_box detailEventStatDiv">
<!--                     <div class="table_top_box"> -->
<!--                         <p class="result_text"> -->
<!--                             8건이 조회되었습니다. -->
<!--                         </p> -->
<!--                         <div class="btn_box"> -->
<!--                             <button class="btn_stat gray">엑셀 다운</button> -->
<!--                         </div> -->
<!--                     </div> -->
<!--                     <div class="table"> -->
<!--                         <table id="detailEventStatTable"> -->
<!--                             <thead> -->
<!--                                 <tr> -->
<!--                                     <th>이벤트 종류</th> -->
<!--                                     <th>이벤트 분류</th> -->
<!--                                     <th>이벤트 상세분류</th> -->
<!--                                     <th>발생시간</th> -->
<!--                                     <th>주소</th> -->
<!--                                     <th>법정동</th> -->
<!--                                 </tr> -->
<!--                             </thead> -->
<!--                             <tbody> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                                 <tr> -->
<!--                                     <td>112 긴급출동지원</td> -->
<!--                                     <td>C0</td> -->
<!--                                     <td>폭력</td> -->
<!--                                     <td>2021-07-28 14:00:50</td> -->
<!--                                     <td>서울시 무슨구 무슨동</td> -->
<!--                                     <td>무슨동</td> -->
<!--                                 </tr> -->
<!--                             </tbody> -->
<!--                         </table> -->
<!--                         <div class="pagination"> -->
<!--                             <button class="btn_prev"><i class="fas fa-chevron-left"></i></button> -->
<!--                             <ul class="number_list"> -->
<!--                                 <li class="active">1</li> -->
<!--                                 <li>2</li> -->
<!--                                 <li>3</li> -->
<!--                                 <li>4</li> -->
<!--                                 <li>5</li> -->
<!--                                 <li>6</li> -->
<!--                                 <li>7</li> -->
<!--                                 <li>8</li> -->
<!--                             </ul> -->
<!--                             <button class="btn_next"><i class="fas fa-chevron-right"></i></button> -->
<!--                         </div> -->
<!--                     </div> -->
                </div>
            </div>
        </div>
    </div>
