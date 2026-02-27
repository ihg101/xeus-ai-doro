/**
 * Main Map Script
 *
 * @auther 이주영
 */
"use strict";

$(document).ready(function(){

	/**
	 *	서버에 해당 session이 없을 시 login페이지로 redirect
	 */
	if(userId == null || userId =='' || userId == 'null'){
		location.href = "./user/login.do"
	}
	/**
	 *	웹소켓으로 서버에 session 생성
	 */
	window.sessionSocket = new SessionWS();
	window.sessionSocket.create("ws://" + location.host + "/xeus/session");
	/**
	 *  유저 권한에 포함되는 탭만 표출
	 */
	//setTabByAuth(authMgrNo);



	$(document).on('click', '.layerT', function(){
		$(this).toggleClass('active');
	});
//	$(document).on('click', '#logoutBtn', function(){
//		location.href = "./user/signOut.do"
//	}); //로그아웃 버튼 중복 처리 제거

	/**
	 * 메인 탭을 생성합니다.
	 */
	$("#mainTabs").tabs({
		beforeActivate: function (event, ui) {
			var $this = $(this);
			var selectedId = ui.newPanel.attr("id");
			if(selectedId === "layerTab"){
				if(GMXMAP["isEditing"]){
					if(!GMXMAP.stopGeometryEdit()) return false;
				}
			}
			/*if(selectedId === "gisEditTab"){
				var $select = $("#editLayerSelect");
				$select.children().not(":eq(0)").remove();

				for(var i=0; i<GMXLAYER.GroupList.length; i++){
					var groupName = GMXLAYER.GroupList[i].grpNm;
					$select.append("<optgroup grpk='" + GMXLAYER.GroupList[i].mgrSeq + "' label='" + GMXLAYER.GroupList[i].grpNm + "'></optgroup>");
				}

				for(var key in GMXLAYER.LayerList){
					var $optgroup = $select.find("optgroup[grpk=" + GMXLAYER.LayerList[key].group.mgrSeq + "]");
					if(GMXLAYER.LayerList[key].layer.lyrTyp !== "T"){
						$optgroup.append("<option value='" + GMXLAYER.LayerList[key].layer.tblId + "'>" + GMXLAYER.LayerList[key].layer.lyrNm + "</optgroup>");
					}
				}

				$select.sortOptgroup();
			}*/
			if(selectedId === "systemTab"){
				if(GMXMAP["isEditing"]){
					if(!GMXMAP.stopGeometryEdit()) return false;
				}
			}
		},
		activate: function (event, ui) {
			var $this = $(this);
			var selectedId = ui.newPanel.attr("id");
			if(selectedId === "layerTab"){

			}
			if(selectedId === "gisEditTab"){

			}
			if(selectedId === "systemTab"){

			}
		}
	});

	/**
	 * dialog 객체들을 생성합니다.
	 * 화면에 보이지 않는 상태로 생성됩니다.
	 */
	$(".dialogWrap").dialog({
		autoOpen : false,
		open: function() {
			$(this).dialog("option", "maxHeight", $("#map").height());
		}
	}).parent().draggable({
		containment: "#map"
	});

	/**
	 * 범례를 생성합니다.
	 */
	$("#legendWrap").dialog({
	    width: "400",
		height: $("#map").height(),
		resizable: false,
		position: {
			my: "left top",
			at: "left top",
			of: $("#map")
		},
		open: function() {
			$(this).dialog("option", "maxHeight", $("#map").height());
		}
	}).dialog("open");

	/**
	 * 공간정보 편집 시작 버튼 이벤트 입니다.
	 */
	$("#startGeometryEdit").click(function(){
		var layerId = $("#editLayerSelect").val();
		var vector = GMXMAP.getLayer(layerId);
		if(vector != null){
			var prop = vector.getProperties();
			if(("schema" in prop) && ("id" in prop)){
				_common.callAjax("/GMT_column/getColumnInfo.json", { "schema" : prop.schema, "table" : prop.id }, function(colData){
					var pkeyField = "null";
					var pkeyIsGid = false;
					for(var i=0; i<colData.result.length; i++){
						if(colData.result[i].pkey) pkeyField = colData.result[i].colId;
						if(colData.result[i].pkey && colData.result[i].colId === "_gid"){
							pkeyIsGid = true;
							break;
						}
					}
					if(pkeyIsGid){
						if(!GMXMAP["isEditing"]) GMXMAP.addGeometryEditor(GMXMAP.getLayer(layerId));
					}else{
						var errorText = "편집 제약 조건이 성립되지 않아 해당 레이어는 편집이 불가능합니다.";
						errorText += "\n\n아래 내용을 관리자에게 문의해주세요.";
						errorText += "\n\nSchema : " + prop.schema;
						errorText += "\nTable : " + prop.id;
						errorText += "\nMassage : PK is " + pkeyField;
						alert(errorText);

						return false;
					}
				}, false);
			}
		}

	});

	/**
	 * 공간정보 편집 종료 버튼 이벤트 입니다.
	 */
	$("#stopGeometryEdit").click(function(){
		GMXMAP.stopGeometryEdit();
	});

	/**
	 * 현재 편집 저장 버튼 이벤트 입니다.
	 */
	$("#saveGeometryEdit").click(function(){
		if(confirm("현재까지의 편집을 저장하시겠습니까?")) GMXMAP.transactionalFeatures();
	});

	/**
	 * 공간정보 좌표계 찾기 버튼 이벤트 입니다.
	 */
	$("#findSrid").click(function(){
		_common.postForm.open("/GMT_sridFindMap.do", { epsg : "EPSG:5186", typename : "shp:TL_SCCO_LI" });
	});

	/**
	 * 브라우저 리사이즈 이벤트 입니다.
	 */
	$(window).resize(function(){
		$("#legendWrap").dialog("option", "height", $("#map").height());
	});

});