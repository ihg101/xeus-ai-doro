//if(window.geomex == null) var geomex = { map : {} };

/**
 * <pre>
 * CustomOverview 객체 입니다.
 * OpenLayers3에서 제공하는 엘리먼트형식 오버뷰가 아닌 벡터 형식의 오버뷰 입니다.
 *
 * 필수) Map - 동기화 대상 지도객체 (ol.Map)
 * 필수) DOM - 오버뷰 생성대상 Element ID (String)
 *
 * @author 이주영
 * </pre>
 */
if(window.XeusOverview == null) var XeusOverview = function(Map, View, DOM){

	if(Map == null || (Map instanceof ol.Map) == false){
		console.error("필수 파라미터 누락 (ol.Map Object)");
		return false;
	}else if(DOM == null){
		console.error("필수 파라미터 누락 (DOM String)");
		return false;
	}

	var _OverView;
	var _Map = Map;
	var _DOM = DOM;
	var _GetBoxSource = function(){
		return new ol.source.Vector({
			features: [new ol.Feature({
				geometry : ol.geom.Polygon.fromExtent(_Map.getView().calculateExtent(_Map.getSize())),
				name : 'location'
			})]
		});
	};
	var _Style = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgb(0,0,255)',
			width: 3
		}),
		fill: new ol.style.Fill({
			color: 'rgba(0,0,255,0.1)'
		})
	}), new ol.style.Style({
		image: new ol.style.Circle({
			radius: 4,
			fill: new ol.style.Fill({
				color: 'rgb(0,0,255)'
			})
		}),
		geometry: function(feature){
			return new ol.geom.Polygon(ol.extent.buffer(Spatial.getExtent(_Map), 100));
		}
	})];

	var _BOX = new ol.layer.Vector({
		source : _GetBoxSource(),
		style  : _Style[0],
		zIndex : 999
	});

	(function(){

		var daum = new geomex.xeus.tms.DaumMap();

		_OverView = new ol.Map({
			logo : false,
			interactions: ol.interaction.defaults({
				doubleClickZoom : false,
				mouseWheelZoom : false,
				dragPan : false
			}).extend([
			    new ol.CustomFeatureDrag(_Map, _BOX)
            ]),
			layers: [
				_BOX,
				daum.createMapLayer({
					visible : true,
					proxy : MAP_PROXY_CHK
				})
			],
			target: _DOM,
			view: View
		});

		$(_OverView.getTargetElement()).find(".ol-zoom, .ol-attribution").remove();

		var polygonCoord = function(){
			var bufferExtent = new ol.extent.buffer(Spatial.getExtent(_Map), 20 * 100);
			var polygon = [[
                            [bufferExtent[0], bufferExtent[1]],
                            [bufferExtent[0], bufferExtent[3]],
                            [bufferExtent[2], bufferExtent[3]],
                            [bufferExtent[2], bufferExtent[1]],
                            [bufferExtent[0], bufferExtent[1]]
                          ]];
			return polygon;
		};

		_Map.on('moveend', function(evt){
			//if(_Map.getView().getZoom() > 13){
			if(_Map.getView().getResolution() < 7){
				_BOX.getSource().getFeatures()[0].getGeometry().setCoordinates(polygonCoord());
			}else{
				_BOX.setSource(_GetBoxSource());
			}
	    });

	})();

	/**
	 * <pre>
	 * 생성된 오버뷰 지도객체를 리턴합니다.
	 * </pre>
	 */
	this.getOverViewMap = function(){ return _OverView };

	/**
	 * <pre>
	 * 오버뷰 Vector 객체의 Source 를 부모 지도와 동기화하여 리턴 합니다.
	 * </pre>
	 */
	this.getBoxSource = function(){
		return _GetBoxSource();
	};

	/**
	 * <pre>
	 * 오버뷰 Vector 객체를 부모 지도와 동기화하여 리턴 합니다.
	 * </pre>
	 */
	this.getBox = function(){
		return _BOX;
	};

};
