package geomex.xeus.util.timer;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import geomex.xeus.smartcity.service.EventHistService;
import geomex.xeus.smartcity.service.EventHistVo;
import geomex.xeus.smartcity.service.EventService;

/**
 * <pre>
 * 파일명 : AutoEventEndService.java
 * 설  명 :
 *   매일 자정에 실행되어, 오늘 이전의 이벤트를 종료 상태(91)로 업데이트 후 히스토리 테이블로 이동 및 삭제
 * </pre>
 */
@Service("eventEndService")
public class AutoEventEndService {

    private Logger logger = LoggerFactory.getLogger("eventEndTimer");

    @Resource(name = "eventService")
    private EventService service;

    @Resource(name = "eventHistService")
    private EventHistService hist;

    @PostConstruct
    private void init() {
        endEvent();
    }

    /**
     * JSON 내 state가 확인("1")이면 제외
     */
    private boolean isCustomFilter(String jsonText) {
        if (jsonText == null || jsonText.trim().isEmpty()) {
            return true;
        }
        try {
            JSONParser jsonParse = new JSONParser();
            JSONObject jsonObj = (JSONObject) jsonParse.parse(jsonText);
            if (jsonObj == null) return true;
            
            Object stateObj = jsonObj.get("state");
            if (stateObj == null) return true;
            
            return !"1".equals(stateObj.toString());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * 테스트를 위해 1분에 한 번씩 실행 (매 분 0초)
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void endEvent() {
        try {
            // 현재 모니터링 중인 모든 이벤트 목록 조회
            ArrayList<EventHistVo> list = service.getRealList(new HashMap<String, String>());
            
            // 오늘 날짜 (YYYYMMDD)
            LocalDateTime now = LocalDateTime.now();
            String todayDate = String.format("%04d%02d%02d", now.getYear(), now.getMonthValue(), now.getDayOfMonth());
            for (EventHistVo vo : list) {
                if (vo == null || vo.getUsvcOutbId() == null) continue;

                String usvcOutbId = vo.getUsvcOutbId();
                String evtOutbDtm = vo.getEvtOutbDtm();

                // 날짜 형식이 YYYYMMDD... 이므로 앞 8자리를 비교
                if (evtOutbDtm != null && evtOutbDtm.length() >= 8) {
                    String eventDate = evtOutbDtm.substring(0, 8);

                    // 오늘 날짜가 아니면 (어제 또는 그 이전 데이터면) 정리 대상
                    if (!todayDate.equals(eventDate)) {
                        
                        // state가 "1"(확인)인 데이터는 제외하고 정리
                        if (!isCustomFilter(vo.getEvtJson())) {
                            continue;
                        }

                        // 1. 히스토리 테이블에 저장 (종료 상태 91로 설정)
                        vo.setEvtProcCd("91");
                        HashMap<String, String> param = new HashMap<>();
                        param.put("usvcOutbId", usvcOutbId);
                        
                        if (hist.getItem(param) == null) {
                            hist.add(vo);
                        }

                        // 2. 현재 모니터링 테이블에서 삭제
                        service.del(param);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("자정 이벤트 정리 중 오류 발생: " + ExceptionUtils.getStackTrace(e));
        }
    }
}
