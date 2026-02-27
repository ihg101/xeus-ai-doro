<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvModelVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<CctvModelVo> list = (ArrayList<CctvModelVo>)request.getAttribute("result");
HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String gbn = map.get("gbn");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String modelNm = map.get("modelNm");
if(modelNm == null) modelNm = "";
String makerNm = map.get("makerNm");
if(makerNm == null) makerNm = "";
String sortCntrl = map.get("sortCntrl");
%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.log.css">

<script type="text/javascript">
var gbn = '<%=gbn%>';
var schObj = new Object();
schObj.modelNm = '<%=modelNm%>';
schObj.makerNm = '<%=makerNm%>';
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";

	$(document).ready(function(){

// 		var value = $(".contentWrapper").find("#modelNm").val();
// 		$(".contentWrapper").find("#modelNm").val(value).focus();

// 		value = $(".contentWrapper").find("#makerNm").val();
// 		$(".contentWrapper").find("#modelNm").val(value).focus();

		/*페이징 처리*/
		$(".contentWrapper").find(".paging_wrap").paging({
			current	  : 10,
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});

// 		_common.callAjax("/sysMng/getEquipTopMenuView.do", {'gbn': gbn}, function(view) {
// 			$(".contentWrapper").find("#menuWrap").html('');
// 			$(".contentWrapper").find("#menuWrap").html(view);
// 		});

	});

	function callView(offset,_param){
		if(offset == null) offset = 0;
		if(_param === undefined){
			_param = {};
			for(var key in schObj) {
				if (schObj[key] != ""){
					_param[key] = schObj[key];
				}
			}
		}
		_param['limit'] = 10;
		_param['offset'] = offset;
		_param['sortCol'] = 'mgr_no';
		_param['sortTyp'] = 'asc';
		_param['gbn'] = gbn;
		if(sortCol!="null" && sortTyp!="null"){
			_param['sortCol'] = sortCol;
			_param['sortTyp'] = sortTyp;
		}

		_common.callAjax('/nms/getCctvModelMngView.do', _param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});
	}


	function createPopupWrapper (){
		var str = '';
		str+= '<div class="popupWrapper">';
        str+= '    <div id="bpop_wrap">';
//         str+= '        <h2 id="bpop_title">';
//         str+= '                        CCTV 모델관리';
//         str+= '        </h2>';
        str+= '        <table>';
        str+= '            <tr class="hidden">';
        str+= '                <th class="top">관리번호</th>';
        str+= '                <td>';
        str+= '                    <input type="text" class="sendData" id="mgrNo" name="mgrNo"/>';
        str+= '                </td>';
        str+= '            </tr>';
        str+= '            <tr class="top">';
        str+= '                <th class="top">모델명</th>';
        str+= '                <td>';
        str+= '                    <input type="text" class="sendData" id="modelNm" name="modelNm" placeholder="모델명"/>';
        str+= '                </td>';
        str+= '            </tr>';
        str+= '            <tr class="top">';
        str+= '                <th class="top">제조사명</th>';
        str+= '                <td>';
        str+= '                    <input type="text" class="sendData" id="makerNm" name="makerNm" placeholder="제조사명"/>';
        str+= '                </td>';
        str+= '            </tr>';
        str+= '            <tr class="top">';
        str+= '                <th class="top">상세설명</th>';
        str+= '                <td>';
        str+= '                    <input type="text" class="sendData" id="modelDesc" name="modelDesc" placeholder="상세설명"/>';
        str+= '                </td>';
        str+= '            </tr>';
        str+= '        </table>';
        str+= '        <table>';
        str+= '            <tr align="center">';
        str+= '                <td class="lastTd" colspan="2" style="border: 0 !important;">';
        str+= '                    <button class="btn_style2" id="saveBtn" tabindex="4">저장</button>';
        str+= '                    <button class="btn_Dstyle2" id="delBtn" tabindex="4">삭제</button>';
//         str+= '                    <button id="closeEditPop" class="bpopClose" tabindex="5">취소</button>';
        str+= '                </td>';
        str+= '            </tr>';
        str+= '        </table>';
        str+= '    </div>';
        str+= '</div>';

       return str;
	}

	/**
	 * CCTV 모델 관리  > 저장  클릭
	 */
	function bindClickEventSaveBtn(){
		/* 팝업 저장 버튼 클릭 이벤트입니다..*/
		$(".popupWrapper").find('#saveBtn').click(function(){
			var mode = $(this).attr('mode');
			var _param = _common.utils.collectSendData(".popupWrapper");
			if(confirm("저장하시겠습니까?")){
				_common.callAjax('/nms/'+mode+'CctvModel.json', _param, function(json){
					if(json.result){
						alert('저장되었습니다.');
						$("#popupWrap").dialog("close");
						callView(0);
					}
				});
			}
		});
	}
	 /**
	 * CCTV 모델 관리  > 삭제  클릭
	 */
	function bindClickEventDelBtn(){
		/* 팝업 삭제 버튼 클릭 이벤트입니다..*/
		$(".popupWrapper").find('#delBtn').click(function(){
			var mgrNo = $(".popupWrapper").find('#mgrNo').val();
			if(confirm("삭제하시겠습니까?")){
				_common.callAjax('/nms/delCctvModel.json', {'mgrNo': mgrNo}, function(json){
					if(json.result){
						alert('삭제되었습니다.');
						$("#popupWrap").dialog("close");
						callView(0);
					}
				});
			}
		});
	}
	/* 검색 입력항목 엔터키 입력 이벤트 입니다.*/
	$(".contentWrapper").find("#wrap").find(".sendData").keyup(function(e){
	    if(e.which == 13){
	    	$(".contentWrapper").find("#wrap").find("#searchBtn").click();
	    }
	});

	/* 검색 버튼 이벤트 입니다.*/
	$(".contentWrapper").find("#wrap").find("#searchBtn").click(function(){
		var _param = _common.utils.collectSendData("#search");
		callView(0, _param);
	});

	/**
	 * CCTV 모델 관리  > 신규추가 클릭
	 */
	$(".contentWrapper").find('#addBtn').click(function(){
		var _html=createPopupWrapper();

		$("#popupWrap").dialog("close").html(_html).dialog({
			title : "CCTV모델 관리",
			width: 550,
			height: 270,
			position: {
				my: "center top",
				at: "center top",
				of: $("#contentWrap")
			},
			open: function(){

				$(".popupWrapper").find("#saveBtn").attr("mode", "add");
				$(".popupWrapper").find('#delBtn').hide();
				bindClickEventSaveBtn();
			},
			close: function(){
			}
		}).dialog("open");


	});

	/**
	 * CCTV 모델 관리  > 관리 클릭
	 */
	$(".contentWrapper").find('.mngBtn').click(function(){

		var _param = {};
		_param['mgrNo'] = $(this).attr('k');
		_common.callAjax('/nms/getCctvModel.json', _param, function(json){
			if(json.result != null){

				var _html=createPopupWrapper();
				$("#popupWrap").dialog("close").html(_html).dialog({
					title : "CCTV모델 관리",
					width: 550,
					height: 270,
					position: {
						my: "center top",
						at: "center top",
						of: $("#contentWrap")
					},
					open: function(){
						$(".popupWrapper").find('#mgrNo').val(json.result.mgrNo.trim());
						$(".popupWrapper").find('#modelNm').val(_common.utils.validNull(json.result.modelNm));
						$(".popupWrapper").find('#makerNm').val(_common.utils.validNull(json.result.makerNm));
						$(".popupWrapper").find('#modelDesc').val(_common.utils.validNull(json.result.modelDesc));

						$(".popupWrapper").find('#saveBtn').attr('mode', 'edit');
						$(".popupWrapper").find('#delBtn').show();
						bindClickEventSaveBtn();
						bindClickEventDelBtn();
					},
					close: function(){
					}
				}).dialog("open");

			}
		});

	});


</script>
<div class="contentWrapper">

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

    <div id="wrap" class="contentWrapper">
<!--     	<div id="menuWrap"> -->
<!--         </div> -->
        <!-- <p class="searchTitle">
            <button class="logTab" url="/log/getAssetLogView.do" excel="Asset">시설물 관리</button>
            <button class="logTab" url="/log/getMsgLogView.do" excel="Msg">SMS</button>
            <button class="logTab" url="/log/getIf112LogView.do" excel="112">112 긴급영상 지원</button>
            <button class="logTab" url="/log/getIf112JsonLogView.do" excel="112Json">112 긴급출동 메소드 호출 현황</button>
            <button class="logTab" url="/log/getIf119LogView.do" excel="119">119 긴급출동</button>
            <button class="logTab" url="/log/getIfDscLogView.do" excel="Dsc">사회적약자</button>
            <button class="logTab" url="/log/getIfEvtLogView.do" excel="Evt">이벤트로그</button>
            <button class="logTab" active="active" url="/log/getAccessView.do" excel="Access">접근이력관리</button>
        </p> -->
<!--         <div id="title">CCTV 모델 관리</div> -->
        <div id="menuWrap">
        	<div id="search" class="box_style">
        		<div class="info_box wd100">
        			<div>
        				<label for="modelNm">모델명</label><input id="modelNm" class="keyup sendData" type="text" value="<%=modelNm%>" placeholder="모델명" style="width: 140px;">
			            <label for="makerNm">제조사명</label><input id="makerNm" class="keyup sendData" type="text" value="<%=makerNm%>" placeholder="제조사명" style="width: 140px;">
			            <button id="searchBtn" class="btn_style2">검색</button>
			            <button id="addBtn" class="btn_Dstyle">신규추가</button>
			            <!-- <button id="excelBtn"class="paleBtn">내보내기</button> -->
			            <span id="count">총 <%= request.getAttribute("count") %>개의 건이 검색되었습니다.</span>
        			</div>
        		</div>
	        </div>
        </div>
        <div id="content" class="table_style customScroll">
           <table id="userList">
           		<colgroup>
					<col width="150px">
					<col width="150px">
					<col width="150px">
					<col width="">
					<col width="60px">
				</colgroup>
                <thead>
                    <tr>
<%
String targetCol="";
for(int i=0; i<column.size(); i++){
    if("xeus.asset_cctv_model".equals(column.get(i).getTblId())){
		String col = column.get(i).getColNm();

		if(col.equals("관리번호"))	targetCol = "mgr_no";
		else if(col.equals("모델명"))	targetCol = "model_nm";
		else if(col.equals("제조사명"))	targetCol = "maker_nm";
		else if(col.equals("상세설명"))	targetCol = "model_desc";

		col = "<span id='" + targetCol + "' class='mngSortBtn' url='/nms/getCctvModelMngView.do' >" + col + "</span>";
%>
                        <th><%= col %></th>
<%
    }
}
%>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
<%
if(list.size() == 0){
%>
                    <tr>
                        <td colspan="5"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <td><%= StrUtil.chkNull(list.get(i).getMgrNo()).trim() %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getModelNm()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getMakerNm()) %></td>
                        <td><%= StrUtil.chkNull(list.get(i).getModelDesc()) %></td>
                        <td><button class="mngBtn btn_style2" k="<%= list.get(i).getMgrNo() %>">변경</button></td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>
        </div>
        <div class="paging_wrap"></div>
    </div>
</div>
<!-- </body>
</html> -->