package geomex.xeus.security.interceptor;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import geomex.xeus.system.annotation.NoSession;

/**
 * <pre>
 * 파일명 :  SessionInterceptor.java
 * 설  명 :
 *
 *   세션체크 인터셉터 입니다.
 *   스프링 설정(context-mapservice.xml)의 세션 인터셉터 설정 부에서,
 *   exclude를 설정하지 않은 경우, NoSession 어노테이션을 검증합니다.
 *   NoSession 설정 컨트롤러 메소드는, 세션체크를 제외합니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-22      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */

public class SessionInterceptor extends HandlerInterceptorAdapter {

	@SuppressWarnings("unchecked")
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws IOException{

		boolean result = true;

		String reqUrl = req.getRequestURL().toString();
		boolean isAjax = "XMLHttpRequest".equals(req.getHeader("X-Requested-With")) ? true : false;

		boolean isContains = false;
		String[] exclude = {"/xeus/cctv/cctvmap", "/xeus/gisProxy", "/xeus/wfs", "/xeus/wms", "/xeus/feed","/xeus/stream"};
		for(int i=0; i<exclude.length; i++){
			if(reqUrl.contains(exclude[i])){
				isContains = true;
				break;
			}
		}

		if(!isContains){
			try{
				NoSession noSession = ((HandlerMethod) handler).getMethodAnnotation(NoSession.class);
				if(noSession == null){
					if(req.getSession().getAttribute("userId") == null){

						if(reqUrl.endsWith(".json")){
							res.setCharacterEncoding("UTF-8");
							res.setContentType("application/json; charset=UTF-8");
							PrintWriter out = res.getWriter();
							JSONObject json = new JSONObject();
							json.put("error", "세션이 존재하지 않습니다.\n로그인 후 다시한번 시도해 주십시오.");
							json.put("notSession", false);
							out.print(json);
							out.flush();
							out.close();

							result = false;

						}else{

							if(isAjax){
								res.setCharacterEncoding("UTF-8");
								res.setContentType("application/json; charset=UTF-8");
								PrintWriter out = res.getWriter();
								JSONObject json = new JSONObject();
								json.put("error", "세션이 존재하지 않습니다.\n로그인 후 다시한번 시도해 주십시오.");
								json.put("notSession", false);
								out.print(json);
								out.flush();
								out.close();
							}else{
								res.sendRedirect("/xeus/user/login.do");
							}

							result = false;
						}

					}
				}
			}catch(Exception e){}
		}

		return result;
	}

}