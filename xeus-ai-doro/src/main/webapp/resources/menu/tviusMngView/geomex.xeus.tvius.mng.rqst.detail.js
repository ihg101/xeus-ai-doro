/**
 * 관리자 영상반출 상세보기 관련 이벤트 입니다.
 */

	var downInterval;

	$(document).ready(function(){

		//setTooltip('.detailTip', '#data_view');

		setAviList(mgrSeq);

		resizeDone();

	});

	$( window ).on( 'resize', function( ) {
//	    clearTimeout( timer );
//	    timer = setTimeout( resizeDone, delta );
	} );

//	function resizeDone() {
//
//		//$(".popupWrapper").find('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-10);
//		$(".popupWrapper").find('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-$(".popupWrapper").find('#overlay-west-bar').height() - 40);
//
//		$(".popupWrapper").find('#bar_btns').css('width', $(window).width()-$(".popupWrapper").find('#overlay-west-side-bar').width()-$(".popupWrapper").find('#datail_top_bar').find('.searchTitle').width()-65);
//
//	}

	$(".popupWrapper").find("#btn_stat_sa").click(function(){

		var now = new Date();
		var oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

		var oneMonthAgoYesterday = new Date(oneMonthAgo.setDate(oneMonthAgo.getDate() - 1));
		oneMonthAgoYesterday.setHours(23);
		oneMonthAgoYesterday.setMinutes(59);

		var isPass = true;

		$('#avi_list_body').find('.secStDat').each(function(){

		    var secStDat =  new Date($(this).text().trim().substring(0,10));
		    if(secStDat < oneMonthAgoYesterday){
		    	isPass = false;
		    }
		});

		if(!isPass){
			alert("오늘날짜로부터 한달 전보다 과거의 영상은 반출이 불가합니다.");
			return;
		}


		var _param= {};
		_param['mgrSeq'] = mgrSeq;
		if(reqGbnCdNm == '열람'){
			_param['procStatCd'] = 'SK';
			_param['reqGbnCdNm'] = reqGbnCdNm;
		} else {
			_param['procStatCd'] = 'SA';
		}
		_param['acptUserId'] = userId;

		_common.callAjax("/tvius/editProcStatCd.json", _param, function(json) {

			if(json.result){
				alert('* 저장되었습니다.');
				$("#popupWrap").dialog("close");
				callView(offset);
			}

		});

	});

	$(".popupWrapper").find("#btn_stat_sd").click(function(){
//		$(".popupWrapper").find('#rejt_pop').bPopup({appendTo: $(".popupWrapper"), position: [545,250]});
		var $_html = $('<div class="detailPopupWrapper"></div>');
		$_html.append($(".popupWrapper").find("#rejt_pop").html());

		$("#detailPopupWrap").dialog('close').html($_html[0]).dialog({
			title : "승인 거절 사유",
			modal: true,
		    width: 600,
			position: {
				my: "top center",
				at: "top center",
				of: $("#popupWrap")
			},
			open: function(){
				$('.detailPopupWrapper').find("#btn_rejt_ok").click(function(){

					var rejtTyp = $('.detailPopupWrapper').find("#rejtTyp").val();
					var rejtResn = $('.detailPopupWrapper').find("#rejtResn").val();

					if(rejtTyp == ''){
						alert('* 거절유형을 선택하여 주십시오.');
						return false;
					}

					if(rejtResn == ''){
						alert('* 거절사유를 입력하여 주십시오.');
						return false;
					}

					var _param= {};
					_param['mgrSeq'] = mgrSeq;
					_param['procStatCd'] = 'SD';
					_param['rejtTyp'] = rejtTyp;
					_param['rejtResn'] = rejtResn;
					_param['acptUserId'] = userId;
					_common.callAjax("/tvius/editProcStatCd.json", _param, function(json) {

						if(json.result){
							alert('* 저장되었습니다.');
//							$(".popupWrapper").find('#rejt_pop').find("#btn_rejt_cc").click();
							$("#detailPopupWrap").dialog('close');
							$("#popupWrap").dialog('close');
							callView(offset);
						}

					});

				});
			},
			close: function(){

			}
		}).dialog("open");
	});



	$(".popupWrapper").find('#rejt_pop').find("#btn_rejt_cc").click(function(){

		$(".popupWrapper").find('#rejt_pop').bPopup().close();

	});

	$(".popupWrapper").find("#btn_edit").click(function(){

		$(".popupWrapper").find('#edit_pop').bPopup({appendTo: $(".popupWrapper")});

	});

	$(".popupWrapper").find("#edit_pop").find("#btn-upload").click(function(e) {

		$(".popupWrapper").find("#hiddenForm").find("#uploadImg").click();

	});

	/* 상위 "파일 첨부" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
	$(".popupWrapper").find("#hiddenForm").find("#uploadImg").on("change", function(){
		var nm = $(this).val();
		if(nm != ""){
			if(confirm("선택하신 파일을 업로드 하시겠습니까?")){
				_common.formSubmit("/tvius/addDocFile.json", $(".popupWrapper").find("#hiddenForm"), function(json){
		        	if(json.realNm !== undefined && json.uploadNm !== undefined){

		        		$(".popupWrapper").find("#edit_pop").find('#docFileNm').val(json.uploadNm);
		        		$(".popupWrapper").find("#edit_pop").find('#docFilePath').val(json.realNm);

		        	}
		        });
				$(this).val("");
			}

		}
	});

	$(".popupWrapper").find("#edit_pop").find("#btn_save").click(function(){
		var saveChk = true;
		var _param = _common.utils.collectSendData("#edit_pop");
		$.each(_param,function(key,value) {
			if (value == ""){
				if ( $(".popupWrapper").find('#'+key).attr('intype') == "C" ) {
					alert('* '+$(".popupWrapper").find('#lbl_'+key).text() + ' 항목을 선택하여 주십시오.');
					$(".popupWrapper").find('#'+key).focus();
					saveChk = false;
					return false;
				} /*else if (key == "crimeLoc"){

				}*/
				else {
					alert('* '+$(".popupWrapper").find('#lbl_'+key).text() + ' 입력은 필수입니다.');
					$(".popupWrapper").find('#'+key).focus();
					saveChk = false;
					return false;
				}
			}
		});

		if ( saveChk ) {
			_common.callAjax("/tvius/editUrgToUsual.json", _param, function(json) {
				if(json.result){
					alert("수정되었습니다.");
					$(".popupWrapper").find('#edit_pop').bPopup().close();
					$(".contentWrapper").find(('#btn_list_all')).click();
				}
			});

		}

	});

	$(".popupWrapper").find("#btn_cancel").click(function(){

		$(".popupWrapper").find('#edit_pop').bPopup().close();

	});

	/**
	 * 190718 이은규
	 * 해당 반출 건을 삭제합니다.
	 *
	 * public 스키마에 해당 건을 백업합니다.
	 */
	$(".popupWrapper").find("#btn_del").click(function(){
		if(confirm("* 해당 반출 건을 삭제하시겠습니까?")){

			var _rqstParam = {};
			_rqstParam["rqstMgrSeq"] = $(this).attr("mgrSeq");
			_rqstParam['before'] = 'xeus';
			_rqstParam['after'] = 'public';

			_common.callAjax("/tvius/changeRqst.json", _rqstParam, function(json) {
				if(json.result){
					alert('삭제작업이 완료되었습니다.');
					$("#popupWrap").dialog("close");
					callView(offset);
				} else {
					alert('작업 도중 오류가 발생하였습니다.');
				}
			});

		}

	});



	$(".popupWrapper").find("#btn_list").click(function(){
		clearTimeout(intervalListChk);

		var _param= {};
		/*_param['limit'] = 200;
		_param['offset'] = listOffset;
		_param['year'] = listYear;*/
		_param['sessionParam'] = "Y";
		_common.callAjax("/tvius/getMngTviusRqstView.do", _param, function(view) {
			if(intervalListChk != null) clearTimeout(intervalListChk);
			$(".popupWrapper").find("#overlay-west-contents").html(view);
			xeusLayout.WEST = $(".popupWrapper").find('.map-target').width();
			xeusLayout.showOverlayWestPane(250, function() {
				$(".popupWrapper").find('#'+parentView).find("#center-overlay-west").attr('xeus-full-size', 'true');
			});
			$('#west-slide-btn').hide();
		});

	});

	$(".popupWrapper").find(".doc_down").click(function(){

		var realNm = $(this).attr('realnm').split("/");
		var downNm = $(this).attr('downnm');

		_common.callAjax("/sysMng/getSysParam.json", null, function(json) {

			if(json.result !== undefined){

				var _param = {};
				_param['sub'] = realNm[0];
				_param['path'] = json.result[0]['sys.upload_path'];
				_param['fileNm'] = realNm[1];
				_param['downFileNm'] = downNm;
				_param['auth'] = "A";
				_common.postForm.submit("/tvius/getFiles.json", _param);

			}

		},false);

	});

	$(".popupWrapper").find(".securityDoc").click(function(){
		var k = $(this).attr("k");
		var u = $(this).attr("u");

		if(k != null && k != "" && u != null && u != ""){
			_common.postForm.submit("/user/getFile.json", { "oathFileNm" : k , "userId" : u });
		}
	});




	//////////////



	$(".popupWrapper").find("#btn_edit_doc").click(function(e) {

		$(".popupWrapper").find("#hiddenDocForm").find("#uploadImg").click();

	});

	/* 상위 "파일 첨부" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
	$(".popupWrapper").find("#hiddenDocForm").find("#uploadImg").on("change", function(){
		var nm = $(this).val();
		if(nm != ""){

			var tmpFileNm = $(".popupWrapper").find(".doc_down").attr("realnm").replace("/", "\\");

			//공문업로드
			if(confirm("선택하신 파일을 업로드 하시겠습니까?")){
				_common.formSubmit("/tvius/addDocFile.json", $(".popupWrapper").find("#hiddenDocForm"), function(json){
		        	if(json.realNm !== undefined && json.uploadNm !== undefined){
		        		//임시공문삭제
		    			//공문정보업데이트
		        		var docFileNm = json.uploadNm;
		        		var docFilePath = json.realNm;

		        		var _editParam = {};
		        		_editParam['mgrSeq'] = mgrSeq;
		        		_editParam['docFileNm'] = docFileNm;
		        		_editParam['docFilePath'] = docFilePath;
		        		_editParam['tmpFileNm'] = tmpFileNm;

		        		_common.callAjax("/tvius/editDocFileInfo.json", _editParam, function(json) {
		        			if(json.result){
		        				alert('공문 정보 변경이 완료되었습니다.');
		        				//공문 파일 다운로드 로직 교체
		        				$(".popupWrapper").find(".doc_down").attr("downnm", docFileNm);
		        				$(".popupWrapper").find(".doc_down").attr("realnm", "rqst/"+docFilePath);
		        				$(".popupWrapper").find(".doc_down").text(docFileNm);
		        			}else{
		        				alert(json.msg);
		        			}
		        		});
		        	}
		        });
				$(this).val("");
			}

		}
	});
	/**
	 * 영상정보신청 상세보기 > 공문번호변경 클릭
	 */
	$(".popupWrapper").find("#btn_doc_no_chng").click(function(e) {

//		$(".popupWrapper").find("#docNoChngPop").bPopup({
//	        appendTo: $(".popupWrapper")
//	    });
		var _html ='';
		_html += '<div class="detailPopupWrapper">'
		_html += '	<div id="docNoChngPop">'
		_html += '		<div id="bpop_wrap" class="table_style">'
		_html += '			<table>'
		_html += '				<tr>'
		_html += '					<th class="top">공문번호</th>'
		_html += '					<td>'
		_html += '						<input class="sendData" id="chgDocNo"></input>'
		_html += '					</td>'
		_html += '				</tr>'
		_html += '			</table>'
		_html += '			<table>'
		_html += '				<tr align="center">'
		_html += '					<td class="lastTd" colspan="2" style="border: 0 !important;">'
		_html += '						<button id="docNoSaveBtn" class="btn_style">저장</button>'
//		_html += '						<button id="docNoCloseBtn" class="btn_Dstyle2">취소</button>'
		_html += '					</td>'
		_html += '				</tr>'
		_html += '			</table>'
		_html += '		</div>'
		_html += '	</div>'
		_html += '</div>'

		$("#detailPopupWrap").dialog("close").html(_html).dialog({
			title: '공문번호 수정',
			width: 400,
			height: 'auto',
			position: {
				my: "center center",
				at: "center center",
				of: $("#popupWrap")
			},
			modal: true,
			open: function(){

				var txt=$(".popupWrapper").find("#viewDocNo").text();
				$(".detailPopupWrapper").find("#chgDocNo").val(txt);

				$(".detailPopupWrapper").find("#docNoSaveBtn").click(function(e) {
					var docNo = $(".detailPopupWrapper").find("#docNoChngPop").find("#chgDocNo").val();

					_common.callAjax("/tvius/editDocNo.json", {'mgrSeq': mgrSeq, 'docNo': docNo}, function(json) {
						if(json.result){
							alert('수정되었습니다.');
							$("#detailPopupWrap").dialog("close");
//							$(".detailPopupWrapper").find("#edit_pop").find("#docNo").val(docNo);
							$(".popupWrapper").find("#viewDocNo").text(docNo);
						}else{
							alert('공문번호 수정에 실패하였습니다.');
						}
					});
				});
			},
			close: function(){

			}
		}).dialog("open");


	});

	/**
	 * 영상정보신청 상세보기 > 신청내용변경 클릭
	 */
	$(".popupWrapper").find("#btn_reqst_detail_chng").click(function(e) {

//		$(".popupWrapper").find("#reqstDetailPop").bPopup({
//	        appendTo: $(".popupWrapper")
//	    });
		var _html = ''
		_html += '<div class="detailPopupWrapper">'
		_html += '	<div id="reqstDetailPop" class="detailPopupWrapper">'
		_html += '		<div id="bpop_wrap" class="table_style">'
//		_html += '			<h3 id="bpop_title" class="title">신청내용 수정</h3>'
		_html += '			<table style="table-layout: auto;">'
		_html += '				<tr>'
		_html += '					<th class="top">신청내용</th>'
		_html += '					<td>'
		_html += '						<textarea class="sendData" id="chgReqstDetail"></textarea>'
		_html += '					</td>'
		_html += '				</tr>'
		_html += '			</table>'
		_html += '			<table>'
		_html += '				<tr align="center">'
		_html += '					<td class="lastTd" colspan="2" style="border: 0 !important;">'
		_html += '						<button id="reqstDetailSaveBtn" class="btn_style">저장</button>'
//		_html += '						<button id="reqstDetailCloseBtn" class="btn_Dstyle2">취소</button>'
		_html += '					</td>'
		_html += '				</tr>'
		_html += '			</table>'
		_html += '		</div>'
		_html += '	</div>'
		_html += '</div>'


		$("#detailPopupWrap").dialog("close").html(_html).dialog({
			title: '신청내용 수정',
			width: 400,
			height: 'auto',
			position: {
				my: "center center",
				at: "center center",
				of: $("#popupWrap")
			},
			modal: true,
			open: function(){
				var txt=$(".popupWrapper").find("#viewReqstDetail").text();
				$(".detailPopupWrapper").find("#chgReqstDetail").text(txt);

				$(".detailPopupWrapper").find("#reqstDetailSaveBtn").click(function(e) {
					var reqstDetail = $(".detailPopupWrapper").find("#reqstDetailPop").find("#chgReqstDetail").val();

					_common.callAjax("/tvius/editReqstDetail.json", {'mgrSeq': mgrSeq, 'reqstDetail': reqstDetail}, function(json) {
						if(json.result){
							alert('수정되었습니다.');
							$("#detailPopupWrap").dialog("close");
//							$(".popupWrapper").find("#edit_pop").find("#reqstDetail").val(reqstDetail);
							$(".popupWrapper").find("#viewReqstDetail").text(reqstDetail);
							$(".popupWrapper").find("#viewReqstDetail").attr("title", reqstDetail);
						}else{
							alert('신청내용 수정에 실패하였습니다.');
						}
					});
				});

			},
			close: function(){

			}
		}).dialog("open");

	});



	$(".popupWrapper").find("#btn_doc_chng").click(function(e) {
		if(confirm("최종공문확인을 완료하시겠습니까?")){
    		_common.callAjax("/tvius/editDocChngYn.json", {'mgrSeq': mgrSeq}, function(json) {
    			if(json.result){
    				alert('정보 변경이 완료되었습니다.');
    				$(".popupWrapper").find("#docChngYn").css("color", "blue");
    				$(".popupWrapper").find("#docChngYn").text("O");
    				$(".popupWrapper").find("#btn_reqst_detail_chng").remove();
    				$(".popupWrapper").find("#btn_doc_no_chng").remove();
//    				$(".popupWrapper").find("#btn_edit_doc").remove();
                    $(".popupWrapper").find("#btn_doc_chng").remove();
                    $(this).val("");
    			}else{
    				alert('정보 변경에 실패하였습니다.');
    			}
    		});

		}

	});
	/**
	 * 일괄 다운로드 클릭 시
	 */
	$(".popupWrapper").find("#btn_all_avi_download").click(function(){
		var cnt=0;
		clearInterval(downInterval);

		if(confirm("일괄 다운로드를 받으시겠습니까?")){
			var isPossible = false;
			$('.avi_down').each(function(){
				if($(this).text() != ""){
					isPossible = true;
				}
			})

			if(isPossible){
				downInterval = setInterval(clickAviFile, 2000);
			}
			else{
				alert('다운받을 파일이 없습니다.');
			}
		}


		function clickAviFile(){
			try{
				 $($('.avi_down')[cnt]).click();
				cnt++;

				if($('.avi_down').length == cnt){
					setTimeout(function(){
						alert("다운로드 목록에 모두 들어갔습니다. 잠시 기다려주십시오.");
						clearInterval(downInterval);
					},1000)
				}
			}catch(e){
				clearInterval(downInterval);
			}
		}

	});

	/**
	 * 해시 다운로드 클릭 시
	 */
	$(".popupWrapper").find("#btn_hash_download").click(function(){

		var txt = '해시값';
		var $table = $("<table>");
		var $colgroup = $("<colgroup>");
		$colgroup.append('<col width="400"><col width="400"><col width="1000">');

		var $thead = $("<thead>");
		$thead.append('<tr><th>파일목록</th><th>md5 해시값</th><th>sha 해시값</th></tr>');
		var $tbody = $("<tbody>");

		$("#avi_list_body").find("tr").each(function(){
			var md5hashValue = $(this).find(".md5HashValue").text().trim();
			var shaHashValue = $(this).find(".shaHashValue").text().trim();
			var fileNm = $(this).find(".fileNm").text().trim();

			$tbody.append('<tr><td>'+fileNm+'</td><td>'+md5hashValue+'</td><td>'+shaHashValue+'</td></tr>');
		});

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

	/**
	 * 반출 영상 리스트를 화면에 표시합니다.
	 */
	function setAviList(mgrSeq) {
		if ( mgrSeq > 200000000000){

			var _aviParam = {};
			_aviParam['rqstMgrSeq'] = mgrSeq;
			_aviParam['reqGbn'] = reqGbnCdNm;
			_common.callAjax("/tvius/getMngTviusAviList.do", _aviParam, function(view) {

				$(".popupWrapper").find("#cctvList").html(view);

			});
		}
	}



