package gmx.gis.smartcity.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PreDestroy;
import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.log.service.GMT_AccessService;
import gmx.gis.log.service.GMT_AccessVo;
import gmx.gis.sysmgr.service.GMT_AuthService;
import gmx.gis.util.code.GMT_DateUtil;
import gmx.gis.util.login.GMT_LoginManager;

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
public class GMT_SessionWebSocketService extends EgovAbstractServiceImpl {

	@Autowired private GMT_AuthService auth;

	@Autowired private GMT_AccessService service;

    private List<WebSocketSession> clients = Collections.synchronizedList(new ArrayList<WebSocketSession>()); //event receivers...

    public synchronized void addClient(WebSocketSession session) throws Exception {
    	Map<String, Object> map = session.getAttributes();

    	String userId = (String) map.get("userId");
    	String userIp = (String) map.get("userIp");
		String useTime = (String) map.get("signDate");

		if(userId != null){
			if(!"".equals(userId)){
				GMT_AccessVo vo = new GMT_AccessVo();
				vo.setUsrId(userId);
				vo.setConnIp(userIp);
				vo.setAllowYn("Y");
				vo.setAuthMgrNo("USR001");
				vo.setUseTime(useTime);
				vo.setRmark("사용자로그인");
				service.add(vo);
			}
		}

		clients.add(session);
        try {
            notifyAll();
        } catch (Exception ex) {}
    }

    public synchronized void removeClient(WebSocketSession session) throws Exception {
    	Map<String, Object> map = session.getAttributes();

//    	String sessionId = (String) map.get("sessionId");
//    	GMT_LoginManager loginManager = GMT_LoginManager.getInstance();
//        loginManager.removeSession(sessionId);
//        loginManager.LogOutSessionId(sessionId);

    	String userId = (String) map.get("userId");
    	String userIp = (String) map.get("userIp");
		String useTime = GMT_DateUtil.getStrSec();

		if(userId != null){
			if(!"".equals(userId)){
				GMT_AccessVo vo = new GMT_AccessVo();
				vo.setUsrId(userId);
				vo.setConnIp(userIp);
				vo.setAllowYn("Y");
				vo.setAuthMgrNo("USR002");
				vo.setUseTime(useTime);
				vo.setRmark("사용자로그아웃");
				service.add(vo);
			}
		}

		session.close();
        clients.remove(session);
        try {
            notifyAll();
        } catch (Exception ex) {}
    }

    public synchronized void removeClient(String userId) throws Exception {
    	for(int i=0; i<clients.size(); i++){
    		WebSocketSession session = clients.get(i);
    		Map<String, Object> map = session.getAttributes();

        	String sessionUserId = (String) map.get("userId");

    		if(sessionUserId != null){
    			if(!"".equals(userId)){
    				if(userId.equals(sessionUserId)){
    					session.close();
    					clients.remove(session);
    					try {
    						notifyAll();
    					} catch (Exception ex) {}
    				}
    			}
    		}
    	}

    }

    @PreDestroy
    public void removeAllSessions() throws Exception {
    	for(int i=0; i<clients.size(); i++){
    		WebSocketSession session = clients.get(i);
    		Map<String, Object> map = session.getAttributes();

    		String sessionId = (String) map.get("sessionId");
        	GMT_LoginManager loginManager = GMT_LoginManager.getInstance();
            loginManager.removeSession(sessionId);
            loginManager.LogOutSessionId(sessionId);

        	String userId = (String) map.get("userId");
        	String userIp = (String) map.get("userIp");
    		String useTime = GMT_DateUtil.getStrSec();

    		if(userId != null){
    			if(!"".equals(userId)){
    				GMT_AccessVo vo = new GMT_AccessVo();
    				vo.setUsrId(userId);
    				vo.setConnIp(userIp);
    				vo.setAllowYn("Y");
    				vo.setAuthMgrNo("USR002");
    				vo.setUseTime(useTime);
    				vo.setRmark("사용자로그아웃");
    				service.add(vo);
    			}
    		}
    	}
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
