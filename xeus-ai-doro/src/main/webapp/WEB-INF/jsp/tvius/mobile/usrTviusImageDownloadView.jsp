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
<script type="text/javascript" src="../../common/jszip.js?t=<%= DateUtil.getStrMilSec() %>>"></script>
<script type="text/javascript" src="../../common/jszip-utils.min.js?t=<%= DateUtil.getStrMilSec() %>>"></script>
<script type="text/javascript" src="../../common/capture/FileSaver.min.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b" data-dom-cache="false" data-title="이미지 다운로드">

	<div data-role="header" align="center">
		<button url="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></button>
		<!-- <a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a> -->
		<!-- <img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px"> -->
		<h3 align="center">이미지 다운로드</h3>
		<button id="btn_all_img_download">일괄 다운로드</button>
	</div>

	<div role="main" class="ui-content">
		<div role="main" class="ui-content">
<!-- 			<div id="rqstListView" data-role="collapsibleset" data-filter="true" data-filter-placeholder="신청 내용을 입력해 주세요." data-theme="b"> -->
			<% for(int i=0; i<list.size(); i++){ %>
<%-- 				<div data-role="collapsible" data-filtertext="<%= list.get(i).getImgNm() %>"> --%>
<%-- 					<h3 data-icon="false"><a href="http://www.naver.com"><%= list.get(i).getImgNm() %></a></h3> --%>
					<button class="img_down downloadBtn" url="./getImageView.do" downnm="<%= list.get(i).getImgNm() %>" realnm="<%= list.get(i).getImgPath() %>" data-theme="a" k="<%= list.get(i).getMgrSeq() %>"><%= list.get(i).getImgNm() %></button>
<!-- 				</div> -->
			<% } %>
			</div>
		</div>
	</div>

	<script>
	$(document).ready(function(){

		$("#home").click(function(){
			//$.mobile.changePage($(this).attr("url"));
			location.href = $(this).attr("url");
		});

		$(".downloadBtn").click(function(){
			var k = $(this).attr("k");
			var url = $(this).attr("url");

			url += '?mgrSeq='+k;
			location.href = url;

// 			_common.postForm.submit(url, { "mgrSeq" : k });

		});


		$("#btn_all_img_download").click(function(){
			if(confirm("일괄 다운로드하시겠습니까?")){
				var arFileArray  = new Array();
				var sZipFileName = "capture.zip";

				$(".img_down").each(function(){
					var obj={};
					obj.filename=$(this).attr("downnm");
					obj.url="../../tvius/getImage.do?realNm="+$(this).attr("realnm");
					arFileArray.push(obj);
				})

				downloadZipFile(arFileArray, sZipFileName);
			}

		});

	});
	</script>

</div>

</body>
</html>