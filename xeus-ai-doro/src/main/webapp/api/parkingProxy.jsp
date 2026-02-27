<%@page session="false"%>
<%@page import="java.net.*,java.io.*,java.util.*" %>
<%
	HttpURLConnection connection = null;
	InputStream istream = null;
	OutputStream ostream = null;
	InputStream ristream = null;
	OutputStream rostream = null;

	String mode = request.getParameter("mode");

	try {
		String resourceUrlStr = "http://101.102.133.161:5002/api/lot_status";
		if("rbox".equals(mode)){
			resourceUrlStr = "http://101.102.133.161:5002/api/rbox_relative_stats/-1?cctv_id=1";
		}

		URL resourceUrl = new URL(resourceUrlStr);
		connection = (HttpURLConnection)resourceUrl.openConnection();
		connection.setDoInput(true);
		connection.setRequestMethod(request.getMethod());
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