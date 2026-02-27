<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ include file="../../common.jsp"%>
<%
	ArrayList<CrmsTransRqstVo> rqst = (ArrayList<CrmsTransRqstVo>) request.getAttribute("list");
	ArrayList<CrmsTransAviVo> avis = (ArrayList<CrmsTransAviVo>) request.getAttribute("avi");
%>
<%!
private String formatCctvNm(String cctvNm){
	if(StringUtils.isEmpty(cctvNm)) return cctvNm;

	String cctvNmText = cctvNm;
	if(cctvNm.contains(";")){
		String[] cctvNmSplit = cctvNm.split(";");
		if(cctvNmSplit.length >= 4){
			cctvNmText  = cctvNmSplit[0] + " " + cctvNmSplit[1];
			cctvNmText += "<br>";
			cctvNmText += cctvNmSplit[2] + " " + cctvNmSplit[3];

			if(cctvNmSplit.length >= 5) cctvNmText += " " + cctvNmSplit[4];
		}
	}

	return cctvNmText;
}
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
<link rel="shortcut icon" href="../../res/img/geomex.ico">
<link rel="stylesheet" href="../../common/jquerymobile/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="../../res/css/xeus.tvius.mobile.css?t=<%= DateUtil.getStrMilSec() %>" />
<script src="../../common/jquerymobile/jquery-1.11.1.min.js"></script>
<script src="../../common/jquerymobile/jquery.mobile-1.4.5.min.js"></script>
<title><%= projNm %></title>
<script type="text/javascript" src="../../common/string.js"></script>
<script type="text/javascript" src="../../common/Date.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b" data-dom-cache="false" data-title="영상 다운로드">

	<div data-role="header" align="center">
		<button url="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></button>
		<!-- <a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a> -->
		<!-- <img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px"> -->
		<h3 align="center">영상 다운로드(<%= avis.size() %>)</h3>
	</div>

	<div role="main" class="ui-content">
		<div role="main" class="ui-content">
			<!-- <div id="rqstListView" data-role="collapsibleset" data-filter="true" data-filter-placeholder="신청 내용을 입력해 주세요." data-theme="b"> -->
		<%
			for(int i=0; i<avis.size(); i++){
				CrmsTransAviVo vo = avis.get(i);

				/* String[] fileNameSplit = vo.getVdwkFileNm().split("/");
				String fileName = fileNameSplit[fileNameSplit.length - 1]; */

				String fileText = formatCctvNm(vo.getCctvLabel()) + "<br><br>" + "시작 시간 : " + DateUtil.formatDate(vo.getSecStDat()) + "<br>" + "종료 시간 : " + DateUtil.formatDate(vo.getSecEdDat());
				String realFileName = vo.getMgrSeq() + "_" + vo.getRqstMgrSeq() + "_" + vo.getVdwkFileSeq();
		%>
				<%-- <div data-role="collapsible" data-filtertext="<%= realFileName %>"> --%>
					<button class="downloadBtn" data-theme="a" k="<%= vo.getMgrSeq() %>" fileNm="<%= vo.getVdwkFileNm() %>"><%= fileText %></button>
				<!-- </div> -->
		<%
			}
		%>
			<!-- </div> -->
		</div>
	</div>

	<script>
	$(document).ready(function(){

		$("#home").click(function(){
			//$.mobile.changePage($(this).attr("url"));
			location.href = $(this).attr("url");
		});

		$(".downloadBtn").click(function(){

			var _param = {
				"userId" : "<%= userId %>",
				"fileNm" : $(this).attr("fileNm"),
				"reqGbn" : "11"
			};

			_common.callAjax("/tvius/getDownloadAuth.json", _param, function(json){
				if(json !== null){
					if(json.result === "P"){
						if(json.strPath !== null && json.downFileNm !== null){
							_param["fileNm"] = _param["fileNm"].replace(_param["userId"] + "/", "");
							_param["sub"] = _param["userId"] + "\\";
							_param["path"] = json.strPath;
							_param["downFileNm"] = json.downFileNm.replace(/\;/gi, "_");

							if(confirm("파일을 다운로드 하시겠습니까?\n\n파일 크기에 따라 데이터가 소모됩니다.")){
								_common.postForm.submit("/tvius/getFiles.json", _param);
							}
						}
					}else if( json.result == "O"){
						alert("영상 다운로드 횟수를 초과했습니다.");
					}else if( json.result == "N"){
						alert("영상 다운로드 권한이 없습니다.");
					}else if( json.result == "E"){
						alert("권한 조회 오류가 발생했습니다.");
					}
				}else{
					alert("다운로드 요청이 실패했습니다.");
				}
			}, false);

		});

	});
	</script>

</div>

</body>
</html>