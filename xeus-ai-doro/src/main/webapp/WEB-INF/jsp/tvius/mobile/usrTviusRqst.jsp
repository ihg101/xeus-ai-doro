<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../common.jsp"%>
<%
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD50 // 신청근거 */
    HashMap<String, String> chkReqstResn = cde.convertCodeGrpToAllCde("C50");
    Set<String> chkReqstResnKey = new TreeSet<String>(chkReqstResn.keySet());
    Iterator<String> chkReqstResnItr = chkReqstResnKey.iterator();

    /* CD51 // 8대중과실 */
    HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
    Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
    Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    HashMap<String, String> sysParam = (HashMap<String, String>) request.getAttribute("sysparam");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="../../common/jquerymobile/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="../../common/ol-v4.0.1/ol.css">
<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="../../common/jquerymobile/jquery-1.11.1.min.js"></script>
<script src="../../common/jquerymobile/jquery.mobile-1.4.5.min.js"></script>
<title>제천시 스마트시티 통합플랫폼</title>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b" data-title="영상 반출 신청">

	<div data-role="header" align="center">
		<a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a>
		<img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px">
	</div>

	<div role="main" class="ui-content">
		<form method="POST" enctype="multipart/form-data" id="regForm">
			<table id="regTable">
				<tbody>
					<tr class="hidden">
						<th>관리번호</th>
						<td colspan="3"><input class="sendData" type="text" id="mgrSeq" readonly="readonly" value=""></td>
					</tr>
					<tr>
						<th>신청자</th>
						<td colspan="3"><input class="sendData" type="text" id="reqstId" readonly="readonly" value="<%= userId %>"></td>
					</tr>
					<tr>
						<th>신청근거</th>
						<td colspan="3">
							<select class="sendData" id="reqstResn" name="reqstResn" required>
								<option value="">선택</option>
								<%
									while (chkReqstResnItr.hasNext()) {
										String str = (String) chkReqstResnItr.next();
										if(!"99".equals(str)){
								%>
								<option value="<%=str%>"><%=chkReqstResn.get(str)%></option>
								<%
										}
									}
								%>
							</select>
						</td>
					</tr>
					<tr>
						<th>신청내용</th>
						<td colspan="3">
							<textarea class="sendData" id="reqstDetail" maxlength="200" name="reqstDetail" required></textarea>
						</td>
					</tr>
					<tr>
						<th>이용형태</th>
						<td>
							<select class="sendData" id="reqGbnCd" name="reqGbnCd" name="reqGbnCd" required>
								<option value="">선택</option>
								<%
									while (chkReqGbnCdItr.hasNext()) {
										String str = (String) chkReqGbnCdItr.next();
										if("11".equals(str) || "12".equals(str)){
											if ("11".equals(str)) {
								%>
								<option value="<%=str%>" selected><%=chkReqGbnCd.get(str)%></option>
								<%
											} else {
								%>
								<option value="<%=str%>"><%=chkReqGbnCd.get(str)%></option>
								<%
											}
										}
									}
								%>
							</select>
						</td>
						<th>범죄유형</th>
						<td>
							<select class="sendData" id="crimeTyp" name="crimeTyp" required>
								<option value="">선택</option>
								<%
									while (chkCrimeTypItr.hasNext()) {
										String str = (String) chkCrimeTypItr.next();
								%>
								<option value="<%=str%>"><%=chkCrimeTyp.get(str)%></option>
								<%
									}
								%>
							</select>
						</td>
					</tr>
					<!-- <tr>
						<th colspan="4">공문 첨부</th>
					</tr> -->
					<tr>
						<th>공문번호</th>
						<td>
							<input type="text" class="sendData tCenter" id="docDept" name="docDept" value="" placeholder="공문발송부서" required>
		                	<input type="text" class="sendData tCenter" id="docNo" name="docNo" value="" placeholder="공문번호" required>
		                	<input type="date" class="sendData tCenter" id="docDate" name="docDate" placeholder="공문시행일" required>
						</td>
						<th>공문파일</th>
						<td>
							<input type="hidden" class="sendData" id="docFileNm" name="docFileNm" value="" readonly>
							<input type="hidden" class="sendData" id="docFilePath" name="docFilePath" value="" readonly>
							<input type="hidden" class="sendData" id="p" name="p" value="rqst\\" readonly>
							<span class="ui-icon-plus ui-btn-icon-right ui-shadow ui-btn ui-corner-all fileinput-button" data-role="button" data-icon="plus">
								<span>파일선택</span>
			                    <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z" required>
							</span>
						</td>
					</tr>
					<tr>
						<th>기준시간</th>
						<td colspan="3">
							<input type="datetime-local" id="baseDateTime" class="tCenter" value="" placeholder="선택">
						</td>
					</tr>
					<tr>
						<th>기준</th>
						<td>
							<select id="baseTerm">
								<option value="10">10분 전</option>
								<option value="20">20분 전</option>
								<option value="30">30분 전</option>
								<option value="40">40분 전</option>
								<option value="50">50분 전</option>
							</select>
						</td>
						<th>영상요약</th>
						<td>
							<select class="sendData" id="videoSmy" name="videoSmy" required>
								<option value="">선택</option>
								<option value="Y">신청</option>
								<option value="N" selected>미신청</option>
							</select>
						</td>
					</tr>
					<tr>
						<th colspan="4"><button type="button" id="mapToggle">CCTV 지도 접기</button></th>
					</tr>
					<tr id="mapWrap">
						<td colspan="4">
							<fieldset class="ui-grid-a" id="searchWrap">
								<div class="ui-block-a">
									<input type="search" name="search" id="search" value="" data-theme="a" placeholder="CCTV 이름을 입력해 주세요." />
								</div>
								<div class="ui-block-b">
									<button type="button" id="searchBtn" class="ui-btn ui-icon-search ui-btn-icon-right" data-mini="true">검색</button>
								</div>
							</fieldset>
							<div id="map">
								<div id="errMsg">카메라 정보를 가져올 수 없습니다.</div>
								<div data-role="popup" id="popupMenu">
									<ul id="listView" data-role="listview" data-inset="true">
										<li data-role="list-divider" id="list-header">CCTV 선택</li>
									</ul>
								</div>
								<div data-role="popup" id="searchPopupMenu">
									<ul id="searchListView" data-role="listview" data-inset="true">
										<li data-role="list-divider" id="search-list-header">검색 결과</li>
									</ul>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<ul id="cctvSelectWrap" data-role="listview" data-inset="true">
								<li data-role="list-divider" id="select-list-header" class="tCenter">신청 대상 CCTV</li>
							</ul>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<button type="button" data-theme="a" id="addBtn">영상 반출 신청</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
	</div>

	<script type="text/javascript">
	var SYSTEM_AVI_PLAY_CNT = "<%= sysParam.get("tvius.avi_play_cnt") %>";
	var SYSTEM_AVI_PLAY_DAT = "<%= sysParam.get("tvius.avi_play_dat") %>";
	var SYSTEM_RENEW_PLAY_CNT = "<%= sysParam.get("tvius.renew_play_cnt") %>";
	var SYSTEM_RENEW_PLAY_DAT = "<%= sysParam.get("tvius.renew_play_dat") %>";
	var SYSTEM_EVI_PLAY_CNT = "<%= sysParam.get("tvius.evi_play_cnt") %>";
	var SYSTEM_PREVIEW_PHOTO = "<%= sysParam.get("tvius.preview_photo") %>";
	var SYSTEM_PREVIEW_AVI = "<%= sysParam.get("tvius.preview_avi") %>";
	var SYSTEM_FILE_DOWN_CNT = "<%= sysParam.get("tvius.file_down_cnt") %>";
	var SYSTEM_RQST_LOCK_CNT = "<%= sysParam.get("tvius.rqst_lock_cnt") %>";
	var SYSTEM_AVI_PLAY_TIME = "<%= sysParam.get("tvius.avi_play_time") %>";
	var SYSTEM_LAST_SMS_DAT = "<%= sysParam.get("tvius.last_sms_dat") %>";
	var SYSTEM_ADMIN_SMS_LIST = "<%= sysParam.get("tvius.admin_sms_list") %>";
	var SYSTEM_MASKING_YN = "<%= sysParam.get("tvius.masking_yn") %>";
	var SYSTEM_MASKING_ROUTE_BF = "<%= sysParam.get("tvius.mask_route_bf").replaceAll("\\\\", "\\\\\\\\") %>";
	var SYSTEM_MASKING_ROUTE_AF = "<%= sysParam.get("tvius.mask_route_af").replaceAll("\\\\", "\\\\\\\\") %>";
	var SYSTEM_STORAGE_PATH = "<%= sysParam.get("tvius.storage_path").replaceAll("\\\\", "\\\\\\\\") %>";
	var SYSTEM_UPLOAD_PATH = "<%= sysParam.get("sys.upload_path").replaceAll("\\\\", "\\\\\\\\") %>";
	</script>
	<script type="text/javascript" src="../../common/jquery.form.js"></script>
	<script type="text/javascript" src="../../common/v4.2.0-dist/ol.js"></script>
	<script type="text/javascript" src="../../common/proj4js-2.4.3/proj4.js"></script>
	<script type="text/javascript" src="../../common/spatial.js"></script>
	<script type="text/javascript" src="../../res/geomex.xeus.proj4.js"></script>
	<script type="text/javascript" src="../../res/geomex.xeus.tms.daum.mobile.js"></script>
	<script type="text/javascript" src="../../res/geomex.xeus.tvius.mobile.map.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<% if(userId == null || "".equals(userId) || "null".equals(userId)){ %>
	<script type="text/javascript">alert("세션이 존재하지 않아 로그인 페이지로 이동합니다."); location.href = "./login.do";</script>
<% } %>
</div>

</body>
</html>