package geomex.xeus.tvius.service;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsCctvStatService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 22.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 10. 22.
 * @version : 1.0
 * @see
 */
@Service("crmsCctvStatService")
public class CrmsCctvStatService extends EgovAbstractServiceImpl{
    @Resource(name="crmsCctvStatMapper")
    private CrmsCctvStatMapper mapper;

    /**
	 * 상태체크 목록 갯수를 리턴합니다.
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
	 * 상태체크 목록을 조회합니다.
	 * 엑셀 조회 및 한 개의 신청 건수를 조회할때도 사용됩니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsCctvStatVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsCctvStatVo> list = (ArrayList<CrmsCctvStatVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 상태체크 정보를 DB에 추가합니다.
	 *
	 * @param crmsTransAviVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean add(CrmsCctvStatVo crmsCctvStatVo) throws Exception {

        int result =  mapper.add(crmsCctvStatVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 상태체크 정보를 수정합니다.
	 *
	 * @param crmsTransRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean update(CrmsCctvStatVo crmsCctvStatVo) throws Exception {

        int result =  mapper.update(crmsCctvStatVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 상태체크 건을 삭제합니다.
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
