<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_NoticeVo"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_ColumnVo"%>
<%@ page import="gmx.gis.util.code.GMT_DateUtil"%>
<%@ page import="gmx.gis.util.code.GMT_StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>


<%
ArrayList<GMT_ColumnVo> column = (ArrayList<GMT_ColumnVo>) request.getAttribute("column");

ArrayList<GMT_NoticeVo> list = (ArrayList<GMT_NoticeVo>)request.getAttribute("result");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- <link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/jquery-ui.css"> -->
<script type="text/javascript" src="../common/jquery-3.2.0.min.js"></script>
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="../common/string.js"></script>
<script type="text/javascript" src="../common/HashMap.js"></script>
<script type="text/javascript" src="../common/string.js"></script>
<script type="text/javascript" src="../common/Date.js"></script>
<script type="text/javascript" src="../common/common.js"></script>
<style>
@font-face { font-family: 'Nanum'; src: url('../res/css/GMT/font/NanumGothic.woff') format('woff'); font-weight: normal; font-style: normal; }
html, body { padding: 0; margin: 0; width: 100%; height: 100%; }
* { font-family: 'Nanum' !important; }
html, body, div, span, iframe, h1, h2, h3, h4, h5, h6, p, a, img, ol, ul, li, header, nav, section, footer { margin: 0; padding: 0; border: 0;}
ol, ul { list-style: none;}
a, a:hover {color: #333; text-decoration: none;}
table, thead, tbody, tr, th, td {border-collapse: collapse;}
#list { margin-top: -2px; }
.fileDown { cursor: pointer; }
.fileDown:hover { color: #007fff; font-weight: bold; }
#list h3 {padding: 15px 0; color: #0077ff; text-indent: 20px; border-bottom: 1px solid #ddd; font-size: 14px; cursor: pointer; outline: 0; position: relative;}
#list h3.ui-state-active {background-color: #f3f9ff; border-bottom: 0;}
#list h3:before {content:""; display: inline-block; width: 15px; height: 15px; background-image: url(../res/img/icon_down_arrow.png); background-size: cover; vertical-align: middle; margin-right: 10px; transition: 0.3s;}
#list h3.ui-state-active:before {transform: rotate(-180deg);}
#list > div {box-sizing: border-box; padding: 20px; border-bottom: 1px solid #ddd;}
#list > div.ui-accordion-content-active {background-color: #f3f9ff;}
</style>
<script>
$(document).ready(function(){
	$("#list").accordion({
		collapsible: true,
		autoHeight: false,
	    heightStyle: "fill"
	});

	$(".fileDown").click(function(){
		var k = $(this).attr("k");
		var u = $(this).attr("u");

		if(k != null && k != "" && u != null && u != ""){
			_common.postForm.submit("/GMT_notice/getFile.json", { "atchFileNm" : k , "mgrSeq" : u });
		}
	});
});
</script>
<title>공지사항</title>
</head>
<body>

<div id="list">
<% for(int i=0; i<list.size(); i++){
	if(!"내부".equals(list.get(i).getOpenType())){ %>
	<h3 style="font-weight: bold;"><%= list.get(i).getNotcTitle() %><span style="position: absolute; right: 10px;"><%= GMT_DateUtil.formatDate(list.get(i).getLastMdfyDat()) %></span></h3>
	<div>
		<pre>
<%= list.get(i).getNotcConts() %>
		</pre>
		<table>
			<tr>
	<% if(list.get(i).getAtchFileNm() != null && !"".equals(list.get(i).getAtchFileNm())){ %>
					<th>첨부파일</th>
					<td><span class="fileDown" k="<%= list.get(i).getAtchFileNm() %>" u="<%= list.get(i).getMgrSeq() %>"><%= list.get(i).getAtchFileNm() %></span></td>
	<% } %>
			</tr>
		</table>
	</div>
	<% } %>
<% } %>
</div>

</body>
</html>