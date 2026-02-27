<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.sysmgr.service.SymIconVo"%>
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
 * GOV
 */
HashMap<String, String> govMap = cde.convertCodeGrpToAllCde("C70");
Set<String> govKey = new TreeSet<String>(govMap.keySet());
Iterator<String> govItr = govKey.iterator();

ArrayList<SymIconVo> rst = (ArrayList<SymIconVo>)request.getAttribute("symicon");

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
}

HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

%>
<meta http-equiv="Expires" content="Mon, 06 Jan 1990 00:00:01 GMT">
<meta http-equiv="Expires" content="-1">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.iconMng.css">
<script type="text/javascript">
var ctxPath = "<%= context %>";
var subPath = "<%= param.get("subPath") %>";
var symGrp = "<%= param.get("symGrp") %>";
var iconList = null;
</script>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.system.mng.icon.js"></script>
<title>관공서 아이콘 관리 | XEUS-Platform</title>
</head>
<body>
<div>

	<!-- 180517 이은규 아이콘 로딩되는 화면이 지저분해서 페이지가 로드되면 보이도록 변경 -->
	<div id="wrap" style="display: none;">
        <p class="searchTitle">
            <button class="iconTab" url="/sysMng/getCctvIconMngView.do" mode="ctv" subpath="cctv">CCTV 아이콘 관리</button>
            <button class="iconTab" active="active" url="/sysMng/getGovIconMngView.do" mode="gov" subpath="gov">관공서 아이콘 관리</button>
            <button class="iconTab" url="/sysMng/getDistIconMngView.do" mode="evt" subpath="evt">긴급재난상황 아이콘 관리</button>
        </p>
        <div id="title">관공서 아이콘관리</div>
        <div id="content">

           <table class="list">
<%
    int cnt = 0;
    while (govItr.hasNext()) {
        String str = (String) govItr.next();
        if( (cnt % 2) == 0 ){
%>
                <tr>
<%
        }
%>
                    <th><%= govMap.get(str) %></th>
                    <td valign="middle">
<%
        if(iconJson.containsKey(str)){
            JSONObject targetJson = (JSONObject) iconJson.get(str);
            Set<String> keySet = new TreeSet<String>(targetJson.keySet());
            Iterator<String> key = keySet.iterator();
            while(key.hasNext()){
                String keyStr = (String) key.next();
%>
                        <input type="radio" class="selectIcon" name="selectIcon" value="<%= str %>" icontyp="<%=keyStr%>">
                        <img src="<%= context %>/res/sym/<%= param.get("subPath") %>/<%= targetJson.get(keyStr) %>" />
<%
            }
        }
%>
                    </td>

<%
        if( (cnt % 2) == 1 ){
%>
                </tr>
<%
        }
        cnt ++;
    }
    if( (cnt % 2) == 1){
%>
                    <th></th>
                    <td></td>
                </tr>
<%
    }
%>
            </table>
        </div>
        <div class="btnDiv">
            <button id="editPopBtn" class="whiteBtn">수정</button>
            <button id="regPopBtn" class="whiteBtn">등록</button>
            <button id="delBtn" class="whiteBtn">삭제</button>
            <button id="iconMngPopBtn" class="whiteBtn">아이콘 관리</button>
            <!-- <button id="getList" class="whiteBtn">리스트</button>
            <button id="getItem" class="whiteBtn">단건</button>
            <button id="del" class="whiteBtn">삭제</button>
            <button id="add" class="whiteBtn">추가</button>
            <button id="edit" class="whiteBtn">수정</button> -->
        </div>

        <div class="bpopup" id="icon_edit_wrap">
            <div id="bpop_wrap">
                <p>이미지 변경</p>
                <input type="hidden" id="iconTyp" name="iconTyp" class="sendData" value=""/>
                <input type="hidden" id="gbnCd" name="gbnCd" class="sendData" value=""/>
                <table>
                    <tr>
                        <th>아이콘 목록</th>
                    </tr>
                    <tr>
                        <td class="target" style="height: 500px;">
                            <div class="iconlist" style="overflow-y: scroll; height: 100%; width: 100%;">
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="btnDiv">
                    <button id="saveBtn" tabindex="4">저장</button>
                    <button class="bpopClose" tabindex="5" popup="icon_edit_wrap">취소</button>
                </div>
            </div>
        </div>

        <div class="bpopup" id="icon_reg_wrap">
            <div id="bpop_wrap" class="reg_wrap">
                <p>심벌 등록</p>
                <table>
                    <tr>
                        <th>구분</th>
                        <td>
                            <select id="regGbnCd" class="sendData">
                                <option value="">선택하여 주십시오</option>
<%
    govItr = govKey.iterator();
    while (govItr.hasNext()) {
        String str = (String) govItr.next();
%>
                                <option value="<%= str %>"><%= govMap.get(str) %></option>
<%
    }
%>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>아이콘 타입</th>
                        <td>
                            <select id="regIconTyp" class="sendData">
                                <option value="">선택하여 주십시오</option>
                                <option value="N">기본</option>
                                <!-- <option value="P">영상 재생</option> -->
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>아이콘 선택</th>
                        <td class="target" style="width: 300px !important; height: 500px;">
                            <div class="iconlist" style="overflow-y: scroll; height: 100%; width: 100%;">
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="btnDiv">
                    <button id="regBtn" tabindex="4">등록</button>
                    <button class="bpopClose" tabindex="5" popup="icon_reg_wrap">취소</button>
                </div>
            </div>
        </div>

        <div class="bpopup" id="icon_mng_wrap">
            <div id="bpop_wrap" class="mng_wrap">
                <p>아이콘 관리</p>
                <table>
                    <tr>
                        <th>아이콘 목록</th>
                        <th>업로드</th>
                    </tr>
                    <tr>
                        <td class="target" style="height: 500px;">
                            <div class="iconlist" style="overflow-y: scroll; height: 100%; width: 100%;">
                            </div>
                        </td>
                        <td >
                            <div id="upFile">
                            </div>
                            <input type="hidden" id="regFileNm" name="regFileNm" value=""/>
                            <button id="btnUpload" style="height: 25px; margin:3px 0px 0px 3px;">파일첨부</button>
                            <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
                                <input type="text" name="p" id="p" class="hidden" value="\\sym\\<%=param.get("subPath")%>\\"><!-- \\upload\\tvius\\rqst\\ -->
                                <input type="file" id="uploadImg" name="uploadImg" class="hidden" accept=".png"><!-- <input type="file" name="uploadImg" id="uploadImg" class="hidden" > -->
                            </form>
                        </td>
                    </tr>
                </table>
                <div class="btnDiv">
                    <button class="iconUploadBtn" tabindex="4">추가</button>
                    <button class="iconDelBtn" tabindex="5">삭제</button>
                    <button class="bpopClose" tabindex="6" popup="icon_mng_wrap">취소</button>
                </div>
            </div>
        </div>

	</div>
</div>
