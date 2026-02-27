<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<%
String k = (String) request.getAttribute("k");
String fk = (String) request.getAttribute("fk");
String tbl = (String) request.getAttribute("tbl");
%>
<script>
var k = "<%= StringUtils.defaultIfEmpty(k, "") %>";
var fk = "<%= StringUtils.defaultIfEmpty(fk, "") %>";
var tbl = "<%= StringUtils.defaultIfEmpty(tbl, "") %>";
var layerAuth = "";
</script>
<%
if(StringUtils.isEmpty(k)) request.removeAttribute("k");
if(StringUtils.isEmpty(fk)) request.removeAttribute("fk");
if(StringUtils.isEmpty(tbl)) request.removeAttribute("tbl");
%>
<script type="text/javascript" src="./common/chroma.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./res/menu/bigdataView/geomex.xeus.bigdata.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./res/menu/bigdataView/geomex.xeus.bigdata.fn.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<div class="contentWrapper customScroll">

	<div id="loadAnalyzeName" class="tCenter text-overflow hidden">
		<h3 class="title"></h3>
	</div>

	<div class="tLeft">
		<h4 style="display:inline-block; padding: 15px 0px;">1. 분석 데이터</h4>
    	<button class="analySetBtn btn_Dstyle" id="lyrSelectBtn" style="float: right; margin-right: 5px; margin-top: 12px;">분석 대상 레이어 선택</button>
		<button class="analySetBtn btn_Dstyle" id="resetBtn" style="float: right; margin-right: 5px; margin-top: 12px;">분석 결과 초기화</button>
	</div>

    <div id="analysWrap" style="padding: 30px 0px;"></div>

    <div class="tCenter" id="layerWeightHintTxt" style="padding: calc(100% - 170px) 0px;">분석 대상 레이어를 추가해 주세요.</div>

    <div style="margin-bottom: 20px;">
    	<button class="btn_style" id="startAnalysBtn">신규 분석 시작</button>
    	<button class="hidden btn_style2" id="editAndAnalyBtn" style="width: 47%; height: 40px; font-size: 1em !important;">재 분석</button>
    	<button class="hidden btn_style2" id="saveAndAnalyBtn" style="width: 47%; height: 40px; font-size: 1em !important;">신규 분석</button>
    </div>

    <div id="resultWrap" class="hidden">
    	<div>
    		<h4 style="display:inline-block; padding: 15px 0px;">2. 분석 결과</h4>
	    	<button class="analySetBtn btn_style2" id="resultExcelBtn" style="float: right; margin-right: 5px; margin-top: 12px;">엑셀 다운로드</button>
			<button class="analySetBtn btn_style2" id="sortValSetBtn" style="float: right; margin-right: 5px; margin-top: 12px;">중심값 설정</button>
			<button class="analySetBtn btn_Dstyle" id="revertBtn" style="float: right; margin-right: 5px; margin-top: 12px;">결과 반전</button>
		</div>

		<div id="spectrumWrap">
			<table>
				<thead>
					<tr>
						<th colspan="3">색상에 따른 값의 범위</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td style="padding: 0px;">
							<b class="lowVal">낮은 값</b>
						</td>
						<td style="padding: 0px;">
							<div id="spectrum"></div>
						</td>
						<td style="padding: 0px;">
							<b class="highVal">높은 값</b>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div id="resultTableWrap">
			<table>
				<thead>
					<tr>
						<th>최종값</th>
						<th>주소</th>
						<th>위치</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			<input type="hidden" id="offset" value="0" />
    		<input type="hidden" id="max" value="" />
    		<input type="hidden" id="sortTyp" value="desc" />
			<div class="paging_wrap"></div>
		</div>
    </div>

    <div id="dragWrap" class="hidden customScroll">
		<div id="selectWrap">
			<table>
				<thead>
					<tr>
						<th><h3>1. 이벤트 데이터</h3></th>
						<th><h3>2. 시스템 데이터</h3></th>
						<th><h3>3. 나의 데이터</h3></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td style="vertical-align: top;"><div><table id="sysLayerWrap" class="selectable" style="line-height: 15px;"><tbody></tbody></table></div></td>
						<td style="vertical-align: top;"><div><table id="externalLayerWrap" class="selectable" style="line-height: 15px;"><tbody></tbody></table></div></td>
						<td style="vertical-align: top;"><div><table id="userLayerWrap" class="selectable" style="line-height: 15px;"><tbody></tbody></table></div></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div id="columnWrap" class="hidden table_style customScroll">
		<div id="listWrap">
			<table id="weightSetTable" style="width: 100%;">
				<thead>
					<tr>
						<th>선택된 필드</th>
						<td id="selectField" width="200px"></td>
						<th>영향범위 (0 ~ 100)M</th>
						<!-- <td><button class='minus whiteBtn small'>-</button><input class='tCenter small buffer' type='text' value='0'><button class='plus whiteBtn small'>+</button></td> -->
						<td><input class='tCenter wide buffer' type='number' value='0' min="0" max="100" step="10"></td>
						<th>가중치 (-100 ~ 100)</th>
						<!-- <td><button class='minus whiteBtn small'>-</button><input class='tCenter small weight' type='text' value='0'><button class='plus whiteBtn small'>+</button></td> -->
						<td><input class='tCenter wide weight' type='number' value='0' min="-100" max="100" step="10"></td>
						<th>연산방법</th>
						<td>
							<select class='tCenter wide opeStr noneBorder'>
								<option value="+">더하기</option>
								<option value="-">빼기</option>
								<option value="*">곱하기</option>
							</select>
						</td>
						<td><button class="btn_style" id="regLayerBtn">등록</button></td>
					</tr>
					<tr>
						<td colspan="9"><h3 id="selectLayerText" style="margin: 0px;">아래의 테이블에서 필드명을 선택하신 후 영향범위와 가중치를 설정해주세요.</h3></td>
					</tr>
				</thead>
			</table>
			<table id="weightTable" style="width: 100%;">
				<thead></thead>
				<tbody></tbody>
			</table>
		</div>

		<h3 class="tCenter" style="margin: 0px;">데이터는 최대 100건까지 표시됩니다.</h3>
	</div>

</div>