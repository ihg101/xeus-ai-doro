var selectLayer = "";
var analysOption = {};
var analyNm = "";
var isEditAnalyze = false;

var bigdataLayerSet = {};
var bigdataAnalyWeight = {};

(function(GMXMAP, GMXLAYER){

	GMXMAP.setAllLayerUnVisible();

	/**
	 * 레이어 목록을 표출합니다.
	 * 권한에 따라 상이하게 표출됩니다.
	 *
	 * @param _callBack
	 */
	var setLayers = function(_callBack){
		$("#dragWrap").css("padding", "0px");

		var $legendWrap = $("#legendWrap").clone();
		$legendWrap.find("th, td").css("padding", "0px");
		$legendWrap.removeClass("dialogWrap ui-dialog-content ui-widget-content").width("100%").height("100%");

		$("#dragWrap").html($legendWrap);

		$legendWrap.find(".legend").each(function(){
			if($(this).find("tbody").children().length == 0) $(this).remove();

			$(this).find("tbody").show();
		});

		$legendWrap.find(".toggleTMSLayer").parent().parent().parent().parent().remove();

		$legendWrap.find(".legend").each(function(){
			$(this).find(".layerGroupToggle").attr("colspan", 3).removeClass("pointer");
			$(this).find(".layerGroupToggle").find("span").remove();
			$(this).find(".layerGroupToggle").find(".groupLayerToggle").remove();
			$(this).find(".layerGroupToggle").find(".layerT").removeClass("layerT").css({
				"text-align": "left",
				"width": "100%",
				"box-sizing": "border-box",
				"padding": "15px 0 15px 25px",
				"display": "flex",
				"flex-flow": "nowrap",
				"align-items": "center",
				"color": "#fff",
				"font-size": "14px",
				"font-weight": "normal",
				"position": "relative"
			});
			$(this).find(".layerTheme").remove();

			$(this).find(".layer").each(function(){
				$(this).find("td").slice(0, 2).remove();
				$(this).find(".thmToggle").remove();
				$(this).find(".shotcut, .layerName").removeClass("pointer");
				$(this).find(".edit").removeClass("edit").addClass("selectLayer").addClass("btn_Dstyle").text("선택");

				if($(this).find("td").eq(2).children().length === 0){
					$(this).find("td").eq(2).append($("<button class='selectLayer btn_Dstyle'>선택</button>"));
				}

				$(this).addClass("dragTr").attr("lyr", $(this).attr("k"));
			});
		});

		$legendWrap.find(".selectLayer").click(function(){
			var krName = $(this).parent().parent().find(".layerName").text();
			var enName = $(this).parent().parent().attr("lyr");
			var skName = GMXLAYER.LayerList[enName].layer.schemNm;

			xeusBigdata.setDataTable(krName, enName, skName);
		});
	}

	/**
	 * 닫기가 불가능한 로딩 dialog 를 생성합니다.
	 */
	var createLoadingWrap = function(){
		var $loader = $("<div>").addClass("cssload-container").css("margin", "0 auto").css("margin-top", "100px");
		$loader.append($("<div>").addClass("cssload-cube"));
		$loader.find(".cssload-cube").append($("<div>").addClass("cssload-half1"));
		$loader.find(".cssload-half1").append($("<div>").addClass("cssload-side cssload-s1"));
		$loader.find(".cssload-half1").append($("<div>").addClass("cssload-side cssload-s2"));
		$loader.find(".cssload-half1").append($("<div>").addClass("cssload-side cssload-s5"));
		$loader.find(".cssload-cube").append($("<div>").addClass("cssload-half2"));
		$loader.find(".cssload-half2").append($("<div>").addClass("cssload-side cssload-s3"));
		$loader.find(".cssload-half2").append($("<div>").addClass("cssload-side cssload-s4"));
		$loader.find(".cssload-half2").append($("<div>").addClass("cssload-side cssload-s6"));

		var $div = $("<div>").attr("id", "analyLoadingWrap").addClass("table_style customScroll");
		$div.append($loader);
		$div.append("<h3 class='tCenter'><b>서버에서 빅데이터 분석을 진행하고 있습니다.<br><br>분석이 완료되면 결과를 자동으로 표시합니다.</b></h3>");

		$("#parentBody").append($div);

		$div.dialog({
			title: "빅데이터 분석 결과 대기",
			modal: true,
			resizable: false,
			draggable: false,
			closeOnEscape: false,
			width: 800,
			height: 700,
			position: {
				my: "center center",
				at: "center center",
				of: $("#map")
			},
			open: function(){
				$div.parent().find(".ui-dialog-titlebar-close").hide();
			},
			close: function(){
				$div.dialog("destroy");
				$div.remove();
			}
		});
	}




	/**
	 *  부호를 변환한다
	 *  더하기면 +로 바꾸고, 빼기면 -로 바꾼다
	 */
	var changeSignByOpeStr = function(opeStrSelector, weightSelector){
		var opeStr = opeStrSelector.val();
		var val = weightSelector.val();
		if(opeStr == "+"){
			if(val < 0){
				weightSelector.val(val*-1);
			}
		}else if(opeStr == "-"){
			if(val > 0){
				weightSelector.val(val*-1);
			}
		}
	}

	if($(".ui-dialog-content#dragWrap").length > 0) $(".ui-dialog-content#dragWrap").dialog("destroy");
	if($(".ui-dialog-content#columnWrap").length > 0) $(".ui-dialog-content#columnWrap").dialog("destroy");

	$("p.group-title").remove();
	$("div.groups").css("margin-bottom", "0px");

	/**
	 * 불러온 분석 결과를 셋팅합니다.
	 */
	if(!_common.utils.isNullAndEmpty(k) && !_common.utils.isNullAndEmpty(fk) && !_common.utils.isNullAndEmpty(tbl)){
		Public.BIGDATA.View.Start();

		$("#startAnalysBtn").addClass("hidden");
		$("#editAndAnalyBtn, #saveAndAnalyBtn").removeClass("hidden");
		$("#layerWeightHintTxt").remove();

		_common.callAjax("/bigData/getAnalysisOption.json", { "k" : fk }, function(json){
			isEditAnalyze = true;
			analyNm = json.analyze.analyNm;
			$("#loadAnalyzeName").removeClass("hidden").find("p").text(analyNm + " (" + new Date().formatDate(json.analyze.analyDat) + ")");

			bigdataLayerSet = {};
			var layerSet = JSON.parse(JSON.stringify(json.bigdataLayerSet));
			for(var i=0; i<layerSet.length; i++){
				var krName = null;
				var skName = layerSet[i].layerId.split(".")[0];
				var enName = layerSet[i].layerId.split(".")[1];
				var krField = null;
				var enField = layerSet[i].itemNm;

				if(enName  in bigdataLayerSet == false) bigdataLayerSet[enName] = {};
				if(enField in bigdataLayerSet[enName] == false) bigdataLayerSet[enName][enField] = {};

				bigdataLayerSet[enName][enField]["layerId"] = layerSet[i].layerId;
				bigdataLayerSet[enName][enField]["layerNm"] = layerSet[i].layerNm;
				bigdataLayerSet[enName][enField]["layerSeq"] = layerSet[i].layerSeq;
				bigdataLayerSet[enName][enField]["itemNm"] = layerSet[i].itemNm;
				bigdataLayerSet[enName][enField]["weightVal"] = layerSet[i].weightVal;
				bigdataLayerSet[enName][enField]["isExists"] = layerSet[i].isExists;

				/*if(layerSet[i].layerId in GMXLAYER.LayerList){
					bigdataLayerSet[enName][enField]["layerId"] = GMXLAYER.LayerList[layerSet[i].layerId].layer.schemNm + "." + layerSet[i].layerId;
				}*/

				var fullName = layerSet[i].layerNm.split(" - ");
				if(fullName.length == 2){
					krName  = fullName[0];
					krField = fullName[1];
				}

				xeusBigdata.createLayer(krName, enName, krField, enField);
			}

			bigdataAnalyWeight = {};
			if(enName in bigdataLayerSet){
				var weight = JSON.parse(JSON.stringify(json.bigdataAnalyWeight));
				for(var i=0; i<weight.length; i++){
					var skName = weight[i].layerId.split(".")[0];
					var enName = weight[i].layerId.split(".")[1];
					//var enName = weight[i].layerId;
					var enField = weight[i].itemNm;
					if(enName  in bigdataAnalyWeight == false) bigdataAnalyWeight[enName] = {};
					if(enField in bigdataAnalyWeight[enName] == false) bigdataAnalyWeight[enName][enField] = {};

					bigdataAnalyWeight[enName][enField]["layerId"] = weight[i].layerId;
					bigdataAnalyWeight[enName][enField]["itemNm"] = weight[i].itemNm;
					bigdataAnalyWeight[enName][enField]["opeStr"] = weight[i].opeStr;
					bigdataAnalyWeight[enName][enField]["weightVal"] = weight[i].weightVal;
					bigdataAnalyWeight[enName][enField]["impactM"] = weight[i].impactM;

					/*if(layerSet[i].layerId in GMXLAYER.LayerList){
						bigdataLayerSet[enName][enField]["layerId"] = GMXLAYER.LayerList[layerSet[i].layerId].layer.schemNm + "." + layerSet[i].layerId;
					}*/
				}
			}

		}, false);
	}else{
		$("#startAnalysBtn").removeClass("hidden");
		$("#editAndAnalyBtn, #saveAndAnalyBtn").addClass("hidden");
	}

	/**
	 * 중심값을 설정합니다.
	 */
	$("#resultWrap").find("#sortValSetBtn").click(function(){
		var min = Number($(this).attr("min"));
		var max = Number($(this).attr("max"));
		var val = min;
		if(min < -4) val = 1;
		if(Public.BIGDATA.View.slideVal) val = Public.BIGDATA.View.slideVal;

		var _html = '';
		_html += '<div id="sortValSetWrap" class="table_style customScroll" style="display: none;"> ';
		_html += '    <table class="list"> ';// cellspacing="0" width="100%" style="margin-top:0;"
		_html += '        <tbody> ';

		_html += '        	<tr> ';
		_html += '            	<td width="50px" class="tCenter">' + min + '</td> ';
		_html += '            	<td><div id="slider"><div id="custom-handle" class="ui-slider-handle"></div></div></td> ';
		_html += '            	<td width="50px" class="tCenter">' + max + '</td> ';
		_html += '        	</tr> ';
		_html += '        	<tr> ';
		_html += '            	<th colspan="3" id="slideTxt"></th> ';
		_html += '        	</tr> ';
		_html += '        	<tr> ';
		_html += '            	<th colspan="3"><button id="saveBtn" class="btn_style2">설정</button><button id="resetBtn" class="btn_style2">초기화</button></th> ';
		_html += '        	</tr> ';

		_html += '        </tbody> ';
		_html += '    </table> ';
		_html += '</div> ';

		$("#parentBody").append(_html);

		$("#sortValSetWrap").dialog({
			title: "중심값 설정",
			modal: true,
			resizable: false,
			width: 500,
			height: 240,
			position: {
				my: "center center",
				at: "center center",
				of: $("#map")
			},
			open: function(){

			},
			close: function(){
				$("#sortValSetWrap").dialog("destroy");
				$("#sortValSetWrap").remove();
			}
		}).parent().draggable({
			containment: "#map",
			scroll: false
		});

		var handle = $("#custom-handle");
		$("#slider").slider({
			min: min,
			max: max,
			value: val,
			create: function() {
				//handle.text( $( this ).slider( "value" ) );
				$("#slideTxt").text("설정된 " + val + "값을 중심(노란색)으로 스펙트럼을 구성합니다.").attr("val", val);
			},
			slide: function( event, ui ) {
				//handle.text( ui.value );
				$("#slideTxt").text("설정된 " + ui.value + "값을 중심(노란색)으로 스펙트럼을 재구성합니다.").attr("val", ui.value);
			}
		});

		if(Public.BIGDATA.View.slideVal){
			$("#slideTxt").text("설정된 " + Public.BIGDATA.View.slideVal + "값을 중심(노란색)으로 스펙트럼을 재구성합니다.").attr("val", Public.BIGDATA.View.slideVal);
		}

		$("#sortValSetWrap").find("#saveBtn").click(function(){
			Public.BIGDATA.View.slideVal = Number($("#slideTxt").attr("val"));
			$("#sortValSetWrap").dialog("close");

			var center = GMXMAP.getView().getCenter();
			GMXMAP.getView().setCenter([center[0], center[1] + 0.0000000001]);
		});

		$("#sortValSetWrap").find("#resetBtn").click(function(){
			Public.BIGDATA.View.slideVal = null;
			$("#sortValSetWrap").dialog("close");

			var center = GMXMAP.getView().getCenter();
			GMXMAP.getView().setCenter([center[0], center[1] + 0.0000000001]);
		});
	});

	$("#weightSetTable").find("input.buffer").change(function(){
		var enName = $(this).parent().parent().find("#selectField").attr("enName");
		var enField = $(this).parent().parent().find("#selectField").attr("enField");
		if(_common.utils.isNullAndEmpty(enField)) enField = "-unknown-";
		var val = $(this).val();
		if(bigdataAnalyWeight[enName]){
			if(bigdataAnalyWeight[enName][enField]){
				bigdataAnalyWeight[enName][enField]["impactM"] = val;
			}
		}
	});

	$("#weightSetTable").find("input.weight").change(function(){

		var opeStrSelector = $("#weightSetTable").find(".opeStr");
		var weightSelector = $(this);

		changeSignByOpeStr(opeStrSelector,weightSelector);

		var enName = $(this).parent().parent().find("#selectField").attr("enName");
		var enField = $(this).parent().parent().find("#selectField").attr("enField");
		if(_common.utils.isNullAndEmpty(enField)) enField = "-unknown-";
		var val = $(this).val();
		if(bigdataAnalyWeight[enName]){
			if(bigdataAnalyWeight[enName][enField]){
				bigdataAnalyWeight[enName][enField]["weightVal"] = val;
			}
		}

	});

	$("#weightSetTable").find("select.opeStr").change(function(){

		var opeStrSelector = $(this);
		var weightSelector = $("#weightSetTable").find(".weight");

		changeSignByOpeStr(opeStrSelector,weightSelector);

		var enName = $(this).parent().parent().find("#selectField").attr("enName");
		var enField = $(this).parent().parent().find("#selectField").attr("enField");
		if(_common.utils.isNullAndEmpty(enField)) enField = "-unknown-";
		var val = $(this).val();
		if(bigdataAnalyWeight[enName]){
			if(bigdataAnalyWeight[enName][enField]){
				bigdataAnalyWeight[enName][enField]["opeStr"] = val;
				bigdataAnalyWeight[enName][enField]["weightVal"] = weightSelector.val();
			}
		}

	});

	$("#revertBtn").click(function(){
		var sortTyp = $("#resultWrap").find("#resultTableWrap").find("#sortTyp").val();
		if(!_common.utils.isNullAndEmpty(sortTyp)){
			if(sortTyp == "desc"){
				sortTyp = "asc";
			}else{
				sortTyp = "desc";
			}
			Public.BIGDATA.View.Start(sortTyp);
		}
	});

	$("#resultExcelBtn").click(function(){
		var sortTyp = $("#resultTableWrap").find("#sortTyp").val();

		if($("#resultTableWrap").find("table").find("tbody").children().length <= 1){
			alert("검색결과가 존재하지 않아 다운로드할 수 없습니다.");
		}else{
			var min, max, cnt, slice, range, color;
			_common.callAjax("/bigData/getMinMax.json", { tblId : tbl }, function(json){
				min = json.result.min_val;
				max = json.result.max_val;
				cnt = json.result.count;

				slice = 10;
				range = Math.ceil((max - min) / slice);
				if(sortTyp == "desc") color = chroma.scale(['#1DDB16', '#FFE400', '#FF0000']).colors(slice);
				if(sortTyp == "asc")  color = chroma.scale(['#FF0000', '#FFE400', '#1DDB16']).colors(slice);

				var start = min;
				var end = start + range;

				var param = {
					fk : fk,
					tblId : tbl,
					sortCol : "result_val",
					sortTyp : sortTyp,
					color : color.toString(),
					min : min,
					max : max,
					range : range,
					slice : slice,
					isExcel : "isExcel"
				};

				if(confirm("검색결과를 엑셀로 다운로드 하시겠습니까?")){
					_common.postForm.submit("/bigData/getResultExcel.do", param);
					alert("다운로드를 요청하였습니다.\n\n잠시후 자동으로 다운로드가 진행됩니다.\n\n주의) 페이지를 이동하지 마세요.");
				}
			}, false);
		}
	});

	/* 등록이벤트 */
	$("#weightSetTable").find("#regLayerBtn").click(function(){

		var krField = $("#weightSetTable").find("#selectField").attr("krField");
		var enField = $("#weightSetTable").find("#selectField").attr("enField");

		var krName = $("#weightSetTable").find("#selectField").attr("krName");
		var enName = $("#weightSetTable").find("#selectField").attr("enName");

		var impact = $("#weightSetTable").find("input.buffer").val();
		var weight = $("#weightSetTable").find("input.weight").val();
		var opeStr = $("#weightSetTable").find("select.opeStr").val();

		if(_common.utils.isNullAndEmpty(krField)){
			krField = "위치";
			enField = "-unknown-";
		}

		var fullLayerName = krName + " - " + krField;
		var isContains = false;
		$("#analysWrap").find(".legends").find("label").each(function(){
			if($(this).text() == fullLayerName) isContains = true;
		});

		if(isContains){
			if($(this).text() == "등록"){
				alert("해당 데이터는 이미 추가되어있습니다.");
			}else if($(this).text() == "저장"){
				alert("설정값이 저장되었습니다.");
			}
		}else{
			try{
				if(enName in bigdataLayerSet == false) bigdataLayerSet[enName] = {};
				bigdataLayerSet[enName][enField] = {
					"layerId"	: enName,
					"layerNm"	: krName + " - " + krField,
					"layerSeq"	: "0",
					"itemNm"	: enField,
					"weightVal" : "0",
					"isExists"  : "t"
				}

				if(enName in GMXLAYER.LayerList){
					bigdataLayerSet[enName][enField].layerId = GMXLAYER.LayerList[enName].layer.schemNm + "." + enName;
				}

				if(enName in bigdataAnalyWeight == false) bigdataAnalyWeight[enName] = {};
				bigdataAnalyWeight[enName][enField] = {
					"layerId"	: enName,
					"itemNm"	: enField,
					"opeStr"	: opeStr,
					"weightVal" : weight,
					"impactM"	: impact
				}

				if(enName in GMXLAYER.LayerList){
					bigdataAnalyWeight[enName][enField].layerId = GMXLAYER.LayerList[enName].layer.schemNm + "." + enName;
				}

				xeusBigdata.createLayer(krName, enName, krField, enField);

				if($("#columnWrap").length > 0) $("#columnWrap").dialog("close");
				if($("#dragWrap").length > 0) $("#dragWrap").dialog("close");
			}catch(e){
				console.error(e);
				delete bigdataLayerSet[enName];
			}
		}

	});

	/* 레이어 선택 열기 */
	$("#lyrSelectBtn").click(function(){
		setLayers();

		if($("#dragWrap").hasClass("ui-dialog-content")){
			$("#dragWrap").dialog("open");
		}else{
			$("#dragWrap").dialog({
				title: "레이어 선택",
				modal: true,
				//width: $("#map").width(),
				width: 400,
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function(){

				},
				close: function(){
					$(this).dialog("close");
				}
			}).parent().draggable({
				containment: "#map",
				scroll: false
			});
		}
	});

	/* 초기화 이벤트 */
	$("#resetBtn").click(function(){
		if(confirm("진행 상황을 초기화하시겠습니까?")){
			if(Public.StopEvent) Public.StopEvent();
			$("#btn-anlys-view").click();
		}
	});

	/* 재분석 이벤트 */
	$("#editAndAnalyBtn").click(function(){

		var data = xeusBigdata.parseData();
		if(data){
			//if(confirm("재분석 하시겠습니까?\n기존 분석결과가 삭제됩니다.\n\n분석명) " + analyNm)){
			if(confirm("재분석 하시겠습니까?\n\n기존 분석결과가 삭제됩니다.")){
				_common.callAjax("/bigData/editAnalys.json", { json : JSON.stringify(data), k : k, fk : fk, tbl : tbl }, function(json){
					if(json.result){
						$("#analyOptionWrap").dialog("close");
						createLoadingWrap();
					}
					if(json.analyze){
						if(json.analyze.mgrSeq){
							var hist = null;
							var interval = setInterval(function(){
								if(hist == null){
									_common.callAjax("/bigData/getAnalysHistList.json", { "mgrSeq" : json.analyze.mgrSeq }, function(_json){
										if(_json.hist.length > 0){
											hist = _json.hist[0];
											clearInterval(interval);
											interval = null;

											$(".ui-dialog-buttonset").find("button").click();

											if(hist.analyState == "99"){
												alert("분석을 실패하였습니다.");
											}else /*if(hist.analyState == "13")*/{
												$("#analyLoadingWrap").dialog("close");

												if(!GMXMAP){
													alert("분석이 완료되었습니다.");
												}else{
													var v = hist.mgrSeq;
													var fk = hist.analyMgrSeq;
													var tbl = hist.resultTblNm;

													$("#btn-anlys-view").click();
													_common.callAjax("/bigData/getAnalysisView.do", { "k" : v, "fk" : fk, "tbl" : tbl }, function(view) {
														$("#contentWrap").html(view);
													}, false);
												}
											}

										}
									}, false);
								}
							}, 1000);
						}
					}
				});
			};
		}

	});

	/* 분석 버튼 이벤트 */
	$("#startAnalysBtn, #saveAndAnalyBtn").click(function(){

		var data = xeusBigdata.parseData();
		if(data){
			var _html = '';
			_html += '<div id="analyOptionWrap" class="table_style customScroll"> ';
			_html += '    <table> ';
			_html += '        <tbody> ';
			_html += '        	<tr> ';
			_html += '            	<th width="150"><label>분석명칭</label></th> ';
			_html += '            	<td><input type="text" id="analyNm" autofocus></td> ';
			_html += '        	</tr> ';
			_html += '        	<tr> ';
			_html += '            	<th><label>분석일정</label></th> ';
			_html += '            	<td> ';
			_html += '            		<select id="analyPlan" class="wide"> ';
			_html += '            			<option value="I:00:00">즉시실행</option> ';
			/*_html += '            			<option value="W:01:00">매주실행</option> ';
			_html += '            			<option value="M:01:00">매월실행</option> ';
			_html += '            			<option value="Q:01:00">분기실행</option> ';
			_html += '            			<option value="Y:01:01">매년실행</option> ';*/
			_html += '            		</select> ';
			_html += '            	</td> ';
			_html += '        	</tr> ';
			_html += '        	<tr> ';
			_html += '            	<td colspan="2"><button id="saveBtn" class="btn_style">확인</button></td> ';
			_html += '        	</tr> ';
			_html += '        </tbody> ';
			_html += '    </table> ';
			_html += '</div> ';

			/*analy_plan
		    1) 즉시실행 : I:00:00
		    2) 매주실행 : W:01:00 --> 일~~ 토(1,2,3,4,5,6,7)
		    3) 매월실행 : M:01:00  --> 매월 28일 실행
		    4) 분기실행 : Q:01:00  --> 매분기(3,6,9,12) 28일 실행
		    5) 매년실행 : Y:01:01  --> 매년 1월 3일 실행*/

			$("#parentBody").append(_html);

			$("#analyOptionWrap").dialog({
				title: "최종 설정",
				modal: true,
				resizable: false,
				width: 500,
				height: 240,
				position: {
					my: "center center",
					at: "center center",
					of: $("#map")
				},
				open: function(){

				},
				close: function(){
					$("#analyOptionWrap").dialog("destroy");
					$("#analyOptionWrap").remove();
				}
			}).parent().draggable({
				containment: "#map",
				scroll: false
			});

			$("#analyOptionWrap").find("#saveBtn").click(function(){
				var name = $("#analyOptionWrap").find("#analyNm").val();
				var plan = $("#analyOptionWrap").find("#analyPlan").val();

				if(_common.utils.isNullAndEmpty(name)){
					alert("분석 명칭을 입력해 주세요.");
					return false;
				}



				if(confirm("분석을 시작하시겠습니까?")){
					_common.callAjax("/bigData/startAnalys.json", { json : JSON.stringify(data), analyNm : name, analyPlan : plan }, function(json){
						if(json.result){
							$("#analyOptionWrap").dialog("close");
							createLoadingWrap();
						}
						if(json.analyze){
							if(json.analyze.mgrSeq){
								var hist = null;
								var interval = setInterval(function(){
									if(hist == null){
										_common.callAjax("/bigData/getAnalysHistList.json", { "mgrSeq" : json.analyze.mgrSeq }, function(_json){
											if(_json.hist.length > 0){
												hist = _json.hist[0];
												clearInterval(interval);
												interval = null;

												$(".ui-dialog-buttonset").find("button").click();

												if(hist.analyState == "99"){
													alert("분석을 실패하였습니다.");
												}else /*if(hist.analyState == "13")*/{
													$("#analyLoadingWrap").dialog("close");

													if(!GMXMAP){
														alert("분석이 완료되었습니다.");
													}else{
														var v = hist.mgrSeq;
														var fk = hist.analyMgrSeq;
														var tbl = hist.resultTblNm;

														$("#btn-anlys-view").click();
														_common.callAjax("/bigData/getAnalysisView.do", { "k" : v, "fk" : fk, "tbl" : tbl }, function(view) {
															$("#contentWrap").html(view);
														}, false);
													}
												}

											}
										}, false);
									}
								}, 1000);
							}
						}
					}, false);
				}
			});
		}

	});

})(GMXMAP, GMXLAYER);