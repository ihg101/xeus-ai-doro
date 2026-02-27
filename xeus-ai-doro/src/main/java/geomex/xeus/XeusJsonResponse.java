package geomex.xeus;

import java.io.Writer;

/**
 * <pre>
 * @파일명 :  XeusJsonResponse.java
 * @작성자 :  김경호
 * @작성일 :  2017. 3. 22.
 * @설명   :  
 *   클래스 설명을 쓰시오
 * 
 * @수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 
 * </pre>
 *
 * @version : 1.0
 * @see
 */

public interface XeusJsonResponse {

    public void writeJSON(Writer writer) throws Exception;

}
