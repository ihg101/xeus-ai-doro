package geomex.xeus.smartcity.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.itextpdf.text.log.SysoCounter;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.util.code.ServiceUtil;

/**
 * <pre>
 * 파일명 :  CodeService.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-02-01      홍길동          최초 생성
 *
 * </pre>
 *
 * @since   :  2017. 7. 7.
 * @version :  1.0
 * @see
 */
@Service("eventHistService")
public class EventHistService extends EgovAbstractServiceImpl {
	
	@Resource(name = "eventHistMapper")
	private EventHistMapper mapper;

	/**
     * 이벤트 유형을 조회합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
	public ArrayList<EventHistVo> getSortList() throws Exception {    
        return mapper.getSortList();
    }
	
	/**
	 * 이벤트 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EventHistVo> getList(HashMap<String, String> map) throws Exception {

	    map = ServiceUtil.addUserInfo(map);
		ArrayList<EventHistVo> list = (ArrayList<EventHistVo>) mapper.getList(map);

		return list;
	}

	/**
	 * 이벤트 타입 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EventHistVo> getEventTypeList(HashMap<String, String> map) throws Exception {

		ArrayList<EventHistVo> list = (ArrayList<EventHistVo>) mapper.getEventTypeList(map);

		return list;
	}

	/**
	 * 이벤트 단건을 조회합니다. (여러가지 조건을 사용합니다.)
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public EventHistVo getItem(HashMap<String, String> map) throws Exception {

		EventHistVo vo = mapper.getItem(map);

		return vo;
	}

	/**
	 * 이벤트 타입 리스트를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EventHistVo> getDistinctEvtTypCd(HashMap<String, String> map) throws Exception {

		ArrayList<EventHistVo> list = mapper.getDistinctEvtTypCd(map);

		return list;
	}

	/**
	 * 이벤트를 삭제합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public boolean del(HashMap<String, String> map) throws Exception {

		int state = mapper.del(map);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이벤트를 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean add(EventHistVo vo) throws Exception {
		int state = mapper.add(vo);
		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이벤트를 수정합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public boolean edit(EventHistVo vo) throws Exception {

		int state = mapper.edit(vo);

		if(state > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * 이벤트 수를 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int getCount(HashMap<String, String> map) throws Exception {
		map = ServiceUtil.addUserInfo(map);
		int count = mapper.getCount(map);

		return count;

	}

	/**
	 * 이벤트 삭제 후 추가합니다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean addTransaction(EventHistVo vo) throws Exception {

		boolean result = false;

		int del = mapper.delVo(vo);
		int add = mapper.add(vo);

		if((del + add) > 0) result = true;

		return result;
	}

	/**
     * 이벤트 통계 데이터를 리턴합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<HashMap<String, String>> getStatByType(HashMap<String, String> map) throws Exception {

        return (ArrayList<HashMap<String, String>>) mapper.getStatByType(map);
    }

    /**
     * 당일 시간대별 이벤트 발생 수를 리턴합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public HashMap<String, String> getTodayEvtByTime(HashMap<String, String> map) throws Exception {

        return mapper.getTodayEvtByTime(map);
    }

    /**
     * CCTV 목적별 갯수를 리턴합니다.
     *
     * @param map
     * @return
     * @throws Exception
     */
    public ArrayList<EventHistVo> getCntOfEvtNm(HashMap<String, String> map) throws Exception {

        return mapper.getCntOfEvtNm(map);
    }


}
