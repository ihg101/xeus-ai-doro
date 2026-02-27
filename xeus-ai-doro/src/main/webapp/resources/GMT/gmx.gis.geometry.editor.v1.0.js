/**
 * 공간 편집 툴 입니다.
 *
 * 1.0 버전이므로 수정되는 즉시 단건 저장됩니다.
 *
 * @auther 이주영
 */
/* jshint esversion: 6 */
"use strict";
(function(GMXMAP, GMXLAYER) {

if (GMXMAP != null && GMXLAYER != null) {
	if (GMXMAP instanceof ol.Map) {

		GMXMAP["GeometryEditorVersion"] = 1.0;

		/**
		 * 공간 편집 후 기본 속성을 입력합니다.
		 *
		 * @Deprecated
		 */
		var addDefaultProperties = function(features){
			if(GMXMAP["editLayerId"] === "asset_cctv"){
				for(var i=0; i<features.length; i++){
					_common.callAjax("/primary/getNextPrimaryKey.json", { "table" : "asset_cctv" }, function(json){
						features[i].setProperties({ "mgr_no" : json.result, "vms_mgr_no" : "VMS0000001" });
					}, false);
				}
			}

			return features;
		}

		/**
		 * 편집 객체를 서버에 저장합니다.
		 */
		var transactionCount = 0;
		var transactionFeature = function(mode, features){
			if(!GMXMAP["isEditing"]){
				alert("공간 편집 중이 아닙니다.");
				return false;
			}

			if(_common.utils.isNullAndEmpty(GMXMAP["editLayerId"])){
				alert("공간 편집 중이 아닙니다.");
				return false;
			}

			if(GMXMAP["editLayerId"] === "user_sketch_geom"){
				for(var i=0; i<features.length; i++){
					features[i].setProperties({ "mk_user" : userId, "mk_dat" : Date.prototype.getYMDHMS() });
				}
			}

			var layer = GMXMAP.getLayer(GMXMAP["editLayerId"]);
			var prop = layer.getProperties();

			var WFSTSerializer = new ol.format.WFS();
			var featObject = null;

			var epsg = GMXMAP.getView().getProjection().getCode();
			var param = {
				featureType: "gmx:" + prop.id,
				featureNS: "http://www.geomex.co.kr/gmx",
				srsName: epsg
			}

			//TODO single multiple 구분필요
			switch (mode) {
				case "insert" :
					featObject = WFSTSerializer.writeTransaction(addDefaultProperties(features), null, null, param);
					break;
				case "update" :
					featObject = WFSTSerializer.writeTransaction(null, features, null, param);
					break;
				case "delete" :
					featObject = WFSTSerializer.writeTransaction(null, null, features, param);
					break;
			}

			var serializer = new XMLSerializer();
			var wfstData = serializer.serializeToString(featObject);
			wfstData = wfstData.replaceAll("geometry", "_geometry");
			wfstData = wfstData.replaceAll("feature:gmx:", "feature:");

			var result = false;
			$.ajax({
				type : "POST",
				url : "./GMT_proxy/wfs?typename=" + param.featureType,
				data : wfstData,
				dataType: "xml",
				async : false,
				processData: false,
				contentType: "text/xml",
				beforeSend : function(){
					GMXMAP["editInteractionBar"].getInteraction("Select").setActive(false);
				},
				success : function(data){
					if($(data).find("ExceptionReport").length > 0){
						result = false;
					}else{
						switch (mode) {
						case "insert" :
							result = $(data).find("ogc\\:FeatureId").attr("fid");
							break;
						case "update" :
							result = true;
							break;
						case "delete" :
							result = true;
							break;
						}

						GMXMAP.reloadLayerData(prop.id);
					}
				},
				error : function(xhr, status, error){},
				complete : function(){}
			});

			return result;
		}

		/**
		 * 객체를 추가합니다.
		 */
		GMXLAYER.insertFeature = function(feature){
			var features = new Array();

			if(feature instanceof Array) features = feature;
			if(feature instanceof ol.Feature) features.push(feature);

			var featureId = transactionFeature("insert", features);
			if(typeof featureId === "string"){
				GMXMAP.addMapNotification("객체가 생성 되었습니다.");
				return featureId;
			}else{
				GMXMAP.addMapNotification("객체 생성을 실패하였습니다.");
				return;
			}
		}

		/**
		 * 객체를 수정합니다.
		 */
		GMXLAYER.updateFeature = function(feature){
			var features = new Array();

			if(feature instanceof Array) features = feature;
			if(feature instanceof ol.Feature) features.push(feature);

			if(transactionFeature("update", features)){
				GMXMAP.addMapNotification("객체가 수정 되었습니다.");
			}else{
				GMXMAP.addMapNotification("객체 수정을 실패하였습니다.");
				return;
			};
		}

		/**
		 * 객체를 제거합니다.
		 */
		GMXLAYER.deleteFeature = function(feature){
			var features = new Array();

			if(feature instanceof Array) features = feature;
			if(feature instanceof ol.Feature) features.push(feature);

			if(transactionFeature("delete", features)){
				GMXMAP.addMapNotification("객체가 삭제 되었습니다.");
			}else{
				GMXMAP.addMapNotification("객체 삭제를 실패하였습니다.");
				return;
			};
		}

		/**
		 * 편집 관련 엘리먼트의 prop을 설정합니다.
		 */
		var setDisableProp = function(){
			$(".ol-selection").addClass('bottom_btn').find("button").eq(0).attr("title", "객체 선택 및 버텍스 추가").prop("disabled", false).append('<i class="fas fa-check-square"></i>');
			$(".ol-delete").addClass('bottom_btn').find("button").eq(0).attr("title", "객체 삭제").prop("disabled", false).append('<i class="fas fa-trash-alt"></i>');
			$(".ol-drawpoint").addClass('bottom_btn').find("button").eq(0).attr("title", "점 그리기").prop("disabled", false).append('<i class="fas fa-ellipsis-h"></i>');
			$(".ol-drawline").addClass('bottom_btn').find("button").eq(0).attr("title", "선 그리기").prop("disabled", false).append('<i class="fas fa-grip-lines"></i>');
			$(".ol-drawpolygon").addClass('bottom_btn').find("button").eq(0).attr("title", "다각형 그리기").prop("disabled", false).append('<i class="fas fa-square"></i>');
			$(".ol-drawhole").addClass('bottom_btn').find("button").eq(0).attr("title", "면 내부에 구멍 그리기").prop("disabled", false).append('<i class="fas fa-dot-circle"></i>');
			$(".ol-drawregular").addClass('bottom_btn').find("button").eq(0).attr("title", "면 그리기").prop("disabled", false).append('<i class="fas fa-draw-polygon"></i>');
			$(".ol-transform").addClass('bottom_btn').find("button").eq(0).attr("title", "객체 자유 변형").prop("disabled", false).append('<i class="fas fa-expand-arrows-alt"></i>');

			$("#editLayerSelect").prop("disabled", true);
			$("#startGeometryEdit").prop("disabled", true);
			$("#stopGeometryEdit").prop("disabled", false);

			if(GMXMAP.getLayer(GMXMAP["editLayerId"]).get("geomType") === "P"){
				$(".ol-drawline").find("button").eq(0).prop("disabled", true);
				$(".ol-drawpolygon").find("button").eq(0).prop("disabled", true);
				$(".ol-drawhole").find("button").eq(0).prop("disabled", true);
				$(".ol-drawregular").find("button").eq(0).prop("disabled", true);
				$(".ol-transform").find("button").eq(0).prop("disabled", true);
			}else if(GMXMAP.getLayer(GMXMAP["editLayerId"]).get("geomType") === "L"){
				$(".ol-drawpoint").find("button").eq(0).prop("disabled", true);
				$(".ol-drawpolygon").find("button").eq(0).prop("disabled", true);
				$(".ol-drawhole").find("button").eq(0).prop("disabled", true);
				$(".ol-drawregular").find("button").eq(0).prop("disabled", true);
			}else if(GMXMAP.getLayer(GMXMAP["editLayerId"]).get("geomType") === "G"){
				$(".ol-drawpoint").find("button").eq(0).prop("disabled", true);
				$(".ol-drawline").find("button").eq(0).prop("disabled", true);
			}
		}

		/**
		 * 공간정보 편집 툴을 생성합니다.
		 */
		GMXMAP["isEditing"] = false;
		GMXMAP["editLayerId"] = null;
		GMXMAP["editLayerNm"] = null;
		GMXMAP["undo"] = null;
		GMXMAP["redo"] = null;
		GMXMAP.addGeometryEditor = function(vector){

			if(_common.utils.isNullAndEmpty(vector)){
				alert("편집 대상 레이어를 선택해 주세요.");
				$("#editLayerSelect").focus();
				return;
			}

			if(vector instanceof ol.layer.Vector === false){
				alert("올바른 Vector 객체가 아니므로 편집을 시작할 수 없습니다.");
				$("#editLayerSelect").focus();
				return;
			}

			if(vector instanceof ol.layer.Vector){
				GMXMAP.setAllLayerUnVisible();
				if(!vector.getVisible()) vector.setVisible(true);
			}

			$("#startGeometryEdit").hide();
			$("#stopGeometryEdit").show();

			/**
			 * 하단의 생성될 공간정보 편집 바를 생성합니다.
			 */
			GMXMAP["editBar"] = new ol.control.Bar({ className : "editBar" });
			GMXMAP["editBar"].setPosition("bottom");
			GMXMAP.addControl(GMXMAP["editBar"]);

			/**
			 * 편집 바 내부에 물리 버튼을 생성합니다.
			 */
			GMXMAP["editInteractionBar"] = new ol.control.EditBar({
				source: vector.getSource(),
				interactions: {
					Select: new ol.interaction.Select({
						layers: function(layer) {
							return layer.get("id") === vector.get("id");
						},
					}),
					Info: false, Split: false, Offset: false
				}
			});
			GMXMAP["editBar"].addControl(GMXMAP["editInteractionBar"]);


			/**
			 * Undo / Redo 객체를 초기화 합니다.
			 */
			GMXMAP["undo"] = new Stack();
			GMXMAP["redo"] = new Stack();

			var setCursor = function(){
				if(GMXMAP["undo"] != null){
					if(GMXMAP["undo"].size() > 0){
						$(".undoBtn").find("i").css("cursor", "default");
					}else{
						$(".undoBtn").find("i").css("cursor", "no-drop");
					}
				}
				if(GMXMAP["redo"] != null){
					if(GMXMAP["redo"].size() > 0){
						$(".redoBtn").find("i").css("cursor", "default");
					}else{
						$(".redoBtn").find("i").css("cursor", "no-drop");
					}
				}
			}

			/**
			 * Undo 를 추가합니다.
			 * Undo 가 추가되면 Redo 는 초기화 됩니다.
			 */
			var firstUndoFeature = null;
			var lastModifyFeature = null;

			var addUndo = function(action, feature, callBack){
				var unredo = { "action" : action, "feature" : feature, "callBack" : callBack };
				if(action === "insert"){
					unredo["Undo"] = GMXLAYER.deleteFeature;
					unredo["Redo"] = GMXLAYER.insertFeature;
				}else if(action === "update"){
					unredo["Undo"] = GMXLAYER.updateFeature;
					unredo["Redo"] = GMXLAYER.updateFeature;
				}else if(action === "delete"){
					unredo["Undo"] = GMXLAYER.insertFeature;
					unredo["Redo"] = GMXLAYER.deleteFeature;
				}
				GMXMAP["undo"].push(unredo);
				GMXMAP["redo"] = null;
				GMXMAP["redo"] = new Stack();

				setCursor();
			}

			/**
			 * ModifyInteraction 객체를 찾습니다.
			 */
			GMXMAP["ModifyInteraction"] = null;
			GMXMAP.getInteractions().forEach(function(interaction){
				if(interaction instanceof ol.interaction.ModifyFeature){
					GMXMAP["ModifyInteraction"] = interaction;
					return;
				}
			});

			/**
			 * ModifyInteraction 인터렉션의 이벤트 입니다.
			 * 객체 선택 및 버텍스 추가 기능을 담당합니다.
			 */
			if(GMXMAP["ModifyInteraction"] instanceof ol.interaction.ModifyFeature){
				GMXMAP["ModifyInteraction"].on("modifystart", function(f){
					var feature = null;
					var type = f.features[0].getGeometry().getType();
					if(type === "Point"){
						if(f.features != null){
							if("features" in f.features[0].getProperties()){
								if(f.features[0].getProperties().features != null){
									feature = f.features[0].getProperties().features[0];
								}
							}else{
								feature = f.features[0];
							}
						}
					}else{
						feature = f.features[0];
					}
					/*if(type === "MultiPolygon") feature = f.features[0];
					if(type === "MultiLineString") feature = f.features[0];*/

					firstUndoFeature = feature.clone();
					firstUndoFeature.setId(feature.getId());

					if(GMXMAP["undo"].size() == 0) addUndo("update", firstUndoFeature);
				});
				GMXMAP["ModifyInteraction"].on("modifyend", function(f){
					var feature = null;
					var type = f.features[0].getGeometry().getType();
					if(type === "Point"){
						if(f.features != null){
							if("features" in f.features[0].getProperties()){
								if(f.features[0].getProperties().features != null){
									feature = f.features[0].getProperties().features[0];
									feature.getGeometry().setCoordinates(f.coordinate);
								}
							}else{
								feature = f.features[0];
								feature.getGeometry().setCoordinates(f.coordinate);
							}

							GMXMAP["ModifyInteraction"].setActive(false);
						}
					}else{
						feature = f.features[0];
					}
					/*if(type === "MultiPolygon") feature = f.features[0];
					if(type === "MultiLineString") feature = f.features[0];*/

					GMXLAYER.updateFeature(feature);

					lastModifyFeature = feature.clone();
					lastModifyFeature.setId(feature.getId());

					addUndo("update", lastModifyFeature);
				});
			}

			/**
			 * 선택 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("Select").on("select", function(f){
				if(f.selected.length > 0){
					if(f.selected[0].getGeometry().getType() === "Point"){
						if("features" in f.selected[0].getProperties()){
							firstUndoFeature = f.selected[0].getProperties().features[0].clone();
							firstUndoFeature.setId(f.selected[0].getProperties().features[0].getId());
						}else{
							firstUndoFeature = f.selected[0].clone();
							firstUndoFeature.setId(f.selected[0].getId());
						}
					}else{
						firstUndoFeature = f.selected[0].clone();
						firstUndoFeature.setId(f.selected[0].getId());
					}
				}
				GMXMAP["ModifyInteraction"].setActive(true);
			});

			/**
			 * 삭제 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("Delete").on("deleteend", function(f){
				var feature = null;
				var type = f.features[0].getGeometry().getType();
				if(type === "Point"){
					if("features" in f.features[0].getProperties()){
						feature = f.features[0].getProperties().features[0];
					}else{
						feature = f.features;
					}
				}else{
					feature = f.features[0];
				}
				/*if(type === "MultiPolygon") feature = f.features[0];
				if(type === "MultiLineString") feature = f.features[0];*/

				if(feature === null){
					alert("선택된 객체가 없습니다.");
					return false;
				}

				GMXLAYER.deleteFeature(feature);

				addUndo("delete", feature);
			});


			/**
			 * 포인트 추가 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("DrawPoint").on("drawend", function(f){
				var featureId = GMXLAYER.insertFeature(f.feature);
				f.feature.setId(featureId);

				addUndo("insert", f.feature);
			});

			/**
			 * 라인 추가 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("DrawLine").on("drawend", function(f, l){
				var feature = new ol.Feature();

				if(!_common.utils.isNullAndEmpty(GMXLAYER.LayerList[GMXMAP["editLayerId"]])){
					if(GMXLAYER.LayerList[GMXMAP["editLayerId"]].geometryType === "LINESTRING"){
						feature.setGeometry(new ol.geom.LineString(f.feature.getGeometry().getCoordinates()));
					}else{
						feature.setGeometry(new ol.geom.MultiLineString([f.feature.getGeometry()]));
					}
				}else if(GMXMAP["editLayerId"] === "user_sketch_geom"){
					feature.setGeometry(new ol.geom.MultiLineString([f.feature.getGeometry()]))
				}

				var featureId = GMXLAYER.insertFeature(feature);
				feature.setId(featureId);

				addUndo("insert", feature);

				/*f.feature.setGeometry(new ol.geom.MultiLineString([f.feature.getGeometry()]));

				var featureId = GMXLAYER.insertFeature(f.feature);
				f.feature.setId(featureId);

				addUndo("insert", f.feature);*/
			});

			/**
			 * 폴리곤 추가 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("DrawPolygon").on("drawend", function(f){
				var feature = new ol.Feature();

				if(!_common.utils.isNullAndEmpty(GMXLAYER.LayerList[GMXMAP["editLayerId"]])){
					if(GMXLAYER.LayerList[GMXMAP["editLayerId"]].geometryType === "POLYGON"){
						feature.setGeometry(new ol.geom.Polygon(f.feature.getGeometry().getCoordinates()));
					}else{
						feature.setGeometry(new ol.geom.MultiPolygon([f.feature.getGeometry()]));
					}
				}else if(GMXMAP["editLayerId"] === "user_sketch_geom"){
					feature.setGeometry(new ol.geom.MultiPolygon([f.feature.getGeometry()]))
				}

				var featureId = GMXLAYER.insertFeature(feature);
				feature.setId(featureId);

				addUndo("insert", feature);

				/*f.feature.setGeometry(new ol.geom.MultiPolygon([f.feature.getGeometry()]));

				var featureId = GMXLAYER.insertFeature(f.feature);
				f.feature.setId(featureId);

				addUndo("insert", f.feature);*/
			});

			/**
			 * 홀 추가 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("DrawHole").on("drawend", function(f){
				GMXLAYER.updateFeature(f.feature);

				addUndo("update", f.feature);
			});

			/**
			 * 다각형 추가 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("DrawRegular").on("drawend", function(f){
				var feature = new ol.Feature();

				if(!_common.utils.isNullAndEmpty(GMXLAYER.LayerList[GMXMAP["editLayerId"]])){
					if(GMXLAYER.LayerList[GMXMAP["editLayerId"]].geometryType === "POLYGON"){
						feature.setGeometry(new ol.geom.Polygon(f.feature.getGeometry().getCoordinates()));
					}else{
						feature.setGeometry(new ol.geom.MultiPolygon([f.feature.getGeometry()]));
					}
				}else if(GMXMAP["editLayerId"] === "user_sketch_geom"){
					feature.setGeometry(new ol.geom.MultiPolygon([f.feature.getGeometry()]))
				}

				var featureId = GMXLAYER.insertFeature(feature);
				feature.setId(featureId);

				addUndo("insert", feature);

				/*f.feature.setGeometry(new ol.geom.MultiPolygon([f.feature.getGeometry()]));

				var featureId = GMXLAYER.insertFeature(f.feature);
				f.feature.setId(featureId);

				addUndo("insert", f.feature);*/
			});

			/**
			 * 자유변형 추가 인터렉션의 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("Transform").layers_ = [vector];
			GMXMAP["editInteractionBar"].getInteraction("Transform").on("select", function(f){
				if(f.feature){
					if(f.feature.getGeometry().getType() !== "Point"){
						firstUndoFeature = f.feature.clone();
						firstUndoFeature.setId(f.feature.getId());
					}
				}
			});

			/**
			 * 회전 인터렉션 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("Transform").on("rotatestart", function(f){
				if(f.feature.getGeometry().getType() !== "Point"){
					if(GMXMAP["undo"].size() == 0) addUndo("update", firstUndoFeature);
					/*lastModifyFeature = f.feature.clone();
					lastModifyFeature.setId(f.feature.getId());

					addUndo("update", lastModifyFeature, function(){
						GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(false);
						GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
					});*/
				}

			});
			GMXMAP["editInteractionBar"].getInteraction("Transform").on("rotateend", function(f){
				if(f.feature.getGeometry().getType() !== "Point") GMXLAYER.updateFeature(f.feature);
				lastModifyFeature = f.feature.clone();
				lastModifyFeature.setId(f.feature.getId());

				addUndo("update", lastModifyFeature, function(){
					GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(false);
					GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
				});
				//lastModifyFeature = null;
			});

			/**
			 * 자유변형 인터렉션 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("Transform").on("translatestart", function(f){
				if(f.feature.getGeometry().getType() !== "Point"){
					if(GMXMAP["undo"].size() == 0) addUndo("update", firstUndoFeature);
					/*lastModifyFeature = f.feature.clone();
					lastModifyFeature.setId(f.feature.getId());

					addUndo("update", lastModifyFeature, function(){
						GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(false);
						GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
					});*/
				}
			});
			GMXMAP["editInteractionBar"].getInteraction("Transform").on("translateend", function(f){
				if(f.feature.getGeometry().getType() !== "Point") GMXLAYER.updateFeature(f.feature);
				lastModifyFeature = f.feature.clone();
				lastModifyFeature.setId(f.feature.getId());

				addUndo("update", lastModifyFeature, function(){
					GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(false);
					GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
				});
				//lastModifyFeature = null;
			});

			/**
			 * 스케일 인터렉션 이벤트 입니다.
			 */
			GMXMAP["editInteractionBar"].getInteraction("Transform").on("scalestart", function(f){
				if(f.feature.getGeometry().getType() !== "Point"){
					if(GMXMAP["undo"].size() == 0) addUndo("update", firstUndoFeature);
					/*lastModifyFeature = f.feature.clone();
					lastModifyFeature.setId(f.feature.getId());

					addUndo("update", lastModifyFeature, function(){
						GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(false);
						GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
					});*/
				}
			});
			GMXMAP["editInteractionBar"].getInteraction("Transform").on("scaleend", function(f){
				if(f.feature.getGeometry().getType() !== "Point") GMXLAYER.updateFeature(f.feature);
				lastModifyFeature = f.feature.clone();
				lastModifyFeature.setId(f.feature.getId());

				addUndo("update", lastModifyFeature, function(){
					GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(false);
					GMXMAP["editInteractionBar"].getInteraction("Transform").setActive(true);
				});
				//lastModifyFeature = null;
			});

			/**
			 * 복 + 붙 인터렉션 입니다.
			 */
			/*GMXMAP["copypaste"] = new ol.interaction.CopyPaste({
				destination: vector.getSource(),
				features: GMXMAP["editInteractionBar"].getInteraction("Transform").getFeatures()
			});
			GMXMAP.addInteraction(GMXMAP["copypaste"]);

			GMXMAP["copypaste"].on("cut", function(e) {
				GMXMAP["editInteractionBar"].getInteraction("Transform").select();
			});
			GMXMAP["copypaste"].on("paste", function (e) {
				GMXMAP["editInteractionBar"].getInteraction("Transform").select();
				e.features.forEach (function(f) {
					GMXMAP["editInteractionBar"].getInteraction("Transform").select(f, true);
				});
			});*/

			/**
			 * Undo 이벤트 입니다.
			 */
			var setUndo = function(){
				if(GMXMAP["undo"] != null){
					if(GMXMAP["undo"].size() > 0){
						var undo = GMXMAP["undo"].pop();
						var callBack = undo.callBack;
						var feature = undo.feature;
						var featureId = undo.Undo(feature);
						if(undo.action === "insert") feature.setId(featureId);

						GMXMAP["redo"].push(undo);

						//if(GMXMAP["redo"].size() == 1) setUndo();

						reloadLayerData(GMXMAP.editLayerId);

						if(GMXMAP["redo"].size() == 1) GMXMAP.addMapNotification("<뒤로 되돌리기> 기능을 시작합니다.");

						if(callBack != null && typeof callBack === "function") callBack();
					}

					setCursor();
				}
			};

			/**
			 * Redo 이벤트 입니다.
			 */
			var setRedo = function(){
				if(GMXMAP["redo"] != null){
					if(GMXMAP["redo"].size() > 0){
						var redo = GMXMAP["redo"].pop();
						var callBack = redo.callBack;
						var feature = redo.feature;
						var featureId = redo.Redo(feature);
						if(redo.action === "insert") feature.setId(featureId);

						GMXMAP["undo"].push(redo);

						//if(GMXMAP["undo"].size() == 1) setRedo();

						reloadLayerData(GMXMAP.editLayerId);

						if(GMXMAP["undo"].size() == 1) GMXMAP.addMapNotification("<앞으로 되돌리기> 기능을 시작합니다.");

						if(callBack != null && typeof callBack === "function") callBack();
					}

					setCursor();
				}
			}

			/**
			 * Redo Undo 버튼을 생성하여 이벤트를 바인딩 합니다.
			 */
			GMXMAP["redoBar"] = new ol.control.Bar({
				group: true,
				controls: [
					new ol.control.Button({
						className: "undoBtn",
						html: "<i class='fas fa-arrow-left' style='cursor: no-drop;'></i>",
						title: "뒤로 되돌리기",
						handleClick: function() {
							setUndo();
						}
					}),
					new ol.control.Button({
						className: "redoBtn",
						html: "<i class='fas fa-arrow-right' style='cursor: no-drop;'></i>",
						title: "앞으로 돌리기",
						handleClick: function() {
							setRedo();
						}
					})
				]
			});
			GMXMAP["editBar"].addControl(GMXMAP["redoBar"]);

			/**
			 * Snap Interaction 을 생성합니다.
			 */
			GMXMAP["editSnap"] = new ol.interaction.Snap({
				source: vector.getSource()
			});
			GMXMAP.addInteraction(GMXMAP["editSnap"]);

			GMXMAP["isEditing"] = true;
			GMXMAP["editLayerId"] = vector.get("id");
			GMXMAP["editLayerNm"] = vector.get("name");

			if(GMXMAP["editLayerId"] === "user_sketch_geom"){
				$("#editLayerSelect").find("option").eq(0).prop("selected", true);
			}

			setDisableProp();

			GMXMAP.addMapNotification("<" + vector.get("name") + "> 레이어 편집을 시작합니다.");
		}

		/**
		 * 공간정보 편집 툴을 제거합니다.
		 */
		GMXMAP.removeGeometryEditor = function(){
			GMXMAP.removeControl(GMXMAP["editBar"]);
			GMXMAP.removeControl(GMXMAP["redoBar"]);
			GMXMAP.removeControl(GMXMAP["editInteractionBar"]);

			GMXMAP.removeInteraction(GMXMAP["undoInteraction"])
			GMXMAP.removeInteraction(GMXMAP["editSnap"])

			GMXMAP.addMapNotification("<" + GMXMAP["editLayerNm"] + "> 레이어 편집을 종료합니다.");

			GMXMAP["isEditing"] = false;
			GMXMAP["editLayerId"] = null;
			GMXMAP["editLayerNm"] = null;
			GMXMAP["undo"] = null;
			GMXMAP["redo"] = null;

			$("#editLayerSelect").prop("disabled", false);
			$("#startGeometryEdit").prop("disabled", false);
			$("#stopGeometryEdit").prop("disabled", true);
		}

		/**
		 * 공간정보 편집을 종료합니다.
		 */
		GMXMAP.stopGeometryEdit = function(){
			var confirmResult = false;
			if(GMXMAP["isEditing"]){
				if(confirm("<" + GMXMAP["editLayerNm"] + "> 레이어 편집을 종료하시겠습니까?")){
					confirmResult = true;

					if(GMXMAP["editLayerId"] === "user_sketch_geom"){
						GMXMAP["sketchLayer"].setVisible(false);
					}

					GMXMAP.removeGeometryEditor();

					$("#startGeometryEdit").show();
					$("#stopGeometryEdit").hide();
				}
			}
			return confirmResult;
		}

	}
}

})(GMXMAP, GMXLAYER);