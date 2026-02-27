<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.equipmgr.service.CctvVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../common.jsp" %>
<script type="text/javascript">
(function(){
	var hdPlayer = null;

	_common.callAjax("/cctv/getCctvList.json", { "cctvNm" : "F18", "sortCol" : "cctv_nm", "sortTyp" : "asc" }, function(json){
		if(json.result.length > 0){

			for(var i=0; i<json.result.length; i++){
				$("#hd_camera_list").append("<option value='" + json.result[i].mgrNo + "'>" + json.result[i].cctvNm + "</option>");
			}

			$("#hd_camera_list").change(function(){
				var mgrNo = $(this).val();
				var cctvNm = $(this).find("option:selected").text();

				if(mgrNo){
					if(hdPlayer != null && hdPlayer instanceof XeusGate.Player){
						hdPlayer.destroy();
						hdPlayer = null;
					}

					$("#HD_Title").text(cctvNm);

					hdPlayer = GMXCCTV.createXeusGatePlayer("HD_Player", mgrNo, cctvNm, false, true);
				}else{
					hdPlayer.destroy();
				}
			});
		}else{
			$("#netMonitoringGridWrapper").find("#netGrid").find("tfoot").hide();
		}
	}, false);
})();
</script>
<style>
#netGrid .area { padding: 0; margin: 0; width: 100%; height: 100%; }
#netGrid .area div.netPlayer { position: relative; width: 100%; height: 100%; }
#netGrid .area div.netPlayer p.cctvTitle { padding: 10px 0px; }

#netGrid #hd_camera_list { padding: 10px 0px; color: white; width: 100%; }
#netGrid #HD_Player { position: relative; width: 100%; height: 100%; }
#netGrid #HD_Title { padding: 10px 0px; }
</style>
<div id="netMonitoringGridWrapper" class="customScroll">
	<table id="netGrid">
		<thead></thead>
		<tbody>
			<tr>
				<td class="area" id="leftTop"></td>
				<td class="area" id="top"></td>
				<td class="area" id="rightTop"></td>
			</tr>
			<tr>
				<td class="area" id="left"></td>
				<td class="area" id="center"></td>
				<td class="area" id="right"></td>
			</tr>
			<tr>
				<td class="area" id="leftBottom"></td>
				<td class="area" id="bottom"></td>
				<td class="area" id="rightBottom"></td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<td colspan="3" class="area">
					<select id="hd_camera_list">
						<option value="">== 고해상도 카메라 선택 ==</option>
					</select>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="area">
					<div id="HD_Player">
						<p id="HD_Title"></p>
					</div>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
