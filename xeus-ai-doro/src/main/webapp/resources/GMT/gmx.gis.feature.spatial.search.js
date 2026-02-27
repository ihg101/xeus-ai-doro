/**
 * 객체 통합 검색에서 공간 분석 기능을 담당합니다.
 */
"use strict";

(function(GMXMAP, GMXLAYER){
if(GMXMAP != null && GMXMAP instanceof ol.Map && GMXLAYER != null){

	var $dialogSelector = $("#featureSearchInfoWrap");
	var $selectTable = $dialogSelector.find("#featureSearchOptions");

	/**
	 * 공간 분석 대상 필드의 값을 취합 합니다.
	 */
	var collectSpatialSendData = function(){
		var sendData = {};

		var target = arguments[0];

		if(_common.utils.validObject(target, "string")){
			$(target).find(".sendSpatialData").each(function(){
				sendData[$(this).attr("id")] = $(this).val();
			});
		}else{
			$(document).find(".sendSpatialData").each(function(){
				sendData[$(this).attr("id")] = $(this).val();
			});
		}

		return sendData;
	};

	/**
	 * 공간 분석 대상 컬럼의 타입을 취합합니다.
	 */
	var convertSpatialColumnTypeData = function(column){
		var param = {};

		for(var i=0; i<column.length; i++){
			param["spatialTyp[" + i + "][col]"] = column[i].colId;
			if(_common.utils.isNullAndEmpty(column[i].stringSize) && column[i].dataType !== "text"){
				param["spatialTyp[" + i + "][typ]"] = "number";
			}else{
				param["spatialTyp[" + i + "][typ]"] = "string";
			}
		}

		return param;
	};

	/**
	 * 검색용 Parameter 객체를 생성합니다.
	 */
	GMXMAP.sendSpatialDataColletion = function(){
		var layerId = $dialogSelector.find("#spatialTargetLayer").val();
		var layerInfo = GMXLAYER.LayerList[layerId];
		if(layerInfo != null){
			var column = GMXMAP.getColumnInfo(layerInfo.layer.schemNm, layerInfo.layer.tblId);
			if(column != null){
				var param = {};

				if("contextMenuSpatialVector" in GMXMAP){
					if(GMXMAP["contextMenuSpatialVector"].getSource().getFeatures().length > 0){
						var feature = GMXMAP["contextMenuSpatialVector"].getSource().getFeatures()[0];

						var wkt = new ol.format.WKT();
						var wktStr = wkt.writeGeometry(GMXMAP["contextMenuSpatialVector"].getSource().getFeatures()[0].getGeometry());

						param["spatialSt[schema]"] = layerInfo.layer.schemNm;
						param["spatialSt[table]"] = layerInfo.layer.tblId;
						param["spatialSt[wkt]"] = wktStr;

					}
				}

				return param;
			}
		}
	}
	/*GMXMAP.sendSpatialDataColletion = function(){
		var layerId = $dialogSelector.find("#spatialTargetLayer").val();
		var layerInfo = GMXLAYER.LayerList[layerId];
		if(layerInfo != null){
			var column = GMXMAP.getColumnInfo(layerInfo.layer.schemNm, layerInfo.layer.tblId);
			if(column != null){
				var sendData = collectSpatialSendData($selectTable.find("tbody"));

				if(JSON.stringify(sendData) === "{}") return {};

				var param = convertSpatialColumnTypeData(column);

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

				var isEmpty = false;
				var idx = 0;
				for(var key in kv){
					param["spatialKv[" + idx + "][key]"] = key;
					param["spatialKv[" + idx + "][val]"] = kv[key];
					if(_common.utils.isNullAndEmpty(kv[key])){
						isEmpty = true;
						break;
					}

					idx++;
				}

				if(isEmpty) return {};

				param["spatialSt[schema]"] = layerInfo.layer.schemNm;
				param["spatialSt[table]"] = layerInfo.layer.tblId;

				return param;
			}
		}
	}*/

	/**
	 * <pre>
	 * 선택된 컬럼 조건을 이용하여 검색 조건 항목을 추가합니다.
	 * </pre>
	 */
	var addSpatialSelectField = function(colData){
		var schemaNm = colData.schemaNm;
		var tableId = colData.tableId;
		var layrNm = colData.lyrNm;

		var fieldUseType = colData.fieldUseType;
		var colId = colData.colId;
		var colNm = colData.colNm;
		if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

		if(!_common.utils.isNullAndEmpty(fieldUseType)){

			var $tr = $("<tr>").addClass("spatialTr");
			var $colTh = $("<th>").text(colNm);
			var $inputOrSelectTd = $("<td>").attr("colspan", 2);

			//우선 사용하지 않음.
			if(fieldUseType === "input"){

				var $input = $("<input>").attr("type", "text").attr("id", colId).addClass("sendSpatialData").data(colData);
				$inputOrSelectTd.append($input);

			}else if(fieldUseType === "select"){

				var _Param = { "col" : colId, "schema" : schemaNm, "table" : tableId };
				_common.callAjax("/GMT_column/getDistinctValue.json", _Param, function(json){
					var $select = $("<select>").attr("id", colId).addClass("sendSpatialData").data(colData);
					$select.append("<option value=''>선택</option>");
					for(var i=0; i<json.result.length; i++){
						$select.append("<option value='" + json.result[i] + "'>" + json.result[i] + "</option>");
					}
					$inputOrSelectTd.append($select);
				}, false);

			}

			$tr.append($colTh).append($inputOrSelectTd);
			$selectTable.find("tfoot").append($tr);

		}
	}

	/**
	 * <pre>
	 * 공간 필드 선택 Dialog 객체를 생성합니다.
	 * </pre>
	 */
	var setSpatialFieldSelectDialog = function(schemaNm, tableId, lyrNm, column){
		if(column != null){
			if($("#spatialFieldSelectWrap").length === 0) $("#body").append("<div id='spatialFieldSelectWrap' class='dialogWrap customScroll table_style'></div>");

			var $tbl = $("<table>").append("<tbody>");
			var $tbody = $tbl.find("tbody");
			$tbody.append("<tr><th>컬럼명</th><th>검색 조건 선택</th></tr>")
			for(var i=0; i<column.length; i++){
				var colId = column[i].colId;
				if(colId !== "geometry" && colId !== "_geometry" && colId !== "_annox" && colId !== "_annoy" && colId !== "_gid"){
					var colNm = column[i].colNm;
					if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

					var $tr = $("<tr>");
					var $colTh = $("<th>").attr("k", colId).text(colNm);
					var $selectTd = $("<td>");

					var $select = $("<select>").addClass("spatialFieldUseType").data(column[i]);
					$select.append("<option value=''>검색 조건에서 제외</option>");
					$select.append("<option value='select'>고유 값 목록 중 선택</option>");

					$selectTd.append($select);

					$tr.append($colTh).append($selectTd);

					$tbody.append($tr);
				}
			}
			$tbody.append("<tr><td colspan='2'><b>* 검색 진행시 대상 공간 객체가 여러개 경우 고유한 한개만 채택됩니다.</b><br><br><b>* 객체가 많을 경우 검색 시간이 지연될 수 있습니다.</b></td></tr>")
			$tbody.append("<tr><td colspan='2'><button class='btn_style' id='addSpatialFielsBtn'>설정한 필드를 공간 분석 조건으로 추가</button></td></tr>");

			//필드 추가 버튼 이벤트 입니다.
			$tbody.find("#addSpatialFielsBtn").click(function(){
				//var localStorageVo = new Array();

				var $selectTable = $dialogSelector.find("#featureSearchOptions");
				$selectTable.find("tfoot").find(".sendSpatialData").remove();
				$tbody.find(".spatialFieldUseType").each(function(){
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

						addSpatialSelectField(colData);

						//localStorageVo.push(JSON.parse(JSON.stringify(colData)));
					}
				});

				/*$selectTable.find(".sendData").off("keyup").keyup(function(e){
					if(e.which == 13){
						$selectTable.find("#featureSearchBtn").click();
					}
				});*/

				$("#spatialFieldSelectWrap").dialog("close");

				//if("localStorage" in window) localStorage["GMXMAP@featureSearchInfo@" + tableId] = JSON.stringify(localStorageVo);
			});

			$("#spatialFieldSelectWrap").html($tbl).dialog({
				title: lyrNm + " 공간 분석 조건 필드 선택",
				modal: true,
				width: 500,
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
					$("#spatialFieldSelectWrap").remove();
				}
			}).dialog("open");
		}
	}

	/**
	 * <pre>
	 * 엘리먼트의 이벤트를 바인딩 합니다.
	 * </pre>
	 */
	var bindEvent = function(){

		/* (미사용) 필드 선택 이벤트 입니다. */
		$selectTable.find("#setSpatialFieldBtn").off("click").click(function(){
			var tbl = $selectTable.find("#spatialTargetLayer").val();
			if(_common.utils.isNullAndEmpty(tbl)){
				alert("공간 분석 대상을 선택하세요.");
				$selectTable.find("#spatialTargetLayer").focus();
			}else{
				var layerInfo = GMXLAYER.LayerList[tbl];
				if(layerInfo != null){
					var column = GMXMAP.getColumnInfo(layerInfo.layer.schemNm, layerInfo.layer.tblId);
					if(column != null) setSpatialFieldSelectDialog(layerInfo.layer.schemNm, layerInfo.layer.tblId, layerInfo.layer.lyrNm, column);
				}
			}
		});

		/* 지도에서 객체 선택 이벤트 입니다. */
		$selectTable.find("#selectFeatureBtn").off("click").click(function(){
			if("contextMenu" in GMXMAP) delete GMXMAP["contextMenu"]["targetLayer"];

			var tbl = $selectTable.find("#spatialTargetLayer").val();
			if(_common.utils.isNullAndEmpty(tbl)){
				alert("공간 분석 대상을 선택하세요.");
				$selectTable.find("#spatialTargetLayer").focus();
			}else{
				var layerInfo = GMXLAYER.LayerList[tbl];
				if(layerInfo != null){
					if(!GMXMAP.getLayer(tbl).getVisible()) GMXMAP.getLayer(tbl).setVisible(true);

					var layerNm = layerInfo.layer.lyrNm;
					GMXMAP.addMapNotification("지도에서 <" + layerNm + "> 객체를 우클릭하여 공간분석 옵션을 추가할 수 있습니다.", 5000);

					if("contextMenu" in GMXMAP) GMXMAP["contextMenu"].targetLayer = tbl;
				}
			}
		});

		/* 공간 분석 선택 대상 이벤트 입니다. */
		$selectTable.find("#spatialTargetLayer").off("change").change(function(){
			$selectTable.find("#selectFeatureBtn").click();
		});

	}

	/**
	 * <pre>
	 * 공간 검색 대상 선택 셀렉트 박스 값을 추가합니다.
	 * </pre>
	 */
	var createSpatialSearchTargetSelect = function(){
		var $select = $dialogSelector.find("#featureSearchOptions").find("#spatialTargetLayer");
		$select.children().remove();

		for(var i=0; i<GMXLAYER.GroupList.length; i++){
			var groupName = GMXLAYER.GroupList[i].grpNm;
			$select.append("<optgroup grpk='" + GMXLAYER.GroupList[i].mgrSeq + "' label='" + GMXLAYER.GroupList[i].grpNm + "'></optgroup>");
		}

		for(var key in GMXLAYER.LayerList){
			var $optgroup = $select.find("optgroup[grpk=" + GMXLAYER.LayerList[key].group.mgrSeq + "]");
			if(GMXLAYER.LayerList[key].layer.lyrTyp === "G"){
				$optgroup.append("<option value='" + GMXLAYER.LayerList[key].layer.tblId + "'>" + GMXLAYER.LayerList[key].layer.lyrNm + "</optgroup>");
			}
		}

		$select.find("optgroup").each(function(){
			if($(this).children().length === 0) $(this).remove();
		});

		$select.val("");
	}

	/**
	 * <pre>
	 * 객체 통합 검색 창을 생성 및 제거 합니다.
	 * </pre>
	 */
	GMXMAP.addSpatialSearchOption = function(){
		$dialogSelector.find(".spatialTr").removeClass("hidden");
		createSpatialSearchTargetSelect();
		bindEvent();
	}
	GMXMAP.removeSpatialSearchOption = function(){
		$dialogSelector.find(".spatialTr").addClass("hidden");
		$dialogSelector.find("#spatialTargetLayer, .sendSpatialData").val("");
		$dialogSelector.find(".spatialTr").not(":eq(0)").remove();

		$dialogSelector.find("#createSearchResultTableWrap").addClass("hidden");

		if("contextMenu" in GMXMAP){
			if(GMXMAP["contextMenu"].isOpen()) GMXMAP["contextMenu"].close();

			delete GMXMAP["contextMenu"]["targetLayer"];
		}
		if("contextMenuSpatialVector" in GMXMAP) GMXMAP["contextMenuSpatialVector"].getSource().clear();
	}

}
})(GMXMAP, GMXLAYER);