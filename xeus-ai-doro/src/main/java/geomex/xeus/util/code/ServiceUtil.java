package geomex.xeus.util.code;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import geomex.xeus.sysmgr.web.SymIconController;

/**
 *
* <pre>
* 파일명 :  ServiceUtil.java
*  - 서비스에서 공통 실행되는 함수 모음
*  
 */
public class ServiceUtil {
	private static Logger logger = LoggerFactory.getLogger(ServiceUtil.class);
	
	private static String NO_SESSION_ERROR_MSG = "세션 정보가 존재하지 않습니다.";
	private static String NO_VO_TO_MAP_ERROR_MSG = "VO to Map 변환 오류";
    /**
     * 비즈니스 로직 처리 시 세션 정보에 있는 사용자 정보를 map param에 담는다.
     * 
     * @param map
     * @param session
     * @return
     */
    public static HashMap<String, String> addUserInfo(HashMap<String, String> map) {
    	
    	try {
    		ServletRequestAttributes servletRequestAttribute = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
    	    HttpSession session = servletRequestAttribute.getRequest().getSession(true);
    	    
            if ( map == null || session == null ) {
                return map;
            }

            String userId = (String) session.getAttribute("userId");
            String authGrpId = (String) session.getAttribute("authGrpId");
            
            map.put("userId", userId);
            map.put("authGrpId", authGrpId);
            
    	} catch (Exception e) {
    		logger.error(NO_SESSION_ERROR_MSG);
    	}
    	
    	return map;
		
    }
    
    /**
     * 시스템 설정 저장시 VO객체 -> Map 변환 함수.
     *  - 그 이외에도 사용 가능함.
     *  
     * @param vo
     * @return
     */
    public static HashMap<String, String> convertVoToMap(Object vo) {
        
        if ( vo == null ) return null;
        
        //굳이 안넣어도 되지만, 혹시 모를 예외 상황을 위해 넣음/
        String[] noQuerys = {"propKey", "propNm", "propValue"};
        
        HashMap<String, String> map = new HashMap<String, String>();
        
        try {
            Map<String, String> voMap = BeanUtils.describe(vo);
            
            for (String key : voMap.keySet() ) {
                if ( !StrUtil.contains(noQuerys, key) ) {
                    String newKey = StrUtil.camelToSeparator(key, "."); 
                    String value = voMap.get(key);
                    if ( value != null && !"null".equals(value)) {
                        map.put(newKey, value);
                    }
                }
            }
            
        } catch (Exception e) {
    		logger.error(NO_VO_TO_MAP_ERROR_MSG);
    	}
        
        return map;
    }
}
