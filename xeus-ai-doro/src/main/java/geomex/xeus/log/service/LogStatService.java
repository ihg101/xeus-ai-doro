package geomex.xeus.log.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.tvius.service.CrmsTransAviVo;

/**
 * <pre>
 * 파일명 :  LogStatService.java
 * 설  명 :
 *   로그 통계 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-06-07      이은규          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 06. 07.
 * @version :  1.0
 * @see
 */
@Service("logStatService")
public class LogStatService extends EgovAbstractServiceImpl {

	@Resource(name = "logStatMapper")
    private LogStatMapper mapper;

	/**
	 * 112 로그 통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<LogStatVo> get112List(HashMap<String, String> map) throws Exception {

		return (ArrayList<LogStatVo>)mapper.get112List(map);
	}

	/**
     * 119 로그 통계 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<LogStatVo> get119List(HashMap<String, String> map) throws Exception {

        return (ArrayList<LogStatVo>)mapper.get119List(map);
    }

    /**
     * 사회적약자 로그 통계 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<LogStatVo> getDscList(HashMap<String, String> map) throws Exception {

        return (ArrayList<LogStatVo>)mapper.getDscList(map);
    }

    /**
     * 112 긴급출동지원 로그 통계 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<LogStatVo> getEs112List(HashMap<String, String> map) throws Exception {

        return (ArrayList<LogStatVo>)mapper.getEs112List(map);
    }

}
