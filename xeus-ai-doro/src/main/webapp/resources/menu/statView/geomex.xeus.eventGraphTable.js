/**
 * 이벤트그래프테이블 script
 *
 * @auther 민동현
 */
"use strict";


$(function(){

	var validateParam = function(){
		if($("#time").val() == ""){
			alert("날짜를 입력해주세요.");
		}
	};


	/**
	 *  이벤트 이름으로 차트를 생성한다
	 */
	var makeChartFromEventStatByEvtNm = function(){

		var _param = {};
		_param["time"] = $(".graph_select_wrap").find(".time").val();
		_param["emdCd"] = $(".graph_select_wrap").find(".emdCd").val();
		_param["evtTypCd"] = $(".graph_select_wrap").find(".evtTypCd").val();

		for(var key in _param){
    		if(key == "time"){
    			_param["year"] = _param[key].split("-")[0];
    			_param["month"] = _param[key].split("-")[1];
    		}
    	}


		_common.callAjax("/stat/getEventStatByEvtNm.json",_param, function(json) {
    		var result = json.result;
    		var data = [];
    		for (var i=0; i<result.length; i++) {
    			var obj = {};
    			obj.name = result[i].evtNm;
    			obj.y = Number(result[i].count);

    			data.push(obj);
    		}


    		$(".eventStatByEvtNm").find(".chart_title").text($(".graph_select_wrap").find(".evtTypCd").val() == '' ? "전체 이벤트":$(".graph_select_wrap").find(".evtTypCd").val());

    		$("#pieGraphBtn").data("data",data);
    		$("#pieGraphBtn").data("selector", 'eventStatChartByEvtNm');

    		$("#barGraphBtn").data("data",data);
    		$("#barGraphBtn").data("selector", 'eventStatChartByEvtNm');

        	var activeId = $(".eventStatByEvtNm").find(".btn_box").find(".active").attr("id");
        	var emdNm = $(".graph_select_wrap").find(".emdCd option:selected").text();

        	if(activeId =="barGraphBtn"){
            	$("#pieGraphBtn").removeClass("active");

            	$("#barGraphBtn").addClass("active");

        		createBarChart('eventStatChartByEvtNm', data, emdNm);
        	}
        	else{

        		$("#pieGraphBtn").addClass("active");

            	$("#barGraphBtn").removeClass("active");

            	createPieChart('eventStatChartByEvtNm', data, emdNm);

        	}

		}, false);

	};


	/**
	 *  일별로 이벤트 차트를 생성한다
	 */
	var makeChartFromEventStatByTime = function(){

		var _param = {};
		_param["time"] = $(".graph_select_wrap").find(".time").val();
		_param["emdCd"] = $(".graph_select_wrap").find(".emdCd").val();
		_param["evtTypCd"] = $(".graph_select_wrap").find(".evtTypCd").val();

		for(var key in _param){
    		if(key == "time"){
    			_param["year"] = _param[key].split("-")[0];
    			_param["month"] = _param[key].split("-")[1];
    		}
    	}


		if(_param["month"] == null){
			makeChartFromEventStatByMonth(_param);
		}else{
			makeChartFromEventStatByDay(_param);
		}

	};


	var makeChartFromEventStatByDay = function(_param){
		_common.callAjax("/stat/getEvtDayStat.json",_param, function(json) {

			$("#eventStatChartByTime").html("");

			var selector = "eventStatChartByTime";
			var title = $(".graph_select_wrap").find(".evtTypCd").val() == '' ? "전체":$(".graph_select_wrap").find(".evtTypCd").val();
			var result = json.result;

			var time = $(".graph_select_wrap").find(".time").val();

			var year = time.split("-")[0];
			var month = time.split("-")[1];

			var categories = [];
			var tmpObj = {};

			//자바에서 월은 0~11이기 때문에 그대로 값을 넣고 날짜에 0을 넣으면 그 달의 마지막날이 구해진다.
			var lastDateOfMonth = new Date(year, month, 0);
			var lastDate = lastDateOfMonth.getDate();
			for(var k=1; k<=lastDate; k++){
				categories.push(k+'일');
				tmpObj[(k < 10) ? '0'+String(k) : k] = 0;
			}

			for(var i=0; i<result.length; i++){
				if(tmpObj[result[i].day] !== undefined)
					tmpObj[result[i].day] = result[i].count;
			}

			var series = [];
			var obj = {};
			obj['name'] = '이벤트 수';
			var dataArr = [];

			for(var i=1; i<=lastDate; i++){
				var arr = [];
				var name = i;
				arr.push(name +'일');
				if(name < 10) name = '0'+String(name);
				arr.push(Number(tmpObj[name]));
				dataArr.push(arr);
			}
			obj['data'] = dataArr;
			series.push(obj);

			var emdNm = $(".graph_select_wrap").find(".emdCd option:selected").text();

			createColumnChart(selector, categories, series, emdNm);

			$(".eventStatByTime").find(".chart_title").text(""+title+" " + "일별 이벤트");

		}, false);
	};

	var makeChartFromEventStatByMonth = function(_param){
		_common.callAjax("/stat/getEvtMonthStat.json",_param, function(json) {

			$("#eventStatChartByTime").html("");

			var selector = "eventStatChartByTime";
			var title = $(".graph_select_wrap").find(".evtTypCd").val() == '' ? "전체":$(".graph_select_wrap").find(".evtTypCd").val();
			var result = json.result;

			var time = $(".graph_select_wrap").find(".time").val();

			var year = time.split("-")[0];
			var month = time.split("-")[1];

			var categories = [];
			var tmpObj = {};

			var lastMonth = 12;
			for(var k=1; k<=lastMonth; k++){
				categories.push(k+'월');
				tmpObj[(k < 10) ? '0'+String(k) : k] = 0;
			}

			for(var i=0; i<result.length; i++){
				if(tmpObj[result[i].month] !== undefined)
					tmpObj[result[i].month] = result[i].count;
			}

			var series = [];
			var obj = {};
			obj['name'] = '이벤트 수';
			var dataArr = [];

			for(var i=1; i<=lastMonth; i++){
				var arr = [];
				var name = i;
				arr.push(name +'월');
				if(name < 10) name = '0'+String(name);
				arr.push(Number(tmpObj[name]));
				dataArr.push(arr);
			}
			obj['data'] = dataArr;
			series.push(obj);

			var emdNm = $(".graph_select_wrap").find(".emdCd option:selected").text();

			createColumnChart(selector, categories, series, emdNm);

			$(".eventStatByTime").find(".chart_title").text(""+title+" " + "월별 이벤트");

		}, false);
	};

	var createBarChart = function(selector, data, emdNm){
		var title = ""
		var color = "#000";
		var fontColor = "#fff";

		Highcharts.chart(selector, {
		    chart: {
		    	backgroundColor: color,
		    	plotBackgroundColor: null,
		        plotBorderWidth: null,
		        plotShadow: false,
		        type: 'bar',
//		        width: 900
		    },
		    title: {
		        text: emdNm,
		        style: {
		            fontSize: '16px',
		            color : fontColor
		        }
		    },
//		    subtitle: {
//		        text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
//		    },
		    accessibility: {
		        announceNewData: {
		            enabled: true
		        }
		    },
		    xAxis: {
		        type: 'category',
		        labels: {
		            style: {
		                color: fontColor
		            }
		        }
		    },
		    yAxis: {
		    	labels: {
		            style: {
		                color: fontColor
		            }
		        }
//		        title: {
//		            text: 'Total percent market share'
//		        }

		    },
		    legend: {
		        enabled: false
		    },
		    plotOptions: {
		        series: {
		            borderWidth: 0,
		            borderColor : color,
		            dataLabels: {
		                enabled: true,
		                format: '{point.y} 건'		            }
		        }
		    },

		    tooltip: {
		        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} 개</b> <br/>'
		    },

		    series: [
		        {
		            name: " ",
		            colorByPoint: true,
		            data: data
		        }
		    ],
		    exporting: {
		    	enabled: true
	        },
	        credits: {
	            enabled: false
	        }
		});

		applyChartTheme();
	}


	var createPieChart = function(selector, data, emdNm){

		var color = "#000";
		var fontColor = "#fff";

		Highcharts.chart(selector, {
		    chart: {
		    	plotBackgroundColor: null,
		    	backgroundColor : color,
		        plotBorderWidth: null,
		        plotShadow: false,
		        type: 'pie'
		    },
		    title: {
		        text: emdNm,
		        align: 'center',
		        style: {
		            fontSize: '18px',
		            color : fontColor
		        },
		        verticalAlign: 'middle',
		        x: -133,
		        y: 10
		    },
		    xAxis: {
		        labels: {
		            style: {
		                color: fontColor
		            }
		        }
		    },
		    yAxis: {
		    	labels: {
		            style: {
		                color: fontColor
		            }
		        }

		    },
//		    subtitle: {
//		        text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
//		    },
		    tooltip: {
		        pointFormat: '<b>{point.percentage:.1f}%</b>'
		    },
		    accessibility: {
		    	point: {
		            valueSuffix: '%'
		        }
		    },

		    plotOptions: {
		        pie: {
		            allowPointSelect: true,
		            cursor: 'pointer',
		            dataLabels: {
		                enabled: true,
		                format: '<b>{point.y} 건',
		                distance: -50,
			    		filter: {
		                    property: 'percentage',
		                    operator: '>',
		                    value: 1
		                },
		                //파이 안에 % 색상 안먹음
		                style: {
		                    fontWeight: 'normal',
		                    color: 'black',
		                    fontSize : '16px',
		                }
		            },
		            borderWidth: 0,
		            showInLegend: true
		        }
		    },
		    legend: {
		    	itemStyle: {
		    		fontFamily : 'Pretendard Variable',
		    		fontSize : '14px',
		    		fontWeight : 'normal'
		    	},
		        align: 'right',
		        itemMarginBottom: 15,
		        layout: 'vertical',
		        verticalAlign: 'middle',
		        useHTML: true,
		        labelFormatter: function() {
		        	var space = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
		        	return this.name + space + this.y + "건 " + space + this.percentage.toFixed(1) + '%';
//		        	return '<div style="width:150px;"><span style="float:right;padding:9px">' + this.name + space + this.y +'건 ' + space +  this.percentage.toFixed(1) + '%</span></div>';

	            },
		        x: -80,
//		        y: 0
		    },

		    series: [
		        {
		            name: "",
		            innerSize: "45%",
		            colorByPoint: true,
		            data: data
		        }
		    ],
		    exporting: {
		    	enabled: true
	        },
	        credits: {
	            enabled: false
	        }
		});

		applyChartTheme();
	};


	var createColumnChart = function(selector, categories, series, emdNm){

		var color = "#000";
		var fontColor = "#fff";

		Highcharts.chart(selector, {
			chart : {
				backgroundColor: color,
				type : 'column'
			},
			title : {
				text : emdNm,
		        style: {
		            fontSize: '16px',
		            color : fontColor
		        }
			},
			credits: {
	            enabled: false
	        },
	        legend: {
	        	enabled: false,
	        	itemStyle: {
		            color : fontColor
		        }
	        },
			xAxis : {
				categories : categories,
				labels: {
		            style: {
		                color: fontColor
		            }
		        }
			},
			yAxis : {
				title: {
		    		enabled: false
		    	},
				labels: {
					style: {
						color: fontColor
					}
				}
			},
		    tooltip: {
		        pointFormat: '<b>{point.y}</b>'
		    },
			series : series,
		    exporting: {
		    	enabled: true
	        }
		})

		applyChartTheme();
	};

	/**
	 * 테마 종류에 따라서 이미 생성된 차트에 테마를 적용한다
	 */
	var applyChartTheme = function(){

		var c = new Date().getYMDHMS_S();
		var cssNow = $('head').find('link[href*="main"]').attr('href');

		if(cssNow.contains('light')){
			$.getScript("./res/menu/statView/lightThemeChart.js?c=" + c, function(){});
		}else if(cssNow.contains('blue')){
			$.getScript("./res/menu/statView/blueThemeChart.js?c=" + c, function(){});
		}
		else {
			$.getScript("./res/menu/statView/blackThemeChart.js?c=" + c, function(){});
		}
	}



	/*
	 *  이벤트 타입 코드로 테이블을 생성한다
	 */

	var makeTableFromEventStatByEvtTypCd = function(){

		$("#eventStatTableByEvtTypCd").find("tbody").html("");
		$(".detailEventStatDiv").html("");


		var startDatText = $(".table_select_wrap").find(".startDat").val();
		var endDatText = $(".table_select_wrap").find(".endDat").val();
		$("#period").text(startDatText + " ~ " + endDatText + " ");

		var _param = {};
		_param["startDat"] = $(".table_select_wrap").find(".startDat").val().replaceAll("-","");;
		_param["endDat"] = $(".table_select_wrap").find(".endDat").val().replaceAll("-","");;
		_param["emdCd"] = $(".table_select_wrap").find(".emdCd").val();
		_param["evtTypCd"] = $(".table_select_wrap").find(".evtTypCd").val();


		_common.callAjax("/stat/getEventStatByEvtTypCd.json",_param, function(json) {

			var result= json.result;

			var sum = 0;

			for(var i=0; i<result.length; i++){
				var $tr = makeTrAboutEvtTypCd(result[i]);
				$("#eventStatTableByEvtTypCd").find("tbody").append($tr);

				sum += Number(result[i].count);
			}

			$("#eventStatTableByEvtTypCd").find("tfoot").find(".sum").text(sum);



			var _param = {};
			_param["startDat"] = $(".table_select_wrap").find(".startDat").val().replaceAll("-","");
			_param["endDat"] = $(".table_select_wrap").find(".endDat").val().replaceAll("-","");
			_param["emdCd"] = $(".table_select_wrap").find(".emdCd").val();
			_param["evtTypCd"] = $(".table_select_wrap").find(".evtTypCd").val();

			makeFold(_param);




		}, false);

	};

	/**
	 * 이벤트 타입 코드로 TR을 생성한다
	 */
	var makeTrAboutEvtTypCd = function(json){
		var $tr = $("<tr>").addClass("more").addClass("open").click(function(){
			$(this).toggleClass('open');
		});
//		.addClass("more").addClass("open");
		$tr.append($("<td>").addClass("evtTypCd").text(json.evtTypCd));
		$tr.append($("<td>").text(json.count));

		return $tr;
	};


	/**
	 * 이벤트 타입 코드에 대응하는 이벤트 이름을 TR 아래에 fold로 생성한다
	 * 참고 : 이벤트 이름은 이벤트 타입 코드의 하위 카테고리이다
	 */
	var makeFold = function(_param){

		_common.callAjax("/stat/getEventStatByEvtTypCdAndEvtNm.json",_param, function(json) {

			var result= json.result;

			for(var i=0; i<result.length; i++){

				var evtTypCd = result[i].evtTypCd;

				if(isEvtTypCdSame(evtTypCd)){
					makeFoldTr(result[i]);
				}
			}

		}, false);


	};

	/**
	 * 표출된 테이블에 해당 이벤트타입코드가 있는 지 여부를 확인한다
	 */
	var isEvtTypCdSame = function(evtTypCd){
		var result = false;
		$("#eventStatTableByEvtTypCd").find("tbody").find("tr").each(function(){
			if($(this).find(".evtTypCd").text() == evtTypCd){
				result= true;
			}
		});
		return result;
	}


	/**
	 *  fold 안에 하나의 tr을 생성한다
	 */
	var makeFoldTr = function(json){
		$("#eventStatTableByEvtTypCd").find("tbody").find("tr").each(function(){
			if($(this).find(".evtTypCd").text() == json.evtTypCd){
				var $nextTr = $(this).next();
				if($nextTr.hasClass("fold")){
					$nextTr.find("table").append(getFoldTr(json))
				}else{
					var $foldTr = $("<tr>").addClass("fold");
					var $foldTd = $("<td>").attr("colspan","2");
					var $table = $("<table>");
					var $evtNmTr = getFoldTr(json);

					$foldTr.append($foldTd.append($table.append($evtNmTr)));

					$(this).after($foldTr);
				}
			}
		});
	};

	/**
	 *   fold tr 생성 후 가져온다
	 */
	var getFoldTr = function(json){

		//fold tr 클릭 시, 상세 이벤트 통게 테이블 표출
		var $tr = $("<tr>").click(function(){

			var evtNm = $(this).find(".evtNm").text();
			createDetailEventStatTable(evtNm, false);
			$("tr").removeClass('active');
			$(this).addClass('active');

		});
		var $evtNmTd = $("<td>").addClass("evtNm").text(json.evtNm);
		var $countTd = $("<td>").text(json.count);

		$tr.append($evtNmTd).append($countTd);

		return $tr;
	};

	/**
	 * 상세 이벤트통계테이블을 생성한다
	 *
	 * parameter
	 * 		evtNm : 이벤트명
	 * 		isSearchBtn : 검색버튼을 클릭했는 지 여부
	 */
	var createDetailEventStatTable = function(evtNm, isSearchBtn){

		var isChange = $(".select_wrap").data("isChange");

		if(isChange && !isSearchBtn){
			alert("조건이 바뀌었습니다. 검색을 먼저 눌러주세요.");
			return;
		}

		var _param = {};
		_param["startDat"] = $(".table_select_wrap").find(".startDat").val().replaceAll("-","");
		_param["endDat"] = $(".table_select_wrap").find(".endDat").val().replaceAll("-","");
		_param["emdCd"] = $(".table_select_wrap").find(".emdCd").val();
		_param["evtTypCd"] = $(".table_select_wrap").find(".evtTypCd").val();
		_param["evtNm"] = evtNm;
		_param["limit"] = 10;
		_param["offset"] = 0;

		$(".detailEventStatDiv").data("param",_param);

		_common.callAjax("/stat/getDetailEventStatTableView.do",_param, function(view) {
			$(".detailEventStatDiv").html("");
			$(".detailEventStatDiv").append(view);

		}, false);
	}

	var getTodayInfo = function(){

		var today = new Date();
		var todayYear = today.getFullYear();
//		var todayMonth = today.getMonth()+1;
		var todayMonth = today.getMonth();
		var todayDate = today.getDate();

		var result = {};
		result.year = todayYear;
		result.month = todayMonth;
		result.day = todayDate;

		return result;
	};

	var getOneMonthAgoInfo = function(){
		var today = new Date();
		var oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
		var oneMonthAgoYear = oneMonthAgo.getFullYear();
//		var oneMonthAgoMonth = oneMonthAgo.getMonth()+1;
		var oneMonthAgoMonth = oneMonthAgo.getMonth();
		var oneMonthAgoDate = oneMonthAgo.getDate();

		var result = {};
		result.year = oneMonthAgoYear;
		result.month = oneMonthAgoMonth;
		result.day = oneMonthAgoDate;

		return result;
	}

	/**
	 *  자릿수만큼 앞에 0을 붙혀준다
	 */
	var numberPad = function(n, width) {
	    n = n + '';
	    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}



    $('.more').on('click', function(){
        $(this).toggleClass('open');
    });

    /**
     * 합계 이벤트 클릭 시
     */
	$("#eventStatTableByEvtTypCd").find("tfoot").find("tr").click(function(){
		createDetailEventStatTable("", false);
		$('tr').removeClass('active');
	});


    /**
     * 그래프 보기 클릭 시
     */
    $('#graphView').on('click', function(){
        $(this).addClass('active').siblings().removeClass('active');
        $('.stat_graph').addClass('active');
        $('.stat_table').removeClass('active');

        $('.table_select_wrap').addClass("hidden");
        $('.graph_select_wrap').removeClass("hidden");
    });

    /**
     * 테이블 보기 클릭 시
     */
    $('#tableView').on('click', function(){
        $(this).addClass('active').siblings().removeClass('active');
        $('.stat_table').addClass('active');
        $('.stat_graph').removeClass('active');

        $('.table_select_wrap').removeClass("hidden");
        $('.graph_select_wrap').addClass("hidden");

    });

    /**
     * 원형 그래프 클릭 시
     */
    $("#pieGraphBtn").click(function(){
    	var data = $(this).data("data");
    	var selector = $(this).data("selector");

    	$(this).addClass("active");
    	$("#barGraphBtn").removeClass("active");

    	var emdNm = $(".graph_select_wrap").find(".emdCd option:selected").text();
    	createPieChart(selector,data,emdNm);
    });


    /**
     * 월 버튼 클릭 시
     */
    $("#monthBtn").click(function(){


    	$(this).addClass("active");
    	$("#yearBtn").removeClass("active");

    	$(this).parent().parent().find(".time").remove();

    	var today = getTodayInfo();

    	$(this).parent().after('<input name="time" class="sendData time" type="month">');
		$(".graph_select_wrap").find(".time").val(today.year + "-" + numberPad(today.month,2));

    });


    /**
     * 년 버튼 클릭 시
     */
    $("#yearBtn").click(function(){

    	$(this).addClass("active");
    	$("#monthBtn").removeClass("active");

    	$(this).parent().parent().find(".time").remove();

    	var today = getTodayInfo();


    	$(this).parent().after('<input class="sendData time" type="number" name="time" placeholder="YYYY" min="2010" max="2100">');
		$(".graph_select_wrap").find(".time").val(today.year);

    });


    /**
     *  막대 그래프 클릭 시
     */
    $("#barGraphBtn").click(function(){
    	var data = $(this).data("data");
    	var selector = $(this).data("selector");

    	$(this).addClass("active");
    	$("#pieGraphBtn").removeClass("active");

    	var emdNm = $(".graph_select_wrap").find(".emdCd option:selected").text();
    	createBarChart(selector,data, emdNm);
    });



    /*
     * 그래프 보기에서 검색 클릭 시
     */
    $(".graph_select_wrap").find(".btn_search").click(function(){

    	makeChartFromEventStatByEvtNm();

    	makeChartFromEventStatByTime();


    });

    /*
     * 테이블 보기에서 검색 클릭 시
     */
    $(".table_select_wrap").find(".btn_search").click(function(){

    	makeTableFromEventStatByEvtTypCd();

    	createDetailEventStatTable("", true);

    	$(".select_wrap").data("isChange", false);

    });

    /**
     * 사용자가 날짜, 읍면동, 이벤트 종류를 선택했을 경우
     */
    $(".table_select_wrap").find(".startDat, .endDat, .emdCd, .evtTypCd").change(function(){
    	$(".select_wrap").data("isChange", true);
    });


//    $(".graph_select_wrap").find(".yearOrMonth").change(function(){
//    	var yearOrMonth = $(this).val();
//
//    	$(this).parent().find(".time").remove();
//
//    	var today = getTodayInfo();
//
//    	if(yearOrMonth == 'month'){
//    		$(this).after('<input name="time" class="sendData time" type="month">');
//    		$(".graph_select_wrap").find(".time").val(today.year + "-" + numberPad(today.month,2));
//
//    	}else if(yearOrMonth == 'year'){
//    		$(this).after('<input class="sendData time" type="number" name="time" placeholder="YYYY" min="2010" max="2100">');
//    		$(".graph_select_wrap").find(".time").val(today.year);
//    	}
//    });


    $(".table_top_box").find("#eventExcelDownBtn").click(function(){
    	var txt = '이벤트 정보';
		var $table = $("<table>");
		var $colgroup = $("<colgroup>");
		$colgroup.append('<col width="200"><col width="200"><col width="700"><col width="200"><col width="200">');

		var $thead = $("<thead>");
		$thead.append('<tr><th>이벤트 종류</th><th>발생 건수</th></tr>');
		var $tbody = $("<tbody>");



		$("#eventStatTableByEvtTypCd").find("tr").each(function(){
			if($(this).find(".evtTypCd").length > 0 ){
				var evtTypCd = $(this).find(".evtTypCd").text();
				var cnt = $(this).find(".evtTypCd").next().text();
				$tbody.append('<tr><td>'+"▲ "+evtTypCd+'</td><td>'+cnt+'</td></tr>');

				if($(this).next().find(".evtNm").length > 0){
					$(this).next().find(".evtNm").each(function(){
						var evtNm = $(this).text();
						var cnt = $(this).next().text();
						$tbody.append('<tr><td>'+evtNm+'</td><td>'+cnt+'</td></tr>');
					});
				}
			}
		});


		var sum = $("#eventStatTableByEvtTypCd").find(".sum").text();
		var $tr = $("<tr>").css("font-weight", "bold")
		$tr.append('<td>'+'합계'+'</td><td>'+sum+'</td>');
		$tbody.append($tr);


	//		$table.find(".hashValue").css("display","table-cell");
		$table.append($colgroup).append($thead).append($tbody);

		$table.css("border", "medium  solid black");
		$table.find("th").css("font-weight", "bold").width("auto").height(80).css("border", "medium  solid black").css("background", "#0078d4");
		$table.find("td").css("text-align", "center").height(80).css("border", "medium  solid black");

		var data_type = 'data:application/vnd.ms-excel;charset=utf-8';
		var table_html = encodeURIComponent($table[0].outerHTML);

		var a = document.createElement('a');
		a.href = data_type + ',%EF%BB%BF' + table_html;
	    a.download = txt + '.xls';
	    a.click();
	    $(a).remove();

    });
    /* 210928 백유림 차트 dialog resize 임의로 추가한 것이니 확인 후 수정 부탁드립니다. */

	$(window).on('resize', function(){
		$('[aria-describedby="contentWrap"]').width($(window).width());
		$('[aria-describedby="contentWrap"]').height($(window).innerHeight());
		$('#contentWrap').width($(window).width());
		$('#contentWrap').height($(window).innerHeight() - 134);
	})


	$(document).ready(function(){

		var today = getTodayInfo();

		var oneMonthAgo = getOneMonthAgoInfo();

		//그래프, 테이블  default 날짜 설정
		$(".graph_select_wrap").find(".time").val(today.year + "-" + numberPad(today.month,2));

		$(".table_select_wrap").find(".startDat").val(oneMonthAgo.year + "-" + numberPad(oneMonthAgo.month,2) + "-" + numberPad(oneMonthAgo.day,2));
		$(".table_select_wrap").find(".endDat").val(today.year + "-" + numberPad(today.month,2) + "-" + numberPad(today.day,2));


		var timeout = setTimeout(function(){

			$(".graph_select_wrap").find(".btn_search").click();
			$(".table_select_wrap").find(".btn_search").click();

			clearTimeout(timeout);
			timeout = null;
		}, 50);
	});



})