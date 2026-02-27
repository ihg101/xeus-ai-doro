package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("bigDataAnalyWeightService")
public class BigDataAnalyWeightService extends EgovAbstractServiceImpl {

	@Resource(name = "bigDataAnalyWeightMapper")
    private BigDataAnalyWeightMapper mapper;

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<BigDataAnalyWeightVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<BigDataAnalyWeightVo>) mapper.getList(map);
	}

	/**
	 * 빅데이터 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public BigDataAnalyWeightVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 테이블을 생성합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public void createWeightTable(String val) throws Exception {

		mapper.createWeightTable(val);

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
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 빅데이터를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean delByVo(BigDataAnalyWeightVo vo) throws Exception {

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
	public boolean add(BigDataAnalyWeightVo vo) throws Exception {

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
	public boolean edit(BigDataAnalyWeightVo vo) throws Exception {

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

}
