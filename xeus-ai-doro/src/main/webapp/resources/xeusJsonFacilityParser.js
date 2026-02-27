/**
 *
 */
var xeusJsonFacilityParser = {

	/**
	 * Socket > GIS Json Body 입니다.
	 */
	json : null,

	/**
	 * Json Body 를 상단 Json 객체에 Binding 합니다.
	 *
	 * @param json
	 * @returns {___anonymous_xeusJsonParser}
	 */
	setJson : function(json){

		this.json = json;

		try {
			this.json = JSON.parse(this.json);
		} catch (e) {
			var date = new Date();
			console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json Parse Error.");
			console.log(e.data);
		}

		return this;
	},

	/**
	 * Json 을 리턴합니다.
	 *
	 * @returns {___anonymous111_1152}
	 */
	getJson : function(){ return this.json; },


	getTbody : function(Json, Format){
		var $tbody = $("<tbody></tbody>");

		for(var key in Json){
			var $tr = $("<tr></tr>");
			var $td1 = $("<th key='" + key + "'>" + key + "</th>").width(130);
			var $td2 = $("<td key='" + key + "'>" + Json[key] + "</td>").css("padding-left", "10px");

			$tr.append($td1).append($td2);
			$tbody.append($tr);
		}

		if(Format){
			for(var key in Format){
				$tbody.find("th[key=" + key + "]").text(Format[key]);
			}
		}

		return $tbody;
	},


	getBlackBox : function(){
		var Json = this.getJson();

		var format = {
			"id"		 : "관리번호",
			"address"	 : "주소(위치)",
			"latitude"	 : "위도",
			"longitude"	 : "경도",
			"commStatus" : "통신상태",
			"operStatus" : "동작상태",
			"hddUsage"	 : "HDD사용율",
			"doorOpen"	 : "문열림",
			"statusCode" : "단말기 상태코드"
		}

		var $tbody = this.getTbody(Json, format);

		var $commStatus = $tbody.find("td[key=commStatus]");
		if($commStatus.text() == "Y") $commStatus.text("정상");
		if($commStatus.text() == "N") $commStatus.text("비정상");

		var $operStatus = $tbody.find("td[key=operStatus]");
		if($operStatus.text() == "") 	$operStatus.text("정보없음");
		if($operStatus.text() == "o00") $operStatus.text("정상");
		if($operStatus.text() == "o01") $operStatus.text("Network 오류");
		if($operStatus.text() == "o02") $operStatus.text("File I/O 오류");
		if($operStatus.text() == "o03") $operStatus.text("수신이상");
		if($operStatus.text() == "o04") $operStatus.text("응답없음");

		var $hddUsage = $tbody.find("td[key=hddUsage]");
		if(_common.utils.isNullAndEmpty($hddUsage.text()))  $hddUsage.text("정보없음");
		if(!_common.utils.isNullAndEmpty($hddUsage.text())) $hddUsage.text($hddUsage.text() + "%");

		var $doorOpen = $tbody.find("td[key=doorOpen]");
		if($doorOpen.text() == "Y") $doorOpen.text("문열림");
		if($doorOpen.text() == "N") $doorOpen.text("문닫힘");

		var $statusCode = $tbody.find("td[key=statusCode]");
		if($statusCode.text() == "R") $statusCode.text("수신이상");
		if($statusCode.text() == "Y") $statusCode.text("상태이상");
		if($statusCode.text() == "P") $statusCode.text("문열림");
		if($statusCode.text() == "G") $statusCode.text("정상");

		$(".contentWrapper").find("#detailTable").html($tbody);
	},


	getLoRA : function(){
		var Json = this.getJson();

		var format = {
			"mgrNo"			: "관리번호",
			"gwId"			: "장비식별번호",
			"gwName"		: "시설명",
			"recvDat"		: "수신일자",
			"alarmStatus"	: "장비상태"
		}

		var $tbody = this.getTbody(Json, format);

		var $alarmStatus = $tbody.find("td[key=alarmStatus]");
		if(Number($alarmStatus.text()) == 0) $alarmStatus.text("장애");
		if(Number($alarmStatus.text()) == 1) $alarmStatus.text("정상");

		var $recvDat = $tbody.find("td[key=recvDat]");
		$recvDat.text(new Date().formatDate($recvDat.text()));

		$(".contentWrapper").find("#detailTable").html($tbody);
	},


	getPump : function(){
		var Json = this.getJson();

		var format = {
			"mgrNo"			: "관리번호",
			"pumpjangCode"	: "펌프장ID",
			"onPump"		: "펌프장 가동 수",
			"inLevel"		: "내수위",
			"outLevel"		: "외수위",
			"pumpjangName"	: "펌프장명",
			"commSts"		: "통신상태",
			"recvDat"		: "수신날짜"
		}

		var $tbody = this.getTbody(Json, format);

		var $commSts = $tbody.find("td[key=commSts]");
		if(Number($commSts.text()) == 0) $commSts.text("장애");
		if(Number($commSts.text()) == 1) $commSts.text("정상");

		var $recvDat = $tbody.find("td[key=recvDat]");
		$recvDat.text(new Date().formatDate($recvDat.text()));

		$(".contentWrapper").find("#detailTable").html($tbody);
	},


	getRainFall : function(){
		var Json = this.getJson();

		var format = {
			"mgrNo"			: "관리번호",
			"raingaugeCode"	: "강우량계 ID",
			"raingaugeName"	: "강우량계 이름",
			"rainYear"		: "누적강수량",
			"rainDay"		: "일 강수량",
			"rainHour"		: "시간 강수량",
			"rainHourmax"	: "시간최대 강수량",
			"isUse"			: "사용여부",
			"regDate"		: "등록일",
			"commSts"		: "연결상태",
			"recvDat"		: "수신일자"
		}

		var $tbody = this.getTbody(Json, format);

		var $isUse = $tbody.find("td[key=isUse]");
		if($isUse.text() == "Y") $isUse.text("사용");
		if($isUse.text() == "N") $isUse.text("미사용");

		var $commSts = $tbody.find("td[key=commSts]");
		if(Number($commSts.text()) == 0) $commSts.text("장애");
		if(Number($commSts.text()) == 1) $commSts.text("정상");

		var $recvDat = $tbody.find("td[key=recvDat]");
		$recvDat.text(new Date().formatDate($recvDat.text()));

		$(".contentWrapper").find("#detailTable").html($tbody);
	},


	getInfra : function(){
		var Json = this.getJson();
		var $tbody = $("<tbody></tbody>");

		var formatSize = function(x){
			var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
			var e = Math.floor(Math.log(x) / Math.log(1024));

			return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
		};

		var formatComma = function(x){
			return String(x).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
		}

		var str = "";

		/* System */
		var System = Json["system"];
		str += "<tr>";
		str += 		"<th colspan='2'>시스템 정보</th>";
		str += "</tr>";
		if(System){
		str += "<tr>";
		str += 		"<th>설명</th>";
		str += 		"<td>" + System["sysDesc"] + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>시스템명</th>";
		str += 		"<td>" + System["sysName"] + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>시스템날짜</th>";
		str += 		"<td>" + new Date().formatDate(System["sysDate"]) + "</td>";
		str += "</tr>";
		}else{
		str += "<tr>";
		str += 		"<td colspan='2' class='tCenter'>정보가 존재하지 않습니다.</td>";
		str += "</tr>";
		}

		/* Resource CPU */
		var Cpu = null;
		if("cpu" in Json["resource"]) Cpu = Json["resource"]["cpu"];
		str += "<tr>";
		str += 		"<th colspan='2'>CPU 정보</th>";
		str += "</tr>";
		if(Cpu){
		str += "<tr>";
		str += 		"<th>코어 수</th>";
		str += 		"<td>" + Cpu["count"] + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>최근 5분 CPU 사용율</th>";
		str += 		"<td>" + Cpu["cpu5MinLoad"] + "%</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>최근 1분 CPU 사용율</th>";
		str += 		"<td>" + Cpu["cpu1MinLoad"] + "%</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>최근 5초 CPU 사용율</th>";
		str += 		"<td>" + Cpu["cpu5SecLoad"] + "%</td>";
		str += "</tr>";
		}else{
		str += "<tr>";
		str += 		"<td colspan='2' class='tCenter'>정보가 존재하지 않습니다.</td>";
		str += "</tr>";
		}

		/* Resource Memory */
		var Memory = Json["resource"]["memory"];
		if("memory" in Json["resource"]) Memory = Json["resource"]["memory"];
		str += "<tr>";
		str += 		"<th colspan='2'>메모리 정보</th>";
		str += "</tr>";
		if(Memory){
			for(var i=0; i<Memory.length; i++){
		str += "<tr>";
		str += 		"<th>메모리 타입</th>";
		str += 		"<td>" + Memory[i]["desc"] + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>전체 사이즈 byte</th>";
		str += 		"<td>" + formatSize(Memory[i]["size"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>사용 byte</th>";
		str += 		"<td>" + formatSize(Memory[i]["used"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>메모리 사용율</th>";
		str += 		"<td>" + Memory[i]["rate"] + "%</td>";
		str += "</tr>";
			}
		}else{
		str += "<tr>";
		str += 		"<td colspan='2' class='tCenter'>정보가 존재하지 않습니다.</td>";
		str += "</tr>";
		}

		/* Resource Hdd */
		var Hdd = Json["resource"]["hdd"];
		if("hdd" in Json["resource"]) Hdd = Json["resource"]["hdd"];
		str += "<tr>";
		str += 		"<th colspan='2'>하드디스크 정보</th>";
		str += "</tr>";
		if(Hdd){
			for(var i=0; i<Hdd.length; i++){
		str += "<tr>";
		str += 		"<th>메모리 타입</th>";
		str += 		"<td>" + Hdd[i]["desc"] + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>전체 사이즈</th>";
		str += 		"<td>" + formatSize(Hdd[i]["size"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>사용</th>";
		str += 		"<td>" + formatSize(Hdd[i]["used"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>메모리 사용율</th>";
		str += 		"<td>" + Hdd[i]["rate"] + "%</td>";
		str += "</tr>";
			}
		}else{
		str += "<tr>";
		str += 		"<td colspan='2' class='tCenter'>정보가 존재하지 않습니다.</td>";
		str += "</tr>";
		}

		/* Resource Temp */
		var Temp = Json["resource"]["Temp"];
		if("Temp" in Json["resource"]) Temp = Json["resource"]["Temp"];
		str += "<tr>";
		str += 		"<th colspan='2'>장비 온도</th>";
		str += "</tr>";
		if(Temp){
		str += "<tr>";
		str += 		"<th>온도</th>";
		str += 		"<td>" + Temp + " ℃</td>";
		str += "</tr>";
		}else{
		str += "<tr>";
		str += 		"<td colspan='2' class='tCenter'>정보가 존재하지 않습니다.</td>";
		str += "</tr>";
		}

		/* Interface */
		var Interface = Json["interface"];
		str += "<tr>";
		str += 		"<th colspan='2'>인터페이스 정보</th>";
		str += "</tr>";
		if(Interface){
			for(var i=0; i<Interface.length; i++){
				if(Interface[i]["status"] == "up") Interface[i]["status"] = "활성화";
				if(Interface[i]["status"] == "down") Interface[i]["status"] = "비활성화";
		str += "<tr>";
		str += 		"<th colspan='2'>" + (i + 1) + ". " + Interface[i]["desc"] + "</th>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>랜케이블 활성화 여부</th>";
		str += 		"<td>" + Interface[i]["status"] + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>전송 패킷수</th>";
		str += 		"<td>" + formatComma(Interface[i]["outOctets"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>전송 오류 패킷수</th>";
		str += 		"<td>" + formatComma(Interface[i]["outErrors"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>수신 패킷수</th>";
		str += 		"<td>" + formatComma(Interface[i]["inOctets"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>수신 오류 패킷수</th>";
		str += 		"<td>" + formatComma(Interface[i]["inErrors"]) + "</td>";
		str += "</tr>";
		str += "<tr>";
		str += 		"<th>전송속도</th>";
		str += 		"<td>" + formatComma(Interface[i]["speed"]) + "</td>";
		str += "</tr>";
			}
		}else{
		str += "<tr>";
		str += 		"<td colspan='2' class='tCenter'>정보가 존재하지 않습니다.</td>";
		str += "</tr>";
		}

		$tbody.append($(str));
		$tbody.find("th").width(130);
		$tbody.find("td").css("padding-left", "10px");

		$(".contentWrapper").find("#detailTable").html($tbody);
	},
}