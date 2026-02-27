package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.sysmgr.service.SymIconMapper;
import geomex.xeus.sysmgr.service.SymIconVo;

/**
 * <pre>
 * 파일명 :  DashbdService.java
 * 설  명 :
 *   대시보드 목록 Service
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 11. 06.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 11. 06.
 * @version : 1.0
 * @see
 */
@Service("dashbdService")
public class DashbdService extends EgovAbstractServiceImpl {

	@Resource(name = "dashbdMapper")
    private DashbdMapper mapper;

	/**
	 * 대시보드 목록 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<DashbdVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<DashbdVo>) mapper.getList(map);
	}

	/**
     * 대시보드 목록 수를 조회합니다.
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
	 * 대시보드 목록 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public DashbdVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
	 * 대시보드 목록 여러건을 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		return (mapper.del(map) == 1);

	}

	/**
	 * 대시보드 목록을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	//public DashbdVo add(DashbdVo vo) throws Exception {
	public DashbdVo add(DashbdVo vo) throws Exception {

		/*int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}*/

		mapper.add(vo);

		return vo;
	}

	/**
	 * 대시보드 목록을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(DashbdVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
     * 네트워크 장비 가동률을 리턴합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public float getNetwkOperatingRate(HashMap<String, String> map) throws Exception {

    	float rate = mapper.getNetwkOperatingRate(map);

        return rate;

    }

    /**
	 * 대시보드 목록 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public DashbdVo getEquipCnt(HashMap<String, String> map) throws Exception {

		return mapper.getEquipCnt(map);
	}

}
