<%@page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page session="false"%>
<%@page trimDirectiveWhitespaces="false" %>
<%@page import="java.net.*,java.io.*,java.util.*" %>
<%
BufferedReader in = null;

String mode = request.getParameter("mode");
String schTyp = request.getParameter("schTyp");
String schParam = request.getParameter("schParam");

StringBuilder sb = new StringBuilder();
try {
	String resourceUrlStr = "http://101.102.133.161:5001/api/camera/all";
	if("search".equals(mode)) resourceUrlStr = "http://101.102.133.161:5001/api/search/" + schTyp;
	if("prev".equals(mode))   resourceUrlStr = "http://101.102.133.161:5001/api/search/" + schTyp + "/prev?" + schParam;
	if("next".equals(mode))   resourceUrlStr = "http://101.102.133.161:5001/api/search/" + schTyp + "/next?" + schParam;

	if(!"prev".equals(mode) && !"next".equals(mode)){
		int isFirst = 1;
		Enumeration enu = request.getParameterNames();
		while(enu.hasMoreElements()){
			String name = (String) enu.nextElement();
			if(isFirst == 1){
				resourceUrlStr += "?" + name + "=" + request.getParameter(name);
				isFirst++;
			}else{
				resourceUrlStr += "&" + name + "=" + request.getParameter(name);
			}
		}
	}

	URL url = new URL(resourceUrlStr);

	StringBuilder postData = new StringBuilder();

	byte[] postDataBytes = postData.toString().getBytes("UTF-8");

	HttpURLConnection conn = (HttpURLConnection)url.openConnection();
	conn.setRequestMethod("POST");
	conn.setDoOutput(true);
	conn.getOutputStream().write(postDataBytes); // POST 호출

	in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

	String line;
	while((line = in.readLine()) != null) {
		sb.append(line);
	}

} catch (Exception e) {
	e.printStackTrace();
} finally {
	if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
}
%>
<%= sb.toString() %>