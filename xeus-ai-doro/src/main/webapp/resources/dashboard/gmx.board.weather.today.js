/**
 * 오늘날씨 데이터 API 모듈입니다.
 *
 * @author 김훈식
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 60000;
	var _ELEMENT_ID_ = "weather";
	
	//210723  김훈식 ADD - 오늘날씨 파라미터 관련 추가
	var grid = Spatial.convertDfsToXY(37.88518934907217, 127.72974635482576); //춘천
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var time = null;
	
	if (minutes < 30) {
		hours = hours - 1;
		if (hours < 0) {
			today.setDate(today.getDate() - 1);
			dd = today.getDate();
			mm = today.getMonth() + 1;
			yyyy = today.getFullYear();
			hours = 23;
		}
	}
	if (hours > 23 || hours <= 2) {
		if(dd-1 == 0){
			var dt = new Date(yyyy, mm-1, 0);
			dd = dt.getDate();
			mm = dt.getMonth()+1;
			yyyy = dt.getFullYear();
		}else{
			dd = dd - 1;
		}
		time = '23';
	} else if (hours > 2 && hours <= 5) {
		time = '02';
	} else if (hours > 5 && hours <= 8) {
		time = '05';
	} else if (hours > 8 && hours <= 11) {
		time = '08';
	} else if (hours > 11 && hours <= 14) {
		time = '11';
	} else if (hours > 14 && hours <= 17) {
		time = '14';
	} else if (hours > 17 && hours <= 20) {
		time = '17';
	} else if (hours > 20 && hours <= 23) {
		time = '20';
	}

//	if (time < 10) {
//		time = '0' + time
//	}
	if (mm < 10) {
		mm = '0' + mm
	}
	if (dd < 10) {
		dd = '0' + dd
	}

	var base_date = yyyy + "" + mm + "" + dd;
	var base_time = time + "00";
	// 김훈식 END - 오늘날씨 파라미터 관련 추가
	

	var _API_URL_ = "http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst";
	var _API_KEY_ = "aAmvI8nBxsJACCNfs/7cQCT9S6UFDDBGDOSBeEWOCd82Izai5TwPDCPpk1ol8sygjMpcXNWGLAMdIL98fh3aLQ==";
	var _API_PARAM_ = {
		url : _API_URL_,
		serviceKey : _API_KEY_,
		numOfRows : 100,
		pageNo : "1",
		base_date : base_date,
		base_time : base_time,
		nx : grid.nx,
		ny : grid.ny
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

				$("#weather");

				var weather_pty = "";
			    var weather_sky = "";
			    var weather_t3h = "";
			    var weather_vec = "";
			    var weather_wsd = "";
			    var weather_reh = "";
			    var weather_pop = "";
			    var weather_tmn = "";
			    var weather_tmx = "";
			    var children = $(xml).find("items").children();

			    children.each(function(cnt) {
			      if (weather_pty == "" && $(children[cnt]).find("category").text() == "PTY") {
			        weather_pty = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_sky == "" && $(children[cnt]).find("category").text() == "SKY") {
			        weather_sky = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_t3h == "" && $(children[cnt]).find("category").text() == "T3H") {
			        weather_t3h = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_vec == "" && $(children[cnt]).find("category").text() == "VEC") {
			        weather_vec = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_wsd == "" && $(children[cnt]).find("category").text() == "WSD" ) {
			        weather_wsd = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_reh == "" && $(children[cnt]).find("category").text() == "REH") {
			        weather_reh = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_pop == "" && $(children[cnt]).find("category").text() == "POP") {
			        weather_pop = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_tmn == "" && $(children[cnt]).find("category").text() == "TMN") {
			        weather_tmn = $(children[cnt]).find("fcstValue").text();
			      } else if (weather_tmx == "" && $(children[cnt]).find("category").text() == "TMX") {
			        weather_tmx = $(children[cnt]).find("fcstValue").text();
			      }
			    });

			    try {
			      if (weather_pty == 1) {
			        weather_sky = '08';
			      } else if (weather_pty == 2) {
			        weather_sky = '12';
			      } else if (weather_pty == 3) {
			        weather_sky = '11';
			      } else {
			        weather_sky = '0' + weather_sky;
			      }
			      var weather_alt = "";
			   // 21.04.05 백유림 추가(날씨마다 배경색 class 추가)
					var weather_color = "";
					switch (weather_sky) {
					case '01':
						weather_alt = "맑음";
						weather_color = "clear";
						break;
					case '02':
						weather_alt = "구름조금";
						weather_color = "cloud1";
						break;
					case '03':
						weather_alt = "구름많음";
						weather_color = "cloud2";
						break;
					case '04':
						weather_alt = "흐림";
						weather_color = "gray";
						break;
					case '08':
						weather_alt = "비";
						weather_color = "rain";
						break;
					case '12':
						weather_alt = "비/눈";
						weather_color = "snow_rain";
						break;
					case '11':
						weather_alt = "눈";
						weather_color = "snow";
						break;
					}
			      //
			      var weather_img = '<img src="../res/img/board/weather2/NB' + weather_sky + '.png" alt="' + weather_alt + '"/>';

			      if (weather_vec == 0) {
			        weather_vec = '북';
			      } else if (weather_vec > 0 && weather_vec < 45) {
			        weather_vec = '북북동';
			      } else if (weather_vec == 45) {
			        weather_vec = '북동';
			      } else if (weather_vec > 45 && weather_vec < 90) {
			        weather_vec = '동북동';
			      } else if (weather_vec == 90) {
			        weather_vec = '동';
			      } else if (weather_vec > 90 && weather_vec < 135) {
			        weather_vec = '동남동';
			      } else if (weather_vec == 135) {
			        weather_vec = '남동';
			      } else if (weather_vec > 135 && weather_vec < 180) {
			        weather_vec = '남남동';
			      } else if (weather_vec == 180) {
			        weather_vec = '남';
			      } else if (weather_vec > 180 && weather_vec < 225) {
			        weather_vec = '남남서';
			      } else if (weather_vec == 225) {
			        weather_vec = '남서';
			      } else if (weather_vec > 225 && weather_vec < 270) {
			        weather_vec = '서남서';
			      } else if (weather_vec == 270) {
			        weather_vec = '서';
			      } else if (weather_vec > 270 && weather_vec < 315) {
			        weather_vec = '서북서';
			      } else if (weather_vec == 315) {
			        weather_vec = '북서';
			      } else if (weather_vec > 315 && weather_vec < 360) {
			        weather_vec = '북북서';
			      } else if (weather_vec == 360) {
			        weather_vec = '북';
			      }

			      
					$('.box.weather').removeClass().addClass('box').addClass('weather');			
					$('.box.weather').addClass(weather_color);
					$('#weather_now').text(weather_alt);
					$("#weather_icon").html(weather_img);
					$("#weather_temperature").text(weather_t3h + "˚");
				    $("#weather_humidity").find('span').text(weather_reh);
				    $("#weather_rainfall").find('span').text(weather_pop);
				    $("#weather_wind").find('span').text(weather_vec + " " + weather_wsd);
				    $("#tmn").text(weather_tmn + "˚");
				    $("#tmx").text(weather_tmx + "˚");

			    } catch (e) {

			    }
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