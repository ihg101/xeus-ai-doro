(function(){

	/* 등록 버튼 이벤트 입니다. */
	$("#newregInfraWrap").find("#addBtn, #saveBtn").click(function(){
		var param = _common.utils.collectSendData("#newregInfraWrap #regTable");
		param["statChkYn"] = $("#newregInfraWrap").find("#statChkYn").is(":checked") ? "Y" : "N";
		param["useYn"] = $("#newregInfraWrap").find("#useYn").is(":checked") ? "Y" : "N";
		param["ipAddr"] = param["ipAddr"].trim();

		var lng = $("#newregInfraWrap").find("#regTable #lng").val();
		var lat = $("#newregInfraWrap").find("#regTable #lat").val();
		if(!_common.utils.isNullAndEmpty(lng) && !_common.utils.isNullAndEmpty(lat)){
			var epsg = GMXMAP.getView().getProjection().getCode();
			//var mainCenter = ol.proj.transform([lng, lat], 'EPSG:4326', epsg);
			var mainCenter = ol.proj.transform([lng, lat], 'EPSG:4326', epsg);
			param["lng"] = mainCenter[0];
			param["lat"] = mainCenter[1];
		}

		var mode = "edit";
		if(_common.utils.isNullAndEmpty(param["mgrNo"])){
			mode = "add";
			delete param["mgrNo"];
		}

		if(confirm("입려하신 내용을 저장하시겠습니까?")){
			_common.callAjax("/nms/addInfra.json", param, function(json){
				if(json.result){
					$("#newregInfraWrap").dialog("close");

					var k = json.mgrNo;

					_common.callAjax("/nms/getInfraMngView.do", {mgrNo : k}, function(view){
						if($("#infraMngWrap").length === 0){
							var $infraMngWrap = $("<div>").attr("title", "산업용 스위치 관리").attr("id", "infraMngWrap");

							$infraMngWrap.html($("<div>").addClass("table_style").addClass("customScroll").html(view)).dialog({
								width: 650,
								height: $("#body").height(),
								position: {
									my: "left top",
									at: "left top",
									of: $("#body")
								},
								open: function(){

								},
								close: function(){
									$infraMngWrap.dialog("destroy");
								}
							}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
						}
					}, false);

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
	$("#newregInfraWrap").find("#mapClickBtn").click(function(){
	    $("#newregInfraWrap").find(".selectCancel").show(500);

	    if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("지도를 클릭하여 위치를 설정할 수 있습니다.", 3000);

	    GMXMAP.on("click", Public.NMS.Infra.Start);
	});
	$("#newregInfraWrap").find(".selectCancel").click(function(){
		if(("StopEvent" in Public) && (typeof Public.StopEvent === "function")) Public.StopEvent();
	});

	/* DatePicker 생성 이벤트입니다. */
	$("#newregInfraWrap").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "yymmdd",
		showButtonPanel: true,
		beforeShowDay: $.datepicker.noBefore
	});

})();