<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsStatVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.LinkedHashMap " %>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.util.Random"%>
<%@ page import="java.sql.ResultSetMetaData" %>

<%@ page import="org.apache.commons.lang3.StringUtils" %>

<%@ include file="../../common.jsp"%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    /* while (chkReqGbnCdItr.hasNext()) {
        String str = (String) chkReqGbnCdItr.next();
    } */

    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String pageTyp = param.get("pageTyp");
    String pag = param.get("page");
    String year = param.get("year");

    String reqGbnCd = "";
	if ( param.containsKey("reqGbnCd") ) reqGbnCd = param.get("reqGbnCd");
    String size = "";
    if ( param.containsKey("size") ) size = param.get("size");

    ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>)request.getAttribute("list");


    StringBuilder sb = new StringBuilder();

    String columnName[] = {"구분",  "총계", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"};
    String baseColor[] = {"", "220,220,220","151,187,205","220,151,220","151,220,151","151,220,187","255,204,151","250,237,125","255,167,167"};

    ArrayList<LinkedHashMap <String, String>> rows = new ArrayList<LinkedHashMap <String, String>>();
    ArrayList<LinkedHashMap <String, Float>> ratRows = new ArrayList<LinkedHashMap <String, Float>>();


    for ( int i = 0; i < list.size(); i++ ) {

        LinkedHashMap <String, String> row = new LinkedHashMap <String, String>();

        row.put( columnName[0],  list.get(i).getGbn() );
        row.put( columnName[1],  String.valueOf(list.get(i).getAll()).trim() );
        row.put( columnName[2],  String.valueOf(list.get(i).getJan()).trim() );
        row.put( columnName[3],  String.valueOf(list.get(i).getFeb()).trim() );
        row.put( columnName[4],  String.valueOf(list.get(i).getMar()).trim() );
        row.put( columnName[5],  String.valueOf(list.get(i).getApr()).trim() );
        row.put( columnName[6],  String.valueOf(list.get(i).getMay()).trim() );
        row.put( columnName[7],  String.valueOf(list.get(i).getJun()).trim() );
        row.put( columnName[8],  String.valueOf(list.get(i).getJul()).trim() );
        row.put( columnName[9],  String.valueOf(list.get(i).getAug()).trim() );
        row.put( columnName[10], String.valueOf(list.get(i).getSep()).trim() );
        row.put( columnName[11], String.valueOf(list.get(i).getOct()).trim() );
        row.put( columnName[12], String.valueOf(list.get(i).getNov()).trim() );
        row.put( columnName[13], String.valueOf(list.get(i).getDec()).trim() );

        rows.add(row);
    }

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css">

<script type="text/javascript" src="./res/menu/tviusMngView/geomex.xeus.tvius.mng.stat.js"></script>
<script type="text/javascript" src="./common/Chart.js"></script>
<script type="text/javascript" src="./common/Chart.StackedBar.js"></script>
<script type="text/javascript" src="./common/jshashtable.js"></script>
<script type="text/javascript" src="./common/jquery.numberformatter.js"></script>
<script type="text/javascript">
    var userId = '<%=userId%>';
    var pageTyp = '<%=pageTyp%>';
    var pag = '<%=pag%>';
    var year = '<%=year%>';
    var reqGbnCd = '<%=reqGbnCd%>';
    var size = '<%=size%>';
</script>
<div id="searchBox" class="customScroll" style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: visible; box-sizing: border-box; padding: 15px;">

    <div id="tab_bar" class="box_style">
        <div class="info_box wd100" style="justify-content: space-evenly">
        	<div class="tab_on tab_bg" id="m01">CCTV 활용 현황</div>
	        <div class="tab_on tab_bg" id="m02">사건해결 기여율</div>
	        <div class="tab_on tab_bg" id="m03">범죄유형별 신청현황</div>
	        <div class="tab_on tab_bg" id="m04">미사용사유별 현황</div>
        </div>
    </div>
    <div class="contentWrapper statTable customScroll" style="height: 333px;">
        <h3 class="title">미사용사유별 현황</h3>
        <div class="box_style">
            <div class="info_box wd100">
            	<div>
            		<span>신청유형</span>
		            <select id="reqGbnCd" name="reqGbnCd" class="sendData" name="reqGbnCd" style="width: 100px;">
		                <option value="">전체</option>
		                <%
		                    while (chkReqGbnCdItr.hasNext()) {
		                        String str = (String) chkReqGbnCdItr.next();
		                        if("11".equals(str) || "12".equals(str)){
		                %>
		                <option value="<%=str%>"><%=chkReqGbnCd.get(str)%></option>
		                <%
		                        }
		                    }
		                %>
		            </select>
            	</div>
	            <div>
	            	<span>검색년도</span>
		            <select id="serch_year" style="width:100px;">
		            </select>
		            <!-- <label>검색기간:</label>
		            <input type="text" id="reqst_dat_s" class="date_col " size="12" style="vertical-align: middle;">button class="ico_cal"></button
		            ~
		            <input type="text" id="reqst_dat_e" class="date_col " size="12" style="vertical-align: middle;">button class="ico_cal"></button
		            &nbsp; -->
		            <span style="color:#666"> * 선택한 신청유형과 검색년도 별로 조회할 수 있습니다.</span>
		            <button id="btn_sch" class="btn_style2">조 회</button>
	            </div>
	            <button id="xls_down_btn" class="btn_Dstyle" key="list_use"><!-- <img id="btn_xls" src="../../intra/img/3_over.png" class="" style="border: 0; vertical-align: middle;"></img> -->엑셀내려받기</button>
            </div>
        </div>
        <table id="listnouse" border="0" cellspacing="0">
<!--             <colgroup> -->
<!--                 <col width="9%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--                 <col width="7%" /> -->
<!--             </colgroup> -->
            <tr>
<%
for ( Map.Entry<String, String> et: rows.get(0).entrySet() ) {
    sb.append(et.getKey());
%>
                <th><%=et.getKey()%></th>
<%
}
%>
            </tr>
<%
String chartStr[] = new String[rows.size()+1];
String chartTitle[] = new String[rows.size()+1];

for ( int i = 0; i < rows.size(); i++ ) {

    String charTmp[] = new String[12];
    int j = 0;
%>
            <tr>
<%
    for ( Map.Entry<String, String> et: rows.get(i).entrySet() ) {

        if ( j > 1 ) charTmp[j-2] = et.getValue();
        if( "구분".equals(et.getKey())) chartTitle[i] = et.getValue();
        j++;
%>
                <td class="tCenter"><%=("0".equals(et.getValue()) ? "-" : et.getValue())%></td>
<%
    }
%>
            </tr>
<%
    if ( i <  rows.size()+1 ) chartStr[i] = StringUtils.join(charTmp, ",");

}
%>
        </table>
    </div>
    <% if("stat".equals(pageTyp)) {%>
    <div class="contentWrapper statChart customScroll"><!-- height:50%; -->
    <% } else {%>
    <div class="contentWrapper statChart customScroll" style="height: 380px; text-align: center;" >
    <% }%>
        <div id="chart_title" style="margin: 15px 0 10px 0">
            <ul>
                <%
                    String colorArr[] = new String[chartTitle.length];

                    for ( int j =1 ; j < colorArr.length; j++) {


                        if ( j < baseColor.length ) {

                            colorArr[j] = baseColor[j];
                        } else {

                            Random generator = new Random();
                            int colorNum = generator.nextInt(151)+100;
                            int colorNum2 = generator.nextInt(151)+100;
                            int colorNum3 = generator.nextInt(151)+100;
                            String realColor = colorNum+ ","+colorNum2+","+colorNum3;
                            colorArr[j] = realColor;
                        }
                    }

                    for ( int i = 1; i < (chartTitle.length-1) ; i++ ) {

                %>
                <li class="stat_list info_box" >
                    <div class="stat_list_color" style="background: rgba(<%=colorArr[i]%>,0.5);"></div>
                    <span class="stat_list_title" style="margin-right: 10px;"><%=chartTitle[i] %></span>
                </li>
                <%
                    }
                %>
            </ul>
        </div>
        <% if("stat".equals(pageTyp)) {%>
        <canvas id="canvas" width="10" height="3"></canvas><!--  width="10" height="3" -->
        <% } else {
                if(!"".equals(size)){
                    String canvasW = size;
                    String canvasH = "";
                    if(size.contains(".")){
                        canvasH = Double.toString(Double.parseDouble(size)/2.6);
                    } else {
                        canvasH = Double.toString(Integer.parseInt(size)/2.6);
                    }
        %>
        <canvas id="canvas" width="<%= canvasW %>" height="<%= canvasH %>"></canvas><!--  width="10" height="3" -->
        <%      } else {%>
        <canvas id="canvas" width="11" height="5"></canvas><!--  width="10" height="3" -->
        <%
                }
            }
        %>
    </div>
    <script type="text/javascript">
        var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
        var chartarr = [
                    <%
                        for ( int i = 1; i < (chartStr.length-1); i++ ) {

                            String realColor ="";
                    %>

                        {
                            fillColor : "rgba(<%=colorArr[i]%>,0.5)",
                            strokeColor : "rgba(<%=colorArr[i]%>,0.8)",
                            highlightFill: "rgba(<%=colorArr[i]%>,0.75)",
                            highlightStroke: "rgba(<%=colorArr[i]%>,1)",
                            data : [<%=chartStr[i]%>]
                        },
                    <%
                        }
                    %>

                    ]

        var barChartData = {
            labels : ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
            datasets :
                chartarr

        };

    </script>

</div>