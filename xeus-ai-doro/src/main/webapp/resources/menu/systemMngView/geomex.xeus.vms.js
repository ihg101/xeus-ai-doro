$(document).ready(function(){
	var value = $(".contentWrapper").find("#searchInput").val();
	$(".contentWrapper").find("#searchInput").val(value).focus();

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

function callView(offset){
	var limit =$(".contentWrapper").find('#limit').val();
	if(offset == null) offset = 0;
	var _param = {"limit" : limit, "offset" : offset};
	_param['gbn'] = gbn;

	var val = $(".contentWrapper").find("#searchInput").val();
	if(val != "" && val != null) _param["vmsNm"] = val;
	if(sortCol!="null" && sortTyp!="null"){
		_param['sortCol'] = sortCol;
		_param['sortTyp'] = sortTyp;
	}
	_common.callAjax("/vms/getVmsView.do", _param, function(view){
		$("#contentWrap").dialog("close").html(view).dialog("open");
	});
}


/**
 * VMS 관리 > 저장 클릭
 */
function bindClickEventSaveBtn(){
	$(".popupWrapper").find("#saveBtn").click(function(){
		var mode = $(this).attr("mode");

		if(confirm("저장하시겠습니까?")){
			_common.callAjax("/vms/" + mode + ".json", _common.utils.collectSendData(".popupWrapper"), function(json){
				if(json.result == true){
					$("#popupWrap").dialog("close");
					setTimeout(function(){
						callView();
					}, 300);
				}
			});
		}
	});
}


/**
 * VMS 관리 > 삭제 클릭
 */
function bindClickEventDelBtn(){
	$(".popupWrapper").find("#delBtn").click(function(){
		if(confirm("삭제하시겠습니까?")){
			_common.callAjax("/vms/del.json", _common.utils.collectSendData(".popupWrapper"), function(json){
				if(json.result == true){
					$("#popupWrap").dialog("close")
					setTimeout(function(){
						callView();
					}, 300);
				}
			});

		}
	});
}
/* 수정 팝업 */
$(".contentWrapper").find(".mngBtn").click(function(){
	var mgrSeq = $(this).attr("k");

	_common.callAjax("/vms/getItem.json", {"mgrNo" : mgrSeq}, function(json){
		if(json.result != null){
			var _html = '<div class="popupWrapper">';
			_html += $('#vms_edit_pop_wrap').html();
			_html += '</div>';

			$("#popupWrap").dialog("close").html(_html).dialog({
				title : "VMS 관리",
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
					}
					$(".popupWrapper").find("#saveBtn").attr("mode", "edit");
					$(".popupWrapper").find('#delBtn').show();
					bindClickEventSaveBtn();
					bindClickEventDelBtn();
				},
				close: function(){
				}
			}).dialog("open");
		}
	}, false);
});

/* 신규 팝업 */
$(".contentWrapper").find("#addBtn").click(function(){
	var _html = '<div class="popupWrapper">';
	_html += $('#vms_edit_pop_wrap').html();
	_html += '</div>';

	$("#popupWrap").dialog("close").html(_html).dialog({
		title : "VMS 관리",
		width: 550,
		height: 'auto',
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

/* 검색버튼 */
$(".contentWrapper").find("#searchBtn").click(function(){
	callView();
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
	$(".contentWrapper").find(".bpopup").bPopup().close();
});