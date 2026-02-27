/**
 * 지도&CCTVPTZ 키보드 이벤트를 설정합니다.
 * 각종 대표 키와 넘버 패드, +, - 버튼 조합으로 제어합니다.
 */
(function(){
	var keyMap = {
		/* M - MAP */ 77  : false,

		/* shift */	  16  : false,
		/* minus */	  109 : false,
		/* plus */	  107 : false,
		/* 8 up */	  104 : false,
		/* 2 down */  98 : false,
		/* 4 left */  100 : false,
		/* 6 right */ 102 : false,
		/* 활성화키*/ "activeKey" : ""
	};
	var keyPtz = {
		/* C - MAP */ 	  67  : false,
		/* P - MAP */	  80  : false,
		/* minus */	  	  109 : false,
		/* plus */	  	  107 : false,
		/* 8 up */	      104 : false,
		/* 7 leftup */	  103 : false,
		/* 9 rightup */	  105 : false,
		/* 2 down */  	   98 : false,
		/* 1 leftdown */   97 : false,
		/* 3 rightdown */  99 : false,
		/* 4 left */  	  100 : false,
		/* 6 right */ 	  102 : false,
		/*활성화키*/	  "activeKey" : "",
		/*제어모드 해제*/ 27 : false
	};

	$(document).keydown(function(e){
		//지도
		if(e.keyCode == 77 || keyMap["activeKey"] == ""){
			if(e.keyCode in keyMap) keyMap[e.keyCode] = true;
			if(e.keyCode != 77) keyMap["activeKey"] = "1";
		} else if (keyPtz["activeKey"] == "" || e.keyCode == 67 || e.keyCode == 80){
			if(e.keyCode in keyPtz) keyPtz[e.keyCode] = true;
		}
		$(".playerWrap").each(function(){
			if ($(this).attr('id') == document.activeElement.getAttribute('aria-describedby')){
				if ($(this).find("#btnPtz").attr("active") == "Y"){
					var cctvmgrNo = $(this).attr('id').split('-');
					var ptzParams = {"cctvMgrNo" : cctvmgrNo[1], "action" : "start", "code" : ""};
					if(keyPtz[67] && keyPtz[107]) ptzParams["code"] = "ZoomIn";
					if(keyPtz[67] && keyPtz[109]) ptzParams["code"] = "ZoomOut";
					if(keyPtz[67] && keyPtz[104]) ptzParams["code"] = "Up";
					if(keyPtz[67] && keyPtz[98]) ptzParams["code"] = "Down";
					if(keyPtz[67] && keyPtz[100]) ptzParams["code"] = "Left";
					if(keyPtz[67] && keyPtz[102]) ptzParams["code"] = "Right";
					if(keyPtz[67] && keyPtz[103]) ptzParams["code"] = "LeftUp";
					if(keyPtz[67] && keyPtz[105]) ptzParams["code"] = "RightUp";
					if(keyPtz[67] && keyPtz[97]) ptzParams["code"] = "LeftDown";
					if(keyPtz[67] && keyPtz[99]) ptzParams["code"] = "RightDown";
					if(ptzParams["code"] != ""){
						if(keyPtz["activeKey"] == "") {
							keyPtz["activeKey"] = ptzParams["code"];
							$.get(GMXCCTV.getXeusGateAPIURL()+ "/setPTZ.json", ptzParams);
						}
					}
				}
				if ($(this).find("#btnPreset").attr("active") == "Y"){
					//P가 눌러져있는 상태이면
					if(!keyPtz[80] && e.keyCode == 80){

						keyPtz[80] = true;
					}

				}
			}
		});
	}).keyup(function(e){
		if(!keyMap[e.keyCode] == false || (e.keyCode in keyMap)){
			var zoom = GMXMAP.getView().getZoom();
			if(keyMap[77] && keyMap[109]) GMXMAP.getView().setZoom(zoom - 1);
			if(keyMap[77] && keyMap[107]) GMXMAP.getView().setZoom(zoom + 1);

			var center = GMXMAP.getView().getCenter();
			var setVal = Math.floor(GMXMAP.getView().getResolution() * 400);
			if(keyMap[77] && keyMap[104]) GMXMAP.getView().setCenter([center[0], center[1] + setVal]);
			if(keyMap[77] && keyMap[98]) GMXMAP.getView().setCenter([center[0], center[1] - setVal]);
			if(keyMap[77] && keyMap[100]) GMXMAP.getView().setCenter([center[0] - setVal, center[1]]);
			if(keyMap[77] && keyMap[102]) GMXMAP.getView().setCenter([center[0] + setVal, center[1]]);

			keyMap["activeKey"] = "";
			if(e.keyCode in keyMap) keyMap[e.keyCode] = false;
		} else {
			$(".playerWrap").each(function(){
				if ($(this).attr('id') == document.activeElement.getAttribute('aria-describedby')){
					if ($(this).find("#btnPtz").attr("active") == "Y"){
						if(keyPtz[e.keyCode] == false || !(e.keyCode in keyPtz)) return;
						var cctvmgrNo = $(this).attr('id').split('-');
						var ptzParams = {"cctvMgrNo" : cctvmgrNo[1], "action" : "stop", "code" : ""};
						if(keyPtz[67] && keyPtz[107]) ptzParams["code"] = "ZoomIn";
						if(keyPtz[67] && keyPtz[109]) ptzParams["code"] = "ZoomOut";
						if(keyPtz[67] && keyPtz[104]) ptzParams["code"] = "Up";
						if(keyPtz[67] && keyPtz[98]) ptzParams["code"] = "Down";
						if(keyPtz[67] && keyPtz[100]) ptzParams["code"] = "Left";
						if(keyPtz[67] && keyPtz[102]) ptzParams["code"] = "Right";
						if(keyPtz[67] && keyPtz[103]) ptzParams["code"] = "LeftUp";
						if(keyPtz[67] && keyPtz[105]) ptzParams["code"] = "RightUp";
						if(keyPtz[67] && keyPtz[97]) ptzParams["code"] = "LeftDown";
						if(keyPtz[67] && keyPtz[99]) ptzParams["code"] = "RightDown";
						if(ptzParams["code"] != "") {
							if(keyPtz["activeKey"] == ptzParams["code"]){
								keyPtz["activeKey"] = "";
								$.get(GMXCCTV.getXeusGateAPIURL()+ "/setPTZ.json", ptzParams);
							}
						} else if(keyPtz[27]){
							$("#btnPtz").click();
							$(this).find(".menuWrap").hide();
						}
					}

					if ($(this).find("#btnPreset").attr("active") == "Y"){

	//					if(keyPtz[e.keyCode] == false || !(e.keyCode in keyPtz)) return;
						//P key가 up될 때
						if(e.keyCode == 80){
							keyPtz[80] = false;
							return;
						}

						//p가 눌러져있지 않을 때
						if(!keyPtz[80]){
							return;
						}


						var cctvMgrNo = $(this).attr('id').split('-')[1];
						var presetNo = getKey(e.keyCode);


						var isContain = false;

						$(this).find(".preset").each(function(){
							if($(this).data().presetNo == presetNo){
								isContain = true;
							}
						});

						if(!isContain){
							return;
						}

						var param = {};
						param['presetNo'] = presetNo;
						param['cctvMgrNo'] = cctvMgrNo;

						_common.callAjax("/preset/gotoPreset.json", param, function(json){

							if(json.result != true){
								alert(presetNo+" 프리셋으로 이동에 실패했습니다.");
							}
						},false);
					}else if($(this).find("#btnPtz").attr("active") == "N") {
						if(keyPtz[67]){
							$("#btnPtz").click();
							$(this).find(".menuWrap").hide();
						}
					}

				}
			});

			if(e.keyCode in keyPtz) keyPtz[e.keyCode] = false;
		}
	});

	/**
	 * Cluster Style Toggle 이벤트 입니다.
	 */
	var _ClusterStyleKeyEvent = function(e){
		if((e.which === 67) && (e.altKey) && (e.shiftKey)){
			if(("localStorage" in window)){
				if((localStorage["GMXMAP@clusterCountStyle"] === "true")){
					delete localStorage["GMXMAP@clusterCountStyle"];
				}else{
					localStorage["GMXMAP@clusterCountStyle"] = true;
				}

				GMXMAP.redrawAllVisibleVector();
			}
		}
	}
	$(document).keydown(_ClusterStyleKeyEvent);


})();