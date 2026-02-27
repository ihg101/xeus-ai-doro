(function(){

	$(".contentWrapper").find("table").find("tbody").find("td").css("padding", "0px");

	/**
	 * 분석명칭 수정 이벤트 입니다.
	 */
	$(".contentWrapper").find(".detailBtn").click(function(){
		var $this = $(this);
		var k = $(this).attr("k");

		var name = prompt("변경할 분석 명칭을 입력하세요.");
		if(_common.utils.isNullAndEmpty(name)) return false;

		if(confirm("분석명칭을 변경하시겠습니까?")){
			_common.callAjax("/bigData/editAnalzeName.json", { "mgrSeq" : k, "analyNm" : name }, function(json){
				if(json.result){
					alert("저장되었습니다.");

					$this.parent().prev().text(name);
				}
			});
		}
	});

	/**
	 * 불러오기 이벤트 입니다.
	 */
	$(".contentWrapper").find(".loadAnalyze").click(function(){
		var v = $(this).attr("k");
		var fk = $(this).attr("fk");
		var tbl = $(this).attr("tbl");

		if(confirm("분석을 불러오시겠습니까?")){
			$("#btn-anlys-view").click();
			_common.callAjax("/bigData/getAnalysisView.do", { "k" : v, "fk" : fk, "tbl" : tbl }, function(view) {
				$("#contentWrap").html(view);
			}, false);
		}
	});

	/**
	 * 삭제 이벤트 입니다.
	 */
	$(".contentWrapper").find(".delBtn").click(function(){
		var v = $(this).attr("k");
		var tbl = $(this).attr("tbl");
		var isParent = $(this).hasClass("isParent");
		var $parent = $(this).parent().parent();
		var $tbl = $(this).parent().parent().parent().parent();

		if(confirm("분석 결과를 삭제하시겠습니까?")){
			_common.callAjax("/bigData/delAnalyze.json", { "mgrSeq" : v, "tbl" : tbl, "isParent" : isParent }, function(json){
				if(json.result){
					alert("삭제되었습니다.");
					if(!isParent){
						$parent.remove();

						if($tbl.find(".delBtn").length == 1){
							if($tbl.attr("plan") == "즉시분석"){
								var analyKey = $tbl.attr("k");
								_common.callAjax("/bigData/delAnalyze.json", { "mgrSeq" : analyKey, "isParent" : true }, function(json){
									if(json.result) $tbl.remove();
								}, false);
							}else{
								$tbl.find(".delBtn").show();
							}
						}
					}else{
						$tbl.remove();
					}
				}
			}, false);
		}
	});

})();