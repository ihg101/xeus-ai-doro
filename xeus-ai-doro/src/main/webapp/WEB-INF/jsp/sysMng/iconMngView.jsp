<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.sysmgr.service.SymDescVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="net.minidev.json.JSONObject"%>
<%@ page import="net.minidev.json.parser.JSONParser"%>
<%@ include file="../common.jsp" %>
<%

CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

/*
 * 심볼종류코드
 */
HashMap<String, String> symCdMap = cde.convertCodeGrpToAllCde("C21");
Set<String> symCdKey = new TreeSet<String>(symCdMap.keySet());
Iterator<String> symCdItr = symCdKey.iterator();

ArrayList<SymDescVo> list = (ArrayList<SymDescVo>) request.getAttribute("result");

/* ArrayList<SymIconVo> rst = (ArrayList<SymIconVo>)request.getAttribute("symicon");

JSONObject iconJson = new JSONObject();
if(rst.size()>0){
    for(int i=0; i<rst.size(); i++){
        String gbnCd = rst.get(i).getGbnCd();
        JSONObject typJson = new JSONObject();
        if(iconJson.containsKey(gbnCd)){
            JSONParser parser = new JSONParser(JSONParser.MODE_JSON_SIMPLE);
            JSONObject tmpJson = (JSONObject) parser.parse(iconJson.get(gbnCd).toString());
            Set<String> tmpJsonKeySet = new TreeSet<String>(tmpJson.keySet());
            Iterator<String> tmpJsonKey = tmpJsonKeySet.iterator();
            while(tmpJsonKey.hasNext()){
                String tmpKey = (String) tmpJsonKey.next();
                typJson.put(tmpKey, tmpJson.get(tmpKey));
            }
        }
        typJson.put(rst.get(i).getIconTyp(), rst.get(i).getFileNm());
        iconJson.put(gbnCd, typJson);
    }
} */

HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

%>

<%-- <link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.log.css"> --%>
<script type="text/javascript">
<%-- var ctxPath = "<%= context %>";
var subPath = "<%= param.get("subPath") %>";
var symGrp = "<%= param.get("symGrp") %>";
var iconList = null; --%>
var timer = null;
var delta = 300;
var agent = null;

$(document).ready(function() {
	agent = navigator.userAgent.toLowerCase();
	resizeDone();
});

$(window).resize(function(){
	clearTimeout( timer );
    timer = setTimeout( resizeDone, delta );
});

function resizeDone() {
	$(".contentWrapper").find("#content").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height()-200);
}

$("#gbn").on("change", function(){
	$("#hiddenForm").find("#p").val($(this).val());
});

$("#btn-upload").click(function(){
	$("#hiddenForm").find("#uploadImg").click();
});

/* 상위 "파일 첨부" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
$("#hiddenForm").find("#uploadImg").on("change", function(){
	var ext = $(this).val().split('.').pop();
	if (ext != "png"){
		alert('png 확장자만 등록 가능합니다.');
		return false;
	} else {
		var gbn = $("#hiddenForm").find("#p").val();
		if(gbn != ""){
			var nm = $(this).val();
			if(nm != ""){
				confirm("선택하신 파일을 업로드 하시겠습니까?", function(){
					_common.formSubmit("/sym/addDesc.json", $("#hiddenForm"), function(json){
			        	if(json.result){
			        		alert('업로드되었습니다.');
			        		reload();
			        	}
			        });
				}, function(){
					$(this).val("");
				});
			} else {
				alert("파일을 선택하여 주십시오.");
			}
		} else {
			alert("심볼 구분을 선택하여 주십시오.");
			if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
			     // ie일 경우
				$("#icon_reg_wrap").find("#uploadImg").replaceWith($("#icon_reg_wrap").find("#uploadImg").clone(true));
			}else{
			     // ie가 아닐 경우
				$("#icon_reg_wrap").find("#uploadImg").val('');
			}
		}
	}
});
/**
 *  아이콘 관리 > 삭제 클릭
 */
$(".contentWrapper").find(".btn-del").click(function(){
	var mgrNo = $(this).attr("mgrno");
	if(confirm("해당 아이콘을 삭제하시겠습니까?")){
		//alert("사용되고 있는지 확인하는 로직을 추가해야 함.");
		//TODO 사용되고 있는 아이콘이면 삭제되지 않는 로직을 추가해야 함.
		_common.callAjax("/sym/delDesc.json", {"mgrNo": mgrNo}, function(json) {
			if(json.result){
				alert('삭제되었습니다.');
				reload();
			}
		}, false);
	}
});

/* $("#btn-sch").click(function(){
	var _param = {};
	_param["gbnCd"] = $("#search").find("#gbn").val();
	reload(_param);
}); */

function reload(_param){
	if(_param === undefined){
		var _param = {};
	}
	_param['sortCol'] = 'gbn_cd';
	_param['sortTyp'] = 'ASC';
	_common.callAjax("/sysMng/getIconMngView.do", _param, function(view){
		$("#contentWrap").dialog("close").html(view).dialog("open");
	});
}
/* $("#btn-img").click(function(){
	var _str = "<img width='100px' alt='aa' src='../sym/getSymbol.do?mgrNo='SYM0000001' onerror='this.src=\"../res/img/no_img.png\"'>";
	$('#target').html(_str);
}); */

</script>
<%-- <script type="text/javascript" src="<%= context %>/res/geomex.xeus.system.mng.icon.js"></script> --%>
<div class="contentWrapper">

	<!-- 180517 이은규 아이콘 로딩되는 화면이 지저분해서 페이지가 로드되면 보이도록 변경 -->
	<div id="wrap">
<!-- 		<div id="title">아이콘관리</div> -->
		<div id="search" class="box_style">
			<div class="info_box wd100">
				<div>
					<span>심볼 추가 구분</span>
					<select id="gbn" style="width:165px;">
						<option value="">선택하여 주십시오.</option>
		<%
		while (symCdItr.hasNext()) {
		     String str = (String) symCdItr.next();
		%>
						<option value="<%=str%>"><%=symCdMap.get(str)%></option>
		<%
		 }
		%>
					</select>
					<!-- <button class="paleBtn" id="btn-sch" style="margin-left:5px;">검색</button> -->
			        <button class="paleBtn btn_style2" id="btn-upload" style="margin-left:5px;">파일첨부</button>
			        <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
			            <input type="text" name="p" id="p" class="hidden" value=""><!-- \\upload\\tvius\\rqst\\ -->
			            <input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z">
			        </form>
				</div>
			</div>
		</div>
		<div id="target"></div>

        <div id="content" style="max-height: none !important;" class="customScroll">

           <table id="userList">
           		<thead>
           			<tr>
	           			<th>심볼 종류</th>
	           			<th>파일명</th>
	           			<th>업로드 이미지</th>
	           			<th>관리</th>
           			</tr>
           		</thead>
<%
	if(list.size() == 0){
%>
				<tr>
					<td colspan="4" style="height: 300px;">아이콘이 존재하지 않습니다.</td>
				</tr>
<%
	} else {
    	for(int i=0; i<list.size(); i++) {
%>
                <tr>
                	<td><%= symCdMap.get(list.get(i).getGbnCd()) %></td>
                	<td><%= list.get(i).getFileNm() %></td>
                	<td>
                		<img width="40px" alt="<%= list.get(i).getFileNm() %>" src="./sym/getSymbol.do?mgrNo=<%= list.get(i).getMgrNo() %>" onerror='this.src="../res/img/no_img.png"'>
                	</td>
                	<td><button class="btn-del btn_style2" mgrno="<%= list.get(i).getMgrNo() %>">삭제</button></td>
                </tr>
<%
    	}
    }
%>
            </table>
        </div>
	</div>
</div>
