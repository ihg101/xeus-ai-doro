<%@page session="false"%>
<%@page import="java.net.*,java.io.*,java.util.*" %>
<%
	HttpURLConnection connection = null;
	InputStream istream = null;
	OutputStream ostream = null;
	InputStream ristream = null;
	OutputStream rostream = null;

	String uSvcOutbId = request.getParameter("uSvcOutbId");

	try {
		String resourceUrlStr = "http://101.102.131.112:8092/api/ucity/event/" + uSvcOutbId + "/clear";

		URL resourceUrl = new URL(resourceUrlStr);
		connection = (HttpURLConnection)resourceUrl.openConnection();
		connection.setDoInput(true);
		connection.setRequestMethod("GET");
		connection.setRequestProperty("aKey", "ke/BEV+ISruZTGOyHtOdIXENzIruDYr7lCgb+PurOYL2KFK/um9mHhBoSQGQxO5+dk462FO9kqBdU0kbLgm64A==");
		response.setContentType(connection.getContentType());
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
	}
%>