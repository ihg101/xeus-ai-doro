package geomex.xeus.equipmgr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("patrolService")
public class PatrolService extends EgovAbstractServiceImpl {

	@Resource(name = "patrolMapper")
    private PatrolMapper mapper;

	/**
	 * 순찰모니터링 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<PatrolVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<PatrolVo>) mapper.getList(map);
	}

	/**
	 * 순찰모니터링 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public PatrolVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 순찰모니터링 단건을 조회합니다. (Vo 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public PatrolVo getItemByVo(PatrolVo vo) throws Exception {

		return mapper.getItemByVo(vo);
	}

	/**
	 * 순찰모니터링을 삭제합니다.
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
	 * 순찰모니터링 여러건을 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(List<PatrolVo> list) throws Exception {

		boolean result = false;

		int cnt = 0;
		for(int i=0; i<list.size(); i++){
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", list.get(i).getGid());
			cnt += mapper.del(map);
		}

		if(cnt > 0) result = true;

		return result;

	}

	/**
	 * 순찰모니터링을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(PatrolVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 순찰모니터링을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(PatrolVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 순찰모니터링 수를 조회합니다.
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
