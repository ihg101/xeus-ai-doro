var timer = null;
var delta = 300;

$(document).ready(function (){
	//setMaskChk();
	resizeDone();
});

$( window ).on( 'resize', function( ) {
    clearTimeout( timer );
    timer = setTimeout( resizeDone, delta );
} );

function resizeDone() {

	$('#wrap').css('height', $(window).height()-$('#layout-north').height()-70);

}
$(".contentWrapper").find('#btn_sms_pop').click(function(){

	var adminList = $(".contentWrapper").find("#wrap").find("#tviusAdminSmsList").val().split("||");

	$(".contentWrapper").find("#sms_pop_wrap").bPopup({
		appendTo: $(".contentWrapper"),
		onOpen : function() {
			var $target = $(".contentWrapper").find("#sms_pop_wrap").find("#bpop_wrap").find("tbody");
			$target.html('');
			_common.callAjax("/user/getList.json", {authGrpNo: 'G00001'}, function(json) {
				if (json.result){
					var $allTr = $('<tr></tr>');
					var $allTd = $('<td></td>').css('padding', '8px');
					var $allChk = $('<input type="checkbox" class="allChk"/>').width(15).height(15);
					var $allLbl = $('<label>전체선택</label>').css({'top': '-3px', 'margin-left': '7px'})
									.click(function(){ $(this).prev().click(); });
					$allTd.append($allChk).append($allLbl);
					$allTr.append($allTd);
					$target.append($allTr);
					for(var i=0; i<json.result.length; i++){
						var $tr = $("<tr></tr>");
						var $td = $("<td></td>").css('padding', '8px');
						var $chk = $('<input type="checkbox" class="idChk" for="'+json.result[i].userId+'"/>')
									.width(15).height(15);
						if(adminList.indexOf(json.result[i].userId) > -1) $chk.prop('checked', true);
						var $lbl = $('<label>'+json.result[i].userId+'</label>').css({'top': '-3px', 'margin-left': '7px'})
									.click(function(){ $(this).prev().click(); });
						$td.append($chk).append($lbl);
						$tr.append($td);
						$target.append($tr);
					}

					$allChk.click(function(){
						if($(this).is(":checked"))
							$(this).closest("tbody").find(".idChk").prop('checked', true);
						else
							$(this).closest("tbody").find(".idChk").prop('checked', false);

					});
				}
			}, false);


		},
		onClose: function() {}
	}).reposition();
});

$(".contentWrapper").find("#sms_pop_wrap").find("#btnSmsSave").click(function(){

	var idArr = new Array();
	$(".contentWrapper").find("#sms_pop_wrap").find(".idChk").each(function(){
		if($(this).is(":checked")) idArr.push($(this).attr("for"));
	});

	if(idArr.length > 3){
		alert('목록은 최대 3개까지 지정 가능합니다.');
		return false;
	}

	alert("변경되었습니다.\r\n저장버튼을 눌러 변경내용을 저장해야 합니다.");
	$(".contentWrapper").find("#wrap").find("#tviusAdminSmsList").val(idArr.join("||"));
	$(".contentWrapper").find("#sms_pop_wrap").bPopup().close();

});

$(".contentWrapper").find("#sms_pop_wrap").find("#closeEditPop").click(function(){
	$(".contentWrapper").find("#sms_pop_wrap").bPopup().close();
});

$(".contentWrapper").find('#wrap').find('#btn_save').click(function(){

	var _sysParam = _common.utils.collectSendData('#wrap');

	/*var previewAvi =$(".contentWrapper").find('#previewAvi').prop("checked");
	var previewPhoto =$(".contentWrapper").find('#previewPhoto').prop("checked");

	if(previewAvi) _sysParam['previewAvi'] = 'Y';
	else _sysParam['previewAvi'] = 'N';

	if(previewPhoto) _sysParam['previewPhoto'] = 'Y';
	else _sysParam['previewPhoto'] = 'N';*/

	$('#content input[type=checkbox]').each(function(){
		var target = $(this).attr("id");
		var checked = $(this).prop("checked");
		var value = 'N';
		if(checked) value = 'Y';
		_sysParam[target] = value;
	});

	_common.callAjax("/sysMng/editSysParam.json", _sysParam, function(json) {
//		if (json.result){
			alert('* 저장되었습니다.');
//		}
	});

});

$(".contentWrapper").find('#wrap').find('#btn_reset').click(function(){

	/*var _sysParam = {};

	_sysParam['cctvNetDistLimit'] = "0";
	_sysParam['eventDementiaChk'] = "N";
	_sysParam['eventDementiaInterval'] = "10";
	_sysParam['eventPumpChk'] = "N";
	_sysParam['eventPumpInterval'] = "5";
	_sysParam['eventPumpWarnRainday'] = "500";
	_sysParam['eventPumpWarnRainhour'] = "100";
	_sysParam['eventSmsCallbacknum'] = "0221556098";
	_sysParam['nmsCpuWarnValue'] = "80";
	_sysParam['nmsLoraApChk'] = "N";
	_sysParam['nmsLoraCctvChk'] = "N";
	_sysParam['nmsLoraStatusInterval'] = "30";
	_sysParam['nmsMemWarnValue'] = "80";
	_sysParam['nmsRepChk'] = "N";
	_sysParam['nmsRepInterval'] = "60";
	_sysParam['nmsStatusChk'] = "N";
	_sysParam['nmsStatusInterval'] = "30";
	_sysParam['sysLoginLockCnt'] = "5";
	_sysParam['tviusAviPlayCnt'] = "20";
	_sysParam['tviusAviPlayDat'] = "30";
	_sysParam['tviusAviPlayTime'] = "1";
	_sysParam['tviusEviPlayCnt'] = "60";
	_sysParam['tviusFileDownCnt'] = "5";
	_sysParam['tviusPreviewAvi'] = "Y";
	_sysParam['tviusPreviewPhoto'] = "Y";
	_sysParam['tviusRenewPlayCnt'] = "40";
	_sysParam['tviusRenewPlayDat'] = "50";
	_sysParam['tviusRqstLockCnt'] = "10";

	confirm("환경설정 값을 초기화 하시곘습니까?", function(){
		_common.callAjax("/sysMng/editSysParam.json", _sysParam, function(json) {
			if (json.result){
				_common.callAjax("/sysMng/getEnvSetView.do", null, function(view){
					$(".contentWrapper").find("#overlay-west-contents").html(view);
				});
			}
		});
	}, function(){
		$(this).val("");
	});*/

	//181208 그냥 입력 전 값으로 되돌리는걸로 이해시키자.
	_common.callAjax("/sysMng/getEnvSetView.do", null, function(view){
		$(".contentWrapper").find("#overlay-west-contents").html(view);
	});

});

/*$('#wrap').find('#maskingYn').change(function(){
	setMaskChk();
});

function setMaskChk(){

	var maskingYn =$('#maskingYn').prop("checked");

	if(maskingYn) $('#wrap').find('.mask_chk').show();
	else $('#wrap').find('.mask_chk').hide();
}*/