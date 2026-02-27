<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> net = cde.convertCodeGrpToAllCde("C15");
Set<String> netKey = net.keySet();
Iterator<String> netItr = netKey.iterator();

HashMap<String, String> link = cde.convertCodeGrpToAllCde("C10");
Set<String> linkKey = link.keySet();
Iterator<String> linkItr = linkKey.iterator();
%>
<script>
(function(){
// 	LayerConst.ThemeLoad("asset_fnms");
// 	XeusLayer.createLegend("#legendWrap");
	//TODO 케이블 수정 밑에 범례가 나와야하는데, 임시방편으로 일단 범례 diolog를 띄어줌
	$("#legendWrap").dialog({
		    width: "400",
			height: $("#map").height(),
			resizable: false,
			position: {
				my: "right top",
				at: "right top",
				of: $("#map")
			},
			open: function() {
				$(this).dialog("option", "maxHeight", $("#map").height());
			}
	}).dialog("open");
	$(".contentWrapper").find("#selectBtn").click(function(){
        Public.NMS.Cable.DelStart();
        $(".contentWrapper").find("#drawCncl").show("slow");
    });

	$(".contentWrapper").find("#drawCncl").click(function(){
		Public.NMS.Cable.interaction.setActive(false);
		$(".contentWrapper").find("#drawCncl").hide("slow");
	});

    $(".contentWrapper").find("#delBtn").click(function(){
        if($(".contentWrapper").find("#cableList").find("option").length == 0){
            alert("케이블을 추가해주세요.");
            return false;
        }

        confirm("선택하신 케이블을 삭제 하시겠습니까?", function(){
        	var param = {};
            $(".contentWrapper").find("#cableList").find("option").each(function(i){
		        var gid = $(this).attr("gid");
                param["cableList[" + i + "].gid"] = gid;
            });

            _common.callAjax("/netwk/delMultipleCable.json", param, function(json){
                if(json.result){
                    alert("삭제되었습니다.");
                    $(".contentWrapper").find("#drawCncl").hide("slow");
                    LayerConst.ThemeLoad("asset_fnms");
                    XeusLayer.createLegend("#legendWrap");
                    Layers["asset_fnms"].reload();
                    Public.StopEvent();
                }
            }, false);
        });
    });
})();
</script>
<style>
#cableList {
	height: 300px;
	-webkit-appearance: none;
}
</style>
<div class="overflow contentWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">


    <table id="searchTable">
        <tr>
            <th>선택 케이블 목록</th>
        </tr>
        <tr>
            <td id="cableListWrapper">
                <select id="cableList" name="cableList" multiple="multiple">
                    <optgroup class="tCenter" label="등록된 케이블은 더블클릭하여 목록에서 제외할 수 있습니다."></optgroup>
                </select>
            </td>
        </tr>
        <tr>
            <th id="drawCncl" class="hidden pointer">선택을 종료하시려면 여기를 눌러주세요.</th>
        </tr>
        <tr>
            <td class="tCenter noneBack">
                <button class="blackBtn_Fill btn_style2" style="width: 45%;" id="selectBtn">케이블 선택</button>
                <button class="blackBtn_Fill btn_style2" style="width: 45%;" id="delBtn">선택 케이블 삭제</button>
            </td>
        </tr>
    </table>
    <p class="searchTitle">범례</p>
    <div id="legendWrap"></div>

</div>