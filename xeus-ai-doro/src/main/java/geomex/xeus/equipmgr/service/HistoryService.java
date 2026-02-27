package geomex.xeus.equipmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  IpService.java
 * 설  명 :
 *   상태 관리 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-06-16      이주영          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 6. 15.
 * @version :  1.0
 * @see
 */
@Service("historyService")
public class HistoryService extends EgovAbstractServiceImpl {

	@Resource(name = "historyMapper")
    private HistoryMapper mapper;

	/**
	 * 점검이력 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<HistoryVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<HistoryVo> list = (ArrayList<HistoryVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 점검이력의 명칭 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<HistoryVo> getChkNmList() throws Exception {

		ArrayList<HistoryVo> list = (ArrayList<HistoryVo>) mapper.getChkNmList();

		return list;
	}

	/**
	 * 점검이력 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public HistoryVo getItem(HashMap<String, String> map) throws Exception {

		HistoryVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 점검이력을 삭제합니다.
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
	 * 점검이력을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(HistoryVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 점검이력을 추가합니다.
	 *
	 * @param list
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean addTransaction(ArrayList<HistoryVo> list, HashMap<String, String> map) throws Exception {

		boolean result = false;

		if("edit".equals(map.get("mode"))){
			mapper.del(map);
		}
		int add = 0;

		for(int i=0; i<list.size(); i++){
			add += mapper.add(list.get(i));
		}

		//if(del > 0 && add > 0) result = true;
		if(add > 0) result = true;

		return result;
	}

	/**
	 * 점검이력을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(HistoryVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 점검이력 수를 조회합니다.
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
