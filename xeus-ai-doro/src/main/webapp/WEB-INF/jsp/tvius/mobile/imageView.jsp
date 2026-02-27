<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsImageVo"%>
<%@ include file="../../common.jsp"%>
<%
	ArrayList<CrmsImageVo> list = (ArrayList<CrmsImageVo>)request.getAttribute("list");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="../../common/jquerymobile/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="../../common/jquerymobile/jquery-1.11.1.min.js"></script>
<script src="../../common/jquerymobile/jquery.mobile-1.4.5.min.js"></script>
<title><%= projNm %></title>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js"?t=<%= DateUtil.getStrMilSec() %>></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b" data-dom-cache="false" data-title="이미지 다운로드">

	<div data-role="header" align="center">
		<button url="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></button>
<!-- 		<button id="imgDownload">뒤로가기</button> -->
		<!-- <a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a> -->
		<!-- <img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px"> -->
		<h3 align="center">이미지 다운로드</h3>
		<button id="imgDownload">다운로드</button>
	</div>

	<div role="main" class="ui-content">
		<div data-role="center" style="padding:10px;">
			<img class="imgs" alt="<%= list.get(0).getImgDesc() %>" src="../mobile/getImage.do?mgrSeq=<%= list.get(0).getMgrSeq()%>" style="width:100%;height:100%">
		</div>
	</div>

	<script>
	$(document).ready(function(){


		$("#home").click(function(){
			//$.mobile.changePage($(this).attr("url"));
			location.href = $(this).attr("url");
		});


		$("#imgDownload").click(function(){
			//$.mobile.changePage($(this).attr("url"));
			var _param={};
			_param['mgrSeq']=<%= list.get(0).getMgrSeq()%>;

			_common.postForm.submit("/tvius/mobile/getFiles.json", _param);
		});


	});
	</script>

</div>

</body>
</html>