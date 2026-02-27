<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.sysmgr.service.IpVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<IpVo> list = (ArrayList<IpVo>)request.getAttribute("result");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String searchStr = map.get("orgNm");
if(searchStr == null) searchStr = "";
%>

<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.ip.css"> -->
<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.ip.js"></script>
	<input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />


	<div class="contentWrapper">
	    <div id="wrap" >
<!-- 	        <div id="title">허용IP관리</div> -->
	        <div id="search" class="box_style">
	            <div class="info_box wd100">
	            	<div>
	            		<input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="사용기관" style="width: 140px;"><button class="btn_style2" id="searchBtn">검색</button>
			            <button class="btn_Dstyle" id="addBtn">신규추가</button>
			            <span id="count">총 <%= request.getAttribute("count") %>개의 IP 정보가 검색되었습니다.</span>
	            	</div>
	            </div>
	        </div>
	        <div id="content">
	           <table id="list">
	                <thead>
	                    <tr>
	<%
	for(int i=0; i<column.size(); i++){
		if("xeus.mt_allow_ip".equals(column.get(i).getTblId())){
	%>
	                        <th><%= column.get(i).getColNm() %></th>
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
	                        <td colspan="8"><b>검색결과가 존재하지 않습니다.</b></td>
	                    </tr>
	<%
	}else{
	    for(int i=0; i<list.size(); i++){
		String useYn = "적용";
		if("N".equals(list.get(i).getUseYn())) useYn = "미적용";
	%>
	                    <tr>
	                        <td><%= list.get(i).getMgrSeq() %></td>
	                        <td><%= list.get(i).getStartIpNo() %></td>
	                        <td><%= list.get(i).getEndIpNo() %></td>
	                        <td><%= list.get(i).getWorkerId() %></td>
	                        <td><%= list.get(i).getOrgNm() %></td>
	                        <td><%= list.get(i).getLastMdfyDat() %></td>
	                        <td><%= useYn %></td>
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

	        <div class="bpopup" id="edit_pop_wrap" style="display: none;">
			    <div id="bpop_wrap">
<!-- 			        <h2 id="bpop_title">IP 관리</h2> -->
			        <table>
			            <tr class="hidden">
			                <th class="top">관리번호</th>
			                <td>
			                    <input type="text" class="sendData" id="mgrSeq" />
			                </td>
			            </tr>
			            <tr class="top">
			                <th class="top">시작IP</th>
			                <td>
			                    <input type="text" class="sendData" id="startIpNo" />
			                </td>
			            </tr>
			            <tr>
			                <th class="top">종료IP</th>
			                <td>
			                    <input type="text" class="sendData" id="endIpNo" />
			                </td>
			            </tr>
			            <tr>
			                <th class="top">사용기관명</th>
			                <td>
			                    <select class="sendData" id="orgMgrNo">
			<% for(int i=0; i<orgz.size(); i++){ %>
			                        <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
			<% } %>
			                    </select>
			                </td>
			            </tr>
			            <tr>
			                <th class="top">적용여부</th>
			                <td>
			                    <select class="sendData" id="useYn">
			                        <option value="Y">적용</option>
			                        <option value="N">미적용</option>
			                    </select>
			                </td>
			            </tr>
			        </table>
			        <table>
			            <tr align="center">
			                <td class="lastTd" colspan="2" style="border: 0 !important;">
			                    <button class="btn_style2" id="saveBtn" tabindex="4">저장</button>
			                    <button class="btn_Dstyle2" id="delBtn" tabindex="4">삭제</button>
<!-- 			                    <button class="btn_style2" id="closeEditPop" class="bpopClose" tabindex="5">취소</button> -->
			                </td>
			            </tr>
			        </table>
			    </div>
			</div>

	    </div>
    </div>
