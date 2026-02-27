<%@page language="java" pageEncoding="UTF-8"%>
<%@page session="false"%>
<%@page import="java.net.URL"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.IOException"%>
<%@page import="java.util.Collection"%>
<%@page import="java.io.OutputStream"%>
<%@page import="java.util.Enumeration"%>
<%@page import="java.util.LinkedHashMap"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="org.apache.commons.io.IOUtils"%>
<!--
  * 2차 경유 DMZ Proxy 기능을 담당합니다.
  * DMZ 서버를 경유하여 Proxy 기능을 이용해야 할 경우 본 파일을 DMZ 서버에 이동하여 운영하시면 됩니다.
  *
  * 또한 config.properties 파일에서 dmz.url 부분에 본 JSP가 셋팅된 전체 경로를 기입해야 합니다.
  *
  * 만약, DMZ 서버 경유 없이 WAS 서버에서만 처리될 경우 GMT_ProxyController 내의 /dmz 를 이용할 수 있습니다.
  * 이 경우, config.properties 파일에서 dmz.url 부분을 공백으로 기입해야 합니다.
  *
  * @author 이주영
-->
<%!
private static String joinMap(Map<String, String> map, String kvSep, String elSep) {
	StringBuilder rtn = new StringBuilder();
	int i = 0;
	String encodeVal = "";
	for ( String key : map.keySet() ) {
		encodeVal = map.get(key);

		if("url".equals(key)){
			rtn.append(encodeVal);
		}else{
			if ( i == 0 ) rtn.append("?");
			if ( i > 0 ) rtn.append(elSep);
			try {
				encodeVal = URLEncoder.encode(encodeVal, "UTF-8");
			} catch (Exception e) {}
			rtn.append(key).append(kvSep).append(encodeVal);
			i++;
		}
	}
	return rtn.toString();
}
%>
<%
String method = request.getMethod().toUpperCase();

HttpURLConnection connection = null;
InputStream istream = null;
OutputStream ostream = null;
InputStream ristream = null;
OutputStream rostream = null;

String resourceUrlStr = "";

try {
	LinkedHashMap<String, String> paramMap = new LinkedHashMap<String, String>();

	Enumeration<String> enu = request.getParameterNames();
	while(enu.hasMoreElements()) {
		String name = enu.nextElement();
		String val = request.getParameter(name);
		paramMap.put(name, val);
	}

	resourceUrlStr = joinMap(paramMap, "=", "&");

	URL resourceUrl = new URL(resourceUrlStr);
	connection = (HttpURLConnection) resourceUrl.openConnection();
	connection.setDoInput(true);
	connection.setRequestMethod(method);

	Enumeration<String> headers = request.getHeaderNames();
	while ( headers.hasMoreElements() ) {
		String headerName = (String) headers.nextElement();

		//accept-encoding 헤더 값이 존재할경우 카카오 요청시 장애가 발생하기 때문에 헤더항목에서 제외합니다.
		if(headerName.toLowerCase().contains("accept-encoding")) continue;

		connection.setRequestProperty(headerName, request.getHeader(headerName));
	}

	if ( !"GET".equals(method) ) {
		connection.setDoOutput(true);
		IOUtils.copy(request.getInputStream(), connection.getOutputStream());
	}

	out.clear();
	out = pageContext.pushBody();

	String contentType = connection.getContentType();
	response.setContentType(contentType);

	Map<String, List<String>> responseHeaders = connection.getHeaderFields();
	for (Map.Entry<String, List<String>> entry : responseHeaders.entrySet()) {
		if(entry.getKey() != null && !"null".equals(entry.getKey()) && !"Transfer-Encoding".equals(entry.getKey())){
			response.setHeader(entry.getKey(), connection.getHeaderField(entry.getKey()));
		}
	}

	ristream = connection.getInputStream();
	rostream = response.getOutputStream();

	if(connection.getResponseCode() > 400){
		ristream = connection.getErrorStream();
	}

	final int length = 8192;
	byte[] bytes = new byte[length];
	int bytesRead = 0;
	while ((bytesRead = ristream.read(bytes, 0, length)) > 0) {
		rostream.write(bytes, 0, bytesRead);
	}

} catch(Exception e) {
	e.printStackTrace();
	response.setStatus(200);
	response.setContentType("application/json");
	response.getWriter().write("{ \"result\" : false, \"isDmz\" : true, \"apiUrl\" : \"" + resourceUrlStr + "\", \"errorMsg\" : \"" + e.getMessage() + "\" }");
} finally {
	if(istream != null) { istream.close(); }
	if(ostream != null) { ostream.close(); }
	if(ristream != null) { ristream.close(); }
	if(rostream != null) { rostream.close(); }
}
%>