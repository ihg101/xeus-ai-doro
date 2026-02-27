<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvUnregVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvModelVo"%>
<%@ page import="geomex.xeus.equipmgr.service.VmsVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="org.json.simple.parser.JSONParser"%>
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.JSONArray"%>
<%@ include file="../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C14");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<VmsVo> vms = (ArrayList<VmsVo>) request.getAttribute("vms");
ArrayList<CctvModelVo> model = (ArrayList<CctvModelVo>) request.getAttribute("model");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<CctvVo> gbnNmList = (ArrayList<CctvVo>) request.getAttribute("gbn");
String result = (String) request.getAttribute("result");

JSONParser parser = new JSONParser();
JSONObject jo = null;
JSONArray ja = null;
if(result != null && !"".equals(result) && !"null".equals(result)){
	jo = (JSONObject) parser.parse(result);
	if(jo.containsKey("channels")){
		ja = (JSONArray) jo.get("channels");
	}
}

String cctvNm = "";
String chnlNo = "";
String deviceId = "";
String ipAddr = "";
String ptz = "";
String ptzPosition = "";
String modelId = "";
String modelName = "";

HashMap<String, String> param = (HashMap<String, String>) request.getAttribute("param");
if(param != null){
	if(param.containsKey("cctvNm")) cctvNm = param.get("cctvNm");
	if(param.containsKey("chnlNo")) chnlNo = param.get("chnlNo");
	if(param.containsKey("deviceId")) deviceId = param.get("deviceId");
	if(param.containsKey("ipAddr")) ipAddr = param.get("ipAddr");
}

if(jo != null){
	if(jo.containsKey("name")) cctvNm = (String) jo.get("name");
	//if(ja.size() < 0) chnlNo = (String) ja.get(0);
	if(jo.containsKey("addr")) ipAddr = (String) jo.get("addr");
	if(jo.containsKey("ptz")) ptz = (String) jo.get("ptz");
	if(jo.containsKey("ptzPosition")) ptzPosition = (String) jo.get("ptzPosition");
	if(jo.containsKey("modelId")) modelId = (String) jo.get("modelId");
	if(jo.containsKey("modelName")) modelName = (String) jo.get("modelName");
}

%>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.cctv.unreg.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<table>
	<tr>
		<th>명칭</th>
		<td colspan="3">
			<input type="text" id="cctvNm" name="cctvNm" class="sendData" value="<%=cctvNm%>">
		</td>
	</tr>
	<tr>
		<th>설치목적</th>
		<td>
			<select id=gbnCd name="gbnCd" class="sendData">
				<option value=""></option>
<% while(gbnItr.hasNext()){
	String str = (String) gbnItr.next(); %>
					<option value="<%= str %>"><%= gbn.get(str) %></option>
<% } %>
			</select>
		</td>
		<th>모델</th>
		<td>
			<select id="mdMgrNo" name="mdMgrNo" class="sendData">
<% if(modelName != null && !"".equals(modelName) && modelId != null && !"".equals(modelId)){ %>
				<option value="<%= modelId + ":::" + modelName %>" selected="selected"><%= modelName %></option>
<% }else{ %>
				<option value=""></option>
<% for(int i=0; i<model.size(); i++){ %>
				<option value="<%= model.get(i).getMgrNo() %>"><%= model.get(i).getMakerNm() + " - " + model.get(i).getModelNm() %></option>
<% }} %>
			</select>
		</td>
	</tr>
	<tr>
		<th>관리기관</th>
		<td>
		 	<select id="orgMgrNo" name="orgMgrNo" class="sendData">
			<option value=""></option>
<% for(int i=0; i<orgz.size(); i++){ %>
			<option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
			</select>
		</td>
		<th>VMS 종류</th>
		<td>
			<select id="vmsMgrNo" name="vmsMgrNo" class="sendData">
				<option value=""></option>
<% for(VmsVo vmsVo : vms){ %>
	<% if("VMS0000001".equals(vmsVo.getMgrNo())){%>
		<option selected value="<%= vmsVo.getMgrNo() %>"><%= vmsVo.getVmsNm() + "(" + vmsVo.getVmsTyp() + ")" %></option>
	<% } else { %>
		<option value="<%= vmsVo.getMgrNo() %>"><%= vmsVo.getVmsNm() + "(" + vmsVo.getVmsTyp() + ")" %></option>
	<%}%>
<% } %>
			</select>
		</td>
	</tr>
	<tr>
		<th>접속 디바이스<br>번호</th>
		<td>
			<input type="text" id="deviceId" name="deviceId" class="sendData" value="<%=deviceId%>">
		</td>
		<th>접속 채널번호</th>
		<td>
			<select id="chnlNo" name="chnlNo" class="sendData">
<% if(ja == null){ %>
				<option value="0">0</option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
<% }else{ %>
	<% for(int i=0; i<ja.size(); i++){ %>
				<option value="<%= ja.get(i) %>"><%= ja.get(i) %></option>
	<% } %>
<% } %>
			</select>
		</td>
	</tr>
	<tr>
		<th>옵션</th>
		<td colspan="3">
			<input type="checkbox" id="useYn" name="useYn" class="sendData" checked="checked"><label for="useYn">사용</label>
			<input type="checkbox" id="panYn" name="panYn" class="sendData" <%= "true".equals(ptz) ? "checked" : "" %>><label for="turnYn">회전</label>
			<input type="checkbox" id="lightYn" name="lightYn" class="sendData"><label for="lightYn">조명</label>
			<input type="checkbox" id="infrdYn" name="infrdYn" class="sendData"><label for="infrdYn">적외선</label>
			<input type="checkbox" id="tiltYn" name="tiltYn" class="sendData" <%= "true".equals(ptz) ? "checked" : "" %>><label for="tiltYn">틸트</label>
			<input type="checkbox" id="zoomYn" name="zoomYn" class="sendData" <%= "true".equals(ptz) ? "checked" : "" %>><label for="zoomYn">줌</label>
			<input type="checkbox" id="talkYn" name="talkYn" class="sendData"><label for="talkYn">음성지원</label>
			<input type="checkbox" id="tourYn" name="tourYn" class="sendData"><label for="talkYn">투어링</label>
		</td>
	</tr>
	<tr>
		<th>IP</th>
		<td>
			<input type="text" id="ipAddr" name="ipAddr" class="sendData" value="<%=ipAddr%>">
		</td>
		<th>Port</th>
		<td>
			<input type="text" id="portNum" name="portNum" class="sendData" value="">
		</td>
	</tr>
	<tr>
		<th>계정</th>
		<td>
			<input type="text" id="conId" name="conId" class="sendData" value="">
		</td>
		<th>암호</th>
		<td>
			<input type="text" id="conPwd" name="conPwd" class="sendData" value="">
		</td>
	</tr>
	<tr>
		<th>경도</th>
		<td>
			<input type="text" id="lng" name="lng" class="sendData" value="">
		</td>
		<th>위도</th>
		<td>
			<input type="text" id="lat" name="lat" class="sendData" value="">
		</td>
	</tr>
	<tr>
		<th colspan="4" class="pointer tCenter hidden selectCancel">선택을 취소하려면 여기를 눌러주세요.</th>
	</tr>
	<tr>
		<th>위치설명</th>
		<td colspan="3">
			<input type="text" id="locDesc" name="locDesc" class="sendData" value="">
		</td>
	</tr>
	<tr>
		<th>설치일자</th>
		<td>
			<input type="text" id="instDat" name="instDat" class="sendData datePicker" value="" placeholder="년월일시분초">
		</td>
		<th>사업년도</th>
		<td>
			<input type="text" id="constYear" name="constYear" class="sendData" value="">
		</td>
	</tr>
	<tr>
		<th>사업명</th>
		<td colspan="3">
			<input type="text" id="constNm" name="constNm" class="sendData" value="">
		</td>
	</tr>
	<tr>
		<th>비고</th>
		<td colspan="3">
			<input type="text" id="rmark" name="rmark" class="sendData" value="">
		</td>
	</tr>
</table>
<div class="btnDiv" style="text-align: right;">
	<button class="btn_style2" id="mapClickBtn" style="float: left; width:130px; height: 32px;">지도에서 위치 선택</button>
	<button class="btn_style2" id="saveBtn" style="width:60px; height: 32px;">저장</button>
</div>