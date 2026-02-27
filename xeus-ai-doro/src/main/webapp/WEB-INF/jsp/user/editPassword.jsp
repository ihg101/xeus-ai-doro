<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
$("#editPwdPop").find("#saveBtn").click(function(){
	var nowUserPwd = $("#editPwdPop").find("#nowUserPwd").val();
	var newUserPwd = $("#editPwdPop").find("#newUserPwd").val();
	var newUserPwdRe = $("#editPwdPop").find("#newUserPwdRe").val();

	if(nowUserPwd.length < 5){
		alert("패스워드는 5자리 이상 입력하여 주십시오!");
		$("#editPwdPop").find("#nowUserPwd").focus();
		return false;
	}

	if(!newUserPwd.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)){
		alert("비밀번호는 문자, 숫자, 특수문자의 조합으로 8~16자리로 입력해주세요.");
		$("#editPwdPop").find("#newUserPwd").focus();
		return false;
	}

	if(newUserPwd != newUserPwdRe){
		alert("패스워드가 같지 않습니다.");
		$("#editPwdPop").find("#newUserPwd").focus();
		return false;
	}

	_common.callAjax("/user/editPassword.json", { "nowUserPwd" : nowUserPwd, "newUserPwd" : newUserPwd }, function(json){
		if(json.result){
			alert("비밀번호가 변경되었습니다.");
			$("#editPwdPop").dialog("close");
		}
	});
});

$("#editPwdPop").find("#newUserPwdRe").keyup(function(e){
	if(e.which == 13){
		$("#editPwdPop").find("#saveBtn").click();
	}
});
</script>
<table>
	<tr>
		<th>현재 비밀번호</th>
		<td>
			<input type="password" id="nowUserPwd" name="nowUserPwd" />
		</td>
	</tr>
	<tr>
		<th>새 비밀번호</th>
		<td>
			<input type="password" id="newUserPwd" name="newUserPwd" />
		</td>
	</tr>
	<tr>
		<th>새 비밀번호 확인</th>
		<td>
			<input type="password" id="newUserPwdRe" name="newUserPwdRe" />
		</td>
	</tr>
	<tr>
		<td class="tCenter" colspan="2">
			<button id="saveBtn" class="btn_style" type="button">저장</button>
		</td>
	</tr>
</table>