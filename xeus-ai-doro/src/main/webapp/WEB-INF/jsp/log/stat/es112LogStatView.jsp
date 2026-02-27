<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.log.service.LogStatVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../../common.jsp" %>
<%
ArrayList<LogStatVo> listes112 = (ArrayList<LogStatVo>) request.getAttribute("es112");

HashMap<String, String> map = (HashMap<String, String>)request.getAttribute("map");
String year = map.get("year");
if(year == null) year = "";
%>
<link rel="stylesheet" type="text/css" href="<%= context %>/res/css/xeus.log.css">
<%-- <script type="text/javascript" src="<%= context %>/res/geomex.xeus.system.mng.log.js"></script> --%>
<script type="text/javascript">

var date = new Date();
var nowY = date.getFullYear();

$(document).ready(function(){
	setYear();
});

function setYear(){
	var str = "";
	var max_yy = 2018;

	for ( var i = 0; (nowY-max_yy) >= i ; i++ ){
		str += '<option value="'+(nowY-i)+'">'+(nowY-i)+'년도</option>';
	};

	$('#year').html(str);

}

var schObj = new Object();

schObj.year = '<%=year%>';

/* 탭 클릭 이벤트 입니다. */
$("#wrap").find("button.logTab").click(function(){
	if($(this).attr("active") != "active"){
		$("#wrap").find("button.logTab").removeAttr("active");
		$(this).attr("active", "active");

		var url = $(this).attr("url");
		if(url != null){
			var _param = {};
			_param['year'] = nowY;//$('#wrap').find('#search').find('#year').val()
			_common.callAjax(url, _param, function(view) {
				$(".contentWrapper").find("#overlay-west-contents").html('');
				$(".contentWrapper").find("#overlay-west-contents").html(view);
			});
		}
	}
});

/* $('#wrap').find('#search').find('#year').change(function(){
	alert($(this).val());
}); */

</script>
<div>
    <div id="wrap" style="padding-top:10px;">
        <div class="tabTitle">
            <button class="logTab" url="/log/get112LogStatView.do">112 긴급영상 지원</button>
            <button class="logTab" url="/log/get119LogStatView.do">119 긴급출동</button>
            <button class="logTab" url="/log/getDscLogStatView.do">사회적약자</button>
            <button class="logTab" url="/eventCtrl/getEliLogStatView.do">긴급재난상황</button>
            <button class="logTab" active="active" url="/log/getEs112LogStatView.do">112 긴급출동</button>
        </div>
        <div id="title" style="padding-top:10px;">112 긴급출동 통계</div>
        <div id="search">
            <span>년도 : </span>
            <select id="year">
                <option value="2018">2018</option>
                <!-- <option value="2017">2017</option>
                <option value="2016">2016</option> -->
            </select>
        </div>
        <div id="content">
           <table id="userList">
                <thead>
                    <tr>
                        <th>구분</th>
                        <th>총계</th>
                        <th>1월</th>
                        <th>2월</th>
                        <th>3월</th>
                        <th>4월</th>
                        <th>5월</th>
                        <th>6월</th>
                        <th>7월</th>
                        <th>8월</th>
                        <th>9월</th>
                        <th>10월</th>
                        <th>11월</th>
                        <th>12월</th>
                    </tr>
                </thead>
                <tbody>
<%
if(listes112.size() == 0){
%>
                    <tr>
                        <td colspan="14"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<listes112.size(); i++){
%>
                    <tr>
                        <td><%= listes112.get(i).getGbn() %></td>
                        <td><%= listes112.get(i).getAll() %></td>
                        <td><%= listes112.get(i).getJan() %></td>
                        <td><%= listes112.get(i).getFeb() %></td>
                        <td><%= listes112.get(i).getMar() %></td>
                        <td><%= listes112.get(i).getApr() %></td>
                        <td><%= listes112.get(i).getMay() %></td>
                        <td><%= listes112.get(i).getJun() %></td>
                        <td><%= listes112.get(i).getJul() %></td>
                        <td><%= listes112.get(i).getAug() %></td>
                        <td><%= listes112.get(i).getSep() %></td>
                        <td><%= listes112.get(i).getOct() %></td>
                        <td><%= listes112.get(i).getNov() %></td>
                        <td><%= listes112.get(i).getDec() %></td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>
        </div>


        <%-- <div class="title">119 통계</div>
        <!-- <div id="search">
            <span>년도 : </span>
            <select id="year119">
                <option value="2018">2018</option>
            </select>
        </div> -->
        <div class="content">
           <table class="list" id="list119">
                <thead>
                    <tr>
                        <th>구분</th>
                        <th>총계</th>
                        <th>1월</th>
                        <th>2월</th>
                        <th>3월</th>
                        <th>4월</th>
                        <th>5월</th>
                        <th>6월</th>
                        <th>7월</th>
                        <th>8월</th>
                        <th>9월</th>
                        <th>10월</th>
                        <th>11월</th>
                        <th>12월</th>
                    </tr>
                </thead>
                <tbody>
<%
if(list119.size() == 0){
%>
                    <tr>
                        <td colspan="14"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<list119.size(); i++){
%>
                    <tr>
                        <td><%= list119.get(i).getGbn() %></td>
                        <td><%= list119.get(i).getAll() %></td>
                        <td><%= list119.get(i).getJan() %></td>
                        <td><%= list119.get(i).getFeb() %></td>
                        <td><%= list119.get(i).getMar() %></td>
                        <td><%= list119.get(i).getApr() %></td>
                        <td><%= list119.get(i).getMay() %></td>
                        <td><%= list119.get(i).getJun() %></td>
                        <td><%= list119.get(i).getJul() %></td>
                        <td><%= list119.get(i).getAug() %></td>
                        <td><%= list119.get(i).getSep() %></td>
                        <td><%= list119.get(i).getOct() %></td>
                        <td><%= list119.get(i).getNov() %></td>
                        <td><%= list119.get(i).getDec() %></td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>
        </div>


        <div class="title">사회적약자 통계</div>
        <!-- <div id="search">
            <span>년도 : </span>
            <select id="year112">
                <option value="2018">2018</option>
            </select>
        </div> -->
        <div class="content">
           <table class="list" id="listDsc">
                <thead>
                    <tr>
                        <th>구분</th>
                        <th>총계</th>
                        <th>1월</th>
                        <th>2월</th>
                        <th>3월</th>
                        <th>4월</th>
                        <th>5월</th>
                        <th>6월</th>
                        <th>7월</th>
                        <th>8월</th>
                        <th>9월</th>
                        <th>10월</th>
                        <th>11월</th>
                        <th>12월</th>
                    </tr>
                </thead>
                <tbody>
<%
if(listDsc.size() == 0){
%>
                    <tr>
                        <td colspan="14"><b>검색결과가 존재하지 않습니다.</b></td>
                    </tr>
<%
}else{
    for(int i=0; i<listDsc.size(); i++){
%>
                    <tr>
                        <td><%= listDsc.get(i).getGbn() %></td>
                        <td><%= listDsc.get(i).getAll() %></td>
                        <td><%= listDsc.get(i).getJan() %></td>
                        <td><%= listDsc.get(i).getFeb() %></td>
                        <td><%= listDsc.get(i).getMar() %></td>
                        <td><%= listDsc.get(i).getApr() %></td>
                        <td><%= listDsc.get(i).getMay() %></td>
                        <td><%= listDsc.get(i).getJun() %></td>
                        <td><%= listDsc.get(i).getJul() %></td>
                        <td><%= listDsc.get(i).getAug() %></td>
                        <td><%= listDsc.get(i).getSep() %></td>
                        <td><%= listDsc.get(i).getOct() %></td>
                        <td><%= listDsc.get(i).getNov() %></td>
                        <td><%= listDsc.get(i).getDec() %></td>
                    </tr>
<%
    }
}
%>
                </tbody>
            </table>
        </div> --%>
    </div>
</div>
