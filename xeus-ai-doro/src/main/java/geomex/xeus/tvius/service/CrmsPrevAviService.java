package geomex.xeus.tvius.service;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * <pre>
 * 파일명 :  CrmsPrevAviService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 27.      이은규          최초 생성
 *
 * </pre>
 *
 * @since  : 2017. 10. 27.
 * @version : 1.0
 * @see
 */
@Service("crmsPrevAviService")
public class CrmsPrevAviService {

	@Resource(name="crmsPrevAviMapper")
    private CrmsPrevAviMapper mapper;

    /**
	 * 미리보기 AVI 목록 갯수를 리턴합니다.
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
	 * 미리보기 AVI 목록을 조회합니다.
	 *
	 * @param map
	 * @return list
	 * @throws Exception
	 */
    public ArrayList<CrmsPrevAviVo> getList(HashMap<String, String> map) throws Exception {

        ArrayList<CrmsPrevAviVo> list = (ArrayList<CrmsPrevAviVo>) mapper.getList(map);

        return list;
    }

    /**
	 * 미리보기 AVI 정보를 DB에 추가합니다.
	 *
	 * @param crmsPrevAviVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean add(CrmsPrevAviVo crmsPrevAviVo) throws Exception {

        int result =  mapper.add(crmsPrevAviVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 미리보기 AVI 정보를 수정합니다.
	 *
	 * @param crmsPrevRqstVo
	 * @return boolean
	 * @throws Exception
	 */
    public boolean update(CrmsPrevAviVo crmsPrevAviVo) throws Exception {

        int result =  mapper.update(crmsPrevAviVo);

        if(result >= 1){
			return true;
		}else{
			return false;
		}

    }

    /**
	 * 미리보기 AVI를 삭제합니다.
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
