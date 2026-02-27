/**
 * 주간날씨 데이터 API 모듈입니다.
 *
 * @author 김훈식
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 60000;
	var _ELEMENT_ID_ = "weatherweek";
	
	//210723  김훈식 ADD - 오늘날씨 파라미터 관련 추가
	var grid = Spatial.convertDfsToXY(37.88518934907217, 127.72974635482576); //춘천
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var time = null;
	var today_time = null; //오늘~모레 날씨측정일자 
	
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
	
	if(hours >= 5 && hours < 11 ){
		today_time = '1'
	}else if(hours >= 11 && hours < 17){
		today_time = '2'
	}else{
		today_time = '3'
		
	}


	if (mm < 10) {
		mm = '0' + mm
	}
	if (dd < 10) {
		dd = '0' + dd
	}

	var base_date = yyyy + "" + mm + "" + dd;
	var base_time = time + "00";
	
	// 김훈식 END - 오늘날씨 파라미터 관련 추가
	
	// 김훈식  ADD - 주간날씨 파라미터 관련 추가
	
	var endDt = 0;
    var returnDt = "";
    if (6 > hours) {
    	today.setDate(today.getDate() - 1);
    	dd = today.getDate();
		mm = today.getMonth() + 1;
		yyyy = today.getFullYear();
		hours = 23;
        returnDt = yyyy + "" + mm + "" + dd + "1800";
    } else if (6 < hours && 18 > hours){
    	returnDt = yyyy + "" + mm + "" + dd + "0600";
    } else if (18 < hours) {
   	 	returnDt = yyyy + "" + mm + "" + dd + "1800";
    }
	
	var apiRegIdW = "11A00101"
	var apiRegIdLF = "11D10000" ; //예보구역코드
	var apiRegIdT = "11D10301" ; //예보구역코드

	var _API_URL_0 = "http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst";
	var _API_URL_1 = "http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst";
	var _API_URL_2 = "http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa";
	var _API_KEY_0 = "G9mT5p69dRtg8+vS6TYdrpzJjOea3P2KdSod3oamtxNiJO6qv2TXNQTOUS2SaC6K8ljPIMuPylhX3RKTmQjZLQ==";
	var _API_KEY_ = "iGA37XV0omBu7Yl/8Hb8FtII+KXqxQw8cwrk3mCSnnyBTTOCaB3TTKXqUeOQ2hHWgydV7YRbWUHpH+IViHQWKg==";
	var _API_PARAM_0 = {
		url : _API_URL_0,
		serviceKey : _API_KEY_0,
		numOfRows : 10,
		pageNo : "1",
		regId : apiRegIdW
	};
		
	var _API_PARAM_1 = {
		url : _API_URL_1,
		serviceKey : _API_KEY_,
		numOfRows : 10,
		pageNo : "1",
		regId : apiRegIdLF,
		tmFc : returnDt
	};
	
	var _API_PARAM_2 = {
		url : _API_URL_2,
		serviceKey : _API_KEY_,
		numOfRows : 100,
		pageNo : "1",
		regId : apiRegIdT,
		tmFc : returnDt
	};
	var _API_LAST_CALL_ = null;

	var _GetData = function(){
		if(document.getElementById($("#"+_ELEMENT_ID_))==false) {
			console.error(_ELEMENT_ID_+" ELEMENT가 없습니다.");
			return false;
		};
		//_API_PARAM_1.time = Date.prototype.getYMD(false);
		
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_0,
			success : function(xml) {
				var $xml = $(xml);
				_API_LAST_CALL_ = new Date();

				$("#weatherweek");
				if ($xml.find("resultCode").text() == "00") {

					var wfAm0 = null; //내일오전기상
					var wfPm0 = null; //내일오후기상
					var wfAm1 = null; //모레오전기상
					var wfPm1 = null; //모레오후기상
					var rnstAm0 = null; //내일오전강수량
					var rnstPm0 = null; //내일오후강수량
					var rnstAm1 = null; //모레오전강수량
					var rnstPm1 = null; //모레오후강수량
					var numEfAm0 = null; //내일오전온도
					var numEfPm0 = null; //내일오후온도
					var numEfAm1 = null; //모레오전온도
					var numEfPm1 = null; //모레오후온도
					
				    var weatherImg ="";
					
					var valueCode = $xml.find("items").eq(0).text();
					var values = $xml.find("items").children();
					
					
					if(today_time == 1){
						// 2:내일오전 3:내일오후 4:모레오전 5:모레오후
						for(var i=0;i<values.length;i++){
							numEfAm0 = $(values[2]).find("ta").eq(0).text(); // 내일오전온도
							numEfPm0 = $(values[3]).find("ta").eq(0).text(); // 내일오후온도
							numEfAm1 = $(values[4]).find("ta").eq(0).text(); // 모레오전온도
							numEfPm1 = $(values[5]).find("ta").eq(0).text(); // 모레오후온도
							
							rnstAm0 = $(values[2]).find("rnSt").eq(0).text(); // 내일오전강수량
							rnstPm0 = $(values[3]).find("rnSt").eq(0).text(); // 내일오후강수량
							rnstAm1 = $(values[4]).find("rnSt").eq(0).text(); // 모레오전강수량
							rnstPm1 = $(values[5]).find("rnSt").eq(0).text(); // 모레오후강수량
							
							wfAm0 = $(values[2]).find("wf").eq(0).text(); // 내일오전강수량
							wfPm0 = $(values[3]).find("wf").eq(0).text(); // 내일오후강수량
							wfAm1 = $(values[4]).find("wf").eq(0).text(); // 모레오전강수량
							wfPm1 = $(values[5]).find("wf").eq(0).text(); // 모레오후강수량
							
							$(".weekly_content").find("#c0").text(numEfAm0+"˚/"+numEfPm0+"˚");
							$(".weekly_content").find("#c1").text(numEfAm1+"˚/"+numEfPm1+"˚");
							
						}
						
					}else if(today_time == 2){
						// 1:내일오전 2:내일오후 3:모레오전 4:모레오후
						for(var i=0;i<values.length;i++){
							numEfAm0 = $(values[1]).find("ta").eq(0).text(); // 내일오전온도
							numEfPm0 = $(values[2]).find("ta").eq(0).text(); // 내일오후온도
							numEfAm1 = $(values[3]).find("ta").eq(0).text(); // 모레오전온도
							numEfPm1 = $(values[4]).find("ta").eq(0).text(); // 모레오후온도
							
							rnstAm0 = $(values[1]).find("rnSt").eq(0).text(); // 내일오전강수량
							rnstPm0 = $(values[2]).find("rnSt").eq(0).text(); // 내일오후강수량
							rnstAm1 = $(values[3]).find("rnSt").eq(0).text(); // 모레오전강수량
							rnstPm1 = $(values[4]).find("rnSt").eq(0).text(); // 모레오후강수량
							
							wfAm0 = $(values[1]).find("wf").eq(0).text(); // 내일오전강수량
							wfPm0 = $(values[2]).find("wf").eq(0).text(); // 내일오후강수량
							wfAm1 = $(values[3]).find("wf").eq(0).text(); // 모레오전강수량
							wfPm1 = $(values[4]).find("wf").eq(0).text(); // 모레오후강수량

							$(".weekly_content").find("#c0").text(numEfAm0+"˚/"+numEfPm0+"˚");
							$(".weekly_content").find("#c1").text(numEfAm1+"˚/"+numEfPm1+"˚");
						}
					}else{
						// 1:내일오전 2:내일오후 3:모레오전 4:모레오후
						for(var i=0;i<values.length;i++){
							numEfAm0 = $(values[1]).find("ta").eq(0).text(); // 내일오전온도
							numEfPm0 = $(values[2]).find("ta").eq(0).text(); // 내일오후온도
							numEfAm1 = $(values[3]).find("ta").eq(0).text(); // 모레오전온도
							numEfPm1 = $(values[4]).find("ta").eq(0).text(); // 모레오후온도
							
							rnstAm0 = $(values[1]).find("rnSt").eq(0).text(); // 내일오전강수량
							rnstPm0 = $(values[2]).find("rnSt").eq(0).text(); // 내일오후강수량
							rnstAm1 = $(values[3]).find("rnSt").eq(0).text(); // 모레오전강수량
							rnstPm1 = $(values[4]).find("rnSt").eq(0).text(); // 모레오후강수량
							
							wfAm0 = $(values[1]).find("wf").eq(0).text(); // 내일오전강수량
							wfPm0 = $(values[2]).find("wf").eq(0).text(); // 내일오후강수량
							wfAm1 = $(values[3]).find("wf").eq(0).text(); // 모레오전강수량
							wfPm1 = $(values[4]).find("wf").eq(0).text(); // 모레오후강수량

							$(".weekly_content").find("#c0").text(numEfAm0+"˚/"+numEfPm0+"˚");
							$(".weekly_content").find("#c1").text(numEfAm1+"˚/"+numEfPm1+"˚");
						}
					}
					
					var arr = []; 

					   arr[0] = wfAm0;
					   arr[1] = wfPm0;
					   arr[2] = wfAm1;
					   arr[3] = wfPm1;
					   
				  	for (var i = 0; i < arr.length; i++) {
					    switch (arr[i]) {
					      case '맑음':
					    	  weatherImg = "01";
					    	  break;
					      case '구름조금':
					    	  weatherImg = "02";
					    	  break;
					      case '구름많음':
					    	  weatherImg = "03";
					    	  break;
					      case '흐림':
					    	  weatherImg = "04";
					    	  break;
					      case '비':
					    	  weatherImg = "08";
					    	  break;
					      case '구름많고 비':
					    	  weatherImg = "08";
					    	  break;
					      case '비/눈':
					    	  weatherImg = "12";
					    	  break;
					      case '눈':
					    	  weatherImg = "11";
					    	  break;
					      case '구름많고 눈':
					    	  weatherImg = "11";
					    	  break;
					      default :
					    	  weatherImg = "01";
				    	  break;
				        }
					    					    
					    
					    if(i==0)$(".weekly_content").find("#imgAm0").attr("src", "../res/img/board/weather/NB" + weatherImg +".png");
					    if(i==0)$(".weekly_content").find("#imgAm0").attr("alt", arr[i]);
					    if(i==0)$(".weekly_content").find("#temAm0").text(rnstAm0+"%");
					    if(i==1)$(".weekly_content").find("#imgPm0").attr("src", "../res/img/board/weather/NB" + weatherImg +".png");
					    if(i==1)$(".weekly_content").find("#imgPm0").attr("alt", arr[i]);
					    if(i==1)$(".weekly_content").find("#temPm0").text(rnstPm0+"%");
					    if(i==2)$(".weekly_content").find("#imgAm1").attr("src", "../res/img/board/weather/NB" + weatherImg +".png");
					    if(i==2)$(".weekly_content").find("#imgAm1").attr("alt", arr[i]);
					    if(i==2)$(".weekly_content").find("#temAm1").text(rnstAm1+"%");
					    if(i==3)$(".weekly_content").find("#imgPm2").attr("src", "../res/img/board/weather/NB" + weatherImg +".png");
					    if(i==3)$(".weekly_content").find("#imgPm2").attr("alt", arr[i]);
					    if(i==3)$(".weekly_content").find("#temPm2").text(rnstPm1+"%");
					    
					 } 
				}
			},
			error : function(xhr, status, error){
				console.error(">> 미세먼지 데이터 로드 실패");
			}
		});
		
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_1,
			success : function(xml) {
				var $xml = $(xml);
				_API_LAST_CALL_ = new Date();

				$("#weatherweek");
				

				if ($xml.find("resultCode").text() == "00") {

				   var weatherAltAmImg ="";
				   
				   var rnSt3Am =$xml.find("rnSt3Am").eq(0).text(); // 3일 후 오전 강수 확률
				   var rnSt3Pm =$xml.find("rnSt3Pm").eq(0).text(); // 3일 후 오후 강수 확률
				   var rnSt4Am =$xml.find("rnSt4Am").eq(0).text(); // 4일 후 오전 강수 확률
				   var rnSt4Pm =$xml.find("rnSt4Pm").eq(0).text(); // 4일 후 오후 강수 확률
				   var rnSt5Am =$xml.find("rnSt5Am").eq(0).text(); // 5일 후 오전 강수 확률
				   var rnSt5Pm =$xml.find("rnSt5Pm").eq(0).text(); // 5일 후 오후 강수 확률
				   

				   var wf3Am =$xml.find("wf3Am").eq(0).text(); // 3일 후 오전 날씨예보
				   var wf3Pm =$xml.find("wf3Pm").eq(0).text(); // 3일 후 오후 날씨예보
				   var wf4Am =$xml.find("wf4Am").eq(0).text(); // 4일 후 오전 날씨예보
				   var wf4Pm =$xml.find("wf4Pm").eq(0).text(); // 4일 후 오후 날씨예보
				   var wf5Am =$xml.find("wf5Am").eq(0).text(); // 5일 후 오전 날씨예보
				   var wf5Pm =$xml.find("wf5Pm").eq(0).text(); // 5일 후 오후 날씨예보
				   
				   var wf3Am =$xml.find("wf3Am").eq(0).text(); // 3일 후 오전 날씨예보
				   var wf3Pm =$xml.find("wf3Pm").eq(0).text(); // 3일 후 오후 날씨예보
				   var wf4Am =$xml.find("wf4Am").eq(0).text(); // 4일 후 오전 날씨예보
				   var wf4Pm =$xml.find("wf4Pm").eq(0).text(); // 4일 후 오후 날씨예보
				   var wf5Am =$xml.find("wf5Am").eq(0).text(); // 5일 후 오전 날씨예보
				   var wf5Pm =$xml.find("wf5Pm").eq(0).text(); // 5일 후 오후 날씨예보
					
				   var arr = []; 

				   arr[0] = wf3Am;
				   arr[1] = wf3Pm;
				   arr[2] = wf4Am;
				   arr[3] = wf4Pm;
				   arr[4] = wf5Am;
				   arr[5] = wf5Pm;
				   
				   for (var i = 0; i < arr.length; i++) {
					    switch (arr[i]) {
					      case '맑음':
					    	  weatherAltAmImg = "01";
					    	  break;
					      case '구름조금':
					    	  weatherAltAmImg = "02";
					    	  break;
					      case '구름많음':
					    	  weatherAltAmImg = "03";
					    	  break;
					      case '흐림':
					    	  weatherAltAmImg = "04";
					    	  break;
					      case '비':
					    	  weatherAltAmImg = "08";
					    	  break;
					      case '구름많고 비':
					    	  weatherAltAmImg = "08";
					    	  break;
					      case '비/눈':
					    	  weatherAltAmImg = "12";
					    	  break;
					      case '눈':
					    	  weatherAltAmImg = "11";
					    	  break;
					      case '구름많고 눈':
					    	  weatherAltAmImg = "11";
					    	  break;
					      default :
					    	  weatherAltAmImg = "01";
				    	  break;
				        }
					    

				    	dd = today.getDate() + i +1;
						mm = today.getMonth() + 1;
						yyyy = today.getFullYear();
						
						if (mm < 10) {
							mm = '0' + mm
						}
						if (dd < 10) {
							dd = '0' + dd
						}
						
				        returnDt = mm + "." + dd ;
				        var returnYDt = yyyy + mm + dd ;
				        
					    if(i==0)$(".weekly_dt").find("#dt0").text(returnDt);
					    if(i==1)$(".weekly_dt").find("#dt1").text(returnDt);
					    if(i==2)$(".weekly_dt").find("#dt2").text(returnDt);
					    if(i==3)$(".weekly_dt").find("#dt3").text(returnDt);
					    if(i==4)$(".weekly_dt").find("#dt4").text(returnDt);
					    if(i==0)$(".weekly_content").find("#imgAm2").attr("src", "../res/img/board/weather/NB" + weatherAltAmImg +".png");
					    if(i==0)$(".weekly_content").find("#imgAm2").attr("alt", arr[i]);
					    if(i==0)$(".weekly_content").find("#temAm2").text(rnSt3Am+"%");
					    if(i==1)$(".weekly_content").find("#imgPm2").attr("src", "../res/img/board/weather/NB" + weatherAltAmImg +".png");
					    if(i==1)$(".weekly_content").find("#imgPm2").attr("alt", arr[i]);
					    if(i==1)$(".weekly_content").find("#temPm2").text(rnSt3Pm+"%");
					    if(i==2)$(".weekly_content").find("#imgAm3").attr("src", "../res/img/board/weather/NB" + weatherAltAmImg +".png");
					    if(i==2)$(".weekly_content").find("#imgAm3").attr("alt", arr[i]);
					    if(i==2)$(".weekly_content").find("#temAm3").text(rnSt4Am+"%");
					    if(i==3)$(".weekly_content").find("#imgPm3").attr("src", "../res/img/board/weather/NB" + weatherAltAmImg +".png");
					    if(i==3)$(".weekly_content").find("#imgPm3").attr("alt", arr[i]);
					    if(i==3)$(".weekly_content").find("#temPm3").text(rnSt4Pm+"%");
					    if(i==4)$(".weekly_content").find("#imgAm4").attr("src", "../res/img/board/weather/NB" + weatherAltAmImg +".png");
					    if(i==4)$(".weekly_content").find("#imgAm4").attr("alt", arr[i]);
					    if(i==4)$(".weekly_content").find("#temAm4").text(rnSt5Am+"%");
					    if(i==5)$(".weekly_content").find("#imgPm4").attr("src", "../res/img/board/weather/NB" + weatherAltAmImg +".png");
					    if(i==5)$(".weekly_content").find("#imgPm4").attr("alt", arr[i]);
					    if(i==5)$(".weekly_content").find("#temPm4").text(rnSt5Pm+"%");
					    
					} 
				   
				}
				
				
				

			},
			error : function(xhr, status, error){
				console.error(">> 미세먼지 데이터 로드 실패");
			}
		});
		
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_2,
			success : function(xml) {
				var $xml = $(xml);
				_API_LAST_CALL_ = new Date();

				$("#weatherweek");
				if ($xml.find("resultCode").text() == "00") {

					   var taMin3 =$xml.find("taMin3").eq(0).text(); // 3일 후 최저기온
					   var taMax3 =$xml.find("taMax3").eq(0).text(); // 3일 후 최고기온
					   var taMin4 =$xml.find("taMin4").eq(0).text(); // 4일 후 최저기온
					   var taMax4 =$xml.find("taMax4").eq(0).text(); // 4일 후 최고기온
					   var taMin5 =$xml.find("taMin5").eq(0).text(); // 5일 후 최저기온
					   var taMax5 =$xml.find("taMax5").eq(0).text(); // 6일 후 최고기온
					   
					   $(".weekly_content").find("#c2").text(taMin3+"˚/"+taMax3+"˚");
					   $(".weekly_content").find("#c3").text(taMin4+"˚/"+taMax4+"˚");
					   $(".weekly_content").find("#c4").text(taMin5+"˚/"+taMax5+"˚");
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