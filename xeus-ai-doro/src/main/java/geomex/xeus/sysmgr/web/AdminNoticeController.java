package geomex.xeus.sysmgr.web;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.user.service.UserService;

/**
 * <pre>
 * 파일명 :  AuthController.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/adminNotice")
public class AdminNoticeController {

	@Resource(name = "userService")
    private UserService user;

    @RequestMapping(value = "/getView.do")
    public String getView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("user", user.getList(null));

    	return "/admin/adminNoticeView";
	}

}
