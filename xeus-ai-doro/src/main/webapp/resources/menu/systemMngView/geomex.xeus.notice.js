$(document).ready(function(){
	var value = $(".contentWrapper").find("#searchInput").val();
	$(".contentWrapper").find("#searchInput").val(value).focus();

	$(".contentWrapper").find(".downBtn").each(function(){
		if($(this).attr("k") == ""){
			$(this).removeAttr("class", "");
		}
	});
	var limit =$(".contentWrapper").find('#limit').val();
	if(limit == undefined || limit == null || limit =="" || limit ==0){
		limit = 10;
	}
	$(".contentWrapper").find(".paging_wrap").paging({
		current	  : Number(limit),
		max  	  : Number($("#max").val()),
		nowOffset : Number($("#offset").val()),
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
	var limit =$(".contentWrapper").find('#limit').val();
	if(offset == null) offset = 0;
	if(_param == null){
		var _param = {};
	}
	_param["limit"] = limit;
	_param["offset"] = offset;
	_param["gbn"] = gbn;
	if(sortCol!="null" && sortTyp!="null"){
		_param['sortCol'] = sortCol;
		_param['sortTyp'] = sortTyp;
	}
	if(_param["notcTitle"] == null){
		if(notcTitle != "" && notcTitle != null) _param["notcTitle"] = notcTitle;
	}

	_common.callAjax("/notice/getNoticeView.do", _param, function(view){
		$("#contentWrap").dialog("close").html(view).dialog("open");
	});
}

/**
 * 공지사항 관리 > 저장 클릭
 */
function bindClickEventSaveBtn(){
	$(".popupWrapper").find("#saveBtn").click(function(){
		var chkNotice = $(".contentWrapper").find('.notice').length;
		if(chkNotice == 0){
			var mode = $(this).attr("mode");
			if(confirm("저장하시겠습니까?")){
				_common.formSubmit("/notice/" + mode + ".json", $(".popupWrapper").find("#sendForm"), function(json){
					if(json.result == true){
						$("#popupWrap").dialog("close");
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
			}
		}
	});
}


/**
 * 공지사항 관리 > 삭제 클릭
 */
function bindClickEventDelBtn(){
	$(".popupWrapper").find("#delBtn").click(function(){
		var chkNotice = $(".popupWrapper").find('.notice').length;
		if(chkNotice == 0){
			if(confirm("삭제하시겠습니까?")){
				_common.callAjax("/notice/del.json", _common.utils.collectSendData($(".popupWrapper #sendForm > table")), function(json){

					if(json.result == true){
						$(".popupWrapper").find("#notice_edit_pop_wrap").bPopup().close();
						setTimeout(function(){
							var _param={};
							if(notcTitle != "" && notcTitle != null) _param["notcTitle"] = notcTitle;
							callView(offset, _param);
							//callView();
						}, 300);
					}
				});
			}
		}
	});
}

/**
 * 공지사항 관리 > 파일과 관련된 이벤트
 */
function bindClickEventAboutFile(){
	/* 파일 다운 */
	$(".popupWrapper").find(".downBtn").click(function(){
		var k = $(this).attr("k");
		var u = $(this).attr("u");

		if(k != null && k != "" && u != null && u != ""){
			_common.postForm.submit("/notice/getFile.json", { "atchFileNm" : k , "mgrSeq" : u });
		}
	});

	/* 파일 수정 */
	$(".popupWrapper").find("#editBtn").click(function(){
		$(".popupWrapper").find("#downTr").addClass("hidden");
		$(".popupWrapper").find("#formTr").removeClass("hidden");
	});
}
/* 수정 팝업 */
$(".contentWrapper").find(".mngBtn").click(function(){
	var mgrSeq = $(this).attr("k");

	_common.callAjax("/notice/getItem.json", {"mgrSeq" : mgrSeq}, function(json){
		if(json.result != null){
			var _html = '<div class="popupWrapper">';
			_html += $('#notice_edit_pop_wrap').html();
			_html += '</div>';

			$("#popupWrap").dialog("close").html(_html).dialog({
				title : "공지사항 관리",
				width: 550,
				height: 'auto',
				position: {
					my: "center top",
					at: "center top",
					of: $("#contentWrap")
				},
				open: function(){
					for(var key in json.result){
						$(".popupWrapper").find("#" + key).val(json.result[key]);
						if(key == "atchFileNm") $(".popupWrapper").find("#fileDown").val(json.result[key]);
					}

					// 관리 다이얼로그가 열릴때 저장버튼에 알수없는 애니메이션이 있어서 임시처리
					$(".popupWrapper").addClass("hidden");

					$(".popupWrapper").find("#formTr, #downTr").removeClass("hidden");
					$(".popupWrapper").find("#formTr").addClass("hidden");
					$(".popupWrapper").find("#saveBtn").attr("mode", "edit");
					$(".popupWrapper").find("#delBtn").show();

					$(".popupWrapper").find("#saveBtn").css("width", "48%");
					$(".popupWrapper").find("#delBtn").css("width", "48%");
					$(".popupWrapper").find("#delBtn").css("height", "40px");

					$(".popupWrapper").removeClass("hidden");

					bindClickEventSaveBtn();
					bindClickEventDelBtn();
					bindClickEventAboutFile();
				},
				close: function(){
				}
			}).dialog("open");
			/*if($("#fileDown").val() == ""){
				$("#formTr").removeClass("hidden");
			}*/
		}
	}, false);
});

/* 신규 팝업 */
$(".contentWrapper").find("#addBtn").click(function(){
	var _html = '<div class="popupWrapper">';
	_html += $('#notice_edit_pop_wrap').html();
	_html += '</div>';

	$("#popupWrap").dialog("close").html(_html).dialog({
		title : "공지사항 관리",
		width: 550,
		height: 'auto',
		position: {
			my: "center top",
			at: "center top",
			of: $("#contentWrap")
		},
		open: function(){
			$(".popupWrapper").find("#formTr, #downTr").removeClass("hidden");
			$(".popupWrapper").find("#downTr").addClass("hidden");
			$(".popupWrapper").find("#saveBtn").attr("mode", "add");
			$(".popupWrapper").find("#delBtn").hide();
			bindClickEventSaveBtn();
			bindClickEventAboutFile();
//			bindClickEventDelBtn()
		},
		close: function(){
		}
	}).dialog("open");
});


/* 검색버튼 */
$(".contentWrapper").find("#searchBtn").click(function(){
	var limit =$(".contentWrapper").find('#limit').val();
	var _param = {};
	var val = $(".contentWrapper").find("#searchInput").val();
	if(val != null) _param["notcTitle"] = val;
	callView(0, _param);
	//callView();
});

/* 엔터키 이벤트 */
$(".contentWrapper").find(".keyup").keyup(function(e){
	if(e.which == 13){
		var selector = $(this).attr("for");
		$(selector).click();
	};
});

/* bPopup Close */
$(".contentWrapper").find("#closeEditPop").click(function(e){
	var chkNotice = $(".contentWrapper").find('.notice').length;
	if(chkNotice == 0){
		$(".contentWrapper").find(".bpopup").bPopup().close();
		e.stopPropagation();
	}
});