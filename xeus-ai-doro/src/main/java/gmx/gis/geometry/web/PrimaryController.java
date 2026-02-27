package gmx.gis.geometry.web;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.system.annotation.NoSession;
import gmx.gis.geometry.service.GMT_GeometryService;

/**
 * <pre>
 * 현재 사용되지 않습니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Deprecated
@Controller
@RequestMapping("/primary")
public class PrimaryController {

	@Deprecated @Autowired private GMT_GeometryService svc;

	/**
	 * 테이블의 다음 PK값을 조회합니다.
	 *
	 * @param model
	 * @param table
	 * @throws Exception
	 */
	@Deprecated
	@NoSession
	@RequestMapping(value = "/getNextPrimaryKey.json", method = RequestMethod.POST)
	public void getNextPrimaryKey(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", svc.getNextPrimaryKey(map));

	}

}
