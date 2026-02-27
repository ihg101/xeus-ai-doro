package geomex.xeus.sysmgr.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import geomex.xeus.util.code.ServiceUtil;

/**
 * <pre>
 * 파일명 :  SysPropService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2017. 10. 26.      이은규          최초 생성
 * 2019. 08. 06.	  이은규		  tvius >> sysmgr 패키지로 이동.
 *
 * </pre>
 *
 * @since  : 2017. 10. 26.
 * @version : 1.0
 * @see
 */
@Service("sysPropService")
public class SysPropService {

	@Resource(name="sysPropMapper")
    private SysPropMapper mapper;

	/**
	 * 영상반출 환경설정 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<SysPropVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<SysPropVo> list = (ArrayList<SysPropVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 영상반출 환경설정 코드 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 * getList로 대체 가능할 것으로 보아 보류
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	/*public SysPropVo getItem(HashMap<String, String> map) throws Exception {

		SysPropVo vo = mapper.getItem(map);

		return vo;
	}*/

	/**
	 * 영상반출 환경설정 코드를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 영상반출 환경설정 코드를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(SysPropVo vo) throws Exception {

		int state = mapper.add(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 영상반출 환경설정 코드를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(SysPropVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state == 1){
			return true;
		}else{
			return false;
		}

	}

	/**
     * 영상반출 환경설정 코드를 수정합니다.
     *
     * @param vo
     * @return
     * @throws Exception
     */
    public boolean editSysParam(SysPropVo vo) throws Exception {
    	HashMap<String, Object> newMap = new HashMap<String, Object>();
      
    	newMap.put("VO", vo);
      	newMap.put("map", ServiceUtil.convertVoToMap(vo));
      	int state = mapper.editSysParam(newMap );

        if(state >= 1){
            return true;
        }else{
            return false;
        }

    }

	/**
	 * 영상반출 환경설정 코드 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {

		int count = mapper.getCount(map);

		return count;

	}

}
