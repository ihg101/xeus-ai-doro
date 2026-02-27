<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.util.UUID"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
session.setAttribute("userId", "GMX_DASHBOARD");

String c = UUID.randomUUID().toString().replace("-", "");
String serviceName = "스마트시티 통합플랫폼";
String applicationName = "Web File Viewer";
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%= serviceName + " " + applicationName %></title>
<link rel="shortcut icon" href="../res/img/geomex.ico">
<style>
html, body { padding: 0px; margin: 0px; width: 100%; height: 100%; }
table { width: 100%; height: 100%; }
.psText { display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 85%; vertical-align: bottom; }
.pointer { cursor: pointer; }

::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; }
::-webkit-scrollbar-thumb:hover { background: #555; }

.customScroll::-webkit-scrollbar {width: 15px;}
.customScroll::-webkit-scrollbar-thumb {border: 5px solid rgba(0, 0, 0, 0); background-clip: padding-box; -webkit-border-radius: 24px; background-color: #fff; -webkit-box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05);}
.customScroll::-webkit-scrollbar-button {width: 0; height: 0; display: none;}
.customScroll::-webkit-scrollbar-corner {background-color: transparent;}
.customScroll::-webkit-scrollbar-track {border: 5px solid rgba(0, 0, 0, 0); background-clip: padding-box; -webkit-border-radius: 24px; background-color: #1d1d1f;}

ul{list-style:none;}
a{text-decoration:none; color:#333;}
.monthsumry_box{padding:0px; letter-spacing:-0.5px;}
.monthsumry_tab_menu{position:relative;}
.monthsumry_tab_menu .monthsumry_list{overflow:hidden;}
.monthsumry_tab_menu .monthsumry_list li{float:left; margin-right:14px;}
.monthsumry_tab_menu .monthsumry_list .btn{font-size:13px;}
.monthsumry_tab_menu .monthsumry_list .cont{display:none; position:absolute; top:33px; left:0; color:#000; text-align:center; width:90%; height:230px; line-height:0px;}
.monthsumry_tab_menu .monthsumry_list li.monthsumry_is_on .btn{font-weight:bold; color:green;}
.monthsumry_tab_menu .monthsumry_list li.monthsumry_is_on .cont{display:block;}

.yearsumry_box{padding:0px; letter-spacing:-0.5px;}
.yearsumry_tab_menu{position:relative;}
.yearsumry_tab_menu .yearsumry_list{overflow:hidden;}
.yearsumry_tab_menu .yearsumry_list li{float:left; margin-right:14px;}
.yearsumry_tab_menu .yearsumry_list .btn{font-size:13px;}
.yearsumry_tab_menu .yearsumry_list .cont{display:none; position:absolute; top:33px; left:0; color:#000; text-align:center; width:90%; height:230px; line-height:0px;}
.yearsumry_tab_menu .yearsumry_list li.yearsumry_is_on .btn{font-weight:bold; color:green;}
.yearsumry_tab_menu .yearsumry_list li.yearsumry_is_on .cont{display:block;}

</style>
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/base/jquery-ui.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="../common/ol-v6.4.3/ol.css?c=<%= c %>">
<script type="text/javascript">var _GMXMAP_DEF_PROXY_ = false;</script>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/proj4js-2.4.3/proj4.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/spatial.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/common.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/ol-v6.4.3/ol.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/ol-ext/ol-ext.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/xeus.player.2.1.0.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/Date.js?c=<%= c %>"></script>
<script type="text/javascript" src="../common/highcharts/highcharts.js?c=<%= c %>"></script>

<script type="text/javascript" src="../res/dashboard/gmx.gis.layer.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.gis.legend.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.gis.map.config.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.gis.map.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.gis.daum.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.gis.bing.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/xeusJsonParser.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard//geomex.xeus.map.widget.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/xeusWebSocket.js?c=<%= c %>"></script>


<script type="text/javascript" src="../res/dashboard/main.js?c=<%= c %>"></script>

<script type="text/javascript" src="../res/dashboard/gmx.board.weather.rader.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.weather.satelliteimagery.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.weather.typhoonimage.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.weather.air.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.weather.today.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.weather.weekly.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.rainfall.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.water.level.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.eventList.js?c=<%= c %>"></script>
<script type="text/javascript" src="../res/dashboard/gmx.board.weather.awssumry.js?c=<%= c %>"></script>

<script type="text/javascript">
    var userId = "GMX_DASHBOARD";
</script>

</head>
<body>

    <div id="eventList" class="customScroll" style="width: 600px; height: 300px; overflow: auto"></div>
    <div id="player" style="width: 300px; height: 300px;"></div>
    <div id="map" style="width: 300px; height: 300px;" style="width: 300px; height: 300px;"></div>
    <div id="waterLevel" style="width: 600px; height: 300px;"></div>
    <div id="rainfall" style="width: 600px; height: 300px;"></div>
    <div id="satelliteImagery" style="width: 300px; height: 300px;"><img src="" style="width: 300px; height: 300px;"></div>
    <div id="weatherRadar" style="width: 300px; height: 300px;"><img src="" style="width: 300px; height: 300px;"></div>
    <div id="typhoonImage" style="width: 300px; height: 300px;"><img src="" style="width: 300px; height: 300px;"></div>

    <div id="monthsumry" style="width: 90%; height: 300px;">
        <div class="monthsumry_box">
          <div class="monthsumry_tab_menu">
            <ul class="monthsumry_list">
              <li id="month_graph" class="monthsumry_is_on" onclick="GMXBOARD.awsEvent.monGraphClick()">
                <p class="btn" style="cursor:pointer">그래프</p>
                <div id="monthsumry_graph" class="cont"></div>
              </li>
              <li id="month_table" onclick="GMXBOARD.awsEvent.monTblClick()">
                <p class="btn" style="cursor:pointer">테이블</p>
                <div id="monthsumry_table" class="cont">
                    <p id="month_title" style="height: 20px; margin: 0px; padding: 10px; top: 10px;"></p>
                    <table id="monthtbl">
                    </table>
                </div>
              </li>
              <li>
                <input type="month" id="dateChange" onchange="GMXBOARD.awsEvent.dateChange()">
              </li>
            </ul>
          </div>
        </div>
    </div>

    <div id="yearsumry" style="width: 90%; height: 300px;">
        <div class="yearsumry_box">
          <div class="yearsumry_tab_menu">
            <ul class="yearsumry_list">
              <li id="year_graph" class="yearsumry_is_on" onclick="GMXBOARD.awsEvent.yearGraphClick()">
                <p class="btn" style="cursor:pointer">그래프</p>
                <div id="yearsumry_graph" class="cont"></div>
              </li>
              <li id="year_table" onclick="GMXBOARD.awsEvent.yearTblClick()">
                <p class="btn" style="cursor:pointer">테이블</p>
                <div id="yearsumry_table" class="cont">
                    <p id="year_title" style="height: 20px; margin: 0px; padding: 10px; top: 10px;"></p>
                    <table id="yeartbl">
                    </table>
                </div>
              </li>
            </ul>
          </div>
        </div>
    </div>

    <div id="weather" style="width: 300px; height: 300px;">
        <div class="weather_box">
            <div class="weatherPosition">강원도 춘천시</div>
            <div class="weather_icon_box">
                <div id="weather_icon" class="weather_icon">
                    <img alt="맑음" src="../res/img/board/weather2/NB02.png">
                </div>
                <div id="weather_now" class="weather_text">구름조금</div>
            </div>
            <div class="weather_tem_box">
                <div id="weather_temperature" class="weather_tem">30˚</div>
                <div class="weather_tem_mnmx">
                    ⬇
                    <span id="tmn" class="mn">12˚</span>
                    ⬆
                    <span id="tmx" class="mx">22˚</span>
                </div>
            </div>
            <div class="weather_info_box">
                <div id="weather_humidity" class="weather_info">습도<span>50</span> %</div>
                <div id="weather_rainfall" class="weather_info">강수<span>50</span> %</div>
                <div id="weather_wind" class="weather_info">풍향<span>북동쪽 50</span> ㎧</div>
            </div>
        </div>
    </div>
    <div id="weatherWarning" style="width: 300px; height: 300px;"></div>
    <div id="air" style="width: 300px; height: 300px;">
        <div class="t">미세먼지</div>
        <div class="val dust_color2 gbn" id="pm10"><span id = "pm10count">30</span>
            <span class="text" id="pm10v">상태</span>
        </div>
        <div class="t">초미세먼지</div>
        <div class="val dust_color4 gbn" id="pm25"><span id = "pm25count">30</span>
            <span class="text" id="pm25v">상태</span>
        <div class="t">오존</div>
        <div class="val dust_color4 gbn" id="o3"><span id = "o3count">30</span>
            <span class="text" id="o3v">상태</span>
    </div>
    </div>

    <div id="weatherweek" style="width: 300px; height: 300px;">
        <div class="ov_box">
            <div class="weekly_weather">
                <table class="weekly_table">
                    <thead class="weekly_dt">
                        <tr>
                            <th id="dt0">화(오늘)</th>
                            <th id="dt1">수(02.17)</th>
                            <th id="dt2">목(02.18)</th>
                            <th id="dt3">금(02.19)</th>
                            <th id="dt4">토(02.20)</th>
                        </tr>
                    </thead>
                    <tbody class="weekly_content">
                        <tr>
                            <td>
                                <div class="w">
                                    <img id="imgAm0" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temAm0">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgAm1" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temAm1">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgAm2" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temAm2">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgAm3" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temAm3">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgAm4" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temAm4">30%</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="w">
                                    <img id="imgPm0" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temPm0">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgPm1" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temPm1">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgPm2" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temPm2">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgPm3" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temPm3">30%</span>
                                </div>
                            </td>
                            <td>
                                <div class="w">
                                    <img id="imgPm4" src="../res/img/board/weather/NB03.png" alt="구름많음">
                                    <span class="tem" id="temPm4">30%</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td id="c0">-10˚/-1˚</td>
                            <td id="c1">-10˚/-1˚</td>
                            <td id="c2">-10˚/-1˚</td>
                            <td id="c3">-10˚/-1˚</td>
                            <td id="c4">-10˚/-1˚</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</body>
</html>