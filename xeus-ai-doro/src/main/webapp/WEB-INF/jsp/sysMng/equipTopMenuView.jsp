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
			_common.callAjax(_url, _param, function(view) {
				$(".contentWrapper").find(".bpopup").remove();
				$(".contentWrapper").find("#overlay-west-contents").html('');
				$(".contentWrapper").find("#overlay-west-contents").html(view);
			});
		}
	    //$(".searchWrapper").find("#searchBtn").click();
	}
});
</script>

<div id="top_menu">
    <div class="tabTitle" style="margin-top: 0;">
		<button class="topMenuTab" url="/vms/getVmsView.do" gbn="vms">VMS 관리</button><!-- active="active"  -->
		<button class="topMenuTab" url="/nms/getCctvModelMngView.do" gbn="model">CCTV 모델 관리</button>
		<button class="topMenuTab" url="/nms/getMobileManageView.do" gbn="mobile">모바일 관리</button>
	</div>
</div>
