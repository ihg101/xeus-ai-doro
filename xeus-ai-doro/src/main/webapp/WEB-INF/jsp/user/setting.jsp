<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
$("#settingPop").find("#saveBtn").click(function(){
	if("localStorage" in window){
		localStorage["SystemSetting@featureSelectType"] = $("#featureSelectType").val();

		if(confirm("설정이 완료되었습니다.\n\n해당 설정은 새로고침 후 적용됩니다.\n\n새로고침 하시겠습니까?")){
			location.reload();
		}

		/* if("contextMenu" in GMXMAP){
			GMXMAP.removeControl(GMXMAP["contextMenu"]);

			var contextParam = { width : 300, items : [], defaultItems : false, eventType : "click" };

			var eventType = localStorage["SystemSetting@featureSelectType"];
			if(_common.utils.isNullAndEmpty(eventType)){
				delete contextParam["eventType"];
			}else{
				contextParam["eventType"] = eventType;
			}

			GMXMAP["contextMenu"] = new ContextMenu(contextParam);
		} */
	}
});

if(localStorage && ("SystemSetting@featureSelectType" in localStorage)){
	$("#featureSelectType").val(localStorage["SystemSetting@featureSelectType"]);
}
</script>
<table>
	<tr>
		<th>지도 객체 선택 방법</th>
		<td>
			<select id="featureSelectType">
				<option value="">마우스 우 클릭</option>
				<option value="click">마우스 좌 클릭</option>
				<option value="dblclick">마우스 좌 더블클릭</option>
			</select>
		</td>
	</tr>
	<tr>
		<td class="tCenter" colspan="2">
			<button id="saveBtn" class="btn_style" type="button">저장</button>
		</td>
	</tr>
</table>