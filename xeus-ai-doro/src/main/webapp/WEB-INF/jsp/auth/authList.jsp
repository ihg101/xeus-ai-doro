<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.bigdata.service.BigDataAnalyDataVo"%>
<%@ page import="geomex.xeus.sysmgr.service.LayerDescVo"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ page import="java.util.Collections"%>
<%@ include file="../common.jsp" %>
<%!
	public class AuthUtil {
    
    	public final String GNB_TEXT = "1. 대메뉴 권한";
	    public final String LNB_TEXT = "2. 소메뉴 권한";
	    public final String EVENT_TEXT = "3. 이벤트 권한";
    	
    	private ArrayList<AuthVo> LIST = new ArrayList<AuthVo>();
    	private ArrayList<String> categoryList = new ArrayList<String>();
    	private ArrayList<AuthVo> gnbList = new ArrayList<AuthVo>();
    	private ArrayList<String> eventList = new ArrayList<String>();
    	
    	public AuthUtil(ArrayList<AuthVo> list) {
    	    this.LIST = list;
    	    
    	    this.initAuth();
    	}
		
    	public ArrayList<String> getCategoryList(){
    	    return this.categoryList;
    	}
    	
    	public ArrayList<AuthVo> getGnbNameList(){
    	    return this.gnbList;
    	}
    	
    	public ArrayList<AuthVo> getGnbList(String categoryNm){
    	    
    	    ArrayList<AuthVo> gnbList = new ArrayList<AuthVo>();
     	   
    	    for(int i=0; i<this.LIST.size(); i++){
    	        AuthVo vo = this.LIST.get(i);
    	    	String authGbn = this.LIST.get(i).getAuthGbn();
    	    	String authNm = vo.getAuthNm();
				String parentAuthNm = StrUtil.chkNull(vo.getParentAuthNm());
				
				if ( authGbn.equals(categoryNm)){
				    gnbList.add(vo);
				}
    	    }
    	    
    	    return gnbList;
    	}
    	
    	public ArrayList<AuthVo> getLnbList(String gnbMgrNo){
    	    ArrayList<AuthVo> lnbList = new ArrayList<AuthVo>();
    	   
    	    for(int i=0; i<this.LIST.size(); i++){
    	        AuthVo vo = this.LIST.get(i);
    	    	String parentMgrNo = vo.getParentAuthNm();
				if ( gnbMgrNo.equals(parentMgrNo)){
				    lnbList.add(vo);
				}
    	    }
    	    
    	    return lnbList;
    	}
    	
    	public ArrayList<String> getEventList(){
    	    return this.eventList;
    	}
    	
    	private void initAuth() {
    	  //권한 카테고리 .
    	   
    	    for(int i=0; i<this.LIST.size(); i++){
    	        
    	        AuthVo vo = this.LIST.get(i);
    	    	String authGbn = vo.getAuthGbn();
    	    	String authNm = vo.getAuthNm();
				
				//카테고리 저장
    	    	if(!this.categoryList.contains(authGbn)){
    	    		this.categoryList.add(authGbn);
    	    	}
				
				//대메뉴 리스트 저장..
    	    	if(authGbn.equals(this.GNB_TEXT)){
    	    		this.gnbList.add(vo);
    	    	}
    	    	
    	    }

    	    Collections.sort(this.categoryList);
    	    
    	  
    	}
    	
	}
%>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<AuthVo> list = (ArrayList<AuthVo>)request.getAttribute("result");
ArrayList<AuthGrpVo> grpList = (ArrayList<AuthGrpVo>)request.getAttribute("grpList");

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

AuthUtil authUtil = new AuthUtil(list);
ArrayList<String> authCategroyList = authUtil.getCategoryList();

%>
<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.auth.css"> -->
<style>
#authListWrap .tblWrapper {
	width: 23%;
	float: left;
	height:100%;
/* 	max-height: 500px; */
	overflow-y: scroll;
	overflow-x: hidden;
	margin-right:10px;
}
#authListWrap .tblWrapper .authNm {
	text-align: left !important;
}
#authList {
	table-layout: auto;
}
</style>

<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.auth.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">
var gbn = '<%=gbn%>';

// _common.callAjax("/sysMng/getBasicTopMenuView.do", {'gbn': gbn}, function(view) {
// 	$(".contentWrapper").find("#menuWrap").html('');
// 	$(".contentWrapper").find("#menuWrap").html(view);
// });
</script>
<title>권한 관리 | XEUS-Platform</title>

    <div id="wrap" class="contentWrapper">
<!--     	<div id="menuWrap"> -->
<!--         </div> -->
<!--         <div id="title">권한 관리</div> -->
        <div id="search" class="box_style">
            <div class="info_box wd100">
            	<div>
            		<input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="그룹명칭" style="width: 250px;"><button id="searchBtn" class="btn_style2">검색</button>
		            <button id="addBtn" class="btn_Dstyle">신규추가</button>
		            <span id="count">총 <%= request.getAttribute("grpCount") %>개의 그룹 정보가 검색되었습니다.</span>
            	</div>
            </div>
        </div>
        <div id="content" class="customScroll" data-mcs-theme="minimal-dark" style="max-height: 100%;">
            <table id="list" style="position: relative; height: 600px">
                <thead>
                    <tr>
                        <th style="width:250px;">그룹목록</th>
                        <th>권한목록</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 100px; vertical-align: top;">
                            <select id="authGrpList" class="customScroll" multiple="multiple" style="height: 100%;">
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
                        <td id="authListWrap" class="tCenter" style="vertical-align: top;">
                        	<div style="position: relative; width: 100%; height: 100%; overflow: auto;">
                        	<%
                        		for(int l=0; l<authCategroyList.size(); l++){
                        		    String categoryName = authCategroyList.get(l);
                        	%>
									<div class="tblWrapper customScroll head_fixed" data-mcs-theme="minimal-dark">
						                  <table id="authList" style="margin: 0;">
											<thead>
												<tr class="tCenter">
													<th colspan="2" class="authGbn"><%= categoryName %></th>
												</tr>
											</thead>
											<tbody>
                 			
                        	<%
                        	if (categoryName.equals(authUtil.LNB_TEXT)){
                        	    ArrayList<AuthVo> gnbNameList = authUtil.getGnbNameList();
                        	    for (int g=0; g<gnbNameList.size(); g++  ) {
                        	        
                        	        String mgrNo = gnbNameList.get(g).getAuthMgrNo();
                        	        String nm = gnbNameList.get(g).getAuthNm();
                        	        //mgrNo로 변경 추천드립니다.
                        	        //명칭으로 관리되기에는 신규 구축 시 손이 많이 갑니다.
                        	        ArrayList<AuthVo> lnbList = authUtil.getLnbList(nm);
                        	        
                        	        if ( lnbList.size() == 0 ) continue;
                        	%>
		                        	<tr>
		                                <td colspan="2" class="authNm"><%= nm %></td>
		                            </tr>
		                    <%  	
	
		                    		for (int j=0; j < lnbList.size(); j++  ) {
		                    %>
		                    		 <tr>
	                                    <td width="20px"><input type="checkbox" class="auth" k="<%=lnbList.get(j).getAuthMgrNo() %>" disabled="disabled"></td>
	                                    <td class="authNm"><%=lnbList.get(j).getAuthNm()%></td>
	                                </tr>
                        	<%  	} %>
                        	<%  } %>
                        	<%} else { 
                        			ArrayList<AuthVo> authGnbList = authUtil.getGnbList(categoryName);
		                        	for(int i=0; i<authGnbList.size(); i++){
		                    			AuthVo vo = authGnbList.get(i);
                        	%>
			                        	
                       				<tr>
	                                    <td width="20px"><input type="checkbox" class="auth" k="<%= vo.getAuthMgrNo() %>" disabled="disabled"></td>
	                                    <td class="authNm"><%= vo.getAuthNm() %></td>
	                                </tr>
									
								<% 	} %>
						
							<% } %>
								</tbody>
									</table>
	                        	</div>
							<% } %>
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
