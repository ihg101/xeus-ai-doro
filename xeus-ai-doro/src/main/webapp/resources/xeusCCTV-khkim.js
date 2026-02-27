// 클래스 namespace만들기.
if (window.geomex == null)
	var geomex = {}

if (geomex.xeus == null) {
	geomex.xeus = {}
}

geomex.xeus.CctvStyle = function(_opt) {
	this.id = _opt.id; // style id
	this.sym = _opt.sym; // 기본 심볼 스타일
	this.play = _opt.play; // video play시 스타일
	this.visible = _opt.visible; // 보이기 여부
};

geomex.xeus.CCTV = function(options) {
	var ctxPath = options.ctxPath;
	var mapService = options.mapService;
	var cctvLayer = mapService.getLayerByName(options.layer);
	var virtualMapBoundary = options.virtualBoundary;

	var map = mapService.getMap();

	var SYMBOLS = [ '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '99',
			'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8', 'X9', 'XX' ];

	var SYMSIZE = 40;

	var STYLES = {}; // cctv 스타일(기본, playing);

	// play되는 cctv 목록(_gid)기준
	// _geometry의 _gid를 사용하면 변경 가능성이 있으므로 고유키로 관리 되어야 함..
	// _player_dlg_ : videoDialog에 플레이 되는 cctv정보
	// _player_grid_ : videoGridPane에 플레이 되는 cctv정보
	var PLAY_LIST = {};

	// ntsc 320*240, 640*480
	this.SIZE = {
		width : 320,
		height : 240, // 창: 280
		minWidth : 200,
		minHeight : 150
	};

	var _self = this;

	// 마우스 move(click)시 겹칩된 cctv 목록을 보여주기 위한 cctv-overlay 생성
	var mapOverlay = _createMapOverlay();

	// openlayers interaction을 등록한다.
	// mouse move시 overlay보이기, click시 상세 cctv목록 보여주기
	map.addInteraction(new ol.interaction.Pointer({
		handleMoveEvent : function(evt) {
			var _type = mapOverlay.get('type');// ,'cctv_list');
			if (_type != 'cctv_detail_list') { // DetailList Dialog skip
				_showMapOverlay(evt);
			}
		},
		handleDownEvent : function(evt) {
			_self.closeMapOverlay(evt);
			_showMapOverlayDetailList(evt);
		},
		handleDragEvent : function(evt) {
			//console.log("handleDragEvent");
		},
		handleUpEvent : function(evt) {
			//console.log("handleUpEvent");
		}
	}));

	// CCTV 스타일을 생성한다.
	var _anchor = [ 0.5, 0.5 ];
	var _size = [ SYMSIZE, SYMSIZE ];
	for (x = 0; x < SYMBOLS.length; x++) {
		var symId = SYMBOLS[x] + '';
		STYLES[symId] = new geomex.xeus.CctvStyle({
			id : symId,
			sym : new ol.style.Style({
				image : new ol.style.Icon(({
					anchor : _anchor,
					size : _size,
					src : ctxPath + '/res/sym/cctv/' + symId + '.png'
				}))
			}),
			play : new ol.style.Style({
				image : new ol.style.Icon(({
					anchor : _anchor,
					size : _size,
					src : ctxPath + '/res/sym/cctv/' + symId + 'P.png'
				}))
			}),
			visible : true
		});
	}

	/**
	 * 심볼 스타일 배열을 리턴합니다.
	 */
	this.getStyle = function(){
		return STYLES;
	}

	/**
	 * 주어진 값을 통해 스타일을 설정합니다.
	 */
	this.setSymbolStyle = function(value){
		var thm = Layers.LayerTheme["asset_cctv"];
		for(var key in thm){
			STYLES[thm[key]].visible = false;
		}

		var array = value.split(",");
		for(var i=0; i<array.length; i++){
			var key = Layers.LayerTheme["asset_cctv"][array[i]];
			STYLES[key].visible = true;
		}

		return this;
	}

	// cctv 레이어에 styleFunction을 설정한다.
	// play중인 gid가 있는 경우 symbol을 갱신해야 한다.
	cctvLayer.setStyle(function(_feature) {
		var _code = _feature.get('symCode');
		// 플레이 목록이 없으면 기본 심볼로....
		if (Object.keys(PLAY_LIST).length == 0) {
			return (_code) ? STYLES[_code].sym : STYLES['99'].sym;
		}

		// Video Play 목록이 있다.
		var _cctvList = _feature.get('cctvList');
		var _size = _cctvList.length;
		for (var x = 0; x < _size; x++) {
			var _gid = _cctvList[x]['gid'];
			if (PLAY_LIST[_gid] != undefined) {
				return (_code) ? STYLES[_code].play : STYLES['99'].play;
			}
		}
		return (_code) ? STYLES[_code].sym : STYLES['99'].sym;
	});

	// visible된 style의 id배열을 얻어온다.
	// reload에서 visible된 cctv정보만 가져오기 위해 사용됨.
	function _getVisibleStyleIds() {
		var _len = Object.keys(STYLES).length;
		if (_len == 0) {
			return null;
		}
		var _codes = [];
		for ( var key in STYLES) {
			if (STYLES[key].visible == true) {
				_codes.push('\'' + key + '\'');
			}
		}
		return _codes;
	}

	// mouse over, click 시 보여줄 mapOverlay를 생성한다.
	function _createMapOverlay() {
		var _html = '<div id="cctv-overlay" class="cctv-overlay">';
		_html += '<a href="#" id="cctv-overlay-closer" class="cctv-overlay-closer"></a>';
		_html += '<div id="cctv-overlay-content"></div>';
		_html += '</div>';
		$(_html).appendTo(map.getTargetElement());
		//
		var overlay = new ol.Overlay(({
			element : $('#cctv-overlay')[0],
			offset : [ 0, -20 ],
			autoPan : true,
			autoPanAnimation : {
				duration : 250
			}
		}));

		map.addOverlay(overlay);
		// closer는 상세 목록에만 보여짐.
		$('#cctv-overlay-closer')[0].onclick = function() {
			_self.closeMapOverlay();
		}
		return overlay;
	}

	// CCTV mapOverlay 창을 닫는다.
	this.closeMapOverlay = function() {
		if (mapOverlay.getPosition() === undefined) {
			return;
		}
		mapOverlay.setPosition(undefined);
		mapOverlay.set('gid', undefined); // 동일 overlay 체크를 위한 gid값 추가
		mapOverlay.set('type', undefined);
		$('#cctv-overlay-closer').blur();
		// mouseStatus = MODE.move;
		map.getTargetElement().style.cursor = '';
	};

	// 겹침표시 symbol에 마우스 overlay되면 심볼목록을 보여준다.
	function _showMapOverlay(_event) {
		var _lyrName = cctvLayer.get('name');
		// mouse가 위치한 곳에 feature가 있는지 체크
		var _feature = map.forEachFeatureAtPixel(_event.pixel, function(feature) {
			return feature;
		}, {
			layerFilter : function(_layer) {
				return _layer.get('name') == _lyrName;
			}
		});
		if (!_feature) { // _feature 가 없다.
			map.getTargetElement().style.cursor = '';
			_self.closeMapOverlay(); // 보이는 overlay닫는다.
			return;
		}

		var _gid = _feature.get('cctvList')[0]['gid']
		if (mapOverlay.getPosition() && mapOverlay.get('gid') == _gid) {
			return; // 이미 같은 _gid의 overlay가 보이면 리턴
		}
		// feature 선택 마우스 모양 설정
		map.getTargetElement().style.cursor = 'pointer';

		// 동일위치 CCTV 처리된 목록을 보여준다.
		var _cctvSize = _feature.get('cctvSize');
		if (_cctvSize > 1) {
			var _point = _feature.getGeometry().getCoordinates();
			var _cctvList = _feature.get('cctvList');
			var _minSize = ((_cctvSize > 5) ? 5 : _cctvSize) * 36;

			$('#cctv-overlay').css('min-width', _minSize + 'px');

			// jwr 마우스 오버했을때 보이는 아이콘들
			var _html = '<div>';
			var _url = ctxPath + "/res/sym/cctv/";
			for (x = 0; x < _cctvSize; x++) {
				var gid = _cctvList[x]['gid'];
				var gbnCd = _cctvList[x]['gbnCd'];

				_html += '<img class="cctv-overlay-content-img" src="';

				// 만약 현재 play중이면 play중 symbol로 변경해야 함.
				var _symImage = _url + gbnCd;
				if (PLAY_LIST[gid]) {
					_symImage += 'P';
				}
				_html += _symImage + '.png" alt="" /> ';
			}
			_html += '</div>';

			$('#cctv-overlay-content').html(_html);
			$('#cctv-overlay-closer').css('display', 'none');
			mapOverlay.setPosition(_point);
			mapOverlay.set('gid', _gid); // 동일 overlay 체크를 위한 gid값 추가
			// overlay 타입을 설정. cf : cctv_detail_list
			mapOverlay.set('type', 'symbol_list');
		}
	}

	// _txt size 가 _size보가 크면 말줄임표(...)처리하여 반환한다.
	function ellipseTxt(_txt, _size) {
		var _fontFamily = $("body").css("font-family");
		var _txtLen = window.getWidthOfText(_txt, _fontFamily, '13px');

		// Popup Dialog 가로 사이즈 추정
		var _tmpTxt = _txt;
		if (_txtLen > _size) {
			for (_x = 1; _x <= _txt.length; _x++) {
				var _str = _txt.substring(0, _x);
				if (window.getWidthOfText(_str, _fontFamily, '13px') > (_size - 40)) {
					_tmpTxt = _str + '...';
					break;
				}
			}
		}
		return _tmpTxt;
	}

	// 동일위치 cctv를 선택했을때 cctv세부 목록을 보여준다.
	// jwr 지도에서 심볼을 클릭했을때
	function _showMapOverlayDetailList(_event) {
		map.getTargetElement().style.cursor = '';
		_self.closeMapOverlay(); // 이전에 보이는 overlay닫는다.

		var _lyrName = cctvLayer.get('name');
		var _feature = map.forEachFeatureAtPixel(_event.pixel, function(feature) {
			return feature;
		}, {
			layerFilter : function(_layer) {
				return _layer.get('name') == _lyrName;
			}
		});
		if (!_feature) { // _feature 가 없다.
			return;
		}

		var _cctvSize = _feature.get('cctvSize');
		var _point = _feature.getGeometry().getCoordinates();
		var _cctvList = _feature.get('cctvList');
		var _txtSize = 200;

		var _html = '<div>';
		var _url = ctxPath + "/res/sym/cctv/";
		// 그룹CCTV일경우 동일위치 타이틀을 보여준다.
		if (_cctvSize > 1) { // jwr CCTV크기가 1개보다 클때 전체영상관련 메뉴 추가
			var _symCode = _feature.get("symCode");
			for (var x = 0; x < _cctvSize; x++) {
				_cctvList[x]['point'] = _point;
			}

			var _json = encodeURIComponent(JSON.stringify(_cctvList));
			// jwr 각 CCTV마다 있는 geojson을  가져옴??
			_html += '<div class="cctv-overlay-content-item" style="background-color:#2B5E93;">';

			// jwr 심볼을 눌렀을때 전체 보기 - viewVideo
			_html += '<div class="cctv-overlay-content-img-div">'
			_html += '<a href="#" onClick="xeusCCTV.viewVideo(\'' + _json + '\');" >';
			_html += '<img class="cctv-overlay-content-img" src="' + _url + _symCode + '.png"/> ';
			_html += '</a>';
			_html += '</div>'
			// cctv전체 상세정보 보기 메뉴 추가
			_html += '<div class="cctv-overlay-content-txt-div">';
			//_html += '<a href="#" onClick="xeusCCTV.viewInformation(\'' + _json + '\');" ';
			//_html += ' style="text-decoration:none;" >';
			_html += '<span class="cctv-overlay-content-txt">동일위치CCTV (' + _cctvSize + ')</span>';
			//_html += '</a>';
			_html += '</div>';

			// empty div....
			_html += '<div class="cctv-overlay-content-img-div">';
			_html += '<span class="cctv-overlay-content-txt" style="width:34px;"></span>';
			_html += '</div>';
			_html += '</div>';
		}

		// 목록 symbol 아이콘을 drag할때 전달할 정보 목록
		var draggableIds = [];

		var _fontFamily = $("body").css("font-family");
		// overlay가 보여져야 css함수를 쓸수 있음. 아니면 undefined 반환
		// CCTV 목록 보여주기, 목록이 너무 많으면 scroll처리 함.
		_html += '<div>';
		if (_cctvSize > 8) {
			_html += '<div style="height: 260px; overflow-y: auto;">';
		}
		// 동일위치 cctv만큼 목록 생성.
		// jwr 전체 CCTV관련을 빼고 나머지 CCTV심볼, 타이틀 출력
		for (var x = 0; x < _cctvSize; x++) {
			var gid = _cctvList[x]['gid'];
			var mgrNo = _cctvList[x]['mgrNo'];
			var cctvNm = _cctvList[x]['cctvNm'];
			var deviceId = _cctvList[x]['deviceId'];
			var channelNo = _cctvList[x]['channelNo'];
			var gbnCd = _cctvList[x]['gbnCd'];
			var gbnTxt = _cctvList[x]['gbnTxt'];
			var angle = _cctvList[x]['angle'];

			_cctvList[x]['point'] = _point;
			var dragId = 'cctv_drag_' + gid;

			// cctvList[x]['cy'] = point.y;
			// 상세목록 메뉴 선택시 매개변수로 전달할 정보를 encoding 한다.
			var _json = encodeURIComponent(JSON.stringify(_cctvList[x]));
			var _txtLen = window.getWidthOfText(cctvNm, _fontFamily, '13px');

			// Popup Dialog 가로 사이즈 추정
			if ((_txtLen) + 100 > _txtSize) {
				_txtSize = (_txtLen) + 100;
			}
			_html += '<div class="cctv-overlay-content-item">';
			// cctv 영상보기 메뉴 추가
			_html += '<div class="cctv-overlay-content-img-div" >';
			_html += '<a href="#" onClick="xeusCCTV.viewVideo(\'' + _json + '\');" >';
			_html += '<img id=\"' + dragId + '\" ';

			// 만약 현재 play중이면 play중 symbol로 변경해야 함.
			var _symImage = _url + gbnCd;
			if (PLAY_LIST[gid]) {
				_symImage += 'P';
			}
			_html += 'class="cctv-overlay-content-img" src="' + _symImage + '.png"/> ';
			_html += '</a>';
			_html += '</div>'
			// cctv상세정보 보기 메뉴 추가
			_html += '<div class="cctv-overlay-content-txt-div">';
			//_html += '<a href="#" onClick="xeusCCTV.viewInformation(\'' + _json + '\');" ';
			//_html += ' style="text-decoration:none;" >';
			_html += '<span class="cctv-overlay-content-txt">' + cctvNm + '</span>';
			//_html += '</a>';
			_html += '</div>';
			// 투망분석 메뉴 추가
			_html += '<div class="cctv-overlay-content-img-div">';
			//_html += '<a href="#" onClick="xeusCCTV.viewNetWatch(\'' + _json + '\');" >';
			//_html += '<img class="cctv-overlay-content-img" src="' + ctxPath + '/res/img/netwatch_btn.png"/>';
			//_html += '</a>';
			_html += '</div>';

			// 하나밖에 없으면 x(closer) 보이게 빈 div추가
			if (_cctvSize == 1) {
				_html += '<div style="width: 26px;border: 0;"></div>';
			}

			_html += '</div>'; // cctv-overlay-content-item

			draggableIds[x] = {
				gid : gid,
				mgrNo : mgrNo,
				cctvNm : cctvNm,
				deviceId : deviceId,
				channelNo : channelNo,
				gbnCd : gbnCd,
				gbnTxt : gbnTxt,
				angle : angle,
				point : _point,
				dragId : dragId
			};
		}
		_html += '</div>'; // for문 cctv목록

		_html += '</div>'; // overlay 전체
		$('#cctv-overlay-content').html(_html);
		// text사이즈에 따라서 Dialog 크기를 변경한다.
		$('#cctv-overlay').css('min-width', _txtSize + 'px');
		$('#cctv-overlay-closer').css('display', 'inline');
		mapOverlay.setPosition(_point);
		// dialog type cf. symbol_list
		mapOverlay.set('type', 'cctv_detail_list');

		// //////////////////////////////////////////
		// draggable 설정
		// //////////////////////////////////////////
		// videoDialog, VideoGridPane에 드래그 하여 play 할수 있도록 설정
		for (x = 0; x < draggableIds.length; x++) {
			var cctvDragID = "#" + draggableIds[x].dragId;
			$(cctvDragID).draggable({
				appendTo : "body",
				helper : "clone",
				start : function(event, ui) {
					$(ui.helper).addClass("ui-draggable-helper");
					$(this).draggable("option", "revert", true);

					/* 2017-09-19 이주영 수정 */
					$(".dropBox").show("puff", 200);
					for (var i = 0; i < 2; i++) {
						$(".dropBox").animate({
							"color" : "white"
						}, 150);
						$(".dropBox").animate({
							"color" : "gray"
						}, 150);
					}
				}
			}).data({
				"gid" : draggableIds[x].gid,
				"mgrNo" : draggableIds[x].mgrNo,
				"cctvNm" : draggableIds[x].cctvNm,
				"deviceId" : draggableIds[x].deviceId,
				"channelNo" : draggableIds[x].channelNo,
				"gbnCd" : draggableIds[x].gbnCd,
				"gbnTxt" : draggableIds[x].gbnTxt,
				"angle" : draggableIds[x].angle,
				"point" : draggableIds[x].point
			});
		}
	}

	// 화면에 보여지는 Video Player Dialog 갯수를 반환한다.
	// _player_dlg_로 구분됨
	this.getVideoDialogCount = function() {
		var _keys = Object.keys(PLAY_LIST);
		if (_keys.length == 0) {
			return 0;
		}
		var _count = 0
		for (x = 0; x < _keys.length; x++) {
			var _player_dlg_id = PLAY_LIST[_keys[x]].id;
			// ^_player_dlg로 시작하는 문자열
			if (_player_dlg_id != null && _player_dlg_id.match("^_player_dlg_")) {
				_count++;
			}
		}
		return _count;
	};

	// play_list목록을 얻는다.
	// _name : _player_grid_, _player_dlg_로 구분됨
	this.getPlayListByType = function(_name) {
		var _list = [];
		var _keys = Object.keys(PLAY_LIST);
		if (_keys.length > 0) {
			for (x = 0; x < _keys.length; x++) {
				var _gid = _keys[x];
				var _player_id = PLAY_LIST[_gid].id;
				if (_player_id != null && _player_id.match("^" + _name)) {
					_list[_gid] = PLAY_LIST[_gid];
				}
			}
		}
		return _list;
	};

	// CCTV play list에서 gid에 해당하는 목록을 제거한다.
	this.removePlayList = function(_gid) {
		//jsMpeg player destroy
		if(PLAY_LIST[_gid].jsmpeg != undefined ){
			PLAY_LIST[_gid].jsmpeg.destroy();
		}
		var _symid = PLAY_LIST[_gid].sym;
		PLAY_LIST[_gid] = undefined;
		delete PLAY_LIST[_gid];
		_setOverlayStyle(_gid, _symid);
		console.log(PLAY_LIST);
	};

	// PLAY_LIST에 play중인 cctv정보를 등록한다.
	// _cctv : cctv 개체
	// _playerId : _player_grid_ 또는 _player_dlg 로 시작하는 player id
	this.addPlayList = function(_playerId, _cctv, _jsmpeg) {
		PLAY_LIST[_cctv.gid] = {
			id : _playerId,  //dialog id
			sym : _cctv.gbnCd, //심볼 구분
			cctv : _cctv,      //cctv정보
			jsmpeg: _jsmpeg //jsMpeg player객체
		};
		_setOverlayStyle(_cctv.gid, _cctv.gbnCd + 'P');
		console.log(PLAY_LIST);
	}

	// PLAY_LIST에 gid가 있는지 확인한다.
	this.existPlayList = function(_gid) {
		if (PLAY_LIST[_gid] != undefined) {
			return true;
		}
		return false;
	}

	// mapOverlay 목록에 있는 symbol 모양을 설정한다.
	function _setOverlayStyle(_gid, _symid) {
		$('#cctv_drag_' + _gid).attr('src', ctxPath + '/res/sym/cctv/' + _symid + '.png');
	}

	//mepgPlayer를 생성한다.
	this.getMpegPlayer = function(_url, _canvas, _mediaId, _size){
		var player = new JSMpeg.Player(_url,{
			autoplay: false,
			loop : false,
			canvas : _canvas,
			disableGl : true, //webGL사용시 too many contect 오류나면 생성제한됨.
			mediaId : _mediaId,
			size : _size
			//closed: function(){
			//	console.log(">>>>>>>>> closed...... " + _url);
			//},
			//played : function(){
			//	console.log(">>>>>>>>> playerd...... " + _url);
			//}
		});
		return player;
	}
//////////////////////////////////////////////////////////////////////////////////////////////////
	// _player_grid_ 로 시작하는 player를 닫는다.
	this.closeVideoDialog = function(_dlgid) {
		console.log(">>> closeVideoDialog... " + _dlgid);
		$('#' + _dlgid).droppable('destroy');
		var _gid = $('#' + _dlgid).dialog('option', 'gid');
		this.removePlayList(_gid);
		$('#' + _dlgid).remove(); // _player_grid_xxx dialog를 제거한다.
	}

	// CCTV 비디오 Dialog를 화면에 생성한다.
	// _cctv : cctv정보
	// _cnt : videodialog 순서번호, 2017.04.27 의미없음
	this.createVideoDialog = function(_cctv, _cnt) {
		var cnt = _self.getVideoDialogCount();
		if(cnt >= VIDEO_POPUP_PLAYER_LIMIT){
			var msg = "더이상 팝업 플레이어를 생성할 수 없습니다<br>"
				msg+= "허용 팝업 플레이어 수 : " + VIDEO_POPUP_PLAYER_LIMIT;
    		xeusLayout.showShortcutMessage(msg, 400);
    		return;
		}

		var gid = _cctv['gid'];
		var mgrNo = _cctv['mgrNo'];
		var cctvNm = _cctv['cctvNm'];
		var deviceId = _cctv['deviceId'];
		var channelNo = _cctv['channelNo'];
		var gbnCd = _cctv['gbnCd'];
		var gbnTxt = _cctv['gbnTxt'];
		var angle = _cctv['angle'];
		var point = _cctv['point'];

		if (this.existPlayList(gid)) {
			// 이미 play 중인 cctv이면 return; createVideoDialog 호출시 체크함.
			return;
		}
		// dialog 타이틀 html을 만든다.
		var _title = this.getVideoDialogTitle(point[0], point[1], gbnCd, cctvNm, 0);
		// 마우스 클릭 위치...
		var _pos = mapService.getMap().getPixelFromCoordinate(point);
		var _width = parseInt($('#' + virtualMapBoundary).outerWidth());
		var _height = parseInt($('#' + virtualMapBoundary).outerHeight());

		var _cols = parseInt(_width /(this.SIZE['width'] + 4 + 2)); //가로 갯수
        var _rows = parseInt(_height/(this.SIZE['height'] + 4)); //세로갯수

		// dialog 위치 가로 offset
	 	var _left = ((_cnt % _cols) * (parseInt(this.SIZE['width']) + 4)) + 2;

	 	var _rowIdx = Math.floor(_cnt /_cols); //행 index,,,
	 	if(_rowIdx > (_rows-1))_rowIdx = 0; //세로로 더 추가 할 수 없을때 top에 위치..
		var _top = (_rowIdx * (parseInt(this.SIZE['height']) + 40)) + 34;

		// ///////////////////////////////////
		var _player_dlg_id = '_player_dlg_' + new Date().getTime();
		var div = $('<div id="' + _player_dlg_id + '"></div>').appendTo('#' + virtualMapBoundary);
		var _position = {
			my : "left top",
			at : "left+" + _left + " top+" + _top,
			of : '#' + virtualMapBoundary
		}

		// dialog를 생성한다.
		var _player = $('#' + _player_dlg_id).dialog({
			gid : gid,
			mgrNo : mgrNo,
			cctvNm : cctvNm,
			deviceId : deviceId,
			channelNo : channelNo,
			gbnCd : gbnCd,
			gbnTxt : gbnTxt,
			angle : angle,
			basePoint : point, // 안내서 시작 위치.
			title : _title,
			width : this.SIZE['width'],
			height : this.SIZE['height'] + 38,
			// 2017.12.05 by khkim, JSMpeg.Player는 미디어 소스와 동일 사이즈로 플레이 됨
			// TODO Dialog에 1.5배, 2배 버튼을 추가해서 보완 해야 함.
			resizable : false,
			position : _position,
			autoOpen : false,
			hide : {
				effect : "fade",
				duration : 100
			},
			open : function(event, ui) {
				$('#' + event.target.id).css('overflow', 'hidden');
				// Dialog 타이틀 버튼을 2개(grid보기, 닫기)로 생성한다.
				var _str = '';
				_str += '<button type="button" id="' + _player_dlg_id + '_btn_undock"';
				_str += 'class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-newwin">';
				_str += '<span class="ui-button-icon ui-icon ui-icon-newwin"></span>';
				_str += '</button>';
				_str += '<button type="button" id="' + _player_dlg_id + '_btn_close"';
				_str += 'class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close">';
				_str += '<span class="ui-button-icon ui-icon ui-icon-closethick"></span>';
				_str += '</button>';
				$('#' + event.target.id).parent().children().children('button').replaceWith(_str);
				// 혹시 모를 click 이벤트 unbind
				$('#' + event.target.id + '_btn_close').off('click');
				$('#' + event.target.id + '_btn_undock').off('click');
				// close event
				$('#' + event.target.id + '_btn_close').click(function(e) {
					_self.closeVideoDialog(event.target.id);
					_self.reload();
				});
				// videoDialog 영상을 gridpane으로 이동한다.
				// jwr CCTV영상 Dialog에서 최소화 버튼 이벤트
				$('#' + event.target.id + '_btn_undock').click(function(e) {
					_self.closeVideoDialog(event.target.id);
					xeusCCTV.showVideoInGridPane(_cctv);
					_self.reload();
				});
			}
		});
		_player.html('');
		var _canvasId = "video-canvas-" + gid;
		_player.html("<canvas id='" + _canvasId + "' width="+_self.SIZE['width']
		+" height="+_self.SIZE['height']+"></canvas>");

		_player.dialog('open');
		//
		var _size =  _self.SIZE['width'] + "x" + _self.SIZE['height'];
		var _jsmpeg = this.getMpegPlayer(VIDEO_WEBSOCKET_URL, $('#'+_canvasId)[0], mgrNo, _size);
		this.addPlayList(_player_dlg_id, _cctv, _jsmpeg);


		// dialog drag영역을 제한함. 2017.02.28 검토. 필요.
		// $('#' + _player_dlg_id).parent().draggable("option", "containment",
		// '#' + virtualMapBoundary);
		// //////////////////////////////////////////
		// droppable 설정
		// /////////////////////////////////////////
		// cctv세부목록에서 심볼을 videodialog 에 drop 처리.
		$('#' + _player_dlg_id).droppable({
			drop : function(event, ui) {
				var dragid = ui.draggable.attr("id");

				var _drp_gid = ui.draggable.data("gid");
				var _drp_mgrNo = ui.draggable.data("mgrNo");
				var _drp_cctvNm = ui.draggable.data("cctvNm");
				var _drp_deviceId = ui.draggable.data("deviceId");
				var _drp_channelNo = ui.draggable.data("channelNo");
				var _drp_gbnCd = ui.draggable.data("gbnCd");
				var _drp_gbnTxt = ui.draggable.data("gbnTxt");
				var _drp_angle = ui.draggable.data("angle");
				var _drp_point = ui.draggable.data("point");

				// cctv_drag_로 시작하는 drop이 아니면 리턴 var dragId = 'cctv_drag_' +
				if (!dragid || !dragid.match("^cctv_drag_")) {
					return;
				}
				// 현재 dialog gid
				var _oldGid = $('#' + event.target.id).dialog('option', 'gid');
				// 같은 cctv이거나 이미 플레이 중이면 리턴
				if ((_oldGid == _drp_gid) || _self.existPlayList(_drp_gid)) {
					return;
				}

				// drag 취소(revert) : false 즉 drop 완료 설정
				ui.draggable.draggable("option", "revert", false);

				// videoDialog 타이틀
				var _title = _self.getVideoDialogTitle(_drp_point[0], _drp_point[1], _drp_gbnCd, _drp_cctvNm, 0);

				var _dlg = $('#' + event.target.id).dialog();
				_dlg.dialog().dialog('option', 'title', _title);
				_dlg.dialog().dialog('option', 'gid', _drp_gid);
				_dlg.dialog().dialog('option', 'mgrNo', _drp_mgrNo);
				_dlg.dialog().dialog('option', 'cctvNm', _drp_cctvNm);
				_dlg.dialog().dialog('option', 'deviceId', _drp_deviceId);
				_dlg.dialog().dialog('option', 'channelNo', _drp_channelNo);
				_dlg.dialog().dialog('option', 'gbnCd', _drp_gbnCd);
				_dlg.dialog().dialog('option', 'gbnTxt', _drp_gbnTxt);
				_dlg.dialog().dialog('option', 'angle', _drp_angle);
				_dlg.dialog().dialog('option', 'basePoint', _drp_point);

				_self.removePlayList(_oldGid); //이전것 제거...
				//
				_dlg.dialog().html('');
				var _canvasId = "video-canvas-" +_drp_gid;
				_dlg.dialog().html("<canvas id='" + _canvasId + "' width="+_self.SIZE['width']
				+" height="+_self.SIZE['height']+"></canvas>");
				var _size =  _self.SIZE['width'] + "x" + _self.SIZE['height'];
				var _jsmpeg = _self.getMpegPlayer(VIDEO_WEBSOCKET_URL, $('#'+_canvasId)[0], _drp_mgrNo, _size);
				_self.addPlayList(event.target.id, {
					gid : _drp_gid,
					mgrNo : _drp_mgrNo,
					cctvNm : _drp_cctvNm,
					deviceId : _drp_deviceId,
					channelNo : _drp_channelNo,
					gbnCd : _drp_gbnCd,
					gbnTxt : _drp_gbnTxt,
					angle : _drp_angle,
					point : _drp_point
				},_jsmpeg);
			}
		});
	};

	// 영상 player Title html을 생성한다.
	this.getVideoDialogTitle = function(_px, _py, _cd, _txt, _len) {
		// 제목이 길면 줄임표를 표시한다.
		var _reducedTxt = ((_len == 0) ? _txt : ellipseTxt(_txt, _len));
		var title = "<div class='xeus-dialog-title-div'>";
		title += '<a href="#" onClick="xeusCCTV.moveTo([' + _px + ',' + _py + ']);">';
		// jwr 영상 실행중일때 타이틀에 있는 심볼을 누르면 해당 위치로 이동함(moveTo);
		title += "<img class='xeus-dialog-title-icon' ";
		title += " src='" + ctxPath + "/res/sym/cctv/" + _cd + ".png'/>";
		title += '</a>';
		title += "<span class='xeus-dialog-title-txt'>" + _reducedTxt + "</span>";
		title += "</div>";
		return title;
	}

	// CCTV 데이터를 서버에서 받아와 Vector레이어에 채운다.
	this.reload = function() {
		var size = map.getSize();
		var extent = map.getView().calculateExtent(size);
		var epsg = map.getView().getProjection().getCode();
		// false로 반환되는 값은 "", null, undefined, 0, NaN 이 있고
		if (!epsg) {
			return;
		}
		var codes = _getVisibleStyleIds();
		if (codes == null) {
			codes = [];
		}

		epsg = epsg.split(':')[1];
		// jwr json으로 CCTV목록 가져옴 (geometry에 coord에 좌표값, property에 cctv리스트
		// 있음(하나일땐 리스트가 1개))
		$.ajax({
			url : ctxPath + "/cctv/cctvmap",
			type : "POST",
			data : {
				'epsg' : epsg,
				'map_width' : Math.floor(size[0]),
				'map_height' : Math.floor(size[1]),
				'sym_width' : SYMSIZE,
				'sym_height' : SYMSIZE,
				'bbox' : extent.join(','),
				'codes' : codes.join(',')
			},
			dataType : "json",
			success : function(json) {
				var source = cctvLayer.getSource();
				var features = new ol.format.GeoJSON().readFeatures(json);
				source.clear(); // jwr CCTV레이어의 모든 피쳐를 지움
				source.addFeatures(features); // jwr json에서 geometry가 있는 모든것을
				// 피쳐로 등로
				// 화면에 CCYV영상 Dialog가 있으면 심볼 Point값을 재설정해야 한다.
				// 심볼이 합쳐지거나 분리 되기 때문에..
				// var keys = Object.keys(_cctvSelf.dialogs);
				// if (keys.length > 0) {
				// _cctvSelf.checkCCTVSymbolPointAfterReload(features);
				// }
			},
			error : function(xhr, status, error) {
				alert("CCTV data request error occurred.. > \r\n" + error);
			}
		});
	};

	// ////////////////////////////////////////////////////
	// 이벤트 등록
	// ////////////////////////////////////////////////////
	// moveend 이벤트 발생시 자동으로 처리됨
	map.on('moveend', function(e) {
		// jwr 처음 페이지 열때 호출
		_self.reload(); // cctv데이터를 다시 로드
	});

};

//////////////////////////////////////////////////////////////////////////////////////////
var xeusCCTV = {
	cctv : null,
	VIDEO_GRID : null,
	ctxPath : null,
	VIDEO_GRID_COLS : 3,
	TITLE_LEN : 140,
	// cctv 선택시 이전 다이어로그를 교체할 것인지, gridpane으로 보여질것인지 정책
	// replace : 현재 보여지는 video dialog를 닫고 새 player를 보여줌
	// gridpane : 현재 보여지는 video dailog 유지, 선택한 것을 gridpane에서 보여짐.
	gridToggleButtons : new geomex.xeus.ToggleButtons(), // 가로 열 수 선택 토글버튼

	initCCTV : function(_ctxPath) {
		xeusCCTV.ctxPath = _ctxPath;

		xeusCCTV.cctv = new geomex.xeus.CCTV({
			ctxPath : xeusCCTV.ctxPath,
			mapService : xeusLayout.mapService,
			layer : 'cctv',
			virtualBoundary : 'virtual-map-boundary'
		});
	},

	// 사용안함 : 2017.04.27
	// jwr 영상 실행중일때 타이틀에 있는 심볼을 누르면 해당 위치로 이동함(moveTo);
	moveTo : function(_pt) {
		// west pane, east-pane이 있는 경우 지도 이동을 조정한다.
		var _boundary = $('#virtual-map-boundary');
		var _ndx = (xeusLayout.mapService.getMap().getSize()[0] / 2)
				- (_boundary.offset().left + _boundary.width() / 2);
		var _wdx = xeusLayout.mapService.getMap().getCoordinateFromPixel([ _ndx, 0 ]);
		var _wsx = xeusLayout.mapService.getMap().getCoordinateFromPixel([ 0, 0 ]);
		var _newPt = [ _pt[0] + _wdx[0] - _wsx[0], _pt[1] ];
		xeusLayout.mapService.getMap().getView().animate({
			center : _newPt,
			duration : 1000
		});
	},

	// cctv세부 목록(overlay)에서 cctv 영상 보기 선택
	// _json cctv정보 json
	viewVideo : function(_json) {
		this.cctv.closeMapOverlay();
		var _cctv = JSON.parse(decodeURIComponent(_json));

        // 동일위치 CCTV 전체 보기 선택시,, gridpane에 보여준다.
		// jwr _cctv.constructor가 array면 전체 선택, object면 단일 선택
		if (_cctv.constructor == Array) {
			for (var _x = 0; _x < _cctv.length; _x++) {
				(function(_x) { // 이렇게 해야지 0.5초에 하나씩 수행한다.
					setTimeout(function() {
						xeusCCTV.showVideoInGridPane(_cctv[_x]);
					}, 500 * _x);
				})(_x);
			}
			xeusCCTV.cctv.reload();
		} else { // obj.constructor == Object
			// 단일 CCTV선택시 videoDialog에 보여준다. 갯수 제한 있음
			var _point = _cctv['point'];
			var cnt = xeusCCTV.cctv.getVideoDialogCount();
			xeusCCTV.cctv.createVideoDialog(_cctv, cnt);
			xeusCCTV.cctv.reload();
		}
		console.log(">>this.showVideo..............");
	},

	// CCTV 정보 보기
	viewInformation : function(_json) {
		this.cctv.closeMapOverlay();
		console.log(">>showCCTVInfo..............");
		// jwr 아마도 Json으로 DB내용 긁어와야할듯?
	},

	// 투망모니터링
	viewNetWatch : function(_json) {
		this.cctv.closeMapOverlay();
		console.log("showNetWatchVideo........");
	}
};

// CCTV영상을 grid pane에 보여준다.
/* 2017-12-06 이주영 - col, row 사용하도록 변경 (arguments Object use) */
xeusCCTV.showVideoInGridPane = function(_cctv) {
	// grid pane을 최소 생성한다.
	if (xeusCCTV.VIDEO_GRID == null) {
		xeusCCTV.createVideoGridPane(true);
	}
	// grid pane의 gridster정보를 json으로 얻어온다.
	var _json = xeusCCTV.VIDEO_GRID.serialize();
	// console.log(_json);
	// console.log("제이슨.....................");
	// 비어있는 grid pane의 위치를 찾는다.
	var _empty = xeusCCTV.getEmptyGridSlot(_json);

	// 비어 있는 gridpane이 없다면 짧은 안내 메세지 출력
	if (_empty == undefined) {
		xeusLayout.showShortcutMessage('더이상 영상화면을 추가할 수 없습니다.', 340);
		return;
	}

	var gid = _cctv['gid'];
	var mgrNo = _cctv['mgrNo'];
	var cctvNm = _cctv['cctvNm'];
	var deviceId = _cctv['deviceId'];
	var channelNo = _cctv['channelNo'];
	var gbnCd = _cctv['gbnCd'];
	var gbnTxt = _cctv['gbnTxt'];
	var angle = _cctv['angle'];
	var point = _cctv['point'];
	// jwr 오른쪽 그리드패널 열기
	xeusLayout.showOverlayEastPane(500); // 함수 내부코드에서 이미 보이는지 체크한다.

	// 이미 play중인 cctv이면 return
	// cctv symbol에 play 표시가 있으므로 안내 메시지 생략
	if (this.cctv.existPlayList(gid)) {
		return;
	}

	var _player_grid_id = '_player_grid_' + new Date().getTime();
	var _html = xeusCCTV.makeWidgetHtml(_cctv, _player_grid_id);
	if(arguments[1] != null && arguments[2] != null){
		xeusCCTV.VIDEO_GRID.add_widget(_html, 1, 1, arguments[1], arguments[2]);
	}else{
		xeusCCTV.VIDEO_GRID.add_widget(_html, 1, 1, _empty['c'], _empty['r']);
	}
   //
	//gridPane Widget에 player등록.
	var _canvasId = "grid-canvas-"  + gid;
	var _size =  xeusCCTV.cctv.SIZE['minWidth'] + "x" + xeusCCTV.cctv.SIZE['minHeight'];
	var _jsmpeg = xeusCCTV.cctv.getMpegPlayer(VIDEO_WEBSOCKET_URL, $('#'+_canvasId)[0], mgrNo, _size);
	xeusCCTV.cctv.addPlayList(_player_grid_id, _cctv, _jsmpeg);
	///////////////////////////////////////////////////////////
	$('#' + _player_grid_id).data('gid', gid);
	$('#' + _player_grid_id).data('mgrNo', mgrNo);
	$('#' + _player_grid_id).data('gbnCd', gbnCd);
	// html을 처리후 event를 등록해야 함
	// pane player를 닫기 이벤트..
	$('#' + _player_grid_id + '_btn_close').off('click');
	$('#' + _player_grid_id + '_btn_undock').off('click');

	$('#' + _player_grid_id + '_btn_close').one('click',function(e) {
		//one 한번만 시행, 더블되면 droppable('destroy')에서 오류남)
		xeusCCTV.closeGridPanePlayer(gid, _player_grid_id);
		xeusCCTV.cctv.reload();
	});

	// 팝업Player가 없어야 함.... 있으면 메세지...
	$('#' + _player_grid_id + '_btn_undock').on('click',function(e) {
		xeusCCTV.unDockGridPanePlayer({
			player_id : _player_grid_id,
			gid : gid,
			mgrNo : mgrNo,
			cctvNm : cctvNm,
			deviceId : deviceId,
			channelNo : channelNo,
			gbnCd : gbnCd,
			gbnTxt : gbnTxt,
			angle : angle,
			point : point
		});
	});

	// //////////////////////////////////////////
	// droppable 설정
	// /////////////////////////////////////////
	// cctv세부 목록에서 symbol을 gridpane player에 drop 처리
	// 만약 gridpane에 drop 하면 영상 추가..createVideoGridPane() 참고
	$('#' + _player_grid_id).droppable({
		greedy : true,
		drop : function(event, ui) {
			var dragid = ui.draggable.attr("id");

			var _drp_gid = ui.draggable.data("gid");
			var _drp_mgrNo = ui.draggable.data("mgrNo");
			var _drp_cctvNm = ui.draggable.data("cctvNm");
			var _drp_deviceId = ui.draggable.data("deviceId");
			var _drp_channelNo = ui.draggable.data("channelNo");
			var _drp_gbnCd = ui.draggable.data("gbnCd");
			var _drp_gbnTxt = ui.draggable.data("gbnTxt");
			var _drp_angle = ui.draggable.data("angle");
			var _drp_point = ui.draggable.data("point");

			console.log("_drp_gid : " + _drp_gid);
			// cctv_drag_로 시작하는 drop이 아니면 리턴
			if (!dragid || !dragid.match("^cctv_drag_")) {
				return;
			}

			var _oldGid = $('#' + event.target.id).data('gid');
			// 이미 playerlist에 있으면 return;
			if ((_oldGid == _drp_gid) || xeusCCTV.cctv.existPlayList(_drp_gid)) {
				return;
			}
		    // 이전 player 정보를 제거한다...
			xeusCCTV.cctv.removePlayList(_oldGid);
			//
			// 정상 drop 설정
			ui.draggable.draggable("option", "revert", false);
			// 타이틀 text 생성
			var _len = xeusCCTV.TITLE_LEN;
			var _title = xeusCCTV.cctv.getVideoDialogTitle(_drp_point[0], _drp_point[1], _drp_gbnCd, _drp_cctvNm, _len);
			var _canvasId = "grid-canvas-" +_drp_gid;
			var _newHtml="";
			_newHtml += "<canvas id='" + _canvasId + "'";
			_newHtml +=" width="+xeusCCTV.cctv.SIZE['minWidth'];
			_newHtml +=" height="+xeusCCTV.cctv.SIZE['minHeight']+"></canvas>";

			$('#' + _player_grid_id + '_title_warp').html(_title);
			$('#' + _player_grid_id + '_video_warp').html(_newHtml);
			$('#' + _player_grid_id).data('gid', _drp_gid);
			$('#' + _player_grid_id).data('gbnCd', _drp_gbnCd);

			var _size =  xeusCCTV.cctv.SIZE['minWidth'] + "x" + xeusCCTV.cctv.SIZE['minHeight'];
			var _jsmpeg = xeusCCTV.cctv.getMpegPlayer(VIDEO_WEBSOCKET_URL, $('#'+_canvasId)[0], _drp_mgrNo, _size);
    		xeusCCTV.cctv.addPlayList(event.target.id, {
				gid : _drp_gid,
				mgrNo : _drp_mgrNo,
				cctvNm : _drp_cctvNm,
				deviceId : _drp_deviceId,
				channelNo : _drp_channelNo,
				gbnCd : _drp_gbnCd,
				gbnTxt : _drp_gbnTxt,
				angle : _drp_angle,
				point : _drp_point
			}, _jsmpeg);
			//////////////////////////////////////////

			$('#' + _player_grid_id + '_btn_close').off('click');
			$('#' + _player_grid_id + '_btn_undock').off('click');
			// 닫기 버튼 event
			$('#' + _player_grid_id + '_btn_close').one('click',function(e) {
				xeusCCTV.closeGridPanePlayer(_drp_gid, _player_grid_id);
				xeusCCTV.cctv.reload();
			});

			$('#' + _player_grid_id + '_btn_undock').on('click',function(e) {
				//dialog 실행 실패시 click event유지해야 함.
				xeusCCTV.unDockGridPanePlayer({
					player_id : _player_grid_id,
					gid : _drp_gid,
					mgrNo : _drp_mgrNo,
					cctvNm : _drp_cctvNm,
					deviceId : _drp_deviceId,
					channelNo : _drp_channelNo,
					gbnCd : _drp_gbnCd,
					gbnTxt : _drp_gbnTxt,
					angle : _drp_angle,
					point : _drp_point
				});
			});

		}
	}); // player에 cctv가 drop되었을때.. 화면정보 교체...처리 끝...

};

// grid pane widget html...
xeusCCTV.makeWidgetHtml = function(_cctv, _player_grid_id) {
	var gid = _cctv['gid'];
	var mgrNo = _cctv['mgrNo'];
	var cctvNm = _cctv['cctvNm'];
	var deviceId = _cctv['deviceId'];
	var channelNo = _cctv['channelNo'];
	var gbnCd = _cctv['gbnCd'];
	var gbnTxt = _cctv['gbnTxt'];
	var angle = _cctv['angle'];
	var point = _cctv['point'];
	// player 제목 생성
	var title = xeusCCTV.cctv.getVideoDialogTitle(point[0], point[1], gbnCd, cctvNm, xeusCCTV.TITLE_LEN);

	var _html = '';
	_html += '<li data-row="1" data-col="1" data-sizex="1" data-sizey="1"  id="' + _player_grid_id + '">';
	_html += '<div class="ui-dialog ui-corner-all ui-widget ui-widget-content" style="width:100%;height:100%">';
	_html += '<div class="ui-dialog-titlebar ui-corner-all  ui-widget-header ui-helper-clearfix ">';
	_html += '<div id="' + _player_grid_id + '_title_warp">';
	_html += title;
	_html += '</div>';

	_html += '<button type="button" id="' + _player_grid_id + '_btn_undock"';
	_html += 'class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-newwin">';
	_html += '<span class="ui-button-icon ui-icon ui-icon-newwin"></span>';
	_html += '</button>';

	_html += '<button type="button" id="' + _player_grid_id + '_btn_close"';
	_html += 'class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close">';
	_html += '<span class="ui-button-icon ui-icon ui-icon-closethick"></span>';
	_html += '</button>';

	_html += '</div>';
	_html += '<div id="' + _player_grid_id + '_player" class="ui-dialog-content ui-widget-content"  ';
	_html += 'style="overflow:hidden;">';
	_html += '<div id="' + _player_grid_id + '_video_warp">';

	_html += '<canvas id="grid-canvas-' + gid + '" ';
	_html += ' width="' + xeusCCTV.cctv.SIZE['minWidth'] + '" ';
	_html += ' height="' + xeusCCTV.cctv.SIZE['minHeight'] + '" ';
	_html += '></canvas>';

	//_html += _playerHtml;
	_html += '</div>';
	_html += '</div>';
	_html += '</div>';
	_html += '</li>';
	return _html;
};

// grid pane내 player수를 얻는다.
xeusCCTV.getGridPanePlayerCount = function() {
	var _playList = xeusCCTV.cctv.getPlayListByType('_player_grid_');
	var _keys = Object.keys(_playList);
	return _keys.length;
};

// grid pane에 있는 모든 player를 닫는다.
/* 2017-08-22 이주영 - 패널 클로즈 딜레이 옵션 추가(arguments object use) */
xeusCCTV.closeAllGridPanePlayer = function() {
	var _delay = 1000;
	if (!isNaN(arguments[0])) _delay = Number(arguments[0]);
	var _playList = xeusCCTV.cctv.getPlayListByType('_player_grid_');
	var _keys = Object.keys(_playList);
	for (x = 0; x < _keys.length; x++) {
		var _gid = _keys[x];
		var _player_id = _playList[_gid].id;
		$('#' + _player_id).droppable('destroy');
		xeusCCTV.cctv.removePlayList(_gid);
		xeusCCTV.VIDEO_GRID.remove_widget($('#' + _player_id));
	}
	xeusCCTV.VIDEO_GRID.remove_all_widgets();
	xeusLayout.hideOverlayEastPane(_delay);
	xeusCCTV.VIDEO_GRID = null; // grid pane 자체를 제거
	xeusCCTV.cctv.reload();
};

// VideoGridPane에서 player를 제거한다.
xeusCCTV.closeGridPanePlayer = function(_gid, _player_grid_id) {
	$('#' + _player_grid_id).droppable('destroy');
	xeusCCTV.cctv.removePlayList(_gid);
	xeusCCTV.VIDEO_GRID.remove_widget($('#' + _player_grid_id));
};

// GridPanePlayer를 unDock하고 videoDialog에 play한다.
xeusCCTV.unDockGridPanePlayer = function(_cctv) {
	var cnt = xeusCCTV.cctv.getVideoDialogCount();
	if(cnt >= VIDEO_POPUP_PLAYER_LIMIT){
		var msg = "더이상 팝업 플레이어를 생성할 수 없습니다<br>"
			msg+= "허용 팝업 플레이어 수 : " + VIDEO_POPUP_PLAYER_LIMIT;
		xeusLayout.showShortcutMessage(msg, 400);
		return;
	}
	//
	var _player_grid_id = _cctv['player_id'];
	var _gid = _cctv['gid'];
	$('#' + _player_grid_id + '_btn_undock').off('click'); //더블 click방지용

	// grid pane에서 player를 우선 닫는다.
	xeusCCTV.closeGridPanePlayer(_gid, _player_grid_id);
	xeusCCTV.cctv.createVideoDialog(_cctv, cnt);
	xeusCCTV.cctv.reload();
};

// 우측 vidoeGridPane을 생성한다.
/**
 * 2017-12-06 이주영
 * - HTML 생성 옵션 추가(arguments object use)
 * > true 일 경우만 생성
 */
xeusCCTV.createVideoGridPane = function() {
	var _width = xeusCCTV.cctv.SIZE['minWidth'] + 2;
	var _height = xeusCCTV.cctv.SIZE['minHeight'] + 36;

	// 우측 grid Pane의 칼럼수...
	var _cols = xeusCCTV.VIDEO_GRID_COLS;

	xeusLayout.EAST = _width * _cols + 10;
	// gridster 이미 생성되어 있으면 return
	if (xeusCCTV.VIDEO_GRID != null) {
		xeusCCTV.VIDEO_GRID = null;
		if ($("#video_player_grid").data("gridster") != null) {
			$("#video_player_grid").data("gridster").destroy();
		}
	}

	if (arguments[0]) {
		var _html = '';
		_html += '<div id="overlay-east-bar" class="overlay-bar">';
		// _html += "<span>CCTV 영상 보기</span>"; // test title
		_html += '<button type="button" id="gridpane_btn_close" ';
		_html += 'class="icon-button ui-button ui-corner-all ui-widget ui-button-icon-only">';
		_html += '<span class="ui-button-icon ui-icon ui-icon-closethick"></span>';
		_html += '</button>';

		_html += '<button class="overlay-bar-button" id="gridpane_btn_x2">x2</button>';
		_html += '<button class="overlay-bar-button" id="gridpane_btn_x3">x3</button>';
		_html += '<button class="overlay-bar-button" id="gridpane_btn_x4">x4</button>';

		_html += '</div>';
		_html += '<div id="overlay-east-contents">';
		_html += ' <div class="gridster">';
		_html += '  <ul id="video_player_grid">';
		_html += '  </ul>';
		_html += ' </div>';
		_html += '</div>';
		$('#center-overlay-east').html(_html);
	}

	var _contentsHeight = $("#center-overlay-east").height() - 2;
	$('#overlay-east-contents').css('background', '#3B3B3B');
	$('#overlay-east-contents').css('padding', '0'); // grid pan hack by khkim

	// 등록된 토글 버튼을 clear한다.
	xeusCCTV.gridToggleButtons.clear();
	// 상단 토글 버튼 이벤트 등록
	xeusCCTV.gridToggleButtons.add('#gridpane_btn_x2', function() {
		xeusCCTV.relocateWidget(2, _width);
		//xeusLayout.showShortcutMessage('가로 2열 보기 선택', 200);
	});
	xeusCCTV.gridToggleButtons.add('#gridpane_btn_x3', function() {
		xeusCCTV.relocateWidget(3, _width);
		//xeusLayout.showShortcutMessage('가로 3열 보기 선택', 200);
	});
	xeusCCTV.gridToggleButtons.add('#gridpane_btn_x4', function() {
		xeusCCTV.relocateWidget(4, _width);
		//xeusLayout.showShortcutMessage('가로 4열 보기 선택', 200);
	});

	// 버튼 toggle상태 변경하기
	switch (xeusCCTV.VIDEO_GRID_COLS) {
	case 2:
		xeusCCTV.gridToggleButtons.toggle('#gridpane_btn_x2');
		break;
	case 3:
		xeusCCTV.gridToggleButtons.toggle('#gridpane_btn_x3');
		break;
	case 4:
		xeusCCTV.gridToggleButtons.toggle('#gridpane_btn_x4');
		break;
	}
	//
	$('#gridpane_btn_close').click(function(_dialog) {
		if (xeusCCTV.getGridPanePlayerCount() > 0) {
			xeusLayout.showYesNoDialog("영상그리드 화면 닫기",
					"CCTV영상 그리드 화면을 닫으시겠습니까?</br> 모든 CCTV영상 화면을 닫습니다.",
					function() {
				xeusCCTV.closeAllGridPanePlayer();
			});
		} else {
			xeusLayout.hideOverlayEastPane(1000);
			xeusCCTV.VIDEO_GRID = null;
			xeusCCTV.cctv.reload();
		}
	});
	// grid ster생성.
	xeusCCTV.VIDEO_GRID = $("#video_player_grid").gridster({
		widget_base_dimensions : [ _width, _height ],
		widget_margins : [ 2, 3 ],
		min_cols : _cols,
		max_cols : _cols,
		autogrow_cols : false,
		autogrow_rows : true,
		shift_widgets_up : false,
		shift_larger_widgets_down : false,
		collision : {
			wait_for_mouseup : true
		},
		resize : {
			enabled : false,
			max_size : [ 2, 2 ],
			stop : function(e, ui, $widget) {
				console.log("gridster resize stop!");
			}
		},
		serialize_params : function($w, wgd) {
			return {
				id : $w.attr('id'),
				mgrNo : $w.data().mgrNo,
				col : wgd.col,
				row : wgd.row,
				size_x : wgd.size_x,
				size_y : wgd.size_y
			};
		}
	}).data("gridster");

	/**
	 * 그리드의 데이터를 리턴합니다.
	 *
	 * 이주영 2017-11-29
	 */
	xeusCCTV.VIDEO_GRID.getData = function() {
		var result = "";
		if (xeusCCTV.VIDEO_GRID instanceof Gridster) {
			if(xeusCCTV.VIDEO_GRID.serialize().length > 0){
				result = xeusCCTV.VIDEO_GRID.serialize();
			}
		}
		return result;
	};

	// cctv세부 목록에서 symbol을 드롭 처리..
	// Pane에 drop하면 cctv player를 추가한다.
	$('#overlay-east-contents').droppable({
		greedy : true,
		drop : function(event, ui) {
			var _gid = ui.draggable.data("gid");
			// 이미 playerlist에 있으면 return;
			if (xeusCCTV.cctv.existPlayList(_gid)) {
				return;
			}
			// 정상 drop 처리
			ui.draggable.draggable("option", "revert", false);
			// 정상 drop되었으므로 player를 생성한다.
			xeusCCTV.showVideoInGridPane({
				gid : _gid,
				mgrNo : ui.draggable.data("mgrNo"),
				cctvNm : ui.draggable.data("cctvNm"),
				deviceId : ui.draggable.data("deviceId"),
				channelNo : ui.draggable.data("channelNo"),
				gbnCd : ui.draggable.data("gbnCd"),
				gbnTxt : ui.draggable.data("gbnTxt"),
				angle : ui.draggable.data("angle"),
				point : ui.draggable.data("point")
			});
			xeusCCTV.cctv.reload();
		}
	});
};

// gridster widget에서 c,r에 위치한 wedget를 얻는다.
xeusCCTV.findWidjetAt = function(widgets, _c, _r) {
	var _len = widgets.length;
	for (_x = 0; _x < widgets.length; _x++) {
		var _cc = $(widgets[_x]).attr('data-col');
		var _rr = $(widgets[_x]).attr('data-row');
		if (_cc == _c && _rr == _r) {
			return $(widgets[_x]);
		}
	}
	return null;
};

// _id에 해당하는 widget위치를 지정한다.
xeusCCTV.moveWidgetTo = function(widgets, _id, _c, _r) {
	var _len = widgets.length;
	for (_x = 0; _x < widgets.length; _x++) {
		var _wid = $(widgets[_x]).attr('id');
		if (_id == _wid) {
			$(widgets[_x]).attr('data-col', _c);
			$(widgets[_x]).attr('data-row', _r);
			xeusCCTV.VIDEO_GRID.new_move_widget_to($(widgets[_x]), _c, _r);
			break;
		}
	}
}
// 가로 cololum수에 맞게 widget를 재 배열 한다.
xeusCCTV.relocateWidget = function(_newCols, _width) {
	var _oldCols = xeusCCTV.VIDEO_GRID_COLS;
	if (_oldCols == _newCols)
		return;
	// 사이즈 설정
	xeusCCTV.VIDEO_GRID_COLS = _newCols;
	xeusCCTV.VIDEO_GRID.options.min_cols = xeusCCTV.VIDEO_GRID_COLS;
	xeusCCTV.VIDEO_GRID.options.max_cols = xeusCCTV.VIDEO_GRID_COLS;

	xeusLayout.EAST = _width * xeusCCTV.VIDEO_GRID_COLS + 10;
	$('#overlay-east-contents').width(xeusLayout.EAST);

	xeusLayout.reLayout();

	var widgets = xeusCCTV.VIDEO_GRID.get_widgets_from_DOM();
	var _json = xeusCCTV.VIDEO_GRID.serialize();
	if(_json.length > 0){
		var _sorted = Gridster.sort_by_row_and_col_asc(_json);
		var _rows = _sorted.length / _newCols + 1;

		var _cnt = 0;
		for (_r = 1; _r <= _rows; _r++) {
			for (_c = 1; _c <= _newCols; _c++) {
				xeusCCTV.moveWidgetTo(widgets.$widgets, _sorted[_cnt]['id'], _c, _r);
				_cnt++;
				if (_cnt >= _sorted.length)
					break;
			}
			if (_cnt >= _sorted.length)
				break;
		}
		//
		xeusCCTV.VIDEO_GRID.clean_up_changed();
		xeusCCTV.VIDEO_GRID.generate_grid_and_stylesheet();
		xeusCCTV.VIDEO_GRID.init(); // 필수
	}
};

// video grid pane에서 empty slot을 찾는다.
// 신규 생성시 empty slot에 우선 생성한다.
xeusCCTV.getEmptyGridSlot = function(_json) {
	var _ROWS = Math.floor($(window).height() / xeusCCTV.cctv.SIZE.minHeight); // 버림
	var _slot = new Array(_ROWS);
	for (var x = 0; x < _slot.length; x++) {
		_slot[x] = new Array(xeusCCTV.VIDEO_GRID_COLS);
	}
	var _len = _json.length;
	for (var x = 0; x < _len; x++) {
		var _col = _json[x].col - 1;
		var _row = _json[x].row - 1;
		var _sx = _json[x].size_x;
		var _sy = _json[x].size_y;
		// _slot[_json[x].row][_json[x].col] = 'Y';
		for (var _r = _row; _r < (_row + _sy); _r++) {
			for (var _c = _col; _c < (_col + _sx); _c++) {
				// console.log("check : " + _r + " / " + _c);
				_slot[_r][_c] = 'Y';
			}
		}
	}
	for (var _r = 0; _r < _slot.length; _r++) {
		for (var _c = 0; _c < _slot[0].length; _c++) {
			if (_slot[_r][_c] != 'Y') {
				return '[r:' + _r + ',c:' + _c + ']';
			}
		}
	}
	return undefined;
};
