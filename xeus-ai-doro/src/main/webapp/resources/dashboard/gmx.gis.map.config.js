//Google
proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs');
proj4.defs('EPSG:900913', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs');

//UTM-K
proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
//proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');

//세계측지계 200000, 500000
proj4.defs('EPSG:5180', '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5181', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5182', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5183', '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:5184', '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

//세계측지계 200000, 600000
proj4.defs('EPSG:5185', '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs');
proj4.defs('EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs');
//proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs('EPSG:5187', '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs');
proj4.defs('EPSG:5188', '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs');

//오류보정된 Bessel
proj4.defs('EPSG:5173', '+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5174', '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5175', '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5176', '+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs('EPSG:5177', '+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
//proj4.defs('EPSG:5178', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
proj4.defs("EPSG:5178", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs");
ol.proj.proj4.register(proj4);
ol.INCHES_PER_UNIT = { 'inches' : 1.0, 'ft' : 12.0, 'mi' : 63360.0, 'm'  : 39.97, 'km' : 39370, 'dd' : 4374754, 'yd' : 36 };
ol.DOTS_PER_INCHES = 96; // or 72

/**
 * 지도 기본 설정입니다.
 *
 * @author 이주영
 */
var _SITE_NAME_ = "춘천시";
var _PROXY_ = "";
var _PROXY_API_DATA_URL_  = (_PROXY_ == "") ? "" : _PROXY_ + "/dmz";
var _PROXY_TILE_DATA_URL_ = (_PROXY_ == "") ? "" : _PROXY_ + "/dmz?url=";
var _IS_PROXY_ = false;

var _SET_ACTIVE_PROXY = function(isActive){
	if(isActive){
		_PROXY_ = "./GMT_proxy";
		_PROXY_API_DATA_URL_  = (_PROXY_ == "") ? "" : _PROXY_ + "/dmz";
		_PROXY_TILE_DATA_URL_ = (_PROXY_ == "") ? "" : _PROXY_ + "/dmz?url=";
		_IS_PROXY_ = true;
	}else{
		_PROXY_ = "";
		_PROXY_API_DATA_URL_  = (_PROXY_ == "") ? "" : _PROXY_ + "/dmz";
		_PROXY_TILE_DATA_URL_ = (_PROXY_ == "") ? "" : _PROXY_ + "/dmz?url=";
		_IS_PROXY_ = false;
	}
}

var _GMXMAP_DEF_CENTER_ = [202891.59999998985, 542683.6000008152];
var _GMXMAP_CENTER_ = [202891.59999998985, 542683.6000008152];
var _GMXMAP_EXTENT_ = [198216.992794221, 536547.406681193, 208471.440853575, 547344.881405761];

var _GMXMAP_DEF_ZOOM_ = 13;
var _GMXMAP_MIN_ZOOM_ = 9;
var _GMXMAP_MAX_ZOOM_ = 25;

(function(localStorage){
	if(localStorage){
		if(("mapSync" in localStorage) && (localStorage["mapSync"] === "true")){
			if(localStorage["GMXMAP@centerX"] && localStorage["GMXMAP@centerY"]){
				_GMXMAP_CENTER_ = [Number(localStorage["GMXMAP@centerX"]), Number(localStorage["GMXMAP@centerY"])];
			}
			if(localStorage["GMXMAP@zoom"]){
				_GMXMAP_DEF_ZOOM_ = localStorage["GMXMAP@zoom"];
			}
		}
	}
})(localStorage);