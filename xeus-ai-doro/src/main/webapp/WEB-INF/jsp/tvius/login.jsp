<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.sysmgr.service.NoticeVo"%>
<%@ page import="geomex.xeus.user.util.RSAKey"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="geomex.xeus.util.code.StrUtil"%>
<%@ page import="java.util.ArrayList"%>
<%
    RSAKey rsa = (RSAKey)session.getAttribute("RSA");
    ArrayList<NoticeVo> notice = (ArrayList<NoticeVo>) request.getAttribute("notice");

    ArrayList<OrganizationVo> orgz = (ArrayList<OrganizationVo>) request.getAttribute("orgz");
    if(orgz == null) orgz = new ArrayList<OrganizationVo>();

    String adminNotice = (String) request.getAttribute("adminNotice");

    String smsChk = StrUtil.chkNull((String)request.getAttribute("smsChk"));
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="shortcut icon" href="../res/img/geomex.ico">
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/ui-darkness/jquery-ui.css?v=<%= DateUtil.getStrMilSec() %>">
<link rel="stylesheet" type="text/css" href="../common/ui-1.12.1/themes/base/jquery-ui.css?v=<%= DateUtil.getStrMilSec() %>">
<link rel="stylesheet" type="text/css" href="../res/css/xeus.tvius.login.css?v=<%= DateUtil.getStrMilSec() %>">
<title>제천시 스마트시티 통합플랫폼</title>
<script type="text/javascript" src="../common/jquery-3.2.0.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/ui-1.12.1/jquery-ui.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.paging.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.timepicker.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.bpopup.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.form.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/jquery.download.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/tooltipsy.min.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/tea-block.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/base64.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/utf8.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/jsbn.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/rsa.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/cipher/helper.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/string.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/HashMap.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/string.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/Date.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../common/common.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../res/xeusConfig.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="../res/xeusUser.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script>
$(document).ready(function(){

    $("#wrap").center();

    $(window).resize(function(){
        $("#wrap").center();
    });

    var smsChk = '<%=smsChk%>';
    if(smsChk == 'Y'){
    	//백그라운드 이미지 사이즈 변경
    	var _width = $('#wrap').find("#memberLogin").width()+'px';
    	var _height = $('#wrap').find("#memberLogin").height() + 90+'px';
		//jquery $().css()가 먹히지 않아 attr로 style 적용
    	$('#wrap').find("#memberLogin").attr('style', "height: 346px; background-size: "+_width+" "+_height+"; background-image: none !important; background: rgba(0, 65, 105, 0.4) !important;");
    }

    $("#userId").focus();

    $("#userPwd, #login_btn, #accNo").keyup(function(e){
        if(e.which == 13){
       		user.valid.signIn(smsChk);
        }
    });

    $("#login_btn").on("click", function(){
        user.valid.signIn(smsChk);
    });

    $("#acc_btn").on('click',function(){
    	var userId = $("#userId").val()
		var userPwd = $("#userPwd").val()
		var mobileNum = $("#mobileNum").val()
    	user.valid.validChk(userId, userPwd, mobileNum);
    });

    $("#notiecList").click(function(){
    	var windowWidth = 800;
    	var windowHeight = 700;
    	var windowLeft = parseInt((screen.availWidth/2) - (windowWidth/2));
    	var windowTop = parseInt((screen.availHeight/2) - (windowHeight/2));
    	var windowSize = "width=" + windowWidth + ",height=" + windowHeight + "left=" + windowLeft + ",top=" + windowTop + "screenX=" + windowLeft + ",screenY=" + windowTop;

    	window.open("/xeus/notice/getOpenNoticeView.do", "공지사항", windowSize);
    });



    /******** 2021.01.27 백유림 회원가입 팝업 임시 추가 *********/
    function start(index){
        $('.join_pop .join_box .box').removeClass('on');
        $('.join_pop .join_box .box').eq(index).addClass('on');
    }

    $('.btn_next').on('click', function(){
        var pa = $(this).parent().parent();

        if(pa.index() == 0){
            $('.box').eq(0).css('order', '3');
            $('.box').eq(1).css('order', '1');
            $('.box').eq(2).css('order', '2');
        }else if(pa.index() == 1){
            $('.box').eq(0).css('order', '3');
            $('.box').eq(1).css('order', '2');
            $('.box').eq(2).css('order', '1');
        }

        start(pa.index() +1);


    });
    $('.btn_prev').on('click', function(){
        var pa = $(this).parent().parent();

        if(pa.index() == 1){
            $('.box').eq(0).css('order', '1');
            $('.box').eq(1).css('order', '2');
            $('.box').eq(2).css('order', '3');
        }else if(pa.index() == 2){
            $('.box').eq(0).css('order', '3');
            $('.box').eq(1).css('order', '1');
            $('.box').eq(2).css('order', '2');
        }

        start(pa.index() -1);
    });
    $('#signUpBtn').on('click', function(){
//     	var win = window.open("http://cctv.seocho.go.kr/xeus/tvius/reg.do", "_blank");//
    	var win = window.open("http://"+location.host+"/xeus/tvius/reg.do", "_blank");
		win.focus();
		return false;

        $('.join_pop').bPopup({
        	closeClass: 'btn_close',
            onClose: function(){
                $('.box').eq(0).css('order', '1');
                $('.box').eq(1).css('order', '2');
                $('.box').eq(2).css('order', '3');
                $('.join_pop .join_box .box').removeClass('on');
                $('.join_pop input').val('');
            }
        });
        $('.join_pop .join_box .box').eq(0).addClass('on');
    });


    $('.notcTitle').mouseenter(function(){
		$(this).css("text-decoration","underline");
	});

	$('.notcTitle').mouseleave(function(){
		$(this).css("text-decoration","none");
	});

	$('.notcTitle').click(function(){
		var notcMgrSeq = $(this).attr("mgrseq");

		var _html = '';
		_html += '<div class="popupWrapper" id="edit_pop_wrap">';
		_html += '	<div id="bpop_wrap" mgrSeq='+notcMgrSeq+'>';
// 		_html += '		<h2 id="bpop_title">공지사항 상세정보</h2>';
		_html += '		<table>';
		_html += '			<tr class="top">';
		_html += '				<th style="width:20%;" class="top">제목</th>';
		_html += '				<td>';
		_html += '					<input style="height:50px;color:#fff;" type="text" class="sendData" id="notcTitle" name="notcTitle" readonly="readonly" />';
		_html += '				</td>';
		_html += '			</tr>';
		_html += '			<tr>';
		_html += '				<th style="width:20%;" class="top">내용</th>';
		_html += '				<td>';
		_html += '					<textarea style="height:500px;color:#fff;" class="sendData" id="notcConts" name="notcConts" readonly="readonly"></textarea>';
		_html += '				</td>';
		_html += '			</tr>';
		_html += '			<tr>';
		_html += '				<th style="width:20%;" class="top">첨부파일</th>';
		_html += '				<td id="downTr">';
		/* _html += '					<input type="text" id="fileDown" readOnly />'; */
		_html += '					<span id="fileDown"></span>';
		_html += '				</td>';
		_html += '			</tr>';
		_html += '		</table>';
// 		_html += '		<table>';
// 		_html += '			<tr align="center">';
// 		_html += '				<td class="lastTd" colspan="2" style="border: 0 !important;">';
// 		_html += '					<button id="closeEditPop" class="bpopClose" tabindex="5">닫기</button>';
// 		_html += '				</td>';
// 		_html += '			</tr>';
// 		_html += '		</table>';
		_html += '	</div>';
		_html += '</div>';
		$("#popupWrap").dialog().html(_html).dialog({
			title : "공지사항 상세보기",
			width: 1000,
			height: 700,
			modal: true,
			position: {
				my: "center center",
				at: "center center",
				of: $("#login_wrap")
			},
			open: function(){
				var notcMgrSeq = $(this).find("#bpop_wrap").attr('mgrSeq');
				_common.callAjax("/notice/getItem.json", {'mgrSeq' : notcMgrSeq}, function(json){
					if(json.result){
						$('#notcTitle').val(json.result.notcTitle);
						$('#notcConts').val(json.result.notcConts);
						$('#fileDown').text(json.result.atchFileNm)
						.attr('k', json.result.atchFileNm)
						.attr('u', notcMgrSeq)
						.css('cursor', 'pointer')
						.mouseenter(function(){
							$(this).css("text-decoration","underline");
						})
						.mouseleave(function(){
							$(this).css("text-decoration","none");
						});

						/* 파일 다운 */
						$(document).on("click", "#fileDown", function(){
							var k = $(this).attr("k");
							var u = $(this).attr("u");

							if(k != null && k != "" && u != null && u != ""){
								_common.postForm.submit("/notice/getFile.json", { "atchFileNm" : k , "mgrSeq" : u });
							}
						});
					}
				});
			},
			close: function(){
			}
		}).dialog("close").dialog("open");

	});

	$("#findPasswordBtn").click(function(){
		location.href = "../user/find.do";
	});
    /******** 2021.01.27 백유림 회원가입 팝업 임시 추가 *********/
});

$(document).on("focus", "input", function(){
    var txt = $(this).attr("placeholder");
    $(this).attr("hint", txt).attr("placeholder", "");
});

$(document).on("focusout", "input", function(){
    var txt = $(this).attr("hint");
    $(this).attr("placeholder", txt);
});

window.onload = function(){
<% if(adminNotice != null) { %>
alert("<%= adminNotice %>");
<% } %>
}
</script>
</head>
<body>
	<div id="login_wrap">
        <section id="login_main">
            <div class="row">
                <div class="login">
                    <div class="login_left">
                        <span class="bar"></span>
                        <h1>제천시<br />CCTV 영상정보<br />제공 시스템</h1>
                        <p>제천시 CCTV 영상정보의 반출 신청 및 관리를 하며<br />통계나 히트맵을 통한 CCTV 정보제공 현황 확인이 가능합니다.</p>
                        <div class="btn_wrap">
                            <!-- <button class="btn_down" onclick="window.open('../user/getPlayerFile.json', '_blank');">뷰어 다운로드</button> -->
                            <a id="playerDown" href="../res/file/전용플레이어_20210223.zip" target="_blank" style="display: none;"></a>
                            <button class="btn_down" onclick="document.getElementById('playerDown').click();">뷰어 다운로드</button>
                            <button class="btn_manual" onclick="window.open('../user/getPlayerManualFile.json', '_blank');">매뉴얼 보기</button>
                        </div>
                    </div>
                    <div class="login_right">
                        <div class="input_box">
                            <h3 class="title">아이디</h3>
                            <input type="text" id="userId" tabindex="1" placeholder="아이디를 입력해주세요" value="">
                        </div>
                        <div class="input_box">
                            <h3 class="title">비밀번호</h3>
                            <input type="password" id="userPwd" tabindex="2" placeholder="비밀번호를 입력해주세요" value="">
                        </div>
					<% if("Y".equals(smsChk)){ %>
                        <div class="input_box">
                            <h3 class="title">SMS 인증</h3>
                            <input type="tel" id="mobileNum" tabindex="3" placeholder="핸드폰번호(-없이 입력)" value="" oninput="this.value=this.value.replace(/[^0-9]/g,'');">
                            <input type="text" id="accNo" tabindex="4" placeholder="인증번호" value="">
                            <button id="acc_btn" class="btn_sms">인증번호 전송</button>
                        </div>
					<% } %>
                        <button id="login_btn" class="btn_login">로그인</button>
                        <button id="signUpBtn" class="btn_join">회원가입</button>
                        <button id="findPasswordBtn" class="btn_find">계정 또는 암호를 잊으셨나요?</button>
                        <input type="hidden" id="Modulus" name="Modulus" value="<%= RSAKey.toHex(rsa.getModulus()) %>">
				    	<input type="hidden" id="Exponent" name="Exponent" value="<%= RSAKey.toHex(rsa.getPublicExponent()) %>">
                    </div>
                </div>
            </div>
        </section>
        <section id="login_notice">
            <div class="row">
                <div class="notice">
                    <div class="notice_box">
                    	<h2>공지사항</h2>
                        <div class="left">
                            <ul class="list">
						<% for(int i=0; i<notice.size(); i++){ %>
						<%	if(i < 5){ %>
                                <li><span class="date">[<%= DateUtil.formatDate(notice.get(i).getLastMdfyDat()) %>]</span><a mgrSeq=<%= notice.get(i).getMgrSeq() %> class="notcTitle" href="#a"><%= notice.get(i).getNotcTitle() %></a></li>
						<% 	} %>
						<% } %>
                            </ul>
                        </div>
                    </div>
                    <ul class="important_notice_list">
	                    <li>
		                    <div class="icon_box"></div>
		                    <div class="important_content">
			                    <h3>온라인 영상반출 신청가능일</h3>
			                    - <span>관제센터 영상보관기한(30일) 이내</span><br/>
			                    - <span>ms4 파일</span>로 제공(보안, 재생횟수, 재생가능날짜 제약)<br/>
			                    - 관제센터 영상녹화기한인 <span>30일</span>을 초과하면 영상반출신청이 불가합니다.
		                    </div>
	                    </li>
	                    <li>
		                    <div class="icon_box"></div>
		                    <div class="important_content">
			                    <h3>온라인 영상증거 신청가능일</h3>
			                    - <span>반출 승인된 파일의 재생만료일(30일) 이내</span><br/>
			                    - <span>avi 파일</span>로 제공(각종 제약 없음)<br/>
			                    - 반출 파일의 재생만료기한인 <span>30일</span>을 초과하면 영상증거신청이 불가합니다.
		                    </div>
	                    </li>
	                    <li>
		                    <span>개인정보보호법 제17조 및 제18조에 따라, 증거신청자는 avi 파일 다운 이후 영상 활용에 대한 모든 법적 책임을 지게 됩니다.</span>
	                    </li>
                    </ul>
                </div>
            </div>
        </section>
        <footer id="login_footer">
            <img src="../res/img/ci.png" alt="서초">
            <p>
                                                      ※ 운영문의 02-2155-6092(주간)  / 6087 (야간 및 공휴일)  ※ 기술문의 02-2155-6098<br/>
                (06750) 서울특별시 서초구 남부순환로 2584 (서초동) | 서초구청<br/>
                Copyright(c) 2021 SEOCHO SEOUL KOREA. All rights Reserved.
            </p>
        </footer>
        <div class="join_pop">
            <h2 class="title">회원가입</h2>
            <button class="btn_close"></button>
            <div class="join_box">
                <div class="box on">
                    <h3><span class="ball">1</span>기본 정보 입력</h3>
                    <div class="input_box">
                        <h3 class="title">아이디</h3>
                        <input type="text" placeholder="6자 이상" id="regUserId" name="userId">
                        <button id="idChk" class="btn_id_check" onclick="user.reg.idChk();">중복확인</button>
                    </div>
                    <div class="input_box">
                        <h3 class="title">비밀번호</h3>
                        <input type="password" placeholder="영문, 숫자, 특수문자 포함" id="regUserPwd" name="userPwd">
                    </div>
                    <div class="input_box">
                        <h3 class="title">비밀번호 확인</h3>
                        <input type="password" placeholder="비밀번호를 다시 입력해주세요" id="regUserPwdRe" name="userPwdRe">
                    </div>
                    <div class="btn_wrap">
                        <button class="btn_next">다음</button>
                    </div>
                </div>
                <div class="box">
                    <h3><span class="ball">2</span>개인 정보 입력</h3>
                    <div class="input_box">
                        <h3 class="title">이름</h3>
                        <input type="text" id="userNm" name="userNm">
                    </div>
                    <div class="input_box">
                        <h3 class="title">생년월일</h3>
                        <input type="text" placeholder="주민등록번호 앞자리" id="birthDay" name="birthDay">
                    </div>
                    <div class="input_box">
                        <h3 class="title">휴대폰 번호</h3>
                        <input type="tel" placeholder="- 없이 입력" id="mobileNum" name="mobileNum" oninput="this.value=this.value.replace(/[^0-9]/g,'');">
                    </div>
                    <div class="input_box">
                        <h3 class="title">이메일</h3>
                        <input type="text" id="email" name="email">
                    </div>
                    <div class="btn_wrap">
                        <button class="btn_prev">이전</button>
                        <button class="btn_next">다음</button>
                    </div>
                </div>
                <div class="box">
                    <h3><span class="ball">3</span>직장 정보 입력</h3>
                    <div class="input_box">
                        <h3 class="title">회사명</h3>
                        <select id="orgMgrNo" name="orgMgrNo" class="wide sendData">
				<% for(int i=0; i<orgz.size(); i++){ %>
	                            <option value="<%= orgz.get(i).getOrgMgrNo() %>"><%= orgz.get(i).getOrgNm() %></option>
				<% } %>
	                        </select>
                    </div>
                    <div class="input_box">
                        <h3 class="title">부서</h3>
                        <input type="text" placeholder="소속 및 부서명" id="departNm" name="departNm">
                    </div>
                    <div class="input_box">
                        <h3 class="title">직급</h3>
                        <input type="text" id="posNm" name="posNm">
                    </div>
                    <div class="input_box">
                        <h3 class="title">사무실 전화번호</h3>
                        <input type="tel" placeholder="- 없이 입력" id="telNum" name="telNum" oninput="this.value=this.value.replace(/[^0-9]/g,'');">
                    </div>
                    <div class="btn_wrap">
                        <button class="btn_prev">이전</button>
                        <button id="okBtn" class="btn_ok">완료</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="popupWrap" title="" class="dialogWrap customScroll table_style"></div>
</body>
</html>