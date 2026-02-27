<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<title><%= projNm %></title>
<jsp:include page="../resource.jsp" >
	<jsp:param name="c" value="<%= accTime %>" />
	<jsp:param name="v" value="<%= version %>" />

	<jsp:param name="proxy" value="<%= proxy %>" />

	<jsp:param name="userId" value="<%= userId %>" />
	<jsp:param name="userGrpNo" value="<%= authGrpId %>" />
	<jsp:param name="orgMgrNo" value="<%= orgMgrNo %>" />
	<jsp:param name="authMgrNo" value="<%= authMgrNo %>" />
	<jsp:param name="authGrpId" value="<%= authGrpId %>" />
</jsp:include>
</head>
<body>
<div id="rootWrap">
	<div id="header">
		<!-- <a href="ddas://ddas">C/S 형태의 PC 로컬 프로그램 켜기</a> -->
		<div id="mainTabs">
			<div class="top_box">
				<h1 class="ci"><%= projNm %></h1>
				<ul class="tab_wrap">
					<li><a href="#layerTab">레이어 관리</a></li>
					<li><a href="#gisEditTab">공간 편집</a></li>
					<li><a href="#systemTab">시스템 설정</a></li>
				</ul>
			</div>
			<div class="menu_wrap">
				<div class="user_info">
					<span class="user_nm">아이디 : <%=userId%> 그룹 : <%=authGrpNm%></span>
					<button id="logoutBtn" class="btn_Dstyle">로그아웃</button>
				</div>

				<div id="layerTab" class="tab_style">
					<button id="createNewLayer">신규 레이어 생성</button>
					<button id="shareLayer">레이어 공유</button>
					<button class="rqstShpBtn" key="import">SHP 가져오기</button>
					<div id="importShpWrap" class="dialogWrap" title="SHP 가져오기">
						<div class="table_style">
							<table>
								<tr>
									<th width="150">레이어 명칭</th>
									<td><input type="text" name="layerNm" id="layerNm" placeholder="레이어 명칭을 입력해 주세요." required></td>
								</tr>
								<tr>
									<th width="150">파일</th>
									<td><input type="file" name="file" id="shpFile" class="boxFile" accept=".shp, .shx, .dbf, .fix, .prj" multiple></td>
								</tr>
								<tr>
									<th>SHP 파일의 좌표계</th>
									<td>
										<select id="srcSRID" class="customScroll" size="21">
											<optgroup label="1. WGS84 및 Google">
												<option value="3857">EPSG:3857 - 구글 좌표계</option>
											</optgroup>
											<optgroup label="2. BESSEL">
												<option value="5173">EPSG:5173 - 서부 20만 50만</option>
												<option value="5174">EPSG:5174 - 중부 20만 50만</option>
												<option value="5175">EPSG:5175 - 제주 20만 55만</option>
												<option value="5176">EPSG:5176 - 동부 20만 50만</option>
												<option value="5177">EPSG:5177 - 동해 20만 50만</option>
												<option value="5178">EPSG:5178 - UTM-K 100만 200만 (새주소 지도에서 사용)</option>
											</optgroup>
											<optgroup label="3. GRS80">
												<option value="5179">EPSG:5179 - UTM-K 100만 200만 (네이버 지도에서 사용)</option>
												<option value="5180">EPSG:5180 - 서부원점 20만 50만</option>
												<option value="5181">EPSG:5181 - 중부원점 20만 50만 (카카오 지도에서 사용)</option>
												<option value="5182">EPSG:5182 - 제주원점 20만 55만</option>
												<option value="5183">EPSG:5183 - 동부원점 20만 50만</option>
												<option value="5184">EPSG:5184 - 동해(울릉)원점 20만 50만</option>
												<option value="5185">EPSG:5185 - 서부원점 20만 60만</option>
												<option value="5186" selected>EPSG:5186 - 중부원점 20만 60만</option>
												<option value="5187">EPSG:5187 - 동부원점 20만 60만</option>
												<option value="5188">EPSG:5188 - 동해(울릉)원점 20만 60만</option>
											</optgroup>
										</select>
									</td>
								</tr>
								<tr class="hidden">
									<th>저장 대상 스키마</th>
									<td>
										<select id="tgtDbSchema" style="width:100%;">
										</select>
									</td>
								</tr>
								<tr>
									<td colspan="2" style="text-align: center; border: none;">
										<button id="shpImportBtn" class="btn_style" tabindex="4">가져오기</button>
									</td>
								</tr>
								<tr>
									<td colspan="2" style="text-align: left; border: none; padding: 0;">
										<p><b>* 필수 업로드 대상 확장자는 shp, .shx, .dbf 입니다.</b></p><br>
										<p><b>* 한글 데이터의 경우 EUC-KR로 인코딩 되며 불분명한 인코딩의 경우 데이터가 손상 될 수 있습니다.</b></p><br>
										<p><b>* 업로드 후, 범례에서 레이어명을 변경해주시길 바랍니다.</b></p>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<button class="rqstShpBtn" key="export">SHP 내보내기</button>
					<div id="exportShpWrap" class="dialogWrap" title="SHP 내보내기">
						<div class="table_style">
							<table>
								<tr>
									<th width="150">레이어 목록</th>
									<td>
										<select id="dbTableList" size="30" class="customScroll"></select>
									</td>
								</tr>
								<tr>
									<th>내보낼 좌표계</th>
									<td>
										<select id="tgtSRID" style="width: 100%;">
											<optgroup label="1. WGS84 및 Google">
												<option value="3857">EPSG:3857 - 구글 좌표계</option>
											</optgroup>
											<optgroup label="2. BESSEL">
												<option value="5173">EPSG:5173 - 서부 20만 50만</option>
												<option value="5174">EPSG:5174 - 중부 20만 50만</option>
												<option value="5175">EPSG:5175 - 제주 20만 55만</option>
												<option value="5176">EPSG:5176 - 동부 20만 50만</option>
												<option value="5177">EPSG:5177 - 동해 20만 50만</option>
												<option value="5178">EPSG:5178 - UTM-K 100만 200만 (새주소 지도에서 사용)</option>
											</optgroup>
											<optgroup label="3. GRS80">
												<option value="5179">EPSG:5179 - UTM-K 100만 200만 (네이버 지도에서 사용)</option>
												<option value="5180">EPSG:5180 - 서부원점 20만 50만</option>
												<option value="5181">EPSG:5181 - 중부원점 20만 50만 (카카오 지도에서 사용)</option>
												<option value="5182">EPSG:5182 - 제주원점 20만 55만</option>
												<option value="5183">EPSG:5183 - 동부원점 20만 50만</option>
												<option value="5184">EPSG:5184 - 동해(울릉)원점 20만 50만</option>
												<option value="5185">EPSG:5185 - 서부원점 20만 60만</option>
												<option value="5186" selected>EPSG:5186 - 중부원점 20만 60만</option>
												<option value="5187">EPSG:5187 - 동부원점 20만 60만</option>
												<option value="5188">EPSG:5188 - 동해(울릉)원점 20만 60만</option>
											</optgroup>
										</select>
									</td>
								</tr>
							</table>
							<button id="shpExportBtn" class="btn_style" tabindex="4">내보내기</button>
						</div>
					</div>

					<button id="findSrid">SHP 좌표계 찾기</button>

<!-- 						<button id="filterExample">필터링 샘플보기</button> -->

					<button id="uploadExcel">EXCEL 가져오기</button>
				</div>
				<div id="gisEditTab">
					<h2>편집</h2>
					<select id="editLayerSelect">
						<option value="">대상 선택</option>
					</select>
					<button id="startGeometryEdit" class="editBtn btn_style2">시작</button>
					<button id="stopGeometryEdit" class="editBtn btn_Dstyle2" disabled>종료</button>
					<!-- <button id="snapTargetEdit">스냅 대상 설정</button> -->
				</div>
				<div id="systemTab" class="tab_style">


				<% if("G00001".equals(authGrpId)){ %>
					<button id="userManage">사용자 관리</button>
					<button id="authManage">권한 관리</button>
					<button id="layerGroupManage">레이어 그룹 관리</button>
					<button id="layerAuthManage">레이어 권한 관리</button>
					<button id="layerIconManage">레이어 아이콘 관리</button>
				<% } %>
					<!-- <button>DBMS 설정</button>
					<button>저장공간 설정</button> -->
				</div>
			</div>
		</div>
	</div>
	<div id="body">
		<div id="map"></div>

		<jsp:include page="../commonPage/mapInteraction.jsp"></jsp:include>
	</div>
</div>

</body>
</html>