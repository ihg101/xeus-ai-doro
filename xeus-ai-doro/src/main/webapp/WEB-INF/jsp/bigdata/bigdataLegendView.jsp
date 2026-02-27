<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../common.jsp" %>
<script>
(function(){
	var resetLayer = false;
	if($("#main-menu-group").find("#btn-bigdata-mng").attr("init-layer") == "true"){
		resetLayer = true;
		$("#main-menu-group").find("#btn-bigdata-mng").removeAttr("init-layer");
	}

	xeusLayout.initLayer("DATA", resetLayer);
	if(_common.code == null){
		_common.setCode(function(){
			XeusLayer.createLegend("#legendWrap");
		});
	}else{
		XeusLayer.createLegend("#legendWrap");
	}
})();
</script>
<div class="overflow searchWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">

    <div id="legendWrap"></div>

</div>