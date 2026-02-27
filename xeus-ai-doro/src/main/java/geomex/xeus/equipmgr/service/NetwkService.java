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
 * 파일명 :  EmrbellService.java
 * 설  명 :
 *   네트워크 망 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-09-13      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 9. 13.
 * @version :  1.0
 * @see
 */
@Service("netwkService")
public class NetwkService extends EgovAbstractServiceImpl {

	@Resource(name = "netwkMapper")
    private NetwkMapper mapper;

	/**
	 * 네트워크 망 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<NetwkVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<NetwkVo>) mapper.getList(map);
	}

	/**
	 * 케이블 주제도 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<NetwkVo> getNmsCableTheme(HashMap<String, String> map) throws Exception {

		return (ArrayList<NetwkVo>) mapper.getNmsCableTheme(map);
	}

	/**
	 * 케이블 주제도 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<NetwkVo> getFnmsCableTheme(HashMap<String, String> map) throws Exception {

		return (ArrayList<NetwkVo>) mapper.getFnmsCableTheme(map);
	}

	/**
	 * 네트워크 망 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public NetwkVo getItem(HashMap<String, String> map) throws Exception {

	    NetwkVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 네트워크 망을 삭제합니다.
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
	public boolean del(List<NetwkVo> list) throws Exception {

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
	 * 네트워크 망을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(NetwkVo vo) throws Exception {

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
	public boolean add(List<NetwkVo> list) throws Exception {

		boolean result = false;

		int add = 0;
		for(int i=0; i<list.size(); i++){
			add += mapper.add(list.get(i));
		}

		if(add > 0) result = true;

		return result;
	}

	/**
	 * 네트워크 망을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(NetwkVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 네트워크 망 수를 조회합니다.
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
	 * 네트워크 망 테마 색상을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean editThemeColor(NetwkVo vo) throws Exception {

		int state = mapper.editThemeColor(vo);

		if(state >= 1){
			return true;
		}else{
			return false;
		}

	}

}
