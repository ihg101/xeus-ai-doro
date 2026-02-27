package geomex.xeus.system.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <pre>
 * 파일명 :  Auth.java
 * 설  명 :
 *
 *   세션체크를 제외하는 어노테이션 입니다.
 *   인터셉터에서 사용되며,
 *   <b>exclude로 관리하지 않을 경우 사용됩니다.<b>
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface NoSession {

	boolean value() default true;

}
