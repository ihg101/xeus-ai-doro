<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.nms.infra.search.js"></script>
<script>
(function(){
	XeusLayer.createLegend("#legendWrap");
})();
</script>
<div class="overflow searchWrapper" onselectstart="return false">

    <p class="searchTitle">
        <button class="tab" active="active" url="/nms/getInfraView.do">범례</button><button class="tab" url="/nms/getInfraSearchView.do">검색</button><button class="tab" url="/nms/getInfraAddView.do">신규등록</button>
    </p>
    <div id="legendWrap"></div>

</div>