/*
 * 파일명   : sysMngSort.js
 * 파일설명 : XEUS 서초 시스템관리 메뉴 내에 테이블 정렬 함수 포함
 * 수정이력 :
 *       2013.08.13  장대건  : 최초작성
 */
///////////////////////////////////////////////////////////////////

$(".mngSortBtn").click(function(){
	var limit = $(".contentWrapper").find('#limit').val();
	if(!_common.utils.isNullAndEmpty(limit)) limit = limit.trim();

	var _url = $(this).attr('url');
	sortCol = $(this).attr("id");
	if(sortCntrl==1){
		sortTyp = "desc";
		sortCntrl = 0;
	}
	else{
		sortTyp = "asc";
		sortCntrl = 1;
	}

	if(_url != null){
		if (_url == "/tvius/getMngTviusRqstView.do" || _url == "/tvius/getMngTviusExpView.do") {
			var _param = {};
			//승인대기, 활용결과미등록 클릭하고 sort했을 때
			if($('.cctvLookup.active').length >0){
				if($('.cctvLookup.active').attr('id') == 'callListStat'){
					_param['procStatCd'] = 'SW';
					_param['limit'] = limit;

				}
				if($('.cctvLookup.active').attr('id') == 'callListUse'){
					_param['procStatCd'] = 'SW';
					_param['limit'] = '200';
					_param['useRsCdNullChk'] = 'Y';
					_param['useRsCd'] = '11';
					_param['procStatCd'] = 'SK';
					_param['limit'] = limit;

				}
			}
			//조회 클릭하고  sort했을 때
			else{
				var user = $(".contentWrapper").find('#userKw').val();
				if(!_common.utils.isNullAndEmpty(user)) user = user.trim();

				var searchTyp = $(".contentWrapper").find('#userKwTyp').val();
				if(!_common.utils.isNullAndEmpty(searchTyp)) searchTyp = searchTyp.trim();

				var reqGbnCd = $(".contentWrapper").find('#reqGbnCd').val();
				if(!_common.utils.isNullAndEmpty(reqGbnCd)) reqGbnCd = reqGbnCd.trim();

				var crimeTyp = $(".contentWrapper").find('#crimeTyp').val();
				if(!_common.utils.isNullAndEmpty(crimeTyp)) crimeTyp = crimeTyp.trim();

				var procStatCd = $(".contentWrapper").find('#procStatCd').val();
				if(!_common.utils.isNullAndEmpty(procStatCd)) procStatCd = procStatCd.trim();

				var startDat = $(".contentWrapper").find('#startDat').val();
				if(!_common.utils.isNullAndEmpty(startDat)) startDat = startDat.trim().replace(/\-/g,'');

				var endDat = $(".contentWrapper").find('#endDat').val();
				if(!_common.utils.isNullAndEmpty(endDat)) endDat = endDat.trim().replace(/\-/g,'');

				var _param = {};

				_param['limit'] = limit;
				_param['offset'] = '0';
//				_param['year'] = (window["currYear"] !== null ? window["currYear"] : null);
				_param['sch'] = 'Y';

				if (user != ''){

					if(searchTyp == 'nm') _param['userNm'] = user;
					else if(searchTyp == 'id') _param['reqstId'] = user;
				}

				if ( reqGbnCd != '') _param['reqGbnCd'] = reqGbnCd;
				if ( crimeTyp != '') _param['crimeTyp'] = crimeTyp;
				if ( startDat != '') _param['startDat'] = startDat + '000000';
				if ( endDat != '') _param['endDat'] = endDat + '235959';
			}




			_param['limit'] = limit;
			_param['offset'] = 0;
			_param['gbn'] = gbn;
			_param['sortCol'] = sortCol;
			_param['sortTyp'] = sortTyp;
			_param['sortCntrl'] = sortCntrl;
			_param['procStatCd'] = procStatCd;

			//TODO 서초에만 해당
			if(_param['procStatCd'] == 'SW'){

				_param['procStatCdOrRenew'] = 'SW';
			}

			if(_url.indexOf("getCrmsRqstLogView") > -1){
				_param['reqGbnCd'] = '11';
			} else if(_url.indexOf("getCrmsRenewLogView") > -1){
				_param['renewTyp'] = '11';
			} else if(_url.indexOf("getCrmsRenewEviLogView") > -1){
				_param['renewTyp'] = '12';
			} else if(_url.indexOf("getCrmsRqstReadingLogView") > -1){
				_param['reqGbnCd'] = '12';
			} else if(_url.indexOf("getCrmsRqstCarLogView") > -1){
				_param['reqGbnCd'] = '14';
			} else if(_url.indexOf("getMonEvtShareLogView") > -1){
				_param['evtTypCd'] = 'cctvShare';
			} else if(_url.indexOf("getUserView") > -1){
				_param['limit'] = 100;
			} else if(_url.indexOf("getMngTviusRqstView") > -1){
//				_param['limit'] = 200;
			} else if(_url.indexOf("getMngTviusRenewView") > -1){
				_param['limit'] = 10;
				_param['renewTyp'] = renewTyp;
			} else if(_url.indexOf("getMngTviusExpView") > -1){
				_param['limit'] = 10;
			} else if(_url.indexOf("getMngTviusImageView") > -1){
//				_param['limit'] = 200;
			} else if(_url.indexOf("getMngTviusExpView") > -1){
				if ( cctvNm != '') _param['cctvNm'] = cctvNm;;
			}

			if(_url.indexOf("getMngTviusRqstView") > -1
					|| _url.indexOf("getMngTviusRenewView") > -1
					|| _url.indexOf("getMngTviusExpView") > -1
					|| _url.indexOf("getMngTviusImageView") > -1)
			{
//				$("#tviusMngView").find(".bpopup").remove();
//				$("#tviusMngView").find("#overlay-west-contents").html('').hide();
				_common.callAjax(_url, _param, function(view) {
					$("#contentWrap").dialog("close").html(view).dialog("open");

					$(".contentWrapper").find(".mngSortBtn").each(function(){
						if($(this).attr('id') == sortCol){
							if(sortTyp === "asc") $(this).text($(this).text() + "▲");
							if(sortTyp === "desc") $(this).text($(this).text() + "▼");
						}
					});

					if(_param['procStatCd'] == 'SW'){
						$(".cctvLookup").removeClass("active");
						$("#callListStat").addClass("active");
					}
					//활용결과미등록 클릭 시
					if(_param['useRsCdNullChk'] == 'Y' && _param['useRsCd'] == '11' && _param['procStatCd'] == 'SK'){
						$(".cctvLookup").removeClass("active");
						$("#callListUse").addClass("active");
					}
				}, false);
//				$("#tviusMngView").find("#overlay-west-contents").show("fade");
			} else {
//				$("#systemView").find(".bpopup").remove();
//				$("#systemView").find("#overlay-west-contents").html('').hide();
				_common.callAjax(_url, _param, function(view) {
					$("#contentWrap").dialog("close").html(view).dialog("open");

					$(".contentWrapper").find(".mngSortBtn").each(function(){
						if($(this).attr('id') == sortCol){
							if(sortTyp === "asc") $(this).text($(this).text() + "▲");
							if(sortTyp === "desc") $(this).text($(this).text() + "▼");
						}
					});

					if(_param['procStatCd'] == 'SW'){
						$(".cctvLookup").removeClass("active");
						$("#callListStat").addClass("active");
					}
					//활용결과미등록 클릭 시
					if(_param['useRsCdNullChk'] == 'Y' && _param['useRsCd'] == '11' && _param['procStatCd'] == 'SK'){
						$(".cctvLookup").removeClass("active");
						$("#callListUse").addClass("active");
					}
				}, false);
//				$("#systemView").find("#overlay-west-contents").show("fade");
			}
		} else {
			if(_url == "/log/getAccessView.do" ||
			   _url == "/log/getAuthSetLogView.do" ||
			   _url == "/log/getMonCctvLogView.do" ||
			   _url == "/userMng/getUserView.do" ||
			   _url == "/notice/getNoticeView.do" ||
			   _url == "/vms/getVmsView.do" ||
			   _url == "/orgz/getOrgzView.do"){
				var _param = {};
				var startDat = $(".contentWrapper").find('#startDat').val();
				if(!_common.utils.isNullAndEmpty(startDat)) startDat = startDat.trim().replace(/\-/g,'');

				var endDat = $(".contentWrapper").find('#endDat').val();
				if(!_common.utils.isNullAndEmpty(endDat)) endDat = endDat.trim().replace(/\-/g,'');

				_param['limit'] = limit;
				_param['offset'] = '0';

//				if (user != ''){
//
//					if(searchTyp == 'nm') _param['userNm'] = user;
//					else if(searchTyp == 'id') _param['reqstId'] = user;
//				}
//
//				if ( reqGbnCd != '') _param['reqGbnCd'] = reqGbnCd;
//				if ( crimeTyp != '') _param['crimeTyp'] = crimeTyp;
				if ( startDat != '') _param['startDat'] = startDat + '000000';
				if ( endDat != '') _param['endDat'] = endDat + '235959';

				_param['limit'] = limit;
				_param['offset'] = 0;
				_param['sortCol'] = sortCol;
				_param['sortTyp'] = sortTyp;
				_param['sortCntrl'] = sortCntrl;
				
				if(_url == "/userMng/getUserView.do"){
					_param['discardChk'] = 'Y';
					var userIdOrNm = $(".contentWrapper").find("#searchInput").val();
					if(userIdOrNm != null) _param["userIdOrNm"] = userIdOrNm;
					var authStatCd = $(".contentWrapper").find("#searchAuthStatCd").val();
					if(authStatCd != null && authStatCd != "") _param["authStatCd"] = authStatCd;
					var authGrpNo = $(".contentWrapper").find("#searchAuthGrpNo").val();
					if(authGrpNo != null && authGrpNo != "") _param["authGrpNo"] = authGrpNo;
				}

				if(_url.indexOf("getAccessView") > -1
						|| _url.indexOf("getAuthSetLogView") > -1
						|| _url.indexOf("getMonCctvLogView") > -1
						|| _url.indexOf("getUserView") > -1
						|| _url.indexOf("getNoticeView") > -1
						|| _url.indexOf("getVmsView") > -1
						|| _url.indexOf("getOrgzView") > -1)
				{
//					$("#tviusMngView").find(".bpopup").remove();
//					$("#tviusMngView").find("#overlay-west-contents").html('').hide();
					_common.callAjax(_url, _param, function(view) {
						$("#contentWrap").dialog("close").html(view).dialog("open");

						$(".contentWrapper").find(".mngSortBtn").each(function(){
							if($(this).attr('id') == sortCol){
								if(sortTyp === "asc") $(this).text($(this).text() + "▲");
								if(sortTyp === "desc") $(this).text($(this).text() + "▼");
							}
						});
					}, false);
//					$("#tviusMngView").find("#overlay-west-contents").show("fade");
				} else {
//					$("#systemView").find(".bpopup").remove();
//					$("#systemView").find("#overlay-west-contents").html('').hide();
					_common.callAjax(_url, _param, function(view) {
						$("#contentWrap").dialog("close").html(view).dialog("open");

						$(".contentWrapper").find(".mngSortBtn").each(function(){
							if($(this).attr('id') == sortCol){
								if(sortTyp === "asc") $(this).text($(this).text() + "▲");
								if(sortTyp === "desc") $(this).text($(this).text() + "▼");
							}
						});
					}, false);
//					$("#systemView").find("#overlay-west-contents").show("fade");
				}
			}
		}

	}
});