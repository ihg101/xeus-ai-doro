/**
 * Ping 설정 객체입니다.
 */
if(window.xeusNmsPing == null) var xeusNmsPing = {

	/**
	 * 주어진 필드명이 데이터 필드인지 확인합니다.
	 *
	 * @param field
	 * @param tbl
	 * @returns {Boolean}
	 */
	isDataField : function(field, tbl){
		var isDataField = true;

		var notAllowFields = ["_gid", "gid", "_geometry", "geojson", "_annox", "_annoy", "lat", "lon", "mgr_seq", "layer_id", "jibn_pnu", "road_addr"];
		for(var i=0; i<notAllowFields.length; i++){
			if(notAllowFields[i] == field){
				isDataField = false;
				break;
			}
		}

		if(!_common.utils.isNullAndEmpty(tbl)){
			var notAllowTableFields = [];
			if(tbl == "asset_cctv_install" || tbl == "v_asset_cctv_not_install"){
				notAllowTableFields = ["rmark", "reg_req", "field_insp", "reg_how", "ovrp_yn", "res_date"];
			}
			if(tbl == "asset_cctv"){
				notAllowTableFields = ["mgr_no", "org_mgr_no", "md_mgr_no", "vms_mgr_no", "site_mgr_no", /*"cctv_nm",*/
				                       /*"inst_dat", "device_id", "chnl_no", "gbn_cd", "ip_addr", "port_num",*/ "use_yn",
				                       "light_yn", "infrd_yn", "pan_yn", "tilt_yn", "zoom_yn", "talk_yn", "tour_yn",
				                       /*"con_id", "con_pwd", "snmp_str", "const_year", "const_nm", "loc_desc", "rmark"*/];
			}

			for(var i=0; i<notAllowTableFields.length; i++){
				if(notAllowTableFields[i] == field){
					isDataField = false;
					break;
				}
			}
		}

		return isDataField;
	},

	/**
	 * 주어진 필드가 숫자 타입인지 확인합니다.
	 *
	 * @param field
	 * @param tbl
	 * @returns {Boolean}
	 */
	isNumericField : function(dataType){
		var isNumeric = false;

		if(!_common.utils.isNullAndEmpty(dataType)){
			if(dataType.toLowerCase() == "int") isNumeric = true;
			if(dataType.toLowerCase() == "integer") isNumeric = true;
			if(dataType.toLowerCase() == "tinyint") isNumeric = true;
			if(dataType.toLowerCase() == "bigint") isNumeric = true;
			if(dataType.toLowerCase() == "smallint") isNumeric = true;
			if(dataType.toLowerCase() == "decimal") isNumeric = true;
			if(dataType.toLowerCase() == "numeric") isNumeric = true;
			if(dataType.toLowerCase() == "serial") isNumeric = true;
			if(dataType.toLowerCase() == "bigserial") isNumeric = true;
		}

		return isNumeric;
	},

	/**
	 * 분석설정 테이블을 생성합니다.
	 *
	 * @param krName
	 * @param enName
	 * @param isExcel
	 */
	setDataTable : function(krName, enName, skName, lyrMgrSeq, enField){
		var lyr = enName;
		if(!_common.utils.isNullAndEmpty(lyr)){

			$("#weightSetTable").find("#ipFieldNm").text("");
			$("#weightSetTable").find("#ipFieldNm").removeAttr("krName");
			$("#weightSetTable").find("#ipFieldNm").removeAttr("enName");
			$("#weightSetTable").find("#ipFieldNm").removeAttr("skName");
			$("#weightSetTable").find("#ipFieldNm").removeAttr("krField");
			$("#weightSetTable").find("#ipFieldNm").removeAttr("enField");

			_common.callAjax("/bigData/getLayerMetaInfo.json", { "t" : enName, "s" : skName }, function(json){
				$("#weightSetTable").find("#lyrMgrSeq").text(krName);
				$("#weightSetTable").find("#lyrMgrSeq").attr("krName", krName);
				$("#weightSetTable").find("#lyrMgrSeq").attr("enName", enName);
				$("#weightSetTable").find("#lyrMgrSeq").attr("skName", skName);
				$("#weightSetTable").find("#lyrMgrSeq").attr("lyrMgrSeq", lyrMgrSeq);

				$("#weightSetTable").find("#ipFieldNm").attr("krName", krName);
				$("#weightSetTable").find("#ipFieldNm").attr("enName", enName);

				var columnConvert = _common.getColumn(json.column);
				var list = json.result;
				var length = list.length;

				var allCnt = "<b>" + json.count + "건 중 " + length + "건</b>";
				if(json.count <= 100){
					allCnt = "<b>" + json.count + "건</b>";
				}
				$("#selectLayerText").html("현재 <b>" + krName + "</b> 레이어를 설정 중이며, 총 데이터 " + allCnt + "이 표시되었습니다.");
				$("#selectLayerText").find("b").css("color", "red");

				var $thead = $("#columnWrap").find("#listWrap").find("#weightTable").find("thead");

				var $headTr = $("<tr></tr>");
				for(var i=0; i<json.column.length; i++){
					for(var key in list[0]){
						if(json.column[i].colId == key){
							var isNumeric = xeusNmsPing.isNumericField(json.column[i].dataType);
							var dataType = "numeric";
							if(!isNumeric) dataType = "notnumeric";

							if(xeusNmsPing.isDataField(key, lyr)){
								var value = key;
								if(!_common.utils.isNullAndEmpty(columnConvert.get(key))) value = columnConvert.get(key);

								$headTr.append("<th col='" + key + "' lyr='" + lyr + "' datatype='" + dataType + "'>" + value + "</th>");
							}

						}
					}
				}
				$thead.html($headTr);

				var $tbody = $("#columnWrap").find("#listWrap").find("#weightTable").find("tbody");
				$tbody.html("");
				for(var i=0; i<length; i++){
					var $bodyTr = $("<tr></tr>");

					for(var l=0; l<json.column.length; l++){
						for(var key in list[0]){
							if(json.column[l].colId == key){

								if(xeusNmsPing.isDataField(key, lyr)){
									$bodyTr.append("<td>" + _common.utils.validNull(list[i][key]) + "</td>");
								}

							}
						}
					}

					$tbody.append($bodyTr);
				}

				$headTr.find("th[datatype=numeric]").css("cursor", "not-allowed");
				$headTr.find("th[datatype=notnumeric]").css("cursor", "pointer").click(function(){
					var idx = $(this).index();
					var knm = $(this).text();
					var col = $(this).attr("col");
					if(!_common.utils.isNullAndEmpty(col)){

						$("#weightSetTable").find("#ipFieldNm").text(knm);
						$("#weightSetTable").find("#ipFieldNm").attr("krName", krName);
						$("#weightSetTable").find("#ipFieldNm").attr("enName", enName);
						$("#weightSetTable").find("#ipFieldNm").attr("krField", knm);
						$("#weightSetTable").find("#ipFieldNm").attr("enField", col);
						$tbody.find("tr").each(function(){
							$(this).find("td").removeClass("themeFc").addClass("themeBgTc");
							$(this).find("td").eq(idx).addClass("themeFc").removeClass("themeBgTc");
						});
					}
				});

				if(!_common.utils.isNullAndEmpty(enField)) $headTr.find("th[col=" + enField + "]").click();

				if($("#columnWrap").hasClass("ui-dialog-content")){
					$("#columnWrap").dialog("open");
				}else{
					$("#columnWrap").dialog({
						title: "Ping 체크 옵션 설정",
						modal: true,
						width: $("#map").width(),
						height: $("#map").height(),
						position: {
							my: "left top",
							at: "left top",
							of: $("#map")
						},
						open: function(){
							if($("#columnWrap").hasClass("hidden")) $("#columnWrap").removeClass("hidden");
						},
						close: function(){
							$(this).dialog("close");
						}
					}).parent().draggable({
						containment: "#map",
						scroll: false
					});
				}

			}, false);

		}
	},

	/**
	 * 분석을 위한 설정값을 리턴합니다.
	 *
	 * @returns
	 */
	parseData : function(){
		var result = null;

		if("{}" == JSON.stringify(bigdataAnalyWeight) || "{}" == JSON.stringify(bigdataLayerSet)){
			alert("데이터 추가 및 분석옵션 설정이 필요합니다.");
			return false;
		}

		var maxLayerWeight = 0;
		$(".layerWeight").each(function(){
			maxLayerWeight += Number($(this).val());
		});

		if(maxLayerWeight != 100){
			alert("레이어 가중치의 수치는 100%로 맞추어야 합니다.\n\n각 레이어의 % 수치를 확인하세요.");
			return false;
		}

		return {
			"bigdataLayerSet" : bigdataLayerSet,
			"bigdataAnalyWeight" : bigdataAnalyWeight
		};
	}

}