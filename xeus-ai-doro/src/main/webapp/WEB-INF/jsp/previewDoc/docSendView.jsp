<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.event112.service.CctvPreviewVo"%>
<%@ include file="../common.jsp" %>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.cctvPreview.js"></script>
<div class="searchWrapper customScroll" data-mcs-theme="minimal-dark">

    <p class="searchTitle">CCTV 선영상 재생 이력 조회</p>
    <table id="searchTable" class="searchTable">
        <tr>
            <th>재생일자</th>
            <td>
				<!-- <input type="text" id="reqDat" name="reqDat" class="wide sendData datePicker" readonly="readonly"> -->
				<input type="text" id="startDat" name="startDat" class="wide sendData datePicker" readonly="readonly" style="width: 140px;">
				 ~
				<input type="text" id="endDat" name="endDat" class="wide sendData datePicker" readonly="readonly" style="width: 140px;">
            </td>
        </tr>
        <tr>
            <th>사건번호</th>
            <td>
				<input type="text" id="acciNum" name="acciNum" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>신청사유</th>
            <td>
                <input type="text" id="reqResn" name="reqResn" class="wide sendData">
            </td>
        </tr>
    </table>
    <div class="btnDiv">
        <button class="blackBtn_Fill" id="searchBtn">검 색</button>
    </div>

    <div style="color: #666; font-weight: bold; padding-left: 13px;"> * 공문전송시 검색 결과에 포함된 모든 내역이 처리됩니다.</div>

    <div style="width: 373px; display: table-cell;">
        <p class="searchTitle" style="width:49%; display: inline-block;">검색결과</p>

	    <div class="tRight" style="width: 48%; display: inline-block;">
	        <button id="docSendBtn" class="blackBtn" style="width: 88px; height: 28px;">공문전송</button><!-- whiteBtn -->
	    </div>

    </div>

    <table id="resultTable">
        <thead>
	        <tr>
	            <th>CCTV명</th>
                <th>재생일자</th>
	            <th>위치</th>
	        </tr>
        </thead>
        <tbody></tbody>
    </table>

    <div class="bpopup hidden" id="doc_pop_wrap">
	    <div id="bpop_wrap">
	        <h2 id="bpop_title">
	            공문전송
	            <img id="closeEditPop" class="bpopClose" style="width:16px;height:16px;float:right;background-color:#00000000" src="/xeus/res/img/delete_normal.png">
	        </h2>
	        <form id="sendForm" method="POST" enctype="multipart/form-data">
		        <table>
		            <tr class="top hidden">
		                <th class="top">공문구분</th>
		                <td>
		                    <!-- <select id="docGbnCd" name="docGbnCd" class="wide sendData">
								<option value="10">일일보고</option>
								<option value="20">주간보고</option>
							</select> -->
							<input type="hidden" id="docGbnCd" name="docGbnCd" value="10">
		                </td>
		            </tr>
		            <!-- <tr>
		                <th class="top">공문번호</th>
		                <td>
		                    <input type="text" id="docNum" name="docNum" class="wide sendData">
		                </td>
		            </tr> -->
		            <!-- <tr>
		                <th class="top">공문파일</th>
	                    <td>
                            <input type="file" id="file" name="file" class="wide sendData" size="30" placeholder="첨부파일" />
						</td>
		            </tr> -->
		            <tr class="hidden">
		                <th class="top">공문내용</th>
	                    <td>
                            <input type="text" id="docJson" name="docJson" class="wide sendData" />
	                    </td>
		            </tr>
					<tr>
						<th class="top" rowspan="2">공문파일</th>
						<td>
							<div id="officialDocParam">
								<!-- <span style="font-weight: bold; font-size: 13px;">공문번호 :</span>
								<input type="text" id="officialDocNo" class="sendData"style="width: 100px;"> -->
								<span style="font-size: 13px; font-weight: bold;">기간 : </span>
								<input type="text" id="docStartDat" class="datePicker sendData" size="12" readonly="readonly" style="width: 160px;">
								 ~
								<input type="text" id="docEndDat" class="datePicker sendData" size="12" readonly="readonly" style="width: 160px;">
								<button class="grayBtn" id="docSearchBtn" type="button" style="height: 30px; width: 65px; margin: 0px 0px 0px 3px; padding: 3px;">검색</button>
							</div>
							<!-- <div>선택공문 표시</div> -->
						</td>
					</tr>
					<tr>
						<td><!-- style="height: 350px;" -->
							<div style="height: 450px;" class="customScroll" data-mcs-theme="minimal-dark">
								<table id="docSearchResult" style="width: 440px;">
           						</table>
							</div>
						</td>
					</tr>
					<tr class="hidden">
						<th class="top">공문정보</th>
						<td>
							<input type="hidden" id="docNum" name="docNum" readonly="readonly">
							<input type="hidden" id="fileNm" name="fileNm" readonly="readonly">
							<input type="hidden" id="filePath" name="filePath" readonly="readonly">
						</td>
					</tr>
				</table>
	        </form>
	        <table>
	            <tr align="center">
	                <td class="lastTd" colspan="2" style="border: 0 !important;">
	                    <button id="saveBtn" tabindex="5">저장</button>
	                </td>
	            </tr>
	        </table>
	    </div>
	</div>
</div>