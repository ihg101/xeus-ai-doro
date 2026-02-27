package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.user.service.UserVo;

/**
 * <pre>
 * 파일명 :  AuthService.java
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
@Service("authService")
public class AuthService extends EgovAbstractServiceImpl {

	@Resource(name = "authMapper")
	private AuthMapper mapper;

	/**
	 * 권한 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AuthVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<AuthVo> list = (ArrayList<AuthVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 권한 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public AuthVo getItem(HashMap<String, String> map) throws Exception {

		AuthVo vo = mapper.getItem(map);

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
	public ArrayList<AuthGrpVo> getGrpList(HashMap<String, String> map) throws Exception {

		ArrayList<AuthGrpVo> list = (ArrayList<AuthGrpVo>) mapper.getGrpList(map);

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
	public ArrayList<AuthGrpVo> getAuthGrpList(HashMap<String, String> map) throws Exception {

		ArrayList<AuthGrpVo> list = (ArrayList<AuthGrpVo>) mapper.getAuthGrpList(map);

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
	 *  해당 권한그룹에 대응하는 권한 리스트를 조회합니다
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<AuthGrpVo> getAuthListByAuthGrpNo(HashMap<String, String> map) throws Exception {

		ArrayList<AuthGrpVo> list = (ArrayList<AuthGrpVo>) mapper.getAuthListByAuthGrpNo(map);

		return list;
	}

	/**
	 * 권한명을 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean editGrp(AuthGrpVo vo) throws Exception {

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
	public boolean addGrp(AuthGrpVo vo) throws Exception {

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
	public boolean addGrpAuth(AuthGrpVo vo) throws Exception {

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
