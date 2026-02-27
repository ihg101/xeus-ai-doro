<%@page import="gmx.gis.nms.service.GMT_PingVo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<GMT_PingVo> list = (ArrayList<GMT_PingVo>) request.getAttribute("list");
%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.ping.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.ping.fn.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">

	<div id="loadAnalyzeName" class="tCenter text-overflow hidden">
		<h3 class="title"></h3>
	</div>

	<div class="tLeft">
		<h4 style="display:inline-block; padding: 15px 0px;">설정된 Ping 체크 목록</h4>
    	<button class="analySetBtn btn_Dstyle2" id="lyrSelectBtn" style="float: right; margin-right: 5px; margin-top: 12px;">대상 추가</button>
	</div>

    <div id="pingListWrap" style="padding: 30px 0px;">
    	<table>
    		<thead>
    			<tr>
    				<th>순번</th>
    				<th>레이어 명칭</th>
    				<th>대상 레이어 존재 여부</th>
    				<th>IP 대상 필드 영문명</th>
    				<th>IP 대상 필드 한글명</th>
    				<th>IP 대상 필드 존재 여부</th>
    				<th>체크 주기 (분)</th>
    				<th>마지막 체크 시간</th>
    				<th>체크 대상 총 건수</th>
    				<th>성공 건수</th>
    				<th>실패 건수</th>
    				<th>관리</th>
    			</tr>
    		</thead>
    		<tbody>
    		<% if(list.size() == 0){ %>
    			<tr>
    				<td colspan="12"><p style="margin: 200px 0px;">등록된 Ping 체크 대상 레이어가 존재하지 않습니다.</p></td>
    			</tr>
    		<% } %>
    		<% for(int i=0; i<list.size(); i++){ %>
    			<tr k="<%= list.get(i).getMgrSeq() %>" lk="<%= list.get(i).getLyrMgrSeq() %>" class="pingItem">
    				<td><%= i + 1 %></td>
    				<td><%= list.get(i).getLyrNm() %></td>
    				<td><%= list.get(i).isExistsTable() ? "존재" : "제거됨" %></td>
    				<td><%= list.get(i).getIpFieldEnNm() %></td>
    				<td><%= list.get(i).getIpFieldKrNm() %></td>
    				<td><%= list.get(i).isExistsColumn() ? "존재" : "제거됨" %></td>
    				<td><%= list.get(i).getIntervalMin() %></td>
    				<td><%= DateUtil.formatDate(list.get(i).getLastWorkDat()) %></td>
    				<td><%= list.get(i).getTotalCnt() %></td>
    				<td><%= list.get(i).getTotalCnt() - list.get(i).getFailCnt() %></td>
    				<td><%= list.get(i).getFailCnt() %></td>
    				<td>
    					<button class="btn_style2 delBtn" k="<%= list.get(i).getMgrSeq() %>">삭제</button>
   					<% if(list.get(i).isExistsTable() && list.get(i).isExistsColumn()){ %>
    					<button class="btn_style2 editBtn" k="<%= list.get(i).getMgrSeq() %>">설정</button>
   					<% } %>
   					</td>
    			</tr>
			<% } %>
			</tbody>
		</table>
    </div>

    <div id="dragWrap" class="hidden customScroll"></div>

	<div id="columnWrap" class="hidden table_style customScroll">
		<div id="listWrap">
			<table id="weightSetTable" style="width: 100%;">
				<thead>
					<tr>
						<th>선택된 레이어</th>
						<td id="lyrMgrSeq" width="200px">미선택</td>
						<th>선택된 필드</th>
						<td id="ipFieldNm" width="200px">미선택</td>
						<th>체크 주기(분)</th>
						<td><input id="intervalMin" class='tCenter' type='number' value='10' min="1" max="1440" step="1"></td>
						<td><button class="btn_style" id="regLayerBtn">저장</button></td>
					</tr>
					<tr>
						<td colspan="7">
							<h3 id="selectLayerText"></h3><br>
							<h3 id="selectColumnText">아래의 테이블에서 <b style="color: rgb(255, 0, 0);">IP 정보 필드명</b>을 선택하시고 <b style="color: rgb(255, 0, 0);">체크 주기 설정</b> 후 저장 버튼을 누르면 설정이 완료됩니다.</h3>
						</td>
					</tr>
				</thead>
			</table>
			<table id="weightTable" style="width: 100%;">
				<thead></thead>
				<tbody></tbody>
			</table>
		</div>

		<h3 class="tCenter" style="margin: 0px;">데이터는 최대 100건까지 표시됩니다.</h3>
	</div>

</div>