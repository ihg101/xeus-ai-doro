/**
 * 지도 객체 입니다.
 * 순수 OL MAP 객체를 이용하며,
 * 커스텀으로 필요한 추가 메소드를 구현합니다.
 *
 * @author 이주영
 */
"use strict";

if(window.GMXMAP == null) var GMXMAP = null;

window.onload = function(){

	/**
	 * 지도 객체를 생성합니다.
	 */
	if(GMXMAP == null) GMXMAP = new ol.Map({
		controls : ol.control.defaults().extend([]),
		renderer: "webgl",
		logo : false,
		target : "map",
		layers : [],
		interactions: ol.interaction.defaults({
			dragPan: false,
			shiftDragZoom: false,
			mouseWheelZoom: false,
			doubleClickZoom: false,
			altShiftDragRotate: false
		}).extend([
		    new ol.interaction.DragPan({ kinetic: false }),
		    new ol.interaction.MouseWheelZoom({ duration: 0 })
		]),
		view : new ol.View({
			projection : ol.proj.get("EPSG:5186"),
			center  : _GMXMAP_CENTER_,
			zoom    : _GMXMAP_DEF_ZOOM_,
			minZoom : _GMXMAP_MIN_ZOOM_,
			maxZoom : _GMXMAP_MAX_ZOOM_
		})
	});

	/**
	 * 렌더링 시작 전 레이어를 추가합니다.
	 */
	GMXMAP.once("postrender", function(event) {
		/*var _Daum = new DaumMap().createMapLayer({ lyrNm : "카카오그림지도", visibleYn : true, lyrZidx : -9999, grpNm : "배경지도" });
		_Daum.setOpacity(0.5);

		GMXMAP.addLayer(_Daum);*/
	});

	/**
	 * 지도의 현재 축척을 계산합니다.
	 */
	GMXMAP.getScale = function(){
		var resolution = GMXMAP.getView().getResolution();
		var units = GMXMAP.getView().getProjection().getUnits();
		var dpi = 25.4 / 0.28;
		var mpu = ol.proj.Units.METERS_PER_UNIT[units];
		var inchesPerMeter = 39.37;
		var scale = Math.round(resolution * mpu * inchesPerMeter * dpi);

		return scale;
	}

	/**
	 * 입력받은 축척을 Resolution 으로 변환하여 지도에 적용합니다.
	 */
	GMXMAP.setScale = function(_Scale){
		var units = GMXMAP.getView().getProjection().getUnits();
		var dpi = 25.4 / 0.28;
		var mpu = ol.proj.Units.METERS_PER_UNIT[units];
		var inchesPerMeter = 39.37;
		var resolution = parseFloat(_Scale) / (mpu * inchesPerMeter * dpi);

		GMXMAP.getView().setResolution(resolution);
	}

	/**
	 * 지도의 현재 Extent 값을 리턴합니다.
	 */
	GMXMAP.getExtent = function(){
		return GMXMAP.getView().calculateExtent(GMXMAP.getSize());
	}

	/**
	 * 지도를 파라미터 Extent 값으로 맞춥니다.
	 */
	GMXMAP.setExtent = function(_ExtentArray){
		GMXMAP.getView().fit(_ExtentArray , GMXMAP.getSize());
	}

	/**
	 * 지도의 현재 축척을 이용하여 스케일바에 표현합니다.
	 */
	GMXMAP.setScaleText = function(){
		$(".scaleText").text($(".ol-scale-line-inner").text());

		var $scale = $(".ol-scale-line").find(".ol-scale-line-inner-text");
		if($scale.length === 0){
			$scale = $(".ol-scale-line-inner").clone();
			$scale.removeClass("ol-scale-line-inner");
			$scale.addClass("ol-scale-line-inner-text");
			$scale.width(100);
			$scale.css({ "font-size" : "12px", "color" : $(".scaleText").css("color"), "text-align" : "center" });

			$(".ol-scale-line").prepend($scale);
		}

		var timeout = setTimeout(function(){
			$scale.text("1 : " + Math.floor(GMXMAP.getScale()).toLocaleString("ko-KR"));

			$("#scaleBox").find(".ol-scale-line").find(".ol-scale-line-inner-text").css("cursor", "pointer").off("click").click(function(){
				var scale = Number(prompt("축척(최소 100 ~ 최대 1,000,000)을 입력해 주세요.").trim());
				if(scale < 100 || scale > 1000000){
					alert("축척값은 최소 100 ~ 최대 1,000,000 까지 지원합니다.");
					return false;
				}

				GMXMAP.setScale(scale);
			});

			clearTimeout(timeout);
			timeout = null;
		}, 150);
	};

	/**
	 * 지도의 현재 축척과 위치를 로컬 스토리지에 저장합니다.
	 */
	GMXMAP.setMapPosition = function(){
		if(localStorage){
			var timeout = setTimeout(function(){
				localStorage["GMXMAP@centerX"] = GMXMAP.getView().getCenter()[0];
				localStorage["GMXMAP@centerY"] = GMXMAP.getView().getCenter()[1];
				localStorage["GMXMAP@zoom"] = GMXMAP.getView().getZoom();

				clearTimeout(timeout);
				timeout = null;
			}, 300);
		}
	};


	/**
	 * 확대 축소 변경 감지 이벤트 입니다.
	 *
	 * _FreezingTime 시간동안 Mouse Wheel 이벤트는 무효화 됩니다.
	 * 약 300ms 이하으로 설정할 경우 Wheel 조작 시간보다 빠르므로 효과가 미비합니다.
	 * 1초(1000ms) 이상 설정할 경우 Wheel 조작 이후 늦게 로드되는 사용자 경험을 유발할 수 있습니다.
	 *
	 * 최소 300ms 최대 700ms 수준의 값을 권장하며 기본 300ms 입니다.
	 */
	var _FreezingTime = 300;
	var _ResolutionLock = true;
	var _ResolutionChangeCount = 0;
	GMXMAP.getView().on("change:resolution", function(){
		GMXMAP.setMapPosition();
		GMXMAP.setScaleText();

		if(!GMXMAP.isExporting && _ResolutionChangeCount === 0) GMXMAP.redrawAllVisibleVector();

		_ResolutionChangeCount++;

		var _CopyResolutionChangeCount = _ResolutionChangeCount;
		var _ResolutionLockTimeout = setTimeout(function(){
			if((_ResolutionChangeCount > 1) && (_CopyResolutionChangeCount === _ResolutionChangeCount)){
				GMXMAP.redrawAllVisibleVector();
				_ResolutionChangeCount = 0;
			}

			clearTimeout(_ResolutionLockTimeout);
			_ResolutionLockTimeout = null;
		}, _FreezingTime);

		_ResolutionLock = true;
		var timeout = setTimeout(function(){
			_ResolutionLock = false;

			clearTimeout(timeout);
			timeout = null;
		}, 100);
	});

	/**
	 * 지도 이동 시작 이벤트 입니다.
	 */
	GMXMAP.on("movestart", function(){
		GMXMAP["isMoving"] = true;
	});

	/**
	 * 지도 이동 완료 이벤트 입니다.
	 *
	 * 참고) isMoving 값 셋팅시 딜레이가 없을 경우 ContextMenu 좌클릭시 무조건 즉시 열리게 됩니다.
	 * 즉. Drag 이후 마우스 커서 위치에 공간정보가 있을 경우 무조건 팝업이 생성됩니다.
	 */
	GMXMAP.on("moveend", function(){
		GMXMAP.setMapPosition();

		if(!GMXMAP.isExporting && !_ResolutionLock) GMXMAP.redrawAllVisibleVector();

		var timeout = setTimeout(function(){
			_ResolutionLock = false;
			GMXMAP["isMoving"] = false;

			clearTimeout(timeout);
			timeout = null;
		}, 100);
	});

	GMXMAP.on("pointermove", function(evt){
		$("#lonLatBox").find(".lonText").text(Spatial.convertProjection(evt.coordinate, "EPSG:5186", "EPSG:4326")[0]);
		$("#lonLatBox").find(".latText").text(Spatial.convertProjection(evt.coordinate, "EPSG:5186", "EPSG:4326")[1]);
	});

	/**
	 * 지도 클릭 이벤트 입니다.
	 */
	GMXMAP.on("click", function(evt){
//		console.log(Spatial.convertProjection(evt.coordinate, "EPSG:5186", "EPSG:4326"));
	});

	/**
	 * 레이어 한글명 또는 테이블명으로 Vector 객체를 리턴합니다.
	 */
	GMXMAP.getLayer = function(idOrNm){
		var list = GMXMAP.getLayers().getArray();
		for(var i=0; i<list.length; i++){
			if(list[i].get("id") === idOrNm || list[i].get("name") === idOrNm){
				return list[i];
			}
		}
	};

	/**
	 * <pre>
	 * 현재 보이기 여부가 활성화 되어 있는 레이어의 Feature 를 모두 재생성합니다.
	 *
	 * 다만, 현재 공간 편집중인 레이어는 전체를 로드하였기 때문에 재생성 대상에서 제외합니다.
	 * 제외되는 조건은 공간편집 모듈의 버전이 2.0 이상일 경우만 해당됩니다.
	 *
	 *
	 * 주의 1) 지도 이동, 레벨 변경시 WFS를 강제 리로드하기 위해 구현되었습니다.
	 * 기본 strategy : ol.loadingstrategy.? 옵션을 사용할 경우 해당 함수를 이용하지 말아야 합니다. (중복 호출)
	 *
	 * 또한 ol.loadingstrategy.? 옵션을 사용하지 않기 때문에,
	 * bbox와 같은 옵션은 source 객체의 Extent 가 아닌 현재 지도의 Extent 를 이용해야 합니다.
	 *
	 * 예) GMXMAP.getView().calculateExtent()
	 *
	 *
	 * 주의 2) 하드코딩을 지양하기 위하여,
	 * 현재 보여지는 레이어 중, 일부 기능과 관련된 Vector 를 위해 ID가 부여되지 않은 레이어는 clear 처리에서 제외됩니다.
	 *
	 * 예) 거리, 면적 기능이나 순찰감시의 Vector 와 같은 Public.OOO.Vector 레이어가 해당됩니다.
	 * </pre>
	 */
	GMXMAP.redrawAllVisibleVector = function(){
		var list = GMXMAP.getLayers().getArray();
		var length = list.length;
		for(var i=0; i<length; i++){
			var layerId = list[i].get("id");
			if(list[i].getVisible()){
				if(_common.utils.isNullAndEmpty(layerId)) continue;
				if(layerId === "targetLayer") continue;

				if(GMXMAP.getLayer(layerId) != null){

					if((GMXMAP["GeometryEditorVersion"] >= 2.0) && (GMXMAP.isEditing === true) && (GMXMAP.editLayerId === layerId)) continue;

					var vectorSource = GMXMAP.getLayer(layerId).getSource();

					if(GMXMAP.getLayer(layerId).get("geomType") === "P"){
						if("source" in vectorSource){
							vectorSource.source.refresh({ force: true });
						}
					}else{
						vectorSource.refresh({ force: true });
					}
				}
			}
		}
	};

	/**
	 * 레이어 한글명 또는 테이블명으로 Vector 객체의 보이기 여부를 설정합니다.
	 * 만약, 한글명 또는 테이블명만 파라미터로 전달 할 경우 보이기 여부를 자동 토글합니다.
	 */
	GMXMAP.setLayerVisible = function(idOrNm, toggleVal){
		var isNotBoolean = false;
		if(typeof toggleVal !== "boolean") isNotBoolean = true;

		var list = GMXMAP.getLayers().getArray();
		for(var i=0; i<list.length; i++){
			if(list[i].get("id") === idOrNm || list[i].get("name") === idOrNm){
				if(isNotBoolean){
					if(list[i].getVisible()){
						toggleVal = false;
					}else{
						toggleVal = true;
					}
				}

				list[i].setVisible(toggleVal);

				if(localStorage) localStorage[list[i].get("id")] = toggleVal;

				break;
			}
		}
	};

	/**
	 * 모든 Vector 객체의 보이기 여부를 비활성화 합니다.
	 */
	GMXMAP.setAllLayerUnVisible = function(){
		var list = GMXMAP.getLayers().getArray();
		for(var i=0; i<list.length; i++){
			var layerProp = list[i].getProperties();
			if("geomType" in layerProp){
				var geomType = layerProp.geomType;
				if(geomType === "P" || geomType === "L" || geomType === "G"){
					list[i].setVisible(false);
				}
			}else{
				continue;
			}
		}
	};

	/**
	 * 보이기 여부가 활성화된 모든 Vector 레이어를 리턴합니다.
	 */
	GMXMAP.getAllVisibleVectorLayers = function(){
		var result = new Array();

		var list = GMXMAP.getLayers().getArray();
		for(var i=0; i<list.length; i++){
			var layerProp = list[i].getProperties();
			if("geomType" in layerProp){
				var geomType = layerProp.geomType;
				if(geomType === "P" || geomType === "L" || geomType === "G"){
					if(list[i].getVisible()) result.push(list[i]);
				}
			}else{
				continue;
			}
		}

		return result;
	};

	/**
	 * 테이블명으로 해당 테이블의 컬럼정보를 리턴합니다.
	 */
	GMXMAP.getColumnInfo = function(schema, table){
		var result = new Array();

		_common.callAjax("/GMT_column/getColumnInfo.json", { schema: schema, table : table }, function(json){
			result = json.result;
		}, false);

		return result;
	};

	/**
	 * 컬럼 데이터 타입 정보를 서버 전용데이터로 포멧팅 합니다.
	 */
	GMXMAP.convertColumnTypeData = function(column){
		var param = {};

		for(var i=0; i<column.length; i++){
			param["typ[" + i + "][col]"] = column[i].colId;
			param["typ[" + i + "][nm]"] = column[i].colNm;
			if(column[i].dataType !== "text" && !column[i].dataType.contains("character")){
				param["typ[" + i + "][typ]"] = "number";
			}else{
				param["typ[" + i + "][typ]"] = "string";
			}
		}

		return param;
	};

	/**
	 * 중심점 위치에 Pulse 객체를 추가합니다.
	 */
	GMXMAP.addPulse = function(center, moveYn, repeat){
		if(moveYn){
			GMXMAP.getView().setCenter(center);
			GMXMAP.getView().setZoom(19);
		}

		if(!_common.utils.isNumber(repeat)) repeat = 3; repeat++;

		for(var i=0; i<repeat; i++){
			var timeout = setTimeout(function(){
				var feature = new ol.Feature(new ol.geom.Point(center));
				feature.setStyle(new ol.style.Style({
					image: new ol.style.Circle({
						radius: 30,
						snapToPixel: false,
						stroke: new ol.style.Stroke({
							color: "red",
							width: 2
						})
					})
				}));

				GMXMAP.animateFeature(feature, new ol.featureAnimation.Zoom({
					fade: ol.easing.easeOut,
					duration: 3000,
					easing: ol.easing["easeOut"]
				}));

				feature = null;

				clearTimeout(timeout);
				timeout = null;
			}, i * 1000);
		};
	}

	/**
	 * 객체 위치에 Pulse 객체를 추가합니다.
	 */
	GMXMAP.addHighLight = function(feature, moveYn, repeat){
		var type = feature.getGeometry().getType();
		if(moveYn){
			if(type === "Point"){
				GMXMAP.addPulse(feature.getGeometry().getCoordinates(), moveYn, repeat);
				return;
			}else{
				GMXMAP.getView().fit(feature.getGeometry().getExtent());
				if(GMXMAP.getView().getZoom() > 19.3) GMXMAP.getView().setZoom(19);
			}
		}

		if(!_common.utils.isNumber(repeat)) repeat = 3;

		var _feature = feature.clone();
		_feature.setStyle(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "red",
				width: 5
			})
		}));

		GMXMAP.animateFeature(_feature, new ol.featureAnimation.Show({
			repeat: repeat,
			duration: 1000,
			amplitude: 10,
			fade: ol.easing["easeOut"],
			easing: ol.easing["easeOut"]
		}));

		_feature = null;
	}

	/**
	 * 데이터 값을 컬럼 타입과 비교하여 캐스팅 합니다.
	 * 만약 타입 캐스팅 중 문제가 발견될 경우 경고창을 생성합니다.
	 */
	GMXMAP.validData = function(column, data){
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

	GMXMAP.reloadLayerData = function(_LayerId){
		if(GMXMAP.getLayer(_LayerId) != null){
			var vectorSource = GMXMAP.getLayer(_LayerId).getSource();

			if(GMXMAP.getLayer(_LayerId).get("geomType") === "P"){
				if("source" in vectorSource){
					vectorSource.source.refresh({ force: true });
				}
			}else{
				vectorSource.refresh({ force: true });
			}
		}
	}

	/**
	 * 레이어 데이터 로드 후 지도에 Vector 객체를 생성합니다.
	 */
	GMXLAYER.loadData().loadLayer(GMXMAP);

	/**
	 * 범례를 생성합니다.
	 */
	GMXLEGEND.createLegends().setVectorIndex();

	 /*
	 * 브라우저 리사이즈 이벤트를 지정합니다.
	 */
	$(window).resize(function(){
		var timeout = setTimeout(function(){
			GMXMAP.updateSize();
			clearTimeout(timeout);
			timeout = null;
		}, 500);
	});

}