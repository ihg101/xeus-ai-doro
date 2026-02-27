(function(){

	/* 삭제이벤트 입니다. */
	$("#infraMngWrap").find("#delBtn").click(function(){
		var v = $(this).parent().attr("k");
		if(confirm("삭제하시겠습니까?")){
			_common.callAjax("/nms/delInfra.json", {k : v}, function(json) {
				if(json.result){
					alert("삭제되었습니다.");
					$("#infraMngWrap").dialog("close");
					/*_common.callAjax("/cctv/getCctvMngView.do", null, function(view) {
						$("#newregInfraWrap").find("#center-overlay-east").html(view);
					});*/

					GMXMAP.reloadLayerData("asset_infra");
					/*GMXMAP.reloadLayerData("asset_infra_cctv");
					GMXMAP.reloadLayerData("asset_infra_wifi");
					GMXMAP.reloadLayerData("asset_infra_lora");*/

					if(("StopEvent" in Public) && (typeof Public.StopEvent === "function")) Public.StopEvent();
				}
			}, false);
		}
	});

	/* 내용 저장 버튼 이벤트 입니다. */
	$("#infraMngWrap").find("#saveBtn").click(function(){
		if(confirm("저장하시겠습니까?")){
			var param = _common.utils.collectSendData("#infraMngWrap #regTable");
			param["statChkYn"] = $("#infraMngWrap").find("#statChkYn").is(":checked") ? "Y" : "N";
			param["useYn"] = $("#infraMngWrap").find("#useYn").is(":checked") ? "Y" : "N";

			var lng = $("#infraMngWrap").find("#regTable #lng").val();
			var lat = $("#infraMngWrap").find("#regTable #lat").val();
			if(!_common.utils.isNullAndEmpty(lng) && !_common.utils.isNullAndEmpty(lat)){
				var epsg = GMXMAP.getView().getProjection().getCode();
				//var mainCenter = ol.proj.transform([lng, lat], 'EPSG:4326', epsg);
				var mainCenter = ol.proj.transform([lng, lat], 'EPSG:4326', epsg);
				param["lng"] = mainCenter[0];
				param["lat"] = mainCenter[1];
			}

			_common.callAjax("/nms/editInfra.json", param, function(json){
				if(json.result){
					alert("저장되었습니다.");

					$("#infraMngWrap").dialog("close");

					GMXMAP.reloadLayerData("asset_infra");
					/*GMXMAP.reloadLayerData("asset_infra_cctv");
					GMXMAP.reloadLayerData("asset_infra_wifi");
					GMXMAP.reloadLayerData("asset_infra_lora");*/

					if(("StopEvent" in Public) && (typeof Public.StopEvent === "function")) Public.StopEvent();
				}
			}, false);
		}
	});

	/* 지도에서 위치설정 이벤트 입니다. */
	$("#infraMngWrap").find("#mapClickBtn").click(function(){
	    $("#infraMngWrap").find(".selectCancel").show(500);

	    if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("지도를 클릭하여 위치를 설정할 수 있습니다.", 3000);

	    GMXMAP.on("click", Public.NMS.Infra.Start);
	});
	$("#infraMngWrap").find(".selectCancel").click(function(){
		if(("StopEvent" in Public) && (typeof Public.StopEvent === "function")) Public.StopEvent();
	});

	/* DatePicker 생성 이벤트입니다. */
	$("#infraMngWrap").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "yymmdd",
		showButtonPanel: true,
		beforeShowDay: $.datepicker.noBefore
	});

})();