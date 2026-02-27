<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.InfraVo"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C12");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<SiteVo> site = (ArrayList<SiteVo>) request.getAttribute("site");
ArrayList<ImageVo> img = (ArrayList<ImageVo>) request.getAttribute("img");
ArrayList<String> symList = (ArrayList<String>) request.getAttribute("sym");
HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");

InfraVo vo = (InfraVo) request.getAttribute("result");
%>
<script>
/* 심볼선택 ul 이벤트입니다. */
$("#nmsView").find("#selectable").selectable({
    selecting: function(event, ui){
        if($("#nmsView").find(".ui-selected, .ui-selecting").length > 1){
            $(ui.selecting).removeClass("ui-selecting");
        }
        try{
	        var img = $(ui.selecting).attr("img");
	        $("#nmsView").find("#symCd").val(img.split(".")[0]);
        }catch(e){

        }
    }
});

$("#nmsView").find("#selectable").find("li").click(function(){
	$(this).addClass("selected").siblings().removeClass("selected");
});

/* 이미지 새탭으로 보기 이벤트 입니다. */
$("#nmsView").find("#imgWrapper").find(".imgs").click(function(){
    var param = {"mgrSeq" : $(this).attr("k")};
    _common.postForm.open("/image/getImage.do", param);
});

/* 이미지 삭제 이벤트 입니다. */
$("#nmsView").find(".imgBox").find(".close").click(function(){
    var $span = $(this).parent();
    var param = {"mgrSeq" : $(this).attr("k")};
    confirm("이미지를 삭제하시겠습니까?", function(){
    	_common.callAjax("/image/del.json", param, function(json){
            if(json.result) $span.remove();
        });
    });
});

/* 지도에서 위치설정 이벤트 입니다. */
$("#nmsView").find(".searchWrapper").find("#mapClickBtn").click(function(){
    $("body").css("cursor", "crosshair");
    $("#nmsView").find(".selectCancel").show(500);
    xeusLayout.mapService.getMap().on('click', Public.NMS.Infra.Start);
    Public.StopEvent = function(){
        $("body").css("cursor", "default").off("click");
        $("#nmsView").find(".selectCancel").hide(500);
        xeusLayout.mapService.getMap().un('click', Public.NMS.Infra.Start);
    }
});
$("#nmsView").find(".searchWrapper").find(".selectCancel").click(function(){
    Public.StopEvent();
});

/* 사진 추가 버튼 이벤트 입니다. */
$("#nmsView").find(".searchWrapper").find("#uploadBtn").click(function(){
	$("#nmsView").find("#hiddenForm").find("#uploadImg").click();
});

/* 상위 "사진 추가" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
$("#nmsView").find("#hiddenForm").find("#uploadImg").on("change", function(){
    var nm = $(this).val();
    if(nm != ""){
    	confirm("선택하신 파일을 업로드 하시겠습니까?", function(){
    		$("#nmsView").find("#hiddenForm").find("#i").val($(".imgBox").length + 1);
            _common.formSubmit("/image/add.json", $("#nmsView").find("#hiddenForm"), function(json){
                if(json.result){
                    var v = "<%= vo.getMgrNo() %>";

                    _common.callAjax("/nms/getInfraDetailView.do", {"k" : v}, function(view) {
                    	$("#nmsView").find(".detailWrapper").html(view);
                    });
                }
            });
    	}, function(){
    		$("#nmsView").find("#hiddenForm").find("#uploadImg").val("");
    	});
    }
});

/* 내용 저장 버튼 이벤트 입니다. */
$("#nmsView").find(".searchWrapper").find("#editBtn").click(function(){
    var param = _common.utils.collectSendData("#regTable");
    param["mgrNo"] = "<%= vo.getMgrNo() %>";
    param["statChkYn"] = $("#nmsView").find("#statChkYn").is(":checked") ? "Y" : "N";
    param["useYn"] = $("#nmsView").find("#useYn").is(":checked") ? "Y" : "N";

    var lng = $("#nmsView").find("#regTable #lng").val();
    var lat = $("#nmsView").find$("#regTable #lat").val();
    if(!_common.utils.isNullAndEmpty(lng) && !_common.utils.isNullAndEmpty(lat)){
        var epsg = xeusLayout.mapService.getMap().getView().getProjection().getCode();
        var mainCenter = ol.proj.transform([lng, lat], 'EPSG:4326', epsg);
        param["lng"] = mainCenter[0];
        param["lat"] = mainCenter[1];
    }

    _common.callAjax("/nms/editInfra.json", param, function(json){
        if(json.result){
            alert("저장되었습니다.");

            xeusLayout.mapService.getLayerByName("기반시설").getSource().clear();
            $("#nmsView").find("#searchBtn").click();
        }
    });
});

$("#nmsView").find(".searchWrapper").find(".selectCancel").click(function(){
    Public.StopEvent();
});

/* 심볼선택 오프너 이벤트 입니다. */
$("#nmsView").find(".searchWrapper").find("#symToggle").click(function(){
	$("#nmsView").find("#imgWrapper").toggle();
});

/* DatePicker 생성 이벤트입니다. */
$("#nmsView").find(".searchWrapper").find(".datePicker").datepicker("destroy").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yymmdd",
    showButtonPanel: true,
    beforeShowDay: $.datepicker.noBefore
});
</script>
<style>
  #feedback { font-size: 1.4em; }
  #selectable .ui-selecting { background: #3E3F48; }
  #selectable .ui-selected { background: #3E3F48; color: white; }
  #selectable { list-style-type: none; margin: 0; padding: 0; }
  #selectable li { margin: 3px; padding: 1px; float: left; width: 50px; height: 50px; font-size: 4em; text-align: center; }
  .ui-selectable-helper { display: none; }
</style>
<p class="searchTitle">상세정보</p>

<div id="tableWrapper">

	<div class="dropBox" style="font-size: 14px;">원하시는 시설물을 이곳에 드롭 해주세요!</div>

	<table id="regTable">
        <tr>
            <th width="60px">관리기관</th>
            <td colspan="3">
                <select id="orgMgrNo" name="orgMgrNo" class="sendData">
<% for(int i=0; i<orgz.size(); i++){ %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>" <%= (orgz.get(i).getOrgMgrNo().equals(vo.getOrgMgrNo())) ? "selected" : "" %>><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>사이트</th>
            <td colspan="3">
                <select id="siteMgrNo" name="siteMgrNo" class="sendData">
<% for(int i=0; i<site.size(); i++){ %>
                    <option value="<%= site.get(i).getMgrNo() %>" <%= (site.get(i).getMgrNo().equals(vo.getSiteMgrNo())) ? "selected" : "" %>><%= site.get(i).getSiteNm() %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>시설구분</th>
            <td colspan="3">
                <select id="fclGbnCd" name="fclGbnCd" class="sendData">
                    <option value=""></option>
<% while(gbnItr.hasNext()){
    String str = (String) gbnItr.next();
    if("14".equals(str) || "23".equals(str) || "24".equals(str) || "25".equals(str) || "26".equals(str) || "27".equals(str)){
%>
                    <option value="<%= str %>" <%= (str.equals(vo.getFclGbnCd())) ? "selected" : "" %>><%= gbn.get(str) %></option>
<%
    }
%>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>설치일자</th>
            <td colspan="3">
                <input type="text" id="instDat" name="instDat" class="sendData datePicker" value="<%= StrUtil.chkNull(vo.getInstDat()) %>" readonly="readonly">
            </td>
        </tr>
        <tr>
            <th>시설명</th>
            <td colspan="3">
                <input type="text" id="facilityNm" name="facilityNm" class="sendData" value="<%= StrUtil.chkNull(vo.getFacilityNm()) %>">
            </td>
        </tr>
        <tr>
            <th>심볼</th>
            <td colspan="3">
                <input type="text" id="symCd" name="symCd" class="hidden sendData">
                <button class="blackBtn wide" id="symToggle">심볼 선택</button>
            </td>
        </tr>
        <%-- <tr class="hidden" id="imgWrapper">
            <th>심볼<br>선택</th>
            <td colspan="3">
                <ol id="selectable">
<% for(int i=0; i<symList.size(); i++){
	String symCd = vo.getSymCd() + symList.get(i).substring(3);
%>
                    <li class="ui-state-default <%= (symList.get(i).equals(symCd)) ? "ui-selected selected" : "" %>" img="<%= symList.get(i) %>">
                        <img src="../res/sym/nms/<%= symList.get(i) %>">
                    </li>
<% } %>
                </ol>
            </td>
        </tr> --%>
        <tr>
            <th>IP</th>
            <td>
                <input type="text" id="ipAddr" name="ipAddr" class="sendData" value="<%= StrUtil.chkNull(vo.getIpAddr()).trim() %>">
            </td>
            <th>PORT</th>
            <td>
                <input type="text" id="portNum" name="portNum" class="sendData" value="<%= StrUtil.chkNull(vo.getPortNum()) %>">
            </td>
        </tr>
        <tr>
            <th>옵션</th>
            <td colspan="3">
                <input type="checkbox" id="statChkYn" name="statChkYn" class="sendData" <%= ("Y".equals(vo.getStatChkYn())) ? "checked" : "" %>>상태
                <input type="checkbox" id="useYn" name="useYn" class="sendData" <%= ("Y".equals(vo.getUseYn())) ? "checked" : "" %>>사용
            </td>
        </tr>
        <tr>
            <th>접속ID</th>
            <td>
                <input type="text" id="conId" name="conId" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>접속암호</th>
            <td>
                <input type="text" id="conPwd" name="conPwd" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>SNMP인증문자</th>
            <td>
                <input type="text" id="snmpStr" name="snmpStr" class="wide sendData">
            </td>
        </tr>
        <tr>
            <th>비고</th>
            <td colspan="3">
                <input type="text" id="rmark" name="rmark" class="sendData" value="<%= StrUtil.chkNull(vo.getRmark()) %>">
            </td>
        </tr>
        <tr>
            <th>경도</th>
            <td>
                <input type="text" id="lng" name="lng" class="sendData" value="<%= StrUtil.chkNull(vo.getLng()) %>">
            </td>
            <th>위도</th>
            <td>
                <input type="text" id="lat" name="lat" class="sendData middle" value="<%= StrUtil.chkNull(vo.getLat()) %>">
                <button class="blackBtn" id="mapClickBtn">지도에서 선택</button>
            </td>
        </tr>
        <tr>
            <th colspan="4" class="pointer tCenter hidden selectCancel">선택을 취소하려면 여기를 눌러주세요.</th>
        </tr>
        <tr>
            <th>위치설명</th>
            <td colspan="3">
                <input type="text" id="locDesc" name="locDesc" class="sendData" value="<%= StrUtil.chkNull(vo.getLocDesc()) %>">
            </td>
        </tr>
        <tr>
            <th colspan="6">현장사진</th>
        </tr>
        <tr class="tCenter" height="40%">
            <td colspan="6" id="imgWrapper">
                <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
                    <input type="text" name="k" id="k" class="hidden" value="<%= vo.getMgrNo() %>">
                    <input type="text" name="i" id="i" class="hidden" value="0">
                    <!-- <input type="text" name="p" id="p" class="hidden" value="\upload\nms\"> -->
                    <input type="text" name="p" id="p" class="hidden" value="\nms\">
                    <input type="file" name="uploadImg" id="uploadImg" class="hidden" accept="image/gif, image/jpeg, image/png">
                </form>
                <!-- <p>참고) 사진 삭제, 추가시 해당 점검에 바로 저장됩니다.</p> -->
<% if(img == null){ %>
                <p style="padding: 150px 0px;"><b>이미지가 존재하지 않습니다.</b></p>
<% }else{ %>
    <% for(int i=0; i<img.size(); i++){ %>
                <span class="imgBox">
                    <img class="imgs" alt="<%= img.get(i).getFileNm() %>" src="../image/getImage.do?mgrSeq=<%= img.get(i).getMgrSeq() %>" k="<%= img.get(i).getMgrSeq() %>">
                    <img class="close" src="../res/img/close.png" k="<%= img.get(i).getMgrSeq() %>">
                </span>
    <% } %>
<% } %>
            </td>
        </tr>
        <tr class="tCenter">
            <td colspan="6">
                <button class="blackBtn" id="uploadBtn">사진 추가</button>
                <button class="blackBtn" id="editBtn">내용 저장</button>
            </td>
        </tr>
    </table>
</div>