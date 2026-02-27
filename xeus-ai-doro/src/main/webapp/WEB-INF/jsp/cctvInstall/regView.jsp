<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.bigdata.service.CctvInstallVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../common.jsp" %>
<%
CctvInstallVo vo = (CctvInstallVo) request.getAttribute("vo");
String mode = "edit";
if(vo == null){
	vo = new CctvInstallVo();
	mode = "add";
}
%>
<script type="text/javascript" src="./res/menu/bigdataView/geomex.xeus.bigdata.cctv.install.add.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="overflow contentWrapper customScroll">

    <div class="tabTitle" style="text-align: right;">
		<button class="tab btn_Dstyle" url="/bigData/getSearchView.do" style="border:initial!important"></button>
        <!-- <button class="tab btn_Dstyle" url="/bigData/getAddView.do" active="active">민원 관리</button> -->
    </div>
    <table id="regTable" class="searchTable">
        <tr class="hidden">
            <th width="100px">고유번호</th>
            <td>
				<input type="text" id="mgrSeq" name="mgrSeq" class="wide sendData datePicker" value="<%= StrUtil.chkNull(vo.getMgrSeq()) %>" readonly="readonly">
            </td>
        </tr>
        <tr>
            <th width="100px">민원일자</th>
            <td>
<%
String instDate = "";
instDate += StrUtil.chkNull(vo.getInstYear());
instDate += StrUtil.chkNull(vo.getInstMon());
instDate += StrUtil.chkNull(vo.getInstDay());
%>
				<input type="text" id="instDate" name="instDate" class="wide sendData datePicker" value="<%= instDate %>" readonly="readonly">
            </td>
        </tr>
        <tr>
            <th>법정동</th>
            <td>
                <select id="bjd" name="bjd" class="wide sendData">
                	<option value=""></option>
					<option <%= "내곡동".equals(vo.getBjd()) ? "selected" : "" %> value="내곡동">내곡동</option>
					<option <%= "반포동".equals(vo.getBjd()) ? "selected" : "" %> value="반포동">반포동</option>
					<option <%= "방배동".equals(vo.getBjd()) ? "selected" : "" %> value="방배동">방배동</option>
					<option <%= "서초동".equals(vo.getBjd()) ? "selected" : "" %> value="서초동">서초동</option>
					<option <%= "신원동".equals(vo.getBjd()) ? "selected" : "" %> value="신원동">신원동</option>
					<option <%= "양재동".equals(vo.getBjd()) ? "selected" : "" %> value="양재동">양재동</option>
					<option <%= "염곡동".equals(vo.getBjd()) ? "selected" : "" %> value="염곡동">염곡동</option>
					<option <%= "우면동".equals(vo.getBjd()) ? "selected" : "" %> value="우면동">우면동</option>
					<option <%= "원지동".equals(vo.getBjd()) ? "selected" : "" %> value="원지동">원지동</option>
					<option <%= "잠원동".equals(vo.getBjd()) ? "selected" : "" %> value="잠원동">잠원동</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>산</th>
            <td>
				<input type="text" id="san" name="san" class="wide sendData" value="<%= StrUtil.chkNull(vo.getSan()) %>">
            </td>
        </tr>
        <tr>
            <th>지번주소</th>
            <td>
				<input type="text" id="jibun" name="jibun" class="wide sendData" value="<%= StrUtil.chkNull(vo.getJibun()) %>">
            </td>
        </tr>
        <tr>
            <th>경도</th>
            <td>
                <input type="text" id="lng" name="lng" class="wide sendData" value="<%= StrUtil.chkNull(vo.getLon()) %>">
            </td>
        </tr>
        <tr>
            <th>위도</th>
            <td>
                <input type="text" id="lat" name="lat" class="wide sendData" value="<%= StrUtil.chkNull(vo.getLat()) %>">
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <button class="blackBtn_Fill btn_Dstyle" id="mapClickBtn">지도에서 위치 선택</button>
            </td>
        </tr>
        <tr>
            <th colspan="2" class="pointer tCenter hidden selectCancel">선택을 취소하려면 여기를 눌러주세요.</th>
        </tr>
        <tr>
            <th>요청사유1</th>
            <td>
                <select id="regReqOne" name="regReqOne" class="wide sendData">
                	<option <%= "".equals(vo.getRegReqOne()) ? "selected" : "" %> value=""></option>
                	<option <%= "분실/도난".equals(vo.getRegReqOne()) ? "selected" : "" %> value="분실/도난">분실/도난</option>
                	<option <%= "폭행/상해".equals(vo.getRegReqOne()) ? "selected" : "" %> value="폭행/상해">폭행/상해</option>
                	<option <%= "손괴/훼손".equals(vo.getRegReqOne()) ? "selected" : "" %> value="손괴/훼손">손괴/훼손</option>
                	<option <%= "차량사고".equals(vo.getRegReqOne()) ? "selected" : "" %> value="차량사고">차량사고</option>
                	<option <%= "쓰레기무단투기".equals(vo.getRegReqOne()) ? "selected" : "" %> value="쓰레기무단투기">쓰레기무단투기</option>
                	<option <%= "안전사고위험".equals(vo.getRegReqOne()) ? "selected" : "" %> value="안전사고위험">안전사고위험</option>
                	<option <%= "안전사고발생".equals(vo.getRegReqOne()) ? "selected" : "" %> value="안전사고발생">안전사고발생</option>
                	<option <%= "범죄위험".equals(vo.getRegReqOne()) ? "selected" : "" %> value="범죄위험">범죄위험</option>
                	<option <%= "범죄발생".equals(vo.getRegReqOne()) ? "selected" : "" %> value="범죄발생">범죄발생</option>
                	<option <%= "기타".equals(vo.getRegReqOne()) ? "selected" : "" %> value="기타">기타</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>요청사유2</th>
            <td>
                <select id="regReqTwo" name="regReqTwo" class="wide sendData">
                	<option <%= "".equals(vo.getRegReqTwo()) ? "selected" : "" %> value=""></option>
                	<option <%= "분실/도난".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="분실/도난">분실/도난</option>
                	<option <%= "폭행/상해".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="폭행/상해">폭행/상해</option>
                	<option <%= "손괴/훼손".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="손괴/훼손">손괴/훼손</option>
                	<option <%= "차량사고".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="차량사고">차량사고</option>
                	<option <%= "쓰레기무단투기".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="쓰레기무단투기">쓰레기무단투기</option>
                	<option <%= "안전사고위험".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="안전사고위험">안전사고위험</option>
                	<option <%= "안전사고발생".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="안전사고발생">안전사고발생</option>
                	<option <%= "범죄위험".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="범죄위험">범죄위험</option>
                	<option <%= "범죄발생".equals(vo.getRegReqTwo()) ? "selected" : "" %> value="범죄발생">범죄발생</option>
                	<option <%= "기타".equals(vo.getRegReqOne()) ? "selected" : "" %> value="기타">기타</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>요청내용</th>
            <td>
            	<textarea id="regReq" name="regReq" class="wide sendData customScroll" style="height: 150px; resize: none;"><%= StrUtil.chkNull(vo.getRegReq()) %></textarea>
                <!-- <input type="text" id="regReq" name="regReq" class="wide sendData" value=""> -->
            </td>
        </tr>
        <tr>
            <th>설치여부</th>
            <td>
                <select id="instYn" name="instYn" class="wide sendData">
                	<option <%= "".equals(vo.getInstYn()) ? "selected" : "" %> value=""></option>
                	<option <%= "미설치".equals(vo.getInstYn()) ? "selected" : "" %> value="미설치">미설치</option>
                	<option <%= "설치".equals(vo.getInstYn()) ? "selected" : "" %> value="설치">설치</option>
                	<option <%= "설치불가".equals(vo.getInstYn()) ? "selected" : "" %> value="설치불가">설치불가</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>중복여부</th>
            <td>
                <select id="ovrpYn" name="ovrpYn" class="wide sendData">
                	<option <%= "".equals(vo.getOvrpYn()) ? "selected" : "" %> value=""></option>
                	<option <%= "--".equals(vo.getOvrpYn()) ? "selected" : "" %> value="--">--</option>
                	<option <%= "중복".equals(vo.getOvrpYn()) ? "selected" : "" %> value="중복">중복</option>
                </select>
            </td>
        </tr>
        <%-- <tr>
            <th>설치요구사유</th>
            <td>
                <input type="text" id="instRes" name="instRes" class="wide sendData" value="<%= StrUtil.chkNull(vo.getInstRes()) %>">
            </td>
        </tr> --%>
        <tr>
            <th>민원인</th>
            <td>
                <input type="text" id="userNm" name="userNm" class="wide sendData" value="<%= StrUtil.chkNull(vo.getUserNm()) %>">
            </td>
        </tr>
        <tr>
            <th>연락처</th>
            <td>
                <input type="text" id="userTell" name="userTell" class="wide sendData" value="<%= StrUtil.chkNull(vo.getUserTell()) %>">
            </td>
        </tr>
        <tr>
            <th>접수방법</th>
            <td>
                <input type="text" id="regHow" name="regHow" class="wide sendData" value="<%= StrUtil.chkNull(vo.getRegHow()) %>">
            </td>
        </tr>
        <tr>
            <th>특이사항</th>
            <td>
                <input type="text" id="rmark" name="rmark" class="wide sendData" value="<%= StrUtil.chkNull(vo.getRmark()) %>">
            </td>
        </tr>
        <tr>
            <th>현장실사</th>
            <td>
                <input type="text" id="fieldInsp" name="fieldInsp" class="wide sendData" value="<%= StrUtil.chkNull(vo.getFieldInsp()) %>">
            </td>
        </tr>
        <tr>
            <th>처리일시</th>
            <td>
                <input type="text" id="resDate" name="resDate" class="wide sendData datePicker" value="<%= StrUtil.chkNull(vo.getResDate()) %>" readonly="readonly">
            </td>
        </tr>
    </table>
    <div class="btnDiv tCenter">
<% if("edit".equals(mode)){ %>
        <button class="blackBtn_Fill btn_Dstyle2" style="width: 45%;" id="delBtn">삭제</button>
        <button class="blackBtn_Fill btn_style2" style="width: 45%;" id="saveBtn" mode="<%= mode %>">저장</button>
<% } %>
<% if("add".equals(mode)){ %>
        <button class="blackBtn_Fill btn_style" style="" id="saveBtn" mode="<%= mode %>">신규 추가</button>
<% } %>
    </div>

</div>
