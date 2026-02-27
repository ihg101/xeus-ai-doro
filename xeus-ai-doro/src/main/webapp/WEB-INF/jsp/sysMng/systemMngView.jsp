<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<%
    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String authStatCd = "";
    String ipChk = "";

    if (param.containsKey("authStatCd")) authStatCd = param.get("authStatCd");
    if (param.containsKey("ipChk")) ipChk = param.get("ipChk");
%>

<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.layout.css">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.systemMng.css">
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.button.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.system.mng.js"></script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.user.js"></script>

<script type="text/javascript">

	var authStatCd = '<%= authStatCd %>';
	var ipChk = '<%= ipChk %>';

    // ready시 자동수행 설정..
    $(document).ready(function() {

        $("#overlay-west-side-bar").find(".menu-button").each(function(){
    		var icon = $(this).attr("icon");
    		if(icon != null && icon != ""){
    			var $img = $("<img src='../res/img/menu/" + icon + ".png'>").css("margin-top", "-10px");
    			$(this).prepend("<br>");
    			$(this).prepend($img);
    		}
    	});

    });

</script>
<div id="center-overlay-west" xeus-show='false' xeus-event=''>
    <div id="overlay-west-side-bar" class="overlay-side-bar">
        <button id="btn-user-mng" class="menu-button" icon="menu16">사용자관리</button>
        <!-- <button id="btn-ip-mng" class="menu-button" icon="menu17">접근IP관리</button> -->
        <button id="btn-aces-mng" class="menu-button" icon="menu18">접근이력<br>관리</button>
        <button id="btn-auth-mng" class="menu-button" icon="menu19">권한관리</button>
        <button id="btn-orgz-mng" class="menu-button" icon="menu20">소속관리</button>
        <button id="btn-code-mng" class="menu-button" icon="menu21">코드관리</button>
        <button id="btn-nots-mng" class="menu-button" icon="menu22">공지사항<br>관리</button>
           <button id="btn-icon-mng" class="menu-button">아이콘관리</button>
           <button id="btn-log-view" class="menu-button">이력 조회</button>
           <!-- <button id="btn-sms-view" class="menu-button">SMS 연동<br>테스트</button> -->
           <button id="btn-env-set" class="menu-button">설정</button>
    </div>
</div>

<div id="overlay-west-contents"></div>
<div id="center-overlay-east" xeus-show='false'></div>


