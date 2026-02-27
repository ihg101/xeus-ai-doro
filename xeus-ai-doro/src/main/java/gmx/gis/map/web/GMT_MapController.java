package gmx.gis.map.web;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class GMT_MapController {

	/**
	 * 메인 지도화면 뷰를 리턴합니다.
	 *
	 * @param session
	 * @param model
	 * @param map
	 * @return
	 */
	@RequestMapping(value = "/GMT_map.do")
	public String getMapView(HttpSession session, Model model, @RequestParam(required = false, defaultValue = "false") boolean proxy){

		session.setAttribute("proxy", proxy);
		//model.addAttribute("proxy", proxy);

		return "/GMT/map/map";

	}

	/**
	 * SRID를 찾는 지도화면 뷰를 리턴합니다.
	 *
	 * @param session
	 * @param model
	 * @param map
	 * @return
	 */
	@RequestMapping(value = "/GMT_sridFindMap.do")
	public String getSridFindMapView(Model model, @RequestParam String epsg, @RequestParam String typename){

		return "/GMT/map/sridFindMap";

	}

}
