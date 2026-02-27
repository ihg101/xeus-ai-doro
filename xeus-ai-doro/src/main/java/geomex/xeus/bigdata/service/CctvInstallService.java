package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("cctvInstallService")
public class CctvInstallService extends EgovAbstractServiceImpl {

	@Resource(name = "cctvInstallMapper")
	private CctvInstallMapper mapper;

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CctvInstallVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<CctvInstallVo>) mapper.getList(map);
	}

	/**
	 * 빅데이터 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CctvInstallVo> getInstYearList(HashMap<String, String> map) throws Exception {

		return (ArrayList<CctvInstallVo>) mapper.getInstYearList(map);
	}

	/**
	 * 빅데이터 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CctvInstallVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
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
	public boolean delByVo(CctvInstallVo vo) throws Exception {

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
	public CctvInstallVo add(CctvInstallVo vo) throws Exception {

		CctvInstallVo cctvInstallVo = mapper.add(vo);

		return cctvInstallVo;

	}

	/**
	 * 빅데이터를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean addExcel(ArrayList<CctvInstallVo> list) throws Exception {

		boolean result = false;
		int state = 0;
		for(int i=0; i<list.size(); i++){
			state += mapper.addExcel(list.get(i));
		}

		if(state > 0) result = true;

		return result;
	}

	/**
	 * 빅데이터를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(CctvInstallVo vo) throws Exception {

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
