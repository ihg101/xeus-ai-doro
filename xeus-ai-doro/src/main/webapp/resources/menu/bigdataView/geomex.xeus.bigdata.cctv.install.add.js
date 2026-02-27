(function(){

//	$(".contentWrapper").find(".tab").click(function(){
//		var url = $(this).attr("url");
//
//		_common.callAjax(url, {}, function(view){
//			$("#contentWrap").html(view);
//		});
//	});

	if(_common.utils.isNullAndEmpty($(".contentWrapper").find("#instDate").val())){
		$(".contentWrapper").find("#instDate").val(new Date().getYMD());
	}

	/* 수정 저장 버튼입니다. */
	$(".contentWrapper").find("#saveBtn").click(function(){
		var param = _common.utils.collectSendData(".contentWrapper #regTable");

		var instDate = param["instDate"];
		if(_common.utils.isNullAndEmpty(instDate)){
			alert("설치일자를 입력해주세요.");
		}else{
			param["instYear"] = instDate.substring(0, 4);
			param["instMon"] = instDate.substring(4, 6);
			param["instDay"] = instDate.substring(6);
			delete param["instDate"];
		}

		var lng = param["lng"];
	    var lat = param["lat"];
	    var center = null;
	    if(!_common.utils.isNullAndEmpty(lng) && !_common.utils.isNullAndEmpty(lat)){
	    	center = Spatial.convertProjection([Number(param["lng"]), Number(param["lat"])], "EPSG:4326", "EPSG:5186");
	    	param["tmx"] = center[0];
	    	param["tmy"] = center[1];

	    	param["lon"] = param["lng"];
	    	delete param["lng"];
	        /*var epsg = xeusLayout.mapService.getMap().getView().getProjection().getCode();
	        var mainCenter = ol.proj.transform([lng, lat], 'EPSG:4326', epsg);
	        param["lng"] = mainCenter[0];
	        param["lat"] = mainCenter[1];*/
	    }

	    var mode = $(this).attr('mode');
	    if(confirm("저장하시겠습니까?")){

	    	_common.callAjax("/bigData/" + mode + "CctvInstall.json", param, function(json) {
				if(json){
					alert("저장되었습니다.");
					//$(".contentWrapper").find(".sendData").val("");
					/*if(!xeusLayout.mapService.getLayerById("asset_cctv_install")){
						var layer = xeusLayout.mapService.createVectorLayer(Layers["asset_cctv_install"]);
						xeusLayout.mapService.removeLayer(xeusLayout.mapService.getLayerById("asset_cctv_install"));
						Layers["asset_cctv_install"].loadFunction(layer);
						layer.setVisible(true);
					}else{
						Layers["asset_cctv_install"].loadFunction(xeusLayout.mapService.getLayerById("asset_cctv_install"));
					}

					_search.moveLocation(center, "");*/
					if(Public.StopEvent) Public.StopEvent();
					var mode = $(".contentWrapper").find("#saveBtn").attr("mode");

					if(mode == "add"){
						$("#bigdataMngWrap").dialog("destroy");

//						$(".cctvInstallSearchView").find("#bjd").val(json.result.bjd);
//						$(".cctvInstallSearchView").find("#jibun").val(json.result.jibun);

//						$("#searchBtn").click();
						GMXMAP.redrawAllVisibleVector();

						setTimeout(function(){
							$(".contentWrapper").find("#resultTable").find("tbody").find("tr[k=" + json.result.mgrSeq + "]").click();
						},500);

					}
					else if(mode == "edit"){
						setTimeout(function(){
							$(".contentWrapper").find("#resultTable").find("tbody").find("tr[k=" + json.cctvInstallVo.mgrSeq + "]").click();
						},500);
					}

//					$(".contentWrapper").find(".tabTitle").find(".tab").eq(0).click();
				}
			});
	    }
		/*confirm("저장하시겠습니까?", function(){
			_common.callAjax("/bigData/" + mode + "CctvInstall.json", param, function(json) {
				if(json){
					//$(".contentWrapper").find(".sendData").val("");
					if(!xeusLayout.mapService.getLayerById("asset_cctv_install")){
						var layer = xeusLayout.mapService.createVectorLayer(Layers["asset_cctv_install"]);
						xeusLayout.mapService.removeLayer(xeusLayout.mapService.getLayerById("asset_cctv_install"));
						Layers["asset_cctv_install"].loadFunction(layer);
						layer.setVisible(true);
					}else{
						Layers["asset_cctv_install"].loadFunction(xeusLayout.mapService.getLayerById("asset_cctv_install"));
					}

					_search.moveLocation(center, "");

					alert("저장되었습니다.");
					if(Public.StopEvent) Public.StopEvent();
					$(".contentWrapper").find(".tabTitle").find(".tab").eq(0).click();
				}
			});
		});*/
	});

	/* 삭제 버튼 이벤트입니다. */
	$(".contentWrapper").find("#delBtn").click(function(){
		var mgrSeq = $(".contentWrapper").find("#mgrSeq").val();

		if(confirm("삭제하시겠습니까?")){
			_common.callAjax("/bigData/delCctvInstall.json", { "k" : mgrSeq }, function(json) {
				if(json){
					alert("삭제되었습니다.");
					/*$(".contentWrapper").find("#saveBtn").attr("mode", "add");
					$(".contentWrapper").find(".sendData").val("");
					if(!xeusLayout.mapService.getLayerById("asset_cctv_install")){
						var layer = xeusLayout.mapService.createVectorLayer(Layers["asset_cctv_install"]);
						xeusLayout.mapService.removeLayer(xeusLayout.mapService.getLayerById("asset_cctv_install"));
						Layers["asset_cctv_install"].loadFunction(layer);
						layer.setVisible(true);
					}else{
						Layers["asset_cctv_install"].loadFunction(xeusLayout.mapService.getLayerById("asset_cctv_install"));
					}*/
					if(Public.StopEvent) Public.StopEvent();
//					$(".contentWrapper").find(".tabTitle").find(".tab").eq(0).click();
					$("#bigdataMngWrap").dialog("destroy");
					$("#searchBtn").click();
				}
			});
		}
		/*confirm("삭제하시겠습니까?", function(){
			_common.callAjax("/bigData/delCctvInstall.json", { "k" : mgrSeq }, function(json) {
				if(json){
					alert("삭제되었습니다.");
					$(".contentWrapper").find("#saveBtn").attr("mode", "add");
					$(".contentWrapper").find(".sendData").val("");
					if(!xeusLayout.mapService.getLayerById("asset_cctv_install")){
						var layer = xeusLayout.mapService.createVectorLayer(Layers["asset_cctv_install"]);
						xeusLayout.mapService.removeLayer(xeusLayout.mapService.getLayerById("asset_cctv_install"));
						Layers["asset_cctv_install"].loadFunction(layer);
						layer.setVisible(true);
					}else{
						Layers["asset_cctv_install"].loadFunction(xeusLayout.mapService.getLayerById("asset_cctv_install"));
					}
					if(Public.StopEvent) Public.StopEvent();
					$(".contentWrapper").find(".tabTitle").find(".tab").eq(0).click();
				}
			});
		});*/
	});

	/* 지도에서 위치설정 이벤트 입니다. */
	$(".contentWrapper").find("#mapClickBtn").click(function(){
	    //$("body").css("cursor", "crosshair");
	    $(".contentWrapper").find(".selectCancel").show(500);
	    GMXMAP.on('click', Public.BIGDATA.Add.Start);
	    Public.StopEvent = function(){
	        //$("body").css("cursor", "default").off("click");
	    	/*if(xeusSymbol){
	    		GMXMAP.removeLayer(
    				GMXMAP.getLayer("xeusSymbol")
	    		);
	    	}*/

	        $(".contentWrapper").find(".selectCancel").hide(500);
	        GMXMAP.un('click', Public.BIGDATA.Add.Start);
	    }
	});
	$(".contentWrapper").find(".selectCancel").click(function(){
	    Public.StopEvent();
	});

	/* DatePicker 생성 이벤트입니다. */
	$(".contentWrapper").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
        changeYear: true,
        dateFormat: "yymmdd",
        showButtonPanel: true,
        beforeShowDay: $.datepicker.noBefore
	});

})();