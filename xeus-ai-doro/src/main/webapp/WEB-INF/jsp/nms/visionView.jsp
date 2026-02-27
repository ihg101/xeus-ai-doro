<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common.jsp" %>
<%
//setup;event
String visionParam = "?privileged=";
if(authGrpList.get(0).getAuthMgrNo().contains("SVC014") && authGrpList.get(0).getAuthMgrNo().contains("SVC015")){
	 visionParam += "setup;event";
}else{
	if(authGrpList.get(0).getAuthMgrNo().contains("SVC014")) visionParam += "setup";
	if(authGrpList.get(0).getAuthMgrNo().contains("SVC015")) visionParam += "event";
}

if(!authGrpList.get(0).getAuthMgrNo().contains("SVC014") && !authGrpList.get(0).getAuthMgrNo().contains("SVC015")){
	visionParam = "";
}
%>
<div class="contentWrapper" style="position: relative; width: 100%; height: 100%;">

    <div id="visionWrap" style="width: 100%; height: 100%;">
		<iframe src="http://101.102.133.203/<%= visionParam %>" style="width: 100%; height: 100%;"></iframe>
	</div>

	<div id="errorMsg" style="text-align: center; color: black; position: absolute; bottom: 12px; left: calc(50% - 260px); width: 520px; font-weight: bold;">참고) 내부 망연계가 불가능한 환경인 경우, 해당 기능은 사용이 제한됩니다.</div>
</div>