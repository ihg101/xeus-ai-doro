$(document).ready(function(){
	var value = $(".contentWrapper").find("#searchInput").val();
	$(".contentWrapper").find("#searchInput").val(value).focus();
	//$(".contentWrapper").find("#authGrpList").css("height", $(".contentWrapper").find("#authListWrap").height());

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));


	/* 등록된 권한 조회 */
	$(".contentWrapper").find(".grp").click(function(){
		var key = $(this).attr("k");

		$(".contentWrapper").find("input.auth").removeAttr("grp").prop("checked", false);
		_common.callAjax("/auth/getAuthGrpList.json", {"authGrpNo" : key}, function(json){
			if(json.result != null){
				if(json.result.length == 0){
					$(".contentWrapper").find("input.auth").attr("grp", key);
					$(".contentWrapper").find("input.auth, #allAuth").prop("disabled", false);
					$(".contentWrapper").find("#allAuth").prop("checked", false);
				}else{
					var array = json.result[0].authMgrNo.split(",");

					$(".contentWrapper").find("input.auth").attr("grp", key);
					for(var i=0; i<array.length; i++){
						$(".contentWrapper").find("input.auth[k=" + array[i] + "]").prop("checked", true);
					}
					$(".contentWrapper").find("input.auth, #allAuth").prop("disabled", false);
					if($(".contentWrapper").find("input.auth").is(":checked")){
						$(".contentWrapper").find("#allAuth").prop("checked", true);
					}
				}
			}
		}, false);
	});

	/* 권한 수정 */
	$(".contentWrapper").find(".grp").dblclick(function(){
		var key = $(this).attr("k");

		var _html = '';
		_html += '<div class="popupWrapper">'
		_html += '	<div class="bpopup" id="edit_pop_wrap" style="display:initial;">'
		_html += '		<div id="bpop_wrap" class="table_style">'
//		_html += '			<h2 id="bpop_title">권한 그룹 관리</h2>'
		_html += '			<table>'
		_html += '				<tr class="hidden">'
		_html += '					<th class="top">권한 그룹ID</th>'
		_html += '					<td>'
		_html += '						<input type="text" class="sendData" id="authGrpNo" />'
		_html += '					</td>'
		_html += '				</tr>'
		_html += '				<tr class="top">'
		_html += '					<th class="top">권한 그룹명</th>'
		_html += '					<td>'
		_html += '						<input type="text" class="sendData" id="authGrpNm" />'
		_html += '					</td>'
		_html += '				</tr>'
		_html += '			</table>'
		_html += '			<table>'
		_html += '				<tr align="center">'
		_html += '					<td class="lastTd" colspan="2" style="border: 0 !important;">'
		_html += '						<button id="saveBtn" class="btn_style2" tabindex="4">수정</button>'
		_html += '						<button id="delBtn" class="btn_style2" tabindex="4">삭제</button>'
		_html += '					</td>'
		_html += '				</tr>'
		_html += '			</table>'
		_html += '		</div>'
		_html += '	</div>'
		_html += '</div>'


		$("#popupWrap").dialog("close").html(_html).dialog({
			title : "권한 관리",
			width: 370,
			height: 200,
			position: {
				my: "center top",
				at: "center top",
				of: $("#contentWrap").find("#list")
			},
			open: function(){
				_common.callAjax("/auth/getGrpList.json", {"authGrpNo" : key}, function(json){
					if(json.result != null){
//						$(".contentWrapper").find('#edit_pop_wrap').find('#authGrpNm').val('');
						for(var key in json.result[0]){
//							$(".popupWrapper").find('#edit_pop_wrap').find('#authGrpNm').val(json.result[0][key]);
							$(".popupWrapper").find("#edit_pop_wrap").find("#" + key).val(json.result[0][key]);
						}
						$(".popupWrapper").find("#saveBtn").css('width', '32.5%')
						$(".popupWrapper").find("#delBtn").css('width', '32.5%')

						bindClickEventAuthEditBtn();
						bindClickEventAuthDelBtn();
					}
				}, false);
			},
			close: function(){
			}
		}).dialog("open");



	});

	/*
	* 권한관리 > 수정 버튼 클릭
	*/
	function bindClickEventAuthEditBtn(){
		/* 수정 및 저장 */
		$("#edit_pop_wrap").find("#saveBtn").click(function(){
			if(confirm("수정하시겠습니까?")){
				_common.callAjax("/auth/editGrp.json", _common.utils.collectSendData(), function(json){
					if(json.result == true){
						setTimeout(function(){
							_common.callAjax("/auth/getAuthView.do", {"gbn" : gbn}, function(view){
								//$(".contentWrapper").find(".bpopup").remove();
								$("#contentWrap").dialog("close").html(view).dialog("open");
							});
						}, 300);
					}
				});
			}
		});
	}

	/*
	* 권한관리 > 삭제 버튼 클릭
	*/
	function bindClickEventAuthDelBtn(){

		$("#edit_pop_wrap").find("#delBtn").click(function(){

			if(confirm("삭제하시겠습니까?")){
				_common.callAjax("/auth/delGrp.json", _common.utils.collectSendData(), function(json){
					if(json.result == true){
						setTimeout(function(){
							_common.callAjax("/auth/getAuthView.do", {"gbn" : gbn}, function(view){
								//$(".contentWrapper").find(".bpopup").remove();
								$("#contentWrap").dialog("close").html(view).dialog("open");
							});
						}, 300);
					}
				});
			}
		});
	}



	/* 전체선택 클릭 이벤트 */
	$(".contentWrapper").find("#allAuth").click(function(){
		if($(".contentWrapper").find("input.auth").is(":checked")){
			$(".contentWrapper").find("input.auth:checked").each(function(){
				$(this).click();
			});
		}else{
			$(".contentWrapper").find("input.auth").not(":checked").each(function(){
				$(this).click();
			});
		}
	});

	/* 명칭 클릭 이벤트 */
	$(".contentWrapper").find(".authNm").click(function(){
		$(this).prev().find("input").click();
	});

	/* 체크박스 이벤트 */
	$(".contentWrapper").find(".auth").change(function(){
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
		_common.callAjax("/auth/" + mode + ".json", param, function(json){}, true);

		if($(".contentWrapper").find("input.auth").is(":checked")){
			$(".contentWrapper").find("#allAuth").prop("checked", true);
		}else{
			$(".contentWrapper").find("#allAuth").prop("checked", false);
		}
	});

	/* 뒤로가기 */
	$(".contentWrapper").find("#back").click(function(){
		location.href = "../map/view.do";
	});

	/* 신규 팝업 */
	$(".contentWrapper").find("#addBtn").click(function(){

		var authNm=prompt('신규추가 할 권한명을 입력하세요.');

		if(authNm == null){
			return;
		}

		_common.callAjax("/auth/addGrp.json", {authGrpNo : "", authGrpNm : authNm}, function(json){
			if(json.result == true){
				setTimeout(function(){
					_common.callAjax("/auth/getAuthView.do", {"gbn" : gbn}, function(view){
						$("#contentWrap").dialog("close").html(view).dialog("open");
					});
				}, 300);
			}
		});


	});



	/* 검색버튼 */
	$(".contentWrapper").find("#searchBtn").click(function(){
		var val = $(".contentWrapper").find("#searchInput").val();
		var _param ={};
		 _param["authGrpNm"] = val;
		 _param["gbn"] = gbn;
		_common.callAjax("/auth/getAuthView.do", _param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});
	});

	/* 엔터키 이벤트 */
	$(".contentWrapper").find(".keyup").keyup(function(e){
		if(e.which == 13){
			var selector = $(this).attr("for");
			$(selector).click();
		};
	});



});




