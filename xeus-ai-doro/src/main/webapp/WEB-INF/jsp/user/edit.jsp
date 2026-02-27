<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ include file="../common.jsp"%>
<%
    UserVo vo = (UserVo) request.getAttribute("userVo");

    ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
    HashMap<String, String> cdeGrp = cde.convertCodeGrpToAllCde("C02");
    Set<String> key = cdeGrp.keySet();
    Iterator<String> itr = key.iterator();
%>
<script type="text/javascript">
/* $("#pwdChange").on("click", function(){
	$(".bpopup").find("#nowUserPwd, #newUserPwd, #newUserPwdRe").val("");
	$(".bpopup").bPopup({appendTo: $(".contentWrapper")});
	$(".bpopup").find("#nowUserPwd").focus();
});

*/
/* 파일 다운 */
$("#editInfoPop").find(".doc_down").click(function(){
	var k = $(this).attr("k");
	var u = $(this).attr("u");

	if(k != null && k != "" && u != null && u != ""){
		_common.postForm.submit("/user/getFile.json", { "oathFileNm" : k , "userId" : u });
	}
});

/* 파일 수정 */
$("#editInfoPop").find("#editFileBtn").click(function(){
	$("#editInfoPop").find("#file").click();
});

$("#editInfoPop").find("#file").on("change", function(){
    var nm = $(this).val();
    if(nm != ""){
    	var arr = nm.split("\\");
    	var _html = "";
    	_html += "<p id='uploadFileNm' class='sText' style='cursor: default; max-width: 250px; height: 8px;'>"+arr[arr.length-1]+"</p>";
    	$(_html).insertBefore("#editFileBtn");
    	if($("#editInfoPop").find(".doc_down").length > 0) $("#editInfoPop").find(".doc_down").remove();
    }
    /* if(nm != ""){
        confirm("선택하신 파일을 업로드 하시겠습니까?", function(){
            _common.formSubmit("/tvius/addDocFile.json", $("#hiddenForm"), function(json){
                if(json.realNm !== undefined && json.uploadNm !== undefined){
                    $("#docFileNm").val(json.uploadNm);
                    $("#docFilePath").val(json.realNm);
                }
            });
        }, function(){
            $(this).val("");
        });
    } */
});

$("#editInfoPop").find("#editBtn").click(function(){
	if($("#editInfoPop").find("#userNm").val() == ""){
		alert("사용자명을 입력하여 주십시오!");
		$("#editInfoPop").find("#userNm").focus();
		return false;
	}

	if($("#editInfoPop").find("#orgMgrNo").val() == ""){
		alert("소속기관을 선택하여 주십시오!");
		$("#editInfoPop").find("#orgMgrNo").focus();
		return false;
	}

	var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;

	if(filter.test($("#editInfoPop").find("#email").val()) != true){
		alert("이메일 형식이 아닙니다!");
		$("#editInfoPop").find("#email").focus();
		return false;
	}

	if($("#editInfoPop").find("#telNum").val() == ""){
		alert("휴대전화번호를 입력하여 주십시오!");
		$("#editInfoPop").find("#telNum").focus();
		return false;
	}

	if($("#editInfoPop").find("#birthDay").val() == ""){
		alert("생년월일을 입력하여 주십시오!");
		$("#editInfoPop").find("#birthDay").focus();
		return false;
	}

	//_common.callAjax("/user/edit.json", _common.utils.collectSendData("#editInfoPop"), function(json){
	_common.formSubmit("/user/edit.json", $("#editInfoPop").find("#sendForm"), function(json){
		if(json.result == null){
			alert(json.error);
		}else{
			alert("사용자 정보가 변경되었습니다.");
			$("#editInfoPop").dialog("close");
		}
	});
});
</script>
<style>

</style>
<form id="sendForm" method="POST" enctype="multipart/form-data">
    <table>
        <tr>
            <th width="150">계정</th>
            <td>
                <input type="text" id="userId" name="userId" class="sendData" readonly="readonly" value="<%=vo.getUserId()%>"/>
            </td>
        </tr>
        <tr>
            <th>이름</th>
            <td>
                <input type="text" class="sendData" id="userNm" name="userNm" placeholder="이름" value="<%=vo.getUserNm()%>"/>
            </td>
        </tr>
        <tr>
            <th>비밀번호 확인</th>
            <td>
                <input type="password" id="userPwd" name="userPwd" class="sendData" size="30"/>
            </td>
        </tr>
        <tr>
            <th>생년월일</th>
            <td>
                <input type="text" class="sendData" id="birthDay" name="birthDay" placeholder="생년월일 6자리 (주민등록번호 앞자리)" value="<%=vo.getBirthDay()%>"/>
            </td>
        </tr>
        <tr>
            <th>소속기관</th>
            <td>
                <select class="sendData" id="orgMgrNo" name="orgMgrNo">
<% for(int i=0; i<orgz.size(); i++){ %>
                        <option value="<%= orgz.get(i).getOrgMgrNo() %>" <%if(orgz.get(i).getOrgMgrNo().equals(vo.getOrgMgrNo())){%>selected<%} %> ><%= orgz.get(i).getOrgNm() %></option>
<% } %>
                </select>
            </td>
        </tr>
        <tr>
            <th>부서명</th>
            <td>
                <input type="text" class="sendData" id="departNm" name="departNm" placeholder="부서명" value="<%=vo.getDepartNm()%>"/>
            </td>
        </tr>
        <tr>
            <th>직급(직책)</th>
            <td>
                <input type="text" class="sendData" id="posNm" name="posNm" placeholder="직급 (직책)" value="<%=vo.getPosNm()%>"/>
            </td>
        </tr>
        <tr>
            <th>사무실 전화번호</th>
            <td>
                <input type="text" class="sendData" id="telNum" name="telNum" placeholder="사무실 전화번호 ( - 없이 입력)" value="<%=vo.getTelNum()%>"/>
            </td>
        </tr>
        <tr>
            <th>휴대폰 번호</th>
            <td>
                <input type="text" class="sendData" id="mobileNum" name="mobileNum" placeholder="휴대폰 번호 ( - 없이 입력)" value="<%=vo.getMobileNum()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>이메일 주소</th>
            <td>
                <input type="text" class="sendData" id="email" name="email" placeholder="이메일 주소" value="<%=vo.getEmail()%>"/>
            </td>
        </tr>
        <tr id="downTr">
            <th>서약서</th>
            <td id="oathArea">
                <%-- <input type="text" id="fileDown" class="medium" value="<%= vo.getOathFileNm() %>" k="<%= vo.getOathFileNm() %>" u="<%= vo.getUserId() %>" readOnly /> --%>
<% if(!"".equals(StrUtil.chkNull(vo.getOathFileNm()))){ %>
                <a class="doc_down sText" style="cursor: pointer; color: #7780ff; max-width: 250px; height: 8px;" k= "<%=vo.getOathFileNm()%>" u="<%=vo.getUserId()%>" target="_blank"><%=vo.getOathFileNm()%></a>
<% } %>
                <input type="text" id="subDir" name="subDir" class="hidden sendData" value="user\">
                <input type="file" id="file" name="file" class="hidden sendData" size="30"/>
                <button id="editFileBtn" class="btn_style2" type="button">첨부</button>
            </td>
        </tr>

        <!-- hidden -->

        <%-- <tr class="hidden">
            <th>권한그룹</th>
            <td>
                <input type="text" class="sendData" id="authGrpNo" value="<%=vo.getAuthGrpNo()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>신청일시</th>
            <td>
                <input type="text" class="sendData" id="reqDat" value="<%=vo.getReqDat()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>계정상태</th>
            <td>
                <input type="text" class="sendData" id="authStatCd" value="<%=vo.getAuthStatCd()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>승인일시</th>
            <td>
                <input type="text" class="sendData" id="acptDat" value="<%=vo.getAcptDat()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>잠김일시</th>
            <td>
                <input type="text" class="sendData" id="lockDat" value="<%=vo.getLockDat()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>폐기일시</th>
            <td>
                <input type="text" class="sendData" id="exprDat" value="<%=vo.getExprDat()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>승인자ID</th>
            <td>
                <input type="text" class="sendData" id="acptUserId" value="<%=vo.getAcptUserId()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>인증시도횟수</th>
            <td>
                <input type="text" class="sendData" id="authAtmtCnt" value="<%=vo.getAuthAtmtCnt()%>"/>
            </td>
        </tr>
        <tr class="hidden">
            <th>인증시도횟수</th>
            <td>
                <input type="text" class="sendData" id="authConnIp" value="<%=vo.getAuthConnIp()%>"/>
            </td>
        </tr>
         --%>
		<tr>
			<td colspan="2"><button type="button" id="editBtn" class="btn_style">수정</button></td>
		</tr>
    </table>
</form>
<!-- <table class="table_style">
    <tr align="center">
        <td>
            <button id="editBtn" class="btn_style" tabindex="4">수정</button>
        </td>
    </tr>
</table> -->
