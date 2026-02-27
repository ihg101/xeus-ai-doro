package geomex.xeus.security.interceptor;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import geomex.xeus.sysmgr.service.IpService;
import geomex.xeus.sysmgr.service.IpVo;

/**
 * <pre>
 * 파일명 :  IpInterceptor.java
 * 설  명 :
 *
 *   IP를 체크하는 인터셉터 입니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 16.
 * @version :  1.0
 * @see
 */

public class IpInterceptor extends HandlerInterceptorAdapter {

	@Resource(name = "ipService")
    private IpService service;

	/**
	 * <pre>
	 * 클라이언트의 IP를 리턴합니다.
	 * 여러 프록시에서 실제 IP를 조회하기 위하여,
	 * getRemoteAddr 메소드는 가장 마지막에 조회합니다.
	 * </pre>
	 *
	 * @param request
	 * @return
	 */
	private String getIP(HttpServletRequest request){
		String ip = request.getHeader("X-Forwarded-For");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	/**
	 * 문자형 IP주소를 long 타입으로 변경합니다.
	 *
	 * @param ipAddress
	 * @return
	 */
	private long ipToLong(String ipAddress){

		String[] ipAddressInArray = ipAddress.split("\\.");

		long result = 0;
		for(int i=0; i<ipAddressInArray.length; i++){
			int power = 3-i;
			int ip = Integer.parseInt(ipAddressInArray[i]);
			result += ip * Math.pow(256, power);
		}

		return result;
	}

	/**
	 * long 타입 IP주소를 문자형으로 변경합니다.
	 *
	 * @param i
	 * @return
	 */
	private String longToIp(long i){

		return ((i >> 24) & 0xFF) +
	     "." + ((i >> 16) & 0xFF) +
	     "." + ((i >> 8) & 0xFF) +
	     "." + (i & 0xFF);

	}

	/**
	 * <pre>
	 * DB에서 허용 IP 조회 후,
	 * 사용자 IP주소와 비교합니다.
	 * </pre>
	 */
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		String userIp = this.getIP(request);

		if(userIp == null || "".equals(userIp)){
			ModelAndView mv = new ModelAndView("/user/login");
			throw new ModelAndViewDefiningException(mv);
		}

		long targetIp = this.ipToLong(userIp);
		boolean isAllow = false;

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("useYn", "Y");

		ArrayList<IpVo> list = service.getList(map);
		for(int i=0; i<list.size(); i++){
			String startIp = list.get(i).getStartIpNo();
			String endIp = list.get(i).getEndIpNo();

			if(startIp != null && !"".equals(startIp) && endIp != null && !"".equals(endIp)){
				long stIP = this.ipToLong(startIp);
				long edIP = this.ipToLong(endIp);
				if(targetIp >= stIP && targetIp <= edIP){
					isAllow = true;
				}
			}else{
				long stIP = this.ipToLong(startIp);
				if(stIP == targetIp){
					isAllow = true;
				}
			}

			if(isAllow) break;
		}

		return isAllow;
	}

}
