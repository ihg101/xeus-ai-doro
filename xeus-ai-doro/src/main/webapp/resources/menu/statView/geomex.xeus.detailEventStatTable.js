/**
 * 상세 이벤트통계테이블 script
 *
 * @auther 민동현
 */

	$(document).ready(function(){
		var limit =$(".contentWrapper").find('#limit').val().trim();

		if(limit == undefined || limit == null || limit =="" || limit ==0){
			limit = 100;
		}
		if ($('#max').val() == '0') $(".contentWrapper").find('#btn_list_all').show();

		$(".contentWrapper").find(".paging_wrap").paging({
			current	  : Number(limit),
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});

	});


	/**
	 *  paging 할 때 호출하는 함수
	 */
	var callView = function(offset,_param, scrollHeight){

		var limit =$(".contentWrapper").find('#limit').val().trim();
		if(offset == null) offset = 0;
		_param = {};
		_param['limit'] = limit;
		_param['offset'] = offset;

		_param['startDat'] = startDat;
		_param['endDat'] = endDat;
		_param['emdCd'] = emdCd;
		_param['evtTypCd'] = evtTypCd;
		_param['evtNm'] = evtNm;


//		if(sortCol != undefined && sortTyp != undefined){
//			if(_param['sortCol'] != "" && _param['sortTyp'] != ""){
//				_param['sortCol'] = sortCol;
//				_param['sortTyp'] = sortTyp;
//			}
//		}


		_common.callAjax("/stat/getDetailEventStatTableView.do", _param, function(view){
			$(".detailEventStatDiv").html("");
			$(".detailEventStatDiv").append(view);

		}, false);
	}

	/**
	 * 엑셀 다운로드 클릭 시
	 */
	$(".contentWrapper").find("#detailEventexcelDownBtn").click(function(){
		var txt = '이벤트상세정보';
		var $table = $("<table>");
		var $colgroup = $("<colgroup>");
		$colgroup.append('<col width="200"><col width="200"><col width="700"><col width="200"><col width="200">');

		var $thead = $("<thead>");
		$thead.append('<tr><th>이벤트 종류</th><th>이벤트 분류</th><th>이벤트 상세분류</th><th>발생시간</th><th>종료시간</th><th>법정동</th></tr>');
		var $tbody = $("<tbody>");

		var _param = JSON.parse(JSON.stringify($(".detailEventStatDiv").data("param")));
		delete _param["limit"];
		delete _param["offset"];

		_common.callAjax("/stat/getDetailEventList.json",_param, function(json) {
			var result = json.result;

			for(var i=0; i<result.length; i++){
				var evtTypCd = result[i].evtTypCd.trim();
				var evtNm = result[i].evtNm.trim();
				var evtCntn = result[i].evtCntn.trim();
				var evtOutbDtm = result[i].evtOutbDtm.trim();
				var evtActnDtm = result[i].evtActnDtm.trim();

				if(evtOutbDtm.length > 14){
					evtOutbDtm = evtOutbDtm.substring(0,14);
				}
				if(evtActnDtm.length > 14){
					evtActnDtm = evtActnDtm.substring(0,14);
				}
				evtOutbDtm = new Date().formatYMDHMS(evtOutbDtm);
				evtActnDtm = new Date().formatYMDHMS(evtActnDtm);

				var emdKorNm = result[i].emdKorNm;

				$tbody.append('<tr><td>'+evtTypCd+'</td><td>'+evtNm+'</td><td>'+evtCntn+'</td><td>'+evtOutbDtm+'</td><td>'+evtActnDtm+'</td><td>'+emdKorNm+'</td></tr>');
			}

		}, false);



	//		$table.find(".hashValue").css("display","table-cell");
		$table.append($colgroup).append($thead).append($tbody);

		$table.css("border", "medium  solid black");
		$table.find("th").css("font-weight", "bold").width("auto").height(80).css("border", "medium  solid black").css("background", "#0078d4");
		$table.find("td").css("text-align", "center").height(80).css("border", "medium  solid black");

		var data_type = 'data:application/vnd.ms-excel;charset=utf-8';
		var table_html = encodeURIComponent($table[0].outerHTML);

		var a = document.createElement('a');
		a.href = data_type + ',%EF%BB%BF' + table_html;
	    a.download = txt + '.xls';
	    a.click();
	    $(a).remove();
	});


