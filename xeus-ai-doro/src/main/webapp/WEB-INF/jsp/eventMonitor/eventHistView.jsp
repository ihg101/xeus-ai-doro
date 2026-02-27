<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.smartcity.service.EventHistVo"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<EventHistVo> list = (ArrayList<EventHistVo>) request.getAttribute("result");
ArrayList<EventHistVo> type = (ArrayList<EventHistVo>) request.getAttribute("type");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String limit = map.get("limit");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String first = map.get("first");

String evtTypCd = (map.get("evtTypCd") == null) ? "" : map.get("evtTypCd");
String evtNm = (map.get("evtNm") == null) ? "" : map.get("evtNm");
String procSt = (map.get("procSt") == null) ? "" : map.get("procSt");
String statEvetOutbDtm = (map.get("statEvetOutbDtm") == null) ? "" : map.get("statEvetOutbDtm");;
String outbPosNm = (map.get("outbPosNm") == null) ? "" : map.get("outbPosNm");
String usrAuth = (map.get("userAuth") == null) ? "" : map.get("userAuth");
%>
<style>	
	.detail_info_box {
		display: flex;
		gap: 10px;
		width: 100%;
	}
	
	.detail_info_box .img_box {
		width: 40%;
		aspect-ratio: 16/9;
		background-color: #666;
	}
	
	.detail_info_box .img_box > img {
		width: 100%;
		height: 100%;
	}
	
	.detail_info_box .info_list {
		display: flex;
		flex-direction: column;
		flex: 1 0 auto;
		width: 0;
		min-width: 0;
		box-sizing: border-box;
		padding: 16px;
		list-style: none;
		background-color: #232426;
	}
	
	.detail_info_box .info_list > li {
		display: flex;
		align-items: center;
		width: 100%;
		height: calc(100% / 4);
		font-size: 13px;
		color: #999;
	}
	
	.detail_info_box .info_list > li > span:first-child {
		width: 100px;
		color: #fff;
	}
	
	#setPopup,
	#imgPopup,
	#histDetailPopup {
		display: none;
		padding: 0;
	}
	
	#imgPopup .detail_info_box,
	#histDetailPopup .detail_info_box {
		flex-direction: column;
		box-sizing: border-box;
		padding: 14px;
	}
	
	#imgPopup .detail_info_box .img_box,
	#histDetailPopup .detail_info_box .img_box {
		width: 100%;
	}
	
	#imgPopup .detail_info_box .info_list,
	#histDetailPopup .detail_info_box .info_list {
		width: 100%;
		min-width: initial;
		gap: 16px;
	}
	
	#imgPopup .detail_info_box > div:last-child,
	#histDetailPopup .detail_info_box > div:last-child {
		text-align: right;
	}
	
	/* 이벤트 상세정보 테이블 형식으로 변경한뒤 테이블 관련 임시 css */
	#ctntTable {
        width: 100%;
        table-layout: fixed; /* 추가 */
        border-collapse: collapse;
        color: #ddd;
    }

    #ctntTable th, #ctntTable td {
        padding: 15px;
        width : 600px;
        border-top: 1px solid #444;
        border-bottom: 1px solid #444;
    }

    #ctntTable th {
        width: 100px;
    }
    
    #ctntTable td {
        text-align: left; /* 글자 왼쪽 정렬 */
    }

    #ctntTable .btn-style {
        display: inline-block;
        padding: 5px 10px;
        background-color: #444;
        color: #fff;
        border-radius: 5px;
        text-align: center;
    }

    #ctntTable .box_style {
        background-color: #1c1c1c;
        border-radius: 8px;
    }
</style>
<script>
var isFirst = false;
<% if("true".equals(first)) %> isFirst = true;

//검색 키워드 저장
var evtTypCd = "<%=evtTypCd%>";
var evtNm = "<%=evtNm%>";
var procSt = "<%=procSt%>";
var outbPosNm = "<%=outbPosNm%>";
var statEvetOutbDtm = "<%=statEvetOutbDtm%>";

var offset = "<%=offset%>";
var limit = "<%=limit%>";
</script>
<script type="text/javascript" src="./res/menu/eventView/geomex.xeus.eventHist.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">

	<input type="hidden" id="offset" value="<%= offset %>" />
	<input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

	<h3 class="title">이벤트 검색</h3>
	<div id="searchTable" class="box_style">
		<div class="info_box">
			<span class="title">종류</span>
			<select id="evtTypCd" class="wide sendData">
				<option value=""  pk="" <% if("".equals(evtTypCd)) out.print("selected"); %>>전체</option>
			</select>
		</div>
		<div class="info_box">
			<span class="title">발생일</span>
			<input type="text" id="statEvetOutbDtm" class="wide datePicker sendData" placeholder="클릭 후 날짜를 선택해주세요" value="<%= StrUtil.chkNull(map.get("statEvetOutbDtm")) %>" readOnly>
		</div>
		<button id="searchBtnEventHist" class="btn_style">검 색</button>
	</div>
	<div>
		<h3 id="count" class="title tRight">총 <%= request.getAttribute("count") %>개의 이벤트 정보가 검색되었습니다.</h3>
	</div>
	<div id="listWrap" class="customScroll" style="overflow: auto; height: auto;">
		<div>
			<h3 class="title">검색 결과</h3>
			<!--  
			<div class="tRight">
				<button id="excelBtn" class="btn_Dstyle">엑셀로 내보내기</button>
			</div>
			-->
		</div>
		<table id="histEvtTable">
			<thead>
				<tr>
					<!--
					<th width="35">순서</th>
					<th width="35">상태</th>
					-->
					<th width="150">종류</th>
					<th width="">발생시간 및 위치</th>
					<!-- <th width="100">이미지</th> -->
					<th width="150">보기</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<div class="paging_wrap"></div>
	<div style="display: none; margin-bottom: 20px;">
	    <h3 class="title">이벤트 상세정보</h3>
	    <table id="ctntTable" class="box_style">
	        <tr>
	            <th class="title">이벤트 유형</th>
	            <td id="statEvetNm" class="content ctntTd"></td>
	        </tr>
	        <tr>
	            <th class="title">발생일</th>
	            <td id="statEvetOutbDtm" class="content ctntTd"></td>
	        </tr>
	        <tr>
	            <th class="title">위치</th>
	            <td id="outbPosNm" class="content ctntTd"></td>
	        </tr>
	        <tr>
	            <th class="title">경위도</th>
	            <td id="outbPosCoord" class="content ctntTd"></td>
	        </tr>
	        <tr>
	            <th class="title">내용</th>
	            <td id="statEvetCntn" class="content ctntTd"></td>
	        </tr>
	    </table>
	</div>
	<!--
	<div style="display: none;">
		<h3 class="title">이벤트 상세정보</h3>
		<div id="ctntTable" class="box_style">
			<div class="info_box wd100">
				<span class="title">이벤트 유형</span>
				<p id="statEvetNm" class="content ctntTd"></p>
			</div>
			<div class="info_box wd100">
				<span class="title">발생일</span>
				<p id="statEvetOutbDtm" class="content ctntTd"></p>
			</div>
			<div class="info_box wd100">
				<span class="title">위치</span>
				<p id="outbPosNm" class="content ctntTd"></p>
			</div>
			<div class="info_box wd100">
    			<span class="title">경위도</span>
    			<p id="outbPosCoord" class="content ctntTd"></p>
			</div>
			<div class="info_box wd100">
				<span class="title">내용</span>
				<p id="statEvetCntn" class="content ctntTd"></p>
			</div>
		</div>
	</div>
	 -->
</div>
<div id="histDetailPopup">
	<div class="detail_info_box">
		<ul class="info_list">
			<li>
				<span>이벤트 유형</span>
				<span></span>
			</li>
			<li>
				<span>발생 일시</span>
				<span></span>
			</li>
		<!-- 	<li>
				<span>발생 위치</span>
				<span></span>
			</li> -->
			<li>
				<span>발생 경위도</span>
				<span></span>
			</li>
			<li>
				<span>GRS80(중부원점)</span>
				<span></span>
			</li>
		</ul>
		<div class="img_box"></div>
		<div>
			<button class="btn_Dstyle">이미지 다운로드</button>
		</div>
	</div>
</div>
<div id="imgPopup">
	<div class="detail_info_box">
		<span>이벤트 발생 시 촬영된 이미지를 조회합니다</span>
		<!-- <hr> -->
		<div class="img_box"></div>
	</div>
</div>