package geomex.xeus.tvius.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.util.code.DateUtil;

/**
 * <pre>
 * 파일명 :  CrmsRqstRenewService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 11. 06.      이은규          최초 생성
 * 2017. 12. 06.	  이은규		  승인, 거절 파라미터 map으로 변경
 * 									  승인, 거절 시간 추가
 *
 * </pre>
 *
 * @since  : 2017. 11. 06.
 * @version : 1.0
 * @see
 */
@Service("crmsRqstRenewService")
public class CrmsRqstRenewService {

	@Resource(name="crmsRqstRenewMapper")
    private CrmsRqstRenewMapper mapper;

	/**
	 * 연장신청 목록 갯수를 리턴합니다.
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
	 * 연장신청 목록을 조회합니다.
	 * 엑셀목록을 조회할때도 사용됩니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsRqstRenewVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsRqstRenewVo> list = (ArrayList<CrmsRqstRenewVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 연장신청 단건을 조회합니다.
	 *
	 * @param map
	 * @return vo
	 * @throws Exception
	 */
    public CrmsRqstRenewVo getItem(HashMap<String, String> map) throws Exception {

        CrmsRqstRenewVo vo = mapper.getItem(map);

        return vo;
    }

    /**
	 * 연장신청 정보를 DB에 추가합니다.
	 *
	 * @param crmsRqstRenewVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean add(CrmsRqstRenewVo crmsRqstRenewVo) throws Exception {

    	crmsRqstRenewVo.setReqstDat(DateUtil.getStrSec());

        int result =  mapper.add(crmsRqstRenewVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 연장신청 정보를 수정합니다.
	 * 승인 시 사용됩니다.
	 *
	 * @param crmsRqstRenewVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateAcpt(HashMap<String, String> map) throws Exception {

    	map.put("acptDat", DateUtil.getStrSec());

        int result =  mapper.updateAcpt(map);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 연장신청 정보를 수정합니다.
	 * 거절 시 사용됩니다.
	 *
	 * @param crmsRqstRenewVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean updateRejt(HashMap<String, String> map) throws Exception {

    	map.put("acptDat", DateUtil.getStrSec());

        int result =  mapper.updateRejt(map);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 연장신청 건을 삭제합니다.
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
	 * 연장신청 건수 처리상태를 조회합니다.
	 * 처리상태 별 카운트가 리턴됩니다.
	 *
	 * @param map
	 * @return rst
	 * @throws Exception
	 */
    public HashMap<String, String> getStatCount(HashMap<String, String> map) {

    	HashMap<String, String> rst = mapper.getStatCount(map);

        return rst;

	}

}
