package gmx.gis.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.user.service.GMT_UserVo;

/**
 * <pre>
 * 파일명 :  GMT_AuthLogService.java
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
@Service
public class GMT_AuthLogService extends EgovAbstractServiceImpl {

	@Autowired private GMT_AuthLogMapper mapper;

    /**
     * 권한 로그 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<GMT_AuthLogVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<GMT_AuthLogVo> list = (ArrayList<GMT_AuthLogVo>) mapper.getList(map);

        return list;
    }

    /**
     * 권한 로그 단건을 조회합니다. (여러가지 조건을 사용합니다.)
     *
     * @param map
     * @return
     * @throws Exception
     */
    public GMT_AuthLogVo getItem(HashMap<String, String> map) throws Exception {

        GMT_AuthLogVo vo = mapper.getItem(map);

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
    public boolean add(GMT_AuthLogVo vo) throws Exception {

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
    public boolean edit(GMT_AuthLogVo vo) throws Exception {

        int state = mapper.edit(vo);

        if(state == 1){
            return true;
        }else{
            return false;
        }

    }

}
