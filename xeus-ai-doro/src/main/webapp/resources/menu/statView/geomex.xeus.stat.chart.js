var timer = null;
var delta = 100;

var yearChart = null;
var monthChart = null;
var dayChart = null;
var orgzYearChart = null;
var orgzMonthChart = null;
var orgzDayChart = null;

var zoomLevel=1;

var objName = "수";

$(document).ready(function(){

	if(url == 'Usr'){
		objName = "접속자 수";
	} else if(url == 'Evt'){
		objName = "이벤트 발생 수";
	} else if(url == 'EvtCctv'){
		objName = "영상조회 수";
	} else if(url == 'Asset'){
		objName = "장비관리 수";
	}

	zoomLevel = window.devicePixelRatio || 1;
	setParam();
	setContent('user', typ);
	$(".contentWrapper").find("#center-overlay-west #searchBox").css("display", "");
	resizeDone();
	$('.contentWrapper .useritem').find('.highcharts-button-box').remove();

	$(".exportExcel").css("cursor", "pointer").attr("title", "더블 클릭하여 엑셀 다운로드").dblclick(function(){
		var txt = $(this).text();

		var $table = $(this).parent().find("table").clone().css("border", "1px solid black").css("color", "white");
		$table.find("th").css("background", "#21222B").css("font-weight", "bold").width("auto").height(30);
		$table.find("td").css("background", "#3B3B3B").css("text-align", "center").height(30);

	    var data_type = 'data:application/vnd.ms-excel;charset=utf-8';
	    var table_html = encodeURIComponent($table[0].outerHTML);

	    var a = document.createElement('a');
	    a.href = data_type + ',%EF%BB%BF' + table_html;
	    a.download = txt + '.xls';
	    a.click();
	    $(a).remove();
	});
});

$(window).resize(function(){

	clearTimeout( timer );
    timer = setTimeout( resizeDone(), delta );
});

$(".contentWrapper").find('#content .chartWrap .contentOption .param').change(function(){
	//var target = $(this).parent().parent().find(".chart").attr("id");
	var gbn = $(this).attr("gbn");

	if(gbn.indexOf("Orgz") == -1){
		var _param = {};
		_param['year'] = $(this).parent().find(".year").val();
		if(gbn == "Day")
			_param['month'] = $(this).parent().find(".month").val();

		_common.callAjax("/stat/get"+url+gbn+"Stat.json", _param, function(json){
			var key = '';
			if(gbn == "Day") {
				createDayTable("dayTable", json.result, _param['year'], _param['month']);
				key = gbn.toLowerCase();
			} else if(gbn == "Month") {
				createMonthTable("monthTable", json.result);
				key = gbn.toLowerCase();
			}

			var tmpObj = {};
			var max = 1;
			/* if(gbn == "Day") max = dayChart.series[0].yData.length;
			else if(gbn == "Month") max = monthChart.series[0].yData.length; */
			if(gbn == "Day") {
				var lastDateOfMonth = new Date(_param['year'], _param['month'], 0);
				var lastDate = lastDateOfMonth.getDate();
				max = lastDate;
			} else if(gbn == "Month") max = 12;
			for(var k=1; k<=max; k++){
				tmpObj[(k < 10) ? '0'+String(k) : k] = 0;
			}

			for(var i=0; i<json.result.length; i++){
				if(tmpObj[json.result[i][key]] !== undefined)
					tmpObj[json.result[i][key]] = json.result[i].count;
			}

			var dataArr = [];
			var index = '';
			for(var i=1; i<=max; i++){
				index = (i < 10) ? '0'+String(i) : i;
				dataArr.push(Number(tmpObj[index]));
			}

			//dayChart.series[0].setData(dataArr);
			/* if(gbn == "Day") max = dayChart.series[0].setData(dataArr);
			else if(gbn == "Month") max = monthChart.series[0].setData(dataArr); */
			if(gbn == "Day") {
				dayChart.series[0].setData(dataArr);
				var series = [];
				for(var l=1; l<=max; l++){
					series.push(l+'일');
				}
				dayChart.xAxis[0].setCategories(series);
			} else if(gbn == "Month") monthChart.series[0].setData(dataArr);
		}, false);
	} else {
		var orgzList = null;
		var addr = "/orgz/getList.json";
		if(url == 'Asset'){
			addr = "/stat/get"+url+"List.json";
		} else if(url == 'Evt'){
			addr = "/stat/get"+url+"List.json";
		}

		_common.callAjax(addr, null, function(json){
			orgzList = json.result;
		}, false);

		if(gbn.indexOf("Month") > -1) {
			var mothDataArr = [];
			var mothTblArr = [];
			var tmpMonthObj = {'01': 0, '02': 0, '03': 0, '04': 0, '05': 0, '06': 0,'07': 0,'08': 0,'09': 0, '10': 0, '11': 0, '12': 0};

			var _param = {};
			_param['year'] = $("#orgzMonthChart").parent().parent().find(".year").val();
			//테이블용 총계 추가
			_common.callAjax("/stat/get" + url + "OrgzMonthStat.json", _param, function(json2){
				var tmpTblObj = $.extend({}, tmpMonthObj);
				tmpTblObj['name'] = '총계';

				for(var m=0; m<json2.result.length; m++){
					if(tmpTblObj[json2.result[m].month] !== undefined) tmpTblObj[json2.result[m].month] = json2.result[m].count;
				}
				mothTblArr.push(tmpTblObj);
			}, false);

			for(var j=0; j<orgzList.length; j++) {
				var orgNm = '';

				if(url == 'Usr'){
					orgNm = orgzList[j].orgNm;
				}else{
					orgNm = orgzList[j];
				}

				_param['orgNm'] = orgNm;
				//[{year : 2018, count : 2773}]
				_common.callAjax("/stat/get" + url + "OrgzMonthStat.json", monthChartParam, function(json2){
					if(json2.result){
						var tmpTblObj = $.extend({}, tmpMonthObj);
						tmpTblObj['name'] = orgNm;

						for(var m=0; m<json2.result.length; m++){
							if(tmpTblObj[json2.result[m].month] !== undefined) tmpTblObj[json2.result[m].month] = json2.result[m].count;
						}
						mothTblArr.push(tmpTblObj);

						for(var i=1; i<=12; i++){
							mothDataArr.push(Number(tmpChartObj[(i < 10) ? '0'+String(i) : String(i)]));
						}
						orgzMonthChart.series[j].setData(mothDataArr);
					}
				}, false);
			}


			craeteOrgzMonthTable("orgzMonthTable", mothTblArr);

		}
		if(gbn.indexOf("Day") > -1) {
			var _param = {};
			_param['year'] = $("#orgzDayChart").parent().parent().find(".year").val();
			_param['month'] = $("#orgzDayChart").parent().parent().find(".month").val();

			var dayDataArr = [];
			var dayTblArr = [];
			var tmpDayObj = {};
			var lastDateOfMonth = new Date(_param['year'], _param['month'], 0);
			var lastDate = lastDateOfMonth.getDate();

			for(var i=1; i<=lastDate; i++){
				var name = String(i);
				if(name < 10) name = '0'+name;
				tmpDayObj[name] = 0;
			}

			var series = [];
			for(var l=1; l<=lastDate; l++){
				series.push(l+'일');
			}
			orgzDayChart.xAxis[0].setCategories(series);

			//테이블용 총계 추가
			_common.callAjax("/stat/get" + url + "OrgzDayStat.json", _param, function(json2){
				var tmpTblObj = $.extend({}, tmpDayObj);
				tmpTblObj['name'] = '총계';

				for(var m=0; m<json2.result.length; m++){
					if(tmpTblObj[json2.result[m].day] !== undefined) tmpTblObj[json2.result[m].day] = json2.result[m].count;
				}
				dayTblArr.push(tmpTblObj);
			}, false);

			for(var j=0; j<orgzList.length; j++) {
				dayDataArr = [];
				var orgNm = '';

				if(url == 'Usr'){
					orgNm = orgzList[j].orgNm;
				}else{
					orgNm = orgzList[j];
				}

				_param['orgNm'] = orgNm;
				//[{year : 2018, count : 2773}]
				_common.callAjax("/stat/get" + url + "OrgzDayStat.json", _param, function(json2){
					if(json2.result){
						var tmpTblObj = $.extend({}, tmpDayObj);
						tmpTblObj['name'] = orgNm;

						for(var m=0; m<json2.result.length; m++){
							if(tmpTblObj[json2.result[m].day] !== undefined) tmpTblObj[json2.result[m].day] = json2.result[m].count;
						}
						dayTblArr.push(tmpTblObj);

						for(var i=1; i<=lastDate; i++){
							dayDataArr.push(Number(tmpTblObj[(i < 10) ? '0'+String(i) : String(i)]));
						}
						orgzDayChart.series[j].setData(dayDataArr);
					}
				}, false);
			}

			craeteOrgzDayTable("orgzDayTable", dayTblArr, lastDate);
		}
	}
});

$(".contentWrapper").find('.topMenuTab').click(function(){
	var target = $(this).attr("target");

	//탭 css변경
	$(".contentWrapper").find('.topMenuTab').removeAttr("active");
	$(this).attr("active", "active");

	setContent(target, typ);

	//페이지 표시
	$(".contentWrapper").find('.page').hide();
	$(".contentWrapper").find('.'+target).show();
});

$(".contentWrapper").find('.subMenuBtn').click(function(){

	var target = $(this).attr("target");

	//서브메뉴 버튼 visible 변경
	$(this).parent().find('button').removeAttr("active");
	$(this).attr("active", "active");

	//관련 컨텐츠 visible 변경
	$(this).parent().parent().next().find('.useritem').hide();
	$(this).parent().parent().next().find('.'+target).show();

});

function setContent(target, type){
	if(target == "user"){
		if(yearChart == null){
			_common.callAjax("/stat/get" + url + "YearStat.json", null, function(json){
				yearChart = createYearChart("yearChart", "연별 "+type+" 현황", json.result);
				createYearTable("yearTable", json.result);
			}, false);
		}

		if(monthChart == null){
			var monthChartParam = {};
			monthChartParam['year'] = $("#monthChart").parent().parent().find(".year").val();
			_common.callAjax("/stat/get" + url + "MonthStat.json", monthChartParam, function(json){
				monthChart = createMonthChart("monthChart", "월별 "+type+" 현황", json.result);
				createMonthTable("monthTable", json.result);
			}, false);
		}

		if(dayChart == null){
			var dayChartParam = {};
			dayChartParam['year'] = $("#dayChart").parent().parent().find(".year").val();
			dayChartParam['month'] = $("#dayChart").parent().parent().find(".month").val();
			_common.callAjax("/stat/get" + url + "DayStat.json", dayChartParam, function(json){
				dayChart = createDayChart("dayChart", "일별 "+type+" 현황", json.result, dayChartParam['year'], dayChartParam['month']);
				createDayTable("dayTable", json.result, dayChartParam['year'], dayChartParam['month']);
			}, false);
		}

	} else if(target == "orgz"){
		var orgzList = null;
		var addr = "/orgz/getList.json";
		if(url == 'Asset'){
			addr = "/stat/get"+url+"List.json";
		} else if(url == 'Evt'){
			addr = "/stat/get"+url+"List.json";
		}

		_common.callAjax(addr, null, function(json){
			orgzList = json.result;
		}, false);

		if(orgzYearChart == null){
			var series = [];
			var categories = [];
			var yearList = [];
			var tblArr = [];
			var emptyObj = {};
			var currDate = new Date();
			var currYear = currDate.getY();
			for(var i=2018; i<=currYear; i++){
				categories.push(i+'년');
				yearList.push(i);
				emptyObj[String(i)] = 0;
			}
			//테이블용 총계 추가
			_common.callAjax("/stat/get" + url + "OrgzYearStat.json", null, function(json2){
				var tmpTblObj = $.extend({}, emptyObj);
				tmpTblObj['name'] = '총계';

				for(var m=0; m<json2.result.length; m++){
					if(tmpTblObj[json2.result[m].year] !== undefined) tmpTblObj[json2.result[m].year] = json2.result[m].count;
				}
				tblArr.push(tmpTblObj);
			}, false);

			for(var j=0; j<orgzList.length; j++) {
				var chartObj = {};
				var orgNm = '';

				if(url == 'Usr'){
					orgNm = orgzList[j].orgNm;
				}else{
					orgNm = orgzList[j];
				}

				//[{year : 2018, count : 2773}]
				_common.callAjax("/stat/get" + url + "OrgzYearStat.json", {'orgNm': orgNm}, function(json2){
					if(json2.result){
						chartObj['name'] = orgNm;
						var data = [];
						var tmpChartObj = $.extend({}, emptyObj);
						for(var k=0; k<json2.result.length; k++){
							if(tmpChartObj[json2.result[k].year] !== undefined) tmpChartObj[json2.result[k].year] = json2.result[k].count;
						}
						var tmpTblObj = $.extend({}, tmpChartObj);
						tmpTblObj['name'] = orgNm;
						tblArr.push(tmpTblObj);
						for(var l=0; l<yearList.length; l++){
							data.push(Number(tmpChartObj[yearList[l]]));
						}
						chartObj['data'] = data;
						series.push(chartObj);
					}
				}, false);
			}

			orgzYearChart = createOrgzYearChart("orgzYearChart", "연별 "+type+" 현황", categories, series);
			craeteOrgzYearTable("orgzYearTable", tblArr, yearList);

		}

		if(orgzMonthChart == null) {
			var monthSeries = [];
			var mothTblArr = [];
			var tmpMonthObj = {'01': 0, '02': 0, '03': 0, '04': 0, '05': 0, '06': 0,'07': 0,'08': 0,'09': 0, '10': 0, '11': 0, '12': 0};

			var monthChartParam = {};
			monthChartParam['year'] = $("#orgzMonthChart").parent().parent().find(".year").val();
			//테이블용 총계 추가
			_common.callAjax("/stat/get" + url + "OrgzMonthStat.json", monthChartParam, function(json2){
				var tmpTblObj = $.extend({}, tmpMonthObj);
				tmpTblObj['name'] = '총계';

				for(var m=0; m<json2.result.length; m++){
					if(tmpTblObj[json2.result[m].month] !== undefined) tmpTblObj[json2.result[m].month] = json2.result[m].count;
				}
				mothTblArr.push(tmpTblObj);
			}, false);

			for(var j=0; j<orgzList.length; j++) {
				var chartObj = {};
				var orgNm = '';

				if(url == 'Usr'){
					orgNm = orgzList[j].orgNm;
				}else{
					orgNm = orgzList[j];
				}

				monthChartParam['orgNm'] = orgNm;
				//[{year : 2018, count : 2773}]
				_common.callAjax("/stat/get" + url + "OrgzMonthStat.json", monthChartParam, function(json2){
					if(json2.result){
						chartObj['name'] = orgNm;
						var data = [];
						var tmpChartObj = $.extend({}, tmpMonthObj);
						for(var k=0; k<json2.result.length; k++){
							if(tmpChartObj[json2.result[k].month] !== undefined) tmpChartObj[json2.result[k].month] = json2.result[k].count;
						}
						var tmpTblObj = $.extend({}, tmpChartObj);
						tmpTblObj['name'] = orgNm;
						mothTblArr.push(tmpTblObj);

						for(var i=1; i<=12; i++){
							data.push(Number(tmpChartObj[(i < 10) ? '0'+String(i) : String(i)]));
						}
						chartObj['data'] = data;
						monthSeries.push(chartObj);
					}
				}, false);
			}

			orgzMonthChart = createOrgzMonthChart("orgzMonthChart", "월별 "+type+" 현황", monthSeries);
			craeteOrgzMonthTable("orgzMonthTable", mothTblArr);

		}

		if(orgzDayChart == null) {
			var _param = {};
			_param['year'] = $("#orgzDayChart").parent().parent().find(".year").val();
			_param['month'] = $("#orgzDayChart").parent().parent().find(".month").val();

			var daySeries = [];
			var dayTblArr = [];
			var tmpDayObj = {};
			var lastDateOfMonth = new Date(_param['year'], _param['month'], 0);
			var lastDate = lastDateOfMonth.getDate();

			for(var i=1; i<=lastDate; i++){
				var name = String(i);
				if(name < 10) name = '0'+name;
				tmpDayObj[name] = 0;
			}

			//테이블용 총계 추가
			_common.callAjax("/stat/get" + url + "OrgzDayStat.json", _param, function(json2){
				var tmpTblObj = $.extend({}, tmpDayObj);
				tmpTblObj['name'] = '총계';

				for(var m=0; m<json2.result.length; m++){
					if(tmpTblObj[json2.result[m].day] !== undefined) tmpTblObj[json2.result[m].day] = json2.result[m].count;
				}
				dayTblArr.push(tmpTblObj);
			}, false);

			for(var j=0; j<orgzList.length; j++) {
				var chartObj = {};
				var orgNm = '';

				if(url == 'Usr'){
					orgNm = orgzList[j].orgNm;
				}else{
					orgNm = orgzList[j];
				}

				_param['orgNm'] = orgNm;
				//[{year : 2018, count : 2773}]
				_common.callAjax("/stat/get" + url + "OrgzDayStat.json", _param, function(json2){
					if(json2.result){
						chartObj['name'] = orgNm;
						var data = [];
						var tmpChartObj = $.extend({}, tmpDayObj);
						for(var k=0; k<json2.result.length; k++){
							if(tmpChartObj[json2.result[k].day] !== undefined) tmpChartObj[json2.result[k].day] = json2.result[k].count;
						}
						var tmpTblObj = $.extend({}, tmpChartObj);
						tmpTblObj['name'] = orgNm;
						mothTblArr.push(tmpTblObj);

						for(var i=1; i<=lastDate; i++){
							data.push(Number(tmpChartObj[(i < 10) ? '0'+String(i) : String(i)]));
						}
						chartObj['data'] = data;
						daySeries.push(chartObj);
					}
				}, false);
			}

			orgzDayChart = createOrgzDayChart("orgzDayChart", "일별 "+type+" 현황", daySeries, lastDate);
			craeteOrgzDayTable("orgzDayTable", dayTblArr, lastDate);

		}

	}
}

function setParam(){
	//년
	var str = "";
	var date = new Date();
	var yy = date.getFullYear();
	var max_yy = 2018;
	for ( var i = 0; (yy-max_yy) >= i ; i++ ){
		str += '<option value="'+(yy-i)+'">'+(yy-i)+'</option>';
	};
	$('.contentWrapper #content .chartWrap .contentOption .year').html(str);

	//월
	str = "";
	var month = date.getMonth()+1;
	//if(month < 10) month = '0'+month;
	for(var j=1; j<=12; j++){
		str += '<option value="'+ ((j <  10) ? '0'+j : j)+'" '+((j == month) ? 'selected="selected"' : '')+'>'+j+'월</option>';
	}
	$('.contentWrapper #content .chartWrap .contentOption .month').html(str);
}

function resizeDone() {
	var wrapperHeight = 856;
	if(wrapperHeight < 800) wrapperHeight = 800;
	$('.contentWrapper').css('height', wrapperHeight);

	var itemHeight = Math.floor((wrapperHeight - 130)/2);
	$('.contentWrapper #content .useritem').css('height', itemHeight+'px');

	///////////////
	var wrapperWidth = 1850;
	//console.log("현재 페이지의 확대 비율: " + zoomLevel);
	if(zoomLevel > 1.1) wrapperWidth = 1700;	//화면 비율에 따른 통계페이지 크기 조절
	if(zoomLevel >= 1.25) wrapperWidth = 1450;
	if(wrapperWidth < 1200) wrapperWidth = 1200;
	var yearWidth =Math.floor(wrapperWidth*0.4);
	var monthWidth =Math.floor(wrapperWidth*0.6)-50;//-20S0이었음.

	$('#yearChart').css('width', (yearWidth-30)+'px');
	$('#yearTable').css('width', (yearWidth-30)+'px');
	$('#monthChart').css('width', (monthWidth-30)+'px');
	$('#monthTable').css('width', (monthWidth-30)+'px');
	$('#dayChart').css('width', (yearWidth+monthWidth-30+12)+'px');
	$('#dayTable').css('width', (yearWidth+monthWidth-30+12)+'px');
	/*$('#yearChart').css('width', (yearWidth)+'px');
	$('#yearTable').css('width', (yearWidth)+'px');
	$('#monthChart').css('width', (monthWidth)+'px');
	$('#monthTable').css('width', (monthWidth)+'px');
	$('#dayChart').css('width', (yearWidth+monthWidth+12)+'px');
	$('#dayTable').css('width', (yearWidth+monthWidth+12)+'px');*/

	$('#orgzYearChart').css('width', (yearWidth-30)+'px');
	$('#orgzYearTable').css('width', (yearWidth-30)+'px');
	$('#orgzMonthChart').css('width', (monthWidth-30)+'px');
	$('#orgzMonthTable').css('width', (monthWidth-30)+'px');
	$('#orgzDayChart').css('width', (yearWidth+monthWidth-30+12)+'px');
	$('#orgzDayTable').css('width', (yearWidth+monthWidth-30+12)+'px');

	if(yearChart != null) yearChart.setSize($('#yearChart').width(), $('#yearChart').height());
	if(monthChart != null) monthChart.setSize($('#monthChart').width(), $('#monthChart').height());
	if(dayChart != null) dayChart.setSize($('#dayChart').width(), $('#dayChart').height());

	if(orgzYearChart != null) orgzYearChart.setSize($('#orgzYearChart').width(), $('#orgzYearChart').height());
	if(orgzMonthChart != null) orgzMonthChart.setSize($('#orgzMonthChart').width(), $('#orgzMonthChart').height());
	if(orgzDayChart != null) orgzDayChart.setSize($('#orgzDayChart').width(), $('#orgzDayChart').height());

}

function createYearChart(selector, title, result){
	//연

	/*var selectcor = "yearChart";
	var title = "연별 접속현황";*/
	var data = [];
	for(var i=0; i<result.length; i++){
		var obj = {};
		obj['name'] = result[i]['year'];
		obj['y'] = Number(result[i]['count']);
		if(i == 0){
			obj['sliced'] = true;
			obj['selected'] = true;
		}
		data.push(obj);
	}

	return Highcharts.chart(selector, {
	    chart: {
	    	backgroundColor: '#30303a',
	        plotBorderWidth: null,
	        plotShadow: false,
	        type: 'pie'
	    },
	    title: {
	        text: title,
	        style: {
	            fontSize: '18px'
	        }
	    },
	    tooltip: {
	        //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//	    	pointFormat: '{series.name}: <b>{point.y:0.f }</b>'
	    	pointFormat: '<b>{point.y}</b>'
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	                enabled: false
	            },
	            showInLegend: true
	        }
	    },
	    series: [{
	        name: objName,
	        colorByPoint: true,
	        data: data
	    }]
	});
}

function createYearTable(selector, result){

	$('#'+selector + ' table thead').html('');
	$('#'+selector + ' table tbody').html('');

	//연
	var thead = '<tr>';
	var tbody = '<tr>';

	for(var i=0; i<result.length; i++){
		thead += '<th class="tCenter">'+result[i].year+'</th>';
		tbody += '<td class="tCenter">'+result[i].count+'</td>';
	}

	thead += '</tr>';
	tbody += '</tr>';

	$('#'+selector + ' table thead').html(thead);
	$('#'+selector + ' table tbody').html(tbody);

}

function createMonthChart(selector, title, result){
	//월

	//var selector = "monthChart";
	//var title = "월별 접속현황";
	var categories = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ];

	var tmpObj = {'01': 0, '02': 0, '03': 0, '04': 0, '05': 0, '06': 0,'07': 0,'08': 0,'09': 0, '10': 0, '11': 0, '12': 0};
	for(var i=0; i<result.length; i++){
		tmpObj[result[i].month] = result[i].count;
	}

	var series = [];
	var obj = {};
	obj['name'] = objName;
	var dataArr = [];

	for(var i=1; i<=12; i++){
		var arr = [];
		var name = i;
		arr.push(name +'월');
		if(name < 10) name = '0'+name;
		arr.push(Number(tmpObj[name]));
		dataArr.push(arr);
	}
	obj['data'] = dataArr;
	series.push(obj);

	return Highcharts.chart(selector, {
		chart : {
			backgroundColor: '#30303a',
			type : 'column'
		},
		title : {
			text : title,
	        style: {
	            fontSize: '18px'
	        }
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
	        pointFormat: '<b>{point.y}</b>'
	    },
		series : series,
	})
}

function createMonthTable(selector, result){

	$('#'+selector + ' table thead').html('');
	$('#'+selector + ' table tbody').html('');

	var th = [];
	var obj = {};
	for(var i=1; i<=12; i++){
		var name = i;
		if(name < 10) name = '0'+name;
		obj[name] = '0';
		th.push(name);
	}

	//월
	var thead = '<tr>';
	var tbody = '<tr>';

	for(var j=0; j<result.length; j++){
		if(obj[result[j].month] !== undefined) obj[result[j].month] = result[j].count;
	}

	for(var k=0; k<th.length; k++){
		thead += '<th class="tCenter">'+(k+1)+'월</th>';
		tbody += '<td class="tCenter">'+obj[th[k]]+'</td>';
	}

	thead += '</tr>';
	tbody += '</tr>';

	$('#'+selector + ' table thead').html(thead);
	$('#'+selector + ' table tbody').html(tbody);

}

function createDayChart(selector, title, result, year, month){
	//일
	/*var selector = "dayChart";
	var title = "일별 접속현황";*/
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
	obj['name'] = objName;
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

	return Highcharts.chart(selector, {
		chart : {
			backgroundColor: '#30303a',
			type : 'column'
		},
		title : {
			text : title,
	        style: {
	            fontSize: '18px'
	        }
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
	        pointFormat: '<b>{point.y}</b>'
	    },
		series : series,
	})
}

function createDayTable(selector, result, year, month){

	$('#'+selector + ' table thead').html('');
	$('#'+selector + ' table tbody').html('');

	var th = [];
	var obj = {};
	var lastDateOfMonth = new Date(year, month, 0);
	var lastDate = lastDateOfMonth.getDate();

	for(var i=1; i<=lastDate; i++){
		var name = i;
		if(name < 10) name = '0'+name;
		obj[name] = '0';
		th.push(name);
	}

	//월
	var thead = '<tr>';
	var tbody = '<tr>';

	for(var j=0; j<result.length; j++){
		if(obj[result[j].day] !== undefined) obj[result[j].day] = result[j].count;
	}

	for(var k=0; k<th.length; k++){
		thead += '<th class="tCenter">'+(k+1)+'일</th>';
		tbody += '<td class="tCenter">'+obj[th[k]]+'</td>';
	}

	thead += '</tr>';
	tbody += '</tr>';

	$('#'+selector + ' table thead').html(thead);
	$('#'+selector + ' table tbody').html(tbody);

}

function createOrgzYearChart(selector, title, categories, series){
	/*var selector = "orgzYearChart";
	var title = "연별 접속현황";*/


	return Highcharts.chart(selector, {
	    chart: {
	        type: 'bar'
	    },
	    title: {
	        text: title
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: objName
	        }
	    },
	    xAxis: {
	        categories: categories
	    },
	    legend: {
	        reversed: true
	    },
	    plotOptions: {
	        series: {
	            stacking: 'normal'
	        }
	    },
	    series: series
	});

}

function craeteOrgzYearTable(selector, tblArr, yearList){
	$('#'+selector + ' table thead').html('');
	$('#'+selector + ' table tbody').html('');

	//yearList.sort();

	var thead = '<tr><th class="tCenter"></th>';
	for(var i=0; i<yearList.length; i++){
		thead += '<th class="tCenter">'+yearList[i]+'년</th>';
	}
	thead += '</tr>';

	var tbody = '';
	for(var j=0; j<tblArr.length; j++){
		tbody += '<tr>';
		tbody += '<th class="tCenter" style="width: 200px;">'+tblArr[j]['name']+'</th>';
		for(var k=0; k<yearList.length; k++){
			tbody += '<td class="tCenter">'+tblArr[j][yearList[k]]+'</td>';
		}
		tbody += '</tr>';
	}

	$('#'+selector + ' table thead').html(thead);
	$('#'+selector + ' table tbody').html(tbody);

}

function createOrgzMonthChart(selector, title, series){
	/*var selector = "orgzYearChart";
	var title = "연별 접속현황";*/

	var categories = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ];

	return Highcharts.chart(selector, {
	    chart: {
	        type: 'bar'
	    },
	    title: {
	        text: title
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: objName
	        }
	    },
	    xAxis: {
	        categories: categories
	    },
	    legend: {
	        reversed: true
	    },
	    plotOptions: {
	        series: {
	            stacking: 'normal'
	        }
	    },
	    series: series
	});

}

function craeteOrgzMonthTable(selector, tblArr){

	$('#'+selector + ' table thead').html('');
	$('#'+selector + ' table tbody').html('');

	//yearList.sort();

	var thead = '<tr><th class="tCenter"></th>';
	for(var k=1; k<=12; k++){
		thead += '<th class="tCenter">'+k+'월</th>';
	}
	thead += '</tr>';

	var tbody = '';
	for(var j=0; j<tblArr.length; j++){
		tbody += '<tr>';
		tbody += '<th class="tCenter" style="width: 200px;">'+tblArr[j]['name']+'</th>';
		for(var k=1; k<=12; k++){
			tbody += '<td class="tCenter">'+tblArr[j][(k < 10) ? '0'+String(k) : String(k)]+'</td>';
		}
		tbody += '</tr>';
	}


	$('#'+selector + ' table thead').html(thead);
	$('#'+selector + ' table tbody').html(tbody);

}

function createOrgzMonthChart(selector, title, series){
	/*var selector = "orgzYearChart";
	var title = "연별 접속현황";*/

	var categories = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ];

	return Highcharts.chart(selector, {
	    chart: {
	        type: 'bar'
	    },
	    title: {
	        text: title
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: objName
	        }
	    },
	    xAxis: {
	        categories: categories
	    },
	    legend: {
	        reversed: true
	    },
	    plotOptions: {
	        series: {
	            stacking: 'normal'
	        }
	    },
	    series: series
	});

}

function createOrgzDayChart(selector, title, series, len){
	/*var selector = "orgzYearChart";
	var title = "연별 접속현황";*/

	var categories = [];
	for(var i=1; i<=len; i++){
		categories.push(i+'일');
	}

	/*return Highcharts.chart(selector, {
	    chart: {
	        type: 'bar'
	    },
	    title: {
	        text: title
	    },
	    xAxis: {
	        min: 0,
	        title: {
	            text: objName
	        }
	    },
	    yAxis: {
	        categories: categories
	    },
	    legend: {
	        reversed: true
	    },
	    plotOptions: {
	        series: {
	            stacking: 'normal'
	        }
	    },
	    series: series
	});*/


	return Highcharts.chart(selector, {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: title
	    },
	    xAxis: {
	        categories: categories
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: objName
	        },
	        stackLabels: {
	            enabled: true,
	            style: {
	                fontWeight: 'bold',
	                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	            }
	        }
	    },
	    legend: {
	        align: 'right',
	        x: -30,
	        verticalAlign: 'top',
	        y: 25,
	        floating: true,
	        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	        borderColor: '#CCC',
	        borderWidth: 1,
	        shadow: false
	    },
	    tooltip: {
	        headerFormat: '<b>{point.x}</b><br/>',
	        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
	    },
	    plotOptions: {
	        column: {
	            stacking: 'normal',
	            dataLabels: {
	                enabled: true,
	                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
	            }
	        }
	    },
	    series: series
	});


}

function craeteOrgzDayTable(selector, tblArr, len){

	$('#'+selector + ' table thead').html('');
	$('#'+selector + ' table tbody').html('');

	//yearList.sort();

	var thead = '<tr><th class="tCenter"></th>';
	for(var k=1; k<=len; k++){
		thead += '<th class="tCenter">'+k+'일</th>';
	}
	thead += '</tr>';

	var tbody = '';
	for(var j=0; j<tblArr.length; j++){
		tbody += '<tr>';
		tbody += '<th class="tCenter" style="width: 200px;">'+tblArr[j]['name']+'</th>';
		for(var k=1; k<=len; k++){
			tbody += '<td class="tCenter">'+tblArr[j][(k < 10) ? '0'+String(k) : String(k)]+'</td>';
		}
		tbody += '</tr>';
	}


	$('#'+selector + ' table thead').html(thead);
	$('#'+selector + ' table tbody').html(tbody);

}