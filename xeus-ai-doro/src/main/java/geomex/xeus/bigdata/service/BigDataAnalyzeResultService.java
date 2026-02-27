package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("bigDataAnalyzeResultService")
public class BigDataAnalyzeResultService extends EgovAbstractServiceImpl {

	@Resource(name = "bigDataAnalyzeResultMapper")
    private BigDataAnalyzeResultMapper mapper;

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<BigDataAnalyzeResultVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<BigDataAnalyzeResultVo>) mapper.getList(map);
	}

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<BigDataAnalyzeResultVo> getDetailResultList(HashMap<String, String> map) throws Exception {

		return (ArrayList<BigDataAnalyzeResultVo>) mapper.getDetailResultList(map);
	}

	/**
	 * 최대값, 최소값을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, String> getMinMaxList(HashMap<String, String> map) throws Exception {

		return (HashMap<String, String>) mapper.getMinMax(map);
	}

	/**
	 * 빅데이터 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public BigDataAnalyzeResultVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 빅데이터를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);
		map.put("analyMgrSeq", map.get("mgrSeq"));
		map.remove("mgrSeq");

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
	public boolean delByVo(BigDataAnalyzeResultVo vo) throws Exception {

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
	public boolean add(BigDataAnalyzeResultVo vo) throws Exception {

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
	public boolean edit(BigDataAnalyzeResultVo vo) throws Exception {

		int state = mapper.edit(vo);

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
	public boolean edit(HashMap<String, String> map) throws Exception {

		BigDataAnalyzeResultVo vo = new BigDataAnalyzeResultVo();
		vo.setMgrSeq(map.get("mgrSeq"));

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
	 * 테이블을 제거합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public void dropTable(String val) throws Exception {

		mapper.dropTable(val);

	}

}
