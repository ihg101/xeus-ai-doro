package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("smsService")
public class SmsService extends EgovAbstractServiceImpl {

	@Resource(name = "smsMapper")
    private SmsMapper mapper;

	/**
	 * SMS 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<SmsTempVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<SmsTempVo> list = (ArrayList<SmsTempVo>) mapper.getList(map);

		return list;
	}

	/**
	 * SMS 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public SmsTempVo getItem(HashMap<String, String> map) throws Exception {

		SmsTempVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * SMS를 삭제합니다.
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
     * SMS를 rcv_id로 삭제합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public boolean delByID(HashMap<String, String> map) throws Exception {

        int state = mapper.delByID(map);

        if(state == 1){
            return true;
        }else{
            return false;
        }

    }

	/**
	 * SMS를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(SmsTempVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * SMS를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(SmsTempVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * SMS 수를 조회합니다.
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