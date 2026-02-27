/**
 * <pre>
 * CustomFeatureDrag Control 객체 입니다.
 * Feature 객체의 드래그 이벤트를 지원합니다.
 *
 * 필수) Map - 메인 지도객체 (ol.Map)
 *
 * @author 이주영
 * </pre>
 */
ol.CustomFeatureDrag = function(Map) {

	/*if(Map == null || (Map instanceof ol.Map) == false){
		console.error("필수 파라미터 누락 (ol.Map Object)");
		return false;
	}*/

	this._Map = Map;

	this._Coordinate = null;

	this._Cursor = 'pointer';

	this._Feature = null;

	this._PrevCursor = undefined;

	if(arguments[1] instanceof ol.layer.Vector){
		this._OverViewBox = arguments[1];
	}

	ol.interaction.Pointer.call(this, {
		handleDownEvent : ol.CustomFeatureDrag.prototype.handleDownEvent,
		handleDragEvent : ol.CustomFeatureDrag.prototype.handleDragEvent,
		handleMoveEvent : ol.CustomFeatureDrag.prototype.handleMoveEvent,
		handleUpEvent   : ol.CustomFeatureDrag.prototype.handleUpEvent
	});

};

ol.inherits(ol.CustomFeatureDrag, ol.interaction.Pointer);

/**
 * <pre>
 * 객체 선택 시점의 이벤트 입니다.
 * 마우스가 눌렸을때 (Press) 발생됩니다.
 * </pre>
 */
ol.CustomFeatureDrag.prototype.handleDownEvent = function(evt) {
	var map = evt.map;

	/*var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		var feat = feature;

		if(this._OverViewBox instanceof ol.layer.Vector){
			feat = this._OverViewBox.getSource().getFeatures()[0];
		}

		return feat;
	});*/

	var feature;

	if(this._OverViewBox instanceof ol.layer.Vector){
		feature = this._OverViewBox.getSource().getFeatures()[0];
	}else{
		feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
			return feature;
		});
	}

	if (feature) {
		this._Coordinate = evt.coordinate;
		this._Feature = feature;
	}

	return !!feature;
};

/**
 * <pre>
 * 객체 선택 후 드래그(drag) 할때 발생됩니다.
 * </pre>
 */
ol.CustomFeatureDrag.prototype.handleDragEvent = function(evt) {
	var map = evt.map;

	/*var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		var feat = feature;

		if(this._OverViewBox instanceof ol.layer.Vector){
			feat = this._OverViewBox.getSource().getFeatures()[0];
		}

		return feat;
	});*/

	var deltaX = evt.coordinate[0] - this._Coordinate[0];
	var deltaY = evt.coordinate[1] - this._Coordinate[1];

	var feature;

	if(this._OverViewBox instanceof ol.layer.Vector){
		feature = this._OverViewBox.getSource().getFeatures()[0];
	}else{
		feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
			return feature;
		});
	}

	var geometry = (this._Feature.getGeometry());
	geometry.translate(deltaX, deltaY);

	this._Coordinate[0] = evt.coordinate[0];
	this._Coordinate[1] = evt.coordinate[1];
};

/**
 * <pre>
 * 객체가 이동되었을때 발생합니다.
 * </pre>
 */
ol.CustomFeatureDrag.prototype.handleMoveEvent = function(evt) {
	if (this._Cursor) {
		var map = evt.map;
		var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
			var feat = feature;

			if(this._OverViewBox instanceof ol.layer.Vector){
				feat = this._OverViewBox.getSource().getFeatures()[0];
			}

			return feat;
		});

		var element = evt.map.getTargetElement();
		if (feature) {
			if (element.style.cursor != this._Cursor) {
				this._PrevCursor = element.style.cursor;
				element.style.cursor = this._Cursor;
			}
		} else if (this._PrevCursor !== undefined) {
			element.style.cursor = this._PrevCursor;
			this._PrevCursor = undefined;
		}
	}
};

/**
 * <pre>
 * 클릭이 해제 되었을때 발생합니다.
 * </pre>
 */
ol.CustomFeatureDrag.prototype.handleUpEvent = function(evt) {

	var map = evt.map;

	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		return feature;
	});

	if(this._OverViewBox instanceof ol.layer.Vector){
		feature = this._Feature;
	}

	if(this._Map != null) this._Map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));

	this._Coordinate = null;
	this._Feature = null;
	return false;
};