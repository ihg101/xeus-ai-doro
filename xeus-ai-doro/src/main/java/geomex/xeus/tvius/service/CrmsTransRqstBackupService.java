package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import geomex.xeus.equipmgr.service.CableVo;
import geomex.xeus.util.code.DateUtil;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsTransRqstPublicService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 07. 19.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2019. 07. 19.
 * @version : 1.0
 * @see
 */
@Service("crmsTransRqstBackupService")
public class CrmsTransRqstBackupService extends EgovAbstractServiceImpl{
    @Resource(name="crmsTransRqstBackupMapper")
    private CrmsTransRqstBackupMapper mapper;

    /**
	 * 영상 신청 백업 목록 갯수를 리턴합니다.
	 *
	 * @param map
	 * @return cnt
	 * @throws Exception
	 */
    public int getCount(HashMap<String, String> map) throws Exception {

        int cnt =  mapper.getCount(map);

        return cnt;
    }

    /**
	 * 영상 신청 백업 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsTransRqstVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsTransRqstVo> list = (ArrayList<CrmsTransRqstVo>) mapper.getList(map);

        return list;
    }

}
