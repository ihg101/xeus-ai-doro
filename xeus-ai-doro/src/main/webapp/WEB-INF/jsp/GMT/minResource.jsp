<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
String c = request.getParameter("c");
String v = request.getParameter("v");
%>
<link rel="stylesheet" type="text/css" href="./common/ui-1.12.1/themes/base/jquery-ui.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/nprogress/nprogress.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./common/ol-v6.4.3/ol.css?c=<%= c %>">
<link rel="stylesheet" type="text/css" href="./res/css/GMT/main.css?c=<%= c %>">

<script type="text/javascript" src="./common/nprogress/nprogress.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/ol-v6.4.3/ol.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/jquery-3.2.0.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/bootstrap.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/ui-1.12.1/jquery-ui.min.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/lodash.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/proj4js-2.4.3/proj4.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/HashMap.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/string.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/Date.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/shp/jszip.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/shp/jszip-utils.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/shp/preprocess.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/shp/preview.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/shp/dbf.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/gmx.gis.map.config.js?c=<%= c %>"></script>

<script type="text/javascript" src="./common/spatial.js?c=<%= c %>"></script>
<script type="text/javascript" src="./common/common.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/tile/gmx.gis.daum.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/gmx.gis.layer.js?c=<%= c %>"></script>

<script type="text/javascript" src="./res/GMT/gmx.gis.srid.find.js?c=<%= c %>"></script>