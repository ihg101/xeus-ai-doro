<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="gmx.gis.api.service.GMT_RestAPIVo"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<GMT_RestAPIVo> list = (ArrayList<GMT_RestAPIVo>) request.getAttribute("list");
%>
<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.rest.api.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">

	<div class="tLeft">
		<h4 style="display:inline-block; padding: 15px 0px;"></h4>
    	<button class="btn_style2" id="docDownBtn" style="float: right; margin-right: 5px; margin-top: 12px;">API 개발 명세서 다운로드</button>
    	<button class="btn_Dstyle" id="addRESTAPIBtn" style="float: right; margin-right: 5px; margin-top: 12px;">신규 추가</button>
	</div>

    <div id="apiListWrap">
    	<table>
    		<thead>
    			<tr>
    				<th width="100">순번</th>
    				<th width="200">소속명</th>
    				<th width="200">개발자 이름</th>
    				<th width="200">API 종류</th>
    				<th>API KEY</th>
    				<th width="200">등록자 ID</th>
    				<th width="200">API 승인일</th>
    				<th width="150">관리</th>
    			</tr>
    		</thead>
    		<tbody>
    		<% if(list.size() == 0){ %>
    			<tr>
    				<td colspan="8"><p style="margin: 200px 0px;">등록된 REST API가 존재하지 않습니다.</p></td>
    			</tr>
    		<% } %>
    		<% for(int i=0; i<list.size(); i++){ %>
    			<tr k="<%= list.get(i).getMgrSeq() %>" class="restItem">
    				<td><%= i + 1 %></td>
    				<td><%= StringUtils.defaultIfEmpty(list.get(i).getCompanyNm(), "") %></td>
    				<td><%= StringUtils.defaultIfEmpty(list.get(i).getDeveloperNm(), "") %></td>
    				<td><%= StringUtils.defaultIfEmpty(list.get(i).getApiTyp(), "") %></td>
    				<td class="saveClipboardAPIKey" style="cursor: pointer; color: #7780ff;"><%= StringUtils.defaultIfEmpty(list.get(i).getApiKey(), "") %></td>
    				<td><%= StringUtils.defaultIfEmpty(list.get(i).getRegUsrId(), "") %></td>
    				<td><%= DateUtil.formatDate(list.get(i).getRegDat()) %></td>
    				<td>
    					<button class="btn_style2 delBtn" k="<%= list.get(i).getMgrSeq() %>">삭제</button>
    					<button class="btn_style2 editBtn" k="<%= list.get(i).getMgrSeq() %>">수정</button>
   					</td>
    			</tr>
			<% } %>
			</tbody>
		</table>
    </div>

	<div id="regDialogWrap" class="hidden table_style customScroll">
		<table>
			<tr class="hidden">
				<th width="150">관리번호</th>
				<td>
					<input id="mgrSeq" class="sendData">
				</td>
			</tr>
			<tr>
				<th width="150">소속명</th>
				<td>
					<input id="companyNm" class="sendData">
				</td>
			</tr>
			<tr>
				<th>개발자 이름</th>
				<td>
					<input id="developerNm" class="sendData">
				</td>
			</tr>
			<tr>
				<th>API 종류</th>
				<td>
					<select id="apiTyp" class="sendData">
						<option value="시설물관리">시설물관리</option>
					</select>
				</td>
			</tr>
		</table>
		<button id="saveBtn" class="btn_style">저장</button>
	</div>

	<div id="dragWrap" class="hidden customScroll"></div>

</div>