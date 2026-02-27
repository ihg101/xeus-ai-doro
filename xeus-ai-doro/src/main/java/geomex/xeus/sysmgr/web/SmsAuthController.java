package geomex.xeus.sysmgr.web;

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

import geomex.xeus.log.service.MsgLogService;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.SmsAuthService;
import geomex.xeus.sysmgr.service.SmsAuthVo;
import geomex.xeus.sysmgr.service.SymDescService;
import geomex.xeus.sysmgr.service.SymIconService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.user.service.UserService;
import geomex.xeus.util.code.ValidInspector;


/**
 * <pre>
 * 파일명 :  UserManagementController.java
 * 설  명 :
 *
 *   시스템 관리 컨트롤러 입니다.
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
@RequestMapping("/smsAuth")
public class SmsAuthController {

	@Resource
	private ColumnInfoController col;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "sysPropService")
    private SysPropService param;

	@Resource(name = "msgLogService")
	private MsgLogService msgLogService;

	@Resource(name = "symIconService")
    private SymIconService symIconService;

	@Resource(name = "symDescService")
    private SymDescService symDescService;

	@Resource(name = "userService")
    private UserService user;


    @Resource(name = "authService")
	private AuthService authService;

    @Resource(name = "smsAuthService")
	private SmsAuthService service;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	/**
     * 반출 SMS 관리 페이지를 반환합니다
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getUserTviusAuthView.do")
    public String getLayerAuthView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	map.remove("limit");
    	map.remove("offset");

    	//auth_list용 sort추가

    	model.addAttribute("result", service.getList(map));
		model.addAttribute("grpList", authService.getGrpList(map));
		model.addAttribute("grpCount", authService.getGrpCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/sysMng/userAuthView";
	}



    /**
     * 관리자 SMS 리스트를 반환합니다
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getList.json", method = RequestMethod.POST)
    public void getList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", service.getList(map));

    }


    /**
	 * mt_sms_auth 테이블의 smsAuth 컬럼을 업데이트합니다
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateSmsAuth.json", method = RequestMethod.POST)
	public void updateSmsAuth(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {


		model.addAttribute("result", service.edit(map));
	}



	/**
	 * mt_sms_auth 테이블 신규추가합니다ㄴ
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid SmsAuthVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {""};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("result", service.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}


	/**
	 * mt_sms_auth 테이블  row를 삭제합니다
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.del(map));

	}



}
