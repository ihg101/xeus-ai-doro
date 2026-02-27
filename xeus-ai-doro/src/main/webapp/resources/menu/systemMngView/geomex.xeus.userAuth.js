$(document).ready(function(){
	var value = $("#contentWrap").find("#searchInput").val();
	$("#contentWrap").find("#searchInput").val(value).focus();
	//$("#contentWrap").find("#authGrpList").css("height", $("#contentWrap").find("#authListWrap").height());

	$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
		_title : function(titleBar) {
			titleBar.html(this.options.title || '&#160;');
		}
	}));

	showAdminSMSList(adminSmsList, "export");

	/*
	 *  권한 그룹 목록 클릭 시
	 */
	$("#contentWrap").find(".grp").click(function(){
		var key = $(this).attr("k");
		$('#lyrGrpList option:selected').prop('selected',false);
//		$('#list > tbody > tr > td:nth-child(3)').html('');

		$("#contentWrap").find("input.auth").removeAttr("grp").prop("checked", false);

		_common.callAjax("/user/getList.json", {"authGrpNo" : key}, function(json){
			var result = json.result;
//			var adminList = $("#contentWrap").find("#tviusAdminSmsList").val().split("||");

			var $html=$('<div class="customScroll" style="height: calc(100% - 1px); overflow: auto; text-align:initial; position: relative;"><ul class="userList lyrSortable" id="leftLayerList" style="float:left;"></div>');

			if(result != undefined){
				for(var i=0; i<result.length; i++){
					var userId = result[i].userId;
					var userNm = result[i].userNm;
					var authGrpNo = result[i].authGrpNo;

					var $li=$('<li></li>');

					var $chk = $('<input id="'+userNm+'" class="smsCheckBox checkbox" type="checkbox" style="margin-right:10px;"><label style="margin: 0 5px" class="checkboxC" for="'+userNm+'"></label>');

					if(adminSmsList.indexOf(json.result[i].userId) > -1) $chk.prop('checked', true);

					$li.append($chk);
					$li.append('<label v="'+authGrpNo+'" k="'+userId+'" class="leftText lyr" for="'+userNm+'">' + userId + ' (' + userNm + ')' + '</label>');

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
	 *  사용자 목록 체크 시
	 */
	function bindUserCheckEvent(){
		$("#contentWrap").find(".smsCheckBox").click(function(){
			var smsList = new Array();

			$("#contentWrap").find(".smsCheckBox").each(function(){
				var userId = $(this).parent().find(".leftText").attr('k');

				if($(this).prop('checked')){
					smsList.push(userId);
				}
			});

			smsList.sort();

			var str = "";

			for(var i=0; i<smsList.length; i++){
			    if(i == smsList.length-1){
			        str += smsList[i]
			    }else{
			        str += smsList[i] + "||";
			    }
			}

			var param = {};

			param["tviusAdminSmsList"] = str;

			_common.callAjax("/sysMng/editNoValidSysParam.json", param, function(json){
				if(json){
					showAdminSMSList(smsList);
				} else{
					alert("SMS 발송목록 등록에 실패했습니다.");
				}
			}, false);
		});
	}

	/*
	 * 반출 SMS 발송목록에 표출
	 */
	function showAdminSMSList(adminSmsList){
		var str = "";

		for(var i = 0; i < adminSmsList.length; i++){
			str += adminSmsList[i]+"<br>";
		}

		$("#list > tbody > tr > td:nth-child(3) > div").html("");
		$("#list > tbody > tr > td:nth-child(3) > div").html(str);
	}
});
