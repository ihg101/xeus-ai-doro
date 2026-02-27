<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ page import="java.util.Collections"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<UserVo> user = (ArrayList<UserVo>) request.getAttribute("user");
ArrayList<String> grp = new ArrayList<String>();
for(int i=0; i<user.size(); i++){
	if(!grp.contains(user.get(i).getAuthGrpNm())){
		String authGrpName = user.get(i).getAuthGrpNm();
		if(authGrpName == null) authGrpName = "소멸된 그룹";
		if(grp.contains(authGrpName)) continue;
		grp.add(authGrpName);
	}
}
Collections.sort(grp);
%>
<script type="text/javascript">

$(".contentWrapper").find("#userList").find("th").click(function(){
	if($(this).parent().parent().parent().find("input[type=checkbox]:checked").length == 0){
		$(this).parent().parent().parent().find("input[type=checkbox]").prop("checked", true);
	}else{
		$(this).parent().parent().parent().find("input[type=checkbox]").prop("checked", false);
	}
});

$(".contentWrapper").find("#allUserToggle").click(function(){
	if($(".contentWrapper").find("#userList").find("input[type=checkbox]:checked").length == 0){
		$(".contentWrapper").find("#userList").find("input[type=checkbox]").prop("checked", true);
	}else{
		$(".contentWrapper").find("#userList").find("input[type=checkbox]").prop("checked", false);
	}
});

$("#sendAdminNoticeBtn").click(function(){
	var user = "";

	$(".contentWrapper").find("#userList").find("input[type=checkbox]:checked").each(function(i){
		if(i == 0){
			user = $(this).val();
		}else{
			user += "," + $(this).val();
		}
	});

	if($("#adminNoticeAction").val() == "sessionDestroy"){
		_common.callAjax("/user/sessionDestroy.json", { "user" : user }, function(){} );
	}else{

		var json = { "AdminNotice" : { "msg" : $("#adminNoticeMsg").val(), "action" : $("#adminNoticeAction").val(), "user" : user } }
		_common.callAjax("/ws/addAdminNotice.json", { "json" : JSON.stringify(json) }, function(){} );
	}
});
</script>
<div class="contentWrapper">
	<table id="list">
		<tr>
			<th>콜백</th>
			<th>공지 내용</th>
		</tr>
		<tr>
			<td>
				<select id="adminNoticeAction" class="customScroll" style="border: none;" size="4">
					<option value="">공지사항 확인</option>
					<!-- <option value="reload">새로고침</option> -->
					<option value="signOutNow">로그아웃 후 공지사항 확인</option>
					<option value="signOut">공지사항 확인 후 로그아웃</option>
					<option value="sessionDestroy">세션 파기</option>
				</select>
			</td>
			<td width="300px">
				<textarea id="adminNoticeMsg" style="width: 100%; height: 200px;"></textarea>
			</td>
		</tr>
		<tr>
			<th id="allUserToggle" colspan="2" class="pointer">공지 수신 대상자</th>
		</tr>
		<tr>
			<td id="userList" colspan="2">
<%
for(int i=0; i<grp.size(); i++){
	String authGrpName = grp.get(i);
%>
				<div class="customScroll head_fixed" style="width: 200px; float: left; height:250px; max-height: 250px; overflow-y: scroll; overflow-x: hidden; margin:10px;">
					<table style="width: 100%; margin: 0;">
						<thead>
							<tr><th colspan="2" style="cursor: pointer; padding-right: 10px;"><%= grp.get(i) %></th></tr>
						</thead>
<%
	for(int l=0; l<user.size(); l++){
		String userAuthMgrNm = user.get(l).getAuthGrpNm();
		if(userAuthMgrNm == null) userAuthMgrNm = "소멸된 그룹";
		if(authGrpName.equals(userAuthMgrNm)){
%>
						<tr>
							<td colspan="2" style="padding-right: 10px;">
								<input class="checkbox" type="checkbox" id="<%= user.get(l).getUserId() %>" value="<%= user.get(l).getUserId() %>" checked>
								<label class="checkboxC" for="<%= user.get(l).getUserId() %>" style="vertical-align: inherit;"></label><%= user.get(l).getUserId() %>
							</td>
						</tr>
<%
		}
	}
%>
					</table>
				</div>
<%
}
%>
			</td>
		</tr>
	</table>
	<div class="btnDiv tCenter" style="padding: 10px;">
		<button id="sendAdminNoticeBtn" class="btn_style" style="width: 10%;">실시간 공지 전송</button>
	</div>
</div>