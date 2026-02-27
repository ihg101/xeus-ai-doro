package geomex.xeus.tvius.web;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
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
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.hierynomus.msdtyp.AccessMask;
import com.hierynomus.mssmb2.SMB2ShareAccess;
import com.hierynomus.smbj.SMBClient;
import com.hierynomus.smbj.SmbConfig;
import com.hierynomus.smbj.auth.AuthenticationContext;
import com.hierynomus.smbj.session.Session;
import com.hierynomus.smbj.share.DiskShare;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfCopy;
import com.itextpdf.text.pdf.PdfReader;

import egovframework.rte.fdl.property.EgovPropertyService;
import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.log.service.AccessService;
import geomex.xeus.log.service.AccessVo;
import geomex.xeus.log.service.MsgLogService;
import geomex.xeus.log.service.MsgLogVo;
import geomex.xeus.map.service.GeometryService;
import geomex.xeus.map.service.SearchService;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.NoticeService;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.system.annotation.NoSession;
import geomex.xeus.tvius.carservice.CrmsCarSchService;
import geomex.xeus.tvius.carservice.CrmsCarSchVo;
import geomex.xeus.tvius.service.CrmsCctvStatService;
import geomex.xeus.tvius.service.CrmsCctvStatVo;
import geomex.xeus.tvius.service.CrmsHeatService;
import geomex.xeus.tvius.service.CrmsImageRqstService;
import geomex.xeus.tvius.service.CrmsImageRqstVo;
import geomex.xeus.tvius.service.CrmsImageService;
import geomex.xeus.tvius.service.CrmsImageVo;
import geomex.xeus.tvius.service.CrmsOfficialDocService;
import geomex.xeus.tvius.service.CrmsPrevAviService;
import geomex.xeus.tvius.service.CrmsPrevAviVo;
import geomex.xeus.tvius.service.CrmsPrevRqstService;
import geomex.xeus.tvius.service.CrmsPrevRqstVo;
import geomex.xeus.tvius.service.CrmsRqstRenewService;
import geomex.xeus.tvius.service.CrmsRqstRenewVo;
import geomex.xeus.tvius.service.CrmsStatService;
import geomex.xeus.tvius.service.CrmsTransAviService;
import geomex.xeus.tvius.service.CrmsTransAviVo;
import geomex.xeus.tvius.service.CrmsTransRqstBackupService;
import geomex.xeus.tvius.service.CrmsTransRqstService;
import geomex.xeus.tvius.service.CrmsTransRqstVo;
import geomex.xeus.tvius.service.CrmsTransWorkService;
import geomex.xeus.tvius.service.CrmsTransWorkVo;
import geomex.xeus.tvius.service.DownloadAuthService;
import geomex.xeus.tvius.service.DownloadAuthVo;
import geomex.xeus.tvius.service.WorkChk;
import geomex.xeus.tvius.util.FtpClient;
import geomex.xeus.tvius.util.HashChk;
import geomex.xeus.user.service.UserService;
import geomex.xeus.user.service.UserVo;
import geomex.xeus.user.util.RSA;
import geomex.xeus.user.util.RSAKey;
import geomex.xeus.user.util.SHA;
import geomex.xeus.user.util.SendSms;
import geomex.xeus.user.util.TEA;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.StrUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;
import geomex.xeus.util.login.LoginManager;
import geomex.xeus.videoSummary.service.VideoSummaryService;





/**
 * <pre>
 * 파일명 :  TviusController.java
 * 설  명 :
 *   영상반출 컨트롤러 페이지
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-10-12		이은규			최초 생성
 * 2017-10-23		이은규			파라미터 어노테이션 변경(getStat)
 * 2017-10-27		이은규			영상반출 시스템 파라미터, 미리보기 관련 로직 추가
 * 2017-11-06		이은규			연장신청 관련 로직 추가
 * 2017-12-12		이은규			Validator 추가
 * 2018-01-16		이은규			관리대장 추가
 * 2019-03-28		이은규			관리자 SMS 발송기능 추가
 * 2019-09-17		이은규			공문첨부 에러 발생 시 키 변경(error >> exception)
 *
 * </pre>
 *
 * @since   :  2017. 10. 12.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/tvius")
public class TviusController {

    @Resource(name = "CctvService")
    private CctvService cctv;

    @Resource(name = "codeCtrl")
    private CodeCtrl code;

    @Resource(name = "geometryService")
    private GeometryService geom;

    @Resource(name = "searchService")
	private SearchService bjd;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

    @Resource
    private ColumnInfoController col;

    @Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

    @Resource(name = "crmsPrevRqstService")
    private CrmsPrevRqstService prevRqst;

    @Resource(name = "crmsPrevAviService")
    private CrmsPrevAviService prevAvi;

    @Resource(name = "crmsTransRqstService")
    private CrmsTransRqstService transRqst;

    @Resource(name = "crmsTransRqstBackupService")
    private CrmsTransRqstBackupService transRqstBackup;

    @Resource(name = "crmsTransAviService")
    private CrmsTransAviService transAvi;

    @Resource(name = "crmsTransWorkService")
    private CrmsTransWorkService transWork;

    @Resource(name = "crmsCctvStatService")
    private CrmsCctvStatService cctvStat;

    @Resource(name = "sysPropService")
    private SysPropService param;

    @Resource(name = "crmsRqstRenewService")
    private CrmsRqstRenewService renew;

    @Resource(name = "crmsStatService")
    private CrmsStatService rqstStat;

    @Resource(name = "crmsHeatService")
    private CrmsHeatService heat;

    @Resource(name = "crmsCarSchService")
    private CrmsCarSchService carSch;

    @Resource(name = "crmsImageService")
    private CrmsImageService crmsImg;

    @Resource(name = "crmsImageRqstService")
    private CrmsImageRqstService crmsImgRqst;

    @Resource(name = "crmsOfficialDocService")
    private CrmsOfficialDocService crmsOfficialDoc;

    @Resource(name = "downloadAuthService")
    private DownloadAuthService downAuth;

    @Resource(name = "msgLogService")
    private MsgLogService msgLogService;

    @Resource(name = "userService")
    private UserService userService;

    @Resource(name = "noticeService")
    private NoticeService notice;

    @Resource(name = "propService")
    private EgovPropertyService propService;

    @Resource(name = "userService")
    private UserService service;

    @Resource(name = "authService")
    private AuthService auth;

    @Resource(name = "accessService")
    private AccessService access;

    @Resource(name = "videoSummaryService")
    private VideoSummaryService videoSummaryService;

//    @Autowired private CrmsImageRqstService imgRqst;

    private static final String systemId = "aaa";
    private static final String nHint = "513";
    private static final String macAddr = "00:15:5D:B9:7F:02";
    private String usbSerial = "";
//    private String serviceLevel;
    private String mediaExtension = "";
    private String deviceSerial = "";
    private String streaming = "";

    //FTP
    private String carFtpHost;
    private String carFtpId;
    private String carFtpPw;
    private String carFtpBasicpath;
    //SMS
    private String smsChk;

    private String videoSmyChk;

    @PostConstruct
    public void initIt() throws Exception {
        this.carFtpHost = propService.getString("car.ftp.host").replaceAll("\"", "");
        this.carFtpId = propService.getString("car.ftp.id").replaceAll("\"", "");
        this.carFtpPw = propService.getString("car.ftp.pw").replaceAll("\"", "");
        this.carFtpBasicpath = propService.getString("car.ftp.basicpath").replaceAll("\"", "");

        this.smsChk = propService.getString("sys.sms").replaceAll("\"", "");
        this.videoSmyChk = propService.getString("sys.video.smy").replaceAll("\"", "");
    }

    @Resource
    private Validator validator;

    @InitBinder
    private void initBinder(WebDataBinder binder){
        binder.setValidator(this.validator);
        /*binder.registerCustomEditor(MultipartFile.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) {
                setValue(null);
            }
        });*/
    }

    /**
     * cctv.seocho.go.kr 전용 로그인 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/login.do")
    public String loginView(Model model, HttpSession session) throws Exception {

        session.removeAttribute("acc_no");
        session.setAttribute("RSA", RSAKey.generate(1024));

        model.addAttribute("notice", notice.getList(null));
        model.addAttribute("noticeCount", notice.getCount(null));
        model.addAttribute("smsChk", this.smsChk);

        return "/tvius/login";
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

        return "/tvius/reg";
    }

    /**
     * cctv.seocho.go.kr
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

            String isOuterUser = tea.decrypt(map.get("isOuterUser"));

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

            if ((vo != null && !"".equals(vo.getUserId()) && "12".equals(vo.getAuthStatCd()))) {

            	if("Y".equals(isOuterUser)){
            		if(!"Y".equals(vo.getOutSign())){
            			model.addAttribute("error", "외부 접속권한이 존재하지 않습니다.\n\n관리자에게 문의해주세요.");
                        return;
            		}
            	}

                LoginManager loginManager = LoginManager.getInstance();

//                if (!loginManager.isUsing(vo.getUserId())) {

                    loginManager.setSession(req.getSession(), vo.getUserId());
                    session.setAttribute("sessionId", req.getSession().getId());

                //}

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

	                session.setAttribute("isCCTVDomain", true);

	                HashMap<String, String> authParam = new HashMap<String, String>();
	                authParam.put("authGrpNo", vo.getAuthGrpNo());
	                session.setAttribute("authGrp", auth.getAuthGrpList(authParam));
	                session.setAttribute("userIp", req.getRemoteAddr());
	                session.removeAttribute("RSA");

	                model.addAttribute("result", vo);


//                }
//                else {
//    				HttpSession signSession = loginManager.getSession(vo.getUserId());
//
//                	model.addAttribute("code", "GMX-1001");
//                	model.addAttribute("userId", vo.getUserId());
//
//                	if(signSession != null){
//                		String signDate = (String) signSession.getAttribute("signDate");
//                		model.addAttribute("signDate", DateUtil.formatDate(signDate));
//                	}
//
//                	model.addAttribute("error", "이미 접속 중인 사용자입니다.");
//                }


            } else {
            	model.addAttribute("error", "아이디에 따른 비밀번호가 틀렸습니다.");
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

        return "redirect:/tvius/login.do";
        //return "redirect:/map/view.do";
    }

    /**
     * 영상반출신청 메인 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrTviusRqstMain.do")
    public String getUsrTviusRqstMain(Model model) throws Exception {

        return "/tvius/usrTviusRqstMain";
    }

    /**
     * 영상반출신청 범례 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getLegendView.do")
    public String getLegendView(Model model) throws Exception {

    	return "/tvius/cctvLegendView";
    }

    /**
     * 사용자 차량운행검색 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrTviusCarSchView.do")
    public String getUsrTviusCarSchView(Model model/*, @RequestParam HashMap<String, String> map */) throws Exception {

        /*model.addAttribute("code", new CodeConvertor(code.getCdeList()));*/
        /*model.addAttribute("param", map);*/

        return "/tvius/usrTviusCarSchView";
    }

    /**
     * 사용자 영상 신청 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrTviusRqst.do")
    public String getUsrTviusRqst(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        model.addAttribute("sysparam", sysMap);
        model.addAttribute("result", map);
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));
        model.addAttribute("videoSmyChk", this.videoSmyChk);

        return "/tvius/usrTviusRqst";
    }

    /**
     * 사용자 영상정보 신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrTviusRqstView.do")
    public String getUsrTviusRqstView(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("stat", transRqst.getStatCount(map));
        model.addAttribute("userst", transRqst.getUseRstCount(map));
        model.addAttribute("count", transRqst.getCount(map));
        model.addAttribute("list", transRqst.getList(map));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/tvius/usrTviusRqstView";
    }

    /**
     * 사용자 영상목록 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrTviusAviList.do")
    public String getUsrTviusAviList(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        model.addAttribute("sysparam", sysMap);
        model.addAttribute("mgrseq", map.get("rqstMgrSeq"));
        model.addAttribute("reqGbn", map.get("reqGbn"));
        model.addAttribute("videoSmy", map.get("videoSmy"));
        model.addAttribute("result", transAvi.getList(map));
        model.addAttribute("videoSmyChk", this.videoSmyChk);

        HashMap<String, String> rqstMap = new HashMap<String, String>();
        rqstMap.put("mgrSeq", map.get("rqstMgrSeq"));
        model.addAttribute("rqst", transRqst.getItem(rqstMap));

        HashMap<String, String> imgMap = new HashMap<String, String>();
		imgMap.put("rqstMgrSeq", map.get("rqstMgrSeq"));
		model.addAttribute("imgList", transRqst.getImgList(imgMap));

        return "/tvius/usrTviusAviList";
    }

    /**
     * 사용자 연장, 증거자료 신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrTviusRenewView.do")
    public String getUsrTviusRenewView(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("count", renew.getCount(map));
        model.addAttribute("list", renew.getList(map));

        return "/tvius/usrTviusRenewView";
    }

    /**
     * 사용자 연장, 증거자료 이력조회 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUsrTviusRenewList.do")
    public String getUsrTviusRenewList(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("list", renew.getList(map));

        return "/tvius/usrTviusRenewList";
    }

    /**
     * 영상 신청을 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    //@NoSession
    @RequestMapping(value = "/addTransRqst.json", method = RequestMethod.POST)
    public void addTransRqst(Model model, @ModelAttribute @Valid CrmsTransRqstVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	boolean addChk = transRqst.add(vo);
            model.addAttribute("result", addChk);

            //190324 이은규
            //공문테이블의 row는 삭제하지만 rqst테이블에서 사용되므로 실제 로컬 저장소의 사진은 삭제하면 안됨.
            if( !"".equals(vo.getOfclMgrNo()) ){
            	HashMap<String, String> map = new HashMap<String, String>();
            	map.put("mgrSeq", vo.getOfclMgrNo());
            	crmsOfficialDoc.del(map);
            }

            //C58	영상반출신청구분	11	반출
            //C58	영상반출신청구분	12	열람
        	//C58	영상반출신청구분	13	긴급반출
            //C58	영상반출신청구분	14	차량추적
            //C58	영상반출신청구분	15	오프라인반출

            String reqGbnTyp = "";
            if("11".equals(vo.getReqGbnCd())) reqGbnTyp = "영상반출";
            else if("12".equals(vo.getReqGbnCd())) reqGbnTyp = "영상열람";
            else if("13".equals(vo.getReqGbnCd())) reqGbnTyp = "긴급반출";
            else if("14".equals(vo.getReqGbnCd())) reqGbnTyp = "차량번호";
            else reqGbnTyp = "영상반출";

            /**
             * 190328 이은규
             * 관리자에게 SMS를 발송한다.
             *
             * 190826 이은규
             * 오프라인 반출의 경우 SMS발송을 하지 않는다.
             */
            if(addChk && "Y".equals(smsChk) && !"15".equals(vo.getReqGbnCd())){
            	String title = "영상반출 신청";
                //String smsConts = "[제천시 스마트시티 통합플랫폼] 사용자 "+vo.getReqstId()+"가 " + reqGbnTyp + "을 신청하였습니다. 신청번호 : "+vo.getMgrSeq();
//                String smsConts = "[제천시 스마트시티 통합플랫폼] 신청번호 : "+vo.getMgrSeq()+",사용자 "+vo.getReqstId()+"가 " + reqGbnTyp + "을 신청하였습니다.";
            	String smsConts = "[제천시 스마트시티 통합플랫폼] 사용자 "+vo.getReqstId()+"가 " + reqGbnTyp + "을 신청하였습니다.";
                sendTviusSms(title, smsConts);
            }

        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 반출신청 영상 신청 건을 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getTransRqst.json", method = RequestMethod.POST)
    public void getTransRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transRqst.getList(map));
    }

    /**
     * 반출신청 영상 신청 건 목록을 조회합니다.
     * 지니가치 제공용 REST API입니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getTransRqstList.json", method = RequestMethod.POST)
    public void getTransRqstList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("count", transRqst.getCount(map));
        model.addAttribute("result", transRqst.getList(map));
    }

    /**
     * 반출신청 영상 신청 건 단건을 조회합니다.
     * 지니가치 제공용 REST API입니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getTransRqstItem.json", method = RequestMethod.POST)
    public void getTransRqstItem(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transRqst.getItem(map));
    }

    /**
     * 반출신청 영상 신청 건을 수정합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/editTransRqst.json", method = RequestMethod.POST)
    public void editTransRqst(Model model, @ModelAttribute @Valid CrmsTransRqstVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	boolean updateChk = transRqst.update(vo);
            model.addAttribute("result", updateChk);

            //190324 이은규
            //공문테이블의 row는 삭제하지만 rqst테이블에서 사용되므로 실제 로컬 저장소의 사진은 삭제하면 안됨.
            if( !"".equals(vo.getOfclMgrNo()) ){
            	HashMap<String, String> map = new HashMap<String, String>();
            	map.put("mgrSeq", vo.getOfclMgrNo());
            	crmsOfficialDoc.del(map);
            }

            String reqGbnTyp = "";
            if("11".equals(vo.getReqGbnCd())) reqGbnTyp = "영상반출";
            else if("12".equals(vo.getReqGbnCd())) reqGbnTyp = "영상열람";
            else if("13".equals(vo.getReqGbnCd())) reqGbnTyp = "긴급반출";
            else if("14".equals(vo.getReqGbnCd())) reqGbnTyp = "차량번호";
            else reqGbnTyp = "영상반출";

            /**
             * 190328 이은규
             * 관리자에게 SMS를 발송한다.
             *
             * 190826 이은규
             * 오프라인 반출의 경우 SMS발송을 하지 않는다.
             */
            if(updateChk && "Y".equals(smsChk) && !"15".equals(vo.getReqGbnCd())){
            	String title = "영상반출 신청";
            	//String smsConts = "[제천시 스마트시티 통합플랫폼] 사용자 "+vo.getReqstId()+"가 " + reqGbnTyp + "을 신청하였습니다. 신청번호 : "+vo.getMgrSeq();
//            	String smsConts = "[제천시 스마트시티 통합플랫폼] 신청번호 : "+vo.getMgrSeq()+",사용자 "+vo.getReqstId()+"가 " + reqGbnTyp + "을 신청하였습니다.";
            	String smsConts = "[제천시 스마트시티 통합플랫폼] 사용자 "+vo.getReqstId()+"가 " + reqGbnTyp + "을 신청하였습니다.";
            	sendTviusSms(title, smsConts);
            }
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 반출신청 영상 신청건을 삭제합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/delTransRqst.json", method = RequestMethod.POST)
    public void delTransRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transRqst.del(map));
    }

    /**
     * 영상 신청 AVI정보를 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/addTransAvi.json", method = RequestMethod.POST)
    public void addTransAvi(Model model, @ModelAttribute @Valid CrmsTransAviVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {"expAviPw"};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	if(StrUtil.isEmpty(vo.getHddSerial())) vo.setHddSerial("hddSerial");
        	if(StrUtil.isEmpty(vo.getMacSerial())) vo.setHddSerial("macSerial");
            model.addAttribute("result", transAvi.add(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 반출신청 영상 AVI 정보를 수정합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/editTransAvi.json", method = RequestMethod.POST)
    public void editTransAvi(Model model, @ModelAttribute @Valid CrmsTransAviVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	boolean updateChk = transAvi.update(vo);
            model.addAttribute("result", updateChk);
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 반출신청 영상 AVI리스트를 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getTransAvi.json", method = RequestMethod.POST)
    public void getTransAvi(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transAvi.getList(map));

    }

    /**
     * 반출신청 영상 AVI리스트를 삭제합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/delTransAvi.json", method = RequestMethod.POST)
    public void delTransAvi(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transAvi.del(map));
    }

    /**
     * 반출신청 영상 AVI리스트를 삭제합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/delTransWork.json", method = RequestMethod.POST)
    public void delTransWork(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transWork.del(map));
    }

    /**
     * 상태체크 조회 건을 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/addStat.json", method = RequestMethod.POST)
    public void addStat(Model model, @ModelAttribute @Valid CrmsCctvStatVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            model.addAttribute("result", cctvStat.add(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 해당 상태체크 건을 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getStat.json", method = RequestMethod.POST)
    public void getStat(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("crmsCctvStatVo", null);
        model.addAttribute("result", cctvStat.getList(map));
    }

    /**
     * 미리보기 영상 신청을 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/addPrevRqst.json", method = RequestMethod.POST)
    public void addPrevRqst(Model model, @ModelAttribute CrmsPrevRqstVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            model.addAttribute("crmsPrevRqstVo", null);
            model.addAttribute("result", prevRqst.add(vo));
        }else{
            model.addAttribute("error", msg);
        }
    }

    /**
     * 미리보기 영상 신청 AVI정보를 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/addPrevAvi.json", method = RequestMethod.POST)
    public void addPrevAvi(Model model, @ModelAttribute CrmsPrevAviVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            model.addAttribute("crmsPrevAviVo", null);
            model.addAttribute("result", prevAvi.add(vo));
        }else{
            model.addAttribute("error", msg);
        }
    }

    /**
     * 미리보기 영상 신청 건을 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getPrevRqst.json", method = RequestMethod.POST)
    public void getPrevRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("crmsPrevAviVo", null);
        model.addAttribute("result", prevRqst.getList(map));
    }

    /**
     * 미리보기 영상 AVI리스트를 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getPrevAvi.json", method = RequestMethod.POST)
    public void getPrevAvi(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("crmsPrevAviVo", null);
        model.addAttribute("result", prevAvi.getList(map));
    }

    /**
     * CCTV 단건 정보를 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvInfo.json", method = RequestMethod.POST)
    public void getCctvInfo(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", cctv.getItem(map));
    }

    /**
     * 첨부파일을 추가합니다.
     *
     * @param model
     * @param session
     * @param sub
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/addDocFile.json", method = RequestMethod.POST)
    public void addDocFile(Model model, HttpSession session, @RequestParam(value="p", required=true) String sub,
                                                             @RequestParam(value="uploadImg", required=true) MultipartFile file) throws Exception {

        //시스템 파라미터에서 영상 다운 제한 횟수를 가져온다.
        String upPath = "";
        HashMap<String, String> map = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        map = sysParam.getParamMap();
        upPath = map.get("sys.upload_path");

        if(file.isEmpty()){
        	//error일때 처리하는 로직이 필요해서 exception이라는 키로 발송
            model.addAttribute("exception", "파일이 선택되지 않았습니다.");
        }else{
            //String type = "." + file.getContentType().substring(file.getContentType().lastIndexOf("/") + 1);
            //String extension = ValidInspector.getExtension(file.getOriginalFilename(), false);
            String [] splitFileNm = file.getOriginalFilename().split("\\.");
            String extension = "." + splitFileNm[splitFileNm.length-1];

            String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();
            String path = upPath + sub;
            if("jpeg".equals(extension)) extension = "jpg";
            if(ValidInspector.isDataExtension(extension)){

                File pathDir = new File(path);
                if(!pathDir.exists()) pathDir.mkdirs();
                File img = new File(path + realFileNm);
                file.transferTo(img);

                model.addAttribute("uploadNm", file.getOriginalFilename());
                model.addAttribute("realNm", realFileNm);
            }else{
            	//error일때 처리하는 로직이 필요해서 exception이라는 키로 발송
                model.addAttribute("exception", "파일은 gif, jpg, jpeg, png, txt, hwp, docx, doc, pdf, ppt, pptx, xls, xlsx, alz, gz, rar, tar, tgz, z, zip 파일만 업로드 할 수 있습니다.");
            }
        }
    }

    /**
     * 연장신청 리스트를 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getRenewList.json", method = RequestMethod.POST)
    public void getRenewList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", renew.getList(map));
    }

    /**
     * 연장신청 건을 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/addRenew.json", method = RequestMethod.POST)
    public void addRenew(Model model, HttpSession session, @ModelAttribute @Valid CrmsRqstRenewVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {"mgrSeq"};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            //model.addAttribute("result", renew.add(vo));
            boolean addChk = renew.add(vo);
            model.addAttribute("result", addChk);

            String renewTyp = "연장";
            if("12".equals(vo.getRenewTyp())) renewTyp = "증거";

          	//190521 이은규
            //관리자에게 SMS를 발송한다.
            if(addChk && "Y".equals(smsChk)){
            	String title = renewTyp + "신청";
//                String smsConts = "[제천시 스마트시티 통합플랫폼] 신청번호 : "+vo.getRqstMgrSeq()+ ",사용자 "+vo.getRqstReqstId()+"가 " + renewTyp + "신청을 하였습니다.";
            	String smsConts = "[제천시 스마트시티 통합플랫폼] 사용자 " + session.getAttribute("userNm") + "("+vo.getRqstReqstId()+")가 " + renewTyp + "신청을 하였습니다.";
                sendTviusSms(title, smsConts);
            }

        }else{
            model.addAttribute("error", msg);
        }
    }

    /**
     * 연장신청 리스트를 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editUseRsCd.json", method = RequestMethod.POST)
    public void editUseRsCd(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transRqst.updateUseRsCd(map));
    }

    /**
     * 사용자 화면캡처 반출신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = {"/getUsrTviusImageView.do", "/getMngTviusImageView.do"})
    public String getTviusImageView(HttpServletRequest req, Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        String[] full_url = req.getRequestURI().split("/");
        String url = full_url[full_url.length - 1];
        String view="";
        if("getUsrTviusImageView.do".equals(url)){
            view = "/tvius/usrTviusImageView";
        }else if("getMngTviusImageView.do".equals(url)){
            view = "/tvius/mngTviusImageView";
        }

        model.addAttribute("param", map);
        model.addAttribute("count", crmsImgRqst.getCount(map));
        model.addAttribute("list", crmsImgRqst.getList(map));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return view;
    }

    /**
     * 해당 이미지 반출 건의 이미지목록을 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getImgListOfImgRqst.json", method = RequestMethod.POST)
    public void getImgListOfImgRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", transRqst.getImgList(map));
    }

    /**
     * 관리자 이미지반출 신청현황 상세정보 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusImageDetailView.do")
    public String getMngTviusImageDetailView(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("item", transRqst.getItem(map));
        model.addAttribute("user", userService.getList(null));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/tvius/mngTviusImageDetailView";
    }

    /**
     *
     *
     * 영상반출 관리
     *
     *
     */

    /**
     * 영상반출관리 메인 뷰를 리턴합니다.
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusMngMain.do")
    public String getMngTviusMngMain() throws Exception {

        return "/tvius/mngTviusMngMain";
    }

    /**
     * 영상반출관리 보드 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusBoardView.do")
    public String getMngTviusBoardView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("pageCnt", transRqst.getPageCnt(map));

        return "/tvius/mngTviusBoardView";
    }

    /**
     * 통계 현황 뷰를 리턴합니다.
     * 파라미터에 따라 현황 페이지가 바뀝니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusBoardChartView.do")
    public String getMngTviusBoardChartView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        String view = null;
        String page = map.get("page");

        //공통사항
        model.addAttribute("param", map);
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        if ("listuse".equalsIgnoreCase(page)) {
            model.addAttribute("list", rqstStat.getListUse(map));
            view = "/tvius/board/listUse";
        } else if ("listsolve".equalsIgnoreCase(page)) {
            model.addAttribute("list", rqstStat.getListSolve(map));
            view = "/tvius/board/listSolve";
        } else if ("listcrime".equalsIgnoreCase(page)) {
            model.addAttribute("list", rqstStat.getListCrime(map));
            view = "/tvius/board/listCrime";
        } else if ("listnouse".equalsIgnoreCase(page)) {
            model.addAttribute("list", rqstStat.getListNoUse(map));
            view = "/tvius/board/listNoUse";
        } else if ("listview".equalsIgnoreCase(page)) {
            model.addAttribute("list", rqstStat.getListView(map));
            view = "/tvius/board/listView";
        } else if ("listorg".equalsIgnoreCase(page)) {
            model.addAttribute("list", rqstStat.getListOrg(map));
            view = "/tvius/board/listOrg";
        }

        return view;
    }

    /**
     * 관리자 영상정보 신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
	@RequestMapping(value = "/getMngTviusRqstView.do")
    public String getMngTviusRqstView(Model model, HttpSession session, @RequestParam HashMap<String, String> map ) throws Exception {

    	String sessionParam = (String) map.get("sessionParam");
    	if(!"Y".equals(sessionParam)) session.setAttribute("tviusParam", map);

        HashMap<String, String> tviusParam = (HashMap<String, String>) session.getAttribute("tviusParam");
        Set<String> tviusParamKey = new TreeSet<String>(tviusParam.keySet());
        Iterator<String> tviusParamItr = tviusParamKey.iterator();

        while(tviusParamItr.hasNext()){
        	String key = (String) tviusParamItr.next();
        	map.put(key, tviusParam.get(key));
        }
        HashMap<String, String> param = (HashMap<String, String>)map.clone();
        model.addAttribute("param", param);
        //TODO 제천시에만 해당
        if(map.containsKey("procStatCdOrRenew")){
        	map.remove("procStatCd");
        }

        model.addAttribute("stat", transRqst.getStatCount(map));
        model.addAttribute("userst", transRqst.getUseRstCount(map));
        model.addAttribute("yearCount", transRqst.getYearCount(map));
        model.addAttribute("count", transRqst.getCount(map));
        model.addAttribute("list", transRqst.getList(map));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/tvius/mngTviusRqstView";
    }

    /**
     * 관리자 신청현황 상세정보 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusRqstDetailView.do")
    public String getMngTviusRqstDetailView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("usrrqst", transRqst.getUserRqstStatCnt(map));
        /**
         * 180618 이은규
         * 폐기상태, 영상반출 관련된 계정만 가져와야 된다면 밑의 주석을 풀면 됨.
         */
        /*HashMap<String, String> userMap = new HashMap<String, String>();
        userMap.put("discardChk", "Y");
        userMap.put("authGrpNo", "tvus");
        model.addAttribute("user", userService.getList(userMap));*/
        model.addAttribute("user", userService.getList(null));
        model.addAttribute("item", transRqst.getItem(map));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));
        model.addAttribute("videoSmyChk", this.videoSmyChk);

        return "/tvius/mngTviusRqstDetailView";
    }

    /**
     * 관리자 영상목록 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusAviList.do")
    public String getMngTviusAviList(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        model.addAttribute("sysparam", sysMap);
        model.addAttribute("mgrseq", map.get("rqstMgrSeq"));
        model.addAttribute("reqgbn", map.get("reqGbn"));
        model.addAttribute("list", transAvi.getList(map));

        return "/tvius/mngTviusAviList";
    }


    /**
     * 관리자 이미지 영상목록 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusImageAviList.do")
    public String getMngTviusImageAviList(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        model.addAttribute("sysparam", sysMap);
        model.addAttribute("mgrseq", map.get("rqstMgrSeq"));
        model.addAttribute("list", transAvi.getList(map));

        return "/tvius/mngTviusImageAviList";
    }

    /**
     * 관리자 히트맵 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusHeatView.do")
    public String getMngTviusHeatView(Model model/*, @RequestParam HashMap<String, String> map */) throws Exception {

        model.addAttribute("code", new CodeConvertor(code.getCdeList()));
        /*model.addAttribute("param", map);*/

        return "/tvius/mngTviusHeatView";
    }

    /**
     * 긴급반출 건을 일반반출로 전환합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editUrgToUsual.json", method = RequestMethod.POST)
    public void editUrgToUsual(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        boolean workChk = false;
        try{
            workChk = transRqst.updateUrgToUsual(map);

            //아이디 변경시 work테이블 fileNm의 폴더명과 파일이동 작업 진행
            String urgReqstId = map.get("urgReqstId");
            String reqstId = map.get("reqstId");

            //아이디가 변경되지 않았으면 작업하지 않는다.
            if(!urgReqstId.equals(reqstId)){
                ArrayList<CrmsTransWorkVo> workList = new ArrayList<CrmsTransWorkVo>();
                HashMap<String, String> workParam = new HashMap<String, String>();
                workParam.put("rqstMgrSeq", map.get("mgrSeq"));
                workList = transWork.getList(workParam);

                //혹시나 work 테이블 리스트가 안넘어올 경우에 대비한 예외처리
                if(workList.size() > 0){
                    String fileNm = "";
                    String strPath = "";

                    //시스템 파라미터에서 저장경로를 가져온다.
                    SystemParameter sysParam = new SystemParameter(param.getList(null));
                    HashMap<String, String> paramMap = null;
                    paramMap = sysParam.getParamMap();
                    strPath = paramMap.get("tvius.storage_path");

                    //이동하려는 폴더가 없으면 생성
                    File folderChk = new File(strPath + reqstId);
                    if(!folderChk.exists()) folderChk.mkdirs();

                    for(int i=0; i<workList.size(); i++){
                        // 1. 파일이동
                        fileNm = workList.get(i).getFileNm();
                        File workFile = new File(strPath + fileNm);
                        File moveLocate = new File(strPath + fileNm.replace(urgReqstId+"/", reqstId+"/"));
                        //파일 유무 확인 후 작업 진행
                        if(workFile.exists()) workFile.renameTo(moveLocate);

                        // 2. 테이블 변경
                        CrmsTransWorkVo workVo = new CrmsTransWorkVo();
                        workVo.setAviMgrSeq(workList.get(i).getAviMgrSeq());
                        workVo.setRqstMgrSeq(workList.get(i).getRqstMgrSeq());
                        workVo.setFileSeq(workList.get(i).getFileSeq());
                        workVo.setFileNm(fileNm.replace(urgReqstId, reqstId));
                        workChk = transWork.update(workVo);
                    }
                } else {
                    workChk = false;
                }
            }
        } catch(Exception e){
            workChk = false;
        }
        model.addAttribute("result", workChk);
    }

    /**
     * 반출신청 건수를 승인 및 거절합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editProcStatCd.json", method = RequestMethod.POST)
    public void editProcStatCd(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	boolean updateChk = transRqst.updateProcStatCd(map);
        model.addAttribute("result", updateChk);

        if("SD".equals(map.get("procStatCd"))){
            //시스템 파라미터에서 영상 다운 제한 횟수를 가져온다.
            SystemParameter sysParam = new SystemParameter(param.getList(null));

            HashMap<String, String> paramMap = null;
            paramMap = sysParam.getParamMap();
            String strPath = paramMap.get("tvius.storage_path");

            File folder = new File(strPath + map.get("mgrSeq"));

            try{
                deleteDirectory(folder);
            }catch(Exception e){}
        } else if("SA".equals(map.get("procStatCd")) && updateChk){

        	//C58	영상반출신청구분	11	반출
        	//C58	영상반출신청구분	12	열람
        	//C58	영상반출신청구분	13	긴급반출
        	//C58	영상반출신청구분	14	차량추적

        	String reqGbnCdNm = map.get("reqGbnCdNm");
            if("반출".equals(reqGbnCdNm)) reqGbnCdNm = "영상반출";
            else if("열람".equals(reqGbnCdNm)) reqGbnCdNm = "영상열람";
            else if("긴급반출".equals(reqGbnCdNm)) reqGbnCdNm = "긴급반출";
            else if("차량번호".equals(reqGbnCdNm)) reqGbnCdNm = "차량번호";
            else reqGbnCdNm = "영상반출";

            HashMap<String, String> rqstParam = new HashMap<String, String>();
            rqstParam.put("mgrSeq", map.get("mgrSeq"));
            CrmsTransRqstVo vo = transRqst.getItem(rqstParam);

            /**
             * 190826 이은규
             * 오프라인 반출의 경우 SMS발송을 하지 않는다.
             */
            if(!"15".equals(vo.getReqGbnCd())){
            	String title = "영상반출 승인";
            	//String smsConts = "[제천시 스마트시티 통합플랫폼] " + reqGbnCdNm + " 요청이 승인되었습니다. 신청번호 : " + map.get("mgrSeq");
//            	String smsConts = "[제천시 스마트시티 통합플랫폼] 신청번호 : "+vo.getMgrSeq()+","+ reqGbnCdNm + " 요청이 승인되었습니다.";
            	String smsConts = "[제천시 스마트시티 통합플랫폼] " + reqGbnCdNm + " 요청이 승인되었습니다.";
            	sendTviusSmsToUser(title, smsConts, vo.getReqstId());
            }

        }

    }

    public static boolean deleteDirectory(File path) { //폴더지우기

        if (!path.exists()) { // 경로 존재 여부
            return false; // 없으면 false 리턴
        }

        File[] files = path.listFiles(); // 경로 내의 파일 리스트
        for (File file : files) {
            if (file.isDirectory()) { // 파일 정보가  디렉토리 라면
                deleteDirectory(file); // 재귀? 다시 이 메서드를 불러서 삭제작업
            } else {
                file.delete(); // 디렉토리가 아니라면 파일삭제
            }
        }

        return path.delete(); // 디렉토리삭제. 삭제되면 true
    }

    /**
     * 반출신청건의 공문번호를 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editDocNo.json", method = RequestMethod.POST)
    public void editDocNo(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	model.addAttribute("result", transRqst.updateDocNo(map));

    }

    /**
     * 반출신청건의 신청내용을 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editReqstDetail.json", method = RequestMethod.POST)
    public void editReqstDetail(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	model.addAttribute("result", transRqst.updateReqstDetail(map));

    }

    /**
     * 반출신청건의 공문 정보를 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editDocFileInfo.json", method = RequestMethod.POST)
    public void editDocFileInfo(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	boolean workChk = false;
    	String msg = "";

    	workChk = transRqst.updateDocFileInfo(map);

    	if(workChk){
    		//시스템 파라미터에서 영상 다운 제한 횟수를 가져온다.
            SystemParameter sysParam = new SystemParameter(param.getList(null));

            HashMap<String, String> paramMap = null;
            paramMap = sysParam.getParamMap();
            String upPath = paramMap.get("sys.upload_path");

            File tmpFile = new File(upPath + map.get("tmpFileNm"));

            try{
                if(tmpFile.exists()) {
                	tmpFile.delete();
                	workChk = true;
                }else{
                	msg = "임시 파일이 존재하지 않습니다.";
                }
            }catch(Exception e){
            	msg = "임시 파일 삭제 중 오류가 발생하였습니다.";
            }
    	}else{
    		msg = "공문정보 변경 중 오류가 발생하였습니다.";
    	}

        model.addAttribute("result", workChk);
        model.addAttribute("msg", msg);

    }

    /**
     * 반출신청건의 최종공문확인 값을 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editDocChngYn.json", method = RequestMethod.POST)
    public void editDocChngYn(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	map.put("docChngYn", "Y");
    	model.addAttribute("result", transRqst.updateDocChngYn(map));

    }

    /**
     * 사용자의 활용결과 미입력 건의 갯수를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getUseRsCdCnt.json", method = RequestMethod.POST)
    public void getUseRsCdCnt(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("cnt", transRqst.getCount(map));
    }

    /**
     * 영상 다운로드 관련 계정 권한을 가져옵니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getDownloadAuth.json", method = RequestMethod.POST)
    public void getDownloadAuth(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        /**
         * P : 허용
         * O : 횟수 초과
         * N : 허용 안됨.
         * E : 권한 조회 오류
         */

        String chkRst = "";

        int sysFileDownCnt = 0;
        String strPath = "";
        String downFileNm = "";

        /**
         * 다운로드 권한 체크 진행
         * 해당 파일의 CCTV정보, 영상정보, 유저 계정상태를 불러온다.
         * (접속 당시엔 계정 승인상태였으나, 사용 도중 계정정지가 됐을 경우엔 제한되어야 되기 때문에 계정상태를 불러온다.)
         */
        ArrayList<DownloadAuthVo> downAuthChk = downAuth.getAuth(map);

        if (downAuthChk.size() == 1){

            //시스템 파라미터에서 영상 다운 제한 횟수를 가져온다.
            SystemParameter sysParam = new SystemParameter(param.getList(null));

            HashMap<String, String> paramMap = null;
            paramMap = sysParam.getParamMap();
            sysFileDownCnt = Integer.parseInt(paramMap.get("tvius.file_down_cnt"));
            strPath = paramMap.get("tvius.storage_path");

            // crms_tarns_work 의 down_cnt 컬럼의 값이 없을때 0으로 조정
            int downCnt = 0;
            if(downAuthChk.get(0).getDownCnt() != null) {
                downCnt = Integer.parseInt(downAuthChk.get(0).getDownCnt());
            }

            if ( downCnt < sysFileDownCnt){
                if("12".equals(downAuthChk.get(0).getUserStat())){
                    String reqGbn = map.get("reqGbn");
                    String fileNm = map.get("fileNm");
                    String extension = "";

                    if(fileNm.contains("smi")) {
                        extension = ".smi";
                    } else {
                        extension = ".MS4";
                    }

                    if("차량번호".equals(reqGbn)) extension = ".zip";
                    downFileNm = downAuthChk.get(0).getCctvLabel() + "_" + downAuthChk.get(0).getSecStDat() + "_" + downAuthChk.get(0).getSecEdDat() + extension;
                    chkRst = "P";
                } else {
                    chkRst = "N";
                }
            } else {
                chkRst = "O";
            }
        } else {
            chkRst = "E";
        }

        //횟수 조회하는 김에 영상 저장경로 시스템 파라미터에서 받아옴.
        model.addAttribute("strPath", strPath);
        //제공될 파일 명
        model.addAttribute("downFileNm", downFileNm);
        //권한 조회 결과
        model.addAttribute("result", chkRst);
    }

    /**
     * 서버에 파일이 있는지 확인합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getIsFileOnServer.json", method = RequestMethod.POST)
    public void getIsFileOnServer(Model model, @RequestParam HashMap<String, String> map) throws Exception {
        String userId = map.get("userId");
        String strPath = map.get("path");
        String realFileNm = map.get("fileNm");
        String realFile = "";

        realFile = strPath + userId+ "\\" + realFileNm;

        File file = new File(realFile);

        model.addAttribute("result", file.exists());
    }

    @RequestMapping("/getFiles.json")
    public void getFiles(HttpServletRequest req, HttpServletResponse res, @RequestParam HashMap<String, String> map) throws Exception {

        String sub = map.get("sub");
        String strPath = map.get("path");
        String realFileNm = map.get("fileNm");
        String downFileNm = map.get("downFileNm");
        downFileNm = downFileNm.replaceAll(";", "_");
        downFileNm = downFileNm.replaceAll("/", "_");

        String realFile = "";
        String exceptionStr = "";


        realFile = strPath + sub + "\\" + realFileNm;

        BufferedOutputStream out = null;
        InputStream in = null;
        exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "+realFile+")";

        try {
            if(ValidInspector.isPathAttack(realFileNm)){
                System.out.println(exceptionStr);
            }else{
                res.setContentType("application/octet-stream");
                res.setHeader("Content-Disposition", "attachment;filename=" + new String(downFileNm.getBytes("UTF-8"), "ISO-8859-1"));

                File file = new File(realFile);
                if(file.exists()){
                    in = new FileInputStream(file);
                    out = new BufferedOutputStream(res.getOutputStream());
                    int len;
                    byte[] buf = new byte[1024];
                    while ((len = in.read(buf)) > 0) {
                        out.write(buf, 0, len);
                    }

                    /*
                     *  다운로드 횟수 증가
                     */
                    // 관리자가 다운로드 받을때는 다운로드 횟수가 늘지 않음
                    if(!"Y".equals(map.get("isMng"))) {
                        // work 테이블에 저장된 파일 이름
                        String dbFileNm = map.get("sub").replaceAll("\\\\", "") + "/" + map.get("fileNm");

                        HashMap<String, String> mapForUpCount = new HashMap<String, String>();
                        mapForUpCount.put("fileNm", dbFileNm);

                        downAuth.upCount(mapForUpCount);
                    }

                }else{
                    System.out.println(exceptionStr);
                }
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
     * 요청한 avi 파일을 리턴합니다.
     *
     * @param req
     * @param res
     * @param map
     * @throws Exception
     */
    @RequestMapping("/getRenewFiles.json")
    public void getRenewFiles(HttpServletRequest req, HttpServletResponse res, @RequestParam HashMap<String, String> map) throws Exception {

//        String strPath = map.get("path");
        String realFileNm = map.get("fileNm");
        String userId = map.get("userId");

        String downFileNm = map.get("downFileNm");
        downFileNm = downFileNm.replaceAll(";", "_");
        downFileNm = downFileNm.replaceAll("/", "_");
        String strArr [];
        strArr = downFileNm.split("\\.");
        downFileNm = strArr[0]+".avi";




        String networkFilePath = propService.getString("packager.org.netdrive.root.path");

        strArr = realFileNm.split("\\.");
        String networkFileNm = strArr[0]+".avi";


        boolean netdriveChk = Boolean.parseBoolean(propService.getString("packager.org.netdrive.chk"));

        String netdriveIp = propService.getString("packager.org.netdrive.ip");
        String netdriveId = propService.getString("packager.org.netdrive.id");
        String netdrivePw = propService.getString("packager.org.netdrive.pw");
        String netdriveNm = propService.getString("packager.org.netdrive.nm");

//        doFTP(ftpIp, ftpId, ftpPw, localFilePath, localFileNm, networkFilePath, networkFileNm);

        String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "+networkFilePath + "\\" + userId + "\\" + networkFileNm+")";


		InputStream in = null;
		BufferedOutputStream bos = null;
		SmbConfig config = null;
		SMBClient client = null;
		AuthenticationContext ac = null;
		Session session = null;
		DiskShare share = null;

    	 try {

    		 if(ValidInspector.isPathAttack(realFileNm)){
                 System.out.println(exceptionStr);
    		 }
    		 else{
    			 if(netdriveChk){

    				 res.setContentType("application/octet-stream");
    	             res.setHeader("Content-Disposition", "attachment;filename=" + new String(downFileNm.getBytes("UTF-8"), "ISO-8859-1"));

    				 config = SmbConfig.builder()
    						 //.withTimeout(120, TimeUnit.SECONDS)
    						 .withTimeout(5, TimeUnit.MINUTES) // Timeout sets read, write and Transact timeouts (default is 60 seconds)
    						 .withSoTimeout(7, TimeUnit.MINUTES) // Socket timeout (default is 0 seconds)
    						 .build();

    				 client = new SMBClient(config);
    				 com.hierynomus.smbj.connection.Connection connection = client.connect(netdriveIp);
    				 ac = new AuthenticationContext(netdriveId, netdrivePw.toCharArray(), null);//domain

    				 session = connection.authenticate(ac);

    				 share = (DiskShare) session.connectShare(netdriveNm);

    				 if(share.folderExists(networkFilePath + "\\" + userId) && share.fileExists(networkFilePath + "\\" + userId + "\\" + networkFileNm)){
    					 bos = new BufferedOutputStream(res.getOutputStream());

        				 byte[] buffer = new byte[4096];
    					 int len = 0;
        				 try (com.hierynomus.smbj.share.File smbFile = share.openFile(networkFilePath + "\\" + userId + "\\" + networkFileNm,
        						 EnumSet.of(AccessMask.GENERIC_READ),
        						 null,
        						 SMB2ShareAccess.ALL,
        						 //SMB2CreateDisposition.CREATE,
        						 com.hierynomus.mssmb2.SMB2CreateDisposition.FILE_OPEN,
        						 null))
        				 {

        					 in = smbFile.getInputStream();

        					 while ((len = in.read(buffer, 0, buffer.length)) != -1) {
        						 bos.write(buffer, 0, len);
        					 }


        				 }catch (Exception e) {
        					 System.out.println(exceptionStr);
        					 e.printStackTrace();
        				 }
    				 }else{
    					 System.out.println(exceptionStr);
    					 System.out.println("file or foleder no exist");
    				 }
    			 }
    		 }

         } catch(Exception e) {
        	 System.out.println(exceptionStr);
             e.printStackTrace();
         }
    	 finally{
    		 if(bos != null){ try{ bos.flush(); }catch(Exception e){} }
             if(bos != null){ try{ bos.close(); }catch(Exception e){} }
             if(in != null){ try{ in.close(); }catch(Exception e){} }
             if(client != null){ try{ client.close(); }catch(Exception e){} }

    	 }

    }


    /**
     * 반출신청 영상 신청 건을 수정합니다.(rqst, avi)
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/editDrm.json", method = RequestMethod.POST)
    public void editDrm(Model model, @ModelAttribute @Valid CrmsTransAviVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {"expAviPw", "cctvMgrNo"};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            model.addAttribute("result", transAvi.editDrm(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * CCTV 목록을 조회합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "getExcel.do", method = RequestMethod.POST)
    public String getExcel(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        String view = null;

        if (map.get("typ").equals("rqst")){
            model.addAttribute("param", map);
            model.addAttribute("list", transRqst.getList(map));
            view = "/tvius/xls/xlsRqst";

        } else if (map.get("typ").equals("renew")){
            model.addAttribute("param", map);
            model.addAttribute("list", renew.getList(map));
            view = "/tvius/xls/xlsRenew";

        } else if (map.get("typ").equals("exp")){
            model.addAttribute("param", map);
            model.addAttribute("list", transAvi.getExpDatList(map));
            view = "/tvius/xls/xlsExp";

        } else if (map.get("typ").equals("listuse")){
            model.addAttribute("param", map);
            model.addAttribute("list", rqstStat.getListUse(map));
            view = "/tvius/xls/xlsListUse";

        } else if (map.get("typ").equals("listsolve")){
            model.addAttribute("param", map);
            model.addAttribute("list", rqstStat.getListSolve(map));
            view = "/tvius/xls/xlsListSolve";

        } else if (map.get("typ").equals("listcrime")){
            model.addAttribute("param", map);
            model.addAttribute("list", rqstStat.getListCrime(map));
            view = "/tvius/xls/xlsListCrime";

        } else if (map.get("typ").equals("listnouse")){
            model.addAttribute("param", map);
            model.addAttribute("list", rqstStat.getListNoUse(map));
            view = "/tvius/xls/xlsListNoUse";
        } else if (map.get("typ").equals("image")){
            model.addAttribute("code", new CodeConvertor(code.getCdeList()));
            model.addAttribute("param", map);
            model.addAttribute("list", crmsImgRqst.getList(map));
            view = "/tvius/xls/xlsImgRqst";
        } else if (map.get("typ").equals("ledger")){
        	model.addAttribute("param", map);
        	model.addAttribute("code", new CodeConvertor(code.getCdeList()));
            model.addAttribute("count", transAvi.getPrintCount(map));
            model.addAttribute("list", transAvi.getPrintList(map));
            view = "/tvius/xls/xlsManagementLedger";
        }

        return view;

    }

    /**
     * 사용자 연장, 증거자료 신청현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusRenewView.do")
    public String getMngTviusRenewView(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("count", renew.getCount(map));
        model.addAttribute("list", renew.getList(map));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/tvius/mngTviusRenewView";
    }

    /**
     * 연장, 증거신청 건을 수정합니다.
     * 승인 및 거절 시 사용됩니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editRenew.json", method = RequestMethod.POST)
    public void editRenew(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	ArrayList<HashMap<String, String>> sysList = new ArrayList<HashMap<String, String>>();
		SystemParameter sysParam = new SystemParameter(param.getList(null));
		sysList.add(sysParam.getParamMap());
		/*String playLimitDat = "0";
		String playLimitCnt = sysList.get(0).get("tvius.evi_play_cnt");
		map.put("playLimitDat", playLimitDat);
		map.put("playLimitCnt", playLimitCnt);*/

        if (map.containsKey("editTyp")){
            if ("acpt".equalsIgnoreCase(map.get("editTyp"))){
                //model.addAttribute("result", renew.updateAcpt(map));
            	boolean addChk = renew.updateAcpt(map);
            	model.addAttribute("result", addChk);

            	HashMap<String, String> rqstParam = new HashMap<String, String>();
            	rqstParam.put("mgrSeq", map.get("rqstMgrSeq"));
            	CrmsTransRqstVo vo = transRqst.getItem(rqstParam);
            	/*if(vo.getUseRsCd() == null || !"10".equals(vo.getUseRsCd())){
            		rqstParam.put("useRsCd", "10");
            		transRqst.updateUseRsCd(rqstParam);
            	}*/


            	if("Y".equals(smsChk) && !"15".equals(vo.getReqGbnCd())){
            		String renewTyp = "연장";
            		if("12".equals(map.get("renewTyp"))) renewTyp = "증거";

            		String title = "영상반출 승인";
            		//String smsConts = "[제천시 스마트시티 통합플랫폼] " + renewTyp + "신청 요청이 승인되었습니다. 신청번호 : " + map.get("rqstMgrSeq");
//            		String smsConts = "[제천시 스마트시티 통합플랫폼] 신청번호 : "+vo.getMgrSeq()+","+ renewTyp + "신청 요청이 승인되었습니다.";
            		String smsConts = "[제천시 스마트시티 통합플랫폼] " + renewTyp + "신청 요청이 승인되었습니다.";
            		sendTviusSmsToUser(title, smsConts, vo.getReqstId());
            	}

            } else if ("rejt".equalsIgnoreCase(map.get("editTyp"))){
                model.addAttribute("result", renew.updateRejt(map));
            }
        }

    }

    /**
     * 연장, 증거신청 건을 삭제합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/delRenew.json", method = RequestMethod.POST)
    public void delRenew(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", renew.del(map));

    }

    /**
     * 재생만료현황 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusExpView.do")
    public String getMngTviusExpView(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("count", transAvi.getExpDatCount(map));
        model.addAttribute("list", transAvi.getExpDatList(map));

        return "/tvius/mngTviusExpView";
    }

    /**
     * 통계 현황 뷰를 리턴합니다.
     * 파라미터에 따라 현황 페이지가 바뀝니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getStatView.do")
    public String getStatView(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        String view = null;
        String page = map.get("page");

        //공통사항
        model.addAttribute("param", map);
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        if ( "listuse".equalsIgnoreCase(page) ){
            model.addAttribute("list", rqstStat.getListUse(map));
            view = "/tvius/stat/listUse";
        } else if ("listsolve".equalsIgnoreCase(page) ){
            model.addAttribute("list", rqstStat.getListSolve(map));
            view = "/tvius/stat/listSolve";
        } else if ("listcrime".equalsIgnoreCase(page) ){
            model.addAttribute("list", rqstStat.getListCrime(map));
            view = "/tvius/stat/listCrime";
        } else if ("listnouse".equalsIgnoreCase(page) ){
            model.addAttribute("list", rqstStat.getListNoUse(map));
            view = "/tvius/stat/listNoUse";
        }

        return view;
    }

    /**
     * 영상반출 관련 서비스들의 생존신고를 받는다.
     *
     * @param model
     * @param nm
     * @param cpu
     * @param mem
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getAliveService.do")
    public String getAliveService(Model model, @RequestParam(value="id", required=true) String nm,
                                               @RequestParam(value="cpu", required=false) String cpu,
                                               @RequestParam(value="mem", required=false) String mem ) throws Exception {

        model.addAttribute("id", nm);
        model.addAttribute("cpu", cpu);
        model.addAttribute("mem", mem);

        return "/tvius/mngTviusMonitor";
    }

    /**
     * 영상반출 관련 서비스들로부터 받은 생존신고 값을 가져온다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getServiceStat.do", method = {RequestMethod.GET, RequestMethod.POST})
    public String getServiceStat(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        if(map.containsKey("svc")){
            if("GetState".equals(map.get("svc"))){
                model.addAttribute("svc", "GetState");
            }
        }

        return "/tvius/mngTviusMonitor";
    }

    /**
     * 영상반출 관리대장 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @NoSession
    @RequestMapping(value = "/getMngTviusRqstMngView.do")
    public String getMngTviusRqstMngView(Model model, @RequestParam HashMap<String, String> map ) throws Exception {

        model.addAttribute("param", map);
        model.addAttribute("count", transAvi.getPrintCount(map));
        model.addAttribute("list", transAvi.getPrintList(map));
        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        return "/tvius/mngTviusRqstMngView";
    }

    /**
     * 요청된 PDF 파일을 리턴합니다.
     *
     * @param res
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value="/getMngLedgerPdfFiles.json", method = RequestMethod.POST)
    public void getMngLedgerPdfFiles(HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        BufferedOutputStream out = null;
        InputStream in = null;
        ITextRenderer renderer = new ITextRenderer();

        String path = session.getServletContext().getRealPath("WEB-INF") + "\\pdf\\";
        String fileNm = map.get("title") + "_" + DateUtil.getStrSec() + ".pdf";
        String outputFile = path + fileNm;
        OutputStream os = new FileOutputStream(outputFile);

        try {
            String fontPath = session.getServletContext().getRealPath("/WEB-INF/") + "pdf\\NanumBarunGothic.ttf";

            renderer.setDocumentFromString(map.get("document"));
            renderer.getFontResolver().addFont(fontPath, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, null);
            renderer.layout();
            renderer.createPDF(os, false);
            renderer.finishPDF();

            res.setContentType("application/octet-stream");
            res.setHeader("Content-Disposition", "attachment;filename=" + new String(fileNm.getBytes("UTF-8"), "ISO-8859-1"));

            File file = new File(outputFile);
            if(file.exists()){
                in = new FileInputStream(file);
                out = new BufferedOutputStream(res.getOutputStream());
                int len;
                byte[] buf = new byte[1024];
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try{ os.flush(); } catch(Exception e) {}
            try{ os.close(); } catch(Exception e) {}
            if(out != null){ try{ out.flush(); }catch(Exception e){} }
            if(out != null){ try{ out.close(); }catch(Exception e){} }
            if(in != null){ try{ in.close(); }catch(Exception e){} }
            try {
                //pdf파일 제공이 완료되었으면 생성되었던 pdf파일을 삭제한다.
                File pdfFile = new File(outputFile);
                pdfFile.delete();
            } catch(Exception e){}
        }
    }

    /**
     * 관리대장 pdf 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngLedgerView.do")
    public String getMngLedgerView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("code", new CodeConvertor(code.getCdeList()));
        model.addAttribute("count", transAvi.getPrintCount(map));
        model.addAttribute("list", transAvi.getPrintList(map));

        return "/tvius/pdf/managementLedger";
    }

    /**
     * 긴급반출 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusUrgRqst.do")
    public String getMngTviusUrgRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        model.addAttribute("sysparam", sysMap);
        model.addAttribute("result", map);

        return "/tvius/mngTviusUrgRqst";
    }

    /**
     * 해시코드 조회 뷰를 리턴합니다.
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getMngTviusHashChkView.do")
    public String getMngTviusHashChkView() throws Exception {//Model model, @RequestParam HashMap<String, String> map

        /*
        //페이지 접근 전 작업폴더에 남아있는 파일들을 삭제한다.
        //시스템 파라미터에서 해시코드조회 작업경로를 가져온다.
        String hashPath = "";
        HashMap<String, String> tmpMap = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        tmpMap = sysParam.getParamMap();
        hashPath = tmpMap.get("hash_files");
        //삭제할 확장자를 입력한다.
        String[] extension = {"jpg", "avi", "ms4"};
        //파일삭제
        HashChk hashChk = new HashChk();
        hashChk.delFileInFolder(hashPath, extension);*/

        return "/tvius/mngTviusHashChkView";
    }

    /**
     * 첨부파일을 추가합니다.
     *
     * @param model
     * @param session
     * @param password
     * @param file
     * @throws Exception
     */
    @RequestMapping(value = "/hashChk.json", method = RequestMethod.POST)
    public void hashChk(Model model, HttpSession session, @RequestParam(value="p") String password,
                                                          @RequestParam(value="uploadVideo", required=true) MultipartFile file) throws Exception {
        //시스템 파라미터에서 해시코드조회 작업경로를 가져온다.
        String hashPath = "";
        HashMap<String, String> map = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        map = sysParam.getParamMap();
        hashPath = map.get("tvius.hash_files");

        //해시 체크 관련 메소드 선언된 클래스
        HashChk hashChk = new HashChk();
        //복호화한 파일명을 저장하기 위한 변수
        String uploadFileNm = "";
        String uploadFileSize = "";
        String decryptFileNm = "";
        //각 작업들의 결과를 저장하기 위해 클래스 생성
        WorkChk workChk = new WorkChk();
        //TODO 1. 파일 업로드
        //성공시 workMsg에 업로드된 파일명이 넘어온다.(파일이 업로드될 때 파일명이 변경 됨.)
        workChk = hashChk.uploadHashChkFile(hashPath, file);

        if(workChk.isResult()){
            uploadFileNm = workChk.getWorkMsg();
            uploadFileSize = workChk.getWorkMsg2();
            //TODO 2. 파일 복호화
            //성공시 복호화된 파일 명이 넘어옴.
            String libPath = session.getServletContext().getRealPath("/WEB-INF/") + "\\teruten\\TMS4FIOXLIB.dll";

            workChk = HashChk.decryptFile(hashPath, uploadFileNm, systemId, nHint, macAddr, usbSerial, mediaExtension, deviceSerial, streaming, libPath, password);

            decryptFileNm = workChk.getWorkMsg();
            if(workChk.isResult()){
                //TODO 3. 해시코드 조회
                //성공시 workMsg에는 sha256코드, workMsg2에는 md5 코드가 저장된다.
                workChk = HashChk.getHashCode(hashPath, workChk.getWorkMsg());
                if(workChk.isResult()){
                    //TODO 4. db 대조
                    ArrayList<CrmsTransWorkVo> workList = new ArrayList<CrmsTransWorkVo>();
                    HashMap<String, String> workParam = new HashMap<String, String>();
                    workParam.put("shaCde", workChk.getWorkMsg());
                    workParam.put("md5Cde", workChk.getWorkMsg2());
                    workList = transWork.getList(workParam);
                    //TODO 5-1. 조회 됐으면
                    //한 개의 결과만 있어야 함.
                    //두 개 이상의 결과는 DB조작 실수를 제외하곤 없기때문에 1을 제외한경우는 모두 조회 결과 없음 처리
                    if(workList.size() == 1){
                        //rqst, avi가 포함된 db정보를 다시 가져온다.
                        //getList에서 가져오기엔 다른 메소드에서 호출하는쪽에서 불필요한 자료를 가져와서 패스
                        //getItem으로 다시 호출
                        model.addAttribute("result", true);
                        model.addAttribute("workInfo", transWork.getItem(workParam));
                        model.addAttribute("uploadNm", file.getOriginalFilename());
                        model.addAttribute("uploadFileSize", uploadFileSize);

                        //파일 썸네일 구하기
                        //ffmpeg.exe 경로
                        /*String ffmpegPath = session.getServletContext().getRealPath("/WEB-INF/") + "\\ffmpeg\\ffmpeg";
                        FFmpegUtil ffmpegUtil = new FFmpegUtil(decryptFileNm, hashPath, ffmpegPath);
                        workChk = ffmpegUtil.getImage(decryptFileNm, decryptFileNm.replace("."+mediaExtension, ".jpg"));
                        //썸네일의 경우는 있어도 그만 없어도 그만이라 생각하기 때문에 일단은 실패시 예외처리를 하지 않음.
                        if(workChk.isResult()){
                            model.addAttribute("thumbnail", workChk.getWorkMsg());
                        }*/
                    }
                    //TODO 5-2. 조회 안됐으면
                    else {
                        model.addAttribute("result", false);
                        model.addAttribute("msg", "일치하는 결과가 없습니다.");
                    }
                } else {
                    model.addAttribute("result", false);
                    model.addAttribute("msg", workChk.getWorkMsg());
                }
            } else {
                model.addAttribute("result", false);
                model.addAttribute("msg", workChk.getWorkMsg());
            }
        } else {
            model.addAttribute("result", false);
            model.addAttribute("msg", workChk.getWorkMsg());
        }

        try{
            //썸네일은 결과페이지에서 이미지 표출 후 삭제
            //따라서 업로드된 영상과 복호화된 영상만 지운다.
            File uploadFile = new File(hashPath + uploadFileNm);
            File decryptFile = new File(hashPath + decryptFileNm);
            if(uploadFile.exists()) uploadFile.delete();
            if(decryptFile.exists()) decryptFile.delete();
        } catch(Exception e){}
    }

    /**
     * 해시코드 조회 시 표출될 썸네일을 가져옵니다.
     *
     * @param req
     * @param res
     * @param map
     * @throws Exception
     */
    @RequestMapping("/getThumbnail.do")
    public void getThumbnail(HttpServletRequest req, HttpServletResponse res, @RequestParam HashMap<String, String> map) throws Exception {
        //시스템 파라미터에서 해시코드조회 작업경로를 가져온다.
        String hashPath = "";
        HashMap<String, String> sysMap = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();
        hashPath = sysMap.get("tvius.hash_files");

        String realFileName = map.get("fileNm");

        String realFile = hashPath + realFileName;
        String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "+realFile+")";

        File file = new File(realFile);
        BufferedOutputStream out = null;
        InputStream in = null;

        try {
            if(ValidInspector.isPathAttack(realFileName)){
                System.out.println(exceptionStr);
            }else{
                res.setContentType("image/" + ValidInspector.getExtension(realFileName, false));
                res.setHeader("Content-Disposition", "inline;filename=" + realFileName);
                if(file.exists()){
                    in = new FileInputStream(file);
                    out = new BufferedOutputStream(res.getOutputStream());
                    int len;
                    byte[] buf = new byte[1024];
                    while ((len = in.read(buf)) > 0) {
                        out.write(buf, 0, len);
                    }
                }else{
                    System.out.println(exceptionStr);
                }
            }
        } catch (Exception e) {
            System.out.println(exceptionStr);
        } finally {
            if(out != null){ out.flush(); }
            if(out != null){ out.close(); }
            if(in != null){ in.close(); }
            //썸네일 제공했으면 이미지 삭제
            if(file.exists()) file.delete();
        }
    }

    /**
     * 해시코드 조회 결과값으로 인증서 장비 세부정보 페이지를 생성합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCertificateFirstView.do")
    public String getCertificateFirstView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("jsonTxt", map.get("jsonTxt"));

        return "/tvius/pdf/certificateFirst";
    }

    /**
     * 해시코드 조회 결과값으로 인증서 해시값 생성결과 확인서 페이지를 생성합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCertificateSecondView.do")
    public String getCertificateSecondView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("jsonTxt", map.get("jsonTxt"));

        return "/tvius/pdf/certificateSecond";
    }

    /**
     * 요청된 인증서 PDF 파일을 리턴합니다.
     *
     * @param model
     * @param res
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value="/getCertificatePdfFiles.json", method = RequestMethod.POST)
    public void getCertificatePdfFiles(Model model, HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        BufferedOutputStream out = null;
        InputStream in = null;
        ITextRenderer renderer = new ITextRenderer();

        String path = session.getServletContext().getRealPath("WEB-INF") + "\\pdf\\";
        String fileNm = map.get("title") + "_" + DateUtil.getStrSec() + ".pdf";
        String firstFileNm = "first.pdf";
        String secondFileNm = "second.pdf";

        String firstFile = path + firstFileNm;
        String secondFile = path + secondFileNm;
        String outputFile = path + fileNm;

        OutputStream os1 = new FileOutputStream(firstFile);
        OutputStream os2 = new FileOutputStream(secondFile);

        try {
            //String fontPath = session.getServletContext().getRealPath("/WEB-INF/") + "pdf\\NanumBarunGothic.ttf";
            String fontPath = path + "NanumBarunGothic.ttf";

            //페이지 설정이 다르기때문에 두 개의 pdf를 만들어 합친다.

            //첫 번째 페이지 pdf 생성
            renderer.setDocumentFromString(map.get("firstPage"));
            renderer.getFontResolver().addFont(fontPath, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, null);
            renderer.layout();
            renderer.createPDF(os1, false);
            renderer.finishPDF();

            res.setContentType("application/octet-stream");
            res.setHeader("Content-Disposition", "attachment;filename=" + new String(firstFileNm.getBytes("UTF-8"), "ISO-8859-1"));

            //두 번째 페이지 pdf 생성
            renderer = new ITextRenderer();
            renderer.setDocumentFromString(map.get("secondPage"));
            renderer.getFontResolver().addFont(fontPath, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, null);
            renderer.layout();
            renderer.createPDF(os2, false);
            renderer.finishPDF();

            res.setContentType("application/octet-stream");
            res.setHeader("Content-Disposition", "attachment;filename=" + new String(secondFileNm.getBytes("UTF-8"), "ISO-8859-1"));

            //mergePdf
            try {
                PdfReader reader1 = new PdfReader(firstFile);
                PdfReader reader2 = new PdfReader(secondFile);

                Document doc = new Document();
                PdfCopy copy = new PdfCopy(doc, new FileOutputStream(outputFile));
                doc.open();
                copy.addDocument(reader1);
                copy.addDocument(reader2);
                doc.close();
                reader1.close();
                reader2.close();

            } catch (Exception e){
                e.printStackTrace();
            }

            File file = new File(outputFile);
            if(file.exists()){

                //실제 다운로드 될 파일 명을 입력한다.
                res.setContentType("application/octet-stream");
                res.setHeader("Content-Disposition", "attachment;filename=" + new String(fileNm.getBytes("UTF-8"), "ISO-8859-1"));

                in = new FileInputStream(file);
                out = new BufferedOutputStream(res.getOutputStream());
                int len;
                byte[] buf = new byte[1024];
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try{ os1.flush(); } catch(Exception e) {}
            try{ os1.close(); } catch(Exception e) {}
            try{ os2.flush(); } catch(Exception e) {}
            try{ os2.close(); } catch(Exception e) {}
            if(out != null){ try{ out.flush(); }catch(Exception e){} }
            if(out != null){ try{ out.close(); }catch(Exception e){} }
            if(in != null){ try{ in.close(); }catch(Exception e){} }
            try {
                //pdf파일 제공이 완료되었으면 생성되었던 pdf파일을 삭제한다.
                File pdfFile1 = new File(firstFile);
                if(pdfFile1.exists()) pdfFile1.delete();
                File pdfFile2 = new File(secondFile);
                if(pdfFile2.exists()) pdfFile2.delete();
                File pdfFile3 = new File(outputFile);
                if(pdfFile3.exists()) pdfFile3.delete();
            } catch(Exception e){}
        }
    }

    /**
     * 투어링 팝업에 표출 될 사진 목록을 가져온다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getTourImgList.json", method = RequestMethod.POST)
    public void getTourImgList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        //투어링 사진 저장 경로를 가져오기 위해 시스템 파라미터 가져오기.
        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        ArrayList<String> result = new ArrayList<String>();
        //
        String imgPath = sysMap.get("sys.upload_path") + "tour\\" + map.get("mgrNo");
        File file = new File(imgPath);

        if(file.exists()){
            File[] fileList = file.listFiles();
            if(fileList.length>0){
                for(int i=0; i<fileList.length; i++){
                    String fileNm = fileList[i].getName();
                    if(fileNm.endsWith(".jpg") || fileNm.endsWith(".png") || fileNm.endsWith(".gif") || fileNm.endsWith(".bmp"))
                        result.add(fileNm);
                }
            }
        }
        model.addAttribute("result", result);
    }

    /**
     * 반출 히트맵 조회 결과를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getHeatList.json"/*, method = RequestMethod.POST*/)
    public void getHeatList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        if(map.get("crimeTyp") != null && !"".equals(map.get("crimeTyp"))){
            String[] vals = map.get("crimeTyp").split("\\{\\|\\}");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("crimeTyp", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }

        if(map.get("reqGbn") != null && !"".equals(map.get("reqGbn"))){
            String[] vals = map.get("reqGbn").split("\\{\\|\\}");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("reqGbn", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }

        model.addAttribute("result", heat.getCntOfCrimeTyp(map));
    }

    /**
     * 차량운행검색 차량번호를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getCarNoList.json"/*, method = RequestMethod.POST*/)
    public void getCarNoList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", carSch.getCarNoList(map));
    }

    /**
     * 차량운행검색 차량번호를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getCarSchList.json"/*, method = RequestMethod.POST*/)
    public void getCarSchList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	/*if(map.get("carKindtype") != null && !"".equals(map.get("carKindtype"))){
            String[] vals = map.get("carKindtype").split(",");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("carKindtype", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }*/

        model.addAttribute("count", carSch.getCount(map));
        model.addAttribute("result", carSch.getList(map));
    }

    /**
     * 차량운행검색 차량번호를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getCarSchImage.json"/*, method = RequestMethod.POST*/)
    public void getCarSchImage(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        ArrayList<CrmsCarSchVo> list = carSch.getList(map);

        int count = 0;
        if(list.size()>0){
            String upPath = "";
            HashMap<String, String> paramMap = null;
            SystemParameter sysParam = new SystemParameter(param.getList(null));
            paramMap = sysParam.getParamMap();
            upPath = paramMap.get("sys.upload_path");

            for(int i=0; i<list.size(); i++){
            	String carImgPathNm = list.get(i).getCarImgPathNm();
                String fileNm = list.get(i).getCarImgFileNm();
                String tmpBasicPath[] = fileNm.split("-");
                String rstBasicPath = "/" + tmpBasicPath[0] + "/VMS/out/" + tmpBasicPath[1] + "/" + tmpBasicPath[2].substring(0, 2);
                if(!"".equals(carImgPathNm)) rstBasicPath = "/"+carImgPathNm+ rstBasicPath;

                FtpClient ftpIvr = new FtpClient(this.carFtpHost, this.carFtpId, this.carFtpPw, this.carFtpBasicpath);
                boolean result = false;

                try {
                    //ftpIvr.makeDir("/test");
                    //result = ftpIvr.upload(target, "testftp.avi", "", "/test");
                    //result = ftpIvr.deleteFile("", "/test", "testftp - 복사본.avi");
                    /*
                    * @param target FTP에 저장된 파일명
                    * @param storePath 저장될 위치
                    * @param storeNm 저장될 파일명
                    * @param workPath FTP 하위폴더명
                    * @param basicPath FTP 최상위 폴더
                    */
                    result = ftpIvr.download(fileNm, upPath+"car", fileNm, "", rstBasicPath);
                } catch (Exception e){
                    e.printStackTrace();
                } finally {
                    if(result) count++;
                }
            }
        }
        model.addAttribute("count", count);
    }

    /**
     * 차량반출정보를 json 포맷으로 서버에 저장합니다..
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/makeCarInfoJson.json"/*, method = RequestMethod.POST*/)
    public void makeCarInfoJson(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        String mgrSeq = map.get("mgrSeq");
        String jsonTxt = URLDecoder.decode( map.get("jsonTxt"), "UTF-8" );

        //시스템 파라미터에서 영상 다운 제한 횟수를 가져온다.
        String strPath = "";
        HashMap<String, String> parameter = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        parameter = sysParam.getParamMap();
        strPath = parameter.get("tvius.storage_path");

        //저장 폴더 생성
        File path = new File(strPath + mgrSeq);
        if(!path.exists()) path.mkdirs();

        //파일 라이터 생성
        FileWriter fw = null;
        try{
            String target = strPath + mgrSeq + "\\" + mgrSeq + ".json";
            File fileChk = new File(target);
            //이미 생성되어있으면 삭제한다.
            //반출정보 수정일때 타게 될 로직
            if(fileChk.exists()) fileChk.delete();
            fw = new FileWriter(target);
            //file.write(obj.toJSONString());
            fw.write(jsonTxt);
            model.addAttribute("result", true);
        } catch (IOException e) {
            e.printStackTrace();
            model.addAttribute("result", false);
        } finally{
           if(fw != null) try{ fw.flush(); }catch(Exception e){}
           if(fw != null) try{ fw.close(); }catch(Exception e){}
        }

    }

    /**
     * 화면캡처 이미지 등록시 첨부되는 파일을 추가합니다.
     *
     * @param model
     * @param session
     * @param sub
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/addFileOfImgRqst.json", method = RequestMethod.POST)
    public void addFileOfImgRqst(Model model, HttpSession session, @RequestParam(value="p", required=true) String sub, @RequestParam(value="imgDesc", required=true) String imgDesc,
                                                             @RequestParam(value="uploadImg", required=true) MultipartFile file) throws Exception {

        //시스템 파라미터에서 영상 다운 제한 횟수를 가져온다.
        String upPath = "";
        HashMap<String, String> map = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        map = sysParam.getParamMap();
        upPath = map.get("sys.upload_path");

        if(file.isEmpty()){
            model.addAttribute("error", "파일이 선택되지 않았습니다.");
            model.addAttribute("result", false);
        }else{
            String [] splitFileNm = file.getOriginalFilename().split("\\.");
            String extension = "." + splitFileNm[splitFileNm.length-1];

            String realFileNm = DateUtil.getStrMilSec() + "-" + imgDesc + extension;
            String path = upPath + sub;
            if("jpeg".equals(extension)) extension = "jpg";
            if(ValidInspector.isImgRqstExtension(extension)){

                File pathDir = new File(path);
                if(!pathDir.exists()) pathDir.mkdirs();
                File img = new File(path + realFileNm);
                file.transferTo(img);

                model.addAttribute("uploadNm", file.getOriginalFilename());
                model.addAttribute("realNm", realFileNm);
                model.addAttribute("imgNm", imgDesc + extension);
                model.addAttribute("result", true);

            }else{
            	model.addAttribute("result", false);
                model.addAttribute("error", "파일은 gif, jpg, jpeg, png, alz, gz, rar, tar, tgz, z, zip 파일만 업로드할 수 있습니다.");
            }
        }
    }

    /**
     * 화면 캡처 이미지 목록을 불러옵니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsImgList.json", method = RequestMethod.POST)
    public void getCrmsImgList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", crmsImg.getList(map));

    }

    /**
     * 화면 캡처 이미지를 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/addCrmsImg.json", method = RequestMethod.POST)
    public void addCrmsImg(Model model, HttpSession session, @ModelAttribute @Valid CrmsImageVo vo, BindingResult br) throws Exception {

    	if(StringUtils.isEmpty(vo.getRegId())){
    		vo.setRegId((String)session.getAttribute("userId"));
    	}
        vo.setRegDat(DateUtil.getStrSec());
        String[] ignoreField = {};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	model.addAttribute("result", true);
            model.addAttribute("crmsImageVo", crmsImg.addAndGetItem(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 이미지 반출 신청 목록을 조회합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsImgRqstInfo.json", method = RequestMethod.POST)
    public void getCrmsImgRqst(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", crmsImgRqst.getList(map));

    }

    /**
     * 이미지 반출 신청을 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/addCrmsImgRqst.json", method = RequestMethod.POST)
    public void addCrmsImgRqst(Model model, HttpSession session, @ModelAttribute @Valid CrmsImageRqstVo vo, BindingResult br) throws Exception {

    	if(StringUtils.isEmpty(vo.getReqstId())){
    		vo.setReqstId((String)session.getAttribute("userId"));
    	}
        vo.setReqstDat(DateUtil.getStrSec());
        vo.setProcStatCd("SW");

        String[] ignoreField = {"acptUserId", "acptDat", "rejtResn"};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
        	boolean addChk = crmsImgRqst.add(vo);
            model.addAttribute("result", addChk);

            //190328 이은규
            //관리자에게 SMS를 발송한다.
            if(addChk && "Y".equals(smsChk)){
            	String title = "이미지반출 신청";
            	//String smsConts = "[제천시 스마트시티 통합플랫폼] 사용자 "+vo.getRegId()+"가 이미지반출을 신청하였습니다. 신청번호 : "+vo.getMgrSeq();
            	String smsConts = "[제천시 스마트시티 통합플랫폼] 신청번호 : "+vo.getMgrSeq()+",사용자 "+vo.getReqstId()+"가 이미지반출을 신청하였습니다.";
            	sendTviusSms(title, smsConts);
            }

            //190325 이은규
            //공문테이블의 row는 삭제하지만 imgrqst테이블에서 사용되므로 실제 로컬 저장소의 사진은 삭제하면 안됨.
            if( !"".equals(vo.getOfclMgrNo()) ){
            	HashMap<String, String> map = new HashMap<String, String>();
            	map.put("mgrSeq", vo.getOfclMgrNo());
            	crmsOfficialDoc.del(map);
            }
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 이미지 반출 신청을 수정합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/editCrmsImgRqst.json", method = RequestMethod.POST)
    public void editCrmsImgRqst(Model model, HttpSession session, @ModelAttribute @Valid CrmsImageRqstVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {"acptUserId", "acptDat", "rejtResn"};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            model.addAttribute("result", crmsImgRqst.update(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 이미지 반출신청 건수를 승인 및 거절합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editProcStatCdOfImgRqst.json", method = RequestMethod.POST)
    public void editProcStatCdOfImgRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	//_param['mgrSeq'] = mgrSeq;
    	//_param['procStatCd'] = 'SK';
    	//_param['acptUserId'] = userId;


    	boolean addChk = transRqst.updateProcStatCd(map);
        model.addAttribute("result", addChk);

        if(addChk && "SK".equals(map.get("procStatCd"))) {
        	String title = "영상반출 승인";
        	//String smsConts = "[제천시 스마트시티 통합플랫폼] 이미지반출 요청이 승인되었습니다." + map.get("mgrSeq");


        	HashMap<String, String> rqstParam = new HashMap<String, String>();
        	rqstParam.put("mgrSeq", map.get("mgrSeq"));
        	CrmsTransRqstVo vo = transRqst.getItem(rqstParam);
        	String smsConts = "[제천시 스마트시티 통합플랫폼] 신청번호 : "+vo.getMgrSeq()+",이미지반출 요청이 승인되었습니다.";
        	sendTviusSmsToUser(title, smsConts, vo.getReqstId());
        }

    }

    /**
     * 이미지 반출신청건의 공문번호를 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editDocNoOfImgRqst.json", method = RequestMethod.POST)
    public void editDocNoOfImgRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	model.addAttribute("result", crmsImgRqst.updateDocNo(map));

    }

    /**
     * 이미지 반출신청건의 공문 정보를 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editDocFileInfoOfImgRqst.json", method = RequestMethod.POST)
    public void editDocFileInfoOfImgRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	boolean workChk = false;
    	String msg = "";

    	workChk = crmsImgRqst.updateDocFileInfo(map);

    	if(workChk){
    		//시스템 파라미터에서 영상 다운 제한 횟수를 가져온다.
            SystemParameter sysParam = new SystemParameter(param.getList(null));

            HashMap<String, String> paramMap = null;
            paramMap = sysParam.getParamMap();
            String upPath = paramMap.get("sys.upload_path");

            File tmpFile = new File(upPath + map.get("tmpFileNm"));

            try{
                if(tmpFile.exists()) {
                	tmpFile.delete();
                	workChk = true;
                }else{
                	msg = "임시 파일이 존재하지 않습니다.";
                }
            }catch(Exception e){
            	msg = "임시 파일 삭제 중 오류가 발생하였습니다.";
            }
    	}else{
    		msg = "공문정보 변경 중 오류가 발생하였습니다.";
    	}

        model.addAttribute("result", workChk);
        model.addAttribute("msg", msg);

    }

    /**
     * 이미지 반출신청건의 최종공문확인 값을 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editDocChngYnOfImgRqst.json", method = RequestMethod.POST)
    public void editDocChngYnOfImgRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	map.put("docChngYn", "Y");
    	model.addAttribute("result", crmsImgRqst.updateDocChngYn(map));

    }

    /**
     * 이미지 반출 신청을 추가합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/addCrmsImgJoin.json", method = RequestMethod.POST)
    public void addCrmsImgJoin(Model model, HttpSession session, @ModelAttribute @Valid CrmsImageRqstVo vo, BindingResult br) throws Exception {

        // 제일 중요
        // imgjoin용으로 따로 vo를 안만들고 rqstvo에 추가해서 씀
        // join을 add해야될 경우 notnull 처리되어있는 밑의 두 항목을 꼭 ignoreField에 추가해 주어야 함.!!!
        String[] ignoreField = {"reqstDetail", "docNo"};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            model.addAttribute("result", crmsImgRqst.addJoin(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 해당 반출 건에 연관된 모든 조인 목록을 삭제합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/delAllCrmsImgJoin.json", method = RequestMethod.POST)
    public void delAllCrmsImgJoin(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", crmsImgRqst.delJoin(map));

    }

    /**
     * 공문이미지 목록을 조회합니다.
     *
     * @param model
     * @param vo
     * @throws Exception
     */
    @RequestMapping(value = "/getCrmsOfficialDocList.json", method = RequestMethod.POST)
    public void getCrmsOfficialDocList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", crmsOfficialDoc.getList(map));
        model.addAttribute("count", crmsOfficialDoc.getCount(map));

    }

    /**
     * CCTV 조회 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getSearchView.do")
    public String getSearchView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("column", col.getList());

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());

    	model.addAttribute("result", cctv.getList(map));
    	model.addAttribute("count", cctv.getCount(map));

    	model.addAttribute("param", map);

    	return "/tvius/cctvSearchView";
    }

	//190328 이은규
    //관리자 sms발송 메소드
    public void sendTviusSms(String title, String smsConts) throws Exception{

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

        adminSmsList = sysMap.get("tvius.admin_sms_list");
        String[] adminAcc = adminSmsList.split("\\|\\|");

		for(int i=0; i<adminAcc.length; i++){
			if(!"".equals(adminAcc[i]) && adminAcc[i] != null){
				UserVo admin = userService.getItem(adminAcc[i]);
				String receivers = admin.getUserNm() + "^" + admin.getMobileNum();

				smsParam.put("receivers", receivers);

//			SendSms smsSender = new SendSms();
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

    //190521 이은규
    //사용자 sms발송 메소드
    public void sendTviusSmsToUser(String title, String smsConts, String userId) throws Exception{

    	HashMap<String, String> smsParam = new HashMap<String, String>();

    	//String url = "http://10.1.73.58:8080/xeus-platform-interface/sms.do";
        String url = "";

    	HashMap<String, String> sysMap = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();
        url = sysMap.get("sms.send.url");

        smsParam.put("url", url);
        smsParam.put("title", title);
        smsParam.put("msg", smsConts);

		UserVo user = userService.getItem(userId);
		String receivers = user.getUserNm() + "^" + user.getMobileNum();

		smsParam.put("receivers", receivers);

        String sendRslt = SendSms.sendSms(smsParam);

        String nowTime = DateUtil.getStrSec();
        MsgLogVo logVo = new MsgLogVo();
        logVo.setSendMsg(smsConts);
        logVo.setSendTyp("S1");
        //logVo.setRecvId(map.get("userId"));//인증번호는 ID를 모르는게 정상
        logVo.setRecvNum(user.getMobileNum());
        logVo.setSendDt(nowTime);
        logVo.setSendRslt(sendRslt);
        logVo.setRsltDesc("");
        msgLogService.add(logVo);

    }

    /**
     * 반출 건의 스키마를 변경합니다.
     * 현재 위치, 변경 위치의 스키마 명을 직접 입력받습니다.
     * 테스트 건 등의 비정상 반출 건수를 숨기거나 복원하는데 사용됩니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/changeRqst.json")
    public void hideRqst(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", transRqst.changeRqst(map));

    }

    /**
     * 반출 백업 목록을 조회합니다.
     * 반출 목록 복원 시 사용됩니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getTransRqstBackup.json")
    public void getTransRqstBackup(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("count", transRqstBackup.getCount(map));
		model.addAttribute("result", transRqstBackup.getList(map));

    }


    /**
	 * 요청한 이미지를 리턴합니다
	 *
	 * @param req
	 * @param session
	 * @param res
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getImage.do")
	public void getImage(HttpServletRequest req, HttpSession session, HttpServletResponse res, @RequestParam HashMap<String, String> map) throws Exception {
		ArrayList<HashMap<String, String>> sysList = new ArrayList<HashMap<String, String>>();

		SystemParameter sysParam = new SystemParameter(param.getList(null));

		sysList.add(sysParam.getParamMap());

//		ArrayList<CrmsImageVo> list = imgRqst.getImgList(map);

		String realFileName = map.get("realNm");
		String fileTmpName = sysList.get(0).get("sys.upload_path");
		if (fileTmpName.endsWith("\\")) {
			fileTmpName += "image\\" + map.get("realNm");
		} else {
			fileTmpName += "\\image\\" + map.get("realNm");
		}

		// String realFile =
		// session.getServletContext().getRealPath("/WEB-INF/") + "\\img\\" +
		// fileTmpName;
		String realFile = fileTmpName;
		String exceptionStr = "존재하지않는  파일을 요청하였거나, 사용자(" + req.getRemoteAddr() + ")가 파라미터 공격을 시도하였음 (파일주소 : "
				+ realFileName + ")";

		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			if (ValidInspector.isPathAttack(realFileName)) {
				System.out.println(exceptionStr);
			} else {
				res.setContentType("image/" + ValidInspector.getExtension(realFileName, false));
				res.setHeader("Content-Disposition", "inline;filename=" + realFileName);

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

	/**
     * 반출신청건의 rqst 정보를 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editRqst.json", method = RequestMethod.POST)
    public void editRqst(Model model, @ModelAttribute @Valid CrmsTransRqstVo vo) throws Exception {
    	model.addAttribute("result", transRqst.update(vo));
    }

    /**
     * 반출신청건의 work 정보를 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editWorkInfo.json", method = RequestMethod.POST)
    public void editWorkInfo(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	model.addAttribute("result", transWork.editWorkInfo(map));
    }

    /**
     * 고속검색 후 해당영상이 맞지 않아 신청내용을 수정합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editAviInfo.json", method = RequestMethod.POST)
    public void editAviInfo(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	String tviusStoragePath = "";
    	HashMap<String, String> sysPath = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysPath = sysParam.getParamMap();
        tviusStoragePath = sysPath.get("tvius.storage_path");

    	ArrayList<CrmsTransWorkVo> work = transWork.getList(map);

    	for(int i=0; i<work.size(); i++){
    		CrmsTransWorkVo vo = work.get(i);

    		String rqstMgrSeq = vo.getRqstMgrSeq();
    		String fileNm = vo.getFileNm();

    		File file = new File(tviusStoragePath + rqstMgrSeq + "\\" + fileNm);

    		if(file.exists()){
    			file.delete();
    		}
    	}

    	model.addAttribute("avi", transAvi.editAviInfo(map));
    	model.addAttribute("work", transWork.del(map));
    }


    @RequestMapping(value = "/editAvi.json", method = RequestMethod.POST)
    public void editAvi(Model model, @ModelAttribute CrmsTransAviVo vo) throws Exception {
    	model.addAttribute("result", transAvi.update(vo));
    }

    @RequestMapping(value = "/getUseRsSmsList.json", method = RequestMethod.POST)
    public void getUseRsSmsList(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	model.addAttribute("result", transRqst.getUseRsSmsList(map));
    }

    @RequestMapping(value = "/useRsSendSms.json", method = RequestMethod.POST)
    public void useRsSendSms(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	sendTviusSmsToUser(map.get("title"), map.get("smsConts"), map.get("userId"));
    }

    @RequestMapping(value = "/getToken.json", method = RequestMethod.POST)
    public void getToken(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	model.addAttribute("result", videoSummaryService.getApiToken(map.get("userId"), map.get("userPwOr")));
    }

    @RequestMapping(value = "/editExpInfo.json", method = RequestMethod.POST)
    public void editExpInfo(Model model, @RequestParam HashMap<String, String> map) throws Exception {
    	model.addAttribute("result", transAvi.editAviInfo(map));
    }

}
