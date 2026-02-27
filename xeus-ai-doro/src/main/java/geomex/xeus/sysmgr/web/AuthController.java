package geomex.xeus.sysmgr.web;

import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.bigdata.service.BigDataAnalyDataService;
import geomex.xeus.sysmgr.service.AuthGrpVo;
import geomex.xeus.sysmgr.service.AuthService;
import geomex.xeus.sysmgr.service.LayerDescService;
import geomex.xeus.util.code.ValidInspector;
import gmx.gis.sysmgr.service.GMT_AuthService;

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
@RequestMapping("/auth")
public class AuthController {

	@Resource
	private ColumnInfoController col;

	@Resource(name = "authService")
	private AuthService service;

	@Resource(name = "bigDataAnalyDataService")
    private BigDataAnalyDataService bigData;

	@Resource(name = "layerDescService")
    private LayerDescService layer;

	@Autowired private GMT_AuthService GMTauth;

	@Resource(name="txManager")
    PlatformTransactionManager transactionManager;

	/**
     * 권할 설정 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getAuthView.do")
    public String getAuthView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	map.remove("limit");
    	map.remove("offset");

    	//auth_list용 sort추가

    	map.put("sortCol", "(SUBSTRING ( parent_auth_nm, '^[0-9]+' )) :: INT ");
    	map.put("sortTyp", "ASC");

    	map.put("sortCol2", "auth_order :: INT");
    	map.put("sortTyp2", "ASC");

		model.addAttribute("result", service.getList(map));

		map.remove("sortCol");
		map.remove("sortTyp");

		map.remove("sortCol2");
		map.remove("sortTyp2");


		model.addAttribute("grpList", service.getGrpList(map));
		model.addAttribute("grpCount", service.getGrpCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/auth/authList";
	}

    /**
     * NMS 레이어를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/nmsLayerList.json")
    public void nmsLayerList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	HashMap<String, String> nmsMap = new HashMap<String, String>();
		nmsMap.put("isUse", "Y");
		model.addAttribute("nmsList", layer.getList(nmsMap));

    }

    /**
     * 권한이 존재하는지 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/hasAuth.json")
    public void hasAuth(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	String userId = (String) session.getAttribute("userId");

    	if(userId == null){
    		model.addAttribute("result", false);
    	}else{
    		map.put("userId", userId);
    		model.addAttribute("result", service.hasAuth(map));
    	}

    }

    /**
     * 이벤트 권한이 존재하는지 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
    @RequestMapping(value = "/hasEvtAuth.json")
    public void hasEvtAuth(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	/*String authData = map.get("authData");

    	boolean result = false;

    	if("112".equals(authData)) map.put("evtCd", authData);
    	if("119".equals(authData)) map.put("evtCd", authData);
    	if("DSC".equals(authData)) map.put("evtCd", authData);

    	EventMngListVo vo = eventMngList.getItem(map);
    	if(vo != null){
    		if("Y".equals(vo.getUseYn())) result = true;
    	}

    	if(result){
    		String userId = (String) session.getAttribute("userId");

    		if(userId == null){
    			model.addAttribute("result", false);
    		}else{
    			map.put("userId", userId);
    			model.addAttribute("result", service.hasAuth(map));
    		}
    	}else{
    		model.addAttribute("result", false);
    	}*/

    	String userId = (String) session.getAttribute("userId");

		if(userId == null){
			model.addAttribute("result", false);
		}else{
			map.put("userId", userId);
			model.addAttribute("result", service.hasAuth(map));
		}

    }

	/**
     * 권한 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getCount.json", method = RequestMethod.POST)
    public void getCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getCount(map));

    }

    /**
	 * 권한 리스트를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getList.json", method = RequestMethod.POST)
	public void getList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getList(map));
		model.addAttribute("count", service.getCount(map));

	}

	/**
	 * 그룹 리스트를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getGrpList.json", method = RequestMethod.POST)
	public void getGrpList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getGrpList(map));
		model.addAttribute("count", service.getGrpCount(map));

	}

	/**
	 * 그룹 갯수를 조회합니다.
	 *
	 * @return json
	 * @throws Exception
	 */
	@RequestMapping(value = "/getGrpCount.json", method = RequestMethod.POST)
	public void getGrpCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getGrpCount(map));

	}

	/**
	 * 권한 그룹 리스트를 가져옵니다.
	 *
	 * @param req
	 * @param res
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAuthGrpList.json", method = RequestMethod.POST)
	public void getAuthGrpList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.getAuthGrpList(map));
		model.addAttribute("count", service.getAuthGrpCount(map));

	}

	/**
     * 권한 그룹 갯수를 조회합니다.
     *
     * @return json
     * @throws Exception
     */
    @RequestMapping(value = "/getAuthGrpCount.json", method = RequestMethod.POST)
    public void getAuthGrpCount(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("count", service.getAuthGrpCount(map));

    }

	/**
	 * 그룹명을 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editGrp.json", method = RequestMethod.POST)
	public void editGrp(Model model, @ModelAttribute @Valid AuthGrpVo param, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.editGrp(param));
		}else{
			model.addAttribute("error", msg);
		}

	}

    /**
	 * 그룹을 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/delGrp.json", method = RequestMethod.POST)
	public void delGrp(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {

		TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

		String key = map.get("authGrpNo");
		if(key == null || "".equals(key)){
			model.addAttribute("error", "그룹ID는 필수사항입니다.");
		}else{
			try {
				service.delGrpAuth(map);
				GMTauth.delAuthLayerList(map);
				model.addAttribute("result", service.delGrp(map));
				transactionManager.commit(txStatus);

			} catch (Exception e) {
				transactionManager.rollback(txStatus);
				model.addAttribute("error", "롤백처리 되었습니다.\n입력 데이터를 다시한번 확인해 주세요.");
				e.printStackTrace();
			}
		}
	}

	/**
	 * 그룹 권한을 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/delGrpAuth.json", method = RequestMethod.POST)
	public void delGrpAuth(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {

		String key = map.get("authGrpNo");
		if(key == null || "".equals(key)){
			model.addAttribute("error", "그룹ID는 필수사항입니다.");
		}else{
			model.addAttribute("result", service.delGrpAuth(map));
		}

	}

	/**
	 * 그룹을 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addGrp.json", method = RequestMethod.POST)
	public void addGrp(Model model, @ModelAttribute @Valid AuthGrpVo param, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.addGrp(param));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 그룹 권한을 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addGrpAuth.json", method = RequestMethod.POST)
	public void addGrpAuth(Model model, @ModelAttribute @Valid AuthGrpVo param, BindingResult br) throws Exception {

		String[] ignoreField = {"authGrpNm"};

		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("result", service.addGrpAuth(param));
		}else{
			model.addAttribute("error", msg);
		}

	}

}
