<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C12");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.nms.infra.add.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div>
	<table id="regTable" class="list">
		<tr>
			<th>관리기관</th>
			<td colspan="3">
				<select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
<% for(int i=0; i<orgz.size(); i++){ %>
					<option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
				</select>
			</td>
		</tr>
		<tr>
			<th>시설구분</th>
			<td colspan="3">
				<select id="fclGbnCd" name="fclGbnCd" class="wide sendData">
					<option value="14">산업용 스위치</option>
<%-- <%
	while(gbnItr.hasNext()){
		String str = (String) gbnItr.next();
		if("14".equals(str) || "23".equals(str) || "24".equals(str) || "25".equals(str) || "26".equals(str) || "27".equals(str)){
%>
					<option value="<%= str %>"><%= gbn.get(str) %></option>
<%
	}
}
%> --%>
				</select>
			</td>
		</tr>
		<tr>
			<th>설치일자</th>
			<td colspan="3">
				<input type="text" id="instDat" name="instDat" class="wide sendData datePicker" value="" readonly="readonly">
			</td>
		</tr>
		<tr>
			<th>그룹코드</th>
			<td colspan="3">
				<input type="text" id="facilityClscd" name="facilityClscd" class="wide sendData" value="" style="text-transform: uppercase;">
			</td>
		</tr>
		<tr>
			<th>장비명</th>
			<td colspan="3">
				<input type="text" id="facilityNm" name="facilityNm" class="wide sendData" value="">
			</td>
		</tr>
		<tr>
			<th>장비식별번호</th>
			<td colspan="3">
				<input type="text" id="facilityId" name="facilityId" class="wide sendData" value="">
			</td>
		</tr>
		<tr>
			<th>IP</th>
			<td>
				<input type="text" id="ipAddr" name="ipAddr" class="wide sendData" value="">
			</td>
			<th>PORT</th>
			<td>
				<input type="text" id="portNum" name="portNum" class="wide sendData" value="">
			</td>
		</tr>
		<tr>
			<th>상태체크여부</th>
			<td>
				<input type="checkbox" id="statChkYn" name="statChkYn" class="sendData" ><label for="statChkYn">상태</label>
			</td>
			<th>사용여부</th>
			<td>
				<input type="checkbox" id="useYn" name="useYn" class="sendData" ><label for="useYn">사용</label>
			</td>
		</tr>
		<tr>
			<th>접속ID</th>
			<td>
				<input type="text" id="conId" name="conId" class="wide sendData" value="">
			</td>
			<th>접속암호</th>
			<td>
				<input type="text" id="conPwd" name="conPwd" class="wide sendData" value="">
			</td>
		</tr>
		<tr>
			<th>SNMP인증문자</th>
			<td colspan="3">
				<input type="text" id="snmpStr" name="snmpStr" class="wide sendData" value="">
			</td>
		</tr>
		<tr>
			<th>비고</th>
			<td colspan="3">
				<input type="text" id="rmark" name="rmark" class="wide sendData" value="">
			</td>
		</tr>
		<tr>
			<th>경도</th>
			<td>
				<input type="text" id="lng" name="lng" class="wide sendData" value="">
			</td>
			<th>위도</th>
			<td>
				<input type="text" id="lat" name="lat" class="wide sendData" value="">
			</td>
		</tr>
		<tr>
			<th colspan="4" class="pointer tCenter hidden selectCancel">선택을 취소하려면 여기를 눌러주세요.</th>
		</tr>
	</table>

	<div class="btnDiv" style="text-align: right;">
		<button class="btn_style2" id="mapClickBtn" style="float: left; width:130px; height: 32px;">지도에서 위치 선택</button>
		<button class="btn_style2" id="saveBtn" style="width:60px; height: 32px;">저장</button>
	</div>
</div>
