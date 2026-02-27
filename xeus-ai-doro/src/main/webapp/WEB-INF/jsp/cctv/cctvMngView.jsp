<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvModelVo"%>
<%@ page import="geomex.xeus.equipmgr.service.VmsVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="java.util.Arrays"%>
<%@ include file="../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C14");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<ImageVo> img = (ArrayList<ImageVo>) request.getAttribute("img");

ArrayList<VmsVo> vms = (ArrayList<VmsVo>) request.getAttribute("vms");

CctvVo vo = (CctvVo) request.getAttribute("vo");
ArrayList<CctvModelVo> model = (ArrayList<CctvModelVo>) request.getAttribute("model");
ArrayList<CctvVo> gbnNmList = (ArrayList<CctvVo>) request.getAttribute("gbn");

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.cctv.reg.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div>
<% if(vo != null){ %>
	<table>
		<tr>
			<th>명칭</th>
			<td colspan="3">
				<input type="text" id="cctvNm" name="cctvNm" class="sendData wide" value="<%= StrUtil.chkNull(vo.getCctvNm()) %>">
			</td>
		</tr>
		<tr>
			<th>설치목적</th>
			<td>
				<select id=gbnCd name="gbnCd" class="sendData">
					<option value=""></option>
		<% while(gbnItr.hasNext()){
		String str = (String) gbnItr.next(); %>
						<option value="<%= str %>" <%=vo.getGbnNm().equals(gbn.get(str)) ? "selected" : "" %>><%= gbn.get(str) %></option>
		<% } %>
				</select>
			</td>
			<th>모델</th>
			<td>
				<select id="mdMgrNo" name="mdMgrNo" class="sendData wide">
					<option value=""></option>
<% for(int i=0; i<model.size(); i++){
	String modelNm = "";
	if(StringUtils.isEmpty(model.get(i).getMakerNm())){
		modelNm = model.get(i).getModelNm();
	}else{
		modelNm = model.get(i).getMakerNm() + " - " + model.get(i).getModelNm();
	}
	String selected = model.get(i).getMgrNo().equals(vo.getMdMgrNo()) ? "selected" : ""; %>
					<option value="<%= model.get(i).getMgrNo() %>" <%= selected %>><%= modelNm %></option>
<% } %>
				</select>
				<%-- <input type="text" id="mdMgrNo" name="mdMgrNo" class="sendData wide" value="<%= StrUtil.chkNull(vo.getMdMgrNo().trim()) %>" maxlength="10"> --%>
			</td>
		</tr>
		<tr>
			<th>관리기관</th>
			<td>
				<select id="orgMgrNo" name="orgMgrNo" class="sendData wide">
					<option value=""></option>
<% for(int i=0; i<orgz.size(); i++){ %>
					<option value="<%= orgz.get(i).getOrgMgrNo() %>" <%= StrUtil.chkNull(vo.getOrgMgrNo()).equals(orgz.get(i).getOrgMgrNo()) ? "selected" : "" %>><%= orgz.get(i).getOrgNm() %></option>
<% } %>
				</select>
			</td>
			<th>VMS 종류</th>
			<td>
				<select id="vmsMgrNo" name="vmsMgrNo" class="sendData wide">
<% for(VmsVo vmsVo : vms){ %>
					<option value="<%= vmsVo.getMgrNo() %>"><%= vmsVo.getVmsNm() + "(" + vmsVo.getVmsTyp() + ")" %></option>
<% } %>
				</select>
			</td>
		</tr>
		<tr>
			<th>접속 디바이스 번호</th>
			<td>
				<input type="text" id="deviceId" name="deviceId" class="sendData wide" value="<%= StrUtil.chkNull(vo.getDeviceId()) %>">
			</td>
			<th>접속 채널번호</th>
			<td>
				<input type="text" id="chnlNo" name="chnlNo" class="sendData wide" value="<%= vo.getChnlNo() %>">
			</td>
		</tr>
		<tr>
			<th>옵션</th>
			<td colspan="3">
				<input type="checkbox" id="useYn" name="useYn" class="sendData" <%= "Y".equals(vo.getUseYn()) ? "checked" : "" %>><label for="useYn">사용</label>
				<input type="checkbox" id="panYn" name="panYn" class="sendData" <%= "Y".equals(vo.getPanYn()) ? "checked" : "" %>><label for="panYn">회전</label>
				<input type="checkbox" id="lightYn" name="lightYn" class="sendData" <%= "Y".equals(vo.getLightYn()) ? "checked" : "" %>><label for="lightYn">조명</label>
				<input type="checkbox" id="infrdYn" name="infrdYn" class="sendData" <%= "Y".equals(vo.getInfrdYn()) ? "checked" : "" %>><label for="infrdYn">적외선</label>
				<input type="checkbox" id="tiltYn" name="tiltYn" class="sendData" <%= "Y".equals(vo.getTiltYn()) ? "checked" : "" %>><label for="tiltYn">틸트</label>
				<input type="checkbox" id="zoomYn" name="zoomYn" class="sendData" <%= "Y".equals(vo.getZoomYn()) ? "checked" : "" %>><label for="zoomYn">줌</label>
				<input type="checkbox" id="talkYn" name="talkYn" class="sendData" <%= "Y".equals(vo.getTalkYn()) ? "checked" : "" %>><label for="talkYn">음성지원</label>
				<input type="checkbox" id="tourYn" name="tourYn" class="sendData" <%= "Y".equals(vo.getTourYn()) ? "checked" : "" %>><label for="tourYn">투어링</label>
			</td>
		</tr>
		<tr>
			<th>IP</th>
			<td>
				<input type="text" id="ipAddr" name="ipAddr" class="sendData wide" value="<%= StrUtil.chkNull(vo.getIpAddr()).trim() %>">
			</td>
			<th>Port</th>
			<td>
				<input type="text" id="portNum" name="portNum" class="sendData wide" value="<%= StrUtil.chkNull(vo.getPortNum()) %>">
			</td>
		</tr>
		<tr>
			<th>계정</th>
			<td>
				<input type="text" id="conId" name="conId" class="sendData wide" value="<%= StrUtil.chkNull(vo.getConId()) %>">
			</td>
			<th>암호</th>
			<td>
				<input type="text" id="conPwd" name="conPwd" class="sendData wide" value="<%= StrUtil.chkNull(vo.getConPwd()) %>">
			</td>
		</tr>
		<tr>
			<th>경도</th>
			<td>
				<input type="text" id="lng" name="lng" class="sendData wide" value="<%= StrUtil.chkNull(vo.getLng()) %>">
			</td>
			<th>위도</th>
			<td>
				<input type="text" id="lat" name="lat" class="sendData wide" value="<%= StrUtil.chkNull(vo.getLat()) %>">
			</td>
		</tr>
		<tr>
			<th colspan="4" class="pointer tCenter hidden selectCancel">선택을 취소하려면 여기를 눌러주세요.</th>
		</tr>
		<tr>
			<th>위치설명</th>
			<td colspan="3">
				<input type="text" id="locDesc" name="locDesc" class="sendData wide" value="<%= StrUtil.chkNull(vo.getLocDesc()) %>">
			</td>
		</tr>
		<tr>
			<th>설치일자</th>
			<td>
				<input type="text" id="instDat" name="instDat" class="sendData wide" value="<%= StrUtil.chkNull(vo.getInstDat()).trim() %>" placeholder="년월일시분초">
			</td>
			<th>사업년도</th>
			<td>
				<input type="text" id="constYear" name="constYear" class="sendData wide" value="<%= StrUtil.chkNull(vo.getConstYear()) %>">
			</td>
		</tr>
		<tr>
			<th>사업명</th>
			<td colspan="3">
				<input type="text" id="constNm" name="constNm" class="sendData wide" value="<%= StrUtil.chkNull(vo.getConstNm()) %>">
			</td>
		</tr>
		<tr>
			<th>비고</th>
			<td colspan="3">
				<input type="text" id="rmark" name="rmark" class="sendData wide" value="<%= StrUtil.chkNull(vo.getRmark()) %>">
			</td>
		</tr>
<%
String[] gbnChkArr = {"10", "11", "13", "18", "20"};
boolean isR = false;
boolean isS = false;
String[] cctvNmSplit = StrUtil.chkNull(vo.getCctvNm()).split(";");
if(cctvNmSplit.length >= 2) {
	isR = (cctvNmSplit[1].indexOf("R") > -1 || cctvNmSplit[1].indexOf("r") > -1);
	isS = (cctvNmSplit[1].indexOf("S") > -1 || cctvNmSplit[1].indexOf("s") > -1);
}

if( Arrays.asList(gbnChkArr).contains(StrUtil.chkNull(vo.getGbnCd())) && isR){
//if("10".equals(vo.getGbnCd())){

%>
		<tr class="hidden">
			<th>프리셋</th>
			<td colspan="3" class="tCenter">
<%	for(int i=11; i<21; i++){ %>
				<button class="whiteBtn left presetBtn" idx="<%= i %>" mgrNo="<%= vo.getMgrNo() %>"><%= i %></button>
<% } %>
			</td>
		</tr>
<% } %>
		<tr>
			<th colspan="4" class="pointer tCenter hidden selectPresetCancel">프리셋 설정을 취소하려면 여기를 눌러주세요.</th>
		</tr>
<!--
180409 이은규
촬영각도 설정 기능 추가
-->
<%
if(isS){
%>
		<tr>
			<th>촬영각도</th>
			<td>
<%
	String angle = StrUtil.chkNull(vo.getAngle());
	if("".equals(angle)) angle = "-1";
%>
				<input type="number" min="-1" max="360" id="angle" name="angle" class="sendData wide" value="<%= angle %>">
				<input type="hidden" id="centerX" value="<%= StrUtil.chkNull(vo.getCenterX())%>">
				<input type="hidden" id="centerY" value="<%= StrUtil.chkNull(vo.getCenterY())%>">
			</td>
			<td colspan="2">
				<button id="angleBtn" class="btn_style2">찰영각도설정</button>
				<button id="angleResetBtn" class="btn_style2">초기화</button>
			</td>
		</tr>
<%
}
%>
		<tr>
			<th colspan="4" class="pointer tCenter hidden selectAngleCancel">촬영각도 설정을 취소하려면 여기를 눌러주세요.</th>
		</tr>
		<tr class="hidden">
			<th colspan="4">사진
				<button class="imgBtn addImageBtn" id="uploadBtn"><img class="close" height="16px" width="16px" src="/xeus/res/img/add.png"></button>
			</th>
		</tr>
		<tr class="tCenter hidden">
			<td colspan="4" id="imgWrapper">
				<form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
					<input type="text" name="k" id="k" class="hidden" value="<%= vo.getMgrNo() %>">
					<input type="text" name="i" id="i" class="hidden" value="0">
					<!-- <input type="text" name="p" id="p" class="hidden" value="\upload\nms\"> -->
					<input type="text" name="p" id="p" class="hidden" value="\nms\">
					<input type="file" name="uploadImg" id="uploadImg" class="hidden" accept="image/gif, image/jpeg, image/png">
				</form>
<% if(img == null){ %>
				<p style="padding: 50px 0px;"><b>이미지가 존재하지 않습니다.</b></p>
<% }else{ %>
	<% for(int i=0; i<img.size(); i++){ %>
				<span class="imgBox">
					<img class="imgs" alt="<%= img.get(i).getFileNm() %>" src="../image/getImage.do?mgrSeq=<%= img.get(i).getMgrSeq() %>" k="<%= img.get(i).getMgrSeq() %>" onerror="this.src='../res/img/no_img.png'">
					<img class="close" src="../res/img/close_btn.png" k="<%= img.get(i).getMgrSeq() %>">
				</span>
	<% } %>
<% } %>
			</td>
		</tr>
	</table>
<% } %>
	<div class="btnDiv" style="text-align: right;" <% if(vo != null){ %> k="<%= vo.getMgrNo() %>" <% } %>>
		<button class="btn_style2" id="mapClickBtn" style="float: left; width:130px; height: 32px;">지도에서 위치 선택</button>
		<button class="btn_style2" id="delBtn" style="width:60px; height: 32px;">삭제</button>
		<button class="btn_style2" id="saveBtn" style="width:60px; height: 32px;">저장</button>
	</div>
</div>
