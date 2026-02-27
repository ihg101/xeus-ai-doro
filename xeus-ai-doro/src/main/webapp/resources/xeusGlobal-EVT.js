/**
 * <pre>
 * 이벤트 모니터링 관련 이벤트 입니다.
 * </pre>
 *
 * @auther 이주영
 */
Public.EVT = {

	PV : ".tab[target=eventView]",

	Monitoring : {
		dialog : null,
		makeDialog : function(){
			var _html = "";
			_html  = '<div class="ui-dialog ui-corner-all ui-widget ui-widget-content eventPopup" style="width:100%;height:100%">';
			_html += 	'<div class="ui-dialog-titlebar ui-corner-all  ui-widget-header ui-helper-clearfix ">';
			_html += 		'<span id="ui-id-2" class="ui-dialog-title">';
			_html += 			'<div class="xeus-dialog-title-div">';
			_html += 				'<span class="xeus-dialog-title-txt" style="height: 36px; padding-left: 10px;">이벤트 알림</span>';
			_html += 			'</div>';
			_html += 		'</span>';
			_html += 		'<button type="button" id="event_btn_close" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close">';
			_html += 			'<span class="ui-button-icon ui-icon ui-icon-closethick"></span>';
			_html += 		'</button>';
			_html += 	'</div>';
			_html += 	'<div id="event_content" class="ui-dialog-content ui-widget-content" style="overflow:hidden;">';
			_html += 	'</div>';
			_html += '</div>';

			this.dialog = $(_html);
			$("body").append($(this.dialog));
			$(this.dialog).width(300).height(200);
			$(this.dialog).draggable();
			$(this.dialog).css({
				position: "absolute",
				display: "none",
				height: "auto",
				left: "45%",
				top: "30%"
			});
			$(this.dialog).find("#event_content").css("border-bottom", "1px solid black");
			$(this.dialog).find("#event_btn_close").click(function(){
				$(Public.EVT.Monitoring.dialog).remove();
				Public.EVT.Monitoring.dialog = null;
				$(".eventPopup").remove();
			});
		},
		interval : null,
		Start : function() {
			if(Public.StopEvent != null) Public.StopEvent();

			if (this.interval != null) clearInterval(this.interval);
			this.interval = setInterval(function() {

				_common.callAjax("/monitor/getMasterList.json", null, function(json){
					if(json.master != null){
						$(".searchWrapper").find("#resultTable").find("tbody").html("");

						var master = json.master;
						for(var i=0; i<master.length; i++){
							var $tr = $("<tr></tr>").addClass("pointer").attr("k", master[i].mgrNo);
							$tr.append("<td class='tCenter'>" + new Date().formatDate(master[i].recvDat) + "</td>");
							$tr.append("<td class='tCenter'>" + _common.getCodeByName("C63", master[i].eventTyp) + "</td>");
							$tr.append("<td class='tCenter'>" + _common.getCodeByName("C65", master[i].stateCd) + "</td>");
							$(".searchWrapper").find("#resultTable").find("tbody").append($tr);
						}
					}
				});

				if(!$(".searchWrapper").find("#passEvt").is(":checked")){
					_common.callAjax("/monitor/getAllEvnetList.json", null, function(json){
						car = json.car;
						bell = json.bell;

						if($(".searchWrapper").find("#carChk").is(":checked") && car != null){
							if(Public.EVT.Monitoring.dialog == null) Public.EVT.Monitoring.makeDialog();
							if($(".searchWrapper").find(".carPopup").is(":checked") && car.length > 0){
								$(Public.EVT.Monitoring.dialog).show();
								var $table = $("<table></table>").width("100%");
								for(var i=0; i<car.length; i++){
									var $tr1 = $("<tr></tr>").attr("type", "car");
									$tr1.append("<td class='tCenter' colspan='2'><img src='../res/img/event/car.png' style='margin: 30px;'></td>");
									$table.append($tr1);
									$table.append("<tr><th>이벤트 종류</th><th>이벤트 발생 시간</th></tr>");

									var $tr2 = $("<tr></tr>").addClass("pointer").attr("k", car[i].mgrNo);
									$tr2.append("<td class='tCenter'>" + _common.getCodeByName("C63", car[i].eventTyp) + "</td>");
									$tr2.append("<td class='tCenter'>" + new Date().formatDate(bell[i].recvDat) + "</td>");
									$table.append($tr2);
								}
								$table.css({
									"width": "100%",
								    "border-collapse": "collapse",
								    "font-size": "13px",
								    "font-weight": "400",
								    "line-height": "24px",
								    "color": "#666"
								});
								$table.find("th:first-child, td:first-child").css({
								    "border-left": "none"
								});
								$table.find("th").css({
									"height": "30px",
								    "background": "#f3f3f3",
								    "border-left": "1px #dddddd solid",
								    "border-bottom": "1px #dddddd solid"
								});
								$table.find("td").not(":eq(0)").css({
									"background": "white",
								    "border-left": "1px #dddddd solid",
								    "border-bottom": "1px #dddddd solid"
								});
								$("#event_content").html($table);
							}else{
								$(Public.EVT.Monitoring.dialog).hide();
							}
						}

						if($(".searchWrapper").find("#bellChk").is(":checked") && bell != null){
							if(Public.EVT.Monitoring.dialog == null) Public.EVT.Monitoring.makeDialog();
							if($(".searchWrapper").find(".bellPopup").is(":checked") && bell.length > 0){
								$(Public.EVT.Monitoring.dialog).show();
								var $table = $("<table></table>").width("100%");
								for(var i=0; i<bell.length; i++){
									var $tr1 = $("<tr></tr>").attr("type", "bell");
									$tr1.append("<td class='tCenter' colspan='2'><img src='../res/img/event/bell.png' style='margin: 30px;'></td>");
									$table.append($tr1);
									$table.append("<tr><th>이벤트 종류</th><th>이벤트 발생 시간</th></tr>");

									var $tr2 = $("<tr></tr>").addClass("pointer").attr("k", bell[i].mgrNo);
									$tr2.append("<td class='tCenter'>" + _common.getCodeByName("C63", bell[i].eventTyp) + "</td>");
									$tr2.append("<td class='tCenter'>" + new Date().formatDate(bell[i].recvDat) + "</td>");
									$table.append($tr2);
								}
								$table.css({
									"width": "100%",
								    "border-collapse": "collapse",
								    "font-size": "13px",
								    "font-weight": "400",
								    "line-height": "24px",
								    "color": "#666"
								});
								$table.find("th:first-child, td:first-child").css({
								    "border-left": "none"
								});
								$table.find("th").css({
									"height": "30px",
								    "background": "#f3f3f3",
								    "border-left": "1px #dddddd solid",
								    "border-bottom": "1px #dddddd solid"
								});
								$table.find("td").not(":eq(0)").css({
									"background": "white",
								    "border-left": "1px #dddddd solid",
								    "border-bottom": "1px #dddddd solid"
								});
								$("#event_content").html($table);
							}else{
								$(Public.EVT.Monitoring.dialog).hide();
							}
						}
					});
				}
			}, 1000);

			Public.StopEvent = function() {
				$(this.EVT.Monitoring.dialog).remove();
				clearInterval(this.EVT.Monitoring.interval);
				this.EVT.Monitoring.dialog = null
				this.EVT.Monitoring.interval = null;
				$(".eventPopup").remove();
				this.StopEvent = null;
			}
		}
	},

	Add : {
		Start : function(evt) {
			var coordinates = evt.coordinate;
			var epsg = GMXMAP.getView().getProjection().getCode();
			var mainCenter = ol.proj.transform(coordinates, epsg, 'EPSG:4326');
			$("#eventWrapper").find("#outbPosX").val(mainCenter[0]);
			$("#eventWrapper").find("#outbPosY").val(mainCenter[1]);

			//$("body").css("cursor", "default");
			$(".selectCancel").hide(500);
			GMXMAP.un('click', Public.EVT.Add.Start);
		}
	}
}