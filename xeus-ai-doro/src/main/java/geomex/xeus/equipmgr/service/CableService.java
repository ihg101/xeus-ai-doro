package geomex.xeus.equipmgr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  IpService.java
 * 설  명 :
 *   케이블 관리 서비스
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
@Service("cableService")
public class CableService extends EgovAbstractServiceImpl {

	@Resource(name = "cableMapper")
    private CableMapper mapper;

	/**
	 * 케이블 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CableVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<CableVo>) mapper.getList(map);
	}

	/**
	 * 케이블 주제도 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<CableVo> getCableTheme(HashMap<String, String> map) throws Exception {

		return (ArrayList<CableVo>) mapper.getCableTheme(map);
	}

	/**
	 * 케이블 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public CableVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 케이블을 삭제합니다.
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
	 * 케이블 여러건을 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(List<CableVo> list) throws Exception {

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
	 * 케이블을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(CableVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 케이블 여러건을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean add(List<CableVo> list) throws Exception {

		boolean result = false;

		int add = 0;
		for(int i=0; i<list.size(); i++){
			add += mapper.add(list.get(i));
		}

		if(add > 0) result = true;

		return result;
	}

	/**
	 * 케이블을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(CableVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 케이블 수를 조회합니다.
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
