package geomex.xeus.sysmgr.web;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.map.service.SearchService;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.service.SymIconService;
import geomex.xeus.sysmgr.service.SymIconVo;
import geomex.xeus.util.code.ValidInspector;

/**
 * <pre>
 * 파일명 :  SymIconController.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-06-29      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2016. 12. 13.
 * @version : 1.0
 * @see
 */

@RequestMapping("/symIcon")
@Controller("symIconController")
public class SymIconController {

    private Logger logger = LoggerFactory.getLogger(SymIconController.class);

    @Resource(name = "symIconService")
    private SymIconService symIcon;

	@Resource(name = "searchService")
	private SearchService bjd;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "symIconService")
    private SymIconService symIconService;

	@Resource
	private ColumnInfoController col;

	@Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

    /**
     * CCTV 조회 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    /*@RequestMapping(value = "/getSearchView.do")
    public String getSearchView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("column", col.getList());

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());

    	model.addAttribute("result", cctv.getList(map));
    	model.addAttribute("count", cctv.getCount(map));

    	model.addAttribute("param", map);

    	return "/cctv/cctvSearchView";
    }*/

	/**
     * 심볼 아이콘 목록을 추가합니다.
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getSymIconList.json", method = RequestMethod.POST)
    public void addSymIcon(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", symIcon.getList(map));

    }

	/**
     * 심볼 아이콘 목록을 추가합니다.
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/addSymIcon.json", method = RequestMethod.POST)
    public void addSymIcon(Model model, HttpSession session, @ModelAttribute @Valid SymIconVo vo, BindingResult br) throws Exception {

        String msg = ValidInspector.findError(br);

        if("pass".equals(msg)){
            HashMap<String, String> map = new HashMap<String, String>();
            map.put("symGrp", vo.getSymGrp());
            map.put("gbnCd", vo.getGbnCd());
            map.put("iconTyp", vo.getIconTyp());

            if(symIconService.getCount(map) == 0){
                model.addAttribute("result", symIcon.add(vo));
            }else{
                model.addAttribute("error", "이미 등록되어 있는 건입니다.");
            }
        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 심볼 아이콘 목록을 수정합니다.
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/editSymIcon.json", method = RequestMethod.POST)
    public void editSymIcon(Model model, HttpSession session, @ModelAttribute @Valid SymIconVo vo, BindingResult br) throws Exception {

        String msg = ValidInspector.findError(br);

        if("pass".equals(msg)){
            model.addAttribute("result", symIcon.edit(vo));
        }else{
            model.addAttribute("error", msg);
        }

    }

	/**
	 * 심볼 아이콘 목록을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/delSymIcon.json", method = RequestMethod.POST)
	public void delSymIcon(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", symIcon.del(map));

	}

	/**
     * 아이콘을 시스템에서 삭제합니다.
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/delIcon.json", method = RequestMethod.POST)
    public void delIcon(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
        boolean workChk = false;
        HashMap<String, List<String>> param = null;
        List<String> list = new ArrayList<String>();

        if (map.get("delList") != null){
            param = new HashMap<String, List<String>>();
            String[] arr = map.get("delList").split("\\|\\|");
            for(int i=0; i<arr.length; i++){
                list.add(arr[i]);
            }
            param.put("fileList", list);
        }
        if(symIcon.chkDelList(param).size() == 0){
            try{
                String path = session.getServletContext().getRealPath("/resources/") + "sym\\" + map.get("subPath");
                for(int i=0; i<list.size(); i++){
                    File file = new File(path + "\\" + list.get(i));
                    if(file.exists()){
                        file.delete();
                    }
                }
                workChk = true;
            } catch(Exception e){}
        } else {
            model.addAttribute("error", "사용되고 있는 아이콘은 삭제할 수 없습니다.");
        }
        model.addAttribute("result", workChk);
    }

}
