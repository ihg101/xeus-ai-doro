<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<script>
$(".contentWrapper").find(".searchRing").click(function(){
	$("button.tab").removeAttr("active");
	var v = $(this).attr("k");
	Public.NMS.Ring.getList(v);
	$(this).attr("active", "active");
});

Public.NMS.Ring.getList("CCTV");

//Public.NMS.RainFall.Stop();
//Public.NMS.WaterPump.Stop();
GMXMAP.setLayerVisible("asset_cctv", false);//.setVisible(false);
GMXMAP.setLayerVisible("asset_pump", false);//.setVisible(false);
GMXMAP.setLayerVisible("asset_pump_sec", false);//.setVisible(false);
GMXMAP.setLayerVisible("asset_rainfall", false);//.setVisible(false);
GMXMAP.setLayerVisible("asset_netwk_wifi", true);//.setVisible(false);
GMXMAP.setLayerVisible("asset_netwk_cctv", true);//.setVisible(false);
GMXMAP.setLayerVisible("asset_netwk_lora", true);//.setVisible(false);
GMXMAP.setLayerVisible("asset_infra_cctv", true);//.setVisible(false);
GMXMAP.setLayerVisible("asset_infra_wifi", true);//.setVisible(false);
GMXMAP.setLayerVisible("asset_infra_lora", true);//.setVisible(false);
GMXMAP.setLayerVisible("asset_infra", false);//.setVisible(true);
GMXMAP.setLayerVisible("asset_fnms", false);//.setVisible(true);
</script>
<div class="searchWrapper customScroll" data-mcs-theme="minimal-dark">

	<p class="searchTitle">논리망 조회</p>
    <div class="tabTitle">
	    <button class="searchRing tab" k="CCTV" active="active" style="padding: 5px 30px;">CCTV</button>
	    <button class="searchRing tab" k="WIFI" style="padding: 5px 30px;">WiFi</button>
	    <button class="searchRing tab" k="LORA" style="padding: 5px 30px;">LoRa</button>
    </div>

    <div id="resultList" class="ui-droppable customScroll" data-mcs-theme="minimal-dark" style="max-height: 95%;">
	    <table>
	    </table>
    </div>
</div>