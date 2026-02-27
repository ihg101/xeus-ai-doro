/**
 * 지도 Export 객체 입니다.
 *
 * jsPDF-2.3.1.js 를 의존합니다.
 *
 * @author 이주영
 */
"use strict";
(function(GMXMAP, GMXLAYER, _GMXMAP_DEF_PROXY_, _IS_PROXY_){

if(GMXMAP != null && GMXLAYER != null){
	if(GMXMAP instanceof ol.Map){

		/**
		 * 용지 사이즈 입니다.
		 */
		var paperSize = {
			"a0" : [1189, 841],
			"a1" : [841, 594],
			"a2" : [594, 420],
			"a3" : [420, 297],
			"a4" : [297, 210],
			"a5" : [210, 148],
		};

		/**
		 * 현재 OL 객체의 모든 Layer 를 임시 Canvas 에 추가하여 리턴합니다.
		 */
		var _CollectMapResource = function(tempCanvas){
			var mapContext = tempCanvas.getContext("2d");

			Array.prototype.forEach.call(
				document.querySelectorAll(".ol-layer canvas"),
				function (canvas) {
					if (canvas.width > 0) {
						var opacity = canvas.parentNode.style.opacity;
						mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
						var transform = canvas.style.transform;
						var matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(",").map(Number);
						CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
						mapContext.drawImage(canvas, 0, 0);
					}
				}
			);

			return mapContext;
		}

		/**
		 * CROS 우회를 위하여 현재 활성화된 타일을 프록시 처리합니다.
		 */
		var _SetProxyTiles = function(){
			var defaultProxy = (_GMXMAP_DEF_PROXY_ === true);
			if(!defaultProxy){
				GMXMAP.addMapNotification("교차 출처 리소스 공유 정책(CORS)으로 인하여 배경지도를 다시 로드합니다.", 5000);
				_SET_ACTIVE_PROXY(true);
				GMXLAYER.setProxyTile(GMXMAP);
			}

			GMXMAP.renderSync();

			if(!defaultProxy) _SET_ACTIVE_PROXY(false);
		}

		/**
		 * Base64 이미지 문자열을 Blob 객체로 변환합니다.
		 *
		 * 1. Base64 문자열을 atob 함수를 이용하여 디코딩 합니다.
		 * 2. ArrayBuffer 객체에 디코딩된 byte 원본을 추가합니다.
		 * 3. 8bit View 를 이용하여 이미지 크기만큼 읽어 옵니다.
		 * 4. Blob 객체를 초기화하여 리턴합니다.
		 */
		var base64ToBlob = function(base64String){
			var byteString = atob(base64String.split(',')[1]);
			var mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];

			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ab], { type: mimeString });
		}

		/**
		 * 지도를 이미지로 저장합니다.
		 */
		GMXMAP.exportMapPNG = function(_Size, _Resolution, _isAutoPrint){
			GMXMAP["isExporting"] = true;
			$("#mapExportWrap").find("button.exportBtn").prop("disabled", true);

			paperSize["browserSize"] = GMXMAP.getSize();

			var format = _Size;
			var resolution = _Resolution;
			var dim = paperSize[format];
			var width = Math.round((dim[0] * resolution) / 25.4);
			var height = Math.round((dim[1] * resolution) / 25.4);

			var size = GMXMAP.getSize();
			var center = GMXMAP.getView().getCenter();
			var viewResolution = GMXMAP.getView().getResolution();

			GMXMAP.once("rendercomplete", function (){
				var mapCopyCanvas = document.createElement("canvas");
				mapCopyCanvas.width = GMXMAP.getSize()[0];
				mapCopyCanvas.height = GMXMAP.getSize()[1];

				if(_Size !== "browserSize"){
					mapCopyCanvas.width = width;
					mapCopyCanvas.height = height;
				}

				var mapContext = _CollectMapResource(mapCopyCanvas);

				if(_isAutoPrint){
					window.imgBlob = base64ToBlob(mapCopyCanvas.toDataURL());
					window.open(URL.createObjectURL(imgBlob), "_blank").print();
				}else{
					var $a = $("<a id='image-download'></a>").attr({ "download" : "map-" + Date.prototype.getYMD(true) + ".png", "href" : mapCopyCanvas.toDataURL() }).hide();

					$("body").append($a);
					$a[0].click();
					$a.remove();
				}

				GMXMAP.setSize(size);
				GMXMAP.getView().setCenter(center);
				GMXMAP.getView().setResolution(viewResolution);

				$("#mapExportWrap").find("button.exportBtn").prop("disabled", false);

				_SetProxyTiles();
				GMXMAP["isExporting"] = false;
			});

			if(_Size === "browserSize"){
				GMXMAP.setSize(size);
				GMXMAP.getView().setResolution(viewResolution);
			}else{
				var printSize = [width, height];
				GMXMAP.setSize(printSize);
				var scaling = Math.min(width / size[0], height / size[1]);
				GMXMAP.getView().setResolution(viewResolution / scaling);
			}

			_SetProxyTiles();
		}

		/**
		 * 지도를 PDF로 저장합니다.
		 */
		GMXMAP.exportMapPDF = function(_Size, _Resolution, _isAutoPrint){
			GMXMAP["isExporting"] = true;
			$("#mapExportWrap").find("button.exportBtn").prop("disabled", true);

			var format = _Size;
			var resolution = _Resolution;
			var dim = paperSize[format];
			var width = Math.round((dim[0] * resolution) / 25.4);
			var height = Math.round((dim[1] * resolution) / 25.4);

			var size = GMXMAP.getSize();
			var center = GMXMAP.getView().getCenter();
			var viewResolution = GMXMAP.getView().getResolution();

			GMXMAP.once("rendercomplete", function () {
				var mapCopyCanvas = document.createElement("canvas");
				mapCopyCanvas.width = width;
				mapCopyCanvas.height = height;
				var mapContext = _CollectMapResource(mapCopyCanvas);

				if(!("jsPDF" in window)) window.jsPDF = jspdf.jsPDF;
				var pdf = new jsPDF("landscape", undefined, format);
				pdf.addImage(mapCopyCanvas.toDataURL("image/jpeg"), "JPEG", 0, 0, dim[0], dim[1]);

				if(_isAutoPrint){
					pdf.autoPrint();
					window.open(pdf.output("bloburl"), "_blank");
				}else{
					pdf.save("map-" + Date.prototype.getYMD(true) + ".pdf");
				}

				GMXMAP.setSize(size);
				GMXMAP.getView().setCenter(center);
				GMXMAP.getView().setResolution(viewResolution);

				$("#mapExportWrap").find("button.exportBtn").prop("disabled", false);

				_SetProxyTiles();
				GMXMAP["isExporting"] = false;
			});

			var printSize = [width, height];
			GMXMAP.setSize(printSize);
			var scaling = Math.min(width / size[0], height / size[1]);
			GMXMAP.getView().setResolution(viewResolution / scaling);

			_SetProxyTiles();
		}

		/**
		 * Export Dialog 를 생성합니다.
		 */
		GMXMAP.openExportDialog = function(){
			$("#mapExportWrap").dialog("close").dialog({
				width: 580,
				height: 590,
				position: {
					my: "center",
					at: "center",
					of: $("#map")
				},
				open: function(){
					var defaultProxy = (_GMXMAP_DEF_PROXY_ === true);
					if(!defaultProxy){
						GMXMAP.addMapNotification("교차 출처 리소스 공유 정책(CORS)으로 인하여 배경지도를 다시 로드합니다.", 5000);
						_SET_ACTIVE_PROXY(true);
						GMXLAYER.setProxyTile(GMXMAP);
					}

					GMXMAP.renderSync();

					/**
					 * 이미지 사이즈를 지도 크기로 선택할 경우 해상도를 동일하게 변경합니다.
					 */
					$("#mapExportWrap").find("#pngSize").off("change").change(function(){
						if($(this).val() === "browserSize"){
							$("#mapExportWrap").find("#pngResolution").find("option[value=browserSize]").prop("selected", true);
						}else{
							if($("#mapExportWrap").find("#pngResolution").val() === "browserSize"){
								$("#mapExportWrap").find("#pngResolution").find("option:eq(0)").prop("selected", true);
							}
							$("#mapExportWrap").find("#pngResolution").removeProp("readonly");
						}
					});

					/**
					 * 이미지 해상도를 지도 크기로 선택할 경우 사이즈를 동일하게 변경합니다.
					 */
					$("#mapExportWrap").find("#pngResolution").off("change").change(function(){
						if($(this).val() === "browserSize"){
							$("#mapExportWrap").find("#pngSize").find("option[value=browserSize]").prop("selected", true);
						}else{
							if($("#mapExportWrap").find("#pngSize").val() === "browserSize"){
								$("#mapExportWrap").find("#pngSize").find("option:eq(0)").prop("selected", true);
							}
							$("#mapExportWrap").find("#pngSize").removeProp("readonly");
						}
					});

					/**
					 * Export 버튼 이벤트 입니다.
					 */
					$("#mapExportWrap").find(".exportBtn").off("click").click(function(){
						var ext = $(this).attr("ext");
						var size = $("#mapExportWrap").find("#" + ext + "Size").val();
						var resolution = $("#mapExportWrap").find("#" + ext + "Resolution").val();
						var isAutoPrint = $("#mapExportWrap").find("#" + ext + "AutoPrint").is(":checked");

						if(_common.utils.isNullAndEmpty(size) || _common.utils.isNullAndEmpty(resolution)){
							alert(ext.toUpperCase() + " 추출을 위한 크기 및 해상도를 선택하세요.");
							return false;
						}

						GMXMAP["exportMap" + ext.toUpperCase()](size, resolution, isAutoPrint);
					});
				},
				close: function(){
					if((_GMXMAP_DEF_PROXY_ === false) && (_IS_PROXY_ === true)){
						_SET_ACTIVE_PROXY(_GMXMAP_DEF_PROXY_);
						GMXLAYER.setProxyTile(GMXMAP);
						GMXMAP.renderSync();
					}
				}
			}).dialog("open");
		}

	}
}

})(GMXMAP, GMXLAYER, _GMXMAP_DEF_PROXY_, _IS_PROXY_);