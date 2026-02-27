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
if(window.xeusSymbolInfraCctv == null) var xeusSymbolInfraCctv = {

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
		return GMXMAP.getLayerByName("xeusSymbolInfraCctv");
	},

	/**
	 * 심볼용 벡터를 생성하여 지도에 추가합니다.
	 *
	 * @param 선택) _Map - ol.Map
	 * @returns {___anonymous_xeusSymbolInfraCctv}
	 */
	createVector : function(_Map){
		this.vectorSource = new ol.source.Vector();
		this.vector = new ol.layer.Vector({
			name: "xeusSymbolInfraCctv",
			source: xeusSymbolInfraCctv.vectorSource,
			zIndex: 7
		});

		if(_Map instanceof ol.Map){
			_Map.addLayer(vector);
		}else{
			return this.vector;
		}
	},

	/**
	 * Gid 값으로 등록된 Feature 객체를 찾아 리턴합니다.
	 *
	 * @param _Gid - Number
	 * @returns
	 */
	findFeature : function(_Gid){
		var feature = null;
		if(this.getVector()){
			var features = this.getVector().getSource().getFeatures();
			for(var i=0; i<features.length; i++){
				if(features[i].get("gid") == Number(_Gid)){
					feature = features[i];
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
	 * CCTV 명칭을 추가합니다.
	 *
	 * @param _Object - Array or ol.Feature
	 * @param _Gid - String
	 * @returns {___anonymous_xeusSymbol}
	 */
	addText : function(_Object, _Gid, _Text){

		var center = null;

		if(_Object instanceof Array){
			center = _Object;
		}else if(_Object instanceof ol.Feature){
			center = _Object.getGeometry().getCoordinates();
		}

		try {
			var point = new ol.Feature(new ol.geom.Point(center));
			point.setStyle(
				new ol.style.Style({
					text: new ol.style.Text({
						font: 'bold 16px Calibri,sans-serif',
						textBaseline: "bottom",
						offsetY: 33,
						text: _Text,
						fill: new ol.style.Fill({
							color: '#000'
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 3
						})
					})
				})
			);

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
	 * 모든 피쳐를 삭제합니다.
	 */
	clear : function(){
		var chkVector = this.getVector();
		if(chkVector) chkVector.getSource().clear();
	}

}