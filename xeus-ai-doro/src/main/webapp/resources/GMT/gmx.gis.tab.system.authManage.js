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
		$(document).on("click", "#authManage", function(){

			$("#authManageWrap").dialog({
			    width: "70%",
//				height: $("#map").height()*7/8,
			    height: "auto",
				position: {
					my: "right-3% top",
					at: "right-3% top",
					of: $("#map")
				},
				open: function() {
					$(this).dialog("option", "maxHeight", $("#map").height() - 50);

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
					_common.callAjax("/GMT_auth/getAuthView.do", _param, function(view){
						$_this.html(view);
					});
				},
				close: function(){
					_common.callAjax("/GMT_user/getAuthGrp.json",{"authGrpNo":authGrpId}, function(json){
						if(json!=null){
							var param=json.result[0].authMgrNo;
							//TODO 관리툴 탭권한 필요시 주석 해제
//							setTabByAuth(authMgrNo);
						}
					});

					$('#authManageWrap').empty();

				}
			}).dialog('open');
		});

	}
}

})(GMXMAP, GMXLAYER);


