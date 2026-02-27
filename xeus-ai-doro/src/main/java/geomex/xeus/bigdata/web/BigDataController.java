package geomex.xeus.bigdata.web;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.axis.utils.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
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

import geomex.xeus.bigdata.service.BigDataAnalyDataService;
import geomex.xeus.bigdata.service.BigDataAnalyDataVo;
import geomex.xeus.bigdata.service.BigDataAnalyHistService;
import geomex.xeus.bigdata.service.BigDataAnalyHistVo;
import geomex.xeus.bigdata.service.BigDataAnalyUserService;
import geomex.xeus.bigdata.service.BigDataAnalyUserVo;
import geomex.xeus.bigdata.service.BigDataAnalyWeightService;
import geomex.xeus.bigdata.service.BigDataAnalyWeightVo;
import geomex.xeus.bigdata.service.BigDataAnalyzeResultService;
import geomex.xeus.bigdata.service.BigDataAnalyzeService;
import geomex.xeus.bigdata.service.BigDataAnalyzeVo;
import geomex.xeus.bigdata.service.BigDataLayerSetService;
import geomex.xeus.bigdata.service.BigDataLayerSetVo;
import geomex.xeus.bigdata.service.BigDataQueryService;
import geomex.xeus.bigdata.service.CctvInstallService;
import geomex.xeus.bigdata.service.CctvInstallVo;
import geomex.xeus.excel.service.ExcelUtils;
import geomex.xeus.excel.service.HSSFRead;
import geomex.xeus.excel.service.XSSFRead;
import geomex.xeus.map.service.JibunSearchVo;
import geomex.xeus.map.service.SearchService;
import geomex.xeus.sysmgr.service.SysPropService;
import geomex.xeus.util.code.DateUtil;
import geomex.xeus.util.code.SystemParameter;
import geomex.xeus.util.code.ValidInspector;
import geomex.xeus.util.file.ExcelParser;
import gmx.gis.sysmgr.service.GMT_ColumnService;
import gmx.gis.sysmgr.service.GMT_ListHashMapVo;

@Controller
@RequestMapping("/bigData")
public class BigDataController {

	@Autowired private SearchService search;

	@Autowired private BigDataAnalyzeService service;

	@Autowired private BigDataAnalyHistService hist;

	@Autowired private BigDataAnalyWeightService weight;

	@Autowired private BigDataLayerSetService layer;

	@Autowired private BigDataAnalyDataService data;

	@Autowired private BigDataAnalyUserService userData;

	@Autowired private BigDataAnalyzeResultService result;

	@Autowired private BigDataQueryService query;

	@Autowired private CctvInstallService cctv;

	@Autowired private SysPropService param;

	@Autowired private GMT_ColumnService column;

	@Autowired private Validator validator;

	@Resource(name = "txManager") PlatformTransactionManager transactionManager;

	@InitBinder
	private void initBinder(WebDataBinder binder) {
		binder.setValidator(this.validator);
	}

	/**
	 * 빅데이터 분석 뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAnalysisView.do")
	public String getAnalysisView(Model model, HttpServletRequest req, @RequestParam HashMap<String, String> map) throws Exception {

		if (map.get("k") != null && !"".equals(map.get("k"))) model.addAttribute("k", map.get("k"));
		if (map.get("fk") != null && !"".equals(map.get("fk"))) model.addAttribute("fk", map.get("fk"));
		if (map.get("tbl") != null && !"".equals(map.get("tbl"))) model.addAttribute("tbl", map.get("tbl"));

		return "/bigdata/analysisView";

	}

	/**
	 * 빅데이터 분석 결과 엑셀뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getResultExcel.do")
	public String getResultExcel(Model model, HttpServletRequest req, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", result.getList(map));
		model.addAttribute("analyze", service.getItem(map));
		model.addAttribute("map", map);

		return "/bigdata/excelView";

	}

	/**
	 * 빅데이터 옵션을 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAnalysisOption.json")
	public void getAnalysisOption(Model model, HttpServletRequest req, @RequestParam(value = "k", required = true) String val) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("mgrSeq", val);
		model.addAttribute("analyze", this.service.getItem(map));

		map.remove("mgrSeq");
		map.put("analyMgrSeq", val);

		ArrayList<BigDataLayerSetVo> layerList = this.layer.getList(map);
		ArrayList<BigDataAnalyWeightVo> weightList = this.weight.getList(map);

		model.addAttribute("bigdataLayerSet", layerList);
		model.addAttribute("bigdataAnalyWeight", weightList);

	}

	/**
	 * 빅데이터 분석 결과 뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getResultView.do")
	public String getResultView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		return "/bigdata/resultView";

	}

	/**
	 * 빅데이터 분석 이력 뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAnalysHistView.do")
	public String getAnalysHistView(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		String userId = (String) session.getAttribute("userId");
		map.remove("userIds");
		if("geomex".equals(userId) || "임동현01".equals(userId)){
			map.put("userIds", "'" + userId + "', '안찬식01'");
		}else{
			map.put("userId", (String) session.getAttribute("userId"));
		}

		ArrayList<BigDataAnalyzeVo> list = service.getList(map);
		model.addAttribute("result", list);

		ArrayList<BigDataAnalyHistVo> histList = new ArrayList<BigDataAnalyHistVo>();
		for(int i=0; i<list.size(); i++){
			HashMap<String, String> histMap = new HashMap<String, String>();
			histMap.put("analyMgrSeq", list.get(i).getMgrSeq());
			//BigDataAnalyHistVo vo = hist.getItem(histMap);

			ArrayList<BigDataAnalyHistVo> sameList = hist.getList(histMap);
			if(sameList != null){
				for(int l=0; l<sameList.size(); l++){
					histList.add(sameList.get(l));
				}
			}
		}
		model.addAttribute("hist", histList);

		return "/bigdata/analysisHistView";

	}

	/**
	 * 빅데이터 분석 이력을 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAnalysHistList.json")
	public void getAnalysHistList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		ArrayList<BigDataAnalyzeVo> list = service.getList(map);
		model.addAttribute("result", list);

		ArrayList<BigDataAnalyHistVo> histList = new ArrayList<BigDataAnalyHistVo>();
		for(int i=0; i<list.size(); i++){
			HashMap<String, String> histMap = new HashMap<String, String>();
			histMap.put("analyMgrSeq", list.get(i).getMgrSeq());
			histMap.put("analyStartDat", list.get(i).getAnalyDat());
			histMap.put("sortCol", "mgr_seq");
			histMap.put("sortTyp", "desc");
			//BigDataAnalyHistVo vo = hist.getItem(histMap);

			ArrayList<BigDataAnalyHistVo> sameList = hist.getList(histMap);
			if(sameList != null){
				for(int l=0; l<sameList.size(); l++){
					histList.add(sameList.get(l));
				}
			}
		}

		model.addAttribute("hist", histList);

	}

	/**
	 * CCTV 민원 뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSearchView.do")
	public String getSearchView(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("instYear", cctv.getInstYearList(map));

		return "/cctvInstall/searchView";

	}

	/**
	 * CCTV 민원 추가뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAddView.do")
	public String getAddView(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		if (map.get("mgrSeq") != null && !"".equals(map.get("mgrSeq"))) {
			model.addAttribute("vo", cctv.getItem(map));

			if(map.get("isContextMenu") == null || "".equals(map.get("isContextMenu"))){
				session.setAttribute("cctvInstallMgrSeq", map.get("mgrSeq"));
			}
		}


		return "/cctvInstall/regView";

	}

	/**
	 * 분석목록을 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAnalyzeList.json", method = RequestMethod.POST)
	public void getAnalyzeList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		map.put("userId", (String) session.getAttribute("userId"));

		model.addAttribute("result", service.getList(map));

	}

	/**
	 * 분석명칭을 수정합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/editAnalyze.json", method = RequestMethod.POST)
	public void editAnalyze(Model model, HttpSession session, @RequestParam HashMap<String, String> map)
		throws Exception {

		model.addAttribute("result", service.edit(map));

	}

	/**
	 * 분석을 삭제합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/delAnalyze.json", method = RequestMethod.POST)
	public void delAnalyze(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		if("true".equals(map.get("isParent"))){
			boolean result = service.del(map);
			model.addAttribute("result", result);

		}else{
			boolean result = hist.del(map);
			if(result){
				String tbl = map.get("tbl");
				if(tbl != null){
					if(!"".equals(tbl)){
						this.result.dropTable(tbl);
					}
				}
			}
			model.addAttribute("result", result);
		}

	}

	/**
	 * 사용자 데이터를 삭제합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/delUserLayer.json", method = RequestMethod.POST)
	public void delUserLayer(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {
		map.put("userId", (String) session.getAttribute("userId"));
		map.put("layerGbnCd", "11");
		boolean isDel = data.del(map);
		if(isDel){
			data.dropTable(map.get("layerId"));
			model.addAttribute("result", isDel);
		}

	}

	/**
	 * CCTV 민원 결과를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCctvInstallList.json", method = RequestMethod.POST)
	public void getCctvInstallList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		session.setAttribute("cctvInstallParam", map);

		model.addAttribute("result", cctv.getList(map));
		model.addAttribute("count", cctv.getCount(map));

		@SuppressWarnings("unchecked")
		HashMap<String, String> wfsParam = (HashMap<String, String>) map.clone();
		wfsParam.remove("limit");
		wfsParam.remove("offset");
		model.addAttribute("wfs", parseGeoJson(cctv.getList(wfsParam)));

	}

	private JSONObject parseGeoJson(ArrayList<CctvInstallVo> list){
		String tbl = "asset_cctv_install";

		StringBuilder sb = new StringBuilder();
		sb.append("{ \"type\": \"FeatureCollection\",");
		sb.append("\"features\": [");
		int cnt = 0;
		for (int i = 0; i < list.size(); i++) {
			if (cnt > 0) sb.append(",");
			sb.append("{ \"type\": \"Feature\",");
			sb.append("\"id\": \"" + tbl + "." + list.get(i).getMgrSeq() + "\",");
			sb.append("\"geometry\":").append(list.get(i).getGeojson()).append(",");
			sb.append("\"properties\": {");

			String propStr = "\"typename\":" + "\"" + tbl + "\",";

			propStr += "\"mgrSeq\":" + "\"" + String.valueOf(list.get(i).getMgrSeq()) + "\",";
			propStr += "\"instYear\":" + "\"" + String.valueOf(list.get(i).getInstYear()) + "\",";
			propStr += "\"instMon\":" + "\"" + String.valueOf(list.get(i).getInstMon()) + "\",";
			propStr += "\"instDay\":" + "\"" + String.valueOf(list.get(i).getInstDay()) + "\",";
			propStr += "\"emd\":" + "\"" + String.valueOf(list.get(i).getEmd()) + "\",";
			propStr += "\"bjd\":" + "\"" + String.valueOf(list.get(i).getBjd()) + "\",";
			propStr += "\"san\":" + "\"" + String.valueOf(list.get(i).getSan()) + "\",";
			propStr += "\"jibun\":" + "\"" + String.valueOf(list.get(i).getJibun()) + "\",";
			propStr += "\"lon\":" + "\"" + String.valueOf(list.get(i).getLon()) + "\",";
			propStr += "\"lat\":" + "\"" + String.valueOf(list.get(i).getLat()) + "\",";
			propStr += "\"regReqOne\":" + "\"" + String.valueOf(list.get(i).getRegReqOne()) + "\",";
			propStr += "\"regReqTwo\":" + "\"" + String.valueOf(list.get(i).getRegReqTwo()) + "\",";
			propStr += "\"instYn\":" + "\"" + String.valueOf(list.get(i).getInstYn()) + "\",";

			sb.append(propStr.substring(0, propStr.length() - 1));

			cnt++;
			sb.append("}"); //properties end
			sb.append("}");
		}
		sb.append("]");
		sb.append("}");

		JSONParser parser = new JSONParser();
		JSONObject json = null;

		try {
			json = (JSONObject) parser.parse(sb.toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return json;
	}

	/**
	 * CCTV 민원 결과 단건을 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCctvInstallItem.json", method = RequestMethod.POST)
	public void getCctvInstallItem(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", cctv.getItem(map));

	}

	/**
	 * CCTV 민원 결과를 추가합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addCctvInstall.json", method = RequestMethod.POST)
	public void addCctvInstall(Model model, @ModelAttribute @Valid CctvInstallVo vo, BindingResult br)
		throws Exception {

		String[] ignoreField = { "" };
		String msg = ValidInspector.findError(br, ignoreField);

		if ("pass".equals(msg)) {

			model.addAttribute("result", cctv.add(vo));

		} else {
			model.addAttribute("error", msg);
		}

	}

	/**
	 * 빅데이터 분석 결과 엑셀뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCctvInstallExcel.do")
	public String getCctvInstallExcel(Model model, HttpServletRequest req, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", cctv.getList(map));

		return "/cctvInstall/excelView";

	}

	/**
	 * CCTV 민원 결과 엑셀을 추가합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addCctvInstallExcel.json", method = RequestMethod.POST)
	public void addCctvInstallExcel(Model model, HttpSession session, @RequestPart("file") MultipartFile file) throws Exception {

		if (file == null) {
			model.addAttribute("error", "파일이 선택되지 않았습니다.");
		} else {
			try {

				String userId = (String) session.getAttribute("userId");
				String splitData[] = file.getOriginalFilename().split("\\.");
				String type = "." + splitData[(splitData.length) - 1];
				String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();

				SystemParameter sysParam = new SystemParameter(param.getList(null));

				HashMap<String, String> map = null;
				map = sysParam.getParamMap();

				String path = map.get("sys.upload_path") + "cctvInstall" + "/" + userId;

				File chkDir = new File(path);
				if (!chkDir.isDirectory()) {
					try {
						chkDir.mkdirs();
					} catch (Exception e) {}
				}

				if (ValidInspector.isBigDataExtension(type)) {

					String fullPath = path + "/" + realFileNm;
					File xlx = new File(fullPath);
					file.transferTo(xlx);

					ArrayList<CctvInstallVo> result = new ArrayList<CctvInstallVo>();

					if(ExcelUtils.getFileExt(xlx.getName()).equals("xlsx")){
						result = new XSSFRead(xlx).getCustomData("Sheet1");
					}else{
						result = new HSSFRead(xlx).getCustomData("Sheet1");
					}

					if(result.size() == 0){
						model.addAttribute("error", "추가 할 데이터가 존재하지 않습니다.");
					}else{
						TransactionStatus txStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());

						try {
							model.addAttribute("result", cctv.addExcel(result));
							model.addAttribute("list", result);
							transactionManager.commit(txStatus);
						} catch (Exception e) {
							transactionManager.rollback(txStatus);
							model.addAttribute("error", "롤백처리 되었습니다.\n데이터(위치정보, 문자길이 등)를 확인해주세요.");
							e.printStackTrace();
						}
					}

				} else {
					model.addAttribute("error", "파일은 엑셀 파일만 업로드 할 수 있습니다.");
				}
			} catch (Exception e) {
				model.addAttribute("error", "파일 분석중 문제가 발생하였습니다.");
				e.printStackTrace();
			}
		}

	}

	/**
	 * CCTV 민원을 삭제합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/delCctvInstall.json", method = RequestMethod.POST)
	public void delInfra(Model model, HttpSession session, @RequestParam(value = "k", required = true) String val)
		throws Exception {

		HashMap<String, String> param = new HashMap<String, String>();
		param.put("mgrSeq", val);

		model.addAttribute("result", cctv.del(param));

	}

	/**
	 * CCTV 민원 결과를 수정합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editCctvInstall.json", method = RequestMethod.POST)
	public void editCctvInstall(Model model, @ModelAttribute @Valid CctvInstallVo vo, BindingResult br)
		throws Exception {

		String[] ignoreField = { "" };
		String msg = ValidInspector.findError(br, ignoreField);

		if ("pass".equals(msg)) {

			model.addAttribute("result", cctv.edit(vo));

		} else {
			model.addAttribute("error", msg);
		}

	}

	/**
	 * <b style="color: red;">신형 통플에서는 사용되지 않습니다.</b><br><br>
	 *
	 * 사용자 엑셀 레이어를 리턴합니다.
	 *
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/getUserLayer.json", method = RequestMethod.POST)
	public void getUserLayer(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		map.put("layerGbnCdNot", "11");
		ArrayList<BigDataAnalyDataVo> result = data.getList(map);
		map.remove("layerGbnCdNot");

		String userId = (String) session.getAttribute("userId");
		map.remove("userIds");
		if("geomex".equals(userId) || "임동현01".equals(userId)){
			map.put("userIds", "'" + userId + "', '안찬식01'");
		}else{
			map.put("userId", (String) session.getAttribute("userId"));
		}

		map.put("layerGbnCd", "11");
		ArrayList<BigDataAnalyDataVo> usrList = data.getList(map);

		if (usrList.size() > 0) {
			for (int i = 0; i < usrList.size(); i++) {
				result.add(usrList.get(i));
			}
		}

		model.addAttribute("result", result);

	}

	/**
	 * 빅데이터 분석옵션을 수정합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editAnalys.json")
	public void editAnalys(Model model, HttpSession session, @RequestParam(value = "json", required = true) String val,
															 @RequestParam(value = "k", required = true) String mgrSeq,
															 @RequestParam(value = "fk", required = true) String analyMgrSeq,
															 @RequestParam(value = "tbl", required = true) String delTbl)
		throws Exception {

		boolean result = true;

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("analyMgrSeq", analyMgrSeq);

		BigDataAnalyzeVo analyze = null;

		ArrayList<BigDataLayerSetVo> originLayer = this.layer.getList(map);
		ArrayList<BigDataAnalyWeightVo> originWeight = this.weight.getList(map);

		try {
			this.layer.del(map);
			this.weight.del(map);

			ArrayList<BigDataLayerSetVo> layerList = new ArrayList<BigDataLayerSetVo>();
			ArrayList<BigDataAnalyWeightVo> weightList = new ArrayList<BigDataAnalyWeightVo>();

			JSONParser parser = new JSONParser();
			JSONObject parent = (JSONObject) parser.parse(val);

			if(parent.containsKey("bigdataLayerSet")){
				JSONObject bigdataLayerSet = (JSONObject) parent.get("bigdataLayerSet");
				for(Object tbl : bigdataLayerSet.keySet()){
					String tblId = (String) tbl;

					JSONObject layerSet = (JSONObject) bigdataLayerSet.get(tblId);
					for(Object k : layerSet.keySet()){
						String col = (String) k;

						JSONObject colSet = (JSONObject) layerSet.get(col);
						BigDataLayerSetVo vo = new BigDataLayerSetVo();

						vo.setAnalyMgrSeq(analyMgrSeq);
						vo.setLayerId((String) colSet.get("layerId"));
						vo.setLayerNm((String) colSet.get("layerNm"));
						vo.setLayerSeq((String) colSet.get("layerSeq"));
						vo.setItemNm((String) colSet.get("itemNm"));
						vo.setWeightVal((String) colSet.get("weightVal"));

						this.layer.add(vo);

						layerList.add(vo);
					}
				}
			}

			if(parent.containsKey("bigdataAnalyWeight")){
				JSONObject bigdataAnalyWeight = (JSONObject) parent.get("bigdataAnalyWeight");
				for(Object tbl : bigdataAnalyWeight.keySet()){
					String tblId = (String) tbl;

					JSONObject layerSet = (JSONObject) bigdataAnalyWeight.get(tblId);
					for(Object k : layerSet.keySet()){
						String col = (String) k;

						JSONObject colSet = (JSONObject) layerSet.get(col);
						BigDataAnalyWeightVo vo = new BigDataAnalyWeightVo();

						vo.setAnalyMgrSeq(analyMgrSeq);
						vo.setLayerId((String) colSet.get("layerId"));
						vo.setItemNm((String) colSet.get("itemNm"));
						vo.setOpeStr((String) colSet.get("opeStr"));
						vo.setWeightVal((String) colSet.get("weightVal"));
						vo.setImpactM((String) colSet.get("impactM"));

						this.weight.add(vo);

						weightList.add(vo);
					}
				}
			}

			HashMap<String, String> analyMap = new HashMap<String, String>();
			analyMap.put("mgrSeq", analyMgrSeq);
			analyMap.put("userId", (String) session.getAttribute("userId"));
			//analyMap.put("rqstDat", DateUtil.getStrSec());
			//analyMap.put("analyState", "11");
			analyze = service.getItem(analyMap);
			if(analyze != null){
				analyze.setRqstDat(DateUtil.getStrSec());
				analyze.setAnalyState("11");
				service.edit(analyze);
				this.result.dropTable(delTbl);

				HashMap<String, String> histMap = new HashMap<String, String>();
				histMap.put("mgrSeq", mgrSeq);
				histMap.put("analyMgrSeq", analyMgrSeq);
				this.hist.del(histMap);
			}

		} catch (Exception e) {
			this.layer.del(map);
			this.weight.del(map);

			for (int i = 0; i < originLayer.size(); i++) {
				this.layer.add(originLayer.get(i));
			}

			for (int i = 0; i < originWeight.size(); i++) {
				this.weight.add(originWeight.get(i));
			}

			result = false;

			e.printStackTrace();
		}

		if(result) model.addAttribute("analyze", analyze);
		model.addAttribute("result", result);

	}

	/**
	 * 빅데이터 분석옵션을 저장합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/startAnalys.json")
	public void startAnalys(Model model, HttpSession session, @RequestParam(value = "json", required = true) String val,
															  @RequestParam(value = "analyNm", required = true) String analyNm,
															  @RequestParam(value = "analyPlan", required = true) String analyPlan) throws Exception {

		String userId = (String) session.getAttribute("userId");

		if(userId == null || "".equals(userId)){
			model.addAttribute("error", "분석시작중 문제가 발생하였습니다.\n\nNull Session.");
		}else{

			boolean result = true;

			BigDataAnalyzeVo analyze = new BigDataAnalyzeVo();
			analyze.setAnalyNm(analyNm);
			analyze.setAnalyPlan(analyPlan);
			analyze.setUserId(userId);
			analyze.setAnalyDat(DateUtil.getStrSec());
			analyze.setAnalyState("11");

			try {
				this.service.add(analyze);

				ArrayList<BigDataLayerSetVo> layerList = new ArrayList<BigDataLayerSetVo>();
				ArrayList<BigDataAnalyWeightVo> weightList = new ArrayList<BigDataAnalyWeightVo>();

				JSONParser parser = new JSONParser();
				JSONObject parent = (JSONObject) parser.parse(val);

				if(parent.containsKey("bigdataLayerSet")){
					JSONObject bigdataLayerSet = (JSONObject) parent.get("bigdataLayerSet");
					for(Object tbl : bigdataLayerSet.keySet()){
						String tblId = (String) tbl;

						JSONObject layerSet = (JSONObject) bigdataLayerSet.get(tblId);
						for(Object k : layerSet.keySet()){
							String col = (String) k;

							JSONObject colSet = (JSONObject) layerSet.get(col);
							BigDataLayerSetVo vo = new BigDataLayerSetVo();

							vo.setAnalyMgrSeq(analyze.getMgrSeq());
							vo.setLayerId((String) colSet.get("layerId"));
							vo.setLayerNm((String) colSet.get("layerNm"));
							vo.setLayerSeq((String) colSet.get("layerSeq"));
							vo.setItemNm((String) colSet.get("itemNm"));
							vo.setWeightVal((String) colSet.get("weightVal"));

							this.layer.add(vo);

							layerList.add(vo);
						}
					}
				}

				if(parent.containsKey("bigdataAnalyWeight")){
					JSONObject bigdataAnalyWeight = (JSONObject) parent.get("bigdataAnalyWeight");
					for(Object tbl : bigdataAnalyWeight.keySet()){
						String tblId = (String) tbl;

						JSONObject layerSet = (JSONObject) bigdataAnalyWeight.get(tblId);
						for(Object k : layerSet.keySet()){
							String col = (String) k;

							JSONObject colSet = (JSONObject) layerSet.get(col);
							BigDataAnalyWeightVo vo = new BigDataAnalyWeightVo();

							vo.setAnalyMgrSeq(analyze.getMgrSeq());
							vo.setLayerId((String) colSet.get("layerId"));
							vo.setItemNm((String) colSet.get("itemNm"));
							vo.setOpeStr((String) colSet.get("opeStr"));
							vo.setWeightVal((String) colSet.get("weightVal"));
							vo.setImpactM((String) colSet.get("impactM"));

							this.weight.add(vo);

							weightList.add(vo);
						}
					}
				}

				/*
				 * if("I:00:00".equals(analyPlan)){ HashMap<String, Object> analyzeParam = new HashMap<String, Object>();
				 * analyzeParam.put("analyMgrSeq", analyze.getMgrSeq()); analyzeParam.put("layerList", layerList);
				 * query.analyze(analyzeParam); }
				 */
			} catch (Exception e) {
				HashMap<String, String> map = new HashMap<String, String>();
				map.put("analyMgrSeq", analyze.getMgrSeq());
				this.layer.del(map);
				this.weight.del(map);

				result = false;

				e.printStackTrace();
			}

			if(result) model.addAttribute("analyze", analyze);
			model.addAttribute("result", result);

		}

	}

	/**
	 * <b style="color: red;">신형 통플에서는 사용되지 않습니다.</b><br><br>
	 *
	 * 엑셀을 업로드합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/addFile.json", method = RequestMethod.POST)
	public void addMultiple(Model model, HttpSession session, @ModelAttribute @Valid BigDataAnalyDataVo vo, @RequestPart("file") MultipartFile file, BindingResult br) throws Exception {

		// https://jiggag.github.io/spring-poi-excel-read/
		// http://daydreamer-92.tistory.com/42

		if (file == null) {
			model.addAttribute("error", "파일이 선택되지 않았습니다.");
		} else {
			try {
				String userId = (String) session.getAttribute("userId");

				String splitData[] = file.getOriginalFilename().split("\\.");
				String type = "." + splitData[(splitData.length) - 1];
				String realFileNm = DateUtil.getStrMilSec() + "-" + file.getOriginalFilename();

				SystemParameter sysParam = new SystemParameter(param.getList(null));

				HashMap<String, String> map = null;
				map = sysParam.getParamMap();

				String path = map.get("sys.upload_path") + "bigdata" + "/" + userId;

				File chkDir = new File(path);
				if (!chkDir.isDirectory()) {
					try {
						chkDir.mkdirs();
					} catch (Exception e) {}
				}

				if (ValidInspector.isBigDataExtension(type)) {

					String fullPath = path + "/" + realFileNm;
					String msg = ValidInspector.findError(br);

					if ("pass".equals(msg)) {
						vo.setUserId((String) session.getAttribute("userId"));
						vo.setRegDat(DateUtil.getStrSec());
						vo.setLayerGbnCd("11");
						vo.setFileNm(file.getOriginalFilename());
						vo.setFilePath(fullPath);

						model.addAttribute("bigDataAnalyDataVo", null);
						model.addAttribute("result", data.add(vo));
						session.setAttribute("bigDataAnalyDataVo", vo);

						File xlx = new File(fullPath);
						file.transferTo(xlx);

						ExcelParser parser;
						try {
							//parser = new ExcelParser("D:/DRM/00.XEUS-PLATFORM/UPLOAD_FILES/bigdata/geomex/20181107095242803-빅데이터양식.xlsx");
							parser = new ExcelParser(fullPath, vo.getGeomType());
							ArrayList<String> title = parser.parseTitle();
							ArrayList<ArrayList<BigDataAnalyUserVo>> body = parser.parseBody();

							for (int i=0; i<body.size(); i++) {
								ArrayList<BigDataAnalyUserVo> list = body.get(i);

								for (int l=0; l<list.size(); l++) {
									BigDataAnalyUserVo voParam = list.get(l);
									voParam.setLayerId(vo.getLayerNm());

									if(voParam.getIsPoint() && !voParam.getIsError()){
										if(voParam.getLon() == null || "".equals(voParam.getLon())
										|| voParam.getLat() == null || "".equals(voParam.getLat())){

											HashMap<String, String> geomParam = new HashMap<String, String>();
											geomParam.put("jibun", voParam.getJibnAddr());
											geomParam.put("doro", voParam.getRoadAddr());
											geomParam.put("geomType", vo.getGeomType());

											ArrayList<JibunSearchVo> jibunVo = search.getAddrSearchJibun(geomParam);
											if(jibunVo.size() > 0){
												voParam.setJibnPnu(jibunVo.get(0).getPnu());
												voParam.setJibnAddr(jibunVo.get(0).getJibun());
												voParam.setRoadAddr(jibunVo.get(0).getBldgNo());
												voParam.setLon(jibunVo.get(0).getLon());
												voParam.setLat(jibunVo.get(0).getLat());
												voParam.setGeometry(jibunVo.get(0).getGeometry());
											}else{
												if(!"".equals(voParam.getLon()) && !"".equals(voParam.getLat())){
													geomParam.put("jibun", "");
													geomParam.put("doro", "");
													geomParam.put("lon", voParam.getLon());
													geomParam.put("lat", voParam.getLat());
													jibunVo = search.getAddrSearchJibun(geomParam);
												}

												if(jibunVo.size() == 0 || jibunVo.size() > 100){
													voParam.setIsError(true);
												}else{
													voParam.setJibnPnu(jibunVo.get(0).getPnu());
													voParam.setJibnAddr(jibunVo.get(0).getJibun());
													voParam.setRoadAddr(jibunVo.get(0).getBldgNo());
													voParam.setLon(jibunVo.get(0).getLon());
													voParam.setLat(jibunVo.get(0).getLat());
													voParam.setGeometry(jibunVo.get(0).getGeometry());
												}
											}
										}
									}

									if(!voParam.getIsPoint() && !voParam.getIsError()){
										HashMap<String, String> geomParam = new HashMap<String, String>();
										geomParam.put("jibun", voParam.getJibnAddr());
										geomParam.put("doro", voParam.getRoadAddr());
										geomParam.put("geomType", vo.getGeomType());

										ArrayList<JibunSearchVo> jibunVo = search.getAddrSearchJibun(geomParam);
										if(jibunVo.size() > 0){
											voParam.setJibnPnu(jibunVo.get(0).getPnu());
											voParam.setJibnAddr(jibunVo.get(0).getJibun());
											voParam.setRoadAddr(jibunVo.get(0).getBldgNo());
											voParam.setLon(jibunVo.get(0).getLon());
											voParam.setLat(jibunVo.get(0).getLat());
											voParam.setGeometry(jibunVo.get(0).getGeometry());
										}else{
											if(!"".equals(voParam.getLon()) && !"".equals(voParam.getLat())){
												geomParam.put("jibun", "");
												geomParam.put("doro", "");
												geomParam.put("lon", voParam.getLon());
												geomParam.put("lat", voParam.getLat());
												jibunVo = search.getAddrSearchJibun(geomParam);
											}

											if(jibunVo.size() == 0 || jibunVo.size() > 100){
												voParam.setIsError(true);
											}else{
												voParam.setJibnPnu(jibunVo.get(0).getPnu());
												voParam.setJibnAddr(jibunVo.get(0).getJibun());
												voParam.setRoadAddr(jibunVo.get(0).getBldgNo());
												voParam.setLon(jibunVo.get(0).getLon());
												voParam.setLat(jibunVo.get(0).getLat());
												voParam.setGeometry(jibunVo.get(0).getGeometry());
											}
										}
									}

								}
							}

							model.addAttribute("header", title);
							model.addAttribute("body", body);

							session.setAttribute("excelHeader", title);
							session.setAttribute("excelData", body);
							session.setAttribute("excelDataPath", fullPath);
						} catch (IOException e) {
							e.printStackTrace();
						}
					} else {
						model.addAttribute("error", msg);
					}
				} else {
					model.addAttribute("error", "파일은 엑셀 파일만 업로드 할 수 있습니다.");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * <b style="color: red;">신형 통플에서는 사용되지 않습니다.</b><br><br>
	 *
	 * 엑셀 분석내용을 삭제하거나 추가합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = { "/commitData.json", "/rollbackData.json" }, method = RequestMethod.POST)
	public void commitData(HttpServletRequest req, Model model, HttpSession session, @RequestParam HashMap<String, String> fieldType) throws Exception {

		String[] full_url = req.getRequestURI().split("/");
		String url = full_url[full_url.length - 1];

		String errMsg = "";
		String tblId = "";
		String tblNm = "";
		String tblTyp = "";
		BigDataAnalyDataVo vo = (BigDataAnalyDataVo) session.getAttribute("bigDataAnalyDataVo");

		try {

			if ("rollbackData.json".equals(url)) {
				errMsg = "롤백중 문제가 발생하였습니다.";

				data.delByVo(vo);
				File xlx = new File((String) session.getAttribute("excelDataPath"));
				if (xlx.exists()) xlx.delete();

			} else if ("commitData.json".equals(url)) {
				errMsg = "저장중 문제가 발생하였습니다.";

				@SuppressWarnings("unchecked")
				ArrayList<String> title = (ArrayList<String>) session.getAttribute("excelHeader");

				@SuppressWarnings("unchecked")
				ArrayList<ArrayList<BigDataAnalyUserVo>> body = (ArrayList<ArrayList<BigDataAnalyUserVo>>) session.getAttribute("excelData");
				if (body != null) {
					String tempLayerId = vo.getLayerId();

					HashMap<String, String> map = new HashMap<String, String>();

					map.put("type", "bigdata_usr1");
					HashMap<String, String> point = data.getTableNameList(map);

					map.put("type", "bigdata_usr6");
					HashMap<String, String> plygn = data.getTableNameList(map);


					/*String tblId = (String) map.get("tblId");
					String tblNm = (String) map.get("tblNm");
					String tblTyp = (String) map.get("tblTyp");
					@SuppressWarnings("unchecked")
					ArrayList<String> column = (ArrayList<String>) map.get("column");*/

					boolean createResult = false;

					boolean isPoint = true;
					if(body.size() > 0){
						if(body.get(0) != null){
							if(body.get(0).size() > 0){
								if(body.get(0).get(0) != null){
									isPoint = body.get(0).get(0).getIsPoint();

									ArrayList<String> column = new ArrayList<String>();
									tblNm = body.get(0).get(0).getLayerId();
									if(isPoint){
										tblId = point.get("val");
										tblTyp = "point";
									}else{
										tblId = plygn.get("val");
										tblTyp = "polygon";
									}

									for(int i=4; i<title.size(); i++){
										String fieldNm = title.get(i);
										if(!column.contains(fieldNm)){
											column.add(fieldNm);
										}
									}

									/*if(isPoint){
										tblId = point.get("val");
										tblNm = body.get(0).get(0).getLayerId();
										tblTyp = "point";

										for(int i=2; i<title.size(); i++){
											String fieldNm = title.get(i);
											if(!column.contains(fieldNm)){
												column.add(fieldNm);
											}
										}
									}else{
										tblId = plygn.get("val");
										tblNm = body.get(0).get(0).getLayerId();
										tblTyp = "polygon";

										for(int i=4; i<title.size(); i++){
											String fieldNm = title.get(i);
											if(!column.contains(fieldNm)){
												column.add(fieldNm);
											}
										}
									}*/

									HashMap<String, Object> tblParam = new HashMap<String, Object>();
									tblParam.put("tblId", tblId);
									tblParam.put("tblNm", tblNm);
									tblParam.put("tblTyp", tblTyp);
									tblParam.put("column", column);
									tblParam.put("fieldType", fieldType);

									createResult = query.createLayerTable(tblParam);
									if(createResult) query.insertLayerTable(tblParam, body);
								}
							}
						}
					}


					// 임시 레이어명을 실제 레이어명으로 변경
					map.put("oldLayerId", tempLayerId);
					if (isPoint) {
						map.put("newLayerId", tblId);
					} else {
						map.put("newLayerId", tblId);
					}
					data.editLayerId(map);
				}
			}
			model.addAttribute("result", true);

		} catch (Exception e) {
			model.addAttribute("error", errMsg);
			e.printStackTrace();

			data.delByVo(vo);
			File xlx = new File((String) session.getAttribute("excelDataPath"));
			if (xlx.exists()) xlx.delete();
			userData.dropTable(tblId);
		}

		session.removeAttribute("bigDataAnalyDataVo");
		session.removeAttribute("excelDataPath");
		session.removeAttribute("excelHeader");
		session.removeAttribute("excelData");
	}

	/**
	 * 분석결과 WFS 를 리턴합니다.
	 *
	 * @param model
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAnalyzeLayer"/* , method = RequestMethod.POST */)
	public void getWfs(HttpServletResponse res, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		res.setCharacterEncoding("UTF-8");
		res.setContentType("application/json");

		map.put("tbl", map.get("tblId"));

		ArrayList<HashMap<String, String>> list = service.getWfs(map);

		StringBuilder sb = new StringBuilder();
		sb.append("{ \"type\": \"FeatureCollection\",");
		sb.append("\"features\": [");
		int cnt = 0;
		for (int i = 0; i < list.size(); i++) {
			HashMap<String, String> hash = list.get(i);
			Set<String> key = hash.keySet();
			Iterator<String> itr = key.iterator();

			if (cnt > 0) sb.append(",");
			sb.append("{ \"type\": \"Feature\",");
			sb.append("\"id\": \"" + map.get("tbl") + "." + String.valueOf(hash.get("_gid")) + "\",");
			sb.append("\"geometry\":").append(hash.get("geojson")).append(",");
			sb.append("\"properties\": {");

			String propStr = "\"typename\":" + "\"" + map.get("tbl") + "\",";
			while (itr.hasNext()) {
				String k = (String) itr.next();
				if (!"geojson".equals(k) && !"_geometry".equals(k)) {
					propStr += "\"" + k + "\":" + "\"" + String.valueOf(hash.get(k)) + "\",";
				}
			}
			sb.append(propStr.substring(0, propStr.length() - 1));

			cnt++;
			sb.append("}"); //properties end
			sb.append("}");
		}
		sb.append("]");
		sb.append("}");

		res.getWriter().print(sb.toString());

	}

	/**
	 * 테이블의 물리 정보(테이블, 컬럼, 자료)를 검색합니다.
	 *
	 * @param model
	 * @param mgrSeq
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerMetaInfo.json", method = RequestMethod.POST)
	public void getLayerMetaInfo(Model model, HttpSession session, @RequestParam String s, @RequestParam String t) throws Exception {

		if(!StringUtils.isEmpty(s) && !StringUtils.isEmpty(t)){
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("schema", s);
			map.put("table", t);

			map.put("limit", "100");
			map.put("offset", "0");

			GMT_ListHashMapVo vo = new GMT_ListHashMapVo();
			if(vo.getKv() == null) vo.setKv(new ArrayList<HashMap<String, Object>>());
			if(vo.getSt() == null) vo.setSt(map);

			model.addAttribute("column", column.getColumnInfo(vo));
			model.addAttribute("result", column.getTableValues(vo));
			model.addAttribute("count", column.getTableCountValue(vo));
		}else{
			model.addAttribute("error", "정보 조회를 실패하였습니다.");
		}

	}

	/**
	 * 최소, 최대값을 리턴합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getMinMax.json")
	public void getMinMax(Model model, HttpSession session, @RequestParam HashMap<String, String> map)
		throws Exception {

		model.addAttribute("result", result.getMinMaxList(map));

	}

	/**
	 * 상세값을 리턴합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDetailResult.json")
	public void getDetailResult(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", result.getList(map));
		model.addAttribute("count", result.getCount(map));

	}

	/**
	 * 분석명을 수정합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/editAnalzeName.json")
	public void editAnalzeName(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", service.edit(map));

	}

	/**
	 * 분석결과 리스트를 리턴합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAnalyzeResult.json")
	public void getAnalyzeResult(Model model, HttpSession session, @RequestParam HashMap<String, String> map, Writer writer) throws Exception {
		query.getResultAsHeatMapFastJson(map, writer);
	}

	/**
	 * <b style="color: red;">신형 통플에서는 사용되지 않습니다.</b><br><br>
	 *
	 * 공간정보 관리 뷰를 리턴합니다.
	 *
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/getGeometryDrawView.do")
	public String getGeometryDrawView(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		return "/bigdata/dataDrawView";

	}

	/**
	 * <b style="color: red;">신형 통플에서는 사용되지 않습니다.</b><br><br>
	 *
	 * 사용자 공간정보 테이블을 생성합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/createUserLayer.json")
	public void createUserLayer(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		BigDataAnalyDataVo vo = new BigDataAnalyDataVo();
		boolean isAddSuccess = false;
		String mode = map.get("mode");
		String layerId = map.get("layerId");

		try {
			JSONParser parser = new JSONParser();

			JSONObject obj = (JSONObject) parser.parse(map.get("json"));

			String title = (String) obj.get("title");

			JSONArray headJson = (JSONArray) obj.get("head");
			JSONArray bodyJson = (JSONArray) obj.get("body");

			HashMap<String, String> param = new HashMap<String, String>();
			param.put("type", "bigdata_usr6");
			HashMap<String, String> plygn = data.getTableNameList(param);


			HashMap<String, Object> tblParam = new HashMap<String, Object>();
			if("add".equals(mode)){
				tblParam.put("tblId", plygn.get("val"));
			}else{
				tblParam.put("tblId", layerId);
			}
			tblParam.put("tblNm", title);
			tblParam.put("column", headJson);

			vo.setLayerId((String) tblParam.get("tblId"));
			vo.setUserId((String) session.getAttribute("userId"));
			vo.setLayerNm(title);
			vo.setRegDat(DateUtil.getStrSec());
			vo.setLayerGbnCd("11");
			vo.setIsDraw("Y");
			vo.setAttrJson(map.get("json"));

			if("add".equals(mode)){
				isAddSuccess = data.add(vo);
			}else{
				isAddSuccess = data.edit(vo);
			}
			if(isAddSuccess){
				boolean createResult = query.createDrawLayerTable(tblParam);
				if(createResult) query.insertDrawLayerTable(tblParam, bodyJson);
			}

			model.addAttribute("result", true);
		} catch (Exception e) {
			if(isAddSuccess) data.delByVo(vo);
			model.addAttribute("error", "데이터 분석중 에러가 발생하였습니다.");
			e.printStackTrace();
		}
	}

	/**
	 * <b style="color: red;">신형 통플에서는 사용되지 않습니다.</b><br><br>
	 *
	 * 사용자 공간정보 테이블을 생성합니다.
	 *
	 * @param model
	 * @param param
	 * @param br
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	@RequestMapping(value = "/getDrawUserLayers.json")
	public void getDrawUserLayers(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		map.put("userId", (String) session.getAttribute("userId"));
		map.put("layerGbnCd", "11");
		map.put("isDraw", "Y");

		model.addAttribute("result", data.getList(map));

	}

}
