package gmx.gis.smartcity.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;
import gmx.gis.sysmgr.service.GMT_AuthService;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  GMT_EventWebSocketService.java
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

@Service
public class GMT_EventWebSocketService extends EgovAbstractServiceImpl {

	@Autowired private GMT_AuthService auth;

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

}
