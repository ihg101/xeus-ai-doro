/**
 * <pre>
 * 다음 로드뷰 객체입니다.
 *
 * @author 이주영
 * </pre>
 */
"use strict";

(function(GMXMAP){

if(GMXMAP != null){
	if(GMXMAP instanceof ol.Map){

		var _MapElement = "#" + GMXMAP.getTarget();

		GMXMAP["DaumRoadView"] = {

			TMS : null,
			marker : null,
			markerTarget : null,

			removeMarker : function(){
				if(this.TMS != null){
					GMXMAP.removeLayer(this.TMS);
					this.TMS = null;
				}
				if(this.marker != null){
					GMXMAP.removeLayer(this.marker);
					this.marker = null;
				}
				if(this.markerTarget != null){
					$("#roadViewMarker").remove();
					this.markerTarget = null;
				}

				return this;
			},

			createMarker : function(){
				this.removeMarker();

				$(_MapElement).append("<div id='roadViewMarker'></div>");

				this.markerTarget = document.getElementById("roadViewMarker");
				$(this.markerTarget).append("<div class='MapWalker'><div class='figure'></div><div class='angleBack'></div></div>");

				this.TMS = new DaumMap().createRoadViewLayer(true);
				this.TMS.setZIndex(9999);
				this.marker = new ol.Overlay({
					id: "roadView",
					position: GMXMAP.getView().getCenter(),
					positioning: "center-center",
					element: this.markerTarget,
					stopEvent: true
				});

				this.markerTarget.addEventListener("mousedown", function(evt) {
					function move(evt) {
						GMXMAP["DaumRoadView"].marker.setPosition(GMXMAP.getEventCoordinate(evt));
					};
					function end(evt) {
						if(window._RoadViewWindow) window._RoadViewWindow.focus();

						var xy = GMXMAP["DaumRoadView"].marker.getPosition();
						var transXY = ol.proj.transform(xy, "EPSG:5186", "EPSG:4326");

						GMXMAP["DaumRoadView"].createRoadView(new daum.maps.LatLng(transXY[1], transXY[0]));

						window.removeEventListener("mousemove", move);
						window.removeEventListener("mouseup", end);
					};
					window.addEventListener("mousemove", move);
					window.addEventListener("mouseup", end);
				});

				GMXMAP.addOverlay(this.marker);
				GMXMAP.addLayer(this.TMS);

				return this;
			},

			rc : null,
			rv : null,

			removeRoadView : function(){
				if(this.rc != null){
					this.rc = null;
				}
				if(this.rv != null){
					if(this.rv.isLoaded()){
						this.rv.remove();
					}
					this.rv = null;
				}

				return this;
			},

			setAngle : function(angle){
				var threshold = 22.5;
				for(var i=0; i<16; i++){
					if(angle > (threshold * i) && angle < (threshold * (i + 1))){
						$(this.markerTarget).find(".MapWalker").attr("class", "MapWalker " + 'm' + i);
						break;
					}
				}
			},

			buffer : null,
			position : null,
			getNearsetPanoId : function(position, buffer){
				this.buffer = buffer;
				this.position = position;
				this.rc.getNearestPanoId(position, buffer, function(panoId) {
			        if (panoId !== null) {
			        	GMXMAP["DaumRoadView"].rv.setPanoId(panoId, position);
			        	GMXMAP["DaumRoadView"].rv.relayout();
			        }else{
			        	if(GMXMAP["DaumRoadView"].buffer > 500){
			        		alert("근접한 로드뷰 가능 도로가 없습니다.");
			        		return false;
			        	}
			        	GMXMAP["DaumRoadView"].getNearsetPanoId(
		        			GMXMAP["DaumRoadView"].position,
		        			GMXMAP["DaumRoadView"].buffer + 50
			        	);
			        }
			    });
			},

			createRoadView : function(position){
				if(position == null){
					var xy = GMXMAP.getView().getCenter();
					var position = Spatial.convertProjection(xy, "EPSG:5186", "EPSG:4326");
					position = new daum.maps.LatLng(position[1], position[0]);
				}

				try{
					if($("#roadView").length == 0) $(_MapElement).append("<div id='roadView' title='다음 로드뷰'></div>");
					$("#roadView").dialog({
						width: 470,
						height: 415,
						position: {
							my: "right bottom",
							at: "right bottom",
							of: $(_MapElement)
						},
						open : function(){
							$(this).parent().find(".ui-dialog-titlebar").data("isFullWidth", false).off("dblclick").dblclick(function(){
								var fullScreen = $(this).data("isFullWidth");
								if(!fullScreen){
									$("#featureSelectInfoWrap").dialog("option", "width", $("#map").width());
									$("#featureSelectInfoWrap").dialog("option", "height", $("#map").height());
									$(this).data("isFullWidth", true);
								}else{
									$("#featureSelectInfoWrap").dialog("option", "width", "500px");
									$(this).data("isFullWidth", false);
								}
							});
						},
						close : function(){
							GMXMAP["DaumRoadView"].destroyRoadView();
						}
					}).parent().draggable({
						containment: _MapElement,
						scroll: false
					});

					this.removeRoadView();

					this.rc = new daum.maps.RoadviewClient();
					this.rv = new daum.maps.Roadview($("#roadView")[0]);

					this.getNearsetPanoId(position, 50);

					daum.maps.event.addListener(this.rv, "init", function(){
						$("#roadView").find("object").css("top", "0px").css("left", "0px");

						var $btn = $("<button class='btn_style'>새창에서 로드뷰 열기</button>").css({
							"position" : "absolute",
						    "z-index" : "1",
						    "bottom" : "-45px",
						    "left" : "0px",
						}).click(function(){
							var xy = GMXMAP.getView().getCenter();
							var position = Spatial.convertProjection(xy, "EPSG:5186", "EPSG:4326");
							window._RoadViewWindow = window.open("./roadView.jsp?lng=" + position[0] + "&lat=" + position[1], "다음 로드뷰", "width=800, height=700, toolbar=no, menubar=no, scrollbars=no, resizable=yes");
						});

						$("#roadView").after($btn);

						$("#roadView").find("div[id^=box_util]").css("bottom", "50px");
					});

					daum.maps.event.addListener(this.rv, "position_changed", function(){
						var tmpXy = GMXMAP["DaumRoadView"].rv.getPosition().toString().replaceAll("(","").replaceAll(")","").split(",");
						var xy = [tmpXy[1], tmpXy[0]];
						var transXY = ol.proj.transform(xy, "EPSG:4326", "EPSG:5186");
						var pan = GMXMAP["DaumRoadView"].rv.getViewpoint().pan;

						GMXMAP.getView().setCenter(transXY);
						setTimeout(function(){
							GMXMAP["DaumRoadView"].marker.setPosition(transXY);
							GMXMAP["DaumRoadView"].setAngle(pan);
						}, 100);

					});

					daum.maps.event.addListener(this.rv, "viewpoint_changed", function(){
						var pan = GMXMAP["DaumRoadView"].rv.getViewpoint().pan;
						GMXMAP["DaumRoadView"].setAngle(pan);
					});
				}catch(e){
					console.log(e);
					var msg = "Daum 로드뷰를 이용하시려면 Adobe Flash Player 가 필요합니다.\n\n확인을 누르시면 다운로드 페이지로 이동합니다.\n\n만약 이미 설치하셨을 경우,\n잠시후 좌측 상단에 나타나는 팝업창의 [허용] 버튼을 누르신뒤\n다시 한번 로그인 후 이용하실 수 있습니다.";
					if(confirm(msg)){
						window.location = "http://get.adobe.com/flashplayer/";
					}
				}
			},

			isAlive : function(){
				var bool = false;
				if(this.TMS != null || this.marker != null || this.markerTarget != null || this.rc != null || this.rv != null){
					bool = true;
				}

				return bool;
			},

			destroyRoadView : function(){
				try{
					this.removeRoadView().removeMarker();
					$("#roadView").dialog("close").remove();
					if($(".roadview").length > 0) $(".roadview").parent().removeClass("active");
				}catch(e){

				}
			}
		}

	}
}

})(GMXMAP);