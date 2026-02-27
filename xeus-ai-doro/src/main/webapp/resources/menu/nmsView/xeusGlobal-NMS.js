/**
 * <pre>
 * NMS관련 이벤트 입니다.
 * </pre>
 *
 * @auther 이주영
 */
Public.NMS = {

	Monitoring : {
		interval : null,
		getList : function(){
			_common.callAjax("/nms/getStatusList.json", {}, function(json) {

				$(".contentWrapper").find("#listTable").find("tbody").html("");
				var result = json.result;
				var length = result.length;

				for(var i=0; i<length; i++){
					var mgrNo = result[i].mgrNo;
					var type = mgrNo.substring(0, 3);
					var name = "";

					if("CTV" == type){
						type = "CCTV";
						name = result[i].cctvNm;
					}
					if("INF" == type){
						type = "스위치";
						name = result[i].facilityNm;
					}
					if("RNF" == type){
						type = "강우량계";
						name = result[i].raingaugeName;
					}
					if("PUM" == type){
						type = "펌프장";
						name = result[i].pumpjangName;
					}
					if("TES" == type){
						type = "블랙박스";
						name = JSON.parse(result[i].stateJson)["address"];
					}

					var str = "";
					str += "<tr class='tCenter' k='" + result[i].mgrNo + "' ftype='" + type + "'>";
					str += 	"<td>" + type + "</td>";
					str += 	"<td>" + _common.utils.validNull(name) + "</td>";
					str += 	"<td>" + _common.getCodeByName("C13", result[i].stateCd) + "</td>";
					str += 	"<td>" + new Date().formatDate(result[i].recvDat).substring(5) + "</td>";
					str += 	"<td>";
					str += 		"<button class='locBtn btn_t'>위치</button>";
//					str += 		"<button class='detailBtn btn_t'>상세</button>";
					str += 	"</td>";
					str += "</tr>";

					var $tr = $(str);
					$tr.data(result[i]);

					$(".contentWrapper").find("#listTable").find("tbody").append($tr);
				}

				/* 위치 버튼 이벤트 입니다. */
				$(".contentWrapper").find(".locBtn").click(function(){
					var v = $(this).parent().parent().attr("k");
					_common.callAjax("/nms/getGeometryLocation.json", {k : v}, function(json) {
						GMXMAP.addPulse([Number(json.result[0].annoX), Number(json.result[0].annoY)],true);
					});
				});

				/* 상세 버튼 이벤트 입니다. */
				$(".contentWrapper").find(".detailBtn").click(function(){
					var fType = $(this).parent().parent().attr("fType");
					var jsonStr = $(this).parent().parent().data("stateJson");

					xeusJsonFacilityParser.setJson(jsonStr);
					if(fType == "스위치") 	xeusJsonFacilityParser.getInfra();
					if(fType == "펌프장") 	xeusJsonFacilityParser.getPump();
					if(fType == "강우량계") xeusJsonFacilityParser.getRainFall();
					if(fType == "블랙박스") xeusJsonFacilityParser.getBlackBox();
				});
			});
		},
		Start : function(time) {
			if (this.interval != null) clearInterval(this.interval);
			this.interval = setInterval(function() {
				Public.NMS.Monitoring.getList();
			}, time);

			Public.StopEvent = function() {
				clearInterval(this.NMS.Monitoring.interval);
				this.NMS.Monitoring.interval = null;
				this.StopEvent = null;
			}
		}
	},

	Infra : {
		Start : function(evt) {
			var coordinates = evt.coordinate;
			var epsg = GMXMAP.getView().getProjection().getCode();
			var mainCenter = ol.proj.transform(coordinates, epsg, "EPSG:4326");

			$("#newregInfraWrap, #infraMngWrap").find("#regTable #lng").val(mainCenter[0]);
			$("#newregInfraWrap, #infraMngWrap").find("#regTable #lat").val(mainCenter[1]);

			GMXMAP.addPulse(coordinates);

			if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("위치가 설정되었습니다.", 2000);

			$("#newregInfraWrap, #infraMngWrap").find(".selectCancel").hide(500);
			GMXMAP.un("click", Public.NMS.Infra.Start);

			Public.StopEvent = function(){
		        $("#newregInfraWrap, #infraMngWrap").find(".selectCancel").hide(500);
		        GMXMAP.un("click", Public.NMS.Infra.Start);
		        this.StopEvent = null;
		    }
		}
	},

	CCTV : {
		Start : function(evt) {
			var coordinates = evt.coordinate;
			var epsg = GMXMAP.getView().getProjection().getCode();
			var mainCenter = ol.proj.transform(coordinates, epsg, "EPSG:4326");

			$("#newregCctvWrap, #cctvMngWrap").find("#centerX").val(coordinates[0]);
			$("#newregCctvWrap, #cctvMngWrap").find("#centerY").val(coordinates[1]);

			$("#newregCctvWrap, #cctvMngWrap").find("#lng").val(mainCenter[0]);
			$("#newregCctvWrap, #cctvMngWrap").find("#lat").val(mainCenter[1]);

			GMXMAP.addPulse(coordinates);

			if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("위치가 설정되었습니다.", 2000);

			$("#newregCctvWrap, #cctvMngWrap").find(".selectCancel").hide(500);
			GMXMAP.un("click", Public.NMS.CCTV.Start);

			Public.StopEvent = function(){
		        $("#newregCctvWrap, #cctvMngWrap").find(".selectCancel").hide(500);
		        GMXMAP.un("click", Public.NMS.CCTV.Start);
		        this.StopEvent = null;
		    }
		}
	},

	UMBRL : {
		Start : function(evt) {
			var coordinates = evt.coordinate;
			var epsg = GMXMAP.getView().getProjection().getCode();
			var mainCenter = ol.proj.transform(coordinates, epsg, 'EPSG:4326');
			$(".contentWrapper").find("#regTable #lon").val(mainCenter[0]);
			$(".contentWrapper").find("#regTable #lat").val(mainCenter[1]);

			//$("body").css("cursor", "default");
			$(".contentWrapper").find(".selectCancel").hide(500);
			GMXMAP.un('click', Public.NMS.UMBRL.Start);

			Public.StopEvent = function(){
				//$("body").css("cursor", "default").off("click");
		        $(".contentWrapper").find(".selectCancel").hide(500);
		        GMXMAP.un('click', Public.NMS.UMBRL.Start);
		        this.StopEvent = null;
		    }
		}
	},

	ANGLE : {
		Start : function(evt) {
			var coordinates = evt.coordinate;

			var centerX = $("#cctvMngWrap").find("#centerX").val();
			var centerY = $("#cctvMngWrap").find("#centerY").val();
			var angle = Spatial.getAngle([centerX, centerY], coordinates);
			$("#cctvMngWrap").find("#angle").val(angle);

			GMXMAP.addPulse(coordinates);

			if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification("촬영각도가 설정되었습니다.", 2000);

			$("#cctvMngWrap").find(".selectAngleCancel").hide(500);
			GMXMAP.un("click", Public.NMS.ANGLE.Start);

			Public.StopEvent = function(){
		        $("#cctvMngWrap").find(".selectAngleCancel").hide(500);
		        GMXMAP.un("click", Public.NMS.ANGLE.Start);
		        this.StopEvent = null;
		    }
		}
	},

	Cable : {
		vector : null,
		//infraVector : null,
		interaction : null,
		snapInteraction : null,
		selectInteraction : null,
		modifyInteraction : null,

		snaps : [
	        "asset_cctv",
			"asset_cctv_view",

			"asset_infra_cctv",
			"asset_infra_wifi",
			"asset_infra_lora",

			"asset_infra_box_cctv",
			"asset_infra_box_posi",
			"asset_infra_box_main",
			"asset_infra_box_comp",

			"ecl_pole_p",
			"ecl_bank_p",
			"ecl_sw_p"
		],

		createSnaps : function(){
			var snapArray = this.snaps;
			for(var i=0; i<snapArray.length; i++){
				this[snapArray[i]] = new ol.interaction.Snap({ source : GMXMAP.getLayerById(snapArray[i]).getSource() });
				this[snapArray[i]].setActive(GMXMAP.getLayerById(snapArray[i]).getVisible());
				GMXMAP.addInteraction(this[snapArray[i]]);
			}
		},

		activeSnaps : function(){
			var snapArray = this.snaps;
			for(var i=0; i<snapArray.length; i++){
				if(this[snapArray[i]]){
					this[snapArray[i]].setActive(GMXMAP.getLayerById(snapArray[i]).getVisible());
				}
			}
		},

		removeSnaps : function(){
			var snapArray = this.snaps;
			for(var i=0; i<snapArray.length; i++){
				if (this[snapArray[i]]) {
					this[snapArray[i]].setActive(false);
					GMXMAP.removeInteraction(this[snapArray[i]]);
					this[snapArray[i]] = null;

					delete this[snapArray[i]];
				}
			}
		},

		/**
		 * @Deprecated
		 */
		Search : function(){
			if(Public.StopEvent != null) Public.StopEvent();

			var vector = GMXMAP.getLayer("물리망");
			var features = vector.getSource().getFeatures();
			var length = features.length;

			var attr = {
				linkGbnCd : $(".contentWrapper").find("#linkGbnCd").val(),
				netGbnCd : $(".contentWrapper").find("#netGbnCd").val(),
				netNm : $(".contentWrapper").find("#netNm").val(),
				cableTyp : $(".contentWrapper").find("#cableTyp").val(),
				cableDesc : $(".contentWrapper").find("#cableDesc").val(),
				stMgrNo : $(".contentWrapper").find("#stMgrNo").val(),
				edMgrNo : $(".contentWrapper").find("#edMgrNo").val()
			};

			for(var i=0; i<length; i++){
				var prop = features[i].getProperties();
			}
		},

		EditStart : function() {
			/*if (Public.StopEvent != null) Public.StopEvent();

			var vector = GMXMAP.getLayerByName("물리망");
			this.interaction = new ol.interaction.Select({
				multi : false,
				layers : [vector],
				hitTolerance : 5
			});

			this.modifyInteraction = new ol.interaction.Modify({
				features : Public.NMS.Cable.interaction.getFeatures()
			});

			$(".contentWrapper").find("#drawCncl").show("slow");
			GMXMAP.addInteraction(this.interaction);
			GMXMAP.addInteraction(this.modifyInteraction);*/



			if (Public.StopEvent != null) Public.StopEvent();

			this.interaction = new ol.interaction.Select({
				multi : false,
				hitTolerance : 5
			});

			this.modifyInteraction = new ol.interaction.Modify({
				features : Public.NMS.Cable.interaction.getFeatures()
			});

			$(".contentWrapper").find("#drawCncl").show("slow");
			GMXMAP.addInteraction(this.interaction);
			GMXMAP.addInteraction(this.modifyInteraction);

			var inter = this.interaction;
			this.interaction.on('select', function(e) {
				for (var i = 0; i < e.deselected.length; i++) {
					e.deselected[i].setStyle(null);
				}
				if (inter.getFeatures().getArray().length != 0) {
					if (e.selected[0] != null) {
						if (e.selected[0].getId().split(".")[0] != "asset_netwk") {
							inter.getFeatures().clear();
							e.preventDefault();
							return false;
						}
					}

					var data = e.selected[0].getProperties();
					/*e.selected[0].setStyle(new ol.style.Style({
						stroke : new ol.style.Stroke({
							color : 'blue',
							width : 3
						})
					}));*/

                    e.selected[0].setStyle(Public.NMS.Cable.CreateLineStyle(e.selected[0], 'blue'));

					$(".contentWrapper").find("#gid").val(e.selected[0].getId().split(".")[1]);
					$(".contentWrapper").find("#linkGbnCd").val(data["link_gbn_cd"]);
					$(".contentWrapper").find("#netGbnCd").val(data["net_gbn_cd"]);
					$(".contentWrapper").find("#lineColor").val(data["line_color"]);
					$(".contentWrapper").find("#netNm").val(data["net_nm"]);
					$(".contentWrapper").find("#cableTyp").val(data["cable_typ"]);
					$(".contentWrapper").find("#cableDesc").val(data["cable_desc"]);
					$(".contentWrapper").find("#stMgrNo").val(data["st_mgr_no"]);
					$(".contentWrapper").find("#edMgrNo").val(data["ed_mgr_no"]);
					$(".contentWrapper").find('#themeMgrNo').val(data["theme_mgr_no"]).attr('select');

					var optData = $(".contentWrapper").find('#themeMgrNo').find('option[value='+data["theme_mgr_no"]+']').data();
					$(".contentWrapper").find("#netGbnCd").val(optData.netGbnCd).attr('select');
					$(".contentWrapper").find("#ringNo").val(optData.ringNo);
					$(".contentWrapper").find("#netNm").val(optData.netNm);
					$(".contentWrapper").find("#linkGbnCd").val(optData.linkGbnCd).attr('select');
					//$(".contentWrapper").find("#cableTyp").val(optData.cableTyp);
					//$(".contentWrapper").find("#lineColor").val(optData.lineColor);

					$(".contentWrapper").find('#themeMgrNo').find('option').addClass('hidden');
					$(".contentWrapper").find('#themeMgrNo').find('option[gbn='+optData.netGbnCd+']').removeClass('hidden');

					var cableTyp = "";
					if(optData.cableTyp == "1") cableTyp = "실선";
					if(optData.cableTyp == "2") cableTyp = "점선";
                    $(".contentWrapper").find('#cableTyp').val(cableTyp);
                    $(".contentWrapper").find('#lineColor').css('stroke', _common.utils.validNull(optData.lineColor));
                    if(optData.cableTyp == "1")	$(".contentWrapper").find('#lineColor').css('stroke-dasharray', '');
                    if(optData.cableTyp == "2")	$(".contentWrapper").find('#lineColor').css('stroke-dasharray', '10, 4');

				}
			});

			this.modifyInteraction.on('modifyend',function(e){
				var feature = e.features.getArray()[0];
				var prop = feature.getProperties();
$
				var format = new ol.format.WKT();
				var wkt = format.writeGeometry(feature.getGeometry());
				$(".contentWrapper").find("#wkt").val(wkt);

				feature.setStyle(null);
				feature.setStyle(Public.NMS.Cable.CreateLineStyle(feature, 'blue'));
			});

			Public.StopEvent = function() {
				if (this.NMS.Cable.interaction != null) {
					var array = this.NMS.Cable.interaction.getFeatures().getArray();
					for (var i = 0; i < array.length; i++) {
						array[i].setStyle(null);
					}
					GMXMAP.removeInteraction(this.NMS.Cable.interaction);
					this.NMS.Cable.interaction.getFeatures().clear();
					this.NMS.Cable.interaction = null;
					this.StopEvent = null;
				}

				if (this.NMS.Cable.modifyInteraction != null) {
					this.NMS.Cable.modifyInteraction.setActive(false);
					GMXMAP.removeInteraction(this.NMS.Cable.modifyInteraction);
					this.NMS.Cable.modifyInteraction = null;
				}
			}
		},

		DrawStart : function(netGbn) {

			//출근해서 다시 확인해보기
			//다른 페이지에서 Public.StopEvent를 넣었을 수도 있으므로 if문의 조건을 바꿔야 함.

			/*if (Public.StopEvent != null) {
				Public.NMS.Cable.interaction.setActive(true);
				Public.NMS.Cable.snapInteraction.setActive(true);
				Public.NMS.Cable.modifyInteraction.setActive(false);
				Public.NMS.Cable.selectInteraction.setActive(false);
				return false;
			}*/

			if (Public.StopEvent != null) Public.StopEvent();

			this.vector = GMXMAP.getLayer("물리망");

			//그릴 당시엔 snap을 기반시설로 적용할 수 있도록 변경해보기
			//this.infraVector = GMXMAP.getLayerByName("기반시설");

			/*this.selectInteraction = new ol.interaction.Select({
				condition: ol.events.condition.singleClick,
				toggleCondition: ol.events.condition.shiftKeyOnly,
				layers: function (layer) {
					return layer.get('fullName') == 'asset_fnms';
				}
			});
			this.modifyInteraction = new ol.interaction.Modify({
				features : Public.NMS.Cable.selectInteraction.getFeatures()
			});*/
			this.snapInteraction = new ol.interaction.Snap({
				//TODO 시설물 레이어 없음
				source : Public.NMS.Cable.vector.getSource()
				//Public.NMS.Cable.infraVector.getSource()
			});
			this.interaction = new ol.interaction.Draw({
				source : Public.NMS.Cable.vector.getSource(),
				type : "LineString",
				snapTolerance : 3
			});

			/* this.selectInteraction.on('select', function(evt){
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
				$(".contentWrapper").find("option[ol_uid=" + prop["ol_uid"] + "]").attr("wkt", wkt);
			}); */

			this.interaction.on("drawend", function(e) {
				//if (_common.utils.isNullAndEmpty($(".contentWrapper").find("#netNm").val())) {
				if (_common.utils.isNullAndEmpty($(".contentWrapper").find("#themeMgrNo").val())) {
					//alert("케이블이름을 입력해 주세요.");
					//$(".contentWrapper").find("#cableNm").focus();
					alert("케이블테마를 선택하여 주십시오.");
					setTimeout(function() {
						Public.NMS.Cable.vector.getSource().removeFeature(e.feature);
					}, 100);
				} else {
					var format = new ol.format.WKT();
					var wkt = format.writeGeometry(e.feature.getGeometry());
					var prop = {
						"link_gbn_cd" : $(".contentWrapper").find("#linkGbnCd").val(),
						"cable_desc" : $(".contentWrapper").find("#cableDesc").val(),
						"st_mgr_no" : $(".contentWrapper").find("#stMgrNo").val(),
						"ed_mgr_no" : $(".contentWrapper").find("#edMgrNo").val(),
						"line_color" : $(".contentWrapper").find("#lineColor").val(),
						"net_gbn_cd" : $(".contentWrapper").find("#netGbnCd").val(),
						"net_nm" : $(".contentWrapper").find("#netNm").val(),
						"cable_typ" : $(".contentWrapper").find("#cableTyp").val(),
						"ring_no" : $(".contentWrapper").find("#ringNo").val(),
						"theme_mgr_no" : $(".contentWrapper").find("#themeMgrNo").val(),
						"ol_uid" : _common.utils.Random.getGUID12(),
						"wkt" : wkt,
						"tempFeature" : true
					};
					/*var getStyle = function(color, width) {
						if (width == null)
							width = 1;
						return new ol.style.Style({
							stroke : new ol.style.Stroke({
								color : color,
								width : width
							})
						})
					};*/
					//e.feature.setStyle(getStyle("blue"));
					e.feature.setProperties(prop);
					e.feature.setStyle(Public.NMS.Cable.CreateLineStyle(e.feature, 'blue'));

					var $option = $("<option>" + prop["net_nm"] + "</option>").attr(prop);
					$option.click(function() {
						var uid = $(this).attr("ol_uid");
						var features = Public.NMS.Cable.vector.getSource().getFeatures();
						if (features.length > 0) {
							for (var i = 0; i < features.length; i++) {
								var feature = features[i];
								//feature.setStyle(getStyle("blue"));

								if(feature.getProperties()["tempFeature"]){
									feature.setStyle(null);
									feature.setStyle(Public.NMS.Cable.CreateLineStyle(feature, 'blue'));
								}

								if (feature.get("ol_uid") == uid) {
									//feature.setStyle(getStyle("red", 2));

									e.feature.setStyle(null);
									e.feature.setStyle(Public.NMS.Cable.CreateLineStyle(e.feature, 'red'));

									var attr = feature.getProperties();
									$(".contentWrapper").find("#linkGbnCd").val(attr["link_gbn_cd"]);
									$(".contentWrapper").find("#lineColor").val(attr["line_color"]);
									$(".contentWrapper").find("#netGbnCd").val(attr["net_gbn_cd"]);
									$(".contentWrapper").find("#netNm").val(attr["net_nm"]);
									$(".contentWrapper").find("#cableTyp").val(attr["cable_typ"]);
									$(".contentWrapper").find("#cableDesc").val(attr["cable_desc"]);
									$(".contentWrapper").find("#stMgrNo").val(attr["st_mgr_no"]);
									$(".contentWrapper").find("#edMgrNo").val(attr["ed_mgr_no"]);
									$(".contentWrapper").find('#themeMgrNo').val(attr["theme_mgr_no"]).attr('select');

									var optData = $(".contentWrapper").find('#themeMgrNo').find('option[value='+attr["theme_mgr_no"]+']').data();
									$(".contentWrapper").find("#netGbnCd").val(optData.netGbnCd).attr('select');
									$(".contentWrapper").find("#ringNo").val(optData.ringNo);
									$(".contentWrapper").find("#lineColor").val(optData.lineColor);
									$(".contentWrapper").find("#netNm").val(optData.themeNm);
									$(".contentWrapper").find("#cableTyp").val(optData.cableTyp);
									$(".contentWrapper").find("#linkGbnCd").val(optData.link_gbn_cd).attr('select');
								}
							}
						}
					}).dblclick(function() {
						var $this = $(this);
						confirm("케이블을 삭제하시겠습니까?", function() {
							var uid = $this.attr("ol_uid");
							var features = Public.NMS.Cable.vector.getSource().getFeatures();
							if (features.length > 0) {
								for (var i = 0; i < features.length; i++) {
									var feature = features[i];
									if (feature.get("ol_uid") == uid) {
										Public.NMS.Cable.vector.getSource().removeFeature(feature);
									}
								}
							}
							$this.remove();
							//$(".contentWrapper").find(".sendData").val("");
							//$(".contentWrapper").find(".wide").val("");
							$(".contentWrapper").find("#cableDesc").val("");
						});
					});
					$(".contentWrapper").find("td#cableListWrapper").find("#cableList").find("optgroup").append($option);
					//$(".contentWrapper").find(".sendData").val("");
					//$(".contentWrapper").find(".wide").val("");
					$(".contentWrapper").find("#cableDesc").val("");

				}
			});

			$(".contentWrapper").find("#drawCncl").show("slow");
			GMXMAP.addInteraction(this.interaction);
			GMXMAP.addInteraction(this.snapInteraction);
			//GMXMAP.addInteraction(this.modifyInteraction);
			//GMXMAP.addInteraction(this.selectInteraction);

			this.createSnaps();

			$(".contentWrapper").find("input[type=checkbox].layer").change(function(){
				var timeout = setTimeout(function(){
					Public.NMS.Cable.activeSnaps();
					clearTimeout(timeout);
					timeout = null;
				}, 300);
			});

			Public.StopEvent = function() {
				$(".contentWrapper").find("#drawCncl").hide("slow");
				$(".contentWrapper").find("td#cableListWrapper").find("#cableList").find("optgroup").html("");
				/*if (this.NMS.Cable.selectInteraction != null) {
					this.NMS.Cable.selectInteraction.setActive(false);
					GMXMAP.removeInteraction(this.NMS.Cable.selectInteraction);
					this.NMS.Cable.selectInteraction = null;
				}
				if (this.NMS.Cable.modifyInteraction != null) {
					this.NMS.Cable.modifyInteraction.setActive(false);
					GMXMAP.removeInteraction(this.NMS.Cable.modifyInteraction);
					this.NMS.Cable.modifyInteraction = null;
				}*/
				if (this.NMS.Cable.snapInteraction != null) {
					this.NMS.Cable.snapInteraction.setActive(false);
					GMXMAP.removeInteraction(this.NMS.Cable.snapInteraction);
					this.NMS.Cable.snapInteraction = null;
				}
				if (this.NMS.Cable.interaction != null) {
					this.NMS.Cable.interaction.setActive(false);
					GMXMAP.removeInteraction(this.NMS.Cable.interaction);
					this.NMS.Cable.interaction = null;
				}

				this.NMS.Cable.removeSnaps();

				this.StopEvent = null;
			}
		},

		DelStart : function() {
			if (Public.StopEvent != null) {
				Public.NMS.Cable.interaction.setActive(true);
				return false;
			}

			this.interaction = new ol.interaction.Select({
				multi : false,
				hitTolerance : 5
			});

			GMXMAP.addInteraction(this.interaction);
			var inter = this.interaction;
			this.interaction.on('select', function(e) {
				for (var i = 0; i < e.deselected.length; i++) {
					e.deselected[i].setStyle(null);
				}
				if (inter.getFeatures().getArray().length != 0) {
					if (e.selected[0] != null) {
						if (e.selected[0].getId().split(".")[0] != "asset_netwk") {
							inter.getFeatures().clear();
							e.preventDefault();
							return false;
						}
					}
					var data = e.selected[0].getProperties();
					data["gid"] = e.selected[0].getId().split(".")[1];

					e.selected[0].setProperties(data);
					e.selected[0].setStyle(new ol.style.Style({
						stroke : new ol.style.Stroke({
							color : "blue",
							width : 3
						})
					}));

					var $option = $("<option>" + data["net_nm"] + "</option>").attr(data);
					if ($(".contentWrapper").find("td#cableListWrapper").find("#cableList").find("optgroup").find("option[gid=" + data["gid"] + "]").length == 0) {
						$option.dblclick(function(){
							var $this = $(this);
							confirm("선택된 케이블을 목록에서 제거하시겠습니까?", function(){
								$this.remove();
								var array = Public.NMS.Cable.interaction.getFeatures().getArray();
								for (var i = 0; i < array.length; i++) {
									array[i].setStyle(null);
								}
								Public.NMS.Cable.interaction.getFeatures().clear();
							});
						});
						$(".contentWrapper").find("td#cableListWrapper").find("#cableList").find("optgroup").append($option);
					}
				}
			});

			Public.StopEvent = function() {
				if (this.NMS.Cable.interaction != null) {
					$(".contentWrapper").find("td#cableListWrapper").find("#cableList").find("optgroup").html("");
					var array = this.NMS.Cable.interaction.getFeatures().getArray();
					for (var i = 0; i < array.length; i++) {
						array[i].setStyle(null);
					}
					GMXMAP.removeInteraction(this.NMS.Cable.interaction);
					this.NMS.Cable.interaction.getFeatures().clear();
					this.NMS.Cable.interaction = null;
					this.StopEvent = null;
				}
			}
		},

		ClearCable : function(){
			if(this.vector){
				var features = this.vector.getSource().getFeatures();
				if (features.length > 0) {
					for (var i = 0; i < features.length; i++) {
						var feature = features[i];
						if (feature.get("ol_uid")) {
							this.vector.getSource().removeFeature(feature);
						}
					}
				}
			}
		},

		CreateLineStyle : function(feature, color){
			var geometry = feature.getGeometry()
            var length = xeusLayout.mapService.measure.formatLength(geometry);
            var styles = [
                // linestring
                new ol.style.Style({
                	stroke : new ol.style.Stroke({
						color : color,
						width : 3
					})
                })
            ];

            /*
            var firstPoint = geometry.getCoordinates()[0];
            if(firstPoint){
	            styles.push(new ol.style.Style({
	                geometry: new ol.geom.Point(firstPoint),
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
	            }));
            }
         	*/

            var lastPoint = geometry.getCoordinates().slice(-1)[0];
            if(lastPoint){
            	styles.push(new ol.style.Style({
                    geometry: new ol.geom.Point(lastPoint),
                    text : new ol.style.Text({
                        text: length,
                        textAlign: "center",
                        textBaseline: "hanging",
                        offsetY: 10,
                        font: "bold 15px arial",
                        fill: new ol.style.Fill({
    						color: color
    					}),
    					stroke: new ol.style.Stroke({
    						color: '#fff',
    						width: 3
    					})
                    })


                }));
            }

            return styles
		}
	},

	Parking : {
		interval : null,
		Start : function() {
			var $allCnt = $("#parkingWrap").find("#stateWrap").find("#allCnt");
			var $nowCnt = $("#parkingWrap").find("#stateWrap").find("#nowCnt");
			var $marginCnt = $("#parkingWrap").find("#stateWrap").find("#marginCnt");

			if(this.interval != null) clearInterval(this.interval);
			this.interval = setInterval(function() {

				$.get("./api/parkingProxy.jsp", {}, function(result){
					//result = {"stats":[{"camera_id":1,"empty":3,"lot_status":{"1":"occupied","2":"occupied","3":"empty","4":"occupied","5":"occupied","6":"occupied","7":"occupied","8":"occupied","9":"occupied","10":"occupied","11":"occupied","12":"occupied","13":"occupied","14":"occupied","15":"occupied","16":"occupied","17":"occupied","18":"occupied","19":"occupied","20":"occupied","21":"occupied","22":"occupied","23":"occupied","24":"occupied","25":"occupied","26":"occupied","27":"occupied","28":"occupied","29":"occupied","30":"occupied","31":"occupied","32":"occupied","33":"occupied","34":"occupied","35":"occupied","36":"occupied","37":"occupied","38":"occupied","39":"occupied","40":"occupied","42":"empty","43":"occupied","44":"occupied","45":"occupied","46":"occupied","47":"occupied","48":"occupied","49":"occupied","50":"occupied","51":"occupied","52":"occupied","53":"occupied","54":"empty","55":"occupied","56":"occupied","57":"occupied","58":"occupied","59":"occupied","60":"occupied","61":"occupied","62":"occupied","63":"occupied","64":"occupied","65":"occupied","66":"occupied","67":"occupied","68":"occupied","69":"occupied","70":"occupied","71":"occupied","72":"occupied","73":"occupied","74":"occupied","75":"occupied","76":"occupied","77":"occupied","78":"occupied","79":"occupied","80":"occupied","81":"occupied","82":"occupied","83":"occupied","84":"occupied","85":"occupied","86":"occupied","87":"occupied","88":"occupied","89":"occupied","90":"occupied","91":"occupied","92":"occupied","93":"occupied","94":"occupied","95":"occupied","96":"occupied","97":"occupied","98":"occupied","99":"occupied","100":"occupied","101":"occupied","102":"occupied","103":"occupied","104":"occupied"},"occupied":100,"total":103}]};
					$allCnt.text("전체 주차 공간 : " + result.stats[0].total + " 대");
					$nowCnt.text("현재 주차 수 : " + result.stats[0].occupied + " 대");
					$marginCnt.text("여유 공간 : " + result.stats[0].empty + " 대");

					var lotStatus = result.stats[0].lot_status;
					$.get("./api/parkingProxy.jsp", { mode : "rbox" }, function(json){
						//json = {"stats":[{"camera_id":"1","rbox_relative":[[[0.26328125,0.8777777777777778],[0.22109375,0.875],[0.22890625,0.7486111111111111],[0.27265625,0.7513888888888889]],[[0.3140625,0.8805555555555555],[0.2734375,0.8791666666666667],[0.28046875,0.7527777777777778],[0.31484375,0.7541666666666667]],[[0.3625,0.8833333333333333],[0.31953125,0.8833333333333333],[0.32265625,0.7541666666666667],[0.35703125,0.7555555555555555]],[[0.40703125,0.8833333333333333],[0.36640625,0.8805555555555555],[0.36484375,0.7527777777777778],[0.4046875,0.7513888888888889]],[[0.453125,0.8819444444444444],[0.41171875,0.8847222222222222],[0.409375,0.7555555555555555],[0.4484375,0.7541666666666667]],[[0.5,0.8805555555555555],[0.459375,0.8847222222222222],[0.4515625,0.7555555555555555],[0.4890625,0.7569444444444444]],[[0.54453125,0.8847222222222222],[0.50546875,0.8833333333333333],[0.4953125,0.7555555555555555],[0.5328125,0.7555555555555555]],[[0.58984375,0.8805555555555555],[0.55078125,0.8819444444444444],[0.53984375,0.7569444444444444],[0.57421875,0.7583333333333333]],[[0.6328125,0.8777777777777778],[0.59453125,0.8819444444444444],[0.578125,0.7569444444444444],[0.61484375,0.7569444444444444]],[[0.67265625,0.875],[0.634375,0.8791666666666667],[0.61796875,0.7569444444444444],[0.65390625,0.7527777777777778]],[[0.71171875,0.8722222222222222],[0.67578125,0.8763888888888889],[0.65859375,0.7569444444444444],[0.69296875,0.7527777777777778]],[[0.75,0.8666666666666667],[0.71484375,0.8736111111111111],[0.69375,0.7513888888888889],[0.728125,0.7486111111111111]],[[0.78515625,0.8625],[0.753125,0.8666666666666667],[0.73125,0.7527777777777778],[0.76484375,0.75]],[[0.81875,0.8583333333333333],[0.78828125,0.8597222222222223],[0.76640625,0.7486111111111111],[0.7953125,0.7458333333333333]],[[0.85,0.8527777777777777],[0.821875,0.8583333333333333],[0.7984375,0.7458333333333333],[0.82734375,0.7430555555555556]],[[0.87890625,0.8486111111111111],[0.85234375,0.8541666666666666],[0.83203125,0.7444444444444445],[0.8578125,0.7430555555555556]],[[0.91328125,0.8416666666666667],[0.8828125,0.8472222222222222],[0.8609375,0.7458333333333333],[0.89453125,0.7388888888888889]],[[0.95390625,0.8347222222222223],[0.921875,0.8402777777777778],[0.8984375,0.7402777777777778],[0.93046875,0.7361111111111112]],[[0.984375,0.825],[0.95703125,0.8333333333333334],[0.93515625,0.7361111111111112],[0.96640625,0.7333333333333333]],[[0.1984375,0.6277777777777778],[0.2328125,0.6305555555555555],[0.2265625,0.7430555555555556],[0.1875,0.7416666666666667]],[[0.2375,0.6319444444444444],[0.2765625,0.6333333333333333],[0.2734375,0.7444444444444445],[0.2296875,0.7402777777777778]],[[0.28046875,0.6333333333333333],[0.31640625,0.6361111111111111],[0.31640625,0.7444444444444445],[0.2796875,0.7430555555555556]],[[0.321875,0.6347222222222222],[0.36171875,0.6375],[0.3609375,0.7444444444444445],[0.31953125,0.7444444444444445]],[[0.3640625,0.6375],[0.3984375,0.6402777777777777],[0.4046875,0.7444444444444445],[0.3640625,0.7458333333333333]],[[0.4015625,0.6402777777777777],[0.44296875,0.6402777777777777],[0.4484375,0.7458333333333333],[0.40546875,0.7472222222222222]],[[0.44609375,0.6388888888888888],[0.48046875,0.6402777777777777],[0.490625,0.7486111111111111],[0.44921875,0.7486111111111111]],[[0.48359375,0.6416666666666667],[0.51953125,0.6430555555555556],[0.53203125,0.7472222222222222],[0.49453125,0.7486111111111111]],[[0.52421875,0.6416666666666667],[0.56015625,0.6430555555555556],[0.575,0.7472222222222222],[0.5375,0.7472222222222222]],[[0.56171875,0.6416666666666667],[0.6,0.6444444444444445],[0.6171875,0.7458333333333333],[0.57734375,0.7472222222222222]],[[0.603125,0.6444444444444445],[0.6359375,0.6444444444444445],[0.6546875,0.7472222222222222],[0.61875,0.7486111111111111]],[[0.6390625,0.6458333333333334],[0.67265625,0.6472222222222223],[0.69140625,0.7444444444444445],[0.6578125,0.7486111111111111]],[[0.67734375,0.6472222222222223],[0.71015625,0.6472222222222223],[0.73046875,0.7444444444444445],[0.6953125,0.7458333333333333]],[[0.71328125,0.6472222222222223],[0.73828125,0.6472222222222223],[0.7625,0.7402777777777778],[0.73359375,0.7430555555555556]],[[0.74296875,0.6472222222222223],[0.77265625,0.6472222222222223],[0.79609375,0.7402777777777778],[0.7671875,0.7444444444444445]],[[0.77734375,0.6472222222222223],[0.80625,0.6472222222222223],[0.8265625,0.7305555555555555],[0.79765625,0.7319444444444444]],[[0.8109375,0.6458333333333334],[0.834375,0.6472222222222223],[0.85390625,0.7361111111111112],[0.828125,0.7375]],[[0.83828125,0.6458333333333334],[0.8609375,0.6472222222222223],[0.88203125,0.7319444444444444],[0.85859375,0.7347222222222223]],[[0.86640625,0.6444444444444445],[0.88828125,0.6444444444444445],[0.91015625,0.7305555555555555],[0.8828125,0.7305555555555555]],[[0.88984375,0.6444444444444445],[0.91328125,0.6430555555555556],[0.9328125,0.7263888888888889],[0.91171875,0.7291666666666666]],[[0.9171875,0.6416666666666667],[0.93515625,0.6472222222222223],[0.9578125,0.7277777777777777],[0.93359375,0.7222222222222222]],[[0.07109375,0.9152777777777777],[0.0359375,0.9069444444444444],[0.05234375,0.7625],[0.08984375,0.7666666666666667]],[[0.090625,0.7513888888888889],[0.0546875,0.7472222222222222],[0.07265625,0.6208333333333333],[0.1078125,0.6263888888888889]],[[0.10859375,0.6138888888888889],[0.075,0.6069444444444444],[0.09375,0.5055555555555555],[0.125,0.5069444444444444]],[[0.128125,0.5],[0.09375,0.49583333333333335],[0.11328125,0.4013888888888889],[0.14375,0.4041666666666667]],[[0.146875,0.3958333333333333],[0.1109375,0.39166666666666666],[0.1328125,0.3111111111111111],[0.16171875,0.31527777777777777]],[[0.1625,0.30972222222222223],[0.134375,0.3055555555555556],[0.15390625,0.2388888888888889],[0.178125,0.24027777777777778]],[[0.2484375,0.4847222222222222],[0.21328125,0.48055555555555557],[0.225,0.3972222222222222],[0.2546875,0.4013888888888889]],[[0.284375,0.4847222222222222],[0.25234375,0.48333333333333334],[0.25703125,0.4],[0.28984375,0.4]],[[0.32109375,0.48333333333333334],[0.28515625,0.4861111111111111],[0.29140625,0.4013888888888889],[0.32265625,0.4027777777777778]],[[0.359375,0.4888888888888889],[0.32109375,0.4888888888888889],[0.32578125,0.40555555555555556],[0.35859375,0.40555555555555556]],[[0.396875,0.49027777777777776],[0.36015625,0.4930555555555556],[0.3625,0.40694444444444444],[0.39453125,0.40694444444444444]],[[0.4328125,0.49444444444444446],[0.39921875,0.49444444444444446],[0.39765625,0.40555555555555556],[0.43125,0.40694444444444444]],[[0.46953125,0.49444444444444446],[0.434375,0.4930555555555556],[0.43046875,0.4111111111111111],[0.4640625,0.4125]],[[0.50625,0.49583333333333335],[0.47109375,0.49444444444444446],[0.46640625,0.4111111111111111],[0.496875,0.41388888888888886]],[[0.5421875,0.49722222222222223],[0.509375,0.4986111111111111],[0.50234375,0.4152777777777778],[0.53046875,0.4166666666666667]],[[0.57734375,0.5],[0.5453125,0.49722222222222223],[0.53359375,0.41805555555555557],[0.565625,0.41944444444444445]],[[0.61015625,0.5027777777777778],[0.57890625,0.5],[0.5671875,0.41944444444444445],[0.596875,0.4222222222222222]],[[0.6421875,0.5041666666666667],[0.6109375,0.5027777777777778],[0.59921875,0.4236111111111111],[0.63046875,0.4263888888888889]],[[0.675,0.5055555555555555],[0.64296875,0.5041666666666667],[0.6328125,0.4263888888888889],[0.6625,0.42916666666666664]],[[0.70546875,0.5069444444444444],[0.67578125,0.5041666666666667],[0.6625,0.42916666666666664],[0.69296875,0.43194444444444446]],[[0.73671875,0.5097222222222222],[0.70546875,0.5069444444444444],[0.6921875,0.42916666666666664],[0.721875,0.43333333333333335]],[[0.76640625,0.5138888888888888],[0.7375,0.5111111111111111],[0.721875,0.4361111111111111],[0.75,0.4388888888888889]],[[0.79453125,0.5166666666666667],[0.76953125,0.5138888888888888],[0.75078125,0.44027777777777777],[0.77265625,0.4444444444444444]],[[0.8203125,0.5194444444444445],[0.79609375,0.5166666666666667],[0.7765625,0.44305555555555554],[0.803125,0.44722222222222224]],[[0.84609375,0.5194444444444445],[0.82109375,0.5166666666666667],[0.80390625,0.44722222222222224],[0.8328125,0.4513888888888889]],[[0.23203125,0.32083333333333336],[0.2625,0.32083333333333336],[0.25546875,0.3972222222222222],[0.2234375,0.3972222222222222]],[[0.26328125,0.31805555555555554],[0.2953125,0.32083333333333336],[0.290625,0.39444444444444443],[0.25703125,0.39166666666666666]],[[0.296875,0.3236111111111111],[0.32578125,0.3277777777777778],[0.3234375,0.3958333333333333],[0.29296875,0.3958333333333333]],[[0.32890625,0.3263888888888889],[0.36171875,0.32916666666666666],[0.35859375,0.4027777777777778],[0.32421875,0.4013888888888889]],[[0.36328125,0.33055555555555555],[0.39296875,0.33055555555555555],[0.3953125,0.4027777777777778],[0.36171875,0.4]],[[0.396875,0.32916666666666666],[0.425,0.33194444444444443],[0.43046875,0.4],[0.39609375,0.39861111111111114]],[[0.4265625,0.32916666666666666],[0.45859375,0.3333333333333333],[0.4640625,0.40555555555555556],[0.43359375,0.4041666666666667]],[[0.46171875,0.33194444444444443],[0.4890625,0.3388888888888889],[0.4984375,0.4097222222222222],[0.46875,0.4041666666666667]],[[0.49140625,0.3375],[0.52265625,0.34444444444444444],[0.53203125,0.4083333333333333],[0.5,0.4083333333333333]],[[0.525,0.3416666666666667],[0.55390625,0.3472222222222222],[0.56640625,0.41388888888888886],[0.53515625,0.4097222222222222]],[[0.55703125,0.34444444444444444],[0.5859375,0.35],[0.596875,0.4125],[0.56875,0.4111111111111111]],[[0.58828125,0.3472222222222222],[0.615625,0.3527777777777778],[0.62890625,0.4152777777777778],[0.60078125,0.4111111111111111]],[[0.61875,0.35138888888888886],[0.64609375,0.35694444444444445],[0.659375,0.42083333333333334],[0.634375,0.41944444444444445]],[[0.65078125,0.3541666666666667],[0.67578125,0.35833333333333334],[0.690625,0.4236111111111111],[0.6625,0.42083333333333334]],[[0.678125,0.35555555555555557],[0.70859375,0.3611111111111111],[0.72265625,0.42777777777777776],[0.69140625,0.4236111111111111]],[[0.7109375,0.35833333333333334],[0.734375,0.3611111111111111],[0.75078125,0.4305555555555556],[0.7234375,0.4263888888888889]],[[0.73671875,0.3625],[0.75859375,0.3680555555555556],[0.77265625,0.43194444444444446],[0.75078125,0.43194444444444446]],[[0.76171875,0.36527777777777776],[0.78125,0.36944444444444446],[0.79609375,0.43472222222222223],[0.77578125,0.43194444444444446]],[[0.784375,0.37222222222222223],[0.80859375,0.3763888888888889],[0.8265625,0.4375],[0.7984375,0.43194444444444446]],[[0.27109375,0.23055555555555557],[0.2421875,0.23055555555555557],[0.25234375,0.17083333333333334],[0.27734375,0.17222222222222222]],[[0.30234375,0.23055555555555557],[0.27265625,0.22916666666666666],[0.27890625,0.17083333333333334],[0.30625,0.1736111111111111]],[[0.33203125,0.22916666666666666],[0.30390625,0.22777777777777777],[0.30859375,0.1736111111111111],[0.33359375,0.175]],[[0.36171875,0.23194444444444445],[0.334375,0.23333333333333334],[0.33515625,0.1763888888888889],[0.36328125,0.17916666666666667]],[[0.39140625,0.2375],[0.3625,0.23333333333333334],[0.36640625,0.175],[0.3921875,0.17777777777777778]],[[0.42109375,0.23194444444444445],[0.390625,0.23194444444444445],[0.39375,0.175],[0.42109375,0.17916666666666667]],[[0.45234375,0.24027777777777778],[0.42109375,0.2375],[0.421875,0.18333333333333332],[0.44921875,0.18472222222222223]],[[0.48046875,0.24583333333333332],[0.45234375,0.24583333333333332],[0.44921875,0.18472222222222223],[0.475,0.18611111111111112]],[[0.509375,0.24722222222222223],[0.48125,0.24027777777777778],[0.47734375,0.18888888888888888],[0.5046875,0.19444444444444445]],[[0.540625,0.2513888888888889],[0.51015625,0.24722222222222223],[0.50703125,0.19444444444444445],[0.53125,0.19722222222222222]],[[0.56875,0.25833333333333336],[0.53984375,0.2513888888888889],[0.5328125,0.1986111111111111],[0.55859375,0.2]],[[0.596875,0.25555555555555554],[0.5671875,0.25416666666666665],[0.5609375,0.1986111111111111],[0.5875,0.2]],[[0.6203125,0.2611111111111111],[0.59375,0.2569444444444444],[0.58671875,0.2013888888888889],[0.6140625,0.20555555555555555]],[[0.64765625,0.26805555555555555],[0.6203125,0.2652777777777778],[0.61328125,0.19444444444444445],[0.6375,0.2013888888888889]],[[0.675,0.27361111111111114],[0.6484375,0.26944444444444443],[0.63828125,0.20972222222222223],[0.6609375,0.2152777777777778]],[[0.7234375,0.2833333333333333],[0.69765625,0.2763888888888889],[0.68671875,0.21388888888888888],[0.71328125,0.2222222222222222]],[[0.74609375,0.2875],[0.7234375,0.28194444444444444],[0.71171875,0.21944444444444444],[0.7359375,0.22777777777777777]],[[0.76875,0.29583333333333334],[0.74453125,0.2847222222222222],[0.7375,0.2263888888888889],[0.76484375,0.2361111111111111]],[[0.6953125,0.2763888888888889],[0.67265625,0.26666666666666666],[0.66171875,0.20416666666666666],[0.6890625,0.2152777777777778]]],"relative_id":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,102,103,104,101]}]};
						var result = json.stats[0];
						var idx = json.stats[0].relative_id;
						var box = json.stats[0].rbox_relative;

						var canvas = $("#__parking__line-canvas")[0];

						var $target = $("#__parking__video-canvas");
						var canvasWidth = $target.width();
						var canvasHeight = $target.height();
						var canvasTop = 0; //$target.offset().top;
						var canvasLeft = (Number($target.css("margin-left").replace("px", "")) + 20) + "px"; //$target.offset().left;
						//var canvasLeft = $target.css("margin-left"); //$target.offset().left;

						canvas.width = canvasWidth;
						canvas.height = canvasHeight;

						$(canvas).width(canvasWidth);
						$(canvas).height(canvasHeight);
						$(canvas).css({ top: canvasTop, left: canvasLeft });

						var ctx = canvas.getContext("2d");
						ctx.clearRect(0, 0, canvasWidth, canvasHeight);
						for(var i=0; i<box.length; i++){
							ctx.beginPath();
							ctx.moveTo(box[i][0][0] * canvasWidth, box[i][0][1] * canvasHeight);
							ctx.lineTo(box[i][1][0] * canvasWidth, box[i][1][1] * canvasHeight);
							ctx.lineTo(box[i][2][0] * canvasWidth, box[i][2][1] * canvasHeight);
							ctx.lineTo(box[i][3][0] * canvasWidth, box[i][3][1] * canvasHeight);
							ctx.lineTo(box[i][0][0] * canvasWidth, box[i][0][1] * canvasHeight);
							ctx.closePath();

							var number = idx[i];
							var color = "green";
							if(lotStatus[number] == "empty") color = "blue";

							ctx.lineWidth = 3;
							ctx.strokeStyle = color;
							ctx.stroke();

							ctx.font = "bold 17px Nanum";
							ctx.fillStyle = color;
							ctx.textAlign = "center";

							var width = box[i][2][0] * canvasWidth;
							var height = box[i][2][1] * canvasHeight;
							if(number <= 19){
								//strokeText
								if(number <= 7) ctx.fillText(number, (width + 30), (height + 50));
								if(number >= 8) ctx.fillText(number, (width + 40), (height + 50));

							}else if(number >= 20 && number <= 40){

								if(number <= 24) ctx.fillText(number, (width - 30), (height - 50));
								if(number >= 25 && number <= 31) ctx.fillText(number, (width - 40), (height - 50));
								if(number >= 32) ctx.fillText(number, (width - 45), (height - 50));

							}else if(number >= 42 && number <= 47){
								if(number <= 44) ctx.fillText(number, (width + 10), (height + 50));
								if(number >= 45) ctx.fillText(number, (width), (height + 50));

							}else if(number >= 48 && number <= 66){

								if(number <= 56)ctx.fillText(number, (width + 30), (height + 50));
								if(number >= 57)ctx.fillText(number, (width + 40), (height + 50));

							}else if(number >= 67 && number <= 85){

								if(number <= 74) ctx.fillText(number, (width - 30), (height - 30));
								if(number >= 75) ctx.fillText(number, (width - 35), (height - 30));

							}else{

								if(number <= 92) ctx.fillText(number, (width + 20), (height + 30));
								if(number >= 93) ctx.fillText(number, (width + 27), (height + 30));
							}

							/*var minx = parseFloat(box[i][0][0]) * canvasWidth;
							var miny = parseFloat(box[i][0][1]) * canvasHeight;
							var maxx = parseFloat(box[i][1][0]) * canvasWidth;
							var maxy = parseFloat(box[i][1][1]) * canvasHeight;

							var w = maxx - minx;
							var h = maxy - miny;
							ctx.rect(x, y, h, w);*/
						}
					})
				})

			}, 1000);

			Public.StopEvent = function() {
				if(__parking__player) __parking__player.destroy();
				if(__parking__canvas) __parking__canvas = null;
				clearInterval(this.NMS.Parking.interval);
				this.NMS.Parking.interval = null;
				this.StopEvent = null;
			}
		}
	},

	WaterPump : {
		tooltip : null,
		overlay : null,
		interaction : null,
		CreateTooltip : function(){
			var $ele = $('<div id="ol-tooltip" class="ol-tooltip"></div>');
			$("#xeus-map-content-nms").append($ele);
			this.tooltip = $(".contentWrapper").find("#ol-tooltip")[0];
			this.overlay = new ol.Overlay({
				element: Public.NMS.WaterPump.tooltip,
				offset: [0, -20],
				positioning: 'bottom-center'
			});

			GMXMAP.addOverlay(this.overlay);

			return this;
		},
		Start : function(evt){
			if(GMXMAP){
				var map = GMXMAP;

				var pixel = evt.pixel;
				var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
					var isGmxLayer = "fullName" in layer.getProperties();
					if(feature.getGeometry() instanceof ol.geom.LineString){
						if(isGmxLayer){
							if(layer.getProperties()["fullName"] == "asset_pump_sec"){
								return feature;
							}
						}
					}
				});
				Public.NMS.WaterPump.tooltip.style.display = feature ? '' : 'none';
				if (feature) {
					Public.NMS.WaterPump.overlay.setPosition(evt.coordinate);
					var str = feature.get('pumpjang_name') + " : " + feature.get('outlevel') + "m";
					Public.NMS.WaterPump.tooltip.innerHTML = str;
				}

				/*Public.StopEvent = function(){
				map.un("pointermove", this.NMS.WaterPump.Start);
				map.removeOverlay(this.NMS.WaterPump.overlay);
				this.NMS.WaterPump.overlay = null;
				this.NMS.WaterPump.tooltip = null;
				this.StopEvent = null;
			}*/
			}
		},
		Stop : function(){
			var map = GMXMAP;
			if(map){
				map = map.getMap();
				map.un("pointermove", Public.NMS.WaterPump.Start);
				map.removeOverlay(Public.NMS.WaterPump.overlay);
			}
			Public.NMS.WaterPump.overlay = null;
			Public.NMS.WaterPump.tooltip = null;
		}
	},

	RainFall : {
		Start : function(){

			this.vector = GMXMAP.getLayerByName("강우량");
			this.overlays = new Array();

			var features = this.vector.getSource().getFeatures();
			var length = features.length;
			for(var i=0; i<length; i++){
				var feature = features[i];
				var prop = feature.getProperties();
				var center = feature.getGeometry().getCoordinates();
				var $markerElem = $("<div class='arrow_box'></div>").text(prop["raingauge_name"]).attr("id", prop["mgr_no"]);
				var $markerCntn = $("<div class='cntnWrap'></div>");
				var $tr1 = $("<tr><td>금일우량</td><td>" + prop["rain_day"] + "</td></tr>");
				var $tr2 = $("<tr><td>시간우량</td><td>" + prop["rain_hour"] + "</td></tr>");
				var $tr3 = $("<tr><td>시간최대</td><td>" + prop["rain_hourmax"] + "</td></tr>");
				var $tr4 = $("<tr><td>누계우량</td><td>" + prop["rain_year"] + "</td></tr>");
				var $tbl = $("<table></table>").append($tr1).append($tr2).append($tr3).append($tr4);

				$markerCntn.append($tbl);
				$markerElem.append($markerCntn);

				$(".contentWrapper").append($markerElem);

				var overlay = new ol.Overlay({
					element: document.getElementById(prop["mgr_no"]),
					positioning: 'bottom-center',
					offset: [0, -20],
					stopEvent: false
				});
				overlay.setPosition(center);
				this.overlays.push(overlay);
				GMXMAP.addOverlay(overlay);
			}

			/*Public.StopEvent = function() {
				$(".contentWrapper").find(".rainfallOverlay").remove();
				var length = Public.NMS.RainFall.overlays.length;
				for(var i=0; i<length; i++){
					GMXMAP.removeOverlay(Public.NMS.RainFall.overlays[i]);
				}
			}*/
		},
		Stop : function(){
			$(".contentWrapper").find(".rainfallOverlay").remove();
			if(Public.NMS.RainFall.overlays){
				var length = Public.NMS.RainFall.overlays.length;
				for(var i=0; i<length; i++){
					GMXMAP.removeOverlay(Public.NMS.RainFall.overlays[i]);
				}
			}
		}
	},

	Ring : {
		vector : null,

		Start : function(features){

			if (Public.StopEvent != null) Public.StopEvent();

			this.vector = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : features,
					wrapX : false
				})
			});

			GMXMAP.addLayer(this.vector);
			GMXMAP.getView().fit(this.vector.getSource().getExtent());

			Public.StopEvent = function() {
				if (this.NMS.Ring.vector != null) {
					GMXMAP.removeLayer(this.NMS.Ring.vector);
					this.NMS.Ring.vector = null;
				}
				this.StopEvent = null;
			}
		},
		getList : function(type){
			_common.callAjax("/nms/getInfra.json", { "facilityClscd" : type, "sortCol" : "facility_clscd", "sortTyp" : "asc" }, function(json){
				var list = json.result;
				var length = list.length;

				var $tbl = $(".contentWrapper").find("#resultList").find("table");
				var str = "";
				var preIdx = 0;
				for(var i=0; i<list.length; i++){
					var clscd = list[i].facilityClscd;
					var nowIdx = Number(clscd.substring(4, 6));
					if(preIdx < nowIdx){
						preIdx = nowIdx;
						str += "<tr>";
						str += 		"<th class='grpTitle'>" + clscd + "</th>";
						str += 		"<td><button class='locBtn isGrp' clscd='" + clscd + "'></button></td>";
						str += "</tr>";
					}
					str += "<tr clscd='" + clscd + "' class='clscdTr'>";
					str += 		"<td class='tCenter'>" + list[i].facilityNm + "</td>";
					str += 		"<td><button class='locBtn' k='" + list[i].mgrNo + "'></button></td>";
					str += "</tr>";
				}

				var $tbody = $(str);

				$tbl.html($tbody);
				$tbl.find(".grpTitle").next().width(40);
				$tbl.find(".clscdTr").hide();

				$tbl.find(".grpTitle").click(function(){
					$tbl.find(".clscdTr").hide();

					var $target = $tbl.find("tr[clscd=" + $(this).text() + "]");
					if($target.is("visible")){
						$target.hide();
					}else{
						$target.show();
					}
				});

				/* 위치 버튼 이벤트 입니다. */
				$(".contentWrapper").find("#resultList").find(".locBtn").click(function(){
					if($(this).hasClass("isGrp")){
						var clscd = $(this).attr("clscd");
						var array = new Array();
						$tbl.find("tr[clscd=" + clscd + "]").each(function(i, e){
							array.push($(this).find(".locBtn").attr("k"));
						});

						// N05021-101R-11-8P > N09008-101R-13-8P
						_common.callAjax("/netwk/getNmsCableList.json", {stMgrNo : array.join("|").toString(), netGbnCd : "11"}, function(json) {
							var result = json.result;
							var length = result.length;

							if(length == 0){
								alert("링 정보가 존재하지 않습니다.");
								return false;
							}else{
								var features = new Array();
								for(var i=0; i<length; i++){
									var format = new ol.format.WKT();

									var feature = format.readFeature(result[i].wkt, {
										dataProjection: 'EPSG:5186',
										featureProjection: 'EPSG:5186'
									});

									feature.setStyle(new ol.style.Style({
										stroke : new ol.style.Stroke({
											color : result[i].lineColor,
											width : 3
										})
									}));

									features.push(feature);

									Public.NMS.Ring.Start(features);
								}
							}
						});
					}else{
						var v = $(this).attr("k");
						_common.callAjax("/nms/getGeometryLocation.json", {k : v}, function(json) {
							GMXMAP.addPulse([json.result[0].annoX, json.result[0].annoY], true);
						});
					}
				});
			});
		}
	},

	LoRa : {

		vector : null,
		source : null,
		Start : function() {

			if(this.source == null){
				this.source = new ol.source.Vector({
					wrapX : false
				});
			}

			/*var _ClusterSource = new ol.source.Cluster({
				distance: 10,
				source: _Source

			});*/

			if(this.vector == null){
				this.vector = new ol.layer.Vector({
					//source : _ClusterSource,
					source : Public.NMS.LoRa.source,
					zIndex : 99,
				});
			}

			var _param = {
				tbl : "asset_lora_rt_state",
				devEui : $(".contentWrapper").find("#devEui").val(),
				mdfyDate : $(".contentWrapper").find("#mdfyDate").val(),
				endMdfyDate : $(".contentWrapper").find("#endMdfyDate").val(),
				//box : Spatial.getExtent(GMXMAP).toString()
			}

			if(_param["mdfyDate"] == _param["endMdfyDate"]) _param["endMdfyDate"] = "";
			//TODO CustomWFS
			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : _param,
				async : false,
				dataType : "json",
				beforeSend : function() {
					Public.NMS.LoRa.source.clear();
				},
				success : function(json) {
					var _geoJSON = new ol.format.GeoJSON();

					var _features = _geoJSON.readFeatures(json);
					var length = _features.length;
					for(var i=0; i<length; i++){
						var feature = _features[i];
						var prop = feature.getProperties();
						feature.setProperties({
							"img_path" : null,
							"target_field" : "devEui",
							"popup" : true
						});

						var kv = new Array();
						var eui = prop["gateway_eui"].split(";");
						for(var l=0; l<eui.length; l++){
							var k = eui[l].split(",")[0]
							var v = Number(eui[l].split(",")[1]);

							kv.push({ gateway : k, rssi : v })
						}
						kv.sort(function (a, b) {
							return a.rssi < b.rssi ? -1 : a.rssi > b.rssi ? 1 : 0;
						}).reverse();

						/*-110이상 좋음
						  -120이상 보통
						  -130이상 안좋음
						  -140이상 매우안좋음*/
						var rssi = Number(kv[0].rssi);
						var color = "";
						if(rssi >= -110) color = "green";
						if(rssi < -110 && rssi >= -120) color = "yellow";
						if(rssi < -120 && rssi >= -130) color = "orange";
						if(rssi < -130) color = "red";

						feature.setStyle(new ol.style.Style({
							image: new ol.style.Circle({
								radius: 5,
								fill: new ol.style.Fill({
									color: color
								}),
								stroke: new ol.style.Stroke({
									//color: 'rgba(240, 90 , 30, 1)',
									color: color,
									width: 8
								})
							})
						}));
						Public.NMS.LoRa.source.addFeature(feature);
					}
					if(length > 0) GMXMAP.getView().fit(Public.NMS.LoRa.source.getExtent());
				},
				error : function(xhr, status, error) { }
			});

			GMXMAP.addLayer(this.vector);

			Public.StopEvent = function() {
				if (this.NMS.LoRa.source != null) {
					this.NMS.LoRa.source.clear();
					this.NMS.LoRa.source = null;
				}
				if (this.NMS.LoRa.vector != null) {
					GMXMAP.removeLayer(this.NMS.LoRa.vector);
					this.NMS.LoRa.vector = null;
				}
				if(GMXMAP.getLayer("asset_lora_state")){
					GMXMAP.getLayer("asset_lora_state").setVisible(false);
				}
				this.StopEvent = null;
			}
		}
	},

	Dust : {

		vector : null,
		source : null,
		Start : function() {

			if(this.source == null){
				this.source = new ol.source.Vector({
					wrapX : false
				});
			}

			/*var _ClusterSource = new ol.source.Cluster({
				distance: 10,
				source: _Source

			});*/

			if(this.vector == null){
				this.vector = new ol.layer.Vector({
					//source : _ClusterSource,
					source : Public.NMS.Dust.source,
					zIndex : 99,
				});
			}

			var _param = {
				tbl : "asset_dust",
				devEui : $(".contentWrapper").find("#devEui").val(),
				time : $(".contentWrapper").find("#time").val(),
				endTime : $(".contentWrapper").find("#endTime").val(),
				//box : Spatial.getExtent(GMXMAP).toString()
			}

			if(_param["time"] == _param["endTime"]) _param["endTime"] = "";

			$.ajax({
				url : _common.context() + "/CustomWFS",
				type : "POST",
				data : _param,
				async : false,
				dataType : "json",
				beforeSend : function() {
					Public.NMS.Dust.source.clear();
				},
				success : function(json) {
					var _geoJSON = new ol.format.GeoJSON();

					var _features = _geoJSON.readFeatures(json);
					var length = _features.length;
					for(var i=0; i<length; i++){
						var feature = _features[i];
						var prop = feature.getProperties();
						feature.setProperties({
							"img_path" : null,
							"target_field" : "devEui",
							"popup" : true
						});

						/*var kv = prop["eui"];
						kv.sort(function (a, b) {
							return a.rssi < b.rssi ? -1 : a.rssi > b.rssi ? 1 : 0;
						}).reverse();*/

						/*1. PM 1.0 극초미세
						  0~15(좋음) / 16~35(보통) / 36~75(나쁨) / 76~(아주나쁨)

						  2. PM2.5 초미세
						  0~15(좋음) / 16~35(보통) / 36~75(나쁨) / 76~(아주나쁨)

						  3. PM10 미세
						  0~30(좋음) / 31~80(보통) / 81~150(나쁨) / 151~(아주나쁨)    */

						var pm10 = Number(prop["pm10"]);
						var color = "";
						if(pm10 <= 30) color = "green";
						if(pm10 < 81 && pm10 >= 31) color = "yellow";
						if(pm10 < 151 && pm10 >= 81) color = "orange";
						if(pm10 >= 151) color = "red";

						feature.setStyle(new ol.style.Style({
							image: new ol.style.Circle({
								radius: 5,
								fill: new ol.style.Fill({
									color: color
								}),
								stroke: new ol.style.Stroke({
									//color: 'rgba(240, 90 , 30, 1)',
									color: color,
									width: 8
								})
							})
						}));
						Public.NMS.Dust.source.addFeature(feature);
					}
					if(length > 0) GMXMAP.getView().fit(Public.NMS.Dust.source.getExtent());
				},
				error : function(xhr, status, error) { }
			});

			GMXMAP.addLayer(this.vector);

			Public.StopEvent = function() {
				if (this.NMS.Dust.source != null) {
					this.NMS.Dust.source.clear();
					this.NMS.Dust.source = null;
				}
				if (this.NMS.Dust.vector != null) {
					GMXMAP.removeLayer(this.NMS.Dust.vector);
					this.NMS.Dust.vector = null;
				}
				this.StopEvent = null;
			}
		}
	},

	/**
	 * 도곽 절단 이벤트 입니다.
	 */
	Grid : {

		gridVector : null,
		drawVector : null,

		interaction : null,

		Start : function() {

			if (Public.StopEvent != null && Public.NMS.Grid.interaction != null) {
				Public.NMS.Grid.interaction.setActive(true);

				return false;
			}

			if (!(this.drawVector != null) && !(this.drawVector instanceof ol.layer.Vector)){
				this.drawVector = new ol.layer.Vector({
					source : new ol.source.Vector(),
					zIndex : 9999
				});

				GMXMAP.addLayer(this.drawVector);
			}

			if (!(this.gridVector != null) && !(this.gridVector instanceof ol.layer.Vector)){
				this.gridVector = new ol.layer.Vector({
					source : new ol.source.Vector(),
					zIndex : 9999
				});

				GMXMAP.addLayer(this.gridVector);
			}

			if (!(this.interaction != null) && !(this.interaction instanceof ol.interaction.Draw)){
				this.interaction = new ol.interaction.Draw({
					type : "Circle",
					source : Public.NMS.Grid.drawVector.getSource(),
					geometryFunction : ol.interaction.Draw.createBox()
				});

				this.interaction.on("drawstart", function(e){
					Public.NMS.Grid.drawVector.getSource().clear();
					Public.NMS.Grid.gridVector.getSource().clear();
				});

				this.interaction.on("drawend", function(e){
					e.feature.setStyle(new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: "rgb(0, 80, 255)",
							width: 2
						}),
						fill: new ol.style.Fill({
							color : "rgba(0, 0, 0, 0)"
						})
					}));

					Public.NMS.Grid.interaction.setActive(false);
				});

				GMXMAP.addInteraction(this.interaction);
			}

			Public.StopEvent = function() {
				if (this.NMS.Grid.interaction != null) {
					GMXMAP.removeInteraction(this.NMS.Grid.interaction);
					this.NMS.Grid.interaction = null;
				}
				if (this.NMS.Grid.drawVector != null) {
					GMXMAP.removeLayer(this.NMS.Grid.drawVector);
					this.NMS.Grid.drawVector = null;
				}
				if (this.NMS.Grid.gridVector != null) {
					GMXMAP.removeLayer(this.NMS.Grid.gridVector);
					this.NMS.Grid.gridVector = null;
				}

				if((_GMXMAP_DEF_PROXY_ === false) && (_IS_PROXY_ === true)){
					_SET_ACTIVE_PROXY(_GMXMAP_DEF_PROXY_);
					GMXLAYER.setProxyTile(GMXMAP);
					GMXMAP.renderSync();
				}

				this.StopEvent = null;
			}
		}
	}
}