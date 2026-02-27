<%@page import="org.omg.PortableInterceptor.USER_EXCEPTION"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ page import="geomex.xeus.util.code.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.TreeSet"%>
<%@ include file="../common.jsp"%>
<%-- <%@ page import="java.util.ArrayList"%> --%>
<%

    CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

	/* CD51 // 8대중과실 */
	HashMap<String, String> cctvGbnCd = cde.convertCodeGrpToAllCde("C14");
	Set<String> cctvGbnCdKey = new TreeSet<String>(cctvGbnCd.keySet());
	Iterator<String> cctvGbnCdItr = cctvGbnCdKey.iterator();

    //HashMap<String, String> param = (HashMap<String, String>)request.getAttribute("param");

%>
<%-- <script type="text/javascript" src="<%=context%>/res/geomex.xeus.tvius.mng.rqst.view.js"></script> --%>
<script type="text/javascript">

$(".allChk").change(function(){
	var target = $(this).attr("for");

	if($(this).is(":checked"))
		$(this).closest('table').find('.'+target).prop('checked', true);
	else
		$(this).closest('table').find('.'+target).prop('checked', false);
});

$(".contentWrapper").find("label").click(function(){
	$(this).prev().click();
});

$(".contentWrapper").find("#searchBtn").click(function(){
	
	var target = $(this).attr("for");
	//Public.STAT.Map.Clear();
	//if(statCctvHeatLayer != null) statCctvHeatLayer.getSource().clear();
	//if(statEvtHeatLayer != null) statEvtHeatLayer.getSource().clear();

	if(target == "cctv"){
		var gbnCd = new Array();
		$("#cctv .gbnCd").each(function(){
			if($(this).is(":checked")) gbnCd.push($(this).attr("for"));
		});

		if(gbnCd.length == 0){
			alert('설치목적을 선택하여 주십시오.');
			return false;
		}
		//TODO 차트인데 지도에 히트맵 뿌려주는 것이 필요하다
// 		if(statCctvHeatLayer == null){
// 			statCctvHeatLayer = xeusLayout.mapService.createHeatLayer(Layers["asset_cctv_heat"]);
// 			statCctvHeatLayer.setVisible(false);
// 			xeusLayout.mapService.getMap().addLayer(statCctvHeatLayer);
// 		}

		var _param = {};
		//_param["gbnCd"] = gbnCd.toString();
		_param["gbnCd"] = gbnCd.join('{|}');

		_common.callAjax("/cctv/getHeatList.json", _param, function(json) {
			if (json.result){
				var $target = $(".contentWrapper").find("#searchResult");
				$target.html('');

				var str = '';
				if(json.result.length == 0){
					str = '<tr><td colspan="2" class="tCenter">검색결과가 존재하지 않습니다.</td></tr>';
				}else {
					for(var i=0; i<json.result.length; i++)
						str +='<tr><td class="tCenter">'+_common.getCodeByName('C14', json.result[i].gbnCd)+'</td><td class="tCenter">'+json.result[i].gbnCnt+'</td></tr>';
				}
				$target.append(str);
			}
		});

		statCctvHeatLayer.getSource().clear();
		Layers["asset_cctv_heat"].loadFunction(statCctvHeatLayer, gbnCd.toString());
		statCctvHeatLayer.setVisible(true);
		if(statEvtHeatLayer != null){
			statEvtHeatLayer.getSource().clear();
			statEvtHeatLayer.setVisible(false);
		}
	} else if(target == "evt"){
		var evtNm = new Array();
		$("#evt .evtNm").each(function(){
			if($(this).is(":checked")) evtNm.push($(this).attr("for"));
		});

		if(evtNm.length == 0){
			alert('이벤트유형을 선택하여 주십시오.');
			return false;
		}
		//TODO 히트맵
// 		if(statEvtHeatLayer == null){
// 			statEvtHeatLayer = xeusLayout.mapService.createHeatLayer(Layers["mon_evet_hist"]);
// 			statEvtHeatLayer.setVisible(false);
// 			xeusLayout.mapService.getMap().addLayer(statEvtHeatLayer);
// 		}

		var _param = {};
		//_param["evtNm"] = evtNm.toString();
		_param["evtNm"] = evtNm.join('{|}');

		_common.callAjax("/eventHist/getHeatList.json", _param, function(json) {
			if (json.result){
				var $target = $(".contentWrapper").find("#searchResult");
				$target.html('');

				var str = '';
				if(json.result.length == 0){
					str = '<tr><td colspan="2" class="tCenter">검색결과가 존재하지 않습니다.</td></tr>';
				}else {
					for(var i=0; i<json.result.length; i++)
						str +='<tr><td class="tCenter">'+json.result[i].evtNm+'</td><td class="tCenter">'+json.result[i].evtCnt+'</td></tr>';
				}
				$target.append(str);
			}
		});

		statEvtHeatLayer.getSource().clear();
		Layers["mon_evet_hist"].loadFunction(statEvtHeatLayer, evtNm.toString());
		statEvtHeatLayer.setVisible(true);
		if(statCctvHeatLayer != null){
			statCctvHeatLayer.getSource().clear();
			statCctvHeatLayer.setVisible(false);
		}
	} else if(target == "mon"){
		var evtNm = new Array();
		$("#mon .monTyp").each(function(){
			if($(this).is(":checked")) evtNm.push($(this).attr("for"));
		});

		if(evtNm.length == 0){
			alert('모니터링 유형을 선택하여 주십시오.');
			return false;
		}
		//TOOD 히트맵
// 		if(statEvtHeatLayer == null){
// 			statEvtHeatLayer = xeusLayout.mapService.createHeatLayer(Layers["mon_evet_hist"]);
// 			statEvtHeatLayer.setVisible(false);
// 			xeusLayout.mapService.getMap().addLayer(statEvtHeatLayer);
// 		}

		var _param = {};
		//_param["evtNm"] = evtNm.toString();
		_param["evtNm"] = evtNm.join('{|}');

		_common.callAjax("/eventHist/getHeatList.json", _param, function(json) {
			if (json.result){
				var $target = $(".contentWrapper").find("#searchResult");
				$target.html('');

				var str = '';
				if(json.result.length == 0){
					str = '<tr><td colspan="2" class="tCenter">검색결과가 존재하지 않습니다.</td></tr>';
				}else {
					for(var i=0; i<json.result.length; i++)
						str +='<tr><td class="tCenter">'+json.result[i].evtNm+'</td><td class="tCenter">'+json.result[i].evtCnt+'</td></tr>';
				}
				$target.append(str);
			}
		});

		statEvtHeatLayer.getSource().clear();
		Layers["mon_evet_hist"].loadFunction(statEvtHeatLayer, evtNm.toString());
		statEvtHeatLayer.setVisible(true);
		if(statCctvHeatLayer != null){
			statCctvHeatLayer.getSource().clear();
			statCctvHeatLayer.setVisible(false);
		}
	}

});

$(".contentWrapper").find('#topMenu > select').change(function(){
	var target = $(this).find('option:selected').attr("target");
	var gbn = $(this).find('option:selected').attr("gbn");

	if(target != ""){
		//탭 css변경
// 		$(".contentWrapper").find('.topMenuTab').removeAttr("active");
// 		$(this).attr("active", "active");

		//페이지 표시
		$(".contentWrapper").find('.page').hide();
		$(".contentWrapper").find('#'+target).show();

		//검색결과 th수정
		$('#searchResultGbn').text(gbn);
		$(".contentWrapper").find("#searchBtn").attr("for", target);

		//검색결과 삭제
		$(".contentWrapper").find("#searchResult").html('');
	}
});

</script>
<style>
	.contentWrapper button.topMenuTab[active=active] {
	    font-weight: bold;
	    border-top: 2px solid #2B5E93;
	}
	.contentWrapper button.topMenuTab {
	    background: white;
	    border: 1px solid gray;
	    border-bottom: none;
	    padding: 8px 10px;
	    font-size: 14px;
	    cursor: pointer;
	    outline: none;
	}
	.contentWrapper .searchTable{
		margin-top: 10px;
	}
	.contentWrapper .searchTable label{
		min-width: 61px !important;
    	display: inline-block;
	}
	.contentWrapper .searchTable span{
		font-weight: bold;
	}

</style>

<div id="searchBox">

    <input type="hidden" id="offset" value="" /><%-- <%= offset %> --%>
    <input type="hidden" id="max" value="" />

    <!-- <div class="searchWrapper searchList"> -->
    <div class="contentWrapper searchList customScroll" data-mcs-theme="minimal-dark">
<!--         <p class="searchTitle">히트맵 통계</p> -->
        <div id="topMenu" class="tabTitle">
<!--         	<button class="tab" target="cctv" gbn="설치목적" active="active">CCTV 분포도</button>active="active"  -->
<!-- 			<button class="tab" target="evt" gbn="이벤트 유형">이벤트 발생현황</button> -->
<!-- 			<button class="tab" target="mon" gbn="모니터링 유형">모니터링 현황</button> -->
			<select>
				<option class="tab" target="cctv" gbn="설치목적" selected>CCTV 분포도</option>
				<option class="tab" target="evt" gbn="이벤트 유형">이벤트 발생현황</option>
				<option class="tab" target="mon" gbn="모니터링 유형">모니터링 현황</option>
			</select>
        </div>
        <!-- CCTV 목적별 히트맵 -->
        <div id="cctv" class="page">
        	<table class="searchTable">
		        <tr>
		            <th>설치 목적</th>
		            <td>
		            	<table>
		            		<tr>
		            			<td colspan="4">
		            				<input type="checkbox" class="allChk" for="gbnCd" style="margin: 0 3px;">
		                			<label>전체선택</label>
		            			</td>
		            		</tr>
<%
	int cnt = 0;
    while (cctvGbnCdItr.hasNext()) {
        String str = (String) cctvGbnCdItr.next();
        if(cnt%4 == 0){
%>
							<tr>
<%
        }
%>
								<td>
									<input type="checkbox" class="gbnCd" for="<%= str %>"  style="margin: 0 3px;">
		                			<label style="text-align:center; line-height: 1.3em;"><%= cctvGbnCd.get(str).replaceAll("\\(", "<br>\\(") %></label>
								</td>
<%
		cnt ++;
		if(cnt%4 == 0){
%>
							</tr>
<%
		}
    }
if(cnt%4 == 0){
%>
							</tr>
<%} %>
		            	</table>
		            </td>
		        </tr>
		    </table>
        </div>
        <!-- 이벤트 유형별 히트맵 -->
        <div id="evt" class="page hidden">
        	<table class="searchTable">
		        <tr>
		            <th>이벤트<br>유형</th>
		            <td>
		            	<table >
		            		<tr>
		            			<td colspan="4">
		            				<input type="checkbox" class="allChk" for="evtNm" style="margin: 0 3px;">
		                			<label>전체선택</label>
		            			</td>
		            		</tr>
		            		<tr>
		            			<td>
		            				<input type="checkbox" class="evtNm" for="강력범죄" style="margin: 0 3px;">
		                			<label>강력범죄</label>
		            			</td>
		            			<td colspan="3">
		            				<input type="checkbox" class="evtNm" for="교통사고" style="margin: 0 3px;">
		                			<label>교통사고</label>
		            			</td>
		            		</tr>
		            		<tr>
		            			<td>
		            				<input type="checkbox" class="evtNm" for="화재" style="margin: 0 3px;">
		                			<label>화재</label>
		            			</td>
		            			<td>
		            				<input type="checkbox" class="evtNm" for="구조" style="margin: 0 3px;">
		                			<label>구조</label>
		            			</td>
		            			<td>
		            				<input type="checkbox" class="evtNm" for="구급" style="margin: 0 3px;">
		                			<label>구급</label>
		            			</td>
		            			<td>
		            				<input type="checkbox" class="evtNm" for="기타" style="margin: 0 3px;">
		                			<label>기타</label>
		            			</td>
		            		</tr>
		            		<tr>
		            			<td colspan="4">
		            				<input type="checkbox" class="evtNm" for="사회적약자" style="margin: 0 3px;">
		                			<label>사회적약자</label>
		            			</td>
		            		</tr>
		            	</table>

		                <!-- <input type="checkbox" class="allChk" for="evtNm">
		                <label>전체선택</label>
		                <br>

		                <span>112</span><br>
		                &nbsp; &nbsp;
		                <input type="checkbox" class="evtNm" for="강력범죄">
		                <label>강력범죄</label>
		                <input type="checkbox" class="evtNm" for="교통사고">
		                <label>교통사고</label>
		                <br>

		                <span>119</span><br>
		                &nbsp; &nbsp;
		                <input type="checkbox" class="evtNm" for="화재">
		                <label>화재</label>
		                <input type="checkbox" class="evtNm" for="구조">
		                <label>구조</label>
		                <input type="checkbox" class="evtNm" for="구급">
		                <label>구급</label>
		                <input type="checkbox" class="evtNm" for="기타">
		                <label>기타</label>
		                <br>

		                <span>사회적약자</span><br>
		                &nbsp; &nbsp;
		                <input type="checkbox" class="evtNm" for="사회적약자">
		                <label>사회적약자</label>
		                <br> -->
		            </td>
		        </tr>
		    </table>
        </div>
        <!-- 모니터링 현황 히트맵 -->
        <div id="mon" class="page hidden">
        	<table class="searchTable">
		        <tr>
		            <th>모니터링<br>유형</th>
		            <td>
		            	<table>
		            		<tr>
		            			<td colspan="4">
		            				<input type="checkbox" class="allChk" for="monTyp" style="margin: 0 3px;">
		                			<label>전체선택</label>
		            			</td>
		            		</tr>
		            		<tr>
		            			<td>
		            				<input type="checkbox" class="monTyp" for="PTZ">
		                			<label>PTZ 제어</label>
		            			</td>
		            			<td>
		            				<input type="checkbox" class="monTyp" for="Preset">
		                			<label>프리셋 제어</label>
		            			</td>
		            			<td>
		            				<input type="checkbox" class="monTyp" for="CCTV 영상 공유">
		                			<label>CCTV 영상 공유</label>
		            			</td>
		            			<td>
		            				<input type="checkbox" class="monTyp" for="선영상조회 요청">
		                			<label>선영상조회 요청</label>
		            			</td>
		            		</tr>
		            	</table>
		                <!-- <input type="checkbox" class="allChk" for="monTyp">
		                <label>전체선택</label>
		                <br>
		                <input type="checkbox" class="monTyp" for="PTZ">
		                <label>PTZ 제어</label>
		                <input type="checkbox" class="monTyp" for="Preset">
		                <label>프리셋 제어</label>
		                <input type="checkbox" class="monTyp" for="CCTV 영상 공유">
		                <label>CCTV 영상 공유</label>
		                <input type="checkbox" class="monTyp" for="선영상조회 요청">
		                <label>선영상조회 요청</label> -->
		            </td>
		        </tr>
		    </table>
        </div>

        <div class="btnDiv">
	        <button class="btn_style" id="searchBtn" for="cctv">검 색</button>
	    </div>


        <h3 class="title">검색결과</h3>
	    <table>
	        <thead>
	            <tr>
	                <th id="searchResultGbn">설치목적</th>
	                <th id="searchResultCnt">개수</th>
	            </tr>
	        </thead>
	        <tbody id="searchResult"></tbody>
	    </table>
	</div>
</div>
