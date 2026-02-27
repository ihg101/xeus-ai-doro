<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<ColumnInfoVo> column = (ArrayList<ColumnInfoVo>) request.getAttribute("column");

ArrayList<UserVo> list = (ArrayList<UserVo>) request.getAttribute("result");
ArrayList<AuthGrpVo> auth = (ArrayList<AuthGrpVo>) request.getAttribute("auth");
ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");

CodeConvertor cde = (CodeConvertor) request.getAttribute("code");
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
String limit = map.get("limit");
if(searchStr == null) searchStr = "";
%>
<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.userMng.css"> -->

<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.user.mng.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./common/sysMngSort.js"></script>
<script type="text/javascript">
var userIdOrNm = "<%=searchStr%>";
var offset="<%= offset %>";
var gbn="<%= gbn %>";
var idChkStat = false;
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";
var limit = "<%= limit %>";

// _common.callAjax("/sysMng/getBasicTopMenuView.do", {'gbn': gbn}, function(view) {
// 	$(".contentWrapper").find("#menuWrap").html('');
// 	$(".contentWrapper").find("#menuWrap").html(view);
// });

// $(document).ready(function(){
// 	$("#wrap").find("#content").css("max-height", $("#userList").height() + 5);
// 	$(".contentWrapper").find("#content").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height()-200);
// });

// $(window).on('resize', function () {
// 	$(".contentWrapper").find("#content").css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height()-200);
// });
</script>
	<input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= request.getAttribute("count") %>" />
    <input type="hidden" id="ipChk" value="<%= map.get("ipChk") %>" />

    <!-- <div id="header">
        <div id="back">뒤로가기</div>
    </div> -->
	<div class="contentWrapper">
		<div id="wrap" >
	<!-- 		<div id="menuWrap"> -->
	<!--         </div> -->

	<!--         <div id="title">사용자관리</div> -->
	        <div id="search" class="box_style">
	            <div class="info_box wd100">
	            	<input id="searchInput" class="keyup" for="#searchBtn" type="text" value="<%=searchStr%>" placeholder="계정 또는 이름" style="width: 140px;">
		            <div>
		            	<label for="searchAuthStatCd">사용자 상태</label>
			            <select id="searchAuthStatCd" style="width: 140px;">
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
		            </div>
		            <div id="search">
		            	<label for="searchAuthGrpNo">사용자 권한</label>
			            <select id="searchAuthGrpNo" style="width: 140px;">

			                <option value="">전체</option>
			                <optgroup label="그룹 권한">
			<%
			for(int i=0; i<auth.size(); i++){
				String authGrpNo = auth.get(i).getAuthGrpNo();
			%>
			                    <option value="<%= authGrpNo %>" <% if(authGrpNo.equals(searchAuthGrpNo)) out.print("selected"); %>><%= auth.get(i).getAuthGrpNm() %></option>
			<% } %>
			                </optgroup>
			                <%-- <optgroup label="이벤트 권한">
			                    <option value="112"  <% if("112".equals(searchAuthGrpNo)) out.print("selected"); %>>112 전체</option>
			                    <option value="119"  <% if("119".equals(searchAuthGrpNo)) out.print("selected"); %>>119 전체</option>
			                    <option value="dsc"  <% if("dsc".equals(searchAuthGrpNo)) out.print("selected"); %>>사회적약자 전체</option>
			                    <option value="tvus" <% if("tvus".equals(searchAuthGrpNo))out.print("selected"); %>>영상반출 전체</option>
			                </optgroup> --%>
			            </select>

                        <label>LIMIT</label>
                        <input type="text" id="limit" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">
			            <button id="searchBtn" class="btn_style2">검색</button>
			            <button id="addBtn" class="btn_Dstyle">신규추가</button>
			            <span id="count">총 <%= request.getAttribute("count") %>개의 계정이 검색되었습니다.</span>
		            </div>
	            </div>
	        </div>
	        <div id="content" class="resizeWrap customScroll" style="margin-bottom: -13px;">
	           <table id="userList">
<!-- 		           <colgroup> -->
<!-- 						<col width="100px"> -->
<!-- 						<col width="100px"> -->
<!-- 						<col width="60px"> -->
<!-- 						<col width="100px"> -->
<!-- 						<col width="60px"> -->
<!-- 						<col width="70px"> -->
<!-- 						<col width="150px"> -->
<!-- 						<col width="60px"> -->
<!-- 						<col width="110px"> -->
<!-- 						<col width="60px"> -->
<!-- 						<col width="100px"> -->
<!-- 						<col width="100px"> -->
<!-- 						<col width="35px"> -->
<!-- 					</colgroup> -->
		            <thead>
			            <tr>
	<%
	String targetCol="";
	for(int i=0; i<column.size(); i++){

		String tblId = (String)column.get(i).getTblId();
		if(tblId != null){
		    if(tblId.contains("mt_usr_desc")
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
		    	&& !"out_stream".equals(column.get(i).getColId())
		    	&& !"login_sms".equals(column.get(i).getColId())

		    	&& !"out_sign".equals(column.get(i).getColId())
		    	&& !"out_stream".equals(column.get(i).getColId())){

			    	String col = column.get(i).getColNm();
			    	if(col != null){
			    		col = col.replace("관리번호", "").replace("코드", "");
			            if(col.equals("사무실전화")) col = "연락처";
			            else if(col.equals("소속기관")) col = "직종";
			            else if(col.equals("서약서첨부파일명")) col = "서약서첨부파일";

						if(col.equals("사용자명"))	targetCol = "user_nm";
						else if(col.equals("사용자ID"))	targetCol = "user_id";
						else if(col.equals("생년월일"))	targetCol = "birth_day";
						else if(col.equals("권한그룹"))	targetCol = "auth_grp_no";
						else if(col.equals("직종"))		targetCol = "org_mgr_no";
						else if(col.equals("부서명"))	targetCol = "depart_nm";
						else if(col.equals("직책"))		targetCol = "pos_nm";
						else if(col.equals("연락처"))	targetCol = "mobile_num";
						else if(col.equals("이메일주소"))	targetCol = "email";
						else if(col.equals("외부로그인"))	targetCol = "out_sign";
						else if(col.equals("영상재생"))	targetCol = "out_stream";
						else if(col.equals("로그인SMS"))	targetCol = "login_sms";
						else if(col.equals("계정상태"))	targetCol = "auth_stat_cd";
						else if(col.equals("신청일시"))	targetCol = "req_dat";
						else if(col.equals("승인일시"))	targetCol = "acpt_dat";
						else if(col.equals("서약서첨부파일"))	targetCol = "oath_file_nm";

						col = "<span id='" + targetCol + "' class='mngSortBtn' url='/userMng/getUserView.do'>" + col + "</span>";
					}
			    	if("영상재생".equals(column.get(i).getColNm()) || "외부로그인".equals(column.get(i).getColNm()) || "로그인SMS".equals(column.get(i).getColNm())){
			%>
					 	<th style="width:60px;"><%= col %></th>
			<%
			    	 }else{
		    %>
		    		 	<th><%= col %></th>
		    <%
			    	 }

		%>
		<%
		   		}
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
			String file = StrUtil.chkNull(list.get(i).getOathFileNm());
	%>
			            <tr k="<%= usrId %>">
			                <td><%= usrId %></td>
			                <td><%= list.get(i).getUserNm() %></td>
			                <td><%= list.get(i).getBirthDay() %></td>
			                <td><%= StrUtil.chkNull(list.get(i).getAuthGrpNm()) %></td>
			                <td><%= StrUtil.chkNull(list.get(i).getOrgNm()) %></td>
							<td>
	                            <%-- <%= StrUtil.strTelAdd(list.get(i).getTelNum()) %><br> --%>
	                            <%= StrUtil.strTelAdd(list.get(i).getMobileNum()) %>
	                        </td>
			                <td><%= StrUtil.chkNull(list.get(i).getDepartNm()) %></td>
			                <td><%= StrUtil.chkNull(list.get(i).getPosNm()) %></td>
			                <td><%= list.get(i).getEmail() %></td>
			                <td><%= cde.convertCodeToName("C02", list.get(i).getAuthStatCd()) %></td>
			                <td><%= DateUtil.formatDate(list.get(i).getReqDat()) %></td>
			                <%-- <td><%= DateUtil.formatDate(list.get(i).getAcptDat()) %></td> --%>
			                <%-- <td><%= DateUtil.formatDate(list.get(i).getLockDat()) %></td> --%>
	                        <!--
	                        180615 이은규
	                        폐기목록은 어차피 목록에 표시되지 않으므로 표시 컬럼에서 제외한다.
	                        -->
			                <%-- <td><%= DateUtil.formatDate(list.get(i).getExprDat()) %></td> --%>
			                <%-- <td><%= StrUtil.chkNull(list.get(i).getAcptUserId()) %></td> --%>
			                <td class="downBtn" k="<%= file %>" u="<%= usrId %>" style="cursor: pointer; color: #7780ff;"><%= file %></td>

			                <%-- <% if( "Y".equals(list.get(i).getOutSign())){ %>
			                <td>O</td>
		                    <% }else if( "N".equals(list.get(i).getOutSign())) {%>
			                <td>X</td>
			                <% }else { %>
			                <td></td>
			                <%}%>


							<% if( "Y".equals(list.get(i).getOutStream())){ %>
			                <td>O</td>
		                    <% }else if( "N".equals(list.get(i).getOutStream())) {%>
			                <td>X</td>
			                <% }else { %>
			                <td></td>
			                <%}%>

			                <% if( "Y".equals(list.get(i).getLoginSms())){ %>
			                <td>O</td>
		                    <% }else if( "N".equals(list.get(i).getLoginSms())) {%>
			                <td>X</td>
			                <% }else { %>
			                <td></td>
			                <%}%> --%>


	                        <%-- <td><%= StrUtil.chkNull(list.get(i).getAuthConnIp()) %></td> --%>
			                <td>
							<% if(!"12".equals(list.get(i).getAuthStatCd()) && !"15".equals(list.get(i).getAuthStatCd())){ %>
								<button class="statCngBtn btn_style2" k="<%= list.get(i).getUserId() %>">승인</button>
							<% } %>

		                	<button class="mngBtn btn_style2" k="<%= list.get(i).getUserId() %>">변경</button>
		                	</td>
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

	<div class="bpopup hidden" id="user_edit_pop_wrap">
	    <div id="bpop_wrap">
<!-- 	        <h2 id="bpop_title">사용자 관리</h2> -->
	        <table style="table-layout: auto;">
	            <tr class="top">
	                <th class="top">계정</th>
	                <td>
	                    <input type="text" class="sendData" id="userId" readonly="readonly" placeholder="아이디 (6자 이상)"/>
	                    <button id="idChk" class="add btn_Dstyle" type="button">중복확인</button>
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
	            <tr>
	                <th class="top">서약서</th>
					<td style="padding: 0px; text-align: center;">
						<input type="text" class = "middle sendData" style="width:60%" id="oathFileNm" disabled/>
						<button class="grayBtn btn_Dstyle" id="btnDocUpload">파일첨부</button>
						<form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
							<input type="text" name="mode" id="mode" class="hidden">
							<input type="text" name="p" id="p" class="hidden" value="user\\">
							<input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z">
							<input type="text" name="targetUserId" id="targetUserId" class="hidden">
							<input type="text" name="oathFilePath" id="oathFilePath" class="hidden sendData">
						</form>
					</td>
				</tr>
	            <tr class="edit">
	                <th class="top">암호초기화</th>
	                <td>
	                    <input type="password" class="middle" id="resetPwd" style="width: 60%;"/>
	                    <button class="btn_Dstyle2" id="resetPwdBtn">초기화</button>
	                </td>
	            </tr>
	            <!-- <tr>
	                <th class="top">외부 권한</th>
	                <td>
						<input type="checkbox" id="outSign" class="sendData checkbox" style="vertical-align: middle;"><label for="outSign" class="checkboxC"></label>로그인
						<input type="checkbox" id="outStream" class="sendData checkbox" style="vertical-align: middle;"><label for="outStream" class="checkboxC"></label>영상재생
	                </td>
	            </tr>
	            <tr>
	                <th class="top">인증 권한</th>
	                <td>
						<input type="checkbox" id="loginSms" class="sendData checkbox" style="vertical-align: middle;"><label for="loginSms" class="checkboxC"></label>로그인 SMS
	                </td>
	            </tr> -->
	        </table>
	        <table>
	            <tr align="center">
	                <td class="lastTd" colspan="2" style="border: 0 !important;">
	                    <button class="btn_style" id="saveBtn" tabindex="4">저장</button>
<!-- 	                    <button class="btn_style2" id="closeEditPop" class="bpopClose" tabindex="5">취소</button> -->
	                </td>
	            </tr>
	        </table>
	    </div>
	</div>
</div>
