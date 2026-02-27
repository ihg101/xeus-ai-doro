/**
 * 지도 위치를 대매뉴 별로 의존합니다.
 *
 * @auther 이주영
 */
"use strict";

(function(GMXMAP){

if(GMXMAP != null){
	if(GMXMAP instanceof ol.Map){

		/**
		 * 지도 위치 동기화 버튼을 생성합니다.
		 */
		$(".ol-control.mainBar > .ol-bar").append("<div class='sync_box'><div class='btn_wrap'>지도 위치 동기화<div class='btn_switch'><input type='checkbox' id='syncChk'/><label for='syncChk'>지도위치동기화</label></div></div></div>");

		var $sync = $(".ol-control.mainBar > .ol-bar").find("#syncChk");

		/**
		 * 지도 위치 동기화 이벤트 입니다.
		 */
		GMXMAP["mapSync"] = false;

		var setSyncToggle = function(){
			if(("localStorage" in window) && ("mapSync" in localStorage)){
				GMXMAP["mapSync"] = localStorage["mapSync"] === "true" ? true : false;

				if( GMXMAP["mapSync"]) $sync.prop("checked", true);
				if(!GMXMAP["mapSync"]) $sync.prop("checked", false);
			}
		}
		setSyncToggle();

		var setChecked = function(_Tab_, bool){
			_Tab_.GMXMAP["mapSync"] = bool;
			if($("#syncChk", _Tab_.document).length > 0){
				$("#syncChk", _Tab_.document).prop("checked", bool);
			}
		}

		var setMapCondition = function(){
			if(GMXMAP["mapSync"]){
				var resolution = GMXMAP.getView().getResolution();
				var center = GMXMAP.getView().getCenter();
				var zoom = GMXMAP.getView().getZoom();

				if("NEW_TABS" in window){
					for(var key in window.NEW_TABS){
						if("GMXMAP" in window.NEW_TABS[key]){
							//window.NEW_TABS[key].GMXMAP.getView().setResolution(resolution);
							window.NEW_TABS[key].GMXMAP.getView().setCenter(center);
							window.NEW_TABS[key].GMXMAP.getView().setZoom(zoom);
						}
					}
				}

				if(opener != null){
					if("GMXMAP" in opener){
						//opener.GMXMAP.getView().setResolution(resolution);
						opener.GMXMAP.getView().setCenter(center);
						opener.GMXMAP.getView().setZoom(zoom);
					}
					if("NEW_TABS" in opener.window){
						for(var key in opener.window.NEW_TABS){
							if("GMXMAP" in opener.window.NEW_TABS[key]){
								//opener.window.NEW_TABS[key].GMXMAP.getView().setResolution(resolution);
								opener.window.NEW_TABS[key].GMXMAP.getView().setCenter(center);
								opener.window.NEW_TABS[key].GMXMAP.getView().setZoom(zoom);
							}
						}
					}
				}
			}
		}

		$(document).on("change", "#syncChk", function(){
			var bool = $("#syncChk").is(":checked");
			GMXMAP["mapSync"] = bool;
			if("localStorage" in window) localStorage["mapSync"] = bool;

			if("NEW_TABS" in window){
				for(var key in window.NEW_TABS){
					setChecked(window.NEW_TABS[key], bool);
				}
			}

			if(opener != null){
				setChecked(opener, bool);

				if("NEW_TABS" in opener.window){
					for(var key in opener.window.NEW_TABS){
						setChecked(opener.window.NEW_TABS[key], bool);
					}
				}
			}

		});

		//GMXMAP.getView().on("change:resolution", setMapCondition);
		GMXMAP.on("moveend", setMapCondition);


		if(window.performance){
			if(performance.navigation.type == 1){
				//alert( "This page is reloaded" );
			}
		}
		window.onunload = function() {
			if(opener != null){
				var classList = $(".tab_wrap").find("button.active").attr("class").split(/\s+/);
				for(var i=0; i<classList.length; i++){
					if(classList[i] in opener.window.NEW_TABS){
						//delete opener.window.NEW_TABS[classList[i]];
						break;
					}
				}
			}
	    }

	}
}

})(GMXMAP);