package geomex.xeus.equipmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

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
 * 2019-01-30      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2019. 1. 30.
 * @version :  1.0
 * @see
 */
@Service("netwkThemeService")
public class NetwkThemeService extends EgovAbstractServiceImpl {

	@Resource(name = "netwkThemeMapper")
    private NetwkThemeMapper mapper;

	/**
	 * 네트워크 망 테마 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<NetwkThemeVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<NetwkThemeVo>) mapper.getList(map);
	}

	/**
	 * 네트워크 망 테마 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public NetwkThemeVo getItem(HashMap<String, String> map) throws Exception {

	    NetwkThemeVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 네트워크 망 테마를 삭제합니다.
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
	 * 네트워크 망 테마를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(NetwkThemeVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 네트워크 망을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(NetwkThemeVo vo) throws Exception {

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

}
