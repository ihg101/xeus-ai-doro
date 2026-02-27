/**
 * 심볼 아이콘 관리 객체 입니다.
 */
(function(){

	var loadIconData = function(){
		_common.callAjax("/GMT_layer/icon/getList.json", {}, function(iconData){
			var list = iconData.result;
			var $tbody = $("#layerIconManageWrap").find("table").find("tbody");
			var $tfoot = $("#layerIconManageWrap").find("table").find("tfoot");

			$tbody.html("");

			if(list.length > 0){
				for(var i=0; i<list.length; i++){
					var $tr = $("<tr>");
					var $td = $("<td>");

					var mgrSeq = list[i].mgrSeq;

					var $base64Text = $("<img src='" + list[i].imgBase64 + "'>").width(30).height(30).addClass("pointer").css("vertical-align", "middle").click(function(){
						var image = new Image();
						image.src = $(this).attr("src");
						var w = window.open("");
						w.document.write(image.outerHTML);
					});
					var $useYn = $td.clone().text((list[i].useYn === true ? "사용" : "미사용"));
					var $mkUser = $td.clone().text(list[i].mkUser);
					var $mkDat = $td.clone().text(Date.prototype.formatDate(list[i].mkDat));
					var $delBtn = $("<button>").addClass("btn_style2").data("k", mgrSeq).text("삭제").click(function(){
						if(confirm("아이콘을 제거하시겠습니까?")){

							//TODO 삭제시, 해당 아이콘을 사용하는 레이어가 있을 경우 디폴트로 변경해야함.
							_common.callAjax("/GMT_layer/icon/del.json", { "mgrSeq" : $(this).data("k") }, function(json){
								if(json.result){
									alert("삭제가 완료되었습니다.");
									loadIconData();
								}
							}, false);
						}
					});

					$tr.append($td.clone().append($base64Text));
					$tr.append($mkUser);
					$tr.append($mkDat);
					$tr.append($td.clone().append($delBtn));

					$tbody.append($tr);
				}
			}else{
				var $tr = $("<tr>");
				$tr.append("<td colspan='4' class='tCenter'>업로드 데이터가 존재하지 않습니다.</td>");;
				$tbody.html($tr);
			}
		}, false);
	}

	var imageToBase64 = function(file){
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){ return reader.result; };
		reader.onerror = function(error){ alert("파일 읽기를 실패하였습니다."); };
	}

	$("#iconFile").change(function(){

		var $this = $(this);
		var inputFile = $(this)[0];

		try{
			for(var i=0; i<inputFile.files.length; i++){
				var reader = new FileReader();
				reader.onload = (function(file){
					return function(readData) {
						//if(confirm("선택하신 " + (i + 1) + "번째 이미지를 업로드 하시겠습니까?")){
							_common.callAjax("/GMT_layer/icon/add.json", { "imgBase64" : readData.target.result }, function(json){
								$("#iconFile").val("");
								loadIconData();
							}, false);
						//}
			        };
				})(inputFile.files[i]);
				reader.readAsDataURL(inputFile.files[i]);
			}

		}catch(e){

		}

	});

	$("#layerIconManage").click(function(){
		var _ID = $(this).attr("id");
		$("#layerIconManageWrap").dialog("close").dialog({
			width: $("#map").width(),
//			height: $("#map").height()*7/8,
			height: $("#map").height(),
			position: {
				my: "left top",
				at: "left top",
				of: $("#map")
			},
			open: function(){
				$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
					resizeDialog(_ID);
				});

				loadIconData();
			},
			close: function(){
				if(Public.StopEvent != null){
					Public.StopEvent();
				}
				$(".startMenu").each(function(){
					if($(this).attr("id") == _ID){
						$(this).removeClass("active");
					}
				});
			}
		}).dialog("open");

	});

	var resizeDialog = function(_ID){
		$("#layerIconManageWrap").dialog("close").dialog({
			width: $("#map").width(),
//			height: $("#map").height()*7/8,
			height: $("#map").height(),
			position: {
				my: "left top",
				at: "left top",
				of: $("#map")
			},
			open: function(){
				$(".startMenu").removeClass("active");
				$("#"+_ID).addClass("active");

				$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
					resizeDialog(_ID);
				});

				loadIconData();
			},
			close: function(){
				if(Public.StopEvent != null){
					Public.StopEvent();
				}
				$(".startMenu").each(function(){
					if($(this).attr("id") == _ID){
						$(this).removeClass("active");
					}
				});
			}
		}).dialog("open");
	}
})();