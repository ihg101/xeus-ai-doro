<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD50 // 신청근거 */
    HashMap<String, String> chkReqstResn = cde.convertCodeGrpToAllCde("C50");
    //Set<String> chkReqstResnKey = chkReqstResn.keySet();
    Set<String> chkReqstResnKey = new TreeSet<String>(chkReqstResn.keySet());
    Iterator<String> chkReqstResnItr = chkReqstResnKey.iterator();

    /* CD51 // 8대중과실 */
    HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
    Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
    Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();

    /* CD53 // 승인거절유형 */
    HashMap<String, String> chkRejtResn = cde.convertCodeGrpToAllCde("C53");
    Set<String> chkRejtResnKey = new TreeSet<String>(chkRejtResn.keySet());
    Iterator<String> chkRejtResnItr = chkRejtResnKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String listOffset = param.get("listOffset");
    String listLimit = param.get("listLimit");
    String listYear = param.get("listYear");

    ArrayList<CrmsTransRqstVo> userRqstStat = (ArrayList<CrmsTransRqstVo>)request.getAttribute("usrrqst");

    String totCnt = userRqstStat.get(0).getTotCnt();
    String swCnt = userRqstStat.get(0).getSwCnt();
    String nonCnt = userRqstStat.get(0).getNonCnt();

    CrmsTransRqstVo item = (CrmsTransRqstVo)request.getAttribute("item");

    String reqstId = item.getReqstId();
    String mgrSeq = item.getMgrSeq();
    String reqGbnCdNm = item.getReqGbnCdRelCdeNm();

    ArrayList<UserVo> userList = (ArrayList<UserVo>)request.getAttribute("user");
    UserVo user = null;
    for(UserVo vo : userList){
    	if(reqstId.equals(vo.getUserId())){
    		user = vo;
    		break;
    	}
    }

    String videoSmyChk = (String) request.getAttribute("videoSmyChk");

%>
<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.rqst.detail.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">

var userId = '<%= userId %>';
var mgrSeq = <%= mgrSeq %>;
var reqGbnCdNm = '<%= reqGbnCdNm %>';
var listOffset = '<%= listOffset %>';
var listLimit = '<%= listLimit %>';
var listYear = '<%= listYear %>';
var videoSmyChk = '<%=videoSmyChk%>';

</script>
<style>
#edit_pop select {
    padding-left: 10px;
}

.tLeft{
	text-align: left !important;
	padding-left: 10px !important;
}
</style>

<div id="searchBox">

    <!-- <div class="searchWrapper"> -->
    <div class="popupWrapper customScroll">
        <div id="datail_top_bar" style="text-align: left;">


<!--             <p class="searchTitle" style="width: 300px; dcisplay: inline-block;">영상정보신청 상세보기</p> -->

    	    <div id="bar_btns" style="margin-right: 20px; margin-bottom: 10px; width: 359px; display: inline-block; float:right;">

    	        <div style="text-align: right;">
	<%
	if ( !"15".equals(item.getReqGbnCd()) && "SW".equals(item.getProcStatCd()) ) {
	%>
    	            <button id="btn_stat_sa" class="btn_style2"> 승 인 </button>
    	            <button id="btn_stat_sd" class="btn_Dstyle"> 거 절 </button>

    	            <div id="rejt_pop" style="display: none; background-color: #282828; width: 400px;">
                        <div class="searchWrapper table_style">
<!--         	                <h3 class="title">승인거절사유입력</h3>style="width: 450px;" -->
<!--         	                <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> -->
							<div class="box_style">
								<div class="info_box wd100">
									<span class="title">거절유형</span>
									<select id="rejtTyp" name="rejtTyp" style="">
            								<option value="">전체</option>
        	       							<%
        	       						    while (chkRejtResnItr.hasNext()) {
        	       						      String str = (String) chkRejtResnItr.next();
        								    %>
        								    <option value="<%=str%>"><%=chkRejtResn.get(str)%></option>
        								    <%
        								    }
        								    %>
        							</select>
								</div>
								<div class="info_box wd100">
									<span class="title">거절사유</span>
									<textarea id="rejtResn"></textarea>
								</div>
							</div>
        	                <div style="margin-top:10px;">
        	                    <div class="text">* 거절 사유는 <b style="color:red;">최대 200글자 입니다.</b></div>
        	                </div>
                            <div class="btnDiv" style="text-align: center;"><!-- style="text-align: center; padding: 5px 0 ;" -->
                                <button id="btn_rejt_ok" class="grayBtn btn_style"> 저 장 </button>
<!--                                 <button id="btn_rejt_cc" class="grayBtn btn_Dstyle2"> 취 소 </button> -->
                            </div>
                        </div>

    	            </div>
	<%
	}
	%>
	<%
	if ( "SK".equals(item.getProcStatCd()) && "긴급반출".equals(item.getReqGbnCdRelCdeNm()) ) {
	%>
	               <button id="btn_edit" class="grayBtn btn_style2"> 반출정보 수정 </button>

                   <div id="edit_pop" class="bpopup" style="display: none; width: 900px !important; height: 500px !important; background: #f6f6f6; border: 1px solid #000; padding: 5px; overflow : hidden;">
                        <div class="searchWrapper" style="margin-left:10px;">
                            <p class="searchTitle">신청근거</p>

                            <div>
                                <input type="hidden" class="sendData" id="mgrSeq" name="mgrSeq" value="<%= item.getMgrSeq() %>">
                                <input type="hidden" class="sendData" id="urgReqstId" name="urgReqstId" value="<%= item.getReqstId() %>">
                                <input type="hidden" id="reqstDat" name="reqstDat" value="">
                            </div>

                            <table class="searchTable">
                                <tr>
                                    <!-- <th style="width: 70px;">신청자</th> -->
                                    <th style="width: 80px !important;"><label id="lbl_reqstId">신청자</label></th>
                                    <td>
                                        <select id="reqstId" name="reqstId"class="sendData"  intype="C" style="width: 99%;">
                                            <option value="">전체</option>
                                        <%
                                        for(int i=0; i<userList.size(); i++){
                                        %>
                                            <option value="<%=userList.get(i).getUserId()%>"><%=userList.get(i).getUserId() + "(" + userList.get(i).getUserNm() + ")"%></option>
                                        <%
                                        }
                                        %>
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <th><label id="lbl_reqstResn">신청근거</label></th>
                                    <td>
                                        <select id="reqstResn" name="reqstResn" class="sendData" intype="C" style="width: 99%;">
                                            <option value="">전체</option>
                                            <%
                                                while (chkReqstResnItr.hasNext()) {
                                                    String str = (String) chkReqstResnItr.next();
                                                    if(!"99".equals(str)){
                                            %>
                                            <option value="<%=str%>"><%=chkReqstResn.get(str)%></option>
                                            <%
                                                    }
                                                }
                                            %>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style="border-left: none; height: 40px;">
                                        <div class="hint">* 신청근거는 필수 항목이므로 반드시 선택해주어야 합니다.</div>
                                    </td>
                                </tr>
                                <tr>
                                    <th><label id="lbl_reqstDetail">신청내용</label></th>
                                    <td>
                                        <div class="inBox">
                                            <textarea class="sendData" key="first" id="reqstDetail" style="width: 98%; margin: 5px 5px 0px 5px; height: 50px;"
                                                coltype="V" collength="200" name="reqstDetail"></textarea>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="">
                                    <td></td>
                                    <td style="border-left: none; height: 40px;">
                                        <div class="hint">
                                            * 신청내용은 <b class="red_font">0 ~ 200자 내 </b>로 입력할 수 있습니다.
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th><label id="lbl_crimeTyp">범죄유형</label></th>
                                    <td>
                                        <div class="inBox" style="width:48%; float: left;">
                                            <select id="reqGbnCd" name="reqGbnCd" class="wide sendData" name="reqGbnCd">
                                                <!-- <option value="">전체</option> -->
                                                <%
                                                    while (chkReqGbnCdItr.hasNext()) {
                                                        String str = (String) chkReqGbnCdItr.next();
                                                        if("11".equals(str)){// || str.equals("12") ==> 긴급반출인데 반출로만 전환되어야 함.
                                                            if ("11".equals(str)) {
                                                %>
                                                <option value="<%=str%>" selected><%=chkReqGbnCd.get(str)%></option>
                                                <%
                                                            } else {
                                                %>
                                                <option value="<%=str%>"><%=chkReqGbnCd.get(str)%></option>
                                                <%
                                                            }
                                                        }
                                                    }
                                                %>
                                            </select>
                                        </div>
                                        <div style="width:48%; float: left; border-left: #ddd 1px solid;">
                                            <select id="crimeTyp" name="crimeTyp" class="wide sendData"><!--  style="width: 48% !important;" -->
                                                <option value="">전체</option>
                                                <%
                                                    while (chkCrimeTypItr.hasNext()) {
                                                        String str = (String) chkCrimeTypItr.next();
                                                        //if(!str.equals("99")){
                                                %>
                                                <option value="<%=str%>"><%=chkCrimeTyp.get(str)%></option>
                                                <%
                                                        //}
                                                    }
                                                %>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-bottom: none;"></td>
                                    <td style="border-left: none; border-bottom: none;">
                                        <div class="hint">
                                            * 범죄유형은 <b class="red_font">필수 항목</b>이므로 반드시 선택해주어야 합니다.
                                        </div>
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <td colspan="2" align="center" style="border-top: 1px solid #999;">
                                        <button class="content_next_btn blueBtn" key="sub_content"
                                            style="margin-top: 5px; width: 80px; height: 25px;">다 음</button>
                                    </td>
                                </tr> -->

                            </table>

                            <p class="searchTitle">공문첨부</p>

                            <table class="searchTable">
                                <tr>
                                    <th><label id="lbl_docFileNm">공문첨부</label></th>
                                    <td style="width: 300px;">
                                        <input type="text" class="sendData" id="docFileNm" name="docFileNm" style="width: 227px;"
                                        value="" readonly="readonly"> <input type="hidden" class="sendData" id="docFilePath"
                                        name="docFilePath" value="">
                                        <button class="grayBtn btn_style2" id="btn-upload" style="height: 25px; margin:3px 0px 0px 3px;">파일첨부</button>
                                        <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
                                            <input type="text" name="p" id="p" class="hidden" value="rqst\\"><!-- \\upload\\tvius\\rqst\\ -->
                                            <input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z">
                                        </form>
                                    </td>
                                    <th><label id="lbl_docNo">공문번호</label></th>
                                    <td><input type="text" class="sendData" id="docNo" name="doc_no" value=""></td>
                                </tr>
                                <tr>
                                    <td style="border-bottom: none;"></td>
                                    <td colspan="3" style="border-left: none; border-bottom: none;">
                                        <h3 class="hint title">
                                            * 공문첨부/파일첨부는 입력란 우측의 <b class="red_font">'파일첨부'</b>를 누르면 파일을 첨부할 수 있습니다.<br> * 파일명은 <b
                                                class="red_font">최대 30글자</b>이며, 파일 크기는 <b class="red_font">최대 500MB</b> 입니다.
                                        </h3>
                                    </td>
                                </tr>
                            </table>
                            <div class="btnDiv">
                                <button class="grayBtn btn_style2" id="btn_save">저장</button>
                                <button class="grayBtn btn_style2" id="btn_cancel">취소</button>
                            </div>
                        </div>
                    </div>
	<%
	}else if("SK".equals(item.getProcStatCd()) && "열람".equals(item.getReqGbnCdRelCdeNm())){
	    %>
                    <!-- <button id="btn_change" class="grayBtn"> 반출전환 </button> -->
                    <!-- TODO 꼭 해놓자... -->
	<%
	}
	%>

	<%-- <% if(!"15".equals(item.getReqGbnCd())){ %>
					<button id="btn_del" class="btn_Dstyle2" mgrSeq="<%= item.getMgrSeq() %>"> 삭 제 </button>
	<% } %> --%>
<!--                     <button id="btn_list" class="btn_style2" style="width:90px; height:32px;">목록으로</button> -->
	            </div>
            </div>
        </div>

		<div id="data_view">
		    <div id="rejt_cont_pop" style="display: none;">
		        <div class="rejt_cont_top">
		            <span class="searchTitle">신청내용 </span>
		            <span class="rejt_cont_close" style=" position:absolute; right:4px; top:5px; cursor: pointer"><img src="/xeus/res/img/btn_close.png"/></span>
		        </div>

		        <textarea id="rejt_cont_text" readonly="readonly"></textarea>
		    </div>

		    <table class="req_table" cellspacing="0" style="margin-bottom:0; border-bottom: 0;" width="100%">
		        <colgroup>
		            <col width="101" />
		            <col width="400" />
		            <col width="101" />
		            <col width="" />
		        </colgroup>

		        <tr>
		            <th>
		                신청번호
		            </th>
		            <td class="tLeft">
		                <div class="inBox"><%=mgrSeq%></div>
		            </td>
		            <th>
		                신청자
		            </th>
		            <td class="tLeft">
		                <div class="inBox"><%=item.getReqstIdRelCdeNm()%> (<span id="reqstId"><%=item.getReqstId()%></span>)</div>
		            </td>
		        </tr>

		        <tr>
		            <th>
		                신청일시
		            </th>
		            <td class="tLeft">
		                <div id="reqstDat" class="inBox"><%=DateUtil.formatDate(item.getReqstDat())%></div>
		            </td>
		            <th>
		                범죄유형
		            </th>
		            <td class="tLeft">
		                <div class="inBox"><span id="reqGbnCd"><%=item.getReqGbnCdRelCdeNm() %></span>, <%=item.getCrimeTypRelCdeNm()%></div>
		            </td>
		        </tr>

		        <tr>
		            <%-- <th>
		                사건장소
		            </th>
		            <td>
		                <div class="inBox"><%=StrUtil.chkNull(item.getCrimeLoc())%></div>
		            </td> --%>
		            <th>
		                신청근거
		            </th>
		            <td colspan="3" class="tLeft">
		                <div class="inBox"><%=StrUtil.chkNull(item.getReqstResnRelCdeNm())%></div>
		            </td>
		        </tr>

		        <tr>
		            <th>
		                신청내용
		            </th>
		            <td colspan="3" class="tLeft">
                <%
                    String reqstDetail = StrUtil.chkNull(item.getReqstDetail());
                    String viewTxt = reqstDetail;
                    /* if(!reqstDetail.equals("")){
                        if(viewTxt.length()>20) viewTxt = viewTxt.subSequence(0, 20) + "...";
                    } */
                %>
		                <div class="inBox rejt_cont"><span class="detailTip" id="viewReqstDetail" tit="신청내용" title="<%=reqstDetail%>"><%=viewTxt%></span>
		<%-- <% if(!"-".equals(item.getReqGbnCd())){ %>
	                    	<button id="btn_reqst_detail_chng" class="grayBtn btn_Dstyle" style="margin-left: 10px;">신청내용변경</button>
		<% } %> --%>
						</div>
		            </td>
		        </tr>

		        <tr>
		            <th>
		                공문번호
		            </th>
		            <td class="tLeft">
		                <div class="inBox">
		                	<span id="viewDocNo"><%=StrUtil.chkNull(item.getDocNo())%></span>
		<%-- <% if(!"-".equals(item.getReqGbnCd())){ %>
	                    	<button id="btn_doc_no_chng" class="grayBtn btn_Dstyle" style="margin-left: 10px;">공문번호변경</button>
		<% } %> --%>
		                </div>
		            </td>

		            <th>
		                첨 부
		            </th>
		            <td class="tLeft">
		                <!-- 다운로드 구현해야 함. -->
		                <div class="inBox">
		<%-- <% if(user != null){ %>
		                    [ <b>보안 서약서 </b> :
                                <a class="securityDoc" style="cursor: pointer; color: #7780ff;" k="<%= StrUtil.chkNull(user.getOathFileNm()) %>" u="<%= reqstId %>" target="_blank"><%= StrUtil.chkNull(user.getOathFileNm()) %></a>
                            ]
		<% } %> --%>
		                    [ <b>공 문 서 </b> :
		<% if (!StrUtil.isEmpty(item.getDocFileNm()) && !StrUtil.isEmpty(item.getDocFilePath()) ){%>
                                <a class=<%= "-".equals(item.getReqGbnCd()) ? "" : "doc_down" %> style="cursor: pointer; color: #7780ff;" downnm= "<%=StrUtil.chkNull(item.getDocFileNm())%>" realnm="rqst/<%=StrUtil.chkNull(item.getDocFilePath())%>" target="_blank"><%=StrUtil.chkNull(item.getDocFileNm())%></a>
		<% } %>
                            ]

		<%-- <% if(!"-".equals(item.getReqGbnCd())){ %>
                            [ <b> 최종공문확인 </b> :
		<%		String docChngYn = "X";
				String style = "white";
				if("Y".equals(item.getDocChngYn()) ) {
					docChngYn = "O";
					style = "white";
				}
		%>
                            <span id="docChngYn" style="color: <%=style%>"><%=docChngYn%></span>
                            ]

		<% } %> --%>

		<%-- <% if(!"-".equals(item.getReqGbnCd())){%>
				if("N".equals(item.getDocChngYn()) ) {
					<button id="btn_edit_doc" class="grayBtn btn_style2">공문 변경</button>
					<form class="hidden" id="hiddenDocForm" method="POST" enctype="multipart/form-data">
                       <input type="text" name="p" id="p" class="hidden" value="rqst\\">
                       <input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z">
                   </form>
				<% } %>

		<%		if ("SK".equals(item.getProcStatCd()) && "N".equals(item.getDocChngYn()) ){%>
		                    <button id="btn_doc_chng" class="grayBtn btn_style2">최종공문확인</button>
		<%		} %>

		<% } %> --%>
		                </div>
		            </td>
		        </tr>

		        <tr>
		            <th><!--  style = "background-color: #373737;" -->
		                처리상태
		            </th>
		            <td class="tLeft">
		                <div class="inBox" id="stat_nam" key="<%=item.getProcStatCd()%>">
		                    <%=item.getProcStatCdRelCdeNm()%>
		                </div>
		            </td>
		            <th><!--  style = "background-color: #373737;" -->
		                처리내용
		            </th>
		            <td class="tLeft">
		                <div class="inBox">
		<%
		if ( !"SW".equals(item.getProcStatCd()) )  {
		    if ( "SD".equals(item.getProcStatCd()) )  {
		%>
		                    <div>
		                    	<div style="text-align : left;"><span>거절일시 : <% if ( item.getAcptDat() != null){ %> <%=DateUtil.formatDate(item.getAcptDat())%><% } %></span></div>
								<div style="text-align : left;"><span>거 절 자 : <% if ( item.getAcptDat() != null){ %> <%=item.getAcptUserIdRelCdeNm()%> (<%=item.getAcptUserId()%>)<% } %></span></div>
		                        <div style="text-align : left;">거절유형 : <%=item.getRejtTypRelCdeNm()%></div>
		                        <div style="text-align : left;" class="rejt_cont" ><span tit="거절사유">거절사유 : <%=item.getRejtResn()%></span></div>
		                    </div>
		<%
		    } else {
		%>
		                    <div>

		                        승인일시 : <% if ( item.getAcptDat() != null){ %> <%=DateUtil.formatDate(item.getAcptDat())%><% } %><br>
		                        승 인 자 : <% if ( item.getAcptDat() != null){ %> <%=item.getAcptUserIdRelCdeNm()%> (<%=item.getAcptUserId()%>)<% } %>
		                    </div>
		<%
		    }
		%>
		<%
		}
		%>
		                </div>
		            </td>
		        </tr>

		        <tr>
		            <th class="border_bot">
		                수령방법
		            </th>
		            <td class="border_bot tLeft">
		                <div class="inBox"><%=item.getRecvMthdRelCdeNm()%></div>
		            </td>
		            <th class="border_bot">
		                활용결과
		            </th>
		            <td class="border_bot tLeft">
        <%
        if ( "SK".equals(item.getProcStatCd()) && !"15".equals(item.getReqGbnCd()))  {
        	if(item.getUseRsCdRelCdeNm() != null){
        %>
		                <div class="inBox"><%=item.getUseRsCdRelCdeNm()%></div>
        <%
        	}
        } %>
		            </td>
		        </tr>
	        <%if("Y".equals(videoSmyChk)){ %>
				<tr>
		        	<th class="border_bot">
		                고속검색
		            </th>
		            <td colspan="3" class="border_bot tLeft">
		            	<%if(StrUtil.chkNull(item.getVideoSmy()).equals("Y") || StrUtil.chkNull(item.getVideoSmy()).equals("C")){ %>
		            		&nbsp;O
		            	<%} else { %>
		            		&nbsp;X
		            	<%}%>
		            </td>
		        </tr>
	        <%} %>
		    </table>
		    <div>
		        <table cellpadding="0" cellspacing="0">
		            <tr>
		                <th>영상반출신청건수</th>
		                <td class="tLeft"><div id="rqst_num" align="center" style="width:42px;" class="rqst_div_num inBox"><%= totCnt %></div></td>
		                <th>승인대기건수</th>
		                <td class="tLeft"><div id="sw_num" align="center" style="width:42px;" class="rqst_div_num inBox"><%= swCnt %></div></td>
		                <th>활용결과 미입력건수</th>
		                <td class="tLeft"><div id="non_num" align="center" style="width:42px;" class="rqst_div_num inBox"><%= nonCnt %></div></td>
		            </tr>
		        </table>
		    </div>

		    <%
            if ( true ) {
		        if ( Long.parseLong(mgrSeq) > 200000000000L ) {

		    %>


		    <div>
           		<p class="searchTitle">CCTV</p>
				<%-- <% if("11".equals(item.getReqGbnCd())){
				   	if("SK".equals(item.getProcStatCd())){ %>
					<button id="btn_all_avi_download" class="btn_style2" style="float: right;margin: 10px 0px;">일괄 다운로드</button>
					<button id="btn_hash_download" class="btn_style2" style="float: right;margin: 10px 20px;">해시 다운로드</button>
				 <% } %>
				<% } %> --%>
			</div>


		            <table cellspacing="0" width="100%">
		                <tr>
		                    <td align="center" style="height: 300px; border: none;">
		                        <div id="cctvList" name="cctvList" style="width: 100%; height: 100%; border: none;"></div>
		                    </td>
		                </tr>

		            </table>

		    <%
		        } else {
		    %>
		            <div>
		                <h1 class="tit" id="tl_main"><div><span>CCTV</span></div></h1>
		            </div>

		            <table cellspacing="0" width="100%">
		                <tr>
		                    <td align="center" style="height: 300px;">
		                        <span style="font-size : 13px;">해당 건수는 과거 반출 데이터입니다.</span>
		                    </td>
		                </tr>

		            </table>

		    <%
		        }
		    }
		    %>

		</div>

		<div id="docNoChngPop" style="display:none;">
            <div id="bpop_wrap" class="table_style">
                <table>
                    <tr>
                        <th class="top">공문번호</th>
                        <td>
                            <input class="sendData" id="chgDocNo"></input>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr align="center">
                        <td class="lastTd" colspan="2" style="border: 0 !important;">
                            <button id="docNoSaveBtn" class="btn_style2">저장</button>
                            <button id="docNoCloseBtn" class="btn_Dstyle2">취소</button><!--  tabindex="5" -->
                        </td>
                    </tr>
                </table>
            </div>
        </div>

<!--         <div id="reqstDetailPop" class="detailPopupWrapper" style="display: none;"> -->
<!--             <div id="bpop_wrap" class="table_style"> -->
<!--                 <h3 id="bpop_title" class="title">신청내용 수정</h3> -->
<!--                 <table style="table-layout: auto;"> -->
<!--                     <tr> -->
<!--                         <th class="top">신청내용</th> -->
<!--                         <td> -->
<!--                             <textarea class="sendData" id="chgReqstDetail"></textarea> -->
<!--                         </td> -->
<!--                     </tr> -->
<!--                 </table> -->
<!--                 <table> -->
<!--                     <tr align="center"> -->
<!--                         <td class="lastTd" colspan="2" style="border: 0 !important;"> -->
<!--                             <button id="reqstDetailSaveBtn" class="btn_style2">저장</button> -->
<!--                             <button id="reqstDetailCloseBtn" class="btn_Dstyle2">취소</button> tabindex="5" -->
<!--                         </td> -->
<!--                     </tr> -->
<!--                 </table> -->
<!--             </div> -->
<!--         </div> -->

    </div>
</div>
