<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.equipmgr.service.CctvVo"%> --%>
<%@ include file="../common.jsp"%>
<%

%>
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.userMng.css">
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.board.api.js"></script>
<script>
(function(){

	//네트워크장비 가동률이 리턴된다.
	//ex. {count: 1091, rate : 99.63} // count : 전체 장비 수(사용중인), rate : 가동률
	/* _common.callAjax("/board/getNetwkOperatingRate.json", {'useYn':'Y'}, function(json){
	}, false); */

	//WIFI, LORA, BlackBOX 갯수를 가져온다.
	//{blackboxCnt: "68", brdTitle: null, jsonTxt: null, loraCnt: "74", mdfyDat: null, mgrSeq: null, userId: null, wifiCnt: "59"}
	/* _common.callAjax("/board/getEquipCnt.json", null, function(json){
	}, false); */

	//레이더 영상 이미지를 가져온다.
	//ex : ["http://www.weather.go.kr/repositary/image/rdr/img/RDR_CMP_WRC_201811170000.png", "http://www.weather.go.kr/repositary/image/rdr/img/RDR_CMP_WRC_201811170000.png"]
	/* var result = BoardAPI.getRadarCompositionImage();
	var imgList = $(result).find("body").find("items").find("item").children();
	var arr = [];
	imgList.each(function() {
		arr.push($(this).text());
	});
	arr.sort(); */

	var timer = null;
	var delta = 300;
	var loginCnt = 0;
	var allUserCnt = 0;
	var evtCnt = 0;
	var analyCnt = 0
	var rqstCnt = 0;
	var genCnt = '';

	var today = Date.prototype.getYMD();

	/* _common.callAjax("/board/getAccessCnt.json", {"useTime": today}, function(json){
		loginCnt = json.result;
	}, false);
	_common.callAjax("/board/getAllUserCnt.json", null, function(json){
		allUserCnt = json.result;
	}, false);


	_common.callAjax("/board/getEvtCnt.json", {"evtOutbDtm": today}, function(json){
		evtCnt = json.result;
	}, false);


	_common.callAjax("/board/getAnalyCnt.json", {"analyDat": today}, function(json){
		analyCnt = json.result;
	}, false);

	_common.callAjax("/board/getRqstCnt.json", {"procStatCd":'SK', "fnshDat": today}, function(json){
		rqstCnt = json.result;
	}, false);

	_common.callAjax("/eventDmtia/getGenderCount.json", null, function(json){
		genCnt = json.result[0].dmtiaGender + ' : ' + json.result[0].genderCnt + '<br/><br/>'
		+ json.result[1].dmtiaGender + ' : ' + json.result[1].genderCnt;
	}, false); */

	$(document).ready(function(){
		resizeDone();
	});

	$(window).resize(function(){
		clearTimeout( timer );
	    timer = setTimeout( resizeDone, delta );
	});

	function resizeDone() {

		//$('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height());

		var _totalWidth = $('#boardView #overlay-west-contents').width() - $('#overlay-west-side-bar').width(); // 사이드바 70px
		var _tmpWidth = $(".contentWrapper").find(".searchWrapper").find('.slidePanel').width(); // 230px
		$(".contentWrapper").find(".searchWrapper").find('.gridPanel').width(_totalWidth - _tmpWidth - 40);

		var _slideHeight = $(window).height() - $('#main-menu-group').height() - $(".contentWrapper").find('#overlay-west-bar').height()-10;
		$(".contentWrapper").find(".slideWrap").css('height', _slideHeight);


		GridStackUI.Utils.setVertialSort();

		if(GridStackUI.Utils.Charts.length > 0){
			for(var i=0; i<GridStackUI.Utils.Charts.length; i++){
				GridStackUI.Utils.Charts[i].reflow();
			}
		}

		for(var key in GridStackUI.Utils.Maps){
			var _widgetWidth = $(".contentWrapper").find("#grid").find('#'+key).width();
			var _widgetHeight = $(".contentWrapper").find("#grid").find('#'+key).height();
			GridStackUI.Utils.Maps[key].setSize([_widgetWidth,_widgetHeight]);

			GridStackUI.Utils.Maps[key].updateSize();
		}

		if(GridStackUI.Utils.Images.length > 0){
			for(var i=0; i<GridStackUI.Utils.Images.length; i++){

				var _widgetWidth = $('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').width();
				var _widgetHeight = $('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').height();// - _titleHeight;

				$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('img').css('width', _widgetWidth+'px');
				$('.grid-stack-item-content[target='+GridStackUI.Utils.Images[i]+']').find('img').css('height', _widgetHeight+'px');

			}
		}

	}

	var options = {
		width: 12,
		float: true,
		animate: true,
		handle: ".title",
		cellHeight: 120,
		resizable: {
			handles: 'e, se, s, sw, w'
		},
		placeholder_class: 'grid-stack-placeholder',
		acceptWidgets: '.grid-stack-item'
	};

	$(".contentWrapper").find('#grid').gridstack(options);

	var dashbdList = null;
	_common.callAjax("/board/getDashbdList.json", {"userId": '<%=userId%>'}, function(json){
		dashbdList = json.result;
	}, false);

	var template = {
			// text 데이터
			"SignCnt" : {"x":1,"y":2,"width":2,"height":1,"type":"text","title":"오늘 로그인 수","content":loginCnt,"id":"SignCnt","target":"signCnt","gbn":"basic"},
			"TodayAnalysCnt" : {"x":3,"y":0,"width":2,"height":1,"type":"text","title":"오늘 분석된 데이터","content":analyCnt,"id":"TodayAnalysCnt","target":"todayAnalysCnt","gbn":"basic"},
			"UsrCnt" : {"x":2,"y":2,"width":2,"height":1,"type":"text","title":"총 사용자","content":allUserCnt,"id":"UsrCnt","target":"usrCnt","gbn":"basic"},
			"Hum" : {"x":0,"y":3,"width":2,"height":1,"type":"text","title":"습도","content":"70%","id":"Hum","target":"hum","gbn":"weather"},
			"Wind" : {"x":0,"y":2,"width":2,"height":1,"type":"text","title":"풍량","content":"1m/s","id":"Wind","target":"wind","gbn":"weather"},
			"TodayEventCnt" : {"x":0,"y":5,"width":2,"height":1,"type":"text","title":"오늘 발생된 이벤트","content":evtCnt,"id":"TodayEventCnt","target":"todayEventCnt","gbn":"event"},
			"GenderCount" : {"x":2,"y":5,"width":3,"height":1,"type":"text","title":"치매어르신 성별 인원 수","content":genCnt,"id":"GenderCount","target":"genderCount","gbn":"basic"},
			"Dust_pm10" : {"x":0,"y":4,"width":2,"height":1,"type":"text","title":"미세먼지","content":"","id":"Dust_pm10","target":"dust_pm10","gbn":"weather"}, // 181210 미세먼지 추가
			"Dust_pm25" : {"x":0,"y":4,"width":1,"height":1,"type":"text","title":"초미세먼지","content":"","id":"Dust_pm25","target":"dust_pm25","gbn":"weather"}, // 181210 초미세먼지 추가
			"Rain" : {"x":1,"y":4,"width":1,"height":1,"type":"text","title":"강수확률","content":"0%","id":"Rain","target":"rain","gbn":"weather"},
			"Uv" : {"x":1,"y":3,"width":1,"height":1,"type":"text","title":"자외선","content":"","id":"Uv","target":"uv","gbn":"weather"}, // 181210 자외선 추가
			"TodayTviusCnt" : {"x":3,"y":2,"width":2,"height":1,"type":"text","title":"오늘 반출된 영상","content":rqstCnt,"id":"TodayTviusCnt","target":"todayTviusCnt","gbn":"basic"},
			// chart 데이터
			"GaugeChart" : {"x":0,"y":0,"width":3,"height":2,"type":"chart","title":"온도","content":"","id":"GaugeChart","target":"gaugeChart","gbn":"weather"},
			"AgeBarChart" : {"x":5,"y":0,"width":3,"height":3,"type":"chart","title":"연령대별 현황","content":"","id":"AgeBarChart","target":"ageBarChart","gbn":"basic"},
			"TimeLineChart" : {"x":8,"y":0,"width":4,"height":3,"type":"chart","title":"시간대별 앱 실행 현황","content":"","id":"TimeLineChart","target":"timeLineChart","gbn":"basic"},
			"CctvLineChart" : {"x":8,"y":0,"width":4,"height":3,"type":"chart","title":"시간대별 CCTV 조회 현황","content":"","id":"CctvLineChart","target":"cctvLineChart","gbn":"basic"},
			"EventLineChart" : {"x":8,"y":3,"width":4,"height":3,"type":"chart","title":"이벤트 종류별 발생 현황","content":"","id":"EventLineChart","target":"eventLineChart","gbn":"event"},
			"AssetLineChart" : {"x":8,"y":3,"width":4,"height":3,"type":"chart","title":"장비별 상태 현황","content":"","id":"AssetLineChart","target":"assetLineChart","gbn":"event"},
			// map 데이터
			"CctvHitMap" : {"x":5,"y":3,"width":3,"height":3,"type":"map","title":"CCTV 분포도","content":"","id":"CctvHitMap","target":"cctvHitMap","gbn":"basic"},
			"EventMap" : {"x":2,"y":3,"width":3,"height":3,"type":"map","title":"실시간 이벤트","content":"","id":"EventMap","target":"eventMap","gbn":"event"},
			// image 데이터
			"Satelite" : {"x":5,"y":3,"width":3,"height":3,"type":"image","title":"위성영상","content":"","id":"Satelite","target":"satelite","gbn":"weather"},
			"Typhoon" : {"x":2,"y":3,"width":3,"height":3,"type":"image","title":"태풍영상","content":"","id":"Typhoon","target":"typhoon","gbn":"weather"},
			"Rader" : {"x":2,"y":3,"width":3,"height":3,"type":"image","title":"레이더영상","content":"","id":"Rader","target":"rader","gbn":"weather"},
		};


	var items = {};

	//첫번째 아이템으로 지정한다.
	//TODO 특정 아이템을 먼저 보여주고 싶을떄 어떻게 처리할지 고민해보기.
	if(!isEmpty(dashbdList)){
 		items = JSON.parse(dashbdList[0].jsonTxt);
//  		if(!isEmpty(items))
// 			items = template;

		for(var j=0; j<dashbdList.length; j++){
			var $presetBtn = $("<button class='presetBtn'><div id='presetTitle' class='mainTooltip' title='"+dashbdList[j].brdTitle+"'><div>"+dashbdList[j].brdTitle+"</div></button>").css({
		    	"padding": "7px",
// 		    	"margin-left": "5px",
		    	"margin-top": "1px",
			}).data(
				dashbdList[j]
			).attr('mgrseq', dashbdList[j].mgrSeq);
			//첫번쨰꺼가 자동으로 표시되게 해놓음.
			if(j==0) $presetBtn.attr('active','active');
			$(".contentWrapper").find("#overlay-west-button-wrap").append($presetBtn);
			//$presetBtn.insertBefore("#addBtn");
		}
		resizeDone();

		$(".contentWrapper").find('.grid-stack').each(function () {
			var grid = $(this).data('gridstack');

			GridStackUI.Utils.removeAllMap();
			GridStackUI.Utils.removeAllChart();

			for(var key in items){
				var $ele = $('<div><div class="grid-stack-item-content" active="active" /><div/>');
				$ele.find(".grid-stack-item-content").attr("target", items[key].target).data(items[key])
					.append('<div class="title" key="'+key+'" target="'+items[key].target+'">' + items[key].title + '</div>')
					.append('<div class="content">' + items[key].content + '</div>');

				var id = key;
				grid.addWidget($ele, Number(items[key].x), Number(items[key].y), Number(items[key].width), Number(items[key].height), false, 1, 4, 1, 4, id);
				if(id) $ele.find(".grid-stack-item-content").attr("id", id);
				GridStackUI.Utils.setVertialSort();

				//$(".contentWrapper").find('.subMenu').find(".item[for="+items[key].target+"]").data(items[key]);
				if(items[key].type == "text"){
					if(key == "Hum" || key == "Wind" || key == "Rain")
						$('.grid-stack-item-content[target="'+items[key].target+'"]').find('.content').html(GridStackUI.Utils.WeatherData[key]);
					if(key == "SignCnt" || key == "UsrCnt" || key == "TodayEventCnt" || key == "TodayAnalysCnt" || key == "TodayTviusCnt" || key == "GenderCount")
						$('.grid-stack-item-content[target="'+items[key].target+'"]').find('.content').html(GridStackUI.Utils.ServerData[key]);
					if(key == "Uv" || key == "Dust_pm10" || key == "Dust_pm25"){
						$('.grid-stack-item-content[target="'+template[key].target+'"]').find('.content').html(GridStackUI.Utils.AirData[key]);
						$('.gridPanel .grid-stack-item-content[target="'+template[key].target+'"]').css('background-color', GridStackUI.Utils.AirData[key +'_color']);
					}
				}
				if(items[key].type == "chart") {
					GridStackUI.Utils.createChart(id);
					$('.grid-stack-item-content[target='+items[key].target+']').find('.title').attr('key', key);
					$('.grid-stack-item-content[target='+items[key].target+']').find('.title').attr('target', items[key].target);
				}
				if(items[key].type == "map") {
					if(key == "EventMap") $ele.find(".grid-stack-item-content").find(".title").css('color', '#dddddd');
					GridStackUI.Utils.createMap(id);
				}
				if(items[key].type == "image") {
					GridStackUI.Utils.createImage(items[key].target);
				}
			}

			$('.grid-stack-item-content').find('.title').dblclick(function(){
				var key = $(this).attr('key');
				var target = $(this).attr('target');

				$(".contentWrapper").find('.grid-stack').data("gridstack").removeWidget($(this).closest('.grid-stack-item'));

				if(items[key].type == "map"){
					GridStackUI.Utils.removeMap(key);
				}
				if(items[key].type == "chart"){
					GridStackUI.Utils.Charts[key].destroy();
					GridStackUI.Utils.removeChart(key);
				}
				if(items[key].type == "image"){
					GridStackUI.Utils.removeA(target);
					if(GridStackUI.Utils.ImagesInterval[target] > 0) {
						clearInterval(GridStackUI.Utils.ImagesInterval[target]);
						delete GridStackUI.Utils.ImagesInterval[target];
					}
				}

				delete items[key];
				if($(".contentWrapper").find(".widget-button[for="+template[key].gbn+"]").attr("active") == "active"){
					var arr = [key];
					createSildeWidget(arr);
					$('.slidePanel').find('.grid-stack-item').show();
				}
				//아이템이 한개도 없을 때 드래그할 수 있는 여유공간을 확보한다.
				/* if($(".contentWrapper").find('.gridPanel').find('.grid-stack-item').length == 0)
					$(".gridPanel").find('.grid-stack').css('height', '100px'); */
			});

			GridStackUI.Utils.setWidgetColor();
			GridStackUI.Utils.setAllMapAlign();
			GridStackUI.Utils.setAllImageAlign();
			GridStackUI.Utils.setAllChartAlign();

		});

	}

	$(document).on('click', '.presetBtn', function(){
		if($(this).attr('active') != 'active'){
			//웹소켓이 열려있을 경우 닫는다.
			if(GridStackUI.Utils.Socket != null) GridStackUI.Utils.Socket.destroy();
			GridStackUI.Utils.stopImagesInterval();
			//GridStackUI.Utils.clearGrid('.slidePanel');
			//$(".contentWrapper").find('.slidePanel').gridstack(_.defaults(sidebar_options2), sidebar_options);
			$(".contentWrapper").find('.slideWrap').removeAttr('active');
			$(".contentWrapper").find('.slideWrap').css('width', '0px');
			$('.widget-button').removeAttr('active');

			$('.presetBtn').removeAttr('active');
			$(this).attr('active', 'active');

			GridStackUI.Utils.removeAllChart();
			GridStackUI.Utils.removeAllMap();

			GridStackUI.Utils.stopInterval();
			//$(".contentWrapper").find('#grid').html('');
			GridStackUI.Utils.clearGrid('#grid');
			$(".contentWrapper").find('#grid').gridstack(options);

			items = JSON.parse($(this).data()['jsonTxt']);
			$(".contentWrapper").find('.grid-stack').each(function () {
				var grid = $(this).data('gridstack');

				for(var key in items){
					var $ele = $('<div><div class="grid-stack-item-content" /><div/>');
					$ele.find(".grid-stack-item-content").attr("target", items[key].target).data(items[key])
						.append('<div class="title" key="'+key+'" target="'+items[key].target+'">' + items[key].title + '</div>')//!!
						.append('<div class="content">' + items[key].content + '</div>');

					var id = key;
					grid.addWidget($ele, Number(items[key].x), Number(items[key].y), Number(items[key].width), Number(items[key].height), false, 1, 4, 1, 4, id);
					if(id) $ele.find(".grid-stack-item-content").attr("id", id);
					GridStackUI.Utils.setVertialSort();

					//$(".contentWrapper").find('.subMenu').find(".item[for="+items[key].target+"]").data(items[key]);
					if(items[key].type == "text"){
						if(key == "Hum" || key == "Wind" || key == "Rain")
							$('.grid-stack-item-content[target="'+items[key].target+'"]').find('.content').html(GridStackUI.Utils.WeatherData[key]);
						if(key == "SignCnt" || key == "UsrCnt" || key == "TodayEventCnt" || key == "TodayAnalysCnt" || key == "TodayTviusCnt" || key == "GenderCount")
							$('.grid-stack-item-content[target="'+items[key].target+'"]').find('.content').html(GridStackUI.Utils.ServerData[key]);
						if(key == "Uv" || key == "Dust_pm10" || key == "Dust_pm25"){
							$('.grid-stack-item-content[target="'+template[key].target+'"]').find('.content').html(GridStackUI.Utils.AirData[key]);
							$('.gridPanel .grid-stack-item-content[target="'+template[key].target+'"]').css('background-color', GridStackUI.Utils.AirData[key +'_color']);
						}
					}
					if(items[key].type == "chart") {
						GridStackUI.Utils.createChart(id);
						$('.grid-stack-item-content[target='+items[key].target+']').find('.title').attr('key', key);
						$('.grid-stack-item-content[target='+items[key].target+']').find('.title').attr('target', items[key].target);
					}
					if(items[key].type == "map") {
						if(key == "EventMap") $ele.find(".grid-stack-item-content").find(".title").css('color', '#dddddd');
						GridStackUI.Utils.createMap(id);
					}
					if(items[key].type == "image") {
						GridStackUI.Utils.createImage(items[key].target);
					}
				}

				$('.grid-stack-item-content').find('.title').dblclick(function(){
					var key = $(this).attr('key');
					var target = $(this).attr('target');

					$(".contentWrapper").find('.grid-stack').data("gridstack").removeWidget($(this).closest('.grid-stack-item'));

					if(items[key].type == "map"){
						GridStackUI.Utils.removeMap(key);
					}
					if(items[key].type == "image"){
						GridStackUI.Utils.removeA(target);
						if(GridStackUI.Utils.ImagesInterval[target] > 0) {
							clearInterval(GridStackUI.Utils.ImagesInterval[target]);
							delete GridStackUI.Utils.ImagesInterval[target];
						}
					}
					if(items[key].type == "chart"){
						GridStackUI.Utils.Charts[key].destroy();
						GridStackUI.Utils.removeChart(key);
					}
					if(key == "EventMap"){
						if(GridStackUI.Utils.socket != null){
							GridStackUI.Utils.socket.destroy();
						}
					}

					delete items[key];
					if($(".contentWrapper").find(".widget-button[for="+template[key].gbn+"]").attr("active") == "active"){
						var arr = [key];
						createSildeWidget(arr);
						$('.slidePanel').find('.grid-stack-item').show();
					}
					//아이템이 한개도 없을 때 드래그할 수 있는 여유공간을 확보한다.
					if($(".contentWrapper").find('.gridPanel').find('.grid-stack-item').length == 0)
						$(".gridPanel").find('.grid-stack').css('height', '100px');
				});
			});

			GridStackUI.Utils.setWidgetColor();
			GridStackUI.Utils.setAllMapAlign();
			GridStackUI.Utils.setAllImageAlign();
			GridStackUI.Utils.setAllChartAlign();
			GridStackUI.Utils.startInterval();
		}
		$('.gridPanel .grid-stack-item-content').attr('active', 'active');
		$('.slidePanel .grid-stack-item-content').attr('active', 'inactive');


		if($('.slideWrap').attr('active')!='active')
			$('.slidePanel .grid-stack-item-content[active="inactive"]').parent().hide();
	});

	$(document).on('dblclick', '.presetBtn', function(){
		var $thisBtn = $(this);
		if($thisBtn.attr('active') == 'active'){
			var btnName = $thisBtn.text();
			var mgrSeq = $thisBtn.data()['mgrSeq'];
			$('#pagePopup').bPopup({
				appendTo : $(".contentWrapper"),
				onOpen: function() {
					$(".contentWrapper").find('#pagePopup').find("#bpop_title").text('제목 수정');
					$(".contentWrapper").find('#pagePopup').find("#brdTitle").val(btnName);
					$(".contentWrapper").find('#pagePopup').find("#saveBtn").attr('mode','edit');
					$(".contentWrapper").find('#pagePopup').find("#saveBtn").attr('mgrseq', mgrSeq);
				},
				onClose : function(){
				}
			});
		}
	});


	//181213 이은규
	//아무 아이템도 없는 페이지가 로드되면 최소 드래그할 영역은 만들어준다.
	/* if($(".contentWrapper").find('.gridPanel').find('.grid-stack-item').length == 0)
		$(".gridPanel").find('.grid-stack').css('height', '100px'); */

	/*
	* 181208 장대건
	* 날씨정보를 대시보드에 업로드.
	*/
	/* var result = BoardAPI.getWeatherDataToBoard();
	$('.gridPanel .grid-stack-item-content[target="hum"]').find('.content').html(result.hum);
	$('.gridPanel .grid-stack-item-content[target="wind"]').find('.content').html(result.wind);
	$('.gridPanel .grid-stack-item-content[target="rain"]').find('.content').html(result.rain);
	$('.gridPanel .grid-stack-item-content[target="temp"]').find('.content').html(result.temp); */

	//사이드메뉴 생성

	var _html = '';
	_html += '<button id="btn-normal" class="widget-button" for="basic">기본</button>';
	_html += '<button id="btn-weather" class="widget-button" for="weather">기상</button>';
	_html += '<button id="btn-event" class="widget-button" for="event">이벤트</button>';
	//_html += '<button id="btn-map" class="widget-button">지도</button>';
	$(".contentWrapper").find('#overlay-west-side-bar').append(_html);

	$(".contentWrapper").find(".widget-button").click(function(){
		// 페이지가 없을경우, 페이지 생성 경고문을 띄운다.
		if(isEmpty($(".contentWrapper").find(".presetBtn"))){
			alert('페이지를 먼저 생성해 주십시오.');
			return;
		}
		var chkActive = $(this).attr("active");

		//이미 선택되어있는 버튼이면 메뉴 패널을 숨긴다.
		if(chkActive == "active"){
			//메뉴패널 숨기는 애니메이션
			$(".contentWrapper").find('.slideWrap').animate({
			    width: '0px'
			}, 700);
			//그리드패널 확장 애니메이션
			var _totalWidth = $('#overlay-west-contents').width() - $('#overlay-west-side-bar').width();
			$(".contentWrapper").find('.gridPanel').animate({
			    width: (_totalWidth - 60)+'px'
			}, 700, function(){
				resizeDone();
				GridStackUI.Utils.setAllMapAlign();
				GridStackUI.Utils.setAllImageAlign();
				GridStackUI.Utils.setAllChartAlign();
			});
			//현재 버튼의 active를 해제한다.
			$(this).removeAttr("active");
			//그리드패널의 active를 해제한다.
			$(".contentWrapper").find(".slideWrap").removeAttr("active");

			$(".contentWrapper").find('.slidePanel').find('.grid-stack-item').hide();
		} else {
			//모든 메뉴버튼의 active를 해제한다.
			$(".contentWrapper").find(".widget-button").removeAttr("active");
			//해당 버튼의 타겟 메뉴만 보이게한다.
			var target = $(this).attr("for");
			setWidgetVisible(template, items, target);
			//이미 메뉴패널이 active상태이면 메뉴만 변경,
			//active상태가 아니면 메뉴 패널 생성애니메이션을 처리한다.
			var chkPanel = $(".contentWrapper").find(".slideWrap").attr("active");

			if($('.slidePanel').find('.grid-stack-item').length > 0){
				if(chkPanel != "active"){
					//메뉴패널 생성 애니메이션
					$(".contentWrapper").find('.slideWrap').animate({
					    width: '230px'
					}, 700);
					//그리드패널 사이즈 변경 애니메이션(작게)
					var _totalWidth = $('#overlay-west-contents').width() - $('#overlay-west-side-bar').width();
					$(".contentWrapper").find('.gridPanel').animate({
					    width: (_totalWidth - 200 - 40)+'px'
					}, 700, function(){
						resizeDone();
						GridStackUI.Utils.setAllMapAlign();
						GridStackUI.Utils.setAllImageAlign();
						GridStackUI.Utils.setAllChartAlign();
						$('.slidePanel').find('.grid-stack-item').show();
					});
				}else{
					$('.slidePanel').find('.grid-stack-item').show();
				}
				//현재 버튼 active처리.
				$(this).attr("active", "active");
				//그리드패널의 active를 홠성화한다.
				$(".contentWrapper").find(".slideWrap").attr("active", "active");
			} else {
				alert('표시할 위젯이 없습니다.');
				//패널이 열려있으면 닫는다.
				if($(".contentWrapper").find(".slideWrap").attr("active") == "active"){
					$(".contentWrapper").find(".slideWrap").removeAttr("active");
					$(".contentWrapper").find('.slideWrap').css('width', '0px');
					$(".contentWrapper").find('.slidePanel').css('width', '0px');
					var _totalWidth = $('#overlay-west-contents').width() - $('#overlay-west-side-bar').width();
					$(".contentWrapper").find('.gridPanel').css('width', (_totalWidth - 30)+'px');

					resizeDone();
					GridStackUI.Utils.setAllMapAlign();
					GridStackUI.Utils.setAllImageAlign();
					GridStackUI.Utils.setAllChartAlign();
				}
			}
		}
	});

	function setWidgetVisible(template, items, gbn){
		//좌측 패널을 clear한다.
		//GridStackUI.Utils.clearGrid('.slidePanel');
		//$('.slidePanel').gridstack(_.defaults(sidebar_options2), sidebar_options);

		$('.slidePanel').empty();

		var tmpltKeys = Object.keys(template);

		for(var key in template){
			if(template[key].gbn != gbn) GridStackUI.Utils.removeA(tmpltKeys, key);
		}

		if(items){
			var itemsKeys = Object.keys(items);
			for(var i=0; i< itemsKeys.length; i++){
				GridStackUI.Utils.removeA(tmpltKeys, itemsKeys[i]);
			}
		}

		createSildeWidget(tmpltKeys);

	}

	function createSildeWidget(arr){
		if($(".grid-stack").html().length == 0){
			var grid = $(".contentWrapper").find('.grid-stack').data('gridstack');
			var $ele = $('<div><div class="grid-stack-item-content" /><div/>');
			$ele.find(".grid-stack-item-content").attr("target", "signCnt").data(template["SignCnt"])
				.append('<div class="title" key="SignCnt" target="signCnt">오늘 로그인 수</div>')//!!
				.append('<div class="content">0</div>');
			grid.addWidget($ele, 0, 0, 0, 0, false, 1, 4, 1, 4, "SignCnt");
			$(".grid-stack-item").remove();
		}

		var droppables = [];

		for(var j=0; j<arr.length; j++){
			var obj = {};
			obj.x = 0;
			obj.y = j;
			obj.width = 1;
			obj.height = 1;
			obj.key = arr[j];

			droppables.push(obj);
		}

		_.each(droppables, function(node) {
			var $ele = $('<div class="grid-stack-item hidden"><div class="grid-stack-item-content"></div></div>');// class="hidden"
			$ele.css('margin-bottom', '10px');
			$ele.find('.grid-stack-item-content')
				.append('<div class="title" style="position: relative !important;" key="'+node.key+'" target="'+template[node.key].target+'">' + template[node.key].title + '</div>')
				.append('<div class="content"></div>')
				.css('height', '40px');

			$ele.draggable({
	            revert: 'invalid',
	            handle: '.grid-stack-item-content',
	            scroll: false,
	            drag: function( event, ui ) {
	            	$(".gridPanel").find('.grid-stack').css('border', '1px dashed white');
	            	if($(".contentWrapper").find('.gridPanel').find('.grid-stack-item').length == 0)
	    				$(".gridPanel").find('.grid-stack').css('height', '100px');
	            },
				stop: function( event, ui ) {
		        	$(".gridPanel").find('.grid-stack').css('border', 'none');
		        }
	            //, appendTo: 'slideWrap'
	        });
			$('.slidePanel').append($ele);
			//sidebar.addWidget($ele, node.x, node.y, node.width, node.height);
		}, this);

		/* $('.slidePanel .grid-stack-item').draggable({
            revert: 'invalid',
            handle: '.grid-stack-item-content',
            scroll: false,
            drag: function( event, ui ) {
            	$(".gridPanel").find('.grid-stack').css('border', '1px dashed white');
            },
			stop: function( event, ui ) {
	        	$(".gridPanel").find('.grid-stack').css('border', 'none');
	        }
            //, appendTo: 'slideWrap'
        }); */
		//GridStackUI.Utils.setVertialSort();
	}


	$(".contentWrapper").find('.grid-stack').on('dragstart', function(event, ui) {
		$(".gridPanel").find('.grid-stack').css('border', '1px dashed white');
	});
	$(".contentWrapper").find('.grid-stack').on('dragstop', function(event, ui) {
		$(".gridPanel").find('.grid-stack').css('border', 'none');
	});

	$(".contentWrapper").find('.grid-stack').on('dropped', function(event, previousWidget, newWidget) {
		//TODO 위젯 추가됏을때의 행동 처리하면 됨.
		var key  = $(newWidget.el).find('.title').attr("key");
		$(newWidget.el).find('.grid-stack-item-content').attr('active', 'active');
		$(newWidget.el).find('.grid-stack-item-content').css('height', '100%');
		$(newWidget.el).find('.grid-stack-item-content').css('background', GmxColor.random());
		$(newWidget.el).find('.grid-stack-item-content').find('.title').css('position', 'absolute');
		$(newWidget.el).find(".grid-stack-item-content").attr("target", template[key].target).data(template[key]);

		var grid = $(this).data('gridstack');
		var id = key;
		if(id) $(newWidget.el).find('.grid-stack-item-content').attr("id", id);
		if(template[key].type == "text"){
			$(newWidget.el).find('.grid-stack-item-content').attr('target', template[key].target);
			$(newWidget.el).find('.grid-stack-item-content').attr('id', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('key', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('target', template[key].target);

			if(key == "Hum" || key == "Wind" || key == "Rain")
				$('.grid-stack-item-content[target="'+template[key].target+'"]').find('.content').html(GridStackUI.Utils.WeatherData[key]);
			if(key == "SignCnt" || key == "UsrCnt" || key == "TodayEventCnt" || key == "TodayAnalysCnt" || key == "TodayTviusCnt" || key == "GenderCount")
				$('.grid-stack-item-content[target="'+template[key].target+'"]').find('.content').html(GridStackUI.Utils.ServerData[key]);
			if(key == "Uv" || key == "Dust_pm10" || key == "Dust_pm25"){
				$('.grid-stack-item-content[target="'+template[key].target+'"]').find('.content').html(GridStackUI.Utils.AirData[key]);
				$('.gridPanel .grid-stack-item-content[target="'+template[key].target+'"]').css('background-color', GridStackUI.Utils.AirData[key +'_color']);
			}
		}
		if(template[key].type == "chart") {
			//<div class="grid-stack-item-content" target="ageBarChart" id="AgeBarChart" data-highcharts-chart="13" style="background: maroon;">

			GridStackUI.Utils.createChart(key);

			$(newWidget.el).find('.grid-stack-item-content').attr('target', template[key].target);
			$(newWidget.el).find('.grid-stack-item-content').attr('id', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('key', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('target', template[key].target);


			if(key == 'GaugeChart'){
				GridStackUI.Utils.Charts['GaugeChart'].series[0].points[0].update(GridStackUI.Utils.WeatherData["Temp"]);
			}
			else if(key=="AgeBarChart")
				GridStackUI.Utils.Charts['AgeBarChart'].series[0].setData(getAgeStat()[0].data);
			else if(key=="CctvLineChart")
				GridStackUI.Utils.Charts['CctvLineChart'].series[0].setData(getTodayCctvByTime());
			else if(key=="EventLineChart"){
				GridStackUI.Utils.Charts['EventLineChart'].xAxis[0].update({'categories':getEvtList(),'title':{'text': null}});
				GridStackUI.Utils.Charts['EventLineChart'].series[0].setData(getEvtListData(Date.prototype.getYMD()));
				GridStackUI.Utils.Charts['EventLineChart'].series[1].setData(getEvtListData(Date.prototype.getYMD()-1));
			}
			else if(key=="AssetLineChart"){
				GridStackUI.Utils.Charts['AssetLineChart'].xAxis[0].update({'categories':getAssetList(),'title':{'text': null}});
				GridStackUI.Utils.Charts['EventLineChart'].series[0].setData(getAssetListData(Date.prototype.getYMD()));
				GridStackUI.Utils.Charts['EventLineChart'].series[1].setData(getAssetListData(Date.prototype.getYMD()-1));
			}
			else if(key=="TimeLineChart")
				GridStackUI.Utils.Charts['TimeLineChart'].series[0].setData(getTodayAcesByTime());
			GridStackUI.Utils.Charts[key].reflow();
		}
		if(template[key].type == "map") {
			$(newWidget.el).find('.grid-stack-item-content').attr('target', template[key].target);
			$(newWidget.el).find('.grid-stack-item-content').attr('id', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('key', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('target', template[key].target);

			if(key == "EventMap") $(newWidget.el).find(".grid-stack-item-content").find(".title").css('color', '#dddddd');
			GridStackUI.Utils.createMap(key);
			GridStackUI.Utils.setAllMapAlign();
		}
		if(template[key].type == "image") {
			$(newWidget.el).find('.grid-stack-item-content').attr('target', template[key].target);
			$(newWidget.el).find('.grid-stack-item-content').attr('id', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('key', key);
			$('.grid-stack-item-content[target='+template[key].target+']').find('.title').attr('target', template[key].target);

			GridStackUI.Utils.createImage(template[key].target);
			GridStackUI.Utils.setAllImageAlign();
		}

		GridStackUI.Utils.setVertialSort();
		items[key] = template[key];

		$(newWidget.el).find('.grid-stack-item-content').find('.title').dblclick(function(){
			$(this).attr('active', '');
			var key = $(this).attr('key');
			var target = $(this).attr('target');

			$(".contentWrapper").find('.grid-stack').data("gridstack").removeWidget($(this).closest('.grid-stack-item'));

			if(items[key].type == "map"){
				GridStackUI.Utils.removeMap(key);
				if(key == "EventMap") GridStackUI.Utils.Socket.destroy();
			}
			if(items[key].type == "chart"){
				GridStackUI.Utils.Charts[key].destroy();
				GridStackUI.Utils.removeChart(key);
			}
			if(items[key].type == "image"){
				GridStackUI.Utils.removeA(GridStackUI.Utils.Images, target);
				if(GridStackUI.Utils.ImagesInterval[target] > 0) {
					clearInterval(GridStackUI.Utils.ImagesInterval[target]);
					delete GridStackUI.Utils.ImagesInterval[target];
				}
			}

			delete items[key];
			if($(".contentWrapper").find(".widget-button[for="+template[key].gbn+"]").attr("active") == "active"){
				var arr = [key];
				createSildeWidget(arr);
				$('.slidePanel').find('.grid-stack-item').show();
			}
			//아이템이 한개도 없을 때 드래그할 수 있는 여유공간을 확보한다.
			/* if($(".contentWrapper").find('.gridPanel').find('.grid-stack-item').length == 0)
				$(".gridPanel").find('.grid-stack').css('height', '100px'); */
		});
	});

	$('.grid-stack').on('gsresizestop', function(event, elem) {
		GridStackUI.Utils.setVertialSort();
		GridStackUI.Utils.setAllMapAlign();
		GridStackUI.Utils.setAllImageAlign();
		GridStackUI.Utils.setAllChartAlign();
	});

	////////////////////////////////////////////////////


	$(".contentWrapper").find('#addPageBtn').click(function(){
		$('#pagePopup').bPopup({
			appendTo : $(".contentWrapper"),
			onOpen: function() {
				$(".contentWrapper").find('#pagePopup').find("#bpop_title").text('페이지 추가');
				$(".contentWrapper").find('#pagePopup').find("#brdTitle").val('');
				$(".contentWrapper").find('#pagePopup').find("#saveBtn").attr('mode','add');
				$(".contentWrapper").find('#pagePopup').find("#saveBtn").removeAttr('mgrseq');
			},
			onClose : function(){
			}
		});
	});

	$(".contentWrapper").find('#pagePopup').find('#closePagePop').click(function(){
		$('#pagePopup').bPopup().close();
	});

	$(".contentWrapper").find('#pagePopup').find("#saveBtn").click(function(){
		var $thisBtn = $(this);
		var mode = $thisBtn.attr('mode');
		if(mode == "add"){
			var _param = {};
			var brdTitle = $(".contentWrapper").find('#pagePopup').find("#brdTitle").val();
		 	if(isEmpty(brdTitle)){
		 		alert("제목을 입력하십시오.");
		 		return;
		 	}
		 	else if(isEmpty(brdTitle.trim())){
		 		alert("최소 1자 이상의 글자를 입력하십시오.");
		 		return;
		 	}
			_param['brdTitle'] = brdTitle;
			_param['jsonTxt'] = "{}";
			_common.callAjax("/board/addDashbdList.json", _param, function(json){
				if(json.result){
					var $presetBtn = $("<button class='presetBtn' mgrseq='" + json.result['mgrSeq'] + "' style='padding: 7px; margin-top: 1px;'><div id='presetTitle' class='mainTooltip' title='"+json.result.brdTitle+"'>"+json.result.brdTitle+"</div></button>")
					.data(json.result).data("jsonTxt","{}");
					/* 190111 장대건
					 * 후에 생성되는 프리셋버튼들 클릭이벤트는, delegated event로 바인딩해서 필요x
					 */
// 					.attr('mgrseq', json.result.mgrSeq)
// 					.click(function(){
// 						if($(this).attr('active') != 'active'){

// 							$('.presetBtn').removeAttr('active');
// 							$(this).attr('active', 'active');

// 							GridStackUI.Utils.stopInterval();
// 							GridStackUI.Utils.clearGrid('#grid');
// 							$(".contentWrapper").find('#grid').gridstack(options);
// 							//아무것도 없으니 안하고 새로 위젯에 추가될때 스타트인터벌 걸어주면 될거같음.
// 							//GridStackUI.Utils.startInterval();
// 						}
// 					});
					$(".contentWrapper").find("#overlay-west-button-wrap").append($presetBtn);
					$presetBtn.click();
					alert("생성되었습니다.");
					$(".contentWrapper").find('#pagePopup').find('#closePagePop').click();
				}
			});
		}else if(mode == "edit"){ //!!
			var mgrSeq = $thisBtn.attr('mgrseq');
			if(mgrSeq){
				var _param = {};
				_param['mgrSeq'] = mgrSeq;
				_param['brdTitle'] = $(".contentWrapper").find('#pagePopup').find("#brdTitle").val();
				_common.callAjax("/board/editDashbdList.json", _param, function(json){
					if(json.result){
						alert("변경되었습니다.");
						$(".presetBtn[mgrseq="+mgrSeq+"]").html("<div id='presetTitle' class='mainTooltip' title='"+_param['brdTitle']+"'><div>"+_param['brdTitle']+"</div>");

						$(".contentWrapper").find('#pagePopup').find('#closePagePop').click();
					}
				});
			}
		}
	});

	$(".contentWrapper").find('#delBtn').click(function(){
		if(isEmpty($(".contentWrapper").find(".presetBtn"))){
			alert('삭제할 페이지가 없습니다.');
			return;
		}
		var mgrSeq =$('.presetBtn[active=active]').attr("mgrseq");
		if(mgrSeq){
			confirm("현재 페이지를 삭제하시겠습니까?", function(){
				_common.callAjax("/board/delDashbdList.json", {'mgrSeq': mgrSeq}, function(json){
					if(json.result){
						alert("삭제되었습니다.");
						$(".presetBtn[mgrseq="+mgrSeq+"]").remove();
						if($(".presetBtn").length > 0) {
							$(".contentWrapper").find("#overlay-west-button-wrap").find('.presetBtn').eq(0).click();
						}else{
							GridStackUI.Utils.stopInterval();
							GridStackUI.Utils.clearGrid('#grid');
							$(".contentWrapper").find('#grid').gridstack(options);

							//메뉴패널 숨기는 애니메이션
							$(".contentWrapper").find('.slideWrap').animate({
							    width: '0px'
							}, 700);
							//그리드패널 확장 애니메이션
							var _totalWidth = $('#overlay-west-contents').width() - $('#overlay-west-side-bar').width();
							$(".contentWrapper").find('.gridPanel').animate({
							    width: (_totalWidth - 60)+'px'
							}, 700, function(){
								resizeDone();
								GridStackUI.Utils.setAllMapAlign();
								GridStackUI.Utils.setAllImageAlign();
								GridStackUI.Utils.setAllChartAlign();
							});
							//현재 버튼의 active를 해제한다.
							$(".contentWrapper").find(".widget-button[active='active']").removeAttr('active');
							//그리드패널의 active를 해제한다.
							$(".contentWrapper").find(".slideWrap").removeAttr("active");
							$(".contentWrapper").find('.slidePanel').find('.grid-stack-item').hide();
						}
					}
				});
			}, function(){
				$(this).val("");
			});
		}
	});

	$(".contentWrapper").find('#editBtn').click(function(){
		if($('.presetBtn[active=active]').length > 0){
			confirm("현재 내용을 저장하시겠습니까?", function(){
				var _param = {};
				_param['mgrSeq'] =$('.presetBtn[active=active]').attr("mgrseq");
				//_param["jsonTxt"] = JSON.stringify(GridStackUI.Utils.saveGrid());
				var arr = GridStackUI.Utils.saveGrid();
				var obj = {};
				for(var i=0; i<arr.length; i++){
					obj[arr[i].id] = arr[i];
				}
				_param["jsonTxt"] = JSON.stringify(obj);
				_common.callAjax("/board/editDashbdList.json", _param, function(json){
					if(json.result){
						alert('저장되었습니다.');
						$('.presetBtn[active=active]').data()['jsonTxt'] = _param['jsonTxt'];
					}
				});
			}, function(){
				$(this).val("");
			});
		} else {
			alert("활성화된 페이지가 없습니다.\r\n페이지 생성 후 다시 시도하여 주십시오.");
		}
	});

	GridStackUI.Utils.startInterval();
	/* GridStackUI.Utils.setAllMapAlign();
	GridStackUI.Utils.setAllImageAlign();
	GridStackUI.Utils.setAllChartAlign(); */

// 	$(document).on("hover", "#addPageBtn, #delBtn, #editBtn", function(){
// 		$(this).css('background-color', '#4582ac');
// 	});
	$(document).on("hover", "#addPageBtn", function(){
		$(this).css('background-color', '#4582ac');
	});

	/* 181207 장대건. 대시보드 화면 레이아웃 오류 해결 */
	$(document).ready(function(){
		$('.mCustomScrollBox ').css('width','100%');
		$("#boardView").find("#center-overlay-west").find(".dashboardBtn").show();
	});

	function isEmpty(value){
		if( value == "" || value == null || value == undefined
				|| ( value != null && typeof value == "object" && !Object.keys(value).length )
				|| ( value != null && typeof value == "object" && !value.length ))
		{
			return true;
		}else{
			return false;
		}
	};

})();
</script>

<style>
#boardView #overlay-west-contents {
	background: #3E3F48;
}
#grid {
	margin-top: 20px;
}

.grid-stack-item-content {
	color: #2c3e50;
	text-align: center;
	background-color: white;
}

.grid-stack-item-content > .title, .highcharts-title {
	position: absolute;
    text-align: center;
    cursor: default;
    width: 100%;
    font-weight: bold;
    font-size: 20px;
    padding: 5px;
    z-index: 1;
}

.grid-stack-item-content > .content {
	position: absolute;
    text-align: center;
    cursor: default;
    width: 100%;
    font-size: 50px;
    font-weight: bold;
}

.slidePanel .grid-stack-item {
	background-color: #333;
	margin-left: 6px;
	border-radius: 4px;
	width: 94%;
	border: 2px solid #2B908F;
	height: 48px;
}
.slidePanel .grid-stack-item-content {
	background:none;
}
.slidePanel .grid-stack-item-content > div {
	font-size: 16px;
	margin-top: 9px;
	color : white;
    width: 94%;
}

#widgetWrapper {
    position: absolute;
    top: 0;
    right: 0;
    background: #3E3F48;
    height: 100%;
    border-left: 1px solid #30303A;
}

#widgetWrapper > #titleWrap {
    border-bottom: 1px solid #30303A;
    text-align: right;
}

#widgetWrapper #widgetWrapperClose {
	width: 40px;
    padding: 7px;
    background: none;
}

#widgetWrapper > #widgetMng {
    margin: 10px;
    max-width: 365px;
	height: 94%;
}

.widgetOnOff {
	padding: 20px;
	margin: 2px;
	display: inline-block;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	width: 177px;
}

#hideWrapper {
	position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(62, 63, 72, 0.8);
    top: 0;
    left: 0;
}

#overlay-west-side-bar>.widget-button:first-child {
    border-top: none !important;
}
#overlay-west-side-bar>.widget-button {
    width: 70px;
    height: 80px;
    cursor: pointer;
    color: white;
    outline: none;
    font-size: 12px;
    font-weight: bold;
    background: transparent;
    margin: 0;
    border-right: none !important;
    border-left: none !important;
    border-bottom: 1px #303035 solid;
    border-top: 1px #65656d solid;
}
#overlay-west-side-bar>.widget-button[active=active] {
	background: #4582AC !important;
}

/* .subMenu{
	display: none;
    top: 50px;
    right: 0px;
    background: #3e3f48;
}
.subMenu>.item{
	width: 150px;
    height: 50px;
    cursor: pointer;
    color: #a7a7aa;
    outline: none;
    font-size: 12px;
    font-weight: bold;
	background: #3e3f48;
    margin: 0;
    border-right: none !important;
    border-left: none !important;
    border-bottom: 1px #303035 solid;
    border-top: 1px #65656d solid;
    text-align: center;
    line-height: 50px;
}

.subMenu>.item:first-child {
	border-top: none !important;
}

.subMenu>.item:hover {
	color: white;
} */

/*
* 181204 장대건
* 1. 대시보드 프리셋 버튼 css 적용 (기존에 적용된 클래스 'blueBtn' 삭제)
* 2. 프리셋버튼 내에 제목이 들어갈 div id 추가
* 3. 각 버튼들 호버 이벤트 적용
*
* 181206 장대건
* 1. 대시보드 프리셋 버튼 스크롤바 css 추가
*/
#overlay-west-button-wrap .presetBtn {
	width: 110px;
	background-color: #21222B;
	cursor: pointer;
	border: none;
	border: 1px solid #1f1f24;
	outline: none;
}
#overlay-west-button-wrap .presetBtn[active=active] #presetTitle{
    font-weight: bold !important;
	color: #ffffff !important;
}
/* #overlay-west-button-wrap .presetBtn:hover { */
/* 	background-color: #4582ac;  */
/* } */

#presetTitle {
	width: 100%;
	display : inline-block;
	text-overflow : ellipsis;
	overflow : hidden;
	white-space : nowrap;
	font-weight: normal !important;
    color: #999999 !important;
}

.dashboardBtn{
	background-color: rgb(48, 48, 58);
	color: white;
	border: none;
	font-size: 13px;
	cursor: pointer;
	font-weight: bold;
}
.dashboardBtn:hover{
 	background-color: #4582ac;
}

.presetWrap {
    margin-top: 1px;
    float: left;
    margin-left: 76px;
    width: 985px;
	overflow-x: scroll;
	white-space: nowrap;
}

.boardChart {
	margin-left: 76px !important;
	background-color: #21222B;
	width: 94.5%;
}
.presetWrap::-webkit-scrollbar {padding-top:2px; width:10px; height:10px;}
.presetWrap::-webkit-scrollbar-track {background:none;}
.presetWrap::-webkit-scrollbar-thumb {background-color:rgb(69, 130, 172); border-radius: 25px;  border: 3px #3e3f48 solid;}
.presetWrap::-webkit-scrollbar-thumb:hover {background: #4582AC;}


</style>
<div class="searchWrapper boardChart customScroll" data-mcs-theme="minimal-dark">
	<div style="display: inline-block;">
		<div style="margin: 0 auto; display: inline-block;">
			<div class="slideWrap" style="float:left; width: 0px; height:100%; border-right: 1px solid #30303A; background-color: #333;">
				<div class="slidePanel" style="width:100%">
				</div>
			</div>
			<div class="gridPanel" style="float:left; width: 100%;">
				<div class="grid-stack grid-stack-animate" id="grid" data-gs-animate="yes"></div>
			</div>
		</div>
	</div>

</div>

<div id="hideWrapper" class="hidden"></div>
<div id="widgetWrapper" class="hidden">
	<div id="titleWrap">
		<button class="blueBtn" id="widgetWrapperClose">
			<img src="/xeus/res/img/close_btn.png">
		</button>
	</div>
	<!-- <div id="widgetMng" class="customScroll" data-mcs-theme="minimal-dark">
		<button class="widgetOnOff whiteBtn" target="temp">온도</button>
		<button class="widgetOnOff whiteBtn" target="hum">습도</button>
		<button class="widgetOnOff whiteBtn" target="wind">풍량</button>
		<button class="widgetOnOff whiteBtn" target="rain">강수확률</button>
		<button class="widgetOnOff whiteBtn" target="uv">자외선</button>
		<button class="widgetOnOff whiteBtn" target="dust">미세먼지</button>
		<button class="widgetOnOff whiteBtn" target="ultraDust">초미세먼지</button>
		<button class="widgetOnOff whiteBtn" target="usrCnt">총 사용자</button>
		<button class="widgetOnOff whiteBtn" target="signCnt">오늘 로그인 수</button>
		<button class="widgetOnOff whiteBtn" target="todayAnalysCnt">오늘 분석된 데이터</button>
		<button class="widgetOnOff whiteBtn" target="">총 분석된 데이터</button>
		<button class="widgetOnOff whiteBtn" target="todayTviusCnt">오늘 반출된 영상</button>
		<button class="widgetOnOff whiteBtn" target="eventMap">이벤트 지도</button>
		<button class="widgetOnOff whiteBtn" target="cctvHitMap">CCTV 분포도</button>
		<button class="widgetOnOff whiteBtn" target="eventChart">이벤트 발생 차트</button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
		<button class="widgetOnOff whiteBtn" target=""></button>
	</div> -->

	<div id="pagePopup" class="bpopup hidden">
		<div id="bpop_wrap">
	        <h2 id="bpop_title">페이지 추가</h2>
			<table style="width: 390px;">
				<tr>
					<th class="top">제목</th>
					<td><input type="text" id="brdTitle" class="wide"/></td>
				</tr>
			</table>
			<table>
	            <tbody>
		            <tr align="center">
		                <td class="lastTd" colspan="2" style="border: 0 !important;">
		                    <button id="saveBtn" tabindex="4" mode="add">저장</button>
		                    <button id="closePagePop" class="bpopClose" tabindex="5">취소</button>
		                </td>
		            </tr>
		        </tbody>
	        </table>
		</div>
	</div>
</div>