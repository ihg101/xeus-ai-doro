package gmx.gis.proxy;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.axis.utils.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.system.annotation.NoSession;
import gmx.gis.proxy.service.GMT_ProxyService;

/**
 *
 * <pre>
 * URL Proxy 를 담당합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/GMT_proxy")
public class GMT_ProxyController {

	@Autowired
	private GMT_ProxyService proxy;

	/**
	 * Properties 값을 갱신합니다.
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@NoSession
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/updateProp")
	public void updateProp(HttpServletResponse response) throws Exception {
		JSONObject result = new JSONObject();
		result.put("result", proxy.updateProp());

    	response.setContentType("application/json");
    	response.getWriter().write(result.toString());
	}

	/**
	 * WFS를 요청합니다.
	 *
	 * 예) /wfs?parameters
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/wfs")
	public void wfs(HttpServletRequest request, HttpServletResponse response) throws Exception {

		proxy.sendWFSData(request, response, proxy.WFS);

	}

	/**
	 * 엔진 Extension 객체에 WFS 를 요청합니다.
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/wfsExt")
    public void wfsExt(HttpServletRequest request, HttpServletResponse response) throws Exception {

    	proxy.sendWFSData(request, response, proxy.EXTENSION);

    }

	/**
	 * 엔진 Extension 객체에 레이어 추가/수정/삭제를 요청합니다.
	 *
	 * @param response
	 * @throws Exception
	 */
    @SuppressWarnings("unchecked")
	@RequestMapping(value = "/layer/{mode}")
    public void setLayer(HttpServletResponse response, @PathVariable String mode, @RequestParam String schema, @RequestParam String table, @RequestParam(required=false) String layerNm) throws Exception {

    	if(StringUtils.isEmpty(layerNm)) layerNm = "Unknown";

    	JSONObject result = null;
    	if("add".equals(mode) || "edit".equals(mode) || "remove".equals(mode)){
    		result = proxy.manageLayer(mode, schema, table, layerNm);
    	}else{
    		result = new JSONObject();
    		result.put("result", false);
    		result.put("responseXML", "Unknown URL");
    	}

    	response.setContentType("application/json");
    	response.getWriter().write(result.toString());

    }

    /**
     * 일반 API, TILE 등의 요청을 처리합니다.
     *
     * DMZ를 절대로 거치지 않기 때문에 내부 Proxy 용도로 이용하기 적합합니다.
	 *
	 * 필수) url = 실제 요청 URL
     *
     * @param request
     * @param response
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/sendData")
    public void sendData(HttpServletRequest request, HttpServletResponse response) throws Exception {

    	proxy.sendData(request, response);

    }

    /**
     * 일반 API, TILE 등의 요청을 DMZ 서버에 요청합니다.
     *
     * DMZ 활성화 여부에 따라 DMZ로 요청합니다.
     *
     * 외부 API 등의 용도에 적합합니다.
     *
     * 필수) url = 실제 요청 URL
     *
     * @param request
     * @param response
     * @throws Exception
     */
    @NoSession
	@RequestMapping(value = "/dmz")
    public void dmz(HttpServletRequest request, HttpServletResponse response) throws Exception {

    	if(proxy.isDmzProxyActive()){
    		proxy.sendData(request, response, true);
    	}else{
    		proxy.sendData(request, response, false);
    		/*JSONObject result = new JSONObject();
    		result.put("result", false);
    		result.put("msg", "DMZ proxy module is not activated.");

    		response.setContentType("application/json");
        	response.getWriter().write(result.toString());*/
    	}

    }

}