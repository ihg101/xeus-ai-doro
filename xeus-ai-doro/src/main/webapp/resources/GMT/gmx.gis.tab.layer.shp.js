/**
 * 레이어 관리탭의 SHP 가져오기, SHP 내보내기 메뉴 이벤트 정의.
 */
"use strict";

var shpParam = new FormData(); // shp 가져오기용 FormData

(function(GMXMAP, GMXLAYER) {

	if (GMXMAP != null && GMXLAYER != null) {

		/**
		 * SHP 가져오기/내보내기 버튼 이벤트.
		 */
		$(".rqstShpBtn").click(function() {
			$("#shpFile").val("");
			var mode =  $(this).attr("key");
			GMXLAYER.createShpInfoDialog(mode);
		});

		$('#shpFile').change(function(){
			shpParam = new FormData();
			for(var i=0; i<$('#shpFile')[0].files.length; i++){
				shpParam.append('file', $('#shpFile')[0].files[i]);
			}
		});

		//가져오기 버튼
		$("#shpImportBtn").click(function (){
			shpParam.append('USER_ID', userId);
			shpParam.append('srcSRID', $('#srcSRID').val());
			shpParam.append('tgtDbSchema', $('#tgtDbSchema').val());
			shpParam.append('layerNm', $('#layerNm').val());

			var isPass = true;
			if(_common.utils.isNullAndEmpty($('#layerNm').val())){
				if(!confirm("레이어 명칭이 입력되지 않았습니다.\n\n무시하고 진행하시겠습니까?")){
					$('#layerNm').focus();
					isPass = false;
				}
			}

			if(isPass){
				$.ajax({
					url: 			"./GMT_shp/importShpFile.json",
					type:			"post",
					data: 			shpParam,
					dataType:		'json',
					async:			false,
					cache:			false,
					contentType:	false,
					processData:	false,
					success: function(json){
						alert(json.result);

						$("#shpFile").val("");
						shpParam = new FormData();
						//$('#importShpWrap').dialog('close');

						GMXLAYER.loadData().loadLayer(GMXMAP);
						GMXLEGEND.createLegends().setVectorIndex();
					},
					error: function(){
						alert("서버 요청 중 오류가 발생했습니다.");
					}
				});
			}
		});


		// 내보내기 버튼
		$("#shpExportBtn").click(function (){
			var param = {};
			param["tbl"] = $("#dbTableList option:selected").val();
			param["nm"] = $("#dbTableList option:selected").text();
			param["schema"] = $("#dbTableList option:selected").attr("schema");
			param["tgtSRID"] = $("#tgtSRID").val();
			_common.postForm.submit("/GMT_shp/dbToShp.json", param);
		});

		/**
		 * <pre>
		 * 레이어 정보 jQuery Dialog 객체를 설정합니다.
		 * </pre>
		 *
		 * @param _Data - Object
		 */
		GMXLAYER.createShpInfoDialog = function(mode){

			var _ID = $("#" + mode + "ShpWrap").attr("id");

			$("#" + mode + "ShpWrap").dialog({
				width: 800,
				height: $("#map").height()-30,
				position: {
					my: "center top",
					at: "center top",
					of: $("#map")
				},
				open: function(){
					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID,mode);
					});

					$(this).dialog("option", "resizable", true );

					if(mode == "export"){
						var $select = $("#dbTableList").empty();

						for(var i=0; i<GMXLAYER.GroupList.length; i++){
							var groupName = GMXLAYER.GroupList[i].grpNm;
							$select.append("<optgroup grpk='" + GMXLAYER.GroupList[i].mgrSeq + "' label='" + GMXLAYER.GroupList[i].grpNm + "'></optgroup>");
						}

						for(var key in GMXLAYER.LayerList){
							var $optgroup = $select.find("optgroup[grpk=" + GMXLAYER.LayerList[key].group.mgrSeq + "]");
							if(GMXLAYER.LayerList[key].layer.lyrTyp !== "T"){
								$optgroup.append("<option value='" + GMXLAYER.LayerList[key].layer.tblId + "' schema='" + GMXLAYER.LayerList[key].layer.schemNm + "'>" + GMXLAYER.LayerList[key].layer.lyrNm + "</optgroup>");
							}
						}

						$select.sortOptgroup();
						/*_common.callAjax("/GMT_layer/getLayerList.json", "", function(json) {
							var result = json.result;
							var str = "";
							for(var idx in result){
								var row = result[idx];
								if(row["lyrTyp"] === "T") continue;

								str += "<option value='" + row["tblId"] + "' schema=" + row["schemNm"] + ">" + row["lyrNm"] + "</option>"
							}
							$("#dbTableList").empty().append(str);
						});*/
					} else {
						_common.callAjax("/GMT_column/getAllSchemas.json", "", function(json){
						    var result = json.result;
						    var str = "";
						    for(var idx in result){
						        str += "<option value='" + result[idx] + "'>" + result[idx] + "</option>"
						    }
						    $("#tgtDbSchema").empty().append(str);
						    $('#tgtDbSchema').find('option[value="shp"]').attr('selected', true);
						});
					}
				},
				close: function(){
					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				},
				resizable: false
			}).dialog("open");
		}

		var resizeDialog = function(_ID, mode){
			$("#" + mode + "ShpWrap").dialog({
				width: 800,
				height: $("#map").height()-30,
				position: {
					my: "center top",
					at: "center top",
					of: $("#map")
				},
				open: function(){

					$(".startMenu").removeClass("active");
					$("#"+_ID).addClass("active");

					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID);
					});

					$(this).dialog("option", "resizable", true );

					if(mode == "export"){
						var $select = $("#dbTableList").empty();

						for(var i=0; i<GMXLAYER.GroupList.length; i++){
							var groupName = GMXLAYER.GroupList[i].grpNm;
							$select.append("<optgroup grpk='" + GMXLAYER.GroupList[i].mgrSeq + "' label='" + GMXLAYER.GroupList[i].grpNm + "'></optgroup>");
						}

						for(var key in GMXLAYER.LayerList){
							var $optgroup = $select.find("optgroup[grpk=" + GMXLAYER.LayerList[key].group.mgrSeq + "]");
							if(GMXLAYER.LayerList[key].layer.lyrTyp !== "T"){
								$optgroup.append("<option value='" + GMXLAYER.LayerList[key].layer.tblId + "' schema='" + GMXLAYER.LayerList[key].layer.schemNm + "'>" + GMXLAYER.LayerList[key].layer.lyrNm + "</optgroup>");
							}
						}

						$select.sortOptgroup();
						/*_common.callAjax("/GMT_layer/getLayerList.json", "", function(json) {
							var result = json.result;
							var str = "";
							for(var idx in result){
								var row = result[idx];
								if(row["lyrTyp"] === "T") continue;

								str += "<option value='" + row["tblId"] + "' schema=" + row["schemNm"] + ">" + row["lyrNm"] + "</option>"
							}
							$("#dbTableList").empty().append(str);
						});*/
					} else {
						_common.callAjax("/GMT_column/getAllSchemas.json", "", function(json){
						    var result = json.result;
						    var str = "";
						    for(var idx in result){
						        str += "<option value='" + result[idx] + "'>" + result[idx] + "</option>"
						    }
						    $("#tgtDbSchema").empty().append(str);
						    $('#tgtDbSchema').find('option[value="shp"]').attr('selected', true);
						});
					}
				},
				close: function(){
					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				},
				resizable: false
			}).dialog("open");
		}

	}

})(GMXMAP, GMXLAYER);