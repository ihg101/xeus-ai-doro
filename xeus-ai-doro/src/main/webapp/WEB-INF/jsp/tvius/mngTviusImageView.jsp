<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.tvius.service.CrmsImageRqstVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%
    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD55 // 영상활용결과 */
    /* HashMap<String, String> chkUseRsCd = cde.convertCodeGrpToAllCde("C55");
    Set<String> chkUseRsCdKey = new TreeSet<String>(chkUseRsCd.keySet());
    Iterator<String> chkUseRsCdItr = chkUseRsCdKey.iterator(); */

    /* C52 // 영상반출처리상태 */
    HashMap<String, String> procStatCdMap = cde.convertCodeGrpToAllCde("C52");
    Set<String> procStatCdKey = new TreeSet<String>(procStatCdMap.keySet());
    Iterator<String> procStatCdItr = procStatCdKey.iterator();


    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String procStatCd = "";
    String startDat = "";
    String endDat = "";
    String reqstId = "";
    String reqstUsrNm = "";
    String gbn = "";
    String sortCol = "";
    String sortTyp = "";
    String sortCntrl = "";

    String limit = "";

    if (param.containsKey("reqstId")) reqstId = param.get("reqstId");
    if (param.containsKey("reqstUsrNm")) reqstUsrNm = param.get("reqstUsrNm");
    if (param.containsKey("procStatCd")) procStatCd = param.get("procStatCd");
    if (param.get("startDat") != null)  startDat = param.get("startDat").trim();
    if (param.get("endDat") != null)    endDat = param.get("endDat").trim();
    if (param.get("gbn") != null)			gbn = param.get("gbn");
    if (param.get("sortCol") != null)		sortCol = param.get("sortCol");
    if (param.get("sortTyp") != null)		sortTyp = param.get("sortTyp");
    if (param.get("sortCntrl") != null)		sortCntrl = param.get("sortCntrl");

    if (param.get("limit") != null)		limit = param.get("limit");

    String offset = param.get("offset");
    int max = (Integer)request.getAttribute("count");

    /* String chkParam = "";
    if ( param.size() > 0){
        if (param.containsKey("useRsCdNullChk")){
            chkParam = "useRst";
            useRsCdNullChk = "Y";
        }
        if (param.containsKey("procStatCd")){
            if (param.get("procStatCd").equals("SW")){
                chkParam = "stat";
            }
        }
    } */

    ArrayList<CrmsImageRqstVo> list = (ArrayList<CrmsImageRqstVo>)request.getAttribute("list");

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css">
<script type="text/javascript">

var userId = '<%=userId%>';
var reqstId = '<%=reqstId%>';
var reqstUsrNm = '<%=reqstUsrNm%>';
var procStatCd = '<%=procStatCd%>';
var startDat = '<%=startDat%>';
var endDat = '<%=endDat%>';
var gbn="<%= gbn %>";
var offset="<%= offset %>";
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";

var limit = "<%= limit %>";

var timer = null;
var delta = 300;

$(document).ready(function(){
    /* if (chkParam != "") $(".contentWrapper").find('#btn_list_all').show();
    else $(".contentWrapper").find('#btn_list_all').hide(); */
    $(".contentWrapper").find(".paging_wrap").paging({
        current   : Number(limit),
        max       : Number($("#max").val()),
        nowOffset : Number($("#offset").val()),
        bindEvent : callView
    });

    setImgResultBar();
    setParam();
    //setTooltip(".tooltip", '.searchWrapper');
    resizeDone();


});

$( window ).on( 'resize', function( ) {
//     clearTimeout( timer );
//     timer = setTimeout( resizeDone, delta );
} );

function resizeDone() {
    //$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height());
    $(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height() - 40);
}

function callView(offset,_param){
    //clearTimeout(intervalListChk);
    if(offset == null) offset = 0;
    if(_param === undefined){
        _param = {};
        _param['limit'] = limit;

        if ( reqstId != '')	_param['reqstId'] = reqstId;
        if ( reqstUsrNm != '')	_param['reqstUsrNm'] = reqstUsrNm;
        if ( procStatCd != '')	_param['procStatCd'] = procStatCd;
    	if ( startDat != '')	_param['startDat'] = startDat;
    	if ( endDat != '')		_param['endDat'] = endDat;
    }
    if(_param['limit'] == undefined) _param['limit']=limit;
    _param['offset'] = offset;
    if(sortCol != undefined && sortTyp != undefined){
		if(_param['sortCol'] != "" && _param['sortTyp'] != ""){
			_param['sortCol'] = sortCol;
			_param['sortTyp'] = sortTyp;
		}
	}

    _common.callAjax("/tvius/getMngTviusImageView.do", _param, function(view){
    	$("#contentWrap").dialog("close").html(view).dialog("open");

    	$(".contentWrapper").find(".mngSortBtn").each(function(){
			if($(this).attr('id') == sortCol && _param['sortCol'] != "" && _param['sortCol'] != ""){
				if(sortTyp === "asc") $(this).text($(this).text() + "▲");
				if(sortTyp === "desc") $(this).text($(this).text() + "▼");
			}
		});
    });
}

$(".contentWrapper").find("#btn_list_all").click(function(){
    var _param = {};
    _param['limit'] = 'limit';
    //_param['offset'] = '0';

    callView(0, _param);
});

$(".contentWrapper").find("#btn_sch").click(function(){
    var procStatCd = $(".contentWrapper").find('#procStatCd').val().trim();
    var startDat = $(".contentWrapper").find('#startDat').val().trim().replace(/\-/g,'');
    var endDat = $(".contentWrapper").find('#endDat').val().trim().replace(/\-/g,'');
    var userKwTyp = $(".contentWrapper").find('#userKwTyp').val().trim();
    var userKw = $(".contentWrapper").find('#userKw').val().trim();
    var limit =$(".contentWrapper").find('#limit').val().trim();

    var _param = {};

    _param['limit'] = limit;
    _param['offset'] = '0';

	if ( userKw != ''){
		if( userKwTyp == "id") _param['reqstId'] = userKw;
		if( userKwTyp == "nm") _param['reqstUsrNm'] = userKw;
	}
    if ( procStatCd != '') _param['procStatCd'] = procStatCd;
    if ( startDat != '') _param['startDat'] = startDat + '000000';
    if ( endDat != '') _param['endDat'] = endDat + '235959';

    _common.callAjax("/tvius/getMngTviusImageView.do", _param, function(view){
    	$("#contentWrap").dialog("close").html(view).dialog("open");
    });
});

$(".contentWrapper").find("#xls_down_btn").click(function(){
	if(confirm("검색결과를 엑셀로 다운로드 하시겠습니까?")){
		var max = $('#max').val();
		if (max == "0"){
			alert("* 검색결과가 존재하지 않습니다.");
		} else {
			var _xlsParam = {};
			_xlsParam['limit'] = max;
			_xlsParam['offset'] = '0';
			_xlsParam['typ'] = 'image';

			if ( reqstId != '')		_xlsParam['reqstId'] = reqstId;
	        if ( reqstUsrNm != '')	_xlsParam['reqstUsrNm'] = reqstUsrNm;
	        if ( procStatCd != '')	_xlsParam['procStatCd'] = procStatCd;
	    	if ( startDat != '')	_xlsParam['startDat'] = startDat;
	    	if ( endDat != '')		_xlsParam['endDat'] = endDat;

			_common.postForm.submit("/tvius/getExcel.do", _xlsParam);
		}
	}
});

$(".contentWrapper").find(".btn_dtv").click(function(){
	var mgrSeq = $(this).attr("mgrseq");
	var stat = $(this).attr("stat");
	var offset = $('#offset').val();
	var limit = limit;//!! 일단은 10, 나중에 리스트 한번에 몇개씩 보여줄지 정할때는 그 값을 넣어줘야 함.

	var _param = {};
	_param['mgrSeq'] = mgrSeq;
	_param['stat'] = stat;
	_param['listOffset'] = offset;
	_param['listLimit'] = limit;

	_common.callAjax("/tvius/getMngTviusImageDetailView.do", _param, function(view){

		$("#popupWrap").dialog("close").html(view).dialog({
			title : "이미지 반출 신청 상세보기",
			modal: true,
		    width: 1000,
			height: 550,
			position: {
				my: "top center",
				at: "top center",
				of: $("#contentWrap")
			},
			open: function(){

			},
			close: function(){

			}
		}).dialog("open");
    });
});

function setImgResultBar(){
    $(".contentWrapper").find('.result_text').each(function(){
        var result_type = $(this).text();

        if ( result_type == '승인대기' ) $(this).parents('ul').find('li:eq(0) .result_type').css('background', '#ADD8E6');

        if ( result_type == '승인완료' ) {
			$(this).parents('ul').find('li:eq(0) .result_type').css('background', '#b4d2e6');
			$(this).parents('ul').find('li:eq(1) .result_type').css('background', '#84b5d7');
        }

        if ( result_type == '처리중' ) {
			$(this).parents('ul').find('li:eq(0) .result_type').css('background', '#b4d2e6');
			$(this).parents('ul').find('li:eq(1) .result_type').css('background', '#84b5d7');
			$(this).parents('ul').find('li:eq(2) .result_type').css('background', '#579ac9');
        }

        if ( result_type == '처리완료' ) {
			$(this).parents('ul').find('li:eq(0) .result_type').css('background', '#b4d2e6');
			$(this).parents('ul').find('li:eq(1) .result_type').css('background', '#84b5d7');
			$(this).parents('ul').find('li:eq(2) .result_type').css('background', '#579ac9');
			$(this).parents('ul').find('li:eq(3) .result_type').css('background', '#4582ac');
        }

        if ( result_type == "승인거절" ) {
            $(this).parents('ul').find('li:eq(0) .result_type').css('background', '');
            $(this).parents('ul').find('li:eq(1) .result_type').css('background', '');
            $(this).parents('ul').find('li:eq(2) .result_type').css('background', '');
            $(this).parents('ul').find('li:eq(3) .result_type').css('background', '');
        }

        if ( result_type == "처리실패" ) {
            $(this).parents('ul').find('li:eq(0) .result_type').css('background', '');
            $(this).parents('ul').find('li:eq(1) .result_type').css('background', '');
            $(this).parents('ul').find('li:eq(2) .result_type').css('background', '');
            $(this).parents('ul').find('li:eq(3) .result_type').css('background', '');
        }
    });
}

/**
 * 검색 요청시 파라미터를 요청 후 페이지에 넣는다.
 */
function setParam(){

	if ( reqstId != ''){
		$(".contentWrapper").find("#userKwTyp").val("id").prop("selected", true);
		$(".contentWrapper").find('#userKw').val(reqstId);
	}
	if ( reqstUsrNm != ''){
		$(".contentWrapper").find("#userKwTyp").val("nm").prop("selected", true);
		$(".contentWrapper").find('#userKw').val(reqstUsrNm);
	}
// 	if ( reqGbnCd != '') $(".contentWrapper").find("#reqGbnCd").val(reqGbnCd).prop("selected", true);
// 	if ( crimeTyp != '') $(".contentWrapper").find('#crimeTyp').val(crimeTyp).prop("selected", true);
	if ( startDat != '') $(".contentWrapper").find('#startDat').val((startDat.substring(0,4)+'-'+startDat.substring(4,6)+'-'+startDat.substring(6,8)));
	if ( endDat != '') $(".contentWrapper").find('#endDat').val((endDat.substring(0,4)+'-'+endDat.substring(4,6)+'-'+endDat.substring(6,8)));

};

</script>
<script type="text/javascript" src="./common/sysMngSort.js"></script>
<div id="searchBox">

    <input type="hidden" id="offset" value="<%= offset %>" />
    <input type="hidden" id="max" value="<%= max%>" />

    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">
<!--         <p class="searchTitle">이미지반출신청현황</p> -->
        <div id="menu_bar" class="box_style">

	        <div class="sch_bar info_box wd100" style="justify-content: flex-start;">
	            <div>
	            	<label>신청자</label>
		            <select id="userKwTyp" style="height:24px; width:100px;  vertical-align: middle;">
		                <option value="nm">신청자명</option>
		                <option value="id">신청자ID</option>
		            </select>
		            <input type="text" id="userKw" size="12" style="width: 100px; vertical-align: middle;">
	            </div>
	            <div>
	            	<label>처리상태</label>
	            	<select id="procStatCd" style="height:24px; width:100px;  vertical-align: middle;">
	                    <option value="">전체</option>
	                <%
	                    while (procStatCdItr.hasNext()) {
	                        String str = (String) procStatCdItr.next();
	                %>
	                    <option value="<%=str%>" <%if(procStatCd.equals(str)){%>selected="selected" <% } %>><%=procStatCdMap.get(str)%></option>
	                <%
	                    }
	                %>
	                </select>
	            </div>
	            <div>
	            	<label>신청기간</label>
		            <input type="date" id="startDat" size="12" style="width: 135px; vertical-align: middle;"><!-- button class="ico_cal"></button-->
                     ~
                	<input type="date" id="endDat" size="12" style="width: 135px; vertical-align: middle;"><!-- button class="ico_cal"></button-->
                	<label>LIMIT</label>
	            	<input type="text" id="limit" size="12" style="width: 80px; vertical-align: middle;"  value="<%= limit %>">

	                <button id="btn_sch" class="btn_style2">조회</button>
<%-- 	                총 <%=max%>건이 조회되었습니다. --%>
	            </div>
	            <div class="" style="width:auto;">
	                <button id="xls_down_btn" class="btn_Dstyle"><!-- <img id="btn_xls" src="../../intra/img/3_over.png" class="" style="border: 0; vertical-align: middle;"></img> -->엑셀내려받기</button>
	            </div>
	        </div>
	  </div>
            <!-- <div class="top_right" style="width:auto;">
                <button class="openRegPop grayBtn">이미지 등록</button>
                &nbsp; &nbsp; &nbsp;
                <button class="openRqstPop grayBtn">이미지 반출신청</button>
                &nbsp; &nbsp; &nbsp;
            </div> -->
        <div style="width:auto;margin-left: 30px;">
        	<div class="top_left" style="margin-left: 10px;">총 <%= max %>건이 조회되었습니다</div>
        </div>
        <table>
<!--             <colgroup> -->
<!--                 <col width="140" /> -->
<!--                 <col width="140" /> -->
<!--                 <col width="140" /> -->
<!--                 <col width="" /> -->
<!--                 <col width="140" /> -->
<!--                 <col width="160" /> -->
<!--                 <col width="140" /> -->
<!--                 <col width="140" /> -->
<!--                 <col width="60" /> -->
<!--                 <col width="90" /> -->
<!--             </colgroup> -->
            <!-- <tr>
                <th>신청번호</th>
                <th>신청자</th>
                <th>신청일</th>
                <th>신청내용</th>
                <th>공문번호</th>
                <th>공문파일</th>
                <th>승인일</th>
                <th>처리상태</th>
                <th>공문확인</th>
                <th>상세보기</th>
            </tr> -->
<%
String url = "/tvius/getMngTviusImageView.do";
%>
            <tr>
            	<th><span id='rqst.mgr_seq' class='mngSortBtn' url='<%=url%>'>신청번호</span></th>
            	<th><span id='rqstusr.user_id' class='mngSortBtn' url='<%=url%>'>신청자ID</span></th>
            	<th><span id='rqstusr.user_nm' class='mngSortBtn' url='<%=url%>'>신청자</span></th>
            	<th><span id='rqst.reqst_dat' class='mngSortBtn' url='<%=url%>'>신청일</span></th>
            	<th><span id='rqst.reqst_detail' class='mngSortBtn' url='<%=url%>'>신청내용</span></th>
            	<th><span id='rqst.doc_no' class='mngSortBtn' url='<%=url%>'>공문번호</span></th>
            	<th><span id='rqst.doc_file_nm' class='mngSortBtn' url='<%=url%>'>공문파일</span></th>
            	<th><span id='rqst.acpt_dat' class='mngSortBtn' url='<%=url%>'>승인일</span></th>
            	<th><span id='rqst.proc_stat_cd' class='mngSortBtn' url='<%=url%>'>처리상태</span></th>
            	<th><span id='rqst.doc_chng_yn' class='mngSortBtn' url='<%=url%>'>공문확인</span></th>
            	<th>상세보기</th>
            </tr>

            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="9" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
            </tr>
            <%
             } else {
                  for(int i=0; i<list.size(); i++){


            %>
            <tr>
                <td class="tCenter"><span><%=list.get(i).getMgrSeq() %></span></td>
                <td class="tCenter"><%=list.get(i).getReqstId() %></td>
                <td class="tCenter"><%=list.get(i).getReqstUsrNm() %></td>
                <td class="tCenter"><%=DateUtil.formatDate(list.get(i).getReqstDat(),8) %></td>
                <td class="tBlankLeft tooltip" title="<%=list.get(i).getReqstDetail()%>">
                <%
                String reqstDetail = list.get(i).getReqstDetail();
                if ( reqstDetail.length() >= 10) {
                    reqstDetail = reqstDetail.substring(0, 10)+"...";
                }
                %>
                <%=reqstDetail%>
                </td>
                <td class="tCenter"><%=list.get(i).getDocNo() %></td>
                <td class="tCenter"><%=list.get(i).getDocFileNm() %></td>
                <%
                if(list.get(i).getAcptDat() == null || "".equals(list.get(i).getAcptDat().trim())){
                %>
                <td></td>
                <%
                } else {
                %>
                <td class="tCenter"><%=DateUtil.formatDate(list.get(i).getAcptDat(), 8) %></td>
                <%
                }
                %>
                <td class="tCenter">
                    <ul class="result_bar" style="">
                        <li>
                            <div class="result_type" style="">
                            </div>
                        </li>
                        <li>
                            <div class="result_type">
                            </div>
                        </li>
                        <li>
                            <div class="result_type">
                            </div>
                        </li>
                        <li>
                            <div class="result_type">
                            </div>
                        </li>
                        <li>
                            <div style="margin-top: 5px;" <% if ( "SD".equals(list.get(i).getProcStatCd()) ) out.print(" class=\"tool rejt_cont\" cont=\""+list.get(i).getRejtResn()+"\"  title=\""+list.get(i).getRejtResn().replaceAll("\n","<br>")+"\" "); %>>
                                <label class="result_text"><%=procStatCdMap.get(list.get(i).getProcStatCd())%></label>
                            </div>
                        </li>
                    </ul>
                </td>
                <%	String docChngYn = "X";
                	String style = "white";
                	if("Y".equals(list.get(i).getDocChngYn()) ) {
                		docChngYn = "O";
                		style = "white";
                	}
                %>
                <td class="tCenter">
                    <span style="color: <%=style%>"><%=docChngYn%></span>
                </td>
                <td class="tCenter">
                    <button class="btn_dtv grayBtn btn_style2" mgrseq="<%=list.get(i).getMgrSeq()%>" stat="<%=list.get(i).getProcStatCd()%>">상세보기</button>
                </td>
            </tr>
            <%
                  }
             }
            %>
        </table>

        <div class="paging_wrap" style="display:block"></div>



<!--     <div style="position: absolute; bottom: 0px; height: 30px; width: 100%; display: block;"> -->
<!-- 		<span id="userNm" style="float: right; margin-right: 100px; font-size: 14px; font-weight: bold; color: #666;"> -->
<%-- 			<%= userNm %>님 환영합니다. --%>
<!-- 		</span> -->
<!-- 	</div> -->

</div>
