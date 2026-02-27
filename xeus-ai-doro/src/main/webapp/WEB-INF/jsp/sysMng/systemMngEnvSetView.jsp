<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ page import="java.util.HashMap"%> --%>
<%@ page import="java.util.Arrays"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="geomex.xeus.sysmgr.service.SysPropVo"%>
<%@ page import="com.google.common.base.CaseFormat"%>
<%@ include file="../common.jsp" %>
<%!
    private static String firstCharToLowerCase(String str) {
        if(str == null || str.length() == 0)
            return "";

        if(str.length() == 1)
            return str.toLowerCase();

        char[] chArr = str.toCharArray();
        chArr[0] = Character.toLowerCase(chArr[0]);

        return new String(chArr);
    }

    public String toCamelCase(String input){
        String str = CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.UPPER_CAMEL, input);
        str = firstCharToLowerCase(str);

        return str;
    }
%>
<%

    //HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");


    ArrayList<SysPropVo> list = (ArrayList<SysPropVo>)request.getAttribute("list");

    //수정하지 않는 항목의 키값을 배열에 저장한다.
    String[] exceptList = {
   		"api.air.station.url", "api.air.url", "api.data.key", "api.kakao.key", "api.kakao.url", "api.proxy.chk"
   		, "api.proxy.url", "api.rader.url", "api.satelite.url", "api.typhoon.url", "api.weather.url"
   		, "event.bell.url", "event.car.ftp", "event.evt112", "event.evt119", "event.evtDsc", "event.relay.http"
   		, "nms.lora.cctv.url", "bell.response.url", "api.its.url", "api.its.key", "api.its.bbox"
   		, "sms.send.url", "event.vurix.url", "event.smart.url", "cctv.list.req.url"
   		, "sys.download_path", "sys.upload_path", "tray.file.nm", "chrome.file.nm", "player.file.nm"

   		, "tvius.last_sms_dat", "tvius.hash_files", "player.manual.file.nm", "tvius.storage_path"
   		, "map.proxy.chk", "map.proxy.url", "map.tile.url", "map.syncbtn.visible.chk"
   		, "nms.lora.ap.chk", "nms.lora.cctv.chk", "nms.lora.cctv.url", "nms.lora.status.interval"
		, "event.pump.chk", "event.pump.interval", "event.pump.warn.rainday", "event.pump.warn.rainhour"
		, "event.smart.chk", "event.smart.url", "event.dementia.chk", "event.dementia.interval"
		, "messeanger.send.url", "event.vurix.gateway.url", "event.aws.chk", "nms.status.snmp"
		, "event.aws.interval", "event.vurix.chk", "api.temperatures.url", "map.emap.url", "ndms.fire.url"
		, "nms.mem.warn.value", "nms.rep.chk", "nms.rep.interval", "nms.status.chk", "nms.status.cpu.warn", "nms.status.interval"
		, "nms.status.mem.warn", "nms.cpu.warn.value", "pledge.file.nm", "layer.file.nm", "event.sms.callbacknum", "api.its.interval", "api.its.chk"
		, "cctv.mobileshare.url", "event.fireiot.chk", "event.fireiot.interval", "tvius.sms_avi_cm", "tvius.sms_capture_cm"
		, "tvius.sms_preview_cm", "tvius.sms_renew_cm", "xeus.event.chk", "xeus.event.full.url", "xeus.event.gate.url"
		, "xeus.event.platform.url", "sys.table_img_upload_path", "tvius.admin_sms_list", "pest.admin_sms_list", "saenoon.send.url"
		, "saeol.url", "service.ap.url", "service.streetlamp.url", "service.illpark.url", "tvius.preview_avi"
		, "tvius.preview_photo", "service.embell.url", "service.capture.mng.url", "service.heating.cable.url", "pest.img.path"
		, "api.data.url", "api.marin.weather", "api.ocean.grid", "api.ocean.map", "cctv.net_dist_limit", "event.evt119.tea", "event.vurix.image.path", "event.vurix.receive.url", "event.vurix.tour.end", "event.vurix.tour.start", "nms.rep.fcl_gbn_cd", "tvius.mask_route_af", "tvius.mask_route_bf", "tvius.masking_yn"
		, "nms.cctv.excel.yn"
    };

    String[] checkboxList = {"tvius.preview_avi", "tvius.preview_photo", "nms.lora.cctv.chk", "nms.lora.ap.chk", "event.pump.chk", "nms.rep.chk", "nms.status.chk", "tvius.masking_yn"};
    String[] dayLimitList = {};
    String[] hourList = {"smartpark.longterm.parking"};
    String[] dayList = {"tvius.avi_play_dat", "tvius.renew_play_dat"};
    String[] minuteList = {"tvius.avi_play_time", "cctv.preview_time"};
    String[] secondList = {"event.pump.interval", "nms.lora.status.interval", "nms.rep.interval", "nms.status.interval"};
    String[] percentageList = {"nms.cpu.warn.value", "nms.mem.warn.value", "aws.limit.humi"};
    String[] distList = {"cctv.net_dist_limit"};
    String[] cntList = {"sys.login_lock_cnt", "tvius.avi_play_cnt", "tvius.evi_play_cnt", "tvius.file_down_cnt", "tvius.renew_play_cnt", "tvius.rqst_lock_cnt"};
    String[] bigStrList = {};

    String[] awsLimitCmList = {"aws.limit.flow.jc","aws.limit.flow.jp","aws.limit.flow.md","aws.limit.flow.s","aws.limit.flow.ws"};
    String[] awsLimitMmList = {"aws.limit.rain"};
    String[] awsLimitDoList = {"aws.limit.temp"};

    HashMap<String, String> info = new HashMap<String, String>();


    info.put("tvius.admin_sms_list", "<span>- 사용자가 영상반출 신청을 했을 때, 문자를 받을 아이디를 설정합니다.</span><br>"
            						+"<span>- 목록은 최대 <span class='text_highlight'>3명</span>까지 지정 가능합니다.</span>");
    info.put("tvius.avi_play_cnt",   "<span>- 사용자가 영상반출 신청을 했을 때, 기본으로 적용되는 재생횟수를 설정할 수 있습니다.</span><br>"
                                    +"<span>- 재생횟수는 <span class='text_highlight'>3자리 이하</span>로 입력하셔야 합니다.</span>");
    info.put("tvius.avi_play_dat",   "<span>- 사용자가 영상반출 신청 시, 기본으로 적용되는 최대 재생기간을 설정할 수 있습니다.<br></span>"
                                    +"<span>- 재생기간은 <span class='text_highlight'>3자리 이하</span>로 입력하셔야 합니다.<br></span>");
    info.put("tvius.renew_play_cnt", "<span>- 연장신청을 [승인]할 때 추가 <span class='text_highlight'>재생횟수 기본 값</span>을 설정할 수 있습니다.<br></span>"
                                    +"<span>- 재생횟수는 <span class='text_highlight'>3자리 이하</span>로 입력하셔야 합니다.<br></span>");
    info.put("tvius.renew_play_dat", "<span>- 연장신청을 [승인]할 때 추가 <span class='text_highlight'>재생기간 기본 값</span>을 설정할 수 있습니다.<br></span>"
                                    +"<span>- 재생기간은 <span class='text_highlight'>3자리 이하</span>로 입력하셔야 합니다.<br></span>");
    info.put("tvius.evi_play_cnt",   "<span>- 증거신청을 [승인]할 때 추가 <span class='text_highlight'>재생횟수 기본 값</span>을 설정할 수 있습니다.<br></span>"
                                    +"<span>- 재생횟수는 <span class='text_highlight'>3자리 이하</span>로 입력하셔야 합니다.<br></span>");
    info.put("tvius.avi_play_time",  "<span>- 사용자의 영상 미리보기의 시간을 설정할 수 있습니다.<br></span>"
                                    +"<span>- 최대 시간은 <span class='text_highlight'>10분</span> 입니다.<br></span>");
    info.put("tvius.rqst_lock_cnt",  "<span>- 영상반출신청은 활용결과 미입력건수가 관리자가 지정한 건수보다 초과되면 사용자의 영상반출신청이 제한됩니다. <br></span>"
                                    +"<span>- 반출영상신청제한은 <span class='text_highlight'>2자리 이하</span>로 입력하셔야 합니다.<br></span>");
    info.put("sys.login_lock_cnt",   "<span>- 로그인 시도 횟수를 초과한 사용자는 시스템 로그인이 제한됩니다.<br></span>"
                                    +"<span>- 로그인 재시도 횟수는 <span class='text_highlight'>5회 이하</span>로 입력하셔야 합니다.</span>");
    info.put("tvius.last_sms_dat",   "<span>- 사용자가 반출신청한 건수에 <span class='text_highlight'>재생만료일 알림 문자</span>를 몇 일 전부터 전송할지를 설정할 수 있습니다.<br></span>"
                                    +"<span>- 해당 만료일은 <span class='text_highlight'>최대 10일</span>까지 지정할 수 있습니다.<br></span>");
    info.put("tvius.file_down_cnt",  "<span>- 사용자가 영상을 다운로드할 수 있는  횟수를 지정합니다.<br></span>"
                                    +"<span>- 다운로드 횟수는 <span class='text_highlight'>최대 2자리 이하</span>로 입력하셔야합니다.</span>");
    info.put("cctv.net_dist_limit",  "<span>- 투망 모니터링 거리 제한을 설정합니다.<br></span>"
                                    +"<span>- '0'을 입력할 경우 <span class='text_highlight'>무제한</span>으로 설정됩니다.</span>");
    info.put("cctv.preview_time",  "<span>- 선영상 조회 시 CCTV 재생 시간(분)을 설정합니다.</span>");
    info.put("tvius.preview_avi",    "<span class='one_line_span'>- 영상 반출 신청 시 <span class='text_highlight'>동영상 미리보기</span> 가능여부를 선택합니다.</span>");
    info.put("tvius.preview_photo",  "<span class='one_line_span'>- 영상 반출 신청 시 <span class='text_highlight'>사진 미리보기</span> 가능여부를 선택합니다.</span>");


    info.put("event.dementia.chk",  "<span class='one_line_span'>- 치매노인 갱신여부를 선택합니다.</span>");
    info.put("event.dementia.interval",   "<span>- 치매노인 갱신 주기를 설정할 수 있습니다.<br></span>"
            						+"<span>- 갱신주기는 <span class='text_highlight'>2자리 이하</span>로 입력하셔야 합니다.<br></span>");
    info.put("event.pump.chk",  "<span class='one_line_span'>- 펌프장 갱신여부를 선택합니다.</span>");
    info.put("event.pump.interval",   "<span>- 펌프장 갱신 주기를 설정할 수 있습니다.<br></span>"
									+"<span>- 갱신주기는 <span class='text_highlight'>2자리 이하</span>로 입력하셔야 합니다.<br></span>");
    info.put("event.pump.warn.rainday",  "<span class='one_line_span'>- 일 강우량 경고값을 설정합니다.</span>");
    info.put("event.pump.warn.rainhour",  "<span class='one_line_span'>- 시간 강우량 경고값을 설정합니다.</span>");
    info.put("event.sms.callbacknum",  "<span class='one_line_span'>- SMS발신자(회신)번호를 설정합니다.</span>");

    info.put("nms.cpu.warn.value",  "<span class='one_line_span'>- CPU사용률경고(%) 제한을 설정합니다..</span>");
    info.put("nms.mem.warn.value",  "<span class='one_line_span'>- 메모리사용률경고(%) 제한을 설정합니다..</span>");

    info.put("nms.lora.ap.chk",  "<span class='one_line_span'>- LoRA-AP상태체크여부를 설정합니다.</span>");
    info.put("nms.lora.cctv.chk",  "<span class='one_line_span'>- LoRA CCTV상태체크여부를 설정합니다.</span>");
    info.put("nms.lora.status.interval",   "<span class='one_line_span'>- LoRA 상태체트주기(초)를 설정할 수 있습니다.<br></span>");

    info.put("nms.rep.chk",  "<span class='one_line_span'>- REP체크여부를 설정합니다.</span>");
    info.put("nms.rep.interval",   "<span class='one_line_span'>- REP체크추기(초)를 설정할 수 있습니다.<br></span>");

    info.put("nms.status.chk",  "<span class='one_line_span'>- 장비상태체크여부를 설정합니다.</span>");
    info.put("nms.status.interval",   "<span class='one_line_span'>- 장비상태체크주기(초)를 설정할 수 있습니다.<br></span>");

    info.put("aws.limit.humi",  "<span class='one_line_span'>- 습도 임계치 값을 설정합니다.</span>");
    info.put("aws.limit.temp",  "<span class='one_line_span'>- 온도 임계치 값을 설정합니다.</span>");
    info.put("aws.limit.rain",  "<span class='one_line_span'>- 강우 임계치 값을 설정합니다.</span>");
    info.put("aws.limit.flow.jc",  "<span class='one_line_span'>- <span class='text_highlight'>제천천</span>의 수위 임계치 값을 설정합니다.</span>");
    info.put("aws.limit.flow.jp",  "<span class='one_line_span'>- <span class='text_highlight'>장평천</span>의 수위 임계치 값을 설정합니다.</span>");
    info.put("aws.limit.flow.md",  "<span class='one_line_span'>- <span class='text_highlight'>무도천</span>의 수위 임계치 값을 설정합니다.</span>");
    info.put("aws.limit.flow.s",  "<span class='one_line_span'>- <span class='text_highlight'>성천</span>의 수위 임계치 값을 설정합니다.</span>");
    info.put("aws.limit.flow.ws",  "<span class='one_line_span'>- <span class='text_highlight'>원서천</span>의 수위 임계치 값을 설정합니다.</span>");

    info.put("tvius.masking_yn",  "<span class='one_line_span'>- 영상 반출 신청 시 <span class='text_highlight'>마스킹</span> 가능여부를 선택합니다.</span>");
    info.put("tvius.mask_route_af",  "<span class='one_line_span'>- 마스킹 작업 시 사용하게 될 <span class='text_highlight'>작업 전</span> 경로를 지정합니다.</span>");
    info.put("tvius.mask_route_bf",  "<span class='one_line_span'>- 마스킹 작업 시 사용하게 될 <span class='text_highlight'>작업 후</span> 경로를 지정합니다.</span>");

    info.put("smartpark.longterm.parking",  "<span class='one_line_span'>- 장기 주차 여부를 판별할 시간을 설정합니다.</span>");
%>
<!-- <link rel="stylesheet" type="text/css" href="./res/css/xeus.systemMng.envSet.css"> -->
<script type="text/javascript" src="./res/menu/systemMngView/geomex.xeus.system.mng.env.set.js"></script>
<div class="customScroll contentWrapper">
    <div id="wrap">
<!--         <div id="title">시스템 환경설정</div> -->

        <div id="contentEnvSet" class="customScroll">
            <table>
                <colgroup>
                    <col width="250"/>
                    <col width="250"/>
                    <col width=""/>
                </colgroup>
<%
	boolean isContains = false;
	String lastGrpStr = null;
    for(int i=0; i<list.size(); i++){
        if(Arrays.asList(exceptList).contains(list.get(i).getPropKey())){
%>
                <!-- 현재 수정하지 않는 항목에 별도의 작업을 해야된다면 이쪽에서 처리 -->
                <%-- <input id="<%=toCamelCase(list.get(i).getPropKey().split(".")[1])%>" type="hidden" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> 회 --%>
<%
        } else{
        	String grpStr = list.get(i).getPropKey().split("\\.")[0].toUpperCase();
        	if("API".equals(grpStr)) grpStr = "외부 API";
        	if("BELL".equals(grpStr)) grpStr = "비상벨";
        	if("CCTV".equals(grpStr)) grpStr = "CCTV";
        	if("EVENT".equals(grpStr)) grpStr = "이벤트 연계";
        	if("NMS".equals(grpStr)) grpStr = "NMS";
        	if("SYS".equals(grpStr)) grpStr = "시스템";
        	if("TVIUS".equals(grpStr)) grpStr = "영상반출 및 영상반출관리";
        	if("SMARTPARK".equals(grpStr)) grpStr = "스마트주차";

        	if(!grpStr.equals(lastGrpStr)){
        		lastGrpStr = grpStr;
        		isContains = false;
        	}else{
        		isContains = true;
        	}
			if(!isContains){
%>
        		<tr>
        			<th colspan="3"><%= grpStr %></th>
        		</tr>
<%
			}
%>
                <tr>
                    <th><%= list.get(i).getPropNm() %></th>
                    <td>

<%
            if(Arrays.asList(checkboxList).contains(list.get(i).getPropKey())){
%>
						<!-- toCamelCase(list.get(i).getPropKey().split("\\.")[1]) -->
                        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" type="checkbox" <%= (StrUtil.chkNull(list.get(i).getPropValue()).equals("Y") ? "checked" : "") %>>
<%
            } else if(Arrays.asList(dayLimitList).contains(list.get(i).getPropKey())){
%>
                        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> 일 전
<%
            } else if(Arrays.asList(dayList).contains(list.get(i).getPropKey())){
            	%>
                <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> 일
<%
		    } else if(Arrays.asList(hourList).contains(list.get(i).getPropKey())){
		    	%>
		        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> 시간
<%
			} else if(Arrays.asList(minuteList).contains(list.get(i).getPropKey())){
%>
                        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> 분
<%
            } else if(Arrays.asList(secondList).contains(list.get(i).getPropKey())){
%>
                		<input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> 초
<%
    		} else if(Arrays.asList(percentageList).contains(list.get(i).getPropKey())){
%>
                		<input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> %
<%
    		} else if(Arrays.asList(distList).contains(list.get(i).getPropKey())){
%>
                        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> M
<%
            } else if(Arrays.asList(cntList).contains(list.get(i).getPropKey())){
%>
                        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> 회
<%
            } else if(Arrays.asList(awsLimitCmList).contains(list.get(i).getPropKey())){
    			%>
                <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" maxlength="4" style="width:197px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> cm
<%
    		} else if(Arrays.asList(awsLimitMmList).contains(list.get(i).getPropKey())){
    			%>
                <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" maxlength="4" style="width:197px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> mm
<%
    		} else if(Arrays.asList(awsLimitDoList).contains(list.get(i).getPropKey())){
    			%>
                <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" maxlength="2" style="width:197px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>"> ℃
<%
    		} else {
                if(Arrays.asList(bigStrList).contains(list.get(i).getPropKey())){
%>
                        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" type="text" class="sendData tCenter"
                        style="width:99%; padding-left: 10px; text-align: left;" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>">
<%
                } else{
                	if("tvius.admin_sms_list".equals(list.get(i).getPropKey())){
%>
						<input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="hidden" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>">
						<button id="btn_sms_pop" class="blackBtn btn_Dstyle">SMS목록관리</button>
<%
                	} else {
%>
                        <input id="<%=toCamelCase(list.get(i).getPropKey().replaceAll("\\.", "\\_"))%>" style="width:200px;" type="text" class="sendData tCenter" value="<%= StrUtil.chkNull(list.get(i).getPropValue()) %>">
<%
                	}
                }
            }
%>
                    </td>
                    <td>
                        <!-- 설명 추가하는 작업 해야 함.
                                                        미리보기 권한은 preview가 앞으로 오게해서 뭉칠 수 있도록 조정(order by 되서 들어오니까 예쁘게 리스트화되게)
                         -->
                        <%= StrUtil.chkNull(info.get(list.get(i).getPropKey())) %>
                    </td>
                </tr>
<%
        }
    }
%>
            </table>
        </div>

        <div class="btnDiv" style="text-align:center; margin-top: 15px;">
            <button id="btn_save" class="btn_style2" style="width: 80px; height: 30px;">저 장</button>
            <button id="btn_reset" class="btn_Dstyle2" style="width: 80px; height: 30px;">초 기 화</button>
        </div>

        <div class="bpopup hidden" id="sms_pop_wrap" style="height: 500px;">
		    <div id="bpop_wrap" style="height: 435px;">
		        <h2 id="bpop_title">
		            SMS 발송목록 지정
		            <img id="closeEditPop" class="bpopClose" style="width:16px;height:16px;float:right;background-color:#00000000" src="/xeus/res/img/delete_normal.png">
		        </h2>
		        <div style="height: 400px;" class="customScroll" data-mcs-theme="minimal-dark">
			        <table>
			        	<tbody><!--  style="width: 300px;" -->
			        	</tbody>
			        </table>
		        </div>
		    </div>
		    <div class="btnDiv">
		    	<button id="btnSmsSave">저장</button>
	        </div>
		</div>

    </div>
</div>
