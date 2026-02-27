//전용플레이어 설치 여부 확인
var TERUTEN_CHK = false;
var TERUTEN_VERSION = "1.0.3.4";

//영상반출 서브메뉴 사이즈
var TVIUS_BTN_CCTV_SCH_WEST_SIZE = 450;/* 171214 : 350 -> 450 사이즈 수정*/
var TVIUS_BTN_LGD_MNG_WEST_SIZE = 450;
var TVIUS_BTN_TVIUS_REG_WEST_SIZE = 850;/* 180123 : 750 -> 850 사이즈 수정*/
var TVIUS_BTN_TVIUS_VIEW_WEST_SIZE = -1;
var TVIUS_BTN_EXT_VIEW_WEST_SIZE = -1;
var TVIUS_BTN_EVI_VIEW_WEST_SIZE = 750;
var TVIUS_BTN_TVIUS_URGENT_REG_WEST_SIZE = 850;
var TVIUS_BTN_TVIUS_HEAT_WEST_SIZE = 500;
var TVIUS_BTN_TVIUS_CAR_SCH_WEST_SIZE = 450;

var SYSTEM_AVI_PLAY_CNT = '';		//영상재생횟수
var SYSTEM_AVI_PLAY_DAT = '';		//영상재생기간
var SYSTEM_RENEW_PLAY_CNT = '';		//연장신청재생횟수
var SYSTEM_RENEW_PLAY_DAT = '';		//연장신청재생기간
var SYSTEM_EVI_PLAY_CNT = '';		//증거신청재생횟수

//권한관련
var SYSTEM_PREVIEW_PHOTO = '';		//현장사진권한
var SYSTEM_PREVIEW_AVI = '';		//미리보기권한

//반출신청관련
var SYSTEM_FILE_DOWN_CNT = '';		//영상다운횟수제한
var SYSTEM_RQST_LOCK_CNT = '';		//활용결과제한횟수

//sms관련
var SYSTEM_AVI_PLAY_TIME = '';		//미리보기시간설정
var SYSTEM_LAST_SMS_DAT = '';		//영상만료확인
var SYSTEM_ADMIN_SMS_LIST = '';		//SMS전송리스트

//마스킹관련
var SYSTEM_MASKING_YN = '';			//마스킹유무
var SYSTEM_MASKING_ROUTE_BF = '';	//마스킹전저장경로
var SYSTEM_MASKING_ROUTE_AF = '';	//마스킹후저장경로

var SYSTEM_STORAGE_PATH = '';		//영상저장경로
var SYSTEM_UPLOAD_PATH = '';		//첨부파일저장경로

//미리보기 관련 변수
var PREV_COUNTER_CNT = 5*60;

//CCTV row 갯수를 체크한다.
var SELECTED_CCTV_COUNT = 0;
//차량반출 CCTV row 갯수를 체크한다.
var SELECTED_CCTV_COUNT_CAR = 0;

//영상반출 영상 시간 제한(단위 : 시간)
var AVI_LIMIT_TERM = 6;// 190507 이은규	6 -> 24 -> 12시간으로 수정

//var intervalStat;					//상태체크 조회(setTimeout)용 변수
//var intervalPrev;					//미리보기 상태체크 조회(setTimeout)용 변수
//var intervalAviDown;				//미리보기 다운 팝업 avi상태 조회(setTimeout)용 변수

var HDD_SERIAL = 'hddSerial';
var MAC_SERIAL = 'macSerial';

var spinner = null;
var spinnerOpts = {
    lines: 13 // The number of lines to draw
  , length: 26 // The length of each line
  , width: 16 // The line thickness
  , radius: 42 // The radius of the inner circle
  , scale: 1 // Scales overall size of the spinner
  , corners: 1 // Corner roundness (0..1)
  , color: '#4582ac' // #rgb or #rrggbb or array of colors
  , opacity: 0.25 // Opacity of the lines
  , rotate: 0 // The rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 1 // Rounds per second
  , trail: 60 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  , zIndex: 2e9 // The z-index (defaults to 2000000000)
  , className: 'spinner' // The CSS class to assign to the spinner
  , top: '50%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
}
var spinnerOpts_small = {
      lines: 13 // The number of lines to draw
    , length: 26 // The length of each line
    , width: 16 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 0.2 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#4582ac' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
  }


var intervalStatChk = null;


$(document).ready(function() {

	useRqstCntChk();

  resizeDone();

  if(TERUTEN_CHK){
    //플레이어 설치여부 확인시간 동안 spinner 활성화
    showSpinner();

    //전용플레이어 설치 확인
    //설치되어있지 않으면 player_wrap을 숨기지 않고 밑의 모든 동작을 하지 않음.
    var chkPlayer = Public.TVIUS.Teruten.chkVersion();

    //플레이어 설치 확인 후 spinner 비활성화
    hideSpinner();

    //1이면 정상이므로 패스
    if(chkPlayer != 1){
      //플레이어 설치 권고 div 활성화
      $("#player_wrap").show();
      //플레이어 다운로드 버튼 이벤트 바인딩
      $("#player_wrap").find("#player_download").click(function(){
        _common.postForm.submit("/user/getPlayerFile.json", null);
      });
      //업데이트 필요
      if(chkPlayer == 2){
        //안내문구 텍스트 변경
        var _html = '현재 설치된 전용플레이어의 버전이 낮습니다.<br>하단 버튼을 통해 다운로드 후 재설치하여 주십시오.';
        $("#player_wrap").find("#player_span").html(_html);
      }
      //설치되어있지 않거나 모종의 이유로 연결이 되지 않음.
      else if(chkPlayer == 0){
        //당장은 별다른 조치를 취하지 않음.
      }
      //오류 체크 이후 하단의 로직은 필요없으므로 return
      return false;
    }
    //정상처리 되었으면 플레이어 설치 권고 div 숨김처리
    $("#player_wrap").hide();

    //하드, 맥 시리얼 요청
    HDD_SERIAL = Public.TVIUS.Teruten.chkHddSerial();
    MAC_SERIAL = Public.TVIUS.Teruten.chkMacAddress();
  }

  //jeon 작은스피너 그려줌
  var target = $('.loading_img')[0];
  spinner = new Spinner(spinnerOpts_small).spin(target);
  //getSysParam();

  //기준시간 설정
  var nowDT = DateTimeAdd( 0, "", 0 );
  $('.aviWrapper').find('#base_date').val(nowDT.d);
  $('.aviWrapper').find('#base_time').val(nowDT.t);
  $('.carWrapper').find('#base_date_car').val(nowDT.d);
  $('.carWrapper').find('#base_time_car').val(nowDT.t);
  $('.in_date').inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});
  //$('#base_date').inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});

  /**
   *	신청번호 설정
   *	신청번호는 현재시간값을 기준으로 만들어진다.
   */
  if (chkEdit == ""){
    mgrSeq = setSeqNum();

  } else {
    mgrSeq = chkEdit;
    setRqstInfo(mgrSeq);
    $('.aviWrapper #btn_save').hide();
    $('.aviWrapper #btn_edit').show();
    $('#btn_car_save').hide();
    $('#btn_car_edit').show();
  }
  $('#mgrSeq').val(mgrSeq);

  //datePicker는 일단 패스, value에 - 없애는거 확인하고 진행
  setDatePicker();
  //$(".searchWrapper, .aviWrapper").find("#base_date").inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});

});

var timer = null;
var delta = 300;

$(window).resize(function(){

//	clearTimeout( timer );
//    timer = setTimeout( resizeDone, delta );
});

function resizeDone() {

  $(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height());

  //$("#loading_wrap").width($('#overlay-west-contents').width() - $('#overlay-west-side-bar').width());
  //$("#loading_wrap").height($('#overlay-west-contents').height());
  var width = TVIUS_BTN_TVIUS_REG_WEST_SIZE - $('#overlay-west-side-bar').width();
  var height = $('#overlay-west-contents').height();

  $("#player_wrap").width(width);
  $("#player_wrap").height(height);
  if($("#loading_wrap").is(':visible')){
    $("#loading_wrap").width(width);
    $("#loading_wrap").height(height);
  }

}

/**
 * 영역검색 방식 변경 이벤트 입니다.
 */
//$(".aviWrapper").find(".drawType").click(function(){
$(".drawType").click(function(){
  if(Public.StopEvent != null) Public.StopEvent();
  Public.TVIUS.Search.Start();
});

/**
 * 영역검색 취소버튼 이벤트 입니다.(반출, 열람)
 */
$(".aviWrapper").find("#drawCncl").click(function(){
  Public.StopEvent();
  $(".aviWrapper").find(".drawType").prop("checked", false);
});

/**
 * 영역검색 취소버튼 이벤트 입니다.(차량추적)
 */
$(".carWrapper").find("#drawCncl").click(function(){
  Public.StopEvent();
  $(".carWrapper").find(".drawType").prop("checked", false);
});

$(".rqstWrapper").find("#btnAppRqstSearch").click(function(e) {
  $("#app_rqst_pop").dialog({
    title : "앱 신청 검색",
    width: 800,
    height: 710,
    modal: true,
    open : function() {
      $("#appRqstParam").find('input').val('');
      $('#appSearchResult').find('tbody').html('');
    }
  });

  /*$("#app_rqst_pop").bPopup({
    position: ['left', '10'],
    appendTo: $(".contentWrapper"),
    onOpen : function() {
      $(".contentWrapper #appRqstParam").find('input').val('');
      $('#appSearchResult').find('tbody').html('');
    },
    onClose: function() {}
  }).reposition();*/
});

$("#app_rqst_pop").find("#appSearchBtn").click(function(e) {

  var _appParam = _common.utils.collectSendData($(".contentWrapper #appRqstParam"));

  if(_appParam['appRqstMgrSeq'] != "") _appParam['mgrSeq'] = _appParam['appRqstMgrSeq'];
  if(_appParam['appStartDat'] != "") _appParam['startDat'] = _appParam['appStartDat'].replace(/\-/gi, '') + '000000';
  if(_appParam['appEndDat'] != "")_appParam['endDat'] = _appParam['appEndDat'].replace(/\-/gi, '') + '235959';
  _appParam['reqstId'] = userId;
  _appParam['procStatCd'] = 'SB';

  delete _appParam['appRqstMgrSeq'];
  delete _appParam['appStartDat'];
  delete _appParam['appEndDat'];

  _common.callAjax("/tvius/getTransRqst.json", _appParam, function(json) {
    if(json.result){

      //var _rqstParam ={'rqstMgrSeq': rqstMgrSeq, 'procStatCd': procStatCd};
      $('#appSearchResult').find('tbody').html('');
      for(var i=0; i<json.result.length; i++){
        var str = '';
        str += '<tr>';
        str += '	<td><input type="radio" name="applist" mgrSeq="'+json.result[i].mgrSeq+'" procStatCd="'+json.result[i].procStatCd+'"/></td>';
        str += '	<td><span>'+json.result[i].mgrSeq+ '</span></td>';
        str += '	<td><span>'+Date.prototype.formatYMDHMS(json.result[i].reqstDat.substring(0,8))+'</span></td>';
        str += '	<td><span title="'+json.result[i].cctvList+'" style="width: 290px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">'+json.result[i].cctvList+ '</span></td>';
        str += '</tr>';

        var $tr = $(str);
        $tr.click(function(){
          $(this).find('input[type=radio]').click();
        });
        $('#appSearchResult').find('tbody').append($tr);
      }
    }
  });
});

$("#app_rqst_pop").find("#btnAppSave").click(function(e) {
  var selectedItem = $("#app_rqst_pop").find(':radio[name="applist"]:checked');
  var rqstMgrSeq = selectedItem.attr('mgrSeq');
  var procStatCd = selectedItem.attr('procStatCd');

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
  } else {
    alert('앱 신청건을 선택하여 주십시오.');
  }

});

$("#app_rqst_pop").find("#app_rqst_pop_close").click(function(e) {
  //$("#app_rqst_pop").bPopup().close();
  $("#app_rqst_pop").dialog("close");
});

$(".rqstWrapper").find("#btn-getdoc").click(function(e) {

   var _html = '';
   _html+='<div class="dialogWrap customScroll" id="official_doc_pop">'
     _html+='<div id="officialDocTable" class="box_style">'
     _html+='	<div id="officialDocParam" class="info_box wd100">'
     _html+='		<span class="title">공문번호</span>'
     _html+='           				<input type="text" id="officialDocNo" class="sendData">'
     _html+='	</div>'
     _html+='	<div id="officialDocParam" class="info_box wd100">'
     _html+='		<span class="title">기간</span>'
     _html+='           				<input type="date" id="docStartDat" class="sendData" size="15">'
     _html+='                        	  ~'
     _html+='                        	  <input type="date" id="docEndDat" class="sendData" size="15">'
     _html+='	</div>'
     _html+='   <button class="grayBtn btn_style" id="docSearchBtn">검색</button>'
     _html+='</div>'
   _html+='          	<table cellspacing="0" class="table_style">'
   _html+='          		<tbody>'
   _html+='           		<tr>'
   _html+='           			<td style="height: 390px;">'
   _html+='           				<div style="height:385px;" class="customScroll" data-mcs-theme="minimal-dark">'
   _html+='           					<table id="docSearchResult" style="width: 440px;">'
   _html+='           					</table>'
   _html+='           				</div>'
   _html+='          				</td>'
   _html+='           		</tr>'
   _html+='           		<tr>'
   _html+='           			<td class="btnDiv" style="height:30px;">'
   _html+='           				<button id="btnDocSave" class="btn_style">선택</button>'
   _html+='           			</td>'
   _html+='           		</tr>'
   _html+='           	</tbody>'
   _html+='       </div>'
   _html+='          	</table>'

  $("#popupWrap").html(_html).dialog({
    title: "개인 공문 검색",
    width: 500,
    height: "auto",
    modal: true,
    /*position: {
      my: "left+1000 top",
      at: "left top",
      of: $("#map")
    },*/
    open: function(){
    },
    close: function(){
      $("#popupWrap").empty();
    },
    resizable: false
  }).dialog("open");

  bindClickEventDocSearchBtn();
  bindEventBtnDocSave()
});
function bindClickEventDocSearchBtn(){
  $("#official_doc_pop").find("#docSearchBtn").click(function(e) {
    var _docParam = _common.utils.collectSendData('#officialDocTable');

    if(_docParam['officialDocNo'] != "") _docParam['docNo'] = _docParam['officialDocNo'];
    if(_docParam['docStartDat'] != "") _docParam['startDat'] = _docParam['docStartDat'].replace(/\-/gi, '') + '000000';
    if(_docParam['docEndDat'] != "")_docParam['endDat'] = _docParam['docEndDat'].replace(/\-/gi, '') + '235959';
    _docParam['userId'] = userId;

    delete _docParam['officialDocNo'];
    delete _docParam['docStartDat'];
    delete _docParam['docEndDat'];

    _common.callAjax("/tvius/getCrmsOfficialDocList.json", _docParam, function(json) {
      if(json.result){
        $('#docSearchResult').html('');
        for(var i=0; i<json.result.length; i++){
          var str = '';
          str += '<tr>';
          str += '	<td>';
          str += '		<input type="radio" name="doclist" mgrNo="'+json.result[i].mgrSeq+'" nm="'+json.result[i].docFileNm+'" path="'+json.result[i].docFilePath+'"/><span>' + json.result[i].docFileNm+'</span>';
          str += '	</td>';
          str += '</tr>';
          var $tr = $(str);
          $tr.find('span').click(function(){
            $(this).prev().click();
          });
          $('#docSearchResult').append($tr);
        }
      }
    });
  });
}

function bindEventBtnDocSave(){
  $("#official_doc_pop").find("#btnDocSave").click(function(e) {
    var selectedItem = $("#official_doc_pop").find(':radio[name="doclist"]:checked');
    var nm = selectedItem.attr('nm');
    var path = selectedItem.attr('path');
    var ofclMgrNo = selectedItem.attr('mgrNo');

    //190807 이은규 특수문자 제거
    var regExp = /[\{\}\/?,;:|*~`!^+<>@\#$%&\\\=\'\"]/gi;
      if(regExp.test(nm)){
          nm = nm.replace(regExp, "");
      }

    if(nm && path && ofclMgrNo){
      alert('선택되었습니다.');
      $(".rqstWrapper").find("#docFileNm").val(nm);
      $(".rqstWrapper").find("#docFilePath").val(path);
      $(".rqstWrapper").find("#ofclMgrNo").val(ofclMgrNo);
      $('#docSearchResult').html('');
      $("#popupWrap").dialog("close");
//			$("#official_doc_pop").bPopup().close();
    } else {
      alert('공문을 선택하여 주십시오.');
    }

  });
}


$("#official_doc_pop").find("#official_doc_close").click(function(e) {
  $("#official_doc_pop").dialog("close");
  //$("#official_doc_pop").bPopup().close();
});


$(".rqstWrapper").find("#btn-upload").click(function(e) {

  $("#hiddenForm").find("#uploadImg").click();

});

/* 상위 "파일 첨부" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
$("#hiddenForm").find("#uploadImg").on("change", function(){
  var nm = $(this).val();
  if(nm != ""){
    confirm("선택하신 파일을 업로드 하시겠습니까?", function(){
      _common.formSubmit("/tvius/addDocFile.json", $("#hiddenForm"), function(json){
        //error가 아닌 exception으로 넘어오므로 요청완료 후 alert 실행
        if(json.exception){
          alert(json.exception);
        }else if(json.realNm !== undefined && json.uploadNm !== undefined){
              $('#docFileNm').val(json.uploadNm);
              $('#docFilePath').val(json.realNm);
            }
          });
    }, function(){
      $(this).val("");
    });
  }
});

//$(".searchWrapper, .aviWrapper").find(".stat_btn").click(function(e) { 이 먹질 않음...
//상태체크
function statViewBindEvent($target){
  $target.click(function(){
    if($('#reqGbnCd').val() == '14'){
      alert('* 차번반출은 상태체크 기능이 제공되지 않습니다.');
      return false;
    }

    /**
     * 다른 상태 체크 요청중 클릭할 수 있으므로 클리어 후 작업 시작
     */
    clearTimeout(intervalStat);

    $('#cctv_stat_body').html('');
    //$('#cctv_stat_body').html('');

  /*	var width = $('#overlay-west-contents').width() - $('#overlay-west-side-bar').width();
    var height = $('#overlay-west-contents').height();
    $("#stat_load_bar").width(width);
    $("#loading_wrap").height(height);
  */

    $('#stat_load_bar').show();

    var key = $(this).attr('key');
    var cctvMgrNo = $(this).attr('mgrno');
    var rqstMgrSeq = $(this).attr('mgrseq');

    var sd = $(this).closest("tr").find('td').eq(3).find('[name=cctv_sdate]').val().replace(/\-/gi, '');
    var st = $(this).closest("tr").find('td').eq(3).find('[name=cctv_stime]').val();
    var sm = $(this).closest("tr").find('td').eq(3).find('[name=cctv_smin]').val();
    var ed = $(this).closest("tr").find('td').eq(4).find('[name=cctv_edate]').val().replace(/\-/gi, '');
    var et = $(this).closest("tr").find('td').eq(4).find('[name=cctv_etime]').val();


    var t_val = sd + st + sm;
    var stat_title = $('#cctv_row_'+key+' .cctv_label').text();
    var startDat =  sd + st;
    var endDat =  ed + et;

    var startChk = $(this).attr('startdat');
    var endChk = $(this).attr('enddat');

    if ( startChk != startDat || endDat != endChk ) {
      rqstMgrSeq = setSeqNum();
      $(this).attr('mgrseq', rqstMgrSeq);
    }

    startChk = $(this).attr('startdat', startDat);
    endChk = $(this).attr('enddat', endDat);


    setCctvStat(startDat, endDat, rqstMgrSeq, cctvMgrNo, startDat, endDat );

    //상태 조회 시간을 설정한다.
    $('#cctv_stat_dat').text(strYmdadd( t_val, '-' ));
    $('#cctv_stat_title').text(stat_title);
    $('#cctv_stat_title').attr('title', stat_title);

    $("#cctvPop").dialog({
      title: "영상 저장 상태 체크",
      width: 850,
//      height: 220,
      modal: true,
      //appendTo: $(".contentWrapper"),
      close: function() { clearTimeout(intervalStat); }
    });

    /*$("#cctvPop").bPopup({
      appendTo: $(".contentWrapper"),
      onClose: function() { clearTimeout(intervalStat); }
    });*/
  });
}

/**
 * 상태체크 팝업 종료 이벤트
 */
$("#cctvPopClose").click(function(e) {

  clearTimeout(intervalStat);
  $("#cctvPop").dialog("close");
  //$("#cctvPop").bPopup().close();

});


//다운로드 팝업은 bPopup으로 처리
function aviViewBindEvent($target){
  $target.click(function(){

    var $thisBtn = $(this);

    clearTimeout(intervalPrevDown);

    var sd = $thisBtn.closest("tr").find('td').eq(3).find('[name=cctv_sdate]').val().replace(/\-/gi, '');
    var st = $thisBtn.closest("tr").find('td').eq(3).find('[name=cctv_stime]').val();
    var sm = $thisBtn.closest("tr").find('td').eq(3).find('[name=cctv_smin]').val();

    var key = $thisBtn.attr('key');
    var mgrSeq_prev = $thisBtn.attr('mgrseq');
    var t_val = sd + st + sm;
    var date = new Date();
    var date_full = date.getFullYear()+''+dateTwo(date.getMonth()+1)+''+dateTwo(date.getDate())+''+dateTwo(date.getHours())+''+dateTwo(date.getMinutes());

    if ( Number(t_val) > Number(date_full)  ) {
      alert( ' 미리보기 영상 시간 설정이 잘못되었습니다. 확인 후 다시 선택하십시오.');
      return false;
    }

    var startChk = $thisBtn.attr('startdat');

    if ( startChk != t_val ) {
      mgrSeq_prev = setSeqNum();
      $thisBtn.attr('mgrseq', mgrSeq_prev);
    }

    startChk = $thisBtn.attr('startdat', t_val);

    showSpinner();

    if ( getPrevStatChk(mgrSeq_prev, 'T') == false ) {

      return false;
    }

    //$('#loading_wrap').hide();
    hideSpinner();

    if ( $('#'+mgrSeq_prev+'_avi').length == 0 ) {
      var del_list = '<input id="'+mgrSeq_prev+'_avi" class="prev_del_list" type="hidden" value="'+PREV_COUNTER_CNT+'" />';
      $('#prev_del_group').append(del_list);
    }

    $('#prev_pop #prev_attr').attr('cctv_mgr_no', $thisBtn.attr('key'));
    $('#prev_pop #prev_attr').attr('s_date', sd);
    $('#prev_pop #prev_attr').attr('s_time', st);
    $('#prev_pop #prev_attr').attr('s_min', sm);
    $('#prev_pop #prev_attr').attr('mgr_seq', mgrSeq_prev);
    $('#prev_pop #prev_attr').attr('reqst_id', userId);

    $("#prev_pop").dialog({
      title: "미리보기 파일 생성",
      modal: true,
      width: 400,
//      height: 170,
      open: function(){
        defaultSetting();
        //setPopup();
        prevRqstChk($thisBtn);
      },
      close: function(){
        clearTimeout(intervalPrevDown);
      }
    });
    /*$('#prev_pop').bPopup({
      appendTo: $(".contentWrapper"),
      onOpen: function() {
        defaultSetting();
        //setPopup();
        prevRqstChk($thisBtn);

      },
      onClose: function() {
        clearTimeout(intervalPrevDown);
      }
    });*/
  });

}

/**
 * 상태체크 팝업 종료 이벤트
 */
$(".aviWrapper").find("#prev_pop_close").click(function(e) {

  clearTimeout(intervalPrevDown);
  $("#prev_pop").dialog("close");
  //$("#prev_pop").bPopup().close();
});




function imgViewBindEvent($target){
  $target.click(function(){

    var cctvMgrNo = $(this).attr('key');

    imgList(cctvMgrNo);

    $('#cctv_img_pop').bPopup({
      appendTo:$(".contentWrapper"),
      onClose: function() { $('#cctv_img_list').html(''); }

    });

    $('.slide_img').bxSlider({
      infiniteLoop: false,
      hideControlOnEnd: true//,
    });

    $('.bx-viewport').css('box-shadow', '0 0 0px');

  });
}

/**
 * 현장사진 팝업 종료 이벤트
 */
//$(".searchWrapper, .aviWrapper").find("#cctv_img_pop_close").click(function(e) {
$("#cctv_img_pop_close").click(function(e) {

  $("#cctv_img_pop").bPopup().close();

});

function delBtnBindEvent($target){
  $target.click(function(){
    if($('.aviWrapper').is(":visible")){
      SELECTED_CCTV_COUNT--;
    }else if($('.carWrapper').is(":visible")){
      SELECTED_CCTV_COUNT_CAR--;
    }
    $(this).closest("tr").remove();
    setCctvList();

    /* 171212 */
    resizeDone();

    var cctvRowCnt = $('#tbl_cctv_list > tbody').find('tr').length-1;
	$('#lbl_cctvList').text("CCTV 선택(총 "+cctvRowCnt+"대)");
  });
}

function maskChkBtnBindEvent($target){
	$target.click(function(){
		if($target.prop("checked")){
			alert("마스킹 선택 시 담당자에게 연락하시기 바랍니다. (043-641-5805)");
		}
	});
}


//시작시간과 종료시간 값이 바뀌었을 경우
function timeBindEvent($target){
  $target.blur(function(){
    cctvTimeChk($(this));
  }).change(function(){
    cctvTimeChk($(this));
  });
}


/**
 * 신청
 */
$(".aviWrapper").find("#btn_save").click(function(e) {

  //$(this).off(e); // 빠른 더블클릭 금지하기..

  var saveChk = true;

  //신청하려는 CCTV의 시간값 유효성을 체크
  if ( $(".aviWrapper").find('.cctv_list_chk').length != 0 ) {
    alert('* CCTV 시작시간과 종료시간이 잘못 설정되었습니다.\n 다시 설정하여 주십시오.');
    $(".aviWrapper").find('.cctv_list_chk').focus();
    saveChk = false;
    return false;
  }

  var _rqstParam = _common.utils.collectSendData(".contentWrapper .rqstWrapper");

  $.each(_rqstParam,function(key,value) {
      if (value == ""){

        if ( $('#'+key).attr('intype') == "C" ) {
          alert($('#lbl_'+key).text() + ' 항목을 선택하여 주십시오.');
          $('#'+key).focus();
          saveChk = false;
          return false;
        } /*else if (key == "crimeLoc"){
      }*/

        else {

			alert($('#lbl_'+key).text() + ' 입력은 필수입니다.');

        	$('#'+key).focus();
        	saveChk = false;
        	return false;
        }
      }
  });

  //cctvList 파악
  if (saveChk){
    var cctvList = $(".aviWrapper").find("#cctvList").val();
    if ( cctvList == ""){
      alert('* CCTV를 선택하여 주십시오.');
      saveChk = false;
      return false;
    }
  }

  //같은 CCTV, 같은 시작~종료시간이 존재할경우 체크
  if ( saveChk  && ( $('#reqGbnCd').val() == '11' || $('#reqGbnCd').val() == '13')){
    var cctv_arry = [];
    var cctv_row  = $('#tbl_cctv_list .cctv_row');

    cctv_row.each(function(i){
      cctv_arry.push(
          $(this).attr('id') + '/' +
          $(this).find('td').eq(3).find('[name=cctv_sdate]').val() +
          $(this).find('td').eq(3).find('[name=cctv_stime]').val() +
          $(this).find('td').eq(3).find('[name=cctv_smin]').val() + '/' +
          $(this).find('td').eq(4).find('[name=cctv_edate]').val() +
          $(this).find('td').eq(4).find('[name=cctv_etime]').val() +
          $(this).find('td').eq(4).find('[name=cctv_emin]').val() ) ;

    });

    for (var i=0; i<cctv_arry.length; i++){
      for (var j=0; j<cctv_arry.length; j++){
        if( i != j ) {
          if( cctv_arry[i] == cctv_arry[j] ) {
            alert('CCTV,시작시간,종료시간이 모두 같은 건이 있는지 확인하여 주십시오.');

            $(this).focus();
            saveChk = false;
            return false;
            break;
          }
        }
      }
    }
  }

  //avi param
  if ( saveChk ){

    /*var width = $('#overlay-west-contents').width()-70;
    var height = $('#overlay-west-contents').height();
    $("#loading_wrap").width(width);
    $("#loading_wrap").height(height);

    var target = $('#loading_img')[0];
    spinner = new Spinner(spinnerOpts).spin(target);
    $('#loading_wrap').show();*/

    if($('#reqGbnCd').val() == 11){
	  $(".aviWrapper").find('#btn_save').prop("disabled", true);
	  $(".aviWrapper").find('#btn_save').text("신청중");
	  $(".aviWrapper").find('#btn_save').css("background-color","#666");

	  var count = 0;
	  intervalStatChk = setInterval(function(){
	    getStatChk();
	    count++;

	    if(count > 59){
	    	clearInterval(intervalStatChk);
	    	alert('해당 CCTV에 영상이 존재하지 않습니다.\n확인 후 다시 신청하여 주십시오. ');
	    	$(".aviWrapper").find('#btn_save').prop("disabled", false);
			$(".aviWrapper").find('#btn_save').text("신 청");
			$(".aviWrapper").find('#btn_save').css("background-color", "#0078d4");
	    }
	  }, 1000);
    }
    //열람,캡처
    else{
    	addTransAviAndAddTransRqst();
    }
  }
});

/**
 * 영상반출 신청시 현재 나열된 cctv의 상태에 영상 파일이 존재하는지 체크한다.
 *
 */
function getStatChk(){
  var statArr = [];
  var cctvNm = "";
  var isPass = false;
  new Promise(function(resolve){


    setStatArr(statArr);

    if(isStatCheckComplete(statArr)){
      if(isStatData(statArr)){
        isPass = true;
      }
      resolve();
    }

  }).then(function(){
    clearInterval(intervalStatChk);

    if(!isPass){
      var isNotStatDataCctvList = "";

      $(".aviWrapper").find('#btn_save').prop("disabled",false);
      $(".aviWrapper").find('#btn_save').text("신 청");
      $(".aviWrapper").find('#btn_save').css("background-color","#0078d4");


      $('.cctv_row[isStatData="N"').each(function(){
        var startData = $(this).attr("startDat").substring(0,4)+"." + $(this).attr("startDat").substring(4,6) + "." + $(this).attr("startDat").substring(6,8) + " " + $(this).attr("startDat").substring(8,10) + ":"+ $(this).attr("startDat").substring(10,12);
        var endData = $(this).attr("endDat").substring(0,4)+"." + $(this).attr("endDat").substring(4,6) + "." + $(this).attr("endDat").substring(6,8) + " " + $(this).attr("endDat").substring(8,10) + ":"+ $(this).attr("endDat").substring(10,12);
        isNotStatDataCctvList += "CCTV : " + $(this).find(".cctv_label").text() + "\n 시간 : " + startData + " ~ " + endData + "\n\n";
      });
      isNotStatDataCctvList = isNotStatDataCctvList.substring(0, isNotStatDataCctvList.length-1);
      alert( isNotStatDataCctvList + '\n해당 CCTV에 영상이 존재하지 않습니다.\n확인 후 다시 신청하여 주십시오. ');
      return;
    }
    addTransAviAndAddTransRqst();
  });
}



/**
 * 영상반출 신청시 현재 나열된 cctv의 상태에 영상 파일이 존재하는지 체크해서 상태값을 배열에 넣어준다.
 *
 * @param statArr
 */
function setStatArr(statArr){
   $('.cctv_row').each(function(i){
      var cctvMgrNo =   $(this).attr("mgrNo");

//      var key = $(this).attr('key');
		var sd = $(this).closest("tr").find('td').eq(3).find('[name=cctv_sdate]').val().replace(/\-/gi, '');
		var st = $(this).closest("tr").find('td').eq(3).find('[name=cctv_stime]').val();
		var sm = $(this).closest("tr").find('td').eq(3).find('[name=cctv_smin]').val();
		var ed = $(this).closest("tr").find('td').eq(4).find('[name=cctv_edate]').val().replace(/\-/gi, '');
		var et = $(this).closest("tr").find('td').eq(4).find('[name=cctv_etime]').val();
		var em = $(this).closest("tr").find('td').eq(4).find('[name=cctv_emin]').val();
		
      var mgr = $(this).attr("mgrSeq");
      var startDat = sd + st + sm;
      var endDat = ed + et + em;

      startDat = startDat.replaceAll("-","")+"00";
      endDat = endDat.replaceAll("-","")+"00";

      var sm = startDat.substr(10,2);

      var startChk = $(this).attr('startDat');
      var endChk = $(this).attr('endDat');

      if ( startChk != startDat || endDat != endChk ) {
        mgr = setSeqNum();
        $(this).attr('mgrSeq', mgr);
      }

      $(this).attr('startDat', startDat);
      $(this).attr('endDat', endDat);

      var dataChk = getDateChk(startDat, endDat);

      _common.callAjax("/tvius/getStat.json", {"mgrSeq" : Number(mgr)}, function(json) {
        if( json.result !== undefined ){
          if (json.result.length === 0){

            statArr.push('S');
            addCctvStat(mgr, cctvMgrNo, startDat, endDat);

          } else if ( json.result.length == 1){

            var list = json.result;
            var statData = list[0].statData;
            var validYn = list[0].validYn;

            if ( validYn == 'N' ) {
              statArr.push('S');
            } else {
              statData = statData.replace(/\//gi, '').substr(Number(sm), Number(dataChk));
              if ( statData.indexOf('1') == -1 ){//전부다 0이면

                statArr.push('F');
                $('.cctv_row[mgrNo="'+json.result[0].cctvMgrNo+'"]').attr("isStatData","N");

              } else {
                statArr.push('T');
                $('.cctv_row[mgrNo="'+json.result[0].cctvMgrNo+'"]').attr("isStatData","Y");
              }
            }

          } else {
            alert('* An error has occurred.\r\njson.result.length\r\n' + json.result.length);
          }
        } else {
          alert('* An error has occurred.\r\njson.result undefined.\r\n' + json.result);
        }

      }, false);


   });
}



/**
 * 	상태값이 모두 들어왔는 지 여부
 * @param statArr
 * @returns {Boolean}
 */
function isStatCheckComplete(statArr){
  var bol = true;
  if ( statArr.indexOf('S') != -1 ) { //S가 있으면
    bol = false;
  }

  return bol;
}
/**
 * 들어온 상태값에 모두 0인 상태값은 없느 지 여부
 * @param statArr
 * @returns {Boolean}
 */
function isStatData(statArr){
  var bol = false;
  if ( statArr.indexOf('F') != -1 && statArr.indexOf('S') == -1 ) {  // F가 있고 S가 없을 때
     bol = false;

  } else if ( statArr.indexOf('T') != -1 && statArr.indexOf('F') == -1 && statArr.indexOf('S') == -1) {  // T는 있고  F, S둘 다 없을 때    T ->  000010000000 F -> 0000000000000000
    bol = true;
  }
  return bol
}



function addTransAviAndAddTransRqst(){
  //rqst param
  var date = new Date();
  var sysCnt = Number(SYSTEM_AVI_PLAY_CNT);
  var sysDat = Number(SYSTEM_AVI_PLAY_DAT);

  if( sysDat != 0 ){
    date.setDate(date.getDate() + sysDat);
  }

  var playLimitDat = date.getFullYear()+''+dateTwo(date.getMonth()+1)+''+dateTwo(date.getDate())+''+dateTwo(date.getHours())+''+dateTwo(date.getMinutes())+''+dateTwo(date.getSeconds());

  /**
   *  avi 기본키
   *  하나씩 추가 될때마다 값이 늘어남
   */
  var aviMgrSeq = 1;
  /**
   * ajax로 값을 전달하기 위한 변수 선언
   * json으로 저장됨
   */
  var _aviParam = {};

  //테이블의 cctv 정보를 불러옴.
  $('#tbl_cctv_list .cctv_row').each(function() {

    var cctvMgrNo = $(this).find('.cctv_mgr_no').val();

    var sy = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(0,4);
    var sm = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(4,6);
    var sd = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(6,8);
    var sh = $(this).find('[name=cctv_stime]').val();
    var smm = $(this).find('[name=cctv_smin]').val();

    var ey = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(0,4);
    var em = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(4,6);
    var ed = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(6,8);
    var eh = $(this).find('[name=cctv_etime]').val();
    var emm = $(this).find('[name=cctv_emin]').val();

    var secStDat = sy+sm+sd+sh+smm + '00';// + '00' tybis는 초 단위 뺌
    var secEdDat = ey+em+ed+eh+emm + '00';// + '00' tybis는 초 단위 뺌

    var maskChk = '0';
	if ( SYSTEM_MASKING_YN != 'N'){
		if ( $(this).find('[name=mask_chk]').prop("checked") ){
			maskChk = '2';
		}
	}
    //var exp_avi_pw = $(this).find('[name=cctv_pw]').val();
    var expAviPw = '';

    _aviParam = {};

    _aviParam['mgrSeq'] = aviMgrSeq++;
    _aviParam['rqstMgrSeq'] = mgrSeq;
    _aviParam['cctvMgrNo'] = cctvMgrNo;
    _aviParam['playLimitCnt'] = parseInt(sysCnt);//parseInt('20');
    _aviParam['playLimitDat'] = playLimitDat;
    _aviParam['secStDat'] = secStDat;
    _aviParam['secEdDat'] = secEdDat;
    _aviParam['maskChk'] = maskChk;
    _aviParam['hddSerial'] = HDD_SERIAL;
    _aviParam['macSerial'] = MAC_SERIAL;
    _aviParam['expAviPw'] = expAviPw;
    _aviParam['bakStatCd'] = 'B0';

    _common.callAjax("/tvius/addTransAvi.json", _aviParam, function(json) {
      if (!json.result){
        alert('* An error has occurred.');
      }
    });
  });

  var _rqstParam = _common.utils.collectSendData($(".contentWrapper .rqstWrapper"));
  var videoSmy = "N";
  if(videoSmyChk == "Y"){
	  videoSmy = $(".contentWrapper").find(":input:radio[name=videoSmy]:checked").val();
  }

  _rqstParam['mgrSeq'] = parseInt(mgrSeq);
//  _rqstParam['useRsCd'] = '11';
  _rqstParam['crimeLoc'] = '';
  _rqstParam['cctvList'] = $(".aviWrapper").find("#cctvList").val();

  _rqstParam["videoSmy"] = videoSmy;
//  _rqstParam["docNo"] = _rqstParam["docDept"] + "-" + _rqstParam["docNo"] + "(" + _rqstParam["docDate"] + ")";
//  delete _rqstParam.docDept;
//  delete _rqstParam.docDate;


  _common.callAjax("/tvius/addTransRqst.json", _rqstParam, function(json) {
    if(json.result){
      _common.callAjax("/ws/noticeCrmsTransRqstToTviusMng.json", { "json" : JSON.stringify(json.crmsTransRqstVo) }, function(data) {
        if(data.result){
          alert("영상신청이 등록되었습니다.");
          if(chkMenu == 'usr')
            $('#btn-tvius-view').click();
          else
            $('#btn-tvius-rqst-view').click();
        }
      },false);
    }
  });

}

/**
 * 수정
 */
$(".aviWrapper").find("#btn_edit").click(function(e) {

  //$(this).off(e); // 빠른 더블클릭 금지하기..
  var saveChk = true;

  //신청하려는 CCTV의 시간값 유효성을 체크
  if ( $(".aviWrapper").find('.cctv_list_chk').length != 0 ) {
    alert('* CCTV 시작시간과 종료시간이 잘못 설정되었습니다.\n 다시 설정하여 주십시오.');
    $(".aviWrapper").find('.cctv_list_chk').focus();
    return false;
  }

  var _rqstParam = _common.utils.collectSendData($(".contentWrapper .rqstWrapper"));
  var videoSmy = "N";
  if(videoSmyChk == "Y"){
	  videoSmy = $(".contentWrapper").find(":input:radio[name=videoSmy]:checked").val();
  }
  //_param['test_id'] = 'test_val';
  //_param['recvMthd'] = 'FD';

  $.each(_rqstParam,function(key,value) {

    if (value == ""){

      if ( $('#'+key).attr('intype') == "C" ) {
        alert('* '+$('#lbl_'+key).text() + ' 항목을 선택하여 주십시오.');
        $('#'+key).focus();
        saveChk = false;
        return false;
      } /*else if (key == "crimeLoc"){
      }*/ else {

//    	  if(key == 'docDept'){
//				alert('* 공문 부서 입력은 필수입니다.');
//			} else if(key == 'docDate'){
//				alert('* 공문시행일 입력은 필수입니다.');
//			} else{
				alert('* '+$('#lbl_'+key).text() + ' 입력은 필수입니다.');
//			}

	        $('#'+key).focus();
	        saveChk = false;
	        return false;
      }
    }

  });


  _rqstParam["videoSmy"] = videoSmy;
//  _rqstParam["docNo"] = _rqstParam["docDept"] + "-" + _rqstParam["docNo"] + "(" + _rqstParam["docDate"] + ")";
//  delete _rqstParam.docDept;
//  delete _rqstParam.docDate;

  //cctvList 파악

  var cctvList = $(".aviWrapper").find("#cctvList").val();
  if ( cctvList == ""){
    alert('* CCTV를 선택하여 주십시오.');
    saveChk = false;
    return false;
  }

  //같은 CCTV, 같은 시작~종료시간이 존재할경우 체크
  if ( saveChk  && ( $('#reqGbnCd').val() == '11' || $('#reqGbnCd').val() == '13')){
    var cctv_arry = [];
    var cctv_row  = $('#tbl_cctv_list .cctv_row');

    cctv_row.each(function(i){
      cctv_arry.push(
          $(this).attr('id') + '/' +
          $(this).find('td').eq(3).find('[name=cctv_sdate]').val() +
          $(this).find('td').eq(3).find('[name=cctv_stime]').val() +
          $(this).find('td').eq(3).find('[name=cctv_smin]').val() + '/' +
          $(this).find('td').eq(4).find('[name=cctv_edate]').val() +
          $(this).find('td').eq(4).find('[name=cctv_etime]').val() +
          $(this).find('td').eq(4).find('[name=cctv_emin]').val() ) ;

    });

    for (var i=0; i<cctv_arry.length; i++){
      for (var j=0; j<cctv_arry.length; j++){
        if( i != j ) {
          if( cctv_arry[i] == cctv_arry[j] ) {
            alert('CCTV,시작시간,종료시간이 모두 같은 건이 있는지 확인하여 주십시오.');

            $(this).focus();
            saveChk = false;
            return false;
            break;
          }
        }
      }
    }
  }

  //avi param
  if ( saveChk ){

    /*var width = $('#overlay-west-contents').width()-70;
    var height = $('#overlay-west-contents').height();
    $("#loading_wrap").width(width);
    $("#loading_wrap").height(height);

    var target = $('#loading_img')[0];
    spinner = new Spinner(spinnerOpts).spin(target);
    $('#loading_wrap').show();*/

    showSpinner();

    if ( $('#reqGbnCd').val() == '11' || $('#reqGbnCd').val() == '13') {
      if ( getStatChk('T') == false ) {
        return false;
      }
    }
    //$('#loading_wrap').hide();
    hideSpinner();

    /**
     * 기존 AVI 리스트 삭제
     */
    var _delParam = {'rqstMgrSeq': mgrSeq};
    _common.callAjax("/tvius/delTransAvi.json", _delParam, function(json) {
      if (!json.result){
        console.log('* An error has occurred. (delAvi)');
      }

    });

    var date = new Date();
    var sysCnt = Number(SYSTEM_AVI_PLAY_CNT);
    var sysDat = Number(SYSTEM_AVI_PLAY_DAT);

    if( sysDat != 0 ){
      date.setDate(date.getDate() + sysDat);
    }

    var playLimitDat = date.getFullYear()+''+dateTwo(date.getMonth()+1)+''+dateTwo(date.getDate())+''+dateTwo(date.getHours())+''+dateTwo(date.getMinutes())+''+dateTwo(date.getSeconds());

    /**
     *  avi 기본키
     *  하나씩 추가 될때마다 값이 늘어남
     */
    var aviMgrSeq = 1;
    /**
     * ajax로 값을 전달하기 위한 변수 선언
     * json으로 저장됨
     */
    var _aviParam = {};

    //테이블의 cctv 정보를 불러옴.
    $('#tbl_cctv_list .cctv_row').each(function() {

      var cctvMgrNo = $(this).find('.cctv_mgr_no').val();

      var sy = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(0,4);
      var sm = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(4,6);
      var sd = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(6,8);
      var sh = $(this).find('[name=cctv_stime]').val();
      var smm = $(this).find('[name=cctv_smin]').val();

      var ey = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(0,4);
      var em = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(4,6);
      var ed = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(6,8);
      var eh = $(this).find('[name=cctv_etime]').val();
      var emm = $(this).find('[name=cctv_emin]').val();

      var secStDat = sy+sm+sd+sh+smm + '00';// tybis는 초 단위 뻄
      var secEdDat = ey+em+ed+eh+emm + '00';// tybis는 초 단위 뻄

      var maskChk = '0';
		if ( SYSTEM_MASKING_YN != 'N'){
			if ( $(this).find('[name=mask_chk]').prop("checked") ){
				maskChk = '2';
			}
		}
      //var exp_avi_pw = $(this).find('[name=cctv_pw]').val();
      var expAviPw = '';

      _aviParam = {};

      _aviParam['mgrSeq'] = aviMgrSeq++;
      _aviParam['rqstMgrSeq'] = mgrSeq;
      _aviParam['cctvMgrNo'] = cctvMgrNo;
      _aviParam['playLimitCnt'] = parseInt(sysCnt);//parseInt('20');
      _aviParam['playLimitDat'] = playLimitDat;
      _aviParam['secStDat'] = secStDat;
      _aviParam['secEdDat'] = secEdDat;
      _aviParam['maskChk'] = maskChk;
      _aviParam['hddSerial'] = HDD_SERIAL;
      _aviParam['macSerial'] = MAC_SERIAL;
      _aviParam['expAviPw'] = expAviPw;
      _aviParam['bakStatCd'] = 'B0';

      _common.callAjax("/tvius/addTransAvi.json", _aviParam, function(json) {
        if (!json.result){
          console.log('* An error has occurred.');
        }

      });

    });

  }

  //rqst param
  if ( saveChk ) {

    _rqstParam['mgrSeq'] = parseInt($('#mgrSeq').val());
    _rqstParam['reqstDat'] = $('#reqstDat').val();

    if(procStatCd == 'ED'){
		_rqstParam['procStatCd'] = 'SN';
	} else{
		_rqstParam['procStatCd'] = 'SW';
	}

    _rqstParam['recvMthd'] = 'FD';
//    _rqstParam['useRsCd'] = '11';
    _rqstParam['crimeLoc'] = '';
    _rqstParam['cctvList'] = $(".aviWrapper").find("#cctvList").val();

    _common.callAjax("/tvius/editTransRqst.json", _rqstParam, function(json) {
      if(json.result){
        alert("영상신청이 수정되었습니다.");
        $('#btn-tvius-view').click();
      }
    });

  }
});

/* 명칭 엔터키 이벤트 입니다. */
/*$("#objName").keyup(function(e){
    if(e.which == 13){
        $("#searchBtn").click();
    }
});*/

/* 검색 버튼 이벤트 입니다. */
/*$("#searchBtn").click(function(){
  var _param = _common.utils.collectSendData(".searchWrapper #searchTable");

  _common.callAjax("/nms/getHistorySearchView.do", _param, function(view) {
    $(".searchResultWrapper").html(view);
  });
});*/

//TODO DatePicker 확인
/* DatePicker 생성 이벤트입니다. */
/*$(".searchWrapper, .rqstWrapper").find(".datePicker").datepicker("destroy").datepicker({
  changeMonth: true,
    changeYear: true,
    dateFormat: "yymmdd",
    showButtonPanel: true,
    beforeShowDay: $.datepicker.noBefore
});

$(".searchWrapper, .aviWrapper").find(".datePicker").datepicker("destroy").datepicker({
  changeMonth: true,
    changeYear: true,
    dateFormat: "yymmdd",
    showButtonPanel: true,
    beforeShowDay: $.datepicker.noBefore
});*/



/**
 * setDatePicker Test
 *
 */
function setDatePicker(){
  $(".datePicker").datepicker("destroy").datepicker({
    changeMonth: true,
      changeYear: true,
      dateFormat: "yy-mm-dd",
      showButtonPanel: true,
      beforeShowDay: $.datepicker.noBefore
  });

  //$(".datePicker").inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});
}

/**
 * 기준시간 기준으로 시작 날짜/시간 과 종료 날짜/시간을 설정한다.
 *
 * @param min
 * @param baseDate
 * @param baseTime
 * @param baseMin
 * @returns {___anonymous30425_30505}
 */
function DateTimeAdd(min, baseDate, baseTime, baseMin){

    var oneMin = 1000 * 60;
    var baseDT = new Date();
    if ( baseDate.length >= 8 ) baseDT = new Date(baseDate.substring(0, 4), parseInt(baseDate.substring(4, 6))-1, baseDate.substring(6, 8), baseTime, baseMin, 0, 0);

    var rstDate = new Date(baseDT.getTime() + (oneMin * min));

    return { d: Date.prototype.formatYMD(rstDate), t: rstDate.getHours(), m: rstDate.getMinutes() };

}

/**
 * 타임 스탬프 값으로 시리얼 키를 생성한다.
 *
 * @returns {Number}
 */
function setSeqNum(){
  var baseTimestamp = 1000 * 60 * 60 * 24 * 365 * 40;
  var currentTimeMillis = new Date().getTime();
  var SerialNumGenPrev = currentTimeMillis - baseTimestamp;

  return SerialNumGenPrev;
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

/**
 * 여러개의 cctv리스트 일 경우 데이터베이스에 값을 변형하여 보낸다.
 *
 */
function setCctvList() {
  var cctvList = [];
  var list_str='';

  $('#tbl_cctv_list .cctv_label').each(function() {
    cctvList.push($(this).text());
  });

  $(".aviWrapper").find("#cctvList").val(cctvList.join(","));

  if(cctvList.length >=2){
    list_str= cctvList[0]+' 등 '+cctvList.length+'개';
    $(".aviWrapper").find("#cctvList").val(list_str);
  }

  //차량추적 추가

  var cctvList = [];
  var list_str='';

  $('#tbl_cctv_list_car .cctv_label').each(function() {
    cctvList.push($(this).text());
  });

  $(".carWrapper").find("#cctvList").val(cctvList.join(","));

  if(cctvList.length >=2){
    list_str= cctvList[0]+' 등 '+cctvList.length+'개';
    $(".carWrapper").find("#cctvList").val(list_str);
  }

}

/** '20140409'날짜형식의 '-'를 추가해준다.
 * @param 문자열
 * @return '-'추가 문자열
 */
function strYmdadd(str, typ){
  if ( typ == undefined ) typ = '-';
  var yy = str.substring(0, 4);
  var mm = str.substring(4, 6);
  var dd = str.substring(6, 8 );
  var date = yy+typ+mm+typ+dd;

  if (date.length == 2) date = '';

  return date;
}

/**
 * 상태버튼을 클릭하였을 때 호출되며, 시작시간 종료시간을 체크하여 테이블에 넣는다.
 *
 * @param st 시작시간
 * @param et 종료시간
 * @param mgrseq //타임스탬프 값
 * @param cctvNo //CCTV 번호
 * @param statDat //시작시간
 * @param endDat //종료시간
 */
function setCctvStat(st, et, rqstMgrSeq, cctvMgrNo, statDat, endDat){

  var addChk = true;

  _common.callAjax("/tvius/getStat.json", {"mgrSeq" : Number(rqstMgrSeq)}, function(json) {

    if( json.result !== undefined){

      if (json.result.length == 1){
        addChk = false;

        var list = json.result;
        var validYn = list[0].validYn;

        if (validYn == "Y"){

          $('#stat_load_bar').hide();

          var arr = [];
          arr = (getDateDiff(st, et));
          var req = [];

          var statArr = list[0].statData.split('/');

          for ( var i = 0 ; i < arr.length; i++ ) {
            var arrTime = Number(arr[i].split(':')[1]);
            var time = arrTime;

            req.push(time+':'+statArr[i]);
          }

          $('#cctv_stat_body').html('');

          for ( var i = 0 ; i < req.length; i++ ) {
            var str = '';
            var arrStatSplit = req[i].split("\:");

            str += '<tr>';
            str += '<td align="center" ><div style="padding:5px;">'+arrStatSplit[0]+'시</div></td>';
            for ( var j = 0; j < arrStatSplit[1].length; j++ ) {
              var StatData = arrStatSplit[1].charAt(j);
              var jCut = String(j).slice(1);

              //10분마다 선색을 다르게 하기 위함.
              if ( j > 8 && j < 60 && jCut == 9 || j == 9 ) {
                str += '<td style="border-right: 3px solid transparent; position: relative;">';// style="border-right: 3px solid #555; position: relative;"
              } else {
                str += '<td>';
              }

              if ( StatData == '0' ) {
                str += '<div class="stat_bar" style="width: 7px; height: 18px; vertical-align: top; display: inline-block; background: #e5603b;"></div>';

              } else {
                str += '<div class="stat_bar on" style="width: 7px; height: 18px; vertical-align: top; display: inline-block; background: #5e90af;"></div>';
              }
              str += '</td>';
            }

            str += '</tr>';
            $('#cctv_stat_body').append(str);
            $('#cctv_stat_title').css('width', '470px');
          }
        } else {

          intervalStat = setTimeout("setCctvStat('"+st+"', '"+et+"', '"+rqstMgrSeq+"', '"+cctvMgrNo+"', '"+statDat+"', '"+endDat+"')", 1000);

        }

      }

    } else {

      intervalStat = setTimeout("setCctvStat('"+st+"', '"+et+"', '"+rqstMgrSeq+"', '"+cctvMgrNo+"', '"+statDat+"', '"+endDat+"')", 1000);

    }
  }, false);

  if ( addChk ) {

    _statParam = {};

    _statParam['mgrSeq'] = Number(rqstMgrSeq);
    _statParam['cctvMgrNo'] = cctvMgrNo;
    _statParam['startDat'] = Date.prototype.strYmdTimeAdd(st);
    _statParam['endDat'] = Date.prototype.strYmdTimeAdd(et);
    _statParam['validYn'] = 'N';

    _common.callAjax("/tvius/addStat.json", _statParam, function(json) {
      if (json.result){
        intervalStat = setTimeout("setCctvStat('"+st+"', '"+et+"', '"+rqstMgrSeq+"', '"+cctvMgrNo+"', '"+statDat+"', '"+endDat+"')", 1000);
      }

    }, false);
  }

}

/**
 * 시작시간과 종료시간의 차이를 구한다 ( 분 )
 *
 * @param s_date 시작시간
 * @param d_date 종료시간
 * @returns {Array} 시간배열
 */
function getDateDiff(s_date,d_date){
  var arr = [];
  var timeChk = true;
    var getDate1 = new Date( parseInt(s_date.substring(0, 4)),parseInt(s_date.substring(4, 6))-1,parseInt(s_date.substring(6, 8)),parseInt(s_date.substring(8, 10)) );
    var getDate2 = new Date( parseInt(d_date.substring(0, 4)),parseInt(d_date.substring(4, 6))-1,parseInt(d_date.substring(6, 8)),parseInt(d_date.substring(8, 10)) );
    var total = (getDate2.getTime() - getDate1.getTime()) / 1000 / 60 / 60;
    var sd = s_date.substring(0, 8);
    var ed = d_date.substring(0, 8);

    var timeCnt	=  parseInt(s_date.substring(8, 10))-1;
    for ( var i = parseInt(s_date.substring(8, 10)); i <= (parseInt(s_date.substring(8, 10)) + total) ; i ++) {
      if ( timeCnt < 23 ) {
        timeCnt++;
        if ( timeChk == false ) {
          arr.push(ed+':'+timeCnt);
        }
      else{
        arr.push(sd+':'+timeCnt);
      }

      } else {
        timeCnt = 0;
        if ( sd != ed ) {
          timeChk = false;
          arr.push(ed+':'+timeCnt);
        } else {
          arr.push(sd+':'+timeCnt);
        }
      }
    }
    return arr;
}

/**
 * 영상반출 미리보기 신청시 현재 선택된 cctv의 상태에 영상 파일이 존재하는지 체크한다.
 *
 * @param mgr
 * @param typ
 * @returns {Boolean}
 */
function getPrevStatChk(mgr, typ){

   var req = false;
   var cctvNm = '';
   var obj = $('.avi_view[mgrseq='+mgr+']');
   var key = $(obj).attr('key');

   var cctvMgrNo = $(obj).attr('mgrno');

   var sd = obj.parent().parent().find('td').eq(3).find('[name=cctv_sdate]').val().replace(/\-/gi, '');
   var st = obj.parent().parent().find('td').eq(3).find('[name=cctv_stime]').val();
   var sm = obj.parent().parent().find('td').eq(3).find('[name=cctv_smin]').val();

  //시간 차이를 구한다.
  var vn_day1 = new Date( sd.substring(0, 4), Number(sd.substring(4, 6))-1, Number(sd.substring(6)), Number(st), Number(sm) );
  vn_day1.setMinutes(vn_day1.getMinutes()-Number(SYSTEM_AVI_PLAY_TIME) );
  var st_yy = vn_day1.getFullYear();
  var st_mm = dateTwo(String(vn_day1.getMonth()+1));
  var st_dd = dateTwo(String(vn_day1.getDate()));
  var st_hh = dateTwo(String(vn_day1.getHours()));
  var st_m=dateTwo(String( vn_day1.getMinutes()));

  var vn_day2 = new Date(sd.substring(0, 4), Number(sd.substring(4, 6))-1, Number(sd.substring(6)), Number(st), Number(sm) );
  vn_day2.setMinutes(vn_day2.getMinutes()+Number(SYSTEM_AVI_PLAY_TIME) );

  var ed_yy = vn_day2.getFullYear();
  var ed_mm = dateTwo(String(vn_day2.getMonth()+1));
  var ed_dd = dateTwo(String(vn_day2.getDate()));
  var ed_hh = dateTwo(String(vn_day2.getHours()));
  var ed_m= dateTwo(String(vn_day2.getMinutes()));

  if ( st_mm == '00' ) st_mm = '12';
  if ( ed_mm == '00' ) ed_mm = '12';

  var sec_st_dat = st_yy+st_mm+st_dd+st_hh+st_m;
  var sec_ed_dat = ed_yy+ed_mm+ed_dd+ed_hh+ed_m;
  var dataChk = getDateChk(sec_st_dat, sec_ed_dat);

  _common.callAjax("/tvius/getStat.json", {"mgrSeq" : Number(mgr)}, function(json) {

    if( json.result !== undefined ){
      if (json.result.length === 0){

        addCctvStat(mgr, cctvMgrNo, sec_st_dat, sec_ed_dat);

        req = false;

        intervalPrev = setTimeout("getPrevStatChk('"+mgr+"')", 3000 );

      } else if ( json.result.length == 1){

        var list = json.result;
        var validYn = list[0].validYn;
        var statData = list[0].statData;

        if (validYn == "N"){

          req = false;
          intervalPrev = setTimeout("getPrevStatChk('"+mgr+"')", 3000 );

        } else {

          statData = statData.replace(/\//gi, '').substr(Number(st_m), Number(dataChk));

          if ( statData.indexOf('1') == -1 ){

            alert('* ' + $(obj).attr('cctvnm') + ' CCTV의 시작시간 ~ 종료시간 사이에 영상이 존재하지 않습니다.\n확인 후 다시 신청하여 주십시오. ');
            //$('#loading_wrap').hide();
            hideSpinner();
            req = false;

          } else {

            req = true;

            if ( typ != 'T') {
              $(obj).click();
            }
          }
        }

      } else {
        alert('* An error has occurred.\r\njson.result.length\r\n' + json.result.length);
      }
    } else {
      alert('* An error has occurred.\r\njson.result undefined.\r\n' + json.result);
    }

  }, false);

  return req;

}

/**
 * 시작시간과 종료시간의 차이를 구한다 ( 시간 )
 *
 * @param s_date 시작시간
 * @param d_date 종료시간
 * @returns {Number} 시간
 */
function getDateChk(s_date,d_date){
    var getDate1 = new Date( parseInt(s_date.substring(0, 4)),parseInt(s_date.substring(4, 6))-1,parseInt(s_date.substring(6, 8)),parseInt(s_date.substring(8, 10)),parseInt(s_date.substring(10, 12)) );
    var getDate2 = new Date( parseInt(d_date.substring(0, 4)),parseInt(d_date.substring(4, 6))-1,parseInt(d_date.substring(6, 8)),parseInt(d_date.substring(8, 10)),parseInt(d_date.substring(10, 12)) );
    var total = (getDate2.getTime() - getDate1.getTime()) / 1000 / 60;

    return total;
}

/**
 * 영상반출 시스템 파라미터를 가져온다.
 */
function getSysParam(){

  /*_common.callAjax("/sysMng/getSysParam.json", null, function(json) {

    if(json.result !== undefined){

      SYSTEM_AVI_PLAY_CNT = json.result[0].avi_play_cnt;		//영상재생횟수
      SYSTEM_AVI_PLAY_DAT = json.result[0].avi_play_dat;		//영상재생기간
      SYSTEM_RENEW_PLAY_CNT = json.result[0].renew_play_cnt;	//연장신청재생횟수
      SYSTEM_RENEW_PLAY_DAT = json.result[0].renew_play_dat;	//연장신청재생기간
      SYSTEM_EVI_PLAY_CNT = json.result[0].evi_play_cnt;		//증거신청재생횟수
      SYSTEM_PREVIEW_PHOTO = json.result[0].preview_photo;		//현장사진권한
      SYSTEM_PREVIEW_AVI = json.result[0].preview_avi;			//미리보기권한
      SYSTEM_FILE_DOWN_CNT = json.result[0].file_down_cnt;		//영상다운횟수제한
      SYSTEM_RQST_LOCK_CNT = json.result[0].rqst_lock_cnt;		//활용결과제한횟수
      SYSTEM_AVI_PLAY_TIME = json.result[0].avi_play_time;		//미리보기시간설정
      SYSTEM_LAST_SMS_DAT = json.result[0].last_sms_dat;		//영상만료확인
      SYSTEM_ADMIN_SMS_LIST = json.result[0].admin_sms_list;	//SMS전송리스트
      SYSTEM_MASKING_YN = json.result[0].masking_yn;			//마스킹유무
      SYSTEM_MASKING_ROUTE_BF = json.result[0].masking_route_bf;	//마스킹전저장경로
      SYSTEM_MASKING_ROUTE_AF = json.result[0].masking_route_af;	//마스킹후저장경로
      SYSTEM_STORAGE_PATH = json.result[0].storage_path;		//영상저장경로
      SYSTEM_UPLOAD_PATH = json.result[0].upload_path;

    }

  },false);*/

}

/**
 * 상태체크 요청 데이터를 테이블에 등록한다.
 *
 * @param mgrseq //타임스탬프 값
 * @param cctvNo //CCTV 번호
 * @param statDat //시작시간
 * @param endDat //종료시간
 */
function addCctvStat(mgrseq, cctvMgrNo, statDat, endDat){

  var _statParam = {};
  _statParam['mgrSeq'] = Number(mgrseq);
  _statParam['cctvMgrNo'] = cctvMgrNo;
  _statParam['startDat'] = Date.prototype.strYmdTimeAdd(statDat);
  _statParam['endDat'] = Date.prototype.strYmdTimeAdd(endDat);
  _statParam['validYn'] = 'N';

  _common.callAjax("/tvius/addStat.json", _statParam, function(json) {});
}

/**
 * cctv테이블에서 시간 설정 시 잘못된 시간이면 css를 변경한다.
 *
 * @param key
 * @param chk
 */
function cctvListChk(tr, chk){
  if ( chk == false ) {
    tr.find('td').eq(3).find('[name=cctv_sdate]').addClass('cctv_list_chk');
    tr.find('td').eq(3).find('[name=cctv_stime]').addClass('cctv_list_chk');
    tr.find('td').eq(3).find('[name=cctv_smin]').addClass('cctv_list_chk');
    tr.find('td').eq(4).find('[name=cctv_edate]').addClass('cctv_list_chk');
    tr.find('td').eq(4).find('[name=cctv_etime]').addClass('cctv_list_chk');
    tr.find('td').eq(4).find('[name=cctv_emin]').addClass('cctv_list_chk');

  } else {
    tr.find('td').eq(3).find('[name=cctv_sdate]').removeClass('cctv_list_chk');
    tr.find('td').eq(3).find('[name=cctv_stime]').removeClass('cctv_list_chk');
    tr.find('td').eq(3).find('[name=cctv_smin]').removeClass('cctv_list_chk');
    tr.find('td').eq(4).find('[name=cctv_edate]').removeClass('cctv_list_chk');
    tr.find('td').eq(4).find('[name=cctv_etime]').removeClass('cctv_list_chk');
    tr.find('td').eq(4).find('[name=cctv_emin]').removeClass('cctv_list_chk');
  }
}

/**
 * CCTV의 설정 시간값이 유효한지 체크한다.
 *
 * @param obj
 */
function cctvTimeChk(obj){
  var key = obj.attr('key');//mgrNo

  var sd = obj.parent().parent().find('td').eq(3).find('[name=cctv_sdate]').val().replace(/\-/gi, '');
  var st = obj.parent().parent().find('td').eq(3).find('[name=cctv_stime]').val();
  var sm = obj.parent().parent().find('td').eq(3).find('[name=cctv_smin]').val();
  var ed = obj.parent().parent().find('td').eq(4).find('[name=cctv_edate]').val().replace(/\-/gi, '');
  var et = obj.parent().parent().find('td').eq(4).find('[name=cctv_etime]').val();
  var em = obj.parent().parent().find('td').eq(4).find('[name=cctv_emin]').val();

  var stat_val = sd+st+dateTwo(sm);
  var end_val = ed+et+dateTwo(em);

  var date = new Date();
  var date_full = date.getFullYear()+''+dateTwo(date.getMonth()+1)+''+dateTwo(date.getDate())+''+dateTwo(date.getHours())+''+dateTwo(date.getMinutes());

  //오늘날짜보다 시작시간이 크면
  if ( stat_val > date_full  ) {
    cctvListChk(obj.parent().parent(), false);
    return false;
  }

  //오늘날짜보다 종료날짜가 크면
  if ( end_val > date_full  ) {
    cctvListChk(obj.parent().parent(), false);
    return false;
  }

  //시작날짜가 종료날짜와 같거나 크면
  if ( stat_val >= end_val  ) {
    cctvListChk(obj.parent().parent(), false);
    return false;
  }

  // 영상 반출 날짜 제한. 한 달 전까지만 반출 가능.
  var date_sd_chk = sd+''+st+''+sm;
  var oneMonthDate = new Date(Date.parse(new Date()) - (1000 * 60 * 60 * 24 * 30) );
  var omd = oneMonthDate.getFullYear()+''+dateTwo(oneMonthDate.getMonth()+1)+''+dateTwo(oneMonthDate.getDate())+''+dateTwo(oneMonthDate.getHours())+''+dateTwo(oneMonthDate.getMinutes());

  if( date_sd_chk < omd){
    cctvListChk(obj.parent().parent(), false);
    return false;
  }

  //종료날짜와 시작날짜가 6시간 차이나면 안된다.
  var date_sd = new Date();
  date_sd.setFullYear(sd.substring(0, 4), (Number(sd.substring(4, 6))-1), Number(sd.substring(6, 8)));
  date_sd.setHours(Number(st));
  date_sd.setMinutes(Number(sm));

  //현재 파일 상단에 시간 값을 정할 수 있도록 올려놨음.
  var sd_chk = new Date(Date.parse(date_sd) + 1000 * 60 * 60 * AVI_LIMIT_TERM);

  var date_ed = new Date();
  date_ed.setFullYear(ed.substring(0, 4), (Number(ed.substring(4, 6))-1), Number(ed.substring(6, 8)));
  date_ed.setHours(Number(et));
  date_ed.setMinutes(Number(em));

  var sd_chk_yy = sd_chk.getFullYear();
  var sd_chk_mm = dateTwo(sd_chk.getMonth()+1);
  var sd_chk_dd = dateTwo(sd_chk.getDate());
  var sd_chk_hh = dateTwo(sd_chk.getHours());
  var sd_chk_min = dateTwo(sd_chk.getMinutes());

  var ed_chk_yy = date_ed.getFullYear();
  var ed_chk_mm = dateTwo(date_ed.getMonth()+1);
  var ed_chk_dd = dateTwo(date_ed.getDate());
  var ed_chk_hh = dateTwo(date_ed.getHours());
  var ed_chk_min = dateTwo(date_ed.getMinutes());

  var sdd = sd_chk_yy+'-'+sd_chk_mm + '-' +sd_chk_dd +'-'+sd_chk_hh+'-'+sd_chk_min;
  var edd = ed_chk_yy+'-'+ed_chk_mm + '-' +ed_chk_dd +'-'+ed_chk_hh+'-'+ed_chk_min;

  if ( sdd < edd) {
    cctvListChk(obj.parent().parent(), false);
    return false;
  }

  cctvListChk(obj.parent().parent(), true);

}

/**
 * 반출정보 수정 시 기존에 신청된 값을 각 입력란에 넣는다.
 *
 * @param rqstMgrSeq
 */
function setRqstInfo(rqstMgrSeq){

  /**
   * 1. Rqst 관련 정보 입력
   */
  var reqGbn = '';
  var _rqstParam ={'mgrSeq': rqstMgrSeq};
  _common.callAjax("/tvius/getTransRqst.json", _rqstParam, function(json) {

    if (json.result !== undefined){
      if (json.result.length == 1){

        var procStatCd = json.result[0].procStatCd;

        $.each(json.result[0], function(key, value){

          if (key == "reqGbnCdRelCdeNm") reqGbn = value;
          var chkList = [ "reqstResn", "crimeTyp", "reqGbnCd" ];
          if (value != null){
            if ($('#'+key).length != 0){
              if ( chkContains(chkList , key) ) {
                if($("#"+key+" option[value='"+value+"']").length > 0)
                  $('#'+key).val(value).attr('select');
                if(procStatCd == "SB" && key == "crimeTyp")
                  $('#'+key).val('').attr('select');
              } else {
                /*if(key == "carInfo"){
                  if(value){
//                    var obj = JSON.parse(value);
                    $('#carLicenseNo').val(obj['carLicenseNo']);
                    var carTypeArr = obj['carKindtype'].split(",");
                    for(var i=0; i< carTypeArr.length; i++){
                      $(".carType[for="+carTypeArr[i]+"]").prop('checked', true);
                    }
                  }
                }else{*/
                  if(procStatCd != "SB" || (procStatCd == "SB" && key != "docNo" && key != "docFileNm" && key != "docFilePath"))
                    $('#'+key).val(value);

                  if(key == "docFileNm"){
                	  $("#fileNmText").text(value);
                  }

                  // 제천 커스터마이징 주석처리
//                  if(key == "docNo"){
//						var docVal = value.split('-');
//						$('#docDept').val(docVal[0]);
//						$('#docNo').val(docVal[1].split('(')[0]);
//						$('#docDate').val(value.split('(')[1].slice(0, -1));
//					}
//                }
              }
            }else{
				if (key == "videoSmy"){
					$("input:radio[name='videoSmy']:radio[value='" + value + "']").prop('checked', true);
				}
			}
          }
        });

      } else {
        alert('* result is not unique.  // ' + json.result.length);
      }
    } else {
      alert('* undefined result. (RQST)');
    }
  }, false);

  var target = '';
  if(reqGbn.contains("반출") || reqGbn == "열람"){
    target = '#tbl_cctv_list';
  }else if(reqGbn == "차량번호"){
    target = '#tbl_cctv_list_car';
    //jquery로 값을 변경하면 change 이벤트로 넘어가지 못해 수동으로 처리
    $('.aviWrapper').hide();
    $('.carWrapper').show();
  }

  if(target != '' ){
    /**
     * 2. Avi 관련 정보 조회
     */
    var list = null;

    var _aviParam ={};
    _aviParam['rqstMgrSeq'] = rqstMgrSeq;
    _aviParam['sortCol'] = 'avi.mgr_seq';
    _aviParam['sortTyp'] = 'ASC';
    _common.callAjax("/tvius/getTransAvi.json", _aviParam, function(json) {

      if (json.result !== undefined){
        for (var i=0; i<json.result.length; i++){

          list = json.result;
        }
      } else {
        alert('* undefined result. (AVI)');
      }
    }, false);

    /**
     * 3. Avi관련 정보 입력
     */
    if (list != null){

      /**
       * 3-1. cctvMgrNo로 CCTV명 조회
       */
      var cctvNm = '';
      var chk = 0;
      var stTime = '';
      var deviceId = '';
      var secSt = '';
      var secEd = '';
      var cctvMgrNo = '';
      var maskChk = '';
      var point;
      //$('#tbl_cctv_list .cctv_row').remove();
      $(target + ' .cctv_row').remove();

      for(var i=0; i<list.length; i++){

        var _cctvParam = {'mgrNo': list[i].cctvMgrNo};
        _common.callAjax("/tvius/getCctvInfo.json", _cctvParam, function(json) {

          if (json.result !== undefined){


              cctvNm = json.result.cctvNm;
              point = Spatial.convertProjection([json.result.lng, json.result.lat], "EPSG:4326", "EPSG:5186");

              SELECTED_CCTV_COUNT++;

              cctvMgrNo = list[i].ctvMgrNo;

              if(deviceId == ''){
                secSt = list[i].secStDat;
                secEd = list[i].secEdDat;
                stTime = secSt;
              }
              else{
                if(deviceId == cctvMgrNo){
                  secSt = list[i].secStDat;
                  secEd = list[i].secEdDat;
                  if(stTime == secSt){
                    secSt = stTime;
                  }
                }
                else{
                  secSt = list[i].secStDat;
                  secEd = list[i].secEdDat;
                }
              }

              deviceId = cctvMgrNo;

              secSt = dateCut(secSt);
              secEd = dateCut(secEd);

              maskChk = list[i].maskChk;

              chk = addCctv(list[i].cctvMgrNo, cctvNm, point, reqGbn, secSt, secEd, maskChk);

          } else {
            alert('* undefined result. (CCTV)');
          }
        }, false);

      }

      //보류(페이지의 맨 마지막으로 이동)
      //$(".contentWrapper").scrollTop($('.searchWrapper').height());

      /**
       * 3-2. CCTV목록 정리
       */
      $('.in_date').inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});

      $('#tbl_cctv_list .cctv_row').each(function() {

        cctvTimeChk($(this).find('[name=cctv_sdate]'));

      });

    }
  }
}

//난수발생기
function getRand() {
	return Math.floor(Math.random() * 10000000);
}


/**
 * CCTV 목록에 CCTV를 추가한다.
 *
 * @param mgrNo
 * @param cctvNm
 */
function addCctv(mgrNo, cctvNm, point, reqGbn){

//  if($("#tbl_cctv_list").find("#cctv_row_" + mgrNo).length > 0){
//    alert("<" + cctvNm + ">\n\n명칭의 카메라는 이미 추가되었습니다.");
//    return false;
//  }

  /**
   *	상태체크 및 미리보기용 신청번호
   *	상태체크와 미리보기는 같은 신청번호를 사용한다.
   */
  var SerialNumGenPrev = setSeqNum();

  var cctvCount = 0;
  var target = '';
  var targetParent = '';
  var baseTimeChk = '';
  if(reqGbn.contains("반출") || reqGbn == "열람"){
    target = '#tbl_cctv_list';
    targetParent = '.aviWrapper';
    cctvCount = SELECTED_CCTV_COUNT;
  }else if(reqGbn == "차량번호"){
    target = '#tbl_cctv_list_car';
    targetParent = '.carWrapper';
    baseTimeChk = '_car';
    cctvCount = SELECTED_CCTV_COUNT_CAR;
  }

  /**
   * 	시작시간 및 종료시간을 설정한다.
   * 	기준시간을 바탕으로 시간이 설정된다.
   */

  var baseDate = $(targetParent).find('#base_date'+baseTimeChk).val().replace(/\-/gi, '');
  var baseTime = $(targetParent).find('#base_time'+baseTimeChk).val();
  var baseMin = $(targetParent).find('#base_min'+baseTimeChk).val();
  var baseTerm = parseInt($(targetParent).find('#base_term'+baseTimeChk).val());
  var sDT = DateTimeAdd( (baseTerm * -1), baseDate, baseTime, baseMin );

  /////////////////////////////////////////////////////////////////////////
  var html = '';
  var $tr = $('<tr class="cctv_row seq_'+cctvCount+'" id="cctv_row_'+mgrNo+'" mgrNo="'+mgrNo+'" mgrSeq="'+mgrSeq+'"></tr>');

  var nowTime = new Date();
  nowTime = nowTime.getTime();

  html = '';
  html += '<td><input type="checkbox" class="chk"></td>';
  //html += '	<td style="width: 200px;">';
  html += '	<td>';
  //html += '		<button class="locBtn" mgrno="'+mgrNo+'"></button>';
  //html += '		<div class="cctv_label mainTooltip" title="'+cctvNm+';" style="width:180px; display:inline-block; overflow:hidden; vertical-align:middle; text-overflow: ellipsis;">'+cctvNm+'</div>';
  html += '		<div class="cctv_label mainTooltip" title="'+cctvNm+';">'+cctvNm+'</div>';
  html += '		<input type="hidden" class="cctv_mgr_no" value="'+mgrNo+'"></td>';
  html += '	</td>';
  $tr.append(html);

  /* 20210130 이주영 */
  html = '';
  html += '	<td class="tCenter">';
  if ( reqGbn != "차량추적") html += '		<button  class="stat_btn cctvPrevBtn btn_t" key="'+mgrNo+'" mgrno="'+mgrNo+'" mgrseq="'+SerialNumGenPrev+'" >상태</button>';
  if ( reqGbn != "차량추적" && SYSTEM_PREVIEW_AVI == 'Y' ) html += '		<button  class="avi_view cctvPrevBtn btn_t" key="'+mgrNo+'" cctvnm="'+cctvNm+'" mgrno = "'+mgrNo+'" mgrseq="'+SerialNumGenPrev+'">동영상</button>';
  //if ( SYSTEM_PREVIEW_PHOTO == 'Y' )html += '		<button  class="img_view cctvPrevBtn" key="'+mgrNo+'">현장사진</button>';
  //html += '		<button  class="tour_view cctvPrevBtn" key="'+mgrNo+'">투어링</button>';
  //html += '		<button  class="road_view cctvPrevBtn" key="'+mgrNo+'" x="'+point[0]+'" y="'+point[1]+'">로드뷰</button>';
  html += '	</td>';
  $tr.append(html);

  html = '';
  //html = '<td style="display:none;"></td>';
  html += '	<td class="sDate">';
  html += '		<input id="'+mgrNo+'_sd_'+getRand()+'" key="'+mgrNo+'" type="text" size="12" class="cctvDate in_date date_input date_cont datePicker" name="cctv_sdate"  style="width:96.5%; vertical-align: middle; text-align: center;" value="'+sDT.d+'">';
  html += '		<select id="'+mgrNo+'_st" key="'+mgrNo+'" class="cctvDateHH time_select date_cont" name="cctv_stime" style="width:56px; vertical-align: middle;">';

  for ( var i = 0; i < 24; i++ ) {
    html += '			<option value="'+dateTwo(i)+'"'+((i==sDT.t)?" selected":"")+'>'+i+'시</option>';
  }

  html += '		</select>';

  html += '		<select id="'+mgrNo+'_sm" key="'+mgrNo+'" class="cctvDateMI time_select date_cont" name="cctv_smin" style="width:57px; vertical-align: middle;">';

  for ( var i = 0; i < 60; i++ ) {
    html += '			<option value="'+dateTwo(i)+'"'+((i==sDT.m)?" selected":"")+'>'+dateTwo(i)+'분</option>';
  }

  html += '		</select>';
  html += '	</td>';
  $tr.append(html);

  html = '';
  html += '	<td class= "eDate">';

  html += '		<input id="'+mgrNo+'_ed_'+getRand()+'" key="'+mgrNo+'" type="text" size="12" class="cctvDate in_date date_input date_cont datePicker" name="cctv_edate"  style="width:96.5%; vertical-align: middle; text-align: center;" value="'+baseDate+'">';
  html += '		<select id="'+mgrNo+'_et" key="'+mgrNo+'" class="cctvDateHH time_select date_cont" name="cctv_etime" style="width:56px; vertical-align: middle;">';

  for ( var i = 0; i < 24; i++ ) {
    html += '			<option value="'+dateTwo(i)+'"'+((i==Number(baseTime))?" selected":"")+'>'+i+'시</option>';
  }

  html += '		</select>';

  html += '		<select id="'+mgrNo+'_em" key="'+mgrNo+'" class="cctvDateMI time_select date_cont" name="cctv_emin" style="width:57px; vertical-align: middle;">';

  for ( var i = 0; i < 60; i++ ) {
    html += '			<option value="'+dateTwo(i)+'"'+((i==Number(baseMin))?" selected":"")+'>'+dateTwo(i)+'분</option>';
  }

  html += '		</select>';
  html += '	</td>';
  $tr.append(html);

  if(SYSTEM_MASKING_YN != "N"){

  html = '';
  // 마스킹
  html += '	<td class="tCenter">';
  html += '		<input id="mask_chk" type="checkbox" name="mask_chk"  style="width:18px; height:18px; vertical-align: middle;">';
  html += '	</td>';
  $tr.append(html);

  }

  html = '';
  // 삭제
  html += '	<td class="tCenter">';
  html += '		<button class="btn_cctv_del innerBtn btn_t" type="del">삭제</button>';
  html += '	</td>';
  $tr.append(html);


  if(reqGbn != "차량번호") statViewBindEvent($tr.find('.stat_btn'));
  if(reqGbn != "차량번호" && SYSTEM_PREVIEW_AVI == 'Y' ) aviViewBindEvent($tr.find('.avi_view'));
  if( SYSTEM_PREVIEW_PHOTO == 'Y' ) imgViewBindEvent($tr.find('.img_view'));
  tourViewBindEvent($tr.find('.tour_view'));
  roadViewBindEvent($tr.find('.road_view'));
  cctvPreViewBindEvent($tr.find('.btn_cctv_preview'));
  delBtnBindEvent($tr.find('.btn_cctv_del'));
  timeBindEvent($tr.find('.time_select, .date_input'));
  maskChkBtnBindEvent($tr.find('#mask_chk'));

  /**
   * 시작, 종료시간이 들어왔을 경우 시간값을 변경해준다.
   */
  if(arguments[4] !== null && arguments[4] !== "" && arguments[4] !== undefined
    && arguments[5] !== null && arguments[5] !== "" && arguments[5] !== undefined){

    var secSt = arguments[4];
    var secEd = arguments[5];

    $tr.find('td').eq(3).find('[name=cctv_sdate]').val(secSt.split('/')[0]);
    $tr.find('td').eq(3).find('[name=cctv_stime]').val(secSt.split('/')[1]);
    $tr.find('td').eq(3).find('[name=cctv_smin]').val(secSt.split('/')[2]);

    $tr.find('td').eq(4).find('[name=cctv_edate]').val(secEd.split('/')[0]);
    $tr.find('td').eq(4).find('[name=cctv_etime]').val(secEd.split('/')[1]);
    $tr.find('td').eq(4).find('[name=cctv_emin]').val(secEd.split('/')[2]);
  }

  /**
   * 마스킹 파라미터가 들어왔을 경우 마스킹 체크 여부를 설정한다.
   */
  if(arguments[6] !== null && arguments[6] !== "" && arguments[6] !== undefined){

    if( $tr.find('td').eq(4).find('[name=mask_chk]').length > 0 ){
      if( arguments[6] != '0' ) $tr.find('td').eq(4).find('[name=mask_chk]').prop("checked", true);
    }

  }

  //tr에 데이터를 추가한다.
  _common.callAjax("/cctv/getCctvList.json", {'mgrNo': mgrNo}, function(json){

    if(json.result.length == 1){
      var prop = {
        gid : json.result[0].gid,
        mgrNo : json.result[0].mgrNo,
        gbnCd : json.result[0].gbnCd,
        angle : json.result[0].viewDir,
        cctvNm : json.result[0].cctvNm,
        channelNo : json.result[0].chnlNo,
        deviceId : json.result[0].deviceId,
        stateCd : (json.result[0].stateCd != "12") ? "정상" : "장애",
        point : Spatial.convertProjection([json.result[0].lng, json.result[0].lat], "EPSG:4326", "EPSG:5186")
      };
      $tr.data(prop);

      $tr.find(".datePicker").datepicker("destroy").datepicker({
        changeMonth: true,
          changeYear: true,
          dateFormat: "yy-mm-dd",
          showButtonPanel: true,
          beforeShowDay: $.datepicker.noBefore
      });

      $tr.find(".in_date").inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});

      $(target).append($tr);

      //!!if(target)
      setCctvList();

      /**
       * cctv의 시간이 유효한지 체크해준다.
       * 임의의 input 셀렉터를 넣어주었음.
       */
      cctvTimeChk($tr.find('td').eq(3).find('[name=cctv_sdate]'));

      // 위치 버튼 이벤트입니다.
      //$('.aviWrapper').find("#tbl_cctv_list").find(".locBtn").off('click');
      $(target).find(".locBtn").off('click');
      $(target).find(".locBtn").click(function(){
        var v = $(this).attr("mgrno");
        var prop = $(this).parent().parent().data();
        try{
          GMXMAP.addPulse(prop.point, true);
        }catch(error){
          alert('위치정보가 없습니다.');
        }

      });

      var $firstTr = $("#tbl_cctv_list").find("tbody").find("tr.cctv_row").eq(0);
      var yyyyMMdd = $firstTr.find(".in_date").eq(1).val();
      var edTime = $firstTr.find(".time_select[name=cctv_etime]").val();
      var edMin = $firstTr.find(".time_select[name=cctv_emin]").val();

      $('.aviWrapper').find('#base_date').val(yyyyMMdd);
      $('.aviWrapper').find('#base_time').val(edTime);
      $('.aviWrapper').find('#base_min').val(edMin);
    }
  },false);

  return cctvCount;

}

/**
 * 입력값이 배열에 포함되는지 확인한다.
 *
 * @param data
 * @param key
 */
function chkContains (data, key ){
  if (key == null || data == null) {
        return false;
    }
    for (var i = 0; i < data.length; i++) {
        if (key == data[i]) {
            return true;
        }
    }
    return false;
}

/**
 * 날짜 데이터 포멧팅을 한다.
 *
 * @param str
 * @returns {String}
 */
function dateCut(str){
  var result='';
  var yy = str.substring(0, 4);
  var mm = str.substring(4, 6);
  var dd = str.substring(6, 8);
  var hh = str.substring(8, 10);
  var min = str.substring(10, 12);

  //result = yy + '-' + mm + '-' + dd + '/' + hh + '/' + min;
  result = yy + mm + dd + '/' + hh + '/' + min;
  return result;
}

/**
 * 현장사진 이미지 태그를 불러온다/.
 *
 * @param cctvMgrNo
 */
function imgList(cctvMgrNo) {

  var _imgParam = {'refMgrNo': cctvMgrNo};
  //var _imgParam = {'refMgrNo': 'HIS0000002'};

  var html = '';

  _common.callAjax("/image/getImgList.json", _imgParam, function(json) {
    //$(".searchResultWrapper").html(view);

    if (json.result !== undefined){
      if (json.result.length >= 1){

        html += "<ul class='slide_img'>";
        for(var i=0; i<json.result.length; i++){

          html += "<li class='img_div' key='"+json.result[i].mgrSeq+"' style=' width:100%; position: relative; height:350px;'>";
          html += '	<span class="imgBox">';
          html += '		<img class="imgs" style="height: 315px; margin-top: 20px;" alt="'+json.result[i].fileNm+'" src="../image/getImage.do?mgrSeq='+json.result[i].mgrSeq+'" k="'+json.result[i].mgrSeq+'">';
          html += '	</span>';
          html += '</li>';

          //html += "<li class='img_div' key='"+json.result[i].mgrSeq+"' style=' width:100%; position: relative; height:250px; margin-bottom:10px;'>";
          //html += "<img  class='info_img'  style='width:100%; height:100%;' src='/crms/imgjsp/img.jsp?imgfile="+json.result[i].mgrSeq()+"'/></li>";

        }
        html += "</ul>";

      } else {
        html = "<div class='not_img' style='font-size: 15px; font-weight: 400; color: #666;'><span style='line-height: 300px;'>현장사진이 존재하지 않습니다.</span></div>";
      }

    } else {
      html = "<div class='not_img'> ERROR</div>";
    }

    $('#cctv_img_list').html(html);


  }, false);

}

/**
 * 투어링 이미지 태그를 불러온다/.
 *
 * @param cctvMgrNo
 */
function tourImgList(cctvMgrNo) {

  /*var deviceId = '';

  //deviceId를 가져온다.
  _common.callAjax("/cctv/getCctv.json", {'mgrNo': cctvMgrNo}, function(json) {
    if(json.result !== undefined) deviceId = json.result.deviceId;
  }, false);

  var html = '';
  $('#cctv_tour_list').html(html);

  if(deviceId){
    _common.callAjax("/tvius/getTourImgList.json", {'deviceId': deviceId}, function(json) {
      if (json.result !== undefined){
        if (json.result.length >= 1){
          html += "<ul class='slide_tour'>";
          for(var i=0; i<json.result.length; i++){
            html += "<li class='img_div' style=' width:100%; position: relative; height:350px; margin-bottom:10px;'>";
            html += '	<span class="imgBox">';
            html += '		<img class="imgs" style="height: 315px; margin-top: 20px;" alt="'+json.result[i]+'" src="../image/getTourImage.do?deviceId='+deviceId+'&fileNm='+json.result[i]+'">';
            html += '	</span>';
            html += '</li>';
          }
          html += "</ul>";
        } else {
          html = "<div class='not_img' style='font-size: 15px; font-weight: 400; color: #666;'><span style='line-height: 300px;'>투어링 사진이 존재하지 않습니다.</span></div>";
        }
      } else {
        html = "<div class='not_img'>ERROR</div>";
      }
      $('#cctv_tour_list').html(html);
    }, false);
  } else {
    html = "<div class='not_img'>투어링 사진이 존재하지 않습니다.</div>";
    $('#cctv_tour_list').html(html);
  }*/

  var html = '';
  $('#cctv_tour_list').html(html);

  _common.callAjax("/tvius/getTourImgList.json", {'mgrNo': cctvMgrNo}, function(json) {
    if (json.result !== undefined){
      if (json.result.length >= 1){
        html += "<ul class='slide_tour'>";
        for(var i=0; i<json.result.length; i++){
          html += "<li class='img_div' style=' width:100%; position: relative; height:350px; margin-bottom:10px;'>";
          html += '	<span class="imgBox">';
          html += '		<img class="imgs" style="height: 315px; margin-top: 20px;" alt="'+json.result[i]+'" src="../image/getTourImage.do?mgrNo='+cctvMgrNo+'&fileNm='+json.result[i]+'">';
          html += '	</span>';
          html += '</li>';
        }
        html += "</ul>";
      } else {
        html = "<div class='not_img' style='font-size: 15px; font-weight: 400; color: #666;'><span style='line-height: 300px;'>투어링 사진이 존재하지 않습니다.</span></div>";
      }
    } else {
      html = "<div class='not_img'>ERROR</div>";
    }
    $('#cctv_tour_list').html(html);
  }, false);
}



/**
 * 작업 시 처리중 화면을 표시한다.
 */
function showSpinner(){
  //var width = $('#overlay-west-contents').width() - $('#overlay-west-side-bar').width();
  //var width = TVIUS_BTN_TVIUS_REG_WEST_SIZE - $('#overlay-west-side-bar').width();
  var width = $(".contentWrapper").width();
  //var height = $('#overlay-west-contents').height();
  var height = $(".contentWrapper").height();
  $("#loading_wrap").width(width);
  $("#loading_wrap").height(height);

  var target = $('#loading_img')[0];
  spinner = new Spinner(spinnerOpts).spin(target);
  $('#loading_wrap').show();

}

function hideSpinner(){

  $('#loading_wrap').hide();

}

function roadViewBindEvent($target){
  $target.click(function(){
    if(DAUM_ROADVIEW_CHK){
      if(geomex.xeus.DaumRoadView.isAlive())
        geomex.xeus.DaumRoadView.destroyRoadView();

      $('#roadview_pop').show();
      geomex.xeus.DaumRoadView.createMarker();
      var x = $(this).attr("x");
      var y = $(this).attr("y");
      var position = Spatial.convertProjection([x,y], "EPSG:5186", "EPSG:4326");
      var rvPosition = new daum.maps.LatLng(position[1], position[0]);
      geomex.xeus.DaumRoadView.createRoadView(rvPosition);
      //$(".contentWrapper").scrollTop($('.searchWrapper').height());
      $(".mCustomScrollBox").scrollTop($(".mCustomScrollBox").height());
      resizeDone();
    } else {
      alert('로드뷰를 사용할 수 없는 PC입니다.');
    }
  });
}

function cctvPreViewBindEvent($target){
  $target.click(function(){
	  var mgrNo = $(this).parent().parent().attr("mgrno");
	  var cctvNm = $(this).parent().parent().find(".cctv_label").text();

	  GMXCCTV.createSinglePlayer({ "mgrNo" : mgrNo, "cctvNm" : cctvNm, "isPreview" : true });
  });
}


$("#roadview_close").click(function() {//find(".aviWrapper").
  // TODO 다른 기능으로 넘어갈때 호출 필요.
  geomex.xeus.DaumRoadView.destroyRoadView();
  $('#roadview_pop').hide();
  resizeDone();
});

function tourViewBindEvent($target){
  $target.click(function(){
    //alert('tour_view : ' + $(this).attr("key"));
    var panYn = "N";
    var cctvMgrNo = $(this).attr('key');

    _common.callAjax("/cctv/getCctv.json", {'mgrNo': cctvMgrNo}, function(json) {
      if(json.result){
        panYn = json.result.panYn;
      }else{
        console.log('cctv not found.');
      }
    }, false);

    if(panYn == "Y"){
      tourImgList(cctvMgrNo);

      $('#cctv_tour_pop').bPopup({
        appendTo: $(".contentWrapper"),
        onClose: function() { $('#cctv_tour_list').html(''); }
      }).reposition();
      $('.slide_tour').bxSlider({
        infiniteLoop: false,
        hideControlOnEnd: true//,
      });
      $('.bx-viewport').css('box-shadow', '0 0 0px');
    } else {
      alert('투어링이 불가능한 CCTV입니다.');
    }
  });
}


$("#cctv_tour_pop_close").click(function() {//.find(".aviWrapper")
  $('#cctv_tour_pop').bPopup().close();
});

//혼선을 방지하기위해 반출구분이 변경되면 CCTV리스트를 초기화한다.
$('#reqGbnCd').change(function(){
  if(Public.StopEvent != null) Public.StopEvent();

  var value = $(this).val();
  if(value == '11' || value == '12'){
    $('.aviWrapper').show();
    $('.carWrapper').hide();
  }else if(value == '14'){
    $('.aviWrapper').hide();
    $('.carWrapper').show();
  }
});

/**
 * 차번반출 신청시 현재 나열된 cctv의 상태에 사진 파일이 존재하는지 체크한다.
 *
 * @param typ
 * @returns {Boolean}
 */
function carStatChk(carKindtype, carLicenseNo){
  var workChk = true;
  var rst = {};
  rst['chk'] = false;
  rst['cctvNm'] = '';
  rst['list'] = [];

  var aviMgrSeq = 1;
  //테이블의 cctv 정보를 불러옴.
  $('#tbl_cctv_list_car .cctv_row').each(function() {
    if(workChk){
      var cctvNm = $(this).find('td').eq(0).find('span').text();
      var cctvMgrNo = $(this).find('.cctv_mgr_no').val();

      var sy = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(0,4);
      var sm = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(4,6);
      var sd = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(6,8);
      var sh = $(this).find('[name=cctv_stime]').val();
      var smm = $(this).find('[name=cctv_smin]').val();

      var ey = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(0,4);
      var em = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(4,6);
      var ed = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(6,8);
      var eh = $(this).find('[name=cctv_etime]').val();
      var emm = $(this).find('[name=cctv_emin]').val();

      var secStDat = sy+sm+sd+sh+smm + '0000000';//차량반출은 밀리세컨드까지 들어가야 함.
      var secEdDat = ey+em+ed+eh+emm + '0000000';//차량반출은 밀리세컨드까지 들어가야 함.


      /*SELECT cctv_no, cctv_nm, lpr_time, car_kindtype, car_license_no, car_img_path_nm,
             car_img_file_nm, line_no
           FROM xeus.vw_lpr_history
      WHERE cctv_no = '02'
        and lpr_time >= '20180709110000000'
        and lpr_time <= '20180709120000000';*/

      //cctvMgrNo로 deviceId를 구해서 파라미터에 넣어야 함.

      var _param = {};
      _param['cctvMgrNo'] = cctvMgrNo;
      _param['startDat'] = secStDat;
      _param['endDat'] = secEdDat;
      _param['carKindtype'] = carKindtype;
      _param['carLicenseNo'] = carLicenseNo;
      _common.callAjax("/tvius/getCarSchList.json", _param, function(json) {
        if(json.count > 0){
          rst['chk'] = true;
          var obj = {};
          obj['aviMgrSeq'] = aviMgrSeq;
          obj['cctvMgrNo'] = cctvMgrNo;
          obj['secStDat'] = secStDat.substring(0,14);
          obj['secEdDat'] = secEdDat.substring(0,14);
          obj['fileNm'] = [];
          var fileNm = [];
          for(var i=0; i< json.result.length; i++){
            fileNm.push(json.result[i]['carImgPathNm'] + '-' + json.result[i]['carImgFileNm']);
          }
          obj['fileNm'] = fileNm;
          rst['list'].push(obj);
          aviMgrSeq++;
        }else{
          rst['chk'] = false;
          rst['cctvNm'] = cctvNm;
          rst['list'] = [];
          workChk = false;
          //return false;
        }
          }, false);
    }/*else{
      rst['chk'] = false;
      rst['cctvNm'] = '';
      rst['list'] = [];
      return false;
    }*/
  });

  return rst;
}

$(".carAllChk").change(function(){
  var target = $(this).attr("for");

  if($(this).is(":checked"))
    $('.'+target).prop('checked', true);
  else
    $('.'+target).prop('checked', false);
});


/**
 * 신청
 */
$(".carWrapper").find("#btn_car_save").click(function(e) {

  //$(this).off(e); // 빠른 더블클릭 금지하기..

  var saveChk = true;

  //신청하려는 CCTV의 시간값 유효성을 체크
  if ( $(".carWrapper").find('.cctv_list_chk').length != 0 ) {
    alert('* CCTV 시작시간과 종료시간이 잘못 설정되었습니다.\n 다시 설정하여 주십시오.');
    $(".carWrapper").find('.cctv_list_chk').focus();
    saveChk = false;
    return false;
  }

  var _rqstParam = _common.utils.collectSendData($(".contentWrapper .rqstWrapper"));
  //_param['test_id'] = 'test_val';
  //_param['recvMthd'] = 'FD';

  $.each(_rqstParam,function(key,value) {

    if (value == ""){

      if ( $('#'+key).attr('intype') == "C" ) {
        alert('* '+$('#lbl_'+key).text() + ' 항목을 선택하여 주십시오.');
        $('#'+key).focus();
        saveChk = false;
        return false;
      } /*else if (key == "crimeLoc"){
      }*/

      else {
        alert('* '+$('#lbl_'+key).text() + ' 입력은 필수입니다.');
        $('#'+key).focus();
        saveChk = false;
        return false;
      }
    }

  });

  //cctvList 파악
  if (saveChk){
    var cctvList = $(".carWrapper").find("#cctvList").val();
    if ( cctvList == ""){
      alert('* CCTV를 선택하여 주십시오.');
      saveChk = false;
      return false;
    }
    _rqstParam['cctvList'] = cctvList;
  }

  //같은 CCTV, 같은 시작~종료시간이 존재할경우 체크
  if ( saveChk  && ( $('#reqGbnCd').val() == '14')){
    var cctv_arry = [];
    var cctv_row  = $('#tbl_cctv_list_car .cctv_row');

    cctv_row.each(function(i){
      cctv_arry.push(
          $(this).attr('id') + '/' +
          $(this).find('td').eq(3).find('[name=cctv_sdate]').val() +
          $(this).find('td').eq(3).find('[name=cctv_stime]').val() +
          $(this).find('td').eq(3).find('[name=cctv_smin]').val() + '/' +
          $(this).find('td').eq(4).find('[name=cctv_edate]').val() +
          $(this).find('td').eq(4).find('[name=cctv_etime]').val() +
          $(this).find('td').eq(4).find('[name=cctv_emin]').val() ) ;

    });

    for (var i=0; i<cctv_arry.length; i++){
      for (var j=0; j<cctv_arry.length; j++){
        if( i != j ) {
          if( cctv_arry[i] == cctv_arry[j] ) {
            alert('CCTV,시작시간,종료시간이 모두 같은 건이 있는지 확인하여 주십시오.');

            $(this).focus();
            saveChk = false;
            return false;
            break;
          }
        }
      }
    }
  }

  //avi param
  if ( saveChk ){

    var stat;
    showSpinner();
    if ( $('#reqGbnCd').val() == '14' ) {
      var carKindtype = new Array();
      $(".carWrapper").find(".carType").each(function(){
        if($(this).is(":checked")) carKindtype.push($(this).attr("for"));
      });
      if(carKindtype.length == 0){
        alert('차량유형을 선택하여 주십시오.');
        hideSpinner();
        return false;
      }
      var carLicenseNo = $(".carWrapper").find("#carLicenseNo").val();

      stat = carStatChk(carKindtype.toString(), carLicenseNo);//!!
      if ( stat['chk'] == false ) {
        alert( stat['cctvNm'] + ' CCTV의 시작시간 ~ 종료시간 사이에 영상이 존재하지 않습니다.\n확인 후 다시 신청하여 주십시오. ');
        hideSpinner();
        return false;
      }
    }
    hideSpinner();


    //return false;

    //json 생성
    var _param = {};
    _param["mgrSeq"] = mgrSeq;
        _param["jsonTxt"] = encodeURIComponent(JSON.stringify(stat['list']));
        _common.callAjax("/tvius/makeCarInfoJson.json", _param, function(json) {
      if (json.result){
        var obj = {};
        obj['carKindtype'] = carKindtype.toString();
        obj['carLicenseNo'] = carLicenseNo;
        $(".carWrapper").find('#carInfo').val(JSON.stringify(obj));
      }else {
        alert('* An error has occurred.');
      }
    }, false);

    var date = new Date();
    var sysCnt = Number(SYSTEM_AVI_PLAY_CNT);
    var sysDat = Number(SYSTEM_AVI_PLAY_DAT);

    if( sysDat != 0 ){
      date.setDate(date.getDate() + sysDat);
    }

    var playLimitDat = date.getFullYear()+''+dateTwo(date.getMonth()+1)+''+dateTwo(date.getDate())+''+dateTwo(date.getHours())+''+dateTwo(date.getMinutes())+''+dateTwo(date.getSeconds());

    /**
     *  avi 기본키
     *  하나씩 추가 될때마다 값이 늘어남
     */
    //var aviMgrSeq = 1;
    /**
     * ajax로 값을 전달하기 위한 변수 선언
     * json으로 저장됨
     */
    var _aviParam = {};

    //테이블의 cctv 정보를 불러옴.
    for(var j=0; j<stat['list'].length; j++){
      _aviParam = {};
      _aviParam['mgrSeq'] = stat['list'][j]['aviMgrSeq'];
      _aviParam['rqstMgrSeq'] = mgrSeq;
      _aviParam['cctvMgrNo'] = stat['list'][j]['cctvMgrNo'];
      _aviParam['playLimitCnt'] = parseInt(sysCnt);//parseInt('20');
      _aviParam['playLimitDat'] = playLimitDat;
      _aviParam['secStDat'] = stat['list'][j]['secStDat'];
      _aviParam['secEdDat'] = stat['list'][j]['secEdDat'];
      _aviParam['bakStatCd'] = 'B0';

      _common.callAjax("/tvius/addTransAvi.json", _aviParam, function(json) {
        if (!json.result){
          alert('* An error has occurred.');
        }
      });
    }




    /*$('#tbl_cctv_list_car .cctv_row').each(function() {

      var cctvMgrNo = $(this).find('.cctv_mgr_no').val();

      var sy = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(0,4);
      var sm = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(4,6);
      var sd = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(6,8);
      var sh = $(this).find('[name=cctv_stime]').val();
      var smm = $(this).find('[name=cctv_smin]').val();

      var ey = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(0,4);
      var em = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(4,6);
      var ed = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(6,8);
      var eh = $(this).find('[name=cctv_etime]').val();
      var emm = $(this).find('[name=cctv_emin]').val();

      var secStDat = sy+sm+sd+sh+smm + '00';//초단위까지 입력
      var secEdDat = ey+em+ed+eh+emm + '00';//초단위까지 입력

      _aviParam = {};

      _aviParam['mgrSeq'] = aviMgrSeq++;
      _aviParam['rqstMgrSeq'] = mgrSeq;
      _aviParam['cctvMgrNo'] = cctvMgrNo;
      _aviParam['playLimitCnt'] = parseInt(sysCnt);//parseInt('20');
      _aviParam['playLimitDat'] = playLimitDat;
      _aviParam['secStDat'] = secStDat;
      _aviParam['secEdDat'] = secEdDat;
      _aviParam['bakStatCd'] = 'B0';

      _common.callAjax("/tvius/addTransAvi.json", _aviParam, function(json) {
        if (!json.result){
          alert('* An error has occurred.');
        }
      });
    });*/
  }

  //rqst param
  if ( saveChk ) {

    _rqstParam['mgrSeq'] = parseInt($('#mgrSeq').val());
    _rqstParam['useRsCd'] = '11';
    _rqstParam['crimeLoc'] = '';
    _rqstParam['carInfo'] = $(".carWrapper").find('#carInfo').val();

    _common.callAjax("/tvius/addTransRqst.json", _rqstParam, function(json) {
      if(json.result){
        _common.callAjax("/ws/noticeCrmsTransRqstToTviusMng.json", { "json" : JSON.stringify(json.crmsTransRqstVo) }, function(data) {
          if(data.result){
            alert("영상신청이 등록되었습니다.");
            if(chkMenu == 'usr')
              $('#btn-tvius-view').click();
            else
              $('#btn-tvius-rqst-view').click();
          }
        },false);

      }
    });

  }
});


/**
 * 수정
 */
$(".carWrapper").find("#btn_car_edit").click(function(e) {
  //$(this).off(e); // 빠른 더블클릭 금지하기..
  var saveChk = true;

  //신청하려는 CCTV의 시간값 유효성을 체크
  if ( $(".carWrapper").find('.cctv_list_chk').length != 0 ) {
    alert('* CCTV 시작시간과 종료시간이 잘못 설정되었습니다.\n 다시 설정하여 주십시오.');
    $(".carWrapper").find('.cctv_list_chk').focus();
    return false;
  }

  var _rqstParam = _common.utils.collectSendData($(".contentWrapper .rqstWrapper"));
  //_param['test_id'] = 'test_val';
  //_param['recvMthd'] = 'FD';

  $.each(_rqstParam,function(key,value) {

    if (value == ""){

      if ( $('#'+key).attr('intype') == "C" ) {
        alert('* '+$('#lbl_'+key).text() + ' 항목을 선택하여 주십시오.');
        $('#'+key).focus();
        saveChk = false;
        return false;
      } /*else if (key == "crimeLoc"){
      }*/ else {
        alert('* '+$('#lbl_'+key).text() + ' 입력은 필수입니다.');
        $('#'+key).focus();
        saveChk = false;
        return false;
      }
    }

  });

  //cctvList 파악

  var cctvList = $(".carWrapper").find("#cctvList").val();
  if ( cctvList == ""){
    alert('* CCTV를 선택하여 주십시오.');
    saveChk = false;
    return false;
  }
  _rqstParam['cctvList'] = cctvList;

  //같은 CCTV, 같은 시작~종료시간이 존재할경우 체크
  if ( saveChk  && ( $('#reqGbnCd').val() == '14')){
    var cctv_arry = [];
    var cctv_row  = $('#tbl_cctv_list_car .cctv_row');

    cctv_row.each(function(i){
      cctv_arry.push(
          $(this).attr('id') + '/' +
          $(this).find('td').eq(3).find('[name=cctv_sdate]').val() +
          $(this).find('td').eq(3).find('[name=cctv_stime]').val() +
          $(this).find('td').eq(3).find('[name=cctv_smin]').val() + '/' +
          $(this).find('td').eq(4).find('[name=cctv_edate]').val() +
          $(this).find('td').eq(4).find('[name=cctv_etime]').val() +
          $(this).find('td').eq(4).find('[name=cctv_emin]').val() ) ;

    });

    for (var i=0; i<cctv_arry.length; i++){
      for (var j=0; j<cctv_arry.length; j++){
        if( i != j ) {
          if( cctv_arry[i] == cctv_arry[j] ) {
            alert('CCTV,시작시간,종료시간이 모두 같은 건이 있는지 확인하여 주십시오.');

            $(this).focus();
            saveChk = false;
            return false;
            break;
          }
        }
      }
    }
  }

  //avi param
  if ( saveChk ){

    var stat;
    showSpinner();
    if ( $('#reqGbnCd').val() == '14' ) {
      var carKindtype = new Array();
      $(".carWrapper").find(".carType").each(function(){
        if($(this).is(":checked")) carKindtype.push($(this).attr("for"));
      });
      if(carKindtype.length == 0){
        alert('차량유형을 선택하여 주십시오.');
        hideSpinner();
        return false;
      }
      var carLicenseNo = $(".carWrapper").find("#carLicenseNo").val();

      stat = carStatChk(carKindtype.toString(), carLicenseNo);//!!
      if ( stat['chk'] == false ) {
        alert( stat['cctvNm'] + ' CCTV의 시작시간 ~ 종료시간 사이에 영상이 존재하지 않습니다.\n확인 후 다시 신청하여 주십시오. ');
        hideSpinner();
        return false;
      }
    }
    hideSpinner();

    //json 생성
    var _param = {};
    _param["mgrSeq"] = mgrSeq;
        _param["jsonTxt"] = encodeURIComponent(JSON.stringify(stat['list']));
        _common.callAjax("/tvius/makeCarInfoJson.json", _param, function(json) {
          if (json.result){
        var obj = {};
        obj['carKindtype'] = carKindtype.toString();
        obj['carLicenseNo'] = carLicenseNo;
        $(".carWrapper").find('#carInfo').val(JSON.stringify(obj));
      }else {
        alert('* An error has occurred.');
      }
    }, false);

    /**
     * 기존 AVI 리스트 삭제
     */
    var _delParam = {'rqstMgrSeq': mgrSeq};
    _common.callAjax("/tvius/delTransAvi.json", _delParam, function(json) {
      if (!json.result){
        console.log('* An error has occurred. (delAvi)');
      }

    });

    var date = new Date();
    var sysCnt = Number(SYSTEM_AVI_PLAY_CNT);
    var sysDat = Number(SYSTEM_AVI_PLAY_DAT);

    if( sysDat != 0 ){
      date.setDate(date.getDate() + sysDat);
    }

    var playLimitDat = date.getFullYear()+''+dateTwo(date.getMonth()+1)+''+dateTwo(date.getDate())+''+dateTwo(date.getHours())+''+dateTwo(date.getMinutes())+''+dateTwo(date.getSeconds());

    /**
     *  avi 기본키
     *  하나씩 추가 될때마다 값이 늘어남
     */
    var aviMgrSeq = 1;
    /**
     * ajax로 값을 전달하기 위한 변수 선언
     * json으로 저장됨
     */
    var _aviParam = {};

    //테이블의 cctv 정보를 불러옴.
    $('#tbl_cctv_list_car .cctv_row').each(function() {

      var cctvMgrNo = $(this).find('.cctv_mgr_no').val();

      var sy = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(0,4);
      var sm = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(4,6);
      var sd = $(this).find('[name=cctv_sdate]').val().replace(/\-/gi, '').substring(6,8);
      var sh = $(this).find('[name=cctv_stime]').val();
      var smm = $(this).find('[name=cctv_smin]').val();

      var ey = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(0,4);
      var em = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(4,6);
      var ed = $(this).find('[name=cctv_edate]').val().replace(/\-/gi, '').substring(6,8);
      var eh = $(this).find('[name=cctv_etime]').val();
      var emm = $(this).find('[name=cctv_emin]').val();

      var secStDat = sy+sm+sd+sh+smm + '00';//초단위까지 입력
      var secEdDat = ey+em+ed+eh+emm + '00';//초단위까지 입력

      _aviParam = {};

      _aviParam['mgrSeq'] = aviMgrSeq++;
      _aviParam['rqstMgrSeq'] = mgrSeq;
      _aviParam['cctvMgrNo'] = cctvMgrNo;
      _aviParam['playLimitCnt'] = parseInt(sysCnt);//parseInt('20');
      _aviParam['playLimitDat'] = playLimitDat;
      _aviParam['secStDat'] = secStDat;
      _aviParam['secEdDat'] = secEdDat;
      _aviParam['bakStatCd'] = 'B0';

      _common.callAjax("/tvius/addTransAvi.json", _aviParam, function(json) {
        if (!json.result){
          console.log('* An error has occurred.');
        }

      });

    });

  }

  //rqst param
  if ( saveChk ) {

    _rqstParam['mgrSeq'] = parseInt($('#mgrSeq').val());
    _rqstParam['reqstDat'] = $('#reqstDat').val();
    _rqstParam['procStatCd'] = 'SW';
    _rqstParam['recvMthd'] = 'FD';
    _rqstParam['useRsCd'] = '11';
    _rqstParam['crimeLoc'] = '';
    _rqstParam['carInfo'] = $(".carWrapper").find('#carInfo').val();

    _common.callAjax("/tvius/editTransRqst.json", _rqstParam, function(json) {
      if(json.result){
        alert("영상신청이 수정되었습니다.");
        $('#btn-tvius-view').click();
      }
    });

  }
});
/*
 * 파일 선태 클릭 시
 */
$(".contentWrapper").find("#fileNm").click(function(e) {

  $(".contentWrapper").find("#uploadImg").click();

});

/**
 * 공문 업로드 이벤트 입니다.
 */
$(".contentWrapper").find("#uploadImg").on("change", function(){
  var val = $(this).val();
  if(val != ""){
    _common.formSubmit("/tvius/addDocFile.json", $(".contentWrapper").find("#hiddenDocForm"), function(json){
      if(json.exception){
        alert(json.exception);
        $("#uploadImg").val("");
        $("#docFileNm").val("");
        $("#docFilePath").val("");
      }else if(json.realNm != null && json.uploadNm != null){
//				if(json.uploadNm.length >7){
//					$("#fileNm").text(json.uploadNm.substring(0,6)+'...');
//				}else{
//					$("#fileNm").text(json.uploadNm);
//				}
        $("#fileNmText").text(json.uploadNm);
        $("#docFileNm").val(json.uploadNm);
        $("#docFilePath").val(json.realNm);
      }
    });
  }
});


/**
 * 일괄 삭제
*/

$(".contentWrapper").find("#delAll").click(function(e) {
	  var isCheck = false;

	  /*$("#tbl_cctv_list").find(".chk").each(function(){
		  if($(this).prop("checked")){
			  isCheck = true;
		  }
	  })

	  if(!isCheck){
		  alert("CCTV를 먼저 체크해주세요.");
		  return;
	  }*/

	  if(confirm("일괄 삭제 하시겠습니까?")){
		  $("#tbl_cctv_list").find(".chk").each(function(){
			  $(this).prop("checked",false);
			  $(this).parent().parent().find(".btn_cctv_del").click();
		  })

		  var cctvRowCnt = $('#tbl_cctv_list > tbody').find('tr').length-1;
		  $('#lbl_cctvList').text("CCTV 선택(총 "+cctvRowCnt+"대)")
	  }
});

/**
 * 선택 삭제
*/

$(".contentWrapper").find("#delChkBox").click(function(e) {
	  if(confirm("선택한 카메라를 삭제 하시겠습니까?")){
		  var isCheck = false;
		  $("#tbl_cctv_list").find(".chk").each(function(){
			  if($(this).prop("checked")){
				  isCheck = true;
				  $(this).prop("checked",false);
				  $(this).parent().parent().find(".btn_cctv_del").click();
			  }
		  })
		  if(!isCheck){
			  alert("CCTV를 먼저 체크해주세요.");
		  }

		  var cctvRowCnt = $('#tbl_cctv_list > tbody').find('tr').length-1;
		  $('#lbl_cctvList').text("CCTV 선택(총 "+cctvRowCnt+"대)");
	  }
});


/**
 * 시간 일괄 적용
*/

$(".contentWrapper").find("#applyAll").click(function(e) {

  var rowCnt = $("#tbl_cctv_list").find(".chk").length

  if(rowCnt == 0){
    alert("CCTV를 먼저 선택해주세요.");
    return;
  }

  	var date = new Date();
	var month = (date.getMonth() + 1);
	var day = date.getDate();
	var sHrs = date.getHours() - 1;
	var eHrs = date.getHours();
	var lastDate = new Date(Date.prototype.getY(), month, 0).getDate();

	if(month < 10) month = '0' + month;
	if(day < 10) day = '0' + day;
	if(sHrs < 10) sHrs = '0' + sHrs;
	if(eHrs < 10) eHrs = '0' + eHrs;

  var _html = '';
  _html += ' <div class="popupWrapper">';
  _html += ' 	<div id="applyAllPopup" style="margin-top:35px">';
  _html += ' 		<p class="tCenter">시작 시간(일괄 적용)</p>';
  _html += ' 		<div class="sDate">';
  _html += ' 			<table>';
  _html += ' 				<tr>';
  _html += '					<td><select class="tCenter cctvDateYY" style="width:60px;">';
  _html += '						<option value="' + Number(Date.prototype.getY()-1) + '">' + Number(Date.prototype.getY()-1) + '</option>';
  _html += '						<option selected="true" value="' + Date.prototype.getY() + '">' + Date.prototype.getY() + '</option>';
  _html += '						</select>년</td>';
  _html += '					<td><select class="tCenter cctvDateMM" style="width:40px;">';
  									for(var i=1; i<=12; i++){
  										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
  									}
  _html += '						</select>월</td>';
  _html += '					<td><select class="tCenter cctvDateDD" style="width:40px;">';
									for(var i=1; i<=lastDate; i++){
										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
										}
  _html += '						</select>일</td>';
  _html += '					<td><select class="tCenter cctvDateHH" style="width:40px;">';
									for(var i=0; i<=23; i++){
										if(i<10) i = '0' + i;
	_html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>시</td>';
	_html += '					<td><select class="tCenter cctvDateMI" style="width:40px;">';
									for(var i=0; i<=59; i++){
										if(i<10) i = '0' + i;
    _html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>분</td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" placeholder="년" required onKeyPress="if(this.value.length==4) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td>';
  _html += ' 				</tr>';
  _html += ' 			</table>';
  _html += ' 		</div>';

  _html += ' 		<p style="margin-top:35px" class="tCenter">종료 시간(일괄 적용)</p>';
  _html += ' 		<div class="eDate">';
  _html += ' 			<table>';
  _html += ' 				<tr>';
  _html += '					<td><select class="tCenter cctvDateYY" style="width:60px;">';
  _html += '						<option value="' + Number(Date.prototype.getY()-1) + '">' + Number(Date.prototype.getY()-1) + '</option>';
  _html += '						<option selected="true" value="' + Date.prototype.getY() + '">' + Date.prototype.getY() + '</option>';
  _html += '						</select>년</td>';
  _html += '					<td><select class="tCenter cctvDateMM" style="width:40px;">';
  									for(var i=1; i<=12; i++){
  										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
  									}
  _html += '						</select>월</td>';
  _html += '					<td><select class="tCenter cctvDateDD" style="width:40px;">';
									for(var i=1; i<=lastDate; i++){
										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
										}
  _html += '						</select>일</td>';
  _html += '					<td><select class="tCenter cctvDateHH" style="width:40px;">';
									for(var i=0; i<=23; i++){
										if(i<10) i = '0' + i;
	_html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>시</td>';
	_html += '					<td><select class="tCenter cctvDateMI" style="width:40px;">';
									for(var i=0; i<=59; i++){
										if(i<10) i = '0' + i;
    _html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>분</td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" placeholder="년" required onKeyPress="if(this.value.length==4) return false;" value="<%= DateUtil.getStrYear() %>"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td>';
  _html += ' 				</tr>';
  _html += ' 			</table>';

  _html += ' 		</div>';

  _html += ' 		<div>';
  _html += ' 			<button id="btn_save" class="btn_style" style="margin-top: 30px;">적용</button>';
  _html += ' 		</div>';

  _html += ' 	</div>';
  _html += ' </div>';


  $("#popupWrap").dialog("close").html(_html).dialog({
      title: '시간 일괄 적용',
      width: 520,
      height: 370,
      position: {
        my: "center top",
        at: "center top",
        of: $("#contentWrap")
      },
      modal: true,
      open: function(){
        //현재 년도 자동 입력
//        var now = new Date();
//        var year = now.getFullYear();
//        $(".popupWrapper").find('#applyAllPopup').find('.cctvDateYY').val(year);
    	  $(".popupWrapper").find('#applyAllPopup').find('.cctvDateMM').val(month).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.cctvDateDD').val(day).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.sDate').find('.cctvDateHH').val(sHrs).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.eDate').find('.cctvDateHH').val(eHrs).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.cctvDateMI').val('00').prop("selected", true);

        bindClickEventBtnSave();
        bindChnageEventTime();

      },
      close: function(){

      }
    }).dialog("open");


});




/**
 * 시간 선택 적용
*/

$(".contentWrapper").find("#applyChkBox").click(function(e) {

  var rowCnt = $("#tbl_cctv_list").find(".chk").length

  if(rowCnt == 0){
    alert("CCTV를 먼저 선택해주세요.");
    return;
  }

  var chkCnt = 0;
  $("#tbl_cctv_list").find(".chk").each(function(){
	  if($(this).prop("checked")) chkCnt++;
  })

  if(chkCnt == 0){
	  alert("CCTV를 먼저 체크해주세요.");
    return;
  }

	var date = new Date();
	var month = (date.getMonth() + 1);
	var day = date.getDate();
	var sHrs = date.getHours() - 1;
	var eHrs = date.getHours();
	var lastDate = new Date(Date.prototype.getY(), month, 0).getDate();

	if(month < 10) month = '0' + month;
	if(day < 10) day = '0' + day;
	if(sHrs < 10) sHrs = '0' + sHrs;
	if(eHrs < 10) eHrs = '0' + eHrs;

  var _html = '';
  _html += ' <div class="popupWrapper">';
  _html += ' 	<div id="applyAllPopup" style="margin-top:35px">';
  _html += ' 		<p class="tCenter">시작 시간(일괄 적용)</p>';
  _html += ' 		<div class="sDate">';
  _html += ' 			<table>';
  _html += ' 				<tr>';
  _html += '					<td><select class="tCenter cctvDateYY" style="width:60px;">';
  _html += '						<option value="' + Number(Date.prototype.getY()-1) + '">' + Number(Date.prototype.getY()-1) + '</option>';
  _html += '						<option selected="true" value="' + Date.prototype.getY() + '">' + Date.prototype.getY() + '</option>';
  _html += '						</select>년</td>';
  _html += '					<td><select class="tCenter cctvDateMM" style="width:40px;">';
  									for(var i=1; i<=12; i++){
  										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
  									}
  _html += '						</select>월</td>';
  _html += '					<td><select class="tCenter cctvDateDD" style="width:40px;">';
									for(var i=1; i<=lastDate; i++){
										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
										}
  _html += '						</select>일</td>';
  _html += '					<td><select class="tCenter cctvDateHH" style="width:40px;">';
									for(var i=0; i<=23; i++){
										if(i<10) i = '0' + i;
	_html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>시</td>';
	_html += '					<td><select class="tCenter cctvDateMI" style="width:40px;">';
									for(var i=0; i<=59; i++){
										if(i<10) i = '0' + i;
    _html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>분</td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" placeholder="년" required onKeyPress="if(this.value.length==4) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td>';
  _html += ' 				</tr>';
  _html += ' 			</table>';
  _html += ' 		</div>';

  _html += ' 		<p style="margin-top:35px" class="tCenter">종료 시간(일괄 적용)</p>';
  _html += ' 		<div class="eDate">';
  _html += ' 			<table>';
  _html += ' 				<tr>';
  _html += '					<td><select class="tCenter cctvDateYY" style="width:60px;">';
  _html += '						<option value="' + Number(Date.prototype.getY()-1) + '">' + Number(Date.prototype.getY()-1) + '</option>';
  _html += '						<option selected="true" value="' + Date.prototype.getY() + '">' + Date.prototype.getY() + '</option>';
  _html += '						</select>년</td>';
  _html += '					<td><select class="tCenter cctvDateMM" style="width:40px;">';
  									for(var i=1; i<=12; i++){
  										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
  									}
  _html += '						</select>월</td>';
  _html += '					<td><select class="tCenter cctvDateDD" style="width:40px;">';
									for(var i=1; i<=lastDate; i++){
										if(i<10) i = '0' + i;
  _html += '							<option value="' + i + '">' + i + '</option>';
										}
  _html += '						</select>일</td>';
  _html += '					<td><select class="tCenter cctvDateHH" style="width:40px;">';
									for(var i=0; i<=23; i++){
										if(i<10) i = '0' + i;
	_html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>시</td>';
	_html += '					<td><select class="tCenter cctvDateMI" style="width:40px;">';
									for(var i=0; i<=59; i++){
										if(i<10) i = '0' + i;
    _html += '							<option value="' + i + '">' + i + '</option>';
										}
	_html += '						</select>분</td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateYY" placeholder="년" required onKeyPress="if(this.value.length==4) return false;" value="<%= DateUtil.getStrYear() %>"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMM" placeholder="월" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateDD" placeholder="일" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateHH" placeholder="시" required onKeyPress="if(this.value.length==2) return false;"></td>';
//  _html += ' 					<td><input type="number" pattern="[0-9]*" class="tCenter cctvDateMI" placeholder="분" required onKeyPress="if(this.value.length==2) return false;"></td>';
  _html += ' 				</tr>';
  _html += ' 			</table>';

  _html += ' 		</div>';

  _html += ' 		<div>';
  _html += ' 			<button id="btn_save" class="btn_style" style="margin-top: 30px;">적용</button>';
  _html += ' 		</div>';

  _html += ' 	</div>';
  _html += ' </div>';


  $("#popupWrap").dialog("close").html(_html).dialog({
      title: '시간 선택 적용',
      width: 520,
      height: 370,
      position: {
        my: "center top",
        at: "center top",
        of: $("#contentWrap")
      },
      modal: true,
      open: function(){
        //현재 년도 자동 입력
//        var now = new Date();
//        var year = now.getFullYear();
//        $(".popupWrapper").find('#applyAllPopup').find('.cctvDateYY').val(year);
    	  $(".popupWrapper").find('#applyAllPopup').find('.cctvDateMM').val(month).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.cctvDateDD').val(day).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.sDate').find('.cctvDateHH').val(sHrs).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.eDate').find('.cctvDateHH').val(eHrs).prop("selected", true);
    	  $(".popupWrapper").find('#applyAllPopup').find('.cctvDateMI').val('00').prop("selected", true);

        bindClickEventBtnSaveToChkBox();
        bindChnageEventTime();

      },
      close: function(){

      }
    }).dialog("open");


});



function bindClickEventBtnSave(){
	  $(".popupWrapper").find("#btn_save").click(function() {

	    if(validateTime($(this).parent())){

	      $("#tbl_cctv_list").find(".chk").each(function(){
	        $(this).parent().parent().find(".sDate").find(".cctvDate").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateDD").val());
	        $(this).parent().parent().find(".sDate").find(".cctvDate").attr("value",$(".popupWrapper").parent().find(".sDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateDD").val());
	        $(this).parent().parent().find(".sDate").find(".cctvDateHH").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateHH").val());
	        $(this).parent().parent().find(".sDate").find(".cctvDateMI").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateMI").val());


	        $(this).parent().parent().find(".eDate").find(".cctvDate").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateDD").val());
	        $(this).parent().parent().find(".eDate").find(".cctvDate").attr("value",$(".popupWrapper").parent().find(".eDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateDD").val());
	        $(this).parent().parent().find(".eDate").find(".cctvDateHH").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateHH").val());
	        $(this).parent().parent().find(".eDate").find(".cctvDateMI").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateMI").val());

	        $(this).parent().parent().find(".cctvDate").removeClass('cctv_list_chk');
	        $(this).parent().parent().find(".cctvDateHH").removeClass('cctv_list_chk');
	        $(this).parent().parent().find(".cctvDateMI").removeClass('cctv_list_chk');
	      })

	      $("#popupWrap").dialog("close");
	    }
	    else{

	    }

	  });
}

function bindClickEventBtnSaveToChkBox(){
	  $(".popupWrapper").find("#btn_save").click(function() {

	    if(validateTime($(this).parent())){

	      $("#tbl_cctv_list").find(".chk").each(function(){
	    	if($(this).prop("checked")){

	    		$(this).parent().parent().find(".sDate").find(".cctvDate").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".sDate").find(".cctvDate").attr("value",$(".popupWrapper").parent().find(".sDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".sDate").find(".cctvDateHH").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateHH").val());
	    		$(this).parent().parent().find(".sDate").find(".cctvDateMI").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateMI").val());


	    		$(this).parent().parent().find(".eDate").find(".cctvDate").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".eDate").find(".cctvDate").attr("value",$(".popupWrapper").parent().find(".eDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".eDate").find(".cctvDateHH").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateHH").val());
	    		$(this).parent().parent().find(".eDate").find(".cctvDateMI").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateMI").val());


	    		$(this).parent().parent().find(".cctvDate").removeClass('cctv_list_chk');
	 	        $(this).parent().parent().find(".cctvDateHH").removeClass('cctv_list_chk');
	 	        $(this).parent().parent().find(".cctvDateMI").removeClass('cctv_list_chk');
	    	}
	      })

	    }

	    $("#popupWrap").dialog("close");
	  });
}

function bindClickEventBtnSaveToChkBox(){
	  $(".popupWrapper").find("#btn_save").click(function() {

	    if(validateTime($(this).parent())){

	      $("#tbl_cctv_list").find(".chk").each(function(){
	    	if($(this).prop("checked")){

	    		$(this).parent().parent().find(".sDate").find(".cctvDate").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".sDate").find(".cctvDate").attr("value",$(".popupWrapper").parent().find(".sDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".sDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".sDate").find(".cctvDateHH").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateHH").val());
	    		$(this).parent().parent().find(".sDate").find(".cctvDateMI").val($(".popupWrapper").parent().find(".sDate").find(".cctvDateMI").val());


	    		$(this).parent().parent().find(".eDate").find(".cctvDate").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".eDate").find(".cctvDate").attr("value",$(".popupWrapper").parent().find(".eDate").find(".cctvDateYY").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateMM").val() + $(".popupWrapper").parent().find(".eDate").find(".cctvDateDD").val());
	    		$(this).parent().parent().find(".eDate").find(".cctvDateHH").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateHH").val());
	    		$(this).parent().parent().find(".eDate").find(".cctvDateMI").val($(".popupWrapper").parent().find(".eDate").find(".cctvDateMI").val());
	    	}
	      })

	    }

	    $("#popupWrap").dialog("close");
	  });
}

function validateTime(selector){
  var sDate = selector.parent().find(".sDate").find(".cctvDateYY").val() + selector.parent().find(".sDate").find(".cctvDateMM").val() + selector.parent().find(".sDate").find(".cctvDateDD").val() + selector.parent().find(".sDate").find(".cctvDateHH").val() +selector.parent().find(".sDate").find(".cctvDateMI").val() + "00";
  var eDate = selector.parent().find(".eDate").find(".cctvDateYY").val() + selector.parent().find(".eDate").find(".cctvDateMM").val() + selector.parent().find(".eDate").find(".cctvDateDD").val() + selector.parent().find(".eDate").find(".cctvDateHH").val() +selector.parent().find(".eDate").find(".cctvDateMI").val() + "00";

  if(sDate >= eDate){
    alert("시작 시간은 종료 시간보다 과거여야 합니다.");
    return false;
  };

  var diff = Date.prototype.formatDiffTime(sDate, eDate);
  for(var k in diff){
    if(!_common.utils.validNaN(diff[k])){
      alert("올바르지 않은 시간이 존재합니다.");
      return false;
    }
  }

  //열람
  if($(".contentWrapper").find("#reqGbnCd").val() == 12){
    if(diff.diffDay >= 32){
      alert("영상반출 시간은 30일 이내로 설정해야됩니다.");
      return false;
    }
  }
  //반출
  else{
    if(diff.diffDay >= 1 || diff.diffHour >= 12){
      alert("영상반출 시간은 12시간 이하로 설정해야됩니다.");
      return false;
    }
  }


  return true;
}

function useRqstCntChk(){
	  var count = 0;
	  var param = {
		  reqstId : userId,
		  procStatCd : "SK"
	  };

	  _common.callAjax("/tvius/getTransRqst.json", param, function(json) {
		  for(var i=0; i<json.result.length; i++){
			  if(json.result[i].useRsCd == null || json.result[i].useRsCd == undefined || json.result[i].useRsCd == ""){
				  count++;
			  }
		  }
	  },false)

	  if( SYSTEM_RQST_LOCK_CNT < count){
		  alert("영상정보 신청 현황에서 활용결과를 입력하여 주십시오.");

		  $("#btn_save").removeClass("btn_style").addClass("btn_Gstyle");
		  $("#btn_save").attr("disabled", "disabled");

		  return;
	  }
}

function bindChnageEventTime(){

  $(".cctvDateYY").change(function() {
	/*
	* 각 월의 마지막 날로 일 select option 개수 수정
	*/
  	  var $tr = $(this).parent().parent();

	  var year = $tr.find(".cctvDateYY").val();
	  var month = $tr.find(".cctvDateMM").val();
	  var lastDay = new Date(year, month, 0).getDate();

	  var $cctvDateDD = $tr.find('.cctvDateDD');

	  $cctvDateDD.empty();
	  for(var i = 1; i <= lastDay; i++) {
		  if (i < 10) i = '0' + i;
		  $cctvDateDD.append("<option value='"+ i +"'>" + i + "</option>");
	  }
  });

  $(".cctvDateMM").change(function() {
      var v = parseInt(this.value);
      if (v <= 0){
        this.value = "01";
        return;
      }
      if (v > 12){
        this.value = "12";
        return;
      }

      if(this.value.length == 1){
        if(v >= 0 && v <= 9){
          $(this).val("0"+this.value);
        }
    }

    /*
     * 각 월의 마지막 날로 일 select option 개수 수정
     */
    var $tr = $(this).parent().parent();

    var year = $tr.find(".cctvDateYY").val();
    var month = $tr.find(".cctvDateMM").val();
    var lastDay = new Date(year, month, 0).getDate();

    var $cctvDateDD = $tr.find('.cctvDateDD');

    $cctvDateDD.empty();
    for(var i = 1; i <= lastDay; i++) {
    	if (i < 10) i = '0' + i;
    	$cctvDateDD.append("<option value='"+ i +"'>" + i + "</option>");
    }
  });

  $(".cctvDateDD").change(function() {
      var v = parseInt(this.value);
      if (v <= 0) {
        this.value = "01";
        return;
      }
      if (v >= 31){
        this.value = "31";
        return;
      }
      if(this.value.length == 1){
        if(v >= 0 && v <= 9){
          $(this).val("0"+this.value);
        }
    }
  });

  $(".cctvDateHH").change(function() {
      var v = parseInt(this.value);
      if (v <= 0){
        this.value = "00";
        return;
      }
      if (v > 24){
        this.value = "00";
        return;
      }
      if (v == 24){
        this.value = "23";
        $(this).parent().parent().parent().find(".cctvDateMI").val("59");
        return;
      }

      if(this.value.length == 1){
        if(v >= 0 && v <= 9){
          $(this).val("0"+this.value);
        }
    }
  });

  $(".cctvDateMI").change(function() {
      var v = parseInt(this.value);
      if (v <= 0){
        this.value = "00";
        return;
      }
      if (v >= 60){
        this.value = "59";
        return;
      }
      if(this.value.length == 1){
        if(v >= 0 && v <= 9){
          $(this).val("0"+this.value);
        }
    }
  });
}

$(".contentWrapper").find("#vidioSmyYes").click(function() {
	alert("고속검색 사용 시 영상정보신청현황에서 신청 건 목록보기 후 반출 버튼을 눌러주시기 바랍니다.");
});
