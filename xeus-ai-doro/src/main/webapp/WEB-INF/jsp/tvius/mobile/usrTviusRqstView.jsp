<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ include file="../../common.jsp"%>
<%
	ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>) request.getAttribute("list");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="../../common/jquerymobile/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="../../common/jquerymobile/jquery-1.11.1.min.js"></script>
<script src="../../common/jquerymobile/jquery.mobile-1.4.5.min.js"></script>
<title>제천시 스마트시티 통합플랫폼</title>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js"?t=<%= DateUtil.getStrMilSec() %>></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b" data-title="영상 반출 신청 현황">

	<div data-role="header" align="center">
		<a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a>
		<img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px">
	</div>

	<div role="main" class="ui-content">
		<div role="main" class="ui-content">
			<div id="rqstListView" data-role="collapsibleset" data-filter="true" data-filter-placeholder="신청 내용을 입력해 주세요." data-theme="b">
			<% for(int i=0; i<list.size(); i++){ %>
				<div data-role="collapsible" data-filtertext="<%= list.get(i).getReqstDetail() %>">
					<h3 data-icon="false">[<%= list.get(i).getProcStatCdRelCdeNm() %>] <%= list.get(i).getCctvList() %></h3>
					<ul data-role="listview">
						<li>
							<table id="listTable">
								<tr>
									<th>처리상태</th>
									<td><%= list.get(i).getProcStatCdRelCdeNm() %></td>
								</tr>
								<tr>
									<th>범죄유형</th>
									<td><%= list.get(i).getCrimeTypRelCdeNm() %></td>
								</tr>
								<tr>
									<th>영상요약</th>
									<td></td>
								</tr>
								<tr>
									<th>신청일자</th>
									<td><%= DateUtil.formatDate(list.get(i).getReqstDat()) %></td>
								</tr>
								<tr>
									<td colspan="2">
										<textarea readonly><%= list.get(i).getReqstDetail() %></textarea>
									</td>
								</tr>
							<% if("SW".equals(list.get(i).getProcStatCd()) || "ED".equals(list.get(i).getProcStatCd())){ %>
								<tr>
									<td colspan="2">
										<button class="editBtn" data-theme="a" k="<%= list.get(i).getMgrSeq() %>">신청 내용 수정</button>
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

		$(".editBtn").click(function(){
			var k = $(this).attr("k");

			$.mobile.changePage("./getUsrTviusRqstEdit.do",{
				type: "POST",
				dataUrl: "./getUsrTviusRqstEdit.do?mgrSeq=" + k,
				data: { "mgrSeq" : k },
				changeHash: true
			});
		});

	});
	</script>
<% if(userId == null || "".equals(userId) || "null".equals(userId)){ %>
	<script type="text/javascript">alert("세션이 존재하지 않아 로그인 페이지로 이동합니다."); location.href = "./login.do";</script>
<% } %>
</div>

</body>
</html>