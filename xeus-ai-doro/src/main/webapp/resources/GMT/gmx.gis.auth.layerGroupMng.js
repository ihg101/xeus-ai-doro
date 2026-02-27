


$(document).ready(function(){

	var value = $("#layerGroupManageWrap").find("#searchInput").val();
	$("#layerGroupManageWrap").find("#searchInput").val(value).focus();
	//$("#layerGroupManageWrap").find("#authGrpList").css("height", $("#layerGroupManageWrap").find("#authListWrap").height());

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));
	$('#layerAuthManageWrap').html('');
    $( "#layerGroupManageWrap .lyrGrpSortable" ).sortable({
	      revert: true,
	      cancel: ".disable-sort-item",
	      items: 'li:not(.disable-sort-item)',
	      change: function( event, ui ) {

	      },
	      receive: function( event, ui ) {
	      },
	      stop: function( event, ui ) {
	    	  lyrGrpSortStopCallBack();
	      }

    }).disableSelection();

//    $( "#layerGroupManageWrap ul, li" ).disableSelection();

});

/*
 * 그룹 순서를 바꾼다
 */
function lyrGrpSortStopCallBack(){
	var param = {};
	var i = 0;

	$("#layerGroupManageWrap").find(".lyrGrp").each(function(){
		//나의 레이어는 param에 넣지 않는다
		if($(this).attr("k") == '3'){

		}else{
			param["kv[" + i + "][mgrSeq]"] = $(this).attr("k");
			param["kv[" + i + "][grpZidx]"] = String(i+1);
			i++;
		}

	});
	_common.callAjax("/GMT_layer/setLayerGroupIndex.json", param, function(json){

	});

}

/*
 * 그룹 순서를 바꾼다
 */
function lyrSortStopCallBack(){
	var param = {};
	var i = 0;

	$("#layerGroupManageWrap").find(".lyr").each(function(){

		param["kv[" + i + "][mgrSeq]"] = $(this).attr("v");
		param["kv[" + i + "][lyrZidx]"] = String(i+1);
		i++;

	});
	_common.callAjax("/GMT_layer/setLayersIndex.json", param, function(json){

	});

}


/*
 * 권한이 없는 레이어를 반환한다
 */
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
	//var $html=$('<table id="leftLayerList" class="layerList" style="float:left;"></table>');
	var $html=$('<ul class="layerList lyrSortable customScroll" id="leftLayerList" style="float:left; text-align:initial">');
//	var $thead=$('<thead></thead>');
//	var grpNm = $('#lyrGrpList option:selected').text();
//	$thead.append('<tr><th colspan=2>'+grpNm+'</th></tr>');

//	var $tbody=$('<tbody class="lyrSortable></tbody>');
	if(result!=undefined){
		for(var i=0; i<result.length; i++){
			
			
			var tblId = result[i].tblId;
			var lyrNm = result[i].lyrNm;
			var mgrSeq = result[i].mgrSeq;
			var $li=$('<li></li>');
			$('#' + tblId+'_left').parent().remove();
			$li.append('<input id="'+tblId+'_left" class="leftCheckBox checkbox" type="checkbox"><label for="'+tblId+'_left" class="checkboxC"></label>');
			$li.append('<label v="'+mgrSeq+'" k="'+tblId+'" class="leftText lyr">'+lyrNm+'</label>');
			$html.append($li);
		}
	}
//	$html.append($thead);
//	$html.append($tbody);
	return $html;
}
function getRightLayerList(result){
	var $html=$('<table id="rightLayerList" class="layerList" style="float:right;"></table>');
	var $thead=$('<thead></thead>');
	$thead.append('<tr><th colspan=2>임시레이어</th></tr>');

	var $tbody=$('<tbody></tbody>');
	if(result!=undefined){
		for(var i=0; i<result.length; i++){
			var tblId=result[i].tblId;
			var lyrNm=result[i].lyrNm;
			var mgrSeq=result[i].mgrSeq;
			$('#' + tblId+'_right').parent().remove();
			var $tr=$('<tr></tr>');
			$tr.append('<td><input id="'+tblId+'_right" class="rightCheckBox checkbox" type="checkbox"><label for="'+tblId+'_right" class="checkboxC"></label></td>');
			$tr.append('<td v="'+mgrSeq+'" k="'+tblId+'" class="rightText">'+lyrNm+'</td>');
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
function bindLeftLayerListSortAble(){
	$( "#layerGroupManageWrap .lyrSortable" ).sortable({
	      revert: true,
	      cancel: ".disable-sort-item",
	      items: 'li:not(.disable-sort-item)',
	      change: function( event, ui ) {

	      },
	      receive: function( event, ui ) {
	      },
	      stop: function( event, ui ) {
	    	  lyrSortStopCallBack();
	      }

	}).disableSelection();
}


function bindLeftToRightBtnClickEvent(){
	
	$("#layerGroupManageWrap").find("#leftToRightBtn").click(function(){
		
		if($('.leftText').length == 0){
			return;
		}
		
		var leftList=[];
		var rightList=[];
		var moveList=[];
		$('.leftCheckBox').each(function(){
			var obj={};
			obj.lyrNm=$($(this).parent().find('.leftText')).text();
			obj.tblId=$($(this).parent().find('.leftText')).attr('k');
			obj.mgrSeq=$($(this).parent().find('.leftText')).attr('v');
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
			obj.mgrSeq=$(this).attr('v');
			rightList.push(obj);
		});

		if(moveList.length == 0){
			return;
		}
		updateLayerGroupToTemporyGroup(moveList);

		rightList=rightList.concat(moveList);

		var $left=getLeftLayerList(leftList);
		var $right=getRightLayerList(rightList);
		$('#leftLayerList').html($left.html());
		$('#rightLayerList').html($right.html());

	});
}
function updateLayerGroupToTemporyGroup(layerList){
	var grpMgrSeq=$('#lyrGrpList option:selected').attr('k');
//	if(authGrpNo==undefined){
//		alert('그룹목록을 먼저 클릭해주세요.');
//		return;
//	}
	var str='';
	for(var i=0; i<layerList.length; i++){
		str+=layerList[i].tblId;
		str+=',';
	}
	str=str.substring(0,str.length-1);

	_common.callAjax("/GMT_layer/editLayerGroup.json", {'tblIdList':str,'grpMgrSeq':'6'}, function(json){

	}, true);
}
function bindRightToLeftBtnClickEvent(){
	$("#layerGroupManageWrap").find("#rightToLeftBtn").click(function(){
		if($('.rightText').length == 0){
			return;
		}
		var leftList=[];
		var rightList=[];
		var moveList=[];
		$('.rightCheckBox').each(function(){
			var obj={};

			obj.lyrNm=$($(this).parent().parent().find('.rightText')).text();
			obj.tblId=$($(this).parent().parent().find('.rightText')).attr('k');
			obj.mgrSeq=$($(this).parent().parent().find('.rightText')).attr('v');
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
			obj.mgrSeq=$(this).attr('v');
			leftList.push(obj);
		});

		if(moveList.length == 0){
			return;
		}

		updateLayerGroupToSelectedGroup(moveList);
		leftList=leftList.concat(moveList);

		var $left=getLeftLayerList(leftList);
		var $right=getRightLayerList(rightList);
		$('#leftLayerList').html($left.html());
		$('#rightLayerList').html($right.html());

	});
}
function updateLayerGroupToSelectedGroup(layerList){
//	var authGrpNo=$('#authGrpList option:selected').attr('k');
	var grpMgrSeq=$('#lyrGrpList option:selected').attr('k');


	var grpMgrSeq = null;
	$('.lyrGrp').each(function(){
	    if($(this).is(':checked')){
	        grpMgrSeq = $(this).attr("k")
	    }
	});
//	if(authGrpNo==undefined){
//		alert('그룹목록을 먼저 클릭해주세요.');
//		return;
//	}

	var str='';
	for(var i=0; i<layerList.length; i++){
		str+=layerList[i].tblId;
		str+=',';
	}
	str=str.substring(0,str.length-1);

	_common.callAjax("/GMT_layer/editLayerGroup.json", {'tblIdList':str, 'grpMgrSeq':grpMgrSeq}, function(json){

	}, true);
}

/* 등록된 권한 조회 */
$("#layerGroupManageWrap").find(".grp").click(function(){
	var key = $(this).attr("k");
	$('#lyrGrpList option:selected').prop('selected',false);
	$('#list > tbody > tr > td:nth-child(3)').html('');

	$("#layerGroupManageWrap").find("input.auth").removeAttr("grp").prop("checked", false);
	_common.callAjax("/GMT_auth/getAuthGrpList.json", {"authGrpNo" : key}, function(json){
		if(json.result != null){
			if(json.result.length == 0){
				$("#layerGroupManageWrap").find("input.auth").attr("grp", key);
				$("#layerGroupManageWrap").find("input.auth, #allAuth").prop("disabled", false);
				$("#layerGroupManageWrap").find("#allAuth").prop("checked", false);
			}else{
				var array = json.result[0].authMgrNo.split(",");

				$("#layerGroupManageWrap").find("input.auth").attr("grp", key);
				for(var i=0; i<array.length; i++){
					$("#layerGroupManageWrap").find("input.auth[k=" + array[i] + "]").prop("checked", true);
				}
				$("#layerGroupManageWrap").find("input.auth, #allAuth").prop("disabled", false);
				if($("#layerGroupManageWrap").find("input.auth").is(":checked")){
					$("#layerGroupManageWrap").find("#allAuth").prop("checked", true);
				}
			}
		}
	}, false);
});

/* 권한 수정 */
$("#layerGroupManageWrap").find(".grp").dblclick(function(){
	var key = $(this).attr("k");
	$('#authGrpList option:selected').attr('k');
	_common.callAjax("/GMT_auth/getGrpList.json", {"authGrpNo" : key}, function(json){
		if(json.result != null){
			$("#layerGroupManageWrap").find('#edit_pop_wrap').find('#authGrpNm').val('');
			for(var key in json.result[0]){
				$("#layerGroupManageWrap").find("#edit_pop_wrap").find("#" + key).val(json.result[0][key]);
			}
			$("#layerGroupManageWrap").find("#edit_pop_wrap").bPopup({appendTo: $("#layerGroupManageWrap")});
			$("#layerGroupManageWrap").find(".bpopup").find("#saveBtn").attr("mode", "edit");
			$("#layerGroupManageWrap").find("#saveBtn").css('width', '32.5%')
			$("#layerGroupManageWrap").find("#closeEditPop").css('width', '32.5%')
			$("#layerGroupManageWrap").find("#delBtn").css('width', '32.5%')
			$("#layerGroupManageWrap").find("#delBtn").show();
		}
	}, false);
});


/* 등록된 권한 조회 */
$("#layerGroupManageWrap").find(".lyrGrp").change(function(){
	var grpMgrSeq = $(this).attr("k");
//	var authGrpNo=$('#authGrpList option:selected').attr('k');
//	if(authGrpNo==undefined){
//		alert('그룹목록을 먼저 클릭해주세요.');
//		return;
//	}
	$("#layerGroupManageWrap").find("input.auth").removeAttr("lytGrp").prop("checked", false);
	_common.callAjax("/GMT_layer/getLayerListByGroup.json", {"grpMgrSeq" : grpMgrSeq}, function(json){
//		var authFalseLayer=getAuthFalseLayer(json.allLayer,json.authTrueLayer);
		var $left=getLeftLayerList(json.layerBySelectedGroup);
		var $right=getRightLayerList(json.layerByTemporaryGroup);
		var $rightToLeft=$('<button id="rightToLeftBtn" class="edit btn_style2">그룹에 추가</button>');
		var $leftToRight=$('<button id="leftToRightBtn" class="edit btn_Dstyle">그룹에서 제거</button>');

		$('#list > tbody > tr > td:nth-child(2)').html('');
		$('#list > tbody > tr > td:nth-child(3)').html('');
		$('#list > tbody > tr > td:nth-child(4)').html('');

		$('#list > tbody > tr > td:nth-child(2)').append($left);
		$('#list > tbody > tr > td:nth-child(3)').append($rightToLeft);
		$('#list > tbody > tr > td:nth-child(3)').append($leftToRight);
		$('#list > tbody > tr > td:nth-child(4)').append($right);

		bindLeftLayerListSortAble();
		bindLeftToRightBtnClickEvent();
		bindRightToLeftBtnClickEvent();
	}, false);
});


/*
 * 레이어 그룹 수정
 */
$("#layerGroupManageWrap").find(".lyrGrpNm").dblclick(function(){
	var mgrSeq = $(this).attr("k");

	if(confirm("해당 레이어 그룹 이름을 수정하시겠습니까?")){
		var grpNm = prompt("레이어 그룹 이름을 입력해주세요.",$(this).text());
	}
	if(grpNm != null){
		_common.callAjax("/GMT_layer/editLayerGroupName.json", {grpNm:grpNm, mgrSeq:mgrSeq}, function(json){
			if(json.result == true){
				setTimeout(function(){
					_common.callAjax("/GMT_auth/getLayerGroupMngView.do", {}, function(view){
						//$("#layerGroupManageWrap").find(".bpopup").remove();
//						$("#popupWrap").dialog("close");
						$("#layerGroupManageWrap").html(view);
					});
				}, 300);
			}
		});
	}


});


/* 그룹 삭제 */
$("#layerGroupManageWrap").find("#delBtn").click(function(){

	var grpMgrSeq = null;
	$('.lyrGrp').each(function(){
	    if($(this).is(':checked')){
	        grpMgrSeq = $(this).attr("k")
	    }
	});
//	var grpMgrSeq = $('#lyrGrpList option:selected').attr('k')
	if(grpMgrSeq==undefined){
		alert('레이어 그룹을 먼저 클릭해주세요.');
		return;
	}
	if(grpMgrSeq == 1 || grpMgrSeq == 2 || grpMgrSeq == 3 || grpMgrSeq == 4 || grpMgrSeq == 5 || grpMgrSeq == 6){
		alert('해당 레이어 그룹은 삭제가 불가능합니다.');
		return;
	}
	if($('.leftText').length != 0){
		alert('해당 레이어 그룹의 레이어를 먼저 임시레이어로 이동해주세요.');
		return;
	}

	if(confirm("클릭한 레이어 그룹을 삭제하시겠습니까?")){
		_common.callAjax("/GMT_layer/delLayerGroup.json", {"mgrSeq":grpMgrSeq}, function(json){
			if(json.result == true){

				setTimeout(function(){
					_common.callAjax("/GMT_auth/getLayerGroupMngView.do", {}, function(view){
						$("#layerGroupManageWrap").html(view);
						alert('삭제되었습니다.');
					});
				}, 300);
			}
		}, false);
	}
});

/* 전체선택 클릭 이벤트 */
$("#layerGroupManageWrap").find("#allAuth").click(function(){
	if($("#layerGroupManageWrap").find("input.auth").is(":checked")){
		$("#layerGroupManageWrap").find("input.auth:checked").each(function(){
			$(this).click();
		});
	}else{
		$("#layerGroupManageWrap").find("input.auth").not(":checked").each(function(){
			$(this).click();
		});
	}
});

/* 명칭 클릭 이벤트 */
$("#layerGroupManageWrap").find(".authNm").click(function(){
	$(this).prev().find("input").click();
});

/* 체크박스 이벤트 */
$("#layerGroupManageWrap").find(".auth").change(function(){
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

	if($("#layerGroupManageWrap").find("input.auth").is(":checked")){
		$("#layerGroupManageWrap").find("#allAuth").prop("checked", true);
	}else{
		$("#layerGroupManageWrap").find("#allAuth").prop("checked", false);
	}
});

/* 뒤로가기 */
$("#layerGroupManageWrap").find("#back").click(function(){
	location.href = "../map/view.do";
});

/* 신규 팝업 */
$("#layerGroupManageWrap").find("#addBtn").click(function(){
//	var _html='';
//	_html+='<div class="popupWrapper">'
//	_html+='	    <div id="bpop_wrap">'
//	_html+='	        <table>'
//	_html+='	            <tr class="hidden">'
//	_html+='	                <th class="top">그룹ID</th>'
//	_html+='	                <td>'
//	_html+='	                    <input type="text" class="sendData" id="authGrpNo" />'
//	_html+='	                </td>'
//	_html+='	            </tr>'
//	_html+='	            <tr class="top">'
//	_html+='	                <th class="top">그룹명</th>'
//	_html+='	                <td>'
//	_html+='	                    <input type="text" class="sendData" id="grpNm" />'
//	_html+='	                </td>'
//	_html+='	            </tr>'
//	_html+='	        </table>'
//	_html+='	        <table>'
//	_html+='	            <tr align="center">'
//	_html+='	                <td class="lastTd" colspan="2" style="border: 0 !important;">'
//	_html+='	                    <button id="saveBtn" class="btn_style2">저장</button>'
////	_html+='	                    <button id="closeEditPop" class="btn_style2">취소</button>'
//	_html+='	                </td>'
//	_html+='	            </tr>'
//	_html+='	        </table>'
//	_html+='	    </div>'
//	_html+='</div>'
//
//
//	$("#popupWrap").dialog("close").html(_html).dialog({
//		title : "레이어 그룹 관리",
//		width: 370,
//		height: 230,
//		position: {
//			my: "center top",
//			at: "center top",
//			of: $("#layerGroupManageWrap")
//		},
//		open: function(){
//			$('#popupWrap').find('#authGrpNm').val('');
//			$('#popupWrap').find("#saveBtn").attr("mode", "add");
//			$('#popupWrap').find("#delBtn").hide();
//			$('#popupWrap').find("#authGrpNm").focus();
//			bindClickEventSaveBtn();
//		},
//		close: function(){
//		}
//	}).dialog("open");
	var grpNm=prompt('신규추가 할 그룹명을 입력하세요.');

	if(grpNm == null){
		return;
	}

	_common.callAjax("/GMT_layer/addLayerGroup.json", {grpNm:grpNm}, function(json){
		if(json.result == true){
			setTimeout(function(){
				_common.callAjax("/GMT_auth/getLayerGroupMngView.do", {}, function(view){
					//$("#layerGroupManageWrap").find(".bpopup").remove();
//					$("#popupWrap").dialog("close");
					$("#layerGroupManageWrap").html(view);
				});
			}, 300);
		}
	});

});



/* 취소*/
$("#layerGroupManageWrap").find("#closeEditPop").click(function(){
	$("#layerGroupManageWrap").find("#edit_pop_wrap").bPopup().close();
//	$("#layerGroupManageWrap").find("#edit_pop_wrap").remove();
});


/* 검색버튼 */
$("#layerGroupManageWrap").find("#searchBtn").click(function(){
	var val = $("#layerGroupManageWrap").find("#searchInput").val();
	var _param ={};
	 _param["grpNm"] = val;
//	 _param["gbn"] = gbn;
	_common.callAjax("/GMT_auth/getLayerGroupMngView.do", _param, function(view){
		//$("#layerGroupManageWrap").find(".bpopup").remove();
		$("#layerGroupManageWrap").html(view);
	});
	//_common.postForm.submit("/GMT_auth/getAuthView.do", { "authGrpNm" : val });
});

/* 엔터키 이벤트 */
$("#layerGroupManageWrap").find(".keyup").keyup(function(e){
	if(e.which == 13){
		var selector = $(this).attr("for");
		$(selector).click();
	};
});

/* bPopup Close */
/*$("#layerGroupManageWrap").find(".bpopClose").click(function(){
	$("#layerGroupManageWrap").find(".bpopup").bPopup().close();
});*/