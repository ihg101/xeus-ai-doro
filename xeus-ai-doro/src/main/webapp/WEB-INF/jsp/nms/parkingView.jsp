<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<style>
#stateWrap { position: absolute; width: 100%; z-index: 1; bottom: 0; left: 0px; }
#stateWrap span { font-weight: bold; font-size: 20px; }
#stateWrap table { margin: 0px; }
</style>
<script>
(function(){
	Public.NMS.Parking.Start();
})();
</script>
<div id="parkingWrap" style="height: 100%;">
	<canvas id="__parking__line-canvas" style="position: absolute; width: 1849px; height: 849px; margin: 0 auto; top: 0;"></canvas>
	<canvas id="__parking__video-canvas" style="display: block; height: 100%; margin: 0 auto;"></canvas>
	<div id="stateWrap" class="tCenter">
		<table>
			<tbody>
				<tr>
					<td class="tCenter">
				    	<span id="allCnt">전체 주차 공간 : 105 대</span>
					</td>
					<td class="tCenter">
				    	<span id="nowCnt">현재 주차 수 : 87 대</span>
					</td>
					<td class="tCenter">
				    	<span id="marginCnt">여유 공간 : 18 대</span>
					</td>
				</tr>
			</tbody>
		</table>
    </div>

	<script type="text/javascript">
		var IP = "101.102.104.114";
		if(location.host == "222.107.208.134"){
			IP = "222.107.208.134";
		}else if(location.host == "argos.seocho.go.kr"){
			IP = "argos.seocho.go.kr";
		}else if(location.host == "172.27.143.199"){
			IP = "172.27.143.199";
		}

		var VIDEO_WEBSOCKET_URL = "ws://" + IP + "/xeus-gate/stream";
		var __parking__canvas = document.getElementById("__parking__video-canvas");
		var __parking__player = new JSMpeg.Player(VIDEO_WEBSOCKET_URL.replace("xeus-gate", "xeus-gateway"), {
			canvas : __parking__canvas,
			autoplay : true,
			loop : false,
			disableGl : true,
			userId : userId,
			cctvMgrNo : "CTV0000419",
			size : "1920x1080"
		});

		$(window).on("beforeunload", function() {
			if(__parking__player != null && __parking__player != 'undefined' ){
				__parking__player.destroy();
			}
		});
	</script>
</div>