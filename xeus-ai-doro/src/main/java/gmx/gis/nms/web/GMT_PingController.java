package gmx.gis.nms.web;

import java.util.HashMap;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import gmx.gis.nms.service.GMT_AutoPingService;
import gmx.gis.nms.service.GMT_PingService;
import gmx.gis.nms.service.GMT_PingVo;
import gmx.gis.proxy.service.GMT_ProxyService;
import gmx.gis.sysmgr.service.GMT_ColumnService;

/**
 * <pre>
 * 테이블을 대상으로 Ping 체크 기능을 지원합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/GMT_ping")
public class GMT_PingController {

	@Autowired private GMT_PingService svc;

	@Autowired private GMT_AutoPingService ping;

	@Autowired private GMT_ProxyService proxy;

	@Autowired private GMT_ColumnService column;

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

		model.addAttribute("list", svc.getList(null));

		return "/ping/pingView";

	}

	/**
	 * Ping 체크 리스트에 추가합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
	public void add(Model model, @RequestParam int k) throws Exception {

		HashMap<String, Integer> map = new HashMap<String, Integer>();
		map.put("mgrSeq", k);

		model.addAttribute("result", svc.getItem(map));

	}

	/**
	 * Ping 체크 리스트에 추가합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute GMT_PingVo vo) throws Exception {

		vo.setRegUsrId((String) session.getAttribute("userId"));

		model.addAttribute("result", false);

		GMT_PingVo addItem = svc.addAndItem(vo);

		if(addItem != null){
			String schemAndTable = vo.getSchemNm() + "." + vo.getTblId();
			ping.destroyWorker(schemAndTable);

			HashMap<String, String> stateFieldMap = new HashMap<String, String>();
			stateFieldMap.put("schemNm", vo.getSchemNm());
			stateFieldMap.put("tblId", vo.getTblId());
			stateFieldMap.put("colId", "state_cd");
			stateFieldMap.put("colNm", "상태 코드");
			stateFieldMap.put("colType", "CHARACTER VARYING");
			stateFieldMap.put("colSize", "50");
			column.addField(stateFieldMap);

			proxy.manageLayer("flush", vo.getSchemNm(), vo.getTblId(), vo.getLyrNm());

			ping.generateWorker(svc.getItemByKey(addItem.getMgrSeq()));

			model.addAttribute("result", true);
		}

	}

	/**
	 * Ping 체크 리스트를 수정합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, @ModelAttribute GMT_PingVo vo) throws Exception {

		boolean editResult = svc.edit(vo);

		if(editResult){
			String schemAndTable = vo.getSchemNm() + "." + vo.getTblId();
			ping.destroyWorker(schemAndTable);
			ping.generateWorker(vo);

			model.addAttribute("result", editResult);
		}

	}

	/**
	 * Ping 체크 리스트에사 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, @RequestParam int k) throws Exception {

		HashMap<String, Integer> map = new HashMap<String, Integer>();
		map.put("mgrSeq", k);

		GMT_PingVo vo = svc.getItem(map);
		if(vo != null){
			boolean delResult = svc.del(map);

			if(delResult){
				String schemAndTable = vo.getSchemNm() + "." + vo.getTblId();
				ping.destroyWorker(schemAndTable);

				HashMap<String, String> stateFieldMap = new HashMap<String, String>();
				stateFieldMap.put("schemNm", vo.getSchemNm());
				stateFieldMap.put("tblId", vo.getTblId());
				stateFieldMap.put("colId", "state_cd");
				column.dropField(stateFieldMap);

				proxy.manageLayer("flush", vo.getSchemNm(), vo.getTblId(), vo.getLyrNm());

				model.addAttribute("result", delResult);
			}
		}

	}

}
