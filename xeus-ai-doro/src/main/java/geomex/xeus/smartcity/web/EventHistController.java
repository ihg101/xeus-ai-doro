package geomex.xeus.smartcity.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
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

import geomex.xeus.smartcity.Utils;
import geomex.xeus.smartcity.service.EventHistService;
import geomex.xeus.smartcity.service.EventHistVo;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.ServiceUtil;
import geomex.xeus.util.code.ValidInspector;

@Controller
@RequestMapping("/eventHist")
public class EventHistController {

	@Resource(name = "eventHistService")
    private EventHistService service;

	@Autowired
	private ColumnInfoController col;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;
	/**
     * 이벤트 리스트 정보 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = {"/getEventHistView.do", "/getEventHistExcel.do"}, method = RequestMethod.POST)
    public String getCodeView(HttpServletRequest req, Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	String[] full_url = req.getRequestURI().split("/");
    	String url = full_url[full_url.length - 1];

    	String view = "/eventMonitor/eventHistView";

		model.addAttribute("result", service.getList(map));
		model.addAttribute("type", service.getEventTypeList(map));
		model.addAttribute("count", service.getCount(map));
		model.addAttribute("map", map);
		
		if("getEventHistExcel.do".equals(url)){
    		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
    		model.addAttribute("column", col.getList());
    		view = "/eventMonitor/excelView";
    	}

    	return view;
	}

    /**
     * 이벤트 리스트 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/setSession.json", method = RequestMethod.POST)
    public void setSession(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	session.setAttribute("eventUserId", map.get("eventUserId"));

    }

    /**
     * 이벤트 리스트 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getCount(map));

    }
    
    /**
     * 이벤트 유형 리스트를 가져옵니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getSortList.json", method = RequestMethod.POST)
    public void getSortList(Model model, HttpSession session) throws Exception {

        model.addAttribute("count", service.getSortList());

    }

    /**
	 * 이벤트 리스트 정보 리스트를 가져옵니다.
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
	    
		ArrayList<EventHistVo> list = service.getList(map);
		ArrayList<String> result = new ArrayList<String>();
		for(int i=0; i<list.size(); i++){
			result.add(Utils.setJson(list.get(i)));
		}

		model.addAttribute("result", result);
		model.addAttribute("count", service.getCount(map));

	}

	/**
	 * 특정 이벤트 리스트 데이터를 가져옵니다.
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
	 * 이벤트 리스트를 삭제합니다.
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
	 * 이벤트 리스트를 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute @Valid EventHistVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 이벤트 리스트를 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, HttpSession session, @ModelAttribute @Valid EventHistVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
     * 이벤트 리스트 정보 리스트를 가져옵니다.
     *
     * @param req
     * @param res
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getStatList.json", method = RequestMethod.POST)
    public void getStatList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
        model.addAttribute("result", service.getList(map));
        model.addAttribute("count", service.getCount(map));
        model.addAttribute("lineChart", service.getTodayEvtByTime(map));
        model.addAttribute("columnChart", service.getStatByType(map));

    }

    /**
     * 이벤트 유형별 히트맵 조회 결과를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getHeatList.json"/*, method = RequestMethod.POST*/)
    public void getHeatList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        if(map.get("evtNm") != null && !"".equals(map.get("evtNm"))){
            String[] vals = map.get("evtNm").split("\\{\\|\\}");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("evtNm", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }

        model.addAttribute("result", service.getCntOfEvtNm(map));
    }

}
