/**
 * 기상 레이더 영상(이미지) API 모듈입니다.
 *
 * @author 장광용
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 120000;
	var _ELEMENT_ID_ = "weatherRadar";

	var _RADER_INTERVAL_ = null;
	var _RADER_INTERVAL_TIME_ = 1500;

	var _API_URL_ = "http://apis.data.go.kr/1360000/RadarImgInfoService/getCmpImg";
	var _API_KEY_ = "aAmvI8nBxsJACCNfs/7cQCT9S6UFDDBGDOSBeEWOCd82Izai5TwPDCPpk1ol8sygjMpcXNWGLAMdIL98fh3aLQ==";
	var _API_PARAM_ = {
		url : _API_URL_,
		serviceKey : _API_KEY_,
		data : "CMP_WRC",
		time : "20210723",
		numOfRows : 10,
		pageNo : 1
	};
	var _API_LAST_CALL_ = null;
	
	var _COUNT_ = 0;
	var _IMGLIST_ = null;

	var _GetData = function(){
		if(document.getElementById($("#"+_ELEMENT_ID_))==false) {
			console.error(_ELEMENT_ID_+" ELEMENT가 없습니다.");
			return false;
		};
		_API_PARAM_.time = Date.prototype.getYMD(false);
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_,
			success : function(xml) {
				var $xml = $(xml);
				_API_LAST_CALL_ = new Date();

				$("#weatherRadar");

				if($xml.find("item").children().length > 0){
					_IMGLIST_ = $xml.find("items").find("item").children();
					if (_IMGLIST_.length > 15){
						_COUNT_ = _IMGLIST_.length - 15;
					} else {
						_COUNT_ = 0;//_IMGLIST_.length;
					};
					if(_RADER_INTERVAL_ !=null){
						clearInterval(_RADER_INTERVAL_);
						_RADER_INTERVAL_ = null;
					};
					_RADER_INTERVAL_ = setInterval(function(){
						_COUNT_++
						$("#" + _ELEMENT_ID_).find("img").attr("src", $xml.find("item").find("rdr-img-file").eq(_COUNT_).text());
						if(_COUNT_ == _IMGLIST_.length-1 && _IMGLIST_.length > 15){
							_COUNT_ = _IMGLIST_.length-15;
						} else if(_COUNT_ == _IMGLIST_.length-1){
							_COUNT_ = 0;
						}
					}, _RADER_INTERVAL_TIME_);
//									$("#" + _ELEMENT_ID_).find("img").attr("src", $xml.find("item").find("rdr-img-file").eq($xml.find("item").children().length - 1).text());
				}
			},
			error : function(xhr, status, error){
				console.error(">> 기상 레이더 영상 로드 실패");
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
		if(_RADER_INTERVAL_ != null){
			clearInterval(_RADER_INTERVAL_);
			_RADER_INTERVAL_ = null;
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