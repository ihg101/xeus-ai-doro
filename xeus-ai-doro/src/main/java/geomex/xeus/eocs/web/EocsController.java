package geomex.xeus.eocs.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.eocs.service.EocsService;
import geomex.xeus.eocs.service.EocsVO;
import geomex.xeus.equipmgr.service.VmsVo;
import geomex.xeus.system.annotation.NoSession;

@Controller
@RequestMapping("/eocs")
public class EocsController {
	
	@Resource
	EocsService eocsSerivce;

	@NoSession
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(@RequestBody List<EocsVO> voList, Model model) throws Exception {
		
		//기존 데이터 삭제
		eocsSerivce.delete();
		
		int i = 0;
		//신규 데이터 입력
		for (EocsVO vo : voList) {
			vo.setMgrNo((i++)+"");
	        eocsSerivce.insert(vo); // 필요에 따라 bulk insert 로도 변경 가능
	    }
	    
	    model.addAttribute("result", "OK");
	}
	
   @NoSession
    @RequestMapping(value = "/getList.json")
    public void getList(@RequestParam HashMap<String, String> map, Model model) throws Exception {
        
        ArrayList<EocsVO> list = new ArrayList<EocsVO>();
        list = eocsSerivce.getList(map);
        model.addAttribute("result", list);
        model.addAttribute("map", map);
        model.addAttribute("count", eocsSerivce.getCount(map));
    }
   
   @NoSession
   @RequestMapping(value = "/updateEocs.json")
   public void updateEocs(@RequestParam HashMap<String, String> map, Model model) throws Exception {
       
       int result = eocsSerivce.update(map);
       
       if(result > 0) {
           model.addAttribute("result", "OK");
       } else {
           model.addAttribute("result", "FAIL");
       }
   }
	   
    @RequestMapping(value = "/getEditView.do")
    public String getSelectView(Model model, @ModelAttribute EocsVO vo) throws Exception {

    	//map.put("ownerId", (String) session.getAttribute("userId"));

    	model.addAttribute("result", eocsSerivce.getItem(vo));

    	return "/eocs/eocsView";

    }
}
