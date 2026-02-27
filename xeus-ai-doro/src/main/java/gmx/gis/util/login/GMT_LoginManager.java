package gmx.gis.util.login;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;



public class GMT_LoginManager implements HttpSessionBindingListener {
	private static GMT_LoginManager loginManager = null;
	private static Hashtable loginUsers = new Hashtable();

	private static final Map<String, HttpSession> sessions = new HashMap<>();

	private GMT_LoginManager() {
		super();
	}

	public static synchronized GMT_LoginManager getInstance() {
		if (loginManager == null) {
			loginManager = new GMT_LoginManager();
		}

		return loginManager;
	}

	// 아이디가 맞는지 체크
	public boolean isValid(String userID, String userPW) {
		return true; // 자세한 로직은 미구현
	}

	// 해당 세션에 이미 로그인 되있는지 체크
	public boolean isLogin(String sessionID) {
		boolean isLogin = false;
		Enumeration e = loginUsers.keys();
		String key = "";
		while (e.hasMoreElements()) {
			key = (String) e.nextElement();
			if (sessionID.equals(key)) {
				isLogin = true;
			}
		}
		return isLogin;
	}

	// 해당 세션에 사용자정보를 가져온다.
	public ArrayList getUserList() {
		ArrayList list = new ArrayList();
		Enumeration e = loginUsers.keys();
		String key = "";
		while (e.hasMoreElements()) {
			key = (String) e.nextElement();
			if (!list.contains(loginUsers.get(key))) {
				list.add(loginUsers.get(key));
			}
		}
		return list;
	}



	/**
	 * 입력받은 session 아이디를 해시테이블에서 삭제.
	 *
	 * @param userId
	 */
	public void removeSession(String sessionId) {
		HttpSession session = null;
		if(sessionId != null){
			if(!"".equals(sessionId)){

				if (sessions.get(sessionId) != null) {
					try {
						session = (HttpSession) sessions.get(sessionId);
						// 세션이 invalidate될때 HttpSessionBindingListener를
						// 구현하는 클레스의 valueUnbound()함수가 호출된다.
						session.invalidate();
						sessions.remove(sessionId);
					} catch (Exception e) {

					}
				}
			}
		}
	}

	// 중복 로그인 막기 위해 아이디 사용중인지 체크
	public boolean isUsing(String userID) {
		boolean isUsing = false;
		Enumeration e = loginUsers.keys();
		String key = "";
		while (e.hasMoreElements()) {
			key = (String) e.nextElement();
			if (userID.equals(loginUsers.get(key))) {
				isUsing = true;

			}
		}
		return isUsing;
	}

	// 로그아웃시
	public HttpSession getSession(String userID) {
		HttpSession userSession = null;
		Enumeration e = loginUsers.keys();
		String key = "";
		while (e.hasMoreElements()) {
			key = (String) e.nextElement();
			HttpSession session = sessions.get(key);
			if (userID.equals(session.getAttribute("userId"))) {
				userSession = session;
			}
		}
		return userSession;
	}

	// 로그아웃시
	public void LogOut(String userID) {
		Enumeration e = loginUsers.keys();
		String key = "";
		while (e.hasMoreElements()) {
			key = (String) e.nextElement();
			if (userID.equals(loginUsers.get(key))) {
				loginUsers.remove(key);
			}
		}
	}

	// 로그아웃시
	public void LogOutSessionId(String sessionId) {
		if(sessionId != null){
			if(!"".equals(sessionId)){
				try {
					loginUsers.remove(sessionId);
					sessions.remove(sessionId);
				} catch (Exception e) {

				}
			}
		}
	}

	// 세션 생성
	public void setSession(HttpSession session, String userID) {
		loginUsers.put(session.getId(), userID);

		sessions.put(session.getId(), session);

		session.setAttribute("login", this.getInstance());

	}

	// 세션 성립될 때
	public void valueBound(HttpSessionBindingEvent event) {
	}

	// 세션 끊길때
	public void valueUnbound(HttpSessionBindingEvent event) {
		loginUsers.remove(event.getSession().getId());
	}

	// 세션 ID로 로긴된 ID 구분
	public String getUserID(String sessionID) {
		return (String) loginUsers.get(sessionID);
	}

	// 현재 접속자수
	public int getUserCount() {
		return loginUsers.size();
	}
};