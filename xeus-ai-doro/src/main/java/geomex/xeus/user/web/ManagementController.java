package geomex.xeus.user.web;

import java.io.File;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

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

import geomex.xeus.sysmgr.service.AuthLogService;
import geomex.xeus.sysmgr.service.AuthLogVo;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.service.SmsAuthService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.user.service.ManagementService;
import geomex.xeus.user.service.UserService;
import geomex.xeus.user.service.UserVo;
import geomex.xeus.user.util.SHA;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;

/**
 * <pre>
 * 파일명 :  UserManagementController.java
 * 설  명 :
 *   사용자 관리 컨트롤러 입니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-13      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 12.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/userMng")
public class ManagementController {

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "authService")
	private AuthService auth;

	@Resource(name = "authLogService")
    private AuthLogService authLog;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource(name = "userService")
    private UserService service;

	@Resource(name = "managementService")
	private ManagementService mngService;

	@Resource(name = "sysPropService")
    private SysPropService param;

	@Resource
	private ColumnInfoController col;

	@Resource(name = "smsAuthService")
	private SmsAuthService smsAuthService;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	/**
     * 사용자 정보 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getUserView.do")
    public String getUserView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getList(map));
		model.addAttribute("count", service.getCount(map));
		model.addAttribute("column", col.getList());
		//model.addAttribute("auth", auth.getGrpList(map));
		//model.addAttribute("orgz", orgz.getList(map));
		/*
		 * 180601 이은규
		 * auth와 orgz 불러오는 mapper에도 limit, offset 속성이 있어서 map을 파라미터로 넣으면 안됨.
		 */
		model.addAttribute("auth", auth.getGrpList(null));
        model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("map", map);

    	return "/user/mng";
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
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid UserVo param, BindingResult br) throws Exception {
		if("12".equals(param.getAuthStatCd())){
			param.setAcptUserId((String) session.getAttribute("userId"));
		}else{
			param.setAcptUserId(" ");

			//폐기하면 mt_sms_auth에 폐기되는 userId row 삭제
			if("15".equals(param.getAuthStatCd())){
				HashMap<String, String> smsParam = new HashMap<String, String>();
				smsParam.put("userId", param.getUserId());

				try{
					smsAuthService.del(smsParam);
				}catch(Exception e){
				}
			}
		}

		String[] ignoreField = {"userPwd"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
		    //작업 전 권한정보를 얻어옴.
		    HashMap<String, String> map = new HashMap<String, String>();
	        map.put("userId", param.getUserId());
	        UserVo beforeStat = service.getItem(map);

	        boolean workChk = service.edit(param);
			model.addAttribute("result", workChk);
			//권한 수정로그
			if(workChk){
                AuthLogVo log = new AuthLogVo();
                log.setWorkerId((String) session.getAttribute("userId"));
                log.setUsrId(param.getUserId());
                log.setBeforeAuthData(beforeStat.getAuthGrpNo());
                //폐기상태로 변경 시 변경 후 권한은 넣지 않는다.(권한 회수)
                if(!"15".equals(param.getAuthStatCd())) log.setAfterAuthData(param.getAuthGrpNo());
                log.setChgDat(DateUtil.getStrSec());
                authLog.add(log);
            }
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 사용자 계정 서약서를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editPledge.json", method = RequestMethod.POST)
	public void editPledge(Model model, HttpSession session, @RequestParam(value="mode", required=false) String mode,
															 @RequestParam(value="p", required=true) String sub,
															 @RequestParam(value="targetUserId", required=false) String targetUserId,
                											 @RequestParam(value="uploadImg", required=true) MultipartFile file) throws Exception {

		String userId = (String) session.getAttribute("userId");
		if(targetUserId != null && !"".equals(targetUserId)) userId = targetUserId;

		//시스템 파라미터에서 업로드 파일 경로를 가져온다.
        String upPath = "";
        HashMap<String, String> sysMap = null;
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();
        upPath = sysMap.get("sys.upload_path");

	    if(file.isEmpty()){
            model.addAttribute("error", "파일이 선택되지 않았습니다.");
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

                if("edit".equals(mode)) {
                	//작업 전 권한정보를 얻어옴.
                	UserVo vo = service.getItem(userId);
                	String oathFilePath = vo.getOathFilePath();
                	if(oathFilePath != null){
                		File originalFile = new File(oathFilePath);
                		if(originalFile.exists()) originalFile.delete();
                	}
                }


        	    HashMap<String, String> map = new HashMap<String, String>();
        	    map.put("userId", userId);
        	    map.put("oathFileNm", file.getOriginalFilename());
        	    map.put("oathFilePath", path + realFileNm);

        	    model.addAttribute("oathFileNm", file.getOriginalFilename());
        	    //model.addAttribute("oathFilePath", path + realFileNm);
        	    boolean result = true;
        	    if("edit".equals(mode)) result =  service.editPledge(map);
                model.addAttribute("result", result);
                model.addAttribute("oathFilePath", path + realFileNm);
            }else{
                model.addAttribute("error", "파일은 pdf, txt, hwp, xls, xlsx, ppt, rtf, doc, jpg, jpeg, png, zip, 7z 파일만 업로드 할 수 있습니다.");
            }
        }

	}

	/**
     * 사용자 계정을 등록합니다.
     *
     * @param model
     * @param param
     * @param br
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/add.json", method = RequestMethod.POST)
    public void add(Model model, HttpSession session, @ModelAttribute @Valid UserVo param, BindingResult br) throws Exception {

        param.setUserPwd(SHA.simpleEnc512(param.getUserId() + param.getUserPwd()));
        //param.setAuthGrpNo("G00002");
        //param.setAuthStatCd("11");
        String now = DateUtil.getStrSec();
        param.setReqDat(now);

        String[] ignoreField = {"mobileNum", "posNm", "departNm", "oathFileNm", "oathFilePath"};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){
            boolean workChk = service.add(param);
            model.addAttribute("result", workChk);
            //권한 부여, 관리자가 직접 생성시엔 권한이 부여된 채로 등록됨.
            if(workChk){
                AuthLogVo log = new AuthLogVo();
                log.setWorkerId((String) session.getAttribute("userId"));
                log.setUsrId(param.getUserId());
                log.setAfterAuthData(param.getAuthGrpNo());
                log.setChgDat(now);
                authLog.add(log);
            }
        }else{
            model.addAttribute("error", msg);
        }

    }

}
