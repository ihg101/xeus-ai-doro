(function(){

	$(".contentWrapper").find("#resultTable").css("margin-bottom", "0px");

	function callView(offset, limit){

		var _param = _common.utils.collectSendData("#cctvSearchInfoWrap .contentWrapper #searchTable");

		if(!limit) limit = 20;
		if(!offset) offset = 0;

		_param["limit"] = limit;
		_param["offset"] = offset;

		_common.callAjax("/cctv/getCctvList.json", _param, function(json){

			Public.CCTV.Search.excelParam = _param;
			if(json.result.length == 0){
				var $tr = $("<tr><td colspan='4' class='tCenter'>결과가 존재하지 않습니다.</td></tr>");
				$(".contentWrapper").find("#resultTable").find("tbody").html($tr);
				$(".contentWrapper").find("#resultCnt").text("검색결과 (총 0건)");
			}else{
				$(".contentWrapper").find("#resultCnt").text("검색결과 (총 " + json.count + "건)");
				$(".contentWrapper").find("#max").val(json.count);
				$(".contentWrapper").find("#offset").val(offset);

				$(".contentWrapper").find("#resultTable").find("tbody").html("");
				for(var i=0; i<json.result.length; i++){
//					var label = "";
//					try{
//						if(json.result[i].cctvNm){
//							if(json.result[i].cctvNm.contains(";")){
//								if(json.result[i].cctvNm.match(/;/g).length >= 2){
//									var list = json.result[i].cctvNm.split(";");
//									label += list[0] + "\n" + list[2];
//								}
//							}
//						}
//					}catch(e){
//						label = json.result[i].cctvNm;
//					}

					var idx = offset + i;
					var $tr = $("<tr class='tCenter search_result' k='" + json.result[i].mgrNo + "'></tr>");
						$tr.append("<td>"+(idx+1)+"</td>");
//						$tr.append("<td>" + _common.getCodeByName("C14", json.result[i].gbnCd) + "</td>");
						$tr.append("<td>" + json.result[i].gbnNm + "</td>");
						$tr.append("<td><div class='tLeft sText' title='"+json.result[i].cctvNm+"'>" + json.result[i].cctvNm + "<div></td>");
						$tr.append("<td><button class='locBtn btn_t'>위치</button></td>");

					var prop = {
						gid : json.result[i].gid,
						mgrNo : json.result[i].mgrNo,
						gbnCd : json.result[i].gbnCd,
						angle : json.result[i].viewDir,
						cctvNm : json.result[i].cctvNm,
						channelNo : json.result[i].chnlNo,
						deviceId : json.result[i].deviceId,
						stateCd : json.result[i].stateCd,
						point : Spatial.convertProjection([json.result[i].lng, json.result[i].lat], "EPSG:4326", "EPSG:5186")
					};
					$tr.data(prop);

					$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
				}

				$(".paging_wrap").paging({
					current	  : 20,
					max  	  : Number($("#max").val()),
					nowOffset : Number($("#offset").val()),
					bindEvent : callView
				});
				$(".paging_wrap").show();

				/* 위치 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find(".locBtn").click(function(){
					var prop = $(this).parent().parent().data();

					GMXMAP.addPulse(prop.point, true);
				});

				/* 관리 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find(".detailBtn").click(function(){
					$("#btn-cctv-mng").click();
					var v = $(this).parent().parent().attr("k");
					_common.callAjax("/cctv/getCctvMngView.do", {mgrNo : v}, function(view) {
        				$("#center-overlay-east").height(
        					$(window).height() - $("#layout-north").outerHeight() - $("#overlay-east-bar").outerHeight()
        				).html(view);
        				xeusLayout.showOverlayEastPane(ANI_DELAY, function(){});
        				$(".btnDiv").removeClass("hidden");
        			});
				});

				$(".contentWrapper").find("#btn_play").click(function(){
					var cctvArray = new Array(); // cctv 결과 목록의 data 배열
					var maxPlay = 0; // 재생할 영상 최대 갯수
					$(".contentWrapper").find("#resultTable > tbody").find(".tCenter").each(function(){
						if(maxPlay==10){
							return false;
						}
						var prop = $(this).data();
						cctvArray.push(prop);
						maxPlay++;
					});
					var _json = encodeURIComponent(JSON.stringify(cctvArray));
					xeusCCTV.viewVideo(_json);
				});
			}
		});
	}

	/**
	 * 속성 검색 이벤트 입니다.
	 */
	$(".contentWrapper").find("#searchBtn").click(function(){
		callView();
	});

	/**
	 * 영역검색 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#spatialBtn").click(function(){
		if($(".drawType:checked").val() == null){
			alert("검색방법을 선택해 주세요.");
			return false;
		}
		Public.CCTV.Search.Start();
	});

	/**
	 * 영역검색 방식 변경 이벤트 입니다.
	 */
	$(".contentWrapper").find(".drawType").click(function(){
		if(Public.StopEvent != null) Public.StopEvent();
		Public.CCTV.Search.Start();
		$(".contentWrapper").find("#resultTable").find(".locBtn").each(function() {
			$(this).attr("key", "cctvSrchRslt");
		});
	});

	/**
	 * 영역검색 취소버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#drawCncl").click(function(){
		Public.StopEvent();
		$(".drawType").prop("checked", false);
	});

	/**
	 * 엑셀 다운로드 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#excelBtn").click(function(){
		if($(".contentWrapper").find("#resultTable").find("tbody").children('.search_result').length == 0){
			alert("검색결과가 존재하지 않아 다운로드할 수 없습니다.");
		}else{
			if(confirm("검색결과를 엑셀로 다운로드 하시겠습니까?")){
				var param = JSON.parse(JSON.stringify(Public.CCTV.Search.excelParam));
				delete param["limit"];
				delete param["offset"];
				_common.postForm.submit("/cctv/getCctvListExcel.do", param);
			}
		}
	});

	$(".contentWrapper").find("#cctvNm").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#searchBtn").click();
		}
	});

})();