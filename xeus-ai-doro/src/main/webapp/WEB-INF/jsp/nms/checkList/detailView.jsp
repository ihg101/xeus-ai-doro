<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.equipmgr.service.HistoryVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ImageVo"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.equipmgr.service.InfraVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");
ArrayList<ImageVo> img = (ArrayList<ImageVo>) request.getAttribute("img");

HashMap<String, String> chkStat = cde.convertCodeGrpToAllCde("C05");
Set<String> chkStatKey = chkStat.keySet();
Iterator<String> chkStatItr = chkStatKey.iterator();

HashMap<String, String> errTyp = cde.convertCodeGrpToAllCde("C06");
Set<String> errTypKey = errTyp.keySet();
Iterator<String> errTypItr = errTypKey.iterator();

HashMap<String, String> workTyp = cde.convertCodeGrpToAllCde("C07");
Set<String> workTypKey = workTyp.keySet();
Iterator<String> workTypItr = workTypKey.iterator();

String addr = "";
String locDesc = "";
HistoryVo vo = (HistoryVo) request.getAttribute("result");
if(vo != null){
	if("CTV".equals(vo.getFaMgrNo().substring(0, 3))){
		vo.setFaType("CCTV");
		CctvVo cctv = (CctvVo) request.getAttribute("cctv");
		addr = cctv.getAddr();
		locDesc = StrUtil.chkNull(cctv.getLocDesc());
	}
	if("SIT".equals(vo.getFaMgrNo().substring(0, 3))){
		vo.setFaType("사이트");
	}
	if("INF".equals(vo.getFaMgrNo().substring(0, 3))){
		vo.setFaType("기반시설");
		InfraVo infra = (InfraVo) request.getAttribute("infra");
		addr = infra.getAddr();
		locDesc = StrUtil.chkNull(infra.getLocDesc());
	}
	if("ACS".equals(vo.getFaMgrNo().substring(0, 3))){
		vo.setFaType("부속시설");
	}
}

%>
<script>
setTimeout(function(){
    var width = $(document).width() - 340;
    var height = $(document).height() - 160;
    $(".searchResultWrapper").width(width);
    $(".searchResultWrapper").find("#tableWrapper").height(height)
                             .find("table").width("1000")
                             .find("th").click(function(){
                            	 $(this).next().children().focus();
                             });
}, 100);

/* 검색결과 탭 버튼 이벤트 입니다. */
$(".searchTitle").find("button.tab").eq(0).click(function(){
    $('#searchBtn').click();
});

/* 취소요청관리 탭 버튼 이벤트 입니다. */
$(".searchTitle").find("button.tab").eq(1).click(function(){
    _common.callAjax("/nms/getCancelView.do", {}, function(view) {
        $(".searchResultWrapper").html(view);
    });
});

/* 이미지 새탭으로 보기 이벤트 입니다. */
$("#imgWrapper").find(".imgs").click(function(){
	var param = {"mgrSeq" : $(this).attr("k")};
	_common.postForm.open("/image/getImage.do", param);
});

/* 이미지 삭제 이벤트 입니다. */
$("#imgWrapper").find(".close").click(function(){
	var $span = $(this).parent();
	var param = {"mgrSeq" : $(this).attr("k")};
    confirm("이미지를 삭제하시겠습니까?", function(){
    	_common.callAjax("/image/del.json", param, function(json){
            if(json.result){
                $span.remove();
            }
        });
    });
});

/* 사진 추가 버튼 이벤트 입니다. */
$(".searchResultWrapper").find("#uploadBtn").click(function(){
	$("#hiddenForm").find("#uploadImg").click();
});

/* 상위 "사진 추가" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
$("#hiddenForm").find("#uploadImg").on("change", function(){
	var nm = $(this).val();
	if(nm != ""){
		confirm("선택하신 파일을 업로드 하시겠습니까?", function(){
			$("#hiddenForm").find("#i").val($(".imgBox").length + 1);
            _common.formSubmit("/image/add.json", $("#hiddenForm"), function(json){
                if(json.result){
                    <%-- var v = "<%= vo.getFaMgrNo() %>"; --%>
                    var sv = "<%= vo.getFaMgrNo() %>";

                    _common.callAjax("/nms/getHistoryDetailView.do", {/* "mgrNo" : v,  */"faMgrNo" : sv}, function(view) {
                        $(".searchResultWrapper").html(view);
                    });
                }
            });
		}, function(){
			$("#hiddenForm").find("#uploadImg").val("");
		});
	}
});

/* 점검 저장 버튼 이벤트 입니다. */
$(".searchResultWrapper").find("#editBtn").click(function(){
	var param = _common.utils.collectSendData("#tableWrapper");
	<%-- param["mgrNo"] = "<%= vo.getMgrNo() %>"; --%>
	param["faMgrNo"] = "<%= vo.getFaMgrNo() %>";

	_common.callAjax("/nms/editHistoryAttr.json", param, function(json){
        if(json.result){
        	alert("저장되었습니다.");

        	<%-- var v = "<%= vo.getMgrNo() %>"; --%>
            var sv = "<%= vo.getFaMgrNo() %>";

            _common.callAjax("/nms/getHistoryDetailView.do", {/* "mgrNo" : v,  */"faMgrNo" : sv}, function(view) {
                $(".searchResultWrapper").html(view);
            });
        }
    });
});

/* 점검 삭제 버튼 이벤트 입니다. */
$(".searchResultWrapper").find("#delBtn").click(function(){

    confirm("점검이력을 삭제하시겠습니까?\n삭제시 관련 이미지가 함께 삭제됩니다.", function(){
    	<%-- var mgrNo = "<%= vo.getMgrNo() %>"; --%>
    	var faMgrNo = "<%= vo.getFaMgrNo() %>";
        var delHis = false;
        var delImg = false;

        _common.callAjax("/image/del.json", {"refMgrNo" : mgrNo}, function(json){
            delImg = json.result;
            _common.callAjax("/nms/delHistory.json", {"faMgrNo" : faMgrNo}, function(json){
                delHis = json.result;
            }, false);
        }, false);

        if(delHis && delImg){
            alert("삭제되었습니다.");

            $(".searchResultWrapper").find(".searchTitle").find("button.tab").eq(0).click();
        }else if(!delHis || !delImg){
            var msg = "";
            if(!delHis) msg = "점검이력 삭제를 실패하였습니다.\n관리자에게 문의하여 주십시오.";
            if(!delImg) msg = "점검이력이 삭제되었으나 이미지삭제에 실패하였습니다.\n관리자에게 문의하여 주십시오.";
            if(!delHis && !delImg) msg = "점검이력 및 이미지 삭제에 실패하였습니다.\n관리자에게 문의하여 주십시오.";

            alert(msg);
        }
    });
});

/* 취소요청 버튼 이벤트 입니다. */
$(".searchResultWrapper").find("#cnclBtn").click(function(){

	if(_common.utils.isNullAndEmpty($("#cnclResn").val())){
		alert("취소요청 사유를 입력해 주세요.");
		$("#cnclResn").focus();
	}else{
		confirm("해당 점검을 취소 요청 하시겠습니까?", function(){
			var param = {};
            <%-- param["mgrNo"] = "<%= vo.getMgrNo() %>"; --%>
            param["faMgrNo"] = "<%= vo.getFaMgrNo() %>";
            param["cnclResn"] = $("#cnclResn").val();
            param["cnclReqDat"] = new Date().getYMDHMS();

            _common.callAjax("/nms/editHistoryAttr.json", param, function(json) {
                if(json.result){
                	alert("취소요청이 완료되었습니다.");

                }
            });
		});
	}
});

/* 192 line used */
<%-- var v = "<%= vo.getMgrNo() %>";
var sv = "<%= vo.getFaMgrNo() %>";

_common.callAjax("/nms/getHistoryDetailView.do", {"mgrNo" : v, "faMgrNo" : sv}, function(view) {
    $(".searchResultWrapper").html(view);
}); --%>
</script>

<p class="searchTitle">
    <button class="tab">검색결과</button><button class="tab">취소요청관리</button><button class="tab" active="active">상세정보</button>
</p>

<div id="tableWrapper">
    <div style="margin-bottom:5px">
        <button class="blackBtn" id="delBtn">점검 삭제</button>
        <button class="blackBtn" id="editBtn">점검 저장</button>
    </div>
	<table>
        <tr>
            <th>점검구분</th>
            <td>
                <%= cde.convertCodeToName("C04", vo.getChkGbnCd()) %>
            </td>
            <th>정기점검명</th>
            <td>
                <%= vo.getChkNm() %>
            </td>
            <th>진행상태</th>
            <td>
                <select id="chkStatCd" name="chkStatCd" class="wide sendData">
<% while(chkStatItr.hasNext()){
	String selected = "";
    String str = (String) chkStatItr.next();
    if(str.equals(vo.getChkStatCd())) selected = "selected"; %>
                    <option value="<%= str %>" <%= selected %>><%= chkStat.get(str) %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>시설구분</th>
            <td>
                <%= vo.getFaType() %>
            </td>
            <th>시설명</th>
            <td colspan="4">
                <%= vo.getFaNm() %>
            </td>
		</tr>
		<tr>
			<th>주소</th>
			<td colspan="6">
			    <%= addr %>
            </td>
		</tr>
		<tr>
			<th>위치설명</th>
			<td colspan="6">
                <%= locDesc %>
            </td>
		</tr>
		<tr>
            <th>등록자</th>
            <td>
                <%= StrUtil.chkNull(vo.getRegUserId()) %>
            </td>
            <th>등록일</th>
            <td colspan="4">
                <%= DateUtil.formatDate(vo.getRegDat()) %>
            </td>
		</tr>
		<tr>
            <th>등록사유</th>
            <td colspan="6">
                <%= StrUtil.chkNull(vo.getRegRsn()) %>
            </td>
		</tr>
		<tr>
		    <th>작업자</th>
		    <td>
                <%= StrUtil.chkNull(vo.getWorkerId()) %>
            </td>
		    <th>접수일자</th>
		    <td>
                <%= DateUtil.formatDate(vo.getReptDat()) %>
            </td>
		    <th>처리일자</th>
		    <td>
                <%= DateUtil.formatDate(vo.getWorkDat()) %>
            </td>
		</tr>
		<tr>
		    <th>장애유형</th>
		    <td>
                <select id="errTypCd" name="errTypCd" class="wide sendData">
                    <option value=""></option>
<% while(errTypItr.hasNext()){
    String selected = "";
    String str = (String) errTypItr.next();
    if(str.equals(vo.getErrTypCd())) selected = "selected"; %>
                    <option value="<%= str %>" <%= selected %>><%= errTyp.get(str) %></option>
<% } %>
                </select>
		    </td>
		    <th>처리결과</th>
		    <td colspan="4">
                <select id="workTypCd" name="workTypCd" class="wide sendData">
                    <option value=""></option>
<% while(workTypItr.hasNext()){
    String selected = "";
    String str = (String) workTypItr.next();
    if(str.equals(vo.getWorkTypCd())) selected = "selected"; %>
                    <option value="<%= str %>" <%= selected %>><%= workTyp.get(str) %></option>
<% } %>
                </select>
            </td>
		</tr>
		<tr>
		    <th>점검내용</th>
		    <td colspan="6"><input type="text" class="wide sendData" id="workDesc" name="workDesc" value="<%= StrUtil.chkNull(vo.getWorkDesc()) %>"></td>
		</tr>
		<tr>
		    <th>취소요청사유</th>
		    <td colspan="4"><input type="text" class="wide sendData" id="cnclResn" name="cnclResn" value="<%= StrUtil.chkNull(vo.getCnclResn()) %>"></td>
		    <td class="tCenter"><button class="blackBtn" id="cnclBtn">취소요청 신청</button></td>
		</tr>
		<tr>
		    <th>취소요청결과</th>
		    <td>
                <%= cde.convertCodeToName("C18", vo.getCnclRsltCd()) %>
		    </td>
		    <th>취소요청처리자</th>
		    <td>
                <%= StrUtil.chkNull(vo.getCnclAcptId()) %>
            </td>
		    <th>취소요청처리일</th>
		    <td>
                <%= DateUtil.formatDate(vo.getCnclAcptDat()) %>
            </td>
		</tr>
		<tr>
		    <th colspan="6">현장사진</th>
		</tr>
		<tr class="tCenter" height="40%">
		    <td colspan="6" id="imgWrapper" style="border-bottom:none;">
                <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
                    <%-- <input type="text" name="k" id="k" class="hidden" value="<%= vo.getMgrNo() %>"> --%>
                    <input type="text" name="k" id="k" class="hidden" value="<%= vo.getFaMgrNo() %>">
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
	                <img class="imgs" alt="<%= img.get(i).getFileNm() %>" src="../image/getImage.do?mgrSeq=<%= img.get(i).getMgrSeq() %>" k="<%= img.get(i).getMgrSeq() %>" onerror="this.src='../res/img/no_img.png'">
	                <img class="close" src="../res/img/close.png" k="<%= img.get(i).getMgrSeq() %>">
                </span>
    <% } %>
<% } %>
                <br><button class="blackBtn" id="uploadBtn">사진 추가</button>
		    </td>
		</tr>
	</table>
</div>