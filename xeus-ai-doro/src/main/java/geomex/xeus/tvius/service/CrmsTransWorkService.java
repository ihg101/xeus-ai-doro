package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsTransWorkService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 06. 18.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 06. 18.
 * @version : 1.0
 * @see
 */
@Service("crmsTransWorkService")
public class CrmsTransWorkService extends EgovAbstractServiceImpl{
    @Resource(name="crmsTransWorkMapper")
    private CrmsTransWorkMapper mapper;

    /**
	 * Work 목록 갯수를 리턴합니다.
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
	 * Work 목록을 조회합니다.
	 * 엑셀 조회 및 한 개의 신청 건수를 조회할때도 사용됩니다.????????
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsTransWorkVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransWorkVo> list = (ArrayList<CrmsTransWorkVo>) mapper.getList(map);

        return list;
    }

    /**
     * Work 단건을 조회합니다. (해시코드 조회 용도로 사용됩니다.)
     *
     * @param map
     * @return
     * @throws Exception
     */
    public CrmsTransWorkVo getItem(HashMap<String, String> map) throws Exception {

        return mapper.getItem(map);
    }



    /**
	 * crms_trans_rqst와 조인해서 Work 목록을 조회합니다.
	 *
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsTransWorkVo> getDelListByUseRsCd(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransWorkVo> list = (ArrayList<CrmsTransWorkVo>) mapper.getDelListByUseRsCd(map);

        return list;
    }

    /**
	 * Work 정보를 DB에 추가합니다.
	 *
	 * @param crmsTransWorkVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean add(CrmsTransWorkVo crmsTransWorkVo) throws Exception {

        int result =  mapper.add(crmsTransWorkVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * Work 정보를 수정합니다.
	 *
	 * @param crmsTransRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean update(CrmsTransWorkVo crmsTransWorkVo) throws Exception {

        int result =  mapper.edit(crmsTransWorkVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * Work를 삭제합니다.
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

    public boolean editWorkInfo(HashMap<String, String> map) throws Exception {

        int result =  mapper.editWorkInfo(map);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

}
