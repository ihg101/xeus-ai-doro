package geomex.xeus.security.interceptor;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * <pre>
 * 파일명 :  BrowserInterceptor.java
 * 설  명 :
 *
 *   브라우저 체크 인터셉터 입니다.
 *
 *   <b style="color: red;">모바일 페이지는 해당하지 않도록 해야 합니다.</b>
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2021-03-24      이주영          최초 생성
 *
 * </pre>
 *
 * @since   : 2021. 3. 24.
 * @version : 1.0
 * @see
 */

public class BrowserInterceptor extends HandlerInterceptorAdapter {

	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException {

		boolean result = false;

		String userAgent = req.getHeader("user-agent");
		String browser = "";

		if (userAgent.indexOf("Trident") > -1 || userAgent.indexOf("MSIE") > -1) {

			if (userAgent.indexOf("Trident/7") > -1) {
				browser = "IE 11";
			} else if (userAgent.indexOf("Trident/6") > -1) {
				browser = "IE 10";
			} else if (userAgent.indexOf("Trident/5") > -1) {
				browser = "IE 9";
			} else if (userAgent.indexOf("Trident/4") > -1) {
				browser = "IE 8";
			} else if (userAgent.indexOf("edge") > -1) {
				browser = "IE edge";
			}

		} else if (userAgent.indexOf("Whale") > -1) {
			browser = "WHALE " + userAgent.split("Whale/")[1].toString().split(" ")[0].toString();

			result = true;
		} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
			if (userAgent.indexOf("Opera") > -1) {
				browser = "OPERA " + userAgent.split("Opera/")[1].toString().split(" ")[0].toString();
			} else if (userAgent.indexOf("OPR") > -1) {
				browser = "OPERA " + userAgent.split("OPR/")[1].toString().split(" ")[0].toString();
			}
		} else if (userAgent.indexOf("Firefox") > -1) {
			browser = "FIREFOX " + userAgent.split("Firefox/")[1].toString().split(" ")[0].toString();
		} else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) { // 사파리
			if(userAgent.contains("CriOS")){
				browser = "Chrome for iOS " + userAgent.split("CriOS/")[1].toString().split(" ")[0].toString();

				result = true;
			}else{
				browser = "SAFARI " + userAgent.split("Safari/")[1].toString().split(" ")[0].toString();

				result = true;
			}
		} else if (userAgent.indexOf("NAVER") > -1) { // 사파리
			browser = "NAVER " + userAgent.split("NAVER/")[1].toString().split(" ")[0].toString();
		} else if (userAgent.indexOf("Chrome") > -1) {
			browser = "CHROME " + userAgent.split("Chrome/")[1].toString().split(" ")[0].toString();

			result = true;
		}

		if(!result) res.sendRedirect("/xeus/user/notSupportedBrowser.do");

		return result;
	}

}