package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.util.code.DateUtil;

/**
 * <pre>
 * 파일명 :  CrmsImageRqstService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 08.      이은규          최초 생성
 * 2019. 03. 27.	  이은규		  최종공문확인 변경 메소드 추가
 * 									  공문 수정 메소드 추가
 * 									  공문번호 수정 메소드 추가
 *
 * </pre>
 *
 * @since  : 2018. 10. 08.
 * @version : 1.0
 * @see
 */
@Service("crmsImageRqstService")
public class CrmsImageRqstService extends EgovAbstractServiceImpl{
    @Resource(name="crmsImageRqstMapper")
    private CrmsImageRqstMapper mapper;

    /**
     * 이미지 반출 목록 갯수를 리턴합니다.
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
	 * 이미지 반출 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsImageRqstVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsImageRqstVo> list = (ArrayList<CrmsImageRqstVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 이미지 반출 단건을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public CrmsImageRqstVo getItem(HashMap<String, String> map) throws Exception {

    	return mapper.getItem(map);


    }

    /**
     * 이미지 반출 목록을 조회합니다.
     *
     * @param map
     * @return list
     * @throws Exception
     */
    public ArrayList<CrmsImageVo> getImgList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsImageVo> list = (ArrayList<CrmsImageVo>) mapper.getImgList(map);

        return list;
    }

    /**
     * 이미지 반출 정보를 DB에 추가합니다.
     *
     * @param crmsPrevAviVo
     * @return boolean
     * @throws Exception
     */
    public boolean add(CrmsImageRqstVo crmsImageRqstVo) throws Exception {

        int result =  mapper.add(crmsImageRqstVo);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
     * 이미지 반출 정보를 수정합니다.
     *
     * @param crmsPrevRqstVo
     * @return boolean
     * @throws Exception
     */
    public boolean update(CrmsImageRqstVo crmsImageRqstVo) throws Exception {

        int result =  mapper.update(crmsImageRqstVo);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
     * 이미지 반출 건을 삭제합니다.
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

    /**
     * 이미지 반출 조인 정보를 DB에 추가합니다.
     *
     * @param crmsPrevAviVo
     * @return boolean
     * @throws Exception
     */
    public boolean addJoin(CrmsImageRqstVo crmsImageRqstVo) throws Exception {

        int result =  mapper.addJoin(crmsImageRqstVo);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
     * 이미지 반출 조인 건을 삭제합니다.
     *
     * @param map
     * @return boolean
     * @throws Exception
     */
    public boolean delJoin(HashMap<String, String> map) throws Exception {

        int result =  mapper.delJoin(map);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
     * 이미지 반출 신청 건의 처리상태를 수정합니다.
     *
     * @param map
     * @return boolean
     * @throws Exception
     */
    public boolean updateProcStatCd(HashMap<String, String> map) throws Exception {

        if(map.containsKey("acptUserId")) map.put("acptDat", DateUtil.getStrSec());

        int result =  mapper.updateProcStatCd(map);

        if(result >= 1){
            return true;
        }else{
            return false;
        }

    }

    /**
	 * 영상 신청 건의 공문번호를 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateDocNo(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateDocNo(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 영상 신청 건의 공문정보를 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateDocFileInfo(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateDocFileInfo(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 영상 신청 건의 최종공문확인값을 수정합니다.
	 *
	 * @param map
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateDocChngYn(HashMap<String, String> map) throws Exception {

        int result =  mapper.updateDocChngYn(map);

        if(result == 1){
			return true;
		}else{
			return false;
		}

    }

}
