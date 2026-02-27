<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<style>

/* .subTitleBtn { */
/*     height: 28px; */
/*     background: #F3F3F3; */
/*     border: 1px solid #ddd; */
/*     color: #666; */
/*     float: right; */
/*     margin-right: 5px; */
/*     margin-top: 12px; */
/*     cursor: pointer; */
/* } */

.settingWrap {
	display: none;
}

/* #tableWrap .prevBtn, #tableWrap .nextBtn, #tableWrap #saveBtn { */
/* 	width: 49%; */
/* } */

</style>
<script type="text/javascript" src="./res/menu/bigdataView/geomex.xeus.bigdata.draw.js"></script>
<div class="overflow contentWrapper customScroll" onselectstart="return false" data-mcs-theme="minimal-dark">



	<div id="tableWrap">
		<div id="first" class="settingWrap">
			<div>
				<h3 class="title">1. 레이어명 설정</h3>
		    	<!-- <button class="subTitleBtn" id="loadLayerBtn">불러오기</button> -->
			</div>

			<div>
				<table>
					<tr>
						<th>레이어명</th>
						<td><input type="text" id="layerId" name="layerId" class="wide sendData" value=""></td>
					</tr>
				</table>

				<div class="btnDiv">
			    	<button class="blackBtn_Fill nextBtn btn_style" style="width: 100%;" for="#second"">다음</button>
			    </div>
			</div>

			<div id="loadWrap">
				<div>
					<h3 class="title">내가 등록한 레이어</h3>
				</div>

				<div>
					<table id="myLayers">
						<thead>
							<tr>
								<th>레이어명</th>
								<th>등록일</th>
								<th>관리</th>
							</tr>
						</thead>
						<tbody>
							<tr class="tCenter">
								<td colspan="3">등록된 레이어가 없습니다.</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div id="second" class="settingWrap">
			<div>
				<h3 class="title">2. 필드 및 데이터 설정</h3>
		    	<div style="text-align: right;">
		    		<button class="subTitleBtn btn_Dstyle" id="addRow">로우추가</button>
		    		<button class="subTitleBtn btn_Dstyle" id="addField">필드추가</button>
		    	</div>
			</div>

			<div>
				<h3 class="tCenter">필드를 추가해주세요.</h3>
				<table id="columnTable" style="position: relative;">
					<thead></thead>
					<tbody></tbody>
				</table>

				<div class="btnDiv">
			    	<button class="blackBtn_Fill prevBtn btn_Bstyle2" for="#first" style="width: 49%;">이전</button>
			    	<button class="blackBtn_Fill nextBtn btn_style" for="#third" style="width: 49%;" id="drawStartBtn">다음</button>
			    </div>
			</div>
		</div>

		<div id="third" class="settingWrap">
			<div>
				<h3 class="title">3. 공간정보 설정</h3>
			</div>

			<div>
				<table id="geometryTable" style="position: relative;">
					<thead></thead>
					<tbody></tbody>
				</table>

				<div class="btnDiv">
			    	<button class="blackBtn_Fill prevBtn btn_Bstyle2" for="#second" style="width: 49%;">이전</button>
			    	<button class="blackBtn_Fill btn_style" id="saveBtn" style="width: 49%;">저장</button>
			    </div>
			</div>
		</div>

	</div>
</div>