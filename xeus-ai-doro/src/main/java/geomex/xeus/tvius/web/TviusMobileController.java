package geomex.xeus.tvius.web;

import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.ui.Model;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.log.service.AccessService;
import geomex.xeus.log.service.AccessVo;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.NoticeService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.system.annotation.NoSession;
import geomex.xeus.tvius.service.CrmsTransAviService;
import geomex.xeus.tvius.service.CrmsTransRqstService;
import geomex.xeus.user.service.UserService;
import geomex.xeus.user.service.UserVo;
import geomex.xeus.user.util.RSA;
import geomex.xeus.user.util.RSAKey;
import geomex.xeus.user.util.SHA;
import geomex.xeus.user.util.TEA;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.login.LoginManager;

@Controller
public class TviusMobileController {

	private final String path = "/tvius/mobile";

	@Autowired
    private AccessService access;

    @Autowired
    private CodeCtrl code;

    @Autowired
    private AuthService auth;

    @Autowired
    private NoticeService notice;

    @Autowired
    private CrmsTransRqstService transRqst;

    @Autowired
    private CrmsTransAviService transAvi;

    @Autowired
    private SysPropService param;

    @Autowired
    private UserService userService;

    @Autowired
    PlatformTransactionManager transactionManager;

    @Resource(name = "propService")
    private EgovPropertyService propService;

    private String smsChk;

    @PostConstruct
    public void initIt() throws Exception {
    	this.smsChk = propService.getString("sys.sms").replaceAll("\"", "");
    }

    @Resource
    private Validator validator;

    @InitBinder
    private void initBinder(WebDataBinder binder){
        binder.setValidator(this.validator);
    }

    /**
     * 로그인 뷰로 이동합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(path)
    public String redirectLoginView(HttpSession session) throws Exception {

    	session.setAttribute("RSA", RSAKey.generate(1024));

    	return "redirect:/tvius/mobile/login.do";
    }

    /**
     * 로그인 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = path + "/login.do")
    public String loginView(HttpSession session, Model model) throws Exception {

    	String userId = (String) session.getAttribute("userId");
    	if(userId != null && !"".equals(userId) && !"null".equals(userId)){
    		return "redirect:/" + path + "/main.do";
    	}else{
    		session.setAttribute("RSA", RSAKey.generate(1024));
    		model.addAttribute("smsChk", this.smsChk);
    		return "/tvius/mobile/login";
    	}
    }

    /**
     * 영상반출신청 메인 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = path + "/main.do")
    public String mainView(HttpSession session, Model model) throws Exception {

    	HashMap<String, String> map = new HashMap<String, String>();
        map.put("sortCol", "mgr_seq");
        map.put("sortTyp", "desc");

        model.addAttribute("notice", notice.getList(map));
        model.addAttribute("noticeCount", notice.getCount(map));

    	return "/tvius/mobile/main";
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
    @RequestMapping(value = path + "/signIn.json", method = RequestMethod.POST)
    public void signIn(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        if (session.getAttribute("RSA") == null) {
            model.addAttribute("RSAError", true);
        } else {
            RSA rsa = null;
            TEA tea = null;

            try {
                rsa = new RSA((RSAKey) session.getAttribute("RSA"));
                tea = new TEA(rsa.decrypt(map.get("key")));
            } catch (Exception e) {
                model.addAttribute("RSAError", true);
                return;
            }

            map.put("userId", tea.decrypt(map.get("userId")));

//            String isOuterUser = tea.decrypt(map.get("isOuterUser"));
            String isOuterUser = "N";

            if(!"geomex".equals(map.get("userId"))){

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

            UserVo vo = null;
            UserVo pwdValid = userService.getItem(map.get("userId"));
            if (pwdValid == null || "".equals(pwdValid.getUserId())) {
                model.addAttribute("result", null);
                return;
            }

            map.put("userPwd", SHA.simpleEnc512(pwdValid.getUserId() + tea.decrypt(map.get("userPwd"))));
            vo = userService.getItem(map);

            if ((vo != null && !"".equals(vo.getUserId()) && "12".equals(vo.getAuthStatCd()))) {

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

	                session.setAttribute("userId", vo.getUserId());
	                session.setAttribute("userNm", vo.getUserNm());
	                session.setAttribute("email", vo.getEmail());
	                session.setAttribute("mobileNum", vo.getMobileNum());
	                session.setAttribute("authList", auth.getList(null));
	                session.setAttribute("authGrpId", vo.getAuthGrpNo());
	                session.setAttribute("orgMgrNo", vo.getOrgMgrNo());
	                session.setAttribute("signDate", DateUtil.getStrSec());

	                HashMap<String, String> authParam = new HashMap<String, String>();
	                authParam.put("authGrpNo", vo.getAuthGrpNo());
	                session.setAttribute("authGrp", auth.getAuthGrpList(authParam));
	                session.setAttribute("userIp", req.getRemoteAddr());
	                session.removeAttribute("RSA");

	                model.addAttribute("result", vo);


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
                model.addAttribute("error", "사용자 인증에 실패하였거나 시스템 접속권한이 존재하지 않습니다.");
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
    @RequestMapping(value = path + "/signOut.do")
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

        return "redirect:/tvius/mobile/login.do";
    }

    /**
     * 사용자 영상 신청 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = path + "/getUsrTviusRqst.do")
    public String getUsrTviusRqst(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        model.addAttribute("sysparam", sysMap);
        model.addAttribute("result", map);
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/tvius/mobile/usrTviusRqst";
    }

    /**
     * 사용자 영상 수정 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = path + "/getUsrTviusRqstEdit.do")
    public String getUsrTviusRqstEdit(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

    	HashMap<String, String> sysMap = new HashMap<String, String>();
    	SystemParameter sysParam = new SystemParameter(param.getList(null));
    	sysMap = sysParam.getParamMap();

    	model.addAttribute("sysparam", sysMap);
    	model.addAttribute("result", map);
    	model.addAttribute("rqst", transRqst.getList(map));
    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));

    	HashMap<String, String> aviParam = new HashMap<String, String>();
    	aviParam.put("rqstMgrSeq", map.get("mgrSeq"));
    	aviParam.put("sortCol", map.get("avi.mgr_seq"));
    	aviParam.put("sortTyp", map.get("asc"));
    	model.addAttribute("avi", transAvi.getList(aviParam));

    	return "/tvius/mobile/usrTviusRqstEdit";
    }

    /**
     * 사용자 영상정보 신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = path + "/getUsrTviusRqstView.do")
    public String getUsrTviusRqstView(Model model, HttpSession session, @RequestParam HashMap<String, String> map ) throws Exception {

    	map.put("reqstId", (String) session.getAttribute("userId"));

        model.addAttribute("param", map);
        model.addAttribute("stat", transRqst.getStatCount(map));
        model.addAttribute("userst", transRqst.getUseRstCount(map));
        model.addAttribute("count", transRqst.getCount(map));
        model.addAttribute("list", transRqst.getList(map));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/tvius/mobile/usrTviusRqstView";
    }

}
