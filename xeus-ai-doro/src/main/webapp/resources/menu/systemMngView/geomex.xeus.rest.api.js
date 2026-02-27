/**
 * 시설물관리 REST API를 관리합니다.
 */
(function(GMXLAYER, GMXLEGEND){

	/**
	 * 서버에서 레이어 전체 목록을 취득합니다.
	 * 또한 포인트를 제외한 타입은 목록에서 제거합니다.
	 */
	if(GMXLAYER != null && GMXLEGEND != null){
		_common.callAjax("/GMT_layer/getAllLayerInfo.json", { "tabName" : window.tabName }, function(json){
			GMXLAYER.GroupList = json.group;
			GMXLAYER.LayerList = JSON.parse(JSON.stringify(json.layer));

			var geomList = json.geom;
			for(var key in GMXLAYER.LayerList){
				if(key in geomList) GMXLAYER.LayerList[key]["geometryType"] = geomList[key]["type"];
				if(key in geomList) GMXLAYER.LayerList[key]["isView"] = geomList[key]["isView"];
				if(GMXLAYER.LayerList[key]["geometryType"] !== "POINT") delete GMXLAYER.LayerList[key];
			}

			geomList = null;
			json = null;

			GMXLEGEND.createLegends();
		}, false);
	}

	/**
	 * 레이어 목록을 표출합니다.
	 * 권한과 관계없이 표출합니다.
	 *
	 * @param _callBack
	 */
	var setLayers = function(_callBack){
		$("#dragWrap").css("padding", "0px");

		var $legendWrap = $("#legendWrap").clone();
		$legendWrap.find("th, td").css("padding", "0px");
		$legendWrap.removeClass("dialogWrap ui-dialog-content ui-widget-content").width("100%").height("100%");

		$("#dragWrap").html($legendWrap);

		$legendWrap.find(".legend").each(function(){
			if($(this).find("tbody").children().length == 0) $(this).remove();

			$(this).find("tbody").show();
		});

		$legendWrap.find(".toggleTMSLayer").parent().parent().parent().parent().remove();

		$legendWrap.find(".legend").each(function(){
			$(this).find(".layerGroupToggle").attr("colspan", 3).removeClass("pointer");
			$(this).find(".layerGroupToggle").find("span").remove();
			$(this).find(".layerGroupToggle").find(".groupLayerToggle").remove();
			$(this).find(".layerGroupToggle").find(".layerT").removeClass("layerT").css({
				"text-align": "left",
				"width": "100%",
				"box-sizing": "border-box",
				"padding": "15px 0 15px 25px",
				"display": "flex",
				"flex-flow": "nowrap",
				"align-items": "center",
				"color": "#fff",
				"font-size": "14px",
				"font-weight": "normal",
				"position": "relative"
			});
			$(this).find(".layerTheme").remove();

			$(this).find(".layer").each(function(){
				$(this).find("td").slice(0, 2).remove();
				$(this).find(".thmToggle").remove();
				$(this).find(".shotcut, .layerName").removeClass("pointer");
				$(this).find(".edit").removeClass("edit").addClass("selectLayer").addClass("btn_Dstyle").text("명세서 추출");

				if($(this).find("td").eq(2).children().length === 0){
					$(this).find("td").eq(2).append($("<button class='selectLayer btn_Dstyle'>명세서 추출</button>"));
				}

				$(this).addClass("dragTr").attr("lyr", $(this).attr("k"));

				var _LayerId = $(this).attr("k");
				if((_LayerId in GMXLAYER.LayerList) && GMXLAYER.LayerList[_LayerId].isView) $(this).remove();
			});
		});

		$legendWrap.find(".selectLayer").click(function(){
			var krName = $(this).parent().parent().find(".layerName").text();
			var enName = $(this).parent().parent().attr("lyr");
			var skName = GMXLAYER.LayerList[enName].layer.schemNm;
			var apiKey = "" + prompt("명세서에 API KEY 값을 추가하시려면 하단에 붙혀넣어주세요.");

			if(confirm("<" + krName + "> 레이어의 명세서를 추출하시겠습니까?\n\n* 테이블의 상세 구조가 문서로 추출됩니다.")){
				_common.callAjax("/rest/getExportPDFView.do", { k : krName, s : skName, t : enName, apiKey : apiKey.trim() }, function(view){

					_common.postForm.submit("/rest/getExportPDF.json", { "title" : "스마트시티 통합플랫폼 REST API 명세서", "document" : view });

				}, false);
			}
		});
	}

	$("p.group-title").remove();
	$("div.groups").css("margin-bottom", "0px");

	/* 신규추가 Dialog 이벤트 입니다. */
	$(".contentWrapper").find("#addRESTAPIBtn").click(function(){
		$("#regDialogWrap").find(".sendData").val("");
		$("#regDialogWrap").find(".sendData#apiTyp").find("option:eq(0)").prop("selected", true);
		$("#regDialogWrap").dialog({
			title: "신규 추가",
			modal: true,
			width: 500,
			height: 270,
			position: {
				my: "center",
				at: "center",
				of: $(".contentWrapper")
			},
			open: function(){
				$("#regDialogWrap").find("#saveBtn").attr("mode", "add");
			},
			close: function(){

			}
		});
	});

	/* 수정 Dialog 이벤트 입니다. */
	$(".contentWrapper").find("#apiListWrap").find(".editBtn").click(function(){
		var k = Number($(this).attr("k"));
		_common.callAjax("/rest/getItem.json", { "k" : k }, function(json){
			$("#regDialogWrap").find(".sendData").val("");
			$("#regDialogWrap").find(".sendData#apiTyp").find("option:eq(0)").prop("selected", true);
			$("#regDialogWrap").find(".sendData").each(function(){
				$(this).val(json.result[$(this).attr("id")]);
			});

			$("#regDialogWrap").dialog({
				title: "등록 정보 수정",
				modal: true,
				width: 500,
				height: 270,
				position: {
					my: "center",
					at: "center",
					of: $(".contentWrapper")
				},
				open: function(){
					$("#regDialogWrap").find("#saveBtn").attr("mode", "edit");
				},
				close: function(){

				}
			});
		}, false);
	});

	/* 삭제 이벤트 입니다. */
	$(".contentWrapper").find("#apiListWrap").find(".delBtn").click(function(){
		var k = Number($(this).attr("k"));
		if(confirm("삭제하시겠습니까?")){
			_common.callAjax("/rest/del.json", { "k" : k }, function(json){
				if(json.result){
					if($("#regDialogWrap").length > 0) $("#regDialogWrap").remove();
					$("#btn-rest-api-mng").click();
				}
			});
		}
	});

	/**
	 * 입력값을 저장합니다.
	 */
	$("#regDialogWrap").find("#saveBtn").click(function(){
		var mode = $(this).attr("mode");
		var param = _common.utils.collectSendData("#regDialogWrap");

		if(mode === "add") delete param["mgrSeq"];
		for(var key in param){
			if(_common.utils.isNullAndEmpty(param[key])){
				alert("소속명 또는 개발자 이름을 입력해 주세요.");
				return false;
			}
		}

		if(confirm("저장하시겠습니까?")){
			_common.callAjax("/rest/" + mode + ".json", param, function(json){
				if(json.result){
					if($("#regDialogWrap").length > 0){
						$("#regDialogWrap").dialog("destroy");
					}
					$("#btn-rest-api-mng").click();
				}
			});
		}
	});

	/* 수정 Dialog 이벤트 입니다. */
	$(".contentWrapper").find("#docDownBtn").click(function(){
		setLayers();

		if($("#dragWrap").hasClass("ui-dialog-content")){
			$("#dragWrap").dialog("open");
		}else{
			$("#dragWrap").dialog({
				title: "API 명세서 다운로드 대상 선택",
				modal: true,
				//width: $("#map").width(),
				width: 500,
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function(){

				},
				close: function(){
					$(this).dialog("close");
				}
			}).parent().draggable({
				containment: "#map",
				scroll: false
			});
		}
	});

	/* 클립보드 저장 이벤트 입니다. */
	$(".contentWrapper").find(".saveClipboardAPIKey").click(function(){
		var ta = document.createElement("textarea");
		document.body.appendChild(ta);
		ta.value = $(this).text();
		ta.select();
		document.execCommand("copy");
		document.body.removeChild(ta);

		alert("클립보드에 저장하였습니다.");
	});

})(GMXLAYER, GMXLEGEND);