package geomex.xeus.dashboard.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.util.code.SystemParameter;

/**
 * <pre>
 * 파일명 :  ApiController.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 12. 13.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/api")
public class ApiController {

	@Resource(name = "sysPropService")
    private SysPropService param;

	//api proxy 요청 정보
	private String apiProxyChk;
	private String apiProxyUrl;
	//api 요청 key
	private String apiDataKey;
	//api 요청 url
    private String apiAirStationUrl;
    private String apiAirUrl;
    private String apiWeatherUrl;
    private String apiSateliteUrl;
    private String apiRaderUrl;
    private String apiTyphoonUrl;

    @PostConstruct
    public void initIt() throws Exception {

    	HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        this.apiProxyChk = sysMap.get("api.proxy.chk");
        this.apiProxyUrl = sysMap.get("api.proxy.url");
        this.apiDataKey = sysMap.get("api.data.key");
        this.apiAirStationUrl = sysMap.get("api.air.station.url");
        this.apiAirUrl = sysMap.get("api.air.url");
        this.apiWeatherUrl = sysMap.get("api.weather.url");
        this.apiSateliteUrl = sysMap.get("api.satelite.url");
        this.apiRaderUrl = sysMap.get("api.rader.url");
        this.apiTyphoonUrl = sysMap.get("api.typhoon.url");
    }

	/**
	 * 대기측정소 정보 API 입니다.
	 * @param response
	 * @param request
	 */
    @ResponseBody
    @RequestMapping(value = "/getAirStation.xml", method = RequestMethod.POST)
    public void getAirStation(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();
        ArrayList<String> key = new ArrayList<String>();
        //key.add("1Z9obcR8EGXo9ofkrWXb2PnzEjzj5RTd6TeYmoLdLDlgPB%2Fd1YsS5xKjP8qDwaDKNuvKmgJCYZTNXvhFwzJUFg%3D%3D");
        //key.add("iGA37XV0omBu7Yl%2F8Hb8FtII%2BKXqxQw8cwrk3mCSnnyBTTOCaB3TTKXqUeOQ2hHWgydV7YRbWUHpH%2BIViHQWKg%3D%3D");
        key.add(apiDataKey);

        for(int i=0; i<key.size(); i++){
            try {
            	String url = "";
            	if("Y".equals(apiProxyChk)){
                	url += apiProxyUrl;
                	url += "?url=" + apiAirStationUrl;
                	url += "&key=" + apiDataKey;
            	} else {
            		url += apiAirStationUrl;
                    url += "?ServiceKey=" + key.get(i);
            	}

            	url += "&pageNo=1";
                url += "&numOfRows=1";
            	Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + request.getParameter(name);
                    }
                }

                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }
                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }

    }

    /**
     * 측정소별 대기오염 정보 API 입니다.
     *
     * @param response
     * @param request
     */
    @ResponseBody
    @RequestMapping(value = "/getAir.xml", method = RequestMethod.POST)
    public void getAir(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();
        ArrayList<String> key = new ArrayList<String>();
        //key.add("1Z9obcR8EGXo9ofkrWXb2PnzEjzj5RTd6TeYmoLdLDlgPB%2Fd1YsS5xKjP8qDwaDKNuvKmgJCYZTNXvhFwzJUFg%3D%3D");
        //key.add("iGA37XV0omBu7Yl%2F8Hb8FtII%2BKXqxQw8cwrk3mCSnnyBTTOCaB3TTKXqUeOQ2hHWgydV7YRbWUHpH%2BIViHQWKg%3D%3D");
        key.add(apiDataKey);

        for(int i=0; i<key.size(); i++){
            try {

            	String url = "";
            	if("Y".equals(apiProxyChk)){
                	url += apiProxyUrl;
                	url += "?url=" + apiAirUrl;
                	url += "&key=" + apiDataKey;
            	} else {
            		url += apiAirUrl;
                    url += "?ServiceKey=" + key.get(i);
            	}

                url += "&dataTerm=daily";
                url += "&pageNo=1";
                url += "&numOfRows=10";
                url += "&ver=1.3";

                Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + URLEncoder.encode(request.getParameter(name), "UTF-8");
                    }
                }

                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }
                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }
    }

    /**
     * 위치별 날씨정보 API 입니다.
     * @param response
     * @param request
     */
    @RequestMapping(value = "/getWeather.xml", method = RequestMethod.POST)
    public void getWeather(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();

        ArrayList<String> key = new ArrayList<String>();
        //key.add("1Z9obcR8EGXo9ofkrWXb2PnzEjzj5RTd6TeYmoLdLDlgPB%2Fd1YsS5xKjP8qDwaDKNuvKmgJCYZTNXvhFwzJUFg%3D%3D");
        //key.add("iGA37XV0omBu7Yl%2F8Hb8FtII%2BKXqxQw8cwrk3mCSnnyBTTOCaB3TTKXqUeOQ2hHWgydV7YRbWUHpH%2BIViHQWKg%3D%3D");
        key.add(apiDataKey);

        for(int i=0; i<key.size(); i++){
            try {
            	String url = "";
            	if("Y".equals(apiProxyChk)){
                	url += apiProxyUrl;
                	url += "?url=" + apiWeatherUrl;
                	url += "&key=" + apiDataKey;
            	} else {
            		url += apiWeatherUrl;
                    url += "?ServiceKey=" + key.get(i);
            	}
                //String url = apiWeatherUrl;
                //url += "?ServiceKey=" + key.get(i);
                url += "&numOfRows=11";
                url += "&pageNo=1";

                Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + request.getParameter(name);
                    }
                }
                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }

                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }
    }

    /**
     * ITS 공사 정보 API 입니다.
     * @param response
     * @param request
     */
    @ResponseBody
    @RequestMapping(value = "/getItsGong.xml", method = RequestMethod.POST, produces="text/xml;charset=UTF-8")
    public void getItsGong(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();

        ArrayList<String> key = new ArrayList<String>();
        key.add("1491196318076");

        for(int i=0; i<key.size(); i++){
            try {
                String url = "http://openapi.its.go.kr/api/NEventIdentity";
                url += "?key=" + key.get(i);
                url += "&ReqType=2";
                url += "&type=its";

                Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + URLEncoder.encode(request.getParameter(name), "UTF-8");
                    }
                }

                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }
                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }
    }

    /**
     * ITS 사고 정보 API 입니다.
     * @param response
     * @param request
     */
    @ResponseBody
    @RequestMapping(value = "/getItsSa.xml", method = RequestMethod.POST, produces="text/xml;charset=UTF-8")
    public void getItsSa(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();

        ArrayList<String> key = new ArrayList<String>();
        key.add("1491196318076");

        for(int i=0; i<key.size(); i++){
            try {
                String url = " http://openapi.its.go.kr/api/NIncidentIdentity";
                url += "?key=" + key.get(i);
                url += "&ReqType=2";
                url += "&type=its";

                Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + URLEncoder.encode(request.getParameter(name), "UTF-8");
                    }
                }

                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }
                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }
    }

    /**
     * 천리안 기상위성 영상정보 API 입니다.
     * @param response
     * @param request
     */
    @RequestMapping(value = "/getInsightSatelite.xml", method = RequestMethod.POST)
    public void getInsightSatelite(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();

        ArrayList<String> key = new ArrayList<String>();
        //key.add("1Z9obcR8EGXo9ofkrWXb2PnzEjzj5RTd6TeYmoLdLDlgPB%2Fd1YsS5xKjP8qDwaDKNuvKmgJCYZTNXvhFwzJUFg%3D%3D");
        //key.add("iGA37XV0omBu7Yl%2F8Hb8FtII%2BKXqxQw8cwrk3mCSnnyBTTOCaB3TTKXqUeOQ2hHWgydV7YRbWUHpH%2BIViHQWKg%3D%3D");
        key.add(apiDataKey);

        for(int i=0; i<key.size(); i++){
            try {
            	String url = "";
            	if("Y".equals(apiProxyChk)){
                	url += apiProxyUrl;
                	url += "?url=" + apiSateliteUrl;
                	url += "&key=" + apiDataKey;
            	} else {
            		url += apiSateliteUrl;
                    url += "?ServiceKey=" + key.get(i);
            	}
                //String url = apiSateliteUrl;
                //url += "?ServiceKey=" + key.get(i);
                url += "&sat=C";
                url += "&area=k";
            	//url += "&data=vis";

                Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + request.getParameter(name);
                    }
                }
                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }

                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }
    }

    /**
     * 레이더 영상정보 API 입니다.
     * @param response
     * @param request
     */
    @RequestMapping(value = "/getRadarCompositionImage.xml", method = RequestMethod.POST)
    public void getRadarCompositionImage(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();

        ArrayList<String> key = new ArrayList<String>();
        //key.add("1Z9obcR8EGXo9ofkrWXb2PnzEjzj5RTd6TeYmoLdLDlgPB%2Fd1YsS5xKjP8qDwaDKNuvKmgJCYZTNXvhFwzJUFg%3D%3D");
        //key.add("iGA37XV0omBu7Yl%2F8Hb8FtII%2BKXqxQw8cwrk3mCSnnyBTTOCaB3TTKXqUeOQ2hHWgydV7YRbWUHpH%2BIViHQWKg%3D%3D");
        key.add(apiDataKey);

        for(int i=0; i<key.size(); i++){
            try {
            	String url = "";
            	if("Y".equals(apiProxyChk)){
                	url += apiProxyUrl;
                	url += "?url=" + apiRaderUrl;
                	url += "&key=" + apiDataKey;
            	} else {
            		url += apiRaderUrl;
                    url += "?ServiceKey=" + key.get(i);
            	}
                //String url = apiRaderUrl;
                //url += "?ServiceKey=" + key.get(i);
            	url += "&data=CMP_WRC";

                Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + request.getParameter(name);
                    }
                }

                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }

                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }
    }

    /**
     * 태풍정보조회 API 입니다.
     * @param response
     * @param request
     */
    @RequestMapping(value = "/getTyphoonInformation.xml", method = RequestMethod.POST)
    public void getTyphoonInformation(HttpServletResponse response, HttpServletRequest request) {
        response.setContentType("text/xml; charset=UTF-8");
        BufferedReader in = null;
        StringBuilder sb = new StringBuilder();

        ArrayList<String> key = new ArrayList<String>();
        //key.add("1Z9obcR8EGXo9ofkrWXb2PnzEjzj5RTd6TeYmoLdLDlgPB%2Fd1YsS5xKjP8qDwaDKNuvKmgJCYZTNXvhFwzJUFg%3D%3D");
        //key.add("iGA37XV0omBu7Yl%2F8Hb8FtII%2BKXqxQw8cwrk3mCSnnyBTTOCaB3TTKXqUeOQ2hHWgydV7YRbWUHpH%2BIViHQWKg%3D%3D");
        key.add(apiDataKey);

        for(int i=0; i<key.size(); i++){
            try {
            	String url = "";
            	if("Y".equals(apiProxyChk)){
                	url += apiProxyUrl;
                	url += "?url=" + apiTyphoonUrl;
                	url += "&key=" + apiDataKey;
            	} else {
            		url += apiTyphoonUrl;
                    url += "?ServiceKey=" + key.get(i);
            	}
                //String url = apiTyphoonUrl;
                //url += "?ServiceKey=" + key.get(i);
            	url += "&numOfRows=10";
            	url += "&pageNo=1";

                Enumeration<?> enu = request.getParameterNames();
                while(enu.hasMoreElements()) {
                    String name = (String)enu.nextElement();
                    if("url".equalsIgnoreCase(name) == false) {
                        url = url + "&" + name + "=" + request.getParameter(name);
                    }
                }

                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection)obj.openConnection();
                con.setConnectTimeout(5000);
                con.setRequestMethod("GET");
                in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

                sb.setLength(0);
                String line;
                while((line = in.readLine()) != null) {
                    sb.append(line);
                }

                response.getWriter().print(sb.toString());
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        }
    }

}
