/**
 * 관리자 영상반출 신청현황 페이지 관련 이벤트 입니다.
 */


	$(document).ready(function(){

		if (chkParam != ""){
			$(".contentWrapper").find('#btn_list_all').show();
		} else {
			$(".contentWrapper").find('#btn_list_all').hide();
		}

		if ($(".contentWrapper").find('#max').val() == '0') $(".contentWrapper").find('#btn_list_all').show();

		$(".contentWrapper").find(".paging_wrap").paging({
			current	  : 10,
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});

		//setTooltip('.resnTip', '.searchWrapper');

		setDatePicker();

		setParam();

//		setPopDiv();
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
		_param['renewTyp'] = renewTyp;
		//_param['offset'] = '0';

		callView(0, _param, 'all');

	});

	$(".contentWrapper").find("#btn_sch").click(function(){
		var user = $(".contentWrapper").find('#userKw').val().trim();
		var searchTyp = $(".contentWrapper").find('#userKwTyp').val().trim();
		var crimeTyp = $(".contentWrapper").find('#crimeTyp').val().trim();
		var startDat = $(".contentWrapper").find('#startDat').val().trim().replace(/\-/g,'');
		var endDat = $(".contentWrapper").find('#endDat').val().trim().replace(/\-/g,'');

		var _param = {};

		_param['limit'] = '10';
		_param['offset'] = '0';
		_param['sch'] = 'Y';
		_param['renewTyp'] = renewTyp;

		if (user != ''){

			if(searchTyp == 'nm') _param['userNm'] = user;
			else if(searchTyp == 'id') _param['reqstId'] = user;
		}

		if ( crimeTyp != '') _param['crimeTyp'] = crimeTyp;
		if ( startDat != '') _param['startDat'] = startDat + '000000';
		if ( endDat != '') _param['endDat'] = endDat + '235959';

		_common.callAjax("/tvius/getMngTviusRenewView.do", _param, function(view) {
//			$(".contentWrapper").find("#overlay-west-contents").html(view);
			$("#contentWrap").dialog("close").html(view).dialog("open");

		});

	});

	/**
	 * 엑셀 다운로드 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#xls_down_btn").click(function(){
		confirm("* 검색결과를 엑셀로 다운로드 하시겠습니까?", function(){

			var max = $(".contentWrapper").find('#max').val();
			if ( max == "0"){
				alert("검색결과가 존재하지 않습니다.");
			} else{


				var _xlsParam = {};
				_xlsParam['limit'] = max;
				_xlsParam['offset'] = '0';
				_xlsParam['renewTyp'] = renewTyp;
				_xlsParam['typ'] = 'renew';

				if ( reqstUserNm != '')	_xlsParam['userNm'] = reqstUserNm;
				if ( reqstId != '')		_xlsParam['reqstId'] = reqstId;
				if ( crimeTyp != '')	_xlsParam['crimeTyp'] = crimeTyp;
				if ( startDat != '')	_xlsParam['startDat'] = startDat;
				if ( endDat != '')		_xlsParam['endDat'] = endDat;


				_common.postForm.submit("/tvius/getExcel.do", _xlsParam);
			}

		});
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
		}
		_param['offset'] = offset;
		_param['renewTyp'] = renewTyp;

		if(arguments[2] !== null && arguments[2] !== "" && arguments[2] !== undefined){

		} else {

			if ( reqstUserNm != '')	_param['userNm'] = reqstUserNm;
			if ( reqstId != '')		_param['reqstId'] = reqstId;
			if ( crimeTyp != '')	_param['crimeTyp'] = crimeTyp;
			if ( startDat != '')	_param['startDat'] = startDat;
			if ( endDat != '')		_param['endDat'] = endDat;
			if ( chkParam != '') 	_param['sch'] = 'Y';

		}

		_common.callAjax("/tvius/getMngTviusRenewView.do", _param, function(view){
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
		if ( crimeTyp != '') $(".contentWrapper").find('#crimeTyp').val(crimeTyp).prop("selected", true);
		if ( startDat != '') $(".contentWrapper").find('#startDat').val(startDat);
		if ( endDat != '') $(".contentWrapper").find('#endDat').val(endDat);

	}

	/**
	 * DatePicker를 설정한다.
	 */
	function setDatePicker(){

		$(".contentWrapper").find(".datePicker").datepicker("destroy").datepicker({
			changeMonth: true,
		    changeYear: true,
		    dateFormat: "yy-mm-dd",
		    showButtonPanel: true,
		    beforeShowDay: $.datepicker.noBefore
		});

		$(".contentWrapper").find(".datePicker").inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});

	}

	function setPopDiv(){

		$(".contentWrapper").find('#acpt_pop').remove();
		$(".contentWrapper").find('#rejt_pop').remove();

		var str = '';

		str += '	<div id="acpt_pop"> ';
		str += '		<div class="contentWrapper">';
		if ( renewTyp == "11"){
		str += '        <p class="searchTitle">연장신청 승인</p> ';
		} else {
		str += '        <p class="searchTitle">증거자료신청 승인</p> ';
		}
		str += '		<div>';
		str += '			<input type="hidden" class="sendData" id="mgrSeqAcpt" name="mgrSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="aviMgrSeq" name="aviMgrSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="fileSeq" name="fileSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="aviPlayLimitDat" name="aviPlayLimitDat" value="">';
		str += '		</div>';
		//str += '        <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> ';
		str += '        <table cellspacing="0" width="100%"> ';
//		str += '            <colgroup> ';
//		str += '                <col width="80" /> ';
//		str += '	            <col width="80" /> ';
//		str += '	            <col width="80" /> ';
//		str += '	            <col width="80" /> ';
//		str += '            </colgroup> ';
		str += '            <tr> ';
		str += '                <th> ';
		str += '                    <label>만료추가</label> ';
		str += '                </th> ';
		str += '                <td class="tCenter"> ';
		str += '	                <div class="inBox"> ';
		str += '	                    <input type="text" size="3" maxlength="2" id="cntAdd" name="cntAdd" style="width: 50px; padding-left: 5px;" value=""> 회 ';
		str += '	                </div> ';
		str += '	            </td> ';
		if ( renewTyp == "11" ) {
		str += '                <td class="tCenter"> ';
		str += '                    <div class="inBox"> ';
		str += '                        <input type="text" size="3" maxlength="2" id="datAdd" name="datAdd" style="width: 50px; padding-left: 5px;" value=""> 일 ';
		str += '                    </div> ';
		str += '                </td> ';
		} else {
		str += '                <td style="border-left:none;"> ';
		str += '                </td> ';
		}
		str += '	            <td class="tCenter"> ';
		str += '	                <button id="btn_save" class="grayBtn btn_style2">저장</button> ';
		str += '	                <button id="btn_close" class="grayBtn btn_Dstyle2">취소</button> ';
		str += '	            </td> ';
		str += '            </tr> ';
		str += '        </table> ';
		str += '        <div style="margin-top : 10px;"> ';
		if ( renewTyp == "11") {
		str += '	        <div>* 연장신청 횟수와 만료일 제한 값은 각각 <b style="color:red">99회, 99일</b> 입니다.</div> ';
		} else {
		str += '	        <div>* 증거자료신청 횟수 제한은 <b style="color:red">99회</b> 입니다.</div> ';
		}

		str += '	    </div> ';
		str += '    </div> ';
		str += '	</div>';

		str += '    <div id="rejt_pop" style="display: none; width: 475px; height : 276px; background: #333; border: 1px solid #000; padding: 10px; overflow : hidden;"> ';
		str += '    <div class="content" style="margin-left: 10px;"> ';
		str += '        <div> ';
		if ( renewTyp == "11"){
		str += '        	<p class="searchTitle" style="color:white;display: inline-block;margin-top: 12px;">연장신청 거절</p> ';
		} else {
		str += '        	<p class="searchTitle" style="color:white;display: inline-block;margin-top: 12px;">증거자료신청 거절</p> ';
		}
		str += '        <img id="btn_close" src="/xeus/res/img/close_btn.png" style="float: right; padding-top: 10px; cursor:pointer;"> ';
		str += '   		</div> ';
		str += '		<div>';
		str += '			<input type="hidden" class="sendData" id="mgrSeq" name="mgrSeq" value="">';
		str += '		</div>';
		//str += '        <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> ';
		str += '        <table cellspacing="0" width="100%" style="margin-top:0;"> ';
		str += '            <colgroup> ';
		str += '                <col width="80" /> ';
		str += '	            <col width="" /> ';
		str += '	            <col width="140" /> ';
		str += '            </colgroup> ';
		str += '            <tr> ';
		str += '                <th> ';
		str += '                    <label>거절사유</label> ';
		str += '                </th> ';
		str += '                <td colspan="2"> ';
		str += '                </td> ';
		str += '            </tr> ';
		str += '            <tr> ';
		str += '	            <td colspan="3"> ';
		str += '	                <div class="inBox"> ';
		str += '	                    <textarea  class="sendData" id="rejtResn" name="rejtResn" style="width: 99%; height: 112px; margin-top: 5px; margin-left: 3px;"></textarea> ';
		str += '	                </div> ';
		str += '	            </td> ';
		str += '	        </tr> ';
		str += '        </table> ';
		str += '        <div style="margin-top: 7px;"> ';
		str += '            <div style="color:white">* 거절 사유는 <b style="color:red;">최대 200글자 입니다.</b></div> ';
		str += '        </div> ';
		str += '        <div class="btnDiv"> ';
		str += '            <button id="btn_save" class="grayBtn"> 저 장 </button> ';
		str += '        </div> ';
		str += '    </div> ';

		$(".contentWrapper").find('#searchBox').append(str);

	}

		/**
		 * 승인 관련 이벤트
		 */
		$(".contentWrapper").find(".btn_acpt").click(function(){

			var mgrSeq = $(this).attr('mgrseq');
			var rqstMgrSeq = $(this).attr('rqstmgrseq');
			var aviMgrSeq = $(this).attr('avimgrseq');
			var fileSeq = $(this).attr('fileseq');
			var aviPlayLimitDat = $(this).attr('limdat');
			var title = "연장신청 승인";
			if(renewTyp == "12") title = "증거자료신청 승인"
			var str = '';

			str += '	<div id="acpt_pop"> ';
			/*if ( renewTyp == "11"){
			str += '        <p class="searchTitle">연장신청 승인</p> ';
			} else {
			str += '        <p class="searchTitle">증거자료신청 승인</p> ';
			}*/
//			str += '		<div>';
//			str += '			<input type="hidden" class="sendData" id="mgrSeqAcpt" name="mgrSeq" value="">';
//			str += '			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">';
//			str += '			<input type="hidden" class="sendData" id="aviMgrSeq" name="aviMgrSeq" value="">';
//			str += '			<input type="hidden" class="sendData" id="fileSeq" name="fileSeq" value="">';
//			str += '			<input type="hidden" class="sendData" id="aviPlayLimitDat" name="aviPlayLimitDat" value="">';
//			str += '		</div>';
			//str += '        <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> ';
			str += '        <table cellspacing="0" width="100%"> ';
//			str += '            <colgroup> ';
//			str += '                <col width="80" /> ';
//			str += '	            <col width="80" /> ';
//			str += '	            <col width="80" /> ';
//			str += '	            <col width="80" /> ';
//			str += '            </colgroup> ';
			str += '            <tr> ';
			str += '                <th> ';
			str += '                    <label>만료추가</label> ';
			str += '                </th> ';
			str += '                <td class="tCenter"> ';
			str += '	                <div class="inBox"> ';
			str += '	                    <input type="text" size="3" maxlength="3" id="cntAdd" name="cntAdd" style="width: 50px; padding-left: 5px;" value=""> 회 ';
			str += '	                </div> ';
			str += '	            </td> ';
			if ( renewTyp == "11" ) {
			str += '                <td class="tCenter"> ';
			str += '                    <div class="inBox"> ';
			str += '                        <input type="text" size="3" maxlength="3" id="datAdd" name="datAdd" style="width: 50px; padding-left: 5px;" value=""> 일 ';
			str += '                    </div> ';
			str += '                </td> ';
			} else {
			str += '                <td style="border-left:none;"> ';
			str += '                </td> ';
			}
//			str += '	            <td class="tCenter"> ';
//			str += '	                <button id="btn_save" class="grayBtn btn_style2">저장</button> ';
//			str += '	                <button id="btn_close" class="grayBtn btn_Dstyle2">취소</button> ';
//			str += '	            </td> ';
			str += '            </tr> ';
			str += '        </table> ';
			str += '        <div style="margin-top : 10px;"> ';
			if ( renewTyp == "11") {
			str += '	        <div>* 연장신청 횟수와 만료일 제한 값은 각각 <b style="color:red">999회, 999일</b> 입니다.</div> ';
			} else {
			str += '	        <div>* 증거자료신청 횟수 제한은 <b style="color:red">999회</b> 입니다.</div> ';
			}
			str += '	    </div> ';
			str += '        <div class="btnDiv"> ';
			str += '            <button id="btn_save" class="btn_style"> 저 장 </button> ';
			str += '        </div> ';
			str += '    </div> ';

			_common.callAjax("/sysMng/getSysParam.json", null, function(json){
				$("#popupWrap").dialog("close").html(str).dialog({
	       			title: title,
	       			width: 450,
	       			height: 200,
	       			position: {
	       				my: "center center",
	       				at: "center center",
	       				of: $("#contentWrap")
	       			},
	       			modal: true,
	       			open: function(){
	    				if(renewTyp == "11"){
	    					$("#acpt_pop").find('#cntAdd').val(json.result[0]['tvius.renew_play_cnt']);
	    					$("#acpt_pop").find('#datAdd').val(json.result[0]['tvius.renew_play_dat']);
	    				} else {
	    					$("#acpt_pop").find('#cntAdd').val(json.result[0]['tvius.evi_play_cnt']);
	    				}
	       				/**
	       				 * 연장, 증거자료 신청 이벤트
	       				 */
	    				$("#acpt_pop").find("#btn_save").click(function(e) {
	       					var playLimitCnt = Number($("#acpt_pop").find('#cntAdd').val());
	       					if( _common.utils.isNullAndEmpty(playLimitCnt) || !_common.utils.isNumber(playLimitCnt) ){
	       						alert('* 횟수 제한 입력 값을 확인하여 주십시오.');
	       						$("#acpt_pop").find('#cntAdd').focus();
	       						return false;
	       					}

	       					if(renewTyp == "11"){
	       						var playLimitDat = Number($("#acpt_pop").find('#datAdd').val());
	       						if( _common.utils.isNullAndEmpty(playLimitDat) || !_common.utils.isNumber(playLimitDat) ){
	       							alert('* 기간 제한 입력 값을 확인하여 주십시오.');
	       							$("#acpt_pop").find('#datAdd').focus();
	       							return false;
	       						}
	       					}

	       					if (renewTyp == "11") {
	       						playLimitDat = DateAdd(aviPlayLimitDat, playLimitDat);

	       					} else {
	       						playLimitDat = "0";
	       					}

	       					var _acptParam = {};
	       					_acptParam['editTyp'] = 'acpt';
	       					_acptParam['mgrSeq'] = mgrSeq;
	       					_acptParam['rqstMgrSeq'] = rqstMgrSeq;
	       					_acptParam['aviMgrSeq'] = aviMgrSeq;
	       					_acptParam['fileSeq'] = fileSeq;
	       					_acptParam['playLimitCnt'] = playLimitCnt;
	       					_acptParam['playLimitDat'] = playLimitDat;
	       					_acptParam['acptUserId'] = userId;
	       					_acptParam['acptYn'] = 'Y';
	       					_acptParam['renewTyp'] = renewTyp;

	       					_common.callAjax("/tvius/editRenew.json", _acptParam, function(json){
	       						if(json.result){

	       							alert('* 저장되었습니다.');
	       							$("#popupWrap").dialog("close");

	       							if(renewTyp == "11"){
	       				        			$("#btn-tvius-ext-view").click();
	       			        		} else {
	       			        			$("#btn-tvius-evi-view").click();
	       			        		}

	       			        	}
	       					});
	       				});
	       			},
	       			close: function(){

	       			}
	       		}).dialog("open");
			}, false);

		});


		/**
		 * 승인 팝업에서 취소 버튼을 눌렀을 때의 이벤트
		 */
		$(".contentWrapper").find("#acpt_pop").find("#btn_close").click(function(e) {

			$(".contentWrapper").find("#acpt_pop").bPopup().close();

		});


		/**
		 * 거절 관련 이벤트
		 */
		$(".contentWrapper").find(".btn_rejt").click(function(){
			var mgrSeq = $(this).attr('mgrseq');
			var str = '';

			str += '    <div id="rejt_pop" style="width: 475px; height : 276px; background: #333; border: 1px solid #000; padding: 10px; overflow : hidden;"> ';
			str += '    <div class="content" style="margin-left: 10px;"> ';
//			str += '        <div> ';
			/*if ( renewTyp == "11"){
			str += '        	<p class="searchTitle" style="color:white;display: inline-block;margin-top: 12px;">연장신청 거절</p> ';
			} else {
			str += '        	<p class="searchTitle" style="color:white;display: inline-block;margin-top: 12px;">증거자료신청 거절</p> ';
			}*/
//			str += '        <img id="btn_close" src="/xeus/res/img/close_btn.png" style="float: right; padding-top: 10px; cursor:pointer;"> ';
//			str += '   		</div> ';
//			str += '		<div>';
//			str += '			<input type="hidden" class="sendData" id="mgrSeq" name="mgrSeq" value="">';
//			str += '		</div>';
			//str += '        <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> ';
			str += '        <table cellspacing="0" width="100%" style="margin-top:0;"> ';
			str += '            <colgroup> ';
			str += '                <col width="80" /> ';
			str += '	            <col width="" /> ';
			str += '	            <col width="140" /> ';
			str += '            </colgroup> ';
			str += '            <tr> ';
			str += '                <th> ';
			str += '                    <label>거절사유</label> ';
			str += '                </th> ';
			str += '                <td colspan="2"> ';
			str += '                </td> ';
			str += '            </tr> ';
			str += '            <tr> ';
			str += '	            <td colspan="3"> ';
			str += '	                <div class="inBox"> ';
			str += '	                    <textarea  class="sendData" id="rejtResn" name="rejtResn" style="width: 99%; height: 112px; margin-top: 5px; margin-left: 3px;"></textarea> ';
			str += '	                </div> ';
			str += '	            </td> ';
			str += '	        </tr> ';
			str += '        </table> ';
			str += '        <div style="margin-top: 7px;"> ';
			str += '            <div style="color:white">* 거절 사유는 <b style="color:red;">최대 200글자 입니다.</b></div> ';
			str += '        </div> ';
			str += '        <div class="btnDiv"> ';
			str += '            <button id="btn_save" class="btn_style"> 저 장 </button> ';
			str += '        </div> ';
			str += '    </div> ';

			var title = "연장신청 거절";
			if(renewTyp == "12") title = "증거자료신청 거절";

			$("#popupWrap").dialog("close").html(str).dialog({
       			title: title,
       			width: 530,
       			height: 350,
       			position: {
       				my: "center center",
       				at: "center center",
       				of: $("#contentWrap")
       			},
       			modal: true,
       			open: function(){

       				$("#rejt_pop").find("#btn_save").click(function(e) {
       					var rejtResn = $("#rejt_pop").find('#rejtResn').val();

       					if( _common.utils.isNullAndEmpty(rejtResn)){
       						alert('* 거절 사유를 입력하여 주십시오.');
       						return false;
       					}

       					var _rejtParam = {};
       					_rejtParam['editTyp'] = 'rejt';
       					_rejtParam['mgrSeq'] = mgrSeq;
       					_rejtParam['acptUserId'] = userId;
       					_rejtParam['acptYn'] = 'N';
       					_rejtParam['rejtResn'] = rejtResn;

       					_common.callAjax("/tvius/editRenew.json", _rejtParam, function(json){
       						if(json.result){

       							alert('* 저장되었습니다.');
       							$("#popupWrap").dialog("close");

       							if(renewTyp == "11"){
       								$("#btn-tvius-ext-view").click();
       							} else {
       								$("#btn-tvius-evi-view").click();
       							}
       						}
       					});
       				});
       			},
       			close: function(){

       			}
       		}).dialog("open");

//			$(".contentWrapper").find("#rejt_pop").bPopup({appendTo: $(".contentWrapper")});

		});


	/**
	 * 재생만료일을 구한다.<br>
	 * 현재 날짜보다 입력값이 과거이면 현재 날짜를 기준으로 계산된다.
	 * @param limitDat
	 * @param addDay
	 * @returns
	 */
	function DateAdd(limitDat, addDay) {

		var oneDay = 1000 * 3600 * 24;

	    var baseDT = new Date(limitDat.substring(0, 4), parseInt(limitDat.substring(4, 6))-1, limitDat.substring(6, 8), limitDat.substring(8, 10), limitDat.substring(10, 12), limitDat.substring(12, 14), 0);
	    var today = new Date();

	    var rstDate = null;

	    if ( baseDT.getTime() > today.getTime()){
	    	rstDate = new Date(baseDT.getTime() + (oneDay * addDay));
	    } else {
	    	rstDate = new Date(today.getTime() + (oneDay * addDay));
	    }

	    return Date.prototype.formatDateToStr(rstDate);

	}

	/*function setTooltip(target, from){
		$(target).tooltipsy({
			delay: 0,
			offset: [5, 5],
			css: {
				'font-size' : '12px',
				'font-weight' : 'bold',
				'padding': '10px',
				'color': '#303030',
				'background-color': '#ffffff',
				'border': '2px solid #4893BA',
				'-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
				'-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
				'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
				'text-shadow': 'none'
			},
			from: from
		}).click(function (e) {
			$('.tooltipsy').parent().hide();

			var from = from;
			if(from != null){
				setTimeout(function(){
					if(!$("div[aria-describedby=" + from + "]").is(":visible")){
						$("div[from=" + from + "]").remove();
					}
				}, 500);
			}
		});
	}*/

