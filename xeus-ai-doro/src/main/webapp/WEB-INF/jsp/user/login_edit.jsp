<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<link rel="shortcut icon" href="${ctxPath}/res/img/geomex.ico">
<link rel="stylesheet" type="text/css" href="${ctxPath}/common/ui-1.12.1/themes/ui-darkness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="${ctxPath}/common/ol-v4.0.1/ol.css">
<link rel="stylesheet" type="text/css" href="${ctxPath}/common/jquery.gridster.css">
<link rel="stylesheet" type="text/css" href="${ctxPath}/res/css/xeus.login.css">
<link rel="stylesheet" type="text/css" href="${ctxPath}/res/css/xeus.layout.css">
<title>스마트시티 통합플랫폼</title>
<script type="text/javascript" src="${ctxPath}/common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="${ctxPath}/common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctxPath}/common/common.js"></script>
<script type="text/javascript" src="${ctxPath}/res/xeusUser.js"></script>
<script type="text/javascript" src="${ctxPath}/res/geomex.xeus.user.js"></script>
<script type="text/javascript" src="${ctxPath}/res/geomex.xeus.user.login.js"></script>
<script>
$(document).ready(function(){

    $("#wrap").center();

    $(window).resize(function(){
        $("#wrap").center();
    });

});
</script>
</head>
<body>

    <div id="wrapParent">
        <div id="wrap">
            <div id="logo">
            	<img id="ci" src="../res/img/ci_seocho_ver2.png">
            </div>
            <div style="color: white; font-size: 25px; margin-top: 30px;">- 시스템 점검 안내-<br><br><br>현재 시스템 점검중입니다.<br><br>이용에 불편을 드려 죄송합니다.</div>
        </div>
    </div>

	<div id="copyright">Copyright ⓒ GEOMEXSOFT Corp. All rights reserved.</div>

</body>
</html>