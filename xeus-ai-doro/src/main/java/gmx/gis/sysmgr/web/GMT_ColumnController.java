package gmx.gis.sysmgr.web;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.axis.utils.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import gmx.gis.excel.service.GMT_ExcelFileService;
import gmx.gis.layer.service.GMT_LayerImportService;
import gmx.gis.sysmgr.service.GMT_ColumnService;
import gmx.gis.sysmgr.service.GMT_ColumnVo;
import gmx.gis.sysmgr.service.GMT_ListHashMapVo;
import gmx.gis.util.code.GMT_DateUtil;

/**
 *
 * <pre>
 * 테이블의 컬럼 정보를 가져오는 컨트롤러 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/GMT_column")
public class GMT_ColumnController {

	@Autowired private GMT_ColumnService svc;

	@Autowired private GMT_ExcelFileService excel;

	@Autowired private GMT_LayerImportService layer;

	/**
	 * <pre>
	 * 스키마 명칭, 테이블 명칭을 이용하여 대상 테이블의 컬럼 정보를 조회합니다.
	 * </pre>
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getColumnInfo.json", method = RequestMethod.POST)
	public void getLayerList(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", svc.getColumnInfo(map));

	}

	/**
	 * 테이블의 물리 정보(테이블, 컬럼, 자료)를 뷰를 리턴합니다.
	 *
	 * 보안을 위하여 세션에 스키마, 테이블 정보를 저장하여 이후 사용됩니다.
	 *
	 * @param model
	 * @param mgrSeq
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerMetaInfo.do")
	public String getLayerMetaInfoView(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		session.setAttribute("LayerMetaInfoSchema", map.get("schema"));
		session.setAttribute("LayerMetaInfoTable", map.get("table"));
		session.setAttribute("isView", map.get("table").startsWith("v_"));

		return "/GMT/column/featuresInfo";
	}

	/**
	 * 테이블의 물리 정보(테이블, 컬럼, 자료)를 검색합니다.
	 *
	 * @param model
	 * @param mgrSeq
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerMetaInfo.json", method = RequestMethod.POST)
	public void getLayerMetaInfo(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		String schema = (String) session.getAttribute("LayerMetaInfoSchema");
		String table = (String) session.getAttribute("LayerMetaInfoTable");

		if(!StringUtils.isEmpty(schema) && !StringUtils.isEmpty(table)){
			map.put("schema", schema);
			map.put("table", table);

			GMT_ListHashMapVo vo = new GMT_ListHashMapVo();
			if(vo.getKv() == null) vo.setKv(new ArrayList<HashMap<String, Object>>());
			if(vo.getSt() == null) vo.setSt(map);

			model.addAttribute("column", svc.getColumnInfo(vo));
			model.addAttribute("data", svc.getTableValues(vo));
		}else{
			model.addAttribute("error", "조회 가능한 세션 값이 존재하지 않습니다.");
		}

	}

	/**
	 * 레이어 테이블의 컬럼 정보를 반환합니다
	 *
	 * @param model
	 * @param mgrSeq
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLayerFieldInfo.json", method = RequestMethod.POST)
	public void getLayerFieldInfo(Model model, HttpSession session, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", svc.getColumnInfo(map));
//		model.addAttribute("data", svc.getTableValues(map));

	}


	/**
	 * <pre>
	 * 스키마 명칭, 테이블 명칭, 컬럼 명칭을 이용하여 대상 컬럼의 고유한 값을 추출합니다.
	 * </pre>
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDistinctValue.json", method = RequestMethod.POST)
	public void getDistinctValue(Model model, @RequestParam HashMap<String, String> map) throws Exception {

		model.addAttribute("result", svc.getDistinctValue(map));

	}
	/**
	 *  지정한 테이블의 컬럼정보를 조회합니다.
	 *
	 * @param
	 * @return ArrayList<GMT_ColumnVo>
	 * @throws Exception
	 */
	public ArrayList<GMT_ColumnVo> getList() throws Exception {
		ArrayList<GMT_ColumnVo> list = svc.getList();
		return list;
	}

	/**
	 * 객체 통합 검색입니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCommonSearch.json", method = RequestMethod.POST)
	public void getCommonSearch(Model model, HttpSession session, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		if(vo.getKv() == null) vo.setKv(new ArrayList<HashMap<String, Object>>());

		model.addAttribute("result", svc.getCommonSearch(vo));
		model.addAttribute("count", svc.getCommonSearchCount(vo));
		model.addAttribute("sum", svc.getCommonSearchAreaAndLength(vo));

	}

	/**
	 * 객체 통합 검색 결과를 레이어로 생성합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/createSearchResultLayer.json", method = RequestMethod.POST)
	public void createSearchResultLayer(Model model, HttpSession session, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		String userId = (String) session.getAttribute("userId");

		if(!StringUtils.isEmpty(userId)){
			String schema = "public";
			String table = "search_" + userId + "_" + GMT_DateUtil.getStrMilSec();

			vo.getSt().put("newSchema", schema);
			vo.getSt().put("newTable", table);

			if(vo.getKv() == null) vo.setKv(new ArrayList<HashMap<String, Object>>());

			model.addAttribute("result", svc.createSearchResultLayer(vo));

			HashMap<String, String> layerParam = new HashMap<String, String>();
			layerParam.put("schemNm", schema);
			layerParam.put("tblNm", table);
			layerParam.put("lyrNm", vo.getSt().get("layerNm"));
			layerParam.put("lyrTyp", vo.getSt().get("layerTyp"));
			layerParam.put("grpMgrSeq", "3");
			layerParam.put("mkUser", userId);

			layer.importLayer(layerParam);
		}else{
			model.addAttribute("result", false);
			model.addAttribute("error", "세션이 존재하지 않습니다.");
		}

	}

	/**
	 * 객체 통합 검색 결과를 View 레이어로 생성합니다.
	 *
	 * @param model
	 * @param session
	 * @param vo
	 * @throws Exception
	 */
	@RequestMapping(value = "/createSearchResultViewLayer.json", method = RequestMethod.POST)
	public void createSearchResultViewLayer(Model model, HttpSession session, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		String userId = (String) session.getAttribute("userId");

		if(!StringUtils.isEmpty(userId)){
			String schema = "public";
			String table = "v_search_" + userId + "_" + GMT_DateUtil.getStrMilSec();

			vo.getSt().put("newSchema", schema);
			vo.getSt().put("newTable", table);

			if(vo.getKv() == null) vo.setKv(new ArrayList<HashMap<String, Object>>());

			model.addAttribute("result", svc.createSearchResultViewLayer(vo));

			HashMap<String, String> layerParam = new HashMap<String, String>();
			layerParam.put("schemNm", schema);
			layerParam.put("tblNm", table);
			layerParam.put("lyrNm", vo.getSt().get("layerNm"));
			layerParam.put("lyrTyp", vo.getSt().get("layerTyp"));
			layerParam.put("grpMgrSeq", "3");
			layerParam.put("mkUser", userId);

			layer.importLayer(layerParam);
		}else{
			model.addAttribute("result", false);
			model.addAttribute("error", "세션이 존재하지 않습니다.");
		}

	}

	/**
	 * 레이어의 Row 정보를 변경합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/editLayerValue.json", method = RequestMethod.POST)
	public void editLayerValue(Model model, HttpSession session, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		String schema = (String) session.getAttribute("LayerMetaInfoSchema");
		String table = (String) session.getAttribute("LayerMetaInfoTable");

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schema", schema);
		map.put("table", table);

		if(vo.getSt() != null){
			if(!StringUtils.isEmpty(vo.getSt().get("s")) && !StringUtils.isEmpty(vo.getSt().get("t"))){
				map.put("schema", vo.getSt().get("s"));
				map.put("table", vo.getSt().get("t"));
			}
		}

		vo.setSt(map);

		if(!StringUtils.isEmpty(map.get("schema")) && !StringUtils.isEmpty(map.get("table"))){
			model.addAttribute("result", svc.editLayerValue(vo));
		}else{
			model.addAttribute("error", "관리 대상 정보가 세션에서 소멸되었습니다.");
		}

	}

	/**
	 * 레이어의 Row 정보를 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/delLayerValue.json", method = RequestMethod.POST)
	public void delLayerValue(Model model, HttpSession session, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		String schema = (String) session.getAttribute("LayerMetaInfoSchema");
		String table = (String) session.getAttribute("LayerMetaInfoTable");

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schema", schema);
		map.put("table", table);

		vo.setSt(map);

		if(!StringUtils.isEmpty(map.get("schema")) && !StringUtils.isEmpty(map.get("table"))){
			model.addAttribute("result", svc.delLayerValue(vo));
		}else{
			model.addAttribute("error", "관리 대상 정보가 세션에서 소멸되었습니다.");
		}

	}

	/**
	 * 레이어의 Row 정보를 엑셀 파일로 저장합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/createExcel.json", method = RequestMethod.POST)
	public void createExcel(HttpServletResponse res, Model model, HttpSession session, @ModelAttribute GMT_ListHashMapVo vo) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();

		String schema = (String) session.getAttribute("LayerMetaInfoSchema");
		String table = (String) session.getAttribute("LayerMetaInfoTable");
		if(!StringUtils.isEmpty(schema) && !StringUtils.isEmpty(table)){
			map.put("schema", schema);
			map.put("table", table);
		}

		if(vo.getKv() == null) vo.setKv(new ArrayList<HashMap<String, Object>>());
		if(vo.getSt() == null) vo.setSt(map);

		if(StringUtils.isEmpty(vo.getSt().get("schema")) && StringUtils.isEmpty(vo.getSt().get("table"))){

			model.addAttribute("result", false);
			model.addAttribute("error", "[ST is null] 엑셀 추출을 실패하였습니다.");

		}else{

			ArrayList<GMT_ColumnVo> column = svc.getColumnInfo(vo);
			//ArrayList<HashMap<String, String>> data = svc.getTableValues(vo);
			ArrayList<HashMap<String, String>> data = svc.getCommonSearch(vo);

			OutputStream fileOut = null;
			XSSFWorkbook workbook = null;

			try {
				workbook = excel.createExcel(column, data);

				//res.setContentType("ms-vnd/excel");
				res.setContentType("application/octet-stream");
				res.setHeader("Content-Disposition", "inline;filename=GIS_DATA_" + GMT_DateUtil.getStrSec() + ".xlsx");

				fileOut = res.getOutputStream();

				workbook.write(fileOut);
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				if(workbook != null) workbook.close();
				if(fileOut != null) fileOut.close();
			}
		}

	}

	/**
	 * <pre>
	 * DB의 모든 스키마를 가져옵니다.
	 * </pre>
	 *
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAllSchemas.json", method = RequestMethod.POST)
	public void getAllSchemas(Model model) throws Exception {

		model.addAttribute("result", svc.getAllSchemas());
	}

}
