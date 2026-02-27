/**
 * 관리자 영상반출종합현황 페이지 관련 이벤트 입니다.
 */
$(document).ready(function() {
	resizeDone();

	setBoardChart('listuse');

	ie8Chk();

//	intervalService = setInterval('getServerStat()', 3000);

	intervalService = setInterval(function() {
		getServerStat();
		$('.stat_progress_num').css('margin-left', '0px');
	}, 3000);
});

function resizeDone() {
	var bodyWidth = $("#contentWrap").find('.searchWrapper').width();
	var bodyHeight = $("#contentWrap").find('.searchWrapper').height();

	if (bodyWidth < 1700)
		bodyWidth = 1700;
	var wrapWidth = bodyWidth - 200;
	var wrapHeight = wrapWidth * (9 / 16);

	var topHeight = wrapHeight * 0.3 - 70;
	var top1Width = wrapWidth * (3 / 9) - 30;
	var top2Width = wrapWidth * (2 / 9) - 30;
	var top3Width = wrapWidth * (2 / 9) - 30;
	var top4Width = wrapWidth * (2 / 9) - 30;
	var topWidth = wrapWidth - 20;
	var pageNmH = 25 - 1;
	var corCntGrpH = topHeight - pageNmH;
	var movePageW = corCntGrpH * 0.8;

	var bottomWidth = topWidth;
	var bottomHeight = wrapHeight * 0.6 - 10;
	var bottomEleH = bottomHeight - 10;
	var chartW = bottomWidth * 0.7 - 30;
	var statW = bottomWidth * 0.3 - 46;
	var chartH = bottomHeight - 10;
	var statH = bottomHeight - 10;

	var statConW = statW - 35;
	var proConW = statW - 35;
	var statConH = (statH - 32 - 15 - 25 - 10) * (3 / 13);
	var proConH = (statH - 32 - 15 - 25 - 10) * (10 / 13);

	$("#contentWrap").find('.move_page').each(function() {
		$(this).width(movePageW * 0.8);
		$(this).height(movePageW * 0.8);

		var rstNumFont = parseInt((movePageW * 0.8) / 5);
		if (rstNumFont < 24)
			rstNumFont = 24;
		var rstTitFont = parseInt((movePageW * 0.8) / 15);
		if (rstTitFont < 10)
			rstTitFont = 10;

		$(this).find('.result_num').css('font-size', rstNumFont + 'pt');
		$(this).find('.result_num').css('height', parseInt((movePageW * 0.8) / 5) + 'px');
		$(this).find('.result_title').css('font-size', rstTitFont + 'pt');
	});

	// 외부 사각형
	$("#contentWrap").find('.corner_content_group').each(function() {
		$(this).css('height', corCntGrpH);
	});

	var pageNamFont = parseInt(topWidth / 100);
	if (pageNamFont < 14)
		pageNamFont = 13;
	var tabOnFont = pageNamFont - 8;
	if (tabOnFont < 10)
		tabOnFont = 10;
	var proNam = (pageNamFont - 2);
	var proHint = (pageNamFont - 4);
	$("#contentWrap").find('.stat_progress_name').css('font-size', pageNamFont + 'pt');
	$("#contentWrap").find('.stat_progress_grp').css('margin-bottom', proNam + 'px');
	$("#contentWrap").find('.pageNam').css('font-size', pageNamFont + 'pt');
	$("#contentWrap").find('.ifa_corner_content_group').find('.tab_on').css('font-size', tabOnFont + 'pt');

	$("#contentWrap").find('.process_nam').css('font-size', proNam + 'pt');
	$("#contentWrap").find('.process_hint').css('font-size', proHint + 'pt');
	$("#contentWrap").find('.process_hint').css('margin-top', parseInt(proNam / 2) + 'px');
	$("#contentWrap").find('.process_hint').css('margin-bottom', proNam + 'px');

	$("#contentWrap").find('.process_on').find('img').css('width', proNam + 'px');
	$("#contentWrap").find('.process_on').find('img').css('height', proNam + 'px');

	$("#contentWrap").find('#top1').width(top1Width);
	$("#contentWrap").find('#top2').width(top2Width);
	$("#contentWrap").find('#top3').width(top3Width);
	$("#contentWrap").find('#top4').width(top4Width);
	$("#contentWrap").find('#top').width(topWidth);
	$("#contentWrap").find('#top1').height(topHeight);
	$("#contentWrap").find('#top2').height(topHeight);
	$("#contentWrap").find('#top3').height(topHeight);
	$("#contentWrap").find('#top4').height(topHeight);
	$("#contentWrap").find('#top').height(topHeight);

	$("#contentWrap").find('.stat_content').width(statConW);
	$("#contentWrap").find('.process_content').width(proConW);
	$("#contentWrap").find('.stat_content').height(statConH);
	$("#contentWrap").find('.process_content').height(proConH);

	$("#contentWrap").find('#chart').width(chartW);
	$("#contentWrap").find('#stat').width(statW);
	$("#contentWrap").find('#chart').height(chartH);
	$("#contentWrap").find('#stat').height(statH);

	$("#contentWrap").find('.bottomElement').each(function() {
		$(this).height(bottomEleH);
	});

	$("#contentWrap").find('#bottom').width(bottomWidth);
	$("#contentWrap").find('#bottom').height(bottomHeight);

	$("#contentWrap").find('.stat_progress_name').css('width', '');
	var statNmW = 0;
	var statNmH = 0;
	$("#contentWrap").find('.stat_progress_name').each(function() {
		if (statNmW < $(this).width())
			statNmW = $(this).width();
		if (statNmH < $(this).height())
			statNmH = $(this).height();
	});
	$("#contentWrap").find('.stat_progress_name').css('width', statNmW + 'px');
	$("#contentWrap").find('.stat_progress_bar').css('height',
			(statNmH - 2) + 'px !important');
	$("#contentWrap").find('.stat_progress_bar').css('width',
			(statConW * (0.65)) + 'px');

	/*$("#contentWrap").find('#wrap').width(bodyWidth);
	$("#contentWrap").find('#wrap').height(bodyHeight);*/
}

//각각 페이지 이동을 한다.
$("#contentWrap").find('#admin_top_content .move_page').click(function() {
	var table_id = $(this).attr('key');
	var param_typ = $(this).find('.result_num').attr('id');
	var getParam = '';
	var notip_parram='';
	var button_id = '';

	var _pageUrl = "";
	var _pageParam = {limit : 10, offset : 0};
	var _pageTitle = '';

	if ( table_id == "crms_trans_rqst" ){
		_pageUrl = "getMngTviusRqstView.do";
		_pageTitle = '영상정보 신청 현황';
	} else if ( table_id == "crms_rqst_renew_11" ){
		_pageUrl = "getMngTviusRenewView.do";
		_pageTitle = '연장신청현황';
	} else if ( table_id == "crms_rqst_renew_12" ){
		_pageUrl = "getMngTviusRenewView.do";
		_pageTitle = '증거신청현황';
	}

	///////////////////////////////////////////////////////////////////////

	// 영상신청 승인대기
	if ( param_typ == 'rqst_sw' ) {
		if ( $("#contentWrap").find('#rqst_sw').text() != '0' ) {
			_pageParam['procStatCd'] = 'SW';
			_pageParam['skView'] = 'Y';
			button_id = 'btn-tvius-rqst-view';
		} else {
			alert('* 승인대기 중인 건수가 존재하지 않습니다.');
			return false;
		}
	}
	// 처리중
	else if ( param_typ == 'rqst_sn' ) {
		if ( $("#contentWrap").find('#rqst_sn').text() != '0' ) {
			_pageParam['procStatCd'] = 'SN';
			button_id = 'btn-tvius-rqst-view';
		} else {
			alert('* 처리중인 건수가 존재하지 않습니다.');
			return false;
		}
	}
	// 활용결과 미입력
	else if ( param_typ == 'rqst_rs' ){
		if ( $("#contentWrap").find('#rqst_rs').text() != '0' ) {
			_pageParam['useRsCd'] = '11';
			_pageParam['procStatCd'] = 'SK';
			button_id = 'btn-tvius-rqst-view';
		} else {
			alert(' * 활용결과 미입력된 건수가 존재하지 않습니다.');
			return false;
		}
	}
	// 연장신청 승인대기
	else if ( param_typ == 'renew_r1') {
		if ( $("#contentWrap").find('#renew_r1').text() != '0' ) {
			_pageParam['renewTyp'] = 11;
			_pageParam['acptYn'] = 'null';
			button_id = 'btn-tvius-ext-view';
		} else {
			alert('* 연장신청 승인대기 건수가 존재하지 않습니다.');
			return false;
		}
	}
	// 증거자료신청 승인대기
	else if ( param_typ == 'renew_r2') {
		if ( $("#contentWrap").find('#renew_r2').text() != '0' ) {
			_pageParam['renewTyp'] = 12;
			_pageParam['acptYn'] = 'null';
			button_id = 'btn-tvius-evi-view';
		} else {
			alert('* 증거자료신청 승인대기 건수가 존재하지 않습니다.');
			return false;
		}
	}
	// 사용자 승인대기
	else if ( param_typ == 'use' ) {
		if ( $("#contentWrap").find('#use').text() != '0' ) {
			if(!hasAuth('사용자관리 소메뉴', 'btn-user-mng'))
				return;

			// 시스템관리 - 사용자관리 소메뉴만 요청해서 불러옴
			var _URL = '/userMng/getUserView.do';
			var _TITLE = '사용자관리';
			var _param = {authStatCd : 11, limit : 10, offset : 0};

			_common.callAjax(_URL, _param, function(view){
				$("#contentWrap").dialog("close").html(view).dialog({
					title : _TITLE,
				    width: $("#map").width(),
					height: $("#map").height(),
					position: {
						my: "left top",
						at: "left top",
						of: $("#map")
					},
					open: function(){
						$(".startMenu").each(function(){
							$(this).removeClass("active");
						});
					},
					close: function(){
//						$('.menu_wrap').find('#btn-tvius-board-view').click();
					}
				}).dialog("open");
			}, false);
			return false;
		} else {
			alert( '* 승인대기 중인 사용자가 존재하지 않습니다.' );
			return false;
		}
	}
	// 승인된 사용자
	else if ( param_typ == 'notip' ) {
		if ( $("#contentWrap").find('#notip').text() != '0' ) {
			if(!hasAuth('사용자관리 소메뉴', 'btn-user-mng'))
				return;

			// 시스템관리 - 사용자관리 소메뉴만 요청해서 불러옴
			var _URL = '/userMng/getUserView.do';
			var _TITLE = '사용자관리';
			var _param = { authStatCd : 12,limit : 10, offset : 0};

			_common.callAjax(_URL, _param, function(view){
				$("#contentWrap").dialog("close").html(view).dialog({
					title : _TITLE,
				    width: $("#map").width(),
					height: $("#map").height(),
					position: {
						my: "left top",
						at: "left top",
						of: $("#map")
					},
					open: function(){
						$(".startMenu").each(function(){
							$(this).removeClass("active");
						});
					},
					close: function(){
//						$('.menu_wrap').find('#btn-tvius-board-view').click();
					}
				}).dialog("open");
			}, false);
			return false;
		} else {
			alert( '* 승인된 사용자가 존재하지 않습니다.' );
			return false;
		}
	}
	// 현재 접속자
	else if ( param_typ == 'preuse' ) {
		var str = '';
		str += '	<div class="searchWrapper"> ';
		str += '		<div>';
		str += '			<p id="title" class="searchTitle" style="margin-top: 15px; display: inline-block;">현재접속자목록</p> ';
		str += '			<button id="btn_reset" class="btn_style2" style="width: 100px;margin-right: 20px; margin-top: 15px;right: 0px;position: absolute; display: inline-block;">새로고침</button> ';
		str += '		</div> ';
		str += '		<div style="margin-top: 20px;"> ';
		str += '			<table cellpadding="0" cellspacing="0" style="width:100%; margin-top:5px;"> ';
		str += '				<colgroup> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
//		str += '					<col width="120"/> ';
//			str += '					<col width="120"/> ';
		str += '				</colgroup> ';
		str += '				<tr> ';
		str += '					<th class="tCenter">아이디</th> ';
		str += '					<th class="tCenter">사용자명</th> ';
		str += '					<th class="tCenter">소속기관</th> ';
		str += '					<th class="tCenter">유선전화</th> ';
		str += '					<th class="tCenter">휴대전화</th> ';
		str += '					<th class="tCenter">사용자구분</th> ';
//		str += '					<th class="tCenter">등록신청IP</th> ';
		//str += '					<th class="tCenter">최근접속시간</th> ';
		str += '				</tr> ';
		str += '			</table> ';
		str += '		</div>';
		str += '		<div class="mCustomScrollbar" data-mcs-theme="minimal-dark">';
		str += '			<table cellpadding="0" cellspacing="0" style="width:100%; margin-top:5px;"> ';
		str += '				<colgroup> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
		str += '					<col width="120"/> ';
//		str += '					<col width="120"/> ';
//			str += '					<col width="120"/> ';
		str += '				</colgroup> ';
		str += '				<tbody id="user_list_body"> ';
		str += '				</tbody> ';
		str += '			</table> ';
		str += '		</div> ';
		str += '	</div> ';
		str += '</div> ';

		$("#popupWrap").dialog("close").html(str).dialog({
			title : '현재접속자',
		    width: 900,
			height: 500,
			modal: true,
			position: {
				my: "center top",
				at: "center top",
				of: $("#contentWrap").find('.searchWrapper')
			},
		}).dialog("open");

		$("#tviusMngView").find("#contentWrap").find('.searchWrapper').append(str);

		accUserList();

		$("#popupWrap").find('#btn_reset').click(function() {
			accUserList();
		});

		return false;
	}
	// 계정 잠김
	else if ( param_typ == 'uselock' ) {
		if ( $("#contentWrap").find('#uselock').text() != '0' ) {
			var str = '';
			str += '	<div class="searchWrapper" style="text-align: left; margin-left: 5px; overflow: hidden;"> ';
			str += '		<div>';
			str += '			<p id="title" class="searchTitle" style="margin-top: 15px; display: inline-block;">계정잠김사용자 목록</p> ';
			str += '			<button id="btn_unlock" class="btn_style2" style="width: 100px;margin-right: 20px; margin-top: 15px;right: 0px;position: absolute; display: inline-block;">잠금해제</button> ';
			str += '		</div> ';
			str += '		<div class="div_grp" style="margin-top:5px; overflow: auto; max-height:250px;"> ';
			str += '			<table cellpadding="0" cellspacing="0" style="width:100%; "> ';
			str += '				<colgroup> ';
			str += '					<col width="60"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
//			str += '					<col width="120"/> ';
//				str += '					<col width="120"/> ';
			str += '					<col width="110"/> ';
			str += '				</colgroup> ';
			str += '				<tr> ';
			str += '					<th class="tCenter"><input type="checkbox" class="chk_all" /></th> ';
			str += '					<th class="tCenter">아이디</th> ';
			str += '					<th class="tCenter">사용자명</th> ';
			str += '					<th class="tCenter">소속기관</th> ';
			str += '					<th class="tCenter">유선전화</th> ';
			str += '					<th class="tCenter">휴대전화</th> ';
			str += '					<th class="tCenter">사용자구분</th> ';
//			str += '					<th class="tCenter">등록신청IP</th> ';
			//str += '					<th class="tCenter">최근접속시간</th> ';
			str += '					<th class="tCenter">접속실패회수</th> ';
			str += '				</tr> ';
			str += '			</table> ';
			str += '		</div>';
			str += '		<div class="mCustomScrollbar" data-mcs-theme="minimal-dark">';
			str += '			<table cellpadding="0" cellspacing="0" style="width:100%;"> ';
			str += '				<colgroup> ';
			str += '					<col width="60"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
			str += '					<col width="120"/> ';
//			str += '					<col width="120"/> ';
//				str += '					<col width="120"/> ';
			str += '					<col width="110"/> ';
			str += '				</colgroup> ';
			str += '				<tbody id="lock_list_body"> ';
			str += '				</tbody> ';
			str += '			</table> ';
			str += '		</div> ';
			str += '	</div> ';

			$("#popupWrap").dialog("close").html(str).dialog({
				title : '계정잠김',
			    width: 1200,
				height: 700,
				modal: true,
				position: {
					my: "center top",
					at: "center top",
					of: $("#contentWrap").find('.searchWrapper')
				},
				close: function(){
					var param = {authStatCd : 14};

					_common.callAjax("/user/getCount.json", param, function(json) {
						$('#contentWrap').find('#uselock').text(json.count);
					});
				}
			}).dialog("open");

			$("#tviusMngView").find("#contentWrap").find('.searchWrapper').append(str);

			lockUserList();
		} else {
			alert('* 잠김 상태인 사용자가 존재하지 않습니다.');
		};

		return false;
	}

	if (_pageUrl != ''){
		if(!hasAuth(_pageTitle + ' 소메뉴', button_id))
			return;

		var _URL = '/tvius/' + _pageUrl;
		var _TITLE = _pageTitle;
		var _param = _pageParam;

		_common.callAjax(_URL, _param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog({
				title : _TITLE,
			    width: $("#map").width(),
				height: $("#map").height(),
				closeOnEscape: false,
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function(){
					$(".startMenu").each(function(){
						if($(this).attr('id') == button_id){
							$(this).addClass('active');
						}else{
							$(this).removeClass("active");
						}
					});
				},
				close: function(){
//					$('.menu_wrap').find('#btn-tvius-board-view').click();
				}
			}).dialog("open");

		}, false);
	} else {
		alert('* System Error.\r\n관리자에게 문의하여 주십시오.');
	}
});

// 그래프 상단 탭 클릭 이벤트
$("#contentWrap").find('.tab_on').click(function() {
	if ( $(this).hasClass('tab_bg')){
		var page = $(this).attr('id');
		setBoardChart(page);

		$("#contentWrap").find('.ifa_corner_content_group').find('li').each(function(){
			if ( $(this).find('div').attr('id') == page ){
				$(this).find('div').removeClass('tab_bg');
			} else {
				$(this).find('div').addClass('tab_bg');
			}
		});
	}
});

/**
 * 해당 메뉴의 권한을 체크한다
 * 권한이 있으면 TRUE, 없으면 FALSE
 */
function hasAuth(authNm, authData){
	var authChk = false;

	_common.callAjax("/auth/hasAuth.json", { "authData" : authData }, function(json){
		authChk = json.result;
	}, false);

	if(!authChk)
		alert(authNm + ' 권한이 없습니다.');

	return authChk;
}

/**
 * DatePicker를 설정한다.
 */
function setBoardChart(page){
	var date = new Date();

	var _statParam = {};
	_statParam['pageTyp'] = 'board';
	_statParam['page'] = page;
	_statParam['year'] = date.getFullYear();
	_statParam['size'] = $("#contentWrap").find('#chart').width()-60;

	_common.callAjax("/tvius/getMngTviusBoardChartView.do", _statParam, function(view) {
		$("#contentWrap").find("#boardChart").html(view);
	});
}

// 익스플로러 브라우저 버전 8 이하 체크
function ie8Chk(){
	var ua = window.navigator.userAgent;
	var meg = '<div style="margin-top:100px; font-size:12pt;">※ 익스플로러 브라우저 버전 8 이하 에서는 통계 현황 그래프를 볼 수 없습니다.<br>';
	meg += '&nbsp; &nbsp; &nbsp; 통계 현황 내용을 확인하시려면 페이지 상단우측에 통계 메뉴를 눌러주십시오.</div>';
	if(ua.indexOf('Mozilla/4.0') >= 0){
        // IE 8.0
		$("#contentWrap").find('.ifa_corner_content_group').html('');
		$("#contentWrap").find('.ifa_corner_content_group').html(meg);
	}
}

/**
 * 서버로부터 요청을 받아와서 각 패키저들의 서비스 실행 유무를 판단한다.
 *
 */
function getServerStat() {
	_common.callAjax("/tvius/getServiceStat.do", {'svc' : 'GetState'}, function(xml) {

		var repkg_dead = $(xml).find('id[name=REPACKAGER]').find('dead').text();
		var prevpkg_dead = $(xml).find('id[name=PREV_PACKAGER]').find('dead').text();
		var pkg_dead = $(xml).find('id[name=PACKAGER]').find('dead').text();
		var sync_dead = $(xml).find('id[name=SYNC_SERVICE]').find('dead').text();
		var back_dead = $(xml).find('id[name=BACKUP_SERVER]').find('dead').text();
		var img_src = '';

		if (pkg_dead == 'false') {// /xeus/res/img/btn_close.png
			img_src = '/xeus/res/img/1_on.png';
		} else {
			img_src = '/xeus/res/img/2_off.png';
		}
		$("#contentWrap").find('#pkg_on').attr('src', img_src);

		if (sync_dead == 'false') {
			img_src = '/xeus/res/img/1_on.png';
		} else {
			img_src = '/xeus/res/img/2_off.png';
		}
		$("#contentWrap").find('#sync_on').attr('src', img_src);

		if (back_dead == 'false') {
			img_src = '/xeus/res/img/1_on.png';
		} else {
			img_src = '/xeus/res/img/2_off.png';
		}
		$("#contentWrap").find('#back_on').attr('src', img_src);

		if (repkg_dead == 'false') {
			img_src = '/xeus/res/img/1_on.png';
		} else {
			img_src = '/xeus/res/img/2_off.png';
		}
		$("#contentWrap").find('#repkg_on').attr('src', img_src);

		if (prevpkg_dead == 'false') {
			img_src = '/xeus/res/img/1_on.png';
		} else {
			img_src = '/xeus/res/img/2_off.png';
		}
		$("#contentWrap").find('#prevpkg_on').attr('src', img_src);

		var pkg_cpu = '';
		var pkg_mem = '';
		var pkg_hdd = '';

		if (pkg_dead == 'false') {
			pkg_cpu = $(xml).find('id[name=PACKAGER]').find('cpu').text();
			pkg_mem = $(xml).find('id[name=PACKAGER]').find('mem').text();
			pkg_hdd =  $(xml).find('id[name=PACKAGER]').find('storage').text();
		}

		$("#contentWrap").find('#pkg_cpu').progressbar({value : Number(pkg_cpu)});
		$("#contentWrap").find('#pkg_mem').progressbar({value : Number(pkg_mem)});
		$("#contentWrap").find('#pkg_hdd').progressbar({value : Number(pkg_hdd)});

		$("#contentWrap").find('#pkg_cpu_num').css('visibility','visible');
		$("#contentWrap").find('#pkg_mem_num').css('visibility','visible');
		$("#contentWrap").find('#pkg_hdd_num').css('visibility','visible');

		$("#contentWrap").find('.ui-progressbar-value').css('background-color', '#5e90af');

		if (pkg_cpu == '')
			pkg_cpu = '0';
		if (pkg_mem == '')
			pkg_mem = '0';
		if (pkg_hdd == '')
			pkg_hdd = '0';

		$("#contentWrap").find('#pkg_cpu_num').text(pkg_cpu + '%');
		$("#contentWrap").find('#pkg_mem_num').text(pkg_mem + '%');
		$("#contentWrap").find('#pkg_hdd_num').text(pkg_hdd + '%');
	}, false);
}

/**
 * 현재 접속 사용자 리스트를 가져온다.
 *
 */
function accUserList(){
	_common.callAjax("/user/getAccUserList.json", null, function(json) {
		sessUserList = json.list;

		$("#popupWrap").find('#user_list_body').html('');

		for(var i=0; i<json.list.length; i++){
			var _userParam = {};
			_userParam['userId'] = json.list[i];

			_common.callAjax("/user/getList.json", _userParam, function(json) {
				var userId = json.result[0].userId;
				var userNm = json.result[0].userNm;
				var officeNm = json.result[0].orgNm;
				var deptNm = json.result[0].departNm;
				var rankNm = json.result[0].posNm;
				var officeTelNo = json.result[0].telNum;
				var moblTelNo = json.result[0].mobileNum;
				var userAuthNm = json.result[0].authGrpNm;
				var userRegIp = json.result[0].authConnIp;
				var lastLoginDat = "";
				var loginLockCnt = json.result[0].authAtmtCnt;

				var str = '';
				str += '<tr>';
				str += '<td class="tCenter">'+userId+'</td>';
				str += '<td class="tCenter">'+userNm+'</td>';
				//str += '<td class="tCenter">'+_common.utils.validNull(officeNm)+'<br>'+_common.utils.validNull(deptNm)+'<br>'+_common.utils.validNull(rankNm)+'</td>';
				str += '<td class="tCenter">'+_common.utils.validNull(deptNm)+'</td>';
				str += '<td class="tCenter">'+_common.utils.strTelAdd(officeTelNo)+'</td>';
				str += '<td class="tCenter">'+_common.utils.strTelAdd(moblTelNo)+'</td>';
				str += '<td class="tCenter">'+userAuthNm+'</td>';
//				str += '<td class="tCenter">'+_common.utils.setIpFormat(userRegIp)+'</td>';
				//str += '<td class="tCenter">'+lastLoginDat+'</td>';
				str += '</tr>';

				$("#popupWrap").find('#user_list_body').append(str);
			});
		}
	});
}

/**
 * 계정 잠김상태 사용자 리스트를 가져온다.
 *
 */
function lockUserList(){
	$("#popupWrap").find('#lock_list_body').html('');

	var str = '';

	var _userParam = {authStatCd : 14};
	_common.callAjax("/user/getList.json", _userParam, function(json) {
		for(var i=0; i<json.result.length; i++){
			var userId = json.result[i].userId;
			var userNm = json.result[i].userNm;
			var officeNm = json.result[i].orgNm;
			var deptNm = json.result[i].departNm;
			var rankNm = json.result[i].posNm;
			var officeTelNo = json.result[i].telNum;
			var moblTelNo = json.result[i].mobileNum;
			var userAuthNm = json.result[i].authGrpNm;
			var userRegIp = json.result[i].authConnIp;
			var lastLoginDat = "";
			var loginLockCnt = json.result[i].authAtmtCnt;

			str += '<tr>';
			str += '<td class="tCenter"><input type="checkbox" key="'+userId+'" class="chk_lock" /></td>';//last_date = "'+lastLoginDat+'"
			str += '<td class="tCenter">'+userId+'</td>';
			str += '<td class="tCenter">'+userNm+'</td>';
			str += '<td class="tCenter">'+officeNm+'<br>'+deptNm+'<br>'+rankNm+'</td>';
			str += '<td class="tCenter">'+officeTelNo+'</td>';
			str += '<td class="tCenter">'+moblTelNo+'</td>';//_Util.format.strTeladd(
			str += '<td class="tCenter">'+userAuthNm+'</td>';
//			str += '<td class="tCenter">'+_common.utils.setIpFormat(userRegIp)+'</td>';
			//str += '<td class="tCenter">'+lastLoginDat+'</td>';
			str += '<td class="tCenter">'+loginLockCnt+'</td>';
			str += '</tr>';
		}

		$("#popupWrap").find('#lock_list_body').append(str);

		//계정잠김 리스트를 전체 체크한다.
		$("#popupWrap").find('.chk_all').click(function() {
			var chk_a = $(this).is(':checked');

			if (chk_a == false  ) {
				if($("#popupWrap").find('.chk_lock').hasClass('on')){
					$("#popupWrap").find('.chk_lock').removeClass('on');
				}
				$("#popupWrap").find('.chk_lock').prop('checked', false);
			} else {
				if(!$("#popupWrap").find('.chk_lock').hasClass('on')){
					$("#popupWrap").find('.chk_lock').addClass('on');
				}
				$("#popupWrap").find('.chk_lock').prop('checked', true);
			}
		});

		// 계정잠김 리스트를 각각 체크한다.
		$("#popupWrap").find('.chk_lock').click(function() {
			var chk_a = $(this).is(':checked');

			if (chk_a == false  ) {
				$(this).removeClass('on');
				$(this).attr('checked', false);
			} else {
				$(this).addClass('on');
				$(this).attr('checked', true);
			}
		});

		// 체크된 사용자들의 계정잠김 상태를 해제한다.
		$("#popupWrap").find('#btn_unlock').click(function() {
			var $chk = $("#popupWrap").find('.chk_lock.on');
			var tot = $chk.length;
			var saveChk = true;

			if ( tot != 0 ) {
				$chk.each(function(){
					var uId = $(this).attr('key');
					var _userParam = {userId : uId};

					if(saveChk){
						_common.callAjax("/user/unLock.json", _userParam, function(json) {
							saveChk= json.result;
						}, false);
					}
				});

				if(saveChk){
					alert('* 수정되었습니다.');
					lockUserList();
					$("#popupWrap").dialog("close");
				} else {
					alert('* reset error.');
					lockUserList();
				}
			} else {
				alert( '* 선택된 사용자가 없습니다.\n 선택하여 주십시오.');
			}
		});
	}, false);
}