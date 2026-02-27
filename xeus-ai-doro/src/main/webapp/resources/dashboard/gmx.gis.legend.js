/**
 * <pre>
 * 레이어 범례를 생성하는 객체 입니다.
 * GMXLAYER 객체가 서버에서 데이터를 취득해야 본 객체를 사용할 수 있습니다.
 * </pre>
 *
 * @auther 이주영
 *
 */
"use strict";

if(window.GMXLEGEND == null) var GMXLEGEND = {

	/**
	 * <pre>
	 * 범례 생성에 필요한 함수를 모두 호출합니다.
	 * </pre>
	 *
	 * @param _Map
	 * @returns {___anonymous_GMXLEGEND}
	 */
	createLegends : function(_Map){
		var _this = this;
		if($("#legendWrap").length === 0){
			$("body").append("<div id='legendWrap' class='dialogWrap customScroll' title='범례' onselectstart='return false'></div>");
			$("#legendWrap").dialog({
				autoOpen : false,
				width: "400",
				height: $("#map").height(),
				resizable: false,
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function(){
					var timeout = setTimeout(function(){
						$("#legendWrap").dialog("option", "height", $("#map").height());
						clearTimeout(this);
						timeout = null;
					}, 100);

					if($(".legendB").length > 0 && $(".legendB").parent().length > 0){
						$(".legendB").parent().addClass("active");
					}

					_this.setCheckboxToggle();

					/* 21.03.23 백유림 추가 범례 검색 */
					_this.createLayerSearchElement();
					_this.setVisibleGroups();
					_this.setVisibleCount();
				},
				close: function(){
					if($(".legendB").length > 0 && $(".legendB").parent().length > 0){
						$(".legendB").parent().removeClass("active");
					}

					/* 21.03.23 백유림 추가 범례 검색 */
					$('.search_open').remove();
					$(".legendSearch").remove();
				}
			}).parent().draggable({ containment: "#map", scroll: false });
		}
		this.createGroups()
			.createTMSLayer()
			.createInsideLayer()
			.sortLayerIndex()
			.setVectorIndex()
			.setVisibleGroups()
			.setVisibleCount()
			.bindToggleEvent();

		return this;
	},

	/**
	 * <pre>
	 * 레이어 검색 기능을 추가합니다.
	 * </pre>
	 */
	createLayerSearchElement : function(){
		var _this = this;

		$('[aria-describedby="legendWrap"] .ui-dialog-title').append("<button class='search_open open'><i class='fas fa-search'></i></button>");
		$('[aria-describedby="legendWrap"] .ui-dialog-title').find(".search_open").click(function(){
			$(".legendSearch").toggleClass("open");
			$(".legendSearch.open input").focus();
			$(this).toggleClass("open");

			if(!$(this).is(":visible")) _this.setVisibleGroups();
		});

		$("#legendWrap").prepend("<div class='legendSearch open'><div class='box'><input type='search' placeholder='검색할 레이어명을 입력해주세요'/></div></div>");
		$("#legendWrap").find("input[type=search]").keyup(function(e){
			$("#legendWrap").find(".legend").each(function(){
				$(this).find("tbody").hide();

				if($(this).find(".layerT").hasClass("active")){
					$(this).find(".layerT").removeClass("active");
					$(this).find("tbody").hide();
				}
			});

			var val = $(this).val();
			if(_common.utils.isNullAndEmpty(val)){
				_this.setVisibleGroups();
			}else{
				$("#legendWrap").find(".layerName").each(function(){
					var $group = $(this).parent().parent().parent();
					var layerName = $(this).text().toLowerCase();
					if(layerName.contains(val)){
						$group.show();
					}
				});
			}
		});
	},

	/**
	 * <pre>
	 * 그룹 엘리먼트를 생성합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 */
	createGroups : function(){

		var $legendWrap = $("#legendWrap").html("");
		var $myLayerTbl;

		for(var i=0; i<GMXLAYER.GroupList.length; i++){
			var data = GMXLAYER.GroupList[i];
			if(data.mgrSeq==4){
				continue;
			}
			var $tbl = $("<table>").addClass("legend").addClass("default").data(data).attr({
				"k" : data.mgrSeq,
				"zidx" : data.grpZidx,
				"n" : data.grpNm
			}).width("100%");
			var $thead = $("<thead>").append("<tr><th class='pointer layerGroupToggle' colspan='5'><div class='layerT'><input type='checkbox' class='groupLayerToggle' id="+data.mgrSeq+"><label class='checkboxC' for="+data.mgrSeq+"></label>" + data.grpNm + "<span class='layerN'><span class='color'>"+"켜진개수"+"</span>/"+"총 개수"+"</span></div></th></tr>");
			var $tbody = $("<tbody>");

			$tbl.append($thead).append($tbody);

			if(data.mgrSeq == 3){
				$myLayerTbl=$tbl;
				continue;
			}

			$legendWrap.append($tbl);
		}
		//공유 레이어를 제외한 그룹 중 나의 레이어는 가장 마지막에 표출
		$legendWrap.append($myLayerTbl);

		var obj = this.getSharingUserGroupList();
		var sharingUserGroupList = obj.sharingUserGroupList;

		for(var i=0; i<sharingUserGroupList.length; i++){
			var usrId = sharingUserGroupList[i];
			var data = obj.data;

			var $tbl = $("<table>").addClass("legend").addClass("default").data(data).attr({
				"k" : data.mgrSeq,
				"usrId" : usrId,
				"zidx" : data.grpZidx,
				"n" : data.grpNm
			}).width("100%");
			var $thead = $("<thead>").append("<tr><th class='pointer layerGroupToggle' colspan='5'> <div class='layerT'><input type='checkbox' class='groupLayerToggle' id="+data.mgrSeq+"><label class='checkboxC' for="+data.mgrSeq+"></label>" + data.grpNm +"("+usrId+")"+ "<span class='layerN'>켜진 개수/총 개수</span></div></th></tr>");
			var $tbody = $("<tbody>");

			$tbl.append($thead).append($tbody);

			$legendWrap.append($tbl);
		}

		return this;
	},

	/*
	 * 레이어를 공유한 계정ID의 리스트를 가져온다
	 */
	getSharingUserGroupList : function (){
		var result = {};
		var array = [];
		var finalArray = [];
		var data = {};

		for(var layerKey in GMXLAYER.LayerList){
			var tblNm = GMXLAYER.LayerList[layerKey];

			if("group" in tblNm){
				if(tblNm.group.mgrSeq == 4){
					data = tblNm.group;
					array.push(tblNm.layer.mkUser);
				}
			}
		}
		array.sort();

		$.each(array,function(i,value){
		    if(finalArray.indexOf(value) == -1) finalArray.push(value);
		});

		result['data'] = data;
		result['sharingUserGroupList'] = finalArray;

		return result;
	},

	/**
	 * <pre>
	 * 배경지도 그룹의 레이어를 생성합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 */
	createTMSLayer : function(){
		var _this = this;
		var $legendWrap = $("#legendWrap");
		if("GMXMAP" in window){
			var layerList = GMXMAP.getLayers().getArray();
			for(var i=0; i<layerList.length; i++){
				var tms = layerList[i];
				var grpNm = tms.get("group");
				var geomType = tms.get("geomType");
				if(geomType === "T"){
					var $grpTbl;

					for(var l=0; l<GMXLAYER.GroupList.length; l++){
						if(GMXLAYER.GroupList[l].grpNm === grpNm){
							$grpTbl = $legendWrap.find("table[k=" + GMXLAYER.GroupList[l].mgrSeq + "]").find("tbody");
						}
					}

					var $tr = $("<tr>").addClass("layer tms").attr("k", tms.get("id")).data("z-idx", tms.getZIndex());
					var $tdTemp = $("<td>");

					var $check = $("<input type='checkbox'>").addClass("toggleTMSLayer").attr("k", tms.get("id")).attr("id", tms.get("id")).prop("checked", tms.getVisible());
					var $checkC = $("<label class='checkboxC'></label>").attr("for", tms.get("id"));
					var $shotcut = this.createLegendGraphic("T", layerList[i]);
					var $name = $("<span>").addClass("layerName").addClass("tmsOpacity pointer").attr("k", tms.get("id")).text(tms.get("name"));

					var $copyTd1 = $tdTemp.clone().width(15).height(30);
					var $copyTd2 = $tdTemp.clone().width(35);
					var $copyTd3 = $tdTemp.clone().attr("colspan", "3");

					$copyTd1.append($check);
					$copyTd1.append($checkC);
					$copyTd2.append($shotcut);
					$copyTd3.append($name);

					$tr.append($copyTd1).append($copyTd2).append($copyTd3);
					$grpTbl.append($tr);
				}
			}
		}

		return this;
	},

	/**
	 * <pre>
	 * 배경지도 그룹의 레이어를 생성합니다.
	 *
	 * 현재 사용되지 않습니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 *
	 * @Deprecated
	 * 현재 사용되지 않습니다.
	 */
	createAtmoTMSLayer : function(){
		var _this = this;
		var $legendWrap = $("#legendWrap");
		if("GMXMAP" in window){
			var layerList = GMXMAP.getLayers().getArray();
			for(var i=0; i<layerList.length; i++){
				if(layerList[i].get("group") === "환경지도"){
					var tms = layerList[i];
					var $grpTbl = $legendWrap.find("table[k=5]").find("tbody");

					var $tr = $("<tr>").addClass("layer").attr("k", tms.get("id"));
					var $tdTemp = $("<td>");

					var $check = $("<input type='checkbox'>").addClass("toggleTMSLayer").attr("k", tms.get("id")).attr("id", tms.get("id")).prop("checked", tms.getVisible());
					var $checkC = $("<label class='checkboxC'></label>").attr("for", tms.get("id"));
					var $shotcut = this.createLegendGraphic("T", layerList[i]);
					var $name = $("<span>").addClass("layerName").text(tms.get("name"));


					var $copyTd1 = $tdTemp.clone().width(15).height(30);
					var $copyTd2 = $tdTemp.clone().width(35);
					var $copyTd3 = $tdTemp.clone().attr("colspan", "3");

					$copyTd1.append($check);
					$copyTd1.append($checkC);
					$copyTd2.append($shotcut);
					$copyTd3.append($name);

					$tr.append($copyTd1).append($copyTd2).append($copyTd3);
					$grpTbl.append($tr);
				}
			}
		}

		return this;
	},

	/**
	 * <pre>
	 * 서버에 z-index 값을 반영합니다.
	 * </pre>
	 *
	 * @param data - Object (Layer Data)
	 * @param zidx - Number
	 */
	setLayerIndex : function(data, zidx){
		var param = { mgrSeq : data.layer.mgrSeq, lyrZidx : zidx };
		_common.callAjax("/GMT_layer/setLayerIndex.json", param, function(json){
			GMXLAYER.loadData().loadLayer(GMXMAP);
			GMXLEGEND.createLegends();
		});
	},

	/**
	 * <pre>
	 * 그룹 내에 해당하는 레이어를 생성합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 */
	createInsideLayer : function(){
		var _this = this;
		var $legendWrap = $("#legendWrap");

		for(var layerKey in GMXLAYER.LayerList){
			var data = GMXLAYER.LayerList[layerKey];
			var lyrTyp = data.layer.lyrTyp;
			var isTheme = data.layer.thmUseYn;

			if(lyrTyp === "T") continue;

			if("group" in data){
				var $grpTbl = null;
				if(data.group.mgrSeq == 4){
					$grpTbl = $legendWrap.find("table[usrId=" + data.layer.mkUser + "]").find("tbody");
				}else{
					$grpTbl = $legendWrap.find("table[k=" + data.group.mgrSeq + "]").find("tbody");
				}

				var $tr = $("<tr>").addClass("layer").attr("k", data.layer.tblId).attr("data-z-idx", data.layer.lyrZidx).data(data);
				var $tdTemp = $("<td>");

				var $check = $("<input type='checkbox'>").addClass("toggleLayer").data(data).attr("id", data.layer.tblId).prop("checked", data.layer.visibleYn);
				var $checkC = $("<label class='checkboxC'></label>").attr("for", data.layer.tblId);
				var $shotcut = this.createLegendGraphic(data.layer.lyrTyp, data.style, data.layer.heatYn);
				//공유 레이어
				if(data.group.mgrSeq == 4){
					var $name = $("<span>").addClass("layerName").text(data.layer.lyrNm);
				}
				//수정권한이 없는 레이어
				else if((data.layer.modYn === 'N' || data.layer.modYn == null || data.layer.modYn == undefined) && data.group.mgrSeq != 3){
					var $name = $("<span>").addClass("layerName").text(data.layer.lyrNm);
				}
				else{
					var $name = $("<span>").addClass("pointer layerName").text(data.layer.lyrNm).click(function(){
						GMXLAYER.createLayerInfoDialog($(this).parent().parent().data());
					});
				}

				var $thmToggle = null;
				if(isTheme){
					$thmToggle = $("<button>").addClass("thmToggle").text("");
					$thmToggle.click(function(){
						var $thmLayer = $(".layerTheme[k=" + $(this).parent().parent().attr("k") + "]").toggle();
						if($thmLayer.is(":visible")){
							$(this).addClass("active");
						}else{
							$(this).removeClass("active");
						}
					});
				}
				var $edit = $("<button>").addClass("edit").text("설정").click(function(){
					GMXLAYER.createStyleDialog($(this).parent().parent().data());
				});

				var $copyTd1 = $tdTemp.clone().width(25).height(30);
				var $copyTd2 = $tdTemp.clone().width(15).height(30);
				var $copyTd3 = $tdTemp.clone().width(35);
				var $copyTd4 = $tdTemp.clone();
				var $copyTd5 = $tdTemp.clone().addClass("tRight");

				if(data.group.mgrSeq == 3){
					var $sortUp = $("<span>").addClass("pointer ui-icon ui-icon-arrowthick-1-n").addClass("zIdxUp").text("↑");
					var $sortDown = $("<span>").addClass("pointer ui-icon ui-icon-arrowthick-1-s").addClass("zIdxDown").text("↓");
					$copyTd1.append($sortUp).append($sortDown);
				}

				$copyTd2.append($check);
				$copyTd2.append($checkC);
				$copyTd3.append($shotcut);
				$copyTd4.append($name);
				if(isTheme) $copyTd5.append($thmToggle);

				if(data.group.mgrSeq != 4){
					//수정 권한이 있는 레이어
					if(data.layer.modYn != 'N' && data.layer.modYn != null && data.layer.modYn != undefined){
						$copyTd5.append($edit);
					}
					//나의 레이어
					else if(data.group.mgrSeq == 3){
						$copyTd5.append($edit);
					}
				}

				$tr.append($copyTd1).append($copyTd2).append($copyTd3).append($copyTd4).append($copyTd5);
				$grpTbl.append($tr);

				if(isTheme){
					var $thmTr = $("<tr>").addClass("layerTheme").attr("k", data.layer.tblId).attr("data-z-idx", data.layer.lyrZidx);
					var $thmTd = $tdTemp.clone().addClass("layerThemeWrap").attr("colspan", "5");

					$thmTr.append($thmTd);
					$grpTbl.append($thmTr);

					_this.createThemeLayer(data);
				}
			}
		}

		return this;
	},

	/**
	 * <pre>
	 * 주제도 레이어를 생성합니다.
	 * </pre>
	 *
	 * @param data
	 * @returns {___anonymous_GMXLEGEND}
	 */
	createThemeLayer : function(data){
		var _this = this;
		var layerKey = data.layer.tblId;
		var $themeWrap = $("#legendWrap").find(".layerTheme[k=" + layerKey +"]").find(".layerThemeWrap");

		var $tbl = $("<table>").addClass("legendTheme").data(data).attr({
			"k" : data.theme.mgrSeq
		}).width("100%");

		$themeWrap.append($tbl);

		for(var i=0; i<data.theme.length; i++){
			var thmData = data.theme[i];

			var thmFieldId = thmData.thmFieldId;
			var thmFieldNm = thmData.thmFieldNm;
			var thmStartVal = thmData.thmStartVal;
			var thmEndVal = thmData.thmEndVal;
			var thmFieldTyp = thmData.thmFieldTyp;

			var $tr = $("<tr>").addClass("layerThemeElemnet").data(data);
			var $tdTemp = $("<td>");

			var $check = $("<input type='checkbox'>").addClass("toggleThemeLayer").data(data).attr("id", thmStartVal).attr("c", thmFieldId).attr("t", thmFieldTyp).attr("sv", thmStartVal).attr("ev", thmEndVal).prop("checked", true);
			var $checkC = $("<label class='checkboxC'></label>").attr("for", thmStartVal);
			//var $shotcut = $("<span>").addClass("shotcutTheme").text("<img>");
			var $shotcut = this.createLegendGraphic(data.layer.lyrTyp, thmData, data.layer.heatYn);
			var $name = $("<span>").addClass("layerThemeValue").text(thmStartVal);
			if(thmFieldTyp === "N") $name.text(thmStartVal + " ~ " + thmEndVal);
			/*var $name = $("<span>").addClass("layerThemeValue").text(thmFieldNm + "(" + thmStartVal + ")");
			if(thmFieldTyp === "N") $name.text(thmFieldNm + "(" + thmStartVal + " ~ " + thmEndVal + ")")*/
			//var $edit = $("<span>").addClass("editTheme").text("<edit>");

			var $copyTd1 = $tdTemp.clone().width(15).height(30);
			var $copyTd2 = $tdTemp.clone().width(35);
			var $copyTd3 = $tdTemp.clone();
			//var $copyTd4 = $tdTemp.clone();

			$copyTd1.append($check);
			$copyTd1.append($checkC);
			$copyTd2.append($shotcut);
			$copyTd3.append($name);
			//$copyTd4.append($edit);

			$tr.append($copyTd1).append($copyTd2).append($copyTd3)//.append($copyTd4);
			$tbl.append($tr);
		}

		$(".layerTheme").hide();

		return this;
	},

	/**
	 * <pre>
	 * 레이어의 숏컷 이미지 또는 SVG를 생성합니다.
	 *
	 * 타입은 다음과 같습니다.
	 *
	 * T : 'T'MS (배경지도)
	 * P : 'P'oint (점)
	 * L : 'L'ine (선)
	 * G : Poly'G'on (면)
	 * </pre>
	 *
	 * @param type - String
	 * @param data - Object
	 * @param isHeat - boolean
	 */
	createLegendGraphic : function(type, data, isHeat){
		var $result = $("<svg>");

		var lineDash = "";
		//if(Number(data.strokeLineDash) === 10) lineDash = "stroke-dasharray='4'";
		if(Number(data.strokeLineDash) === 5) lineDash = "stroke-dasharray='4'";

		if(data === null) return;
		if(type === "T") $result = $(data.get("shotcut")).addClass("pointer shotcut");
		if(type === "P"){
			if(isHeat){
				var heatBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAE90lEQVRISy2US48kRxWFv8iMzKzM6np0VXVNP6bb09MDYwa3BZo1K8Biw5oN/AckltiIBRuWFuIHIATyyktAQkKInWUj2XiEx2NP98z0Y6qq65Gdle/MiEBVxZGO4sQmzj03rq54N3zf1HqJ7Wf41pLAZLRFwUBk3BEZZW3o6Jz9QNKvU/JFglcK0IY1bLFhW1I7NkskM1xi4zBbsXaYK5tp7bFULrZzSG/rLuI3sz+bsPyajHN2mxY6mvDWsIkwGj8es1VE7FkFh80t3MQiuQ4xaUngNcEYtA2VVFgtB6cfoHzBZVoRC4+FbBFqyUQ3KJ0mS9lhyRZSdxG/vv6DuYo/YbL4ikdHXXj9Xx6dfoc9HdJOZ2xXS/pVRRBL3FISj+fktwmD1g4KTbyMqKwa5WnaewOsQUBYhmTdDpnb4t/nl0xquea8skmFx+7Dx4if/O0XRrWmVHXM/W80yF99zo8fvwnXX9CORuzoCndm8HJJj23qKCOPU3rdAUWckaUJzYNtsjons3N2ju8yJ8Q77KK6Q55PQ56MFzT3T/j0/JL+8SMyuYV47+kHZpQ+4Wr5EW8et5Hjp/zgu9/ikJg39JLXHz+hlQd06zbFzZI8jLFLQdvvklcZulQ0+23YspksRvRO9oka6br1wWGfiVY8u1nA3gO+fHlB7+SUuXIQP//k96ZsTPjPiw856giOfMWP3n7AfjGlOb9EjhRiXuGGAq+Q1NMMFZW02p11YuMJ/KAJHcnN7Yj2wZDMpGRBhX/YxR4GjJIQe3jE06sxwdFDFloifvbXXxmzPWOUfMw372zRL0b88K37tOcvOVA5nVsfM8opXy/xMomaF1RpTsvrUCxTaqHw202UMERFSPtoh7ROkAMf/6BLGlTcVrf07u3xfDbF2T8hVBbip39511g7EbPqM06PBjjjL3jn9ISDYspeUZI/n1Nfxlihwloa5K3BMx6OkpRlQVHl2I6kRmEFNsFBlzhdIrd9RFcSiZhKV9i7ATkFuu9Tt/qIXz79own1OS8W/+Dt4yH68gnf//YxD2RGc3JB+WLBUAywZxozLcguQkQBTW8LlVRo11ClBSKwaDR8aNgkKkG2Gsh+g9pSGN/C9B2ELRA9F3oO4v35P82X1//ievkRD++14epz3nl8uh6u9vgZ1dmModzBuq7Q85JsGmGl0HJbKKUgU1iWtVkimLVJqlJkw8Xt+OBZ0NgsGAIbpKDuWYjfXv7d5O6ExD7Hsl5hz8743v0heyrkUEXoqxHqIkYsFPJGIQuLgAC7Eui0RicVlmsjasAXrPZZWRRYHRcp5Xra10U1LGhaa2PdsRF/Ks/MUl4QcUZmvqKZjxmokDdExK5VcM9RuNMCxiXMKkxUoW4KXCUxlaZOSiwFwrEQmQZHQLVJLmqDWRlKseFKexambSM+1BMzKb/mVfgZoXlGx4u466QcOTkHVs6uyBlWGUxLxKiE25pinNLARaSaOi6gBkuzflzkK7GBWd0zvS5ijZXxlk3lasTvnn9qYmuM6ETkzhWFvKAnYg5ExI7IuCdiBpS0wgxuK8S8pp7miEjjFBY6q1FJiW2s9Xcg2aReoTIbnRlMa2OuA4HWBvHB9KUp/ZhE3BBzRSpe44gztkXKHVKGq1Pk7JPjJRVMi7V5PkkIaECiKOYpTi2gMOvEq/aKpdqYLv/fgYbA1IaqYfCaDf4HuzOgbqPshjwAAAAASUVORK5CYII=";
				$result = $("<img>").addClass("pointer shotcut").attr("src", heatBase64).width(30).height(30);
			}else if(!_common.utils.isNullAndEmpty(data.imgBase64)){
				$result = $("<img>").addClass("pointer shotcut").attr("src", data.imgBase64).width(30).height(30);
			}else{
				$result = $("<svg width='30' height='30'>").addClass("pointer shotcut");
				$result.html("<circle cx='15' cy='15' r='8' stroke='" + data.strokeColor + "' stroke-width='2' fill='" + data.fillColor + "' " + lineDash + "></circle>");
			}
		}
		if(type === "L"){
			$result = $("<svg width='30' height='5'>").addClass("pointer shotcut");
			$result.html("<line x1='30' y1='0' stroke='" + data.strokeColor + "' stroke-width='3' " + lineDash + "></line>");
		}
		if(type === "G"){
			$result = $("<svg width='30' height='20'>").addClass("pointer shotcut");
			$result.html("<rect width='30' height='20' stroke='" + data.strokeColor + "' stroke-width='3' fill='" + data.fillColor + "' " + lineDash + "></rect>");
		}

		$result.click(function(){
			$(this).parent().prev().find(".toggleLayer, .toggleTMSLayer, .toggleThemeLayer").click();
		});

		return $result;
	},

	/**
	 * <pre>
	 * 범례에 생성된 엘리먼트를 그룹 내의 레이어 z-index 순서로 변경합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 */
	sortLayerIndex : function(){
		var $legendWrap = $("#legendWrap");
		$legendWrap.find(".legend").each(function(){
			var $layers = $(this).find(".layer, .layerTheme").sort(function(a, b){
				return $(a).data("z-idx") - $(b).data("z-idx");
			});

			$(this).append($layers);
		});

		return this;
	},

	/**
	 * <pre>
	 * 그룹 내 모든 레이어의 z-index 를 서버에 반영합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 */
	setLayersIndex : function(grpMgrSeq){
		var _this = this;
		var layerIndexArray = new Array();

		var $legendWrap = $("#legendWrap");
		$legendWrap.find(".legend[k=" + grpMgrSeq + "]").find(".layer").not(".tms").each(function(){
			var data = $(this).data();
			var mgrSeq = data.layer.mgrSeq;
			var lyrZidx = data.zIdx;

			layerIndexArray.push({ mgrSeq : mgrSeq, lyrZidx : lyrZidx });
		});

		var param = {};
		for(var i=0; i<layerIndexArray.length; i++){
			param["kv[" + i + "][mgrSeq]"] = layerIndexArray[i].mgrSeq;
			param["kv[" + i + "][lyrZidx]"] = layerIndexArray[i].lyrZidx;
		}
		_common.callAjax("/GMT_layer/setLayersIndex.json", param, function(json){
			if(json.result) _this.setVectorIndex();
		});

		return this;
	},

	/**
	 * <pre>
	 * 지도 내 모든 레이어의 z-index 를 조절합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 */
	setVectorIndex : function(){

		var layerIndexArray = new Array();

		var $legendWrap = $("#legendWrap");
		var zidx = $legendWrap.find(".legend").length;
		$legendWrap.find(".legend").each(function(){
			$(this).find("tbody").find(".layer").each(function(){
				zidx++;
				layerIndexArray.push({ key : $(this).attr("k"), zidx : zidx });
			});
		});

		if("GMXMAP" in window){
			for(var i=0; i<layerIndexArray.length; i++){
				var vector = GMXMAP.getLayer(layerIndexArray[i].key);
				if(vector) vector.setZIndex(layerIndexArray[i].zidx);
			}
		}

		return this;
	},

	/**
	 * <pre>
	 * 지도 내 모든 레이어의 visible 값을 이용하여 범례의 checkbox 상태를 변경합니다.
	 * </pre>
	 */
	setCheckboxToggle : function(){
		var $legendWrap = $("#legendWrap");
		$legendWrap.find(".legend").each(function(){
			$(this).find("tbody").find(".layer").each(function(){
				var layerId = $(this).find(".toggleLayer").attr("id");
				if("GMXMAP" in window){
					if(GMXMAP.getLayer(layerId) != null){
						$(this).find(".toggleLayer").prop("checked", GMXMAP.getLayer(layerId).getVisible());
					}
				}
			});
		});

		$legendWrap.find(".legend").each(function(){
			var totalLength = $(this).find("tbody").find(".layer").length;
			var visibleLength = $(this).find("tbody").find(".layer").find(".toggleLayer:checked").length;
			$(this).find(".layerN").html("<span class='color'>" + visibleLength + "</span>/" + totalLength + "</span>");
		});
	},

	/**
	 * <pre>
	 * 그룹별 현재 보여지는 갯수와 총 갯수를 설정합니다.
	 * </pre>
	 */
	setVisibleCount : function(){
		var $legendWrap = $("#legendWrap");
		$legendWrap.find(".legend").each(function(){
			var totalLength = $(this).find("tbody").find(".layer").length;
			var visibleLength = $(this).find("tbody").find(".layer").find(".toggleLayer:checked").length;
			var visibleTmsLength = $(this).find("tbody").find(".layer").find(".toggleTMSLayer:checked").length;
			$(this).find(".layerN").html("<span class='color'>" + (visibleLength + visibleTmsLength) + "</span>/" + totalLength + "</span>");
		});

		return this;
	},

	/**
	 * <pre>
	 * 그룹 보이기 여부를 설정합니다.
	 * </pre>
	 * @returns {___anonymous_GMXLEGEND}
	 */
	setVisibleGroups : function(){
		var _this = this;
		var $legendWrap = $("#legendWrap");

		/* 레이어가 없는 그룹은 제거하고 열림을 활성화 합니다. */
		$legendWrap.find(".legend").each(function(){
			if($(this).find("tbody").children().length == 0) $(this).remove();

			var k = "grp" + $(this).attr("k");
			if(("localStorage" in window) && (k in localStorage)){
				if(String(localStorage[k]) === "true"){
					$(this).find("tbody").show();
					$(this).find("thead").find(".layerT").addClass("active");
				}
			}
		});

		return this;
	},

	/**
	 * <pre>
	 * 체크 박스의 On/Off 이벤트를 지정합니다.
	 * </pre>
	 *
	 * @returns {___anonymous_GMXLEGEND}
	 */
	bindToggleEvent : function(){
		var _this = this;
		var $legendWrap = $("#legendWrap");

		$legendWrap.find(".legend").find("tbody").hide();

		_this.setVisibleGroups();
		_this.setVisibleCount();

		/* 그룹 영역 보이기 여부를 설정합니다. */
		$legendWrap.find(".legend").find("thead").find("th").click(function(){
			$(this).parent().parent().parent().find("tbody").toggle();

			var k = "grp" + $(this).parent().parent().parent().attr("k");
			if("localStorage" in window) localStorage[k] = $(this).parent().parent().parent().find("tbody").is(":visible");
		});

		/* TMS 레이어의 투명도를 조절합니다. */
		$legendWrap.find(".legend").find(".tmsOpacity").click(function(){
			var k = $(this).attr("k");
			var layerName = $(this).text();
			if($("#tmsOpacityWrap").length === 0){
				var $slider = $("<div>").attr("id", "tmsOpacitySlider").append($("<div>").attr("id", "custom-handle").addClass("ui-slider-handle")).css("margin", "50px 0px").width("90%");
				$slider.find(".ui-slider-handle").css({ "width": "auto", "height": "1.6em", "top": "50%", "margin-top": "-.8em", "text-align": "center", "line-height": "1.6em", "padding": "0px 10px" });
				$slider.slider({
					min: 0,
					max: 100,
					step: 10,
					create: function(){
						var val = 100;
						if(GMXMAP.getLayer(k) != null){
							val = GMXMAP.getLayer(k).getOpacity() * 100;
						}

						$(this).slider("value", val);
						$slider.find("#custom-handle").text(val + "%");
					},
					slide: function(event, ui){
						var val = Number(ui.value); if(val < 10) return false;
						$slider.find("#custom-handle").text(val + "%");

						var opacity = val * 0.01;
						if(GMXMAP.getLayer(k) != null) GMXMAP.getLayer(k).setOpacity(opacity);
					}
				});

				var $children = $("<div>").addClass("table_style").addClass("customScroll").append($slider);

				var $tmsOpacityWrap = $("<div>").attr("title", layerName + " 투명도 조절").attr("id", "tmsOpacityWrap").html($children);
				$tmsOpacityWrap.dialog({
					width: 650,
					height: 180,
					modal : true,
					resizable: false,
					position: {
						my: "center",
						at: "center",
						of: $("#body")
					},
					open: function(){

					},
					close: function(){
						$tmsOpacityWrap.dialog("destroy");
					}
				}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
			}
		});


		/* 그룹 전체 레이어의 토글 설정입니다. */
		$legendWrap.find(".groupLayerToggle").change(function(){
			var $layer = $(this).parent().parent().parent().parent().parent();

			if($(this).is(":checked")){
				$layer.find("tbody").find(".toggleLayer").not(":checked").click();
				$layer.find("tbody").find(".toggleTMSLayer").not(":checked").click();
			}else{
				$layer.find("tbody").find(".toggleLayer:checked").click();
				$layer.find("tbody").find(".toggleTMSLayer:checked").click();
			}

			_this.setVisibleCount();
		});

		/* 레이어의 보이기 여부를 설정합니다. */
		$legendWrap.find(".toggleLayer").change(function(){
			var data = $(this).data();
			var visible = $(this).is(":checked");
//			var layerId = data.layer.lyrId;
			var layerId = $(this).attr("id");//레이어 명칭 중복일때 visible 오류 수정
			var layerNm = data.layer.lyrNm;
			var k = data.layer.mgrSeq;
			var thmUseYn = data.layer.thmUseYn;
			if(thmUseYn){
				var lyrNmOfTheme = $(this).parent().parent().attr('k');

				if(visible){

					var source = GMXLAYER.createSource(GMXLAYER.LayerList[data.layer.tblId]);
					GMXMAP.getLayer(data.layer.tblId).setSource(source);

					$(this).parent().parent().parent().find('.layerTheme[k="'+lyrNmOfTheme+'"]').find('.toggleThemeLayer').prop('checked',true)
				}else{
					$(this).parent().parent().parent().find('.layerTheme[k="'+lyrNmOfTheme+'"]').find('.toggleThemeLayer').prop('checked',false)
				}
			}

			GMXMAP.setLayerVisible(layerId, visible); //레이어 명칭 중복일때 visible 오류 수정

//			GMXMAP.setLayerVisible(layerNm, visible);

			//if(localStorage) localStorage[layerId] = visible;

			//_common.callAjax("/GMT_layer/setLayerVisible.json", { k : k, visibleYn : visible }, function(){});

			_this.setVisibleCount();
		});

		/* 배경지도 레이어의 보이기 여부를 설정합니다. */
		$legendWrap.find(".toggleTMSLayer").change(function(){
			var visible = $(this).is(":checked");
			var layerId = $(this).attr("k");

			GMXMAP.setLayerVisible(layerId, visible);

			//if(localStorage) localStorage[layerId] = visible;

			_this.setVisibleCount();
		});

		//TODO Down 이벤트와 결합하여 코드 다이어트.
		$legendWrap.find(".zIdxUp").click(function(){
			var $layerElem = $(this).parent().parent();
			var grpKey = $layerElem.parent().parent().attr("k");
			var k = $layerElem.attr("k");

			var $prevElem = $layerElem.prev();
			if($prevElem.hasClass("layerTheme")) $prevElem = $prevElem.prev();

			if($prevElem.length > 0){
				var nowIdx = $layerElem.index() + 1;
				var changeIdx = nowIdx - 1;

				var prevElemData = $prevElem.data();
				var layerElemData = $layerElem.data();

				prevElemData["zIdx"] = nowIdx;
				layerElemData["zIdx"] = changeIdx;

				$prevElem.attr("data-z-idx", nowIdx).data(prevElemData);
				$layerElem.attr("data-z-idx", changeIdx).data(layerElemData);

				$layerElem.parent().find(".layerTheme[k=" + k + "]").attr("data-z-idx", changeIdx).data("zIdx", changeIdx);
				$layerElem.parent().find(".layerTheme").each(function(){
					var layerKey = $(this).attr("k");
					var layerIdx = $layerElem.parent().find(".layer[k=" + layerKey + "]").data("zIdx");
					$(this).attr("data-z-idx", layerIdx).data("zIdx", layerIdx);
				});

				_this.sortLayerIndex().setLayersIndex(grpKey);
			}
		});
		$legendWrap.find(".zIdxDown").click(function(){
			var $layerElem = $(this).parent().parent();
			var grpKey = $layerElem.parent().parent().attr("k");
			var k = $layerElem.attr("k");

			var $nextElem = $layerElem.next();
			if($nextElem.hasClass("layerTheme")) $nextElem = $nextElem.next();

			if($nextElem.length > 0){
				var nowIdx = $layerElem.index() + 1;
				var changeIdx = nowIdx + 1;

				var nextElemData = $nextElem.data();
				var layerElemData = $layerElem.data();

				nextElemData["zIdx"] = nowIdx;
				layerElemData["zIdx"] = changeIdx;

				$nextElem.attr("data-z-idx", nowIdx).data(nextElemData);
				$layerElem.attr("data-z-idx", changeIdx).data(layerElemData);

				$layerElem.parent().find(".layerTheme[k=" + k + "]").attr("data-z-idx", changeIdx).data("zIdx", changeIdx);
				$layerElem.parent().find(".layerTheme").each(function(){
					var layerKey = $(this).attr("k");
					var layerIdx = $layerElem.parent().find(".layer[k=" + layerKey + "]").data("zIdx");
					$(this).attr("data-z-idx", layerIdx).data("zIdx", layerIdx);
				});

				_this.sortLayerIndex().setLayersIndex(grpKey);
			}
		});


		var $themeWrap = $("#legendWrap").find(".layerTheme");

		$themeWrap.find(".toggleThemeLayer").change(function(){


			var lyrNmOfTheme = $(this).parent().parent().parent().parent().parent().attr('k');
			var isLayerChecked = $(this).parent().parent().parent().parent().parent().parent().find('.layer[k="'+lyrNmOfTheme+'"]').find('.toggleLayer').prop('checked');
			var isThisThemeChecked = $(this).prop('checked');
			//전부 체크가 안되어있으면 true
			var isAllNotChecked = true;
			$(this).parent().parent().parent().parent().parent().parent().find('.toggleThemeLayer').each(function(){
			    if($(this).prop('checked')){
			    	isAllNotChecked = false;
			    }
			});

			//모든 테마가 체크가 안되어있고 레이어가 체크가 되어있으면
			if(isAllNotChecked && isLayerChecked){
				$(this).parent().parent().parent().parent().parent().parent().find('.layer[k="'+lyrNmOfTheme+'"]').find('.toggleLayer').prop('checked',false);
			}
			//레이어가 체크가 안되어있고 현재 테마가 체크가 되어있으면
			if(!isLayerChecked){
				if(isThisThemeChecked){
					$(this).parent().parent().parent().parent().parent().parent().find('.layer[k="'+lyrNmOfTheme+'"]').find('.toggleLayer').prop('checked', true);
				}
			}


			var data = $(this).data();
			var lyrNm = data.layer.lyrNm;
			var lyrId = data.layer.tblId;

			var $rootTbl = $(this).parent().parent().parent();
			var kv = new Array();

			var thmFieldId = null;
			var thmFieldTyp = null;

			$rootTbl.find(".toggleThemeLayer").each(function(){
				var param = {};

				thmFieldId = $(this).attr("c");
				thmFieldTyp = $(this).attr("t");
				var thmStartVal = $(this).attr("sv");
				var thmEndVal = $(this).attr("ev");

				var visible = $(this).is(":checked");
				if(visible){
					if(thmFieldTyp === "N"){
						param["c"] = thmFieldId;
						param["sv"] = thmStartVal;
						param["ev"] = thmEndVal;
					}else if(thmFieldTyp === "S"){
						param[thmFieldId] = thmStartVal;
					}
					kv.push(param);
				}
			});

			if(kv.length == 0){
				var defaultParam = {};

				if(thmFieldTyp === "N"){
					defaultParam["c"] = thmFieldId;
					defaultParam["sv"] = 0;
					defaultParam["ev"] = 0;
				}else if(thmFieldTyp === "S"){
					defaultParam[thmFieldId] = undefined;
				}

				kv.push(defaultParam);
			}

			var filter = null;
			if(thmFieldTyp === "N"){
				filter = GMXLAYER.makeNumberRangeFilters(kv);
			}else if(thmFieldTyp === "S"){
				filter = GMXLAYER.makeFilters(kv);
			}

			var source = GMXLAYER.createSource(data, filter);

			GMXMAP.getLayer(lyrId).setSource(source);
			GMXMAP.getLayer(lyrId).setVisible(true);

		});

		return this;
	}

}