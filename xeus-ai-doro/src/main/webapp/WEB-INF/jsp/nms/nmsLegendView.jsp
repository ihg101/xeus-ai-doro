<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../common.jsp" %>
<script>
(function(){

	var resetLayer = false;
	if($("#main-menu-group").find("#btn-nms-mng").attr("init-layer") == "true"){
		resetLayer = true;
		$("#main-menu-group").find("#btn-nms-mng").removeAttr("init-layer");
	}

	xeusLayout.initLayer("NMS", resetLayer);
    if(_common.code == null){
        _common.setCode(function(){
            XeusLayer.createLegend("#legendWrap");
        });
    }else{
        XeusLayer.createLegend("#legendWrap");
    }

    $(".contentWrapper").find("#buttonWrap").find("#btn-icon").click(function(){


    	//범례와 같이 목록 생성

    	var _Selector = "#" + parentView + " #iconWrapper #legendList";
		this.legendSelector = $(_Selector);
		this.legendSelector.html("");

		var $parentDiv = $("<div id='layer-over-wrap' onSelectStart='return false'></div>");

		var _Group = XeusLayer.getLayerGroup();
		/* asset_cctv
		asset_infra
		asset_nms
		asset_fnms
		v_eli_stat
		v_gov_office */

		for(var i=0; i<_Group.length; i++){
			var $div = $("<div class='groups' val='" + _Group[i] + "' style='margin-bottom: 10px;'></div>");
			var $p = $("<p class='group-title'>" + _Group[i] + "</p>").prepend("<span mode='open'><span style='font-size: 12px;'>▶</span> &nbsp;</span>");
			$div.append($p);
			$parentDiv.append($div);
		}

		var eliCdeList = _common.getCodeByGroup("C68");
		var govCdeList = _common.getCodeByGroup("C70");
		var vEliStat = XeusLayer.convertList(eliCdeList);
		var vGovOffice = XeusLayer.convertList(govCdeList);

		/*var _Layers = xeusLayout.mapService.getAllLayers();*/
		var _Layers = GMXMAP.getAllLayers();
		for(var i=0; i<_Layers.length; i++){
			if(_Layers[i].get("type") != null){
				var fullName = _Layers[i].get("fullName");
				var key = parentView + "-" + _Layers[i].get("name");
				var group = _Layers[i].get("group");
				var shortcut = Layers[fullName].shortcut;

				var isCheck = "";
				if(_Layers[i].getVisible()) isCheck = "checked";

				//181211 서초구는 긴급재난상황이 들어가지 않으므로 그리지 않는다.
				if(fullName != "v_eli_stat"){
					var $div = $("<div class='legends'></div>");
					var $layer = $("<p></p>").append(shortcut)
											 .append("<label>&nbsp;" + _Layers[i].get("name").toUpperCase() + "</label>");
					var chkFullNm = [
	                 	"asset_infra_box_cctv",
	                 	"asset_infra_box_comp",
	                 	"asset_infra_box_main",
	                 	"asset_infra_box_posi",
	                 	"asset_infra_box_under",
	                 	"asset_infra_cctv",
	                 	"asset_infra_lora",
	                 	"asset_infra_wifi",
	                 	"asset_rainfall",
	                 	"asset_pump",
	                 	"asset_light20190131"
                 	];

					//if(Layers.LayerTheme[fullName] === undefined && (fullName == "asset_rainfall" || fullName == "asset_pump")){
					if(!Layers.LayerTheme[fullName] && (chkFullNm.indexOf(fullName) > -1)){
						$layer.append("&nbsp; <button lyr='" + fullName + "' gbn='' imgchk='true' class='mngBtn detailBtn'></button>");
					}

					$div.append($layer);
					$parentDiv.find(".groups[val='" + group + "']").append($div);
					//$parentDiv.prepend($div);
				}

				if(Layers.LayerTheme[fullName] != null){
					var $ul = $("<ul></ul>");
					//181211 서초구는 긴급재난상황이 들어가지 않으므로 그리지 않는다.
					if(fullName != "v_eli_stat"){
						for(var thmKey in Layers.LayerTheme[fullName]){
							var color = Layers.LayerTheme[fullName][thmKey];
							var isImg = Layers[fullName].getThemeImg != null;
							var $shortcut = $(Layers[fullName].shortcut);
							if(isImg){
								$shortcut = $("<img src='" + Layers[fullName].getThemeImg(color) + "'>").css({
									"width" : "30px",
									"height" : "30px",
									"cursor" : "pointer",
									"vertical-align" : "middle",
									"margin" : "0px 10px"
								})/* .click(function(){
									$(this).next().click();
								}) */;
							}else{
								$shortcut.children().css("stroke", color);
							}
							var $li = $("<li></li>");

							var thmNm = thmKey;
							if(fullName == "v_eli_stat") thmNm = vEliStat[thmKey];
							else if(fullName == "v_gov_office") thmNm = vGovOffice[thmKey];

							var gbn = color;
							if(gbn.indexOf(".png") > 0) gbn = gbn.substring(0, gbn.indexOf(".png"));
							gbn = Number(gbn);
							if(isNaN(gbn)) gbn = color;

							$li.append($shortcut)
								.append("<label>" + thmNm + "</label>");
							if(fullName != "asset_fnms")
								$li.append("&nbsp; <button lyr='" + fullName + "' gbn='"+gbn+"' imgchk='"+isImg+"' class='mngBtn detailBtn'></button>");

							//if(isImg) $li.css("padding", "10px 0px 10px 0px");
							$ul.append($li);
						}
					}
					//cctv레이어의 경우 그룹핑 심볼 코드도 등록한다.
					if(fullName == "asset_cctv"){
						var arr = ['X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8', 'X9', 'X10', 'XX'];
						for(var j=0; j<arr.length; j++){
							var color = arr[j];
							var isImg = Layers[fullName].getThemeImg != null;
							var $shortcut = $(Layers[fullName].shortcut);
							$shortcut = $("<img src='" + Layers[fullName].getThemeImg(color) + "'>").css({
								"width" : "30px",
								"height" : "30px",
								"cursor" : "pointer",
								"vertical-align" : "middle",
								"margin" : "0px 10px"
							})/* .click(function(){
								$(this).next().click();
							}) */;
							var $li = $("<li></li>");

							var thmNm = arr[j];
							var gbn = arr[j];
							$li.append($shortcut)
								.append("<label>" + thmNm + "</label>")
								.append("&nbsp; <button lyr='" + fullName + "' gbn='"+gbn+"' imgchk='"+isImg+"' class='mngBtn detailBtn'></button>");

							//if(isImg) $li.css("padding", "10px 0px 10px 0px");
							$ul.append($li);
						}
					}
					$div.append($ul);
					//긴급재난상황 다음에 5대연계서비스 관련 범례도 추가한다.
					//181211 긴급재난상황이 그려지지 않더라도 연계서비스는 그려져야 하므로 유지한다.
					if(fullName == "v_eli_stat"){
						var smartCityCdeList = _common.getCodeByGroup("C71");


						var $div = $("<div class='legends'></div>");
						var $layer2 = $("<p></p>").append("<img src='/xeus/res/sym/lyr/smartcity.png' class='sym-icon'>")
												 .append("<label>&nbsp;연계서비스</label>");//5대

						$div.append($layer2);
						$parentDiv.find(".groups[val='" + group + "']").append($div);

						var $ul = $("<ul></ul>");
						for(var k=0; k<smartCityCdeList.length; k++){
							var isImg = true;
							var $shortcut;
							var cdeCde = smartCityCdeList[k]['cdeCde'];
							var cdeNm = smartCityCdeList[k]['cdeNm'];
							$shortcut = $("<img src='/xeus/sym/getSymbol.do?mgrNo=" + smartCitySym[cdeCde] + "'>").css({
								"width" : "30px",
								"height" : "30px",
								"cursor" : "pointer",
								"vertical-align" : "middle",
								"margin" : "0px 10px"
							})/* .click(function(){
								$(this).next().click();
							}) */;
							var $li = $("<li></li>");

							$li.append($shortcut)
								.append("<label>" + cdeNm + "</label>")
								.append("&nbsp; <button lyr='smart_city' gbn='"+cdeCde+"' imgchk='"+isImg+"' class='mngBtn detailBtn'></button>");

							//if(isImg) $li.css("padding", "10px 0px 10px 0px");
							$ul.append($li);
						}
						$div.append($ul);

						if(Layers.LayerTheme[fullName] != null){
							$layer2.find("label").eq(0).removeAttr("for").css({
								"cursor" : "pointer"
							}).on("click", function(){
								$(this).parent().next().toggle();
							});
						}
					}

					if(Layers.LayerTheme[fullName] != null){
						$layer.find("label").eq(0).removeAttr("for").css({
							"cursor" : "pointer"
						}).on("click", function(){
							$(this).parent().next().toggle();
						});
					}
				}
			}
		}
		$(_Selector).append($parentDiv).find("ul").toggle();

		$(_Selector).find(".mngBtn").click(function(){
			var imgChk = $(this).attr("imgchk");
			var lyr = $(this).attr("lyr");
	    	var gbn = $(this).attr("gbn");
			if(imgChk == "true"){
				$(".contentWrapper").find("#iconEditPop").bPopup({
		    		appendTo : "#"+parentView,
		    		onOpen : function(){
		    			$(".contentWrapper").find("#iconEditPop").find("#lyrNm").val(lyr);
		    			$(".contentWrapper").find("#iconEditPop").find("#gbnCd").val(gbn);
		    			setSelectImg(lyr);
		    		},
		    		onClose : function(){
		    			$(".contentWrapper").find("#iconEditPop").find('input[name="selectIcon"]').prop('checked', false);
		    			$(".contentWrapper").find("#iconEditPop").find("#lyrNm").val('');
		    			$(".contentWrapper").find("#iconEditPop").find("#gbnCd").val('');
		    		}
	    		});
				$(".contentWrapper").find("#iconEditPop").find(".bpopClose").off('click');
		    	$(".contentWrapper").find("#iconEditPop").find(".bpopClose").click(function(){
		    		$(".contentWrapper").find("#iconEditPop").bPopup().close();
		    	});
		    	$(".contentWrapper").find("#iconEditPop").find(".saveBtn").off('click');
		    	$(".contentWrapper").find("#iconEditPop").find(".saveBtn").click(function(){
		    		var chkNotice = $('.notice').length;
		    		if(chkNotice == 0){
		    			confirm("등록하시겠습니까?", function(){
		    				var symMgrNo = $(':radio[name="selectIcon"]:checked').val();
		    				if (symMgrNo == undefined){
		    					alert("아이콘을 선택하여 주십시오.");
		    					return false;
		    				} else {
		    					var _param = {};
		    					_param['gbnCd'] = $(".contentWrapper").find("#iconEditPop").find("#gbnCd").val();
		    					_param['lyrNm'] = $(".contentWrapper").find("#iconEditPop").find("#lyrNm").val();

		    					//새로 등록되는 건이 있을 수 있으므로 이미 있는 row인지 체크한다.
		    					//없으면 add
		    					//존재하면 edit
		    					_common.callAjax("/sym/getLyrSymItem.json", _param, function(json){
		    						_param['symMgrNo']= symMgrNo;
		    						//null이 아니면
		    						if(json.result){
		    							_param['mgrSeq'] = json.result.mgrSeq;
		    							_common.callAjax("/sym/editLyrSym.json", _param, function(json){
											if(json.result) {
												alert("저장되었습니다.");
												$(".contentWrapper").find("#iconEditPop").find(".bpopClose").click();
												reloadLegendView(_param['lyrNm']);
											}
		    							}, false);
		    						} else {
		    							_common.callAjax("/sym/addLyrSym.json", _param, function(json){
											if(json.result) {
												alert("저장되었습니다.");
												$(".contentWrapper").find("#iconEditPop").find(".bpopClose").click();
												reloadLegendView(_param['lyrNm']);
											}
		    							}, false);
		    						}
		    					}, false);
		    				}
		    			}, function(){
		    				$(this).val("");
		    			});
		    		}
		    	});
			}else if(imgChk == "false"){
				var netNm = $(this).prev().text();
				$(".contentWrapper").find("#colorEditPop").bPopup({
		    		appendTo : "#"+parentView,
		    		onOpen : function(){
		    			$(".contentWrapper").find("#colorEditPop").find("#lyrNm").val(lyr);
		    			$(".contentWrapper").find("#colorEditPop").find("#netNm").val(netNm);
		    			$(".contentWrapper").find("#colorEditPop").find('#lineColor').val(gbn);
		    		},
		    		onClose : function(){
		    			$(".contentWrapper").find("#colorEditPop").find("#netNm").val('');
		    		}
	    		});
				$(".contentWrapper").find("#colorEditPop").find(".bpopClose").off('click');
		    	$(".contentWrapper").find("#colorEditPop").find(".bpopClose").click(function(){
		    		$(".contentWrapper").find("#colorEditPop").bPopup().close();
		    	});
		    	$(".contentWrapper").find("#colorEditPop").find(".saveBtn").off('click');
		    	$(".contentWrapper").find("#colorEditPop").find(".saveBtn").click(function(){
					var _param = {};
					_param['lyrNm'] = $(".contentWrapper").find("#colorEditPop").find("#lyrNm").val();
					_param['netNm'] = $(".contentWrapper").find("#colorEditPop").find("#netNm").val();
					_param['lineColor'] = $(".contentWrapper").find("#colorEditPop").find("#lineColor").val();
					_common.callAjax("/netwk/editThemeColor.json", _param, function(json){
						if(json.result) {
							alert("저장되었습니다.");
							$(".contentWrapper").find("#colorEditPop").find(".bpopClose").click();
							_common.callAjax("/netwk/getNmsCableTheme.json", _param, function(json){
								if(json.result){
									Layers.LayerTheme[_param['lyrNm']] = json.result;
								}
							}, false);
							reloadLegendView(_param['lyrNm']);
						}
					}, false);
		    	});
			}

	    });

		/* $parentDiv.find("div.groups").each(function(){
			if($(this).children(".legends").length == 0){
				$(this).remove();
			}
		}); */

		$parentDiv.find(".group-title").click(function(){
			$(this).parent().find(".legends").toggle();
			var $span = $(this).find("span");
			if($span.attr("mode") == "open"){
				$span.attr("mode", "close").text("▼ ")
			}else if($span.attr("mode") == "close"){
				$span.attr("mode", "open").text("▶ ")
			}
		});

		/* $parentDiv.find(".legends svg, .sym-icon").click(function(){
			$(this).next().click();
		}); */

    	////////////////////////////////////////////

    	$(".contentWrapper").find("#iconWrapper").toggle("slide");
    });

    function getLayerGroup(){
		var array = new Array();
		var _Layers = Layers;
		for(key in _Layers){
			if(_Layers[key]["group"] != null){
				var group = _Layers[key]["group"];
				//if(group != "배경지도" && group != "지적 기반")
				if(!_common.utils.isNullAndEmpty(group)){
					var isContains = false;
					for(var l=0; l<array.length; l++){

						if(array[l] == group) isContains = true;
						if(isContains) break;
					}
					if(!isContains) array.push(group);
				}
			}
		}
		return array;
	}

    function setSelectImg(lyr){
    	$('#iconEditPop').find("#selectImg").find('#selectImgList').html('');

   		var equip = ["asset_cctv", "asset_infra", "asset_rainfall", "asset_pump", "asset_blackbox"];
   		var stat = [];
   		var _param = {};
   		if(equip.indexOf(lyr) > -1) _param['gbnCd'] = 'S7';
   		//else if(stat.indexOf(lyr) > -1) _param['gbnCd'] = 'S8';
   		//else _param['gbnCd'] = 'S9';

       	_common.callAjax("/sym/getDescList.json", _param, function(json) {
       		if(json.result){
       			var _html = "";

       			for(var i=0; i<json.result.length; i++){
       				_html += '<tr>';
       				_html += '	<td style="text-align: center;">';
       				_html += '		<input type="radio" class="selectIcon" name="selectIcon" value="'+json.result[i].mgrNo+'" style="width: 20px;">';
       				_html += '	</td>';
       				_html += '	<td style="width: 150px; text-align: center;">';
       				_html += '		<span>'+json.result[i].fileNm+'</span>';
       				_html += '	</td>';
       				_html += '	<td style="text-align: center;">';
       				_html += '		<img width="30px" alt="'+json.result[i].fileNm+'" src="../sym/getSymbol.do?mgrNo='+json.result[i].mgrNo+'" onerror=this.src=\'../res/img/no_img.png\'>';
       				_html += '	</td>';
       				_html += '</tr>';
       			}

       			<%-- <td><%= symCdMap.get(list.get(i).getGbnCd()) %></td>
               	<td><%= list.get(i).getFileNm() %></td>
               	<td>
               		<img width="40px" alt="<%= list.get(i).getFileNm() %>" src="../sym/getSymbol.do?mgrNo=<%= list.get(i).getMgrNo() %>" onerror='this.src="../res/img/no_img.png"'>
               	</td> --%>

       			$('#iconEditPop').find("#selectImg").find('#selectImgList').html(_html);
       			$('#iconEditPop').find("#selectImg").find('#selectImgList').find('tr').click(function(){
       				$(this).find('input[type=radio]').click();
       			});
       		}
       	}, false);
    }
    //뷰 페이지를 리로드한다.
    //xeusLayerList의 이미지 관련 윈도우 객체도 갱신해준다.
    function reloadLegendView(lyrNm){

   		_common.callAjax("/sym/getLyrSymList.json", {'lyrNm': lyrNm}, function(json) {
       		if(json.result){
       			var obj = {};
       			if(lyrNm == "asset_rainfall" || lyrNm == "asset_pump"){
					obj = null;
					obj = json.result[0].symMgrNo;
       			}else{
       				for(var i=0; i<json.result.length; i++){
           				obj[json.result[i].gbnCd] = json.result[i].symMgrNo;
           			}
       			}
       			if(lyrNm == "asset_cctv"){
	       			cctvSymIcon = obj;
	       			xeusCCTV.cctv.SYM_ICON = obj;
	       			//xeusCCTV.cctv.reload();

	       			xeusCCTV.cctv.resetStyles();
	       			var cctvCdeList = _common.getCodeByGroup("C14");
	       			var array = [];
	       			for(var i=0; i<cctvCdeList.length; i++){
	       				array.push(cctvCdeList[i]['cdeNm']);
	       			}
					xeusCCTV.cctv.setSymbolStyle(array.toString()).reload();

       			}else if(lyrNm == "asset_infra"){
       				nmsSymIcon = obj;
       				Layers["asset_infra"].reload();
       			}else if(lyrNm == "v_eli_stat"){
       				eliStatSymIcon = obj;
       				Layers["v_eli_stat"].reload();
       			}else if(lyrNm == "smart_city"){
       				smartCitySym = obj;
       			}else if(lyrNm == "asset_nms"){
       				Layers[lyrNm].reload();
       			}else if(lyrNm == "asset_rainfall"){
       				Layers["asset_rainfall"].shortcut = "<img src='/xeus/sym/getSymbol.do?mgrNo="+obj+"' class='sym-icon'>";
       				rainfallSymIcon = obj;
       				Layers[lyrNm].reload();
       			}else if(lyrNm == "asset_pump"){
       				Layers["asset_pump"].shortcut = "<img src='/xeus/sym/getSymbol.do?mgrNo="+obj+"' class='sym-icon'>";
       				/* Layers["asset_pump"].style = function(feature, resolution){
       					return new ol.style.Style({
       						image: new ol.style.Icon({
       							crossOrigin: "anonymous",
       							src: "../res/sym/waterPump/waterPump.png"
       						})
       					});
       				} */
       				pumpSymIcon = obj;
       				Layers[lyrNm].reload();
       			}
       		}
       	}, false);
		//열려있는 오버레이 창을 닫는다.
   		$(".contentWrapper").find('#cctv-overlay-closer')[0].click();

    	_common.callAjax("/nms/getNmsLegendView.do", null, function(view) {
    		$(".contentWrapper").find(".bpopup").remove();
			$(".contentWrapper").find("#overlay-west-contents").html(view);
			$(".contentWrapper").find("#buttonWrap").find("#btn-icon").click();
		});
    }

})();
</script>
<style>
#iconWrapper {
	position: absolute;
    width: 99%;
    height: 100%;
    top: 0;
    background: white;
    overflow: auto;
}

.bpopup {
    display: none;
    border: 5px solid #222c38;
    background: #222c38;
    width: 500px;
}

.bpopup button {
    background: #4C535C;
    border: 0px;
    font-size: 13px;
    padding: 7px 25px;
    color: white;
    cursor: pointer;
}

#bpop_wrap {
    padding: 0 10px;
}
#bpop_wrap h2 {
    text-align: center;
    font-size: 14px;
    margin: 20px 0px;
    color: white;
}
#bpop_wrap table {
    /* border-spacing: 0; */
    border-spacing: 1px;
    width: 483px !important;
}
#bpop_wrap table tr .top {
    text-align: right;
    font-size: 13px;
    /* padding: 20px 15px 20px 15px; */
    padding: 15px;
    background-color: #35404C;
    color: white;
    width: 85px;
}
#bpop_wrap table tr th {
    width: 35%;
}
#bpop_wrap table tr td {
    border-bottom: 1px solid #D5D5D5;
    border-right: 1px solid #D5D5D5;
    /* background: #D5D5D5; */
    background: white;
    padding-left: 10px;
}
#bpop_wrap table tr td.lastTd {
    background: #222c38;
}
#bpop_wrap table tr .bottom {
    text-align: right;
    font-size: 13px;
    padding: 150px 15px 150px 73px;
    background-color: #35404C;
    color: white;
}
#bpop_wrap input {
    height: 25px;
    width: 95%;
    /* background: #D5D5D5; */
    background: white;
    padding-left: 5px;
}
#bpop_wrap input, textarea {
    border: 0;
}
#bpop_wrap select {
    height: 25px;
    width: 95%;
    border: 0;
    /* background: #D5D5D5; */
    background: white;
}
#bpop_wrap table tr td button {
    margin: 10px 0px;
}

#bpop_wrap #popImgList{
    border-spacing: 1px;
    width: 400px !important;
    display: block;
}

#bpop_wrap #popImgList tr th:first-child {
    width: 50px;
}

#bpop_wrap #popImgList tr th {
    width: 100px;
    height: 25px;
    background: #f3f3f3;
    color: #666;
    font-size: 15px;
    font-weight: 100 !important;
}

#bpop_wrap #popImgList tr td:first-child {
    width: 50px;
}

#bpop_wrap #popImgList tr td {
    width: 100px;
    font-size: 13px;
    font-weight: 100 !important;
    border-right: none;
    word-break: break-all;
}

#bpop_wrap #popImgList tr td .imgChk {
    width: 15px;
}

#bpop_wrap #popImgList #selectImgList {
    height: 295px !important;
    position: relative;
    display: block;
    overflow: auto;
}
</style>
<div class="overflow searchWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">

	<div id="buttonWrap">
	    <button id="btn-icon" class="whiteBtn" style="float: right; margin: 12px 8px 0 0;">아이콘 설정</button>
	</div>
    <div id="legendWrap"></div>

    <!-- <div id="iconWrapper" class="hidden"> -->
	<div id="iconWrapper" style="overflow: auto;" class="hidden customScroll" data-mcs-theme="minimal-dark">
		<p class="searchTitle">아이콘 관리</p>
		<div id="legendList">
		</div>
	</div>

	<div id="iconEditPop" class="bpopup" style="display: none;">
		<div id="bpop_wrap">
		    <h2 id="bpop_title">아이콘 선택</h2>
		    <table>
		        <tr>
		            <th class="top">아이콘 목록</th>
	            	<td id="selectImg" style="height: 300px; vertical-align: top;">
                    	<table id="popImgList">
                           <tbody id="selectImgList">
                           </tbody>
                       </table>
					</td>
		        </tr>
			</table>
			<table>
				<tr class="hidden">
					<td>
						<input type="hidden" id="lyrNm">
						<input type="hidden" id="gbnCd">
					</td>
				</tr>
				<tr align="center">
					<td class="lastTd" colspan="2" style="border: 0 !important;">
						<button for="imgRqstPop" class="saveBtn">저장</button>
                        <!-- <button class="editBtn hidden">수정</button> -->
                        <button for="imgRqstPop" class="bpopClose">취소</button><!--  tabindex="5" -->
					</td>
				</tr>
			</table>
        </div>
	</div>

	<div id="colorEditPop" class="bpopup" style="display: none;">
		<div id="bpop_wrap">
		    <h2 id="bpop_title">색상 수정</h2>
		    <table>
		        <tr>
		            <th class="top">색 선택</th>
	            	<td>
                    	<input type="color" id="lineColor"/>
                    	<div>
                    		<img/>
                    	</div>
					</td>
		        </tr>
			</table>
			<table>
				<tr class="hidden">
					<td>
						<input type="hidden" id="lyrNm">
						<input type="text" id="netNm">
					</td>
				</tr>
				<tr align="center">
					<td class="lastTd" colspan="2" style="border: 0 !important;">
						<button class="saveBtn">저장</button>
                        <button class="bpopClose">취소</button>
					</td>
				</tr>
			</table>
        </div>
	</div>

</div>