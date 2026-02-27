

$(document).ready(function(){
	var value = $("#wrap").find("#searchInput").val();
	$("#wrap").find("#searchInput").val(value).focus();

	$("#wrap").find(".downBtn").each(function(){
		if($(this).attr("k") == ""){
			$(this).removeAttr("class", "");
		}
	});

	$("#wrap").find(".paging_wrap").paging({
		current	  : 10,
		max  	  : Number($("#wrap").find("#max").val()),
		nowOffset : Number($("#wrap").find("#offset").val()),
		bindEvent : callView
	});

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));
});

function callView(offset, _param){
	/*if(offset == null) offset = 0;
	var _param = {"limit" : 10, "offset" : offset};

	var val = $("#searchInput").val();
	if(val != "" && val != null) _param["notcTitle"] = val;*/
	/**
	 * 180523 이은규
	 * 검색기능 수정
	 * 페이지 로드 시 들어온 값으로 페이징 처리한다.
	 */
	if(offset == null) offset = 0;
	if(_param == null){
		var _param = {};
	}
	_param["limit"] = 10;
	_param["offset"] = offset;
	_param["gbn"] = gbn;
	if(sortCol!="null" && sortTyp!="null"){
		_param['sortCol'] = sortCol;
		_param['sortTyp'] = sortTyp;
	}
	if(_param["notcTitle"] == null){
		if(notcTitle != "" && notcTitle != null) _param["notcTitle"] = notcTitle;
	}


	_common.callAjax("/GMT_notice/getNoticeView.do", _param, function(view){
		$("#wrap").find(".bpopup").remove();
		$("#wrap").find("#overlay-west-contents").html(view);
	});
}

/* 수정 팝업 */
$("#wrap").find(".mngBtn").click(function(){
	var mgrSeq = $(this).attr("k");

	_common.callAjax("/GMT_notice/getItem.json", {"mgrSeq" : mgrSeq}, function(json){
		if(json.result != null){
			$("#wrap").find("#formTr, #downTr").removeClass("hidden");
			$("#wrap").find("#formTr").addClass("hidden");
			for(var key in json.result){
				$("#wrap").find("#edit_pop_wrap").find("#" + key).val(json.result[key]);
				if(key == "atchFileNm") $("#wrap").find("#fileDown").val(json.result[key]);
			}
			$("#wrap").find("#edit_pop_wrap").bPopup({appendTo: $("#wrap")});
			$("#wrap").find("#edit_pop_wrap").find("#saveBtn").attr("mode", "edit");
			$("#wrap").find("#edit_pop_wrap").find("#delBtn").show();

			/*if($("#fileDown").val() == ""){
				$("#formTr").removeClass("hidden");
			}*/
		}
	}, false);
});

/* 신규 팝업 */
$("#wrap").find("#addBtn").click(function(){
	$("#wrap").find(".sendData").val("");
	$("#wrap").find("#formTr, #downTr").removeClass("hidden");
	$("#wrap").find("#downTr").addClass("hidden");
	$("#wrap").find("#edit_pop_wrap").bPopup({appendTo: $("#wrap")});
	$("#wrap").find("#edit_pop_wrap").find("#saveBtn").attr("mode", "add");
	$("#wrap").find("#edit_pop_wrap").find("#delBtn").hide();
});

/* 저장 */
$("#wrap").find("#saveBtn").click(function(){
	var chkNotice = $("#wrap").find('.notice').length;
	if(chkNotice == 0){
		var mode = $(this).attr("mode");
		confirm("저장하시겠습니까?", function(){
			_common.formSubmit("/GMT_notice/" + mode + ".json", $("#wrap").find("#sendForm"), function(json){
				if(json.result == true){
					$("#wrap").find("#edit_pop_wrap").bPopup().close();
					setTimeout(function(){
						var _param={};
						if(notcTitle != "" && notcTitle != null) _param["notcTitle"] = notcTitle;
						callView(offset, _param);
						//callView();
					}, 300);
				}else{
					alert(json.result);
					return false;
				}
			});
		});
	}
});

/* 삭제 */
$("#wrap").find("#delBtn").click(function(){
	var chkNotice = $("#wrap").find('.notice').length;
	if(chkNotice == 0){
		confirm("삭제하시겠습니까?", function(){
			_common.callAjax("/GMT_notice/del.json", _common.utils.collectSendData(), function(json){
				if(json.result == true){
					$("#wrap").find("#edit_pop_wrap").bPopup().close();
					setTimeout(function(){
						var _param={};
						if(notcTitle != "" && notcTitle != null) _param["notcTitle"] = notcTitle;
						callView(offset, _param);
						//callView();
					}, 300);
				}
			});
		});
	}
});

/* 파일 다운 */
$("#wrap").find(".downBtn").click(function(){
	var k = $(this).attr("k");
	var u = $(this).attr("u");

	if(k != null && k != "" && u != null && u != ""){
		_common.postForm.submit("/GMT_notice/getFile.json", { "atchFileNm" : k , "mgrSeq" : u });
	}
});

/* 파일 수정 */
$("#wrap").find("#editBtn").click(function(){
	$("#wrap").find("#downTr").addClass("hidden");
	$("#wrap").find("#formTr").removeClass("hidden");
});

/* 검색버튼 */
$("#wrap").find("#searchBtn").click(function(){
	var _param = {};
	var val = $("#wrap").find("#searchInput").val();
	if(val != null) _param["notcTitle"] = val;
	callView(0, _param);
	//callView();
});

/* 엔터키 이벤트 */
$("#wrap").find(".keyup").keyup(function(e){
	if(e.which == 13){
		var selector = $(this).attr("for");
		$(selector).click();
	};
});

/* bPopup Close */
$("#wrap").find("#closeEditPop").click(function(e){
	var chkNotice = $("#wrap").find('.notice').length;
	if(chkNotice == 0){
		$("#wrap").find(".bpopup").bPopup().close();
		e.stopPropagation();
	}
});