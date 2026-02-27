<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C14");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");

SiteVo vo = (SiteVo) request.getAttribute("result");

ArrayList<CctvVo> cctv = (ArrayList<CctvVo>) request.getAttribute("cctv");
ArrayList<ArrayList<ImageVo>> imgList = (ArrayList<ArrayList<ImageVo>>) request.getAttribute("img");
%>
<script>
/* 위치 버튼 이벤트 입니다. */
$("#bottomWrapper").find(".locBtn").click(function(){
    var v = $(this).parent().attr("k");
    _common.callAjax("/nms/getGeometryLocation.json", {k : v}, function(json) {
        xeusLayout.mapService.moveToAnimation(0, [json.result[0].annoX, json.result[0].annoY]);
    });
});

/* 삭제 버튼 이벤트 입니다. */
$("#bottomWrapper").find(".delBtn").click(function(){
	var $this = $(this);
    var v = $(this).parent().attr("k");
    confirm("사이트에서 해당 CCTV를 제외하겠습니까?\n\nCCTV 데이터는 물리적으로 삭제되지 않습니다.", function(){
    	_common.callAjax("/nms/delSiteInnerCctv.json", {k : v}, function(json) {
            if(json.result) $this.parent().parent().parent().remove();
        });
    });
});

/* 명칭 엔터키 이벤트 입니다. */
$("#bottomWrapper").find("#cctvNm").keyup(function(e){
    if(e.which == 13){
        $("#bottomWrapper").find("#searchBtn").click();
    }
});

/* 검색 버튼 이벤트 입니다. */
$("#bottomWrapper").find("#searchTable").find("#searchBtn").click(function(){
	var param = _common.utils.collectSendData("#bottomWrapper #searchTable");
    _common.callAjax("/nms/getCctvList.json", param, function(json) {
        var $elem = $("#bottomWrapper").find("#resultList").find("table").html("");
        for(var i=0; i<json.result.length; i++){
        	var k = json.result[i].mgrNo;
        	var sk = "<%= vo.getMgrNo() %>";
        	var $tr = $("<tr class='tCenter'></tr>");

        	$tr.append("<td width='40px'>CCTV</td>")
        	   .append("<td>" + json.result[i].cctvNm + "</td>")
        	   .append("<td width='75px'><button class='blueBtn addSiteInnerCctv' k='" + k + "' sk='" + sk + "'>추가</button></td>");

        	$elem.append($tr);
        }

        $("#bottomWrapper").find("#resultList").find(".addSiteInnerCctv").click(function(){
            var k = $(this).attr("k");
            var sk = $(this).attr("sk");
            var nm = $(this).parent().prev().text();

            confirm(nm + " CCTV를 사이트에 추가하시겠습니까?", function(){
            	_common.callAjax("/nms/editSiteCctv.json", {"mgrNo" : k, "siteMgrNo" : sk}, function(json) {
                    if(json.result) $(".bottomTab").find("button.tab").eq(1).click();
                }, false);
            });
        });
    }, false);
});

/* 대표카메라 설정 이벤트 입니다. */
$("#bottomWrapper").find("input.reqMgrNo").change(function(){
	$("#bottomWrapper").find("input.reqMgrNo").prop("checked", false);
	$(this).prop("checked", true);

	var nm = $(this).parent().prev().prev().prev().text();
	var k = $(this).parent().attr("k");
	var sk = $(this).parent().attr("sk");
    var param = {
		"repMgrNo" : k,
		"mgrNo" : sk
    };

    confirm(nm + " CCTV를 대표 카메라로 설정하시겠습니까?", function(){
    	_common.callAjax("/nms/editSite.json", param, function(json) {
            if(json.result) alert("설정되었습니다.");
        }, false);
    });
});
</script>
    <p class="searchTitle">CCTV 검색</p>
    <table id="searchTable">
        <tr>
            <th>읍면동</th>
            <td>
                <select id="emdCd" name="emdCd" class="sendData">
                    <option value="">전체</option>
<% for(int i=0; i<emd.size(); i++){ %>
                    <option value="<%= emd.get(i).getEmdCd() %>"><%= emd.get(i).getEmdKorNm() %></option>
<% } %>
                </select>
            </td>
            <th>관리기관</th>
            <td>
                <select id="orgMgrNo" name="orgMgrNo" class="sendData">
                    <option value="">전체</option>
<% for(int i=0; i<orgz.size(); i++){ %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
            <th>설치목적</th>
            <td>
                <select id="gbnCd" name="gbnCd" class="wide sendData">
                    <option value="">전체</option>
<% while(gbnItr.hasNext()){
    String str = (String) gbnItr.next(); %>
                    <option value="<%= str %>"><%= gbn.get(str) %></option>
<% } %>
                </select>
            </td>
            <th>명칭</th>
            <td>
                <input type="text" id="cctvNm" name="cctvNm" class="sendData">
            </td>
            <td>
                <button class="blueBtn" id="searchBtn">검색</button>
            </td>
        </tr>
    </table>

    <p class="searchTitle">검색결과</p>
    <table>
        <tr>
            <th width="40px">구분</th>
            <th>명칭</th>
            <th width="110px">추가</th>
        </tr>
    </table>
    <div id="resultList" style="height: 100px;">
        <table></table>
    </div>

    <p class="searchTitle">사이트 내 CCTV 목록</p>
<% if(cctv != null && cctv.size() > 0){ %>
<%    for(int i=0; i<cctv.size(); i++){
         String checked = "";
         if(vo.getRepMgrNo() != null){
        	 if(vo.getRepMgrNo().equals(cctv.get(i).getMgrNo())){
        		 checked = "checked";
        	 }
         }
%>
	<table>
	    <tr>
	        <th>명칭</th>
	        <td colspan="3"><%= StrUtil.chkNull(cctv.get(i).getCctvNm()) %></td>
	        <th>설치목적</th>
	        <td colspan="2"><%= cde.convertCodeToName("C14", cctv.get(i).getGbnCd()) %></td>
	        <td k="<%= cctv.get(i).getMgrNo() %>" sk="<%= vo.getMgrNo() %>">
	            <input type="checkbox" class="reqMgrNo" <%= checked %>>대표카메라
	            <button class="blueBtn locBtn">위치</button>
	            <button class="blueBtn delBtn">삭제</button>
	        </td>
	    </tr>

	    <tr>
	        <th>모델</th>
	        <td colspan="3"></td>
	        <td colspan="4">
	            <input type="checkbox" <%= ("Y".equals(cctv.get(i).getPanYn()))? "selected" : "" %> disabled="disabled">회전
	            <input type="checkbox" <%= ("Y".equals(cctv.get(i).getTiltYn()))? "selected" : "" %> disabled="disabled">틸트
	            <input type="checkbox" <%= ("Y".equals(cctv.get(i).getZoomYn()))? "selected" : "" %> disabled="disabled">줌
	            <input type="checkbox" <%= ("Y".equals(cctv.get(i).getTalkYn()))? "selected" : "" %> disabled="disabled">음성
                <input type="checkbox" <%= ("Y".equals(cctv.get(i).getTourYn()))? "selected" : "" %> disabled="disabled">투어링
	            <input type="checkbox" <%= ("Y".equals(cctv.get(i).getLightYn()))? "selected" : "" %> disabled="disabled">조명
	            <input type="checkbox" <%= ("Y".equals(cctv.get(i).getInfrdYn()))? "selected" : "" %> disabled="disabled">적외선
	        </td>
	    </tr>

	    <tr>
	        <th>설치일자</th>
	        <td><%= DateUtil.formatDate(cctv.get(i).getInstDat()) %></td>
	        <th>사업년도</th>
	        <td><%= DateUtil.formatDate(cctv.get(i).getConstYear()) %></td>
	        <th>사업명</th>
	        <td colspan="3"><%= StrUtil.chkNull(cctv.get(i).getConstNm()) %></td>
	    </tr>

	    <tr>
	        <th>IP/PORT</th>
<% String ipAndPort = StrUtil.chkNull(cctv.get(i).getIpAddr()); %>
<% if(!"".equals(ipAndPort)) ipAndPort += ":" + StrUtil.chkNull("" + cctv.get(i).getPortNum()); %>
	        <td><%= ipAndPort %></td>
	        <th>계정ID</th>
	        <td><%= StrUtil.chkNull(cctv.get(i).getConId()) %></td>
	        <th>경도</th>
	        <td><%= StrUtil.chkNull(cctv.get(i).getLng()) %></td>
	        <th>위도</th>
	        <td><%= StrUtil.chkNull(cctv.get(i).getLat()) %></td>
	    </tr>

	    <tr>
	        <th>주소</th>
	        <td colspan="3"><%= StrUtil.chkNull(cctv.get(i).getAddr()) %></td>
	        <th>위치설명</th>
	        <td colspan="3"><%= StrUtil.chkNull(cctv.get(i).getLocDesc()) %></td>
	    </tr>

        <tr>
	        <th colspan="8">현장사진</th>
        </tr>
	    <tr class="tCenter" height="40%">
	        <td id="imgWrapper" colspan="8">
<% if(imgList == null || imgList.size() == 0){ %>
	            <p style="padding: 100px 0px;"><b>이미지가 존재하지 않습니다.</b></p>
<% }else{ %>
<%		ArrayList<ImageVo> img = imgList.get(i); %>
<%			if(img.size() == 0){ %>
	            <p style="padding: 20px 0px;"><b>이미지가 존재하지 않습니다.</b></p>
<%              continue; %>
<%          }else{ %>
<%              for(int l=0; l<img.size(); l++){ %>
	            <span class="imgBox">
	                <img class="imgs" alt="<%= img.get(l).getFileNm() %>" src="../image/getImage.do?mgrSeq=<%= img.get(l).getMgrSeq() %>" k="<%= img.get(l).getMgrSeq() %>">
	            </span>
<%          } %>
<%		} %>
<% } %>
	        </td>
	    </tr>
	</table>
<%    } %>
<% }else{ %>
    <p style="padding: 100px 0px;" class="tCenter"><b>등록된 CCTV가 존재하지 않습니다.</b></p>
<% } %>