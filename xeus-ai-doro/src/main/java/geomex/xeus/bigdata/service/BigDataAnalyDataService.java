package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("bigDataAnalyDataService")
public class BigDataAnalyDataService extends EgovAbstractServiceImpl {

	@Resource(name = "bigDataAnalyDataMapper")
    private BigDataAnalyDataMapper mapper;

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<BigDataAnalyDataVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<BigDataAnalyDataVo>) mapper.getList(map);
	}

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, String> getTableNameList(HashMap<String, String> map) throws Exception {

		return (HashMap<String, String>) mapper.getTableName(map);
	}

	/**
	 * 빅데이터 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public BigDataAnalyDataVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 빅데이터 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public BigDataAnalyDataVo getItemByVo(BigDataAnalyDataVo vo) throws Exception {

		return mapper.getItemByVo(vo);
	}

	/**
	 * 빅데이터를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 테이블을 제거합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public void dropTable(String val) throws Exception {

		mapper.dropTable(val);

	}

	/**
	 * 빅데이터를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean delByVo(BigDataAnalyDataVo vo) throws Exception {

		int state = mapper.delByVo(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(BigDataAnalyDataVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(BigDataAnalyDataVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}


	/**
	 * layerId를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean editLayerId(HashMap<String, String> map) throws Exception {

		int state = mapper.editLayerId(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

}
