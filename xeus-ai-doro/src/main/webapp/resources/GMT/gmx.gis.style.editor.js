/**
 * 스타일 설정 객체 입니다.
 *
 * jQuery (dialog)를 의존합니다.
 *
 * @auther 이주영
 */
"use strict";

(function(GMXMAP, GMXLAYER){

if(GMXMAP != null && GMXLAYER != null){
	if(GMXMAP instanceof ol.Map){

		var _EditLayerData = null;
		var _DefaultLayerData = null;

		/**
		 * 주제도 생성시 최대 갯수를 지정합니다.
		 */
		var _DistinctThemeMaxSize = 50;

		/**
		 * <pre>
		 * 스타일 편집을 종료합니다.
		 * </pre>
		 */
		var stopStyleEdit = function(){
			_EditLayerData = null;
			_DefaultLayerData = null;
		}

		/**
		 * <pre>
		 * 테마의 기본 템플릿 Item 입니다.
		 *
		 * <b style="color:red;">주의) DB Table Column 항목이 변경될 경우 같이 변경되어야 합니다.<b>
		 * </pre>
		 */
		var themeTemplate = {
			calcMethod: null,
			circleRadius: 5,
			fillColor: "rgba(255, 0, 0, 1)",
			lyrMgrSeq: null,
			strokeColor: "rgba(0, 0, 0, 1)",
			strokeWidth: "2",
			strokeLineDash: "1",
			textFillColor: "rgba(0, 0, 0, 1)",
			textFont: "15px sans-serif",
			textOffsetX: 0,
			textOffsetY: 0,
			textRotation: 0,
			textStrokeColor: "rgba(255, 255, 255, 1)",
			textStrokeWidth: "3",
			textText: null,
			textTextAlign: "center",
			textTextBaseline: "bottom",
			textMinResolution: "0",
			textMaxResolution: "Infinity",
			thmEndVal: null,
			thmFieldId: null,
			thmFieldNm: null,
			thmFieldTyp: null,
			thmStartVal: null
		}

		/**
		 * <pre>
		 * 주제 테마 Item 을 제작합니다.
		 * </pre>
		 *
		 * @param _EditLayerData - { Layer Data }
		 * @param _Param - { schema, table, col, calcMethod, calcStep }
		 */
		var createThemaOptions = function(_EditLayerData, _Param){
			var newThema = new Array();

			var colId = _Param["colId"];
			var colNm = _Param["colNm"];
			var calcStep = _Param["calcStep"];
			var calcMethod = _Param["calcMethod"];
			_common.callAjax("/GMT_column/getDistinctValue.json", _Param, function(json){
				if((json.result == null) || (json.result.length == 0) || (json.result.length > _DistinctThemeMaxSize)){
					var resultCount = (json.result == null) ? 0 : json.result.length;
					alert("해당 필드는 시스템 정책상 주제도 설정이 불가능합니다.\n\n주제 생성 정책 : 최대 20건 이하\n\n현재 검출 갯수 : " + resultCount + "건");
					return false;
				}

				var template = JSON.parse(JSON.stringify(themeTemplate));
				var spectrum = null;
				var colorList = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

				if(calcMethod === "distinct"){

					spectrum = chroma.scale(colorList).colors(json.result.length);

					for(var i=0; i<json.result.length; i++){
						var elem = JSON.parse(JSON.stringify(template));
						elem["calcMethod"] = calcMethod;
						elem["lyrMgrSeq"] = _EditLayerData.layer.mgrSeq;
						elem["strokeColor"] = chroma(spectrum[i]).css();
						elem["fillColor"] = chroma(spectrum[i]).alpha(0).css();
						elem["textText"] = colId;
						elem["thmFieldId"] = colId;
						elem["thmFieldNm"] = colNm;
						elem["thmFieldTyp"] = "S";
						elem["thmStartVal"] = json.result[i];
						elem["thmEndVal"] = json.result[i];

						newThema.push(elem);
					}
				}else if(calcMethod === "range"){

					if(_common.utils.isNullAndEmpty(json.result[0]) && !_common.utils.isNumber(Number(json.result[0]))){
						alert("선택하신 필드는 숫자로 범위 지정이 불가능 합니다.\n다른 필드를 선택해 주세요.\n\n검출된 이상 데이터 : " + json.result[0]);
						return false;
					}

					if(json.result.length < calcStep) calcStep = json.result.length;

					spectrum = chroma.scale(colorList).colors(calcStep);

					var min = Number(json.result[0]);
					var max = Number(json.result[json.result.length - 1]);
					var step = (max - min) / calcStep;
					var nowVal = min + step;
					for(var i=0; i<calcStep; i++){
						var elem = JSON.parse(JSON.stringify(template));
						elem["calcMethod"] = calcMethod;
						elem["lyrMgrSeq"] = _EditLayerData.layer.mgrSeq;
						elem["strokeColor"] = chroma(spectrum[i]).css();
						elem["fillColor"] = chroma(spectrum[i]).alpha(0).css();
						elem["textText"] = colId;
						elem["thmFieldId"] = colId;
						elem["thmFieldNm"] = colNm;
						elem["thmFieldTyp"] = "N";
						elem["thmStartVal"] = min;
						elem["thmEndVal"] = nowVal;

						newThema.push(elem);

						min = nowVal;
						nowVal = min + step;
					}

				}
			}, false);

			return newThema;
		}

		/**
		 * <pre>
		 * 주제 대상 필드의 타입을 체크하여 의존 엘리먼트의 상태를 변경합니다.
		 * 그리고 해당 타입의 계산 방식을 리턴합니다.
		 * </pre>
		 *
		 * @param - dataType - String
		 * @return calcMethod - String(Dictinct, range)
		 */
		var setSelectState = function(dataType){
			var $themaTab = $("#themaTab");

			if(_common.utils.isNullAndEmpty(dataType)){
				alert("선택하신 필드의 타입을 해석할 수 없습니다.");
				return;
			}else{
				dataType = dataType.toLowerCase();
			}

			var calcMethod = "distinct";

			if(dataType.contains("character") || dataType.contains("text")){
				$themaTab.find("#calcMethod").val(calcMethod).prop("disabled", true);
			}else if(dataType.contains("int") || dataType.contains("integer") || dataType.contains("numeric")){
				calcMethod = "range";
				$themaTab.find("#calcMethod").val(calcMethod).prop("disabled", false);
			}else if(dataType.contains("boolean")){
				$themaTab.find("#calcMethod").val(calcMethod).prop("disabled", true);
			}else{

			}

			return calcMethod;
		}

		/**
		 * <pre>
		 * 영문 데이터 타입으로 계산 방식 타입을 리턴합니다.
		 * </pre>
		 *
		 * @param - dataType - String
		 * @return calcMethod - String(Dictinct, range)
		 */
		var getDataTypeForCalcType = function(dataType){
			if(_common.utils.isNullAndEmpty(dataType)){
				return "해석불가";
			}else{
				dataType = dataType.toLowerCase();
			}

			if(dataType.contains("character") || dataType.contains("text")){
				return "distinct";
			}else if(dataType.contains("int") || dataType.contains("integer") || dataType.contains("numeric")){
				return "range";
			}else if(dataType.contains("boolean")){
				return "distinct";
			}else{
				return "";
			}
		}

		/**
		 * <pre>
		 * 영문 데이터 타입으로 한글 데이터 타입을 리턴합니다.
		 * </pre>
		 */
		var getDataTypeKorName = function(dataType){
			if(_common.utils.isNullAndEmpty(dataType)){
				return "해석불가";
			}else{
				dataType = dataType.toLowerCase();
			}

			if(dataType.contains("character") || dataType.contains("text")){
				return "한글";
			}else if(dataType.contains("int") || dataType.contains("integer") || dataType.contains("numeric")){
				return "숫자";
			}else if(dataType.contains("boolean")){
				return "참/거짓";
			}else{
				return "";
			}
		}

		/**
		 * <pre>
		 * 사용자에게 prompt 창을 이용하여 계산 단계 값을 입력받습니다.
		 * </pre>
		 */
		var getPromptCalcStepValue = function(){
			var calcStep = prompt("주제 표현 단계 값을 숫자(1~10)로 입력해 주세요.\n\n참고) 미입력 또는 잘못된 값을 입력할 경우 기본 3 단계로 채택됩니다.\n* 단계는 데이터의 값에 따라 자동 변경될 수 있습니다.", 3);
			if(_common.utils.isNullAndEmpty(calcStep)) calcStep = 3;
			if(Number(calcStep) < 1 || Number(calcStep) > 10) calcStep = 3;

			return calcStep;
		}

		/**
		 * <pre>
		 * 모든 스타일 설정 값을 전역 객체에 바인딩 합니다.
		 * </pre>
		 *
		 * @return _EditLayerData - Object(레이어에 관한 스타일 설정값)
		 */
		var serializeStyleData = function(){
			$("#styleTabs").find(".layerParam, .styleParam").each(function(){
				var elemClass = $(this).attr("class");
				var paramType = elemClass.replace("Param", "");
				var paramKey = $(this).attr("id");

				_EditLayerData[paramType][paramKey] = $(this).val();

				if($(this).is(":input[type=checkbox]")){
					if($(this).is(":checked")) {
						_EditLayerData[paramType][paramKey] = true;
					} else {
						_EditLayerData[paramType][paramKey] = false;
					}
				}

				if($(this).is(":input[type=color]")){
					var hex = $(this).val();
					var alpha = $("." + elemClass + "#" + paramKey + "Alpha").val();

					if($("." + elemClass + "#" + paramKey + "Alpha").length == 0){
						_EditLayerData[paramType][paramKey] = chroma(hex).css();
					}else{
						_EditLayerData[paramType][paramKey] = "rgba(" + chroma(hex).alpha(alpha).rgba().toString() + ")";
					}
				}
			});

			GMXLAYER.setThemaDataBind();

			var result = {};
			for(var mainKey in _EditLayerData){
				if(mainKey === "theme"){
					for(var i=0; i<_EditLayerData[mainKey].length; i++){
						for(var key in _EditLayerData[mainKey][i]){
							result[mainKey + "[" + i + "]." + key] = _EditLayerData[mainKey][i][key];
						}
					}
				}else{
					for(var key in _EditLayerData[mainKey]){
						result[mainKey + "." + key] = _EditLayerData[mainKey][key];
					}
				}
			}

			return result;
		}

		/**
		 * <pre>
		 * 스타일 설정 jQuery Dialog 객체를 설정합니다.
		 * </pre>
		 *
		 * @param _Data - Object
		 */
		GMXLAYER.createStyleDialog = function(_Data){
			_EditLayerData = JSON.parse(JSON.stringify(_Data));
			_DefaultLayerData = JSON.parse(JSON.stringify(_Data));

			$("#styleWrap").dialog({
				minWidth: "750",
//				maxHeight: "700",
				height: "auto",
				position: {
					my: "center",
					at: "center",
					of: $("#map")
				},
				modal: true,
				open: function(){
					$(this).dialog("option", "maxHeight", $("#map").height() - 50);
				},
				close: function(){
					stopStyleEdit();
				},
				resizable: false
			}).dialog("open");

			$("#styleTabs").tabs();

			this.setColumnSelect(_EditLayerData)
				.setPointIconElement(_EditLayerData)
				.setLabelTab(_EditLayerData)
				.setThemaTab(_EditLayerData.theme)
				.setElemntValue(_EditLayerData)
				.setThemaColorValue(_EditLayerData.theme)
				.bindEvents();
		}

		/**
		 * <pre>
		 * 아이콘 선택을 위한 엘리먼트를 생성합니다.
		 * </pre>
		 */
		GMXLAYER.setPointIconElement = function(_EditLayerData){
			var $selector = $("#defaultTab").find("div#base64TextSelect");
			$selector.html("");

			var $realSelect = $("#defaultTab").find("input#iconMgrSeq");
			$realSelect.val(-1);

			if(_EditLayerData.layer.lyrTyp === "P"){
				var settingKey = _EditLayerData.style.iconMgrSeq;

				_common.callAjax("/GMT_layer/icon/getList.json", {}, function(iconData){
					var list = iconData.result;
					if(list.length > 0){
						for(var i=0; i<list.length; i++){

							var $btn = $("<button>").attr("k", list[i].mgrSeq).click(function(){

								$realSelect.val(-1);

								var selectedKey = $selector.find("button.selected").attr("k");

								$selector.find("button").removeClass("selected").css({ "background" : "none", "border-radius" : "none" });

								if(selectedKey != $(this).attr("k")){
									$(this).addClass("selected").css({ "background" : "#007fff", "border-radius" : "5px" });
									$realSelect.val($(this).attr("k"));
								}

							}).css({ "background" : "none", "border-radius" : "none" });

							var $img = $("<img>").attr("src", list[i].imgBase64).css({
								"width" : "30px",
								"height" : "30px",
								"padding" : "5px 0px",
								"vertical-align" : "middle"
							});

							if(settingKey === list[i].mgrSeq){
								$btn.addClass("selected").css({ "background" : "#007fff", "border-radius" : "5px" });
								$realSelect.val(settingKey);
							}

							$btn.append($img);
							$selector.append($btn);
						}
					}else{
						$selector.html("<p class='helpText'>업로드 된 아이콘이 없습니다.</p>");
					}
				}, false);
			}

			return this;
		}

		/**
		 * <pre>
		 * 스타일 설정 내부의 모든 엘리먼트에 값을 설정합니다.
		 *
		 * 주의) 엘리먼트 생성 등의 설정이 모두 끝난 이후에 호출해야 합니다.
		 * </pre>
		 *
		 * @param _EditLayerData - Object
		 */
		GMXLAYER.setElemntValue = function(_EditLayerData){
			var $styleTabs = $("#styleTabs");

			for(var key in _EditLayerData.style){
				if($styleTabs.find("#" + key).length == 1){
					var val = _EditLayerData.style[key];

					var alpha = 0;
					if(key.toLowerCase().contains("color")){
						alpha = chroma(val).alpha();
						val = chroma(chroma(val).rgb()).hex();

						$styleTabs.find("#" + key + "Alpha").val(alpha);
					}

					$styleTabs.find("#" + key).val(val);
				}
			}

			$styleTabs.find("#layerNm").val(_EditLayerData.layer.lyrNm);
			$styleTabs.find("#useYn").prop("checked", _EditLayerData.layer.useYn);
			//$styleTabs.find("#visibleYn").prop("checked", _EditLayerData.layer.visibleYn);
			$styleTabs.find("#visibleYn").prop("checked", _EditLayerData.layer.visibleYnInDatabase);
			$styleTabs.find("#heatYn").prop("checked", _EditLayerData.layer.heatYn);

			$("#minResolution > option[value='"+_EditLayerData.layer.minResolution+"']").attr("selected",true);
			$("#maxResolution > option[value='"+_EditLayerData.layer.maxResolution+"']").attr("selected",true);

			$styleTabs.find("#nowZoom").val($("#minResolution > option[value='"+GMXMAP.getView().getResolution()+"']").text());
//			$styleTabs.find("#nowZoom").val(GMXMAP.getView().getZoom());
			$styleTabs.find("#nowResolution").val(GMXMAP.getView().getResolution());

			$styleTabs.find("#thmUseYn").prop("checked", _EditLayerData.layer.thmUseYn);
			if(_EditLayerData.layer.thmUseYn && _EditLayerData.theme.length > 0){
				$styleTabs.find("#thmFieldId").val(_EditLayerData.theme[0].thmFieldId);
				$styleTabs.find("#calcMethod").val(_EditLayerData.theme[0].calcMethod);

				$styleTabs.find("#thmFieldId").prop("disabled", false);
				$styleTabs.find("#calcMethod").prop("disabled", false);
				$styleTabs.find("#calcStep").prop("disabled", false);
			}else{
				$styleTabs.find("#thmFieldId").val("").prop("disabled", true);
				$styleTabs.find("#calcMethod").prop("disabled", true);
				$styleTabs.find("#calcStep").prop("disabled", true);
			}

			if(_EditLayerData.layer.lyrTyp === "P"){
				$styleTabs.find("#defaultTab").find("#circleRadius").parent().parent().show();
				$styleTabs.find("#defaultTab").find("#circleRadius").prop("disabled", false);
				$styleTabs.find("#themaTab").find("#circleRadius").each(function(){
					$(this).prop("disabled", false);
				});
				$styleTabs.find("#defaultTab").find("#base64TextSelect").parent().parent().show();
				$styleTabs.find("#defaultTab").find("#heatYn").parent().parent().show();
			}else{
				$styleTabs.find("#defaultTab").find("#circleRadius").parent().parent().hide();
				$styleTabs.find("#defaultTab").find("#circleRadius").prop("disabled", true);
				$styleTabs.find("#themaTab").find("#circleRadius").each(function(){
					$(this).prop("disabled", true);
				});
				$styleTabs.find("#defaultTab").find("#base64TextSelect").parent().parent().hide();
				$styleTabs.find("#defaultTab").find("#heatYn").parent().parent().hide();
			}

			return this;
		}

		/**
		 * <pre>
		 * 라벨 탭의 엘리먼트를 설정합니다.
		 * </pre>
		 *
		 * @param data - Object
		 */
		GMXLAYER.setLabelTab = function(_EditLayerData){

			return this;
		}

		/**
		 * <pre>
		 * 컬럼을 선택하는 엘리먼트를 설정합니다.
		 * </pre>
		 *
		 * @param data - Object
		 */
		GMXLAYER.setColumnSelect = function(_EditLayerData){
			var $labelTab = $("#labelTab");
			$labelTab.find("#textText").html("");
			$labelTab.find("#textText").append("<option value=''>- 미사용 -</option>");

			var $themaTab = $("#themaTab");
			$themaTab.find("#thmFieldId").html("");
			$themaTab.find("#thmFieldId").append("<option value='' type='text' disabled>- 미사용 -</option>");

			var columnInfo = GMXMAP.getColumnInfo(_EditLayerData.layer.schemNm, _EditLayerData.layer.tblId);
			for(var i=0; i<columnInfo.length; i++){
				var colId = columnInfo[i].colId;
				var colNm = columnInfo[i].colNm;
				var dataType = columnInfo[i].dataType;
				var isPkey = columnInfo[i].pkey;

				if(colId.contains("geometry")) continue;
				if(isPkey) continue;

				if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;

				/*$labelTab.find("#textText").append("<option value='" + colId + "' type='" + dataType + "'>" + colNm + "(" + getDataTypeKorName(dataType) + ")</option>");
				$themaTab.find("#thmFieldId").append("<option value='" + colId + "' type='" + dataType + "'>" + colNm + "(" + getDataTypeKorName(dataType) + ")</option>");*/
				$labelTab.find("#textText").append("<option value='" + colId + "' type='" + dataType + "'>" + colNm + "</option>");
				$themaTab.find("#thmFieldId").append("<option value='" + colId + "' type='" + dataType + "'>" + colNm + "</option>");
				$themaTab.find("#thmFieldId, #calcMethod, #calcStep").data(_EditLayerData);

			}

			return this;
		}

		/**
		 * <pre>
		 * 주제 탭의 엘리먼트를 설정합니다.
		 * </pre>
		 *
		 * @param _Thema - Object
		 */
		GMXLAYER.setThemaTab = function(_Thema){
			var $defaultTab = $("#defaultTab");
			var $themaCalcListWrap = $("#themaTab").find("#themaCalcListWrap");
			var $tbl = $themaCalcListWrap.find("tbody").html("");
			for(var i=0; i<_Thema.length; i++){
				var calcMethod = _Thema[i].calcMethod;
				var thmStartVal = _Thema[i].thmStartVal;
				var thmEndVal = _Thema[i].thmEndVal;

				var $tr = $("<tr>");
				var $tempTd = $("<td>");
				var $tempInput = $("<input>");

				var $strokeColor = $tempInput.clone().attr({ "id" : "strokeColor", "type" : "color" }).addClass("themeParam");
				var $strokeLineDash = $defaultTab.find("#strokeLineDash").clone().removeClass("styleParam").addClass("themeParam");
				var $strokeWidth = $defaultTab.find("#strokeWidth").clone().removeClass("styleParam").addClass("themeParam");
				var $fillColor = $tempInput.clone().attr({ "id" : "fillColor", "type" : "color" }).addClass("themeParam");
				var $fillColorAlpha = $defaultTab.find("#fillColorAlpha").clone().removeClass("styleParam").addClass("themeParam");
				var $circleRadius = $defaultTab.find("#circleRadius").clone().removeClass("styleParam").addClass("themeParam");
				var $base64TextSelect = $defaultTab.find("#base64TextSelect").clone();
				var $iconMgrSeq = $defaultTab.find("#iconMgrSeq").clone().removeClass("styleParam").addClass("themeParam");
				var $span = $("<span>").text(thmStartVal);
				if(calcMethod === "range") $span.text(thmStartVal + " ~ " + thmEndVal);

				$tr.append($tempTd.clone().append($strokeColor));
				$tr.append($tempTd.clone().append($strokeLineDash));
				$tr.append($tempTd.clone().append($strokeWidth));
				$tr.append($tempTd.clone().append($fillColor));
				$tr.append($tempTd.clone().append($fillColorAlpha));
				$tr.append($tempTd.clone().append($circleRadius));
				$tr.append($tempTd.clone().append($base64TextSelect).append($iconMgrSeq));
				$tr.append($tempTd.clone().append($span));

				$base64TextSelect.find("button").click(function(){
					var $realSelect = $(this).parent().parent().find("#iconMgrSeq");
					$realSelect.val(-1);

					var selectedKey = $(this).parent().parent().find("button.selected").attr("k");

					$(this).parent().parent().find("button").removeClass("selected").css({ "background" : "none", "border-radius" : "none" });

					if(selectedKey != $(this).attr("k")){
						$(this).addClass("selected").css({ "background" : "#007fff", "border-radius" : "5px" });
						$realSelect.val($(this).attr("k"));
					}
				}).css({ "background" : "none", "border-radius" : "none" });

				$tbl.append($tr);
			}

			return this;
		}

		/**
		 * <pre>
		 * 주제도 설정탭 내부의 color picker 값을 설정합니다.
		 * </pre>
		 */
		GMXLAYER.setThemaColorValue = function(_Thema){
			if(_Thema.length == 0) return this;

			var $themaTab = $("#themaTab");
			var $themaCalcListWrap = $("#themaTab").find("#themaCalcListWrap");

			if(_Thema[0].calcMethod === "distinct"){
				$themaTab.find("#calcStep").prop("disabled", true);
				$themaTab.find("#calcStep").val("auto");
			}else{
				$themaTab.find("#calcStep").prop("disabled", false);
				$themaTab.find("#calcStep").val(_Thema.length);
			}

			for(var i=0; i<_Thema.length; i++){
				for(var key in _Thema[i]){
					if($themaCalcListWrap.find("#" + key).length > 0){
						var val = _Thema[i][key];

						var alpha = 0;
						if(key.toLowerCase().contains("color")){
							alpha = chroma(val).alpha();
							val = chroma(chroma(val).rgb()).hex();

							$themaCalcListWrap.find("#" + key + "Alpha").eq(i).val(alpha);
						}

						$themaCalcListWrap.find("#" + key).eq(i).val(val);
					}
				}
			}

			return this;
		}

		/**
		 * <pre>
		 * 주제도 설정 값을 전역변수(_EditLayerData) 에 적용합니다.
		 * </pre>
		 */
		GMXLAYER.setThemaDataBind = function(_Thema){
			if(_Thema != null){

				for(var i=0; i<_Thema.length; i++){
					for(var key in _Thema[i]){
						if(key === "textText" || key === "thmFieldId"){
							_Thema[i][key] = $("#thmFieldId").val();
							_Thema[i]["thmFieldNm"] = $("#thmFieldId").find("option:selected").text().replace("(숫자)", "").replace("(문자)", "");;
						}
					}
				}

				_EditLayerData.theme = _Thema;

			}else{

				var $themaTab = $("#themaTab");
				var $themaCalcListWrap = $("#themaTab").find("#themaCalcListWrap");

				$themaCalcListWrap.find("table").find("tbody").find("tr").each(function(i, o){
					$(this).find(".themeParam").each(function(){
						var elemClass = $(this).attr("class");
						var paramType = elemClass.replace("Param", "");
						var paramKey = $(this).attr("id");

						_EditLayerData[paramType][i][paramKey] = $(this).val();

						if($(this).is(":input[type=color]")){
							var hex = $(this).val();
							var alpha = $("." + elemClass + "#" + paramKey + "Alpha").eq(i).val();

							if($("." + elemClass + "#" + paramKey + "Alpha").length == 0){
								_EditLayerData[paramType][i][paramKey] = chroma(hex).css();
							}else{
								_EditLayerData[paramType][i][paramKey] = "rgba(" + chroma(hex).alpha(alpha).rgba().toString() + ")";
							}
						}
					});
				});
			}
		}

		/**
		 * <pre>
		 * 각종 엘리먼트의 이벤트를 바인딩 합니다.
		 * </pre>
		 */
		GMXLAYER.bindEvents = function(){
			var _this = this;
			var $themaTab = $("#themaTab");
			var $thmFieldId = $themaTab.find("#thmFieldId");

			/**
			 * 주제도 사용 여부 버튼 이벤트 입니다.
			 */
			$themaTab.find("#thmUseYn").change(function(){
				var isChecked = $(this).is(":checked");
				if(isChecked){
					$thmFieldId.val("").prop("disabled", false);
					$thmFieldId.find("option").eq(0).prop("disabled", true);
					$themaTab.find("#calcMethod").prop("disabled", false);
					$themaTab.find("#calcStep").prop("disabled", false);
					$themaTab.find("#themaCalcListWrap").show();
				}else{
					$thmFieldId.val("").prop("disabled", true);
					$thmFieldId.find("option").eq(0).prop("disabled", false);
					$themaTab.find("#calcMethod").prop("disabled", true);
					$themaTab.find("#calcStep").prop("disabled", true);

					$themaTab.find("#themaCalcListWrap").find("tbody").html("");
					$themaTab.find("#themaCalcListWrap").hide();
				}

				_EditLayerData.theme = new Array();
			});

			/**
			 * 주제 대상 필드 선택 이벤트 입니다.
			 */
			setSelectState($thmFieldId.find("option:selected").attr("type"));
			$thmFieldId.find("option[type=USER-DEFINED]").remove();
			$thmFieldId.off("change").change(function(){
				var colId = $(this).val();
				var colNm = $(this).text().replace("(숫자)", "").replace("(문자)", "");
				var dataType = $(this).find("option:selected").attr("type");
				var calcMethod = setSelectState(dataType);

				var param = {
					schema : _EditLayerData.layer.schemNm,
					table : _EditLayerData.layer.tblId,
					col : colId,
					calcMethod : calcMethod,
					calcStep : "auto"
				};

				var newThema = null;
				if(calcMethod === "range"){
					var calcStep = getPromptCalcStepValue();

					$themaTab.find("#calcStep").val(calcStep).prop("disabled", false);

					param["calcStep"] = calcStep;
				}

				newThema = createThemaOptions(_EditLayerData, param);

				_this.setThemaTab(newThema)
					 .setThemaColorValue(newThema)
					 .setThemaDataBind(newThema);
			});

			/**
			 * 데이터 타입이 숫자일때 주제 산정 조건 및 표현 단계를 변경 하는 이벤트입니다.
			 */
			$themaTab.find("#calcMethod, #calcStep").off("change").change(function(){
				var _Selector = $(this).attr("id");
				var _thisVal = $(this).val();

				var colId = $themaTab.find("#thmFieldId").val();
				var colNm = $themaTab.find("#thmFieldId").text().replace("(숫자)", "").replace("(문자)", "");
				var dataType = getDataTypeForCalcType($thmFieldId.find("option:selected").attr("type"));
				var calcMethod = $themaTab.find("#calcMethod").find("option:selected").val();

				if(dataType === "range"){

					var param = {
						schema : _EditLayerData.layer.schemNm,
						table : _EditLayerData.layer.tblId,
						col : colId,
						calcMethod : calcMethod,
						calcStep : "auto"
					};

					var newThema = null;
					if(calcMethod === "distinct"){
						$themaTab.find("#calcStep").val("auto").prop("disabled", true);

					}else if(calcMethod === "range"){
						var calcStep = $(this).val();
						if(_Selector === "#calcMethod") calcStep = getPromptCalcStepValue();
						$themaTab.find("#calcStep").val(calcStep).prop("disabled", false);

						param["calcStep"] = calcStep;
					}

					newThema = createThemaOptions(_EditLayerData, param);

					_this.setThemaTab(newThema)
						 .setThemaColorValue(newThema)
						 .setThemaDataBind(newThema);
				}
			});

			/**
			 * 설정된 스타일을 서버에 적용합니다.
			 */
			$("#saveStyleBtn").off("click").click(function(){
				var $thmTab = $("#themaTab");
				var isThmUseYn = $thmTab.find("#thmUseYn").is(":checked");
				var validThmFieldId = $thmTab.find("#thmFieldId").val();
				if(isThmUseYn && _common.utils.isNullAndEmpty(validThmFieldId)){
					alert("주제 대상 필드를 선택해 주세요.");
					return false;
				}

				_common.callAjax("/GMT_layer/setStyle.json", serializeStyleData(), function(json){
					if(json.result){
						GMXLAYER.styleSingleCachePool = {};
						GMXLAYER.loadData().loadLayer(GMXMAP);
						GMXLEGEND.createLegends();
					}else{

					}
				});
			});

			$("#defaultTab").find("#base64TextSelect").find("button.selected").focus();

			return this;
		}

	}
}

})(GMXMAP, GMXLAYER);