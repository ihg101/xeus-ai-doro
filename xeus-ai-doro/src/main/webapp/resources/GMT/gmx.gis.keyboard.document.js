/**
 * 키보드 이벤트 도움말 입니다.
 *
 * @auther 이주영
 */
/* jshint esversion: 6 */
"use strict";
(function(GMXMAP) {
if(GMXMAP != null){
	if(GMXMAP instanceof ol.Map){

		/**
		 * Dialog 를 생성합니다.
		 */
		GMXMAP.openKeyboardDocumentDialog = function(){
			$("#keyboardDocumentWrap").dialog("close").dialog({
				width: 650,
				height: 600,
				position: {
					my: "center",
					at: "center",
					of: $("#map")
				},
				open: function(){
					$("#keyboardDocumentWrap").find("kbd").css({
						"background-color": "#eee",
						"border-radius": "3px",
						"border": "1px solid #b4b4b4",
						"box-shadow": "0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset",
						"color": "#333",
						"display": "inline-block",
						"font-weight": "700",
						"line-height": "1",
						"padding": "2px 4px",
						"white-space": "nowrap"
					});
				},
				close: function(){

				}
			}).dialog("open");
		}

	}
}

})(GMXMAP);