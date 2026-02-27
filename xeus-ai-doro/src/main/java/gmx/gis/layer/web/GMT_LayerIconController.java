package gmx.gis.layer.web;

import java.util.HashMap;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import gmx.gis.layer.service.GMT_LayerIconService;
import gmx.gis.layer.service.GMT_LayerIconVo;

/**
 *
 * <pre>
 * 레이어의 정보를 관리하는 컨트롤러 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/GMT_layer/icon")
public class GMT_LayerIconController {

	@Autowired private GMT_LayerIconService svc;

	/**
	 * 아이콘 목록을 조회합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getList.json", method = RequestMethod.POST)
	public void getList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", svc.getList(map));

	}

	/**
	 * 아이콘 단건을 조회합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
	public void getItem(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", svc.getItem(map));

	}

	/**
	 * 아이콘을 추가합니다.
	 *
	 * @param model
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute GMT_LayerIconVo vo) throws Exception {

		String userId = (String) session.getAttribute("userId");

		if(StringUtils.isEmpty(userId)){
			model.addAttribute("result", false);
			model.addAttribute("error", "세션이 존재하지 않습니다.");
		}else{
			vo.setMkUser(userId);

			model.addAttribute("result", svc.add(vo));
		}

	}

	/**
	 * 아이콘을 수정합니다.
	 *
	 * @param model
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute GMT_LayerIconVo vo) throws Exception {

		String userId = (String) session.getAttribute("userId");

		if(StringUtils.isEmpty(userId)){
			model.addAttribute("result", false);
			model.addAttribute("error", "세션이 존재하지 않습니다.");
		}else{
			vo.setMkUser(userId);

			model.addAttribute("result", svc.add(vo));
		}

	}

	/**
	 * 아이콘을 제거합니다.
	 *
	 * @param model
	 * @param mgrSeq
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, HttpSession session, @RequestParam String mgrSeq) throws Exception {

		String userId = (String) session.getAttribute("userId");

		if(StringUtils.isEmpty(userId)){
			model.addAttribute("result", false);
			model.addAttribute("error", "세션이 존재하지 않습니다.");
		}else{
			//TODO 삭제시, 해당 아이콘을 사용하는 레이어가 있을 경우 디폴트로 변경해야함.

			model.addAttribute("result", svc.del(mgrSeq, userId));
		}

	}

}
