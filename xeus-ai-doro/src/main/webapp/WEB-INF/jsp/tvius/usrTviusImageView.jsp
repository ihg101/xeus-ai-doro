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

    if (param.containsKey("procStatCd")) procStatCd = param.get("procStatCd");
    if (param.get("startDat") != null)  startDat = param.get("startDat").trim();
    if (param.get("endDat") != null)    endDat = param.get("endDat").trim();

    String sortCol = "";
    String sortTyp = "";
    String sortCntrl = "";
    if (param.get("sortCol") != null)	sortCol = param.get("sortCol");
    if (param.get("sortTyp") != null)	sortTyp = param.get("sortTyp");
    if (param.get("sortCntrl") != null)	sortCntrl = param.get("sortCntrl");
    String offset = param.get("offset");
	String limit = param.get("limit");


    int max = (Integer)request.getAttribute("count");

    ArrayList<CrmsImageRqstVo> list = (ArrayList<CrmsImageRqstVo>)request.getAttribute("list");

%>
<link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css">
<script type="text/javascript" src="./common/sysUsrSort.js"></script>
<%-- <script type="text/javascript" src="<%=context%>/res/geomex.xeus.tvius.usr.rqst.view.js"></script> --%>
<script type="text/javascript">

var userId = '<%=userId%>';
var procStatCd = '<%=procStatCd%>';
var startDat = '<%=startDat%>';
var endDat = '<%=endDat%>';

var offset = '<%= offset %>';
var limit="<%= limit %>";
var sortCol = "<%= sortCol %>";
var sortTyp = "<%= sortTyp %>";
var sortCntrl = "<%= sortCntrl %>";

var timer = null;
var delta = 300;

var agent = null;

$(document).ready(function(){
    /* if (chkParam != "")$(".contentWrapper").find('#btn_list_all').show();
    else$(".contentWrapper").find('#btn_list_all').hide(); */

   $(".contentWrapper").find(".paging_wrap").paging({
        current   : 10,
        max       : Number($("#max").val()),
        nowOffset : Number($("#offset").val()),
        bindEvent : callView
    });

   $(".contentWrapper").find(".datePicker").datepicker("destroy").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd",
        showButtonPanel: true,
        beforeShowDay: $.datepicker.noBefore
    });
   $(".contentWrapper").find(".datePicker").inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});

    if ( startDat != '')$(".contentWrapper").find('#startDat').val('<%=startDat%>');
    if ( endDat != '')$(".contentWrapper").find('#endDat').val('<%=endDat%>');

    agent = navigator.userAgent.toLowerCase();

    setImgResultBar();

    //setTooltip(".tooltip", '.searchWrapper');

    resizeDone();
});

$( window ).on( 'resize', function( ) {
//     clearTimeout( timer );
//     timer = setTimeout( resizeDone, delta );
} );

function resizeDone() {
    //$(".contentWrapper").find('.searchWrapper').css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height());
	$(".contentWrapper").css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height() - 40);
}



function callView(offset,_param){
    //clearTimeout(intervalListChk);
    if(offset == null) offset = 0;
    if(_param === undefined){
        _param = {};
        _param['reqstId'] = userId;
        _param['limit'] = 10;

        if ( procStatCd != '')	_param['procStatCd'] = procStatCd;
    	if ( startDat != '')	_param['startDat'] = startDat;
    	if ( endDat != '')		_param['endDat'] = endDat;
    }
    _param['offset'] = offset;
    if(sortCol != undefined && sortTyp != undefined){
		if(_param['sortCol'] != "" && _param['sortTyp'] != ""){
			_param['sortCol'] = sortCol;
			_param['sortTyp'] = sortTyp;
		}
	}

    _common.callAjax("/tvius/getUsrTviusImageView.do", _param, function(view){
//     	$("#contentWrap").dialog("close").html(view).dialog({
// 			title : '이미지 반출',
// 		    width: $("#map").width(),
// 			height: $("#map").height(),
// 			position: {
// 				my: "left top",
// 				at: "left top",
// 				of: $("#map")
// 			},
// 			open: function(){
// // 				setAfterEvent(_ID);
// 				$(".contentWrapper").find(".mngSortBtn").each(function(){
// 					if($(this).attr('id') == sortCol && _param['sortCol'] != "" && _param['sortCol'] != ""){
// 						if(sortTyp === "asc") $(this).text($(this).text() + "▲");
// 						if(sortTyp === "desc") $(this).text($(this).text() + "▼");
// 					}
// 				});

// 				$(this).parent().find(".ui-dialog-titlebar").dblclick(function(){
// 					resizeDialog(_ID, _TITLE);
// 				});
// 			},
// 			close: function(){
// 				if(Public.StopEvent != null){
// 					Public.StopEvent();
// 				}
// 			}
// 		}).dialog("open");

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
    _param['reqstId'] = userId;
    _param['limit'] = '10';
    //_param['offset'] = '0';

    callView(0, _param);
});

$(".contentWrapper").find("#btn_sch").click(function(){
    var procStatCd =$(".contentWrapper").find('#procStatCd').val().trim();
    var startDat =$(".contentWrapper").find('#startDat').val().trim().replace(/\-/g,'');
    var endDat =$(".contentWrapper").find('#endDat').val().trim().replace(/\-/g,'');

    var _param = {};

    _param['reqstId'] = userId;
    _param['limit'] = '10';
    _param['offset'] = '0';

    if ( procStatCd != '') _param['procStatCd'] = procStatCd;
    if ( startDat != '') _param['startDat'] = startDat + '000000';
    if ( endDat != '') _param['endDat'] = endDat + '235959';

    callView(0, _param);
});

$(".contentWrapper").find(".imgList").click(function() {
    var rqstMgrSeq = $(this).attr("mgrseq");
    var procStatCd = $(this).attr("stat");

   $(".contentWrapper").find('#imgList').html('');
   $(".contentWrapper").find('#imgListView').removeClass('hidden');

    _common.callAjax("/tvius/getImgListOfImgRqst.json", {'rqstMgrSeq': rqstMgrSeq}, function(json){
        if(json.result){
            var _html = '';
            for(var i=0; i<json.result.length; i++){
            	var desc = json.result[i].imgDesc;
				if(desc.length > 10) desc = desc.substring(0,10) + '...';
                _html += '<tr>';
                _html += '<td class="tCenter">'+json.result[i].mgrSeq+'</td>';
                _html += '<td class="tCenter">'+Date.prototype.formatDate(json.result[i].regDat)+'</td>';
                _html += '<td class="tBlankLeft listTooltip" title="'+json.result[i].imgDesc+'">'+desc+'</td>';
                if(procStatCd != "SK"){
                    _html += '<td class="tCenter"></td>';
                }else{
                    _html += '<td class="tBlankLeft">'
                        _html += '<a class="img_down" downnm="'+json.result[i].imgNm+'" realnm="'+json.result[i].imgPath+'" target="_blank" style="color:#7780ff">'+json.result[i].imgNm+'</a>';
                        _html += '</td>';
                }
                _html += '</tr>';
            }
           $(".contentWrapper").find('#imgList').html(_html);

            //setTooltip(".listTooltip", '#imgList');

           $(".contentWrapper").find('.img_down').css('font-weight','bold');
           $(".contentWrapper").find('.img_down').mouseenter(function(){
                $(this).css("cursor","pointer");
                $(this).css("text-decoration","underline");
            });
           $(".contentWrapper").find('.img_down').mouseleave(function(){
                $(this).css("text-decoration","none");
            });
           $(".contentWrapper").find('.img_down').off('click');

           $(".contentWrapper").find('.img_down').click(function(){
        	   var downNm = $(this).attr('downnm');
               var realNm = $(this).attr('realnm');
	           	var _html ='';
	       		_html += '<div class="popupWrapper">'
	       		_html += '	<div id="docNoChngPop">'
	       		_html += '		<div id="bpop_wrap" class="table_style">'
	       		_html += '			<img class="imgs" alt="'+downNm+'" src="./tvius/getImage.do?realNm='+realNm+'" style="width:100%;height:100%">'
	       		_html += '			<div style="text-align:center"><button class="btn_style2" id="imgDownload">다운로드</button></div>'
	       		_html += '		</div>'
	       		_html += '	</div>'
	       		_html += '</div>'

		       		$("#popupWrap").dialog("close").html(_html).dialog({
		       			title: '이미지',
		       			width: 700,
		       			height: 600,
		       			position: {
		       				my: "center center",
		       				at: "center center",
		       				of: $("#contentWrap")
		       			},
		       			modal: true,
		       			open: function(){
		       				$('.popupWrapper').find('#imgDownload').click(function(){
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
           $(".contentWrapper").find('#imgListView').addClass('hidden');
            resizeDone();
        }
    });
});

$(".contentWrapper").find(".openRegPop").click(function() {
	 var _html = '';
	 _html+='<div id="imgRegPop">'
	 _html+='               <table>'
	 _html+='                   <tr class="top">'
	 _html+='                       <th class="top">이미지 첨부</th>'
	 _html+='                       <td>'
	 _html+='                           <input type="text" class="imgNm" style="width: 235px !important;" readonly="readonly"/>'
	 _html+='                           <button class="btn-upload" style="height: 25px; margin:3px 0px 0px 3px;">파일첨부</button>'
	 _html+='                           <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">'
	 _html+='                               <input type="text" name="p" id="p" class="hidden" value="image\\"><!-- \\upload\\tvius\\rqst\\ -->'
	 _html+='                               <input type="file" name="uploadImg" class="uploadImg hidden" pop="imgRegPop" target="imgNm" accept=".gif, .jpg, .jpeg, .png, .alz, .gz, .rar, .tar, .tgz, .z, .zip"><!-- id="uploadImg" -->'
	 _html+='                           </form>'
	 _html+='                       </td>'
	 _html+='                   </tr>'
	 _html+='                   <tr>'
	 _html+='                       <th class="top">이미지 설명</th>'
	 _html+='                       <td>'
	 _html+='                           <!-- <input type="text" class="sendData" id="imgDesc" placeholder="이미지 설명"/> -->'
	 _html+='                           <textarea class="sendData" id="imgDesc" style="width: 98%; margin: 2px; height: 75px;"'
	 _html+='                           collength="255" name="imgDesc"></textarea>'
	 _html+='                       </td>'
	 _html+='                   </tr>'
	 _html+='               </table>'
	 _html+='               <table>'
	 _html+='                   <tr align="center">'
	 _html+='                       <td class="lastTd" colspan="2" style="border: 0 !important;">'
	 _html+='                           <button for="imgRegPop" class="saveBtn btn_style">저장</button>'
// 	 _html+='                           <button for="imgRegPop" class="bpopClose">취소</button><!--  tabindex="5" -->'
	 _html+='                       </td>'
	 _html+='                   </tr>'
	 _html+='               </table>'

	 _html+='       </div>'
	$("#popupWrap").dialog("close").html(_html).dialog({
		title : '이미지 사진 정보',
	    width: 530,
		height: 350,
		position: {
			my: "left top",
			at: "left+500 top",
			of: $("#map")
		},
		open: function(){
		},
		close: function(){

		}
	}).dialog("open");
	 bindEventSaveBtn();
	 bindEventBtnUpload();
});
/**
 * 이미지 등록 > 파일첨부
 */
function bindEventBtnUpload(){
	$("#imgRegPop").find(".btn-upload").click(function() {
	    $(this).parent().find("#hiddenForm").find(".uploadImg").click();
	});
}

/**
 * 이미지 등록 > 저장
 */
function bindEventSaveBtn(){
	$('#imgRegPop').find(".saveBtn").click(function() {
		var imgDesc =$('#imgRegPop').find("#imgDesc").val();
		if(imgDesc.trim() == ""){
			alert("이미지 이름을 입력하여 주십시오.");
			return false;
		}

		var nm =$('#imgRegPop').find(".uploadImg").val();
		if(nm != ""){
			if(confirm("선택하신 파일을 저장 하시겠습니까?")){
				_common.formSubmit("/tvius/addFileOfImgRqst.json",$('#imgRegPop').find("#hiddenForm"), function(json){
		        	if(json.realNm !== undefined && json.uploadNm !== undefined){
		        		//var imgMgrSeq = createSeqNum();
		        		var _param = {};
		            	//_param['mgrSeq'] = imgMgrSeq;
		            	_param['imgDesc'] = imgDesc;
		            	_param['imgNm'] = json.uploadNm;
		            	_param['imgPath'] = json.realNm;

		            	_common.callAjax("/tvius/addCrmsImg.json", _param, function(json) {
		    				if (json.result){
		    					alert('저장되었습니다.');
		    					$("#popupWrap").empty();
		    					$("#popupWrap").dialog("close");
		    					$('#imgRegPop').find("#imgNm").val('');
		    					$('#imgRegPop').find("#imgDesc").val('');
		    					if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
		    					     // ie일 경우
		    						$('#imgRegPop').find("#uploadImg").replaceWith($("#imgRegPop").find("#uploadImg").clone(true));
		    					}else{
		    					     // ie가 아닐 경우
		    						$('#imgRegPop').find("#uploadImg").val('');
		    					}
		    				}else {
		    					alert('* An error has occurred.');
		    				}
		    			});
		            }
		        });
				$(this).val("");
			}

		}else{
			alert('이미지를 선택하여 주십시오.');
		}
	});
}
$(".contentWrapper").find(".openRqstPop").click(function() {

// 	emptyRqstPop();

// 	setRqstBtn(".editBtn");
// 	$(".contentWrapper").find('#imgRqstPop').bPopup({
//         appendTo: $(".contentWrapper"),
//         onOpen : function(){
//         	setSelectImg();
//         }
//     });
	emptyRqstPop();
	setRqstBtn(".editBtn");




	$("#imgRqstPop").dialog("close").dialog({
		title : '이미지 사진 정보',
	    width: 400,
		height: 445,
		position: {
			my: "left top",
			at: "left+500 top",
			of: $("#map")
		},
		open: function(){
			setSelectImg();
		},
		close: function(){

		}
	}).dialog("open");

});

function setRqstBtn(target){
	$(".contentWrapper").find('#imgRqstPop').find(".saveBtn").removeClass('hidden');
	$(".contentWrapper").find('#imgRqstPop').find(".editBtn").removeClass('hidden');
	$(".contentWrapper").find('#imgRqstPop').find(target).addClass('hidden');
}

$(".contentWrapper").find(".btn-getdoc").click(function() {
	$(".contentWrapper").find("#official_doc_pop").bPopup({
		appendTo: $(".contentWrapper"),
		onClose: function() {}
	}).reposition();
});

$(".contentWrapper").find("#official_doc_pop").find("#docSearchBtn").click(function(e) {

	var _docParam = _common.utils.collectSendData(".contentWrapper #officialDocParam");

	if(_docParam['officialDocNo'] != "") _docParam['docNo'] = _docParam['officialDocNo'];
	if(_docParam['docStartDat'] != "") _docParam['startDat'] = _docParam['docStartDat'].replace(/\-/gi, '') + '000000';
	if(_docParam['docEndDat'] != "")_docParam['endDat'] = _docParam['docEndDat'].replace(/\-/gi, '') + '235959';
	_docParam['userId'] = userId;

	delete _docParam['officialDocNo'];
	delete _docParam['docStartDat'];
	delete _docParam['docEndDat'];

	_common.callAjax("/tvius/getCrmsOfficialDocList.json", _docParam, function(json) {
		if(json.result){
			$(".contentWrapper").find('#docSearchResult').html('');
			for(var i=0; i<json.result.length; i++){
				var str = '';
				str += '<tr>';
				str += '	<td>';
				str += '		<input type="radio" name="doclist" mgrNo="'+json.result[i].mgrSeq+'" nm="'+json.result[i].docFileNm+'" path="'+json.result[i].docFilePath+'"/><span>' + json.result[i].docFileNm+'</span>';
				str += '	</td>';
				str += '</tr>';
				var $tr = $(str);
				$tr.find('span').click(function(){
					$(this).prev().click();
				});
				$(".contentWrapper").find('#docSearchResult').append($tr);
			}
		}
	});
});

$(".contentWrapper").find("#official_doc_pop").find("#btnDocSave").click(function(e) {
	var selectedItem =$(".contentWrapper").find("#official_doc_pop").find(':radio[name="doclist"]:checked');
	var nm = selectedItem.attr('nm');
	var path = selectedItem.attr('path');
	var ofclMgrNo = selectedItem.attr('mgrNo');

	if(nm && path && ofclMgrNo){
		alert('선택되었습니다.');

		/* <input type="text" id="docNo">
		<input type="text" class="docFileNm" style="width: 280px !important;" readonly="readonly"/> */


		$(".contentWrapper").find("#docFileNm").val(nm);
		$(".contentWrapper").find("#docFilePath").val(path);
		$(".contentWrapper").find("#ofclMgrNo").val(ofclMgrNo);
		$(".contentWrapper").find('#docSearchResult').html('');
		$(".contentWrapper").find("#official_doc_pop").bPopup().close();
	} else {
		alert('공문을 선택하여 주십시오.');
	}

});

$(".contentWrapper").find("#official_doc_pop").find("#official_doc_close").click(function(e) {
	$(".contentWrapper").find("#official_doc_pop").bPopup().close();
});


$(".contentWrapper").find(".uploadImg").on("change", function(){
    var nm = $(this).val();
    if(nm != ""){
        var arr = nm.split("\\");

        var pop = $(this).attr("pop");
        var target = $(this).attr("target");
       $(".contentWrapper").find('#'+pop).find('.'+target).val(arr[arr.length-1]);
    }
});

$(".contentWrapper").find(".bpopClose").click(function() {
    var target = $(this).attr("for");
   $(".contentWrapper").find('#'+target).bPopup().close();
});


$(".contentWrapper").find('#imgRegPop').find(".saveBtn").click(function() {
	var imgDesc =$(".contentWrapper").find('#imgRegPop').find("#imgDesc").val();
	if(imgDesc.trim() == ""){
		alert("이미지 이름을 입력하여 주십시오.");
		return false;
	}

	var nm =$(".contentWrapper").find('#imgRegPop').find(".uploadImg").val();
	if(nm != ""){
		confirm("선택하신 파일을 저장 하시겠습니까?", function(){
	        _common.formSubmit("/tvius/addFileOfImgRqst.json",$(".contentWrapper").find('#imgRegPop').find("#hiddenForm"), function(json){
	        	if(json.realNm !== undefined && json.uploadNm !== undefined){
	        		//var imgMgrSeq = createSeqNum();
	        		var _param = {};
	            	//_param['mgrSeq'] = imgMgrSeq;
	            	_param['imgDesc'] = imgDesc;
	            	_param['imgNm'] = json.uploadNm;
	            	_param['imgPath'] = json.realNm;

	            	_common.callAjax("/tvius/addCrmsImg.json", _param, function(json) {
	    				if (json.result){
	    					alert('저장되었습니다.');
	    					$(".contentWrapper").find('#imgRegPop').bPopup().close();
	    					$(".contentWrapper").find('#imgRegPop').find("#imgNm").val('');
	    					$(".contentWrapper").find('#imgRegPop').find("#imgDesc").val('');
	    					if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
	    					     // ie일 경우
	    						$(".contentWrapper").find('#imgRegPop').find("#uploadImg").replaceWith($(".contentWrapper").find("#imgRegPop").find("#uploadImg").clone(true));
	    					}else{
	    					     // ie가 아닐 경우
	    						$(".contentWrapper").find('#imgRegPop').find("#uploadImg").val('');
	    					}
	    				}else {
	    					alert('* An error has occurred.');
	    				}
	    			});
	            }
	        });
	    }, function(){
	        $(this).val("");
	    });
	}else{
		alert('이미지를 선택하여 주십시오.');
	}
});

$(".contentWrapper").find('#imgRqstPop').find("#btn_img_sch").click(function() {
	var startDat =$(".contentWrapper").find('#imgRqstPop').find('#imgStartDat').val().trim().replace(/\-/g,'');
	var endDat =$(".contentWrapper").find('#imgRqstPop').find('#imgEndDat').val().trim().replace(/\-/g,'');

	var _param ={};
	_param['imgNm'] =$(".contentWrapper").find('#imgRqstPop').find('#imgNm').val();
	if(startDat != "") _param['startDat'] = startDat+'000000';
	if(endDat != "") _param['endDat'] = endDat+'235959';

	setSelectImg(_param);
});

$(".contentWrapper").find('#imgRqstPop').find(".saveBtn").click(function() {
	var docNo =$(".contentWrapper").find('#imgRqstPop').find("#docNo").val();
	if(docNo.trim() == ""){
		alert("공문번호를 입력하여 주십시오.");
		return false;
	}

	var docFileNm =$(".contentWrapper").find('#imgRqstPop').find("#docFileNm").val();
	if(docFileNm.trim() == ""){
		alert("공문을 선택하여 주십시오.");
		return false;
	}

	var docFilePath =$(".contentWrapper").find('#imgRqstPop').find("#docFilePath").val();
	if(docFilePath.trim() == ""){
		alert("공문을 선택하여 주십시오.");
		return false;
	}

	var ofclMgrNo =$(".contentWrapper").find('#imgRqstPop').find("#ofclMgrNo").val();

	var reqstDetail =$(".contentWrapper").find('#imgRqstPop').find("#reqstDetail").val();
	if(reqstDetail.trim() == ""){
		alert("신청내용을 입력하여 주십시오.");
		return false;
	}

	var imgJoin = new Array();
	$(".contentWrapper").find('#imgRqstPop').find('.imgChk').each(function(){
		if($(this).is(":checked")) imgJoin.push($(this).attr("mgrseq"));
	});

	if(imgJoin.length == 0){
		alert("이미지를 선택하여 주십시오.");
		return false;
	}
	imgJoin.sort();

	var mgrSeq = createSeqNum();

	var nm =$(".contentWrapper").find('#imgRqstPop').find(".uploadImg").val();
	if(nm != ""){
		confirm("이미지 반출을 신청하시겠습니까?", function(){

			//1.공문등록
       		var _param = {};
           	_param['mgrSeq'] = mgrSeq;
           	_param['reqstDetail'] = reqstDetail;
           	_param['docNo'] = docNo;
           	_param['docFileNm'] = docFileNm;
           	_param['docFilePath'] = docFilePath;
           	_param['ofclMgrNo'] = ofclMgrNo;

           	//2.imgRqst 등록
           	_common.callAjax("/tvius/addCrmsImgRqst.json", _param, function(json) {
   				if (json.result){
   					//3.imgJoin 등록
   					var workChk =0;
   					for(var i=0; i<imgJoin.length; i++){
   						var _joinParam = {};
   						_joinParam['rqstMgrSeq'] = mgrSeq;
   						_joinParam['imgMgrSeq'] = imgJoin[i];
   						_common.callAjax("/tvius/addCrmsImgJoin.json", _joinParam, function(json) {
   							if (!json.result){
    							alert('* An error has occurred.(join)');
    						}else{
    							workChk++;
    						}
    					}, false);
   					}

   					if(workChk == imgJoin.length){
   						alert('저장되었습니다.');
   						$(".contentWrapper").find('#imgRqstPop').bPopup().close();
   						$(".contentWrapper").find(".bpopup").remove();
   						$(".contentWrapper").find(".tviusPopup").remove();
   						var _param = {};
   					    _param['reqstId'] = userId;
   					    _param['limit'] = '10';
   						callView(0);
   					}else{
   						alert('* An error has occurred.(join chk)');
   					}
   				}else {
   					alert('* An error has occurred.(rqst)');
   				}
   			});


			/* //1.공문등록
			_common.formSubmit("/tvius/addDocFile.json",$(".contentWrapper").find('#imgRqstPop').find("#hiddenForm"), function(json){
	        	if(json.realNm !== undefined && json.uploadNm !== undefined){
	        		var _param = {};
	            	_param['mgrSeq'] = mgrSeq;
	            	_param['reqstDetail'] = reqstDetail;
	            	_param['docNo'] = docNo;
	            	_param['docFileNm'] = json.uploadNm;
	            	_param['docFilePath'] = json.realNm;

	            	//2.imgRqst 등록
	            	_common.callAjax("/tvius/addCrmsImgRqst.json", _param, function(json) {
	    				if (json.result){
	    					//3.imgJoin 등록
	    					var workChk =0;
	    					for(var i=0; i<imgJoin.length; i++){
	    						var _joinParam = {};
	    						_joinParam['rqstMgrSeq'] = mgrSeq;
	    						_joinParam['imgMgrSeq'] = imgJoin[i];
	    						_common.callAjax("/tvius/addCrmsImgJoin.json", _joinParam, function(json) {
	    							if (!json.result){
		    							alert('* An error has occurred.(join)');
		    						}else{
		    							workChk++;
		    						}
		    					}, false);
	    					}

	    					if(workChk == imgJoin.length){
	    						alert('저장되었습니다.');
	    						$(".contentWrapper").find('#imgRqstPop').bPopup().close();
	    						$(".contentWrapper").find(".bpopup").remove();
	    						var _param = {};
	    					    _param['reqstId'] = userId;
	    					    _param['limit'] = '10';
	    						callView(0);
	    					}else{
	    						alert('* An error has occurred.(join chk)');
	    					}
	    				}else {
	    					alert('* An error has occurred.(rqst)');
	    				}
	    			});
	            }else {
	            	alert('* An error has occurred.(doc)');
	            }
	        }); */
	    }, function(){
	        //$(this).val("");
	    });
	}else{
		alert('이미지를 선택하여 주십시오.');
	}
});

$(".contentWrapper").find('#imgRqstPop').find(".editBtn").click(function() {
	var docNo =$(".contentWrapper").find('#imgRqstPop').find("#docNo").val();
	if(docNo.trim() == ""){
		alert("공문번호를 입력하여 주십시오.");
		return false;
	}

	var reqstDetail =$(".contentWrapper").find('#imgRqstPop').find("#reqstDetail").val();
	if(reqstDetail.trim() == ""){
		alert("신청내용을 입력하여 주십시오.");
		return false;
	}

	var imgJoin = new Array();
	$(".contentWrapper").find('#imgRqstPop').find('.imgChk').each(function(){
		if($(this).is(":checked")) imgJoin.push($(this).attr("mgrseq"));
	});

	if(imgJoin.length == 0){
		alert("이미지를 선택하여 주십시오.");
		return false;
	}
	imgJoin.sort();

	var mgrSeq = $(this).attr("mgrseq");

	var docFileNm = '';
	var docFilePath = '';

	var workChk = true;

	//1.공문수정
	var nm =$(".contentWrapper").find('#imgRqstPop').find(".uploadImg").val();
	if(nm != ""){
		_common.formSubmit("/tvius/addDocFile.json",$(".contentWrapper").find('#imgRqstPop').find("#hiddenForm"), function(json){
        	if(json.realNm !== undefined && json.uploadNm !== undefined){
        		docFileNm = json.uploadNm;
            	docFilePath = json.realNm;

            }else {
            	alert('* An error has occurred.(doc)');
            	workChk = false;
            }
        }, false);
	}


	if(workChk){
		//2.join 삭제
		_common.callAjax("/tvius/delAllCrmsImgJoin.json", {'rqstMgrSeq': mgrSeq}, function(json) {
			if(json.result){
				//3.rqst 수정
				var _param = {};
            	_param['mgrSeq'] = mgrSeq;
            	_param['reqstDetail'] = reqstDetail;
            	_param['docNo'] = docNo;
            	_param['docFileNm'] = docFileNm;
            	_param['docFilePath'] = docFilePath;

				_common.callAjax("/tvius/editCrmsImgRqst.json", _param, function(json) {
					if (json.result){
						//3.imgJoin 등록
						var workChk =0;
						for(var i=0; i<imgJoin.length; i++){
							var _joinParam = {};
							_joinParam['rqstMgrSeq'] = mgrSeq;
							_joinParam['imgMgrSeq'] = imgJoin[i];
							_common.callAjax("/tvius/addCrmsImgJoin.json", _joinParam, function(json) {
								if (!json.result){
									alert('* An error has occurred.(join)');
								}else{
									workChk++;
								}
							}, false);
						}

						if(workChk == imgJoin.length){
							alert('수정되었습니다.');
							$(".contentWrapper").find('#imgRqstPop').bPopup().close();
							$(".contentWrapper").find(".bpopup").remove();
							var _param = {};
						    _param['reqstId'] = userId;
						    _param['limit'] = '10';
							callView(0);
						}else{
							alert('* An error has occurred.(join chk)');
						}
					}else {
						alert('* An error has occurred.(rqst)');
					}
				});
			}
		});
	}
});


function setSelectImg(_param){
	$(".contentWrapper").find('#imgRqstPop').find("#selectImg").find('#selectImgList').html('');

	if(_param === undefined){
        _param = {};
    }
	_param['regId'] = userId;

	_common.callAjax("/tvius/getCrmsImgList.json", _param, function(json) {
		if(json.result){
			var _html = "";

			for(var i=0; i<json.result.length; i++){
				/* var desc = json.result[i].imgDesc;
				if(desc.length > 10) desc = desc.substring(0,10) + '...'; */

				_html += '<tr>';
				_html += '	<td>';
				_html += '		<input type="checkbox" class="imgChk" mgrseq="'+json.result[i].mgrSeq+'">';
				_html += '	</td>';
				_html += '	<td>';
				//_html += '		<span>'+json.result[i].imgNm+'</span>';
				_html += '		<div title="'+json.result[i].imgNm+'" style="display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 105px; padding-top: 3px;">';
				_html += '			'+json.result[i].imgNm;
				_html += '		</div>';
				_html += '	</td>';
				_html += '	<td>';
				_html += '		<span>'+Date.prototype.formatDate(json.result[i].regDat.substring(0,8))+'</span>';
				_html += '	</td>';
				/* _html += '	<td>';
				_html += '		<span class="descSpan" title="'+json.result[i].imgDesc+'">'+desc+'</span>';
				_html += '	</td>'; */
				_html += '	<td>';
				_html += '		<div title="'+json.result[i].imgDesc+'" style="display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 105px; padding-top: 3px;">';
				_html += '			'+json.result[i].imgDesc;
				_html += '		</div>';
				_html += '	</td>';

				_html += '</tr>';
			}

			$(".contentWrapper").find('#imgRqstPop').find("#selectImg").find('#selectImgList').html(_html);

			$(".contentWrapper").find('#imgRqstPop').find("#selectImg").find('#selectImgList').find('tr').click(function(){
				$(this).find('input[type=checkbox]').click()
			});

			//setTooltip(".descSpan", 'imgRqstPop');
		}
	}, false);
}

function createSeqNum(){
	var baseTimestamp = 1000 * 60 * 60 * 24 * 365 * 40;
	var currentTimeMillis = new Date().getTime();
	var SerialNumGenPrev = currentTimeMillis - baseTimestamp;

	return SerialNumGenPrev;
}

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

$(".contentWrapper").find('.rqst_dtv').click(function(){
	var mgrSeq = $(this).attr("mgrseq");

	_common.callAjax("/tvius/getCrmsImgRqstInfo.json", {'mgrSeq': mgrSeq}, function(json) {
		if(json.result){
			$(".contentWrapper").find('#imgRqstPop').find("#docNo").val(json.result[0].docNo);
			$(".contentWrapper").find('#imgRqstPop').find(".docFileNm").val(json.result[0].docFileNm);
			$(".contentWrapper").find('#imgRqstPop').find("#reqstDetail").val(json.result[0].reqstDetail);
			$(".contentWrapper").find('#imgRqstPop').find('.editBtn').attr("mgrseq", json.result[0].mgrSeq);
		}
	},false);

	var imgMgrSeq = new Array();
	_common.callAjax("/tvius/getImgListOfImgRqst.json", {'rqstMgrSeq': mgrSeq}, function(json) {
		if(json.result){
	    	for(var i=0; i<json.result.length; i++){
	    		imgMgrSeq.push(json.result[i].mgrSeq);
	    	}
		}
	},false);

	setRqstBtn(".saveBtn");

	$(".contentWrapper").find('#imgRqstPop').bPopup({
	    appendTo: $(".contentWrapper"),
	    onOpen : function(){
	    	setSelectImg();
	    	//체크하는 로직 필요.
	    	$(".contentWrapper").find('#imgRqstPop').find('.imgChk').each(function(){
	    		if($.inArray($(this).attr("mgrseq"), imgMgrSeq) != -1){
	    			$(this).prop("checked", true);
    			}
	    	});
	    }
	});


});

function emptyRqstPop(){
	$(".contentWrapper").find('#imgRqstPop').find("#docNo").val('');
	$(".contentWrapper").find('#imgRqstPop').find(".docFileNm").val('');
	$(".contentWrapper").find('#imgRqstPop').find("#reqstDetail").val('');

	$(".contentWrapper").find('#imgRqstPop').find("#imgNm").val('');
	$(".contentWrapper").find('#imgRqstPop').find("#imgStartDat").val('');
	$(".contentWrapper").find('#imgRqstPop').find("#imgEndDat").val('');

	if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
	     // ie일 경우
		$(".contentWrapper").find('#imgRqstPop').find("#uploadImg").replaceWith($(".contentWrapper").find("#imgRqstPop").find("#uploadImg").clone(true));
	}else{
	     // ie가 아닐 경우
		$(".contentWrapper").find('#imgRqstPop').find("#uploadImg").val('');
	}
}
</script>
<style>
.bpopup {
    display: none;
    border: 5px solid #222c38;
    background: #222c38;
    width: 550px;
}

.bpopup button {
    background: #4C535C;
    border: 0px;
    font-size: 13px;
    padding: 7px 25px;
    color: white;
    cursor: pointer;
}

#bpop_wrap {
    padding: 0 10px;
}
#bpop_wrap h2 {
    text-align: center;
    font-size: 14px;
    margin: 20px 0px;
    color: white;
}
#bpop_wrap table {
    /* border-spacing: 0; */
    border-spacing: 1px;
    width: 530px;
}
#bpop_wrap table tr .top {
    text-align: right;
    font-size: 13px;
    /* padding: 20px 15px 20px 15px; */
    padding: 15px;
    background-color: #35404C;
    color: white;
    width: 85px;
    white-space: nowrap;
}
#bpop_wrap table tr th {
    width: 35%;
}
#bpop_wrap table tr td {
    border-bottom: 1px solid #D5D5D5;
    border-right: 1px solid #D5D5D5;
    /* background: #D5D5D5; */
    background: white;
    padding-left: 10px;
}
#bpop_wrap table tr td.lastTd {
    background: #222c38;
}
#bpop_wrap table tr .bottom {
    text-align: right;
    font-size: 13px;
    padding: 150px 15px 150px 73px;
    background-color: #35404C;
    color: white;
}
#bpop_wrap input {
    height: 25px;
    width: 95%;
    /* background: #D5D5D5; */
    background: white;
    padding-left: 5px;
}
#bpop_wrap input, textarea {
    border: 0;
}
#bpop_wrap select {
    height: 25px;
    width: 95%;
    border: 0;
    /* background: #D5D5D5; */
    background: white;
}
#bpop_wrap table tr td button {
    margin: 10px 0px;
}

#bpop_wrap #popImgList{
    border-spacing: 1px;
    width: 400px !important;
    display: block;
}

#bpop_wrap #popImgList tr th:first-child {
    width: 50px;
}

#bpop_wrap #popImgList tr th {
    width: 100px;
    height: 25px;
    background: #f3f3f3;
    color: #666;
    font-size: 15px;
    font-weight: 100 !important;
}

#bpop_wrap #popImgList tr td:first-child {
    width: 25px;
}

#bpop_wrap #popImgList tr td {
    width: 106px;
    font-size: 13px;
    font-weight: 100 !important;
    border-right: none;
    word-break: break-all;
}

#bpop_wrap #popImgList tr td .imgChk {
    width: 15px;
}

#bpop_wrap #popImgList #selectImgList {
    height: 245px !important;
    position: relative;
    display: block;
    overflow: auto;
}

</style>
<div id="searchBox">

    <!-- _param['reqstId'] = userId;
        _param['useRsCdNullChk'] = 'Y';
        _param['procStatCd'] = 'SK';
        _param['limit'] = '10';
        _param['offset'] = '0'; -->

    <%-- <input type="hidden" id="procStatCd" value="<%= procStatCd %>" /> --%>

    <!-- <div class="searchWrapper searchList"> -->
    <!-- <div class="searchWrapper"> -->
    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">

    	<input type="hidden" id="offset" value="<%= offset %>" />
    	<input type="hidden" id="max" value="<%= max%>" />
    	<input type="hidden" id="userId" value="<%= userId %>" />
    	<input type="hidden" id="limit" value="<%= limit%>" />

<!--         <p class="searchTitle">이미지반출신청현황</p> -->
        <div id="menu_bar">

            <!-- <div class="top_right" style="width:auto; float: right;">
                <button class="openRegPop btn_style2" style="height: 32px;">이미지 등록</button>
                &nbsp; &nbsp; &nbsp;
                <button class="openRqstPop btn_style2" style="height: 32px;">이미지 반출신청</button>
                &nbsp; &nbsp; &nbsp;
            </div> -->
            <%-- <div class="sch_bar">
                <label>처리상태:</label>
                <select id="procStatCd" class="tviusSelect" style="height:24px; width:82px;  vertical-align: middle;">
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
                &nbsp;

                <label for="crimeTyp">범죄유형:</label>

                <label>신청기간:</label>
                <input type="text" id="startDat" class="datePicker" size="12" style="width: 100px; vertical-align: middle; background-color: white;" readonly="readonly"><!-- button class="ico_cal"></button-->
                ~
                <input type="text" id="endDat" class="datePicker" size="12" style="width: 100px; vertical-align: middle; background-color: white;" readonly="readonly"><!-- button class="ico_cal"></button-->

                &nbsp;

                <button id="btn_sch" class="btn_style2">조회</button> &nbsp; &nbsp; &nbsp; 총 <%=max%>건이 조회되었습니다.

            </div> --%>
        </div>

        <table>
            <colgroup>
                <col width="140" />
                <col width="140" />
                <col width="140" />
                <col width="140" />
                <col width="" />
                <col width="140" />
                <col width="160" />
                <col width="140" />
                <col width="140" />
                <col width="140" />
            </colgroup>
<%
	String url = "/tvius/getUsrTviusImageView.do";
%>
            <tr>
                <th><span id='rqst.mgr_seq' class='mngSortBtn' url='<%=url%>'>신청번호</span></th>
                <th><span id='rqst.reqst_id' class='mngSortBtn' url='<%=url%>'>신청자ID</span></th>
                <th><span id='reqst_usr_nm' class='mngSortBtn' url='<%=url%>'>신청자</span></th>
                <th><span id='rqst.reqst_dat' class='mngSortBtn' url='<%=url%>'>신청일</span></th>
                <th><span id='rqst.reqst_detail' class='mngSortBtn' url='<%=url%>'>신청내용</span></th>
                <th><span id='rqst.doc_no' class='mngSortBtn' url='<%=url%>'>공문번호</span></th>
                <th><span id='rqst.doc_file_nm' class='mngSortBtn' url='<%=url%>'>공문파일</span></th>
                <th><span id='rqst.acpt_dat' class='mngSortBtn' url='<%=url%>'>승인일</span></th>
                <th><span id='proc_stat_cd_rel_cde_nm' class='mngSortBtn' url='<%=url%>'>처리상태</span></th>
                <th><span>상세보기</span></th>
            </tr>
            <%
             if (list.size() == 0){
            %>
            <tr>
                <td colspan="10" align="center" style="height: 100px;">데이터가 존재하지 않습니다.</td>
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
                            <div <% if ( "SD".equals(list.get(i).getProcStatCd()) ) out.print(" class=\"tool rejt_cont\" cont=\""+list.get(i).getRejtResn()+"\"  title=\""+list.get(i).getRejtResn().replaceAll("\n","<br>")+"\" "); %> style="margin-top: 5px;">
                                <label class="result_text"><%=procStatCdMap.get(list.get(i).getProcStatCd())%></label>
                            </div>
                        </li>
                    </ul>
                </td>
                <td class="tCenter">
                    <button class="imgList grayBtn btn_style2" style="height: 32px;" mgrseq="<%=list.get(i).getMgrSeq()%>" stat="<%=list.get(i).getProcStatCd()%>">이미지목록</button>
                </td>
            </tr>
            <%
                  }
             }
            %>
        </table>

        <div class="paging_wrap" style="display: block;"></div>

        <div id="imgListView" class="hidden">
            <p class="searchTitle">이미지목록</p>
            <table>
                <thead>
                    <tr>
                        <th width="140">이미지 등록번호</th>
                        <th width="200">등록일</th>
                        <th width="140">이미지설명</th>
                        <th width="">파일명</th>
                    </tr>
                </thead>
                <tbody id="imgList">
                </tbody>
            </table>

        </div>

    </div>

</div>
