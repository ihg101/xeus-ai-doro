package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("bigDataAnalyUserService")
public class BigDataAnalyUserService extends EgovAbstractServiceImpl {

	@Resource(name = "bigDataAnalyUserMapper")
    private BigDataAnalyUserMapper mapper;

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<BigDataAnalyUserVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<BigDataAnalyUserVo>) mapper.getList(map);
	}

	/**
	 * 빅데이터 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public BigDataAnalyUserVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 테이블을 생성합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public void createPointTable(HashMap<String, String> map) throws Exception {

			mapper.createPointTable(map);

	}

	/**
	 * 테이블을 생성합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public void createPolygonTable(HashMap<String, String> map) throws Exception {

		mapper.createPolygonTable(map);

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
	public boolean delByVo(BigDataAnalyUserVo vo) throws Exception {

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
	public boolean add(BigDataAnalyUserVo vo) throws Exception {

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
	public boolean edit(BigDataAnalyUserVo vo) throws Exception {

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
