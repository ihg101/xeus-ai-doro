<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.HashMap"%>
<%@ include file="../common.jsp" %>
<%

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String gbn = map.get("gbn");
%>
<style>
    #wrap button.topMenuTab[active=active] {
/* 	    font-weight: bold; */
/* 	    border-top: 2px solid #2B5E93; */

	   	color: #333333;
	    background-color: #ffffff;
		border-left: solid 1px #1f1f24;
	    border-top: solid 1px #1f1f24;
	    border-right: solid 1px #1f1f24;
	    border-bottom: solid 1px #ffffff;
	    font-weight: bold;
	    cursor: default;
	}
	#wrap button.topMenuTab {
/* 	    background: white; */
/* 	    border: 1px solid gray; */
/* 	    border-bottom: none; */
/* 	    padding: 8px 10px; */
/* 	    font-size: 14px; */
/* 	    cursor: pointer; */
/* 	    outline: none; */

		display: inline-block;
		height: 24px;
		padding: 5px 10px 0 10px;
		font-size: 10pt;
	    font-weight: normal;
	    color: #999999;
	    background-color: #ffffff;
	    border: none;
	    border-bottom: solid 1px #E4E4E4;
	    outline: none;
	    cursor: pointer;
	}
</style>
<script type="text/javascript">
var gbn = '<%=gbn%>';
$("#top_menu").find("button.topMenuTab").each(function(){
	$(this).removeAttr("active");
	if($(this).attr("gbn") == gbn) $(this).attr("active", "active");
});


/* 탭 클릭 이벤트 입니다. */
$("#top_menu").find("button.topMenuTab").click(function(){
	if($(this).attr("active") != "active"){
		var _url = $(this).attr("url");
		var gbn = $(this).attr("gbn");
		if(_url != null){// && _mode != null && _supPath != null
			var _param = {};
			_param['limit'] = 10;
			_param['offset'] = 0;
			_param['gbn'] = gbn;

			if(_url == "/userMng/getUserView.do") _param['limit'] = 100;

			$("#systemView").find(".bpopup").remove();
			$("#systemView").find("#overlay-west-contents").html('').hide();
			_common.callAjax(_url, _param, function(view) {
				$("#systemView").find("#overlay-west-contents").html(view);
			}, false);
			$("#systemView").find("#overlay-west-contents").show("fade");
		}
	    //$(".searchWrapper").find("#searchBtn").click();
	}
});
</script>

<div id="top_menu">
    <div class="tabTitle" style="margin-top: 0;">
    	<button class="topMenuTab" url="/userMng/getUserView.do" gbn="user">사용자 관리</button>
		<button class="topMenuTab" url="/auth/getAuthView.do" gbn="auth">권한 관리</button>
<% if("geomex".equals(userId)){ %>
		<button class="topMenuTab" url="/orgz/getOrgzView.do" gbn="orgz">소속 관리</button>
<% } %>
<!-- 		<button class="topMenuTab" url="/code/getCodeView.do" gbn="code">코드 관리</button> -->
		<button class="topMenuTab" url="/notice/getNoticeView.do" gbn="notc">공지사항</button>
		<!-- <button class="topMenuTab" url="/sysMng/getCctvIconMngView.do" gbn="icon">아이콘 관리</button> -->
	</div>
</div>
