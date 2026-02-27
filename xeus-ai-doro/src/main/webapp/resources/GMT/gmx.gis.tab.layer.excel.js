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
		$(document).on("click", "#uploadExcel", function(){

			var _ID = $(this).attr("id");

			$("#uploadExcelWrap").dialog({
				title: "EXCEL 가져오기",
				width: $("#map").width(),
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function() {

					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID);
					});

					$(this).dialog("option", "maxHeight", $("#map").height()-50);
					var $html=$('<div class="exl_wrap"></div>');

					var $selectBox=$('<select id="coordinateTypeSelect" style="width: 10%;"></select>');
					$selectBox.append('<option value="lonlat" selected="selected">경위도</option>');
					$selectBox.append('<option value="addr">주소</option>');
					$html.append($selectBox);

					$html.append('<button id="uploadExcelBtn" class="btn_style2">업로드(.xls / .xlsx)</button>');
					$html.append('<input type="file" name="file" id="excelFile" class="boxFile" style="display:none;" accept=".xls, .xlsx">');
					$(this).html($html);
					bindClickEventUploadExcelBtn();
					bindChnageEventExcelFile();
					bindDragEventExcelFile($(this));
				},
				close: function(){
					$('#uploadExcelWrap').empty();

					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				}
			}).dialog("open");
		});

		var resizeDialog = function(_ID){
			$("#uploadExcelWrap").dialog({
				title: "EXCEL 가져오기",
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

					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID);
					});


					$(this).dialog("option", "maxHeight", $("#map").height()-50);
					var $html=$('<div class="exl_wrap"></div>');

					var $selectBox=$('<select id="coordinateTypeSelect" style="width: 10%;"></select>');
					$selectBox.append('<option value="lonlat" selected="selected">경위도</option>');
					$selectBox.append('<option value="addr">주소</option>');
					$html.append($selectBox);

					$html.append('<button id="uploadExcelBtn" class="btn_style2">업로드(.xls / .xlsx)</button>');
					$html.append('<input type="file" name="file" id="excelFile" class="boxFile" style="display:none;" accept=".xls, .xlsx">');
					$(this).html($html);
					bindClickEventUploadExcelBtn();
					bindChnageEventExcelFile();
					bindDragEventExcelFile($(this));
				},
				close: function(){
					$('#uploadExcelWrap').empty();

					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				}
			}).dialog("open");
		}


		/**
		 * 업로드 버튼 클릭 시 이벤트
		 */
		function bindClickEventUploadExcelBtn(){

			$("#uploadExcelBtn").click(function(){
				$('#excelFile').click();
			});
		};

		/**
		 * 파일 선택 창에서 파일 선택 시
		 */
		function bindChnageEventExcelFile(){

			$('#excelFile').change(function(){
				var param = new FormData();
				param.append('file',$('#excelFile')[0].files[0]);
				param.append('coordinateType',$('#coordinateTypeSelect option:selected').val());

				$.ajax({
					url: 			"./GMT_excel/getExcelColumnList.json",
					type:			"post",
					data: 			param,
					dataType:		'json',
					async:			false,
					cache:			false,
					contentType:	false,
					processData:	false,
					success: function(json){
						$('.exl_wrap').hide();
						if("error" in json){
							alert(json.error);
							$('#uploadExcelWrap').empty();
							$('#uploadExcelWrap').dialog('close');
							return false;
						}
						var excelColumnList = json.excelColumnList;
						var tableName = json.tableName
						if($('#coordinateTypeSelect option:selected').val()=='addr'){
							appendAddrExcelInfo(excelColumnList, tableName);
						}
						else{
							appendLonLatExcelInfo(excelColumnList, tableName);
						}

					},
					error: function(){
						alert("엑셀 파일 불러오기에 실패하였습니다");
					}
				});
			})
		};
		/**
		 * 경위도 엑셀 컬럼 값 세팅
		 */
		function appendLonLatExcelInfo(excelColumnList, tableName){
			var $excelInfo = $('<div id="excelInfo" class="bPopup table_style"></div>');

			var $table= $('<table id=layerTableInfo class="list"></table>');

			var $thead=$('<thead></thead>');
			var $tr=$('<tr></tr>');
			$tr.append('<th style="display:none;"><label>테이블 영문 명칭</label></th>');
			$tr.append('<th><label>테이블 한글 명칭</label></th>');
			$tr.append('<th><label>엑셀 줄 수</label></th>');
			$tr.append('<th><label>공간정보 타입</label></th>');

			$thead.append($tr);
			$table.append($thead);

			var $tbody=$('<tbody><tbody>');
			var $tr=$('<tr></tr>');
			$tr.append("<td style='display:none;'><input value='"+tableName+"'class=sendData id=tblNm name=tblNm type='text'></td>");
			$tr.append("<td><input class=sendData id=tblKrNm name=tblKrNm type='text'></td>");
			$tr.append("<td><input class=sendData id=excelRowCnt name=excelRowCnt type='text' oninput=\"this.value=this.value.replace(/[^0-9]/g,'');\"></td>");
			$tr.append('<td style="left: 6px;position: relative;"><select class=sendData id=lyrTyp name=lyrTyp ><option value="" selected>-선택-</option><option value="point">포인트(점)</option><option value="line">라인(선)</option></select></td>');

//			<option value="polygon">폴리곤(면)</option>
			$tbody.append($tr);

			$table.append($tbody[0]);
			$excelInfo.append($table);

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

			for(var i=2; i<excelColumnList.length; i++){
				var $tr=$('<tr></tr>');
				$tr.append("<td>"+(i+1)+"번째</td>");
				$tr.append("<td><input class=sendData id=colNm"+i+" name=colNm"+i+" type='text' value='"+excelColumnList[i]+"'></td>");
				$tr.append("<td><input class=sendData id=colKrNm"+i+" name=colKrNm"+i+" type='text'></td>");
				$tr.append('<td><select class="sendData colType" id=colType'+i+' name=colType'+i+' style="width:100%;"><option value="varchar">character varying</option><option value="text" selected>text</option><option value="numeric">numeric</option></select></td>');
				$tr.append("<td><input class=sendData id=colLen"+i+" name=colLen"+i+" type='number' min=1 disabled></td>");
				$tr.append("<td><input id=colLenDecimalPoint"+i+" name=colLenDecimalPoint"+i+" type='number' min=0 disabled></td>");
				$tbody.append($tr);
			}


			$table.append($tbody[0]);
			$excelInfo.append($table);
			$excelInfo.append('<button id="saveBtn" class="btn_style">확인</button>');

			$('#uploadExcelBtn').remove();
			$('#excelInfo').remove();
			$('#coordinateTypeSelect').css('display','none');
			$('#uploadExcelWrap').append($excelInfo);

			bindEventColType();
			bindEventSaveBtn();
		};

		/**
		 * 주소 엑셀 컬럼 값 세팅
		 */
		function appendAddrExcelInfo(excelColumnList, tableName){
			var $excelInfo = $('<div id="excelInfo" class="bPopup table_style"></div>');

			var $table= $('<table id=layerTableInfo class="list"></table>');

			var $thead=$('<thead></thead>');
			var $tr=$('<tr></tr>');
			$tr.append('<th style="display:none;"><label>테이블 영문 명칭</label></th>');
			$tr.append('<th><label>테이블 한글 명칭</label></th>');
			$tr.append('<th><label>엑셀 줄 수</label></th>');
			$tr.append('<th><label>공간정보 타입</label></th>');
			$thead.append($tr);
			$table.append($thead);

			var $tbody=$('<tbody></tbody>');
			var $tr=$('<tr></tr>');
			$tr.append("<td style='display:none;'><input value='"+tableName+"'class=sendData id=tblNm name=tblNm type='text'></td>");
			$tr.append("<td><input class=sendData id=tblKrNm name=tblKrNm type='text'></td>");
			$tr.append("<td><input class=sendData id=excelRowCnt name=excelRowCnt type='text' oninput=\"this.value=this.value.replace(/[^0-9]/g,'');\"></td>");
			$tr.append('<td style="left: 6px;position: relative;"><select class=sendData id=lyrTyp name=lyrTyp ><option value="" selected>-선택-</option><option value="point">포인트(점)</option></select></td>');
			$tbody.append($tr);

			$table.append($tbody[0]);
			$excelInfo.append($table);

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

			var $tbody2=$('<tbody></tbody>');

			var $tr=$("<tr style='display:none'></tr>");
			$tr.append("<td>1번째</td>");
			$tr.append("<td><input type='text' value='annox' readonly></td>");
			$tr.append("<td><input type='text' value='주기X좌표' readonly></td>");
			$tr.append("<td><input type='text' value='numeric' readonly></td>");
			$tr.append("<td><input type='number' value='20' readonly></td>");
			$tr.append("<td><input type='number' value='4' readonly></td>");
			$tbody2.append($tr);

			var $tr=$("<tr style='display:none'></tr>");
			$tr.append("<td>2번째</td>");
			$tr.append("<td><input type='text' value='annoy' readonly></td>");
			$tr.append("<td><input type='text' value='주기Y좌표' readonly></td>");
			$tr.append("<td><input type='text' value='numeric' readonly></td>");
			$tr.append("<td><input type='number' value='20' readonly></td>");
			$tr.append("<td><input type='number' value='4' readonly></td>");
			$tbody2.append($tr);

			var $tr=$('<tr></tr>');
			$tr.append("<td>1번째</td>");
			$tr.append("<td><input class='sendData' id='colNm2' name='colNm2' type'text' value='addr' readonly></td>");
			$tr.append("<td><input class='sendData' id='colKrNm2' name='colKrNm2' value='주소' type='text' readonly></td>");
			$tr.append("<td><input class='sendData' id='colType2' name='colType2' type='text' value='text' readonly></td>");
			$tr.append("<td><input class='sendData' id='colLen2' name='colLen2' type='number' min='1' disabled='disabled'></td>");
			$tr.append("<td><input class='sendData' id='colLenDecimalPoint2' name='colLenDecimalPoint2' type='number' min='1' disabled='disabled'></td>");
			$tbody2.append($tr);



			for(var i=1; i<excelColumnList.length; i++){
				var $tr=$('<tr></tr>');
				$tr.append("<td>"+(i+1)+"번째</td>");
				$tr.append("<td><input class=sendData id=colNm"+(i+2)+" name=colNm"+(i+2)+" type='text' value='"+excelColumnList[i]+"'></td>");
				$tr.append("<td><input class=sendData id=colKrNm"+(i+2)+" name=colKrNm"+(i+2)+" type='text'></td>");
				$tr.append('<td><select class="sendData colType" id=colType'+(i+2)+' name=colType'+(i+2)+' style="width:100%;"><option value="varchar">character varying</option><option value="text" selected>text</option><option value="numeric">numeric</option></select></td>');
				$tr.append("<td><input class=sendData id=colLen"+(i+2)+" name=colLen"+(i+2)+" type='number' min=1 disabled></td>");
				$tr.append("<td><input id=colLenDecimalPoint"+(i+2)+" name=colLenDecimalPoint"+(i+2)+" type='number' min=0 disabled></td>");
				$tbody2.append($tr);
			}


			$table.append($tbody2[0]);
			$excelInfo.append($table);
			$excelInfo.append('<button id="saveBtn" class="btn_style">확인</button>');

			$('#uploadExcelBtn').remove();
			$('#excelInfo').remove();
			$('#coordinateTypeSelect').css('display','none');
			$('#uploadExcelWrap').append($excelInfo);

			bindEventColType();
			bindEventSaveBtn();
		};

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
			$('#uploadExcelWrap').find('#saveBtn').click(function(){
				var param = new FormData();
				param.append('coordinateType',$('#coordinateTypeSelect option:selected').val());
				param.append('file',$('#excelFile')[0].files[0]);

				var colCnt=$('#layerColumnInfo').find('tr').length-1;
				param.append('colCnt',colCnt);

				$('.sendData').each(function(){
					if(($(this).attr('name')).contains('colLen')){
						param.append($(this).attr('name'),addDecimalPoint($(this)));
				    }else{
				    	param.append($(this).attr('name'),$(this).val());
				    }
				});

				$.ajax({
					url: 			"./GMT_excel/uploadExcel.json",
					type:			"post",
					data: 			param,
					dataType:		'json',
					async:			false,
					cache:			false,
					contentType:	false,
					processData:	false,
					success: function(json){
						if(json.result!="success"){

							alert(json.result);
							if(json.result.contains("ROW")){
								$('#uploadExcelWrap').empty();
								$('#uploadExcelWrap').dialog('close');
								$('#uploadExcel').click();
							}


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

						alert('엑셀 업로드가 완료되었습니다');


						$('#uploadExcelWrap').empty();
						$('#uploadExcelWrap').dialog('close');
					},
					error: function(){
						alert("엑셀 업로드에 실패하였습니다");
						$('#uploadExcelWrap').empty();
						$('#uploadExcelWrap').dialog('close');
						$('#uploadExcel').click();
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
		/**
		 * 엑셀 파일 drag 이벤트 bind
		 */
		function bindDragEventExcelFile(dropZone){

			dropZone.on('dragenter',function(e){
	            e.stopPropagation();
	            e.preventDefault();
	            // 드롭다운 영역 css
//	            dropZone.css('background-color','#E3F2FC');
	        });
	        dropZone.on('dragleave',function(e){
	            e.stopPropagation();
	            e.preventDefault();
	            // 드롭다운 영역 css
//	            dropZone.css('background-color','#FFFFFF');
	        });
	        dropZone.on('dragover',function(e){
	            e.stopPropagation();
	            e.preventDefault();

	            // 드롭다운 영역 css
//	            dropZone.css('background-color','#E3F2FC');
	        });
	        dropZone.on('drop',function(e){

	            // 드롭다운 영역 css
//	            dropZone.css('background-color','#FFFFFF');
	            if($("#uploadExcelWrap").find("#excelInfo").length == 0){
	            	e.stopPropagation();
		            e.preventDefault();
	            	var files = e.originalEvent.dataTransfer.files;
	            	if(files != null){
	            		if(files.length < 1){
	            			alert("엑셀 업로드에 실패하였습니다");
	            			return;
	            		}
	            		if($('#excelFile')[0].files.length == 0){
	            			$('#excelFile')[0].files=files;
	            			$('#excelFile').change();
	            		}
	            	}else{
	            		alert("엑셀 업로드에 실패하였습니다");
	            	}
	            }

	        });
		}

	}
}

})(GMXMAP, GMXLAYER);


