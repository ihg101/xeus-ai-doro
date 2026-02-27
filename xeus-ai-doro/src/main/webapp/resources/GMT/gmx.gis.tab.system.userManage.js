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
		$(document).on("click", "#userManage", function(){

			$("#userManageWrap").dialog({
			    width: $("#map").width(),
				height: $("#map").height(),
//			    height: "auto",
				position: {
					my: "right top",
					at: "right top",
					of: $("#map")
				},
				open: function() {
//					$(this).dialog("option", "maxHeight", $("#map").height() - 50);

					var offset = 0;
					if(_param == null){
						var _param = {};
					}
					_param["limit"] = 100;
					_param["offset"] = offset;
					_param["discardChk"] = "Y";
					_param["gbn"] = 'user';
					var $_this=$(this);
					$_this.empty();
					_common.callAjax("/GMT_userMng/getUserView.do", _param, function(view){
						$_this.html(view);
					});
				},
				close: function(){
					$('#userManageWrap').empty();
				}
			}).dialog('open');
		});

	}
}

})(GMXMAP, GMXLAYER);


