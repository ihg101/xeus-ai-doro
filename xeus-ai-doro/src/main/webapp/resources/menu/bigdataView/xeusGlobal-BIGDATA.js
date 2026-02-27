/**
 * <pre>
 * BIGDATA 관련 이벤트 입니다.
 * </pre>
 *
 * @auther 이주영
 */
Public.BIGDATA = {


	Search : {

		vector : null,

		Start : function(xy) {
			if(Public.StopEvent != null) Public.StopEvent();

			this.vector = new ol.layer.Vector({
				source : new ol.source.Vector({
					features: [new ol.Feature({
						geometry: new ol.geom.Point(xy)
					})]
				}),
				style : new ol.style.Style({
					image: new ol.style.Icon({
						src: '/xeus/res/img/pin.png'
					})
				})
			});

			GMXMAP.addLayer(this.vector);
//			GMXMAP.moveToAnimation(0, xy);
			GMXMAP.addPulse(xy);



			Public.StopEvent = function() {
				if (this.BIGDATA.Search.vector != null) {
					this.BIGDATA.Search.vector.getSource().clear();
					GMXMAP.removeLayer(this.BIGDATA.Search.vector);
					this.BIGDATA.Search.vector = null;
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
			$(".contentWrapper").find("#regTable #lng").val(mainCenter[0]);
			$(".contentWrapper").find("#regTable #lat").val(mainCenter[1]);

			/*if(xeusSymbol){
				var symbolVector = xeusSymbol.createVector();
				GMXMAP.addLayer(symbolVector);
				xeusSymbol.removeFeature(99999, "isMarker");
				xeusSymbol.addMarker(coordinates, 99999);
			}*/

			GMXMAP.addPulse(coordinates, false, 10);

			var hjd = Spatial.convertXYToHJD(mainCenter[0], mainCenter[1]);
			var addr = Spatial.convertXYToJibun(mainCenter[0], mainCenter[1], true);

			if(!_common.utils.isNullAndEmpty(hjd)){
				$(".contentWrapper").find("#regTable #emd").find("option").each(function(){
					if($(this).val() == hjd){
						$(this).prop("selected", "selected");
						return false;
					}
				});
			}

			$(".contentWrapper").find("#regTable #jibun").val(addr.jibun);
			$(".contentWrapper").find("#regTable #san").val(addr.san);
			$(".contentWrapper").find("#regTable #bjd").find("option").each(function(){
				if($(this).val() == addr.bjd){
					$(this).prop("selected", "selected");
					return false;
				}
			});

			//$("body").css("cursor", "default");
			$(".contentWrapper").find(".selectCancel").hide(500);
			GMXMAP.un('click', Public.BIGDATA.Add.Start);
		}
	},

	View : {

		slideVal   : null,
		gridVector10m : null,
		gridVector100m : null,
		heatVector : null,

		Start : function(sortTyp) {
			if(Public.StopEvent != null) Public.StopEvent();

			// 결과표출
			if(!sortTyp){
				if(!_common.utils.isNullAndEmpty($(".contentWrapper").find("#resultWrap").find("#resultTableWrap").find("#sortTyp").val())){
					sortTyp = $(".contentWrapper").find("#resultWrap").find("#resultTableWrap").find("#sortTyp").val();
				}else{
					sortTyp = "desc";
				}
			}
			$(".contentWrapper").find("#resultWrap").find("#resultTableWrap").find("#sortTyp").val(sortTyp);
			xeusBigdata.setResultTable(0, 10, sortTyp);

			var min, max, cnt, slice, range, color, isMinus;
			_common.callAjax("/bigData/getMinMax.json", { tblId : tbl }, function(json){
				min = json.result.min_val;
				max = json.result.max_val;
				cnt = json.result.count;
				isMinus = false;

				slice = 10;
				range = Math.ceil((max - min) / slice);
				if(sortTyp == "desc") color = chroma.scale(['#1DDB16', '#FFE400', '#FF0000']).colors(slice);
				if(sortTyp == "asc")  color = chroma.scale(['#FF0000', '#FFE400', '#1DDB16']).colors(slice);
				if(min < 0 && min < -4) isMinus = true;

				$(".contentWrapper").find("#resultWrap").find("#sortValSetBtn").attr("min", min).attr("max", max);
				$("#spectrumWrap").find(".lowVal").text("낮은 값 (" + min + ")");
				$("#spectrumWrap").find(".highVal").text("높은 값 (" + max + ")");

				var $prt = $("#spectrumWrap").find("#spectrum");
				var $tbl = $("<table cellspacing='0'></table>")/*.width("200px").height("15px")*/;
				var start = min;
				var end = start + range;
				var $tr = $("<tr class='tCenter'></tr>");
				for(var i=0; i<slice; i++){
					var $td1, $td2, $td3 = null;

					$td1 = $("<td style='background: " + color[i] + "99; padding: 10px;'></td>");
					//$td1 = $("<td><input type='color' value='" + color[i] + "' readOnly disabled></td>");
					//$td2 = $("<td>" + start + " ~ " + end + "</td>");
					//$td3 = $("<td><button class='detailBtn' min='" + start + "' max='" + end + "'></button></td>");

					$tr.append($td1);//.append($td2).append($td3);
					$tbl.append($tr);

					//start = end;
					//end = end + range;
					//if(i == 18 && end > max) end = max;
				}
				$prt.html($tbl);
				$("#spectrumWrap").show();
			}, false);

			var colorFunction = function(feature){
				var resultColor;
				var resultVal = Number(feature.getProperties().result_val);
				var slideVal = Public.BIGDATA.View.slideVal;

				if(slideVal == null){

					var start = min;
					var end = start + range;
					for(var i=0; i<slice; i++){
						if(resultVal >= start && resultVal <= end){
							resultColor = color[i];
							break;
						}
						start = end;
						end = end + range;
					}

				}else{

					var sliceHalf = slice / 2;
					// Min 값이 음수 일때
					if( isMinus ){

						if(resultVal < slideVal){
							var rangeVal = Math.ceil((slideVal - min) / sliceHalf);
							var start = min;
							var end = start + rangeVal;
							for(var i=0; i<sliceHalf; i++){
								if(resultVal >= start && resultVal <= end){
									resultColor = color[i];
									break;
								}
								start = end;
								end = end + rangeVal;
							}
						}else{
							var rangeVal = Math.ceil((max - slideVal) / sliceHalf);
							var start = slideVal;
							var end = start + rangeVal;
							for(var i=sliceHalf; i<slice; i++){
								if(resultVal >= start && resultVal <= end){
									resultColor = color[i];
									break;
								}
								start = end;
								end = end + rangeVal;
							}
						}

					// Min 값이 양수일때
					}else if( !isMinus ){
						if(resultVal < slideVal){
							var rangeVal = slideVal / sliceHalf;
							var start = min;
							var end = start + rangeVal;
							for(var i=0; i<sliceHalf; i++){
								if(resultVal >= start && resultVal <= end){
									resultColor = color[i];
									break;
								}
								start = end;
								end = end + rangeVal;
							}
						}else{
							var rangeVal = max / sliceHalf;
							var start = slideVal;
							var end = start + rangeVal;
							for(var i=sliceHalf; i<slice; i++){
								if(resultVal >= start && resultVal <= end){
									resultColor = color[i];
									break;
								}
								start = end;
								end = end + rangeVal;
							}
						}
					}
				}

				var resolution = GMXMAP.getView().getResolution();

				if(resolution > 0.3){
					return new ol.style.Style({
						fill: new ol.style.Fill({
							color: resultColor
						})
					});
				}else{
					return new ol.style.Style({
						fill: new ol.style.Fill({
							color: resultColor
						}),
						text: new ol.style.Text({
							font: '15px Calibri,sans-serif',
							text: feature.get('result_val'),
							fill: new ol.style.Fill({
								color: '#000'
							}),
							stroke: new ol.style.Stroke({
								color: '#fff',
								width: 3
							})
						})
					});
				}
			}

			this.gridVector10m = new ol.layer.Vector({
				zIndex : 10000,
				opacity : 0.3,
				minResolution : 0,
				maxResolution : 2,
				//renderMode : "image",
				style : colorFunction,
				//updateWhileAnimating : true,
				source : new ol.source.Vector({
					strategy : ol.loadingstrategy.bbox,
					loader : function(extent, resolution, projection) {
						var _source = Public.BIGDATA.View.gridVector10m.getSource();
						var _epsg = projection.getCode();
						var _format = new ol.format.GeoJSON();
						var _wfsParam = {
							tblId : tbl,
							geometryType : "polygon",
							bbox : extent.join(','),
							GRID : "10m"
						}

						$.ajax({
							url : _common.context() + "/bigData/getAnalyzeLayer",
							type : 'POST',
							data : _wfsParam,
							dataType : 'json',
							beforeSend : function() {
								_source.clear();
							},
							success : function(data) {
								var features = _format.readFeatures(data);
								_source.addFeatures(features);
							}
						});
					}
				})
			});

			this.gridVector100m = new ol.layer.Vector({
				zIndex : 10000,
				opacity : 0.3,
				minResolution : 2,
				maxResolution : 9.543932614919001,
				//renderMode : "image",
				style : colorFunction,
				//updateWhileAnimating : true,
				source : new ol.source.Vector({
					strategy : ol.loadingstrategy.bbox,
					loader : function(extent, resolution, projection) {
						var _source = Public.BIGDATA.View.gridVector100m.getSource();
						var _epsg = projection.getCode();
						var _format = new ol.format.GeoJSON();
						var _wfsParam = {
								tblId : tbl,
								geometryType : "polygon",
								bbox : extent.join(','),
								GRID : "100m"
						}

						$.ajax({
							url : _common.context() + "/bigData/getAnalyzeLayer",
							type : 'POST',
							data : _wfsParam,
							dataType : 'json',
							beforeSend : function() {
								_source.clear();
							},
							success : function(data) {
								var features = _format.readFeatures(data);
								_source.addFeatures(features);
							}
						});
					}
				})
			});

			var weightFunction = function(feature){
				var result = 0;
				var resultVal = Number(feature.getProperties().resultVal);
				var start = min;
				var end = start + range;

				if(sortTyp == "desc"){
					for(var i=0; i<slice; i++){
						if(resultVal >= start && resultVal <= end){
							result = Number("0." + i);
							result += 0.1;
							break;
						}
						start = end;
						end = end + range;
					}
				}else if(sortTyp == "asc"){
					for(var i=slice; i>0; i--){
						if(resultVal >= start && resultVal <= end){
							result = Number("0." + i);
							result += 0.1;
							break;
						}
						start = end;
						end = end + range;
					}
				}

				return result;
			}

			var mapSize = GMXMAP.getSize();
			this.heatVector = new ol.layer.Heatmap({
				zIndex : 10000,
				minResolution : 9.543932614919001,
				maxResolution : Infinity,
				/*blur: 35,
				radius: 5,
				shadow: 550,*/
				opacity: 0.45,
				renderMode : "image",
				//gradient: ["#FFFFFF", "#BFCCFF", "#A0E6FF", "#80FFFF", "#93FF7A", "#FFFF00", "#FFC800", "#FF9100", "#FF0000", "#c80000"],
				//gradient : color,
				weight : weightFunction,
				source : new ol.source.Vector({
					strategy : ol.loadingstrategy.bbox,
					loader : function(extent, resolution, projection) {
						var _source = Public.BIGDATA.View.heatVector.getSource();
						var _epsg = projection.getCode();
						var _format = new ol.format.GeoJSON();
						var _wfsParam = {
							MGR_NO : tbl,
							EPSG : 5186,
							MAP_WIDTH : mapSize[0],
							MAP_HEIGHT : mapSize[1],
							//geometryType : "polygon",
							BBOX : extent.join(','),
							GRID : 50
						}
						$.ajax({
							url : _common.context() + "/bigData/getAnalyzeResult.json",
							type : 'POST',
							data : _wfsParam,
							dataType : 'json',
							beforeSend : function() {
								_source.clear();
							},
							success : function(data) {
								/*var features = _format.readFeatures(data);
								_source.addFeatures(features);*/

								var length = data.length;
								for(var i=0; i<length; i++){
									var feature = new ol.Feature({
										geometry : new ol.geom.Point([data[i].x, data[i].y])
										//weight: Number(data[i].v)
									});
									feature.setProperties({ "resultVal" : data[i].v });
									_source.addFeature(feature);
								}
							}
						});
					}
				})
			});

			GMXMAP.addLayer(this.gridVector10m);
			GMXMAP.addLayer(this.gridVector100m);
			GMXMAP.addLayer(this.heatVector);

			Public.StopEvent = function() {

				this.BIGDATA.View.slideVal = null;

				if (this.BIGDATA.View.gridVector10m != null) {
					this.BIGDATA.View.gridVector10m.getSource().clear();
					GMXMAP.removeLayer(this.BIGDATA.View.gridVector10m);
					this.BIGDATA.View.gridVector10m = null;
				}

				if (this.BIGDATA.View.gridVector100m != null) {
					this.BIGDATA.View.gridVector100m.getSource().clear();
					GMXMAP.removeLayer(this.BIGDATA.View.gridVector100m);
					this.BIGDATA.View.gridVector100m = null;
				}

				if (this.BIGDATA.View.heatVector != null) {
					this.BIGDATA.View.heatVector.getSource().clear();
					GMXMAP.removeLayer(this.BIGDATA.View.heatVector);
					this.BIGDATA.View.heatVector = null;
				}

				// TODO importLayer is null.
				/*$("body > #tabs").find(Public.BIGDATA.PV).find(".close").click(function(){
					var layerList = GMXMAP.getLayers().getArray();
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
				this.StopEvent = null;
			}
		}
	},

	Geometry : {
		vector : null,
		interaction : null,
		snapInteraction : null,
		selectInteraction : null,
		modifyInteraction : null,
		holeInteraction : null,

		DrawStart : function(trIdx, wkt) {
			/*if(Public.StopEvent){
				if(Public.BIGDATA.Geometry.interaction){
					Public.BIGDATA.Geometry.interaction.setActive(true);
				}
				return false;
			}*/

			if(!this.vector){
				this.vector = new ol.layer.Vector({
					makeType : "make_geometry",
					source : new ol.source.Vector({
						wrapX : false
					})
				});
				GMXMAP.addLayer(this.vector);
			}

			if(this.vector){
				if(!_common.utils.isNullAndEmpty(wkt)){
					var format = new ol.format.WKT();
					var feature = format.readFeature(wkt, {
						dataProjection: "EPSG:5186",
						featureProjection: "EPSG:5186"
					});

					var prop = {
						"trIdx" : trIdx,
						"wkt" : wkt
					};

					var getStyle = function(color, width) {
						if (width == null) width = 2;
						return new ol.style.Style({
							stroke : new ol.style.Stroke({
								color : color,
								width : width
							}),
							fill : new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.5)'
							})
						})
					};

					feature.setProperties(prop);
					feature.setStyle(getStyle("blue"));

					this.vector.getSource().addFeature(feature);

					var $tr = $(".contentWrapper").find("#geometryTable").find("tbody").find("tr:eq(" + trIdx + ")");
					$tr.find("img.check").show();
					$tr.find("img.check").click(function(){
						GMXMAP.getView().fit(feature.getGeometry().getExtent());
					});

					Public.StopEvent = function() {
						$(".contentWrapper").find("#drawCncl").hide("slow");
						if (this.BIGDATA.Geometry.interaction != null) {
							this.BIGDATA.Geometry.interaction.setActive(false);
							GMXMAP.removeInteraction(this.BIGDATA.Geometry.interaction);
							this.BIGDATA.Geometry.interaction = null;
						}
						this.StopEvent = null;
					}

					return false;

				}else{
					var features = this.vector.getSource().getFeatures();
					for(var i=0; i<features.length; i++){
						if(Number(features[i].get("trIdx")) == Number(trIdx)){
							this.vector.getSource().removeFeature(features[i]);
							$(".contentWrapper").find("#geometryTable").find("tbody").find("tr").eq(trIdx).find("img.check").hide();
							break;
						}
					}
				}
			}

			/*this.selectInteraction = new ol.interaction.Select({
				condition: ol.events.condition.singleClick,
				toggleCondition: ol.events.condition.shiftKeyOnly,
				layers: function (layer) {
					return layer.get('makeType') == 'make_geometry';
				}
			});
			this.modifyInteraction = new ol.interaction.Modify({
				features : Public.BIGDATA.Geometry.selectInteraction.getFeatures()
			});
			this.snapInteraction = new ol.interaction.Snap({
				source : Public.BIGDATA.Geometry.vector.getSource()
			});*/
			this.interaction = new ol.interaction.Draw({
				source : Public.BIGDATA.Geometry.vector.getSource(),
				type : "Polygon"
			});

			/*this.selectInteraction.on('select', function(evt){
				var selected = evt.selected;
				var deselected = evt.deselected;
				for (var i = 0; i < deselected.length; i++) {
					deselected[i].setStyle(null);
				}

				if (selected.length) {
					selected.forEach(function(feature){
						feature.setStyle(new ol.style.Style({
							stroke: new ol.style.Stroke({
								color : 'blue',
								width : 3
							}),
							fill : new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.2)'
							})
						}));
					});
				} else {
					deselected.forEach(function(feature){
						feature.setStyle(null);
					});
				}
			});

			this.modifyInteraction.on('modifyend',function(e){
				var feature = e.features.getArray()[0];
				var prop = feature.getProperties();

				var format = new ol.format.WKT();
				var wkt = format.writeGeometry(feature.getGeometry());
			});*/

			this.interaction.on("drawend", function(e) {
				var format = new ol.format.WKT();
				var drawWkt = format.writeGeometry(e.feature.getGeometry());
				var prop = {
					//"ol_uid" : e.feature.ol_uid,
					"trIdx" : trIdx,
					"wkt" : drawWkt
				};
				var getStyle = function(color, width) {
					if (width == null) width = 2;
					return new ol.style.Style({
						stroke : new ol.style.Stroke({
							color : color,
							width : width
						}),
						fill : new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.5)'
						})
					})
				};

				e.feature.setProperties(prop);
				e.feature.setStyle(getStyle("blue"));

				$(".contentWrapper").find("#columnTable").find("tbody").find("tr:eq(" + trIdx + ")").attr("wkt", drawWkt);

				var $dtr = $(".contentWrapper").find("#geometryTable").find("tbody").find("tr:eq(" + trIdx + ")");
				$dtr.find("input[type=hidden]").val(drawWkt);
				$dtr.find("img.check").show();
				$dtr.find("img.check").click(function(){
					GMXMAP.getView().fit(e.feature.getGeometry().getExtent());
				});
				$dtr.find("button.drawStartBtn").text("다시 그리기");

				if(Public.StopEvent){
					var timeout = setTimeout(function(){
						Public.StopEvent();
						clearTimeout(timeout);
						timeout = null;
					}, 100);
				}
			});

			$(".contentWrapper").find("#drawCncl").show("slow");
			GMXMAP.addInteraction(this.interaction);
			/*GMXMAP.addInteraction(this.snapInteraction);
			GMXMAP.addInteraction(this.modifyInteraction);
			GMXMAP.addInteraction(this.selectInteraction);*/

			Public.StopEvent = function() {
				$(".contentWrapper").find("#drawCncl").hide("slow");
				/*if (this.BIGDATA.Geometry.selectInteraction != null) {
					this.BIGDATA.Geometry.selectInteraction.setActive(false);
					GMXMAP.removeInteraction(this.BIGDATA.Geometry.selectInteraction);
					this.BIGDATA.Geometry.selectInteraction = null;
				}
				if (this.BIGDATA.Geometry.modifyInteraction != null) {
					this.BIGDATA.Geometry.modifyInteraction.setActive(false);
					GMXMAP.removeInteraction(this.BIGDATA.Geometry.modifyInteraction);
					this.BIGDATA.Geometry.modifyInteraction = null;
				}
				if (this.BIGDATA.Geometry.snapInteraction != null) {
					this.BIGDATA.Geometry.snapInteraction.setActive(false);
					GMXMAP.removeInteraction(this.BIGDATA.Geometry.snapInteraction);
					this.BIGDATA.Geometry.snapInteraction = null;
				}*/
				if (this.BIGDATA.Geometry.interaction != null) {
					this.BIGDATA.Geometry.interaction.setActive(false);
					GMXMAP.removeInteraction(this.BIGDATA.Geometry.interaction);
					this.BIGDATA.Geometry.interaction = null;
				}
				this.StopEvent = null;
			}
		},

		DrawHoleStart : function(trIdx) {
			/*if(Public.StopEvent){
				if(Public.BIGDATA.Geometry.holeInteraction){
					Public.BIGDATA.Geometry.holeInteraction.setActive(true);
				}
				return false;
			}*/

			if(!this.vector){
				this.vector = new ol.layer.Vector({
					makeType : "make_geometry",
					source : new ol.source.Vector({
						wrapX : false
					})
				});
				GMXMAP.addLayer(this.vector);
			}

			this.holeInteraction = new ol.interaction.DrawHole({
				layers : [Public.BIGDATA.Geometry.vector],
				trIdx : trIdx
			});

			$(".contentWrapper").find("#drawCncl").show("slow");
			GMXMAP.addInteraction(this.holeInteraction);

			Public.StopEvent = function() {
				$(".contentWrapper").find("#drawCncl").hide("slow");
				if (this.BIGDATA.Geometry.holeInteraction != null) {
					this.BIGDATA.Geometry.holeInteraction.setActive(false);
					GMXMAP.removeInteraction(this.BIGDATA.Geometry.holeInteraction);
					this.BIGDATA.Geometry.holeInteraction = null;
				}
				this.StopEvent = null;
			}
		}
	},

	Covid : {

		vector : null,

		Start : function(){
			if(Public.StopEvent != null) Public.StopEvent();

			this.vector = new ol.layer.Vector({
				name : "covid",
				visible : true,
				updateWhileAnimating : false,
				updateWhileInteracting : false,
				zIndex : 10,

				source : new ol.source.Cluster({
					distance: 1,
					source: new ol.source.Vector({
						strategy : ol.loadingstrategy.bbox,
						loader : function(extent, resolution, projection) {
							var _source = this;
							var _format = new ol.format.GeoJSON();
							var _wfsParam = {
								service : 'WFS',
								version : '1.1.0',
								request : 'GetFeature',
								typename : "gmx:asset_covid",
								outputFormat : 'json',
								srsname : "EPSG:5186",
								tbl : "asset_covid",
								bbox : extent.join(',') + ',EPSG:5186'
							}
							$.ajax({
								url : "../CustomWFS",
								data : _wfsParam,
								dataType : 'json',
								beforeSend : function() {
									_source.clear();
								},
								success : function(data) {
									var features = _format.readFeatures(data);
									_source.addFeatures(features);
									data = null;
								},
								error : function(xhr, status, error) {
								}
							});
						}
					})
				}),

				style : function(features){
					var clusterSize = features.get("features").length;
					var url = "../res/sym/nms/c43.png";
					if(clusterSize >= 2 && clusterSize <= 3) url = "../res/sym/nms/c44.png";
					if(clusterSize >= 4 && clusterSize <= 5) url = "../res/sym/nms/c45.png";
					if(clusterSize >= 6) url = "../res/sym/nms/c46.png";

					return new ol.style.Style({
						image: new ol.style.Icon({
							anchor : [ 0.5, 0.5 ],
							size : [ 22, 22 ],
							scale : 0.7,
							crossOrigin: "anonymous",
							src: url
						})
					})
				}
			});

			GMXMAP.addLayer(this.vector);

			var timeout = setTimeout(function(){
				GMXMAP.getView().fit(Public.BIGDATA.Covid.vector.getSource().getExtent());
				clearTimeout(timeout);
				timeout = null;
			}, 1000);
			//GMXMAP.moveToAnimation(0, xy);

			Public.StopEvent = function() {
				if (this.BIGDATA.Covid.vector != null) {
					this.BIGDATA.Covid.vector.getSource().clear();
					GMXMAP.removeLayer(this.BIGDATA.Covid.vector);
					this.BIGDATA.Covid.vector = null;
				}
				this.StopEvent = null;
			}
		}
	}

}