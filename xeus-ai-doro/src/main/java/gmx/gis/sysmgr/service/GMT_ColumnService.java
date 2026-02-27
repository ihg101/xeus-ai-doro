package gmx.gis.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 *
 * <pre>
 * 테이블의 컬럼 정보를 조회&관리 하는 서비스 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Service
public class GMT_ColumnService extends EgovAbstractServiceImpl {

	@Autowired
    private GMT_ColumnMapper mapper;

	/**
	 * 테이블의 컬럼 정보를 조회합니다.
	 * 컬럼명, 코멘트, 컬럼타입, 길이, PK 여부 등을 리턴합니다.
	 *
	 * @param map - schema(String), table(String)
	 * @return
	 * @throws Exception
	 */
	public ArrayList<GMT_ColumnVo> getColumnInfo(HashMap<String, String> map) throws Exception {

		return (ArrayList<GMT_ColumnVo>) mapper.getColumnInfo(map);
	}
	public ArrayList<GMT_ColumnVo> getColumnInfo(GMT_ListHashMapVo vo) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("schema", vo.getSt().get("schema"));
		map.put("table", vo.getSt().get("table"));

		if(StringUtils.isEmpty(map.get("schema")) || StringUtils.isEmpty(map.get("table"))){
			throw new Exception(">> Schema & Table is required.");
		}

		return (ArrayList<GMT_ColumnVo>) mapper.getColumnInfo(map);
	}

	/**
	 * 대상 테이블의 값을 조회합니다.
	 *
	 * @param map - schema(String), table(String)
	 * @return
	 * @throws Exception
	 */
	public ArrayList<HashMap<String, String>> getTableValues(GMT_ListHashMapVo vo) throws Exception {

		return (ArrayList<HashMap<String, String>>) mapper.getTableValues(vo);
	}

	/**
	 * 대상 테이블의 갯수를 조회합니다.
	 *
	 * @param map - schema(String), table(String)
	 * @return
	 * @throws Exception
	 */
	public int getTableCountValue(GMT_ListHashMapVo vo) throws Exception {

		return mapper.getTableCountValue(vo);
	}

	/**
	 * 대상 테이블, 대상 필드의 중복을 제거한 값을 조회합니다.
	 *
	 * @param map - schema(String), table(String), col(String)
	 * @return
	 * @throws Exception
	 */
	public ArrayList<String> getDistinctValue(HashMap<String, String> map) throws Exception {

		return (ArrayList<String>) mapper.getDistinctValue(map);
	}

	/**
	 *  지정한 테이블의 컬럼정보를 조회합니다.
	 *
	 * @param
	 * @return ArrayList<GMT_ColumnVo>
	 * @throws Exception
	 */
	public ArrayList<GMT_ColumnVo> getList() throws Exception {

		ArrayList<GMT_ColumnVo> list = (ArrayList<GMT_ColumnVo>) mapper.getList();

		return list;
	}

	/**
	 * 객체를 통합 검색합니다.
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<HashMap<String, String>> getCommonSearch(GMT_ListHashMapVo vo) throws Exception {

		return (ArrayList<HashMap<String, String>>) mapper.getCommonSearch(vo);
	}

	/**
	 * 객체 통합 검색 카운트 입니다.
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCommonSearchCount(GMT_ListHashMapVo vo) throws Exception {

		return mapper.getCommonSearchCount(vo);
	}

	/**
	 * 객체를 통합 검색하여 길이 및 면적을 구합니다.
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<HashMap<String, String>> getCommonSearchAreaAndLength(GMT_ListHashMapVo vo) throws Exception {

		return (ArrayList<HashMap<String, String>>) mapper.getCommonSearchAreaAndLength(vo);
	}

	/**
	 * 객체를 통합 검색 결과를 레이어로 생성합니다.
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean createSearchResultLayer(GMT_ListHashMapVo vo) throws Exception {

		boolean result = true;

		try {
			mapper.createSearchResultLayer(vo);
		} catch (Exception e) {
			result = false;
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * 객체를 통합 검색 결과를 레이어로 생성합니다.
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean createSearchResultViewLayer(GMT_ListHashMapVo vo) throws Exception {

		boolean result = true;

		try {
			mapper.createSearchResultViewLayer(vo);
		} catch (Exception e) {
			result = false;
			e.printStackTrace();
		}

		return result;
	}


	/**
	 * 대상 테이블의 Row를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean addLayerValue(GMT_ListHashMapVo vo) throws Exception {

		int state = mapper.addLayerValue(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 대상 테이블의 특정 Row를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean editLayerValue(GMT_ListHashMapVo vo) throws Exception {

		int state = mapper.editLayerValue(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 대상 테이블의 특정 Row를 제거합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean delLayerValue(GMT_ListHashMapVo vo) throws Exception {

		int state = mapper.delLayerValue(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}


	/**
	 * 대상 테이블의 특정 Row를 가져옵니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public ArrayList<HashMap<String, String>> selectLayerValue(GMT_ListHashMapVo vo) throws Exception {

		ArrayList<HashMap<String, String>> list = mapper.selectLayerValue(vo);

		//geometry 컬럼 삭제
		for(int i=0; i<list.size(); i++){
			if(list.get(i).containsKey("_geometry")){
				list.get(i).remove("_geometry");
			}
		}


		return list;

	}

	/**
	 * 대상 테이블의 특정 Row를 가져옵니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public int selectLayerCount(GMT_ListHashMapVo vo) throws Exception {

		int count = mapper.selectLayerCount(vo);



		return count;

	}

	/**
	 * DB의 모든 스키마를 가져옵니다.
	 *
	 * @return
	 * @throws Exception
	 */
	public ArrayList<String> getAllSchemas() throws Exception {

		return (ArrayList<String>) mapper.getAllSchemas();
	}

	/**
	 * 테이블이 존재하는지 확인합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean isExistsTable(HashMap<String, String> map) throws Exception {

		return mapper.isExistsTable(map);
	}

	/**
	 * 컬럼이 해당 테이블에 존재하는지 확인합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean isExistsColumn(HashMap<String, String> map) throws Exception {

		return mapper.isExistsColumn(map);
	}

	/**
	 * 필드를 추가합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean addField(HashMap<String, String> map) throws Exception {

		boolean result = true;

		try {
			mapper.addField(map);
		} catch (Exception e) {
			result = false;
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * 필드를 제거합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean dropField(HashMap<String, String> map) throws Exception {

		boolean result = true;

		try {
			mapper.dropField(map);
		} catch (Exception e) {
			result = false;
			e.printStackTrace();
		}

		return result;
	}

}
