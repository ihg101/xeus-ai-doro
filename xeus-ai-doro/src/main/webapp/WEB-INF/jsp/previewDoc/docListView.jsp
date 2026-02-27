<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.event112.service.CctvPreviewVo"%>
<%@ include file="../common.jsp" %>
<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.cctvPreviewDoc.js"></script>
<div class="contentWrapper customScroll">

<!--     <p class="searchTitle">CCTV 선영상 공문 조회</p> -->
    <table id="searchTable" class="searchTable">
        <tr>
            <th>등록일자</th>
            <td>
           		<span class="ui-helper-hidden-accessible"><input type="text"/></span>
				<input type="date" id="regDat" name="regDat" class="wide sendData" readonly="readonly">
            </td>
        </tr>
        <tr>
            <th>공문번호</th>
            <td>
				<input type="text" id="docNum" name="docNum" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>등록자</th>
            <td>
                <input type="text" id="regUserId" name="regUserId" class="wide sendData">
            </td>
        </tr>
    </table>
    <div class="btnDiv">
        <button class="btn_style" id="searchBtn">검 색</button>
    </div>

    <div style="width: 340px; display: table-cell;">
        <h3 class="title" style="width:49%; display: inline-block; margin-top:3px;">검색결과</h3>

	    <!-- <div class="tRight" style="width: 49%; display: inline-block;">
	        <button id="docSendBtn" class="whiteBtn" style="width: 88px; height: 28px;">공문전송</button>
	    </div> -->

    </div>

    <table id="resultTable">
        <thead>
	        <tr>
	            <th>등록자</th>
	            <th>공문번호</th>
                <th>등록일자</th>
                <th>확인</th>
	        </tr>
        </thead>
        <tbody></tbody>
    </table>

    <div class="bpopup hidden" id="doc_pop_wrap">
	    <div id="bpop_wrap">
<!-- 	        <h2 id="bpop_title"> -->
<!-- 	            공문확인 -->
<!-- 	            <img id="closeEditPop" class="bpopClose" style="width:16px;height:16px;float:right;background-color:#00000000" src="/xeus/res/img/delete_normal.png"> -->
<!-- 	        </h2> -->
	        <form id="sendForm" method="POST" enctype="multipart/form-data">
		        <table>
		            <tr class="top">
		                <th class="top">공문구분</th>
		                <td>
		                    <select id="docGbnCd" name="docGbnCd" class="wide sendData" disabled="disabled">
								<option value="10">일일보고</option>
								<option value="20">주간보고</option>
							</select>
		                </td>
		            </tr>
		            <tr>
		                <th class="top">공문번호</th>
		                <td>
		                    <input type="text" id="docNum" name="docNum" class="wide sendData" readonly="readonly">
		                </td>
		            </tr>
		            <tr>
		                <th class="top">공문파일</th>
	                    <td>
                            <input type="text" id="fileNm" name="fileNm" class="wide sendData" readonly="readonly" />
	                    </td>
		            </tr>
		            <tr>
		                <th class="top">등록일</th>
	                    <td>
                            <input type="text" id="regDat" name="regDat" class="wide sendData" readonly="readonly" />
	                    </td>
		            </tr>
		            <tr>
		                <th class="top">선영상재생목록</th>
	                    <td id="docJson">
                            <!-- <input type="text" id="docJson" name="docJson" class="wide sendData" disabled="disabled" /> -->
	                    </td>
		            </tr>
		        </table>
	        </form>
	    </div>
	</div>
</div>