<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<title>SHP 좌표계 찾기</title>
<jsp:include page="../minResource.jsp" >
	<jsp:param name="c" value="<%= accTime %>" />
	<jsp:param name="v" value="<%= version %>" />
</jsp:include>
<style>
#rootWrap { background: black; }
#body { width: 100%; height: 100%; }
#epsg { width: 100%; height: 100%; outline: none; }
#controlWrap table { font-size: 12px; }
#controlWrap table #uploadZip { width: 100%; }
</style>
</head>
<body>

<div id="rootWrap">
	<div id="controlWrap" title="SHP(ZIP)파일 로드 및 좌표계 선택">
		<table>
			<tr>
				<td><input type="file" id="uploadZip" accept=".zip"></td>
			</tr>
			<tr>
				<td colspan="2">
					<select id="epsg" size="21" class="customScroll">
						<optgroup label="1. WGS84 및 Google">
							<option value="EPSG:3857">EPSG:3857 - 구글 좌표계</option>
							<option value="EPSG:4326">EPSG:4326 - 경위도 좌표계</option>
						</optgroup>
						<optgroup label="2. BESSEL">
							<option value="EPSG:5173">EPSG:5173 - 서부 20만 50만</option>
							<option value="EPSG:5174">EPSG:5174 - 중부 20만 50만</option>
							<option value="EPSG:5175">EPSG:5175 - 제주 20만 55만</option>
							<option value="EPSG:5176">EPSG:5176 - 동부 20만 50만</option>
							<option value="EPSG:5177">EPSG:5177 - 동해 20만 50만</option>
							<option value="EPSG:5178">EPSG:5178 - UTM-K 100만 200만 (새주소 지도에서 사용)</option>
						</optgroup>
						<optgroup label="3. GRS80">
							<option value="EPSG:5179">EPSG:5179 - UTM-K 100만 200만 (네이버 지도에서 사용)</option>
							<option value="EPSG:5180">EPSG:5180 - 서부원점 20만 50만</option>
							<option value="EPSG:5181">EPSG:5181 - 중부원점 20만 50만 (카카오 지도에서 사용)</option>
							<option value="EPSG:5182">EPSG:5182 - 제주원점 20만 55만</option>
							<option value="EPSG:5183">EPSG:5183 - 동부원점 20만 50만</option>
							<option value="EPSG:5184">EPSG:5184 - 동해(울릉)원점 20만 50만</option>
							<option value="EPSG:5185">EPSG:5185 - 서부원점 20만 60만</option>
							<option value="EPSG:5186" selected>EPSG:5186 - 중부원점 20만 60만</option>
							<option value="EPSG:5187">EPSG:5187 - 동부원점 20만 60만</option>
							<option value="EPSG:5188">EPSG:5188 - 동해(울릉)원점 20만 60만</option>
						</optgroup>
					</select>
				</td>
			</tr>
			<tr>
				<td><button id="toggleMap" class="btn_style">배경 지도 변경</button></td>
			</tr>
		</table>
	</div>
	<div id="body">
		<div id="map"></div>
	</div>
</div>

</body>
</html>