(function(){

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

	function showSpinner(){
		var target = $(".contentWrapper").find('#loading_img')[0];
		spinner = new Spinner(spinnerOpts).spin(target);
		$(".contentWrapper").find('#loading_wrap').show();
	}

	function hideSpinner(){
		spinner.stop();
		$(".contentWrapper").find('#loading_wrap').hide();
	}

	//신규 추가 이벤트 입니다.
	$(".contentWrapper").find("#newRegBtn").click(function(){
		_common.callAjax("/cctv/getNewregCctvView.do", {}, function(view){
			if($("#newregCctvWrap").length === 0){
				var $newregCctvWrap = $("<div>").attr("title", "CCTV 신규 등록").attr("id", "newregCctvWrap");

				$newregCctvWrap.html($("<div>").addClass("table_style").addClass("customScroll").html(view)).dialog({
					width: 650,
					height: $("#body").height(),
					position: {
						my: "left top",
						at: "left top",
						of: $("#body")
					},
					open: function(){

					},
					close: function(){
						$newregCctvWrap.dialog("destroy");
					}
				}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
			}
		}, false);
	});

	//목록 조회 이벤트 입니다.
	$(".contentWrapper").find("#cctvSyncBtn").click(function(){
		showSpinner();
		_common.callAjax("/nms/getCctvListToVms.json", {"vmsTyp":"VURIX"}, function(json){
			if(json.result){
				getList(json);
			}else{
				alert(json.msg);
			}
			hideSpinner();
		});
	});

	function getList(json){

		var un = json.un;
		var excess = json.excess;

		var idSync = json.idSync;
		var nmSync = json.nmSync;

		$(".contentWrapper").find("#resultTable").find("tbody").html('');

		if(un){
			for(var key in un){
				var $tr = $("<tr class='tCenter' un='" + key + "'></tr>").data(un[key]);
				$tr.append("<td>미등록</td>");
				$tr.append("<td><div title='"+un[key].cctvNm+"'" + "class='tLeft sText'>" + un[key].cctvNm + "<div></td>");
				$tr.append("<td><button class='btn_style2 detailBtn' gbn='un'>관리</button></td>");

				$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
			}

			//미등록 버튼 이벤트 입니다.
			$(".contentWrapper").find("#resultTable").find(".detailBtn[gbn=un]").click(function(){
				var _param = $(this).parent().parent().data();

				_common.callAjax("/cctv/getUnregCctvView.do", _param, function(view){
					if($("#newregCctvWrap").length === 0){
						var $newregCctvWrap = $("<div>").attr("title", "CCTV 미등록 관리").attr("id", "newregCctvWrap");

						$newregCctvWrap.html($("<div>").addClass("table_style").addClass("customScroll").html(view)).dialog({
							width: 650,
							height: $("#body").height(),
							/*resizable: false,
							draggable: false,*/
							position: {
								my: "left top",
								at: "left top",
								of: $("#body")
							},
							open: function(){

							},
							close: function(){
								$newregCctvWrap.dialog("destroy");
							}
						}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
					}
				}, false);
			});

		}

		if(excess){
			for(var key in excess){
				var $tr = $("<tr class='tCenter' k='" + excess[key].mgrNo + "'></tr>");
				$tr.append("<td>과등록</td>");
				$tr.append("<td><div title='"+excess[key].cctvNm+"'" + "class='tLeft sText'>" + excess[key].cctvNm + "<div></td>");
				$tr.append("<td><button class='btn_style2 detailBtn' gbn='excess'>관리</button></td>");

				$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
			}

			//과등록 버튼 이벤트 입니다.
			$(".contentWrapper").find("#resultTable").find(".detailBtn[gbn=excess]").click(function(){
				var v = $(this).parent().parent().attr("k");

				_common.callAjax("/nms/getGeometryLocation.json", {k : v}, function(json) {
					GMXMAP.addPulse([Number(json.result[0].annoX), Number(json.result[0].annoY)], true);
				});

				_common.callAjax("/cctv/getCctvMngView.do", {mgrNo : v}, function(view) {
					if($("#cctvMngWrap").length === 0){
						var $cctvMngWrap = $("<div>").attr("title", "CCTV 정보 관리").attr("id", "cctvMngWrap");

						$cctvMngWrap.html($("<div>").addClass("table_style").addClass("customScroll").html(view)).dialog({
							width: 650,
							height: $("#body").height(),
							/*resizable: false,
							draggable: false,*/
							position: {
								my: "left top",
								at: "left top",
								of: $("#body")
							},
							open: function(){

							},
							close: function(){
								$cctvMngWrap.dialog("destroy");
							}
						}).dialog("open").parent().draggable({ containment: "#body", scroll: false });
					}
				}, false);
			});
		}

		if(!('un' in json) && !('excess' in json)){
			var $tr = $("<tr class='tCenter'></tr>");
			$tr.append("<td colspan='3'>검색결과가 존재하지 않습니다.</td>");

			$(".contentWrapper").find("#resultTable").find("tbody").append($tr);
		}


		$(".contentWrapper").find("#idSyncBtn").remove();
		$(".contentWrapper").find("#nmSyncBtn").remove();

		//디바이스 ID 동기화
		//if(idSync.length > 0){
		if(idSync.length){
			var $idSyncBtn = $('<button class="btn_Dstyle" id="idSyncBtn">ID 동기화</button>').data({'list': idSync});
			$idSyncBtn.click(function(){
				createPopup('idSyncPop', $(this).data('list'));
			});

			$(".contentWrapper").find(".title").append($idSyncBtn);
		}

		//명칭 동기화
		//if(nmSync.length > 0){
		if(nmSync.length){
			var $nmSyncBtn = $('<button class="btn_Dstyle" id="nmSyncBtn">명칭 동기화</button>').data({'list': nmSync});
			$nmSyncBtn.click(function(){
				createPopup('nmSyncPop', $(this).data('list'));
			});

			$(".contentWrapper").find(".title").append($nmSyncBtn);
		}

	}

	function createPopup(id, data){
		$(".contentWrapper").find(".bpopup").remove();

		var $syncWrap = $("<div>").addClass("table_style").attr("title", "명칭 기준 동기화 (명칭을 이용하여 고유 ID를 동기화 합니다)");
		if(id.indexOf('idSync') > -1) $syncWrap.attr("title", "ID 기준 동기화 (고유 ID를 이용하여 명칭을 동기화 합니다)");

		var _html = '';
		_html += '<div id="'+id+'"> ';
		_html += '<div id="bpop_wrap"> ';
		_html += '    <div> ';
		_html += '    <table class="list"> ';// cellspacing="0" width="100%" style="margin-top:0;"
		_html += '      <colgroup> ';
		_html += '	        <col width="70px" /> ';
		_html += '          <col width="" /> ';
		_html += '      </colgroup> ';
		_html += '      <tbody> ';
	 	_html += '        <tr> ';
		_html += '            <th class="top"><input type="checkbox" style="width: 15px; height: 15px; padding-left: 0px;" class="cctvAllChk"></th> ';
	if(id.indexOf('idSync') > -1){
		_html += '            <th class="top">플랫폼 명칭 / VMS 명칭</th> ';
	} else {
		_html += '            <th class="top">플랫폼 ID / VMS ID</th> ';
	}
		_html += '        </tr> ';
		_html += '      </tbody> ';
		_html += '    </table> ';
		_html += '    </div> ';
		_html += '    <div class="contentWrapper customScroll" style="margin-left: 0px; height: calc(100% - 100px); overflow-x: hidden;"> ';// style="height: 376px;"
		_html += '    <table> ';
		_html += '      <colgroup> ';
		_html += '	          <col width="70px" /> ';
		_html += '            <col width="" /> ';
		_html += '      </colgroup> ';
		_html += '      <tbody> ';
	for(var i=0; i<data.length; i++){
		_html += '        <tr> ';
		_html += '            <td style="text-align: center; padding-left: 0px;">';
		_html += '            	<input type="checkbox" style="width: 15px; height: 15px; padding-left: 0px;" class="target" key="'+data[i].key+'" vms="'+data[i].vms+'"></td>';
		//_html += '            <td class="content">'+data[i].key+' ['+data[i].db+' &nbsp; / &nbsp; '+data[i].vms+']</td> ';
		_html += '            <td class="content">고유 ID : '+data[i].key+'<br>플랫폼 : '+data[i].db+'<br>VMS : '+data[i].vms+'</td> ';
		_html += '        </tr> ';
	}
		_html += '      </tbody> ';
		_html += '    </table> ';
		_html += '	  </div> ';

		_html += '    <div class="btnDiv"> ';
		_html += '    	<button id="syncBtn" class="btn_style">동기화</button> ';//style="width: 100px;"
		_html += '    </div> ';
		_html += '    </div> ';
		_html += '    </div> ';

		$syncWrap.html(_html).dialog({
			width: 600,
			height: $("#body").height(),
			modal: true,
			/*resizable: false,
			draggable: false,*/
			position: {
				my: "left top",
				at: "left top",
				of: $("#body")
			},
			open: function(){

			},
			close: function(){
				$syncWrap.dialog("destroy");
			}
		}).dialog("open").parent().draggable({ containment: "#body", scroll: false });

		//tr 클릭 시 체크박스 클릭
		$('#' +id).find('.content').click(function(){
			$(this).parent().find('input.target').click();
		});

		//전체선택 체크 시 모든 체크박스 체크
		$('#' +id).find(".cctvAllChk").change(function(){

			if($(this).is(":checked")){
				$('.target').prop('checked', true);
			}else{
				$('.target').prop('checked', false);
			}
		});

		$('#' +id).find('#syncBtn').click(function(){

			if($('#' +id).find('input.target:checked').length > 0){
				if(confirm("동기화를 진행하시겠습니까?")){
					var data = [];
					var keys = [];
					$('#' +id).find('input.target:checked').each(function(){
						var key = $(this).attr("key");
						var vms = $(this).attr("vms");

						data.push( {key: key, val: vms} );
						keys.push(key);
					});

					var gbn = "";
					if(id == "idSyncPop") gbn = "idSync";
					if(id == "nmSyncPop") gbn = "nmSync";

					if(!_common.utils.isNullAndEmpty(gbn)){
						_common.callAjax("/nms/syncCctv.json", { gbn: gbn, data: encodeURIComponent(JSON.stringify(data)) }, function(json){
							if(json.result){
								alert('동기화가 완료되었습니다.');

								var $targetBtn = $(".contentWrapper").find('#'+gbn+'Btn');

								var syncList = $targetBtn.data('list');
								for(var i=syncList.length-1; i>=0; i--){
									if(keys.indexOf(syncList[i].key) > -1){
										syncList.splice(i, 1);
									}
								}

								if(syncList.length > 0){
									$targetBtn.data({'list': syncList});
								}else{
									$targetBtn.remove();
								}

								if(GMXMAP.getLayer("asset_cctv") != null){
									GMXMAP.reloadLayerData("asset_cctv");
								}

								$syncWrap.dialog("close");
							} else {
								alert(json.msg);
							}
						});
					}else{
						alert('작업 도중 오류가 발생했습니다.');
					}
				}
			}else{
				alert('선택된 CCTV가 없습니다.');
			}
		});
	}

})();