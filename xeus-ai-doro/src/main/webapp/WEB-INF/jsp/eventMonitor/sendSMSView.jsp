<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="gmx.gis.bigdata.service.BigDataAnalyDataVo"%> --%>
<%-- <%@ page import="gmx.gis.sysmgr.service.LayerDescVo"%> --%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.SysPropVo"%>
<%-- <%@ page import="gmx.gis.layer.service.GMT_LayerGroupVo"%> --%>

<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%

// ArrayList<GMT_LayerGroupVo> list = (ArrayList<GMT_LayerGroupVo>)request.getAttribute("result");
ArrayList<AuthGrpVo> grpList = (ArrayList<AuthGrpVo>)request.getAttribute("grpList");

// ArrayList<SysPropVo> list = (ArrayList<SysPropVo>)request.getAttribute("result");

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
#contentWrap .tblWrapper {
	width: 250px;
	float: left;
	height:100%;
/* 	max-height: 500px; */
	overflow-y: scroll;
	overflow-x: hidden;
	margin-right:10px;
}
#contentWrap .tblWrapper .authNm {
	text-align: left !important;
}

#contentWrap ul {
	list-style-type: none;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
}

#contentWrap li {
	list-style-type: none;
    margin: 0;
    box-sizing: border-box;
    padding: 0 15px;
    margin-bottom: 10px;
}
/* #list > tbody > tr > td { */
/* 	border-right: 1px solid #333; */
/* } */
</style>
<script type="text/javascript" src="./res/menu/eventView/geomex.xeus.sendSMS.js"></script>
<!-- <script src="https://code.jquery.com/jquery-1.12.4.js"></script> -->
<!--  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> -->
<script type="text/javascript">
var gbn = '<%=gbn%>';

var sendSmsList = [];

</script>
<title>권한 관리 | XEUS-Platform</title>
<div class="contentWrapper customScroll" style="height:100%;">
    <div id="wrap" style="height: 95%;">

<!--    <div id="title">권한 관리</div> -->
        <div id="content" class="customScroll" data-mcs-theme="minimal-dark" style="height: 100%">

            <table id="list" class="customScroll" style="position: relative; height: 100%;">
                <thead>
                    <tr>
                        <th style="width:10%;">그룹목록</th>
                        <th style="width:10%;">사용자</th>
                        <th style="width:30%;">SMS 전송 </th>
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
								}
							%>
                            </select>
                        </td>
                        <td style="width: 190px; vertical-align: top;" class ="customScroll">
<!--                             <select class="customScroll" id="lyrGrpList" multiple="multiple" style="height: 100%;"> -->
<%-- 							<% --%>
<!--  								for(int i=0; i<list.size(); i++){ -->
<!-- 									if(list.get(i).getMgrSeq() == 3 || list.get(i).getMgrSeq() == 4){ -->
<!--  										continue; -->
<!--  									} -->
<!--  									int mgrSeq = list.get(i).getMgrSeq(); -->
<!--  									String grpNm= list.get(i).getGrpNm(); -->
<%-- 							%> --%>
<%-- 									<option class='lyrGrp' k='<%= mgrSeq %>'><%= grpNm %></option> --%>
<%-- 							<% --%>

<!--  								} -->
<%-- 							%> --%>
<!--                             </select> -->
                        </td>
                        <td>
<%--                         	<input id="tviusAdminSmsList" style="width:200px;" type="hidden" class="sendData"  value="<%= adminSmsListStr %>"> --%>
                        	<div style="line-height:30px"></div>



                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    	<th></th>
                    	<th></th>
                        <th colspan="1"><button id="writeCmBtn" class="btn_style">내용 입력</button></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>


