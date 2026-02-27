package geomex.xeus.smartcity.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * <pre>
 * ===========================================================
 * 파일명 :  EventWebSocketConfigurer.java
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
@Configuration("eventWebSocketConfigurer")
@EnableWebSocket
public class EventWebSocketConfigurer implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(eventHandler(), "/event");
        registry.addHandler(sessionHandler(), "/session");
        registry.addHandler(tviusHandler(), "/tviusWs");
    }

    @Bean(name = "eventWebSocketHandler")
    public EventWebSocketHandler eventHandler() {
        return new EventWebSocketHandler();
    }

    @Bean(name = "sessionWebSocketHandler")
    public SessionWebSocketHandler sessionHandler() {
    	return new SessionWebSocketHandler();
    }

    @Bean(name = "tviusWebSocketHandler")
    public TviusWebSocketHandler tviusHandler() {
        return new TviusWebSocketHandler();
    }
}
