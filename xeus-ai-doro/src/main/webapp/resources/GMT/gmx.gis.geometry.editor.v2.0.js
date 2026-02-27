/**
 * 공간 편집 툴 입니다.
 *
 * 1. GMXMAP.addGeometryEditor 함수를 이용하여 공간편집을 활성화 합니다.
 * > 이때, 각종 편집과 관련된 Control, Intercation 객체들이 지도에 추가됩니다.
 *
 * 2. 편집을 종료하려면 GMXMAP.stopGeometryEdit 함수를 호출하여 종료할 수 있습니다.
 * > 종료시 지도에 추가된 Control, Interaction 객체가 모두 제거됩니다.
 *
 * 3. (중요) 각종 Control, Intercation 객체들은 ol.ext.js (v3.2.2) 를 의존합니다.
 * > 각종 기능들이 Custom 되었으므로 임의 버전 변경시, 편집툴이 정상동작하지 않을 수 있습니다.
 *
 * 4. (의존) turf.js (v1.2.0) 를 의존합니다.
 * > 모듈을 로드하지 않으면 툴을 이용할 수 없습니다.
 *
 * @auther 이주영
 */
/* jshint esversion: 6 */
"use strict";
(function(GMXMAP, GMXLAYER, turf) {

if (GMXMAP != null && GMXLAYER != null && turf != null) {
	if (GMXMAP instanceof ol.Map) {

		GMXMAP["GeometryEditorVersion"] = 2.0;

		GMXMAP["isEditing"] = false;
		GMXMAP["editLayerId"] = null;
		GMXMAP["editLayerNm"] = null;
		GMXMAP["originClusterSource"] = null;

		/**
		 * 각종 키보드 이벤트 바인딩을 위한 함수입니다.
		 * 편집 시작시 바인딩하고 종료할 경우 반드시 언바인딩 처리해야합니다.
		 *//* 일반 Text 편집 체크 */ var _isNotTextEdting = function(){ return ($(document).find("input:focus").length + $(document).find("textarea:focus").length == 0) ? true : false; }

		/* 1. 객체 제거 : Delete */ var _DeleteKeyEvent = function(e){ if((e.keyCode === 46) && (_isNotTextEdting)){ $(".featureDeleteBtn").click(); } }
		/* 2. Undo Redo : Ctrl + Z, Y */ var _UndoRedoKeyEvent = function(e){ if((e.which === 89 || e.which === 90) && (e.ctrlKey) && (_isNotTextEdting)){ if(e.which === 89) $(".redoBtn").click(); if(e.which === 90) $(".undoBtn").click(); } }
		/* 3. 전체 선택 : Alt + Shift + A */ var _SelectAllKeyEvent = function(e){ if((e.which === 65) && (e.altKey) && (e.shiftKey) && (_isNotTextEdting)){ $(".selectAllFeatureBtn").click(); } }
		/* 4. 객체 병합 : Ctrl + M */ var _MergeKeyEvent = function(e){ if((e.which === 77) && (e.ctrlKey)){ $(".mergeFeatureBtn").children().click(); } }
		/* 5. 객체 분할 : Ctrl + i */ var _SplitKeyEvent = function(e){ if((e.which === 73) && (e.ctrlKey)){ e.preventDefault(); $(".splitFeatureBtn").children().click(); } }
		/* 6. 편집 저장 : Ctrl + S */ var _SaveKeyEvent = function(e){ if((e.which === 83) && (e.ctrlKey)){ e.preventDefault(); $("#saveGeometryEdit").click(); } }
		/* 7. 스냅 토글 : Alt + S */ var _SnapToggleKeyEvent = function(e){ if((e.which === 83) && (e.altKey)){ e.preventDefault(); $(".snapToggleBtn").children().click(); } }

		/**
		 * 범례에서 레이어 On/Off 행동에 따라 Snap 대상을 추가하거나 제거합니다.
		 *
		 * 참고) 해당 기능은 범례를 의존합니다.
		 * 필요시 지도에 생성된 Vector 객체를 이용하여 해당 기능을 재 구현해야 합니다.
		 */
		var _SnapInteractions = {};
		$(".layer").find(".toggleLayer").change(function(){
			var isChecked = $(this).is(":checked");
			var _LayerId = $(this).attr("id");
			if(GMXMAP["isEditing"] && (_LayerId != GMXMAP["editLayerId"])){
				var _VectorLayer = GMXMAP.getLayer(_LayerId);
				if((_LayerId in GMXLAYER.LayerList) && (_VectorLayer instanceof ol.layer.Vector)){
					if(isChecked && !(_LayerId in _SnapInteractions)){
						_SnapInteractions[_LayerId] = new ol.interaction.Snap({ source : _VectorLayer.getSource() });

						GMXMAP.addInteraction(_SnapInteractions[_LayerId]);
						GMXMAP.addMapNotification("<" + _VectorLayer.get("name") + "> 레이어가 Snap 대상에 추가되었습니다.");
					}

					if(!isChecked && (_LayerId in _SnapInteractions)){
						GMXMAP.removeInteraction(_SnapInteractions[_LayerId]);
						_SnapInteractions[_LayerId] = null;
						delete _SnapInteractions[_LayerId];

						GMXMAP.addMapNotification("<" + _VectorLayer.get("name") + "> 레이어가 Snap 대상에서 제외되었습니다.");
					}
				}
			}
		});

		/**
		 * 편집 관련 엘리먼트의 prop을 설정합니다.
		 */
		var _SetDisableProp = function(){
			$(".ol-selection").addClass("bottom_btn").find("button").eq(0).attr("title", "객체 선택 및 버텍스 추가").prop("disabled", false).append('<i class="fas fa-check-square"></i>');
			$(".ol-delete").addClass("bottom_btn").find("button").eq(0).attr("title", "객체 삭제").prop("disabled", false).append('<i class="fas fa-trash-alt"></i>');
			$(".ol-drawpoint").addClass("bottom_btn").find("button").eq(0).attr("title", "점 그리기").prop("disabled", false).append('<i class="fas fa-ellipsis-h"></i>');
			$(".ol-drawline").addClass("bottom_btn").find("button").eq(0).attr("title", "선 그리기").prop("disabled", false).append('<i class="fas fa-grip-lines"></i>');
			$(".ol-drawpolygon").addClass("bottom_btn").find("button").eq(0).attr("title", "면 그리기").prop("disabled", false).append('<i class="fas fa-draw-polygon"></i>');
			$(".ol-drawhole").addClass("bottom_btn").find("button").eq(0).attr("title", "면 내부에 구멍 그리기").prop("disabled", false).append('<i class="fas fa-dot-circle"></i>');
			$(".ol-drawregular").addClass("bottom_btn").find("button").eq(0).attr("title", "다각형 그리기").prop("disabled", false).append('<i class="fas fa-square"></i>');
			$(".ol-transform").addClass("bottom_btn").find("button").eq(0).attr("title", "객체 자유 변형").prop("disabled", false).append('<i class="fas fa-expand-arrows-alt"></i>');
			$(".snapToggleBtn").find("button").eq(0).append('<i class="fas fa-magnet"></i>');

			$("#editLayerSelect").prop("disabled", true);
			$("#startGeometryEdit").prop("disabled", true);
			$("#stopGeometryEdit, #saveGeometryEdit").prop("disabled", false);

			if(GMXMAP.getLayer(GMXMAP["editLayerId"]).get("geomType") === "P"){
				$(".ol-drawline").find("button").eq(0).prop("disabled", true);
				$(".ol-drawpolygon").find("button").eq(0).prop("disabled", true);
				$(".ol-drawhole").find("button").eq(0).prop("disabled", true);
				$(".ol-drawregular").find("button").eq(0).prop("disabled", true);
				$(".mergeFeatureBtn").find("button").eq(0).prop("disabled", true);
				$(".splitFeatureBtn").find("button").eq(0).prop("disabled", true);
			}else if(GMXMAP.getLayer(GMXMAP["editLayerId"]).get("geomType") === "L"){
				$(".ol-drawpoint").find("button").eq(0).prop("disabled", true);
				$(".ol-drawpolygon").find("button").eq(0).prop("disabled", true);
				$(".ol-drawhole").find("button").eq(0).prop("disabled", true);
				$(".ol-drawregular").find("button").eq(0).prop("disabled", true);
				$(".mergeFeatureBtn").find("button").eq(0).prop("disabled", true);
				$(".splitFeatureBtn").find("button").eq(0).prop("disabled", true);
			}else if(GMXMAP.getLayer(GMXMAP["editLayerId"]).get("geomType") === "G"){
				$(".ol-drawpoint").find("button").eq(0).prop("disabled", true);
				$(".ol-drawline").find("button").eq(0).prop("disabled", true);
			}
		}

		/**
		 * Snap 대상으로 설정할 수 있는 레이어들의 최소 정보를 리턴합니다.
		 *
		 * 참고) Snap 대상은 Vector 만 가능합니다.
		 *
		 * @Deprecated 현재 사용되지 않습니다.
		 */
		var __GetSnapTargetVectors__ = function(){
			var _Vectors = new Array();

			for(var _LayerKey in GMXLAYER.LayerList){
				var _Layer = GMXMAP.getLayer(_LayerKey);
				if((_Layer != null) && (_Layer instanceof ol.layer.Vector)){
					_Vectors.push({ "id" : _Layer.get("id"), "name" : _Layer.get("name") });
				}
			}

			_Vectors.sort(function(a, b){ return ('' + a.name).localeCompare(b.name); });

			return _Vectors;
		}

		/**
		 * ol.Feature 객체를 turf.Feature 객체로 변환합니다.
		 *
		 * 참고) Point 타입은 지원하지 않습니다.
		 */
		var _ConvertTurfFeature = function(_OLFeature){
			var turfFeature = null;
			if(("turf" in window) && (_OLFeature instanceof ol.Feature)){
				var featureGeom = _OLFeature.getGeometry();
				var featureGeomType = featureGeom.getType();
				var featureGeomCoord = featureGeom.getCoordinates();

				try{
					if(featureGeomType.contains("Point")) console.error("Point 객체는 병합에 적합하지 않습니다.");
					if(featureGeomType.contains("Line")){
						if(featureGeomType.contains("Multi")){
							turfFeature = turf.multiLineString(featureGeomCoord);
						}else{
							turfFeature = turf.lineString(featureGeomCoord);
						}
					}
					if(featureGeomType.contains("Polygon")){
						if(featureGeomType.contains("Multi")){
							turfFeature = turf.multiPolygon(featureGeomCoord[0]);
						}else{
							turfFeature = turf.polygon(featureGeomCoord);
						}
					}
				}catch(e){
					GMXMAP.addMapNotification("객체 병합을 실패하였습니다.");
					console.error(e);
				}
			}else{
				console.error("turf.js 모듈이 로드되지 않았습니다.");
			}

			return turfFeature;
		}

		/**
		 * 객체를 병합하여 ol.Feature 객체로 반환합니다.
		 *
		 * 참고) Polygon 타입만 지원합니다.
		 */
		var _SetGeometryMerge = function(_OLFeatures){
			var mergeFeature = null;

			if((_OLFeatures != null) && (_OLFeatures instanceof Array)){
				var mergeGeometry = null;
				var featureLength = _OLFeatures.length;
				if(featureLength > 1){
					for(var i=1; i<featureLength; i++){
						if(i === 1){
							mergeGeometry = turf.union(_ConvertTurfFeature(_OLFeatures[i - 1]), _ConvertTurfFeature(_OLFeatures[i]));
						}else{
							mergeGeometry = turf.union(mergeGeometry, _ConvertTurfFeature(_OLFeatures[i]));
						}
					}

					if(mergeGeometry != null) mergeFeature = new ol.format.GeoJSON().readFeature(mergeGeometry);
				}else{
					GMXMAP.addMapNotification("병합 대상 객체는 최소 2개 이상 선택되어야 합니다.", 2000);
				}
			}else{
				console.error("병합 대상 객체 Array 가 올바르지 않습니다.");
			}

			return mergeFeature;
		}

		/**
		 * Merge 내용을 Custom Undo Redo Stack 에 추가합니다.
		 */
		var _PushCustomUndoRedoStack = function(_Action, _OLDFeature, _NEWFeature){
			if(GMXMAP["undoInteraction"] != null){
				GMXMAP["undoInteraction"].define(_Action, function(_Prop){
					_Prop._OLDFeature.setGeometry(_Prop._OLDFeatureGeometry);
				}, function(_Prop){
					_Prop._OLDFeature.setGeometry(_Prop._NEWFeature.getGeometry());
				});

				GMXMAP["undoInteraction"].push(_Action, {
					"_OLDFeature" : _OLDFeature,
					"_OLDFeatureGeometry" : _OLDFeature.getGeometry().clone(),
					"_NEWFeature" : _NEWFeature
				}, _Action);
			}
		}

		/**
		 * 객체를 분할하여 ol.Feature 객체로 반환합니다.
		 *
		 * 참고) Polygon 타입만 지원합니다.
		 */
		var _SetGeometrySplit = function(polygon, line, idPrefix){
			var THICK_LINE_UNITS = "kilometers";
			var THICK_LINE_WIDTH = 0.001;
			var i, j, id, intersectPoints, lineCoords, forCut, forSelect;
			var thickLineString, thickLinePolygon, clipped, polyg, intersect;
			var polyCoords = [];
			var cutPolyGeoms = [];
			var cutFeatures = [];
			var offsetLine = [];
			var result = null;

			if(((polygon.type != "Polygon") && (polygon.type != "MultiPolygon")) || (line.type != "LineString")) return result;
			if(_common.utils.isNullAndEmpty(idPrefix)) idPrefix = "";

			intersectPoints = turf.lineIntersect(polygon, line);
			if(intersectPoints.features.length == 0) return result;

			var lineCoords = turf.getCoords(line);
			if((turf.booleanWithin(turf.point(lineCoords[0]), polygon) || (turf.booleanWithin(turf.point(lineCoords[lineCoords.length - 1]), polygon)))) return result;

			offsetLine[0] = turf.lineOffset(line, THICK_LINE_WIDTH, {units: THICK_LINE_UNITS});
			offsetLine[1] = turf.lineOffset(line, -THICK_LINE_WIDTH, {units: THICK_LINE_UNITS});

			for (i = 0; i <= 1; i++){
				forCut = i;
				forSelect = (i + 1) % 2;
				polyCoords = [];
				for(j = 0; j < line.coordinates.length; j++){
					polyCoords.push(line.coordinates[j]);
				}
				for(j = (offsetLine[forCut].geometry.coordinates.length - 1); j >= 0; j--){
					polyCoords.push(offsetLine[forCut].geometry.coordinates[j]);
				}
				polyCoords.push(line.coordinates[0]);

				thickLineString = turf.lineString(polyCoords);
				thickLinePolygon = turf.lineToPolygon(thickLineString);
				clipped = turf.difference(polygon, thickLinePolygon);

				cutPolyGeoms = [];
				for(j = 0; j < clipped.geometry.coordinates.length; j++){
					polyg = turf.polygon(clipped.geometry.coordinates[j]);
					intersect = turf.lineIntersect(polyg, offsetLine[forSelect]);
					if(intersect.features.length > 0){
						cutPolyGeoms.push(polyg.geometry.coordinates);
					};
				};

				cutPolyGeoms.forEach(function(geometry, index){
					id = idPrefix + (i + 1) + '.' +  (index + 1);
					cutFeatures.push(turf.polygon(geometry, {id: id}));
				});
			}

			if(cutFeatures.length > 0) result = turf.featureCollection(cutFeatures);

			return result;
		}

		/**
		 * 객체 Split을 위해 Line Draw End 이벤트를 구성합니다.
		 */
		var _SelectedSplitTargetFeature = null;
		var _SplitLineVector = null;
		var _SplitLineVectorSource = null;
		var _SplitLineDrawInteraction = null;
		var _DestroySplitTool = function(){
			if(_SplitLineDrawInteraction != null) GMXMAP.removeInteraction(_SplitLineDrawInteraction);
			_SelectedSplitTargetFeature = null;
			_SplitLineVectorSource = null;
			_SplitLineVector = null;
			_SplitLineDrawInteraction = null;
		}
		var _SplitLineStringDrawEnd = function(e){
			var _Polygons = new Array();

			var projectionInfo = { dataProjection: "EPSG:5186", featureProjection: "EPSG:5186" };
			var drawnGeoJSON = new ol.format.GeoJSON().writeFeatureObject(e.feature, projectionInfo);
			var drawnGeometry = turf.getGeom(drawnGeoJSON);

			var unkinked = turf.unkinkPolygon(turf.getGeom(new ol.format.GeoJSON().writeFeatureObject(_SelectedSplitTargetFeature, projectionInfo)));
			turf.geomEach(unkinked, function (geometry){ _Polygons.push(geometry); });

			if (drawnGeometry.type == "LineString") {
				_Polygons.forEach(function (polygon, index) {
					var cutPolygon = _SetGeometrySplit(polygon, drawnGeometry, "SPLIT");
					if (cutPolygon != null) {
						var features = new ol.format.GeoJSON().readFeatures(cutPolygon, projectionInfo);
						if(features.length > 0){
							var isCopyProperties = confirm("원본 객체의 속성 정보를 분할된 객체들에게 동일 적용하시겠습니까?");
							var copyProperties = (isCopyProperties) ? JSON.parse(JSON.stringify(_SelectedSplitTargetFeature.getProperties())) : null;
							if(isCopyProperties) delete copyProperties["geometry"];

							GMXMAP.getLayer(GMXMAP.editLayerId).getSource().removeFeature(_SelectedSplitTargetFeature);

							for(var i=0; i<features.length; i++){
								if(features[i].getGeometry().getType() !== "LineString"){
									if(isCopyProperties) features[i].setProperties(copyProperties);

									GMXMAP.getLayer(GMXMAP.editLayerId).getSource().addFeature(features[i]);
									GMXMAP.addHighLight(features[i]);
								}
							}
						}
					}
				});
			}

			GMXMAP.removeInteraction(_SplitLineDrawInteraction);
			GMXMAP.addMapNotification("객체 분할이 완료되었습니다.");

			_DestroySplitTool();
		}

		/**
		 * Split 을 위한 LineString Draw Interaction 객체를 추가합니다.
		 */
		var _PushDrawSplitLineStringInteraction = function(_SelectedFeature){
			if((_SelectedFeature != null) && (_SelectedFeature instanceof ol.Feature)){
				_SelectedSplitTargetFeature = _SelectedFeature;

				_SplitLineVectorSource = new ol.source.Vector();
				_SplitLineVector = new ol.layer.Vector({ source : _SplitLineVectorSource });

				_SplitLineDrawInteraction = new ol.interaction.Draw({ source : _SplitLineVectorSource, type : "LineString" });
				_SplitLineDrawInteraction.on("drawend", _SplitLineStringDrawEnd);

				GMXMAP.addInteraction(_SplitLineDrawInteraction);
			}else{
				console.error("선택된 객체가 없습니다.");
			}
		}

		/**
		 * 객체 병합시 기존 객체에 적용 할 경우 지도에서 객체를 선택하는 이벤트 입니다.
		 */
		var _SelectedMergeTargetFeatures = null;
		var _MergeTempFeature = null;
		var mergeTargetSelectFeatureEvent = function(e){
			var timeout = setTimeout(function(){
				var selectLength = e.features.getArray().length;
				if(selectLength === 1){
					if(_SelectedMergeTargetFeatures.toString().contains(e.features.getArray()[0].ol_uid)){

						_PushCustomUndoRedoStack("merge", e.features.getArray()[0], _MergeTempFeature.clone());

						e.features.getArray()[0].setGeometry(_MergeTempFeature.getGeometry());

						var _SelectedMergeTargetFeaturesLength = _SelectedMergeTargetFeatures.length;
						for(var i=0; i<_SelectedMergeTargetFeaturesLength; i++){
							if(_SelectedMergeTargetFeatures[i] !== e.features.getArray()[0].ol_uid){
								var findFeature = GMXMAP.getLayer(GMXMAP.editLayerId).getSource().getFeatureByUid(_SelectedMergeTargetFeatures[i]);
								if((findFeature != null) && (findFeature instanceof ol.Feature)){
									GMXMAP.getLayer(GMXMAP.editLayerId).getSource().removeFeature(findFeature);
								}
							}
						}

						GMXMAP["editInteractionBar"].getInteraction("Transform").un("select", mergeTargetSelectFeatureEvent);

						GMXMAP.addHighLight(_MergeTempFeature);
						GMXMAP.addMapNotification("선택된 객체로 병합이 적용되었습니다.");

						_SelectedMergeTargetFeatures, _MergeTempFeature = null;
					}else{
						var _SelectedMergeTargetFeaturesLength = _SelectedMergeTargetFeatures.length;
						for(var i=0; i<_SelectedMergeTargetFeaturesLength; i++){
							var findFeature = GMXMAP.getLayer(GMXMAP.editLayerId).getSource().getFeatureByUid(_SelectedMergeTargetFeatures[i]);
							if((findFeature != null) && (findFeature instanceof ol.Feature)){
								GMXMAP.addHighLight(findFeature, false, 2);
							}
						}

						GMXMAP.addMapNotification("병합 대상이 아닌 객체에 적용할 수 없습니다.<br><br>병합 대상 객체를 다시 선택해주세요.", 2000);
					}

				}else if(selectLength > 1){
					GMXMAP.addMapNotification("병합을 적용할 객체는 단건만 선택해야 적용됩니다.");
				}

				clearTimeout(timeout);
				timeout = null;
			}, 100);
		}


		/**
		 * 공간정보 편집툴을 생성합니다.
		 *
		 * 생성시 편집 대상 ol.layer.Vector 객체를 필요로 합니다.
		 *
		 * 1. 편집툴 생성 전, 서버에 동기식으로 전체 Features 호출하여 리로드합니다.
		 * 2. 이후 대상 레이어는 지도의 움직임에도 Feature 를 리로드하지 않습니다.
		 * 3. 위의 과정에서 편집 대상 객체가 Point 타입일 경우 Cluster Source 를 일반 Source 로 임시 변경합니다. (겹침 처리 취소)
		 * 4. 각종 Control 에 상응하는 Interaction 객체가 생성되어 지도에 추가됩니다.
		 * 5. 필요시 개발자가 직접 Interaction 객체를 추가해야 합니다.
		 */
		GMXMAP.addGeometryEditor = function(_Vector){
			if(_common.utils.isNullAndEmpty(_Vector)){
				alert("편집 대상 레이어를 선택해 주세요.");
				$("#editLayerSelect").focus();
				return;
			}

			if(!(_Vector instanceof ol.layer.Vector)){
				alert("올바른 Vector 객체가 아니므로 편집을 시작할 수 없습니다.");
				$("#editLayerSelect").focus();
				return;
			}

			if(_Vector instanceof ol.layer.Vector){
				GMXMAP.setAllLayerUnVisible();
				if(!_Vector.getVisible()) _Vector.setVisible(true);
			}

			$("#startGeometryEdit").hide();
			$("#stopGeometryEdit, #saveGeometryEdit").show();

			$("#legendWrap").find("button.edit").hide();
			if((_Vector.get("id") !== "user_sketch_geom") && $("#legendWrap").find("#" + _Vector.get("id")).length > 0){
				$("#legendWrap").find("#" + _Vector.get("id")).siblings("label.checkboxC").hide();
			}

			GMXMAP.createRedoUndoStackDialog();

			/**
			 * 편집 대상 Vector 의 모든 공간정보를 로드합니다.
			 *
			 * 참고) 동기화 옵션은 필수입니다.
			 * 동기화 하지 않을 경우 Feature 로드 과정에서 UndoRedo Interaction 에 레코딩 됩니다.
			 *
			 * 또한 편집 대상 레이어가 Point 객체일 경우 겸침 처리 제거를 위해 Source 객체를 임시 Source 로 변경합니다.
			 */
			GMXMAP.addMapNotification("공간 편집을 위하여 전체 공간정보를 로드합니다.");

			var timeout = setTimeout(function(){

				var source = GMXMAP.getLayer(_Vector.get("id")).getSource();
				var wfsParam = null;
				if(_Vector.get("id") === "user_sketch_geom"){
					wfsParam = GMXMAP.getSketchLayerWFSParam();
				}else{
					wfsParam = JSON.parse(JSON.stringify(GMXLAYER.LayerList[_Vector.get("id")].layer._wfsParam));
				}
				delete wfsParam["bbox"];

				if((_Vector.getSource() instanceof ol.source.Cluster)){
					GMXMAP["originClusterSource"] = _Vector.getSource();
					source = new ol.source.Vector();
					_Vector.setSource(source);
				}

				GMXLAYER.loadFeatures(source, wfsParam, true);

				/**
				 * 하단의 생성될 공간정보 편집 바를 생성합니다.
				 */
				GMXMAP["editBar"] = new ol.control.Bar({ className : "editBar" });
				GMXMAP["editBar"].setPosition("bottom");
				GMXMAP.addControl(GMXMAP["editBar"]);

				/**
				 * 편집 바 내부에 각종 Interaction 을 생성합니다.
				 *
				 * ol.interaction.Delete 객체는 하단에서 별도로 생성하여 관리됩니다.
				 */
				GMXMAP["editInteractionBar"] = new ol.control.EditBar({
					source: _Vector.getSource(),
					interactions: {
						Select: new ol.interaction.Select({
							layers: function(layer) {
								return layer.get("id") === _Vector.get("id");
							}
						}),
						Delete: false, Info: false, Split: false, Offset: false
					}
				});
				GMXMAP["editBar"].addControl(GMXMAP["editInteractionBar"]);
				GMXMAP["editInteractionBar"].getInteraction("Select").setActive(false);
				GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
				GMXMAP["editInteractionBar"].getInteraction("Transform").layers_ = [_Vector];

				/**
				 * 자유 그리기 모드를 안내합니다.
				 */
				GMXMAP["editInteractionBar"].getInteraction("DrawLine").on("change:active", function(){
					if(GMXMAP["editInteractionBar"].getInteraction("DrawLine").getActive()) GMXMAP.addMapNotification("Shift 키를 누른 상태에서 Drag 하시면 자유 그리기 모드가 적용됩니다.", 2000);
				});
				GMXMAP["editInteractionBar"].getInteraction("DrawPolygon").on("change:active", function(){
					if(GMXMAP["editInteractionBar"].getInteraction("DrawPolygon").getActive()) GMXMAP.addMapNotification("Shift 키를 누른 상태에서 Drag 하시면 자유 그리기 모드가 적용됩니다.", 2000);
				});

				/**
				 * 편집 바 내부에 Snap Toggle 버튼을 생성합니다.
				 */
				GMXMAP["snapToggleBar"] = new ol.control.Bar({
					group : false,
					controls : [
			            new ol.control.Button({
			            	className : "snapToggleBtn bottom_btn",
			            	title : "스냅 토글",
			            	handleClick : function() {
			            		if(("snapInteraction" in GMXMAP) && (GMXMAP["snapInteraction"] != null) && (GMXMAP["snapInteraction"] instanceof ol.interaction.Snap)){
			            			if(GMXMAP["snapInteraction"].getActive()){
			            				for(var _LayerId in _SnapInteractions) _SnapInteractions[_LayerId].setActive(false);

			            				GMXMAP["snapInteraction"].setActive(false);
			            				GMXMAP.addMapNotification("스냅 기능이 비활성화 되었습니다.");
			            			}else{
			            				for(var _LayerId in _SnapInteractions) _SnapInteractions[_LayerId].setActive(true);

			            				GMXMAP["snapInteraction"].setActive(true);
			            				GMXMAP.addMapNotification("스냅 기능이 활성화 되었습니다.");
			            			}
			            		}
			            	}
			            })
		            ]
				})
				GMXMAP["editBar"].addControl(GMXMAP["snapToggleBar"]);

				/**
				 * 편집 바 내부에 병합(Merge) 버튼을 생성합니다.
				 */
				GMXMAP["mergeFeatureBar"] = new ol.control.Bar({
					group : false,
					controls : [
			            new ol.control.Button({
			            	className : "mergeFeatureBtn bottom_btn",
			            	title : "객체 병합",
			            	handleClick : function() {
			            		var features = GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures().getArray();
			            		if(features == null || features.length == 0){
			            			GMXMAP.addMapNotification("병합 대상 객체는 최소 2개 이상 선택되어야 합니다.");
			            		}else{
			            			_SelectedMergeTargetFeatures = new Array();
			            			var mergeFeature = _SetGeometryMerge(features);

			            			if((mergeFeature != null) && (mergeFeature instanceof ol.Feature)){
			            				if(confirm("병합된 객체를 신규로 추가하시려면 <확인> 버튼을 누르시고\n\n기존 객체를 병합객체로 변경하시려면 <취소>를 눌러주세요.")){
			            					_Vector.getSource().addFeature(mergeFeature);

			            					GMXMAP["editInteractionBar"].getInteraction("Transform").setSelection([]);
											GMXMAP["editInteractionBar"].getInteraction("Transform").select(mergeFeature, true);

				            				GMXMAP.addHighLight(mergeFeature, false, 1);
			            					GMXMAP.addMapNotification("병합된 객체가 신규 추가되었습니다.");
			            				}else{
			            					_MergeTempFeature = mergeFeature;

			            					for(var i=0, selectLength = features.length; i<selectLength; i++) _SelectedMergeTargetFeatures.push(features[i].ol_uid);

			            					GMXMAP.addMapNotification("병합객체로 적용할 대상을 지도에서 선택해주세요.", 5000);

			            					GMXMAP["editInteractionBar"].getInteraction("Transform").setSelection([]);
			            					GMXMAP["editInteractionBar"].getInteraction("Transform").on("select", mergeTargetSelectFeatureEvent);
			            				}

			            			}
			            		}
			            	}
			            })
		            ]
				})
				GMXMAP["editBar"].addControl(GMXMAP["mergeFeatureBar"]);

				/**
				 * 편집 바 내부에 분할(Split) 버튼을 생성합니다.
				 *
				 * 참고) Split 이벤트는 Undo Redo Stack 에 Custom 으로 등록해야 합니다.
				 */
				GMXMAP["splitFeatureBar"] = new ol.control.Bar({
					group : false,
					controls : [
			            new ol.control.Button({
			            	className : "splitFeatureBtn bottom_btn",
			            	title : "객체 분할",
			            	handleClick : function() {
			            		var features = GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures().getArray();
			            		if(features == null || features.length == 0){
			            			GMXMAP.addMapNotification("분할 대상 객체를 <자유 변형> 툴로 선택해주세요.", 2000);
			            		}else{
			            			if(features.length > 1){
			            				GMXMAP.addMapNotification("분할 대상 객체는 단건만 선택해야 합니다.", 2000);
			            			}else{
			            				if(_SplitLineDrawInteraction != null){
			            					_DestroySplitTool();
			            				}else{
			            					_PushDrawSplitLineStringInteraction(features[0]);

			            					GMXMAP.addHighLight(features[0], false, 3);
			            					GMXMAP.addMapNotification("지도에서 분할 대상 객체 위에 라인을 그리면 분할이 완료됩니다.", 3000);
			            				}
			            			}
			            		}
			            	}
			            })
		            ]
				})
				GMXMAP["editBar"].addControl(GMXMAP["splitFeatureBar"]);

				/**
				 * 편집 바 내부에 객체 전체 선택 버튼을 생성합니다.
				 */
				GMXMAP["selectAllFeatureBar"] = new ol.control.Bar({
					group : false,
					controls : [
			            new ol.control.Button({
			            	html : "<i class='fas fa-object-group selectAllFeatureBtn'></i>",
			            	className: "bottom_btn",
			            	title : "객체 전체 선택",
			            	handleClick : function() {
			            		GMXMAP.addMapNotification("전체 공간정보 스캔을 시작하였습니다.<br><br>객체수가 많을 경우 화면이 일시 정지될 수 있습니다.");

			            		var timeout = setTimeout(function(){
				            		if(_Vector.get("geomType") === "P"){
			            				if(!GMXMAP["editInteractionBar"].getInteraction("Transform").getActive()){
			            					GMXMAP["editInteractionBar"].getInteraction("Select").setActive(false);
			            					GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
			            				}

			            				_Vector.getSource().forEachFeatureIntersectingExtent(_Vector.getSource().getExtent(), function(feature) {
			            					GMXMAP["editInteractionBar"].getInteraction("Transform").select(feature, true);
			            				});
				            		}else{
				            			GMXMAP["editInteractionBar"].getInteraction("Transform").setSelection(_Vector.getSource().getFeatures());
				            		}

				            		GMXMAP.addMapNotification("객체가 모두 선택되었습니다.");

				            		clearTimeout(timeout);
				            		timeout = null;
			            		}, 500);
			            	}
			            })
		            ]
				})
				GMXMAP["editBar"].addControl(GMXMAP["selectAllFeatureBar"]);

				/**
				 * 편집 바 내부에 Delete Intercation 버튼을 생성합니다.
				 *
				 * 참고) Delete Interaction 객체가 활성화 상태일 경우 지도에서 Feature 선택시 즉시 제거됩니다.
				 */
				GMXMAP["deleteInteraction"] = new ol.interaction.Delete();
				GMXMAP["deleteInteraction"].setActive(false);
				GMXMAP.addInteraction(GMXMAP["deleteInteraction"]);
				GMXMAP["deleteBar"] = new ol.control.Bar({
					group : false,
					controls : [
			            new ol.control.Button({
							html : "<i class='fas fa-trash-alt featureDeleteBtn'></i>",
							title : "객체 삭제",
							className: "bottom_btn",
							handleClick : function() {
								var deleteFeatures = 0;
								deleteFeatures = GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures().getArray().length
											   + GMXMAP["editInteractionBar"].getInteraction("Select").getFeatures().getArray().length;
								if(deleteFeatures > 0){
									GMXMAP["deleteInteraction"]["delete"](GMXMAP["editInteractionBar"].getInteraction("Select").getFeatures());
									GMXMAP["deleteInteraction"]["delete"](GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures());

									GMXMAP["editInteractionBar"].getInteraction("Transform").setSelection([]);
								}
							}
						})
					]
				})
				GMXMAP["editBar"].addControl(GMXMAP["deleteBar"]);

				/**
				 * Transform Interaction 에서 선택된 Feature 를 중앙 버튼으로 Drag 해야만 객체를 움직이도록 설정합니다. (필요시 주석하거나 활성화 하세요.)
				 *
				 * 선택된 객체의 하이라이트는 퍼포먼스 문제로 현재 사용되지 않습니다.
				 */
				//GMXMAP["editInteractionBar"].getInteraction("Transform").set("translateFeature", false);
				GMXMAP["editInteractionBar"].getInteraction("Transform").on("select", function(e){
					var selectLength = e.features.getArray().length;
					if(selectLength > 0 && selectLength < 50){
						for(var i=0; i<selectLength; i++){
							GMXMAP.addHighLight(e.features.getArray()[i], false, 1);
						}
					}
				});

				/**
				 * UndoRedo Interaction 객체를 생섷합니다.
				 *
				 * 주의) UndoRedo Intercation 생성하여 지도에 추가되면,
				 * UndoRedo.prototype.setWatchLayer 함수(Custom)를 이용하여 수정 대상 레이어 Vector 객체를 셋팅 해야 합니다.
				 * 그렇지 않을 경우 모든 Vector 레이어가 레코딩 됩니다.
				 */
				GMXMAP["undoInteraction"] = new ol.interaction.UndoRedo();
				GMXMAP.addInteraction(GMXMAP["undoInteraction"]);
				GMXMAP["undoInteraction"].setWatchLayer(_Vector);

				/**
				 * Undo + addFeature 이벤트일 경우 선택된 객체를 해제합니다.
				 */
				GMXMAP["undoInteraction"].on("undo", function(e) {
					if(e.action.type === "addfeature"){
						GMXMAP["editInteractionBar"].getInteraction("Select").getFeatures().clear();
						GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures().clear();
					}
				});

				/**
				 * UndoRedo Interaction Stack 에 객체가 추가될때 이벤트를 바인딩 합니다.
				 */
				GMXMAP["undoInteraction"].on("stack:add", function(e) {
					var convertKorType = e.action.name || e.action.type;
					switch (convertKorType) {
						case "removefeature" : convertKorType = "객체 제거"; break;
						case "addfeature" : convertKorType = "객체 추가"; break;
						case "translate" : convertKorType = "위치 변경"; break;
						case "modify" : convertKorType = "객체 수정"; break;
						case "rotate" : convertKorType = "객체 회전"; break;
						case "delete" : convertKorType = "객체 제거"; break;
						case "scale" : convertKorType = "크기 변형"; break;
						case "merge" : convertKorType = "객체 병합"; break;
					}

					if(!e.action.element) e.action.element = $("<li>").addClass(e.action.name || e.action.type).text(convertKorType);

					$(".options .undo").append(e.action.element);
					if(!GMXMAP["undoInteraction"].hasRedo()) $(".options .redo").html("");
				});

				/**
				 * UndoRedo Interaction Stack 에 객체가 제거될때 이벤트를 바인딩 합니다.
				 */
				GMXMAP["undoInteraction"].on("stack:remove", function(e) {
					if (e.shift) {
						$(".options .undo li").first().remove();
					} else {
						$(".options .redo").prepend($(".options .undo li").last());
					}
					e.action.element.attr("title", "redo");
				});

				/**
				 * UndoRedo Interaction Stack 을 모두 초기화 할 때의 이벤트를 바인딩 합니다.
				 */
				GMXMAP["undoInteraction"].on("stack:clear", function(e) {
					$(".options .undo").html("");
					$(".options .redo").html("");
				});

				/**
				 * 편집 바 내부에 Undo, Redo Interaction 버튼을 생성합니다.
				 */
				GMXMAP["undoBar"] = new ol.control.Bar({
					group : false,
					controls : [
			            new ol.control.Button({
							html : "<i class='fa fa-undo undoBtn'></i>",
							title : "뒤로 되돌리기",
							className: "bottom_btn",
							handleClick : function() {
								GMXMAP["undoInteraction"].undo();
							}
						}),
						new ol.control.Button({
							html : "<i class='fa fa-redo redoBtn'></i>",
							title : "앞으로 돌리기",
							className: "bottom_btn",
							handleClick : function() {
								GMXMAP["undoInteraction"].redo();
							}
						})
					]
				})
				GMXMAP["editBar"].addControl(GMXMAP["undoBar"]);

				/**
				 * Snap Interaction 객체를 생성합니다.
				 *
				 * 참고) Snap 대상은 현재 수정중인 레이어를 기본으로 합니다.
				 * Multiple Layer Snap 은 추가로 구현해야 합니다.
				 */
				GMXMAP["snapInteraction"] = new ol.interaction.Snap({ source : _Vector.getSource() });
				GMXMAP.addInteraction(GMXMAP["snapInteraction"]);

				/**
				 * 복사 + 붙혀넣기 Interaction 객체를 생성합니다.
				 */
				GMXMAP["copyPasteInteraction"] = new ol.interaction.CopyPaste({
					destination: _Vector.getSource(),
					features: GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures()
				});
				GMXMAP.addInteraction(GMXMAP["copyPasteInteraction"]);

				/**
				 * 복사하기 (Ctrl + C) 이벤트를 바인딩 합니다.
				 */
				GMXMAP["copyPasteInteraction"].on("copy", function(e) {
					GMXMAP.addMapNotification("객체를 복사하였습니다.");
				});

				/**
				 * 잘라내기 (Ctrl + X) 이벤트를 바인딩 합니다.
				 */
				GMXMAP["copyPasteInteraction"].on("cut", function(e) {
					GMXMAP["editInteractionBar"].getInteraction("Select").getFeatures().clear();
					GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures().clear();

					GMXMAP.addMapNotification("객체를 잘라내었습니다.");
				});

				/**
				 * 붙혀넣기 (Ctrl + V) 이벤트를 바인딩 합니다.
				 */
				GMXMAP["copyPasteInteraction"].on("paste", function (e) {
					GMXMAP["editInteractionBar"].getInteraction("Select").getFeatures().clear();
					GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures().clear();

					e.features.forEach(function(feature){
						GMXMAP["editInteractionBar"].getInteraction("Transform").select(feature, true);
						//GMXMAP.addHighLight(feature, false, 1);
					});

					GMXMAP.addMapNotification("동일 위치에 객체가 생성되었습니다.");
				});

				/**
				 * Drag Select Interaction 객체를 생성합니다.
				 */
				GMXMAP["dragBox"] = new ol.interaction.DragBox({
					condition: ol.events.condition.altShiftKeysOnly
				});

				GMXMAP["dragBox"].on("boxstart", function(e) {
					GMXMAP["editInteractionBar"].getInteraction("Select").getFeatures().clear();
					GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures().clear();
				});
				GMXMAP["dragBox"].on("boxend", function(e) {
					if(!GMXMAP["editInteractionBar"].getInteraction("Transform").getActive()){
						GMXMAP["editInteractionBar"].getInteraction("Select").setActive(false);
						GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
					}

					var extent = GMXMAP["dragBox"].getGeometry().getExtent();
					_Vector.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
						GMXMAP["editInteractionBar"].getInteraction("Transform").select(feature, true);
					});
				});
				GMXMAP.addInteraction(GMXMAP["dragBox"]);

				GMXMAP["isEditing"] = true;
				GMXMAP["editLayerId"] = _Vector.get("id");
				GMXMAP["editLayerNm"] = _Vector.get("name");

				/**
				 * 키보드 이벤트를 바인딩 합니다.
				 */
				$(document).keydown(_DeleteKeyEvent);
				$(document).keydown(_UndoRedoKeyEvent);
				$(document).keydown(_SelectAllKeyEvent);
				$(document).keydown(_MergeKeyEvent);
				$(document).keydown(_SplitKeyEvent);
				$(document).keydown(_SaveKeyEvent);
				$(document).keydown(_SnapToggleKeyEvent);

				/**
				 * Interaction 버튼들의 명칭을 한글로 변경합니다.
				 */
				_SetDisableProp();

				GMXMAP.addMapNotification("<" + _Vector.get("name") + "> 레이어 편집을 시작합니다.");

				clearTimeout(timeout);
				timeout = null;
			}, 500);
		}

		/**
		 * 편집된 Feature 들을 단위 행위(insert, update, delete) 별로 취합합니다.
		 * 취합이 완료된 데이터들은 최종 전송을 위해 XML 형식으로 반환됩니다.
		 */
		GMXMAP.getWFSTFeatures = function(){
			if(!GMXMAP["isEditing"] || !("undoInteraction" in GMXMAP) || !(GMXMAP["undoInteraction"] instanceof ol.interaction.UndoRedo)){
				console.error("공간 편집이 진행중일 경우만 객체를 반환받을 수 있습니다.");
				return false;
			}

			var _WFSTFeatures = GMXMAP["undoInteraction"].getWFSTFeatures();
			window.aa = _WFSTFeatures;
			if((_WFSTFeatures["insert"].length == 0) && (_WFSTFeatures["update"].length == 0) && (_WFSTFeatures["delete"].length == 0)){
				GMXMAP.addMapNotification("편집된 내용이 존재하지 않습니다.");
				console.error("편집된 내용이 존재하지 않습니다.");
				return false;
			}

			if(GMXMAP["editLayerId"] === "user_sketch_geom"){
				for(var i=0; i<_WFSTFeatures["insert"].length; i++) _WFSTFeatures["insert"][i].setProperties({ "mk_user" : userId, "mk_dat" : Date.prototype.getYMDHMS() });
				for(var i=0; i<_WFSTFeatures["update"].length; i++) _WFSTFeatures["update"][i].setProperties({ "mk_dat" : Date.prototype.getYMDHMS() });
			}

			if(GMXMAP["editLayerId"] in GMXLAYER.LayerList){
				if(GMXLAYER.LayerList[GMXMAP["editLayerId"]].geometryType === "MULTILINESTRING"){
					for(var i=0; i<_WFSTFeatures["insert"].length; i++){
						if(!_WFSTFeatures["insert"][i].getGeometry().getType().toUpperCase().contains("MULTI")){
							_WFSTFeatures["insert"][i].setGeometry(new ol.geom.MultiLineString([_WFSTFeatures["insert"][i].getGeometry()]));
						}
					}
					for(var i=0; i<_WFSTFeatures["update"].length; i++){
						if(!_WFSTFeatures["update"][i].getGeometry().getType().toUpperCase().contains("MULTI")){
							_WFSTFeatures["update"][i].setGeometry(new ol.geom.MultiLineString([_WFSTFeatures["update"][i].getGeometry()]));
						}
					}
				}
				if(GMXLAYER.LayerList[GMXMAP["editLayerId"]].geometryType === "MULTIPOLYGON"){
					for(var i=0; i<_WFSTFeatures["insert"].length; i++){
						if(!_WFSTFeatures["insert"][i].getGeometry().getType().toUpperCase().contains("MULTI")){
							_WFSTFeatures["insert"][i].setGeometry(new ol.geom.MultiPolygon([_WFSTFeatures["insert"][i].getGeometry()]));
						}
					}
					for(var i=0; i<_WFSTFeatures["update"].length; i++){
						if(!_WFSTFeatures["update"][i].getGeometry().getType().toUpperCase().contains("MULTI")){
							_WFSTFeatures["update"][i].setGeometry(new ol.geom.MultiPolygon([_WFSTFeatures["update"][i].getGeometry()]));
						}
					}
				}
			}

			var _WFSTSerializer = new ol.format.WFS();
			var _WFS4XML = _WFSTSerializer.writeTransaction(
				(_WFSTFeatures["insert"].length > 0) ? _WFSTFeatures["insert"] : null,
				(_WFSTFeatures["update"].length > 0) ? _WFSTFeatures["update"] : null,
				(_WFSTFeatures["delete"].length > 0) ? _WFSTFeatures["delete"] : null,
				{
					featureType: "gmx:" + GMXMAP.editLayerId,
					featureNS: "http://www.geomex.co.kr/gmx",
					srsName: "EPSG:5186"
				}
			);

			var _XMLSerializer = new XMLSerializer();
			var _WFSTDataSet = _XMLSerializer.serializeToString(_WFS4XML);
				_WFSTDataSet = _WFSTDataSet.replaceAll("geometry", "_geometry");
				_WFSTDataSet = _WFSTDataSet.replaceAll("feature:gmx:", "feature:");

			return _WFSTDataSet;
		}

		/**
		 * XML로 최종 취합된 모든 데이터를 서버에 전송합니다.
		 */
		GMXMAP.transactionalFeatures = function(){
			var _WFSTDataSet = GMXMAP.getWFSTFeatures();

			if(!GMXMAP["isEditing"] || !_WFSTDataSet){
				console.error("편집된 내용이 없어나 현재 편집 모드가 아닙니다.");
			}else{
				$.ajax({
					type : "POST",
					url : "./GMT_proxy/wfs?typename=gmx:" + GMXMAP.editLayerId,
					data : _WFSTDataSet,
					dataType: "xml",
					async : false,
					processData: false,
					contentType: "text/xml",
					beforeSend : function(){ },
					error : function(){ },
					complete : function(){ },
					success : function(data){
						if($(data).find("ExceptionReport").length > 0){
							GMXMAP.addMapNotification("저장을 실패하였습니다.<br><br>관리자에게 문의해주세요.", 3000);
						}else{
							var source = GMXMAP.getLayer(GMXMAP.editLayerId).getSource();
							var wfsParam = null;
							if(GMXMAP.editLayerId === "user_sketch_geom"){
								wfsParam = GMXMAP.getSketchLayerWFSParam();
							}else{
								wfsParam = JSON.parse(JSON.stringify(GMXLAYER.LayerList[GMXMAP.editLayerId].layer._wfsParam));
							}
							delete wfsParam["bbox"];

							GMXLAYER.loadFeatures(source, wfsParam, true);

							if(("undoInteraction" in GMXMAP) && (GMXMAP["undoInteraction"] != null)) GMXMAP["undoInteraction"].clear();

							GMXMAP.addMapNotification("저장이 완료되었습니다.");
						}
					}
				});
			}

			var timeout = setTimeout(function(){
				if(("undoInteraction" in GMXMAP) && (GMXMAP["undoInteraction"] != null)) GMXMAP["undoInteraction"].clear();
				GMXMAP["editInteractionBar"].getInteraction("Select").getFeatures().clear();
				GMXMAP["editInteractionBar"].getInteraction("Transform").setSelection([]);
				GMXMAP["editInteractionBar"].getInteraction("Transform").un("select", mergeTargetSelectFeatureEvent);
				if(_SplitLineDrawInteraction != null) _DestroySplitTool();

				clearTimeout(timeout);
				timeout = null;
			}, 100);
		}

		/**
		 * 공간정보 편집 툴을 최종 제거합니다.
		 *
		 * 편집 대상 레이어가 Point 객체일 경우 Source 객체를 원본 Cluster 로 변경합니다.
		 *
		 * 편집에 사용된 모든 Control 및 Interaction 객체를 필수로 지도에서 제거해야 합니다.
		 */
		GMXMAP.removeGeometryEditor = function(){
			if((GMXMAP["originClusterSource"] != null) && (GMXMAP["originClusterSource"] instanceof ol.source.Cluster) && (GMXMAP.getLayer(GMXMAP["editLayerId"]) != null)){
				GMXMAP.getLayer(GMXMAP["editLayerId"]).setSource(GMXMAP["originClusterSource"]);
				GMXMAP["originClusterSource"] = null; delete GMXMAP["originClusterSource"];
			}

			if(_SplitLineDrawInteraction != null) _DestroySplitTool();

			for(var _LayerId in _SnapInteractions){
				GMXMAP.removeInteraction(_SnapInteractions[_LayerId]);
				_SnapInteractions[_LayerId] = null;
				delete _SnapInteractions[_LayerId];
			}
			_SnapInteractions = {};

			GMXMAP.removeControl(GMXMAP["editBar"]); GMXMAP["editBar"] = null; delete GMXMAP["editBar"];
			GMXMAP.removeControl(GMXMAP["snapToggleBar"]); GMXMAP["snapToggleBar"] = null; delete GMXMAP["snapToggleBar"];
			GMXMAP.removeControl(GMXMAP["undoBar"]); GMXMAP["undoBar"] = null; delete GMXMAP["undoBar"];
			GMXMAP.removeControl(GMXMAP["deleteBar"]); GMXMAP["deleteBar"] = null; delete GMXMAP["deleteBar"];
			GMXMAP.removeControl(GMXMAP["editInteractionBar"]); GMXMAP["editInteractionBar"] = null; delete GMXMAP["editInteractionBar"];
			GMXMAP.removeControl(GMXMAP["selectAllFeatureBar"]); GMXMAP["selectAllFeatureBar"] = null; delete GMXMAP["selectAllFeatureBar"];
			GMXMAP.removeControl(GMXMAP["mergeFeatureBar"]); GMXMAP["mergeFeatureBar"] = null; delete GMXMAP["mergeFeatureBar"];
			GMXMAP.removeControl(GMXMAP["splitFeatureBar"]); GMXMAP["splitFeatureBar"] = null; delete GMXMAP["splitFeatureBar"];

			GMXMAP.removeInteraction(GMXMAP["dragBox"]); GMXMAP["dragBox"] = null; delete GMXMAP["dragBox"];
			GMXMAP.removeInteraction(GMXMAP["snapInteraction"]); GMXMAP["snapInteraction"] = null; delete GMXMAP["snapInteraction"];
			GMXMAP.removeInteraction(GMXMAP["undoInteraction"]); GMXMAP["undoInteraction"] = null; delete GMXMAP["undoInteraction"];
			GMXMAP.removeInteraction(GMXMAP["copyPasteInteraction"]); GMXMAP["copyPasteInteraction"] = null; delete GMXMAP["copyPasteInteraction"];
			GMXMAP.removeInteraction(GMXMAP["deleteInteraction"]); GMXMAP["deleteInteraction"] = null; delete GMXMAP["deleteInteraction"];

			GMXMAP["isEditing"] = false;

			GMXMAP.reloadLayerData(GMXMAP.editLayerId);

			GMXMAP.addMapNotification("<" + GMXMAP["editLayerNm"] + "> 레이어 편집을 종료합니다.");

			GMXMAP["editLayerId"] = null;
			GMXMAP["editLayerNm"] = null;
		}

		/**
		 * 공간정보 편집을 종료합니다.
		 *
		 * 사용자의 confirm 결과에 따라 GMXMAP.removeGeometryEditor 함수를 호출하여 최종 종료 처리 합니다.
		 */
		GMXMAP.stopGeometryEdit = function(){
			var confirmResult = false;

			if(GMXMAP["isEditing"]){
				var confirmText = "<" + GMXMAP["editLayerNm"] + "> 레이어 편집을 종료하시겠습니까?";
				if(GMXMAP["editLayerId"] !== "user_sketch_geom"){
					confirmText += "\n\n저장하지 않고 종료할 경우 편집된 내용은 반영되지 않습니다.";
				}

				if(confirm(confirmText)){
					confirmResult = true;

					if(GMXMAP["editLayerId"] === "user_sketch_geom"){
						GMXMAP.transactionalFeatures();
						GMXMAP["sketchLayer"].setVisible(false);
					}

					$("#legendWrap").find("button.edit").show();
					if((GMXMAP["editLayerId"] !== "user_sketch_geom") && $("#legendWrap").find("#" + GMXMAP["editLayerId"]).length > 0){
						$("#legendWrap").find("#" + GMXMAP["editLayerId"]).siblings("label.checkboxC").show();
					}

					GMXMAP.removeGeometryEditor();

					$("#redoUndoStackWrap").dialog("close");
					$("#startGeometryEdit").show();
					$("#stopGeometryEdit, #saveGeometryEdit").hide();

					$("#editLayerSelect").prop("disabled", false);
					$("#startGeometryEdit").prop("disabled", false);
					$("#stopGeometryEdit, #saveGeometryEdit").prop("disabled", true);

					$(document).unbind("keydown", _DeleteKeyEvent);
					$(document).unbind("keydown", _UndoRedoKeyEvent);
					$(document).unbind("keydown", _SelectAllKeyEvent);
					$(document).unbind("keydown", _MergeKeyEvent);
					$(document).unbind("keydown", _SplitKeyEvent);
					$(document).unbind("keydown", _SaveKeyEvent);
					$(document).unbind("keydown", _SnapToggleKeyEvent);
				}
			}

			return confirmResult;
		}

		/**
		 * 공간편집 이력 Dialog 를 생성합니다.
		 */
		GMXMAP.createRedoUndoStackDialog = function(){
			var $view = $("<div>").addClass("contentWrap").addClass("customScroll").addClass("options");
			$view.append("<button id='resetStack' class='btn_style'>이력 비우기</button>");
			$view.append("<ul class='undo'></ul>");
			$view.append("<hr>");
			$view.append("<ul class='redo'></ul>");
			$view.find("ul").css("list-style", "none");

			$view.find("#resetStack").click(function(){
				if(("undoInteraction" in GMXMAP) && (GMXMAP["undoInteraction"] != null)) GMXMAP["undoInteraction"].clear();
			});

			if($("#redoUndoStackWrap").length === 0){
				$("body").append($("<div>").attr("id", "redoUndoStackWrap").addClass("dialogWrap").addClass("table_style"));
				$("#redoUndoStackWrap").addClass("customScroll").html($view).dialog({
					title: "편집 이력",
					resizable: false,
					draggable: false,
					closeOnEscape: false,
					width: 200,
					height: $("#map").height() / 2,
					position: {
						my: "right bottom",
						at: "right bottom",
						of: $("#map")
					},
					open: function(){
						$(this).parent().find(".ui-dialog-titlebar-close").hide();
					},
					close: function(){
						$(this).dialog("destroy");
						$(this).remove();
					}
				});
			}else{
				$("#redoUndoStackWrap").html($view);
			}
		};

		/**
		 * Snap 설정 Dialog 를 생성합니다.
		 *
		 * @Deprecated 현재 사용되지 않습니다.
		 */
		var __createSnapSettingDialog__ = function(){
			var $view = $("<div>").addClass("contentWrap").addClass("customScroll").addClass("options");
			var $table = $("<table>").width("100%");

			var _Vectors = __GetSnapTargetVectors__();
			for(var i=0; i<_Vectors.length; i++){
				var $tr = $("<tr>");
				var $checkbox = $("<input>").attr("type", "checkbox").data(_Vectors[i]);

				$tr.append($("<td>").append($checkbox).width(25));
				$tr.append($("<td>").text(_Vectors[i].name));

				$table.append($tr);
			}
			$view.html($table);

			if($("#snapSettingWrap").length === 0){
				$("body").append($("<div>").attr("id", "snapSettingWrap").addClass("dialogWrap").addClass("table_style"));
				$("#snapSettingWrap").addClass("customScroll").html($view).dialog({
					title: "Snap 대상 설정",
					resizable: false,
					draggable: false,
					closeOnEscape: false,
					width: 200,
					height: $("#map").height() / 2,
					position: {
						my: "right top",
						at: "right top",
						of: $("#map")
					},
					open: function(){
						$(this).parent().find(".ui-dialog-titlebar-close").hide();
					},
					close: function(){
						$(this).dialog("destroy");
						$(this).remove();
					}
				});
			}else{
				$("#snapSettingWrap").html($view);
			}
		};

	}
}

})(GMXMAP, GMXLAYER, window.turf);