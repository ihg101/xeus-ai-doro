<%@page import="java.net.*,java.io.*,java.util.*" %>
<%@page session="false"%>
<%
	HttpURLConnection connection = null;
	InputStream istream = null;
	OutputStream ostream = null;
	InputStream ristream = null;
	OutputStream rostream = null;
	BufferedReader in = null;

	try {
		URL resourceUrl = new URL(request.getParameter("url") + request.getParameter("fileNm"));

		connection = (HttpURLConnection)resourceUrl.openConnection();
		connection.setDoInput(true);
		connection.setRequestMethod("POST");

		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "inline;filename=" + request.getParameter("fileNm"));

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