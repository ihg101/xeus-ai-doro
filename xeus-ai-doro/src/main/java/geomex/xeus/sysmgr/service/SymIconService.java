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
 * 파일명 :  SymIconService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 06. 29.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 06. 29.
 * @version : 1.0
 * @see
 */
@Service("symIconService")
public class SymIconService extends EgovAbstractServiceImpl {

	@Resource(name = "symIconMapper")
    private SymIconMapper mapper;

	/**
	 * 심볼 아이콘 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<SymIconVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<SymIconVo>) mapper.getList(map);
	}

	/**
     * 심볼 아이콘 수를 조회합니다.
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
	 * 심볼 아이콘 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public SymIconVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
     * 심볼 삭제 내역의 사용 유무를 확인합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<SymIconVo> chkDelList(HashMap<String, List<String>> map) throws Exception {

        return (ArrayList<SymIconVo>) mapper.chkDelList(map);

    }

	/**
	 * 심볼 아이콘 여러건을 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		return (mapper.del(map) == 1);

	}

	/**
	 * 심볼 아이콘을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(SymIconVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 심볼 아이콘을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(SymIconVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

}
