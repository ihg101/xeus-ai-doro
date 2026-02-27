/**
 * 관리자 영상반출 신청현황 페이지 관련 이벤트 입니다.
 */

	var currYear = null;

	$(document).ready(function(){
		//190718 이은규
		//테스트내역 삭제 용 체크박스 로우를 숨긴다.
		$(".contentWrapper").find("#rqstTable").find('col:nth-child(1),td:nth-child(1),th:nth-child(1)').hide();
		if (chkParam != ""){
			$(".contentWrapper").find('#btn_list_all').show();
			if (chkParam != "sch"){
				$(".contentWrapper").find('#btn_list_stat_sw').hide();
				$(".contentWrapper").find('#btn_list_use_rst_non').hide();
			}
		} else {
			$(".contentWrapper").find('#btn_list_all').hide();
		}


		var limit =$(".contentWrapper").find('#limit').val().trim();
		if(limit == undefined || limit == null || limit =="" || limit ==0){
			limit = 100;
		}
		if ($('#max').val() == '0') $(".contentWrapper").find('#btn_list_all').show();

		$(".contentWrapper").find(".paging_wrap").paging({
			current	  : Number(limit),
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});

		var currDat = new Date();
		currYear = currDat.getFullYear();


		setUserResultBar();

		setParam();

		resizeDone();

		if(scrollHeight != undefined && scrollHeight != null && scrollHeight != ""){
			$('#contentWrap').scrollTop(scrollHeight);
		}

	});

	$(window).resize(function(){

		/*clearTimeout( timer );
	    timer = setTimeout( resizeDone, delta );*/
	});

	function resizeDone() {

		//$(".contentWrapper").find('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-10);
		$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height() - 40);

	}

	$(".contentWrapper").find("#btn_list_all").click(function(){

		var _param = {};
		_param['limit'] = '200';
		_param['offset'] = '0';
		_param['year'] = currYear;
		//_param['offset'] = '0';

		callView(0, _param, 'all');

	});

	$(".contentWrapper").find("#btn_list_stat_sw").click(function(){

		var _param = {};
		_param['procStatCd'] = 'SW';
		_param['limit'] = '200';
		_param['offset'] = '0';
		_param['year'] = currYear;
		//_param['offset'] = '0';

		callView(0, _param);

	});

	$(".contentWrapper").find("#btn_list_use_rst_non").click(function(){

		var _param = {};
		_param['useRsCd'] = '11';
		_param['procStatCd'] = 'SK';
		_param['limit'] = '200';
		_param['offset'] = '0';
		_param['year'] = currYear;
		//_param['offset'] = '0';

		callView(0, _param);

	});

	/* 181221 장대건
	 * 영상정보신청현황 승인대기, 활용결과 미등록 건 클릭 시 조회목록으로 이동.
	 */
	function callListStat() {

		var _param = {};
//		_param['reqstId'] = userId;
		_param['procStatCd'] = 'SW';
		_param['limit'] = '200';
		_param['sortCol'] = "";
		_param['sortTyp'] = "";

		callView(0, _param);
	}

	function callListUse(e) {

		var _param = {};
//		_param['reqstId'] = userId;
		_param['useRsCdNullChk'] = 'Y';
		_param['useRsCd'] = '11';
		_param['procStatCd'] = 'SK';
		_param['limit'] = '200';
		_param['sortCol'] = "";
		_param['sortTyp'] = "";

		callView(0, _param);
	}

	$(".contentWrapper").find("#btn_sch").click(function(){
		var user = $(".contentWrapper").find('#userKw').val().trim();
		var searchTyp = $(".contentWrapper").find('#userKwTyp').val().trim();
		var reqGbnCd = $(".contentWrapper").find('#reqGbnCd').val().trim();
		var crimeTyp = $(".contentWrapper").find('#crimeTyp').val().trim();
		var startDat = $(".contentWrapper").find('#startDat').val().trim().replace(/\-/g,'');
		var endDat = $(".contentWrapper").find('#endDat').val().trim().replace(/\-/g,'');
		var limit =$(".contentWrapper").find('#limit').val().trim();
		var procStatCd = $(".contentWrapper").find('#procStatCd').val().trim();

		var _param = {};

		_param['limit'] = limit;
		_param['offset'] = '0';
//		_param['year'] = currYear;
		_param['sch'] = 'Y';

		if (user != ''){

			if(searchTyp == 'nm') _param['userNm'] = user;
			else if(searchTyp == 'id') _param['reqstId'] = user;
		}

		if ( reqGbnCd != '') _param['reqGbnCd'] = reqGbnCd;
		if ( crimeTyp != '') _param['crimeTyp'] = crimeTyp;
		if ( startDat != '') _param['startDat'] = startDat + '000000';
		if ( endDat != '') _param['endDat'] = endDat + '235959';
		if ( procStatCd != '') _param['procStatCd'] = procStatCd;

		//TODO 서초에만 해당
		if(_param['procStatCd'] == 'SW'){

			_param['procStatCdOrRenew'] = 'SW';
		}
		_common.callAjax("/tvius/getMngTviusRqstView.do", _param, function(view) {
			$("#contentWrap").dialog("close").html(view).dialog("open");
		});
	});

	$(".contentWrapper").find(".btn_dtv").click(function(){
		//alert($(this).attr('mgrseq'));
		var mgrSeq = Number($(this).attr('mgrseq'));
		var reqGbnCd = Number($(this).attr('reqGbnCd'));
		var offset = $(".contentWrapper").find('#offset').val();
		var limit = 10;// 일단은 10, 나중에 리스트 한번에 몇개씩 보여줄지 정할때는 그 값을 넣어줘야 함.
		var year = $(".contentWrapper").find('#year').val();
		var stat = $(this).attr("stat");

		var _param = {};
		_param['mgrSeq'] = mgrSeq;
		_param['listOffset'] = offset;
		_param['listLimit'] = limit;
		_param['listYear'] = year;


		if(reqGbnCd == 16){

			_param['stat'] = stat;

			_common.callAjax("/tvius/getMngTviusImageDetailView.do", _param, function(view){

				$("#popupWrap").dialog("close").html(view).dialog({
					title : "이미지 반출 신청 상세보기",
					modal: true,
				    width: 1200,
					height: 700,
					position: {
						my: "center center",
						at: "center center",
						of: $("#map")
					},
					open: function(){

					},
					close: function(){

						clearTimeout(intervalListChk);

						var scrollHeight = $('#contentWrap').scrollTop();

						callView(offset, undefined, scrollHeight);
					}
				}).dialog("open");
		    });
		}
		else{
			_common.callAjax("/tvius/getMngTviusRqstDetailView.do", _param, function(view){
//				$(".contentWrapper").find(".bpopup").remove();
//				$(".contentWrapper").find("#overlay-west-contents").html(view);

				$("#popupWrap").dialog("close").html(view).dialog({
					title : '영상정보신청 상세보기',
				    width: 1500,
					height: 700,
					modal : true,
					position: {
						my: "center center",
						at: "center center",
						/*my: "left top",
						at: "left top",*/
						of: $("#map")
					},
					open: function(){
					},
					close: function(){

						clearTimeout(intervalListChk);

						var scrollHeight = $('#contentWrap').scrollTop();

						//상세보기 닫을 때마다 새로고침
						callView(offset, undefined, scrollHeight);

//						}
					}
				}).dialog("open");

			});
		}



	});

	/**
	 * 반출내역관리 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#del_chk_btn").click(function(){
		var _self = $(this);

		var chkActive = _self.attr("active");
		if(chkActive == "active"){
			_self.text('반출내역관리');
			_self.removeAttr("active");
			$(".contentWrapper").find("#rqstTable").find('col:nth-child(1),td:nth-child(1),th:nth-child(1)').hide();
			$(".contentWrapper").find("#rqstTable").find('.delChk').prop('checked', false);
			$(".contentWrapper").find("#del_rqst_btn").hide();
			$(".contentWrapper").find("#restore_rqst_btn").hide();
		}else{
			_self.text('반출관리종료');
			_self.attr("active", "active");
			$(".contentWrapper").find("#rqstTable").find('col:nth-child(1),td:nth-child(1),th:nth-child(1)').show();
			$(".contentWrapper").find("#del_rqst_btn").show();
			$(".contentWrapper").find("#restore_rqst_btn").show();
		}
	});

	$(".contentWrapper").find("#selectAll").click(function(){
		if($('.delChk:checked').length > 0){
			$('.delChk').prop("checked", false);
		}else{
			$('.delChk').prop("checked", true);
		}
	});

	/**
	 * 반출내역삭제 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#del_rqst_btn").click(function(){
		if(confirm("* 선택 항목을 삭제하시겠습니까?")){
			var arr = [];
			$('.delChk').each(function(){
				if($(this).is(":checked")) arr.push($(this).val());
			});

			if(arr.length == 0){
				alert('삭제 항목을 선택하여 주십시오.');
				return false;
			}

			var _rqstParam = {};
			_rqstParam["rqstMgrSeq"] = arr.join(',');
			_rqstParam['before'] = 'xeus';
			_rqstParam['after'] = 'public';

			_common.callAjax("/tvius/changeRqst.json", _rqstParam, function(json) {
				if(json.result){
					alert('삭제작업이 완료되었습니다.');
					/*$(".contentWrapper").find("#del_chk_btn").text('반출내역관리');
					$(".contentWrapper").find("#del_chk_btn").removeAttr("active");
					$(".contentWrapper").find("#rqstTable").find('col:nth-child(1),td:nth-child(1),th:nth-child(1)').hide();
					$(".contentWrapper").find("#rqstTable").find('.delChk').prop('checked', false);
					$(".contentWrapper").find("#del_rqst_btn").hide();*/

					var _param = {};
					_param['limit'] = '200';
					_param['offset'] = '0';
					_param['year'] = currYear;

					callView(0, _param, 'all');
				} else {
					alert('작업 도중 오류가 발생하였습니다.');
				}
			});

		}
	});

	/**
	 * 삭제내역복원 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#restore_rqst_btn").click(function(){

		//onClose이벤트에서 지워지지 않았을 경우를 대비하여 삭제 구분 추가
		$(".contentWrapper").find('#restore_pop').remove();

		var _html = '';
	    _html = '<div class="popupWrapper">';
		_html +='<div id="restore_pop" class="bpopup">';
		_html +='	<div style="margin-left: 10px;">';
//		_html +='		<p class="searchTitle">삭제내역 복원</p>';//<!-- style="width: 450px;" -->
		_html +='		<div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div>';
		_html +='		<div>';
		_html +='			<table cellspacing="0" width="100%" style="margin-top:0; border-top:0; table-layout: fixed;">';
		_html +='				<colgroup>';
		_html +='					<col width="40px" />';
		_html +='					<col width="80px" />';
		_html +='					<col width="70px" />';
		_html +='					<col width="70px" />';
		_html +='					<col width="70px" />';
		_html +='					<col width="150px" />';
		_html +='					<col width="70px" />';
		_html +='				</colgroup>';
		_html +='				<thead>';
		_html +='					<tr>';
		_html +='						<th><label>선택</label></th>';
		_html +='						<th><label>신청번호</label></th>';
		_html +='						<th><label>신청자ID</label></th>';
		_html +='						<th><label>신청유형</label></th>';
		_html +='						<th><label>신청일</label></th>';
		_html +='						<th><label>CCTV목록</label></th>';
		_html +='						<th><label>처리상태</label></th>';
		_html +='					</tr>';
		_html +='				</thead>';
		_html +='			</table>';
		_html +='		</div>';
		_html +='		<div style="overflow: auto;" class="customScroll" data-mcs-theme="minimal-dark">';
		_html +='			<table cellspacing="0" width="100%" style="margin-top:0; border-top:0; table-layout: fixed;">';
		_html +='				<colgroup>';
		_html +='					<col width="40px" />';
		_html +='					<col width="80px" />';
		_html +='					<col width="70px" />';
		_html +='					<col width="70px" />';
		_html +='					<col width="70px" />';
		_html +='					<col width="150px"/>';
		_html +='					<col width="70px" />';
		_html +='				</colgroup>';
		_html +='				<tbody>';
		_html +='				</tbody>';
		_html +='			</table>';
		_html +='		</div>';
		/*_html +='		<div style="margin-top:5px;">';
		_html +='			<div>* 거절 사유는 <b style="color:red;">최대 200글자 입니다.</b></div>';
		_html +='		</div>';*/
		_html +='		<div class="btnDiv">';//<!-- style="text-align: center; padding: 5px 0 ;" -->
		_html +='			<button id="btn_restore" class="btn_style"> 복 원 </button>';
//		_html +='			<button id="btn_cancel" class="btn_style2"> 취 소 </button>';
		_html +='		</div>';
		_html +='	</div>';
		_html +='</div>';
		_html +='</div>';


		$("#popupWrap").dialog("close").html(_html).dialog({
			title : '삭제내역 복원',
		    width: 1500,
			height: $("#map").height()-100,
			modal : true,
			position: {
				my: "left top",
				at: "left top",
				of: $("#map")
			},
			open: function(){

				$(".popupWrapper").find('#restore_pop').find('#btn_restore').click(function(){
					if(confirm("* 선택 항목을 복원하시겠습니까?")){

						var arr = [];
						$('.restoreChk').each(function(){
							if($(this).is(":checked")) arr.push($(this).val());
						});

						if(arr.length == 0){
							alert('복원 항목을 선택하여 주십시오.');
							return false;
						}

						var _rqstParam = {};
						_rqstParam["rqstMgrSeq"] = arr.join(',');
						_rqstParam['before'] = 'public';
						_rqstParam['after'] = 'xeus';

						_common.callAjax("/tvius/changeRqst.json", _rqstParam, function(json) {
							if(json.result){
								alert('복원작업이 완료되었습니다.');

								$("#popupWrap").dialog("close");

								var _param = {};
								_param['limit'] = '200';
								_param['offset'] = '0';
								_param['year'] = currYear;

								callView(0, _param, 'all');
							} else {
								alert('작업 도중 오류가 발생하였습니다.');
							}
						});

					}
				});

				/**
				 * 복원 팝업의 취소 버튼 이벤트입니다.
				 */
				$(".popupWrapper").find('#restore_pop').find('#btn_cancel').click(function(){
					$("#popupWrap").dialog("close")
				});

				/**
				 * 생성된 팝업에 데이터를 입력한다.
				 */
				$(".popupWrapper").find('#restore_pop').find('tbody').empty('');
				_common.callAjax("/tvius/getTransRqstBackup.json", null, function(json) {
				    if(json.result.length > 0){

				    	for(var i=0; i<json.result.length; i++){
				    		var $tr = $('<tr></tr>');
				    		$tr.append('<td style="text-align: center;"><input type="checkbox" class="restoreChk" style="width: 15px; height: 15px;" value="'+json.result[i].mgrSeq+'"/></td>');
				    		$tr.append('<td style="text-align: center;">'+json.result[i].mgrSeq+'</td>');
				    		$tr.append('<td style="text-align: center;">'+json.result[i].reqstId+'</td>');
				    		$tr.append('<td style="text-align: center;">'+json.result[i].reqGbnCdRelCdeNm+'</td>');
				    		$tr.append('<td style="text-align: center;">'+new Date().formatYMDHMS(json.result[i].reqstDat.substring(0,8))+'</td>');
				    		$tr.append('<td style="text-align: center;"><div class="text-overflow" style="width: 150px;" title="'+json.result[i].cctvList+'">'+json.result[i].cctvList+'</div></td>');
				    		$tr.append('<td style="text-align: center;">'+json.result[i].procStatCdRelCdeNm+'</td>');

				    		$(".popupWrapper").find('#restore_pop').find('tbody').append($tr);
				    	}
				    }else{
				    	var $tr = $('<tr></tr>');
				    	$tr.append('<td colspan="7">삭제 내역이 존재하지 않습니다.</td>');
				    	$tr.find('td').css({
			    			"text-align": "center",
			    			"height": "255px",
			    			"font-size": "15px !important"
			    		});
				    	$(".popupWrapper").find('#restore_pop').find('tbody').append($tr);
				    }
				});


			},
			close: function(){
				$(".popupWrapper").find('#restore_pop').remove();

			}
		}).dialog("open");

//		$(".contentWrapper").append(_html);

//		$(".contentWrapper").find('#restore_pop').bPopup({
//			appendTo: $(".contentWrapper"),
//			onOpen: function(){
//				/**
//				 * 복원 팝업의 복원버튼 클릭 이벤트입니다.
//				 */
//
//			},
//			onClose: function(){
//			}
//		});
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
				//_xlsParam['sch'] = 'Y';
				_xlsParam['typ'] = 'rqst';

				if (chkParam == "stat"){
					_xlsParam['procStatCd'] = 'SW';
				} else if (chkParam == "useRst"){
					_xlsParam['procStatCd'] = 'SK';
					_xlsParam['useRsCd'] = '11';
				} else {
					if ( reqstUserNm != '')	_xlsParam['userNm'] = reqstUserNm;
					if ( reqstId != '')		_xlsParam['reqstId'] = reqstId;
					if ( reqGbnCd != '')	_xlsParam['reqGbnCd'] = reqGbnCd;
					if ( crimeTyp != '')	_xlsParam['crimeTyp'] = crimeTyp;
					if ( startDat != '')	_xlsParam['startDat'] = startDat;
					if ( endDat != '')		_xlsParam['endDat'] = endDat;
				}

				_xlsParam['sortCol'] = 'rqst.acpt_dat';
				_xlsParam['sortTyp'] = 'asc';
				_common.postForm.submit("/tvius/getExcel.do", _xlsParam);
			}

		}
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

	function callView(offset,_param, scrollHeight){
		var limit =$(".contentWrapper").find('#limit').val().trim();
		if(offset == null) offset = 0;
		if(_param === undefined){
			_param = {};
			_param['limit'] = limit;



			if(chkParam == "useRst"){
				_param['useRsCd'] = '11';
				_param['procStatCd'] = 'SK';
			}else if(chkParam == "stat"){
				_param['procStatCd'] = 'SW';
			} else {
				if ( reqstUserNm != '')	_param['procStatCd'] = procStatCd;
				if ( reqstUserNm != '')	_param['userNm'] = reqstUserNm;
				if ( procStatCd != '')	_param['procStatCd'] = procStatCd;
				if ( reqstId != '')		_param['reqstId'] = reqstId;

				//상세보기를 클릭하면 reqstId가 ''가 되는 현상 방지
				if ( reqstId == '' || reqstId == undefined || reqstId == null) {
					if ( requestId != '')
					_param['reqstId'] = requestId;
				}
				if ( reqGbnCd != '')	_param['reqGbnCd'] = reqGbnCd;
				if ( crimeTyp != '')	_param['crimeTyp'] = crimeTyp;
				if ( startDat != '')	_param['startDat'] = startDat;
				if ( endDat != '')		_param['endDat'] = endDat;
				if ( chkParam != '')	_param['sch'] = 'Y';

			}


		}
		_param['limit'] = limit;
		_param['offset'] = offset;


		if(sortCol != undefined && sortTyp != undefined){
			if(_param['sortCol'] != "" && _param['sortTyp'] != ""){
				_param['sortCol'] = sortCol;
				_param['sortTyp'] = sortTyp;
			}
		}


		if(scrollHeight != undefined && scrollHeight != null){
			_param["scrollHeight"] = scrollHeight;
		}

		//TODO 서초에만 해당
		if(_param['procStatCd'] == 'SW'){

			_param['procStatCdOrRenew'] = 'SW';
		}


		_common.callAjax("/tvius/getMngTviusRqstView.do", _param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog("open");

			$(".contentWrapper").find(".mngSortBtn").each(function(){
				if($(this).attr('id') == sortCol && _param['sortCol'] != ""){
					if(sortTyp === "asc") $(this).text($(this).text() + "▲");
					if(sortTyp === "desc") $(this).text($(this).text() + "▼");
				}
			});

			//승인대기 클릭 시
			if(_param['procStatCd'] == 'SW'){
				$(".cctvLookup").removeClass("active");
				$("#callListStat").addClass("active");
			}
			//활용결과미등록 클릭 시
			if(_param['useRsCdNullChk'] == 'Y' && _param['useRsCd'] == '11' && _param['procStatCd'] == 'SK'){
				$(".cctvLookup").removeClass("active");
				$("#callListUse").addClass("active");
			}

		});
	}

	function setUserResultBar(){
		$(".contentWrapper").find('.result_text').each(function(){
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



