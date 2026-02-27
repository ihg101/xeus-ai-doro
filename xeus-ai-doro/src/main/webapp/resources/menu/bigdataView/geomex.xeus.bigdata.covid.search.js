(function(){

	//$(".contentWrapper").find("#instDate").val(new Date().getYMD());

	var removeList = new Array();
	var mapLayers = GMXMAP.getLayers().getArray();
	for(var i=0; i<mapLayers.length; i++){
		if(mapLayers[i].get("fnGroup") == "TEMP"){
			mapLayers[i].getSource().clear();
			removeList.push(mapLayers[i]);
		}
	}
	for(var i=0; i<removeList.length; i++){
		GMXMAP.removeLayer(removeList[i]);
	}
	removeList = null;
	mapLayers = null;
	//TODO xeuslayout
	if(!xeusLayout.mapService.getLayerById("asset_cctv")){
		xeusLayout.mapService.addLayer(xeusLayout.mapService.createVectorLayer(Layers["asset_cctv"]));
		Layers["asset_cctv"].themeLoad();
		xeusCCTV.initCCTV(xeusLayout.ctxPath);

		var center = xeusLayout.mapService.getMap().getView().getCenter();
		xeusLayout.mapService.getMap().getView().setCenter([center[0], center[1] + 0.0000000001]);
	}

	var timeout = setTimeout(function(){
		$(".contentWrapper").find(".mCSB_container").height("100%");
		clearTimeout(timeout);
		timeout = null;
	}, 700);

	GMXMAP.on("click", function(event){
		/*var map = GMXMAP;
		var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
			var properties = feature.getProperties();
			if("typename" in properties){
				if(properties["typename"] == "asset_covid"){
					return feature;
				}
			}else{
				return false;
			}
		});

		if(feature){
			_search.moveLocation(feature.getGeometry().getCoordinates(), "");
			_common.callAjax("/bigData/getCctvInstallItem.json", { mgrSeq : feature.getProperties()["mgrSeq"] }, function(json){

				if($(".tabTitle").find(".tab[active=active]").attr("url").contains("SearchView")){

					var instYmd = json.result.instYear;
					if(json.result.instMon){
						if(Number(json.result.instMon) < 10){
							instYmd += "-0" + Number(json.result.instMon);
						}else{
							instYmd += "-" + Number(json.result.instMon);
						}
					}
					if(json.result.instDay){
						if(Number(json.result.instDay) < 10){
							instYmd += "-0" + Number(json.result.instDay);
						}else{
							instYmd += "-" + Number(json.result.instDay);
						}
					}

					$(".contentWrapper").find("#detailTable").find("#detailMgrSeq").text(json.result.mgrSeq);
					$(".contentWrapper").find("#detailTable").find("#detailUserNm").text(json.result.userNm);
					$(".contentWrapper").find("#detailTable").find("#detailUserTell").text(json.result.userTell);
					$(".contentWrapper").find("#detailTable").find("#detailRegReqOne").text(json.result.regReqOne);
					$(".contentWrapper").find("#detailTable").find("#detailRegReqTwo").text(json.result.regReqTwo);
					$(".contentWrapper").find("#detailTable").find("#detailInstYmd").text(instYmd);
					var jibun = json.result.bjd;
					if(!_common.utils.isNullAndEmpty(json.result.san)){
						jibun += " " + _common.utils.validNull(json.result.san);
					}
					jibun += " " + _common.utils.validNull(json.result.jibun);
					$(".contentWrapper").find("#detailTable").find("#detailJibun").text(jibun);
					$(".contentWrapper").find("#detailTable").find("textarea").val(json.result.regReq);

				}else if($(".tabTitle").find(".tab[active=active]").attr("url").contains("AddView")){

					_common.callAjax("/bigData/getAddView.do", { mgrSeq : feature.getProperties()["mgrSeq"] }, function(view) {
						$(".contentWrapper").find("#overlay-west-contents").html(view);
						xeusLayout.WEST = CCTV_BTN_BIGDATA_INSTALL_EAST_SIZE;
						xeusLayout.showOverlayWestPane(ANI_DELAY, function() {
						});
					});
				}
			});
		}*/
	});

	function callView(offset, limit){
		var _param = _common.utils.collectSendData(".contentWrapper #searchTable");

		if(!limit) limit = 5;
		if(!offset) offset = 0;

		_param["limit"] = limit;
		_param["offset"] = offset;
		//_param["sortCol"] = "user_nm";
		//_param["sortTyp"] = "asc";

		/*var instDate = _param["instDate"];
		if(!_common.utils.isNullAndEmpty(instDate)){
			_param["instYear"] = instDate.substring(0, 4);
			_param["instMon"] = instDate.substring(4, 6);
			_param["instDay"] = instDate.substring(6);
			delete _param["instDate"];
		}*/

		_common.callAjax("/bigData/getCctvInstallList.json", _param, function(json){
			$(".contentWrapper").find("#max").val(json.count);
			$(".contentWrapper").find("#offset").val(offset);

			if(xeusLayout.mapService.getLayerById("asset_covid")){
				xeusLayout.mapService.getLayerById("asset_covid").getSource().clear();
				var _geoJSON = new ol.format.GeoJSON();
				var _features = _geoJSON.readFeatures(json.wfs);
				/*for(var i=0; i<_features.length; i++){
						var feature = _features[i];

						feature.setStyle(new ol.style.Style({
							image: new ol.style.Circle({
								radius: 5,
								fill: new ol.style.Fill({
									color: 'rgba(0, 0, 255, 0.1)'
								}),
								stroke: new ol.style.Stroke({
									color: "blue",
									width: 3
								})
							})
						}));
					}*/
				xeusLayout.mapService.getLayerById("asset_covid").getSource().addFeatures(_features);
			}

			var length = json.result.length;
			if(length == 0){
				var $tr = $("<tr><td colspan='7' class='tCenter'>결과가 존재하지 않습니다.</td></tr>");
				$(".contentWrapper").find("#resultTable").find("tbody").html($tr);
				$(".contentWrapper").find("#cntTxt").text("검색결과 (총 : " + json.count + "건)");
			}else{
				$(".contentWrapper").find("#cntTxt").text("검색결과 (총 : " + json.count + "건)");
				$(".contentWrapper").find("#resultTable").find("tbody").html("");
				for(var i=0; i<length; i++){
					/*var instDate = json.result[i].instYear;
					if(Number(json.result[i].instMon) < 10){
						instDate += "-0" + json.result[i].instMon;
					}else{
						instDate += "-" + json.result[i].instMon
					}
					if(Number(json.result[i].instDay) < 10){
						instDate += "-0" + json.result[i].instDay;
					}else{
						instDate += "-" + json.result[i].instDay;
					}*/

					var $tr = $("<tr class='tCenter pointer' k='" + json.result[i].mgrSeq + "'></tr>");
						$tr.append("<td>" + (Number(offset)+i+1) + "</td>");
						$tr.append("<td>" + _common.utils.validNull(json.result[i].emd) + "</td>");
						$tr.append("<td>" + _common.utils.validNull(json.result[i].bjd) + "</td>");
						$tr.append("<td>" + _common.utils.validNull(json.result[i].san) + "</td>");
						$tr.append("<td>" + _common.utils.validNull(json.result[i].jibun) + "</td>");
						$tr.append("<td>" + _common.utils.validNull(json.result[i].instYn) + "</td>");
						$tr.append("<td><button class='editBtn'></button></td>");

					var prop = {};
					for(var key in json.result[i]){
						prop[key] = json.result[i][key];
					}
					prop["point"] = Spatial.convertProjection([Number(json.result[i].lon), Number(json.result[i].lat)], "EPSG:4326", "EPSG:5186")
					$tr.data(prop);
					$tr.hover(function(){
						$(this).css("font-weight", "bold");
					}, function(){
						$(this).css("font-weight", "normal");
					});

					$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
				}

				/* 위치 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find("tbody").find("tr").click(function(){
					$(".contentWrapper").find("#resultTable").find("tbody").find("tr").find("td").css("background", "white");
					$(this).find("td").css("background", "#F3F3F3");

					var prop = $(this).data();
					GMXMAP.moveToAnimation(0, prop.point);
					_search.moveLocation(prop.point, "");

					var instYmd = prop.instYear;
					if(prop.instMon){
						if(Number(prop.instMon) < 10){
							instYmd += "-0" + Number(prop.instMon);
						}else{
							instYmd += "-" + Number(prop.instMon);
						}
					}
					if(prop.instDay){
						if(Number(prop.instDay) < 10){
							instYmd += "-0" + Number(prop.instDay);
						}else{
							instYmd += "-" + Number(prop.instDay);
						}
					}

					$(".contentWrapper").find("#detailTable").find("#detailMgrSeq").text(prop.mgrSeq);
					$(".contentWrapper").find("#detailTable").find("#detailUserNm").text(prop.userNm);
					$(".contentWrapper").find("#detailTable").find("#detailUserTell").text(prop.userTell);
					$(".contentWrapper").find("#detailTable").find("#detailRegReqOne").text(prop.regReqOne);
					$(".contentWrapper").find("#detailTable").find("#detailRegReqTwo").text(prop.regReqTwo);
					$(".contentWrapper").find("#detailTable").find("#detailInstYmd").text(instYmd);
					var jibun = prop.bjd;
					if(!_common.utils.isNullAndEmpty(prop.san)){
						jibun += " " + _common.utils.validNull(prop.san);
					}
					jibun += " " + _common.utils.validNull(prop.jibun);
					$(".contentWrapper").find("#detailTable").find("#detailJibun").text(jibun);
					$(".contentWrapper").find("#detailTable").find("textarea").val(prop.regReq);
					//Public.BIGDATA.Search.Start(prop.point);
				});

				/* 관리 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find(".editBtn").click(function(){
					var v = $(this).parent().parent().attr("k");
					_common.callAjax("/bigData/getAddView.do", { mgrSeq : v }, function(view) {
						$(".contentWrapper").find("#overlay-west-contents").html(view);
						xeusLayout.WEST = CCTV_BTN_BIGDATA_INSTALL_EAST_SIZE;
						xeusLayout.showOverlayWestPane(ANI_DELAY, function() {
						});
					});
				});
			}

			$(".contentWrapper").find(".paging_wrap").paging({
				current	  : 5,
				max  	  : Number($("#max").val()),
				nowOffset : Number($("#offset").val()),
				bindEvent : callView
			});

			if(cctvInstallMgrSeq){
				$(".contentWrapper").find("#resultTable").find("tbody").find("tr[k=" + cctvInstallMgrSeq + "]").click();
			}
		});
	}

	/**
	 * 속성 검색 이벤트 입니다.
	 */
	$(".contentWrapper").find("#searchBtn").click(function(){
		var offset = $(".contentWrapper").find("#offset").val();
		offset = 0;
		callView(offset, 5);
	}).click();
	$(".contentWrapper").find("#userNm, #userTell, #regReq, #jibun, #regReq").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#searchBtn").click();
		}
	});

	/**
	 * 수정 이동 이벤트 입니다.
	 */
	$(".contentWrapper").find("#editBtn").click(function(){
		var mgrSeq = $(".contentWrapper").find("#detailTable").find("#detailMgrSeq").text();
		_common.callAjax("/bigData/getAddView.do", { mgrSeq : mgrSeq }, function(view) {
			$(".contentWrapper").find("#overlay-west-contents").html(view);
			xeusLayout.WEST = CCTV_BTN_BIGDATA_INSTALL_EAST_SIZE;
			xeusLayout.showOverlayWestPane(ANI_DELAY, function() {
			});
		});
	});

	/* DatePicker 생성 이벤트입니다. */
	$(".contentWrapper").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
        changeYear: true,
        dateFormat: "yymmdd",
        showButtonPanel: true,
        beforeShowDay: $.datepicker.noBefore
	});

	/* 파일다운로드 버튼 이벤트 */
	$(".contentWrapper").find("#downBtn").click(function(){
		var param = _common.utils.collectSendData(".contentWrapper #searchTable");

		var limit = $(".contentWrapper").find("#max").val();
		var offset = $(".contentWrapper").find("#offset").val();

		if(!limit) limit = 10;
		if(!offset) offset = 0;

		param["limit"] = limit;
		param["offset"] = offset;

		confirm("검색결과를 엑셀로 다운로드 하시겠습니까?", function(){
			_common.postForm.submit("/bigData/getCctvInstallExcel.do", param);
		});
	});

	var isAdvancedUpload = function(){
		var div = document.createElement( 'div' );
		return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
	}();

	var $form = $(".contentWrapper").find("#uploadForm");

	var droppedFiles = false;
	if(isAdvancedUpload){
		$form.addClass('has-advanced-upload');

		droppedFiles = false;

		$form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
		}).on('dragover dragenter', function() {
			$form.addClass('is-dragover');
		}).on('dragleave dragend drop', function() {
			$form.removeClass('is-dragover');
		}).on('drop', function(e) {
			droppedFiles = e.originalEvent.dataTransfer.files;
			$(".contentWrapper").find("label[for=file]").hide();
			$(".contentWrapper").find("label[for=file]#uploadTxt").find("strong").text(droppedFiles[0].name);
			$(".contentWrapper").find("label[for=file]#uploadTxt").show();
		});
	}

	/* 파일 테그 변경 감지 */
	$(".contentWrapper").find("input[type=file]#file").change(function(){
		droppedFiles = $(".contentWrapper").find("input[type=file]#file")[0].files;
		$(".contentWrapper").find("label[for=file]").hide();
		$(".contentWrapper").find("label[for=file]#uploadTxt").find("strong").text(droppedFiles[0].name);
		$(".contentWrapper").find("label[for=file]#uploadTxt").show();
	});

	/* 파일업로드 버튼 이벤트 */
	$(".contentWrapper").find("#upBtn").click(function(){
		$(".contentWrapper").find("#uploadWrap").toggle("clip");
	});

	/* 파일업로드 버튼 이벤트 */
	$(".contentWrapper").find("#uploadWrap img.close").click(function(){
		$(".contentWrapper").find("#uploadWrap").toggle("clip");
	});

	/* 파일업로드 */
	$(".contentWrapper").find("#sendFile").click(function(){
		if(droppedFiles && droppedFiles.length > 0){
			confirm(droppedFiles[0].name + " 파일을 업로드하시겠습니까?<br><br>참고) 업로드시, 파일 분석시간이 소요됩니다.", function(){

				var $input = $(".contentWrapper").find("input[type=file]#file");
				if(droppedFiles.length > 0){
					var param = new FormData();
					$.each(droppedFiles, function( i, file ){
						param.append( $input.attr( 'name' ), file );
					});

					$.ajax({
						url: 			$form.attr( 'action' ),
						type:			$form.attr( 'method' ),
						data: 			param,
						dataType:		'json',
						async:			false,
						cache:			false,
						contentType:	false,
						processData:	false,
						success: function(json){
							if("error" in json){
								alert(json.error);
								return false;
							}
							if(json.result){
								$(".contentWrapper").find('#uploadWrap').find(".close").click();
								$(".contentWrapper").find("#searchBtn").click();
								alert("업로드가 완료되었습니다.");

								GMXMAP.getView().fit(Public.BIGDATA.Covid.vector.getSource().getExtent());
								var center = xeusLayout.mapService.getMap().getView().getCenter();
								xeusLayout.mapService.getMap().getView().setCenter([center[0], center[1] + 0.0000000001]);
							}
						},
						error: function(){
							alert("파일업로드를 실패하였습니다.");
						}
					});
				}

			});
		}
	});

})();