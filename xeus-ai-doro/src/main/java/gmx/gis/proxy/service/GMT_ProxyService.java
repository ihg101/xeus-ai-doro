package gmx.gis.proxy.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;

/**
 *
 * <pre>
 * GIS Engine 요청을 위한 Proxy 서비스 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Service
public class GMT_ProxyService extends EgovAbstractServiceImpl {

	private String DMZ_URL;
	private boolean DMZ_PROXY_ACTIVE = false;
	public boolean isDmzProxyActive(){ return this.DMZ_PROXY_ACTIVE; }

	private String GEOMEXWEB_URL;
	private String GEOMEXWEB_CONTEXT;
	private String GEOMEXWEB_FULL_URL;

	public final String WFS = "/wfs?";
	public final String EXTENSION = "/wfs/ext?";
	public final String ADD_LAYER = "/manage/layer/add?";
	public final String EDIT_LAYER = "/manage/layer/replace?";
	public final String REMOVE_LAYER = "/manage/layer/remove?";
	public final String REMOVE_FLUSH = "/manage/layer/flush?";

	@Autowired private EgovPropertyService prop;

	@PostConstruct
    public void init() throws Exception {
		DMZ_URL = prop.getString("dmz.url");
		if(!StringUtils.isEmpty(DMZ_URL)) DMZ_PROXY_ACTIVE = true;

		GEOMEXWEB_URL = prop.getString("engine.url");
		GEOMEXWEB_CONTEXT = prop.getString("engine.context");
		GEOMEXWEB_FULL_URL = GEOMEXWEB_URL + GEOMEXWEB_CONTEXT;
    }

	/**
	 * config.properties 파일에 기입된 정보를 리로드합니다.
	 *
	 * @return boolean
	 * @throws Exception
	 */
	public boolean updateProp() throws Exception {
		boolean result = true;

		try{
			prop.refreshPropertyFiles();

			DMZ_URL = prop.getString("dmz.url");
			if(!StringUtils.isEmpty(DMZ_URL)) DMZ_PROXY_ACTIVE = true;

			GEOMEXWEB_URL = prop.getString("engine.url");
			GEOMEXWEB_CONTEXT = prop.getString("engine.context");
			GEOMEXWEB_FULL_URL = GEOMEXWEB_URL + GEOMEXWEB_CONTEXT;
		}catch(Exception e){
			result = false;
		}

		return result;
	}

	/**
	 * 엔진 요청 파라미터를 바인딩&인코딩 처리 합니다.
	 *
	 * @param map
	 * @param kvSep
	 * @param elSep
	 * @return
	 */
	private static String joinWFSMap(Map<String, String> map, String kvSep, String elSep) {
		StringBuilder rtn = new StringBuilder();
		int i = 0;
		String encodeVal = "";
		for ( String key : map.keySet() ) {
			if ( i > 0 ) rtn.append(elSep);
			encodeVal = map.get(key);
			try {
				encodeVal = URLEncoder.encode(encodeVal, "UTF-8");
			} catch (Exception e) {}
			rtn.append(key.toUpperCase()).append(kvSep).append(encodeVal);
			i++;
		}
		return rtn.toString();
	}

	/**
	 * 일반 요청 파라미터를 바인딩&인코딩 처리 합니다.
	 *
	 * @param map
	 * @param kvSep
	 * @param elSep
	 * @return
	 */
	private static String joinMap(Map<String, String> map, String kvSep, String elSep, boolean isDmz) {
		StringBuilder rtn = new StringBuilder();
		int i = 0;
		String encodeVal = "";
		for ( String key : map.keySet() ) {
			encodeVal = map.get(key);

			if("url".equals(key)){
				rtn.append(encodeVal);
			}else{
				if(isDmz){
					rtn.append(elSep);
				}else{
					if ( i == 0 ) rtn.append("?");
					if ( i > 0 ) rtn.append(elSep);
				}

				try {
					encodeVal = URLEncoder.encode(encodeVal, "UTF-8");
				} catch (Exception e) {}
				rtn.append(key).append(kvSep).append(encodeVal);
				i++;
			}
		}
		return rtn.toString();
	}

	/**
	 * 레이어의 등록/수정/삭제 요청입니다.
	 *
	 * @param request
	 * @param response
	 * @param action
	 * @throws Exception
	 */
	public String makeLayerXML(String mode, String schema, String table, String layerNm) throws Exception {

		StringBuilder sb = new StringBuilder();
		if("add".equals(mode) || "edit".equals(mode)){
			sb.append("<Layer queryable=\"1\">");
			sb.append("<name>" + table + "</name>");
			sb.append("<nativeName>" + table + "</nativeName>");
			sb.append("<datastore>" + schema + "</datastore>");
			//sb.append("<fid>_gid</fid>");
			sb.append("<title>" + layerNm + "</title>");
			sb.append("<abstract>" + layerNm + "</abstract>");
			sb.append("<wms>true</wms>");
			sb.append("<wfs enable=\"true\">");
			sb.append("<operation>Insert</operation>");
			sb.append("<operation>Update</operation>");
			sb.append("<operation>Delete</operation>");
			sb.append("</wfs>");
			sb.append("<keywordList>");
			sb.append("<keyword>features</keyword>");
			sb.append("<keyword>" + table + "</keyword>");
			sb.append("</keywordList>");
			sb.append("<srs>EPSG:5186</srs>");
			sb.append("<boundingBox>");
			sb.append("<min_ye>0</min_ye>");
			sb.append("<max_ye>0</max_ye>");
			sb.append("<min_xn>0</min_xn>");
			sb.append("<max_xn>0</max_xn>");
			sb.append("</boundingBox>");
			//TODO 추후 WMS 사용시 스타일 생성해야함.
			//sb.append("<defaultStyle>" + table + "</defaultStyle>");
			sb.append("<defaultStyle>template_style</defaultStyle>");
			sb.append("<styles>");
			sb.append("<style>template_style</style>");
			sb.append("</styles>");
			sb.append("</Layer>");
		}else if("remove".equals(mode) || "flush".equals(mode)){
			sb.append(table);
		}

		return sb.toString();
	}

	/**
	 * URL Connection 을 요청합니다.
	 *
	 * @param request
	 * @param response
	 * @param url
	 * @throws IOException
	 */
	private void connection(HttpServletRequest request, HttpServletResponse response, String url) throws IOException {
		this.connection(request, response, url, false);
	}
	private void connection(HttpServletRequest request, HttpServletResponse response, String url, boolean isDmz) throws IOException {
		String method = request.getMethod().toUpperCase();

		HttpURLConnection connection = null;
    	InputStream istream = null;
    	OutputStream ostream = null;
    	InputStream ristream = null;
    	OutputStream rostream = null;

		try {
			if(isDmz && DMZ_PROXY_ACTIVE) url = DMZ_URL + url;

			URL resourceUrl = new URL(url);
			connection = (HttpURLConnection) resourceUrl.openConnection();
			connection.setDoInput(true);
			connection.setRequestMethod(method);

			Enumeration<String> headers = request.getHeaderNames();
			while ( headers.hasMoreElements() ) {
				String headerName = (String) headers.nextElement();

				//accept-encoding 헤더 값에 따라 카카오 장애 발생하여 헤더 제외
				if(headerName.toLowerCase().contains("accept-encoding")) continue;

				connection.setRequestProperty(headerName, request.getHeader(headerName));
			}
			if ( !"GET".equals(method) ) {
				connection.setDoOutput(true);
				IOUtils.copy(request.getInputStream(), connection.getOutputStream());
			}

			response.setContentType(connection.getContentType());

			ristream = connection.getInputStream();
			rostream = response.getOutputStream();
			final int length = 8192;
			byte[] bytes = new byte[length];
			int bytesRead = 0;
			while ((bytesRead = ristream.read(bytes, 0, length)) > 0) {
				rostream.write(bytes, 0, bytesRead);
			}

		} catch(Exception e) {
			response.setStatus(500);
			e.printStackTrace();
		} finally {
			if(istream != null) { istream.close(); }
			if(ostream != null) { ostream.close(); }
			if(ristream != null) { ristream.close(); }
			if(rostream != null) { rostream.close(); }
		}
	}

	/**
	 * 클라이언트의 요청에 맞게 WFS URL 요청합니다.
	 *
	 * @param request
	 * @param response
	 * @param action
	 * @throws Exception
	 */
	public void sendWFSData(HttpServletRequest request, HttpServletResponse response, String action) throws Exception {

		//String contextName = "xeus";

    	LinkedHashMap<String, String> paramMap = new LinkedHashMap<String, String>();

    	Enumeration<String> enu = request.getParameterNames();
    	while(enu.hasMoreElements()) {
    		String name = enu.nextElement();
    		String val = StringUtils.trimToEmpty(request.getParameter(name));
    		paramMap.put(name.toLowerCase(), val);
    	}

    	if(StringUtils.isNotEmpty(paramMap.get("typename"))){
    		//String[] typename = paramMap.get("typename").split(":");
    		//if ( typename.length > 1 ) contextName = typename[0];
    		if ( paramMap.get("featureid") != null ) paramMap.remove("typename");
    	}

    	String resourceUrlStr = "";
    	//resourceUrlStr = GEOMEXWEB_URL + contextName + action;
    	resourceUrlStr = GEOMEXWEB_FULL_URL + action;
    	resourceUrlStr += joinWFSMap(paramMap, "=", "&");

    	if(this.REMOVE_LAYER.equals(action)) resourceUrlStr = resourceUrlStr.replace("TYPENAME", "typename");

    	this.connection(request, response, resourceUrlStr);
	}

	/**
	 * 클라이언트의 요청에 맞게 Layer 관련 URL 요청을 합니다.
	 *
	 * @param request
	 * @param response
	 * @param action
	 * @throws Exception
	 */
	public String sendLayerData(String action, String param) throws Exception {

		String resourceUrlStr = GEOMEXWEB_FULL_URL;
		if("add".equals(action)) resourceUrlStr += this.ADD_LAYER +  "body=" + URLEncoder.encode(param, "UTF-8");
		if("edit".equals(action)) resourceUrlStr += this.EDIT_LAYER + "body=" + URLEncoder.encode(param, "UTF-8");
		if("remove".equals(action)) resourceUrlStr += this.REMOVE_LAYER + "layer=" + URLEncoder.encode(param, "UTF-8");
		if("flush".equals(action)) resourceUrlStr += this.REMOVE_FLUSH + "layer=" + URLEncoder.encode(param, "UTF-8");

		return resourceUrlStr;
	}
	public void sendLayerData(HttpServletRequest request, HttpServletResponse response, String action, String param) throws Exception {

		String resourceUrlStr = GEOMEXWEB_FULL_URL;
		if("add".equals(action)) resourceUrlStr += this.ADD_LAYER +  "body=" + URLEncoder.encode(param, "UTF-8");
		if("edit".equals(action)) resourceUrlStr += this.EDIT_LAYER + "body=" + URLEncoder.encode(param, "UTF-8");
		if("remove".equals(action)) resourceUrlStr += this.REMOVE_LAYER + "layer=" + URLEncoder.encode(param, "UTF-8");
		if("flush".equals(action)) resourceUrlStr += this.REMOVE_FLUSH + "layer=" + URLEncoder.encode(param, "UTF-8");

		this.connection(request, response, resourceUrlStr);
	}

	/**
	 * 일반 API, TILE 등의 요청을 처리합니다.
	 *
	 * 필수) url = 실제 요청 URL
	 *
	 * @param request
	 * @param response
	 * @param url
	 * @throws Exception
	 */
	public void sendData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.sendData(request, response, false);
	}
	public void sendData(HttpServletRequest request, HttpServletResponse response, boolean isDmz) throws Exception {

		LinkedHashMap<String, String> paramMap = new LinkedHashMap<String, String>();

		Enumeration<String> enu = request.getParameterNames();
		while(enu.hasMoreElements()) {
			String name = enu.nextElement();
			String val = request.getParameter(name);
			paramMap.put(name, val);
		}

		String resourceUrlStr = joinMap(paramMap, "=", "&", isDmz);

		this.connection(request, response, resourceUrlStr, isDmz);
	}

	/**
	 * GIS Engine 에 레이어 정보를 등록/수정/삭제 합니다.
	 *
	 * @param mode
	 * @param schema
	 * @param table
	 * @param layerNm
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public JSONObject manageLayer(String mode, String schema, String table, String layerNm) throws Exception{

		JSONObject result = new JSONObject();
		result.put("result", false);

		if(StringUtils.isEmpty(mode)) result.put("responseXML", "Magage method is required.");
		if(StringUtils.isEmpty(schema)) result.put("responseXML", "Magage target schema is required.");
		if(StringUtils.isEmpty(table)) result.put("responseXML", "Magage target table is required.");
		if(StringUtils.isEmpty(layerNm)) layerNm = "Unknown";

		String sendURL = this.sendLayerData(mode, this.makeLayerXML(mode, schema, table, layerNm));
		BufferedReader in = null;

		try {
			URL url = new URL(sendURL);

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setDoOutput(true);
			in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			StringBuilder sb = new StringBuilder();
            sb.setLength(0);
            String line;
            while((line = in.readLine()) != null) {
                sb.append(line);
            }

            String resultXML = sb.toString();
            result.put("responseXML", resultXML);
            if(resultXML.contains("success")) result.put("result", true);
            //if(resultXML.contains("Layer already exists")) result.put("result", false);


		} catch (Exception e) {
			result.put("responseXML", "Unknown");
			result.put("result", false);
			e.printStackTrace();
		} finally {
			if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		}

		return result;
	}

}
