package geomex.xeus.event112.web;

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

import geomex.xeus.event112.service.CctvPreviewService;
import geomex.xeus.event112.service.CctvPreviewVo;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.ValidInspector;

@Controller
@RequestMapping("/cctvPreview")
public class CctvPreviewController {

	@Resource
	CctvPreviewService preivew;

	@Resource
	private ColumnInfoController col;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	/**
     * Preview 정보 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
	@Deprecated
    @RequestMapping(value = "/getPreviewView.do")
    public String getView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", preivew.getList(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("count", preivew.getCount(map));
		model.addAttribute("map", map);

    	return "/preview/view";
	}

    /**
     * Preview 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", preivew.getCount(map));

    }

    /**
	 * Preview 정보 리스트를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getList.json", method = RequestMethod.POST)
	public void getList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		String reqUserId = map.get("reqUserId");

		if(reqUserId == null || "".equals(reqUserId)){
			map.put("reqUserId", (String) session.getAttribute("userId"));
		}

		model.addAttribute("result", preivew.getList(map));
		model.addAttribute("count", preivew.getCount(map));

	}

	/**
	 * 특정 Preview 데이터를 가져옵니다.
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

		model.addAttribute("result", preivew.getItem(map));

	}

	/**
	 * Preview를 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {

		model.addAttribute("result", preivew.del(map));

	}

	/**
	 * Preview를 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid CctvPreviewVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {""};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			vo.setReqUserId((String) session.getAttribute("userId"));
			model.addAttribute("result", preivew.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * Preview를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid CctvPreviewVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {""};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("result", preivew.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

}
