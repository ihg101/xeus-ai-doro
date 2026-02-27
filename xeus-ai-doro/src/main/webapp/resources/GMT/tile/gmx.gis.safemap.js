/**
 * <pre>
 * 생활안전지도를 ol.layer.Tile 객체로(XYZ) 리턴합니다.
 *
 * @author 민동현
 * </pre>
 */
var safeMap = function(){

	var _Projection = new ol.proj.get("EPSG:5181");
	var _Origin = [ -30000, -60000 ];
	var _Resolutions = [ 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125 ];



	this.createWmsLayer = function(layerInfo, style){

		var layer = layerInfo.tblId;
		if(style == null || style == undefined){
			style = "";
		}


		var layerNm = layerInfo.lyrNm;

		var serverUrl;
		if(_PROXY_TILE_DATA_URL_ == "" || _PROXY_TILE_DATA_URL_ == null || _PROXY_TILE_DATA_URL_ == undefined){
			serverUrl = "http://www.safemap.go.kr/sm/apis.do?apikey=WP97SX6N-WP97-WP97-WP97-WP97SX6NMJ";
		}else{
			serverUrl = _PROXY_TILE_DATA_URL_ + "http://www.safemap.go.kr/sm/apis.do&apikey=WP97SX6N-WP97-WP97-WP97-WP97SX6NMJ";
		}


		return new ol.layer.Tile({
			id		: layer,
			name	: layerNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			maxZoom : 19.333333333333343,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAADW0lEQVQ4T41US2/bRhicFd+k3k9aVeWkiI0YQYAAuaSn/IP+y557LlD00EMRFCiKIEETRLasyKpkWZZEyeJD4pIsdgWypBXE3YuE5e7ON9/MfOTNx58iPLBKvodaGKLUfsRPuus5nM0OpPgic1OQAUWvwLGWDz0J8n+Av9s6kPMFaMUa6NaFu7bgKk8h5tR7wCJUVYS99r4K7AXuw8Ade4NirQbFKPHHZsM+8s1nyOnNAwCjqMLzKIId/Srw7fJ6D0ypjyDyIRAJoigll1iLG4KEQuOI763GA8jVMw6akwtwnRWos0vO74E9BP9tHRSw8daglIJ8GPwWrbw5P8AKYIuB39fVXk6RE0SIzdeIAjt50LV3nCHTd+t5B+1PI9PQg7WyYH7TBbmzxpHnOxhan+AHW2x9B4qkg+laaHU4GNN1OZ2gfPpDAkoEA3JgYycYCHd3nOl8sYAoivBcB/WKecCWtbhab0FWlD1wFIRYexbG1iVCgeLYXkArNxIz2fMptPYrQNL4Y4qkYOtvMw+7tsOB600To8/nMBvdzHfWYraa5jH6vbcgVxfvI0a/1TIxnV5DxQC1vA6j0sroKhT2DBjTuNUKAAbP9lxvhtHlECdnL3HZe4dyqZy0nbl4s16h+/gMi/kY1PdBLs/f8RxXa21Mz39HWV4neWW6BjCgHb36Itj9Agb9PtfPWtzyInMQECLA5s5C0/yW7y1upzg+fgTyz7DHgZ3VBKXwKjMkfJdA7bzMMI0Zp9myAtj+ZHQB3Shgt/M4Q1XTud66VkDd7PAWswIkgYD89cevkUgoWvIsMySYrmrnNYiQQwySFu1LLbdmY1CiIF8oIaIhiJiDLBv82nh0wY1XKlZ5CjjjaPYmMyTivDJdY4D0L3Nz1lp7nVfLG6xXSzSPuhj2/wYNJbTbe2/ELY6nGpl9+jki9C4zJITKKSTjCNNxH6peRblWPWCdjlOSa9/F4GqCxyfP0fvwJ+q1JvRSnRfB/itqnk0LPmDIzdsfo3j4x2ZSas8wXy5RLDdwMxkir+ZQMU+4wWLANOM4Xt6W8ijFzmYuZuvm+jPXmpkqnmzEHv0SiYqWDAnZ/B6aoeP66hyiVuF6sceenD7N5DKtcTpmg957dJ/sDcmiE8coDc7a/S+eB/H0WeCEkwAAAABJRU5ErkJggg=='>",
			source  : new ol.source.TileWMS({
	    		url: serverUrl,
	    		params: {
	    			"LAYERS"  : layer,
	    			"STYLES"  : style,
	    			"VERSION" : "1.0.0",
	    			"TILED"   : true
	    		},
	    		serverType: "geoserver"
	    	})
		});


	}

	this.createWmsLayerWithStyle = function(layerInfo, layer, style){

		var layerId = layerInfo.tblId;
		if(style == null || style == undefined){
			style = "";
		}


		var layerNm = layerInfo.lyrNm;
		var serverUrl = _PROXY_TILE_DATA_URL_ + "http://www.safemap.go.kr/sm/apis.do?apikey=WP97SX6N-WP97-WP97-WP97-WP97SX6NMJ";


		return new ol.layer.Tile({
			id		: layerId,
			name	: layerNm,
			visible : layerInfo.visibleYn,
			zIndex  : layerInfo.lyrZidx,
			group	: layerInfo.grpNm,
			maxZoom : 19.333333333333343,
			schema  : "tms",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAADW0lEQVQ4T41US2/bRhicFd+k3k9aVeWkiI0YQYAAuaSn/IP+y557LlD00EMRFCiKIEETRLasyKpkWZZEyeJD4pIsdgWypBXE3YuE5e7ON9/MfOTNx58iPLBKvodaGKLUfsRPuus5nM0OpPgic1OQAUWvwLGWDz0J8n+Av9s6kPMFaMUa6NaFu7bgKk8h5tR7wCJUVYS99r4K7AXuw8Ade4NirQbFKPHHZsM+8s1nyOnNAwCjqMLzKIId/Srw7fJ6D0ypjyDyIRAJoigll1iLG4KEQuOI763GA8jVMw6akwtwnRWos0vO74E9BP9tHRSw8daglIJ8GPwWrbw5P8AKYIuB39fVXk6RE0SIzdeIAjt50LV3nCHTd+t5B+1PI9PQg7WyYH7TBbmzxpHnOxhan+AHW2x9B4qkg+laaHU4GNN1OZ2gfPpDAkoEA3JgYycYCHd3nOl8sYAoivBcB/WKecCWtbhab0FWlD1wFIRYexbG1iVCgeLYXkArNxIz2fMptPYrQNL4Y4qkYOtvMw+7tsOB600To8/nMBvdzHfWYraa5jH6vbcgVxfvI0a/1TIxnV5DxQC1vA6j0sroKhT2DBjTuNUKAAbP9lxvhtHlECdnL3HZe4dyqZy0nbl4s16h+/gMi/kY1PdBLs/f8RxXa21Mz39HWV4neWW6BjCgHb36Itj9Agb9PtfPWtzyInMQECLA5s5C0/yW7y1upzg+fgTyz7DHgZ3VBKXwKjMkfJdA7bzMMI0Zp9myAtj+ZHQB3Shgt/M4Q1XTud66VkDd7PAWswIkgYD89cevkUgoWvIsMySYrmrnNYiQQwySFu1LLbdmY1CiIF8oIaIhiJiDLBv82nh0wY1XKlZ5CjjjaPYmMyTivDJdY4D0L3Nz1lp7nVfLG6xXSzSPuhj2/wYNJbTbe2/ELY6nGpl9+jki9C4zJITKKSTjCNNxH6peRblWPWCdjlOSa9/F4GqCxyfP0fvwJ+q1JvRSnRfB/itqnk0LPmDIzdsfo3j4x2ZSas8wXy5RLDdwMxkir+ZQMU+4wWLANOM4Xt6W8ijFzmYuZuvm+jPXmpkqnmzEHv0SiYqWDAnZ/B6aoeP66hyiVuF6sceenD7N5DKtcTpmg957dJ/sDcmiE8coDc7a/S+eB/H0WeCEkwAAAABJRU5ErkJggg=='>",
			source  : new ol.source.TileWMS({
	    		url: serverUrl,
	    		params: {
	    			"LAYERS"  : layer,
	    			"STYLES"  : style,
	    			"VERSION" : "1.0.0",
	    			"TILED"   : true
	    		},
	    		serverType: "geoserver"
	    	})
		});


	}

};