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
<title>스마트시티 통합플랫폼</title>
</head>
<body>

	<div data-role="page" data-theme="b" data-dom-cache="false" data-title="미허용 단말기 감지">

		<div data-role="popup" id="devicePopup" data-overlay-theme="b" data-dismissible="false">
			<div data-role="header" data-theme="b">
				<h1>알림</h1>
			</div>
			<div role="main" class="ui-content">
				<br>
				<p>해당 기능은 PC또는 테블릿만 가능합니다.</p>
				<br>
				<button class="ui-btn ui-corner-all ui-shadow" id="moveMain">이전 화면으로 이동</button>
			</div>
		</div>
		<script>
		window.onload = function(){
			$("#devicePopup").popup({ history: false }).popup("open");

			$("#moveMain").click(function(){
				history.back();
			});
		}
		</script>

	</div>

</body>
</html>