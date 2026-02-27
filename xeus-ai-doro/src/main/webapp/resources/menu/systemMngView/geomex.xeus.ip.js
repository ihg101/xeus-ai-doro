$(document).ready(function(){
	var value = $("#searchInput").val();
	$("#searchInput").val(value).focus();

	$(".paging_wrap").paging({
		current	  : 10,
		max  	  : Number($("#max").val()),
		nowOffset : Number($("#offset").val()),
		bindEvent : callView
	});
});

function callView(offset){
	if(offset == null) offset = 0;
	var _param = {"limit" : 10, "offset" : offset};

	var val = $("#searchInput").val();
	if(val != "" && val != null) _param["orgNm"] = val;

	_common.callAjax("/ip/getIpView.do", _param, function(view){
		$("#contentWrap").dialog("close").html(view).dialog("open");
	});
}

/*
 * IP 관리 > 저장  클릭
 */
function bindClickEventSaveBtn(){
	$(".popupWrapper").find("#saveBtn").click(function(){
		var mode = $(this).attr("mode");

		if(confirm("저장하시겠습니까?")){
			_common.callAjax("/ip/" + mode + ".json", _common.utils.collectSendData(), function(json){
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

/**
 * IP 관리 > 삭제
 */
function bindClickEventDelBtn(){
	$(".popupWrapper").find("#delBtn").click(function(){
		if(confirm("삭제하시겠습니까?")){
			_common.callAjax("/ip/del.json", _common.utils.collectSendData(), function(json){
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
/* 수정 팝업 */
$(".mngBtn").click(function(){
	var mgrSeq = $(this).attr("k");

	_common.callAjax("/ip/getItem.json", {"mgrSeq" : mgrSeq}, function(json){
		if(json.result != null){
			var _html = '<div class="popupWrapper">';
			_html += $('#edit_pop_wrap').html();
			_html += '</div>';
			$("#popupWrap").dialog("close").html(_html).dialog({
				title : "ip 관리",
				width: 550,
				height: 350,
				position: {
					my: "center top",
					at: "center top",
					of: $("#contentWrap")
				},
				modal: true,
				open: function(){
					for(var key in json.result){
						$(".popupWrapper").find("#" + key).val(json.result[key]);
					}
					$(".popupWrapper").find("#saveBtn").attr("mode", "edit");
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
$("#addBtn").click(function(){
	var _html = '<div class="popupWrapper">';
	_html += $('#edit_pop_wrap').html();
	_html += '</div>';

	$("#popupWrap").dialog("close").html(_html).dialog({
		title : "ip 관리",
		width: 550,
		height: 350,
		position: {
			my: "center top",
			at: "center top",
			of: $("#contentWrap")
		},
		open: function(){
			$(".popupWrapper").find(".sendData").val("");
			$(".popupWrapper").find("#saveBtn").attr("mode", "add");
			$(".popupWrapper").find("#delBtn").hide();
			bindClickEventSaveBtn();
//			bindClickEventAboutFile();
//			bindClickEventDelBtn()
		},
		close: function(){
		}
	}).dialog("open");

});




/* 검색버튼 */
$("#searchBtn").click(function(){
	callView();
});

/* 엔터키 이벤트 */
$(".keyup").keyup(function(e){
	if(e.which == 13){
		var selector = $(this).attr("for");
		$(selector).click();
	};
});

/* bPopup Close */
$(".bpopClose").click(function(){
	$(".bpopup").bPopup().close();
});