<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsStatVo"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.LinkedHashMap "%>
<%@ page import="java.util.TreeSet"%>
<%@ page import="java.util.Random"%>
<%@ page import="java.sql.ResultSetMetaData"%>

<%@ page import="org.apache.commons.lang3.StringUtils"%>

<%@ include file="../../common.jsp"%>
<%
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

	/* CD58 // 영상반출 신청구분 */
	HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
	Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
	Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

	HashMap<String, String> param = (HashMap<String, String>) request.getAttribute("param");

	String pageTyp = param.get("pageTyp");
	String pag = param.get("page");
	String year = param.get("year");
	String month = param.get("month");

	String reqGbnCd = "";

	if (param.containsKey("reqGbnCd")) {
		reqGbnCd = param.get("reqGbnCd");
	}

	String size = "";

	if (param.containsKey("size")) {
		size = param.get("size");
	}

	ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>) request.getAttribute("list");

	StringBuilder sb = new StringBuilder();

	String columnName[] = {"구분", "총계", "1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일", "11일",
						"12일", "13일", "14일", "15일", "16일", "17일", "18일", "19일", "20일", "21일", "22일", "23일",
						"24일", "25일",	"26일", "27일", "28일", "29일", "30일", "31일"};

	String baseColor[] = {"92,209,229", "220,220,220", "151,187,205", "240,73,73", "151,220,151", "151,220,187",
						"255,204,151", "250,237,125", "255,167,167"};

	ArrayList<LinkedHashMap<String, String>> rows = new ArrayList<LinkedHashMap<String, String>>();

	for (int i = 0; i < list.size(); i++) {

	    LinkedHashMap<String, String> row = new LinkedHashMap<String, String>();

		row.put(columnName[0], list.get(i).getGbn());
		row.put(columnName[1], String.valueOf(list.get(i).getAll()).trim());
		row.put(columnName[2], String.valueOf(list.get(i).getOne()).trim());
		row.put(columnName[3], String.valueOf(list.get(i).getTwo()).trim());
		row.put(columnName[4], String.valueOf(list.get(i).getThree()).trim());
		row.put(columnName[5], String.valueOf(list.get(i).getFour()).trim());
		row.put(columnName[6], String.valueOf(list.get(i).getFive()).trim());
		row.put(columnName[7], String.valueOf(list.get(i).getSix()).trim());
		row.put(columnName[8], String.valueOf(list.get(i).getSeven()).trim());
		row.put(columnName[9], String.valueOf(list.get(i).getEight()).trim());
		row.put(columnName[10], String.valueOf(list.get(i).getNine()).trim());
		row.put(columnName[11], String.valueOf(list.get(i).getTen()).trim());
		row.put(columnName[12], String.valueOf(list.get(i).getEleven()).trim());
		row.put(columnName[13], String.valueOf(list.get(i).getTwelve()).trim());
		row.put(columnName[14], String.valueOf(list.get(i).getThirteen()).trim());
		row.put(columnName[15], String.valueOf(list.get(i).getFourteen()).trim());
		row.put(columnName[16], String.valueOf(list.get(i).getFifteen()).trim());
		row.put(columnName[17], String.valueOf(list.get(i).getSixteen()).trim());
		row.put(columnName[18], String.valueOf(list.get(i).getSeventeen()).trim());
		row.put(columnName[19], String.valueOf(list.get(i).getEighteen()).trim());
		row.put(columnName[20], String.valueOf(list.get(i).getNineteen()).trim());
		row.put(columnName[21], String.valueOf(list.get(i).getTwenty()).trim());
		row.put(columnName[22], String.valueOf(list.get(i).getTwentyOne()).trim());
		row.put(columnName[23], String.valueOf(list.get(i).getTwentyTwo()).trim());
		row.put(columnName[24], String.valueOf(list.get(i).getTwentyThree()).trim());
		row.put(columnName[25], String.valueOf(list.get(i).getTwentyFour()).trim());
		row.put(columnName[26], String.valueOf(list.get(i).getTwentyFive()).trim());
		row.put(columnName[27], String.valueOf(list.get(i).getTwentySix()).trim());
		row.put(columnName[28], String.valueOf(list.get(i).getTwentySeven()).trim());
		row.put(columnName[29], String.valueOf(list.get(i).getTwentyEight()).trim());
		row.put(columnName[30], String.valueOf(list.get(i).getTwentyNine()).trim());
		row.put(columnName[31], String.valueOf(list.get(i).getThirty()).trim());
		row.put(columnName[32], String.valueOf(list.get(i).getThirtyOne()).trim());

		rows.add(row);
	}
%>

<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css"> -->

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
    var month = '<%=month%>';
    var reqGbnCd = '<%=reqGbnCd%>';
    var size = '<%=size%>';
</script>
<div id="searchBox" class="customScroll"
	style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: visible; box-sizing: border-box; padding: 0 15px">

	<div class="contentWrapper statTable hidden" style="width: 100%;">
		<h3 class="title">CCTV별 반출현황</h3>
		<div class="box_style">
			<div class="info_box wd100">
				<div>
					<span>신청유형</span>
					<select id="reqGbnCd" name="reqGbnCd" class="sendData" name="reqGbnCd" style="width: 100px;">
						<option value="">전체</option>
						<%
						    while (chkReqGbnCdItr.hasNext()) {

						        String str = (String) chkReqGbnCdItr.next();

						        if ("11".equals(str) || "12".equals(str)) {
						%>
						<option value="<%=str%>"><%=chkReqGbnCd.get(str)%></option>
						<%
						    	}
							}
						%>
					</select>
				</div>
				<div class="btn_wrap">
					<button type="button" id="prevBtn" class="left_image"></button>
					<input type="hidden" id="serch_year" /> <input type="hidden" id="serch_month" />
					<div id="date" class="font_custom"></div>
					<button type="button" id="nextBtn" class="right_image"></button>
				</div>
				<button id="xls_down_btn" class="btn_Dstyle" key="list_use">엑셀내려받기</button>
			</div>
		</div>
		<div class="table_custom customScroll">
			<table id="listuse" class="customScroll" border="0" cellspacing="0" cellpadding="0">
				<tr class="fix_header">
					<%
					    for (Map.Entry<String, String> et : rows.get(0).entrySet()) {
									sb.append(et.getKey());
					%>
					<th><%=et.getKey()%></th>
					<%
					    }
					%>
				</tr>

				<%
				    	String chartStr[] = new String[rows.size()];
						String chartTitle[] = new String[rows.size()];

						for (int i = 0; i < rows.size(); i++) {

						    String charTmp[] = new String[33];
							int j = 0;
				%>
				<tr>
					<%
					    for (Map.Entry<String, String> et : rows.get(i).entrySet()) {

							if (j > 1) charTmp[j - 2] = et.getValue();
							if ("구분".equals(et.getKey())) chartTitle[i] = et.getValue();
							j++;
					%>
					<td class="tCenter"><%=("0".equals(et.getValue()) ? "-" : et.getValue())%></td>
					<%
					    }
					%>
				</tr>
					<%
					    if (i < rows.size() + 1) chartStr[i] = StringUtils.join(charTmp, ",");

						}
					%>
			</table>
		</div>
	</div>
<%
    if ("stat".equals(pageTyp)) {
%>
	<div class="contentWrapper statChart customScroll" style=" display:none;">
		<%
		    } else {
		%>
		<div class="contentWrapper statChart customScroll" style="text-align: center; background-color:rgb(33, 34, 40);">
			<%
			    }
			%>
			<div id="chart_title" style="margin: 15px 0 10px 0">
				<ul>
					<%
					    String colorArr[] = new String[chartTitle.length];

								for (int j = 0; j < colorArr.length; j++) {

									if (j < baseColor.length) {
										colorArr[j] = baseColor[j];
									} else {
										Random generator = new Random();
										int colorNum = generator.nextInt(151) + 100;
										int colorNum2 = generator.nextInt(151) + 100;
										int colorNum3 = generator.nextInt(151) + 100;
										String realColor = colorNum + "," + colorNum2 + "," + colorNum3;
										colorArr[j] = realColor;
									}
								}
								for (int i = 0; i < (chartTitle.length - (chartTitle.length - 1)); i++) {
					%>
					<li class="stat_list info_box">
						<div class="stat_list_color" style="background: rgba(<%=colorArr[i]%>,0.5);"></div>
						<span class="stat_list_title" style="margin-right: 10px;"><%=chartTitle[i]%></span>
					</li>
					<%
					    }
					%>
				</ul>
			</div>
			<%
			    if ("stat".equals(pageTyp)) {
			%>
			<canvas id="canvas" width="10" height="3"></canvas>
			<!--  width="10" height="3" -->
			<%
			    } else {
						if (!"".equals(size)) {
							String canvasW = size;
							String canvasH = "";
							if (size.contains(".")) {
								canvasH = Double.toString(Double.parseDouble(size) / 2.6);
							} else {
								canvasH = Double.toString(Integer.parseInt(size) / 2.6);
							}
			%>
			<canvas id="canvas" width="<%=canvasW%>" height="<%=canvasH%>"></canvas>
			<!--  width="10" height="3" -->
			<%
			    		} else {
			%>
			<canvas id="canvas" width="11" height="5"></canvas>
			<!--  width="10" height="3" -->
			<%
			    		}
				}
			%>
		</div>
		<script type="text/javascript">
        var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
        var chartarr = [
                    <%for (int i = 0; i < (chartStr.length - (chartStr.length - 1)); i++) {
				String realColor = "";%>
                        {
                                    fillColor : "rgba(<%=colorArr[i]%>,0.5)",
                                    strokeColor : "rgba(<%=colorArr[i]%>,0.8)",
                                    highlightFill: "rgba(<%=colorArr[i]%>,0.75)",
                                    highlightStroke: "rgba(<%=colorArr[i]%>,1)",
                                    data : [<%=chartStr[i]%>]
                        },
                    <%}%>
                    ]
        var barChartData = {
            labels : ["1일","2일","3일","4일","5일","6일","7일","8일","9일","10일","11일","12일",
            	      "13일","14일","15일","16일","17일","18일","19일","20일","21일","22일","23일","24일",
            	      "25일","26일","27일","28일","29일","30일","31일"],
            datasets :
                chartarr

        };

    </script>

	</div>