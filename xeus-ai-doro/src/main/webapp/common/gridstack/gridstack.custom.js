
/**
 * 그리드 Util 객체입니다.
 */
(function(){
	if(GridStackUI && _){

		GridStackUI.Utils.Interval = null;
		GridStackUI.Utils.Charts = {};
		GridStackUI.Utils.Maps = {};
		GridStackUI.Utils.Images = new Array();
		GridStackUI.Utils.Socket = null;
		GridStackUI.Utils.ImagesInterval = {};
		GridStackUI.Utils.WeatherData = {'Hum':'', "Wind":'', "Rain":'', "Temp":0};
		GridStackUI.Utils.ServerData = {'SignCnt' : null,	'UsrCnt' : null, 'TodayEventCnt' : null,	'TodayAnalysCnt' : null,	'TodayTviusCnt' : null, 'GenderCount' : null};
		GridStackUI.Utils.AirData = {"Uv":'', "Uv_color":'', "Dust_pm10":'', "Dust_pm10_color":'', "Dust_pm25":'', "Dust_pm25_color":''};

		GridStackUI.Utils.startInterval = function(){
			//API 사용량 제한때문에 5분으로 변경
			GridStackUI.Utils.reloadData();
			GridStackUI.Utils.Interval = setInterval(function(){
				GridStackUI.Utils.reloadData();
				console.log('Dashboard Data Reload.');
			}, 300000);//1000*60*5

		};

		GridStackUI.Utils.stopInterval = function(){
			clearInterval(GridStackUI.Utils.Interval);
			GridStackUI.Utils.Interval = null;
		};

		GridStackUI.Utils.stopImagesInterval = function(){
			for(var key in GridStackUI.Utils.ImagesInterval){
				clearInterval(GridStackUI.Utils.ImagesInterval[key]);
				delete GridStackUI.Utils.ImagesInterval[key];
			}

		};

		GridStackUI.Utils.reloadData = function(){
			//기상정보 reload
			GridStackUI.Utils.setWeatherData();
			//서버데이터 reload
			GridStackUI.Utils.setServerData();
			//대기오염데이터 reload
			GridStackUI.Utils.setAirData();
			//차트데이터 reload
			GridStackUI.Utils.setChartData();
		};

		/**
		 * 그리드 포지션을 리턴합니다.
		 */
		GridStackUI.Utils.saveGrid = function(selector){
			var $slt = $('.grid-stack > .grid-stack-item:visible');
			if(selector) $slt = $(selector + " > .grid-stack-item:visible");
			return _.map($slt, function (el) {
				var node = $(el).data('_gridstack_node');
				// 위젯의 마지막 크기, 위치 저장
				$(el).data('_gridstack_node').lastTriedX = node.x;
				$(el).data('_gridstack_node').lastTriedY = node.y;
				$(el).data('_gridstack_node').lastTriedWidth = node.width;
				$(el).data('_gridstack_node').lastTriedHeight = node.height;

				var prop = $(el).find(".grid-stack-item-content").data();
				prop.target = $(el).find(".grid-stack-item-content").attr("target");
				return {
					x: node.x,
					y: node.y,
					width: node.width,
					height: node.height,
					minWidth: prop.minWidth,
					maxWidth: prop.maxWidth,
					minHeight: prop.minHeight,
					maxHeight: prop.maxHeight,
					type: prop.type,
					title: prop.title,
					content: prop.content,
					id: prop.id,
					target: prop.target
				};
			});
		}

		/**
		 * 모든 그리드를 제거 합니다.
		 */
		GridStackUI.Utils.clearGrid = function(selector){
			var grid = $(selector).data('gridstack');
			grid.removeAll();
		}

		/**
		 * 그리드를 로드합니다.
		 */
		GridStackUI.Utils.loadGrid = function(selector, data){
			var grid = $(selector).data('gridstack');
			grid.removeAll();

			var items = GridStackUI.Utils.sort(data);
            _.each(items, function (node) {
            	var $ele = $('<div><div class="grid-stack-item-content" /></div>');
            	$ele.find(".grid-stack-item-content").data(node)
            		.append('<div class="title">' + node.title + '</div>')
            		.append('<div class="content">' + node.content + '</div>');

            	var id = node.id;
            	grid.addWidget($ele, node.x, node.y, node.width, node.height, false, 1, 4, 1, 4, id);
            	if(id) $ele.find(".grid-stack-item-content").attr("id", id);
            });

            GridStackUI.Utils.setVertialSort();
            GridStackUI.Utils.setWidgetColor();
		}

		/**
		 * 위젯 내부의 컨텐츠를 수직 중앙 정렬합니다.
		 */
		GridStackUI.Utils.setVertialSort = function(selector){
			if(!selector) selector = ".grid-stack-item-content";
			$(selector).find(".content").each(function(){
				var pHeight = $(this).parent().height();
				var tHeight = $(this).height();
				var top = ((pHeight / 2) - (tHeight / 2)) + 10;
				$(this).css("top", top);
			});
		}

		/**
		 * 위젯의 배경색을 변경합니다.
		 */
		GridStackUI.Utils.setWidgetColor = function(selector){
			if(!selector) selector = ".grid-stack-item-content";
			var length = $(selector).length;
			$(selector).each(function(){
				$(this).css("background", GmxColor.random());
			});
		}

		/**
		 * 모든 차트를 생성합니다.
		 */
		GridStackUI.Utils.createAllChart = function(){
			GridStackUI.Utils.createBarChart("AgeBarChart");
			GridStackUI.Utils.createLineChart("TimeLineChart");
			GridStackUI.Utils.createCctvLineChart("CctvLineChart");
			GridStackUI.Utils.createEventLineChart("EventLineChart");
			GridStackUI.Utils.createAssetLineChart("AssetLineChart");
			GridStackUI.Utils.createGaugeChart("GaugeChart");
		}

		/**
		 * 특정 차트를 생성합니다.
		 */
		GridStackUI.Utils.createChart = function(selector){
			if(selector == "AgeBarChart") GridStackUI.Utils.createBarChart("AgeBarChart");
			if(selector == "TimeLineChart") GridStackUI.Utils.createLineChart("TimeLineChart");
			if(selector == "CctvLineChart") GridStackUI.Utils.createCctvLineChart("CctvLineChart");
			if(selector == "EventLineChart") GridStackUI.Utils.createEventLineChart("EventLineChart");
			if(selector == "AssetLineChart") GridStackUI.Utils.createAssetLineChart("AssetLineChart");
			if(selector == "GaugeChart") GridStackUI.Utils.createGaugeChart("GaugeChart", GridStackUI.Utils.WeatherData['Temp']);
		}

		/**
		 * 181208 장대건
		 * 온도차트 생성을 위한 온도 파라메타 추가.
		 */
		/*GridStackUI.Utils.createChart = function(selector, temp){
			if(selector == "GaugeChart") GridStackUI.Utils.createGaugeChart("GaugeChart", temp);
		}*/

		/**
		 * 모든 차트를 재정렬합니다.
		 */
		GridStackUI.Utils.setAllChartAlign = function(){
			/*for(var i=0; i<GridStackUI.Utils.Charts.length; i++){
				GridStackUI.Utils.Charts[i].reflow();
			}*/
			for(var key in GridStackUI.Utils.Charts){
				GridStackUI.Utils.Charts[key].reflow();
			}
		}

		/**
		 * 모든 생성된 차트와 배열을 삭제합니다.
		 */
		GridStackUI.Utils.removeAllChart = function(){
			/*for(var i=0; i<GridStackUI.Utils.Charts.length; i++){
				GridStackUI.Utils.Charts[i].destroy();
			}
			GridStackUI.Utils.Charts = new Array();*/
			for(var key in GridStackUI.Utils.Charts){
				GridStackUI.Utils.Charts[key].destroy();
			}
			GridStackUI.Utils.Charts = {};
		}

		/*
		 * 키값으로 차트를 삭제합니다.
		 */
		GridStackUI.Utils.removeChart  = function(key){
			GridStackUI.Utils.Charts[key] = null;
			delete GridStackUI.Utils.Charts[key];
		}

		/**
		 * 모든 지도를 생성합니다.
		 */
		GridStackUI.Utils.createAllMap = function(){
			GridStackUI.Utils.createEventMap("EventMap");
			GridStackUI.Utils.createCctvHitMap("CctvHitMap");
		}

		/**
		 * 특정 지도를 생성합니다.
		 */
		GridStackUI.Utils.createMap = function(selector){
			if(selector == "EventMap") GridStackUI.Utils.createEventMap("EventMap");
			if(selector == "CctvHitMap") GridStackUI.Utils.createCctvHitMap("CctvHitMap");
		}

		/**
		 * 모든 지도를 재정렬합니다.
		 */
		GridStackUI.Utils.setAllMapAlign = function(){
			for(var key in GridStackUI.Utils.Maps){
				GridStackUI.Utils.Maps[key].updateSize();
			}

			/*for(var i=0; i<GridStackUI.Utils.Maps.length; i++){
				GridStackUI.Utils.Maps[i].updateSize();
			}*/
		}

		/**
		 * 모든 생성된 지도와 배열을 삭제합니다.
		 */
		GridStackUI.Utils.removeAllMap = function(){
			for(var key in GridStackUI.Utils.Maps){
				GridStackUI.Utils.Maps[key] = null;
			}
			GridStackUI.Utils.Maps = {};


			/*for(var i=0; i<GridStackUI.Utils.Maps.length; i++){
				GridStackUI.Utils.Maps[i] = null;
			}
			GridStackUI.Utils.Maps = new Array();*/
		}

		GridStackUI.Utils.removeMap  = function(key){
			GridStackUI.Utils.Maps[key] = null;
			delete GridStackUI.Utils.Maps[key];
		}

		/**
		 * 특정 이미지를 생성합니다.
		 */
		GridStackUI.Utils.createImage = function(target){
//			if(target == "rader") GridStackUI.Utils.createRaderBxSlider(target);
			/*if(target == "satelite") GridStackUI.Utils.createSateliteBxSlider(target);
			if(target == "typhoon") GridStackUI.Utils.createTyphoonBxSlider(target);*/
			if(target == "rader") GridStackUI.Utils.createRaderAutoPlay(target);
			if(target == "satelite") GridStackUI.Utils.createSateliteAutoPlay(target);
			if(target == "typhoon") GridStackUI.Utils.createTyphoonAutoPlay(target);

		}

		/**
		 * 위젯에 바 차트를 생성합니다.
		 */
		GridStackUI.Utils.createBarChart = function(selector){
			if(!selector) selector = "AgeBarChart";

			var title = "연령대별 현황";
			if(arguments[1] !== undefined && arguments[1] !== "") title = arguments[1];

			var categories = [ '20세 이하', '20세~30세', '30세~40세', '40세~50세', '50세 이상' ];

			if(arguments[2] !== undefined && Array.isArray(arguments[2])) {
				categories = arguments[2][0];
				series = arguments[2][1];
			}
			GridStackUI.Utils.Charts[selector] =
				Highcharts.chart(selector, {
					chart : {
						type : 'column'
					},
					title : {
						text : title,
					},
					credits: {
			            enabled: false
			        },
			        legend: {
			        	//enabled: false
			        },
					xAxis : {
						categories : categories,
					},
					yAxis : {
						title: {
				    		enabled: false
				    	}
					},
				    tooltip: {
				        pointFormat: '<b>{point.y}명</b>'
				    },
					//series : getAgeStat(),
				    series : [{'name':'사람 수', 'data':[0,0,0,0,0]}]
				});


			$("#AgeBarChart").find(".highcharts-title").addClass("title");
		}

		/**
		 * 위젯에 라인 차트를 생성합니다.
		 */
		GridStackUI.Utils.createLineChart = function(selector){
			if(!selector) selector = "TimeLineChart";
			if(GridStackUI.Utils.Charts[selector]) {
				GridStackUI.Utils.Charts[selector].destroy();
				GridStackUI.Utils.removeChart(selector);
			}

			var title = '시간대별 접속 현황';
			if(arguments[1] !== undefined && arguments[1] !== "") title = arguments[1];

			var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			if(arguments[2] !== undefined && Array.isArray(arguments[2])) data = arguments[2];

			GridStackUI.Utils.Charts[selector] =
				Highcharts.chart(selector, {
				    chart: {
				        type: 'line'
				    },
				    title: {
				        text: title
				    },
				    subtitle: {
				        text: ''
				    },
				    credits: {
			            enabled: false
			        },
				    tooltip: {
				        pointFormat: '<b>{point.y}명</b>'
				    },
				    xAxis: {
				        categories: [
				        	'00시', '01시', '02시', '03시', '04시', '05시', '06시', '07시', '08시', '09시', '10시', '11시',
				          '12시', '13시', '14시', '15시', '16시', '17시', '18시', '19시', '20시', '21시', '22시', '23시',
				        ]
				    },
				    yAxis: {
				    	title: {
				    		enabled: false
				    	}
				    },
				    plotOptions: {
				        line: {
				            dataLabels: {
				                enabled: false,
				                //color: '#dd32ed',
				            },
				            enableMouseTracking: true,
				        },
				    },
				    series: [{
				        name: ' ',
				        data: data,
				        showInLegend: false
				    }]
				});


			$("#TimeLineChart").find(".highcharts-title").addClass("title");
		}

		/**
		 * 시간대별 CCTV 조회 현황 차트를 생성합니다.
		 */
		GridStackUI.Utils.createCctvLineChart = function(selector){
//			console.log(selector);
//			console.log(arguments[1]);
			if(!selector) selector = "CctvLineChart";
			if(GridStackUI.Utils.Charts[selector]) {
				try {
					GridStackUI.Utils.Charts[selector].destroy();
				} catch(e) {
					GridStackUI.Utils.Charts[selector] = null;
				}
				GridStackUI.Utils.removeChart(selector);
			}

			var title = '시간대별 CCTV 조회 현황';
			if(arguments[1] !== undefined && arguments[1] !== "") title = arguments[1];

			var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			if(arguments[2] !== undefined && Array.isArray(arguments[2])) data = arguments[2];

//			console.log(selector);
//			console.log(data);

			GridStackUI.Utils.Charts[selector] =
				Highcharts.chart(selector, {
				    chart: {
				        type: 'line'
				    },
				    title: {
				        text: title
				    },
				    subtitle: {
				        text: ''
				    },
				    credits: {
			            enabled: false
			        },
				    tooltip: {
				        pointFormat: '<b>{point.y}명</b>'
				    },
				    xAxis: {
				        categories: [
				        	'00시', '01시', '02시', '03시', '04시', '05시', '06시', '07시', '08시', '09시', '10시', '11시',
				          '12시', '13시', '14시', '15시', '16시', '17시', '18시', '19시', '20시', '21시', '22시', '23시',
				        ]
				    },
				    yAxis: {
				    	title: {
				    		enabled: false
				    	}
				    },
				    plotOptions: {
				        line: {
				            dataLabels: {
				                enabled: false,
				                //color: '#dd32ed',
				            },
				            enableMouseTracking: true,
				        },
				    },
				    series: [{
				        name: ' ',
				        data: data,
				        showInLegend: false
				    }]
				});

			$("#CctvLineChart").find(".highcharts-title").addClass("title");
		}

		/**
		 * 위젯에 파인 차트를 생성합니다.
		 */

		GridStackUI.Utils.createEventLineChart = function(selector){
			if(!selector) selector = "EventLineChart";
			if(GridStackUI.Utils.Charts[selector]) {
				GridStackUI.Utils.Charts[selector].destroy();
				GridStackUI.Utils.removeChart(selector);
			}

			GridStackUI.Utils.Charts[selector] =
				Highcharts.chart(selector, {
				    chart: {
				        type: 'bar'
				    },
				    credits: {
			            enabled: false
			        },
			        legend: {
			        	//enabled: false
			        },
				    title: {
				        text: '이벤트 종류별 발생 현황'
				    },
				    xAxis: {
				        categories: getEvtList(),
				        title: {
				            text: null
				        }
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: ''
				        },
				        labels: {
				            overflow: 'justify'
				        }
				    },
				    tooltip: {
				        valueSuffix: ' 건'
				    },
				    plotOptions: {
				        bar: {
				            dataLabels: {
				                enabled: true
				            }
				        }
				    },
				    legend: {
				        layout: 'vertical',
				        align: 'right',
				        verticalAlign: 'top',
				        x: -40,
				        y: 80,
				        floating: true,
				        borderWidth: 1,
				        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				        shadow: true
				    },
				    credits: {
				        enabled: false
				    },
				    series: [{
				        name: '오늘',
				        data: getEvtListData(Date.prototype.getYMD())
				    }, {
				        name: '어제',
				        data: getEvtListData(Date.prototype.getYMD()-1)
				    }]
				});

			$("#EventLineChart").find(".highcharts-title").addClass("title");
		}

		/**
		 * 위젯에 파인 차트를 생성합니다.
		 */

		GridStackUI.Utils.createAssetLineChart = function(selector){
			if(!selector) selector = "AssetLineChart";
			GridStackUI.Utils.Charts[selector] =
				Highcharts.chart(selector, {
				    chart: {
				        type: 'bar'
				    },
				    credits: {
			            enabled: false
			        },
			        legend: {
			        	//enabled: false
			        },
				    title: {
				        text: '장비별 상태 현황'
				    },
				    xAxis: {
				        categories: getAssetList(),
				        title: {
				            text: null
				        }
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: ''
				        },
				        labels: {
				            overflow: 'justify'
				        }
				    },
				    tooltip: {
				        valueSuffix: ' 건'
				    },
				    plotOptions: {
				        bar: {
				            dataLabels: {
				                enabled: true
				            }
				        }
				    },
				    legend: {
				        layout: 'vertical',
				        align: 'right',
				        verticalAlign: 'top',
				        x: -40,
				        y: 80,
				        floating: true,
				        borderWidth: 1,
				        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				        shadow: true
				    },
				    credits: {
				        enabled: false
				    },
				    series: [{
				        name: '오늘',
				        data: getAssetListData(Date.prototype.getYMD())
				    }, {
				        name: '어제',
				        data: getAssetListData(Date.prototype.getYMD()-1)
				    }]
				});

			$("#AssetLineChart").find(".highcharts-title").addClass("title");
		}

		/**
		 * 위젯에 게이지 차트를 생성합니다.
		 */
		GridStackUI.Utils.createGaugeChart = function(selector){
			if(!selector) selector = "GaugeChart";
			/*if(GridStackUI.Utils.Charts[selector]) {
				GridStackUI.Utils.Charts[selector].destroy();
				GridStackUI.Utils.removeChart(selector);
			}*/

			//if(arguments[1]) data = [Number(arguments[1])];
			var data = [0];
			if(!isNaN(GridStackUI.Utils.WeatherData['Temp'])) data = [Number(GridStackUI.Utils.WeatherData['Temp'])];
			GridStackUI.Utils.Charts[selector] =
				Highcharts.chart(selector, Highcharts.merge({
					chart: {
						type: 'solidgauge'
					},
					credits: {
			            enabled: false
			        },
			        title: {
				        text: '온도'
				    },

					pane: {
						center: ['50%', '85%'],
						size: '140%',
						startAngle: -90,
						endAngle: 90,
						background: {
							backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
							innerRadius: '60%',
							outerRadius: '100%',
							shape: 'arc'
						}
					},

					tooltip: {
						enabled: false
					},

				    // the value axis
					yAxis: {
						stops: [
						    [0.1, '#55BF3B'], // green
				            [0.5, '#DDDF0D'], // yellow
				            [0.9, '#DF5353'] // red
				        ],
				        lineWidth: 0,
				        minorTickInterval: null,
				        tickAmount: 2,
				        title: {
				            y: -70
				        },
				        labels: {
				            y: 16
				        }
				    },

				    plotOptions: {
				        solidgauge: {
				            dataLabels: {
				                y: 5,
				                borderWidth: 0,
				                useHTML: true
				            }
				        }
				    }
				}, {
					yAxis: {
						min: -30,
						max: 45,
						title: {
							text: ''
						}
					},

					credits: {
						enabled: false
					},

					series: [{
						name: '온도',
						data: data,
						dataLabels: {
							format: '<div style="text-align:center"><span style="font-size:25px;color:' +
								((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}℃</span>' +
								'<span style="font-size:12px;color:silver"></span></div>'
						}
					}]
				}));

			$("#GaugeChart").find(".highcharts-title").addClass("title");
		}

		GridStackUI.Utils.createHeatLayer = function(_opt) {
			var _style = new ol.style.Style();
			var _source = new ol.source.Vector();

			var _minResolution = 0;
			var _maxResolution = Infinity;
			var _zIdx = _opt.zIndex;
			var type = _opt.type;
			var group = _opt.group;
			var fnGroup = _opt.fnGroup;

			if (_opt != null && _opt.style != null) {
				_style = _opt.style;
			}
			if (_opt != null && _opt.source != null) {
				_source = _opt.source;
			}
			if (_opt != null && _opt.minResolution != null) {
				_minResolution = _opt.minResolution;
			}
			if (_opt != null && _opt.maxResolution != null) {
				_maxResolution = _opt.maxResolution;
			}

			var heatMap = new ol.layer.Heatmap({
				opacity: 0.9,

				name : _opt.name,
				visible : _opt.visible,
				updateWhileAnimating : true,
				updateWhileInteracting : true,
				source : _source,
				style : _style,

				/* 이주영 추가 2017-06-07 */
				type : type,
				zIndex : _zIdx,
				minResolution : _minResolution,
				maxResolution : _maxResolution,
				group : group,
				fnGroup : fnGroup
			});

			return heatMap;
		};

		/**
		 * 위젯에 히트맵 지도를 생성합니다.
		 */
		GridStackUI.Utils.createCctvHitMap = function(selector){
			if(!selector) selector = "CctvHitMap";

			//TODO 히트맵 처리 해야함.

			var heatLayer = GridStackUI.Utils.createHeatLayer(Layers["asset_cctv_heat"]);

			heatLayer.setVisible(true);

			var heatMap = new ol.Map({
				controls : ol.control.defaults().extend([
					new ol.control.ScaleLine()
		 	    ]),
				logo : false,
				renderer : 'canvas', // 'canvas' or 'webgl'
				target : selector, // 'xeus-map-content',
				layers : [
					Layers["daum_tile_map"].tile.createMapLayer({
						visible : true,
						proxy : false
					}),
					heatLayer
				],
				loadTilesWhileInteracting : true,
				loadTilesWhileAnimating : true,
				view : new ol.View({
					projection : ol.proj.get("EPSG:5186"),
					center : [ 202876.8435290633, 542661.0525658976 ],
					zoomFactor : 2,
					zoom : 15,
					minZoom : 9,
					maxZoom : 24
				})
			});





			Layers["asset_cctv_heat"].loadFunction(heatLayer, '', heatMap);



			$("#CctvHitMap").find(".ol-zoom").hide();

			GridStackUI.Utils.Maps[selector] = heatMap;

		}

		/**
		 * 위젯에 이벤트 지도를 생성합니다.
		 */
		GridStackUI.Utils.createEventMap = function(selector){
			if(!selector) selector = "EventMap";

			var eventVectorSource = new ol.source.Vector();
			var eventVectorLayer = new ol.layer.Vector({
				source: eventVectorSource,
				zIndex: 9999
			});
			eventVectorLayer.setVisible(true);

			var eventMap = new ol.Map({
				controls : ol.control.defaults().extend([
 					new ol.control.ScaleLine()
 		 	    ]),
				logo : false,
				renderer : 'canvas', // 'canvas' or 'webgl'
				target : selector, // 'xeus-map-content',
				layers : [
					Layers["daum_map"].tile.createSkyViewLayer({
						visible : true,
						proxy : false
					}),
					Layers["daum_hybrid"].tile.createHybridLayer({
						visible : true,
						proxy : false
					}),
					eventVectorLayer
				],
				loadTilesWhileInteracting : true,
				loadTilesWhileAnimating : true,
				view : new ol.View({
					projection : ol.proj.get("EPSG:5186"),
					center : [ 202876.8435290633, 542661.0525658976 ],
					zoomFactor : 2,
					zoom : 15,
					minZoom : 9,
					maxZoom : 24
				})
			});

			$("#EventMap").find(".ol-zoom").hide();

			GridStackUI.Utils.Maps[selector] = eventMap;

			if(GridStackUI.Utils.Socket == null){
				GridStackUI.Utils.Socket = new XeusWS(eventMap);
				GridStackUI.Utils.Socket.create("ws://" + location.host + "/xeus/event");
			}
		}

		/**
		 * 날씨정보를 갱신합니다.
		 */
		GridStackUI.Utils.setWeatherData = function(selector){
			//TODO 기상 정보 갱신

			/*{temp: "-1", rain: "10%", wind: "2.2m/s", hum: "10%"}*/
			var result = BoardAPI.getWeatherDataToBoard();
			if(result){
				if(result.hum) {
					GridStackUI.Utils.WeatherData['Hum'] = result.hum;
					if($('.gridPanel .grid-stack-item-content[target="hum"]').length > 0)
						$('.gridPanel .grid-stack-item-content[target="hum"]').find('.content').html(result.hum);
				}
				if(result.wind) {
					GridStackUI.Utils.WeatherData["Wind"] = result.wind;
					if($('.gridPanel .grid-stack-item-content[target="wind"]').length > 0)
						$('.gridPanel .grid-stack-item-content[target="wind"]').find('.content').html(result.wind);
				}
				if(result.rain) {
					GridStackUI.Utils.WeatherData["Rain"] = result.rain;
					if($('.gridPanel .grid-stack-item-content[target="rain"]').length > 0)
						$('.gridPanel .grid-stack-item-content[target="rain"]').find('.content').html(result.rain);
				}
				if(result.temp){
					GridStackUI.Utils.WeatherData["Temp"] = Number(result.temp);
					if($('.gridPanel .grid-stack-item-content[target="GaugeChart"]').length > 0){
						if(GridStackUI.Utils.Charts['GaugeChart']){
							GridStackUI.Utils.Charts['GaugeChart'].series[0].points[0].update(GridStackUI.Utils.WeatherData["Temp"]);
						}
					}

				}
			}
		}

		/**
		 * 서버 정보를 갱신합니다.
		 */
		GridStackUI.Utils.setServerData = function(selector){
			//TODO 차트 데이터 갱신
			var today = Date.prototype.getYMD();

			_common.callAjax("/board/getAccessCnt.json", {"useTime": today}, function(json){
				GridStackUI.Utils.ServerData['SignCnt'] = json.result;
			}, false);

			_common.callAjax("/board/getAllUserCnt.json", null, function(json){
				GridStackUI.Utils.ServerData['UsrCnt'] = json.result;
			}, false);

			_common.callAjax("/board/getEvtCnt.json", {"evtOutbDtm": today}, function(json){
				GridStackUI.Utils.ServerData['TodayEventCnt'] = json.result;
			}, false);

			_common.callAjax("/board/getAnalyCnt.json", {"analyDat": today}, function(json){
				GridStackUI.Utils.ServerData['TodayAnalysCnt'] = json.result;
			}, false);

			_common.callAjax("/board/getRqstCnt.json", {"procStatCd":'SK', "fnshDat": today}, function(json){
				GridStackUI.Utils.ServerData['TodayTviusCnt'] = json.result;
			}, false);

			_common.callAjax("/eventDmtia/getGenderCount.json", null, function(json){
				GridStackUI.Utils.ServerData['GenderCount'] = '<p style="font-size:36px; margin:0px;">' + json.result[0].dmtiaGender + ' ' + json.result[0].genderCnt + "<br>"	+ json.result[1].dmtiaGender + ' ' + json.result[1].genderCnt; + '</p>'//<br/>
			}, false);

			if($('.gridPanel .grid-stack-item-content[target="signCnt"]').length > 0)
				$('.gridPanel .grid-stack-item-content[target="signCnt"]').find('.content').html(GridStackUI.Utils.ServerData['SignCnt']);
			if($('.gridPanel .grid-stack-item-content[target="usrCnt"]').length > 0)
				$('.gridPanel .grid-stack-item-content[target="usrCnt"]').find('.content').html(GridStackUI.Utils.ServerData['UsrCnt']);
			if($('.gridPanel .grid-stack-item-content[target="todayEventCnt"]').length > 0)
				$('.gridPanel .grid-stack-item-content[target="todayEventCnt"]').find('.content').html(GridStackUI.Utils.ServerData['TodayEventCnt']);
			if($('.gridPanel .grid-stack-item-content[target="todayAnalysCnt"]').length > 0)
				$('.gridPanel .grid-stack-item-content[target="todayAnalysCnt"]').find('.content').html(GridStackUI.Utils.ServerData['TodayAnalysCnt']);
			if($('.gridPanel .grid-stack-item-content[target="todayTviusCnt"]').length > 0)
				$('.gridPanel .grid-stack-item-content[target="todayTviusCnt"]').find('.content').html(GridStackUI.Utils.ServerData['TodayTviusCnt']);
			if($('.gridPanel .grid-stack-item-content[target="genderCount"]').length > 0)
				$('.gridPanel .grid-stack-item-content[target="genderCount"]').find('.content').html(GridStackUI.Utils.ServerData['GenderCount']);

		}

		/**
		 * 대기오염정보를 갱신합니다.
		 */
		GridStackUI.Utils.setAirData = function(selector){
			//TODO 대기오염 정보 갱신
			var result = BoardAPI.getAirToDash();
			if(result){
				GridStackUI.Utils.AirData['Uv'] = result.ozone.stat;
				GridStackUI.Utils.AirData['Uv_color'] = result.ozone.color;
				GridStackUI.Utils.AirData["Dust_pm10"] = result.dust_pm10.stat;
				GridStackUI.Utils.AirData["Dust_pm10_color"] = result.dust_pm10.color;
				GridStackUI.Utils.AirData["Dust_pm25"] = result.dust_pm25.stat;
				GridStackUI.Utils.AirData["Dust_pm25_color"] = result.dust_pm25.color;

				if($('.gridPanel .grid-stack-item-content[target="uv"]').length > 0){
					$('.gridPanel .grid-stack-item-content[target="uv"]').find('.content').html(result.ozone.stat);
					$('.gridPanel .grid-stack-item-content[target="uv"]').css('background-color', result.ozone.color);
				}
				if($('.gridPanel .grid-stack-item-content[target="dust_pm10"]').length > 0){
					$('.gridPanel .grid-stack-item-content[target="dust_pm10"]').find('.content').html(result.dust_pm10.stat);
					$('.gridPanel .grid-stack-item-content[target="dust_pm10"]').css('background-color', result.dust_pm10.color);
				}
				if($('.gridPanel .grid-stack-item-content[target="dust_pm25"]').length > 0){
					$('.gridPanel .grid-stack-item-content[target="dust_pm25"]').find('.content').html(result.dust_pm25.stat);
					$('.gridPanel .grid-stack-item-content[target="dust_pm25"]').css('background-color', result.dust_pm25.color);
				}
			}
		}

		/**
		 *  차트 정보를 갱신합니다.
		 */
		GridStackUI.Utils.setChartData = function(selector){
			//TODO 차트 정보 갱신
			var $charts = $(".gridPanel .grid-stack-item-content[target$='Chart']");
			if ($charts.length == 0){
				return false;
			}else {
				$charts.each(function(){
					var chartId = $(this).attr("id");

					if(chartId=="AgeBarChart")
						GridStackUI.Utils.Charts['AgeBarChart'].series[0].setData(getAgeStat()[0].data);
					else if(chartId=="CctvLineChart")
						GridStackUI.Utils.Charts['CctvLineChart'].series[0].setData(getTodayCctvByTime());
					else if(chartId=="EventLineChart"){
						GridStackUI.Utils.Charts['EventLineChart'].xAxis[0].update({'categories':getEvtList(),'title':{'text': null}});
						GridStackUI.Utils.Charts['EventLineChart'].series[0].setData(getEvtListData(Date.prototype.getYMD()));
						GridStackUI.Utils.Charts['EventLineChart'].series[1].setData(getEvtListData(Date.prototype.getYMD()-1));
					}
					else if(chartId=="AssetLineChart"){
						GridStackUI.Utils.Charts['AssetLineChart'].xAxis[0].update({'categories':getAssetList(),'title':{'text': null}});
						GridStackUI.Utils.Charts['EventLineChart'].series[0].setData(getAssetListData(Date.prototype.getYMD()));
						GridStackUI.Utils.Charts['EventLineChart'].series[1].setData(getAssetListData(Date.prototype.getYMD()-1));
					}
					else if(chartId=="TimeLineChart")
						GridStackUI.Utils.Charts['TimeLineChart'].series[0].setData(getTodayAcesByTime());

				});
			}
		}

		GridStackUI.Utils.createRaderBxSlider = function(target){
			var result = BoardAPI.getRadarCompositionImage();
			if(result != null){
				var imgList = $(result).find("body").find("items").find("item").children();
				if(imgList.length > 0){
					var arr = [];
					imgList.each(function() {
						arr.push($(this).text());
					});
					arr.sort();
					var _widgetWidth = $('.grid-stack-item-content[target='+target+']').find(".title").width();
					//var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height() - $('.grid-stack-item-content[target='+target+']').find(".title").height();
					var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height();
					$('.grid-stack-item-content[target='+target+']').find(".content").append('<div class="bxTarget"></div>');
					for(var i=0; i<arr.length; i++){
						var $img = $('<img src="'+arr[i]+'" width="'+_widgetWidth+'" height="'+_widgetHeight+'"/>');
						if(i != 0) $img.addClass('hidden');
						$('.grid-stack-item-content[target='+target+']').find(".bxTarget").append($img);
					}

					//$('.grid-stack-item-content[target=test]').find(".content").cycle({fx:'fade', speed:500 });
					var _bxOpt = {
						auto: true,
						speed: 500,
						pause: 2000,
						mode:'horizontal',
						autoControls: false,
						pager:false
						//,controls = false
					};
					$('.grid-stack-item-content[target='+target+']').find(".bxTarget").bxSlider(_bxOpt);
					$('.grid-stack-item-content[target='+target+']').find(".bxTarget").find('img').removeClass("hidden");
					$('.grid-stack-item-content[target='+target+']').find(".content").css('top', '0px');
					GridStackUI.Utils.Images.push(target);

					GridStackUI.Utils.setVertialSort();
					$('.grid-stack-item-content[target='+target+']').css('overflow-y', 'hidden');
				}else{
					$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
				}
			} else {
				$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
			}

		}
		/*
		 * 181207 장대건
		 * 레이더 영상 화면전환 애니메이션 추가 */
		GridStackUI.Utils.createRaderAutoPlay = function(target){
			var result = BoardAPI.getRadarCompositionImage();
			if(result != null){
				var imgList = $(result).find("body").find("items").find("item").children();
				if(imgList.length > 0){
					var arr = [];
					imgList.each(function() {
						arr.push($(this).text());
					});
					arr.sort();

					var type = 'png';
					var getType = $(imgList[0]).text().split('.').slice(-1)[0];
					if(getType) type = getType;

					var _widgetWidth = $('.grid-stack-item-content[target='+target+']').find(".title").width();
					var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height();
					$('.grid-stack-item-content[target='+target+']').find(".content").append('<div class="imgWrap"></div>');
					$('.grid-stack-item-content[target='+target+']').find(".imgWrap").append('<img id="imgTarget" width="'+_widgetWidth+'" height="'+_widgetHeight+'" style="width:100%; height:100%;"/>');

					var count = 0;
					//console.log("arr.length :: " +arr.length);
					var raderItv = setInterval(function() {
						var src = arr[count++];
						if(MAP_PROXY_CHK){
							src = "/xeus/tms?url=" + src + "&type=" + type;
						}
						$('.grid-stack-item-content[target='+target+']').find("#imgTarget").attr('src', src);
						$('.grid-stack-item-content[target='+target+']').find(".content").css('top', '0px');
						//console.log("count :: " + count);
						if(count==arr.length){
							count=0;
						}
					}, 1500);

					GridStackUI.Utils.ImagesInterval[target] = raderItv;

					GridStackUI.Utils.Images.push(target);
					GridStackUI.Utils.setVertialSort();

					$('.grid-stack-item-content[target='+target+']').css('overflow-y', 'hidden');

				}else{
					$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
				}
			} else {
				$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
			}
		}

		GridStackUI.Utils.createSateliteBxSlider = function(target){
			var result = BoardAPI.getInsightSatelite('vis');
			if(result != null){
				var imgList = $(result).find("body").find("items").find("item").children();
				if(imgList.length > 0){
					var arr = [];
					imgList.each(function() {
						arr.push($(this).text());
					});
					arr.sort();
					var _widgetWidth = $('.grid-stack-item-content[target='+target+']').find(".title").width();
					//var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height() - $('.grid-stack-item-content[target='+target+']').find(".title").height();
					var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height();
					$('.grid-stack-item-content[target='+target+']').find(".content").append('<div class="bxTarget"></div>');
					for(var i=0; i<arr.length; i++){
						var $img = $('<img src="'+arr[i]+'" width="'+_widgetWidth+'" height="'+_widgetHeight+'"/>');
						if(i != 0) $img.addClass('hidden');
						$('.grid-stack-item-content[target='+target+']').find(".bxTarget").append($img);
					}

					//$('.grid-stack-item-content[target=test]').find(".content").cycle({fx:'fade', speed:500 });
					var _bxOpt = {
						auto: true,
						speed: 500,
						pause: 2000,
						mode:'horizontal',
						autoControls: false,
						pager:false
						//,controls = false
					};
					$('.grid-stack-item-content[target='+target+']').find(".bxTarget").bxSlider(_bxOpt);
					$('.grid-stack-item-content[target='+target+']').find(".bxTarget").find('img').removeClass("hidden");
					$('.grid-stack-item-content[target='+target+']').find(".content").css('top', '0px');
					GridStackUI.Utils.Images.push(target);

					GridStackUI.Utils.setVertialSort();
					$('.grid-stack-item-content[target='+target+']').css('overflow-y', 'hidden');
				}else{
					$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
				}
			}else{
				$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
			}
		}

		/*
		 * 181209 이은규
		 * 위성 영상 화면전환 애니메이션 추가 */
		GridStackUI.Utils.createSateliteAutoPlay = function(target){
			var result = BoardAPI.getInsightSatelite('vis');
			if(result != null){
				var imgList = $(result).find("body").find("items").find("item").children();
				if(imgList.length > 0){
					var arr = [];
					imgList.each(function() {
						arr.push($(this).text());
					});
					arr.sort();

					var type = 'png';
					var getType = $(imgList[0]).text().split('.').slice(-1)[0];
					if(getType) type = getType;

					var _widgetWidth = $('.grid-stack-item-content[target='+target+']').find(".title").width();
					var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height();
					$('.grid-stack-item-content[target='+target+']').find(".content").append('<div class="imgWrap"></div>');
					$('.grid-stack-item-content[target='+target+']').find(".imgWrap").append('<img id="imgTarget" width="'+_widgetWidth+'" height="'+_widgetHeight+'" style="width:100%; height:100%;"/>');

					var count = 0;
					//console.log("arr.length :: " +arr.length);
					var sateliteItv = setInterval(function() {
						var src = arr[count++];
						if(MAP_PROXY_CHK){
							src = "/xeus/tms?url=" + src + "&type=" + type;
						}
						$('.grid-stack-item-content[target='+target+']').find("#imgTarget").attr('src', src);
						$('.grid-stack-item-content[target='+target+']').find(".content").css('top', '0px');
						//console.log("count :: " + count);
						if(count==arr.length){
							count=0;
						}
					}, 1500);

					GridStackUI.Utils.ImagesInterval[target] = sateliteItv;

					GridStackUI.Utils.Images.push(target);
					GridStackUI.Utils.setVertialSort();

					$('.grid-stack-item-content[target='+target+']').css('overflow-y', 'hidden');

				}else{
					$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
				}
			} else {
				$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
			}
		}

		GridStackUI.Utils.createTyphoonBxSlider = function(target){
			var result = BoardAPI.getTyphoonInformation();
			if(result != null){
				var imgList = $(result).find("body").find("items").find("item").find('img');
				if(imgList.length > 0){
					var arr = [];
					imgList.each(function() {
						arr.push($(this).text());
					});
					arr.sort();
					var _widgetWidth = $('.grid-stack-item-content[target='+target+']').find(".title").width();
					//var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height() - $('.grid-stack-item-content[target='+target+']').find(".title").height();
					var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height();
					$('.grid-stack-item-content[target='+target+']').find(".content").append('<div class="bxTarget"></div>');
					for(var i=0; i<arr.length; i++){
						var $img = $('<img src="'+arr[i]+'" width="'+_widgetWidth+'" height="'+_widgetHeight+'"/>');
						if(i != 0) $img.addClass('hidden');
						$('.grid-stack-item-content[target='+target+']').find(".bxTarget").append($img);
					}

					//$('.grid-stack-item-content[target=test]').find(".content").cycle({fx:'fade', speed:500 });
					var _bxOpt = {
						auto: true,
						speed: 500,
						pause: 2000,
						mode:'horizontal',
						autoControls: false,
						pager:false
						//,controls = false
					};
					$('.grid-stack-item-content[target='+target+']').find(".bxTarget").bxSlider(_bxOpt);
					$('.grid-stack-item-content[target='+target+']').find(".bxTarget").find('img').removeClass("hidden");
					$('.grid-stack-item-content[target='+target+']').find(".content").css('top', '0px');
					GridStackUI.Utils.Images.push(target);

					GridStackUI.Utils.setVertialSort();
					$('.grid-stack-item-content[target='+target+']').css('overflow-y', 'hidden');
				}else{
					$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
				}
			}else{
				$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
			}
		}

		/*
		 * 181209 이은규
		 * 태풍 영상 화면전환 애니메이션 추가 */
		GridStackUI.Utils.createTyphoonAutoPlay = function(target){
			var result = BoardAPI.getTyphoonInformation();
			if(result != null){
				var imgList = $(result).find("body").find("items").find("item").children();
				if(imgList.length > 0){
					var arr = [];
					imgList.each(function() {
						arr.push($(this).text());
					});
					arr.sort();

					var type = 'png';
					var getType = $(imgList[0]).text().split('.').slice(-1)[0];
					if(getType) type = getType;

					var _widgetWidth = $('.grid-stack-item-content[target='+target+']').find(".title").width();
					var _widgetHeight = $('.grid-stack-item-content[target='+target+']').height();
					$('.grid-stack-item-content[target='+target+']').find(".content").append('<div class="imgWrap"></div>');
					$('.grid-stack-item-content[target='+target+']').find(".imgWrap").append('<img id="imgTarget" width="'+_widgetWidth+'" height="'+_widgetHeight+'" style="width:100%; height:100%;"/>');

					var count = 0;
					//console.log("arr.length :: " +arr.length);
					var typhoonItv = setInterval(function() {
						var src = arr[count++];
						if(MAP_PROXY_CHK){
							src = "/xeus/tms?url=" + src + "&type=" + type;
						}
						$('.grid-stack-item-content[target='+target+']').find("#imgTarget").attr('src', src);
						$('.grid-stack-item-content[target='+target+']').find(".content").css('top', '0px');
						//console.log("count :: " + count);
						if(count==arr.length){
							count=0;
						}
					}, 1500);

					GridStackUI.Utils.ImagesInterval[target] = typhoonItv;

					GridStackUI.Utils.Images.push(target);
					GridStackUI.Utils.setVertialSort();

					$('.grid-stack-item-content[target='+target+']').css('overflow-y', 'hidden');

				}else{
					$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
				}
			} else {
				$('.grid-stack-item-content[target='+target+']').find(".content").html('-');
			}
		}

		GridStackUI.Utils.setAllImageAlign = function(){
			if(GridStackUI.Utils.Images.length > 0){
				for(var i=0; i<GridStackUI.Utils.Images.length; i++){

					var _widgetWidth = $('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').width();
					//var _titleHeight = $('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find(".title").height();
					var _widgetHeight = $('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').height();// - _titleHeight;

					//console.log(_widgetWidth + ' // ' + _widgetHeight);

					//TODO bxslider일때는 따로 처리해야 함. 주석처리만 해놓음.
					/*$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('.bx-viewport').css('height', _widgetHeight+'px');
					$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('.bx-wrapper img').css('width', _widgetWidth+'px');
					$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('.bx-wrapper img').css('height', _widgetHeight+'px');*/

					//$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('.content').css('top'. _titleHeight+'px');

					$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('img').css('width', _widgetWidth+'px');
					$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('img').css('height', _widgetHeight+'px');
				}
			}
		}

		GridStackUI.Utils.removeA = function(arr) {
		    var what, a = arguments, L = a.length, ax;
		    while (L > 1 && arr.length) {
		        what = a[--L];
		        while ((ax= arr.indexOf(what)) !== -1) {
		            arr.splice(ax, 1);
		        }
		    }
		    return arr;
		}

	}
})();

function getEvtList(){
	var result = '';
	_common.callAjax('/stat/getEvtList.json', null, function(json){
		result = json.result;
	}, false);
	return result;
}

function getEvtListData(date){
	var _param = {};
	var list = getEvtList();
	var dataArr = [];

	_param['date'] = date;
	for(var i=0; i<list.length; i++){
		_param['orgNm'] = list[i];
		_common.callAjax("/stat/getEvtOrgzDayCnt.json", _param, function(json){
			if(json.result == undefined) json.result = 0;
			dataArr[i] = Number(json.result);
		}, false);
	}
	return dataArr;
}

function getAgeStat(){
	var series = [{name:'사람 수', 'data':[1, 2, 3, 4, 5]}];
	var cnt = [0, 0, 0, 0, 0];
	var year = Date.prototype.getY();
	var result;

	_common.callAjax("/board/getAgeStat.json", {"year":year, "subyear":year.substring(2, 4)}, function(json){
		result = json.result;
	}, false);

	for(var i=0; i<result.length; i++){
		if(result[i].age >= 0 && result[i].age < 20){
			cnt[0]++;
		} else if(result[i].age >= 20 && result[i].age < 30){
			cnt[1]++;
		} else if(result[i].age >= 30 && result[i].age < 40){
			cnt[2]++;
		} else if(result[i].age >= 40 && result[i].age < 50){
			cnt[3]++;
		} else{
			cnt[4]++;
		}
	}

	series[0].data = cnt;

	return series;
}

function getTodayAcesByTime(){
	var result;
	var data = [];

	_common.callAjax("/board/getTodayAcesByTime.json", {"today":Date.prototype.getYMD()}, function(json){
		result = json.result;
	}, false);

	for(var i=0; i<23; i++){
		if(i<10){
			data[i] = result['0'+String(i)];
		} else{
			data[i] = result[i];
		}
	}

	return data;
}

function getTodayCctvByTime(){
	var result;
	var data = [];

	_common.callAjax("/board/getTodayCctvByTime.json", {"today":Date.prototype.getYMD()}, function(json){
		result = json.result;
	}, false);

	for(var i=0; i<23; i++){
		if(i<10){
			data[i] = result['0'+String(i)];
		} else{
			data[i] = result[i];
		}
	}

	return data;
}

function getAssetListData(date){
	var _param = {};
	var list = getAssetList();
	var dataArr = [];

	_param['date'] = date;
	for(var i=0; i<list.length; i++){
		_param['orgNm'] = list[i];
		_common.callAjax("/stat/getAssetOrgzDayCnt.json", _param, function(json){
			if(json.result == undefined) json.result = 0;
			dataArr[i] = Number(json.result);
		}, false);
	}
	return dataArr;
}

function getAssetList(){
	var result = '';
	_common.callAjax('/stat/getAssetList.json', null, function(json){
		result = json.result;
	}, false);
	return result;
}