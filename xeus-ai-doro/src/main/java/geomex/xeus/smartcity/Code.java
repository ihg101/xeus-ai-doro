package geomex.xeus.smartcity;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  Code.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 4.
 * 버전   :  1.0
 * 설명   :
 * 클래스 설명을 쓰시오
 *
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 * ===========================================================
 * </pre>
 */
public class Code {
    public static final byte RS = 0x1E; //rs
    public static final byte SEMICOLON = 0x3B; //세미콜론

    public static final char ASCII_RS = 0x1E;  //record seperator
    public static final char ASCII_US = 0x1F;  //unit seperator
    //
    //public static final String SEPTR = String.valueOf(ASCII_RS);    //구분자.
    public static final String DATA_SEPERATOR = String.valueOf(ASCII_RS);
    public static final String ARRAY_SEPERATOR = String.valueOf(ASCII_US);
    public static final String NULL_DATA = "";     //데이터 없음
    public static final String END_OF_DATA = ";";  //데이터 끝...
    public static final String NORMAL = "0";       //정상
    public static final String ERROR = "1";        //에러

    // 전문구분코드
    public static final String MSG_LOGIN = "99";  //로그인
    public static final String MSG_INCIDENT = "10";   //사건(재난)정보
    public static final String MSG_MOVEOUT = "20";   //출동정보
    public static final String MSG_LOCATE = "30";    //선탑차량 위치정보

    //진행구분코드
    public static final String STAT_LOGIN = "99";   //로그인 상태
    public static final String STAT_OCCUR = "10";   //발생
    public static final String STAT_CHANGE = "40";  //정보변경
    public static final String STAT_RELEASE = "50"; //해제
    public static final String STAT_CANCEL = "90";  //취소
    public static final String STAT_FINISH = "91";  //종료

    //송,수신 시스템
    public static final String SYS_SKT = "SKT";  //사회적 약자 송신시스템 SKT
    public static final String SYS_WP1 = "WP1";  //사회적 약자 송신시스템 WP1
    public static final String SYS_119 = "119";  //119 송신시스템 코드
    public static final String SYS_112 = "112";  //112 송싱시스템 코드
    public static final String SYS_UCP = "UCP";  //플랫폼
    public static final String SYS_DSC = "DSC";  //사회적 약자

    public static final String ERROR_USER = "사용자 또는 권한이 없습니다.";
    public static final String ERROR_EVENT = "발생유형이 잘못 되었습니다.";
    public static final String ERROR_UNKNOWN = "알수 없는 오류가 발생 하였습니다.";
    public static final String ERROR_INVALID_CD = "알수 없는 송수신 코드 입니다ㄴ.";

}
