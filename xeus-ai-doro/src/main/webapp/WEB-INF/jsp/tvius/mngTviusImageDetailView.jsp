<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.tvius.service.CrmsTransRqstVo"%>
<%@ page import="geomex.xeus.user.service.UserVo"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* C52 // 영상반출처리상태 */
    HashMap<String, String> procStatCdMap = cde.convertCodeGrpToAllCde("C52");
    /* Set<String> procStatCdKey = new TreeSet<String>(procStatCdMap.keySet());
    Iterator<String> procStatCdItr = procStatCdKey.iterator(); */

    /* CD53 // 승인거절유형 */
    HashMap<String, String> chkRejtResn = cde.convertCodeGrpToAllCde("C53");
    Set<String> chkRejtResnKey = new TreeSet<String>(chkRejtResn.keySet());
    Iterator<String> chkRejtResnItr = chkRejtResnKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

    String listOffset = param.get("listOffset");
    String listLimit = param.get("listLimit");
    String oneProcStatCd = "";
    if(param.containsKey("stat")) oneProcStatCd = param.get("stat");

    CrmsTransRqstVo item = (CrmsTransRqstVo)request.getAttribute("item");

    String reqstId = item.getReqstId();
    String mgrSeq = item.getMgrSeq();

    ArrayList<UserVo> userList = (ArrayList<UserVo>)request.getAttribute("user");
    UserVo user = null;
    for(UserVo vo : userList){
    	if(reqstId.equals(vo.getUserId())){
    		user = vo;
    		break;
    	}
    }

%>
<script type="text/javascript">

var userId = '<%= userId %>';
var mgrSeq = <%= mgrSeq %>;
var listOffset = '<%= listOffset %>';
var listLimit = '<%= listLimit %>';
var oneProcStatCd = '<%= oneProcStatCd %>';

$(document).ready(function(){

	//setTooltip('.detailTip', '#data_view');
	setAviList(mgrSeq);
	resizeDone();

});

$( window ).on( 'resize', function( ) {
    /* clearTimeout( timer );
    timer = setTimeout( resizeDone, delta ); */
} );

function resizeDone() {

	//$('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-10);
	$('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-$('#overlay-west-bar').height() - 40);

	$('#bar_btns').css('width', $(window).width()-$('#overlay-west-side-bar').width()-$('#datail_top_bar').find('.searchTitle').width()-65);

}

$("#btn_stat_sa").click(function(){
	var _param= {};
	_param['mgrSeq'] = mgrSeq;
	_param['procStatCd'] = 'SK';
	_param['acptUserId'] = userId;

	_common.callAjax("/tvius/editProcStatCdOfImgRqst.json", _param, function(json) {
		if(json.result){

			alert('* 저장되었습니다.');

			$("#popupWrap").dialog("close");
			callView(offset);
// 		    var procStatCd = $(".contentWrapper").find('#procStatCd').val().trim();
// 		    var startDat = $(".contentWrapper").find('#startDat').val().trim().replace(/\-/g,'');
// 		    var endDat = $(".contentWrapper").find('#endDat').val().trim().replace(/\-/g,'');
// 		    var userKwTyp = $(".contentWrapper").find('#userKwTyp').val().trim();
// 		    var userKw = $(".contentWrapper").find('#userKw').val().trim();

// 		    var _param = {};

// 		    _param['limit'] = '200';
// 		    _param['offset'] = '0';

// 			if ( userKw != ''){
// 				if( userKwTyp == "id") _param['reqstId'] = userKw;
// 				if( userKwTyp == "nm") _param['reqstUsrNm'] = userKw;
// 			}
// 		    if ( procStatCd != '') _param['procStatCd'] = procStatCd;
// 		    if ( startDat != '') _param['startDat'] = startDat + '000000';
// 		    if ( endDat != '') _param['endDat'] = endDat + '235959';


// 		    callView(offset, _param);

		}
	});
});

$("#btn_stat_sd").click(function(){

	var $_html = $('<div class="detailPopupWrapper"></div>');
	$_html.append($(".popupWrapper").find("#rejt_pop").html());

	$("#detailPopupWrap").dialog('close').html($_html[0]).dialog({
		title : "승인 거절 사유",
		modal: true,
	    width: 600,
		position: {
			my: "top center",
			at: "top center",
			of: $("#contentWrap")
		},
		open: function(){
			$('.detailPopupWrapper').find("#btn_rejt_ok").click(function(){

				var rejtTyp = $('.detailPopupWrapper').find("#rejtTyp").val();
				var rejtResn = $('.detailPopupWrapper').find("#rejtResn").val();

				if(rejtTyp == ''){
					alert('* 거절유형을 선택하여 주십시오.');
					return false;
				}

				if(rejtResn == ''){
					alert('* 거절사유를 입력하여 주십시오.');
					return false;
				}

				var _param= {};
				_param['mgrSeq'] = mgrSeq;
				_param['procStatCd'] = 'SD';
				_param['rejtTyp'] = rejtTyp;
				_param['rejtResn'] = rejtResn;
				_param['acptUserId'] = userId;
				_common.callAjax("/tvius/editProcStatCd.json", _param, function(json) {

					if(json.result){
						alert('* 저장되었습니다.');
//						$(".popupWrapper").find('#rejt_pop').find("#btn_rejt_cc").click();
						$("#detailPopupWrap").dialog('close');
						$("#popupWrap").dialog('close');
						callView(offset);
					}

				});

			});
		},
		close: function(){

		}
	}).dialog("open");

});



$('#rejt_pop').find("#btn_rejt_cc").click(function(){
	$('#rejt_pop').dialog("close");
});

$("#btn_list").click(function(){
	var _param= {};
	_param['limit'] = 200;
	_param['offset'] = listOffset;
	_common.callAjax("/tvius/getMngTviusImageView.do", _param, function(view) {
// 		$("#overlay-west-contents").html(view);
// 		xeusLayout.WEST = $('.map-target').width();
// 		xeusLayout.showOverlayWestPane(250, function() {
// 			$(".bpopup").remove();
// 			$("#center-overlay-west").attr('xeus-full-size', 'true');
// 		});
// 		$('#west-slide-btn').hide();
	});
});

$(".doc_down").click(function(){
	var realNm = $(this).attr('realnm').split("/");
	var downNm = $(this).attr('downnm');
	_common.callAjax("/sysMng/getSysParam.json", null, function(json) {
		if(json.result !== undefined){
			var _param = {};
			_param['sub'] = realNm[0];
			_param['path'] = json.result[0]['sys.upload_path'];
			_param['fileNm'] = realNm[1];
			_param['downFileNm'] = downNm.replace(/\;/gi, '_');
			_param['auth'] = "A";
			_common.postForm.submit("/tvius/getFiles.json", _param);
		}
	},false);
});

$(".popupWrapper").find(".securityDoc").click(function(){
	var k = $(this).attr("k");
	var u = $(this).attr("u");

	if(k != null && k != "" && u != null && u != ""){
		_common.postForm.submit("/user/getFile.json", { "oathFileNm" : k , "userId" : u });
	}
});

///////////////////////////

$("#btn_edit_doc").click(function(e) {
	$("#hiddenDocForm").find("#uploadImg").click();
});

/* 상위 "파일 첨부" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
$("#hiddenDocForm").find("#uploadImg").on("change", function(){
	var nm = $(this).val();
	if(nm != ""){
		var tmpFileNm = $(".doc_down").attr("realnm").replace("/", "\\");
		//공문업로드
		if(confirm("선택하신 파일을 업로드 하시겠습니까?")){
			_common.formSubmit("/tvius/addDocFile.json", $("#hiddenDocForm"), function(json){
	        	if(json.realNm !== undefined && json.uploadNm !== undefined){
	        		//임시공문삭제
	    			//공문정보업데이트
	        		var docFileNm = json.uploadNm;
	        		var docFilePath = json.realNm;

	        		var _editParam = {};
	        		_editParam['mgrSeq'] = mgrSeq;
	        		_editParam['docFileNm'] = docFileNm;
	        		_editParam['docFilePath'] = docFilePath;
	        		_editParam['tmpFileNm'] = tmpFileNm;

	        		_common.callAjax("/tvius/editDocFileInfo.json", _editParam, function(json) {
	        			if(json.result){
	        				alert('공문 정보 변경이 완료되었습니다.');
	        				//공문 파일 다운로드 로직 교체
	        				$(".doc_down").attr("downnm", docFileNm);
	        				$(".doc_down").attr("realnm", "rqst/"+docFilePath);
	        				$(".doc_down").text(docFileNm);
	        			}else{
	        				alert(json.msg);
	        			}
	        		});
	        	}
	        });
		}
	}
});

/**
 * 영상정보신청 상세보기 > 공문번호변경 클릭
 */
$(".popupWrapper").find("#btn_doc_no_chng").click(function(e) {

//	$(".popupWrapper").find("#docNoChngPop").bPopup({
//        appendTo: $(".popupWrapper")
//    });
	var _html ='';
	_html += '<div class="detailPopupWrapper">'
	_html += '	<div id="docNoChngPop">'
	_html += '		<div id="bpop_wrap" class="table_style">'
	_html += '			<table>'
	_html += '				<tr>'
	_html += '					<th class="top">공문번호</th>'
	_html += '					<td>'
	_html += '						<input class="sendData" id="chgDocNo"></input>'
	_html += '					</td>'
	_html += '				</tr>'
	_html += '			</table>'
	_html += '			<table>'
	_html += '				<tr align="center">'
	_html += '					<td class="lastTd" colspan="2" style="border: 0 !important;">'
	_html += '						<button id="docNoSaveBtn" class="btn_style">저장</button>'
//	_html += '						<button id="docNoCloseBtn" class="btn_Dstyle2">취소</button>'
	_html += '					</td>'
	_html += '				</tr>'
	_html += '			</table>'
	_html += '		</div>'
	_html += '	</div>'
	_html += '</div>'

	$("#detailPopupWrap").dialog("close").html(_html).dialog({
		title: '공문번호 수정',
		width: 400,
		height: 'auto',
		position: {
			my: "center center",
			at: "center center",
			of: $("#popupWrap")
		},
		modal: true,
		open: function(){

			var txt=$(".popupWrapper").find("#viewDocNo").text();
			$(".detailPopupWrapper").find("#chgDocNo").val(txt);

			$(".detailPopupWrapper").find("#docNoSaveBtn").click(function(e) {
				var docNo = $(".detailPopupWrapper").find("#docNoChngPop").find("#chgDocNo").val();

				_common.callAjax("/tvius/editDocNo.json", {'mgrSeq': mgrSeq, 'docNo': docNo}, function(json) {
					if(json.result){
						alert('수정되었습니다.');
						$("#detailPopupWrap").dialog("close");
//						$(".detailPopupWrapper").find("#edit_pop").find("#docNo").val(docNo);
						$(".popupWrapper").find("#viewDocNo").text(docNo);
					}else{
						alert('공문번호 수정에 실패하였습니다.');
					}
				});
			});
		},
		close: function(){

		}
	}).dialog("open");

});

$("#docNoSaveBtn").click(function(e) {
	var docNo = $("#docNoChngPop").find("#chgDocNo").val();

	_common.callAjax("/tvius/editDocNoOfImgRqst.json", {'mgrSeq': mgrSeq, 'docNo': docNo}, function(json) {
		if(json.result){
			alert('수정되었습니다.');
			$("#docNoChngPop").bPopup().close();
			$("#edit_pop").find("#docNo").val(docNo);
			$("#viewDocNo").text(docNo);
		}else{
			alert('공문번호 수정에 실패하였습니다.');
		}
	});
});

$("#docNoCloseBtn").click(function(e) {
	$("#docNoChngPop").find("#chgDocNo").val('');
	$("#docNoChngPop").bPopup().close();
});

$("#btn_doc_chng").click(function(e) {
	if(confirm("최종공문확인을 완료하시겠습니까?")){
		_common.callAjax("/tvius/editDocChngYn.json", {'mgrSeq': mgrSeq}, function(json) {
			if(json.result){
				alert('정보 변경이 완료되었습니다.');
				$(".popupWrapper").find("#docChngYn").css("color", "blue");
				$(".popupWrapper").find("#docChngYn").text("O");
				$(".popupWrapper").find("#btn_reqst_detail_chng").remove();
				$(".popupWrapper").find("#btn_doc_no_chng").remove();
// 				$(".popupWrapper").find("#btn_edit_doc").remove();
                $(".popupWrapper").find("#btn_doc_chng").remove();
                $(this).val("");
			}else{
				alert('정보 변경에 실패하였습니다.');
			}
		});

	}
});

/**
 * 190718 이은규
 * 해당 반출 건을 삭제합니다.
 *
 * public 스키마에 해당 건을 백업합니다.
 */
$(".popupWrapper").find("#btn_del").click(function(){
	if(confirm("* 해당 반출 건을 삭제하시겠습니까?")){

		var _rqstParam = {};
		_rqstParam["rqstMgrSeq"] = $(this).attr("mgrSeq");
		_rqstParam['before'] = 'xeus';
		_rqstParam['after'] = 'public';

		_common.callAjax("/tvius/changeRqst.json", _rqstParam, function(json) {
			if(json.result){
				alert('삭제작업이 완료되었습니다.');
				$("#popupWrap").dialog("close");
				callView(offset);
			} else {
				alert('작업 도중 오류가 발생하였습니다.');
			}
		});

	}

});


$(".popupWrapper").find("#btn_all_img_download").click(function(){
	if(confirm("일괄 다운로드하시겠습니까?")){
		var arFileArray  = new Array();
		var sZipFileName = "capture.zip";

		$("#imgList").find(".img_down").each(function(){
			var obj={};
			obj.filename=$(this).attr("downnm");
			obj.url="./tvius/getImage.do?realNm="+$(this).attr("realnm");
			arFileArray.push(obj);
		})

		downloadZipFile(arFileArray, sZipFileName);
	}

});



////////////////////

function setAviList(mgrSeq) {
    $('#imgList').html('');
    _common.callAjax("/tvius/getImgListOfImgRqst.json", {'rqstMgrSeq': mgrSeq}, function(json){
        if(json.result){
            var _html = '';
            for(var i=0; i<json.result.length; i++){
            	var desc = json.result[i].imgDesc;
				if(desc.length > 20) desc = desc.substring(0,20) + '...';
                _html += '<tr>';
                _html += '<td class="tCenter">'+json.result[i].mgrSeq+'</td>';
                _html += '<td class="tCenter">'+Date.prototype.formatDate(json.result[i].regDat)+'</td>';
                _html += '<td class="tBlankLeft listTooltip" title="'+json.result[i].imgDesc+'">'+desc+'</td>';
                _html += '<td class="tBlankLeft">'
                _html += '<a class="img_down" downnm="'+json.result[i].imgNm+'" realnm="'+json.result[i].imgPath+'" target="_blank" style="color:#7780ff">'+json.result[i].imgNm+'</a>';
                _html += '</td>';
                /* if(oneProcStatCd != "SK"){
                    _html += '<td class="tCenter"></td>';
                }else{
                    _html += '<td class="tBlankLeft">'
                    _html += '<a class="img_down" downnm="'+json.result[i].imgNm+'" realnm="'+json.result[i].imgPath+'" target="_blank" style="color:#7780ff">'+json.result[i].imgNm+'</a>';
                    _html += '</td>';
                } */
                _html += '</tr>';
            }
            $('#imgList').html(_html);

            //setTooltip(".listTooltip", '#imgList');

            $('.img_down').css('font-weight','bold');
            $('.img_down').mouseenter(function(){
                $(this).css("cursor","pointer");
                $(this).css("text-decoration","underline");
            });
            $('.img_down').mouseleave(function(){
                $(this).css("text-decoration","none");
            });
            $('.img_down').off('click');
            //파일명 클릭
            $('.img_down').click(function(){
                var downNm = $(this).attr('downnm');
                var realNm = $(this).attr('realnm');
            	var _html ='';
        		_html += '<div class="detailPopupWrapper">'
        		_html += '	<div id="docNoChngPop">'
        		_html += '		<div id="bpop_wrap" class="table_style">'
        		_html += '			<img class="imgs" alt="'+downNm+'" src="./tvius/getImage.do?realNm='+realNm+'" style="width:100%;height:100%">'
        		_html += '			<div style="text-align:center"><button class="btn_style2" id="imgDownload">다운로드</button></div>'
        		_html += '		</div>'
        		_html += '	</div>'
        		_html += '</div>'

        		$("#detailPopupWrap").dialog("close").html(_html).dialog({
        			title: '이미지',
        			width: 500,
        			height: 400,
        			position: {
        				my: "center center",
        				at: "center center",
        				of: $("#popupWrap")
        			},
        			modal: true,
        			open: function(){
        				$('.detailPopupWrapper').find('#imgDownload').click(function(){
        					_common.callAjax("/sysMng/getSysParam.json", null, function(json) {
        						if(json.result !== undefined){
        							var _param = {};
        							_param['sub'] = 'image';
        							_param['path'] = json.result[0]['sys.upload_path'];
        							_param['fileNm'] = realNm;
        							_param['downFileNm'] = downNm;
        							_param['auth'] = "A";
        							_common.postForm.submit("/tvius/getFiles.json", _param);
        						}
        					},false);
                    });

        			},
        			close: function(){

        			}
        		}).dialog("open");

            });

            resizeDone();
        }else{
            alert('데이터 로드중 오류가 발생했습니다.');
            $('#imgListView').addClass('hidden');
            resizeDone();
        }
    });


    var _aviParam = {};
	_aviParam['rqstMgrSeq'] = mgrSeq;
	_common.callAjax("/tvius/getMngTviusImageAviList.do", _aviParam, function(view) {

		$(".popupWrapper").find("#cctvList").html(view);

	});
}

/* function setTooltip(target, from){
	$(target).tooltipsy({
		delay: 0,
		offset: [5, 5],
		css: {
			'font-size' : '12px',
			'font-weight' : 'bold',
			'padding': '10px',
			'color': '#303030',
			'background-color': '#ffffff',
			'border': '2px solid #4893BA',
			'-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
			'-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
			'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
			'text-shadow': 'none'
		},
		from: from
	}).click(function (e) {
		$('.tooltipsy').parent().hide();

		var from = from;
		if(from != null){
			setTimeout(function(){
				if(!$("div[aria-describedby=" + from + "]").is(":visible")){
					$("div[from=" + from + "]").remove();
				}
			}, 500);
		}
	});
} */

</script>
<style>
#edit_pop select {
    padding-left: 10px;
}
</style>

<div id="searchBox">

    <div class="popupWrapper customScroll" data-mcs-theme="minimal-dark">

        <div id="datail_top_bar" style="text-align: right;">

<!--             <p class="searchTitle" style="width: 300px; display: inline-block;">이미지반출신청 상세보기</p> -->

    	    <div id="bar_btns" style="margin-right: 20px; margin-bottom: 10px; width: 300px; display: inline-block;">

    	        <div style="text-align: right;">
	<%
	if ( "SW".equals(item.getProcStatCd()) ) {
	%>
    	            <button id="btn_stat_sa" class="grayBtn btn_style2"> 승 인 </button>
    	            <button id="btn_stat_sd" class="grayBtn btn_Dstyle2"> 거 절 </button>

    	            <div id="rejt_pop" style="display: none; background-color: #282828; width: 400px;">
                        <div class="searchWrapper table_style">
<!--         	                <h3 class="title">승인거절사유입력</h3>style="width: 450px;" -->
<!--         	                <div  style=" float:left; border-top:1px solid #555; margin:5px 0 ; width:100%;"></div> -->
							<div class="box_style">
								<div class="info_box wd100">
									<span class="title">거절유형</span>
									<select id="rejtTyp" name="rejtTyp" style="">
            								<option value="">전체</option>
        	       							<%
        	       						    while (chkRejtResnItr.hasNext()) {
        	       						      String str = (String) chkRejtResnItr.next();
        								    %>
        								    <option value="<%=str%>"><%=chkRejtResn.get(str)%></option>
        								    <%
        								    }
        								    %>
        							</select>
								</div>
								<div class="info_box wd100">
									<span class="title">거절사유</span>
									<textarea id="rejtResn"></textarea>
								</div>
							</div>
        	                <div style="margin-top:10px;">
        	                    <div class="text">* 거절 사유는 <b style="color:red;">최대 200글자 입니다.</b></div>
        	                </div>
                            <div class="btnDiv" style="text-align: center;"><!-- style="text-align: center; padding: 5px 0 ;" -->
                                <button id="btn_rejt_ok" class="grayBtn btn_style"> 저 장 </button>
<!--                                 <button id="btn_rejt_cc" class="grayBtn btn_Dstyle2"> 취 소 </button> -->
                            </div>
                        </div>

    	            </div>
	<%
	}
	%>
				<% if(!"15".equals(item.getReqGbnCd())){ %>
					<button id="btn_del" class="btn_Dstyle2" mgrSeq="<%= item.getMgrSeq() %>"> 삭 제 </button>
	<% } %>
<!--                     <button id="btn_list" class="grayBtn" style="width: 60px; height: 32px;"> 목록으로 </button> -->
	            </div>
            </div>
        </div>

		<div id="data_view">
		    <div id="rejt_cont_pop" style="display: none;">
		        <div class="rejt_cont_top">
		            <span class="searchTitle">신청내용 </span>
		            <span class="rejt_cont_close" style=" position:absolute; right:4px; top:5px; cursor: pointer"><img src="/xeus/res/img/btn_close.png"/></span>
		        </div>

		        <textarea id="rejt_cont_text" readonly="readonly"></textarea>
		    </div>

		    <table class="req_table" cellspacing="0" style="margin-bottom:0; border-bottom: 0" width="100%">
		        <colgroup>
		            <col width="101" />
		            <col width="400" />
		            <col width="101" />
		            <col width="" />
		        </colgroup>

		        <tr>
		            <th>신청자</th>
		            <td>
		                <div class="inBox"><%=item.getReqstIdRelCdeNm()%> (<span id="reqstId"><%=item.getReqstId()%></span>)</div>
		            </td>
		            <th>신청일시</th>
		            <td>
		                <div id="reqstDat" class="inBox"><%=DateUtil.formatDate(item.getReqstDat())%></div>
		            </td>
		        </tr>

		        <tr>
		            <th>신청내용</th>
		            <td colspan="3">
                    <%
                        String reqstDetail = StrUtil.chkNull(item.getReqstDetail());
                        String viewTxt = reqstDetail;
                        if(!"".equals(reqstDetail)){
                            if(viewTxt.length()>20) viewTxt = viewTxt.subSequence(0, 20) + "...";
                        }
                    %>
                        <div class="inBox rejt_cont"><span class="detailTip" tit="신청내용" title="<%=reqstDetail%>"><%=viewTxt%></span></div>
		            </td>
		        </tr>

		        <tr>
		            <th>공문번호</th>
		            <td>
		                <div class="inBox">
		                	<span id="viewDocNo"><%=item.getDocNo()%></span>
<%-- 		<% if ("SK".equals(item.getProcStatCd()) && "N".equals(item.getDocChngYn()) ){%> --%>
	                    	<button id="btn_doc_no_chng" class="grayBtn btn_Dstyle" style="margin-left: 10px;">공문번호변경</button>
<%-- 		<% } %> --%>
						</div>
		            </td>

		            <th>첨 부</th>
		            <td>
		                <div class="inBox">
		<% if(user != null){ %>
		                    [ <b>보안 서약서 </b> :
                                <a class="securityDoc" style="cursor: pointer; color: #7780ff;" k="<%= StrUtil.chkNull(user.getOathFileNm()) %>" u="<%= reqstId %>" target="_blank"><%= StrUtil.chkNull(user.getOathFileNm()) %></a>
                            ]
		<% } %>
		                    [ <span>공 문 서 </span> :
                            <% if (!StrUtil.isEmpty(item.getDocFileNm()) && !StrUtil.isEmpty(item.getDocFilePath()) ){%>
                                <a class="doc_down" style="cursor: pointer; color: #7780ff;" downnm= "<%=item.getDocFileNm()%>" realnm="rqst/<%=item.getDocFilePath()%>" target="_blank"><%=item.getDocFileNm()%></a>
                            <% } %>
                            ]
							[ <b> 최종공문확인 </b> :
		<%	String docChngYn = "X";
			String style = "white";
			if("Y".equals(item.getDocChngYn()) ) {
				docChngYn = "O";
				style = "white";
			}
		%>
                            <span id="docChngYn" style="color: <%=style%>"><%=docChngYn%></span>
                            ]
                            <button id="btn_edit_doc" class="grayBtn btn_style2">공문 변경</button>
		                    <form class="hidden" id="hiddenDocForm" method="POST" enctype="multipart/form-data">
		                        <input type="text" name="p" id="p" class="hidden" value="rqst\\">
		                        <input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z">
		                    </form>
		<% if ("SK".equals(item.getProcStatCd()) && "N".equals(item.getDocChngYn()) ){%>

		                    <button id="btn_doc_chng" class="grayBtn btn_style2">최종공문확인</button>
		<% } %>
		                </div>
		            </td>
		        </tr>

		        <tr>
		            <th><!--  style = "background-color: #373737;" -->
		                처리상태
		            </th>
		            <td>
		                <div class="inBox" id="stat_nam" key="<%=item.getProcStatCd()%>">
		                    <%=procStatCdMap.get(item.getProcStatCd())%>
		                </div>
		            </td>
		            <th><!--  style = "background-color: #373737;" -->
		                처리내용
		            </th>
		            <td>
		                <div class="inBox">
		<%
		if ( !"SW".equals(item.getProcStatCd()) )  {
		    if ( "SD".equals(item.getProcStatCd()) )  {
		%>
		                    <div>
		                    	<div style="text-align : left;"><span>거절일시 : <% if ( item.getAcptDat() != null){ %> <%=DateUtil.formatDate(item.getAcptDat())%><% } %></span></div>
								<div style="text-align : left;"><span>거 절 자 : <% if ( item.getAcptDat() != null){ %> <%=item.getAcptUserIdRelCdeNm()%> (<%=item.getAcptUserId()%>)<% } %></span></div>
		                        <div style="text-align : left;">거절유형 : <%=item.getRejtTypRelCdeNm()%></div>
		                        <div style="text-align : left;" class="rejt_cont" ><span tit="거절사유">거절사유 : <%=item.getRejtResn()%></span></div>
		                    </div>
		<%
		    } else {
		%>
		                    <div>

		                        승인일시 : <% if ( item.getAcptDat() != null){ %> <%=DateUtil.formatDate(item.getAcptDat())%><% } %><br>
		                        승 인 자 : <% if ( item.getAcptDat() != null){ %> <%=item.getAcptUserIdRelCdeNm()%> (<%=item.getAcptUserId()%>)<% } %>
		                    </div>
		<%
		    }
		%>
		<%
		}
		%>
		                </div>
		            </td>
		        </tr>
		    </table>

			<h3 class="title">CCTV</h3>

            <table cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="border: none;">
                        <div id="cctvList" name="cctvList" style="width: 100%; height: 100%; border: none;"></div>
                    </td>
                </tr>

            </table>

            <h3 style="display:inline" class="title">이미지목록</h3>
            <% if ("SK".equals(item.getProcStatCd())) {%>
            <button id="btn_all_img_download" class="btn_style2" style="float: right;">일괄 다운로드</button>
            <% } %>
            <table>
                <thead>
                    <tr>
                       <th width="140">이미지 등록번호</th>
                       <th width="200">등록일</th>
                       <th width="200">이미지설명</th>
                       <th>파일명</th>
                    </tr>
                </thead>
                <tbody id="imgList">
                </tbody>
            </table>

    	</div>

    	<div id="docNoChngPop" class="bpopup" style="display:none;">
            <div id="bpop_wrap" class="table_style">
                <h2 id="bpop_title" style="display:none;">공문번호 수정</h2>
                <table>
                    <tr>
                        <th class="top">공문번호</th>
                        <td>
                            <input class="sendData" id="chgDocNo"></input>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr align="center">
                        <td class="lastTd" colspan="2" style="border: 0 !important;">
                            <button class="btn_style" id="docNoSaveBtn">저장</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

<!--     <div style="position: absolute; bottom: 0px; height: 30px; width: 100%; display: block;"> -->
<!-- 		<span id="userNm" style="float: right; margin-right: 100px; font-size: 14px; font-weight: bold; color: #666;"> -->
<%-- 			<%= userNm %>님 환영합니다. --%>
<!-- 		</span> -->
<!-- 	</div> -->

</div>
