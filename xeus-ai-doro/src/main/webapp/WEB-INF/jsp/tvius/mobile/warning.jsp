<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="./res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
<title>서초구 스마트시티 통합플랫폼</title>
</head>
<body>

	<div data-role="page" data-theme="b" data-dom-cache="false" data-title="PC 접속 감지">

		<div data-role="popup" id="devicePopup" data-overlay-theme="b" data-dismissible="false">
			<div data-role="header" data-theme="b">
				<h1>PC 접속 감지</h1>
			</div>
			<div role="main" class="ui-content">
				<br>
				<p>서초구 모바일 영상반출 시스템은 모바일 단말기(태블릿 포함)만 접근이 가능합니다.</p>
				<br>
				<button class="ui-btn ui-corner-all ui-shadow" id="moveMain">서초 스마트시티 통합플랫폼 PC버전으로 이동</button>
			</div>
		</div>
		<script>
		window.onload = function(){
			$("#devicePopup").popup({ history: false }).popup("open");

			$("#moveMain").click(function(){
				location.href = "http://argos.seocho.go.kr";
			});
		}
		</script>

	</div>

</body>
</html>