package geomex.xeus.smartcity.service;

import java.io.IOException;
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
 * ===========================================================
 * 파일명 :  EventWebSocketService.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 18.
 * 버전   :  1.0
 * 설명   :
 * 클래스 설명을 쓰시오
 *
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 *
 * ===========================================================
 * </pre>
 */

@Service("tviusWebSocketService")
public class TviusWebSocketService extends EgovAbstractServiceImpl {

	@Resource(name = "authService")
	private AuthService auth;

    @Resource(name = "propService")
    private EgovPropertyService propService;

    private List<WebSocketSession> clients = Collections.synchronizedList(new ArrayList<WebSocketSession>()); //event receivers...

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

        for (int x = 0; x < size; x++) {
            WebSocketSession s = tgt.get(x);
            if (s != null && s.isOpen()) {

            	try {
					s.sendMessage(new TextMessage(payload));
				} catch (IOException e) {
					e.printStackTrace();
				}
            }
        }
    }
}
