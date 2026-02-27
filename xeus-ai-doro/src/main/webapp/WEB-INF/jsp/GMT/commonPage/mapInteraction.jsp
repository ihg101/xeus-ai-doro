<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div id="uploadExcelWrap" title="excel가져오기" class="dialogWrap customScroll table_style"></div>
<div id="createNewLayerWrap" title="신규레이어생성" class="dialogWrap customScroll table_style"></div>
<div id="userManageWrap" title="사용자 관리" class="dialogWrap customScroll table_style"></div>
<div id="authManageWrap" title="권한 관리" class="dialogWrap customScroll table_style"></div>
<div id="layerAuthManageWrap" title="레이어권한 관리" class="dialogWrap customScroll table_style"></div>
<div id="shareLayerWrap" title="레이어 공유" class="dialogWrap customScroll table_style"></div>
<div id="layerGroupManageWrap" title="레이어그룹 관리" class="dialogWrap customScroll table_style"></div>
<div id="popupWrap" title="" class="dialogWrap customScroll table_style"></div>
<div id="cctvSearchInfoWrap" title="" class="dialogWrap customScroll table_style"></div>


<div id="styleWrap" class="dialogWrap customScroll" title="스타일 설정" onselectstart="return false">
	<div id="styleTabs">
		<ul class="tab_wrap">
			<li><a href="#defaultTab">기본 스타일 설정</a></li>
			<li><a href="#sacleTab">표현 축척 설정</a></li>
			<li><a href="#labelTab">라벨 설정</a></li>
			<li><a href="#themaTab">주제도 설정</a></li>
		</ul>

		<div id="defaultTab" class="styleTab table_style customScroll">
			<table>
				<tr>
					<th>레이어 명칭</th>
					<td>
						<input type="text" id="layerNm" readonly disabled>
					</td>
				</tr>
				<tr>
					<th>보이기 여부</th>
					<td>
						<input type="checkbox" id="visibleYn" class="layerParam" checked>
						<label for="visibleYn">보이기 여부 설정</label>
					</td>
				</tr>
				<tr>
					<th>외곽선 색상 설정</th>
					<td><input type="color" id="strokeColor" class="styleParam"></td>
				</tr>
				<tr>
					<th>외곽선 종류 설정</th>
					<td>
						<select id="strokeLineDash" class="styleParam">
							<option value="1">실선</option>
							<option value="10">점선</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>외곽선 굵기 설정</th>
					<td>
						<select id="strokeWidth" class="styleParam">
							<option value="0">0 pixel</option>
							<option value="1">1 pixel</option>
							<option value="2">2 pixel</option>
							<option value="3">3 pixel</option>
							<option value="4">4 pixel</option>
							<option value="5">5 pixel</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>채우기 색상 설정</th>
					<td><input type="color" id="fillColor" class="styleParam"></td>
				</tr>
				<tr>
					<th>채우기 투명도 설정</th>
					<td>
						<select id="fillColorAlpha" class="styleParam">
							<option value="1">100% (불투명)</option>
							<option value="0.9">90%</option>
							<option value="0.8">80%</option>
							<option value="0.7">70%</option>
							<option value="0.6">60%</option>
							<option value="0.5">50%</option>
							<option value="0.4">40%</option>
							<option value="0.3">30%</option>
							<option value="0.2">20%</option>
							<option value="0.1">10%</option>
							<option value="0">0% (투명)</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>포인트 반경 설정</th>
					<td>
						<select id="circleRadius" class="styleParam">
							<option value="1">1 meter</option>
							<option value="2">2 meter</option>
							<option value="3">3 meter</option>
							<option value="4">4 meter</option>
							<option value="5">5 meter</option>
							<option value="6">6 meter</option>
							<option value="7">7 meter</option>
							<option value="8">8 meter</option>
							<option value="9">9 meter</option>
							<option value="10">10 meter</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>포인트 아이콘 설정</th>
					<td>
						<div id="base64TextSelect" class="customScroll" style="max-height: 85px; overflow: auto;"></div>
						<input type="number" id="iconMgrSeq" class="styleParam" style="display: none;">
					</td>
				</tr>
				<tr>
					<th>포인트 히트맵 표시</th>
					<td>
						<input type="checkbox" id="heatYn" class="layerParam">
						<label for="heatYn">히트맵 표시 여부 설정</label>
					</td>
				</tr>
			</table>
		</div>
		<div id="sacleTab" class="styleTab table_style">
			<table>
				<tr>
					<th>현재 지도 줌레벨</th>
					<td><input type="text" id="nowZoom" readonly disabled></td>
				</tr>
				<tr>
					<th>현재 지도 해상도</th>
					<td><input type="number" id="nowResolution" readonly disabled></td>
				</tr>
				<tr>
					<th>최소 줌 레벨(확대 했을때)</th>
					<td>
						<select id="minResolution" class="layerParam">
							<option value="0">제한 없음</option>
							<option value="0.004660123347128418">1 레벨  &nbsp&nbsp&nbsp[1 : 17]&nbsp&nbsp&nbsp(가장 깊게 확대)</option>
							<option value="0.009320246694256837">2 레벨  &nbsp&nbsp&nbsp[1 : 35]</option>
							<option value="0.018640493388513674">3 레벨 &nbsp&nbsp&nbsp[1 : 71]</option>
							<option value="0.03728098677702735">4 레벨 &nbsp&nbsp&nbsp[1 : 143]</option>
							<option value="0.0745619735540547">5 레벨&nbsp&nbsp&nbsp [1 : 286]</option>
							<option value="0.1491239471081094">6 레벨 &nbsp&nbsp&nbsp[1 : 572]</option>
							<option value="0.2982478942162188">7 레벨&nbsp&nbsp&nbsp [1 : 1,144]</option>
							<option value="0.5964957884324376">8 레벨 &nbsp&nbsp&nbsp[1 : 2,288]</option>
							<option value="1.1929915768648751">9 레벨 &nbsp&nbsp&nbsp[1 : 4,577]</option>
							<option value="2.3859831537297502">10 레벨 &nbsp&nbsp&nbsp[1 : 9,155]</option>
							<option value="4.7719663074595005">11 레벨&nbsp&nbsp&nbsp [1 : 18,310]</option>
							<option value="9.543932614919001">12 레벨 &nbsp&nbsp&nbsp[1 : 36,621]</option>
							<option value="19.087865229838002">13 레벨 &nbsp&nbsp&nbsp[1 : 73,242]</option>
							<option value="38.175730459676004">14 레벨 &nbsp&nbsp&nbsp[1 : 146,484]</option>
							<option value="76.35146091935201">15 레벨&nbsp&nbsp&nbsp [1 : 292,969]</option>
							<option value="152.70292183870401">16 레벨&nbsp&nbsp&nbsp [1 : 585,939]</option>
							<option value="305.40584367740803">17 레벨  &nbsp&nbsp&nbsp[1 : 1,171,878]&nbsp&nbsp&nbsp(가장 멀리 축소)</option>
						</select>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="tCenter">참고) 수치가 낮을 수록 지도를 확대한 화면입니다.</td>
				</tr>
				<tr>
					<th>최대 줌 레벨(축소 했을때)</th>
					<td>
						<select id="maxResolution" class="layerParam">
							<option value="Infinity">제한 없음</option>
							<option value="0.004660123347128418">1 레벨  &nbsp&nbsp&nbsp[1 : 17]&nbsp&nbsp&nbsp(가장 깊게 확대)</option>
							<option value="0.009320246694256837">2 레벨  &nbsp&nbsp&nbsp[1 : 35]</option>
							<option value="0.018640493388513674">3 레벨 &nbsp&nbsp&nbsp[1 : 71]</option>
							<option value="0.03728098677702735">4 레벨 &nbsp&nbsp&nbsp[1 : 143]</option>
							<option value="0.0745619735540547">5 레벨&nbsp&nbsp&nbsp [1 : 286]</option>
							<option value="0.1491239471081094">6 레벨 &nbsp&nbsp&nbsp[1 : 572]</option>
							<option value="0.2982478942162188">7 레벨&nbsp&nbsp&nbsp [1 : 1,144]</option>
							<option value="0.5964957884324376">8 레벨 &nbsp&nbsp&nbsp[1 : 2,288]</option>
							<option value="1.1929915768648751">9 레벨 &nbsp&nbsp&nbsp[1 : 4,577]</option>
							<option value="2.3859831537297502">10 레벨 &nbsp&nbsp&nbsp[1 : 9,155]</option>
							<option value="4.7719663074595005">11 레벨&nbsp&nbsp&nbsp [1 : 18,310]</option>
							<option value="9.543932614919001">12 레벨 &nbsp&nbsp&nbsp[1 : 36,621]</option>
							<option value="19.087865229838002">13 레벨 &nbsp&nbsp&nbsp[1 : 73,242]</option>
							<option value="38.175730459676004">14 레벨 &nbsp&nbsp&nbsp[1 : 146,484]</option>
							<option value="76.35146091935201">15 레벨&nbsp&nbsp&nbsp [1 : 292,969]</option>
							<option value="152.70292183870401">16 레벨&nbsp&nbsp&nbsp [1 : 585,939]</option>
							<option value="305.40584367740803">17 레벨  &nbsp&nbsp&nbsp[1 : 1,171,878]&nbsp&nbsp&nbsp(가장 멀리 축소)</option>
						</select>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="tCenter">참고) 수치가 높을 수록 높은 곳에서 보이는 화면입니다.</td>
				</tr>
			</table>
		</div>
		<div id="labelTab" class="styleTab table_style">
			<table>
				<tr>
					<th>라벨 대상 필드 설정</th>
					<td>
						<select id="textText" class="styleParam"></select>
					</td>
				</tr>
				<tr>
					<th>외곽선 색상 설정</th>
					<td><input type="color" id="textStrokeColor" class="styleParam"></td>
				</tr>
				<tr>
					<th>외곽선 굵기 설정</th>
					<td>
						<select id="textStrokeWidth" class="styleParam">
							<option value="1">1 pixel</option>
							<option value="2">2 pixel</option>
							<option value="3">3 pixel</option>
							<option value="4">4 pixel</option>
							<option value="5">5 pixel</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>채우기 색상 설정</th>
					<td><input type="color" id="textFillColor" class="styleParam"></td>
				</tr>
				<tr>
					<th>최소 줌 레벨(확대 했을때)</th>
					<td>
						<select id="textMinResolution" class="styleParam">
							<option value="0">제한 없음</option>
							<option value="0.004660123347128418">1 레벨  &nbsp&nbsp&nbsp[1 : 17]&nbsp&nbsp&nbsp(가장 깊게 확대)</option>
							<option value="0.009320246694256837">2 레벨  &nbsp&nbsp&nbsp[1 : 35]</option>
							<option value="0.018640493388513674">3 레벨 &nbsp&nbsp&nbsp[1 : 71]</option>
							<option value="0.03728098677702735">4 레벨 &nbsp&nbsp&nbsp[1 : 143]</option>
							<option value="0.0745619735540547">5 레벨&nbsp&nbsp&nbsp [1 : 286]</option>
							<option value="0.1491239471081094">6 레벨 &nbsp&nbsp&nbsp[1 : 572]</option>
							<option value="0.2982478942162188">7 레벨&nbsp&nbsp&nbsp [1 : 1,144]</option>
							<option value="0.5964957884324376">8 레벨 &nbsp&nbsp&nbsp[1 : 2,288]</option>
							<option value="1.1929915768648751">9 레벨 &nbsp&nbsp&nbsp[1 : 4,577]</option>
							<option value="2.3859831537297502">10 레벨 &nbsp&nbsp&nbsp[1 : 9,155]</option>
							<option value="4.7719663074595005">11 레벨&nbsp&nbsp&nbsp [1 : 18,310]</option>
							<option value="9.543932614919001">12 레벨 &nbsp&nbsp&nbsp[1 : 36,621]</option>
							<option value="19.087865229838002">13 레벨 &nbsp&nbsp&nbsp[1 : 73,242]</option>
							<option value="38.175730459676004">14 레벨 &nbsp&nbsp&nbsp[1 : 146,484]</option>
							<option value="76.35146091935201">15 레벨&nbsp&nbsp&nbsp [1 : 292,969]</option>
							<option value="152.70292183870401">16 레벨&nbsp&nbsp&nbsp [1 : 585,939]</option>
							<option value="305.40584367740803">17 레벨  &nbsp&nbsp&nbsp[1 : 1,171,878]&nbsp&nbsp&nbsp(가장 멀리 축소)</option>
						</select>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="tCenter">참고) 수치가 낮을 수록 지도를 확대한 화면입니다.</td>
				</tr>
				<tr>
					<th>최대 줌 레벨(축소 했을때)</th>
					<td>
						<select id="textMaxResolution" class="styleParam">
							<option value="Infinity">제한 없음</option>
							<option value="0.004660123347128418">1 레벨  &nbsp&nbsp&nbsp[1 : 17]&nbsp&nbsp&nbsp(가장 깊게 확대)</option>
							<option value="0.009320246694256837">2 레벨  &nbsp&nbsp&nbsp[1 : 35]</option>
							<option value="0.018640493388513674">3 레벨 &nbsp&nbsp&nbsp[1 : 71]</option>
							<option value="0.03728098677702735">4 레벨 &nbsp&nbsp&nbsp[1 : 143]</option>
							<option value="0.0745619735540547">5 레벨&nbsp&nbsp&nbsp [1 : 286]</option>
							<option value="0.1491239471081094">6 레벨 &nbsp&nbsp&nbsp[1 : 572]</option>
							<option value="0.2982478942162188">7 레벨&nbsp&nbsp&nbsp [1 : 1,144]</option>
							<option value="0.5964957884324376">8 레벨 &nbsp&nbsp&nbsp[1 : 2,288]</option>
							<option value="1.1929915768648751">9 레벨 &nbsp&nbsp&nbsp[1 : 4,577]</option>
							<option value="2.3859831537297502">10 레벨 &nbsp&nbsp&nbsp[1 : 9,155]</option>
							<option value="4.7719663074595005">11 레벨&nbsp&nbsp&nbsp [1 : 18,310]</option>
							<option value="9.543932614919001">12 레벨 &nbsp&nbsp&nbsp[1 : 36,621]</option>
							<option value="19.087865229838002">13 레벨 &nbsp&nbsp&nbsp[1 : 73,242]</option>
							<option value="38.175730459676004">14 레벨 &nbsp&nbsp&nbsp[1 : 146,484]</option>
							<option value="76.35146091935201">15 레벨&nbsp&nbsp&nbsp [1 : 292,969]</option>
							<option value="152.70292183870401">16 레벨&nbsp&nbsp&nbsp [1 : 585,939]</option>
							<option value="305.40584367740803">17 레벨  &nbsp&nbsp&nbsp[1 : 1,171,878]&nbsp&nbsp&nbsp(가장 멀리 축소)</option>
						</select>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="tCenter">참고) 수치가 높을 수록 높은 곳에서 보이는 화면입니다.</td>
				</tr>
			</table>
		</div>
		<div id="themaTab" class="styleTab table_style customScroll">
			<table>
				<tr>
					<th>주제도 사용 여부</th>
					<td>
						<input type="checkbox" id="thmUseYn" class="layerParam">
						<label for="thmUseYn">사용 여부 설정</label>
					</td>
				</tr>
				<tr>
					<th>주제 대상 필드 설정</th>
					<td><select id="thmFieldId" class="themeParam"></select></td>
				</tr>
				<tr>
					<th>주제 산정 조건</th>
					<td>
						<select id="calcMethod" class="themeParam">
							<option value="distinct">필드의 값으로 고유하게 표현한다.</option>
							<option value="range">필드의 값을 범위로 표현한다.</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>주제 표현 단계</th>
					<td>
						<select id="calcStep" class="themeParam">
							<option value="auto">자동 계산</option>
							<option value="1">1단계</option>
							<option value="2">2단계</option>
							<option value="3">3단계</option>
							<option value="4">4단계</option>
							<option value="5">5단계</option>
							<option value="6">6단계</option>
							<option value="7">7단계</option>
							<option value="8">8단계</option>
							<option value="9">9단계</option>
							<option value="10">10단계</option>
						</select>
					</td>
				</tr>
			</table>
			<div class="topFixBox">
				<div id="themaCalcListWrap" class="table_style">
					<table>
						<thead>
							<tr>
								<th>외곽선 색상</th>
								<th>외곽선 종류</th>
								<th>외곽선 굵기</th>
								<th>채우기 색상</th>
								<th>채우기 투명도</th>
								<th>포인트 반경</th>
								<th width="80">포인트 아이콘</th>
								<th>주제 값</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							<tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="tCenter">
			<button id="saveStyleBtn" class="btn_style" style="width: 30%;">적용</button>
		</div>
	</div>
</div>

<div id="featureInfoWrap" class="dialogWrap customScroll table_style" title="객체 정보">
	<div>
		<table>
			<tbody></tbody>
			<tfoot></tfoot>
		</table>
	</div>
</div>

<div id="layerInfoWrap" class="dialogWrap" title="테이블 정보">
	<div class="customScroll table_style">
		<table>
			<tr class="hidden">
				<th>고유 관리번호</th>
				<td><input type="text" id="mgrSeq" class="layerInfo" readonly disabled></td>
			</tr>
			<tr>
				<th>레이어 한글명</th>
				<td><input type="text" id="lyrNm" class="layerInfo"></td>
			</tr>
			<tr>
				<th>레이어 영문ID</th>
				<td><input type="text" id="tblId" class="layerInfo" readonly disabled></td>
			</tr>
			<tr>
				<th>공간정보 타입</th>
				<td><input type="text" id="lyrTyp" class="layerInfo" readonly disabled></td>
			</tr>
			<tr>
				<th>소유자</th>
				<td><input type="text" id="mkUser" class="layerInfo" readonly disabled></td>
			</tr>
			<tr>
				<th>생성일</th>
				<td><input type="text" id="mkDat" class="layerInfo" readonly disabled></td>
			</tr>
			<tr>
				<th>사용 여부</th>
				<td><input type="checkbox" id="useYn" class="layerInfo">(해제시 범례 목록에서만 제거)</td>
			</tr>
			<tr>
				<td class="tLeft">
					<button id="featureInfoMngBtn" class="btn_style">객체 정보 관리</button>
				</td>
				<td class="tRight">
					<button id="fieldManageBtn" class="btn_Bstyle" style="width: 30%;">필드 관리</button>
					<button id="layerRemoveBtn" class="btn_Gstyle" style="width: 30%;">레이어 삭제</button>
					<button id="layerEditBtn" class="btn_style" style="width: 30%;">저장</button>
				</td>
			</tr>
		</table>
	</div>
</div>

<div id="featureSearchInfoWrap" class="dialogWrap customScroll table_style">
	<h3 class="title">1. 검색 대상 및 필드 선택</h3>
	<table id="featureSearchOptions" class="default">
		<thead>
			<tr>
				<th width="150">1-1. 검색 대상</th>
				<td>
					<select id="featureSearchTargetLayer"></select>
				</td>
				<td width="245">
					<button id="setFieldBtn" class="btn_style2">검색 필드 설정</button>
					<button id="setSpatialBtn" class="btn_Dstyle">공간 분석 추가</button>
				</td>
			</tr>
		</thead>

		<tbody></tbody>

		<tfoot>
			<tr class="spatialTr hidden">
				<th>1-2. 공간 분석 대상</th>
				<td>
					<select id="spatialTargetLayer"></select>
				</td>
				<td>
					<button id="selectFeatureBtn" class="btn_style2">대상 객체 선택</button>
					<!-- <button id="setSpatialFieldBtn" class="btn_style2">연산 필드 설정</button> -->
					<button id="removeSpatialBtn" class="btn_Dstyle">공간 분석 취소</button>
				</td>
			</tr>
		</tfoot>
	</table>

	<h3 class="title">2. 검색 결과 표시 옵션</h3>
	<table id="featureSearchResultOption">
		<tr>
			<th width="150">2-1. 결과 표시 수</th>
			<td>
				<select id="limit">
					<option value="10">10 건</option>
					<option value="20">20 건</option>
					<option value="30">30 건</option>
					<option value="40">40 건</option>
					<option value="50">50 건</option>
					<option value="60">60 건</option>
					<option value="70">70 건</option>
					<option value="80">80 건</option>
					<option value="90">90 건</option>
					<option value="100">100 건</option>
				</select>
			</td>
		</tr>
		<tr>
			<td colspan="2"><button id="featureSearchBtn" class="btn_style">검색</button></td>
		</tr>
	</table>

	<div style="position: relative;">
		<h3 id="searchResultTitle" class="title"></h3>
		<div id="paging"></div>
	</div>

	<div class="customScroll table_style" style="position: relative; width: 100%; overflow: auto;">
		<table id="featureSearchResult" class="default"></table>
	</div>

	<h3 class="createSearchResultLayer hidden title">4. 검색 결과 레이어 생성</h3>
	<div class="createSearchResultLayer box hidden">
		<button id="createSearchResultTableBtn" class="btn_style">물리 레이어 생성</button>
		<button id="createSearchResultViewTableBtn" class="btn_style">참조 레이어 생성</button>
		<button id="createSearchResultExcelBtn" class="btn_style">엑셀 다운로드</button>
	</div>
</div>

<div id="fieldManageWrap" class="dialogWrap table_style" title="필드 관리">
	<div class="customScroll head_fixed" style="height: calc(100% - 65px); overflow-y: auto;">
		<table id="fieldManageTable" class="list">
			<thead>
				<tr>
					<th><label>번호</label></th>
					<th><label>필드 영문명</label></th>
					<th><label>필드 한글명</label></th>
					<th><label>필드 타입</label></th>
					<th><label>필드 길이</label></th>
					<th><label>소수점</label></th>
					<th><label></label></th>
				</tr>
			</thead>
<!-- 			<tbody> -->
<!-- 			</tbody> -->
		</table>
	</div>
	<button id="saveBtn" class="btn_style">확인</button>
</div>

<div id="layerIconManageWrap" title="레이어 아이콘 관리" class="dialogWrap customScroll table_style">
	<div class="customScroll head_fixed">
		<table>
			<thead>
				<tr>
					<td colspan="3"><p class="tCenter helpText">* 아이콘을 저장 하시려면 이미지 우클릭 후 &lt;이미지를 다른 이름으로 저장&gt; 을 선택하세요.</p></td>
					<td width="96px"><input type="file" id="iconFile" accept="image/*" multiple style="display: none;"><label for="iconFile" class="btn_Dstyle">아이콘 추가</label></td>
				</tr>
				<tr>
					<th>업로드 이미지</th>
					<th>생성자</th>
					<th>생성일</th>
					<th>관리</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
</div>

<div id="mapExportWrap" title="지도 저장" class="dialogWrap customScroll table_style">
	<div class="customScroll">
		<table>
			<tbody>
				<tr>
					<th>이미지 (PNG)</th>
					<th>문서 (PDF)</th>
				</tr>
				<tr>
					<th><img src="data:image/png;base64,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"></th>
					<th><img src="data:image/png;base64,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"></th>
				</tr>
				<tr>
					<td>
						<select id="pngSize">
							<option value="">이미지 크기 선택</option>
							<option value="browserSize">1. 지도 크기</option>
							<option value="a0">2. A0 (느림)</option>
							<option value="a1">3. A1</option>
							<option value="a2">4. A2</option>
							<option value="a3">5. A3</option>
							<option value="a4">6. A4</option>
							<option value="a5">7. A5 (빠름)</option>
							<!-- <option value="a0">1. A0 (느림)</option>
							<option value="a1">2. A1</option>
							<option value="a2">3. A2</option>
							<option value="a3">4. A3</option>
							<option value="a4">5. A4</option>
							<option value="a5">6. A5 (빠름)</option> -->
						</select>
					</td>
					<td>
						<select id="pdfSize">
							<option value="">문서 크기 선택</option>
							<option value="a0">1. A0 (느림)</option>
							<option value="a1">2. A1</option>
							<option value="a2">3. A2</option>
							<option value="a3">4. A3</option>
							<option value="a4">5. A4</option>
							<option value="a5">6. A5 (빠름)</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>
						<select id="pngResolution">
							<option value="">이미지 해상도 선택</option>
							<option value="browserSize">1. 지도 해상도</option>
							<option value="75">2. 75 DPI (빠름)</option>
							<option value="150">3. 150 DPI (보통)</option>
							<option value="300">4. 300 DPI (느림)</option>
							<!-- <option value="75">1. 75 DPI (빠름)</option>
							<option value="150">2. 150 DPI (보통)</option>
							<option value="300">3. 300 DPI (느림)</option> -->
						</select>
					</td>
					<td>
						<select id="pdfResolution">
							<option value="">문서 해상도 선택</option>
							<option value="75">1. 75 DPI (빠름)</option>
							<option value="150">2. 150 DPI (보통)</option>
							<option value="300">3. 300 DPI (느림)</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>
						<input type="checkbox" id="pngAutoPrint" name="pngAutoPoint" style="vertical-align: inherit;">
						<label for="pngAutoPrint">파일을 저장하지 않고 인쇄하겠습니다.</label>
					</td>
					<td>
						<input type="checkbox" id="pdfAutoPrint" name="pdfAutoPoint" style="vertical-align: inherit;">
						<label for="pdfAutoPrint">파일을 저장하지 않고 인쇄하겠습니다.</label>
					</td>
				</tr>
				<tr>
					<td><button class="btn_style exportBtn" ext="png">PNG 추출 시작</button></td>
					<td><button class="btn_style exportBtn" ext="pdf">PDF 추출 시작</button></td>
				</tr>
				<tr>
					<td colspan="2">
						<p class="tLeft">* 지도 위 공간정보는 &lt;크기, 해상도&gt;와 관계없이 현재 지도에 보여지는 객체만 추출됩니다.</p><br><br>
						<p class="tLeft">* 인쇄시 각종 옵션(용지 크기, 방향, 컬러 등)은 직접 설정해야 합니다.</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<div id="keyboardDocumentWrap" title="키보드 제어 단축키 도움말" class="dialogWrap customScroll table_style">
	<div>
		<h3 class="title tCenter">지도 제어</h3>
		<table>
			<tbody>
				<tr>
					<th width="200">전제 조건</th>
					<td>없음</td>
				</tr>
				<tr>
					<th>이동</th>
					<td>
						<kbd>M</kbd> + <kbd>4, 8, 6, 2 (Number Pad)</kbd>
					</td>
				</tr>
				<tr>
					<th>줌 레벨 변경</th>
					<td>
						<kbd>M</kbd> + <kbd>+, - (Number Pad)</kbd>
					</td>
				</tr>
				<tr>
					<th>각도 변경</th>
					<td>
						<kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Drag (Mouse)</kbd>
					</td>
				</tr>
			</tbody>
		</table>

		<h3 class="title tCenter">CCTV 제어</h3>
		<table>
			<tbody>
				<tr>
					<th width="200">전제 조건</th>
					<td>단독 재생중인 플레이어 중 제어 대상 플레이어 클릭</td>
				</tr>
				<tr>
					<th>제어모드 시작</th>
					<td>
						<kbd>C</kbd>
					</td>
				</tr>
				<tr>
					<th>Pan, Tilt 제어</th>
					<td>
						<kbd>C</kbd> + <kbd>4, 8, 6, 2 (Number Pad)</kbd>
					</td>
				</tr>
				<tr>
					<th>Zoom 제어</th>
					<td>
						<kbd>C</kbd> + <kbd>+, - (Number Pad)</kbd>
					</td>
				</tr>
				<tr>
					<th>제어모드 종료</th>
					<td>
						<kbd>ESC</kbd>
					</td>
				</tr>
			</tbody>
		</table>

		<h3 class="title tCenter">공간정보 스타일 제어</h3>
		<table>
			<tbody>
				<tr>
					<th width="200">전제 조건</th>
					<td>없음</td>
				</tr>
				<tr>
					<th>겹침 갯수 토글(활성화 / 비활성화)</th>
					<td>
						<kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
					</td>
				</tr>
			</tbody>
		</table>

		<h3 class="title tCenter">공간 편집 제어</h3>
		<table>
			<tbody>
				<tr>
					<th width="200">전제 조건</th>
					<td>공간 편집중일 경우만 작동</td>
				</tr>
				<tr>
					<th>제어모드 시작</th>
					<td>
						<kbd>C</kbd>
					</td>
				</tr>
				<tr>
					<th>현재 편집 저장</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>S</kbd>
					</td>
				</tr>
				<tr>
					<th>스냅 토글(활성화 / 비활성화)</th>
					<td>
						<kbd>Alt</kbd> + <kbd>S</kbd>
					</td>
				</tr>
				<tr>
					<th>객체 전체 선택</th>
					<td>
						<kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd>
					</td>
				</tr>
				<tr>
					<th>객체 영역 선택</th>
					<td>
						<kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Drag (Mouse)</kbd>
					</td>
				</tr>
				<tr>
					<th>선택된 객체 제거</th>
					<td>
						<kbd>Del</kbd>
					</td>
				</tr>
				<tr>
					<th>자유 그리기 (Line, Polygon)</th>
					<td>
						<kbd>Shift</kbd> + <kbd>Drag (Mouse)</kbd>
					</td>
				</tr>
				<tr>
					<th>선택된 폴리곤 객체 병합</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>M</kbd>
					</td>
				</tr>
				<tr>
					<th>선택된 폴리곤 객체 분할</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>i</kbd>
					</td>
				</tr>
				<tr>
					<th>객체 잘라내기</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>X</kbd>
					</td>
				</tr>
				<tr>
					<th>객체 복사하기</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>C</kbd>
					</td>
				</tr>
				<tr>
					<th>객체 붙혀넣기</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>V</kbd>
					</td>
				</tr>
				<tr>
					<th>뒤로 되돌리기 (Undo)</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>Z</kbd>
					</td>
				</tr>
				<tr>
					<th>앞으로 되돌리기 (Redo)</th>
					<td>
						<kbd>Ctrl</kbd> + <kbd>Y</kbd>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>