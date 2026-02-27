package geomex.xeus.smartcity.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.smartcity.Utils;
import geomex.xeus.sysmgr.service.AuthService;

/**
 * <pre>
 * 실시간 이벤트 전송을 위한 서비스 입니다.
 *
 * @author 이주영
 * </pre>
 */

@Service("eventWebSocketService")
public class EventWebSocketService extends EgovAbstractServiceImpl {

	@Resource(name = "authService")
	private AuthService auth;

    @Resource(name = "propService")
    private EgovPropertyService propService;

    private List<WebSocketSession> clients = Collections.synchronizedList(new ArrayList<WebSocketSession>());

    public synchronized void addClient(WebSocketSession session) {
        clients.add(session);
        try {
            notifyAll();
        } catch (Exception ex) {}
    }

    public synchronized void removeClient(WebSocketSession session) {
        clients.remove(session);
        try {
            notifyAll();
        } catch (Exception ex) {}
    }

    public void broadcast(String payload) {
        egovLogger.info("Event Broadcast>>" + payload);
        List<WebSocketSession> tgt = new ArrayList<WebSocketSession>(clients);
        int size = tgt.size();

        boolean isUserTarget = false;

        for (int x = 0; x < size; x++) {
            WebSocketSession s = tgt.get(x);
            if (s != null && s.isOpen()) {

            	Map<String, Object> attr = s.getAttributes();

            	String userId = (String) attr.get("userId");
            	String authGrpId = (String) attr.get("authGrpId");

            	EventHistVo json = Utils.parseVo(payload);

                try {
                	String statEvetTypCd = json.getEvtTypCd();

                	/* 1 순위. 이벤트 타입코드 체크 */
                	if(statEvetTypCd != null && !"".equals(statEvetTypCd)){
                		if("CCTVSHER".equals(statEvetTypCd)) statEvetTypCd = "CCTVPLAY";
                		if("CCTVPREVREQ".equals(statEvetTypCd)) statEvetTypCd = "CCTVPREVRES";

                		/* 2 순위. 특정 계정만 수신 */
                		if(json.getTargetId() != null && !"".equals(json.getTargetId()) && !"null".equals(json.getTargetId())){
                			if(json.getTargetId().equals(userId)){
                				s.sendMessage(new TextMessage(payload));
                				isUserTarget = true;
                			}

                		}else{

                			/* 3 순위. 수신권한 체크 */
                			boolean isContain = false;
                			HashMap<String, String> map = new HashMap<String, String>();
                			map.put("userId", userId);
                			map.put("authData", statEvetTypCd);
                			if(auth.hasAuth(map)) isContain = true;
                			/* 4 순위. 그룹 또는 권한소유자에게 전파 */
                			if(isContain){
                				if(!isUserTarget){
                					if(json.getTargetGrp() != null && !"".equals(json.getTargetGrp()) && !"null".equals(json.getTargetGrp())){
                						if(json.getTargetGrp().contains(authGrpId)){
                							s.sendMessage(new TextMessage(payload));
                						}
                					}else{
                						s.sendMessage(new TextMessage(payload));
                					}
                				}
                			}

                		}
                	}
                } catch (Exception e) {
                	e.printStackTrace();
                    try {
                        s.close();
                    } catch (Exception ea) {}
                }
            } else {
                clients.remove(s);
            }
        }
    }
}
