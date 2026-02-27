<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.smartcity.service.EventHistVo"%>
<%@ include file="../common.jsp" %>
<%

%>
<script>

</script>
<script type="text/javascript" src="./res/menu/eventView/gmx.cctv.mobileShare.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">

    <h3 class="title" style="display:inline-block;">모바일 영상공유 현황</h3>
    <div id="searchTable" class="box_style" style="display:inline-block;float:right;">
    	<button id="searchBtnShare" class="btn_style2">갱신하기</button>
    </div>
    <div id="listWrap" class="customScroll" style="overflow: auto; height: auto;">
    	<div>
	        <h3 class="title">검색 결과</h3>
    	</div>
		<table id="mobileShareTable">
			<thead>
				<tr>
					<th width="35">순서</th>
					<th width="100" class="hidden">관리번호</th>
					<th width="180" class="hidden">URL</th>
					<th width="180">CCTV명</th>
					<th width="45" >확인</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<div class="paging_wrap"></div>
	<div style="display: none;">
		<h3 class="title">공유영상 상세정보</h3>
		<div id="ctntTable" class="box_style">
			<div class="info_box wd100">
	    		<span class="title">CCTV명</span>
	    		<p id="mobileShareCctvNm" class="content ctntTd"></p>
	    	</div>
	    	<div class="info_box wd100">
	    		<span class="title">URL</span>
	    		<p id="mobileShareUrl" class="content ctntTd"></p>
	    	</div>
	    	<div class="info_box wd100">
	    		<span class="title">TOKEN</span>
	    		<p id="mobileShareToken" class="content ctntTd"></p>
	    	</div>
		</div>
	</div>
</div>