/**
 * 객체 선택 이벤트 입니다.
 */
"use strict";

(function(GMXMAP, GMXLAYER){
if(GMXMAP != null && GMXMAP instanceof ol.Map && GMXLAYER != null){

	if($("#featureSelectInfoWrap").length === 0){
		$("#body").append("<div id='featureSelectInfoWrap' title='' class='dialogWrap customScroll table_style'></div>");
		$("#featureSelectInfoWrap").dialog({ autoOpen : false, }).parent().draggable({ containment: "#map" });
	}

	/**
	 * <pre>
	 * 4. 특정 기능에서 이벤트가 필요할 경우 바인딩 합니다.
	 * 단독 재생 및 그리드 재생 기능을 바인딩 합니다.
	 * </pre>
	 */
	var bindEvent = function(){
		$("#featureSelectInfoWrap").find("#featureList").find("table").find("tbody").find("tr").click(function(){
//			$("#featureSelectInfoWrap").find("#featureList").find("table").find("tbody").find("tr").css("background-color", "#282828");
//			$(this).css("background", "#333");

			var $table = $(this).parent();
			var feature = $(this).data("feature");
			if(feature != null){
				if($("#featureSelectInfoWrap").parent().find(".ui-dialog-titlebar").data("isFullWidth")) $("#featureSelectInfoWrap").parent().find(".ui-dialog-titlebar").dblclick();
				if(feature.getGeometry().getType() === "Point"){
					GMXMAP.addPulse(feature.getGeometry().getCoordinates(), true);
				}else{
					GMXMAP.addHighLight(feature, true);
				}
			}
		});
	}

	/**
	 * <pre>
	 * 3. 생성된 $accordion 객체에 표현할 테이블을 생성합니다.
	 * 지도에서 클릭된 features 객체를 이용합니다.
	 * <b style="color:red;">
	 * 주의) class attribute 에 "asset_cctv" 항목과 같이
	 * 특정 레이어에 지정되어야 할 값은 미리 지정 후,
	 *
	 * 불필요시 마지막에 제거합니다.
	 * </b>
	 * <pre>
	 */
	var createTableHeadAndBody = function(columnInfo, features){
		var $accordion = $("#featureSelectInfoWrap").find("#featureList");

		var featureCount = {};
		var featureTotalCount = features.length;
		for(var i=0; i<featureTotalCount; i++){
			if(_common.utils.isNullAndEmpty(features[i].getId())) continue;

			var mainId = features[i].getId().split(".")[0];
			var mainKey = features[i].getId().split(".")[1];
			var featureProp = features[i].getProperties();

			var $table = $accordion.find("#feature_select_" + mainId).find("table");

			if(!(mainId in GMXLAYER.LayerList)) continue;

			var styleLabel = GMXLAYER.LayerList[mainId].style.textText;

			if(mainId in featureCount){
				featureCount[mainId] = featureCount[mainId] + 1;
			}else{
				featureCount[mainId] = 1;
			}

			if($table.find("tbody").find("tr").length == 50) continue;

			//Style 지정시 라벨이 있을 경우
			if(!_common.utils.isNullAndEmpty(styleLabel)){
				if($table.find("thead").children().length === 0){
					var $theadTr = $("<tr>");
					var $idxTh = $("<th>").width("100").text("순번");
					var $nmTh = $("<th>").text("명칭");

					$theadTr.append($idxTh).append($nmTh);
					$table.find("thead").append($theadTr);
				}

				var textVal = _common.utils.validNull(featureProp[styleLabel]);

				var $bodyTr = $("<tr>").addClass("pointer");
				var $idxTd = $("<td>").text($table.find("tbody").children().length + 1);
				var $nmTd = $("<td>").append("<div class='sText' title='" + textVal + "'>" + textVal + "</div>");

				$bodyTr.data("feature", features[i]).append($idxTd).append($nmTd);

				$table.find("tbody").append($bodyTr);

			//Style 지정시 라벨이 없을 경우
			}else{
				var column = (mainId in columnInfo ? columnInfo[mainId] : null);
				var columnLength = column.length;
				if(column !== null && $table.find("thead").children().length === 0){
					var $headTr = $("<tr>");
					$headTr.append("<th width='100'>순번</th>");

					for(var l=0; l<columnLength; l++){
						var colId = column[l].colId;
						var colNm = column[l].colNm;
						if(_common.utils.isNullAndEmpty(colNm)) colNm = colId;
						var pkey = column[l].pkey;

						if(colId !== "geometry" && colId !== "_geometry" && colId !== "_annox" && colId !== "_annoy" && colId !== "_gid"){
							$headTr.append("<th col='" + colId + "' pkey='" + pkey + "' width='100'>" + colNm + "</th>");
						}
					}

					$table.find("thead").append($headTr);
				}

				var $bodyTr = $("<tr>").addClass("pointer");
				$bodyTr.append("<td><div class='sText'>" + ($table.find("tbody").children().length + 1) + "</div></td>");

				for(var l=0; l<columnLength; l++){
					var colId = column[l].colId;
					var pkey = column[l].pkey;
					var val = featureProp[colId];
					if(pkey) val = mainKey;

					var textVal = _common.utils.validNull(val);

					if(colId !== "geometry" && colId !== "_geometry" && colId !== "_annox" && colId !== "_annoy" && colId !== "_gid"){
						$bodyTr.data("feature", features[i]).append("<td><div class='sText'>" + textVal + "</div></td>");
					}
				}

				$table.find("tbody").append($bodyTr);
			}
		}

		for(var key in featureCount){
			var $btn = $accordion.find("#feature_select_" + key).find("button").eq(0);
			if(featureCount[key] >= 50){
				var text = $btn.text() + " (총 " + featureCount[key] + " 개의 겹침 객체 중 50개 표시)";
				$btn.text(text);
			}else{
				var text = $btn.text() + " (총 " + featureCount[key] + " 개)";
				$btn.text(text);
			}
		}
	}

	/**
	 * <pre>
	 * 2. Table 객체를 생성합니다.
	 * 지도에서 클릭된 지점의 Layer 정보를 이용합니다.
	 * </pre>
	 */
	var createAccordion = function(layers, features){
		$("#featureSelectInfoWrap").find("#featureList").remove();

		var columnInfo = {};
		var $accordion = $("<div>").attr("id", "featureList").width("100%").height("100%").css("position", "relative");
		var titleIdx = 0;
		for(var i=0; i<layers.length; i++){
			var layerProp = layers[i].getProperties();
			var layerSchema = layerProp.schema;
			var layerId = layerProp.id;
			var layerNm = layerProp.name;

			if(_common.utils.isNullAndEmpty(layerId)) continue;

			var elementId = "feature_select_" + layerId;

			if($accordion.find("#" + elementId).length === 0){
				titleIdx++;

				var $table = $("<table>").addClass("default").append("<thead>").append("<tbody>");
				//var $title = $("<h3>").text(layerNm);
				var $title = $("<button>").addClass("tLeft btn_style pointer").text(String(titleIdx) + ". " + layerNm).click(function(){
					if($(this).next().is("table")) $(this).next().toggle("blind");
				});//.css("position", "absolute");

				var $item = $("<div>").attr("id", elementId).attr("k", layerId).addClass("customScroll").css({
					"width": "100%",
					"overflow": "auto"
				});
				$item.append($title).append($table);

				$accordion.append($item);

				columnInfo[layerId] = GMXMAP.getColumnInfo(layerSchema, layerId);
			}
		}

		$("#featureSelectInfoWrap").append($accordion);

		createTableHeadAndBody(columnInfo, features);
		bindEvent();

		layers = null;
		features = null;
	}

	/**
	 * <pre>
	 * 1. OpenLayers Map Click Event 를 바인딩 합니다.
	 * Cluster 객체의 정보를 확인합니다.
	 * Single Feature 객체의 정보를 확인할 경우 GMXMAP.createSingleFeatureInfoDialog 를 호출하세요.
	 * </pre>
	 */
	var clusterFeatureSelectEvent = function(evt){
		var layers = new Array();
		var features = new Array();

		GMXMAP.forEachFeatureAtPixel(evt.pixel, function(f, l){
			if(l.get("id") !== "user_sketch_geom" && l.get("id") !== "contextMenuVector" && l.get("id") !== "contextMenuSpatialVector"){
				layers.push(l);

				if("features" in f.getProperties()){
					var featureList = f.getProperties().features;
					for(var i=0; i<featureList.length; i++){
						features.push(featureList[i]);
					}
				}else{
					features.push(f);
				}
			}
		});

		if(layers.length === 0 && features.length === 0) return false;

		createAccordion(layers, features);

		if(!$("#featureSelectInfoWrap").dialog("isOpen")){
			$("#featureSelectInfoWrap").dialog({
				title: "클러스터 객체 정보",
				width: 500,
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function(){
					$(this).parent().find(".ui-dialog-titlebar").data("isFullWidth", false).off("dblclick").dblclick(function(){
						var fullScreen = $(this).data("isFullWidth");
						if(!fullScreen){
							$("#featureSelectInfoWrap").dialog("option", "width", $("#map").width());
							$("#featureSelectInfoWrap").dialog("option", "height", $("#map").height());
							$(this).data("isFullWidth", true);
						}else{
							$("#featureSelectInfoWrap").dialog("option", "width", "500px");
							$(this).data("isFullWidth", false);
						}
					});
				},
				close: function(){

				}
			}).dialog("open");
		}
	};


	/**
	 * <pre>
	 * 1. OpenLayers Map Click Event 를 바인딩 합니다.
	 *  모두 영상정보 신청 dialog의 CCTV선택으로 이동합니다
	 * </pre>
	 */
	var moveAllCctvToRqstDialog = function(itemList,moveAbleCnt){
		var addRowCnt = 0;
		if(moveAbleCnt == undefined){
			var len = itemList.length;
		}else{
			var len = moveAbleCnt;
		}

		for(var i=0; i<len; i++){
//			if(i >19){
//				break;
//			}
			if(!Array.isArray(itemList[i].items)){
				continue;
			}
			var _item = itemList[i].items[0];

			if(!(location.pathname.contains("tvius.do") && $(".usrTviusRqst").length > 0 && $(".usrTviusRqst").is(":visible"))){
				alert("해당 기능은 영상정보 신청 기능에서만 가능합니다.");
				return false;
			}

			var reqGbn='';
			if($('.aviWrapper').is(':visible')){
//				if ( SELECTED_CCTV_COUNT >= 10){
//					alert("선택 할 수 있는 CCTV는 최대 10개입니다.");
//					return;
//				}
				addRowCnt++;
				reqGbn = '반출';//열람도 똑같은 로직이므로 반출로 통일
//				SELECTED_CCTV_COUNT++;
				addCctv(_item.data.mgrNo, _item.data.cctvNm, _item.data.center, reqGbn);

				/**
				 * CCTV 추가 시 모든 CCTV row의 시간 유효성을 검사한다.
				 * tr 고유 식별자를 정하지 않고 모든 CCTV row를 다 돌린다.
				 */
				$('#tbl_cctv_list .cctv_row').each(function() {
					cctvTimeChk($(this).find('[name=cctv_sdate]'));
				});
			}
		}
		alert("선택한 "+addRowCnt+"개의 카메라가 반출 대상 카메라로 이동했습니다.");
	};

	//OpenLayers Map 객체에 클릭 이벤트 바인딩이 필요한 경우.
	//GMXMAP.on("click", clusterFeatureSelectEvent);

	if(!("selectClusterContextItem" in GMXMAP)) GMXMAP.selectClusterContextItem = function(evt){
		return {
			text: "<b>클러스터</b> 객체 정보 보기",
			callback: function(){
				clusterFeatureSelectEvent(evt);
			}
		}
	}


	//OpenLayers Map 객체에 클릭 이벤트 바인딩이 필요한 경우.
	//GMXMAP.on("click", clusterFeatureSelectEvent);

	if(!("moveAllCctvContextItem" in GMXMAP)) GMXMAP.moveAllCctvContextItem = function(itemList){
		return {
			text: "모두 <b>반출 대상 카메라</b>로 지정",
			callback: function(){
				//영상정보 신청으로 이동한 카메라 개수
				var cctvRowCnt = $('#tbl_cctv_list > tbody').find('tr').length-1;

				if(cctvRowCnt >= 20){
					alert("반출 카메라는 최대 20개입니다.");
					return;
				}


				if(itemList.length+cctvRowCnt>20){
					if(confirm("반출 카메라 최대 개수는 20대입니다.\n현재 반출 카메라는 "+cctvRowCnt+"대가 있습니다.\n선택하신 "+(itemList.length)+"대 중 "+(20-cctvRowCnt)+"대만 반출  카메라로 이동하겠습니까?")){
						//TODO 파라미터로 남은 CCTV 내일 보내준다
						moveAllCctvToRqstDialog(itemList,20-cctvRowCnt);
					}
				}
				else{
					moveAllCctvToRqstDialog(itemList);
				}
				var cctvRowCnt = $('#tbl_cctv_list > tbody').find('tr').length-1;
				$('#lbl_cctvList').text("CCTV 선택(총 "+cctvRowCnt+"대)");
			}
		}
	}

}
})(GMXMAP, GMXLAYER);