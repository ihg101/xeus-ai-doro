(function(){
	/**
	 * 파일 다운로드 이벤트 입니다
	 */
	function bindClickEventAboutFile(){

		$(".popupWrapper").find("#fileNm").click(function(){
			_common.postForm.submit("/cctvPreviewDoc/getFiles.json", { "mgrSeq" : $(this).attr("k") });
		}).hover(function(e){
			$(this).css("text-decoration", e.type === "mouseenter" ? "underline" : "none");
		}).css("cursor", "pointer");
	}

	/**
	 * 검색 이벤트 입니다.
	 */
	$(".contentWrapper").find("#searchBtn").click(function(){
		var _param = _common.utils.collectSendData(".contentWrapper #searchTable");
		_param["regDat"] = _param["regDat"].replace(/\-/gi, '');

		_common.callAjax("/cctvPreviewDoc/getList.json", _param, function(json){
			if(json.result.length == 0){
				var $tr = $("<tr><td colspan='4' class='tCenter' style='height:40px;'>결과가 존재하지 않습니다.</td></tr>");
				$(".contentWrapper").find("#resultTable").find("tbody").html($tr);
			}else{
				$(".contentWrapper").find("#resultTable").find("tbody").html("");
				for(var i=0; i<json.result.length; i++){
					var $tr = $("<tr class='tCenter' k='" + json.result[i].mgrSeq + "'></tr>");
						$tr.append("<td>" + json.result[i].regUserId + "</td>");
						$tr.append("<td>" + json.result[i].docNum + "</td>");
						$tr.append("<td>" + new Date().formatDate(json.result[i].regDat) + "</td>");
						$tr.append("<td><button class='detailBtn btn_style2'>상세</button></td>");

					var prop = json.result[i];
					$tr.data(prop);

					$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
				}

				/* 확인 버튼 이벤트입니다. */
				$(".contentWrapper").find(".detailBtn").click(function(){
					var prop = $(this).parent().parent().data();
					_common.callAjax("/cctvPreviewDoc/edit.json", { "mgrSeq" : prop.mgrSeq, "recvUserId" : userId, "recvDat" : new Date().getYMDHMS() }, function(json){
						var _html = '<div class="popupWrapper">';
						_html += $('#doc_pop_wrap').html();
						_html += '</div>';

						$("#popupWrap").dialog("close").html(_html).dialog({
							title : "공문 확인",
							width: 1000,
							height: 450,
							position: {
								my: "center top",
								at: "center top",
								of: $("#contentWrap")
							},
							open: function(){
								$(".popupWrapper").find("#docGbnCd").val(json.item.docGbnCd);
								$(".popupWrapper").find("#docNum").val(json.item.docNum);
								$(".popupWrapper").find("#fileNm").val(json.item.fileNm).attr("k", prop.mgrSeq);
								$(".popupWrapper").find("#regDat").val(new Date().formatDate(json.item.regDat));

								bindClickEventAboutFile();

								var list = JSON.parse(json.item.docJson);
								if(list.count == 0){
									$(".popupWrapper").find("#docJson").text("재생이력 없음").css("padding-left", "10px");
								}else{
									var $table = $("<table></table>").width("100%");
									$tr = $("<tr></tr>").append("<th class='top'>CCTV명</th>")
														.append("<th class='top'>사건번호</th>")
														.append("<th class='top'>신청사유</th>")
														.append("<th class='top'>재생일</th>");

									$tr.find("th").css("text-align", "center");
									$table.append($tr);
									for(var i=0; i<list.result.length; i++){
										$tr = $("<tr></tr>").append("<td>" + list.result[i].cctvNm + "</td>")
															.append("<td>" + list.result[i].acciNum + "</td>")
															.append("<td>" + list.result[i].reqResn + "</td>")
															.append("<td>" + new Date().formatDate(list.result[i].reqDat) + "</td>");

										$tr.find("td").css("text-align", "center");
										$table.append($tr);
									}
									$(".popupWrapper").find("#docJson").html($table).css("padding-left", "0");
								}
							},
							close: function(){
							}
						}).dialog("open");

					}, false);
				});
			}
		});
	});

	$(".contentWrapper").find("#regUserId").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#searchBtn").click();
		}
	});



	/* MonthPicker 생성 이벤트입니다. */
	/*$(".contentWrapper").find(".monthPicker").MonthPicker({
		MonthFormat: "yymm",
		Button: false
	});*/


	$("#doc_pop_wrap").find("table").width(1000);

	/* bPopup Close */
	$("#closeEditPop").click(function(){
		$("#doc_pop_wrap").bPopup().close();
	}).css("cursor", "pointer");

})();