/**
 *
 */

var selectLayer = "";
var analysOption = {};
var analyNm = "";
var isEditAnalyze = false;
var importLayer = null;

(function(){

	importLayer = new Array();

	/*$("body > #tabs").find(".tab[target=bigdataView]").find(".close").click(function(){
		if(importLayer.length > 0){
			for(var i=0; i<importLayer.length; i++){
				var layer = GMXMAP.getLayerById(importLayer[i]);
				if(layer){
					layer.getSource().clear();
					GMXMAP.removeLayer(layer);
				}
			}
		}
	});*/

	var resetLayer = false;
	if($("#main-menu-group").find("#btn-bigdata-mng").attr("init-layer") == "true"){
		resetLayer = true;
		$("#main-menu-group").find("#btn-bigdata-mng").removeAttr("init-layer");
	}

	xeusLayout.initLayer("DATA", resetLayer);
	if(_common.code == null){
		_common.setCode(function(){
			XeusLayer.createLegend("#legendWrap");
		});
	}else{
		XeusLayer.createLegend("#legendWrap");
	}

	var mapLayers = GMXMAP.getLayers().getArray();
	for(var i=0; i<mapLayers.length; i++){
		var lyrNm = mapLayers[i].get("fullName");
		GMXMAP.getLayerById(lyrNm).setVisible(false);
		if(lyrNm == "daum_tile_map" || lyrNm == "asset_cctv"){
			GMXMAP.getLayerById(lyrNm).setVisible(true);
		}
	}

	/*var mapLayers = GMXMAP.getLayers().getArray();
	for(var i=0; i<mapLayers.length; i++){
		if(mapLayers[i].get("fnGroup") == "TEMP"){
			mapLayers[i].setVisible(false);
			GMXMAP.removeLayer(mapLayers[i]);
		}
	}*/

	xeusSymbol.removeAllFeature();
	$("#bigdataView").find("p.group-title").eq(0).text("시스템 기본레이어");
	$("#bigdataView").find("p.group-title").not(":eq(0)").remove();
	$("#bigdataView").find("div.groups").css("margin-bottom", "0px");

	setLayers();

	setTimeout(function(){
		var offset = $("#bigdataView").find("#virtual-map-boundary").offset();
		var width = $("#bigdataView").find("#virtual-map-boundary").width();
		var height = $("#bigdataView").find("#virtual-map-boundary").height();

		$("#bigdataView").find("#dragWrap, #optionWrap, #columnWrap").width(width).height(height).offset({
			top: offset.top,
			left: offset.left
		});

		$("#bigdataView").find("#dragWrap").width(250);
		/* .draggable({
			containment: "#bigdataView #virtual-map-boundary",
			scroll: false
		}); */
	}, 500);

	if(!_common.utils.isNullAndEmpty(k)){
		Public.BIGDATA.View.Start(k);

		$("#startAnalysBtn").addClass("hidden");
		$("#editAndAnalyBtn, #saveAndAnalyBtn").removeClass("hidden");

		_common.callAjax("/bigData/getAnalysisOption.json", { "k" : k }, function(json){
			isEditAnalyze = true;
			analyNm = json.analyze.analyNm;

			var result = {};

			for(var l=0; l<json.layerSet.length; l++){
				var analyze = json.analyze;
				var layerSet = json.layerSet[l];
				//var analyWeight = json.analyWeight[l];
				var analyWeight = new Array();

				var layerId = layerSet["layerId"];
				var layerNm = layerSet["layerNm"];

				for(var i=0; i<json.analyWeight.length; i++){
					if(layerId == json.analyWeight[i].layerId){
						analyWeight.push(JSON.parse(JSON.stringify(json.analyWeight[i])));
					}
				}

				result[layerId] = {
					sortVal : analyWeight.length,
					korName : layerSet["layerNm"],
					col		: analyWeight[0]["itemNm"],
					zIndex	: Number(layerSet["layerSeq"]),
					jibnYn	: layerSet["jibnYn"] == "Y" ? true : false,
					values	: null
				};

				var isGroup = true;
				result[layerId]["values"] = new Array();
				for(var i=0; i<analyWeight.length; i++){
					var min = analyWeight[i].minVal;
					var max = analyWeight[i].maxVal;

					if(Number(min) == Number(max)){
						result[layerId]["sortVal"] = 1;
					}else{
						result[layerId]["sortVal"] = analyWeight.length;
					}

					var range = min + "~" + max;
					if(min == max){
						isGroup = false;
						range = analyWeight.length;
					}
					result[layerId]["values"].push({
						"range": range,
						"buffer": analyWeight[i].impactM,
						"weight": analyWeight[i].weightVal
					});
				}
				result[layerId]["isGroup"] = isGroup;

				var krName = layerNm;
				var enName = layerId;

				var isContains = false;
				for(var i=0; i<importLayer.length; i++){
					if(importLayer == enName){
						isContains = true;
					}
				}
				if(!isContains) importLayer.push(enName);

				createLayer(krName, enName);
			}

			analysOption = JSON.parse(JSON.stringify(result));

		}, false);
	}else{
		$("#startAnalysBtn").removeClass("hidden");
		$("#editAndAnalyBtn, #saveAndAnalyBtn").addClass("hidden");
	}

	/* 드롭박스 이벤트 입니다. */
	$(".contentWrapper").find(".dropBox").droppable({
		accept: ".dragTr",
		hoverClass: "dropBoxHover",
        deactivate: function(){
        	$(".contentWrapper").find(".dropBox").hide("clip", 200);
        	//180528 이은규
        	//셀렉터 추가
        	$(".contentWrapper").find(".dropBox").hide("clip", 200);
        },
		drop: function(event, ui){

			var krName = $(ui.draggable).text();
			var enName = $(ui.draggable).attr("lyr");

			var isContains = false;
			for(var i=0; i<importLayer.length; i++){
				if(importLayer == enName){
					isContains = true;
				}
			}
			if(!isContains) importLayer.push(enName);

			createLayer(krName, enName);

			ui.draggable.draggable("option", "revert", false);
		}
	});

	/* 정렬 추가 */
	$("#analysWrap").sortable({
	    placeholder: "ui-state-highlight",
	    update : function(event, ui){
			$(this).find("div.legends").each(function(i, e){
				var cnt = $(this).find("div.legends").length;
				var lyr = $(e).attr("lyr");
				if(!_common.utils.isNullAndEmpty(lyr)){
					var vector = GMXMAP.getLayerById(lyr);
					if(vector) vector.setZIndex(10 + (cnt - i));
					if(lyr in analysOption){
						analysOption[lyr]["zIndex"] = i;
					}
				}
			});
		}
	});
	$("#analysWrap").disableSelection();

	/* 레이어 선택 닫기 */
	$("#bigdataView").find("#dragWrap").find("#west_btn_close").click(function(){
		$("#bigdataView").find("#dragWrap").hide();
	});

	/* 옵션 설정 닫기 */
	$("#bigdataView").find("#optionWrap").find("#west_btn_close").click(function(){
		$("#bigdataView").find("#optionWrap").hide();
	});

	/* 옵션 설정 닫기 */
	$("#bigdataView").find("#columnWrap").find("#west_btn_close").click(function(){
		$("#bigdataView").find("#columnWrap").hide();
	});

	/* 레이어 선택 열기 */
	$(".contentWrapper").find("#lyrSelectBtn").click(function(){
		$("#bigdataView").find("#dragWrap").show();
		var offset = $("#bigdataView").find("#virtual-map-boundary").offset();
		$("#bigdataView").find("#dragWrap, #optionWrap, #columnWrap").offset({
			top: offset.top,
			left: offset.left
		});
		$("#bigdataView").find("#optionWrap, #columnWrap").hide();
	});

	/* 옵션 설정 열기 */
	$(".contentWrapper").find("#optionBtn").click(function(){
		$("#bigdataView").find("#optionWrap").show();
		$("#bigdataView").find("#dragWrap, #columnWrap").hide();
	});

	/* 분할 갯수 이벤트 */
	$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").change(function(){
		var length = $("#bigdataView").find("#columnWrap").find("table").find("tbody").find("tr").length;
		if($(this).val() < 0) $(this).val(0);
		/*if($(this).val() >= (length / 2)){
			$(this).val(Math.round(length / 2) - 1);
		}*/
	});

	/* 지적적용 이벤트 */
	$("#bigdataView").find("#grpOptionWrap").find("input[type=checkbox]").change(function(){
		analysOption[selectLayer]["jibnYn"] = $(this).is(":checked");
	});

	/* 분석결과 닫기 이벤트 */
	$("#bigdataView").find("#center-overlay-east").find("#closeDetailWrap").click(function(){
		$("#bigdataView").find("#center-overlay-east").find("#resultWrap").show();
		$("#bigdataView").find("#center-overlay-east").find("#detailResultWrap").hide();
	});

	/* 초기화 이벤트 */
	$(".contentWrapper").find("#resetBtn").click(function(){
		confirm("초기화면으로 돌아가시겠습니까?", function(){
			$(".contentWrapper").find("button.tab").eq(0).click();
		});
	});

	/* 정렬 버튼 */
	$("#bigdataView").find("#grpOptionWrap").find("#sortBtn").click(function(){
		var tbl = $(this).attr("tbl");
		var enCol = $(this).attr("enCol");
		var krCol = $("#bigdataView").find("#weightTable").find("thead").find("th[col=" + enCol + "]").text();;
		var sliceVal = Number($("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val());

		sliceField(tbl, enCol, krCol, sliceVal);




		/*var $tr = $("#bigdataView").find("#columnWrap").find("table").find("tbody").find("tr");
		var length = $tr.length;
		var minVal, maxVal = null;

		var col = $(this).attr("col");
		if(_common.utils.isNullAndEmpty(col)){
			alert("분석 대상 필드를 선택해주세요.");
			return false;
		}
		var colIdx = $("#bigdataView").find("#weightTable").find("thead").find("th[col=" + col + "]").index();
		var param = { "tbl" : $(this).attr("tbl"), "col" : $(this).attr("col") };
		_common.callAjax("/getMinMax.json", param, function(json){
			minVal = json.result[0].min;
			maxVal = json.result[0].max;
			length = json.result[0].count;
		}, false);

		var sortVal = Number($("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val());
		if(sortVal != 1){
			if((sortVal * minVal) > maxVal){
				alert("분할 갯수는 최대치(" + Math.ceil(maxVal / minVal) + ")보다 작아야합니다.");
				$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val(analysOption[selectLayer]["sortVal"]);
				return false;
			}else if(sortVal >= maxVal){
				alert("분할 갯수는 최대치(" + maxVal + ")보다 작아야합니다.");
				$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val(analysOption[selectLayer]["sortVal"]);
				return false;
			}else if(sortVal < 1){
				alert("분할 갯수는 0보다 커야합니다.");
				$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val(analysOption[selectLayer]["sortVal"]);
				return false;
				}else if(sortVal > length){
			alert("분할 갯수는 총 갯수보다 작거나 같아야 합니다.");
			return false;
			}else if(sortVal >= (maxVal / 2)){
				alert("분할 갯수는 최대치(" + maxVal + ")의 절반보다 작아야 합니다.");
				$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val(analysOption[selectLayer]["sortVal"]);
				return false;
			}
		}

		var range = Math.round(length / sortVal);
		if(range < 1){
			alert("분할 갯수는 0보다 커야합니다.");
			return false;
		}

		var minVal = $("#bigdataView").find("#columnWrap").find("table").find("thead").data().min;
		var maxVal = $("#bigdataView").find("#columnWrap").find("table").find("thead").data().max;
		var rngVal = Math.ceil(maxVal / sortVal);

		var isReset = false;
		if(analysOption[selectLayer]["sortVal"] != sortVal){
			isReset = true;
			analysOption[selectLayer]["sortVal"] = sortVal;
			analysOption[selectLayer]["values"] = new Array();
			$("#bigdataView").find("input.buffer, input.weight").val(0);
		}

		$tr.hide();
		//$tr.show().find("input[type=color]").val("#FFFFFF");
		if(sortVal == 1 || sortVal == maxVal){
			//var idx = 0;
			analysOption[selectLayer]["isGroup"] = false;
			for(var i=minVal; i<(maxVal + 1); i++){
				//if(end > length || end < length) end = length;
				if(i == (sortVal - 1)){
					if(end > length || end < length) end = length;
				}
				$tr.eq(i).show().find("td:eq(" + colIdx + ")").text(i);
				if(isReset){
					analysOption[selectLayer]["values"].push({ range : i, buffer : 0, weight: 0 });
				}
			}

			var $visibleTr = $("#bigdataView").find("#columnWrap").find("table").find("tbody").find("tr:visible");
			if($visibleTr.length == 0) $tr.show();
			var colorRange = chroma.scale(['#1DDB16', '#FFE400', '#FF0000']).colors($visibleTr.length);
			colorRange.forEach(function (item, index, array) {
				$visibleTr.eq(index).find("td:eq(0)").find("input[type=color]").val(item);
			});
			$tr.each(function(i, e){
				//idx++;
				var defaultVal = $(this).data().defaultVal;
				$(this).find("td:eq(0)").find("input[type=color]").val(fullColor[i]);
				$(this).find("td:eq(" + colIdx + ")").text(defaultVal);
				if(isReset) analysOption[selectLayer]["values"].push({ range : defaultVal, buffer : 0, weight: 0 });
			});
			return false;
		}
		$tr.hide();

		analysOption[selectLayer]["isGroup"] = true;
		//$tr.eq(0).show().find("td:eq(0)").text("1 ~ " + (range - 1));
		//if(isReset) analysOption[selectLayer]["values"].push({ range : minVal + "~" +  (minVal + rngVal), buffer : 0, weight: 0 });

		var start = minVal;
		var end = (start + rngVal) - 1;
		for(var i=0; i<sortVal; i++){
			//if(end > length || end < length) end = length;
			if(i == (sortVal - 1)){
				if(end > length || end < length) end = length;
			}
			$tr.eq(i).show().find("td:eq(" + colIdx + ")").text(start + " ~ " + end);
			if(isReset){
				analysOption[selectLayer]["values"].push({ range : start + "~" + end, buffer : 0, weight: 0 });
			}
			start = start + rngVal;
			end = (start + rngVal) - 1;
		}

		var colorRange = chroma.scale(['#1DDB16', '#FFE400', '#FF0000']).colors(sortVal);
		var $visibleTr = $("#bigdataView").find("#columnWrap").find("table").find("tbody").find("tr:visible");
		colorRange.forEach(function (item, index, array) {
			$visibleTr.eq(index).find("td:eq(0)").find("input[type=color]").val(item);
		});*/

	});


	var isAdvancedUpload = function(){
		var div = document.createElement( 'div' );
		return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
	}();

	var $form = $("#bigdataView").find("#uploadForm");

	var droppedFiles = false;
	if(isAdvancedUpload){
		$form.addClass('has-advanced-upload');

		droppedFiles = false;

		$form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
		}).on('dragover dragenter', function() {
			$form.addClass('is-dragover');
		}).on('dragleave dragend drop', function() {
			$form.removeClass('is-dragover');
		}).on('drop', function(e) {
			droppedFiles = e.originalEvent.dataTransfer.files;
			$("#bigdataView").find("label[for=file]").hide();
			$("#bigdataView").find("label[for=file]#uploadTxt").find("strong").text(droppedFiles[0].name);
			$("#bigdataView").find("label[for=file]#uploadTxt").show();
		});
	}

	/* 파일 테그 변경 감지 */
	$("#bigdataView").find("input[type=file]#file").change(function(){
		droppedFiles = $("#bigdataView").find("input[type=file]#file")[0].files;
		$("#bigdataView").find("label[for=file]").hide();
		$("#bigdataView").find("label[for=file]#uploadTxt").find("strong").text(droppedFiles[0].name);
		$("#bigdataView").find("label[for=file]#uploadTxt").show();
	});

	/* 파일업로드 버튼 이벤트 */
	$("#bigdataView").find("#upBtn").click(function(){
		$("#bigdataView").find("#uploadWrap").toggle("clip");
	});

	/* 파일업로드 버튼 이벤트 */
	$("#bigdataView").find("#uploadWrap img.close").click(function(){
		$("#bigdataView").find("#uploadWrap").toggle("clip");
	});

	/* 파일업로드 */
	$("#bigdataView").find("#sendFile").click(function(){
		if(droppedFiles && droppedFiles.length > 0){
			var _html = '';
			_html += '<div id="vectorInfo" class="bPopup" style="display: none;"> ';
			_html += '    <div id="title-bar"> ';// style="margin-left: 10px;"
			_html += '        <button id="closeBtn" style="float: right;"><img src="../res/img/close_btn.png"/></button> ';
			_html += '        <p class="title">레이어 설정</p> ';
			_html += '    </div> ';
			_html += '    <table class="list"> ';// cellspacing="0" width="100%" style="margin-top:0;"
			_html += '        <thead> ';
			_html += '        <colgroup> ';
			_html += '            <col width="110px" /> ';
			_html += '	          <col width="" /> ';
			_html += '        </colgroup> ';
			_html += '        </thead> ';
			_html += '        <tbody> ';

			/*_html += '        	<tr> ';
			_html += '            	<th><label>레이어ID</label></th> ';
			_html += '            	<td><input type="text" id="layerId" class="wide"></td> ';
			_html += '        	</tr> ';*/
			_html += '        	<tr> ';
			_html += '            	<th><label>레이어명</label></th> ';
			_html += '            	<td><input type="text" id="layerNm" class="wide"></td> ';
			_html += '        	</tr> ';
			_html += '        	<tr> ';
			_html += '            	<th colspan="2"><button id="saveBtn">확인</button></th> ';
			_html += '        	</tr> ';

			_html += '        </tbody> ';
			_html += '    </table> ';
			_html += '</div> ';

			$("#bigdataView").append(_html);

			$("#bigdataView").find('#vectorInfo').find("#layerId, #layerNm").css("color", "white");
			$("#bigdataView").find('#vectorInfo').bPopup({
				appendTo: $(".contentWrapper"),
				onOpen: function() {
					$("#bigdataView").find('#vectorInfo').find('#closeBtn').click(function(){
						$("#bigdataView").find('#vectorInfo').bPopup().close();
						$("#bigdataView").find('.bPopup').remove();
					});

					$("#bigdataView").find('#vectorInfo').find("#saveBtn").click(function(){
						confirm(droppedFiles[0].name + " 파일을 업로드하시겠습니까?<br><br>참고) 업로드시, 파일 분석시간이 소요됩니다.", function(){

							var $input = $("#bigdataView").find("input[type=file]#file");
							if(droppedFiles.length > 0){
								var param = new FormData();
								//var layerId = $("#bigdataView").find('#vectorInfo').find("#layerId").val();
								var layerNm = $("#bigdataView").find('#vectorInfo').find("#layerNm").val();
								/*if(_common.utils.isNullAndEmpty(layerId)){
									alert("레이어ID를 입력해 주세요.");
									return false;
								}*/
								if(_common.utils.isNullAndEmpty(layerNm)){
									alert("레이어명을 입력해 주세요.");
									return false;
								}
								$.each(droppedFiles, function( i, file ){
									param.append( $input.attr( 'name' ), file );
									param.append("layerId", _common.utils.Random.getGUID12());
									param.append("layerNm", layerNm);
								});

								$("#bigdataView").find('#vectorInfo').bPopup().close();
								$("#bigdataView").find('.bPopup').remove();

								$.ajax({
									url: 			$form.attr( 'action' ),
									type:			$form.attr( 'method' ),
									data: 			param,
									dataType:		'json',
									async:			false,
									cache:			false,
									contentType:	false,
									processData:	false,
									success: function(json){
										if("error" in json){
											alert(json.error);
											return false;
										}
										if(json.result){
											$("#bigdataView").find('#uploadWrap').find(".close").click();
											setTimeout(function(){
												parseExcel(json);
											}, 400);
											//alert("업로드가 완료되었습니다.");
										}
									},
									error: function(){
										alert("파일업로드를 실패하였습니다.");
									}
								});
							}

						});
					});
				},
				onClose: function() {
					$("#bigdataView").find('.bPopup').remove();
				}

			});
		}
	});

	/* 저장 버튼 이벤트 */
	$("#bigdataView").find("#commit").click(function(){
		confirm("데이터를 레이어로 저장하시겠습니까?", function(){
			_common.callAjax("/bigData/commitData.json", {}, function(json){
				if(json.result){
					alert("저장되었습니다.");
					setLayers();
					$("#bigdataView").find('#dataWrap').hide("clip");
				}
			});
		});
	});

	/* 취소 버튼 이벤트 */
	$("#bigdataView").find("#rollback").click(function(){
		confirm("업로드 데이터를 취소하시겠습니까?", function(){
			_common.callAjax("/bigData/rollbackData.json", {}, function(json){
				if(json.result){
					alert("취소하였습니다.");
					$("#bigdataView").find('#dataWrap').hide("clip");
				}
			});
		});
	});

	/* 재분석 이벤트 */
	$("#bigdataView").find("#editAndAnalyBtn").click(function(){
		confirm("재분석 하시겠습니까?<br><br>분석명) " + analyNm, function(){
			var data = parseData();
			if(data){
				_common.callAjax("/bigData/editAnalys.json", { json : JSON.stringify(data), k : k }, function(json){
					if(json.result){
						alert("분석이 시작되었습니다.");
					}
				});
			}
		});
	});

	/* 분석 버튼 이벤트 */
	$("#bigdataView").find("#startAnalysBtn, #saveAndAnalyBtn").click(function(){
		var data = parseData();
		if(data){
			var _html = '';
			_html += '<div id="vectorInfo" class="bPopup" style="display: none;"> ';
			_html += '    <div id="title-bar"> ';// style="margin-left: 10px;"
			_html += '        <button id="closeBtn" style="float: right;"><img src="'+xeusCCTV.ctxPath + '/res/img/close_btn.png"/></button> ';
			_html += '        <p class="title">분석명 입력</p> ';
			_html += '    </div> ';
			_html += '    <table class="list"> ';// cellspacing="0" width="100%" style="margin-top:0;"
			_html += '        <thead> ';
			_html += '        <colgroup> ';
			_html += '            <col width="110px" /> ';
			_html += '	          <col width="" /> ';
			_html += '        </colgroup> ';
			_html += '        </thead> ';
			_html += '        <tbody> ';

			_html += '        	<tr> ';
			_html += '            	<th><label>분석명칭</label></th> ';
			_html += '            	<td><input type="text" id="analyNm" style="color: white;"></td> ';
			_html += '        	</tr> ';
			_html += '        	<tr> ';
			_html += '            	<th><label>분석일정</label></th> ';
			_html += '            	<td> ';
			_html += '            		<select id="analyPlan" class="wide"> ';
			_html += '            			<option value="I:00:00">즉시실행</option> ';
			_html += '            			<option value="W:01:00">매주실행</option> ';
			_html += '            			<option value="M:28:00">매월실행</option> ';
			_html += '            			<option value="Q:28:00">분기실행</option> ';
			_html += '            			<option value="Y:01:03">매년실행</option> ';
			_html += '            		</select> ';
			_html += '            	</td> ';
			_html += '        	</tr> ';
			_html += '        	<tr> ';
			_html += '            	<th colspan="2"><button id="saveBtn">확인</button></th> ';
			_html += '        	</tr> ';

			_html += '        </tbody> ';
			_html += '    </table> ';
			_html += '</div> ';

			/*analy_plan
		    1) 즉시실행 : I:00:00
		    2) 매주실행 : W:01:00 --> 일~~ 토(1,2,3,4,5,6,7)
		    3) 매월실행 : M:28:00  --> 매월 28일 실행
		    4) 분기실행 : Q:28:00  --> 매분기(3,6,9,12) 28일 실행
		    5) 매년실행 : Y:01:03  --> 매년 1월 3일 실행*/

			$("#bigdataView").append(_html);

			$("#bigdataView").find('#vectorInfo').bPopup({
				appendTo: $(".contentWrapper"),
				onOpen: function() {
					$("#bigdataView").find('#vectorInfo').find('#closeBtn').click(function(){
						$("#bigdataView").find('#vectorInfo').bPopup().close();
						$("#bigdataView").find('.bPopup').remove();
					});

					$("#bigdataView").find('#vectorInfo').find('#saveBtn').click(function(){
						var name = $("#bigdataView").find('#vectorInfo').find("#analyNm").val();
						var plan = $("#bigdataView").find('#vectorInfo').find("#analyPlan").val();

						if(_common.utils.isNullAndEmpty(name)){
							alert("분석 명칭을 입력해 주세요.");
							return false;
						}

						confirm("분석을 시작하시겠습니까?", function(){
							_common.callAjax("/bigData/startAnalys.json", { json : JSON.stringify(data), analyNm : name, analyPlan : plan }, function(json){
								if(json.result){
									alert("분석요청을 성공하였습니다.");
									$("#bigdataView").find('#vectorInfo').find('#closeBtn').click();
								}
							});
						});
					});
				},
				onClose: function() {
					$("#bigdataView").find('.bPopup').remove();
				}

			});
		}

	});

})();

function parseExcel(json){
	var header = json.header;
	var body = json.body;
	var bodyLength = body.length;

	var $table = $("<table></table>");

	var $thead = $("<thead></thead>");
	$thead.append("<tr></tr>")
	for(var i=0; i<header.length; i++){
		$thead.find("tr").append("<th>" + header[i] + "</th>");
	}

	var errCnt = 0;

	var $tbody = $("<tbody></tbody>");
	for(var i=0; i<bodyLength; i++){
		var $tr = $("<tr></tr>");
		var isError = body[i][0].isError;

		$tr.append("<td>" + _common.utils.validNull(body[i][0].layerId) + "</td>");
		$tr.append("<td>" + _common.utils.validNull(body[i][0].itemNm) + "</td>");
		$tr.append("<td>" + _common.utils.validNull(body[i][0].itemVal) + "</td>");
		$tr.append("<td>" + _common.utils.validNull(body[i][0].jibnAddr) + "</td>");
		$tr.append("<td>" + _common.utils.validNull(body[i][0].roadAddr) + "</td>");
		$tr.append("<td>" + _common.utils.validNull(body[i][0].lat) + "</td>");
		$tr.append("<td>" + _common.utils.validNull(body[i][0].lon) + "</td>");

		if(isError){
			errCnt++;
			$tr.find("td").css({
				"background" : "red",
				"color" : "black",
				"font-weight" : "bold"
			});
		}
		$tbody.append($tr);
	}

	$table.append($thead).append($tbody);
	$("#bigdataView").find('#titleWrap').find("b").text("총 " + errCnt + " 개의 잘못된 위치(주소 또는 좌표) 데이터를 찾았습니다.");
	$("#bigdataView").find('#dataWrap').find("#tableWrap").html($table);
	$("#bigdataView").find('#dataWrap').show("clip");
}

function sliceField(tbl, enCol, krCol, sliceVal){

	if(_common.utils.isNullAndEmpty(enCol)){
		alert("분석 대상 필드를 선택해주세요.");
		return false;
	}

	var column, minVal, maxVal, count, rngVal = null;
	var param = { "tbl" : tbl, "col" : enCol, "dataType" : "numeric" };
	_common.callAjax("/getMinMax.json", param, function(json){
		column = json.column;
		for(var i=0; i<column.length; i++){
			var col = column[i].colId;
			if(col == "gid" || col == "_gid" || col == "_annox" || col == "_annoy"){
				column.splice(i, 1);
			}
		}

		minVal = json.result[0].min;
		maxVal = json.result[0].max;
		count = json.result[0].count;
		rngVal = Math.ceil(maxVal / sliceVal);

		if(minVal == 1 && maxVal == 1) sliceVal = 1;

		analysOption[selectLayer]["sortVal"] = sliceVal;
		analysOption[selectLayer]["values"] = new Array();
		for(var i=0; i<column.length; i++){
			var col = column[i].colId;

			var valSet = { col : { range : 0, buffer : 0, weight: 0 } };
			analysOption[selectLayer]["values"].push(valSet);
		}
	}, false);

	/* 타이틀 */
	var $thead = $("#columnWrap").find("#listWrap").find("thead");

	var $headTr = $("<tr></tr>");
	$headTr.append("<th width='8%'>색상</td>");

	for(var i=0; i<column.length; i++){
		var colId = column[i].colId;
		var colNm = column[i].colNm;
		$headTr.append("<th col='" + colId + "' lyr='" + tbl + "'>" + colNm + "</th>");
	}

	$headTr.append("<th width='10%'>영향범위</td>");
	$headTr.append("<th width='10%'>가중치</td>");
	$thead.html($headTr);

	/* 바디 */
	var $tbody = $("#columnWrap").find("#listWrap").find("tbody");
	$tbody.html("");

	var start = minVal;
	var end = (start + rngVal) - 1;
	var colorRange = chroma.scale(['#1DDB16', '#FFE400', '#FF0000']).colors(sliceVal);
	for(var i=0; i<sliceVal; i++){
		var $bodyTr = $("<tr></tr>");
		$bodyTr.append("<td><input type='color' class='rgbTxt' value='" + colorRange[i] + "' readOnly disabled></td>");

		for(var l=0; l<column.length; l++){
			var colId = column[l].colId;
			var colNm = column[l].colNm;
			if(colId == enCol){
				$bodyTr.append("<td>" + start + " ~ " + end + "</td>");
			}else{
				$bodyTr.append("<td></td>");
			}

			var valSet = { colId : { range : start + "~" + end, buffer : 0, weight: 0 } };
			analysOption[selectLayer]["values"].push(valSet);
		}

		$bodyTr.append("<td><button class='minus whiteBtn'>-</button><input class='tCenter small buffer' type='text' value='0'><button class='plus whiteBtn'>+</button></td>");
		$bodyTr.append("<td><button class='minus whiteBtn'>-</button><input class='tCenter small weight' type='text' value='0'><button class='plus whiteBtn'>+</button></td>");
		$tbody.append($bodyTr);

		start = start + rngVal;
		end = (start + rngVal) - 1;
	}

	$headTr.find("th").hover(function(){
		var idx = $(this).index();
		if(!_common.utils.isNullAndEmpty($(this).attr("col"))){
			$tbody.find("tr").each(function(){
				$(this).find("td").eq(idx).css("background", "#F3F3F3");
			});
		}
	}, function(){
		var idx = $(this).index();
		if(!_common.utils.isNullAndEmpty($(this).attr("col"))){
			$tbody.find("tr").each(function(){
				$(this).find("td").eq(idx).css("background", "white");
			});
		}
	});
	$headTr.find("th").click(function(){
		var idx = $(this).index();
		if(!_common.utils.isNullAndEmpty($(this).attr("col"))){
			var tbl = $(this).attr("lyr");
			var enCol = $(this).attr("col");
			var krCol = $(this).text();
			var sliceVal = $("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val();

			sliceField(tbl, enCol, krCol, sliceVal);

			analysOption[selectLayer]["col"] = enCol;
			$tbody.find("td").css("color", "white");
			$tbody.find("tr").each(function(){
				$(this).find("td").eq(0).css("color", "#666");
				$(this).find("td").eq(idx).css("color", "#666");
			});
		}
	});

	$tbody.find("input").change(function(){
		if(Number($(this).val()) > 100) $(this).val(100);
		if(Number($(this).val()) < -100) $(this).val(-100);
	});

	$tbody.find("input.buffer").change(function(){
		var idx = $tbody.find("input.buffer:visible").index($(this));
		var col = analysOption[selectLayer]["col"];
		var array = analysOption[selectLayer]["values"][col];
		array[idx]["buffer"] = Number($(this).val());
	});

	$tbody.find("input.weight").change(function(){
		var idx = $tbody.find("input.weight:visible").index($(this));
		var col = analysOption[selectLayer]["col"];
		var array = analysOption[selectLayer]["values"][col];
		array[idx]["weight"] = Number($(this).val());
	});

	$tbody.find(".minus").mousehold(50, function(){
		var $input = $(this).parent().find("input");
		if(Number($input.val()) > -100) $input.val(Number($input.val()) - 1);

		var cls = $input.hasClass("buffer") ? "buffer" : "weight";
		var col = analysOption[selectLayer]["col"];
		var idx = $tbody.find("input." + cls + ":visible").index($input);
		analysOption[selectLayer]["values"][col][idx][cls] = Number($input.val());
	});

	$tbody.find(".plus").mousehold(50, function(){
		var $input = $(this).parent().find("input");
		if(Number($input.val()) < 100) $input.val(Number($input.val()) + 1);

		var cls = $input.hasClass("buffer") ? "buffer" : "weight";
		var col = analysOption[selectLayer]["col"];
		var idx = $tbody.find("input." + cls + ":visible").index($input);
		analysOption[selectLayer]["values"][col][idx][cls] = Number($input.val());
	});
}

function createLayer(krName, enName){
	var name = krName;
	var lyr = enName;

	var key = parentView + "-" + name;
	var isExcel = $(".dragTr[lyr=" + enName + "]").hasClass("isExcel");

	var isContains = false;
	$("#bigdataView").find("#analysWrap").find(".legends").each(function(){
		if($(this).attr("key") == name) isContains = true;
	});

	if(isContains){
		alert("해당 데이터는 이미 추가되어있습니다.");
	}else{

		if(_common.utils.isNullAndEmpty(lyr)){
			//alert()
		}else{
			var vector = GMXMAP.getLayerById(lyr);
			if(vector){
				//vector.setVisible(true);
			}else{
				LayerConst.ThemeLoad(lyr);
				var thmLayer = GMXMAP.createVectorLayer(Layers[lyr]);
				GMXMAP.addLayer(thmLayer);
				Layers[lyr].loadFunction(thmLayer);
				if(k) GMXMAP.getLayerById(lyr).setVisible(false);
			}
			xeusSymbol.removeAllFeature();
		}

		var $shortcut = $('<svg width="30" height="20" style="vertical-align:bottom;"><rect width="30" height="20" style="fill:rgba(0, 0, 0, 0.1);stroke-width:4;stroke:rgba(0, 0, 0, 1.0);"></rect></svg>').css({
			"margin-left" : "5px"
		});

		var checked = "checked"; if(k) checked = "";
		var $div = $("<div class='legends'></div>").attr("key", lyr).attr("lyr", lyr).css("margin-left", "20px");
		var $layer = $("<p></p>").append("<input type='checkbox' lyr='" + lyr + "' id='" + lyr + "' class='layer' " + checked + ">")
								.append("<img lyr='" + lyr + "' class='lyrDel' src='../res/img/delete_over.png'>")
								.append("<button lyr='" + lyr + "' class='mngBtn detailBtn'></button>")
								//.append($shortcut)
								.append("<label for='" + lyr + "'>&nbsp;" + name + "</label>");

		$div.append($layer);

		$("#bigdataView").find("#analysWrap").append($div);

		$layer.find("input.layer").css("margin-right", "5px").change(function(){
			var key = $(this).attr("lyr");

			if($(this).is(":checked")){
				GMXMAP.getLayerById(key).setVisible(true);
				$(this).parent().next().find("input[type=checkbox]").prop("checked", true);

				xeusSymbol.setVisible(XeusLayer.getLayerId(key), true);
			}else{
				GMXMAP.getLayerById(key).setVisible(false);
				$(this).parent().next().find("input[type=checkbox]").prop("checked", false);

				xeusSymbol.setVisible(XeusLayer.getLayerId(key), false);
			}
		});

		$layer.find("img.lyrDel").css({
			/* "margin-right" : "10px", */
			"cursor" : "pointer"
		}).click(function(){
			var nm = $(this).parent().parent().attr("key");
			var lyr = $(this).attr("lyr");
			//confirm(nm + " 데이터를 분석 목록에서 제외하시겠습니까?", function(){
			confirm("선택하신 데이터를 분석 목록에서 제외하시겠습니까?", function(){
				delete analysOption[selectLayer];

				var vector = GMXMAP.getLayerById(lyr);
				if(vector) vector.setVisible(false);

				// TODO 분석옵션창이 삭제 레이어랑 같을 경우 창 닫기 처리필요
				$("#bigdataView").find(".legends[key=" + nm + "]").remove();
				$("#bigdataView").find("#optionWrap").find("tr[key=" + nm + "]").remove();
			});
		});

		if(isExcel) $layer.find("button.detailBtn").addClass("isExcel");
		$layer.find("button.detailBtn").click(function(){
			var $this = $(this);
			var lyr = $(this).attr("lyr");
			var isExcel = $(this).hasClass("isExcel");
			if(!_common.utils.isNullAndEmpty(lyr)){

				var param = {"tbl" : lyr, "dataType" : "numeric"};
				if(lyr.contains("bigdata_usr") || lyr.contains("bigdata_sys")){
					param["sortCol"] = "item_val";
					param["sortTyp"] = "asc";
				}

				param["limit"] = "50";
				param["offset"] = "0";
				//if(isExcel) param = {"tbl" : "v_bigdata_usrdata", "col" : "layer_id", "val" : "'" + lyr + "'"};

				$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val("");

				_common.callAjax("/getLayerData.json", param, function(json){
					var column = _common.getColumn(json.column);
					var list = json.result;
					var length = list.length;


					$("#bigdataView").find("#grpOptionWrap").find("span#cnt").text("총 " + length + "개의 데이터를 ");

					//var $tbody = $("<tbody></tbody>");
					var $thead = $("#columnWrap").find("#listWrap").find("thead");

					var $headTr = $("<tr></tr>");
					$headTr.append("<th width='8%'>색상</td>");
					if(isExcel){
						var min = json.result[0].item_val;
						var max = json.result[length - 1].item_val;
						$thead.data({ min : min, max : max });
						$headTr.append("<th col='item_val' lyr='" + lyr + "'>" + list[0].item_nm + "</th>");
					}else{
						for(var key in list[0]){
							if(!_common.utils.isNullAndEmpty(column.get(key))){
								if(key != "lat" && key != "lon"){
									$headTr.append("<th col='" + key + "' lyr='" + lyr + "'>" + column.get(key) + "</th>");
								}
							}
						}
					}
					$headTr.append("<th width='10%'>영향범위</td>");
					$headTr.append("<th width='10%'>가중치</td>");
					$thead.html($headTr);

					var $tbody = $("#columnWrap").find("#listWrap").find("tbody");
					$tbody.html("");
					for(var i=0; i<length; i++){
						var $bodyTr = $("<tr></tr>").data({ defaultVal : list[i]["item_val"] });
						$bodyTr.append("<td><input type='color' class='rgbTxt' value='#FFFFFF' readOnly disabled></td>");
						if(isExcel){
							$bodyTr.append("<td>" + list[i]["item_val"] + "</td>");
						}else{
							for(var key in list[i]){
								if(!_common.utils.isNullAndEmpty(column.get(key))){
									if(key != "lat" && key != "lon"){
										$bodyTr.append("<td>" + list[i][key] + "</td>");
									}
								}
							}
						}
						$bodyTr.append("<td><button class='minus whiteBtn'>-</button><input class='tCenter small buffer' type='text' value='0'><button class='plus whiteBtn'>+</button></td>");
						$bodyTr.append("<td><button class='minus whiteBtn'>-</button><input class='tCenter small weight' type='text' value='0'><button class='plus whiteBtn'>+</button></td>");
						$tbody.append($bodyTr);
					}

					$headTr.find("th").click(function(){
						var idx = $(this).index();
						if(!_common.utils.isNullAndEmpty($(this).attr("col"))){
							$("#bigdataView").find("#grpOptionWrap").find("#sortBtn").attr({
								tbl : $(this).attr("lyr"),
								enCol : $(this).attr("col"),
								krCol : $(this).text()
							});
							analysOption[selectLayer]["col"] = $(this).attr("col");
							$tbody.find("td").css("color", "white");
							$tbody.find("tr").each(function(){
								$(this).find("td").eq(0).css("color", "#666");
								$(this).find("td").eq(idx).css("color", "#666");
							});
						}
					});

					/*$headTr.find("th").hover(function(){
						var idx = $(this).index();
						if(!_common.utils.isNullAndEmpty($(this).attr("col"))){
							$tbody.find("tr").each(function(){
								$(this).find("td").eq(idx).css("background", "#F3F3F3");
							});
						}
					}, function(){
						var idx = $(this).index();
						if(!_common.utils.isNullAndEmpty($(this).attr("col"))){
							$tbody.find("tr").each(function(){
								$(this).find("td").eq(idx).css("background", "white");
							});
						}
					});
					$headTr.find("th").click(function(){
						var idx = $(this).index();
						if(!_common.utils.isNullAndEmpty($(this).attr("col"))){
							$("#bigdataView").find("#grpOptionWrap").find("#sortBtn").attr({ tbl : $(this).attr("lyr"), col : $(this).attr("col") });
							analysOption[selectLayer]["col"] = $(this).attr("col");
							//$headTr.find("th").css("color", "#e8e8e8");
							$tbody.find("td").css("color", "white");
							$tbody.find("tr").each(function(){
								$(this).find("td").eq(0).css("color", "#666");
								$(this).find("td").eq(idx).css("color", "#666");
							});
							//$(this).css("color", "#666");
						}
					});

					$tbody.find("input").change(function(){
						if(Number($(this).val()) > 100) $(this).val(100);
						if(Number($(this).val()) < -100) $(this).val(-100);
					});

					$tbody.find("input.buffer").change(function(){
						var idx = $tbody.find("input.buffer:visible").index($(this));
						var array = analysOption[selectLayer]["values"];
						array[idx]["buffer"] = Number($(this).val());
					});

					$tbody.find("input.weight").change(function(){
						var idx = $tbody.find("input.weight:visible").index($(this));
						var array = analysOption[selectLayer]["values"];
						array[idx]["weight"] = Number($(this).val());
					});

					$tbody.find(".minus").mousehold(50, function(){
						var $input = $(this).parent().find("input");
						if(Number($input.val()) > -100) $input.val(Number($input.val()) - 1);

						var cls = $input.hasClass("buffer") ? "buffer" : "weight";
						var idx = $tbody.find("input." + cls + ":visible").index($input);
						analysOption[selectLayer]["values"][idx][cls] = Number($input.val());
					});

					$tbody.find(".plus").mousehold(50, function(){
						var $input = $(this).parent().find("input");
						if(Number($input.val()) < 100) $input.val(Number($input.val()) + 1);

						var cls = $input.hasClass("buffer") ? "buffer" : "weight";
						var idx = $tbody.find("input." + cls + ":visible").index($input);
						analysOption[selectLayer]["values"][idx][cls] = Number($input.val());
					});*/

					$("#bigdataView").find("#columnWrap").show();
					var offset = $("#bigdataView").find("#virtual-map-boundary").offset();
					$("#bigdataView").find("#dragWrap, #optionWrap, #columnWrap").offset({
						top: offset.top,
						left: offset.left
					});

					$("#bigdataView").find("#optionWrap, #dragWrap").hide();

					var idx = $("#bigdataView").find('.legends').find(".detailBtn").index($this);

					selectLayer = lyr;
					if(selectLayer in analysOption == false){
						analysOption[selectLayer] = {
							sortVal : Number($("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val()),
							korName : name,
							col : null,
							zIndex : idx,
							jibnYn : false
						};
						/*if(length >= 30){
							$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val(10);
							//$("#bigdataView").find("#grpOptionWrap").find("#sortBtn").click();
						}else{
							$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val(1);
							//$("#bigdataView").find("#grpOptionWrap").find("#sortBtn").click();
						}*/
						$("#bigdataView").find("#grpOptionWrap").find("input[type=check]").removeProp("checked");
					}else{
						$("#bigdataView").find("#grpOptionWrap").find("input[type=number]").val(analysOption[selectLayer]["sortVal"]);
						$("th[col=" + analysOption[selectLayer]["col"] + "]").click();
						$("#bigdataView").find("#grpOptionWrap").find("#sortBtn").click();

						if(analysOption[selectLayer]["jibnYn"]){
							$("#bigdataView").find("#grpOptionWrap").find("input[type=checkbox]").prop("checked", "checked");
						}else{
							$("#bigdataView").find("#grpOptionWrap").find("input[type=checkbox]").removeProp("checked");
						}
						var vals = analysOption[selectLayer]["values"];
						for(var i=0; i<vals.length; i++){
							var bfr = vals[i].buffer;
							var wei = vals[i].weight;
							$tbody.find("input.buffer:visible").eq(i).val(bfr);
							$tbody.find("input.weight:visible").eq(i).val(wei);
						}

					}

					if(isEditAnalyze){
						$("th[col=" + analysOption[selectLayer]["col"] + "]").click();
						$("#bigdataView").find("#grpOptionWrap").find("#sortBtn").click();

						var vals = analysOption[selectLayer]["values"];
						for(var i=0; i<vals.length; i++){
							var bfr = vals[i].buffer;
							var wei = vals[i].weight;
							$tbody.find("input.buffer:visible").eq(i).val(bfr);
							$tbody.find("input.weight:visible").eq(i).val(wei);
						}
					}

					//$("th[col=" + analysOption[selectLayer]["col"] + "]").click();

				});

			}
		});

	}

}

function setLayers(){
	$("#bigdataView").find("#userLayerWrap").find(".selectable").html("");
	_common.callAjax("/bigData/getUserLayer.json", {}, function(json){

		for(var i=0; i<json.result.length; i++){
			var layerId = json.result[i].layerId;
			var layerNm = json.result[i].layerNm;
			var layerGbnCd = json.result[i].layerGbnCd;
			var layerGbnNm = _common.getCodeByName("C26", layerGbnCd);

			var $li = $("<li class='ui-state-default isExcel' lyr='" + layerId + "'>" + layerNm + "</li>");
			var $tr = $("<tr class='dragTr' lyr='" + layerId + "'><td>" + layerNm + "</td></tr>");
			if(layerGbnCd == "11") $tr.addClass("isExcel");
			// TODO 추후 주석해제
			/*$li.append('<img class="delExcel" src="../res/img/close.png">');
				$li.find("img.delExcel").click(function(){
					confirm("데이터를 물리적으로 삭제하시겠습니까?<br><br>레이어명) " + layerNm, function(){
						_common.callAjax("/bigData/delExcelLayer.json", { layerId : layerId, layerNm : layerNm }, function(json){
							if(json.result){
								alert("삭제되었습니다.");
							}
						});
					});
				});*/
			if(layerGbnCd == "10") $("#bigdataView").find("#sysLayerWrap").find("tbody").append($tr);
			if(layerGbnCd == "11") $("#bigdataView").find("#userLayerWrap").find("tbody").append($tr);
			if(layerGbnCd == "12") $("#bigdataView").find("#externalLayerWrap").find("tbody").append($tr);
			if(layerGbnCd == "99") $("#bigdataView").find("#etcLayerWrap").find("tbody").append($tr);

			//var color = chroma.random().rgb().toString();
			var color = "255, 0, 0";

			Layers[layerId] = {
				state : 'active',
				name : layerNm,
				group : "",
				fnGroup : "TEMP",
				url : LayerConst.URL,
				type : LayerConst.POINT,
				typeName : "gmx:" + layerId,
				LayerTheme : layerId,
				zIndex : 8,
				visible : true,
				selectable : true,
				minResolution : 0,
				maxResolution : Infinity,
				shortcut : "<svg width='30' height='30' style='vertical-align:middle;'><circle cx='15' cy='15' r='10' stroke='" + color + "' stroke-width='2' fill='rgba(" + color + ",0.3)' /></svg>",
				//shortcut : "<img src='" + _common.context() + "/sym/getSymbol.do?mgrNo=" + rainfallSymIcon + "' class='sym-icon'>",
				style : function(feature, resolution){
					return new ol.style.Style({
						/*stroke: new ol.style.Stroke({
							color: 'rgba(31, 73, 125, 1)',
							width: 1
						}),
						fill: new ol.style.Fill({
							color: 'rgba(0, 0, 0, 0)'
						}),*/
						image: new ol.style.Circle({
							radius: 5,
							stroke: new ol.style.Stroke({
								color: 'rgba(' + color + ',1.0)',
								width: 1
							}),
							fill : new ol.style.Fill({
								color: 'rgba(' + color + ',0.3)'
							})
						})
					});
				},
				lastParam : null,
				loadFunction : function(_lyr, val){
					this.lastParam = val;
					var _source = _lyr.getSource();
					var _geoJSON = new ol.format.GeoJSON();

					$.ajax({
						url : _common.context() + "/CustomWFS",
						type : "POST",
						data : {
							tbl : _lyr.get("fullName")
						},
						dataType : "json",
						beforeSend : function() {
							_source.clear();
						},
						success : function(json) {

							var _features = _geoJSON.readFeatures(json);
							/*for(var i=0; i<_features.length; i++){
								var feature = _features[i];
								var point = feature.getGeometry().getFirstCoordinate();
								var gid = feature.get("_gid");

								feature.setProperties({
									//"img_path" : "../res/sym/nms/" + feature.get("sym_cd") + ".png",
									//"img_path" : "../res/sym/waterPump/water.png",
									"img_path" : "../sym/getSymbol.do?mgrNo=" + rainfallSymIcon,
									"target_field" : "raingauge_name",
									"popup" : true
								});
							}*/
							_source.addFeatures(_features);
						},
						error : function(xhr, status, error) { }
					});
				},
				reload : function(){
					Layers[layerId].loadFunction(GMXMAP.getLayerByName(Layers[layerId]["name"]));
				}
			}
		}

		$("#bigdataView").find("#selectWrap").find(".selectable").find("li, tr").draggable({
			appendTo : "body",
			helper : "clone",
			start : function(event, ui) {
				$(ui.helper).addClass("ui-draggable-helper");
				$(this).draggable("option", "revert", true);

				/* 2017-09-19 이주영 수정 */
				$("#bigdataView").find(".dropBox").show("puff", 200);
				for (var i = 0; i < 1; i++) {
					$("#bigdataView").find(".dropBox").animate({
						"color" : "white"
					}, 150);
					$("#bigdataView").find(".dropBox").animate({
						"color" : "gray"
					}, 150);
				}
				$("#bigdataView").find(".dropBox").animate({
					"color" : "white"
				}, 150);
			}
		});
	}, false);
}

function parseData(){
	var result = new Array();

	if("{}" == JSON.stringify(analysOption)){
		alert("레이어 추가 및 옵션설정이 필요합니다.");
		return false;
	}
	for(var layer in analysOption){

		var data = analysOption[layer];
		var col = data["col"];
		if(_common.utils.isNullAndEmpty(col)){
			alert(data["korName"] + " 레이어의 분석 대상 항목을 선택해 주세요.");
			return false;
		}

		var layerSet = new Array();
		var analyWeight = new Array();

		var jsonSet = {};
		jsonSet["layerId"] = layer;
		jsonSet["layerNm"] = analysOption[layer]["korName"];
		jsonSet["itemNm"] = col;
		jsonSet["layerSeq"] = "" + analysOption[layer]["zIndex"];
		if(Boolean(analysOption[layer]["jibnYn"])){
			jsonSet["jibnYn"] = "Y";
		}else{
			jsonSet["jibnYn"] = "N";
		}

		layerSet.push(jsonSet);

		var isGroup = data["isGroup"];
		var length = data["values"].length;
		for(var i=0; i<length; i++){
			var json = {};
			json["layerId"] = layer;
			json["itemNm"] = col;

			var range = data["values"][i]["range"];

			if(isGroup){
				var minmax = range.split("~");
				json["minVal"] = "" + Number(minmax[0]);
				json["maxVal"] = "" + Number(minmax[1]);
			}else{
				json["minVal"] = "" + range;
				json["maxVal"] = "" + range;
			}

			json["weightVal"] = "" + data["values"][i]["weight"];
			json["impactM"] = "" + data["values"][i]["buffer"];

			analyWeight.push(json);
		}

		result.push({"layerSet" : layerSet, "analyWeight" : analyWeight});
	}

	return result;
}
