<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.map.service.DoroVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%>
<%@ page import="java.util.ArrayList"%>
<%

String liChk = (String) request.getAttribute("liChk");
ArrayList<EmdVo> emdList = (ArrayList<EmdVo>) request.getAttribute("emdList");
ArrayList<LiVo> liList = (ArrayList<LiVo>) request.getAttribute("liList");
ArrayList<DoroVo> rnList = (ArrayList<DoroVo>) request.getAttribute("rnList");
%>
<script type="text/javascript">
//resize 이벤트 등록
$(document).ready(function() {
	xeusSearch.resize_search();

	$(".contentWrapper").find("#jibunUI").hide();
	$(".contentWrapper").find("#doroUI").hide();
	$(".contentWrapper").find("#lnglatUI").hide();
	$(".contentWrapper").find("#addrUI").show();
	$(".contentWrapper").find("#buldUI").hide();

});

$(window).resize(function() {
	xeusSearch.resize_search();
});

$(".contentWrapper").find("#searchMode").on("change", function(){
	var mode = $(this).val();
	if(mode == 1){
		$(".contentWrapper").find("#jibunUI").show();
		$(".contentWrapper").find("#doroUI").hide();
		$(".contentWrapper").find("#lnglatUI").hide();
		$(".contentWrapper").find("#addrUI").hide();
		$(".contentWrapper").find("#buldUI").hide();
	}else if(mode == 2){
		$(".contentWrapper").find("#jibunUI").hide();
		$(".contentWrapper").find("#doroUI").show();
		$(".contentWrapper").find("#lnglatUI").hide();
		$(".contentWrapper").find("#addrUI").hide();
		$(".contentWrapper").find("#buldUI").hide();
	}else if(mode == 3){
		$(".contentWrapper").find("#jibunUI").hide();
		$(".contentWrapper").find("#doroUI").hide();
		$(".contentWrapper").find("#lnglatUI").show();
		$(".contentWrapper").find("#addrUI").hide();
		$(".contentWrapper").find("#buldUI").hide();
	}else if(mode == 4){
		$(".contentWrapper").find("#jibunUI").hide();
		$(".contentWrapper").find("#doroUI").hide();
		$(".contentWrapper").find("#lnglatUI").hide();
		$(".contentWrapper").find("#addrUI").show();
		$(".contentWrapper").find("#buldUI").hide();
	}else if(mode == 5){
		$(".contentWrapper").find("#jibunUI").hide();
		$(".contentWrapper").find("#doroUI").hide();
		$(".contentWrapper").find("#lnglatUI").hide();
		$(".contentWrapper").find("#addrUI").hide();
		$(".contentWrapper").find("#buldUI").show();
	}
});

//주소 검색
$(".contentWrapper").find("#addrSearch").click(function() {
	var str = $(".contentWrapper").find("#addrUI").find("#addr").val();
	if (_common.utils.isNullAndEmpty(str)) {
		alert("주소를 입력해 주세요.");
	} else {
		_search.getDaumSearch(str);
	}
});

//지번검색
$(".contentWrapper").find("#jibunSearch").click(function() {
	var _param = _common.utils.collectSendData("#" + parentView + " #jibunUI");

	// 1. 읍면동 선택 확인
	//	* 체크 안함. 어차피 bjdCd에서 걸림
	// 2. 리 선택 확인(리 미포함 지역이면 패스)
	//	* 체크 안함. 면만 선택하고 리 선택없이 검색할 때도 있음.
	// 3. 산 체크 확인
	// 4. 본, 부 가공(4자리로 변경)
	// 5. 본 입력 확인
	// 6. 본, 부 유효성 검사
	// 7. 검색

	////////////////////////////////////////////////////////////////
	// 1.
	//if(_param.emdCd == '-99999'){
	//	alert("읍면동을 선택해 주세요.");
	//	return false;
	//}

	// 2.
	//var liChk = $('#liCd').length;

	//if(liChk > 0){

	//	var cnt = 0;
	//	$('#liCd').find('option').each(function(){
	//		if($(this).css('display') != 'none') cnt++;
	//	});
	//	if(cnt > 1){
	//		alert("리를 선택해 주세요.");
	//		return false;
	//	}
	//}

	// 3.
	_param.san = "1"
	if ($(".contentWrapper").find("#jibunUI").find("#san").is(":checked")){ //산이 체크되어있으면 _param.san을 2로 변경
		_param.san = "2";
	}

	// 4.
	//본번을 4자리로 만들어줌
	if (_param.bon.length == 1) {
		_param.bon = "000" + _param.bon;
	} else if (_param.bon.length == 2) {
		_param.bon = "00" + _param.bon;
	} else if (_param.bon.length == 3) {
		_param.bon = "0" + _param.bon;
	}
	//부번을 4자리로 만들어줌
	if (_param.bu != null && _param.bu != "") {
		if (_param.bu.length == 1) {
			_param.bu = "000" + _param.bu;
		} else if (_param.bu.length == 2) {
			_param.bu = "00" + _param.bu;
		} else if (_param.bu.length == 3) {
			_param.bu = "0" + _param.bu;
		}
	} else {
		_param.bu = "0000";
	}

	_param.bjdCd = $(".contentWrapper").find("#jibunUI").find("#liCd option:selected").attr("bjdCd");	//선택된 리에서 코드 가져옴
																				//리가 없거나 선택되지 않으면 undefined가 됨.
	if(_param.bjdCd === undefined && _param.emdCd != '-99999') {
		_param.bjdCd = _param.emdCd + '00';
		_param.liChk = 'N';
	} else {
		_param.liChk = 'Y';
	}


	_param.pnu = _param.bjdCd + _param.san + _param.bon + _param.bu;

	if (_common.utils.isNullAndEmpty(_param.bjdCd)) {
		alert("읍면동,리를 선택해 주세요.");
		return false;
	}

	// 5.
	if (_common.utils.isNullAndEmpty(_param.bon)) {
		alert("본번을 입력해 주세요.");
		$(".contentWrapper").find("#jibunUI").find("#bon").focus();
		return false;
	}

	// 6.
	if (isNaN(Number(_param.bon)) || isNaN(Number(_param.bu))) {
		alert("본번과 부번은 숫자만 가능합니다.");
		return false;
	}

	if (_param.bon.length > 4 || _param.bu.length > 4) {
		alert("본번과 부번은 4자리까지 입력할 수 있습니다.");
		return false;
	}

	// 7.
	_search.getAddrSearchList(_param);
});

//새주소검색
$(".contentWrapper").find("#doroSearch").click(function() {
	var _param = _common.utils.collectSendData("#" + parentView + " #doroUI");

	if (_common.utils.isNullAndEmpty(_param.bon)) {
		alert("본번을 입력해 주세요.");
		$(".contentWrapper").find("#doroUI").find("#bon").focus();
		return false;
	} else if (isNaN(Number(_param.bon)) || isNaN(Number(_param.bu))) {
		alert("본번과 부번은 숫자만 가능합니다.");
		return false;
	} else {
		_search.getNewAddrSearchList(_param);
	}
});

//통합 검색
$(".contentWrapper").find("#apiSearch").click(function() {
	var type = "local";
	if ($(".contentWrapper").find("#srchType2").is(":checked")){ //통합검색중 주소검색이면 type을 addr로 변경
		type = "addr";
	}
	var str = $(".contentWrapper").find("#searchStr").val();

	if (_common.utils.isNullAndEmpty(str)) {
		alert("검색어를 입력해 주세요.");
		$(".contentWrapper").find("#searchStr").focus();
	} else {
		_search.getApiSearchList(type, str);
	}
});

// TM <-> LngLat검색
$(".contentWrapper").find("#tmSearch").click(function() {
	var _param = _common.utils.collectSendData("#" + parentView + " #tmUI");
	if (!_common.utils.validNaN(_param.tmX)) {
		alert("X 값을 정확히 입력해 주세요.");
		$(".contentWrapper").find("#tmUI").find("#tmX").focus();
		return false;
	}
	if (!_common.utils.validNaN(_param.tmY)) {
		alert("Y 값을 정확히 입력해 주세요.");
		$(".contentWrapper").find("#tmUI").find("#tmY").focus();
		return false;
	}
	_search.getTmToLngLat(_param);
});

//LngLat <-> TM 검색
$(".contentWrapper").find("#lnglatSearch").click(function() {
	var _param = _common.utils.collectSendData("#" + parentView + " #lnglatUI");
	if (!_common.utils.validNaN(_param.lng)) {
		alert("경도 값을 정확히 입력해 주세요.");
		$(".contentWrapper").find("#lnglatUI").find("#lng").focus();
		return false;
	}
	if (!_common.utils.validNaN(_param.lat)) {
		alert("위도 값을 정확히 입력해 주세요.");
		$(".contentWrapper").find("#lnglatUI").find("#lat").focus();
		return false;
	}
	_search.getLngLatToTm(_param);
});



// 건물검색버튼
$(".contentWrapper").find("#buldSearch").click(function() { //위치버튼 클릭
	var _param = _common.utils.collectSendData("#" + parentView + " #buldUI");
	if(_param.buldNm.length < 2){
		alert("건물명은 최소 2글자 이상 입력되어야 합니다.");
		$(".contentWrapper").find("#buldUI").find("#buldNm").focus();
		return false;
	}

	_search.getBuldSearchList(_param);
});

// 엔터키 이벤트
//검색시 엔터 치면 검색버튼 눌림
$(".contentWrapper").find(".keyup").keyup(function(e) {
	if (e.which == 13) {
		var selector = $(this).attr("for");
		$(selector).click();
	}
});
// 엔터키 이벤트
//좌표검색일때 x값 또는 경도 입력후 엔터 치면 y값 또는 위도로 포커스
$(".contentWrapper").find(".keynext").keyup(function(e) {
	if (e.which == 13) {
		$(".contentWrapper").find(".keyup").focus();
	}
});

</script>
<div id="searchBox" align="center">
    <div id="searchWrap">
        <select id="searchMode">
            <option value="1">지번</option>
            <option value="2">새주소</option>
            <option value="5">건물명</option>
            <option value="3">좌표</option>
            <option value="4" selected="selected">웹검색</option>
        </select>

        <table id="jibunUI" class="hidden">
            <tr>
                <td>읍면동</td>
                <td>
                    <select id="emdCd" class="sendData">
                    <option value="-99999">선택하세요.</option>
                    <%
                    for(int i=0; i<emdList.size(); i++){
                        //String emdCd = emdList.get(i).getEmdCd().substring(5);
                        String emdCd = emdList.get(i).getEmdCd();
                    %>
                    <option value="<%= emdCd %>"><%= emdList.get(i).getEmdKorNm() %></option>
                    <%
                    }
                    %>
                    </select>
                </td>
                <% if("Y".equals(liChk)){ %>
                <td>리</td>
                <td>
                    <select id="liCd" class="sendData" disabled="disabled">
                        <option value="-99999">선택하세요.</option>
                        <%
                        for(int i=0; i<liList.size(); i++){
                            String liCd = liList.get(i).getLiCd().substring(8);
                            String emdCd = liList.get(i).getLiCd().substring(5,8);
                        %>
                        <option value="<%= liCd %>" emd = "<%=emdCd%>" bjdCd="<%=liList.get(i).getLiCd()%>"><%= liList.get(i).getLiKorNm() %></option>
                        <%
                        }
                        %>
                    </select>
                </td>
                <% } %>
                <td>
                    <input type="checkbox" id="san" name="san" class="sendData">
                    <label for="san">산</label>
                </td>
                <td>
                    <input type="text" id="bon" class="sendData keyup" placeholder="본번" for="#jibunSearch"> -
                    <input type="text" id="bu" class="sendData keyup" placeholder="부번" for="#jibunSearch">
                </td>
                <td colspan="2" class="lastTd"><button id="jibunSearch" class="searchBtn blueBtn">검 색</button></td>
            </tr>
        </table>

        <table id="doroUI" class="hidden">
            <tr>
                <td>도로명</td>
                <td>
                    <select id="rnCd" class="sendData">
                    <%
                    for(int i=0; i<rnList.size(); i++){
                        String rnCd = rnList.get(i).getRnCd();
                    %>
                        <option value="<%= rnCd %>"><%= rnList.get(i).getRn() %></option>
                    <%
                    }
                    %>
                    </select>
                </td>
                <td>건물번호</td>
                <td>
                   <input type="text" id="bon" class="sendData keyup" placeholder="본번" for="#doroSearch"> -
                   <input type="text" id="bu" class="sendData keyup" placeholder="부번" for="#doroSearch">
                </td>
                <td colspan="2" class="lastTd"><button id="doroSearch" class="searchBtn blueBtn">검 색</button></td>
            </tr>
        </table>

        <table id="lnglatUI" class="hidden">
            <tr>
                <td>경도</td>
                <td>
                    <input type="text" id="lng" class="sendData keynext" placeholder="도">
                </td>
                <td>위도</td>
                <td>
                    <input type="text" id="lat" class="sendData keyup" placeholder="도" for="#lnglatSearch">
                </td>
                <td colspan="2" class="lastTd"><button id="lnglatSearch" class="searchBtn blueBtn">검 색</button></td>
            </tr>
        </table>

        <table id="addrUI" class="hidden">
            <tr>
                <td>주소 또는 건물명</td>
                <td>
                    <input type="text" id="addr" class="keyup" value="" style="width: 300px;" for="#addrSearch">
                </td>
                <td class="lastTd"><button id="addrSearch" class="searchBtn blueBtn">검 색</button></td>
            </tr>
        </table>

        <table id="buldUI" class="hidden">
            <tr>
                <td>건물명</td>
                <td>
                    <input type="text" id="buldNm" class="sendData keyup" value="" style="width: 300px;" for="#buldSearch">
                </td>
                <td class="lastTd"><button id="buldSearch" class="searchBtn blueBtn">검 색</button></td>
            </tr>
        </table>
    </div>
</div>

<div id="srchResult" align="center">

</div>