<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.equipmgr.service.CctvVo"%> --%>
<%@ include file="../common.jsp"%>
<%

%>
<%-- <script type="text/javascript" src="<%= context %>/res/geomex.xeus.cctv.search.js"></script> --%>
<style>

.searchWrapper #search table th{
    height: 40px;
}

.searchWrapper #search input, .searchWrapper #search select{
    padding-left: 10px;
    /* height: 100%; */
    border: none;
}
</style>
<script type="text/javascript">

var obj = new Object();

$(document).ready(function(){
	resizeDone();

	$(".searchWrapper").find(".datePicker").datepicker("destroy").datepicker({
		changeMonth: true,
	    changeYear: true,
	    dateFormat: "yy-mm-dd",
	    showButtonPanel: true,
	    beforeShowDay: $.datepicker.noBefore
	});
	$(".searchWrapper").find(".datePicker").inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});
});

$(window).resize(function(){
	resizeDone();
});

function resizeDone(){
	$('#result').width($(document).width() - $('#overlay-west-side-bar').width() - $('#search').width() - $('#chart').width() - 50);
}

$('#btn_sch').click(function(){

	var _param = _common.utils.collectSendData("#search");

	_param['limit'] = 10;
	if(_param['startDat'] != '') _param['startDat'] = _param['startDat'].replaceAll('-', '') + "000000";
	if(_param['endDat'] != '') _param['endDat'] = _param['endDat'].replaceAll('-', '') + "235959";

	callView(0, _param);

	/* _common.callAjax("/eventHist/getList.json", _param, function(json){
	}); */
});

function callView(offset,_param){
	if(offset == null) offset = 0;
	if(_param === undefined){
		_param = obj;
		_param['limit'] = 10;
	} else {
		obj = _param;
	}
	_param['offset'] = offset;

	_common.callAjax("/eventHist/getStatList.json", _param, function(json){
		var _str = '';
		if(json.count == 0){
			_str += '<tr>';
    	    _str += '    <td colspan="5" class="tCenter">검색결과가 존재하지않습니다.</td>';
    	    _str += '</tr>';

    	    $('#result').find('#searchResult').html('');
    	    $('#result').find('#searchResult').html(_str);

    	    //
    	    if(GridStackUI.Utils.Charts.length > 0) GridStackUI.Utils.removeAllChart();
    	    $('.panel').html('');
    	    $('.panel').html('표출할 데이터가 없습니다.');
		} else {
			for(var i=0; i<json.result.length; i++){
				_str += '<tr>';
	    	    _str += '    <td class="tCenter">'+json.result[i].statEvetNm+'</td>';
	    	    _str += '    <td class="tBlankLeft">'+json.result[i].outbPosNm+'</td>';
	    	    _str += '    <td class="tCenter">'+json.result[i].outbPosY + '<br>' + json.result[i].outbPosX +'</td>';
	    	    _str += '    <td class="tCenter">'+Date.prototype.formatYMDHMS(json.result[i].statEvetOutbDtm)+'</td>';
	    	    var procSt = json.result[i].procSt;
    	    	if(procSt == "10") procSt = "발생";
                else if(procSt == "40") procSt = "정보변경";
                else if(procSt == "50") procSt = "해제";
                else if(procSt == "91") procSt = "종료";
	    	    _str += '    <td class="tCenter">'+procSt+'</td>';
	    	    _str += '</tr>';

	    	    $('#result').find('#searchResult').html('');
	    	    $('#result').find('#searchResult').html(_str);
			}

			//
    	    if(GridStackUI.Utils.Charts.length > 0) GridStackUI.Utils.removeAllChart();
    	    $('.panel').html('');

    	    var lineKeys = [];
    	    for(key in json.lineChart)
    	    	lineKeys.push(key);
    	    lineKeys.sort();
    	    var lineData = [];
			for(var j=0; j<lineKeys.length; j++)
				lineData.push(json.lineChart[lineKeys[j]]);
	    	GridStackUI.Utils.createLineChart('line', '시간대별 플랫폼 접속 현황', lineData);//[1,3,4,5,6,78,8,4,2,1,32,34,5,65,47,75,6,2,1,2,3,4,5,6]

	    	/* {
				name : '20세 이하',
				colorByPoint: true,
				data:[ Number(354) ]
			} */
	    	var colData = new Array();//전체 데이터를 담을 배열
	    	var colCategories = new Array();//데이터 분류를 담을 배열
	    	var colSeries = new Array();//분류별 수치를 담을 배열

			var dataObj = {};
			dataObj.name = '유형';
			var subArr = [];
			for(var k=0; k<json.columnChart.length; k++){
				colCategories.push(json.columnChart[k]['stat_evet_nm']);
				var susubArr = [];
				susubArr.push(json.columnChart[k]['stat_evet_nm']);
				susubArr.push(json.columnChart[k]['cnt']);
	    		subArr.push(susubArr);
	    	}
			dataObj.data = subArr;
			colSeries.push(dataObj);

	    	colData.push(colCategories);
	    	colData.push(colSeries);

	    	GridStackUI.Utils.createBarChart('column', '유형별 발생 현황', colData);
	    	//GridStackUI.Utils.createBarChart('column');
		}

		obj.max = json.count;
		obj.offset = offset;

		if(obj.max > 0){
			$(".paging_wrap").paging({
				current	  : 10,
				max  	  : obj.max,
				nowOffset : obj.offset,
				bindEvent : callView
			});
		}
	}, false);
}

</script>
<div class="searchWrapper">
    <p class="searchTitle">이벤트 통계</p>
    <div>
        <div id="search" style="width: 500px; border: 1px solid black; height: 93%; float: left;">

            <table>
                <tbody>
                    <colgroup>
                        <col width="100px">
                        <col width="0">
                    </colgroup>
                    <tr>
                        <th>종류</th>
                        <td>
                            <select id="statEvetNm" class="wide sendData">
                                    <option value="">전체</option>
                                <optgroup label="112">
        							<option value="강력범죄">강력범죄</option>
        							<option value="교통사고">교통사고</option>
        						</optgroup>
                                <optgroup label="119">
        							<option value="화재">화재</option>
        							<option value="구조">구조</option>
        							<option value="구급">구급</option>
        							<option value="기타">기타</option>
        						</optgroup>
                                <optgroup label="사회적약자">
							         <option value="사회적약자">사회적약자</option>
                                </optgroup>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>처리상태</th>
                        <td>
                            <select id="procSt" class="wide sendData">
                                <option value="">전체</option>
                                <option value="10">발생</option>
                                <option value="40">정보변경</option>
                                <option value="50">해제</option>
                                <option value="91">종료</option>
                            </select>
                        </td>
                    </tr>
                    <!-- <tr>
                        <th>명칭</th>
                        <td>
                            <input id="statEvetNm" class="keyup wide sendData" type="text" value="" placeholder="이벤트명">
                        </td>
                    </tr> -->
                    <tr>
                        <th>주소</th>
                        <td>
                            <input id="outbPosNm" class="keyup sendData" type="text" value="" placeholder="이벤트 발생위치 주소">
                        </td>
                    </tr>
                    <tr>
                        <th>기간</th>
                        <td>
                            <input id="startDat" class="keyup sendData datePicker" type="text" value="" readonly="readonly" style="width: 47%;"> ~
                            <input id="endDat" class="keyup sendData datePicker" type="text" value="" readonly="readonly" style="width: 47%;">
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="btnDiv">
                <button id="btn_sch" class="blackBtn">검색</button>
            </div>
        </div>
        <div id="result" style="border: 1px solid black; height: 93%; float: left;"><!-- width: 100%;  -->
            <input type="hidden" id="offset" value="0" />
            <input type="hidden" id="max" value="0" />
            <table>
                <thead>
                    <tr>
                        <th>이벤트 종류</th><!-- stat_evet_nm -->
                        <th>주소</th><!-- outb_pos_nm -->
                        <th>발생위치</th><!-- outb_pos_x // outb_pos_y -->
                        <th>발생일시</th><!-- stat_evet_outb_dtm -->
                        <th>처리상태</th><!-- proc_st -->
                    </tr>
                </thead>
                <tbody id="searchResult">
                    <!-- <tr>
                        <td colspan="5" class="tCenter">검색결과가 존재하지않습니다.</td>
                    </tr> -->
                </tbody>
            </table>
            <div class="paging_wrap"></div>
        </div>
        <div id="chart" style="width: 500px; border: 1px solid black; height: 93%; float: left;">
            <div style="display: table;">
                <div id="lineGraph" style="width: 500px; height: 300px; border: 1px solid black; display: table-cell; text-align: center; vertical-align: middle;">
                    <div class="panel" id="line">표출할 데이터가 없습니다.</div>
                </div>
            </div>
            <div style="display: table;">
                <div id="columnGraph" style="width: 500px; height: 300px; border: 1px solid black; display: table-cell; text-align: center; vertical-align: middle;">
                    <div class="panel" id="column">표출할 데이터가 없습니다.</div>
                </div>
            </div>
            <!-- <div style="display: table;">
                <div id="pieGraph" style="width: 500px; height: 300px; border: 1px solid black; display: table-cell; text-align: center; vertical-align: middle;">
                    <div class="panel" id="pie">표출할 데이터가 없습니다.</div>
                </div>
            </div> -->
        </div>
    </div>
</div>