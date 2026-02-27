/**
 *
 */
(function(){

	var cctvList = {};
	var searchMetadata = null;

	/* DatePicker 생성 이벤트입니다. */
	$(".contentWrapper").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
	    changeYear: true,
	    dateFormat: "yymmdd",
	    showButtonPanel: true,
	    beforeShowDay: $.datepicker.noBefore
	});
	//TODO 외부 API 연동
	/* CCTV 목록 */
//	_common.callAjax("/api/smarteyeProxy.jsp", {}, function(json){
//		//var json = [{"analyze_server_name":"default-server","camera_id":1,"delay":0.0,"description":"","detect_region_rel":null,"enable":1,"file_analyze_all_frames":0,"group_id":1,"id":1,"location":null,"name":"P12018;1/3R","path":"rtsp://admin:2435wret@$#%@111.144.14.61:554/profile2/media.smp","reconnect":10},{"analyze_server_name":"default-server","camera_id":7,"delay":0.0,"description":"","detect_region_rel":null,"enable":1,"file_analyze_all_frames":0,"group_id":1,"id":7,"location":null,"name":"P12018;2/3S","path":"rtsp://admin:1234@111.144.14.62:554/video1+audio1","reconnect":10},{"analyze_server_name":"default-server","camera_id":8,"delay":0.0,"description":"","detect_region_rel":null,"enable":1,"file_analyze_all_frames":0,"group_id":1,"id":8,"location":null,"name":"P12018;3/3S","path":"rtsp://admin:1234@111.144.14.63:554/video1+audio1","reconnect":10},{"analyze_server_name":"default-server","camera_id":9,"delay":0.0,"description":"","detect_region_rel":null,"enable":1,"file_analyze_all_frames":0,"group_id":1,"id":9,"location":null,"name":"P05007;1/4R","path":"rtsp://admin:1234@111.143.14.61:554/video1+audio1","reconnect":10},{"analyze_server_name":"default-server","camera_id":10,"delay":0.0,"description":"","detect_region_rel":null,"enable":1,"file_analyze_all_frames":0,"group_id":1,"id":10,"location":null,"name":"P12023;1/3R","path":"rtsp://admin:1234@111.104.12.61:554/video1+audio1","reconnect":10},{"analyze_server_name":"default-server","camera_id":11,"delay":0.0,"description":"","detect_region_rel":null,"enable":1,"file_analyze_all_frames":0,"group_id":1,"id":11,"location":null,"name":"N12008;2/4R","path":"rtsp://admin:2435wret@$#%@111.142.21.62:554/profile2/media.smp","reconnect":10}];
//		$(".contentWrapper").find(".cctvListTable").each(function(){
//			$(this).html("");
//		});
//
//		var first = Math.ceil(json.length / 2);
//		$(".contentWrapper").find(".cctvListTable").each(function(idx){
//			var $fTr = $("<tr></tr>");
//			for(var i=0; i<first; i++){
//				var cctvId = json[i].id;
//				var rtspUrl = json[i].path;
//				var cctvNm = json[i].name;
//				var desc = json[i].description;
//				cctvList[cctvId] = cctvNm;
//
//				if($(this).hasClass("carTbl")){
//					$fTr.append('<td class="noneBorder"><input type="checkbox" class="cctv_ids" id="cctv_ids' + cctvId + '" value="' + cctvId + '"><label for="cctv_ids' + cctvId + '">' + cctvNm + '</label></td>');
//				}else if($(this).hasClass("objTbl")){
//					$fTr.append('<td class="noneBorder"><input type="checkbox" class="cctv_ids" id="cctv_ids_' + cctvId + '" value="' + cctvId + '"><label for="cctv_ids_' + cctvId + '">' + cctvNm + '</label></td>');
//				}
//			}
//			$(this).append($fTr);
//		});
//
//		$(".contentWrapper").find(".cctvListTable").each(function(){
//			var $sTr = $("<tr></tr>");
//			for(var i=first; i<json.length; i++){
//				var cctvId = json[i].id;
//				var rtspUrl = json[i].path;
//				var cctvNm = json[i].name;
//				var desc = json[i].description;
//				cctvList[cctvId] = cctvNm;
//
//				if($(this).hasClass("carTbl")){
//					$sTr.append('<td class="noneBorder"><input type="checkbox" class="cctv_ids" id="cctv_ids' + cctvId + '" value="' + cctvId + '"><label for="cctv_ids' + cctvId + '">' + cctvNm + '</label></td>');
//				}else if($(this).hasClass("objTbl")){
//					$sTr.append('<td class="noneBorder"><input type="checkbox" class="cctv_ids" id="cctv_ids_' + cctvId + '" value="' + cctvId + '"><label for="cctv_ids_' + cctvId + '">' + cctvNm + '</label></td>');
//				}
//			}
//			$(this).append($sTr);
//		});
//	}, false);

	$(".contentWrapper").find("select[name=end_h]").val("23");
	$(".contentWrapper").find("select[name=end_m]").val("59");

	$(".contentWrapper").find("#searchTable").find("tr").find("th").click(function(){
		if($(this).next().find("input[type=checkbox]:checked").length == 0){
			$(this).next().find("input[type=checkbox]").click();
		}else if($(this).next().find("input[type=checkbox]:checked").length == $(this).next().find("input[type=checkbox]").length){
			$(this).next().find("input[type=checkbox]").click();
		}else{
			$(this).next().find("input[type=checkbox]").not(":checked").click();
		}

	}).css("cursor", "pointer");

	$(".contentWrapper").find("#sch_typ").change(function(){
		if($(this).val() == "car"){
			$(".contentWrapper").find("#searchTable").find("tr[target=car]").removeClass("hidden");
			$(".contentWrapper").find("#searchTable").find("tr[target=obj]").addClass("hidden");
			$(".contentWrapper").find("#searchTable").find("tr:eq(0)").find("td").attr("colspan", "9");
		}else{
			$(".contentWrapper").find("#searchTable").find("tr[target=car]").addClass("hidden");
			$(".contentWrapper").find("#searchTable").find("tr[target=obj]").removeClass("hidden");
			$(".contentWrapper").find("#searchTable").find("tr:eq(0)").find("td").attr("colspan", "7");
		}
	});

	$(".contentWrapper").find("#searchBtn").click(function(){
		$(".contentWrapper").find("#result").html("");

		var schTyp = $(".contentWrapper").find("#sch_typ").val();
		var $target = $(".contentWrapper").find("#searchTable").find("tr[target=" + schTyp + "]");
		var param = _common.utils.collectSendData(".contentWrapper #searchTable tr[target=" + schTyp + "]");

		param["search_text"] = encodeURIComponent(param["search_text"]);

		param["start_date"] = new Date().formatYMDHMS(param["start_date"]);
		param["end_date"] = new Date().formatYMDHMS(param["end_date"]);

		param["start_time"] = param["start_h"] + ":" + param["start_m"];
		param["end_time"] = param["end_h"] + ":" + param["end_m"];

		delete param["start_h"];
		delete param["start_m"];
		delete param["end_h"];
		delete param["end_m"];

		param["cctv_ids"] = "";
		$target.find(".cctv_ids:checked").each(function(i){
			if(i == 0){
				param["cctv_ids"] = $(this).val();
			}else{
				param["cctv_ids"] += "&cctv_ids=" + $(this).val();
			}
		});
		if(param["cctv_ids"] == "") delete param["cctv_ids"];

		param["color_names"] = "";
		$target.find(".color_names:checked").each(function(i){
			if(i == 0){
				param["color_names"] = $(this).val();
			}else{
				param["color_names"] += "&color_names=" + $(this).val();
			}
		});
		if(param["color_names"] == "") delete param["color_names"];

		param[schTyp + "_types"] = "";
		$target.find("." + schTyp + "_types:checked").each(function(i){
			if(i == 0){
				param[schTyp + "_types"] = $(this).val();
			}else{
				param[schTyp + "_types"] += "&" + schTyp + "_types=" + $(this).val();
			}
		});
		if(param[schTyp + "_types"] == "") delete param[schTyp + "_types"];

		if(schTyp == "car"){
			param["plate_types"] = "";
			$target.find(".plate_types:checked").each(function(i){
				if(i == 0){
					param["plate_types"] = $(this).val();
				}else{
					param["plate_types"] += "&plate_types=" + $(this).val();
				}
			});
			if(param["plate_types"] == "") delete param["plate_types"];
		}

		param["mode"] = "search";
		param["schTyp"] = schTyp;

		_common.callAjax("/api/smarteyeProxy.jsp", param, function(json){

			setContent(json);

		}, false);

	});

	function setContent(json){
		$(".contentWrapper").find("#result").html("");

		var schTyp = $(".contentWrapper").find("#sch_typ").val();

		var rows = json.rows;
		var rowsLength = rows.length;
		searchMetadata = json.search_metadata;
		if(rowsLength == 0){
			alert("검색결과가 존재하지 않습니다.");
		}else{

			var limit = Number($(".contentWrapper").find("#searchTable").find("tr[target=" + schTyp + "]").find("#limit").val());
			var $table = $("<table></table>");
			$table.append("<thead><tr><th><button class='blackBtn_Fill' id='prevBtn'>이전 결과</button></th><th colspan='8'>검색결과</th><th><button class='blackBtn_Fill' id='nextBtn'>다음 결과</button></th></tr></thead>");
			$table.append("<tbody></tbody>");

			var hasPrev = json.has_prev;
			var hasNext = json.has_next;

			if(!hasPrev) $table.find("#prevBtn").hide();
			if(!hasNext) $table.find("#nextBtn").hide();
			$table.find("#prevBtn, #nextBtn").click(function(){
				var mode = "prev";
				if($(this).attr("id") == "nextBtn") mode = "next";
				setPrevOrNext(mode);
			});

			for(var l=0; l<(limit / 10); l++){
				var $tr = $("<tr class='tCenter'></tr>").css("vertical-align", "top");

				var start = l * 10;
				if(l == 0) start = 0;
				var end = (l * 10) + 10;

				for(var i=start; i<end; i++){
					var $td = $("<td></td>").attr("idx", i);

					var cameraId = rows[i].camera_id;
					var detectUrl = rows[i][schTyp + "_fid"];
					var originUrl = rows[i].fid;
					var originFile = originUrl.replace("http://101.102.133.161:8080/", "");
					var color = rows[i][schTyp + "_info_text"];
					var detail = rows[i][schTyp + "_info_detail"];
					var point = rows[i][schTyp + "_points_rel"];
					var time = rows[i].snapshot_date;
					var carNum = rows[i].plate_info_detail;

					$td.append("<img class='snapshot' src='../api/smarteyeImgProxy.jsp?url=" + originFile + "' style='width: 100%;' url='" + originFile + "' point='" + point + "'><br>");
					$td.append("<b>" + cctvList[cameraId] + "</b><br>");
					if(schTyp == "car"){
						$td.append("<b>" + carNum + "</b><br>");
					}
					$td.append("<b>" + detail.replace(" ", "<br>") + "</b><br>");
					$td.append("<b>" + time + "</b>");
					$td.find("img.snapshot").click(function(){
						_common.postForm.open("/api/smarteyeView.jsp?image=" + $(this).attr("url") + "&point=" + $(this).attr("point"));
					}).css("cursor", "pointer");

					$tr.append($td);
				}
				$table.find("tbody").append($tr);
			}

			$(".contentWrapper").find("#result").html($table);
			$(".contentWrapper").find("#resultWrap").removeClass("hidden");
		}
	}

	/* 이전, 다음 이벤트 */
	function setPrevOrNext(mode){

		var schTyp = $(".contentWrapper").find("#sch_typ").val();
		var $target = $(".contentWrapper").find("#searchTable").find("tr[target=" + schTyp + "]");
		var param = { "schParam" : "search_metadata=" + encodeURIComponent(searchMetadata) };

		param["mode"] = mode;
		param["schTyp"] = schTyp;

		_common.callAjax("/api/smarteyeProxy.jsp", param, function(json){

			setContent(json);

		}, false);
	}

})();