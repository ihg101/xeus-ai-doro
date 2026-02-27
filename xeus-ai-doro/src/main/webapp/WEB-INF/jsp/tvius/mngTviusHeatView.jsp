<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

	/* CD51 // 8대중과실 */
	HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
	Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
	Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");
%>
<%-- <script type="text/javascript" src="<%=context%>/res/geomex.xeus.tvius.mng.rqst.view.js"></script> --%>
<script type="text/javascript">

/* xeusLayout.mapService.Layers = {
	RQST : null
}; */



$(".contentWrapper").find(".allChk").change(function(){
	var target = $(this).attr("for");

	if($(this).is(":checked"))
		$(".contentWrapper").find('.'+target).prop('checked', true);
	else
		$(".contentWrapper").find('.'+target).prop('checked', false);
});

$(".contentWrapper").find("label").click(function(){
	$(this).prev().click();
});

$(".contentWrapper").find("#searchBtn").click(function(){
	var startDat = $(".contentWrapper").find("#startDat").val().replace(/\-/gi, '').trim();
	var endDat = $(".contentWrapper").find("#endDat").val().replace(/\-/gi, '').trim();
	if(startDat != "") startDat += '000000';
	if(endDat != "") endDat += '235959';

	var reqGbn = new Array();
	$(".contentWrapper").find(".reqGbn").each(function(){
		if($(this).is(":checked")) reqGbn.push($(this).attr("for"));
	});

	if(reqGbn.length == 0){
		alert('신청유형을 선택하여 주십시오.');
		return false;
	}

	var crimeTyp = new Array();
	$(".contentWrapper").find(".crimeTyp").each(function(){
		if($(this).is(":checked")) crimeTyp.push($(this).attr("for"));
	});

	if(crimeTyp.length == 0){
		alert('범죄유형을 선택하여 주십시오.');
		return false;
	}



	if(crmsHeatLayer == null){
		//TODO createHeatLayer생성
// 		crmsHeatLayer = GMXMAP.createHeatLayer(Layers["v_asset_cctv_heat"]);
// 		crmsHeatLayer.setVisible(false);
// 		GMXMAP.addLayer(crmsHeatLayer);
	}

	var _param = {};
	//_param["crimeTyp"] = crimeTyp.toString();
	//_param["reqGbn"] = reqGbn.toString();
	_param["crimeTyp"] = crimeTyp.join('{|}');
	_param["reqGbn"] = reqGbn.join('{|}');
	_param["startDat"] = startDat;
	_param["endDat"] = endDat;

	_common.callAjax("/tvius/getHeatList.json", _param, function(json) {
		if (json.result){
			var $target = $(".contentWrapper").find("#searchResult");
			$target.html('');

			var str = '';
			if(json.result.length == 0){
				str = '<tr><td colspan="2" class="tCenter">검색결과가 존재하지 않습니다.</td></tr>';
			}else {
				for(var i=0; i<json.result.length; i++)
					str +='<tr><td class="tCenter">'+json.result[i].crimeTyp+'</td><td class="tCenter">'+json.result[i].cnt+'</td></tr>';
			}
			$target.append(str);
		}
	});

	/* xeusLayout.mapService.getLayerByName(Layers["영상반출 분포도"]).getSource().clear();
	Layers["v_asset_cctv_heat"].loadFunction(xeusLayout.mapService.getLayerByName(Layers["영상반출 분포도"]), crimeTyp.toString(), reqGbn.toString(), startDat, endDat);
	xeusLayout.mapService.Layers.RQST.setVisible(true); */
//TODO
// 	crmsHeatLayer.getSource().clear();
// 	Layers["v_asset_cctv_heat"].loadFunction(crmsHeatLayer, crimeTyp.toString(), reqGbn.toString(), startDat, endDat);
// 	crmsHeatLayer.setVisible(true);

});

//xeusLayout.mapService.getLayerByName(Layers["영상반출 분포도"]).getSource().clear()
</script>

<div class="contentWrapper customScroll" data-mcs-theme="minimal-dark">

    <h3 class="title">반출 통계</h3>
    <span class="ui-helper-hidden-accessible"><input type="text"/></span>
	<div id="searchTable" class="box_style">
    	<div class="info_box wd100">
    		<span class="title">기간</span>
    		<input type="date" id="startDat" size="12">
                ~
            <input type="date" id="endDat" size="12">
    	</div>
    	<div class="info_box wd100">
    		<span class="title">신청 유형</span>
			<div class="box2">
				<input type="checkbox" class="allChk" for="reqGbn">
                <label>전체선택</label>
<%
    while (chkReqGbnCdItr.hasNext()) {
        String str = (String) chkReqGbnCdItr.next();
%>
                <input type="checkbox" class="reqGbn" for="<%= chkReqGbnCd.get(str) %>">
                <label<%--  for="<%=str%>" --%>><%= chkReqGbnCd.get(str) %></label>
<%
    }
%>
			</div>
    	</div>
    	<div class="info_box wd100">
    		<span class="title">범죄유형</span>
			<div class="box2">
				    		                <input type="checkbox" class="allChk" for="crimeTyp">
                <label>전체선택</label>
<%
    int i=0;
    while (chkCrimeTypItr.hasNext()) {
        String str = (String) chkCrimeTypItr.next();
%>
                <input type="checkbox" class="crimeTyp" for="<%= chkCrimeTyp.get(str) %>">
                <label><%= chkCrimeTyp.get(str) %></label>
<%
        if(i%4 == 3)
%>
                <br>
<%
        i++;
    }
%>
			</div>
    	</div>
    	<button class="btn_style" id="searchBtn">검색</button>
    </div>
    <h3 class="title">검색결과</h3>
    <table>
        <thead>
            <tr>
                <th>범죄유형</th>
                <th>반출횟수</th>
            </tr>
        </thead>
        <tbody id="searchResult"></tbody>
    </table>
</div>
