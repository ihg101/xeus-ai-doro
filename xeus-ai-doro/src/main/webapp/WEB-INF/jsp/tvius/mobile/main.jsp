<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.NoticeVo"%>
<%@ include file="../../common.jsp" %>
<%
	ArrayList<NoticeVo> notice = (ArrayList<NoticeVo>) request.getAttribute("notice");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="../../common/jquerymobile/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="../../common/ol-v4.0.1/ol.css">
<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="../../common/jquerymobile/jquery-1.11.1.min.js"></script>
<script src="../../common/jquerymobile/jquery.mobile-1.4.5.min.js"></script>
<title>제천시 스마트시티 통합플랫폼</title>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b">

	<div data-role="header" align="center">
		<a href="#" class="ui-btn ui-btn-inline ui-icon-power ui-btn-icon-left" id="signOut"></a>
		<img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px">
	</div>

	<div role="main" class="ui-content">
		<div class="ui-grid-a">
			<div class="ui-block-a"><a href="./getUsrTviusRqst.do" class="ui-icon-video ui-btn-icon-top ui-shadow ui-btn ui-corner-all" id="rqstBtn">영상 반출 신청</a></div>
			<div class="ui-block-b"><a href="./getUsrTviusRqstView.do" class="ui-icon-bullets ui-btn-icon-top ui-shadow ui-btn ui-corner-all" id="rqstViewBtn">반출 신청 현황</a></div>
		</div>
	</div>

	<div data-role="footer" align="center">
		<p style="margin: 8px 0px;">공지사항</p>
	</div>

	<div role="main" class="ui-content">
		<div data-role="collapsibleset" data-filter="true" data-filter-placeholder="제목을 입력해 주세요." data-inset="true" id="collapsiblesetForFilter" data-theme="a">
<% for(int i=0; i<notice.size(); i++){ %>
			<div data-role="collapsible" data-filtertext="<%= notice.get(i).getNotcTitle() %>">
				<h3><%= notice.get(i).getNotcTitle() %></h3>
				<ul data-role="listview" data-inset="false">
					<li>
						<textarea readonly="readonly">
<%= notice.get(i).getNotcConts() %>
						</textarea>
						<h3 align="right"><%= DateUtil.formatDate(notice.get(i).getLastMdfyDat()) %></h3>
					</li>
				</ul>
			</div>
<% } %>
		</div>
	</div>

	<script type="text/javascript" src="../../res/xeusSessionWebSocket.js"></script>
	<script type="text/javascript" src="../../res/geomex.xeus.tvius.mobile.js"></script>
<% if(userId == null || "".equals(userId) || "null".equals(userId)){ %>
	<script type="text/javascript">alert("세션이 존재하지 않아 로그인 페이지로 이동합니다."); location.href = "./login.do";</script>
<% } %>
</div>

</body>
</html>