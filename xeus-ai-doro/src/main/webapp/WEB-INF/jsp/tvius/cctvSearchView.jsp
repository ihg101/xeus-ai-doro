<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<CctvVo> list = (ArrayList<CctvVo>) request.getAttribute("result");

CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C14");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");
ArrayList<LiVo> li = (ArrayList<LiVo>) request.getAttribute("li");

HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");
String temp = param.get("offset");
String chkPage = "";
String emdCd = param.get("emdCd");
String orgMgrNm = param.get("orgMgrNm");
String gbnCd = param.get("gbnCd");
String cctvNm = param.get("cctvNm");
String admNm = param.get("admNm");

// String emdCd = "";
// String orgMgrNm = "";
// String gbnCd = "";
// String cctvNm = "";
if (param.containsKey("chkPage"))       chkPage = param.get("chkPage").trim();
// if (param.containsKey("emdCd"))       chkPage = param.get("emdCd").trim();
// if (param.containsKey("orgMgrNm"))       chkPage = param.get("orgMgrNo").trim();
// if (param.containsKey("gbnCd"))       chkPage = param.get("gbnCd").trim();
// if (param.containsKey("cctvNm"))       chkPage = param.get("cctvNm").trim();
%>
<script type="text/javascript" src="./res/menu/tviusView/geomex.xeus.tvius.cctv.search.js?v=<%= DateUtil.getStrMilSec() %>"></script>


<script type="text/javascript">

var chkPage = '<%=chkPage%>';
var emdCd = '<%=emdCd%>';
var orgMgrNo = '<%=orgMgrNm%>';
var gbnCd = '<%=gbnCd%>';
var cctvNm = '<%=cctvNm%>';

</script>
<div class="contentWrapper customScroll">
	<input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />
	<input type="hidden" id="offset" value="<%= temp %>" />
    <!-- <h3 class="title">CCTV 속성 검색</h3> -->
    <div id="searchTable" class="box_style">
    	<div class="info_box">
			<span class="title">행정동</span>
			<select id="admNm" name="admNm" class="sendData">
				<option value="">전체</option>
				<option <%= "서초1동".equals(admNm) ? "selected" : "" %> value="서초1동">서초1동</option>
				<option <%= "서초2동".equals(admNm) ? "selected" : "" %> value="서초2동">서초2동</option>
				<option <%= "서초3동".equals(admNm) ? "selected" : "" %> value="서초3동">서초3동</option>
				<option <%= "서초4동".equals(admNm) ? "selected" : "" %> value="서초4동">서초4동</option>
				<option <%= "잠원동".equals(admNm) ? "selected" : "" %> value="잠원동">잠원동</option>
				<option <%= "반포본동".equals(admNm) ? "selected" : "" %> value="반포본동">반포본동</option>
				<option <%= "반포1동".equals(admNm) ? "selected" : "" %> value="반포1동">반포1동</option>
				<option <%= "반포2동".equals(admNm) ? "selected" : "" %> value="반포2동">반포2동</option>
				<option <%= "반포3동".equals(admNm) ? "selected" : "" %> value="반포3동">반포3동</option>
				<option <%= "반포4동".equals(admNm) ? "selected" : "" %> value="반포4동">반포4동</option>
				<option <%= "방배본동".equals(admNm) ? "selected" : "" %> value="방배본동">방배본동</option>
				<option <%= "방배1동".equals(admNm) ? "selected" : "" %> value="방배1동">방배1동</option>
				<option <%= "방배2동".equals(admNm) ? "selected" : "" %> value="방배2동">방배2동</option>
				<option <%= "방배3동".equals(admNm) ? "selected" : "" %> value="방배3동">방배3동</option>
				<option <%= "방배4동".equals(admNm) ? "selected" : "" %> value="방배4동">방배4동</option>
				<option <%= "양재1동".equals(admNm) ? "selected" : "" %> value="양재1동">양재1동</option>
				<option <%= "양재2동".equals(admNm) ? "selected" : "" %> value="양재2동">양재2동</option>
				<option <%= "내곡동".equals(admNm) ? "selected" : "" %> value="내곡동">내곡동</option>
			</select>
		</div>
    	<div class="info_box">
    		<span class="title">법정동</span>
    		<select id="emdCd" name="emdCd" class="sendData">
                    <option value="">전체</option>
<% for(int i=0; i<emd.size(); i++){ %>
                    <option value="<%= emd.get(i).getEmdCd() %>"><%= emd.get(i).getEmdKorNm() %></option>
<% } %>
                </select>
    	</div>
    	<div class="info_box">
    		<span class="title">설치목적</span>
    		<select id="gbnCd" name="gbnCd" class="sendData">
                    <option value=""> 전체</option>
<% while(gbnItr.hasNext()){
    String str = (String) gbnItr.next();
    String code = "";
    if("10".equals(str)) code = "A ";
    if("11".equals(str)) code = "B ";
    if("12".equals(str)) code = "C ";
    if("13".equals(str)) code = "D ";
    if("14".equals(str)) code = "F ";
    if("15".equals(str)) code = "G ";
    if("16".equals(str)) code = "H ";
    if("17".equals(str)) code = "J ";
    if("18".equals(str)) code = "K ";
    if("19".equals(str)) code = "N ";
    if("20".equals(str)) code = "P ";
    if("21".equals(str)) code = "S ";
    if("22".equals(str)) code = "T ";
    if("23".equals(str)) code = "U ";
    if("24".equals(str)) code = "W ";
    if("99".equals(str)) code = "Z ";
    code = "";
    %>
                    <option value="<%= str %>"><%= code + gbn.get(str) %></option>
<% } %>
                </select>
				<script>
				$("").find("option").sortElements(function(a, b){
					return $(a).text() > $(b).text() ? 1 : -1;
				});
				</script>
    	</div>
    	<div class="info_box">
			<span class="title">명칭</span>
			<input type="text" id="cctvNm" name="cctvNm" class="sendData">
		</div>
    	<button class="btn_style" id="searchBtn">검 색</button>
    </div>
    <!-- <h3 class="title">영역 검색</h3> -->
    <div class="box_style">
    	<div class="info_box wd100">
    		<span class="title">영역 검색</span>
    		<label for="circle"><input type="radio" name="spatial" class="drawType" value="Circle" id="circle"> 반경</label>
    		<label for="box"><input type="radio" name="spatial" class="drawType" value="Box" id="box"> 사각형</label>
    		<label for="polygon"><input type="radio" name="spatial" class="drawType" value="Polygon" id="polygon"> 다각형</label>
    	</div>
    	<button id="drawCncl" class="hidden btn_Dstyle2" style="margin-left: auto;">그리기 종료</button>
    </div>
    <div>
		<div class="tRight" style="position: relative;">
			<h3 class="title" id="resultCnt" style="position: absolute; top: 10px; left: 0px; margin: 0px;">검색결과</h3>
			<!-- <button id="btn_play" class="btn_style2">전체재생</button> -->
			<button id="excelBtn" class="btn_style2">엑셀로 내보내기</button>
		</div>
	</div>

    <table id="resultTable" style="table-layout: auto;">
        <thead>
	        <tr>
	        	<th width="100">순서</th>
				<th width="150">구분</th>
				<th>명칭</th>
				<th width="50">위치</th>
	        </tr>
        </thead>
        <tbody></tbody>
    </table>
	<div class="paging_wrap"></div>

</div>