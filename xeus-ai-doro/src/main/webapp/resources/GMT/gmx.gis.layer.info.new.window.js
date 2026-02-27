/**
 * 테이블의 각 필드 값을 관리합니다.
 */
"use strict";
$(document).ready(function(){

	var filters = null;
	var filterItems = null;
	var columnSet = null;

	/**
	 * 컬럼 타입을 설정합니다.
	 */
	var convertColumnTypeData = function(column){
		var param = {};

		for(var i=0; i<column.length; i++){
			param["typ[" + i + "][col]"] = column[i].colId;
			if(column[i].dataType !== "text" && !column[i].dataType.contains("character")){
				param["typ[" + i + "][typ]"] = "number";
			}else{
				param["typ[" + i + "][typ]"] = "string";
			}
		}

		return param;
	};

	/**
	 * 데이터 유효성을 검증합니다.
	 */
	var validData = function(column, data){
		var breakLoop = false;

		for(var i=0; i<column.length; i++){
			var colId = column[i].colId;
			var colNm = column[i].colNm;
			var colTyp = column[i].dataType;
			var isNumber = false;
			if(_common.utils.isNullAndEmpty(column[i].stringSize)) isNumber = true;
			if(colTyp === "text") isNumber = false;
			if(colTyp.contains("character")) isNumber = false;

			if(colId in data){
				if(isNumber){
					data[colId] = Number(data[colId]);

					if(!_common.utils.isNumber(data[colId])){
						alert(colNm + "(" + colId + ") 항목의 값은 숫자만 허용됩니다.");
						breakLoop = true;
						break;
					}
				}
			}
		}

		if(breakLoop){
			return false;
		}else{
			return data;
		}
	};

	/**
	 * JSGrid 객체를 생성합니다.
	 */
	_common.callAjax("/GMT_column/getLayerMetaInfo.json", {}, function(json){
		var columnList = new Array();
		var fields = new Array();

		columnSet = JSON.parse(JSON.stringify(json.column));

		var column = JSON.parse(JSON.stringify(json.column));
		var data = JSON.parse(JSON.stringify(json.data));

		var geometryType = "";
		if(data.length > 0 && ("geometry_wkt" in data[0])){
			if(data[0]["geometry_wkt"].contains("POINT")) geometryType = "POINT";
			if(data[0]["geometry_wkt"].contains("LINE")) geometryType = "LINE";
			if(data[0]["geometry_wkt"].contains("POLYGON")) geometryType = "POLYGON";
		}

		filterItems = JSON.parse(JSON.stringify(data));

		fields.push({
			type: "control",
			searchModeButtonTooltip: "Switch to searching", // tooltip of switching filtering/inserting button in inserting mode
			insertModeButtonTooltip: "Switch to inserting", // tooltip of switching filtering/inserting button in filtering mode
			editButtonTooltip: "수정",                      // tooltip of edit item button
			deleteButtonTooltip: "삭제",                  // tooltip of delete item button
			searchButtonTooltip: "검색",                  // tooltip of search button
			clearFilterButtonTooltip: "조건 제거",       // tooltip of clear filter button
			insertButtonTooltip: "추가",                  // tooltip of insert button
			updateButtonTooltip: "수정",                  // tooltip of update item button
			cancelEditButtonTooltip: "수정 취소",         // tooltip of cancel editing button
		});

		var geometryLon = { "colUid": "-", "colId": "geometry_lon", "tblId": "-", "tblSchema": "-", "colNm": "중심점 경도 (공간 연산)", "dataType": "-", "stringSize": null, "numericPrecision": 24, "numericPrecisionRadixsize": 0, "numericScale": 4, "pkey": false };
		var geometryLat = { "colUid": "-", "colId": "geometry_lat", "tblId": "-", "tblSchema": "-", "colNm": "중심점 위도 (공간 연산)", "dataType": "-", "stringSize": null, "numericPrecision": 24, "numericPrecisionRadixsize": 0, "numericScale": 4, "pkey": false };
		var geometryArea = { "colUid": "-", "colId": "geometry_area", "tblId": "-", "tblSchema": "-", "colNm": "면적 (공간 연산)", "dataType": "-", "stringSize": null, "numericPrecision": 24, "numericPrecisionRadixsize": 0, "numericScale": 4, "pkey": false };
		var geometryLength = { "colUid": "-", "colId": "geometry_length", "tblId": "-", "tblSchema": "-", "colNm": "길이 (공간 연산)", "dataType": "-", "stringSize": null, "numericPrecision": 24, "numericPrecisionRadixsize": 0, "numericScale": 4, "pkey": false };

		if(geometryType === "LINE") column.unshift(geometryLength);
		if(geometryType === "POLYGON") column.unshift(geometryArea);

		column.unshift(geometryLat);
		column.unshift(geometryLon);

		for(var i=0; i<column.length; i++){
			var visible = true;
			var editing = true;
			var colId = column[i].colId;
			var colNm = column[i].colNm;
			if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

			if(colId === "_geometry" || colId === "_annox" || colId === "_annoy" || colId === "_gid"){
				visible = false;
				editing = false;
			}

			if(colId === "geometry_lon" || colId === "geometry_lat"){
				visible = true;
				editing = false;
			}

			fields.push({ width : 150, name : colId, title : colNm, type : "text", visible : visible, editing : editing });
		}

		//https://s00741.tistory.com/entry/%EC%8A%A4%ED%94%84%EB%A7%81-JSGRID-%EA%B7%B8%EB%A6%AC%EB%93%9C-%ED%85%8C%EC%9D%B4%EB%B8%94-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0
		//http://js-grid.com/docs/
		$("#jsGrid").jsGrid({
			width: "100%",
			height: $(document).height() - 50,

			filtering: true,
			//inserting: true,
			editing: true,
			sorting: true,
			paging: true,

			//headercss: "{background: 'blue'}",
			//filtercss: "{background: 'blue'}",

			pageSize: 20,
			pageButtonCount: 10,
			pagerFormat: "{first} {prev} {pages} {next} {last} {pageIndex} / {pageCount}",
			pagePrevText: "이전",
			pageNextText: "다음",
			pageFirstText: "처음",
			pageLastText: "마지막",
			pageNavigatorNextText: ">",
			pageNavigatorPrevText: "<",

			noDataContent: "데이터가 존재하지 않습니다.",

			/*confirmDeleting: true,
			deleteConfirm: "선택하신 공간정보를 삭제하시겠습니까?",*/

			loadIndication: true,
			loadIndicationDelay: 500,
			loadMessage: "데이터를 읽는 중입니다.",
			loadShading: true,

			//invalidMessage: "입력 된 데이터가 잘못되었습니다.",

			data: data,

			fields: fields,

			controller: {

				data: data,

				loadData: function(filter){
					filters = filter;
					filterItems = new Array();

					return $.grep(this.data, function(item){
						var flag = true;
						for(var key in filter){
							if(key != undefined){
								if(_common.utils.isNullAndEmpty(filter[key])) continue;
								if(_common.utils.isNumber(Number(filter[key]))){
									if(key in item){
										flag = flag && (!filter[key] || Number(item[key]) === Number(filter[key]));
									}else{
										flag = false;
									}
								}else{
									if(key in item){
										flag = flag && (!filter[key] || item[key].indexOf(filter[key]) >= 0);
									}else{
										flag = false;
									}
								}
							}
						}

						if(flag) filterItems.push(item);

						return flag;
					});
				},

				updateItem: function(item){

					var param = convertColumnTypeData(column);

					var kv = JSON.parse(JSON.stringify(item));
					delete kv["_geometry"]; delete kv["geometry"];
					delete kv["_annox"]; delete kv["annox"];
					delete kv["_annoy"]; delete kv["annoy"];

					var resultData = validData(column, kv);
					if(!resultData){
						return false;
					}else{
						for(var key in kv){
							kv[key] = resultData[key];
						}
					}

					var idx = 0;
					for(var key in kv){
						if(key !== "geometry_lon" && key !== "geometry_lat" && key !== "geometry_wkt" && key !== "geometry_length" && key !== "geometry_area"){
							param["kv[" + idx + "][key]"] = key;
							param["kv[" + idx + "][val]"] = kv[key];
							idx++;
						}
					}
					param["pk"] = kv["_gid"];

					if(confirm("데이터를 수정하시겠습니까?")){
						_common.callAjax("/GMT_column/editLayerValue.json", param, function(json){
							//TODO GMXMAP 레이어 갱신
							if(json.result) alert("수정 되었습니다.");
						});
					}
				},

				deleteItem: function(item){
					var param = {};
					var kv = JSON.parse(JSON.stringify(item));

					param["pk"] = kv["_gid"];

					if(confirm("선택하신 공간정보를 삭제하시겠습니까?")){
						_common.callAjax("/GMT_column/delLayerValue.json", param, function(json){
							//TODO GMXMAP 레이어 갱신
							if(json.result) alert("삭제 되었습니다.");
						});
					}
				}
			},

			rowClick: function(grid){
				var $row = $(grid.row);
				var $rowIdx = grid.itemIndex;
				var prop = grid.item;

				if("GMXMAP" in opener){
					var geometry_lon = prop.annox;
					var geometry_lat = prop.annoy;
					var geometry_wkt = prop.geometry_wkt;

					if(!_common.utils.isNullAndEmpty(geometry_wkt)){
						if(geometry_wkt.toUpperCase().contains("POINT")){
							opener.GMXMAP.addPulse([Number(geometry_lon), Number(geometry_lat)], true);
						}else{
							var format = new opener.ol.format.WKT();
							var wktFeature = format.readFeature(geometry_wkt, { dataProjection: "EPSG:5186", featureProjection: "EPSG:5186" });

							opener.GMXMAP.addHighLight(wktFeature, true);

							format = null;
							wktFeature = null;
						}
					}
				}
			},

			onRefreshed : function(){
				if(isView) $(".jsgrid-edit-button, .jsgrid-delete-button").remove();
			},
		});

		$("#progress.jsgrid-load-panel").fadeOut();
		$("#excelDown").show();
		$(".jsgrid-grid-body").addClass("customScroll");
		$(".jsgrid-search-mode-button").click();
		/*$(".jsgrid-control-field").css({
			"position": "absolute",
			"width": "5em",
			"left": "0",
			"top": "auto",
			"border-top-width": "1px",
			"margin-top": "-1px",
		});*/

	});

	/**
	 * 엑셀 다운로드 이벤트 입니다.
	 * 현재 보여지는 데이터를 서버에 전송하여 생성합니다.
	 */
	$("#excelDown").click(function(){

		var param = convertColumnTypeData(columnSet);

		var idx = 0;
		for(var key in filters){
			if(_common.utils.isNullAndEmpty(filters[key])) continue;

			param["kv[" + idx + "][key]"] = key;
			param["kv[" + idx + "][val]"] = filters[key];
			idx++;
		}

		var sort = $("#jsGrid").jsGrid("getSorting");
		if(!_common.utils.isNullAndEmpty(sort.field) && _common.utils.isNullAndEmpty(sort.order)){
			param["st[sortCol]"] = sort.field;
			param["st[sortTyp]"] = sort.order;
		}

		$("#excelAlert").fadeIn();
		_common.postForm.submit("/GMT_column/createExcel.json", param);
		var timeout = setTimeout(function(){
			$("#excelAlert").fadeOut();
			clearTimeout(timeout);
			timeout = null;
		}, 5000);
		//alert("엑셀 다운로드 요청을 완료하였습니다.\n\n데이터 수가 많은 경우 다운로드 시간이 지연될 수 있습니다.");
	})

})