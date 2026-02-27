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
 * 파일명 :  AuthLogService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-10-17      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 10. 17.
 * @version :  1.0
 * @see
 */
@Service("authLogService")
public class AuthLogService extends EgovAbstractServiceImpl {

	@Resource(name = "authLogMapper")
	private AuthLogMapper mapper;

    /**
     * 권한 로그 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<AuthLogVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<AuthLogVo> list = (ArrayList<AuthLogVo>) mapper.getList(map);

        return list;
    }

    /**
     * 권한 로그 단건을 조회합니다. (여러가지 조건을 사용합니다.)
     *
     * @param map
     * @return
     * @throws Exception
     */
    public AuthLogVo getItem(HashMap<String, String> map) throws Exception {

        AuthLogVo vo = mapper.getItem(map);

        return vo;
    }

    /**
     * 권한 로그 수를 조회합니다.
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
     * 권한 로그를 삭제합니다.
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
     * 권한 로그를 추가합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    public boolean add(AuthLogVo vo) throws Exception {

        int state = mapper.add(vo);

        if(state == 1){
            return true;
        }else{
            return false;
        }

    }

    /**
     * 권한 로그를 수정합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    public boolean edit(AuthLogVo vo) throws Exception {

        int state = mapper.edit(vo);

        if(state == 1){
            return true;
        }else{
            return false;
        }

    }

}
