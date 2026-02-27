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
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="../../common/jquerymobile/jquery.mobile-1.4.5.min.css" />

<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="../../common/jquerymobile/jquery-1.11.1.min.js"></script>
<script src="../../common/jquerymobile/jquery.mobile-1.4.5.min.js"></script>
<title><%= projNm %></title>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b" data-dom-cache="false" data-title="이미지 반출 신청">

	<div data-role="header" align="center">
		<button url="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></button>
		<!-- <a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a> -->
		<!-- <img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px"> -->

		<h3 align="center" >이미지 반출 신청</h3>
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
						<th>신청자ID</th>
						<td colspan="3"><input class="sendData" type="text" id="reqstId" value="" required></td>
					</tr>
					<tr>
						<th>신청내용</th>
						<td colspan="3">
							<textarea class="sendData" id="reqstDetail" maxlength="200" name="reqstDetail" required></textarea>
						</td>
					</tr>
					<tr>
						<th>공문번호</th>
						<td>
							<input type="text" class="sendData" id="docNo" name="docNo" value="" required>
						</td>
						<th>공문파일</th>
						<td>
							<input type="hidden" class="sendData" id="docFileNm" name="docFileNm" value="" readonly>
							<input type="hidden" class="sendData" id="docFilePath" name="docFilePath" value="" readonly>
							<input type="hidden" class="sendData" id="p" name="p" value="rqst\\" readonly>
							<span class="ui-shadow ui-btn ui-corner-all fileinput-button" data-role="button" data-icon="plus">
								<span id="fileNm">파일 선택</span>
			                    <!-- <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z" required> -->
			                    <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept="*/*, capture=camera" required>
							</span>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<ul id="cctvSelectWrap" data-role="listview" data-inset="true">
								<li data-role="list-divider" id="select-list-header" class="tCenter">신청 대상 이미지 목록</li>
							</ul>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<span class="ui-icon-plus ui-btn-icon-right ui-shadow ui-btn ui-corner-all fileinput-button" data-role="button" data-icon="plus">
								<span>사진 촬영</span>
			                    <!-- <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z" required> -->
			                    <input type="file" name="addImg" id="addImg" data-role="none" accept="capture=camera" capture="camera" multiple required>
							</span>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<button type="button" data-theme="a" id="addBtn">보안 서약 후 이미지 반출 신청하기</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
		<div data-role="popup" id="securityPopup" data-overlay-theme="b" >
			<div data-role="header" data-theme="b">
				<h1>보안 서약</h1>
				<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			</div>
			<div role="main" class="ui-content">
				<p class="tCenter">본인은 서초구 스마트시티 통합플랫폼(cctv.seocho.go.kr, 이하 “플랫폼”)을 활용한 CCTV 영상자료 수령 및 활용시 개인정보보호법에 따라 다음 사항 준수할 것을 엄숙히 서약합니다.</p>

				<div class="ui-corner-all custom-corners">
					<div class="ui-bar ui-bar-a">
						<h3>1. 플랫폼을 활용하여 영상자료를 제공받는 본인은, 개인정보 수집·이용에 제한이 있음을 인지하고 있음</h3>
					</div>
					<div class="ui-body ui-body-a">
						<p class="law">※ 개인정보보호법 제15조(개인정보의 수집·이용) 및 제16조(개인정보의 수집 제한)</p>
					</div>

					<div class="ui-bar ui-bar-a">
						<h3>2. 플랫폼을 활용하여 영상자료를 제공받은 본인은, 플랫폼으로부터 제공받은 영상 자료를 제3자에게 목적 외로 제공할 수 없음을 인지하고 있음</h3>
					</div>
					<div class="ui-body ui-body-a">
						<p class="law">※ 개인정보보호법 제17조(개인정보의 제공) 및 제18조(개인정보의 목적 외 이용·제공 제한)</p>
					</div>

					<div class="ui-bar ui-bar-a">
						<h3>3. 플랫폼을 활용하여 영상 자료를 제공받은 본인은, 업무상 알게 된 개인정보를 누설하거나 권한 없이 다른 사람이 열람·이용·제공하지 아니하기로 서약함</h3>
					</div>
					<div class="ui-body ui-body-a">
						<p class="law">※ 개인정보보호법 제59조(금지행위) : 업무상 알게 된 개인정보를 누설하거나 권한 없이 다른 사람이 이용하도록 제공하는 행위</p>
					</div>

					<div class="ui-bar ui-bar-a">
						<h3>4. 플랫폼을 활용하여 영상자료를 제공받은 본인은, 사용목적 달성 등 개인정보가 불필요할 경우, 제공받은 자료를 즉시 파기하로 서약함</h3>
					</div>
					<div class="ui-body ui-body-a">
						<p class="law">※ 개인정보보호법 제21조(개인정보의 파기) : 개인정보처리자는 보유기간의 경과, 개인정보의 처리 목적 달성 등 그 개인정보가 불필요하게 되었을 때에는 지체 없이 그 개인정보를 파기하여야 한다.</p>
					</div>

					<div class="ui-bar ui-bar-a">
						<h3>5. 플랫폼을 활용하여 영상자료를 제공받은 본인은, 위 사항을 위반시 관련 사항에 따라 엄중한 처벌이 가해질 것을 알고 있음</h3>
					</div>
					<div class="ui-body ui-body-a">
						<p class="law">※ 개인정보보호법 제71조(벌칙), 제75조(과태료)</p>
					</div>

					<div class="ui-bar ui-bar-a tCenter">
						<h3>- 서울특별시 서초구청 스마트도시과장 -</h3>
					</div>
				</div>

				<table id="agreeSecurityTable">
					<thead>
						<tr>
							<th colspan="2">
								<label for="agreeSecurity" class="tCenter">상기 내용을 확인하였으며 모든 보안 사항을 엄숙히 서약합니다.</label>
								<input style="z-index:999" type="checkbox" id="agreeSecurity" name="agreeSecurity">
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>성명</th>
							<td><input type="text" id="userNm" name="userNm" placeholder="성명을 입력하세요." readonly></td>
						</tr>
						<tr>
							<th>생년월일</th>
							<td><input type="text" id="birthDay" name="birthDay" placeholder="생년월일을 입력하세요." readonly></td>
						</tr>
						<tr>
							<th>휴대폰 번호</th>
							<td><input type="text" id="mobileNum" name="mobileNum" placeholder="휴대폰 번호를 입력하세요." readonly></td>
						</tr>
						<tr>
							<th>소속 및 부서</th>
							<td><input type="text" id="departNm" name="departNm" data-theme="a" depart="" placeholder="소속 및 부서를 입력하세요."></td>
						</tr>
						<tr>
							<th>계정 암호</th>
							<td><input type="password" id="userPwd" name="userPwd" data-theme="a" placeholder="암호를 입력하세요."></td>
						</tr>
					</tbody>
				</table>

				<button class="ui-btn ui-corner-all ui-shadow" id="rqstSendBtn">이미지 반출 신청</button>
			</div>
		</div>
	</div>

	<script type="text/javascript" src="../../common/jquery.form.js"></script>
	<script type="text/javascript" src="../../res/menu/tviusMobile/geomex.xeus.tvius.mobile.image.js?t=<%= DateUtil.getStrMilSec() %>"></script>

</div>

</body>
</html>