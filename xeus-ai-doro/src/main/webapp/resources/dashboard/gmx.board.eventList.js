/**
 * 수위 정보 API 모듈입니다.
 *
 * @author 민동현
 */

"use strict";

if(window.GMXBOARD == null) window.GMXBOARD = {};
var EVENT_SOCKET= null;
(function(GMXBOARD){



	var _INTERVAL_ = null;
	var _INTERVAL_TIME_ = 60000;
	var _ELEMENT_ID_ = "eventList";

	var _EVENT_TYPE_LIST = [];



	/**
	 * 해당 사이트의 이벤트 타입 리스트를 가져와서 변수에 set한다
	 */
	var setEventTypeList = function(){

		var param = {authGbn : "3. 이벤트 권한"};

		$.ajax({
			type : "POST",
			url : "../auth/getList.json",
			data : param,
			async   : false,
			success : function(json) {
				for(var i=0; i<json.result.length; i++){
					_EVENT_TYPE_LIST.push(json.result[i].authData);
				}

			},
			error : function(xhr, status, error){
				console.err("/auth/getList.json error")
			}
		});
	}

	GMXBOARD.startEventListInterval = function(){
		if(window.WIDGET) {
			setEventTypeList();
			WIDGET.getPastEventListWidget($("#eventList"), _EVENT_TYPE_LIST);
		}
		else{
			if(_INTERVAL_ != null){
				clearInterval(_INTERVAL_);
				_INTERVAL_ = null;
			}
			console.err("WIDGET 객체가 없습니다.");
			return;
		}


		if(_INTERVAL_ != null){
			clearInterval(_INTERVAL_);
			_INTERVAL_ = null;
		}

		_INTERVAL_ = setInterval(function(){
			setEventTypeList();
			WIDGET.getPastEventListWidget($("#eventList"), _EVENT_TYPE_LIST);
		}, _INTERVAL_TIME_);
	}


	GMXBOARD.stopEventListInterval = function(){
		if(_INTERVAL_ != null){
			clearInterval(_INTERVAL_);
			_INTERVAL_ = null;
		}
	}

	/**
	 * 데이터 갱신 주기를 설정합니다.
	 * 데이터 갱신중일 경우 자동 재시작 합니다.
	 */
	GMXBOARD.setIntervalTime = function(ms){
		_INTERVAL_TIME_ = ms;

		if(_INTERVAL_ != null) GMXBOARD.startEventListInterval();
	}


	$(document).ready(function(){

		if($("#"+_ELEMENT_ID_).length == 0) {
			GMXBOARD.stopEventListInterval();
			console.error(_ELEMENT_ID_+" ELEMENT가 없습니다.");
			return false;
		};

		/**
		 * 이벤트 웹소켓 생성
		 */
		if(window.EVENT_SOCKET == null){
			window.EVENT_SOCKET = new XeusWS();
			window.EVENT_SOCKET.create("ws://" + location.host + "/xeus/event");
		}


		GMXBOARD.startEventListInterval();

	});
})(window.GMXBOARD);