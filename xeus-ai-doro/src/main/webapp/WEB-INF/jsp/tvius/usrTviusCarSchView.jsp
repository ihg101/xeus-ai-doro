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

<style>
#searchResult tr{
    cursor: pointer;
}

.selectItem{
    font-weight: bold;
    font-size: 14px;
}
</style>

<script type="text/javascript">
var slider = null;

var spinnerOpts = {
		  lines: 13 // The number of lines to draw
		, length: 26 // The length of each line
		, width: 16 // The line thickness
		, radius: 42 // The radius of the inner circle
		, scale: 1 // Scales overall size of the spinner
		, corners: 1 // Corner roundness (0..1)
		, color: '#4582ac' // #rgb or #rrggbb or array of colors
		, opacity: 0.25 // Opacity of the lines
		, rotate: 0 // The rotation offset
		, direction: 1 // 1: clockwise, -1: counterclockwise
		, speed: 1 // Rounds per second
		, trail: 60 // Afterglow percentage
		, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
		, zIndex: 2e9 // The z-index (defaults to 2000000000)
		, className: 'spinner' // The CSS class to assign to the spinner
		, top: '50%' // Top position relative to parent
		, left: '50%' // Left position relative to parent
		, shadow: false // Whether to render a shadow
		, hwaccel: false // Whether to use hardware acceleration
		, position: 'absolute' // Element positioning
	}

$(window).resize(function(){
	setCss();
});

function setCss(){
	if($('.contentWrapper').find('#car-sch-image-panel').length > 0){
// 		var leftBlank = parseInt($('.contentWrapper').find('#center-overlay-west-tab').css('left')) + $("#" + parentView).find('#center-overlay-west-tab').width();
		var leftBlank = parseInt($('.contentWrapper').find('#center-overlay-west-tab').css('left')) + 200;
	    $('.contentWrapper').find('#car-sch-image-panel').css('position', 'absolute');
	    $('.contentWrapper').find('#car-sch-image-panel').css('left', leftBlank+2);
// 	    $('.contentWrapper').find('#car-sch-image-panel').css('bottom', $("#" + parentView).find('#overlay-south-side-bar').height()+'px');
		$('.contentWrapper').find('#car-sch-image-panel').css('bottom', '200px');
	    $('.contentWrapper').find('#car-sch-image-panel').css('width', $(window).width()-leftBlank);
	    $('.contentWrapper').find('#car-sch-image-panel').css('height', '357px');
	    $('.contentWrapper').find('#car-sch-image-panel').css('background', '#3e3f48');
	    $('.contentWrapper').find('#car-sch-image-panel').css('border', '1px solid #30303A');
	    if(slider != null) {
	    	slider.reloadSlider();
	    	$('.contentWrapper').find('.bx-viewport').css('box-shadow', '0 0 0px');
			$('.contentWrapper').find('.bx-wrapper').css('background', 'transparent');
			$('.contentWrapper').find('.bx-wrapper').css('border', 'none');
	    }
	}
}

function removeImgPanel(){
	if($('.contentWrapper').find('#car-sch-image-panel').length > 0) $('.contentWrapper').find('#car-sch-image-panel').remove();
}

function getKeyByValue( obj, value ) {
    for( var prop in obj ) {
        if( obj.hasOwnProperty( prop ) ) {
             if( obj[ prop ] === value)
                 return prop;
        }
    }
}

function getKeyByValues( obj, x, y ) {
    for( var prop in obj ) {
        if( obj.hasOwnProperty( prop ) ) {
             if( obj[ prop ]['x'] === x && obj[ prop ]['y'] === y )
                 return prop;
        }
    }
}

function showSpinner(){
// 	var width = TVIUS_BTN_TVIUS_CAR_SCH_WEST_SIZE - $('#'+parentView).find('#overlay-west-side-bar').width();
	var width = 650;
	var height = $('.contentWrapper').find('#overlay-west-contents').height();
	$('.contentWrapper').find("#loading_wrap").width(width);
	$('.contentWrapper').find("#loading_wrap").height(height);

	var target = $('.contentWrapper').find('#loading_img')[0];
	spinner = new Spinner(spinnerOpts).spin(target);
	$('.contentWrapper').find('#loading_wrap').show();
}

function hideSpinner(){
	$('.contentWrapper').find('#loading_wrap').hide();
}

$('.contentWrapper').find(".datePicker").datepicker("destroy").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd",
    showButtonPanel: true,
    beforeShowDay: $.datepicker.noBefore
});
// $('.contentWrapper').find(".datePicker").inputmask('yyyy-mm-dd', {placeholder: "_", autoUnmask: true});

$('.contentWrapper').find("#searchBtn").click(function(){
	showSpinner();
// 	removeImgPanel();

	if(crmsCarSchLayer != null) crmsCarSchSource.clear();

    var _param = _common.utils.collectSendData("#carSearchTable");

    if(_param['startDt'] != "") _param['startDt'] = _param['startDt'].replace(/\-/gi, '').trim() + '000000000';
    if(_param['endDt'] != "") _param['endDt'] = _param['endDt'].replace(/\-/gi, '').trim() + '235959999';
    _param['carLicenseNo'] = _param['carLicenseNo'].trim();
    if(_param['carLicenseNo'].trim() == ""){
        alert('차량번호를 입력하여 주십시오.');
        return false;
    }

    crmsCarSchLayer = null;

    if(crmsCarSchLayer == null){
        crmsCarSchSource = new ol.source.Vector();
        crmsCarSchLayer = new ol.layer.Vector({
//         	id: "crmsCarSchLayer", id값이 안들어가면 임시 객체로 판단해서 zoom, move 할때 클리어 안함.
        	name: "crmsCarSchLayer",
            source: crmsCarSchSource,
            zIndex: 9999
        });
       GMXMAP.addLayer(crmsCarSchLayer);
    }else{
    	if(GMXMAP.getLayer("crmsCarSchLayer") == null){
	        GMXMAP.addLayer(crmsCarSchLayer);
    	}
    }

    $('.contentWrapper').find('#searchResult').html('');

    _common.callAjax("/tvius/getCarNoList.json", _param, function(json) {
		hideSpinner();
        if(json.result.length > 0){
            for(var i=0; i<json.result.length; i++){
            	//!! 개발용으로 임의로 XXXX가 검색되게 허용했음.
            	//다른 건들은 차량별 CCTV조회 갯수가 1개뿐이 안됨.
            	//if(json.result[i].carLicenseNo.trim() != "XXXX"){
           		_param['carLicenseNo'] = json.result[i].carLicenseNo;
                _param['sortCol'] = 'lpr_seq';
                _param['sortTyp'] = 'ASC';
                _common.callAjax("/tvius/getCarSchList.json", _param, function(json2) {
                	var str = '';

                    for(var i=0; i<json2.result.length; i++){
                    	str += '<tr cctvno="' + json2.result[i].cctvNo + '">'
                    	str += '<td class="tCenter">'+(i+1)+'</td>';
                    	str += '<td class="tCenter">'+Date.prototype.formatYMDHM(json2.result[i].lprSeq)+'</td>';
                    	str += '<td class="tCenter">'+json2.result[i].carLicenseNo+'</td>';
                    	str += '</tr>'
                    }

					$("#pathBtn").data('param', _param);
					$("#pathBtn").data('list', json2.result);

                    $('.contentWrapper').find('#searchResult').append(str);
                }, false);
            	//}
            }

			$('.contentWrapper').find('#searchResult').find('tr').off('click');
            $('.contentWrapper').find('#searchResult').find('tr').click(function(){
            	$('.contentWrapper').find('#searchResult').find('tr').removeClass('selectItem');
                $(this).addClass('selectItem');

                _common.callAjax("/cctv/getCctv.json", {"deviceId" : $(this).attr("cctvno")}, function(json2){
   					var point = Spatial.convertProjection([Number(json2.result.lng), Number(json2.result.lat)], "EPSG:4326", "EPSG:5186");
                   	GMXMAP.addPulse(point, true);
                }, false);
            });

//             $('.contentWrapper').find("#pathBtn").off('click');
            //목록 클릭 이벤트
            $('.contentWrapper').find("#pathBtn").click(function(){
                crmsCarSchSource.clear();
                $('.contentWrapper').find('#searchResult').find('tr').removeClass('selectItem');

                var list = $(this).data().list;

                var cctvObj = {};//cctv번호, 번호당 순서와 시간이 저장됨.
                var cctvNoArr = new Array();//sql in 검색을 위한 배열
                for(var i=0; i<list.length; i++){
                    cctvNoArr.push(list[i].cctvNo);
                }

                var exceptionSeq = "";
                var exceptionDeviceId = new Array();
                _common.callAjax("/cctv/getCctvListAsCctvNo.json", {'cctvNoList': cctvNoArr.toString()}, function(json) {
                    if(json.count > 0 ){
                        for(var i=0; i<list.length; i++){
                        	var deviceIdChk = true;

                        	for(var j=0; j<json.result.length; j++){
                        		if(list[i].cctvNo == json.result[j].deviceId){
                        			deviceIdChk = false;
                        			continue;
                        		}
                        	}

                        	if(deviceIdChk){
                        		exceptionSeq += (i + 1) + "번 ";
                        		exceptionDeviceId.push(list[i].cctvNo);
                        		list.splice(i, 1);
                        	}
                        }

                    	if(exceptionSeq != ""){
	                        exceptionSeq += "검색결과를 제외하고 전체경로를 표출합니다.";
                        	if("addMapNotification" in GMXMAP) GMXMAP.addMapNotification(exceptionSeq, 5000);

                       		$(".contentWrapper").find("#searchResult").children().each(function(i){
                        		for(var i=0; i<exceptionDeviceId.length; i++){
                        		    if($(this).attr("cctvno") == exceptionDeviceId[i]) {
                        		    	$(this).css("color", "red");
                        		    }
	                        	}
                        	})
                    	}

                    	for(var i=0; i<list.length; i++){
                        	cctvObj[list[i].cctvNo] = {};
                        	cctvObj[list[i].cctvNo]['idx'] = (i+1);
                            cctvObj[list[i].cctvNo]['time'] = list[i].lprSeq;
                        }

                        var obj={};
                        for(var j=0; j<json.result.length; j++){
                            var point = Spatial.convertProjection([Number(json.result[j].lng), Number(json.result[j].lat)], "EPSG:4326", "EPSG:5186");
                            obj[json.result[j].deviceId] = {'x':point[0],'y':point[1]};
                        }
                        var points = [];
                        for(var k=0; k<list.length; k++){
                            var point = [ obj[list[k].cctvNo].x, obj[list[k].cctvNo].y ];
                            points.push(point);
                        }
                        var line =  new ol.Feature({
                            geometry: new ol.geom.LineString(points)
                        });
                        crmsCarSchSource.addFeature(line);

                        var styleFunction = function(feature) {
                            var geometry = feature.getGeometry();
                            var styles = [
                                // linestring
                                new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: '#FF0000',
                                        width: 3,
                                        lineDash: [.1, 5]
                                    })
                                })
                            ];
                            //각 점마다 넣는걸 못 찾아서 첫번째 점은 임의로 넣음.
                            //나머지 점들은 밑의 메소드에서 각 라인 세그먼트의 끝 점으로 넣기때문에 상관없음.
                            var firstPoint = geometry.getCoordinates()[0];
                            var firstPointCctvNo = getKeyByValues(obj, firstPoint[0], firstPoint[1]);
                            styles.push(new ol.style.Style({
                                geometry: new ol.geom.Point(firstPoint),
                                text : new ol.style.Text({
                                    text: cctvObj[firstPointCctvNo]['idx'] + ' : ' + Date.prototype.formatDateMDHM(cctvObj[firstPointCctvNo]['time']),
                                    textAlign: "center",
                                    textBaseline: "hanging",
                                    offsetY: 30,
                                    font: "bold 15px arial",
                                    fill: new ol.style.Fill({ color: 'red' })
                                })
                            }));
                            geometry.forEachSegment(function(start, end) {
                                var dx = end[0] - start[0];
                                var dy = end[1] - start[1];
                                var rotation = Math.atan2(dy, dx);
                                var cctvNo = getKeyByValues(obj, end[0], end[1]);
                                // arrows and text(lprTime)
                                styles.push(new ol.style.Style({
                                    geometry: new ol.geom.Point(end),
                                    text : new ol.style.Text({
                                        text: cctvObj[cctvNo]['idx'] + ' : ' + Date.prototype.formatDateMDHM(cctvObj[cctvNo]['time']),
                                        textAlign: "center",
                                        textBaseline: "hanging",
                                        offsetY: 30,
                                        font: "bold 15px arial",
                                        fill: new ol.style.Fill({ color: 'red' })
                                    }),
                                    image: new ol.style.Icon({
                                        src: '/xeus/res/img/arrow-red.png',
                                        anchor: [0.75, 0.5],
                                        rotateWithView: true,
                                        rotation: -rotation
                                    })
                                }));
                            });
                            return styles;
                        };
						crmsCarSchLayer.setStyle(styleFunction);
                        //영역을 구한 후 화면을 이동한다.
                        if(list.length > 1){
                        	var extent = line.getGeometry().getExtent();
                            var map = GMXMAP;
                            map.getView().fit(extent, map.getSize());
                    		GMXMAP.getView().setZoom(17);
                        } else {
                        	//줌은 현재 줌으로 유지하고 센터만 cctv의 위치로 설정한다.
                        	var point = Spatial.convertProjection([Number(json.result[0].lng), Number(json.result[0].lat)], "EPSG:4326", "EPSG:5186");
                        	GMXMAP.getView().setCenter(point);
//                     		GMXMAP.getView().setZoom();
                        }
                    } else {
                        alert('일치하는 CCTV가 없습니다.');
                    }
                });
            });

            $('.contentWrapper').find("#imageBtn").click(function(){
				var _param = $('#pathBtn').data('param');

				_common.callAjax("/tvius/getCarSchImage.json", _param, function(json){
					if(json.count > 0){
						//패널이 존재하면 패널 삭제
// 						removeImgPanel();
						//패널 생성
						var _html='';
                           _html += '<div id="car-sch-image-panel">';
                           _html += '	<div style="height: 30px; text-align: right;">';
                           _html += '	</div>';
                           _html += '</div>';

                   		$("#assetEditWrap").dialog("close").html(_html).dialog({
                   			title : "사진보기",
                   			width: 500,
							height: 400,
							position: {
								my: "right bottom",
								at: "right bottom",
								of: $("body")
							},
                   			open: function(){
                   			//이미지 표출
        						var _list = $('#pathBtn').data('list');

        						_html = '';
        						_html += '<ul class="slide_image">';//mCustomScrollbar" data-mcs-theme="minimal-dark"
        						for(var i=0; i<_list.length; i++){
        							_html += "<li class='img_div' style='position: relative;  margin-bottom:10px;'>";/* width:100%; height:350px; */
        							_html += '	<span class="imgBox">';
        							_html += '		<img class="imgs" style="height:235px;" alt="'+_list[i].carImgFileNm+'" src="/xeus/image/getCarImage.do?fileNm='+_list[i].carImgFileNm+'">';
        							_html += '	</span>';
        							_html += '	<span class="imgInfo">';
        							_html += '		차량번호 : '+_list[i].carLicenseNo+'<br>';
        							_html += '		'+Date.prototype.formatDateMDHM(_list[i].lprSeq)+'<br>';
        							_html += '	</span>';
        							_html += '</li>';
        						}
        						_html += "</ul>";
        						$('#car-sch-image-panel').append(_html);

        						$(".imgs").click(function(){
        							var url = $(this).attr("src");
        							url = url.replace("..", "xeus");
        							url = "http://"+location.host+url;

        							var image = new Image();
        							image.src = url;
        							var w = window.open("");
        							w.document.write(image.outerHTML);
        						});

        						$('.slide_image').css('list-style-type', 'none');
        						$('.img_div').css('display', 'inline');

        						var slider = $('.slide_image').bxSlider({
        							infiniteLoop: false,
        							hideControlOnEnd: true,
        							minSlides: 5,				//최소 노출 개수
        							minSlides: 5,				//최대 노출 개수
        							//slideWidth: 1000,			//길이...
        							slideMargin: 5				//슬라이드 사이 여백
        						});
                   			},
                   			close: function(){
                   			}
                   		}).dialog("open");
					}else{
						alert('사진을 가져오는데 실패하였습니다.');
					}
				}, false);
            });
        } else {
            alert('검색결과가 존재하지 않습니다.');
        }
    });
});

$('.contentWrapper').find("#carLicenseNo").keyup(function(e){
	if(e.which == 13){
		$('.contentWrapper').find("#searchBtn").click();
	}
});
</script>
<div id="loading_wrap">
    <span id="loading_img"></span> <span id="loading_blank"></span>
</div>

<div class="contentWrapper customScroll" data-mcs-theme="minimal-dark">

<!--     <h3 class="title">차량 운행 검색</h3> -->
    <span class="ui-helper-hidden-accessible"><input type="text"/></span>
    <div id="carSearchTable" class="box_style">
    	<table id="searchTable" class="searchTable">
    		<tr>
    			<th  width="100px">기간</th>
    			<td>
		    		<input id="startDt" class="sendData datePicker tCenter middle" type="text" value="" readonly="readonly" style="width: 45% !important;"> ~
					<input id="endDt" class="sendData datePicker tCenter middle" type="text" value="" readonly="readonly" style="width: 45% !important;">
    			</td>
    		</tr>
    		<tr>
    			<th  width="100px">차량번호</th>
    			<td>
		    		<input type="text" id="carLicenseNo" class="sendData">
    			</td>
    		</tr>
    	</table>
    	<!-- <div class="info_box">
    		<span class="title">차량 유형</span>
    		<select id="carKindtype" class="tviusSelect sendData">
                    <option value="">전체</option>
                    <option value="승합">승합</option>
                    <option value="미분류">미분류</option>
                    <option value="승용">승용</option>
                    <option value="특수">특수</option>
                    <option value="화물">화물</option>
                </select>
    	</div> -->
    	<!-- <div class="info_box wd100">
    		<span class="title">차량번호</span>
    	</div> -->
    	<button class="btn_style" id="searchBtn">검 색</button>
    </div>
    <div>
        <h3 class="title">검색결과</h3>
        <div style="position: absolute;right:10px;top:192px;">
	        <button id="pathBtn" class="btn_Dstyle">전체경로보기</button>
	        <button id="imageBtn" class="btn_Dstyle">사진보기</button>
        </div>
    </div>
    <table>
        <thead>
            <tr>
            	<th>순서</th>
            	<th>시간</th>
                <th>차량번호</th>
            </tr>
        </thead>
        <tbody id="searchResult"></tbody>
    </table>
</div>
