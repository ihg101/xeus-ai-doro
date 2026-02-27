<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.map.service.DoroVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%> --%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%

String rqstMgrSeq = (String)request.getAttribute("mgrseq");
String reqGbn = (String) request.getAttribute("reqgbn");

HashMap<String, String> sysParam = (HashMap<String, String>)request.getAttribute("sysparam");

String maskingYn = sysParam.get("tvius.masking_yn");
String systemSmiYn = sysParam.get("tvius.smi_yn");

ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>)request.getAttribute("list");

%>
<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.avi.view.js"></script>
<script type="text/javascript">

var rqstMgrSeq = '<%=rqstMgrSeq%>';
var maskingYn = '<%= maskingYn %>';
var userId = '<%=userId%>';
//var reqstId = $(".contentWrapper").find('#searchBox').find('#reqstId').text();
var reqstId = $(".contentWrapper").find('#reqstId').text();
var reqGbn = '<%=reqGbn%>';
var SYSTEM_SMI_YN = '<%= sysParam.get("tvius.smi_yn") %>';
</script>

<div id="serchBox2">
    <div class="tableWrapper searchList">

        <table id="data_table">
            <colgroup>
                <col width="" />
                <col width="160" />
                <col width="160" />
                <col width="100" />
                <col width="160" />
<!--                 <col width="" /> -->
<!--                 <col width="" /> -->
                <%if ( !"N".equals(maskingYn) ){%>
                <col width="50" />
                <%}%>
                <% if ( "차량번호".equals(reqGbn) ){%>
                	<col width="100" />
                <% }%>
                <!-- <col width="100" /> -->
                <col width="400"/>
                <col width="60" />
            </colgroup>
            <thead>
            	<tr>
	                <th>CCTV명</th>
	                <th>시작시간</th>
	                <th>종료시간</th>
	                <% if (!"차량번호".equals(reqGbn) ){%>
		                <th>재생 횟수제한</th>
		                <th>재생 만료일</th>
	                <%} %>
	                <%if ( !"N".equals(maskingYn) ){%>
	                	<th>마스킹여부</th>
	                <%}%>
	                <% if ( "차량번호".equals(reqGbn) ){%>
	                	<th>차량번호</th>
	                <% }%>
	                <!-- <th>파일수</th> -->
	                <th>파일목록</th>
<!-- 	                <th style="display:none">sha 해시값</th> -->
<!-- 	                <th style="display:none">md5 해시값</th> -->
	                <th>수정</th>
	<!--                 <th rowspan="2">수정</th> -->
<!-- 	                <th colspan="4">증거 신청</th> -->

	            </tr>
	            <!-- <tr>
	                <th>신청일</th>
	                <th>승인일</th>
	                <th>승인여부</th>
	            </tr> -->
            </thead>
            <tbody id="avi_list_body">
                <%
                 if (list.size() == 0){
                %>
                <tr>
                    <td colspan="7" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
                </tr>
                <%
                 } else {
                      for(int i=0; i<list.size(); i++){

                   	  	String realFileName = list.get(i).getMgrSeq()+"_"+list.get(i).getRqstMgrSeq()+"_"+list.get(i).getVdwkFileSeq();
  						String orgLimitDat = list.get(i).getAviPlayLimitDat().trim();
  						String orgLimitCnt = Integer.toString(list.get(i).getPlayLimitCnt());

  						if("Y".equals(list.get(i).getRenewEviYn()) || "Y".equals(list.get(i).getRenewExtYn())){
  							if(list.get(i).getRenewPlayLimitDat() != null){
								orgLimitDat = list.get(i).getRenewPlayLimitDat().trim();
							}

							if(list.get(i).getRenewPlayLimitCnt() != null){
								orgLimitCnt = list.get(i).getRenewPlayLimitCnt();
							}

  							if("0".equals(orgLimitDat)) orgLimitDat = "-";
  						}

  						if(!"0".equals(orgLimitDat.trim()) && !"-".equals(orgLimitDat) && orgLimitDat != null) orgLimitDat = DateUtil.formatDate(orgLimitDat, 8);

  						/* String orgLimitDat = rst.get(i).getAviPlayLimitDat();
  						if( orgLimitDat != null && !"0".equals(orgLimitDat.trim()) ) {
  							orgLimitDat = DateUtil.formatDate(rst.get(i).getAviPlayLimitDat(), 8);
  						} else {
  							orgLimitDat = "-";
  						} */
                %>
                <tr>
                    <td style="margin-left: 10px;"><%=list.get(i).getCctvLabel()%></td>
                    <td class="secStDat"><%=DateUtil.formatDate(list.get(i).getSecStDat())%></td>
                    <td><%=DateUtil.formatDate(list.get(i).getSecEdDat())%></td>
                    <% if (!"차량번호".equals(reqGbn) ){%>
	                    <td><%=orgLimitCnt%></td>
	                    <td class="orgLimitDat"><%=orgLimitDat%></td>
                    <%} %>
                    <%if (!"N".equals(maskingYn) ){
                        if(list.get(i).getMaskChk() != null && !"0".equals(list.get(i).getMaskChk()) ){
                    %>
                    <td>O</td>
                    <%} else {%>
                    <td>X</td>
                    <%}
                    }%>
                    <% if ( "차량번호".equals(reqGbn) ){%>
                		<td><%=list.get(i).getCarInfo() %></td>
                	<% }%>

					<td align="center">
                        <div class="progress pro_<%=realFileName %>" style="position:relative; min-width:280px; height:20px;"></div>
<%--                         <a key="<%=realFileName%>" class="avi_down work_<%=realFileName %>"></a> --%>
						<a class="avi_down work_<%=realFileName %> fileNm" target="_blank" style="color: #7780ff;"></a>
						<% if("Y".equals(systemSmiYn)) {%>
					       <br>
					    <a class="smi_down smi_<%=realFileName %> fileNm" target="_blank" style="color: #7780ff;"></a>
						<% } %>
            <%-- <%     	if("Y".equals(list.get(i).getRenewEviYn())){
						if("Y".equals(list.get(i).getRenewAcptYn())){
			%>
							<a class="avi_down work_<%=realFileName %> isRenewY fileNm" target="_blank" style="color: #7780ff;"></a>
			<%			}else{
			%>
							<a class="avi_down work_<%=realFileName %> fileNm" target="_blank" style="color: #7780ff;"></a>
			<%
						}
					}else{
			%>
			<%
					}
			%> --%>

                    </td>
<%--                     <td align="center" class="md5HashValue" style="display:none"><%=list.get(i).getVdwkMd5Cde()%></td> --%>
<%--                     <td align="center" class="shaHashValue" style="display:none"><%=list.get(i).getVdwkShaCde()%></td> --%>
<!--                      <td> -->
<%--                         <button class="btn_edit disableBtn" cnt="<%= list.get(i).getPlayLimitCnt() %>" dat="<%= orgLimitDat%>" avicontsid="<%= list.get(i).getAviContsId() %>" mgrno="<%=list.get(i).getCctvMgrNo() %>" rqst="<%=list.get(i).getRqstMgrSeq()%>">수정</button> --%>
<%--                           <button class="btn_edit disableBtn btn_t" mgrno="<%=list.get(i).getCctvMgrNo() %>" rqst="<%=list.get(i).getRqstMgrSeq()%>">수정</button> --%>
<!--                     </td> -->
                    <%-- <td class="renewReqstDat" align="center">
                        <% if ( list.get(i).getRenewMgrSeq() != null ){ %>
							<%= DateUtil.formatDate(list.get(i).getRenewReqstDat(), 8) %>
                        <% } %>
                    </td>
                    <td class="tCenter">
					<%
					if ( list.get(i).getRenewMgrSeq() != null ){
		                if( list.get(i).getRenewAcptDat() != null ){//.trim().equals("")
		                    if ( !"".equals(list.get(i).getRenewAcptDat().trim()) ){
	          	 	%>
                			<%= DateUtil.formatDate(list.get(i).getRenewAcptDat(), 8) %>
               	 	<%
	                    	}
                		}
					}
	                %>
					</td> --%>
                     <%-- <td align="center">
                        <% if ( list.get(i).getRenewMgrSeq() != null ){ %>
							<% if ( list.get(i).getRenewAcptYn() == null ){ %>
                   				 승인대기중
                    <% } else {
                           if("Y".equals(list.get(i).getRenewAcptYn())){
                    %>
                 				   <div id="isRenewY">승인됨</div>
                    <%
                           } else if ("N".equals(list.get(i).getRenewAcptYn())){
                     %>
                 				   거절됨
                    <%
                           }
                       }
                    %>
                        <% } %>
                    </td> --%>

					<td>
                        <%-- <button class="btn_edit disableBtn" cnt="<%= list.get(i).getPlayLimitCnt() %>" dat="<%= orgLimitDat%>" avicontsid="<%= list.get(i).getAviContsId() %>" mgrno="<%=list.get(i).getCctvMgrNo() %>" rqst="<%=list.get(i).getRqstMgrSeq()%>">수정</button> --%>
                        <button class="btn_edit btn_Dstyle" mgrno="<%=list.get(i).getCctvMgrNo() %>" rqst="<%=list.get(i).getRqstMgrSeq()%>">수정</button>
                    </td>
					<%-- <td class="tCenter">
	                <%
	                if ( list.get(i).getRenewMgrSeq() != null ){
	                	if("15".equals(list.get(i).getReqGbnCd())){
	                %>
	              		  오프라인반출
	                <%
	                	} else {
	                		if ( list.get(i).getRenewAcptYn() == null ) {
	                %>
	                    <button class="btn_acpt btn_style2" mgrseq="<%=list.get(i).getRenewMgrSeq()%>" rqstmgrseq="<%=list.get(i).getRqstMgrSeq()%>" avimgrseq="<%=list.get(i).getVdwkAviMgrSeq()%>" fileseq="<%=list.get(i).getVdwkFileSeq()%>" limdat="<%= list.get(i).getAviPlayLimitDat() %>">승인</button>
	                    <button class="btn_rejt btn_style2" mgrseq="<%=list.get(i).getRenewMgrSeq()%>">거절</button>
	                <%
	                		}
	                	}
	                }%>
                	</td> --%>

                </tr>

                <%
                      }
                  }
                %>
            </tbody>
        </table>
    </div>
</div>

<div class="bpopup hidden" id="add_target_pop">
    <div id="bpop_wrap">
		<div>
			<input type="hidden" class="sendData" id="rqstMgrSeq" name="rqstMgrSeq" value="">
			<input type="hidden" class="sendData" id="mgrSeq" name="mgrSeq" value="">
		</div>
		<table>
			<colgroup>
				<col width="100" />
				<col width="" />
			</colgroup>
			<tr>
				<th>
					<label>CCTV명</label>
				</th>
				<td style="padding-left:5px;">
					<span id="cctvLabel"></span>
				</td>
			</tr>
			<tr>
				<th>
					<label>요청영상시간</label>
				</th>
				<td style="padding-left:5px;">
					<span id="secIntv"></span>
				</td>
			</tr>
			<tr>
				<th>
					<label>횟수제한</label>
				</th>
				<td style="padding-left:5px;">
					<input type="text" id="playLimitCnt" name="playLimitCnt" class="sendData tCenter" value="" maxlength="3">
				</td>
			</tr>
			<tr>
				<th>
					<label>만료일</label>
				</th>
				<td style="padding-left:5px;">
					<input type="date" id="playLimitDat" name="playLimitDat" class="sendData tCenter" value="">
				</td>
			</tr>
		</table>
		<div class="btnDiv">
			<button id="btn_save" class="btn_style">저장</button>
		</div>
	</div>
</div>

