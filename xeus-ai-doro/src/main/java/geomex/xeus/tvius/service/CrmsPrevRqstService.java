package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import geomex.xeus.util.code.DateUtil;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsPrevRqstService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 26.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 10. 26.
 * @version : 1.0
 * @see
 */
@Service("crmsPrevRqstService")
public class CrmsPrevRqstService {

	@Resource(name="crmsPrevRqstMapper")
    private CrmsPrevRqstMapper mapper;

	/**
	 * 미리보기 신청 목록 갯수를 리턴합니다.
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
	 * 미리보기 신청 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsPrevRqstVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsPrevRqstVo> list = (ArrayList<CrmsPrevRqstVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 미리보기 신청 건수를 DB에 추가합니다.
	 * 신청일, 처리상태가 Vo에 추가됩니다.
	 *
	 * @param crmsPrevRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean add(CrmsPrevRqstVo crmsPrevRqstVo) throws Exception {

    	crmsPrevRqstVo.setReqstDat(DateUtil.getStrSec());
    	crmsPrevRqstVo.setProcStatCd("SA");

        int result =  mapper.add(crmsPrevRqstVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 기존 미리보기 신청 정보를 수정합니다.
	 *
	 * @param crmsPrevRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean update(CrmsPrevRqstVo crmsPrevRqstVo) throws Exception {

        int result =  mapper.update(crmsPrevRqstVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 미리보기 신청 정보를 삭제합니다.
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
