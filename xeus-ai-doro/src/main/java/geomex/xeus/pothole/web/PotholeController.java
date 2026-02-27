package geomex.xeus.pothole.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pothole")
public class PotholeController {
	
	@RequestMapping(value = "/getEvtListView.do")
    public String getEvtListView(Model model) throws Exception {

        return "/pothole/eventListView";
    }
}
