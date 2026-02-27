$(document).ready(function(){
	var value = $(".contentWrapper").find("#searchInput").val();
	$(".contentWrapper").find("#searchInput").val(value).focus();

	/*$(".contentWrapper").find(".downBtn").each(function(){
		if($(this).attr("k") == ""){
			$(this).removeAttr("class", "");
		}
	});*/

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

	$(".contentWrapper").find(".mngSortBtn").each(function(){
		if($(this).attr('id') == sortCol){
			if($(this).text().contains("▲") || $(this).text().contains("▼")) return;
			if(sortTyp === "asc") $(this).text($(this).text() + "▲");
			if(sortTyp === "desc") $(this).text($(this).text() + "▼");
		}
	});

	/*$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));*/
});

function callView(offset, _param){
	var limit =$(".contentWrapper").find('#limit').val();
	/*if(offset == null) offset = 0;
	var _param = {"limit" : 10, "offset" : offset};

	var val = $("#searchInput").val();
	if(val != "" && val != null) _param["userIdOrNm"] = val;*/
	/**
	 * 180523 이은규
	 * 검색기능 수정
	 * 페이지 로드 시 들어온 값으로 페이징 처리한다.
	 */
	if(offset == null) offset = 0;
	if(_param == null){
		var _param = {};
	}
	_param["limit"] = limit;
	_param["offset"] = offset;
	_param["discardChk"] = "Y";
	_param["gbn"] = gbn;

	var userIdOrNm = $(".contentWrapper").find("#searchInput").val();
	if(userIdOrNm != null) _param["userIdOrNm"] = userIdOrNm;
	var authStatCd = $(".contentWrapper").find("#searchAuthStatCd").val();
	if(authStatCd != null && authStatCd != "") _param["authStatCd"] = authStatCd;
	var authGrpNo = $(".contentWrapper").find("#searchAuthGrpNo").val();
	if(authGrpNo != null && authGrpNo != "") _param["authGrpNo"] = authGrpNo;
	var ipChk = $("#contentWrap").find("#ipChk").val();
	if(ipChk != null && ipChk != "") _param["ipChk"] = ipChk;

	if(sortCol!="null" && sortTyp!="null"){
		_param['sortCol'] = sortCol;
		_param['sortTyp'] = sortTyp;
	}
	if(_param["userIdOrNm"] == null){
		if(userIdOrNm != "" && userIdOrNm != null) _param["userIdOrNm"] = userIdOrNm;
	}
	_common.callAjax("/userMng/getUserView.do", _param, function(view){
		$("#contentWrap").dialog("close").html(view).dialog("open");
	});
}
/**
 * 신규추가 > 중복확인 클릭
 */
function bindClickEventIdChk(){
	$(".popupWrapper").find("#idChk").click(function(){
		var id = $(".popupWrapper").find("#userId").val();

		if(id == "" || id == null){
			alert("아이디를 입력하여 주십시오!");
			$(".popupWrapper").find("#userId").focus();
			return false;
		}
		if(id.length < 2){
			alert("아이디는 2자리 이상 입력하여 주십시오!");
			$(".popupWrapper").find("#userId").focus();
			return false;
		}
		_common.callAjax("/user/getItem.json", {"userId" : id}, function(json){
			if(json.result == null){
				alert("사용하셔도 좋습니다.\n나머지 항목을 입력해 주세요.");
				$(".popupWrapper").find("#userNm").focus();
				idChkStat = true;
			}else{
				if(json.result.userId != ""){
					alert("입력하신 계정이 이미 존재합니다.\n다른 계정을 입력하여 주십시오.");
					$(".popupWrapper").find("#userId").focus();
					idChkStat = false;
				}
			}
		});
	});
}

/**
 * 신규추가 > 파일첨부 클릭
 */
function bindClickEventBtnDocUpload(){
	$(".popupWrapper").find("#btnDocUpload").click(function(e) {
		$(".popupWrapper").find("#hiddenForm").find("#uploadImg").click();
	});
}
/**
 * 신규추가 > 초기화
 */
function bindClickEventResetPwdBtn(){
	$(".popupWrapper").find("#resetPwdBtn").click(function(){
		var userId = $(".popupWrapper").find('#userId').val();
		var resetPwd = $(".popupWrapper").find('#resetPwd').val();
		if(_common.utils.isNullAndEmpty(resetPwd)){
			alert("초기화 할 암호를 입력해 주세요.");
			return false;
		}else if(_common.utils.isNullAndEmpty(userId)){
			alert("아이디를 입력해 주세요.");
			return false;
		}
		else{
			if(confirm(userId + " 사용자의 암호를 변경하시겠습니까?")){
				_common.callAjax("/user/editPasswordAdmin.json", { "userId" : userId, "resetPwd" : resetPwd }, function(json){
					if(json.result){
						alert("변경되었습니다.");
						$(".popupWrapper").find('#resetPwd').val("");
					}
				});
			}
		}
	});
}

/**
 * 신규추가 > 파일 첨부
 */
function bindChangeEventUploadImg(){
	$(".popupWrapper").find("#hiddenForm").find("#uploadImg").on("change", function(){
		var nm = $(this).val();
		var mode = $(".popupWrapper").find("#saveBtn").attr("mode");
		if(nm != ""){
			if(confirm("선택하신 파일을 업로드 하시겠습니까?")){
				$(".popupWrapper").find("#hiddenForm").find('#mode').val(mode);
				$(".popupWrapper").find("#hiddenForm").find('#targetUserId').val($("#userId").val());
				_common.formSubmit("/userMng/editPledge.json", $(".popupWrapper").find("#hiddenForm"), function(json){
		        	if(json.result){
		        		alert("업로드 되었습니다.");

		        		var key = $(".popupWrapper").find("#btnDocUpload").attr('k');
		        		var $target = $(".popupWrapper").find("#userList").find("tr[k="+key+"]");

		        		$target.find(".downBtn").text(json.oathFileNm);
		        		$target.find(".downBtn").attr("k", json.oathFileNm);
		        		$target.find(".downBtn").attr("u", key);
						$(".popupWrapper").find("#oathFileNm").val(json.oathFileNm);
						$(".popupWrapper").find("#oathFilePath").val(json.oathFilePath);
		        	}
		        });

			}
		}
	});
}

/**
 *  신규추가 > 계정 등록 및 수정
 */
function bindClickEventSaveBtn(){
	$(".popupWrapper").find("#saveBtn").click(function(){
		var chkNotice = $(".popupWrapper").find('.notice').length;
		if(chkNotice == 0){
			if(confirm("저장하시겠습니까?")){

				var mode = $(".popupWrapper").find("#saveBtn").attr("mode");
				if(mode == "add"){
					if(idChkStat){
						//TODO 신규추가 로직 진행
						var _param = _common.utils.collectSendData(".popupWrapper");

						if($(".popupWrapper").find("#outSign").is(":checked")){
							_param["outSign"] = "Y";
						}else{
							_param["outSign"] = "N";
						}

						if($(".popupWrapper").find("#outStream").is(":checked")){
							_param["outStream"] = "Y";
						}else{
							_param["outStream"] = "N";
						}
						//로그인sms
						if($(".popupWrapper").find("#loginSms").is(":checked")){
							_param["loginSms"] = "Y";
						}else{
							_param["loginSms"] = "N";
						}

						//비밀번호는 따로 받아와야 함.
						var $userPwd = $(".popupWrapper").find("#userPwd");
						var $userPwdChk = $(".popupWrapper").find("#userPwdChk");
						//비밀번호와 확인란의 값이 같은지 확인해야 함.
						if($userPwd.val() != $userPwdChk.val()){
							alert("패스워드가 같지 않습니다.");
							$userPwd.focus();
							return false;
						}
						if($userPwd.val() == ''){
							alert('비밀번호를 입력하여 주십시오.');
							return false;
						}
						_param['userPwd'] = $userPwd.val();
						//계정상태는 승인으로 넣기(12)
						_param['authStatCd'] = '12';
						var date = new Date().getYMDHMS();
						_param["acptDat"] = date;
						_param['authAtmtCnt'] = '0';

						_common.callAjax("/userMng/add.json", _param, function(json){
							if(json.result == true){
								//alert('등록되었습니다.');
								$("#popupWrap").dialog("close");
								setTimeout(function(){
									var _param={};
									if(userIdOrNm != "" && userIdOrNm != null) _param["userIdOrNm"] = userIdOrNm;
									callView(offset, _param);
									//callView();
								}, 300);
							}
						}, false);
					} else{
						alert("계정 중복확인은 필수사항 입니다.");
						$(".popupWrapper").find("#userId").focus();
						return false;
					}
				} else if(mode == "edit"){
					var _param = _common.utils.collectSendData(".popupWrapper");

					if($(".popupWrapper").find("#outSign").is(":checked")){
						_param["outSign"] = "Y";
					}else{
						_param["outSign"] = "N";
					}

					if($(".popupWrapper").find("#outStream").is(":checked")){
						_param["outStream"] = "Y";
					}else{
						_param["outStream"] = "N";
					}

					//로그인sms
					if($(".popupWrapper").find("#loginSms").is(":checked")){
						_param["loginSms"] = "Y";
					}else{
						_param["loginSms"] = "N";
					}

					var def = $(".popupWrapper").find("#authStatCd").attr("authStatCd");
					var cde = _param["authStatCd"];
					if(cde == ""){
						alert('권한그룹을 선택하여 주십시오.');
						return false;
					}

					if(_param["authGrpNo"] == null){
						alert('권한그룹을 선택하여 주십시오.');
						return false;
					}

					if(def != cde){
						var date = new Date().getYMDHMS();
						_param["acptDat"] = "";
						_param["lockDat"] = "";
						_param["exprDat"] = "";
						if(cde == "12"){
							_param["acptDat"] = date;
						}else if(cde == "14"){
							_param["lockDat"] = date;
						}else if(cde == "15"){
							_param["exprDat"] = date;
						}
					}
					_common.callAjax("/userMng/edit.json", _param, function(json){
						if(json.result){
							/**
							 * 180612 이은규
							 * 폐기상태로 바뀌는 경우 SMS 임시저장 리스트에서 해당 계정이 삭제되어야 한다.
							 */
							if(cde == "15"){
								_common.callAjax("/sms/delDiscardId.json", _param, function(json){
									if(!json.result){
									}
								}, false);
							}
							$("#popupWrap").dialog("close");
							setTimeout(function(){
								var _param={};
								if(userIdOrNm != "" && userIdOrNm != null) _param["userIdOrNm"] = userIdOrNm;
								callView(offset, _param);
								//callView();
							}, 300);
						}
					}, false);
				}
			}
		}
	});
}

/* 승인 이벤트 */
$(".contentWrapper").find(".statCngBtn").click(function(){
	var k = $(this).attr("k");
	_common.callAjax("/user/getItem.json", { "userId" : k }, function(json){
		if(json.result != null){
			var _html = '<div class="popupWrapper">';
			_html += $('#user_edit_pop_wrap').html();
			_html += '</div>';

			$("#popupWrap").dialog("close").html(_html).dialog({
				title : "사용자 관리",
				width: 550,
				height: 670,
				modal: true,
				position: {
					my: "center top",
					at: "center top",
					of: $("#contentWrap")
				},
				open: function(){
					$(".popupWrapper").find("input[type=text]").not("#email").prop("readonly", true).css("cursor", "no-drop");
					$(".popupWrapper").find("#authConnIp").parent().parent().hide();
					$(".popupWrapper").find("#btnDocUpload").parent().parent().hide();
					$(".popupWrapper").find("#resetPwd").parent().parent().hide();

					for(var key in json.result){
						/*if(key == "outSign" || key == "outStream" || key == "loginSms"){
							if(json.result[key] == "Y"){
								$(".popupWrapper").find("#" + key).prop("checked", "checked");
							}else{
								$(".popupWrapper").find("#" + key).prop("checked", "");
							}
						}else{*/
							$(".popupWrapper").find("#" + key).val(json.result[key]);
//						}
					}
					$(".popupWrapper").find("#authStatCd").attr("authStatCd", json.result["authStatCd"]);
					$(".popupWrapper").find("#saveBtn").attr("mode", "edit");
					$(".popupWrapper").find("#userId").attr('readonly', 'readonly');
					$(".popupWrapper").find("#loginSms").prop('disabled', 'true');
					$(".popupWrapper").find("#userId").css('width', '95%');
					$(".popupWrapper").find(".add").hide();
					$(".popupWrapper").find(".edit").show();
					$(".popupWrapper").find("#btnDocUpload").attr('k', userId);

					bindClickEventBtnDocUpload();
					bindChangeEventUploadImg();
					bindClickEventResetPwdBtn();
					bindClickEventSaveBtn();
				},
				close: function(){
				}
			}).dialog("open");

			/*var param = JSON.parse(JSON.stringify(json.result));
			param["authStatCd"] = "12";
			param["acptDat"] = new Date().getYMDHMS();
			param["lockDat"] = "";
			param["exprDat"] = "";
			delete param["userPwd"];

			if(confirm("계정 상태를 승인으로 변경하시겠습니까?")){
				_common.callAjax("/userMng/edit.json", param, function(json){
					if(json.result){
						alert("승인 처리가 완료되었습니다.");

						var _param = {};
						if(userIdOrNm != "" && userIdOrNm != null) _param["userIdOrNm"] = userIdOrNm;
						callView(offset, _param);
					}
				}, false);
			}*/
		}
	}, false);
});

/* 계정 수정(수정 팝업창 생성)*/
$(".contentWrapper").find(".mngBtn").click(function(){
	var userId = $(this).attr("k");

	_common.callAjax("/user/getItem.json", {"userId" : userId}, function(json){
		if(json.result != null){
			var _html = '<div class="popupWrapper">';
			_html += $('#user_edit_pop_wrap').html();
			_html += '</div>';

			$("#popupWrap").dialog("close").html(_html).dialog({
				title : "사용자 관리",
				width: 550,
				height: 800,
				modal: true,
				position: {
					my: "center top",
					at: "center top",
					of: $("#contentWrap")
				},
				open: function(){
					for(var key in json.result){
						if(key == "outSign" || key == "outStream" || key == "loginSms"){
							if(json.result[key] == "Y"){
								$(".popupWrapper").find("#" + key).prop("checked", "checked");
							}else{
								$(".popupWrapper").find("#" + key).prop("checked", "");
							}
						}else{
							$(".popupWrapper").find("#" + key).val(json.result[key]);
						}
					}
					$(".popupWrapper").find("#authStatCd").attr("authStatCd", json.result["authStatCd"]);
					$(".popupWrapper").find("#saveBtn").attr("mode", "edit");
					$(".popupWrapper").find("#userId").attr('readonly', 'readonly');
					$(".popupWrapper").find("#userId").css('width', '95%');
					$(".popupWrapper").find(".add").hide();
					$(".popupWrapper").find(".edit").show();
					$(".popupWrapper").find("#btnDocUpload").attr('k', userId);

					bindClickEventBtnDocUpload();
					bindChangeEventUploadImg();
					bindClickEventResetPwdBtn();
					bindClickEventSaveBtn();
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
	_html += $('#user_edit_pop_wrap').html();
	_html += '</div>';
	idChkStat = false;

	$("#popupWrap").dialog("close").html(_html).dialog({
		title : "사용자 관리",
		width: 550,
		height: 825,
		modal: true,
		position: {
			my: "center top",
			at: "center top",
			of: $("#contentWrap")
		},
		open: function(){
			$(".popupWrapper").find("#saveBtn").attr("mode", "add");
			//신규 추가이므로 readonly 속성을 제거
			$(".popupWrapper").find("#userId").removeAttr('readonly');
			$(".popupWrapper").find("#userId").css('width', "60%");
			$(".popupWrapper").find("#userPwdChk").val('');
			$(".popupWrapper").find(".add").show();
			$(".popupWrapper").find(".edit").hide();

			bindClickEventIdChk();
			bindClickEventBtnDocUpload();
			bindChangeEventUploadImg();
			bindClickEventResetPwdBtn();
			bindClickEventSaveBtn();

		},
		close: function(){
		}
	}).dialog("open");
});
/* 파일 다운 */
$(".contentWrapper").find(".downBtn").click(function(){
	var k = $(this).attr("k");
	var u = $(this).attr("u");

	if(k != null && k != "" && u != null && u != ""){
		_common.postForm.submit("/user/getFile.json", { "oathFileNm" : k , "userId" : u });
	}
});

/* 검색버튼 */
$(".contentWrapper").find("#searchBtn").click(function(){
	var limit =$(".contentWrapper").find('#limit').val();
	var _param = {};
	_param['limit'] = limit;
	_param['offset'] = '0';
	var userIdOrNm = $(".contentWrapper").find("#searchInput").val();
	if(userIdOrNm != null) _param["userIdOrNm"] = userIdOrNm;
	var authStatCd = $(".contentWrapper").find("#searchAuthStatCd").val();
	if(authStatCd != null && authStatCd != "") _param["authStatCd"] = authStatCd;
	var authGrpNo = $(".contentWrapper").find("#searchAuthGrpNo").val();
	if(authGrpNo != null && authGrpNo != "") _param["authGrpNo"] = authGrpNo;

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

$(".contentWrapper").find("#outSign, #outStream").change(function(e) {
	if($(this).is(":checked")){
		$(this).val("Y");
	}else{
		$(this).val("N");
	}
});


