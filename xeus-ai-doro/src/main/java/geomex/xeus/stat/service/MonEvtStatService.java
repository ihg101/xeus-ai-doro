package geomex.xeus.stat.service;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import geomex.xeus.smartcity.service.EventHistVo;
import geomex.xeus.sysmgr.service.OrganizationMapper;

/**
 * <pre>
 * 파일명 :  MonEvtStatService.java
 * 설  명 :
 *   이벤트 모니터링 통계 서비스
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-11-02      최환주          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 10. 30.
 * @version :  1.0
 * @see
 */
@Service("monEvtStatService")
public class MonEvtStatService extends EgovAbstractServiceImpl {

	@Resource(name = "monEvtStatMapper")
    private MonEvtStatMapper mapper;

	@Resource(name = "organizationMapper")
    private OrganizationMapper orgz;

	/**
	 * 사용자 연별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getYearStat(map);
	}

	/**
	 * 사용자 월별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getMonthStat(map);
	}

	/**
	 * 사용자 일별 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getDayStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getOrgzYearStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getOrgzYearStat(map);
	}

	/**
	 * 사용자 기관별 월 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getOrgzMonthStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getOrgzMonthStat(map);
	}

	/**
	 * 사용자 기관별 일 접속통계 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getOrgzDayStat(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getOrgzDayStat(map);
	}

	public String getOrgzDayCnt(HashMap<String, String> map) throws Exception {

		return mapper.getOrgzDayCnt(map);
	}

	public ArrayList<String> getEvtList(HashMap<String, String> map) throws Exception {

		return (ArrayList<String>)mapper.getEvtList(map);
	}

	/**
	 * 이벤트명에 따른 통계를 조회합니다
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getEventStatByEvtNm(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getEventStatByEvtNm(map);
	}


	/**
	 * 지역에 따른 통계를 조회합니다
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getEventStatByEmdCd(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getEventStatByEmdCd(map);
	}


	/**
	 * 이벤트명에 따른 통계를 조회합니다
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getEventStatByEvtTypCdAndEvtNm(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getEventStatByEvtTypCdAndEvtNm(map);
	}


	/**
	 * 이벤트명에 따른 통계를 조회합니다
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<MonEvtStatVo> getEventStatByEvtTypCd(HashMap<String, String> map) throws Exception {

		return (ArrayList<MonEvtStatVo>)mapper.getEventStatByEvtTypCd(map);
	}


	/**
	 * 이벤트 목록을 조회합니다.
	 *
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public ArrayList<EventHistVo> getList(HashMap<String, String> map) throws Exception {

		ArrayList<EventHistVo> list = (ArrayList<EventHistVo>) mapper.getList(map);

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
	 * 이벤트 수를 조회합니다.
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
}
