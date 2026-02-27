/**
 * 도곽 절단 기능을 지원합니다.
 *
 * xeusGlobal-NMS.js, turf.js 를 의존하며 원활한 추출을 위해 기본 Proxy 처리합니다.
 *
 * @param GMXMAP
 * @param GMXLAYER
 * @param _GMXMAP_DEF_PROXY_
 * @param _GMXMAP_EXTENT_
 * @param turf.js
 *
 * @auther 이주영
 */
"use strict";

(function(GMXMAP, GMXLAYER, _GMXMAP_DEF_PROXY_, _GMXMAP_EXTENT_, turf){

if(GMXMAP != null && GMXLAYER != null){
	if(GMXMAP instanceof ol.Map){

		/**
		 * 자동 캡처 종료 변수 입니다.
		 */
		var _StopInterval = false;

		/**
		 * 지도를 Proxy 처리합니다.
		 */
		var defaultProxy = (_GMXMAP_DEF_PROXY_ === true);
		if(!defaultProxy){
			GMXMAP.addMapNotification("교차 출처 리소스 공유 정책(CORS)으로 인하여 배경지도를 다시 로드합니다.", 5000);
			_SET_ACTIVE_PROXY(true);
			GMXLAYER.setProxyTile(GMXMAP);
		}

		GMXMAP.renderSync();

		/**
		 * 닫기가 불가능한 로딩 dialog 를 생성합니다.
		 */
		var createLoadingWrap = function(){
			var $loader = $("<div>").addClass("cssload-container-circle");
			$loader.append("<div>").append("<div>").append("<div>").append("<div>");

			var $div = $("<div>").attr("id", "loadingWrap").addClass("table_style customScroll").css("overflow", "hidden");
			$div.append($loader);
			$div.append("<h3 class='tCenter' id='textWrap'><b id='nowCnt'></b><b><br><br>브라우저의 크기를 변경하지 마세요.<br><br><button class='btn_style' id='stopIntervalBtn'>자동 캡처 강제 종료</button></b></h3>");

			$("#parentBody").append($div);

			$div.dialog({
				title: "자동 캡처 진행중",
				modal: true,
				resizable: false,
				draggable: false,
				closeOnEscape: false,
				width: $("#map").width(),
				height: $("#map").height(),
				position: {
					my: "center center",
					at: "center center",
					of: $("#map")
				},
				open: function(){
					_StopInterval = false;

					$div.parent().find(".ui-dialog-titlebar-close").hide();
					$div.parent().find(".ui-dialog-titlebar").hide();
					$div.parent().css("opacity", "0.8");
					$div.height($("#map").height());
					$div.find("#textWrap").css({
						"position" : "absolute",
						"bottom" : "80px",
						"width" : "100%"
					});

					$div.find("#stopIntervalBtn").width(250).click(function(){
						$("#loadingWrap").find("#nowCnt").text("종료 처리 중입니다.");
						_StopInterval = true;
					});
				},
				close: function(){
					_StopInterval = false;

					$div.dialog("destroy");
					$div.remove();
				}
			});
		}

		/**
		 * 현재 OL 객체의 모든 Layer 를 임시 Canvas 에 추가하여 리턴합니다.
		 */
		var _CollectMapResource = function(tempCanvas){
			var mapContext = tempCanvas.getContext("2d");

			Array.prototype.forEach.call(
				document.querySelectorAll(".ol-layer canvas"),
				function (canvas) {
					if (canvas.width > 0) {
						var opacity = canvas.parentNode.style.opacity;
						mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
						var transform = canvas.style.transform;
						var matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(",").map(Number);
						CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
						mapContext.drawImage(canvas, 0, 0);
					}
				}
			);

			return mapContext;
		}

		/**
		 * 추출이 완료된 이미지 배열을 ZIP 으로 묶은 후 다운로드 처리합니다.
		 *
		 * exportImage 함수를 먼저 선행해야 합니다.
		 */
		var generateZip = function(_Imgs){
			if(_Imgs.length > 0){
				var zip = new JSZip();
				for(var i=0; i<_Imgs.length; i++){
					var imgName = "도곽_" + i + ".jpeg";
					if(i === 0) imgName = "도곽_전체.jpeg";

					zip.file(imgName, _Imgs[i].replace("data:image/jpeg;base64,", ""), { base64: true });
				}
				zip.generateAsync({ type : "blob" }).then(function(content) {
				    saveAs(content, "도곽절단결과_" + Date.prototype.getYMD(true) + ".zip");
				    $("#loadingWrap").dialog("close");
				});
			}
		}

		/**
		 * 절단된 그리드 갯수만큼 이미지를 캡처하여 배열에 저장합니다.
		 *
		 * 배열 저장이 완료된 후 generateZip 함수를 호출하여 다운로드 처리 합니다.
		 *
		 * @param _Imgs - Array
		 * @param _Grids - Array (Features)
		 * @param _Idx - Number (-1 값으로 시작될 경우 전체 캡쳐 시작)
		 */
		var exportImage = function(_Imgs, _Grids, _Idx){
			var gridLength = _Grids.length;

			GMXMAP["isExporting"] = true;
			$("#mapExportWrap").find("button.exportBtn").prop("disabled", true);

			var size = GMXMAP.getSize();
			var center = GMXMAP.getView().getCenter();
			var viewResolution = GMXMAP.getView().getResolution();

			GMXMAP.once("rendercomplete", function(){
				var mapCopyCanvas = document.createElement("canvas");
				mapCopyCanvas.width = GMXMAP.getSize()[0];
				mapCopyCanvas.height = GMXMAP.getSize()[1];

				var mapContext = _CollectMapResource(mapCopyCanvas);

				_Imgs.push(mapCopyCanvas.toDataURL("image/jpeg"));

				var delay = setTimeout(function(){
					if(_StopInterval){
						if(_Imgs.length === 0){
							$("#loadingWrap").dialog("close");
						}else{
							$("#loadingWrap").find("#nowCnt").text("캡처된 " + _Imgs.length + "개의 이미지를 압축하고 있습니다.");
							generateZip(_Imgs);
							GMXMAP.addMapNotification("추출된 이미지가 잠시후 자동 다운로드 됩니다.", 3000);
						}
					}else{
						if((_Idx + 1) < gridLength){
							_Idx++;
							GMXMAP.setExtent(_Grids[_Idx].getGeometry().getExtent());
							exportImage(_Imgs, _Grids, _Idx);
						}else{
							$("#loadingWrap").find("#nowCnt").text("캡처된 " + _Imgs.length + "개의 이미지를 압축하고 있습니다.");
							generateZip(_Imgs);
							GMXMAP.addMapNotification("추출된 이미지가 잠시후 자동 다운로드 됩니다.", 3000);
						}
					}

					clearTimeout(delay);
					delay = null;
				}, 1000);

				$("#mapExportWrap").find("button.exportBtn").prop("disabled", false);
			});

			if(_Idx === -1){
				$("#loadingWrap").find("#nowCnt").text("전체 그리드를 캡처하고 있습니다.");
				GMXMAP.setExtent(Public.NMS.Grid.drawVector.getSource().getFeatures()[0].getGeometry().getExtent());
			}else{
				$("#loadingWrap").find("#nowCnt").text("총 " + _Grids.length + "개의 그리드 중 " + (_Idx + 1) + "번째 그리드를 캡처하고 있습니다.");
				GMXMAP.setExtent(_Grids[_Idx].getGeometry().getExtent());
			}

			GMXMAP["isExporting"] = false;
		}

		/**
		 * 1. 지도를 전체영역으로 이동합니다.
		 */
		$(".contentWrapper").find("#moveSiteExtentBtn").click(function(){
			GMXMAP.setExtent(_GMXMAP_EXTENT_);
			GMXMAP.getView().setZoom(GMXMAP.getView().getZoom() - 1);
		});

		/**
		 * 2. 영역 그리기를 시작합니다.
		 */
		$(".contentWrapper").find("#drawBoxtBtn").click(function(){
			Public.NMS.Grid.Start();
			GMXMAP.addMapNotification("지도에서 원하시는 영역을 그려주세요.", 3000);
		});

		/**
		 * 3. 그리드를 생성합니다.
		 */
		$(".contentWrapper").find("#generateGridBtn").click(function(){
			if(Public.NMS.Grid.drawVector instanceof ol.layer.Vector){
				if(Public.NMS.Grid.drawVector.getSource().getFeatures().length > 0){
					var gridSize = Number(prompt("생성할 그리드 갯수를 입력하세요.\n\n최소 : 5 / 최대 : 30"));
					if(_common.utils.isNumber(gridSize) && gridSize > 4 && gridSize < 31){
						var extent = Public.NMS.Grid.drawVector.getSource().getFeatures()[0].getGeometry().getExtent();
						var features = Spatial.generateGrid(extent, gridSize);

						Public.NMS.Grid.gridVector.getSource().clear();
						Public.NMS.Grid.gridVector.getSource().addFeatures(features);

						GMXMAP.addMapNotification(gridSize + "X" + gridSize + " 그리드가 생성되었습니다.", 3000);
					}else{
						alert("그리드는 최소 5, 최대 30 까지 입력하실 수 있습니다.");
						return false;
					}
				}else{
					alert("그리드를 먼저 생성해주세요.");
					return false;
				}
			}else{
				alert("그리드를 먼저 생성해주세요.");
				return false;
			}
		});

		/**
		 * 4. 공간정보 미포함 그리드를 제거합니다.
		 *
		 * turf.booleanIntersects 로직을 이용하더라도 포인트는 클러스터링으로 인하여 오정보가 표출될 수 있습니다.
		 * 따라서 해당 로직을 완벽하게 개선하려면 클러스터링을 임시 제거하여 포인트 전체를 다시 불러오거나,
		 * 각각의 그리드를 서버에 요청하여 공간분석 함수를 이용하는 로직으로 개선해야 합니다.
		 *
		 * 두 방법 모두 퍼포먼스는 상당히 떨어지기 때문에,
		 * 포인트가 아닌 라인, 폴리곤을 하나라도 보이게 활성화 하여 해당 기능을 이용하는 편이 좋습니다.
		 */
		$(".contentWrapper").find("#moveGridExtentBtn").click(function(){

			if(Public.NMS.Grid.gridVector != null){
				if(Public.NMS.Grid.gridVector instanceof ol.layer.Vector){
					var layers = GMXMAP.getAllVisibleVectorLayers();
					var grids = Public.NMS.Grid.gridVector.getSource().getFeatures();
					grids.sort(function(a, b){ return a.get("index") - b.get("index"); });

					if(grids.length > 0){
						GMXMAP.addMapNotification("공간정보가 포함되어있지 않는 그리드를 제거합니다.", 3000);

						var reIndex = 1;
						for(var gridFeatureIndex in grids){
							var isContains = false;
							var gridIndex = grids[gridFeatureIndex].get("index");
							var gridExtent = grids[gridFeatureIndex].get("extent");
							var gridPolygon = turf.polygon(grids[gridFeatureIndex].getGeometry().getCoordinates());

							for(var layerIndex in layers){
								var features = layers[layerIndex].getSource().getFeatures();

								for(var featureIndex in features){
									var feature = features[featureIndex];

									var featureGeom = feature.getGeometry();
									var featureGeomType = featureGeom.getType();
									var featureGeomCoord = featureGeom.getCoordinates();

									var turfFeature = null;
									if("turf" in window){
										if(featureGeomType.contains("Point")) turfFeature = turf.point(featureGeomCoord);
										if(featureGeomType.contains("Line")){
											if(featureGeomType.contains("Multi")){
												turfFeature = turf.multiLineString(featureGeomCoord);
											}else{
												turfFeature = turf.lineString(featureGeomCoord);
											}
										}
										if(featureGeomType.contains("Polygon")){
											if(featureGeomType.contains("Multi")){
												turfFeature = turf.multiPolygon(featureGeomCoord);
											}else{
												turfFeature = turf.polygon(featureGeomCoord);
											}
										}
										if(turf.booleanIntersects(gridPolygon, turfFeature)){
											isContains = true;
											break;
										}
									}else{
										if(ol.extent.containsExtent(gridExtent, feature.getGeometry().getExtent())){
											isContains = true;
											break;
										}
									}

								}

								if(isContains) break;
							}

							if(isContains){
								grids[gridFeatureIndex].set("index", reIndex);
								grids[gridFeatureIndex].getStyle().getText().setText(String(reIndex));

								reIndex++;
							}else{
								Public.NMS.Grid.gridVector.getSource().removeFeature(grids[gridFeatureIndex]);
							}
						}
					}else{
						alert("그리드를 먼저 생성해주세요.");
						return false;
					}

				}else{
					alert("그리드를 먼저 생성해주세요.");
					return false;
				}
			}else{
				alert("그리드를 먼저 생성해주세요.");
				return false;
			}

		});

		/**
		 * 5. PDF로 추출합니다.
		 */
		$(".contentWrapper").find("#gridExportBtn").click(function(){

			if(Public.NMS.Grid.gridVector instanceof ol.layer.Vector){
				var grids = Public.NMS.Grid.gridVector.getSource().getFeatures();
				if(grids.length > 0){
					grids.sort(function(a, b){ return a.get("index") - b.get("index"); });
					createLoadingWrap();
					exportImage(new Array(), grids, -1);
				}else{
					alert("그리드를 먼저 생성해주세요.");
					return false;
				}
			}else{
				alert("그리를 먼저 생성해주세요.");
				return false;
			}
		});

		/**
		 * 6. 모든 옵션을 초기화 합니다.
		 */
		$(".contentWrapper").find("#stopGridExportBtn").click(function(){
			if(confirm("모든 작업을 초기화 하시겠습니까?")){
				if(("StopEvent" in Public) && ("function" === typeof Public.StopEvent)){
					Public.StopEvent();
				}
			}
		});

	}
}

})(GMXMAP, GMXLAYER, _GMXMAP_DEF_PROXY_, _GMXMAP_EXTENT_, turf);