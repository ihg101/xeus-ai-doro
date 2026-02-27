package geomex.xeus.videoSummary.service;

import java.io.BufferedReader;
import java.io.File;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.ibatis.ognl.Ognl;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.videoSummary.model.VideoSummary;

@Service("videoSummaryService")
public class VideoSummaryService {

	@Resource(name = "propService")
    private EgovPropertyService propService;

    private Logger logger = LoggerFactory.getLogger(getClass());

    private String videoSmyIpPort;

    public JSONObject fileUploadApi(VideoSummary videoSummary) throws Exception {
        logger.info("Video Summary API Start");
        JSONObject jsonResult = new JSONObject();

        File file = new File(videoSummary.getFilePath() + "\\" + videoSummary.getRqstMgrSeq().split("_")[0] + "\\" + videoSummary.getFileName());

        if(file.exists()){
        	String uri = videoSmyIpPort + "api/video/upload/file?x-account-id="+videoSummary.getUserId();
//        	String uri = videoSmyIpPort + "api/video/upload/file";

            MultiValueMap<String, Object> parameters = new LinkedMultiValueMap<>();
            parameters.add("videoFile", new FileSystemResource(file));

            String token = getApiToken(videoSummary.getUserId(), videoSummary.getUserPw());

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-auth-token", token);
//            headers.set("x-account-id", videoSummary.getUserId());
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(parameters, headers);

            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
            factory.setConnectTimeout(10*1000);
            factory.setReadTimeout(1000*60*30);
            RestTemplate restTemplate = new RestTemplate(factory);
            ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.GET, requestEntity, Map.class);

            @SuppressWarnings("unchecked")
    		Map<Object, Object> position = (Map<Object, Object>) Ognl.getValue("data.items", response.getBody());

            if (position.size() > 1) {
                videoSummary.setVideoId((String) position.get("video_id"));
                videoSummary.setUploadPath((String) position.get("upload_path"));
                videoSummary.setFileSize((int) position.get("file_size"));
                videoSummary.setAccountId((String) position.get("account_id"));
                videoSummary.setLength((int) position.get("length"));
                videoSummary.setUploadDt((String) position.get("upload_dt"));

                insertVideo(videoSummary);
                jsonResult.put("responseCode", "200");
            } else {
                jsonResult.put("responseCode", "ERROR");
            }
        } else{
        	jsonResult.put("responseCode", "NOFILE");
        }

        return jsonResult;
    }

    public JSONObject fileUploadApi2(VideoSummary videoSummary) throws Exception {

    	BufferedReader in = null;
        ObjectMapper objectMapper = new ObjectMapper();
        JSONObject jsonResult = new JSONObject();

        File file = new File(videoSummary.getFilePath() + "\\" + videoSummary.getRqstMgrSeq().split("_")[0] + "\\" + videoSummary.getFileName());
        if(file.exists()){
        	String token = getApiToken(videoSummary.getUserId(), videoSummary.getUserPw());

            try {
            	CloseableHttpClient client = HttpClients.createDefault();
            	HttpPost post = new HttpPost(videoSmyIpPort + "api/video/upload/file?x-account-id="+videoSummary.getUserId());
            	FileBody fileBody = new FileBody(file);

            	post.addHeader("x-auth-token", token);
//            	post.addHeader("x-account-id", videoSummary.getUserId());

            	MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            	builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            	builder.addPart("videoFile", fileBody);

            	org.apache.http.HttpEntity entity =  builder.build();

            	post.setEntity(entity);
            	HttpResponse response = client.execute(post);

            	org.apache.http.HttpEntity result = response.getEntity();

                String content = EntityUtils.toString(result);

    			@SuppressWarnings("unchecked")
    			Map<String, String> json = objectMapper.readValue(content, HashMap.class);

    			@SuppressWarnings("unchecked")
    			Map<Object, Object> position = (Map<Object, Object>) Ognl.getValue("data.items", json);

    			if (position.size() > 1) {
    				videoSummary.setVideoId((String) position.get("video_id"));
                    videoSummary.setUploadPath((String) position.get("upload_path"));
                    videoSummary.setFileSize((int) position.get("file_size"));
                    videoSummary.setAccountId((String) position.get("account_id"));
                    videoSummary.setLength((int) position.get("length"));
                    videoSummary.setUploadDt((String) position.get("upload_dt"));

    	            insertVideo(videoSummary);
    	            jsonResult.put("responseCode", "200");
    	        } else {
    	            jsonResult.put("responseCode", "ERROR");
    	        }

            } catch(Exception e) {
            	System.out.println(e.toString());
                e.printStackTrace();
            } finally {
                if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
            }
        } else{
        	jsonResult.put("responseCode", "NOFILE");
        }

        return jsonResult;
    }

    /* 20210125 token 요청 api 추가 */
    public String getApiToken(String userId, String userPw) throws Exception {
    	HttpHeaders headers = new HttpHeaders();
//    	headers.set("x-account-id", userId);
//    	headers.set("x-account-pass", userPw);
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));

        // 3. header 정보를 entity 세팅
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        // 4 RestTemplate API 통신
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(videoSmyIpPort + "api/login?x-account-id=" + userId + "&x-account-pass=" + userPw, HttpMethod.GET, entity, Map.class);

        // 5. 리졸트 결과 얻어 온다
        Map<Object, Object> result = response.getBody();

        if(200 == (int) result.get("status")){
        	return (String) result.get("auth_token");
        } else{
        	return "error";
        }
    }

    /**
     * 업로드된 영상을 분석 요청 한다.
     *  파라메타 설명
     *      videoId = 리턴된 videoId 값
     *      userId = 사용자 아이디
     *      recBeginDt = 등록된 날짜 시간
     *      originalName = 요청한 시권스 제목
     *      realPath = 서머리 서버에 올라간 file path 정보
     *      fileSize = 파일 사이즈
     *      memo = 제목과 동일 값
     *      uploadedDt = 등록된 날짜 시간
     * @param videoSummary
     * @throws Exception
     */
    private void insertVideo(VideoSummary videoSummary) throws Exception {

        logger.info("Video Summary insrt video Start");

        // 1. URI 세팅
//        String uri = videoSmyIpPort + "api/video/insert?video-id=" + videoSummary.getVideoId() + "&userId=" + videoSummary.getUserId() + "&recBeginDt=" + videoSummary.getBeginDate() + "&originalName=" + videoSummary.getTitle() + "&realPath=" + videoSummary.getUploadPath() + "&fileSize=" + videoSummary.getFileSize() + "&memo=" + videoSummary.getMemo() + "&uploadedDt=" + videoSummary.getBeginDate();
        String uri = videoSmyIpPort + "api/video/insert?x-account-id=" + videoSummary.getUserId() + "&video-id=" + videoSummary.getVideoId() + "&upload-path=" + videoSummary.getUploadPath() + "&file-size=" + videoSummary.getFileSize() + "&title=geomex&memo=geomex&rec-dt=" + videoSummary.getRecDt() + "&storage-term=1 month";
        String token = getApiToken(videoSummary.getUserId(), videoSummary.getUserPw());

        // 2. header 세팅
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-auth-token", token);
//        headers.set("x-account-id", videoSummary.getUserId());
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));

        // 3. header 정보를 entity 세팅
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        // 4 RestTemplate API 통신
        RestTemplate restTemplate = new RestTemplate();

    	ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.POST, entity, Map.class);

    }

    @PostConstruct
    public void initIt() throws Exception {
    	this.videoSmyIpPort = propService.getString("video.smy").replaceAll("\"", "");
    }

    /**
     * 비디오서머리 회원 정보를 등록 한다.
     * @param userId
     * @param userPwd
     * @return
     */
    public int setVideoSummarySignUpApi(String userId, String userPwd) throws Exception{
        String url = videoSmyIpPort + "api/sign-up?x-account-id=" + userId + "&x-account-pass=" + userPwd;

        HttpHeaders headers = new HttpHeaders();
//        headers.set("x-account-id", userId);
//        headers.set("x-account-pass", userPwd);
        headers.set("x-account-role", "user");
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));

        // 3. header 정보를 entity 세팅
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        // 4 RestTemplate API 통신
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        // 5. 리졸트 결과 얻어 온다
        Map<Object, Object> position = response.getBody();

        return (int) position.get("affectedRows");
    }

    /**
     * 비디오서머리 비밀번호 수정
     * @param userId
     * @param newUserPwd
     * @return
     */
    public int setVideoSummaryPwdUpdate(String userId, String newUserPwd, String nowUserPwd) throws Exception{
    	String url = videoSmyIpPort + "api/account/change-pw?x-account-id=" + userId + "&x-account-pass=" + newUserPwd;
    	String token = getApiToken(userId, nowUserPwd);

    	if(!"error".equals(token)){
			HttpHeaders headers = new HttpHeaders();
            headers.set("x-auth-token", token);
//            headers.set("x-account-id", userId);
//            headers.set("x-account-pass", newUserPwd);
            headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));

            // 3. header 정보를 entity 세팅
            HttpEntity<String> entity = new HttpEntity<String>(headers);

            // 4 RestTemplate API 통신
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            // 5. 리졸트 결과 얻어 온다
            Map<Object, Object> position = response.getBody();

            return (int) position.get("affectedRows");

    	} else{
    		return -1;
    	}

    }

    /*private int sendApi(String userId, String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-uid", userId);
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));

        // 3. header 정보를 entity 세팅
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        // 4 RestTemplate API 통신
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        // 5. 리졸트 결과 얻어 온다
        Map<Object, Object> position = response.getBody();
        return (int) position.get("affectedRows");
    }

    private int sendApiGet(String userId, String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-uid", userId);
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));

        // 3. header 정보를 entity 세팅
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        // 4 RestTemplate API 통신
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        // 5. 리졸트 결과 얻어 온다
        Map<Object, Object> position = response.getBody();
        return (int) position.get("affectedRows");
    }*/
}
