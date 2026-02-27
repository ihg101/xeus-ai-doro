$(document).ready(function(){

	var excelParam = {};

	var value = $("#searchInput").val();
	$("#searchInput").val(value).focus();

	_common.callAjax("/GMT_mobileshare/api/list", "", function(json) {
		setList(json);
	});


	$("#searchBtnShare").click(function(){
		_common.callAjax("/GMT_mobileshare/api/list", "", function(json) {
			setList(json);
		});
	});

/*	if(isFirst){
		alert();
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
	}*/

});

function callView(offset, _param){
	if(offset == null) offset = 0;
	/**
	 * 180525 이은규
	 * 검색기능 수정
	 * 페이지 버튼 클릭 시 검색된 파라미터로 처리
	 */
	//var _param = _common.utils.collectSendData("#searchTable");
//	if(_param == null){
//		var _param = {};
//		if(outbPosNm != null && outbPosNm != "")
//			_param['outbPosNm'] = outbPosNm;
//		if(procSt != null && procSt != "")
//			_param['procSt'] = procSt;
//		if(evtNm != null && evtNm != "")
//			_param['evtNm'] = evtNm;
//		if(statEvetOutbDtm != null && statEvetOutbDtm != "")
//			_param['statEvetOutbDtm'] = statEvetOutbDtm;
//	}
//
//	_param["limit"] = 10;
//	_param["offset"] = offset;
//
//	_common.callAjax("/eventHist/getEventHistView.do", _param, function(view) {
//		$("#contentWrap").html(view);
//		$(".paging_wrap").paging({
//			current	  : 10,
//			max  	  : Number($("#max").val()),
//			nowOffset : Number($("#offset").val()),
//			bindEvent : callView
//		});
//		setList(_param);
//	});
}

function setList(param){
	$(".contentWrapper").find("#mobileShareTable").find("tbody").html("");

	var Json = "";
	for(var i=0; i<param.item.length; i++){
		var $tbl = $(".contentWrapper").find("#mobileShareTable");

		Json = param.item[i];
		Json['statEvetTypCd'] = "MBS";
		xeusJsonParser.setJson(param);

		var $tr = $("<tr></tr>").attr("k", (i+1)).data(Json);
		$tr.css({"cursor" : "pointer"}).click(function(){
			$('#ctntTable').parent().show();
			//xeusJsonParser.setEventContent($(this).data());
			xeusJsonParser.setEventContent($(this).data());
		});
		var $no_index = $("<td class='tCenter'></td>").html("<div class='index' k='"+(i+1)+"'>" + (i+1) + "</div>");

		var $statEvetNm = $("<td class='tCenter hidden'></td>").html("<div class='sText' title='cctvManagerNumber'>" + Json.cctvManagerNumber + "</div>");



		if(Json.streamUrl == null || Json.streamUrl=="" ){
			var $procSt = $("<td class='tCenter hidden'></td>").text("-");
		}else{
			var $procSt = $("<td class='tCenter hidden'></td>").text(Json.streamUrl);
		}


		if(Json.cctvNm == null || Json.cctvNm=="" ){
			var $cctvNm = $("<td class='tCenter'></td>").text("-");
		}else{
			var $cctvNm = $("<td class='tCenter'></td>").html("<div class='sText' title='$cctvNm'>" + Json.cctvNm + "</div>");
		}



		var $location = $("<td class='tCenter'></td>");
		var $btn = $("<button class='btn_t'>종료</button>").css({
			"cursor" : "pointer",
			"vertical-align" : "text-bottom"
		}).click(function(){
			event.stopPropagation();

			var v = $(this).parent().parent().attr("k");
			var chkNotice = $(".contentWrapper").find('.index');
			if(confirm("종료하시겠습니까?")){
				_common.callAjax("/GMT_mobileshare/api/close", { "index" : v }, function(json){
					_common.callAjax("/GMT_mobileshare/api/list", "", function(json) {
						$('#ctntTable').parent().css("display","none");
						setList(json);
					});
				}, false);
			}

		}).hover(function(){
//				$(this).attr("src", "./res/img/places_over.png");
		}, function(){
//				$(this).attr("src", "./res/img/places_normal.png");
		});

		$location.append($btn);
		$tr.append($no_index).append($statEvetNm).append($procSt).append($cctvNm).append($location);
		$tbl.append($tr);
	}
}