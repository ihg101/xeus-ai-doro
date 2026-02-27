/**
 * 장비관리(NMS) 메뉴의 점검 등록 관련 이벤트 입니다.
 */
(function(){

	$(document).ready(function(){

		$("#searchBox").find(".paging_wrap").paging({
			current	  : 10,
			max  	  : Number($("#max").val()),
			nowOffset : Number($("#offset").val()),
			bindEvent : callView
		});

		resizeDone();

	});

	$(window).resize(function(){

//		clearTimeout( timer );
//	    timer = setTimeout( resizeDone, delta );
	});

	function resizeDone() {

		//$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height());
		$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height() - 40);

	}

	$(".contentWrapper").find('.histList').click(function(){

		if ( $(this).hasClass('grayBtn') ){

			var _param = {};
			_param["renewTyp"] = renewTyp;
			_param["mgrSeq"] = Number($(this).attr('mgrseq'));

			_common.callAjax("/tvius/getUsrTviusRenewList.do", _param, function(view) {
				$(".contentWrapper").find("#histList").html(view);
				resizeDone();
			});

		}

	});

	function callView(offset,_param){
		if(offset == null) offset = 0;
		if(_param === undefined){
			_param = {};
			_param['limit'] = 10;
			if(chkParam == "useRst"){
				_param['useRsCdNullChk'] = 'Y';
				_param['procStatCd'] = 'SK';
			}
			if(chkParam == "stat"){
				_param['procStatCd'] = 'SW';
			}

		}
		_param['offset'] = offset;

		_common.callAjax("/tvius/getUsrTviusRqstView.do", _param, function(view){
			$(".contentWrapper").find("#overlay-west-contents").html(view);
		});
	}

})();