package gmx.gis.layerTable.service;



import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.layer.service.GMT_LayerGroupService;
import gmx.gis.layer.service.GMT_LayerGroupVo;
import gmx.gis.layer.service.GMT_LayerImportService;
import gmx.gis.layer.service.GMT_LayerService;
import gmx.gis.layer.service.GMT_LayerStyleService;
import gmx.gis.layer.service.GMT_LayerVo;
import gmx.gis.layerTable.service.GMT_LayerTableVo;
import gmx.gis.proxy.service.GMT_ProxyService;
import gmx.gis.sysmgr.service.GMT_ColumnKoreaNameVo;
import gmx.gis.sysmgr.service.GMT_ColumnNameVo;
import gmx.gis.sysmgr.service.GMT_ColumnService;
import gmx.gis.sysmgr.service.GMT_ColumnTypeVo;
import gmx.gis.sysmgr.service.GMT_ColumnUidVo;
import gmx.gis.sysmgr.service.GMT_ColumnVo;
import gmx.gis.sysmgr.service.GMT_ColumnLengthVo;
import gmx.gis.util.code.GMT_ReflectionUtil;


/**
 * @author 민동현
 *
 */
@Service
public class GMT_LayerTableService extends EgovAbstractServiceImpl {

    @Autowired private GMT_LayerService svc;

	@Autowired private GMT_LayerGroupService group;

	@Autowired private GMT_LayerStyleService style;

	@Autowired private GMT_LayerTableMapper mapper;

	@Autowired private GMT_LayerImportService lyrImportSvc;

	@Autowired private GMT_ColumnService colSvc;

	@Autowired private GMT_ProxyService proxy;

    private static final String DRAW_SCHEMA = "draw";

    private String tblNm;
    private String tblKrNm;
    private String lyrTyp;
    private String errorMsg;

    private int colCnt;
    private GMT_ColumnUidVo colUidObj;
    private GMT_ColumnNameVo colNmObj;
    private GMT_ColumnKoreaNameVo colKrNmObj;
    private GMT_ColumnTypeVo colTypeObj;
    private GMT_ColumnLengthVo colLenObj;


    private GMT_ReflectionUtil<GMT_ColumnUidVo> refColUid;
	private GMT_ReflectionUtil<GMT_ColumnNameVo> refColNm;
    private GMT_ReflectionUtil<GMT_ColumnKoreaNameVo> refColKrNm;
    private GMT_ReflectionUtil<GMT_ColumnTypeVo> refColType;
    private GMT_ReflectionUtil<GMT_ColumnLengthVo> refColLen;


    private void init() throws Exception {
    	colCnt=2;
    	errorMsg="";
    	colUidObj = new GMT_ColumnUidVo();
    	colNmObj = new GMT_ColumnNameVo();
    	colKrNmObj = new GMT_ColumnKoreaNameVo();
    	colTypeObj = new GMT_ColumnTypeVo();
	    colLenObj = new GMT_ColumnLengthVo();

	    refColUid = new GMT_ReflectionUtil<GMT_ColumnUidVo>(colUidObj);
	    refColNm = new GMT_ReflectionUtil<GMT_ColumnNameVo>(colNmObj);
	    refColKrNm = new GMT_ReflectionUtil<GMT_ColumnKoreaNameVo>(colKrNmObj);
	    refColType = new GMT_ReflectionUtil<GMT_ColumnTypeVo>(colTypeObj);
	    refColLen = new GMT_ReflectionUtil<GMT_ColumnLengthVo>(colLenObj);

    }


	public String createLayerTable(HashMap<String, String> map) throws Exception {
    	String result="success";

    	try{
    		init();
    		setTableInfo(map);
    		setColInfo(map);

			executeCreateDDL();

    		insertLayerInfo(map);

    	}catch(Exception e){
    		result=errorMsg;
    		if("".equals(result)){
    			result="서버에 에러가 발생했습니다.";
    		}
    		//에러 발생 했을 때, 생성된 테이블 drop, gis_lyr_list에서 생성된테이블 row 삭제
    		dropTable();
    		deleteLayerInfo();
    		e.printStackTrace();
    	}

    	return result;

    }


	private void setTableInfo(HashMap<String, String> map) throws UnsupportedEncodingException{
		this.tblNm=map.get("tblNm");
		this.tblKrNm=map.get("tblKrNm");
		this.lyrTyp=map.get("lyrTyp");
    }

	private void setColInfo(HashMap<String, String> map) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, UnsupportedEncodingException {
		this.colCnt=Integer.parseInt(map.get("colCnt"));

		for(int i=2; i<colCnt; i++){
			this.refColUid.invokeSetMethod(colUidObj, "colUid"+i, map.get("colUid"+i));
			this.refColNm.invokeSetMethod(colNmObj, "colNm"+i, map.get("colNm"+i));
			this.refColKrNm.invokeSetMethod(colKrNmObj, "colKrNm"+i, map.get("colKrNm"+i));
			this.refColType.invokeSetMethod(colTypeObj, "colType"+i, map.get("colType"+i));
			this.refColLen.invokeSetMethod(colLenObj, "colLen"+i, map.get("colLen"+i));
		}
    }
//한글 인코딩이 안되어있어서 만든 함수. web.xml에서 인코딩 설정하니까 한글 인코딩이 됨. 그래서 주석 처리함.
//	private String changeCharset(String str) throws UnsupportedEncodingException {
//		String result = new String(GMT_StrUtil.chkNull(str).getBytes("8859_1"),"utf-8");
//		return result;
//    }

	private void executeCreateDDL() throws SQLException, IllegalAccessException, IllegalArgumentException, InvocationTargetException{

		String tableName=tblNm;
		String tableKoreaName=tblKrNm;
		String layerType=replaceLyrTypToGeoType(lyrTyp);

		List<HashMap<String,Object>> columnKrNmMapList=makeColumnKrNmMapList();
		List<HashMap<String,Object>> columnTypeMapList=makeColumnTypeMapList();

		GMT_LayerTableVo vo=new GMT_LayerTableVo();

		vo.setTableName(tableName);
		vo.setTableKoreaName(tableKoreaName);
		vo.setLayerType(layerType);
		vo.setColumnKrNmMapList(columnKrNmMapList);
		vo.setColumnTypeMapList(columnTypeMapList);

		try{
			mapper.create(vo);
		}catch(Exception e){
			errorMsg="DDL에러";
			throw e;
		}
    }

	private String replaceLyrTypToGeoType(String str) {
		String result="";
		switch(str){
			case "point":   result="Point";
						    break;
			case "line":	result="MultiLineString";
							break;
			case "polygon": result="MultiPolygon";
							break;
		}
		return result;
	}

	private List<HashMap<String, Object>> makeColumnKrNmMapList() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		String colNm;
		String colKrNm;

		List<HashMap<String,Object>> result= new ArrayList<HashMap<String,Object>>();
		for(int i=2; i<colCnt; i++){
			HashMap<String,Object> columnKrNmMap = new HashMap<String,Object>();
			colNm=refColNm.invokeGetMethod(colNmObj, "colNm"+i);
			colKrNm=refColKrNm.invokeGetMethod(colKrNmObj, "colKrNm"+i);

			columnKrNmMap.put("colNm", colNm);
			columnKrNmMap.put("colKrNm", colKrNm);

			result.add(columnKrNmMap);
		}
		return result;
	}

	private List<HashMap<String, Object>> makeColumnTypeMapList() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		String colNm;
		String colType;
		String colLen;

		List<HashMap<String,Object>> result= new ArrayList<HashMap<String,Object>>();
		for(int i=2; i<colCnt; i++){
			HashMap<String,Object> columnTypeMap=new HashMap<String,Object>();
			colNm=refColNm.invokeGetMethod(colNmObj, "colNm"+i);
			colType=refColType.invokeGetMethod(colTypeObj, "colType"+i);
			colLen=refColLen.invokeGetMethod(colLenObj, "colLen"+i);

			columnTypeMap.put("colNm", colNm);
			columnTypeMap.put("colType", addColTypeAndColLen(colType,colLen));
			result.add(columnTypeMap);
		}
		return result;
	}
	private String addColTypeAndColLen(String colType, String colLen) {
		String result=colType;

		if("text".equals(colType)){

		}
		else if("integer".equals(colType) && (colLen==null || "".equals(colLen))){

		}
		else if("character varying".equals(colType) && (colLen==null || "".equals(colLen))){

		}
		else{
			result+="("+colLen+")";
		}
		return result;
	}


//	private void insertLayerInfo(HashMap<String, String> map) throws Exception {
//		GMT_LayerVo vo=makeGMT_LayerVo(map);
//		GMT_LayerStyleVo styleVo=new GMT_LayerStyleVo();
//		//gis_lyr_list에  insert
//		GMT_LayerVo affectVo=svc.addAndgetItem(vo);
//		//gis_lyr_style에  insert
//		styleVo.setLyrMgrSeq(affectVo.getMgrSeq());
//		style.add(styleVo);
//	}
//
//	private GMT_LayerVo makeGMT_LayerVo(HashMap<String, String> map) throws Exception {
//		GMT_LayerVo vo=new GMT_LayerVo();
//		vo.setSchemNm(DRAW_SCHEMA);
//		vo.setTblId(tblNm);
//		vo.setLyrNm(tblKrNm);
//		vo.setLyrTyp(replaceLyrTypToChar(lyrTyp));
//		vo.setGrpMgrSeq(this.getGrpMgrSeql(map));
//		vo.setMkUser(map.get("userId"));//추후에 session으로 가져와야함.
//		return vo;
//	}
//
//}
	/**
	 *  gis_lyr_list,gis_lyr_style에 해당 레이어 정보 row를 추가한다
	 *  엔진 레이어에 등록한다
	 *
	 * @param map
	 * @throws Exception
	 */
	private void insertLayerInfo(HashMap<String, String> map) throws Exception {
		HashMap<String, String> param=makeLayerMap(map);

		lyrImportSvc.importLayer(param);


	}

	private HashMap<String, String> makeLayerMap(HashMap<String, String> map) throws Exception {
		HashMap<String, String> result = new HashMap<String, String>();
		result.put("schemNm", DRAW_SCHEMA);
		result.put("tblNm", tblNm);
		result.put("lyrNm", tblKrNm);
		result.put("lyrTyp", replaceLyrTypToChar(lyrTyp));
		result.put("grpMgrSeq", this.getGrpMgrSeql(map));
		result.put("mkUser", map.get("userId"));
		return result;
	}

	private String getGrpMgrSeql(HashMap<String, String> map) throws Exception {
		HashMap<String, String> param=new HashMap<String, String>();
//		param.put("mkUser",map.get("userId")); //추후에 session으로 가져와야함.
		param.put("mgrSeq","3");
		GMT_LayerGroupVo groupVO=group.getItem(param);
		return Integer.toString(groupVO.getMgrSeq());
	}

	private String replaceLyrTypToChar(String str) {
		String result="";
		switch(str){
			case "point":   result="P";
						    break;
			case "line":	result="L";
							break;
			case "polygon": result="G";
							break;
		}
		return result;
	}

	private void dropTable() {
		String tableName=tblNm;
		GMT_LayerTableVo vo=new GMT_LayerTableVo();
		vo.setTableName(tableName);
		try{
			mapper.drop(vo);
		}catch(Exception e){
			throw e;
		}
	}
	private void deleteLayerInfo() {
		GMT_LayerVo vo=new GMT_LayerVo();
		vo.setSchemNm(DRAW_SCHEMA);
		vo.setTblId(tblNm);
		svc.delExcelLayer(vo);

	}
	/**
	 * 필드 관리에서 필드정보를 변경합니다
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public String alterField(HashMap<String, String> map) throws Exception {
    	String result="success";

    	try{
    		init();
//    		setTableInfo(map);
    		setColInfo(map);

			executeAlterDDL(map);

			//GIS 엔진의 해당 테이블 메타 데이터를 refresh한다.
			proxy.manageLayer("flush", map.get("schema"), map.get("tblNm"), map.get("tableKrName"));

//    		insertLayerInfo(map);

    	}catch(Exception e){
    		result="fail";
//    		if("".equals(result)){
//    			result="서버에 에러가 발생했습니다.";
//    		}
    		//에러 발생 했을 때, 생성된 테이블 drop, gis_lyr_list에서 생성된테이블 row 삭제
//    		dropTable();
//    		deleteLayerInfo();
    		e.printStackTrace();
    	}

    	return result;

    }


	private void executeAlterDDL(HashMap<String, String> map) throws Exception {
		String tableName=map.get("tblNm");
		String schema=map.get("schema");

		List<HashMap<String,Object>> columnKrNmMapList=makeColumnKrNmMapList();
		List<HashMap<String,Object>> columnTypeMapList=makeColumnTypeMapList();
		HashMap<String,Object> columnNewNmMap=makeColumnNewNmMap(map);

		GMT_LayerTableVo vo=new GMT_LayerTableVo();

		vo.setTableName(tableName);
		vo.setSchema(schema);
		vo.setColumnKrNmMapList(columnKrNmMapList);
		vo.setColumnTypeMapList(columnTypeMapList);
		vo.setColumnNewNmMap(columnNewNmMap);

		try{
			mapper.alter(vo);
		}catch(Exception e){
			errorMsg="DDL에러";
			throw e;
		}
	}

	private HashMap<String, Object> makeColumnNewNmMap(HashMap<String, String> map) throws Exception {
		HashMap<String, Object> result = new HashMap<String,Object>();

		map.put("table", map.get("tblNm"));
		ArrayList<GMT_ColumnVo> list = colSvc.getColumnInfo(map);

		for(int i=2; i<colCnt; i++){
			String colUid=refColUid.invokeGetMethod(colUidObj, "colUid"+i);
			String colId=refColNm.invokeGetMethod(colNmObj, "colNm"+i);

			for(int j=0; j<list.size(); j++){
				//현재 컬럼을 찾는다
				if(list.get(j).getColUid().equals(colUid)){
					//원래 컬럼이름과 새로운 컬럼이름이 다르면
					if(!list.get(j).getColId().equals(colId)){
						result.put(list.get(j).getColId(),colId);
					}
				}
			}
		}
		return result;
	}


	/**
	 * 필드 관리에서 필드를 추가합니다
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public String addOneColumn(HashMap<String, String> map) throws Exception {
    	String result="success";

    	try{
    		String tableName=map.get("tableName");
    		String schema=map.get("schema");
    		String colNm=map.get("colNm");
    		String colKrNm=map.get("colKrNm");
    		String colType=map.get("colType");
    		String colLen=map.get("colLen");

    		String type =addColTypeAndColLen(colType,colLen);

    		GMT_LayerTableVo vo=new GMT_LayerTableVo();

    		vo.setTableName(tableName);
    		vo.setSchema(schema);
    		vo.setColNm(colNm);
    		vo.setColKrNm(colKrNm);
    		vo.setType(type);

			mapper.addOneColumn(vo);

//    		insertLayerInfo(map);

    	}catch(Exception e){
    		result="fail";
//    		if("".equals(result)){
//    			result="서버에 에러가 발생했습니다.";
//    		}
    		//에러 발생 했을 때, 생성된 테이블 drop, gis_lyr_list에서 생성된테이블 row 삭제
//    		dropTable();
//    		deleteLayerInfo();
    		e.printStackTrace();
    	}

    	return result;

    }

	/**
	 * 필드 관리에서 필드를 삭제합니다
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public String deleteOneColumn(HashMap<String, String> map) throws Exception {
    	String result="success";

    	try{
    		String tableName=map.get("tableName");
    		String schema=map.get("schema");
    		String colNm=map.get("colNm");


    		GMT_LayerTableVo vo=new GMT_LayerTableVo();

    		vo.setTableName(tableName);
    		vo.setSchema(schema);
    		vo.setColNm(colNm);

			mapper.deleteOneColumn(vo);

			//GIS 엔진의 해당 테이블 메타 데이터를 refresh한다.
			proxy.manageLayer("flush", map.get("schema"), map.get("tableName"), map.get("tableKrName"));
//    		insertLayerInfo(map);

    	}catch(Exception e){
    		result="fail";
//    		if("".equals(result)){
//    			result="서버에 에러가 발생했습니다.";
//    		}
    		//에러 발생 했을 때, 생성된 테이블 drop, gis_lyr_list에서 생성된테이블 row 삭제
//    		dropTable();
//    		deleteLayerInfo();
    		e.printStackTrace();
    	}

    	return result;

    }


	/*
	 * 2020.12.15 장대건
	 * Shape 업로드 시, 테이블에 Primary Key 생성을 위해 생성함.
	 */
	private void addPKey(HashMap<String, String> map) throws Exception {
		mapper.addPKey(map);
	}

}