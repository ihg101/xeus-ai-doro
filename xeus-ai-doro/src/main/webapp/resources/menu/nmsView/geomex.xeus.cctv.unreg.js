(function(){

	/* 지도에서 위치설정 이벤트 입니다. */
	$("#newregCctvWrap").find("#mapClickBtn").click(function(){
	    $("#newregCctvWrap").find(".selectCancel").show(500);

	    if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("지도를 클릭하여 위치를 설정할 수 있습니다.", 3000);

	    GMXMAP.on("click", Public.NMS.CCTV.Start);
	});
	$("#newregCctvWrap").find(".selectCancel").click(function(){
		if(Public.StopEvent) Public.StopEvent();
	});

	/* 체크박스 ON/OFF 값 변경 이벤트 입니다. */
	$("#newregCctvWrap").find("input[type=checkbox]").each(function(){
		if($(this).is(":checked")){
			$(this).val("Y");
		}else{
			$(this).val("N");
		}
	});
	$("#newregCctvWrap").find("input[type=checkbox]").change(function(){
		$("#newregCctvWrap").find("input[type=checkbox]").each(function(){
			if($(this).is(":checked")){
				$(this).val("Y");
			}else{
				$(this).val("N");
			}
		});
	});

	/* 저장 버튼입니다. */
	$("#newregCctvWrap").find("#saveBtn").click(function(){
		var param = _common.utils.collectSendData("#newregCctvWrap");
		if(_common.utils.isNullAndEmpty(param["ipAddr"])) delete param["ipAddr"];
		if(_common.utils.isNullAndEmpty(param["portNum"])) delete param["portNum"];

		var lng = param["lng"];
	    var lat = param["lat"];
	    if(!_common.utils.isNullAndEmpty(lng) && !_common.utils.isNullAndEmpty(lat)){
	        var epsg = GMXMAP.getView().getProjection().getCode();
	        var mainCenter = ol.proj.transform([lng, lat], "EPSG:4326", epsg);
	        param["lng"] = mainCenter[0];
	        param["lat"] = mainCenter[1];
	    }else{
	    	alert("위치를 지정해 주세요.");
	    	return false;
	    }

	    if (_common.utils.isNullAndEmpty(param["gbnCd"])){
	    	alert("설치목적은 필수사항 입니다.");
	    	return false;
	    } else {
	    	param["gbnNm"] =  $("#newregCctvWrap #gbnCd option[value='"+ param["gbnCd"] + "']").text();
	    }

	    if(confirm("신규추가 하시겠습니까?")){
	    	_common.callAjax("/cctv/addCctv.json", param, function(json) {
	    		if(json.result){
	    			alert("저장되었습니다.");

	    			GMXMAP.reloadLayerData("asset_cctv");

	    			if($("#newregCctvWrap").length > 0) $("#newregCctvWrap").dialog("destroy");
	    			if(!_common.utils.isNullAndEmpty(Public.StopEvent())) Public.StopEvent();

	    			if($("#cctvSyncView").length > 0){
	    				if($("#cctvSyncView").find("#resultTable").find("tr[un=" + param["deviceId"] + "]").length > 0){
	    					$("#cctvSyncView").find("#resultTable").find("tr[un=" + param["deviceId"] + "]").remove();
	    				}
	    			}
	    		}
	    	}, false);
	    }
	});

	/* DatePicker 생성 이벤트입니다. */
	$("#newregCctvWrap").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
        changeYear: true,
        dateFormat: "yymmdd",
        showButtonPanel: true,
        beforeShowDay: $.datepicker.noBefore
	});

})();