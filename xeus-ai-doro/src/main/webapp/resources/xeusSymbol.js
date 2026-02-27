/**
 * <pre>
 * Point 심볼 변경을 위한 객체입니다.
 * 기존 Feature 객체를 변경하지 않고,
 * 새로운 Feature 를 생성하여 같은 자리에 추가합니다.
 * </pre>
 *
 * @author 이주영
 * @version 1.0r
 */
if(window.xeusSymbol == null) var xeusSymbol = {

	/* 심볼 표시용 벡터 객체 입니다. */
	vector : null,
	vectorSource : null,

	/* 가이드라인용 벡터 객체 입니다. */
	guide : null,
	guideSource : null,

	/**
	 * 현재 지도의 심볼벡터를 리턴합니다.
	 *
	 * @returns
	 */
	getVector : function(){
		return GMXMAP.getLayerByName("xeusSymbol");
	},

	/**
	 * 현재 지도의 가이드라인을 리턴합니다.
	 *
	 * @returns
	 */
	getGuideLine : function(){
		return GMXMAP.getLayerByName("guideLine");
	},

	/**
	 * 심볼용 벡터를 생성하여 지도에 추가합니다.
	 *
	 * @param 선택) _Map - ol.Map
	 * @returns {___anonymous_xeusSymbol}
	 */
	createVector : function(_Map){
		this.vectorSource = new ol.source.Vector();
		this.vector = new ol.layer.Vector({
			name: "xeusSymbol",
			source: xeusSymbol.vectorSource,
			zIndex: 100
		});

		if(_Map instanceof ol.Map){
			_Map.addLayer(vector);
		}else{
			return this.vector;
		}
	},

	/**
	 * 가이드라인 벡터를 생성하여 지도에 추가합니다.
	 *
	 * @param 선택) _Map - ol.Map
	 * @returns {___anonymous_xeusSymbol}
	 */
	createGuideLine : function(_Map){
		this.guideSource = new ol.source.Vector();
		this.guide = new ol.layer.Vector({
			name: "guideLine",
			source: xeusSymbol.guideSource,
			zIndex: 99,
			style: new ol.style.Style({
				stroke : new ol.style.Stroke({
					width : 3,
					color : "#ff1a8c",
					lineDash : [ .2, 6 ]
				}),
			})
		});

		if(_Map instanceof ol.Map){
			_Map.addLayer(guide);
		}else{
			return this.guide;
		}
	},

	/**
	 * Gid 값으로 등록된 Feature 객체를 찾아 리턴합니다.
	 *
	 * @param _Gid - Number
	 * @returns
	 */
	findFeature : function(_Gid, _Type){
		var feature = null;
		if(this.getVector()){
			var features = this.getVector().getSource().getFeatures();
			for(var i=0; i<features.length; i++){
				if(_Type){
					if(features[i].get("gid") == Number(_Gid) && features[i].get(_Type)){
						feature = features[i];
					}
				}else{
					if(features[i].get("gid") == Number(_Gid)){
						feature = features[i];
					}
				}
			}
		}

		return feature;
	},

	/**
	 * Layer 값으로 등록된 Feature 객체를 찾아 활성화/비활성화 합니다.
	 *
	 * @param 필수) _Layer - String
	 * @param 필수) _Visible - Boolean
	 * @param 선택) _Callback - function
	 * @returns
	 */
	setVisible : function(_Layer, _Visible, _Callback){
		var success = false;
		var feature = null;
		if(this.getVector()){
			var features = this.getVector().getSource().getFeatures();
			for(var i=0; i<features.length; i++){
				var feature = features[i];
				if(feature.get("layer") == _Layer){
					if(_Visible){
						feature.setStyle(feature.getProperties()["style"]);
					}else{
						feature.setStyle(new ol.style.Style({
							image: new ol.style.Circle({
								radius: 5,
								fill: new ol.style.Fill({
									color: 'rgba(0,0,0,0)'
								}),
								stroke: new ol.style.Stroke({
									color: 'rgba(0,0,0,0)',
								})
							})
						}))
					}
				}
			}
		}

		if(success && typeof _Callback == "function") _Callback();

		return this;
	},

	/**
	 * Gid 값으로 등록된 Feature 객체를 찾아 삭제합니다.
	 *
	 * TODO 필요시 추후 모든 타입(isPlay, isPreset, isLock 등을 모두 제거)
	 *
	 * @param 필수) _Gid - Number
	 * @param 필수) _Type - String
	 * @param 선택) _Callback - function
	 * @returns
	 */
	removeFeature : function(_Gid, _Type, _Callback){
		var success = false;
		var feature = null;
		if(this.getVector()){
			var features = this.getVector().getSource().getFeatures();
			for(var i=0; i<features.length; i++){
				if(features[i].get("gid") == Number(_Gid) && features[i].get(_Type)){
					try {
						this.getVector().getSource().removeFeature(features[i]);
						success = true;
					} catch(e) {
						console.error(e);
					}
				}
			}
		}

		if(success && typeof _Callback == "function") _Callback();

		return success;
	},

	/**
	 * Layer 값으로 등록된 Feature 객체를 찾아 삭제합니다.
	 *
	 * @param 선택) _Layer - String
	 * @param 선택) _Callback - function
	 * @returns
	 */
	removeAllFeatureType : function(_Layer, _Type, _Callback){
		var success = false;
		var feature = null;

		if(this.getVector()){
			var features = this.vectorSource.getFeatures();
			var isAllRemove = _common.utils.isNullAndEmpty(_Layer);
			for(var i=0; i<features.length; i++){
				if(isAllRemove){
					this.getVector().getSource().removeFeature(features[i]);
				}else{
					if(features[i].get("layer") == _Layer && features[i].get(_Type)){
						try {
							this.getVector().getSource().removeFeature(features[i]);
							success = true;
						} catch(e) {
							console.error(e);
						}
					}
				}
			}
		}

		if(success && typeof _Callback == "function") _Callback();

		return success;
	},

	/**
	 * Layer 값으로 등록된 Feature 객체를 찾아 삭제합니다.
	 *
	 * @param 선택) _Layer - String
	 * @param 선택) _Callback - function
	 * @returns
	 */
	removeAllFeature : function(_Layer, _Callback){
		var success = false;
		var feature = null;

		if(this.getVector()){
			var features = this.vectorSource.getFeatures();
			var isAllRemove = _common.utils.isNullAndEmpty(_Layer);
			for(var i=0; i<features.length; i++){
				if(isAllRemove){
					this.getVector().getSource().removeFeature(features[i]);
				}else{
					if(features[i].get("layer") == _Layer){
						try {
							this.getVector().getSource().removeFeature(features[i]);
							success = true;
						} catch(e) {
							console.error(e);
						}
					}
				}
			}
		}

		if(success && typeof _Callback == "function") _Callback();

		return success;
	},


	/**
	 * 재생 심볼을 추가합니다.
	 *
	 * @param _Object - Array or ol.Feature
	 * @param _Gid - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addPlay : function(_Object, _Gid){

		var center = null;

		if(_Object instanceof Array){
			center = _Object;
		}else if(_Object instanceof ol.Feature){
			center = _Object.getGeometry().getCoordinates();
		}

		try {
			var point = new ol.Feature(new ol.geom.Point(center));
			point.setProperties({
				"isIgnore" : true,
				"isPlay" : true,
				"gid" : _Gid,
				"style" : new ol.style.Style({
					image: new ol.style.Icon({
						src: '../res/sym/cctv/play2.png'
					})
				})
			});
			point.setStyle(point.getProperties()["style"]);

			if(this.getVector()){
				this.getVector().getSource().addFeature(point);
			}
		} catch(e) {
			console.log("Feature 생성에 실패하었습니다. (중심점 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * 재생 심볼을 추가합니다.
	 *
	 * @param _Object - Array or ol.Feature
	 * @param _Gid - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addBuffer : function(_Object, _Gid, _Buffer){

		var center = null;

		if(_Object instanceof Array){
			center = _Object;
		}else if(_Object instanceof ol.Feature){
			center = _Object.getGeometry().getCoordinates();
		}

		if(!_common.utils.isNumber(Number(_Buffer))){
			_Buffer = 100;
		}

		try {
			var point = new ol.Feature(new ol.geom.Circle(center, _Buffer));
			point.setProperties({
				"isIgnore" : true,
				"isBuffer" : true,
				"gid" : _Gid,
				"style" : new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'red',
						width: 2
					}),
					fill: new ol.style.Fill({
						color: "rgba(255, 0, 0, 0.1)"
					}),
					image: new ol.style.Circle({
						radius: 500,
						width: 2
					})
				})
			});
			point.setStyle(point.getProperties()["style"]);

			if(this.getVector()){
				this.getVector().getSource().addFeature(point);
			}
		} catch(e) {
			console.log("Feature 생성에 실패하었습니다. (중심점 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * Marker 심볼을 추가합니다.
	 *
	 * @param _Object - Array or ol.Feature
	 * @param _Gid - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addMarker : function(_Object, _Gid){

		var center = null;

		if(_Object instanceof Array){
			center = _Object;
		}else if(_Object instanceof ol.Feature){
			center = _Object.getGeometry().getCoordinates();
		}

		try {
			var point = new ol.Feature(new ol.geom.Point(center));
			point.setProperties({
				"isIgnore" : true,
				"isMarker" : true,
				"gid" : _Gid,
				"style" : new ol.style.Style({
					image: new ol.style.Circle({
						radius: 5,
						fill: new ol.style.Fill({
							color: 'rgba(255, 0, 0, 0.5)'
						}),
						stroke: new ol.style.Stroke({
							color: "red",
							width: 3
						})
					})
				})
			});
			point.setStyle(point.getProperties()["style"]);

			if(this.getVector()){
				this.getVector().getSource().addFeature(point);
			}
		} catch(e) {
			console.log("Feature 생성에 실패하었습니다. (중심점 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * 회전각도 심볼을 추가합니다.
	 *
	 * @param _Object - Array or ol.Feature
	 * @param _Gid - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addAngle : function(_Object, _Gid, _Angle){

		this.removeFeature(_Gid, "isAngle");

		var center = null;

		if(_Object instanceof Array){
			center = _Object;
		}else if(_Object instanceof ol.Feature){
			center = _Object.getGeometry().getCoordinates();
		}

		try {
			var point = new ol.Feature(new ol.geom.Point(center));
			point.setProperties({
				"isIgnore" : true,
				"isAngle" : true,
				"gid" : _Gid,
				"layer" : "asset_cctv",
				"style" : new ol.style.Style({
					image: new ol.style.Icon({
						src: '../res/sym/cctv/area2.png',
						rotation: Spatial.convertRadians(Number(_Angle)),
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						anchor: [0.5, 90],
						scale: 0.5
					}),
					zIndex: -1
				})
			});
			point.setStyle(point.getProperties()["style"]);

			if(this.getVector()){
				this.getVector().getSource().addFeature(point);
			}
		} catch(e) {
			console.log("Feature 생성에 실패하었습니다. (중심점 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * 장애 심볼을 추가합니다.
	 *
	 * @param _Object - Array or ol.Feature
	 * @param _Gid - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addError : function(_Object, _Gid, _Layer){

		var center = null;

		if(_Object instanceof Array){
			center = _Object;
		}else if(_Object instanceof ol.Feature){
			center = _Object.getGeometry().getCoordinates();
		}

		try {
			var point = new ol.Feature(new ol.geom.Point(center));
			point.setProperties({
				"isIgnore" : true,
				"isError" : true,
				"gid" : _Gid,
				"layer" : _Layer,
				"style" : new ol.style.Style({
					image: new ol.style.Icon({
						//crossOrigin: "anonymous",
						src: '../res/sym/cctv/error2.png'
					})
				})
			});
			/*point.setStyle(new ol.style.Style({
				image: new ol.style.RegularShape({
					fill: new ol.style.Fill({
						color: "red"
					}),
					stroke: new ol.style.Stroke({
						color: "red",
						width: 2
					}),
					points: 4,
					radius: 15,
					radius2: 0,
					angle: Math.PI / 4
				})
			}));*/

			point.setStyle(point.getProperties()["style"]);

			if(this.getVector()){
				this.getVector().getSource().addFeature(point);
			}
		} catch(e) {
			console.log("Feature 생성에 실패하었습니다. (중심점 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * 카메라가 바라보는 재생 방향 및 길이를 추가합니다.
	 *
	 * @param _StartObject - Array or ol.Feature
	 * @param _EndObject - Array or ol.Feature
	 * @param _Gid - String
	 * @param _PresetNo - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addPreset : function(_StartObject, _EndObject, _Gid, _PresetNo){

		var startCenter = null;
		var endCenter = null;

		if(_StartObject instanceof Array){
			startCenter = _StartObject;
		}else if(_StartObject instanceof ol.Feature){
			startCenter = _StartObject.getGeometry().getCoordinates();
		}

		if(_EndObject instanceof Array){
			endCenter = _EndObject;
		}else if(_EndObject instanceof ol.Feature){
			endCenter = _EndObject.getGeometry().getCoordinates();
		}

		try {
			var line = new ol.Feature(new ol.geom.LineString([startCenter, endCenter]))
			line.setProperties({
				"isIgnore" : true,
				"isPreset" : true,
				"gid" : _Gid
			});
			line.setStyle(new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: "#ffcc33",
					width: 2
				})
			}));

			var point = new ol.Feature(new ol.geom.Point(endCenter));
			point.setProperties({
				"isIgnore" : true,
				"isPreset" : true,
				"gid" : _Gid
			});
			point.setStyle(new ol.style.Style({
				image: new ol.style.Circle({
					radius: 1,
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 255, 0.1)'
					}),
					stroke: new ol.style.Stroke({
						//color: 'rgba(240, 90 , 30, 1)',
						color: 'red',
						width: 3
					})
				}),
				text: new ol.style.Text({
					font: '20px Calibri,sans-serif',
					text: "" + _PresetNo,
					fill: new ol.style.Fill({
						color: 'red'
					}),
					stroke: new ol.style.Stroke({
						color: '#fff',
						width: 10
					})
				})
			}));

			if(this.getVector()){
				this.getVector().getSource().addFeature(line);
				this.getVector().getSource().addFeature(point);
			}


			/*var dx = endCenter[0] - startCenter[0];
			var dy = endCenter[1] - startCenter[1];
			var rotation = Math.atan2(dy, dx);

			var point = new ol.Feature(new ol.geom.Point(endCenter));
			point.setProperties({ "isIgnore" : true });
			point.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					src: "../res/img/arrow.png",
					anchor: [0.75, 0.5],
					rotateWithView: true,
					rotation: -rotation
				})
			}));

			this.vectorSource.addFeature(point);*/
		} catch(e) {
			console.error("Feature 생성에 실패하었습니다. (중심점 또는 스타일 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * 카메라 제어 심볼을 추가합니다.
	 *
	 * @param _Object - Array or ol.Feature
	 * @param _Gid - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addLock : function(_Object, _Gid, _Layer){

		var center = null;

		if(_Object instanceof Array){
			center = _Object;
		}else if(_Object instanceof ol.Feature){
			center = _Object.getGeometry().getCoordinates();
		}

		try {
			var point = new ol.Feature(new ol.geom.Point(center));
			point.setProperties({
				"isIgnore" : true,
				"isLock" : true,
				"gid" : _Gid,
				"layer" : _Layer
			});
			point.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					src: '../res/sym/cctv/lock2.png'
				})
			}));

			if(this.getVector()){
				this.getVector().getSource().addFeature(point);
			}
		} catch(e) {
			console.log("Feature 생성에 실패하었습니다. (중심점 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * 재생창과 심볼의 가이드 라인을 추가합니다.
	 *
	 * @param 필수) _Map - String
	 * @param 필수) _PlayerId - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addGuideline : function(_Map, _PlayerId){

		try {
			var source = this.getGuideLine().getSource();
			var features = source.getFeatures();

			var $player = $("#" + _PlayerId);
			var center = $player.dialog("option", "basePoint")
			var x = center[0];
			var y = center[1];

			var offset = $player.offset();
			var w = $player.outerWidth() / 2;
			var h = $player.outerHeight() / 2;


			var playerCenter = _Map.getCoordinateFromPixel([ offset.left + w, (offset.top - h) + 170 ]);

			var isExist = false;
			for (var i=0; i<features.length; i++) {
				var feature = features[i];
				if (feature.get("playerId") == _PlayerId) {
					feature.getGeometry().setCoordinates([ [ x, y ], playerCenter ]);
					isExist = true;
					break;
				}
			}

			if (isExist == false) {
				source.addFeature(new ol.Feature({
					geometry : new ol.geom.LineString([ [ x, y ], playerCenter ]),
					playerId : _PlayerId
				}));
			}
		} catch(e) {
			console.log("Feature 생성에 실패하었습니다. (중심점 확인 필요)");
			console.error(e);
		}

		return this;
	},

	/**
	 * 가이드 라인을 삭제합니다.
	 *
	 * @param 필수) _PlayerId - String
	 * @param 선택) _Callback - function
	 * @returns
	 */
	removeGuideFeature : function(_PlayerId, _Callback){
		var success = false;
		var feature = null;
		var features = this.getGuideLine().getSource().getFeatures();
		for(var i=0; i<features.length; i++){
			if(features[i].get("playerId") == _PlayerId){
				try {
					this.getGuideLine().getSource().removeFeature(features[i]);
					success = true;
				} catch(e) {
					console.error(e);
				}
			}
		}

		if(typeof _Callback == "function") _Callback();

		return success;
	},

	/**
	 * 지도상의 모든 가이드 라인을 다시 그립니다.
	 * 지도 이동 이벤트 발생 시 이동완료 후 가이드라인을 다시 그립니다.
	 *
	 * @param 필수) _Map - String
	 */
	redrawAllGuideline : function(_Map){

		try {
			var source = this.getGuideLine().getSource();
			var features = source.getFeatures();

			for (var i=0; i<features.length; i++) {
				var feature = features[i];
				var _PlayerId = feature.get("playerId");
				if (_PlayerId) {
					var $player = $("#" + _PlayerId);
					var center = $player.dialog("option", "basePoint")
					var x = center[0];
					var y = center[1];

					var offset = $player.offset();
					var w = $player.outerWidth() / 2;
					var h = $player.outerHeight() / 2;

					var playerCenter = _Map.getCoordinateFromPixel([ offset.left + w, (offset.top - h) + 170 ]);

					feature.getGeometry().setCoordinates([ [ x, y ], playerCenter ]);
				}
			}

		} catch(e) {
			console.log("Feature를 다시 그리는데 실패하였습니다.");
			console.error(e);
		}

	}
}