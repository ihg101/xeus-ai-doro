<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ include file="../../common.jsp"%>
<%
ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>) request.getAttribute("list");

boolean isCapture = ("Y".equals((String) session.getAttribute("isCapture")));

HashMap<String, String> map = (HashMap<String, String>) request.getAttribute("param");
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
<script type="text/javascript" src="../../common/Date.js"?t=<%= DateUtil.getStrMilSec() %>></script>
<script type="text/javascript" src="../../common/common.js?t=<%= DateUtil.getStrMilSec() %>"></script>
</head>
<body>

<div data-role="page" data-theme="b" data-dom-cache="false" data-title="신청 현황">

	<div data-role="header" align="center">
		<button url="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></button>
		<!-- <a href="./main.do" class="ui-btn ui-btn-inline ui-icon-home ui-btn-icon-left" id="home"></a> -->
		<!-- <img src="https://www.jecheon.go.kr/newCommon/images/total_logo.png" width="180px"> -->
		<h3 align="center">신청 현황</h3>
	</div>

	<div role="main" class="ui-content">
		<div role="main" class="ui-content">

			<div data-role="footer" align="center">
				<p style="margin: 8px 0px;"><%= map.get("reqstId") %> 님의 자료 신청 현황입니다.</p>
			</div>

			<div id="rqstListView" data-role="collapsibleset" data-filter="true" data-filter-placeholder="신청 내용을 입력해 주세요." data-theme="b">
			<% for(int i=0; i<list.size(); i++){ %>
				<div data-role="collapsible" data-filtertext="<%= list.get(i).getReqstDetail() %>">
					<h3 data-icon="false">[<%= list.get(i).getMgrSeq() %>] [<%= list.get(i).getProcStatCdRelCdeNm() %>] <%= list.get(i).getReqstDetail() %></h3>
					<ul data-role="listview">
						<li>
							<table id="listTable">
								<tr>
									<th>처리상태</th>
									<td><%= list.get(i).getProcStatCdRelCdeNm() %></td>
								</tr>
								<tr>
									<th>공문파일명</th>
									<td><%= list.get(i).getDocFileNm() %></td>
								</tr>
								<tr>
									<th>신청일자</th>
									<td><%= DateUtil.formatDate(list.get(i).getReqstDat()) %></td>
								</tr>
							<% if(list.get(i).getRejtResn() != null){ %>
								<tr>
									<th>거부사유</th>
									<td>
										<textarea readonly><%= list.get(i).getRejtResn() %></textarea>
									</td>
								</tr>
							<% } %>
							<% if("SK".equals(list.get(i).getProcStatCd())){ %>
								<tr>
									<th>승인일자</th>
									<td><%= DateUtil.formatDate(list.get(i).getAcptDat()) %></td>
								</tr>
							<% } %>
								<tr>
									<td colspan="2">
										<textarea readonly><%= list.get(i).getReqstDetail() %></textarea>
									</td>
								</tr>
							<% if("SW".equals(list.get(i).getProcStatCd()) && isCapture){ %>
								<tr>
									<td colspan="2">
										<button class="editBtn" url="/tvius/mobile/getUsrTviusImageRqstEdit.do" data-theme="a" k="<%= list.get(i).getMgrSeq() %>">신청 내용 수정</button>
									</td>
								</tr>
							<% } %>
							<% if("SK".equals(list.get(i).getProcStatCd())){ %>
								<tr>
									<td colspan="2">
										<button class="imgListBtn" url="./getUsrTviusImageDownloadView.do" data-theme="a" k="<%= list.get(i).getMgrSeq() %>">이미지 목록</button>
									</td>
								</tr>
							<% } %>
							</table>
						</li>
					</ul>
				</div>
			<% } %>
			</div>
		</div>
	</div>

	<script>
	$(document).ready(function(){

		$("#home").click(function(){
			//$.mobile.changePage($(this).attr("url"));
			location.href = $(this).attr("url");
		});

		$(".imgListBtn").click(function(){
			var k = $(this).attr("k");
			var url = $(this).attr("url");
// 			_common.postForm.submit(url, { "rqstMgrSeq" : k });

			url += '?rqstMgrSeq='+k;
			location.href = url;
		});

		$(".editBtn").click(function(){
			var k = $(this).attr("k");
			var url = $(this).attr("url");
			var isMod = false;

			_common.callAjax("/tvius/mobile/getTransRqstInfo.json", {"mgrSeq" : k}, function(json){
				var json = json.result;
				if(json.procStatCd == "SW"){
					isMod = true;
				}else if(json.procStatCd == "SA"){
					alert("해당 신청건은 승인 완료 되었습니다.");
				}else if(json.procStatCd == "SD"){
					alert("해당 신청건은 승인 거부 되었습니다.");
				}else if(json.procStatCd == "SF"){
					alert("해당 신청건은 처리 실패 되었습니다.");
				}else if(json.procStatCd == "SN"){
					alert("해당 신청건은 처리중 입니다.");
				}
			},false);

			if(isMod){
				_common.postForm.submit(url, { "k" : k });
			}else{
				location.href = "./getUsrTviusRqstView.do";
			}
			/* $.mobile.changePage(url,{
				type: "POST",
				dataUrl: url + "?mgrSeq=" + k,
				data: { "mgrSeq" : k },
				changeHash: true
			}); */
		});

	});
	</script>

</div>

</body>
</html>