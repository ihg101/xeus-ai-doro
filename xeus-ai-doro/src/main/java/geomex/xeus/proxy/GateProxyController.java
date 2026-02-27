package geomex.xeus.proxy;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.util.code.DateUtil;

@Controller
@RequestMapping("/gateProxy")
public class GateProxyController {

	@Resource(name = "propService")
    private EgovPropertyService propService;

	/**
	 * XEUS-Gateway Proxy 입니다.
	 * 파라미터중 요청주소(path)는 필수사항입니다.
	 *
	 * 예) path = getTSP
	 *
	 * @param response
	 * @param request
	 */
    @RequestMapping(value = "/xeusGateWay.json", method = RequestMethod.POST)
    public void xeusGateWay(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	BufferedReader in = null;

    	try {
    		URL url = new URL(propService.getString("gate.url") + map.get("path") + ".json");
    		//Map<String, Object> params = new LinkedHashMap<>();
    		//params.put("token", map.get("token"));
    		map.put("userId", (String) session.getAttribute("userId"));

    		StringBuilder postData = new StringBuilder();
    		postData.append(URLEncoder.encode("userId", "UTF-8"));
    		postData.append('=');
    		postData.append(URLEncoder.encode(String.valueOf(map.get("userId")), "UTF-8"));
    		for(String key : map.keySet()){
        		if(!"path".equals(key) && !"userId".equals(key)){
        			postData.append('&');
        			postData.append(URLEncoder.encode(key, "UTF-8"));
        			postData.append('=');
        			postData.append(URLEncoder.encode(String.valueOf(map.get(key)), "UTF-8"));
    			}
        	}

    		byte[] postDataBytes = postData.toString().getBytes("UTF-8");

    		HttpURLConnection conn = (HttpURLConnection)url.openConnection();
    		conn.setRequestMethod("POST");
    		conn.setRequestProperty("userId", (String) session.getAttribute("userId"));
    		conn.setDoOutput(true);
    		conn.getOutputStream().write(postDataBytes); // POST 호출

    		in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

    		StringBuilder sb = new StringBuilder();
    		String line;
    		while((line = in.readLine()) != null) {
    			sb.append(line);
    		}

    		JSONParser parser = new JSONParser();
    		if("getPresets".equals(map.get("path"))){
    			JSONArray json = (JSONArray) parser.parse(sb.toString());
    			model.addAttribute("result", json);

    		}else if("gotoPreset".equals(map.get("path")) || "setPTZ".equals(map.get("path"))){
    			model.addAttribute("result", true);

    		}else if("insertPreset".equals(map.get("path")) || "updatePreset".equals(map.get("path")) || "removePreset".equals(map.get("path"))){
    			model.addAttribute("result", true);

    		}else{
    			JSONObject json = (JSONObject) parser.parse(sb.toString());
    			model.addAttribute("result", json);
    		}
    	} catch (Exception e) {
    		model.addAttribute("result", false);
    		e.printStackTrace();
		} finally {
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}
    }

    /**
     * 스틸컷을 요청하여 리턴합니다.
     *
     * @param req
     * @param session
     * @param map
     * @return
     */
	@RequestMapping("/getShapshot.json")
    public ResponseEntity<byte[]> getShapshot(HttpServletRequest req, HttpSession session, @RequestParam HashMap<String, String> map) {

        HttpHeaders headers = new HttpHeaders();
        ByteArrayOutputStream baos = null;
        byte[] media = null;
        try {
        	String type = map.get("fileType");
        	if(type != null && !"".equals(type) && "viewer".equals(type)){
        		headers.setContentType(MediaType.IMAGE_JPEG);
        		//headers.add("Content-Disposition", "inline;filename=" + map.get("cctvMgrNo") + "_" + DateUtil.getStrSec() + ".jpg");
        	}else{
        		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        		headers.add("Content-Disposition", "inline;filename=" + map.get("cctvMgrNo") + "_" + DateUtil.getStrSec() + ".jpg");
        	}


            String url = propService.getString("gateway.url") + map.get("path") + ".json";
            url += "?cctvMgrNo=" + map.get("cctvMgrNo");
            url += "&userId=" + (String) session.getAttribute("userId");

            URL imgURL = new URL(url);
            BufferedImage img = ImageIO.read(imgURL);
            baos = new ByteArrayOutputStream();
            ImageIO.write(img, "jpg", baos);
            baos.flush();
            media = baos.toByteArray();
            baos.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            IOUtils.closeQuietly(baos);
        }

        ResponseEntity<byte[]> responseEntity = new ResponseEntity<byte[]>(media, headers, HttpStatus.OK);
        return responseEntity;
    }

}
