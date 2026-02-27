$(document).ready(function (){

});

/* 파일 다운 */
$(document).on("click", "#fileDown", function(){
	var k = $(this).attr("k");
	var u = $(this).attr("u");

	if(k != null && k != "" && u != null && u != ""){
		_common.postForm.submit("/GMT_notice/getFile.json", { "atchFileNm" : k , "mgrSeq" : u });
	}
});

/* bPopup Close */
$(document).on("click", ".bpopClose", function(){
	$(".bpopup").bPopup().close();
});

/* 수정 팝업 */
$(document).on("click", ".notcTitle", function(){
	var mgrSeq = $(this).attr("k");

	_common.callAjax("/GMT_notice/getItem.json", {"mgrSeq" : mgrSeq}, function(json){
		if(json.result != null){
			for(var key in json.result){
				$("#edit_pop_wrap").find("#" + key).val(json.result[key]);
				if(key == "atchFileNm"){
					$("#fileDown").attr("u", mgrSeq).attr("k", json.result[key]).val(json.result[key]);
				}
			}
			$("#edit_pop_wrap").bPopup({appendTo: $('#wrapParent')});
		}
	}, false);
});


/* 계정등록 */
$(document).on("click", "#signUpBtn", function(){
//	_common.callAjax("/GMT_user/reg.do", {},function(view){
//		if(view != null){
//			$('body').append(view);
//		}
//	}, false);
	$('.login_container.log').fadeOut(300, function(){
        $('.login_container.join').fadeIn(300);
    });
});