package geomex.xeus.security.interceptor;

import geomex.xeus.log.service.AccessService;
import geomex.xeus.log.service.AccessVo;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.AuthVo;
import geomex.xeus.util.code.DateUtil;

import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * <pre>
 * 파일명 :  AccessLogInterceptor.java
 * 설  명 :
 *
 *   모든 요청에 대한 접속 로그를 기록하는 인터셉터 입니다.
 *   요청 URL에 따른 auth_id 를 DB에서 조회하여 기록합니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-22      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 13.
 * @version :  1.0
 * @see
 */
public class AccessLogInterceptor extends HandlerInterceptorAdapter {

	@Resource(name = "authService")
	private AuthService authService;

	@Resource(name = "accessService")
    private AccessService service;

	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		HttpSession session = request.getSession();
		String userId = (String) session.getAttribute("userId");
		String userIp = (String) session.getAttribute("userIp");

		AccessVo vo = new AccessVo();
		vo.setUsrId(userId);
		vo.setConnIp(userIp);
		vo.setAllowYn("Y");
		vo.setUseTime(DateUtil.getStrSec());

		String reqUrl = request.getRequestURI().toString();

		boolean isContain = false;
		String[] include = {".do", ".json", ".xml"};
		String[] exclude = {".css", ".js",
							"/wfs", "/wms", "/cctvmap",
							".png", ".jpg", ".gif", ".ico"};

		for(int i=0; i<include.length; i++){
			if(reqUrl.endsWith(include[i])){
				isContain = true;
				break;
			}
		}
		if(isContain){
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("authData", reqUrl);
			AuthVo authVo = authService.getItem(map);
			if(authVo != null){
				vo.setAuthMgrNo(authVo.getAuthMgrNo());
				vo.setRmark(authVo.getAuthNm());
				service.add(vo);
			}
		}

		return true;
	}

}
