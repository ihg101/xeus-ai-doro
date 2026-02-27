(function(){

	/* 지도에서 위치설정 이벤트 입니다. */
	$("#cctvMngWrap").find("#mapClickBtn").click(function(){
		$("#newregCctvWrap").find(".selectCancel").show(500);

		if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("지도를 클릭하여 위치를 설정할 수 있습니다.", 3000);

	    GMXMAP.on("click", Public.NMS.CCTV.Start);
	});
	$("#cctvMngWrap").find(".selectCancel").click(function(){
		if(Public.StopEvent) Public.StopEvent();
	});

	/* 체크박스 ON/OFF 값 변경 이벤트 입니다. */
	$("#cctvMngWrap").find("input[type=checkbox]").each(function(){
		if($(this).is(":checked")){
			$(this).val("Y");
		}else{
			$(this).val("N");
		}
	});
	$("#cctvMngWrap").find("input[type=checkbox]").change(function(){
		$("#cctvMngWrap").find("input[type=checkbox]").each(function(){
			if($(this).is(":checked")){
				$(this).val("Y");
			}else{
				$(this).val("N");
			}
		});
	});

	/* 이미지 새탭으로 보기 이벤트 입니다. */
	$("#cctvMngWrap").find("#imgWrapper").find(".imgs").click(function(){
		var param = {"mgrSeq" : $(this).attr("k")};
		_common.postForm.open("/image/getImage.do", param);
	});

	/* 이미지 삭제 이벤트 입니다. */
	$("#cctvMngWrap").find("#imgWrapper").find(".close").click(function(){
		var $span = $(this).parent();
		var param = {"mgrSeq" : $(this).attr("k")};
	    confirm("이미지를 삭제하시겠습니까?", function(){
	    	_common.callAjax("/image/del.json", param, function(json){
	            if(json.result){
	                $span.remove();
	            }
	        });
	    });
	});

	/* 사진 추가 버튼 이벤트 입니다. */
	$("#cctvMngWrap").find("#uploadBtn").click(function(){
		$("#cctvMngWrap").find("#hiddenForm").find("#uploadImg").click();
	});

	/* 상위 "사진 추가" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
	$("#cctvMngWrap").find("#hiddenForm").find("#uploadImg").on("change", function(){
		var nm = $(this).val();
		var k = $(this).parent().find("#k").val();
		if(nm != ""){
			confirm("선택하신 파일을 업로드 하시겠습니까?", function(){
				$("#cctvMngWrap").find("#hiddenForm").find("#i").val($("#cctvMngWrap").find(".imgBox").length + 1);
	            _common.formSubmit("/image/add.json", $("#cctvMngWrap").find("#hiddenForm"), function(json){
	                if(json.result){
	                    _common.callAjax("/cctv/getCctvMngView.do", {mgrNo : k}, function(view) {
	        				$("#cctvMngWrap").find("#center-overlay-east").height(
	        					$(window).height() - $("#cctvMngWrap").find("#layout-north").outerHeight() - $("#cctvMngWrap").find("#overlay-east-bar").outerHeight()
	        				).html(view);

	        				$("#cctvMngWrap").find(".btnDiv").removeClass("hidden");
	        			});
	                }
	            }, false);
			}, function(){
				$("#cctvMngWrap").find("#hiddenForm").find("#uploadImg").val("");
			});
		}
	});

	/* 수정 저장 버튼입니다. */
	$("#cctvMngWrap").find("#saveBtn").click(function(){

		var param = _common.utils.collectSendData("#cctvMngWrap");

		var angle = param["angle"];

//		if(angle != -1 && angle.replace(/[0-9]/g, "").length > 0) {
//	        alert("숫자만 입력해 주십시오.");
//	        return;
//	    }
	    if(angle > 360 || angle < -1) {
	        alert("촬영각도 범위를 -1~365 로 입력해 주십시오.");
	        return;
	    }

	    if (_common.utils.isNullAndEmpty(param["gbnCd"])){
	    	alert("설치목적은 필수사항 입니다.");
	    	return false;
	    } else {
	    	param["gbnNm"] =  $("#cctvMngWrap #gbnCd option[value='"+ param["gbnCd"] + "']").text();
	    }


		param["mgrNo"] = $(this).parent().attr("k");
		if(_common.utils.isNullAndEmpty(param["ipAddr"])) delete param["ipAddr"];
		if(_common.utils.isNullAndEmpty(param["portNum"])) delete param["portNum"];

		var lng = param["lng"];
	    var lat = param["lat"];
	    if(!_common.utils.isNullAndEmpty(lng) && !_common.utils.isNullAndEmpty(lat)){
	    	var epsg = GMXMAP.getView().getProjection().getCode();
	        var mainCenter = ol.proj.transform([lng, lat], "EPSG:4326", epsg);
	        param["lng"] = mainCenter[0];
	        param["lat"] = mainCenter[1];
	    }

	    if(confirm("수정 하시겠습니까?")){
			_common.callAjax("/cctv/editCctv.json", param, function(json) {
				if(json.result){
					alert("수정되었습니다.");

					GMXMAP.reloadLayerData("asset_cctv");

	    			//if($("#cctvMngWrap").length > 0) $("#cctvMngWrap").dialog("destroy");
	    			if(!_common.utils.isNullAndEmpty(Public.StopEvent())) Public.StopEvent();
				}
			}, false);
		}
	});

	/* 삭제 이벤트 입니다. */
	$("#cctvMngWrap").find("#delBtn").click(function(){
		var v = $(this).parent().attr("k");
		if(confirm("삭제하시겠습니까?")){
			_common.callAjax("/cctv/delCctv.json", {k : v}, function(json) {
				if(json){
					alert("삭제되었습니다.");

					GMXMAP.reloadLayerData("asset_cctv");

	    			if($("#cctvMngWrap").length > 0) $("#cctvMngWrap").dialog("destroy");
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
	$("#cctvMngWrap").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
        changeYear: true,
        dateFormat: "yymmdd",
        showButtonPanel: true,
        beforeShowDay: $.datepicker.noBefore
	});

	/* 프리셋 설정 버튼이벤트 입니다. */
	$("#cctvMngWrap").find(".presetBtn").click(function(){
		var idx = $(this).attr("idx");
		var mgrNo = $(this).attr("mgrNo");
		var prop = {};

		_common.callAjax("/cctv/getCctv.json", { mgrNo : mgrNo }, function(json) {
			prop = json.result;
			xeusCCTV.viewVideo(encodeURIComponent(JSON.stringify(json.result)));
			setTimeout(function(){
				if(!$("#cctvMngWrap").find("button.ptz_" + mgrNo).parent().next().find("#ptzWrap").is(":visible")){
					$("#cctvMngWrap").find("button.ptz_" + mgrNo).click();
				}

				$("#cctvMngWrap").find(".selectPresetCancel").show(500);
				GMXMAP.on('click', Public.CCTV.Preset.Start);
				Public.CCTV.Preset["cctvProp"] = prop;
				Public.CCTV.Preset["mgrNo"] = mgrNo;
				Public.CCTV.Preset["presetNo"] = idx;
			    Public.StopEvent = function(){
			    	if(Public.CCTV.Preset["cctvProp"]){
			    		xeusSymbol.removeFeature(Public.CCTV.Preset["cctvProp"]["gid"], "isPreset");
			    	}
			    	delete Public.CCTV.Preset["cctvProp"];
			    	delete Public.CCTV.Preset["mgrNo"];
			    	delete Public.CCTV.Preset["presetNo"];
			        //$("body").css("cursor", "default").off("click");
			        $("#cctvMngWrap").find(".selectPresetCancel").hide(500);
			        GMXMAP.un('click', Public.CCTV.Preset.Start);
			    }

			    _common.callAjax("/proxy/xeusGateWay.json", { "path" : "getPresets", "cctvMgrNo" : mgrNo, "gbnCd" : prop["gbnCd"] }, function(json){
					var length = json.result.length;
					for(var i=11; i<20; i++){

						for(var l=0; l<length; l++){
							if(i == Number(json.result[l].presetNo)){
								var endPoint = [ Number(json.result[l].dirX), Number(json.result[l].dirY) ];
								var presetNo = json.result[l].presetNo;
								xeusSymbol.addPreset(prop["point"], endPoint, prop["gid"], presetNo);
								break;
							}
						}
					}
				}, false);
			}, 2000);

		});

	});

	$("#cctvMngWrap").find(".selectPresetCancel").click(function(){
		if(Public.StopEvent) Public.StopEvent();
	});

	/* 촬영각도 설정 이벤트 입니다. */
	$("#cctvMngWrap").find("#angleBtn").click(function(){
	    $("#cctvMngWrap").find(".selectAngleCancel").show(500);
        GMXMAP.on("click", Public.NMS.ANGLE.Start);

        if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("지도에서 객체를 기준으로 촬영각도를 설정할 수 있습니다.", 3000);

        Public.StopEvent = function(){
        	$("#cctvMngWrap").find(".selectAngleCancel").hide(500);
	        GMXMAP.un("click", Public.NMS.ANGLE.Start);
	        this.StopEvent = null;
	    }
	});

	/* 촬영각도 설정 초기화 이벤트 입니다. */
	$("#cctvMngWrap").find("#angleResetBtn").click(function(){
	    if(Public.StopEvent) {
			Public.StopEvent();
		} else {
	        $("#cctvMngWrap").find(".selectAngleCancel").hide(500);
	        GMXMAP.un("click", Public.NMS.ANGLE.Start);
		}

	    if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("촬영각도가 초기화 되었습니다.", 2000);

	    $("#cctvMngWrap").find("#angle").val(-1);
	});

	/* 촬영각도 설정 취소 이벤트 입니다. */
	$("#cctvMngWrap").find(".selectAngleCancel").click(function(){
		//if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("지도에서 촬영각도 설정이 해제되었습니다.", 2000);

		if(Public.StopEvent) Public.StopEvent();
	});

})();