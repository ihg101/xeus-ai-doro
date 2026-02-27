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
		$(document).on("click", "#layerAuthManage", function(){
			var _ID = $(this).attr("id");

			$("#layerAuthManageWrap").dialog({
				width: $("#map").width(),
//				height: $("#map").height()*7/8,
				height: $("#map").height(),
				position: {
					my: "left top",
					at: "left top",
					of: $("#map")
				},
				open: function() {
//					$(this).dialog("option", "maxHeight", $("#map").height() - 50);

					$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
						resizeDialog(_ID);
					});

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
					_common.callAjax("/GMT_auth/getLayerAuthView.do", _param, function(view){
						$_this.html(view);
					});
				},
				close: function(){
					/**
					 * 레이어 데이터 로드 후 지도에 Vector 객체를 생성합니다.
					 */
					GMXLAYER.loadData().loadLayer(GMXMAP);

					/**
					 * 범례를 생성합니다.
					 */
					GMXLEGEND.createLegends().setVectorIndex();

					$('#layerAuthManageWrap').empty();

					if(Public.StopEvent != null){
						Public.StopEvent();
					}
					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				}
			}).dialog('open');
		});

		var resizeDialog = function(_ID){
			$("#layerAuthManageWrap").dialog({
				width: $("#map").width(),
//				height: $("#map").height()*7/8,
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
					_common.callAjax("/GMT_auth/getLayerAuthView.do", _param, function(view){
						$_this.html(view);
					});
				},
				close: function(){
					/**
					 * 레이어 데이터 로드 후 지도에 Vector 객체를 생성합니다.
					 */
					GMXLAYER.loadData().loadLayer(GMXMAP);

					/**
					 * 범례를 생성합니다.
					 */
					GMXLEGEND.createLegends().setVectorIndex();

					$('#layerAuthManageWrap').empty();

					if(Public.StopEvent != null){
						Public.StopEvent();
					}
					$(".startMenu").each(function(){
						if($(this).attr("id") == _ID){
							$(this).removeClass("active");
						}
					});
				}
			}).dialog('open');
		}

	}
}

})(GMXMAP, GMXLAYER);


