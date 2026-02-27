/**
 * <pre>
 * NGII E Map 영상을 Openlayers 3 Tile 객체로 리턴합니다.
 * 만약 Map 객체를 파라미터로 포함 할 경우 해당 맵 객체에 직접 레이어를 추가합니다.
 * 그렇지 않을 경우는 ol.layer.Tile 객체를(XYZ) 리턴합니다.
 *
 * 타일 생성 시, 각종 옵션을 파라미터로 전달 할 수 있고 returns 옵션이 true 일 경우
 * 지도에 추가된 Tile 객체를 리턴 받을 수 있습니다.
 *
 * 선택) Map - 지도객체 (ol.Map)
 * 선택) Options - Tile 생성 옵션 (ol.layer.Tile)
 * 참고) Options 객체의 기본옵션은 다음과 같습니다.
 * Options = {
 * 		id      : 'DaumMap', // 등록될 레이어 ID   (String)
 *      name    : 'DaumMap', // 등록될 레이어 NAME (String)
 *      visible : true,		 // 보이기 여부		  (boolean)
 *      zIndex  : 0,		 // zIndex		  (Number)
 *      returns : false		 // 생성 후 리턴 여부	  (boolean)
 * }
 *
 * @author 이주영
 * </pre>
 */
var eMap = function(){

	this.createLayer = function(layerInfo){
		/******** 바로 eMap 전국지도(2020) 설정 ********/
		var _newEMapOrigin = [ -200000.0, 4000000 ];
		var _newEMapProjection = new ol.proj.get('EPSG:5179');
		var _newEMapResolutions = [
					66846.720000000001, 33423.360000000001, 16711.68,
					8355.8400000000001, 4177.9200000000001, 2088.96,
					1044.48, 522.24000000000001, 261.12,
					130.56, 65.280000000000001, 32.640000000000001,
					16.32, 8.1600000000000001, 4.0800000000000001,
					2.04, 1.02, 0.51000000000000001, 0.255
				];

		var _OptionsContain = false;
//		var _DefualtOptions = {
//			id      : 'ngii_emap',
//			name    : '바로e맵2020',
//			failImg : '/img/noTile.png',
//			visible : false,
//			zIndex  : 0,
//			returns : false,
//			fullName: "ngii_emap",
//			group	: "배경지도",
//			fnGroup : "CMMN",
//			type	: "TMS",
//			state	: 'active'
//		};
//
//		if(Options != null && Options instanceof Object){
//			_OptionsContain = true;
//			for(var key in _DefualtOptions){
//				if(Options[key] == null){
//					Options[key] == _DefualtOptions[key];
//				}
//			}
//		}else{
//			Options = _DefualtOptions;
//		}


		var _ngiiLayer2020 = new ol.layer.Tile({
			id		: "ngii_emap",
			name	: layerInfo.lyrNm,
			visible : layerInfo.visibleYn,
//			zIndex  : layerInfo.zIndex,
			zIndex  : layerInfo.lyrZidx, //레이어 zIndex 오류 수정
			fullName: "ngii_emap",
			group	: layerInfo.grpNm,
			type	: "TMS",
			state	: "active",
			fnGroup : "CMMN",
			geomType: "T",
			shotcut : "<img class='shotcut' style='width: 30px; height: 20px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAADW0lEQVQ4T41US2/bRhicFd+k3k9aVeWkiI0YQYAAuaSn/IP+y557LlD00EMRFCiKIEETRLasyKpkWZZEyeJD4pIsdgWypBXE3YuE5e7ON9/MfOTNx58iPLBKvodaGKLUfsRPuus5nM0OpPgic1OQAUWvwLGWDz0J8n+Av9s6kPMFaMUa6NaFu7bgKk8h5tR7wCJUVYS99r4K7AXuw8Ade4NirQbFKPHHZsM+8s1nyOnNAwCjqMLzKIId/Srw7fJ6D0ypjyDyIRAJoigll1iLG4KEQuOI763GA8jVMw6akwtwnRWos0vO74E9BP9tHRSw8daglIJ8GPwWrbw5P8AKYIuB39fVXk6RE0SIzdeIAjt50LV3nCHTd+t5B+1PI9PQg7WyYH7TBbmzxpHnOxhan+AHW2x9B4qkg+laaHU4GNN1OZ2gfPpDAkoEA3JgYycYCHd3nOl8sYAoivBcB/WKecCWtbhab0FWlD1wFIRYexbG1iVCgeLYXkArNxIz2fMptPYrQNL4Y4qkYOtvMw+7tsOB600To8/nMBvdzHfWYraa5jH6vbcgVxfvI0a/1TIxnV5DxQC1vA6j0sroKhT2DBjTuNUKAAbP9lxvhtHlECdnL3HZe4dyqZy0nbl4s16h+/gMi/kY1PdBLs/f8RxXa21Mz39HWV4neWW6BjCgHb36Itj9Agb9PtfPWtzyInMQECLA5s5C0/yW7y1upzg+fgTyz7DHgZ3VBKXwKjMkfJdA7bzMMI0Zp9myAtj+ZHQB3Shgt/M4Q1XTud66VkDd7PAWswIkgYD89cevkUgoWvIsMySYrmrnNYiQQwySFu1LLbdmY1CiIF8oIaIhiJiDLBv82nh0wY1XKlZ5CjjjaPYmMyTivDJdY4D0L3Nz1lp7nVfLG6xXSzSPuhj2/wYNJbTbe2/ELY6nGpl9+jki9C4zJITKKSTjCNNxH6peRblWPWCdjlOSa9/F4GqCxyfP0fvwJ+q1JvRSnRfB/itqnk0LPmDIzdsfo3j4x2ZSas8wXy5RLDdwMxkir+ZQMU+4wWLANOM4Xt6W8ijFzmYuZuvm+jPXmpkqnmzEHv0SiYqWDAnZ/B6aoeP66hyiVuF6sceenD7N5DKtcTpmg957dJ/sDcmiE8coDc7a/S+eB/H0WeCEkwAAAABJRU5ErkJggg=='>",
			source : new ol.source.XYZ({
				projection : _newEMapProjection,
				tileUrlFunction : function(coordinate) {
					if (coordinate == null) {
						return "";
					}

					var z = coordinate[0] < 10 ? '0' + coordinate[0] : coordinate[0];
					var x = coordinate[1];
//					var y = -coordinate[2] - 1;
					var y = coordinate[2];

					//return "http://127.0.0.1:8080/emap/" + "L" + z + "/" + x + "/" + y + ".png"
					return "https://map.ngii.go.kr/openapi/Gettile.do?apikey=hbYfnWqF671afxusrVtcJQ&layer=korean_map&style=korean&tilematrixset=EPSG%3A5179&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=L"+z+"&TileCol="+x+"&TileRow="+y

				},
				tileGrid : new ol.tilegrid.TileGrid({
					origin : _newEMapOrigin,
					resolutions : _newEMapResolutions,
				})
			}),
		});

		return _ngiiLayer2020;
	}


	function endPath(path){
		if('/' != path.substring(path.length-1)) path += '/';
		return path;
	}

}