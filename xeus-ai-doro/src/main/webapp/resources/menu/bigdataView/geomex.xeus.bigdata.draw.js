(function(){

	var isLoadLayer = false;
	var loadLayerId = null;
	var $columnTable;

	$(".contentWrapper").find("#tableWrap").find("#first").show();

	var removeList = new Array();
	var mapLayers = GMXMAP.getLayers().getArray();
	for(var i=0; i<mapLayers.length; i++){
		if(mapLayers[i].get("fnGroup") == "TEMP"){
			mapLayers[i].getSource().clear();
			removeList.push(mapLayers[i]);
		}
	}
	for(var i=0; i<removeList.length; i++){
		GMXMAP.removeLayer(removeList[i]);
	}
	removeList = null;
	mapLayers = null;

	/**
	 * 기존 내용을 파싱합니다.
	 */
	function parseData(json){
		var head = json.head;
		var body = json.body;

		$(".contentWrapper").find("#columnTable").find("tr").remove();
		for(var i=0; i<(head.length - 1); i++){
			$(".contentWrapper").find("#addField").click();
			var fieldNm = Object.keys(head[i])[0];

			$(".contentWrapper").find("#columnTable")
							 .find("thead")
							 .find("tr:eq(0)")
							 .find("th:eq(" + i + ")")
							 .find("input")
							 .val(fieldNm);
		}

		for(var i=0; i<body.length; i++){
			$(".contentWrapper").find("#addRow").click();
			for(var l=0; l<(head.length - 1); l++){
				var fieldNm = Object.keys(head[l])[0];
				$(".contentWrapper").find("#columnTable")
								 .find("tbody")
								 .find("tr:eq(" + i + ")").attr("wkt", body[i]["wkt"])
								 .find("td:eq(" + l + ")")
								 .find("input")
								 .val(body[i][fieldNm]);
			}
		}
	}

	/**
	 * 불러오기 이벤트 입니다.
	 */
	_common.callAjax("/bigData/getDrawUserLayers.json", {  }, function(json){
		var $tbody = $(".contentWrapper").find("#loadWrap").find("#myLayers").find("tbody");
		if(json.result.length > 0){
			$tbody.html("");
			for(var i=0; i<json.result.length; i++){
				var $layerNm = $("<td>" + json.result[i].layerNm + "</td>");
				var $regDat = $("<td>" + new Date().formatDate(json.result[i].regDat) + "</td>");
				var $mng = $("<td><button class='innerBtn delLayerBtn hidden btn_t'>삭제</button><button class='innerBtn loadLayerBtn btn_t'>불러오기</button></td>");
				$mng.find("button").data(json.result[i]);

				var $tr = $("<tr class='tCenter'></tr>").append($layerNm).append($regDat).append($mng);
				$tbody.append($tr);
			}

			$tbody.find(".loadLayerBtn").click(function(){
				var prop = $(this).data();
				$(".contentWrapper").find("#first").find("#layerId").val(prop["layerNm"]);
				parseData(JSON.parse(prop["attrJson"]));

				isLoadLayer = true;
				loadLayerId = prop["layerId"];
			});

			/*$tbody.find(".delLayerBtn").click(function(){
				var prop = $(this).data();
				var delProp = { "layerId" : prop["layerId"], "layerNm" : prop["layerNm"] };
				confirm(prop["layerNm"] + " 레이어를 물리적으로 삭제하시겠습니까?", function(){
					_common.callAjax("/bigData/delUserLayer.json", delProp, function(json){
						if(json.result){
							setLayers();
							alert("삭제되었습니다.");
						}
					});
				});
			})*/
		}
	}, false);

	$(".contentWrapper").find("#tableWrap").find(".prevBtn, .nextBtn").click(function(){
		var isPrev = $(this).hasClass("prevBtn");
		var isNext = $(this).hasClass("nextBtn");
		var target = $(this).attr("for");

		var layerId = $(".contentWrapper").find("#tableWrap").find("#layerId").val();
		if(target == "#second" && isNext){
			if(_common.utils.isNullAndEmpty(layerId)){
				sysAlert("레이어명을 입력해주세요.");
				$(".contentWrapper").find("#tableWrap").find("#layerId").focus();
				return false;
			}
		}
		/*if(target == "#second" && isPrev){
			if($(".contentWrapper").find("#geometryTable").find("tbody").find("tr").find("img.check:visible").length > 0){
				if(sysConfirm("이전으로 돌아가시겠습니까?\n작업된 공간정보는 모두 삭제됩니다.")){
					if(Public.BIGDATA.Geometry.vector){
						Public.BIGDATA.Geometry.vector.getSource().clear();
					}
				}else{
					return false;
				};
			}
		}*/
		if(target == "#third"){
			if($(".contentWrapper").find("#columnTable").find("th").length == 0){
				sysAlert("필드를 추가해주세요.");
				return false;
			}
			if($(".contentWrapper").find("#columnTable").find("td").length == 0){
				sysAlert("로우를 추가해주세요.");
				return false;
			}
			var isEmpty = false;
			var isSpace = false;
			var isLong = false;
			var isSpecial = false;
			var isContain = false;
			$(".contentWrapper").find("#columnTable").find("th").each(function(){
				var val = $(this).find("input[type=text]").val();
				if(_common.utils.isNullAndEmpty(val)){
					$(this).find("input[type=text]").focus();
					isEmpty = true;
					return false;
				}

				if(val.search(/\s/) != -1){
					$(this).find("input[type=text]").focus();
					isSpace = true;
					return false;
				}

				var specialPattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
				if(specialPattern.test(val) == true){
					$(this).find("input[type=text]").focus();
					isSpecial = true;
					return false;
				}

				if(val.length > 15){
					$(this).find("input[type=text]").focus();
					isLong = true;
					return false;
				}

				var containCnt = 0;
				$(".contentWrapper").find("#columnTable").find("th").find("input[type=text]").each(function(){
					if($(this).val() == val){
						containCnt++;
					}
				});
				if(containCnt > 1) isContain = true;
			});
			$(".contentWrapper").find("#columnTable").find("td").each(function(){
				var val = $(this).find("input[type=text]").val();
				if(_common.utils.isNullAndEmpty(val)){
					$(this).find("input[type=text]").focus();
					isEmpty = true;
					return false;
				}
			});
			if(isSpace){
				sysAlert("필드명은 공백을 허용하지 않습니다.");
				return false;
			}
			if(isLong){
				sysAlert("필드명은 15자 미만으로 입력해주세요.");
				return false;
			}
			if(isContain){
				sysAlert("필드명은 서로 고유해야 합니다.");
				return false;
			}
			if(isSpecial){
				sysAlert("필드명은 모든 특수문자를 허용하지 않습니다.");
				return false;
			}
			if(isEmpty){
				sysAlert("테이블의 모든 항목은 빈값을 허용하지 않습니다.");
				return false;
			}

			if(Public.BIGDATA.Geometry.vector){
				var features = Public.BIGDATA.Geometry.vector.getSource().getFeatures();
				for(var i=0; i<features.length; i++){
					Public.BIGDATA.Geometry.vector.getSource().removeFeature(features[i]);
				}
			}
		}

		$(this).parent().parent().parent().hide("blind", function(){
			$(".contentWrapper").find("#tableWrap").find(target).show("blind");
		});
	});

	/**
	 * 필드 추가 이벤트 입니다.
	 */
	$(".contentWrapper").find("#addField").click(function(){
		var $tbl = $(".contentWrapper").find("#columnTable");
		var $thead = $tbl.find("thead");
		if($thead.find("tr").length == 0){
			$thead.append("<tr></tr>");
			$("#columnTable").prev().hide();
		}
		var $tr = $tbl.find("thead").find("tr").eq(0);
		if($tr.find("th").length < 3){
			var $input = $("<input type='text' class='wide'>").css({
				"background" : "none",
				"font-weight" : "bold",
				"text-align" : "center",
//				"border" : "none",
//				"border-bottom" : "1px solid #999"
			}).focus(function(){
				$(this).css("border-bottom", "1px solid #fff");
			}).blur(function(){
				$(this).css("background", "none");
			});
			var $close = $("<img class='close' src='./res/img/btn_close_w.png'>").css({
				"position": "absolute",
				"top": "10px",
				"right": "2px",
				"cursor": "pointer",
				"z-index": "1",
				"width" : "12px",
				"height" : "12px"
			}).click(function(){
				var removeIdx = $tr.find("th").index($(this).parent());
				var fieldNm = $(this).prev().val();
				confirm(fieldNm + " 필드 및 데이터를 제거하시겠습니까?", function(){
					$tr.find("th").eq(removeIdx).remove();

					$tbl.find("tbody").find("tr").each(function(){
						var $cpClose = $(this).find("td").eq(removeIdx).find("img");

						$(this).find("td").eq(removeIdx + 1).append($cpClose);
						$(this).find("td").eq(removeIdx).remove();

					});
				});
			});
			var $td = $("<th></th>").css({
				"position" : "relative"
			}).append($input).append($close);

			$tr.append($td);

			/* tbody 필드추가 */
			var $tbody = $tbl.find("tbody");
			var tdSize = $tr.find("th").length;
			$tbl.find("tbody").find("tr").each(function(){
				if($(this).find("td").length != tdSize){
					for(var i=0; i<tdSize; i++){
						if($(this).find("td").eq(i).length == 0){
							var $input = $("<input type='text' class='wide'>").css({
//								"background" : "white",
//								"font-weight" : "bold",
								"text-align" : "center",
//								"border-bottom" : "1px solid #999",
								"padding" : "5px 0"
							}).keydown(function(e){
								var idx = $(this).parent().parent().find("td").index($(this).parent());
								var key = e.which;
								switch(key){
									case 38 : //up
										$(this).parent().parent().prev().find("td").eq(idx).find("input").focus();
										break;
									case 37 : //left
										$(this).parent().prev().find("input").focus();
										break;
									case 39 : //right
										$(this).parent().next().find("input").focus();
										break;
									case 40 : //down
										$(this).parent().parent().next().find("td").eq(idx).find("input").focus();
										break;
									case 13 : //enter
										$(this).parent().parent().next().find("td").eq(idx).find("input").focus();
									default : //none
										break;
								}
							});

							var $td = $("<td></td>").css({
								"position" : "relative"
							}).append($input);

							$(this).append($td);
						}
					}
				}
			});
		}else{
			alert("필드는 총 3개까지 생성할 수 있습니다.");
			return false;
		}
	});

	/**
	 * 로우 추가 이벤트 입니다.
	 */
	$(".contentWrapper").find("#addRow").click(function(){
		var $tbl = $(".contentWrapper").find("#columnTable");
		var $thead = $tbl.find("thead");
		if($thead.find("tr").length == 0){
			alert("필드가 존재하지 않아 로우를 추가할 수 없습니다.<br><br>필드를 추가해주세요.");
			return false;
		}

		var $tbody = $tbl.find("tbody");

		var $tr = $("<tr></tr>");
		$tbl.find("thead").find("tr").find("th").each(function(i, e){
			var $input = $("<input type='text' class='wide'>").css({
//				"background" : "white",
				"font-weight" : "bold",
				"text-align" : "center",
//				"border-bottom" : "1px solid #999;",
				"padding" : "5px 0"
			}).keydown(function(e){
				var idx = $(this).parent().parent().find("td").index($(this).parent());
				var key = e.which;
				switch(key){
					case 38 : //up
						$(this).parent().parent().prev().find("td").eq(idx).find("input").focus();
						break;
					case 37 : //left
						$(this).parent().prev().find("input").focus();
						break;
					case 39 : //right
						$(this).parent().next().find("input").focus();
						break;
					case 40 : //down
						$(this).parent().parent().next().find("td").eq(idx).find("input").focus();
						break;
					case 13 : //enter
						$(this).parent().parent().next().find("td").eq(idx).find("input").focus();
						break;
					default : //none
						break;
				}
			});

			var $td = $("<td></td>").css({
				"position" : "relative"
			}).append($input);

			if(i == 0){
				var $close = $("<img class='close' src='./res/img/btn_close_w.png'>").css({
					"position": "absolute",
					"top": "10px",
					"left": "2px",
					"cursor": "pointer",
					"z-index": "1",
					"width" : "12px",
					"height" : "12px"
				}).click(function(){
					var removeIdx = $tbody.find("tr").index($(this).parent().parent());
					confirm("선택하신 로우를 제거하시겠습니까?", function(){
						$tbody.find("tr").eq(removeIdx).remove();
						if(Public.BIGDATA.Geometry.vector){
							var features = Public.BIGDATA.Geometry.vector.getSource().getFeatures();
							for(var l=0; l<features.length; l++){
								var prop = features[l].getProperties();
								if(Number(prop["trIdx"]) == removeIdx){
									Public.BIGDATA.Geometry.vector.getSource().removeFeature(features[l]);
								}
							}
						}
					});
				});

				$td.append($close);
			}

			$tr.append($td);

			$tbody.append($tr);
		});

	});

	/**
	 * 공간정보 설성 이벤트 입니다.
	 */
	$(".contentWrapper").find("#drawStartBtn").click(function(){
		$columnTable = null;
		$columnTable = $(".contentWrapper").find("#columnTable").clone();
		$columnTable.find("img.close").remove();
		$columnTable.find("input").prop("readonly", "readonly");

		$(".contentWrapper").find("#geometryTable").html("");
		$(".contentWrapper").find("#geometryTable").append($columnTable.find("thead").clone());
		$(".contentWrapper").find("#geometryTable").append($columnTable.find("tbody").clone());

		$(".contentWrapper").find("#geometryTable").find("thead").find("tr").eq(0).append("<th width='140px'>공간정보<input type='hidden' value='wkt'></th>");
		$(".contentWrapper").find("#geometryTable").find("tbody").find("tr").each(function(i, e){

			var loadWkt = $(".contentWrapper").find("#columnTable").find("tbody").find("tr:eq(" + i + ")").attr("wkt");
			var isNotParse = _common.utils.isNullAndEmpty(loadWkt);
			var $check = $("<img class='check' src='./res/img/check.png'>").css({
				"position": "absolute",
				"top": "6px",
				"left": "2px",
				"z-index": "1",
				"width" : "20px",
				"height" : "20px",
				"cursor" : "pointer",
				"display" : "none"
			});

			$(this).find("td").eq(0).append($check);
			var $td = $("<td class='tCenter'></td>");
			$td.append("<input type='hidden' idx='" + i + "' value=''>");

			var drawTxt = "그리기";
			if(!isNotParse){
				drawTxt = "다시 그리기";
				Public.BIGDATA.Geometry.DrawStart(i, loadWkt);
				$td.find("input[type=hidden]").val(loadWkt);
			}else{
				if(Public.BIGDATA.Geometry.vector){
					var features = Public.BIGDATA.Geometry.vector.getSource().getFeatures();
					for(var l=0; l<features.length; l++){
						var prop = features[l].getProperties();
						if(Number(prop["trIdx"]) == i){
							drawTxt = "다시 그리기";
							$check.show();

							var format = new ol.format.WKT();
							var wkt = format.writeGeometry(features[l].getGeometry());
							$td.find("input[type=hidden]").val(wkt);
						}
					}
				}
			}
			$td.append("<button class='innerBtn drawStartBtn btn_t' idx='" + i + "'>" + drawTxt + "</button>");
			$td.append("<button class='innerBtn drawHoleStartBtn btn_t' idx='" + i + "'>홀 그리기</button>");

			$(this).append($td);
		});
		$(".contentWrapper").find("#geometryTable").find("tbody").find("tr").find("button.drawStartBtn").click(function(){
			Public.BIGDATA.Geometry.DrawStart($(this).attr("idx"));
		});
		$(".contentWrapper").find("#geometryTable").find("tbody").find("tr").find("button.drawHoleStartBtn").click(function(){
			$(".contentWrapper").find("#geometryTable").find("tbody").find("tr").eq($(this).attr("idx")).find("img.check").click();
			Public.BIGDATA.Geometry.DrawHoleStart($(this).attr("idx"));
		});

		var thLength = $(".contentWrapper").find("#geometryTable").find("thead").find("tr").find("th").length;
		$(".contentWrapper").find("#geometryTable").find("tbody").append("<tr class='ignore'><th colspan='" + thLength + "' id='drawCncl' class='hidden pointer'>그리기를 종료하시려면 여기를 눌러주세요.</th></tr>");
		$(".contentWrapper").find("#geometryTable").find("tbody").find("#drawCncl").click(function(){
			if(Public.StopEvent) Public.StopEvent();
		})
	});

	/**
	 * 저장 이벤트 입니다.
	 */
	$(".contentWrapper").find("#saveBtn").click(function(){
		if($(".contentWrapper").find("#geometryTable").find("tbody").find("tr").find("img.check:hidden").length > 0){
			sysAlert("모든 필드의 공간정보를 그려주세요.");
			return false;
		}

		var result = {};
		result["head"] = new Array();
		result["body"] = new Array();
		result["title"] = $(".contentWrapper").find("#layerId").val();

		var column = new Array();
		$(".contentWrapper").find("#geometryTable").find("thead").find("tr").eq(0).find("th").each(function(thIdx){
			if($(this).find("input").length > 0){
				var values = {};
				values[$(this).find("input").val()] = "string";
				column.push($(this).find("input").val());

				var isNumber = true;
				$(".contentWrapper").find("#geometryTable").find("tbody").find("tr").not(".ignore").each(function(){
					if(!$(this).hasClass("ignore")){
						$(this).find("td").each(function(i, e){
							if(thIdx == i){
								if($(this).find("input").length > 0){
									if(!_common.utils.isNumber(Number($(this).find("input").val()))){
										isNumber = false;
									}
								}
							}
						})
					}
				});
				if(isNumber) values[$(this).find("input").val()] = "numeric";

				result["head"].push(values);
			}
		});

		$(".contentWrapper").find("#geometryTable").find("tbody").find("tr").not(".ignore").each(function(){
			if(!$(this).hasClass("ignore")){
				var values = {};
				$(this).find("td").each(function(i, e){
					if($(this).find("input").length > 0){
						values[column[i]] = $(this).find("input").val();
					}
				})
				result["body"].push(values);
			}
		});

		var mode = "add";
		if(isLoadLayer) mode = "edit";

		confirm(result["title"] + " 레이어를 저장하시겠습니까?", function(){
			_common.callAjax("/bigData/createUserLayer.json", { "json" : JSON.stringify(result), "mode" : mode, "layerId" : loadLayerId }, function(json){
				if(json.result){
					$(".tabTitle").find(".tab").eq(0).click();
					alert("<br>레이어가 저장되었습니다.");
					isLoadLayer = false;
					loadLayerId = null;
				}
			})
		});
	});

	$(".contentWrapper").find("#layerId").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#first").find(".nextBtn").click();
		}
	});

})();