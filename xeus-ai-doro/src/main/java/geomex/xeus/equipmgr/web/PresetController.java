package geomex.xeus.equipmgr.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.equipmgr.service.CctvModelService;
import geomex.xeus.equipmgr.service.CctvService;

/**
 * <pre>
 * 파일명 :  PresetController.java
 * 설  명 :
 *
 *   CCTV 프리셋을 제어합니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-03-12      이주영          최초 생성
 *
 * </pre>
 *
 * @since : 2021. 05. 13.
 * @version : 1.0
 * @see
 */

@Controller
@RequestMapping("/preset")
public class PresetController {

	@Resource(name = "CctvService")
	private CctvService cctvSvc;

	@Resource(name = "CctvModelService")
	private CctvModelService modelSvc;

	@Resource(name = "propService")
    private EgovPropertyService propService;

	/**
     * CCTV 프리셋을 제어합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
	@RequestMapping(value = "/getPresets.json")
    public JSONObject getPresets(HttpServletResponse response, Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	response.setContentType("application/json; charset=UTF-8");

    	JSONObject result = null;

    	BufferedReader in = null;

//    	String httpUrl = propService.getString("gate.url") + "/getPresets.json";
    	String httpUrl = "http://argos.seocho.go.kr/xeus-gate/getPresets.json";


    	try {
    		String cctvMgrNo = map.get("cctvMgrNo");
    		if(cctvMgrNo == null || "".equals(cctvMgrNo)){
    			result = new JSONObject();
    			result.put("result", false);
    			return result;
    		}

    		httpUrl += "?cctvMgrNo="+URLEncoder.encode(cctvMgrNo, "UTF-8");


    		URL url = new URL(httpUrl);

//TODO 실서버에서 주석 해제
//    		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//			conn.setRequestMethod("GET");
//			conn.setConnectTimeout(1000);
//			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
//
//			StringBuilder sb = new StringBuilder();
//            sb.setLength(0);
//            String line;
//            while((line = in.readLine()) != null) {
//                sb.append(line);
//            }
//            JSONParser parser = new JSONParser();
//            result = (JSONObject) parser.parse(sb.toString());
    		result = new JSONObject();
    		result.put("deviceId", 8707);
    		ArrayList<String> list = new ArrayList<String>();
    		list.add("1");
    		list.add("2");
    		list.add("3");

    		result.put("presets", list);



		} catch (Exception e) {
			e.printStackTrace();
			result = new JSONObject();
			result.put("result", false);
			return result;

		} finally {
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}

    	return result;
    }

    /**
     * Dahua CCTV PTZ를 제어합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/gotoPreset.json")
    public JSONObject gotoPreset(HttpServletResponse response, Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	response.setContentType("application/json; charset=UTF-8");

    	JSONObject result = null;

    	BufferedReader in = null;

//    	String httpUrl = propService.getString("gate.url") + "/getPresets.json";
    	String httpUrl = "http://argos.seocho.go.kr/xeus-gate/gotoPreset.json";


    	try {
    		String cctvMgrNo = map.get("cctvMgrNo");
    		String presetNo = map.get("presetNo");
    		if(cctvMgrNo == null || "".equals(cctvMgrNo)){
    			result = new JSONObject();
    			result.put("result", false);
    			return result;
    		}

    		if(presetNo == null || "".equals(presetNo)){
    			result = new JSONObject();
    			result.put("result", false);
    			return result;
    		}

    		httpUrl += "?cctvMgrNo="+URLEncoder.encode(cctvMgrNo, "UTF-8");
    		httpUrl += "&presetNo="+URLEncoder.encode(presetNo, "UTF-8");


    		URL url = new URL(httpUrl);


    		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setConnectTimeout(1000);
			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			StringBuilder sb = new StringBuilder();
            sb.setLength(0);
            String line;
            while((line = in.readLine()) != null) {
                sb.append(line);
            }
            JSONParser parser = new JSONParser();
            result = (JSONObject) parser.parse(sb.toString());


		} catch (Exception e) {
			e.printStackTrace();
			result = new JSONObject();
			result.put("result", false);
			return result;

		} finally {
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}

    	return result;
    }

}
