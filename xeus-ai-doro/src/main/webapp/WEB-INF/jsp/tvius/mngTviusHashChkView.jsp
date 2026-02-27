<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%> --%>
<%-- <%@ page import="geomex.xeus.util.code.CodeConvertor"%> --%>
<%@ page import="java.util.HashMap"%>
<%@ include file="../common.jsp"%>
<%
    /* HashMap<String, String> sysParam = (HashMap<String, String>)request.getAttribute("sysparam");
    String maskingYn = sysParam.get("masking_yn");
    HashMap<String, String> rst = (HashMap<String, String>)request.getAttribute("result"); */
%>
<%-- <script type="text/javascript" src="<%= context %>/res/geomex.xeus.tvius.usr.rqst.js"></script> --%>
<script type="text/javascript">

$(document).ready(function(){
	resizeDone();
});

var timer = null;
var delta = 300;
$(window).resize(function(){

	clearTimeout( timer );
    timer = setTimeout( resizeDone, delta );
});

function resizeDone() {
	$(".contentWrapper").find("#loading_wrap").width($(".contentWrapper").width());
	$(".contentWrapper").find("#loading_wrap").height($(".contentWrapper").height());

// 	$(".contentWrapper").find('#searchBox').css('height', $(window).height()-$('#layout-north').height()-$(".contentWrapper").find('#overlay-west-bar').height());
}

var spinner = null;
var spinnerOpts = {
      lines: 13 // The number of lines to draw
    , length: 26 // The length of each line
    , width: 16 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#4582ac' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
}

function showSpinner(){
    var width = $(".contentWrapper").width();
    var height = $(".contentWrapper").height();
    $(".contentWrapper").find("#loading_wrap").width(width);
    $(".contentWrapper").find("#loading_wrap").height(height);

    var target = $(".contentWrapper").find('#loading_img')[0];
    spinner = new Spinner(spinnerOpts).spin(target);
    $(".contentWrapper").find('#loading_wrap').show();

}

function hideSpinner(){

    $(".contentWrapper").find('#loading_wrap').hide();

}

$(".contentWrapper").find("#searchPanel").find("#btn-upload").click(function(e) {

	if($(".contentWrapper").find('.certificate').length > 10){
		alert('해시코드 조회는 최대 10건까지 가능합니다.');
		return false;
	}
    $(".contentWrapper").find("#hiddenForm").find("#uploadVideo").click();

});

/* 상위 "파일 첨부" 버튼을 통해 실제 이미지 선택시 업로드 이벤트 입니다. */
$(".contentWrapper").find("#hiddenForm").find("#uploadVideo").on("change", function(){
    var nm = $(this).val();
    if(nm != ""){
		var workChk = true;
        $(".contentWrapper").find('.certificate').each(function(){
            if(nm.split("\\").pop() == $(this).find('.content').find('span').text()){
        		alert('이미 인증서 출력 리스트에 등록된 파일입니다.');
        		workChk = false;
        		return false;
            }
        });

        if(workChk){
        	if(confirm("선택하신 파일을 업로드 하시겠습니까?")){
                showSpinner();

                _common.formSubmit("/tvius/hashChk.json", $(".contentWrapper").find("#hiddenForm"), function(json){
                	//입력된 비밀번호를 넣는다.
                	//비밀번호 사용시 주석 해제
                	//$(".contentWrapper").find('#hiddenForm').find('p').val($(".contentWrapper").find('#searchPanel').find('#password').val().trim());

                	hideSpinner();
                	$(".contentWrapper").find("#hiddenForm").find("#uploadVideo").val('');

                    if(json.result){
    					//업로드 파일명 input file태그에 입력
                        /* if(json.uploadNm !== undefined) $(".contentWrapper").find("#searchPanel").find('#uploadFileNm').val(json.uploadNm); */


    					//결과 테이블에 조회 결과 추가
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#rqstMgrSeq').text(json.workInfo.rqstMgrSeq);
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#cctv').text(json.workInfo.cctvNm+"("+json.workInfo.modelNm+")");
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#reqstId').text(json.workInfo.reqstId);
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#reqstDat').text(Date.prototype.formatYMDHMS(json.workInfo.reqstDat));
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#acptUserId').text(json.workInfo.acptUserId);
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#acptDat').text(Date.prototype.formatYMDHMS(json.workInfo.acptDat));
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#uploadNm').text(json.uploadNm);
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#uploadFileSize').text(numberWithCommas(json.uploadFileSize)+" byte");
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#fileNm').text(json.workInfo.fileNm.split("/")[1]);
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#fileSize').text(numberWithCommas(json.uploadFileSize)+" byte");
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#secStDat').text(Date.prototype.formatYMDHMS(json.workInfo.secStDat));
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#secEdDat').text(Date.prototype.formatYMDHMS(json.workInfo.secEdDat));
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#playLimitCnt').text(json.workInfo.playLimitCnt);
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#playLimitDat').text(json.workInfo.playLimitDat);
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#shaCde').text(addStrToIndex(json.workInfo.shaCde, '\r\n', 32));
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#md5Cde').text(json.workInfo.md5Cde);

                        /* var _str = "<img width='480px' alt='"+json.uploadNm+"' src='../tvius/getThumbnail.do?fileNm="+json.thumbnail+"' onerror='this.src=\"../res/img/no_img.png\"'>";
                        $(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#imgTd').html(_str); */

                        //변수를 또 사용하기 위해 초기화
                        _str = '';
                        //왼쪽 리스트 패널에 표시될 항목 추가
                        _str += "<div class='certificate' active='active'>";
//                         _str += "   <div class='topMenu'>";
//                         _str += "       <span>X</span>";
//                         _str += "   </div>";
                        _str += "   <div class='content'>";
                        _str += "   	<span title='"+json.uploadNm+"'><nobr>"+json.uploadNm+"</nobr></span>";
                        _str += "   </div>";
                        _str += "</div>";

                        var $item = $(_str);
                        //div에 포함될 정보를 data
                        var prop = {
    							rqstMgrSeq : json.workInfo.rqstMgrSeq,
    							reqstId : json.workInfo.reqstId,
    							reqstDat : json.workInfo.reqstDat,
    							acptUserId : json.workInfo.acptUserId,
    							acptDat : json.workInfo.acptDat,
    							uploadNm : json.uploadNm,
    							uploadFileSize : json.uploadFileSize,	//원본사이즈는 업로드사이즈로 같이 씀
    							fileNm : json.workInfo.fileNm.split("/")[1],
    							secStDat : json.workInfo.secStDat,
    							secEdDat : json.workInfo.secEdDat,
    							cctvMgrNo : json.workInfo.cctvMgrNo,
    							cctvNm : json.workInfo.cctvNm,
    						    modelNm : json.workInfo.modelNm,
    							shaCde : json.workInfo.shaCde,
    							md5Cde : json.workInfo.md5Cde
    						};

                        $item.data(prop);
                        $(".contentWrapper").find('.certificate').removeAttr("active");
    					$(".contentWrapper").find('#listPanel').append($item);

    					//중복으로 걸리는것을 막기 위해서 click이벤트 off
    					$(".contentWrapper").find('.certificate').find('.topMenu').find('span').off('click');
    					//이벤트 추가
    					$(".contentWrapper").find('.certificate').find('.topMenu').find('span').click(function(){
    					    $this = $(this).closest('.certificate');
    					    $this.animate({
    					        height: '0px'
    					    }, 500, function(){$this.remove();});
    					});

    					//리스트의 파일명 클릭 시 인증 정보를 교체한다.
    					//단, 썸네일은 제공하지 않는다.
    					$(".contentWrapper").find('.certificate').find('.content').find('span').off('click');
    					$(".contentWrapper").find('.certificate').find('.content').find('span').click(function(){
    						if($(this).closest('.certificate').attr("active") != "active"){
    							var _data = $(this).closest('.certificate').data();

        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#rqstMgrSeq').text(_data.rqstMgrSeq);
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#cctv').text(_data.cctvNm+"("+_data.modelNm+")");
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#reqstId').text(_data.reqstId);
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#reqstDat').text(Date.prototype.formatYMDHMS(_data.reqstDat));
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#acptUserId').text(_data.acptUserId);
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#acptDat').text(Date.prototype.formatYMDHMS(_data.acptDat));
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#uploadNm').text(_data.uploadNm);
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#uploadFileSize').text(numberWithCommas(_data.uploadFileSize)+" byte");
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#fileNm').text(_data.fileNm.split("/")[1]);
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#fileSize').text(numberWithCommas(_data.uploadFileSize)+" byte");
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#secStDat').text(Date.prototype.formatYMDHMS(_data.secStDat));
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#secEdDat').text(Date.prototype.formatYMDHMS(_data.secEdDat));
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#playLimitCnt').text(_data.playLimitCnt);
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#playLimitDat').text(_data.playLimitDat);
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#shaCde').text(addStrToIndex(_data.shaCde, '\r\n', 32));
        						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#md5Cde').text(_data.md5Cde);
//         						$(".contentWrapper").find('#resultDiv').find('#resultTbody').find('#imgTd').html('');
    						}
    					});

    					$(this).val("");
                    } else {
                        alert(json.msg);
                    }
                }, false);
            };
        }
    }
});

$(".contentWrapper").find("#searchPanel").find("#btn-print").click(function(e) {

	//10개인건 이전 로직에서 체크하지만 혹시 모르니 한번 더 체크한다.
	if($(".contentWrapper").find('.certificate').length == 0){
		alert('적어도 한 개의 조회 건이 필요합니다.');
		return false;
	}

	if($(".contentWrapper").find('.certificate').length > 10){
		alert('인증서 출력은 최대 10건까지 가능합니다.');
		return false;
	}
	//TODO do something!!
	var rstArray = new Array();

	rstArray.push();

	$(".contentWrapper").find('.certificate').each(function(){
		rstArray.push($(this).data());
	});

	var _param = {};
	_common.callAjax("/tvius/getCertificateFirstView.do", {"jsonTxt" : JSON.stringify(rstArray)}, function(view) {
		if(_common.utils.validObject(view, 'string')){
			_param['firstPage'] = view;
			_common.callAjax("/tvius/getCertificateSecondView.do", {"jsonTxt" : JSON.stringify(rstArray)}, function(view){
				if(_common.utils.validObject(view, 'string')){
					_param['title'] = "전자정보확인서";
					_param["secondPage"] = view;
					_common.postForm.submit("/tvius/getCertificatePdfFiles.json", _param);
				}
			}, false);
		}
	},false);
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addStrToIndex(target, str, index){
	return [target.slice(0, index), str, target.slice(index)].join('');
}

</script>
<div id="searchBox">
    <div id="loading_wrap" style="display: none;">
        <span id="loading_img"></span> <span id="loading_blank"></span>
    </div>
    <div class="contentWrapper customScroll" data-mcs-theme="minimal-dark">
        <div id="wrap">
            <div id="listPanel">
                <h3 class="title">인증서 출력 리스트</h3>
            </div>
            <div id="searchPanel">
                <div id="uploadDiv">
                    <!-- <input type="text" id="uploadFileNm" name="uploadFileNm" value="" readonly="readonly"> -->
                    <!-- 비밀번호 사용시 주석 해제 -->
                    <!-- <span>영상 비밀번호 : </span>
                    <input type="password" id="password" name="password" value="" placeholder="영상 비밀번호가 존재할 경우 입력하여 주십시오."> -->
                    <button class="grayBtn btn_Dstyle" id="btn-upload">파일첨부</button>
                    <button class="grayBtn btn_style2" id="btn-print">인증서 출력</button>
                    <form class="hidden" id="hiddenForm" method="POST" enctype="multipart/form-data">
                        <input type="text" name="p" id="p" class="hidden" value=""><!-- \\upload\\tvius\\rqst\\ -->
                        <input type="file" name="uploadVideo" id="uploadVideo" class="hidden" accept=".MS4, .ms4">
                    </form>
                </div>
                <div id="resultDiv">
                    <table>
<!--                         <colgroup> -->
<!--                             <col width="120px;"> -->
<!--                             <col width="330px"> -->
<!--                             <col width="120px;"> -->
<!--                             <col width="330px"> -->
<!--                         </colgroup> -->
                        <tbody id="resultTbody">
                            <tr>
                               <th>신청번호</th>
                               <td><span id="rqstMgrSeq"></span></td>
                               <th>CCTV</th>
                               <td><span id="cctv"></span></td>
                            </tr>
                            <tr>
                               <th>신청자</th>
                               <td><span id="reqstId"></span></td>
                               <th>신청일</th>
                               <td><span id="reqstDat"></span></td>
                            </tr>
                            <tr>
                               <th>승인자</th>
                               <td><span id="acptUserId"></span></td>
                               <th>승인일</th>
                               <td><span id="acptDat"></span></td>
                            </tr>
                            <tr>
                               <th>업로드 파일명</th>
                               <td><span id="uploadNm"></span></td>
                               <th>업로드 파일 크기</th>
                               <td><span id="uploadFileSize"></span></td>
                            </tr>
                            <tr>
                               <th>서버 보관 파일명</th>
                               <td><span id="fileNm"></span></td>
                               <th>서버 보관 파일 크기</th>
                               <td><span id="fileSize"></span></td>
                            </tr>
                            <tr>
                               <th>영상 시작 시간</th>
                               <td><span id="secStDat"></span></td>
                               <th>영상 종료 시간</th>
                               <td><span id="secEdDat"></span></td>
                            </tr>
                            <tr>
                               <th>재생 만료 횟수</th>
                               <td><span id="playLimitCnt"></span></td>
                               <th>재생 만료 기간</th>
                               <td><span id="playLimitDat"></span></td>
                            </tr>
                            <tr>
                               <th>파일 SHA256 코드</th>
                               <td id="shaTd"><span id="shaCde"></span></td>
                               <th>파일 MD5 코드</th>
                               <td><span id="md5Cde"></span></td>
                            </tr>
                            <!-- <tr>
                               <td colspan="4" id="imgTd">
                               </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>