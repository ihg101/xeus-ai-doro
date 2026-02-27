/**
 * Feature 우클릭 이벤트 객체 입니다.
 */
"use strict";

(function(GMXMAP, GMXLAYER, GMXLEGEND, GMXCCTV, GMXINFRA){

if(GMXMAP != null && GMXLAYER != null && GMXLEGEND != null){
	if(GMXMAP instanceof ol.Map){

		var createTbody = function(layerId, featureProp, columnInfo){
			var $tbl = $("#featureInfoWrap").find("table");
			var $tbody = $tbl.find("tbody").html("");

			for(var key in featureProp){
				var isHidden = false;
				if(key === "geometry" || key === "_geometry" || key === "_annox" || key === "_annoy" || key === "_gid" || key === "_fid"){
					isHidden = true;
				}

				var $th = $("<th>").width(100).text(key);

				for(var i=0; i<columnInfo.length; i++){
					if(key === columnInfo[i].colId){
						if(!_common.utils.isNullAndEmpty(columnInfo[i].colNm)){
							$th.text(columnInfo[i].colNm);
						}
					}
				}

				// var $input =
				// $("<input>").addClass("featureInfoValue").attr("id",
				// key).val(featureProp[key]).prop("readonly",
				// true).prop("disabled", true);
				// var $td = $("<td>").append($tarea);

				var $td = $("<td>");
				// 전체 레이어 가능하도록.
				if(location.pathname.endsWith("/gisEdit.do")){
					if(GMXMAP.isEditing && (GMXMAP["editLayerId"] === "user_sketch_geom") && (layerId === "user_sketch_geom")){
						if(key === "label_txt" || key === "_gid"){
							var $tarea = $("<textarea>").addClass("featureInfoValue").attr("id", key).val(featureProp[key]).prop("readonly", true).prop("disabled", true);
							$td.append($tarea);
						}else{
							$td.text(featureProp[key]);
						}
					}else{
						var $tarea = $("<textarea>").addClass("featureInfoValue").attr("id", key).val(featureProp[key]).prop("readonly", true).prop("disabled", true);
						$td.append($tarea);
					}
				}else{
					$td.text(featureProp[key]);
				}

				var $tr = $("<tr>").append($th).append($td);
				if(isHidden) $tr.addClass("hidden");

				$tbody.append($tr);
			}

			// feature 이미지
			var $th = $("<th id='featureImage'>").width(100).text("이미지");
			var $td = $("<td>");

			var imgNm = "이미지 없음";

			var tblInfoList = columnInfo[0].tblId.split(".");
			var schemaNm = columnInfo[0].tblSchema;

			var tblId;
			if(tblInfoList.length > 1){
				tblId = tblInfoList[1];
			}
			else{
				tblId = tblInfoList[0];
			}

			var refMgrNo = featureProp._gid;

			var param = {};
			param["schemaNm"] = schemaNm;


			param["tblId"] = tblId;
			param["refMgrNo"] = refMgrNo;


			var imgList = null;
			try{
				_common.callAjax("/image/getList.json", param, function(json){
					if(json.result.length >= 1){
						imgList =  json.result;
					}
				}, false);
			}catch(error){
				imgList = null;
			}


// var $imageNm $('');
			if(imgList == null){
				var $imageNm = $('<a class="img_a" style="cursor: pointer; color: #7780ff;" schemaNm = "'+schemaNm+'" tblId = "'+tblId+'" refMgrNo = "'+refMgrNo+'">'+"이미지 없음"+'</a>');
				bindImageNmWithClickEvent($imageNm);
			}else if(imgList.length == 1){
				var $imageNm = $('<img class="img_a" alt="'+schemaNm+"."+tblId+"_"+refMgrNo+'" src="./image/getImage.do?schemaNm='+schemaNm+'&tblId='+tblId+'&refMgrNo='+refMgrNo+'&c='+Date.now()+'" style="width:40px;height:40px;margin-top:10px;" schemaNm = "'+schemaNm+'" tblId = "'+tblId+'" refMgrNo = "'+refMgrNo+'" mgrSeq = "'+imgList[0].mgrSeq+'">');
				bindImageNmWithClickEvent($imageNm);
			}else{
				var $imageNm = $('<div>');
				for(var i=0; i<imgList.length; i++){
					var $_html= $('<img class="img_a" alt="'+schemaNm+"."+tblId+"_"+refMgrNo+'" src="./image/getImage.do?mgrSeq='+imgList[i].mgrSeq+'&c='+Date.now()+'" style="width:40px;height:40px;margin-top:10px;" schemaNm = "'+schemaNm+'" tblId = "'+tblId+'" refMgrNo = "'+refMgrNo+'"  mgrSeq = "'+imgList[i].mgrSeq+'">');
					bindImageNmWithClickEvent($_html);

					$imageNm.append($_html);
				}
// $imageNm = $(_html);
			}




			var $div = $('<div style="float:right;display:block">');

			var $imageUploadbutton = $('<button id="imageUploadBtn"style="margin-left:30px;display:none;">').addClass("btn_style2").text("업로드").click(function(){
				$("#featureInfoWrap").find("#uploadFeatureImg").click();
			});

			var $imageDeletebutton = $('<button id="imageDeleteBtn" style="margin-left:30px;display:none;">').addClass("btn_style2").text("삭제").click(function(){

				var $th = $("#featureInfoWrap > div tbody th[id='featureImage']");

				if($th.parent().find(".img_a").text() == "이미지 없음"){
					return;
				}
				var param = {};
// param.schemaNm = $(this).parent().parent().find('img').attr('schemaNm');
// param.tblId = $(this).parent().parent().find('img').attr('tblId');
// param.refMgrNo = $(this).parent().parent().find('img').attr('refMgrNo');

				var mgrSeqStr = "";

				$(this).parent().parent().find('img').each(function(){

					mgrSeqStr += $(this).attr('mgrSeq')+",";

				});

				mgrSeqStr = mgrSeqStr.substring(0,mgrSeqStr.length-1);
				param.mgrSeqStr = mgrSeqStr;


				_common.callAjax("/image/delImgList.json", param, function(json){
					if(json.result){
						var imgNm = "이미지 없음";
						var $imageNm = $('<a class="img_a" style="cursor: pointer; color: #7780ff;">'+imgNm+'</a>');

						var $th = $("#featureInfoWrap > div tbody th[id='featureImage']");
						$th.parent().find(".img_a").remove();
						$th.parent().find('td').prepend($imageNm);

						alert('삭제되었습니다.');
					}
				}, false);
			});
			$div.append($imageUploadbutton).append($imageDeletebutton);


			var $form = $('<form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">');
			var $schemaNm = $('<input type="text" name="schemaNm" id="schemaNm" class="hidden" value="'+schemaNm+'">');
			var $tblId = $('<input type="text" name="tblId" id="tblId" class="hidden" value="'+tblId+'">');
			var $refMgrNo = $('<input type="text" name="refMgrNo" id="refMgrNo" class="hidden" value="'+refMgrNo+'">');
			var $imgSeq = $('<input type="text" name="imgSeq" id="imgSeq" class="hidden" value="1">');

			var $uploadFeatureImg = $('<input type="file" name="uploadFeatureImg" id="uploadFeatureImg" class="hidden" accept=".jpg, .jpeg, .png, gif" multiple>').on("change", function(){

				_common.formSubmit("/image/addFeatureImgList.json", $("#featureInfoWrap").find("#hiddenForm"), function(json){

// if(json.result && json.imageVo){
// var schemaNm = json.imageVo.schemaNm;
// var tblId = json.imageVo.tblId;
// var refMgrNo = json.imageVo.refMgrNo;
//
// var $imageNm = $('<img class="img_a"
// alt="'+schemaNm+"."+tblId+"_"+refMgrNo+'"
// src="./image/getImage.do?schemaNm='+schemaNm+'&tblId='+tblId+'&refMgrNo='+refMgrNo+'&c='+Date.now()+'"
// style="width:40px;height:40px;margin-top:10px;" schemaNm = "'+schemaNm+'"
// tblId = "'+tblId+'" refMgrNo = "'+refMgrNo+'">');
// bindImageNmWithClickEvent($imageNm);
//
// var $th = $("#featureInfoWrap > div tbody th[id='featureImage']");
// $th.parent().find(".img_a").remove();
// $th.parent().find('td').prepend($imageNm);
// alert("업로드 되었습니다")
// }
					// error일경우도 고려를 해야함

	                if(json.imageVoList){

	                	var imageVoList = json.imageVoList;

	                	var $imageNm = $('<div>');

	                	for(var i=0; i<imageVoList.length; i++){

	                		var schemaNm = imageVoList[i].schemaNm;
	                		var tblId = imageVoList[i].tblId;
	                		var refMgrNo = imageVoList[i].refMgrNo;
	                		var imgSeq = imageVoList[i].imgSeq;
	                		var mgrSeq = imageVoList[i].mgrSeq;

	                		var $html_ = $('<img class="img_a" alt="'+schemaNm+"."+tblId+"_"+refMgrNo+"_"+imgSeq+'" src="./image/getImage.do?mgrSeq='+mgrSeq+'&c='+Date.now()+'" style="width:40px;height:40px;margin-top:10px;" schemaNm = "'+schemaNm+'" tblId = "'+tblId+'" refMgrNo = "'+refMgrNo+'" imgSeq = "'+imgSeq+'"  mgrSeq = "'+mgrSeq+'">');
	                		bindImageNmWithClickEvent($html_);
	                		$imageNm.append($html_);

	                	}

	                	var $th = $("#featureInfoWrap > div tbody th[id='featureImage']");
                		$th.parent().find(".img_a").remove();
                		$th.parent().find('td').prepend($imageNm);

	                	alert("업로드 되었습니다");

	                }

	                $("#uploadFeatureImg").val("");
	            }, false);

			});

			$form.append($schemaNm).append($tblId).append($refMgrNo).append($imgSeq).append($uploadFeatureImg);

			$td.append($imageNm).append($div).append($form);
			var $tr = $("<tr>").append($th).append($td);

			$tbody.append($tr);
		}
		/**
		 * 이미지 클릭했을 떄, dialog 표출
		 */
		var bindImageNmWithClickEvent = function($imageNm){

			$imageNm.click(function(){

				if($(this).text() == "이미지 없음"){
					return;
				}

				var schemaNm = $(this).attr('schemaNm');
				var tblId = $(this).attr('tblId');
				var refMgrNo = $(this).attr('refMgrNo');
				var mgrSeq = $(this).attr('mgrSeq');

				var _html ='';
				_html += '<div class="popupWrapper">'
				_html += '	<div id="docNoChngPop">'
				_html += '		<div id="bpop_wrap" class="table_style">'
				_html += '			<img class="imgs" alt="'+schemaNm+"."+tblId+"_"+refMgrNo+'" src="./image/getImage.do?mgrSeq='+mgrSeq+'&c='+Date.now()+'" style="width:100%;height:100%">'
// _html += ' <div style="text-align:center"><button class="btn_style2"
// id="imgDownload">다운로드</button></div>'
				_html += '		</div>'
				_html += '	</div>'
				_html += '</div>'

				$("#popupWrap").dialog("close").html(_html).dialog({
					title: '이미지',
					width: 500,
					height: 500,
					position: {
						my: "center center",
						at: "center center",
						of: $("#map")
					},
					modal: true,
					open: function(){


					},
					close: function(){

					}
				}).dialog("open");
			});
		}

		var createTfoot = function(layerId, featureProp, column){
			var $tbl = $("#featureInfoWrap").find("table");
			var $tfoot = $tbl.find("tfoot").html("");
			var $editBtn = $("<button>").attr({id: "editFeatureInfo", class: "btn_Gstyle"}).click(function(){
				$tbl.find(".featureInfoValue").prop("readonly", false).prop("disabled", false);
				$tbl.find("#editFeatureInfoSave").prop("readonly", false).prop("disabled", false);
				// $(this).prop("readonly", true).prop("disabled", true);
				$tbl.find("#imageUploadBtn").css("display","block");
				$tbl.find("#imageDeleteBtn").css("display","block");
			}).text("입력 활성화");

			var $saveBtn = $("<button>").attr({id: "editFeatureInfoSave", class: "btn_style"}).click(function(){
				var $this = $(this);

				var param = GMXMAP.convertColumnTypeData(column);

				var kv = {};
				$(".featureInfoValue").each(function(){
					kv[$(this).attr("id")] = $(this).val();
				});
				delete kv["geometry"];
				delete kv["_geometry"];
				delete kv["_annox"];
				delete kv["_annoy"];

				var resultData = GMXMAP.validData(column, kv);
				if(!resultData){
					return false;
				}else{
					for(var key in kv){
						kv[key] = resultData[key];
					}
				}

				var idx = 0;
				for(var key in kv){
					param["kv[" + idx + "][key]"] = key;
					param["kv[" + idx + "][val]"] = kv[key];
					idx++;
				}
				param["pk"] = kv["_gid"];
				param["st[s]"] = column[0].tblSchema;
				param["st[t]"] = column[0].tblId.replace(column[0].tblSchema + ".", "");

				// TODO 저장 쿼리 에러 발생
				if(confirm("데이터를 수정하시겠습니까?")){
					_common.callAjax("/GMT_column/editLayerValue.json", param, function(json){
						if(json.result){
							alert("수정 되었습니다.");

							$tbl.find(".featureInfoValue").prop("readonly", true).prop("disabled", true);
							$tbl.find("#editFeatureInfo").prop("readonly", true).prop("disabled", true);
							$this.prop("readonly", true).prop("disabled", true);
							$("#editFeatureInfo").prop("readonly", false).prop("disabled", false);

							/*
							 * GMXLAYER.loadData().loadLayer(GMXMAP);
							 * GMXLEGEND.createLegends().setVectorIndex();
							 */
							if("sketchLayerReload" in GMXMAP) GMXMAP.sketchLayerReload();

							var timeout = setTimeout(function(){
								GMXMAP.reloadLayerData(param["st[t]"]);

								clearTimeout(timeout);
								timeout = null;
							}, 500);
						}
					}, false);
				}
			}).text("저장").prop("readonly", true).prop("disabled", true);

			var $delBtn = $("<button>").attr({id: "delFeatureInfo", class: "btn_Gstyle"}).click(function(){
				var param = {};

				param["pk"] = $(".featureInfoValue#_gid").val();

				if(confirm("선택하신 객체를 삭제하시겠습니까?\n\n주의) 삭제시 복구가 불가능합니다.")){
					_common.callAjax("/GMT_column/delLayerValue.json", param, function(json){
						if(json.result){
							alert("삭제 되었습니다.");

							$("#featureInfoWrap").dialog("close");

							GMXLAYER.loadData().loadLayer(GMXMAP);
							GMXLEGEND.createLegends().setVectorIndex();
							if("sketchLayerReload" in GMXMAP) GMXMAP.sketchLayerReload();
						}
					}, false);
				}
			}).text("삭제");

			var $ftd1 = $("<td>").append($editBtn);
			var $ftd2 = $("<td>").append($saveBtn);// .append($delBtn);
			var $tr = $("<tr>").append($ftd1).append($ftd2);

			// var $box =
			// $("<div>").addClass('box').append($editBtn).append($saveBtn);//.append($delBtn);
			// var $ftd1 = $("<td>").attr("colspan", "2").append($box);
			// var $tr = $('<tr>').append($ftd1);


			if(location.pathname.endsWith("/gisEdit.do")){
				$tfoot.append($tr);
			}

		}

		/**
		 * 객체 정보 보기 엘리먼트를 생성합니다.
		 */
		var createFeatureInfo = function(layerId, featureProp, columnInfo){
			createTbody(layerId, featureProp, columnInfo);
			createTfoot(layerId, featureProp, columnInfo);
		}
		
		/**
		 * eocs 상세 창을 표출합니다.
		 */
		var createEocsInfo = function(featureProp){
			  _common.callAjax("/eocs/getEditView.do", {recNo: featureProp['rec_no']}, function (view) {
                  if (view) {
                      $("#featureInfoWrap").html(view);
                  }
			  });
		}

		/**
		 * 객체 정보 보기 Dialog 를 생성합니다.
		 */
		GMXMAP.createSingleFeatureInfoDialog = function(layer, feature){
			var geomType = feature.getGeometry().getType();
			var featureProp = feature.getProperties();
			var layerProp = layer.getProperties();

			var schema = layerProp.schema;
			var layerId = layerProp.id;
			if(_common.utils.isNullAndEmpty(schema) || _common.utils.isNullAndEmpty(layerId)){
				GMXMAP.addMapNotification("해당 객체는 속성 정보가 존재하지 않습니다.", 3000);
				return;
			}

			var columnInfo = GMXMAP.getColumnInfo(schema, layerId);

			if(geomType === "Point"){
				if("features" in featureProp){
					feature = featureProp.features[0];
					featureProp = feature.getProperties();
				}
			}

			var featureId = feature.getId();
			if(_common.utils.isNullAndEmpty(featureId)){
				alert("해당 객체는 서버에 저장되지 않은 임시 객체입니다.\n\n편집 중이라면 저장 후 다시 시도해 주세요.");
				return false;
			}

			var gid = featureId.substring(featureId.lastIndexOf(".") + 1);
			if("_gid" in featureProp == false) featureProp["_gid"] = Number(gid);
			
			if ( layerId === 'eocs_excavator' ) {
				createEocsInfo(featureProp);
			} else {
				createFeatureInfo(layerId, featureProp, columnInfo);
				
			}

			if(feature instanceof ol.Feature){
				if(!$("#featureInfoWrap").dialog("isOpen")){
					$("#featureInfoWrap").dialog({
						title : _common.utils.validNull(layerProp.name) + " 객체 정보",
						width: 500,
						height: $("#map").height(),
						position: {
							my: "right top",
							at: "right-1 top",
							of: $("#map")
						},
						open: function(){
							$("#featureInfoWrap").find("textarea").each(function(){
								$(this).height($(this)[0].scrollHeight);
							})
						},
						close: function(){
							$("#featureInfoWrap").find("tbody").html("");
						}
					}).dialog("open");
				}else{
					$("#featureInfoWrap").dialog({ title : _common.utils.validNull(layerProp.name) + " 객체 정보" });
				}
			}
		}

		/**
		 * 단일 객체 정보 보기 contextItem 을 생성합니다.
		 */
		var createSingleFeatureInfoContextItem = function(layer, features){
			if(layer != null && features != null){
				var layerProp = layer.getProperties();
				var item = {
					text: "<b>" + _common.utils.validNull(layerProp.name) + "</b> 단일 정보 보기",
					data: { "layer" : layer, "features" : features },
					callback: function(_item){
						GMXMAP.createSingleFeatureInfoDialog(_item.data.layer, _item.data.features);
					}
				}

				return item;
			}
		}

		/**
		 * 컨텍스트 객체 하이라이트 제거 이벤트 입니다.
		 */
		var removeHighLight = function(){
			if(("contextMenuVector" in GMXMAP)) GMXMAP["contextMenuVector"].getSource().clear();
		}

		/**
		 * 컨텍스트 객체 하이라이트 추가 이벤트 입니다.
		 */
		var addHighLight = function(features){
			var feature = null;
			if(features instanceof ol.Feature) feature = features.clone();
			if("features" in features.getProperties()){
				var inner = features.getProperties().features;
				var center = (features.getGeometry && features.getGeometry()) ? features.getGeometry().getCoordinates() : null;
				if(center){
					feature = new ol.Feature(new ol.geom.Point(center));
				}else if(inner && inner.length > 0){
					feature = inner[0].clone();
				}
			}

			if(("contextMenuVector" in GMXMAP)){
				removeHighLight();

				if(feature != null && (feature instanceof ol.Feature)){
					if(feature.getGeometry().getType() === "Point"){
						feature.setStyle(new ol.style.Style({
							image: new ol.style.Circle({
								stroke: new ol.style.Stroke({
									color : "red",
									width : 3,
									lineDash : [5]
								}),
								fill: new ol.style.Fill({
									color : "rgba(255, 0, 0, 0.1)"
								}),
								radius: 15
							}),
							zIndex: -1
						}));
					}else{
						feature.setStyle(new ol.style.Style({
							stroke: new ol.style.Stroke({
								color : "red",
								width : 3,
								lineDash : [5]
							}),
							fill: new ol.style.Fill({
								color : "rgba(255, 0, 0, 0.1)"
							}),
							zIndex: -1
						}));
					}

					GMXMAP["contextMenuVector"].getSource().addFeature(feature);
				}
			}
		};

		/**
		 * 컨텍스트 메뉴 객체를 생성합니다.
		 * 
		 * eventType 은 세가지 타입을 지원합니다. 1. click - 마우스 좌클릭 2. dblclick - 마우스 좌
		 * 더블클릭 3. delete contextParam["eventType"] - 우클릭
		 */
		var contextParam = { width : 300, items : [], defaultItems : false, eventType : "click" };
		if(("localStorage" in window)){
			var eventType = localStorage["SystemSetting@featureSelectType"];
			if(_common.utils.isNullAndEmpty(eventType)){
				delete contextParam["eventType"];
			}else{
				contextParam["eventType"] = eventType;
			}
		}

		GMXMAP["contextMenu"] = new ContextMenu(contextParam);

		/**
		 * 객체 선택시 하이라이트 처리하는 Vector 입니다.
		 */
		if(!("contextMenuVector" in GMXMAP)){
			GMXMAP["contextMenuVector"] = new ol.layer.Vector({
				id : "contextMenuVector",
				zIndex : 999,
				visible : true,
				source : new ol.source.Vector()
			});
			GMXMAP.addLayer(GMXMAP["contextMenuVector"]);
		}

		/**
		 * 통합 검색시 공간분석 대상을 지정하기 위한 Vector 입니다.
		 */
		if(!("contextMenuSpatialVector" in GMXMAP)){
			GMXMAP["contextMenuSpatialVector"] = new ol.layer.Vector({
				id : "contextMenuSpatialVector",
				zIndex : 999,
				visible : true,
				source : new ol.source.Vector()
			});
			GMXMAP.addLayer(GMXMAP["contextMenuSpatialVector"]);
		}

		/**
		 * ContextMenu 생성 전 이벤트 입니다.
		 * 
		 * 선택된 위치에 Layer, Feature 가 모두 존재할 경우만 오픈합니다. hr 구분자는
		 * GMXMAP["contextMenu"].push("-"); 호출을 통하여 생성할 수 있으며,
		 * 
		 * CCTV 등과 같이 예외적인 ContextItem 을 생성해야 할 경우 직접 구현 후 호출해야 합니다.
		 */
				GMXMAP["contextMenu"].on("beforeopen", function (evt) {
		    // AIDORO 레이어인 경우 모든 컨텍스트 메뉴 차단
		    var layer = null;
		    var layerId = null;
		    var validLayerIds = ["v_event_pothole", "v_event_crack"];
		    // 이미지 url 변경 - 250410 현동아
		    var eventUrl = '/xeus/api/getImage.do?id=';

		    var features = GMXMAP.forEachFeatureAtPixel(evt.pixel, function (ft, l) {
		        if (l != null) {
		            var lid = l.get("id");
		            if (lid === "contextMenuVector" || lid === "contextMenuSpatialVector") return;
		            if (l.get("name") === "net_line" || l.get("name") === "net_point") return;

		            layer = l;
		            layerId = lid;
		            return ft;
		        }
		    });
		    
		    if ($(".ol-ctx-menu-container").length > 0) $(".ol-ctx-menu-container").hide();

		    GMXMAP["contextMenu"].clear();
	
		    if (GMXMAP["isMoving"]) layer = features = null;

		    if (layer && features) {
		    	var layerProp = layer.getProperties();
		    	if (window.AIDORO && (layerProp["id"] === "v_mon_evet_list" || layerProp["id"] === "v_mon_evet_fall"  || layerProp["id"] === "v_mon_evet_blackice") && features.values_) {
		    		
		    		// 블랙아이스(006), 수막현상(007)인 경우 아무것도 띄우지 않음
		    		var evtTypCd = features.values_.evt_typ_cd;
		    		if (evtTypCd === "006" || evtTypCd === "007") return false;

		    		// OL 컨텍스트 메뉴 및 브라우저 기본 컨텍스트 메뉴 완전 차단
		    		if (GMXMAP["contextMenu"]) {
		    			GMXMAP["contextMenu"].clear();
		    			GMXMAP["contextMenu"].close();
		    			GMXMAP["contextMenu"].disable();
		    		}
		    		$(".ol-ctx-menu-container").hide();
		    		$("#map").off("contextmenu.aidoro").on("contextmenu.aidoro", function(e){
		    			e.preventDefault();
		    			e.stopPropagation();
		    			return false;
		    		});
		    		
		    	    var $active = $(".startMenu.active").first();
		    	    var $dialog = ($active.length && $active.attr("id") !== "btn-monitor-view")? $("#histDetailPopup") : $("#detailPopup");
					var convertKeyParam = {
							"etcCntn" : JSON.parse(features.values_.evt_json),
							"statEvetOutbDtm" : features.values_.evt_outb_dtm,
							"outbPos" : [{x : features.values_.outb_posx , y : features.values_.outb_posy}],
							"statEvetNm" :features.values_.evt_nm,
							"uSvcOutbId" : features.values_.usvc_outb_id
							 };
			    	
					$dialog.dialog({
						title: "상세 이벤트",
						width: 450,
						open: function(){
							$dialog.dialog({position:{
								my: "right top",
								at: "right-60 top+56",
								of: $("#map")
							}});
						},close : function(){
							removeHighLight();
						},
					});
					
					addHighLight(features)
	
					if($dialog.attr("id") === "detailPopup"){
						AIPOPUP.updateDetailPopup(convertKeyParam);
					} else{
						updatehistDetailPopup(convertKeyParam);
					}
					$(".ol-ctx-menu-container").hide();
					return false;
		    	}
		    	
		        if ($(".ol-ctx-menu-container").length > 0) $(".ol-ctx-menu-container").show();
			    
		        if (validLayerIds.includes(layerId)) {
		            GMXMAP["contextMenu"].push({
		                text: "최신 이벤트 정보 보기",
		                callback: function () {
		                    var clusterFeatures = [];
		                    var innerFeatures = features.get("features");
		                    
		                    if (Array.isArray(innerFeatures) && innerFeatures.length > 0) {
		                        for (var i = 0; i < innerFeatures.length; i++) {
		                            var f = innerFeatures[i];
		                            if (f && typeof f.getProperties === "function") {
		                                var props = f.getProperties();
		                                props.tbl_id = layerId;
		                                clusterFeatures.push(props);
		                            }
		                        }
		                    } else {
		                        var props = features.getProperties();
		                        props.tbl_id = layerId;
		                        clusterFeatures = [props];
		                    }

		                    GMXMAP.getLayers().forEach(function (lyr) {
		                        if (validLayerIds.includes(lyr.get("id"))) {
		                            lyr.getSource().getFeatures().forEach(function (f) {
		                                if (f.get("selected")) {
		                                    f.set("selected", false);
		                                    f.changed();
		                                }
		                            });
		                        }
		                    });

		                    features.set("selected", true);
		                    features.changed();

		                    var featureCount = clusterFeatures.length;

		                    _common.callAjax("/pothole/getEvtListView.do", {}, function (view) {
		                        if (view) {
		                            $("#eventDialogWrap").html(view);
		                            $("#eventDialogWrap").dialog("destroy");

		                            $("#eventDialogWrap")
		                                .data("featureCount", featureCount)
		                                .dialog({
		                                    modal: true,
		                                    width: 900,
		                                    height: 460,
		                                    position: {
		                                        my: "center center",
		                                        at: "center center",
		                                        of: $("#map")
		                                    },
		                                    title: "최신 이벤트 정보",
		                                    open: function () {
		                                        var count = $(this).data("featureCount");
		                                        $("#evtPotCount").text(count + " 건");
		                                    },
		                                    close: function () {
		                                        GMXMAP.getLayers().forEach(function (lyr) {
		                                            if (validLayerIds.includes(lyr.get("id"))) {
		                                                lyr.getSource().getFeatures().forEach(function (f) {
		                                                    if (f.get("selected")) {
		                                                        f.set("selected", false);
		                                                        f.changed();
		                                                    }
		                                                });
		                                            }
		                                        });
		                                    }
		                                });
		                        }
		                        renderEventList(clusterFeatures);
		                    });
		                }
		            });
		            
		            function getEventType(item) {
		        	    if (item.tbl_id === 'v_event_pothole' || item.event_type === 'pothole') return '포트홀';
		        	    if (item.tbl_id === 'v_event_crack' || item.event_type === 'crack') return '크랙';
		        	    return '-';
		        	}

		        	// ✅ 날짜 포맷 정리
		        	function formatDate(rawTime) {
		        	    if (!rawTime || rawTime === '-') return '-';
		        	    var d = new Date(rawTime);

		        	    var yyyy = d.getFullYear();
		        	    var mm = String(d.getMonth() + 1).padStart(2, '0');
		        	    var dd = String(d.getDate()).padStart(2, '0');
		        	    var hh = String(d.getHours()).padStart(2, '0');
		        	    var mi = String(d.getMinutes()).padStart(2, '0');
		        	    var ss = String(d.getSeconds()).padStart(2, '0');

		        	    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':' + ss;
		        	}

		        	function renderEventList(features) {
		        	    var $list = $('#eventListContent');
		        	    $list.empty();

		        	    var sortedFeatures = features.slice().sort(function(a, b) {
		        	        return new Date(b.event_time) - new Date(a.event_time);
		        	    });

		        	    var $latestCard = null;
		        	    var allCnt = 0;
		        	    $.each(sortedFeatures, function(index, item) {
		        	        var type = getEventType(item);
		        	        var time = formatDate(item.event_time);
		        	        var location = item.camera_location || '-';
		        	        var id = item.event_id || '';

		        	        var $card = $(`
		        	            <div class="event-card">
		        	                <div class="event-type">${type}</div>
		        	                <div class="event-meta">
		        	                    <div class="event-time">${time}</div>
		        	                </div>
		        	                <button class="btn_t event-detail-btn" data-event-id="${id}">자세히</button>
		        	            </div>
		        	        `);
		        	        	
		        	        if (index === 0) {
		        	            $latestCard = $card;
		        	        }
		        	        allCnt++;
		        	        $card.find('.event-detail-btn').on('click', function () {
		        	            $('.event-card').removeClass('detail-highlight');
		        	            $card.addClass('detail-highlight');
		        	            loadEventDetail(item);
		        	        });

		        	        $list.append($card);
		        	    });

		        	    if (sortedFeatures.length > 0) {
		        	    	$latestCard.addClass('detail-highlight');
		        	        loadEventDetail(sortedFeatures[0]);
		        	    }
		        	}

		        	function loadEventDetail(item) {
		        	    var type = getEventType(item);
		        	    var time = formatDate(item.event_time);
		        	    var location = item.camera_location || '-';
		        	    var lon = item.longitude;
		        	    var lat = item.latitude;
		        	    var coordText = (lon && lat) ? lon.toFixed(6) + ' \n ' + lat.toFixed(6) : '-';
		        	    var camType = item.camera_type || '-';
		        	    var evtSubDetail = type + " / " + camType;

		        	    var imageUrl = item.file_id
		        	        ? eventUrl + item.file_id + '&kind=box'
		        	        : 'no-image.png';

		        	    $("#evtSubDetail").text(evtSubDetail);
		        	    $('#detailType').text(type);
		        	    $('#detailTime').text(time);
		        	    $('#detailLoc').text(location);
		        	    $('#detailLonLat').text(coordText);
		        	    $('#detailImage').attr('src', imageUrl);
		        	    $('#detailImage').data('full', imageUrl);
		        	    $('#detailCamType').text(camType);
		        	}
		        } else {
		        	
		            if (typeof createSingleFeatureInfoContextItem === "function") {
		            	
		   
		                GMXMAP["contextMenu"].push(createSingleFeatureInfoContextItem(layer, features));
		            }
		            
		           
		            if ("selectClusterContextItem" in GMXMAP) {
		                GMXMAP["contextMenu"].push("-");
		                GMXMAP["contextMenu"].push(GMXMAP.selectClusterContextItem(evt));
		            }
		            
		            if (window.GMXCCTV && layerProp["id"] === "asset_cctv") {
		                GMXMAP["contextMenu"].push("-");
		                var itemList = GMXCCTV.createContextMenu(layer, features, evt);
		                itemList.slice(0, 10).forEach(item => GMXMAP["contextMenu"].push(item));
		                var innerList = features.get("features");
		                if (Array.isArray(innerList) && innerList.length > 10) {
		                    GMXMAP["contextMenu"].push({
		                        text: "<b>총 " + features.get("features").length + "대 중 10대만 표시</b>",
		                        classname: "cctv_selected_count"
		                    });
		                }
		                if (location.pathname.includes("tvius.do") && $(".usrTviusRqst:visible").length > 0) {
		                    GMXMAP["contextMenu"].push("-");
		                    GMXMAP["contextMenu"].push(GMXMAP.moveAllCctvContextItem(itemList));
		                }
		                GMXCCTV.setContextHoverEvent();
		            }

		            if (window.GMXINFRA && layerProp["id"] === "v_asset_infra") {
		                GMXMAP["contextMenu"].push("-");
		                GMXINFRA.createContextMenu(layer, features, evt).forEach(item => GMXMAP["contextMenu"].push(item));
		            }

		            if (window.GMXBIGDATA && layerProp["id"] === "asset_cctv_install") {
		                GMXMAP["contextMenu"].push("-");
		                GMXBIGDATA.createContextMenu(layer, features, evt).forEach(item => GMXMAP["contextMenu"].push(item));
		            }
		        }

		        GMXMAP["contextMenu"].enable();
		        if(!validLayerIds.includes(layerId)) addHighLight(features);
		    } else {
		    	if(!validLayerIds.includes(layerId)) removeHighLight();
		        GMXMAP["contextMenu"].close();
		        GMXMAP["contextMenu"].disable();
		    }

		    $(".ol-ctx-menu-container").eq(0).css({ "left": (evt.pixel[0]), "top": (evt.pixel[1] + 100) });
		});

		/**
		 * ContextMenu Open 이벤트 입니다.
		 * 
		 * 위치를 강제로 하드코딩하여 조절 할 경우 하단 주석을 해제하여 조절할 수 있습니다.
		 */
		GMXMAP["contextMenu"].on("open", function(evt){
			// GMXMAP["contextMenu"].updatePosition([(evt.pixel[0] + 50),
			// (evt.pixel[1] + 100)]);

			/*
			 * $(".ol-ctx-menu-container").eq(0).animate({ "left" :
			 * (evt.pixel[0] + 70), "top" : (evt.pixel[1] + 100) }, { duration :
			 * 400, queue : false });
			 */
		});

		/**
		 * ContextMenu Close 이벤트 입니다.
		 * 
		 * 하이라이트 객체를 제거합니다.
		 */
		GMXMAP["contextMenu"].on("close", function(evt){
			removeHighLight();
		});

		GMXMAP.addControl(GMXMAP["contextMenu"]);

		// Body 부분으로 엘리먼트를 옮기지 않을 경우 OL Map 엘리먼트 내부에 생성됩니다.
		$("body").append($(".ol-ctx-menu-container").eq(0));

		/**
		 * 지도가 아닌 외부 엘리먼트 클릭시 컨텍스트 메뉴를 닫습니다.
		 */
		$(document).click(function(evt){
			var tag = null;
			if(evt.target) tag = evt.target;
			if((tag != null) && (tag.parentElement != null)){
				if(tag.tagName === "CANVAS"){
					var parentTag = tag.parentElement;
					if(parentTag.getAttribute("class") != "ol-layer"){
						if(GMXMAP["contextMenu"].isOpen()) GMXMAP["contextMenu"].close();
					}
				}else if(tag.getAttribute("class") != "ol-layer"){
					if(GMXMAP["contextMenu"].isOpen()) GMXMAP["contextMenu"].close();
				}
			}else{
				if(GMXMAP["contextMenu"].isOpen()) GMXMAP["contextMenu"].close();
			}
		});
	}
}

})(GMXMAP, GMXLAYER, GMXLEGEND, window.GMXCCTV, window.GMXINFRA);