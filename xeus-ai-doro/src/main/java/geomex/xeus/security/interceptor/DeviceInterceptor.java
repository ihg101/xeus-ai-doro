package geomex.xeus.security.interceptor;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.mobile.device.Device;
import org.springframework.mobile.device.DeviceUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * <pre>
 * 파일명 :  DeviceInterceptor.java
 * 설  명 :
 *
 *   디바이스 체크 인터셉터 입니다.
 *   모바일 단말기만 접속해야 하는 URL을 체크합니다.
 *
 *   <b style="color: red;">현재는 서초구 영상반출 모바일 서비스만 대상입니다.</b>
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

public class DeviceInterceptor extends HandlerInterceptorAdapter {

	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException{

		boolean result = true;

		String domain = req.getServerName();
		String reqUrl = req.getRequestURL().toString();

		if(domain.equals("cctv.seocho.go.kr") || domain.equals("101.102.104.113")){

			if(!reqUrl.contains("/tvius/mobile/warning") // 1. 에러 페이지 예외
			&& !reqUrl.contains("/tvius/mobile/getLoginToken") // 2. 로그인 토큰 뷰
			&& !reqUrl.contains("/tvius/mobile/setTokenRegeneration") // 3. 토큰 재생성 요청
			){

				Device device = DeviceUtils.getCurrentDevice(req);

				if(reqUrl.contains("/tvius/mobile")){

					if(!device.isNormal()){

						// 1. 이미지 반출 체크
//						if(reqUrl.contains("/tvius/mobile/getUsrTviusImageRqst.do")){
//							if(!device.isTablet()){
//								res.sendRedirect("/xeus/tvius/mobile/warningDevice.do");
//								return false;
//							}
//						}

					}else{
						res.sendRedirect("/xeus/tvius/mobile/warning.do");
						return false;
					}
				}

			}

		}

		return result;
	}

}