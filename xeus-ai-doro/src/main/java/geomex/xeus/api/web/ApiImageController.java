package geomex.xeus.api.web;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.system.annotation.NoSession;

@Controller
@RequestMapping("/api")
public class ApiImageController {

    @Resource(name = "propService")
    private EgovPropertyService propService;
    
	@NoSession
	@RequestMapping(value = "/getImage.do", method = RequestMethod.GET)
	public void getImage(@RequestParam(value="id", required=true) String id, HttpServletResponse response) throws Exception {
		
		String imageRequestUrl = propService.getString("ai.image.url");
		
        if (id == null || id.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID는 필수입니다.");
            return;
        }

        String requestUrl = imageRequestUrl.replace("{id}", id);

        URL url = new URL(requestUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
            response.setContentType(conn.getContentType());
            try (InputStream in = conn.getInputStream(); OutputStream out = response.getOutputStream()) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "이미지를 찾을 수 없습니다.");
        }
	}
}

