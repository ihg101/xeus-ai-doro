package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsTransAviService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 18.      이은규          최초 생성
 * 2017. 12. 04.	  이은규		  관리자 DRM 수정용 기능 추가
 *
 * </pre>
 *
 * @since  : 2017. 10. 16.
 * @version : 1.0
 * @see
 */
@Service("crmsTransAviService")
public class CrmsTransAviService extends EgovAbstractServiceImpl{
    @Resource(name="crmsTransAviMapper")
    private CrmsTransAviMapper mapper;

    /**
	 * AVI 목록 갯수를 리턴합니다.
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
	 * AVI 목록을 조회합니다.
	 * 엑셀 조회 및 한 개의 신청 건수를 조회할때도 사용됩니다.????????
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsTransAviVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 관리대장 목록 갯수를 리턴합니다.
	 *
	 * @param map
	 * @return cnt
	 * @throws Exception
	 */
    public int getPrintCount(HashMap<String, String> map) throws Exception {

        int cnt = mapper.getPrintCount(map);

        return cnt;
    }

    /**
	 * 관리대장 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsTransAviVo> getPrintList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>) mapper.getPrintList(map);

        return list;
    }

    /**
	 * 재생만료현황 목록 갯수를 리턴합니다.
	 *
	 * @param map
	 * @return cnt
	 * @throws Exception
	 */
    public int getExpDatCount(HashMap<String, String> map) throws Exception {

        int cnt = mapper.getExpDatCount(map);

        return cnt;
    }

    /**
	 * 재생만료현황 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsTransAviVo> getExpDatList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransAviVo> list = (ArrayList<CrmsTransAviVo>) mapper.getExpDatList(map);

        return list;
    }

    /**
	 * AVI 정보를 DB에 추가합니다.
	 *
	 * @param crmsTransAviVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean add(CrmsTransAviVo crmsTransAviVo) throws Exception {

        int result =  mapper.add(crmsTransAviVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * AVI 정보를 수정합니다.
	 *
	 * @param crmsTransRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean update(CrmsTransAviVo crmsTransAviVo) throws Exception {

        int result =  mapper.update(crmsTransAviVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * AVI 정보를 수정합니다.
	 *
	 * @param crmsTransRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean editDrm(CrmsTransAviVo crmsTransAviVo) throws Exception {

    	int result =  mapper.editDrm(crmsTransAviVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * AVI를 삭제합니다.
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

    public boolean editAviInfo(HashMap<String, String> map) throws Exception {

        int result =  mapper.editAviInfo(map);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

}
