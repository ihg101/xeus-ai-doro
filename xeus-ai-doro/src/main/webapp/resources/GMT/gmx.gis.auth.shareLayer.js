

$(document).ready(function(){
	var value = $("#shareLayerWrap").find("#searchInput").val();
	$("#shareLayerWrap").find("#searchInput").val(value).focus();
	//$("#shareLayerWrap").find("#authGrpList").css("height", $("#shareLayerWrap").find("#authListWrap").height());

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));
});

/* 등록된 권한 조회 */
$("#shareLayerWrap").find(".grp").click(function(){
	var key = $(this).attr("k");
	$('#lyrGrpList option:selected').prop('selected',false);
	$('#list > tbody > tr > td:nth-child(3)').html('');

	$("#shareLayerWrap").find("input.auth").removeAttr("grp").prop("checked", false);
	_common.callAjax("/GMT_auth/getAuthGrpList.json", {"authGrpNo" : key}, function(json){
		if(json.result != null){
			if(json.result.length == 0){
				$("#shareLayerWrap").find("input.auth").attr("grp", key);
				$("#shareLayerWrap").find("input.auth, #allAuth").prop("disabled", false);
				$("#shareLayerWrap").find("#allAuth").prop("checked", false);
			}else{
				var array = json.result[0].authMgrNo.split(",");

				$("#shareLayerWrap").find("input.auth").attr("grp", key);
				for(var i=0; i<array.length; i++){
					$("#shareLayerWrap").find("input.auth[k=" + array[i] + "]").prop("checked", true);
				}
				$("#shareLayerWrap").find("input.auth, #allAuth").prop("disabled", false);
				if($("#shareLayerWrap").find("input.auth").is(":checked")){
					$("#shareLayerWrap").find("#allAuth").prop("checked", true);
				}
			}
		}
	}, false);
});


/* 등록된 권한 조회 */
$("#shareLayerWrap").find(".lyrGrp").click(function(){
	var grpMgrSeq = $(this).attr("k");
	var authGrpNo=$('#authGrpList option:selected').attr('k');
	if(authGrpNo==undefined){
		alert('그룹목록을 먼저 클릭해주세요.');
		return;
	}
	$("#shareLayerWrap").find("input.auth").removeAttr("lytGrp").prop("checked", false);

	_common.callAjax("/GMT_layer/getMyLayerListByAuth.json", {"grpMgrSeq" : '3',"authGrpNo" : authGrpNo,"userId":userId}, function(json){
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
		bindRightToLeftBtnClickEvent()
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

function getLeftLayerList(result){
	var $html=$('<table id="leftLayerList" class="layerList" style="float:left;"></table>');
	var $thead=$('<thead></thead>');
	$thead.append('<tr><th colspan=2>공유 추가</th></tr>');

	var $tbody=$('<tbody></tbody>');
	if(result!=undefined){
		for(var i=0; i<result.length; i++){
			var tblId=result[i].tblId;
			var lyrNm=result[i].lyrNm;

			var $tr=$('<tr></tr>');
			$tr.append('<td><input id="'+tblId+'" class="leftCheckBox checkbox" type="checkbox"><label for="'+tblId+'" class="checkboxC"></label></td>');
			$tr.append('<td k="'+tblId+'" class="leftText">'+lyrNm+'</td>');
			$tbody.append($tr);
		}
	}
	$html.append($thead);
	$html.append($tbody);
	return $html;
}
function getRightLayerList(result){
	var $html=$('<table id="rightLayerList" class="layerList" style="float:right;"></table>');
	var $thead=$('<thead></thead>');
	$thead.append('<tr><th colspan=2>공유 제거</th></tr>');

	var $tbody=$('<tbody></tbody>');
	if(result!=undefined){
		for(var i=0; i<result.length; i++){
			var tblId=result[i].tblId;
			var lyrNm=result[i].lyrNm;

			var $tr=$('<tr></tr>');
			$tr.append('<td><input id="'+tblId+'" class="rightCheckBox checkbox" type="checkbox"><label for="'+tblId+'" class="checkboxC"></label></td>');
			$tr.append('<td k="'+tblId+'" class="rightText">'+lyrNm+'</td>');
			$tbody.append($tr);
		}
	}
	$html.append($thead);
	$html.append($tbody);
	return $html;
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
function bindLeftToRightBtnClickEvent(){
	$("#shareLayerWrap").find("#leftToRightBtn").click(function(){
		var leftList=[];
		var rightList=[];
		var moveList=[];
		$('.leftCheckBox').each(function(){
			var obj={};
			obj.lyrNm=$($(this).parent().parent().find('.leftText')).text();
			obj.tblId=$($(this).parent().parent().find('.leftText')).attr('k');
			if($(this).prop('checked')==false){
				leftList.push(obj);
			}
			else{
				moveList.push(obj);
			}
		});
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
	$("#shareLayerWrap").find("#rightToLeftBtn").click(function(){
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
		$('.leftText').each(function(){
			var obj={};
			obj.lyrNm=$(this).text();
			obj.tblId=$(this).attr('k');
			leftList.push(obj);
		});
		addAuthLayerList(moveList);
		leftList=leftList.concat(moveList);

		var $left=getLeftLayerList(leftList);
		var $right=getRightLayerList(rightList);
		$('#leftLayerList').html($left.html());
		$('#rightLayerList').html($right.html());

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

/* 그룹 삭제 */
$("#shareLayerWrap").find("#delBtn").click(function(){
	confirm("그룹을 삭제하시겠습니까?", function(){
		_common.callAjax("/GMT_auth/delGrp.json", _common.utils.collectSendData(), function(json){
			if(json.result == true){
				$("#shareLayerWrap").find("#edit_pop_wrap").bPopup().close();
				$("#shareLayerWrap").find("#edit_pop_wrap").remove();
				setTimeout(function(){
					_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
						//$("#shareLayerWrap").find(".bpopup").remove();
						$("#shareLayerWrap").find("#overlay-west-contents").html(view);
					});
				}, 300);
			}
		}, false);
	});
});

/* 전체선택 클릭 이벤트 */
$("#shareLayerWrap").find("#allAuth").click(function(){
	if($("#shareLayerWrap").find("input.auth").is(":checked")){
		$("#shareLayerWrap").find("input.auth:checked").each(function(){
			$(this).click();
		});
	}else{
		$("#shareLayerWrap").find("input.auth").not(":checked").each(function(){
			$(this).click();
		});
	}
});

/* 명칭 클릭 이벤트 */
$("#shareLayerWrap").find(".authNm").click(function(){
	$(this).prev().find("input").click();
});

/* 체크박스 이벤트 */
$("#shareLayerWrap").find(".auth").change(function(){
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

	if($("#shareLayerWrap").find("input.auth").is(":checked")){
		$("#shareLayerWrap").find("#allAuth").prop("checked", true);
	}else{
		$("#shareLayerWrap").find("#allAuth").prop("checked", false);
	}
});

/* 뒤로가기 */
$("#shareLayerWrap").find("#back").click(function(){
	location.href = "../map/view.do";
});

/* 신규 팝업 */
$("#shareLayerWrap").find("#addBtn").click(function(){
	$("#shareLayerWrap").find('#edit_pop_wrap').find('#authGrpNm').val('');
	$("#shareLayerWrap").find("#edit_pop_wrap").bPopup({appendTo: $("#shareLayerWrap")});
	$("#shareLayerWrap").find(".bpopup").find("#saveBtn").attr("mode", "add");
	$("#shareLayerWrap").find("#saveBtn").css('width', '48.5%')
	$("#shareLayerWrap").find("#closeEditPop").css('width', '48.5%')
	$("#shareLayerWrap").find("#delBtn").hide();
	$("#shareLayerWrap").find("#authGrpNm").focus();
});

/* 수정 및 저장 */
$("#shareLayerWrap").find("#saveBtn").click(function(){
//	var mode = $(this).attr("mode");
//	if(mode == "add") mode = "addGrp";
//	if(mode == "edit") mode = "editGrp";

	xeusCustom.customConfirm("저장하시겠습니까?", function(){
		_common.callAjax("/GMT_auth/" + mode + ".json", _common.utils.collectSendData(), function(json){
			if(json.result == true){
				$("#shareLayerWrap").find("#edit_pop_wrap").bPopup().close();
				$("#shareLayerWrap").find("#edit_pop_wrap").remove();
				setTimeout(function(){
					_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
						//$("#shareLayerWrap").find(".bpopup").remove();
						$("#shareLayerWrap").html(view);
					});
				}, 300);
			}
		});
	});
});


/* 취소*/
$("#shareLayerWrap").find("#closeEditPop").click(function(){
	$("#shareLayerWrap").find("#edit_pop_wrap").bPopup().close();
	$("#shareLayerWrap").find("#edit_pop_wrap").remove();
});


/* 검색버튼 */
$("#shareLayerWrap").find("#searchBtn").click(function(){
	var val = $("#shareLayerWrap").find("#searchInput").val();
	var _param ={};
	 _param["authGrpNm"] = val;
	 _param["gbn"] = gbn;
	_common.callAjax("/GMT_auth/getAuthView.do", _param, function(view){
		//$("#shareLayerWrap").find(".bpopup").remove();
		$("#shareLayerWrap").html(view);
	});
	//_common.postForm.submit("/GMT_auth/getAuthView.do", { "authGrpNm" : val });
});

/* 엔터키 이벤트 */
$("#shareLayerWrap").find(".keyup").keyup(function(e){
	if(e.which == 13){
		var selector = $(this).attr("for");
		$(selector).click();
	};
});

/* bPopup Close */
/*$("#shareLayerWrap").find(".bpopClose").click(function(){
	$("#shareLayerWrap").find(".bpopup").bPopup().close();
});*/