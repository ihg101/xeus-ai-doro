<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthVo"%>
<%@ page import="geomex.xeus.sysmgr.service.AuthGrpVo"%>
<%@ page import="geomex.xeus.sysmgr.service.SysPropVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<AuthGrpVo> grpList = (ArrayList<AuthGrpVo>)request.getAttribute("grpList");

ArrayList<SysPropVo> list = (ArrayList<SysPropVo>)request.getAttribute("result");

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

String adminSmsListStr = "";
String pestAdminSmsListStr = "";
for(int i=0; i<list.size(); i++){
    if("tvius.admin_sms_list".equals(list.get(i).getPropKey())){
    	adminSmsListStr = StrUtil.chkNull(list.get(i).getPropValue());
    }
}
%>

<style>
#contentWrap .tblWrapper {
	width: 250px;
	float: left;
	height:100%;
/* 	max-height: 500px; */
/* 	overflow-y: scroll; */
/* 	overflow-x: hidden; */
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
    padding: 0;
    margin-bottom: 10px;
}
</style>
<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.userAuth.js"></script>
<script type="text/javascript">
var gbn = '<%=gbn%>';
var adminSmsListStr =  '<%= adminSmsListStr %>';
var adminSmsList = adminSmsListStr.split("||");

var pestAdminSmsListStr =  '<%= pestAdminSmsListStr %>';
var pestAdminSmsList = pestAdminSmsListStr.split("||");
</script>

<div class="contentWrapper">
    <div id="wrap" style="height: 95%;">
        <div id="content" class="table_style" data-mcs-theme="minimal-dark" style="height: 100%; overflow: hidden;">
            <table id="list" style="position: relative; height: 100%;">
                <thead>
                    <tr>
                        <th style="width:10%;">그룹목록</th>
                        <th style="width:10%;">사용자</th>
                        <th style="width:10%;">반출 SMS 발송목록</th>
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
                        </td>
                        <td>
                        	<div style="line-height:30px">
							</div>
                        </td>
                    </tr>
                </tbody>
                <!-- <tfoot>
                    <tr>
                        <th colspan="4">권한 설정시 서버에 즉시 반영됩니다.</th>
                    </tr>
                </tfoot> -->
            </table>
        </div>
    </div>
</div>


