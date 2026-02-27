package geomex.xeus.tvius.web;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import org.springframework.web.bind.annotation.ResponseBody;

import geomex.xeus.equipmgr.service.CctvMapService;
import geomex.xeus.equipmgr.service.CctvModelService;
import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.equipmgr.service.CctvSymCmd;
import geomex.xeus.equipmgr.service.CctvUnregService;
import geomex.xeus.equipmgr.service.CctvVo;
import geomex.xeus.equipmgr.service.PatrolService;
import geomex.xeus.equipmgr.service.PatrolVo;
import geomex.xeus.eventmonitor.service.FavCctvService;
import geomex.xeus.eventmonitor.service.FavCctvVo;
import geomex.xeus.log.service.AssetLogService;
import geomex.xeus.log.service.AssetLogVo;
import geomex.xeus.map.service.SearchService;
import geomex.xeus.sysmgr.service.ImageService;
import geomex.xeus.sysmgr.service.ImageVo;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.ValidInspector;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

/**
 * <pre>
 * 파일명 :  PrbCarController.java
 * 설  명 :
 *   문제차량 관련 컨트롤러입니다.
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-06-28      이은규          최초 생성
 *
 * </pre>
 *
 * @since : 2018. 06. 28.
 * @version : 1.0
 * @see
 */

@RequestMapping("/prbcar")
@Controller("prbCarController")
public class PrbCarController {

    private Logger logger = LoggerFactory.getLogger(PrbCarController.class);

    /*@Resource(name = "cctvMapService")
    private CctvMapService cctvMapService;

    @Resource(name = "CctvService")
	private CctvService cctv;

    @Resource(name = "CctvUnregService")
    private CctvUnregService unreg;

    @Resource(name = "CctvModelService")
    private CctvModelService cctvModel;

    @Resource(name = "favCctvService")
    private FavCctvService favCctv;

    @Resource(name = "patrolService")
    private PatrolService patrol;

	@Resource(name = "imageService")
	private ImageService image;

	@Resource(name = "assetLogService")
    private AssetLogService assetLog;*/

	@Resource(name = "searchService")
	private SearchService bjd;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

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
    @RequestMapping(value = "/getPrbCarView.do")
    public String getPrbCarView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("column", col.getList());

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());

    	model.addAttribute("param", map);

    	return "/prbcar/prbCarView";
    }

}
