/**
 * 객체 통합 검색 이벤트 입니다.
 *
 * @author 이주영
 */
"use strict";

(function(GMXMAP, GMXLAYER, GMXLEGEND){
if(GMXMAP != null && GMXMAP instanceof ol.Map && GMXLAYER != null && GMXLEGEND != null){

	var $dialogSelector = $("#featureSearchInfoWrap");
	var $paging = null;
	var _LastSearchParameters = null;

	var endSearch = function(){
		GMXMAP.removeSpatialSearchOption();

		$dialogSelector.find("#searchResultTitle").text("");
		$dialogSelector.find("#featureSearchResult").html("");

		if($dialogSelector.find("#paging").length > 0 && $paging != null){
			$paging.pagination("destroy");
		}

		$dialogSelector.find("#featureSearchOptions").find("#featureSearchTargetLayer").html("");
		$dialogSelector.find("#featureSearchOptions").find("tbody").html("");

		$dialogSelector.find(".createSearchResultLayer").each(function(){ if(!$(this).hasClass("hidden")) $(this).addClass("hidden"); });
	}

	var refreshSearch = function(){
		$dialogSelector.find("#searchResultTitle").text("");
		$dialogSelector.find("#featureSearchResult").html("");

		if($dialogSelector.find("#paging").length > 0 && $paging != null){
			$paging.pagination("destroy");
		}

		$dialogSelector.find("#featureSearchOptions").find("#featureSearchTargetLayer").val("");
		$dialogSelector.find("#featureSearchOptions").find("tbody").html("");

		$dialogSelector.find(".createSearchResultLayer").each(function(){ if(!$(this).hasClass("hidden")) $(this).addClass("hidden"); });
	}

	/**
	 * <pre>
	 * 검색 대상 선택 셀렉트 박스 값을 추가합니다.
	 * </pre>
	 */
	var createSearchTargetSelect = function(setEmpty){
		var $select = $dialogSelector.find("#featureSearchOptions").find("#featureSearchTargetLayer");
		$select.children().remove();

		for(var i=0; i<GMXLAYER.GroupList.length; i++){
			var groupName = GMXLAYER.GroupList[i].grpNm;
			$select.append("<optgroup grpk='" + GMXLAYER.GroupList[i].mgrSeq + "' label='" + GMXLAYER.GroupList[i].grpNm + "'></optgroup>");
		}

		for(var key in GMXLAYER.LayerList){
			var $optgroup = $select.find("optgroup[grpk=" + GMXLAYER.LayerList[key].group.mgrSeq + "]");
			if(GMXLAYER.LayerList[key].layer.lyrTyp !== "T"){
				$optgroup.append("<option value='" + GMXLAYER.LayerList[key].layer.tblId + "'>" + GMXLAYER.LayerList[key].layer.lyrNm + "</optgroup>");
			}
		}

		$select.sortOptgroup();

		if(setEmpty) $select.val("");
	}

	/**
	 * 검색용 Parameter 객체를 생성합니다.
	 */
	var sendDataColletion = function(column, sendData){
		var param = GMXMAP.convertColumnTypeData(column);

		var kv = {};
		for(var key in sendData){
			kv[key] = sendData[key];
		}

		var resultData = GMXMAP.validData(column, kv);
		if(!resultData){
			return false;
		}else{
			for(var key in kv){
				kv[key] = resultData[key];
			}
		}

		var idx = 0;
		for(var key in kv){
			if(key === "geometry_wkt" || key === "geometry_lon" || key === "geometry_lat") continue;

			param["kv[" + idx + "][key]"] = key;
			param["kv[" + idx + "][val]"] = kv[key];
			idx++;
		}

		return param;
	}

	/**
	 * <pre>
	 * 선택된 컬럼 조건을 이용하여 검색 조건 항목을 추가합니다.
	 * </pre>
	 */
	var addSelectField = function(colData){
		var $selectTable = $dialogSelector.find("#featureSearchOptions");

		var schemaNm = colData.schemaNm;
		var tableId = colData.tableId;
		var layrNm = colData.lyrNm;

		var fieldUseType = colData.fieldUseType;
		var colId = colData.colId;
		var colNm = colData.colNm;
		if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

		if(!_common.utils.isNullAndEmpty(fieldUseType)){

			var $tr = $("<tr>");
			var $colTh = $("<th>").text(colNm);
			var $inputOrSelectTd = $("<td>").attr("colspan", 2);

			if(fieldUseType === "input"){

				var $input = $("<input>").attr("type", "text").attr("id", colId).addClass("sendData").data(colData);
				$inputOrSelectTd.append($input);

			}else if(fieldUseType === "select"){

				var _Param = { "col" : colId, "schema" : schemaNm, "table" : tableId };
				_common.callAjax("/GMT_column/getDistinctValue.json", _Param, function(json){
					var $select = $("<select>").attr("id", colId).addClass("sendData").data(colData);
					$select.append("<option value=''>선택</option>");
					for(var i=0; i<json.result.length; i++){
						$select.append("<option value='" + json.result[i] + "'>" + json.result[i] + "</option>");
					}
					$inputOrSelectTd.append($select);
				}, false);

			}

			$tr.append($colTh).append($inputOrSelectTd);
			$selectTable.find("tbody").append($tr);
		}
	}

	/**
	 * <pre>
	 * 필드선택 Dialog 객체를 생성합니다.
	 * </pre>
	 */
	var setFieldSelectDialog = function(schemaNm, tableId, lyrNm, column){
		if(column != null){
			if($("#fieldSelectWrap").length === 0) $("#body").append("<div id='fieldSelectWrap' class='dialogWrap customScroll table_style'></div>");

			var $tbl = $("<table>").append("<tbody>");
			var $tbody = $tbl.find("tbody");
			$tbody.append("<tr><th>컬럼명</th><th>검색 조건 선택</th><th>결과 보이기 선택</th></tr>")
			for(var i=0; i<column.length; i++){
				var colId = column[i].colId;
				if(colId !== "geometry" && colId !== "_geometry" && colId !== "_annox" && colId !== "_annoy" && colId !== "_gid"){
					var colNm = column[i].colNm;
					if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

					var $tr = $("<tr>");
					var $colTh = $("<th>").attr("k", colId).text(colNm);
					var $selectTd = $("<td>");
					var $fieldTd = $("<td>");

					var $select = $("<select>").addClass("fieldUseType").data(column[i]);
					$select.append("<option value=''>검색 조건에서 제외</option>");
					$select.append("<option value='select'>1. 고유 값 목록 중 선택</option>");
					$select.append("<option value='input'>2. 포함되는 단어를 직접 입력</option>");
					$select.find("option[value!='']").css("font-weight", "bold");

					var $selectOrInput = $("#featureSearchOptions").find("#" + colId);
					if($selectOrInput.length > 0){
						if($selectOrInput.is("select")) $select.find("option[value=select]").prop("selected", true);
						if($selectOrInput.is("input")) $select.find("option[value=input]").prop("selected", true);
					}

					var $field = $("<select>").addClass("fieldVisible").data(column[i]);
					$field.append("<option value=''>검색 결과에서 표현</option>");
					$field.append("<option value='N'>1. 검색 결과에서 제외</option>");
					$select.find("option[value!='']").css("font-weight", "bold");

					var $selectOrInput = $("#featureSearchOptions").find("#" + colId);
					if($selectOrInput.length > 0){
						if($selectOrInput.is("select")) $select.find("option[value=select]").prop("selected", true);
						if($selectOrInput.is("input")) $select.find("option[value=input]").prop("selected", true);
					}

					if("localStorage" in window){
						var visibleIgnoreFields = "GMXMAP@featureSearchInfo@" + tableId + "@visibleIgnoreFields";
						if(visibleIgnoreFields in localStorage){
							if(!_common.utils.isNullAndEmpty(localStorage[visibleIgnoreFields])){
								if(localStorage[visibleIgnoreFields].contains(colId)){
									$field.find("option").eq(1).prop("selected", true);
								}
							}
						}
					}

					$fieldTd.append($field);

					$selectTd.append($select);

					$tr.append($colTh).append($selectTd).append($fieldTd);

					$tbody.append($tr);
				}
			}
			$tbody.append("<tr><td colspan='3'><button class='btn_style' id='addFieldsBtn'>설정값을 검색 환경에 적용</button></td></tr>");

			//필드 추가 버튼 이벤트 입니다.
			$tbody.find("#addFieldsBtn").click(function(){
				var localStorageVo = new Array();

				var $selectTable = $dialogSelector.find("#featureSearchOptions");
				$selectTable.find("tbody").html("");

				$tbody.find(".fieldUseType").each(function(){
					var colData = $(this).data();
					var fieldUseType = $(this).val();
					var colId = colData.colId;
					var colNm = colData.colNm;
					if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

					if(!_common.utils.isNullAndEmpty(fieldUseType)){
						colData["fieldUseType"] = fieldUseType;
						colData["schemaNm"] = schemaNm;
						colData["tableId"] = tableId;
						colData["lyrNm"] = lyrNm;

						addSelectField(colData);

						localStorageVo.push(JSON.parse(JSON.stringify(colData)));
					}
				});

				var visibleIgnoreFields = new Array();
				$tbody.find(".fieldVisible").each(function(){
					var colData = $(this).data();
					var ignore = $(this).val() === "N" ? true : false;
					var colId = colData.colId;

					if(ignore) visibleIgnoreFields.push(colId);
				});

				$dialogSelector.find(".sendData").off("keyup").keyup(function(e){
					if(e.which == 13){
						$dialogSelector.find("#featureSearchBtn").click();
					}
				});

				$("#fieldSelectWrap").dialog("close");

				if("localStorage" in window) localStorage["GMXMAP@featureSearchInfo@" + tableId] = JSON.stringify(localStorageVo);
				if("localStorage" in window) localStorage["GMXMAP@featureSearchInfo@" + tableId + "@visibleIgnoreFields"] = visibleIgnoreFields.toString();
			});

			$("#fieldSelectWrap").html($tbl).dialog({
				title: lyrNm + " 검색 조건 필드 선택",
				modal: true,
				width: 600,
				height: "auto",
				maxHeight: $("#map").height(),
				position: {
					my: "center",
					at: "center",
					of: $("#map")
				},
				open: function(){

				},
				close: function(){
					$("#fieldSelectWrap").remove();
				}
			}).parent().draggable({
				containment: "#map",
				scroll: false
			});
		}
	}

	/**
	 * 검색 결과를 Table 에 표기합니다.
	 */
	var parseData = function(column, list, totalCount, sum){
		var titleText = "3. 검색 결과 (총 " + totalCount.toLocaleString("ko-KR") + "건)";

		var $resultTable = $dialogSelector.find("#featureSearchResult").html("");
		$resultTable.append("<thead>").append("<tbody>").append("<tfoot>");
		$resultTable.find("thead").append("<tr>");

		var columnLength = column.length;
		var selectLayerId = $dialogSelector.find("#featureSearchTargetLayer").val();
		var geometryType = GMXLAYER.LayerList[selectLayerId].geometryType.toUpperCase();

		//Head - Area And Length
		if(geometryType.contains("POINT")){
			var $lonTh = $("<th>").css("cursor", "no-drop").width(100).text("경도 (공간 연산)");
			var $latTh = $("<th>").css("cursor", "no-drop").width(100).text("위도 (공간 연산)");
			$resultTable.find("thead").find("tr").eq(0).append($lonTh).append($latTh);
		}else{
			var $areaAndLengthTh = $("<th>").css("cursor", "no-drop").width(100).text("면적 (공간 연산)");
			titleText = "3. 검색 결과 (총 " + totalCount.toLocaleString("ko-KR") + "건 / 총 면적 " + Math.floor(sum.geometry_area).toLocaleString("ko-KR") + "m2)";
			if(geometryType.contains("LINESTRING")){
				titleText = "3. 검색 결과 (총 " + totalCount.toLocaleString("ko-KR") + "건 / 총 길이 " + Math.floor(sum.geometry_length).toLocaleString("ko-KR") + "m)";
				$areaAndLengthTh.text("길이 (공간 연산)");
			}
			$resultTable.find("thead").find("tr").eq(0).append($areaAndLengthTh);
		}

		//Title
		$dialogSelector.find("#searchResultTitle").text(titleText);

		//Head - Columns
		for(var i=0; i<columnLength; i++){
			var colId = column[i].colId;
			if(colId === "geometry" || colId === "_geometry" || colId === "_gid" || colId === "_annox" || colId === "_annoy") continue;
			if("localStorage" in window){
				var tableId = $("#featureSearchTargetLayer").val();
				var visibleIgnoreFields = "GMXMAP@featureSearchInfo@" + tableId + "@visibleIgnoreFields";
				if(visibleIgnoreFields in localStorage){
					if(!_common.utils.isNullAndEmpty(localStorage[visibleIgnoreFields])){
						if(localStorage[visibleIgnoreFields].contains(colId)) continue;
					}
				}
			}

			var colNm = column[i].colNm;
			if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

			var $td = $("<th>").data("sortCol", colId).addClass("sortCol").addClass("pointer").text(colNm).width(100).click(function(){
				var sortCol = $(this).data("sortCol");
				if($resultTable.find("thead").find(".sortCol.active").length === 1){
					if(sortCol === $resultTable.find("thead").find(".sortCol.active").data("sortCol")){
						if(!($(this).hasClass("asc")) && !($(this).hasClass("desc"))){
							$(this).addClass("active").addClass("asc");
						}else if($(this).hasClass("asc")){
							$(this).removeClass("asc").addClass("desc");
						}else if($(this).hasClass("desc")){
							$(this).removeClass("active").removeClass("desc");
						}
					}else{
						$resultTable.find("thead").find(".sortCol").removeClass("active").removeClass("asc").removeClass("desc");
						if(!($(this).hasClass("asc")) && !($(this).hasClass("desc"))){
							$(this).addClass("active").addClass("asc");
						}else if($(this).hasClass("asc")){
							$(this).removeClass("asc").addClass("desc");
						}else if($(this).hasClass("desc")){
							$(this).removeClass("active").removeClass("desc");
						}
					}
				}else{
					if(!($(this).hasClass("asc")) && !($(this).hasClass("desc"))){
						$(this).addClass("active").addClass("asc");
					}else if($(this).hasClass("asc")){
						$(this).removeClass("asc").addClass("desc");
					}else if($(this).hasClass("desc")){
						$(this).removeClass("active").removeClass("desc");
					}
				}

				$dialogSelector.find("#featureSearchBtn").click();
			});

			$resultTable.find("thead").find("tr").eq(0).append($td);
		}

		//Body - Columns
		var limit = Number($("#limit").val());
		var format = new ol.format.WKT();
		for(var i=0; i<list.length; i++){
			$resultTable.find("tbody").append("<tr class='pointer'>");

			//Body - Area And Length
			if(geometryType.contains("POINT")){
				var $lonDiv = $("<div>").addClass("sText").text(list[i]["geometry_lon"]);
				var $latDiv = $("<div>").addClass("sText").text(list[i]["geometry_lat"]);
				var $lonTd = $("<td>").attr("title", list[i]["geometry_lon"]).append($lonDiv);
				var $latTd = $("<td>").attr("title", list[i]["geometry_lat"]).append($latDiv);
				$resultTable.find("tbody").find("tr").eq(i).append($lonTd).append($latTd);
			}else{
				var areaAndLengthVal = Math.floor(list[i]["geometry_area"]).toLocaleString("ko-KR");
				if(geometryType.contains("LINESTRING")) areaAndLengthVal = Math.floor(list[i]["geometry_length"]).toLocaleString("ko-KR");
				var $areaAndLengthDiv = $("<div>").addClass("sText").text(areaAndLengthVal);
				var $areaAndLengthTd = $("<td>").attr("title", areaAndLengthVal).append($areaAndLengthDiv);
				$resultTable.find("tbody").find("tr").eq(i).append($areaAndLengthTd);
			}

			for(var l=0; l<columnLength; l++){
				var colId = column[l].colId;
				if(colId === "geometry" || colId === "_geometry" || colId === "_gid" || colId === "_annox" || colId === "_annoy") continue;
				if("localStorage" in window){
					var tableId = $("#featureSearchTargetLayer").val();
					var visibleIgnoreFields = "GMXMAP@featureSearchInfo@" + tableId + "@visibleIgnoreFields";
					if(visibleIgnoreFields in localStorage){
						if(!_common.utils.isNullAndEmpty(localStorage[visibleIgnoreFields])){
							if(localStorage[visibleIgnoreFields].contains(colId)) continue;
						}
					}
				}

				var colVal = _common.utils.validNull(list[i][colId]);

				if(("geometry_wkt" in list[i]) && (!_common.utils.isNullAndEmpty(list[i].geometry_wkt))){
					try{
						var wktFeature = format.readFeature(list[i].geometry_wkt, { dataProjection: "EPSG:5186", featureProjection: "EPSG:5186" });
						if(wktFeature !== null) $resultTable.find("tbody").find("tr").eq(i).data(wktFeature);
					}catch(e){

					}
				}

				var $div = $("<div>").addClass("sText").text(colVal);
				var $td = $("<td>").attr("title", colVal).append($div);

				$resultTable.find("tbody").find("tr").eq(i).append($td);
			}
		}

		//Foot
		/*var $createSearchResultTableWrap = $dialogSelector.find("#createSearchResultTableWrap");
		if(!$createSearchResultTableWrap.hasClass("hidden")) $createSearchResultTableWrap.addClass("hidden");*/
		$dialogSelector.find(".createSearchResultLayer").each(function(){ if(!$(this).hasClass("hidden")) $(this).addClass("hidden"); });
		if(list.length > 0){
			$dialogSelector.find(".createSearchResultLayer").removeClass("hidden");
			$dialogSelector.find("#createSearchResultTableBtn").off("click").click(function(){
				var param = $(this).data();
				if(JSON.stringify(param) === "{}" || _common.utils.isNullAndEmpty(JSON.stringify(param))){
					alert("레이어를 생성 할 수 없습니다.\n\n관리자에게 문의하세요.");
					console.error(">> Empty Search Parameteres.");
					return false;
				}else{
					var layerNm = prompt("레이어 한글 명칭을 입력하세요.");
					if(layerNm != null) layerNm = layerNm.trimStart().trimEnd();
					if(!_common.utils.isNullAndEmpty(layerNm)){

						var layerInfo = GMXLAYER.LayerList[param["st[table]"]].layer;
						param["st[layerTyp]"] = layerInfo.lyrTyp;
						param["st[layerNm]"] = layerNm;

						if(confirm("검색 결과를 <" + layerNm + "> 명칭의 물리 레이어로 생성하시겠습니까?")){
							_common.callAjax("/GMT_column/createSearchResultLayer.json", param, function(json){
								if(json.result){
									endSearch();
									GMXLAYER.loadData().loadLayer(GMXMAP);
									GMXLEGEND.createLegends();
									createSearchTargetSelect(true);

									alert("물리 레이어를 생성하였습니다.\n\n생성 결과는 <범례>에서 확인 할 수 있습니다.");
								}
							});
						}
					}
				}
			});

			if(!(selectLayerId in GMXLAYER.LayerList)){
				alert("물리 레이어의 정보가 존재하지 않아 생성할 수 없습니다.");
				return false;
			}

			if((selectLayerId in GMXLAYER.LayerList) && GMXLAYER.LayerList[selectLayerId].isView){
				$dialogSelector.find("#createSearchResultViewTableBtn").css("cursor", "no-drop").off("click").click(function(){
					alert("참조 레이어는 재참조가 불가능합니다.");
					return false;
				});
			}else{
				$dialogSelector.find("#createSearchResultViewTableBtn").css("cursor", "pointer").off("click").click(function(){
					var param = $(this).data();
					if(JSON.stringify(param) === "{}" || _common.utils.isNullAndEmpty(JSON.stringify(param))){
						alert("레이어를 생성 할 수 없습니다.\n\n관리자에게 문의하세요.");
						console.error(">> Empty Search Parameteres.");
						return false;
					}else{
						var layerNm = prompt("레이어 한글 명칭을 입력하세요.");
						if(layerNm != null) layerNm = layerNm.trimStart().trimEnd();
						if(!_common.utils.isNullAndEmpty(layerNm)){

							var layerInfo = GMXLAYER.LayerList[param["st[table]"]].layer;
							param["st[layerTyp]"] = layerInfo.lyrTyp;
							param["st[layerNm]"] = layerNm;

							if(confirm("검색 결과를 <" + layerNm + "> 명칭의 참조 레이어로 생성하시겠습니까?")){
								_common.callAjax("/GMT_column/createSearchResultViewLayer.json", param, function(json){
									if(json.result){
										endSearch();
										GMXLAYER.loadData().loadLayer(GMXMAP);
										GMXLEGEND.createLegends();
										createSearchTargetSelect(true);

										alert("참조 레이어를 생성하였습니다.\n\n생성 결과는 <범례>에서 확인 할 수 있습니다.");
									}
								});
							}
						}
					}
				});
			}

			$dialogSelector.find("#createSearchResultExcelBtn").off("click").click(function(){
				delete _LastSearchParameters["st[limit]"];
				delete _LastSearchParameters["st[offset]"];

				_common.postForm.submit("/GMT_column/createExcel.json", _LastSearchParameters);
				GMXMAP.addMapNotification("요청하신 엑셀 결과물이 잠시후 자동 다운로드 됩니다.", 3000);
			});
		}

		//TR 선택시 위치를 이동합니다.
		$resultTable.find("tbody").find("tr").click(function(){
//			$resultTable.find("tbody").find("tr").css("background-color", "#282828");
//			$(this).css("background", "#333");

			var feature = $(this).data();
			if(feature != null){
				if($dialogSelector.parent().find(".ui-dialog-titlebar").data("isFullWidth")) $dialogSelector.parent().find(".ui-dialog-titlebar").dblclick();
				if("getGeometry" in feature){
					if(feature.getGeometry().getType() === "Point"){
						GMXMAP.addPulse(feature.getGeometry().getCoordinates(), true);
					}else{
						GMXMAP.addHighLight(feature, true);
					}
				}else{
					GMXMAP.addMapNotification("해당 객체는 위치 정보가 존재하지 않습니다.");
				}
			}
		});
	}

	/**
	 * <pre>
	 * 엘리먼트의 이벤트를 바인딩 합니다.
	 *
	 * 만약 셀렉트박스 선택시 localStorage 에 해당 레이어 정보가 있을 경우,
	 * 이전 설정을 불러옵니다.
	 * </pre>
	 */
	var bindEvent = function(){
		var $selectTable = $dialogSelector.find("#featureSearchOptions");

		//LocalStorage 에 저장된 검색 항목이 있을 경우 표출합니다.
		$selectTable.find("#featureSearchTargetLayer").off("change").change(function(){
			$dialogSelector.find(".createSearchResultLayer").each(function(){ if(!$(this).hasClass("hidden")) $(this).addClass("hidden"); });
			$dialogSelector.find("#searchResultTitle").text("");
			$dialogSelector.find("#featureSearchResult").html("");

			if($dialogSelector.find("#paging").length > 0 && $paging != null){
				$paging.pagination("destroy");
			}

			$selectTable.find("tbody").html("");

			var layerId = $(this).val();
			var layerNm = $(this).find("option:selected").text();

			if("removeSpatialSearchOption" in GMXMAP) GMXMAP.removeSpatialSearchOption();
			if(!_common.utils.isNullAndEmpty(layerId)){
				if("localStorage" in window){
					var featureSearchInfo = localStorage["GMXMAP@featureSearchInfo@" + layerId];
					if(!_common.utils.isNullAndEmpty(featureSearchInfo)){
						var colList = JSON.parse(featureSearchInfo);
						if(colList.length > 0){
							for(var i=0; i<colList.length; i++){
								addSelectField(colList[i]);
							}

							if(("addMapNotification" in GMXMAP) && !_common.utils.isNullAndEmpty(layerNm)){
								GMXMAP.addMapNotification("로컬 스토리지에 저장된 <" + layerNm + "> 검색 환경 설정을 불러옵니다.", 3000);
							}
						}
					}
				}
			}
		});

		//공간 분석 추가 이벤트 입니다.
		$selectTable.find("#setSpatialBtn").off("click").click(function(){
			var tbl = $selectTable.find("#featureSearchTargetLayer").val();
			if(_common.utils.isNullAndEmpty(tbl)){
				alert("검색 대상을 선택하세요.");
				$selectTable.find("#featureSearchTargetLayer").focus();
			}else{
				if("addSpatialSearchOption" in GMXMAP){
					GMXMAP.addSpatialSearchOption();
				}else{
					console.error(">> gmx.gis.feature.spatial.search.js is required.")
				}
			}
		});

		//공간 분석 제거 이벤트 입니다.
		$selectTable.find("#removeSpatialBtn").off("click").click(function(){
			GMXMAP.removeSpatialSearchOption();

			if("removeSpatialSearchOption" in GMXMAP){
				GMXMAP.removeSpatialSearchOption();
			}else{
				console.error(">> gmx.gis.feature.spatial.search.js is required.")
			}
		});

		//필드 추가 Dialog 를 생성합니다.
		$selectTable.find("#setFieldBtn").off("click").click(function(){
			var tbl = $selectTable.find("#featureSearchTargetLayer").val();
			if(_common.utils.isNullAndEmpty(tbl)){
				alert("검색 대상을 선택하세요.");
				$selectTable.find("#featureSearchTargetLayer").focus();
			}else{
				var layerInfo = GMXLAYER.LayerList[tbl];
				if(layerInfo != null){
					var column = GMXMAP.getColumnInfo(layerInfo.layer.schemNm, layerInfo.layer.tblId);
					if(column != null) setFieldSelectDialog(layerInfo.layer.schemNm, layerInfo.layer.tblId, layerInfo.layer.lyrNm, column);
				}
			}
		});

		//검색 이벤트를 바인딩 합니다.
		var lastSearchLayer = null;
		$dialogSelector.find("#featureSearchBtn").off("click").click(function(){
			var layerId = $selectTable.find("#featureSearchTargetLayer").val();
			var layerNm = $selectTable.find("#featureSearchTargetLayer").find("option:selected").text();

			var layerInfo = GMXLAYER.LayerList[layerId];
			if(layerInfo != null){
				var column = GMXMAP.getColumnInfo(layerInfo.layer.schemNm, layerInfo.layer.tblId);
				if(column != null){
					var sendData = _common.utils.collectSendData($selectTable.find("tbody"));

					var param = sendDataColletion(column, sendData);
					var spatialParam = GMXMAP.sendSpatialDataColletion();
					for(var key in spatialParam) param[key] = spatialParam[key];

					//필드 제한
					/*if($selectTable.find("tbody").find(".sendData").length === 0){
						if(JSON.stringify(spatialParam) === "{}"){
							alert("검색 대상 필드 설정 후 검색할 수 있습니다.");
							$selectTable.find("#setFieldBtn").click();
							return false;
						}
					}*/

					//param["pk"] = kv["_gid"];
					param["st[schema]"] = layerInfo.layer.schemNm;
					param["st[table]"] = layerInfo.layer.tblId;
					param["st[limit]"] = Number($("#limit").val());
					param["st[offset]"] = 0;

					var sortThIdx = null;
					var sortTyp = null;
					if($dialogSelector.find("#featureSearchResult").find(".sortCol.active").length === 1){
						var $sorter = $dialogSelector.find("#featureSearchResult").find(".sortCol.active");
						param["st[sortCol]"] = $sorter.data("sortCol");
						param["st[sortTyp]"] = "asc";
						if($sorter.hasClass("desc")) param["st[sortTyp]"] = "desc";

						sortThIdx = $sorter.index() - 1;
						sortTyp = param["st[sortTyp]"];
					}else{
						delete param["st[sortCol]"];
						delete param["st[sortTyp]"];
					}

					if(lastSearchLayer !== layerId){
						lastSearchLayer = layerId;

						sortThIdx = null;
						sortTyp = null;

						delete param["st[sortCol]"];
						delete param["st[sortTyp]"];
					}

					_common.callAjax("/GMT_column/getCommonSearch.json", param, function(json){
						_LastSearchParameters = JSON.parse(JSON.stringify(param));

						if(json.result.length === 0){
							alert("검색 결과가 존재하지 않습니다.")
						}else{
							if(GMXMAP.getLayer(param["st[table]"]) !== null){
								if(!GMXMAP.getLayer(param["st[table]"]).getVisible()){
									GMXMAP.getLayer(param["st[table]"]).setVisible(true);
								}
							}

							parseData(column, json.result, json.count, json.sum[0]);

							if(sortThIdx != null && sortTyp != null){
								var $sorter = $dialogSelector.find("#featureSearchResult").find(".sortCol").eq(sortThIdx);
								if(sortTyp === "asc") $sorter.addClass("active").addClass(sortTyp).text($sorter.text() + "▲");
								if(sortTyp === "desc") $sorter.addClass("active").addClass(sortTyp).text($sorter.text() + "▼");
							}

							var dataSource = new Array();
							for(var i=0; i<json.count; i++) dataSource.push(i);
							$paging = $dialogSelector.find("#paging").pagination({
								dataSource: dataSource,
								pageSize: Number($("#limit").val()),
								//pageRange: 5,
								pageNumber: 1,
								showPageNumbers: true,
								showNavigator: false,
								//position: "top",
								//className: "paginationjs-theme-blue",
								className: "paginationjs-theme-blue paginationjs-small",
								callback: function(data, options) {
									param["st[offset]"] = (options.pageNumber * Number($("#limit").val())) - Number($("#limit").val());
									_common.callAjax("/GMT_column/getCommonSearch.json", param, function(_json){
										_LastSearchParameters = JSON.parse(JSON.stringify(param));

										parseData(column, _json.result, _json.count, _json.sum[0]);

										if(sortThIdx != null && sortTyp != null){
											var $sorter = $dialogSelector.find("#featureSearchResult").find(".sortCol").eq(sortThIdx);
											if(sortTyp === "asc") $sorter.addClass("active").addClass(sortTyp).text($sorter.text() + "▲");
											if(sortTyp === "desc") $sorter.addClass("active").addClass(sortTyp).text($sorter.text() + "▼");
										}

										if($dialogSelector.find("#createSearchResultTableBtn").length > 0){
											$dialogSelector.find("#createSearchResultTableBtn").removeData().data(JSON.parse(JSON.stringify(param)));
										}

										if($dialogSelector.find("#createSearchResultViewTableBtn").length > 0){
											$dialogSelector.find("#createSearchResultViewTableBtn").removeData().data(JSON.parse(JSON.stringify(param)));
										}

									}, false);
								}
							}).css({
								"position" : "absolute",
								"top" : "-3px",
								"right" : "5px"
							});
						}
					}, false);
				}
			}
		});
	}


	/**
	 * <pre>
	 * 객체 통합 검색 창을 생성합니다.
	 * </pre>
	 */
	GMXMAP.createCommonFeatureSearch = function(){
		if(!("addSpatialSearchOption" in GMXMAP)) $dialogSelector.find("#setSpatialBtn").hide();
		if(!("removeSpatialSearchOption" in GMXMAP)) $dialogSelector.find("#removeSpatialBtn").hide();

		if(!$dialogSelector.dialog("isOpen")){
			$dialogSelector.dialog({
				title: "공간 정보 검색",
				width: 650,
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function(){
					if($(".commonSearch").length > 0 && $(".commonSearch").parent().length > 0){
						$(".commonSearch").parent().addClass("active");
					}

					GMXMAP.removeSpatialSearchOption();

					createSearchTargetSelect(true);
					bindEvent();

					$(this).parent().find(".ui-dialog-titlebar").data("isFullWidth", false).off("dblclick").dblclick(function(){
						var fullScreen = $(this).data("isFullWidth");
						if(!fullScreen){
							$dialogSelector.dialog("option", "width", $("#map").width());
							$dialogSelector.dialog("option", "height", $("#map").height());
							$(this).data("isFullWidth", true);
						}else{
							$dialogSelector.dialog("option", "width", "650px");
							$dialogSelector.dialog("option", "height", $("#map").height());
							$(this).data("isFullWidth", false);
						}
					});
				},
				close: function(){
					if($(".commonSearch").length > 0 && $(".commonSearch").parent().length > 0){
						$(".commonSearch").parent().removeClass("active");
					}

					endSearch();
				}
			}).dialog("open");
		}
	}

}
})(GMXMAP, GMXLAYER, GMXLEGEND);