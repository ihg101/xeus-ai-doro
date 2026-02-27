<%@page import="java.io.BufferedOutputStream"%>
<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.net.URLConnection"%>
<%@page import="java.net.URL"%>
<%@page session="false"%>
<%@page trimDirectiveWhitespaces="false" %>
<%
	response.setContentType("image/jpeg");
	URL url = new URL("http://101.102.133.161:8080/" + request.getParameter("url"));

	BufferedInputStream bin = null;
	BufferedOutputStream bout = null;
	try{
		URLConnection conn = url.openConnection();

		bin = new BufferedInputStream(conn.getInputStream());
		bout = new BufferedOutputStream(response.getOutputStream());

		int ch =0;
		while(( ch = bin.read()) != -1) {
			bout.write(ch);
		}

		bout.flush();
	}catch(Exception e){
		e.printStackTrace();
	}finally{
		bin.close();
		bout.close();
		out.close();
	}
%>