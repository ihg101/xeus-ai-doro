
var GMXLAYERAUTH = {};

(function() {

	"use strict";

	var _TABLIST = [
		{ k : '이벤트 모니터링', v : 'eventTab', isLayer:true}
		, { k : '영상반출 신청', v : 'tviusTab', isLayer:true}
		, { k : '영상반출 관리', v : 'tviusMngTab', isLayer:true}
		, { k : '장비관리', v : 'nmsTab', isLayer:true}
		, { k : '빅데이터 분석', v : 'bigdataTab', isLayer:true}
		, { k : '레이어 관리', v : 'layerTab', isLayer:true}
		, { k : '공간 편집', v : 'gisEditTab', isLayer:true}
		, { k : '레이어 관리', v : 'layerTab', isLayer:true}
		, { k : '레이어 권한', v : 'layerAuthTab', isLayer:true}
	];


	var _DEFAULT_CALSPAN = 3;

	//이하 외부 지원 함수.
	GMXLAYERAUTH ={
		/**
		 * 레이어 권한 생성에 필요한 목록 조회
		 */
		getAuthLayerList : function() {
			var arr = [];

			for ( var i in _TABLIST ) {
				var obj = _TABLIST[i];

				if ( obj.isLayer ) {
					arr.push(obj);
				}
			}

			return arr;

		},

		/**
		 * 레이어 권한 생성 시 th 영역의 callSpan 값용..
		 */
		getAuthTabSize : function() {
			var cnt = _DEFAULT_CALSPAN;//default 사이즈....

			for ( var i in _TABLIST ) {
				var obj = _TABLIST[i];

				if ( obj.isLayer ) {
					cnt ++;
				}
			}

			return cnt;
		}
	}
})();

$(document).ready(function(){
	var value = $("#layerAuthManageWrap").find("#searchInput").val();
	$("#layerAuthManageWrap").find("#searchInput").val(value).focus();
	//$("#layerAuthManageWrap").find("#authGrpList").css("height", $("#layerAuthManageWrap").find("#authListWrap").height());

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));
});

/* 등록된 권한 조회 */
$("#layerAuthManageWrap").find(".grp").click(function(){
	var key = $(this).attr("k");
	$('#lyrGrpList option:selected').prop('selected',false);
	$('#list > tbody > tr > td:nth-child(3)').html('');

	$("#layerAuthManageWrap").find("input.auth").removeAttr("grp").prop("checked", false);
	_common.callAjax("/GMT_auth/getAuthGrpList.json", {"authGrpNo" : key}, function(json){
		if(json.result != null){
			if(json.result.length == 0){
				$("#layerAuthManageWrap").find("input.auth").attr("grp", key);
				$("#layerAuthManageWrap").find("input.auth, #allAuth").prop("disabled", false);
				$("#layerAuthManageWrap").find("#allAuth").prop("checked", false);
			}else{
				var array = json.result[0].authMgrNo.split(",");

				$("#layerAuthManageWrap").find("input.auth").attr("grp", key);
				for(var i=0; i<array.length; i++){
					$("#layerAuthManageWrap").find("input.auth[k=" + array[i] + "]").prop("checked", true);
				}
				$("#layerAuthManageWrap").find("input.auth, #allAuth").prop("disabled", false);
				if($("#layerAuthManageWrap").find("input.auth").is(":checked")){
					$("#layerAuthManageWrap").find("#allAuth").prop("checked", true);
				}
			}
		}
	}, false);
});

/* 권한 수정 */
$("#layerAuthManageWrap").find(".grp").off("dblclick").dblclick(function(){
	var key = $(this).attr("k");
	$('#authGrpList option:selected').attr('k');
	_common.callAjax("/GMT_auth/getGrpList.json", {"authGrpNo" : key}, function(json){
		if(json.result != null){
			$("#layerAuthManageWrap").find('#edit_pop_wrap').find('#authGrpNm').val('');
			for(var key in json.result[0]){
				$("#layerAuthManageWrap").find("#edit_pop_wrap").find("#" + key).val(json.result[0][key]);
			}
			$("#layerAuthManageWrap").find("#edit_pop_wrap").bPopup({appendTo: $("#layerAuthManageWrap")});
			$("#layerAuthManageWrap").find(".bpopup").find("#saveBtn").attr("mode", "edit");
			$("#layerAuthManageWrap").find("#saveBtn").css('width', '32.5%')
			$("#layerAuthManageWrap").find("#closeEditPop").css('width', '32.5%')
			$("#layerAuthManageWrap").find("#delBtn").css('width', '32.5%')
			$("#layerAuthManageWrap").find("#delBtn").show();
		}
	}, false);
});


/* 해당 그룹의 레이어에 대한  권한 조회 */
$("#layerAuthManageWrap").find(".lyrGrp").click(function(){
	var grpMgrSeq = $(this).attr("k");
	var authGrpNo=$('#authGrpList option:selected').attr('k');
	if(authGrpNo==undefined){
		alert('그룹목록을 먼저 클릭해주세요.');
		return;
	}
	$("#layerAuthManageWrap").find("input.auth").removeAttr("lytGrp").prop("checked", false);
	_common.callAjax("/GMT_layer/getLayerListByAuth.json", {"grpMgrSeq" : grpMgrSeq,"authGrpNo" : authGrpNo}, function(json){
		var authFalseLayer=getAuthFalseLayer(json.allLayer,json.authTrueLayer);
		var $left=getLeftLayerList(json.authTrueLayer);
		var $right=getRightLayerList(authFalseLayer);

		var $rightToLeft=$('<button id="rightToLeftBtn" class="edit btn_style2">추가</button>');
		var $leftToRight=$('<button id="leftToRightBtn" class="edit btn_Dstyle">제거</button>');

		$('#list > tbody > tr > td:nth-child(3)').html('');
		$('#list > tbody > tr > td:nth-child(3)').append($left);
		$('#list > tbody > tr > td:nth-child(3)').append($rightToLeft);
		$('#list > tbody > tr > td:nth-child(3)').append($leftToRight);
		$('#list > tbody > tr > td:nth-child(3)').append($right);

		bindLeftToRightBtnClickEvent();
		bindRightToLeftBtnClickEvent();
		bindDetailAuthClickEvent();
		bindLeftTableThClickEvent();
		bindRightTableThClickEvent()
	}, false);
});

function getAuthFalseLayer(allLayer,authTrueLayer){
	var result=[];
	for(var i=0; i<allLayer.length; i++){
		if(!isContain(authTrueLayer,allLayer[i].tblId)){
			result.push(allLayer[i]);
		}
	}
	return result;

}
function isContain(list, target){
	for(var i=0; i<list.length; i++){
		if(list[i].tblId===target){
			return true;
		}
	}
	return false;
}


function makeModYnInputBox($tr, modYn){

	if(modYn === 'Y'){
		$tr.append('<td><input class="modYn detailAuth" type="checkbox" checked></td>');
	}
	else{
		$tr.append('<td><input class="modYn detailAuth" type="checkbox"></td>');
	}

}

//input 박스 생성..
function makeTabAuthInputBox($tr, platformTabAuth){

	var arr = GMXLAYERAUTH.getAuthLayerList();
	//기본으로 들어갈 UI

	for ( var i in arr ) {
		var item = arr[i];

		var $td = $('<td></td>');
		var $checkBox = $('<input class="tabAuth detailAuth" k='+item.v+' type="checkbox"/>');
		if (platformTabAuth) {
			$checkBox.prop('checked', platformTabAuth.contains(item.v) === true );

		}

		$td.html($checkBox);

		$tr.append($td);
	}
}


//function bindDragAndDropEvent(){
//	$( "#leftLayerList" ).sortable({
//		revert: true
//	});
//	$( "#rightLayerList" ).sortable({
//		revert: true
//	});
//	$( ".leftDrag" ).draggable({
//		connectToSortable: ".layerList",
//		helper: "original",
//		revert: "invalid"
//    });
//	$( ".rightDrag" ).draggable({
//		connectToSortable: ".layerList",
//		helper: "original",
//		revert: "invalid"
//    });
//}

/**
 * 제거 클릭
 */
function bindLeftToRightBtnClickEvent(){
	$("#layerAuthManageWrap").find("#leftToRightBtn").click(function(){
		var leftList=[];
		var rightList=[];
		var moveList=[];
		$('.leftCheckBox').each(function(){
			var obj={};
			obj.lyrNm=$($(this).parent().parent().find('.leftText')).text();
			obj.tblId=$($(this).parent().parent().find('.leftText')).attr('k');
			obj.platformTabAuth=$($(this).parent().parent().find('.leftText')).attr('v');
			obj.modYn=$($(this).parent().parent().find('.leftText')).attr('s');

			if($(this).prop('checked')==false){
				leftList.push(obj);
			}
			else{
				moveList.push(obj);
			}
		});

		if(moveList.length == 0){
			return;
		}

		$('.rightText').each(function(){
			var obj={};
			obj.lyrNm=$(this).text();
			obj.tblId=$(this).attr('k');
			rightList.push(obj);
		});

		delAuthLayerList(moveList);

		rightList=rightList.concat(moveList);

		var $left=getLeftLayerList(leftList);
		var $right=getRightLayerList(rightList);
		$('#leftLayerList').html($left.html());
		$('#rightLayerList').html($right.html());

		bindDetailAuthClickEvent();
		bindLeftTableThClickEvent();
		bindRightTableThClickEvent();

	});
}
function delAuthLayerList(authList){
	var authGrpNo=$('#authGrpList option:selected').attr('k');
	if(authGrpNo==undefined){
		alert('그룹목록을 먼저 클릭해주세요.');
		return;
	}

	var str='';
	for(var i=0; i<authList.length; i++){
		str+=authList[i].tblId;
		str+=',';
	}
	str=str.substring(0,str.length-1);

	_common.callAjax("/GMT_auth/delAuthLayerList.json", {'authList':str,'authGrpNo':authGrpNo}, function(json){

	}, true);
}
function bindRightToLeftBtnClickEvent(){
	$("#layerAuthManageWrap").find("#rightToLeftBtn").click(function(){
		var leftList=[];
		var rightList=[];
		var moveList=[];
		$('.rightCheckBox').each(function(){
			var obj={};
			obj.lyrNm=$($(this).parent().parent().find('.rightText')).text();
			obj.tblId=$($(this).parent().parent().find('.rightText')).attr('k');
			if($(this).prop('checked')==false){
				rightList.push(obj);
			}
			else{
				moveList.push(obj);
			}
		});

		if(moveList.length == 0){
			return;
		}

		$('.leftText').each(function(){
			var obj={};
			obj.lyrNm=$(this).text();
			obj.tblId=$(this).attr('k');
			obj.platformTabAuth=$(this).attr('v');
			obj.modYn=$(this).attr('s');

			leftList.push(obj);
		});
		addAuthLayerList(moveList);
		leftList=leftList.concat(moveList);

		var $left=getLeftLayerList(leftList);
		var $right=getRightLayerList(rightList);
		$('#leftLayerList').html($left.html());
		$('#rightLayerList').html($right.html());

		bindDetailAuthClickEvent();
		bindLeftTableThClickEvent();
		bindRightTableThClickEvent();

	});
}


function addAuthLayerList(authList){
	var authGrpNo=$('#authGrpList option:selected').attr('k');
	var lyrGrpMgrSeq=$('#lyrGrpList option:selected').attr('k');
	if(authGrpNo==undefined){
		alert('그룹목록을 먼저 클릭해주세요.');
		return;
	}

	var str='';
	for(var i=0; i<authList.length; i++){
		str+=authList[i].tblId;
		str+=',';
	}
	str=str.substring(0,str.length-1);

	_common.callAjax("/GMT_auth/addAuthLayerList.json", {'authList':str,'authGrpNo':authGrpNo,'lyrGrpMgrSeq':lyrGrpMgrSeq}, function(json){

	}, true);
}

/**
 * 권한이 있는 레이어 목록 view를 만든다
 * @param result
 * @returns
 */
function getLeftLayerList(result){
	var $html=$('<table id="leftLayerList" class="layerList" style="float:left;"></table>');
	var $thead=$('<thead class="pointer"></thead>');
	$thead.append('<tr><th class=".pointer" colspan='+GMXLAYERAUTH.getAuthTabSize()+'>권한 추가</th></tr>');
	//헤더 생성.
	if(result.length!=0 && result!=undefined){
		var arr = GMXLAYERAUTH.getAuthLayerList();
		var $tr = $('<tr style="font-size:12px"></tr>');
		//기본으로 들어갈 UI
		var defaultHtmlStr = '<th>이동</th><th><button class="btn_style2 allTabCheckOnTable">전체 선택</button></th><th>수정 여부</th>';
		$tr.append(defaultHtmlStr);

		for ( var i in arr ) {
			var item = arr[i];
			$tr.append('<th>'+item.k+'</th>');
		}

		$thead.append($tr);
	}

	var $tbody=$('<tbody></tbody>');
	if(result!=undefined){
		for(var i=0; i<result.length; i++){
			var tblId=result[i].tblId;
			var lyrNm=result[i].lyrNm;
			var platformTabAuth=result[i].platformTabAuth;
			var modYn=result[i].modYn;

			var $tr=$('<tr></tr>');
			$tr.append('<td><input class="leftCheckBox" type="checkbox"></td>');

			$tr.append('<td k="'+tblId+'" v="'+platformTabAuth+'" s="'+modYn+'" class="leftText detailAuth allTabCheckOnRow pointer">'+lyrNm+'</td>');
			makeModYnInputBox($tr, modYn);

			makeTabAuthInputBox($tr, platformTabAuth);

			$tbody.append($tr);

			//전체 선택 체크박스 체크 유무
			var isAllCheck = true;
			$tr.find(".detailAuth").each(function(){
				if(!$(this).hasClass("modYn") && !$(this).hasClass("allTabCheckOnRow")){
					if(!$(this).prop("checked")){
						isAllCheck = false;
					}
				}
			})

			if(isAllCheck){
				$tr.find('.allTabCheckOnRow').prop("checked",true);
			}else{
				$tr.find('.allTabCheckOnRow').prop("checked",false);
			}

		}
	}
	$html.append($thead);
	$html.append($tbody);
	return $html;
}
/**
 * 권한이 없는 레이어 목록 view를 만든다
 * @param result
 * @returns
 */
function getRightLayerList(result){
	var $html=$('<table id="rightLayerList" class="layerList" style="float:right;"></table>');
	var $thead=$('<thead ></thead>');
	$thead.append('<tr><th class="pointer">이동</th><th colspan='+(GMXLAYERAUTH.getAuthTabSize()-1)+'>권한 제거</th></tr>');

	var $tbody=$('<tbody></tbody>');
	if(result!=undefined){
		for(var i=0; i<result.length; i++){
			var tblId=result[i].tblId;
			var lyrNm=result[i].lyrNm;

			var $tr=$('<tr></tr>');
			$tr.append('<td><input class="rightCheckBox" type="checkbox"></td>');
			$tr.append('<td colspan='+(GMXLAYERAUTH.getAuthTabSize()-1)+' k="'+tblId+'" class="rightText">'+lyrNm+'</td>');
			$tbody.append($tr);
		}
	}
	$html.append($thead);
	$html.append($tbody);
	return $html;
}
/**
 * 탭권한 셀렉트박스 클릭 시
 */
function bindDetailAuthClickEvent(){

	$("#layerAuthManageWrap").find(".detailAuth").click(function(){


		if($(this).hasClass("allTabCheckOnRow")){
			$tr = $(this).parent();
		}
		else{
			$tr = $(this).parent().parent();
		}


		var isAllCheck = true;

		$tr.find('.detailAuth').each(function(){
			if(!$(this).hasClass("modYn") && !$(this).hasClass("allTabCheckOnRow")){
				if(!$(this).prop("checked")){
					isAllCheck = false;
				}
			}
		});

//			if(isAllCheck){
//				$(this).parent().parent().find('.allTabCheckOnRow').prop("checked",true);
//			}else{
//				$(this).parent().parent().find('.allTabCheckOnRow').prop("checked",false);
//			}


		var obj={};
		var tabAuth='';
		var modYn='N';

		if($(this).hasClass("allTabCheckOnRow")){
			if(isAllCheck){
				$tr.find('.detailAuth').prop('checked',false);
				$tr.find('.modYn').prop('checked', false);
			}else{
				$tr.find('.detailAuth').prop('checked',true);
				$tr.find('.modYn').prop('checked', false);
			}
		}




		$tr.find('.tabAuth').each(function(){
		    if($(this).prop('checked')){
		        tabAuth+=$(this).attr('k');
		        tabAuth+=',';
		    }
		});
//		tabAuth=tabAuth.substring(0,tabAuth.length-1);



		if($tr.find('.modYn').prop('checked')){
			modYn='Y';
		}

		if(tabAuth != ''){
			obj.tabAuth=tabAuth;
		}

		$tr.find(".leftText").attr("v",tabAuth);
		$tr.find(".leftText").attr("s",modYn);

		obj.modYn=modYn;
		obj.authGrpNo=$('#authGrpList option:selected').attr('k');
		obj.tblId=$($tr.find('.leftText')).attr('k');

		_common.callAjax("/GMT_auth/updateAuthLayerByTabAuth.json", obj, function(json){

		}, false);
	});

}


/**
 * 권한 추가 테이블 컬럼명 클릭 시 이벤트
 */
function bindLeftTableThClickEvent(){

	$("#layerAuthManageWrap").find("#leftLayerList > thead > tr:nth-child(2) > th").click(function(){

		var $table = $(this).parent().parent().parent();
	    var thNum = $(this).closest('th').prevAll().length;
	    var len = $table.find('tbody').find('tr').length;

	    var allCheck = true;

	    for(var i=0; i<len; i++){
	         if(!$table.find('tbody').find('tr:eq('+i+')>td:eq('+thNum+')').find('input').prop('checked')){
	             allCheck = false;
	         }
	    }



	    for(var i=0; i<len; i++){
	         $table.find('tbody').find('tr:eq('+i+')>td:eq('+thNum+')').find('input').prop('checked',allCheck).trigger('click');
//	         $table.find('tbody').find('tr:eq('+i+')>td:eq('+thNum+')').find('input').trigger('click');
	    }

	});

	$("#layerAuthManageWrap").find(".allTabCheckOnTable").click(function(){

		var isAllCheck = true;
		$('#leftLayerList').find('.tabAuth').each(function(){
			if(!$(this).prop('checked')){
				isAllCheck = false;
			}
		});

		if(isAllCheck){
			$('#leftLayerList').find('.tabAuth').each(function(){
				if($(this).prop('checked')){
					$(this).trigger('click');
				}
			});
		}else{
			$('#leftLayerList').find('.tabAuth').each(function(){
				if(!$(this).prop('checked')){
					$(this).trigger('click');
				}
			});
		}

	});

}

/**
 * 권한 제거 테이블 컬럼명 클릭 시 이벤트
 */
function bindRightTableThClickEvent(){

	$("#layerAuthManageWrap").find("#rightLayerList > thead > tr:nth-child(1) > th").click(function(){

		var $table = $(this).parent().parent().parent();
	    var thNum = $(this).closest('th').prevAll().length;
	    var len = $table.find('tbody').find('tr').length;

	    var allCheck = true;

	    for(var i=0; i<len; i++){
	         if(!$table.find('tbody').find('tr:eq('+i+')>td:eq('+thNum+')').find('input').prop('checked')){
	             allCheck = false;
	         }

	    }
	    for(var i=0; i<len; i++){
//	         $table.find('tbody').find('tr:eq('+i+')>td:eq('+thNum+')').find('input').prop('checked',!allCheck).trigger('click');
	         $table.find('tbody').find('tr:eq('+i+')>td:eq('+thNum+')').find('input').trigger('click');
	    }

	});

}



/* 그룹 삭제 */
$("#layerAuthManageWrap").find("#delBtn").click(function(){
	confirm("그룹을 삭제하시겠습니까?", function(){
		_common.callAjax("/GMT_auth/delGrp.json", _common.utils.collectSendData(), function(json){
			if(json.result == true){
				$("#layerAuthManageWrap").find("#edit_pop_wrap").bPopup().close();
				$("#layerAuthManageWrap").find("#edit_pop_wrap").remove();
				setTimeout(function(){
					_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
						//$("#layerAuthManageWrap").find(".bpopup").remove();
						$("#layerAuthManageWrap").find("#overlay-west-contents").html(view);
					});
				}, 300);
			}
		}, false);
	});
});

/* 전체선택 클릭 이벤트 */
$("#layerAuthManageWrap").find("#allAuth").click(function(){
	if($("#layerAuthManageWrap").find("input.auth").is(":checked")){
		$("#layerAuthManageWrap").find("input.auth:checked").each(function(){
			$(this).click();
		});
	}else{
		$("#layerAuthManageWrap").find("input.auth").not(":checked").each(function(){
			$(this).click();
		});
	}
});

/* 명칭 클릭 이벤트 */
$("#layerAuthManageWrap").find(".authNm").click(function(){
	$(this).prev().find("input").click();
});

/* 체크박스 이벤트 */
$("#layerAuthManageWrap").find(".auth").change(function(){
	var grp = $(this).attr("grp");
	if(_common.utils.isNullAndEmpty(grp)){
		alert("그룹을 선택해 주세요.");
		return false;
	}
	var key = $(this).attr("k");
	var dat = new Date().getYMDHMS();
	var mode = "addGrpAuth";
	if(!$(this).is(":checked")) mode = "delGrpAuth";

	var param = {
		"authGrpNo" : grp,
		"authMgrNo"	: key
	}
	_common.callAjax("/GMT_auth/" + mode + ".json", param, function(json){}, true);

	if($("#layerAuthManageWrap").find("input.auth").is(":checked")){
		$("#layerAuthManageWrap").find("#allAuth").prop("checked", true);
	}else{
		$("#layerAuthManageWrap").find("#allAuth").prop("checked", false);
	}
});

/* 뒤로가기 */
$("#layerAuthManageWrap").find("#back").click(function(){
	location.href = "../map/view.do";
});

/* 신규 팝업 */
$("#layerAuthManageWrap").find("#addBtn").click(function(){
	$("#layerAuthManageWrap").find('#edit_pop_wrap').find('#authGrpNm').val('');
	$("#layerAuthManageWrap").find("#edit_pop_wrap").bPopup({appendTo: $("#layerAuthManageWrap")});
	$("#layerAuthManageWrap").find(".bpopup").find("#saveBtn").attr("mode", "add");
	$("#layerAuthManageWrap").find("#saveBtn").css('width', '48.5%')
	$("#layerAuthManageWrap").find("#closeEditPop").css('width', '48.5%')
	$("#layerAuthManageWrap").find("#delBtn").hide();
	$("#layerAuthManageWrap").find("#authGrpNm").focus();
});

/* 수정 및 저장 */
$("#layerAuthManageWrap").find("#saveBtn").click(function(){
//	var mode = $(this).attr("mode");
//	if(mode == "add") mode = "addGrp";
//	if(mode == "edit") mode = "editGrp";

	xeusCustom.customConfirm("저장하시겠습니까?", function(){
		_common.callAjax("/GMT_auth/" + mode + ".json", _common.utils.collectSendData(), function(json){
			if(json.result == true){
				$("#layerAuthManageWrap").find("#edit_pop_wrap").bPopup().close();
				$("#layerAuthManageWrap").find("#edit_pop_wrap").remove();
				setTimeout(function(){
					_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
						//$("#layerAuthManageWrap").find(".bpopup").remove();
						$("#layerAuthManageWrap").html(view);
					});
				}, 300);
			}
		});
	});
});


/* 취소*/
$("#layerAuthManageWrap").find("#closeEditPop").click(function(){
	$("#layerAuthManageWrap").find("#edit_pop_wrap").bPopup().close();
	$("#layerAuthManageWrap").find("#edit_pop_wrap").remove();
});


/* 검색버튼 */
$("#layerAuthManageWrap").find("#searchBtn").click(function(){
	var val = $("#layerAuthManageWrap").find("#searchInput").val();
	var _param ={};
	 _param["authGrpNm"] = val;
	 _param["gbn"] = gbn;
	_common.callAjax("/GMT_auth/getAuthView.do", _param, function(view){
		//$("#layerAuthManageWrap").find(".bpopup").remove();
		$("#layerAuthManageWrap").html(view);
	});
	//_common.postForm.submit("/GMT_auth/getAuthView.do", { "authGrpNm" : val });
});

/* 엔터키 이벤트 */
$("#layerAuthManageWrap").find(".keyup").keyup(function(e){
	if(e.which == 13){
		var selector = $(this).attr("for");
		$(selector).click();
	};
});

/* bPopup Close */
/*$("#layerAuthManageWrap").find(".bpopClose").click(function(){
	$("#layerAuthManageWrap").find(".bpopup").bPopup().close();
});*/