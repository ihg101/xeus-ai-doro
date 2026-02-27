package geomex.xeus.smartcity.web;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.smartcity.service.WassService;

/**
 *
 * <pre>
 * WASS Controller
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/wass")
public class WassController {

	@Autowired private WassService SVC;

	@RequestMapping("/getWassLogView.do")
	public String getWassLogView() throws Exception{
		return "/smartcity/wassLogView";
	}

	@RequestMapping("/getWassLogExcelView.do")
	public String getWassLogExcelView(Model model, @RequestParam HashMap<String, Object> map) throws Exception{

		model.addAttribute("result", SVC.getList(map));
		model.addAttribute("count", SVC.getCount(map));
		model.addAttribute("map", map);

		return "/smartcity/wassLogExcelView";
	}

	@RequestMapping("/getList.json")
	public void getList(Model model, @RequestParam HashMap<String, Object> map) throws Exception{

		model.addAttribute("result", SVC.getList(map));
		model.addAttribute("count", SVC.getCount(map));

	}

}
