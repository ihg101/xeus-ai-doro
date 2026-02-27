/**
 * <pre>
 * nms 테마를 관리하는 객체 입니다.
 * </pre>
 *
 * @author 이주영
 * @version 1.0r
 */
geomex.xeus.NMSTheme = {


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
	 * 링주제도 설정 객체 입니다.
	 * 테마로 사용될 필드의 값과 이미지 이름을 매치하여 관리합니다.
	 */
	themeLineList : {},

	/**
	 * 선택된 테마값의 배열입니다.
	 * checkbox가 변경될 떄마다 배열도 변화합니다.
	 */
	selectTheme : null,
	selectLineTheme : null,

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

	createParentWrap : function(){
		var $table = $("<table></table>");
		$table.append("<tr><td></td><td></td><tr><tr><td></td><td></td><tr>");
	},

	/**
	 * 주제도 관리 엘리먼트를 생성합니다.
	 */
	createThemeWrap : function(){
		var Class = this;

		this.themeList = Layers.LayerTheme["asset_infra"];
		this.themeLineList = Layers.LayerTheme["asset_cable"];

		var $div = $("<div id='nmsThemeWrap'></div>").css({
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
		var $table = $("<table></table>").width("100%")
										 /*.append("<tr><th colspan='7'><h2>nms 주제도</h2></th></tr>")*/
										 .append("<tr></tr>")
										 .append("<tr></tr>");
		var $table2 = $("<table></table>").width("100%")
										 /*.append("<tr><th colspan='7'><h2>nms 주제도</h2></th></tr>")*/
										 .append("<tr></tr>");
		for(var key in this.themeList){
			var id = "checkbox-" + idx;
			var $td = $("<td></td>");

			var $checkbox = $("<input type='checkbox' class='nmspoint' name='nmspoint-" + id + "' id='nmspoint-" + id + "' thmval='" + key + "' checked>").css({
				"margin-left" : "20px",
				"vertical-align" : "middle"
			});

			var $img = $("<img src='" + Layers["asset_infra"].getThemeImg(key) + ".png'>").css({
				"width"  : "25",
				"height" : "25",
				"vertical-align" : "middle"
			});

			var $lebel = $("<label for='nmspoint-" + id + "'>" + this.themeList[key] + "</label>").css({
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

		for(var key in this.themeLineList){
			var id = "checkbox-" + idx;
			var $td = $("<td></td>");

			var $checkbox = $("<input type='checkbox' class='nmsline' name='nms-" + id + "' id='nms-" + id + "' thmval='" + key + "' checked>").css({
				"margin-left" : "20px",
				"vertical-align" : "middle"
			});

			var color = this.themeLineList[key];
			var $img = $("<span></span>").css({
				"width"  : "25",
				"height" : "3",
				"vertical-align" : "middle",
				"display" : "inline-block",
				"margin-top" : "-2px",
				"background" : color
			});

			var $lebel = $("<label for='nms-" + id + "'>" + key + "</label>").css({
				/*"margin-right"  : "15px",*/
				"font-size" 	: "13px"
			});

			$td.append($checkbox);
			$td.append($img);
			$td.append($lebel);

			$table2.find("tr").eq(0).append($td);

			idx++;
		}

		$div.append($table).append($table2);
		$(".contentWrapper").find(".map-target").append($div);//!! 테스트 해봐야 함.

		$(".nmspoint").change(function(){
			var array = new Array();
			$(".nmspoint").each(function(){
				if($(this).is(":checked")){
					array.push($(this).attr("thmval"));
			    }
			});
			Layers["asset_infra"].loadFunction(xeusLayout.mapService.Layers.INF, array.toString());
		});
		$(".nmsline").change(function(){
			var array = new Array();
			$(".nmsline").each(function(){
				if($(this).is(":checked")){
					array.push($(this).attr("thmval"));
			    }
			});
			Layers["asset_cable"].loadFunction(xeusLayout.mapService.Layers.NMS, array.toString());
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
