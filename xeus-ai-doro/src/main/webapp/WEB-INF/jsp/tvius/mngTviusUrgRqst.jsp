<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.sysmgr.service.OrganizationVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="java.util.HashMap"%>
<%@ include file="../common.jsp" %>
<%
    HashMap<String, String> sysParam = (HashMap<String, String>)request.getAttribute("sysparam");

    String maskingYn = sysParam.get("tvius.masking_yn");

    HashMap<String, String> rst = (HashMap<String, String>)request.getAttribute("result");

%>
<script type="text/javascript" src="<%= context %>/res/geomex.xeus.tvius.usr.rqst.js"></script>
<script type="text/javascript" src="<%=context%>/res/geomex.xeus.tvius.usr.prev.js"></script>
<script type="text/javascript">
    var mgrSeq;
    var userId = '<%=userId%>';
    var chkEdit = '';
    var chkMenu = 'mng';

    SYSTEM_AVI_PLAY_CNT = '<%= sysParam.get("tvius.avi_play_cnt") %>';
    SYSTEM_AVI_PLAY_DAT = '<%= sysParam.get("tvius.avi_play_dat") %>';
    SYSTEM_RENEW_PLAY_CNT = '<%= sysParam.get("tvius.tvius.renew_play_cnt") %>';
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
    SYSTEM_SMI_YN = '<%= sysParam.get("tvius.smi_yn") %>';
</script>

<div id="searchBox">
    <div id="loading_wrap">
        <span id="loading_img"></span> <span id="loading_blank"></span>

    </div>

    <!-- <div class="searchWrapper rqstWrapper" style="height: 40% !important;"> -->
    <!-- <div class="searchWrapper"> -->
    <div class="searchWrapper customScroll" data-mcs-theme="minimal-dark">
        <div class="rqstWrapper">
            <input type="hidden" class="sendData" id="mgrSeq" name="mgrSeq" value="">
            <input type="hidden" class="sendData" id="reqstId" name="reqstId" value="<%=userId%>">
            <input type="hidden" class="sendData" id="reqGbnCd" name="reqGbnCd" value="13">
            <!-- <input type="hidden" class="sendData" id="reqGbnCd" name="reqGbnCd" value="13"> -->
            <input type="hidden" class="sendData" id="reqstResn" name="reqstResn" value="99">
            <input type="hidden" class="sendData" id="crimeTyp" name="crimeTyp" value="99">
            <input type="hidden" class="sendData" id="docNo" name="docNo" value="긴급반출">
        </div>
        <!-- ////////////////////////////////////////////////////////////////////////////// -->

        <div class="aviWrapper">
            <div class="dropBox" style="top: 15%;">이곳에 드롭 해주세요!</div>
            <p class="searchTitle">
                <label id="lbl_cctvList">CCTV 선택</label>
            </p>
            <table>
                <tr>
                    <th>기준시간</th>
                    <td colspan="4">
                        <div class="inBox">
                            <input type="text" size="12" id="base_date" style="width: 80px; vertical-align: middle;"
                                class="in_date base_time_chk datePicker" value=""> <select id="base_time"
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
                                <option value="00">00분</option>
                                <option value="10">10분</option>
                                <option value="20">20분</option>
                                <option value="30">30분</option>
                                <option value="40">40분</option>
                                <option value="50">50분</option>
                            </select> 전 <select id="base_term" style="width: 50px; vertical-align: middle;">
                                <option value="10">10분</option>
                                <option value="20">20분</option>
                                <option value="30">30분</option>
                                <option value="40">40분</option>
                                <option value="50">50분</option>
                            </select>
                        </div>
                        <input type="hidden" id="crimeLoc" maxlength="100" name="crimeLoc" value=""> <!--class="sendData" style="width: 120px;" -->
                    </td>
                </tr>
                <tr>
                    <th>영역 검색</th>
                    <td class="tRight">
                        <input type="radio" name="spatial" class="drawType" value="Circle" id="circle"><label for="circle">반경</label>
                    </td>
                    <td class="tCenter" style="border-left: none !important;">
                        <input type="radio" name="spatial" class="drawType" value="Box" id="box"><label for="box">사각형</label>
                    </td>
                    <td class="tLeft" style="border-left: none !important; height: 30px;">
                        <input type="radio" name="spatial" class="drawType" value="Polygon" id="polygon"><label for="polygon">다각형</label>
                    </td>
                    <!-- <td class="tRight noneBack">
                        <button class="blueBtn" id="spatialBtn">영역 선택</button>
                    </td> -->
                </tr>
                <tr>
                    <th colspan="4" id="drawCncl" class="hidden pointer">그리기를 종료하시려면 여기를 눌러주세요.</th>
                </tr>
                <tr>
                    <td style="border-bottom: none;"></td>
                    <td colspan="4" style="border-left: none; border-bottom: none; height: 40px;">
                        <div class="hint">
                            * 기준시간에 따라 CCTV 선택 시 <b class="red_font">기본 시작시간과 종료시간</b>이 설정됩니다.<br>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" align="left">
                        <div id="cctv_list_box" style="width: 100%;" align="left">
                            <input type="hidden" class="sendData" id="cctvList" name="cctvList" value="">

                            <table border="0" cellspacing="0" id="tbl_cctv_list">
                                <!-- width="100%" style="min-width:1000px; " -->
                                <colgroup>
                                    <col width="" />
                                    <col width="150" />
                                    <col width="115" />
                                    <col width="115" />

                                    <%
                                    if ( !"0".equals(maskingYn) ){
                                    %>
                                    <col width="50" />
                                    <%
                                    }
                                    %>
                                    <!-- <col width="50" /> -->

                                    <col width="50" />

                                </colgroup>
                                <tr>
                                    <th>CCTV 명</th>
                                    <th>미리보기</th>
                                    <th>시작시간</th>
                                    <th>종료시간</th>

                                    <%
                                    if ( !"0".equals(maskingYn) ){
                                    %>
                                    <th>마스킹</th>
                                    <%
                                    }
                                    %>
                                    <!-- <th>비밀번호</th> -->
                                    <!-- <th>재생만료일</th> -->
                                    <th></th>
                                </tr>
                            </table>
                        </div>
                        <div class="hint">
                            * 지도검색 후 CCTV를 선택하면 CCTV목록에 추가됩니다. CCTV는 <b class="red_font">최대 10개까지 등록</b>할 수 있습니다.<br /> *
                            CCTV 시작시간과 종료시간은 <b class="red_font">최대 6시간</b> 차이로 신청할 수 있습니다.<br />
                        </div>
                    </td>
                </tr>
            </table>
            <div class="btnDiv">
                <button id="btn_save" class="blackBtn" style="width: 80px; height: 25px;">신 청</button>
            </div>

            <div id="roadview_pop">
                <div id="roadview_title_bar">
                    <span id="roadview_title">로드뷰</span>
                    <button id="roadview_close">
                        <img src="/xeus/res/img/delete_normal.png">
                    </button>
                </div>
                <div id="roadview"></div>
            </div>

            <!-- 상태체크 팝업용 -->
            <div class="bpopup" id="cctvPop">
                <div><!--  style="width: 100%; background: #f6f6f6" -->
                    <table cellpadding="0" width="700" cellspacing="0">
                        <colgroup>
                            <col width="100" />
                            <col width="" />
                        </colgroup>
                        <tr>
                            <th colspan="61">
                                <div style="float: left; border-right: 2px solid #999; height: 100%; margin: 0 5px; padding: 0 10px 0 10px; line-height: 27px;">
                                    CCTV 상태
                                </div>
                                <div id="cctv_stat_dat" style="float: left; border-right: 2px solid #999; height: 100%; margin: 0 5px; padding-right: 10px; line-height: 28px;"></div>
                                <div style="float: left; line-height: 27px;" id="cctv_stat_title"></div>
                                <div style="float: right;">
                                    <span id="cctvPopClose" style="cursor: pointer;"><img
                                        src="/xeus/res/img/close_btn.png" style="width: 18px; margin-top: 5px;"/></span>
                                </div>
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

                    <div id="stat_hint">
                        <div>
                            * CCTV상태는 1분 단위로 확인할 수 있습니다.(
                            <div class="stat_bar on"
                                style="width: 7px; height: 18px; vertical-align: top; display: inline-block;"></div>
                            : 영상있음 /
                            <div class="stat_bar"
                                style="width: 7px; height: 18px; vertical-align: top; display: inline-block;"></div>
                            : 영상없음)
                        </div>
                    </div>
                </div>
            </div>

            <div id="prev_del_group" style="display: none;"></div>

            <div id="prev_pop">
                <p class="searchTitle popTitle" style="width: 450px; padding-left: 10px;">동영상 미리보기</p>

                <div id="prev_attr" style="display: none;"></div>

                <div class="info_group">
                    <div style="height:30px;"></div>
                    <div id="1_msg" style="height: 70px; margin-left: 20px; line-height: 10px; font-size: 13px; font-weight: 400; color: #fff;">
                        <p>* 서버 및 네트워크 상태에 따라 5분이상 소요될 수 있습니다.</p>
                        <p>* 진행하시겠습니까?</p>
                    </div>

                    <div id="2_msg" style="display: none; height: 70px; margin-left: 20px; line-height: 10px; font-size: 13px; font-weight: 400; color: #fff;">
                        <p id="stand_date">* 미리보기 영상 생성 중 입니다.</p>
                        <p>* 미리보기 영상 생성 중 입니다. 5분이 경과되면 반출실패 처리됩니다.</p>
                        <p style="padding-bottom: 0; margin-bottom: 0;">
                            * 경과시간 [<span id="counter_time"></span>]
                        </p>
                        <div id="file_down_stat"></div>
                        <div id="file_down" style="font-size: 11pt; font-weight: bold"></div>

                        <!-- <div id="3_msg" class="textC" style="display: none; height: 70px; margin-left: 20px; line-height: 10px; font-size: 13px; font-weight: 400; color: #666;">
                            <div>미리보기 영상 생성이 완료되었습니다.</div>
                        </div> -->
                    </div>
                    <div class="btnDiv">
                        <button id="prev_add" class="grayBtn info_btn">확인</button>
                        <button id="prev_close" class="grayBtn info_btn">닫기</button>
                    </div>
                </div>
            </div>

            <div id="cctv_img_pop">
                <div style="width: 100%; height: auto; position: relative; margin-bottom: 3px; background: #3e3f48; padding-bottom: 10px;">
                    <!-- background:url(../../img/table_title_bg.png); -->
                    <!-- <h3 id="tl_main">
                        현장사진 보기<span id="cctv_img_pop_close"
                            style="cursor: pointer; float: right; margin-right: 15px; margin-top: 4px;"><img
                            src="/xeus/res/img/btn_close.png" /></span>
                    </h3> -->
                    <p class="searchTitle popTitle">현장사진 보기</p>
                    <button id="cctv_img_pop_close"><img src="/xeus/res/img/close_btn.png" style="width: 20px;"></button>
                </div>
                <!-- <div class="img_hint" style="padding-left:5px;">* 이미지를 클릭하면 원본 이미지 크기의 팝업창이 열립니다.</div> -->
                <div id="cctv_img_list" style="overflow-y: hidden; overflow-x: hidden;" align="center"></div>
            </div>
        </div>
    </div>
</div>