<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_OrganizationVo"%>
<%@ page import="gmx.gis.util.code.GMT_CodeConvertor"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_ColumnVo"%>
<%@ page import="gmx.gis.user.service.GMT_UserVo"%>
<%@ page import="gmx.gis.sysmgr.service.GMT_AuthGrpVo"%>
<%@ page import="gmx.gis.util.code.GMT_DateUtil"%>
<%@ page import="gmx.gis.util.code.GMT_StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<GMT_ColumnVo> column = (ArrayList<GMT_ColumnVo>) request.getAttribute("column");

ArrayList<GMT_UserVo> list = (ArrayList<GMT_UserVo>) request.getAttribute("result");
ArrayList<GMT_AuthGrpVo> auth = (ArrayList<GMT_AuthGrpVo>) request.getAttribute("auth");
ArrayList<GMT_OrganizationVo> orgz = (ArrayList<GMT_OrganizationVo>) request.getAttribute("orgz");

GMT_CodeConvertor cde = (GMT_CodeConvertor) request.getAttribute("code");
HashMap<String, String> cdeGrp = cde.convertCodeGrpToAllCde("C02");
Set<String> key = cdeGrp.keySet();
Iterator<String> itr = key.iterator();

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String gbn = map.get("gbn");
String offset = map.get("offset");
String sortCol = map.get("sortCol");
String sortTyp = map.get("sortTyp");
String searchStr = map.get("userIdOrNm");
String sortCntrl = map.get("sortCntrl");
String searchAuthGrpNo = map.get("authGrpNo");
String searchAuthStatCd = map.get("authStatCd");
if(searchStr == null) searchStr = "";
%>
<!--
<link rel="stylesheet" type="text/css" href="./res/css/GMT/xeus.userMng.css">
-->
<style>
	#wrap {box-sizing:border-box; padding: 15px; height: calc(100% - 2%); overflow-y: auto;}
	#search {display: flex; flex-flow: nowrap; align-items: center;}
	#search input {width: auto;}
	#search > span {display: inline-block; margin: 0 5px 0 10px;}
	#user_edit_pop_wrap {display: none; width: 500px; background-color: #fff; box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.3); box-sizing: border-box; padding: 15px; top: -200px; left: 500px;}
	#user_edit_pop_wrap button {display: inline-block;}
	.mngBtn {padding: 2px 5px; border: 1px solid #ddd; border-redius: 2px;}
	.paging_wrap {text-align: center;}
	.bpopClose.btn_Dstyle {width: 100%; height: 40px; margin-top: 5px;}
/* 	.ui-dialog .ui-dialog-content {overflow: initial;} */
</style>

<script type="text/javascript" src="./res/GMT/gmx.gis.user.mng.js"></script>
<script type="text/javascript">
var userIdOrNm = "<%=searchStr%>";
var offset="<%= offset %>";
var gbn="<%= gbn %>";
var idChkStat = false;
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";


</script>
	<input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />

    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->
	<div class="contentWrapper customScroll">
		<div id="wrap" class="customScroll">
			<div id="menuWrap">
	        </div>

	<!--    <div id="title">사용자관리</div>-->
	        <div id="search">
	            <input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%= searchStr %>" placeholder="계정 또는 이름">
	            <span>사용자상태 : </span>
	            <select id="searchAuthStatCd">
	                <option value="">전체</option>
	<%
	while(itr.hasNext()){    String str = (String)itr.next();
	    if(!"15".equals(str)){

	%>
	                <option value="<%= str %>" <% if(str.equals(searchAuthStatCd)) out.print("selected"); %>><%= cdeGrp.get(str) %></option>
	<%
	    }
	}
	%>
	            </select>
	            <span>사용자권한 : </span>
	            <select id="searchAuthGrpNo">

	                <option value="">전체</option>
	                <optgroup label="개별 권한">
	<%
	for(int i=0; i<auth.size(); i++){
		String authGrpNo = auth.get(i).getAuthGrpNo();
	%>
	                    <option value="<%= authGrpNo %>" <% if(authGrpNo.equals(searchAuthGrpNo)) out.print("selected"); %>><%= auth.get(i).getAuthGrpNm() %></option>
	<% } %>
	                </optgroup>
	                <optgroup label="이벤트 권한">
	                    <option value="112"  <% if("112".equals(searchAuthGrpNo)) out.print("selected"); %>>112 전체</option>
	                    <option value="119"  <% if("119".equals(searchAuthGrpNo)) out.print("selected"); %>>119 전체</option>
	                    <option value="dsc"  <% if("dsc".equals(searchAuthGrpNo)) out.print("selected"); %>>사회적약자 전체</option>
	                    <option value="tvus" <% if("tvus".equals(searchAuthGrpNo))out.print("selected"); %>>영상반출 전체</option>
	                </optgroup>
	            </select>
	            <button id="searchBtn" class="paleBtn btn_style2">검색</button>
	            <button id="addBtn" class="paleBtn btn_style2">신규추가</button>
	            <span id="count">총 <%= request.getAttribute("count") %>개의 계정이 검색되었습니다.</span>
	        </div>
	        <div id="content" class="table_style">
	           <table id="userList">
	           <!--
		           <colgroup>
						<col width="100px">
						<col width="100px">
						<col width="60px">
						<col width="100px">
						<col width="60px">
						<col width="70px">
						<col width="150px">
						<col width="60px">
						<col width="110px">
						<col width="60px">
						<col width="100px">
						<col width="100px">
						<col width="35px">
					</colgroup>
				-->
		            <thead>
			            <tr>
	<%
	String targetCol="";
	for(int i=0; i<column.size(); i++){
	    if("xeus.mt_usr_desc".equals(column.get(i).getTblId())
	    	&& !"user_pwd".equals(column.get(i).getColId())
	    	&& !"oath_file_path".equals(column.get(i).getColId())
	    	&& !"mobile_num".equals(column.get(i).getColId())
	    	//&& !"depart_nm".equals(column.get(i).getColId())
	    	&& !"auth_atmt_cnt".equals(column.get(i).getColId())
	    	&& !"expr_dat".equals(column.get(i).getColId())
	    	//&& !"pos_nm".equals(column.get(i).getColId())
	    	&& !"board_info".equals(column.get(i).getColId())

	    	&& !"lock_dat".equals(column.get(i).getColId())
	    	&& !"acpt_dat".equals(column.get(i).getColId())
	    	&& !"acpt_user_id".equals(column.get(i).getColId())
	    	&& !"auth_conn_ip".equals(column.get(i).getColId())

	    	&& !"out_sign".equals(column.get(i).getColId())
	    	&& !"out_stream".equals(column.get(i).getColId())){

	    	String col = column.get(i).getColNm();
	    	if(col != null){
	    		col = col.replace("관리번호", "").replace("코드", "");
	            if(col.equals("사무실전화")) col = "연락처";
	            else if(col.equals("소속기관")) col = "직종";
	            else if(col.equals("서약서첨부파일명")) col = "서약서첨부파일";
	%>

	<%
				if(col.equals("사용자명"))	targetCol = "user_nm";
				else if(col.equals("사용자ID"))	targetCol = "user_id";
				else if(col.equals("생년월일"))	targetCol = "birth_day";
				else if(col.equals("권한그룹"))	targetCol = "auth_grp_no";
				else if(col.equals("직종"))		targetCol = "org_mgr_no";
				else if(col.equals("부서명"))	targetCol = "depart_nm";
				else if(col.equals("직책"))		targetCol = "pos_nm";
				else if(col.equals("연락처"))	targetCol = "mobile_num";
				else if(col.equals("이메일주소"))	targetCol = "email";
				else if(col.equals("계정상태"))	targetCol = "auth_stat_cd";
				else if(col.equals("신청일시"))	targetCol = "req_dat";
				else if(col.equals("승인일시"))	targetCol = "acpt_dat";
				else if(col.equals("서약서첨부파일"))	targetCol = "oath_file_nm";

				col = "<span id='" + targetCol + "' class='mngSortBtn' url='/GMT_userMng/getUserView.do'>" + col + "</span>";
			}
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
	                        <td colspan="13"><b>검색결과가 존재하지 않습니다.</b></td>
	                    </tr>
	<%
	}else{
		for(int i=0; i<list.size(); i++){
			String usrId = list.get(i).getUserId();
			String file = GMT_StrUtil.chkNull(list.get(i).getOathFileNm());
	%>
			            <tr k="<%= usrId %>">
			                <td><%= usrId %></td>
			                <td><%= list.get(i).getUserNm() %></td>
			                <td><%= list.get(i).getBirthDay() %></td>
			                <td><%= GMT_StrUtil.chkNull(list.get(i).getAuthGrpNm()) %></td>
			                <td><%= GMT_StrUtil.chkNull(list.get(i).getOrgNm()) %></td>
							<td>
	                            <%-- <%= GMT_StrUtil.strTelAdd(list.get(i).getTelNum()) %><br> --%>
	                            <%= GMT_StrUtil.strTelAdd(list.get(i).getMobileNum()) %>
	                        </td>
			                <td><%= GMT_StrUtil.chkNull(list.get(i).getDepartNm()) %></td>
			                <td><%= GMT_StrUtil.chkNull(list.get(i).getPosNm()) %></td>
			                <td><%= list.get(i).getEmail() %></td>
			                <td><%= cde.convertCodeToName("C02", list.get(i).getAuthStatCd()) %></td>
			                <td><%= GMT_DateUtil.formatDate(list.get(i).getReqDat()) %></td>
			                <%-- <td><%= GMT_DateUtil.formatDate(list.get(i).getAcptDat()) %></td> --%>
			                <%-- <td><%= GMT_DateUtil.formatDate(list.get(i).getLockDat()) %></td> --%>
	                        <!--
	                        180615 이은규
	                        폐기목록은 어차피 목록에 표시되지 않으므로 표시 컬럼에서 제외한다.
	                        -->
			                <%-- <td><%= GMT_DateUtil.formatDate(list.get(i).getExprDat()) %></td> --%>
			                <%-- <td><%= GMT_StrUtil.chkNull(list.get(i).getAcptUserId()) %></td> --%>
			                <td class="downBtn" k="<%= file %>" u="<%= usrId %>" ><%= file %></td>
	                        <%-- <td><%= GMT_StrUtil.chkNull(list.get(i).getAuthConnIp()) %></td> --%>
			                <td><button class="mngBtn" k="<%= list.get(i).getUserId() %>">수정</button></td>
			            </tr>
	<%
	    }
	}
	%>
		            </tbody>
		        </table>
	        </div>
	        <div class="paging_wrap" style="margin-top: 20px;"></div>
		</div>

		<div class="bpopup" id="user_edit_pop_wrap">
	    <div id="bpop_wrap" class="table_style">
<!-- 	        <h2 id="bpop_title">사용자 관리</h2> -->
	        <table>
	            <tr class="top">
	                <th class="top">계정</th>
	                <td>
	                    <input type="text" class="sendData" id="userId" readonly="readonly" placeholder="아이디 (6자 이상)"/>
	                    <button id="idChk" class="add" type="button">중복확인</button>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">이름</th>
	                <td>
	                    <input type="text" class="sendData" id="userNm" placeholder="이름"/>
	                </td>
	            </tr>
	            <tr class="add">
	                <th class="top">비밀번호</th>
	                <td>
	                    <input type="password" id="userPwd" placeholder="비밀번호 (영문, 숫자, 특수문자 모두 포함)"/>
	                </td>
	            </tr>
	            <tr class="add">
	                <th class="top">비밀번호확인</th>
	                <td>
	                    <input type="password" id="userPwdChk" placeholder="비밀번호 확인"/>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">생년월일</th>
	                <td>
	                    <input type="text" class="sendData" id="birthDay" maxlength="6" placeholder="생년월일 6자리 (주민등록번호 앞자리)"/>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">권한그룹</th>
	                <td>
	                    <select class="sendData" id="authGrpNo">
	<%
	for(int i=0; i<auth.size(); i++){ %>
	                        <option value="<%= auth.get(i).getAuthGrpNo() %>"><%= auth.get(i).getAuthGrpNm() %></option>
	<% } %>
	                    </select>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">소속기관</th>
	                <td>
	                    <select class="sendData" id="orgMgrNo">
	<% for(int i=0; i<orgz.size(); i++){ %>
	                        <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
	<% } %>
	                    </select>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">부서명</th>
	                <td>
	                    <input type="text" class="sendData" id="departNm" placeholder="부서명"/>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">직급(직책)</th>
	                <td>
	                    <input type="text" class="sendData" id="posNm" placeholder="직급 (직책)"/>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">사무실 전화번호</th>
	                <td>
	                    <input type="text" class="sendData" id="telNum" placeholder="사무실 전화번호 ( - 없이 입력)"/>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">휴대폰 번호</th>
	                <td>
	                    <input type="text" class="sendData" id="mobileNum" placeholder="휴대폰 번호 ( - 없이 입력)"/>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">이메일 주소</th>
	                <td>
	                    <input type="text" class="sendData" id="email" placeholder="이메일 주소"/>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">인증IP</th>
	                <td>
	                    <input type="text" class="sendData" id="authConnIp" placeholder="인증IP ( 0.0.0.0 형태로 입력)"/>
	                </td>
	            </tr>
	            <tr class="edit">
	                <th class="top">계정상태</th>
	                <td>
	                    <select class="sendData" id="authStatCd">
	<%
	//180601 이은규
	//위에서 itr이 사용되었으므로 itr 다시 초기화
	itr = key.iterator();
	while(itr.hasNext()){
	    String str = (String)itr.next();
	    if(!"11".equals(str)){
	%>
	                        <option value="<%= str %>"><%= cdeGrp.get(str) %></option>
	<%
	    }
	}
	%>
	                    </select>
	                </td>
	            </tr>
	            <tr class="hidden">
	                <th class="top">승인일시</th>
	                <td>
	                    <input type="text" class="sendData" id="acptDat" />
	                </td>
	            </tr>
	            <tr class="hidden">
	                <th class="top">잠김일시</th>
	                <td>
	                    <input type="text" class="sendData" id="lockDat" />
	                </td>
	            </tr>
	            <tr class="hidden">
	                <th class="top">폐기일시</th>
	                <td>
	                    <input type="text" class="sendData" id="exprDat" />
	                </td>
	            </tr>
	            <tr class="hidden">
	                <th class="top">인증시도횟수</th>
	                <td>
	                    <input type="text" class="sendData" id="authAtmtCnt" />
	                </td>
	            </tr>
<!-- 	            <tr> -->
<!-- 	                <th class="top">서약서 수정</th> -->
<!-- 					<td style="padding: 0px; text-align: center;"> -->
<!-- 						<button class="grayBtn" id="btnDocUpload" style="height: 35px; width: 98%; margin: 0px 0px 0px 0px;" k="geomex">파일첨부</button> -->
<!-- 						<form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data"> -->
<!-- 							<input type="text" name="p" id="p" class="hidden" value="user\\"> -->
<!-- 							<input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z"> -->
<!-- 						</form> -->
<!-- 					</td> -->
<!-- 				</tr> -->
	            <tr>
	                <th class="top">암호초기화</th>
	                <td>
	                    <input type="password" class="middle" id="resetPwd" />
	                    <button id="resetPwdBtn">초기화</button>
	                </td>
	            </tr>
	            <tr>
	                <th class="top">외부 권한</th>
	                <td>
						<input type="checkbox" id="outSign" class="sendData" style="width: 15px; height: 15px; vertical-align: middle;"><label for="outSign">로그인</label>
						<input type="checkbox" id="outStream" class="sendData" style="width: 15px; height: 15px; vertical-align: middle;"><label for="outStream">영상재생</label>
	                </td>
	            </tr>
	        </table>
	        <table>
	            <tr align="center">
	                <td class="lastTd" colspan="2" style="border: 0 !important;">
	                    <button id="saveBtn" class="btn_style2" tabindex="4">저장</button>
<!-- 	                    <button id="closeEditPop" class="bpopClose btn_style2" tabindex="5">취소</button> -->
	                </td>
	            </tr>
	        </table>
	    </div>
	</div>
</div>
