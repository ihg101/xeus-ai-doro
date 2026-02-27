$(document).ready(function(){
	$("#saveBtn").click(function(){
		var _param = _common.utils.collectSendData(".custom_eocs_table");
		_common.callAjax("/eocs/updateEocs.json", _param, function (json) {
			if(json.result === "OK"){
				alert("수정되었습니다.");
				GMXMAP.redrawAllVisibleVector();
				console.log($("#eocsData"))
				EOCS.setData();
			}
		});
	});
});