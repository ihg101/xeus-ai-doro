<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.smarteye.js"></script>
<div class="contentWrapper customScroll" data-mcs-theme="minimal-dark">
    <h3 class="title">지능형 분석</h3>
    <table id="searchTable" class="searchTable">
        <tr>
            <th>검색 대상</th>
            <td colspan="9">
                <select id="sch_typ" name="sch_typ">
                    <option value="car">차량</option>
                    <option value="obj">사람 및 사물</option>
                </select>
            </td>
        </tr>
        <tr target="car">
            <th>검색 대상 CCTV</th>
            <td colspan="3">
            	<table class="noneBorder cctvListTable carTbl">
            		<tr>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids1" value="1"><label for="cctv_ids1" class="checkboxC"></label>CCTV1</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids2" value="2"><label for="cctv_ids2" class="checkboxC"></label>CCTV2</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids3" value="3"><label for="cctv_ids3" class="checkboxC"></label>CCTV3</td>
            		</tr>
            		<tr>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids4" value="4"><label for="cctv_ids4" class="checkboxC"></label>CCTV4</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids5" value="5"><label for="cctv_ids5" class="checkboxC"></label>CCTV5</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids6" value="6"><label for="cctv_ids6" class="checkboxC"></label>CCTV6</td>
            		</tr>
            	</table>
            </td>
            <th>자동차 종류</th>
            <td colspan="3">
            	<table class="noneBorder">
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="car_types checkbox" id="car_types1" value="car"><label for="car_types1" class="checkboxC"></label>승용차</td>
		            	<td class="noneBorder"><input type="checkbox" class="car_types checkbox" id="car_types2" value="suv"><label for="car_types2" class="checkboxC"></label>SUV</td>
		            	<td class="noneBorder"><input type="checkbox" class="car_types checkbox" id="car_types3" value="van"><label for="car_types3" class="checkboxC"></label>승합차</td>
            		</tr>
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="car_types checkbox" id="car_types4" value="taxi"><label for="car_types4" class="checkboxC"></label>택시</td>
		            	<td class="noneBorder"><input type="checkbox" class="car_types checkbox" id="car_types5" value="bus"><label for="car_types5" class="checkboxC"></label>버스</td>
		            	<td class="noneBorder"><input type="checkbox" class="car_types checkbox" id="car_types6" value="truck"><label for="car_types6" class="checkboxC"></label>트럭</td>
            		</tr>
            	</table>
            </td>
            <th>미인식 번호판 포함</th>
            <td>
            	<select id="has_plate_number" name="has_plate_number" class="sendData">
                    <option value="1">번호판이 인식된 결과만 검색</option>
                    <option value="0">번호판이 인식되지 않은 결과도 검색</option>
                </select>
            </td>
        </tr>
        <tr target="car">
        	<th>자동차 색상</th>
            <td colspan="3">
            	<table class="noneBorder">
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names1" value="black"><label for="color_names1" class="checkboxC"></label>블랙</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names2" value="white"><label for="color_names2" class="checkboxC"></label>화이트</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names3" value="gray"><label for="color_names3" class="checkboxC"></label>그레이</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names4" value="blue"><label for="color_names4" class="checkboxC"></label>블루</td>
            		</tr>
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names5" value="green"><label for="color_names5" class="checkboxC"></label>그린</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names6" value="red"><label for="color_names6" class="checkboxC"></label>레드</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names7" value="orange"><label for="color_names7" class="checkboxC"></label>오렌지</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names8" value="yellow"><label for="color_names8" class="checkboxC"></label>옐로우</td>
            		</tr>
            	</table>
            </td>
            <th>자동차 번호판</th>
            <td colspan="5">
            	<table class="noneBorder">
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types1" value="new-large"><label for="plate_types1"  class="checkboxC"></label>유럽형 와이드</td>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types2" value="new-small"><label for="plate_types2" class="checkboxC"></label>유럽형 쇼트</td>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types3" value="new-com-small"><label for="plate_types3" class="checkboxC"></label>상업용 와이드</td>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types4" value="new-com-large"><label for="plate_types4" class="checkboxC"></label>상업용 쇼트</td>
            		</tr>
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types5" value="new-2004"><label for="plate_types5" class="checkboxC"></label>전국 번호판</td>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types6" value="old"><label for="plate_types6" class="checkboxC"></label>구형 번호판</td>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types7" value="construct"><label for="plate_types7" class="checkboxC"></label>건설 기계</td>
		            	<td class="noneBorder"><input type="checkbox" class="plate_types checkbox" id="plate_types8" value="temporal"><label for="plate_types8" class="checkboxC"></label>임시 번호판</td>
            		</tr>
            	</table>
            </td>
        </tr>
        <tr target="car">
            <th>자동차 번호</th>
            <td>
            	<input type="text" class="sendData wide search_text" id="search_text">
            </td>
            <th>검색 대상 일</th>
            <td class="tCenter" width="180px">
            	<input type="text" class="sendData datePicker middle tCenter start_date" id="start_date" value="<%= DateUtil.getStrDay() %>" readonly="readonly">
            	<!-- <span> ~ </span> -->
            	<input type="text" class="sendData datePicker middle tCenter end_date" id="end_date" value="<%= DateUtil.getStrDay() %>" readonly="readonly">
            </td>
            <th>검색 대상 시간</th>
            <td class="tCenter">
            	<select id="start_h" name="start_h" class="sendData small tCenter">
<%
for(int i=0; i<24; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>시</option>
<%
}
%>
                </select>
                <select id="start_m" name="start_m" class="sendData small tCenter">
<%
for(int i=0; i<60; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>분</option>
<%
}
%>
                </select>
                <br>
            	<select id="end_h" name="end_h" class="sendData small tCenter">
<%
for(int i=0; i<24; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>시</option>
<%
}
%>
                </select>
                <select id="end_m" name="end_m" class="sendData small tCenter">
<%
for(int i=0; i<60; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>분</option>
<%
}
%>
                </select>
            </td>
            <th>검색 표시 갯수</th>
            <td>
            	<!-- <input type="text" class="sendData wide limit" id="limit" value="10"> -->
            	<select class="sendData wide limit" id="limit">
            		<option value="10">10</option>
            		<option value="20">20</option>
            		<option value="30">30</option>
            		<option value="40">40</option>
            		<option value="50">50</option>
            		<option value="60">60</option>
            		<option value="70">70</option>
            		<option value="80">80</option>
            		<option value="90">90</option>
            		<option value="100">100</option>
            	</select>
            </td>
            <th>시간 처리 방식</th>
            <td>
            	<select id="time_repeat" name="time_repeat" class="sendData">
                    <option value="1">날짜별(시작시간 부터 종료시간) 검색</option>
                    <option value="0">시작일 부터 종료일 까지 모두 검색</option>
                </select>
            </td>
        </tr>

		<!-- 사람 및 사물 -->
        <tr target="obj" class="hidden">
            <th>검색 대상 CCTV</th>
            <td colspan="3">
            	<table class="noneBorder cctvListTable objTbl">
            		<tr>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids1" value="1"><label for="cctv_ids1" class="checkboxC"></label>CCTV1</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids2" value="2"><label for="cctv_ids2" class="checkboxC"></label>CCTV2</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids3" value="3"><label for="cctv_ids3" class="checkboxC"></label>CCTV3</td>
            		</tr>
            		<tr>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids4" value="4"><label for="cctv_ids4" class="checkboxC"></label>CCTV4</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids5" value="5"><label for="cctv_ids5" class="checkboxC"></label>CCTV5</td>
            			<td class="noneBorder"><input type="checkbox" class="cctv_ids checkbox" id="cctv_ids6" value="6"><label for="cctv_ids6" class="checkboxC"></label>CCTV6</td>
            		</tr>
            	</table>
            </td>
            <th>검색 대상 종류</th>
            <td colspan="3">
            	<table class="noneBorder">
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="obj_types checkbox" id="obj_types_1" value="person"><label for="obj_types_1" class="checkboxC"></label>사람</td>
		            	<td class="noneBorder"><input type="checkbox" class="obj_types checkbox" id="obj_types_2" value="suitcase"><label for="obj_types_2" class="checkboxC"></label>여행가방(캐리어)</td>
		            	<td class="noneBorder"><input type="checkbox" class="obj_types checkbox" id="obj_types_3" value="cart"><label for="obj_types_3" class="checkboxC"></label>카트</td>
		            	<td class="noneBorder"><input type="checkbox" class="obj_types checkbox" id="obj_types_4" value="handbag"><label for="obj_types_4" class="checkboxC"></label>핸드백</td>
            		</tr>
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="obj_types checkbox" id="obj_types5" value="backpack"><label for="obj_types5" class="checkboxC"></label>백팩</td>
		            	<td class="noneBorder"><input type="checkbox" class="obj_types checkbox" id="obj_types6" value="plastic bag"><label for="obj_types6" class="checkboxC"></label>비닐백</td>
		            	<td class="noneBorder"><input type="checkbox" class="obj_types checkbox" id="obj_types7" value="box"><label for="obj_types7" class="checkboxC"></label>박스</td>
            		</tr>
            	</table>
            </td>
        </tr>
        <tr target="obj" class="hidden">
        	<th>대상 색상</th>
            <td colspan="7">
            	<table class="noneBorder">
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_1" value="black"><label for="color_names_1" class="checkboxC"></label>블랙</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_2" value="white"><label for="color_names_2" class="checkboxC"></label>화이트</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_3" value="gray"><label for="color_names_3" class="checkboxC"></label>그레이</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_4" value="blue"><label for="color_names_4" class="checkboxC"></label>블루</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_5" value="green"><label for="color_names_5" class="checkboxC"></label>그린</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_6" value="red"><label for="color_names_6" class="checkboxC"></label>레드</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_7" value="orange"><label for="color_names_7" class="checkboxC"></label>오렌지</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_8" value="yellow"><label for="color_names_8" class="checkboxC"></label>옐로우</td>
            		</tr>
            		<tr>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_9" value="purple"><label for="color_names_9" class="checkboxC"></label>퍼플</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_10" value="silver"><label for="color_names_10" class="checkboxC"></label>실버</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_11" value="gold"><label for="color_names_11" class="checkboxC"></label>골드</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_12" value="pink"><label for="color_names_12" class="checkboxC"></label>핑크</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_13" value="brown"><label for="color_names_13" class="checkboxC"></label>브라운</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_14" value="beige"><label for="color_names_14" class="checkboxC"></label>베이지</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_15" value="navy"><label for="color_names_15" class="checkboxC"></label>네이비</td>
		            	<td class="noneBorder"><input type="checkbox" class="color_names checkbox" id="color_names_16" value="khaki"><label for="color_names_16" class="checkboxC"></label>카키</td>
            		</tr>
            	</table>
            </td>
        </tr>
        <tr target="obj" class="hidden">
            <th>검색 대상 일</th>
            <td class="tCenter">
            	<input type="text" class="sendData datePicker tCenter start_date" id="start_date" value="<%= DateUtil.getStrDay() %>" readonly="readonly">
            	<span> ~ </span>
            	<input type="text" class="sendData datePicker tCenter end_date" id="end_date" value="<%= DateUtil.getStrDay() %>" readonly="readonly">
            </td>
            <th>검색 대상 시간</th>
            <td class="tCenter">
            	<select id="start_h" name="start_h" class="sendData small tCenter">
<%
for(int i=0; i<24; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>시</option>
<%
}
%>
                </select>
            	<select id="start_m" name="start_m" class="sendData small tCenter">
<%
for(int i=0; i<60; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>분</option>
<%
}
%>
                </select>
                <br>
            	<select id="end_h" name="end_h" class="sendData small tCenter">
<%
for(int i=0; i<24; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>시</option>
<%
}
%>
                </select>
              	<select id="end_m" name="end_m" class="sendData small tCenter">
<%
for(int i=0; i<60; i++){
	String time = "" + i;
	if(i < 10) time = "0" + i;
%>
                    <option value="<%= time %>"><%= time %>분</option>
<%
}
%>
                </select>
            </td>
            <th>검색 표시 갯수</th>
            <td>
            	<!-- <input type="text" class="sendData wide limit" id="limit" value="10"> -->
            	<select class="sendData wide limit" id="limit">
            		<option value="10">10</option>
            		<option value="20">20</option>
            		<option value="30">30</option>
            		<option value="40">40</option>
            		<option value="50">50</option>
            		<option value="60">60</option>
            		<option value="70">70</option>
            		<option value="80">80</option>
            		<option value="90">90</option>
            		<option value="100">100</option>
            	</select>
            </td>
            <th>시간 처리 방식</th>
            <td>
            	<select id="time_repeat" name="time_repeat" class="sendData">
                    <option value="1">날짜별(시작시간 부터 종료시간) 검색</option>
                    <option value="0">시작일 부터 종료일 까지 모두 검색</option>
                </select>
            </td>
        </tr>
    </table>
    <table>
		<tr>
			<th>체크박스 항목은 좌측의 제목을 눌러 전체 선택 및 해제가 가능합니다.</th>
		</tr>
    </table>
    <div class="btnDiv" style="text-align: center;">
        <button class="btn_style" id="searchBtn" style="width: 10%;">검 색</button>
    </div>

	<div id="resultWrap" class="hidden">
	    <!-- <div style="width: 373px; display: table-cell;">
	        <p class="searchTitle" style="width:25%; display: inline-block;">검색결과</p>
	    </div> -->
	    <div id="result" style="position: relative; width: 99%; padding: 10px;"></div>
	</div>

</div>