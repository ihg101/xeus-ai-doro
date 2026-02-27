<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.bigdata.service.CctvInstallVo"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<CctvInstallVo> instYearList = (ArrayList<CctvInstallVo>) request.getAttribute("instYear");

HashMap<String, String> map = (HashMap<String, String>) session.getAttribute("cctvInstallParam");

if(map == null) map = new HashMap<String, String>();

String cctvInstallMgrSeq = (String) session.getAttribute("cctvInstallMgrSeq");

String instYear = map.get("instYear");
String instMon = map.get("instMon");
String instDay = map.get("instDay");
String instYn = map.get("instYn");
String emd = map.get("emd");
String bjd = map.get("bjd");
String jibun = map.get("jibun");
String regReq = map.get("regReq");
String regReqOne = map.get("regReqOne");
String regReqTwo = map.get("regReqTwo");
String userName = map.get("userNm");
String userTell = map.get("userTell");

String limit = map.get("limit");
String offset = map.get("offset");
%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.bigdata.css">
<style>
/* .analySetBtn { */
/*     height: 28px; */
/*     background: #F3F3F3; */
/*     border: 1px solid #ddd; */
/*     color: #666; */
/*     float: right; */
/*     margin-right: 5px; */
/*     margin-top: 12px; */
/*     cursor: pointer; */
/* } */

.contentWrapper #resultTable {
	margin-bottom: 0px;
}

.contentWrapper #detailTable textarea {
	width: 100%;
	height: 200px;
}
</style>
<script>
var cctvInstallMgrSeq = <%= cctvInstallMgrSeq %>;
</script>
<script type="text/javascript" src="./res/menu/bigdataView/geomex.xeus.bigdata.cctv.install.search.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="cctvInstallSearchView overflow contentWrapper customScroll">

    <div class="tabTitle" style="text-align: right;">
        <!-- <button class="tab btn_Dstyle" url="/bigData/getSearchView.do">민원 검색</button> -->
        <button class="tab btn_Dstyle" url="/bigData/getAddView.do">민원 입력 화면으로 이동</button>
    </div>

    <table id="searchTable" class="searchTable">
        <tr>
            <th width="80px">민원일자</th>
            <td>
            	<select id="instYear" name="instYear" class="wide sendData">
                	<option value=""></option>
<% for(int i=0; i<instYearList.size(); i++){
	if(instYearList.get(i) != null && !"".equals(instYearList.get(i))){
	String instY = instYearList.get(i).getInstYear(); %>
                	<option <%= instY.equals(instYear) ? "selected" : "" %> value="<%= instY %>"><%= instY %>년</option>
<%
	}
}
%>
                </select>
            </td>
            <td>
            	<select id="instMon" name="instMon" class="wide sendData">
                	<option value=""></option>
<%
for(int i=1; i<13; i++){
	String month = "" + i;
	if(i < 10) month = "0" + i;
%>
                	<option <%= month.equals(instMon) ? "selected" : "" %> value="<%= month %>"><%= month %>월</option>
<%
}
%>
                </select>
            </td>
            <td>
            	<select id="instDay" name="instDay" class="wide sendData">
                	<option value=""></option>
<%
for(int i=1; i<32; i++){
	String day = "" + i;
	if(i < 10) day = "0" + i;
%>
                	<option <%= day.equals(instDay) ? "selected" : "" %> value="<%= day %>"><%= day %>일</option>
<%
}
%>
                </select>
            </td>
        </tr>
        <tr>
            <th width="80px">법정동</th>
            <td>
                <select id="bjd" name="bjd" class="wide sendData">
                	<option value=""></option>
					<option <%= "내곡동".equals(bjd) ? "selected" : "" %> value="내곡동">내곡동</option>
					<option <%= "반포동".equals(bjd) ? "selected" : "" %> value="반포동">반포동</option>
					<option <%= "방배동".equals(bjd) ? "selected" : "" %> value="방배동">방배동</option>
					<option <%= "서초동".equals(bjd) ? "selected" : "" %> value="서초동">서초동</option>
					<option <%= "신원동".equals(bjd) ? "selected" : "" %> value="신원동">신원동</option>
					<option <%= "양재동".equals(bjd) ? "selected" : "" %> value="양재동">양재동</option>
					<option <%= "염곡동".equals(bjd) ? "selected" : "" %> value="염곡동">염곡동</option>
					<option <%= "우면동".equals(bjd) ? "selected" : "" %> value="우면동">우면동</option>
					<option <%= "원지동".equals(bjd) ? "selected" : "" %> value="원지동">원지동</option>
					<option <%= "잠원동".equals(bjd) ? "selected" : "" %> value="잠원동">잠원동</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>지번주소</th>
            <td colspan="3">
				<input type="text" id="jibun" name="jibun" class="wide sendData" value="<%= StrUtil.chkNull(jibun) %>">
            </td>
        </tr>
        <!-- <tr>
            <th>지번주소</th>
            <td>
				<input type="text" id="jibun" name="jibun" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>경도</th>
            <td>
                <input type="text" id="lng" name="lng" class="wide sendData" value="">
            </td>
        </tr>
        <tr>
            <th>위도</th>
            <td>
                <input type="text" id="lat" name="lat" class="wide sendData" value="">
            </td>
        </tr>
        <tr>
            <th colspan="2" class="pointer tCenter hidden selectCancel">선택을 취소하려면 여기를 눌러주세요.</th>
        </tr> -->
        <tr>
            <th>요청사유1</th>
            <td>
                <select id="regReqOne" name="regReqOne" class="wide sendData">
                	<option <%= "".equals(regReqOne) ? "selected" : "" %> value=""></option>
                	<option <%= "분실/도난".equals(regReqOne) ? "selected" : "" %> value="분실/도난">분실/도난</option>
                	<option <%= "폭행/상해".equals(regReqOne) ? "selected" : "" %> value="폭행/상해">폭행/상해</option>
                	<option <%= "손괴/훼손".equals(regReqOne) ? "selected" : "" %> value="손괴/훼손">손괴/훼손</option>
                	<option <%= "차량사고".equals(regReqOne) ? "selected" : "" %> value="차량사고">차량사고</option>
                	<option <%= "쓰레기무단투기".equals(regReqOne) ? "selected" : "" %> value="쓰레기무단투기">쓰레기무단투기</option>
                	<option <%= "안전사고위험".equals(regReqOne) ? "selected" : "" %> value="안전사고위험">안전사고위험</option>
                	<option <%= "안전사고발생".equals(regReqOne) ? "selected" : "" %> value="안전사고발생">안전사고발생</option>
                	<option <%= "범죄위험".equals(regReqOne) ? "selected" : "" %> value="범죄위험">범죄위험</option>
                	<option <%= "범죄발생".equals(regReqOne) ? "selected" : "" %> value="범죄발생">범죄발생</option>
                	<option <%= "기타".equals(regReqOne) ? "selected" : "" %> value="기타">기타</option>
                </select>
            </td>
            <th>요청사유2</th>
            <td>
                <select id="regReqTwo" name="regReqTwo" class="wide sendData">
                	<option <%= "".equals(regReqTwo) ? "selected" : "" %> value=""></option>
                	<option <%= "분실/도난".equals(regReqTwo) ? "selected" : "" %> value="분실/도난">분실/도난</option>
                	<option <%= "폭행/상해".equals(regReqTwo) ? "selected" : "" %> value="폭행/상해">폭행/상해</option>
                	<option <%= "손괴/훼손".equals(regReqTwo) ? "selected" : "" %> value="손괴/훼손">손괴/훼손</option>
                	<option <%= "차량사고".equals(regReqTwo) ? "selected" : "" %> value="차량사고">차량사고</option>
                	<option <%= "쓰레기무단투기".equals(regReqTwo) ? "selected" : "" %> value="쓰레기무단투기">쓰레기무단투기</option>
                	<option <%= "안전사고위험".equals(regReqTwo) ? "selected" : "" %> value="안전사고위험">안전사고위험</option>
                	<option <%= "안전사고발생".equals(regReqTwo) ? "selected" : "" %> value="안전사고발생">안전사고발생</option>
                	<option <%= "범죄위험".equals(regReqTwo) ? "selected" : "" %> value="범죄위험">범죄위험</option>
                	<option <%= "범죄발생".equals(regReqTwo) ? "selected" : "" %> value="범죄발생">범죄발생</option>
                	<option <%= "기타".equals(regReqTwo) ? "selected" : "" %> value="기타">기타</option>
                </select>
            </td>
        </tr>
        <!-- <tr>
            <th>요청사항</th>
            <td>
                <input type="text" id="regReq" name="regReq" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>설치여부</th>
            <td>
                <select id="instYn" name="instYn" class="wide sendData">
                	<option value=""></option>
                	<option value="미설치">미설치</option>
                	<option value="설치">설치</option>
                	<option value="설치불가">설치불가</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>중복여부</th>
            <td>
                <select id="ovrpYn" name="ovrpYn" class="wide sendData">
                	<option value=""></option>
                	<option value="--">--</option>
                	<option value="중복">중복</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>설치요구사유</th>
            <td>
                <input type="text" id="instRes" name="instRes" class="wide sendData">
            </td>
        </tr> -->
        <tr>
            <th>민원인 이름</th>
            <td>
                <input type="text" id="userNm" name="userNm" class="wide sendData" value="<%= StrUtil.chkNull(userName) %>">
            </td>
            <th>민원인 번호</th>
            <td>
                <input type="text" id="userTell" name="userTell" class="wide sendData" value="<%= StrUtil.chkNull(userTell) %>">
            </td>
        </tr>
        <tr>
            <th>민원 내용</th>
            <td>
                <input type="text" id="regReq" name="regReq" class="wide sendData" value="<%= StrUtil.chkNull(regReq) %>">
            </td>
            <th>설치여부</th>
            <td>
                <select id="instYn" name="instYn" class="wide sendData">
                	<option <%= "".equals(instYn) ? "selected" : "" %> value=""></option>
                	<option <%= "미설치".equals(instYn) ? "selected" : "" %> value="미설치">미설치</option>
                	<option <%= "설치".equals(instYn) ? "selected" : "" %> value="설치">설치</option>
                	<option <%= "설치불가".equals(instYn) ? "selected" : "" %> value="설치불가">설치불가</option>
                </select>
            </td>
        </tr>
        <!-- <tr>
            <th>연락처</th>
            <td>
                <input type="text" id="userTell" name="userTell" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>접수방법</th>
            <td>
                <input type="text" id="regHow" name="regHow" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>특이사항</th>
            <td>
                <input type="text" id="rmark" name="rmark" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>현장실사</th>
            <td>
                <input type="text" id="fieldInsp" name="fieldInsp" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>처리일시</th>
            <td>
                <input type="text" id="resDate" name="resDate" class="wide sendData datePicker" value="" readonly="readonly">
            </td>
        </tr> -->
    </table>

    <div class="btnDiv">
        <button class="blackBtn_Fill btn_style" id="searchBtn">검 색</button>
    </div>

    <!-- <h3 class="title" id="cntTxt">검색결과 <button class="analySetBtn btn_style2" id="upBtn">엑셀 업로드</button>
		<button class="analySetBtn btn_style2" id="downBtn">엑셀 다운로드</button></h3> -->
	<table>
		<tr>
			<td id="cntTxt"></td>
			<td><button class="analySetBtn btn_style2" id="upBtn">엑셀 업로드</button><button class="analySetBtn btn_style2" id="downBtn">엑셀 다운로드</button></td>
		</tr>
	</table>
    <table id="resultTable">
        <thead>
	        <tr>
	            <th>연번</th>
	            <th>행정동</th>
	            <th>법정동</th>
	            <th>산</th>
	            <th>지번</th>
	            <th>설치여부</th>
	            <th>수정</th>
	        </tr>
        </thead>
        <tbody></tbody>
    </table>
<% if(offset != null && !"".equals(offset)){ %>
	<input type="hidden" id="offset" value="<%= offset %>" />
<% }else{ %>
	<input type="hidden" id="offset" value="0" />
<% } %>

	<input type="hidden" id="max" value="" />
	<div class="paging_wrap"></div>

    <!-- <h3 class="title">상세정보 <button class="analySetBtn btn_style2" id="editBtn">내용수정</button></h3> -->
    <table>
		<tr>
			<td>상세정보</td>
			<td><button class="analySetBtn btn_style2" id="editBtn">내용수정</button></td>
		</tr>
	</table>
    <table id="detailTable">
        <tr class="hidden">
            <td id="detailMgrSeq" class="tCenter"><%= StrUtil.chkNull(map.get("detailMgrSeq")) %></td>
        </tr>
        <tr>
            <th>민원인</th>
            <td id="detailUserNm" class="tCenter sendData"><%= StrUtil.chkNull(map.get("detailUserNm")) %></td>
            <th>전화번호</th>
            <td id="detailUserTell" class="tCenter sendData"><%= StrUtil.chkNull(map.get("detailUserTell")) %></td>
        </tr>
        <tr>
            <th>요청사유1</th>
            <td id="detailRegReqOne" class="tCenter sendData"><%= StrUtil.chkNull(map.get("detailRegReqOne")) %></td>
            <th>요청사유2</th>
            <td id="detailRegReqTwo" class="tCenter sendData"><%= StrUtil.chkNull(map.get("detailRegReqTwo")) %></td>
        </tr>
        <tr>
            <th>민원일자</th>
            <td id="detailInstYmd" class="tCenter sendData"><%= StrUtil.chkNull("") %></td>
            <th>지번</th>
            <td id="detailJibun" class="tCenter sendData"><%= StrUtil.chkNull(map.get("detailJibun")) %></td>
        </tr>
        <tr>
            <th colspan="4">민원내용</th>
        </tr>
       	<tr>
       		<%-- <td colspan="4"><textarea class="sendData" readonly="readonly" disabled="disabled" style="background: white;border: none;resize: none;color: black;font-size: 13px;"><%= StrUtil.chkNull(map.get("detailRegReq")) %></textarea></td> --%>
       		<td colspan="4"><textarea class="sendData customScroll" readonly="readonly" disabled="disabled" style="border: none;resize: none;color: white;font-size: 13px;"><%= StrUtil.chkNull(map.get("detailRegReq")) %></textarea></td>
       	</tr>
    </table>

	<div id="uploadWrap">
		<img class="close" src="./res/img/close.png">
		<form method="POST" id="uploadForm" action="./bigData/addCctvInstallExcel.json" enctype="multipart/form-data" class="box has-advanced-upload">

			<div class="boxInput">
				<svg class="boxIcon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
				<input type="hidden" id="p" name="p" value="bigdata">
				<input type="file" name="file" id="file" class="boxFile">
				<label for="file" id="selectTxt"><strong>여기를 누르시거나</strong><br><span class="boxDragndrop">파일을 드롭해 주세요.</span></label>
				<label for="file" id="uploadTxt" class='hidden'><strong></strong><br><span class="boxDragndrop">파일이 선택되었습니다.</span></label>
				<button type="button" id="sendFile" class="boxButton">업로드</button>
			</div>

			<div class="boxUploading">Uploading…</div>
			<div class="boxSuccess">업로드 완료 <a href="https://css-tricks.com/examples/DragAndDropFileUploading//?submit-on-demand" class="boxRestart" role="button">다른 파일도 업로드 하시겠습니까?</a></div>
			<div class="boxError">업로드 실패 <span></span>. <a href="https://css-tricks.com/examples/DragAndDropFileUploading//?submit-on-demand" class="boxRestart" role="button">다시한번 시도해 주세요</a></div>
		</form>
	</div>
</div>