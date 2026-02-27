/**
 * <pre>
 * 위젯 유틸리티객체 입니다.
 *
 * @author 이주영
 * </pre>
 */

var avgTime = [];

var AIDORO = {
	
	setCluster: function(lyrId){
		var targetLayer = GMXMAP.getLayer(lyrId);
		
		if (!targetLayer) return;
		if (!targetLayer.getSource()) return;
		if (!targetLayer.getVisible()) return;
		
		var resolution = GMXMAP.getView().getResolution();
		
		var clusterDistance =
		    resolution < 1 ? 50 :
		    resolution < 3 ? 100 :
		    200;
		//clusterDistance = 200;
		//console.log('clusterDistance', clusterDistance, resolution);
		//clusterDistance = 5 / GMXMAP.getView().getResolution();
		
		targetLayer.getSource().setDistance(clusterDistance);
		
	},
}

var WIDGET = {
	
	/**
	 * tr 배경색을 변경합니다.
	 */
	changeOrder : function(){
		$("#evtTable").find("tbody").find("tr").css("background", "none");
		$("#evtTable").find("tbody").find("tr").eq(0).css("background", $("#evtTable").find("tbody").find("tr").eq(0).attr("back"));
		$("#evtTable").find("tbody").find("tr").eq(1).css("background", $("#evtTable").find("tbody").find("tr").eq(1).attr("back"));

		if($("#evtTable").find("tbody").find("tr").length == 0){
			$("#widget-point").find("#dis").hide();
		}else{
			$("#widget-point").find("#dis").show();
		}
		$("#widget-point").find(".pointBtn").attr("active", "");
	},

	/**
	 * 미해제 이벤트 리스트 위젯을 생성합니다.
	 */
	getPastEventListWidget : function(_param){
		var evtGUL = false;
		var evtNAK = false;
		var evtCORN = false;
		var evtPORT = false;
		var evtCRACK = false;
		var evtICE = false;
		var evtWater = false;
		
		var blackICeList = [];
		
		if(_param === undefined) _param = {};   
		//_param["limit"] = 50;
		//_param["offset"] = 0;
		
/*		_common.callAjax("/auth/hasAuth.json", { "authData" : "004" }, function(json){
			if(json.result) evtGUL = true;
		}, false);
		
		_common.callAjax("/auth/hasAuth.json", { "authData" : "002" }, function(json){
			if(json.result) evtNAK = true;
		}, false);
		
		_common.callAjax("/auth/hasAuth.json", { "authData" : "003" }, function(json){
			if(json.result) evtCORN = true;
		}, false);
		
		_common.callAjax("/auth/hasAuth.json", { "authData" : "001" }, function(json){
			if(json.result) evtPORT = true;
		}, false);
		
		_common.callAjax("/auth/hasAuth.json", { "authData" : "005" }, function(json){
			if(json.result) evtCRACK = true;
		}, false);
		
		_common.callAjax("/auth/hasAuth.json", { "authData" : "006" }, function(json){
			if(json.result) evtICE = true;
		}, false);
		
		_common.callAjax("/auth/hasAuth.json", { "authData" : "007" }, function(json){
			if(json.result) evtWater = true;
		}, false);*/
		
		if(_SITE_NAME_ === "태백시"){
			_common.callAjax("/eventList/getBlackIceList.json",_param, function(json) {
				blackICeList = json.result;
			});
		} else{
			//_param["limit"] = 50;
			_param["offset"] = 0;
		}
		//2026.01.05 원우빈 낙하물 추가
		_param["evtTypCd"] = "004,002";
		_param["type"] = "LIST";
		_common.callAjax("/eventList/getList.json",_param, function(json) {
			/*
			 * 블랙아이스/ 수막 데이터는 다른 테이블에서 가지고 와서
			 * 날짜순 정렬 따로 시킴.
			 */
			if (blackICeList.length > 0) {
			    json.result = [...json.result, ...blackICeList]
			        .map(item => JSON.parse(item))
			        .sort((a, b) => {
			            var aState = a.etcCntn.state;
			            var bState = b.etcCntn.state;
			            if (aState === "1" && bState !== "1") return -1;
			            if (aState !== "1" && bState === "1") return 1;
			            return Number(b.statEvetOutbDtm) - Number(a.statEvetOutbDtm);
			        })
			        .map(item => JSON.stringify(item))
			       // .slice(0, 50);
			}
			
			var totalEventCount = 0;

			// 기존에 등록된 이벤트 핸들러 제거해 중복 실행 방지
			$("#detailPopup").off("click", ".btn_Dstyle");

			// 한번만 등록되도록 위치를 for문 밖에 위치
			$("#detailPopup").on("click", ".btn_Dstyle", function() {
				var imageUrl = $(this).data("imageurl");
				if (imageUrl) {
					var link = document.createElement("a");
					link.href = imageUrl;
					link.download = imageUrl.split('/').pop();
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			});
			
			 // Tbody의 TR들만 제거 (초기화)
		    $(".monitoring_wrap").find("#evtTable tbody").empty();
		    
			for(var i=0; i<json.result.length; i++){
				var $tbl = $(".monitoring_wrap").find("#evtTable");
				var Json = null;
				try {
					Json = JSON.parse(json.result[i]);
					xeusJsonParser.setJson(Json);
					
				} catch (e) {
					var date = new Date();
					console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json Parse Error.");
					console.log(json.result[i]);
				}
				
				var isPass = true; // 필요시에만 예외처리
				var isTargetCheck = _common.utils.isNullAndEmpty(xeusJsonParser.getTargetGrp()); // Null 또는 공백이면 true
				var statEvetTypCd = xeusJsonParser.getStatEvetTypCd();
				var isPreview = statEvetTypCd == "CCTVPREVREQ";
				
				/*
				 * if(statEvetTypCd == "003") isPass = evtCORN; if(statEvetTypCd ==
				 * "002") isPass = evtNAK; if(statEvetTypCd == "005") isPass =
				 * evtCRACK; if(statEvetTypCd == "004") isPass = evtGUL;
				 * if(statEvetTypCd == "001") isPass = evtPORT;
				 */
				
				// 로컬스토리지 값에 따라 리스트에 보이는 유형 표출
				if (localStorage.getItem(statEvetTypCd) !== "true") {
				    isPass = false;
				} else if (!["001", "002", "003", "004", "005", "006", "007"].includes(statEvetTypCd)) {
				    console.error(statEvetTypCd + "는 유효한 이벤트 유형이 아닙니다.");
				}
				
				if(isPass){
					if(!isTargetCheck){
						if(!xeusJsonParser.getTargetGrp().contains(userGrpNo)){
							continue;
						}
					}
					
					var $tr = $("<tr></tr>").attr("k", xeusJsonParser.getUSvcOutbId()).data(Json);
					
					// 이벤트 상세정보
			/*		$tr.css({"cursor" : "pointer"}).click(function(){
						$('#ctntTable').parents().show();
						xeusJsonParser.setEventContent($(this).data());
						var imageUrl = getIdFromUrl($(this).data().etcCntn.imgUrl) || 'res/img/bg2.png';
					    $("#ctntTable .img_box").html('<img src="' + imageUrl + '" alt="이벤트 이미지" style=" height:200px">');
			
				    	//updateDetailPopup($(this).data());
					
					});*/
					
					if(xeusJsonParser.getProcSt() != "종료"){
						
					    var eventType = xeusJsonParser.getEventType(); 
					    var eventImage = AIPOPUP.getEventTypeImage(eventType);
					    var state = Json.etcCntn.state;
						
					    var $statEvetNm = $("<td class='tCenter'></td>").html(
					            "<div class='text-overflow' title='" + eventType + "'>" +
					            "<img src='" + eventImage + "' alt='" + eventType + " 아이콘' style='width:20px; vertical-align:middle; margin-right:5px;'>" +
					            eventType + "</div>");
					    
					    var $state = $("<td class='tCenter'></td>").html(
					            "<div class='text-overflow' title='" + AIPOPUP.converState(statEvetTypCd,state) + "'>" + AIPOPUP.converState(statEvetTypCd,state) + "</div>");
					    
						var $outbPosCombined = $("<td class='tBlankLeft'></td>").html(
								"<div class='tCenter'>" + new Date().formatMDHMS(xeusJsonParser.getYmd().substring(0, 14)) + "</div>" +
						        "<div class='text-overflow' title='" + xeusJsonParser.getAddr() + "'>" + xeusJsonParser.getAddr() + "</div>");
						var $location = $("<td class='tCenter' style='width: 95px;'></td>");

						var $btn = $("<button class='btn_t'>").text('위치').css({ "cursor" : "pointer" }).click(function(){
							var data = $(this).parent().parent().data(); 
							xeusJsonParser.move(data);
						});
						
						var $detailBtn = $("<button class='btn_t'>").text('상세').css({ }).click(function() {
							var data = $(this).parent().parent().data();
							var $dialog = $("#detailPopup");
							$dialog.dialog({
								title: "상세 이벤트",
								width: 450,
								open: function(){
									$dialog.dialog({position:{
										my: "right top",
										at: "right-60 top+56",
										of: $("#map")
									}});
								},
							});
							AIPOPUP.updateDetailPopup(data);
						});

						var statEvetTypCd = xeusJsonParser.getStatEvetTypCd();
						if (statEvetTypCd === "006" || statEvetTypCd === "007") {
							$location.append($btn);
						} else{
							$location.append($btn).append($detailBtn);
						}

						if(isPreview){
							var timeset = new Date().formatDiffTime(
									$tr.data().statEvetOutbDtm,
								new Date().getYMDHMS()
							);

							if(timeset.diffDay > 0 || timeset.diffHour > 0 || timeset.diffMin > 30){
								$detailBtn.remove();
							}
						}

						$tr.append($statEvetNm).append($state).append($outbPosCombined).append($location);
						
						// state가 "1"인 경우 상단에 추가, 그렇지 않으면 하단에 추가
						if(Json.etcCntn.state === "1") {
							$tbl.prepend($tr);
						} else {
							$tbl.append($tr);
						}
						
						totalEventCount++;
						
					}
				}
			}
			
			// 수집된 이벤트 데이터를 배열로 만들기
			var collectedEventData = [];
			$('#evtTable tbody tr').each(function(){
				var rowData = $(this).data();
				if(rowData && rowData.etcCntn && rowData.etcCntn.state) {
					collectedEventData.push(rowData);
				}
			});
			document.querySelector("#eventCount").innerText = "총 " + totalEventCount + "개의 이벤트가 발생했습니다.";
		});
	},
	
	/**
	 * 이벤트 리스트 위젯을 생성합니다.
	 */
	getEventListWidget : function(){
		
		var $tbl = $(".monitoring_wrap").find("#evtTable");
		var defaultColor = "white";
		
		if($("head").find('link[href*="main"]').length > 0){
			if(!$("head").find('link[href*="main"]').attr("href").contains("light")
			&& !$("head").find('link[href*="main"]').attr("href").contains("blue")){
				defaultColor = "white";
			}
		}
		
		//신규 이벤트 들어왔을떄
		// 디버그용 로그 - 확인 후 삭제 필요
		console.log("getEventListWidget 호출됨 - procSt:", xeusJsonParser.getJson().procSt, "statEvetTypCd:", xeusJsonParser.getStatEvetTypCd(), "isStart:", xeusJsonParser.isStart());
		if(xeusJsonParser.isStart()){
			var Json = xeusJsonParser.getJson();
			var statEvetTypCd = xeusJsonParser.getStatEvetTypCd();

			var $tr = $("<tr></tr>").attr("k", xeusJsonParser.getUSvcOutbId()).data(Json);
			$tr.css({"cursor" : "pointer"}).click(function(){
				xeusJsonParser.setEventContent($(this).data());
			});
			
			var eventType = xeusJsonParser.getEventType(); 
		    var eventImage = AIPOPUP.getEventTypeImage(eventType);
		    var state = Json.etcCntn.state;

			
		    var $statEvetNm = $("<td class='tCenter'></td>").html(
		            "<div class='text-overflow' title='" + eventType + "'>" +
		            "<img src='" + eventImage + "' alt='" + eventType + " 아이콘' style='width:20px; vertical-align:middle; margin-right:5px;'>" +
		            eventType + "</div>");
		    
		    var $state = $("<td class='tCenter'></td>").html(
		            "<div class='text-overflow' title='" + AIPOPUP.converState(statEvetTypCd,state) + "'>" + AIPOPUP.converState(statEvetTypCd,state) + "</div>");
		    
			var $outbPosCombined = $("<td class='tBlankLeft'></td>").html(
					"<div class='tCenter'>" + new Date().formatMDHMS(xeusJsonParser.getYmd().substring(0, 14)) + "</div>" +
			        "<div class='text-overflow' title='" + xeusJsonParser.getAddr() + "'>" + xeusJsonParser.getAddr() + "</div>");
			var $location = $("<td class='tCenter' style='width: 95px;'></td>");
			var $btn = $("<button class='btn_t'>").text('위치').css({ "cursor" : "pointer" }).click(function(){
				$('.ctntWrap').show();
				var data = $(this).parent().parent().data();
				xeusJsonParser.move(data);
			});
			var $detailBtn = $("<button class='btn_t'>").text('상세').css({ "cursor" : "pointer" }).click(function(){
				var data = $(this).parent().parent().data();
				var $dialog = $("#detailPopup");
			    $("#detailPopup").dialog({
			        title: "상세 이벤트",
			        width: 450,
			        open: function(){
		                $dialog.dialog({position:{
		                    my: "right top",
		                    at: "right-60 top+56",
		                    of: $("#map")
		                }});
		            },
			    });
				AIPOPUP.updateDetailPopup(data);
			});


			/*var $netBtn = $("<button class='btn_t'>").text('투망').css({}).click(function(){
				$('.ctntWrap').show();
				xeusJsonParser.move(Json);

				var netData = JSON.stringify({ "srid" : "4326", "lon" : Json.outbPos[0].x, "lat" : Json.outbPos[0].y });
				var isPreview = false; _common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVIEW" }, function(json){ isPreview = json.result; }, false);
				GMXCCTV.startNetMornitoring(netData, isPreview);
			});*/

			if (statEvetTypCd === "006" || statEvetTypCd === "007") {
				$location.append($btn);
			} else{
				$location.append($btn).append($detailBtn);
			}
			xeusJsonParser.move(Json);
/*			_common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVIEW" }, function(_json){
				var isPreview = _json.result;
				if(isPreview){
					var timeset = new Date().formatDiffTime(
						$tr.data().statEvetOutbDtm,
						new Date().getYMDHMS()
					);

					if(timeset.diffDay > 0 || timeset.diffHour > 0 || timeset.diffMin > 30){
						$detailBtn.remove();
					}
				}
			}, false);*/

			//$tr.append($statImg).append($statEvetNm).append($statEvetType).append($outbPosNm).append($outbPos).append($location);
			if($(".monitoring_wrap").find("#evtTable").find("thead").find("tr").find("th").length>5){
				$tr.append($("<td class='tCenter'></td>")).append($statEvetNm).append($state).append($outbPosCombined).append($location);
			} else{
				$tr.append($statEvetNm).append($state).append($outbPosCombined).append($location);
			}
			//테스트용 로그
			//LOG.debugTime(Json)
			// 신규 이벤트는 state="1"인 이벤트들 바로 아래에 추가
			var stateOneRows = $tbl.find("tbody tr").filter(function() {
				return $(this).data() && $(this).data().etcCntn && $(this).data().etcCntn.state === "1";
			});
			
			if(stateOneRows.length > 0) {
				// state="1"인 마지막 행 다음에 삽입
				stateOneRows.last().after($tr);
			} else {
				// state="1"인 행이 없으면 최상단에 추가
				$tbl.prepend($tr);
			}

			var duration = 200;
			for(var i=0; i<10; i++){
				$tr.animate({"color" : xeusJsonParser.getProcStColor()}, duration);
				$tr.animate({"color" : defaultColor}, duration);
			}

			$("#widget-point").find(".pointBtn").attr("active", "");
			
			var totalEventCount = $tbl.find("tbody tr:visible").length;
			document.querySelector("#eventCount").innerText = "총 " + totalEventCount + "개의 이벤트가 발생했습니다.";
			
			// 수집된 이벤트 데이터를 배열로 만들기
			var collectedEventData = [];
			$('#evtTable tbody tr').each(function(){
				var rowData = $(this).data();
				if(rowData && rowData.etcCntn && rowData.etcCntn.state) {
					collectedEventData.push(rowData);
				}
			});
			
			GMXMAP.reloadLayerData('v_mon_evet_excavator');
			GMXMAP.reloadLayerData('v_mon_evet_fall');
			GMXMAP.reloadLayerData('v_mon_evet_blackice');
			//AIDORO.createAIDoroEventLayer(collectedEventData);
		}else if(xeusJsonParser.isChange()){
			var _JSON = xeusJsonParser.getJson();
			$("#evtTable").find("tbody tr").each(function(){
				if($(this).data().uSvcOutbId == xeusJsonParser.getUSvcOutbId()){
					$(this).attr("k", xeusJsonParser.getUSvcOutbId()).data(_JSON);
					$(this).find("td").eq(0).text(xeusJsonParser.getEventType());
					$(this).find("td").eq(1).text(xeusJsonParser.getProcSt());
					$(this).find("td").eq(2).text(xeusJsonParser.getAddr());
					$(this).find("td").eq(3).text(new Date().formatMDHMS(xeusJsonParser.getYmd().substring(0, 14)));

					var duration = 200;
					for(var i=0; i<10; i++){
						$(this).animate({"color" : xeusJsonParser.getProcStColor()}, duration);
						$(this).animate({"color" : defaultColor}, duration);
					}

					var uSvcOutbId = $("#ctntTable").attr("uSvcOutbId");
					if(_JSON.uSvcOutbId == uSvcOutbId){
						xeusJsonParser.setEventContent();
					}

					//TODO TTA 인증 후 제거
					//xeusJsonParser.move(JSON);
				}
			});
		}else{
			$("#evtTable").find("tbody tr").each(function(){
				if($(this).data().uSvcOutbId == xeusJsonParser.getUSvcOutbId()){
					var procSt = xeusJsonParser.getProcSt();
					$(this).find("td").eq(1).text(procSt);

					if(procSt == "종료"){
						$(this).remove();
					}else{
						var duration = 200;
						for(var i=0; i<10; i++){
							$(this).animate({"color" : xeusJsonParser.getProcStColor()}, duration);
							$(this).animate({"color" : defaultColor}, duration);
						}

						var uSvcOutbId = $("#ctntTable").attr("uSvcOutbId");
						if(xeusJsonParser.getJson().uSvcOutbId == uSvcOutbId){
							if(eventVectorSource) eventVectorSource.clear();
							Spatial.stopInterval();
							$("#ctntTable").find(".ctntTd").html("");
						}
					}
				}
			});
		}
		//WIDGET.changeOrder();
	}
};

var AIPOPUP = {
		
		converState : function(statEvetTypCd,state){
			if(statEvetTypCd == "006" || statEvetTypCd =="007") return "위험";
			if(state == "0") return "발생"
			if(state == "1") return "확인"
			if(state == "2") return "오탐"
		},
	
	/**
	 * 이벤트 유형에 따른 이미지 경로를 반환합니다.
	 */
	getEventTypeImage: function(eventType) {
		var imagePaths = {
	        "포트홀": "res/img/ai-doro/icn_doro1.png",
	        "낙하물": "res/img/ai-doro/icn_doro2.png",
	        "콘": "res/img/ai-doro/icn_doro3.png",
	        "굴삭기": "res/img/ai-doro/icn_doro4.png",
	        "크랙": "res/img/ai-doro/icn_doro5.png",
	        "블랙아이스": "res/img/ai-doro/icn_doro7.svg",
	        "수막현상": "res/img/ai-doro/icn_doro6.svg"
	    };
	    return imagePaths[eventType] || "";
	},
	
	/**
	 * 상세 팝업의 내용을 업데이트합니다.
	 */
	updateDetailPopup: function(data) {
		var etcCntn = data.etcCntn;
		var detectTyp = (data.etcCntn.detector == "1") ? "버스" : " CCTV"; 
		var coord = Spatial.convertProjection( [data.outbPos[0].x, data.outbPos[0].y], "EPSG:4326", "EPSG:5186");
		
		if(data.statEvetNm === '수막현상' || data.statEvetNm === '블랙아이스' ) {
			$("#detailPopup .info_list li:nth-child(1) span:nth-child(2)").text(data.statEvetNm + " / " + etcCntn.eventSeverity || 'N/A');
		} else{
			$("#detailPopup .info_list li:nth-child(1) span:nth-child(2)").text(data.statEvetNm  + " / " + detectTyp || 'N/A');
		}
	    $("#detailPopup .info_list li:nth-child(2) span:nth-child(2)").text(new Date().formatYMDHMS(data.statEvetOutbDtm));
	    //$("#detailPopup .info_list li:nth-child(3) span:nth-child(2)").text(data.outbPosNm || 'N/A');
	    $("#detailPopup .info_list li:nth-child(3) span:nth-child(2)").text(data.outbPos[0].x + " / " + data.outbPos[0].y || 'N/A');
	    $("#detailPopup .info_list li:nth-child(4) span:nth-child(2)").text(coord[0] + " / " + coord[1] || 'N/A');
	    $("#detailPopup .info_list li:nth-child(5) #eventState").val(etcCntn.state);
	    
	    // 상태에 따른 UI 제어
	    var updateRadiusVisibility = function() {
	    	if($("#eventState").val() === "1" && (data.statEvetNm === '굴삭기' || data.statEvetNm === '낙하물') ){
	    		$("#radius").parent().show();
	    		$("#detailPopup .info_list li:nth-child(6) #radius").val(etcCntn.dist);
	    	} else {
	    		$("#radius").parent().hide();
	    	}
	    };
	    // 초기 상태 설정
	    updateRadiusVisibility();
	    
	    // 상태 변경 시 이벤트 핸들러
	    $("#eventState").off("change").change(updateRadiusVisibility);
	    
	    // 이미지 URL 설정
	    var imageUrl = AIPOPUP.getIdFromUrl(etcCntn.imgUrl) || 'res/img/bg2.png';    
	    $("#detailPopup .img_box").html('<img src="' + imageUrl + '" alt="이벤트 이미지" style="max-width: 100%; height:300px;">');
	    $("#detailPopup .imgDown").data("imageurl", imageUrl);
	    
		$("#editState").off("click").on("click",function(){
			var _url = "/eventList/edit.json";
			var _state = $("#eventState").val();
			var _radius = $("#radius").val();
			var _param = {"usvcOutbId" : data.uSvcOutbId}
			
			etcCntn.state = _state;
			if ( _state != '1' ) {
				_radius = '0';
			}
			etcCntn.dist = _radius;
			_param["evtJson"] = JSON.stringify(etcCntn);
			
			if(_state === "99" || _state === "2"){
				delete _param["evtJson"];
				_param["flag"] = "1";
				_url = "/eventList/del.json";
			}
			
			_common.callAjax(_url, _param, function(_json){
				if(_json.result === true) {
					alert("상태가 변경되었습니다.");
					// 종료 상태인 경우 다이얼로그 닫기
					if(_state === "99"  || _state === "2") {
						$("#detailPopup").dialog("close");
					} else {
						// 상태 변경 후 현재 이벤트 데이터 업데이트
						etcCntn.state = _state;
						// 다이얼로그 내용 다시 로드
						AIPOPUP.updateDetailPopup(data);
					}
					// 이벤트 리스트 다시 로드
					WIDGET.getPastEventListWidget();
					//레이어 리로드
					GMXMAP.reloadLayerData('v_mon_evet_excavator');
					GMXMAP.reloadLayerData('v_mon_evet_fall');
				}
			});
		});
	},
	
	/**
	 * 이미지 경로 추출
	 * 
	 * @param url
	 * @returns
	 */
	getIdFromUrl: function(url) {
	  if (!url ) return null;
	  var match = url.match(/[?&]id=([^&]+)/);
	  if ( !match ) return null;
	  return '/xeus/api/getImage.do?id=' + match[1];
	}

};

var LOG = {
		
		debugTime : function(json){
			console.log("---------------------------------------------------")
			  
		    var occurTime = json.etcCntn.eventTime;
		    var convertTime = occurTime.replace(/(\.\d{3})\d+/, "$1"); 
		    var date = new Date(convertTime);
		    var h = String(date.getHours()).padStart(2, "0");
		    var m = String(date.getMinutes()).padStart(2, "0");
		    var s = String(date.getSeconds()).padStart(2, "0");
		    var ms = String(date.getMilliseconds()).padStart(3, "0");

		    console.log("이벤트 발생시간", `${h}:${m}:${s}.${ms}`);
		    
			var now = new Date();
			var nh = String(now.getHours()).padStart(2, "0");
			var nm = String(now.getMinutes()).padStart(2, "0");
			var ns = String(now.getSeconds()).padStart(2, "0");
			var nms = String(now.getMilliseconds()).padStart(3, "0");
			
			console.log("표출시간", `${nh}:${nm}:${ns}.${nms}`);
			
			var diffMs = now - date;

			console.log("이벤트 발생 시간에서  표출까지 걸린시간", diffMs + "ms");
			
		    avgTime.push(diffMs);
		    
		    if (avgTime.length === 10) {
		        var sum = avgTime.reduce((acc, cur) => acc + cur, 0);
		        var average = sum / avgTime.length;
		        console.log("***************************************************")
		        console.log("이벤트 발생 시간에서 표출까지 걸린 평균시간", average + "ms");
		        console.log("***************************************************")
		        avgTime = [];
		    } 
		}
}

