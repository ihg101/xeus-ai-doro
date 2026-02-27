<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<CctvVo> cctv = (ArrayList<CctvVo>) request.getAttribute("cctv");
ArrayList<UserVo> user = (ArrayList<UserVo>) request.getAttribute("user");
ArrayList<AuthGrpVo> auth = (ArrayList<AuthGrpVo>) request.getAttribute("auth");
%>
<script type="text/javascript" src="./res/menu/eventView/geomex.xeus.eventList.js?v=<%= DateUtil.getStrMilSec() %>"></script>

<style>
	.monitoring_wrap {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 16px 0 20px 0;
	}
	
	.monitoring_wrap .head_fixed,
	.monitoring_wrap table {
		margin: 0 !important;
	}

	.monitoring_wrap button {
		background-color: #1d1d1f !important;
	}
	
	.monitoring_wrap table img {
		vertical-align: middle;
	}

	.monitoring_wrap h3.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0;
		margin-bottom: 12px;
		color: #fff;
	}
	
	.monitoring_wrap > div:nth-child(1) {
		display: flex;
		flex-direction: column;
		flex: 1 0 auto;
		height: 0;
		min-height: 0;
	}
	
	.monitoring_wrap > div:nth-child(1) > div {
		display: flex;
		flex-direction: column;
		flex: 1 0 auto;
		height: 0;
		min-height: 0;
	}
	
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
	#detailPopup {
		display: none;
		padding: 0;
	}
	
	#detailPopup .detail_info_box {
		flex-direction: column;
		box-sizing: border-box;
		padding: 14px;
	}
	
	#detailPopup .detail_info_box .img_box {
		width: 100%;
	}
	
	#detailPopup .detail_info_box .info_list {
		width: 100%;
		min-width: initial;
		gap: 16px;
	}
	
	#detailPopup .detail_info_box > div:last-child {
		text-align: right;
	}
	
	.setting_list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		box-sizing: border-box;
		padding: 14px;
	}
	
	.setting_list > li {
		display: flex;
		justify-content: space-between;
		width: 100%;
		box-sizing: border-box;
		padding: 10px;
		background-color: #232426;
		color: #fff;
		font-size: 14px;
	}
	
	.setting_toggle {display: inline-block; vertical-align: top;}
	.setting_toggle .btn_wrap {display: flex; justify-content: center; align-items: center; font-size: 12px; color: #fff; box-sizing: border-box;}
	.setting_toggle .btn_wrap  .btn_switch {margin-left: 5px; height: 18px;}
	.setting_toggle .btn_wrap  .btn_switch > input[type="checkbox"] {display: none;}
	.setting_toggle .btn_wrap  .btn_switch > label {display: inline-block; width: 36px; height: 100%; border-radius: 10px; background-color: #ccc; overflow: hidden; text-indent: -9999px; position: relative; cursor: pointer; transition: 0.3s;}
	.setting_toggle .btn_wrap  .btn_switch > label:after {content: ""; display: block; width: 13px; height: 13px; border-radius: 50%; background-color: #fff; position: absolute; top: 50%; transform: translateY(-50%); left: 3px; transition: 0.3s;}
	.setting_toggle .btn_wrap  .btn_switch > label:active:after {width: 18px;}
	.setting_toggle .btn_wrap  .btn_switch > input:checked + label {background-color: #0077df;}
	.setting_toggle .btn_wrap  .btn_switch > input:checked + label:after {left: 19px;}
	
	.info_tab button{
		background: none;
	    color: #999;
	    font-size: 14px;
	    margin-right: 8px;
    }
    
    .info_tab button:hover{
	    color: #0078d4;
    }
    
    .info_tab button.ative{
		
	    color: #0078d4;
	    padding-bottom: 10px;
    	border-bottom: 1px solid #0078d4;
    }
    
    #btnEvtLayer.active {
    	background:#0078d4 !important;
    }
    
    .btnStyle{
	    display: flex;
	    justify-content: end;
    }
    
    #saveBtn{
    	margin-left : auto;
    }
</style>
<script>
$(document).ready(function(){
	//페이지 로드 시 기존 다이얼로그 제거
	if($("#histDetailPopup").hasClass('ui-dialog-content')) {
		$("#histDetailPopup").remove();
		$("#histDetailPopup").dialog("destroy");
	}
});
</script>
<div class="monitoring_wrap">
    <div>
    	<h3 class="title">
    		<span id="eventCount"></span>
    		<span>
    		<!-- <button id="btnEvtLayer" class="btn_Dstyle active">레이어 활성화</button> -->
    		<button id="btnEvtSet" class="btn_Dstyle">이벤트 수신설정</button>
    		</span>
    	</h3>
		<div class="customScroll head_fixed">
			<table id="evtTable">
				<colgroup>
					<col width="100"/>
					<col width="100"/>
					<col width=""/>
					<col width="100"/>
				</colgroup>
				<thead>
					<tr>
						<th>유형</th>
						<th>상태</th>
						<th>발생시간 및 위치</th>
						<th>보기</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div style="display: none;">
		<h3 class="title">이벤트 상세정보</h3>
		<div id="ctntTable" class="detail_info_box" style="    height: 200px;">
			<div class="img_box"></div>
			<ul class="info_list">
				<li>
					<span>이벤트 유형</span>
					<span id="statEvetNm"></span>
				</li>
				<li>
					<span>발생 일시</span>
					<span id="statEvetOutbDtm"></span>
				</li>
				<li>
					<span>발생 위치</span>
					<span id="outbPosNm"></span>
				</li>
				<li>
					<span>발생 경위도</span>
					<span id="outbPosCoord"></span>
				</li>
			</ul>
		</div>
	</div>
</div>	
<div id="setPopup">
	<ul class="setting_list">
		<li>
			<span>포트홀</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set1">
						<label for="set1">포트홀</label>
					</div>
				</div>
			</div>
		</li>
		<li>
			<span>낙하물</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set2">
						<label for="set2">낙하물</label>
					</div>
				</div>
			</div>
		</li>
		<li>
			<span>굴삭기</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set3">
						<label for="set3">굴삭기</label>
					</div>
				</div>
			</div>
		</li>
		<li>
			<span>크랙</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set4">
						<label for="set4">크랙</label>
					</div>
				</div>
			</div>
		</li>
		<li>
			<span>콘</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set5">
						<label for="set5">콘</label>
					</div>
				</div>
			</div>
		</li>
		<li>
			<span>블랙아이스</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set6">
						<label for="set6">블랙아이스</label>
					</div>
				</div>
			</div>
		</li>
		<li>
			<span>수막현상</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set7">
						<label for="set7">수막현상</label>
					</div>
				</div>
			</div>
		</li>
<!-- 		<li>
			<span>싱크홀</span>
			<div class="setting_toggle">
				<div class="btn_wrap">
					<div class="btn_switch">
						<input type="checkbox" id="set8">
						<label for="set8">싱크롷</label>
					</div>
				</div>
			</div>
		</li> -->
	</ul>
</div>
<div id="detailPopup">
	<div class="detail_info_box">
		<!-- <div class="info_tab">
			<button id="tab_basic" class="ative">이벤트 정보</button>
			<button id="tab_eocs">EOCS 굴삭기 정보</button>
		</div> -->
		
		<div class="basic active">
			<ul class="info_list">
				<li>
					<span>이벤트 유형</span>
					<span></span>
				</li>
				<li>
					<span>발생 일시</span>
					<span></span>
				</li>
				<!-- <li>
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
				<li>
					<span>이벤트 상태</span>
					<select id="eventState">
						<option value="0">발생</option>
		                <option value="1">확인</option>
		                <option value="2">오탐</option>
		                <option value="99">종료</option>
					</select>
				</li>
				<li style="display : none;">
					<span>반경</span>
					<select id="radius">
						<option value="0">0m</option>
						<option value="30">30m</option>
		                <option value="50">50m</option>
		                <option value="100">100m</option>
		                <option value="300">300m</option>
					</select>
				</li>
			</ul>
			<div class="img_box"></div>
			<div  class="btnStyle">
				<button class="btn_Dstyle imgDown">이미지 다운로드</button>
				<button type="button" id="editState" class="btn_Dstyle" k="">저장</button>
			</div>
		</div>
		<div class="eocs" style="display:none;">
			<ul class="info_list">
				<li>
					<span>이벤트 유형</span>
					<span></span>
				</li>
				<li>
					<span>발생 일시</span>
					<span></span>
				</li>
				<li>
					<span>발생 위치</span>
					<span></span>
				</li>
				<li>
					<span>발생 경위도</span>
					<span></span>
				</li>
			</ul>
		</div>
		
		<div id="eocsListPopup" style="display:none;" class="customScroll head_fixed table_style">
		<input type="hidden" id="offset2" value="" />
		<input type="hidden" id="max2" value="" />
			<div style="color:#777; text-align:right">* 종료예정일자가 지난 데이터는 지도 화면에 아이콘이 표시되지 않습니다.</div>
				<table id="eocsTable">
					<colgroup>
						<col width="100"/>
						<col width=""/>
						<col width="100"/>
						<col width="100"/>
						<col width="70"/>
					</colgroup>
					<thead>
						<tr>
							<th>접수번호</th>
							<th>공사명</th>
							<th>시작예정일자</th>
							<th>종료예정일자</th>
							<th></th>
						</tr>
					</thead>
					<tbody id="eocsData">
					</tbody>
				</table>
				<div class="paging_wrap"></div>
		</div>
	</div>
</div>

