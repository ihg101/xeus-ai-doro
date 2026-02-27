package geomex.xeus.tvius.carservice;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

/**
 * <pre>
 * 파일명 :  CrmsCarSchService.java
 * 설  명 :
 *   차량검색 관련 Service
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018. 10. 01.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2018. 10. 01.
 * @version : 1.0
 * @see
 */
@Service("crmsCarSchService")
public class CrmsCarSchService {
	@Resource(name="crmsCarSchMapper")
    private CrmsCarSchMapper mapper;

	/**
	 * 차량검색 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsCarSchVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsCarSchVo> list = (ArrayList<CrmsCarSchVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 차량검색 항목을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public CrmsCarSchVo getItem(HashMap<String, String> map) throws Exception {

        return mapper.getItem(map);
    }

    /**
     * 차량검색 목록 수를 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public int getCount(HashMap<String, String> map) throws Exception {

        return mapper.getCount(map);

    }

    /**
     * 차량검색 목록을 조회합니다.
     *
     * @param map
     * @return list
     * @throws Exception
     */
    public ArrayList<CrmsCarSchVo> getCarNoList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsCarSchVo> list = (ArrayList<CrmsCarSchVo>) mapper.getCarNoList(map);

        return list;
    }

}
