/**
 * <pre>
 * 공간정보 함수 객체입니다.
 * - turf.js의 의존됩니다.
 * - turf.js는 epsg:5186을 지원하지 않습니다. 사용시 꼭 참고 부탁드립니다.
 *   * 모든 계산은 epsg:4326으로 처리
 *   
 * @author ahj
 * </pre>
 */
if(window.SpatialTurf == null) var SpatialTurf = {
		
	/**
	 * 포인트 객체 간 거리를 가져온다.
	 *  - 현재는 "원"으로만 구현되어있습니다.
	 *  
	 * @param * coord 기준 점 
	 * @param * layers 레이어
	 * @param * dist 반경 단위 : m
	 *  
	 * @retrun m 단위
	 */
	Intersect : function(coord, layers, dist, callBack) {
		
		if ( !coord || !layers || !dist ) return false;
		
		var longLat = Spatial.convertProjection(coord, "EPSG:5186", "EPSG:4326");
				
		var point = turf.point(longLat);
	    var buffer = turf.buffer(point, dist/1000);
	    var list = buffer.geometry.coordinates[0];
	    
	    for ( var index in list ) {
	    	
	    	var bufferCoord = list[index];
	    	
	    	buffer.geometry.coordinates[0][index] = Spatial.convertProjection(bufferCoord, "EPSG:4326", "EPSG:5186");
	    }
	    
	    var isContains = false;
	    var containsLayers = [];
	    
	    for(var layerIndex in layers){
	    	var layer = layers[layerIndex];
			var features = layer.getSource().getFeatures();

			for(var featureIndex in features){
				
				var featureItem = features[featureIndex];
				var featureGeom = featureItem.getGeometry();
				var featureGeomType = featureGeom.getType();
				var featureGeomCoord = featureGeom.getCoordinates();
				
				if("turf" in window){
					
					var turfFeature = SpatialTurf.convertTurfFeature(featureGeomType, featureGeomCoord);

					if(turf.booleanIntersects(buffer, turfFeature)){
						containsLayers.push(layer);
					}
					
				} else {
					if(ol.extent.containsExtent(buffer.getExtent(), feature.getGeometry().getExtent())){
						containsLayers.push(layer);
					}
				}
			}
	    }
	    if ( typeof callBack === 'function' ) callBack(containsLayers, buffer);
	    return containsLayers;
	},
	

	/**
	 * turf feature로 변환한다.
	 *  - OL feature와 turf.js feature는 전혀 다른 객체이므로 참고.
	 *
	 *  @param type ol...feature.getGeometry().getType()
	 *  @param coord ol...feature.getGeometry().getCoordinates()
	 *  
	 */
	convertTurfFeature : function(type, coord) {
		
		if( !"turf" in window ) return null;
		
		if(type.contains("Point")) { 
			turfFeature = turf.point(coord);
		}
		
		if(type.contains("Line")){
			if(type.contains("Multi")){
				turfFeature = turf.multiLineString(coord);
			}else{
				turfFeature = turf.lineString(coord);
			}
		}
		
		if(type.contains("Polygon")){
			if(type.contains("Multi")){
				turfFeature = turf.multiPolygon(coord);
			}else{
				turfFeature = turf.polygon(coord);
			}
		}
		
		return turfFeature;
	},
	
	/**
	 * 포인트 객체 간 거리를 가져온다.
	 *  - OL에서도 제공되는 것이 있음.
	 * @param from 시작 
	 * @param to 끝
	 *  
	 * @retrun m 단위
	 */
	_getDistance : function(from, to) {
		
		var turfFrom = turf.point(from);
	    var turfTo = turf.point(to);
	       
	    return turf.distance(turfFrom, turfTo) / 10;    
	},
}