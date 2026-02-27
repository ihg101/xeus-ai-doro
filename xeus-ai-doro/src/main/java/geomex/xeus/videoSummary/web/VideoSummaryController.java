package geomex.xeus.videoSummary.web;

import java.util.HashMap;

import javax.annotation.Resource;

import org.json.simple.JSONObject;
//import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.videoSummary.model.VideoSummary;
import geomex.xeus.videoSummary.service.VideoSummaryService;

@Controller
@RequestMapping("/videoSmy")
public class VideoSummaryController {

    @Resource(name = "videoSummaryService")
    private VideoSummaryService videoSummaryService;

    @Resource(name = "sysPropService")
    private SysPropService param;

    /**
     * VideoSummary 영상 업로드 API
     * 설명
     *      영상반출 신청 시 고속 영상 옵션 선택 시 VideoSummary 서버로 영상 데이터를 업로드 한다.
     *      페키지 서비스에서 URL 패스에 결과를 넘겨 준다.
     *      호출 샘플 URL : http://localhost:8080/xeus/videoSummary/rqstMgrSeq/123456789/filePath/test/fileName/test.mp4/userId/geomex/fileUploadApi
     * @param rqstMgrSeq    영상반출 시퀀스 번호
     * @param filePath      다운로든된 폴더 경로 정보
     * @param fileName      파일명
     * @param userId        반출 요청 사용자 아이디
     * @throws Exception
     */
    /*@RequestMapping(value = "/rqstMgrSeq/{rqstMgrSeq}/filePath/{filePath}/fileName/{fileName}/userId/{userId}/fileUploadApi")
    public JSONObject fileUploadApi(@PathVariable int rqstMgrSeq, @PathVariable String filePath, @PathVariable String fileName, @PathVariable String userId) throws Exception {

        // 1. 파라메타 모델에 세팅
        VideoSummary videoSummary = new VideoSummary();
        videoSummary.setRqstMgrSeq(rqstMgrSeq);
        videoSummary.setFilePath(filePath);
        videoSummary.setFileName(fileName);
        videoSummary.setUserId(userId);

        // 2. 서비스에서 API 통신 한다.
        JSONObject jsonData = videoSummaryService.fileUploadApi(videoSummary);

        return jsonData;
    }*/

    @RequestMapping(value = "/videoSmyRqst.json")
    public void fileUploadApi(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

    	String tviusStoragePath = "";
        HashMap<String, String> sysMap = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();
        tviusStoragePath = sysMap.get("tvius.storage_path");

        // 1. 파라메타 모델에 세팅
        VideoSummary videoSummary = new VideoSummary();
        videoSummary.setRqstMgrSeq(map.get("rqstMgrSeq")+"_"+map.get("aviMgrSeq"));
        videoSummary.setFilePath(tviusStoragePath);
        videoSummary.setFileName(map.get("fileName"));
        videoSummary.setUserId(map.get("userId"));
        videoSummary.setUserPw(map.get("userPw"));
        videoSummary.setRecDt(map.get("recDt"));

        try{
        	JSONObject jsonData = null;

        	if("1".equals(map.get("upload"))){
        		jsonData = videoSummaryService.fileUploadApi(videoSummary);
        	} else{
        		jsonData = videoSummaryService.fileUploadApi2(videoSummary);
        	}

            model.addAttribute("result", jsonData.get("responseCode"));
        } catch(Exception e){
        	model.addAttribute("result", "400");
        }
    }

}
