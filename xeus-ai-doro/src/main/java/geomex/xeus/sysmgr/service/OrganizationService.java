package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  OrganizationService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 7. 7.
 * @version :  1.0
 * @see
 */
@Service("organizationService")
public class OrganizationService extends EgovAbstractServiceImpl {

	@Resource(name = "organizationMapper")
    private OrganizationMapper mapper;

	/**
	 * 소속 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<OrganizationVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<OrganizationVo> list = (ArrayList<OrganizationVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 소속 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<String> getSameAuthGrpList(HashMap<String, String> map) throws Exception {

		ArrayList<String> list = (ArrayList<String>) mapper.getSameAuthGrpList(map);

		return list;
	}

	/**
	 * 소속 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public OrganizationVo getItem(HashMap<String, String> map) throws Exception {

		OrganizationVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 소속을 삭제합니다.
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
	 * 소속을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(OrganizationVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 소속을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(OrganizationVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 소속 수를 조회합니다.
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
