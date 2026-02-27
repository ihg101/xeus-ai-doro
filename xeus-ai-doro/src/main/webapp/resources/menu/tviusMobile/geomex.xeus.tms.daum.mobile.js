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
var DaumMap = function(Map, Options){

	this.createLayer = function(){
		var _Map = Map;
		var _Projection = new ol.proj.get('EPSG:5181');

		var _Origin = [ -30000, -60000 ];

		var _Resolutions = [ 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125 ];

		var _OptionsContain = false;
		var _DefualtOptions = {
			id      : 'daum_map',
			name    : '다음지도',
			failImg : '/img/noTile.png',
			visible : true,
			zIndex  : 0,
			returns : false,
			fullName: "naver_map",
			group	: "배경지도",
			fnGroup : "CMMN",
			type	: "TMS"
		};

		if(Options != null && Options instanceof Object){
			_OptionsContain = true;
			for(var key in _DefualtOptions){
				if(Options[key] == null){
					Options[key] == _DefualtOptions[key];
				}
			}
		}else{
			Options = _DefualtOptions;
		}

		var _TMSLayer = new ol.layer.Tile({
			id		: Options["id"],
			name	: Options["name"],
			visible : Options["visible"],
			zIndex  : Options["zIndex"],
			fullName: Options["fullName"],
			group	: Options["group"],
			fnGroup : Options["fnGroup"],
			type	: Options["type"],
			source  : new ol.source.XYZ({
				projection: _Projection,
				tileUrlFunction: function (coordinate) {
					if (!coordinate) { return Options["failImg"]; }

					var level = 14 - coordinate[0];
					var row = coordinate[2];
					var col = coordinate[1];

					var subdomain = ((level + col) % 4) + 1;

					return "http://map" + subdomain + ".daumcdn.net/map_2d/1909dms/L" + level + "/" + row + "/" + col + ".png";
				},
				tileGrid: new ol.tilegrid.TileGrid({
					origin: _Origin,
					resolutions: _Resolutions
				})
			})
		});

		return _TMSLayer;
	}

}