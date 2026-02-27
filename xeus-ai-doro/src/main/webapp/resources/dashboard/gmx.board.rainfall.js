/**
 * 강우 정보 API 모듈입니다.
 *
 * @author 민동현
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 60000;
	var _ELEMENT_ID_ = "rainfall";

	var _OBSERVATORY_LIST = [{
			code : "10104020",
			name : "다목초교",
			time : null,
			rainfall : null,
			color : null
		},{
			code : "10104040",
			name : "명월리",
			time : null,
			rainfall : null,
			color : null
		},{
			code : "10104080",
			name : "상승초교",
			time : null,
			rainfall : null,
			color : null
		},{
			code : "10104010",
			name : "화천군청 ",
			time : null,
			rainfall : null,
			color : null
		},{
			code : "10104050",
			name : "화천댐 ",
			time : null,
			rainfall : null,
			color : null
		}
	]

	var _TIME_TYPE = "1H";
	var _API_KEY_ = "1893949F-56CC-48A9-98EC-7F0632E04AE2";

	var _API_URL_ = "http://api.hrfco.go.kr/" + _API_KEY_ + "/rainfall/list/" + _TIME_TYPE + "/";




	var _GetData = function(apiUrl){

		$('#rainFallContent').html('');

		for(var i=0; i<_OBSERVATORY_LIST.length; i++){

			var observatoryId = "observatory"+(i+1);
			var $p = $("<p></p>");
			var $div = $("<div></div>");
			var $observatoryDiv = $("<div></div>").attr("id", observatoryId).append($p).append($div).css("float","left").css("margin-right","20px");
			$('#rainFallContent').append($observatoryDiv);

			var observatory = _OBSERVATORY_LIST[i].code + ".xml";
			var apiParam = {
					url : _API_URL_ + observatory
			};

			requestAPI(apiParam);
		}


	};



	/**
	 * API 요청을 보냅니다
	 */
	var requestAPI = function(apiParam){
		$.ajax({
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : apiParam,
			success : function(xml) {

				var $xml = $(xml);

				var rainfall = $xml.find("Rainfall").find("rf").text();
				var code = $xml.find("Rainfall").find("rfobscd").text();
				var time = $xml.find("Rainfall").find("ymdhm").text();

				for(var i =0; i<_OBSERVATORY_LIST.length; i++){
					if(_OBSERVATORY_LIST[i].code == code){
						_OBSERVATORY_LIST[i].rainfall = rainfall;
						_OBSERVATORY_LIST[i].time = time;
						_OBSERVATORY_LIST[i].color = getColorByRange(rainfall);

						$("#"+"observatory"+(i+1)).find("p").text(_OBSERVATORY_LIST[i].name);
						$("#"+"observatory"+(i+1)).find("div").text(rainfall).css("color",getColorByRange(rainfall));

					}
				}

			},
			error : function(xhr, status, error){
				console.error(">> 강우 정보 데이터 가져오기 실패");
			}
		},false);
	}


	/**
	 * 강우 범위에 따른 컬러를 반환합니다
	 */
	var getColorByRange = function(rainfall){

		var color;

		if(rainfall == 0){
			color ="#2A5684";
		}
		else if(rainfall>=1 && rainfall<=40){
			color ="#0BE88D";
		}
		else if(rainfall>=41 && rainfall<=80){
			color ="#0644DE";
		}
		else if(rainfall>=81 && rainfall<=120){
			color ="#06DE1A";
		}
		else if(rainfall>=121 && rainfall<=160){
			color ="#E3F40C";
		}
		else if(rainfall>=161 && rainfall<=200){
			color ="#F48E0C";
		}
		else if(rainfall>=201){
			color ="#EF265D";
		}
		else{
			color = null;
		}

		return color;
	}


	/**
	 * 데이터 갱신을 시작합니다.
	 */
	GMXBOARD.startRainFallInterval = function(){
		_GetData();
		if(_INTERVAL_ != null){
			clearInterval(_INTERVAL_);
			_INTERVAL_ = null;
		}

		_INTERVAL_ = setInterval(function(){
			_GetData();
		}, _INTERVAL_TIME_);
	}

	/**
	 * 데이터 갱신을 종료합니다.
	 */
	GMXBOARD.stopRainFallInterval = function(){
		if(_INTERVAL_ != null){
			clearInterval(_INTERVAL_);
			_INTERVAL_ = null;
		}
	}

	/**
	 * 데이터 갱신 주기를 설정합니다.
	 * 데이터 갱신중일 경우 자동 재시작 합니다.
	 */
	GMXBOARD.setIntervalTime = function(ms){
		_INTERVAL_TIME_ = ms;

		if(_INTERVAL_ != null) GMXBOARD.startRainFallInterval();
	}

	/**
	 * 데이터 갱신을 시작합니다.
	 */
//	GMXBOARD.startRainFallInterval();
	$(document).ready(function(){

		if($("#"+_ELEMENT_ID_).length == 0) {
			GMXBOARD.stopRainFallInterval();
			console.error(_ELEMENT_ID_+" ELEMENT가 없습니다.");
			return false;
		};

		$('#rainfall').append($("<div id=rainFallTitle></div>").css("height","10%").text("강우정보"));
		$('#rainfall').append($("<div id=rainFallRange></div>").css("height","20%"));
		$('#rainfall').append($("<div id=rainFallContent></div>").css("height","70%"));

		GMXBOARD.startRainFallInterval();
	});

})(window.GMXBOARD);