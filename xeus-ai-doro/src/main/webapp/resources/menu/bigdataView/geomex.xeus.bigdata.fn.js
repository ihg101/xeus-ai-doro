/**
 * 빅데이터 분석 객체입니다.
 */
if(window.xeusBigdata == null) var xeusBigdata = {

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
				notAllowTableFields = ["mgr_no", "org_mgr_no", "md_mgr_no", "vms_mgr_no", "site_mgr_no", "cctv_nm",
				                       "inst_dat", "device_id", "chnl_no", "gbn_cd", "ip_addr", "port_num", "use_yn",
				                       "light_yn", "infrd_yn", "pan_yn", "tilt_yn", "zoom_yn", "talk_yn", "tour_yn",
				                       "con_id", "con_pwd", "snmp_str", "const_year", "const_nm", "loc_desc", "rmark"];
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
	setDataTable : function(krName, enName, skName, enField){
		var lyr = enName;
		if(!_common.utils.isNullAndEmpty(lyr)){

			$("#weightSetTable").find("#selectField").text("위치");
			$("#weightSetTable").find("#selectField").removeAttr("krName");
			$("#weightSetTable").find("#selectField").removeAttr("enName");
			$("#weightSetTable").find("#selectField").removeAttr("krField");
			$("#weightSetTable").find("#selectField").removeAttr("enField");

			//_common.callAjax("/getLayerData.json", param, function(json){
			_common.callAjax("/bigData/getLayerMetaInfo.json", { "t" : enName, "s" : skName }, function(json){
				$("#weightSetTable").find("#selectField").attr("krName", krName);
				$("#weightSetTable").find("#selectField").attr("enName", enName);

				$("#weightSetTable").find("#regLayerBtn").text("등록");

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
							var isNumeric = xeusBigdata.isNumericField(json.column[i].dataType);
							var dataType = "numeric";
							if(!isNumeric) dataType = "notnumeric";

							if(xeusBigdata.isDataField(key, lyr)){
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

								if(xeusBigdata.isDataField(key, lyr)){
									$bodyTr.append("<td>" + _common.utils.validNull(list[i][key]) + "</td>");
								}

							}
						}
					}

					$tbody.append($bodyTr);
				}

				$headTr.find("th[datatype=notnumeric]").css("cursor", "not-allowed");
				$headTr.find("th[datatype=numeric]").css("cursor", "pointer").click(function(){
					var idx = $(this).index();
					var knm = $(this).text();
					var col = $(this).attr("col");
					$("#weightSetTable").find("#regLayerBtn").text("등록");
					if(!_common.utils.isNullAndEmpty(col)){

						$("#weightSetTable").find("#selectField").text(knm);
						$("#weightSetTable").find("#selectField").attr("krName", krName);
						$("#weightSetTable").find("#selectField").attr("enName", enName);
						$("#weightSetTable").find("#selectField").attr("krField", knm);
						$("#weightSetTable").find("#selectField").attr("enField", col);
						$("#weightSetTable").find("input.buffer").val(0);
						$("#weightSetTable").find("input.weight").val(0);
						$("#weightSetTable").find("select.opeStr").find("option").eq(0).prop("selected", "selected");
						$tbody.find("tr").each(function(){
							$(this).find("td").removeClass("themeFc").addClass("themeBgTc");
							$(this).find("td").eq(idx).addClass("themeFc").removeClass("themeBgTc");
						});

						if(enName in bigdataAnalyWeight){
							if(col in bigdataAnalyWeight[enName]){
								$("#weightSetTable").find("input.buffer").val(bigdataAnalyWeight[enName][col]["impactM"]);
								$("#weightSetTable").find("input.weight").val(bigdataAnalyWeight[enName][col]["weightVal"]);
								$("#weightSetTable").find("select.opeStr").find("option").each(function(){
									if($(this).val() == bigdataAnalyWeight[enName][col]["opeStr"]){
										$(this).prop("selected", "selected");
									}
								});

								$("#weightSetTable").find("#regLayerBtn").text("저장");
							}
						}
					}
				});

				if($("#columnWrap").hasClass("ui-dialog-content")){
					$("#columnWrap").dialog("open");
				}else{
					$("#columnWrap").dialog({
						title: "옵션 설정",
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

				//$("#dragWrap").hide();

				if(!_common.utils.isNullAndEmpty(enField)){
					if(enName in bigdataAnalyWeight){
						if(enField in bigdataAnalyWeight[enName]){
							//$("#weightTable").find("th[col=" + enField + "]").click();
							$("#weightTable").find("th").each(function(){
								if($(this).attr("col") == enField){
									$(this).click();
								}
							});
							$("#weightSetTable").find("input.buffer").val(bigdataAnalyWeight[enName][enField]["impactM"]);
							$("#weightSetTable").find("input.weight").val(bigdataAnalyWeight[enName][enField]["weightVal"]);
							$("#weightSetTable").find("select.opeStr").find("option").each(function(){
								if($(this).val() == bigdataAnalyWeight[enName][enField]["opeStr"]){
									$(this).prop("selected", "selected");
								}
							});

							$("#weightSetTable").find("#regLayerBtn").text("저장");
						}
					}
				}

			}, false);

		}
	},

	/**
	 * 레이어와 범례를 생성합니다.
	 *
	 * @param krName
	 * @param enName
	 * @param krField
	 * @param enField
	 */
	createLayer : function(krName, enName, krField, enField){
		var name = krName + " - " + krField;
		var lyr = enName;

		var color = chroma.random().rgb().toString();
		//var isExcel = $(".dragTr[lyr=" + enName + "]").hasClass("isExcel");
		var isExcel = false;
		var isExists = false;
		if(k){
			if(bigdataLayerSet[enName][enField]["isExists"] == "t") isExists = true;
		}else{
			isExists = true;
		}

		if(_common.utils.isNullAndEmpty(lyr)){
			console.error("Key 없음");
		}else{
			var isContains = false;
			var $containDiv = null;
			$("#analysWrap").find(".legends").each(function(){
				if($(this).attr("key") == enName){
					isContains = true;
					$containDiv = $(this);
				}
			});

			if(GMXMAP.getLayer(lyr)) GMXMAP.getLayer(lyr).setVisible(true);
		}

		var $shortcut = $("");
		var checked = "checked"; if(k) checked = "";
		var $div = $("<div class='legends'></div>").attr("key", lyr).attr("lyr", lyr);
		var $layer = $("<p></p>").append("<input type='checkbox' lyr='" + lyr + "' id='" + lyr + "' col='" + enField + "' class='layer' " + checked + ">")
								//.append("<img lyr='" + lyr + "' col='" + enField + "' class='lyrDel' src='./res/img/delete_over.png'>")
								.append("<button lyr='" + lyr + "' col='" + enField + "' class='lyrDel btn_Dstyle2'>제거</button>")
								.append("<button lyr='" + lyr + "' col='" + enField + "' class='mngBtn detailBtn btn_style2'>설정</button>")
								.append($shortcut)
								.append("<label for='" + lyr + "'>" + name + "</label>")
								.append("<div><input type='number' class='layerWeight' min='0' max='100' step='10' value='0' lyr='" + lyr + "' col='" + enField + "' ><b> %</b></div>");

		if(!isExists){
			$layer.find("input[type=checkbox]").remove();
			$layer.find("button.detailBtn").remove();
			$layer.find("div").remove();
			$layer.find("label").css("text-decoration", "line-through").text(krName + " (삭제된 레이어)");
		}

		if(GMXMAP.getLayer(lyr) != null) $layer.find("input.layer").prop("checked", GMXMAP.getLayer(lyr).getVisible());

		$layer.find("div").css({
			"position": "absolute",
		    "top": "4px",
		    "right": "0px",
		    "width": "70px"
		});
		//$layer.find("img.lyrDel").css({"margin-left" : "22px", "vertical-align" : "middle" });
		$layer.find("button.lyrDel").css({"padding" : "4px"});
		$layer.find("button.detailBtn").css({"padding" : "4px"});
		$layer.find("input[type=number]").css({"width": "45px",}).change(function(){
			xeusBigdata.validLayerWeight(enName, enField, $(this).val());
		}).keydown(function(){
			xeusBigdata.validLayerWeight(enName, enField, $(this).val());
		}).keyup(function(){
			xeusBigdata.validLayerWeight(enName, enField, $(this).val());
		}).click(function(){
			xeusBigdata.validLayerWeight(enName, enField, $(this).val());
		});

		if(bigdataLayerSet[enName] && isExists){
			if(bigdataLayerSet[enName][enField]){
				var layerWeight = bigdataLayerSet[enName][enField]["weightVal"];
				if(!_common.utils.isNullAndEmpty(layerWeight)){
					if(!isNaN(Number(layerWeight))){
						var val = Number(layerWeight) * 100;
						$layer.find(".layerWeight").each(function(){
							if($(this).attr("lyr") == enName && $(this).attr("col") == enField){
								$(this).val(val);
							}
						});
						//$layer.find(".layerWeight[lyr=" + enName + "][col=" + enField + "]").val(val);
					}
				}
			}
		}

		$layer.css("position", "relative");
		$layer.find("label").css("vertical-align", "middle");

		if(isContains){
			$layer.find("input[type=checkbox]").hide();
			$layer.find("button.lyrDel").css("margin-left", "27px");
			$containDiv.append($layer);
		}else{
			$div.append($layer);
			$("#analysWrap").append($div);
		}

		$layer.find("input.layer").css("margin-right", "5px").change(function(){
			var key = $(this).attr("lyr");

			if($(this).is(":checked")){
				if(GMXMAP.getLayer(lyr)) GMXMAP.getLayer(lyr).setVisible(true);
				$(this).parent().next().find("input[type=checkbox]").prop("checked", true);
			}else{
				if(GMXMAP.getLayer(lyr)) GMXMAP.getLayer(lyr).setVisible(false);
				$(this).parent().next().find("input[type=checkbox]").prop("checked", false);
			}
		});

		$layer.find("button.lyrDel").click(function(){
			var nm = $(this).parent().find("label").text();
			var lyr = $(this).attr("lyr");
			var col = $(this).attr("col");
			if(confirm("선택하신 데이터를 분석 목록에서 제외하시겠습니까?")){
				delete bigdataLayerSet[lyr][col];
				delete bigdataAnalyWeight[lyr][col];

				if(JSON.stringify(bigdataLayerSet[lyr]) == "{}")	delete bigdataLayerSet[lyr];
				if(JSON.stringify(bigdataAnalyWeight[lyr]) == "{}") delete bigdataAnalyWeight[lyr];

				$(".legends").find("label").each(function(){
					if($(this).text() == nm){
						var $parentDiv = $(this).parent().parent();
						$(this).parent().remove();

						if($parentDiv.children().length == 0){
							if(GMXMAP.getLayer(lyr)) GMXMAP.getLayer(lyr).setVisible(false);
							$parentDiv.remove();
						}else{
							$parentDiv.find("p").each(function(){
								$(this).find("input[type=checkbox]").hide();
							});
							$parentDiv.find("p").eq(0).find("input[type=checkbox]").show();
							$parentDiv.find("p").eq(0).find("img.lyrDel").css("margin-left", "0px");
						}
					}
				});

				xeusBigdata.validLayerWeight(enName, enField);
			}
		});

		if(isExcel) $layer.find("button.detailBtn").addClass("isExcel");
		$layer.find("button.detailBtn").click(function(){
			var isExcel = $(this).hasClass("isExcel");
			var enField = $(this).attr("col");
			var skName = GMXLAYER.LayerList[enName].layer.schemNm;
			xeusBigdata.setDataTable(krName, enName, skName, enField);
		});

		xeusBigdata.validLayerWeight(enName, enField);

		$("#layerWeightHintTxt").css("padding", "25px 0px");

		if(!isExists) delete bigdataLayerSet[enName];

	},

	/**
	 * 레이어 가중치를 검증합니다.
	 *
	 * @returns {Boolean}
	 */
	validLayerWeight : function(enName, enField, weightVal){
		var result = false;

		if($("#analysWrap").find(".legends").length == 0){
			//$("#layerWeightHintTxt").css("color", "black");
			$("#layerWeightHintTxt").text("레이어를 추가해 주세요.");
		}else{
			var layerWeightVal = 0;
			$("#analysWrap").find("input[type=number]").each(function(){
				layerWeightVal += Number($(this).val());
			});
			//$("#layerWeightHintTxt").text("최대 100% 레이어 가중치 중 " + layerWeightVal + "% 설정완료");
			if(layerWeightVal > 100){
				//$("#layerWeightHintTxt").css("color", "red");
				$("#layerWeightHintTxt").text("최대 100% 레이어 가중치 중, " + layerWeightVal + "% 설정완료 ").append("<b style='color:red;'>(분석 불가능)</b>");
			}else if(layerWeightVal < 100){
				//$("#layerWeightHintTxt").css("color", "red");
				$("#layerWeightHintTxt").text("최대 100% 레이어 가중치 중, " + layerWeightVal + "% 설정완료 ").append("<b style='color:red;'>(분석 불가능)</b>");
			}else if(layerWeightVal == 100){
				//$("#layerWeightHintTxt").css("color", "none");
				$("#layerWeightHintTxt").text("최대 100% 레이어 가중치 중, " + layerWeightVal + "% 설정완료 (분석 가능)");
				result = true;
			}

			if(bigdataLayerSet[enName]){
				if(bigdataLayerSet[enName][enField]){
					if(weightVal){
						var val = weightVal;
						if(Number(weightVal) == 100) val = "1";
						if(Number(weightVal) < 100) val = "0." + weightVal;
						if(Number(weightVal) < 10) val = "0.0" + weightVal;
						bigdataLayerSet[enName][enField]["weightVal"] = val;
					}
				}
			}
		}

		return result;
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
	},

	/**
	 * 결과 테이블을 생성합니다.
	 *
	 * @param offset
	 * @param limit
	 * @param sortTyp
	 */
	setResultTable : function(offset, limit, sortTyp){
		if(k && fk && tbl){
			if(!limit) limit = 10;
			if(!offset) offset = 0;
			if(!sortTyp) sortTyp = $("#resultWrap").find("#resultTableWrap").find("#sortTyp").val();

			var _param = { tblId : tbl, limit : limit, offset : offset, sortCol : "result_val", sortTyp : sortTyp };
			_common.callAjax("/bigData/getDetailResult.json", _param, function(json){
				var allCnt = json.count;
				var length = json.result.length;
				var list = json.result;

				$("#resultWrap").find("#resultTableWrap").find("#max").val(allCnt);
				$("#resultWrap").find("#resultTableWrap").find("#offset").val(offset);

				$("#resultWrap").find("#resultTableWrap").find(".paging_wrap").paging({
					current	  : 10,
					max  	  : Number($("#resultWrap").find("#resultTableWrap").find("#max").val()),
					nowOffset : Number($("#resultWrap").find("#resultTableWrap").find("#offset").val()),
					bindEvent : xeusBigdata.setResultTable
				});

				var $tbody = $("#resultWrap").find("#resultTableWrap").find("table").find("tbody");
				$tbody.html("");

				for(var i=0; i<length; i++){
					var resultVal = list[i].resultVal;
					var jibnAddr = list[i].jibnAddr;

					var $tr = $("<tr class='tCenter'></tr>");
					var $td1, $td2, $td3 = null;
					$td1 = $("<td>" + resultVal + "</td>");
					$td2 = $("<td>" + jibnAddr + "</td>");
					$td3 = $("<td><button class='locBtn btn_Dstyle2' jibn='" + jibnAddr + "' tmx='" + list[i].tmx + "' tmy='" + list[i].tmy + "'>이동</button></td>");

					$td3.find(".locBtn").click(function(){
						var center = [Number($(this).attr("tmx")), Number($(this).attr("tmy"))];
						var jibn = _common.utils.validNull($(this).attr("jibn"));
						/*GMXMAP.getView().setCenter(center);
						GMXMAP.getView().setZoom(19);*/
						GMXMAP.addPulse(center, true);
					});

					$tr.append($td1).append($td2).append($td3);
					$tr.find("td").css("padding", "0px");
					$tbody.append($tr);
				}

				if(allCnt == 0){
					var $tr = $("<tr class='tCenter'></tr>");
					var $td1 = $("<td colspan='3'>분석결과가 존재하지 않습니다.</td>");

					$tr.append($td1);
					$tbody.append($tr);
				}

				$("#resultWrap").show();
			});
		}
	}


}