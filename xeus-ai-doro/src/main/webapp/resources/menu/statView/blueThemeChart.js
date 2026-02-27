/**
 * 차트에 블랙 테마 적용하는 스크립트입니다.
 *
 *
 *
 * @author 민동현
 */
(function(){


		if($("#eventStatChartByEvtNm").length > 0 || $("#eventStatChartByTime").length > 0){
//			var timer = setTimeout(function(){
				var color = "#fff";
				var color2 = "#f7f7f7";
				var fontColor = "#000";
				var lineColor = '#ddd';
				var fSize = '14px';

				if($("#eventStatChartByEvtNm").highcharts().series[0].type == 'bar'){
					var plotColor = "#000";
				}else{
					var plotColor = "#fff";
				}

				$("#eventStatChartByEvtNm").highcharts().chartBackground.css({
					color: color2,
				});


				$("#eventStatChartByEvtNm").highcharts().update({
					colors : ['#ec2663', '#fea23d', '#41d58b', '#6f9efa', '#9340ff', '#f7694a', '#069cf9', '#ba46f7', '#ea5353', '#82dd64', '#f467a1', '#9dc0f4', '#2a78f4', '#ffc231', '#b383ff', '#ff8676', '#7deaac', '#de97ff', '#a2e28d', '#e583d2'],
					title : {
						style: {
							color : fontColor
						}
					},
					xAxis: {
						labels: {
							style: {
								color:  fontColor,
								fontSize: fSize
							}
						},
						tickColor: lineColor,
						lineColor: lineColor
					},
					yAxis: {
						labels: {
							style: {
								color:  fontColor
							}
						},
						gridLineColor: lineColor,
						tickColor: lineColor,
						title: {
							text: ''
						}
					},
					plotOptions: {
				        series: {
				            borderColor : color2,
				            dataLabels: {
				                style: {
				                  textOutline: 0,
				                  fontSize: fSize
				                },
				                color:  plotColor
				            }
				        }
				    },
				    legend: {
				    	itemStyle: {
				    		color: fontColor
				    	}
				    }
				});



				$("#eventStatChartByTime").highcharts().chartBackground.css({
					color: color,
				});

				$("#eventStatChartByTime").highcharts().update({
					colors : ['#599ad4'],
					title : {
						style: {
							color : fontColor
						}
					},
					xAxis: {
						labels: {
							style: {
								color:  fontColor
							}
						},
						gridLineColor: lineColor,
						tickColor: lineColor,
						lineColor: lineColor
					},
					yAxis: {
						labels: {
							style: {
								color:  fontColor
							}
						},
						gridLineColor: lineColor,
						tickColor: lineColor
					},
					legend: {
						itemStyle: {
							color : fontColor
						}
					},
					plotOptions: {
				        series: {
				            borderColor : color,
				        }
				    },
				    series: {
				    	   showInLegend: false
				    }
				});


//				clearTimeout(timer);
//				timer = null;
//			},100)

	}


})();