package geomex.xeus.equipmgr.web;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import geomex.xeus.equipmgr.service.AcsryService;
import geomex.xeus.equipmgr.service.AcsryVo;
import geomex.xeus.equipmgr.service.CableService;
import geomex.xeus.equipmgr.service.CableVo;
import geomex.xeus.equipmgr.service.CctvModelService;
import geomex.xeus.equipmgr.service.CctvModelVo;
import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.equipmgr.service.CctvUnregService;
import geomex.xeus.equipmgr.service.CctvVo;
import geomex.xeus.equipmgr.service.HistoryService;
import geomex.xeus.equipmgr.service.HistoryVo;
import geomex.xeus.equipmgr.service.InfraService;
import geomex.xeus.equipmgr.service.InfraVo;
import geomex.xeus.equipmgr.service.SiteHistService;
import geomex.xeus.equipmgr.service.SiteHistVo;
import geomex.xeus.equipmgr.service.SiteService;
import geomex.xeus.equipmgr.service.SiteVo;
import geomex.xeus.equipmgr.service.StatusService;
import geomex.xeus.equipmgr.service.StatusVo;
import geomex.xeus.equipmgr.service.VmsService;
import geomex.xeus.excel.service.ExcelUtils;
import geomex.xeus.map.service.GeometryService;
import geomex.xeus.map.service.SearchService;
import geomex.xeus.smartcity.service.EventWebSocketService;
import geomex.xeus.sysmgr.service.ImageService;
import geomex.xeus.sysmgr.service.ImageVo;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.service.SymIconService;
import geomex.xeus.sysmgr.service.SymIconVo;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.user.service.UserService;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.StrUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.Utils;
import geomex.xeus.util.code.ValidInspector;

/**
 * <pre>
 * 파일명 :  SiteController.java
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
 * @since   :  2017. 8. 28.
 * @version :  1.0
 * @see
 */
@Controller
@RequestMapping("/nms")
public class NmsController {

	@Resource(name = "CctvService")
	private CctvService cctv;

	@Resource(name = "CctvModelService")
    private CctvModelService cctvModel;

	@Resource(name = "CctvUnregService")
	private CctvUnregService unreg;

	@Resource(name = "vmsService")
    private VmsService vms;

	@Resource(name = "cableService")
	private CableService cable;

	@Resource(name = "acsryService")
	private AcsryService acsry;

	@Resource(name = "infraService")
	private InfraService infra;

	@Resource(name = "siteService")
	private SiteService site;

	@Resource(name = "siteHistService")
	private SiteHistService siteHist;

	@Resource(name = "statusService")
	private StatusService status;

	@Resource(name = "imageService")
	private ImageService image;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "geometryService")
	private GeometryService geom;

	@Resource(name = "historyService")
	private HistoryService history;

	@Resource(name = "searchService")
	private SearchService bjd;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource(name = "userService")
	private UserService user;

	@Resource(name = "eventWebSocketService")
	private EventWebSocketService socket;

	@Resource(name = "symIconService")
    private SymIconService symIcon;

	@Resource(name = "sysPropService")
    private SysPropService param;

	@Resource
	private ColumnInfoController col;

	@Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

	@Resource
	private Validator validator;

	private String sysUploadPath;

	// CCTV 엑셀로 관리 버튼 여부
	private String nmsCctvExcelYn;

	@PostConstruct
	public void initUploadPath() throws Exception {

        HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        this.sysUploadPath = sysMap.get("sys.upload_path");
        this.nmsCctvExcelYn = sysMap.get("nms.cctv.excel.yn");
    }

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
		/*binder.registerCustomEditor(MultipartFile.class, new PropertyEditorSupport() {
			@Override
			public void setAsText(String text) {
				setValue(null);
			}
		});*/
	}

	private String cctvListReqUrl;

    @PostConstruct
    public void initIt() throws Exception {

    	HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        this.cctvListReqUrl = sysMap.get("cctv.list.req.url");

    }

	/**
	 * 장비관리(NMS) 모니터링 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNmsMonitoringView.do")
	public String getNmsMonitoringView(Model model) throws Exception {

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("column", col.getList());

		model.addAttribute("result", status.getList(null));
		model.addAttribute("count", status.getCount(null));

		return "/nms/nmsMonitoringView";
	}

	/**
	 * 장비관리(NMS) 모니터링 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDustView.do")
	public String getDustView(Model model) throws Exception {

		return "/nms/dustView";
	}

	/**
	 * 장비관리(NMS) 모니터링 리스트를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getStatusList.json", method = RequestMethod.POST)
	public void getStatusList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", status.getList(map));

	}

	/**
	 * 장비에 따라 실제 위치값을 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getGeometryLocation.json", method = RequestMethod.POST)
    public void getGeometryLocation(Model model, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> param = new HashMap<String, String>();
		param.put("col", "mgr_no");
		param.put("val", val);

		if("CTV".equals(val.substring(0, 3))) param.put("tbl", "asset_cctv");
		if("INF".equals(val.substring(0, 3))) param.put("tbl", "asset_infra");
		if("PUM".equals(val.substring(0, 3))) param.put("tbl", "asset_pump");
		if("RNF".equals(val.substring(0, 3))) param.put("tbl", "asset_rainfall");
		/*if("SIT".equals(val.substring(0, 3))) param.put("tbl", "asset_site");
		if("ACS".equals(val.substring(0, 3))) param.put("tbl", "asset_acsry");*/

		model.addAttribute("result", geom.getGeometry(param));
	}

	/**
	 * 요청점검을 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/addHistory.json", method = RequestMethod.POST)
	public void addHistory(Model model, HttpSession session, @ModelAttribute @Valid HistoryVo vo, BindingResult br) throws Exception {

		vo.setRegUserId((String) session.getAttribute("userId"));

		String[] ignoreField = {""};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("historyVo", null);
			model.addAttribute("result", history.add(vo));
			socket.broadcast("CCTV-Reload");
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 점검 단건의 내용을 수정합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/editHistoryAttr.json", method = RequestMethod.POST)
	public void editHistoryAttr(Model model, HttpSession session, @ModelAttribute @Valid HistoryVo vo, BindingResult br) throws Exception {

		vo.setRegUserId((String) session.getAttribute("userId"));

		String[] ignoreField = {""};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("historyVo", null);
			model.addAttribute("result", history.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 점검 단건을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/delHistory.json", method = RequestMethod.POST)
	public void delHistory(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", history.del(map));
	}

	/**
	 * 점검요청을 수정합니다.<br>
	 * 등록된 mgr_no 의 모든 리스트를 삭제하고 다시 저장합니다.<br><br>
	 *
	 * <b>정기점검 등록 기능 등에 사용됩니다.</b><br><br>
	 * <b style="color: red;">점검 내용을 수정하려면 editHistoryAttr 메소드를 사용해야 합니다.</b>
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = {"/editHistory.json", "/addHistoryList.json"}, method = RequestMethod.POST)
	public void editHistory(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		String[] full_url = req.getRequestURI().split("/");
    	String url = full_url[full_url.length - 1];

    	if("addHistoryList.json".equals(url)){
    		map.put("mode", "add");
    	}else if("editHistory.json".equals(url)){
    		map.put("mode", "edit");
    	}

		String val = map.get("val");
		String regDat = map.get("regDat");
		String chkNm = map.get("chkNm");
		String chkGbnCd = map.get("chkGbnCd");
		String chkStatCd = map.get("chkStatCd");
		String[] faMgrNo = null;
		if(val != null && !"".equals(val)){
			faMgrNo = val.split(",");
		}

		if(faMgrNo == null){
			model.addAttribute("result", history.del(map));
		}else if(chkNm.length() > 50){
			model.addAttribute("error", "점검명은 최대 50자 까지 입력하실 수 있습니다.");
		}else{
			ArrayList<HistoryVo> list = new ArrayList<HistoryVo>();
			for(int i=0; i<faMgrNo.length; i++){
				HistoryVo vo = new HistoryVo();
				vo.setRegUserId((String) session.getAttribute("userId"));
				vo.setFaMgrNo(faMgrNo[i]);
				vo.setChkGbnCd(chkGbnCd);
				vo.setChkStatCd(chkStatCd);
				vo.setRegDat(regDat);
				vo.setChkNm(chkNm);

				list.add(vo);
			}

			TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

			try {
				model.addAttribute("result", history.addTransaction(list, map));
				transactionManager.commit(txStatus);
			} catch (Exception e) {
				transactionManager.rollback(txStatus);
				model.addAttribute("error", "롤백처리 되었습니다.\n잠시 후 다시 시도하시거나, 관리자에게 문의해주세요.");
				e.printStackTrace();
			}
		}

	}

	/**
	 * 정기점검 리스트를 조회합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "getChkNmList.json", method = RequestMethod.POST)
	public void getChkNmList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", history.getList(map));

	}

	/**
	 * 요청등록(NMS) 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCallRegView.do")
	public String getCallRegView(Model model) throws Exception {

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/callRegView";
	}

	/**
	 * 정기점검등록(NMS) 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getPeriodicRegView.do")
	public String getPeriodicRegView(Model model) throws Exception {

		model.addAttribute("hist", history.getChkNmList());
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/periodicRegView";
	}

	/**
	 * 시설물을 검색합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "getFacilitySearch.json", method = RequestMethod.POST)
	public void getFacilitySearch(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		String objType = map.get("objType");
		String objName = map.get("objName");
		if(objName != null && !"".equals(objName)){
			map.put("cctvNm", objName);
			map.put("facilityNm", objName);
		}

		if("ALL".equals(objType)){

			model.addAttribute("cctvList", cctv.getList(map));
			model.addAttribute("infraList", infra.getList(map));

		}else if("CTV".equals(objType)){

			model.addAttribute("cctvList", cctv.getList(map));

		}else if("INF".equals(objType)){

			model.addAttribute("infraList", infra.getList(map));

		}

	}

	/**
	 * 점검이력(NMS) 검색 창 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCallListParentView.do")
	public String getCallListParentView(Model model) throws Exception {

		model.addAttribute("column", col.getList());
		model.addAttribute("hist", history.getChkNmList());
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/checkListParentView";
	}

	/**
	 * 점검이력(NMS) 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getHistorySearchView.do", method = RequestMethod.POST)
	public String getHistorySearchView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("column", col.getList());
		model.addAttribute("result", history.getList(map));
		model.addAttribute("count", history.getCount(map));
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/checkList/searchResultView";
	}

	/**
	 * 점검이력(NMS) 상세이력 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getHistoryDetailView.do", method = RequestMethod.POST)
	public String getHistoryDetailView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		String faMgrNo = map.get("faMgrNo");
		if(faMgrNo != null) faMgrNo = faMgrNo.substring(0, 3);

		HashMap<String, String> voParam = new HashMap<String, String>();
		voParam.put("mgrNo", map.get("faMgrNo"));
		if("CTV".equals(faMgrNo)) model.addAttribute("cctv", cctv.getItem(voParam));
		if("INF".equals(faMgrNo)) model.addAttribute("infra", infra.getItem(voParam));

		ArrayList<ImageVo> img = image.getList(map);
		if(img != null && img.size() > 0) model.addAttribute("img", img);

		model.addAttribute("column", col.getList());
		model.addAttribute("result", history.getItem(map));
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/checkList/detailView";
	}

	/**
	 * 점검이력(NMS) 취소요청관리 뷰를 리턴합니다.<br><br>
	 *
	 * 취소요청 처리코드(cnclRsltCd) 파라미터가 없을 경우,<br>
	 * 전체(cnclAll) 라는 임시 파라미터를 생성하여 사용합니다.<br>
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCancelView.do", method = RequestMethod.POST)
	public String getCancelView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		String cnclRsltCd = map.get("cnclRsltCd");
		if(cnclRsltCd == null || "".equals(cnclRsltCd)){
			map.put("cnclAll", "all");
		}

		model.addAttribute("result", history.getList(map));
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("map", map);

		map.remove("cnclAll");

		return "/nms/checkList/cancelView";
	}


	/**
	 * 사이트 관리 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSiteManageView.do", method = RequestMethod.POST)
	public String getSiteView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("column", col.getList());

		model.addAttribute("result", site.getList(map));
		model.addAttribute("count", site.getCount(map));
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("map", map);

		return "/nms/siteParentView";
	}

	/**
	 * 사이트 신규추가 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSiteRegView.do", method = RequestMethod.POST)
	public String getSiteRegView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("map", map);

		return "/nms/siteRegView";
	}

	/**
	 * 사이트 관리 상세보기 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSiteDetailView.do", method = RequestMethod.POST)
	public String getSiteDetailView(Model model, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrNo", val);

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		SiteVo vo = site.getItem(map);

		if(vo.getRepMgrNo() != null && !"".equals(vo.getRepMgrNo())){
			HashMap<String, String> cctvParam = new HashMap<String, String>();
			cctvParam.put("mgrNo", vo.getRepMgrNo());
			CctvVo cctvVo = cctv.getItem(cctvParam);
			model.addAttribute("cctv", cctvVo);
		}

		model.addAttribute("result", vo);
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("map", map);

		return "/nms/site/detailView";
	}

	/**
	 * 사이트 관리 상세보기 > 현장사진 탭 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getImageTabView.do", method = RequestMethod.POST)
	public String getImageTabView(Model model, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("refMgrNo", val);

		ArrayList<ImageVo> img = image.getList(map);
		if(img != null && img.size() > 0) model.addAttribute("img", img);

		map.put("mgrNo", val);
		model.addAttribute("result", site.getItem(map));

		return "/nms/site/imageTabView";
	}

	/**
	 * 사이트 관리 상세보기 > 카메라 탭 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCctvTabView.do", method = RequestMethod.POST)
	public String getCctvTabView(Model model, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("siteMgrNo", val);

		ArrayList<CctvVo> cctvList = cctv.getList(map);

		ArrayList<ArrayList<ImageVo>> img = null;
		if(cctvList.size() > 0){
			img = new ArrayList<ArrayList<ImageVo>>();

			for(int i=0; i<cctvList.size(); i++){
				map.put("refMgrNo", cctvList.get(i).getMgrNo());
				img.add(image.getList(map));
			}

		}
		if(img != null && img.size() > 0) model.addAttribute("img", img);

		map.put("mgrNo", val);
		model.addAttribute("result", site.getItem(map));
		model.addAttribute("cctv", cctvList);
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/site/cctvTabView";
	}

	/**
	 * 사이트 관리 상세보기 > 부속시설 탭 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAcsryTabView.do", method = RequestMethod.POST)
	public String getAcsryTabView(Model model, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("siteMgrNo", val);

		model.addAttribute("result", acsry.getList(map));
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("map", map);

		return "/nms/site/acsryTabView";
	}

	/**
	 * 사이트 관리 상세보기 > 관리이력 탭 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSiteHistTabView.do", method = RequestMethod.POST)
	public String getSiteHistTabView(Model model, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrNo", val);

		model.addAttribute("result", siteHist.getList(map));
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("map", map);

		return "/nms/site/siteHistTabView";
	}

	/**
	 * CCTV 검색 결과를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/getCctvList.json", "getCctvItem.json", "getCctvUnregItem.json"}, method = RequestMethod.POST)
	public void getCctvList(HttpServletRequest req, Model model, @RequestParam HashMap<String, String> map) throws Exception {

		String[] full_url = req.getRequestURI().split("/");
    	String url = full_url[full_url.length - 1];

    	if("getCctvList.json".equals(url)){
    		model.addAttribute("result", cctv.getList(map));
    	}else if("getCctvItem.json".equals(url)){
    		model.addAttribute("result", cctv.getItem(map));
    	}else if("getCctvUnregItem.json".equals(url)){
    		model.addAttribute("result", unreg.getItem(map));
    	}

	}

	/**
	 * 사이트 단건을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/delSite.json", method = RequestMethod.POST)
	public void delSite(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrNo", val);

		model.addAttribute("result", site.del(map));
	}

	/**
	 * 사이트에 속한 CCTV 단건을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/delSiteInnerCctv.json", method = RequestMethod.POST)
	public void delSiteInnerCctv(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		CctvVo vo = new CctvVo();
		vo.setMgrNo(val);
		vo.setSiteMgrNo("");

		model.addAttribute("result", cctv.edit(vo));
	}

	/**
	 * 사이트 단건의 내용을 수정합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/editSite.json", method = RequestMethod.POST)
	public void editSite(Model model, HttpSession session, @ModelAttribute @Valid SiteVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {"mgrNo", "orgMgrNo", "siteNm"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("siteVo", null);
			model.addAttribute("result", site.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}
	}

	/**
	 * 사이트 내의 CCTV를 등록합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/editSiteCctv.json", method = RequestMethod.POST)
	public void editCctv(Model model, HttpSession session, @ModelAttribute CctvVo vo) throws Exception {

		model.addAttribute("cctvVo", null);
		model.addAttribute("result", cctv.edit(vo));
	}

	/**
	 * 부속시설을 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "addAcsry.json", method = RequestMethod.POST)
	public void addAcsry(Model model, HttpSession session, @ModelAttribute @Valid AcsryVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {"mgrNo"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("acsryVo", null);
			model.addAttribute("result", acsry.add(vo));

			HashMap<String, String> map = new HashMap<String, String>();
			map.put("orgMgrNo", vo.getOrgMgrNo());
			map.put("siteMgrNo", vo.getSiteMgrNo());
			map.put("instDat", vo.getInstDat());
			map.put("fclGbnCd", vo.getFclGbnCd());
			map.put("atchdFclNm", vo.getAtchdFclNm());
			map.put("makerNm", vo.getMakerNm());
			map.put("prdtSpec", vo.getPrdtSpec());
			map.put("rmark", vo.getRmark());

			map.put("sortCol", "mgr_no");
			map.put("sortTyp", "desc");
			map.put("limit", "1");
			map.put("offset", "0");

			ArrayList<AcsryVo> acry = acsry.getList(map);
			if(acry != null && acry.size() == 1) model.addAttribute("mgrNo", acry.get(0).getMgrNo());
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 부속시설을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "delAcsry.json", method = RequestMethod.POST)
	public void delAcsry(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrNo", val);

		model.addAttribute("result", acsry.del(map));

	}

	/**
	 * 사이트를 신규 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "addSite.json", method = RequestMethod.POST)
	public void addSite(Model model, HttpSession session, @ModelAttribute @Valid SiteVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {"mgrNo"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("siteVo", null);
			model.addAttribute("result", site.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 관리이력을 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "addSiteHist.json", method = RequestMethod.POST)
	public void addSiteHist(Model model, HttpSession session, @ModelAttribute @Valid SiteHistVo vo, BindingResult br) throws Exception {

		vo.setWriterId((String) session.getAttribute("userId"));

		String[] ignoreField = {"mgrNo"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("siteHistVo", null);
			model.addAttribute("result", siteHist.add(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 관리이력을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "delSiteHist.json", method = RequestMethod.POST)
	public void delSiteHist(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrSeq", val);

		model.addAttribute("result", siteHist.del(map));

	}

	/**
	 * 기반시설 > 범례 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getInfraView.do", method = RequestMethod.POST)
	public String getInfraView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		return "/nms/infraLegendView";

	}

	/**
	 * 기반시설 검색 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getInfraSearchView.do")
	public String getInfraSearchView(Model model) throws Exception {

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("nmsCctvExcelYn", this.nmsCctvExcelYn);

		return "/nms/infra/searchView";
	}

	/**
	 * 기반시설전용 심볼 목록을 리턴합니다.
	 *
	 * @param dirPath - 심볼경로
	 * @return
	 */
	private ArrayList<String> getInfraSymbolList(String dirPath) {
		ArrayList<String> symList = new ArrayList<String>();

		File dir = new File(dirPath);
		if(dir.isDirectory()){
			File[] files = dir.listFiles();
			for(int i=0; i<files.length; i++){
				symList.add(files[i].getName());
			}
		}

		return symList;
	}

	/**
	 * 기반시설의 주제도 목록을 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "getInfraTheme.json", method = RequestMethod.POST)
	public void getInfraTheme(Model model, HttpSession session) throws Exception {

		/*ArrayList<InfraVo> list = infra.getInfraTheme(null);
		ArrayList<String> symList = getInfraSymbolList(session.getServletContext().getRealPath("/resources/sym/nms/"));

		HashMap<String, String> theme = new HashMap<String, String>();
		for(int i=0; i<list.size(); i++){
			for(int l=0; l<symList.size(); l++){
				if(symList.get(l).replace(".png", "").equals(list.get(i).getSymCd())){
					theme.put(list.get(i).getSymCd(), symList.get(l));
					break;
				}
			}
		}

		model.addAttribute("result", theme);*/

	    HashMap<String, String> map = new HashMap<String, String>();
	    map.put("symGrp", "nms");
        ArrayList<SymIconVo> symList = symIcon.getList(map);

        HashMap<String, String> theme = new HashMap<String, String>();
        for(int i=0; i<symList.size(); i++){
            theme.put(symList.get(i).getGbnCd(), symList.get(i).getFileNm());
        }

        model.addAttribute("result", theme);

	}

	/**
	 * 기반시설 신규등록 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getInfraMngView.do")
	public String getInfraMngView(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		if(map.get("mgrNo") != null && !"".equals(map.get("mgrNo"))){
			model.addAttribute("vo", infra.getItem(map));

			map.put("refMgrNo", map.get("mgrNo"));

			ArrayList<ImageVo> img = image.getList(map);
			if(img != null && img.size() > 0) model.addAttribute("img", img);
		}

		ArrayList<String> symList = getInfraSymbolList(session.getServletContext().getRealPath("/resources/sym/nms/"));

		//model.addAttribute("site", site.getList(null));
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("sym", symList);
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/infra/infraMngView";
	}

	/**
	 * 기반시설을 검색합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getInfra.json")
	public void getInfra(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", infra.getList(map));

	}

	/**
	 * 기반시설 신규등록 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getInfraAddView.do")
	public String getInfraAddView(Model model, HttpSession session) throws Exception {

		ArrayList<String> symList = getInfraSymbolList(session.getServletContext().getRealPath("/resources/sym/nms/"));

		//model.addAttribute("site", site.getList(null));
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("sym", symList);
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/infra/addView";
	}

	/**
	 * 엑셀로 관리하기 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getManagementExcelView.do")
	public String getManagementExcelView(Model model, HttpSession session) throws Exception {

		ArrayList<String> symList = getInfraSymbolList(session.getServletContext().getRealPath("/resources/sym/nms/"));

		//model.addAttribute("site", site.getList(null));
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("sym", symList);
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/infra/managementExcel";
	}

	/*
	 * 엑셀 일괄 등록 이벤트입니다.
	 *
	 */
	@RequestMapping(value = "/addCctvInstallExcel.json", method = RequestMethod.POST)
    public void addCctvInstallExcel(Model model, HttpSession session, @RequestPart("file") MultipartFile file) {
        if (file == null) {
            model.addAttribute("error", "파일이 선택되지 않았습니다.");
            return;
        }
        if(!ExcelUtils.getFileExt(file.getOriginalFilename()).equals("xlsx")){
            model.addAttribute("error", "xlsx 엑셀 파일만 업로드 할 수 있습니다.");
            return;
        }
        CctvVo vo = null;
        try {
            String userId = (String) session.getAttribute("userId");
            String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();

            String path = sysUploadPath + "cctvInstall" + "/" + userId;

            File chkDir = new File(path);
            if (!chkDir.isDirectory()) {
                try {
                    chkDir.mkdirs();
                } catch (Exception e) {}
            }

            String fullPath = path + "/" + realFileNm;
            File xlx = new File(fullPath);
            file.transferTo(xlx);

            FileInputStream fis = new FileInputStream(xlx);
            XSSFWorkbook workbook = new XSSFWorkbook(fis);

            if(workbook==null || workbook.getNumberOfSheets()<=0) {
                System.err.println("엑셀에 sheet가 존재하지 않습니다.");
                workbook.close();
                throw new NullPointerException("Data is null Or Sheet size is 0");
            }

            XSSFSheet sheet = workbook.getSheetAt(0); // 해당 엑셀파일의 시트(Sheet) 수
            XSSFRow row;

            CodeConvertor cde = new CodeConvertor(code.getCdeList());

            ArrayList<CctvVo> rowData = new ArrayList<CctvVo>();

            int readIdx = 0;
            int prevCount = 0; //삭제된 CCTV 갯수
            int successCount = 0; //새로 등록된 CCTV 갯수

            for ( int i = 0; i < sheet.getLastRowNum(); i++ ) {
                readIdx = i + 1;

                vo = setColToVo(sheet.getRow(readIdx), cde, readIdx);
                rowData.add(vo);
//                if(vo.getPortNum() != null || !"".equals(vo.getPortNum())) {
//                    rowData.add(vo);
//                }
            }

            TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());
            try {
                prevCount = cctv.getCount(null);
                cctv.delAll(null);
                cctv.addAll(rowData);
                successCount = cctv.getCount(null);
                transactionManager.commit(txStatus);
                model.addAttribute("result", true);
                model.addAttribute("prevCount", prevCount);
                model.addAttribute("successCount", successCount);
            } catch (Exception e) {
                transactionManager.rollback(txStatus);
                model.addAttribute("error", e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            e.printStackTrace();
        } finally {

        }

    }

	/**
	 * 엑셀로 CCTV정보를 내보냅니다.
	 *
	 *
	 */
	@RequestMapping(value = "/getCctvDataExcel.do")
    public void getCctvDataExcel(HttpServletResponse res, @RequestParam HashMap<String, String> map) throws Exception {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Sheet1");
        map.put("sortCol", "mgr_no");
        map.put("sortTyp", "ASC");

        /* 시트 열 크기 설정 */
        //sheet.setColumnWidth(0, 5000); // 관리번호
        sheet.setColumnWidth(0, 12000); // CCTV명
        sheet.setColumnWidth(1, 5000); // 설치목적
        //sheet.setColumnWidth(3, 3000); // 시군구
        sheet.setColumnWidth(2, 6000); // 접속 디바이스 번호
        sheet.setColumnWidth(3, 4000); // 접속 채널번호
        sheet.setColumnWidth(4, 3000); // 사용여부
        sheet.setColumnWidth(5, 3000); // 회전여부
        sheet.setColumnWidth(6, 3000); // 조명여부
        sheet.setColumnWidth(7, 3000); // 적외선여부
        sheet.setColumnWidth(8, 3000); // 틸트여부
        sheet.setColumnWidth(9, 3000); // 줌여부
        sheet.setColumnWidth(10, 3000); // 음성지원여부
        sheet.setColumnWidth(11, 3000); // 투어링여부
        sheet.setColumnWidth(12, 3000); // ip
        sheet.setColumnWidth(13, 3000); // port
        sheet.setColumnWidth(14, 2500); // 계정
        sheet.setColumnWidth(15, 6000); // 암호
        sheet.setColumnWidth(16, 6000); // 경도
        sheet.setColumnWidth(17, 3000); // 위도
        sheet.setColumnWidth(18, 3000); // 촬영각도
        sheet.setColumnWidth(19, 3000); // 위치설명
        sheet.setColumnWidth(20, 3000); // 설치일자
        sheet.setColumnWidth(21, 3000); // 사업년도
        sheet.setColumnWidth(22, 3000); // 사업명
        sheet.setColumnWidth(23, 3000); // 비고

        /*
         * 시트 스타일을 설정한다.
         */
        /* 헤더 셀 스타일 설정 */
        CellStyle headerStyle = workbook.createCellStyle();
        // 테두리

        headerStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        headerStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        headerStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        headerStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        //배경색
        headerStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
        headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        // 정렬
        headerStyle.setAlignment(CellStyle.ALIGN_CENTER); // 가운데 정렬
        headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER); // 높이 가운데 정렬
        // 폰트
        Font headerFont = workbook.createFont();
        headerFont.setBoldweight(Font.BOLDWEIGHT_BOLD); //볼드 (굵게)

        /* 일반 셀 스타일 설정 */
        CellStyle commonStyle = workbook.createCellStyle();
        commonStyle.setAlignment(CellStyle.ALIGN_CENTER); // 가운데 정렬
        commonStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER); // 높이 가운데 정렬

        try {

            //파일명
            String fileNm = "CCTV데이터다운로드" + "_" + DateUtil.getStrSec() + ".xlsx";
            res.setContentType("application/vnd.ms-excel");
            res.setHeader("Content-Disposition", "attachment;filename=" + new String(fileNm.getBytes("UTF-8"), "ISO-8859-1"));

            //데이터 요청
            ArrayList<CctvVo> list = cctv.getList(map);

            //Code
            CodeConvertor cde = new CodeConvertor(code.getCdeList());

            //col nm 생성
            XSSFRow row = sheet.createRow(0);
            XSSFCell col = null;

            String[] colNm = {
                    "CCTV명", "설치목적", "접속디바이스번호", "채널번호",
                    "사용여부", "회전여부", "조명여부", "적외선여부", "틸트여부", "줌여부", "음성지원여부", "투어링여부",
                    "IP주소", "Port번호", "계정", "암호", "경도", "위도", "촬영각도",
                    "위치설명", "설치일자", "사업년도", "사업명", "비고"
                    };
            for(int h=0; h<colNm.length; h++){
                col = row.createCell(h);
                col.setCellValue(colNm[h]);
                col.setCellStyle(headerStyle);
            }

            //데이터 입력
            for(int i=0; i<list.size(); i++){
                int index = i +1;

                String gbnNm = cde.convertCodeToName("C14", list.get(i).getGbnCd());
                String ipAddr = StrUtil.chkNull(list.get(i).getIpAddr());

                if(!"".equals(ipAddr)) {
                    ipAddr = ipAddr.trim();
                }

                row = sheet.createRow(index);

               /* col = row.createCell(0);
                col.setCellValue(StrUtil.chkNull(list.get(i).getMgrNo()));*/
                col = row.createCell(0);
                col.setCellValue(StrUtil.chkNull(list.get(i).getCctvNm()));
                col = row.createCell(1);
                col.setCellValue(StrUtil.chkNull(list.get(i).getGbnNm()));
                /*col = row.createCell(3);
                col.setCellValue(StrUtil.chkNull(list.get(i).getSigNm()));*/
                col = row.createCell(2);
                col.setCellValue(StrUtil.chkNull(list.get(i).getDeviceId()));
                col = row.createCell(3);
                col.setCellValue(StrUtil.chkNull(list.get(i).getChnlNo()));
                col = row.createCell(4);
                col.setCellValue(StrUtil.chkNull(list.get(i).getUseYn()));
                col = row.createCell(5);
                col.setCellValue(StrUtil.chkNull(list.get(i).getPanYn()));
                col = row.createCell(6);
                col.setCellValue(StrUtil.chkNull(list.get(i).getLightYn()));
                col = row.createCell(7);
                col.setCellValue(StrUtil.chkNull(list.get(i).getInfrdYn()));
                col = row.createCell(8);
                col.setCellValue(StrUtil.chkNull(list.get(i).getTiltYn()));
                col = row.createCell(9);
                col.setCellValue(StrUtil.chkNull(list.get(i).getZoomYn()));
                col = row.createCell(10);
                col.setCellValue(StrUtil.chkNull(list.get(i).getTalkYn()));
                col = row.createCell(11);
                col.setCellValue(StrUtil.chkNull(list.get(i).getTourYn()));
                col = row.createCell(12);
                col.setCellValue(StrUtil.chkNull(list.get(i).getIpAddr()));
                col = row.createCell(13);
                col.setCellValue(StrUtil.chkNull(list.get(i).getPortNum()));
                col = row.createCell(14);
                col.setCellValue(StrUtil.chkNull(list.get(i).getConId()));
                col = row.createCell(15);
                col.setCellValue(StrUtil.chkNull(list.get(i).getConPwd()));
                col = row.createCell(16);
                col.setCellValue(StrUtil.chkNull(list.get(i).getLng()));
                col = row.createCell(17);
                col.setCellValue(StrUtil.chkNull(list.get(i).getLat()));
                col = row.createCell(18);
                col.setCellValue(StrUtil.chkNull(list.get(i).getAngle()));
                col = row.createCell(19);
                col.setCellValue(StrUtil.chkNull(list.get(i).getLocDesc()));
                col = row.createCell(20);
                col.setCellValue(StrUtil.chkNull(list.get(i).getInstDat()));
                col = row.createCell(21);
                col.setCellValue(StrUtil.chkNull(list.get(i).getConstYear()));
                col = row.createCell(22);
                col.setCellValue(StrUtil.chkNull(list.get(i).getConstNm()));
                col = row.createCell(23);
                col.setCellValue(StrUtil.chkNull(list.get(i).getRmark()));


                for(int k=0; k<colNm.length; k++) {
                    col = row.getCell(k);
                    col.setCellStyle(commonStyle);
                }
            }

            workbook.write(res.getOutputStream());

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            workbook.close();
        }

    }

	public CctvVo setColToVo(XSSFRow row, CodeConvertor cde, int readIndx) throws Exception{
        CctvVo vo = new CctvVo();
//        String mgrNo, cctvNm, deviceId, facId, chnlNo, gbnCd, ipAddr, portNum, panYn, lng, lat, rmark = "", angle = "";

        String mgrNo, cctvNm, gbnNm, gbnCd, sigNm, deviceId, chnlNo, useYn, panYn, lightYn, infrdYn, tiltYn, zoomYn, talkYn, tourYn;
        String ipAddr, portNum, conId, conPwd, lng, lat, angle = "", locDesc, instDat, constYear, constNm, rmark = "";


        //mgrNo = "CTV00000001";
        //mgrNo = "CTV" + String.format("%07d", i);
       /* mgrNo = chkColType(row.getCell(0));
        if(StringUtils.isEmpty(mgrNo)) {
            throw new Exception("mgrNo is required Ex) CTV00000001");
        }*/
        mgrNo = "CTV" + String.format("%07d", readIndx);

        cctvNm = chkColType(row.getCell(0));

        gbnNm = chkColType(row.getCell(1));
        if(StringUtils.isEmpty(gbnNm)) gbnNm = "기타";
       // sigNm = chkColType(row.getCell(3));
        gbnCd = cde.convertNameToCdeInGrp("C14",gbnNm);
   
        deviceId = chkColType(row.getCell(2));

        chnlNo = chkColType(row.getCell(3));
        chnlNo = chnlNo.replaceAll(" ", "");
      	if(StringUtils.isEmpty(chnlNo)) {
          	chnlNo =  "0";
      	} else if(chnlNo.contains("Ch")) {
    	  	chnlNo = chnlNo.replaceAll("Ch", "");
      	}

        useYn = chkColType(row.getCell(4));
        if(useYn.equals("사용")) {
            useYn = "Y";
        } else {
            useYn = "N";
        }

        panYn = chkColType(row.getCell(5));
        panYn = convertString(panYn);

        lightYn = chkColType(row.getCell(6));
        lightYn = convertString(lightYn);

        infrdYn = chkColType(row.getCell(7));
        infrdYn = convertString(infrdYn);
        
        tiltYn = chkColType(row.getCell(8));
        tiltYn = convertString(tiltYn);
        
        zoomYn = chkColType(row.getCell(9));
        zoomYn = convertString(zoomYn);
        
        talkYn = chkColType(row.getCell(10));
        talkYn = convertString(talkYn);
        
        tourYn = chkColType(row.getCell(11));
        tourYn = convertString(tourYn);

        ipAddr = chkColType(row.getCell(12));

       portNum = chkColType(row.getCell(13));
        portNum = portNum.replaceAll(" ", "");
      	if(StringUtils.isEmpty(portNum)) {
      		portNum =  "0";
      	}

        conId = chkColType(row.getCell(14));

        conPwd = chkColType(row.getCell(15));

        lng = chkColType(row.getCell(16));
        if(StringUtils.isEmpty(lng)) {
            throw new Exception("경도데이터가 비어있는 항목이 있습니다.");
        }

        lat = chkColType(row.getCell(17));
        if(StringUtils.isEmpty(lat)) {
            throw new Exception("위도데이터가 비어있는 항목이 있습니다.");
        }

        angle = chkColType(row.getCell(18));
        if(StringUtils.isEmpty(angle)) angle = "-1";

        locDesc = chkColType(row.getCell(19));

        instDat = chkColType(row.getCell(20));
        
        constYear = chkColType(row.getCell(21));

        constNm = chkColType(row.getCell(22));

        rmark = chkColType(row.getCell(23));

        vo.setMgrNo(mgrNo);
        vo.setCctvNm(cctvNm);
        vo.setGbnNm(gbnNm);
        vo.setInstDat(instDat);
        vo.setGbnCd(gbnCd);
       // vo.setSigNm(sigNm);
        vo.setDeviceId(deviceId);
        vo.setChnlNo(chnlNo);
        vo.setUseYn(useYn);
        vo.setPanYn(panYn);
        vo.setLightYn(lightYn);
        vo.setInfrdYn(infrdYn);
        vo.setTiltYn(tiltYn);
        vo.setZoomYn(zoomYn);
        vo.setTalkYn(talkYn);
        vo.setTourYn(tourYn);
        vo.setIpAddr(ipAddr);
        vo.setPortNum(portNum);
        vo.setConId(conId);
        vo.setConPwd(conPwd);
        vo.setLng(lng);
        vo.setLat(lat);
        vo.setAngle(angle);
        vo.setLocDesc(locDesc);
        vo.setConstYear(constYear);
        vo.setConstNm(constNm);
        vo.setRmark(rmark);
        return vo;
    }
	
	private String convertString(String str) {
	    if(str.equals("가능")) {
	        str = "Y";
	    } else {
	        str = "N";
	    }
	     return str;
	}

	public String chkColType(XSSFCell cell){
        String value="";
        if ( cell != null ) {
            if(cell.getCellType() == 0 ){
                if(cell.getNumericCellValue()%1 == 0)
                    value = (int)cell.getNumericCellValue()+"";
                else
                    value = String.valueOf(cell.getNumericCellValue());
            } else if ( cell.getCellType() == 1 ) {
                value= cell.getStringCellValue()+"";
            }

        }
        return value;
    }

	/**
	 * 기반시설 상세정보 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getInfraDetailView.do", method = RequestMethod.POST)
	public String getInfraDetailView(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrNo", val);
		map.put("refMgrNo", val);

		ArrayList<ImageVo> img = image.getList(map);
		if(img != null && img.size() > 0) model.addAttribute("img", img);

		ArrayList<String> symList = getInfraSymbolList(session.getServletContext().getRealPath("/resources/sym/nms/"));

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("result", infra.getItem(map));
		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("site", site.getList(null));
		model.addAttribute("sym", symList);
		model.addAttribute("map", map);

		return "/nms/infra/detailView";
	}

	/**
	 * 기반시설을 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "addInfra.json", method = RequestMethod.POST)
	public void addInfra(Model model, HttpSession session, @ModelAttribute @Valid InfraVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {"mgrNo", "siteMgrNo"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("infraVo", null);
			model.addAttribute("result", infra.add(vo));

			HashMap<String, String> map = new HashMap<String, String>();
			map.put("orgMgrNo", vo.getOrgMgrNo());
			//map.put("siteMgrNo", vo.getSiteMgrNo());
			map.put("instDat", vo.getInstDat());
			map.put("fclGbnCd", vo.getFclGbnCd());
			map.put("ipAddr", vo.getIpAddr());
			map.put("portNum", vo.getPortNum());
			map.put("useYn", vo.getUseYn());
			map.put("conId", vo.getConId());
			map.put("conPwd", vo.getConPwd());
			map.put("snmpStr", vo.getSnmpStr());
			map.put("statChkYn", vo.getStatChkYn());
			map.put("facilityId", vo.getFacilityId());
			map.put("facilityNm", vo.getFacilityNm());
			map.put("locDesc", vo.getLocDesc());
			map.put("rmark", vo.getRmark());

			map.put("sortCol", "mgr_no");
			map.put("sortTyp", "desc");
			map.put("limit", "1");
			map.put("offset", "0");

			ArrayList<InfraVo> list = infra.getList(map);
			model.addAttribute("mgrNo", list.get(0).getMgrNo());
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 함체 기반시설을 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "addEnclosureInfra.json", method = RequestMethod.POST)
	public void addEnclosureInfra(Model model, HttpSession session, @ModelAttribute InfraVo vo) throws Exception {

		String msg = "pass";

		if(vo.getFclGbnCd() == null || "".equals(vo.getFclGbnCd())){
			msg = "시설구분을 선택해주세요.";
		}

		if(vo.getFacilityNm() == null || "".equals(vo.getFacilityNm())){
			msg = "장비명을 입력해주세요.";
		}

		if(vo.getLng() == null || "".equals(vo.getLng()) || vo.getLat() == null || "".equals(vo.getLat())){
			msg = "위치를 선택해주세요.";
		}

		if("pass".equals(msg)){
			model.addAttribute("infraVo", null);
			model.addAttribute("result", infra.add(vo));

			HashMap<String, String> map = new HashMap<String, String>();
			map.put("orgMgrNo", vo.getOrgMgrNo());
			//map.put("siteMgrNo", vo.getSiteMgrNo());
			map.put("instDat", vo.getInstDat());
			map.put("fclGbnCd", vo.getFclGbnCd());
			map.put("ipAddr", vo.getIpAddr());
			map.put("portNum", vo.getPortNum());
			map.put("useYn", vo.getUseYn());
			map.put("conId", vo.getConId());
			map.put("conPwd", vo.getConPwd());
			map.put("snmpStr", vo.getSnmpStr());
			map.put("statChkYn", vo.getStatChkYn());
			map.put("facilityId", vo.getFacilityId());
			map.put("facilityNm", vo.getFacilityNm());
			map.put("locDesc", vo.getLocDesc());
			map.put("rmark", vo.getRmark());

			map.put("sortCol", "mgr_no");
			map.put("sortTyp", "desc");
			map.put("limit", "1");
			map.put("offset", "0");

			ArrayList<InfraVo> list = infra.getList(map);
			model.addAttribute("mgrNo", list.get(0).getMgrNo());
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 기반시설을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "delInfra.json", method = RequestMethod.POST)
	public void delInfra(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> param = new HashMap<String, String>();
		param.put("mgrNo", val);

		model.addAttribute("result", infra.del(param));

	}

	/**
	 * 기반시설을 수정합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "editInfra.json", method = RequestMethod.POST)
	public void editInfra(Model model, HttpSession session, @ModelAttribute @Valid InfraVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {"mgrNo", "orgMgrNo", "siteNm", "siteMgrNo"};
		String msg = ValidInspector.findError(br, ignoreField);

		if("pass".equals(msg)){
			model.addAttribute("infraVo", null);
			model.addAttribute("mgrNo", vo.getMgrNo());
			model.addAttribute("result", infra.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 케이블관리 > 케이블조회 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCableView.do")
	public String getCableView(Model model) throws Exception {

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/cableSearchView";
	}

	/**
	 * 케이블관리 > 케이블등록 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCableRegView.do")
	public String getCableRegView(Model model) throws Exception {

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/cable/regView";
	}

	/**
	 * 케이블관리 > 케이블삭제 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCableDelView.do")
	public String getCableDelView(Model model) throws Exception {

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		return "/nms/cable/delView";
	}

	/**
	 * 케이블의 주제도 목록을 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "getCableTheme.json", method = RequestMethod.POST)
	public void getCableTheme(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		ArrayList<CableVo> list = cable.getCableTheme(map);

		HashMap<String, String> theme = new HashMap<String, String>();
		for(int i=0; i<list.size(); i++){
			theme.put(list.get(i).getCableNm(), list.get(i).getLineColor());
		}

		model.addAttribute("result", theme);

	}

	/**
	 * 케이블을 수정합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "editCable.json", method = RequestMethod.POST)
	public void editCable(Model model, HttpSession session, @ModelAttribute @Valid CableVo vo, BindingResult br) throws Exception {

		String[] ignoreField = {};
		String msg = ValidInspector.findError(br, ignoreField);

		if(vo.getGid() == null || "".equals(vo.getGid())) msg = "케이블을 선택해 주세요.";

		if("pass".equals(msg)){
			model.addAttribute("cableVo", null);
			model.addAttribute("result", cable.edit(vo));
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 케이블을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "delCable.json", method = RequestMethod.POST)
	public void delCable(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", cable.del(map));

	}

	/**
	 * 케이블 여러건을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "delMultipleCable.json", method = RequestMethod.POST)
	public void delMultipleCable(Model model, HttpSession session, @ModelAttribute @Valid CableVo vo) throws Exception {

		TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

		try {
			model.addAttribute("result", cable.del(vo.getCableList()));
			transactionManager.commit(txStatus);
		} catch (Exception e) {
			transactionManager.rollback(txStatus);
			model.addAttribute("error", "롤백처리 되었습니다.\n잠시 후 다시 시도하시거나, 관리자에게 문의해주세요.");
			e.printStackTrace();
		}

	}

	/**
	 * 케이블을 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = {"addCable.json", "addMultipleCable.json"}, method = RequestMethod.POST)
	public void addCable(Model model, HttpServletRequest req, HttpSession session, @ModelAttribute @Valid CableVo vo, BindingResult br) throws Exception {

		String[] full_url = req.getRequestURI().split("/");
    	String url = full_url[full_url.length - 1];

    	if("addCable.json".equals(url)){
    		String[] ignoreField = {"mgrNo", "orgMgrNo", "siteNm"};
    		String msg = ValidInspector.findError(br, ignoreField);

    		if("pass".equals(msg)){
    			model.addAttribute("result", cable.add(vo));
    			model.addAttribute("cableVo", null);
    		}else{
    			model.addAttribute("error", msg);
    		}
    	}else if("addMultipleCable.json".equals(url)){
    		TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

    		try {
    			model.addAttribute("result", cable.add(vo.getCableList()));
    			model.addAttribute("cableVo", null);
    			transactionManager.commit(txStatus);
    		} catch (Exception e) {
    			transactionManager.rollback(txStatus);
    			model.addAttribute("error", "롤백처리 되었습니다.\n잠시 후 다시 시도하시거나, 관리자에게 문의해주세요.");
    			e.printStackTrace();
    		}
    	}
	}

	/**
     * 상태 모니터링 테스트 페이지 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/statTest.do")
    public String statTest(Model model) throws Exception {

        model.addAttribute("code", new CodeConvertor(code.getCdeList()));

        model.addAttribute("cctv", cctv.getList(null));
        model.addAttribute("infra", infra.getList(null));
        model.addAttribute("site", site.getList(null));
        model.addAttribute("acsry", acsry.getList(null));
        model.addAttribute("status", status.getList(null));

        return "/nms/statTest";
    }

    /**
     * 상태 점검 요청 데이터를 추가합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/addStatus.json", method = RequestMethod.POST)
    public void addStatus(Model model, @ModelAttribute @Valid StatusVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){

        	HashMap<String, String> map = new HashMap<String, String>();
        	map.put("mgrNo", vo.getMgrNo());

        	status.del(map);
            model.addAttribute("result", status.add(vo));

            socket.broadcast("CCTV-Reload");

        }else{
            model.addAttribute("error", msg);
        }


    }

    /**
     * 상태 점검 요청 데이터를 수정합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/editStatus.json", method = RequestMethod.POST)
    public void editStatus(Model model, @ModelAttribute @Valid StatusVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){

            model.addAttribute("result", status.edit(vo));

            socket.broadcast("CCTV-Reload");

        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * 상태 점검 요청 데이터를 삭제합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/delStatus.json", method = RequestMethod.POST)
    public void delStatus(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", status.del(map));

        socket.broadcast("CCTV-Reload");

    }


    /**
     * CCTV 모델관리 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvModelMngView.do")
    public String getCctvModelMngView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("code", new CodeConvertor(code.getCdeList()));
        model.addAttribute("column", col.getList());
        model.addAttribute("result", cctvModel.getList(map));
        model.addAttribute("count", cctvModel.getCount(map));
        model.addAttribute("map", map);

        return "/sysMng/equipCctvModelMngView";
    }

    /**
     * CCTV 모델 항목을 가져옵니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvModel.json", method = RequestMethod.POST)
    public void getCctvModel(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", cctvModel.getItem(map));

    }

    /**
     * CCTV 모델 항목을 추가합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/addCctvModel.json", method = RequestMethod.POST)
    public void addCctvModel(Model model, @ModelAttribute @Valid CctvModelVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){

            model.addAttribute("result", cctvModel.add(vo));

        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * CCTV 모델 항목을 수정합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/editCctvModel.json", method = RequestMethod.POST)
    public void editCctvModel(Model model, @ModelAttribute @Valid CctvModelVo vo, BindingResult br) throws Exception {

        String[] ignoreField = {""};
        String msg = ValidInspector.findError(br, ignoreField);

        if("pass".equals(msg)){

            model.addAttribute("result", cctvModel.edit(vo));

        }else{
            model.addAttribute("error", msg);
        }

    }

    /**
     * CCTV 모델 항목을 삭제합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/delCctvModel.json", method = RequestMethod.POST)
    public void delCctvModel(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        model.addAttribute("result", cctvModel.del(map));

    }

    /**
     * NMS 범례를 조회합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getNmsLegendView.do")
    public String getNmsLegendView(Model model) {

        return "/nms/nmsLegendView";

    }

    /**
     * NMS 메뉴 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getNmsView.do")
    public String getNmsView(Model model) {

        return "/nms/nmsView";

    }

    /**
     * 구청주차 메뉴 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getParkingView.do")
    public String getParkingView(Model model) {

        return "/nms/parkingView";

    }

    /**
     * 지능형분석 메뉴 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getSmartEyeView.do")
    public String getSmartEyeView(Model model) {

    	return "/nms/smartEyeView";

    }

    /**
     * Anna 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getAnnaProjectView.do")
    public String getAnnaProjectView(Model model) {

    	return "/nms/annaProjectView";

    }


	/**
	 * LORA상태 주제도 목록을 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLoraStateTheme.json", method = RequestMethod.POST)
	public void getLoraStateTheme(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		List<String> list = infra.getLoraStateTheme(map);
		HashMap<String, String> theme = new HashMap<String, String>();
        for(int i=0; i<list.size(); i++){
        	String img = "";

        	if("좋음".equals(list.get(i))) img = "c43.png";
			if("보통".equals(list.get(i))) img = "c44.png";
			if("안좋음".equals(list.get(i))) img = "c45.png";
			if("매우안좋음".equals(list.get(i))) img = "c46.png";

            theme.put(list.get(i), img);
        }
		model.addAttribute("result", theme);

	}

	/**
	 * BlackBox 주제도 목록을 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getBlackBoxTheme.json", method = RequestMethod.POST)
	public void getBlackBoxTheme(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		List<String> list = infra.getBlackBoxTheme(map);
		HashMap<String, String> theme = new HashMap<String, String>();
        for(int i=0; i<list.size(); i++){
        	/*String img = "";

        	if("G".equals(list.get(i))) img = "c42.png";
			if("Y".equals(list.get(i))) img = "c40.png";
			if("P".equals(list.get(i))) img = "c41.png";
			if("R".equals(list.get(i))) img = "c39.png";

            theme.put(list.get(i), img);*/

        	/*R:지도 마커 빨강색(수신이상)
            Y:지도 마커 노랑색(상태이상)
            P:지도 마커 보라색(문열림)
            G:지도 마커 초록색(정상)*/

            String key = "";

        	if("G".equals(list.get(i))) key = "정상";
			if("Y".equals(list.get(i))) key = "상태이상";
			if("P".equals(list.get(i))) key = "문열림";
			if("R".equals(list.get(i))) key = "수신이상";

			theme.put(key, list.get(i));
        }
		model.addAttribute("result", theme);

	}

	/**
	 * 미등록 CCTV 목록을 조회합니다.
	 * 190123 : 뷰릭스 추가
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCctvListToVms.json", method = RequestMethod.POST)
	public void getCctvListToVms(Model model, @RequestParam HashMap<String, String> map) {
		// response.setContentType("application/json;charset=UTF-8");

		BufferedReader in = null;
		StringBuilder sb = new StringBuilder();

		boolean workChk = false;

		//if("VURIX".equals(map.get("vmsTyp"))){
		try {
			// 뷰릭스로 등록된 CCTV의 단건 하나를 조회한다.
			// 매퍼에선 min(mgr_no)로 가져왔음. limit 1로 가져오려면 수정해야 함.

			CctvVo vo = cctv.getVmsItem(map);

			String url = cctvListReqUrl + "?cctvMgrNo=" + vo.getMgrNo();

			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setConnectTimeout(10000);
			con.setRequestMethod("GET");
			in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));

			sb.setLength(0);
			String line;
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			// response.getWriter().print(sb.toString());

			try {

				//{"error" : "처리중 에러가 발생했습니다. >>InvalidAuthenticateInfo"}
				if(sb.toString().indexOf("error")> -1){
					JSONParser parser = new JSONParser();
					JSONObject result;
					result = (JSONObject) parser.parse(sb.toString());
					workChk = false;
					model.addAttribute("msg", (String)result.get("error"));
				} else {
					JSONParser parser = new JSONParser();
					JSONArray result;
					result = (JSONArray) parser.parse(sb.toString());

					if (result.size() == 0) {
						workChk = false;
						model.addAttribute("msg", "VMS 조회 결과가 없습니다.");
					} else {
						// 1. db cctv 목록을 deviceId을 키값으로 가져온다.
						HashMap<String, HashMap<String, String>> dbMapToId = getDbCctvList("deviceId", map);
						//ArrayList<String> dbListToId = new ArrayList<String>(dbMapToId.keySet());

						// 2. db cctv 목록을 cctvNm을 키값으로 가져온다.
						HashMap<String, HashMap<String, String>> dbMapToNm = getDbCctvList("cctvNm", map);

						// 3. deviceId 동기화용 리턴할 해시맵 리스트 생성
						ArrayList<HashMap<String, String>> idSync = new ArrayList<HashMap<String, String>>();

						// 4. 명칭 동기화용 리턴할 해시맵 리스트 생성
						ArrayList<HashMap<String, String>> nmSync = new ArrayList<HashMap<String, String>>();

						// 5. 과등록용 리턴할 해시맵 생성
						HashMap<String, HashMap<String, String>> excessMap = new HashMap<String, HashMap<String, String>>();

						// 6. 미등록용 리턴할 해시맵 생성
						HashMap<String, CctvVo> unRegiMap = new HashMap<String, CctvVo>();

						// 191014 이은규
						// 7. 명칭동기화에 포함된 아이템은 과등록 리스트에서 제외한다.
						ArrayList<String> nmSyncList = new ArrayList<String>();

						// 8. 게이트웨이에서 받은 결과로 반복문을 돌면서 위 3~6의 리스트를 완성한다.
						JSONObject subObj = new JSONObject();
						for (int i = 0; i < result.size(); i++) {
							subObj = (JSONObject) result.get(i);
							String deviceId = ((String) subObj.get("deviceId")).trim();
							String cctvNm = ((String) subObj.get("name")).trim();

							// 8-1. deviceID 동기화(3번), 과등록(7번) 확인
							if(dbMapToId.containsKey(deviceId)){
								// 명칭이 같지 않으면 명칭동기화 추가
								String dbCctvNm = dbMapToId.get(deviceId).get("cctvNm");
								if(!dbCctvNm.equals(cctvNm)){
									HashMap<String, String> idMap = new HashMap<String, String>();
									idMap.put("key", deviceId);
									idMap.put("db", dbCctvNm);
									idMap.put("vms", cctvNm);
									idSync.add(idMap);
								}

								// vms와 매칭되는 내역은 삭제한다. 다 삭제한 후 남는 리스트가 과등록 리스트가 된다.
								dbMapToId.remove(deviceId);
							} else{
								// 8-2. 명칭 동기화(4번) 확인
								if(dbMapToNm.containsKey(cctvNm)){
									// deviceId가 같지 않으면
									String dbCctvId = dbMapToNm.get(cctvNm).get("deviceId");
									HashMap<String, String> nmMap = new HashMap<String, String>();
									nmMap.put("key", cctvNm);
									nmMap.put("db", dbCctvId);
									nmMap.put("vms", deviceId);
									nmSync.add(nmMap);

									nmSyncList.add(cctvNm);
								} else{
									// 8-3. 미등록(6번) 확인
									// deviceId가 없으므로 미등록 리스트에 추가한다.
									unRegiMap.put(deviceId, toCctvVo(subObj));
								}
							}
						}




						/*JSONObject subObj = new JSONObject();
						for (int i = 0; i < result.size(); i++) {
							subObj = (JSONObject) result.get(i);
							String deviceId = ((String) subObj.get("deviceId")).trim();
							String cctvNm = ((String) subObj.get("name")).trim();

							// 7-1. deviceID 동기화(3번), 과등록(7번) 확인
							if(dbMapToId.containsKey(deviceId)){
								// 명칭이 같지 않으면 명칭동기화 추가
								String dbCctvNm = dbMapToId.get(deviceId).get("cctvNm");
								if(!dbCctvNm.equals(cctvNm)){
									HashMap<String, String> idMap = new HashMap<String, String>();
									idMap.put("key", deviceId);
									idMap.put("db", dbCctvNm);
									idMap.put("vms", cctvNm);
									idSync.add(idMap);
								}

								// vms와 매칭되는 내역은 삭제한다. 다 삭제한 후 남는 리스트가 과등록 리스트가 된다.
								dbMapToId.remove(deviceId);
							}
							// 7-2. 미등록(6번) 확인
							else{
								// deviceId가 없으므로 미등록 리스트에 추가한다.
								unRegiMap.put(deviceId, toCctvVo(subObj));
							}

							// 7-3. 명칭 동기화(4번) 확인
							if(dbMapToNm.containsKey(cctvNm)){
								// deviceId가 같지 않으면
								String dbCctvId = dbMapToNm.get(cctvNm).get("deviceId");
								if(!dbCctvId.equals(deviceId)){
									HashMap<String, String> nmMap = new HashMap<String, String>();
									nmMap.put("key", cctvNm);
									nmMap.put("db", dbCctvId);
									nmMap.put("vms", deviceId);
									nmSync.add(nmMap);
								}
							}

						}*/

						// 9. 명칭동기화에 포함된 목록을 찾아 과등록 리스트에서 삭제한다.
						HashMap<String, HashMap<String, String>> copyDbMapToId = new HashMap<String, HashMap<String, String>>();
						copyDbMapToId.putAll(dbMapToId);
				    	Iterator<String> copyDbMapToIdKeys = copyDbMapToId.keySet().iterator();
				        while( copyDbMapToIdKeys.hasNext() ){
				            String key = copyDbMapToIdKeys.next();
				            if(nmSyncList.size() == 0) break;
				            for(int i=nmSyncList.size()-1; i>=0; i--){
				            	String nmSyncTxt = nmSyncList.get(i);
				            	if(dbMapToId.get(key) != null){
				            		if(dbMapToId.get(key).get("cctvNm").equals(nmSyncTxt)){
				            			dbMapToId.remove(key);
				            			nmSyncList.remove(i);
				            		}
				            	}
				            }
				        }

						// 10. deviceId가 키인 db cctv 목록이 비어있지 않으면 과등록 리스트에 추가한다.
						if(!dbMapToId.isEmpty()){
							excessMap.putAll(dbMapToId);
						}

						model.addAttribute("idSync", idSync);
						model.addAttribute("nmSync", nmSync);
						model.addAttribute("un", unRegiMap);
						model.addAttribute("excess", excessMap);

						workChk = true;
					}
				}
			} catch (Exception e) {
				workChk = false;
				model.addAttribute("msg", "작업 도중 오류가 발생했습니다. ");
				e.printStackTrace();
			}

		} catch (Exception e) {
			workChk = false;
			model.addAttribute("msg", "작업 도중 오류가 발생했습니다.");
			e.printStackTrace();
		} finally {
			if (in != null)
				try {
					in.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			model.addAttribute("result", workChk);
		}
		//}

	}

	public CctvVo toCctvVo(JSONObject object) {

		//object : { "dch_ch":"0", "name":"HIKVISION DS-2CD2110-I", "addr":"10.1.73.24", "dchm_media_count":"1", "deviceId":"100003"}
		CctvVo vo = new CctvVo();

		for (Object entry : object.keySet()) {
			String key = entry.toString();
			String value = object.get(entry).toString();

			if("deviceId".equals(key)) vo.setDeviceId(value.trim());
			else if("dch_ch".equals(key)) vo.setChnlNo(value);
			else if("name".equals(key)) vo.setCctvNm(value);
			else if("addr".equals(key)) vo.setIpAddr(value);

		}

		return vo;
	}

	public HashMap<String, HashMap<String, String>> getDbCctvList(String gbn, HashMap<String, String> map) throws Exception {

		HashMap<String, HashMap<String, String>> result = new HashMap<String, HashMap<String, String>>();
		ArrayList<CctvVo> platformList = cctv.getList(map);

		if("deviceId".equals(gbn)){
			for (int i = 0; i < platformList.size(); i++) {
				HashMap<String, String> item = new HashMap<String, String>();
				item.put("cctvNm", platformList.get(i).getCctvNm());
				item.put("mgrNo", platformList.get(i).getMgrNo());
				result.put(("" + platformList.get(i).getDeviceId()).trim(), item);
			}
		} else if("cctvNm".equals(gbn)){
			for (int i = 0; i < platformList.size(); i++) {
				HashMap<String, String> item = new HashMap<String, String>();
				item.put("deviceId", platformList.get(i).getDeviceId());
				item.put("mgrNo", platformList.get(i).getMgrNo());
				result.put(("" + platformList.get(i).getCctvNm()).trim(), item);
			}
		}

		return result;

	}

	/**
     * CCTV 관리 페이지를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getCctvMngView.do")
    public String getCctvMngView(Model model, @RequestParam HashMap<String, String> map) throws Exception{

    	model.addAttribute("vms", vms.getList(map));

        return "/nms/cctvMngView";

    }

    /**
	 * BlackBox 주제도 목록을 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/syncCctv.json", method = RequestMethod.POST)
	public void syncCctv(Model model, @RequestParam HashMap<String, String> map) throws Exception {

//		"idSync"
//		"nmSync"
//		{ "gbn": gbn, "data" : JSON.stringify(data) }

		/*[
			{key: "HIKVISION DS-2CD2110-I", value: "100003"},
			{key: "HIKVISION DS-2CD2110-I", value: "100004"},
			{key: "HIKVISION DS-2CD2110-I", value: "100005"},
			{key: "HIKVISION DS-2CD2110-I", value: "100006"}
		]*/

		boolean workChk = false;
		String msg = "";
		try{
			JSONParser parser = new JSONParser();
			JSONArray data;
			data = (JSONArray) parser.parse( URLDecoder.decode(map.get("data"), "UTF-8") );


			HashMap<String, String> param = new HashMap<String, String>();
			//디바이스 ID 동기화
			if("idSync".equals(map.get("gbn"))){
				param.put("col", "cctv_nm");
				param.put("where", "device_id");
			} else if("nmSync".equals(map.get("gbn"))){
				param.put("col", "device_id");
				param.put("where", "cctv_nm");
			}

			if(param.containsKey("col") && param.containsKey("where")){
				ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
				JSONObject subObj = new JSONObject();
				for(int i=0; i<data.size(); i++){
					subObj = (JSONObject) data.get(i);
					String key = ((String) subObj.get("key")).trim();
					String val = ((String) subObj.get("val")).trim();

					HashMap<String, String> clone = new HashMap<String, String>();
		            clone.putAll(param);

					clone.put("key", key);
					clone.put("val", val);

					list.add(clone);
				}

				TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

				try {
					workChk = cctv.syncCctv(list);
					transactionManager.commit(txStatus);
				} catch (Exception e) {
					transactionManager.rollback(txStatus);
					msg = "롤백처리 되었습니다.\n잠시 후 다시 시도하시거나, 관리자에게 문의해주세요.";
					e.printStackTrace();
				}
			} else {
				msg = "작업 구분이 올바르지 않습니다.";
			}
		}catch(Exception e){
			e.printStackTrace();
		} finally{
			model.addAttribute("result", workChk);
			model.addAttribute("msg", msg);
		}

	}

}
