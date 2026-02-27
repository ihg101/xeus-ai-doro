<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsImageRqstVo"%>
<%@ include file="../../common.jsp"%>
<%
	ArrayList<CrmsImageRqstVo> list = (ArrayList<CrmsImageRqstVo>)request.getAttribute("list");
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

<div data-role="page" data-theme="b" data-dom-cache="false" data-title="이미지 신청 현황">

	<div data-role="header" align="center">
		<button url="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></button>
		<!-- <a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a> -->
		<!-- <img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px"> -->
		<h3 align="center">이미지 신청 현황</h3>
	</div>

	<div role="main" class="ui-content">
		<div role="main" class="ui-content">
			<div id="rqstListView" data-role="collapsibleset" data-filter="true" data-filter-placeholder="신청 내용을 입력해 주세요." data-theme="b">
			<% for(int i=0; i<list.size(); i++){ %>
				<div data-role="collapsible" data-filtertext="<%= list.get(i).getReqstDetail() %>">
					<h3 data-icon="false">[<%= list.get(i).getProcStatCdRelCdeNm() %>] <%= list.get(i).getReqstDetail() %></h3>
					<ul data-role="listview">
						<li>
							<table id="listTable">
								<tr>
									<th>처리상태</th>
									<td><%= list.get(i).getProcStatCdRelCdeNm() %></td>
								</tr>
								<tr>
									<th>공문파일명</th>
									<td><%= list.get(i).getDocFileNm() %></td>
								</tr>
								<tr>
									<th>신청일자</th>
									<td><%= DateUtil.formatDate(list.get(i).getReqstDat()) %></td>
								</tr>
								<% if("SK".equals(list.get(i).getProcStatCd())){ %>
								<tr>
									<th>승인일자</th>
									<td><%= DateUtil.formatDate(list.get(i).getAcptDat()) %></td>
								</tr>
								<% } %>
								<tr>
									<td colspan="2">
										<textarea readonly><%= list.get(i).getReqstDetail() %></textarea>
									</td>
								</tr>
							<% if("SK".equals(list.get(i).getProcStatCd())){ %>
								<tr>
									<td colspan="2">
										<button class="imgListBtn" url="./getUsrTviusImageDownloadView.do" data-theme="a" k="<%= list.get(i).getMgrSeq() %>">이미지 목록</button>
									</td>
								</tr>
							<% } %>
							</table>
						</li>
					</ul>
				</div>
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

		$(".imgListBtn").click(function(){
			var k = $(this).attr("k");
			var url = $(this).attr("url");
// 			_common.postForm.submit(url, { "rqstMgrSeq" : k });

			url += '?rqstMgrSeq='+k;
			location.href = url;
			/* $.mobile.changePage(url,{
				type: "POST",
				dataUrl: url + "?mgrSeq=" + k,
				data: { "mgrSeq" : k },
				changeHash: true
			}); */
		});

	});
	</script>

</div>

</body>
</html>