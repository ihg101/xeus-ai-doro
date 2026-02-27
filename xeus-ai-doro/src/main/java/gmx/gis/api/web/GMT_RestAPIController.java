package gmx.gis.api.web;

import java.util.Base64;
import java.util.HashMap;
import java.util.UUID;
import java.util.Base64.Decoder;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import geomex.xeus.system.annotation.NoSession;
import gmx.gis.api.service.GMT_RestAPIService;
import gmx.gis.api.service.GMT_RestAPIVo;
import gmx.gis.sysmgr.service.GMT_ColumnService;
import gmx.gis.sysmgr.service.GMT_ListHashMapVo;

/**
 *
 * <pre>
 * 시설물 관리를 위한 REST API를 제공합니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Controller
@RequestMapping("/rest")
public class GMT_RestAPIController {

	@Autowired private GMT_RestAPIService svc;

	@Autowired private GMT_ColumnService column;

	/**
	 * 시설물을 관리합니다.
	 *
	 * 필수) facilityId - 물리 Table ID / Base64 Encoding
	 * 선택) geolocationLon - 경도
	 * 선택) geolocationLat - 위도
	 * 선택) featureTargetKey - 수정 대상 키 필드 / Base64 Encoding
	 * 선택) featureTargetVal - 수정 대상 키 필드 값 / Base64 Encoding
	 *
	 * TODO 1. featureTargetKey + featureTargetVal 목록 검색 기능 (해당 기능 선행 후 edit, del 사용 가능
	 * TODO 2. featureTargetKey + featureTargetVal 요청 후 두 값 조합시 갯수가 Multiple 인 경우 고려
	 * TODO 3. Poing 타입이 아닌 객체는 공간정보 제외 해야 할듯
	 *
	 * @param response
	 * @param mode
	 * @param map
	 * @throws Exception
	 */
	@NoSession
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/facility/{mode}", method = RequestMethod.POST)
	public void facilityManage(HttpServletResponse response, @PathVariable String mode,
															 @RequestHeader(required = false) String facilityId,
															 @RequestHeader(required = false) String Authorization,
															 @RequestHeader(required = false) String featureTargetKey,
															 @RequestHeader(required = false) String featureTargetVal,
															 @RequestHeader(required = false) String geolocationLon,
															 @RequestHeader(required = false) String geolocationLat,
															 @RequestParam HashMap<String, String> map) throws Exception {
		response.setContentType("application/json");

		JSONObject result = new JSONObject();

		try{
			facilityId = decodeHeaderValue(facilityId);
			featureTargetKey = decodeHeaderValue(featureTargetKey);
			featureTargetVal = decodeHeaderValue(featureTargetVal);
		}catch(Exception e){
			result.put("result", false);
			result.put("error", "base 64 decoding error");
			response.getWriter().write(result.toString()); return;
		}

		boolean isValid = true;

		if(!"insert".equals(mode) && !"update".equals(mode) && !"delete".equals(mode) && !"select".equals(mode)){
			isValid = false;
			result.put("result", false);
			result.put("error", mode + " method is not support.");

			response.getWriter().write(result.toString()); return;
		}

		if(StringUtils.isEmpty(Authorization)){
			isValid = false;
			result.put("result", false);
			result.put("error", "API Key(Authorization) is require.");

			response.getWriter().write(result.toString()); return;
		}

		if(svc.getItemByAPIKey(Authorization) == null){
			isValid = false;
			result.put("result", false);
			result.put("error", "Not support API Key(Authorization).");

			response.getWriter().write(result.toString()); return;
		}

		if(!svc.isValidRequireHeader(mode, facilityId, featureTargetKey, featureTargetVal)){
			isValid = false;
			result.put("result", false);
			result.put("error", "Require Header Parameter is invalid.");

			response.getWriter().write(result.toString()); return;
		}

		if(isValid){
			try {
				map.put("facilityId", facilityId);
				map.put("featureTargetKey", featureTargetKey);
				map.put("featureTargetVal", featureTargetVal);
				map.put("geolocationLon", geolocationLon);
				map.put("geolocationLat", geolocationLat);

				GMT_ListHashMapVo listMapVo = svc.getColumnParameters(map);

				String msg = svc.validateListMapVo(mode,listMapVo);

				if("pass".equals(msg)){
					if("select".equals(mode)){
						HashMap<String, Object> selectMap = svc.writeSelectTransaction(listMapVo);

						result.put("result", selectMap.get("result"));
						result.put("count", selectMap.get("count"));
					}else{
						result.put("result", svc.writeTransaction(mode, listMapVo));
					}
		        }else{
		        	result.put("result", false);
		        	result.put("error", msg);
		        }

			} catch (Exception e) {
				result.put("result", false);
				result.put("error", e.getMessage());
			}

			response.getWriter().write(result.toString()); return;
		}

	}

	/**
	 *  헤더 값을 디코딩 합니다
	 * @param headerValue
	 * @return
	 * @throws Exception
	 */
	private String decodeHeaderValue(String headerValue) throws Exception {

		if(headerValue == null){
			return null;
		}

		String result = "";

		Decoder decoder = Base64.getDecoder();
		byte[] decodedBytes = decoder.decode(headerValue);

		result = new String(decodedBytes);

		return result;
	}

	/**
	 * REST API 설정 뷰를 리턴합니다.
	 *
	 * @param session
	 * @param model
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getView.do")
	public String getView(Model model) throws Exception {

		model.addAttribute("list", svc.getList(null));

		return "/rest/restView";

	}

	/**
	 * API 리스트에 추가합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/add.json", method = RequestMethod.POST)
	public void add(Model model, HttpSession session, @ModelAttribute GMT_RestAPIVo vo) throws Exception {

		vo.setRegUsrId((String) session.getAttribute("userId"));
		vo.setApiKey(UUID.randomUUID().toString());

		model.addAttribute("result", svc.add(vo));

	}

	/**
	 * API 리스트를 수정합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/edit.json", method = RequestMethod.POST)
	public void edit(Model model, @ModelAttribute GMT_RestAPIVo vo) throws Exception {

		model.addAttribute("result", svc.edit(vo));

	}

	/**
	 * API 리스트에서 삭제합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/del.json", method = RequestMethod.POST)
	public void del(Model model, @RequestParam int k) throws Exception {

		HashMap<String, Integer> map = new HashMap<String, Integer>();
		map.put("mgrSeq", k);

		model.addAttribute("result", svc.del(map));

	}

	/**
	 * API 단건을 조회합니다.
	 *
	 * @param model
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getItem.json", method = RequestMethod.POST)
	public void getItem(Model model, @RequestParam int k) throws Exception {

		HashMap<String, Integer> map = new HashMap<String, Integer>();
		map.put("mgrSeq", k);

		model.addAttribute("result", svc.getItem(map));

	}

	/**
	 * API 명세서 추출을 위한 View 요청 입니다.
	 *
	 * 해당 View 리턴 후 하단의 JSON 요청으로 다운로드 합니다.
	 *
	 * @param s - Schema
	 * @param t - Table
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getExportPDFView.do")
	public String getExportPDFView(Model model, @RequestParam String k, @RequestParam String s, @RequestParam String t, @RequestParam(required = false) String apiKey) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schema", s);
		map.put("table", t);

		model.addAttribute("k", k);
		model.addAttribute("s", s);
		model.addAttribute("t", t);
		model.addAttribute("apiKey", apiKey);
		model.addAttribute("column", column.getColumnInfo(map));

		return "/rest/exportPDF";
	}

	/**
	 * 요청된 PDF 파일을 리턴합니다.
	 *
	 * @param res
	 * @param session
	 * @param map
	 * @throws Exception
	 */
	@RequestMapping(value = "/getExportPDF.json", method = RequestMethod.POST)
	public void getExportPDFFile(HttpServletResponse res, HttpSession session, @RequestParam String title, @RequestParam String document) throws Exception {

		svc.getExportPDF(res, session, title, document);

	}

}
