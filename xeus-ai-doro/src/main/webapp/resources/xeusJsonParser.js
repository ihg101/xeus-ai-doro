/**
 *
 */
var xeusJsonParser = {

	/**
	 * Socket > GIS Json Body 입니다.
	 */
	json : null,

	getTemplate : function(type){
		var _template = {
			// 이벤트 타입 코드 (112, 119, DSC 등)
			"statEvetTypCd" : "",

			// 이벤트 메세지 타입 (전문구분코드 - 99로그인, 10사건정보, 20출동정보 등)
			"statMsgTypCd" : "",

			// 위치정보 명 – 예) 인천지하철 부평역
			"outbPosNm" : "",

			// 이벤트 명 – 예) 화재, 정전, 침수
			"statEvetNm" : "",

			// 이벤트 해제일시 입력 ex) "20171122131540889"
			"statEvetClrDtm" : "",

			// 이벤트 접수 내용 – 화재 발생, 정전 발생, ㅇㅇ사거리 교통사고
			"statEvetCntn" : "",

			// 이벤트 범주 - 예) 사회재난, 자연재난
			"statEvetType" : "",

			// 좌표값 (배열이지만 단건만 등록.)
			"outbPos" : [{ "x" : "", "y" : "" }],

			// 이벤트 발생일시
			"statEvetOutbDtm" : "",

			// 조치내용 또는 종료사유
			"statEvetActnCntn" : "",

			// 이벤트 프로세스 코드 (10 발생 | 40 정보변경 | 50 해제 | 90 취소 | 91 종료)
			"procSt" : "",

			// 모의 여부 (Y 모의 | N 실제)
			"isTest" : "",

			// 이벤트 고유 ID
			"uSvcOutbId" : "",

			// 조치자
			"statEvetActnMn" : "",

			// 이벤트 조치일자 (조치 또는 종료시만 년월일시분초)
			"statEvetActnDtm" : "",

			// 서비스명칭 - 예) 112긴급출동지원서비스
			"statEvetSvcTyp" : "",

			// 주제별 상세 내용(원문)
			"etcCntn" : {}
		}

		if(type == "119"){
			_template.etcCntn = {
				"EVENT_TYP_CD" : "119",
				"MSG_TYP_CD" : "10",
				"STA_TYP_CD" : "10",
				"MSG_STA_DTM" : "20180503150413",
				"SND_SYS_CD" : "119",
				"RCV_SYS_CD" : "UCP",
				"SND_DTM" : "20180503151013",
				"SEND_NUM" : "T20180504171843",
				"EVT_NM" : "구급",
				"EVT_DTL" : "교통사고",
				"LON" : "126.89833328898494",
				"LAT" : "37.483267840449614",
				"ADDR" : "서울 구로구 구로동 823",
				"BJD_CD" : "1154510103",
				"EVT_DTM" : "20180325202844",
				"SENDER_ID" : "geomex"
			}
		}else if(type == "112"){
			_template.etcCntn = {
				"EVENT_TYP_CD" : "112",
				"MSG_TYP_CD" : "10",
				"STA_TYP_CD" : "10",
				"MSG_STA_DTM" : "20180504171841",
				"SND_SYS_CD" : "112",
				"RCV_SYS_CD" : "UCP",
				"SND_DTM" : "20180503151013",
				"SEND_NUM" : "T20180504171841",
				"EVT_GRD" : "112",
				"EVT_TYP" : "교통사고",
				"LON" : "126.89527706188873",
				"LAT" : "37.48453900965434",
				"ADDR" : "서울 구로구 구로동 198-4",
				"BJD_CD" : "1154510103",
				"EVT_DTM" : "20180504171841",
				"SENDER_ID" : "geomex"
			}
		}else if(type == "DSC"){
			_template.etcCntn = {
				"EVENT_TYP_CD" : "DSC",
				"MSG_TYP_CD" : "10",
				"STA_TYP_CD" : "10",
				"MSG_STA_DTM" : "20180503150413",
				"SND_SYS_CD" : "WP1",
				"RCV_SYS_CD" : "UCP",
				"SND_DTM" : "20180417151013",
				"SEND_NUM" : "T20180504171845",
				"SVC_TYP" : "프로기",
				"EVT_LON" : "126.894728",
				"EVT_LAT" : "37.465077",
				"EVT_ADDR" : "서울특별시 금천구 독산동 1006-77",
				"EVT_BJD" : "1154510103",
				"REF_ID" : "red_id",
				"DSC_NM" : "둘리",
				"DSC_PHONE" : "010-1112-3131",
				"DSC_BIRTH" : "900204",
				"DSC_SEX" : "남",
				"DSC_ADDR" : "강원도 춘천시 서면 박사로 882",
				"GUARD_NM" : "홍길동",
				"GUARD_PHONE" : "010-7754-2151",
				"EVT_DTM" : "20180424130431",
				"IMAGE" : "20180424130431.png;aaaaaa.png",
				"INFO" : "info.....",
				"NOTE" : "한글 연습....",
				"SENDER_ID" : "geomex"
			}
		}

		return _template;
	},

	/**
	 * Json Body 를 상단 Json 객체에 Binding 합니다.
	 *
	 * @param json
	 * @returns {___anonymous_xeusJsonParser}
	 */
	setJson : function(json){
		this.json = json;

		/* 위치 설정 */
		var outbPos = this.json.outbPos[0];
		
		try {
			if(Number(outbPos.x) == 0 && Number(outbPos.y) == 0){
				var xy = Spatial.convertAddrToXY(this.json.outbPosNm);
				this.json.outbPos[0].x = xy[0];
				this.json.outbPos[0].y = xy[1];
			}
		} catch (e) {
			var date = new Date();
			try {
				console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json > outbPos(" + outbPos.toString() + ") Error.");
			} catch (e) {
				console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json > outbPos Error.");
			}
		}

		/* 내부코드(심볼 상태 등) 설정 */
		var statEvetTypCd = this.json.statEvetTypCd;
		// console.log("statEvetTypCd : ", statEvetTypCd); // BELL
		if(statEvetTypCd == "CCTVLOCK" || statEvetTypCd == "CCTVSHER" || statEvetTypCd == "CCTVPREV"){
			this.json["isNotExternal"] = true; // this.json 객체에 isNotExternal라는 속성을 추가하거나 업데이트하고 해당 속성값을 true로 설정
		}else{
			this.json["isNotExternal"] = false;
		}

		return this;
	},

	/**
	 * Json 을 리턴합니다.
	 *
	 * @returns {___anonymous111_1152}
	 */
	getJson : function(){ return this.json; },

	/**
	 * 이벤트를 시작합니다.
	 *
	 * @returns {___anonymous_xeusJsonParser}
	 */
	Start : function(_Map){
		
		if(this.isStart()){
			var etcCntn = "";
			if(this.json.etcCntn != "" && this.json.etcCntn != null){
				if(typeof this.json.etcCntn == "string") etcCntn = JSON.parse(this.json.etcCntn);
				if(typeof this.json.etcCntn == "object") etcCntn = this.json.etcCntn;
			}

			/* 지능형CCTV 이벤트일 경우 */
			if(this.json.statEvetTypCd == "지능형CCTV"){
				var deviceId = etcCntn.devSerial;
				var cctvLoc = [{ "x" : "127.03269223340008", "y" : "37.48359350193925" }];
				_common.callAjax("/cctv/getCctv.json", { "deviceId" : deviceId }, function(json){
					if(json.result.length > 0){
						cctvLoc[0].x = "" + json.result.lng;
						cctvLoc[0].y = "" + json.result.lat;

						if(json.result != null){
							$("#tabs").find(".tab[target=eventView]").click();
							var _cctv = {
								gid : json.result.gid,
								mgrNo : json.result.mgrNo,
								gbnCd : json.result.gbnCd,
								angle : json.result.viewDir,
								cctvNm : json.result.cctvNm,
								channelNo : json.result.chnlNo,
								deviceId : json.result.deviceId,
								stateCd : json.result.stateCd,
								point : Spatial.convertProjection([json.result.lng, json.result.lat], "EPSG:4326", "EPSG:5186")
							};
							var _cnt = xeusCCTV.cctv.getVideoDialogCount();
							var _isPreview = false;

							if(sysConfirm("지능형CCTV 이벤트를 수신하였습니다.\nCCTV를 재생하시겠습니까?\n\n대상 : " + _cctv["cctvNm"])){
								xeusCCTV.cctv.createVideoDialog(_cctv, _cnt, _isPreview);
								xeusCCTV.cctv.reload();
								xeusSymbol.addPlay(_cctv["point"], _cctv["gid"]);
							};
						}
					}

				}, false);
				this.json.outbPos = cctvLoc;
			}

			var outbPos = this.json.outbPos[0];
			var center = Spatial.convertProjection([Number(outbPos.x), Number(outbPos.y)], "EPSG:4326", "EPSG:5186");

			if(this.json.isNotExternal){

				/* CCTV 제어 이벤트일 경우 */
				if(this.json.statEvetTypCd == "CCTVLOCK"){

				}

				/* CCTV 영상공유 이벤트일 경우 */
				if(this.json.statEvetTypCd == "CCTVSHER"){
					GMXCCTV.createSinglePlayer(JSON.parse(JSON.stringify(etcCntn)));

					if(("GMXMAP" in window) && ("addMapNotification" in window.GMXMAP)){
						GMXMAP.addMapNotification("영상 공유 이벤트를 수신하여 영상을 자동 재생합니다.", 5000);
					}
				}

				/* 선영상재생 이벤트일 경우 */
				if(this.json.statEvetTypCd == "CCTVPREV"){
					// 다른곳으로 이동 완료
				}

			}else{
				
				/* 비상벨 이벤트일 경우 */
				if(this.json.statEvetTypCd == "BELL"){
					
					var mgrNo = etcCntn.cctvMgrNo;
					_common.callAjax("/cctv/getCctvList.json", { "mgrNo" : mgrNo }, function(json){
						if(json.result.length > 0){
							GMXCCTV.createSinglePlayer({
								gid : json.result[0].gid,
								mgrNo : json.result[0].mgrNo,
								gbnCd : json.result[0].gbnCd,
								angle : json.result[0].viewDir,
								cctvNm : json.result[0].cctvNm,
								channelNo : json.result[0].chnlNo,
								deviceId : json.result[0].deviceId,
								stateCd : json.result[0].stateCd,
								//point : Spatial.convertProjection([json.result[0].lng, json.result[0].lat], "EPSG:4326", "EPSG:5186")
							});

							if(("GMXMAP" in window) && ("addMapNotification" in window.GMXMAP)){
								GMXMAP.addMapNotification("비상벨 이벤트를 수신하여 영상을 자동 재생합니다.", 5000);
							}
						}
					});

				}

				/* 문제차량 이벤트일 경우 */
				if(this.json.statEvetTypCd == "CAR"){

				}

			}
		}

		if(this.json.statEvetTypCd == "IOTFIRE"){
			if(evetPin){
				if($("#evetPinBtn").length == 1){
					$("#evetPinBtn").click();
				}else{
					window.evetPin = false;
				}
			}
		}

		if(!("evetPin" in window)) window.evetPin = true;

		if(!evetPin){
			this.move(null, _Map);
			$("#alram").trigger("play");
		}
		
		WIDGET.getEventListWidget();
		return this;
	},

	/**
	 * 이벤트를 종료합니다.
	 * 현재 보고있는 이벤트 상세정보와 발생한 이벤트의 ID가 동일할경우,
	 * 벡터 클리어 및 CCTV 종료를 요청합니다.
	 *
	 * @returns {___anonymous_xeusJsonParser}
	 */
	Stop : function(){
		WIDGET.getEventListWidget();

		var uSvcOutbId = $("#ctntTable").attr("uSvcOutbId");
		if(xeusJsonParser.getJson().uSvcOutbId == uSvcOutbId){
			//_common.callAjax("/Socket.json", { "typ" : "close" }, function(){});
			if(("eventVectorLayer" in GMXMAP) && GMXMAP["eventVectorLayer"].getSource()) GMXMAP["eventVectorLayer"].getSource().clear();
			Spatial.stopInterval();
			/*$("#btn-map-cler").click();
			$("#btn-map-home").click();*/
			$("#ctntTable").find(".ctntTd").html("");
		}

		var outbPos = this.json.outbPos[0];
		var center = Spatial.convertProjection([Number(outbPos.x), Number(outbPos.y)], "EPSG:4326", "EPSG:5186");

		/*if(this.json.statEvetTypCd == "CCTVLOCK"){
			var etcCntn = "";
			if(this.json.etcCntn != "" && this.json.etcCntn != null){
				if(typeof this.json.etcCntn == "string") etcCntn = JSON.parse(this.json.etcCntn);
				if(typeof this.json.etcCntn == "object") etcCntn = this.json.etcCntn;
			}
			xeusSymbol.removeFeature(etcCntn.gid, "isLock");
		}*/
		if(this.json.statEvetTypCd == "CCTVSHER"){
			var etcCntn = "";
			if(this.json.etcCntn != "" && this.json.etcCntn != null){
				if(typeof this.json.etcCntn == "string") etcCntn = JSON.parse(this.json.etcCntn);
				if(typeof this.json.etcCntn == "object") etcCntn = this.json.etcCntn;
			}
			$("button.close_" + etcCntn.mgrNo).click();
		}

		if(this.json.statEvetTypCd == "CCTVPREVREQ"){
			var etcCntn = "";
			if(this.json.etcCntn != "" && this.json.etcCntn != null){
				if(typeof this.json.etcCntn == "string") etcCntn = JSON.parse(this.json.etcCntn);
				if(typeof this.json.etcCntn == "object") etcCntn = this.json.etcCntn;
			}

			if(etcCntn.response === true){
				if(("GMXMAP" in window) && ("addMapNotification" in window.GMXMAP)){
					GMXMAP.addMapNotification("CCTV 재생 요청이 승인되어 자동 재생합니다.", 3000);
				}

				var cctvData = etcCntn.cctv;
				
				if(("isNet" in cctvData) && cctvData.isNet === true){
					GMXCCTV.startNetMornitoring(cctvData, cctvData.isPreview);
				}else{
					if(cctvData instanceof Array){
						GMXCCTV.createGridPlayer(cctvData);
					}else if("addGrid" in cctvData && cctvData.addGrid){
						GMXCCTV.addGridPlayer(cctvData);
					}else{
						GMXCCTV.createSinglePlayer(cctvData);
					}
				}

			}else{
				alert("CCTV 재생 요청이 거부되었습니다.");
			}
		}

		return this;
	},

	/**
	 * 모의 테스트 여부를 리턴합니다.
	 *
	 * @returns {Boolean}
	 */
	isTest : function(){
		if(Boolean(this.json.isTest)){
			return true;
		}else{
			return false;
		}
	},

	/**
	 * 이벤트 여부를 리턴합니다.
	 *
	 * @returns {Boolean}
	 */
	isStart : function(){
		if(this.json.procSt == "10"){
			return true;
		}else{
			return false;
		}
	},

	/**
	 * 이벤트 정보변경여부를 리턴합니다.
	 *
	 * @returns {Boolean}
	 */
	isChange : function(){
		if(this.json.procSt == "40"){
			return true;
		}else{
			return false;
		}
	},

	/**
	 * 이벤트 종료 여부를 리턴합니다.
	 *
	 * @returns {Boolean}
	 */
	isEnd : function(){
		if(this.json.procSt == "50" || this.json.procSt == "90" || this.json.procSt == "91"){
			return true;
		}else{
			return false;
		}
	},

	/**
	 * 타겟 그룹을 리턴합니다.
	 *
	 * @returns
	 */
	getTargetGrp : function(){
		var result = this.json.targetGrp;
		if(result == null) result = "";
		if(result == "null") result = "";
		return result;
	},

	/**
	 * 이벤트 타입을 리턴합니다. (112, 119, DSC, CCTVLOCK, CCTVSHRE)
	 *
	 * @returns
	 */
	getStatEvetTypCd : function(){ return this.json.statEvetTypCd; },

	/**
	 * 이벤트 단계를 한글로 리턴합니다.
	 *
	 * @returns {Boolean}
	 */
	getProcSt : function(){
		if(this.json.procSt == "10"){
			return "발생";
		}else if(this.json.procSt == "40"){
			return "변경";
		}else if(this.json.procSt == "50"){
			return "해제";
		}else if(this.json.procSt == "90"){
			return "취소";
		}else if(this.json.procSt == "91"){
			return "종료";
		}
	},

	/**
	 * 이벤트 단계를 색깔로 리턴합니다.
	 *
	 * @returns {Boolean}
	 */
	getProcStColor : function(){
		if(this.json.procSt == "10"){
			return "red";
		}else if(this.json.procSt == "40"){
			return "gray";
		}else if(this.json.procSt == "50"){
			return "green";
		}else if(this.json.procSt == "90"){
			return "green";
		}else if(this.json.procSt == "91"){
			return "green";
		}
	},

	/**
	 * 이벤트 상태를 리턴합니다.
	 *
	 * @returns {Boolean}
	 */
	getProcStCd : function(){ return this.json.procSt },

	/**
	 * 이벤트 발생일시를 리턴합니다.
	 *
	 * @returns {String}
	 */
	getYmd : function(){ return this.json.statEvetOutbDtm; },

	/**
	 * 이벤트 주소를 리턴합니다.
	 *
	 * @returns {String}
	 */
	getAddr : function(){ return this.json.outbPosNm; },

	/**
	 * 이벤트 경위도를 리턴합니다.
	 *
	 * @returns {String}
	 */
	getXY : function(){ return this.json.outbPos[0]; },

	/**
	 * 이벤트 타입을 리턴합니다.
	 *
	 * @returns {String}
	 */
	getEventType : function(){ return this.json.statEvetNm; },

	/**
	 * 이벤트 유형을 리턴합니다.
	 *
	 * @returns {String}
	 */
	getEventParentType : function(){ return this.json.statEvetType; },

	/**
	 * 이벤트 내용을 리턴합니다.
	 *
	 * @returns {String}
	 */
	getEventMsg : function(){ return this.json.statEvetCntn; },

	/**
	 * 트레이스ID를 리턴합니다.
	 *
	 * @returns {String}
	 */
	getUSvcOutbId : function(){ return this.json.uSvcOutbId; },

	/**
	 * 이벤트 발생위치를 리턴합니다.
	 * 데이터 구조는 배열이나, 1개만 등록됩니다.
	 * 또한 경위도를 TM으로 변경하여 리턴합니다.
	 *
	 * @returns {Array}
	 */
	getEventLocation : function(json){
		var locArray = this.json.outbPos;
		if(json) locArray = json.outbPos;
		var xy = new Array();
		for(var i=0; i<locArray.length; i++){
			var lonlat = [Number(locArray[i].x), Number(locArray[i].y)];
			//var tm = Spatial.convertProjection(lonlat, "EPSG:4326", xeusLayout.mapService.getMap().getView().getProjection().getCode());
			var tm = Spatial.convertProjection(lonlat, "EPSG:4326", "EPSG:5186");
			xy.push(tm);
		}
		return xy;
	},

	/**
	 * 이벤트 컨텐츠를 변경합니다.
	 *
	 * @returns {Array}
	 */
	setEventContent : function(json){
		var _Json = this.json;
		if(json) _Json = json;

		var statEvetTypeNm = _Json.statEvetTypCd + " / ";
			
		if(_Json.statEvetTypCd == "DSC") statEvetTypeNm = "";
		if(_Json.statEvetTypCd == "BELL") statEvetTypeNm = "";
		if(_Json.statEvetTypCd == "CAR") statEvetTypeNm = "";
		if(_Json.statEvetTypCd == "MBS") statEvetTypeNm = "";
		if(_Json.statEvetTypCd == "GUL") statEvetTypeNm = "";

		var targetStatEvetNm = $("#targetStatEvetNm").is(":checked");
		var targetStatEvetOutbDtm = $("#targetStatEvetOutbDtm").is(":checked");
		var targetOutbPos = $("#targetOutbPos").is(":checked");

		if($("#targetStatEvetNm").length > 0){
			if(!targetStatEvetNm){
				$("#statEvetNm").hide();
				$("#statEvetNm").prev().hide();
			}else{
				$("#statEvetNm").show();
				$("#statEvetNm").prev().show();
			}
		}

		if($("#targetStatEvetOutbDtm").length > 0){
			if(!targetStatEvetOutbDtm){
				$("#statEvetOutbDtm").hide();
				$("#statEvetOutbDtm").prev().hide();
			}else{
				$("#statEvetOutbDtm").show();
				$("#statEvetOutbDtm").prev().show();
			}
		}

		if($("#targetOutbPos").length > 0){
			if(!targetOutbPos){
				$("#outbPosX, #outbPosY, #outbPosNm").hide();
				$("#outbPosX, #outbPosY, #outbPosNm").prev().hide();
			}else{
				$("#outbPosX, #outbPosY, #outbPosNm").show();
				$("#outbPosX, #outbPosY, #outbPosNm").prev().show();
			}
		}

		if(_Json.statEvetTypCd != "MBS"){
			$("#ctntTable").data(_Json);
			$("#ctntTable").attr("uSvcOutbId", _Json.uSvcOutbId);
			$("#ctntTable").find("#statEvetNm").text(statEvetTypeNm + _Json.statEvetNm);
			$("#ctntTable").find("#statEvetOutbDtm").text(new Date().formatYMDHMS(_Json.statEvetOutbDtm.substring(0, 14)));
			// var outbPosString = _Json.outbPos[0].x + " / " + _Json.outbPos[0].y;
			var outbPosString = parseFloat(_Json.outbPos[0].x).toFixed(8) + " / " + parseFloat(_Json.outbPos[0].y).toFixed(8); // 소수점 8자리
		    $("#ctntTable").find("#outbPosCoord").text(outbPosString);
			$("#ctntTable").find("#outbPosNm").text(_Json.outbPosNm);
			$("#ctntTable").find("#statEvetCntn").html(_Json.statEvetCntn);
		}
		$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").show();

		if(_Json.statEvetTypCd == "CAR"){
			var prop = _Json.etcCntn;

			var imgParam = "?ftpIp=" + prop.ftpIp;
			imgParam += "&ftpPort=" + prop.ftpPort;
			imgParam += "&ftpUser=" + prop.ftpUser;
			imgParam += "&ftpPwd=" + prop.ftpPwd;
			imgParam += "&ftpPath=" + prop.ftpPath;
			imgParam += "&filenm=" + prop.filenm;

			var $tbl = $("<div></div>");
			$tbl.append("<h3 class='title'>문제차량 상세정보</h3>");
			var $tbl2 = $("<div class='box_style'></div>");
			$tbl2.append("<div class='info_box'><span class='title'>대상CCTV</span><p class='content'>" + prop.cctvNm + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>발견시간</span><p class='content'>" + new Date().formatYMDHMS(prop.time) + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>문제사유</span><p class='content'>" + prop.type + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>차량번호</span><p class='content'>" + prop.carnum + "</p></div>");
			$tbl2.append("<div class='info_box wd100'><span class='title'>차량사진</span><p class='content'><img src='../monitor/getFtpCarImg.do" + imgParam + "'></p></div>");

			$tbl.append($tbl2);

			$("#ctntTable").find("#statEvetCntn").html($tbl);

			$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").hide();
		}

		if(_Json.statEvetTypCd == "IOTFIRE"){

			var prop = _Json.etcCntn;

			var originText = $("#ctntTable").find("#statEvetCntn").text();
			var residentName = prop.residentName;
			var residentPhone = prop.residentPhone;

			var $tbl = $("<div></div>");
			$tbl.append("<h3 class='title'>화재감시센서 이벤트 상세정보</h3>");
			var $tbl2 = $("<div class='box_style'></div>");
			$tbl2.append("<div class='info_box'><span class='title'>내용</span><p class='content'>" + originText + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>거주자이름</span><p class='content'>" + residentName + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>거주자연락처</span><p class='content'>" + residentPhone + "</p></div>");
			$tbl2.append("<div class='info_box'><button class='btn_Gstyle' id='stopIotFireEvent' key='" + _Json.uSvcOutbId + "'>화재이벤트 종료 요청</button></div>");

			$tbl.append($tbl2);

			if($("#iotFireDialog").length > 0) $("#iotFireDialog").dialog("destroy");
			var $fireAlram = $("<audio id='fireAlram' loop autoplay class='hidden'><source src='./res/sound/fire.mp3' type='audio/mpeg'></audio>");
			var $fireDialog = $("<div id='iotFireDialog' title='화재 발생 알림'><p style='text-align:center;'><img src='./res/img/fire.png'/><br><br>화재 이벤트를 수신하였습니다.</p></div>").dialog({
				open : function(){
					$("#iotFireDialog").append($fireAlram);
					$("#iotFireDialog").prev().find(".ui-dialog-title");

					var duration = 300;
					for(var i=0; i<50; i++){
						$("#iotFireDialog").animate({"background-color" : "#FF0000"}, duration);
						$("#iotFireDialog").animate({"background-color" : "#303035"}, duration);
					}
				},
				close : function(){
					$fireAlram.trigger("pause");
					$fireDialog.dialog("destroy");
				}
			});

			$tbl.find("#stopIotFireEvent").click(function(){
				var eventkey = $(this).attr("key");
				var result = "";

				confirm("종료 이벤트를 요청하시겠습니까?", function(){
					_common.callAjax("/api/fireProxy.jsp", { "uSvcOutbId" : eventkey }, function(json){
						if(json.result){
							alert("종료 요청을 성공하였습니다.");
						}
					});
					/*$.ajax({
						type : "GET",
						url : Proxy + "https://public-safety.unetconv.co.kr/fire/api/ucity/event/" + eventkey + "/clear",
						data : {},
						async : false,
						beforeSend : function(xhr){
							xhr.setRequestHeader("aKey", "ke/BEV+ISruZTGOyHtOdIXENzIruDYr7lCgb+PurOYL2KFK/um9mHhBoSQGQxO5+dk462FO9kqBdU0kbLgm64A==");
						},
						success : function(json){
							alert("종료 요청이 완료되었습니다.");

							$fireAlram.trigger("pause");
							$fireDialog.dialog("destroy");
						},
						error : function(){
							alert("종료 요청에 실패하였습니다.");

							$fireAlram.trigger("pause");
							$fireDialog.dialog("destroy");
						}
					});*/
				});
			});

			var dist = 500;
			_common.callAjax("/cctv/getNearCctv.json", { "srid" : "4326", "lon" : _Json.outbPos[0].x, "lat" : _Json.outbPos[0].y, "dist" : dist, "ptzCctv" : true }, function(json){
				if(json.result){
					$("#tabs").find(".tab[target=eventView]").click();
					var _cctv = {
						gid : json.result.gid,
						mgrNo : json.result.mgrNo,
						gbnCd : json.result.gbnCd,
						angle : json.result.viewDir,
						cctvNm : json.result.cctvNm,
						channelNo : json.result.chnlNo,
						deviceId : json.result.deviceId,
						stateCd : json.result.stateCd,
						point : Spatial.convertProjection([json.result.lng, json.result.lat], "EPSG:4326", "EPSG:5186")
					};

					var _cnt = xeusCCTV.cctv.getVideoDialogCount();
					var _isPreview = false;

					xeusCCTV.cctv.createVideoDialog(_cctv, _cnt, _isPreview);
					xeusCCTV.cctv.reload();
					xeusSymbol.addPlay(_cctv["point"], _cctv["gid"]);
				}else{
					alert("화재 발생장소 반경(" + dist + "M)내에 CCTV가 존재하지 않습니다.");
				}
			});

			$("#ctntTable").find("#statEvetCntn").html($tbl);

			$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").hide();
		}

		if(_Json.statEvetTypCd == "S112"){
			var prop = _Json.etcCntn;

			var $tbl = $("<div></div>");
			$tbl.append("<h3 class='title'>112긴급출동지원서비스 상세정보</h3>");
			var $tbl2 = $("<div class='box_style'></div>");
			$tbl2.append("<div class='info_box'><span class='title'>본부소속코드</span><p class='content'>" + prop.ADDR_CD + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>112긴급지원유형</span><p class='content'>" + prop["112_TY_CD"] + "</p></div>");
			$tbl2.append("<div class='info_box wd100'><span class='title'>112긴급도</span><p class='content'>" + prop["112_GRADE"] + "</p></div>");

			$tbl.append($tbl2);

			$("#ctntTable").find("#statEvetCntn").html($tbl);

			$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").hide();
		}

		if(_Json.statEvetTypCd == "S119"){
			var prop = _Json.etcCntn;

			var $tbl = $("<div></div>");
			$tbl.append("<h3 class='title'>119긴급출동지원서비스 상세정보</h3>");
			var $tbl2 = $("<div class='box_style'></div>");
			$tbl2.append("<div class='info_box wd100'><span class='title'>119긴급지원유형</span><p class='content'>" + prop["119_TY_CD"] + "</p></div>");

			$tbl.append($tbl2);

			$("#ctntTable").find("#statEvetCntn").html($tbl);

			$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").hide();
		}

		if(_Json.statEvetTypCd == "SWPS"){
			var prop = _Json.etcCntn;

			var $tbl = $("<div></div>");
			$tbl.append("<h3 class='title'>사회적약자지원서비스 상세정보</h3>");
			var $tbl2 = $("<div class='box_style'></div>");
			$tbl2.append("<div class='info_box'><span class='title'>사회적약자서비스유형</span><p class='content'>" + prop.WP_SVC_TY + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>지역코드</span><p class='content'>" + prop.AREA_CD + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>사회역약자 REFID</span><p class='content'>" + prop.WP_REF_ID + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>대상자성명</span><p class='content'>" + prop.MISSING_NM + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>연락번호</span><p class='content'>" + prop.CONTACTNUM + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>생년월일</span><p class='content'>" + prop.BIRTHDAY + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>성별</span><p class='content'>" + prop.SEX + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>대상자주소기본</span><p class='content'>" + prop.MISSING_ADDRESS + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>보호자명</span><p class='content'>" + prop.PROTECTOR_NM + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>보호자연락처</span><p class='content'>" + prop.PROTECTOR_NUM + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>대상자신상정보</span><p class='content'>" + prop.MISSING_UNUSUAL + "</p></div>");
			$tbl2.append("<div class='info_box'><span class='title'>대상자인상착의 기타정보</span><p class='content'>" + prop.MISSING_ETC + "</p></div>");
			$tbl2.append("<div class='info_box wd100'><span class='title'>참고사진</span><p class='content'><img src='" + prop.IMAGE_URL + "'></p></div>");

			$tbl.append($tbl2);



			$("#ctntTable").find("#statEvetCntn").html($tbl);

			$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").hide();
		}

		if(_Json.statEvetTypCd == "SMOJ"){
			/* var prop = _Json.etcCntn;

			var $tbl = $("<table></table>");
			$tbl.append("<tr><th colspan='2'>전자발찌위치추적지원서비스 상세정보</th></tr>");
			$tbl.append("<tr><td><img src='" + prop.snapshot + "'></td></tr>");

			$("#ctntTable").find("#statEvetCntn").html($tbl);

			$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").hide(); */
		}

		if(_Json.statEvetTypCd == "지능형CCTV"){
			var prop = _Json.etcCntn;

			var $tbl = $("<div></div>");
			$tbl.append("<h3 class='title'>사진정보</h3>");
			var $tbl2 = $("<div class='box_style'></div>");
			$tbl2.append("<div class='info_box wd100'><span class='title'>참고사진</span><p class='content'><img src='" + prop.snapshot + "'></p></div>");

			$tbl.append($tbl2);

			$("#ctntTable").find("#statEvetCntn").html($tbl);

			$("#eventView").find(".searchWrapper").find(".btnDiv").find("#addBtn, #editBtn").hide();
		}

		if(_Json.statEvetTypCd == "CCTVPREVREQ"){
			var etcCntn = _Json.etcCntn;

			var _cctv;
			var isMultiple = false;
			if(etcCntn.cctv instanceof Array){
				isMultiple = true;
				_cctv = etcCntn.cctv[0];
			}else{
				_cctv = etcCntn.cctv;
			}

			if(_Json["tmx"] == "null" || _common.utils.isNullAndEmpty(_Json["tmx"])){
				var tm = Spatial.convertProjection([Number(_Json["outbPos"][0].x), Number(_Json["outbPos"][0].y)], "EPSG:4326", "EPSG:5186");
				_Json["tmx"] = tm[0];
				_Json["tmy"] = tm[1];
			}

			var $okBtn = $("<button class='btn_style'>승인</button>").click(function(){

				if(confirm("승인하시겠습니까?")){
					_Json["targetId"] = etcCntn.userId;
					_Json.statEvetOutbDtm = new Date().getYMDHMS();
					_Json.statEvetClrDtm = new Date().getYMDHMS();
					_Json.statEvetActnMn = userId;
					_Json.procSt = "91";

					_Json.statEvetActnCntn = "승인자(" + userId + ")가 요청자(" + etcCntn.userId + ")의 영상 재생을 승인하였습니다.";
					_Json.etcCntn = JSON.stringify({ "response" : true, "cctv" : etcCntn.cctv });

					_common.callAjax("/ws/addEvent.json", { "json" : JSON.stringify(_Json) }, function(_json){
						if(_json.result) $("#evtTable").find("tr[k=" + _Json.uSvcOutbId + "]").remove();

						var param = {
							reqUserId : etcCntn.userId,
							reqResn : etcCntn.reqResn,
							acciNum : etcCntn.acciNum,
							reqDat : etcCntn.reqDat,
							cctvMgrNo : etcCntn.mgrNo
						}
						_common.callAjax("/cctvPreview/getList.json", param, function(prev){
							param["acptNm"] = userId;
							for(var i=0; i<prev.result.length; i++){
								param["mgrSeq"] = prev.result[i].mgrSeq;
								_common.callAjax("/cctvPreview/edit.json", param, function(){});
							}
						}, false);
					}, false);
				}

				// 암호 인증이 필요할 경우 사용
				/*var _html = '';
				_html += '<div id="previewInfo" class="table_style customScroll" style="display: none;"> ';
				_html += '    <table> ';
				_html += '      <tbody> ';
				_html += '        <tr> ';
				_html += '            <th width="200"><label>비밀번호</label></th> ';
				_html += '            <td><input type="password" class="sendData wide" id="usrPwd"></td> ';
				_html += '        </tr> ';
				_html += '      </tbody> ';
				_html += '    </table> ';
				_html += '    <button id="saveBtn" class="btn_style">승인</button> ';
				_html += '</div> ';

				$("#parentBody").append(_html);

				$("#previewInfo").dialog({
					title: "영상 재생 승인 (승인자 본인 확인)",
					modal: true,
					resizable: false,
					width: 700,
					height: 200,
					position: {
						my: "center center",
						at: "center center",
						of: $("#map")
					},
					open: function(){
						if(confirm("승인하시겠습니까?")){
							$('#previewInfo').find('#saveBtn').click(function(){
								var usrPwd = $("#previewInfo").find("#usrPwd").val();
								_common.callAjax("/user/checkPassword.json", { "userPwd" : usrPwd }, function(pwd){
									if(pwd.result){
										_Json["targetId"] = etcCntn.userId;
										_Json.statEvetOutbDtm = new Date().getYMDHMS();
										_Json.statEvetClrDtm = new Date().getYMDHMS();
										_Json.statEvetActnMn = userId;
										_Json.procSt = "91";

										_Json.statEvetActnCntn = "사용자(" + userId + ")가 CCTV(명칭 : " + etcCntn.cctvNm + ") 선영상재생을 승인하였습니다.";
										_Json.etcCntn = JSON.stringify({ "response" : "true", "cctv" : etcCntn.cctv });

										_common.callAjax("/ws/addEvent.json", { "json" : JSON.stringify(_Json) }, function(_json){
											if(_json.result) $("#eventView").find("#evtTable").find("tr[k=" + _Json.uSvcOutbId + "]").remove();

											var param = {
													reqUserId : etcCntn.userId,
													reqResn : etcCntn.reqResn,
													acciNum : etcCntn.acciNum,
													reqDat : etcCntn.reqDat,
													cctvMgrNo : etcCntn.mgrNo
											}
											_common.callAjax("/cctvPreview/getList.json", param, function(prev){
												param["acptNm"] = userId;
												for(var i=0; i<prev.result.length; i++){
													param["mgrSeq"] = prev.result[i].mgrSeq;
													_common.callAjax("/cctvPreview/edit.json", param, function(){});
												}
											}, false);
										}, false);

										$('#previewInfo').bPopup().close();
										$('#previewInfo').remove();
									}
								}, false);
							});
						}
					},
					close: function(){
						$("#previewInfo").dialog("destroy");
						$("#previewInfo").remove();
					}
				}).parent().draggable({
					containment: "#map",
					scroll: false
				});*/

			});

			var $cnBtn = $("<button class='btn_Gstyle'>거부</button>").click(function(){
				if(confirm("거부하시겠습니까?")){
					$('#previewInfo').bPopup().close();
					$('#previewInfo').remove();

					_Json["targetId"] = etcCntn.userId;
					_Json.statEvetOutbDtm = new Date().getYMDHMS();
					_Json.statEvetClrDtm = new Date().getYMDHMS();
					_Json.statEvetActnMn = userId;
					_Json.procSt = "91";

					_Json.statEvetActnCntn = "승인자(" + userId + ")가 요청자(" + etcCntn.userId + ")의 영상 재생을 거부하였습니다.";
					_Json.etcCntn = JSON.stringify({ "response" : false, "cctv" : etcCntn.cctv });

					_common.callAjax("/ws/addEvent.json", { "json" : JSON.stringify(_Json) }, function(_json){
						if(_json.result) $("#evtTable").find("tr[k=" + _Json.uSvcOutbId + "]").remove();
					});
				}
			});

			var $table = $("<table>").append("<tr>").append($("<td>").append($cnBtn)).append($("<td>").append($okBtn));

			$("#ctntTable").find("#statEvetCntn").append($table);

		}

		if(_Json.statEvetTypCd == "MBS"){
			$("#ctntTable").find("#mobileShareCctvNm").html(_Json.cctvNm);
			$("#ctntTable").find("#mobileShareUrl").html(_Json.streamUrl);
			$("#ctntTable").find("#mobileShareToken").html(_Json.token);
		}
	},

	/**
	 * 이벤트 발생위치로 이동합니다.
	 */
	move : function(json, _Map){
		GMXMAP.reloadLayerData('v_mon_evet_blackice');
		var _JSON = this.json;
		var center = this.getEventLocation()[0];
		if(json){
			_JSON = json;
			center = this.getEventLocation(json)[0];
		}
		if(center[0] > 0 && center[1] > 0){
			this.setEventContent(_JSON);

			var lnglat = Spatial.convertProjection(center, "EPSG:5186", "EPSG:4326");
			var addr = Spatial.convertXYToAddr(lnglat[0], lnglat[1]);
			if(addr == "error") addr = "";

			var point = new ol.Feature(new ol.geom.Point(center));
			point.setStyle(new ol.style.Style({
				image : new ol.style.Icon(({
					src: "./res/sym/sb2_1.png"
				})),
				text : new ol.style.Text({
					text: addr,
					textAlign: "center",
					textBaseline: "hanging",
					offsetY: 30,
					font: "bold 15px arial",
					fill: new ol.style.Fill({
						color: "blue"
					}),
					stroke: new ol.style.Stroke({
						color: "#FFFFFF",
						width: 3
					})
				}),
				zindex: 10000
			}));

			if(!("eventVectorLayer" in GMXMAP)){
				GMXMAP["eventVectorLayer"] = new ol.layer.Vector({
					source: new ol.source.Vector(),
					zIndex: 9999
				});
			}
			GMXMAP["eventVectorLayer"].getSource().clear();
			GMXMAP["eventVectorLayer"].getSource().addFeature(point);

			/* 3분 반경 */
			/*var zoom = 19;
			_common.callAjax("/auth/hasAuth.json", { "authData" : "CCTVPREVIEW" }, function(json){
				var isPreview = json.result;
				if(isPreview || _JSON.statEvetTypCd == "IOTFIRE"){
					var circle = new ol.Feature(new ol.geom.Circle(center, 500));
					circle.setId("isPrevBuffer");
					circle.setStyle(new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: 'red',
							width: 2
						}),
						fill: new ol.style.Fill({
							color: "rgba(255, 0, 0, 0.1)"
						}),
						image: new ol.style.Circle({
							radius: 500,
							width: 2
						})
					}));

					GMXMAP["eventVectorLayer"].getSource().addFeature(circle);
					zoom = 17;
				}
			}, false);*/


			GMXMAP.addPulse(center, true, 10);

			if(_JSON.statEvetTypCd == "IOTFIRE"){
				if(!window.evetPin){
					if($("#evetPinBtn").length == 1){
						$("#evetPinBtn").click();
					}else{
						window.evetPin = true;
					}
				}
			}
		}else{
			var date = new Date();
			try {
				console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json > outbPos(" + _JSON.outbPos.toString() + ") Error.");
			} catch (e) {
				console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json > outbPos Error.");
			}
		}
	}

}