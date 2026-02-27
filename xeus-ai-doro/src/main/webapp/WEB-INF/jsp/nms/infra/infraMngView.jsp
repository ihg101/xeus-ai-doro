<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvModelVo"%>
<%@ page import="geomex.xeus.equipmgr.service.InfraVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C12");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<SiteVo> site = (ArrayList<SiteVo>) request.getAttribute("site");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<String> symList = (ArrayList<String>) request.getAttribute("sym");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");
ArrayList<LiVo> li = (ArrayList<LiVo>) request.getAttribute("li");
ArrayList<ImageVo> img = (ArrayList<ImageVo>) request.getAttribute("img");

InfraVo vo = (InfraVo) request.getAttribute("vo");
if(vo == null) vo = new InfraVo();
%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.nms.infra.edit.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div>
	<table id="regTable" class="list">
		<tr class="hidden">
			<th>관리번호</th>
			<td colspan="3">
				<input type="text" id="mgrNo" name="mgrNo" class="wide sendData" value="<%= StrUtil.chkNull(vo.getMgrNo()) %>">
			</td>
		</tr>
		<tr>
			<th width="100">관리기관</th>
			<td colspan="3">
				<select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
					<option value=""></option>
<% for(int i=0; i<orgz.size(); i++){ %>
					<option value="<%= orgz.get(i).getOrgMgrNo() %>" <%= StrUtil.chkNull(vo.getOrgMgrNo()).equals(orgz.get(i).getOrgMgrNo()) ? "selected" : "" %>><%= orgz.get(i).getOrgNm() %></option>
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
				<input type="text" id="instDat" name="instDat" class="wide sendData datePicker" value="<%= StrUtil.chkNull(vo.getInstDat()) %>" readonly="readonly">
			</td>
		</tr>
		<tr>
			<th>그룹코드</th>
			<td colspan="3">
				<input type="text" id="facilityClscd" name="facilityClscd" class="wide sendData" value="<%= StrUtil.chkNull(vo.getLocDesc()) %>" style="text-transform: uppercase;">
			</td>
		</tr>
		<tr>
			<th>장비명</th>
			<td colspan="3">
				<input type="text" id="facilityNm" name="facilityNm" class="wide sendData" value="<%= StrUtil.chkNull(vo.getFacilityNm()) %>">
			</td>
		</tr>
		<tr>
			<th>장비식별번호</th>
			<td colspan="3">
				<input type="text" id="facilityId" name="facilityId" class="wide sendData" value="<%= StrUtil.chkNull(vo.getFacilityId()) %>">
			</td>
		</tr>
		<tr>
			<th>IP</th>
			<td>
				<input type="text" id="ipAddr" name="ipAddr" class="wide sendData" value="<%= StrUtil.chkNull(vo.getIpAddr()).trim() %>">
			</td>
			<th>PORT</th>
			<td>
				<input type="text" id="portNum" name="portNum" class="wide sendData" value="<%= StrUtil.chkNull(vo.getPortNum()) %>">
			</td>
		</tr>
		<tr>
			<th>상태체크여부</th>
			<td>
				<input type="checkbox" id="statChkYn" name="statChkYn" class="sendData" <%= "Y".equals(vo.getStatChkYn()) ? "checked" : "" %>><label for="statChkYn">상태</label>
			</td>
			<th>사용여부</th>
			<td>
				<input type="checkbox" id="useYn" name="useYn" class="sendData" <%= "Y".equals(vo.getUseYn()) ? "checked" : "" %>><label for="useYn">사용</label>
			</td>
		</tr>
		<tr>
			<th>접속ID</th>
			<td>
				<input type="text" id="conId" name="conId" class="wide sendData" value="<%= StrUtil.chkNull(vo.getConId()) %>">
			</td>
			<th>접속암호</th>
			<td>
				<input type="text" id="conPwd" name="conPwd" class="wide sendData" value="<%= StrUtil.chkNull(vo.getConPwd()) %>">
			</td>
		</tr>
		<tr>
			<th>SNMP인증문자</th>
			<td colspan="3">
				<input type="text" id="snmpStr" name="snmpStr" class="wide sendData" value="<%= StrUtil.chkNull(vo.getSnmpStr()) %>">
			</td>
		</tr>
		<tr>
			<th>비고</th>
			<td colspan="3">
				<input type="text" id="rmark" name="rmark" class="wide sendData" value="<%= StrUtil.chkNull(vo.getRmark()) %>">
			</td>
		</tr>
		<tr>
			<th>경도</th>
			<td>
				<input type="text" id="lng" name="lng" class="wide sendData" value="<%= StrUtil.chkNull(vo.getLng()) %>">
			</td>
			<th>위도</th>
			<td>
				<input type="text" id="lat" name="lat" class="wide sendData" value="<%= StrUtil.chkNull(vo.getLat()) %>">
			</td>
		</tr>
		<tr>
			<th colspan="4" class="pointer tCenter hidden selectCancel">선택을 취소하려면 여기를 눌러주세요.</th>
		</tr>
	   <%-- <tr>
			<th colspan="4">사진
			<button class="imgBtn addImageBtn" id="uploadBtn"><img class="close" height="16px" width="16px" src="/xeus/res/img/add.png">
			</button>
			</th>
		</tr>
		<tr class="tCenter">
			<td colspan="4" id="imgWrapper">
				<form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data" style="width: 150px;">
					<input type="text" name="k" id="k" class="hidden" value="<%= StrUtil.chkNull(vo.getMgrNo()) %>">
					<input type="text" name="p" id="p" class="hidden" value="\nms\">
					<input type="file" name="uploadImg" class="uploadImg" accept="image/gif, image/jpeg, image/png">
				</form>
<% if(img == null){ %>
				<p style="padding: 150px 0px;"><b>이미지가 존재하지 않습니다.</b></p>
<% }else{ %>
	<% for(int i=0; i<img.size(); i++){ %>
				<span class="imgBox">
					<img class="imgs" alt="<%= img.get(i).getFileNm() %>" src="../image/getImage.do?mgrSeq=<%= img.get(i).getMgrSeq() %>" k="<%= img.get(i).getMgrSeq() %>" style="max-width: 400px; max-height: 400px;">
					<img class="close" src="../res/img/close_btn.png" k="<%= img.get(i).getMgrSeq() %>">
				</span>
	<% } %>
<% } %>
			</td>
		</tr> --%>
	</table>

	<div class="btnDiv" style="text-align: right;" k="<%= vo.getMgrNo() %>">
		<button class="btn_style2" id="mapClickBtn" style="float: left; width:130px; height: 32px;">지도에서 위치 선택</button>
		<button class="btn_style2" id="delBtn" style="width:60px; height: 32px;">삭제</button>
		<button class="btn_style2" id="saveBtn" style="width:60px; height: 32px;">저장</button>
	</div>
</div>
