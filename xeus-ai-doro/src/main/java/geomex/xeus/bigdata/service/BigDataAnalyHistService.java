package geomex.xeus.bigdata.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 수정이력
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2019.01.07      김경호          설계 변경
 * ===========================================================
 * </pre>
 */

@Service("bigDataAnalyHistService")
public class BigDataAnalyHistService extends EgovAbstractServiceImpl {

    @Resource(name = "bigDataAnalyHistMapper")
    private BigDataAnalyHistMapper mapper;

    /**
     * 빅데이터 결과 수를 조회합니다.
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
     * 빅데이터 결과 목록을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<BigDataAnalyHistVo> getList(HashMap<String, String> map) throws Exception {
        return (ArrayList<BigDataAnalyHistVo>) mapper.getList(map);
    }

    /**
     * 빅데이터 결과 단건을 조회합니다. (여러가지 조건을 사용합니다.)
     *
     * @param map
     * @return
     * @throws Exception
     */
    public BigDataAnalyHistVo getItem(HashMap<String, String> map) throws Exception {
        return mapper.getItem(map);
    }

    /**
     * 빅데이터를 결과를 목록을 삭제합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public boolean del(HashMap<String, String> map) throws Exception {
        int state = mapper.del(map);
        if (state == 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 빅데이터 결과 목록을 추가합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    public boolean add(BigDataAnalyHistVo vo) throws Exception {
        int state = mapper.add(vo);
        if (state == 1) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * 빅데이터를 결과 목록을 수정합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    public boolean edit(BigDataAnalyHistVo vo) throws Exception {
        int state = mapper.edit(vo);
        if (state == 1) {
            return true;
        } else {
            return false;
        }
    }

}
