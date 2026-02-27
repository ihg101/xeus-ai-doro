package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsOfficialDocService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 12. 17.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 12. 17.
 * @version : 1.0
 * @see
 */
@Service("crmsOfficialDocService")
public class CrmsOfficialDocService extends EgovAbstractServiceImpl{
    @Resource(name="crmsOfficialDocMapper")
    private CrmsOfficialDocMapper mapper;

    /**
	 * 공문이미지 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsOfficialDocVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsOfficialDocVo> list = (ArrayList<CrmsOfficialDocVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 공문이미지 단건을 조회합니다.
	 *
	 * @param map
	 * @return vo
	 * @throws Exception
	 */
    public CrmsOfficialDocVo getItem(HashMap<String, String> map) throws Exception {

    	CrmsOfficialDocVo vo = mapper.getItem(map);

        return vo;
    }

    /**
     * 공문이미지 목록 갯수를 리턴합니다.
     *
     * @param map
     * @return cnt
     * @throws Exception
     */
    public int getCount(HashMap<String, String> map) throws Exception {

        int cnt = mapper.getCount(map);

        return cnt;
    }

    /**
     * 공문이미지를 삭제합니다.
     *
     * @param map
     * @return boolean
     * @throws Exception
     */
    public boolean del(HashMap<String, String> map) throws Exception {

        int result =  mapper.del(map);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

}
