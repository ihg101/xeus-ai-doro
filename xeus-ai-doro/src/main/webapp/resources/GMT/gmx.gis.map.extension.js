/**
 * 지도의 각종 Extension 객체를 추가합니다.
 *
 * @auther 이주영
 */
"use strict";
(function(GMXMAP, GMXLAYER){

if(GMXMAP != null && GMXLAYER != null){
	if(GMXMAP instanceof ol.Map){

		GMXMAP["GeometryEditorVersion"] = 1.0;

		GMXMAP["defaultZoom"] = _GMXMAP_DEF_ZOOM_;
		GMXMAP["defaultCenter"] = _GMXMAP_DEF_CENTER_;
		GMXMAP["defaultMinZoom"] = _GMXMAP_MIN_ZOOM_;
		GMXMAP["defaultMaxZoom"] = _GMXMAP_MAX_ZOOM_;
		GMXMAP["defaultProjection"] = GMXMAP.getView().getProjection();

		/**
		 * 객체 검색 객체를 생성합니다.
		 *
		 * 현재 사용되지 않습니다.
		 *
		 * @Deprecated
		 */
		/*GMXMAP["featureSearch"] = new ol.control.SearchFeature({
			label: "객체 검색",
			placeholder: "검색어를 입력하세요.",
			source: GMXMAP.getLayer("geomex_sample3").getSource(),
			property: "sobong_nm"
		});
		GMXMAP["featureSearch"].on("select", function(e){
			var extent = null;

			if(e.search.getGeometry().getType() === "Point"){

			}else if(e.search.getGeometry().getType() === "MultiPolygon"){
				if(e.search.getGeometry().getPolygons().length > 0){
					extent = e.search.getGeometry().getPolygons()[0].getExtent();
				}
			}else if(e.search.getGeometry().getType() === "MultiLineString"){
				if(e.search.getGeometry().getLineStrings().length > 0){
					extent = e.search.getGeometry().getLineStrings()[0].getExtent();
				}
			}

			GMXMAP.getView().fit(extent);
		});
		GMXMAP.addControl(GMXMAP["featureSearch"]);*/

		/**
		 * 배경지도 비교 슬라이드를 생성합니다.
		 *
		 * 현재 사용되지 않습니다.
		 *
		 * @Deprecated
		 */
	    /*var Swipe = new ol.control.Swipe();
	    GMXMAP.addControl(Swipe);
	    Swipe.addLayer(GMXMAP.getLayer("daum_map"));
	    Swipe.addLayer(GMXMAP.getLayer("daum_tile"), true);*/

		/**
		 * 지도를 제어하는 기본 바를 생성합니다.
		 * 기본 controlBar 생성은 지도 생성 후에 생성해야 합니다.
		 */
		//GMXMAP["controlBar"] = new ol.control.Bar({ className : "mainBar" });
		GMXMAP["controlBar"].addControl(new ol.control.Bar({
			group: false,
			controls: [
				new ol.control.Button({
					className: "mainControl acTarget",
					html: "<span class='controller legendB'><i class='fas fa-list'></i></span>",
					title: "범례",
					handleClick: function() {
						if($("#legendWrap").dialog("isOpen")){
							$("#legendWrap").dialog("close");
							var timeout = setTimeout(function(){
								$(".legendB").parent().removeClass("active");
								clearTimeout(timeout);
								timeout = null;
							}, 100);
						}else{
							$("#legendWrap").dialog( "option", "position", { my: "left top", at: "left top", of: $("#map")} );
							$("#legendWrap").dialog("open");
						}
					}
				}),
//				new ol.control.Button({
//					className: "mainControl",
//					html: "<span class='controller commonSearch'><i class='fas fa-search'></i></span>",
//					title: "공간정보검색",
//					handleClick: function() {
//
//						if($("#cctvSearchInfoWrap").dialog("isOpen")){
//							$("#cctvSearchInfoWrap").dialog("close");
//						}
//
//						if($("#featureSearchInfoWrap").dialog("isOpen")){
//							$("#featureSearchInfoWrap").dialog("close");
//							var timeout = setTimeout(function(){
//								$(".commonSearch").parent().removeClass("active");
//								clearTimeout(timeout);
//								timeout = null;
//							}, 100);
//						}else{
//							if("createCommonFeatureSearch" in GMXMAP) GMXMAP.createCommonFeatureSearch();
//						}
//					}
//				}),
				/*new ol.control.Button({
					className: "mainControl",
					html: "<span class='controller cctvSearch'></span>",
					title: "CCTV검색",
					handleClick: function() {
						//공간정보검색이 열려있으면 닫아야한다
						if($("#featureSearchInfoWrap").dialog("isOpen")){
							$("#featureSearchInfoWrap").dialog("close");
							var timeout = setTimeout(function(){
								$(".commonSearch").parent().removeClass("active");
								clearTimeout(timeout);
								timeout = null;
							}, 100);
						}

						_common.callAjax("/cctv/getSearchView.do", {}, function(view){
							$("#cctvSearchInfoWrap").dialog("close").html(view).dialog({
								title : "CCTV검색",
							    width: 500,
								height: $("#map").height(),
								position: {
									my: "left top",
									at: "left top",
									of: $("#map")
								},
								open: function(){

									if($(".cctvSearch").length > 0 && $(".cctvSearch").parent().length > 0){
										$(".cctvSearch").parent().addClass("active");
									}

									$(this).parent().find(".ui-dialog-titlebar").data("isFullWidth", false).off("dblclick").dblclick(function(){
										var fullScreen = $(this).data("isFullWidth");
										if(!fullScreen){
											$("#cctvSearchInfoWrap").dialog("option", "width", $("#map").width());
											$("#cctvSearchInfoWrap").dialog("option", "height", $("#map").height());
											$(this).data("isFullWidth", true);
										}else{
											$("#cctvSearchInfoWrap").dialog("option", "width", "650px");
											$("#cctvSearchInfoWrap").dialog("option", "height", $("#map").height());
											$(this).data("isFullWidth", false);
										}
									});

								},
								close: function(){
									if($(".cctvSearch").length > 0 && $(".cctvSearch").parent().length > 0){
										$(".cctvSearch").parent().removeClass("active");
									}
								}
							}).dialog("open");
						}, false);

					}
				}),*/
				new ol.control.Button({
					className: "mainControl",
					html: "<span class='controller home'></span>",
					title: "홈",
					handleClick: function() {
						GMXMAP.getView().setZoom(GMXMAP.defaultZoom);
						GMXMAP.getView().setCenter(GMXMAP.defaultCenter);
						GMXMAP.setMapPosition();
					}
				}),
				new ol.control.Button({
					className: "mainControl",
					html: "<span class='controller clear'><i class='fas fa-sync-alt'></i></span>",
					title: "정리",
					handleClick: function() {
						if(GMXMAP.measure) GMXMAP.measure.clear().disable();
						if(GMXMAP.contextMenuVector) GMXMAP["contextMenuVector"].getSource().clear();
					}
				}),
				new ol.control.Button({
					className: "mainControl acTarget",
					html: "<span class='controller move'></span>",
					title: "이동",
					handleClick: function() {
						if(GMXMAP.measure) GMXMAP.measure.clear().disable();
					}
				}),
				new ol.control.Button({
					className: "mainControl",
					html: "<span class='controller prev'><i class='fas fa-arrow-left'></i></span>",
					title: "이전",
					handleClick: function() {
						if(GMXMAP.getPrev) GMXMAP.getPrev();
					}
				}),
				new ol.control.Button({
					className: "mainControl",
					html: "<span class='controller next'><i class='fas fa-arrow-right'></i></span>",
					title: "다음",
					handleClick: function() {
						if(GMXMAP.getNext) GMXMAP.getNext();
					}
				}),
				new ol.control.Button({
					className: "mainControl acTarget",
					html: "<span class='controller length'></span>",
					title: "거리",
					handleClick: function() {
						if(GMXMAP.measure){
							if(GMXMAP.measure.isActive()){
								GMXMAP.measure.clear().disable();

								var timeout = setTimeout(function(){
									$(".mainControl").find("span.controller.length").parent().removeClass("active");
									clearTimeout(timeout);
									timeout = null;
								}, 100);
							}else{
								GMXMAP.measure.clear().disable().enable("distance");
							}
						}
					}
				}),
				new ol.control.Button({
					className: "mainControl acTarget",
					html: "<span class='controller area'></span>",
					title: "면적",
					handleClick: function() {
						if(GMXMAP.measure){
							if(GMXMAP.measure.isActive()){
								GMXMAP.measure.clear().disable();

								var timeout = setTimeout(function(){
									$(".mainControl").find("span.controller.area").parent().removeClass("active");
									clearTimeout(timeout);
									timeout = null;
								}, 100);
							}else{
								GMXMAP.measure.clear().disable().enable("area");
							}
						}
					}
				}),
//				new ol.control.Button({
//					className: "mainControl acTarget",
//					html: "<span class='controller sketch'></span>",
//					title: "스케치",
//					handleClick: function() {
//						if(GMXMAP.measure) GMXMAP.measure.clear().disable();
//						if(GMXMAP["isEditing"]){
//							if(GMXMAP.stopGeometryEdit()){
//								var timeout = setTimeout(function(){
//									$(".mainControl").find("span.controller.sketch").parent().removeClass("active");
//									clearTimeout(timeout);
//									timeout = null;
//								}, 100);
//							};
//						}else{
//							GMXMAP.addGeometryEditor(GMXMAP["sketchLayer"]);
//						}
//					}
//				}),
				new ol.control.Button({
					className: "mainControl",
					html: "<span class='controller export'></span>",
					title: "지도 저장",
					handleClick: function() {
						if(GMXMAP.measure) GMXMAP.measure.clear().disable();

						GMXMAP.openExportDialog();
					}
				}),
//				new ol.control.Button({
//					className: "mainControl acTarget",
//					html: "<span class='controller roadview'></span>",
//					title: "로드뷰",
//					handleClick: function() {
//						if("DaumRoadView" in GMXMAP){
//							try{
//								if(GMXMAP["DaumRoadView"].isAlive()) return false;
//							}catch(e){
//								console.error(e);
//							}
//
//							if(window._RoadViewWindow){
//								window._RoadViewWindow.focus();
//							}else{
//								try{
//									GMXMAP["DaumRoadView"].createMarker().createRoadView();
//								}catch(e){
//									console.error(e);
//									alert("로드뷰를 생성할 수 없습니다.\n\n네트워크 환경을 확인해 주세요.");
//									GMXMAP["DaumRoadView"].destroyRoadView();
//								}
//							}
//						}
//					}
//				}),
			]
		}));
		GMXMAP.addControl(GMXMAP["controlBar"]);
		
		function createAILayer(layerId, labelKo, btnId, cssClass, isHeatMap) {
			
			var $btn = $(`#${btnId}`);
			var isVisible = $btn.hasClass('active');
	    	
			
			if ( isHeatMap) {
				isVisible = false;
			} else {
				$btn.toggleClass("active", !isVisible);
			}
			
			if(labelKo === "EOCS") {
				if($btn.hasClass('active')) {
					$("#eocsListPopup").dialog({
						title: "EOCS 리스트",
						width: 720,
						height : 720
						,open: function(){
							$("#eocsListPopup").dialog({position:{
								my: "right top",
								at: "right-60 top+56",
								of: $("#map")
							}});
							EOCS.setData(0);
						}, close: function(){
							$btn.removeClass("active");
						}
					});
				} else {
					if($("#eocsListPopup").dialog("isOpen")) {
						$("#eocsListPopup").dialog("close");
					}
				}
			} else {
				// 이미 등록된 경우 → On/Off
				if (GMXLAYER.LayerList[layerId]) {
					var layers = GMXMAP.getLayers().getArray();
					var targetLayer = layers.find(function (l) {
						return l.get("id") === layerId;
					});
					
					targetLayer.getSource().clear();
					GMXMAP.removeLayer(targetLayer);
					delete GMXLAYER.LayerList[layerId];
				}
				
				if (isVisible) return;
				// 등록되지 않은 경우 → LayerList에 등록 + 로드
				GMXLAYER.LayerList[layerId] = {
						layer: {
							tblId: layerId,
							lyrZidx: 20,
							lyrTyp: "P",
							visibleYn: true,
							layerNm: labelKo,
							layerEnm: layerId
						},
						group: {
							mgrSeq: 1,
							grpZidx: 1
						}
				};
				
				GMXLAYER.loadLayer(GMXMAP);
				
			}
		}
				
		//상세정보 만들기
		function createTbody(data){
			if(!data || data.length === 0) {
				alert("데이터가 없습니다.");
				return;
			}
			
			var featureProp = data[0];
			var schema = "xeus";
			var layerId = "eocs_excavator";
			
			// 컬럼 정보 가져오기
			var columnInfo = GMXMAP.getColumnInfo(schema, layerId);
			
			// 기존 다이얼로그가 있으면 제거
			if($("#eocsDetailDialog").length > 0) {
				$("#eocsDetailDialog").remove();
			}
			
			var dialogHtml = '<div id="eocsDetailDialog" class="dialogWrap customScroll table_style">' +
				'<table>' +
				'<tbody></tbody>' +
				'<tfoot></tfoot>' +
				'</table>' +
				'</div>' +
				'</div>';
			
			// 다이얼로그 추가
			$("body").append(dialogHtml);
			
			var $tbl = $("#eocsDetailDialog").find("table");
			var $tbody = $tbl.find("tbody").html("");

			// featureProp의 각 속성을 테이블 행으로 생성
			for(var key in featureProp){
				var isHidden = false;
				// 숨겨야 할 필드들
				if(key === "geometry" || key === "_geometry" || key === "_annox" || key === "_annoy" || key === "_gid" || key === "_fid"  || key === "mgrNo"  || key === "dist"){
					isHidden = true;
				}

				var $th = $("<th>").width(100).text(key);
				var columnName = key; // 기본값은 키 이름

				// 컬럼 정보에서 한글 이름 가져오기
				if(columnInfo && columnInfo.length > 0) {
					for(var i=0; i<columnInfo.length; i++){
						// 카멜케이스를 snake_case로 변환하여 비교
						var snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
						if(key === columnInfo[i].colId || snakeCaseKey === columnInfo[i].colId){
							if(!_common.utils.isNullAndEmpty(columnInfo[i].colNm)){
								columnName = columnInfo[i].colNm;
								break;
							}
						}
					}
				}
				
				$th.text(columnName);

				var $td = $("<td>");
				$td.text(featureProp[key]);

				var $tr = $("<tr>").append($th).append($td);
				if(isHidden) $tr.addClass("hidden");

				$tbody.append($tr);
			}

			// 이미지
			var $th = $("<th id='featureImage'>").width(100).text("이미지");
			var $td = $("<td>");
			var $imageNm = $('<span>이미지 없음</span>');
			$td.append($imageNm);
			var $tr = $("<tr>").append($th).append($td);
			$tbody.append($tr);

			$("#eocsDetailDialog").dialog({
				title: "EOCS 상세 정보",
				width: 500,
				height: $("#map").height(),
				position: {
					my: "right top",
					at: "right-1 top",
					of: $("#map")
				},
				open: function(){
					$("#eocsDetailDialog").find("textarea").each(function(){
						$(this).height($(this)[0].scrollHeight);
					});
				},
				close: function(){
					$("#eocsDetailDialog").find("tbody").html("");
					$(this).dialog("destroy").remove();
				}
			}).dialog("open");
		}
		
		function handleLayerToggle(layerId, labelKo, btnId, cssClass) {
			
			if (  $(`#${btnId}`).length == 0 ) {				
				$(".mainBar").append(`<div class='${cssClass}'><button id='${btnId}'>${labelKo}</button></div>`);
			}
			
		    $(`#${btnId}`).off('click').click(function () {
				createAILayer(layerId, labelKo, btnId, cssClass);
		    });
		    
		}
		
		// 포트홀 버튼 추가
		handleLayerToggle("v_event_pothole", "포트홀", "potholeLyr", "pothole_box");

		// 크랙 버튼 추가
		handleLayerToggle("v_event_crack", "크랙", "crackLyr", "crack_box");
		
		//EOCS 버튼 추가
		if(_SITE_NAME_ !== "태백시"){
			handleLayerToggle("v_event_eocs", "EOCS", "eocsLyr", "eocs_box");
		}

		// 히트맵 버튼 추가
		//handleHeatMapToggle("히트맵", "heatmap", "is_heatmap");
		var $heatMapBtn = $('<div id="isHeatMap"><button>히트맵</button></div>');
		$heatMapBtn.css({
			position: 'absolute',
		    top: '0px',
		    right: '-491px',
		    display: 'flex'
		})
		$heatMapBtn.find('button').css({
		    'background-color': '#282828',
		    'color': 'white',
		    'font-weight': 'bold',
		    'font-size': '14px',
		    'padding': '10px 20px',
		    'border': 'none',
		    'display': 'flex',
		    'align-items': 'center',
		    'gap': '10px',
		    'cursor': 'pointer',
		    'height': '33px',
		    'line-height': '1'
		});
	
		$(".mainBar").append($heatMapBtn);
		$heatMapBtn.click(function(){
			if ( $(this).hasClass('active') ) {
				$(this).removeClass('active');
				$(this).find('button').css('background', '#282828');
			} else {
				$(this).addClass('active');
				$(this).find('button').css('background', 'red');
			}
			
			var $potholeLyrBtn = $('#potholeLyr');
			var $crackLyr = $('#crackLyr');
			
			if ( $potholeLyrBtn.hasClass('active') ) {
				createAILayer("v_event_pothole", "포트홀", "potholeLyr", "pothole_box", true);
				
			}
			
			if ( $crackLyr.hasClass('active') ) {
				createAILayer("v_event_crack", "크랙", "crackLyr", "crack_box", true);
			}
		});

		$(".mainControl").find("button").find(".move").parent().addClass("active");
		$(".mainControl").find("button").click(function(){
		$(".mainControl").find("button").not("[title=범례], [title=이동], [title=공간정보검색], [title=CCTV검색], [title=스케치], [title=로드뷰]").removeClass("active");

			if($(this).parent().hasClass("acTarget")) $(this).addClass("active");
		});

		/**
		 * 미리 보기 지도를 생성합니다.
		 */
		GMXMAP["overview"] = new ol.control.Overview({
			projection : GMXMAP.getView().getProjection(),
			minZoom: GMXMAP.getView().getMinZoom(),
			maxZoom: GMXMAP.getView().getMaxZoom(),
			panAnimation: false,
			align: "bottom-right",
			layers: [
				GMXLAYER.createTile("daum_map", { "grpNm" : "배경지도", "lyrNm" : "카카오 그림 지도", "visibleYn" : true })
			],
		});
		if(GMXMAP.getLayer("kais_sig_as") instanceof ol.layer.Vector) GMXMAP["overview"].getOverviewMap().addLayer(GMXMAP.getLayer("kais_sig_as"));
		if(GMXMAP.getLayer("kais_emd_as") instanceof ol.layer.Vector) GMXMAP["overview"].getOverviewMap().addLayer(GMXMAP.getLayer("kais_emd_as"));
	    GMXMAP.addControl(GMXMAP["overview"]);

	    GMXMAP.addInteraction( new ol.interaction.Synchronize({ maps: [GMXMAP["overview"].getOverviewMap()] }) );
	    //GMXMAP["overview"].getOverviewMap().addInteraction( new ol.interaction.Synchronize({ maps: [GMXMAP] }) );

	    /**
		 * 거리 면적 측정 객체를 생성합니다.
		 */
		GMXMAP["measure"] = GMXMAP.addCustomMeasure();


		/* 21-03-17 백유림 추가 축척 엘리먼트 */
		$("#map").append("<div id='scaleBox'></div>");
		$("#scaleBox").prepend("<div class='scaleText'></div>");

		/* 21-06-17 민동현 추가 경위도 엘리먼트 */
		$("#map").append("<div id='lonLatBox'></div>");
		$("#lonLatBox").prepend("<p class='lonText'></p>");
		$("#lonLatBox").prepend("<p class='latText'></p>");

		GMXMAP["scale"] = new ol.control.ScaleLine({
			target: document.getElementById("scaleBox"),
			minWidth: 50
		});
		GMXMAP.addControl(GMXMAP["scale"]);

		/* 21-06-14 백유림 추가 지도 각도 회전 기본 아이콘이 보이지 않는 오류가 있어, 대체하였습니다.*/
		$('.ol-rotate-reset .ol-compass').text('⬆');


		/**
		 * 이전/다음 객체를 생성합니다.
		 */
		GMXMAP.addCustomPrevNext();

		/**
		 * 즐겨찾는 위치 객체를 생성합니다.
		 */
		GMXMAP["bookmark"] = new ol.control.GeoBookmark({
			title : "즐겨찾기",
			placeholder : "즐겨찾는 위치명을 입력해주세요.",
			marks : {}
		});
		GMXMAP.addControl(GMXMAP["bookmark"]);

		GMXMAP["gpsSearch"] = new ol.control.SearchGPS({
			label : "좌표 검색",
			typing : 0
		});
		GMXMAP["gpsSearch"].on("select", function(e){
			GMXMAP.addPulse(e.search.coordinate, true);
		});
		GMXMAP.addControl(GMXMAP["gpsSearch"]);
		$(".ol-geoloc").hide();

		/**
		 * 알림창을 생성합니다.
		 */
		GMXMAP["mapNoti"] = new ol.control.Notification({ className: "mapNoti" });
		GMXMAP.addMapNotification = function(text, duration){
			if(!_common.utils.isNumber(Number(duration))) duration = 1000;

			text = text.replaceAll("<", "&lt;");
			text = text.replaceAll(">", "&gt;");

			var $textWrap = $("<h3></h3>").css({
				"padding" : "10px",
				"margin" : "0px"
			}).html(text);

			GMXMAP["mapNoti"].show($textWrap[0], duration);
		};
		GMXMAP.addControl(GMXMAP["mapNoti"]);
		$(".mapNoti").css("z-index", 9999).appendTo("body");

		/**
		 * 현재 축척을 계산합니다.
		 */
		GMXMAP.getScale = function(){
			return GMXMAP.getView().getResolution() * ol.INCHES_PER_UNIT[GMXMAP.getView().getProjection().getUnits()] * ol.DOTS_PER_INCHES;
		}

		/**
		 * 데이터를 갱신합니다.
		 */
		/*var reloadLayerData = function(_LayerId){
			var layerId = _LayerId;
			if(!_common.utils.isNullAndEmpty(GMXMAP["editLayerId"])){
				if (layerId === "user_sketch_geom"){
					GMXMAP.sketchLayerReload();
					return;
				}
			}

			if(GMXMAP.getLayer(layerId) != null){
				var source = GMXMAP.getLayer(layerId).getSource();
				var wfsParam = GMXLAYER.LayerList[layerId].layer._wfsParam;

				GMXLAYER.loadFeatures(source, wfsParam);
			}
		}*/
		var reloadLayerData = function(_LayerId){
			if(GMXMAP.getLayer(_LayerId) != null){
				if(GMXMAP["isEditing"] && (_LayerId === GMXMAP["editLayerId"])) return;

				var vectorSource = GMXMAP.getLayer(_LayerId).getSource();
				
				if(_LayerId === "v_mon_evet_excavator" || _LayerId === "v_mon_evet_fall" ||_LayerId === "v_mon_evet_blackice"){
					vectorSource.refresh({ force: true });
					return;
				} 
				
				if(GMXMAP.getLayer(_LayerId).get("geomType") === "P"){
					if("source" in vectorSource){
						vectorSource.source.refresh({ force: true });
					}
				}else{
					vectorSource.refresh({ force: true });
				}
			}
		}
		GMXMAP.reloadLayerData = function(_LayerId){ reloadLayerData(_LayerId); }

	}
}

})(GMXMAP, GMXLAYER);

var EOCS = {
		setData : function(offset){
			var str = "";
			var _param = {};
			_param["limit"] = 10;
			
			if(offset !== undefined && offset !== null){
				_param["offset"] = offset;
			} else{
				_param["offset"] = 0;
			}
			
			_common.callAjax("/eocs/getList.json", _param, function(json){
				if(json.map && json.count !== undefined) {
					$("#offset2").val(json.map.offset || 0);
					$("#max2").val(json.count);
					$(".paging_wrap").paging({
						current	  : 10,
						max  	  : Number(json.count),
						nowOffset : Number(json.map.offset || 0),
						bindEvent : EOCS.setData
					});
				}
				// 기존 데이터 초기화
				$("#eocsData").empty();
				
				// 새 데이터 추가
				for(var i =0; i<json.result.length; i++){
					var data = [json.result[i].startLon, json.result[i].startLat];
					str += "<tr k="+json.result[i].recNo+">";
					str += "<td class='tCenter'>"+json.result[i].recNo+"</td>";
					str += "<td>"+json.result[i].workName +"</td>";
					str += "<td>"+json.result[i].exstartDate +"</td>";
					str += "<td>"+json.result[i].exendDate +"</td>";
					str += "<td style='width: 95px;'>";
					// data 값이 있을 때만 위치 버튼 생성
					if(json.result[i].startLon && json.result[i].startLat) {
						str += "<button type='button' class='btn_t eocsMove' style='background-color: #1d1d1f;' coor="+data+">위치</button>";
					}
					
					str += "<button type='button' class='btn_t eocsDetail' style='background-color: #1d1d1f;'>상세</button>";
					str += "</td>";
					str += "</tr>";
				}
				
				$("#eocsData").append(str);
				
				// 이벤트 바인딩
				$(".eocsMove").on('click', function(){
					var lonlat  = $(this).attr("coor").split(",");
					var coord = Spatial.convertProjection(lonlat, "EPSG:4326", "EPSG:5186");
					GMXMAP.addPulse(coord,true)
				})
				
				$(".eocsDetail").on('click', function(){
				
					var _param = {recNo : $(this).parent().parent().attr("k")};
					_common.callAjax("/eocs/getEditView.do", _param, function (view) {
						if (view) {
							// gmx.gis.context.extension.js와 동일한 방식으로 처리
							$("#featureInfoWrap").html(view);
							
							// 기존 다이얼로그가 열려있지 않으면 새로 열기
							if(!$("#featureInfoWrap").dialog("isOpen")){
								$("#featureInfoWrap").dialog({
									title: "EOCS 객체정보",
									width: 500,
									height: $("#map").height(),
									position: {
										my: "right top",
										at: "right-1 top",
										of: $("#map")
									},
									open: function(){
										$("#featureInfoWrap").find("textarea").each(function(){
											$(this).height($(this)[0].scrollHeight);
										})
									},
									close: function(){
										$("#featureInfoWrap").find("tbody").html("");
									}
								}).dialog("open");
							} else {
								$("#featureInfoWrap").dialog({ title: "EOCS 상세 정보" });
							}
						}
					});
				});
			}, false);
		}
	}
