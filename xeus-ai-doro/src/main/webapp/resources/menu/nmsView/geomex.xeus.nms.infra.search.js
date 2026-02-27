/**
 * 장비관리(NMS) 메뉴의 장비 관리 메뉴 이벤트 입니다.
 * CCTV, 스위치와 같이 특별하게 관리 View가 필요 할 경우 이용합니다.
 */
(function(){

	/* 명칭 엔터키 이벤트 입니다. */
	$(".contentWrapper").find("#objName").keyup(function(e){
        if(e.which == 13){
            $(".contentWrapper").find("#searchBtn").click();
        }
    });

	/* CCTV 신규 추가 이벤트 입니다. */
	$(".contentWrapper").find("#cctvAddBtn").click(function(){
		_common.callAjax("/cctv/getNewregCctvView.do", {}, function(view){
			if($("#newregCctvWrap").length === 0){
				var $newregCctvWrap = $("<div>").attr("title", "CCTV 신규 등록").attr("id", "newregCctvWrap").addClass("table_style");

				$newregCctvWrap.html($("<div>").addClass("customScroll").html(view)).dialog({
					width: 650,
					height: $("#body").height(),
					position: {
						my: "left top",
						at: "left top",
						of: $("#body")
					},
					open: function(){

					},
					close: function(){
						$newregCctvWrap.dialog("destroy");
					}
				}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
			}
		}, false);
	});

	/**
	 * 엑셀로 관리하기 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").on("click", "#excelManagementBtn", function(){
	    var $button = $(this);
	    var buttonOffset = $button.offset();

	    var dialogPositionLeft = $("#contentWrap").parent().width();
	    var dialogPositionTop = buttonOffset.top - $("#header").height();

	    var $contentWrap = $("#contentWrap").width();
	    if($("#managementExcelWrap").length === 0){
	        var $managementExcelWrap = $("<div>").attr("title", "엑셀로 관리하기").attr("id", "managementExcelWrap");

	        _common.callAjax("/nms/getManagementExcelView.do", {}, function(view){
	        	$managementExcelWrap.html($("<div>").html(view)).dialog({
	                width: 150,
	                height: 130,
	                position: {
	                    my: "left+" + dialogPositionLeft + " top+" + dialogPositionTop,
	                    at: "left top",
	                    of: $("#body"),
	                    collision: "flipfit"
	                },
	                open: function(){

	                },
	                close: function(){
	                	$managementExcelWrap.dialog("destroy");
	                }
	            }).dialog("open").parent().draggable({ containment: "#body"});
	        }, false);
	    }
	});




	/* 산업용 스위치 신규 추가 이벤트 입니다. */
	$(".contentWrapper").find("#swcAddBtn").click(function(){
		_common.callAjax("/nms/getInfraAddView.do", {}, function(view){
			if($("#newregInfraWrap").length === 0){
				var $newregInfraWrap = $("<div>").attr("title", "산업용 스위치 신규 등록").attr("id", "newregInfraWrap").addClass("table_style");

				$newregInfraWrap.html($("<div>").addClass("customScroll").html(view)).dialog({
					width: 650,
					height: $("#body").height(),
					position: {
						my: "left top",
						at: "left top",
						of: $("#body")
					},
					open: function(){

					},
					close: function(){
						$newregInfraWrap.dialog("destroy");
					}
				}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
			}
		}, false);
	});

	/* 검색 버튼 이벤트 입니다. */
	$(".contentWrapper").find("#searchBtn").click(function(){
		var _param = _common.utils.collectSendData(".contentWrapper #searchTable");

		_common.callAjax("/nms/getFacilitySearch.json", _param, function(json) {
			$(".contentWrapper").find("#resultList").find("tbody").html("");

			for(var key in json){
				var list = json[key];
				if(list.length > 0){
					var length = list.length;
					$("#cntTitle").text("검색 결과 (총 " + length + "건)");
					for(var i=0; i<length; i++){

						var mgrNo = list[i].mgrNo;
						var name = list[i].facilityNm;
						var clscd = list[i].facilityClscd;
						var prop = {};
						if(key == "cctvList"){
							name = list[i].cctvNm;
							clscd = "CCTV";
							prop = {
								gid : list[i].gid,
								mgrNo : list[i].mgrNo,
								gbnCd : list[i].gbnCd,
								angle : list[i].viewDir,
								cctvNm : list[i].cctvNm,
								channelNo : list[i].chnlNo,
								deviceId : list[i].deviceId,
								stateCd : list[i].stateCd,
								point : Spatial.convertProjection([list[i].lng, list[i].lat], "EPSG:4326", "EPSG:5186")
							};
						}else{
							prop = list[i];
						};
						var $tr = $("<tr class='tCenter search_result' k='" + mgrNo + "'></tr>");
						$tr.append("<td>" + _common.utils.validNull(clscd) + "</td>");
						$tr.append("<td class='sText' title='" + name + "'>" + name + "</td>");
						$tr.append("<td><button class='locBtn btn_t'>위치</button></td>");
						$tr.data(prop);
						$(".contentWrapper").find("#resultList").find("tbody").append($tr);

					}
				}
			}

			/* 상세 버튼 이벤트 입니다. */
			$(".contentWrapper").find("#resultList").find(".locBtn").click(function(){
				var v = $(this).parent().parent().attr("k");
				_common.callAjax("/nms/getGeometryLocation.json", {k : v}, function(json) {
					GMXMAP.addPulse([Number(json.result[0].annoX), Number(json.result[0].annoY)],true);
				});
			});
		});


	});


})();