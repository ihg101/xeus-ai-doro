package geomex.xeus.user.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  UserService.java
 * 설  명 :
 *   사용자 Service
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017-05-31      이주영          최초 생성
 * 2019-04-01	   이은규		   서약서 수정 메소드 추가
 *
 * </pre>
 *
 * @since   :  2017. 5. 31.
 * @version :  1.0
 * @see
 */
@Service("userService")
public class UserService extends EgovAbstractServiceImpl {

	@Resource(name = "userMapper")
    private UserMapper mapper;

	/**
	 * 사용자 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<UserVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<UserVo> list = (ArrayList<UserVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 사용자 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public UserVo getItem(HashMap<String, String> map) throws Exception {

		UserVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 사용자ID 문자열을 통해 단건 조회합니다.
	 *
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	public UserVo getItem(String userId) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		map.put("userId", userId);

		UserVo vo = mapper.getItem(map);

		return vo;
	}

	public ArrayList<UserVo> getAgeStat(HashMap<String, String> map) throws Exception {

		ArrayList<UserVo> list = (ArrayList<UserVo>) mapper.getAgeStat(map);

		return list;
	}

	/**
	 * 특정 사용자를 삭제합니다. (현재 사용되지 않습니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@Deprecated
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(UserVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자 정보를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(UserVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자 그리드 정보를 수정합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean editBoardInfo(HashMap<String, String> map) throws Exception {

		int state = mapper.editBoardInfo(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자 비밀번호를 수정합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean editPassword(HashMap<String, String> map) throws Exception {

		int state = mapper.editPassword(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자 비밀번호를 수정합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean editPasswordAdmin(HashMap<String, String> map) throws Exception {

		int state = mapper.editPasswordAdmin(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자 비밀번호를 수정합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean editAuthAtmtCnt(HashMap<String, String> map) throws Exception {

		int state = mapper.editAuthAtmtCnt(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자 서약서를 수정합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean editPledge(HashMap<String, String> map) throws Exception {

		int state = mapper.editPledge(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 사용자 계정 수를 조회합니다.
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
