package gmx.gis.nms.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * <pre>
 * 도곽 절단 기능을 지원합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/GMT_gridExport")
public class GMT_GridExportController {

	/**
	 * Ping 설정 뷰를 리턴합니다.
	 *
	 * @param session
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getView.do")
	public String getView(Model model) throws Exception {

		return "/gridExport/view";

	}

}
