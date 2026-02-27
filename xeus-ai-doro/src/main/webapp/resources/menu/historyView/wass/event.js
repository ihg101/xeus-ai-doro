/**
 * 페이지의 각종 이벤트를 관리합니다.
 *
 * @author 이주영
 */
$(function(){

	var _SEARCH_RESULT = null;
	var _SEARCH_PARAMETERS = null;
	var _WASS = (function(_common){
		var _this_ = {};

		/**
		 * 이력을 검색합니다.
		 */
		_this_.getList = function(_Offset){
			var _DEFAULT_LIMIT = 20;
			var $LIMIT = $("#search > #limit");
			if(!_common.utils.validNaN(Number($LIMIT.val()))){
				$LIMIT.val(_DEFAULT_LIMIT);
			}

			var _Limit = Number($LIMIT.val());
			var _Parameters = _common.utils.collectSendData(".info_box");
			_Parameters["limit"] = _Limit;
			_Parameters["offset"] = _Offset;

			if(_SEARCH_PARAMETERS != null){
				if(!_common.utils.isNullAndEmpty(_SEARCH_PARAMETERS["sortCol"]) && !_common.utils.isNullAndEmpty(_SEARCH_PARAMETERS["sortTyp"])){
					_Parameters["sortCol"] = _SEARCH_PARAMETERS["sortCol"];
					_Parameters["sortTyp"] = _SEARCH_PARAMETERS["sortTyp"];
				}
			}

			if(!_common.utils.isNullAndEmpty(_Parameters["startDat"]) && !_common.utils.isNullAndEmpty(_Parameters["endDat"])){
				_Parameters["startDat"] = _Parameters["startDat"].replaceAll("-", "") + "000000";
				_Parameters["endDat"] = _Parameters["endDat"].replaceAll("-", "") + "125959";
			}

			_Parameters["svcTy"] = _common.utils.validNull(_Parameters["svcTy"]);

			_common.callAjax("/wass/getList.json", _Parameters, function(_JSON){
				_SEARCH_RESULT = _JSON;
				_SEARCH_PARAMETERS = _Parameters;

				var maxCount = _JSON.count;
				var list = _JSON.result;
				var dataCnt = list.length;

				$("#wrap").find("#count").text("총 " + maxCount + "건이 검색되었습니다.");

				var $template = $("#wass_item_template");
				var $tbody = $template.parent();
				var $templateCopy = $($template.html());
				$tbody.children().not("template").remove();

				for(var i=0; i<dataCnt; i++){
					var $item = $($templateCopy.clone()).data(list[i]);

					$item.find("td").each(function(){
						var key = $(this).attr("class");

						if(key === "idx"){
							$(this).text(_Offset + (i + 1));
						}else if(key === "svcTy"){
							$(this).text($("#svcTy").find("option[value=" + list[i][key] + "]").text()).addClass("tCenter");
						}else if(key === "rqstDat" || key === "evtOcrTime"){
							$(this).text(Date.prototype.formatYMDHMS(_common.utils.validNull(list[i][key].substring(0, 14)))).addClass("tCenter");
						}else if(key === "result"){
							$(this).text(String(list[i][key]) === "0" ? "성공" : "실패");
						}else{
							$(this).text(_common.utils.validNull(list[i][key])).addClass("tCenter");
						}
					});

					$tbody.append($item);
				}

				$(".contentWrapper").find(".paging_wrap").show().paging({
					max  	  : maxCount,
					current	  : _Limit,
					nowOffset : _Offset,
					bindEvent : _WASS.getList
				});

				if(dataCnt == 0){
					var $tr = $("<tr>");
					$tr.append($("<td>").attr("colspan", 19).addClass("tCenter").height(300).html("<b>검색결과가 존재하지 않습니다.</b>"));
					$tbody.append($tr);
				}
			}, false);
		}

		/**
		 * 장애 검색 목록을 엑셀로 다운로드 합니다.
		 */
		_this_.exportExcel = function(){
			if(_SEARCH_RESULT == null){
				alert("엑셀 다운로드는 검색 후 가능합니다.");
				return;
			}

			var list = _SEARCH_RESULT.result;
			var dataCnt = _SEARCH_RESULT.count;

			if(dataCnt == 0){
				alert("검색 결과가 존재하지 않습니다.")
				return;
			}

			if(dataCnt > 0){
				delete _SEARCH_PARAMETERS["limit"];
				delete _SEARCH_PARAMETERS["offset"];
				_common.postForm.submit("/wass/getWassLogExcelView.do", _SEARCH_PARAMETERS);
			}
		}

		return _this_;
	})(window._common);

	/**
	 * 시작일과 종료일을 오늘 날짜로 입력합니다.
	 */
	$("#search").find("#startDat, #endDat").val(new Date().toISOString().split("T")[0]);

	/**
	 * 이력을 검색합니다.
	 */
	$("#search").find("#searchBtn").click(function(){
		_WASS.getList(0);
	}).click();

	/**
	 * Enter Key 이벤트로 검색합니다.
	 */
	$("#search").find("input, select").keyup(function(e){
		if(e.which == 13) $("#searchBtn").click();
	});

	/**
	 * 검색 결과를 엑셀로 다운로드 합니다.
	 */
	$("#search").find("#excelBtn").click(function(){
		_WASS.exportExcel();
	});

	/**
	 * 컬럼 선택시 정렬을 다시 합니다.
	 */
	$("#wassList").find("th").eq(0).css("cursor", "no-drop");
	$("#wassList").find("th").not(":eq(0)").click(function(){
		$("#wassList").find("th").not($(this)).removeClass("asc").removeClass("desc");
		$("#wassList").find("th").each(function(){
			$(this).removeClass("active").text($(this).text().replaceAll("▲", "").replaceAll("▼", ""));
		});

		$(this).addClass("active");

		var camel2under = function(str){
			return str.replace(/([A-Z])/g, function(arg){
				return "_"+arg.toLowerCase();
			});
		}

		var sortCol = camel2under($(this).attr("column"));
		var sortTyp = "";
		if(!$(this).hasClass("asc") && !$(this).hasClass("desc")){
			sortTyp = "desc";
			$(this).addClass("desc").text($(this).text() + "▼");
		}else if($(this).hasClass("asc")){
			sortTyp = "desc";
			$(this).addClass("desc").removeClass("asc").text($(this).text() + "▼");
		}else if($(this).hasClass("desc")){
			sortTyp = "asc";
			$(this).addClass("asc").removeClass("desc").text($(this).text() + "▲");
		}

		if(_SEARCH_PARAMETERS != null){
			_SEARCH_PARAMETERS["sortCol"] = camel2under(sortCol);
			_SEARCH_PARAMETERS["sortTyp"] = sortTyp;

			_WASS.getList(_SEARCH_PARAMETERS["offset"]);
		}
	}).css("cursor", "pointer");

});