/**
 * 관리자 영상반출 신청현황 AVI 리스트 관련 이벤트 입니다.
 */


	var aviList = null;

	$(document).ready(function(){
		workChk();

		if($(".popupWrapper").find('#stat_nam').text().trim() == "승인대기") {
			$(".popupWrapper").find('.btn_edit').removeClass('btn_Dstyle').addClass('btn_style2');

		}

		if($('.btn_acpt').length != 0 ){
			$("#data_table > thead > tr:nth-child(2) > th:nth-child(4)").append('<button id="btn_all_acpt" class="btn_style2" rqstMgrSeq="'+rqstMgrSeq+'">일괄승인</button>');
			/**
			 * 일괄승인 버튼 클릭 시
			 */
			$(".popupWrapper").find("#btn_all_acpt").click(function(){
				var isPass = true;
				$('#avi_list_body > tr').each(function(){
					var orgLimitDat = $(this).find(".orgLimitDat").text().trim();
					var renewReqstDat = $(this).find(".renewReqstDat").text().trim();

					if(renewReqstDat == "" || renewReqstDat == null || renewReqstDat == undefined){
						return;
					}

					var limitDay = new Date(orgLimitDat);
					var renewReqstDay = new Date(renewReqstDat);

					limitDay.setHours(23);
					limitDay.setMinutes(59);

					if(renewReqstDay > limitDay){
						isPass = false;
					}
				});

				if(!isPass){
					alert("증거신청은 재생 만료일 이전에만 가능합니다.");
					return;
				}

				if(confirm("일괄 승인을 하겠습니까?")){
					var rqstMgrSeq = $(this).attr("rqstMgrSeq");

					$(".popupWrapper").find(".btn_acpt").each(function(){
						var _self=$(this);
						var rqstMgrSeq = $(this).attr("rqstmgrseq");
						var aviMgrSeq = $(this).attr("avimgrseq");
						var fileSeq = $(this).attr("fileseq");
						var mgrSeq = $(this).attr("mgrseq");

						var _acptParam = {};
						_acptParam['editTyp'] = 'acpt';
						_acptParam['mgrSeq'] = mgrSeq;
						_acptParam['rqstMgrSeq'] = rqstMgrSeq;
						_acptParam['aviMgrSeq'] = aviMgrSeq;
						_acptParam['fileSeq'] = fileSeq;
//						_acptParam['playLimitCnt'] =0;
//						_acptParam['playLimitDat'] = playLimitDat;
						_acptParam['acptUserId'] = userId;
						_acptParam['acptYn'] = 'Y';
						_acptParam['renewTyp'] = 12;

						_common.callAjax("/tvius/editRenew.json", _acptParam, function(json){
							if(json.result){

				        	}else{
				        		var fileNm=_self.parent().parent().find("td:nth-child(6) > a").text();
				        		alert(fileNm+" 파일은 승인에 실패했습니다.");
				        	}
						},false);

					});
					var _aviParam = {};
					_aviParam['rqstMgrSeq'] = rqstMgrSeq;
					_common.callAjax("/tvius/getMngTviusAviList.do", _aviParam, function(view) {

						$(".popupWrapper").find("#cctvList").html(view);

					});
				}

			});
		}

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
		$(".popupWrapper").find('.rslt_stat').remove();
		var Chk = false;
		var CompleteChk = false;

		getAviList();

		//분할될걸 감안해서 계속 그려주는게 맞는거임.
		//없애려는 생각 1도 하지 말기
		replaceList(aviList);
		setRowSpan();

		if($(".popupWrapper").find('#stat_nam').text().trim() == "승인대기") {

			$(".popupWrapper").find(".btn_edit").click(function(){
				if ($(this).hasClass('btn_style2')){

					var rqstMgrSeq = $(this).attr('rqst');
					var aviMgrSeq = $(this).attr('avi');
					var cctvMgrNo = $(this).attr('mgrno');
					var playLimitCnt = $(this).attr('cnt');
					var playLimitDat = $(this).attr('dat');
					var secIntv = $(this).closest('tr').find('td').eq(1).text() + ' ~ ' + $(this).closest('tr').find('td').eq(2).text();
					var cctvLabel = $(this).attr('cctvLabel');

					var _html = '<div class="editPopupWrapper">';
					_html += $('#add_target_pop').html();
					_html += '</div>';

					$("#detailPopupWrap").dialog("close").html(_html).dialog({
						title : "반출영상파일정보",
						width: 450,
						height: 330,
						modal: true,
						position: {
							my: "center",
							at: "center",
							of: $("body")
						},
						open: function(){
							$(".editPopupWrapper").find('#rqstMgrSeq').val(rqstMgrSeq);
							$(".editPopupWrapper").find('#mgrSeq').val(aviMgrSeq);
							$(".editPopupWrapper").find('#cctvLabel').text(cctvLabel);
							$(".editPopupWrapper").find('#cctvLabel').attr("cctvMgrNo", cctvMgrNo);
							$(".editPopupWrapper").find('#secIntv').text(secIntv);
							$(".editPopupWrapper").find('#playLimitCnt').val(playLimitCnt);
							$(".editPopupWrapper").find('#playLimitDat').val( Date.prototype.formatDate( playLimitDat.substring(0,8) ) );

							$(".editPopupWrapper").find("#btn_save").click(function() {

								var _editParam = _common.utils.collectSendData(".editPopupWrapper");

								if ( _common.utils.isEmpty(_editParam['playLimitCnt']) || _common.utils.isNumber(_editParam['playLimitCnt']) ){
									alert('* 횟수제한 값이 올바르지 않습니다.');
									return false;
								}

								_editParam['playLimitDat'] = _editParam['playLimitDat'].trim().replace(/\-/gi,'')+'235959';

								var limitDate = new Date(_editParam['playLimitDat']);
								var currDate = new Date();

								var limitDat = limitDate.getFullYear() + "" + dateTwo(limitDate.getMonth()+1) + "" + dateTwo(limitDate.getDate());
								var currDat = currDate.getFullYear() + "" + dateTwo(currDate.getMonth()+1) + "" + dateTwo(currDate.getDate());

								var datChk = (limitDat < currDat);

								if ( _common.utils.isEmpty(_editParam['playLimitDat']) || datChk ){
									alert('* 만료일 값이 올바르지 않습니다.');
									return false;
								}

								_common.callAjax("/tvius/editExpInfo.json", _editParam, function(json){
						        	if(json.result){
										alert('* 저장되었습니다.');
										$("#detailPopupWrap").dialog("close");
										$("#popupWrap").dialog("close");
//						        		$(".popupWrapper").find("#btn_list").click();

						        	}
						        });
							});
						},
						close: function(){
						}
					}).dialog("open");
				}
			});
		}

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
			var renewExtYn = aviList[i].renewExtYn;
			var renewEviYn = aviList[i].renewEviYn;

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

			if (rsltCd === null){

				/*$(".popupWrapper").find('.btn_edit[mgrno='+cctvMgrNo+']').removeClass('btn_Dstyle').addClass('btn_style2');
				CompleteChk = true;

				TODO 승인대기일때 횟수, 기간 수정 가능하게하려면 여기에 추가해야 함.
				*/
				//승인대기일 경우 목록을 갱신하지 않는다.
				//처리완료 역시 목록을 갱신하지 않는다.
				//Chk = false;
				//승인대기가 아니라 아직 백업프로세스에서 가져간게 아니므로 돌리는게 맞음

				/*$(".popupWrapper").find('.btn_edit[avi='+mgrSeq+'][rqst='+rqstMgrSeq+'][file=null]').removeClass('btn_Dstyle').addClass('btn_style2');
				CompleteChk = true;*/

				/*if($(".popupWrapper").find('#reqGbnCd').text() == '열람'){
					$(".popupWrapper").find('.btn_edit[avi='+mgrSeq+'][rqst='+rqstMgrSeq+'][file=null]').removeClass('btn_style2').addClass('btn_Dstyle');
				} else {
					$(".popupWrapper").find('.btn_edit[avi='+mgrSeq+'][rqst='+rqstMgrSeq+'][file=null]').removeClass('btn_Dstyle').addClass('btn_style2');
					CompleteChk = true;
				}*/

			}else if ( rsltCd != '18' && rsltCd != '' && ( rsltCd != '13' || rsltCd != '16' || rsltCd != '19' ) ) {
//				if($('#avi_list_body > tr:nth-child('+(i+1)+') > td:nth-child(6) > a').attr("class").contains('null')){
				if($('#avi_list_body > tr:nth-child('+(i+1)+') > td:nth-child(6) > a').hasClass('null')){
					$('#avi_list_body > tr:nth-child('+(i+1)+') > td:nth-child(6) > a').attr("class",'work_'+keyFileName);
					$('#avi_list_body > tr:nth-child('+(i+1)+') > td:nth-child(6) > div').attr("class",'pro_'+keyFileName);
				}

				$(".popupWrapper").find('.work_'+keyFileName).hide();
				$(".popupWrapper").find('.pro_'+keyFileName).show();

				$(".popupWrapper").find('.pro_'+keyFileName).attr("rslt", rsltCd);

				/*if ( rsltCd == '13' || rsltCd == '16' || rsltCd == '19' ) {
					$(".popupWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#999');
				} else {
					$(".popupWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#4baf4b');
				}*/
				//$(".popupWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#999');

				$(".popupWrapper").find('.pro_'+keyFileName).progressbar({
					value : rsltReq
				});

				$(".popupWrapper").find('.pro_'+keyFileName).find('.ui-widget-header').css('background-color', '#6dd66d');

				if ( rsltCd == '13' || rsltCd == '16' || rsltCd == '19' ) {
					$(".popupWrapper").find('.pro_'+keyFileName).css('background', '#d93e3e');
					$(".popupWrapper").find('.pro_'+keyFileName).css('border', '#d93e3e 1px solid');
				}

				if ( rsltCd == '13' || rsltCd == '16' || rsltCd == '19' ) {
//					Chk = false;
				} else {
//					Chk = true;
				}
//
				//Chk = true;
				//Chk = false;

				$(".popupWrapper").find('.pro_'+keyFileName).append('<span class="rslt_stat" style="position: absolute;top: 2px; left: 45%; ">'+rsltMsg+'</span>');//#444
			} else if (rsltCd.trim() == '' ){
				$(".popupWrapper").find('.work_'+keyFileName).show();
				$(".popupWrapper").find('.work_'+keyFileName).text("");

				$(".popupWrapper").find('.pro_'+keyFileName).hide();

//				Chk = true;
//				$(".popupWrapper").find('.btn_edit[mgrno='+cctvMgrNo+']').removeClass('btn_style2').addClass('btn_Dstyle');
			} else if ( rsltCd == '13' || rsltCd == '16' || rsltCd == '19' ){

				$(".popupWrapper").find('.work_'+keyFileName).show();
				$(".popupWrapper").find('.work_'+keyFileName).text("영상 반출 실패!");

				$(".popupWrapper").find('.btn_edit[mgrno='+cctvMgrNo+']').removeClass('btn_style2').addClass('btn_Dstyle');
				$(".popupWrapper").find('.pro_'+keyFileName).hide();

//				Chk = false;

			} else if ( rsltCd == "18"  ){

				$(".popupWrapper").find('.work_'+keyFileName).show();
				$(".popupWrapper").find('.work_'+keyFileName).attr('downcnt', downCnt);
				$(".popupWrapper").find('.work_'+keyFileName).attr('filenm', fileName);

				if($(".popupWrapper").find('.work_'+keyFileName).hasClass("isRenewY")){
					$(".popupWrapper").find('.work_'+keyFileName).text(ufileName+".AVI");
				}else{
					$(".popupWrapper").find('.work_'+keyFileName).text(ufileName+".MS4");
				}

				if (renewExtYn == "N" && renewEviYn == "N"){
					//$(".popupWrapper").find('.btn_edit[avi='+mgrSeq+'][rqst='+rqstMgrSeq+'][file='+fileSeq+']').removeClass('btn_Dstyle').addClass('btn_style2');
					$(".popupWrapper").find('.btn_edit[mgrno='+cctvMgrNo+']').removeClass('btn_style2').addClass('btn_Dstyle');
				}

				$(".popupWrapper").find('.pro_'+keyFileName).remove();

				if(SYSTEM_SMI_YN == "Y") {

					$(".popupWrapper").find('.smi_'+keyFileName).show();
					$(".popupWrapper").find('.smi_'+keyFileName).attr('downcnt', downCnt);
					$(".popupWrapper").find('.smi_'+keyFileName).attr('filenm', fileName.replace(".MS4", ".smi"));

					var extension = ".smi";

					$(".popupWrapper").find('.smi_'+keyFileName).text(ufileName + extension);
				}

				CompleteChk = true;
//				Chk = false;

			} else {
//				Chk =false;

			}


			if(rsltCd == null || rsltCd.trim() == "" || rsltCd == 11 || rsltCd == 12 || rsltCd == 14 || rsltCd == 15 || rsltCd == 17 ){
				Chk =true;
			}


			/*"B1";"일반실패"
			"B2";"백업성공"
			"B4";"백업중 알수없는 오류로 실패하였습니다."
			"B5";"백업하려는 카메라가 존재하지 않습니다."
			"B6";"시간,종료시간이 같거나 미래입니다."
			"B7";"알수없는 이유로 백업을 시작할 수 없습니다."
			"B8";"백업 결과파일이 존재하지 않습니다."
			"B9";"백업 결과파일의 용량이 너무 작습니다."*/


			/*if ( rsltEmpty == -1 ) {
				$(".popupWrapper").find('.pro_'+keyFileName).remove();
				$(".popupWrapper").find('.work_'+keyFileName).replaceWith("<span>영상파일이 존재하지 않습니다.</span>");

			}*/
		}

		if($(".popupWrapper").find('#stat_nam').text().trim() == "승인대기" || $(".popupWrapper").find('#stat_nam').text().trim() == "처리완료" || $(".popupWrapper").find('#stat_nam').text().trim() == "승인거부") {
			Chk = false;
		}

		//aviRenewBtn();

		if ( Chk == true ) {
			intervalListChk = setTimeout('workChk()', 2000);
		}

		if ( CompleteChk ){

			$(".popupWrapper").find('.avi_down').css('font-weight','bold');

			$(".popupWrapper").find('.avi_down').mouseenter(function(){
				$(this).css("cursor","pointer");
				$(this).css("text-decoration","underline");
			});

			$(".popupWrapper").find('.avi_down').mouseleave(function(){
				$(this).css("text-decoration","none");
			});

			$(".popupWrapper").find('.smi_down').css('font-weight','bold');

			$(".popupWrapper").find('.smi_down').mouseenter(function(){
				$(this).css("cursor","pointer");
				$(this).css("text-decoration","underline");
			});

			$(".popupWrapper").find('.smi_down').mouseleave(function(){
				$(this).css("text-decoration","none");
			});

			$(".popupWrapper").find('.avi_down').click(function(){

				var _param = {};
				var userId = $('#reqstId').text();
//				_param['userId'] = userId

				var reqGbn = $(".popupWrapper").find('#reqGbnCd').text();
				_param['fileNm'] = userId + "/" + $(this).attr('filenm');
				if(reqGbn == "차량번호") _param['fileNm'] = $(this).attr('filenm');
				_param['reqGbn'] = reqGbn;
				if($(this).parent().parent().find("#isRenewY").length >0){
					_param["isRenew"]='y';
				}

				// 관리자가 다운로드 받을때는 다운로드 횟수가 늘지 않음
				_param["isMng"] = 'Y';

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
								if(reqGbn != "차량번호"){
									_param['fileNm'] = _param['fileNm'].split('/')[1];
								}
								_param['userId'] = userId;
								_param['sub'] = userId + "\\";
								_param['path'] = json.strPath;
								_param['downFileNm'] = json.downFileNm.replace(/\;/gi, '_').replace(/\,/gi,"_");
								_param['auth'] = "A";

								//s(_param);
								//return false;
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

			$(".popupWrapper").find('.smi_down').click(function(){
				var reqGbn = $(".popupWrapper").find('#reqGbnCd').text();

				var _param = {};
				_param['userId'] = $(".popupWrapper").find('#reqstId').text();
				_param['fileNm'] = $(".popupWrapper").find('#reqstId').text() + "/" + $(this).attr('filenm').replace(".smi", ".MS4");
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
								_param['sub'] = $(".popupWrapper").find('#reqstId').text() + "\\";
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
		var str = '';
		for(var i=0; i<aviList.length; i++){

			var cctvLabel = aviList[i].cctvLabel;
			var cctvMgrNo = aviList[i].cctvMgrNo;
			var secStDat = Date.prototype.formatDate(aviList[i].secStDat.trim());
			var secEdDat = Date.prototype.formatDate(aviList[i].secEdDat.trim());
			var playLimitCnt =aviList[i].playLimitCnt;
			var orgPlayLimitDat =aviList[i].aviPlayLimitDat;

			var renewPlayLimitCnt = aviList[i].renewPlayLimitCnt;
			var renewPlayLimitDat = aviList[i].renewPlayLimitDat;

			var expAviPw = aviList[i].expAviPw;
			var aviContsId = aviList[i].aviContsId;
			//var bakStatCd = aviList[i].bakStatCd;
			var rqstMgrSeq = aviList[i].rqstMgrSeq;
			var mgrSeq = aviList[i].mgrSeq;
			var vdwkFileSeq = aviList[i].vdwkFileSeq;
			//var key = aviList[i].key.text();
			var realRowKey = mgrSeq+'_'+rqstMgrSeq+'_'+vdwkFileSeq;

			var playLimitDat = '';
			if ( orgPlayLimitDat != null && orgPlayLimitDat.trim() != '0' ){
				playLimitDat = Date.prototype.formatDate(orgPlayLimitDat.trim().substring(0,8));
			} else {
				playLimitDat = '-';
			}

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

			if( maskingYn == "Y"){
			str +='<td class="tCenter">';
				if (aviList[i].maskChk != null && aviList[i].maskChk != "0"){
			str +='O';
				} else {
			str +='X';
				}
			str +='</td>';
			}

			var reqGbnCdNm = $(".popupWrapper").find('.searchWrapper').find('#reqGbnCd').text();

			var downClass = '';
			if(reqGbnCdNm != "오프라인반출") downClass="avi_down";
			str +='<td allign="center" style="padding: 5px;">';
			str +='<div class="progress pro_'+realRowKey+'" style="position:relative; min-width:280px; height:20px;"></div>';
			str +='<a key="'+realRowKey+'" class="'+downClass+' work_'+realRowKey+'" target="_blank" style="color:#7780ff;"></a>';
			if(SYSTEM_SMI_YN == "Y") {
				str +='</br><a key="'+realRowKey+'" class="smi_down smi_'+realRowKey+'" target="_blank" style="color:#7780ff;" ></a>';
			}
			str +='</td>';
			str +='<td class="tCenter">';
			if(reqGbnCdNm != "오프라인반출"){
				str +='<button class="btn_edit btn_Dstyle" cnt="'+playLimitCnt+'" mgrno="'+cctvMgrNo+'" dat="'+orgPlayLimitDat+'" cctvLabel="'+cctvLabel+'" rqst="'+rqstMgrSeq+'" avi="'+mgrSeq+'">수정</button>';
			}

			str +='</td>';
			str +='</tr>';

		}
		$('.popupWrapper').find('#avi_list_body').html(str);

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

	/**
	 * 데이터 글자가 1글자이면 문자앞에 '0'텍스트를 포함한다.
	 *
	 * @param str
	 * @returns {String}
	 */
	function dateTwo(str){
		str = String(str);
		if ( str.length == 1 ){
			str = '0'+str;
		}
		return str;
	}

	function setRowSpan(){
		$(".popupWrapper").find("#data_table").rowspanizer({
		    cols : [0, 1, 2],
		    vertical_align: "middle"
		});
	}

	function setEditBtn(){

		$(".popupWrapper").find('.btn_edit').each(function(){

			$thisBtn = $(this);

			var rqstMgrSeq = $(this).attr('rqst');
			var aviMgrSeq = $(this).attr('avi');
			var fileSeq = $(this).attr('file');

			var _renewParam = {};
			_renewParam['renewTyp'] = '12';
			_renewParam['rqstMgrSeq'] = rqstMgrSeq;
			_renewParam['aviMgrSeq'] = aviMgrSeq;
			_renewParam['fileSeq'] = fileSeq;

			_common.callAjax("/tvius/getRenewList.json", _renewParam, function(json) {

				if (json.result !== undefined){

					if (json.result.length > 0){
						$thisBtn.attr('evi', 'Y');
					}
				}

			}, false);

		});

	}
	/**
	 * 증거신청 승인
	 */
	$(".popupWrapper").find(".btn_acpt").click(function(){
		var orgLimitDat = $(this).parent().parent().find(".orgLimitDat").text().trim();
		var renewReqstDat = $(this).parent().parent().find(".renewReqstDat").text().trim();
		var limitDay = new Date(orgLimitDat);
		limitDay.setHours(23);
		limitDay.setMinutes(59);

		var renewReqstDay = new Date(renewReqstDat);

		if(renewReqstDay > limitDay){
			alert("증거신청은 재생 만료일 이전에만 가능합니다.");
			return;
		}



		var mgrSeq = $(this).attr("mgrSeq");
		var rqstMgrSeq = $(this).attr("rqstmgrseq");
		var aviMgrSeq = $(this).attr("avimgrseq");
		var fileSeq = $(this).attr("fileseq");

		var _acptParam = {};
		_acptParam['editTyp'] = 'acpt';
		_acptParam['mgrSeq'] = mgrSeq;
		_acptParam['rqstMgrSeq'] = rqstMgrSeq;
		_acptParam['aviMgrSeq'] = aviMgrSeq;
		_acptParam['fileSeq'] = fileSeq;
//		_acptParam['playLimitCnt'] = playLimitCnt;
//		_acptParam['playLimitDat'] = playLimitDat;
		_acptParam['acptUserId'] = userId;
		_acptParam['acptYn'] = 'Y';
		_acptParam['renewTyp'] = 12;

		_common.callAjax("/tvius/editRenew.json", _acptParam, function(json){
			if(json.result){

				alert('증거신청 되었습니다.');
//				$("#detailPopupWrap").dialog("close");
				var _aviParam = {};
				_aviParam['rqstMgrSeq'] = rqstMgrSeq;
				_common.callAjax("/tvius/getMngTviusAviList.do", _aviParam, function(view) {

					$(".popupWrapper").find("#cctvList").html(view);

				});


        	}
		});
//		//alert('btn_acpt ' + $(this).attr('mgrseq'));
//		var _this = $(this);
//		var renewTyp = 12;
//		var _html = '';
//		_html += '<div class="detailPopupWrapper">';
//		_html += '	<div id="acpt_pop"> ';
//		_html += '		<div class="searchWrapper">';
////		if ( renewTyp == "11"){
////		_html += '        <p class="searchTitle">연장신청 승인</p> ';
////		} else {
////		_html += '        <p class="searchTitle">증거자료신청 승인</p> ';
////		}
//		_html += '		<div>';
//		_html += '			<input type="hidden" class="sendData" id="mgrSeqAcpt" name="mgrSeq" value="">';
//		_html += '			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">';
//		_html += '			<input type="hidden" class="sendData" id="aviMgrSeq" name="aviMgrSeq" value="">';
//		_html += '			<input type="hidden" class="sendData" id="fileSeq" name="fileSeq" value="">';
//		_html += '			<input type="hidden" class="sendData" id="aviPlayLimitDat" name="aviPlayLimitDat" value="">';
//		_html += '		</div>';
//		//_html += '        <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> ';
//		_html += '        <table cellspacing="0" width="100%"> ';
////		_html += '            <colgroup> ';
////		_html += '                <col width="80" /> ';
////		_html += '	            <col width="80" /> ';
////		_html += '	            <col width="80" /> ';
////		_html += '	            <col width="80" /> ';
////		_html += '            </colgroup> ';
//		_html += '            <tr> ';
//		_html += '                <th> ';
//		_html += '                    <label>만료추가</label> ';
//		_html += '                </th> ';
//		_html += '                <td class="tCenter"> ';
//		_html += '	                <div class="inBox"> ';
//		_html += '	                    <input type="text" size="3" maxlength="2" id="cntAdd" name="cntAdd" style="width: 50px; padding-left: 5px;" value=""> 회 ';
//		_html += '	                </div> ';
//		_html += '	            </td> ';
//		if ( renewTyp == "11" ) {
//		_html += '                <td class="tCenter"> ';
//		_html += '                    <div class="inBox"> ';
//		_html += '                        <input type="text" size="3" maxlength="2" id="datAdd" name="datAdd" style="width: 50px; padding-left: 5px;" value=""> 일 ';
//		_html += '                    </div> ';
//		_html += '                </td> ';
//		} else {
//		_html += '                <td style="border-left:none;"> ';
//		_html += '                </td> ';
//		}
//		_html += '	            <td class="tCenter"> ';
//		_html += '	                <button id="btn_save" class="btn_style2 btn_style">저장</button> ';
////		_html += '	                <button id="btn_close" class="btn_style2 btn_Dstyle2">취소</button> ';
//		_html += '	            </td> ';
//		_html += '            </tr> ';
//		_html += '        </table> ';
//		_html += '        <div style="margin-top : 10px;"> ';
//		if ( renewTyp == "11") {
//		_html += '	        <div>* 연장신청 횟수와 만료일 제한 값은 각각 <b style="color:red">99회, 99일</b> 입니다.</div> ';
//		} else {
//		_html += '	        <div>* 증거자료신청 횟수 제한은 <b style="color:red">99회</b> 입니다.</div> ';
//		}
//
//		_html += '	    </div> ';
//		_html += '    </div> ';
//		_html += '	</div>';
//		_html += '</div> ';
//
//
//		$("#detailPopupWrap").dialog("close").html(_html).dialog({
//			title : '증거자료신청 승인',
//		    width: 530,
//			height: 200,
//			modal: true,
//			position: {
//				my: "center",
//				at: "center",
//				of: $(".popupWrapper")
//			},
//			open: function(){
//				var mgrSeq = _this.attr('mgrseq');
//				var rqstMgrSeq = _this.attr('rqstmgrseq');
//				var aviMgrSeq = _this.attr('avimgrseq');
//				var fileSeq = _this.attr('fileseq');
//				var aviPlayLimitDat = _this.attr('limdat');
//
//				_common.callAjax("/sysMng/getSysParam.json", null, function(json){
//
//					$(".detailPopupWrapper").find('#mgrSeqAcpt').val(mgrSeq);
//					$(".detailPopupWrapper").find('#rqstMgrSeq').val(rqstMgrSeq);
//					$(".detailPopupWrapper").find('#aviMgrSeq').val(aviMgrSeq);
//					$(".detailPopupWrapper").find('#fileSeq').val(fileSeq);
//					$(".detailPopupWrapper").find('#aviPlayLimitDat').val(aviPlayLimitDat);
//
//					if(renewTyp == "11"){
//
//						$(".detailPopupWrapper").find('#cntAdd').val(json.result[0]['tvius.avi_play_cnt']);
//						$(".detailPopupWrapper").find('#datAdd').val(json.result[0]['tvius.avi_play_dat']);
//
//					} else {
//						$(".detailPopupWrapper").find('#cntAdd').val(json.result[0]['tvius.evi_play_cnt']);
//					}
//
//
//				});
//				/*
//				 * 저장 클릭
//				 */
//				$(".detailPopupWrapper").find("#acpt_pop").find("#btn_save").click(function(e) {
//					var mgrSeq = $(".detailPopupWrapper").find('#mgrSeqAcpt').val();
//					var rqstMgrSeq = $(".detailPopupWrapper").find('#rqstMgrSeq').val();
//					var aviMgrSeq = $(".detailPopupWrapper").find('#aviMgrSeq').val();
//					var fileSeq = $(".detailPopupWrapper").find('#fileSeq').val();
//					var aviPlayLimitDat = $(".detailPopupWrapper").find('#aviPlayLimitDat').val();
//
//					var playLimitCnt = Number($(".detailPopupWrapper").find('#cntAdd').val());
//					if( _common.utils.isNullAndEmpty(playLimitCnt) || !_common.utils.isNumber(playLimitCnt) ){
//						alert('* 횟수 제한 입력 값을 확인하여 주십시오.');
//						$(".detailPopupWrapper").find('#cntAdd').focus();
//						return false;
//					}
//
//					if(renewTyp == "11"){
//						var playLimitDat = Number($(".detailPopupWrapper").find('#datAdd').val());
//						if( _common.utils.isNullAndEmpty(playLimitDat) || !_common.utils.isNumber(playLimitDat) ){
//							alert('* 기간 제한 입력 값을 확인하여 주십시오.');
//							$(".detailPopupWrapper").find('#datAdd').focus();
//							return false;
//						}
//					}
//
//					if (renewTyp == "11") {
//						playLimitDat = DateAdd(aviPlayLimitDat, playLimitDat);
//
//					} else {
//						playLimitDat = "0";
//					}
//
//					var _acptParam = {};
//					_acptParam['editTyp'] = 'acpt';
//					_acptParam['mgrSeq'] = mgrSeq;
//					_acptParam['rqstMgrSeq'] = rqstMgrSeq;
//					_acptParam['aviMgrSeq'] = aviMgrSeq;
//					_acptParam['fileSeq'] = fileSeq;
////					_acptParam['playLimitCnt'] = playLimitCnt;
////					_acptParam['playLimitDat'] = playLimitDat;
//					_acptParam['acptUserId'] = userId;
//					_acptParam['acptYn'] = 'Y';
//					_acptParam['renewTyp'] = renewTyp;
//
//					_common.callAjax("/tvius/editRenew.json", _acptParam, function(json){
//						if(json.result){
//
//							alert('* 저장되었습니다.');
//							$("#detailPopupWrap").dialog("close");
//							var _aviParam = {};
//							_aviParam['rqstMgrSeq'] = rqstMgrSeq;
//							_common.callAjax("/tvius/getMngTviusAviList.do", _aviParam, function(view) {
//
//								$(".popupWrapper").find("#cctvList").html(view);
//
//							});
//
//
//			        	}
//					});

//				});
//
//
//			},
//			close: function(){
//
//			}
//		}).dialog("open");

//		_common.callAjax("/sysMng/getSysParam.json", null, function(json){
//
//			$(".popupWrapper").find('#mgrSeqAcpt').val(mgrSeq);
//			$(".popupWrapper").find('#rqstMgrSeq').val(rqstMgrSeq);
//			$(".popupWrapper").find('#aviMgrSeq').val(aviMgrSeq);
//			$(".popupWrapper").find('#fileSeq').val(fileSeq);
//			$(".popupWrapper").find('#aviPlayLimitDat').val(aviPlayLimitDat);
//
//			if(renewTyp == "11"){
//
//				$(".popupWrapper").find('#cntAdd').val(json.result[0]['tvius.avi_play_cnt']);
//				$(".popupWrapper").find('#datAdd').val(json.result[0]['tvius.avi_play_dat']);
//
//			} else {
//				$(".popupWrapper").find('#cntAdd').val(json.result[0]['tvius.evi_play_cnt']);
//			}
//
//			$(".popupWrapper").find("#acpt_pop").bPopup({appendTo: $(".popupWrapper")});
//
//		});

	});


	/**
	 * 증거신청 거절
	 */
	$(".popupWrapper").find(".btn_rejt").click(function(){

		var renewTyp = 12;
		var _html = '';
		_html += '<div class="detailPopupWrapper">';

		_html += '    <div id="rejt_pop"> ';
		_html += '    <div class="searchWrapper"> ';
//		_html += '        <div> ';
//		if ( renewTyp == "11"){
//		_html += '        	<p class="searchTitle" style="color:white;display: inline-block;margin-top: 12px;">연장신청 거절</p> ';
//		} else {
//		_html += '        	<p class="searchTitle" style="color:white;display: inline-block;margin-top: 12px;">증거자료신청 거절</p> ';
//		}
//		_html += '        <img id="btn_close" src="/xeus/res/img/close_btn.png" style="float: right; padding-top: 10px; cursor:pointer;"> ';
//		_html += '   		</div> ';
		_html += '		<div>';
		_html += '			<input type="hidden" class="sendData" id="mgrSeq" name="mgrSeq" value="">';
		_html += '		</div>';
		//_html += '        <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> ';
		_html += '        <table cellspacing="0" width="100%"> ';
//		_html += '            <colgroup> ';
//		_html += '                <col width="80" /> ';
//		_html += '	            <col width="" /> ';
//		_html += '	            <col width="140" /> ';
//		_html += '            </colgroup> ';
		_html += '            <tr> ';
//		_html += '                <th> ';
//		_html += '                    <label>거절사유</label> ';
//		_html += '                </th> ';
//		_html += '                <td colspan="2"> ';
//		_html += '                </td> ';
//		_html += '            </tr> ';
//		_html += '            <tr> ';
//		_html += '	            <td colspan="3"> ';
//		_html += '	                <div class="inBox"> ';
//		_html += '	                    <textarea  class="sendData" id="rejtResn" name="rejtResn"></textarea> ';
//		_html += '	                </div> ';
//		_html += '	            </td> ';
		_html += '				<div class="box_style"> ';
		_html += '					<div class="info_box wd100">';
		_html += '						<span class="title">거절사유</span>';
		_html += '						<textarea  class="sendData" id="rejtResn" name="rejtResn"></textarea> ';
		_html += '					</div>';
		_html += '				</div> ';
		_html += '	        </tr> ';
		_html += '        </table> ';
		_html += '        <div style="margin-top: 7px;"> ';
		_html += '            <div style="color:white">* 거절 사유는 <b style="color:red;">최대 200글자 입니다.</b></div> ';
		_html += '        </div> ';
		_html += '        <div class="btnDiv"> ';
		_html += '            <button id="btn_save" class="btn_style2 btn_style"> 저 장 </button> ';
		_html += '        </div> ';
		_html += '    </div> ';
		_html += '</div> ';
		var mgrSeq = $(this).attr('mgrseq');

		$("#detailPopupWrap").dialog("close").html(_html).dialog({
			title : '증거자료신청 거절',
		    width: 530,
			height: 220,
			modal: true,
			position: {
				my: "center",
				at: "center",
				of: $(".popupWrapper")
			},
			open: function(){
				$(".detailPopupWrapper").find('#mgrSeq').val(mgrSeq);


				$(".detailPopupWrapper").find("#rejt_pop").find("#btn_save").click(function(e) {
					var rejtResn = $(".detailPopupWrapper").find('#rejtResn').val();
					var mgrSeq = $(".detailPopupWrapper").find('#mgrSeq').val();

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

			        		$("#detailPopupWrap").dialog("close");
							var _aviParam = {};
							_aviParam['rqstMgrSeq'] = rqstMgrSeq;
							_common.callAjax("/tvius/getMngTviusAviList.do", _aviParam, function(view) {

								$(".popupWrapper").find("#cctvList").html(view);

							});
			        	}
					});

				});
			},
			close: function(){

			}
		}).dialog("open");
	});



