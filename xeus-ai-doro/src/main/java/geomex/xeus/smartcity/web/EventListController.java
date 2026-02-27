package geomex.xeus.smartcity.web;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.sound.midi.Synthesizer;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.itextpdf.text.log.SysoCounter;

import geomex.xeus.smartcity.Utils;
import geomex.xeus.smartcity.service.EventHistVo;
import geomex.xeus.smartcity.service.EventService;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.util.code.ServiceUtil;
import geomex.xeus.util.code.ValidInspector;

@Controller
@RequestMapping("/eventList")
public class EventListController {

	@Resource(name = "eventService")
    private EventService service;


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
		if(vo.getEvtJson() != null && !vo.getEvtJson().trim().isEmpty()) {
		    String cleanedJson = vo.getEvtJson()
		        .replace("&quot;", "\"")
		        .replace("&amp;", "&")
		        .replace("&lt;", "<")
		        .replace("&gt;", ">");
		    vo.setEvtJson(cleanedJson);
		}
		if("pass".equals(msg)){
			model.addAttribute("result", service.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}
		
	    /**
	     * 블랙아이스 이벤트 리스트 정보 리스트를 가져옵니다.
	     *
	     * @param req
	     * @param res
	     * @param model
	     * @param map
	     * @return
	     * @throws Exception
	     */
	    @RequestMapping(value = "/getBlackIceList.json", method = RequestMethod.POST)
	    public void getBlackIceList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

	        ArrayList<EventHistVo> list = service.getBlackIceList(map);
	        
	        ArrayList<String> result = new ArrayList<String>();
	        for(int i=0; i<list.size(); i++){
	            result.add(Utils.setJson(list.get(i)));
	        }

	        model.addAttribute("result", result);

	    }

}