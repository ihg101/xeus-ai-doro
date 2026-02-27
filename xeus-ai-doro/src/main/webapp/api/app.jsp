<%@page import="org.json.simple.JSONObject"%>
<%@page import="org.json.simple.parser.JSONParser"%>
<%@page import="java.net.*,java.io.*,java.util.*" %>
<%@page session="false"%>
<%
	HttpURLConnection connection = null;
	InputStream istream = null;
	OutputStream ostream = null;
	InputStream ristream = null;
	OutputStream rostream = null;
	BufferedReader in = null;

	String type = request.getParameter("type");

	try {
		String resourceUrlStr = "http://argos.seocho.go.kr/v1/apkinfo/get/" + type;
		//resourceUrlStr = resourceUrlStr.replace("argos.seocho.go.kr", "55.55.62.101");

		URL resourceUrl = new URL(resourceUrlStr);
		connection = (HttpURLConnection)resourceUrl.openConnection();
		connection.setDoInput(true);
		connection.setRequestMethod(request.getMethod());

		in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		StringBuilder sb = new StringBuilder();
		String line;
		while((line = in.readLine()) != null) {
			sb.append(line);
		}

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(sb.toString());

		String link = (String) json.get("donwloadUri");
		//link = link.replace("argos.seocho.go.kr", "55.55.62.101");
		String fileName = (String) json.get("fileName");

		resourceUrl = new URL(link);
		connection = (HttpURLConnection)resourceUrl.openConnection();
		connection.setDoInput(true);
		connection.setRequestMethod(request.getMethod());

		response.setContentType(connection.getContentType());
		response.setHeader("Content-Disposition", "inline;filename=" + fileName);
		out.clear();
		out = pageContext.pushBody();
		ristream = connection.getInputStream();
		rostream = response.getOutputStream();
		final int length = 5000;
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
		if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
	}
%>