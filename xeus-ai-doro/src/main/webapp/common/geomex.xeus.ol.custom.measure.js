/**
 * 거리, 면적 인터렉션 객체 입니다.
 *
 * 필수) Map - 지도 객체 (ol.Map)
 * 선택) addBoolean - 인터렉션 생성 후 지도에 추가 여부(Boolean 기본 true)
 *
 * @author 이주영
 */
if(window.XeusMeasure == null) var XeusMeasure = function(Map, addBoolean){

	if(Map == null || !Map instanceof ol.Map){
		console.warn("필수 파라미터 Map(ol.Map) 객체가 누락되었습니다.");
		return false;
	}

	var _Map = Map;
	var _Bool = addBoolean;
	if(!addBoolean) _Bool = false;


	/**
	 *  거리 및 면적에 사용될 벡터 객체 입니다.
	 */
	var measureSource = new ol.source.Vector();
	var measureVector = new ol.layer.Vector({
		zIndex: 9999,
		source: measureSource,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	});

	/**
	 * 숫자에 쉼표를 추가합니다.
	 */
	var formatComma2Num = function(number) {
	    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	var createMeasure = function(source) {
		var _Class = this;
		_Class.draw = null;
		_Class.nowOverlays = [];
		_Class.typeSelect = null;
		_Class.measureSource = source;
		_Class.geodesicCheckbox = false;
		_Class.wgs84Sphere = new ol.Sphere( 6378137 );

		/**
		 * Currently drawn feature.
		 * @type {ol.Feature}
		 */
		_Class.sketch = null;


		/**
		 * The help tooltip element.
		 * @type {Element}
		 */
		_Class.helpTooltipElement = null;


		/**
		 * Overlay to show the help messages.
		 * @type {ol.Overlay}
		 */
		_Class.helpTooltip = null;


		/**
		 * The measure tooltip element.
		 * @type {Element}
		 */
		_Class.measureTooltipElement = null;


		/**
		 * Overlay to show the measurement.
		 * @type {ol.Overlay}
		 */
		_Class.measureTooltip = null;


		/**
		 * Message to show when the user is drawing a polygon.
		 * @type {string}
		 */
		//_Class.continuePolygonMsg = 'Click to continue drawing the polygon';
		_Class.continuePolygonMsg = '면적 측정';

		/**
		 * Message to show when the user is drawing a line.
		 * @type {string}
		 */
		//_Class.continueLineMsg = 'Click to continue drawing the line';
		_Class.continueLineMsg = '거리 측정';

		_Class.enable = function(type) {
			_Class.disable();
			_Class.typeSelect = type;
			_Class.addInteraction();
			_Class.Active = true;

			return this;
		};

		_Class.addInteraction = function() {

			_Map.on('pointermove', _Class.pointerMoveHandler);

			_Map.on('singleclick', _Class.addPoint);

			var type = ( _Class.typeSelect == 'area' ? 'Polygon' : 'LineString' );
			_Class.draw = new ol.interaction.Draw({
				source: _Class.measureSource,
				type: /** @type {ol.geom.GeometryType} */ (type),
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 0, 0, 0.5)',
						lineDash: [10, 10],
						width: 2
					}),
					image: new ol.style.Circle({
						radius: 5,
						stroke: new ol.style.Stroke({
							color: 'rgba(0, 0, 0, 0.7)'
						}),
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						})
					})
				})
			});

			_Class.addInteractionDraw( _Class.draw );

		};


		_Class.addInteractionDraw = function(draw) {
			_Map.addInteraction( _Class.draw );
			_Class.createMeasureTooltip();
			_Class.createHelpTooltip();
			_Class.drawStart();
			_Class.drawEnd();

			return this;
		};


		_Class.drawStart = function() {
			_Class.draw.on('drawstart', function(evt) {
				_Class.sketch = evt.feature;
			}, this);

			return this;
		};


		_Class.drawEnd = function() {
			_Class.draw.on('drawend', function(evt) {
				_Class.measureTooltipElement.className = 'tooltip-help tooltip-static';
				_Class.measureTooltip.setOffset( [0, -7] );
			    // unset sketch
			    _Class.sketch = null;
			    // unset tooltip so that a new one can be created
			    _Class.measureTooltipElement = null;
			    _Class.createMeasureTooltip();
			}, this);

			return this;
		};


		/**
		 * Creates a new help tooltip
		 */
		_Class.createHelpTooltip = function() {
			if ( _Class.helpTooltipElement ) {
				_Class.helpTooltipElement.parentNode.removeChild( _Class.helpTooltipElement );
			}
			_Class.helpTooltipElement = document.createElement('div');
			_Class.helpTooltipElement.className = 'tooltip-help';
			_Class.helpTooltip = new ol.Overlay({
				element: _Class.helpTooltipElement,
				offset: [15, 0],
				positioning: 'center-left'
			});

			_Map.addOverlay( _Class.helpTooltip );
			return this;
		};


		/**
		 * Creates a new measure tooltip
		 */
		_Class.createMeasureTooltip = function() {
			if ( _Class.measureTooltipElement ) {
				_Class.measureTooltipElement.parentNode.removeChild( _Class.measureTooltipElement );
			}
			_Class.measureTooltipElement = document.createElement('div');
			_Class.measureTooltipElement.className = 'tooltip-help tooltip-measure';
			_Class.measureTooltip = new ol.Overlay({
				element: _Class.measureTooltipElement,
				offset: [0, -15],
				positioning: 'bottom-center'
			});
			_Class.nowOverlays.push( _Class.measureTooltip );
			_Map.addOverlay( _Class.measureTooltip );
			return this;
		};


		/**
		 * format length output
		 * @param {ol.geom.LineString} line
		 * @return {string}
		 */
		_Class.formatLength = function(line) {
			var length;
		    if ( _Class.geodesicCheckbox ) {
		    	var coordinates = line.getCoordinates();
		    	length = 0;
		    	var sourceProj = _Map.getView().getProjection();
		    	for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
		    		var c1 = ol.proj.transform( coordinates[i], sourceProj, 'EPSG:4326' );
		    		var c2 = ol.proj.transform( coordinates[i + 1], sourceProj, 'EPSG:4326' );
		    		length += _Class.wgs84Sphere.haversineDistance( c1, c2 );
		    	}
		    } else {
		    	length = Math.round( line.getLength() * 100 ) / 100;
		    }
		    var output;
		    if ( length > 1000 ) {
		    	var clength = formatComma2Num( ( Math.round( length / 1000 * 100 ) / 100 ) );
		    	output = clength + ' ' + 'km';
		    } else {
		    	var clength = formatComma2Num( ( Math.round( length * 100) / 100 ) );
		    	output = clength + ' ' + 'm';
		    }
		    return output;
		};




		/**
		 * format length output
		 * @param {ol.geom.Polygon} polygon
		 * @return {string}
		 */
		_Class.formatArea = function(polygon) {
			var area;
			if ( _Class.geodesicCheckbox ) {
				var sourceProj = _Map.getView().getProjection();
				var geom = /** @type {ol.geom.Polygon} */( polygon.clone().transform(
						sourceProj, 'EPSG:4326'));
				var coordinates = geom.getLinearRing(0).getCoordinates();
				area = Math.abs( _Class.wgs84Sphere.geodesicArea( coordinates ) );
			} else {
				area = polygon.getArea();
			}
			var output;
			if (area > 1000000) {
				var clength = formatComma2Num( ( Math.round( area / 1000000 * 100 ) / 100 ) );
				output = clength + ' ' + 'km<sup>2</sup>';
			} else {
				var clength = formatComma2Num( ( Math.round( area * 100 ) / 100 ) );
				output = clength + ' ' + 'm<sup>2</sup>';
			}
			return output;
		};



		/**
		 * Handle pointer move.
		 * @param {ol.MapBrowserEvent} evt
		 */
		_Class.pointerMoveHandler = function(evt) {
			if ( evt.dragging ) {
				return;
			}
			/** @type {string} */
			//var helpMsg = 'Click to start drawing';
			var helpMsg = '측정 시작 할 위치 선택';
			/** @type {ol.Coordinate|undefined} */
			var tooltipCoord = evt.coordinate;

			if ( _Class.sketch ) {
				var output;
				var geom = ( _Class.sketch.getGeometry() );
				if ( geom instanceof ol.geom.Polygon ) {
					output = _Class.formatArea(/** @type {ol.geom.Polygon} */ (geom));
					helpMsg = _Class.continuePolygonMsg;
					tooltipCoord = geom.getInteriorPoint().getCoordinates();
				} else if ( geom instanceof ol.geom.LineString ) {
					output = _Class.formatLength( /** @type {ol.geom.LineString} */ (geom));
					helpMsg = _Class.continueLineMsg;
					tooltipCoord = geom.getLastCoordinate();
				}
				_Class.measureTooltipElement.innerHTML = output;
				_Class.measureTooltip.setPosition(tooltipCoord);
			}

			if(_Class.helpTooltipElement) _Class.helpTooltipElement.innerHTML = helpMsg;
			if(_Class.helpTooltip) _Class.helpTooltip.setPosition( evt.coordinate );

			return this;
		};

		_Class.addPoint = function(evt) {
			if ( !_Class.isActive() ) {
				return;
			}

		    //_Class.createMeasureTooltip();
		};

		_Class.destroy = function() {
			_Class.disable();
			_Class.clear();

			return this;
		};

		_Class.clear = function() {
			_Map.removeOverlay( _Class.helpTooltip );

			for (var i in _Class.nowOverlays) {
				_Map.removeOverlay( _Class.nowOverlays[i] );
			}

			_Class.measureSource.clear();
			return this;
		};

		_Class.disable = function() {
			_Class.Active = false;
			_Map.removeOverlay( _Class.helpTooltip );
			_Map.removeInteraction( _Class.draw );
			_Map.un( _Map.on('pointermove', _Class.pointerMoveHandler) );
			_Map.un( _Map.on('singleclick', _Class.addPoint) );

			return this;
		};

		_Class.Active = false;
		_Class.isActive = function() {
			return _Class.Active;
		};

		_Class.getVector = function() {
			return measureVector;
		};

		if(_Bool) _Map.addLayer(measureVector);

		return this;
	}

	return new createMeasure(measureSource);

}