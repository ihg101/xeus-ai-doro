/**
 * 미세먼지 데이터 API 모듈입니다.
 *
 * @author 김훈식
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 60000;
	var _ELEMENT_ID_ = "air";

	var _API_URL_ = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";
	var _API_KEY_ = "aAmvI8nBxsJACCNfs/7cQCT9S6UFDDBGDOSBeEWOCd82Izai5TwPDCPpk1ol8sygjMpcXNWGLAMdIL98fh3aLQ==";
	var _API_PARAM_ = {
		url : _API_URL_,
		serviceKey : _API_KEY_,
		dataTerm : "daily",
		pageNo : "1",
		numOfRows : 10,
		ver : '1.3',
		stationName : '무전동'
	};
	var _API_LAST_CALL_ = null;

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

				$("#air");

				var dust_pm10 = {}; // 미세먼지
				var dust_pm25 = {}; // 초미세먼지
				var dust_o3 = {}; // 오존

				if ($xml.find("resultCode").text() == "00") {
			      //rst = result;
			      var pm10 = Number($xml.find("pm10Grade").eq(0).text()); // 미세먼지
			      var pm25 = Number($xml.find("pm25Grade").eq(0).text()); // 초미세먼지
			      var o3 = Number($xml.find("o3Grade").eq(0).text()); // 오존
			      var pm10value = Number($xml.find("pm10Value").eq(0).text());
			      var pm25value = Number($xml.find("pm25Value").eq(0).text());
			      var o3value = Number($xml.find("o3Value").eq(0).text());
			      
			      if($xml.find("pm10Value").eq(0).text() == '-'){
			    	  pm10value = 0;
			      }
			      if($xml.find("pm25Value").eq(0).text() == '-'){
			    	  pm25value = 0;
			      }
			      if($xml.find("o3Value").eq(0).text() == '-'){
			    	  o3value = 0;
			      }

			      if (pm10 == 1) {
			    	  dust_pm10['stat'] = '좋음';
			    	  dust_pm10['color'] = '#48a8ff';
			      } else if (pm10 == 2) {
			    	  dust_pm10['stat'] = '보통';
			    	  dust_pm10['color'] = '#3ef9c3';
			      } else if (pm10 == 3) {
			    	  dust_pm10['stat'] = '나쁨';
			    	  dust_pm10['color'] = '#ffd86a';
			      } else if (pm10 == 4) {
			    	  dust_pm10['stat'] = '매우나쁨';
			    	  dust_pm10['color'] = '#ff986a';
			      } else{
			    	  dust_pm10['stat'] = '데이터없음';
			    	  dust_pm10['color'] = '#3ef9c3';
			      }

			      if (pm25 == 1) {
			    	  dust_pm25['stat'] = '좋음';
			    	  dust_pm25['color'] = '#48a8ff';
			      } else if (mp25 == 2) {
			    	  dust_pm25['stat'] = '보통';
			    	  dust_pm25['color'] = '#3ef9c3';
			      } else if (mp25 == 3) {
			    	  dust_pm25['stat'] = '나쁨';
			    	  dust_pm25['color'] = '#ffd86a';
			      } else if (mp25 == 4) {
			    	  dust_pm25['stat'] = '매우나쁨';
			    	  dust_pm25['color'] = '#ff986a';
			      } else{
			    	  dust_pm25['stat'] = '데이터없음';
				      dust_pm25['color'] = '#3ef9c3';
			      }
			      
			      if (o3 == 1) {
			    	  dust_o3['stat'] = '좋음';
			    	  dust_o3['color'] = '#48a8ff';
			      } else if (o3 == 2) {
			    	  dust_o3['stat'] = '보통';
			    	  dust_o3['color'] = '#3ef9c3';
			      } else if (o3 == 3) {
			    	  dust_o3['stat'] = '나쁨';
			    	  dust_o3['color'] = '#ffd86a';
			      } else if (o3 == 4) {
			    	  dust_o3['stat'] = '매우나쁨';
			    	  dust_o3['color'] = '#ff986a';
			      } else{
			    	  dust_o3['stat'] = '데이터없음';
			    	  dust_o3['color'] = '#3ef9c3';
			      }
			    } else {
			      dust_pm10['stat'] = '데이터없음';
			      dust_pm10['color'] = '#3ef9c3';
			      dust_pm25['stat'] = '데이터없음';
			      dust_pm25['color'] = '#3ef9c3';
			      dust_o3['stat'] = '데이터없음';
			      dust_o3['color'] = '#3ef9c3';
			    }
			
				$("#pm10count").text(pm10value);
		    	$("#pm10count").css("color", dust_pm10.color);
		    	$("#pm10v").text(dust_pm10.stat);
		    	$("#pm25count").text(pm25value);
		    	$("#pm25count").css("color", dust_pm25.color);
		   		$("#pm25v").text(dust_pm25.stat);
		    	$("#o3count").text(o3value);
		    	$("#o3count").css("color", dust_o3.color);
		   		$("#o3v").text(dust_o3.stat);
				

				/*if($xml.find("response").length > 0){
					if($xml.find("body").length > 0){
						if($xml.find("items").length > 0){
							if($xml.find("item").length > 0){
								if($xml.find("item").children().length > 0){
									$("#" + _ELEMENT_ID_).find("img").attr("src", $xml.find("item").find("rdr-img-file").eq($xml.find("item").children().length - 1).text());
								}
							}
						}
					}
				}*/
			},
			error : function(xhr, status, error){
				console.error(">> 미세먼지 데이터 로드 실패");
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