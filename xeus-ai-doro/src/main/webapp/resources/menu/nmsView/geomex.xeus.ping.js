(function(GMXMAP, GMXLAYER){

	/**
	 * 레이어 목록을 표출합니다.
	 * 권한에 따라 상이하게 표출됩니다.
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
				var _LayerId = $(this).attr("k");
				if((_LayerId in GMXLAYER.LayerList) && GMXLAYER.LayerList[_LayerId].isView) $(this).remove();

				$(this).find("td").slice(0, 2).remove();
				$(this).find(".thmToggle").remove();
				$(this).find(".shotcut, .layerName").removeClass("pointer");
				$(this).find(".edit").removeClass("edit").addClass("selectLayer").addClass("btn_Dstyle").text("선택");

				if($(this).find("td").eq(2).children().length === 0){
					$(this).find("td").eq(2).append($("<button class='selectLayer btn_Dstyle'>선택</button>"));
				}

				$(this).addClass("dragTr").attr("lyr", $(this).attr("k"));
			});
		});

		$legendWrap.find(".selectLayer").click(function(){
			var krName = $(this).parent().parent().find(".layerName").text();
			var enName = $(this).parent().parent().attr("lyr");
			var skName = GMXLAYER.LayerList[enName].layer.schemNm;
			var lyrMgrSeq = GMXLAYER.LayerList[enName].layer.mgrSeq;

			xeusNmsPing.setDataTable(krName, enName, skName, lyrMgrSeq);
		});
	}

	/**
	 * 닫기가 불가능한 로딩 dialog 를 생성합니다.
	 */
	var createLoadingWrap = function(){
		var $loader = $("<div>").addClass("cssload-container").css("margin", "0 auto").css("margin-top", "100px");
		$loader.append($("<div>").addClass("cssload-cube"));
		$loader.find(".cssload-cube").append($("<div>").addClass("cssload-half1"));
		$loader.find(".cssload-half1").append($("<div>").addClass("cssload-side cssload-s1"));
		$loader.find(".cssload-half1").append($("<div>").addClass("cssload-side cssload-s2"));
		$loader.find(".cssload-half1").append($("<div>").addClass("cssload-side cssload-s5"));
		$loader.find(".cssload-cube").append($("<div>").addClass("cssload-half2"));
		$loader.find(".cssload-half2").append($("<div>").addClass("cssload-side cssload-s3"));
		$loader.find(".cssload-half2").append($("<div>").addClass("cssload-side cssload-s4"));
		$loader.find(".cssload-half2").append($("<div>").addClass("cssload-side cssload-s6"));

		var $div = $("<div>").attr("id", "analyLoadingWrap").addClass("table_style customScroll");
		$div.append($loader);
		$div.append("<h3 class='tCenter'><b>서버에서 빅데이터 분석을 진행하고 있습니다.<br><br>분석이 완료되면 결과를 자동으로 표시합니다.</b></h3>");

		$("#parentBody").append($div);

		$div.dialog({
			title: "빅데이터 분석 결과 대기",
			modal: true,
			resizable: false,
			draggable: false,
			closeOnEscape: false,
			width: 800,
			height: 700,
			position: {
				my: "center center",
				at: "center center",
				of: $("#map")
			},
			open: function(){
				$div.parent().find(".ui-dialog-titlebar-close").hide();
			},
			close: function(){
				$div.dialog("destroy");
				$div.remove();
			}
		});
	}

	if($(".ui-dialog-content#dragWrap").length > 0) $(".ui-dialog-content#dragWrap").dialog("destroy");
	if($(".ui-dialog-content#columnWrap").length > 0) $(".ui-dialog-content#columnWrap").dialog("destroy");

	$("p.group-title").remove();
	$("div.groups").css("margin-bottom", "0px");


	/* 등록이벤트 */
	$("#weightSetTable").find("#regLayerBtn").click(function(){

		var lyrMgrSeq = $("#weightSetTable").find("#lyrMgrSeq").attr("lyrMgrSeq");
		var skName = $("#weightSetTable").find("#lyrMgrSeq").attr("skName");

		var krField = $("#weightSetTable").find("#ipFieldNm").attr("krField");
		var enField = $("#weightSetTable").find("#ipFieldNm").attr("enField");

		var krName = $("#weightSetTable").find("#ipFieldNm").attr("krName");
		var enName = $("#weightSetTable").find("#ipFieldNm").attr("enName");

		var intervalMin = $("#weightSetTable").find("input#intervalMin").val();

		var isContains = false;
		if($("#pingListWrap").find(".pingItem[lk=" + lyrMgrSeq + "]").length > 0) isContains = true;

		var _param = { lyrMgrSeq : lyrMgrSeq, ipFieldEnNm : enField, ipFieldKrNm : krField, intervalMin : intervalMin, schemNm : skName, tblId : enName };
		if(_common.utils.isNullAndEmpty(lyrMgrSeq)){
			alert("임의로 설정한 레이어는 등록할 수 없습니다.");
			return false;
		}
		if(_common.utils.isNullAndEmpty(enField)){
			alert("IP 필드를 선택해 주세요.");
			return false;
		}
		if(Number(intervalMin) < 1){
			alert("체크 주기는 1분 이상부터 설정 가능합니다.");
			return false;
		}else if(Number(intervalMin) > 1440){
			alert("체크 주기는 24시간(1440분) 이내에서 설정 가능합니다.");
			return false;
		}

		var method = "add";
		var confirmTxt = krName + " 레이어를 Ping 체크 리스트에 추가하시겠습니까?";
		if(isContains){
			method = "edit";
			confirmTxt = "설정값을 수정하시겠습니까?";
			_param["mgrSeq"] = Number($("#pingListWrap").find(".pingItem[lk=" + lyrMgrSeq + "]").attr("k"));
		}

		if(confirm(confirmTxt)){
			_common.callAjax("/GMT_ping/" + method + ".json", _param, function(json){
				if(json.result){
					alert("저장되었습니다.");

					$("#columnWrap").dialog("close");
					//$("#dragWrap").dialog("close");
					$("#btn-ping-view").click();
				}
			}, false);
		}
	});

	/* 설정 버튼 이벤트 */
	$("#pingListWrap").find(".editBtn").click(function(){
		var k = $(this).attr("k");
		_common.callAjax("/GMT_ping/getItem.json", { k : k }, function(json){
			if(json.result){
				var krName = json.result.lyrNm;
				var enName = json.result.tblId;
				var skName = json.result.schemNm;
				var lyrMgrSeq = json.result.lyrMgrSeq;
				var enField = json.result.ipFieldEnNm;
				var krField = json.result.ipFieldKrNm;

				xeusNmsPing.setDataTable(krName, enName, skName, lyrMgrSeq, enField);

				$("#weightSetTable").find("#intervalMin").val(json.result.intervalMin);
			}
		}, false);
	});

	/* 삭제 버튼 이벤트 */
	$("#pingListWrap").find(".delBtn").click(function(){
		var k = $(this).attr("k");
		if(confirm("삭제하시겠습니까?")){
			_common.callAjax("/GMT_ping/del.json", { k : k }, function(json){
				if(json.result){
					$("#btn-ping-view").click();
				}
			}, false);
		}
	});

	/* 레이어 선택 열기 */
	$("#lyrSelectBtn").click(function(){
		setLayers();

		if($("#dragWrap").hasClass("ui-dialog-content")){
			$("#dragWrap").dialog("open");
		}else{
			$("#dragWrap").dialog({
				title: "레이어 선택",
				modal: true,
				//width: $("#map").width(),
				width: 400,
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

})(GMXMAP, GMXLAYER);