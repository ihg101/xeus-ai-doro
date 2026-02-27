package gmx.gis.shp.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.geotools.data.DataStore;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.simple.SimpleFeatureStore;
import org.geotools.referencing.CRS;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;
import gmx.gis.layer.service.GMT_LayerImportService;
import gmx.gis.layerTable.service.GMT_LayerTableMapper;
import gmx.gis.shp.util.GMT_ShpUtil;
import gmx.gis.util.code.GMT_StrUtil;
import gmx.gis.util.code.GMT_EtcUtil;
import gmx.gis.util.code.GMT_ValidInspector;

/**
 * <pre>
 * <b>의존성:</b>
 * gmx.gis.util.code.GMT_StrUtil : isStrOnArray, left, right
 * gmx.gis.util.code.GMT_EtcUtil : getFile, emptyFolder
 * </pre>
 *
 * @author 장대건
 *
 */
@Service
public class GMT_ShpService extends EgovAbstractServiceImpl {

	@Resource(name = "propService")
    private EgovPropertyService propService;

	@Autowired private GMT_LayerImportService layerImportService;

	@Autowired private GMT_LayerTableMapper layerTableMapper;

	private final static String HAS_SHP = "SHP";
	private final static String HAS_SHX = "SHX";
	private final static String HAS_DBF = "DBF";

	private static String SHP_STORAGE = "";

   @PostConstruct
	private void init() throws Exception {
    	SHP_STORAGE = propService.getString("engine.shp.storage");

    	GMT_ShpUtil.DB_TYPE = propService.getString("engine.shp.db.type");
    	GMT_ShpUtil.DB_SCHEMA = propService.getString("engine.shp.db.schema");
    	GMT_ShpUtil.DB_HOST = propService.getString("jdbc.url");
    	GMT_ShpUtil.DB_PORT = propService.getString("jdbc.port");
    	GMT_ShpUtil.DB_DATABASE = propService.getString("jdbc.sid");
    	GMT_ShpUtil.DB_USER = propService.getString("jdbc.user");
    	GMT_ShpUtil.DB_PASSWD = propService.getString("jdbc.passwd");
    }

	/*
	 * shp을 서버에 저장한다.
	 * 업로드된 Shp 파일 목록을 String으로 반환함.
	 */
	public String shpToStorage(List<MultipartFile> multipartFileList, String userId, String srcSRID, String tgtDbSchema, String layerNm) throws Exception {
		String msg = "";
		if (multipartFileList == null) {
			msg = "선택된 파일이 없습니다.\n다시 시도해 주시길 바랍니다.";
			GMT_ShpUtil.logger.error(msg);
			return msg;
		}

		for (MultipartFile multipartFile : multipartFileList) {
			if (GMT_ValidInspector.isPathAttack(multipartFile.getOriginalFilename())) {
				msg = "올바른 파일 이름이 아닙니다.\n특수문자를 제거해 주세요.";
				GMT_ShpUtil.logger.error(msg);
				return msg;
			}
		}

		if("".equals(userId) || userId == null) userId = "geomex";

		if( StringUtils.isEmpty(srcSRID) ){
			msg = "원본 좌표계가 선택되지 않았습니다.\n 좌표계를 선택해주시길 바랍니다.";
			GMT_ShpUtil.logger.error(msg);
			return msg;
		}

		// 1. 업로드해야할 todo리스트를 만듬. (shp, shx, dbf 세트로 구성이 안된 애들 제외)
		ArrayList<String> todoList = getTodoList(multipartFileList);
		if(todoList.size() == 0) {
			msg = "업로드할 파일이 없습니다. 파일 확장자(.shp, shx, dbf)를 확인해주십시오.";
			GMT_ShpUtil.logger.error(msg);
			return msg;
		}
		GMT_ShpUtil.logger.debug("서버 및 DB에 업로드 해야할 목록 :: " + todoList.toString());

		String storegePath = SHP_STORAGE + userId;
		File tempFolder = new File(storegePath);
		if (!tempFolder.exists())
			tempFolder.mkdirs();

		// 2. 업로드해야할 파일들을 서버 스토리지에 저장함.
		ArrayList<File> dbToDoList = new ArrayList<File>();
		ArrayList<String> uploadedList = new ArrayList<String>();
		String nowDate = new SimpleDateFormat("YYYYMMddHHmmssSSS").format(System.currentTimeMillis());
		String tblNm = tgtDbSchema + "_" + userId + "_" + nowDate;
		int fileIndex = 0;
		for (MultipartFile uploadFile : multipartFileList) {
			String originalFilename = uploadFile.getOriginalFilename();
			String fileName = GMT_StrUtil.left(originalFilename, ".");
			String fileExtension= GMT_StrUtil.right(originalFilename, ".").toLowerCase();

			if(!todoList.contains(fileName))
				continue;

			if(!uploadedList.contains(fileName)) {
				uploadedList.add(fileName);
				fileIndex++;
			}

			File uploadDst = new File(storegePath +"\\" + tblNm + "_" + Integer.toString(fileIndex) + "." + fileExtension);
			uploadFile.transferTo(uploadDst); //MultipartFile을 서버 스토리지에 저장

			if( "shp".equalsIgnoreCase(fileExtension) ) dbToDoList.add(uploadDst);
		}
		GMT_ShpUtil.logger.debug("서버 스토리지 저장 성공 :: " + uploadedList.toString());

		// 3. 서버 스토리지에 성공적으로 저장된 shp을 DB에 올림.
		for(File todo : dbToDoList) {
			shpToDb(todo, srcSRID, tgtDbSchema);

			// DB와 엔진에 레이어 추가 및 등록
			String geomTyp = GMT_ShpUtil.getGeomType(todo);
			String lyrTyp = "P";
			if( geomTyp.indexOf("Point") > -1 ) lyrTyp = "P";
			if( geomTyp.indexOf("Line") > -1 ) lyrTyp = "L";
			if( geomTyp.indexOf("Polygon") > -1 ) lyrTyp = "G";

			HashMap<String, String> map = new HashMap<String, String>();
			map.put("schemNm", tgtDbSchema);
			map.put("tblNm", GMT_StrUtil.left(todo.getName(), "."));
			//map.put("lyrNm", "사용자 업로드 Shp 레이어");
			//TODO 이주영 > 레이어 명칭 추가
			map.put("lyrNm", layerNm);
			map.put("lyrTyp", lyrTyp);
			map.put("grpMgrSeq", "3");
			map.put("mkUser", userId);

			layerImportService.importLayer(map);
			layerTableMapper.addPKey(map);
		}
		GMT_ShpUtil.logger.debug("DB 저장 성공 :: " + dbToDoList.toString());

		msg = "shp파일 업로드 성공. 업로드된 목록 : " + todoList.toString(); // 업로드한 목록
		GMT_ShpUtil.logger.debug(msg);
		return msg;
	}

	/*
	 * shp파일을 DB에 올린다.
	 */
	private void shpToDb(File importFile, String srcSRID, String tgtDbSchema) throws IOException, NoSuchAuthorityCodeException, FactoryException  {
		String importFileNm = GMT_StrUtil.left(importFile.getName(), ".");
		FileDataStore srcDataStore = FileDataStoreFinder.getDataStore(importFile);

		// 피쳐의 문자 인코딩 설정을 바꿈
		String srcEncoding = GMT_ShpUtil.getShpCharset(importFile);
		Boolean encOpt = "ISO-8859-1".equalsIgnoreCase(srcEncoding);

		CoordinateReferenceSystem srcCRS = CRS.decode("epsg:" + srcSRID, true);
		CoordinateReferenceSystem tgtCRS = CRS.decode("epsg:5186", true);

		SimpleFeatureType newSchema;
		SimpleFeatureCollection newfeatureCollection;

		String prjFileNm = importFile.getAbsolutePath().replace(".shp", ".prj");
		File prjFile = new File(prjFileNm);
		if(prjFile.exists()) { // 1. prj 파일이 있을 때
			GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: PRJ 파일 있음");
			srcCRS = srcDataStore.getSchema().getCoordinateReferenceSystem();
			GMT_ShpUtil.logger.debug(">>>>> 원본 EPSG :: " + CRS.toSRS(srcCRS,true) + ",  타겟 EPSG :: 5186");

			if( "5186".equals(CRS.toSRS(srcCRS,true)) ) { // 1) 원본 좌표계와, 변환 요청 좌표계가 같을때
				GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: 원본 좌표계와 요청 좌표계가 같음...");
				if(encOpt) {
					GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: ISO-8859-1 -> EUC-KR 트랜스코딩 함...");
					newSchema = GMT_ShpUtil.cloneSchema(srcDataStore.getSchema(), tgtCRS, srcEncoding, "EUC-KR");
					newfeatureCollection = GMT_ShpUtil.cloneFeatures(srcDataStore.getFeatureSource().getFeatures(), newSchema, null, null, srcEncoding, "EUC-KR");
				} else {
					newSchema = GMT_ShpUtil.cloneSchema(srcDataStore.getSchema(), tgtCRS, "", "");
					newfeatureCollection = GMT_ShpUtil.cloneFeatures(srcDataStore.getFeatureSource().getFeatures(), newSchema, null, null, "", "");
				}
			} else { // 2) 원본 좌표계와, 변환 요청 좌표계가 다를때
				GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: 원본 좌표계와 요청 좌표계가 다름...");
				if(encOpt) {
					GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: ISO-8859-1 -> EUC-KR 트랜스코딩 함...");
					newSchema = GMT_ShpUtil.cloneSchema(srcDataStore.getSchema(), tgtCRS, srcEncoding, "EUC-KR");
					newfeatureCollection = GMT_ShpUtil.cloneFeatures(srcDataStore.getFeatureSource().getFeatures(), newSchema, srcCRS, tgtCRS, srcEncoding, "EUC-KR");
				} else {
					newSchema = GMT_ShpUtil.cloneSchema(srcDataStore.getSchema(), tgtCRS, "", "");
					newfeatureCollection = GMT_ShpUtil.cloneFeatures(srcDataStore.getFeatureSource().getFeatures(), newSchema, srcCRS, tgtCRS, "", "");
				}
			}
		} else { // 2. prj 파일이 없을 때
			GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: PRJ 파일 없음");
			if(encOpt) {
				GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: ISO-8859-1 -> EUC-KR 트랜스코딩 함...");
				newSchema = GMT_ShpUtil.cloneSchema(srcDataStore.getSchema(), tgtCRS, srcEncoding, "EUC-KR");
				newfeatureCollection = GMT_ShpUtil.cloneFeatures(srcDataStore.getFeatureSource().getFeatures(), newSchema, srcCRS, tgtCRS, srcEncoding, "EUC-KR");
			} else {
				newSchema = GMT_ShpUtil.cloneSchema(srcDataStore.getSchema(), tgtCRS, "", "");
				newfeatureCollection = GMT_ShpUtil.cloneFeatures(srcDataStore.getFeatureSource().getFeatures(), newSchema, srcCRS, tgtCRS, "", "");
			}
		}

		// 만든 스키마와 피쳐를 DB에 올림
		DataStore dataStore;
		if(!"".equals(tgtDbSchema))
			dataStore = GMT_ShpUtil.getDbDataStore(tgtDbSchema);
		else
			dataStore = GMT_ShpUtil.getDbDataStore();

		// 테이블 확인
		String[] typeNames = dataStore.getTypeNames();
		if( !GMT_StrUtil.isStrOnArray(typeNames, newSchema.getTypeName()) ) dataStore.createSchema(newSchema); // 테이블 생성

		SimpleFeatureSource source = dataStore.getFeatureSource(newSchema.getTypeName());
		if (source instanceof SimpleFeatureStore) {
			SimpleFeatureStore store = (SimpleFeatureStore) source;

			store.addFeatures(newfeatureCollection);
		} else {
			GMT_ShpUtil.logger.error("Unable to write to database");
		}

		dataStore.dispose();
		srcDataStore.dispose();

		GMT_ShpUtil.logger.debug(">>>>> " + importFileNm + " :: DB 업로드 성공 !!");
	}

	/*
	 * 디비의 공간정보를 shp으로 만든다. (좌표 변환)
	 */
	public File dbToReProjectedShp(String schema, String exportTbl, String tgtSRID) throws NoSuchAuthorityCodeException, FactoryException{
		GMT_ShpUtil.logger.debug(">>>>> DB to Shape :: " + schema + "." + exportTbl + " to " + tgtSRID);
		File exportDir = new File(SHP_STORAGE + "export");
		if(!exportDir.exists())
			exportDir.mkdir();

		GMT_ShpUtil.makeShpFileSet(SHP_STORAGE + "export", exportTbl);
		File outFile = GMT_EtcUtil.getFile(SHP_STORAGE + "export/" + exportTbl + ".shp");

		// 1. 원본 스키마를 불러오고, 원본 데이터의 좌표계를 구한다.
		SimpleFeatureCollection srcFeatureCollection = GMT_ShpUtil.getDbFeatureCollection(schema, exportTbl);

		CoordinateReferenceSystem srcCRS = srcFeatureCollection.getSchema().getCoordinateReferenceSystem();
		CoordinateReferenceSystem tgtCRS = CRS.decode("epsg:" + tgtSRID, true);

		String srcEPSG = CRS.toSRS(srcCRS,true);
		String tgtEPSG = CRS.toSRS(tgtCRS,true);
		GMT_ShpUtil.logger.debug(">>>>> 원본 EPSG :: " + srcEPSG);
		GMT_ShpUtil.logger.debug(">>>>> 타겟 EPSG :: " + tgtEPSG);

		// 3. 원본 피쳐를 새 피쳐에 복사 후, 피쳐들을 모두 해당 좌표계로 transform한다.
		if( srcEPSG.equals(tgtEPSG) ) { // 1) 원본 좌표계와, 변환 요청 좌표계가 같을때
			GMT_ShpUtil.logger.debug(">>>>> 원본 좌표계와 요청 좌표계가 같음...");
			GMT_ShpUtil.writeFeaturesOnShp(srcFeatureCollection, outFile);
		} else {
			GMT_ShpUtil.logger.debug(">>>>> 원본 좌표계와 요청 좌표계가 다름...");
			SimpleFeatureType newSchema = GMT_ShpUtil.cloneSchema(srcFeatureCollection.getSchema(), tgtCRS, "", "");
			SimpleFeatureCollection newfeatureCollection = GMT_ShpUtil.cloneFeatures(srcFeatureCollection, newSchema, srcCRS, tgtCRS, "", "");

			GMT_ShpUtil.writeFeaturesOnShp(newfeatureCollection, outFile);
		}

		GMT_ShpUtil.logger.debug(">>>>> Shp 파일 생성 성공.. zip 파일 생성");
		return GMT_ShpUtil.makeShpZip(exportDir.getAbsolutePath(), exportTbl, "Shp 파일");
	}

	/*
	 * shp, shx, dbf로 구성된 파일 목록을 인자로 보내면, (shp,shx,dbf) 세트가 아닌 파일들을 목록형식으로 반환해준다.
	 * MultipartFile로 처리
	 */
	private ArrayList<String> getTodoList(List<MultipartFile> multipartFileList) {
		//GMT_ShpUtil.logger.error("getTodoList :: 업로드된 파일 중, [shp, shx, dbf]을 모두 가진 파일목록을 구합니다. ");
		HashMap<String, HashMap<String, Boolean>> chkList = new HashMap<String, HashMap<String, Boolean>>();

		// 1. shp, shx, dbf 를 순차적으로 읽어서, 업로드된 shp 파일 목록을 만든다.
		for (MultipartFile temp : multipartFileList) {
			String orgfileNm = temp.getOriginalFilename();
			String fileNm = orgfileNm.substring(0, orgfileNm.lastIndexOf("."));

			if (chkList.containsKey(fileNm)) continue;

			HashMap<String, Boolean> hasSets = new HashMap<String, Boolean>();
			hasSets.put(HAS_SHP, false);
			hasSets.put(HAS_SHX, false);
			hasSets.put(HAS_DBF, false);

			chkList.put(fileNm, hasSets);
		}

		// 2. 각 shp목록에 shp, shx, dbf 여부를 업데이트힌다.
		for (MultipartFile temp : multipartFileList) {
			String orgfileNm = temp.getOriginalFilename();
			String fileNm = orgfileNm.substring(0, orgfileNm.lastIndexOf("."));
			String fileExt = orgfileNm.substring(orgfileNm.lastIndexOf(".") + 1);

			if ("shp".equalsIgnoreCase(fileExt)) {
				chkList.get(fileNm).put(HAS_SHP, true);
			} else if ("shx".equalsIgnoreCase(fileExt)) {
				chkList.get(fileNm).put(HAS_SHX, true);
			} else if ("dbf".equalsIgnoreCase(fileExt)) {
				chkList.get(fileNm).put(HAS_DBF, true);
			}
		}

		// 3. shp, shx, dbf 중 하나라도 false(없는) 목록을 chkList에서 삭제한다.
		Iterator<String> keys = chkList.keySet().iterator();
		while( keys.hasNext() ){
			String key = keys.next();
			HashMap<String, Boolean> hasSet = chkList.get(key);
			for (String ext : hasSet.keySet()) {
				if (!hasSet.get(ext)) {
					keys.remove();
					break;
				}
			}
		}

		return new ArrayList<String>(chkList.keySet());
	}

	/*
	 * Shp 내보내기 후, 남아있는 export 작업 폴더를 삭제한다.
	 */
	public void emptyExportStorage() {
		GMT_EtcUtil.emptyFolder(new File(SHP_STORAGE + "export"));
	}

}