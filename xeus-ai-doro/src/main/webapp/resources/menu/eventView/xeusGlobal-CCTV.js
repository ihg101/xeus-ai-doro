/**
 * <pre>
 * 이벤트 모니터링 소메뉴 관련 이벤트 입니다.
 * </pre>
 *
 * @auther 이주영
 */
Public.CCTV = {

	Search : {
		excelParam : null,

		vector : null,
		interaction : null,

		Start : function() {
			if (Public.StopEvent != null && Public.CCTV.Search.interaction != null) {
				Public.CCTV.Search.interaction.setActive(true);
				return false;
			}

			this.vector = new ol.layer.Vector({
				source : new ol.source.Vector({
					wrapX : false
				})
			});

			var drawMode = $(".drawType:checked").val();
			var geometryFunction = null;
			if(drawMode == "Box"){
				drawMode = "Circle";
				geometryFunction = ol.interaction.Draw.createBox();
			}

			this.interaction = new ol.interaction.Draw({
				source : Public.CCTV.Search.vector.getSource(),
				type : drawMode,
				geometryFunction : geometryFunction
			});
			this.interaction.on("drawstart", function(e){
				var features = Public.CCTV.Search.vector.getSource().getFeatures();
				for(var i=0; i<features.length; i++){
					Public.CCTV.Search.vector.getSource().removeFeature(features[i]);
				}
			});
			this.interaction.on("drawend", function(e) {
				var param = {};
				var geometry = e.feature.getGeometry();
				if(geometry.getRadius != null){
					var radius = geometry.getRadius();
					var center = geometry.getCenter();
					param["radius"] = radius;
					param["center"] = "POINT(" + center.join(" ").toString() + ")";
				}else{
					var format = new ol.format.WKT();
					var wkt = format.writeGeometry(e.feature.getGeometry());
					param["wkt"] = wkt;
				}
				_common.callAjax("/cctv/getCctvList.json", param, function(json){
					Public.CCTV.Search.excelParam = param;
					if(json.result.length == 0){
						var $tr = $("<tr><td colspan='4' class='tCenter'>결과가 존재하지 않습니다.</td></tr>");
						$(".contentWrapper").find("#resultTable").find("tbody").html($tr);
						$(".contentWrapper").find("#resultCnt").text("검색결과 (총 0건)");
					}else{
						$(".contentWrapper").find("#resultCnt").text("검색결과 (총 " + json.count + "건)");
						$(".contentWrapper").find("#resultTable").find("tbody").html("");
						for(var i=0; i<json.result.length; i++){

							var $tr = $("<tr class='tCenter search_result' k='" + json.result[i].mgrNo + "'></tr>");
							$tr.append("<td>"+(i+1)+"</td>");
							$tr.append("<td>" + json.result[i].gbnNm + "</td>");
							//$tr.append("<td>" + json.result[i].cctvNm + "</td>");
							$tr.append("<td><div class='tLeft sText' title='"+json.result[i].cctvNm+"'>" + json.result[i].cctvNm + "<div></td>");
							$tr.append("<td><button class='locBtn btn_t'>위치</button></td>");

							var prop = {
								gid : json.result[i].gid,
								mgrNo : json.result[i].mgrNo,
								gbnCd : json.result[i].gbnCd,
								angle : json.result[i].viewDir,
								cctvNm : json.result[i].cctvNm,
								channelNo : json.result[i].chnlNo,
								deviceId : json.result[i].deviceId,
								stateCd : json.result[i].stateCd,
								point : Spatial.convertProjection([json.result[i].lng, json.result[i].lat], "EPSG:4326", "EPSG:5186")
							};
							$tr.data(prop);

							$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
						}

						$(".paging_wrap").hide();

						/* 위치 버튼 이벤트입니다. */
						$(".contentWrapper").find("#resultTable").find(".locBtn").click(function(){
							var prop = $(this).parent().parent().data();

							GMXMAP.addPulse(prop.point, true);
						});

						/* 관리 버튼 이벤트입니다. */
						$(".contentWrapper").find("#resultTable").find(".detailBtn").click(function(){
							$("#btn-cctv-mng").click();
							var v = $(this).parent().parent().attr("k");
							_common.callAjax("/cctv/getCctvMngView.do", {mgrNo : v}, function(view) {
		        				$("#center-overlay-east").height(
		        					$(window).height() - $("#layout-north").outerHeight() - $("#overlay-east-bar").outerHeight()
		        				).html(view);
		        			});
						});
					}

					Public.StopEvent();
				});
			});

			$("#drawCncl").show();
			GMXMAP.addLayer(this.vector);
			GMXMAP.addInteraction(this.interaction);

			Public.StopEvent = function() {
				$("#drawCncl").hide();
				if (this.CCTV.Search.interaction != null) {
					GMXMAP.removeInteraction(this.CCTV.Search.interaction);
					this.CCTV.Search.interaction = null;
				}
				if (this.CCTV.Search.vector != null) {
					GMXMAP.removeLayer(this.CCTV.Search.vector);
					this.CCTV.Search.vector = null;
				}
				this.StopEvent = null;
			}
		}
	},

	Add : {
		Start : function(evt) {
			var coordinates = evt.coordinate;
			var epsg = GMXMAP.getView().getProjection().getCode();
			var mainCenter = ol.proj.transform(coordinates, epsg, 'EPSG:4326');
			$("#regTable #lng").val(mainCenter[0]);
			$("#regTable #lat").val(mainCenter[1]);

			//$("body").css("cursor", "default");
			$(".selectCancel").hide(500);
			GMXMAP.un('click', Public.CCTV.Add.Start);
		}
	},

	Preset : {
		Start : function(evt){
			var coordinates = evt.coordinate;
			_common.callAjax("/proxy/xeusGateWay.json", { "path" : "getPreset", "cctvMgrNo" : Public.CCTV.Preset["mgrNo"], "presetNo" : Public.CCTV.Preset["presetNo"] }, function(json){
				_common.callAjax("/proxy/xeusGateWay.json", { "path" : "getPTZPosition", "cctvMgrNo" : Public.CCTV.Preset["mgrNo"], "gbnCd" : Public.CCTV.Preset["cctvProp"]["gbnCd"] }, function(ptz){
					var mode = "insert";
					if(json.result) mode = "update";

					var prop = Public.CCTV.Preset["cctvProp"];
					var param = {
						"path" : mode + "Preset",
						"cctvMgrNo" : Public.CCTV.Preset["mgrNo"],
						"presetNo" : Public.CCTV.Preset["presetNo"],
						"gbnCd" : Public.CCTV.Preset["cctvProp"]["gbnCd"],
						"gid" : Public.CCTV.Preset["cctvProp"]["gid"],
						"pan" : ptz.result.pan,
						"tilt" : ptz.result.tilt,
						"zoom" : ptz.result.zoom,
						"spd" : 1,
						"dirX" : coordinates[0],
						"dirY" : coordinates[1],
						"dirDeg" : Spatial.getAngle(Public.CCTV.Preset["cctvProp"]["point"], coordinates),
					};

					confirm(param["presetNo"] + "번의 프리셋을 설정하시겠습니까?", function(){
						_common.callAjax("/proxy/xeusGateWay.json", param, function(json){
							alert('저장되었습니다.');
							xeusSymbol.removeFeature(prop["gid"], "isPreset");
							/*_common.callAjax("/proxy/xeusGateWay.json", { "path" : "getPresets", "cctvMgrNo" : prop["mgrNo"], "gbnCd" : prop["gbnCd"] }, function(json){
						    	xeusSymbol.removeFeature(prop["gid"], "isPreset");
								var length = json.result.length;
								for(var i=11; i<20; i++){
									for(var l=0; l<length; l++){
										if(i == Number(json.result[l].presetNo)){
											var endPoint = [ Number(json.result[l].dirX), Number(json.result[l].dirY) ];
											var presetNo = json.result[l].presetNo;
											xeusSymbol.addPreset(prop["point"], endPoint, prop["gid"], presetNo);
											break;
										}
									}
								}
							}, false);*/
						}, false);
					})
				}, false);
			}, false);

			xeusSymbol.removeFeature(Public.CCTV.Preset["cctvProp"]["gid"], "isPreset");
			delete Public.CCTV.Preset["cctvProp"];
			delete Public.CCTV.Preset["mgrNo"];
			delete Public.CCTV.Preset["presetNo"];
			//$("body").css("cursor", "default");
			$("#nmsView").find(".selectPresetCancel").hide(500);
			GMXMAP.un('click', Public.CCTV.Preset.Start);
		}
	},

	Focus : {
		pointVector : null,
		lineVector : null,
		interaction : null,

		Start : function(){
			var cctvList = xeusCCTV.getGridPanePlayerData();
			if(cctvList.length == 0){
				alert("집중감시 할 CCTV를 지도에서 선택해주세요.")
				return false;
			}

			if(Public.StopEvent != null){
				Public.StopEvent();
			}

			this.pointVector = new ol.layer.Vector({
				source : new ol.source.Vector()
			});

			this.lineVector = new ol.layer.Vector({
				source: new ol.source.Vector()
			});

			this.interaction = new ol.interaction.Draw({
				source : this.pointVector.getSource(),
				type : "Point"
			});

			this.interaction.on("drawstart", function(e){
				Public.CCTV.Focus.pointVector.getSource().clear();
			});

			this.interaction.on("drawend", function(e){
				Public.CCTV.Focus.lineVector.getSource().clear();
				cctvList = xeusCCTV.getGridPanePlayerData();

				var endXY = e.feature.getGeometry().getCoordinates();
				e.feature.setStyle(new ol.style.Style({
					image: new ol.style.Circle({
						radius: 5,
						stroke: new ol.style.Stroke({
							color: 'rgba(128, 128, 0, 1.0)',
							width: 2
						}),
						fill : new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.5)'
						})
					}),
					text: new ol.style.Text({
						textBaseline : "alphabetic",
						offsetY : -25,
						font: '15px Calibri,sans-serif',
						text: endXY.join("\n").toString(),
						fill: new ol.style.Fill({
							color: 'red'
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 3
						})
					})
				}));

				for(var i=0; i<cctvList.length; i++){
					var mgrNo = cctvList[i].mgrNo;
					var gbnCd = cctvList[i].gbnCd;

					_common.callAjax("/getPresetCCTV.json", { "cctvMgrNo" : mgrNo, "tmx" : cctvList[i].point[0], "tmy" : cctvList[i].point[1] }, function(json){
						var param = {
							 "path" : "gotoPreset",
							 "cctvMgrNo" : json.result.cctv_mgr_no,
							 "presetNo" : json.result.preset_no
						};
						_common.callAjax("/proxy/xeusGateWay.json", param, function(){});
					}, false);


					var line = new ol.Feature(new ol.geom.LineString([cctvList[i].point, endXY]))
					var length = line.getGeometry().getLength();
					var metter = null;
					if(length > 100){
						metter = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
					}else{
						metter = (Math.round(length * 100) / 100) + ' ' + 'm';
					}
					line.setStyle(new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: 'yellow',
							width: 1
						}),
						text: new ol.style.Text({
							textAlign : "end",
							font: '15px Calibri,sans-serif',
							text: metter,
							fill: new ol.style.Fill({
								color: 'red'
							}),
							stroke: new ol.style.Stroke({
								color: '#fff',
								width: 3
							})
						})
					}))
					Public.CCTV.Focus.lineVector.getSource().addFeature(line);
				}
				if(Public.CCTV.Focus.interaction != null){
					GMXMAP.removeInteraction(Public.CCTV.Focus.interaction);
					Public.CCTV.Focus.interaction = null;
				}
			});

			GMXMAP.addLayer(this.lineVector);
			GMXMAP.addLayer(this.pointVector);
			GMXMAP.addInteraction(this.interaction);

			Public.StopEvent = function() {
				if(this.CCTV.Focus.interaction != null){
					GMXMAP.removeInteraction(this.CCTV.Focus.interaction);
					this.CCTV.Focus.interaction = null;
				}
				if(this.CCTV.Focus.lineVector != null){
					GMXMAP.removeLayer(this.CCTV.Focus.lineVector);
					this.CCTV.Focus.lineVector = null;
				}
				if(this.CCTV.Focus.pointVector != null){
					GMXMAP.removeLayer(this.CCTV.Focus.pointVector);
					this.CCTV.Focus.pointVector = null;
				}
				this.StopEvent = null;
			}
		}
	},

	Patrol : {
		vector : null,
		bufferVector : null,
		interval : null,
		interaction : null,

		RoopCnt : 0,
		AutoMoveStart : function(moveSec, moveBuffer, showCnt){
			var roopCnt = this.RoopCnt;
			var geomArray = null;
			if(this.vector.getSource().getFeatures().length > 0) geomArray = this.vector.getSource().getFeatures()[0].getProperties().geomArray;
			if(this.interval != null) clearInterval(this.interval);
			this.bufferVector = new ol.layer.Vector({
				zIndex : 9999,
				source : new ol.source.Vector()
			});

			GMXMAP.addLayer(this.bufferVector);

			var searchFunction = function(){
				var circle = new ol.Feature(new ol.geom.Circle(geomArray[roopCnt], moveBuffer));
				Public.CCTV.Patrol.bufferVector.getSource().clear();
				Public.CCTV.Patrol.bufferVector.getSource().addFeature(circle);

				var param = {};
				var geometry = circle.getGeometry();
				if(geometry.getRadius != null){
					var radius = geometry.getRadius();
					var center = geometry.getCenter();
					param["radius"] = radius;
					param["center"] = "POINT(" + center.join(" ").toString() + ")";

					_common.callAjax("/cctv/getCctvList.json", param, function(json){
						if(json.result.length > 0){
							var dataList = new Array();
							for(var i=0; i<json.result.length; i++){
								if(i < showCnt){
									dataList.push({ "mgrNo" : json.result[i].mgrNo, "cctvNm" : json.result[i].cctvNm, "idx" : i });
								}else{
									break;
								}
							}

							GMXCCTV.removePlayingIconAtGrid();
							GMXCCTV.clearAllGridPlayers();
							GMXCCTV.createGridPlayer(dataList);
							GMXCCTV.setGridDialogWidth(Number(json.colNum));
						}
					});
				}

				GMXMAP.getView().setCenter(geomArray[roopCnt]);
				if(geomArray.length - 1 == roopCnt){
					roopCnt = 0;
				}else{
					roopCnt++;
				}
			};

			searchFunction(roopCnt);
			this.interval = setInterval(function(){
				searchFunction(roopCnt);
			}, moveSec * 1000);

			$("#patrolStart").hide();
			$("#patrolStop").show();
		},

		AutoMoveStop : function(){
			GMXCCTV.removePlayingIconAtGrid();
			GMXCCTV.clearAllGridPlayers();
			clearInterval(this.interval);
			this.interval = null;

			if(this.bufferVector != null){
				this.bufferVector.getSource().clear();
				GMXMAP.removeLayer(this.bufferVector);
				this.bufferVector = null;
			}

			$("#patrolStart").show();
			$("#patrolStop").hide();
		},

		DrawStart : function() {
			if (_common.utils.isNullAndEmpty($("#drawNm").val())) {
				alert("경로명을 입력해 주세요.");
				return false;
			}

			if (this.interaction != null) {
				GMXMAP.removeInteraction(this.interaction);
				this.interaction = null;
			}

			if (this.vector != null) {
				this.vector.getSource().clear();
				GMXMAP.removeLayer(this.vector);
				this.vector = null;
			}

			this.vector = new ol.layer.Vector({
				zIndex : 9999,
				source : new ol.source.Vector({
					wrapX : false
				}),
				style : function(feature) {
					var geometry = feature.getGeometry();
					var styles = [new ol.style.Style({
							stroke : new ol.style.Stroke({
								color : "blue",
								width : 2
							})
						})
	              	];

					var last = null;
					var points = new Array();
					geometry.forEachSegment(function(start, end){
						points.push(start.slice());
						last = end.slice();
					});
					points.push(last);

					for(var i=0; i<points.length; i++){
						styles.push(new ol.style.Style({
							geometry: new ol.geom.Point(points[i]),
							image: new ol.style.Circle({
								radius: 5,
								stroke: new ol.style.Stroke({
									color: 'rgba(0, 128, 0, 1.0)',
									width: 2
								}),
								fill : new ol.style.Fill({
									color: 'rgba(255, 255, 255, 1.0)'
								})
							}),
							text: new ol.style.Text({
								font: '15px Calibri,sans-serif',
								textBaseline: "bottom",
								offsetY: -10,
								text: (i + 1) + "번 경로",
								fill: new ol.style.Fill({
									color: '#000'
								}),
								stroke: new ol.style.Stroke({
									color: '#fff',
									width: 3
								})
							})
						}));
					}

			        return styles;
			      }
			});

			var coordsLength = 0;
			var geomArray = null;
			var format = new ol.format.WKT();

			this.interaction = new ol.interaction.Draw({
				source : Public.CCTV.Patrol.vector.getSource(),
				type : "LineString",
				/*geometryFunction : function(coords, geom){
					if (!geom) geom = new ol.geom.LineString(null);
					geom.setCoordinates(coords);
					if(coords.length !== coordsLength){
						coordsLength = coords.length;
						geomArray = coords;
					}
					$("#drawList").attr("wkt", format.writeGeometry(geom));
					return geom;
				}*/
			});
			this.interaction.on("drawstart", function(e) {
				Public.CCTV.Patrol.vector.getSource().clear();
			});
			this.interaction.on("drawend", function(e) {
				if (_common.utils.isNullAndEmpty($("#drawNm").val())) {
					alert("경로명을 입력해 주세요.");
					setTimeout(function() {
						Public.CCTV.Patrol.vector.getSource().removeFeature(e.feature);
					}, 100);
				} else {
					var format = new ol.format.WKT();
					var wkt = format.writeGeometry(e.feature.getGeometry());
					var prop = {
						"draw_nm" : $("#drawNm").val(),
						"ol_uid" : e.feature.ol_uid,
						"geomArray" : e.feature.getGeometry().getCoordinates(),
						"wkt" : wkt
					};

					e.feature.setProperties(prop);

					/*$("#drawList").html("");
					for(var i=0; i<geomArray.length; i++){
						var xy = geomArray[i].join(", ").toString();
						var $p = $("<p>" + xy + "</p>").css({
							"margin-left" : "15px",
							"font-weight" : "bold"
						});
						$("#drawList").append($p);
					}*/
					setTimeout(function(){
						Public.CCTV.Patrol.interaction.setActive(false);
					}, 100);
					$("#drawCncl").hide("slow");
				}
			});

			GMXMAP.addLayer(this.vector);
			GMXMAP.addInteraction(this.interaction);

			Public.StopEvent = function() {
				$("#drawCncl").hide("slow");
				$("#drawList").removeAttr("wkt").html("");

				this.CCTV.Patrol.AutoMoveStop();

				if (this.CCTV.Patrol.interaction != null) {
					GMXMAP.removeInteraction(this.CCTV.Patrol.interaction);
					this.CCTV.Patrol.interaction = null;
				}

				if (this.CCTV.Patrol.vector != null) {
					this.CCTV.Patrol.vector.getSource().clear();
					GMXMAP.removeLayer(this.CCTV.Patrol.vector);
					this.CCTV.Patrol.vector = null;
				}

				this.StopEvent = null;
			}
		}
	},

	Dmtia : {

		vector : null,
		Start : function() {
			if (Public.StopEvent != null) {
				return false;
			}

			var _Source = new ol.source.Vector({
				wrapX : false
			});

			/*var _ClusterSource = new ol.source.Cluster({
				distance: parseInt(30, 10),
				source: _Source,
				style: new ol.style.Style({
					image: new ol.style.Circle({
						radius: 1,
						fill: new ol.style.Fill({
							color: 'rgba(0, 0, 255, 0.1)'
						}),
						stroke: new ol.style.Stroke({
							//color: 'rgba(240, 90 , 30, 1)',
							color: 'blue',
							width: 3
						})
					})
				})
			});*/

			this.vector = new ol.layer.Vector({
				source : _Source,
				zIndex : 99
			});

			_common.callAjax("/eventDmtia/getLocationList.json", { }, function(json){
				var length = json.result.length;
				for(var i=0; i<length; i++){
					var lonlat = [Number(json.result[i].lon), Number(json.result[i].lat)];
					var center = Spatial.convertProjection(lonlat, "EPSG:4326", "EPSG:5186");
					var sym = "gf";
					if(json.result[i].dmtiaGender == "W") sym = "gm";
					if(json.result[i].isContains == "FALSE") sym += "_red";

					var point = new ol.Feature(new ol.geom.Point(center));

					var prop = {};
					for(var key in json.result[i]){
						var decamelKey = humps.decamelize(key);
						prop[decamelKey] = json.result[i][key];
					}
					point.setProperties(prop);

					point.setProperties({
						"typename" : "mon_dmtia_user",
						"img_path" : './res/img/' + sym + '.png',
						"target_field" : "dmtiaNm",
						"popup" : true
					});
					point.setStyle(new ol.style.Style({
						image: new ol.style.Icon({
							src: './res/img/' + sym + '.png'
						})
					}));

					_Source.addFeature(point);
				}
			});

			GMXMAP.addLayer(this.vector);

			Public.StopEvent = function() {
				if (this.CCTV.Dmtia.vector != null) {
					GMXMAP.removeLayer(this.CCTV.Dmtia.vector);
					this.CCTV.Dmtia.vector = null;
				}
				this.StopEvent = null;
			}
		},

		DetailReload : function(dmtiaMgrNo, locDat){
			if(Number(dmtiaMgrNo) == 999 || Number(dmtiaMgrNo) == 998 || Number(dmtiaMgrNo) == 997) locDat = "20190101000000";
			var _source = this.vector.getSource();
			var _geoJSON = new ol.format.GeoJSON();

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : {
					tbl : "mon_dmtia_pt",
					//col : "sym_cd",
					col : "dmtia_mgr_no",
					val : dmtiaMgrNo,
					locDat : locDat,
					sortCol : "loc_dat",
					sortTyp : "desc"
					//box : Spatial.getExtent(GMXMAP).toString()
				},
				async : false,
				dataType : "json",
				beforeSend : function() {
					_source.clear();
				},
				success : function(json) {

					var $tbl = $(".contentWrapper").find("#detailTable").find("tbody");
					$tbl.html("");
					var _features = _geoJSON.readFeatures(json);
					var length = _features.length;
					if(length == 0){
						var $tr = $("<tr></tr>");
						var $td1 = $("<td colspan='3' class='tCenter'>위치정보가 존재하지 않습니다.</td>");
						$tr.append($td1);
						$tbl.append($tr);
					}
					var idx = 0;
					var prevTime = 0;
					for(var i=0; i<length; i++){
						var feature = _features[i];

						var nextTime = feature.getProperties()["loc_dat"].substring(0, 12);
						if(Number($(".contentWrapper").find("#lastTime").val()) > 24){
							nextTime = feature.getProperties()["loc_dat"].substring(0, 11);
						}
						if(prevTime != nextTime){
							prevTime = nextTime;

							var lon = feature.getProperties()["lon"];
							var lat = feature.getProperties()["lat"];

							var locDat = feature.getProperties()["loc_dat"];
							if(Number(dmtiaMgrNo) == 999 || Number(dmtiaMgrNo) == 998 || Number(dmtiaMgrNo) == 997){
								if(locDat.substring(0, 8) == "20190306") locDat = new Date().getYMD() + locDat.substring(8);
								if(locDat.substring(0, 8) == "20190305") locDat = new Date().getBeforeDate(-1, true) + locDat.substring(8);
								if(locDat.substring(0, 8) == "20190304") locDat = new Date().getBeforeDate(-2, true) + locDat.substring(8);
								if(locDat.substring(0, 8) == "20190303") locDat = new Date().getBeforeDate(-3, true) + locDat.substring(8);
								if(locDat.substring(0, 8) == "20190302") locDat = new Date().getBeforeDate(-4, true) + locDat.substring(8);
								if(locDat.substring(0, 8) == "20190301") locDat = new Date().getBeforeDate(-5, true) + locDat.substring(8);
							}

							var $tr = $("<tr></tr>");
							var $td1 = $("<td class='tCenter'>" + (idx + 1) + "</td>");
							var $td2 = $("<td class='tCenter'>" + new Date().formatYMDHMS(locDat) + "</td>");
							var $td3 = $("<td class='tCenter'><button class='locBtn btn_t' lon='" + lon + "' lat='" + lat + "'>위치</button></td>");
							$tr.append($td1).append($td2).append($td3);
							$tbl.append($tr);

							feature.setProperties({
								"isIgnore" : true
							});
							var color = 'blue';
							var zindx = 9;
							if(idx < 10){
								color = 'red';
								zindx = 10;
								$tr.css("color", color);
							}
							idx++;
							var style = {
								image: new ol.style.Circle({
									radius: 1,
									fill: new ol.style.Fill({
										color: 'rgba(0, 0, 255, 0.1)'
									}),
									stroke: new ol.style.Stroke({
										color: color,
										width: 3
									})
								}),
								text: new ol.style.Text({
									font: '15px Calibri,sans-serif',
									text: new Date().formatYMDHMS(locDat),
									fill: new ol.style.Fill({
										color: '#fff'
									}),
									stroke: new ol.style.Stroke({
										color: color,
										width: 3
									}),
									offsetY: 15
								}),
								zIndex: zindx
							}

							if(color == "blue") delete style["text"];
							feature.setStyle(new ol.style.Style(style));

							_source.addFeature(feature);
						}
					}
					if(length > 0) GMXMAP.getView().fit(_source.getExtent());

					$tbl.find(".locBtn").click(function(){
						var point = Spatial.convertProjection([$(this).attr("lon"), Number($(this).attr("lat"))], "EPSG:4326", "EPSG:5186")

						GMXMAP.addPulse(point, true);
						//GMXMAP.getView().setResolution(0.0182478942162188);
						//GMXMAP.getView().setZoom(19);
					});

					_common.callAjax("/eventDmtia/getLocationList.json", { }, function(json){
						var length = json.result.length;
						for(var i=0; i<length; i++){
							var lonlat = [Number(json.result[i].lon), Number(json.result[i].lat)];
							var center = Spatial.convertProjection(lonlat, "EPSG:4326", "EPSG:5186");
							var sym = "gf";
							if(json.result[i].dmtiaGender == "W") sym = "gm";
							if(json.result[i].isContains == "FALSE") sym += "_red";

							var point = new ol.Feature(new ol.geom.Point(center));

							var prop = {};
							for(var key in json.result[i]){
								var decamelKey = humps.decamelize(key);
								prop[decamelKey] = json.result[i][key];
							}
							point.setProperties(prop);

							point.setProperties({
								"typename" : "mon_dmtia_user",
								"img_path" : './res/img/' + sym + '.png',
								"target_field" : "dmtiaNm",
								"popup" : true
							});
							point.setStyle(new ol.style.Style({
								image: new ol.style.Icon({
									src: './res/img/' + sym + '.png'
								})
							}));

							_source.addFeature(point);
						}
					}, false);
				},
				error : function(xhr, status, error) { }
			});
		},

		Reset : function(){
			if(Public.StopEvent) Public.StopEvent();
			this.Start();
		}
	},

	Dron : {
		parseDetail : function(eventId, eventMsg){
			var $tbl = $("<table></table>");

			//(드론위치:51,배터리경보:52,교통정보:60,화재정보:68)
			if(eventId == 51){

				var $thead = $("<thead><tr class='tCenter'><th colspan='4'>드론 위치 정보</th></tr></thead>");
				var $tr1 = $("<tr class='tCenter'></tr>");
				$tr1.append("<th>경도</th>").append("<th>위도</th>").append("<th>높이(해발)</th>").append("<th>헤딩각</th>");
				$thead.append($tr1);
				$tbl.append($thead);

				var $tbody = $("<tbody></tbody>");
				var $tr2 = $("<tr class='tCenter'></tr>");
				$tr2.append("<td>" + eventMsg.lng + "</td>").append("<td>" + eventMsg.lat + "</td>").append("<td>" + eventMsg.alt + "</td>").append("<td>" + eventMsg.head + "</td>");
				$thead.append($tr2);
				$tbl.append($thead);

			}else if(eventId == 52){

				var $thead = $("<thead><tr class='tCenter'><th colspan='3'>배터리 정보</th></tr></thead>");
				var $tr1 = $("<tr class='tCenter'></tr>");
				$tr1.append("<th>상태</th>").append("<th>경도</th>").append("<th>위도</th>");
				$thead.append($tr1);
				$tbl.append($thead);

				var $tbody = $("<tbody></tbody>");
				var $tr2 = $("<tr class='tCenter'></tr>");
				$tr2.append("<td>" + eventMsg.status + "</td>").append("<td>" + eventMsg.lng + "</td>").append("<td>" + eventMsg.lat + "</td>");
				$thead.append($tr2);
				$tbl.append($thead);

			}else if(eventId == 60){

				var $thead = $("<thead><tr class='tCenter'><th colspan='3'>교통 정보</th></tr></thead>");
				var $tr1 = $("<tr class='tCenter'></tr>");
				$tr1.append("<th>교통량</th>").append("<th>경도</th>").append("<th>위도</th>");
				$thead.append($tr1);
				$tbl.append($thead);

				var $tbody = $("<tbody></tbody>");
				var $tr2 = $("<tr class='tCenter'></tr>");
				$tr2.append("<td>" + eventMsg.weight + "</td>").append("<td>" + eventMsg.lng + "</td>").append("<td>" + eventMsg.lat + "</td>");
				$thead.append($tr2);
				$tbl.append($thead);

			}else if(eventId == 68){

				var $thead = $("<thead><tr class='tCenter'><th colspan='2'>화재 정보</th></tr></thead>");
				var $tr1 = $("<tr class='tCenter'></tr>");
				$tr1.append("<th>경도</th>").append("<th>위도</th>");
				$thead.append($tr1);
				$tbl.append($thead);

				var $tbody = $("<tbody></tbody>");
				var $tr2 = $("<tr class='tCenter'></tr>");
				$tr2.append("<td>" + eventMsg.lng + "</td>").append("<td>" + eventMsg.lat + "</td>");
				$thead.append($tr2);
				$tbl.append($thead);

			}

			$(".contentWrapper").find("#dronEventDetail").html($tbl);
		},
		Start : function() {
			if (Public.StopEvent != null) {
				return false;
			}

			if(Spatial.dron1Vector) xeusLayout.mapService.addLayer(Spatial.dron1Vector);
			if(Spatial.dron2Vector) xeusLayout.mapService.addLayer(Spatial.dron2Vector);
			if(Spatial.dron3Vector) xeusLayout.mapService.addLayer(Spatial.dron3Vector);

			Public.StopEvent = function() {
				if(Spatial.dron1Vector){
					//$(".close_CTV0001039").click();
					Spatial.dron1StopInterval();
					xeusLayout.mapService.getMap().removeLayer(Spatial.dron1Vector);
					Spatial.dron1Vector.getSource().clear();
				}

				if(Spatial.dron2Vector){
					//$(".close_CTV0001040").click();
					Spatial.dron2StopInterval();
					xeusLayout.mapService.getMap().removeLayer(Spatial.dron2Vector);
					Spatial.dron2Vector.getSource().clear();
				}

				if(Spatial.dron3Vector){
					//$(".close_CTV0001041").click();
					Spatial.dron3StopInterval();
					xeusLayout.mapService.getMap().removeLayer(Spatial.dron3Vector);
					Spatial.dron3Vector.getSource().clear();
				}

				Spatial.dron1Points = null;
				Spatial.dron1Vector = null;

				Spatial.dron2Points = null;
				Spatial.dron2Vector = null;

				Spatial.dron3Points = null;
				Spatial.dron3Vector = null;

				this.StopEvent = null;
			}
		}
	}
}