/**
 * <pre>
 * 다음 로드뷰 객체입니다.
 *
 * @author 이주영
 * </pre>
 */
"use strict";

if(window.geomex == null) var geomex = { xeus : {} };
geomex.xeus.DaumRoadViewWindow = {

	TMS : null,
	marker : null,
	markerTarget : null,

	focus : function(){
		opener.window._CesiumWindow.focus();
	},

	removeMarker : function(){
		if(this.TMS != null){
			opener.GMXMAP.removeLayer(this.TMS);
			this.TMS = null;
		}
		if(this.marker != null){
			opener.GMXMAP.removeLayer(this.marker);
			this.marker = null;
		}
		if(this.markerTarget != null){
			$("#roadViewMarker", opener.document).remove();
			this.markerTarget = null;
		}

		return this;
	},

	createMarker : function(opener){
		if(!opener){
			console.error(">> opener 객체가 지정되지않았습니다.");
			return false;
		}

		this.removeMarker();

		$("#body", opener.document).append("<div id='roadViewMarker'></div>");

		this.markerTarget = opener.document.getElementById("roadViewMarker");
		$(this.markerTarget, opener.document).append("<div class='MapWalker'><div class='figure'></div><div class='angleBack'></div></div>");

		this.TMS = new opener.DaumMap().createRoadViewLayer(true);
		this.TMS.setZIndex(9999);
		this.marker = new opener.ol.Overlay({
			id: "roadView",
			position: opener.GMXMAP.getView().getCenter(),
			positioning: "center-center",
			element: this.markerTarget,
			stopEvent: true
		});

		this.markerTarget.addEventListener("mousedown", function(evt) {
			function move(evt) {
				geomex.xeus.DaumRoadViewWindow.marker.setPosition(opener.GMXMAP.getEventCoordinate(evt));
			};
			function end(evt) {
				opener.window._RoadViewWindow.focus();

				var xy = geomex.xeus.DaumRoadViewWindow.marker.getPosition();
				var transXY = opener.ol.proj.transform(xy, "EPSG:5186", "EPSG:4326");

				geomex.xeus.DaumRoadViewWindow.createRoadView(new daum.maps.LatLng(transXY[1], transXY[0]));

				opener.window.removeEventListener("mousemove", move);
				opener.window.removeEventListener("mouseup", end);
			};
			opener.window.addEventListener("mousemove", move);
			opener.window.addEventListener("mouseup", end);
		});

		opener.GMXMAP.addOverlay(this.marker);
		opener.GMXMAP.addLayer(this.TMS);

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
				$(this.markerTarget, opener.document).find(".MapWalker").attr("class", "MapWalker " + 'm' + i);
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
	        	geomex.xeus.DaumRoadViewWindow.rv.setPanoId(panoId, position);
	        	geomex.xeus.DaumRoadViewWindow.rv.relayout();
	        }else{
	        	if(geomex.xeus.DaumRoadViewWindow.buffer > 500){
	        		alert("근접한 로드뷰 가능 도로가 없습니다.");
	        		return false;
	        	}
	        	geomex.xeus.DaumRoadViewWindow.getNearsetPanoId(
        			geomex.xeus.DaumRoadViewWindow.position,
        			geomex.xeus.DaumRoadViewWindow.buffer + 50
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
			if($("#roadView").length == 0) $("body").append("<div id='roadView' title='다음 로드뷰' style='width: 100%; height: 100%;'></div>");

			this.removeRoadView();

			this.rc = new daum.maps.RoadviewClient();
			this.rv = new daum.maps.Roadview(document.getElementById("roadView"));

			this.getNearsetPanoId(position, 50);

			daum.maps.event.addListener(this.rv, "position_changed", function(){
				var tmpXy = geomex.xeus.DaumRoadViewWindow.rv.getPosition().toString().replaceAll("(","").replaceAll(")","").split(",");
				var xy = [tmpXy[1], tmpXy[0]];
				var transXY = opener.ol.proj.transform(xy, "EPSG:4326", "EPSG:5186");
				var pan = geomex.xeus.DaumRoadViewWindow.rv.getViewpoint().pan;

				opener.GMXMAP.getView().setCenter(transXY);
				setTimeout(function(){
					geomex.xeus.DaumRoadViewWindow.marker.setPosition(transXY);
					geomex.xeus.DaumRoadViewWindow.setAngle(pan);
				}, 100);

			});

			daum.maps.event.addListener(this.rv, "viewpoint_changed", function(){
				var pan = geomex.xeus.DaumRoadViewWindow.rv.getViewpoint().pan;
				geomex.xeus.DaumRoadViewWindow.setAngle(pan);
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
			opener.window._RoadViewWindow = null;
			if($(".roadview", opener.document).length > 0) $(".roadview", opener.document).parent().removeClass("active");
		}catch(e){

		}
	}
}