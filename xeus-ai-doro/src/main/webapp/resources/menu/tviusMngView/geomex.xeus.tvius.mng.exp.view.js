/**
 * 관리자 영상반출 신청현황 페이지 관련 이벤트 입니다.
 */


	$(document).ready(function(){

		if (chkParam != ""){
			$(".contentWrapper").find('#btn_list_all').show();
		} else {
			$(".contentWrapper").find('#btn_list_all').hide();
		}

		if ($('#max').val() == '0') $(".contentWrapper").find('#btn_list_all').show();

		var limit =$(".contentWrapper").find('#limit').val().trim();
		if(limit == undefined || limit == null || limit =="" || limit ==0){
			limit = 100;
		}

		$(".contentWrapper").find(".paging_wrap").paging({
			current	  : Number(limit),
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});


		setParam();

		//setPopDiv();
	});

	$( window ).on( 'resize', function( ) {
//	    clearTimeout( timer );
//	    timer = setTimeout( resizeDone, delta );
	} );

	function resizeDone() {

		//$(".contentWrapper").find('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height());
		$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height() - 40);

	}

	$(".contentWrapper").find("#btn_list_all").click(function(){

		var _param = {};
		_param['limit'] = '10';
		_param['offset'] = '0';

		callView(0, _param, 'all');

	});

	$(".contentWrapper").find("#btn_sch").click(function(){
		var user = $(".contentWrapper").find('#userKw').val().trim();
		var searchTyp = $(".contentWrapper").find('#userKwTyp').val().trim();
		var cctvNm = $(".contentWrapper").find('#cctvNm').val().trim();
		var startDat = $(".contentWrapper").find('#startDat').val().trim().replace(/\-/gi,'');
		var limit =$(".contentWrapper").find('#limit').val().trim();
		var endDat = $(".contentWrapper").find('#endDat').val().trim().replace(/\-/gi,'');

		var _param = {};
		_param['limit'] = limit;
		_param['offset'] = '0';
		_param['sch'] = 'Y';

		if (user != ''){

			if(searchTyp == 'nm') _param['userNm'] = user;
			else if(searchTyp == 'id') _param['reqstId'] = user;
		}

		if ( cctvNm != '') _param['cctvNm'] = cctvNm;
		if ( startDat != '') _param['startDat'] = startDat + '000000';
		if ( endDat != '') _param['endDat'] = endDat + '235959';

		_common.callAjax("/tvius/getMngTviusExpView.do", _param, function(view) {
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});

	});

	/**
	 * 엑셀 다운로드 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#xls_down_btn").click(function(){
		if(confirm("* 검색결과를 엑셀로 다운로드 하시겠습니까?")){
			var max = $('#max').val();

			if (max == "0"){
				alert("* 검색결과가 존재하지 않습니다.");
			} else {

				var _xlsParam = {};
				_xlsParam['limit'] = max;
				_xlsParam['offset'] = '0';
				_xlsParam['typ'] = 'exp';

				if ( reqstUserNm != '')		_xlsParam['userNm'] = reqstUserNm;
				if ( reqstId != '')			_xlsParam['reqstId'] = reqstId;
				if ( cctvNm != '')			_xlsParam['cctvNm'] = cctvNm;
				if ( startDat != '')		_xlsParam['startDat'] = startDat;
				if ( endDat != '')			_xlsParam['endDat'] = endDat;
				if ( playLimitDat != '')	_xlsParam['playLimitDat'] = playLimitDat;

				_common.postForm.submit("/tvius/getExcel.do", _xlsParam);
			}
		}
	});

	/**
	 * 엑셀 다운로드 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#btn_evi").click(function(){

		var _param = {};

		_param['limit'] = '10';
		_param['offset'] = '0';
		_param['sch'] = 'Y';
		_param['playLimitDat'] = '0';

		_common.callAjax("/tvius/getMngTviusExpView.do", _param, function(view) {
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});

	});

	$(".contentWrapper").find("#userKw").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#btn_sch").click();
		}
	});

	$(".contentWrapper").find("#limit").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#btn_sch").click();
		}
	});

	function callView(offset,_param){
		var limit =$(".contentWrapper").find('#limit').val().trim();
		if(offset == null) offset = 0;
		if(_param === undefined){
			_param = {};
			_param['limit'] = limit;
		}
		_param['offset'] = offset;

		if(arguments[2] !== null && arguments[2] !== "" && arguments[2] !== undefined){

		} else {

			if ( reqstUserNm != '')	_param['userNm'] = reqstUserNm;
			if ( reqstId != '')		_param['reqstId'] = reqstId;
//			if ( crimeTyp != '')	_param['crimeTyp'] = crimeTyp;
			if ( startDat != '')	_param['startDat'] = startDat;
			if ( endDat != '')		_param['endDat'] = endDat;
			if ( chkParam != '') 	_param['sch'] = 'Y';
			if ( playLimitDat != '')_param['playLimitDat'] = '0';
			if ( cctvNm != '')		_param['cctvNm'] = cctvNm;


		}

		_common.callAjax("/tvius/getMngTviusExpView.do", _param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});
	}

	/**
	 * 검색 요청시 파라미터를 요청 후 페이지에 넣는다.
	 */
	function setParam(){

		if ( reqstId != ''){
			$(".contentWrapper").find("#userKwTyp").val("id").prop("selected", true);
			$(".contentWrapper").find('#userKw').val(reqstId);
		}
		if ( reqstUserNm != ''){
			$(".contentWrapper").find("#userKwTyp").val("nm").prop("selected", true);
			$(".contentWrapper").find('#userKw').val(reqstUserNm);
		}
		if ( cctvNm != '') $(".contentWrapper").find('#cctvNm').val(cctvNm);
		if ( startDat != '') $(".contentWrapper").find('#startDat').val(startDat.substring(0,4)+'-'+startDat.substring(4,6)+'-'+startDat.substring(6,8));
		if ( endDat != '') $(".contentWrapper").find('#endDat').val(endDat.substring(0,4)+'-'+endDat.substring(4,6)+'-'+endDat.substring(6,8));

	}


