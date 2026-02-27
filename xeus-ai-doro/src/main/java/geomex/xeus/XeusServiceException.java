package geomex.xeus;

/**
 * <pre>
 * 파일명 :  XeusServiceException.java
 * 설  명 :  
 *   클래스 설명을 쓰시오
 * 
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-08      김경호          최초 생성
 *
 * </pre>
 *
 * @since : 2016. 12. 8.
 * @version : 1.0
 * @see
 */

public class XeusServiceException extends Exception {

    private static final long serialVersionUID = -2867249032854513476L;

    private String msg = "HandlerException";

    public XeusServiceException() {}

    public XeusServiceException(String msg) {
        super();
        this.msg = msg;
    }

    @Override
    public String toString() {
        return msg;
    }

}
