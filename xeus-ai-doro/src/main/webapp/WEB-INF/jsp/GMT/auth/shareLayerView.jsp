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
<%-- <link rel="stylesheet" type="text/css" href="<%= context %./res/css/GMT/xeus.shareLayer.css">
<link rel="stylesheet" href="http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
--%>


<%-- <link rel="stylesheet" type="text/css" href="<%= context %./res/css/GMT/xeus.layout.css"> --%>
<style>
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
/*  #list > tbody > tr > td {  */
/*  	border-right: 1px solid #333;  */
/*  }  */
</style>
<script type="text/javascript" src="./res/GMT/gmx.gis.auth.shareLayer.js"></script>
<!-- <script src="https://code.jquery.com/jquery-1.12.4.js"></script> -->
<!--  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> -->
<script type="text/javascript">
var gbn = '<%=gbn%>';


</script>
<title>권한 관리 | XEUS-Platform</title>

    <div id="wrap" style="height: 98%;">

<!--    <div id="title">권한 관리</div> -->
        <div id="content" class="customScroll" data-mcs-theme="minimal-dark" style="height: 100%;">
            <table id="list" style="position: relative; height: 100%;">
                <thead>
                    <tr>
                        <th style="width:15%;">그룹목록</th>
                        <th style="width:15%;">레이어 그룹</th>
                        <th>레이어</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 190px; vertical-align: top;">
                            <select class="customScroll" id="authGrpList" multiple="multiple" style="height: 100%;">
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
                        <td style="width: 190px; vertical-align: top;">
                            <select class="customScroll" id="lyrGrpList" multiple="multiple" style="height: 100%;">
							<%
								for(int i=0; i<list.size(); i++){
									if(list.get(i).getMgrSeq() == 3){
										int mgrSeq = list.get(i).getMgrSeq();
										String grpNm= list.get(i).getGrpNm();
								%>
										<option class='lyrGrp' k='<%= mgrSeq %>'><%= grpNm %></option>
							<%
									}
								}
							%>
                            </select>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">권한 설정시 서버에 즉시 반영됩니다.</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>



