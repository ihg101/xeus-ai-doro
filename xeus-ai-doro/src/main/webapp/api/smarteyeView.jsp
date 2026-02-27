<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String image = request.getParameter("image");
String point = request.getParameter("point");
%>
<!DOCTYPE html>
<html>
<head>
<title>스마트시티 통합플랫폼</title>
<style type="text/css">
html, body {
    background-color: #111;
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100%;
}
</style>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js"></script>
<script>
window.onload = function(){
	var box = <%= point %>;
	var canvas = $("#__parking__line-canvas")[0];

	var $target = $("#__parking__video-canvas");
	var canvasWidth = $target.width();
	var canvasHeight = $target.height();
	var canvasTop = 0; //$target.offset().top;
	var canvasLeft = $target.css("margin-left"); //$target.offset().left;

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	$(canvas).width(canvasWidth);
	$(canvas).height(canvasHeight);
	$(canvas).css({ top: canvasTop, left: canvasLeft });

	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	var x = parseFloat(box[0][0]) * canvasWidth;
    var y = parseFloat(box[0][1]) * canvasHeight;
    var x2 = parseFloat(box[1][0]) * canvasWidth;
    var y2 = parseFloat(box[1][1]) * canvasHeight;
    var w = x2 - x;
    var h = y2 - y;

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}
</script>
</head>
<body>
	<img id="__parking__video-canvas" src="../api/smarteyeImgProxy.jsp?url=<%= image %>" style="height: 99%;">
	<canvas id="__parking__line-canvas" style="position: absolute; top: 0;"></canvas>

</body>
</html>