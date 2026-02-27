var xeusCustom = {
		/**
		 * 2017-11-13 이주영
		 *
		 * 커스텀 alert 입니다.
		 */
		customAlert : function(_msg){

			$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
				_title : function(titleBar) {
					titleBar.html(this.options.title || '&#160;');
				}
			}));

			//var div = $('<div id="message_dialog_modal"></div>').appendTo('#xeus-map-content');
			var div = $('<div id="message_dialog_modal"></div>').appendTo('#wrap');
			var _position = {
				my : "center top-100",
				at : "center",
				of : window
			}

			var _title = "<div class='xeus-dialog-title-div'>";
			/*
			 * _title += "<img class='xeus-dialog-title-icon' "; _title += " src='" +
			 * xeusLayout.ctxPath + "/res/sym/cctv/icon_cctv.png'/>";
			 */
			_title += "<span class='xeus-dialog-title-txt' style='height: 36px; padding-left: 10px;'>알림</span>";
			_title += "</div>";

			var _dialog = $('#message_dialog_modal').dialog({
				modal : true,
				title : _title,
				resizable : false,
				position : _position,
				autoOpen : false,
				closeOnEscape: false,
				hide : {
					effect : "fade",
					duration : 100
				},
				buttons : {
					"확인" : function() {
						$(this).dialog("destroy");
						$('#message_dialog_modal').remove();
					}
				},
				open : function(event, ui) {
					//x 버튼 제거
					$('.ui-dialog-titlebar-close').hide();
				}
			});

			var _txt = '<span class="xeus-dialog-title-txt" style="padding: 10px;">';
			_txt += '<p>' + _common.utils.validNull(_msg).replace("\n", "<br>") + '</p>';
			_txt += '</span>';

			_dialog.html('');
			_dialog.html(_txt);
			// $('#message_dialog_modal').css('background','#ff00ff');
			_dialog.dialog('open');
			$('.ui-dialog').css('z-index', 99999);
			if($(".ui-dialog .ui-dialog-buttonpane button").length == 1){
				$(".ui-dialog .ui-dialog-buttonpane button").css("width", "100%");
			}
		},

		/**
		 * 2017-11-13 이주영
		 *
		 * 커스텀 alert 입니다.
		 */
		customConfirm : function(_msg, _callBack){
			// var def = $.Deferred();

			$.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
				_title : function(titleBar) {
					titleBar.html(this.options.title || '&#160;');
				}
			}));

			//var div = $('<div id="message_dialog_modal"></div>').appendTo('#xeus-map-content');
			var div = $('<div id="message_dialog_modal"></div>').appendTo('#wrap');

			var _position = {
					my : "center top-100",
					at : "center",
					of : window
			}

			var _title = "<div class='xeus-dialog-title-div'>";
			/*
			 * _title += "<img class='xeus-dialog-title-icon' "; _title += " src='" +
			 * xeusLayout.ctxPath + "/res/sym/cctv/icon_cctv.png'/>";
			 */
			_title += "<span class='xeus-dialog-title-txt' style='height: 36px; padding-left: 10px;'>알림</span>";
			_title += "</div>";

			var _dialog = $('#message_dialog_modal').dialog({
				modal : true,
				title : _title,
				resizable : false,
				position : _position,
				autoOpen : false,
				closeOnEscape: false,
				hide : {
					effect : "fade",
					duration : 100
				},
				buttons : {
					"확인" : function() {
						$(this).dialog("destroy");
						$('#message_dialog_modal').remove();
						if(_callBack != null && typeof _callBack == "function"){
							_callBack();
						}
					},
					"취소" : function() {
						$(this).dialog("destroy");
						$('#message_dialog_modal').remove();
						if(arguments[2] != null && typeof arguments[2] == "function"){
							_callBack();
						}
					}
				},
				open : function(event, ui) {
					//x 버튼 제거
					$('.ui-dialog-titlebar-close').hide();
				}
			});

			var _txt = '<span class="xeus-dialog-title-txt" style="padding: 10px;">';
			_txt += '<p>' + _common.utils.validNull(_msg).replace("\n", "<br>") + '</p>';
			_txt += '</span>';

			_dialog.html('');
			_dialog.html(_txt);
			// $('#message_dialog_modal').css('background','#ff00ff');
			_dialog.dialog('open');
			$('#message_dialog_modal').parent().css('z-index', 100000);
			// return def.promise();
		}
}