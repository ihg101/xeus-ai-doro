/**
 * <pre>
 * 레이어 관리 객체 입니다.
 *
 * 레이어 생성 메소드 호출 전,
 * <b style="color: red;">xeusLayout.initLayer("그룹종류");</b> 를 호출해야 합니다.
 * </pre>
 *
 * @dependency xeusLayerList.js (Layers)
 * @author 이주영
 */
if(window.XeusLayer == null) var XeusLayer = {

	/**
	 * 범례 엘리먼트 셀렉터 입니다.
	 */
	legendSelector : null,

	/**
	 * 범례를 설정합니다.
	 *
	 * 선택)DOM - 생성 대상 셀렉터(String)
	 */
	createLegend : function(DOM){
		var _Selector = DOM;
		if(_Selector == null || _Selector == "") _Selector = "#overlay-west-contents";
		_Selector = "#" + parentView + " " + _Selector;

		this.legendSelector = $(_Selector);
		this.legendSelector.html("");

		var $parentDiv = $("<div id='layer-over-wrap' onSelectStart='return false'></div>");

		var _Group = this.getLayerGroup();
		for(var i=0; i<_Group.length; i++){
			if(_Group[i] != "EVT"){
				var $div = $("<div class='groups' val='" + _Group[i] + "' style='margin-bottom: 10px;'></div>");
				var $p = $("<p class='group-title'>" + _Group[i] + "</p>").prepend("<span mode='open'><span style='font-size: 12px;'>▶</span> &nbsp;</span>");
				$div.append($p);
				$parentDiv.append($div);
			}
		}

		var eliCdeList = _common.getCodeByGroup("C68");
		var govCdeList = _common.getCodeByGroup("C70");
		var vEliStat = this.convertList(eliCdeList);
		var vGovOffice = this.convertList(govCdeList);

		/*var _Layers = xeusLayout.mapService.getAllLayers();*/
		var _Layers = GMXMAP.getAllLayers();
		for(var i=0; i<_Layers.length; i++){
			if(_Layers[i].get("type") != null){
				var fullName = _Layers[i].get("fullName");

				if(fullName == "asset_lora_state") {
					continue;
				}

				var isActive = false;
				if(Layers[fullName]){
					if("state" in Layers[fullName]){
						isActive = Layers[fullName].state == "active" ? true : false;
					}
				}
				if(isActive){
					var key = parentView + "-" + _Layers[i].get("name");
					var group = _Layers[i].get("group");
					var shortcut = Layers[fullName].shortcut;

					var isCheck = "";
					if(_Layers[i].getVisible()) isCheck = "checked";

					var $div = $("<div class='legends'></div>").attr("key", key);
					var $layer = $("<p></p>").append("<input type='checkbox' id='" + key + "' class='layer' " + isCheck + ">")
											 .append(shortcut)
											 .append("<label for='" + key + "'>&nbsp;" + _Layers[i].get("name").toUpperCase() + "</label>");

					//$layer.find("label").css("vertical-align", "sub");

					if(fullName == "asset_cctv") {
						$layer.append('<span class="first" style="cursor: pointer;"></span> (명칭 : <input type="checkbox" class="text" style="width: 13px;height: 13px;vertical-align: sub;"> 고정형 방향 <input type="checkbox" class="cctvAngle" style="width: 13px;height: 13px;vertical-align: sub;"><span>)</span>');
						if(SYMBOL_TEXT_CHK[parentView]["cctv"]) $layer.find('input.text').prop("checked", true);
						if(SYMBOL_TEXT_CHK[parentView]["cctvAngle"]) $layer.find('input.cctvAngle').prop("checked", true);

						$layer.find('input.text').click(function(){
							if(SYMBOL_TEXT_CHK[parentView]["cctv"] !== undefined){
								if ( $(this).prop("checked") ) SYMBOL_TEXT_CHK[parentView]["cctv"] = true;
								else SYMBOL_TEXT_CHK[parentView]["cctv"] = false;
							}

							if(GMXMAP.getLayerByName("cctv").getVisible())
								xeusCCTV.cctv.reload();
						});

						$layer.find('input.cctvAngle').click(function(){
							if(SYMBOL_TEXT_CHK[parentView]["cctvAngle"] !== undefined){
								if ( $(this).prop("checked") ) SYMBOL_TEXT_CHK[parentView]["cctvAngle"] = true;
								else SYMBOL_TEXT_CHK[parentView]["cctvAngle"] = false;
							}

							if(GMXMAP.getLayerByName("cctv").getVisible())
								xeusCCTV.cctv.reload();
						});
					} else if(fullName == "asset_infra") {
						$layer.append('<span class="first" style="cursor: pointer;"></span> (명칭 : <input type="checkbox" class="text" style="width: 13px;height: 13px;vertical-align: sub;"><span>)</span>');
						if(SYMBOL_TEXT_CHK[parentView]["infra"]) $layer.find('input.text').prop("checked", true);

						$layer.find('input.text').click(function(){
							if(SYMBOL_TEXT_CHK[parentView]["infra"] !== undefined){
								if ( $(this).prop("checked") ) SYMBOL_TEXT_CHK[parentView]["infra"] = true;
								else SYMBOL_TEXT_CHK[parentView]["infra"] = false;
							}

							/*if(GMXMAP.getLayerByName("기반시설").getVisible()){
								var key = 'asset_infra';
								var array = new Array();
								$(".contentWrapper").find(".groups ul li input[type=checkbox]." + key).each(function(){
									if($(this).is(":checked")){
										array.push($(this).val());
									}
								});

								if(array.length > 0){
									Layers[key].loadFunction(
										GMXMAP.getLayerByName(Layers[key]["name"]),
										array.toString()
									)
								}
							}*/
						});
					} else if(fullName == "asset_infra_cctv") {
						$layer.append('<span class="first" style="cursor: pointer;"></span> (명칭 : <input type="checkbox" class="text" style="width: 13px;height: 13px;vertical-align: sub;"><span>)</span>');
						if(SYMBOL_TEXT_CHK[parentView]["infraCctv"]) $layer.find('input.text').prop("checked", true);

						$layer.find('input.text').click(function(){
							if(SYMBOL_TEXT_CHK[parentView]["infraCctv"] !== undefined){
								if ( $(this).prop("checked") ) SYMBOL_TEXT_CHK[parentView]["infraCctv"] = true;
								else SYMBOL_TEXT_CHK[parentView]["infraCctv"] = false;
							}

							if(GMXMAP.getLayerByName("CCTV망 산업용스위치").getVisible()){
								//Layers["asset_infra_cctv"].reload();
								var key = 'asset_infra_cctv';
								Layers[key].reload();
								/*var array = new Array();
								$(".contentWrapper").find(".groups ul li input[type=checkbox]." + key).each(function(){
									if($(this).is(":checked")){
										array.push($(this).val());
									}
								});

								if(array.length > 0){
									Layers[key].loadFunction(
										GMXMAP.getLayerByName(Layers[key]["name"]),
										array.toString()
									)
								}*/
							}
						});
					} else if(fullName == "asset_infra_wifi") {
						$layer.append('<span class="first" style="cursor: pointer;"></span> (명칭 : <input type="checkbox" class="text" style="width: 13px;height: 13px;vertical-align: sub;"><span>)</span>');
						if(SYMBOL_TEXT_CHK[parentView]["infraWifi"]) $layer.find('input.text').prop("checked", true);

						$layer.find('input.text').click(function(){
							if(SYMBOL_TEXT_CHK[parentView]["infraWifi"] !== undefined){
								if ( $(this).prop("checked") ) SYMBOL_TEXT_CHK[parentView]["infraWifi"] = true;
								else SYMBOL_TEXT_CHK[parentView]["infraWifi"] = false;
							}

							if(GMXMAP.getLayerByName("WIFI망 산업용스위치").getVisible()){
								//Layers["asset_infra_wifi"].reload();
								var key = 'asset_infra_wifi';
								Layers[key].reload();
								/*var array = new Array();
								$(".contentWrapper").find(".groups ul li input[type=checkbox]." + key).each(function(){
									if($(this).is(":checked")){
										array.push($(this).val());
									}
								});

								if(array.length > 0){
									Layers[key].loadFunction(
										GMXMAP.getLayerByName(Layers[key]["name"]),
										array.toString()
									)
								}*/
							}
						});
					} else if(fullName == "asset_infra_lora") {
						$layer.append('<span class="first" style="cursor: pointer;"></span> (명칭 : <input type="checkbox" class="text" style="width: 13px;height: 13px;vertical-align: sub;"><span>)</span>');
						if(SYMBOL_TEXT_CHK[parentView]["infraLora"]) $layer.find('input.text').prop("checked", true);

						$layer.find('input.text').click(function(){
							if(SYMBOL_TEXT_CHK[parentView]["infraLora"] !== undefined){
								if ( $(this).prop("checked") ) SYMBOL_TEXT_CHK[parentView]["infraLora"] = true;
								else SYMBOL_TEXT_CHK[parentView]["infraLora"] = false;
							}

							if(GMXMAP.getLayerByName("LORA망 산업용스위치").getVisible()){
								//Layers["asset_infra_lora"].reload();
								var key = 'asset_infra_lora';
								Layers[key].reload();
								/*var array = new Array();
								$(".contentWrapper").find(".groups ul li input[type=checkbox]." + key).each(function(){
									if($(this).is(":checked")){
										array.push($(this).val());
									}
								});

								if(array.length > 0){
									Layers[key].loadFunction(
										GMXMAP.getLayerByName(Layers[key]["name"]),
										array.toString()
									)
								}*/
							}
						});
					}

					$div.append($layer);
					$parentDiv.find(".groups[val='" + group + "']").append($div);
					//$parentDiv.prepend($div);

					if(Layers.LayerTheme[fullName] != null){
						var $ul = $("<ul></ul>");

						var themeKeys = new Array();
						for(var thmKey in Layers.LayerTheme[fullName]){
							themeKeys.push(thmKey);
						}
						//themeKeys.sort();

						for(var l=0; l<themeKeys.length; l++){
							var thmKey = themeKeys[l];

							var color = Layers.LayerTheme[fullName][thmKey];
							var isImg = Layers[fullName].getThemeImg != null;
							var $shortcut = $(Layers[fullName].shortcut);
							if(isImg){
								var w = "30px";
								var h = "30px";
								if(fullName == "asset_blackbox"){
									w = "22px";
									h = "38px";
								}
								$shortcut = $("<img src='" + Layers[fullName].getThemeImg(color) + "'>").css({
									"width" : w,
									"height" : h,
									"cursor" : "pointer",
									"vertical-align" : "middle",
									"margin" : "0px 10px"
								}).click(function(){
									$(this).next().click();
								});
							}else{
								$shortcut.children().css("stroke", color);
							}

							if(fullName == "asset_cctv") $shortcut.css("vertical-align", "middle");

							var $li = $("<li></li>");

							var thmNm = thmKey;
							if(fullName == "v_eli_stat") thmNm = vEliStat[thmKey];
							else if(fullName == "v_gov_office") thmNm = vGovOffice[thmKey];

							$li.append("<input type='checkbox' class='" + fullName + "' id='" + fullName + "_" + thmKey + "' value='" + thmKey + "' " + isCheck + ">")
								.append($shortcut)
								.append("<label for='" + fullName + "_" + thmKey + "'>" + thmNm + "</label>");

							if(fullName == "asset_cctv_offline_2019"){
								$li.find($shortcut).remove();
							}

							//if(isImg) $li.css("padding", "10px 0px 10px 0px");
							$ul.append($li);
						}

						if(fullName == "asset_fnms"){
							_common.callAjax("/netwk/getThemeList.json", {'netGbnCd': '12'}, function(json){
				                if(json.result){
				                    for(var i=0; i<json.result.length; i++){
				                    	$ul.find('label[for='+fullName+'_'+json.result[i].mgrNo+']').text(json.result[i].themeNm);
				                    	if(json.result[i].cableTyp == "2") //$ul.find('line').css('stroke-dasharray', '5, 3');
				                    		$ul.find('label[for='+fullName+'_'+json.result[i].mgrNo+']').parent().find('line').css('stroke-dasharray', '5, 3');
				                    	else $ul.find('label[for='+fullName+'_'+json.result[i].mgrNo+']').parent().find('line').css('stroke-dasharray', '');
				                    }

				                    $ul.find("li").sortElements(function(a, b){
				                    	return $(a).text() > $(b).text() ? 1 : -1;
				                    });
				                }
				            }, false);
						}

						//$ul.find("label").css("vertical-align", "sub");
						$div.append($ul);
						if(Layers.LayerTheme[fullName] != null){
							$layer.find("label").eq(0).removeAttr("for").css({
								"cursor" : "pointer"
							}).on("click", function(){
								$(this).parent().next().toggle();
							});
						}
					}

					/*if(isCheck && fullName == "asset_pump_sec") GMXMAP.on("pointermove", Public.NMS.WaterPump.CreateTooltip().Start);
					if(isCheck && fullName == "asset_rainfall") Public.NMS.RainFall.Start();*/
				}
			}
		}
		$(_Selector).append($parentDiv).find("ul").toggle();

		$parentDiv.find("div.groups").each(function(){
			if($(this).children(".legends").length == 0){
				$(this).remove();
			}
		});

		$parentDiv.find(".group-title").click(function(){
			$(this).parent().find(".legends").toggle();
			var $span = $(this).find("span");
			if($span.attr("mode") == "open"){
				$span.attr("mode", "close").text("▼ ")
			}else if($span.attr("mode") == "close"){
				$span.attr("mode", "open").text("▶ ")
			}
		});

		$parentDiv.find(".legends svg, .sym-icon").click(function(){
			$(this).next().click();
		});

		$(document).on("change", "input.layer", function(){

			var key = $(this).attr("id");
			key = key.split("-")[1];
			/*
			 * 180115 이은규
			 * cctv레이어의 범주가 변경되면 열려있는 cctv-overlay-content를 닫는다.
			 */
			if (key == 'cctv')	$('#cctv-overlay-closer')[0].click();

			if($(this).is(":checked")){
				/*xeusLayout.mapService.setLayerVisible(key, true);*/
				GMXMAP.setLayerVisible(key, true);
				$(this).parent().next().find("input[type=checkbox]").prop("checked", true);

				if(key == "펌프장하천구간") //GMXMAP.on("pointermove", Public.NMS.WaterPump.CreateTooltip().Start);
				if(key == "강우량") //Public.NMS.RainFall.Start();
				if(key == "CCTV망 산업용스위치" || key == "WIFI망 산업용스위치" || key == "LORA망 산업용스위치"){
					var LayerKey = GMXMAP.getLayerByName(key).get("fullName");
					Layers[LayerKey].reload();
				}

				xeusSymbol.setVisible(XeusLayer.getLayerId(key), true);
			}else{
				/*xeusLayout.mapService.setLayerVisible(key, false);*/
				GMXMAP.setLayerVisible(key, false);
				$(this).parent().next().find("input[type=checkbox]").prop("checked", false);

				if(key == "펌프장하천구간") //Public.NMS.WaterPump.Stop();
				if(key == "강우량") //Public.NMS.RainFall.Stop();
				if(key == "cctv") xeusSymbol.removeAllFeature("asset_cctv");
				if(key == "cctv" && xeusSymbolCctv) xeusSymbolCctv.clear();
				//if(key == "기반시설" && xeusSymbolInfra) xeusSymbolInfra.clear();
				if(key == "CCTV망 산업용스위치" && xeusSymbolInfraCctv) xeusSymbolInfraCctv.clear();
				if(key == "WIFI망 산업용스위치" && xeusSymbolInfraWifi) xeusSymbolInfraWifi.clear();
				if(key == "LORA망 산업용스위치" && xeusSymbolInfraLora) xeusSymbolInfraLora.clear();

				xeusSymbol.setVisible(XeusLayer.getLayerId(key), false);
			}

			if(key == "cctv" && $(this).is(":checked")){
				var array = new Array();
				$(".contentWrapper").find(".groups ul li input[type=checkbox].asset_cctv").each(function(){
					if($(this).is(":checked")){
						array.push($(this).val());
					}
				});

				Layers["asset_cctv"].loadFunction(
					/*xeusLayout.mapService.getLayerByName(Layers["asset_cctv"]["name"]),*/
					GMXMAP.getLayerByName(Layers["asset_cctv"]["name"]),
					array.toString()
				);
			}/* else if(key == "기반시설" && $(this).is(":checked")){
				var array = new Array();
				$(".contentWrapper").find(".groups ul li input[type=checkbox].asset_infra").each(function(){
					if($(this).is(":checked")){
						array.push($(this).val());
					}
				});

				Layers["asset_infra"].loadFunction(
					xeusLayout.mapService.getLayerByName(Layers["asset_cctv"]["name"]),
					GMXMAP.getLayerByName(Layers["asset_infra"]["name"]),
					array.toString()
				);
			}*/ else if(key == "법정동" && $(this).is(":checked")){
				var array = new Array();
				$(".contentWrapper").find(".groups ul li input[type=checkbox].kais_emd_as").each(function(){
					if($(this).is(":checked")){
						array.push($(this).val());
					}
				});

				Layers["kais_emd_as"].loadFunction(
					/*xeusLayout.mapService.getLayerByName(Layers["asset_cctv"]["name"]),*/
					GMXMAP.getLayerByName(Layers["kais_emd_as"]["name"]),
					array.toString()
				);
			} else if(key == "행정동" && $(this).is(":checked")){
				var array = new Array();
				$(".contentWrapper").find(".groups ul li input[type=checkbox].kais_hjd_as").each(function(){
					if($(this).is(":checked")){
						array.push($(this).val());
					}
				});

				Layers["kais_hjd_as"].loadFunction(
					/*xeusLayout.mapService.getLayerByName(Layers["asset_cctv"]["name"]),*/
					GMXMAP.getLayerByName(Layers["kais_hjd_as"]["name"]),
					array.toString()
				);
			} else if(key == "물리망" && $(this).is(":checked")){
				Layers["asset_fnms"].loadFunction(
					GMXMAP.getLayerByName(Layers["asset_fnms"]["name"])
					, "all"
				);
			} else if(key == "CCTV망" && $(this).is(":checked")){
				var array = new Array();
				$(".contentWrapper").find(".groups ul li input[type=checkbox].asset_netwk_cctv").each(function(){
					if($(this).is(":checked")){
						array.push($(this).val());
					}
				});

				Layers["asset_netwk_cctv"].loadFunction(
					/*xeusLayout.mapService.getLayerByName(Layers["asset_cctv"]["name"]),*/
					GMXMAP.getLayerByName(Layers["asset_netwk_cctv"]["name"]),
					array.toString()
				);
			} else if(key == "LORA망" && $(this).is(":checked")){
				var array = new Array();
				$(".contentWrapper").find(".groups ul li input[type=checkbox].asset_netwk_lora").each(function(){
					if($(this).is(":checked")){
						array.push($(this).val());
					}
				});

				Layers["asset_netwk_lora"].loadFunction(
					/*xeusLayout.mapService.getLayerByName(Layers["asset_cctv"]["name"]),*/
					GMXMAP.getLayerByName(Layers["asset_netwk_lora"]["name"]),
					array.toString()
				);
			} else if(key == "WIFI망" && $(this).is(":checked")){
				var array = new Array();
				$(".contentWrapper").find(".groups ul li input[type=checkbox].asset_netwk_wifi").each(function(){
					if($(this).is(":checked")){
						array.push($(this).val());
					}
				});

				Layers["asset_netwk_wifi"].loadFunction(
					/*xeusLayout.mapService.getLayerByName(Layers["asset_cctv"]["name"]),*/
					GMXMAP.getLayerByName(Layers["asset_netwk_wifi"]["name"]),
					array.toString()
				);
			}
		});

		$(".contentWrapper").find(".groups ul li input[type=checkbox]").on("change", function(){

			/*
			 * 180115 이은규
			 * cctv레이어의 범주가 변경되면 열려있는 cctv-overlay-content를 닫는다.
			 */
			var lengendsKey = $(this).parent().parent().parent().attr('key');
			if (lengendsKey == 'cctv')	$('#cctv-overlay-closer')[0].click();

			var key = $(this).attr("class");

			var array = new Array();
			$(".contentWrapper").find(".groups ul li input[type=checkbox]." + key).each(function(){
				if($(this).is(":checked")){
					array.push($(this).val());
				}
			});

			if(array.length == 0){
				array = "null";
				$(this).parent().parent().prev().find("input.layer[type=checkbox]").prop("checked", false);
			}else{
				$(this).parent().parent().prev().find("input.layer[type=checkbox]").prop("checked", true);
			}

			Layers[key].loadFunction(
				//xeusLayout.mapService.getLayerByName(Layers[key]["name"]),
				GMXMAP.getLayerByName(Layers[key]["name"]),
				array.toString()
			)
		});

		return this;
	},

	/**
	 * 컬럼, 값을 받아 필터 스트링을 생성합니다.
	 *
	 * @returns {String}
	 * @deprecated
	 */
	makeFilter : function(col, val){
		var filter;
		filter  = '<ogc:Filter>';
		filter += 		"<ogc:PropertyIsEqualTo>";
		filter += 			"<ogc:PropertyName>" + col + "</ogc:PropertyName>";
		filter += 			"<ogc:Literal>" + val + "</ogc:Literal>";
		filter += 		"</ogc:PropertyIsEqualTo>";
		filter += "</ogc:Filter>";

		return filter;
	},


	getLayerId : function(name){
		var id = "";
		for(var key in Layers){
			if(Layers[key]["name"] == name) id = key;
		}
		return id;
	},

	/**
	 * 전체 레이어 리스트에서 레이어 그룹을 추출합니다.
	 *
	 * @returns {Array}
	 */
	getLayerGroup : function(){
		var array = new Array();
		/*var _Layers = xeusLayout.mapService.getAllLayers();*/
		var _Layers = GMXMAP.getAllLayers();
		for(var i=0; i<_Layers.length; i++){
			if(_Layers[i].get("type") != null){
				var group = _Layers[i].get("group");

				if(!_common.utils.isNullAndEmpty(group)){
					var isContains = false;
					for(var l=0; l<array.length; l++){
						if(array[l] == group) isContains = true;
						if(isContains) break;
					}

					if(!isContains) array.push(_Layers[i].get("group"));
				}
			}
		}

		return array;
	},

	/**
	 * 주어진 기능 그룹명이 해당 레이어의 기능 그룹에 존재하는지 추출합니다.
	 *
	 * @param fn
	 * @param fnGroup
	 * @returns {Boolean}
	 */
	isFnGroupContains : function(fn, fnGroup){
		var bool = false;

		if(fnGroup instanceof Array){
			for(var i=0; i<fnGroup.length; i++){
				if(fn === fnGroup[i]){
					bool = true;
					break;
				}
			}
		}else if(fn === fnGroup){
			bool = true;
		}

		return bool;
	}
	,

	/**
	 * 범례 명을 표시하기 위해 코드 리스트를 가져옵니다.
	 *
	 * @param list
	 * @returns rst
	 */
	convertList : function(_list){
		var _rst = {};
		for(var i=0; i<_list.length; i++){
			_rst[_list[i].cdeCde] = _list[i].cdeNm;
		}
		return _rst;
	}

}