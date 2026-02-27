package gmx.gis.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.user.service.GMT_UserVo;

/**
 * <pre>
 * 파일명 :  GMT_AuthService.java
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
 * @since   :  2017. 6. 22.
 * @version :  1.0
 * @see
 */
@Service
public class GMT_AuthService extends EgovAbstractServiceImpl {

	@Autowired private GMT_AuthMapper mapper;


	/**
	 * 권한 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<GMT_AuthVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<GMT_AuthVo> list = (ArrayList<GMT_AuthVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 권한 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public GMT_AuthVo getItem(HashMap<String, String> map) throws Exception {

		GMT_AuthVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 권한 수를 조회합니다.
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
	 * 그룹 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<GMT_AuthGrpVo> getGrpList(HashMap<String, String> map) throws Exception {

		ArrayList<GMT_AuthGrpVo> list = (ArrayList<GMT_AuthGrpVo>) mapper.getGrpList(map);

		return list;
	}

	/**
	 * 그룹 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getGrpCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getGrpCount(map);

		return count;

	}

	/**
	 * 그룹 권한 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<GMT_AuthGrpVo> getAuthGrpList(HashMap<String, String> map) throws Exception {

		ArrayList<GMT_AuthGrpVo> list = (ArrayList<GMT_AuthGrpVo>) mapper.getAuthGrpList(map);

		return list;
	}

	/**
	 * 그룹 권한 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getAuthGrpCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getAuthGrpCount(map);

		return count;

	}

	/**
	 * 권한명을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean editGrp(GMT_AuthGrpVo vo) throws Exception {

		int state = mapper.editGrp(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 해당 그룹에 대응하는 레이어리스트를 삭제한다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean delAuthLayerList(HashMap<String, String> map) throws Exception {

		int state1 = mapper.delAuthLayerList(map);

		if(state1 == 1){
			return true;
		}else{
			return false;
		}

	}




	/**
	 * 그룹을 제거합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean delGrp(HashMap<String, String> map) throws Exception {

		int state1 = mapper.delGrp(map);
		int state2 = mapper.delGrpAuth(map);

		if(state1 == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 그룹 권한을 제거합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean delGrpAuth(HashMap<String, String> map) throws Exception {

		int state = mapper.delGrpAuth(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 그룹을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean addGrp(GMT_AuthGrpVo vo) throws Exception {

		int state = mapper.addGrp(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}
	/**
	 * 레이어권한을 추가합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean addAuthLayerList(HashMap<String, String> map) throws Exception {

		int state = mapper.addAuthLayerList(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 레이어권한을 여러개  추가합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean addAuthLayerListMultiple(List<HashMap<String, Object>> list) throws Exception {

		int state = mapper.addAuthLayerListMultiple(list);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}


	public boolean updateAuthLayerByTabAuth(HashMap<String, String> map) throws Exception {

		int state = mapper.updateAuthLayerByTabAuth(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 그룹 권한을 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean addGrpAuth(GMT_AuthGrpVo vo) throws Exception {

		int state = mapper.addGrpAuth(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * userId가 권한 mt_auth_list에 auth_data값에 해당하는 권한이 있는지 체크한다.
	 * @return
	 */
	public boolean hasAuth(HashMap<String, String> map)throws Exception{
	    int result = mapper.hasAuth(map);

	    return (result > 0);
	}

}
