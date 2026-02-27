<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<link rel="stylesheet" type="text/css" href="../res/css/GMT/layerInfo.css">
<link rel="stylesheet" type="text/css" href="../common/jsgrid/jsgrid.css">
<link rel="stylesheet" type="text/css" href="../common/jsgrid/jsgrid-theme.css">
<script>var isView = <%= session.getAttribute("isView") %></script>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="../common/common.js"></script>
<script type="text/javascript" src="../common/string.js"></script>
<script type="text/javascript" src="../common/jsgrid/jsgrid.js"></script>
<script type="text/javascript" src="../res/GMT/gmx.gis.layer.info.new.window.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<title>객체 정보</title>
<style>
	html, body, div, span, iframe, h1, h2, h3, h4, h5, h6, p, a, img, ol, ul, li, header, nav, section, footer { margin: 0; padding: 0; border: 0;}
	ol, ul { list-style: none;}
	a, a:hover {color: #333; text-decoration: none;}
	table, thead, tbody, tr, th, td {border-collapse: collapse;}
	body {overflow: hidden;}
	#jsGrid {width: 100% !important; height: 100% !important;}
	#jsGrid table {font-size: 12px;}
	#jsGrid > div {border: 0;}
	#jsGrid input[type="text"] {border: 1px solid #ddd;}
	.jsgrid-grid-header, .jsgrid-grid-body, .jsgrid-header-row > .jsgrid-header-cell, .jsgrid-filter-row > .jsgrid-cell, .jsgrid-insert-row > .jsgrid-cell, .jsgrid-edit-row > .jsgrid-cell {border: 0; border-bottom: 1px solid #ccc; background-color: #f1f1f1;}
	#jsGrid .jsgrid-pager-container {text-align: center; /* padding-top: 15px; */ border-top: 1px solid #ccc;}
	#jsGrid .jsgrid-pager-current-page, #jsGrid .jsgrid-pager-page:hover, #jsGrid .jsgrid-pager-nav-button:hover {color: #fff; background-color: #007fff;}
	#jsGrid .jsgrid-pager-page:hover > a, #jsGrid .jsgrid-pager-nav-button:hover > a {color: #fff;}
	#jsGrid .jsgrid-pager-page, #jsGrid .jsgrid-pager-nav-button {display: inline-block; width: 30px; height: 30px; line-height: 30px; text-align: center; padding: 0; margin-right: 5px; font-size: 12px; border-radius: 3px; transition: 0.3s;}
	#jsGrid .jsgrid-pager-page > a {display: inline-block; width: 28px; height: 28px; color: #007fff; transition: 0.3s;}
	#jsGrid .jsgrid-pager-nav-button {width: auto; border: 1px solid #007fff;}
	#jsGrid .jsgrid-pager-nav-button > a {display: inline-block; padding: 0 10px; height: 100%; color: #007fff;}
	#jsGrid .jsgrid-pager-nav-inactive-button {border-color: #ddd;}
	#jsGrid .jsgrid-pager-nav-inactive-button > a {color: #ddd;}
	#jsGrid .jsgrid-cell {padding: 1em 0.5em;}

	#excelDown{display: none; position: absolute; right: 0px; bottom: 5px; border: 0; padding: 10px; background-color: #007fff; color: #fff; margin: 0 5px; border-radius: 2px; font-size: 12px; margin-left: auto; margin-right: 20px; cursor: pointer;}
	#excelAlert {display: none; position: absolute; top: calc(50% - 40px); left: calc(50% - 245px); z-index: 1000; width: 450px; height: 60px; font-weight: bold; border: 5px solid #e9e9e9; background: white; text-align: center; padding: 20px;}

	#progress.jsgrid-load-panel {position: absolute;top: calc(50% - 10px);left: calc(50% - 120px);z-index: 1000;width: 240px;height: 25px;font-weight: bold;border: 5px solid #e9e9e9;}

	/* .jsgrid-control-field { position: absolute; width: 5em; left: 0; top: auto; border-top-width: 1px; margin-top: -1px; }
	.jsgrid-control-field td { letter-spacing: 1em; } */
</style>
</head>
<body>
	<div id="jsGrid" class="table_style"></div>
	<button id="excelDown">엑셀 다운로드</button>

	<div id="progress" class="jsgrid-load-panel">테이블을 생성하고 있습니다.</div>
	<div id="excelAlert">엑셀 다운로드 요청을 완료하였습니다.<br><br>데이터 수가 많은 경우 다운로드 시간이 지연될 수 있습니다.</div>
</body>
</html>