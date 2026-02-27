package gmx.gis.seocho.web;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.system.annotation.NoSession;
import geomex.xeus.util.code.SystemParameter;
import gmx.gis.api.service.GMT_RestAPIService;
import gmx.gis.seocho.service.GMT_MobileShareService;
import gmx.gis.sysmgr.service.GMT_ListHashMapVo;

/**
 *
 * <pre>
 * CCTV 모바일 영상공유를 위한 REST API를 제공합니다.
 * </pre>
 *
 * @author 김훈식
 *
 */
@Controller
@RequestMapping("/GMT_mobileshare")
public class GMT_MobileShareController {

	@Autowired private GMT_MobileShareService mss;

    @Resource(name = "sysPropService")
    private SysPropService param;

	private HashMap<String, String> sysMap;

	private String mobileShareUrl;

	@PostConstruct
    public void initIt() throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        this.mobileShareUrl = sysMap.get("cctv.mobileshare.url");
    }


	/**
	 * 영상공유 시작.
	 *
	 * @param response
	 * @param mode
	 * @param map
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/api/open")
	public void getShareOpen(HttpServletResponse res, HttpServletRequest req, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	res.setContentType("application/json; charset=UTF-8");

    	String url = req.getRequestURI().replace("/v1/stream/open", "");
    	Map<String, Object> params = new LinkedHashMap<String, Object>();


    	Set<String> key = map.keySet();
    	Iterator<String> itr = key.iterator();
    	while(itr.hasNext()){
    		String k = itr.next();
    		String v = map.get(k);
    		params.put(k, v);
		}

    	JSONObject result = mss.getCctvShareOpen(mobileShareUrl,params, url);

    	if((Boolean)result.get("result") == true ){
    		result.put("result", true);
    		result.put("statEvetTypCd", "MBS");
    	}else{
    		result.put("error", result.get("message"));
    		result.put("result", false);
    		result.put("statEvetTypCd", "MBS");
    	}
    	res.getWriter().print(result.toString());

	}

	/**
	 * 영상공유 종료.
	 *
	 * @param response
	 * @param mode
	 * @param map
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/api/close")
	public void getShareClose(HttpServletResponse res, HttpServletRequest req, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	res.setContentType("application/json; charset=UTF-8");

    	String url = req.getRequestURI().replace("/v1/stream/close/index", "");
    	Map<String, Object> params = new LinkedHashMap<String, Object>();


    	Set<String> key = map.keySet();
    	Iterator<String> itr = key.iterator();
    	while(itr.hasNext()){
    		String k = itr.next();
    		String v = map.get(k);
    		params.put(k, v);
		}

    	JSONObject result = mss.getCctvShareClose(mobileShareUrl,params, url);

    	if((Boolean)result.get("result") == true){
    		result.put("result", true);
    	}else{
    		result.put("error", result.get("message"));
    		result.put("result", false);
    	}
    	res.getWriter().print(result.toString());

	}

	/**
	 * 영상공유 조회.
	 *
	 * @param response
	 * @param mode
	 * @param map
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/api/list")
	public void getShareAll(HttpServletResponse res, HttpServletRequest req, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	res.setContentType("application/json; charset=UTF-8");

    	String url = req.getRequestURI().replace("/v1/stream/all", "");
    	Map<String, Object> params = new LinkedHashMap<String, Object>();


    	Set<String> key = map.keySet();
    	Iterator<String> itr = key.iterator();
    	while(itr.hasNext()){
    		String k = itr.next();
    		String v = map.get(k);
    		params.put(k, v);
		}

    	JSONObject result = mss.getCctvShareAll(mobileShareUrl,params, url);

    	JSONArray ja = new JSONArray();
    	JSONObject  js = new JSONObject();
    	js.put("x","0.0");
    	js.put("y","0.0");
    	ja.add(js);


    	if((Boolean)result.get("result") == true ){
    		result.put("result", true);
    		result.put("item", result.get("item"));
    		result.put("statEvetTypCd", "MBS");
    		result.put("statEvetOutbDtm", "20210101000000");
    		result.put("outbPos", ja);

    	}else{
    		result.put("error", result.get("message"));
    		result.put("result", false);
    		result.put("statEvetTypCd", "MBS");
    		result.put("statEvetOutbDtm", "20210101000000");
    		result.put("outbPos",ja);
    	}
    	res.getWriter().print(result.toString());

	}


}
