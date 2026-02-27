<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.equipmgr.service.AcsryVo"%>
<%@ page import="geomex.xeus.equipmgr.service.InfraVo"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteVo"%>
<%@ page import="geomex.xeus.equipmgr.service.StatusVo"%>
<%@ include file="../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> stat = cde.convertCodeGrpToAllCde("C13");
Set<String> statKey = stat.keySet();
Iterator<String> statItr = statKey.iterator();

ArrayList<CctvVo> cctv = (ArrayList<CctvVo>) request.getAttribute("cctv");
ArrayList<InfraVo> infra = (ArrayList<InfraVo>) request.getAttribute("infra");
ArrayList<SiteVo> site = (ArrayList<SiteVo>) request.getAttribute("site");
ArrayList<AcsryVo> acsry = (ArrayList<AcsryVo>) request.getAttribute("acsry");

ArrayList<StatusVo> status = (ArrayList<StatusVo>) request.getAttribute("status");

%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>XEUS-Platform</title>
<link rel="shortcut icon" href="<%= context %>/res/img/geomex.ico">

<link rel="stylesheet" type="text/css" href="<%= context %>/common/ui-1.12.1/themes/ui-darkness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/ol-v4.0.1/ol.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/jquery.gridster.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/common/ui-1.12.1/jquery-ui.MonthPicker.min.css">

<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.layout.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.layer.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.favMap.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.ol.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.search.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.paging.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.mapSearch.css">

<script type="text/javascript" src="<%= context %>/common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/bootstrap.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.gridster.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.form.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.MonthPicker.ko.js"></script>
<!-- ol-debug는 ie에서 안나옴 -->
<script type="text/javascript" src="<%= context %>/common/ol-v4.0.1/ol-debug.js"></script>
<script type="text/javascript" src="<%= context %>/common/proj4js-2.4.3/proj4.js"></script>
<script type="text/javascript" src="<%= context %>/common/common.js"></script>
<script type="text/javascript" src="<%= context %>/common/Date.js"></script>
<script type="text/javascript" src="<%= context %>/common/jquery.paging.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.measure.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.overview.js"></script>
<script type="text/javascript" src="<%= context %>/common/geomex.xeus.ol.custom.feature_drag.js"></script>
<script type="text/javascript" src="<%= context %>/common/jsmpeg.min20171213.js"></script> <!-- by khkim -->

<script type="text/javascript" src="<%= context %>/res/xeusConfig.js"></script>

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.proj4.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.map.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.tms.daum.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.button.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.map.fav.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusGlobal.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayerList.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayerTheme.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayer.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusLayout.js"></script>

<script type="text/javascript" src="<%= context %>/res/xeusCCTV.js"></script>

<script type="text/javascript" src="<%= context %>/res/geomex.xeus.Search.js"></script>
<script type="text/javascript" src="<%= context %>/res/xeusSearch.js"></script>
<script type="text/javascript" src="<%= context %>/common/spatial.js"></script>

<%-- <script type="text/javascript" src="<%= context %>/res/geomex.xeus.mapEvent.js"></script> --%>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.user.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.nms.stat.js"></script>
<script type="text/javascript">
// 2017.11.16 by khkim , 테스트 코드 삭제
    // ready시 자동수행 설정..
$(document).ready(function() {

	window.sysAlert = window.alert;
    window.sysConfirm = window.confirm;
    window.alert = xeusCustom.customAlert;
    window.confirm = xeusCustom.customConfirm;

	_common.callAjax("/user/sessionCheck.json", {}, function(json){
        if(!json.result){
            alert("세션이 존재하지 않습니다.\n로그인 페이지로 이동합니다.");
            location.href = "<%= context %>";
        }
    });

	$("#north-menu").find("#btn-logout").click(function(){

        confirm("로그아웃 하시겠습니까?", function(){
            location.href = "<%= context %>"+"/user/signOut.do";
        });
    });

	$('#overlay-west-side-bar').find('.menu-button').click(function(){
    	var menu = $(this).attr('icon');
    	for(var i=1; i<5; i++){
			if( ("menu"+i) == menu){
				$('.menu'+i).show();
			} else {
				$('.menu'+i).hide();
			}
    	}

    });

	$('#overlay-west-side-bar').find('#btn-stat-add').click();

});

</script>
</head>
<body>
<div id="wrap" style="width:100%; height:100%;">
    <div id="layout-body">
        <!-- 상단(North) 패널을 감싸는 div -->
        <div id="layout-north">
            <div id="north-menu">
                <!-- 왼쪽슬라이드 접기/보이기 -->
                <div id="west-slide-group" class="west-menu-group">
                    <button id="west-slide-btn">
                        <img height="40px" width="20px" src="<%= context %>/res/img/right_double_angle.png">
                    </button>
                </div>
                <!-- 시스템 로고 -->
                <div id="logo-group" class="left-menu-group">
                    <button id="system-logo">
                        <img height="40px" src="<%= context %>/res/img/map_top_ci.png">
                    </button>
                </div>
                <!-- <div id="main-menu-group" class="left-menu-group">
                    <span class="menu-button">상태모니터링 시뮬레이터</span>
                </div> -->
                <div id="east-slide-group" class="east-menu-group">
                    <button id="btn-logout">로그아웃</button>
                </div>
            </div>
        </div>
        <!-- 지도와 상단 메뉴를 감싸는 Center div -->
        <div id="layout-center">
            <!-- 사이드 메뉴바 -->
            <div id="overlay-west-side-bar" class="overlay-side-bar" style="display: block;">
                <!-- CCTV 모니터링 -->
                <!-- <button id="btn-stat-list" class="menu-button" for="btn-cctv-view" icon="menu1">상태 목록</button> -->
                <button id="btn-stat-add" class="menu-button" for="btn-cctv-view" icon="menu1">상태 추가</button>
                <button id="btn-stat-edit" class="menu-button" for="btn-cctv-view" icon="menu2">상태 수정</button>
                <button id="btn-cctv-init" class="menu-button" for="btn-cctv-view" icon="menu3">CCTV 목록<br>초기화</button>
            </div>
            <div style="width:100%; height:100%;">
                <div class="searchWrapper">
                    <p class="searchTitle" style="font-size: 20px; padding-bottom: 10px; border-bottom: 1px #000 solid;">
                        상태모니터링 시뮬레이터
                    </p>
                    <div class="menu1" style="display: none;">
                        <p class="searchTitle">
                            상태 모니터링 등록
                        </p>
                        <table id="regTable">
                            <tr>
                                <th>장비번호</th>
                                <td>
                                    <!-- <input type="text" class="wide sendData" id="mgrNo" value="INF0000003" readonly="readonly"> -->
                                    <select id="mgrNo" name="mgrNo" class="wide sendData">
                                        <option value="">전체</option>
                                    <%
                                        int i = 0;
                                        if(cctv.size() > 0){
                                            for(i=0; i<cctv.size(); i++){
                                    %>
                                        <option value="<%=cctv.get(i).getMgrNo()%>"><%=cctv.get(i).getMgrNo()%></option>
                                    <%
                                            }
                                        }
                                    %>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>상태코드</th>
                                <td>
                                    <select id="stateCd" name="stateCd" class="wide sendData">
                                        <option value="">전체</option>
                                    <%
                                        statItr = statKey.iterator();
                                        while (statItr.hasNext()) {
                                            String str = (String) statItr.next();
                                    %>
                                        <option value="<%=str%>"><%=stat.get(str)%></option>
                                    <%
                                        }
                                    %>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" class="tCenter"><button class="blackBtn" id="regBtn">요청점검 등록</button></td>
                            </tr>
                        </table>
                    </div>
                    <div class="menu2" style="display: none;">
                        <p class="searchTitle">
                            상태 모니터링 수정
                        </p>
                        <table id="listTable">
                            <thead>
                                <tr>
                                    <th width="100px">장비구분</th>
                                    <th width="150px">장비번호</th>
                                    <th>장비이름</th>
                                    <th width="100px">상태</th>
                                    <th width="200px">수신일</th>
                                    <th width="100px"></th>
                                </tr>
                            </thead>
                            <tbody>
                        <%
                        for(i=0; i<status.size(); i++){
                            String orgType = status.get(i).getMgrNo();
                            String stateCd = status.get(i).getStateCd();
                            String type = "";
                            String name = "";

                            if("CTV".equals(orgType.substring(0, 3))){
                                type = "CCTV";
                                name = status.get(i).getCctvNm();
                            }
                            if("INF".equals(orgType.substring(0, 3))){
                                type = "기반시설";
                                name = status.get(i).getFacilityNm();
                            }
                            if("SIT".equals(orgType.substring(0, 3))){
                                type = "사이트";
                                //name = status.get(i).getSiteNm();
                            }
                            if("ACS".equals(orgType.substring(0, 3))){
                                type = "부속시설";
                                //name = status.get(i).getAtchdFclNm();
                            }
                        %>
                                <tr class="tCenter" k="<%= status.get(i).getMgrNo() %>">
                                    <td><%= type %></td>
                                    <td><%= orgType %></td>
                                    <td><%= name %></td>
                                    <td>
                                        <%-- <%= cde.convertCodeToName("C13", status.get(i).getStateCd()) %> --%>
                                        <select id="stateCd" name="stateCd" class="wide sendData">
                                    <%
                                        statItr = statKey.iterator();
                                        while (statItr.hasNext()) {
                                            String str = (String) statItr.next();
                                            if (str.equals( stateCd )) {
                                    %>
                                            <option value="<%=str%>" selected><%=stat.get(str)%></option>
                                    <%
                                            } else {
                                    %>
                                            <option value="<%=str%>"><%=stat.get(str)%></option>
                                    <%
                                            }
                                        }
                                    %>
                                    </select>
                                    </td>
                                    <td><%= DateUtil.formatDate(status.get(i).getRecvDat()) %></td>
                                    <td>
                                        <!-- 171212 -->
                                        <!-- <button class="blueBtn mngBtn">점검</button>
                                        <button class="blueBtn locBtn">위치</button> -->
                                        <button class="blackBtn editBtn" mgrno="<%= orgType %>">수정</button>
                                        <button class="blackBtn deleteBtn" mgrno="<%= orgType %>">삭제</button>
                                    </td>
                                </tr>
                        <%
                        }
                        %>
                            </tbody>
                        </table>
                    </div>
                    <div class="menu3" style="display: none;">
                        <p class="searchTitle">
                            CCTV 목록 초기화
                        </p>
                        <div class="btnDiv">
                            <button class="blackBtn initBtn">CCTV 초기화</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>
</body>
</html>