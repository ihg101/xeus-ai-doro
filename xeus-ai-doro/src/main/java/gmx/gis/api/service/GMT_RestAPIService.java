package gmx.gis.api.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.itextpdf.text.pdf.BaseFont;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.util.code.DateUtil;
import gmx.gis.layer.service.GMT_LayerService;
import gmx.gis.layer.service.GMT_LayerVo;
import gmx.gis.sysmgr.service.GMT_ColumnService;
import gmx.gis.sysmgr.service.GMT_ColumnVo;
import gmx.gis.sysmgr.service.GMT_DataValidator;
import gmx.gis.sysmgr.service.GMT_ListHashMapVo;

@Service
public class GMT_RestAPIService extends EgovAbstractServiceImpl {

	@Autowired private GMT_RestAPIMapper mapper;

	@Autowired private GMT_LayerService layer;

	@Autowired private GMT_ColumnService column;

	/**
	 * 필수 Header를 검증합니다.
	 *
	 * @param map
	 * @return
	 */
	public boolean isValidRequireHeader(String mode, String facilityId, String featureTargetKey, String featureTargetVal) {
		boolean result = true;

		if(StringUtils.isEmpty(facilityId)) result = false;

		if("update".equals(mode) || "delete".equals(mode)){
			if(StringUtils.isEmpty(featureTargetKey)) result = false;
			if(StringUtils.isEmpty(featureTargetVal)) result = false;
		}

		return result;
	}

	/**
	 * 파라미터를 GMT_ListHashMapVo 객체로 변환합니다.
	 *
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public GMT_ListHashMapVo getColumnParameters(HashMap<String, String> parameters) throws Exception {

		//HashMap<String, String> originalParameters = (HashMap<String, String>) parameters.clone();

		GMT_ListHashMapVo result = new GMT_ListHashMapVo();

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("tblId", parameters.get("facilityId"));

		GMT_LayerVo vo = layer.getItem(map);

		if(vo == null){
			throw new Exception("Facility " + parameters.get("facilityId") + " is not exist.");
		}else if(vo != null){
			map.put("schema", vo.getSchemNm());
			map.put("table", vo.getTblId());

			//1. SET PK
			String featureTargetKey = parameters.get("featureTargetKey");
			String featureTargetVal = parameters.get("featureTargetVal");
			if(!StringUtils.isEmpty(featureTargetKey) && !StringUtils.isEmpty(featureTargetVal)){
				HashMap<String, Object> featureKv = new HashMap<String, Object>();
				featureKv.put("fieldKey", featureTargetKey);
				featureKv.put("fieldVal", featureTargetVal);
				result.setFeatureKv(featureKv);
			}

			//2. SET ST
			result.setSt((HashMap<String, String>) map.clone());


			//3. SET COLUMN
			ArrayList<HashMap<String, Object>> typ = new ArrayList<HashMap<String, Object>>();
			ArrayList<GMT_ColumnVo> columnList = column.getColumnInfo(map);
			for(int i=0; i<columnList.size(); i++){
				HashMap<String, Object> typMap = new HashMap<String, Object>();
				typMap.put("col", columnList.get(i).getColId());
				typMap.put("nm", columnList.get(i).getColNm());
				if(!"text".equals(columnList.get(i).getDataType()) && !columnList.get(i).getDataType().contains("character")){
					typMap.put("typ", "number");
				}else{
					typMap.put("typ", "string");
				}
				typ.add(typMap);
			}
			result.setTyp(typ);


			//4. SET KV
			HashMap<String, Object> spatialSt = new HashMap<String, Object>();
			ArrayList<HashMap<String, Object>> kv = new ArrayList<HashMap<String, Object>>();
			Set<String> key = parameters.keySet();
			Iterator<String> itr = key.iterator();
			while(itr.hasNext()){
				String keyStr = (String) itr.next();
				if(!"facilityId".equalsIgnoreCase(keyStr)){
					HashMap<String, Object> kvMap = new HashMap<String, Object>();

					if("geolocationLon".equals(keyStr) || "geolocationLat".equals(keyStr)){
						spatialSt.put(keyStr, parameters.get(keyStr));
					}else{
						kvMap.put("key", keyStr);
						kvMap.put("val", parameters.get(keyStr));
						kv.add(kvMap);
					}
				}
			}
			result.setSpatialSt(spatialSt);
			result.setKv(kv);
		}

		return result;
	}

	/**
	 * 객체를 관리(추가, 수정, 삭제) 합니다.
	 *
	 * @param mode
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean writeTransaction(String mode, GMT_ListHashMapVo vo) throws Exception {

		boolean result = true;

		try {
			if("insert".equals(mode)) column.addLayerValue(vo);
			if("update".equals(mode)) column.editLayerValue(vo);
			if("delete".equals(mode)) column.delLayerValue(vo);
		} catch (Exception e) {
			throw e;
		}

		return result;
	}


	/**
	 * 객체를 관리(추가, 수정, 삭제) 합니다.
	 *
	 * @param mode
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> writeSelectTransaction(GMT_ListHashMapVo vo) throws Exception {

		HashMap<String, Object> map = new HashMap<String, Object>();

		try {

			map.put("result", column.selectLayerValue(vo));
			map.put("count", column.selectLayerCount(vo));

		} catch (Exception e) {
			map = null;
			throw e;
		}



		return map;
	}


	public ArrayList<GMT_RestAPIVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_RestAPIVo>) mapper.getList(map);
	}

	public GMT_RestAPIVo getItem(HashMap<String, Integer> map) throws Exception {

		return (GMT_RestAPIVo) mapper.getItem(map);
	}

	public GMT_RestAPIVo getItemByAPIKey(String apiKey) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("apiKey", apiKey);

		return (GMT_RestAPIVo) mapper.getItemByAPIKey(map);
	}

	public boolean del(HashMap<String, Integer> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public boolean add(GMT_RestAPIVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public GMT_RestAPIVo addAndItem(GMT_RestAPIVo vo) throws Exception {

		return (GMT_RestAPIVo) mapper.addAndItem(vo);
	}

	public boolean edit(GMT_RestAPIVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

	public void getExportPDF(HttpServletResponse res, HttpSession session, String title, String document) throws FileNotFoundException{
		BufferedOutputStream out = null;
		InputStream in = null;
		ITextRenderer renderer = new ITextRenderer();

		String path = session.getServletContext().getRealPath("WEB-INF") + "\\pdf\\";
		String fileNm = title + "_" + DateUtil.getStrSec() + ".pdf";
		String outputFile = path + fileNm;
		OutputStream os = new FileOutputStream(outputFile);

		try {
			String fontPath = session.getServletContext().getRealPath("/WEB-INF/") + "pdf\\NanumBarunGothic.ttf";

			renderer.setDocumentFromString(document);
			renderer.getFontResolver().addFont(fontPath, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, null);
			renderer.layout();
			renderer.createPDF(os, false);
			renderer.finishPDF();

			res.setContentType("application/octet-stream");
			res.setHeader("Content-Disposition", "attachment;filename=" + new String(fileNm.getBytes("UTF-8"), "ISO-8859-1"));

			File file = new File(outputFile);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[1024];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try{ os.flush(); } catch(Exception e) {}
			try{ os.close(); } catch(Exception e) {}
			if(out != null){ try{ out.flush(); }catch(Exception e){} }
			if(out != null){ try{ out.close(); }catch(Exception e){} }
			if(in != null){ try{ in.close(); }catch(Exception e){} }
			try {
				File pdfFile = new File(outputFile);
				pdfFile.delete();
			} catch(Exception e){}
		}
	}
	/**
	 *  ListMapVo  데이터 유효성 검사를 합니다
	 * @param mode
	 * @param listMapVo
	 * @return
	 */
	public String validateListMapVo(String mode, GMT_ListHashMapVo listMapVo) {
		String msg = "pass";

		try{
			if("insert".equals(mode)){
				if(!"pass".equals(validateInsertMode(listMapVo))){
					msg=validateInsertMode(listMapVo);
				}
			}
			else if("update".equals(mode)) {
				if(!"pass".equals(validateUpdateMode(listMapVo))){
					msg=validateUpdateMode(listMapVo);
				}
			}
			else if("delete".equals(mode)) {
				if(!"pass".equals(validateDelteMode(listMapVo))){
					msg=validateDelteMode(listMapVo);
				}
			}
			else if("select".equals(mode)) {
				if(!"pass".equals(validateSelectMode(listMapVo))){
					msg=validateSelectMode(listMapVo);
				}
			}
			else{
				msg = "INSERT, UPDATE, DELETE, SELECT 쿼리만 가능합니다.";
			}
		}catch(Exception e){
			e.printStackTrace();
			msg="데이터 유효성 검사 중 서버에서 오류가 발생했습니다.";
		}

		return msg;

	}
	/**
	 * insert 구문 데이터 유효성 검사를 합니다
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateInsertMode(GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";

		if(!"pass".equals(validateLonLat(listMapVo))){
			msg=validateLonLat(listMapVo);
		}
		else if(!"pass".equals(validateParameters(listMapVo))){
			msg=validateParameters(listMapVo);
		}


		return msg;

	}

	/**
	 * update 구문 데이터 유효성 검사를 합니다
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateUpdateMode(GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";

		if(!"pass".equals(validateLonLat(listMapVo))){
			msg=validateLonLat(listMapVo);
		}
		else if(!"pass".equals(validateFeatureTarget("update", listMapVo))){
			msg=validateFeatureTarget("update", listMapVo);
		}
		else if(!"pass".equals(validateParameters(listMapVo))){
			msg=validateParameters(listMapVo);
		}


		return msg;

	}

	/**
	 * delete 구문 데이터 유효성 검사를 합니다
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateDelteMode(GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";

		if(!"pass".equals(validateFeatureTarget("delete", listMapVo))){
			msg=validateFeatureTarget("delete", listMapVo);
		}

		return msg;

	}


	/**
	 * select 구문 데이터 유효성 검사를 합니다
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateSelectMode(GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";

		if(!"pass".equals(validateFeatureTarget("select", listMapVo))){
			msg=validateFeatureTarget("select" ,listMapVo);
		}

		return msg;

	}



	/**
	 * 위경도 데이터 유효성 검사를 합니다
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateLonLat(GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";

		if(listMapVo.getSpatialSt().get("geolocationLon") != null && listMapVo.getSpatialSt().get("geolocationLat") == null){
			msg = "위치정보를 반영하려면 경도(geolocationLon)와 위도(geolocationLon) 모두 입력해야합니다.";
		}
		else if(listMapVo.getSpatialSt().get("geolocationLon") == null && listMapVo.getSpatialSt().get("geolocationLat") != null){
			msg = "위치정보를 반영하려면 경도(geolocationLon)와 위도(geolocationLon) 모두 입력해야합니다.";
		}
		else if(listMapVo.getSpatialSt().get("geolocationLon") != null && listMapVo.getSpatialSt().get("geolocationLat") != null){
			if(!GMT_DataValidator.isGeolocationContains(listMapVo.getSpatialSt())){
				msg = "경도(geolocationLon)의 값은 124 - 132 사이의 값이어야 하며,위도(geolocationLat)의 값은 33 - 43 사이의 값일 경우만 대한민국 경위도 범위로 판정합니다.";
			}
		}

		return msg;
	}

	/**
	 * 공간정보 타겟 필드 key value 데이터 유효성 검사를 합니다
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateFeatureTarget(String mode, GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";

		List<HashMap<String, Object>> kv= listMapVo.getKv();

		for(int i=0; i<kv.size(); i++){
			String key=(String) kv.get(i).get("key");
			String value=(String) kv.get(i).get("val");


			if("featureTargetKey".equals(key)){

				if(!"pass".equals(validateExistKey(value,listMapVo))){
					msg=validateExistKey(value,listMapVo);
					break;
				}
			//_gid로 하드코딩
//				if(!"_gid".equals(value)){
//					msg ="featureTargetKey is invalid.";
//					break;
//				}
			}
			//featureTargetVal 숫자인지 체크
			if("featureTargetVal".equals(key)){
//				if(!isNumber(value)){
//					//TODO 해당 row가 있는 지 체크
//					msg = "featureTargetVal is invalid.";
//					break;
//				}
//				if{
					String featureTargetKey = getFeatureTargetKey(kv);
					int affectRow = getAffectRow(listMapVo, featureTargetKey, value);

					if(affectRow == 0){
						msg = "affectRow is 0. change featureTargetVal.";
						break;
					}
					else if(affectRow > 1){
						if("delete".equals(mode) || "update".equals(mode)){
							msg = "affectRow is multiple. change featureTargetVal.";
							break;
						}
					}
//				}

			}
		}
		return msg;
	}
	/**
	 * 해당 테이블에 입력된 컬럼이 있는지를 검사한다.
	 * @param key
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateExistKey(String col, GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";
		boolean isContain = false;

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("tblId", listMapVo.getSt().get("tblId"));
		map.put("schema", listMapVo.getSt().get("schema"));
		map.put("table", listMapVo.getSt().get("table"));

		ArrayList<GMT_ColumnVo> columnList = column.getColumnInfo(map);

		for(int i=0; i<columnList.size(); i++){

			if(col.equals(columnList.get(i).getColId())){
				isContain = true;

				break;
			}
		}
		if(!isContain){
			msg = "해당 테이블에  "+col+" 필드명이 존재하지 않습니다.";
		}
		return msg;

	}

	/**
	 * 헤더의 featureTargetKey를 가져온다
	 * @param listMapVo
	 * @return
	 */
	private String getFeatureTargetKey(List<HashMap<String, Object>> kv) {
		String result = "";

		for(int i=0; i<kv.size(); i++){
			String key=(String) kv.get(i).get("key");
			String value=(String) kv.get(i).get("val");

			if("featureTargetKey".equals(key)){
				result = value;
				break;
			}

		}
		return result;
	}

	/**
	 * 해당 featureTargetKey,featureTargetVal에 대응하는  row가 몇개 있는 지 여부
	 * @param listMapVo
	 * @param value
	 * @return
	 * @throws Exception
	 */
	private int getAffectRow(GMT_ListHashMapVo listMapVo, String featureTargetKey, String value) throws Exception {
		int affectRow = 0;

		GMT_ListHashMapVo vo =  new GMT_ListHashMapVo();
		List<HashMap<String, Object>> kvVo = new ArrayList<HashMap<String, Object>>();
		HashMap<String, Object> obj = new HashMap<String, Object>();
		obj.put("key", featureTargetKey);
		obj.put("val", value);
		kvVo.add(obj);

		vo.setSt(listMapVo.getSt());
		vo.setKv(kvVo);
		vo.setTyp(listMapVo.getTyp());

		affectRow = column.getTableCountValue(vo);

		return affectRow;
	}

	/**
	 * parameter 유효성 검사를 합니다
	 * @param listMapVo
	 * @return
	 * @throws Exception
	 */
	private String validateParameters(GMT_ListHashMapVo listMapVo) throws Exception {
		String msg = "pass";

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("tblId", listMapVo.getSt().get("tblId"));
		map.put("schema", listMapVo.getSt().get("schema"));
		map.put("table", listMapVo.getSt().get("table"));

		ArrayList<GMT_ColumnVo> columnList = column.getColumnInfo(map);


		List<HashMap<String, Object>> kv= listMapVo.getKv();
		if(kv.size() < 3){
			msg = "Parameters를 넣은 후 요청해주세요.";
		}
		else{
			for(int i=0; i<kv.size(); i++){
				String key=(String) kv.get(i).get("key");
				String value=(String) kv.get(i).get("val");

				if("featureTargetKey".equals(key) || "featureTargetVal".equals(key)){
					continue;
				}

				if(!"pass".equals(validateKeyValue(key,value,columnList))){
					msg=validateKeyValue(key,value,columnList);
					break;
				}
			}
		}

		return msg;

	}

	/**
	 * parameter 안에 있는 key value를  유효성 검사합니다
	 * @param key
	 * @param columnList
	 * @return
	 */
	private String validateKeyValue(String key, String value, ArrayList<GMT_ColumnVo> columnList) {
		String msg = "pass";
		boolean isContain = false;

		for(int i=0; i<columnList.size(); i++){
			String colId = columnList.get(i).getColId();
			if("_gid".equals(colId) || "_annox".equals(colId) || "_annoy".equals(colId) || "_geometry".equals(colId)){
				continue;
			}

			if(key.equals(columnList.get(i).getColId())){
				isContain = true;
				if(!"pass".equals(validateValue(key,value,columnList.get(i)))){
					msg=validateValue(key,value,columnList.get(i));
				}

				break;
			}
		}

		if(!isContain){
//			result = "테이블  \'" + tableName + "\'에  \'"+key+"\' 컬럼이 존재하지 않습니다.";
			msg = "해당 테이블에  "+key+" 필드명이 존재하지 않습니다.";
		}
		return msg;
	}
	/**
	 * 해당 컬럼의 타입에 맞는 value인 지 여부를 검사한다
	 * @param key
	 * @param value
	 * @param columnList
	 * @param columnVo
	 */

	private String validateValue(String key, String value, GMT_ColumnVo gmt_ColumnVo) {
		String msg = "pass";

		String dataType = gmt_ColumnVo.getDataType();
		int stringSize;

		int numericPrecision;
		int numericScale;
		int numericSize;

		if(value == null){

		}
		else if("text".equals(dataType)){
			//TODO 어떤거든지 상관없음
		}else if("character".equals(dataType)){
			//TODO stringsize보다 커야함
			stringSize = Integer.parseInt(gmt_ColumnVo.getStringSize());

			if(value.length() > stringSize){
				msg = "필드명 "+key+"의 VALUE는데이터 길이 "+stringSize+"에 상응하지 않습니다.";
			}

		}else if("character varying".equals(dataType)){
			stringSize = Integer.parseInt(gmt_ColumnVo.getStringSize());

			if(value.length() > stringSize){
				msg = "필드명 "+key+"의 VALUE는데이터 길이 "+stringSize+"에 상응하지 않습니다.";
			}

		}else if("integer".equals(dataType)){

		}else if("numeric".equals(dataType)){

			numericPrecision = gmt_ColumnVo.getNumericPrecision();
			numericScale = gmt_ColumnVo.getNumericScale();
			numericSize = numericPrecision - numericScale;


			//double형이 맞는지 체크한다
			if(!isDouble(value)){
				msg = "필드명 "+key+"의 데이터 종류는 numeric입니다.";
				return msg;
			}

			int integerLength = value.split("\\.")[0].length();

			//정수의 길이가 컬럼길이보다 작거나 같은지 체크한다
			if( integerLength > numericSize){
				msg = "필드명 "+key+"의 VALUE는 데이터 길이 " + numericPrecision+ "," + numericScale+"에 상응하지 않습니다.";
			}


		}

		return msg;

	}

	/**
	 * 해당 string이 숫자인지 체크한다
	 * @param key
	 * @return
	 */
	private boolean isNumber(String str) {
		boolean bol =false;
		try{
			Integer.parseInt(str);
			bol = true;
		}catch(NumberFormatException e){

		}

		return bol;
	}

	/**
	 * 해당 string이  double인지 체크한다
	 * @param key
	 * @return
	 */
	private boolean isDouble(String str) {
		boolean bol =false;
		try{
			Double.parseDouble(str);
			bol = true;
		}catch(NumberFormatException e){

		}

		return bol;
	}
}
