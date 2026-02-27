(function(){

	/**
	 * 속성 검색 이벤트 입니다.
	 */
	$(".contentWrapper").find("#searchBtn").click(function(){
		var _param = _common.utils.collectSendData(" .contentWrapper #searchTable");
		if(_param["time"] == _param["endTime"]) _param["endTime"] = "";

		_common.callAjax("/lora/getDustList.json", _param, function(json){
			if(json.result.length == 0){
				var $tr = $("<tr><td colspan='8' class='tCenter'>결과가 존재하지 않습니다.</td></tr>");
				$(".contentWrapper").find("#resultTable").find("tbody").html($tr);
			}else{
				$(".contentWrapper").find("#resultTable").find("tbody").html("");
				for(var i=0; i<json.result.length; i++){
					var eui = JSON.parse(json.result[i].eui);
					var $tr = $("<tr class='tCenter search_result' k='" + json.result[i].mgrNo + "'></tr>");
						$tr.append("<td>" + (i + 1) + "</td>");

						var kv = JSON.parse(json.result[i].eui);
						kv.sort(function (a, b) {
							return a.rssi < b.rssi ? -1 : a.rssi > b.rssi ? 1 : 0;
						}).reverse();

						var gateway = "";
						var rssi = "";
						for(var z=0; z<kv.length; z++){
							//gateway += kv[z].eui;
							var right5 = kv[z].eui.substring(kv[z].eui.length - 5);
							gateway += right5;
							if(right5 in LoRaInfomation){
								gateway += " [" + LoRaInfomation[right5].cctvMgrNo + "]";
							}
							gateway += "<br>";
							rssi += kv[z].rssi + "<br>";
						}

						$tr.append("<td>" + gateway + "</td>");
						$tr.append("<td>" + rssi + "</td>");
						//$tr.append("<td>" + json.result[i].gpsLock + "</td>");

						/*1. PM 1.0 극초미세
						  0~15(좋음) / 16~35(보통) / 36~75(나쁨) / 76~(아주나쁨)

						  2. PM2.5 초미세
						  0~15(좋음) / 16~35(보통) / 36~75(나쁨) / 76~(아주나쁨)

						  3. PM10 미세
						  0~30(좋음) / 31~80(보통) / 81~150(나쁨) / 151~(아주나쁨)    */

						var pm1Color = "";
						var pm2Color = "";
						var pm10Color = "";

						var pm1 = Number(json.result[i].pm1);
						if(pm1 <= 15) pm1Color = "좋음";//"green";
						if(pm1 < 36 && pm1 >= 16) pm1Color = "보통";//"yellow";
						if(pm1 < 76 && pm1 >= 36) pm1Color = "나쁨";//"orange";
						if(pm1 >= 76) pm1Color = "아주나쁨";//"red";

						var pm2 = Number(json.result[i].pm2);
						if(pm2 <= 15) pm2Color = "좋음";//"green";
						if(pm2 < 36 && pm2 >= 16) pm2Color = "보통";//"yellow";
						if(pm2 < 76 && pm2 >= 36) pm2Color = "나쁨";//"orange";
						if(pm2 >= 76) pm2Color = "아주나쁨";//"red";

						var pm10 = Number(json.result[i].pm10);
						if(pm10 <= 30) pm10Color = "좋음";//"green";
						if(pm10 < 81 && pm10 >= 31) pm10Color = "보통";//"yellow";
						if(pm10 < 151 && pm10 >= 81) pm10Color = "나쁨";//"orange";
						if(pm10 >= 151) pm10Color = "아주나쁨";//"red";

						$tr.append("<td>" + pm1Color + "(" + json.result[i].pm1 + ")" + "</td>");
						$tr.append("<td>" + pm2Color + "(" + json.result[i].pm2 + ")" + "</td>");
						$tr.append("<td>" + pm10Color + "(" + json.result[i].pm10 + ")" + "</td>");
						/*$tr.append("<td>" + json.result[i].pm1 + "</td>");
						$tr.append("<td>" + json.result[i].pm2 + "</td>");
						$tr.append("<td>" + json.result[i].pm10 + "</td>");*/
						$tr.append("<td>" + new Date().formatDate(json.result[i].Time).split(" ")[1] + "</td>");
						$tr.append("<td><button class='locBtn btn_t'>위치</button></td>");

					var prop = {
						gid : json.result[i].gid,
						mgrNo : json.result[i].mgrNo,
						devEui : json.result[i].devEui,
						gatewayEui : JSON.parse(json.result[i].eui),
						pm1 : json.result[i].pm1,
						pm2 : json.result[i].pm2,
						pm10 : json.result[i].pm10,
						mdfyDate : json.result[i].Time,
						point : Spatial.convertProjection([json.result[i].lon, json.result[i].lat], "EPSG:4326", "EPSG:5186")
					};
					$tr.data(prop);

					$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
				}

				Public.NMS.Dust.Start();

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