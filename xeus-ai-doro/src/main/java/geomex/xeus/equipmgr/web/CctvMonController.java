package geomex.xeus.equipmgr.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.commons.lang3.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import geomex.xeus.equipmgr.service.CctvModelVo;
import geomex.xeus.equipmgr.service.CctvService;
import geomex.xeus.equipmgr.service.CctvSymCmd;
import geomex.xeus.equipmgr.service.CctvUnregService;
import geomex.xeus.equipmgr.service.CctvVo;
import geomex.xeus.equipmgr.service.PatrolService;
import geomex.xeus.equipmgr.service.PatrolVo;
import geomex.xeus.equipmgr.service.VmsService;
import geomex.xeus.eventmonitor.service.FavCctvService;
import geomex.xeus.eventmonitor.service.FavCctvVo;
import geomex.xeus.log.service.AssetLogService;
import geomex.xeus.log.service.AssetLogVo;
import geomex.xeus.map.service.SearchService;
import geomex.xeus.sysmgr.service.ImageService;
import geomex.xeus.sysmgr.service.ImageVo;
import geomex.xeus.sysmgr.service.OrganizationService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.sysmgr.web.CodeCtrl;
import geomex.xeus.sysmgr.web.ColumnInfoController;
import geomex.xeus.util.code.CodeConvertor;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;


/**
 * <pre>
 * 파일명 :  CctvMonController.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-13      김경호          최초 생성
 * 2017-12-08	   이은규		   CCTV 검색 수정
 * 								   영상반출에서 CCTV 검색 시 관리 버튼을 없애기 위한 파라미터 추가
 *
 * </pre>
 *
 * @since : 2016. 12. 13.
 * @version : 1.0
 * @see
 */

@RequestMapping("/cctv")
@Controller("cctvMonController")
public class CctvMonController {

    private Logger logger = LoggerFactory.getLogger(CctvMonController.class);

    @Resource(name = "cctvMapService")
    private CctvMapService cctvMapService;

    @Resource(name = "CctvService")
	private CctvService cctv;

    @Resource(name = "vmsService")
    private VmsService vms;

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
    private AssetLogService assetLog;

	@Resource(name = "searchService")
	private SearchService bjd;

	@Resource(name = "organizationService")
	private OrganizationService orgz;

	@Resource(name = "codeCtrl")
	private CodeCtrl code;

	@Resource(name = "sysPropService")
    private SysPropService param;

	@Autowired
	private ColumnInfoController col;

	@Resource(name = "txManager")
    PlatformTransactionManager transactionManager;

	@Resource
	private Validator validator;

	@InitBinder
	private void initBinder(WebDataBinder binder){
		binder.setValidator(this.validator);
	}

	private String gateUrl;

    @PostConstruct
    public void initIt() throws Exception {

    	HashMap<String, String> sysMap = new HashMap<String, String>();
        SystemParameter sysParam = new SystemParameter(param.getList(null));
        sysMap = sysParam.getParamMap();

        this.gateUrl = sysMap.get("event.vurix.gateway.url");

    }

	/**
	 * CCTV 심볼을 리턴합니다.
	 *
	 * @param kvp
	 * @param res
	 * @return
	 */
    @RequestMapping(value = "cctvmap")
    public @ResponseBody String getCctvMap(@RequestParam HashMap<String, String> kvp, HttpServletResponse res) {
        toUpperCaseParam(kvp);

        try {
            res.setContentType("application/json; charset=utf-8");
            res.setHeader("Cache-Control", "no-cache");
            res.setDateHeader("Expires", 1);
            res.setCharacterEncoding("UTF-8");

            CctvSymCmd cmd = new CctvSymCmd();
            cmd.parseKvp(kvp);
            return cctvMapService.getSymbolGroupAsJSON(cmd, kvp);
        } catch (Exception e) {
            logger.error("exceptions........", e);
            return null;
        }
    }

    /**
     * HashMap의 Key 를 대분자로 변경합니다.
     *
     * @param kvp
     */
    private void toUpperCaseParam(HashMap<String, String> kvp) {
        HashMap<String, String> upper = new HashMap<String, String>();
        for (String key : kvp.keySet()) {
        	if(!"admNm".equals(key) && !"emdCd".equals(key) && !"orgMgrNo".equals(key) && !"cctvGbnCd".equals(key) && !"cctvNm".equals(key)){
        		upper.put(key.trim().toUpperCase(), kvp.get(key));
        	}else{
        		upper.put(key, kvp.get(key));
        	}
        }
        kvp.clear();
        kvp.putAll(upper);
    }

    /**
     * Vision 메뉴 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getVisionView.do")
    public String getVisionView(Model model) {

    	return "/nms/visionView";

    }

    /**
     * mobileShare 메뉴 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getMobileShareView.do")
    public String getMobileShare(Model model) {

    	return "/cctv/mobileShareView";

    }

    /**
     * 주어진 좌표에서 가장 가까운 CCTV를 리턴합니다.
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getNearCctv.json", method = RequestMethod.POST)
    public void getNearCctv(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        String geometry = "";
        CctvVo getGeom = null;
        HashMap<String, String> center = new HashMap<String, String>();

        getGeom = cctv.makeGeometry(map);
        geometry = getGeom.getGeometry();
        center.put("centerX", getGeom.getCenterX());
        center.put("centerY", getGeom.getCenterY());

        if ( !"".equals(geometry) ){

            map.put("geometry", geometry);

            //거리제한 파라미터 미입력 시 환경설정 파라미터를 사용한다.
            //혹시 모를 스크립트 오류를 대비해 정규식으로 다시 체크
            final String regex = "^[0-9]*$";
            if(map.containsKey("dist") && !"".equals(map.get("dist")) && map.get("dist").matches(regex)){
                map.put("dist", map.get("dist"));
                center.put("dist", map.get("dist"));
            } else {
            	//!!
            }

            model.addAttribute("result", cctv.getNetItem(map));
        } else {
            model.addAttribute("error", "결과가 존재하지 않습니다.");
        }

    }

    /**
     * CCTV Player 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getPlayer.do")
    public String getPlayer(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("cctv", cctv.getItem(map));
    	model.addAttribute("map", map);

    	return "/cctv/player";
    }

    /**
     * CCTV 조회 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getSearchView.do")
    public String getSearchView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("column", col.getList());

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("emd", bjd.getEmdList());
		model.addAttribute("li", bjd.getLiList());
		model.addAttribute("gbn", cctv.getGbnNm(null));

    	model.addAttribute("result", cctv.getList(map));
    	model.addAttribute("count", cctv.getCount(map));

    	model.addAttribute("param", map);

    	return "/cctv/cctvSearchView";
    }

    /**
     * CCTV 목록을 조회합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = {"/getCctvList.json", "getCctvListExcel.do"}, method = RequestMethod.POST)
	public String getCctvList(HttpServletRequest req, Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	String[] full_url = req.getRequestURI().split("/");
    	String url = full_url[full_url.length - 1];

    	String view = null;

    	model.addAttribute("param", map);
    	model.addAttribute("result", cctv.getList(map));
    	model.addAttribute("count", cctv.getCount(map));
    	if("getCctvListExcel.do".equals(url)){
    		model.addAttribute("code", new CodeConvertor(code.getCdeList()));
    		model.addAttribute("column", col.getList());
    		view = "/cctv/excelView";
    	}

		return view;
	}

    /**
     * 선택감시 목록을 리턴합니다.
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getFavCctvList.json", method = RequestMethod.POST)
    public void getFavCctvList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	map.put("ownerId", (String) session.getAttribute("userId"));
    	FavCctvVo vo = favCctv.getItem(map);

    	if(vo == null){
    		model.addAttribute("error", "결과가 존재하지 않습니다.");
    	}else{
    		if("".equals(vo.getJsonTxt())){
    			model.addAttribute("error", "그리드가 존재하지 않습니다.");
    		}else{

    			CodeConvertor cde = new CodeConvertor(code.getCdeList());

    			JSONParser parser = new JSONParser(JSONParser.MODE_JSON_SIMPLE);
    			JSONArray array = (JSONArray) parser.parse(vo.getJsonTxt());
    			JSONArray result = new JSONArray();
    			for(int i=0; i<array.size(); i++){
    				JSONObject json = (JSONObject) array.get(i);

    				JSONObject cctvJson = new JSONObject();

    				HashMap<String, String> cctvParam = new HashMap<String, String>();
    				cctvParam.put("mgrNo", (String) json.get("mgrNo"));

    				CctvVo cctvVo = cctv.getItem(cctvParam);

    				cctvJson.put("cctvNm", cctvVo.getCctvNm());
    				cctvJson.put("channelNo", cctvVo.getChnlNo());
    				cctvJson.put("deviceId", cctvVo.getDeviceId());
    				cctvJson.put("gbnCd", cctvVo.getGbnCd());
    				cctvJson.put("gbnTxt", cde.convertCodeToName("C14", cctvVo.getGbnCd()));
    				cctvJson.put("gid", cctvVo.getGid());
    				cctvJson.put("mgrNo", cctvVo.getMgrNo());
    				cctvJson.put("lng", cctvVo.getLng());
    				cctvJson.put("lat", cctvVo.getLat());

    				json.put("cctvJson", cctvJson);

    				result.add(json);
    			}

    			model.addAttribute("colNum", vo.getColNum());
    			model.addAttribute("result", result);

    		}
    	}

    }

	/**
	 * 선택감시 목록을 추가합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/addFavCctv.json", method = RequestMethod.POST)
	public void addFavCctv(Model model, HttpSession session, @ModelAttribute @Valid FavCctvVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			vo.setOwnerId((String) session.getAttribute("userId"));
			model.addAttribute("favCctvVo", null);
			model.addAttribute("result", favCctv.add(vo));

			HashMap<String, String> map = new HashMap<String, String>();
			map.put("ownerId", vo.getOwnerId());
			map.put("titleNm", vo.getTitleNm());
			map.put("jsonTxt", vo.getJsonTxt());
			map.put("colNum", vo.getColNum());
			map.put("chgDat", vo.getChgDat());

			FavCctvVo resultVo = favCctv.getItem(map);
			model.addAttribute("mgrSeq", resultVo.getMgrSeq());
		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 선택감시 목록을 수정합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/editFavCctv.json", method = RequestMethod.POST)
	public void editFavCctv(Model model, HttpSession session, @ModelAttribute @Valid FavCctvVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			vo.setOwnerId((String) session.getAttribute("userId"));
			model.addAttribute("favCctvVo", null);
			model.addAttribute("result", favCctv.edit(vo));

		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 선택감시 목록을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/delFavCctv.json", method = RequestMethod.POST)
	public void delFavCctv(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrSeq", val);

		model.addAttribute("result", favCctv.del(map));

	}

    /**
     * CCTV 범례를 조회합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getLegendView.do")
    public String getLegendView(Model model) {

    	return "/cctv/cctvLegendView";

    }

    /**
     * 선택감시 뷰를 리턴합니다.
     *
     * @param model
     * @param session
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getSelectView.do")
    public String getSelectView(Model model, HttpSession session) throws Exception {

    	HashMap<String, String> map = new HashMap<String, String>();
    	map.put("ownerId", (String) session.getAttribute("userId"));

    	model.addAttribute("result", favCctv.getList(map));

    	return "/cctv/selectView";

    }

    /**
     * 순찰감시 뷰를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getPatrolView.do")
    public String getPatrolView(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("result", patrol.getList(map));

    	return "/cctv/patrolView";

    }

    /**
     * 순찰감시를 리턴합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = {"/getPatrolList.json", "/getPatrolItem.json"})
    public void getPatrolList(Model model, HttpServletRequest req, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

    	String[] full_url = req.getRequestURI().split("/");
    	String url = full_url[full_url.length - 1];

    	if("getPatrolList.json".equals(url)){
    		model.addAttribute("result", patrol.getList(map));
    	}else if("getPatrolItem.json".equals(url)){
    		model.addAttribute("result", patrol.getItem(map));
    	}


    }

    /**
     * 순찰감시를 추가합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/addPatrol.json")
    public void addPatrol(Model model, HttpSession session, @ModelAttribute @Valid PatrolVo vo, BindingResult br) throws Exception {

    	vo.setOwnerId((String) session.getAttribute("userId"));
    	vo.setChgDat(DateUtil.getStrSec());

    	model.addAttribute("result", patrol.add(vo));
    	model.addAttribute("vo", patrol.getItemByVo(vo));

    }

    /**
     * 순찰감시를 삭제합니다.
     *
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/delPatrol.json")
    public void delPatrol(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("gid", val);

    	model.addAttribute("result", patrol.del(map));

    }

    /**
     * 집중감시 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getFocusView.do")
    public String getFocusView(Model model) {

    	return "/cctv/focusView";

    }

    /**
     * CCTV 등록관리 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvMngView.do")
    public String getCctvMngView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("model", cctvModel.getList(null));
		model.addAttribute("gbn", cctv.getGbnNm(null));

		model.addAttribute("vms", vms.getList(null));

		if(map.get("mgrNo") != null && !"".equals(map.get("mgrNo"))){
			model.addAttribute("vo", cctv.getItem(map));

			ArrayList<ImageVo> img = image.getList(map);
			if(img != null && img.size() > 0) model.addAttribute("img", img);
		}

    	return "/cctv/cctvMngView";

    }

    /**
	 * CCTV를 수정합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/editCctv.json", method = RequestMethod.POST)
	public void editCctv(Model model, HttpSession session, @ModelAttribute @Valid CctvVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			model.addAttribute("result", cctv.edit(vo));
			model.addAttribute("cctvVo", null);

			//작업 로그 생성
            AssetLogVo logVo = new AssetLogVo();
            logVo.setWorkerId((String) session.getAttribute("userId"));
            logVo.setWorkDat(DateUtil.getStrSec());
            logVo.setWorkGbn("수정");
            logVo.setAssetMgrNo(vo.getMgrNo());
            assetLog.add(logVo);

		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * CCTV를 등록합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/addCctv.json", method = RequestMethod.POST)
	public void addCctv(Model model, HttpSession session, @ModelAttribute @Valid CctvVo vo, BindingResult br) throws Exception {

		String msg = ValidInspector.findError(br);

		if("pass".equals(msg)){
			if(vo.getMdMgrNo() != null && !"".equals(vo.getMdMgrNo()) && vo.getMdMgrNo().contains(":::")){
				String modelInfo[] = vo.getMdMgrNo().split(":::");
				String modelId = modelInfo[0];
				String modelName = modelInfo[1];

				HashMap<String, String> modelMap = new HashMap<String, String>();
				modelMap.put("mgrNo", modelId);
				modelMap.put("modelNm", modelName);
				// Model 이름 같이 넘겨야함
				vo.setMdMgrNo(modelId);

				int modelCnt = cctvModel.getCount(modelMap);
				if(modelCnt == 0){
					CctvModelVo modelVo = new CctvModelVo();
					modelVo.setMgrNo(modelId);
					modelVo.setModelNm(modelName);
					boolean addResult = cctvModel.add(modelVo);
					if(!addResult) System.out.println(">> 모델 추가 에러");
				}

			}
		    //작업 로그 생성
            //add는 만들어지는 당시에 mgrNo가 생기므로 Insert 쿼리 실행 시 같이 로그 생성
		    vo.setWorkerId((String) session.getAttribute("userId"));
		    vo.setWorkDat(DateUtil.getStrSec());
		    vo.setWorkGbn("추가");
			model.addAttribute("result", cctv.add(vo));
			//unreg.delByVo(vo);
			model.addAttribute("cctvVo", null);

		}else{
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 구분코드을 구분이름로 변경합니다.
	 * gbnCd -> gbnNm
	 *
	 */
	@RequestMapping(value = "/changeGbncdToGbnNm.json", method = RequestMethod.POST)
	public void changeGbncdToGbnNm(Model model, @ModelAttribute @Valid CctvVo vo, BindingResult br) throws Exception {
	    CodeConvertor cde = new CodeConvertor(code.getCdeList());
	    String gbnCd = vo.getGbnCd();

	    JSONArray result = new JSONArray();
	    JSONObject cctvJson = new JSONObject();

	    cctvJson.put("gbnNm", cde.convertCodeToName("C14", gbnCd));

	    result.add(cctvJson);

	    model.addAttribute("result", result);
	}

	/**
	 * 신규등록 뷰를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNewregCctvView.do")
	public String getNewregCctvView(Model model) throws Exception {

		model.addAttribute("code", new CodeConvertor(code.getCdeList()));

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("model", cctvModel.getList(null));
		model.addAttribute("gbn", cctv.getGbnNm(null));

		model.addAttribute("vms", vms.getList(null));

		return "/cctv/unregCctvView";
	}

    /**
     * 미등록 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUnregCctvView.do")
    public String getUnregCctvView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	model.addAttribute("code", new CodeConvertor(code.getCdeList()));
		model.addAttribute("column", col.getList());

		model.addAttribute("orgz", orgz.getList(null));
		model.addAttribute("model", cctvModel.getList(null));
		model.addAttribute("gbn", cctv.getGbnNm(null));

		model.addAttribute("vms", vms.getList(null));

		model.addAttribute("param", map);

		if(map.containsKey("deviceId") && map.get("deviceId") != null && !"".equals(map.get("deviceId"))){
			CctvVo vo = new CctvVo();
			vo.setMgrNo("CTV0000000");
			vo.setDeviceId(map.get("deviceId"));
			cctv.edit(vo);
			//event.vurix.gateway.url  http://101.102.104.114:80/xeus-gate

			String url = gateUrl + "/getDeviceInfo.json?cctvMgrNo=" + vo.getMgrNo();

			BufferedReader in = null;
			StringBuilder sb = new StringBuilder();

			try {
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

				model.addAttribute("result", sb.toString());
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("error", "XEUS-GATE 요청 실패 (getDeviceInfo)");
			} finally {
				in.close();
			}
		}

    	return "/cctv/unregCctvView";
    }

    /**
     * 프리셋 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getPresetView.do")
    public String getPresetView(Model model) {

    	model.addAttribute("column", col.getList());

    	return "/cctv/presetView";

    }

    /**
     * CCTV 및 미등록 CCTV 리스트를 초기화합니다.
     * GS인증용 미등록 CCTV 기능 시뮬레이터 초기화용입니다.
     *
     * @param model
     * @param session
     * @param vo
     * @throws Exception
     */
    @Deprecated
    @RequestMapping(value = "/initCctv.json", method = RequestMethod.POST)
    public void initCctv(Model model, HttpSession session) throws Exception {

        model.addAttribute("result", cctv.init());

    }

    /**
     * 투망모니터링 우측 패널 뷰를 리턴합니다.
     *
     * @param model
     * @return
     */
    @RequestMapping(value = "/getNetView.do")
    public String getNetView(Model model, @RequestParam HashMap<String, String> map) throws Exception {


        String netDistLimit = "";
        //혹시모를 숫자 외 문자 감지
        final String regex = "^[0-9]*$";
        if(map.containsKey("dist") && !"".equals(map.get("dist")) && map.get("dist").matches(regex)){
            netDistLimit = map.get("dist");
        } else {
            HashMap<String, String> sysMap = new HashMap<String, String>();
            SystemParameter sysParam = new SystemParameter(param.getList(null));
            sysMap = sysParam.getParamMap();
            netDistLimit = sysMap.get("cctv.net_dist_limit");
        }

        model.addAttribute("param", netDistLimit);
        return "/eventMonitor/netView";
    }

    /**
     * 투망모니터링 목록을 리턴합니다.
     *
     * @param model
     * @param session
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getNetCctvList.json", method = RequestMethod.POST)
    public void getNetCctvList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

        String geometry = "";
        CctvVo getGeom = null;
        HashMap<String, String> center = new HashMap<String, String>();

        if(map.containsKey("gid")){
            getGeom = cctv.getItem(map);
            geometry = getGeom.getGeometry();
            center.put("centerX", getGeom.getCenterX());
            center.put("centerY", getGeom.getCenterY());
        } else if(map.containsKey("srid")){
            getGeom = cctv.makeGeometry(map);
            geometry = getGeom.getGeometry();
            center.put("centerX", getGeom.getCenterX());
            center.put("centerY", getGeom.getCenterY());
        }

        if ( !"".equals(geometry) ){

            map.put("geometry", geometry);

            ArrayList<CctvVo> result = new ArrayList<CctvVo>();

            String [] arr = { "top", "rightTop", "right", "rightBottom", "bottom", "leftBottom", "left", "leftTop" };

            if(map.containsKey("gid")) {
                getGeom.setNetSchGbn("center");
                result.add(getGeom);
            }

            //거리제한 파라미터 미입력 시 환경설정 파라미터를 사용한다.
            //혹시 모를 스크립트 오류를 대비해 정규식으로 다시 체크
            final String regex = "^[0-9]*$";
            if(map.containsKey("dist") && !"".equals(map.get("dist")) && map.get("dist").matches(regex)){
                map.put("dist", map.get("dist"));
                center.put("dist", map.get("dist"));
            } else {
                HashMap<String, String> sysMap = new HashMap<String, String>();
                SystemParameter sysParam = new SystemParameter(param.getList(null));
                sysMap = sysParam.getParamMap();
                if(sysMap.containsKey("cctv.net_dist_limit")){
                    map.put("dist", sysMap.get("cctv.net_dist_limit"));
                    center.put("dist", sysMap.get("cctv.net_dist_limit"));
                }
            }

            for (int i=0; i<arr.length; i++){
                map.put("netSchGbn", arr[i]);

                CctvVo rstCctv = cctv.getNetItem(map);
                if (rstCctv == null) rstCctv = new CctvVo();

                rstCctv.setNetSchGbn(arr[i]);

                result.add(rstCctv);
            }

            model.addAttribute("result", result);
            model.addAttribute("center", center);
        } else {
            model.addAttribute("error", "결과가 존재하지 않습니다.");
        }

    }

    /**
     * 180410 이은규
     * CCTV를 삭제합니다.
     *
     * @param model
     * @param session
     * @throws Exception
     */
    @RequestMapping(value = "/delCctv.json", method = RequestMethod.POST)
    public void delCctv(Model model, HttpSession session, @RequestParam(value="k", required=true) String val) throws Exception {

        HashMap<String, String> map = new HashMap<String, String>();
        map.put("mgrNo", val);

        model.addAttribute("result", cctv.del(map));

        //작업 로그 생성
        AssetLogVo logVo = new AssetLogVo();
        logVo.setWorkerId((String) session.getAttribute("userId"));
        logVo.setWorkDat(DateUtil.getStrSec());
        logVo.setWorkGbn("삭제");
        logVo.setAssetMgrNo(val);
        assetLog.add(logVo);

    }

    /**
     * CCTV 단건을 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCctv.json")
    public void getCctv(Model model, @RequestParam HashMap<String, String> map) throws Exception {

    	String originOneCctvNm = StringEscapeUtils.unescapeHtml3(map.get("oneCctvNm"));
    	map.put("oneCctvNm", originOneCctvNm);

        CodeConvertor cde = new CodeConvertor(code.getCdeList());

        JSONObject cctvJson = new JSONObject();
        CctvVo getItem = cctv.getItem(map);

        if(getItem != null){

        	cctvJson.put("cctvNm", getItem.getCctvNm());
        	cctvJson.put("channelNo", getItem.getChnlNo());
        	cctvJson.put("deviceId", getItem.getDeviceId());
        	cctvJson.put("gbnCd", getItem.getGbnCd());
        	cctvJson.put("gbnTxt", cde.convertCodeToName("C14", getItem.getGbnCd()));
        	cctvJson.put("lng", getItem.getLng());
        	cctvJson.put("lat", getItem.getLat());
        	cctvJson.put("useYn", getItem.getUseYn());
        	cctvJson.put("lightYn", getItem.getLightYn());
        	cctvJson.put("infrdYn", getItem.getInfrdYn());
        	cctvJson.put("panYn", getItem.getPanYn());
        	cctvJson.put("tiltYn", getItem.getTiltYn());
        	cctvJson.put("zoomYn", getItem.getZoomYn());
        	cctvJson.put("talkYn", getItem.getTalkYn());
        	cctvJson.put("tourYn", getItem.getTourYn());
        	cctvJson.put("gid", getItem.getGid());
        	cctvJson.put("mgrNo", getItem.getMgrNo());

        	String stateNm = "정상";
        	boolean isError = false;
        	if(getItem.getStateCd() != null && "12".equals(getItem.getStateCd())){
        		stateNm = "장애";
        		isError = true;
        	}
        	cctvJson.put("stateCd", stateNm);
        	cctvJson.put("isError", isError);

        	JSONArray point = new JSONArray();
        	point.add(getItem.getCenterX());
        	point.add(getItem.getCenterY());
        	cctvJson.put("point", point);

        	model.addAttribute("result", cctvJson);

        }else{

        	model.addAttribute("error", "검색된 CCTV가 존재하지 않습니다.");

        }

    }

    /**
     * CCTV 조회 뷰를 리턴합니다.
     *
     * @param model
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvListAsCctvNo.json")
    public void getCctvListAsCctvNo(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        if(map.get("cctvNoList") != null && !"".equals(map.get("cctvNoList"))){
            String[] vals = map.get("cctvNoList").split(",");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("cctvNoList", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }

        model.addAttribute("result", cctv.getList(map));
        model.addAttribute("count", cctv.getCount(map));
    }

    /**
     * CCTV 목적별 히트맵 조회 결과를 리턴합니다.
     *
     * @param model
     * @param map
     * @throws Exception
     */
    @RequestMapping(value = "/getHeatList.json"/*, method = RequestMethod.POST*/)
    public void getHeatList(Model model, @RequestParam HashMap<String, String> map) throws Exception {

        if(map.get("gbnCd") != null && !"".equals(map.get("gbnCd"))){
            String[] vals = map.get("gbnCd").split("\\{\\|\\}");
            for(int i=0; i<vals.length; i++){
                vals[i] = "'" + vals[i] + "'";
            }
            map.put("gbnCd", Arrays.toString(vals).replace("[", "").replace("]", ""));
        }

        model.addAttribute("result", cctv.getCntOfGbnCd(map));
    }

    /**
     * CCTV 사용목적을 조회합니다.
     *
     * @param model
     * @throws Exception
     */
    @RequestMapping(value = "/getCctvGbn.json"/*, method = RequestMethod.POST*/)
    public void getCctvGbn(Model model) throws Exception {
    	//추후 조건 값이 들어갈 수도 있어서 map 파라미터 적용...ㅎㅎㅎ
        model.addAttribute("result", cctv.getGbnNm(null));
    }


}
