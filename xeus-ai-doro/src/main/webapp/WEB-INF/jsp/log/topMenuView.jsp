<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.ColumnInfoVo"%>
<%@ page import="geomex.xeus.log.service.AccessVo"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.Set"%>
<%@ include file="../common.jsp" %>
<style>
    #top_menu{
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        /* padding-left: 90px; */
        /* padding-top: 20px; */
    }
    #top_menu ul {
        margin: 0;
        padding: 3px 0 0 0;
        list-style-type: none;
        width:100%;
        height:40px;
        box-sizing:border-box;
        -webkit-box-sizing:border-box;
        -moz-box-sizing:border-box;
    }
    #top_menu > ul li.gnb {
        float: left;
        position: relative;
        background: white;
        border: 1px solid gray;
        border-bottom: none;
        margin-right: 2px;
        padding: 8px 10px;
        font-size: 14px;
        cursor: pointer;
        outline: none;
    }

    #top_menu ul.sub_grp{
        width: 1000px;
        display: none;
    }

    #top_menu ul.sub_grp li {
        float: left;
        padding: 8px 12px;
    }

    #top_menu ul.sub_grp li:not(:first-child):before {
        content: "|";
        margin-right: 13px;
    }

    #top_menu > ul li > ul {
        position: absolute;
        left: 10px;
        top: 30px;
    }

    #top_menu ul li img {
        cursor: pointer;
    }
    .customDialogClose {
    	width: 50px;
	    height: 50px;
	    background-image: url(./res/img/btn_close.png);
	    background-size: 50%;
/* 	    background-color: #ddd; */
	    background-repeat: no-repeat;
	    background-position: center;
	    top: 0;
	    right: 0;
	    margin: 0;
	    padding: 0;
	    border-radius: 0;
	    border: 0;
/* 	    background: #ededed; */
    	color: #2b2b2b;
    	position: absolute
    }

</style>
<script type="text/javascript">

	$(document).ready(function(){
		//dialog title bar를 없앤다
		$( "#contentWrap" ).dialog( "option", "dialogClass", 'noTitleStuff');

		//dialog title bar 길이만큼 dialog 길이를 늘려준다
		var titleHeihgt = $(".noTitleStuff .ui-dialog-title").height();
		var dialogHeight = $( "#contentWrap" ).dialog( "option", "height" );
		$( "#contentWrap" ).dialog( "option", "height", dialogHeight+titleHeihgt );
	})


    $("#top_menu > ul li.gnb").mouseover(function(){
        $(this).find('.sub_grp').show();
        $(this).find('span').css('font-weight','bold');
        $(this).css('border-top','2px solid #2B5E93');
    }).mouseout(function(){
        $(this).find('.sub_grp').hide();
        $(this).find('span').css('font-weight','normal');
        $(this).css('border-top','1px solid gray');
    });
    $("#top_menu ul.sub_grp").mouseover(function(){
        $(this).prev().css('font-weight','bold');
    }).mouseout(function(){
        $(this).prev().css('font-weight','normal');
    });
    $("#top_menu ul.sub_grp li").mouseover(function(){
        $(this).css('font-weight','bold');
        $(this).css('text-decoration','underline');
    }).mouseout(function(){
        $(this).css('font-weight','normal');
        $(this).css('text-decoration','none');
    });

    $('.sub_grp li').click(function(){
    	var url = $(this).attr("url");
    	if(url != null && url != ""){
			var _param = {};
			_param['limit'] = 100;
			_param['offset'] = 0;

			if(url.indexOf("getCrmsRqstLogView") > -1){
				_param['reqGbnCd'] = '11';
			} else if(url.indexOf("getCrmsRenewLogView") > -1){
				_param['renewTyp'] = '11';
			} else if(url.indexOf("getCrmsRenewEviLogView") > -1){
				_param['renewTyp'] = '12';
			} else if(url.indexOf("getCrmsRqstReadingLogView") > -1){
				_param['reqGbnCd'] = '12';
			} else if(url.indexOf("getCrmsRqstCarLogView") > -1){
				_param['reqGbnCd'] = '14';
			} else if(url.indexOf("getMonEvtShareLogView") > -1){
				_param['evtTypCd'] = 'cctvShare';
			}

			_common.callAjax(url, _param, function(view) {
				$("#contentWrap").dialog("close").html(view).dialog("open");
			});
		}
    });
    $('.customDialogClose').click(function(){
    	$("#contentWrap").dialog("close");
    });


</script>

<!-- <button class="logTab" active="active" url="/log/getAssetLogView.do" excel="Asset">시설물 관리</button>
<button class="logTab" url="/log/getMsgLogView.do" excel="Msg">SMS</button>
<button class="logTab" url="/log/getIf112LogView.do" excel="112">112 긴급영상 지원</button>
<button class="logTab" url="/log/getIf112JsonLogView.do" excel="112Json">112 긴급출동 메소드 호출 현황</button>
<button class="logTab" url="/log/getIf119LogView.do" excel="119">119 긴급출동</button>
<button class="logTab" url="/log/getIfDscLogView.do" excel="Dsc">사회적약자</button>
<button class="logTab" url="/log/getIfEvtLogView.do" excel="Evt">이벤트로그</button>
<button class="logTab" >접근이력관리</button> -->

<div id="top_menu">
    <ul>
        <li class="gnb">
            <span>공통/관리</span>
            <ul class="sub_grp">
                <li url="/log/getAccessView.do">사용자 접속 로그조회</li>
                <!-- <li>모바일 접속로그조회</li> -->
                <li url="/log/getAuthSetLogView.do">권한 설정 로그조회</li>
            </ul>
        </li>
        <li class="gnb">
            <span>CCTV/영상</span>
            <ul class="sub_grp">
                <li url="/log/getMonCctvLogView.do">영상조회 로그조회</li>
                <li url="/log/getMonPrevLogView.do">선영상 조회 로그조회</li>
                <li url="/log/getAssetStatusLogView.do">이상상태로그기록조회</li>
                <li url="/log/getStillCutLogView.do">CCTV 스틸컷 로그조회</li>
            </ul>
        </li>
        <li class="gnb">
            <span>이벤트</span>
            <ul class="sub_grp">
                 <li url="/log/getIfEvtLogView.do">이벤트 로그조회</li>
                <li url="/log/getMonEvtShareLogView.do">이벤트공유 로그 조회</li>
                <!-- <li>소방RTSP송출 로그조회</li> -->
            </ul>
        </li>
        <li class="gnb">
            <span>영상반출</span>
            <ul class="sub_grp">
                <li url="/log/getCrmsRqstLogView.do">영상반출신청 로그조회</li>
                <li url="/log/getCrmsRenewLogView.do">연장신청 로그조회</li>
                <li url="/log/getCrmsRenewEviLogView.do">증거자료신청 로그조회</li>
                <li url="/log/getCrmsRqstReadingLogView.do">열람신청 로그조회</li>
                <li url="/log/getCrmsRqstCarLogView.do">차량영상반출 로그조회</li>
            </ul>
        </li>
    </ul>
    <button type="button" class="customDialogClose" title="Close"></button>
</div>