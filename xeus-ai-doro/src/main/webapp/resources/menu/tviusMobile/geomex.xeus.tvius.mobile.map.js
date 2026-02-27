"use strict";
var intervalStatChk = null;

var map = null;
var cctv = null;
var daumMap = null;
var cctvTheme = null;
var validation = null;
var createMgrSeq = null;
var isImageRqst = false;
var formatCctvNm = null;
var addImgList = new Array();
var intervalRqst = null;

$(document).ready(function(){

	$(".cctvDateYY").parent().width(50);
	$(".cctvDateMM, .cctvDateDD, .cctvDateHH, .cctvDateMI").parent().width(35);
////	$('.cctv-li').find('.ui-input-text').css('width','')

	$(".cctvDateMM").change(function() {
	    var v = parseInt(this.value);
	    if (v <= 0){
	    	this.value = "01";
	    	return;
	    }
	    if (v >= 12){
	    	this.value = "12";
	    	return;
	    }

	    if(this.value.length == 1){
	    	if(v >= 0 && v <= 9){
	    		$(this).val("0"+this.value);
	    	}
		}
	});

	$(".cctvDateDD").change(function() {
	    var v = parseInt(this.value);
	    if (v <= 0) {
	    	this.value = "01";
	    	return;
	    }
	    if (v >= 31){
	    	this.value = "31";
	    	return;
	    }
	    if(this.value.length == 1){
	    	if(v >= 0 && v <= 9){
	    		$(this).val("0"+this.value);
	    	}
		}
	});

	$(".cctvDateHH").change(function() {
	    var v = parseInt(this.value);
	    if (v <= 0){
	    	this.value = "00";
	    	return;
	    }
	    if (v > 24){
	    	this.value = "00";
	    	return;
	    }
	    if (v == 24){
	    	this.value = "23";
	    	$(this).parent().parent().parent().find(".cctvDateMI").val("59");
	    	return;
	    }

	    if(this.value.length == 1){
	    	if(v >= 0 && v <= 9){
	    		$(this).val("0"+this.value);
	    	}
		}
	});

	$(".cctvDateMI").change(function() {
	    var v = parseInt(this.value);
	    if (v <= 0){
	    	this.value = "00";
	    	return;
	    }
	    if (v >= 60){
	    	this.value = "59";
	    	return;
	    }
	    if(this.value.length == 1){
	    	if(v >= 0 && v <= 9){
	    		$(this).val("0"+this.value);
	    	}
		}
	});


	/**
	 * CCTV 명칭을 포멧팅 합니다.
	 * 서초의 기준으로 세미콜론을 스페이스로 변경하고 줄바꿈 합니다.
	 */
	formatCctvNm = function(cctvNm){
		var cctvNmText = cctvNm;

		if(cctvNm.contains(";")){
			var cctvNmSplit = cctvNm.split(";");
			if(cctvNmSplit.length >= 4){
				cctvNmText  = cctvNmSplit[0] + " " + cctvNmSplit[1];
				cctvNmText += "<br>";
				cctvNmText += cctvNmSplit[2] + " " + cctvNmSplit[3];

				if(cctvNmSplit.length >= 5) cctvNmText += " " + cctvNmSplit[4];
			}
		}

		return cctvNmText;
	}

	/*if(location.pathname.contains("/getUsrTviusImageRqst.do")){
		$("#reqGbnCd").find("option[value=16]").prop("selected", true);
		$("#reqGbnCd").not("option[value=16]").remove();
	}*/

	var renameTocctvIndexText = function(){
		$("#cctvSelectWrap").find(".idxB").each(function(i, e){
			$(this).text(i + 1);
		});
	};

	var renameToImageIndexText = function(){
		$("#imageSelectWrap").find(".idxB").each(function(i, e){
			$(this).text(i + 1);
		});
	};

	/**
	 * 데이터를 검증합니다.
	 */
	validation = function(param){
		var isBreak = false;

		for(var key in param){
			if(_common.utils.isNullAndEmpty(param[key])){
				$("#addBtn, #editBtn").attr("type", "submit");

				isBreak = true;
				break;
			}
		}

		if(!isBreak){
			if($(".selectCctvInfo").length == 0){
				alert("신청 대상 CCTV를 추가해 주세요.");
				return true;
			}else if($(".selectCctvInfo").length > 20){
				alert("CCTV는 최대 20개까지 신청할 수 있습니다.");
				return true;
			}
			else{
				$("#addBtn, #editBtn").attr("type", "button");
				delete param["sDate"];
				delete param["eDate"];
			}

			if(isImageRqst){
				if($(".selectImageInfo").length == 0){
					alert("신청 대상 이미지를 추가해 주세요.");
					return true;
				}else{
					$("#addBtn, #editBtn").attr("type", "button");
				}
			}
		}

		if(!isBreak){
			var compareArray = new Array();

			$(".selectCctvInfo").each(function(){
				var txt = "";
				txt += $(this).text();
				txt += "@@@" + $(this).parent().find(".sDate").val();
				txt += "@@@" + $(this).parent().find(".eDate").val();

				compareArray.push(txt);
			});

			for(var i=0; i<compareArray.length; i++){
				var isContains = false;
				for(var l=0; l<compareArray.length; l++){
					if(i != l) {
						if(compareArray[i] == compareArray[l]) {
							var strSplit = compareArray[i].split("@@@");

							var alertTxt = "중복 신청 항목이 존재합니다.\n\n";
							alertTxt += "명칭 : " + strSplit[0] + "\n";
							alertTxt += "시작 : " + strSplit[1].replace("T", " ") + "\n";
							alertTxt += "종료 : " + strSplit[2].replace("T", " ") + "\n\n";
							alertTxt += "신청 대상을 다시 확인해 주세요.";

							alert(alertTxt);

							isContains = true;
							break;
						}
					}
				}
				if(isContains) break;
			}
		}

		$(".selectCctvInfo").each(function(){
//			var sDate = $(this).parent().find(".sDate").val() + "00";
//			var eDate = $(this).parent().find(".eDate").val() + "00";
			if(!isBreak){
				var sDate = $(this).parent().find(".sDate").find(".cctvDateYY").val() + $(this).parent().find(".sDate").find(".cctvDateMM").val() + $(this).parent().find(".sDate").find(".cctvDateDD").val() + $(this).parent().find(".sDate").find(".cctvDateHH").val() +$(this).parent().find(".sDate").find(".cctvDateMI").val() + "00";
				var eDate = $(this).parent().find(".eDate").find(".cctvDateYY").val() + $(this).parent().find(".eDate").find(".cctvDateMM").val() + $(this).parent().find(".eDate").find(".cctvDateDD").val() + $(this).parent().find(".eDate").find(".cctvDateHH").val() +$(this).parent().find(".eDate").find(".cctvDateMI").val() + "00";

				var cctvNm = $(this).parent().find('.selectCctvInfo').attr('cctvNm');

				var date = new Date();
				var now = String(date.getFullYear()) + leadingZeros(((date.getMonth()+1)),2) + leadingZeros(date.getDate(),2) + leadingZeros(date.getHours(),2)+ leadingZeros(date.getMinutes(),2)+"00";

				if(sDate> now || eDate > now){
					alert("cctv : "+cctvNm+"\n\n시작 시간 또는 종료시간이 미래시간입니다.");
					isBreak = true;
					return;
				}


				if(sDate >= eDate){
					alert("cctv : "+cctvNm+"\n\n시작 시간은 종료 시간보다 과거여야 합니다.");

					isBreak = true;
					return;
				};

				var diff = Date.prototype.formatDiffTime(sDate, eDate);

				for(var k in diff){
					if(!_common.utils.validNaN(diff[k])){
						alert("cctv : "+cctvNm+"\n\n올바르지 않은 시간이 존재합니다.");

						isBreak = true;
						return;
						break;
					}
				}
				//캡쳐
				if(isCapture){
					if(diff.diffDay >= 32){
						alert("cctv : "+cctvNm+"\n\n영상반출 시간은 30일 이내로 설정해야됩니다.");

						isBreak = true;
						return;
					}
				}else{
					//열람
					if($('#reqGbnCd').val() == 12){
						if(diff.diffDay >= 32){
							alert("cctv : "+cctvNm+"\n\n영상반출 시간은 30일 이내로 설정해야됩니다.");

							isBreak = true;
							return;
						}
					}
					//반출
					else{
						if(diff.diffDay >= 1 || diff.diffHour >= 12){
							alert("cctv : "+cctvNm+"\n\n영상반출 시간은 12시간 이하로 설정해야됩니다.");

							isBreak = true;
							return;
						}
					}
				}
			}
		});

		return isBreak;
	}
	/*
	 *  leadingZeros(1,2) 이면 01을 반환해주는 date 관련 함수
	 */
	function leadingZeros(n, digits) {
		  var zero = '';
		  n = n.toString();
		  var i;
		  if (n.length < digits) {
		    for (i = 0; i < digits - n.length; i++)
		      zero += '0';
		  }
		  return zero + n;
	}

	/**
	 * 계정 검증 또는 보안서약 정보를 검증합니다.
	 */
	var validationUserInfo = function(){

		if(!$("#agreeSecurity").is(":checked")){
			alert("서약 내용에 동의가 필요합니다.");
			$("#agreeSecurity").focus();
			return false;
		}

		if(_common.utils.isNullAndEmpty($("#userPwd").val())){
			alert("본인 확인을 위하여 암호를 입력해 주세요.");
			$("#userPwd").focus();
			return false;
		}

		if(_common.utils.isNullAndEmpty($("#departNm").val())){
			alert("소속 및 부서를 입력해 주세요.");
			$("#departNm").focus();
			return false;
		}

		if(!validPassword($("#reqstId").val(), $("#userPwd").val())){
			//alert("계정 인증에 실패하여 신청할 수 없습니다.");
			return false;
		}

		return true;
	}

	/**
	 * 이미지 반출일 경우 입력한 계정이 존재하는지 검증합니다.
	 */
	var validationImageRqstInfo = function(){
		if(isImageRqst){
			var isValidUser = true;
			_common.callAjax("/tvius/mobile/getUserInfo.json", { "userId" : $("#reqstId").val() }, function(json){
				if(_common.utils.isNullAndEmpty(json.result)){
					isValidUser = false;
					alert("계정 정보가 존재하지 않습니다. 신청자의 ID를 다시 입력하세요.");

//					var reqstId = prompt("신청자의 ID를 입력하세요.");
//					$("#reqstId").val(reqstId);
					//$("#reqstId").focus();
				}else{
					$("#userNm").val(json.result.userNm);
					$("#birthDay").val(json.result.birthDay);
					$("#mobileNum").val(json.result.mobileNum);
					$("#departNm").attr("depart", json.result.departNm).val(json.result.departNm);
				}
			}, false);

			if(!isValidUser) return false;
			else return true
		}else{
			return true;
		}
	}

	/**
	 * 신청번호를 생성합니다.
	 */
	createMgrSeq = function(){
		var baseTimestamp = 1000 * 60 * 60 * 24 * 365 * 40;
		var currentTimeMillis = new Date().getTime();
		var SerialNumGenPrev = currentTimeMillis - baseTimestamp;

		return SerialNumGenPrev;
	};

	if($("#mgrSeq").val() == "") $("#mgrSeq").val(createMgrSeq());
	$("#baseDateTime").attr("max", new Date().getYMDHM(true).replace(" ", "T"));
	$("#baseDateTime").val(new Date().getYMDHM(true).replace(" ", "T"));

	daumMap = new DaumMap().createMapLayer({ lyrNm : "daum", visibleYn : true, lyrZidx : 1, grpNm : "배경지도" });

	_common.callAjax("/sym/getLyrSymList.json", {"lyrNm" : "asset_cctv"}, function(json) {
		if(json.result){
			cctvTheme = {};
			for(var i=0; i<json.result.length; i++){
				cctvTheme[json.result[i].gbnCd] = json.result[i].symMgrNo;
			}
		}
	}, false);

	/**
	 * CCTV 레이어를 생성합니다.
	 */
	cctv = new ol.layer.Vector({
		name : "cctv",
		visible : true,
		zIndex : 1,

		source : new ol.source.Cluster({
			distance: 10,
			source: new ol.source.Vector({
				strategy : ol.loadingstrategy.bbox,
				loader : function(extent, resolution, projection) {
					var _source = this;
					var _format = new ol.format.GeoJSON();
					var _wfsParam = {
						service : 'WFS',
						version : '1.1.0',
						request : 'GetFeature',
						typename : "gmx:asset_cctv",
						outputFormat : 'json',
						srsname : "EPSG:5186",
						tbl : "asset_cctv",
						bbox : extent.join(',') + ',EPSG:5186'
					}
					$.ajax({
						//url : "../../CustomWFS",
						url : "../../GMT_proxy/wfs",
						data : _wfsParam,
						dataType : 'json',
						beforeSend : function() {
							_source.clear();
						},
						success : function(data) {
							$("#errMsg").hide();
							var features = _format.readFeatures(data);
							_source.addFeatures(features);
							data = null;
						},
						error : function(xhr, status, error) {
							$("#errMsg").show();
						}
					});
				}
			})
		}),
		style : function(features){
			var url = "../../res/sym/cctv/99.png";

			if(cctvTheme){
				var list = features.get("features");
				//if(list.length == 1) url = "../../sym/getSymbol.do?mgrNo=" + cctvTheme[list[0].get("gbn_cd")];
				if(list.length > 10) url = "../../sym/getSymbol.do?mgrNo=" + cctvTheme["XX"];
				for(var i=2; i<11; i++){
					if(list.length == i) url = "../../sym/getSymbol.do?mgrNo=" + cctvTheme["X" + i];
				}
			}

			return new ol.style.Style({
				image: new ol.style.Icon({
					anchor : [ 0.5, 0.5 ],
					size : [ 40, 40 ],
					scale : 0.7,
					crossOrigin: "anonymous",
					src: url
				})
			})
		}
	});

	/**
	 * 지도 객체를 생성합니다.
	 */
	map = new ol.Map({
		controls : ol.control.defaults().extend([ new ol.control.FullScreen() ]),
		renderer: "webgl",
		logo : false,
		target : "map",
		layers : [ daumMap, cctv ],
		interactions: ol.interaction.defaults({
			dragPan: false,
			pinchRotate: false,
			mouseWheelZoom: false,
			altShiftDragRotate: false
		}).extend([
		    new ol.interaction.DragPan({ kinetic: false }),
		    new ol.interaction.MouseWheelZoom({ duration: 0 })
		]),
		view : new ol.View({
			projection : ol.proj.get("EPSG:5186"),
			center  : _GMXMAP_DEF_CENTER_,
			zoom    : _GMXMAP_DEF_ZOOM_,
			minZoom : _GMXMAP_MIN_ZOOM_,
			maxZoom : _GMXMAP_MAX_ZOOM_
		})
	});

	$(".ol-full-screen-false, .ol-full-screen-true").text("");

	/**
	 * 지도 클릭 이벤트 입니다.
	 */
	map.on("click", function(evt){
		//$("#listView").children().not(":eq(0)").remove();
		$("#listView").children().remove();
		$("#cctvList").find("lable").remove();
		$("#cctvList").find("button").remove();
		$("#cctvList").find("#allCheck").remove();
		$("#cctvList").prepend("<lable for='allCheck'><b id='forAll' style='display: inline-block;'>전체 선택</b></lable>");
		$("#cctvList").prepend("<input id='allCheck' name='allCheck' type='checkbox'>");
		$("#cctvList").prepend("<button class='ui-btn ui-btn-a ui-shadow ui-corner-all' type='button' data-theme='a' id='addCctvListBtn'>추가</button>");

		$("#cctvList").find("b#forAll").click(function(){
			$("#cctvList").find("input#allCheck").click();
		});

		/**
		 * 클릭 지점 팝업 이벤트 입니다.
		 */
		var hit = map.forEachFeatureAtPixel(evt.pixel, function(features, layer){
			var list = features.getProperties().features;
			if(list.length > 0){

				list.sort(function(a, b){
					return ('' + a.getProperties().cctv_nm).localeCompare(b.getProperties().cctv_nm);
				});

				for(var i=0; i<list.length; i++){
					var prop = list[i].getProperties();

					var cctvNm = prop["cctv_nm"];
//					var gbnCd = prop["gbn_cd"];

//					if(cctvNm === $("#cctvSelectWrap").find(".selectCctvInfo").attr("cctvNm")) continue;
					if($("#listView").children().length >= 10) break;

					var $li = $("<li></li>");
					var $btn = $("<button class='addCctvBtn ui-btn'></button>").attr({ "cctvNm" : cctvNm }).data(prop).click(function(){
						$(this).find("input[type=checkbox]").click();
					});
//					var $img = $("<img src='../../sym/getSymbol.do?mgrNo=" + cctvTheme[gbnCd] + "'>");
					var $checkBox = $("<input type='checkbox'>").click(function(e){
						e.stopPropagation();
					});

//					var $img = $("<img src='../../res/sym/cctv/99.png'>");
					var $txt = $("<span>" + cctvNm + "</span>");

					$li.append($btn.append($checkBox).append($txt));

					$("#listView").append($li);
				}

				var timeout = setTimeout(function(){
					$(".ol-full-screen-true").click();

					$("#popupMenu").popup("open");
					clearTimeout(timeout);
					timeout = null;
				}, 100);
			}
		});


		/*
		 * 전체 선택 체크박슼 클릭 시
		 */
		$("#popupMenu").find("#allCheck").click(function(){
			 if($(this).prop("checked")){
				 $("#listView").find(".addCctvBtn").each(function(){
					 $(this).find("input").prop("checked",true);
				 });
	        }else{
	        	 $("#listView").find(".addCctvBtn").each(function(){
					 $(this).find("input").prop("checked",false);
				 });
	        }
		});

		/**
		 * CCTV 추가 이벤트 입니다.
		 */
		$("#popupMenu").find("#addCctvListBtn").click(function(){
			var cnt = 0;
			var bol = true;
			//이미 추가된 CCTV나 반출신청할 수 없는 CCTV가 하나라도 있으면 추가 불가
			$("#listView").find(".addCctvBtn").each(function(){
				if($(this).find("input").is(":checked")){
					cnt++;
					var cctvNm = $(this).text();
					var mgrNo = null;
					if(bol){
						_common.callAjax("/cctv/getCctv.json", { "oneCctvNm" : cctvNm }, function(json) {
							mgrNo = json.result.mgrNo;
							if(_common.utils.isNullAndEmpty(mgrNo)){
//									unableCctvList.push(cctvNm);
								alert(cctvNm+"\n은(는) 현재 반출 신청할 수 없습니다. 체크해제 후 추가버튼을 눌러주세요.");
								bol=false;
							}
						}, false);

//						if($(".selectCctvInfo[mgrno=" + mgrNo + "]").length > 0){
//							alert(cctvNm+"\n은(는) 이미 추가되었습니다. 체크해제 후 추가버튼을 눌러주세요.");
//							bol=false;
//						}
					}
				}
			});
			if(cnt == 0){
				alert("CCTV를 선택하세요.");
				return;
			}
			if(!bol){
				return;
			}

			if(confirm("선택된 CCTV를 추가하시겠습니까?")){

				$("#listView").find(".addCctvBtn").each(function(){
					if($(this).find("input").is(":checked")){
						var cctvNm = $(this).text();

						var mgrNo = null;
						_common.callAjax("/cctv/getCctv.json", { "oneCctvNm" : cctvNm }, function(json) {
							mgrNo = json.result.mgrNo;
						}, false);

						var $idxB  = $("<b class='idxB'>").text($(".selectCctvInfo").length + 1);
						//var $marqu = $("<marquee>").text(cctvNm);
						var $textB = $("<b class='textB sText'>").html(formatCctvNm(cctvNm));
						var $title = $("<button type='button' class='selectCctvInfo ui-btn ui-icon-delete ui-btn-icon-right' data-role='button'></button>").attr({ "cctvNm" : cctvNm, "mgrNo" : mgrNo }).append($idxB).append($textB);

						/*var $sDate = $("<div class='ui-block-a'><p>시작시간</p><input id='secStDat' type='datetime-local' class='sDate sendData' value='' placeholder='선택' required></div>");
						var $eDate = $("<div class='ui-block-b'><p>종료시간</p><input id='secEdDat' type='datetime-local' class='eDate sendData' value='' placeholder='선택' required></div>");*/
//						var $sDate = $("<div class='ui-block-a'><p>시작시간</p><input id='secStDat' type='number' pattern='[0-9]*' inputmode='numeric' class='sDate sendData' value='' placeholder='년월일시분' required onKeyPress='if(this.value.length==12) return false;'></div>");
//						var $eDate = $("<div class='ui-block-b'><p>종료시간</p><input id='secEdDat' type='number' pattern='[0-9]*' inputmode='numeric' class='eDate sendData' value='' placeholder='년월일시분' required onKeyPress='if(this.value.length==12) return false;'></div>");

						var thisDate = new Date();
						var thisYear = thisDate.getFullYear();

						var $sDate = $("<div class='ui-block-a sDate'><table><tr><td><p>시작시간</p></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateYY' placeholder='년' required onKeyPress='if(this.value.length==4) return false;' value='"+thisYear+"'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateMM' placeholder='월' required onKeyPress='if(this.value.length==2) return false;'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateDD' placeholder='일' required onKeyPress='if(this.value.length==2) return false;'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateHH' placeholder='시' required onKeyPress='if(this.value.length==2) return false;'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateMI' placeholder='분' required onKeyPress='if(this.value.length==2) return false;'></td></tr></table></div>");
						var $eDate = $("<div class='ui-block-a eDate'><table><tr><td><p>종료시간</p></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateYY' placeholder='년' required onKeyPress='if(this.value.length==4) return false;' value='"+thisYear+"'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateMM' placeholder='월' required onKeyPress='if(this.value.length==2) return false;'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateDD' placeholder='일' required onKeyPress='if(this.value.length==2) return false;'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateHH' placeholder='시' required onKeyPress='if(this.value.length==2) return false;'></td><td><input type='number' pattern='[0-9]*' class='tCenter cctvDateMI' placeholder='분' required onKeyPress='if(this.value.length==2) return false;'></td></tr></table></div>");





						var baseTerm = Number($("#baseTerm").val());
						var baseDateTimeVal = $("#baseDateTime").val();

						var eDateTime = new Date().subtractMinutes(baseDateTimeVal, baseTerm, true).replace(" ", "T");
						var sDateTime = new Date().subtractHours(eDateTime, 1, true).replace(" ", "T");

						var minDateTime = new Date().subtractMonth(eDateTime, 1, true).replace(" ", "T");
						var maxDateTime = $("#baseDateTime").attr("max");


//						$sDate.find(".sDate").val(sDateTime).attr("max", maxDateTime).attr("min", minDateTime);
//						$eDate.find(".eDate").val(eDateTime).attr("max", maxDateTime);

//						var  thisDate = new Date();
//						var thisYear = thisDate.getFullYear();

//						$sDate.find(".sDate").attr("max", maxDateTime).attr("min", minDateTime);
//						$eDate.find(".eDate").attr("max", maxDateTime);

//						$sDate.find(".sDate").change(function(){
//							var eVal = $eDate.find(".eDate").val();
//
//							var sDate = new Date($(this).val());
//							var eDate = new Date(eVal);
//
//							var defaultVal = new Date().subtractMinutes(eVal, baseTerm, true).replace(" ", "T");
//							if(sDate >= eDate){
//								$(this).val(defaultVal);
//								alert("시작 시간은 종료 시간보다 과거여야 합니다.");
//							};
//
//							var minus6 = new Date().subtractHours(eDate, 12, true).replace(" ", "T");
//							if(sDate < eDate){
//								$(this).val("");
//								alert("영상반출 시간은 12시간 이하로 설정해야됩니다.");
//							}
//						});

//						$eDate.find(".eDate").change(function(){
//							var sVal = $sDate.find(".sDate").val();
//
//							var sDate = new Date(sVal);
//							var eDate = new Date($(this).val());
//
//							if(sDate >= eDate){
//								$(this).val("");
//								alert("종료 시간이 시작 시간과 같거나 과거입니다.\n시간을 다시 선택해 주세요.");
//							}
//
//							var minus6 = new Date().subtractHours(eDate, 12, true).replace(" ", "T");
//							if(sDate < eDate){
//								$(this).val("");
//								alert("영상반출 시간은  12시간 이하로 설정해야됩니다.");
//							}
//						});

						var $wrap = $("<fieldset class='ui-grid-a tCenter'></fieldset>");
						$wrap.append($title).append($sDate).append($eDate);

						$title.click(function(){
							if(confirm($(this).attr("cctvNm") + "\n\nCCTV를 목록에서 제거하시겠습니까?")){
								$(this).parent().parent().remove();
								renameTocctvIndexText();
								if($(".cctv-li").length == 0){
									$("#cctvSelectWrap").find('#applyBtn').remove();
								}
							}
						});

						var $li = $("<li>").addClass("ui-li-static ui-body-inherit ui-last-child cctv-li").append($wrap);
						if($("#cctvSelectWrap").find("#applyBtn").length == 0){
							$('#select-list-header').after('<li><button type="button" data-theme="b" id="applyBtn">시간 일괄 적용</button></li>');

							/**
							 * 시간 일괄 적용 클릭 이벤트
							 */
							$("#applyBtn").on("click", function(){
								var timeout = setTimeout(function(){

									var eDateTime = new Date().subtractMinutes(baseDateTimeVal, baseTerm, true).replace(" ", "T");
									var sDateTime = new Date().subtractHours(eDateTime, 1, true).replace(" ", "T");

									$("#popupAllTimeApply").find("#allSecStDat").val('');
									$("#popupAllTimeApply").find("#allSecEdDat").val('');

									$("#popupAllTimeApply").popup("open");

									clearTimeout(timeout);
									timeout = null;
								}, 100);
							});


						}

						$("#cctvSelectWrap").append($li);

						bindCheckDateRange();
						//alert("추가되었습니다.");
					}
				});

				renameTocctvIndexText();


				$("#cctvSelectWrap").trigger("create");

				$(".cctvDateYY").parent().width(50);
				$(".cctvDateMM, .cctvDateDD, .cctvDateHH, .cctvDateMI").parent().width(35);

				$("#popupMenu").popup("close");

			}
		});
	});


	$("#applyBtn").on("click", function(){
		var timeout = setTimeout(function(){

			var baseTerm = Number($("#baseTerm").val());
			var baseDateTimeVal = $("#baseDateTime").val();

			var eDateTime = new Date().subtractMinutes(baseDateTimeVal, baseTerm, true).replace(" ", "T");
			var sDateTime = new Date().subtractHours(eDateTime, 1, true).replace(" ", "T");

			$("#popupAllTimeApply").find("#allSecStDat").val(sDateTime);
			$("#popupAllTimeApply").find("#allSecEdDat").val(eDateTime);

			$("#popupAllTimeApply").popup("open");

			clearTimeout(timeout);
			timeout = null;
		}, 100);
	});

	/**
	 * 수정페이지에서 CCTV 항목의 이벤트를 바인딩합니다.
	 */
	$(".selectCctvInfo").each(function(){
		var cctvNm = $(this).attr("cctvNm");

		var $title = $(this);
		var $sDate = $(this).parent().find(".sDate").parent();
		var $eDate = $(this).parent().find(".eDate").parent();

		var baseTerm = Number($("#baseTerm").val());
		var baseDateTimeVal = $("#baseDateTime").val();

		var eDateTime = new Date().subtractMinutes(baseDateTimeVal, baseTerm, true).replace(" ", "T");
		var sDateTime = new Date().subtractHours(eDateTime, 1, true).replace(" ", "T");

		var minDateTime = new Date().subtractMonth(eDateTime, 1, true).replace(" ", "T");
		var maxDateTime = $("#baseDateTime").attr("max");

		$title.find(".textB").html(formatCctvNm($title.find(".textB").text()));

		$sDate.find(".sDate").attr("max", maxDateTime).attr("min", minDateTime);
		$eDate.find(".eDate").attr("max", maxDateTime);

		$sDate.find(".sDate").change(function(){
			var eVal = $eDate.find(".eDate").val();

			var sDate = new Date($(this).val());
			var eDate = new Date(eVal);

			var defaultVal = new Date().subtractMinutes(eVal, baseTerm, true).replace(" ", "T");
			if(sDate >= eDate){
				$(this).val(defaultVal);
				alert("시작 시간은 종료 시간보다 과거여야 합니다.");
			};

			var minus6 = new Date().subtractHours(eDate, 12, true).replace(" ", "T");
			if(sDate < eDate){
				$(this).val("");
				alert("영상반출 시간은 12시간 이하로 설정해야됩니다.");
			}
		});

		$eDate.find(".eDate").change(function(){

			var sVal = $sDate.find(".sDate").val();

			var sDate = new Date(sVal);
			var eDate = new Date($(this).val());

			if(sDate >= eDate){
				$(this).val("");
				alert("종료 시간이 시작 시간과 같거나 과거입니다.\n시간을 다시 선택해 주세요.");
			}

			var minus6 = new Date().subtractHours(eDate, 12, true).replace(" ", "T");
			if(sDate < eDate){
				$(this).val("");
				alert("영상반출 시간은 12시간 이하로 설정해야됩니다.");
			}
		});

		$title.click(function(){
			if(confirm($(this).attr("cctvNm") + "\n\nCCTV를 목록에서 제거하시겠습니까?")){
				$(this).parent().parent().remove();
				renameTocctvIndexText();
				if($(".cctv-li").length == 0){
					$("#cctvSelectWrap").find('#applyBtn').remove();
				}
			}
		});
	});

	var dataURLtoFile = function(imgUrl, fileNm){
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function(){
				var arr = reader.result.split(","), mime = arr[0].match(/:(.*?);/)[1];
				var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

				while(n--){
					u8arr[n] = bstr.charCodeAt(n);
				}

				var imgFile = new File([u8arr], fileNm, { type : mime });
				addImgList.push(imgFile);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open("GET", imgUrl);
		xhr.responseType = "blob";
		xhr.send();
	}

	/**
	 * 수정페이지에서 Image 항목의 이벤트를 바인딩합니다.
	 */
	$(".selectImageInfo").each(function(){
		var $title = $(this);
		var $thumb = $(this).next();

		dataURLtoFile($thumb.attr("src"), $title.attr("imgNm"));

		$title.click(function(){

			if(confirm($(this).find('b.textB').text() + "\n\n이미지를 목록에서 제거하시겠습니까?")){
				var idx = $(".selectImageInfo").index($(this));
				addImgList.splice(idx, 1);

				$(this).parent().parent().remove();
				renameToImageIndexText();
			}
		});

		$thumb.click(function(){
			var nowName = $(this).parent().find(".selectImageInfo").attr("imgDesc");
			var reName = prompt("이미지 이름을 입력하세요.\n\n현재 이름 : " + $(this).parent().find(".selectImageInfo").attr("imgDesc").split(".")[0]);
			if(!_common.utils.isNullAndEmpty(reName) && (reName !== nowName)){
				$(this).parent().find(".selectImageInfo").find("b.textB.sText").text(reName);
				$(this).parent().find(".selectImageInfo").attr("imgDesc", reName);
			}
		});
	});

	/**
	 * 렌더링 완료 후 지도 사이즈를 자동 조절합니다.
	 */
	map.once("postrender", function(event){
		var timeout = setTimeout(function(){
			map.updateSize();
			clearTimeout(timeout);
			timeout = null;
		}, 500);
	});

	/**
	 * 지도 영역을 토글합니다.
	 */
	$("#mapToggle").click(function(){
		$("#mapWrap").toggle();

		if($("#mapWrap").is(":visible")){
			$(this).text("CCTV 지도 접기");
		}else{
			$(this).text("CCTV 지도 펼치기");
		}
	});

	/**
	 * 검색버튼의 Enter Key 이벤트를 바인딩 합니다.
	 */
	$("#search").keypress(function(event){
		if(event.keyCode == "13"){
			$("#searchBtn").click();
		}
	});

	/**
	 * CCTV 명칭 검색 이벤트 입니다.
	 */
	var createCctvSearch = function(val){
		$("#searchListView").children().remove();

		_common.callAjax("/cctv/getCctvList.json", { "cctvNm" : val.toUpperCase(), "limit" : 10, "offset" : 0 }, function(json) {
			//$("#searchListView").children().not(":eq(0)").remove();
			if(json.result.length > 0){
				var cctvList = json.result;
				for(var i=0; i<cctvList.length; i++){
					var cctvNm = cctvList[i].cctvNm;
					var gbnCd = cctvList[i].gbnCd;
					var lng = cctvList[i].lng;
					var lat = cctvList[i].lat;

					var $li = $("<li></li>");
					var $btn = $("<button class='ui-btn ui-icon-location ui-btn-icon-left locBtn' lng='" + lng + "' lat='" + lat + "'></button>").text(cctvNm);

					$li.append($btn);

					$("#searchListView").append($li);
				}

				$("#searchListView").find(".locBtn").click(function(){
					var lng = Number($(this).attr("lng"));
					var lat = Number($(this).attr("lat"));
					var tm = Spatial.convertProjection([lng, lat], "EPSG:4326", "EPSG:5186");

					map.getView().setCenter(tm);
					map.getView().setZoom(19);

					$("#searchPopupMenu").popup("close");
				});

			}else{
				$("#searchListView").append("<li><h3 style='text-align: center; padding: 20px;'>검색 결과가 존재하지 않습니다.</h3></li>");
			}
		}, false);
	}

	/**
	 * 장소 검색 이벤트 입니다.
	 */
	var createKeywordSearch = function(val){
		$("#keywordSearchList").children().remove();

		var result = "error";
		$.ajax({
			type : "GET",
			url : "https://dapi.kakao.com/v2/local/search/keyword.json",
			dataType : "json",
			data : { query : _SITE_NAME_ + " " + val, size : 10, page : 1 },
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length > 0) result = json;
			}
		});

		if(result !== "error"){
			var doc = result.documents;
			for(var i=0; i<doc.length; i++){
				var jibun = _common.utils.validNull(doc[i].address_name);
				var doro = _common.utils.validNull(doc[i].road_address_name);

				if("address" in doc[i]){
					if(doc[i].address){
						if(!_common.utils.isNullAndEmpty(doc[i].address.address_name)){
							jibun = _common.utils.validNull(doc[i].address.address_name);
						}
					}
				}
				if("road_address" in doc[i]){
					if(doc[i].road_address){
						if(!_common.utils.isNullAndEmpty(doc[i].road_address.address_name)){
							doro = doc[i].road_address.address_name;
						}
					}
				}
				var name = _common.utils.validNull(doc[i].place_name);
				var cate = _common.utils.validNull(doc[i].category_name);
				var phon = _common.utils.validNull(doc[i].phone);
				if(_common.utils.validNull(phon)) phon = " (" + phon + ")";
				var fullName = name + "<br>" + _common.utils.validNull(jibun);
				var lng = doc[i].x;
				var lat = doc[i].y;

				var $li = $("<li></li>");
				var $btn = $("<button class='ui-btn ui-icon-location ui-btn-icon-left locBtn' lng='" + lng + "' lat='" + lat + "'></button>").text(name);

				$li.append($btn);

				$("#keywordSearchList").append($li);
			}

			$("#keywordSearchList").find(".locBtn").click(function(){
				var lng = Number($(this).attr("lng"));
				var lat = Number($(this).attr("lat"));
				var tm = Spatial.convertProjection([lng, lat], "EPSG:4326", "EPSG:5186");

				map.getView().setCenter(tm);
				map.getView().setZoom(19);

				$("#searchPopupMenu").popup("close");
			});

		}else{
			$("#keywordSearchList").append("<li><h3 style='text-align: center; padding: 20px;'>검색 결과가 존재하지 않습니다.</h3></li>");
		}
	}

	/**
	 * 주소 검색 이벤트 입니다.
	 */
	var createAddrSearch = function(val){
		$("#addrSearchList").children().remove();

		var result = "error";
		$.ajax({
			type : "GET",
			url : "https://dapi.kakao.com/v2/local/search/address.json",
			dataType : "json",
			data : { query : _SITE_NAME_ + " " + val, size : 10, page : 1 },
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length > 0) result = json;
			}
		});

		if(result !== "error"){
			var doc = result.documents;
			for(var i=0; i<doc.length; i++){
				var jibun = _common.utils.validNull(doc[i].address_name);
				var doro = _common.utils.validNull(doc[i].road_address_name);

				if("address" in doc[i]){
					if(doc[i].address){
						if(!_common.utils.isNullAndEmpty(doc[i].address.address_name)){
							jibun = _common.utils.validNull(doc[i].address.address_name);
						}
					}
				}
				if("road_address" in doc[i]){
					if(doc[i].road_address){
						if(!_common.utils.isNullAndEmpty(doc[i].road_address.address_name)){
							doro = doc[i].road_address.address_name;
						}
					}
				}

				var lng = doc[i].x;
				var lat = doc[i].y;

				var $li = $("<li></li>");
				var $btn = $("<button class='ui-btn ui-icon-location ui-btn-icon-left locBtn' lng='" + lng + "' lat='" + lat + "'></button>").text(jibun);

				$li.append($btn);

				$("#addrSearchList").append($li);
			}

			$("#addrSearchList").find(".locBtn").click(function(){
				var lng = Number($(this).attr("lng"));
				var lat = Number($(this).attr("lat"));
				var tm = Spatial.convertProjection([lng, lat], "EPSG:4326", "EPSG:5186");

				map.getView().setCenter(tm);
				map.getView().setZoom(19);

				$("#searchPopupMenu").popup("close");
			});

		}else{
			$("#addrSearchList").append("<li><h3 style='text-align: center; padding: 20px;'>검색 결과가 존재하지 않습니다.</h3></li>");
		}
	}

	/**
	 * 검색 이벤트 입니다.
	 */
	$("#searchBtn").click(function(){
		var val = $("#search").val();
		if(_common.utils.isNullAndEmpty(val)){
			alert("검색어(CCTV, 키워드, 주소)를 입력해 주세요.");
			return false;
		}

		createCctvSearch(val);
		createKeywordSearch(val);
		createAddrSearch(val);

		var timeout = setTimeout(function(){
			$("#searchPopupMenu-popup").width("100%");
			$("#cctvSearchResultTab, #keywordSearchResultTab, #locationSearchResultTab").css({
				"max-height" : $(window).height(),
				"overflow" : "auto"
			});

			$("#searchPopupMenu").popup("open");
			clearTimeout(timeout);
			timeout = null;
		}, 100);
	});

	/**
	 * 공문 업로드 이벤트 입니다.
	 */
	$("#uploadImg").on("change", function(){
		var val = $(this).val();
		if(val != ""){
			_common.formSubmit("/tvius/addDocFile.json", $("#regForm"), function(json){
				if(json.exception){
					alert(json.exception);
					$("#uploadImg").val("");
					$("#docFileNm").val("");
					$("#docFilePath").val("");
				}else if(json.realNm != null && json.uploadNm != null){
					if(json.uploadNm.length >7){
						$("#fileNm").text(json.uploadNm.substring(0,6)+'...');
					}else{
						$("#fileNm").text(json.uploadNm);
					}
					$("#docFileNm").val(json.uploadNm);
					$("#docFilePath").val(json.realNm);
				}
			});
		}
	});

	var validPassword = function(userId, userPwd){
		var isValid = false;

		_common.callAjax("/user/checkPassword.json", { "userId" : userId, "userPwd" : userPwd }, function(json){
			if(json.result !== null){
				if(_common.utils.isNullAndEmpty(json.result.userId)){
					isValid = true;
				}
			}
		}, false);

		return isValid;
	}

	/**
	 * 이용형태 변경 이벤트 입니다.
	 */
	if($("#reqGbnCd").val() === "16"){
		isImageRqst = true;

		var reqGbnNm = $("#reqGbnCd").find("option:selected").text();
		if(!location.pathname.contains("getUsrTviusImageRqstEdit.do")){
			$("#rqstSendBtn").text(reqGbnNm + " 신청");
			$("#reqstId").val("");
		}

		$(".imgRqstTr").show();
	}

	var defaultUserId = $("#reqstId").val();
	$("#reqGbnCd").change(function(){
		var reqGbnNm = $("#reqGbnCd").find("option:selected").text();

		if($(this).val() === "16"){
			$("#reqstId").val("");
			//$(".imgRqstTr").show();
			isImageRqst = true;
		}else{
			$("#reqstId").val(defaultUserId);
			//$(".imgRqstTr").hide();
			isImageRqst = false;
		}

		$("#rqstSendBtn").text(reqGbnNm + " 신청");
	});

	/**
	 * 계정 클릭 이벤트 입니다.
	 */
	$("#reqstId").click(function(){
		if(isImageRqst) $("#reqstId").val(prompt("신청자의 ID를 입력하세요."));
	});

	/**
	 * 이미지 추가 이벤트 입니다.
	 */
	$("#addImg").change(function(){
		try{
			var inputFile = $(this)[0];
			for(var i=0; i<inputFile.files.length; i++){
				var reader = new FileReader();
				reader.onload = (function(file){
					return function(e) {
						addImgList.push(file);

						var imgNm = file.name;
						//var imgDesc = prompt("이미지의 설명을 입력하세요.\n\n미입력시 파일명으로 대체합니다.");
						var imgDesc = imgNm;
						if(_common.utils.isNullAndEmpty(imgDesc)) imgDesc = imgNm;

						var $idxB  = $("<b class='idxB'>").text($(".selectImageInfo").length + 1);
						//var $marqu = $("<marquee>").text(imgDesc);
						var $textB = $("<b class='textB sText'>").text(imgDesc.split(".")[0]);
						var $title = $("<button type='button' class='selectImageInfo ui-btn ui-icon-delete ui-btn-icon-right' data-role='button'></button>").attr({ "imgNm" : imgNm, "imgDesc" : imgDesc }).append($idxB).append($textB);

						var $thumb = $("<img>").attr("src", e.target.result).css("max-width", $(document).width() - 45);

						var $wrap = $("<fieldset class='ui-grid-a tCenter'></fieldset>");
						$wrap.append($title).append($thumb);

						$title.click(function(){
							if(confirm($(this).find('b.textB').text() + "\n\n이미지를 목록에서 제거하시겠습니까?")){
								var idx = $(".selectImageInfo").index($(this));
								addImgList.splice(idx, 1);

								$(this).parent().parent().remove();
								renameToImageIndexText();
							}
						});

						$thumb.click(function(){
							var nowName = $(this).parent().find(".selectImageInfo").attr("imgDesc");
							var reName = prompt("이미지 이름을 입력하세요.\n\n현재 이름 : " + $(this).parent().find(".selectImageInfo").attr("imgDesc").split(".")[0]);
							if(!_common.utils.isNullAndEmpty(reName) && (reName !== nowName)){
								$(this).parent().find(".selectImageInfo").find("b.textB.sText").text(reName);
								$(this).parent().find(".selectImageInfo").attr("imgDesc", reName);
							}
						});

						var $li = $("<li>").addClass("ui-li-static ui-body-inherit ui-last-child").append($wrap);

						$("#imageSelectWrap").append($li);

						$("#imageSelectWrap").trigger("create");

						renameToImageIndexText();
			        };
				})(inputFile.files[i]);
				reader.readAsDataURL(inputFile.files[i]);
			}
		}catch(e){
			console.log(e);
		}finally{
			$(this).val("");
		}
	});

	/**
	 * 사용자가 신청한 내용을 최종적으로 확인하는 팝업을 오픈합니다.
	 */
	var validationPopup = function(param){
		var $pop = $("#validationPopup");

		$pop.find(".validTgt[tgt=reqstId]").val(param["reqstId"]);
		$pop.find(".validTgt[tgt=reqstDetail]").val(param["reqstDetail"]);
		$pop.find(".validTgt[tgt=crimeTyp]").val($("#crimeTyp").find("option:selected").text());

		$pop.find(".validTgt[tgt=selectCctvList]").html("");
		$("#cctvSelectWrap").find(".selectCctvInfo").each(function(){

			var sDate = $(this).parent().find(".sDate").find(".cctvDateYY").val() + "." + $(this).parent().find(".sDate").find(".cctvDateMM").val() + "." + $(this).parent().find(".sDate").find(".cctvDateDD").val() + " " + $(this).parent().find(".sDate").find(".cctvDateHH").val() + ":" + $(this).parent().find(".sDate").find(".cctvDateMI").val();
			var eDate = $(this).parent().find(".eDate").find(".cctvDateYY").val() + "." + $(this).parent().find(".eDate").find(".cctvDateMM").val() + "." + $(this).parent().find(".eDate").find(".cctvDateDD").val() + " " + $(this).parent().find(".eDate").find(".cctvDateHH").val() +":"+$(this).parent().find(".eDate").find(".cctvDateMI").val();

			var $hrTr = $("<tr>").append("<td class='tCenter'><hr></td>");
			var $tr1 = $("<tr>").append("<th>" + formatCctvNm($(this).attr("cctvNm")) + "</th>");
			var $tr2 = $("<tr>").append("<td class='tCenter'>시작 시간 : " + sDate + "<br>" + "종료 시간 : " + eDate + "</td>");

			$pop.find(".validTgt[tgt=selectCctvList]").append($hrTr.clone()).append($tr1).append($hrTr.clone()).append($tr2);
		});
		$pop.find("#selectCctvListCntTitle").text("신청 카메라 목록 (총 " + $("#cctvSelectWrap").find(".selectCctvInfo").length + "건)");

		$pop.popup("open");
	}

	/**
	 * 반출, 열람을 신청합니다.
	 */
	var sendTransRqst = function(param){
		var aviSuccess = false;

		$(".selectCctvInfo").each(function(i, e){
			var cctvNm = $(this).attr("cctvNm");
			var mgrNo = $(this).attr("mgrNo");

			var date = new Date();
			var sysCnt = Number(SYSTEM_AVI_PLAY_CNT);
			var sysDat = Number(SYSTEM_AVI_PLAY_DAT);
			if( sysDat != 0 ) date.setDate(date.getDate() + sysDat);
			var playLimitDat = new Date().formatDateToStr(date);

			var aviParam = {};
			aviParam["mgrSeq"] = i + 1;
			aviParam["rqstMgrSeq"] = Number(param["mgrSeq"]);
			aviParam["cctvMgrNo"] = mgrNo;
			aviParam["playLimitCnt"] = Number(sysCnt);
			aviParam["playLimitDat"] = playLimitDat;
			aviParam["secStDat"] =  $(this).parent().find(".sDate").find(".cctvDateYY").val() + $(this).parent().find(".sDate").find(".cctvDateMM").val() + $(this).parent().find(".sDate").find(".cctvDateDD").val() + $(this).parent().find(".sDate").find(".cctvDateHH").val() +$(this).parent().find(".sDate").find(".cctvDateMI").val() + "00";
//			if(aviParam["secStDat"].length == 12){
//				aviParam["secStDat"] = aviParam["secStDat"]+'00';
//			}
			aviParam["secEdDat"] = $(this).parent().find(".eDate").find(".cctvDateYY").val() + $(this).parent().find(".eDate").find(".cctvDateMM").val() + $(this).parent().find(".eDate").find(".cctvDateDD").val() + $(this).parent().find(".eDate").find(".cctvDateHH").val() +$(this).parent().find(".eDate").find(".cctvDateMI").val() + "00";
//			if(aviParam["secEdDat"].length == 12){
//				aviParam["secEdDat"] = aviParam["secEdDat"]+'00';
//			}
			aviParam["maskChk"] = "0";
			aviParam["hddSerial"] = "hddSerial";
			aviParam["macSerial"] = "macSerial";
			aviParam["expAviPw"] = "";
			aviParam["bakStatCd"] = "B0";

			_common.callAjax("/tvius/addTransAvi.json", aviParam, function(json) {
				if(json.result){
					aviSuccess = true;
				}else{
					aviSuccess = false;
					return false;
				}
			}, false);
		});

		if(aviSuccess){
			var cctvListNm = $(".selectCctvInfo").eq(0).attr("cctvNm");
			if($(".selectCctvInfo").length > 1) cctvListNm += " 등 " + ($(".selectCctvInfo").length - 1) + "개";

			param["crimeLoc"] = "";
			param["cctvList"] = cctvListNm;
			_common.callAjax("/tvius/addTransRqst.json", param, function(json) {
				if(json.result){
					_common.callAjax("/ws/noticeCrmsTransRqstToTviusMng.json", { "json" : JSON.stringify(json.crmsTransRqstVo) }, function(data) {
						if(data.result){
							alert("신청이 완료되었습니다.");
							$("#home").click();
						}
					},false);

				}
			},false);
		}
	}

	/**
	 * 이미지 반출을 신청합니다.
	 */
	var sendImageRqst = function(param){
		var imgMgrSeqList = new Array();
		var imgUploadSuccess = false;

		$(".selectImageInfo").each(function(i, e){
			var imgDesc = $(this).attr("imgDesc");
			var imgNm = $(this).attr("imgNm");

			var param = new FormData();
			param.append("p", "image\\");
			param.append("uploadImg", addImgList[i]);
			param.append("imgDesc",imgDesc);

			$.ajax({
				type: "POST",
				url: "../addFileOfImgRqst.json",
				data: param,
				async: false,
				processData: false,
				contentType: false,
				success: function(json){
					if(json.result){
						imgUploadSuccess = true;

						var imgUploadParam = {};
						imgUploadParam["regId"] = param["reqstId"];
						imgUploadParam["imgNm"] = json.imgNm;
						imgUploadParam["imgDesc"] = json.imgNm;
						imgUploadParam["imgPath"] = json.realNm;

						_common.callAjax("/tvius/addCrmsImg.json", imgUploadParam, function(_json){
							if(_json.result){
								imgUploadSuccess = true;
								imgMgrSeqList.push(_json.crmsImageVo.mgrSeq);
							}else{
								imgUploadSuccess = false;
								return false;
							}
						}, false);

					}else{
						imgUploadSuccess = false;
						return false;
					}
				}
			});
		});

		if(!imgUploadSuccess){

			alert("이미지 업로드를 실패하였습니다.");
			return false;

		}else{

			if(imgUploadSuccess){

				var isEnd = false;
				for(var i=0; i<imgMgrSeqList.length; i++){
					_common.callAjax("/tvius/addCrmsImgJoin.json", { "rqstMgrSeq" : param.mgrSeq, "imgMgrSeq" : imgMgrSeqList[i] }, function(json) {
						if(json.result) isEnd = true;
					}, false);
				}

				if(isEnd) sendTransRqst(param);

				/*var isEnd = false;
				_common.callAjax("/tvius/addCrmsImgRqst.json", param, function(json) {
					if(json.result){
						for(var i=0; i<imgMgrSeqList.length; i++){
							_common.callAjax("/tvius/addCrmsImgJoin.json", { "rqstMgrSeq" : param.mgrSeq, "imgMgrSeq" : imgMgrSeqList[i] }, function(json) {
								if(json.result){
									isEnd = true;
								}else{
									isEnd = false;
								}
							}, false);
						}
					}
				}, false);

				if(isEnd){
					alert("신청이 완료되었습니다.");
					$("#home").click();
				}*/
			}
		}
	}

	/**
	 * 반출 신청 이벤트 입니다.
	 */
	$("#addBtn").click(function(){
		var param = _common.utils.collectSendData("#regTable"); delete param["undefined"];

		var isPassing = validationImageRqstInfo();
		if(!isPassing)return;



		if(!validation(param)){

			validationPopup(param);
			var isRun = false;
			$("#rqstSendBtn").off("click").click(function(){
				if(isRun == true){
					return;
				}
				isRun = true;
				try{
					if(validationUserInfo()){
						var reqGbnCd = $("#reqGbnCd").val();
						var reqGbnNm = $("#reqGbnCd").find("option:selected").text();
						if(confirm(reqGbnNm + " 신청하시겠습니까?")){

							if($("#departNm").val() !== $("#departNm").attr("depart")){
								_common.callAjax("/tvius/mobile/editUserDepart.json", { "departNm" : $("#departNm").val() }, function(){}, false);

							}

							if(isImageRqst){
								sendImageRqst(param);
							}else{
								sendTransRqst(param);
							}
						}
						setTimeout(function(){
							isRun = false;
						},300);
					}
				}catch(e){
					setTimeout(function(){
						isRun = false;
					},300);
				}finally{
					setTimeout(function(){
						isRun = false;
					},300);
				}



			});

		}

	});

	/**
	 * 반출, 열람을 재신청합니다.
	 */
	var sendTransRqstEdit = function(param){
		var aviSuccess = false;

		_common.callAjax("/tvius/delTransAvi.json", { "rqstMgrSeq" : Number(param["mgrSeq"]) }, function(json) {
			if(json.result){
				$(".selectCctvInfo").each(function(i, e){
					var cctvNm = $(this).attr("cctvNm");
					var mgrNo = $(this).attr("mgrNo");

					var date = new Date();
					var sysCnt = Number(SYSTEM_AVI_PLAY_CNT);
					var sysDat = Number(SYSTEM_AVI_PLAY_DAT);
					if( sysDat != 0 ) date.setDate(date.getDate() + sysDat);
					var playLimitDat = new Date().formatDateToStr(date);

					var aviParam = {};
					aviParam["mgrSeq"] = i + 1;
					aviParam["rqstMgrSeq"] = Number(param["mgrSeq"]);
					aviParam["cctvMgrNo"] = mgrNo;
					aviParam["playLimitCnt"] = Number(sysCnt);
					aviParam["playLimitDat"] = playLimitDat;
					aviParam["secStDat"] =  $(this).parent().find(".sDate").find(".cctvDateYY").val() + $(this).parent().find(".sDate").find(".cctvDateMM").val() + $(this).parent().find(".sDate").find(".cctvDateDD").val() + $(this).parent().find(".sDate").find(".cctvDateHH").val() +$(this).parent().find(".sDate").find(".cctvDateMI").val() + "00";
//					if(aviParam["secStDat"].length == 12){
//						aviParam["secStDat"] = aviParam["secStDat"]+'00';
//					}
					aviParam["secEdDat"] = $(this).parent().find(".eDate").find(".cctvDateYY").val() + $(this).parent().find(".eDate").find(".cctvDateMM").val() + $(this).parent().find(".eDate").find(".cctvDateDD").val() + $(this).parent().find(".eDate").find(".cctvDateHH").val() +$(this).parent().find(".eDate").find(".cctvDateMI").val() + "00";
//					if(aviParam["secEdDat"].length == 12){
//						aviParam["secEdDat"] = aviParam["secEdDat"]+'00';
//					}
					aviParam["maskChk"] = "0";
					aviParam["hddSerial"] = "hddSerial";
					aviParam["macSerial"] = "macSerial";
					aviParam["expAviPw"] = "";
					aviParam["bakStatCd"] = "B0";

					_common.callAjax("/tvius/addTransAvi.json", aviParam, function(json) {
						if(json.result){
							aviSuccess = true;
						}else{
							aviSuccess = false;
							return false;
						}
					}, false);
				});
			}else{
				alert("과거 목록 제거에 실패하였습니다.")
			}
		}, false);

		if(aviSuccess){
			var cctvListNm = $(".selectCctvInfo").eq(0).attr("cctvNm");
			if($(".selectCctvInfo").length > 1) cctvListNm += " 등 " + ($(".selectCctvInfo").length - 1) + "개";

			param["mgrSeq"] = Number(param["mgrSeq"]);
			param["reqstDat"] = $("#reqstDat").val();
			param["procStatCd"] = 'SW';
			param["recvMthd"] = 'FD';
			param["crimeLoc"] = "";
			param["cctvList"] = cctvListNm;
			_common.callAjax("/tvius/editTransRqst.json", param, function(json) {
				if(json.result){
					alert("재신청이 완료되었습니다.");
					$("#home").click();
				}
			});
		}
	}

	/**
	 * 이미지 반출을 재신청합니다.
	 */
	var sendImageRqstEdit = function(param){
		var imgMgrSeqList = new Array();
		var imgUploadSuccess = false;
		_common.callAjax("/tvius/mobile/delAllCrmsImgJoin.json", { "mgrSeq" : Number(param["mgrSeq"]) }, function(remove){
			// TODO 이주영 / 이미지가 첨부되지 않은 신청건이라면 응답이 false 로 오기때문에 무반응으로 보일 수 있습니다.
			if(remove.result){
				$(".selectImageInfo").each(function(i, e){
					var imgDesc = $(this).attr("imgDesc");
					var imgNm = $(this).attr("imgNm");

					var param = new FormData();
					param.append("p", "image\\");
					param.append("uploadImg", addImgList[i]);
					param.append("imgDesc",imgDesc);

					$.ajax({
						type: "POST",
						url: "../addFileOfImgRqst.json",
						data: param,
						async: false,
						processData: false,
						contentType: false,
						success: function(json){
							if(json.result){
								imgUploadSuccess = true;

								var imgUploadParam = {};
								imgUploadParam["imgNm"] = json.imgNm;
								imgUploadParam["regId"] = param["reqstId"];
								imgUploadParam["imgDesc"] = json.imgNm;
								imgUploadParam["imgPath"] = json.realNm;

								_common.callAjax("/tvius/addCrmsImg.json", imgUploadParam, function(_json){
									if(_json.result){
										imgUploadSuccess = true;
										imgMgrSeqList.push(_json.crmsImageVo.mgrSeq);
									}else{
										imgUploadSuccess = false;
										return false;
									}
								}, false);

							}else{
								imgUploadSuccess = false;
								return false;
							}
						}
					});
				});

				if(!imgUploadSuccess){

					alert("이미지 업로드를 실패하였습니다.");
					return false;

				}else{

					if(imgUploadSuccess){

						var isEnd = false;
						for(var i=0; i<imgMgrSeqList.length; i++){
							_common.callAjax("/tvius/addCrmsImgJoin.json", { "rqstMgrSeq" : param.mgrSeq, "imgMgrSeq" : imgMgrSeqList[i] }, function(json) {
								if(json.result) isEnd = true;
							}, false);
						}

						if(isEnd) sendTransRqstEdit(param);
					}
				}
			}
		}, false);

	}

	/**
	 * 재반출 신청 이벤트 입니다.
	 */
	$("#editBtn").click(function(){
		var param = _common.utils.collectSendData("#regTable"); delete param["undefined"];

		var isPassing = validationImageRqstInfo();
		if(!isPassing)return;

		if(!validation(param)){

			validationPopup(param);

			$("#rqstSendBtn").off("click").click(function(){

				if(validationUserInfo()){
					var reqGbnCd = $("#reqGbnCd").val();
					var reqGbnNm = $("#reqGbnCd").find("option:selected").text();
					if(confirm("재신청 하시겠습니까?")){

						if($("#departNm").val() !== $("#departNm").attr("depart")){
							_common.callAjax("/tvius/mobile/editUserDepart.json", { "departNm" : $("#departNm").val() }, function(){});
						}

						if(isImageRqst){
							sendImageRqstEdit(param);
						}else{
							sendTransRqstEdit(param);
						}
					}
				}

			});
		}

	});







	/**
	 * 신청 내용 최종 확인 버튼입니다.
	 */
	$("#isUserValidBtn").click(function(){
		//반출
		if($('#reqGbnCd').val() == 11){
			$('#isUserValidBtn').prop("disabled",true);
			$('#isUserValidBtn').text("신청중");

			intervalStatChk = setInterval(function(){
				getStatChk();
			}, 1000);
		}
		//열람,캡처
		else{
			if(confirm("모든 신청 내용을 확인하셨습니까?")){
				$("#validationPopup").popup("close");

				var timeout = setTimeout(function(){
					window.scrollTo(0, 0);
					$("#securityPopup").popup("open");
					clearTimeout(timeout);
					timeout = null;
				}, 100);
			}
		}


	});





	$("#popupAllTimeApply").find("#allSecStDat").change(function(){
		var eVal =$("#popupAllTimeApply").find("#allSecEdDat").val();

		var sDate = new Date($(this).val());
		var eDate = new Date(eVal);

		var defaultVal = new Date().subtractMinutes(eVal, baseTerm, true).replace(" ", "T");
		if(sDate >= eDate){
			$(this).val(defaultVal);
			alert("시작 시간은 종료 시간보다 과거여야 합니다.");
		}

		var minus6 = new Date().subtractHours(eDate, 12, true).replace(" ", "T");
		if(sDate < eDate){
			$(this).val("");
			alert("영상반출 시간은 12시간 이하로 설정해야됩니다.");
		}
	});

	$("#popupAllTimeApply").find("#allSecEdDat").change(function(){

		var sVal = $("#popupAllTimeApply").find("#allSecStDat").val();

		var sDate = new Date(sVal);
		var eDate = new Date($(this).val());

		if(sDate >= eDate) {
			$(this).val("");
			alert("종료 시간이 시작 시간과 같거나 과거입니다.\n시간을 다시 선택해 주세요.");
		}

		var minus6 = new Date().subtractHours(eDate, 12, true).replace(" ", "T");
		if(sDate < eDate){
			$(this).val("");
			alert("영상반출 시간은 12시간 이하로 설정해야됩니다.");
		}
	});


	/**
	 * 시간 일괄 적용 클릭 시
	 */
	$("#popupAllTimeApply").find("#allTimeApplyBtn").click(function(){
		//이용형태가 반출인지 열람인지 먼저 선택되어야함
		if(!isCapture){
			if($('#reqGbnCd').val() == ''){
				alert("이용형태를 먼저 선택해주세요.")
				$("#popupAllTimeApply").popup("close");
				return;
			}
		}

		var sDate = $(this).parent().find(".sDate").find(".cctvDateYY").val() + $(this).parent().find(".sDate").find(".cctvDateMM").val() + $(this).parent().find(".sDate").find(".cctvDateDD").val() + $(this).parent().find(".sDate").find(".cctvDateHH").val() +$(this).parent().find(".sDate").find(".cctvDateMI").val() + "00";
		var eDate = $(this).parent().find(".eDate").find(".cctvDateYY").val() + $(this).parent().find(".eDate").find(".cctvDateMM").val() + $(this).parent().find(".eDate").find(".cctvDateDD").val() + $(this).parent().find(".eDate").find(".cctvDateHH").val() +$(this).parent().find(".eDate").find(".cctvDateMI").val() + "00";

		if(sDate >= eDate){
			alert("시작 시간은 종료 시간보다 과거여야 합니다.");
			return;
		};

		var diff = Date.prototype.formatDiffTime(sDate, eDate);
		for(var k in diff){
			if(!_common.utils.validNaN(diff[k])){
				alert("올바르지 않은 시간이 존재합니다.");
				return;
			}
		}
		//캡쳐
		if(isCapture){
			if(diff.diffDay >= 32){
				alert("영상반출 시간은 30일 이내로 설정해야됩니다.");
				return;
			}
		}
		else{
			//열람
			if($('#reqGbnCd').val() == 12){
				if(diff.diffDay >= 32){
					alert("영상반출 시간은 30일 이내로 설정해야됩니다.");
					return;
				}
			}
			//반출
			else{
				if(diff.diffDay >= 1 || diff.diffHour >= 12){
					alert("영상반출 시간은 12시간 이하로 설정해야됩니다.");
					return;
				}
			}

		}


//		if($("#popupAllTimeApply").find("#allSecStDat").val() == ""){
//			alert("시작시간을 입력해주세요.");
//			return;
//		}
//
//		if($("#popupAllTimeApply").find("#allSecEdDat").val() == ""){
//			alert("종료시간을 입력해주세요.");
//			return;
//		}
//
		$(".sDate").find(".cctvDateYY").val($(this).parent().find(".sDate").find(".cctvDateYY").val());
		$(".sDate").find(".cctvDateMM").val($(this).parent().find(".sDate").find(".cctvDateMM").val());
		$(".sDate").find(".cctvDateDD").val($(this).parent().find(".sDate").find(".cctvDateDD").val());
		$(".sDate").find(".cctvDateHH").val($(this).parent().find(".sDate").find(".cctvDateHH").val());
		$(".sDate").find(".cctvDateMI").val($(this).parent().find(".sDate").find(".cctvDateMI").val());


		$(".eDate").find(".cctvDateYY").val($(this).parent().find(".eDate").find(".cctvDateYY").val());
		$(".eDate").find(".cctvDateMM").val($(this).parent().find(".eDate").find(".cctvDateMM").val());
		$(".eDate").find(".cctvDateDD").val($(this).parent().find(".eDate").find(".cctvDateDD").val());
		$(".eDate").find(".cctvDateHH").val($(this).parent().find(".eDate").find(".cctvDateHH").val());
		$(".eDate").find(".cctvDateMI").val($(this).parent().find(".eDate").find(".cctvDateMI").val());

		$("#popupAllTimeApply").popup("close");

	});




	/**
	 * 메인으로 이동 이벤트 입니다.
	 */
	$("#home").click(function(){
		//$.mobile.changePage($(this).attr("url"));
		location.href = $(this).attr("url");
	});


	/**
	 * 시작시간 종료시간 날짜 범위 체크 이벤트 bind
	 */
	var bindCheckDateRange = function(param){
		$(".cctvDateMM").change(function() {
		    var v = parseInt(this.value);
		    if (v <= 0){
		    	this.value = "01";
		    	return;
		    }
		    if (v >= 12){
		    	this.value = "12";
		    	return;
		    }

		    if(this.value.length == 1){
		    	if(v >= 0 && v <= 9){
		    		$(this).val("0"+this.value);
		    	}
			}
		});

		$(".cctvDateDD").change(function() {
		    var v = parseInt(this.value);
		    if (v <= 0) {
		    	this.value = "01";
		    	return;
		    }
		    if (v >= 31){
		    	this.value = "31";
		    	return;
		    }
		    if(this.value.length == 1){
		    	if(v >= 0 && v <= 9){
		    		$(this).val("0"+this.value);
		    	}
			}
		});

		$(".cctvDateHH").change(function() {
		    var v = parseInt(this.value);
		    if (v <= 0){
		    	this.value = "00";
		    	return;
		    }
		    if (v > 24){
		    	this.value = "00";
		    	return;
		    }
		    if (v == 24){
		    	this.value = "23";
		    	$(this).parent().parent().parent().find(".cctvDateMI").val("59");
		    	return;
		    }

		    if(this.value.length == 1){
		    	if(v >= 0 && v <= 9){
		    		$(this).val("0"+this.value);
		    	}
			}
		});

		$(".cctvDateMI").change(function() {
		    var v = parseInt(this.value);
		    if (v <= 0){
		    	this.value ="00";
		    	return;
		    }
		    if (v >= 60){
		    	this.value = "59";
		    	return;
		    }
		    if(this.value.length == 1){
		    	if(v >= 0 && v <= 9){
		    		$(this).val("0"+this.value);
		    	}
			}
		});
	};

	/**
	 * 브라우저 리사이즈 이벤트 입니다.
	 */
	$(window).resize(function(){
		var timeout = setTimeout(function(){
			map.updateSize();
			clearTimeout(timeout);
			timeout = null;
		}, 500);
	});

});

/**
 * 영상반출 신청시 현재 나열된 cctv의 상태에 영상 파일이 존재하는지 체크한다.
 *
 */
function getStatChk(){
	var statArr = [];
	var cctvNm = "";
	var isPass = false;
	new Promise(function(resolve){

		setStatArr(statArr);


		if(isStatCheckComplete(statArr)){
			if(isStatData(statArr)){
				isPass = true;
			}
			resolve();
		}

	}).then(function(){
		clearInterval(intervalStatChk);

		$('#isUserValidBtn').prop("disabled",false);
		$('#isUserValidBtn').text("신청 내용 확인 완료");

		if(!isPass){
			var isNotStatDataCctvList = "";
			$('.selectCctvInfo[isStatData="N"').each(function(){
				var startData = $(this).attr("startDat").substring(0,4)+"." + $(this).attr("startDat").substring(4,6) + "." + $(this).attr("startDat").substring(6,8) + " " + $(this).attr("startDat").substring(8,10) + ":"+ $(this).attr("startDat").substring(10,12);
				var endData = $(this).attr("endDat").substring(0,4)+"." + $(this).attr("endDat").substring(4,6) + "." + $(this).attr("endDat").substring(6,8) + " " + $(this).attr("endDat").substring(8,10) + ":"+ $(this).attr("endDat").substring(10,12);
				isNotStatDataCctvList += "CCTV : " + $(this).attr("cctvNm") + "\n 시간 : " + startData + " ~ " + endData + "\n\n";
			});
			isNotStatDataCctvList = isNotStatDataCctvList.substring(0, isNotStatDataCctvList.length-1);
			alert( isNotStatDataCctvList + '\n해당 CCTV에 영상이 존재하지 않습니다.\n확인 후 다시 신청하여 주십시오. ');
			$("#validationPopup").popup("close");
			return;
		}
		if(confirm("모든 신청 내용을 확인하셨습니까?")){
			$("#validationPopup").popup("close");

			var timeout = setTimeout(function(){
				window.scrollTo(0, 0);
				$("#securityPopup").popup("open");
				clearTimeout(timeout);
				timeout = null;
			}, 100);
		}
	});
}

//}



/**
 * 영상반출 신청시 현재 나열된 cctv의 상태에 영상 파일이 존재하는지 체크해서 상태값을 배열에 넣어준다.
 *
 * @param statArr
 */
function setStatArr(statArr){
	 $('.selectCctvInfo').each(function(i){

			var cctvMgrNo = $(this).attr("mgrNo");

			var key = $(this).attr('key');
			var mgr = $(this).attr('mgrSeq');

			var startDat =  $(this).parent().find(".sDate").find(".cctvDateYY").val() + $(this).parent().find(".sDate").find(".cctvDateMM").val() + $(this).parent().find(".sDate").find(".cctvDateDD").val() + $(this).parent().find(".sDate").find(".cctvDateHH").val() +$(this).parent().find(".sDate").find(".cctvDateMI").val() + "00";
			var endDat = $(this).parent().find(".eDate").find(".cctvDateYY").val() + $(this).parent().find(".eDate").find(".cctvDateMM").val() + $(this).parent().find(".eDate").find(".cctvDateDD").val() + $(this).parent().find(".eDate").find(".cctvDateHH").val() +$(this).parent().find(".eDate").find(".cctvDateMI").val() + "00";

			var sm = startDat.substr(10,2);

			var startChk = $(this).attr('startDat');
			var endChk = $(this).attr('endDat');

			if ( startChk != startDat || endDat != endChk ) {
				mgr = setSeqNum();
				$(this).attr('mgrSeq', mgr);
			}

			$(this).attr('startDat', startDat);
			$(this).attr('endDat', endDat);

			var dataChk = getDateChk(startDat, endDat);

			_common.callAjax("/tvius/getStat.json", {"mgrSeq" : Number(mgr)}, function(json) {

				if( json.result !== undefined ){
					if (json.result.length === 0){

						statArr.push('S');
						addCctvStat(mgr, cctvMgrNo, startDat, endDat);

					} else if ( json.result.length == 1){

						var list = json.result;
						var statData = list[0].statData;
						var validYn = list[0].validYn;

						if ( validYn == 'N' ) {
							statArr.push('S');
						} else {
							statData = statData.replace(/\//gi, '').substr(Number(sm), Number(dataChk));
							if ( statData.indexOf('1') == -1 ){//전부다 0이면

								statArr.push('F');
								$('.selectCctvInfo[mgrNo="'+json.result[0].cctvMgrNo+'"]').attr("isStatData","N");

							} else {
								statArr.push('T');
								$('.selectCctvInfo[mgrNo="'+json.result[0].cctvMgrNo+'"]').attr("isStatData","Y");
							}
						}

					} else {
						alert('* An error has occurred.\r\njson.result.length\r\n' + json.result.length);
					}
				} else {
					alert('* An error has occurred.\r\njson.result undefined.\r\n' + json.result);
				}

			}, false);


 	});
}

/**
 * 	상태값이 모두 들어왔는 지 여부
 * @param statArr
 * @returns {Boolean}
 */
function isStatCheckComplete(statArr){
	var bol = true;
	if ( statArr.indexOf('S') != -1 ) { //S가 있으면
		bol = false;
	}

	return bol;
}
/**
 * 들어온 상태값에 모두 0인 상태값은 없느 지 여부
 * @param statArr
 * @returns {Boolean}
 */
function isStatData(statArr){
	var bol = false;
	if ( statArr.indexOf('F') != -1 && statArr.indexOf('S') == -1 ) {  // F가 있고 S가 없을 때
		 bol = false;

	} else if ( statArr.indexOf('T') != -1 && statArr.indexOf('F') == -1 && statArr.indexOf('S') == -1) {  // T는 있고  F, S둘 다 없을 때    T ->  000010000000 F -> 0000000000000000
		bol = true;
	}
	return bol
}

/**
 * 타임 스탬프 값으로 시리얼 키를 생성한다.
 *
 * @returns {Number}
 */
var setSeqNum = function(){
	var baseTimestamp = 1000 * 60 * 60 * 24 * 365 * 40;
	var currentTimeMillis = new Date().getTime();
	var SerialNumGenPrev = currentTimeMillis - baseTimestamp;

	return SerialNumGenPrev;
}

 /**
 * 시작시간과 종료시간의 차이를 구한다 ( 시간 )
 *
 * @param s_date 시작시간
 * @param d_date 종료시간
 * @returns {Number} 시간
 */
var getDateChk = function(s_date,d_date){
    var getDate1 = new Date( parseInt(s_date.substring(0, 4)),parseInt(s_date.substring(4, 6))-1,parseInt(s_date.substring(6, 8)),parseInt(s_date.substring(8, 10)),parseInt(s_date.substring(10, 12)) );
    var getDate2 = new Date( parseInt(d_date.substring(0, 4)),parseInt(d_date.substring(4, 6))-1,parseInt(d_date.substring(6, 8)),parseInt(d_date.substring(8, 10)),parseInt(d_date.substring(10, 12)) );
    var total = (getDate2.getTime() - getDate1.getTime()) / 1000 / 60;

    return total;
}

/**
 * 상태체크 요청 데이터를 테이블에 등록한다.
 *
 * @param mgrseq //타임스탬프 값
 * @param cctvNo //CCTV 번호
 * @param statDat //시작시간
 * @param endDat //종료시간
 */
var addCctvStat = function(mgrseq, cctvMgrNo, statDat, endDat){
	var _statParam = {};
	_statParam['mgrSeq'] = Number(mgrseq);
	_statParam['cctvMgrNo'] = cctvMgrNo;
	_statParam['startDat'] = Date.prototype.strYmdTimeAdd(statDat);
	_statParam['endDat'] = Date.prototype.strYmdTimeAdd(endDat);
	_statParam['validYn'] = 'N';

	_common.callAjax("/tvius/addStat.json", _statParam, function(json) {},false);
}



