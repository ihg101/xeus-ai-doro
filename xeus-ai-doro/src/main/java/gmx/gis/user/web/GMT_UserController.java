package gmx.gis.user.web;

import java.beans.PropertyEditorSupport;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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


import egovframework.rte.fdl.property.EgovPropertyService;
//import gmx.gis.log.service.GMT_AccessService;
//import gmx.gis.log.service.GMT_AccessVo;
//import gmx.gis.log.service.MsgLogService;
//import gmx.gis.log.service.MsgLogVo;
//import gmx.gis.smartcity.service.GMT_SessionWebSocketService;
//import gmx.gis.sysmgr.service.GMT_AuthService;
import gmx.gis.sysmgr.service.GMT_SysPropService;
import gmx.gis.log.service.GMT_AccessService;
import gmx.gis.log.service.GMT_AccessVo;
import gmx.gis.sysmgr.service.GMT_AuthGrpVo;
import gmx.gis.sysmgr.service.GMT_AuthService;
import gmx.gis.sysmgr.service.GMT_NoticeService;
import gmx.gis.sysmgr.service.GMT_OrganizationService;
import gmx.gis.smartcity.service.GMT_SessionWebSocketService;
//import gmx.gis.sysmgr.service.GMT_OrganizationService;
//import gmx.gis.sysmgr.web.GMT_CodeCtrl;
import gmx.gis.sysmgr.web.GMT_ColumnController;
import gmx.gis.system.annotation.GMT_NoSession;
import gmx.gis.user.service.GMT_UserService;
import gmx.gis.user.service.GMT_UserVo;
import gmx.gis.user.util.RSA;
import gmx.gis.user.util.RSAKey;
import gmx.gis.user.util.SHA;
import gmx.gis.user.util.TEA;
//import gmx.gis.util.code.GMT_CodeConvertor;
import gmx.gis.util.code.GMT_DateUtil;
import gmx.gis.util.code.GMT_SystemParameter;
import gmx.gis.util.code.GMT_ValidInspector;
//import gmx.gis.util.login.GMT_LoginManager;
import gmx.gis.util.login.GMT_LoginManager;

/**
 * <pre>
 * 파일명 :  GMT_UserController.java
 * 설  명 :
 *   사용자 컨트롤러
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-05-31      이주영          최초 생성
 * 2020-10-07	       민동현           수정
 *
 * </pre>
 *
 * @since : 2017. 5. 31.
 * @version : 1.0
 * @see
 */

@Controller
@RequestMapping("/GMT_user")
public class GMT_UserController {

//    @Resource(name = "codeCtrl")
//    private GMT_CodeCtrl code;

    @Autowired private GMT_UserService service;

    @Autowired private GMT_AuthService auth;

    @Autowired private GMT_AccessService access;

    @Autowired private GMT_NoticeService notice;

    @Autowired private GMT_SysPropService sysParamList;

    @Autowired  private GMT_ColumnController col;

    @Autowired private GMT_OrganizationService orgz;
//
//    @Resource(name = "msgLogService")
//    private MsgLogService msgLogService;

    @Resource(name = "propService")
    private EgovPropertyService propService;

    @Autowired private GMT_SysPropService param;

    @Autowired private GMT_SessionWebSocketService websocket;


    @PostConstruct
    public void initIt() throws Exception {


        HashMap<String, String> sysMap = new HashMap<String, String>();
        GMT_SystemParameter sysParam = new GMT_SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

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



    /**
     * 사용자 로그인 페이지 뷰로 이동합니다. <br>
     * 암호화 전송을 위하여 RSA 키를 발급합니다.
     *
     * @return view
     * @throws Exception
     */
    @GMT_NoSession
    @RequestMapping(value = "/login.do")
    public String loginView(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> param) throws Exception {

        String userId = (String) session.getAttribute("userId");

        session.removeAttribute("acc_no");
        session.setAttribute("RSA", RSAKey.generate(1024));

        model.addAttribute("notice", notice.getList(null));
        model.addAttribute("noticeCount", notice.getCount(null));
        model.addAttribute("orgz", orgz.getList(null));

        return "/GMT/user/login";
    }

    /**
     * 사용자 등록 페이지 뷰로 이동합니다.
     *
     * @return view
     * @throws Exception
     */
    @GMT_NoSession
    @RequestMapping(value = "/reg.do")
    public String regView(Model model, HttpSession session) throws Exception {

        model.addAttribute("orgz", orgz.getList(null));

        session.removeAttribute("acc_no");

        return "/GMT/user/reg";
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
    @GMT_NoSession
    @RequestMapping(value = "/signIn.json", method = RequestMethod.POST)
    public void signIn(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
    	//TEA, RSA key 체크
    	TEA tea=getTEAKey(session,map);
    	if(tea==null){
    		model.addAttribute("RSAError", true);
    		return;
    	}

    	//id 체크
        map.put("userId", tea.decrypt(map.get("userId")));
        GMT_UserVo pwdValid = service.getItem(map.get("userId"));
        if (pwdValid == null || "".equals(pwdValid.getUserId())) {
            model.addAttribute("result", null);
            return;
        }

        //password 체크
        map.put("userPwd", SHA.simpleEnc512(pwdValid.getUserId() + tea.decrypt(map.get("userPwd"))));
        GMT_UserVo vo = service.getItem(map);
        if ((vo != null && !"".equals(vo.getUserId()) && "12".equals(vo.getAuthStatCd()))) {
        	GMT_LoginManager loginManager = GMT_LoginManager.getInstance();
        	//현재 사용중인지 체크
        	if (!loginManager.isUsing(vo.getUserId())) {
        		setUserSession(vo,req,session,loginManager);
                model.addAttribute("result", vo);
        	}
        	else{
        		HttpSession signSession = loginManager.getSession(vo.getUserId());
            	if(signSession != null){
            		String signDate = (String) signSession.getAttribute("signDate");
            		model.addAttribute("signDate", GMT_DateUtil.formatDate(signDate));
            	}
            	model.addAttribute("code", "GMX-1001");
            	model.addAttribute("userId", vo.getUserId());
            	model.addAttribute("error", "이미 접속 중인 사용자입니다.");
        	}

        } else {
            model.addAttribute("error", "사용자 인증에 실패하였거나 시스템 접속권한이 존재하지 않습니다.");
        }
    }


    /*
     * session에 있는  TEA key 반환
     */
	private TEA getTEAKey(HttpSession session, HashMap<String, String> map) {
    	  RSA rsa = null;
          TEA tea = null;
    	if (session.getAttribute("RSA") == null) {
    		tea=null;
        } else {

            try {
                rsa = new RSA((RSAKey) session.getAttribute("RSA"));
                tea = new TEA(rsa.decrypt(map.get("key")));
            } catch (Exception e) {
               tea=null;
            }
        }
    	return tea;
    }
	/*
	 *  session에 유저 정보 set
	 */
	private void setUserSession(GMT_UserVo vo, HttpServletRequest req, HttpSession session, GMT_LoginManager loginManager) throws Exception {

        loginManager.setSession(req.getSession(), vo.getUserId());

        HashMap<String, String> authParam = new HashMap<String, String>();
        authParam.put("authGrpNo", vo.getAuthGrpNo());

        session.setAttribute("sessionId", req.getSession().getId());
        session.setAttribute("userId", vo.getUserId());
        session.setAttribute("userNm", vo.getUserNm());
        session.setAttribute("email", vo.getEmail());
        session.setAttribute("mobileNum", vo.getMobileNum());
        session.setAttribute("authList", auth.getList(null));
        session.setAttribute("authGrpId", vo.getAuthGrpNo());
        session.setAttribute("authGrpNm", vo.getAuthGrpNm());
        session.setAttribute("orgMgrNo", vo.getOrgMgrNo());
        session.setAttribute("signDate", GMT_DateUtil.getStrSec());
        session.setAttribute("authGrp", auth.getAuthGrpList(authParam));
        session.setAttribute("userIp", req.getRemoteAddr());
        session.removeAttribute("RSA");
    }

    /**
     * 로그아웃합니다 <br>
     * redirect : 로그인페이지
     *
     * @param res
     * @param model
     * @param session
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/signOut.do")
    public String signOut(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        GMT_LoginManager loginManager = GMT_LoginManager.getInstance();
        loginManager.LogOut(session.getId());

        if(map.get("action") == null || !"auto".equals(map.get("action"))){
    		String userId = (String) session.getAttribute("userId");
    		String userIp = (String) session.getAttribute("userIp");
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
    				access.add(vo);
    			}
    		}
        }

        session.invalidate();

        return "redirect:/GMT_user/login.do";
    }
    /**
     * 로그아웃합니다 <br>
     * redirect : 로그인페이지
     *
     * @param res
     * @param model
     * @param session
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/removeSession.json")
    public void removeSession(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
    	GMT_LoginManager loginManager = GMT_LoginManager.getInstance();
    	String sessionId = (String) session.getAttribute("sessionId");
    	String userId = (String) session.getAttribute("userId");
    	if(sessionId == null){
    		model.addAttribute("result", false);
    	}
    	loginManager.removeSession(sessionId);


    	loginManager.LogOut(userId);

		websocket.removeClient(userId);

    	model.addAttribute("result", true);
    }





    /**
     * 사용자 비밀번호를 변경합니다
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

        GMT_UserVo vo = service.getItem(map);

        if (vo != null && !"".equals(vo.getUserId())) {
            map.put("newUserPwd", SHA.simpleEnc512(map.get("userId") + map.get("newUserPwd")));
            model.addAttribute("result", service.editPassword(map));
        } else {
            model.addAttribute("error", "현재 비밀번호를 다시한번 확인해 주세요.");
    	}
    }

    /**
     * 사용자 비밀번호를 관리자가 변경합니다
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
     * 세션을 무효화 합니다. <br>
     * redirect : 로그인페이지
     *
     * @param res
     * @param model
     * @param session
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/sessionDestroy.json")
    public void sessionDestroy(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	String user = map.get("user");
    	if(user != null){
    		if(!"".equals(user)){
    			String[] userList = user.split(",");

    			for(int i=0; i<userList.length; i++){

    				GMT_LoginManager loginManager = GMT_LoginManager.getInstance();
    				HttpSession session = loginManager.getSession(userList[i]);

    				if(session != null){

    					String userId = (String) session.getAttribute("userId");
    					String userIp = (String) session.getAttribute("userIp");
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
    							access.add(vo);

    							loginManager.LogOut(userList[i]);

    							websocket.removeClient(userId);
    						}
    					}
    				}

    			}

    			model.addAttribute("result", true);
    		}
    	}

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
    public String getItem(HttpServletRequest req, Model model, @RequestParam HashMap<String, String> map)
        throws Exception {

        String url = req.getRequestURI();
        if (url.endsWith(".do")) {
            model.addAttribute("column", col.getList());
        }

        GMT_UserVo vo = service.getItem(map);

        model.addAttribute("result", vo);

        return "/user/view";
    }
   /**
    *   그룹 ID를 받고 해당 그룹에 대한 권한 목록을 반환한다
    *   해당 세션의 authGrp를  재 등록한다
    *
    * @param model
    * @param session
    * @param map
    * @throws Exception
    */
    @RequestMapping(value = "/getAuthGrp.json", method = RequestMethod.POST)
    public void getAuthGrp(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
    	ArrayList<GMT_AuthGrpVo> list=auth.getAuthGrpList(map);
    	session.setAttribute("authGrp", list);
        model.addAttribute("result", list);
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
     * @param model
     * @param param
     * @param br
     * @return
     * @throws Exception
     */
    @GMT_NoSession
    @RequestMapping(value = "/add.json", method = RequestMethod.POST)
    public void add(Model model, HttpSession session, @ModelAttribute @Valid GMT_UserVo param, BindingResult br)
        throws Exception {

        String[] ignoreField = { "authGrpNo", "mobileNum", "posNm", "departNm" };
        String msg = GMT_ValidInspector.findError(br, ignoreField);

        if ("pass".equals(msg)) {

        	param.setUserPwd(SHA.simpleEnc512(param.getUserId() + param.getUserPwd()));
            param.setAuthStatCd("11");
            param.setReqDat(GMT_DateUtil.getStrSec());

        	//파일 업로드 체크
            MultipartFile file = param.getFile();
            String chkResult=checkAndUploadFile(file,param);

            if(!"success".equals(chkResult)){
            	model.addAttribute("error", chkResult);
            }

            boolean addChk = service.add(param);
            if(addChk){
            	 model.addAttribute("result", true);
            }else{
            	model.addAttribute("error", "회원가입에 실패했습니다.");
            }

        } else {
            model.addAttribute("error", msg);
        }

    }
    /*
     * 파일 유효성 체크하고 서버에 업로드합니다
     */
    private String checkAndUploadFile(MultipartFile file, GMT_UserVo param) throws Exception {
    	String result="success";

    	GMT_SystemParameter sysParam = new GMT_SystemParameter(sysParamList.getList(null));

        HashMap<String, String> map = null;
        map = sysParam.getParamMap();

        String uploadPath = map.get("sys.upload_path")+param.getSubDir();

    	 if (file != null) {
             if (GMT_ValidInspector.isPathAttack(file.getOriginalFilename())) {
            	 result="올바른 파일 이름이 아닙니다.\n특수문자를 제거해 주세요.";
                 return result;
             } else if (file.getOriginalFilename().length() > 30) {
                 result="파일명은 30자 미만으로 업로드 할 수 있습니다.";
                 return result;
             } else {
                 String fileNm = file.getOriginalFilename();
                 String tempNm = GMT_DateUtil.getStrMilSec() + "_" + fileNm;
                 String fullPath = uploadPath + tempNm;

                 File chkDir = new File(uploadPath);
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
		return result;
	}
}
