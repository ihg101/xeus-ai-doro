<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="gmx.gis.bigdata.service.BigDataAnalyDataVo"%> --%>
<%-- <%@ page import="gmx.gis.sysmgr.service.LayerDescVo"%> --%>
<%@ page import="gmx.gis.sysmgr.service.GMT_ColumnVo"%>
<%@ page import="gmx.gis.util.code.GMT_StrUtil"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_AuthVo"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_AuthGrpVo"%>
<%@ page import="gmx.gis.layer.service.GMT_LayerGroupVo"%>

<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<GMT_ColumnVo> column = (ArrayList<GMT_ColumnVo>) request.getAttribute("column");

ArrayList<GMT_LayerGroupVo> list = (ArrayList<GMT_LayerGroupVo>)request.getAttribute("result");
// ArrayList<GMT_AuthGrpVo> grpList = (ArrayList<GMT_AuthGrpVo>)request.getAttribute("grpList");


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
<!-- <link rel="stylesheet" type="text/css" href="./res/css/GMT/xeus.layerAuth.css"> -->
<!-- <link rel="stylesheet" href="http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> -->




<style>
/* 	#wrap {box-sizing:border-box; padding: 15px;} */
	#search {display: flex; flex-flow: nowrap; align-items: center;}
	#search input {width: auto;}
	#search > span {display: inline-block; margin: 0 5px 0 10px;}

	#edit_pop_wrap {display: none; width: 500px; background-color: #fff; box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.3); box-sizing: border-box; padding: 15px;}
	#edit_pop_wrap button {display: inline-block;}

	#layerAuthListWrap .tblWrapper {
		width: 250px;
		float: left;
		height:100%;
	/* 	max-height: 500px; */
		overflow-y: scroll;
		overflow-x: hidden;
		margin-right:10px;
	}
	#layerAuthListWrap .tblWrapper .authNm {
		text-align: left !important;
	}

	#layerGroupManageWrap ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		margin-bottom: 10px;
	}

	#layerGroupManageWrap li {
		margin: 6px;
		padding: 6px;
/* 		width: 150px; */
	}

/* 	#list > tbody > tr > td { */
/* 		border-right: 1px solid #333; */
/* 	} */
</style>
<script type="text/javascript" src="./res/GMT/gmx.gis.auth.layerGroupMng.js"></script>
<!-- <script src="https://code.jquery.com/jquery-1.12.4.js"></script> -->
<!--  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> -->
<script type="text/javascript">
var gbn = '<%=gbn%>';

</script>
<title>권한 관리 | XEUS-Platform</title>

    <div id="wrap">
<!--    <div id="title">권한 관리</div> -->
		<div id="search" class="box_style">
            <div class="info_box wd100">
            	<div>
            		<input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="그룹명칭" style="width: 140px;"><button id="searchBtn" class="btn_style2">검색</button>
	            	<button id="addBtn" class="btn_Dstyle">신규추가</button>
	            	<button id="delBtn" class="btn_Dstyle2">삭제</button>
	<%--             <span id="count">총 <%= request.getAttribute("grpCount") %>개의 그룹 정보가 검색되었습니다.</span> --%>
            	</div>
            </div>
        </div>
        <div id="content" class="customScroll" data-mcs-theme="minimal-dark" style="max-height: 100%;">
            <table id="list" style="position: relative; height: auto;">
                <thead>
                    <tr>
<!--                         <th>그룹목록</th> -->
                        <th>레이어 그룹</th>
                        <th colspan=3>레이어</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>

                        <td style="width: 190px; vertical-align: top; text-align: initial;">
                            <ul class="lyrGrpSortable customScroll" id="lyrGrpList">
							<%
								int myLayerMgrSeq=0;
								String myLayerGrpNm="";
								for(int i=0; i<list.size(); i++){
									if(list.get(i).getMgrSeq() == 6 || list.get(i).getMgrSeq() == 4){
										continue;
									}
									if(list.get(i).getMgrSeq() == 3){
										myLayerMgrSeq = list.get(i).getMgrSeq();
										myLayerGrpNm = list.get(i).getGrpNm();
										continue;
									}
									int mgrSeq = list.get(i).getMgrSeq();
									String grpNm= list.get(i).getGrpNm();
							%>
									<li ><input class='lyrGrp' type="radio" name = "lyrGrp" k='<%= mgrSeq %>'/><label class="lyrGrpNm" style="margin-left: 10px;" k='<%= mgrSeq %>'><%= grpNm %></label></li>
							<%
								}
								if(myLayerMgrSeq != 0){
							%>
									<li class='disable-sort-item'><input class='lyrGrp' type="radio" name = "lyrGrp" k='<%= myLayerMgrSeq %>'/><label class="lyrGrpNm" style="margin-left: 10px;"><%= myLayerGrpNm %></label></li>
							<%
								}
							%>


                            </ul>
                        </td>
                        <td></td>
                        <td></td>
                        <td style="vertical-align: top;"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="4">그룹 변경 시 서버에 즉시 반영됩니다.</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
     <div class="bpopup" id="edit_pop_wrap">
	    <div id="bpop_wrap" class="table_style">
	        <h2 id="bpop_title">레이어 그룹 관리</h2>
	        <table>
	            <tr class="hidden">
	                <th class="top">그룹ID</th>
	                <td>
	                    <input type="text" class="sendData" id="authGrpNo" />
	                </td>
	            </tr>
	            <tr class="top">
	                <th class="top">레이어 그룹명</th>
	                <td>
	                    <input type="text" class="sendData" id="grpNm" />
	                </td>
	            </tr>
	        </table>
	        <table>
	            <tr align="center">
	                <td class="lastTd" colspan="2" style="border: 0 !important;">
	                    <button id="saveBtn" class="btn_style" tabindex="4">저장</button>
<!-- 	                    <button id="delBtn" class="btn_style" tabindex="4">삭제</button> -->
	                    <button id="closeEditPop" class="bpopClose btn_Dstyle" style="width:32.5%;" tabindex="5">취소</button>
	                </td>
	            </tr>
	        </table>
	    </div>
	</div>



