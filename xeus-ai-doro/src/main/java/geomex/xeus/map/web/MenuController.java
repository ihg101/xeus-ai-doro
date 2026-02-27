package geomex.xeus.map.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.rte.fdl.property.EgovPropertyService;
/**
 *
 * <pre>
 * 메뉴(대메뉴, 소메뉴)를 관리합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping
public class MenuController {

	@Autowired private EgovPropertyService prop;

	/**
	 * <pre>
	 * 메인 지도 뷰를 리턴합니다.
	 *
	 * <b style='color:red;'>Proxy 설정 흐름은 다음과 같습니다.</b>
	 *
	 * 1. 개발자가 config.properties 파일의 proxy.include, proxy.exclude 설정값을 이용하여 Proxy 여부를 설정합니다.
	 * 2. 만약 운영 환경에서 해당 값을 변경할 경우 브라우저에서 갱신 URL(/xeus/GMT_proxy/updateProp)을 수동으로 호출하여 실시간 갱신할 수 있습니다.
	 * 3. 세션에 proxy 여부를 추가합니다.
	 * 4. common.jsp 에서 세션 여부를 확인합니다.
	 * 5. 대매뉴.jsp 에서 common.jsp 에 설정된 proxy 여부를 리소스 페이지로 전송합니다.
	 * 6. 대매뉴 별 resource.jsp 에서 해당 값을 이용하여 최종 proxy 처리 합니다. (javascript function 호출)
	 * </pre>
	 *
	 * @return String - JSP View
	 */
	@RequestMapping(value = "/{menu}.do")
    public String view(HttpServletRequest req, Model model, HttpSession session, @PathVariable String menu, @RequestParam(required = false, defaultValue = "false") boolean proxy) throws Exception {
		String domain = req.getServerName();
		String referer = req.getHeader("referer");
		if(!StringUtils.isEmpty(referer)){
			referer = referer.replaceAll("(?i:https?://([^/]+)/.*)", "$1");

			if(referer.contains(":")) referer = referer.split(":")[0];
		}

		String includeList[] = null;
		String excludeList[] = null;

		String include = prop.getString("proxy.include");
		String exclude = prop.getString("proxy.exclude");

		if(!StringUtils.isEmpty(include)) includeList = include.split("/");
		if(!StringUtils.isEmpty(exclude)) excludeList = exclude.split("/");

		if(includeList != null && includeList.length > 0){
			for(String includeURL : includeList){

				if(proxy) break;

				if(domain.equals(includeURL)){
					int containsCount = 0;
					if(excludeList != null && excludeList.length > 0){
						for(String excludeURL : excludeList){
							if(excludeURL.equals(referer)){
								containsCount++;
							}
						}
					}

					if(containsCount == 0){
						proxy = true;
					}else{
						proxy = false;
					}
				}
			}
		}

		session.setAttribute("proxy", proxy);

        return "/menu/" + menu;
    }

}
