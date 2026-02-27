<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="geomex.xeus.map.service.DoroVo"%>
<%@ page import="geomex.xeus.map.service.EmdVo"%>
<%@ page import="geomex.xeus.map.service.LiVo"%> --%>
<%@ page import="org.apache.commons.lang3.StringUtils"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Set"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%
    /* ArrayList<EmdVo> emdList = (ArrayList<EmdVo>) request.getAttribute("emdList");
     ArrayList<LiVo> liList = (ArrayList<LiVo>) request.getAttribute("liList");
     ArrayList<DoroVo> rnList = (ArrayList<DoroVo>) request.getAttribute("rnList"); */

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

    /* CD50 // 신청근거 */
    HashMap<String, String> chkReqstResn = cde.convertCodeGrpToAllCde("C50");
    //Set<String> chkReqstResnKey = chkReqstResn.keySet();
    Set<String> chkReqstResnKey = new TreeSet<String>(chkReqstResn.keySet());
    Iterator<String> chkReqstResnItr = chkReqstResnKey.iterator();

    /* CD51 // 8대중과실 */
    HashMap<String, String> chkCrimeTyp = cde.convertCodeGrpToAllCde("C51");
    Set<String> chkCrimeTypKey = new TreeSet<String>(chkCrimeTyp.keySet());
    Iterator<String> chkCrimeTypItr = chkCrimeTypKey.iterator();

    /* CD58 // 영상반출 신청구분 */
    HashMap<String, String> chkReqGbnCd = cde.convertCodeGrpToAllCde("C58");
    Set<String> chkReqGbnCdKey = new TreeSet<String>(chkReqGbnCd.keySet());
    Iterator<String> chkReqGbnCdItr = chkReqGbnCdKey.iterator();

    HashMap<String, String> sysParam = (HashMap<String, String>)request.getAttribute("sysparam");

    String maskingYn = sysParam.get("tvius.masking_yn");

    HashMap<String, String> rst = (HashMap<String, String>)request.getAttribute("result");

    String chkEdit = "";
    String procStatCd = "";
    if ( rst.size() > 0){
        chkEdit = rst.get("rqstMgrSeq");
        procStatCd = rst.get("procStatCd");
    }

    String videoSmyChk = (String) request.getAttribute("videoSmyChk");
%>
<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.tvius.css"> -->
<%-- <script type="text/javascript" src="<%=context%>/common/jquery.inputmask.js"></script>
<script type="text/javascript" src="<%=context%>/common/jquery.inputmask.date.extensions.js"></script>
<script type="text/javascript" src="<%=context%>/common/jquery.inputmask.extensions.js"></script>
<script type="text/javascript" src="<%=context%>/common/jquery.inputmask.numeric.extensions.js"></script>
<script type="text/javascript" src="<%=context%>/common/jquery.inputmask.regex.extensions.js"></script>
<script type="text/javascript" src="<%=context%>/common/jquery.rowspanizer.js"></script>
<script type="text/javascript" src="<%=context%>/common/jquery.bxslider.js"></script>

<script type="text/javascript" src="<%=context%>/common/spin.min.js"></script> --%>

<script type="text/javascript" src="./res/menu/tviusView/geomex.xeus.tvius.usr.rqst.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript" src="./res/menu/tviusView/geomex.xeus.tvius.usr.prev.js?v=<%= DateUtil.getStrMilSec() %>"></script>
<script type="text/javascript">
    var mgrSeq;
    var userId = '<%=userId%>';
    var chkEdit = '<%=chkEdit%>';
    var chkMenu = 'usr';
    var procStatCd = '<%=procStatCd%>';
    var videoSmyChk = '<%=videoSmyChk%>';

    //사전반출로 들어온 경우 공문첨부 버튼을 변경한다.
    // 190324 이은규
    // 무조건 앱에서 등록한 사진으로만 진행
    /* if(procStatCd == "SB") {
    	$(".contentWrapper").find(".rqstWrapper").find("#btn-upload").hide();
    	$(".contentWrapper").find(".rqstWrapper").find("#btn-getdoc").show();
    } */

    SYSTEM_AVI_PLAY_CNT = '<%= sysParam.get("tvius.avi_play_cnt") %>';
    SYSTEM_AVI_PLAY_DAT = '<%= sysParam.get("tvius.avi_play_dat") %>';
    SYSTEM_RENEW_PLAY_CNT = '<%= sysParam.get("tvius.renew_play_cnt") %>';
    SYSTEM_RENEW_PLAY_DAT = '<%= sysParam.get("tvius.renew_play_dat") %>';
    SYSTEM_EVI_PLAY_CNT = '<%= sysParam.get("tvius.evi_play_cnt") %>';
    SYSTEM_PREVIEW_PHOTO = '<%= sysParam.get("tvius.preview_photo") %>';
    SYSTEM_PREVIEW_AVI = '<%= sysParam.get("tvius.preview_avi") %>';
    SYSTEM_FILE_DOWN_CNT = '<%= sysParam.get("tvius.file_down_cnt") %>';
    SYSTEM_RQST_LOCK_CNT = '<%= sysParam.get("tvius.rqst_lock_cnt") %>';
    SYSTEM_AVI_PLAY_TIME = '<%= sysParam.get("tvius.avi_play_time") %>';
    SYSTEM_LAST_SMS_DAT = '<%= sysParam.get("tvius.last_sms_dat") %>';
    SYSTEM_ADMIN_SMS_LIST = '<%= sysParam.get("tvius.admin_sms_list") %>';
    SYSTEM_MASKING_YN = '<%= sysParam.get("tvius.masking_yn") %>';
    SYSTEM_MASKING_ROUTE_BF = '<%= sysParam.get("tvius.mask_route_bf").replaceAll("\\\\", "\\\\\\\\") %>';
    SYSTEM_MASKING_ROUTE_AF = '<%= sysParam.get("tvius.mask_route_af").replaceAll("\\\\", "\\\\\\\\") %>';
    SYSTEM_STORAGE_PATH = '<%= sysParam.get("tvius.storage_path").replaceAll("\\\\", "\\\\\\\\") %>';
    SYSTEM_UPLOAD_PATH = '<%= sysParam.get("sys.upload_path").replaceAll("\\\\", "\\\\\\\\") %>';
    SYSTEM_SMI_YN = '<%=sysParam.get("tvius.smi_yn") %>';
    /* $(".contentWrapper").find('#downplayer').click(function(){
		var target = $(this).attr("target");
    	_common.postForm.submit("/user/get"+target+"File.json", null);
	}); */

	function onlyNumberInput(event) {
    	if((event.keyCode>47 && event.keyCode<58) || (event.keyCode>34 && event.keyCode<40) || (event.keyCode>95 && event.keyCode<106) || event.keyCode==8 || event.keyCode==46){
			event.returnValue = true;
    	} else{
    		event.returnValue = false;
    	}
    }
</script>

<div id="searchBox" class="usrTviusRqst">
	<div id="player_wrap" class="hidden">
		<div id="player_content">
			<span id="player_span">
				전용플레이어가 설치되어있지 않습니다.
				<br>
				하단 버튼을 통해 다운로드 후 설치하여 주십시오.
			</span>
			<br>
			<button id="player_download" class="blackBtn" style="width: 180px; height: 42px; font-size: 15px;">전용플레이어 다운로드</button>
		</div>
		<span id="player_blank"></span>
	</div>
    <div id="loading_wrap" style="position: absolute;">
        <span id="loading_img"></span> <span id="loading_blank"></span>

    </div>

    <!-- <div class="searchWrapper rqstWrapper" style="height: 40% !important;"> -->
    <!-- <div class="searchWrapper"> -->
    <div class="contentWrapper customScroll" data-mcs-theme="minimal-dark"><!-- onselectstart="return false" -->
    <div class="rqstWrapper">
<!--         <h3 class="title">신청근거 <button id="btnAppRqstSearch" class="btn_Dstyle">앱으로부터 신청검색</button></h3> -->
		<!-- <p class="hint" style="display: inline-block; text-align: left; font-size: 9pt; color: #777; margin-left: 10px;">
			*영상을 재생하기 위해서는 <span id="downplayer" style="text-align:left;" target="Player">전용플레이어 다운로드</span>가 필요합니다.
		</p> -->
		<!-- <span id="appRqstSearch" style="text-align:left;">앱으로부터 신청검색</span> -->
        <div>
            <input type="hidden" id="mgrSeq" name="mgrSeq" value="">
            <input type="hidden" class="sendData" id="reqstId" name="reqstId" value="<%=userId%>">
            <input type="hidden" id="reqstDat" name="reqstDat" value="">
        </div>
		<div class="box_style">
	    	<div class="info_box">
	    		<span class="title">신청자</span>
	    		<p class="content"><%=userNm%></p>
	    	</div>
	    	<div class="info_box">
	    		<span id="lbl_reqstResn" class="title">* 신청근거</span>
	    		<select id="reqstResn" name="reqstResn" class="sendData" intype="C" style="width: 99%;">
                        <option value="">전체</option>
                        <%
                            while (chkReqstResnItr.hasNext()) {
                                String str = (String) chkReqstResnItr.next();
                                if(!"99".equals(str)){
                        %>
                        <option value="<%=str%>"><%=chkReqstResn.get(str)%></option>
                        <%
                                }
                            }
                        %>
                </select>
	    	</div>
	    	<div class="info_box wd100">
	    		<span id="lbl_reqstDetail" class="title">* 신청내용</span>
	    		<textarea class="sendData" key="first" id="reqstDetail" style="width: 100%; resize: none;"
	                            coltype="V" collength="200" name="reqstDetail"></textarea>
    		</div>
            <div class="info_box wd100">
    			<span id="lbl_reqGbnCd" class="title">* 이용형태</span>
    			<select id="reqGbnCd" name="reqGbnCd" class="wide sendData" name="reqGbnCd">
                            <!-- <option value="">전체</option> -->
                            <%
                                while (chkReqGbnCdItr.hasNext()) {
                                    String str = (String) chkReqGbnCdItr.next();
                                    if("11".equals(str) || "12".equals(str)){
                                        if ("11".equals(str)) {
                            %>
                            <option value="<%=str%>" selected><%=chkReqGbnCd.get(str)%></option>
                            <%
                                        } else {
                            %>
                            <option value="<%=str%>"><%=chkReqGbnCd.get(str)%></option>
                            <%
                                        }
                                    } //else if("14".equals(str)){
                            %>
<%--                             <option value="<%=str%>"><%=chkReqGbnCd.get(str)%></option> --%>
                            <%
//                                     }
                                }
                            %>
                        </select>
    			<span id="lbl_crimeTyp" class="title" style="margin-left: 15px;">* 범죄유형</span>
    			<select id="crimeTyp" name="crimeTyp" class="wide sendData" intype="C"><!--  style="width: 48% !important;" -->
                            <option value="">전체</option>
                            <%
                                while (chkCrimeTypItr.hasNext()) {
                                    String str = (String) chkCrimeTypItr.next();
                            %>
                            <option value="<%=str%>"><%=chkCrimeTyp.get(str)%></option>
                            <%
                                    //}
                                }
                            %>
                 </select>
                <%if("Y".equals(videoSmyChk)){ %>
	    			<span id="lbl_videoSmy" class="title" style="margin-left: 15px;">고속검색</span>
	    			<input id="vidioSmyYes" type="radio" class="sendData" name="videoSmy" value="Y" style="width:150px;"> <span class="title">사용</span>
	               	<input type="radio" class="sendData" name="videoSmy" value="N" style="width:150px;" checked/> <span class="title">미사용</span>
               	<%} %>
    		</div>
<!--     		<div class="info_box"> -->
<!--     		</div> -->
   		</div>
        <h3 class="title">공문첨부</h3>
		<div class="box_style">
	    	<div class="info_box">
	    		<span id="lbl_docFileNm" class="title">* 공문첨부</span>
	    		<b id="fileNmText"></b>
<!-- 	    		<input type="text" class="sendData" id="docFileNm" name="docFileNm" value="" readonly="readonly" style="width: 45%;"> -->
<!--                 <input type="hidden" class="sendData" id="docFilePath" name="docFilePath" value=""> -->
<!--                 <input type="hidden" class="sendData" id="ofclMgrNo" name="ofclMgrNo" value=""> -->
                <form class="hidden" id="hiddenDocForm" method="POST" enctype="multipart/form-data">
               		<input type="hidden" class="sendData" id="docFileNm" name="docFileNm" value="" readonly>
					<input type="hidden" class="sendData" id="docFilePath" name="docFilePath" value="" readonly>
					<input type="hidden" class="sendData" id="p" name="p" value="rqst\\" readonly>
                 	<input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z">
                </form>
<!--                 <button class="btn_Dstyle" id="btn-getdoc">개인 저장소</button> -->
				<button class="btn_Dstyle" id="fileNm">파일 선택</button>
				<input type="file" name="uploadImg" id="uploadImg" class="hidden" accept=".pdf, .txt, .hwp, .xls, .xlsx, .ppt, .rtf, .doc, .jpg, .jpeg, .png, .zip, .7z">
				<!-- 공용 FTP(WAS 대상) 또는 PC 파일 업로드 데이터 취득 -->
<!--                 <input type="file" class="sendData hidden" id="publicDoc" value=""> -->
<!--                 <button class="btn_Dstyle" id="btn-getPublicDoc">공용 저장소</button> -->
	    	</div>
	    	<div class="info_box">
    			<span id="lbl_docNo" class="title">* 공문번호</span>
    			<input type="text" class="sendData" id="docNo" name="docNo" value="">
    		</div>
    		<div class="hint text">
            	* 공문첨부/파일첨부는 입력란 우측의 <b class="red_font">'파일첨부'</b>를 누르면 파일을 첨부할 수 있습니다.
            	<br> * 파일명은 <b class="red_font">최대 30글자</b>이며, 파일 크기는 <b class="red_font">최대 500MB</b> 입니다.
            	<br> * ex) 경비교통과-2001-2020.04.01
            </div>
    	</div>

    </div>

    <!-- ////////////////////////////////////////////////////////////////////////////// -->

    <!-- <div class="searchWrapper aviWrapper" style="height: 40% !important;"> -->
    <div class="aviWrapper">
        <div class="dropBox" style="top: 50% !important;display:none;">이곳에 드롭 해주세요!</div>
        <h3 class="title" style="position: relative;">
            <label id="lbl_cctvList">CCTV 선택</label>
            <button id="drawCncl" class="btn_Dstyle hidden" style="position: absolute; top: -10px; right: 0">그리기 종료</button>
            <button id="delChkBox" class="btn_Dstyle" style="float:right">선택 삭제</button>
            <button id="delAll" class="btn_Dstyle" style="float:right">일괄 삭제</button>
            <button id="applyChkBox" class="btn_Dstyle" style="float:right">시간 선택 적용</button>
            <button id="applyAll" class="btn_Dstyle" style="float:right">시간 일괄 적용</button>

        </h3>
        <div class="box_style" style="display: none;">
	    	<div class="info_box">
	    		<span class="title">기준시간</span>
	    		<input type="text" size="12" id="base_date" style="width: 80px; vertical-align: middle;"
                            class="in_date base_time_chk datePicker" value="" readonly="readonly"> <select id="base_time"
                            class="base_time_chk" style="width: 50px; vertical-align: middle;">
                            <%
                                for (int i = 0; i < 24; i++) {
                            %>
                            <option value="<%=i%>"><%=i%>시
                            </option>
                            <%
                                }
                            %>
                        </select> <select id="base_min" class="base_time_chk" style="width: 50px; vertical-align: middle;">
                        	<%
                                for (int i = 0; i < 60; i++) {
                                	String min = "" + i;
                                	if(i < 10) min = "0" + i;
                            %>
                            <option value="<%=min%>"><%=min%>분
                            </option>
                            <%
                                }
                            %>
                            <!-- <option value="00">00분</option>
                            <option value="10">10분</option>
                            <option value="20">20분</option>
                            <option value="30">30분</option>
                            <option value="40">40분</option>
                            <option value="50">50분</option> -->
                        </select> 전 <select id="base_term" style="width: 50px; vertical-align: middle;">
                            <option value="10">10분</option>
                            <option value="20">20분</option>
                            <option value="30">30분</option>
                            <option value="40">40분</option>
                            <option value="50">50분</option>
                        </select>
	    	</div>
	    	<div class="info_box">
    			<span class="title">영역검색</span>
    			<label for="circle"><input type="radio" name="spatial" class="drawType" value="Circle" id="circle"> 반경</label>
    			<label for="box"><input type="radio" name="spatial" class="drawType" value="Box" id="box"> 사각형</label>
    			<label for="polygon"><input type="radio" name="spatial" class="drawType" value="Polygon" id="polygon"> 다각형</label>
    		</div>
<!--     		<h3 id="drawCncl" class="hidden pointer title" style="width: 100%; text-align: right;">그리기를 종료하시려면 여기를 눌러주세요.</h3> -->
    		<div class="hint text">
                * 기준시간에 따라 CCTV 선택 시 <b class="red_font">기본 시작시간과 종료시간</b>이 설정됩니다.<br>
            </div>
   		</div>
   		<div id="cctv_list_box" style="width: 100%;" align="left">
             <input type="hidden" class="sendData" id="cctvList" name="cctvList" value="">
             <table border="0" cellspacing="0" id="tbl_cctv_list">
	             <tr>
	             	<th width="30"></th>
	                 <th>CCTV 명</th>
	                 <th width="100">미리보기</th>
	                 <th width="170">시작시간</th>
	                 <th width="170">종료시간</th>

	                 <%
	                 if ( !"N".equals(maskingYn) ){
	                 %>
	                 <th width="70">마스킹</th>
	                 <%
	                 }
	                 %>
	                 <th width="70">삭제</th>
	             </tr>
	         </table>
      	</div>
     	<div class="hint text">
	      	* CCTV 레이어 우클릭 후 <b class="red_font">반출 대상 카메라</b>를 선택할 수 있습니다. <br />
	        * CCTV는 <b class="red_font">최대 20개까지 등록</b>할 수 있습니다.<br />
	        * CCTV 시작시간과 종료시간은 <b class="red_font">최대 6시간</b> 차이로 신청할 수 있습니다.<br />
    	</div>
    	<div style="border:1px solid #999;"></div>
    	<div style="font-size:13px;margin-top: 5px;">
            <span style="color:red;">&lt;참고사항&gt; <br><br>
			* 개인정보보호법 제19조(개인정보를 제공받은 자의 이용ㆍ제공 제한)</span> <span style="color:#999;">개인정보처리자로부터 개인정보를
			제공받은 자는 다음 각 호의 <br> &nbsp;&nbsp;&nbsp;어느 하나에 해당하는 경우를 제외하고는 개인정보를 제공받은 목적 외의
			용도로 이용하거나 이를 제3자에게 제공하여서는 아니 된다.<br><br>

			&nbsp;&nbsp;&nbsp;1. 정보주체로부터 별도의 동의를 받은 경우<br>
			&nbsp;&nbsp;&nbsp;2. 다른 법률에 특별한 규정이 있는 경우</span>
        </div>
		<div>
		    <button id="btn_save" class="btn_style">신 청</button>
		    <button id="btn_edit" class="blackBtn btn_style" style="display: none;">적 용</button>
		</div>
	</div>

    <div class="carWrapper" style="display:none;">
<!--         <div class="dropBox" style="top: 50% !important;">이곳에 드롭 해주세요!</div> -->
        <h3 class="title">
            <label id="lbl_cctvList">CCTV 선택</label>
        </h3>
        <div class="box_style">
	    	<div class="info_box">
	    		<span class="title">기준시간</span>
	    		<input type="text" size="12" id="base_date_car" style="width: 80px; vertical-align: middle;"
                            class="in_date base_time_chk datePicker" value="" readonly="readonly"> <select id="base_time_car"
                            class="base_time_chk" style="width: 50px; vertical-align: middle;">
                            <%
                                for (int i = 0; i < 24; i++) {
                            %>
                            <option value="<%=i%>"><%=i%>시
                            </option>
                            <%
                                }
                            %>
                        </select> <select id="base_min_car" class="base_time_chk" style="width: 50px; vertical-align: middle;">
                            <option value="00">00분</option>
                            <option value="10">10분</option>
                            <option value="20">20분</option>
                            <option value="30">30분</option>
                            <option value="40">40분</option>
                            <option value="50">50분</option>
                        </select> 전 <select id="base_term_car" style="width: 50px; vertical-align: middle;">
                            <option value="10">10분</option>
                            <option value="20">20분</option>
                            <option value="30">30분</option>
                            <option value="40">40분</option>
                            <option value="50">50분</option>
                 </select>
                 <input type="hidden" id="crimeLoc" maxlength="100" name="crimeLoc" value=""> <!--class="sendData" style="width: 120px;" -->
	    	</div>
	    	<div class="info_box">
	    		<span class="title">영역검색</span>
	    		<input type="radio" name="spatial" class="drawType" value="Circle" id="circle"><label for="circle">반경</label>
	    		<input type="radio" name="spatial" class="drawType" value="Box" id="box"><label for="box">사각형</label>
	    		<input type="radio" name="spatial" class="drawType" value="Polygon" id="polygon"><label for="polygon">다각형</label>
	    	</div>
	    	<div class="info_box wd100">
	    		<span class="title">차량정보</span>
	    		<!-- <span style="margin-left: 10px; font-weight: bold;">차량유형 : </span>
                <input type="checkbox" class="carAllChk" for="carType"/><span>전체</span>
                <input type="checkbox" class="carType" for="특수"/><span>특수</span>
                <input type="checkbox" class="carType" for="미분류"/><span>미분류</span>
                <input type="checkbox" class="carType" for="승용"/><span>승용</span>
                <input type="checkbox" class="carType" for="승합"/><span>승합</span>
                <input type="checkbox" class="carType" for="화물"/><span>화물</span> -->
                <span style="margin-left: 10px; font-weight: bold;">차량번호 : </span>
                <input type="text" id="carLicenseNo" style="width: 150px; margin: 0; height: 25px;"/>
                <input type="hidden" id="carInfo"/>
	    	</div>
	    	<h3 id="drawCncl" class="hidden pointer title">그리기를 종료하시려면 여기를 눌러주세요.</h3>
	    	<div class="hint text">
                 * 기준시간에 따라 CCTV 선택 시 <b class="red_font">기본 시작시간과 종료시간</b>이 설정됩니다.<br>
            </div>
    	</div>
		<div id="cctv_list_box" style="width: 100%;" align="left">
                        <input type="hidden" class="sendData" id="cctvList" name="cctvList" value="">
                        <table border="0" cellspacing="0" id="tbl_cctv_list_car">
<!--                             <colgroup> -->
<!--                                 <col width="" /> -->
<!--                                 <col width="150" /> -->
<!--                                 <col width="115" /> -->
<!--                                 <col width="115" /> -->
<!--                                 <col width="50" /> -->
<!--                             </colgroup> -->
                            <tr>
                                <th>CCTV 명</th>
                                <!-- <th>미리보기</th> -->
                                <th>시작시간</th>
                                <th>종료시간</th>
                                <th></th>
                            </tr>
                        </table>
        </div>
        <div class="hint text">
              * 지도검색 후 CCTV를 선택하면 CCTV목록에 추가됩니다. CCTV는 <b class="red_font">최대 10개까지 등록</b>할 수 있습니다.<br /> *
              CCTV 시작시간과 종료시간은 <b class="red_font">최대 6시간</b> 차이로 신청할 수 있습니다.<br />
        </div>
        <div>
            <button id="btn_car_save" class="btn_style">신 청</button>
            <button id="btn_car_edit" class="btn_style" style="display: none;">적 용</button>
        </div>
    </div>

        <div class="tviusPopup" id="roadview_pop" style="display:none;">
            <div id="roadview_title_bar">
                <span id="roadview_title">로드뷰</span>
                <button id="roadview_close">
                    <img src="/xeus/res/img/delete_normal2.png" style="cursor: pointer;">
                </button>
            </div>
            <div id="roadview"></div>
        </div>

        <!-- 상태체크 팝업용 -->
        <div class="tviusPopup table_style" id="cctvPop" style="display:none;">
            <div>
                <table cellpadding="0" width="700" cellspacing="0">
                    <colgroup>
                        <col width="100" />
                        <col width="" />
                    </colgroup>
                    <tr>
                        <th colspan="61">
                            <!-- <div style="float: left; border-right: 2px solid #999; height: 100%; margin: 0 5px; padding: 0 10px 0 10px; line-height: 27px;">
                                CCTV 상태
                            </div> -->
                            <div id="cctv_stat_dat" style="float: left; border-right: 2px solid #999; height: 100%; margin: 0 5px; padding-right: 10px; line-height: 28px;"></div>
                            <div style="float: left; line-height: 27px; width: 430px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left;" id="cctv_stat_title"></div>
                            <!-- <div style="float: right;">
                                <span id="cctvPopClose" style="cursor: pointer;"><img
                                    src="/xeus/res/img/close_btn.png" style="width: 18px; margin-top: 5px;"/></span>
                            </div> -->
                        </th>
                    </tr>
                    <tbody id="cctv_stat_body">
                    </tbody>
                </table>

                <div id="stat_load_bar">
                    <div style="width: 100%; height: 70px; margin: 3px auto 5px auto; position: relative;">
                    <span class="loading_img" ></span>
                    </div>
                    <div style="width: 120px; height: 12px; margin: 5px auto 3px auto; color: #ffffff;">불러오는 중...</div>
                </div>

                <div id="stat_hint" style="font-size: 13px; text-align: center;">
                    <b>* CCTV상태는 1분 단위로 확인할 수 있습니다. </b>
                    <b>(</b>
					<div class="stat_bar on" style="width: 7px; height: 18px; vertical-align: top; display: inline-block; background: #5e90af;"></div>
                    <b>: 영상있음 /</b>
                    <div class="stat_bar" style="width: 7px; height: 18px; vertical-align: top; display: inline-block; background: #e5603b;"></div>
                    <b>: 영상없음</b>
                    <b>)</b>
                </div>
            </div>
        </div>

        <div class="tviusPopup" id="prev_del_group" style="display: none;"></div>

        <div class="tviusPopup table_style" id="prev_pop" style="display: none; width: 100%; height: 100%;">

            <div id="prev_attr" style="display: none;"></div>

            <div class="info_group" style="width: 100%; height: 100%;">
                <div style="height:30px;"></div>
                <div id="1_msg" class="text">
                    <p>* 서버 및 네트워크 상태에 따라 5분이상 소요될 수 있습니다.</p>
                    <p>* 진행하시겠습니까?</p>
                </div>

                <div id="2_msg" class="text" style="display: none;">
                    <p id="stand_date">* 미리보기 영상 생성 중 입니다.</p>
                    <p>* 미리보기 영상 생성 중 입니다. 5분이 경과되면 반출실패 처리됩니다.</p>
                    <p style="padding-bottom: 0; margin-bottom: 0;">
                        * 경과시간 [<span id="counter_time"></span>]
                    </p>
                    <div id="file_down_stat"></div>
                    <div id="file_down" style="font-size: 11pt; font-weight: bold"></div>

                    <div id="3_msg" class="textC" style="display: none; height: 70px; margin-left: 20px; line-height: 10px; font-size: 13px; font-weight: 400; color: #666;">
                        <div>미리보기 영상 생성이 완료되었습니다.</div>
                    </div>
                </div>
                <div class="btnDiv" style="text-align: right;">
                    <button id="prev_add" class="grayBtn info_btn btn_style2">확인</button>
                    <button id="prev_close" class="grayBtn info_btn btn_Dstyle">닫기</button>
                </div>
            </div>
        </div>

        <div class="tviusPopup" id="cctv_img_pop" style="display:none;">
            <div style="width: 100%; height: auto; position: relative; margin-bottom: 1px; background: #3e3f48; ">
                <p class="searchTitle popTitle">현장사진 보기</p>
                <button id="cctv_img_pop_close"><img src="/xeus/res/img/close_btn.png" style="width: 20px; cursor: pointer;"></button>
            </div>
            <div id="cctv_img_list" style="overflow-y: hidden; overflow-x: hidden;" align="center"></div>
        </div>

        <div class="tviusPopup" id="cctv_tour_pop" style="display:none;">
            <div style="width: 100%; height: auto; position: relative; margin-bottom: 1px; background: #3e3f48;">
                <p class="searchTitle popTitle">투어링 사진보기</p>
                <button id="cctv_tour_pop_close"><img src="/xeus/res/img/close_btn.png" style="width: 20px; cursor: pointer;"></button>
            </div>
            <div id="cctv_tour_list" style="overflow-y: hidden; overflow-x: hidden;" align="center"></div>
        </div>

<!--         <div class="dialogWrap customScroll table_style" id="official_doc_pop"> -->
<!--            	<table id="officialDocTable" cellspacing="0" class="table_style"> -->
<!--            		<tbody> -->
<!--             		<tr> -->
<!--             			<th>공문목록</th> -->
<!--             		</tr> -->
<!--             		<tr> -->
<!--             			<td id="officialDocParam"> -->
<!--             				<span>공문번호 : </span> -->
<!--             				<input type="text" id="officialDocNo" class="sendData"> -->
<!--             				<span>기간 : </span> -->
<!--             			<input type="text" id="docStartDat" class="datePicker sendData" size="12" readonly="readonly"> -->
<!--                            ~ -->
<!--                            <input type="text" id="docEndDat" class="datePicker sendData" size="12" readonly="readonly"> -->
<!--             			<button class="grayBtn" id="docSearchBtn" style="height: 30px; width:50px; margin:0px 0px 0px 3px;">검색</button></td> -->
<!--             		</tr> -->
<!--             		<tr> -->
<!--             			<td style="height: 390px;"> -->
<!--             				<div style="height:385px;" class="customScroll" data-mcs-theme="minimal-dark"> -->
<!--             					<table id="docSearchResult" style="width: 440px;"> -->
<!--             					</table> -->
<!--             				</div> -->
<!--            				</td> -->
<!--             		</tr> -->
<!--             		<tr> -->
<!--             			<td class="btnDiv" style="height:30px;"> -->
<!--             				<button id="btnDocSave" class="btn_style" style="width: 60px;">선택</button> -->
<!--             			</td> -->
<!--             		</tr> -->
<!--             	</tbody> -->
<!--            	</table> -->
<!--         </div> -->

        <div class="tviusPopup table_style" id="app_rqst_pop" style="display:none; background-color: #282828;">
            <!-- <div style="width: 600px; height: auto; position: relative; margin-bottom: 10px;"> -->
                <!-- <h3 class="searchTitle popTitle" style="padding: 15px;">앱 신청건 선택 <button id="app_rqst_pop_close" class="btn_close"></button></h3> -->
                <div>
	            	<table id="appRqstTable" cellspacing="0">
	            		<thead>
	            			<tr>
		            			<th>신청목록</th>
		            		</tr>
		            		<tr>
		            			<td id="appRqstParam">
		            				<div class="box_style">
		            					<div class="info_box">
		            						<span class="title">신청번호</span>
		            						<input type="text" id="appRqstMgrSeq" class="sendData">
		            					</div>
		            					<div class="info_box">
		            						<span class="title">기간</span>
		            						<input type="text" id="appStartDat" class="datePicker sendData" size="12" readonly="readonly">
		                           			 ~
		                            		<input type="text" id="appEndDat" class="datePicker sendData" size="12" readonly="readonly">
		            					</div>
		            					<button class="grayBtn btn_style" id="appSearchBtn">검색</button>
		            				</div>
		            			</td>
		            		</tr>
	            		</thead>
	            		<tbody>
		            		<tr>
		            			<td style="height: 390px;">
		            				<div style="height:385px;" class="customScroll" data-mcs-theme="minimal-dark">
		            					<table id="appSearchResult">
		            						<colgroup>
				                                <col width="30" />
				                                <col width="120" />
				                                <col width="100" />
				                                <col width="300" />
				                            </colgroup>
				                            <thead>
											    <tr>
											        <th>선택</th>
											        <th>신청번호</th>
											        <th>신청일</th>
											        <th>CCTV목록</th>
											    </tr>
											</thead>
				                            <tbody>
				                            </tbody>
		            					</table>
		            				</div>
	            				</td>
		            		</tr>
		            		<tr>
		            			<td class="btnDiv" style="height:30px;">
		            				<button id="btnAppSave" class="btn_style" style="width: 60px;">선택</button>
		            			</td>
		            		</tr>
		            	</tbody>
	            	</table>
	            </div>
            <!-- </div> -->
        </div>

    </div>
</div>
