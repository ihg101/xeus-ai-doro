package geomex.xeus.sysmgr.web;

import geomex.xeus.sysmgr.service.CodeService;
import geomex.xeus.sysmgr.service.CodeVo;
import geomex.xeus.sysmgr.service.IpVo;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.ValidInspector;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/code")
public class CodeCtrl {

	private ArrayList<CodeVo> cdeList;

	@Resource(name = "codeService")
    private CodeService service;

	@Autowired
	private ColumnInfoController col;

	@PostConstruct
	public void init() throws Exception {
		this.refresh("어플리케이션 구동");
	}

	@RequestMapping(value = "/refresh")
	public void refresh(String str) throws Exception {
		cdeList = service.getList(null);
		System.out.println(">> 코드를 갱신합니다. (사유 : " + str + ")");
		System.out.println(">> 코드 수       : " + cdeList.size());
		System.out.println(">> 갱신 시간    : " + DateUtil.formatDate(DateUtil.getStrSec()));
	}

	@RequestMapping(value = "/getCodeList.json", method = RequestMethod.POST)
	public ArrayList<CodeVo> getCdeList() {
		return cdeList;
	}


	public CodeConvertor getCodeConvertor() {
		return new CodeConvertor(cdeList);
	}

	/**
     * 코드 정보 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getCodeView.do")
    public String getCodeView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getList(map));
		model.addAttribute("count", service.getCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/code/codeList";
	}

    /**
     * 코드 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getCount(map));

    }

    /**
	 * 코드 정보 리스트를 가져옵니다.
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
	 * 특정 코드 데이터를 가져옵니다.
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
	 * 코드를 삭제합니다.
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
	 * 코드를 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid CodeVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 코드를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid CodeVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

}
