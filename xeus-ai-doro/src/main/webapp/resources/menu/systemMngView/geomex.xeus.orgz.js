$(document).ready(function(){
	var value = $(".contentWrapper").find("#searchInput").val();
	var limit =$(".contentWrapper").find('#limit').val();
	if(limit == undefined || limit == null || limit =="" || limit ==0){
		limit = 10;
	}
	$(".contentWrapper").find("#searchInput").val(value).focus();

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
	if(val != "" && val != null) _param["orgNm"] = val;*/

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
	if(_param["orgNm"] == null){
		if(orgNm != "" && orgNm != null) _param["orgNm"] = orgNm;
	}

	_common.callAjax("/orgz/getOrgzView.do", _param, function(view){
		$("#contentWrap").dialog("close").html(view).dialog("open");
	});
}


/**
 *  소속 관리 신규추가 > 저장 클릭
 */
function bindClickEventSaveBtn(){
	$(".popupWrapper").find("#saveBtn").click(function(){
		var chkNotice = $(".contentWrapper").find('.notice').length;
		if(chkNotice == 0){
			var mode = $(this).attr("mode");
			if(confirm("저장하시겠습니까?")){
				_common.callAjax("/orgz/" + mode + ".json", _common.utils.collectSendData("#popupWrap"), function(json){
					if(json.result == true){
						alert('저장되었습니다.');
						$("#popupWrap").dialog("close")
						setTimeout(function(){
							var _param={};
							if(orgNm != "" && orgNm != null) _param["orgNm"] = orgNm;
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
 *  소속 관리 수정 > 삭제 클릭
 */
function bindClickEventDelBtn(){
	/* 삭제 */
	$(".popupWrapper").find("#delBtn").click(function(){
		var chkNotice = $(".contentWrapper").find('.notice').length;
		if(chkNotice == 0){
			if(confirm("삭제하시겠습니까?")){
				_common.callAjax("/orgz/del.json", _common.utils.collectSendData("#popupWrap"), function(json){
					if(json.result == true){
						$("#popupWrap").dialog("close")
						setTimeout(function(){
							var _param={};
							if(orgNm != "" && orgNm != null) _param["orgNm"] = orgNm;
							callView(offset, _param);
						}, 300);
					}
				});

			}
		}
	});
}

/**
 * 180104
 * 신규 추가 시 입력되있는 값을 제거한다.
 * (수정 버튼 후 신규추가 버튼 클릭시 이전 값이 남아 있음)
 */
function setPopVal(){

	$('#aff_edit_pop_wrap').find('#orgMgrNo').val('');
	$('#aff_edit_pop_wrap').find('#orgNm').val('');
	$('#aff_edit_pop_wrap').find('#orgGbnCd').val('11').prop("selected", true);
	$('#aff_edit_pop_wrap').find('#upMgrNo').val('');
	$('#aff_edit_pop_wrap').find('#telNum').val('');
	$('#aff_edit_pop_wrap').find('#chrgNm').val('');
	$('#aff_edit_pop_wrap').find('#rmark').val('');
}

/* 수정 팝업 */
$(".contentWrapper").find(".mngBtn").click(function(){
	var key = $(this).attr("k");

	_common.callAjax("/orgz/getItem.json", {"orgMgrNo" : key}, function(json){
		if(json.result != null){
			$(".contentWrapper").find("#aff_edit_pop_wrap").find("#saveBtn").attr("mode", "edit");
			$(".contentWrapper").find("#aff_edit_pop_wrap").find("#delBtn").show();

			var _html = '<div class="popupWrapper">'
			_html += $('#aff_edit_pop_wrap').html();
			_html += '</div>'
			$("#popupWrap").dialog("close").html(_html).dialog({
				title : "소속 관리",
				width: 350,
				height: 'auto',
				modal: true,
				position: {
					my: "center top",
					at: "center top",
					of: $("#contentWrap")
				},
				open: function(){
					for(var key in json.result){
						$(".popupWrapper").find("#" + key).val(json.result[key]);
					}
					bindClickEventSaveBtn();
					bindClickEventDelBtn()
				},
				close: function(){
				}
			}).dialog("open");
		}
	}, false);
});

/**
 * 소속 관리 > 신규추가
 */
$(".contentWrapper").find("#addBtn").click(function(){
//	setPopVal();
	$('#aff_edit_pop_wrap').find("#saveBtn").attr("mode", "add");
	$('#aff_edit_pop_wrap').find("#delBtn").hide();

	var _html = '<div class="popupWrapper">'
	_html += $('#aff_edit_pop_wrap').html();
	_html += '</div>'
	$("#popupWrap").dialog("close").html(_html).dialog({
		title : "소속 관리",
		width: 350,
		height: 'auto',
		modal: true,
		position: {
			my: "center top",
			at: "center top",
			of: $("#contentWrap")
		},
		open: function(){



			bindClickEventSaveBtn();
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
	if(val != null) _param["orgNm"] = val;
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
$(".contentWrapper").find(".bpopClose").click(function(){
	var chkNotice = $(".contentWrapper").find('.notice').length;
	if(chkNotice == 0){
		$(".contentWrapper").find(".bpopup").bPopup().close();
	}
});

