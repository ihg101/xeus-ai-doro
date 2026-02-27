package gmx.gis.sysmgr.web;

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

import gmx.gis.layer.service.GMT_LayerGroupService;
import gmx.gis.layer.service.GMT_LayerService;
//import gmx.gis.bigdata.service.BigDataAnalyDataService;
//import gmx.gis.eventmonitor.service.EventMngListService;
import gmx.gis.sysmgr.service.GMT_AuthGrpVo;
import gmx.gis.sysmgr.service.GMT_AuthService;
//import gmx.gis.sysmgr.service.LayerDescService;
import gmx.gis.util.code.GMT_ValidInspector;

/**
 * <pre>
 * 파일명 :  GMT_AuthController.java
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
@RequestMapping("/GMT_auth")
public class GMT_AuthController {

	@Autowired private GMT_LayerService lyrSvc;
	@Autowired private GMT_LayerGroupService lyrGrpSvc;
	@Autowired private GMT_AuthService service;
	@Autowired private GMT_ColumnController col;


//	@Resource(name = "bigDataAnalyDataService")
//    private BigDataAnalyDataService bigData;
//
//	@Resource(name = "layerDescService")
//    private LayerDescService layer;
//
//	@Resource(name = "eventMngListService")
//    private EventMngListService eventMngList;

	@Resource(name="txManager")
    PlatformTransactionManager transactionManager;

	/**
     * 권한 설정 뷰를 리턴합니다.
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
		model.addAttribute("result", service.getList(map));

		model.addAttribute("grpList", service.getGrpList(map));
		model.addAttribute("grpCount", service.getGrpCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/GMT/auth/authView";
	}

    /**
     * 레이어 권한 설정 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getLayerAuthView.do")
    public String getLayerAuthView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	map.remove("limit");
    	map.remove("offset");

    	//auth_list용 sort추가
		model.addAttribute("result", lyrGrpSvc.getListExceptTempLyrGrp(map));

		model.addAttribute("grpList", service.getGrpList(map));
		model.addAttribute("grpCount", service.getGrpCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/GMT/auth/layerAuthView";
	}

    /**
     * 레이어 그룹 관리 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return views
	 * @throws Exception
	 */
    @RequestMapping(value = "/getLayerGroupMngView.do")
    public String getLayerGroupMngView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	map.remove("limit");
    	map.remove("offset");

    	//auth_list용 sort추가
		model.addAttribute("result", lyrGrpSvc.getList(map));

//		model.addAttribute("grpList", service.getGrpList(map));
//		model.addAttribute("grpCount", service.getGrpCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/GMT/auth/layerGroupMngView";
	}


    /**
     * 레이어 권한 설정 뷰를 리턴합니다.
     *
	 * @param model
	 * @param session
	 * @return view
	 * @throws Exception
	 */
    @RequestMapping(value = "/getShareLayerView.do")
    public String getShareLayerView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	map.remove("limit");
    	map.remove("offset");

    	//auth_list용 sort추가
		model.addAttribute("result", lyrGrpSvc.getList(map));

		model.addAttribute("grpList", service.getGrpList(map));
		model.addAttribute("grpCount", service.getGrpCount(map));
		model.addAttribute("column", col.getList());
		model.addAttribute("map", map);

    	return "/GMT/auth/shareLayerView";
	}
    /**
     * NMS 레이어를 리턴합니다.
     *
     * @param model
     * @param session
     * @return view
     * @throws Exception
     */
//    @RequestMapping(value = "/nmsLayerList.json")
//    public void nmsLayerList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
//
//    	HashMap<String, String> nmsMap = new HashMap<String, String>();
//		nmsMap.put("isUse", "Y");
//		model.addAttribute("nmsList", layer.getList(nmsMap));
//
//    }

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
	public void editGrp(Model model, @ModelAttribute @Valid GMT_AuthGrpVo param, BindingResult br) throws Exception {

		String msg = GMT_ValidInspector.findError(br);

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
	 *  해당 그룹의 레이어리스트에 대한 권한을 허용한다.
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addAuthLayerList.json", method = RequestMethod.POST)
	public void addAuthLayerList(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {
		String []str = map.get("authList").split(",");
		for(int i=0; i<str.length; i++){
			map.put("tblId",str[i]);
			service.addAuthLayerList(map);
		}
	}

	 /**
	 * 해당 그룹의 레이어리스트에 대한 권한을 불허한다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/delAuthLayerList.json", method = RequestMethod.POST)
	public void delAuthLayerList(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {
		HashMap<String, String> param = new HashMap<String, String>();
		String []str = map.get("authList").split(",");
		String authGrpNo = map.get("authGrpNo");
		for(int i=0; i<str.length; i++){
			param.put("tblId",str[i]);
			param.put("authGrpNo",authGrpNo);
			service.delAuthLayerList(param);
		}

	}

	/**
	 * 해당 레이어 권한에  통플 탭 권한을 추가한다
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateAuthLayerByTabAuth.json", method = RequestMethod.POST)
	public void updateAuthLayerByTabAuth(Model model, HttpSession session, @RequestParam(required=true) HashMap<String, String> map) throws Exception {


		model.addAttribute("result", service.updateAuthLayerByTabAuth(map));
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
	 * 그룹 권한을 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addGrpAuth.json", method = RequestMethod.POST)
	public void addGrpAuth(Model model, @ModelAttribute @Valid GMT_AuthGrpVo param, BindingResult br) throws Exception {

		String[] ignoreField = {"authGrpNm"};

		String msg = GMT_ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("result", service.addGrpAuth(param));
		}else{
			model.addAttribute("error", msg);
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
	public void addGrp(Model model, @ModelAttribute @Valid GMT_AuthGrpVo param, BindingResult br) throws Exception {

		String msg = GMT_ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", service.addGrp(param));
		}else{
			model.addAttribute("error", msg);
		}

	}


}
