/**
 * 관리자 영상반출 상세보기 관련 이벤트 입니다.
 */

	$(document).ready(function(){

		if (pageTyp == "stat"){
			$(".contentWrapper").find('#tab_bar').show();
			$(".contentWrapper").find('.statTable').show();
			//$(".contentWrapper").find('.statTable').css('height', $(".contentWrapper").find('.statTable').find('table').height() + 150);
			$(".contentWrapper").find('.statTable').css('height', $(".contentWrapper").find('#'+pag).find('table').height() + 150);
			//$('.statTable').css('margin-left', '90px');

			$(".contentWrapper").find('.statChart').css('margin', '0px');
			$(".contentWrapper").find('.statChart').css('margin-left', '90px');
			$(".contentWrapper").find('.statChart').css('height', $(".contentWrapper").find('.statChart').width()*3.5/10);
//			$(".contentWrapper").find('.stat_list_title').css('color', '#000000');

			setYear();

		} else {
			//$('.searchWrapper').css('margin-left', '10px');
			$(".contentWrapper").find('.statChart').css('margin', '0px 5px 10px 15px');
			$(".contentWrapper").find('.statChart').css('padding', '0px 10px 0px 10px');

			$(".contentWrapper").find('.statChart').css('background', '#212228');

			if(size != '')
				$(".contentWrapper").find('.statChart').css('height', ((Number(size)/2.6)+40)+'px');


			/*$('.statChart').css('width', '95%');
			$('.statChart').css('height', '380px');*/
		}
		addChart();

		setParam();

		setTopBar();

		resizeDone();

	});

	$( window ).on( 'resize', function( ) {

//		if (pageTyp == "stat"){

//			clearTimeout( timer );
//		    timer = setTimeout( resizeDone, delta );

//		}

	} );

	function resizeDone() {

		if(pageTyp == "stat"){

			/*$('.statChart').css('width', $(window).width()-$('#overlay-west-side-bar').width()-60);
			$('.statChart').css('height', $(window).height()-$('#layout-north').height()-$('#tab_bar').height()-$('.statTable').height()-30);*/

			$(".contentWrapper").find('.statTable').css('width', $(window).width()- $(".contentWrapper").find('#overlay-west-side-bar').width() - 50);

			$(".contentWrapper").find('#searchBox').css('height', $(window).height()-$('#layout-north').height());
			$(".contentWrapper").find('.statChart').css('height', $(".contentWrapper").find('.statChart').width()*3.5/10);

		} else {

			//$('.statChart').css('width', $('.statChart').width()+20);
			/*$('.statChart').css('width', '700px');
			$('.statChart').css('height', '380px');*/
			$(".contentWrapper").find('.statChart').css('overflow', 'hidden');
		}

		addChart();

	}

	$(".contentWrapper").find("#btn_sch").click(function(){
		var reqGbnCd = $(".contentWrapper").find('#reqGbnCd').val();
		var year = $(".contentWrapper").find('#serch_year').val();

		var _statParam = {};

		_statParam['pageTyp'] = pageTyp;
		_statParam['page'] = pag;
		_statParam['year'] = year;
		if ( reqGbnCd != '') _statParam['reqGbnCd'] = reqGbnCd;

		_common.callAjax("/tvius/getStatView.do", _statParam, function(view) {
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});

	});

	$(".contentWrapper").find("#xls_down_btn").click(function(){
		if(confirm("* 조회결과를 엑셀로 다운로드 하시겠습니까?")){
			var _xlsParam = {};

			_xlsParam['typ'] = pag;
			_xlsParam['pageTyp'] = pageTyp;
			_xlsParam['page'] = pag;
			_xlsParam['year'] = year;

			if ( reqGbnCd != '') _xlsParam['reqGbnCd'] = reqGbnCd;

			_common.postForm.submit("/tvius/getExcel.do", _xlsParam);
		}
	});

	$('#tab_bar .tab_on').click(function() {
		var chk = {
				m01 : 'listuse',
				m02 : 'listsolve',
				m03 : 'listcrime',
				m04 : 'listnouse'
			};

		var dat = new Date();

		var _statParam = {};

		_statParam['pageTyp'] = pageTyp;
		_statParam['page'] = chk[$(this).attr('id')];
		_statParam['year'] = dat.getFullYear();

		_common.callAjax("/tvius/getStatView.do", _statParam, function(view) {
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});

	});

	/**
	 * 검색 요청시 파라미터를 요청 후 페이지에 넣는다.
	 */
	function setParam(){

		if ( reqGbnCd != '')	$(".contentWrapper").find('#reqGbnCd').val(reqGbnCd);
		if ( year != '')		$(".contentWrapper").find('#serch_year').val(year).prop("selected", true);

	}

	function setTopBar(){

		var chk = "";

		if(pag == "listuse")	chk = 'm01';
		if(pag == "listsolve")	chk = 'm02';
		if(pag == "listcrime")	chk = 'm03';
		if(pag == "listnouse")	chk = 'm04';


		$(".contentWrapper").find('#tab_bar #'+chk).removeClass('tab_bg');
	}


	function setYear(){
		var str = "";
		var date = new Date();
		var yy = date.getFullYear();
		var max_yy = 2015;

		for ( var i = 0; (yy-max_yy) >= i ; i++ ){
			str += '<option value="'+(yy-i)+'">'+(yy-i)+'년도</option>';
		};

		$(".contentWrapper").find('#serch_year').html(str);

	}

	function addChart(){

		try{
			//var ctx = document.getElementById("canvas").getContext("2d");
			var ctx = $(".contentWrapper").find("#canvas")[0].getContext("2d");

			/*ctx.canvas.width  = $('.statChart').width()-20;
			ctx.canvas.height = $('.statChart').height()-50;*/
			/*if(window.myBar != undefined)
			window.myBar.destroy();*/

			//window.myBar = new Chart(ctx).StackedBar(barChartData);
			window.myBar = new Chart(ctx).StackedBar(barChartData, {
				responsive : true
			});
		}catch(e){

		}

	}
