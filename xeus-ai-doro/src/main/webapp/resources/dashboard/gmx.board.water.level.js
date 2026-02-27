/**
 * 수위 정보 API 모듈입니다.
 *
 * @author 민동현
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};

(function(GMXBOARD){

	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 60000;
	var _ELEMENT_ID_ = "waterLevel";

	var hwacheonDamCode = 1018683;	//화천댐코드

	var today = new Date();
	var yesterday = new Date(today.setDate(today.getDate() - 1));
	var nowStr = new Date().getYMDHM();
	var yesterdayStr = new Date().formatDateToStr(yesterday).substring(0,12);

	var _TIME_TYPE = "1H";
	var _API_KEY_ = "1893949F-56CC-48A9-98EC-7F0632E04AE2";

	var _API_URL_ = "http://api.hrfco.go.kr/" + _API_KEY_ + "/waterlevel/list/" + _TIME_TYPE + "/"+hwacheonDamCode + "/" + yesterdayStr + "/" + nowStr + ".xml";


	var _API_PARAM_ = {
		url : _API_URL_
	};

	var waterLevelList = null;

	var _GetData = function(){


		$.ajax({
			url : "../GMT_proxy/dmz", //외부 서비스 전용
			data : _API_PARAM_,
			success : function(xml) {

				var $xml = $(xml);


				if($xml.find("entities").length > 0){
					if($xml.find("content").length > 0){
						if($xml.find("content").children().length > 0){
							waterLevelList = $xml.find("entities").find("content").children();
						}
					}
				}
				var dataObjList = [];

//				var dataObj= {
//						name : "단면적",
//						data : []
//				};
				var attentionObj = {
						name : "관심",
						data : []
				};
				var cautionObj = {
						name : "주의",
						data : []
				};
				var guardObj = {
						name : "경계",
						data : []
				};
				var seriousObj = {
						name : "심각",
						data : []
				};
				var nowObj = {
						name : "현재",
						data : []
				};

				var date = new Date();

				for ( var i = waterLevelList.length-1; i >=0; i-- ) {
					var obj = $(waterLevelList[i]);

					var waterLevel = Number(obj.find("wl").text());;
					var time = obj.find("ymdhm").text();

//					dataObj.data.push(
//						{
//							x: new Date(time.substring(0,4), time.substring(4,6)-1, time.substring(6,8), time.substring(8,10)).getTime()+(3600000*9),
//							y : waterLevel
//						}
//					);
					attentionObj.data.push(
						{
							x: new Date(time.substring(0,4), time.substring(4,6)-1, time.substring(6,8), time.substring(8,10)).getTime()+(3600000*9),
							y : 14.50
						}
					);
					cautionObj.data.push(
						{
							x: new Date(time.substring(0,4), time.substring(4,6)-1, time.substring(6,8), time.substring(8,10)).getTime()+(3600000*9),
							y : 18.70
						}
					);
					guardObj.data.push(
						{
							x: new Date(time.substring(0,4), time.substring(4,6)-1, time.substring(6,8), time.substring(8,10)).getTime()+(3600000*9),
							y : 20.30
						}
					);
					seriousObj.data.push(
						{
							x: new Date(time.substring(0,4), time.substring(4,6)-1, time.substring(6,8), time.substring(8,10)).getTime()+(3600000*9),
							y : 21.87
						}
					);
					nowObj.data.push(
						{
							x: new Date(time.substring(0,4), time.substring(4,6)-1, time.substring(6,8), time.substring(8,10)).getTime()+(3600000*9),
							y : waterLevel
						}
					);
				}

//				dataObjList.push(dataObj);
				dataObjList.push(attentionObj);
				dataObjList.push(cautionObj);
				dataObjList.push(guardObj);
				dataObjList.push(seriousObj);
				dataObjList.push(nowObj);


				$('#waterLevel').html('');
				$('#waterLevel').append('<div id="waterLevelChart"></div>');

				makeWaterLevelChart("waterLevelChart", "수위 정보", dataObjList);


			},
			error : function(xhr, status, error){
				console.error(">> 수위 정보 데이터 가져오기 실패");
			}
		});
	};


	/**
	 * 수위정보 데이터로 차트를 생성합니다
	 */
	var makeWaterLevelChart = function(selector, title, dataObjList){

		Highcharts.chart(selector, {

			chart: {
				type: 'spline',
				scrollablePlotArea: {
//					minWidth: 600,
					scrollPositionX: 1
				},
				borderColor: '#BABABA',
				backgroundColor: '#30303A',
				plotBackgroundColor: '#FFFFFF',
			},
			legend: {
		        align: 'top',
		        verticalAlign: 'top',
		        padding:30,
		        itemStyle: {
		            color: '#ffffff',
		            fontWeight: 'bold'
		        }
//		        layout: 'vertical',
//		        x: 0,
//		        y: 100
		    },


			title : {
				align : 'left',
				text : title,
				margin: 40,
				style : {
					fontWeight : 'bold',
					color: '#FFFFFF',
				}
			},


			subtitle: {
		        text: '거리(m)(영점포고 : 0 EL.m)',
		        align: 'center',
		        y: 65,
		        style : {
					fontWeight : 'bold',
					color: '#FFFFFF'
				}
		    },

		    xAxis: { // Primary xAxis
				gridLineWidth: 1,
				tickmarkPlacement: 'on',
				type: 'datetime',
	            labels: {
	                format: '{value:%d %H:%M}',
	                rotation: -45,
	                style: {
//	                    color: Highcharts.getOptions().colors[2],
	                    fontSize:'11px',
	                    fontWeight: 'bold'
	                }
	            },
//	            title: {
//	                text: '시간',
//	               // margin: 260,
//	                style: {
////	                    color: Highcharts.getOptions().colors[2],
//	                    fontSize:'11px',
//	                    fontWeight: 'bold'
//	                }
//	            },
	            legend: { // 범례 사용안함
	     		    enabled: false
	    		},
//	            categories:nuDataList,
	            tickInterval:7

	        },
		    yAxis: [{ // left y axis
		        title: {
		            text: "수위표고(m)",
		            x: -12,
		            style: {
	                    color: '#FFFFFF',
//	                    fontSize:'12px',
//	                    fontWeight: 'bold'
	                }
		        },
		        labels: {
		            align: 'left',
//		            x: 10,
//		            y: 16,
		            format: '{value:.,0f}',
		            style: {
	                    color: '#FFFFFF',
//	                    fontSize:'12px',
//	                    fontWeight: 'bold'
	                }
		        },
		        showFirstLabel: false
		    }, { // right y axis
		        linkedTo: 0,
		        gridLineWidth: 0,
		        opposite: true,
		        title: {
		            text: "해발표고(EL.m)",
		            x: 12,
		            style: {
	                    color: '#FFFFFF',
//	                    fontSize:'12px',
//	                    fontWeight: 'bold'
	                }
		        },
		        labels: {
		            align: 'right',
//		            x: -10,
//		            y: 16,
		            format: '{value:.,0f}',
		            style: {
	                    color: '#FFFFFF',
//	                    fontSize:'12px',
//	                    fontWeight: 'bold'
	                }
		        },
		        showFirstLabel: false
		    }],
			//yAxis : yA,
			navigation : {
				buttonOptions : {
					enabled : false
				}
			},

			tooltip: {
				shared : true,
				valueDecimals: 2,
				valueSuffix: '(m)',
				xDateFormat: '%d %H:%M',
				crosshairs: true,
	            enabled: true,
		    },

		    plotOptions: {
		           spline: {
		               lineWidth: 2,
		               states: {
		                   hover: {
		                       lineWidth: 3
		                   }
		               },
		               marker: {
		                   enabled: false
		               }
		           },
		           area: {
		        	   fillOpacity: 1.5,
		                  fillColor: {
		                   linearGradient: { x1: 0, y1: 0, x2: 0, y2: 2},
		                    stops: [
		                       [0, Highcharts.getOptions().colors[1]],
		                       [1, Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0).get('rgba')]
		                   ]
		               },
		               marker: {
		                   enabled: false,
		                   symbol: 'circle',
		                   radius: 2,
		                   states: {
		                       hover: {
		                           enabled: true
		                       }
		                   }
		               },
		               lineWidth: 1,
		               states: {
		                   hover: {
		                       lineWidth: 2,
		                       pointStart: 0
		                   }
		               },
		               threshold: null
		           }
		       },

			series: dataObjList,

			credits: {
				enabled: false
			}

			/*series : json,
			pointStart: 2010*/
		});

	}

	/**
	 * 데이터 갱신을 시작합니다.
	 */
	GMXBOARD.startWaterLevelInterval = function(){
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
	GMXBOARD.stopWaterLevelInterval = function(){
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

		if(_INTERVAL_ != null) GMXBOARD.startWaterLevelInterval();
	}

	/**
	 * 데이터 갱신을 시작합니다.
	 */
	$(document).ready(function(){

		if($("#"+_ELEMENT_ID_).length == 0) {
			GMXBOARD.stopWaterLevelInterval();
			console.error(_ELEMENT_ID_+" ELEMENT가 없습니다.");
			return false;
		};

		GMXBOARD.startWaterLevelInterval();
	});
//	_GetData();
})(window.GMXBOARD);