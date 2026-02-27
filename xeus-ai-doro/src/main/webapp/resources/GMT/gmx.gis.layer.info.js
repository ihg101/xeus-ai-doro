/**
 * 레이어 정보를 관리합니다.
 */
"use strict";

(function(GMXMAP, GMXLAYER, GMXLEGEND){

if(GMXMAP != null && GMXLAYER != null && GMXLEGEND != null){
	if(GMXMAP instanceof ol.Map){

		var removeBindData = function(){
			var $infoTable = $("#layerInfoWrap").find("table");
			$infoTable.removeAttr("k").removeAttr("v");
			$infoTable.find(".layerInfo").each(function(){
				$(this).val("");
			});
		}

		var bindData = function(_Data){
			$("#layerInfoWrap").find("table").attr({
				k : _Data.layer.mgrSeq,
				s : _Data.layer.schemNm,
				v : _Data.layer.tblId
			}).data(_Data).find(".layerInfo").each(function(){
				var id = $(this).attr("id");
				var val = _Data.layer[id];

				if(id === "lyrTyp" && val === "P") val = "포인트";
				if(id === "lyrTyp" && val === "G") val = "폴리곤";
				if(id === "lyrTyp" && val === "L") val = "라인";
				if(id === "lyrTyp" && val === "T") val = "타일";

				if(id === "mkDat") val = Date.prototype.formatYMDHMS(val);

				if(id === "useYn") $(this).prop("checked", val);

				$(this).val(val);
			});
		};


		/* 객체 정보 관리 버튼 이벤트 입니다. */
		$("#featureInfoMngBtn").click(function(){
			var k = $("#layerInfoWrap").find("table").attr("k");
			var s = $("#layerInfoWrap").find("table").attr("s");
			var v = $("#layerInfoWrap").find("table").attr("v");
			$("#layerInfoWrap").dialog("close");
			_common.postForm.open("/GMT_column/getLayerMetaInfo.do", { schema : s, table : v });
		});

		/* 레이어 삭제 버튼 이벤트 입니다. */
		$("#layerRemoveBtn").click(function(){

			var _Data = $("#layerInfoWrap").find("table").data();
			var k = $("#layerInfoWrap").find("table").attr("k");
			var lyrNm = $("#layerInfoWrap").find("#lyrNm").val();

			if(confirm("<" + lyrNm + "> 레이어를 물리적으로 제거하시겠습니까?\n\n삭제 후 데이터 복구는 불가능 합니다.")){
				_common.callAjax("/GMT_layer/removeLayer.json", { k : k }, function(_DB){
					if(_DB.result){

						$("#layerInfoWrap").dialog("close");

						GMXLAYER.loadData().loadLayer(GMXMAP);
						GMXLEGEND.createLegends();

						alert("삭제가 완료되었습니다.");

						_common.callAjax("/GMT_proxy/layer/remove", { "schema" : _Data.layer.schemNm, "table" : _Data.layer.tblId }, function(_Engine){
							if(_Engine.result){

								/*$("#layerInfoWrap").dialog("close");

								GMXLAYER.loadData().loadLayer(GMXMAP);
								GMXLEGEND.createLegends();*/

							}
						}, false);

					}
				}, false);
			}
		});


		/* 레이어 명칭 수정 버튼 이벤트 입니다. */
		$("#layerEditBtn").click(function(){
			var k = $("#layerInfoWrap").find("table").attr("k");
			var lyrNm = $("#layerInfoWrap").find("#lyrNm").val();
			var useYn = $("#layerInfoWrap").find("#useYn").is(":checked");

			if(confirm("기본 정보를 수정하시겠습니까?")){
				_common.callAjax("/GMT_layer/editLayerName.json", { k : k, korNm : lyrNm, useYn : useYn }, function(json){
					if(json.result){
						GMXLAYER.loadData().loadLayer(GMXMAP);
						GMXLEGEND.createLegends();

						alert("수정이 완료되었습니다.");
					}
				});
			}
		});

		/**
		 * <pre>
		 * 레이어 정보 jQuery Dialog 객체를 설정합니다.
		 * </pre>
		 *
		 * @param _Data - Object
		 */
		GMXLAYER.createLayerInfoDialog = function(_Data){
			$("#layerInfoWrap").dialog("close").dialog({
				width: 600,
				height: 'auto',
				position: {
					my: "center",
					at: "center",
					of: $("#map")
				},
				open: function(){
					//$(this).dialog("option", "maxHeight", $("#map").height());
					bindData(_Data);
					if(_Data.layer.lyrTyp =='T'){
						$(this).find("#featureInfoMngBtn").attr("disabled",true)
						$(this).find("#fieldManageBtn").attr("disabled",true)
						$(this).find("#layerRemoveBtn").attr("disabled",true)
					}else{
						$(this).find("#featureInfoMngBtn").attr("disabled",false)
						$(this).find("#fieldManageBtn").attr("disabled",false)
						$(this).find("#layerRemoveBtn").attr("disabled",false)
					}
				},
				close: function(){
					removeBindData();
					$('#fieldManageWrap').dialog('close');
				}
			}).dialog("open");
		}


		/*
		 * 필드 관리 클릭 이벤트 입니다
		 */
		$('#layerInfoWrap').find("#fieldManageBtn").click(function(){

			openDialogFieldManageWrap();

		});

		var openDialogFieldManageWrap = function(){

			$("#fieldManageWrap").dialog("close").dialog({
				width: 600,
				height: 430,
				position: {
					my: "right-30",
					at: "right",
					of: $("#map")
				},
				open: function(){
					var table = $("#layerInfoWrap").find("table").attr("v");
					var schema = $("#layerInfoWrap").find("table").attr("s");
					_common.callAjax("/GMT_column/getLayerFieldInfo.json", {'table' : table, 'schema' : schema}, function(json){
							$('#fieldManageTable').attr('v',table);
							$('#fieldManageTable').attr('s',schema);
							appendFieldManageTable(json.result);

					},false);
				},
				close: function(){
//					removeBindData();
				}
			}).dialog("open");
		}




		/**
		 * 레이어 필드정보를 append한다
		 */
		var appendFieldManageTable = function(json){
			$('#fieldManageTable > tbody').remove();


			var cnt=0;
			var $tbody=$('<tbody></tbody>');
			for(var i=0; i<json.length; i++){

				if(json[i].colId == '_gid' || json[i].colId == '_annox' || json[i].colId == '_annoy' || json[i].colId == '_geometry'){
					continue;
				}
				cnt++;
				var $tr=$('<tr></tr>');
				$tr.append("<td>"+cnt+"번째</td>");
				$tr.append("<td style='display:none;'><input class=sendData id=colUid"+(cnt+1)+" name=colUid"+(cnt+1)+" type='text' value='"+json[i].colUid+"'></td>");
				$tr.append("<td><input class='sendData colNm'id=colNm"+(cnt+1)+" name=colNm"+(cnt+1)+" type='text' value='"+json[i].colId+"'></td>");
				$tr.append("<td><input class=sendData id=colKrNm"+(cnt+1)+" name=colKrNm"+(cnt+1)+" type='text' value='"+json[i].colNm+"'></td>");
				$tr.append("<td><input class=sendData id=colType"+(cnt+1)+" name=colType"+(cnt+1)+" type='text' value='"+json[i].dataType+"' disabled></td>");
				if(json[i].dataType == 'numeric'){
					$tr.append("<td><input class=sendData id=colLen"+(cnt+1)+" name=colLen"+(cnt+1)+" type='number' min=1 value='"+json[i].numericPrecision+"'></td>");
					$tr.append("<td><input id=colLenDecimalPoint"+(cnt+1)+" name=colLenDecimalPoint"+(cnt+1)+" type='number' min=0 value='"+json[i].numericScale+"'></td>");
				}
				else if(json[i].dataType == 'character varying' || json[i].dataType == 'character'){
					$tr.append("<td><input class=sendData id=colLen"+(cnt+1)+" name=colLen"+(cnt+1)+" type='number' min=1 value='"+json[i].stringSize+"'></td>");
					$tr.append("<td><input id=colLenDecimalPoint"+(cnt+1)+" name=colLenDecimalPoint"+(cnt+1)+" type='number' min=0 disabled></td>");
				}
				else{
					$tr.append("<td><input class=sendData id=colLen"+(cnt+1)+" name=colLen"+(cnt+1)+" type='number' min=1 disabled></td>");
					$tr.append("<td><input id=colLenDecimalPoint"+(cnt+1)+" name=colLenDecimalPoint"+(cnt+1)+" type='number' min=0 disabled></td>");
				}
				//필드 삭제 버튼 클릭 이벤트
				var $td = $("<td></td>");
				var $deleteFieldBtn =  $("<button class='btn_style2 deleteFieldBtn'>삭제</button>").click(function(){

					//TODO 서버에 삭제 요청
					//TODO 서버에 insert요청
					if(!confirm("해당 필드를 삭제하면,\n해당 필드에 있는 모든 데이터가 삭제됩니다.\n그래도 삭제하시겠습니까?")){
						return;
					}

					var param = {};

					param['tableName'] = $("#layerInfoWrap").find("table").attr("v");
					param['tableKrName'] = $("#layerInfoWrap").find("table").find("#lyrNm").val();

					param['schema'] = $("#layerInfoWrap").find("table").attr("s");
					param['colNm']= $(this).parent().parent().find(".colNm").val();


					_common.callAjax("/GMT_layerTable/deleteOneColumn.json", param, function(json){
						if(json.result != "success"){
							alert("삭제 실패했습니다.");
							return;
						}
						alert("삭제되었습니다.");
						openDialogFieldManageWrap();
					},false);

				});

				$tr.append($td.append($deleteFieldBtn));


				$tbody.append($tr);
			}
			//필드 추가 버튼 추가
			var $tr=$('<tr></tr>');
			var $showEmptyRowBtn = $("<button id='showEmptyRowBtn' class='btn_style2'>새로운 필드</button></td>").click(function(){
				var i=$('#fieldManageTable > tbody tr').length;
				var $emptryRow= getEmptyRow(i+1);

				$(this).parent().before($emptryRow);
			});
			$tr.append($showEmptyRowBtn);
			$tbody.append($tr);

			$('#fieldManageTable').append($tbody);

		};

		/**
		 * 빈 row를 만들어서 반환
		 */
		var getEmptyRow = function(i){
			var $tr=$('<tr></tr>');
			$tr.append("<td>"+(i-1)+"번째</td>");
			$tr.append("<td><input class=sendData id=colNm name=colNm type='text'></td>");
			$tr.append("<td><input class=sendData id=colKrNm name=colKrNm type='text'></td>");
			var $td = $('<td></td>');
			//text, character varying, numeric 변경되었을 때, 필드길이 및 소수점 변화
			var $selector = $('<select class="sendData colType" id=colType name=colType style="width:100%;"><option value="varchar">character varying</option><option value="text" selected>text</option><option value="numeric">numeric</option></select>').change(function(){
				var num=$(this).attr('id').replace('colType','');
				if($(this).val()=='text'){
                    $('#colLen'+num).val("");
                    $('#colLen'+num).attr("disabled",true);
                    $('#colLenDecimalPoint'+num).val("");
                    $('#colLenDecimalPoint'+num).attr("disabled",true);

				}
				else if($(this).val()=='varchar'){
					$('#colLen'+num).val("");
					$('#colLenDecimalPoint'+num).val("");
                    $('#colLen'+num).attr("disabled",false);
                    $('#colLenDecimalPoint'+num).attr("disabled",true);
				}
				else if($(this).val()=='numeric'){
					$('#colLen'+num).val("");
                    $('#colLen'+num).attr("disabled",false);
                    $('#colLenDecimalPoint'+num).val("");
                    $('#colLenDecimalPoint'+num).attr("disabled",false);

				}
			});

			$tr.append($td.append($selector));

			$tr.append("<td><input class=sendData id=colLen name=colLen type='number' min=i></td>");
			$tr.append("<td><input id=colLenDecimalPoint name=colLenDecimalPoint type='number' min=0 disabled></td>");

			//필드 삭제 버튼 클릭 이벤트
			var $td =  $("<td></td>");

			var $addFieldBtn = $("<button class='btn_style2 addFieldBtn'>추가</button>").click(function(){
				var param = {};

				param['tableName'] = $("#layerInfoWrap").find("table").attr("v");
				param['schema'] = $("#layerInfoWrap").find("table").attr("s");

				var $tr = $(this).parent().parent();

				$tr.find('.sendData').each(function(){
					if(($(this).attr('name')).contains('colLen')){
						param[$(this).attr('name')]=addDecimalPoint($(this));
				    }else{
				    	param[$(this).attr('name')]=$(this).val();
				    }
				});
				//TODO 서버에 insert요청

				_common.callAjax("/GMT_layerTable/addOneColumn.json", param, function(json){
					if(json.result != "success"){
						alert(json.result);
						return;
					}
					openDialogFieldManageWrap();
				},false);
			});

			$tr.append($td.append($addFieldBtn));

			return $tr;
		};


		/**
		 * 필드 관리에서 확인 버튼 클릭 시
		 */
		$('#fieldManageWrap').find('#saveBtn').click(function(){

			if($("#fieldManageTable").find(".addFieldBtn").length > 0){
				alert("새로운 필드 추가를 먼저 해주세요.");
				return;
			}


			var param = {};
			param['tableKrName'] = $("#layerInfoWrap").find("table").find("#lyrNm").val();
			param['tblNm']=$('#fieldManageWrap').find('#fieldManageTable').attr('v');
			param['schema']=$('#fieldManageWrap').find('#fieldManageTable').attr('s');

			var colCnt=$('#fieldManageTable').find('tr').length;
			param['colCnt']=colCnt;

			$('#fieldManageWrap').find('.sendData').each(function(){
				if(($(this).attr('name')).contains('colLen')){
					param[$(this).attr('name')]=addDecimalPoint($(this));
			    }else{
			    	param[$(this).attr('name')]=$(this).val();
			    }
			});

			$.ajax({
				url: 			"./GMT_layerTable/alterFieldInfo.json",
				type:			"post",
				data: 			param,
				dataType:		'json',
				async:			false,
//				cache:			false,
//				contentType:	false,
				success: function(json){
					if(json.result!="success"){
						alert(json.result);
						return false;
					}
					/**
					 * 레이어 데이터 로드 후 지도에 Vector 객체를 생성합니다.
					 */
					GMXLAYER.loadData().loadLayer(GMXMAP);

					/**
					 * 범례를 생성합니다.
					 */
					GMXLEGEND.createLegends();


					alert('필드정보 수정이 완료되었습니다');
//					$('#fieldManageWrap').empty();
					$('#fieldManageWrap').dialog('close');
				},
				error: function(){
					alert("필드정보 수정에 실패하였습니다.");
				}
			});

		});

		/**
		 * 필드 길이에 소수점을 합쳐준다
		 */
		var addDecimalPoint = function($len){
			var result;
			var num=$len.attr('name').replace('colLen','');
	    	var decimalPoint=$('#colLenDecimalPoint'+num).val();
	    	if(decimalPoint==0 || decimalPoint==undefined || decimalPoint==null){
	    		result=$len.val();
	    	}else{
	    		result=$len.val()+','+decimalPoint;
	    	}
	    	return result;
		}

	}
}

})(GMXMAP, GMXLAYER, GMXLEGEND);