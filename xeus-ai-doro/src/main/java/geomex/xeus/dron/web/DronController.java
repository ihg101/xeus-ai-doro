package geomex.xeus.dron.web;

import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/dron")
public class DronController {

	/**
     * 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getView.do")
    public String getView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	return "/dron/view";
    }

}
