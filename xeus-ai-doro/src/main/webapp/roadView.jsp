<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
String c = DateUtil.getStrMilSec();
String lat = request.getParameter("lat");
String lng = request.getParameter("lng");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style>
html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
#roadview { position: relative; width: 100%; height: 100%; }
</style>
<link rel="stylesheet" type="text/css" href="./res/css/roadview.css?c=<%= c %>">
<script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=980dc160a9f292becec1b7fa7aa9f142"></script>
<script type="text/javascript" src="./common/jquery-3.2.0.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/common.js"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.DaumRoadViewWindow.js?c=<%= c %>"></script>
<script>
window.onload = function(){
	if(geomex.xeus.DaumRoadViewWindow.isAlive())  geomex.xeus.DaumRoadViewWindow.destroyRoadView();
	if(opener.GMXMAP.DaumRoadView.isAlive()) opener.GMXMAP.DaumRoadView.destroyRoadView();

	geomex.xeus.DaumRoadViewWindow.createMarker(opener).createRoadView(new daum.maps.LatLng(<%= lat %>, <%= lng %>));
}
</script>
<title>다음 로드뷰</title>
</head>
<body onbeforeunload="geomex.xeus.DaumRoadViewWindow.destroyRoadView();">

</body>
</html>