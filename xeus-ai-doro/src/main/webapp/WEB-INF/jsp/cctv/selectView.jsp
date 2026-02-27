<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.eventmonitor.service.FavCctvVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../common.jsp" %>
<%
ArrayList<FavCctvVo> list = (ArrayList<FavCctvVo>) request.getAttribute("result");
%>
<script>
/* 신규추가버튼 이벤트 입니다. */
$("#regTable").find("#addBtn").click(function(){

	if(!GMXCCTV.isGridPlaying()){
		alert("그리드에 재생중인 CCTV가 없습니다.\n그리드에 CCTV를 추가해 주세요.");
		return false;
	}

	var param = {
		"titleNm" : $("#regTable").find(".titleNm").val(),
		"jsonTxt" : JSON.stringify(GMXCCTV.getSimpleGridPlayingData()),
		"colNum" : $("#gridMonitoringWrap").parent().find(".ui-dialog-title").data("grid-width"),
		"chgDat" : Date.prototype.getYMDHMS()
	}
	_common.callAjax("/cctv/addFavCctv.json", param, function(json){
		if(json.result){
			alert("저장되었습니다.");
			$("#btn-select-mng").click();

			$("#regTable").find(".titleNm").val("");

			var $tr = $('<tr></tr>');
			$tr.append('<td><input type="text" class="sendData wide titleNm" value="' + param.titleNm + '"></td>');

			var $td = $('<td class="tCenter" width="200" k="' + json.mgrSeq + '"></td>');

			var $nameEditBtn = $('<button class="btn_Dstyle nameEditBtn">수정</button>');
			var $viewCctvBtn = $('<button class="btn_style2 viewCctvBtn">재생</button>');
			var $deleteBtn = $( '<button class="btn_Dstyle2 deleteBtn">삭제</button>');

			$td.append($nameEditBtn)
			   .append(" ")
			   .append($viewCctvBtn)
			   .append(" ")
			   .append($deleteBtn);

			$tr.append($td);
			$("#listTable").append($tr);

			/* 삭제버튼 이벤트 입니다. */
			$deleteBtn.click(function(){
				var v = $(this).parent().attr("k");
				var $tr = $(this).parent().parent();
				if(confirm("삭제하시겠습니까?")){
					_common.callAjax("/cctv/delFavCctv.json", {k : v}, function(json){
						if(json.result){
							alert("삭제되었습니다.");
							$tr.remove();
						}
					});
				}
			});

			/* 수정버튼 이벤트 입니다. */
			$nameEditBtn.click(function(){
				var param = {
					"mgrSeq" : $(this).parent().attr("k"),
					"titleNm" : $(this).parent().prev().find(".titleNm").val(),
					"jsonTxt" : JSON.stringify(GMXCCTV.getSimpleGridPlayingData()),
					"colNum" : $("#gridMonitoringWrap").parent().find(".ui-dialog-title").data("grid-width"),
					"chgDat" : Date.prototype.getYMDHMS()
				}
				if(confirm("제목 및 그리드 정보를 수정하시겠습니까?")){
					_common.callAjax("/cctv/editFavCctv.json", param, function(json){
						if(json.result){
							alert("수정되었습니다.");
							$("#btn-select-mng").click();
						}
					});
				}
			});

			/* 보기버튼 이벤트 입니다. */
			$viewCctvBtn.click(function(){
				var v = $(this).parent().attr("k");

				_common.callAjax("/cctv/getFavCctvList.json", {mgrSeq : v}, function(json){
					if(json.result != null){
						var dataList = new Array();
						for(var i=0; i<json.result.length; i++){
							dataList.push({ "mgrNo" : json.result[i].mgrNo, "cctvNm" : json.result[i].cctvNm, "idx" : i });
						}
						GMXCCTV.clearAllGridPlayers();
						GMXCCTV.createGridPlayer(dataList);
						GMXCCTV.setGridDialogWidth(Number(json.colNum));
					}
				});
			});
		}
	});
});

/* 보기버튼 이벤트 입니다. */
$("#listTable").find(".viewCctvBtn").click(function(){
	var v = $(this).parent().attr("k");
	_common.callAjax("/cctv/getFavCctvList.json", {mgrSeq : v}, function(json){
		if(json.result != null){
			var dataList = new Array();
			for(var i=0; i<json.result.length; i++){
				dataList.push({ "mgrNo" : json.result[i].mgrNo, "cctvNm" : json.result[i].cctvNm, "idx" : i });
			}
			GMXCCTV.clearAllGridPlayers();
			GMXCCTV.createGridPlayer(dataList);
			GMXCCTV.setGridDialogWidth(Number(json.colNum));
		}
	});
});

/* 삭제버튼 이벤트 입니다. */
$("#listTable").find(".deleteBtn").click(function(){
	var v = $(this).parent().attr("k");
	var $tr = $(this).parent().parent();

	if(confirm("삭제하시겠습니까?")){
		_common.callAjax("/cctv/delFavCctv.json", {k : v}, function(json){
			if(json.result){
				alert("삭제되었습니다.");
				$tr.remove();
			}
		});
	}
});

/* 저장버튼 이벤트 입니다. */
$("#listTable").find(".nameEditBtn").click(function(){
	var param = {
		"mgrSeq" : $(this).parent().attr("k"),
		"jsonTxt" : JSON.stringify(GMXCCTV.getSimpleGridPlayingData()),
		"colNum" : $("#gridMonitoringWrap").parent().find(".ui-dialog-title").data("grid-width"),
		"titleNm" : $(this).parent().prev().find(".titleNm").val(),
		"chgDat" : Date.prototype.getYMDHMS()
	}
	if(confirm("수정하시겠습니까?")){
		_common.callAjax("/cctv/editFavCctv.json", param, function(json){
			if(json.result){
				alert("수정되었습니다.");
				$("#btn-select-mng").click();
			}
		});
	}
});
</script>
<div class="customScroll">
	<div id="listWrapper">
<% if(list.size() > 0){ %>
		<table class="list">
			<thead>
				<tr>
					<th>제목</th>
					<th width="167px">관리</th>
				</tr>
			</thead>
		</table>
		<div>
			<table id="listTable" class="list">
	<% for(int i=0; i<list.size(); i++){ %>
				<tr>
					<td>
						<input type="text" class="sendData wide titleNm" value="<%= list.get(i).getTitleNm() %>">
					</td>
					<td class="tCenter" width="200" k="<%= list.get(i).getMgrSeq() %>">
						<button class="btn_Dstyle nameEditBtn">수정</button>
						<button class="btn_style2 viewCctvBtn">재생</button>
						<button class="btn_Dstyle2 deleteBtn">삭제</button>
					</td>
				</tr>
	<% } %>
			</table>
		</div>
<% } %>
		<table id="regTable" class="list">
			<tr>
				<td width="60">제목</td>
				<td>
					<input type="text" class="wide titleNm">
				</td>
				<td class="tCenter" width="200">
					<button class="btn_style2" id="addBtn">신규 추가</button>
				</td>
			</tr>
			<tr>
				<th colspan="3">신규추가를 원하실 경우 그리드 재생 후 제목을 입력해주세요.</th>
			</tr>
		</table>
	</div>
</div>