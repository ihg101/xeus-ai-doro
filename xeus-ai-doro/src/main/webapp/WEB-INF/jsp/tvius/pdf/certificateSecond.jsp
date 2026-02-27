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
<%@page import="java.text.DecimalFormat"%>
<%@page import="java.io.*"%>

<%@page import="com.itextpdf.text.*"%>
<%@page import="com.itextpdf.text.pdf.PdfWriter"%>

<%@page import="geomex.xeus.tvius.service.CrmsTransWorkVo"%>
<%@page import="geomex.xeus.util.code.DateUtil"%>

<%@page import="net.minidev.json.JSONArray"%>
<%@page import="net.minidev.json.JSONObject"%>
<%@page import="net.minidev.json.parser.JSONParser"%>

<%@ page trimDirectiveWhitespaces="true" %>
<%
    String jsonTxt = (String)request.getAttribute("jsonTxt");

    ArrayList<CrmsTransWorkVo> list = new ArrayList<CrmsTransWorkVo>();
    JSONParser parser = new JSONParser(JSONParser.MODE_JSON_SIMPLE);
    JSONArray array = (JSONArray) parser.parse(jsonTxt);
    for(int i=0; i<array.size(); i++){
    	JSONObject json = (JSONObject) array.get(i);
    	CrmsTransWorkVo workVo = new CrmsTransWorkVo();

        if(json.get("uploadNm") != null)       workVo.setUploadNm(json.get("uploadNm").toString());
    	if(json.get("uploadFileSize") != null) workVo.setUploadFileSize(json.get("uploadFileSize").toString());
    	if(json.get("fileNm") != null)         workVo.setFileNm(json.get("fileNm").toString());
    	if(json.get("shaCde") != null)         workVo.setShaCde(json.get("shaCde").toString());
    	if(json.get("md5Cde") != null)	       workVo.setMd5Cde(json.get("md5Cde").toString());

        list.add(workVo);
    }
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<title>해시코드 조회 인증서</title>
<style>
    body *{
        /* font-family:NanumGothic; */
        font-family:NanumBarunGothic
    }

    @page {
         size: A4 landscape;
         /* @bottom-center {
            content: "Page : "counter(page) " of " counter(pages);/* 창녕의 경우 3페이지부터 시작해야되서 */
         } */
    }
    body {
        width:99%;
        height:100%;
    }
    .top_content .top_title { font-size:30px; padding-top:0; line-height:30px; margin-top:0; }/* float: left; */
	.top_content .top_sign_content {float: right; padding-bottom: 20px;}
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
	.wrap_content table { width:90%; height:100%; margin-left: 30px; }/* border:1px solid #000;  */

	.wrap_content table .next-print{page-break-before: always;}
	.wrap_content table th { border:1px solid #000; background:#fff; border-right:0;  border-bottom:1px solid #000; height:40px; font-size:11px; text-align: center;}
	.wrap_content table td { border:1px solid #000; background:#fff; height:25px; text-align: center; border-right:1px solid #000; font-size:10px; border-top:1px solid #000; font-size: 15px;}
</style>
</head>
<body>
    <div class="wrap_content">
        <div align="center" style="margin: auto; vertical-align: middle;"><!--  style="-ms-transform: rotateX(90deg); " class="wrap_content"-->
            <br/>
            <table cellpadding="0" cellspacing="0">
            <colgroup>
                <col width="5%"/>
                <col width="9%"/>
                <col width="43%"/>
                <col width="43%"/>
            </colgroup>
            <tbody id="print_list_body">
                <tr>
                    <td colspan="4" style="height: 50px; font-size: 20px;"><b>해시값 생성 결과 확인서</b></td>
                </tr>
                <tr>
                    <%
                        String sTime = DateUtil.getStrMin();
                    %>
                    <td colspan="4">시작시간 : <%=sTime.substring(0,4) %> 년
                                     <%=sTime.substring(4,6) %> 월
                                     <%=sTime.substring(6,8) %> 일
                                     <%=sTime.substring(8,10) %> 시
                                     <%=sTime.substring(10,12) %> 분 (주의 : 컴퓨터시간으로 실제시간 체크요망)</td>
                </tr>
                <tr>
                    <td colspan="2"></td>
                    <td style="font-size: 12px;">원본 파일</td>
                    <td style="font-size: 12px;">비교 파일</td>
                </tr>

<%
for (int j=0; j<list.size(); j++) {
    if ( (j+1) == 6 ) {
%>
                <tr class="next-print" style="[padding-top: 5px;]">
                    <td colspan="4" style="border: 0;"></td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px;"></td>
                </tr>
<%
    }
%>
                <tr>
                    <td rowspan="4" style="font-size: 12px;"><%= j+1 %></td>
                    <td style="font-size: 12px;">파일이름</td>
                    <td style="font-size: 12px;"><%= list.get(j).getFileNm() %></td>
                    <td style="font-size: 12px;"><%= list.get(j).getUploadNm() %></td>
                </tr>
                <tr>
                    <td style="font-size: 12px;">파일사이즈</td>
                    <%
                        String uploadFileSize = list.get(j).getUploadFileSize();
                        double size = Double.parseDouble(uploadFileSize);
                        DecimalFormat formatter = new DecimalFormat("#,###");

                        uploadFileSize = formatter.format(size);
                    %>
                    <td style="font-size: 12px;"><%= uploadFileSize %> byte</td>
                    <td style="font-size: 12px;"><%= uploadFileSize %> byte</td>
                </tr>
                <tr>
                    <td style="font-size: 12px;">MD5</td>
                    <td style="font-size: 12px;"><%= list.get(j).getMd5Cde() %></td>
                    <td style="font-size: 12px;"><%= list.get(j).getMd5Cde() %></td>
                </tr>
                <tr>
                    <td style="font-size: 12px;">SHA-256</td>
                    <%
                        StringBuilder shaCde = new StringBuilder(list.get(j).getShaCde());

                        shaCde.insert(32, "<br/>");

                    %>
                    <td style="font-size: 12px;"><%= shaCde.toString() %></td>
                    <td style="font-size: 12px;"><%= shaCde.toString() %></td>
                </tr>
<%
}
%>
                <tr>
                    <%
                        String eTime = DateUtil.getStrMin();
                    %>
                    <td colspan="4" style="height: 40px;">종료시간 : <%=eTime.substring(0,4) %> 년
                                     <%=eTime.substring(4,6) %> 월
                                     <%=eTime.substring(6,8) %> 일
                                     <%=eTime.substring(8,10) %> 시
                                     <%=eTime.substring(10,12) %> 분</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</body>
</html>