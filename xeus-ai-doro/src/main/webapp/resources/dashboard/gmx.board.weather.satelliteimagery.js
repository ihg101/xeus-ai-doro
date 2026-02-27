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
	var _ELEMENT_ID_ = "satelliteImagery";
	var _SATELLITE_INTERVAL_ = null;
	var _SATELLITE_INTERVAL_TIME_ = 1500;

	var _API_URL_ = "http://apis.data.go.kr/1360000/SatlitImgInfoService/getInsightSatlit";
	var _API_KEY_ = "aAmvI8nBxsJACCNfs/7cQCT9S6UFDDBGDOSBeEWOCd82Izai5TwPDCPpk1ol8sygjMpcXNWGLAMdIL98fh3aLQ==";
	var _API_PARAM_ = {
		url : _API_URL_,
		serviceKey : _API_KEY_,
		sat : "g2",
		//data : "ir105", //적외영상
		//data : "wv069", //수증기영상
		//data : "sw038", //단파적외영상
		//data : "vi006", //가시영상
		data : "rgbt", //RGB컬러
//		data : "rgbdn", //RGB 주야간합성
		area : "ko",
		time : "20210722",
		numOfRows : 10,
		pageNo : 1
	};
	var _API_LAST_CALL_ = null;
	var _COUNT_ = 0;
	var _IMGLIST_ = null;
	var _NULL_CHK_ = true;

	var _GetData = function(){

		if (_NULL_CHK_){
			_API_PARAM_.time = Date.prototype.getYMD(false);
		} else {
			_API_PARAM_.time = _API_PARAM_.time -1;
		}
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_,
			success : function(xml) {
				var $xml = $(xml);
				_API_LAST_CALL_ = new Date();

				$("#satelliteImagery");
				if($xml.find("item").children().length > 0){
					_IMGLIST_ = $xml.find("body").find("items").find("item").children();

					if(_IMGLIST_.length == 1 && _IMGLIST_[0].innerHTML == "") {
						_NULL_CHK_ = false;
						_GetData();
						return false;
					}
					_NULL_CHK_ = true;
					if (_IMGLIST_.length > 32){
						_COUNT_ = _IMGLIST_.length - 32;
					} else {
						_COUNT_ = 0;//_IMGLIST_.length;
					};
					if(_SATELLITE_INTERVAL_ !=null){
						clearInterval(_SATELLITE_INTERVAL_);
						_SATELLITE_INTERVAL_ = null;
					};
					_SATELLITE_INTERVAL_ = setInterval(function(){
						_COUNT_++
						$("#" + _ELEMENT_ID_).find("img").attr("src", $xml.find("item").find("satImgC-file").eq(_COUNT_).text());
						if(_COUNT_ == _IMGLIST_.length-1 && _IMGLIST_.length > 32){
							_COUNT_ = _IMGLIST_.length-32;
						} else if(_COUNT_ == _IMGLIST_.length-1) {
							_COUNT_ = 0;
						}
					}, 1500);
//									$("#" + _ELEMENT_ID_).find("img").attr("src", $xml.find("item").find("satImgC-file").eq($xml.find("item").children().length - 1).text());
				}
			},
			error : function(xhr, status, error){
				console.error(">> 위성 영상 로드 실패");
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
		if(_SATELLITE_INTERVAL_ != null){
			clearInterval(_SATELLITE_INTERVAL_);
			_SATELLITE_INTERVAL_ = null;
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