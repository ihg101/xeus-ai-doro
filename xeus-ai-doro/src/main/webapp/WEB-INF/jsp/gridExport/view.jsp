<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<script type="text/javascript" src="./res/menu/nmsView/geomex.xeus.grid.export.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">

	<div id="gridExportTabs1" class="tLeft">
		<h4 style="display:inline-block; padding: 15px 0px;">1. 지도를 <%= siteNm %> 전체 영역으로 이동 (선택)</h4>
    	<button class="btn_style2" id="moveSiteExtentBtn" style="float: right; margin-right: 5px; margin-top: 12px;">지도 이동</button>
	</div>

	<div id="gridExportTabs2" class="tLeft">
		<h4 style="display:inline-block; padding: 15px 0px;">2. 그리드 생성 영역을 지도에 그리기 <b style="color: red;">(필수)</b></h4>
    	<button class="btn_style2" id="drawBoxtBtn" style="float: right; margin-right: 5px; margin-top: 12px;">영역 생성</button>
	</div>

	<div id="gridExportTabs4" class="tLeft">
		<h4 style="display:inline-block; padding: 15px 0px;">3. 그리드 생성 <b style="color: red;">(필수)</b></h4>
    	<button class="btn_style2" id="generateGridBtn" style="float: right; margin-right: 5px; margin-top: 12px;">생성 시작</button>
	</div>

	<div id="gridExportTabs4" class="tLeft">
		<h4 style="display:inline-block; padding: 15px 0px;">4. 공간정보가 포함되지 않은 그리드 제거 (선택)</h4>
    	<button class="btn_style2" id="moveGridExtentBtn" style="float: right; margin-right: 5px; margin-top: 12px;">제거 시작</button>
	</div>

	<table>
		<tr>
			<td><button class="btn_style" id="stopGridExportBtn">초기화</button></td>
			<td><button class="btn_style" id="gridExportBtn">추출 시작</button></td>
		</tr>
		<tr>
			<td colspan="2">
				<p class="tLeft">* 지도 위 공간정보는 현재 지도에 보여지는 객체만 추출됩니다.</p><br><br>
				<p class="tLeft">* 공간정보 미포함 그리드 제거시(4번) &lt;라인 또는 폴리곤&gt; 기준을 권장합니다.</p>
			</td>
		</tr>
	</table>

</div>