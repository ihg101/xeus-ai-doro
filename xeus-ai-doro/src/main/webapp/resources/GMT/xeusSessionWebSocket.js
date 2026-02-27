/**
 *
 * ------------------------- WebSocket.readyState -------------------------
 *
 * WebSocket Wrapper 객체 입니다.
 * 객체 생성 후 create 메소드로 소켓에 연결 할 수 있습니다.
 * 연결이 해제 될 경우, 1초마다 계속 재접속합니다.
 *
 * CONNECTING	0	연결이 수립되지 않은 상태입니다.
 * OPEN			1	연결이 수립되어 데이터가 오고갈 수 있는 상태입니다.
 * CLOSING		2	연결이 닫히는 중 입니다.
 * CLOSED		3	연결이 종료되었거나, 연결에 실패한 경우입니다.
 *
 * ------------------------------------------------------------------------
 *
 * @auther 이주영
 */
var SessionWS = function(_Map){

	var _ConnURL, _XWS, _JSON, _this = null;
	var _isAlive = false;
	var _isDestroy = false;

	var _self = this;

	this.getURL = function(){ return this._ConnURL; }
	this.getJson = function(){ return this._JSON; }
	this.getWebSocket = function(){ return this._XWS; }
	this.isAlive = function(){ return this._isAlive; }

	/**
	 * 소켓을 연결합니다.
	 */
	this.create = function(url){
		_this = this;
		this._ConnURL = url;
		this._XWS = new WebSocket(url);
		this._XWS.onmessage = function(e){ _this.request(e); };
		this._XWS.onopen = function(e){ _this.open(e); };
		this._XWS.onclose = function(e){ _this.close(e); };
	}

	/**
	 * 연결이 완료되었을때의 콜백입니다.
	 */
	this.open = function(e){
		this._isAlive = true;
		this._isDestroy = false;

		var date = new Date();
		console.log(date.formatYMDHMS(date.getYMDHMS()) + " SessionWebSocket(" + this._ConnURL + ") Open.");

	}

	/**
	 * 서버에게 데이터를 받을 때 발생합니다.
	 */
	this.request = function(e){
		var _thisJson = null;
		try {
			this._JSON = JSON.parse(e.data);
			_thisJson = this._JSON;
		} catch (e) {
			var date = new Date();
			console.log(date.formatYMDHMS(date.getYMDHMS()) + " Json Parse Error.");
			console.log(e.data);
		}

		if("AdminNotice" in _thisJson){

			//{ "AdminNotice" : { "msg" : "긴급 서버 패치로 인하여 로그아웃 됩니다.", "action" : "signOut", "user" : "geomex" } }
			var msg = _thisJson.AdminNotice.msg;
			var action = _thisJson.AdminNotice.action;
			var user = _thisJson.AdminNotice.user;

			if(user.contains(userId)){
				if(action == "signOutNow"){
					$(parent)[0].parentWindow.onbeforeunload = null;
					$(parent)[0].location = "./GMT_user/signOutByAdmin.do?adminNotice=" + msg;

					return;
				}

				try{
					sysAlert(msg);
				}catch(e){
					alert(msg);
				}

				if(action == "reload"){
					$(parent)[0].parentWindow.onbeforeunload = null;
					$(parent)[0].location.reload();
				}

				if(action == "signOut"){
					$(parent)[0].parentWindow.onbeforeunload = null;
					$(parent)[0].location = "../GMT_user/signOut.do";
				}
			}
		}
	}

	/**
	 * 서버에게 데이터를 전송 할 때 호출합니다.
	 */
	this.send = function(param){
		this._XWS.send(param);
	}

	/**
	 * 접속이 끊겼을때 호출됩니다.
	 */
	this.close = function(){
		var _this = this;
		this._isAlive = false;
		var date = new Date();
		console.log(date.formatYMDHMS(date.getYMDHMS()) + " SessionWebSocket(" + this._ConnURL + ") Close.");

		//if(!this._isDestroy) this.reconnect();
		if(location.pathname.contains("/tvius/mobile/")){
			alert("보안 세션이 제거되어 로그인 페이지로 이동합니다.");
			location.href = "../../tvius/mobile/signOut.do";
		}else{
			window.onbeforeunload = null;
			location = "./GMT_user/signOut.do";
		}
	}

	/**
	 * 재시도 메소드 입니다.
	 */
	this.reconnect = function(){
		var _this = this;
		var _URL = this._ConnURL;
		/*setTimeout(function(){
			var date = new Date();
			console.log(date.formatYMDHMS(date.getYMDHMS()) + " SessionWebSocket try Connect.");
			_this.create(_URL);
		}, 1000);*/
	}

	/**
	 * 소켓을 완전히 닫습니다.
	 */
	this.destroy = function(){
		this._isDestroy = true;
		this._XWS.close();
	}

}