/**
 * 이력 조회 이벤트 입니다.<br>
 */
//(function(){

	$(document).ready(function(){

		/*페이징 처리*/
		var limit =$(".contentWrapper").find('#limit').val();
		if(limit == undefined || limit == null || limit =="" || limit ==0){
			limit = 100;
		}
		$(".contentWrapper").find(".paging_wrap").paging({
			current	  : Number(limit),
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});

//		$("#wrap").find("#content").css("max-height", $("#userList").height() + 5)
//		$(".contentWrapper").find("#content").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height()-250);
	});

	/* 탭 클릭 이벤트 입니다. */
	/*$(".contentWrapper").find("#wrap").find("button.logTab").click(function(){
		if($(this).attr("active") != "active"){
			$(".contentWrapper").find("#wrap").find("button.logTab").removeAttr("active");
			$(this).attr("active", "active");

			var url = $(this).attr("url");
			if(url != null){
				var _param = {};
				_param['limit'] = 10;
				_param['offset'] = 0;
				_common.callAjax(url, _param, function(view) {
					$(".contentWrapper").find("#overlay-west-contents").html('');
					$(".contentWrapper").find("#overlay-west-contents").html(view);
				});
			}
		}
    });*/
//	_common.callAjax("/log/getTopMenuView.do", null, function(view) {
//		$(".contentWrapper").find("#menuWrap").html('');
//		$(".contentWrapper").find("#menuWrap").html(view);
//	});



	function callView(offset,_param){
		var limit =$(".contentWrapper").find('#limit').val();
		if(offset == null) offset = 0;
		if(_param === undefined){
			_param = {};
			_param['limit'] = limit;

			for(var key in schObj) {
				if (schObj[key] != ""){
					if(key == 'startDat'){
						_param[key] = schObj[key].replaceAll("-","") + '000000';
					} else if(key == 'endDat') {
						_param[key] = schObj[key].replaceAll("-","") + '235959';
					}
					else{
						_param[key] = schObj[key];
					}
				}
			}
		}
		_param['offset'] = offset;
		if(sortCol!="null" && sortTyp!="null"){
			_param['sortCol'] = sortCol;
			_param['sortTyp'] = sortTyp;
		}

		var url = '';
		$(".contentWrapper").find('#title').each(function() {
			/*var chkActive = $(this).attr("active");
			if (chkActive !== undefined && chkActive == "active"){
				url = $(this).attr("url");
			}*/
			url = $(this).attr("url");
		});

		if(url.indexOf("getCrmsRqstLogView") > -1){
			_param['reqGbnCd'] = '11';
		} else if(url.indexOf("getCrmsRenewLogView") > -1){
			_param['renewTyp'] = '11';
		} else if(url.indexOf("getCrmsRenewEviLogView") > -1){
			_param['renewTyp'] = '12';
		} else if(url.indexOf("getCrmsRqstReadingLogView") > -1){
			_param['reqGbnCd'] = '12';
		} else if(url.indexOf("getCrmsRqstCarLogView") > -1){
			_param['reqGbnCd'] = '14';
		} else if(url.indexOf("getMonEvtShareLogView") > -1){
			_param['evtTypCd'] = 'cctvShare';
		}
		_common.callAjax(url, _param, function(view){
			$("#contentWrap").dialog("close").html(view).dialog("open");

			$(".contentWrapper").find(".mngSortBtn").each(function(){
				if($(this).attr('id') == sortCol && _param['sortCol'] != "" && _param['sortCol'] != ""){
					if(sortTyp === "asc") $(this).text($(this).text() + "▲");
					if(sortTyp === "desc") $(this).text($(this).text() + "▼");
				}
			});

		});
	}

	/* 검색 입력항목 엔터키 입력 이벤트 입니다.*/
	$(".contentWrapper").find(".sendData").keyup(function(e){
	    if(e.which == 13){
	    	$(".contentWrapper").find("#searchBtn").click();
	    }
	});

	$(".contentWrapper").find("#limit").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#searchBtn").click();
		}
	});

	$(".contentWrapper").find("#menuWrap #selector select").change(function(){
		var url = $(this).find('option:selected').attr("url");
		if(url != null && url != ""){
			var param = {};
			param['limit'] = 100;
			param['offset'] = 0;

			if(url.indexOf("getCrmsRqstLogView") > -1){
				param['reqGbnCd'] = '11';
			} else if(url.indexOf("getCrmsRenewLogView") > -1){
				param['renewTyp'] = '11';
			} else if(url.indexOf("getCrmsRenewEviLogView") > -1){
				param['renewTyp'] = '12';
			} else if(url.indexOf("getCrmsRqstReadingLogView") > -1){
				param['reqGbnCd'] = '12';
			} else if(url.indexOf("getCrmsRqstCarLogView") > -1){
				param['reqGbnCd'] = '14';
			} else if(url.indexOf("getMonEvtShareLogView") > -1){
				param['evtTypCd'] = 'cctvShare';
			}
			_common.callAjax(url, param, function(view){
				$("#contentWrap").dialog("close").html(view).dialog("open");
			});
		}


	});
	/* 검색 버튼 이벤트 입니다.*/
	$(".contentWrapper").find("#wrap").find("#searchBtn").click(function(){
		var limit =$(".contentWrapper").find('#limit').val();
		var _param = _common.utils.collectSendData(".contentWrapper .info_box");

		_param['limit'] = limit;
		_param['offset'] = '0';

		if(_param['startDat'] != '') _param['startDat'] = _param['startDat'].replaceAll("-","") + '000000';
		if(_param['endDat'] != '') _param['endDat'] = _param['endDat'].replaceAll("-","") + '235959';

		callView(0, _param);
	});

	/* 엑셀 버튼 이벤트 입니다.*/
	/*$(".contentWrapper").find("#wrap").find("#excelBtn").click(function(){
		confirm("* 검색결과를 엑셀로 다운로드 하시겠습니까?", function(){
			var max = $(".contentWrapper").find('#max').val();
			if ( max == "0"){
				alert("* 검색결과가 존재하지 않습니다.");
			} else{
				var _param = {};
				for(var key in schObj) {
					if (schObj[key] != ""){
						_param[key] = schObj[key];
					}
				}
				_param['limit'] = max;
				_param['offset'] = 0;

				$(".contentWrapper").find('.logTab').each(function() {
					var chkActive = $(this).attr("active");
					if (chkActive !== undefined && chkActive == "active"){
						_param['excel'] = $(this).attr("excel");
					}
				});
				_common.postForm.submit("/log/getLogAsExcel.do", _param);
			}
		});
	});*/
	$(".contentWrapper").find("#wrap").find("#excelBtn").click(function(){
		if(confirm("* 검색결과를 엑셀로 다운로드 하시겠습니까?")){
			var target = $('#title').attr("excel");
			if(target != null && target != ""){
				var max = $('#max').val();
				if ( max == "0"){
					alert("* 검색결과가 존재하지 않습니다.");
				} else{
					var _param = {};

					for(var key in schObj) {
						if (schObj[key] != ""){
							if(key == 'startDat' || key == 'endDat'){
								_param[key] = schObj[key].replaceAll("-","") + '000000';
							}else{
								_param[key] = schObj[key].replaceAll("-","") + '235959';
							}
						}
					}

					_param['limit'] = max;
					_param['offset'] = 0;
					_param['excel'] = target;

					if(target.indexOf("RenewEvi") > -1){
						_param['renewTyp'] = '12';
					} else if(target.indexOf("Renew") > -1){
						_param['renewTyp'] = '11';
					} else if(target.indexOf("RqstReading") > -1){
						_param['reqGbnCd'] = '12';
					} else if(target.indexOf("RqstCar") > -1){
						_param['reqGbnCd'] = '14';
					} else if(target.indexOf("RqstLog") > -1){
						_param['reqGbnCd'] = '11';
					} else if(target.indexOf("EvtShare") > -1){
						_param['evtTypCd'] = 'cctvShare';
					}

					_common.postForm.submit("/log/getLogAsExcel.do", _param);
				}
			}
		}

	});

	/* SMS 상세보기 이벤트 입니다. */
	$(".contentWrapper").find("#content").find(".smsDetailBtn").click(function(){
		var v = $(this).attr("k");

		_common.callAjax("/sms/getSmsLogList.json", {"mgrSeq" : v}, function(json) {
			var prop = json.result[0];

			var _html = '';

			_html += '<div id="info" class="bPopup" style="display: none;"> ';
			_html += '    <div id="title-bar"> ';// style="margin-left: 10px;"
			_html += '        <button id="closeBtn" style="float: right;"><img src="../res/img/close_btn.png"/></button> ';
			_html += '        <p class="title">상세 정보</p> ';
			_html += '    </div> ';
			_html += '    <table class="list"> ';// cellspacing="0" width="100%" style="margin-top:0;"
			_html += '        <thead> ';
			_html += '        <colgroup> ';
			_html += '            <col width="70px" /> ';
			_html += '	          <col width="" /> ';
			_html += '        </colgroup> ';
			_html += '        </thead> ';
			_html += '        <tbody> ';

			for(var k in prop){
				var column = "";
				if(k == "mgrSeq") column = "고유번호";
				if(k == "senderId") column = "전송자";
				if(k == "recvId") column = "수신자";
				if(k == "recvNum") column = "수신번호";
				if(k == "sendTyp") column = "전송구분";
				if(k == "sendMsg") column = "전송메시지";
				if(k == "sendDt") column = "전송일자";
				if(k == "sendRslt") column = "전송결과";
				if(k == "rsltDesc") column = "전송결과메시지";
				if(k != "geometry" && k != "img_path" && k != "popup" && k != "target_field" && k != "sndRsltMsg"){
					_html += '        <tr> ';
					_html += '            <th><label>' + column + '</label></th> ';
					_html += '            <td><label>' + prop[k] + '</label></td> ';
					_html += '        </tr> ';
				}
			}

			_html += '        </tbody> ';
			_html += '    </table> ';
			_html += '</div> ';

			$(".contentWrapper").find('#wrap').append(_html);

			$(".contentWrapper").find('#info').bPopup({
				appendTo: $(".contentWrapper"),
				onOpen: function() {
					$(".contentWrapper").find('#info').find('#closeBtn').click(function(){
						$(".contentWrapper").find('#info').bPopup().close();
						$(".contentWrapper").find('.bPopup').remove();
					});
				},
				onClose: function() {
					$(".contentWrapper").find('.bPopup').remove();
				}
			});
		});
	});

	/* 위치 버튼 이벤트 입니다.
	$(".searchWrapper").find(".locBtn").click(function(){
		var v = $(this).attr("k");
		if(_common.utils.isNullAndEmpty(v)){
			alert("해당 사이트는 위치가 존재하지 않습니다.\n\n대표 CCTV 선택 후 위치 조회가 가능합니다.");
		}else{
			_common.callAjax("/nms/getGeometryLocation.json", {k : v}, function(json) {
				xeusLayout.mapService.moveToAnimation(0, [json.result[0].annoX, json.result[0].annoY]);
			});
		}
	}); */


	/* DatePicker 생성 이벤트입니다.
	$(".searchWrapper").find(".datePicker").datepicker("destroy").datepicker({
	    changeMonth: true,
	    changeYear: true,
	    dateFormat: "yymmdd",
	    showButtonPanel: true,
	    beforeShowDay: $.datepicker.noBefore
	});*/

	/* MonthPicker 생성 이벤트입니다.
	$(".searchWrapper").find(".monthPicker").MonthPicker({
		MonthFormat: "yymm",
		Button: false
	}); */

//})();