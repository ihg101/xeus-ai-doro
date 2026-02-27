//xeus 전역 설정 정보....

//xeusCCTV.VIDEO_GRID_COLS
//cctv 영상수신 websocket url
//var VIDEO_WEBSOCKET_URL ='ws://127.0.0.1:8080/xeus/stream';
//55.55.61.101
var isOuterUser = "N";
var IP = "101.102.104.114";
if(location.host == "222.107.208.134"){
	IP = "222.107.208.134";
	isOuterUser = "Y";
}else if(location.host == "argos.seocho.go.kr"){
	IP = "argos.seocho.go.kr";
	isOuterUser = "Y";
}else if(location.host == "172.27.143.199"){
	IP = "172.27.143.199";
}
var VIDEO_WEBSOCKET_URL ='ws://' + IP + '/xeus-gate/stream';
var VIDEO_POPUP_PLAYER_LIMIT = 3;
//외부 접속 IP 확인, 외부 접속일 경우 proxy 요청을 해제한다.
var CHK_EXTERNAL_HOST = "222.107.208.134";
//98.22.24.60 행정망
//55.55.56.101
var Proxy = "";
if(location.host != "argos.seocho.go.kr" && location.host != "222.107.208.134" && !location.host.contains("98.22.24.60") && !location.host.contains("127.0.0.1")){
	Proxy = "http://55.55.56.101:30000/wmsProxy.jsp?url=";
}

//203.142.127.240(방재센터) >

//맵 프록시 요청 URL
//사용안함!! 프로그램 내부에있는 tmsProxyController에서 대신 요청함.
//var MAP_PROXY_URL = 'http://127.0.0.1:8081/xeus-map';
//맵 프록시 요청 여부
var MAP_PROXY_CHK = true;

//전용플레이어 설치 여부 확인
var TERUTEN_CHK = false;
var TERUTEN_VERSION = "1.0.3.4";

//로드뷰 사용가능 체크
//false일 경우 로드뷰 사용 불가 처리
var DAUM_ROADVIEW_CHK = true;

var SYMBOL_TEXT_CHK = {
	eventView : {
		cctv : false,
		cctvAngle : false
	},
	tviusView : {
		cctv : false,
		cctvAngle : false
	},
	tviusMngView : {
		cctv : false,
		cctvAngle : false
	},
	nmsView : {
		cctv : false,
		cctvAngle : false,
		infra : false,
		infraCctv : false,
		infraWifi : false,
		infraLora : false
	},
	bigdataView : {
		cctv : false,
		cctvAngle : false
	},
	boardView : {
		cctv : false,
		cctvAngle : false
	},
	statView : {
		cctv : false,
		cctvAngle : false
	}
}

//default animation delay
var ANI_DELAY = 250;
var ANI_DELAY_FAST = 100;
//cctv 모니터링 서브메뉴 사이즈
var CCTV_BTN_CCTV_SCH_WEST_SIZE = 450;
var CCTV_BTN_LGD_MNG_WEST_SIZE = 450;
var CCTV_BTN_PTR_VIEW_WEST_SIZE = 450;
var CCTV_BTN_FCS_VIEW_WEST_SIZE = 450;
var CCTV_BTN_PRB_CAR_WEST_SIZE = 450;

var CCTV_BTN_PTR_VIEW_EAST_SIZE = 600;
var CCTV_BTN_FCS_VIEW_EAST_SIZE = 600;
var CCTV_BTN_CCTV_MNG_EAST_SIZE = 600;
var CCTV_BTN_CCTV_PRST_EAST_SIZE = 600;
var CCTV_BTN_PRB_CAR_EAST_SIZE = 600;

//이벤트 모니터링 서브메뉴 사이즈
var EVNT_BTN_MONITOR_VIEW_WEST_SIZE = 550; /* 181203 : 700 -> 550 사이즈 수정 */
var EVNT_BTN_BELL_VIEW_WEST_SIZE = 450;
var EVNT_BTN_SAFE_VIEW_WEST_SIZE = 450;
var EVNT_BTN_CAR_VIEW_WEST_SIZE = 450;
var EVNT_BTN_SOUND_VIEW_WEST_SIZE = 450;
var EVNT_BTN_EVTLOG_VIEW_WEST_SIZE = 700;
var CCTV_BTN_CCTV_PRV_WEST_SIZE = 450;

var EVNT_BTN_DISASTER_VIEW_WEST_SIZE = 800;
var EVNT_BTN_112REC_VIEW_WEST_SIZE = 800;
var EVNT_BTN_112STAT_VIEW_WEST_SIZE = 900;

//빅데이터분석 서브메뉴 사이즈
var EVNT_BTN_BIGDATA_VIEW_WEST_SIZE = 450;
var EVNT_BTN_BIGDATA_HIST_VIEW_WEST_SIZE = 900;
var CCTV_BTN_BIGDATA_INSTALL_EAST_SIZE = 450;
var CCTV_BTN_BIGDATA_RESULT_EAST_SIZE = 60;
var CCTV_BTN_BIGDATA_COVID_EAST_SIZE = 450;

//장비관리(NMS) 서브메뉴 사이즈
var NMS_BTN_NMG_MONITOR_VIEW_WEST_SIZE = 650;
var NMS_BTN_CHECK_REG_VIEW_WEST_SIZE = 450;
var NMS_BTN_CHECK_LIST_VIEW_WEST_SIZE = -1;
var NMS_BTN_MOBILE_LIST_VIEW_WEST_SIZE = 700;
var NMS_BTN_SITE_VIEW_WEST_SIZE = 1100;
var NMS_BTN_INFRA_VIEW_WEST_SIZE = 550;
var NMS_BTN_CCTV_MNG_WEST_SIZE = 450;
var NMS_BTN_CABLE_VIEW_WEST_SIZE = 550;
var NMS_BTN_NMS_VIEW_WEST_SIZE = 450;
var NMS_BTN_FNMS_VIEW_WEST_SIZE = 450;
var NMS_BTN_UMBRL_VIEW_WEST_SIZE = 550;

//영상반출 서브메뉴 사이즈
var TVIUS_BTN_CCTV_SCH_WEST_SIZE = 450;/* 171214 : 350 -> 450 사이즈 수정*/
var TVIUS_BTN_LGD_MNG_WEST_SIZE = 450;
var TVIUS_BTN_TVIUS_REG_WEST_SIZE = 850;/* 180123 : 750 -> 850 사이즈 수정*/
var TVIUS_BTN_TVIUS_VIEW_WEST_SIZE = -1;
var TVIUS_BTN_EXT_VIEW_WEST_SIZE = -1;
var TVIUS_BTN_EVI_VIEW_WEST_SIZE = 750;
var TVIUS_BTN_TVIUS_URGENT_REG_WEST_SIZE = 850;
var TVIUS_BTN_TVIUS_HEAT_WEST_SIZE = 500;
var TVIUS_BTN_TVIUS_CAR_SCH_WEST_SIZE = 450;

//통계조회 서브메뉴 사이즈
var STAT_BTN_CCTV_HEAT_WEST_SIZE = 550;