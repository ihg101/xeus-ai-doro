/**
 * 방재 년월요약자료조회
 *
 * @author 장광용
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _ELEMENT_ID_ = "monthsumry";

	var _API_URL_MONTH_ = "http://apis.data.go.kr/1360000/AwsMtlyInfoService/getDailyAwsData";
	var _API_KEY_MONTH_ = "G9mT5p69dRtg8+vS6TYdrpzJjOea3P2KdSod3oamtxNiJO6qv2TXNQTOUS2SaC6K8ljPIMuPylhX3RKTmQjZLQ==";
	var _API_PARAM_MONTH_ = {
		url : _API_URL_MONTH_,
		serviceKey : _API_KEY_MONTH_,
		pageNo : 1,
		numOfRows : 10,
		year : "2021",
		month : "05",
		station : "555" //지역코드 555 > 화천
	};

	var _API_URL_YEAR_ = "http://apis.data.go.kr/1360000/AwsYearlyInfoService/getStnbyMmSumry";
	var _API_KEY_YEAR_ = "G9mT5p69dRtg8+vS6TYdrpzJjOea3P2KdSod3oamtxNiJO6qv2TXNQTOUS2SaC6K8ljPIMuPylhX3RKTmQjZLQ==";
	var _API_PARAM_YEAR_ = {
		url : _API_URL_YEAR_,
		serviceKey : _API_KEY_YEAR_,
		pageNo : 1,
		numOfRows : 10,
		year : "2021",
		month : "01",
		station : "555" //지역코드 555 > 화천
	};


	var _API_LAST_CALL_ = null;

	var _GetMonthData = function(){
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_MONTH_,
			success : function(xml) {
				var $xml = $(xml);
				var _TA_DAY_LIST_ = []; //평균기온
				var _TA_MAX_LIST_ = []; //최고기온
				var _TA_MIN_LIST_ = []; //최저기온
				var _WD_DAY_LIST_ = []; //평균풍속
				var _WS_INS_MAX_LIST_ = []; //최대순간 풍속
				var _WD_INS_MAX_LIST_ = []; //최대순간 풍향
				var _RN_DAY_LIST_ = []; //강수량
				var _DAY_LIST_ = [];
				_API_LAST_CALL_ = new Date();
				$("#monthsumry");
				if($xml.find("resultCode").text() == "00"){
					var sumryList = $xml.find("item").find("info");
					for(var i=0;i<sumryList.length;i++){
						var xmlDay = $xml.find("item").find("info").eq(i).find("tm").text();
						if (xmlDay != "상순" && xmlDay != "중순" && xmlDay != "하순" && xmlDay != "null"){
							_TA_DAY_LIST_.push(parseFloat($xml.find("item").find("info").eq(i).find("ta_day").text()));
							_TA_MAX_LIST_.push(parseFloat($xml.find("item").find("info").eq(i).find("ta_max").text()));
							_TA_MIN_LIST_.push(parseFloat($xml.find("item").find("info").eq(i).find("ta_min").text()));
							_WD_DAY_LIST_.push(parseFloat($xml.find("item").find("info").eq(i).find("ws_day").text()));
							_WS_INS_MAX_LIST_.push(parseFloat($xml.find("item").find("info").eq(i).find("ws_ins_max").text()));
							_WD_INS_MAX_LIST_.push(parseFloat($xml.find("item").find("info").eq(i).find("wd_ins_max").text()));
							if($xml.find("item").find("info").eq(i).find("rn_day").text() == "x"){
								_RN_DAY_LIST_.push(0);
							} else if($xml.find("item").find("info").eq(i).find("rn_day").text() == "null"){
								_RN_DAY_LIST_.push(0);
							} else {
								_RN_DAY_LIST_.push(parseFloat($xml.find("item").find("info").eq(i).find("rn_day").text()));
							}
							_DAY_LIST_.push(xmlDay+"일");
						}
					}

					document.getElementById("month_title").innerHTML = _API_PARAM_MONTH_.year+'년 '+_API_PARAM_MONTH_.month+'월';
					$("#monthtbl").empty();
					var data = {
						"" : _DAY_LIST_,
						"평균기온" : _TA_DAY_LIST_,
						"최고기온" : _TA_MAX_LIST_,
						"최저기온" : _TA_MIN_LIST_,
						"평균풍속" : _WD_DAY_LIST_,
						"최대순간 풍속" : _WS_INS_MAX_LIST_,
						"강수량" : _RN_DAY_LIST_
					};
					var html = createHTML(data);;
					$("#monthtbl").append(html);

					var categories = [];
					var series = [];
					for(var key in data){
						if(key){
							var vs = "";
							if(key.indexOf("기온") > -1) vs = " °C";
							else if(key.indexOf("풍속") > -1) vs = " m/s";
							else if(key.indexOf("강수") > -1) vs = " mm";
							series.push({
								name: key,
								data: data[key],
								tooltip: {
									valueSuffix: vs
								}
							});
						} else {
							categories = data[key];
						}
					}
					createGraph('monthsumry_graph', _API_PARAM_MONTH_.year+'년 '+_API_PARAM_MONTH_.month+'월', categories, series);
				} else {
					console.error(">> 요청하신 데이터가 없습니다.");
				}

			},
			error : function(xhr, status, error){
				console.error(">> 월간 통계자료 로드 실패");
			}
		});
	};

	var _GetYearData = function(){
		$.ajax({
			//url : "../GMT_proxy/sendData", //내부 서비스 전용
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_YEAR_,
			success : function(xml) {
				var $xml = $(xml);
				var _TA_MONTH_LIST_ = []; //평균기온
				var _TA_MAX_LIST_ = []; //최고기온
				var _TA_MAX_AVG_LIST_ = []; //최고기온평균
				var _TA_MIN_LIST_ = []; //최저기온
				var _TA_MIN_AVG_LIST_ = []; //최저기온평균
				var _WD_MONTH_LIST_ = []; //평균풍속
				var _WS_INS_MAX_LIST_ = []; //최대순간 풍속
				//var _WD_INS_MAX_LIST_ = []; //최대순간 풍향
				var _RN_MONTH_LIST_ = []; //강수량
				var _RN_DAY_LIST_ = []; //1일 최다강수량
				var _ALL_LIST_= {
				               "평균기온" : _TA_MONTH_LIST_,
				               "최고기온 : 극값" : _TA_MAX_LIST_,
				               "최고기온 : 평균" : _TA_MAX_AVG_LIST_,
				               "최저기온 : 극값" : _TA_MIN_LIST_,
				               "최저기온 : 평균" : _TA_MIN_AVG_LIST_,
				               "강수량 총량"	 : _RN_MONTH_LIST_,
				               "1일 최다강수량"  : _RN_DAY_LIST_,
				               "평균풍속"		 : _WD_MONTH_LIST_,
				               "최대순간풍속"	 : _WS_INS_MAX_LIST_
				}
				_API_LAST_CALL_ = new Date();
				$("#yearsumry");
				if($xml.find("resultCode").text() == "00"){
					var sumryList = $xml.find("item").find("month").find("info");
					var count = sumryList.length;
					var monthvalue = null;
					for(var i=0;i<count;i++){
						var xmlKind = $xml.find("item").find("month").find("info").eq(i).find("str").text();
						for(var key in _ALL_LIST_){
							if(xmlKind == key){
								for(var j=1;j<13;j++){
									if(j < 10){
										monthvalue = $xml.find("item").find("month").find("info").eq(i).find("taDay0"+j).text();
										if (monthvalue.length == 1){
											monthvalue = "0."+monthvalue;
										} else {
											monthvalue = monthvalue.slice(0, monthvalue.length-1)+"."+monthvalue.slice(monthvalue.length-1, monthvalue.length);
										};
									} else {
										monthvalue = $xml.find("item").find("month").find("info").eq(i).find("taDay"+j).text();
										if (monthvalue.length == 1){
											monthvalue = "0."+monthvalue;
										} else {
											monthvalue = monthvalue.slice(0, monthvalue.length-1)+"."+monthvalue.slice(monthvalue.length-1, monthvalue.length);
										};
									}
									_ALL_LIST_[key].push(parseFloat(monthvalue));
								};
							}
						}
					}
					document.getElementById("year_title").innerHTML = _API_PARAM_YEAR_.year+'년';
					$("#yeartbl").empty();
					var data = {
							"" : ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
							"평균기온" : _TA_MONTH_LIST_,
							"최고기온" : _TA_MAX_LIST_,
							"최고기온평균" : _TA_MAX_AVG_LIST_,
							"최저기온" : _TA_MIN_LIST_,
							"최저기온평균" : _TA_MIN_AVG_LIST_,
							"평균풍속" : _WD_MONTH_LIST_,
							"최대순간 풍속" : _WS_INS_MAX_LIST_,
							"강수량" : _RN_MONTH_LIST_,
							"1일 최다강수량" : _RN_DAY_LIST_
						};
					var html = createHTML(data);
					$("#yeartbl").append(html);
					var categories = [];
					var series = [];
					for(var key in data){
						if(key){
							var vs = "";
							if(key.indexOf("기온") > -1) vs = " °C";
							else if(key.indexOf("풍속") > -1) vs = " m/s";
							else if(key.indexOf("강수") > -1) vs = " mm";
							series.push({
								name: key,
								data: data[key],
								tooltip: {
									valueSuffix: vs
								}
							});
						} else {
							categories = data[key];
						}
					}
					createGraph('yearsumry_graph', _API_PARAM_YEAR_.year+'년', categories, series);
				} else {
					console.error(">> 요청하신 데이터가 없습니다. 이전 연도로 다시 요청합니다.");
					_API_PARAM_YEAR_.year = parseFloat(_API_PARAM_YEAR_.year)-1;
					_GetYearData();
				}
			},
			error : function(xhr, status, error){
				console.error(">> 월간 통계자료 로드 실패");
			}
		});
	};


	/**
	 * 테이블 생성을 위한
	 * HTML 생성
	 */
	var createHTML = function(data){
		var html = "";
		for(var key in data){
			var vs = "";
			if(key.indexOf("기온") > -1) vs = " °C";
			else if(key.indexOf("풍속") > -1) vs = " m/s";
			else if(key.indexOf("강수") > -1) vs = " mm";
			html += "<tr><td>"+key+"</td>";
			for(var i=0;i<data[key].length;i++){
				html += "<td>"+data[key][i]+" "+vs+"</td>"
			}
			html += "</tr>";
		}
		return html
	}

	/**
	 * 그래프 생성
	 */
	var createGraph = function(trg, title, categories, arryseries){
		Highcharts.chart(trg, {
			title: {
				text: title
			},
//			subtitle: {
//			    text: ''
//			},
			yAxis: {
				title: {
					text: ''
			    }
			},
			xAxis: [{
		    	categories: categories,
		    	crosshair : true
			}],
			legend: {
				layout: 'vertical',
			    align: 'right',
			    verticalAlign: 'middle'
			},
			series: arryseries,

			tooltip : {
				backgroundColor : 'rgba(0, 0, 0, 0.85)',
				style : {
					color : '#F0F0F0'
				}
			},
			drilldown : {
				activeAxisLabelStyle : {
					color : '#F0F0F3'
				},
				activeDataLabelStyle : {
					color : '#F0F0F3'
				}
			},

			navigation : {
				buttonOptions : {
					symbolStroke : '#DDDDDD',
					theme : {
						fill : '#505053'
					}
				}
			}

		});
	}

	/**
	 * 데이터 갱신을 시작합니다.
	 */
	GMXBOARD.startRadarCompositionImage = function(){
		_GetMonthData();
		_GetYearData();
	}

	/**
	 * PARAM 데이터 변경
	 */
	GMXBOARD.dataParam = function(data){
		var splitDate = data.split("-");
		_API_PARAM_MONTH_.year = splitDate[0];
		_API_PARAM_MONTH_.month = splitDate[1];
		_GetMonthData();
		_API_PARAM_YEAR_.year = splitDate[0];
		_GetYearData();
	}


	/**
	 * 데이터 갱신을 시작합니다.
	 */
	GMXBOARD.startRadarCompositionImage();

	/**
	 * Element 이벤트 생성
	 * 클릭이벤트 / 체인지 이벤트
	 */

	GMXBOARD["awsEvent"] = {};
	GMXBOARD.awsEvent["monTblClick"] = function(){
		if (document.getElementById('month_table').className != "monthsumry_is_on"){
			document.getElementById('month_table').className = "monthsumry_is_on";
			document.getElementById('month_graph').className = "";
		}
	}
	GMXBOARD.awsEvent["monGraphClick"] = function(){
		if (document.getElementById('month_graph').className != "monthsumry_is_on"){
			document.getElementById('month_table').className = "";
			document.getElementById('month_graph').className = "monthsumry_is_on";
		}
	}
	GMXBOARD.awsEvent["yearTblClick"] = function(){
		if (document.getElementById('year_table').className != "yearsumry_is_on"){
			document.getElementById('year_table').className = "yearsumry_is_on";
			document.getElementById('year_graph').className = "";
		}
	}
	GMXBOARD.awsEvent["yearGraphClick"] = function(){
		if (document.getElementById('year_graph').className != "yearsumry_is_on"){
			document.getElementById('year_table').className = "";
			document.getElementById('year_graph').className = "yearsumry_is_on";
		}
	}
	GMXBOARD.awsEvent["dateChange"] = function(){
		GMXBOARD.dataParam($("#dateChange").val());
	}
})(window.GMXBOARD);