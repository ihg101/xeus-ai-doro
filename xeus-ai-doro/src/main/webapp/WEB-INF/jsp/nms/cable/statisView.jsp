<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../common.jsp" %>
<div class="overflow searchWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">

    <div class="tabTitle">
        <button class="tab" url="/nms/getCableView.do">케이블 수정</button>
   	    <button class="tab" url="/nms/getCableRegView.do">케이블 등록</button>
       	<button class="tab" url="/nms/getCableDelView.do">케이블 삭제</button>
       	<button class="tab" url="/netwk/getCableThemeView.do">케이블 테마 관리</button>
       	<button class="tab" url="/netwk/getStatisView.do" active="active">통계</button>
    </div>

    <h3 class="title">테마 등록</h3>
    <div id="searchTable" class="box_style">
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">망구분</span>
    		<input type="text" id="netGbnCd" name="netGbnCd" class="wide sendData" value="12" style="border: none;">
    	</div>
    	<div class="info_box">
    		<span class="title">테마명</span>
    		<input type="text" id="themeNm" name="themeNm" class="wide sendData" style="border: none;">
    	</div>
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">링번호</span>
    		<input type="text" id="ringNo" name="ringNo" class="wide sendData" style="border: none;">
    	</div>
    	<div class="info_box">
    		<span class="title">케이블 종류</span>
    		<select id="cableTyp" name="cableTyp" class="sendData" style="border: none;">
                    <option value=""></option>
                    <option value="1">실선</option>
                    <option value="2">점선</option>
            </select>
    	</div>
    	<div class="info_box">
    		<span class="title">선색상</span>
    		<input type="color" id="lineColor" name="lineColor" class="sendData" style="height:16px">
    	</div>
    	<button class="blackBtn_Fill btn_style" style="" id="addBtn">저장</button>
    </div>
    <h3 class="title">테마 목록</h3>
    <div>
    	<table>
	    	<colgroup>
		        <col width="50px">
		        <col width="">
		        <col width="100px">
		        <col width="60px">
	        </colgroup>
	        <thead>
		    	<tr>
		    		<th>구분</th>
		    		<th>이름</th>
		    		<th>색상</th>
		    		<th>관리</th>
		    	</tr>
	    	</thead>
	    </table>
    </div>
    <div class="customScroll" data-mcs-theme="minimal-dark">
    	<table id="resultTable" style="height: 0px !important;">
    		<colgroup>
		        <col width="50px">
		        <col width="">
		        <col width="100px">
		        <col width="60px">
	        </colgroup>
	   		<tbody>
	   		</tbody>
	    </table>
    </div>
</div>
