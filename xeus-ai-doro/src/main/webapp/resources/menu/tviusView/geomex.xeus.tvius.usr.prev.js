
var counterCnt = 5*60;

var openerBtn = null;

//윈도우창 종료
//$(document).on('click', '#prev_close', function(){
$('#prev_close').click(function(){
	clearTimeout(intervalPrevDown);
	$("#prev_pop").dialog("close");
	//$("#prev_pop").bPopup().close();
});

/**
 * toDayRqstChk함수를 호출하여 금일 해당 cctv건수에 대한 조회를 한다.
 */
//$(document).on('click', '#prev_add', function(){
$('#prev_add').click(function(){

	addPrev();
	aviReady();
});


/**
 * 이미 영상반출이 신청된 번호인지를 체크한다.
 *
 */
function prevRqstChk(obj){

	openerBtn = obj;
	counterCnt = PREV_COUNTER_CNT;

	_prevParam = {};
	_prevParam['mgrSeq'] = Number($('#prev_pop #prev_attr').attr('mgr_seq'));
	_prevParam['reqstId'] = $('#prev_pop #prev_attr').attr('reqst_id');

	_common.callAjax("/tvius/getPrevRqst.json", _prevParam, function(json) {

		if (json.result.length == 1){
			if(json.result[0].procStatCd == "SA" || json.result[0].procStatCd == "SN" || json.result[0].procStatCd == "SK"){

				$('#file_down').html('');
				aviReady();

			} else if (json.result[0].procStatCd == "SF"){

				$('#1_msg').empty();
				$('#1_msg').append('<p>* 미리보기 영상 추출 실패!</p>');
			}

		} else if (json.result.length > 1){
			$('#1_msg').empty();
			$('#1_msg').append('<p>* System Error!!!</p>');
		}

	}, false);

}

function addPrev(){

	var cctv_mgr_no = $('#prev_pop').find('#prev_attr').attr('cctv_mgr_no');
	var s_date = $('#prev_pop').find('#prev_attr').attr('s_date').replace(/\-/gi, '');
	var s_time = $('#prev_pop').find('#prev_attr').attr('s_time');
	var s_min = $('#prev_pop').find('#prev_attr').attr('s_min');
	var mgr_seq = $('#prev_pop').find('#prev_attr').attr('mgr_seq');

	var vn_day1 = new Date( s_date.substring(0, 4), Number(s_date.substring(4, 6))-1, Number(s_date.substring(6)), Number(s_time), Number(s_min) );
	vn_day1.setMinutes(vn_day1.getMinutes()-Number(SYSTEM_AVI_PLAY_TIME) );
	var st_yy = vn_day1.getFullYear();
	var st_mm = dateTwo(String(vn_day1.getMonth()+1));
	var st_dd = dateTwo(String(vn_day1.getDate()));
	var st_hh = dateTwo(String(vn_day1.getHours()));
	var st_m=dateTwo(String( vn_day1.getMinutes()));

	var vn_day2 = new Date(s_date.substring(0, 4), Number(s_date.substring(4, 6))-1, Number(s_date.substring(6)), Number(s_time), Number(s_min) );
	vn_day2.setMinutes(vn_day2.getMinutes()+Number(SYSTEM_AVI_PLAY_TIME) );

	var ed_yy = vn_day2.getFullYear();
	var ed_mm = dateTwo(String(vn_day2.getMonth()+1));
	var ed_dd = dateTwo(String(vn_day2.getDate()));
	var ed_hh = dateTwo(String(vn_day2.getHours()));
	var ed_m= dateTwo(String(vn_day2.getMinutes()));

	if ( st_mm == '00' ) st_mm = '12';
	if ( ed_mm == '00' ) ed_mm = '12';

	var sec_st_dat = st_yy+st_mm+st_dd+st_hh+st_m+ '00';//   tybis는 초단위 넣으면 안됨.
	var sec_ed_dat = ed_yy+ed_mm+ed_dd+ed_hh+ed_m+ '00';//   tybis는 초단위 넣으면 안됨.


	var date = new Date();
	var play_limit_dat = date.getFullYear()+''+dateTwo(date.getMonth()+1)+''+dateTwo(date.getDate()+1)+''+dateTwo(date.getHours())+'00';


	var _rqstParam = {};
	_rqstParam['mgrSeq'] = Number( mgr_seq );
	_rqstParam['reqstId'] = userId;

	_common.callAjax("/tvius/addPrevRqst.json", _rqstParam, function(json) {

		if (!json.result) console.log('* An error has occurred.');

	}, false);

	var _aviParam = {};

	_aviParam['mgrSeq'] = 1;
	_aviParam['rqstMgrSeq'] = Number(mgr_seq);
	_aviParam['cctvMgrNo'] = cctv_mgr_no;
	_aviParam['playLimitCnt'] = 1;//한번만 재생
	_aviParam['playLimitDat'] = play_limit_dat;//하루만 재생
	_aviParam['secStDat'] = sec_st_dat;
	_aviParam['secEdDat'] = sec_ed_dat;
	_aviParam['hddSerial'] = 'hddSerial';
	_aviParam['macSerial'] = 'macSerial';
	_aviParam['bakStatCd'] = 'B0';

	_common.callAjax("/tvius/addPrevAvi.json", _aviParam, function(json) {

		if (json.result){
			alert( "* 영상 추출 하기 전까지 시스템을 종료하시면 안됩니다." );
		} else {
			alert( "* 미리보기 영상 추출 실패!");
			$("#prev_pop").dialog("close");
			//$("#prev_pop").bPopup().close();
		}

	}, false);

}

function aviReady(){

	var s_date = $('#prev_pop #prev_attr').attr('s_date').replace(/\-/gi, '');
	var s_time = $('#prev_pop #prev_attr').attr('s_time');
	var s_min = $('#prev_pop #prev_attr').attr('s_min');

	$('#1_msg').hide();
	$('#2_msg').show();

	$('.btnDiv').css('margin-top', '20px');
	$('#prev_add').hide();

	var msg_date = '* 미리보기 영상 시작/종료 시간은 '+(s_date.substring(0, 4)+'-'+s_date.substring(4, 6)+'-'+s_date.substring(6, 8)+' '+s_time+'시 '+s_min+'분 전후 '+SYSTEM_AVI_PLAY_TIME+'분 입니다.');
	$('#2_msg #stand_date').text(msg_date);

	aviDown();
}

/**
 * 1초마다 재귀호출 되면서 영상반출 작업의 상태를 체크한다.
 */
function aviDown(){

	_prevParam = {};
	_prevParam['mgrSeq'] = Number( $('#prev_pop #prev_attr').attr('mgr_seq') );
	_prevParam['reqstId'] = userId;

	_common.callAjax("/tvius/getPrevRqst.json", _prevParam, function(json) {

		if( json.result !== undefined){

			if (json.result.length == 1){

				if (json.result[0].procStatCd == 'SK'){
					aviLoad();
				} else{
					aviCounter();
					var workChkVal = workChk();

					if (workChkVal){
						intervalPrevDown = setTimeout("aviDown()", 1000);
					}
				}

			}
		}

	}, false);

}

/**
 * 미리보기 영상반출이 성공적으로 처리되면 호출된다.
 */
function aviLoad(){

	var str = '';

	var _aviParam = {};
	_aviParam['rqstMgrSeq'] = Number( $('#prev_pop #prev_attr').attr('mgr_seq') );
	_common.callAjax("/tvius/getPrevAvi.json", _aviParam, function(json) {

		if (json.result !== undefined){
			if (json.result.length == 1){

				$('#file_down').html('');

				var filePath= json.result[0].vdwkFileNm.split('/');
				var folder = filePath[0];
				var fileName= filePath[1];
				var ufileName = json.result[0].cctvNoRelLabel+'_'+json.result[0].vdwkSecStDat+'_'+json.result[0].vdwkSecEdDat + ".MS4";
				str += '<span>* 미리보기 영상 추출이 완료 되었습니다. </span>';

				str += '<a id="avi_down" target="_blank" downcnt="0" style="font-weight: bold; cursor: pointer; text-decoration: none;" userid="'+folder+'" filenm="'+fileName+'"><button id="info_btn" style="width:80px;" class="grayBtn info_btn">다운로드</button></a>';
				$('#file_down').append(str);

				$('#avi_down').click(function(){

					var _param = {};
					_param['sub'] = $(this).attr('userid') + "\\";
					_param['path'] = SYSTEM_STORAGE_PATH;
					_param['fileNm'] = $(this).attr('filenm');//진짜 파일명
					_param['downFileNm'] = ufileName;//보일 파일명
					_param['auth'] = "A";

					_common.postForm.submit("/tvius/getFiles.json", _param);


				});

			}
		}

	});

}

/**
 * 경과 시간 카운트를 센다.
 */
function aviCounter(){

	var mgr_seq = $('#prev_pop #prev_attr').attr('mgr_seq');

	var $openMgr = $('#'+mgr_seq+'_avi');

	if ( $openMgr.length != 0 && $openMgr.val() != '' ) {
		counterCnt = $openMgr.val();
	}

	if (counterCnt < 1) {
		counterCnt = PREV_COUNTER_CNT;
		alert(' * 시간초과!! \n다시 시도하여 주십시오. ');
		clearTimeout(intervalPrevDown);
		$("#prev_pop").dialog("close");
		//$("#prev_pop").bPopup().close();
	}

	$("#counter_time").text(aviZero(parseInt( (300-counterCnt) /60))+":"+aviZero(parseInt( (300-counterCnt)%60)));
	counterCnt--;

	$openMgr.val(counterCnt);

	openerBtn.attr('counter', counterCnt);

}

/**
 * 미리보기 영상파일의 존재여부를 확인한다.
 */
function workChk(){

	var chkVal = true;

	var mgr_seq = $('#prev_pop #prev_attr').attr('mgr_seq');

	var _aviParam = {};
	_aviParam['rqstMgrSeq'] = Number( mgr_seq );
	_aviParam['mgrSeq'] = 1;

	_common.callAjax("/tvius/getPrevAvi.json", _aviParam, function(json) {

		if (json.result !== undefined){
			if (json.result.length == 1){

				if ( json.result[0].vdwkWorkStatCd == '13' || json.result[0].vdwkWorkStatCd == '16' || json.result[0].vdwkWorkStatCd == '19' ) {
					//vdwkWorkStatCd

		    		alert("* 해당 CCTV의 영상이 존재하지 않거나, 영상 추출 작업에 실패하였습니다.");


		    		$("#counter_time").text('반출실패!!!');
		    		//$('#cctv_list_box .avi_view[mgrseq='+mgr_seq+']', opener.document).attr('mgrseq', opener.setSeqNum());
		    		$('#cctv_list_box .avi_view[mgrseq='+mgr_seq+']').attr('mgrseq', setSeqNum());

		    		clearTimeout(intervalPrev);
		    		clearTimeout(intervalPrevDown);

		    		chkVal = false;
		    		//$("#prev_pop").bPopup().close();
		    	};

			}
		}

	}, false);

	return chkVal;

}

/**
 * 경과 시간 초기화를 시킨다.
 * @param n
 * @returns
 */
function aviZero(n) {
    return n>9?n:"0"+n;
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

function defaultSetting(){

	$('#1_msg').show();
	$('#2_msg').hide();
	$('.btnDiv').css('margin-top', '10px');
	$('#prev_add').show();

	openerBtn = null;

}

