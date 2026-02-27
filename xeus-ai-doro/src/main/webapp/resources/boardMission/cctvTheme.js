/**
 * <pre>
 * CCTV 테마를 관리하는 객체 입니다.
 * geomex.xeus.CCTV 객체를 의존하며, themeList를 변경하여 심볼 주제도를 관리할 수 있습니다.
 * </pre>
 *
 * @author 이주영
 * @version 1.0r
 */
geomex.xeus.CCTVTheme = {

	/**
	 * GeoJson Parser 입니다.
	 * Geomex symbolize 요청으로 응답받은 GeoJson의 내용(Count, List, Symbol)을 변경합니다.
	 *
	 * @param json - GeoJson (Geomex symbolize service)
	 * @param vector - ol.layer.Vector
	 * @caller geomex.xeus.CCTV > _reload()
	 */
	parseJSON : function(json, vector){
		var Class = this;
		if(this.selectTheme != null){
			var tempFeatures = new Array();
			for(var i=0; i<json.features.length; i++){
				var feature = json.features[i];
				var children = feature.properties.cctvList;
				var childLength = children.length;

				var tempArray = new Array();
				for(var l=0; l<childLength; l++){
					var gbnVal = children[l].gbnCd;

					if(Class.isThemeContains(gbnVal)){
						tempArray.push(children[l]);
					}
				}
				json.features[i].properties.cctvList = tempArray;
				json.features[i].properties.cctvSize = tempArray.length;
				if(tempArray.length != 0){
					var symCde = tempArray[0].gbnCd;
					if(tempArray.length > 1) symCde = globalCCTVObject.getSymbolIcon(tempArray.length);
					json.features[i].properties.symCode = symCde;
					tempFeatures.push(json.features[i]);
				}
			}
			json.features = tempFeatures;
		}

		var source = vector.getSource();
		var features = new ol.format.GeoJSON().readFeatures(json);
		source.clear();
		source.addFeatures(features);

		return this;
	},

	/**
	 * 지도 하단의 주제도 ON/OFF 관리 최상위 엘리먼트입니다.
	 */
	themeWrap : null,

	/**
	 * 주제도 설정 객체 입니다.
	 * 테마로 사용될 필드의 값과 이미지 이름을 매치하여 관리합니다.
	 */
	themeList : {},

	/**
	 * 주제도 데이터를 생성합니다.
	 */
	themeLoad : function(){
		Layers.asset_cctv.themeLoad();
		this.themeList = Layers.LayerTheme["asset_cctv"];
	},

	/**
	 * 선택된 테마값의 배열입니다.
	 * checkbox가 변경될 떄마다 배열도 변화합니다.
	 */
	selectTheme : null,

	/**
	 * 선택된 테마값에 파라미터 값이 존재하는지 검사합니다.
	 */
	isThemeContains : function(value){
		for(var i=0; i<this.selectTheme.length; i++){
			if(value == this.selectTheme[i]){
				return true;
			}
		}
		return false;
	},

	/**
	 * 주제도 관리 엘리먼트를 생성합니다.
	 */
	createThemeWrap : function(){
		this.themeLoad();

		var Class = this;

		var $div = $("<div id='themeWrap'></div>").css({
			"position"   : "absolute",
			"z-index"    : "1",
			"bottom"	 : "0",
			"left"		 : "0",
			"width"		 : "100%",
			"padding"	 : "15px 0px",
			//"height"	 : "50px",
//			"background" : "#212223"
			"background" : "rgba(33, 34, 35, 0.85)"
		});

		var idx = 1;
		var $table = $("<table></table>").width("100%").height("80px")
										 /*.append("<tr><th colspan='7'><h2>CCTV 주제도</h2></th></tr>")*/
										 .append("<tr></tr>")
										 .append("<tr></tr>");
		for(var key in this.themeList){
			var id = "checkbox-" + idx;
			var $td = $("<td></td>");

			var $checkbox = $("<input type='checkbox' class='cctvcheck' name='" + id + "' id='" + id + "' thmval='" + key + "'>").css({
				"margin-left" : "20px",
				"vertical-align" : "middle"
			}).prop("checked", true);

			var $img = $("<img src='../res/sym/cctv/" + this.themeList[key] + ".png'>").css({
				"width"  : "25",
				"height" : "25",
				"vertical-align" : "middle"
			}).on("click", function(){
				$(this).next().click();
			});

			var $lebel = $("<label for='" + id + "'>" + key + "</label>").css({
				/*"margin-right"  : "15px",*/
				"font-size" 	: "13px"
			});

			$td.append($checkbox);
			$td.append($img);
			$td.append($lebel);

			if(idx < 9){
				$table.find("tr").eq(0).append($td);
			}else{
				$table.find("tr").eq(1).append($td);
			}

			idx++;
		}

		$div.append($table);
		$div.find("input[type=checkbox]").on("change", function(){

			/*
			 * 180115 이은규
			 * cctv레이어의 범주가 변경되면 열려있는 cctv-overlay-content를 닫는다.
			 */
			$('#cctv-overlay-closer')[0].click();

			Class.selectTheme = new Array();
			var array = new Array();
			$(".cctvcheck").each(function(){
				if($(this).is(":checked")){
					Class.selectTheme.push($(this).attr("thmval"));
					array.push($(this).attr("thmval"));
			    }
			});
			Layers["asset_cctv"].loadFunction(xeusLayout.mapService.Layers.CCTV, array.toString());
		});
		$(".contentWrapper").find(".map-target").append($div);//!! 테스트 해봐야 함.
		this.themeWrap = $div;

		return this.themeWrap;
	},

	/**
	 * 필드값으로 Icon 파일명을 검색합니다.
	 */
	getIconByName : function(_Name){
		return this.themeList[_Name];
	},

	destroy : function(){
		$(this.themeWrap).remove();
	}

};
