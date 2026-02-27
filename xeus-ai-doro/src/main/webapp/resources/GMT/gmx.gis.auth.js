

$(document).ready(function(){
	var value = $("#authManageWrap").find("#searchInput").val();
	$("#authManageWrap").find("#searchInput").val(value).focus();
	//$("#authManageWrap").find("#authGrpList").css("height", $("#authManageWrap").find("#authListWrap").height());

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));
});


///*
// * 권한관리 > 신규추가 버튼 클릭
// */
//function bindClickEventSaveBtn(){
//	/* 수정 및 저장 */
//	$(".popupWrapper").find("#saveBtn").click(function(){
//		var mode = $(this).attr("mode");
//		if(mode == "add") mode = "addGrp";
//		if(mode == "edit") mode = "editGrp";
//
//		if(confirm("저장하시겠습니까?")){
//			_common.callAjax("/GMT_auth/" + mode + ".json", _common.utils.collectSendData(), function(json){
//				if(json.result == true){
//					setTimeout(function(){
//						_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
//							$("#popupWrap").dialog("close");
//							$("#authManageWrap").html(view);
//						});
//					}, 300);
//				}
//			});
//		}
//	});
//}

/* 등록된 권한 조회 */
$("#authManageWrap").find(".grp").click(function(){
	var key = $(this).attr("k");

	$("#authManageWrap").find("input.auth").removeAttr("grp").prop("checked", false);
	_common.callAjax("/GMT_auth/getAuthGrpList.json", {"authGrpNo" : key}, function(json){
		if(json.result != null){
			if(json.result.length == 0){
				$("#authManageWrap").find("input.auth").attr("grp", key);
				$("#authManageWrap").find("input.auth, #allAuth").prop("disabled", false);
				$("#authManageWrap").find("#allAuth").prop("checked", false);
			}else{
				var array = json.result[0].authMgrNo.split(",");

				$("#authManageWrap").find("input.auth").attr("grp", key);
				for(var i=0; i<array.length; i++){
					$("#authManageWrap").find("input.auth[k=" + array[i] + "]").prop("checked", true);
				}
				$("#authManageWrap").find("input.auth, #allAuth").prop("disabled", false);
				if($("#authManageWrap").find("input.auth").is(":checked")){
					$("#authManageWrap").find("#allAuth").prop("checked", true);
				}
			}
		}
	}, false);
});

/* 권한 수정 */
$("#authManageWrap").find(".grp").off("dblclick").dblclick(function(){
	var key = $(this).attr("k");

	_common.callAjax("/GMT_auth/getGrpList.json", {"authGrpNo" : key}, function(json){
		if(json.result != null){
			$("#authManageWrap").find('#edit_pop_wrap').find('#authGrpNm').val('');
			for(var key in json.result[0]){
				$("#authManageWrap").find("#edit_pop_wrap").find("#" + key).val(json.result[0][key]);
			}
			$("#authManageWrap").find("#edit_pop_wrap").bPopup({appendTo: $("#authManageWrap")});
			$("#authManageWrap").find(".bpopup").find("#saveBtn").attr("mode", "edit");
			$("#authManageWrap").find("#saveBtn").css('width', '32.5%')
			$("#authManageWrap").find("#closeEditPop").css('width', '32.5%')
			$("#authManageWrap").find("#delBtn").css('width', '32.5%')
			$("#authManageWrap").find("#delBtn").show();
		}
	}, false);
});

/* 그룹 삭제 */
$("#authManageWrap").find("#delBtn").click(function(){
	confirm("그룹을 삭제하시겠습니까?", function(){
		_common.callAjax("/GMT_auth/delGrp.json", _common.utils.collectSendData(), function(json){
			if(json.result == true){
				$("#authManageWrap").find("#edit_pop_wrap").bPopup().close();
				$("#authManageWrap").find("#edit_pop_wrap").remove();
				setTimeout(function(){
					_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
						//$("#authManageWrap").find(".bpopup").remove();
						$("#authManageWrap").find("#overlay-west-contents").html(view);
					});
				}, 300);
			}
		}, false);
	});
});

/* 전체선택 클릭 이벤트 */
$("#authManageWrap").find("#allAuth").click(function(){
	if($("#authManageWrap").find("input.auth").is(":checked")){
		$("#authManageWrap").find("input.auth:checked").each(function(){
			$(this).click();
		});
	}else{
		$("#authManageWrap").find("input.auth").not(":checked").each(function(){
			$(this).click();
		});
	}
});

/* 명칭 클릭 이벤트 */
$("#authManageWrap").find(".authNm").click(function(){
	$(this).prev().find("input").click();
});

/* 체크박스 이벤트 */
$("#authManageWrap").find(".auth").change(function(){
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

	if($("#authManageWrap").find("input.auth").is(":checked")){
		$("#authManageWrap").find("#allAuth").prop("checked", true);
	}else{
		$("#authManageWrap").find("#allAuth").prop("checked", false);
	}
});

/* 뒤로가기 */
$("#authManageWrap").find("#back").click(function(){
	location.href = "../map/view.do";
});

/* 신규 팝업 */
$("#authManageWrap").find("#addBtn").click(function(){
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
//	_html+='	                    <input type="text" class="sendData" id="authGrpNm" />'
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
//		title : "그룹 관리",
//		width: 350,
//		height: 230,
//		position: {
//			my: "center top",
//			at: "center top",
//			of: $("#authManageWrap")
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
	var authGrpNm = prompt("신규추가 할 권한이름을 입력하세요.");

	if(authGrpNm == null){
		return;
	}

	_common.callAjax("/GMT_auth/addGrp.json", {authGrpNm : authGrpNm}, function(json){
		if(json.result == true){
			setTimeout(function(){
				_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
//					$("#popupWrap").dialog("close");
					$("#authManageWrap").html(view);
				});
			}, 300);
		}
	});

});

/* 수정 및 저장 */
$("#authManageWrap").find("#saveBtn").click(function(){
	var mode = $(this).attr("mode");
	if(mode == "add") mode = "addGrp";
	if(mode == "edit") mode = "editGrp";

	xeusCustom.customConfirm("저장하시겠습니까?", function(){
		_common.callAjax("/GMT_auth/" + mode + ".json", _common.utils.collectSendData(), function(json){
			if(json.result == true){
				$("#authManageWrap").find("#edit_pop_wrap").bPopup().close();
				$("#authManageWrap").find("#edit_pop_wrap").remove();
				setTimeout(function(){
					_common.callAjax("/GMT_auth/getAuthView.do", {"gbn" : gbn}, function(view){
						//$("#authManageWrap").find(".bpopup").remove();
						$("#authManageWrap").html(view);
					});
				}, 300);
			}
		});
	});
});


/* 취소*/
$("#authManageWrap").find("#closeEditPop").click(function(){
	$("#authManageWrap").find("#edit_pop_wrap").bPopup().close();
//	$("#authManageWrap").find("#edit_pop_wrap").remove();
});


/* 검색버튼 */
$("#authManageWrap").find("#searchBtn").click(function(){
	var val = $("#authManageWrap").find("#searchInput").val();
	var _param ={};
	 _param["authGrpNm"] = val;
	 _param["gbn"] = gbn;
	_common.callAjax("/GMT_auth/getAuthView.do", _param, function(view){
		//$("#authManageWrap").find(".bpopup").remove();
		$("#authManageWrap").html(view);
	});
	//_common.postForm.submit("/GMT_auth/getAuthView.do", { "authGrpNm" : val });
});

/* 엔터키 이벤트 */
$("#authManageWrap").find(".keyup").keyup(function(e){
	if(e.which == 13){
		var selector = $(this).attr("for");
		$(selector).click();
	};
});

/* bPopup Close */
/*$("#authManageWrap").find(".bpopClose").click(function(){
	$("#authManageWrap").find(".bpopup").bPopup().close();
});*/