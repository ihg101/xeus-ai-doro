/**
 * 영상반출 신청현황 AVI 리스트 관련 이벤트 입니다.
 */

	var downInterval;
	var aviList = null;

	$(document).ready(function(){

		workChk();

		$('.img_down').click(function(){
            var downNm = $(this).attr('downnm');
            var realNm = $(this).attr('realnm');
        	var _html ='';
    		_html += '<div class="detailPopupWrapper">'
    		_html += '	<div id="docNoChngPop">'
    		_html += '		<div id="bpop_wrap" class="table_style tCenter">'
    		_html += '			<img class="imgs" alt="'+downNm+'" src="./tvius/getImage.do?realNm='+realNm+'">'
    		_html += '			<div style="text-align:center"><button class="btn_style2" id="imgDownload">다운로드</button></div>'
    		_html += '		</div>'
    		_html += '	</div>'
    		_html += '</div>'

    		$("#detailPopupWrap").html(_html).dialog({
    			title: '이미지',
    			width: 500,
    			height: 400,
    			position: {
    				my: "center center",
    				at: "center center",
    				of: $("#contentWrap")
    			},
    			modal: true,
    			open: function(){
    				$('.detailPopupWrapper').find('#imgDownload').click(function(){
    					_common.callAjax("/sysMng/getSysParam.json", null, function(json) {
    						if(json.result !== undefined){
    							var _param = {};
    							_param['sub'] = 'image';
    							_param['path'] = json.result[0]['sys.upload_path'];
    							_param['fileNm'] = realNm;
    							_param['downFileNm'] = downNm;
    							_param['auth'] = "A";
    							_common.postForm.submit("/tvius/getFiles.json", _param);
    						}
    					},false);
                });

    			},
    			close: function(){

    			}
    		}).dialog("open");

        });

	});

	/**
	 * 반출 상태 표시를 위한 progress bar를 세팅합니다.
	 */
	function progresVal(str) {
		var req;

		if ( str == '11'  ) {
			req = 20;
		} else if (str == '12' ) {
			req = 30;
		} else if (str == '13' ) {
		    req = 0;
		} else if (str == '20') {
			req = 40;
		} else if (str == '21' ) {
			req = 40;
		} else if (str == '22' ) {
			req = 50;
		} else if (str == '23' ) {
			req = 0;
		} else if (str == '14' ) {
		    req = 60;
		} else if (str == '15' ) {
			req = 70;
		} else if (str == '16' ) {
			req = 0;
		} else if (str == '17' ) {
			req = 80;
		} else if (str == '19' ) {
			req = 0;
		} else {
			req = 100;
		}
		return req;
	}

	/**
	 * 반출 상태를 체크합니다.<br>
	 * 반출 상태에 따라 알맞은 작업을 진행합니다.
	 */
	function workChk(){

		$(".contentWrapper").find('.rslt_stat').remove();

		var Chk = false;
		var CompleteChk = false;

		getAviList();

		//분할될걸 감안해서 계속 그려주는게 맞는거임.
		//없애려는 생각 1도 하지 말기
		replaceList(aviList);

		var workStatCdArray = new Array();
		var smyRqstMgrSeq = '';
		var smyFileName = new Array();
		var smyAviMgrSeq = new Array();
		var smySendYn = new Array();
		var smySendStDat = new Array();

		for(var i=0; i<aviList.length; i++){

			var rsltCd = aviList[i].vdwkWorkStatCd;
			var rsltMsg = aviList[i].vdwkWorkStatCdRelCdeNm;
			var rsltEmpty = aviList[i].bakStatCd;
			var mgrSeq = aviList[i].mgrSeq;
			var rqstMgrSeq = aviList[i].rqstMgrSeq;
			var fileSeq = aviList[i].vdwkFileSeq;
			var rsltReq = progresVal(rsltCd);
			var cctvMgrNo = aviList[i].cctvMgrNo;
			var downCnt = Number( aviList[i].vdwkDownCnt ) ;
			var videoSmyy = aviList[i].videoSmy;

			workStatCdArray.push(rsltCd);
			smyRqstMgrSeq = rqstMgrSeq;
			smyFileName.push(aviList[i].vdwkFileNm);
			smyAviMgrSeq.push(mgrSeq);
			smySendYn.push(aviList[i].smySendYn);
			smySendStDat.push(aviList[i].vdwkSecStDat);

			var filePath = '';
			var fileName = '';
			var aviCnt = '';

			if(aviList[i].vdwkFileNm !== null){
				filePath= aviList[i].vdwkFileNm.split('/');
				fileName= filePath[filePath.length-1];
				aviCnt = fileName;
				aviCnt = aviCnt.split("").reverse().join("").substr(4,1);
			}

			var keyFileName= mgrSeq+'_'+rqstMgrSeq+'_'+fileSeq;

			var ufileName = aviList[i].cctvLabel+'_'+aviCnt+'_'+aviList[i].vdwkSecStDat+'_'+aviList[i].vdwkSecEdDat;

			if (rsltCd == null){

				//승인대기일 경우 목록을 갱신하지 않는다.
				//Chk = false;
				//승인대기가 아니라 아직 백업프로세스에서 가져간게 아니므로 돌리는게 맞음
				//Chk = true;

				//그냥 갱신을 하지 말기, 승인 전인데 null이면 괜히 돌아야함
				Chk = false;

			}else if ( rsltCd != '18' && rsltCd != '' && ( rsltCd != '13' || rsltCd != '16' || rsltCd != '19' ) ) {
			//}else if ( rsltCd != '18' && rsltCd != '') {

				$(".contentWrapper").find('.work_'+keyFileName).hide();
				$(".contentWrapper").find('.pro_'+keyFileName).show();

				$(".contentWrapper").find('.pro_'+keyFileName).attr("rslt", rsltCd);

				if ( rsltCd == '13' || rsltCd == '16' || rsltCd == '19' ) {
					//$(".contentWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#999');

					//$(".contentWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#000');

					Chk = false;
				} else {
					Chk = true;
				}

				$(".contentWrapper").find('.pro_'+keyFileName).progressbar({
					value : rsltReq
				});

				//$(".contentWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background', '#d93e3e');

				if ( rsltCd == '13' || rsltCd == '16' || rsltCd == '19' ) {
					$(".contentWrapper").find('.pro_'+keyFileName).css('background', '#d93e3e');
					$(".contentWrapper").find('.pro_'+keyFileName).css('border', '#d93e3e 1px solid');
				} else {
					$(".contentWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#6dd66d');//4baf4b
				}

				//$(".contentWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#6dd66d');

				//Chk = true;
				//Chk = false;

				$(".contentWrapper").find('.pro_'+keyFileName).append('<span class="rslt_stat" style="color:#fff; position: absolute;top: 2px; left: 45%; ">'+rsltMsg+'</span>');//#444
			} else if (rsltCd.trim() == '' ){
				$(".contentWrapper").find('.work_'+keyFileName).show();
				$(".contentWrapper").find('.work_'+keyFileName).text("");

				$(".contentWrapper").find('.pro_'+keyFileName).hide();

				Chk = true;
				$(".contentWrapper").find('.btn_renew1[mgrno='+cctvMgrNo+']').removeClass('btn_style2').addClass('btn_Dstyle');
				$(".contentWrapper").find('.btn_renew2[mgrno='+cctvMgrNo+']').removeClass('btn_style2').addClass('btn_Dstyle');
			} else if ( rsltCd == '13' || rsltCd == '16' || rsltCd == '19' ){

				$(".contentWrapper").find('.work_'+keyFileName).show();
				$(".contentWrapper").find('.work_'+keyFileName).text("영상 반출 실패!");

				$(".contentWrapper").find('.btn_renew1[mgrno='+cctvMgrNo+']').removeClass('btn_style2').addClass('btn_Dstyle');
				$(".contentWrapper").find('.btn_renew2[mgrno='+cctvMgrNo+']').removeClass('btn_style2').addClass('btn_Dstyle');
				$(".contentWrapper").find('.pro_'+keyFileName).hide();
				//$(".contentWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background', '#d93e3e');

				Chk = false;

			} else if ( rsltCd == "18"  ){

				$(".contentWrapper").find('.work_'+keyFileName).show();
				$(".contentWrapper").find('.work_'+keyFileName).attr('downcnt', downCnt);
				$(".contentWrapper").find('.work_'+keyFileName).attr('filenm', fileName);

				var extension = ".MS4";
//				if($(".contentWrapper").find('.work_'+keyFileName).hasClass("isRenewY")){
//					extension = ".AVI"
//				}

				if(reqGbn == "차량번호") extension = ".zip";

				$(".contentWrapper").find('.work_'+keyFileName).text(ufileName + extension);
				$(".contentWrapper").find('.btn_renew1[avi='+mgrSeq+'][rqst='+rqstMgrSeq+'][file='+fileSeq+']').removeClass('btn_Dstyle').addClass('btn_style2');
				$(".contentWrapper").find('.btn_renew2[avi='+mgrSeq+'][rqst='+rqstMgrSeq+'][file='+fileSeq+']').removeClass('btn_Dstyle').addClass('btn_style2');
				$(".contentWrapper").find('.pro_'+keyFileName).remove();

				if ( SYSTEM_SMI_YN == 'Y' ) {
					$(".contentWrapper").find('.smi_'+keyFileName).show();
					$(".contentWrapper").find('.smi_'+keyFileName).attr('downcnt', downCnt);
					$(".contentWrapper").find('.smi_'+keyFileName).attr('filenm', fileName.replace(".MS4", ".smi"));

					var extension = ".smi";

					$(".contentWrapper").find('.smi_'+keyFileName).text(ufileName + extension);
				}

				CompleteChk = true;
				Chk = false;

			} else {
				Chk =false;
			}

			if ( rsltEmpty == -1 ) {
				$(".contentWrapper").find('.pro_'+keyFileName).remove();
				$(".contentWrapper").find('.work_'+keyFileName).replaceWith("<span>영상파일이 존재하지 않습니다.</span>");

			}
		}

		var workStatCdFlag = true;
		for(var i=0; i<workStatCdArray.length; i++){
			if(workStatCdArray[i] != '12' && workStatCdArray[i] != '20'){ // 백업완료, 고속검색중
				workStatCdFlag = false;
			}
		}

		if(workStatCdFlag && videoSmyy == 'Y'){

			var sendSmyChk = false;
			sendSmyChk = true;

			for(var i=0; i<smyAviMgrSeq.length; i++){

				if(smySendYn[i] == '0'){
					var param = {};
					param["rqstMgrSeq"] = smyRqstMgrSeq;
					param["aviMgrSeq"] = smyAviMgrSeq[i];
					param["fileName"] = smyFileName[i];
					param["recDt"] = Date.prototype.formatDateSmy(smySendStDat[i]);
					param["userId"] = userId;
					param["userPw"] = userPw;
					param["upload"] = "2";

					// 비디오써머리로 전송.
					_common.callAjax("/videoSmy/videoSmyRqst.json", param, function(json){
						if(json.result == "200"){
							// smy_send_yn 1로 업데이트
							_common.callAjax("/tvius/editAvi.json", {"mgrSeq":smyAviMgrSeq[i], "rqstMgrSeq":smyRqstMgrSeq, "smySendYn" : "1"}, function(json){
							}, false);

							sendSmyChk = true;
						} else{
							if(json.result == "NOFILE"){
								alert("* 영상 파일이 존재하지 않습니다. 관리자에게 문의하시기 바랍니다.");
							} else{
								alert("* 고속검색 서버로 영상을 전송하는데 실패하였습니다. 관리자에게 문의하시기 바랍니다.");
							}
							_common.callAjax("/tvius/editAvi.json", {"mgrSeq":smyAviMgrSeq[i], "rqstMgrSeq":smyRqstMgrSeq, "smySendYn" : "3"}, function(json){
							}, false);
						}
					}, false);
				}
			}
			if(sendSmyChk){
				$(".contentWrapper").find('.videoSmyBtn').removeClass('btn_Dstyle').addClass('btn_style2');
				// work_stat_cd = 20 으로 변경 - 고속검색중..
				_common.callAjax("/tvius/editWorkInfo.json", {"rqstMgrSeq" : smyRqstMgrSeq, "workStatCd" : "20"}, function(json){
				});
			}
		}

		aviRenewBtn();

		if ( Chk == true ) {
			intervalListChk = setTimeout('workChk()', 2000);
		}

		if ( CompleteChk ){

			/**
			 * bpopup관련 문제로 인해 팝업창 div를 스크립트단에서 생성
			 * 이미 생성돼있을 수도 있기 때문에 삭제 후 다시 만듦
			 */
//			$(".contentWrapper").find('#drm_pop').remove();
//			setPopDiv();

			$(".contentWrapper").find(".btn_renew1").click(function(){// .bluBtn
			//$(".contentWrapper").find("#videoListView").find(".btn_renew1").click(function(){

				if ($(this).hasClass('btn_style2')){

					var rqstMgrSeq = $(this).attr('rqst');
					var aviMgrSeq = $(this).attr('avi');
					var fileSeq = $(this).attr('file');

					var str = '';

					str += ' <div class="popupWrapper">';
					str += ' <div id="drm_pop">';
					str += '	<div class="searchWrapper" style="margin-left: 10px; padding-bottom:0px;">';
					str += '		<div>';
					str += '			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">';
					str += '			<input type="hidden" class="sendData" id="aviMgrSeq" name="aviMgrSeq" value="">';
					str += '			<input type="hidden" class="sendData" id="fileSeq" name="fileSeq" value="">';
					str += '			<input type="hidden" class="sendData" id="renewTyp" name="renewTyp" value="">';
					str += '		</div>';
					str += '		<p class="searchTitle drmTitle"></p>';
					//str += '		<div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div>';
					str += '		<table cellspacing="0" width="100%">';
					str += '			<colgroup>';
					str += '				<col width="80" />';
					str += '				<col width="" />';
					str += '				<col width="100" />';
					str += '			</colgroup>';
					str += '			<tr>';
					str += '				<th>';
					str += '					<label>신청사유</label>';
					str += '				</th>';
					str += '				<td colspan="2"></td>';
					str += '			</tr>';
					str += '			<tr>';
					str += '				<td colspan="3">';
					str += '					<div class="inBox">';
					str += '						<textarea class="sendData" id="reqstResn" name="reqstResn" style="width: 96%; height: 57px;" value=""></textarea>';
					str += '					</div>';
					str += '				</td>';
					str += '			</tr>';
					str += '		</table>';
					str += '		<div class="btnDiv" class="padding-bottom:5px;">';
					str += '			<button id="btn_save" class="btn_style">신청</button>';
//					str += '			<button id="btn_close" class="btn_style2">취소</button>';
					str += '		</div>';
					str += '	</div>';
					str += ' </div>';
					str += ' </div>';

					$("#popupWrap").dialog("close").html(str).dialog({
		       			title: '연장신청',
		       			width: 520,
		       			height: 280,
		       			position: {
		       				my: "center center",
		       				at: "center center",
		       				of: $("#contentWrap")
		       			},
		       			modal: true,
		       			open: function(){
		       				$('#drm_pop').find('#rqstMgrSeq').val(rqstMgrSeq);
							$('#drm_pop').find('#aviMgrSeq').val(aviMgrSeq);
							$('#drm_pop').find('#fileSeq').val(fileSeq);
							$('#drm_pop').find('#renewTyp').val('11');
//							$('#drm_pop').find('.drmTitle').text('연장신청사유');
		       				/**
		       				 * 연장, 증거자료 신청 이벤트
		       				 */
		       				$(".popupWrapper").find("#btn_save").click(function(e) {
		       					var _renewParam = _common.utils.collectSendData("#drm_pop");

		       					if ( _renewParam['reqstResn'] == "" ){
		       						alert('* 신청사유를 입력하여 주십시오.');
		       						return false;
		       					}
		       					if ( _renewParam['reqstResn'].length > 250 ){
		       						alert('* 신청사유는 250자를 넘을 수 없습니다.');
		       						return false;
		       					}

		       					_renewParam['rqstReqstId'] = userId;

		       					_common.callAjax("/tvius/addRenew.json", _renewParam, function(json){
		       						if(json.result){
		       							alert('* 저장되었습니다.');
		       							$("#popupWrap").dialog("close");
		       							$(".contentWrapper").find('.btn_renew1[avi='+aviMgrSeq+'][rqst='+rqstMgrSeq+'][file='+fileSeq+']').text("승인대기중").removeClass("btn_style2").addClass("btn_t").attr("disabled",true);
		       							/*_common.callAjax("/ws/noticeCrmsTransRqstToTviusMng.json", { "json" : JSON.stringify(json.crmsRqstRenewVo) }, function(data) {
		       								if(data.result){
		       								}
		       							},false);*/

		       						}
		       			        }, false);

		       				});

		       			},
		       			close: function(){

		       			}
		       		}).dialog("open");
				}
			});

			$(".contentWrapper").find(".btn_renew2").click(function(){

				if ($(this).hasClass('btn_style2')){
					var rqstMgrSeq = $(this).attr('rqst');
					var aviMgrSeq = $(this).attr('avi');
					var fileSeq = $(this).attr('file');

					var str = '';

					str += ' <div class="popupWrapper">';
					str += ' <div id="drm_pop">';
					str += '	<div class="searchWrapper" style="margin-left: 10px; padding-bottom:0px;">';
					str += '		<div>';
					str += '			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">';
					str += '			<input type="hidden" class="sendData" id="aviMgrSeq" name="aviMgrSeq" value="">';
					str += '			<input type="hidden" class="sendData" id="fileSeq" name="fileSeq" value="">';
					str += '			<input type="hidden" class="sendData" id="renewTyp" name="renewTyp" value="">';
					str += '		</div>';
					str += '		<p class="searchTitle drmTitle"></p>';
					//str += '		<div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div>';
					str += '		<table cellspacing="0" width="100%">';
					str += '			<colgroup>';
					str += '				<col width="80" />';
					str += '				<col width="" />';
					str += '				<col width="100" />';
					str += '			</colgroup>';
					str += '			<tr>';
					str += '				<th>';
					str += '					<label>신청사유</label>';
					str += '				</th>';
					str += '				<td colspan="2"></td>';
					str += '			</tr>';
					str += '			<tr>';
					str += '				<td colspan="3">';
					str += '					<div class="inBox">';
					str += '						<textarea class="sendData" id="reqstResn" name="reqstResn" style="width: 96%; height: 57px;" value=""></textarea>';
					str += '					</div>';
					str += '				</td>';
					str += '			</tr>';
					str += '		</table>';
					str += '		<div class="btnDiv" class="padding-bottom:5px;">';
					str += '			<button id="btn_save" class="btn_style">신청</button>';
//					str += '			<button id="btn_close" class="btn_style2">취소</button>';
					str += '		</div>';
					str += '	</div>';
					str += ' </div>';
					str += ' </div>';

					$("#popupWrap").dialog("close").html(str).dialog({
		       			title: '증거자료신청',
		       			width: 520,
		       			height: 280,
		       			position: {
		       				my: "center center",
		       				at: "center center",
		       				of: $("#contentWrap")
		       			},
		       			modal: true,
		       			open: function(){
		       				$('#drm_pop').find('#rqstMgrSeq').val(rqstMgrSeq);
							$('#drm_pop').find('#aviMgrSeq').val(aviMgrSeq);
							$('#drm_pop').find('#fileSeq').val(fileSeq);
							$('#drm_pop').find('#renewTyp').val('12');
//							$(".popupWrapper").find('#drm_pop').find('.drmTitle').text('증거자료신청사유');
		       				/**
		       				 * 연장, 증거자료 신청 이벤트
		       				 */
		       				$(".popupWrapper").find("#btn_save").click(function(e) {
		       					var _renewParam = _common.utils.collectSendData("#drm_pop");

		       					if ( _renewParam['reqstResn'] == "" ){
		       						alert('* 신청사유를 입력하여 주십시오.');
		       						return false;
		       					}
		       					if ( _renewParam['reqstResn'].length > 250 ){
		       						alert('* 신청사유는 250자를 넘을 수 없습니다.');
		       						return false;
		       					}

		       					_renewParam['rqstReqstId'] = userId;

		       					_common.callAjax("/tvius/addRenew.json", _renewParam, function(json){
		       						if(json.result){
		       							alert('* 저장되었습니다.');
		       							$("#popupWrap").dialog("close");
		       							$(".contentWrapper").find('.btn_renew1[avi='+aviMgrSeq+'][rqst='+rqstMgrSeq+'][file='+fileSeq+']').removeClass("btn_style2").addClass("btn_t").attr("disabled",true);
		       							$(".contentWrapper").find('.btn_renew2[avi='+aviMgrSeq+'][rqst='+rqstMgrSeq+'][file='+fileSeq+']').text("승인대기중").removeClass("btn_style2").addClass("btn_t").attr("disabled",true);
		       							/*_common.callAjax("/ws/noticeCrmsTransRqstToTviusMng.json", { "json" : JSON.stringify(json.crmsRqstRenewVo) }, function(data) {
		       								if(data.result){
		       								}
		       							},false);*/
		       						}
		       			        }, false);

		       				});

		       			},
		       			close: function(){

		       			}
		       		}).dialog("open");
				}
			});

			/**
			 * 연장, 증거신청 팝업 종료 이벤트
			 */
			//$(".contentWrapper").find("#videoListView").find("#btn_close").click(function(e) {
			$(".contentWrapper").find('#drm_pop').find("#btn_close").click(function(e) {

				/*$(".contentWrapper").find('#drm_pop').find('#reqstResn').val('');*/
				$(".contentWrapper").find('#drm_pop').find('#reqstResn').val('');
				$(".contentWrapper").find("#drm_pop").bPopup().close();

			});



			$(".contentWrapper").find('.avi_down').css('font-weight','bold');

			$(".contentWrapper").find('.avi_down').mouseenter(function(){
				$(this).css("cursor","pointer");
				$(this).css("text-decoration","underline");
			});

			$(".contentWrapper").find('.avi_down').mouseleave(function(){
				$(this).css("text-decoration","none");
			});

			$(".contentWrapper").find('.avi_down').click(function(){

				var _param = {};
				_param['userId'] = userId;
				_param['fileNm'] = userId + "/" + $(this).attr('filenm');
				_param['reqGbn'] = reqGbn;
				if(reqGbn=="차량번호") _param['fileNm'] = $(this).attr('filenm');

				if($(this).parent().parent().find("#isRenewY").length >0){
					_param["isRenew"]='y';
				}

				_common.callAjax("/tvius/getDownloadAuth.json", _param, function(json){

					if (json !== undefined){
						/**
						 * P : 허용
						 * O : 횟수 초과
						 * N : 허용 안됨.
						 * E : 권한 조회 오류
						 */
						if ( json.result == "P"){
							if( json.strPath != null && json.downFileNm != null){
								if(reqGbn !="차량번호"){
									_param['fileNm'] = _param['fileNm'].split('/')[1];
								}
								_param['sub'] = userId + "\\";
								_param['path'] = json.strPath;
								_param['downFileNm'] = json.downFileNm.replace(/\;/gi, '_');

								if(_param["isRenew"]=='y'){
									_common.postForm.submit("/tvius/getRenewFiles.json", _param);
								}else{
									_common.postForm.submit("/tvius/getFiles.json", _param);
								}
							}
						} else if ( json.result == "O"){

							alert('* 영상 다운로드 횟수를 초과했습니다.');
						} else if ( json.result == "N"){

							alert('* 영상 다운로드 권한이 없습니다.');
						}  else if ( json.result == "E"){

							alert('* 권한 조회 오류가 발생했습니다.');
						}
					} else {

						alert('* 다운로드 요청이 실패했습니다.');

					}

				}, false);

			});

			$('.contentWrapper').find('.smi_down').css('font-weight','bold');
			$('.contentWrapper').find('.smi_down').mouseenter(function(){
				$(this).css("cursor","pointer");
				$(this).css("text-decoration","underline");
			});
			$('.contentWrapper').find('.smi_down').mouseleave(function(){
				$(this).css("text-decoration","none");
			});
			$('.contentWrapper').find('.smi_down').click(function(){
				var _param = {};
				_param['userId'] = userId;
				_param['fileNm'] = userId + "/" + $(this).attr('filenm').replace(".smi", ".MS4");
				_param['reqGbn'] = reqGbn;
				if(reqGbn=="차량추적") _param['fileNm'] = $(this).attr('filenm');

				_common.callAjax("/tvius/getDownloadAuth.json", _param, function(json){

					if (json !== undefined){
						/**
						 * P : 허용
						 * O : 횟수 초과
						 * N : 허용 안됨.
						 * E : 권한 조회 오류
						 */
						if ( json.result == "P"){
							if( json.strPath != null && json.downFileNm != null){
								if(reqGbn !="차량추적"){
									_param['fileNm'] = _param['fileNm'].split('/')[1];
								}
								_param['sub'] = userId + "\\";
								_param['path'] = json.strPath;
								_param['fileNm'] = _param['fileNm'].replace(".MS4", ".smi");
								_param['downFileNm'] = json.downFileNm.replace(/\;/gi, '_').replace(".MS4", ".smi");

								_common.callAjax("/tvius/getIsFileOnServer.json", _param, function(json){
									if(!json.result){
										alert("서버에 파일이 존재하지 않습니다.");
										return;
									} else{
										_common.postForm.submit("/tvius/getFiles.json", _param);
									}
								});

							}
						} else if ( json.result == "O"){

							alert('* 영상 다운로드 횟수를 초과했습니다.');
						} else if ( json.result == "N"){

							alert('* 영상 다운로드 권한이 없습니다.');
						}  else if ( json.result == "E"){

							alert('* 권한 조회 오류가 발생했습니다.');
						}
					} else {

						alert('* 다운로드 요청이 실패했습니다.');

					}

				}, false);

			});
		}
	}

	/**
	 * 영상 목록 테이블을 갱신한다.
	 * 파일 분할로 인해 row 갯수가 유동적으로 바뀌기 때문에 진행되는 작업.
	 *
	 * @param aviList
	 */
	function replaceList(aviList){
		var editMgrSeq ='';
		var str = '';
		for(var i=0; i<aviList.length; i++){

			var cctvLabel = aviList[i].cctvLabel;
			var cctvMgrNo = aviList[i].cctvMgrNo;
			var secStDat = Date.prototype.formatDate(aviList[i].secStDat.trim());
			var secEdDat = Date.prototype.formatDate(aviList[i].secEdDat.trim());//formatYMDHMS
			var playLimitCnt =aviList[i].playLimitCnt;
			var playLimitDat =aviList[i].playLimitDat;

			var renewPlayLimitCnt = aviList[i].renewPlayLimitCnt;
			var renewPlayLimitDat = aviList[i].renewPlayLimitDat;

			var expAviPw = aviList[i].expAviPw;
			//var bakStatCd = aviList[i].bakStatCd;
			var rqstMgrSeq = aviList[i].rqstMgrSeq;
			editMgrSeq = rqstMgrSeq;
			var mgrSeq = aviList[i].mgrSeq;
			var vdwkFileSeq = aviList[i].vdwkFileSeq;
			//var key = aviList[i].key.text();
			var realRowKey = mgrSeq+'_'+rqstMgrSeq+'_'+vdwkFileSeq;

			str +='<tr>';
			str +='<td class="tBlankLeft"><div align="left">';
			str += _common.utils.validNull(cctvLabel);
			str +='</div></td>';
			str +='<td class="tCenter">';
			str += secStDat;
			str +='</td>';
			str +='<td class="tCenter">';
			str += secEdDat;
			str +='</td>';
			str +='<td class="tCenter">';
			if(renewPlayLimitCnt == null){
			str += playLimitCnt;
			} else{
			str += renewPlayLimitCnt;
			}
			str +='</td>';
			str +='<td class="tCenter">';
			if(renewPlayLimitDat == null){
				if (  playLimitDat != null &&  playLimitDat.trim() != '0' ){
					playLimitDat = Date.prototype.formatDate(playLimitDat.trim().substring(0,8));
				} else {
					playLimitDat = '-';
				}
			str += playLimitDat;
			} else {
				if ( renewPlayLimitDat.trim() != '0' ){
					renewPlayLimitDat = Date.prototype.formatDate(renewPlayLimitDat.trim().substring(0,8));
				} else {
					renewPlayLimitDat = '-';
				}
			str += renewPlayLimitDat;
			}
			str +='</td>';
			/*str +='<td>';
			str += expAviPw;
			str +='</td>';*/
			/*str +='<td>';
			str += bakStatCd;
			str +='</td>';*/

			if( maskingYn != "N"){
			str +='<td class="tCenter">';
				if ( aviList[i].maskChk != "0"){
			str +='O';
				} else {
			str +='X';
				}
			str +='</td>';
			}

			if(reqGbn == "차량번호"){
				str += '<td class="tCenter">';
				str += carInfo;
				str += '</td>';
			}

			var downClass = '';
			if(reqGbn != "오프라인반출") downClass="avi_down";
			str +='<td class="tCenter">';
			str +='<div class="progress pro_'+realRowKey+'" style="position:relative; min-width:280px; height:20px;"></div>';
			str +='<a key="'+realRowKey+'" class="'+downClass+' work_'+realRowKey+'" target="_blank" ></a>';
			str +='</td>';

			if(SYSTEM_SMI_YN == "Y") {
				str +='</br><a key="'+realRowKey+'" class="smi_down work_'+realRowKey+'" target="_blank" style="color:#7780ff;" ></a>';
			}

			if(videoSmyChk == "Y" && videoSmy == "Y" && i == 0){
				str += '<td rowspan="' + aviList.length + '" class="tCenter">';
				str += '	<div style="margin: 3px;">';
				str += '		<button id="videoChk" class="videoSmyBtn btn_Dstyle">고속검색 영상확인</button>';
				str += '		<button id="exportVideo" class="videoSmyBtn btn_Dstyle">반 출</button>';
				str += '		<button id="editVideo" class="videoSmyBtn btn_Dstyle">수 정</button>';
				str += '	</div>';
				str += '</td>';
			}

			str +='<td class="tCenter">';
			if(reqGbn !="오프라인반출"){
				str +='	<div style="margin: 3px;">';
				str +='		<button style="width:80px;" class="btn_renew1 disableBtn btn_t btn_style2" mgrno="'+cctvMgrNo+'" dat="'+playLimitDat+'" rqst="'+rqstMgrSeq+'" avi="'+mgrSeq+'" file="'+vdwkFileSeq+'">연장신청</button>';
				str +='	</div>';
				str +='	<div style="margin: 3px;">';
				str +='		<button style="width:80px;" class="btn_renew2 disableBtn btn_t btn_style2" mgrno="'+cctvMgrNo+'" dat="'+playLimitDat+'" rqst="'+rqstMgrSeq+'" avi="'+mgrSeq+'" file="'+vdwkFileSeq+'">증거신청</button>';
				str +='	</div>';
			}
			str +='</td>';
			str +='</tr>';

		}

		$('#tviusView').find('#avi_list_body').html(str);

		$(".contentWrapper").find("#videoChk").click(function(){
			if ($(this).hasClass('btn_style2')){
				/*var token;
				var param = {
					"userId" : userId,
					"userPw" : userPw,
					"iat" : Date.prototype.timeStamp(), // 현재시간 "1587096873"
					"exp" : Date.prototype.timeStamp(7)  // 만료시간 "1587701673"
				};

				_common.callAjax("/tvius/makeToken.json", param, function(json) {
					token = json.result;
				}, false);*/

				var token;

				var param = {
					"userId" : userId,
					"userPwOr" : userPw,
				};

				_common.callAjax("/tvius/getToken.json", param, function(json) {
					token = json.result;
				}, false);

				window.open(VIDEO_SMY_URL+"/#/library/"+token);
			}
		});

		// 고속검색 사용 후 해당영상이 맞을 경우 반출 진행
		$(".contentWrapper").find("#exportVideo").click(function(){
			if ($(this).hasClass('btn_style2')){
				var param = {};
				param["mgrSeq"] = editMgrSeq;
				param["videoSmy"] = "C";


				if(confirm("반출을 신청하시겠습니까?")){
					_common.callAjax("/tvius/editRqst.json", param, function(json) {
						if(json.result){
							var _param = {};
							_param["rqstMgrSeq"] = editMgrSeq;
							_param["workStatCd"] = '12';

							_common.callAjax("/tvius/editWorkInfo.json", _param, function(json2) {
								if(json2.result){
									alert("* 신청되었습니다.");
								}
							});
						}
					});
				} else{
					return;
				}
			}
		});

		// 고속검색 사용 후 해당영상이 맞지 않을 경우 반출 수정
		$(".contentWrapper").find("#editVideo").click(function(){
			// 비디오써머리에 업로드했던 영상도 삭제..?

			if ($(this).hasClass('btn_style2')){
				var param = {};
				param["mgrSeq"] = editMgrSeq;
				param["procStatCd"] = "ED";

				if(confirm("반출 정보를 수정하시겠습니까?")){
					_common.callAjax("/tvius/editRqst.json", param, function(json) {
						if(json.result){
							var _param = {};
							_param["rqstMgrSeq"] = editMgrSeq;
							_param["bakStatCd"] = "B0";

							_common.callAjax("/tvius/editAviInfo.json", _param, function(json2) {
								if(json2.avi && json2.work){
									_common.callAjax("/tvius/getUsrTviusRqst.do", { 'rqstMgrSeq' : editMgrSeq, 'procStatCd' : "ED" }, function(view){
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
						}
					}, false);
				} else{
					return;
				}
			}
		});

	}

	function getAviList(){

		var _aviParam = {};
		_aviParam['rqstMgrSeq'] = Number(rqstMgrSeq);

		_common.callAjax("/tvius/getTransAvi.json", _aviParam, function(json) {

			if (json.result !== undefined){

				aviList = json.result;

			}

		}, false);

	}

	function aviRenewBtn(){

		var rqstMgrSeq = '';
		var aviMgrSeq='';
		var fileSeq = '';
		if(reqGbn=="차량번호"){
			$(".contentWrapper").find('#videoListView .btn_style2').removeClass('btn_style2').addClass('btn_Dstyle');
		}else{
			$(".contentWrapper").find('#videoListView .btn_style2').each(function(){

				var $thisBtn = $(this);

				var renewType	= $(this).text();
				rqstMgrSeq = Number($(this).attr('rqst'));
				aviMgrSeq = Number($(this).attr('avi'));
				fileSeq = Number($(this).attr('file'));
				var playDat = $(this).attr('dat');
				var cctvMgrNo = $(this).attr('mgrno');
				reType = "11";
				if ( renewType == "증거신청" ) reType="12";

				var _renewParam = {};
				_renewParam['rqstReqstId'] = userId;
				_renewParam['renewTyp'] = reType;
				//_renewParam['aviCctvMgrNo'] = cctvMgrNo;
				_renewParam['rqstMgrSeq'] = rqstMgrSeq;
				_renewParam['aviMgrSeq'] = aviMgrSeq;
				_renewParam['fileSeq'] = fileSeq;

				_common.callAjax("/tvius/getRenewList.json", _renewParam, function(json) {


					if (json.result !== undefined){

						if (json.result.length > 0){
							$thisBtn.removeClass('btn_style2');
							$thisBtn.addClass('btn_Dstyle');
						}

						if($(".contentWrapper").find('.btn_renew2[rqst='+rqstMgrSeq+'][avi='+aviMgrSeq+'][file='+fileSeq+']').hasClass('btn_Dstyle')){

							$(".contentWrapper").find('.btn_renew1[rqst='+rqstMgrSeq+'][avi='+aviMgrSeq+'][file='+fileSeq+']').removeClass('btn_style2').addClass('btn_Dstyle');

						}

					}

				}, false);

			});
		}
	}

	function setRowSpan(){
		$(".contentWrapper").find("#data_table").rowspanizer({
		    cols : [0, 1, 2],
		    vertical_align: "middle"
		});
	}

	function setPopDiv(){
		var str = '';

		str += ' <div id="drm_pop" style="display: none; width:333px; height:231px; margin-top:10px; background:#fff; border:1px solid #000;">';
		str += '	<div class="searchWrapper" style="margin-left: 10px; padding-bottom:0px;">';
		str += '		<div>';
		str += '			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="aviMgrSeq" name="aviMgrSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="fileSeq" name="fileSeq" value="">';
		str += '			<input type="hidden" class="sendData" id="renewTyp" name="renewTyp" value="">';
		str += '		</div>';
		str += '		<p class="searchTitle drmTitle"></p>';
		//str += '		<div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div>';
		str += '		<table cellspacing="0" width="100%">';
		str += '			<colgroup>';
		str += '				<col width="80" />';
		str += '				<col width="" />';
		str += '				<col width="100" />';
		str += '			</colgroup>';
		str += '			<tr>';
		str += '				<th>';
		str += '					<label>신청사유</label>';
		str += '				</th>';
		str += '				<td colspan="2"></td>';
		str += '			</tr>';
		str += '			<tr>';
		str += '				<td colspan="3">';
		str += '					<div class="inBox">';
		str += '						<textarea class="sendData" id="reqstResn" name="reqstResn" style="width: 96%; height: 57px;"></textarea>';
		str += '					</div>';
		str += '				</td>';
		str += '			</tr>';
		str += '		</table>';
		str += '		<div class="btnDiv" class="padding-bottom:5px;">';
		str += '			<button id="btn_save" class="btn_style2">신청</button>';
		str += '			<button id="btn_close" class="btn_style2">취소</button>';
		str += '		</div>';
		str += '	</div>';
		str += ' </div>';

		$(".contentWrapper").find('#videoListView').append(str);
	}

	$(".contentWrapper").find('#playerLink').click(function(){
    	_common.postForm.submit("/user/getPlayerFile.json", null);
	});

	$(".contentWrapper").find('#manualLink').click(function(){
    	_common.postForm.submit("/user/getPlayerManualFile.json", null);
	});


	$(".contentWrapper").find("#btn_all_img_download").click(function(){
		if(confirm("일괄 다운로드하시겠습니까?")){
			var arFileArray  = new Array();
			var sZipFileName = "capture.zip";

			$("#imgList").find(".img_down").each(function(){
				var obj={};
				obj.filename=$(this).attr("downnm");
				obj.url="./tvius/getImage.do?realNm="+$(this).attr("realnm");
				arFileArray.push(obj);
			})

			downloadZipFile(arFileArray, sZipFileName);
		}

	});

	/**
	 * 일괄 다운로드 클릭 시
	 */
	$(".contentWrapper").find("#btn_all_avi_download").click(function(){
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
	/*$(".contentWrapper").find("#btn_hash_download").click(function(){

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
		$table.find("th").css("font-weight", "bold").width("auto").height(30).css("border", "medium  solid black").css("background", "#0078d4");
		$table.find("td").css("text-align", "center").height(30).css("border", "medium  solid black");

		var data_type = 'data:application/vnd.ms-excel;charset=utf-8';
		var table_html = encodeURIComponent($table[0].outerHTML);

		var a = document.createElement('a');
		a.href = data_type + ',%EF%BB%BF' + table_html;
	    a.download = txt + '.xls';
	    a.click();
	    $(a).remove();

	});*/

