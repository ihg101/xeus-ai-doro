<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.NoticeVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<NoticeVo> list = (ArrayList<NoticeVo>)request.getAttribute("result");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String searchStr = map.get("notcTitle");
String gbn = map.get("gbn");
String sortCntrl = map.get("sortCntrl");
String limit = map.get("limit");
if(searchStr == null) searchStr = "";
%>
<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.notice.css"> -->
<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.notice.js"></script>
<script type="text/javascript" src="./common/sysMngSort.js"></script>
<script type="text/javascript">
var notcTitle = "<%=searchStr%>";
var offset="<%= offset %>";
var gbn = '<%=gbn%>';
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";
var limit = "<%= limit %>";
// _common.callAjax("/sysMng/getBasicTopMenuView.do", {'gbn': gbn}, function(view) {
// 	$(".contentWrapper").find("#menuWrap").html('');
// 	$(".contentWrapper").find("#menuWrap").html(view);
// });

// $(document).ready(function(){
// 	$("#wrap").find("#content").css("max-height", $("#list").height() + 5)
// 	$(".contentWrapper").find("#content").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height()-220);
// });

// $(window).on('resize', function () {
// 	$(".contentWrapper").find("#content").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height()-220);
// });

</script>
    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->
	<div class="contentWrapper">
	    <div id="wrap">
<!-- 	    	<div id="menuWrap"> -->
<!-- 	        </div> -->
<!-- 	        <div id="title">공지사항관리</div> -->
	        <div id="search" class="box_style">
	            <div class="info_box wd100">
	            	<div>
	            		<input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="제목" style="width: 140px;">
                        <label>LIMIT</label>
                        <input type="text" id="limit" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">
                        <button class="btn_style2" id="searchBtn">검색</button>
		                <button class="btn_Dstyle" id="addBtn">신규추가</button>
		                <span id="count">총 <%= request.getAttribute("count") %>개의 공지사항 정보가 검색되었습니다.</span>
	            	</div>
	            </div>
	        </div>
	        <div id="content" class="resizeWrap">
	           <table>
<!-- 	           		<colgroup> -->
<!-- 						<col width="110"> -->
<!-- 						<col width=""> -->
<!-- 						<col width="150"> -->
<!-- 						<col width="150"> -->
<!-- 						<col width="300"> -->
<!-- 						<col width="150"> -->
<!-- 						<col width="70"> -->
<!-- 					</colgroup> -->
	                <thead>
	                    <tr>
	<%
	String targetCol="";
	for(int i=0; i<column.size(); i++){
		if("xeus.mt_notc_list".equals(column.get(i).getTblId())
			&& !"atch_file_path".equals(column.get(i).getColId())
			&& !"notc_conts".equals(column.get(i).getColId())
		    && !"open_type".equals(column.get(i).getColId())){
			String col = column.get(i).getColNm();

			if(col.equals("관리순서번호"))	targetCol = "mgr_seq";
			else if(col.equals("제목"))	targetCol = "notc_title";
			else if(col.equals("등록자ID"))	targetCol = "worker_id";
			else if(col.equals("최종수정일시"))	targetCol = "last_mdfy_dat";
			else if(col.equals("첨부파일명"))	targetCol = "atch_file_nm";
// 			else if(col.equals("공개범위"))	targetCol = "open_type";

			col = "<span id='" + targetCol + "' class='mngSortBtn' url='/notice/getNoticeView.do' >" + col + "</span>";
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
	                        <td colspan="6"><b>검색결과가 존재하지 않습니다.</b></td>
	                    </tr>
	<%
	}else{
	    for(int i=0; i<list.size(); i++){
		String key = list.get(i).getMgrSeq();
		String file = StrUtil.chkNull(list.get(i).getAtchFileNm());
	%>
	                    <tr>
	                        <td><%= key %></td>
	                        <td><%= list.get(i).getNotcTitle() %></td>
	                        <td><%= list.get(i).getWorkerId() %></td>
	                        <%-- <td><%= list.get(i).getNotcConts() %></td> --%>
	                        <td><%= DateUtil.formatDate(list.get(i).getLastMdfyDat()) %></td>
	                        <td class="downBtn" k="<%= file %>" u="<%= key %>" ><%= file %></td>
	                        <td class="hidden"><%= list.get(i).getOpenType() %></td>
	                        <td><button class="mngBtn btn_style2" k="<%= list.get(i).getMgrSeq() %>">변경</button></td>
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

	    <div class="bpopup" id="notice_edit_pop_wrap">
	    <div id="bpop_wrap">
<!-- 	        <h2 id="bpop_title"> -->
<!-- 	                        공지사항 관리 -->
<!-- 	            <img id="closeEditPop" class="bpopClose" style="width:16px;height:16px;float:right;background-color:#00000000" src="/xeus/res/img/delete_normal.png"> -->
<!-- 	        </h2> -->
	        <form id="sendForm" method="POST" enctype="multipart/form-data">
		        <table>
		            <tr class="hidden">
		                <th class="top">관리번호</th>
		                <td>
		                    <input type="text" class="sendData" id="mgrSeq" name="mgrSeq" />
		                </td>
		            </tr>
		            <tr class="top">
		                <th class="top" style="width:100px;">제목</th>
		                <td>
		                    <input type="text" class="sendData" id="notcTitle" name="notcTitle" />
		                </td>
		            </tr>
		            <tr>
		                <th class="top">내용</th>
		                <td>
		                    <textarea style="height:270px" class="sendData" id="notcConts" name="notcConts"></textarea>
		                </td>
		            </tr>
		            <tr class="top hidden">
		                <th class="top">공개범위</th>
		                <td>
		                    <select class="sendData" id="openType" name="openType">
		                    	<option value="전체">전체</option>
		                    	<option value="내부">내부</option>
		                    	<option value="외부">외부</option>
		                    </select>
		                </td>
		            </tr>
		            <tr>
		                <th class="top">첨부파일</th>
		                <!-- <td id="formTr" class="hidden">
		                    <input type="file" id="file" name="file" class="wide sendData" size="30" placeholder="첨부파일" />
		                </td>
		                <td id="downTr">
		                    <input type="text" id="fileDown" class="small" readOnly />
		                    <button id="editBtn" type="button">첨부파일 수정</button>
		                </td> -->
	                    <td>
	                        <div id="formTr" class="hidden">
	                            <input type="file" id="file" name="file" class="wide sendData" size="30" placeholder="첨부파일" />
	                        </div>
	                        <div id="downTr">
	                            <input type="text" id="fileDown" class="small" readOnly />
	                            <button class="btn_Dstyle" id="editBtn" type="button">첨부파일 수정</button>
	                        </div>
	                    </td>
		            </tr>
		        </table>
	        </form>
	        <table>
	            <tfoot>
	            	<tr align="center">
		                <td class="lastTd" colspan="2" style="border: 0 !important;">
		                    <button class="btn_style" id="saveBtn" tabindex="4">저장</button>
		                    <button class="btn_Dstyle" id="delBtn" tabindex="4">삭제</button>
		                    <!-- <button id="closeEditPop" class="bpopClose" tabindex="5">취소</button> -->
		                </td>
		            </tr>
	            </tfoot>
	        </table>
	    </div>
	</div>
</div>

