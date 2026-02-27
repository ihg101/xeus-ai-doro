(function(){

	function validPatrolData(){
		var moveSec = Number($("#moveSec").val());
		var moveBuffer = Number($("#moveBuffer").val());
		var showCnt = Number($("#showCnt").val());
		var drawNm = $("#drawNm").val();

		if(Public.CCTV.Patrol.vector == null){
			alert("경로가 존재하지 않아 순찰감시를 시작 할 수 없습니다.");
			return false;
		}

		if(isNaN(moveSec)){
			alert("이동간격은 숫자만 입력하실 수 있습니다.");
			return false;
		}
		if(moveSec < 10 || moveSec > 101){
			alert("이동간격은 10~100 초 사이로 설정하실 수 있습니다.");
			return false;
		}
		if(isNaN(moveBuffer)){
			alert("검색반경은 숫자만 입력하실 수 있습니다.");
			return false;
		}
		if(moveBuffer < 1 || moveBuffer > 10001){
			alert("검색반경은 1~10000 미터 사이로 설정하실 수 있습니다.");
			return false;
		}
		if(isNaN(showCnt)){
			alert("표시CCTV는 숫자만 입력하실 수 있습니다.");
			return false;
		}
		if(!Number.isInteger(showCnt)){
			alert("표시CCTV는 정수만 입력하실 수 있습니다.");
			return false;
		}
		if(showCnt < 1 || showCnt > 21){
			alert("표시CCTV는 1~20 개 사이로 설정하실 수 있습니다.");
			return false;
		}
		if(drawNm == null || drawNm == ""){
			alert("경로명을 입력해 주세요.");
			return false;
		}

		return true;
	}

	function viewPathGeometry(v){
		_common.callAjax("/cctv/getPatrolItem.json", {gid : v}, function(json){
			$("#moveSec").val(json.result.intvlTime);
			$("#moveBuffer").val(json.result.srchRadius);
			$("#showCnt").val(json.result.cctvLimit);
			$("#drawNm").val(json.result.titleNm);

			var wkt = json.result.wkt;
			var format = new ol.format.WKT();
			var feature = format.readFeature(wkt);
			var prop = {
				"draw_nm" : $("#drawNm").val(),
				"ol_uid" : feature.ol_uid,
				"geomArray" : feature.getGeometry().getCoordinates(),
				"wkt" : wkt
			};

			feature.setProperties(prop);

			if (Public.CCTV.Patrol.vector != null) {
				Public.CCTV.Patrol.vector.getSource().clear();
				GMXMAP.removeLayer(Public.CCTV.Patrol.vector);
				Public.CCTV.Patrol.vector = null;
			}

			Public.CCTV.Patrol.vector = new ol.layer.Vector({
				source : new ol.source.Vector({
					wrapX : false,
					features: [feature]
				}),
				style : function(f) {
					var geometry = f.getGeometry();
					var styles = [new ol.style.Style({
							stroke : new ol.style.Stroke({
								color : "blue",
								width : 2
							})
						})
	              	];

					var last = null;
					var points = new Array();
					geometry.forEachSegment(function(start, end){
						points.push(start.slice());
						last = end.slice();
					});
					points.push(last);

					for(var i=0; i<points.length; i++){
						styles.push(new ol.style.Style({
							geometry: new ol.geom.Point(points[i]),
							image: new ol.style.Circle({
								radius: 5,
								stroke: new ol.style.Stroke({
									color: 'rgba(0, 128, 0, 1.0)',
									width: 2
								}),
								fill : new ol.style.Fill({
									color: 'rgba(255, 255, 255, 1.0)'
								})
							}),
							text: new ol.style.Text({
								font: '15px Calibri,sans-serif',
								textBaseline: "bottom",
								offsetY: -10,
								text: (i + 1) + "번 경로",
								fill: new ol.style.Fill({
									color: '#000'
								}),
								stroke: new ol.style.Stroke({
									color: '#fff',
									width: 3
								})
							})
						}));
					}

			        return styles;
			      }
			});

			GMXMAP.addLayer(Public.CCTV.Patrol.vector);

			Public.StopEvent = function() {
				$("#drawCncl").hide("slow");
				$("#drawList").removeAttr("wkt").html("");

				this.CCTV.Patrol.AutoMoveStop();

				if (this.CCTV.Patrol.interaction != null) {
					GMXMAP.removeInteraction(this.CCTV.Patrol.interaction);
					this.CCTV.Patrol.interaction = null;
				}

				if (this.CCTV.Patrol.vector != null) {
					this.CCTV.Patrol.vector.getSource().clear();
					GMXMAP.removeLayer(this.CCTV.Patrol.vector);
					this.CCTV.Patrol.vector = null;
				}

				this.StopEvent = null;
			}
		});
	}

	/* 경로 그리기 이벤트 입니다. */
	$(".contentWrapper").find("#drawBtn").click(function(){
		if(Public.CCTV.Patrol.interval != null){
			if(confirm("순찰감시를 종료하고 그리기를 시작하시겠습니까?")){
				Public.CCTV.Patrol.AutoMoveStop();
				Public.CCTV.Patrol.DrawStart();
				$("#drawCncl").show();
			}
		}else{
			var drawNm = $(".contentWrapper").find("#drawNm").val();
			if(_common.utils.isNullAndEmpty(drawNm)){
				alert("경로명을 입력해 주세요.");
				return false;
			}
			Public.CCTV.Patrol.DrawStart();
			$("#drawCncl").show();
		}
	});

	/* 경로취소 이벤트 입니다. */
	$(".contentWrapper").find("#drawCncl").click(function(){
		Public.CCTV.Patrol.interaction.setActive(false);
		$("#drawCncl").hide("slow");
	});

	/* 감시 시작 이벤트입니다. */
	$(".contentWrapper").find("#patrolStart").click(function(){
		if(validPatrolData()){
			var moveSec = Number($("#moveSec").val());
			var moveBuffer = Number($("#moveBuffer").val());
			var showCnt = Number($("#showCnt").val());

			Public.CCTV.Patrol.AutoMoveStart(moveSec, moveBuffer, showCnt);
		}
	});

	/* 감시 취소 이벤트 입니다. */
	$(".contentWrapper").find("#patrolStop").click(function(){
		Public.CCTV.Patrol.AutoMoveStop();
	});

	/* 저장 이벤트 입니다. */
	$(".contentWrapper").find("#saveBtn").click(function(){
		if(validPatrolData()){
			if(confirm("경로를 신규 추가하시겠습니까?")){
				var param = {
					intvlTime : $("#moveSec").val(),
					srchRadius : $("#moveBuffer").val(),
					cctvLimit : $("#showCnt").val(),
					titleNm : $("#drawNm").val(),
					colNum : $("#gridMonitoringWrap").parent().find(".ui-dialog-title").data("grid-width"),
					wkt : Public.CCTV.Patrol.vector.getSource().getFeatures()[0].getProperties().wkt
				}

				_common.callAjax("/cctv/addPatrol.json", param, function(json){
					if(json.result){
						alert("신규 추가되었습니다.");

						var $tr = $("<tr></tr>");
						var $td1 = $("<td></td>").text(json.vo.titleNm);
						var $td2 = $("<td></td>").addClass("tCenter").attr("k", json.vo.gid);
						var $btn1 = $("<button class='btn_style2 viewBtn'>보기</button> ").click(function(){
							viewPathGeometry(json.vo.gid);
						});
						var $btn2 = $("<button class='btn_Dstyle removeBtn'>삭제</button>").click(function(){
							var msg = "";
							if(Public.StopEvent != null) msg = "\n참고) 진행중인 순찰감시가 종료됩니다.";

							var v = $(this).parent().attr("k");
							var $tr = $(this).parent().parent();
							if(confirm("삭제하시겠습니까?" + msg)){
								_common.callAjax("/cctv/delPatrol.json", {k : v}, function(json){
									if(json.result){
										alert("경로가 삭제되었습니다.");
										$("#drawNm, #moveSec, #moveBuffer, #showCnt").val("");
										$tr.remove();
										Public.StopEvent();
									}
								});
							}
						});
						$td2.append($btn1).append($btn2);
						$tr.append($td1).append($td2);

						$(".contentWrapper").find("#listTable").append($tr);
					}
				});
			}
		}
	});

	/* 보기 이벤트 입니다. */
	$(".contentWrapper").find(".viewBtn").click(function(){
		if(Public.StopEvent != null) Public.StopEvent();

		var v = $(this).parent().attr("k");
		viewPathGeometry(v);
	});

	/* 삭제 이벤트 입니다. */
	$(".contentWrapper").find(".removeBtn").click(function(){
		var msg = "";
		if(Public.StopEvent != null) msg = "\n참고) 진행중인 순찰감시가 종료됩니다.";

		var v = $(this).parent().attr("k");
		var $tr = $(this).parent().parent();
		if(confirm("삭제하시겠습니까?" + msg)){
			_common.callAjax("/cctv/delPatrol.json", {k : v}, function(json){
				if(json.result){
					alert("경로가 삭제되었습니다.");
					$("#drawNm, #moveSec, #moveBuffer, #showCnt").val("");
					$tr.remove();
					Public.StopEvent();
				}
			});
		}
	});

})();