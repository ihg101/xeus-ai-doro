/**
 * <pre>
 * 위젯 유틸리티객체 입니다.
 *
 * @author 이주영
 * </pre>
 */



var WIDGET = {


	/**
	 * 미해제 이벤트 리스트 위젯을 생성합니다.
	 */
	getPastEventListWidget : function(selector, eventTypeList){

		var eventTypeInfoList = this.getEventTypeInfoList(eventTypeList);

		//각 이벤트 종류 권한 체크
		for(var i=0; i<eventTypeInfoList.length; i++){
			_common.callAjax("/auth/hasAuth.json", { "authData" : eventTypeInfoList[i].name }, function(json){
				if(json.result) eventTypeInfoList[i].hasAuth = true;
			}, false);
		}


		_common.callAjax("/eventList/getList.json", { 'limit': 200, 'offset': 0 }, function(json) {

			var $tbl = selector;
			$tbl.html("");
			for(var i=0; i<json.result.length; i++){

				var Json = null;
				try {
					Json = JSON.parse(json.result[i]);
					xeusJsonParser.setJson(Json);
				} catch (e) {
					var date = new Date();
					console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json Parse Error.");
					console.log(json.result[i]);
				}

				var isPass = false;
				var isTargetCheck = _common.utils.isNullAndEmpty(xeusJsonParser.getTargetGrp());
				var statEvetTypCd = xeusJsonParser.getStatEvetTypCd();


				//권한이 있는 이벤트인지 체크한다
				for(var y=0; y<eventTypeInfoList.length; y++){
					if(statEvetTypCd == eventTypeInfoList[y].name){
						isPass = eventTypeInfoList[y].hasAuth;
					}
				}

				if(isPass){
					if(!isTargetCheck){
						if(!xeusJsonParser.getTargetGrp().contains(userGrpNo)){
							continue;
						}
					}
					var $tr = $("<tr></tr>").attr("k", xeusJsonParser.getUSvcOutbId()).data(Json);
					$tr.css({"cursor" : "pointer"}).click(function(){
						var data = $(this).data();
						xeusJsonParser.move(data);
					});
					if(xeusJsonParser.getProcSt() != "종료"){
						var $statEvetNm = $("<td class='tCenter'></td>").html("<div class='text-overflow' title='" + xeusJsonParser.getEventType() + "'>" +xeusJsonParser.getEventType()+ "</div>");

						var $procSt = $("<td class='tCenter' style='width: 100px;'></td>").text(xeusJsonParser.getProcSt());
						var $outbPosNm = $("<td class='tBlankLeft'></td>").html("<div class='text-overflow' title='" + xeusJsonParser.getAddr() + "'>" + xeusJsonParser.getAddr() + "</div>");
						var $outbPos = $("<td class='tCenter' style='width: 100px;'></td>").text(new Date().formatMDHMS(xeusJsonParser.getYmd().substring(0, 14)));
						var $location = $("<td class='tCenter' style='width: 95px;'></td>");

						$tr.append($statEvetNm).append($procSt).append($outbPosNm).append($outbPos).append($location);
						$tbl.append($tr);

						//최대 row는 30이다
						if($tbl.find("tr").length >= 30){
							break;
						}
					}
				}
			}
		});
	},

	/**
	 * 이벤트 리스트 위젯을 생성합니다.
	 */
	getEventListWidget : function(selector){

//		var eventTypeInfoList = this.getEventTypeInfoList(eventTypeList);
//
//		//각 이벤트 종류 권한 체크
////		for(var i=0; i<eventTypeInfoList.length; i++){
////			_common.callAjax("/auth/hasAuth.json", { "authData" : eventTypeInfoList[i].name }, function(json){
////				if(json.result) eventTypeInfoList[i].hasAuth = true;
////			}, false);
////		}


		var $tbl = selector;

		var defaultColor = "black";
		if($("head").find('link[href*="main"]').length > 0){
			if(!$("head").find('link[href*="main"]').attr("href").contains("light")
			&& !$("head").find('link[href*="main"]').attr("href").contains("blue")){
				defaultColor = "white";
			}
		}


//		//권한이 있는 이벤트인지 체크한다
//		var isPass = false;
//		var statEvetTypCd = xeusJsonParser.getStatEvetTypCd();
//
//		for(var y=0; y<eventTypeInfoList.length; y++){
//			if(statEvetTypCd == eventTypeInfoList[y].name){
//				isPass = true;
//			}
//		}
//		//권한이 없으면 return
//		if(!isPass){
//			return;
//		}

		if(xeusJsonParser.isStart()){
			var Json = xeusJsonParser.getJson();
			var $tr = $("<tr></tr>").attr("k", xeusJsonParser.getUSvcOutbId()).data(Json);
			$tr.css({"cursor" : "pointer"}).click(function(){
				var data = $(this).data();
				xeusJsonParser.move(data);
			});
			var $statEvetNm = $("<td class='tCenter'></td>").html("<div class='text-overflow' title='"+ xeusJsonParser.getEventType()+"'>" + xeusJsonParser.getEventType() + "</div>");

			var $procSt = $("<td class='tCenter'></td>").text(xeusJsonParser.getProcSt());
			var $outbPosNm = $("<td class='tBlankLeft'></td>").html("<div class='text-overflow' title='"+ xeusJsonParser.getAddr() +"'>" +xeusJsonParser.getAddr()+ "</div>");

			var $outbPos = $("<td class='tCenter'></td>").text(new Date().formatMDHMS(xeusJsonParser.getYmd().substring(0, 14)));
			var $location = $("<td class='tCenter'></td>");
			var $btn = $("<button class='btn_t'>").text('위치').css({ "cursor" : "pointer" }).click(function(){
				$('.ctntWrap').show();
				var data = $(this).parent().parent().data();
				xeusJsonParser.move(data);
			});
			var $netBtn = $("<button class='btn_t'>").text('투망').css({}).click(function(){
				$('.ctntWrap').show();
				xeusJsonParser.move(Json);

				var netData = JSON.stringify({ "srid" : "4326", "lon" : Json.outbPos[0].x, "lat" : Json.outbPos[0].y });
				var isPreview = false; _common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVIEW" }, function(json){ isPreview = json.result; }, false);
				GMXCCTV.startNetMornitoring(netData, isPreview);
			});


//			$location.append($btn);

			_common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVIEW" }, function(_json){
				var isPreview = _json.result;
				if(isPreview){
					var timeset = new Date().formatDiffTime(
						$tr.data().statEvetOutbDtm,
						new Date().getYMDHMS()
					);

					if(timeset.diffDay > 0 || timeset.diffHour > 0 || timeset.diffMin > 30){
						$netBtn.remove();
					}
				}
			}, false);

			//$tr.append($statImg).append($statEvetNm).append($statEvetType).append($outbPosNm).append($outbPos).append($location);
			if(selector.find("thead").find("tr").find("th").length>5)
				$tr.append($("<td class='tCenter'></td>")).append($statEvetNm).append($procSt).append($outbPosNm).append($outbPos).append($location);
			else{
//				$location.append($netBtn);
				$tr.append($statEvetNm).append($procSt).append($outbPosNm).append($outbPos).append($location);
			}
			$tbl.prepend($tr);

			//이벤트 리스트 마지막 행 삭제
			if($tbl.find("tr").length >30){
				if($tbl.find("tr:last").length >0){
					$tbl.find("tr:last").remove();
				}
			}
			var duration = 200;
			for(var i=0; i<10; i++){
				$tr.animate({"color" : xeusJsonParser.getProcStColor()}, duration);
				$tr.animate({"color" : defaultColor}, duration);
			}

			$("#widget-point").find(".pointBtn").attr("active", "");
		}else if(xeusJsonParser.isChange()){
			var _JSON = xeusJsonParser.getJson();
			selector.find("tbody tr").each(function(){
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
			selector.find("tbody tr").each(function(){
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
	},

	/**
	 * 이벤트 종류 정보 리스트를 반환합니다
	 */
	getEventTypeInfoList : function(eventTypeList){
		var result = [];
		for(var i=0; i<eventTypeList.length; i++){
			var obj = {};
			obj["name"] = eventTypeList[i];
			obj["hasAuth"] = false;
			result.push(obj);
		}

		return result;
	}



};
