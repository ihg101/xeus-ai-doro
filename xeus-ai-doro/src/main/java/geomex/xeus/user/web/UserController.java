package geomex.xeus.user.web;

import java.beans.PropertyEditorSupport;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.log.service.AccessService;
import geomex.xeus.log.service.AccessVo;
import geomex.xeus.log.service.MsgLogService;
import geomex.xeus.log.service.MsgLogVo;
import geomex.xeus.smartcity.service.SessionWebSocketService;
import geomex.xeus.sysmgr.service.SmsAuthService;
import geomex.xeus.sysmgr.service.SmsAuthVo;
import geomex.xeus.sysmgr.service.AuthGrpVo;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.service.NoticeService;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.system.annotation.NoSession;
import geomex.xeus.user.service.UserService;
import geomex.xeus.user.service.UserVo;
import geomex.xeus.user.util.Base64;
import geomex.xeus.user.util.RSA;
import geomex.xeus.user.util.RSAKey;
import geomex.xeus.user.util.SHA;
import geomex.xeus.user.util.SendSms;
import geomex.xeus.user.util.TEA;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;
import geomex.xeus.util.login.LoginManager;

/**
 * <pre>
 * 파일명 :  UserController.java
 * 설  명 :
 *   사용자 컨트롤러
 *
 * == 개정이력(Modification Information) ==
 * 수정일		  수정자		  수정내용
 * ----------	  -----------	 ---------------------------
 * 2017-05-31	  이주영		  최초 생성
 *
 * </pre>
 *
 * @since : 2017. 5. 31.
 * @version : 1.0
 * @see
 */

@Controller
@RequestMapping("/user")
public class UserController {

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "userService")
	private UserService service;

	@Resource(name = "authService")
	private AuthService auth;

	@Resource(name = "accessService")
	private AccessService access;

	@Resource(name = "noticeService")
	private NoticeService notice;

	@Resource(name = "sysPropService")
	private SysPropService sysParamList;

	@Autowired
	private ColumnInfoController col;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource(name = "msgLogService")
	private MsgLogService msgLogService;

	@Resource(name = "propService")
	private EgovPropertyService propService;

	@Resource(name = "sysPropService")
	private SysPropService param;

	@Resource(name = "sessionWebSocketService")
	private SessionWebSocketService websocket;

	@Resource(name = "smsAuthService")
	private SmsAuthService smsAuthService;

	private String smsChk;
	//
	/*private String apiKakaoKey;
	private String apiKakaoUrl;*/
	private String trayFileNm;
	private String playerFileNm;
	private String playerManualFileNm;
	private String sysDownloadPath;
	private String chromeFileNm;
	private String pledgeFileNm;

	@PostConstruct
	public void initIt() throws Exception {
		this.smsChk = propService.getString("sys.sms").replaceAll("\"", "");

		HashMap<String, String> sysMap = new HashMap<String, String>();
		SystemParameter sysParam = new SystemParameter(param.getList(null));
		sysMap = sysParam.getParamMap();

		/*this.apiKakaoKey = sysMap.get("api.kakao.key");
		this.apiKakaoUrl = sysMap.get("api.kakao.url");*/
		this.trayFileNm = sysMap.get("tray.file.nm");
		this.playerFileNm = sysMap.get("player.file.nm");
		this.playerManualFileNm = sysMap.get("player.manual.file.nm");
		this.chromeFileNm = sysMap.get("chrome.file.nm");
		this.pledgeFileNm = sysMap.get("pledge.file.nm");
		this.sysDownloadPath = sysMap.get("sys.download_path");

	}



	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder) {
		binder.setValidator(this.validator);
		binder.registerCustomEditor(MultipartFile.class, new PropertyEditorSupport() {
			@Override
			public void setAsText(String text) {
				setValue(null);
			}
		});
	}

	@NoSession
	@RequestMapping(value = "/redirect.do")
	public String redirect() throws Exception {

		return "/user/redirect";
	}

	@NoSession
	@RequestMapping(value = "/notSupportedBrowser.do")
	public String notSupportedBrowser() throws Exception {

		return "/user/browser";
	}

	@NoSession
	@RequestMapping(value = "/notSupportedMobileWarning.do")
	public String notSupportedMobileWarning() throws Exception {

		return "/user/notSupportedMobileWarning";
	}

	/**
	 * 사용자 계정 갯수를 조회합니다.
	 *
	 * @return json
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCount.json")
	public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getCount(map));

	}

	/**
	 * 세션을 체크합니다.
	 *
	 * @param model
	 * @param session
	 */
	@NoSession
	@RequestMapping(value = "/sessionCheck.json")
	public void sessionCheck(Model model, HttpSession session) {

		boolean bool = false;
		if (session.getAttribute("userId") != null) {
			bool = true;
		}
		model.addAttribute("result", bool);

	}

	/**
	 * 사용자 로그인 페이지 뷰로 이동합니다. <br>
	 * 암호화 전송을 위하여 RSA 키를 발급합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/login.do")
	public String loginView(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> param) throws Exception {

		String view = "";
		String userId = (String) session.getAttribute("userId");
		/*
		 * if(userId != null && !"".equals(userId)){ view = "redirect:/map/view.do"; }else{ session.setAttribute("RSA",
		 * RSAKey.generate(1024));
		 *
		 * model.addAttribute("notice", notice.getList(null)); model.addAttribute("noticeCount", notice.getCount(null));
		 *
		 * view = "/user/login"; }
		 */

		session.removeAttribute("acc_no");
		session.setAttribute("RSA", RSAKey.generate(1024));

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("sortCol", "mgr_seq");
		map.put("sortTyp", "desc");

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("notice", notice.getList(null));
		model.addAttribute("noticeCount", notice.getCount(null));
		model.addAttribute("smsChk", this.smsChk);

		Map<String, ?> rmap = RequestContextUtils.getInputFlashMap(req);
		if(rmap != null){
			if(rmap.get("adminNotice") != null){
				model.addAttribute("adminNotice", (String) rmap.get("adminNotice"));
			}
		}

		view = "/user/login";

		return view;
	}

	/**
	 * 사용자 로그인 페이지 뷰로 이동합니다. <br>
	 * 암호화 전송을 위하여 RSA 키를 발급합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/loginAdmin.do")
	public String loginViewForAdmin(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> param) throws Exception {

		String view = "";
		String userId = (String) session.getAttribute("userId");
		/*
		 * if(userId != null && !"".equals(userId)){ view = "redirect:/map/view.do"; }else{ session.setAttribute("RSA",
		 * RSAKey.generate(1024));
		 *
		 * model.addAttribute("notice", notice.getList(null)); model.addAttribute("noticeCount", notice.getCount(null));
		 *
		 * view = "/user/login"; }
		 */

		session.removeAttribute("acc_no");
		session.setAttribute("RSA", RSAKey.generate(1024));

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("sortCol", "mgr_seq");
		map.put("sortTyp", "desc");

		model.addAttribute("notice", notice.getList(null));
		model.addAttribute("noticeCount", notice.getCount(null));
		model.addAttribute("smsChk", this.smsChk);

		Map<String, ?> rmap = RequestContextUtils.getInputFlashMap(req);
		if(rmap != null){
			if(rmap.get("adminNotice") != null){
				model.addAttribute("adminNotice", (String) rmap.get("adminNotice"));
			}
		}

		view = "/user/login_origin";

		return view;
	}

	//Platform Tray에서 로그인 처리하기 위하여 Key를 json으로 받는 로직 추가
	//2018.10.24 by khkim
	@NoSession
	@RequestMapping(value = "/silentLogin.json")
	public ResponseEntity<String> silentloginView(Model model, HttpSession session) throws Exception {
		RSAKey rsaKey = RSAKey.generate(1024);
		session.setAttribute("RSA", rsaKey);  //session에 키 저장.
		// s
		String modulus = RSAKey.toHex(rsaKey.getModulus());
		String exponent = RSAKey.toHex(rsaKey.getPublicExponent());
		//
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json; charset=UTF-8");
		ObjectMapper obj = new ObjectMapper();
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("modulus", modulus);
		map.put("exponent", exponent);
		String json = obj.writeValueAsString(map);
		return new ResponseEntity<String>(json, headers, HttpStatus.OK);
	}

	//Platform Tray에서 이벤트 화면 이동하기 위한 로직 추가
	//2018.10.31 by khkim
	@NoSession
	@RequestMapping(value = "/silentSignIn.json")
	public String silentLogin(HttpServletRequest req, Model model, HttpSession session,
							  @RequestParam HashMap<String, String> map)
		throws Exception {
		//ID, PWD, URL,
		TEA tea = new TEA("AStaCAZd4FTItklUC4AJTQ5H");
		try {
			String query = URLDecoder.decode(map.get("query"), "utf-8");
			query = tea.decrypt(query);
			String param[] = StringUtils.split(query, "#");
			param[0] = Base64.decodeString(param[0]);
			param[1] = Base64.decodeString(param[1]);

			map.put("userId", param[0]);
			UserVo vo = null;
			UserVo pwdValid = service.getItem(map.get("userId"));
			if (pwdValid == null || "".equals(pwdValid.getUserId())) {
				model.addAttribute("result", null);
				//로그인 페이지로 이동..
				return "redirect:/user/login.do";
			}

			map.put("userPwd", SHA.simpleEnc512(pwdValid.getUserId() + param[1]));
			vo = service.getItem(map);
			if ((vo != null && !"".equals(vo.getUserId()) && "12".equals(vo.getAuthStatCd()))) {

				LoginManager loginManager = LoginManager.getInstance();

				//if (!loginManager.isUsing(vo.getUserId())) {
					loginManager.setSession(req.getSession(), vo.getUserId());
					session.setAttribute("sessionId", req.getSession().getId());
				//}

				session.setAttribute("userVo", vo);

				session.setAttribute("userId", vo.getUserId());
				session.setAttribute("userNm", vo.getUserNm());
				session.setAttribute("authList", auth.getList(null));
				session.setAttribute("authGrpId", vo.getAuthGrpNo());
				session.setAttribute("authGrpNm", vo.getAuthGrpNm());

				HashMap<String, String> authParam = new HashMap<String, String>();
				authParam.put("authGrpNo", vo.getAuthGrpNo());
				session.setAttribute("authGrp", auth.getAuthGrpList(authParam));
				session.setAttribute("userIp", req.getRemoteAddr());
				session.removeAttribute("RSA");
				return "redirect:/map/view.do?isTray=true";

			} else {
				return "redirect:/user/login.do";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "redirect:/user/login.do";
	}

	/**
	 * 사용자 등록 페이지 뷰로 이동합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/reg.do")
	public String regView(Model model, HttpSession session) throws Exception {

		model.addAttribute("column", col.getList());
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("smsChk", this.smsChk);

		session.removeAttribute("acc_no");

		return "/user/reg";
	}

	/**
	 * 사용자 정보 찾기 페이지 뷰로 이동합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/find.do")
	public String findView(Model model, HttpSession session) throws Exception {

		model.addAttribute("smsChk", this.smsChk);

		session.setAttribute("RSA", RSAKey.generate(1024));
		session.removeAttribute("acc_no");

		return "/user/find";
	}

	/**
	 * 사용자 정보 수정 페이지 뷰로 이동합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@RequestMapping(value = "/alter.do")
	public String alterView(Model model, HttpSession session) throws Exception {

		String userId = (String) session.getAttribute("userId");

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("userId", userId);

		model.addAttribute("userVo", service.getItem(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("smsChk", this.smsChk);

		return "/user/edit";

	}

	/**
	 * 사용자 비밀번호 수정 페이지 뷰로 이동합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@RequestMapping(value = "/alterPw.do")
	public String alterPw(Model model, HttpSession session) throws Exception {

		return "/user/editPassword";

	}

	/**
	 * 사용자 테마 설정 페이지 뷰로 이동합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@RequestMapping(value = "/alterTheme.do")
	public String alterTheme(Model model, HttpSession session) throws Exception {

		return "/user/theme";

	}

	/**
	 * 사용자 설정 페이지 뷰로 이동합니다.
	 *
	 * @return view
	 * @throws Exception
	 */
	@RequestMapping(value = "/alterSetting.do")
	public String alterSetting(Model model, HttpSession session) throws Exception {

		return "/user/setting";

	}

	/**
	 * 사용자 로그인 인증을 수행합니다. <br>
	 * 파라미터의 내용은 TEA 암호화 하며, <br>
	 * TEA의 키는 RSA로 암호화 합니다.
	 *
	 * @param req
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/signIn.json", method = RequestMethod.POST)
	public void signIn(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		if (session.getAttribute("RSA") == null) {
			//model.addAttribute("error", "RSAKey is Null");
			model.addAttribute("RSAError", true);
		} else {
			RSA rsa = null;
			TEA tea = null;

			try {
				rsa = new RSA((RSAKey) session.getAttribute("RSA"));
				tea = new TEA(rsa.decrypt(map.get("key")));
			} catch (Exception e) {
				//model.addAttribute("error", "Invalid key: Length was less than 16 bytes");
				model.addAttribute("RSAError", true);
				return;
			}

			map.put("userId", tea.decrypt(map.get("userId")));

			String isOuterUser = map.containsKey("isOuterUser") ? tea.decrypt(map.get("isOuterUser")) : "N";

			UserVo vo = null;
			UserVo pwdValid = service.getItem(map.get("userId"));


			if (pwdValid == null || "".equals(pwdValid.getUserId())) {
				model.addAttribute("error", "등록되지 않은 아이디입니다.");
				return;
			}

			if(!"N".equals(pwdValid.getLoginSms())){

				if (!StringUtils.isBlank(map.get("smsChk"))) {
					map.put("smsChk", tea.decrypt(map.get("smsChk")));
				} else {
					map.put("smsChk", "N");
				}

				if ("Y".equals(map.get("smsChk"))) {
					String sessionAccNo = (String) session.getAttribute("acc_no");
					if (sessionAccNo == null) {
						model.addAttribute("smsError", "인증번호를 받은 후 전송된 인증번호를 입력하여 주십시오.");
						return;
					}

					map.put("accNo", tea.decrypt(map.get("accNo")));
					if (!sessionAccNo.equals(map.get("accNo"))) {
						model.addAttribute("smsError", "인증번호가 일치하지 않습니다.");
						return;
					}
				}

			}





			map.put("userPwd", SHA.simpleEnc512(pwdValid.getUserId() + tea.decrypt(map.get("userPwd"))));
			vo = service.getItem(map);



			//계정상태 12 검사하던 내용 삭제
			if ((vo != null && !"".equals(vo.getUserId()) )) {

				if(!"12".equals(vo.getAuthStatCd())){
					model.addAttribute("error", "계정 인증상태가 승인 상태가 아닙니다.\n\n관리자에게 문의해주세요.");
					return;
				}

				if("Y".equals(isOuterUser)){
					if(!"Y".equals(vo.getOutSign())){
						model.addAttribute("error", "외부 접속권한이 존재하지 않습니다.\n\n관리자에게 문의해주세요.");
						return;
					}
				}

				LoginManager loginManager = LoginManager.getInstance();

				if (!loginManager.isUsing(vo.getUserId())) {

					loginManager.setSession(req.getSession(), vo.getUserId());
					session.setAttribute("sessionId", req.getSession().getId());

					session.setAttribute("isCCTVDomain", false);

					session.setAttribute("userVo", vo);

					session.setAttribute("userId", vo.getUserId());
					session.setAttribute("userNm", vo.getUserNm());
					session.setAttribute("email", vo.getEmail());
					session.setAttribute("mobileNum", vo.getMobileNum());
					session.setAttribute("authList", auth.getList(null));
					session.setAttribute("authGrpId", vo.getAuthGrpNo());
					session.setAttribute("authGrpNm", vo.getAuthGrpNm());
					session.setAttribute("orgMgrNo", vo.getOrgMgrNo());
					session.setAttribute("signDate", DateUtil.getStrSec());

					HashMap<String, String> authParam = new HashMap<String, String>();
					authParam.put("authGrpNo", vo.getAuthGrpNo());

					ArrayList<AuthGrpVo> AuthGrpVoList = auth.getAuthGrpList(authParam);

					session.setAttribute("authGrp", AuthGrpVoList);
					session.setAttribute("userIp", req.getRemoteAddr());
					session.removeAttribute("RSA");

					authParam.put("authMgrNo","BTN");

					model.addAttribute("result", vo);
					model.addAttribute("authList",  auth.getAuthListByAuthGrpNo(authParam));


				} else {
					HttpSession signSession = loginManager.getSession(vo.getUserId());

					model.addAttribute("code", "GMX-1001");
					model.addAttribute("userId", vo.getUserId());

					if(signSession != null){
						String signDate = (String) signSession.getAttribute("signDate");
						model.addAttribute("signDate", DateUtil.formatDate(signDate));
					}

					model.addAttribute("error", "이미 접속 중인 사용자입니다.");
				}


			} else {
				model.addAttribute("error", "아이디에 따른 비밀번호가 틀렸습니다.");
			}

		}

	}

	/**
	 * 사용자 비밀번호를 변경합니다.
	 *
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editPassword.json", method = RequestMethod.POST)
	public void editPassword(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		map.put("userId", (String) session.getAttribute("userId"));
		map.put("userPwd", SHA.simpleEnc512(map.get("userId") + map.get("nowUserPwd")));

		UserVo vo = service.getItem(map);

		if (vo != null && !"".equals(vo.getUserId())) {
			map.put("newUserPwd", SHA.simpleEnc512(map.get("userId") + map.get("newUserPwd")));
			model.addAttribute("result", service.editPassword(map));
		} else {
			model.addAttribute("error", "현재 비밀번호를 다시 한번 확인해 주세요.");
		}
	}

	/**
	 * 사용자 비밀번호를 관리자가 변경합니다.
	 *
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editPasswordAdmin.json", method = RequestMethod.POST)
	public void editPasswordAdmin(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		map.put("userId", map.get("userId"));
		map.put("newUserPwd", SHA.simpleEnc512(map.get("userId") + map.get("resetPwd")));

		model.addAttribute("result", service.editPasswordAdmin(map));
	}

	/**
	 * 사용자가 입력한 비밀번호가 맞는지 확인합니다.
	 *
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/checkPassword.json", method = RequestMethod.POST)
	public void checkPassword(Model model, HttpSession session, @RequestParam HashMap<String, String> map)throws Exception {

		if(map.containsKey("userId") && !StringUtils.isEmpty((String) map.get("userId"))){
			map.put("userId", map.get("userId"));
		}else{
			map.put("userId", (String) session.getAttribute("userId"));
		}
		map.put("userPwd", SHA.simpleEnc512(map.get("userId") + map.get("userPwd")));

		UserVo vo = service.getItem(map);

		if (vo != null && !"".equals(vo.getUserId())) {
			model.addAttribute("result", true);
		} else {
			model.addAttribute("error", "비밀번호를 다시 확인해 주세요.");
		}
	}

	/**
	 * 세션을 무효화 합니다. <br>
	 * redirect : 로그인페이지
	 *
	 * @param res
	 * @param model
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/signOut.do")
	public String signOut(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		LoginManager loginManager = LoginManager.getInstance();
		loginManager.LogOut(session.getId());

		if(map.get("action") == null || !"auto".equals(map.get("action"))){
			String userId = (String) session.getAttribute("userId");
			String userIp = (String) session.getAttribute("userIp");
			String useTime = DateUtil.getStrSec();

			if(userId != null){
				if(!"".equals(userId)){
					AccessVo vo = new AccessVo();
					vo.setUsrId(userId);
					vo.setConnIp(userIp);
					vo.setAllowYn("Y");
					vo.setAuthMgrNo("USR002");
					vo.setUseTime(useTime);
					vo.setRmark("사용자로그아웃");
					access.add(vo);
				}
			}
		}

		session.invalidate();

		return "redirect:/user/login.do";
		//return "redirect:/map/view.do";
	}

	/**
	 * 세션을 무효화 합니다. <br>
	 * redirect : 로그인페이지
	 *
	 * @param res
	 * @param model
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/signOut.json")
	public void signOutSelf(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		LoginManager loginManager = LoginManager.getInstance();
		loginManager.LogOut(session.getId());

		if(map.get("action") == null || !"auto".equals(map.get("action"))){
			String userId = (String) session.getAttribute("userId");
			String userIp = (String) session.getAttribute("userIp");
			String useTime = DateUtil.getStrSec();

			if(userId != null){
				if(!"".equals(userId)){
					AccessVo vo = new AccessVo();
					vo.setUsrId(userId);
					vo.setConnIp(userIp);
					vo.setAllowYn("Y");
					vo.setAuthMgrNo("USR002");
					vo.setUseTime(useTime);
					vo.setRmark("사용자로그아웃");
					access.add(vo);
				}
			}
		}

		session.invalidate();

		model.addAttribute("result", true);
	}

	/**
	 * 세션을 무효화 합니다. <br>
	 * redirect : 로그인페이지
	 *
	 * @param res
	 * @param model
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/sessionDestroy.json")
	public void sessionDestroy(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		String user = map.get("user");
		if(user != null){
			if(!"".equals(user)){
				String[] userList = user.split(",");

				for(int i=0; i<userList.length; i++){

					LoginManager loginManager = LoginManager.getInstance();
					HttpSession session = loginManager.getSession(userList[i]);

					if(session != null){

						String userId = (String) session.getAttribute("userId");
						String userIp = (String) session.getAttribute("userIp");
						String useTime = DateUtil.getStrSec();

						if(userId != null){
							if(!"".equals(userId)){
								AccessVo vo = new AccessVo();
								vo.setUsrId(userId);
								vo.setConnIp(userIp);
								vo.setAllowYn("Y");
								vo.setAuthMgrNo("USR002");
								vo.setUseTime(useTime);
								vo.setRmark("사용자로그아웃");
								access.add(vo);
							}
						}

						if(userId != null){
							if(!"".equals(userId)){
								websocket.goSignOut(userId);

								loginManager.ifUsingRemoveUser(userId);
							}
						}
					}

				}

				model.addAttribute("result", true);
			}
		}

	}

	/**
	 * 세션을 무효화 합니다. <br>
	 * redirect : 로그인페이지
	 *
	 * @param res
	 * @param model
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/signOutByAdmin.do")
	public String signOutByAdmin(RedirectAttributes redirectAttributes, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		if(map.get("adminNotice") != null){
			redirectAttributes.addFlashAttribute("adminNotice", map.get("adminNotice"));
		}

		if(map.get("action") == null || !"auto".equals(map.get("action"))){
			String userId = (String) session.getAttribute("userId");
			String userIp = (String) session.getAttribute("userIp");
			String useTime = DateUtil.getStrSec();

			if(userId != null){
				if(!"".equals(userId)){
					AccessVo vo = new AccessVo();
					vo.setUsrId(userId);
					vo.setConnIp(userIp);
					vo.setAllowYn("Y");
					vo.setAuthMgrNo("USR002");
					vo.setUseTime(useTime);
					vo.setRmark("사용자로그아웃");
					access.add(vo);
				}
			}

			LoginManager loginManager = LoginManager.getInstance();
			loginManager.ifUsingRemoveUser(userId);
		}

		//session.invalidate();

		return "redirect:/user/login.do";
		//return "redirect:/map/view.do";
	}

	/**
	 * 사용자 정보 리스트를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getList.json", method = RequestMethod.POST)
	public void getList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getList(map));
		model.addAttribute("count", service.getCount(map));

	}

	/**
	 * 사용 가능한 계정인지 체크합니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/duplicateUserId.json", method = RequestMethod.POST)
	public void getItem(HttpServletRequest req, Model model, @RequestParam String userId) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("userId", userId);

		model.addAttribute("result", service.getItem(map));

	}

	/**
	 * 특정 사용자의 데이터를 가져옵니다. <br>
	 * View, Json 리졸버 두가지를 사용합니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getItem", method = RequestMethod.POST)
	public String getItem(HttpServletRequest req, Model model, @RequestParam HashMap<String, String> map) throws Exception {

		String url = req.getRequestURI();
		if (url.endsWith(".do")) {
			model.addAttribute("column", col.getList());
		}

		UserVo vo = service.getItem(map);

		model.addAttribute("result", vo);

		return "/user/view";
	}

	/**
	 * 사용자 계정을 삭제합니다. <b>현재 사용되지 않습니다.</b>
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, HttpSession session, @RequestParam(required = true) HashMap<String, String> map)
		throws Exception {

		model.addAttribute("result", service.del(map));

	}

	/**
	 * 사용자 계정을 추가합니다.
	 *
	 *` @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid UserVo param, BindingResult br)
		throws Exception {

		if (param.getAccNo() != null) {
			String sessionAccNo = (String) session.getAttribute("acc_no");
			if (sessionAccNo == null) {
				model.addAttribute("smsError", "인증번호를 받은 후 전송된 인증번호를 입력하여 주십시오.");
				return;
			}

			if (!sessionAccNo.equals(param.getAccNo())) {
				model.addAttribute("smsError", "인증번호가 일치하지 않습니다.");
				return;
			}
		}

		param.setUserPwd(SHA.simpleEnc512(param.getUserId() + param.getUserPwd()));
		//param.setAuthGrpNo("G00002");
		param.setAuthStatCd("11");
		/*
		 * param.setAuthAtmtCnt(0); param.setAuthConnIp("127.0.0.1"); param.setDepartNm("1"); param.setPosNm("1");
		 * param.setMobileNum("1");
		 */
		param.setReqDat(DateUtil.getStrSec());

		String[] ignoreField = { "authGrpNo", "mobileNum", "posNm", "departNm" };
		String msg = ValidInspector.findError(br, ignoreField);

		if ("pass".equals(msg)) {

			SystemParameter sysParam = new SystemParameter(sysParamList.getList(null));

			HashMap<String, String> map = null;
			map = sysParam.getParamMap();

			String uploadPath = map.get("sys.upload_path");
			String subDir = param.getSubDir();
			MultipartFile file = param.getFile();
			if (file != null) {
				if (ValidInspector.isPathAttack(file.getOriginalFilename())) {
					model.addAttribute("error", "올바른 파일 이름이 아닙니다.\n특수문자를 제거해 주세요.");
					return;
				} else if (file.getOriginalFilename().length() > 30) {
					model.addAttribute("error", "파일명은 30자 미만으로 업로드 할 수 있습니다.");
					return;
				} else {
					String fileNm = file.getOriginalFilename();
					String tempNm = DateUtil.getStrMilSec() + "_" + fileNm;
					String fullPath = uploadPath + subDir + tempNm;

					File chkDir = new File(uploadPath + subDir);
					if (!chkDir.isDirectory()) {
						try {
							chkDir.mkdirs();
						} catch (Exception e) {}
					}

					param.setOathFileNm(fileNm);
					param.setOathFilePath(fullPath);

					File realFile = new File(fullPath);
					file.transferTo(realFile);
				}
			}

			if(param.getLoginSms() == null){
				param.setLoginSms("Y");
			}

			if(param.getOutSign() == null){
				param.setOutSign("N");
			}

			if(param.getOutStream() == null){
				param.setOutStream("N");
			}

			boolean addChk = service.add(param);

			if(addChk && "Y".equals(smsChk)){
				//190410 이은규
				//관리자에게 SMS를 발송한다.`
				String title = "사용자 등록신청";
				String smsConts = "[스마트시티 통합플랫폼] 사용자 "+param.getUserId()+"("+param.getUserNm()+")가 사용자 등록을 신청하였습니다.";
				sendUserSms(title, smsConts, "addUser");
			}

			model.addAttribute("result", addChk);
		} else {
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 사용자 계정을 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid UserVo param, BindingResult br)
		throws Exception {
		String[] ignoreField = { "authGrpNo" };
		String msg = ValidInspector.findError(br, ignoreField);

		if ("pass".equals(msg)) {
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("userId", param.getUserId());
			map.put("userPwd", SHA.simpleEnc512(param.getUserId() + param.getUserPwd()));
			UserVo valid = service.getItem(map);

			if (valid == null) {
				model.addAttribute("error", "비밀번호를 다시한번 확인해 주세요.");
			} else if (valid.getUserId() != null && !"".equals(valid.getUserId())) {

				SystemParameter sysParam = new SystemParameter(sysParamList.getList(null));

				HashMap<String, String> paramMap = null;
				paramMap = sysParam.getParamMap();

				String uploadPath = paramMap.get("sys.upload_path");
				String subDir = param.getSubDir();

				MultipartFile file = param.getFile();
				if (file != null) {
					if (ValidInspector.isPathAttack(file.getOriginalFilename())) {
						model.addAttribute("error", "올바른 파일 이름이 아닙니다.\n특수문자를 제거해 주세요.");
						return;
					} else if (file.getOriginalFilename().length() > 30) {
						model.addAttribute("error", "파일명은 30자 미만으로 업로드 할 수 있습니다.");
						return;
					} else {
						String fileNm = file.getOriginalFilename();
						String tempNm = DateUtil.getStrMilSec() + "_" + fileNm;
						String fullPath = uploadPath + subDir + tempNm;

						File chkDir = new File(uploadPath + subDir);
						if (!chkDir.isDirectory()) {
							try {
								chkDir.mkdirs();
							} catch (Exception e) {}
						}

						param.setOathFileNm(fileNm);
						param.setOathFilePath(fullPath);

						File realFile = new File(fullPath);
						file.transferTo(realFile);

						File beforeFile = new File(valid.getOathFilePath());
						if (beforeFile.exists()) beforeFile.delete();
					}
				}

				model.addAttribute("result", service.edit(param));
			}
		} else {
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 사용자 그리드 정보를 변경합니다.
	 *
	 * @param model
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editBoardInfo.json", method = RequestMethod.POST)
	public void editBoardInfo(Model model, HttpSession session, @RequestParam HashMap<String, String> map)
		throws Exception {

		String userId = (String) session.getAttribute("userId");

		if (userId != null && !"".equals(userId)) {
			model.addAttribute("result", service.editBoardInfo(map));
		} else {
			model.addAttribute("error", "세션이 존재하지 않습니다.");
		}

	}

	/**
	 * 사용자 계정 권한을 변경합니다. <br>
	 * <br>
	 * <b>ManagementController로 이동되어 현재 사용되지 않습니다.</b>
	 *
	 * @param model
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/editAuth.json", method = RequestMethod.POST)
	public void editAuth(Model model, @ModelAttribute UserVo param) throws Exception {

		if (!"".equals(param.getUserId()) && param.getUserId() != null &&
			!"".equals(param.getAcptDat()) && param.getAcptDat() != null) {

			model.addAttribute("result", service.edit(param));
		} else {
			model.addAttribute("error", "아이디, 사용자 구분, 계정상태는 필수 항목입니다.");
		}

	}

	/**
	 * 사용자정보 확인 후, 해당 계정이 존재하면 임시 비밀번호를 발급합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/findAndEidt.json", method = RequestMethod.POST)
	public void findAndEidt(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		if ("Y".equals(map.get("smsChk"))) {
			String sessionAccNo = (String) session.getAttribute("acc_no");
			if (sessionAccNo == null) {
				model.addAttribute("smsError", "인증번호를 받은 후 전송된 인증번호를 입력하여 주십시오.");
				return;
			}

			if (!sessionAccNo.equals(map.get("accNo"))) {
				model.addAttribute("smsError", "인증번호가 일치하지 않습니다.");
				return;
			}
		}

		UserVo vo = service.getItem(map);

		if (vo == null) {
			model.addAttribute("error", "입력하신 정보와 일치하는 계정이 존재하지 않습니다.\n계정정보가 정확할 경우만 임시 비밀번호발급이 가능합니다.\n계정정보 확인 후, 다시 시도하여 주십시오.");
		} else if (vo.getUserId() != null && !"".equals(vo.getUserId())) {
			Random rd = new Random();
			String temp_pw = "";

			String randStr = "1234567890abcdefghijkl1234567890mnopqrstuvwxyz";
			for (int i = 0; i < 8; i++) {
				temp_pw += "" + randStr.charAt(rd.nextInt(randStr.length()));
			}
			/*
			 * for(int i=0; i<2; i++){ temp_pw += ""+rd.nextInt(10); }
			 */

			try {
				HashMap<String, String> pwdMap = new HashMap<String, String>();
				pwdMap.put("userId", vo.getUserId());
				pwdMap.put("userPwd", vo.getUserPwd());
				pwdMap.put("newUserPwd", SHA.simpleEnc512(vo.getUserId() + temp_pw));

				service.editPassword(pwdMap);
				model.addAttribute("result", temp_pw);
			} catch (Exception e) {
				System.out.println(e);
				model.addAttribute("error", "임시 비밀번호 생성을 실패하였습니다.\n 관리자에게 문의하여 주십시오.");
			}
		}

	}

	/**
	 * 입력한 정보와 일치하는 계쩡의 ID를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping(value = "/findId.json", method = RequestMethod.POST)
	public void findId(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		if ("Y".equals(map.get("smsChk"))) {
			String sessionAccNo = (String) session.getAttribute("acc_no");
			if (sessionAccNo == null) {
				model.addAttribute("smsError", "인증번호를 받은 후 전송된 인증번호를 입력하여 주십시오.");
				return;
			}

			if (!sessionAccNo.equals(map.get("accNo"))) {
				model.addAttribute("smsError", "인증번호가 일치하지 않습니다.");
				return;
			}
		}

		//UserVo vo = service.getItem(map);
		ArrayList<UserVo> list = service.getList(map);

		if (list.size() == 0) {
			model.addAttribute("error", "입력하신 정보와 일치하는 계정이 존재하지 않습니다.\r\n계정정보 확인 후, 다시 시도하여 주십시오.");
		} else if (list.size() > 0) {
			String userIdList = "";

			int i = 0;
			for(UserVo vo : list){
				if(i == 0){
					i++;
					userIdList += vo.getUserId();
				}else{
					userIdList += ", " + vo.getUserId();
				}
			}

			model.addAttribute("result", userIdList);
		} else {
			model.addAttribute("error", "아이디 찾기를 실패하였습니다.\r\n 관리자에게 문의하여 주십시오.");
		}

	}

	/**
	 * 관리자가 해당 계정의 임시 비밀번호를 발급합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editPasswordByAdmin.json", method = RequestMethod.POST)
	public void editPasswordByAdmin(Model model, HttpSession session, @RequestParam HashMap<String, String> map)
		throws Exception {

		UserVo vo = service.getItem(map);

		if (vo.getUserId() != null && !"".equals(vo.getUserId())) {
			Random rd = new Random();
			String temp_pw = "";
			for (int i = 0; i < 5; i++) {
				temp_pw += "" + rd.nextInt(10);
			}

			try {
				HashMap<String, String> pwdMap = new HashMap<String, String>();
				pwdMap.put("userId", vo.getUserId());
				pwdMap.put("userPwd", vo.getUserPwd());
				pwdMap.put("newUserPwd", SHA.simpleEnc512(vo.getUserId() + temp_pw));

				service.editPassword(pwdMap);
				model.addAttribute("result", temp_pw);
			} catch (Exception e) {
				System.out.println(e);
				model.addAttribute("error", "임시 비밀번호 생성을 실패하였습니다.");
			}
		} else {
			model.addAttribute("error", "임시 비밀번호 생성을 실패하였습니다.");
		}

	}

	/**
	 * 요청한 파일을 리턴합니다.
	 *
	 * @param req
	 * @param session
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping("/getFile.json")
	public void getFiles(HttpServletRequest req, HttpServletResponse res, HttpSession session, Model model,
						 @RequestParam HashMap<String, String> map)
		throws Exception {

		UserVo vo = service.getItem(map);

		if (vo == null) {
			model.addAttribute("error", "파일이 존재하지 않습니다.");
		} else {
			String realFileName = vo.getOathFileNm();
			String realFile = vo.getOathFilePath();

			BufferedOutputStream out = null;
			InputStream in = null;
			String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자("
				+ req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : " + realFile + ")";

			try {
				res.setContentType("application/octet-stream");
				res.setHeader("Content-Disposition",
					"inline;filename=" + new String(realFileName.getBytes("UTF-8"), "ISO-8859-1"));
				File file = new File(realFile);
				if (file.exists()) {
					in = new FileInputStream(file);
					out = new BufferedOutputStream(res.getOutputStream());
					int len;
					byte[] buf = new byte[1024];
					while ((len = in.read(buf)) > 0) {
						out.write(buf, 0, len);
					}
				} else {
					System.out.println(exceptionStr);
				}
			} catch (Exception e) {
				System.out.println(exceptionStr);
			} finally {
				if (out != null) {
					out.flush();
				}
				if (out != null) {
					out.close();
				}
				if (in != null) {
					in.close();
				}
			}
		}

	}

	/**
	 * 트레이 설치파일을 다운로드합니다.
	 *
	 * @param req
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping("/getTrayFile.json")
	public void getTrayFile(HttpServletRequest req, HttpServletResponse res) throws Exception {

		String trayFile = sysDownloadPath + trayFileNm;
		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			res.setContentType("application/octet-stream");
			res.setHeader("Content-Disposition", "attachment;filename=" + new String(trayFileNm.getBytes("UTF-8"), "ISO-8859-1"));

			File file = new File(trayFile);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[1024];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}else{
				System.out.println("file is not exist.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null){ try{ out.flush(); }catch(Exception e){} }
			if(out != null){ try{ out.close(); }catch(Exception e){} }
			if(in != null){ try{ in.close(); }catch(Exception e){} }
		}
	}

	/**
	 * 전용플레이어 설치파일을 다운로드합니다.
	 *
	 * @param req
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping("/getPlayerFile.json")
	public void getPlayerFile(HttpServletRequest req, HttpServletResponse res) throws Exception {

		String trayFile = sysDownloadPath + playerFileNm;
		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			res.setContentType("application/octet-stream");
			res.setHeader("Content-Disposition", "attachment;filename=" + new String(playerFileNm.getBytes("UTF-8"), "ISO-8859-1"));

			File file = new File(trayFile);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[1024];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}else{
				System.out.println("file is not exist.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null){ try{ out.flush(); }catch(Exception e){} }
			if(out != null){ try{ out.close(); }catch(Exception e){} }
			if(in != null){ try{ in.close(); }catch(Exception e){} }
		}
	}

	/**
	 * APP링크를 SMS로 전송합니다.
	 *
	 * @param req
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping("/getAppsFile.json")
	public void getAppsFile(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		HashMap<String, String> smsParam1 = new HashMap<String, String>();
		HashMap<String, String> smsParam2 = new HashMap<String, String>();
		HashMap<String, String> smsParam3 = new HashMap<String, String>();

		String smsConts1 = "[스마트시티 통합플랫폼 어플리케이션 안내]";
		smsConts1 += "\n\n안드로이드 OS에서만 사용하실 수 있습니다.";

		String smsConts2 = "1. 대시민용";
		smsConts2 += "\nhttp://argos.seocho.go.kr/xeus/api/app.jsp?type=Public";

		String smsConts3 = "2. 사용자용";
		smsConts3 += "\nhttp://argos.seocho.go.kr/xeus/api/app.jsp?type=TheInterestedPeople";

		String receivers = (String) session.getAttribute("userNm") + "^" + (String) session.getAttribute("mobileNum");
		String title = "APP 링크 전송";
		String url = "";
		HashMap<String, String> sysMap = null;
		SystemParameter sysParam = new SystemParameter(param.getList(null));
		sysMap = sysParam.getParamMap();
		url = sysMap.get("sms.send.url");

		smsParam1.put("url", url);
		smsParam1.put("title", title);
		smsParam1.put("msg", smsConts1);
		smsParam1.put("receivers", receivers);

		smsParam2.put("url", url);
		smsParam2.put("title", title);
		smsParam2.put("msg", smsConts2);
		smsParam2.put("receivers", receivers);

		smsParam3.put("url", url);
		smsParam3.put("title", title);
		smsParam3.put("msg", smsConts3);
		smsParam3.put("receivers", receivers);

		String sendRslt1 = SendSms.sendSms(smsParam1);
		String sendRslt2 = SendSms.sendSms(smsParam2);
		String sendRslt3 = SendSms.sendSms(smsParam3);

		boolean result = false;
		if("S0".equals(sendRslt1) && "S0".equals(sendRslt2) && "S0".equals(sendRslt3)) result = true;
		if (result) {
			model.addAttribute("result", true);
			model.addAttribute("userNm", (String) session.getAttribute("userNm"));
			model.addAttribute("mobileNum", (String) session.getAttribute("mobileNum"));
		} else {
			model.addAttribute("result", false);
			model.addAttribute("error", "SMS 전송을 실패하였습니다.");
		}
	}

	/**
	 * 전용플레이어 매뉴얼을 다운로드합니다.
	 *
	 * @param req
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping("/getPlayerManualFile.json")
	public void getPlayerManualFile(HttpServletRequest req, HttpServletResponse res) throws Exception {

		String playerManualFile = sysDownloadPath + playerManualFileNm;
		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			res.setContentType("application/octet-stream");
			res.setHeader("Content-Disposition", "attachment;filename=" + new String(playerManualFileNm.getBytes("UTF-8"), "ISO-8859-1"));

			File file = new File(playerManualFile);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[1024];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}else{
				System.out.println("file is not exist.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null){ try{ out.flush(); }catch(Exception e){} }
			if(out != null){ try{ out.close(); }catch(Exception e){} }
			if(in != null){ try{ in.close(); }catch(Exception e){} }
		}
	}


	/**
	 * 크롬 설치파일을 다운로드합니다.
	 *
	 * @param req
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping("/getChromeFile.json")
	public void getChromeFile(HttpServletRequest req, HttpServletResponse res) throws Exception {

		String trayFile = sysDownloadPath + chromeFileNm;
		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			res.setContentType("application/octet-stream");
			res.setHeader("Content-Disposition", "attachment;filename=" + new String(chromeFileNm.getBytes("UTF-8"), "ISO-8859-1"));

			File file = new File(trayFile);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[1024];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}else{
				System.out.println("file is not exist.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null){ try{ out.flush(); }catch(Exception e){} }
			if(out != null){ try{ out.close(); }catch(Exception e){} }
			if(in != null){ try{ in.close(); }catch(Exception e){} }
		}
	}

	/**
	 * 보안서약서를 다운로드합니다.
	 *
	 * @param req
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@RequestMapping("/getPledgeFile.json")
	public void getPledgeFile(HttpServletRequest req, HttpServletResponse res) throws Exception {

		String pledgeFile = sysDownloadPath + pledgeFileNm;
		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			res.setContentType("application/octet-stream");
			res.setHeader("Content-Disposition", "attachment;filename=" + new String(pledgeFileNm.getBytes("UTF-8"), "ISO-8859-1"));

			File file = new File(pledgeFile);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[1024];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}else{
				System.out.println("file is not exist.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null){ try{ out.flush(); }catch(Exception e){} }
			if(out != null){ try{ out.close(); }catch(Exception e){} }
			if(in != null){ try{ in.close(); }catch(Exception e){} }
		}
	}



	/**
	 * 현재 접속중인 사용자 목록을 조회합니다.
	 *
	 * @param model
	 * @param session
	 */
	@NoSession
	@RequestMapping(value = "/getAccUserList.json")
	public void getAccUserList(Model model) {

		LoginManager loginManager = LoginManager.getInstance();

		model.addAttribute("list", loginManager.getUserList());

	}

	/**
	 * 사용자 로그인 제한 횟수를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editLockCnt.json", method = RequestMethod.POST)
	public void editLockCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		if (!"".equals(map.get("userId")) && map.get("userId") != null) {

			model.addAttribute("result", service.editAuthAtmtCnt(map));

		} else {
			model.addAttribute("error", "아이디는 필수 항목입니다.");
		}

	}

	@NoSession
	@RequestMapping(value = "/setAttr.json", method = RequestMethod.POST)
	public void setAttr(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		session.setAttribute("acc_no", map.get("acc_no"));

	}

	@NoSession
	@RequestMapping(value = "/getAttr.json", method = RequestMethod.POST)
	public void getAttr(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", (String) session.getAttribute(map.get("attr")));

	}

	@RequestMapping(value = "/getAuthList.json", method = RequestMethod.POST)
	public void getAuthList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", session.getAttribute("authList"));

	}

	@RequestMapping(value = "/getAuthGrp.json", method = RequestMethod.POST)
	public void getAuthGrp(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", session.getAttribute("authGrp"));

	}

	@NoSession
	@RequestMapping(value = "/validChk.json", method = RequestMethod.POST)
	public void validChk(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		RSA rsa = null;
		TEA tea = null;
		try {
			rsa = new RSA((RSAKey) session.getAttribute("RSA"));
			tea = new TEA(rsa.decrypt(map.get("key")));
		} catch (Exception e) {
			//model.addAttribute("error", "Invalid key: Length was less than 16 bytes");
			e.printStackTrace();
			model.addAttribute("RSAError", true);
			return;
		}

		map.put("userId", tea.decrypt(map.get("userId")));
		map.put("mobileNum", tea.decrypt(map.get("mobileNum")));

		UserVo userVo = service.getItem(map.get("userId"));
		if (userVo == null || "".equals(userVo.getUserId())) {
			model.addAttribute("result", false);
			model.addAttribute("cause", "id");
			return;
		}
		String password = SHA.simpleEnc512(userVo.getUserId() + tea.decrypt(map.get("userPwd")));

		if(!userVo.getUserPwd().equals(password)){
			model.addAttribute("result", false);
			model.addAttribute("cause", "pwd");
			return;
		}

		String mobileNum = map.get("mobileNum");
		if(!userVo.getMobileNum().equals(mobileNum)){
			model.addAttribute("result", false);
			model.addAttribute("cause", "mobileNum");
			return;
		}


		map.put("userPwd", password);

		if (service.getCount(map) == 1){
			model.addAttribute("result", true);
			model.addAttribute("userNm", service.getItem(map).getUserNm());
		}else{
			model.addAttribute("result", false);
			model.addAttribute("error", "etc");
			return;
//			model.addAttribute("userNm", service.getItem(map).getUserNm());
		}

	}

	@NoSession
	@RequestMapping(value = "/createAccNo.json", method = RequestMethod.POST)
	public void createAccNo(Model model, HttpSession session, @RequestParam HashMap<String, String> map)
		throws Exception {

		String msg = "";

		RSA rsa = null;
		TEA tea = null;
		try {
			rsa = new RSA((RSAKey) session.getAttribute("RSA"));
			tea = new TEA(rsa.decrypt(map.get("key")));
		} catch (Exception e) {
			//model.addAttribute("error", "Invalid key: Length was less than 16 bytes");
			model.addAttribute("RSAError", true);
			return;
		}

		map.put("mobileNum", tea.decrypt(map.get("mobileNum")));

		HashMap<String, String> smsParam = new HashMap<String, String>();

		String accNo = "";
		Random rd = new Random();
		String randNum = "1234567890";
		for (int i = 0; i < 6; i++) {
			accNo += "" + randNum.charAt(rd.nextInt(randNum.length()));
		}

		//String smsConts = "[스마트시티 통합플랫폼] 인증번호는 [" + accNo + "] 입니다.";
		String smsConts = "[" + accNo + "]는 [스마트시티 통합플랫폼] 인증번호 입니다.";
		String receivers = map.get("userNm") + "^" + map.get("mobileNum");
		String title = "인증번호 발송";

		//String url = "http://10.1.73.58:8080/xeus-platform-interface/sms.do";
		String url = "";
		HashMap<String, String> sysMap = null;
		SystemParameter sysParam = new SystemParameter(param.getList(null));
		sysMap = sysParam.getParamMap();
		url = sysMap.get("sms.send.url");

		smsParam.put("url", url);
		smsParam.put("title", title);
		smsParam.put("msg", smsConts);
		smsParam.put("receivers", receivers);

		//SendSms smsSender = new SendSms();
		String sendRslt = SendSms.sendSms(smsParam);
		if ("S0".equals(sendRslt)) {
			//세션에 인증번호 추가
			session.setAttribute("acc_no", accNo);
			model.addAttribute("result", true);
		} else if ("F0".equals(sendRslt)) {
			model.addAttribute("result", false);
			msg = "인증번호 발송에 실패하였습니다.";
		}

		String nowTime = DateUtil.getStrSec();
		MsgLogVo logVo = new MsgLogVo();
		logVo.setSendMsg(smsConts);
		logVo.setSendTyp("S1");
		//logVo.setRecvId(map.get("userId"));//인증번호는 ID를 모르는게 정상
		logVo.setRecvNum(map.get("mobileNum"));
		logVo.setSendDt(nowTime);
		logVo.setSendRslt(sendRslt);
		logVo.setRsltDesc("");
		msgLogService.add(logVo);
		model.addAttribute("msg", msg);
	}

	//190410 이은규
	//관리자 sms발송 메소드
	public void sendUserSms(String title, String smsConts, String smsAuth) throws Exception{

		HashMap<String, String> smsParam = new HashMap<String, String>();

		//String url = "http://10.1.73.58:8080/xeus-platform-interface/sms.do";
		String url = "";
		String adminSmsList = "";

		HashMap<String, String> sysMap = null;
		SystemParameter sysParam = new SystemParameter(param.getList(null));
		sysMap = sysParam.getParamMap();
		url = sysMap.get("sms.send.url");

		smsParam.put("url", url);
		smsParam.put("title", title);
		smsParam.put("msg", smsConts);

//		adminSmsList = sysMap.get("tvius.admin_sms_list");
		ArrayList<SmsAuthVo> list = smsAuthService.getList(null);
		for(int i=0; i<list.size(); i++){
        	if(list.get(i).getSmsAuth().contains(smsAuth)){
        		adminSmsList += list.get(i).getUserId() +",";
        	}
        }

		if(!"".equals(adminSmsList)){
			adminSmsList = adminSmsList.substring(0, adminSmsList.length()-1);

			String[] adminAcc = adminSmsList.split(",");

			for(int i=0; i<adminAcc.length; i++){
				UserVo admin = service.getItem(adminAcc[i]);
				String receivers = admin.getUserNm() + "^" + admin.getMobileNum();

				smsParam.put("receivers", receivers);

				SendSms smsSender = new SendSms();
				String sendRslt = SendSms.sendSms(smsParam);

				String nowTime = DateUtil.getStrSec();
				MsgLogVo logVo = new MsgLogVo();
				logVo.setSendMsg(smsConts);
				logVo.setSendTyp("S1");
				//logVo.setRecvId(map.get("userId"));//인증번호는 ID를 모르는게 정상
				logVo.setRecvNum(admin.getMobileNum());
				logVo.setSendDt(nowTime);
				logVo.setSendRslt(sendRslt);
				logVo.setRsltDesc("");
				msgLogService.add(logVo);
			}
		}


	}

    /**
     * 사용자 잠금을 해제합니다 .
     *
     * @param model
     * @param param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/unLock.json", method = RequestMethod.POST)
    public void unLock(Model model, @RequestParam HashMap<String, String> map) throws Exception {
        UserVo vo = new UserVo();
        vo.setUserId(map.get("userId"));
        vo.setAuthStatCd("12");
        vo.setAuthAtmtCnt("0");

        model.addAttribute("result", service.edit(vo));
    }
}
