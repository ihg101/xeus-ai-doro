<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.equipmgr.service.AcsryVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.SiteVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("map");

HashMap<String, String> gbn = cde.convertCodeGrpToAllCde("C11");
Set<String> gbnKey = gbn.keySet();
Iterator<String> gbnItr = gbnKey.iterator();

ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
ArrayList<EmdVo> emd = (ArrayList<EmdVo>) request.getAttribute("emd");

ArrayList<AcsryVo> list = (ArrayList<AcsryVo>) request.getAttribute("result");
%>
<script>
/* 사진 추가 버튼 이벤트 입니다. */
$("#bottomWrapper").find("#uploadBtn").click(function(){
    $("#hiddenForm").find("#uploadImg").click();
});

/* 이미지 새탭으로 보기 이벤트 입니다. */
$("#bottomWrapper").find(".imgs").click(function(){
    var param = {"mgrSeq" : $(this).attr("k")};
    _common.postForm.open("/image/getImage.do", param);
});

/* 등록 버튼 이벤트 입니다. */
$("#bottomWrapper").find("#regBtn").click(function(){
	var param = _common.utils.collectSendData("#bottomWrapper #regTable");
	param["instDat"] = param["instDatTemp"];
	param["siteMgrNo"] = "<%= map.get("siteMgrNo") %>";
	delete param["instDatTemp"];
	if(_common.utils.isNullAndEmpty(param["atchdFclNm"])){
		alert("시설명을 입력해 주세요.");
		$("#bottomWrapper").find("#regTable").find("#atchdFclNm").focus();
		return false;
	}

	confirm("부속시설을 추가하시겠습니까?", function(){
		_common.callAjax("/nms/addAcsry.json", param, function(json){
            if(json.result){
                var k = json.mgrNo;
                var nm = $("#hiddenForm").find("#uploadImg").val();
                if(nm != "" && !_common.utils.isNullAndEmpty(k)){
                    $("#hiddenForm").find("#k").val(k);
                    $("#hiddenForm").find("#i").val(1);
                    _common.formSubmit("/image/add.json", $("#hiddenForm"), function(json){
                        if(json.result){
                            $(".bottomTab").find("button.tab").eq(2).click();
                        }else{
                            alert("이미지 저장을 실패하였습니다.");
                        }
                    });
                }else{
                    $(".bottomTab").find("button.tab").eq(2).click();
                }
            }
        }, false);
	});
});

/* 삭제 버튼 이벤트 입니다. */
$("#bottomWrapper").find(".delBtn").click(function(){

    var k = $(this).attr("k");
    var delHis = false;
    var delImg = false;

    confirm("부속시설을 삭제하시겠습니까?\n삭제시 관련 이미지가 함께 삭제됩니다.", function(){
    	_common.callAjax("/image/del.json", {"refMgrNo" : k}, function(json){
            delImg = json.result;
            _common.callAjax("/nms/delAcsry.json", {"k" : k}, function(json){
                delHis = json.result;
            }, false);
        }, false);

        if(delHis && delImg){
            alert("삭제되었습니다.");

            $(".bottomTab").find("button.tab").eq(2).click();
        }else if(!delHis || !delImg){
            var msg = "";
            if(!delHis) msg = "부속시설 삭제를 실패하였습니다.\n관리자에게 문의하여 주십시오.";
            if(!delImg) msg = "부속시설이 삭제되었으나 이미지삭제에 실패하였습니다.\n관리자에게 문의하여 주십시오.";
            if(!delHis && !delImg) msg = "부속시설 및 이미지 삭제에 실패하였습니다.\n관리자에게 문의하여 주십시오.";

            alert(msg);
        }
    });
});

/* DatePicker 생성 이벤트입니다. */
$("#bottomWrapper").find(".datePicker").datepicker("destroy").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yymmdd",
    showButtonPanel: true,
    beforeShowDay: $.datepicker.noBefore
});
</script>
    <p class="searchTitle">부속시설 등록</p>
    <table id="regTable">
        <tr>
            <th>시설구분</th>
            <td>
                <select id="fclGbnCd" name="fclGbnCd" class="wide sendData">
                    <option value=""></option>
<% while(gbnItr.hasNext()){
    String str = (String) gbnItr.next(); %>
                    <option value="<%= str %>"><%= gbn.get(str) %></option>
<% } %>
                </select>
            </td>
            <th>관리기관</th>
            <td>
                <select id="orgMgrNo" name="orgMgrNo" class="sendData">
                    <option value=""></option>
<% for(int i=0; i<orgz.size(); i++){ %>
                    <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
            <th>시설명</th>
            <td>
                <input type="text" id="atchdFclNm" name="atchdFclNm" class="sendData">
            </td>
            <th>설치일자</th>
            <td>
                <input type="text" id="instDatTemp" name="instDatTemp" class="sendData datePicker" readonly="readonly">
            </td>
        </tr>
        <tr>
            <th>제조사</th>
            <td>
                <input type="text" id="makerNm" name="makerNm" class="sendData">
            </td>
            <th>규격</th>
            <td>
                <input type="text" id="prdtSpec" name="prdtSpec" class="sendData">
            </td>
            <th>이미지</th>
            <td colspan="2">
                <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
                    <input type="text" name="k" id="k" class="hidden" value="">
                    <input type="text" name="i" id="i" class="hidden" value="0">
                    <!-- <input type="text" name="p" id="p" class="hidden" value="\upload\nms\"> -->
                    <input type="text" name="p" id="p" class="hidden" value="\nms\">
                    <input type="file" name="uploadImg" id="uploadImg" class="hidden" accept="image/gif, image/jpeg, image/png">
                </form>
                <button class="blueBtn" id="uploadBtn">사진 추가</button>
            </td>
            <td>
                <button class="blueBtn" id="regBtn">등록</button>
            </td>
        </tr>
    </table>

    <p class="searchTitle">사이트 내 부속시설 목록</p>
    <table>
        <tr>
            <th>구분</th>
            <th>시설명</th>
            <th>설치일자</th>
            <th>관리기관</th>
            <th>제조사</th>
            <th>규격</th>
            <th>이미지</th>
            <th>삭제</th>
        </tr>
<%
if(list.size() > 0){
    for(int i=0; i<list.size(); i++){
%>
        <tr class="tCenter">
            <td><%= cde.convertCodeToName("C11", list.get(i).getFclGbnCd()) %></td>
            <td><%= list.get(i).getAtchdFclNm() %></td>
            <td><%= DateUtil.formatDate(list.get(i).getInstDat().trim()) %></td>
<%
	String orgzVal = list.get(i).getOrgMgrNo();
	for(int l=0; l<orgz.size(); l++){
		if(orgz.get(l).getOrgMgrNo().equals(orgzVal)){
			orgzVal = orgz.get(l).getOrgNm();
			break;
		}
	}
%>
            <td><%= orgzVal %></td>
            <td><%= list.get(i).getMakerNm() %></td>
            <td><%= list.get(i).getPrdtSpec() %></td>
<%      if(list.get(i).getMgrSeq() == null){ %>
            <td></td>
<%      }else{ %>
            <td><img class="imgs" width="50px" alt="<%= list.get(i).getFileNm() %>" src="../image/getImage.do?mgrSeq=<%= list.get(i).getMgrSeq() %>" k="<%= list.get(i).getMgrSeq() %>"></td>
<%      } %>
            <td><button class="blueBtn delBtn" k="<%= list.get(i).getMgrNo() %>">삭제</button></td>
        </tr>
<%  } %>
<% } %>
<% if(list.size() == 0){ %>
        <tr>
            <td class="tCenter" colspan="8">
			    <p style="padding: 100px 0px;"><b>등록된 부속시설이 존재하지 않습니다.</b></p>
            </td>
        </tr>
<% } %>

    </table>
