<%@page session="false"%>
<%@page import="java.net.*,java.io.*,java.util.*" %>
<%
	HttpURLConnection connection = null;
	InputStream istream = null;
	OutputStream ostream = null;
	InputStream ristream = null;
	OutputStream rostream = null;

	try {
		if(request.getParameter("url") != null && request.getParameter("url") != "") {
			boolean isKaKao = false;
			boolean isSafe = false;

			String resourceUrlStr = request.getParameter("url");
			if(resourceUrlStr.contains("dapi.kakao.com")) isKaKao = true;
			if(resourceUrlStr.contains("safemap.go.kr")) isSafe = true;

			int isFirst = 1;
			Enumeration enu = request.getParameterNames();
			while(enu.hasMoreElements()) {
				String name = (String) enu.nextElement();
				String andStr = "&";
				if(name.equalsIgnoreCase("url") == false) {
					if(isFirst == 1){
						andStr = "?";
						isFirst++;
					}

					if(isKaKao){
						resourceUrlStr = resourceUrlStr + andStr + name + "=" + URLEncoder.encode(request.getParameter(name), "UTF-8");
					}else if(isSafe){
						andStr = "&";
						resourceUrlStr = resourceUrlStr + andStr + name + "=" + request.getParameter(name);
					}else{
						resourceUrlStr = resourceUrlStr + andStr + name + "=" + request.getParameter(name);
					}
				}
			}

			URL resourceUrl = new URL(resourceUrlStr);
			connection = (HttpURLConnection)resourceUrl.openConnection();
			connection.setDoInput(true);
			if(isKaKao){
				connection.setRequestMethod("GET");
				connection.setRequestProperty("Authorization", "KakaoAK dedc05895fb2ebe1f4bb63fb2e6d1bca");
			}else{
				connection.setRequestMethod(request.getMethod());
			}
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
		} else {
			return;
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