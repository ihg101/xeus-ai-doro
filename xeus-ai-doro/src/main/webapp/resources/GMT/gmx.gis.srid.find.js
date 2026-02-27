/**
 * SHP SRID를 찾는 기능입니다.
 */
/*name	: layerInfo.lyrNm,
visible : layerInfo.visibleYn,
group	: layerInfo.grpNm,*/
var daumTilParam = { "grpNm" : "배경지도", "lyrNm" : "카카오 항공 영상", "visibleYn" : true };
var daumMapParam = { "grpNm" : "배경지도", "lyrNm" : "카카오 그림 지도", "visibleYn" : false };
var daumHybParam = { "grpNm" : "배경지도", "lyrNm" : "카카오 하이브리드", "visibleYn" : false };
if(window.daumTile == null) var daumTile = GMXLAYER.createTile("daum_map", daumTilParam);
if(window.daumMap == null) var daumMap = GMXLAYER.createTile("daum_tile", daumMapParam);
if(window.daumHyb == null) var daumHyb = GMXLAYER.createTile("daum_hybrid", daumHybParam);
if(window.shpVector == null) var shpVector = null;
if(window.shpVector == null) var shpVector = null;
if(window.GMXMAP == null) var GMXMAP = null;
if(window.setEPSG == null) var setEPSG = function(EPSG){
	$("#map").html("");
	GMXMAP = null;
	GMXMAP = new ol.Map({
		controls : ol.control.defaults().extend([]),
		logo : false,
		target : "map",
		layers : [
			daumTile,
			daumMap,
			daumHyb,
			shpVector
		],
		interactions: ol.interaction.defaults({
			dragPan: false,
			mouseWheelZoom: false
		}).extend([
		    new ol.interaction.DragPan({ kinetic: false }),
		    new ol.interaction.MouseWheelZoom({ duration: 0 })
		]),
		view : new ol.View({
			projection : ol.proj.get(EPSG),
			center : Spatial.convertProjection([266008.101460599, 432133.8431784295], "EPSG:5186", EPSG),
			zoom : 8,
			minZoom : 8,
			maxZoom : 25
		})
	});

	if(shpVector.getSource().getFeatures().length > 0){
		GMXMAP.getView().fit(shpVector.getSource().getExtent(), GMXMAP.getSize());
	}
}

window.onload = function(){

	$("#controlWrap").dialog({
		width: "auto",
		height: "auto",
		position: {
			my: "right bottom",
			at: "right bottom",
			of: $("#rootWrap")
		},
		resizable: false,
		closeOnEscape: false,
		open: function(event, ui) {
			$(".ui-dialog-titlebar-close").hide();
		},
		close: function(){

		}
	}).dialog("open");

	shpVector = new ol.layer.Vector({
		source : new ol.source.Vector(),
		style : new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "red",
				width: 2
			})
		})
	})

	setEPSG($("#epsg").val());

	$("#epsg").change(function(){
		setEPSG($(this).val());
	});

	$("#toggleMap").click(function(){
		if(daumTile.getVisible()){
			GMXMAP.removeLayer(daumTile); daumTile = null;
			GMXMAP.removeLayer(daumMap); daumMap = null;
			GMXMAP.removeLayer(daumHyb); daumHyb = null;

			daumTilParam.visibleYn = false;
			daumMapParam.visibleYn = true;
			daumHybParam.visibleYn = true;

			daumTile = GMXLAYER.createTile("daum_map", daumTilParam);
			daumMap = GMXLAYER.createTile("daum_tile", daumMapParam);
			daumHyb = GMXLAYER.createTile("daum_hybrid", daumHybParam);

			GMXMAP.addLayer(daumMap);
			GMXMAP.addLayer(daumHyb);

			/*daumTile.setVisible(false);
			daumMap.setVisible(true);
			daumHyb.setVisible(true);*/
		}else{
			GMXMAP.removeLayer(daumTile); daumTile = null;
			GMXMAP.removeLayer(daumMap); daumMap = null;
			GMXMAP.removeLayer(daumHyb); daumHyb = null;

			daumTilParam.visibleYn = true;
			daumMapParam.visibleYn = false;
			daumHybParam.visibleYn = false;

			daumTile = GMXLAYER.createTile("daum_map", daumTilParam);
			daumMap = GMXLAYER.createTile("daum_tile", daumMapParam);
			daumHyb = GMXLAYER.createTile("daum_hybrid", daumHybParam);

			GMXMAP.addLayer(daumTile);

			/*daumTile.setVisible(true);
			daumMap.setVisible(false);
			daumHyb.setVisible(false);*/
		}
	});

	$("#removeFeatures").click(function(){
		if(shpVector != null){
			shpVector.getSource().clear();
		}
	});

	$("#uploadFile").click(function(){
		$("#uploadZip").click();
	});

	$("#uploadZip").change(function(evt){
		a = evt;
		var file = evt.target.files[0];
		if(file.name.toLowerCase().endsWith(".zip")) {
			NProgress.start();
			//NProgress.set(0.4);
			//NProgress.inc();
			//NProgress.configure({ ease: 'ease', speed: 500 });
			//NProgress.configure({ trickleSpeed: 800 });
			//NProgress.configure({ showSpinner: false });
			//NProgress.configure({ parent: '#progress' });

			loadshp({
				url: file,
				encoding: "EUC-KR",
				EPSG: $("#epsg").val().replace("EPSG:", "")
			}, function(data) {
				var format = new ol.format.GeoJSON();
				var features = format.readFeatures(data);
				shpVector.getSource().clear();
				shpVector.getSource().addFeatures(features);
				GMXMAP.getView().fit(shpVector.getSource().getExtent(), GMXMAP.getSize());

				NProgress.done();

				$("#uploadZip").val("");
			});
		} else {
			alert("ZIP 파일만 업로드 할 수 있습니다.")
			return false;
		}
	});

	$(window).resize(function(){
		var timeout = setTimeout(function(){
			GMXMAP.updateSize();
			clearTimeout(timeout);
			timeout = null;
		}, 500);
	});

	// http://mapview.paas.lx.or.kr/mapShp.do
	// https://progworks.tistory.com/88
}