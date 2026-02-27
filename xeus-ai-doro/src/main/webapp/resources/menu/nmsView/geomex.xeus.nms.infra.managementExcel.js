(function(){

	
	/* 엑셀 내보내기 버튼 이벤트 입니다. */
	$(".excelWrapper").find("#excelExportBtn").click(function(){
		if(confirm("CCTV데이터를 양식에 맞게 엑셀로 다운로드 하시겠습니까?")) {
			var param = {};
			delete param["limit"];
			delete param["offset"];
			param["objType"] = 'CTV';
			param["sortCol"] = 'cctv_nm';
			param["sortTyp"] = 'ASC';

			_common.postForm.submit("/nms/getCctvDataExcel.do", param);
		}
	});

	/* 
	 * 엑셀 일괄등록 이벤트 입니다.
	 */
	$(".excelWrapper").find("#excelImportBtn").click(function(){
		$("#selectTxt").click();
	});
	
	/*
	 * 파일 업로드 이벤트입니다.
	 */
	$(".excelWrapper").find("input[type=file]#file").change(function(){
		
		var droppedFiles = $(".excelWrapper").find("input[type=file]#file")[0].files;
		
		if(confirm(droppedFiles[0].name + " 파일을 업로드하시겠습니까? \n * 기존 CCTV 내역이 전부 삭제됩니다.")) {
			
			var $input = $(".excelWrapper").find("input[type=file]#file");

			var fileNm = droppedFiles[0].name.split(".");
			if(fileNm[fileNm.length-1] != "xlsx"){
				alert("양식파일만 업로드 가능합니다.");
				return;
			}
			
			if(droppedFiles.length > 0){
				var param = new FormData();
				$.each(droppedFiles, function( i, file ){
					param.append( $input.attr( 'name' ), file );
				});
				
				$.ajax({
					url: 			'/xeus/nms/addCctvInstallExcel.json',
					type:			'post',
					data: 			param,
					dataType:		'json',
					async:			false,
					cache:			false,
					contentType:	false,
					processData:	false,
					success: function(json){
						if("error" in json){
							alert(json.error);
							return false;
						}
						if(json.result){
							var result = "파일업로드가 완료되었습니다. \n삭제된 CCTV 갯수 : ";
							    result += json.prevCount + "개 \n";
							    result += "새로 등록된 CCTV 갯수 : " + json.successCount +"개";
							    
							alert(result);
							GMXMAP.reloadLayerData("asset_cctv");
							$(".excelWrapper").find("input[type=file]#file").val("");
						}
					},
					error: function(){
						
						alert("파일업로드에 실패하였습니다. ");
						$(".excelWrapper").find("input[type=file]#file").val("");
					}
				});

				$input.val("");
			}
		};
	});

})();

