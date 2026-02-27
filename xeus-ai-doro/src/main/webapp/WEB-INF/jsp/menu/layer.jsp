<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.LayerDescVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.map.service.MapVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ include file="../common.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title><%= projNm %></title>
<jsp:include page="../layerResource.jsp">
	<jsp:param name="c" value="<%= accTime %>" />
	<jsp:param name="v" value="<%= version %>" />

	<jsp:param name="proxy" value="<%= proxy %>" />

	<jsp:param name="userId" value="<%= userId %>" />
	<jsp:param name="userGrpNo" value="<%= authGrpId %>" />
	<jsp:param name="orgMgrNo" value="<%= orgMgrNo %>" />
	<jsp:param name="authMgrNo" value="<%= authMgrNo %>" />
	<jsp:param name="authGrpId" value="<%= authGrpId %>" />
</jsp:include>
<script type="text/javascript">
var ctxPath = "<%= context %>";
var isTray = <%= isTray %>;
var tabName = "layerTab";
</script>
</head>
<body id="parentBody">
	<div id="rootWrap">
		<div id="header">
			<!-- <a href="ddas://ddas">C/S 형태의 PC 로컬 프로그램 켜기</a> -->
			<div id="mainTabs">
				<div class="top_box">
					<h1 class="ci"><%= projNm %></h1>
					<ul class="tab_wrap">
<% if(authGrpList != null && authGrpList.size() > 0){ %>
<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN001")) %> <li><button class="event" onclick="TOP_MENU_MOVE(this, event, './event.do');">AI 도로안전 모니터링</button></li>
	<%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN004")) %> <li><button class="nms" onclick="TOP_MENU_MOVE(this, event, './nms.do');">장비관리</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN005")) %> <li><button class="board" onclick="TOP_MENU_MOVE(this, event, './board.do');">대시보드</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN006")) %> <li><button class="bigdata" onclick="TOP_MENU_MOVE(this, event, './bigdata.do');">빅데이터 분석</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN007")) %> <li><button class="stat" onclick="TOP_MENU_MOVE(this, event, './stat.do');">통계 조회</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN008")) %> <li><button class="history" onclick="TOP_MENU_MOVE(this, event, './history.do');">이력 조회</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN011")) %> <li><button class="gisEdit" onclick="TOP_MENU_MOVE(this, event, './gisEdit.do');">공간 편집</button></li> 
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN010")) %> <li><button class="layer active" onclick="TOP_MENU_MOVE(this, event, './layer.do');">레이어 관리</button></li>--%>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN012")) %> <li><button class="layerAuth" onclick="TOP_MENU_MOVE(this, event, './layerAuth.do');">레이어 권한</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN009")) %> <li><button class="systemMng" onclick="TOP_MENU_MOVE(this, event, './systemMng.do');">시스템 관리</button></li>
<% } %>
					</ul>
					<div class="drop_wrap">
						<div class="now_menu"></div>
						<button class="btn_drop">
							<span class="bar"></span>
							<span class="bar"></span>
							<span class="bar"></span>
						</button>
						<ul class="drop_menu">
							<%if(isCCTVDomain){
	 if(authGrpList != null && authGrpList.size() > 0){ %>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
	<% }
}else{
	if(authGrpList != null && authGrpList.size() > 0){ %>
		<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN001")) %> <li><button class="event" onclick="TOP_MENU_MOVE(this, event, './event.do');">AI 도로안전 모니터링</button></li>
	<%-- <% if(authGrpList.get(0).getAuthMgrNo().contains("BTN002")) %> <li><button class="tvius" onclick="TOP_MENU_MOVE(this, event, './tvius.do');">영상반출 신청</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN003")) %> <li><button class="tviusMng" onclick="TOP_MENU_MOVE(this, event, './tviusMng.do');">영상반출 관리</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN004")) %> <li><button class="nms" onclick="TOP_MENU_MOVE(this, event, './nms.do');">장비관리</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN005")) %> <li><button class="board" onclick="TOP_MENU_MOVE(this, event, './board.do');">대시보드</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN006")) %> <li><button class="bigdata" onclick="TOP_MENU_MOVE(this, event, './bigdata.do');">빅데이터 분석</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN007")) %> <li><button class="stat" onclick="TOP_MENU_MOVE(this, event, './stat.do');">통계 조회</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN008")) %> <li><button class="history" onclick="TOP_MENU_MOVE(this, event, './history.do');">이력 조회</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN011")) %> <li><button class="gisEdit" onclick="TOP_MENU_MOVE(this, event, './gisEdit.do');">공간 편집</button></li> 
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN010")) %> <li><button class="layer active" onclick="TOP_MENU_MOVE(this, event, './layer.do');">레이어 관리</button></li>--%>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN012")) %> <li><button class="layerAuth" onclick="TOP_MENU_MOVE(this, event, './layerAuth.do');">레이어 권한</button></li>
	<% if(authGrpList.get(0).getAuthMgrNo().contains("BTN009")) %> <li><button class="systemMng" onclick="TOP_MENU_MOVE(this, event, './systemMng.do');">시스템 관리</button></li>
	<% } %>
<% } %>
						</ul>
					</div>
				</div>
				<div class="menu_wrap">
					<div class="user_info">
						<span class="user_nm"><%=userId%> 님의 접속을 환영합니다.</span>
						<button id="logoutBtn" class="btn_Dstyle">로그아웃</button>
						<div class="btn_setting_wrap open">
							<button class="btn_set_open">
								<i class="fas fa-cog"></i>
							</button>
							<button class="btn_setting">개인설정</button>
							<button class="btn_keyboard_help">키보드 제어 도움말</button>
						</div>
					</div>

					<div id="layerTab" class="tab_style">
						<!-- <button class="startMenu" id="btn-lgd-mng">범례</button> -->
						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC033")) %>
						<button class="startMenu" id="createNewLayer">신규 레이어 생성</button>

						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC034")) %>
						<button class="startMenu" id="shareLayer">레이어 공유</button>

						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC035")) %>
						<button class="startMenu rqstShpBtn" id="btn-import-shp" key="import">SHP 가져오기</button>

						<div id="importShpWrap" class="dialogWrap customScroll table_style" title="SHP 가져오기">
							<div>
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
											<select id="srcSRID" class="customScroll" size="21" style="height: 450px;">
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

						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC036")) %>
						<button class="startMenu rqstShpBtn" id="btn-export-shp" key="export">SHP 내보내기</button>
						<div id="exportShpWrap" class="dialogWrap customScroll table_style" title="SHP 내보내기">
							<div>
								<table>
									<tr>
										<th width="150">레이어 목록</th>
										<td>
											<select id="dbTableList" size="30" class="customScroll" style="height: 610px;"></select>
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

						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC037")) %>
						<button class="startMenu" id="findSrid">SHP 좌표계 찾기</button>

						<% if(authGrpList.get(0).getAuthMgrNo().contains("SVC038")) %>
						<button class="startMenu" id="uploadExcel">EXCEL 가져오기</button>
					</div>
				</div>
			</div>
		</div>
		<div id="body">
			<div id="map"></div>

			<jsp:include page="../GMT/commonPage/mapInteraction.jsp"></jsp:include>

			<div id="popupWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="contentWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="assetEditWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="netMonitoringWrap" title="" class="dialogWrap customScroll table_style"></div>
			<div id="gridMonitoringWrap" title="" class="dialogWrap hiddenScroll table_style"></div>
			<div id="featureSelectInfoWrap" title="" class="dialogWrap customScroll table_style"></div>

		</div>
	</div>
</body>
</html>