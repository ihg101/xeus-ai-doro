package geomex.xeus.security.interceptor;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * <pre>
 * 파일명 :  DomainInterceptor.java
 * 설  명 :
 *
 *   도메인 체크 인터셉터 입니다.
 *   PC 버전 및 모바일 버전에 맵핑된 도메인을 체크합니다.
 *
 *   <b style="color: red;">현재는 서초구만 대상 서비스 합니다.</b>
 *   <b style="color: red;">불필요시 해당 클래스를 제거해주세요.</b>
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2021-01-06      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2021. 1. 6.
 * @version :  1.0
 * @see
 */

public class DomainInterceptor extends HandlerInterceptorAdapter {

	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException{

		boolean result = false;

		String domain = req.getServerName();

		// 1. 서초 도메인
		if(domain.equals("argos.seocho.go.kr")
		|| domain.equals("cctv.seocho.go.kr")
		|| domain.equals("capture.seocho.go.kr")

		// 2. 서초 유관기관 및 유관부서
		|| domain.equals("101.102.104.113") // 1. 폐쇄
		|| domain.equals("101.102.104.119") // 1. 폐쇄
		|| domain.equals("172.27.143.199")  // 2. 행정
		|| domain.equals("98.22.24.60")     // 3. 소방

		// 3. 개발용
		|| domain.equals("127.0.0.1")
		|| domain.equals("localhost")

		// 4. 지오멕스
		|| domain.contains("10.1.74.")
		|| domain.contains("10.1.73.")
		|| domain.contains("192.168.0.")
		|| domain.contains("210.101.103.")
		){

			result = true;

		}


		return result;
	}

}