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

	if(GMXLAYER.LayerList["asset_fnms"]){
		GMXMAP.reloadLayerData("asset_fnms")
	}

	$(".contentWrapper").find(".legends").each(function(){
		if($(this).attr("key") == "nmsView-CCTV 목적별"){
			$(this).find("p").find("label").text(" CCTV 목적별_FNMS 작성시 사용");
		}
	});


	$(".contentWrapper").find("#selectBtn").click(function(){
		//테마가 선택되어있지 않으면 리턴
		if(!$(".contentWrapper").find("#themeMgrNo").val()){
			alert('케이블테마를 선택하여 주십시오.');
			return false;
		}
		Public.NMS.Cable.DrawStart("asset_fnms");
		$(".contentWrapper").find("#drawCncl").show("slow");
	});

	$(".contentWrapper").find("#drawCncl").click(function(){
		Public.NMS.Cable.interaction.setActive(false);
		Public.NMS.Cable.snapInteraction.setActive(false);
		//Public.NMS.Cable.modifyInteraction.setActive(true);
		//Public.NMS.Cable.selectInteraction.setActive(true);
		$(".contentWrapper").find("#drawCncl").hide("slow");
	});

	$(".contentWrapper").find("#saveBtn").click(function(){
		if($(".contentWrapper").find("#cableList").find("option").length == 0){
			alert("케이블을 추가해주세요.");
			return false;
		}

	    confirm("선택하신 케이블을 신규추가 하시겠습니까?", function(){

	    	var param = {};
	        $(".contentWrapper").find("#cableList").find("option").each(function(i){
	        	//param["cableList[" + i + "].linkGbnCd"] = $(this).attr("link_gbn_cd");
	            //param["cableList[" + i + "].lineColor"] = $(this).attr("line_color");
	            //param["cableList[" + i + "].cableTyp"] = $(this).attr("cable_typ");
	            //param["cableList[" + i + "].netGbnCd"] = $(this).attr("net_gbn_cd");
	            //param["cableList[" + i + "].netNm"] = $(this).attr("net_nm");
	            param["cableList[" + i + "].cableDesc"] = $(this).attr("cable_desc");
	            param["cableList[" + i + "].stMgrNo"] = $(this).attr("st_mgr_no");
	            param["cableList[" + i + "].edMgrNo"] = $(this).attr("ed_mgr_no");
	            param["cableList[" + i + "].themeMgrNo"] = $(this).attr("theme_mgr_no");
	            param["cableList[" + i + "].wkt"] = $(this).attr("wkt");
	        });

            _common.callAjax("/netwk/addMultipleCable.json", param, function(json){
                if(json.result){
                    alert("저장되었습니다.");
                    //$(".contentWrapper").find(".sendData").val("");
                    $(".contentWrapper").find("#cableDesc").val("");
                    Public.StopEvent();
                    LayerConst.ThemeLoad("asset_fnms");
                    XeusLayer.createLegend("#legendWrap");
                    GMXMAP.reloadLayerData("asset_fnms")
                }
            }, false);

	    });
	});

	$(".contentWrapper").find("#stMgrNoTxt, #edMgrNoTxt").autocomplete({
		source : function( req, res ){
			_common.callAjax("/nms/getInfra.json", { "facilityNm" : req.term }, function(json){
				var length = json.result.length;
				for(var i=0; i<length; i++){
					json.result[i]["label"] = json.result[i].facilityNm;
					json.result[i]["value"] = json.result[i].facilityNm;
				}
				res(json.result);
			});
		},
		minLength: 3,
		select: function(evt, ui){
			var id = evt.target.id;
			var val = ui.item.mgrNo;

			$(".contentWrapper").find("#" + id.replace("Txt", "")).val(val);
		}
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
						$(".contentWrapper").find('#netNm').val(_common.utils.validNull(data.themeNm));
	                    $(".contentWrapper").find('#ringNo').val(_common.utils.validNull(data.ringNo));
	                    $(".contentWrapper").find('#cableTyp').val(_common.utils.validNull(data.cableTyp));
	                    $(".contentWrapper").find('#lineColor').val(_common.utils.validNull(data.lineColor));
	                    $(".contentWrapper").find('#linkGbnCd').val(_common.utils.validNull(data.linkGbnCd));
					}
			    });

        	} else {
        		var $opt = $('<option value="">테마를 등록하여 주십시오.</option>');
        		$(".contentWrapper").find('#themeMgrNo').append($opt);
        	}
        }
    }, false);

	//망 구분이 바뀔 시 테마 목록의 visible을 설정한다.
	/* $(".contentWrapper").find('#netGbnCd').on('blur change', function(){
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

})();
</script>
<style>
#cableList {
	height: 300px;
	-webkit-appearance: none;
}
</style>
<div class="overflow contentWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">
	<div id="searchTable" class="box_style">
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">시작 시설물</span>
    		<input type="text" id="stMgrNoTxt" name="stMgrNoTxt" class="wide">
            <input type="text" id="stMgrNo" name="stMgrNo" class="wide sendData hidden">
    	</div>
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">종료 시설물</span>
    		<input type="text" id="edMgrNoTxt" name="edMgrNoTxt" class="wide">
            <input type="text" id="edMgrNo" name="edMgrNo" class="wide sendData hidden">
    	</div>
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">망구분</span>
    		<select id="netGbnCd" name="netGbnCd" class="">
                    <option value=""></option>
<% while(netItr.hasNext()){
    String str = (String) netItr.next(); %>
                    <option value="<%= str %>"><%= net.get(str) %></option>
<% } %>
                </select>
    	</div>
    	<div class="info_box">
    		<span class="title">케이블 테마</span>
    		<select id="themeMgrNo" name="themeMgrNo" class="sendData"></select>
    	</div>
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">케이블 이름</span>
    		<input type="text" id="netNm" name="netNm" class="wide" readonly="readonly">
    	</div>
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">링번호</span>
    		<input type="text" id="ringNo" name="ringNo" class="wide" readonly="readonly">
    	</div>
    	<div class="info_box">
    		<span class="title">케이블 종류</span>
    		<input type="text" id="cableTyp" name="cableTyp" class="wide" readonly="readonly">
    	</div>
    	<div class="info_box">
    		<span class="title">선 색상</span>
    		<input type="color" id="lineColor" name="lineColor" class="wide" style="height:16px" disabled="disabled">
    	</div>
    	<div class="info_box">
    		<span class="title">배선 방식</span>
    		<input type="text" id="linkGbnCd" name="linkGbnCd" class="wide" readonly="readonly">
    	</div>
    	<div class="info_box wd100">
    		<span class="title">케이블 설명</span>
    		<input type="text" id="cableDesc" name="cableDesc" class="wide sendData">
    	</div>
    </div>
    <table id="searchTable" class="searchTable">
        <tr>
            <th colspan="2">신규 케이블 목록</th>
        </tr>
        <tr>
            <td colspan="2" id="cableListWrapper">
            	<!-- <div class="tCenter">참고) 등록된 케이블은 더블클릭하여 삭제할 수 있습니다.</div> -->
                <select id="cableList" name="cableList" multiple="multiple">
                    <optgroup class="tCenter" label="등록된 케이블은 더블클릭하여 목록에서 제외할 수 있습니다."></optgroup>
                </select>
            </td>
        </tr>
        <tr>
            <th colspan="2" id="drawCncl" class="hidden pointer">그리기를 종료하시려면 여기를 눌러주세요.</th>
        </tr>
        <tr>
            <td colspan="2" class="tCenter noneBack">
                <button class="blackBtn_Fill btn_style2" id="selectBtn" style="width: 45%">케이블 그리기</button>
                <button class="blackBtn_Fill btn_style2" id="saveBtn" style="width: 45%">내용저장</button>
            </td>
        </tr>
    </table>
    <h3 class="title">범례</h3>
    <div id="legendWrap"></div>

</div>