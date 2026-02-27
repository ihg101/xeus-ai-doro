package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

/**
 * <pre>
 * 파일명 :  CrmsStatService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 12. 07.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 12. 07.
 * @version : 1.0
 * @see
 */
@Service("crmsStatService")
public class CrmsStatService {
	@Resource(name="crmsStatMapper")
    private CrmsStatMapper mapper;

	/**
	 * CCTV 활용 현황 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsStatVo> getListUse(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>) mapper.getListUse(map);

        return list;
    }

    /**
	 * 사건해결 기여율 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsStatVo> getListSolve(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>) mapper.getListSolve(map);

        return list;
    }

    /**
	 * 범죄유형별 신청현황 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsStatVo> getListCrime(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>) mapper.getListCrime(map);

        return list;
    }

    /**
	 * 미사용사유별 현황 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsStatVo> getListNoUse(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>) mapper.getListNoUse(map);

        return list;
    }

    /*
     * 영상반출 CCTV별 반출건수 통계목록을 조회합니다.
     *
     * @param map
     * @return list
     * @throws Exception
     */
    public ArrayList<CrmsStatVo> getListView(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>) mapper.getListView(map);

        return list;
    }

    /*
     * 기관별 CCTV별 반출건수 통계목록을 조회합니다.
     *
     * @param map
     * @return list
     * @throws Exception
     */
    public ArrayList<CrmsStatVo> getListOrg(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsStatVo> list = (ArrayList<CrmsStatVo>) mapper.getListOrg(map);

        return list;
    }

}
