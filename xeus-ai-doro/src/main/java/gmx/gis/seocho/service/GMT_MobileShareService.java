package gmx.gis.seocho.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.equipmgr.service.CctvVo;

@Service
public class GMT_MobileShareService extends EgovAbstractServiceImpl {

	@Resource(name = "CctvService")
	private CctvService cctv;

	/**
	 * 영상공유 시작  REST API Handler.
	 *
	 * @param sysMap - SysProp Table Values
	 * @param params - REST API Query String Parameters
	 * @param action - REST API Sub URL (EX : /user/info)
	 * @return json - Response JSON Data
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public JSONObject getCctvShareOpen(String URL, Map<String, Object> params, String action) throws Exception{
		JSONObject result = new JSONObject();
		BufferedReader in = null;
		StringBuilder sb = new StringBuilder();

		try {
			String fullURL = URL + "v1/stream/open";

			URL url = new URL(fullURL);

			StringBuilder postData = new StringBuilder();
			for(Map.Entry<String, Object> param : params.entrySet()) {
				String key = param.getKey();
				String value = String.valueOf(param.getValue());

				if(postData.length() != 0) postData.append('&');


				postData.append(URLEncoder.encode(key, "UTF-8"));
				postData.append('=');
				postData.append(URLEncoder.encode(value, "UTF-8"));
			}

			byte[] postDataBytes = postData.toString().getBytes("UTF-8");

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setDoOutput(true);
			conn.getOutputStream().write(postDataBytes);

			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			String line;
			while((line = in.readLine()) != null) {
				sb.append(line);
			}

			JSONParser parser = new JSONParser();
			result = (JSONObject) parser.parse(sb.toString());

			if("true".equals(result.get("result")) || "true".equals(result.get("result"))){
	    		result.put("result", true);
	    	}else{
	    		result.put("error", result.get("message"));
	    		result.put("result", false);
	    	}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}

		return result;
	}

	/**
	 * 영상공유 종료   REST API Handler.
	 *
	 * @param sysMap - SysProp Table Values
	 * @param params - REST API Query String Parameters
	 * @param action - REST API Sub URL (EX : /user/info)
	 * @return json - Response JSON Data
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public JSONObject getCctvShareClose(String URL, Map<String, Object> params, String action) throws Exception{
		JSONObject result = new JSONObject();
		BufferedReader in = null;
		StringBuilder sb = new StringBuilder();

		try {
			String fullURL = URL + "v1/stream/close/index/"+ params.get("index");

			URL url = new URL(fullURL);
    		System.out.println("params : " +   params);

			StringBuilder postData = new StringBuilder();
			for(Map.Entry<String, Object> param : params.entrySet()) {
				if(postData.length() != 0) postData.append('&');
				postData.append(URLEncoder.encode(String.valueOf(params.get("index")), "UTF-8"));
			}

			byte[] postDataBytes = postData.toString().getBytes("UTF-8");

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setDoOutput(true);
			//conn.getOutputStream().write(postDataBytes);

			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			String line;
			while((line = in.readLine()) != null) {
				sb.append(line);
			}

			JSONParser parser = new JSONParser();
			result = (JSONObject) parser.parse(sb.toString());

			if("true".equals(result.get("result")) || "true".equals(result.get("result"))){
	    		result.put("result", true);
	    	}else{
	    		result.put("error", result.get("message"));
	    		result.put("result", false);
	    	}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}

		return result;
	}



	/**
	 * 영상공유 정보 - 모든채널   REST API Handler.
	 *
	 * @param sysMap - SysProp Table Values
	 * @param params - REST API Query String Parameters
	 * @param action - REST API Sub URL (EX : /user/info)
	 * @return json - Response JSON Data
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public JSONObject getCctvShareAll(String URL, Map<String, Object> params, String action) throws Exception{
		JSONObject result = new JSONObject();
		BufferedReader in = null;
		StringBuilder sb = new StringBuilder();

		try {
			String fullURL = URL + "v1/stream/all";

			URL url = new URL(fullURL);
    		System.out.println("params : " +   params);

//			StringBuilder postData = new StringBuilder();
//			for(Map.Entry<String, Object> param : params.entrySet()) {
//				if(postData.length() != 0) postData.append('&');
//				postData.append(URLEncoder.encode("cctvManagerNumber", "UTF-8"));
//				postData.append('=');
//				postData.append(URLEncoder.encode(String.valueOf(params.get("cctvMgrNo")), "UTF-8"));
//			}

			//byte[] postDataBytes = postData.toString().getBytes("UTF-8");

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setDoOutput(true);
			//conn.getOutputStream().write(postDataBytes);

			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			String line;
			while((line = in.readLine()) != null) {
				sb.append(line);
			}

			JSONParser parser = new JSONParser();

    		System.out.println("parser : " +   parser);
			//result = (JSONObject) parser.parse(sb.toString());
			JSONArray resultArray = (JSONArray) parser.parse(sb.toString());
    		System.out.println("resultArray : " +   resultArray);

    		///JSON 객체에 CCTV명 넣기
			for(int i=0; i<resultArray.size(); i++){
				JSONObject json = (JSONObject) resultArray.get(i);

	    		String cctvManagerNumber = (String)json.get("cctvManagerNumber");
	    		if(cctvManagerNumber == null || "".equals(cctvManagerNumber)){
	    			json.put("cctvNm", null);
	    			continue;
	    		}

			    HashMap<String, String> map = new HashMap<String, String>();
			    map.put("mgrNo",cctvManagerNumber);
			    CctvVo vo = cctv.getItem(map);

			    if(vo == null){
				    json.put("cctvNm", null);

			    }else{
				    json.put("cctvNm", vo.getCctvNm());
			    }

//			    String token = (String)result.get("token");
//			    String streamUrl = (String)result.get("streamUrl");
			}

			if(resultArray.size() >0){
				result.put("result", true);
				result.put("item", resultArray);

			}else{
	    		result.put("error", result.get("message"));
	    		result.put("result", false);
	    	}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}

		return result;
	}


}
