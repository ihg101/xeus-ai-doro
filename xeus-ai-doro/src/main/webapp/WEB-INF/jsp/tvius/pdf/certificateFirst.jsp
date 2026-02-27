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

        if(json.get("cctvMgrNo") != null)   workVo.setCctvMgrNo(json.get("cctvMgrNo").toString());
        if(json.get("cctvNm") != null)      workVo.setCctvNm(json.get("cctvNm").toString());
        if(json.get("modelNm") != null)     workVo.setModelNm(json.get("modelNm").toString());

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
         size: A4;
         /* @bottom-center {
            content: counter(page) + 1 ;/* 창녕의 경우 2페이지부터 시작해야되서 */
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
	.wrap_content table { width:90%; height:100%; margin-left: 30px; border:1px solid #000;}

	.wrap_content table .next-print{page-break-before: always;}
	.wrap_content table th { border:1px solid #000; background:#fff; border-right:0;  border-bottom:1px solid #000; height:40px; font-size:11px; text-align: center;}
	.wrap_content table td { border:1px solid #000; background:#fff; height:50px; text-align: center; border-right:0; font-size:10px; border-top:0; font-size: 15px;}
</style>
</head>
<body>
    <div style=" margin-bottom:50px;">
        <span style="font-size: 13px; padding-top:100px; margin-left : 30px;">별지</span>
    </div>
    <div class="wrap_content second_page" align="center">
        <table cellpadding="0" cellspacing="0">
            <colgroup>
                <col width="18%"/>
                <col width="20%"/>
                <col width="62%"/>
            </colgroup>

            <tbody id="print_list_body">
                <tr>
                    <td rowspan="5" style="height:700px !important;"><span style="font-weight: bold;">세부정보</span></td>
                    <td style="height: 25px;">저장매체명</td>
                    <td>CCTV</td>
                </tr>
                <tr>
                    <td style="height:310px !important;">모    델    명</td>
                    <td style="text-align: left;">
<%
String cctvAndModel = "";
for(int i=0; i<list.size(); i++){
    cctvAndModel += list.get(i).getCctvNm()+"("+list.get(i).getModelNm()+")<br/>";
}
%>
                        <%= cctvAndModel %>
                    </td>
                </tr>
                <tr>
                    <td style="height:310px !important;">일   련   번   호</td>
                    <td style="text-align: left;">
<%
String cctvAndId = "";
for(int i=0; i<list.size(); i++){
    cctvAndId += list.get(i).getCctvNm()+"("+list.get(i).getCctvMgrNo()+")<br/>";
}
%>
                        <%= cctvAndId %>
                    </td>
                </tr>
                <tr>
                    <td style="height:50px !important;">비      고</td>
                    <td></td>
                </tr>
                <tr>
                    <td colspan="2" style="height:50px !important; text-align: left; font-size:17px;">   위 저장매체에서 범위를 정하여 복제한 파일은 별지 상세목록과 같고, <br/>   별지 전자정보 상세목록에서 제외된 전자정보는 삭제·폐기함</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>