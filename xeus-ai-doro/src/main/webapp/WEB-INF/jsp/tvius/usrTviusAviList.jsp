<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@ page import="geomex.xeus.tvius.service.CrmsImageVo"%>
<%@ include file="../common.jsp"%>
<%
String rqstMgrSeq = (String)request.getAttribute("mgrseq");
String reqGbn = (String)request.getAttribute("reqGbn");
String videoSmy = (String)request.getAttribute("videoSmy");

HashMap<String, String> sysParam = (HashMap<String, String>)request.getAttribute("sysparam");

String maskingYn = sysParam.get("tvius.masking_yn");
String systemSmiYn = sysParam.get("tvius.smi_yn");

CrmsTransRqstVo rqst = (CrmsTransRqstVo) request.getAttribute("rqst");
ArrayList<CrmsTransAviVo> rst = (ArrayList<CrmsTransAviVo>)request.getAttribute("result");
ArrayList<CrmsImageVo> img = (ArrayList<CrmsImageVo>) request.getAttribute("imgList");
String videoSmyChk = (String) request.getAttribute("videoSmyChk");
%>
<script type="text/javascript" src="./res/geomex.xeus.tvius.usr.avi.view.js?t=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">

var rqstMgrSeq = '<%= rqstMgrSeq %>';
var reqGbn = '<%= reqGbn %>';
var userId = '<%= userId %>';
var maskingYn = '<%= maskingYn %>';
var videoSmy = '<%= videoSmy %>';
var videoSmyChk = '<%=videoSmyChk%>';
var SYSTEM_SMI_YN = '<%= sysParam.get("tvius.smi_yn") %>';

</script>
<div id="detailPopupWrap"></div>
<div id="serchBox2">
    <div class="tableWrapper"style="padding-bottom:30px;">
        <div><p class="searchTitle" style="display: inline;">신청 자료 목록</p>
<%-- <% if("11".equals(rqst.getReqGbnCd())){
   	if("SK".equals(rqst.getProcStatCd())){ %>
		<button id="btn_all_avi_download" class="btn_style2" style="float: right;margin: 10px 0px;">일괄 다운로드</button>
		<button id="btn_hash_download" class="btn_style2" style="float: right;margin: 10px 20px;">해시 다운로드</button>
 <% } %>
<% } %> --%>
	</div>

        <table id="data_table">
            <tr>
                <th>CCTV명</th>
                <th width="150">시작시간</th>
                <th width="150">종료시간</th>
                <th width="100">재생 횟수제한</th>
                <th width="100">재생 만료일</th>
			<% if ( !"N".equals(maskingYn) ){ %>
                <th>마스킹여부</th>
			<% } %>
			<%if ( "차량번호".equals(reqGbn) ){%>
               	<th>차량번호</th>
            <%}%>
                <!-- <th>파일수</th> -->
                <th width="400">파일목록</th>
<!--                 <th style="display:none">md5 해시값</th> -->
<!--                 <th style="display:none">sha 해시값</th> -->
			<%if ("Y".equals(videoSmyChk) && "Y".equals(videoSmy) ){%>
               	<th>고속검색</th>
            <%}%>
                <th width="200">연장/증거</th>
            </tr>
            <tbody id="avi_list_body">
			<% if (rst.size() == 0){ %>
	            <tr>
	                <td colspan="7" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
	            </tr>
			<% } else {
					for(int i=0; i<rst.size(); i++){

						String realFileName = rst.get(i).getMgrSeq()+"_"+rst.get(i).getRqstMgrSeq()+"_"+rst.get(i).getVdwkFileSeq();
						String orgLimitDat = rst.get(i).getAviPlayLimitDat().trim();
						String orgLimitCnt = Integer.toString(rst.get(i).getPlayLimitCnt());

						if("Y".equals(rst.get(i).getRenewEviYn()) || "Y".equals(rst.get(i).getRenewExtYn())){
							if(rst.get(i).getRenewPlayLimitDat() != null){
								orgLimitDat = rst.get(i).getRenewPlayLimitDat().trim();
							}

							if(rst.get(i).getRenewPlayLimitCnt() != null){
								orgLimitCnt = rst.get(i).getRenewPlayLimitCnt();
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
	                <td><%=rst.get(i).getCctvLabel()%></td>
	                <td><%=DateUtil.formatDate(rst.get(i).getSecStDat().trim())%></td>
	                <td><%=DateUtil.formatDate(rst.get(i).getSecEdDat().trim())%></td>
	                <td ><%=orgLimitCnt%></td>
	                <td class="orgLimitDat"><%=orgLimitDat%></td>
			<% if(!"N".equals(maskingYn)){
				  if(rst.get(i).getMaskChk() != null && !"0".equals(rst.get(i).getMaskChk()) ){
			%>
                    <td>O</td>
			<%    } else { %>
                    <td>X</td>
			<%	  }
				}
			%>
			<%if ( "차량번호".equals(reqGbn) ){%>
        			<td><%=rst.get(i).getCarInfo() %></td>
        	<%}%>
	                <td align="center">
	                    <div class="progress pro_<%=realFileName %>" style="position:relative; min-width:280px; height:20px;"></div>
	        <%-- <%     	if("Y".equals(rst.get(i).getRenewEviYn())){
						if("Y".equals(rst.get(i).getRenewAcptYn())){
			%>
							<a class="avi_down work_<%=realFileName %> isRenewY fileNm" target="_blank" style="color: #7780ff;"></a>
			<%			}else{
			%>
							<a class="avi_down work_<%=realFileName %>" target="_blank fileNm" style="color: #7780ff;"></a>
			<%
						}
					}else{
			%> --%>
						<a class="avi_down work_<%=realFileName %> fileNm" target="_blank" style="color: #7780ff;"></a>
			<%-- <%
					}
			%> --%>
						<% if("Y".equals(systemSmiYn)) { %>
					       <br>
					       <a class="smi_down smi_<%=realFileName %> fileNm" target="_blank" style="color: #7780ff;"></a>
						<% } %>
	                </td>

				<%if ("Y".equals(videoSmyChk) && "Y".equals(videoSmy) ){%>
	                <td align="center">
						<button id="videoChk" class="btn_Dstyle videoSmyBtn">고속검색 영상확인</button>
						<button id="exportVideo" class="btn_Dstyle videoSmyBtn">반 출</button>
						<button id="editVideo" class="btn_Dstyle videoSmyBtn">수 정</button>
					</td>
				<%} %>

<%-- 					<td class="md5HashValue" style="display:none"><%=rst.get(i).getVdwkMd5Cde()%></td> --%>
<%-- 					<td class="shaHashValue" style="display:none"><%=rst.get(i).getVdwkShaCde()%></td> --%>

	                <td>
                        <div style="margin: 3px;">
							<button class="btn_renew1 btn_Dstyle" avi="<%=rst.get(i).getMgrSeq()%>" file="<%=rst.get(i).getVdwkFileSeq()%>" dat="<%= orgLimitDat%>" mgrno="<%=rst.get(i).getCctvMgrNo() %>" rqst="<%=rst.get(i).getRqstMgrSeq()%>">연장신청</button>
                            <button class="btn_renew2 btn_Dstyle" avi="<%=rst.get(i).getMgrSeq()%>" file="<%=rst.get(i).getVdwkFileSeq()%>" dat="<%= orgLimitDat%>" mgrno="<%=rst.get(i).getCctvMgrNo() %>" rqst="<%=rst.get(i).getRqstMgrSeq()%>">증거신청</button><!-- style="width:80px;"  -->
			<%-- <%
				if("Y".equals(rst.get(i).getRenewEviYn())){
					if("Y".equals(rst.get(i).getRenewAcptYn())){
			%>
									<button id="isRenewY" class="btn_renew2 btn_t" avi="<%=rst.get(i).getVdwkFileSeq() %>" file="<%=rst.get(i).getMgrSeq() %>"  dat="<%= orgLimitDat%>" mgrno="<%=rst.get(i).getCctvMgrNo() %>" rqst="<%=rst.get(i).getRqstMgrSeq()%>" disabled>승인됨</button><!-- style="width:80px;"  -->
			<%		}else if("N".equals(rst.get(i).getRenewAcptYn())){ %>
                        			<button class="btn_renew2 btn_t" avi="<%=rst.get(i).getVdwkFileSeq() %>" file="<%=rst.get(i).getMgrSeq() %>"  dat="<%= orgLimitDat%>" mgrno="<%=rst.get(i).getCctvMgrNo() %>" rqst="<%=rst.get(i).getRqstMgrSeq()%>" disabled>거절됨</button><!-- style="width:80px;"  -->
			<%		}else{ %>
                        			<button class="btn_renew2 btn_t" avi="<%=rst.get(i).getVdwkFileSeq() %>" file="<%=rst.get(i).getMgrSeq() %>"  dat="<%= orgLimitDat%>" mgrno="<%=rst.get(i).getCctvMgrNo() %>" rqst="<%=rst.get(i).getRqstMgrSeq()%>" disabled>승인대기중</button><!-- style="width:80px;"  -->
			<%		}
				}else if("".equals(rst.get(i).getVdwkFileNm()) || rst.get(i).getVdwkFileNm() == null){

				}else{
			%>
			<%	} %> --%>
                        </div>
                    </td>
	            </tr>

			<%
					}
				}
			%>
            </tbody>
        </table>


	<% if(img.size() > 0){ %>
		<% if("SK".equals(rqst.getProcStatCd())){ %>
	    <button id="btn_all_img_download" class="btn_style2" style="float: right;margin: 10px 0px;">일괄 다운로드</button>
		<% } %>
        <table id="img_data_table">
			<tbody id="imgList">
				<tr>
					<th width="150">이미지 등록번호</th>
					<th width="200">등록일</th>
					<th width="500">이미지설명</th>
					<th>파일명</th>
				</tr>
		<% for(int i=0; i<img.size(); i++){ %>
				<tr>
					<td><%= img.get(i).getMgrSeq() %></td>
					<td><%= DateUtil.formatDate(img.get(i).getRegDat()) %></td>
					<td><%= img.get(i).getImgDesc() %></td>
					<%-- <td><%= img.get(i).getImgNm() %></td> --%>
			<% if("SW".equals(rqst.getProcStatCd())){ %>
					<td>승인 대기중</td>
			<% }else{ %>
					<td><a class="img_down" downnm="<%= img.get(i).getImgNm() %>" realnm="<%= img.get(i).getImgPath() %>" target="_blank" style="color: rgb(119, 128, 255); font-weight: bold; cursor: pointer; text-decoration: none;"><%= img.get(i).getImgNm() %></a></td>
			<% } %>
				</tr>
		<% } %>
			</tbody>
		</table>
	<% } %>

    </div>
</div>

