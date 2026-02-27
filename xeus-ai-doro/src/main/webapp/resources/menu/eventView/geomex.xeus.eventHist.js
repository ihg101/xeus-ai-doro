$(document).ready(function(){
	
	// 페이지 로드 시 기존 다이얼로그 제거
	if($("#detailPopup").hasClass('ui-dialog-content')) {
		$("#detailPopup").remove();
		$("#detailPopup").dialog("destroy");
	}
	
	var _param = {};
	_param.evtNm = evtNm;
	_param.evtTypCd = evtTypCd;
	_param.statEvetOutbDtm = statEvetOutbDtm;
	_param.offset = offset;
	_param.limit = limit;
	
	// 데이터 받아서 select 박스에 옵션 추가
	_common.callAjax("/eventHist/getSortList.json", {}, function(json) {
		console.log(json)
	    // 데이터를 담을 select 박스
	    var selectBox = document.getElementById("evtTypCd");

	    // 기존 옵션을 모두 비우기
	    selectBox.innerHTML = '<option value="" pk="">전체</option>';

	    // 받은 데이터를 option으로 추가
	    var countArray = json.count;
	    countArray.forEach(function(item) {
	        var option = document.createElement("option");
	        if (_SITE_NAME_ === "태백시") {
	            option.value = item.cdeCde.padStart(3, '0');
	            option.text = item.cdeNm;
	            selectBox.appendChild(option);
	        } else {
	            if (item.cdeCde !== "06" && item.cdeCde !== "07" && item.cdeCde !== "08") {
	                option.value = item.cdeCde.padStart(3, '0');
	                option.text = item.cdeNm;
	                selectBox.appendChild(option);
	            }
	        }
	    });
	});

	if(_param.evtTypCd === ""){
		var evtTypCdList = new Array();
		$("#evtTypCd").find("option").each(function(i, e){
			if($(this).val() !== "") evtTypCdList.push(String($(this).val()));
		})
		_param["evtTypCdList"] = evtTypCdList.join(",");
	}

	var excelParam = {};
	excelParam.evtNm = evtNm;
	excelParam.evtTypCd = evtTypCd;
	excelParam.statEvetOutbDtm = statEvetOutbDtm;
	excelParam.offset = offset;
	excelParam.limit = limit;

	if(excelParam.evtTypCd === ""){
		var evtTypCdList = new Array();
		$("#evtTypCd").find("option").each(function(i, e){
			if($(this).val() !== "") evtTypCdList.push(String($(this).val()));
		})
		excelParam["evtTypCdList"] = evtTypCdList.join(",");
	}

	$(".paging_wrap").paging({
		current	  : 10,
		max  	  : Number($("#max").val()),
		nowOffset : Number($("#offset").val()),
		bindEvent : callView
	});
	
	setList(_param);

	var value = $("#searchInput").val();
	$("#searchInput").val(value).focus();

	/* DatePicker 생성 이벤트입니다. */
	$(".contentWrapper").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "yymmdd",
		showButtonPanel: true,
		beforeShowDay: $.datepicker.noBefore
	});

	$("#searchBtnEventHist").click(function(){
		var _param = _common.utils.collectSendData("#searchTable");
		
		_param["evtTypCd"] = _param.evtTypCd || "";
		_param["limit"] = 10;
		_param["offset"] = 0;
		
		_common.callAjax("/eventHist/getEventHistView.do", _param, function(view) {
			$("#contentWrap").html(view);
		});
	});

	if(isFirst){
		var _param = _common.utils.collectSendData("#searchTable");
		_param["limit"] = 10;
		_param["offset"] = 0;
		setList(_param);
		$(".paging_wrap").paging({
			current	  : 10,
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});
	}

	/**
	 * 엑셀 다운로드 버튼 이벤트 입니다.
	 */
	$(".contentWrapper").find("#excelBtn").click(function(){

		if($(".contentWrapper").find("#histEvtTable").find("tbody").children().length == 0){
			alert("검색결과가 존재하지 않아 다운로드할 수 없습니다.");
		}else{
			if(confirm("검색결과를 엑셀로 다운로드 하시겠습니까?")){
				delete excelParam["limit"];
				delete excelParam["offset"];
				_common.postForm.submit("/eventHist/getEventHistExcel.do", excelParam);
			}
		}
	});

});

function callView(offset, _param){
	if(offset == null) offset = 0;
	if(_param == null){
		var _param = {};
		if(outbPosNm != null && outbPosNm != "") _param['outbPosNm'] = outbPosNm;
		if(procSt != null && procSt != "") _param['procSt'] = procSt;
		if(evtNm != null && evtNm != "") _param['evtNm'] = evtNm;
		if(evtTypCd != null && evtTypCd != "") _param['evtTypCd'] = evtTypCd;
		if(statEvetOutbDtm != null && statEvetOutbDtm != "") _param['statEvetOutbDtm'] = statEvetOutbDtm;
		/*if(startDat != null && startDat != "") _param['startDat'] = startDat;
		if(endDat != null && endDat != "") _param['endDat'] = endDat;*/

		if(_param.evtTypCd === ""){
			var evtTypCdList = new Array();
			$("#evtTypCd").find("option").each(function(i, e){
				if($(this).val() !== "") evtTypCdList.push(String($(this).val()));
			})
			_param["evtTypCdList"] = evtTypCdList.join(",");
		}
	}

	_param["limit"] = 10;
	_param["offset"] = offset;

	_common.callAjax("/eventHist/getEventHistView.do", _param, function(view) {
		$("#contentWrap").html(view);
		$(".paging_wrap").paging({
			current	  : 10,
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});
		setList(_param);
	});
}

function setList(param){
	_common.callAjax("/eventHist/getList.json", param, function(json) {
		// 기존에 등록된 이벤트 핸들러 제거해 중복 실행 방지
		$("#histDetailPopup").off("click", ".btn_Dstyle");

		// 한번만 등록되도록 위치를 for문 밖에 위치
		$("#histDetailPopup").on("click", ".btn_Dstyle", function() {
			var imageUrl = $(this).data("imageurl");
			if (imageUrl) {
				var link = document.createElement("a");
				link.href = imageUrl;
				link.download = imageUrl.split('/').pop();
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		});
		
		$(".contentWrapper").find("#histEvtTable").find("tbody").html("");
		for(var i=0; i<json.result.length; i++){
			var $tbl = $(".contentWrapper").find("#histEvtTable");

			var Json = JSON.parse(json.result[i]);
			xeusJsonParser.setJson(Json);
			
			var $tr = $("<tr></tr>").attr("k", xeusJsonParser.getUSvcOutbId()).data(Json);
			
		/*	// 이벤트 상세정보
			$tr.css({"cursor" : "pointer"}).click(function(){
				$('#ctntTable').parents().show();
				xeusJsonParser.setEventContent($(this).data());
			});*/
			
			// var $no_index = $("<td class='tCenter'></td>").html("<div>" + (Number(param['offset'])+i+1) + "</div>");
			// var $procSt = $("<td class='tCenter'></td>").text(xeusJsonParser.getProcSt());
			// var $statEvetNm = $("<td class='tCenter'></td>").html("<div class='sText' title='" +  xeusJsonParser.getEventType()+ "'>" + xeusJsonParser.getEventType() + "</div>");
			
			var eventType = xeusJsonParser.getEventType(); 
		    var eventImage = getEventTypeImage(eventType);
			
		    var $statEvetNm = $("<td class='tCenter'></td>").html(
		    	"<div class='text-overflow' title='" + eventType + "'>" +
		        "<img src='" + eventImage + "' alt='" + eventType + " 아이콘' style='width:20px; vertical-align:middle; margin-right:5px;'>" + eventType + "</div>");

			var $outbPosCombined = $("<td class='tCenter'></td>").html(
				Date.prototype.formatMDHMS(xeusJsonParser.getYmd().substring(0, 14)) + "<br>" +
				xeusJsonParser.getAddr());
	
	/*		var $img = $("<td class='tCenter'></td>").html(
				"<img src='res/img/ai-doro/img.png' alt='이미지 아이콘' class='img_icon' style='cursor: pointer; max-width: 26px;'>");

			$img.find('img').click(function() {
				var data = $(this).parent().parent().data();
			    updatehistDetailPopup(data);
			    $("#imgPopup").dialog({
			        title: "이벤트 이미지",
			        width: 425,
			        position: {
			            my: "center+200 bottom-50",
			            at: "center bottom",
			            of: $("#map")
			        }
			    });
			});*/
			
			var $location = $("<td class='tCenter'></td>");
			
			var $btn = $("<button class='btn_t'>위치</button>").css({
				"cursor" : "pointer",
			}).click(function(){
				var data = $(this).parent().parent().data();
				xeusJsonParser.move(data);
			});
			
			var $detailBtn = $("<button class='btn_t'>").text('상세').css({ }).click(function() {
				var data = $(this).parent().parent().data();
			    updatehistDetailPopup(data);
			    
			    $("#histDetailPopup").dialog({
			        title: "상세 이벤트",
			        width: 450,
			        position: {
			            my: "center+200 bottom-50",
			            at: "center bottom",
			            of: $("#map")
			        } 
			    });
			});
			
			$location.append($btn).append($detailBtn);
			$tr.append($statEvetNm).append($outbPosCombined).append($location);
			//$tr.append($statEvetNm).append($outbPosCombined).append($img).append($location);
			$tbl.append($tr);
		}
	});
}

function getEventTypeImage(eventType) {
	var imagePaths = {
        "포트홀": "res/img/ai-doro/icn_doro1.png",
        "낙하물": "res/img/ai-doro/icn_doro2.png",
        "콘": "res/img/ai-doro/icn_doro3.png",
        "굴삭기": "res/img/ai-doro/icn_doro4.png",
        "크랙": "res/img/ai-doro/icn_doro5.png",
        "블랙아이스": "res/img/ai-doro/icn_doro7.svg",
        "수막현상": "res/img/ai-doro/icn_doro6.svg"
    };
    return imagePaths[eventType] || "";
}

function updatehistDetailPopup(data) {
	var etcCntn = data.etcCntn;
	var detectTyp = (data.etcCntn.detector == "1") ? "버스" : " CCTV"; 
	var coord = Spatial.convertProjection( [data.outbPos[0].x, data.outbPos[0].y], "EPSG:4326", "EPSG:5186");
	
	if(data.statEvetNm === '수막현상' || data.statEvetNm === '블랙아이스' ) {
		$("#histDetailPopup .info_list li:nth-child(1) span:nth-child(2)").text(data.statEvetNm + " / " + etcCntn.eventSeverity || 'N/A');
	} else{
		$("#histDetailPopup .info_list li:nth-child(1) span:nth-child(2)").text(data.statEvetNm  + " / " + detectTyp || 'N/A');
	}
    $("#histDetailPopup .info_list li:nth-child(2) span:nth-child(2)").text(new Date().formatMDHMS(data.statEvetOutbDtm));
   // $("#histDetailPopup .info_list li:nth-child(3) span:nth-child(2)").text(data.outbPosNm || 'N/A');
    $("#histDetailPopup .info_list li:nth-child(3) span:nth-child(2)").text(data.outbPos[0].x + " / " + data.outbPos[0].y || 'N/A');
    $("#histDetailPopup .info_list li:nth-child(4) span:nth-child(2)").text(coord[0] + " / " + coord[1] || 'N/A');
    
    var imageUrl = getIdFromUrl(data.etcCntn.imgUrl) || 'res/img/bg2.png';
    //$("#imgPopup .img_box").html('<img src="' + imageUrl + '" alt="이벤트 이미지" style="max-width: 100%;">');
    $("#histDetailPopup .img_box").html('<img src="' + imageUrl + '" alt="이벤트 이미지" style="max-width: 100%; height:300px">');
    $("#histDetailPopup .btn_Dstyle").data("imageurl", imageUrl);
}

/**
 * 이미지 경로 추출
 * 
 * @param url
 * @returns
 */
function getIdFromUrl(url) {
  if (!url ) return null;
  var match = url.match(/[?&]id=([^&]+)/);
  if ( !match ) return null;
  return '/xeus/api/getImage.do?id=' + match[1];
}
