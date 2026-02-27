(function(){

	/**
	 * 속성 검색 이벤트 입니다.
	 */
	$(".contentWrapper").find("#searchBtn").click(function(){
		var _param = _common.utils.collectSendData(" .cotentWrapper #searchTable");
		if(_param["mdfyDate"] == _param["endMdfyDate"]) _param["endMdfyDate"] = "";

		_common.callAjax("/lora/getList.json", _param, function(json){
			if(json.result.length == 0){
				var $tr = $("<tr><td colspan='6' class='tCenter'>결과가 존재하지 않습니다.</td></tr>");
				$(".contentWrapper").find("#resultTable").find("tbody").html($tr);
			}else{
				$(".contentWrapper").find("#resultTable").find("tbody").html("");
				for(var i=0; i<json.result.length; i++){
					var eui = json.result[i].gatewayEui.split(";");
					var $tr = $("<tr class='tCenter search_result' k='" + json.result[i].mgrNo + "'></tr>");
						$tr.append("<td>" + (i + 1) + "</td>");

						var kv = new Array();
						for(var l=0; l<eui.length; l++){
							var k = eui[l].split(",")[0];
							var v = Number(eui[l].split(",")[1]);

							kv.push({ gateway : k, rssi : v })
						}
						kv.sort(function (a, b) {
							return a.rssi < b.rssi ? -1 : a.rssi > b.rssi ? 1 : 0;
						}).reverse();

						var gateway = "";
						var rssi = "";
						for(var z=0; z<kv.length; z++){
							gateway += kv[z].gateway;
							if(kv[z].gateway in LoRaInfomation){
								gateway += " [" + LoRaInfomation[kv[z].gateway].cctvMgrNo + "]";
							}
							gateway += "<br>";
							rssi += kv[z].rssi + "<br>";
						}

						$tr.append("<td>" + gateway + "</td>");
						$tr.append("<td>" + rssi + "</td>");
						//$tr.append("<td>" + json.result[i].gpsLock + "</td>");
						$tr.append("<td>" + json.result[i].btry + "</td>");
						$tr.append("<td>" + new Date().formatDate(json.result[i].mdfyDate) + "</td>");
						$tr.append("<td><button class='locBtn btn_t'>위치</button></td>");

					var prop = {
						gid : json.result[i].gid,
						mgrNo : json.result[i].mgrNo,
						devEui : json.result[i].devEui,
						gatewayEui : json.result[i].gatewayEui,
						rssi : json.result[i].rssi,
						mdfyDate : json.result[i].mdfyDate,
						point : Spatial.convertProjection([json.result[i].lon, json.result[i].lat], "EPSG:4326", "EPSG:5186")
					};
					$tr.data(prop);

					$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
				}

				Public.NMS.LoRa.Start();

				/* 위치 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find(".locBtn").click(function(){
					var v = $(this).parent().parent().attr("k");
					var prop = $(this).parent().parent().data();
					GMXMAP.addPulse(prop.point,true);

				});

			}
		});
	});

	/**
	 * LoRa 측정자료 보기 이벤트입니다.
	 */
	$(".contentWrapper").find("#viewLoRaLayer").change(function(){
		if(GMXMAP.getLayer("asset_lora_state")){
			if($(this).is(":checked")){
				GMXMAP.getLayer("asset_lora_state").setVisible(true);
			}else{
				GMXMAP.getLayer("asset_lora_state").setVisible(false);
			}
		}
	});
	if(GMXMAP.getLayer("asset_lora_state")){
		if(GMXMAP.getLayer("asset_lora_state").getVisible()){
			$(".contentWrapper").find("#viewLoRaLayer").prop("checked", "checked");
		}
	}

	/**
	 * 엑셀 다운로드 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#excelBtn").click(function(){
		if($(".contentWrapper").find("#resultTable").find("tbody").children('.search_result').length == 0){
			alert("검색결과가 존재하지 않아 다운로드할 수 없습니다.");
		}else{
			confirm("검색결과를 엑셀로 다운로드 하시겠습니까?", function(){
				_common.postForm.submit("/cctv/getCctvListExcel.do", Public.CCTV.Search.excelParam);
			});
		}
	});

	$(".contentWrapper").find("#cctvNm").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#searchBtn").click();
		}
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