<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
String c = request.getParameter("c");
String v = request.getParameter("v");

boolean proxy = Boolean.parseBoolean(request.getParameter("proxy"));

String userId = request.getParameter("userId");
String userGrpNo = request.getParameter("userGrpNo");
String orgMgrNo = request.getParameter("orgMgrNo");
String authMgrNo = request.getParameter("authMgrNo");
String authGrpId = request.getParameter("authGrpId");
%>
<link rel="shortcut icon" href="./res/img/geomex.ico">
<%-- <link rel="stylesheet" type="text/css" href="./common/ui-1.12.1/themes/ui-darkness/jquery-ui.css?c=<%= c %>"> --%>
<link rel="stylesheet" type="text/css" href="./common/ui-1.12.1/themes/base/jquery-ui.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./res/css/all.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/gridstack/gridstack.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/gridstack/gridstack-extra.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/jquery.gridster.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ui-1.12.1/jquery-ui.MonthPicker.min.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/bxslider/jquery.bxslider.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ol-v6.4.3/ol.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ol-v6.4.3/ol-contextmenu-v4.1.0.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ol-ext/ol-ext.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/pagination-2.1.5/jquery.pagination.css?c=<%= c %>">

<link rel="stylesheet" type="text/css" href="./res/css/main.css?c=<%= c %>">
<%-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css?c=<%= c %>"> --%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.paging.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./res/css/roadview.css?c=<%= c %>">
<script type="text/javascript" src="./common/ol-v6.4.3/ol.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery-3.2.0.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/bootstrap.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/ui-1.12.1/jquery-ui.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/turf/turf.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/lodash.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/gridstack/gridstack.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/gridstack/gridstack.jQueryUI.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/gridstack/gridstack.custom.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.gridster.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.form.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.MonthPicker.ko.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.bpopup.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/spin.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/xeus.player.2.0.1.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/pagination-2.1.5/jquery.pagination.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/highcharts/highcharts.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/highcharts/highcharts-more.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/highcharts/solid-gauge.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/highcharts/series-label.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/highcharts/exporting.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/highcharts/themes/dark-unica.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/jquery.inputmask.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.inputmask.date.extensions.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.inputmask.extensions.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.inputmask.numeric.extensions.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.inputmask.regex.extensions.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.rowspanizer.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.bxslider.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.cycle.all.js?c=<%= c %>"></script>

<%-- <script type="text/javascript" src="./common/ol-v6.4.3/ol-contextmenu-v4.1.0.js?c=<%= c %>"></script> --%>
<script type="text/javascript" src="./common/ol-v6.4.3/ol-contextmenu-v3.3.2-custom.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/ol-ext/ol-ext.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/proj4js-2.4.3/proj4.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.paging.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/underscore.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/jquery.timepicker.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery.download.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/cipher/tea-block.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/cipher/base64.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/cipher/utf8.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/cipher/jsbn.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/cipher/rsa.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/cipher/helper.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/chroma.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/HashMap.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/string.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/color.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/Date.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/gmx.gis.map.config.js?c=<%= c %>"></script>

<script type="text/javascript">
var userId = "<%=userId%>";
var userGrpNo = "<%=authGrpId%>";
var orgMgrNo = "<%=orgMgrNo%>";
var authMgrNo = "<%=authMgrNo%>";
var authGrpId = "<%=authGrpId%>";
var _GMXMAP_DEF_PROXY_ = <%=proxy%>;
_SET_ACTIVE_PROXY(<%=proxy%>);
</script>

<script type="text/javascript" src="./common/spatial.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/common.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/tile/gmx.gis.bing.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/tile/gmx.gis.daum.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/tile/gmx.gis.naver.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/tile/gmx.gis.safemap.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/tile/gmx.gis.emap.js?c=<%= c %>"></script>

<!-- <script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=9d12d8bda468b1a67b540f481006a0b1"></script> -->
<!-- <script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=980dc160a9f292becec1b7fa7aa9f142"></script> -->

<script type="text/javascript" src="./res/GMT/gmx.gis.custom.prevnext.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.custom.measure.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.layer.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.legend.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.map.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/GMT/gmx.gis.main.js?c=<%= c %>"></script>


<script type="text/javascript" src="./res/xeusWebSocket.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusSessionWebSocket.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/xeusGlobal.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/menu/allMenuCommon.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/menu/gisEditView/gmx.gis.main.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/menu/gisEditView/gmx.cctv.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/xeusUtil.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/geomex.xeus.map.widget.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/xeusJsonParser.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusJsonFacilityParser.js?c=<%= c %>"></script>

<%-- <script type="text/javascript" src="./res/xeusCCTV.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusSymbol.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusSymbol-CCTV.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusSymbol-INFRA.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusSymbol-INFRA-CCTV.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusSymbol-INFRA-WIFI.js?c=<%= c %>"></script>
<script type="text/javascript" src="./res/xeusSymbol-INFRA-LORA.js?c=<%= c %>"></script> --%>
