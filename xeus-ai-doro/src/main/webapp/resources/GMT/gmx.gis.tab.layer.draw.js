/**
 * <pre>
 * 레이어 탭 이벤트
 * </pre>
 * jQuery (dialog)를 의존합니다.
 * @author 민동현
 */

"use strict";

(function(GMXMAP, GMXLAYER){

if(GMXMAP != null && GMXLAYER != null){
	if(GMXMAP instanceof ol.Map){

		/**
		 * <pre>
		 * 스타일 설정 jQuery Dialog 객체를 설정합니다.
		 * </pre>
		 *
		 * @param data - Object
		 */
		/* 우측패널 Active 이벤트입니다. */
		$(document).on("click", "#createNewLayer", function(){
			var _ID = $(this).attr("id");

			$("#createNewLayerWrap").dialog({
				width: $("#map").width(),
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},

				open: function() {
//					$(this).dialog("option", "maxHeight", $("#map").height()-100);
					$(this).dialog("option", "resizable", true );

					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID);
					});

					var $html=appendLayerInfo();
					$(this).html($html);
					bindEventAddRowBtn();
					bindEventRemoveRowBtn();
					bindEventColType();
					bindEventSaveBtn()
				},
				close:function(){
					$('#createNewLayerWrap').empty();

					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				},
				resizable: false
			}).dialog("open");
		});

		var resizeDialog = function(_ID){
			$("#createNewLayerWrap").dialog({
				width: $("#map").width(),
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},

				open: function() {

					$(".startMenu").removeClass("active");
					$("#"+_ID).addClass("active");

//					$(this).dialog("option", "maxHeight", $("#map").height()-100);
					$(this).dialog("option", "resizable", true );

					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID, _TITLE);
					});

					var $html=appendLayerInfo();
					$(this).html($html);
					bindEventAddRowBtn();
					bindEventRemoveRowBtn();
					bindEventColType();
					bindEventSaveBtn()
				},
				close:function(){
					$('#createNewLayerWrap').empty();

					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				},
				resizable: false
			}).dialog("open");
		}



		function appendLayerInfo(){
			var $layerInfo = $('<div id="LayerInfo" class="bPopup"></div> ');

			var $table= $('<table id=layerTableInfo class="list"></table>');

			var $thead=$('<thead></thead>');
			var $tr=$('<tr></tr>');
			$tr.append('<th style="display:none;"><label>테이블 영문 명칭</label></th>');
			$tr.append('<th><label>테이블 한글 명칭</label></th>');
			$tr.append('<th><label>공간정보 타입</label></th>');
			$tr.append('<th><label>더하기</label></th>');
			$tr.append('<th><label>빼기</label></th>');
			$thead.append($tr);
			$table.append($thead);

			var $tbody=$('<tbody><tbody>');
			var $tr=$('<tr></tr>');
			$tr.append("<td style='display:none;'><input class=sendData id=tblNm name=tblNm type='text'></td>");
			$tr.append("<td><input class=sendData id=tblKrNm name=tblKrNm type='text'></td>");
			$tr.append('<td style="left: 6px;position: relative;"><select class=sendData id=lyrTyp name=lyrTyp ><option value="" selected>-선택-</option><option value="point">포인트(점)</option><option value="line">라인(선)</option><option value="polygon">폴리곤(면)</option></select></td>');
//			<option value="polygon">폴리곤(면)</option>
			$tr.append('<td><button id="addRowBtn" class="btn_Dstyle">추가</button></td>');
			$tr.append('<td><button id="removeRowBtn" class="btn_Dstyle">제거</button></td>');
			$tbody.append($tr);

			$table.append($tbody[0]);
			$layerInfo.append($table);

			var $table= $('<table id=layerColumnInfo class="list"></table>');
			var $thead=$('<thead></thead>');
			var $tr=$('<tr></tr>');
			$tr.append('<th><label>번호</label></th>');
			$tr.append('<th><label>필드 영문명</label></th>');
			$tr.append('<th><label>필드 한글명</label></th>');
			$tr.append('<th><label>필드 타입</label></th>');
			$tr.append('<th><label>필드 길이</label></th>');
			$tr.append('<th><label>소수점</label></th>');
			$thead.append($tr);

			$table.append($thead);

			var $tbody=$('<tbody><tbody>');
			var $tr=$('<tr></tr>');
			$tr.append("<td>1번째</td>");
			$tr.append("<td><input type='text' value='annox' readonly></td>");
			$tr.append("<td><input type='text' value='주기X좌표' readonly></td>");
			$tr.append("<td><input type='text' value='numeric' readonly></td>");
			$tr.append("<td><input type='number' value='20' readonly></td>");
			$tr.append("<td><input type='number' value='4' readonly></td>");
			$tbody.append($tr);

			var $tr=$('<tr></tr>');
			$tr.append("<td>2번째</td>");
			$tr.append("<td><input type='text' value='annoy' readonly></td>");
			$tr.append("<td><input type='text' value='주기Y좌표' readonly></td>");
			$tr.append("<td><input type='text' value='numeric' readonly></td>");
			$tr.append("<td><input type='number' value='20' readonly></td>");
			$tr.append("<td><input type='number' value='4' readonly></td>");
			$tbody.append($tr);

//			for(var i=2; i<excelColumnList.length; i++){
//			var $tr= getEmptyRow(2);
//			$tbody.append($tr);
//			}
//			var $tr=$('<tr></tr>');
//			$tr.append('<th colspan="2"><button id="saveBtn">확인</button></th>');
//			$tbody.append($tr);

			$table.append($tbody[0]);
			$layerInfo.append($table);
			$layerInfo.append('<button id="saveBtn" class="btn_style">확인</button>');

			return $layerInfo;

		};
		function bindEventAddRowBtn(){
			$('#addRowBtn').click(function(){
				var i=$('#layerColumnInfo > tbody tr').length;
				var $emptryRow= getEmptyRow(i);

				$('#layerColumnInfo > tbody').append($emptryRow);
				bindEventColType();
			});
		}
		function bindEventRemoveRowBtn(){
			$('#removeRowBtn').click(function(){
				var i=$('#layerColumnInfo > tbody tr').length-1;
				if(i<2){
					return;
				}
				$($('#layerColumnInfo > tbody tr')[i]).remove();
			});
		}
		function getEmptyRow(i){
			var $tr=$('<tr></tr>');
			$tr.append("<td>"+(i+1)+"번째</td>");
			$tr.append("<td><input class=sendData id=colNm"+i+" name=colNm"+i+" type='text'></td>");
			$tr.append("<td><input class=sendData id=colKrNm"+i+" name=colKrNm"+i+" type='text'></td>");
			$tr.append('<td><select class="sendData colType" id=colType'+i+' name=colType'+i+' style="width:100%;"><option value="varchar">character varying</option><option value="text" selected>text</option><option value="numeric">numeric</option></select></td>');
			$tr.append("<td><input class=sendData id=colLen"+i+" name=colLen"+i+" type='number' min=i></td>");
			$tr.append("<td><input id=colLenDecimalPoint"+i+" name=colLenDecimalPoint"+i+" type='number' min=0 disabled></td>");
			return $tr;
		}

		function bindEventColType(){
			$('.colType').change(function(){
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

			})
		}
		function bindEventSaveBtn(){
			$('#createNewLayerWrap').find('#saveBtn').click(function(){
				var param = {};

				var colCnt=$('#layerColumnInfo').find('tr').length-1;
				param['colCnt']=colCnt;

				$('#createNewLayerWrap').find('.sendData').each(function(){
					if(($(this).attr('name')).contains('colLen')){
						param[$(this).attr('name')]=addDecimalPoint($(this));
				    }else{
				    	param[$(this).attr('name')]=$(this).val();
				    }
				});

				$.ajax({
					url: 			"./GMT_layerTable/createLayerTable.json",
					type:			"post",
					data: 			param,
					dataType:		'json',
					async:			false,
//					cache:			false,
//					contentType:	false,
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
						GMXLEGEND.createLegends().setVectorIndex();


						alert('신규레이어 등록이 완료되었습니다');
						$('#createNewLayerWrap').empty();
						$('#createNewLayerWrap').dialog('close');
					},
					error: function(){
						alert("신규레이어 등록에 실패하였습니다.");
					}
				});
			});
		}
		function addDecimalPoint($len){
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

})(GMXMAP, GMXLAYER);


