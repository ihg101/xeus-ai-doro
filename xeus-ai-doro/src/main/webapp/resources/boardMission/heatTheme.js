/**
 * <pre>
 * geomex.xeus.CCTV 객체를 의존하며, themeList를 변경하여 심볼 주제도를 관리할 수 있습니다.
 * </pre>
 *
 * @author 이주영
 * @version 1.0r
 */
geomex.xeus.HEATTheme = {

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
		var array = _common.getCodeByGroup("C51");
		for(var i=0; i<array.length; i++){
			this.themeList[array[i].cdeCde] = array[i].cdeNm;
		}
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

		var $div = $("<div id='heatThemeWrap'></div>").css({
			"position"   : "absolute",
			"z-index"    : "1",
			"bottom"	 : "0",
			"left"		 : "0",
			"width"		 : "100%",
			"padding"	 : "15px 0px",
			//"height"	 : "50px",
			"background" : "rgba(33, 34, 35, 0.85)"
		});

		var idx = 1;
		var $table = $("<table></table>").width("100%")
										 /*.append("<tr><th colspan='7'><h2>CCTV 주제도</h2></th></tr>")*/
										 .append("<tr><td></td></tr>");

		var $heat1 = $("<input type='radio' name='heatmap' id='heatmap-1' checked>").css({
			"margin-left" : "20px",
			"vertical-align" : "middle"
		});
		var $heat2 = $("<input type='radio' name='heatmap' id='heatmap-2'>").css({
			"margin-left" : "20px",
			"vertical-align" : "middle"
		});

		var $span1 = $("<span>CCTV 분포도</span>").css("cursor", "default").click(function(){
			$(this).prev().click();
			if(xeusLayout.mapService.Layers.HEAT != null) xeusLayout.mapService.Layers.HEAT.setVisible(true);
			if(xeusLayout.mapService.Layers.RQST != null) xeusLayout.mapService.Layers.RQST.setVisible(false);
		});
		var $span2 = $("<span>영상반출 분포도</span>").css("cursor", "default").click(function(){
			$(this).prev().click();
			if(xeusLayout.mapService.Layers.HEAT != null) xeusLayout.mapService.Layers.HEAT.setVisible(false);
			if(xeusLayout.mapService.Layers.RQST != null) xeusLayout.mapService.Layers.RQST.setVisible(true);
		});

		$table.find("tr").find("td").eq(0).append($heat1, $span1, $heat2, $span2);
		for(var key in this.themeList){
			var id = "checkbox-" + idx;
			var $td = $("<td></td>");

			var $checkbox = $("<input type='checkbox' class='heatcheck' name='heat-" + id + "' id='heat-" + id + "' thmval='" + this.themeList[key] + "' checked>").css({
				"margin-left" : "20px",
				"vertical-align" : "middle"
			});

			var $lebel = $("<label for='heat-" + id + "' class='heatcheck'>" + this.themeList[key] + "</label>").css({
				/*"margin-right"  : "15px",*/
				"font-size" 	: "13px"
			});

			$td.append($checkbox);
			//$td.append($img);
			$td.append($lebel);

			$table.find("tr").eq(0).append($td);

			idx++;
		}

		$table.find("td").eq(0).width(260);
		$div.append($table);
		$div.find(".heatcheck").hide();
		$div.find("#heatmap-1").on("click", function(){
			$div.find(".heatcheck").hide();
		});
		$div.find("#heatmap-2").on("click", function(){
			$div.find(".heatcheck").show();
		});
		$div.find("input[type=checkbox]").on("change", function(){
			Class.selectTheme = new Array();
			$div.find("input[type=checkbox]").each(function(){
				if($(this).is(":checked")){
					Class.selectTheme.push($(this).attr("thmval"));
				}
			});
		});
		$(".contentWrapper").find(".map-target").append($div);//!! 테스트 해봐야 함.
		$(".heatcheck").change(function(){
			var array = new Array();
			$(".heatcheck").each(function(){
				if($(this).is(":checked")){
					array.push($(this).attr("thmval"));
			    }
			});
			Layers["v_asset_cctv_heat"].loadFunction(xeusLayout.mapService.Layers.RQST, array.toString());
		});
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
