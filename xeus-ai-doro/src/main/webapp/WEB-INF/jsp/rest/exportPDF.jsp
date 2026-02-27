<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_ColumnVo"%>
<%@ page import="com.itextpdf.text.pdf.PdfWriter"%>
<%@ page import="com.itextpdf.text.*"%>
<%@ include file="../common.jsp" %>
<%
String k = (String) request.getAttribute("k");
String s = (String) request.getAttribute("s");
String t = (String) request.getAttribute("t");
String apiKey = (String) request.getAttribute("apiKey");
if(StringUtils.isEmpty(apiKey)) apiKey = "문서 제공자에게 문의";

ArrayList<GMT_ColumnVo> column = (ArrayList<GMT_ColumnVo>) request.getAttribute("column");

int num = column.size()/2;




String randomColumn = "";
for(int i=0; i<column.size(); i++){
	String colId = column.get(i).getColId();
	if("_gid".equals(colId) || "_annox".equals(colId) || "_annoy".equals(colId) || "mgr_seq".equals(colId) || "mgr_no".equals(colId)){
		continue;
	}else{
		randomColumn = colId;
		break;
	}
}

%>
<!DOCTYPE html>
<html>
<head>
<title><%= projNm %> REST API 명세서</title>
<style>
* { font-family: NanumBarunGothic; }
@page { size: A4; }
body { width:99%; height:100%; }
h2 { font-weight: normal; }
p { margin: 10px 0px 10px 10px; padding: 0px; }
table { width: 100%; }
table tr { border: 1px solid gray; }
table th { text-align: center; color: white; background: gray; padding: 10px; font-weight: normal; }
.tCenter { text-align: center; }
.tRight { text-align: right; }
.red { color: red; }
</style>
</head>
<body>

<h2 class="tCenter"><%= projNm %> REST API 명세서</h2>
<p class="tRight"><%= "문서 제공일 : " + DateUtil.formatDate(DateUtil.getStrSec())%></p>
<p class="tRight"><%= "문서 제공자 : " + userNm %></p>

<table>
	<tbody>
		<!-- 1. REQUEST INFORMATION -->
		<tr>
			<th colspan="4">1. Request Information</th>
		</tr>
		<tr>
			<th width="100">URL</th>
			<td colspan="3">
				<p>http://{통합플랫폼서버IP}:{PORT}/xeus/rest/facility/{Mode}</p>
			</td>
		</tr>
		<tr>
			<th>Method</th>
			<td>
				<p class="tCenter">POST</p>
			</td>
			<th>Mode</th>
			<td class="tCenter">
				<p>insert / update / delete / select</p>
			</td>
		</tr>
		<tr>
			<th>API KEY</th>
			<td colspan="3">
				<p><%= apiKey %></p>
			</td>
		</tr>
		<tr>
			<th>Header<br></br>(필수 항목)</th>
			<td colspan="3">
				<p>Authorization - API KEY</p>
				<p>facilityId - 시설물 영문명 (레이어 ID - 모든 Mode 에서 사용)</p>
				<p>featureTargetKey - 관리 대상 필드 (고유 관리 필드 - update, delete,  관리 필드 - select)</p>
				<p>featureTargetVal - 관리 대상 필드 값 (고유 관리 값 - update, delete,  관리 필드 - select)</p>
				<p class="red">* facilityId, featureTargetKey, featureTargetVal의 값은 모두 base64 인코딩 후 입력</p>
			</td>
		</tr>
		<tr>
			<th>Header<br></br>(선택 항목)</th>
			<td colspan="3">
				<p>geolocationLon - 경도</p>
				<p>geolocationLat - 위도</p>
				<p class="red">* 두 항목이 모두 유효한 값일 경우만 위치 정보 반영</p>
			</td>
		</tr>

		<!-- 2. FACILITY INFORMATION -->
		<tr>
			<th colspan="4">2. Facility Information</th>
		</tr>
		<tr>
			<th width="100">facilityId<br></br>(영문명)</th>
			<td>
				<p class="tCenter"><%= t %></p>
			</td>
			<th width="100">facilityName<br></br>(한글명)</th>
			<td>
				<p class="tCenter"><%= k %></p>
			</td>
		</tr>
		<tr>
			<th>Parameters</th>
			<td colspan="3">
				<table>
					<tr>
						<th>필드명(featureTargetKey)</th>
						<th>한글명(참고)</th>
						<th>데이터 종류</th>
						<th>데이터 길이</th>
					</tr>
				<%
				for(GMT_ColumnVo vo : column){
					if("_annox".equals(vo.getColId()) || "_annoy".equals(vo.getColId()) || "_geometry".equals(vo.getColId())) continue;

					String dataSize = !StringUtils.isEmpty(vo.getStringSize()) ? vo.getStringSize() : vo.getNumericPrecision() + ", " + vo.getNumericPrecisionRadixsize();
					if("text".equals(vo.getDataType().toLowerCase())) dataSize = "∞";
				%>
					<tr>
						<td class="tCenter"><%= vo.getColId() %><% if(vo.isPkey()){ %><span class="red"> (PK)</span><% } %></td>
						<td class="tCenter"><%= StringUtils.defaultIfEmpty(vo.getColNm(), "") %></td>
						<td class="tCenter"><%= vo.getDataType() %></td>
						<td class="tCenter"><%= dataSize %></td>
					</tr>
				<%
				}
				%>
				</table>
			</td>
		</tr>

		<!-- 3. Example -->
		<tr>
			<th colspan="4">3. Sample Request - CURL</th>
		</tr>
		<tr>
			<th width="100">Insert</th>
			<td colspan="3">
<pre>
	curl

	-H "Authorization : <%= apiKey %>"
	-H "facilityId : <%= t %> <span class="red"> (Base64 Encoding)</span>"
	-H "geolocationLon : 127.05377659041525"
	-H "geolocationLat : 37.49693793173835"

	-X POST http://{통합플랫폼서버IP}:{PORT}/xeus/rest/facility/insert

	-d <%= randomColumn %>=API_TEST_INSERT_VALUE
	<span class="red">*_gid(pk)는 넣지 않아도 자동증가</span>
</pre>
			</td>
		</tr>
		<tr>
			<th width="100">Update</th>
			<td colspan="3">
<pre>
	curl

	-H "Authorization : <%= apiKey %>"
	-H "facilityId : <%= t %> <span class="red"> (Base64 Encoding)</span>"
	-H "featureTargetKey : _gid <span class="red">(Base64 Encoding)</span>"
	-H "featureTargetVal : 200 <span class="red">(Base64 Encoding)</span>"
	-H "geolocationLon : 127.05377659041525"
	-H "geolocationLat : 37.49693793173835"

	-X POST http://{통합플랫폼서버IP}:{PORT}/xeus/rest/facility/update

	-d <%= randomColumn %>=API_TEST_UPDATE_VALUE
</pre>
			</td>
		</tr>
		<tr>
			<th width="100">Delete</th>
			<td colspan="3">
<pre>
	curl

	-H "Authorization : <%= apiKey %>"
	-H "facilityId : <%= t %> <span class="red"> (Base64 Encoding)</span>"
	-H "featureTargetKey : _gid <span class="red">(Base64 Encoding)</span>"
	-H "featureTargetVal : 200 <span class="red">(Base64 Encoding)</span>"

	-X POST http://{통합플랫폼서버IP}:{PORT}/xeus/rest/facility/delete
</pre>
			</td>
		</tr>
		<tr>
			<th width="100">Select</th>
			<td colspan="3">
<pre>
	curl

	-H "Authorization : <%= apiKey %>"
	-H "facilityId : <%= t %> <span class="red"> (Base64 Encoding)</span>"
	-H "featureTargetKey : <%= randomColumn %> <span class="red">(Base64 Encoding)</span>"
	-H "featureTargetVal : API_TEST_SELECT_VALUE <span class="red">(Base64 Encoding)</span>"

	-X POST http://{통합플랫폼서버IP}:{PORT}/xeus/rest/facility/select
</pre>
			</td>
		</tr>
	</tbody>
</table>

</body>
</html>