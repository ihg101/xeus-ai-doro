/**
 * 기상 레이더 영상(이미지) API 모듈입니다.
 *
 * @author 장광용
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 60000;
	var _ELEMENT_ID_ = "typhoonImage";
	var _API_URL_ = "http://apis.data.go.kr/1360000/TyphoonInfoService/getTyphoonInfo";
	var _API_KEY_ = "aAmvI8nBxsJACCNfs/7cQCT9S6UFDDBGDOSBeEWOCd82Izai5TwPDCPpk1ol8sygjMpcXNWGLAMdIL98fh3aLQ==";
	var _API_PARAM_ = {
		url : _API_URL_,
		serviceKey : _API_KEY_,
		fromTmFc : "20210723",
		toTmFc : "20210722",
		numOfRows : 10,
		pageNo : 1
	};
	var _API_LAST_CALL_ = null;

	var _GetData = function(){
		if(document.getElementById($("#"+_ELEMENT_ID_))==false) {
			console.error(_ELEMENT_ID_+" ELEMENT가 없습니다.");
			return false;
		};
		_API_PARAM_.fromTmFc = Date.prototype.getYMD(false);
		_API_PARAM_.toTmFc = Date.prototype.getYMD(false);
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_,
			success : function(xml) {
				var $xml = $(xml);
				_API_LAST_CALL_ = new Date();

				$("#typhoonImage");
				if($xml.find("items").children().length > 0){
					$("#"+ _ELEMENT_ID_).find("img").attr("src", $xml.find("items").find("item").eq($xml.find("items").children().length -1).find("img").text());
				}
			},
			error : function(xhr, status, error){
				console.error(">> 태풍 영상 로드 실패");
			}
		});
	};

	/**
	 * 데이터 갱신을 시작합니다.
	 */
	GMXBOARD.startRadarCompositionImage = function(){
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
	GMXBOARD.stopRadarCompositionImage = function(){
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

		if(_INTERVAL_ != null) GMXBOARD.startRadarCompositionImage();
	}

	/**
	 * 데이터 갱신을 시작합니다.
	 */
	GMXBOARD.startRadarCompositionImage();

})(window.GMXBOARD);