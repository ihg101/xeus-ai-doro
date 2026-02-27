/**
 * <pre>
 * public 으로 관리되는 객체 입니다.
 * 타이머, 인터렉션 등의 기능과 연관됩니다.
 * 각 상세 기능은 대분류 파일 단위로 관리합니다.
 *
 * 예) xeusGlobal-CCTV.js
 * 	   xeusGlobal-NMS.js
 *     xeusGlobal-EVT.js
 * </pre>
 *
 * @auther 이주영
 */

//2017.11.16 by khkim, console 함수 추가
var console = window.console || {
	log : function() {
	}
};


if (window.Public == null) var Public = {

	/**
	 * <pre>
	 * 이벤트를 종료합니다.
	 *
	 * 이 메소드는 각 이벤트가 시작(Start Function)될때 정의해야 합니다.
	 * </pre>
	 */
	StopEvent : null

}

/**
 * 180509 이은규
 * 기존 영상반출 페이지에 있던 기능을 map.jsp에 모두 담기 위해 global에 추가.
 * 영상반출용 interval용 객체를 담을 변수를 생성.
 *
 * setTimeout용 변수 생성
 * 페이지 벗어날 시 setTimtout 종료를 컨트롤하기 위함
 * 공통으로 쓰이는 js파일에 추가하여 전역으로 컨트롤 함.
 */
var intervalListChk = null;		//반출건 영상리스트 확인
var intervalPrevDown = null;	//미리보기 영상반출 확인
var intervalStat = null;		//상태체크 값 확인
var intervalPrev = null;		//미리보기 영상 유무 확인
var intervalRqst = null;		//반출신청 영상 유무 확인
var intervalService = null;		//서버 생존신고 확인

var crmsHeatLayer = null;		//영상반출 히트맵용 레이어 저장 변수
var crmsCarSchSource = null;
var crmsCarSchLayer = null;		//영상반출 차량운행검색용 레이어 저장 변수

var statCctvHeatLayer = null;	//통계용 CCTV 히트맵 레이어 저장 변수
var statEvtHeatLayer = null;	//통계용 이벤트 히트맵 레이어 저장 변수

/*var eventVectorSource = null;
var eventVectorLayer = null;*/
