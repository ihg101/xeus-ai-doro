<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="gmx.gis.bigdata.service.BigDataAnalyDataVo"%> --%>
<%-- <%@ page import="gmx.gis.sysmgr.service.LayerDescVo"%> --%>
<%@ page import="gmx.gis.sysmgr.service.GMT_ColumnVo"%>
<%@ page import="gmx.gis.util.code.GMT_StrUtil"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_AuthVo"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_AuthGrpVo"%>

<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<GMT_ColumnVo> column = (ArrayList<GMT_ColumnVo>) request.getAttribute("column");

ArrayList<GMT_AuthVo> list = (ArrayList<GMT_AuthVo>)request.getAttribute("result");
ArrayList<GMT_AuthGrpVo> grpList = (ArrayList<GMT_AuthGrpVo>)request.getAttribute("grpList");

/*
 * 190107 이은규
 * 빅데이터 레이어 권한 설정 목록 추가
 */
// ArrayList<BigDataAnalyDataVo> bigDataList = (ArrayList<BigDataAnalyDataVo>)request.getAttribute("bigDataList");

// ArrayList<LayerDescVo> nmsList = (ArrayList<LayerDescVo>)request.getAttribute("nmsList");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String searchStr = map.get("authGrpNm");
String gbn = map.get("gbn");
if(searchStr == null) searchStr = "";

String grp_seochoWard="";
String grp_119center="";
String grp_seochoPol="";
String grp_bangbeaPol="";
%>

<style>
/*
#authListWrap .tblWrapper {
	width: 250px;
	float: left;
	height:100%;
 	max-height: 500px;
	overflow-y: scroll;
	overflow-x: hidden;
	margin-right:10px;
}
*/
/*
#authListWrap .tblWrapper .authNm {
	text-align: left !important;
}
*/
	#wrap {box-sizing:border-box; padding: 15px;}
	#search {display: flex; flex-flow: nowrap; align-items: center;}
	#search input {width: auto;}
	#search > span {display: inline-block; margin: 0 5px 0 10px;}
/* 	#edit_pop_wrap {display: none; width: 500px; background-color: #fff; box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.3); box-sizing: border-box; padding: 15px;} */
/* 	#edit_pop_wrap button {display: inline-block;} */
	.mngBtn {padding: 2px 5px; border: 1px solid #ddd; border-redius: 2px;}
	.paging_wrap {text-align: center;}
	.bpopClose.btn_Dstyle {width: 100%; height: 40px; margin-top: 5px;}
</style>
<script type="text/javascript" src="./res/GMT/gmx.gis.auth.js"></script>
<script type="text/javascript">
var gbn = '<%=gbn%>';


</script>
<title>권한 관리 | XEUS-Platform</title>

    <div id="wrap">

 <!--   <div id="title">권한 관리</div> -->
        <div id="search">
            <input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="그룹명칭"><button id="searchBtn" class="btn_style2">검색</button>
            <button id="addBtn" class="btn_style2">신규추가</button>
            <span id="count">총 <%= request.getAttribute("grpCount") %>개의 그룹 정보가 검색되었습니다.</span>
        </div>
        <div id="content" class="table_style" data-mcs-theme="minimal-dark" style="max-height: 100%;">
            <table id="list" style="position: relative; height: auto;">
                <thead>
                    <tr>
                        <th>그룹목록</th>
                        <th>권한목록</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 190px; vertical-align: top;" class="customScroll">
                            <select class="customScroll"id="authGrpList" multiple="multiple" style="height: 150px;">
							<%
								for(int i=0; i<grpList.size(); i++){
									String grpNm = grpList.get(i).getAuthGrpNm();
							%>
									<option class='grp' k='<%= grpList.get(i).getAuthGrpNo() %>'><%= grpNm %></option>
							<%
									/* if(grpNm.contains("서초구청"))
										grp_seochoWard += "<option class='grp' k='" + grpList.get(i).getAuthGrpNo() + "'>" + grpNm + "</option>";
									else if(grpNm.contains("서울종합방재센터"))
										grp_119center += "<option class='grp' k='" + grpList.get(i).getAuthGrpNo() + "'>" + grpNm + "</option>";
									else if(grpNm.contains("방배경찰서"))
										grp_bangbeaPol += "<option class='grp' k='" + grpList.get(i).getAuthGrpNo() + "'>" + grpNm + "</option>";
									else if(grpNm.contains("서초경찰서"))
										grp_seochoPol += "<option class='grp' k='" + grpList.get(i).getAuthGrpNo() + "'>" + grpNm + "</option>"; */
								}
							%>
                            </select>
                        </td>
                        <td id="authListWrap" class="tCenter" style="vertical-align: top;">
                        	<div style="position: relative; width: 100%; height: 100%; overflow: auto;">
<%
	ArrayList<String> authGbnList = new ArrayList<String>();
	for(int i=0; i<list.size(); i++){
		String authGbn = list.get(i).getAuthGbn();

		if(!authGbnList.contains(authGbn)){
			authGbnList.add(authGbn);
		}
	}

	for(int l=0; l<authGbnList.size(); l++){
%>
								<div class="tblWrapper customScroll" data-mcs-theme="minimal-dark">
		                            <table id="authList">
		                                <!-- <tr style="vertical-align: top;">
		                                    <td style="border: none;"><input type="checkbox" id="allAuth" disabled="disabled"></td>
		                                    <td colspan="2" class="authNm" style="border: none; text-align: left;">전체선택</td>1px solid #F1F1F1 !important
		                                </tr> -->
										<tr class="tCenter">
											<th colspan="2" class="authGbn"><%= authGbnList.get(l) %></th>
										</tr>
<%
		for(int i=0; i<list.size(); i++){
			String authGbn = list.get(i).getAuthGbn();

			if(authGbn.equals(authGbnList.get(l))){
%>
		                                <tr>
		                                    <td width="20px"><input type="checkbox" class="auth" k="<%= list.get(i).getAuthMgrNo() %>" disabled="disabled"></td>
		                                    <td class="authNm"><%= list.get(i).getAuthNm() %></td>
		                                </tr>

		<% } %>
	<% } %>
	                            	</table>
	                            </div>
<% } %>

                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="2">권한 설정시 서버에 즉시 반영됩니다.</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

<!--     <div class="bpopup" id="edit_pop_wrap"> -->
<!-- 	    <div id="bpop_wrap" class="table_style"> -->
<!-- 	        <h2 id="bpop_title">권한 그룹 관리</h2> -->
<!-- 	        <table> -->
<!-- 	            <tr class="hidden"> -->
<!-- 	                <th class="top">권한 그룹ID</th> -->
<!-- 	                <td> -->
<!-- 	                    <input type="text" class="sendData" id="authGrpNo" /> -->
<!-- 	                </td> -->
<!-- 	            </tr> -->
<!-- 	            <tr class="top"> -->
<!-- 	                <th class="top">권한 그룹명</th> -->
<!-- 	                <td> -->
<!-- 	                    <input type="text" class="sendData" id="authGrpNm" /> -->
<!-- 	                </td> -->
<!-- 	            </tr> -->
<!-- 	        </table> -->
<!-- 	        <table> -->
<!-- 	            <tr align="center"> -->
<!-- 	                <td class="lastTd" colspan="2" style="border: 0 !important;"> -->
<!-- 	                    <button id="saveBtn" class="btn_style" tabindex="4">저장</button> -->
<!-- 	                    <button id="delBtn" class="btn_style" tabindex="4">삭제</button> -->
<!-- 	                    <button id="closeEditPop" class="bpopClose btn_Dstyle" style="width:32.5%;" tabindex="5">취소</button> -->
<!-- 	                </td> -->
<!-- 	            </tr> -->
<!-- 	        </table> -->
<!-- 	    </div> -->
<!-- 	</div> -->

