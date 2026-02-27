<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> -->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="org.apache.commons.lang3.StringUtils" %>
<%@page import="org.apache.commons.lang.StringEscapeUtils" %>

<%@page import="java.util.Date"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.TreeSet"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.io.*"%>
<%@page import="java.text.SimpleDateFormat"%>

<%@page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@page import="geomex.xeus.util.code.CodeConvertor"%>
<%@page import="geomex.xeus.util.code.DateUtil"%>
<%@page import="geomex.xeus.util.code.StrUtil"%>

<%@ page trimDirectiveWhitespaces="true" %>
<%
	HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

	String startDat = "";
	String endDat = "";

	if (param.containsKey("startDat")){
		if (param.get("startDat") != null) {
			startDat = DateUtil.formatDate(param.get("startDat").trim(), 8);
		}
	}

	if (param.containsKey("endDat")){
		if (param.get("endDat") != null) {
			endDat = DateUtil.formatDate(param.get("endDat").trim(), 8);
		}
	} else {

	    SimpleDateFormat dayTime = new SimpleDateFormat("YYYY-MM-dd");
	    endDat = dayTime.format(new Date());
	}

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD51 // 8대중과실 */
    HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
    Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
    Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>)request.getAttribute("list");

    //properties에서 한글입력 시 유니코드형태로 바뀌기 떄문에 디코딩하는 로직 추가
    /* String uni = (String)request.getAttribute("title");
    String title = "";

    StringBuffer str = new StringBuffer();
    for( int i= uni.indexOf("\\u") ; i > -1 ; i = uni.indexOf("\\u") ){// euc-kr(%u), utf-8(//u)
        str.append( uni.substring( 0, i ) );
        str.append( String.valueOf( (char)Integer.parseInt( uni.substring( i + 2, i + 6 ) ,16) ) );
        uni = uni.substring( i +6);
    }
    str.append( uni );

    title = str.toString(); */

    String fileName = DateUtil.getStrMin() + "_영상반출관리대장.xls";
	response.setContentType("application/vnd.ms-excel; charset=UTF-8");
	response.setHeader("Content-Disposition", "attachment; filename=" + new String(java.net.URLEncoder.encode(fileName,"UTF-8").getBytes(), "ISO8859_1"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>test</title>
<style type="text/css">
table th {
    font-size: 12px;
    color: #585858;
    height: 38px;
    background-color: #D9DADC;
    border: 1px #bbbbbb solid;
}

/* table thead th {
    color: #CFCDCC;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    background-color: #3F4551;
} */

table thead .preface {
    font-size: 16px;
}

table thead .title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    height: 60px;
}

table thead td {
    text-align: center;
    mso-number-format:"\@";
}

table tbody td {
    text-align: center;
    background-color: #F8F9FA;
    mso-number-format:"\@";
    border: 1px #ddd solid;
}
br{
	mso-data-placement:same-cell;
}
</style>
</head>
<body>
	<table>
		<colgroup>
		    <!-- <col width="7%"/>
		    <col width="5%"/>
		    <col width="7%"/>
		    <col width="20%"/>
		    <col width="5%"/>
		    <col width="11%"/>
		    <col width="9%"/>
		    <col width="9%"/>
		    <col width="7%"/>
		    <col width="15%"/>
		    <col width="3%"/> -->
		    <col width="110"/>
		    <col width="80"/>
		    <col width="100"/>
		    <col width="400"/>
		    <col width="150"/>
		    <col width="200"/>
		    <col width="200"/>
		    <col width="180"/>
		    <col width="180"/>
		    <col width="180"/>
		    <col width="180"/>
		</colgroup>
		<thead>
			<tr>
				<td colspan="2" class="preface">[별지 제 3호서식]</td><td colspan="9"></td>
			</tr>
			<tr align="center">
				<td colspan="11" align="center" class="title">개인영상정보 관리대장</td>
			</tr>
			<tr>
				<td colspan="7" rowspan="3"></td>
			    <th rowspan="3" style="vertical-align: middle;">결재<br>공람</th>
			    <th style="height: 30px;">담당자</th>
			    <th style="height: 30px;">담  당</th>
			    <th style="height: 30px;">과  장</th>
			</tr>
			<tr>
			    <td style="height: 120px; border-right: 1px #ddd solid;"></td>
			    <td style="height: 120px; border-right: 1px #ddd solid;"></td>
			    <td style="height: 120px; border-right: 1px #ddd solid;"></td>
			</tr>
			<tr>
			    <th colspan="3" style="height: 30px;">제천시</th><!-- 00시 안전총괄과 -->
			</tr>
			<tr>
			    <td colspan="11"></td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>번호</th>
				<th>구분</th>
				<th>일시</th>
				<th>파일명/형태</th>
				<th>담당자</th>
				<th>목적/사유</th>
				<th>이용 제공받는 제 3자<br/>/열람등 요구자</th>
				<th>이용 제공 근거</th>
				<th>이용 제공 형태</th>
				<th>기간</th>
				<th>범인 검거<br/>(여/부)</th>
			</tr>

<%
    int size = list.size();
	if(size == 0){
%>
			<tr>
                <td colspan="11" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
<%
	}else{
    	for(int i=0;i<size;i++){
    		Date today = new Date();

			String getMon = (today.getMonth()+1) + "";

			if (getMon.length() == 1){
			    getMon = "0" + getMon;
			}

			String getDay = today.getDate() + "";

			if (getDay.length() == 1){
				getDay = "0" + getDay;
			}

			String getYMD = (today.getYear()+1900) + getMon + getDay;

			String limitDat = list.get(i).getPlayLimitDat().trim();

%>
            <tr>
                <!-- 번호 -->
                <td><%= StringUtils.trimToEmpty( list.get(i).getRqstMgrSeq())%></td>
                <!-- 구분 -->
                <td>
                	<span>□ 이용</span><br/>

                    <% if ( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals( chkReqGbnCd.get("11") )
                            || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals( chkReqGbnCd.get("13") )
                            || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals( chkReqGbnCd.get("14") )
                            || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals( chkReqGbnCd.get("15") )){ %>
                        <span>■ 제공</span><br/>
                    <% } else{%>
                        <span>□ 제공</span><br/>
                    <% } %>

                    <% if ( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals( chkReqGbnCd.get("12") ) ){ %>
                        <span>■ 열람</span><br/>
                    <% } else{%>
                        <span>□ 열람</span><br/>
                    <% } %>
					<%
                    if(!"0".equals(limitDat)){
						String destroyDat = DateUtil.formatDate( limitDat, 8);
						if (getYMD != null && !"".equals(getYMD) &&
						    destroyDat != null && !"".equals(destroyDat) &&
						    Integer.parseInt(getYMD) > Integer.parseInt(destroyDat.replaceAll("-", "")) ) { %>
							<span>■ 파기</span><br/>
						<%} else{ %>
							<span>□ 파기</span><br/>
						<%}
					} else{%>
						<span>□ 파기</span><br/>
					<%} %>
                </td>
                <!-- 일시 -->
                <td><%= DateUtil.formatDate( list.get(i).getReqstDat(), 8 ) %></td>
                <!-- 파일명/형태 -->
<%
			String fileNm = "";
			if ( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("11"))
				|| StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("13"))
				|| StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("14"))
				|| StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("15"))){

				String ext = ".MS4";
				//차량반출일 경우 .zip으로 표기
				if(StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("14"))) ext = ".zip";
			    String[] VdwkFileList = StringUtils.trimToEmpty( list.get(i).getFileList().replaceAll("&", "&amp;") ).split("\\|\\|");

			    for(int j=0; j<VdwkFileList.length; j++){

			        fileNm += VdwkFileList[j] + ext;
			        if(j != (VdwkFileList.length -1)) fileNm += "<br>";

			    }

			    //fileNm = StringEscapeUtils.escapeHtml(fileNm);

			} else if ( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("12")) ){
			    //열람일 경우 CCTV 라벨명 얻어오기 위한 DB처리
			    //////////////////////////////////////////////////////////////////////////////////////

			    //fileNm = "일단 임시로 암거나 넣어놓음.";
			    String[] cctvList = StringUtils.trimToEmpty( list.get(i).getCctvList().replaceAll("&", "&amp;") ).split("\\|\\|");

			    fileNm = " ○ " + StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ) + " CCTV목록<br>";

			    for(int k=0; k<cctvList.length; k++){

			        fileNm += "&nbsp; &nbsp; " + cctvList[k];
			        if(k != (cctvList.length -1)) fileNm += "<br>";

			    }

			    //fileNm = StringEscapeUtils.escapeHtml(fileNm);

			    //////////////////////////////////////////////////////////////////////////////////////

			}
%>
                <td style="text-align: left !important;"><%= fileNm %></td>
                <!-- 담당자 -->
                <td><%= StringUtils.trimToEmpty(list.get(i).getAcptUserInfo())%></td>

                <!-- 목적/사유 -->
<%
			if(StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkCrimeTyp.get("13"))){
%>
            	<td style="text-align: left !important;">
            		○범죄유형 :<br/>
            		&nbsp; &nbsp; 긴급반출<br/>
            		○사유 :<br/>
            		&nbsp; &nbsp; 긴급반출
            	</td>
<%
			}else {
				String rqstDetail = StringUtils.trimToEmpty(list.get(i).getReqstDetail());
%>
                <td style="text-align: left !important;">
                	○범죄유형 :<br/>
                	&nbsp; &nbsp; <%=StringUtils.trimToEmpty(list.get(i).getCrimeNm()) %><br/>
                	○사유 :<br/>
                	&nbsp; &nbsp; <%= rqstDetail %>
                </td>
<%
			}
%>
                <td style="text-align: left !important;">
					○요구자<br/>
	                &nbsp; &nbsp; 소속 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[2].trim() ) %><br/>
	                &nbsp; &nbsp; 계급 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[3].trim() ) %><br/>
	                &nbsp; &nbsp; 성명 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[1].trim() ) %><br/>
	                &nbsp; &nbsp; 연락처: <%=StrUtil.strTelAdd(StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[4].trim() ) ) %><br/>
	                ○수령자<br/>
	                &nbsp; &nbsp; 소속 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[2].trim() ) %><br/>
	                &nbsp; &nbsp; 계급 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[3].trim() ) %><br/>
	                &nbsp; &nbsp; 성명 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[1].trim() ) %><br/>
	                &nbsp; &nbsp; 연락처: <%=StrUtil.strTelAdd(StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[4].trim() ) ) %>
                </td>

                <!-- 이용 제공 근거 -->
                <td style="text-align: left !important;">
	                ○문서번호 :<br/>
	                &nbsp; &nbsp; <%= StringUtils.trimToEmpty(list.get(i).getDocNo())%><br/>
	                ○보안서약  : <br/>
	                &nbsp; &nbsp; O<br/>
	                ○개인정보보호법 :<br/>
	                &nbsp; &nbsp; 제 29조<!-- <br/>제 항 -->
                </td>
                <!-- 이용 제공 형태 -->
                <td style="text-align: left !important;">
                	○이용자료<br/>
<%
			if(StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("11")) || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("12")) || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("13"))){ %>
	                &nbsp; &nbsp; ■ 동영상<br/>
	                &nbsp; &nbsp; □ 사진<br/>
	                &nbsp; &nbsp; □ 엑셀자료<br/>
	                &nbsp; &nbsp; □ 기타<br/>
<%
			}else if( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("14"))) {
%>
	                &nbsp; &nbsp; □ 동영상<br/>
	                &nbsp; &nbsp; ■ 사진<br/>
	                &nbsp; &nbsp; □ 엑셀자료<br/>
	                &nbsp; &nbsp; □ 기타<br/>
<%
			}else if( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("12"))) {
%>
	                &nbsp; &nbsp; □ 동영상<br/>
	                &nbsp; &nbsp; □ 사진<br/>
	                &nbsp; &nbsp; □ 엑셀자료<br/>
	                &nbsp; &nbsp; □ 기타<br/>
<%
			}else{
%>
	                &nbsp; &nbsp; □ 동영상<br/>
	                &nbsp; &nbsp; □ 사진<br/>
	                &nbsp; &nbsp; □ 엑셀자료<br/>
	                &nbsp; &nbsp; ■ 기타<br/>
<%
			}
%>
                	○제공형태<br/>
<%
// 			if(StringUtils.trimToEmpty(list.get(i).getRecvMthd()).equals("FD")){
			if(StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("11"))){
%>
	                &nbsp; &nbsp; □ USB<br/>
	                &nbsp; &nbsp; ■ 기타
<%
			}else{
%>
	                &nbsp; &nbsp; □ USB<br/>
	                &nbsp; &nbsp; □ 기타
<%
			}
%>
                </td>
                <!-- 기간 -->
                <td style="text-align: left !important;">
<%
			String interval = "";
			String fileList = StringUtils.trimToEmpty(list.get(i).getFileList()).split(",")[0];

			if ( fileList.length() > 15){
			    if( fileList.indexOf("__") < 0  ){
			        int strLen = fileList.split("\\_").length;
			        String st_dat = fileList.split("\\_")[strLen -2];
			        String ed_dat = fileList.split("\\_")[strLen -1];

			        st_dat = st_dat.substring(0,4) + "/" + st_dat.substring(4,6)+ "/" + st_dat.substring(6,8) + " " +
			                st_dat.substring(8,10) + ":" + st_dat.substring(10,12)+ ":00";
			        ed_dat = ed_dat.substring(0,4) + "/" + ed_dat.substring(4,6)+ "/" + ed_dat.substring(6,8) + " " +
			                ed_dat.substring(8,10) + ":" + ed_dat.substring(10,12)+ ":00";

			        interval = st_dat + " ~ " + ed_dat;
			    }
			    else{
			        interval = "";
			    }
			}

			//주소 얻어오기 위한 DB처리
			//////////////////////////////////////////////////////////////////////////////////////

			String juso = "";

			//////////////////////////////////////////////////////////////////////////////////////

			if ( "".equals(interval) ){
%>

                	○영상정보 기록기간/장소<br/>
                	&nbsp; &nbsp; -기간 :<br/>
                	&nbsp; &nbsp; &nbsp; &nbsp; <br/>
                	&nbsp; &nbsp; -장소 :<br/>
                	&nbsp; &nbsp; &nbsp; &nbsp; <%= juso %><br/>
<%
			} else {
%>
					○영상정보 기록기간/장소<br/>
					&nbsp; &nbsp; -기간 :<br/>
					&nbsp; &nbsp; &nbsp; &nbsp; <%=interval%><br/>
					&nbsp; &nbsp; -장소 :<br/>
					&nbsp; &nbsp; &nbsp; &nbsp; <%= juso %><br/>
<%
			}

			if ( !"0".equals(limitDat) && !StringUtils.trimToEmpty( list.get(i).getReqGbnCd()).equals(chkReqGbnCd.get("12"))){
				limitDat = DateUtil.formatDate( limitDat, 8);
%>
                   	○보관기간 및 파기예정일자 :<br/>
                   	 &nbsp; &nbsp; <%= limitDat %><br/>
<%
				if (Integer.parseInt(getYMD) > Integer.parseInt(limitDat.replaceAll("-", "")) ) {
%>
                    ○파기 등 결과 및 처리일자 :<br/>
                     &nbsp; &nbsp; <%=limitDat %><br/>
<%
				} else{
%>
                    ○파기 등 결과 및 처리일자 :<br/>
                    &nbsp; &nbsp; <br/>
<%
				}
			} else if("0".equals(limitDat) && !StringUtils.trimToEmpty( list.get(i).getReqGbnCd()).equals(chkReqGbnCd.get("12"))) {
				limitDat = "";
%>
                    ○보관기간 및 파기예정일자 : <br/>
                    &nbsp; &nbsp; 증거신청자료 USB 반출<br/>
                    ○파기 등 결과 및 처리일자 :<br/>
                    &nbsp; &nbsp; 증거신청자료 USB 반출<br/>
<%
			} else {
				limitDat = "";
%>
					○보관기간 및 파기예정일자 : <br/>
                    &nbsp; &nbsp; <br/>
                    ○파기 등 결과 및 처리일자 :<br/>
                    &nbsp; &nbsp; <br/>
<%			} %>
                    ○안전관리 요청 및 결과 :<br/>
                </td>
                <!-- 범인 검거 -->
                <td></td>
            </tr>
<%
		}
	}
%>
    	</tbody>
    </table>
</body>
</html>