package geomex.xeus.sysmgr.web;

import java.util.ArrayList;
import java.util.Arrays;
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
import geomex.xeus.sysmgr.service.SmsService;
import geomex.xeus.sysmgr.service.SmsTempVo;
import geomex.xeus.user.service.UserService;
import geomex.xeus.util.code.ValidInspector;

@Controller
@RequestMapping("/sms")
public class SmsController {

	@Resource(name = "smsService")
    private SmsService service;

	@Resource(name = "msgLogService")
	private MsgLogService msgLogService;

	@Resource(name = "userService")
	private UserService userService;

	@Resource
	private ColumnInfoController col;

	@Resource
	private Validator validator;

	@Resource(name = "authService")
	private AuthService authService;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

    /**
     * SMS 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getCount(map));

    }

    /**
	 * SMS 정보 리스트를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSmsLogList.json", method = RequestMethod.POST)
	public void getSmsHistList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", msgLogService.getList(map));
		model.addAttribute("count", msgLogService.getCount(map));

	}

	/**
	 * SMS 로그 정보 리스트를 가져옵니다.
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
	 * 특정 SMS 데이터를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
	public void getItem(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getItem(map));

	}


	/**
     * 권한 별 사용자를 체크해서 SMS전송하는 view 반환
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getSendSMSView.do")
    public String getLayerAuthView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	map.remove("limit");
    	map.remove("offset");

    	//auth_list용 sort추가
//		model.addAttribute("result", service.getList(map));

		model.addAttribute("grpList", authService.getGrpList(map));
		model.addAttribute("grpCount", authService.getGrpCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/eventMonitor/sendSMSView";
	}

	/**
	 * SMS를 삭제합니다.
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

	/**
	 * SMS를 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid SmsTempVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * SMS를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid SmsTempVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
     * SMS목록에서 폐기 계정을 삭제합니다.
     *
     * @param model
     * @param param
     * @param br
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/delDiscardId.json", method = RequestMethod.POST)
    public void delDiscardId(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        boolean workChk = false;

        try{
            //1. 폐기 계정만 있는 발송내역은 삭제한다.
            HashMap<String, String> param = new HashMap<String, String>();
            param.put("rcvId", map.get("userId"));
            service.delByID(param);

            //2. 폐기계정이 포함된 내역은 폐기된 계정만 삭제한다.
            //  2-1)계정이 포함된 리스트를 불러온다.
            ArrayList<SmsTempVo> discardList = new ArrayList<SmsTempVo>();
            discardList = service.getList(null);

            //  2-2)해당 아이디와 일치하는 계정이 없으면 리스트에서 삭제한다.
            //      리스트 내역이 있으면 진행
            if(discardList.size() != 0){
                //요소가 삭제될 수 있으므로 거꾸로 반복문이 돌아야 함.
                for(int i=discardList.size()-1; i>=0; i--){
                    String rcvId = discardList.get(i).getRcvId();
                    String rcvPhone = discardList.get(i).getRcvPhone();
                    String[] rcvIdArr = rcvId.split(",");
                    String[] rcvPhoneArr = rcvPhone.split(",");
                    //rcvID 목록에 userId가 포함되어있지 않으면 작업할 필요가 없음.
                    if(!Arrays.asList(rcvIdArr).contains(map.get("userId"))){
                        discardList.remove(i);
                    } else {
                        //변동 값 저장용 변수
                        ArrayList<String> rcvIdList = new ArrayList<String>();
                        ArrayList<String> rcvPhoneList = new ArrayList<String>();
                        for(int j=0; j<rcvIdArr.length; j++){
                            //userId를 제외한 나머지 항목은 모두 넣는다.
                            if(!rcvIdArr[j].equals(map.get("userId")))
                                rcvIdList.add(rcvIdArr[j]);
                        }
                        for(int k=0; k<rcvPhoneArr.length; k++){
                            if(rcvPhoneArr[k].equals(map.get("mobileNum"))){
                                if(rcvPhoneList.contains(map.get("mobileNum")))
                                    rcvPhoneList.add(rcvPhoneArr[k]);
                            }else{
                                rcvPhoneList.add(rcvPhoneArr[k]);
                            }
                        }
                        String rstRcvId = "";
                        String rstRcvPhone = "";
                        //string,string 형식으로 포맷하기 위한 작업
                        rstRcvId = rcvIdList.toString().replaceAll(" ", "").replaceAll("\\[", "").replaceAll("\\]", "");
                        rstRcvPhone = rcvPhoneList.toString().replaceAll(" ", "").replaceAll("\\[", "").replaceAll("\\]", "");
                        //vo의 rcvId값을 변경한다.
                        discardList.get(i).setRcvId(rstRcvId);
                        discardList.get(i).setRcvPhone(rstRcvPhone);
                    }

                }
            }

            //  2-3)루프를 돌면서 업데이트를 한다.
            //      작업 내역이 있으면 진행
            //      2-2 작업에서 모든 리스트가 삭제되었을 수 있으므로 다시 체크하여야 함.
            if(discardList.size() != 0){
                for(int i=discardList.size()-1; i>-1; i--){
                    service.edit(discardList.get(i));
                }
            }
            workChk = true;
        }catch(Exception e){
        }finally{
            model.addAttribute("result", workChk);
        }
    }

}