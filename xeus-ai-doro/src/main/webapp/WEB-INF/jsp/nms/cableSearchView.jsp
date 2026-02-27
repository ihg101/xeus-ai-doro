<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../common.jsp" %>
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
	//TODO themeLoad
// 	LayerConst.ThemeLoad("asset_fnms");
	//Public.NMS.RainFall.Stop();
	//Public.NMS.WaterPump.Stop();
	//GMXMAP.setLayerVisible("asset_cctv", false);//.setVisible(false);
	//SYMBOL_TEXT_CHK[parentView]["cctv"] = false;
	//SYMBOL_TEXT_CHK[parentView]["infra"] = false;
	//if(xeusSymbolCctv) xeusSymbolCctv.clear();
	//if(xeusSymbolInfra) xeusSymbolInfra.clear();
	//if(xeusSymbolInfraCctv) xeusSymbolInfraCctv.clear();
	//if(xeusSymbolInfraWifi) xeusSymbolInfraWifi.clear();
	//if(xeusSymbolInfraLora) xeusSymbolInfraLora.clear();
	//GMXMAP.setLayerVisible("asset_pump", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_pump_sec", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_rainfall", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_netwk_wifi", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_netwk_cctv", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_netwk_lora", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_infra_cctv", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_infra_wifi", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_infra_lora", false);//.setVisible(false);
	//GMXMAP.setLayerVisible("asset_infra", false);//.setVisible(true);
	GMXMAP.setLayerVisible("asset_fnms", true);//.setVisible(true);
	//TODO 케이블 수정 밑에 범례가 나와야하는데, 임시방편으로 일단 범례 diolog를 띄어줌
// 	XeusLayer.createLegend("#legendWrap");
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
	if(!$(".contentWrapper").find("#nmsView-기반시설").prop("checked")) $(".contentWrapper").find("#nmsView-기반시설").click();

	$(".contentWrapper").find("#selectBtn").click(function(){
		Public.NMS.Cable.EditStart();
	});

	$(".contentWrapper").find("#drawCncl").click(function(){
		if(Public.StopEvent) Public.StopEvent();
		$(".contentWrapper").find("#drawCncl").hide("slow");
	});

	$(".contentWrapper").find("#saveBtn").click(function(){
		confirm("내용을 저장하시겠습니까?", function(){
			var _param = _common.utils.collectSendData(".contentWrapper #searchTable");
			if(_param.gid != ""){
				if(!_common.utils.isNullAndEmpty(_param.themeMgrNo)){
					_common.callAjax("/netwk/editCable.json", _param, function(json){
		                if(json.result){
		                    alert("수정되었습니다.");
		                    //$(".contentWrapper").find(".sendData").val("");
		                    $(".contentWrapper").find(".wide").val("");
		                    $(".contentWrapper").find("#lineColor").css("stroke", '#000000');
		                    $(".contentWrapper").find("#lineColor").css("stroke-dasharray", '');
		                    $(".contentWrapper").find("#drawCncl").hide("slow");
		                    Public.StopEvent();
		                    //LayerConst.ThemeLoad("asset_nms");
		                    LayerConst.ThemeLoad("asset_fnms");
		                    XeusLayer.createLegend("#legendWrap");
		                    //Layers["asset_nms"].reload();
		                    Layers["asset_fnms"].reload();
		                }
		            }, false);
				} else{
					alert('케이블테마를 선택하여 주십시오.');
				}
			}else{
				alert('케이블을 선택하여 주십시오.');
			}
		});
	});

	//케이블 테마를 가져와 테마 리스트를 생성한다.
	_common.callAjax("/netwk/getThemeList.json", {sortCol: 'net_gbn_cd', sortTyp: 'ASC'}, function(json){
        if(json.result){
        	if(json.result.length > 0){
        		for(var i=0; i<json.result.length; i++){
        			var netGbnCd = json.result[i].netGbnCd;
        			var $opt = $('<option value="'+json.result[i].mgrNo+'" gbn="'+netGbnCd+'">'+json.result[i].themeNm+'</option>').data(json.result[i]);//class="hidden"
        			$(".contentWrapper").find('#themeMgrNo').append($opt);
				}
        		//hidden이어도 가장 최상단 항목이 선택되므로 처리.
        		 $(".contentWrapper").find('#themeMgrNo').val('').attr('select');

        		 $(".contentWrapper").find('#themeMgrNo').on('blur change', function(){
					var val = $(this).val();
					if(val){
						var data = $(this).find('option[value="'+val+'"]').data();
						var cableTyp = "";
						if(data.cableTyp == "1") cableTyp = "실선";
						if(data.cableTyp == "2") cableTyp = "점선";
						 $(".contentWrapper").find('#netNm').val(_common.utils.validNull(data.themeNm));
	                     $(".contentWrapper").find('#ringNo').val(_common.utils.validNull(data.ringNo));
	                    // $(".contentWrapper").find('#cableTyp').val(_common.utils.validNull(data.cableTyp));
	                    // $(".contentWrapper").find('#lineColor').val(_common.utils.validNull(data.lineColor));
	                     $(".contentWrapper").find('#cableTyp').val(cableTyp);
	                     $(".contentWrapper").find('#lineColor').css('stroke', _common.utils.validNull(data.lineColor));
	                     $(".contentWrapper").find('#linkGbnCd').css('stroke', _common.utils.validNull(data.linkGbnCd));
	                    if(data.cableTyp == "1")	 $(".contentWrapper").find('#lineColor').css('stroke-dasharray', '');
	                    if(data.cableTyp == "2")	 $(".contentWrapper").find('#lineColor').css('stroke-dasharray', '10, 4');
					}
			    });

        	} else {
        		var $opt = $('<option value="">테마를 등록하여 주십시오.</option>');
        		 $(".contentWrapper").find('#themeMgrNo').append($opt);
        	}
        }
    }, false);

	//망 구분이 바뀔 시 테마 목록의 visible을 설정한다.
	/*  $(".contentWrapper").find('#netGbnCd').on('blur change', function(){
		var netGbnCd = $(this).val();

		//입력되있는 값을 초기화한다.
		 $(".contentWrapper").find('#netNm').val('');
         $(".contentWrapper").find('#ringNo').val('');
         $(".contentWrapper").find('#cableTyp').val('');
         $(".contentWrapper").find('#lineColor').val('');
         $(".contentWrapper").find('#linkGbnCd').val('');

		 $(".contentWrapper").find('#themeMgrNo').find('option').hide();
		 $(".contentWrapper").find('#themeMgrNo').val('').attr('select');
		if (netGbnCd)
			 $(".contentWrapper").find('#themeMgrNo').find('option[gbn='+netGbnCd+']').show();
    }); */

	//Public.NMS.RainFall.Stop();
	//Public.NMS.WaterPump.Stop();
})();
</script>
<div class="overflow contentWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">
	<div id="searchTable" class="box_style">
		<div class="info_box hidden" style="display: none;">
			<span class="title">GID</span>
			<input type="text" id="gid" name="gid" class="wide sendData">
		</div>
		<div class="info_box hidden" style="display: none;">
			<span class="title">WKT</span>
			<input type="text" id="wkt" name="wkt" class="wide sendData">
		</div>
		<div class="info_box hidden" style="display: none;">
			<span class="title">케이블 이름</span>
			<input type="text" id="netNm" name="netNm" class="wide">
		</div>
		<div class="info_box hidden" style="display: none;">
			<span class="title">망구분</span>
			<select id="netGbnCd" name="netGbnCd" class="wide">
                    <option value=""></option>
<% while(netItr.hasNext()){
    String str = (String) netItr.next(); %>
                    <option value="<%= str %>"><%= net.get(str) %></option>
<% } %>
                </select>
		</div>
		<div class="info_box">
			<span class="title">케이블 테마</span>
			<select id="themeMgrNo" name="themeMgrNo" class="wide sendData">
                </select>
		</div>
		<div class="info_box">
			<span class="title">배선방식</span>
			<input type="text" id="linkGbnCd" name="linkGbnCd" class="wide" readonly="readonly">
		</div>
		<div class="info_box">
			<span class="title">링번호</span>
			<input type="text" id="ringNo" name="ringNo" class="wide" readonly="readonly">
		</div>
		<div class="info_box hidden" style="display: none;">
			<span class="title">케이블 종류</span>
			<input type="text" id="cableTyp" name="cableTyp" class="wide" readonly="readonly">
		</div>
		<div class="info_box">
			<span class="title">선 색상</span>
			<svg style="vertical-align: middle; height: 7px; width: 98%; margin-left: 5px;">
					<line id="lineColor" x1="98%" y1="0" style="stroke:'#000000';stroke-width:85%;"></line>
				</svg>
		</div>
		<div class="info_box wd100">
			<span class="title">케이블 설명</span>
			<input type="text" id="cableDesc" name="cableDesc" class="wide sendData">
		</div>
		<p id="drawCncl" class="hidden pointer">수정을 종료하시려면 여기를 눌러주세요.</p>
	</div>
	<button class="blackBtn_Fill btn_style2" id="selectBtn">케이블 선택</button>
    <button class="blackBtn_Fill btn_style2" id="saveBtn">내용저장</button>
    <h3 class="title">범례</h3>
    <div id="legendWrap"></div>

</div>