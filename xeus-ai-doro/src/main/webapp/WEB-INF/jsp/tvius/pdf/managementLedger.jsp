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

<%@page import="com.itextpdf.text.*"%>
<%@page import="com.itextpdf.text.pdf.PdfWriter"%>

<%@page import="geomex.xeus.tvius.service.CrmsTransAviVo"%>
<%@page import="geomex.xeus.util.code.CodeConvertor"%>
<%@page import="geomex.xeus.util.code.DateUtil"%>

<%@ page trimDirectiveWhitespaces="true" %>
<%
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
//     String uni = (String)request.getAttribute("title");
    String title = (String)request.getAttribute("title");

//     StringBuffer str = new StringBuffer();
//     for( int i= uni.indexOf("\\u") ; i > -1 ; i = uni.indexOf("\\u") ){// euc-kr(%u), utf-8(//u)
//         str.append( uni.substring( 0, i ) );
//         str.append( String.valueOf( (char)Integer.parseInt( uni.substring( i + 2, i + 6 ) ,16) ) );
//         uni = uni.substring( i +6);
//     }
//     str.append( uni );

//     title = str.toString();

%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<title>영상반출관리대장</title>
<style>
    body *{
        /* font-family:NanumGothic; */
        font-family:NanumBarunGothic
    }

    @page {
         size: A4 landscape;
         @bottom-center {
            /* content: counter(page) " - " counter(pages); */
            content: counter(page);
          }
    }
    body {
        width:99%;
        height:100%;
    }
    .top_content .top_title { font-size:10px; line-height:30px; }
    .top_content .top_sign_content {float: right; }
    .top_content .top_sign_content table {border-right:1px solid #000;}
    .top_content .top_sign_content table th{ border:1px solid #000; background:#fff; height:20px; border-right:0; text-align:center; font-size:11px; }
    .top_content .top_sign_content table td{ border:1px solid #000; background:#fff; height:60px; border-right:0;}

    .top_content:after{ content:""; clear: both; display: block; }

    .info_content {margin-top:10px;  }
    .info_content dl { border:1px solid #000; width:350px; padding:0; margin:0;  border-bottom:0; line-height:25px; font-size:11px;}
    .info_content dl dd, .info_content dl dt { float: left; padding:0; margin:0; padding-left:10px; text-align:center; font-size:11px; }
    .info_content dl:after { content:""; clear: both; display: block; }

    .info_content .left_c{ float:left;}

    .info_content .right_c{ float:right; padding-top:40px; font-size:18px; font-weight: bold;}
    .info_content:after {  content:""; clear: both; display: block; }

    .next-print:after {

    }
    .wrap_content table { width:100%; }

    .wrap_content table .next-print{page-break-before: always;}
    .wrap_content table th { border:1px solid #000; background:#fff; border-right:0;  border-bottom:1px solid #000; height:50px; font-size:11px; text-align: center;}
    .wrap_content table td { border:1px solid #000; background:#fff; height:150px; font-size:10px; border-right:0; padding-left:5px;}/*  border-top:0; */
</style>
</head>
<body>
<%
    int size = list.size();
    int rowCnt = 0;
    int chkCnt = 3;
    int currentFileCnt = 0;
    for(int i=0;i<size;i++){
        if(rowCnt == 0){
        %>
        <div style = "font-size:12px; "> [별지 제 3호서식] </div>
        <div align="center" style = "font-size:25px; "> 개인영상정보 관리대장 </div>
        <div class="top_content">
	    <div class="top_sign_content">
            <table cellpadding="0" cellspacing="0">
                 <colgroup>
                     <col width="30"/>
                     <col width="70"/>
                     <col width="70"/>
                     <col width="70"/>
                 </colgroup>
                 <thead>
                     <tr>
                         <th rowspan="3" >결제<br/>공람</th>
                         <th>담당자</th>
                         <th>담  당</th>
                         <th>과  장</th>
                     </tr>
                     <tr>
                         <td></td>
                         <td></td>
                         <td></td>
                     </tr>
                     <tr>
                         <th colspan="4">제천시</th><!-- 00시 안전총괄과 -->
                     </tr>
                 </thead>
             </table>
        </div>
        </div>
        <div class="wrap_content">
         <table cellpadding="0" cellspacing="0">
             <colgroup>
                 <col width="7%"/>
                 <col width="5%"/>
                 <col width="7%"/>
                 <col width="20%"/>
                 <col width="5%"/>
                 <col width="11%"/>
                 <col width="9%"/>
                 <col width="9%"/>
                 <col width="7%"/>
                 <col width="15%"/>
                 <col width="3%"/>
             </colgroup>
             <thead dir="ltr" >
                 <tr>
                     <th>번호</th>
                     <th>구분</th>
                     <th>일시</th>
                     <th>파일명/<br/>형태</th>
                     <th>담당자</th>
                     <th>목적/사유</th>
                     <th>이용<br/>제공받는 제 3자<br/>/열람등 요구자</th>
                     <th>이용<br/>제공 근거</th>
                     <th>이용<br/>제공 형태</th>
                     <th>기간</th>
                     <th style = "border-right:1px solid #000; !important">범인<br/>검거<br/>(여/부)</th>
                 </tr>
             </thead>
             <tbody id="print_list_body">
        <%
        }

        currentFileCnt = StringUtils.trimToEmpty( list.get(i).getFileList() ).split(",").length;
        if ( currentFileCnt > 7){
            chkCnt -= 1;
        }

        if ( rowCnt > chkCnt || (rowCnt == 2 && currentFileCnt > 7) ){
            currentFileCnt = 0;
            rowCnt = 0;
            chkCnt = 3;

            //out.print(docEd);

            %>
                </tbody>
            </table>
        </div>
            <%
            if( (i+1) != size) {
                i = i-1;
            //out.print(nextPage);
            %>
            <div style="page-break-before: always;"></div>
            <%
            } else {
                break;
            }
        } else {

            rowCnt += 1;
        %>
                <tr>
                    <!-- 번호 -->
                    <td style = "text-align:center"><%= StringUtils.trimToEmpty( list.get(i).getRqstMgrSeq())%></td>
                    <!-- 구분 -->
                    <td style = "text-align:center">
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

                        <span>□ 파기</span><br/>
                    </td>
                    <!-- 일시 -->
                    <td style = "text-align:center"><%= DateUtil.formatDate( list.get(i).getReqstDat(), 8 ) %></td>

                    <!-- 파일명/형태 -->
                    <td>
                    <%
                        String fileNm = "";
                        if ( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("11"))
							 || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("13"))
                        	 || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("14"))
                        	 || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("15"))
                        	 ){

							String ext = ".MS4";
							//차량반출일 경우 .zip으로 표기
							if(StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("14"))) ext = ".zip";
                            String[] VdwkFileList = StringUtils.trimToEmpty( list.get(i).getFileList().replaceAll("&", "&amp;") ).split("\\|\\|");

                            for(int j=0; j<VdwkFileList.length; j++){

                                fileNm += VdwkFileList[j] + ext +"<br/>";

                            }

                            fileNm = StringEscapeUtils.escapeHtml(fileNm);

                        } else if ( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("12")) ){
                            //열람일 경우 CCTV 라벨명 얻어오기 위한 DB처리
                            //////////////////////////////////////////////////////////////////////////////////////

                            //fileNm = "일단 임시로 암거나 넣어놓음.";
                            String[] cctvList = StringUtils.trimToEmpty( list.get(i).getCctvList().replaceAll("&", "&amp;") ).split("\\|\\|");

                            fileNm = " ○ " + StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ) + " CCTV목록<br/>";

                            for(int k=0; k<cctvList.length; k++){

                                fileNm += cctvList[k] + "<br/>";

                            }

                            fileNm = StringEscapeUtils.escapeHtml(fileNm);

                            //////////////////////////////////////////////////////////////////////////////////////

                        }
                    %>
                    <%-- <%= StringUtils.trimToEmpty( list.get(i).getVdwkFileList() ).replaceAll(",", ",<br/>") %> --%>
                    <%= fileNm %>
                    <%-- <% }%> --%>
                    </td>

                    <!-- 담당자 -->
                    <td>
                        <%= StringUtils.trimToEmpty(list.get(i).getAcptUserInfo())%><br/>
                    </td>

                    <!-- 목적/사유 -->

                    <% if(StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkCrimeTyp.get("13"))){
                    %>
                        <td>○범죄유형 :<br/>긴급반출<br/>○사유 :<br/>긴급반출 </td>
                    <% }else {
                        String rqstDetail = StringUtils.trimToEmpty(list.get(i).getReqstDetail());
                    %>
                    <td>○범죄유형 :<br/><%=StringUtils.trimToEmpty(list.get(i).getCrimeNm()) %><br/>○사유 :<br/><%= rqstDetail %></td>
                    <%
                    }
                    %>
                    <!-- <td>○범죄유형<br/>- 살인, 강도,<br/>절도,폭력<br/>(가정,성,기타)<br/>-교통사고,자살<br/>-기타 : <br/>○사유 : </td> -->
                    <!-- 이용 제공받는 제3자 / 열람등 요구자 -->
                    <td>
                    ○요구자<br/>
                    소속 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[2].trim() ) %><br/>
                    계급 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[3].trim() ) %><br/>
                    성명 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[1].trim() ) %><br/>
                    연락처: <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[4].trim() ) %><br/>
                    ○수령자<br/>
                    소속 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[2].trim() ) %><br/>
                    계급 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[3].trim() ) %><br/>
                    성명 : <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[1].trim() ) %><br/>
                    연락처: <%=StringUtils.trimToEmpty(list.get(i).getRqstUserInfo().split("/")[4].trim() ) %>
                    </td>
                    <!-- 이용 제공 근거 -->
                    <td>
                    ○문서번호 :<br/><%= StringUtils.trimToEmpty(list.get(i).getDocNo())%><br/><br/>
                    ○보안서약  : O<br/>○개인정보보호법 :<br/>제 29조<!-- <br/>제 항 -->
                    </td>
                    <!-- 이용 제공 형태 -->
                    <td>
                    <br/>○이용자료<br/>
                    <%
                    if(StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("11")) || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("13")) || StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("15"))){ %>
                    &nbsp; ■ 동영상<br/>
                    &nbsp; □ 사진<br/>
                    &nbsp; □ 엑셀자료<br/>
                    &nbsp; □ 기타<br/>
                    <%}else if( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("14"))) { %>
                    &nbsp; □ 동영상<br/>
                    &nbsp; ■ 사진<br/>
                    &nbsp; □ 엑셀자료<br/>
                    &nbsp; □ 기타<br/>
                    <%}else if( StringUtils.trimToEmpty( list.get(i).getReqGbnCd() ).equals(chkReqGbnCd.get("12"))) { %>
                    &nbsp; □ 동영상<br/>
                    &nbsp; □ 사진<br/>
                    &nbsp; □ 엑셀자료<br/>
                    &nbsp; □ 기타<br/>
                    <%}else{ %>
                    &nbsp; □ 동영상<br/>
                    &nbsp; □ 사진<br/>
                    &nbsp; □ 엑셀자료<br/>
                    &nbsp; ■ 기타<br/>
                    <%} %>

                    ○제공형태<br/>
                    <%if(StringUtils.trimToEmpty(list.get(i).getRecvMthd()).equals("FD")){ %>
                    &nbsp; ■ USB<br/>
                    &nbsp; □ 기타
                    <%}else{ %>
                    &nbsp; □ USB<br/>
                    &nbsp; ■ 기타
                    <%} %>

                    </td>
                    <!-- 기간 -->
                    <td>
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

                    %>
                    <%
                    if ( "".equals(interval) ){
                    %>

                    ○영상정보 기록기간/장소<br/>-기간 :<br/><br/>-장소 :<br/><%= juso %><br/>
                    <%
                    } else {
                    %>
                    ○영상정보 기록기간/장소<br/>-기간 :<br/><%=interval%><br/>-장소 :<br/><%= juso %><br/>
                    <%
                    }
                    %>
                    <%

                    Date today = new Date();

                    String getMon = (today.getMonth()+1) + "";

                    if (getMon.length() == 1){
                        getMon = "0"+getMon;
                    }

                    String getYMD = (today.getYear()+1900) + getMon + today.getDate();

                    String limitDat = list.get(i).getPlayLimitDat().trim();

                    if ( !"0".equals(limitDat) && !"".equals(limitDat)){
                        limitDat = DateUtil.formatDate( limitDat, 8);
                    %>
                        ○보관기간 및 파기예정일자 : <%= limitDat %><br/><br/>
                    <%
                        if (Integer.parseInt(getYMD) < Integer.parseInt(limitDat.replaceAll("-", "")) ) {
                    %>
                        ○파기 등 결과 및 처리일자 :<br/><%=limitDat %><br/>
                    <%
                        } else{
                    %>
                        ○파기 등 결과 및 처리일자 :<br/><br/>
                    <%
                        }
                    } else  {
                        limitDat = "";
                    %>
                        ○보관기간 및 파기예정일자 : <br/><br/>
                        ○파기 등 결과 및 처리일자 :<br/><br/>
                    <%
                    }
                    %>
                        ○안전관리 요청 및 결과 :

                    </td>
                    <!-- 범인 검거 -->
                    <td style = "border-right:1px solid #000; !important"></td>
                </tr>
            <%if (rowCnt >= chkCnt){
                rowCnt = 0;
                chkCnt = 3;
                currentFileCnt = 0;
            %>
            </tbody>
        </table>
    </div>


            <div style="page-break-before: always;"></div>


            <%
                //out.print(nextPage);
            } else if ( (i+1) == size ){
                //out.print(docEd);
                %>
                </tbody>
            </table>
        </div>
                <%
            }
        }

    }
%>
</body>
</html>