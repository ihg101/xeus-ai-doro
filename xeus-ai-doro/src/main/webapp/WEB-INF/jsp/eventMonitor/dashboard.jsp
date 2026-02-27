<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../common.jsp" %>
<style>
#evtTable { width: 98%; }
#evtTable th { border-bottom: 1px solid #868686; }
#ctntTable .thhead { border-bottom: 1px solid #868686; border-top: 1px solid #868686; padding: 5px 0px; }
#ctntTable .thbody { border-bottom: 1px solid #868686; padding: 5px 0px; width: 65px; }
#ctntTable .ctntTd { padding-left: 10px; }
#wsStat { position: absolute; right: 10px; top: 13px; width: 10px; }
.pointBtn, #evetPinBtn {
	background: #333333;
    color: #fff;
    border: 1px #333333 solid;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    padding: 5px;
    outline: none;
}
.pointBtn[active=active], #evetPinBtn[active=active] {
	border: 1px #cccccc solid;
    background: #ffffff;
    font-size: 12px;
    font-weight: 800;
    color: #666;
    cursor: pointer;
    padding: 5px;
    outline: none;
}
</style>
<script>
$("#widget-point").find(".pointBtn").click(function(){
	if($(this).attr("active") == "active"){
		$("#widget-point").find(".pointBtn").attr("active", "");
		//$("#widget-point").find("th").eq(1).text("");
	}else{
		$("#widget-point").find(".pointBtn").attr("active", "");
		$(this).attr("active", "active");
		/* if($(this).attr("id") == "dis"){
			$("#widget-point").find("th").eq(1).text("지도의 임의지점을 지정하여 CCTV를 재생할 수 있습니다.");
		}else{
			$("#widget-point").find("th").eq(1).text("지도의 임의지점을 지정하여 교통정보센터 CCTV를 재생할 수 있습니다.");
		} */
	}
});

$("#widget-evtList").find("#evetPinBtn").click(function(){
	if($(this).attr("active") == "active"){
		evetPin = false;
		$(this).attr("active", "").text("이벤트 고정 시작");
		$("#widget-evtList").find("#evetPinTxt").text("새로운 재난이 발생될 경우 지도가 자동으로 이동됩니다.");
	}else{
		evetPin = true;
		$(this).attr("active", "active").text("이벤트 고정 해제");
		$("#widget-evtList").find("#evetPinTxt").text("새로운 재난이 발생될 경우 지도가 움직이지 않습니다.");

		if($("#widget-point").find(".pointBtn").eq(0).attr("active") == "active") $("#widget-point").find(".pointBtn").eq(0).attr("active", "");
		if($("#widget-point").find(".pointBtn").eq(1).attr("active") == "active") $("#widget-point").find(".pointBtn").eq(1).attr("active", "");
	}
});
</script>
<div id="overlay-west-bar" class="overlay-bar">
	<b class="overlay-bar-title">대시보드</b>
</div>
<div id="overlay-west-contents" class="customScroll" data-mcs-theme="minimal-dark">
	<div id="viewWrapper">
		<div class="widgets">

			<!-- 이벤트발생목록 위젯 -->
			<div id="widget-evtList" class="widget">
				<div class="widget-header">실시간 이벤트 리스트<img id="wsStat" src="../res/img/red.png"></div>
				<div class="widget-content">
					<div id="listWrap" class="customScroll" data-mcs-theme="minimal-dark" style="height: 185px;">
						<table id="evtTable" cellspacing="0">
							<thead>
								<tr>
									<th></th>
									<th>종류</th>
									<th>상태</th>
									<th style="width: 180px;">주소</th>
									<th style="width: 115px;">발생일</th>
									<th>확인</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
					<div class="ctntWrap">
						<table id="ctntTable" style="width: 100%;" cellspacing="0">
							<tr>
								<th colspan="4" class="thhead">상세정보</th>
							</tr>
							<tr>
								<th class="thbody">종류</th>
								<td id="statEvetNm" class="ctntTd"></td>
								<th class="thbody">발생일</th>
								<td id="statEvetOutbDtm" class="ctntTd"></td>
							</tr>
							<tr>
								<th class="thbody">위치(X)</th>
								<td id="outbPosX" class="ctntTd"></td>
								<th class="thbody">위치(Y)</th>
								<td id="outbPosY" class="ctntTd"></td>
							</tr>
							<tr>
								<th class="thbody">위치</th>
								<td id="outbPosNm" class="ctntTd"></td>
								<th class="thbody">유형</th>
								<td id="statEvetType" class="ctntTd"></td>
							</tr>
							<tr>
								<th class="thbody" style="border-bottom: none;">내용</th>
								<td colspan="3" id="statEvetCntn" class="ctntTd"></td>
							</tr>
							<tr>
								<td colspan="2" class="thhead" align="center">
									<button id="evetPinBtn" active="">이벤트 고정 시작</button>
								</td>
								<th colspan="2" class="thhead" align="center" id="evetPinTxt">새로운 재난이 발생될 경우 지도가 자동으로 이동됩니다.</th>
							</tr>
						</table>
					</div>
				</div>
			</div>

		</div>
	</div>
</div>