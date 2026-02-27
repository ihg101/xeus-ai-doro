var nmsMission = {

	interval : null,

	doWork : function(){
		/**
		 * 171226 이은규
		 * 지도 이동 기능 임시 제거
		 */
		/*xeusLayout.mapService.getMap().getView().animate({
			center : [ 210870.314153917,365105.19027988694 ],
			zoom : 14,
			duration : 1000
		});*/

		this.interval = setInterval(function(){
			_common.callAjax("/nms/getStatusList.json", {type : "INF"}, function(json){
				if(json.result.length > 0){
					var $tbl = $(".table_data");
					for(var i=0; i<json.result.length; i++){
						var k = json.result[i].mgrNo;
						var t = json.result[i].recvDat;
						if($(".table_data").find("tr[k=" + k + "]").length == 0){
							var isContain = 0;
							$(".table_data").find("tr[k=" + k + "]").each(function(i, e){
								if($(e).attr("t") == t) isContain++;
							});
							if(isContain == 0){
								var $tr = $("<tr>" +
												"<td class='table_other'>" + new Date().formatDate(json.result[i].recvDat).substring(11) + "</td>" +
												"<td class='table_other'>기반시설</td>" +
												"<td class='table_other'>" + _common.getCodeByName("C13", json.result[i].stateCd) + "</td>" +
												"<td class='table_message'>" + json.result[i].facilityNm + "</td>" +
											"</tr>").attr({ k : k, t : t });

								$tbl.prepend($tr);

								$tbl.parent().animate({
									scrollTop: 0
								}, 500);

								var duration = 200;
								for(var i=0; i<10; i++){
									$tr.find("td").animate({"color" : "#FFA500"},   duration);
									$tr.find("td").animate({"color" : "#88878C"}, duration);
								}

								$tr.click(function(){
									var $rightEtc = $("#rightEtc");
									_common.callAjax("/nms/getInfraDetailView.do", { k : k }, function(view){
										$rightEtc.html(view);
										var lng = Number($rightEtc.find("th:contains('경도')").next().children().val());
										var lat = Number($rightEtc.find("th:contains('위도')").next().children().val());
										if(!isNaN(lng) && !isNaN(lat)){
											var center = Spatial.convertProjection([lng, lat], "EPSG:4326", "EPSG:5186");
											xeusLayout.mapService.getMap().getView().animate({
												center : center,
												zoom : 19,
												duration : 1000
											});
										}
										$rightEtc.find(".blueBtn, .close, style, script").remove();
										$rightEtc.find("th:contains('심볼')").parent().remove();
										$rightEtc.find(".searchTitle").css({
											"padding" : "10px",
											"font-size" : "15px"
										});
										$rightEtc.find("table").css({
											"width" : "100%",
											"color" : "white"
										});
										$rightEtc.find("th").css({
											"background" : "none",
											"border-bottom" : "1px solid #333333",
											"height" : "30px",
											"width" : "100px",
											"cursor" : "default"
										});
										$rightEtc.find("input, select").css({
											"color" : "white",
											"border" : "none",
											"outline" : "none",
											"background" : "none"
										});
										$rightEtc.find("select").css({
											"appearance" : "none"
										});
										$rightEtc.find(".imgs").css({
											"width" : "350px"
										});
										$rightEtc.find("input, select").prop("readOnly", true);
										$rightEtc.find("input[type=checkbox], select").prop("disabled", true);
									});
								});

							}
						}
					}
				}
			});
		}, 5000);

		setTimeout(function(){
			geomex.xeus.NMSTheme.createThemeWrap();
		}, 200)

		xeusLayout.StopEvent = function(){
			clearInterval(nmsMission.interval);
			nmsMission.interval = null;
			$("#nmsThemeWrap").remove();
		}
	},

	createPopup : function(){
		var Class = this;
		var container = document.getElementById('popup');
		var content = document.getElementById('popup-content');
		var closer = document.getElementById('popup-closer');

		this.Popup = new ol.Overlay({
			element: container,
			autoPan: true,
			autoPanAnimation: {
				duration: 250
			}
		});

		closer.onclick = function() {
			Class.Popup.setPosition(undefined);
			closer.blur();
			return false;
		};

		xeusMap.getMap().addOverlay(this.Popup);
		xeusMap.getMap().on('singleclick', function(evt) {
			var feature = xeusMap.getMap().forEachFeatureAtPixel(evt.pixel, function(feature) {
				return feature;
			});

			if(feature != null){
				var id = feature.getId();
				var attr = feature.getProperties();
				var tbl = id.split(".")[0];

				if(tbl == "nms"){
					var coordinate = evt.coordinate;

					var $div = $("<div></div>").css("text-align", "center");
					var $table = $("<table></table>");
					for(var key in attr){
						if(key != "geometry"){
							$table.append("<tr><th>" + key + "</th><td>" + attr[key] + "</td></tr>");
						}
					}

					$table.find("th, td").css("color", "black");
					$table.find("th, td").css("border-bottom", "1px solid #ddd");

					$div.append($table);
					$(content).html($div);

					Class.Popup.setPosition(coordinate);
					$(".ol-popup").show();
				}
			}

		});
	}
};