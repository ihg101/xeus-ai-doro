package gmx.gis.sysmgr.web;

import gmx.gis.sysmgr.service.GMT_CodeService;
import gmx.gis.sysmgr.service.GMT_CodeVo;
import gmx.gis.util.code.GMT_CodeConvertor;
import gmx.gis.util.code.GMT_DateUtil;
import gmx.gis.util.code.GMT_ValidInspector;

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
@RequestMapping("/GMT_code")
public class GMT_CodeCtrl {

	private ArrayList<GMT_CodeVo> cdeList;

    @Autowired private GMT_CodeService service;

    @Autowired private GMT_ColumnController col;

	@PostConstruct
	public void init() throws Exception {
		this.refresh("어플리케이션 구동");
	}

	@RequestMapping(value = "/refresh")
	public void refresh(String str) throws Exception {
		cdeList = service.getList(null);
		System.out.println(">> 코드를 갱신합니다. (사유 : " + str + ")");
		System.out.println(">> 코드 수       : " + cdeList.size());
		System.out.println(">> 갱신 시간    : " + GMT_DateUtil.formatDate(GMT_DateUtil.getStrSec()));
	}

	@RequestMapping(value = "/getCodeList.json", method = RequestMethod.POST)
	public ArrayList<GMT_CodeVo> getCdeList() {
		return cdeList;
	}


	public GMT_CodeConvertor getGMT_CodeConvertor() {
		return new GMT_CodeConvertor(cdeList);
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
	public void add(Model model, HttpSession session, @ModelAttribute @Valid GMT_CodeVo vo, BindingResult br) throws Exception {

		String msg = GMT_ValidInspector.findError(br);

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
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid GMT_CodeVo vo, BindingResult br) throws Exception {

		String msg = GMT_ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

}
