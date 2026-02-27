<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsImageVo"%>
<%@ include file="../../common.jsp"%>
<%
	boolean isCapture = ("Y".equals((String) session.getAttribute("isCapture")));

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

    CrmsTransRqstVo vo = null;
    ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>) request.getAttribute("rqst");
    if(list.size() == 1) vo = list.get(0);

    ArrayList<CrmsTransAviVo> avi = (ArrayList<CrmsTransAviVo>) request.getAttribute("avi");

    ArrayList<CrmsImageVo> imgList = (ArrayList<CrmsImageVo>) request.getAttribute("imgList");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="../../common/jquerymobile/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="../../common/ol-v4.0.1/ol.css">
<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="../../common/jquerymobile/jquery-1.11.1.min.js"></script>
<script src="../../common/jquerymobile/jquery.mobile-1.4.5.min.js"></script>
<title><%= projNm %></title>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">
    var isCapture = <%=isCapture%>;
</script>
</head>
<body>

<div data-role="page" data-theme="b" data-dom-cache="false" data-title="정보 재신청">

	<div data-role="header" align="center">
		<button url="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></button>
		<!-- <a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a> -->
		<!-- <img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px"> -->
		<h3 align="center">정보 재신청</h3>
	</div>

	<div role="main" class="ui-content">
		<form method="POST" enctype="multipart/form-data" id="regForm">
			<table id="regTable">
				<tbody>
					<tr class="hidden">
						<th>관리번호</th>
						<td colspan="3"><input class="sendData" type="text" id="mgrSeq" readonly="readonly" value="<%= vo.getMgrSeq() %>"></td>
					</tr>
					<tr>
						<th>신청자</th>
						<td colspan="3"><input class="sendData" type="text" id="reqstId" readonly="readonly" value="<%= vo.getReqstId() %>"></td>
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
								<option value="<%=str%>" <% if(str.equals(vo.getReqstResn())) out.print("selected"); %>><%=chkReqstResn.get(str)%></option>
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
							<textarea class="sendData" id="reqstDetail" maxlength="200" name="reqstDetail" required><%= vo.getReqstDetail() %></textarea>
						</td>
					</tr>
					<tr>
						<th>이용형태</th>
						<td>
							<select class="sendData" id="reqGbnCd" name="reqGbnCd" name="reqGbnCd" required>
							<option value="16"><%=chkReqGbnCd.get("16")%></option>
							<%-- <% if(isCapture){ %>
								<option value="16"><%=chkReqGbnCd.get("16")%></option>
							<% }else{ %>
								<option value="">선택</option>
							<% } %> --%>
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
								<option value="<%=str%>" <% if(str.equals(vo.getCrimeTyp())) out.print("selected"); %>><%=chkCrimeTyp.get(str)%></option>
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
							<input type="text" class="sendData" id="docNo" name="docNo" value="<%= vo.getDocNo() %>" required>
						</td>
						<th>공문파일</th>
						<td>
							<input type="hidden" class="sendData" id="docFileNm" name="docFileNm" value="<%= vo.getDocFileNm() %>" readonly>
							<input type="hidden" class="sendData" id="docFilePath" name="docFilePath" value="<%= vo.getDocFilePath() %>" readonly>
							<input type="hidden" class="sendData" id="p" name="p" value="rqst\\" readonly>
							<span class="ui-shadow ui-btn ui-corner-all fileinput-button" data-role="button" data-icon="plus">
								<%if(vo.getDocFileNm().length()>7){%>
								<span id="fileNm"><%=vo.getDocFileNm().substring(0,6)%>...</span>
								<%}else{%>
								<span id="fileNm"><%=vo.getDocFileNm()%></span>
								<%}%>
								<!-- <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z" required> -->
			                    <!-- <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept="capture=camera" required> -->
			                    <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept="image/* capture" required>
							</span>
						</td>
					</tr>
					<tr class="hidden">
						<th>기준시간</th>
						<td colspan="3">
							<input type="datetime-local" id="baseDateTime" class="tCenter" value="" placeholder="선택">
						</td>
					</tr>
					<tr class="hidden">
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
							<!-- <select class="sendData" id="videoSmy" name="videoSmy" required> -->
							<select id="videoSmy" name="videoSmy">
								<option value="">선택</option>
								<option value="Y">신청</option>
								<option value="N">미신청</option>
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
									<input type="search" name="search" id="search" value="" data-theme="a" placeholder="검색어(CCTV, 키워드, 주소)를 입력해 주세요." />
								</div>
								<div class="ui-block-b">
									<button type="button" id="searchBtn" class="ui-btn ui-icon-search ui-btn-icon-right" data-mini="true">검색</button>
								</div>
							</fieldset>
							<div id="map">
								<div id="errMsg">카메라 정보를 가져올 수 없습니다.</div>
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<ul id="cctvSelectWrap" data-role="listview" data-inset="true">
								<li data-role="list-divider" id="select-list-header" class="tCenter">신청 대상 CCTV 목록</li>
<% if(avi.size() > 0){ %>
								<li><button type="button" data-theme="b" id="applyBtn" class=" ui-btn ui-btn-b ui-shadow ui-corner-all">시간 일괄 적용</button></li>
<% } %>
<% for(int i=0; i<avi.size(); i++){ %>
<!-- 								<li class="cctv-li"> -->
									<li class="ui-li-static ui-body-inherit ui-last-child cctv-li">
										<fieldset class="ui-grid-a">
											<button type="button" class="selectCctvInfo ui-btn ui-icon-delete ui-btn-icon-right" data-role="button" cctvNm="<%= avi.get(i).getCctvLabel() %>" mgrNo="<%= avi.get(i).getCctvMgrNo() %>">
												<b class='idxB'><%= i + 1 %></b>
												<%-- <marquee><%= avi.get(i).getCctvLabel() %></marquee> --%>
												<b class="textB sText"><%= avi.get(i).getCctvLabel() %></b>
											</button>
											<%-- <div class="ui-block-a"><p>시작시간</p><input id="secStDat" type="datetime-local" class="sDate sendData" value="<%= DateUtil.formatDate(avi.get(i).getSecStDat()).replace(" ", "T") %>" placeholder="선택" required></div>
											<div class="ui-block-b"><p>종료시간</p><input id="secEdDat" type="datetime-local" class="eDate sendData" value="<%= DateUtil.formatDate(avi.get(i).getSecEdDat()).replace(" ", "T") %>" placeholder="선택" required></div> --%>
											<div class="ui-block-a sDate"><table><tr><td><p>시작시간</p></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" value="<%= avi.get(i).getSecStDat().substring(0, 4) %>" placeholder="년" required onKeyPress="if(this.value.length==4) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" value="<%= avi.get(i).getSecStDat().substring(4,6) %>" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" value="<%= avi.get(i).getSecStDat().substring(6,8) %>" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" value="<%= avi.get(i).getSecStDat().substring(8,10) %>" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" value="<%= avi.get(i).getSecStDat().substring(10,12) %>" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td></tr></table></div>
											<div class="ui-block-a eDate"><table><tr><td><p>종료시간</p></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" value="<%= avi.get(i).getSecEdDat().substring(0, 4) %>" placeholder="년" required onKeyPress="if(this.value.length==4) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" value="<%= avi.get(i).getSecEdDat().substring(4,6) %>" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" value="<%= avi.get(i).getSecEdDat().substring(6,8) %>" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" value="<%= avi.get(i).getSecEdDat().substring(8,10) %>" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td><td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" value="<%= avi.get(i).getSecEdDat().substring(10,12) %>" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td></tr></table></div>
										</fieldset>
									</li>
								</li>
<% } %>
							</ul>
						</td>
					</tr>
<% if(isCapture){ %>
					<tr class="imgRqstTr">
						<td colspan="4">
							<span class="ui-icon-plus ui-btn-icon-right ui-shadow ui-btn ui-corner-all fileinput-button" data-role="button" data-icon="plus">
								<span>사진 촬영 또는 선택</span>
			                    <!-- <input type="file" name="uploadImg" id="uploadImg" data-role="none" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z" required> -->
			                    <!-- <input type="file" name="addImg" id="addImg" data-role="none" accept="capture=camera" capture="camera" multiple required> -->
			                    <input type="file" name="addImg" id="addImg" data-role="none" accept="image/*, capture=camera" multiple required>
							</span>
						</td>
					</tr>
					<tr class="imgRqstTr">
						<td colspan="4">
							<ul id="imageSelectWrap" data-role="listview" data-inset="true">
								<li data-role="list-divider" id="select-list-header" class="tCenter">신청 대상 이미지 목록</li>
<% for(int i=0; i<imgList.size(); i++){ %>
								<li class="image-li">
									<fieldset class="ui-grid-a tCenter">
										<button type="button" class="selectImageInfo ui-btn ui-icon-delete ui-btn-icon-right" data-role="button" k="<%= imgList.get(i).getMgrSeq() %>" imgNm="<%= imgList.get(i).getImgNm() %>" imgDesc="<%= imgList.get(i).getImgDesc().split("\\.")[0] %>">
											<b class='idxB'><%= i + 1 %></b>
											<b class="textB sText"><%= imgList.get(i).getImgDesc().split("\\.")[0] %></b>
										</button>
										<img style="width : calc(100% - 0px); height : calc(100% - 0px);" src="./getImage.do?mgrSeq=<%= imgList.get(i).getMgrSeq() %>">
									</fieldset>
								</li>
<% } %>
							</ul>
						</td>
					</tr>
<% } %>
					<tr>
						<td colspan="4">
							<button type="button" data-theme="a" id="editBtn">보안 서약후 재신청하기</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>

		<div data-role="popup" id="popupMenu" data-overlay-theme="b">
			<div style="width:100%;" data-role="header" data-theme="b">
				<h1>CCTV 선택</h1>
				<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			</div>
			<div id="cctvList">
				<ul id="listView" data-role="listview" data-inset="true"></ul>
			</div>
		</div>

		<div data-role="popup" id="popupAllTimeApply" data-overlay-theme="b" style="width:100%;">
			<div data-role="header" data-theme="b">
				<h1>일괄 적용</h1>

				<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			</div>
			<div>
				<p class="tCenter">시작 시간(일괄 적용)</p>
				<!-- <input id='allSecStDat' type='datetime-local' value='' class='sDate' placeholder='선택' required> -->
				<div class="sDate">
					<table>
						<tr>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" placeholder="년" required onKeyPress="if(this.value.length==4) return false;" value="<%= DateUtil.getStrYear() %>"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td>
						</tr>
					</table>
				</div>

<!-- 				<input id='allSecStDat' type="number" pattern="[0-9]*" inputmode="numeric" value='' class='sDate' placeholder='년월일시분' required onKeyPress="if(this.value.length==12) return false;"> -->

				<p class="tCenter">종료 시간(일괄 적용)</p>
				<!-- <input id='allSecEdDat' type='datetime-local' value='' class='eDate' placeholder='선택' required> -->
				<div class="eDate">
					<table>
						<tr>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" placeholder="년" required onKeyPress="if(this.value.length==4) return false;" value="<%= DateUtil.getStrYear() %>"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td>
							<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td>
						</tr>
					</table>
				</div>

<!-- 				<input id='allSecEdDat' type="number" pattern="[0-9]*" inputmode="numeric" value='' class='eDate' placeholder='년월일시분' required onKeyPress="if(this.value.length==12) return false;"> -->
				<button type="button" data-theme="a" id="allTimeApplyBtn">적용</button>
			</div>
		</div>

		<div data-role="popup" id="searchPopupMenu" data-overlay-theme="b">
			<div data-role="header" data-theme="b">
				<h1>검색 결과</h1>
				<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			</div>
			<div data-role="tabs" id="searchTabs">
				<div data-role="navbar">
					<ul>
						<li><a href="#cctvSearchResultTab" class="ui-btn-active" data-ajax="false">CCTV</a></li>
						<li><a href="#keywordSearchResultTab" data-ajax="false">장소</a></li>
						<li><a href="#addrSearchResultTab" data-ajax="false">주소</a></li>
					</ul>
				</div>
				<div id="cctvSearchResultTab">
					<ul id="searchListView" data-role="listview" data-inset="true"></ul>
				</div>
				<div id="keywordSearchResultTab">
					<ul id="keywordSearchList" data-role="listview" data-inset="true"></ul>
				</div>
				<div id="addrSearchResultTab">
					<ul id="addrSearchList" data-role="listview" data-inset="true"></ul>
				</div>
			</div>
		</div>

		<div data-role="popup" id="validationPopup" data-overlay-theme="b" style="width:100%;">
			<div data-role="header" data-theme="b">
				<h1>최종 확인</h1>
				<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			</div>
			<div role="main" class="ui-content">
				<div class="ui-corner-all custom-corners">
					<table>
						<thead></thead>
						<tbody>
							<tr>
								<th>신청자ID</th>
								<td><input type="text" class="tCenter validTgt" tgt="reqstId" readonly></td>
							</tr>
							<tr>
								<th>범죄유형</th>
								<td><input type="text" class="tCenter validTgt" tgt="crimeTyp" readonly></td>
							</tr>
							<tr>
								<th>신청내용</th>
								<td><input type="text" class="tCenter validTgt" tgt="reqstDetail" readonly></td>
							</tr>
							<tr>
								<th colspan="2">
									<div data-role="footer" align="center">
										<p id="selectCctvListCntTitle" style="margin: 8px 0px;">신청 카메라 목록</p>
									</div>
								</th>
							</tr>
							<tr>
								<td colspan="2">
									<div style="max-height: 300px; overflow: auto;">
										<table class="validTgt" tgt="selectCctvList"></table>
									</div>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="2">
									<button class="ui-btn ui-corner-all ui-shadow" data-theme="a" id="isUserValidBtn">신청 내용 확인 완료</button>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>

		<div data-role="popup" id="securityPopup" data-overlay-theme="b">
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
							<td><input type="text" id="userNm" name="userNm" placeholder="성명을 입력하세요." readonly value="<%= userVo.getUserNm() %>"></td>
						</tr>
						<tr>
							<th>생년월일</th>
							<td><input type="text" id="birthDay" name="birthDay" placeholder="생년월일을 입력하세요." readonly value="<%= userVo.getBirthDay() %>"></td>
						</tr>
						<tr>
							<th>휴대폰 번호</th>
							<td><input type="text" id="mobileNum" name="mobileNum" placeholder="휴대폰 번호를 입력하세요." readonly value="<%= userVo.getMobileNum() %>"></td>
						</tr>
						<tr>
							<th>소속 및 부서</th>
							<td><input type="text" id="departNm" name="departNm" data-theme="a" placeholder="소속 및 부서를 입력하세요." depart="<%= userVo.getDepartNm() %>" value="<%= userVo.getDepartNm() %>"></td>
						</tr>
						<tr>
							<th>계정 암호</th>
							<td><input type="password" id="userPwd" name="userPwd" data-theme="a" placeholder="암호를 입력하세요."></td>
						</tr>
					</tbody>
				</table>

				<button class="ui-btn ui-corner-all ui-shadow" id="rqstSendBtn">재신청</button>

			</div>
		</div>

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
	<script type="text/javascript" src="../../common/ol-v6.4.3/ol.js?c=<%= DateUtil.getStrMilSec() %>"></script>
	<script type="text/javascript" src="../../common/proj4js-2.4.3/proj4.js?t=<%= DateUtil.getStrMilSec() %>"></script>
	<script type="text/javascript" src="../../common/spatial.js?t=<%= DateUtil.getStrMilSec() %>"></script>
	<script type="text/javascript" src="../../res/GMT/gmx.gis.map.config.js?t=<%= DateUtil.getStrMilSec() %>"></script>
	<script type="text/javascript" src="../../res/GMT/tile/gmx.gis.daum.js?t=<%= DateUtil.getStrMilSec() %>"></script>
	<script type="text/javascript" src="../../res/menu/tviusMobile/geomex.xeus.tvius.mobile.map.js?t=<%= DateUtil.getStrMilSec() %>"></script>

</div>

</body>
</html>