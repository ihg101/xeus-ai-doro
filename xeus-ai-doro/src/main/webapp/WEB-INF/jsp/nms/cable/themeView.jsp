<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="geomex.xeus.equipmgr.service.NetwkThemeVo"%>
<%@ page import="geomex.xeus.util.code.CodeConvertor"%>
<%@ include file="../../common.jsp" %>
<%
CodeConvertor cde = (CodeConvertor) request.getAttribute("code");

//"논리/물리구분"
HashMap<String, String> net = cde.convertCodeGrpToAllCde("C15");
Set<String> netKey = net.keySet();
Iterator<String> netItr = netKey.iterator();

//테마 목록
//ArrayList<NetwkThemeVo> orgz = (ArrayList<NetwkThemeVo>) request.getAttribute("result");


//
HashMap<String, String> link = cde.convertCodeGrpToAllCde("C10");
Set<String> linkKey = link.keySet();
Iterator<String> linkItr = linkKey.iterator();
%>
<script>
(function(){
	/* LayerConst.ThemeLoad("asset_nms");
	LayerConst.ThemeLoad("asset_fnms");
	XeusLayer.createLegend("#legendWrap");

	$(".contentWrapper").find("#selectBtn").click(function(){
        Public.NMS.Cable.DelStart();
    });

    $(".contentWrapper").find("#delBtn").click(function(){
        if($(".contentWrapper").find("#cableList").find("option").length == 0){
            alert("케이블을 추가해주세요.");
            return false;
        }

        confirm("선택하신 케이블을 삭제 하시겠습니까?", function(){
        	var param = {};
            $(".contentWrapper").find("#cableList").find("option").each(function(i){
		        var gid = $(this).attr("gid");
                param["cableList[" + i + "].gid"] = gid;
            });

            _common.callAjax("/netwk/delMultipleCable.json", param, function(json){
                if(json.result){
                    alert("삭제되었습니다.");
                    Public.StopEvent();
                    LayerConst.ThemeLoad("asset_nms");
                    LayerConst.ThemeLoad("asset_fnms");
                    XeusLayer.createLegend("#legendWrap");
                    Layers["asset_nms"].reload();
                    Layers["asset_fnms"].reload();
                }
            }, false);
        });
    }); */

    $(document).ready(function(){
    	setList();
    });

    function setList(){
    	_common.callAjax("/netwk/getThemeList.json", {sortCol: 'net_gbn_cd', sortTyp: 'ASC'}, function(json){
            if(json.result){
            	$(".contentWrapper").find('#resultTable').find('tbody').html('');
            	if(json.result.length > 0){
            		for(var i=0; i<json.result.length; i++){
            			var netGbnCd = json.result[i].netGbnCd;

    					var $tr = $('<tr k='+json.result[i].mgrNo+'></tr>').data(json.result[i]);
    					$tr.append('<td class="tCenter">'+_common.getCodeByName('C15', netGbnCd)+'</td>');

    					var $nameTd = $('<td class="tBlankLeft"></td>');
   						$nameTd.append('<div title="'+json.result[i].themeNm+'" style="display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 155px; padding-top: 3px;">'+json.result[i].themeNm+'</div>');
   						$tr.append($nameTd);

   						var $lineTd = $('<td class="tCenter"><svg height="5" width="90" style="vertical-align:middle;"><line x1="90" y1="0"></line></svg></td>');
   						var lineCss = {
							'stroke': json.result[i].lineColor,
 							'stroke-width':10
   						};
   						if(json.result[i].cableTyp == '2') lineCss["stroke-dasharray"] = '10 3';
   						$lineTd.find('line').css(lineCss);
    					$tr.append($lineTd);

    					$tr.append('<td class="tCenter"><button class="detailBtn btn_t">상세</button><button class="delBtn btn_t">삭제</button></td>');

    					$(".contentWrapper").find('#resultTable').find('tbody').append($tr);
    				}

            		$(".contentWrapper").find('#resultTable').find('.detailBtn').click(function(){
            			var data = $(this).parent().parent().data();
						$("#popupWrap").dialog("close").html(getPopupHtml()).dialog({
							title : '테마 수정',
						    width: 400,
							height: 355,
							position: {
								my: "left top",
								at: "left+500 top",
								of: $("#map")
							},
							open: function(){
								$(".popupWrapper").find("#mgrNo").val(data.mgrNo);
								$(".popupWrapper").find("#netGbnCd").val(data.netGbnCd);
								$(".popupWrapper").find("#themeNm").val(data.themeNm);
								$(".popupWrapper").find("#ringNo").val(data.ringNo);
								$(".popupWrapper").find("#cableTyp").val(data.cableTyp);
								$(".popupWrapper").find("#lineColor").val(data.lineColor);
								$(".popupWrapper").find("#linkGbnCd").val(data.linkGbnCd).attr('select');

								if(data.netGbnCd == "11")
									$(".popupWrapper").find(".ringTr").show();
								else{
									$(".popupWrapper").find(".ringTr").hide();
									$(".contentWrapper").find('#popupWrap').find('#ringNo').val('');
								}

								$(".popupWrapper").find('#netGbnCd').on('blur change', function(){
							    	if($(".popupWrapper").find('#netGbnCd').val() == "11")
							    		$(".popupWrapper").find('.ringTr').show();
							    	else{
										$(".popupWrapper").find(".ringTr").hide();
										$$(".popupWrapper").find('#ringNo').val('');
									}
							    });

								$(".popupWrapper").find('.bpopClose').click(function(){
									$(".popupWrapper").find("#theme_pop_wrap").bPopup().close();
								});

								$(".popupWrapper").find('#editBtn').click(function(){
									var editParam = _common.utils.collectSendData(".popupWrapper");
							    	if(editParam['netGbnCd'] == "11" && editParam['ringNo'] == ""){
							    		alert('링 번호를 입력하여 주십시오.');
							    		return false;
							    	}
							    	_common.callAjax("/netwk/editTheme.json", editParam, function(json){
							    		if(json.result){
							    			alert('수정되었습니다.');
											//TODO theme 로드
// 							    			LayerConst.ThemeLoad("asset_nms");
// 						                    LayerConst.ThemeLoad("asset_fnms");
						                    //XeusLayer.createLegend("#legendWrap");
						                    GMXMAP.reloadLayerData("asset_fnms");
							    			//$(".contentWrapper").find('#searchTable').find('.sendData').val("");
							    			setList();
							    			resetPage();
							    		}
							    	});
							    	$("#popupWrap").dialog("close").html('');
								});
							},
							close: function(){
								$("#popupWrap").dialog("close").html('');
							}
						}).dialog("open");


						/* <div id="" class="bpopup" style="display: none;">
					    </div> */

            		});

            		$(".contentWrapper").find('#resultTable').find('.delBtn').click(function(){
            			var _self = $(this).parent().parent();

            			if(confirm("선택한 항목을 삭제하시겠습니까?")){
            				var k = _self.attr("k");

                			_common.callAjax("/netwk/getCableCntOfTheme.json", {'themeMgrNo':k}, function(json){
                				if(json.count > 0){
                					alert('해당 테마를 사용하는 케이블이 존재합니다.');
                				}else{
                					_common.callAjax("/netwk/delTheme.json", {'mgrNo':k}, function(json){
                        				if(json.result){
                        					alert('삭제되었습니다.');
                        					_self.remove();
                        				}
                        			});
                				}
                			});
            			}
            		});
            	} else {
            		var $tr = $('<tr><td colspan="4" class="tCenter">검색결과가 존재하지 않습니다.</td></tr>');
            		$(".contentWrapper").find('#resultTable').find('tbody').append($tr);
            	}
            }
        }, false);
    }

    $(".contentWrapper").find('#addBtn').click(function(){
    	var _param = _common.utils.collectSendData(".contentWrapper #searchTable");
    	if(_param['netGbnCd'] == "11" && _param['ringNo'] == ""){
    		alert('링 번호를 입력하여 주십시오.');
    		return false;
    	}
    	_common.callAjax("/netwk/addTheme.json", _param, function(json){
    		if(json.result){
    			alert('저장되었습니다.');
    			//TODO theme
//     			LayerConst.ThemeLoad("asset_fnms");
    			$(".popupWrapper").find('#searchTable').find('.sendData').val("");
    			setList();
    			resetPage();
    		}
    	});
    });

    //혹시나해서 off처리
    $(".contentWrapper").find('#netGbnCd').off('blur change');
    $(".contentWrapper").find('#netGbnCd').on('blur change', function(){
    	if($(".contentWrapper").find('#netGbnCd').val() == "11")
    		$(".contentWrapper").find('.ringTr').show();
    	else{
    		$(".contentWrapper").find('.ringTr').hide();
    		$(".contentWrapper").find('#ringNo').val('');
    	}
    });

    function resetPage(){
    	$(".contentWrapper").find("#searchTable").find("#mgrNo").val("");
		$(".contentWrapper").find("#searchTable").find("#netGbnCd").val("");
		$(".contentWrapper").find("#searchTable").find("#themeNm").val("");
		$(".contentWrapper").find("#searchTable").find("#ringNo").val("");
		$(".contentWrapper").find("#searchTable").find("#cableTyp").val("");
		$(".contentWrapper").find("#searchTable").find("#lineColor").val("#000000");
		$(".contentWrapper").find("#searchTable").find("#linkGbnCd").val("");

		$(".contentWrapper").find("#searchTable").find(".ringTr").hide();
    }

    function getPopupHtml(){
    	var str = '';
    	str+='<div class="popupWrapper">';
    	str+='    <div id="bpop_wrap">';
    	str+='        <table>';
    	str+='            <tr class="top hidden">';
    	str+='                <th class="top">관리번호</th>';
    	str+='                <td>';
    	str+='					<input type="hidden" id="mgrNo" name="mgrNo" class="sendData" value="">';
    	str+='                </td>';
    	str+='            </tr>';
    	str+='            <tr class="top hidden">';
    	str+='	            <th>망구분</th>';
    	str+='	            <td>';
    	str+='					<input type="hidden" id="netGbnCd" name="netGbnCd" class="sendData" value="">';
    	str+='	            </td>';
    	str+='	        </tr>';
    	str+='	        <tr class="top">';
    	str+='	            <th width="100px">테마명</th>';
    	str+='	            <td>';
    	str+='	                <input type="text" id="themeNm" name="themeNm" class="wide sendData">';
    	str+='	            </td>';
    	str+='	        </tr>';
    	str+='	        <tr class="top ringTr hidden">';
    	str+='	            <th width="100px">링번호</th>';
    	str+='	            <td>';
    	str+='	                <input type="text" id="ringNo" name="ringNo" class="wide sendData">';
    	str+='	            </td>';
    	str+='	        </tr>';
    	str+='	        <tr class="top">';
    	str+='	            <th>케이블종류</th>';
    	str+='	            <td>';
    	str+='	                <select id="cableTyp" name="cableTyp" class="sendData" style="outline: none;">';
    	str+='	                    <option value=""></option>';
    	str+='	                    <option value="1">실선</option>';
    	str+='	                    <option value="2">점선</option>';
    	str+='	                </select>';
    	str+='	            </td>';
    	str+='	        </tr>';

    	str+='	        <tr class="top">';
    	str+='	            <th>배선방식</th>';
    	str+='	            <td>';
    	str+='	                <select id="linkGbnCd" name="linkGbnCd" class="sendData" style="outline: none;">';
    	str+='	                    <option value=""></option>';
    	var codeGroup = _common.getCodeByGroup('C10');
    	for(var i=0; i< codeGroup.length; i++){
   		str+='						<option value="'+codeGroup[i].cdeCde+'">'+codeGroup[i].cdeNm+'</option>';
    	}
    	str+='	                </select>';
    	str+='	            </td>';
    	str+='	        </tr>';
    	str+='	        <tr class="top">';
    	str+='	            <th>선색상</th>';
    	str+='	            <td>';
    	str+='	                <input type="color" id="lineColor" name="lineColor" class="sendData" style="height:16px">';
    	str+='	            </td>';
    	str+='	        </tr>';
    	str+='		</table>';
    	str+='        <table>';
    	str+='            <tr align="center">';
    	str+='                <td class="lastTd" colspan="2" style="border: 0 !important;">';
    	str+='                    <button class="btn_style" id="editBtn" tabindex="5">저장</button>';
    	str+='                </td>';
    	str+='            </tr>';
    	str+='        </table>';
    	str+='    </div>';
    	str+='</div>';

    	return str;
    }

})();
</script>
<style>
#cableList {
	height: 300px;
	-webkit-appearance: none;
}

#theme_pop_wrap th{
	text-align: right;
    font-size: 13px;
    padding: 20px 15px 20px 15px;
    background-color: #35404C;
    color: white;
}
</style>

<!-- mgr_no serial NOT NULL, -- 관리번호
net_gbn_cd character(2), -- 망구분코드
theme_nm character varying(100), -- 망이름
ring_no character varying(20), -- 링번호
cable_typ character varying(100), -- 케이블종류
line_color character varying(12), -- 라인색상 -->


<div class="overflow contentWrapper customScroll" data-mcs-theme="minimal-dark" onselectstart="return false">



    <h3 class="title">테마 등록</h3>
    <div id="searchTable" class="box_style">
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">망구분</span>
    		<input type="text" id="netGbnCd" name="netGbnCd" class="wide sendData" value="12" style="border: none;">
    	</div>
    	<div class="info_box">
    		<span class="title">테마명</span>
    		<input type="text" id="themeNm" name="themeNm" class="wide sendData" style="border: none;">
    	</div>
    	<div class="info_box hidden" style="display: none;">
    		<span class="title">링번호</span>
    		<input type="text" id="ringNo" name="ringNo" class="wide sendData" style="border: none;">
    	</div>
    	<div class="info_box">
    		<span class="title">케이블 종류</span>
    		<select id="cableTyp" name="cableTyp" class="sendData" style="border: none;">
                    <option value=""></option>
                    <option value="1">실선</option>
                    <option value="2">점선</option>
            </select>
    	</div>
    	<div class="info_box">
    		<span class="title">배선방식</span>
    		<select id="linkGbnCd" name="linkGbnCd" class="sendData" style="border: none;">
                    <option value=""></option>
<% while(linkItr.hasNext()){
    String str = (String) linkItr.next(); %>
                    <option value="<%= str %>"><%= link.get(str) %></option>
<% } %>
                </select>
    	</div>
    	<div class="info_box">
    		<span class="title">선색상</span>
    		<input type="color" id="lineColor" name="lineColor" class="sendData" style="height:16px">
    	</div>
    	<button class="btn_style" id="addBtn">저장</button>
    </div>
    <h3 class="title">테마 목록</h3>
    <div>
    	<table>
<!-- 	    	<colgroup> -->
<!-- 		        <col width="50px"> -->
<!-- 		        <col width=""> -->
<!-- 		        <col width="100px"> -->
<!-- 		        <col width="60px"> -->
<!-- 	        </colgroup> -->
	        <thead>
		    	<tr>
		    		<th>구분</th>
		    		<th>이름</th>
		    		<th>색상</th>
		    		<th>관리</th>
		    	</tr>
	    	</thead>
	    </table>
    </div>
    <div class="customScroll" data-mcs-theme="minimal-dark">
    	<table id="resultTable" style="height: 0px !important;">
<!--     		<colgroup> -->
<!-- 		        <col width="50px"> -->
<!-- 		        <col width=""> -->
<!-- 		        <col width="100px"> -->
<!-- 		        <col width="60px"> -->
<!-- 	        </colgroup> -->
	   		<tbody>
	   		</tbody>
	    </table>
    </div>
</div>
