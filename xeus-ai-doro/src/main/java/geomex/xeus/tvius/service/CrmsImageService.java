package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.util.code.DateUtil;

/**
 * <pre>
 * 파일명 :  CrmsImageService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 08.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 10. 08.
 * @version : 1.0
 * @see
 */
@Service("crmsImageService")
public class CrmsImageService extends EgovAbstractServiceImpl{
    @Resource(name="crmsImageMapper")
    private CrmsImageMapper mapper;

    /**
     * 이미지 목록 갯수를 리턴합니다.
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
	 * 이미지 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsImageVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsImageVo> list = (ArrayList<CrmsImageVo>) mapper.getList(map);

        return list;
    }

    /**
     * 이미지 정보를 DB에 추가합니다.
     *
     * @param crmsPrevAviVo
     * @return boolean
     * @throws Exception
     */
    public boolean add(CrmsImageVo crmsImageVo) throws Exception {

    	int result =  mapper.add(crmsImageVo);

    	if(result >= 1){
    		return true;
    	}else{
    		return false;
    	}

    }

    /**
     * 이미지 정보를 DB에 추가합니다.
     *
     * @param crmsPrevAviVo
     * @return boolean
     * @throws Exception
     */
    public CrmsImageVo addAndGetItem(CrmsImageVo crmsImageVo) throws Exception {

        return mapper.addAndGetItem(crmsImageVo);

    }

    /**
     * 이미지 정보를 수정합니다.
     *
     * @param crmsPrevRqstVo
     * @return boolean
     * @throws Exception
     */
    public boolean update(CrmsImageVo crmsImageVo) throws Exception {

        int result =  mapper.update(crmsImageVo);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
     * 이미지를 삭제합니다.
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
