package geomex.xeus.smartcity.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 *
 * <pre>
 * WASS Service
 * </pre>
 *
 * @author 이주영
 *
 */
@Service
public class WassService extends EgovAbstractServiceImpl {

	@Autowired private WassMapper mapper;

	/**
	 * 이벤트 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<WassVo> getList(HashMap<String, Object> map) throws Exception {

		ArrayList<WassVo> list = (ArrayList<WassVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 이벤트 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public WassVo getItem(HashMap<String, Object> map) throws Exception {

		WassVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 이벤트를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, Object> map) throws Exception {

		int state = mapper.del(map);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이벤트를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(WassVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이벤트를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(WassVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이벤트 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, Object> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

}
