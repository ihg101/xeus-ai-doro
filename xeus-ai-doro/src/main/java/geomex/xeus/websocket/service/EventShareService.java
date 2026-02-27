package geomex.xeus.websocket.service;

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
@Service("eventShareService")
public class EventShareService extends EgovAbstractServiceImpl {

	@Resource(name = "eventShareMapper")
    private EventShareMapper mapper;

	/**
	 * 사용자 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EventShareVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<EventShareVo> list = (ArrayList<EventShareVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 사용자 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public EventShareVo getItem(HashMap<String, String> map) throws Exception {

		EventShareVo vo = mapper.getItem(map);

		return vo;
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
	public boolean add(EventShareVo vo) throws Exception {

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
	public boolean edit(EventShareVo vo) throws Exception {

		int state = mapper.edit(vo);

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
