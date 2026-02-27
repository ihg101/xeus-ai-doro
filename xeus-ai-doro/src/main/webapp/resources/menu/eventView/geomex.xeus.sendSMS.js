


$(document).ready(function(){
	var value = $(".contentWrapper").find("#searchInput").val();
	$(".contentWrapper").find("#searchInput").val(value).focus();
	//$(".contentWrapper").find("#authGrpList").css("height", $(".contentWrapper").find("#authListWrap").height());

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));


//	showsendSmsList(sendSmsList);



	/*
	 *  권한 그룹 목록 클릭 시
	 */
	$(".contentWrapper").find(".grp").click(function(){


		var key = $(this).attr("k");
		$('#lyrGrpList option:selected').prop('selected',false);
//		$('#list > tbody > tr > td:nth-child(3)').html('');

		$(".contentWrapper").find("input.auth").removeAttr("grp").prop("checked", false);

		_common.callAjax("/user/getList.json", {"authGrpNo" : key, "discardChk" : 'Y'}, function(json){
			var result = json.result;


//			var adminList = $(".contentWrapper").find("#tviussendSmsList").val().split("||");

			var $html=$('<div class="customScroll" style="height: calc(100% - 1px); overflow: auto; text-align:initial"><ul class="userList lyrSortable" id="leftLayerList" style="float:left;"></div>');

			if(result!=undefined){
				for(var i=0; i<result.length; i++){
					var userId = result[i].userId;
					var userNm = result[i].userNm;
					var authGrpNo = result[i].authGrpNo;
					var mobileNum = result[i].mobileNum;

					var str = userId+"||"+userNm+"||"+mobileNum+"||"+authGrpNo;


					var $li=$('<li></li>');

					var $chk = $('<input id="'+userId+'" class="smsCheckBox checkbox" type="checkbox" style="margin-right:10px;">');

					if(sendSmsList.indexOf(str) > -1) $chk.prop('checked', true);

					$li.append($chk);
					$li.append('<label for="'+userId+'" userId="'+userId+'" userNm="'+userNm+'" authGrpNo="'+authGrpNo+'" mobileNum="'+mobileNum+'" class="leftText lyr checkboxC"></label>'+userId);

					$html.append($li);
				}
			}

			$('#list > tbody > tr > td:nth-child(2)').html('');

			if(result.length > 0){
				$('#list > tbody > tr > td:nth-child(2)').append($html);
			}
			else{
				$('#list > tbody > tr > td:nth-child(2)').append('<p>해당 그룹 사용자 없음</p>');
			}

			bindUserCheckEvent();

		}, false);
	});

	/*
	 *  내용 입렫 버튼 클릭 시
	 */
	$(".contentWrapper").find("#writeCmBtn").click(function(){


		if(sendSmsList.length == 0){
			alert("먼저 SMS 전송할 사용자를 체크해주세요.");
			return;
		}

		var str = '';
		str += ' <div class="popupWrapper">';
		str += ' <div id="drm_pop">';
		str += '	<div class="searchWrapper" style="margin-left: 10px; padding-bottom:0px;">';
		str += '		<div>';
		str += '			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="aviMgrSeq" name="aviMgrSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="fileSeq" name="fileSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="renewTyp" name="renewTyp" value="">';
		str += '		</div>';
//					str += '		<p class="searchTitle drmTitle"></p>';
		//str += '		<div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div>';
		str += '		<table cellspacing="0" width="100%">';
		str += '			<colgroup>';
		str += '				<col width="80" />';
		str += '				<col width="" />';
		str += '				<col width="100" />';
		str += '			</colgroup>';
//					str += '			<tr>';
//					str += '				<th>';
//					str += '					<label>신청사유</label>';
//					str += '				</th>';
//					str += '				<td colspan="2"></td>';
//					str += '			</tr>';
		str += '			<tr>';
		str += '				<td colspan="3">';
		str += '					<div class="inBox">';
		str += '						<textarea class="sendData" id="smsCm" name="reqstResn" style="width: 96%; height: 350px;"></textarea>';
		str += '					</div>';
		str += '				</td>';
		str += '			</tr>';
		str += '		</table>';
		str += '		<div class="btnDiv" class="padding-bottom:5px;">';
		str += '			<button id="sendSMSBtn" class="btn_style">전송</button>';
//					str += '			<button id="btn_close" class="grayBtn">취소</button>';
		str += '		</div>';
		str += '	</div>';
		str += ' </div>';
		str += ' </div>';

		$("#popupWrap").dialog("close").html(str).dialog({
   			title: 'SMS 내용',
   			width: 520,
   			height: 520,
   			position: {
   				my: "center center",
   				at: "center center",
   				of: $(".contentWrapper")
   			},
   			modal: true,
   			open: function(){
   				/**
   				 * 전송 버튼 클릭 시
   				 */
   				$(".popupWrapper").find("#sendSMSBtn").click(function(){

					var param = {};
					param["title"] = "이벤트 상황 전파";
					param["msg"] = $(".popupWrapper").find('#smsCm').val()

					var rcvId = "";
					var rcvNm = "";
					var rcvPhone = "";

					for(var i=0; i<sendSmsList.length; i++){
						var userInfo = sendSmsList[i].split("||");
						rcvId += userInfo[0] + ",";
						rcvNm += userInfo[1] + ",";
						rcvPhone += userInfo[2] + ",";
					}

					rcvId = rcvId.substring(0,rcvId.length-1);
					rcvNm = rcvNm.substring(0,rcvNm.length-1);
					rcvPhone = rcvPhone.substring(0,rcvPhone.length-1);

					param["rcvId"] = rcvId;
					param["rcvNm"] = rcvNm;
					param["rcvPhone"] = rcvPhone;


					_common.callAjax("/sysMng/sendSms.json", param, function(json){
						if(json.result){
							alert(rcvId+"에게 발송되었습니다.");

							sendSmsList = [];
							showsendSmsList(sendSmsList);
							$('.smsCheckBox').prop('checked', false)

							$("#popupWrap").dialog("close");
						}
					}, false);


				});


   			},
   			close: function(){

   			}
   		}).dialog("open");

	});

	/*
	 *  사용자 목록 체크 시
	 */
	function bindUserCheckEvent(){

		$(".contentWrapper").find(".smsCheckBox").click(function(){
			var userId = $(this).parent().find("label").attr('userId');
			var userNm = $(this).parent().find("label").attr('userNm');
			var authGrpNo = $(this).parent().find("label").attr('authGrpNo');
			var mobileNum = $(this).parent().find("label").attr('mobileNum');

			var str = userId+"||"+userNm+"||"+mobileNum+"||"+authGrpNo;

			if($(this).prop('checked')){
				sendSmsList.push(str);
			}else{
				var index = sendSmsList.indexOf(str);
				if(index > -1){
					sendSmsList.splice(index,1);
				}
			}

			sendSmsList.sort();

			showsendSmsList(sendSmsList);

//			var str = "";
//			for(var i=0; i<sendSmsList.length; i++){
//			    if(i==sendSmsList.length-1){
//			        str += sendSmsList[i]
//			    }else{
//			        str += sendSmsList[i]+"||";
//			    }
//			}
//
//			_common.callAjax("/sysMng/editNoValidSysParam.json", {"tviussendSmsList" : str}, function(json){
//				if(json){
//					showsendSmsList(sendSmsList);
//				}
//				else{
//					alert("SMS 발송목록 등록에 실패했습니다.");
//				}
//			}, false);


		});
	}

	/*
	 * 반출 SMS 발송목록에 표출
	 */
	function showsendSmsList(sendSmsList){
//		var adminList = $(".contentWrapper").find("#tviussendSmsList").val().split("||");

		$("#list > tbody > tr > td:nth-child(3) > div").html("");

		var str = "";
		for(var i = 0; i < sendSmsList.length; i++){
//			str += sendSmsList[i]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			str += sendSmsList[i].split("||")[0]+"<br>";
//			if(i % 5 == 0 && i != 0){
//				str +="<br>";
//			}
		}
		$("#list > tbody > tr > td:nth-child(3) > div").html(str);

	}




});

