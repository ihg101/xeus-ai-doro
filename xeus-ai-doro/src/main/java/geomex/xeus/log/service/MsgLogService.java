package geomex.xeus.log.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  MsgLogService.java
 * 설  명 :
 *   SMS 전송 로그 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-04-18      이은규          최초 생성
 * 2018-09-12      이은규          테이블 수정으로 인한 작업
 *
 * </pre>
 *
 * @since   :  2018. 04. 18.
 * @version :  1.0
 * @see
 */
@Service("msgLogService")
public class MsgLogService extends EgovAbstractServiceImpl {

	@Resource(name = "msgLogMapper")
    private MsgLogMapper mapper;

	/**
	 * SMS 전송 로그 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MsgLogVo> getList(HashMap<String, String> map) throws Exception {

		return (ArrayList<MsgLogVo>) mapper.getList(map);
	}

	/**
	 * SMS 전송 로그 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public MsgLogVo getItem(HashMap<String, String> map) throws Exception {

		return mapper.getItem(map);
	}

	/**
     * SMS 전송 로그 수를 조회합니다.
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
	 * SMS 전송 로그를 삭제합니다.
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
	 * SMS 전송 로그를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(MsgLogVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * SMS 전송 로그를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(MsgLogVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

}
