package geomex.xeus.proxy;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;

import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.util.code.SystemParameter;

/**
 * <pre>
 * @파일명 :  ProxyController.java
 * @작성자 :  김경호
 * @작성일 :  2017. 1. 19.
 * @설명   :
 *   클래스 설명을 쓰시오
 *
 * @수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 * </pre>
 *
 * @version : 1.0
 * @see
 */

@Controller("tmsProxyController")
@RequestMapping("/tms")
public class TmsProxyController {

    private Logger logger = LoggerFactory.getLogger(TmsProxyController.class);

    @Resource(name = "sysPropService")
    private SysPropService param;

	//map proxy 요청 정보
	private String mapProxyChk;
	private String mapProxyUrl;

    @PostConstruct
    public void initIt() throws Exception {

    	HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        this.mapProxyChk = sysMap.get("map.proxy.chk");
        this.mapProxyUrl = sysMap.get("map.proxy.url");
    }

    @Autowired
    //private ServletContext servletContext;@Autowired
    private WebApplicationContext wac;

    @RequestMapping(method = { RequestMethod.GET, RequestMethod.POST })
    public @ResponseBody ResponseEntity<byte[]> getImage(@RequestParam("url") String url,
                                                         @RequestParam("type") String type,
                                                         HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();

        ByteArrayOutputStream baos = null;
        byte[] media = null;
        try {
        	if ("png".equalsIgnoreCase(type)) {
                headers.setContentType(MediaType.IMAGE_PNG);
            } else if ("jpg".equalsIgnoreCase(type) ||
            	"jpeg".equalsIgnoreCase(type)) {
                headers.setContentType(MediaType.IMAGE_JPEG);
            }

        	URL imgURL = null;

        	//프록시 요청일 경우
        	if("Y".equals(this.mapProxyChk)){
            	imgURL = new URL(this.mapProxyUrl
            					+ "?url=" + url
            					+ "&type=" + type);
        	}
        	//프록시 요청이 아닐 경우 직접 요청한다.
        	else {
                if (url.contains("http://")) {
                    imgURL = new URL(url);
                } else {
                    imgURL = new URL("http://" + req.getServerName() + ":" + req.getServerPort() + url);
                }
        	}

            logger.debug(url);
            BufferedImage img = ImageIO.read(imgURL);//in = servletContext.getResourceAsStream(url);
            baos = new ByteArrayOutputStream();
            ImageIO.write(img, type, baos);
            baos.flush();
            media = baos.toByteArray();
            baos.close();
        } catch (Exception e) {
            logger.debug(ExceptionUtils.getMessage(e));
        } finally {
            IOUtils.closeQuietly(baos);
        }

        if (media == null) {
            InputStream in = null;
            headers.setContentType(MediaType.IMAGE_PNG);
            try {
                in = wac.getServletContext().getResourceAsStream("/resources/img/tms_noimage.png");
                media = IOUtils.toByteArray(in);
            } catch (Exception e) {
                logger.error(ExceptionUtils.getStackTrace(e));
            } finally {
                IOUtils.closeQuietly(in);
            }
        }

        headers.setCacheControl("no-cache");
        ResponseEntity<byte[]> responseEntity = new ResponseEntity<byte[]>(media, headers, HttpStatus.OK);
        return responseEntity;
    }
}
