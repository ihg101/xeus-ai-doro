(function(){

	Public.CCTV.Dmtia.Start();

	/**
	 * 속성 검색 이벤트 입니다.
	 */
	$(".contentWrapper").find("#searchBtn").click(function(){
		var _param = _common.utils.collectSendData(".contentWrapper #searchTable");
		_common.callAjax("/eventDmtia/getLocationList.json", _param, function(json){
			if(json.result.length == 0){
				var $tr = $("<tr><td colspan='5' class='tCenter'>결과가 존재하지 않습니다.</td></tr>");
				$(".contentWrapper").find("#resultTable").find("tbody").html($tr);
			}else{
				$(".contentWrapper").find("#resultTable").find("tbody").html("");
				for(var i=0; i<json.result.length; i++){
					var $tr = $("<tr class='tCenter' k='" + json.result[i].mgrNo + "'></tr>");
						$tr.append("<td>" + json.result[i].dmtiaNm + "</td>");
						$tr.append("<td>" + json.result[i].dmtiaGender + "</td>");
						$tr.append("<td>" + json.result[i].dmtiaPhone + "</td>");
						$tr.append("<td>" + json.result[i].protectorPhone + "</td>");
						$tr.append("<td><button class='photoBtn btn_t'>사진</button><button class='locBtn btn_t'>위치</button></td>");

					var prop = {
						locMgrNo : json.result[i].locMgrNo,
						dmtiaMgrNo : json.result[i].dmtiaMgrNo,
						locDat : json.result[i].locDat,
						lat : json.result[i].lat,
						lon : json.result[i].lon,
						dmtiaNm : json.result[i].dmtiaNm,
						dmtiaGender : json.result[i].dmtiaGender,
						dmtiaPhone : json.result[i].dmtiaPhone,
						protectorPhone : json.result[i].protectorPhone,
						point : Spatial.convertProjection([json.result[i].lon, json.result[i].lat], "EPSG:4326", "EPSG:5186")
					};
					$tr.data(prop);

					$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
				}

				/* 위치 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find(".locBtn").click(function(){
					var prop = $(this).parent().parent().data();
					GMXMAP.addPulse(prop.point,true);

					var lastTime = $(".contentWrapper").find("#lastTime").val();

					var today = new Date();
					today.setHours(today.getHours() - Number(lastTime));
					var year = today.getFullYear();
					var month = today.getMonth() + 1;
					var day = today.getDate();
					var hour = today.getHours();
					var min = today.getMinutes();

					if(Number(month) < 10){ month = "0" + month; }
					if(Number(day) < 10){ day = "0" + day; }
					if(Number(hour) < 10){ hour = "0" + hour; }
					if(Number(min) < 10){ min = "0" + min; }

					var resultTime = year + '' + month + '' + day + '' + hour + '' + min + '00';
					var locParm = {
						"dmtiaMgrNo" : prop.dmtiaMgrNo,
						"locDat" : resultTime
					};

					$(".contentWrapper").find("#detailProtecTable").find("#dmtiaNm").text(prop.dmtiaNm);
					$(".contentWrapper").find("#detailProtecTable").find("#protectorPhone").text(prop.protectorPhone);

					Public.CCTV.Dmtia.DetailReload(prop.dmtiaMgrNo, resultTime);

				});

				/* 사진 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find(".photoBtn").click(function(){
					var prop = $(this).parent().parent().data();

					var _html = '';
					_html += '<div id="dmtiaImgInfo"> ';
					_html += '    <table class="list"> ';
					_html += '        <thead> ';
					_html += '        	<tr class="tCenter"> ';

					_common.callAjax("/image/getImgList.json", { "refMgrNo" : prop.dmtiaMgrNo }, function(json) {
						if (json.result.length > 0){
							_html += '<td style="width: 380px; height: 300px;"><img style="width: 380px;" alt="'+json.result[0].fileNm+'" src="./image/getImage.do?mgrSeq='+json.result[0].mgrSeq+'" k="'+json.result[0].mgrSeq+'"></td> ';
						} else {
							_html += "<td><div class='not_img'>사진 정보가 존재하지 않습니다.</div></td>";
						}
					}, false);

					_html += '        	</tr> ';
					_html += '        </thead> ';
					_html += '        <tbody> ';
					_html += '        	<tr class="tCenter"> ';
					_html += '            <td> ';
					_html += '            	<form id="hiddenForm" method="POST" enctype="multipart/form-data"> ';
					_html += '            		<input type="text" name="k" id="k" class="hidden" value="' + prop.dmtiaMgrNo + '"> ';
					_html += '            		<input type="text" name="i" id="i" class="hidden" value="0"> ';
					_html += '            		<input type="text" name="p" id="p" class="hidden" value="\dmtia\\"> ';
					_html += '            		<input type="file" name="uploadImg" id="uploadImg" accept="image/gif, image/jpeg, image/png"> ';
					_html += '            	</form> ';
					_html += '            </td> ';
					_html += '        	</tr> ';
					_html += '        </tbody> ';
					_html += '    </table> ';
					_html += '</div> ';

					$("#popupWrap").html(_html).dialog({
						title: prop.dmtiaNm + " 어르신 사진 정보",
						minWidth: "400",
//						maxHeight: "700",
						height: "auto",
						position: {
							my: "center",
							at: "center",
							of: $("#map")
						},
						modal: true,
						open: function(){
							$('#dmtiaImgInfo').find("thead").find("img").click(function(){
								_common.postForm.open($(this).attr("src").replace("..", ""));
							}).css("cursor", "pointer");

							$('#dmtiaImgInfo').find('input[type=file]').change(function(){
								if(confirm("선택하신 파일을 업로드 하시겠습니까?")){
									_common.callAjax("/image/del.json", { "refMgrNo" : prop.dmtiaMgrNo }, function(_json){
										if(_json.result){
											_common.formSubmit("/image/add.json", $("#hiddenForm"), function(__json){
												if(__json.result){
													_common.callAjax("/image/getImgList.json", { "refMgrNo" : prop.dmtiaMgrNo }, function(json) {
														var elem = '<td style="width: 380px; height: 300px;"><img style="width: 380px;" alt="'+json.result[0].fileNm+'" src="./image/getImage.do?mgrSeq='+json.result[0].mgrSeq+'" k="'+json.result[0].mgrSeq+'"></td> ';
														$('#dmtiaImgInfo').find("thead").find("tr").html(elem);

														$('#dmtiaImgInfo').find("thead").find("img").click(function(){
															_common.postForm.open($(this).attr("src").replace("./", "/"));
														}).css("cursor", "pointer");
													}, false);
												}
											}, false);
										}
									}, false);
								}else{
									$("#hiddenForm").find("#uploadImg").val("");
								}
							});
						},
						close: function(){
							$("#popupWrap").html("");
						},
						resizable: false
					}).dialog("open");
				});

				/* 위치 버튼 이벤트입니다. */
				$(".contentWrapper").find("#resultTable").find(".locBtn").mousedown(function(){
					$(".contentWrapper").find("#detailTable").find("tbody").html("");
				});
			}
		});
	});

	$(".contentWrapper").find("#dmtiaNm").keyup(function(e){
		if(e.which == 13){
			$(".contentWrapper").find("#searchBtn").click();
		}
	});

})();