<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.nms.sync.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div id="cctvSyncView" class="contentWrapper customScroll">

	<div id="loading_wrap" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; display: none;">
		<span id="loading_img"></span> <span id="loading_blank"></span>
	</div>

	<h3 class="title tRight">
		<b style="position: absolute; top: 25px; left: 20px;">조회 결과</b>
		<button class="btn_style2" id="newRegBtn">신규 추가</button>
		<button class="btn_style2" id="cctvSyncBtn">목록 조회</button>
   	</h3>
	<table id="resultTable">
		<thead>
			<tr>
				<th width="70">구분</th>
				<th>명칭</th>
				<th width="75">관리</th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
</div>