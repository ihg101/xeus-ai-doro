/**
 * 관리자 영상반출 신청현황 페이지 관련 이벤트 입니다.
 */

	$(document).ready(function(){

		if (chkParam != "") $(".contentWrapper").find('#btn_list_all').show();
		else $(".contentWrapper").find('#btn_list_all').hide();
		if ($('#max').val() == '0') $(".contentWrapper").find('#btn_list_all').show();

		$(".contentWrapper").find(".paging_wrap").paging({
			current	  : 10,
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});


		setParam();

		resizeDone();

	});

//	$(window).resize(function(){
//
//		clearTimeout( timer );
//	    timer = setTimeout( resizeDone, delta );
//	});

	function resizeDone() {

		//$(".contentWrapper").find('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-10);
		$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height() - 40);

	}

	$(".contentWrapper").find("#btn_list_all").click(function(){

		var _param = {};
		_param['limit'] = '10';
		_param['offset'] = '0';
		_param['year'] = currYear;
		//_param['offset'] = '0';

		callView(0, _param, 'all');

	});

	$(".contentWrapper").find("#btn_sch").click(function(){
		var user = $(".contentWrapper").find('#userKw').val().trim();
		var searchTyp = $(".contentWrapper").find('#userKwTyp').val().trim();
		var reqGbnCd = $(".contentWrapper").find('#reqGbnCd').val().trim();
		var crimeTyp = $(".contentWrapper").find('#crimeTyp').val().trim();
		var startDat = $(".contentWrapper").find('#startDat').val().trim().replace(/\-/g,'');
		var endDat = $(".contentWrapper").find('#endDat').val().trim().replace(/\-/g,'');

		var _param = {};

		_param['limit'] = '10';
		_param['offset'] = '0';
		_param['sch'] = 'Y';

		if (user != ''){
			if(searchTyp == 'nm') _param['userNm'] = user;
			else if(searchTyp == 'id') _param['reqstId'] = user;
		}

		if ( reqGbnCd != '') _param['reqGbnCd'] = reqGbnCd;
		if ( crimeTyp != '') _param['crimeTyp'] = crimeTyp;
		if ( startDat != '') _param['startDat'] = startDat + '000000';
		if ( endDat != '') _param['endDat'] = endDat + '235959';

		_common.callAjax("/tvius/getMngTviusRqstMngView.do", _param, function(view) {
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});

	});

	/**
	 * TODO iText maven에 추가되면 개발해야 함.
	 */
	$(".contentWrapper").find("#btn_print").click(function(){
		//alert('btn_print click!!');

		var user = $(".contentWrapper").find('#userKw').val().trim();
		var searchTyp = $(".contentWrapper").find('#userKwTyp').val().trim();
		var reqGbnCd = $(".contentWrapper").find('#reqGbnCd').val().trim();
		var crimeTyp = $(".contentWrapper").find('#crimeTyp').val().trim();
		var startDat = $(".contentWrapper").find('#startDat').val().trim().replace(/\-/g,'');
		var endDat = $(".contentWrapper").find('#endDat').val().trim().replace(/\-/g,'');

		var _printParam = {};

		//_param['limit'] = '10';
		//_param['offset'] = '0';

		if (user != ''){
			if(searchTyp == 'nm') _printParam['userNm'] = user;
			else if(searchTyp == 'id') _printParam['reqstId'] = user;
		}

		if ( reqGbnCd != '') _printParam['reqGbnCd'] = reqGbnCd;
		if ( crimeTyp != '') _printParam['crimeTyp'] = crimeTyp;
		if ( startDat != '') _printParam['startDat'] = startDat + '000000';
		if ( endDat != '') _printParam['endDat'] = endDat + '235959';

		/*_common.callAjax("/tvius/getMngLedgerView.do", _printParam, function(view){

			var _param = {};
			_param['title'] = "영상정보관리대장";
			_param["document"] = view;

			_common.postForm.submit("/tvius/getMngLedgerPdfFiles.json", _param);
		}, false);*/

		//190522 이은규
		//엑셀 다운로드로 변경
		_printParam['typ'] = 'ledger';

		_printParam['sortCol'] = 'tt.rqst_mgr_seq';
		_printParam['sortTyp'] = 'desc';


		_common.postForm.submit("/tvius/getExcel.do", _printParam);

	});

	$(".contentWrapper").find("#userKw").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#btn_sch").click();
		}
	});

	function callView(offset,_param){
		if(offset == null) offset = 0;
		if(_param === undefined){
			_param = {};
			_param['limit'] = 10;

			if(arguments[2] !== null && arguments[2] !== "" && arguments[2] !== undefined){

			} else {

				if ( reqstUserNm != '')	_param['userNm'] = reqstUserNm;
				if ( reqstId != '')		_param['reqstId'] = reqstId;
				if ( reqGbnCd != '')	_param['reqGbnCd'] = reqGbnCd;
				if ( crimeTyp != '')	_param['crimeTyp'] = crimeTyp;
				if ( startDat != '')	_param['startDat'] = startDat;
				if ( endDat != '')		_param['endDat'] = endDat;
				if ( chkParam != '')	_param['sch'] = 'Y';

			}

		}
		_param['offset'] = offset;

		_common.callAjax("/tvius/getMngTviusRqstMngView.do", _param, function(view){
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
		if ( reqGbnCd != '') $(".contentWrapper").find("#reqGbnCd").val(reqGbnCd).prop("selected", true);
		if ( crimeTyp != '') $(".contentWrapper").find('#crimeTyp').val(crimeTyp).prop("selected", true);
		if ( startDat != '') $(".contentWrapper").find('#startDat').val(startDat.substring(0,4)+'-'+startDat.substring(4,6)+'-'+startDat.substring(6,8));
		if ( endDat != '') $(".contentWrapper").find('#endDat').val(endDat.substring(0,4)+'-'+endDat.substring(4,6)+'-'+endDat.substring(6,8));

	}



