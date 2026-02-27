/**
 * 사용자 영상반출 신청현황 페이지 관련 이벤트 입니다.
 */

	$(document).ready(function(){

		if (chkParam != ""){
			$('#btn_list_all').show();
			$('#btn_list_stat_sw').hide();
			$('#btn_list_use_rst_non').hide();
		} else {
			$('#btn_list_all').hide();
		}

		$(".paging_wrap").paging({
			current	  : 10,
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});

		setUserResultBar();

		resizeDone();

	});

	$( window ).on( 'resize', function( ) {
//	    clearTimeout( timer );
//	    timer = setTimeout( resizeDone, delta );
	} );

	function resizeDone() {

		//$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height());
//		$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height() - 40);

	}

	/*$(window).resize(function(){
		var width = $(document).width() - 340;
		var height = $(document).height() - 160;
		$("#searchBox").width(width);
		//$(".searchResultWrapper").find("#tableWrapper").height(height);
		$("#searchBox").height(height);
	});*/

	//$(document).on('click', '.videoList', function(){

	/**
	 * 목록보기 클릭 시
	 */
	$(".videoList").click(function(){
		clearTimeout(intervalListChk);

		$('#videoListView').find('#drm_pop').remove();

	    $("#videoListView").empty();

		var _param ={};
		_param['rqstMgrSeq'] = $(this).attr('mgrseq');
		_param['reqGbn'] = $(this).attr('reqGbn');
		_param['videoSmy'] = $(this).attr('videosmy');

		_common.callAjax("/tvius/getUsrTviusAviList.do", _param, function(view) {
			$("#videoListView").html(view);

		});

		resizeDone();

	});

	//$(document).on('click', '.rqst_dtv', function(){
	$(".rqst_dtv").click(function(){
		var rqstMgrSeq = $(this).attr('mgrseq');
		var procStatCd = $(this).attr('procstat');

		if(rqstMgrSeq && procStatCd){
			var _rqstParam = { 'rqstMgrSeq' : rqstMgrSeq, 'procStatCd' : procStatCd };
			_common.callAjax("/tvius/getUsrTviusRqst.do", _rqstParam, function(view){
				if($("#app_rqst_pop").length > 0){
					$("#app_rqst_pop").dialog("close");
					$("#app_rqst_pop").remove();
				}

				$("#contentWrap").dialog("close").html(view).dialog({
					title : "영상정보 신청",
				    width: 500,
					height: $("#map").height(),
					position: {
						my: "left top",
						at: "left top",
						of: $("#map")
					},
					open: function(){
						$("#contentWrap").dialog("option", "width", 1000);
					},
					close: function(){
						if(Public.StopEvent != null){
							Public.StopEvent();
						}
					}
				}).dialog("open");
			}, false);
		}

	});

	//$(document).on('click', '.btn_use_rs_cd', function(){
	$(".btn_use_rs_cd").click(function(){
		//!!
		var rqstMgrSeq = $(this).attr('mgrseq');
		var $thisBtn = $(this)
		var $use_rs_cd = $('.use_rs_cd_'+rqstMgrSeq);
		var useRsCd = $use_rs_cd.val();
		if(confirm("활용결과를 저장하시겠습니까?")){
			if (useRsCd == ""){
				alert("* 활용결과를 선택하여 주십시오.");
				$use_rs_cd.focus();
			} else {
				var _rqstParam = {};
				_rqstParam['useRsCd'] = useRsCd;
				_rqstParam['mgrSeq'] = Number(rqstMgrSeq);

				_common.callAjax("/tvius/editUseRsCd.json", _rqstParam, function(json) {
					if (json.result){
						alert('저장되었습니다.');
						$use_rs_cd.attr('disabled', true);
						$thisBtn.hide();
					} else{
						alert('Save error !!!');
						$use_rs_cd.val('');
					}
				}, false);
			}

			$(this).val("");
		}
	});

	$("#btn_list_all").click(function(){

		var _param = {};
		_param['reqstId'] = userId;
		_param['limit'] = '10';
		//_param['offset'] = '0';

		callView(0, _param);

	});

	$("#btn_list_stat_sw").click(function(){

		var _param = {};
		_param['reqstId'] = userId;
		_param['procStatCd'] = 'SW';
		_param['limit'] = '10';
		//_param['offset'] = '0';

		callView(0, _param);

	});

	$("#btn_list_use_rst_non").click(function(){

		var _param = {};
		_param['reqstId'] = userId;
		_param['useRsCdNullChk'] = 'Y';
		_param['useRsCd'] = '11';
		_param['procStatCd'] = 'SK';
		_param['limit'] = '10';
		//_param['offset'] = '0';

		callView(0, _param);

	});

	/* 181221 장대건
	 * 영상정보신청현황 승인대기, 활용결과 미등록 건 클릭 시 조회목록으로 이동.
	 */
	function callListStat() {
		var _param = {};
		_param['reqstId'] = userId;
		_param['procStatCd'] = 'SW';
		_param['limit'] = '10';

		callView(0, _param);
	}

	function callListUse() {
		var _param = {};
		_param['reqstId'] = userId;
		_param['useRsCdNullChk'] = 'Y';
		_param['useRsCd'] = '11';
		_param['procStatCd'] = 'SK';
		_param['limit'] = '10';

		callView(0, _param);
	}

	function callView(offset,_param){

		clearTimeout(intervalListChk);

		if(offset == null) offset = 0;
		if(_param === undefined){
			_param = {};
			_param['limit'] = 10;
			if(chkParam == "useRst"){
				_param['useRsCdNullChk'] = 'Y';
				_param['procStatCd'] = 'SK';
			}
			if(chkParam == "stat"){
				_param['procStatCd'] = 'SW';
			}

		}
		if(sortCol != undefined && sortTyp != undefined){
			if(_param['sortCol'] != "" && _param['sortTyp'] != ""){
				_param['sortCol'] = sortCol;
				_param['sortTyp'] = sortTyp;
			}
		}


		_param['offset'] = offset;
		_param['reqstId'] = userId;
		_common.callAjax("/tvius/getUsrTviusRqstView.do", _param, function(view){
			$("#contentWrap").html(view);

			$(".contentWrapper").find(".mngSortBtn").each(function(){
				if($(this).attr('id') == sortCol && _param['sortCol'] != "" && _param['sortCol'] != ""){
					if(sortTyp === "asc") $(this).text($(this).text() + "▲");
					if(sortTyp === "desc") $(this).text($(this).text() + "▼");
				}
			});

		});
	}

	function setUserResultBar(){
		$('.result_text').each(function(){
			var result_type = $(this).text();

			if ( result_type == '승인대기' ) $(this).parents('ul').find('li:eq(0) .result_type').css('background', '#ADD8E6');

			if ( result_type == '사전신청' ) $(this).parents('ul').find('li:eq(0) .result_type').css('background', '#ADD8E6');

			if ( result_type == '승인완료' ) {
				$(this).parents('ul').find('li:eq(0) .result_type').css('background', '#b4d2e6');
				$(this).parents('ul').find('li:eq(1) .result_type').css('background', '#84b5d7');
			}

			if ( result_type == '처리중' || result_type == '수정중') {
				$(this).parents('ul').find('li:eq(0) .result_type').css('background', '#b4d2e6');
				$(this).parents('ul').find('li:eq(1) .result_type').css('background', '#84b5d7');
				$(this).parents('ul').find('li:eq(2) .result_type').css('background', '#579ac9');
			}

			if ( result_type == '처리완료' ) {
				$(this).parents('ul').find('li:eq(0) .result_type').css('background', '#b4d2e6');
				$(this).parents('ul').find('li:eq(1) .result_type').css('background', '#84b5d7');
				$(this).parents('ul').find('li:eq(2) .result_type').css('background', '#579ac9');
				$(this).parents('ul').find('li:eq(3) .result_type').css('background', '#4582ac');
			}

			if ( result_type == "승인거절" ) {
				$(this).parents('ul').find('li:eq(0) .result_type').css('background', '');
				$(this).parents('ul').find('li:eq(1) .result_type').css('background', '');
				$(this).parents('ul').find('li:eq(2) .result_type').css('background', '');
				$(this).parents('ul').find('li:eq(3) .result_type').css('background', '');
			}

			if ( result_type == "처리실패" ) {
				$(this).parents('ul').find('li:eq(0) .result_type').css('background', '');
				$(this).parents('ul').find('li:eq(1) .result_type').css('background', '');
				$(this).parents('ul').find('li:eq(2) .result_type').css('background', '');
				$(this).parents('ul').find('li:eq(3) .result_type').css('background', '');
			}
		});
	}

	/*$('#downplayer').click(function(){
		var target = $(this).attr("target");
    	_common.postForm.submit("/user/get"+target+"File.json", null);
	});*/
