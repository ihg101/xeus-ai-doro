package gmx.gis.smartcity.web;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import gmx.gis.smartcity.service.GMT_EventWebSocketService;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  GMT_EventWebSocketHandler.java
 * 작성자 :  홍길동
 * 작성일 :  2018. 4. 9.
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
public class GMT_EventWebSocketHandler extends TextWebSocketHandler {
    // afterConnectionEstablished WebSocket 연결이 열리고 사용이 준비될 때 호출
    // afterConnectionClosed WebSocket 연결이 닫혔을 때 호출
    // handleMessage 클라이언트로부터 메시지가 도착했을 때 호출
    // handleTransportError 전송 에러 발생할 때 호출
    // supportsPartialMessages WebSocketHandler가 부분 메시지를 처리할 때 호출

    //@Resource(name = "eventSocketReceiveService")
    //private EventSocketReceiveService eventSocketReceiveService;


	@Autowired private GMT_EventWebSocketService eventWebSocketService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        eventWebSocketService.addClient(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Client메시지 수신시
        //
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        eventWebSocketService.removeClient(session);
    }
}
