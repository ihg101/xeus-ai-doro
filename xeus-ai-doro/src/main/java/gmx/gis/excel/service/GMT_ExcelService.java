package gmx.gis.excel.service;



import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;


import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;
import gmx.gis.layer.service.GMT_LayerGroupService;
import gmx.gis.layer.service.GMT_LayerGroupVo;
import gmx.gis.layer.service.GMT_LayerImportService;
import gmx.gis.layer.service.GMT_LayerMapper;
import gmx.gis.layer.service.GMT_LayerService;
import gmx.gis.layer.service.GMT_LayerStyleService;
import gmx.gis.layer.service.GMT_LayerVo;
import gmx.gis.excel.service.GMT_ExcelVo;
import gmx.gis.sysmgr.service.GMT_ColumnKoreaNameVo;
import gmx.gis.sysmgr.service.GMT_ColumnNameVo;
import gmx.gis.sysmgr.service.GMT_ColumnTypeVo;
import gmx.gis.sysmgr.service.GMT_ColumnLengthVo;
import gmx.gis.util.code.GMT_EtcUtil;
import gmx.gis.util.code.GMT_ReflectionUtil;


/**
 * @author 민동현
 *
 */
@Service
public class GMT_ExcelService extends EgovAbstractServiceImpl {



    @Autowired private GMT_LayerService svc;

	@Autowired private GMT_LayerGroupService group;

	@Autowired private GMT_LayerStyleService style;

	@Autowired private GMT_ExcelMapper mapper;

	@Autowired private GMT_LayerImportService lyrImportSvc;

	@Autowired private EgovPropertyService prop;

    private static final String EXCEL_SCHEMA = "excel";

    private String tblNm;
    private String tblKrNm;
    private String lyrTyp;
    private int tableRowCnt;
    private String coordinateType;
    private String errorMsg;

    private int colCnt;
    private GMT_ColumnNameVo colNmObj;
    private GMT_ColumnKoreaNameVo colKrNmObj;
    private GMT_ColumnTypeVo colTypeObj;
    private GMT_ColumnLengthVo colLenObj;

	private GMT_ReflectionUtil<GMT_ColumnNameVo> refColNm;
    private GMT_ReflectionUtil<GMT_ColumnKoreaNameVo> refColKrNm;
    private GMT_ReflectionUtil<GMT_ColumnTypeVo> refColType;
    private GMT_ReflectionUtil<GMT_ColumnLengthVo> refColLen;

    private String dmzUrl;
    private boolean isProxyServer;


    private void init() throws Exception {
    	colCnt=2;
    	errorMsg="";
    	colNmObj = new GMT_ColumnNameVo();
    	colKrNmObj = new GMT_ColumnKoreaNameVo();
    	colTypeObj = new GMT_ColumnTypeVo();
	    colLenObj = new GMT_ColumnLengthVo();

	    refColNm = new GMT_ReflectionUtil<GMT_ColumnNameVo>(colNmObj);
	    refColKrNm = new GMT_ReflectionUtil<GMT_ColumnKoreaNameVo>(colKrNmObj);
	    refColType = new GMT_ReflectionUtil<GMT_ColumnTypeVo>(colTypeObj);
	    refColLen = new GMT_ReflectionUtil<GMT_ColumnLengthVo>(colLenObj);


	    //프록시 서버가 없을 경우(로컬테스트일 경우) false로 변경
	    isProxyServer = true;
	    dmzUrl = prop.getString("dmz.url");

    }
    /**
     * 엑셀 파일을 읽어서 컬럼명을 반환한다.
     *
     * @param file
     * @return List<String>
     * @throws Exception
     */
	public List<String> getExcelColumnList(MultipartFile file, HashMap<String, String> map) throws Exception {

		List<String> list = null;
		String[] splitList=file.getOriginalFilename().split(Pattern.quote("."));
		String excelType=splitList[splitList.length-1];
		String coordinateType= map.get("coordinateType");
	    if("xlsx".equals(excelType)){
	    	list=getExcelColumnListAtXlsx(file, coordinateType);
	    }
	    else if("xls".equals(excelType)){
	    	list=getExcelColumnListAtXls(file, coordinateType);
	    }else{
	    	throw new Exception();
        }

		return list;

	}
	/**
	 * xlsx 엑셀 파일을 읽어서 컬럼명을 반환한다.
	 *
	 * @param file
	 * @return
	 * @throws Exception
	 */
	private List<String> getExcelColumnListAtXlsx(MultipartFile file, String coordinateType) throws Exception {
		Workbook workbook=null;
		List<String> list=new ArrayList<String>();
		int colCnt=0;
		try{
			workbook= new XSSFWorkbook(file.getInputStream());
	        Sheet sheet = workbook.getSheetAt(0);
	        Iterator<Row> rows = sheet.iterator();

	        while (rows.hasNext()) {
		       	Row currentRow = rows.next();
		       	Iterator<Cell> cellsInRow = currentRow.iterator();
		       	while (cellsInRow.hasNext()) {
		       		colCnt++;
		       		Cell currentCell = cellsInRow.next();
		       		if(colCnt == 1){
		       			if("lonlat".equals(coordinateType)){
		       				if(!"annox".equals(currentCell.getStringCellValue())){
		       					throw new Exception("lonlatPolicyError");
		       				}
		       			}else{
		       				if(!"addr".equals(currentCell.getStringCellValue())){
		       					throw new Exception("addrPolicyError");
		       				}
		       			}
		       		}
		       		if(colCnt == 2){
		       			if("lonlat".equals(coordinateType)){
		       				if(!"annoy".equals(currentCell.getStringCellValue())){
		       					throw new Exception("lonlatPolicyError");
		       				}
		       			}
		       		}

		       		list.add(currentCell.getStringCellValue());
		       	}
		       	break;
	        }
		}catch(Exception e){

			 e.printStackTrace();
			throw e;

		}finally{
			 if(workbook!=null){
				 workbook.close();
			 }
		}
		return list;
	}

	/**
	 * xls 엑셀 파일을 읽어서 컬럼명을 반환한다.
	 *
	 * @param file
	 * @return
	 * @throws Exception
	 */
    private List<String> getExcelColumnListAtXls(MultipartFile file, String coordinateType) throws Exception {
    	HSSFWorkbook workbook=null;
		List<String> list=new ArrayList<String>();
		int colCnt=0;
		try{
			workbook= new HSSFWorkbook(file.getInputStream());
	        Sheet sheet = workbook.getSheetAt(0);
	        Iterator<Row> rows = sheet.iterator();

	        while (rows.hasNext()) {
		       	Row currentRow = rows.next();
		       	Iterator<Cell> cellsInRow = currentRow.iterator();
		       	while (cellsInRow.hasNext()) {
		       		colCnt++;
		       		Cell currentCell = cellsInRow.next();

		       		if(colCnt == 1){
		       			if("lonlat".equals(coordinateType)){
		       				if(!"annox".equals(currentCell.getStringCellValue())){
		       					throw new Exception("lonlatPolicyError");
		       				}
		       			}else{
		       				if(!"addr".equals(currentCell.getStringCellValue())){
		       					throw new Exception("addrPolicyError");
		       				}
		       			}
		       		}
		       		if(colCnt == 2){
		       			if("lonlat".equals(coordinateType)){
		       				if(!"annoy".equals(currentCell.getStringCellValue())){
		       					throw new Exception("lonlatPolicyError");
		       				}
		       			}
		       		}

		       		list.add(currentCell.getStringCellValue());
		       	}
		       	break;
	        }
		}catch(Exception e){
//			list=null;
			e.printStackTrace();
			throw e;
		}finally{
			 if(workbook!=null){
				 workbook.close();
			 }
		}
		return list;
	}
    /**
     * 컬럼 정보,테이블 정보,엑셀파일을 받아서
     * 1. 공간정보테이블을 생성한다
     * 2. 공간정보테이블에 데이터를 넣는다
     * 3. gis_lyr_list에 해당 레이어 정보 row를 추가한다
     *
     * @param map(컬럼정보, 테이블정보)
     * @param file
     * @return
     * @throws Exception
     */
	public String uploadExcel(HashMap<String, String> map, MultipartFile file) throws Exception {
    	String result="success";

    	try{
    		init();
    		setTableInfo(map);
    		setColInfo(map);

			executeDDL();

			executeDML(file);

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
	/*
	 * 테이블 정보를 멤버변수에 넣어준다
	 */
	private void setTableInfo(HashMap<String, String> map) throws UnsupportedEncodingException{
		this.tblNm=map.get("tblNm");
		this.tblKrNm=map.get("tblKrNm");
		this.lyrTyp=map.get("lyrTyp");
		this.tableRowCnt=Integer.parseInt(map.get("excelRowCnt"))-1;
		this.coordinateType=map.get("coordinateType");
    }
	/*
	 * 컬럼 정보를 멤버변수에 넣어준다
	 */
	private void setColInfo(HashMap<String, String> map) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, UnsupportedEncodingException {
		this.colCnt=Integer.parseInt(map.get("colCnt"));

		for(int i=2; i<colCnt; i++){
			this.refColNm.invokeSetMethod(colNmObj, "colNm"+i, map.get("colNm"+i));
			this.refColKrNm.invokeSetMethod(colKrNmObj, "colKrNm"+i, map.get("colKrNm"+i));
			this.refColType.invokeSetMethod(colTypeObj, "colType"+i, map.get("colType"+i));
			this.refColLen.invokeSetMethod(colLenObj, "colLen"+i, map.get("colLen"+i));
		}
    }

	/**
	 * 공간정보테이블을 생성한다
	 *
	 * @throws SQLException
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws InvocationTargetException
	 */
	private void executeDDL() throws SQLException, IllegalAccessException, IllegalArgumentException, InvocationTargetException{

		String tableName=tblNm;
		String tableKoreaName=tblKrNm;
		String layerType=replaceLyrTypToGeoType(lyrTyp);

		List<HashMap<String,Object>> columnKrNmMapList=makeColumnKrNmMapList();
		List<HashMap<String,Object>> columnTypeMapList=makeColumnTypeMapList();

		GMT_ExcelVo vo=new GMT_ExcelVo();

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
	/*
	 * 한글 컬럼명 map을 생성해서 리턴한다
	 */
	private List<HashMap<String, Object>> makeColumnKrNmMapList() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		String colNm;
		String colKrNm;

		List<HashMap<String,Object>> result= new ArrayList<HashMap<String,Object>>();
		for(int i=2; i<colCnt; i++){
			HashMap<String,Object> columnKrNmMap=new HashMap<String,Object>();
			colNm=refColNm.invokeGetMethod(colNmObj, "colNm"+i);
//			colType=refColType.invokeGetMethod(colTypeObj, "colType"+i);
			colKrNm=refColKrNm.invokeGetMethod(colKrNmObj, "colKrNm"+i);
			//value값이 숫자이면 string->double
			columnKrNmMap.put("colNm", colNm);
			columnKrNmMap.put("colKrNm", colKrNm);

			result.add(columnKrNmMap);
		}
		return result;
	}
	/*
	 * 컬럼 타입 map을 생성해서 리턴한다
	 */
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

	/**
	 *  ex) character varying(5)
	 *
	 * @param colType
	 * @param colLen
	 * @return
	 */
	private String addColTypeAndColLen(String colType, String colLen) {
		String result=colType;

		if("text".equals(colType)){

		}else{
			result+="("+colLen+")";
		}
		return result;
	}

	/**
	 *  생성된 공간정보테이블에 엑셀파일에 있는 공간정보 데이터를 insert한다
	 *
	 * @param file
	 * @throws Exception
	 */
	private void executeDML(MultipartFile file) throws Exception {
		String[] splitList=file.getOriginalFilename().split(Pattern.quote("."));
		String excelType=splitList[splitList.length-1];

        if("xlsx".equals(excelType)){
        	if(!executeDMLAtXlsx(file)){
        		makeErrorMsg();
        		throw new Exception();
        	}
        }
        else if("xls".equals(excelType)){
        	if(!executeDMLAtXls(file)){
        		makeErrorMsg();
        		throw new Exception();
        	}
        }else{
        	errorMsg="엑셀파일은 xls,xlsx만 가능합니다.";
        	throw new Exception();
        }
	}
	/*
	 * xlsx 엑셀 파일 DML
	 */
	private boolean executeDMLAtXlsx(MultipartFile file) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, IOException, SQLException {

		Workbook workbook=null;
		boolean result=true;

		try{
			HashMap<String, String> rowMap;

			workbook = new XSSFWorkbook(file.getInputStream());
	        Sheet sheet = workbook.getSheetAt(0);
	        Iterator<Row> rows = sheet.iterator();

	        Row currentRow;
	        int rowNumber=1;

			while (rows.hasNext()) {
				try{
					//첫번째 행은 컬럼명이어서 continue
					if (rowNumber ==1) {
						 currentRow = rows.next();
					     rowNumber++;
					     continue;
					}
					if(rowNumber == this.tableRowCnt+2){
						break;
					}

					currentRow = rows.next();
					if("lonlat".equals(coordinateType)){
						rowMap = makeLonlatRowMap(currentRow);
					}
					else{
						rowMap = makeAddrRowMap(currentRow);
					}

					//DB에  INSERT
					insertExcelRow(rowMap);
					rowNumber++;
				}catch(Exception e){
					errorMsg+=rowNumber+"  ";
					rowNumber++;
					result=false;
					e.printStackTrace();
				}
		    }

		}catch(Exception e){
			throw e;
		}finally{
			if(workbook!=null){
				workbook.close();
			}
		}
		return result;
	}
	/*
	 * xls 엑셀파일 DML
	 */
	private boolean executeDMLAtXls(MultipartFile file) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, IOException, SQLException {
		HSSFWorkbook workbook=null;
		boolean result=true;
		try{
			HashMap<String, String> rowMap;

			workbook = new HSSFWorkbook(file.getInputStream());
	        Sheet sheet = workbook.getSheetAt(0);
	        Iterator<Row> rows = sheet.iterator();

	        Row currentRow;
		    int rowNumber = 1;

			while (rows.hasNext()) {
				try{
					//첫번째 행은 컬럼명이어서 continue
					if (rowNumber ==1) {
						 currentRow = rows.next();
					     rowNumber++;
					     continue;
					}
					if(rowNumber == this.tableRowCnt+2){
						break;
					}

					currentRow = rows.next();
					if("lonlat".equals(coordinateType)){
						rowMap = makeLonlatRowMap(currentRow);
					}
					else{
						rowMap = makeAddrRowMap(currentRow);
					}

					//DB에  INSERT
					insertExcelRow(rowMap);
					rowNumber++;
				}catch(Exception e){
					errorMsg+=rowNumber+"  ";
					rowNumber++;
					result=false;
					e.printStackTrace();
				}
		    }
		}catch(Exception e){
			throw e;
		}finally{
			if(workbook!=null){
				workbook.close();
			}
		}
		return result;

	}
	/*
	 * 주소 엑셀 파일 ROW를 HashMap으로 parsing한다
	 *
	 * -카카오API에서 주소를 보내서  경위도를 받아와서 HashMap에 넣어준다
	 */
	private HashMap<String, String> makeAddrRowMap(Row currentRow) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		String cellVal="";
		String key="";
		Cell currentCell;

		HashMap<String, String> rowMap=new HashMap<String, String>();

		int cnt=2;
		Iterator<Cell> cellsInRow= currentRow.iterator();

		while (cellsInRow.hasNext()) {
			currentCell = cellsInRow.next();
			//key
			key=refColNm.invokeGetMethod(colNmObj, "colNm"+cnt);
			//value
			if(currentCell.getCellType()==0)//double이면
				cellVal=Double.toString(currentCell.getNumericCellValue());
			else //string이면
				cellVal=currentCell.getStringCellValue();

			if("addr".equals(key)){
				 String strArr[];

				 if(isProxyServer){
					 strArr = GMT_EtcUtil.getAddrFromKaKao(cellVal, dmzUrl).split(",");
				 }else{
					 strArr = GMT_EtcUtil.getAddrFromKaKao(cellVal, "").split(",");
				 }

				 rowMap.put("_annox", strArr[0]);
				 rowMap.put("_annoy", strArr[1]);
			}

			rowMap.put(key, cellVal);
			cnt++;
		}
		return rowMap;
	}

	/*
	 * 경위도 엑셀 파일 ROW를 HashMap으로 parsing한다
	 */
	private HashMap<String, String> makeLonlatRowMap(Row currentRow) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		String cellVal="";
		String key="";
		Cell currentCell;

		HashMap<String, String> rowMap=new HashMap<String, String>();

		int cnt=0;
//		Iterator<Cell> cellsInRow= currentRow.iterator();

//		int lastColumnIndex = currentRow.getLastCellNum();

		for(int i=0; i<colCnt; i++){
			currentCell = currentRow.getCell(i, Row.RETURN_BLANK_AS_NULL);
			if(cnt==0){
				key="_annox";
			}
			else if(cnt==1){
				key="_annoy";
			}
			else{
				key=refColNm.invokeGetMethod(colNmObj, "colNm"+cnt);
			}

			if(currentCell == null){ //blank(공백) 이면
				cellVal = null;
			}
			else if(currentCell.getCellType()==0){//double이면
				cellVal=Double.toString(currentCell.getNumericCellValue());
			}
			else{//string이면
				cellVal=currentCell.getStringCellValue();
			}

			rowMap.put(key, cellVal);
			cnt++;
		}

//		while (cellsInRow.hasNext()) {
//			currentCell = cellsInRow.next();
//			//key
//		}
		return rowMap;
	}

	private void insertExcelRow(HashMap<String, String> rowMap) throws SQLException, IllegalAccessException, IllegalArgumentException, InvocationTargetException{

		if("point".equals(lyrTyp)){
			insertPoint(rowMap);
		}
		else if("line".equals(lyrTyp)){
			insertLine(rowMap);
		}
		else{
			insertPolygon(rowMap);
		}
    }

	private void insertPoint(HashMap<String, String> rowMap) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, SQLException {
		String tableName=tblNm;
		String _annox=rowMap.get("_annox").trim();
		String _annoy=rowMap.get("_annoy").trim();
		HashMap<String,Object> columnValueMap=makecolumnValueMap(rowMap);

		GMT_ExcelVo vo=new GMT_ExcelVo();

		vo.setTableName(tableName);
		vo.set_annox(_annox);
		vo.set_annoy(_annoy);
		vo.setPoint(makePointString(rowMap));
		vo.setColumnValueMap(columnValueMap);

		try{
			mapper.insertPoint(vo);
		}catch(Exception e){
			throw e;
		}
	}
	/*
	 * ex) POINT(127.3 33.33)
	 */
	private String makePointString(HashMap<String, String> rowMap) {
		String _annox=rowMap.get("_annox").trim();
		String _annoy=rowMap.get("_annoy").trim();

		return "POINT("+_annox+" "+_annoy+")";
	}

	private void insertLine(HashMap<String, String> rowMap) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, SQLException {

		String tableName=tblNm;
		String _annox=rowMap.get("_annox").trim();
		String _annoy=rowMap.get("_annoy").trim();
		HashMap<String,Object> columnValueMap=makecolumnValueMap(rowMap);

		GMT_ExcelVo vo=new GMT_ExcelVo();

		vo.setTableName(tableName);
		vo.set_annox(_annox);
		vo.set_annoy(_annoy);
		vo.setLine(makeLineString(rowMap));
		vo.setColumnValueMap(columnValueMap);

		try{
			mapper.insertLine(vo);
		}catch(Exception e){
			throw e;
		}
	}
	/*
	 * ex)MULTILINESTRING(127.3 33.3, 128.3 34.3)
	 */
	private String makeLineString(HashMap<String, String> rowMap) {
		String annox[]=rowMap.get("_annox").split(",");
		String annoy[]=rowMap.get("_annoy").split(",");

		String str="MULTILINESTRING((";
		for(int i=0; i<annox.length; i++){
			str+=annox[i].trim()+" "+annoy[i].trim();
			str+=",";
		}
		str=str.substring(0,str.length()-1);
		str+="))";

		return str;
	}
	/*
	 * 추후 개발 예정
	 */
	private void insertPolygon(HashMap<String, String> rowMap) {
		// TODO Auto-generated method stub

	}
	/*
	 * key: 컬럼영문명, value : 값(엑셀 하나의 row)
	 */
	private HashMap<String, Object> makecolumnValueMap(HashMap<String, String> rowMap) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		String colNm;
		String value;
		String colType;

		HashMap<String,Object> columnValueMap=new HashMap<String,Object>();
		for(int i=2; i<colCnt; i++){
			colNm=refColNm.invokeGetMethod(colNmObj, "colNm"+i);
			colType=refColType.invokeGetMethod(colTypeObj, "colType"+i);
			value=rowMap.get(colNm);
			//value값이 숫자이면 string->double
			if("numeric".equals(colType)){
				if("".equals(value) || value == null){
					columnValueMap.put(colNm, null);
				}else{
					columnValueMap.put(colNm, Double.parseDouble(value));
				}
			}
			else{
				columnValueMap.put(colNm, value);
			}
		}
		return columnValueMap;
	}

	private void makeErrorMsg() {
		errorMsg=errorMsg.substring(0,errorMsg.length()-1);
		errorMsg="엑셀 파일 ROW번호 \n\n"+errorMsg+"\n\n에 문제가 있습니다. \n\n확인하시고 엑셀 파일을 다시 업로드하시길 바랍니다.";
	}
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
		result.put("schemNm", EXCEL_SCHEMA);
		result.put("tblNm", tblNm);
		result.put("lyrNm", tblKrNm);
		result.put("lyrTyp", replaceLyrTypToChar(lyrTyp));
		result.put("grpMgrSeq", this.getGrpMgrSeql());
		result.put("mkUser", map.get("userId"));
		return result;
	}
	/*
	 * 나의 레이어 layerGroup seq를 가져온다
	 */
	private String getGrpMgrSeql() throws Exception {
		HashMap<String, String> map=new HashMap<String, String>();
//		map.put("mkUser","geomex"); //추후에 session으로 가져와야함.
		map.put("mgrSeq","3");
		GMT_LayerGroupVo groupVO=group.getItem(map);
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
		GMT_ExcelVo vo=new GMT_ExcelVo();
		vo.setTableName(tableName);
		try{
			mapper.drop(vo);
		}catch(Exception e){
			throw e;
		}
	}
	private void deleteLayerInfo() {
		GMT_LayerVo vo=new GMT_LayerVo();
		vo.setSchemNm(EXCEL_SCHEMA);
		vo.setTblId(tblNm);
		svc.delExcelLayer(vo);

	}

}