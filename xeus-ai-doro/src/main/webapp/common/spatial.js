/**
 * <pre>
 * 공간정보 함수 객체입니다.
 *
 * @author 이주영
 * </pre>
 */
if(window.Spatial == null) var Spatial = {

	/**
	 * <pre>
	 * 지도 객체의 Extent 값을 리턴합니다.
	 *
	 * 필수) Map - 지도객체
	 * </pre>
	 */
	getExtent : function(Map){
		return Map.getView().calculateExtent(Map.getSize());
	},

	/**
	 * <pre>
	 * 지도 객체의 중심좌표를 위경도 좌표로 변환하게 리턴합니다.
	 *
	 * 필수) Map - 지도객체
	 * </pre>
	 */
	convertCenterToLonLat : function(Map){
		return ol.proj.transform(Map.getView().getCenter(), Map.getView().getProjection().getCode(), "EPSG:4326");
	},

	/**
	 * <pre>
	 * 지도 객체의 중심좌표를 TM 좌표로 변환하게 리턴합니다.
	 *
	 * 필수) Map - 지도객체
	 * </pre>
	 */
	convertCenterToTm : function(Map){
		return ol.proj.transform(Map.getView().getCenter(), Map.getView().getProjection().getCode(), "EPSG:5186");
	},

	/**
	 * <pre>
	 * 주어진 좌표계를 통해 변경합니다.
	 *
	 * 필수) xy - XY(Array)
	 * 필수) b_epsg - 소스 좌표계(String)
	 * 필수) t_epsg - 타켓 좌표계(String)
	 * </pre>
	 */
	convertProjection : function(xy, b_epsg, t_epsg){
		return ol.proj.transform(xy, b_epsg, t_epsg);
	},

	/**
	 * <pre>
	 * Pulse 애니메이션입니다.
	 *
	 * <b style="color:red;">GMXMAP 객체로 이동되어 현재 사용되지 않습니다.</b>
	 * </pre>
	 *
	 * @Deprecated
	 */
	animateInterval : null,
	stopInterval : function(){
		if(this.animateInterval != null){
			clearInterval(this.animateInterval);
			this.animateInterval = null;
		}
	},
	addCicleAnimate : function(map, feature){
		var duration = 1500;
		var start = new Date().getTime();
		var listenerKey;

		function animate(event) {
			var vectorContext = event.vectorContext;
			var frameState = event.frameState;
			var flashGeom = feature.getGeometry().clone();
			var elapsed = frameState.time - start;
			var elapsedRatio = elapsed / duration;
			var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
			var opacity = ol.easing.easeOut(1 - elapsedRatio);

			var style = new ol.style.Style({
				image: new ol.style.Circle({
					radius: radius,
					snapToPixel: false,
					stroke: new ol.style.Stroke({
						color: 'rgba(255, 0, 0, ' + opacity + ')',
						width: 0.25 + opacity
					})
				})
			});

			vectorContext.setStyle(style);
			vectorContext.drawGeometry(flashGeom);
			if (elapsed > duration) {
				ol.Observable.unByKey(listenerKey);
				return;
			}
			map.render();
		}

		listenerKey = map.on('postcompose', animate);

	},

	/**
	 * <pre>
	 * 경위도를 도분초 형식으로 변환합니다.
	 *
	 * 필수) deg - 경도 또는 위도 (Number)
	 *
	 * @return 도분초 문자열
	 * </pre>
	 */
	convertDegToDMS : function(deg){
		var d = Math.floor (deg);
		var minfloat = (deg-d)*60;
		var m = Math.floor(minfloat);
		var secfloat = (minfloat-m)*60;
		//var s = Math.round(secfloat);
		var s = secfloat.toFixed(4);
		/*if(s == 60){
			m++;
			s = 0;
		}
		if(m == 60){
			d++;
			m = 0;
		}*/
		return ("" + d + "도 " + m + "분 " + s + "초");
	},

	/**
	 * <pre>
	 * 도분초를 경위도 형식으로 변환합니다.
	 *
	 * 필수) d - 도 (Number)
	 * 필수) m - 분 (Number)
	 * 필수) s - 초 (Number)
	 *
	 * @return 경위도 Number
	 * </pre>
	 */
	convertDMSToDeg : function(d, m, s){
		var deg = Number(d) + (Number(m)/60.0) + (Number(s)/3600.0);
		return deg;
	},

	/**
	 * <pre>
	 * 위경도를 기상청 그리드로 변환합니다.
	 *
	 * 필수) lat - 위도 (Number)
	 * 필수) lon - 경도 (Number)
	 *
	 * @return rs - 파라미터 및 그리드 정보 (Object)
	 * </pre>
	 */
	convertDfsToXY : function(lat, lon){
		var RE = 6371.00877; // 지구 반경(km)
		var GRID = 5.0; // 격자 간격(km)
		var SLAT1 = 30.0; // 투영 위도1(degree)
		var SLAT2 = 60.0; // 투영 위도2(degree)
		var OLON = 126.0; // 기준점 경도(degree)
		var OLAT = 38.0; // 기준점 위도(degree)
		var XO = 43; // 기준점 X좌표(GRID)
		var YO = 136; // 기1준점 Y좌표(GRID)

		var DEGRAD = Math.PI / 180.0;
		var RADDEG = 180.0 / Math.PI;

		var re = RE / GRID;
		var slat1 = SLAT1 * DEGRAD;
		var slat2 = SLAT2 * DEGRAD;
		var olon = OLON * DEGRAD;
		var olat = OLAT * DEGRAD;

		var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
			sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
		var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
			sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
		var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
			ro = re * sf / Math.pow(ro, sn);

		var rs = {};
			rs['lat'] = lat;
			rs['lng'] = lon;
		var ra = Math.tan(Math.PI * 0.25 + (lat) * DEGRAD * 0.5);
			ra = re * sf / Math.pow(ra, sn);
		var theta = lon * DEGRAD - olon;
		if (theta > Math.PI) theta -= 2.0 * Math.PI;
		if (theta < -Math.PI) theta += 2.0 * Math.PI;
		theta *= sn;

		rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
		rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

		return rs;
	},

	/**
	 * <pre>
	 * 주소를 이용하여 경위도를 받아옵니다.
	 *
	 * 필수) addr (String)
	 *
	 * </pre>
	 */
	convertAddrToXY : function(addr, limit, offset){
		if(!_common.utils.isNullAndEmpty(_SITE_NAME_)) addr = _SITE_NAME_ + " " + addr;

		var result = "";

		if(!_common.utils.isNumber(limit)) limit = 15;
		if(!_common.utils.isNumber(offset)) offset = 1;

		var sendURL = "https://dapi.kakao.com/v2/local/search/address.json";
		var param = {
			url : null,
			query : addr,
			size : limit,
			page : offset
		}

		param.url = "https://dapi.kakao.com/v2/local/search/address.json";
		if(_IS_PROXY_) sendURL = _PROXY_API_DATA_URL_;

		$.ajax({
			type : "GET",
			url : sendURL,
			dataType : "json",
			data : param,
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length == 0){
					result = "error";
				}else{
					//result = [Number(json.documents[0].x), Number(json.documents[0].y)];
					result = json;
					result["isAddress"] = true;
				}
			}
		});

		if(result == "error"){

			param.url = "https://dapi.kakao.com/v2/local/search/keyword.json";
			if(!_IS_PROXY_) sendURL = "https://dapi.kakao.com/v2/local/search/keyword.json";

			$.ajax({
				type : "GET",
				url : sendURL,
				dataType : "json",
				data : param,
				async : false,
				beforeSend : function(xhr){
					xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
				},
				success : function(json){
					if(json.documents.length == 0){
						result = "error";
					}else{
						//result = [Number(json.documents[0].x), Number(json.documents[0].y)];
						result = json;
						result["isAddress"] = false;
					}
				}
			});
		}

		return result;
	},

	/**
	 * <pre>
	 * 주소를 이용하여 경위도를 받아옵니다.
	 *
	 * 필수) addr (String)
	 *
	 * </pre>
	 */
	convertXYToAddr : function(x, y){
		var result = "";

		var sendURL = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
		var param = {
			url : null,
			input_coord : "WGS84",
			x : x,
			y : y
		}

		param.url = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
		if(_IS_PROXY_) sendURL = _PROXY_API_DATA_URL_;

		$.ajax({
			type : "GET",
			url : sendURL,
			dataType : "json",
			data : param,
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length == 0){
					result = "error";
				}else{
					result = json.documents[0].address.address_name;
				}
			}
		});

		return result;
	},

	/**
	 * <pre>
	 * xy를 이용하여 모든 정보를 리턴합니다.
	 *
	 * 필수) addr (String)
	 * 선택
	 *
	 * </pre>
	 */
	convertXYToAllInfo : function(x, y){

		var result = "";

		var sendURL = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
		var param = {
			url : null,
			input_coord : "WGS84",
			x : x,
			y : y
		}

		param.url = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
		if(_IS_PROXY_) sendURL = _PROXY_API_DATA_URL_;

		$.ajax({
			type : "GET",
			url : sendURL,
			dataType : "json",
			data : param,
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length == 0){
					result = null;
				}else{
					result = json;
				}
			}
		});

		return result;
	},

	/**
	 * <pre>
	 * xy를 이용하여 주소를 받아옵니다.
	 *
	 * 필수) addr (String)
	 * 선택
	 *
	 * </pre>
	 */
	convertXYToJibun : function(x, y, returnObject){

		var result = "";

		var sendURL = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
		var param = {
			url : null,
			input_coord : "WGS84",
			x : x,
			y : y
		}

		param.url = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
		if(_IS_PROXY_) sendURL = _PROXY_API_DATA_URL_;

		$.ajax({
			type : "GET",
			url : sendURL,
			dataType : "json",
			data : param,
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length == 0){
					result = "error";
				}else{
					result = json.documents[0].address.main_address_no;
					if(!_common.utils.isNullAndEmpty(json.documents[0].address.sub_address_no)){
						result += "-" + json.documents[0].address.sub_address_no;
					}

					if(returnObject){
						result = {};
						var jibun = json.documents[0].address.main_address_no;
						if(!_common.utils.isNullAndEmpty(json.documents[0].address.sub_address_no)){
							jibun += "-" + json.documents[0].address.sub_address_no;
						}
						result["jibun"] = jibun;
						result["bjd"] = json.documents[0].address.region_3depth_name;
						result["san"] = "";
						if(json.documents[0].address.mountain_yn == "Y") result["san"] = "산";
					}
				}
			}
		});
		return result;
	},

	/**
	 * <pre>
	 * 주소를 이용하여 행정동 받아옵니다.
	 *
	 * 필수) addr (String)
	 *
	 * </pre>
	 */
	convertXYToHJD : function(x, y){

		var result = "";

		var sendURL = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";
		var param = {
			url : null,
			input_coord : "WGS84",
			x : x,
			y : y
		}

		param.url = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";
		if(_IS_PROXY_) sendURL = _PROXY_API_DATA_URL_;

		$.ajax({
			type : "GET",
			url : sendURL,
			dataType : "json",
			data : param,
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length == 0){
					result = "error";
				}else{
					for(var i=0; i<json.documents.length; i++){
						if(json.documents[i].region_type == "H"){
							result = json.documents[i].region_3depth_name;
							break;
						}
					}
				}
			}
		});
		return result;
	},

	/**
	 * <pre>
	 * 키워드를 이용하여 경위도를 받아옵니다.
	 *
	 * 필수) addr (String)
	 *
	 * </pre>
	 */
	convertKeywordToAddr : function(query){
		if(!query.contains("춘천시")) query = "춘천시 " + query;

		var result = "";
		$.ajax({
			type : "GET",
			url : Proxy + "https://dapi.kakao.com/v2/local/search/keyword.json",
			dataType : "json",
			data : {
				query : query
			},
			async : false,
			beforeSend : function(xhr){
				xhr.setRequestHeader("Authorization", "KakaoAK 892c2cad01a8701f993c3a5dd4b2bdda");
			},
			success : function(json){
				if(json.documents.length == 0){
					result = "error";
				}else{
					result = [Number(json.documents[0].x), Number(json.documents[0].y)];
				}
			}
		});
		return result;
	},

	/**
	 * <pre>
	 * TM > LonLat 변환하여 각도를 구합니다.
	 * </pre>
	 *
	 * @param startTm - TM Array
	 * @param endTm - TM Array
	 * @returns
	 */
	getAngle : function(startTm, endTm){

		var startLonLat = Spatial.convertProjection(startTm, "EPSG:5186", "EPSG:4326");
		var endLonLat = Spatial.convertProjection(endTm, "EPSG:5186", "EPSG:4326");

		var startLat = startLonLat[1];
		var startLon = startLonLat[0];
		var endLat = endLonLat[1];
		var endLon = endLonLat[0];

		// 현재 위치 : 위도나 경도는 지구 중심을 기반으로 하는 각도이기 때문에 라디안 각도로 변환한다.
		var curLatRadian = startLat * (3.141592 / 180);
		var curLonRadian = startLon * (3.141592 / 180);

	    // 목표 위치 : 위도나 경도는 지구 중심을 기반으로 하는 각도이기 때문에 라디안 각도로 변환한다.
		var destLatRadian = endLat * (3.141592 / 180);
		var destLonRadian = endLon * (3.141592 / 180);

	    // radian distance
		var radianDistance = 0;
		radianDistance = Math.acos(Math.sin(curLatRadian) * Math.sin(destLatRadian) + Math.cos(curLatRadian) * Math.cos(destLatRadian) * Math.cos(curLonRadian - destLonRadian));

	    // 목적지 이동 방향을 구한다.(현재 좌표에서 다음 좌표로 이동하기 위해서는 방향을 설정해야 한다. 라디안값이다.
		var radianBearing = Math.acos((Math.sin(destLatRadian) - Math.sin(curLatRadian) * Math.cos(radianDistance)) / (Math.cos(curLatRadian) * Math.sin(radianDistance)));
		// acos의 인수로 주어지는 x는 360분법의 각도가 아닌 radian(호도)값이다.

		var trueBearing = 0;
		if(Math.sin(destLonRadian - curLonRadian) < 0){
			trueBearing = radianBearing * (180 / 3.141592);
			trueBearing = 360 - trueBearing;
		}else{
			trueBearing = radianBearing * (180 / 3.141592);
		}

		return parseInt(trueBearing);
	},

	/**
	 * <pre>
	 * Degrees 값을 Radians 로 변경합니다.
	 * </pre>
	 *
	 * @param degrees - Number
	 * @returns {Number}
	 */
	convertRadians : function(degrees){
		return degrees * Math.PI / 180;
	},

	/**
	 * <pre>
	 * Radians 값을 Degrees 로 변경합니다.
	 * </pre>
	 *
	 * @param radians - Number
	 * @returns {Number}
	 */
	convertDegrees : function(radians){
		return radians * 180 / Math.PI;
	},

	/**
	 * <pre>
	 * 주어진 Extent 값을 이용하여 GRID Feature (Polygon) 를 생성합니다.
	 * </pre>
	 *
	 * @param _Extent - Array(Extent)
	 * @param _GridSize - Number
	 *
	 * @returns {Array} - features
	 */
	generateGrid : function(_Extent, _GridSize){
		var result = new Array();

		var bottomLeftCoord = ol.extent.getBottomLeft(_Extent);
		var topLeftCoord = ol.extent.getTopLeft(_Extent);
		var topRightCoord = ol.extent.getTopRight(_Extent);

		var gridWidth = topRightCoord[0] - topLeftCoord[0];
		var gridHeight = bottomLeftCoord[1] - topLeftCoord[1];

		var colWidth = gridWidth / _GridSize;
		var rowHeight = gridHeight / _GridSize;

		var idx = 1;
		for(var col = 0; col<_GridSize; col++){

			var xColCoord = [topLeftCoord[0] + colWidth, topLeftCoord[1]];
			var yColCoord = [topLeftCoord[0], topLeftCoord[1] + rowHeight];

			for(var row = 0; row<_GridSize; row++){

				var boundingExtent = ol.extent.boundingExtent([
   					[ xColCoord[0], xColCoord[1] ],
   					[ yColCoord[0] + colWidth, yColCoord[1] ]
   				]);

				if((idx - 1) === (col * _GridSize)){
					var firtXColCoord = [topLeftCoord[0], topLeftCoord[1]];
					var firstYColCoord = [topLeftCoord[0], topLeftCoord[1] + rowHeight];

					boundingExtent = ol.extent.boundingExtent([
						[ firtXColCoord[0], firtXColCoord[1] ],
						[ firstYColCoord[0] + colWidth, firstYColCoord[1] ]
					]);
				}

				var polygon = ol.geom.Polygon.fromExtent(boundingExtent);
				var feature = new ol.Feature(polygon);
				feature.setStyle(new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: "red",//rgb(62,139,177)
						width: 2
					}),
					fill: new ol.style.Fill({
						//color : "rgba(0, 0, 0, 0.2)"
						color : "rgba(0, 0, 0, 0)"
					}),
					text: new ol.style.Text({
						font: "15px Calibri,sans-serif",
						text: String(idx),
						fill: new ol.style.Fill({
							color: "black"
						}),
						stroke: new ol.style.Stroke({
							color: "white",
							width: 3
						})
					})
				}));
				feature.setId("_GRID" + idx + "_");
				feature.setProperties({ "index" : idx, "extent" : boundingExtent });

				result.push(feature);

    			idx++;

    			xColCoord[0] = xColCoord[0] + colWidth;
    			yColCoord[0] = yColCoord[0] + colWidth;

	    		xColCoord = [topLeftCoord[0] + colWidth, topLeftCoord[1]];
	    		yColCoord = [topLeftCoord[0], topLeftCoord[1] + rowHeight];

	    		colWidth = colWidth + (gridWidth / _GridSize);
	    	}

	    	colWidth = gridWidth / _GridSize;

	    	topLeftCoord[1] = topLeftCoord[1] + rowHeight;
	    }

		return result;
	}

}