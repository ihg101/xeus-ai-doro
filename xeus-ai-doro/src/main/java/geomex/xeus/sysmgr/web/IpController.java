package geomex.xeus.sysmgr.web;

import geomex.xeus.sysmgr.service.IpService;
import geomex.xeus.sysmgr.service.IpVo;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.ValidInspector;

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

/**
 * <pre>
 * 파일명 :  IpController.java
 * 설  명 :
 *   IP 관리 컨트롤러 입니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/ip")
public class IpController {

	@Resource(name = "ipService")
    private IpService service;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource
	private ColumnInfoController col;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	/**
     * IP 정보 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getIpView.do")
    public String getIpView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getList(map));
		model.addAttribute("count", service.getCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("orgz", orgz.getList(map));
		model.addAttribute("map", map);

    	return "/ip/ipList";
	}

    /**
     * IP 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getCount(map));

    }

    /**
	 * IP 정보 리스트를 가져옵니다.
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
	 * 특정 IP 데이터를 가져옵니다.
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
	 * IP를 삭제합니다.
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
	 * IP를 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid IpVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {"workerId", "lastMdfyDat"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			vo.setWorkerId((String) session.getAttribute("userId"));
			vo.setLastMdfyDat(DateUtil.getStrSec());
			model.addAttribute("result", service.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * IP를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid IpVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {"workerId", "lastMdfyDat"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			vo.setWorkerId((String) session.getAttribute("userId"));
			vo.setLastMdfyDat(DateUtil.getStrSec());
			model.addAttribute("result", service.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

}
