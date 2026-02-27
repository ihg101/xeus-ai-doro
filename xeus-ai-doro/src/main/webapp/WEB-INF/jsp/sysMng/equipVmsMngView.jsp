<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.equipmgr.service.VmsVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<VmsVo> list = (ArrayList<VmsVo>)request.getAttribute("result");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String searchStr = map.get("vmsNm");
String gbn = map.get("gbn");
String sortCntrl = map.get("sortCntrl");
String limit = map.get("limit");
if(searchStr == null) searchStr = "";
%>
<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.notice.css"> -->
<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.vms.js"></script>
<script type="text/javascript" src="./common/sysMngSort.js"></script>
<script type="text/javascript">
var offset="<%= offset %>";
var gbn="<%= gbn %>";
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";
var limit = "<%= limit %>";

// _common.callAjax("/sysMng/getEquipTopMenuView.do", {'gbn': gbn}, function(view) {
// 	$(".contentWrapper").find("#menuWrap").html('');
// 	$(".contentWrapper").find("#menuWrap").html(view);
// });
</script>
    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->

    <div id="wrap" class="contentWrapper">
<!--     	<div id="menuWrap"> -->
<!--         </div> -->
<!--         <div id="title">VMS관리</div> -->
        <div id="search" class="box_style">
        	<div class="info_box wd100">
        		<div>
        			<input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="VMS명" style="width: 140px;">
                    <label>LIMIT</label>
                    <input type="text" id="limit" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">
                    <button class="btn_style2" id="searchBtn">검색</button>
		            <button class="btn_Dstyle" id="addBtn">신규추가</button>
		            <span id="count">총 <%= request.getAttribute("count") %>개의 VMS 정보가 검색되었습니다.</span>
        		</div>
        	</div>
        </div>
        <div id="content">
           <table>
<!--            		<colgroup> -->
<!-- 					<col width="150px"> -->
<!-- 					<col width="150px"> -->
<!-- 					<col width="150px"> -->
<!-- 					<col width="150px"> -->
<!-- 					<col width="100px"> -->
<!-- 					<col width="100px"> -->
<!-- 					<col width="100px"> -->
<!-- 					<col width=""> -->
<!-- 					<col width="60px"> -->
<!-- 				</colgroup> -->
                <thead>
                    <tr>
<%
String targetCol="";
for(int i=0; i<column.size(); i++){
	if("xeus.asset_cctv_vms".equals(column.get(i).getTblId())){
		String col = column.get(i).getColNm();

		if(col.equals("관리번호"))	targetCol = "mgr_no";
		else if(col.equals("VMS타입명"))	targetCol = "vms_typ";
		else if(col.equals("VMS명"))	targetCol = "vms_nm";
		else if(col.equals("IP주소"))	targetCol = "ip_addr";
		else if(col.equals("Port번호"))	targetCol = "port_num";
		else if(col.equals("접속ID"))	targetCol = "con_id";
		else if(col.equals("접속암호"))	targetCol = "con_pwd";
		else if(col.equals("비고"))	targetCol = "rmark";

		col = "<span id='" + targetCol + "' class='mngSortBtn' url='/vms/getVmsView.do' >" + col + "</span>";
%>
                        <th><%= col %></th>
<%
	}
}
%>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
<%
if(list.size() == 0){
%>
                    <tr>
                        <td colspan="9"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list.size(); i++){
%>
                    <tr>
                        <td><%= list.get(i).getMgrNo() %></td>
                        <td><%= list.get(i).getVmsTyp() %></td>
                        <td><%= list.get(i).getVmsNm() %></td>
                        <td><%= list.get(i).getIpAddr() %></td>
                        <td><%= list.get(i).getPortNum() %></td>
                        <td><%= list.get(i).getConId() %></td>
                        <td><%= list.get(i).getConPwd() %></td>
                        <td><%= list.get(i).getRmark() %></td>
                        <td><button class="mngBtn btn_style2" k="<%= list.get(i).getMgrNo() %>">변경</button></td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>
        </div>
        <div class="paging_wrap"></div>
    </div>

    <div class="bpopup" id="vms_edit_pop_wrap">
    <div id="bpop_wrap">
<!--         <h2 id="bpop_title"> -->
<!--                         VMS 관리 -->
<!--             <img id="closeEditPop" class="bpopClose" style="width:16px;height:16px;float:right;background-color:#00000000" src="/xeus/res/img/delete_normal.png"> -->
<!--         </h2> -->
        <table>
            <tr class="hidden">
                <th class="top">관리번호</th>
                <td>
                    <input type="text" class="sendData" id="mgrNo" name="mgrNo" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">VMS타입명</th>
                <td>
                    <input type="text" class="sendData" id="vmsTyp" name="vmsTyp" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">VMS명</th>
                <td>
                    <input type="text" class="sendData" id="vmsNm" name="vmsNm" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">IP주소</th>
                <td>
                    <input type="text" class="sendData" id="ipAddr" name="ipAddr" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">Port번호</th>
                <td>
                    <input type="text" class="sendData" id="portNum" name="portNum" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">접속ID</th>
                <td>
                    <input type="text" class="sendData" id="conId" name="conId" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">접속암호</th>
                <td>
                    <input type="text" class="sendData" id="conPwd" name="conPwd" />
                </td>
            </tr>
            <tr class="top">
                <th class="top">비고</th>
                <td>
                    <input type="text" class="sendData" id="rmark" name="rmark" />
                </td>
            </tr>
        </table>
        <table>
           <tfoot>
	           	 <tr align="center">
	                <td class="lastTd" colspan="2" style="border: 0 !important;">
	                    <button class="btn_style2" id="saveBtn" tabindex="4">저장</button>
	                    <button class="btn_Dstyle2" id="delBtn" tabindex="4">삭제</button>
	                    <!-- <button id="closeEditPop" class="bpopClose" tabindex="5">취소</button> -->
	                </td>
	            </tr>
           </tfoot>
        </table>
    </div>
</div>

